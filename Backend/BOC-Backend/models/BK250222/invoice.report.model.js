const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var async = require('async');

const InvoiceReportsModel = function (obj) {

    this.InvoiceDate = obj.InvoiceDate ? obj.InvoiceDate : '';
    this.InvoiceDateTo = obj.InvoiceDateTo ? obj.InvoiceDateTo : '';
    this.DueDate = obj.DueDate ? obj.DueDate : '';
    this.DueDateTo = obj.DueDateTo ? obj.DueDateTo : '';
    this.Created = obj.Created ? obj.Created : '';
    this.CreatedTo = obj.CreatedTo ? obj.CreatedTo : '';
    this.CustomerId = obj.CustomerId ? obj.CustomerId : '';
    this.PartId = obj.PartId ? obj.PartId : '';
    this.InvoiceType = obj.InvoiceType ? obj.InvoiceType : 0;
    this.Status = obj.Status ? obj.Status : 0;
    this.IncludeRR = obj.IncludeRR ? obj.IncludeRR : 100;
    this.InvoiceReports = obj.InvoiceReports ? obj.InvoiceReports : '';
    this.Month = obj.Month ? obj.Month : '';
    this.Year = obj.Year ? obj.Year : '';
    this.MROId = obj.MROId ? obj.MROId : 0;

    this.start = obj.start ? obj.start : 0;
    this.length = obj.length ? obj.length : 0;
    this.search = obj.search ? obj.search : '';
    this.sortCol = obj.sortCol ? obj.sortCol : '';
    this.sortDir = obj.sortDir ? obj.sortDir : '';
    this.sortColName = obj.sortColName ? obj.sortColName : '';
    this.order = obj.order ? obj.order : '';
    this.columns = obj.columns ? obj.columns : '';
    this.draw = obj.draw ? obj.draw : 0;
};



InvoiceReportsModel.InvoiceByMonth = (obj, result) => {
    var selectquery = `
    SELECT   YEAR(i.InvoiceDate) Year,'-' as Status,'-' as InvoiceType,MONTHNAME(i.InvoiceDate) as Month ,
    CONCAT('$',' ',ROUND(ifnull(sum(i.GrandTotal),0),2)) as Price,
    CONCAT('$',' ',ROUND(ifnull(sum(p.GrandTotal),0),2)) as Cost,
    CONCAT('$',' ',ROUND((ROUND(ifnull(sum(i.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(i.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(i.GrandTotal),0),2),' ','%') Margin,
    '-' as CustomerId,'-' as PartId,
    '-' as InvoiceDate,'-' as InvoiceDateTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;

    var query = `  From tbl_invoice i
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0  AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED} 
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0   AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0  
    where i.IsDeleted=0  `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }

    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "Year":
                    query += " and YEAR(i.InvoiceDate) = '" + obj.columns[cvalue].search.value + "'  ";
                    break;
                case "IncludeRR":
                    if (obj.columns[cvalue].search.value == 1) { //RR Invoice
                        query += ' and i.RRId > 0 AND i.MROId = 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 3) { //QT Invoice
                        query += ' and i.RRId = 0 and i.MROId = 0  ';
                    }
                    break;
                case "InvoiceDate":
                    query += " and ( i.InvoiceDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "InvoiceDateTo":
                    query += " and ( i.InvoiceDate <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDate":
                    query += " and ( i.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDateTo":
                    query += " and ( i.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Created":
                    query += " and ( i.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CreatedTo":
                    query += " and ( i.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerId":
                    query += " and i.CustomerId In (" + obj.columns[cvalue].search.value + ")  ";
                    break;
                case "PartId":
                    query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }
    query += ` GROUP BY YEAR(i.InvoiceDate),MONTH(i.InvoiceDate),MONTHNAME(i.InvoiceDate) `;

    var Countquery = ` Select count(Counts) as recordsFiltered from (Select count(MONTHNAME(i.InvoiceDate)) Counts ` + query + ` ) as A `;
    var i = 0;
    if (obj.order.length > 0) {
        query += " ORDER BY ";

        for (i = 0; i < obj.order.length; i++) {
            if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
            {
                switch (obj.columns[obj.order[i].column].name) {
                    case "Year":
                        query += " MONTH(i.InvoiceDate) " + obj.order[i].dir + " ";
                        break;
                    case "Month":
                        query += " MONTH(i.InvoiceDate) " + obj.order[i].dir + " ";
                        break;
                    case "TotalAmount":
                        query += " ROUND(sum(i.GrandTotal)) " + obj.order[i].dir + " ";
                        break;
                    case "CustomerId":
                        query += " i.CustomerId " + obj.order[i].dir + " ";
                        break;
                    default:
                        query += " MONTH(i.InvoiceDate) " + obj.order[i].dir + " ";
                }
            }
        }
    } else {
        query += " ORDER BY MONTH(i.InvoiceDate) DESC ";
    }

    query = selectquery + query;

    var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(MONTHNAME(i.InvoiceDate)) as Counts 
    From tbl_invoice i    
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0  AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0    
    where i.IsDeleted=0  `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        TotalCountQuery += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    TotalCountQuery += ` GROUP BY YEAR(i.InvoiceDate),MONTH(i.InvoiceDate),MONTHNAME(i.InvoiceDate)) as A `;
    var sqlArray = []; var obj = {};
    obj.query = query;
    obj.Countquery = Countquery;
    obj.TotalCountQuery = TotalCountQuery;

    sqlArray.push(obj);

    //console.log("query = " + obj.query);
    //console.log("Countquery = " + obj.Countquery);
    //console.log("TotalCountQuery = " + obj.TotalCountQuery);
    return sqlArray;

};


InvoiceReportsModel.InvoiceByMonthNew = (obj, result) => {
    var selectquery = `
    SELECT   
    
    YEAR(i.InvoiceDate) Year,'-' as Status,'-' as InvoiceType,MONTHNAME(i.InvoiceDate) as Month , 

    CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Price,
    CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Cost,
    CONCAT('$',' ',ROUND((ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2),' ','%') Margin,
  
    '-' as CustomerId,'-' as PartId,
    '-' as InvoiceDate,'-' as InvoiceDateTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;

    var query = ` 
    From tbl_invoice as i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId AND SO.IsDeleted = 0 AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as p on p.POId=SO.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = SO.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0  
    where i.IsDeleted=0  `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }

    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "Year":
                    query += " and YEAR(i.InvoiceDate) = '" + obj.columns[cvalue].search.value + "'  ";
                    break;
                case "IncludeRR":
                    if (obj.columns[cvalue].search.value == 1) { //RR Invoice
                        query += ' and i.RRId > 0 AND i.MROId = 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 3) { //QT Invoice
                        query += ' and i.RRId = 0 and i.MROId = 0  ';
                    }
                    break;
                case "InvoiceDate":
                    query += " and ( i.InvoiceDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "InvoiceDateTo":
                    query += " and ( i.InvoiceDate <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDate":
                    query += " and ( i.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDateTo":
                    query += " and ( i.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Created":
                    query += " and ( i.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CreatedTo":
                    query += " and ( i.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerId":
                    query += " and i.CustomerId In (" + obj.columns[cvalue].search.value + ")  ";
                    break;
                case "PartId":
                    query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }
    query += ` GROUP BY YEAR(i.InvoiceDate),MONTH(i.InvoiceDate),MONTHNAME(i.InvoiceDate) `;

    var Countquery = ` Select count(Counts) as recordsFiltered from (Select count(MONTHNAME(i.InvoiceDate)) Counts ` + query + ` ) as A `;
    var i = 0;
    if (obj.order.length > 0) {
        query += " ORDER BY ";

        for (i = 0; i < obj.order.length; i++) {
            if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
            {
                switch (obj.columns[obj.order[i].column].name) {
                    case "Year":
                        query += " MONTH(i.InvoiceDate) " + obj.order[i].dir + " ";
                        break;
                    case "Month":
                        query += " MONTH(i.InvoiceDate) " + obj.order[i].dir + " ";
                        break;
                    case "TotalAmount":
                        query += " ROUND(sum(i.GrandTotal)) " + obj.order[i].dir + " ";
                        break;
                    case "CustomerId":
                        query += " i.CustomerId " + obj.order[i].dir + " ";
                        break;
                    default:
                        query += " MONTH(i.InvoiceDate) " + obj.order[i].dir + " ";
                }
            }
        }
    } else {
        query += " ORDER BY MONTH(i.InvoiceDate) DESC ";
    }

    query = selectquery + query;

    var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(MONTHNAME(i.InvoiceDate)) as Counts 
    From tbl_invoice i    
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0  AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0    
    where i.IsDeleted=0  `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        TotalCountQuery += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    TotalCountQuery += ` GROUP BY YEAR(i.InvoiceDate),MONTH(i.InvoiceDate),MONTHNAME(i.InvoiceDate)) as A `;
    var sqlArray = []; var obj = {};
    obj.query = query;
    obj.Countquery = Countquery;
    obj.TotalCountQuery = TotalCountQuery;

    sqlArray.push(obj);

    //console.log("query = " + obj.query);
    //console.log("Countquery = " + obj.Countquery);
    //console.log("TotalCountQuery = " + obj.TotalCountQuery);
    return sqlArray;

};






InvoiceReportsModel.ParticularMonthInvoiceByCustomer = (obj, result) => {

    var selectquery = `Select '-' as Status,'-' as InvoiceType,c.CustomerId,c.CompanyName,Year(i.InvoiceDate) Year,
    CONCAT('$',' ',ROUND(ifnull(sum(i.GrandTotal),0),2)  ) as Price,
    CONCAT('$',' ',ROUND(ifnull(sum(p.GrandTotal),0),2) ) as Cost,
    CONCAT('$',' ',ROUND((ROUND(ifnull(sum(i.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2) ) Profit,
    CONCAT(ROUND(((ifnull(sum(i.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(i.GrandTotal),0), 2),' ','%') Margin
    ,'-' as InvoiceDate,'-' as InvoiceDateTo,'-' as DueDate,
    '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;
    var query = ` From tbl_invoice i
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0  AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED} 
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
    Left Join tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0 `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {

            switch (obj.columns[cvalue].name) {
                case "IncludeRR":
                    if (obj.columns[cvalue].search.value == 1) { //RR Invoice
                        query += ' and i.RRId > 0 AND i.MROId = 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 3) { //QT Invoice
                        query += ' and i.RRId = 0 and i.MROId = 0  ';
                    }
                    break;
                case "InvoiceDate":
                    query += " and ( i.InvoiceDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "InvoiceDateTo":
                    query += " and ( i.InvoiceDate <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDate":
                    query += " and ( i.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDateTo":
                    query += " and ( i.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Created":
                    query += " and ( i.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CreatedTo":
                    query += " and ( i.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "PartId":
                    query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerId":
                    query += " and  i.CustomerId in (" + obj.columns[cvalue].search.value + ") ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }
    query += ` Group By Year(i.InvoiceDate),i.CustomerId  `;
    var Countquery = `Select Count(Counts) recordsFiltered from ( Select count(i.InvoiceId) as Counts ` + query + ` ) as A `;

    var i = 0;
    if (obj.order.length > 0) {
        query += " ORDER BY ";
    }
    for (i = 0; i < obj.order.length; i++) {
        if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
        {
            switch (obj.columns[obj.order[i].column].name) {
                case "CustomerId":
                    query += " i.CustomerId " + obj.order[i].dir + " ";
                    break;
                default:
                    query += " i.CustomerId  " + obj.order[i].dir + " ";
            }
        }
    }
    query = selectquery + query;

    var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(*) as Counts 
    From tbl_invoice i
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0  AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED} 
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
    Left Join tbl_customers c on c.CustomerId=i.CustomerId where i.IsDeleted=0  `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        TotalCountQuery += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    TotalCountQuery += ` Group By Year(i.InvoiceDate),i.CustomerId ) as A  `;
    var sqlArray = []; var obj = {};
    obj.query = query;
    obj.Countquery = Countquery;
    obj.TotalCountQuery = TotalCountQuery;

    sqlArray.push(obj);

    //console.log("query = " + obj.query);
    //console.log("Countquery = " + obj.Countquery);
    // console.log("TotalCountQuery = " + obj.TotalCountQuery);
    return sqlArray;//
};



InvoiceReportsModel.ParticularMonthInvoiceByCustomerNew = (obj, result) => {

    var selectquery = `Select '-' as Status,'-' as InvoiceType,c.CustomerId,c.CompanyName,Year(i.InvoiceDate) Year,
    
    
    CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Price,
    CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Cost,
    CONCAT('$',' ',ROUND((ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2),' ','%') Margin,
  


    '-' as InvoiceDate,'-' as InvoiceDateTo,'-' as DueDate,
    '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;
    var query = ` 
     From tbl_invoice as i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
    Left Join tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0 `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {

            switch (obj.columns[cvalue].name) {
                case "IncludeRR":
                    if (obj.columns[cvalue].search.value == 1) { //RR Invoice
                        query += ' and i.RRId > 0 AND i.MROId = 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 3) { //QT Invoice
                        query += ' and i.RRId = 0 and i.MROId = 0  ';
                    }
                    break;
                case "InvoiceDate":
                    query += " and ( i.InvoiceDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "InvoiceDateTo":
                    query += " and ( i.InvoiceDate <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDate":
                    query += " and ( i.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDateTo":
                    query += " and ( i.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Created":
                    query += " and ( i.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CreatedTo":
                    query += " and ( i.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "PartId":
                    query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerId":
                    query += " and  i.CustomerId in (" + obj.columns[cvalue].search.value + ") ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }
    query += ` Group By Year(i.InvoiceDate),i.CustomerId  `;
    var Countquery = `Select Count(Counts) recordsFiltered from ( Select count(i.InvoiceId) as Counts ` + query + ` ) as A `;

    var i = 0;
    if (obj.order.length > 0) {
        query += " ORDER BY ";
    }
    for (i = 0; i < obj.order.length; i++) {
        if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
        {
            switch (obj.columns[obj.order[i].column].name) {
                case "CustomerId":
                    query += " i.CustomerId " + obj.order[i].dir + " ";
                    break;
                default:
                    query += " i.CustomerId  " + obj.order[i].dir + " ";
            }
        }
    }
    query = selectquery + query;

    var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(*) as Counts 
    From tbl_invoice i
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0  AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED} 
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
    Left Join tbl_customers c on c.CustomerId=i.CustomerId where i.IsDeleted=0  `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        TotalCountQuery += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    TotalCountQuery += ` Group By Year(i.InvoiceDate),i.CustomerId ) as A  `;
    var sqlArray = []; var obj = {};
    obj.query = query;
    obj.Countquery = Countquery;
    obj.TotalCountQuery = TotalCountQuery;

    sqlArray.push(obj);

    // console.log("query = " + obj.query);
    //console.log("Countquery = " + obj.Countquery);
    // console.log("TotalCountQuery = " + obj.TotalCountQuery);
    return sqlArray;//
};





InvoiceReportsModel.ParticularMonthInvoiceByCustomerToExcel = (obj, result) => {

    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        Ids += val.CustomerId + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    var query = ``;
    query = ` Select   c.CompanyName,    
     CONCAT('',' ',ROUND(ifnull(sum(i.GrandTotal),0),2)  ) as Price,
    CONCAT('',' ',ROUND(ifnull(sum(p.GrandTotal),0),2) ) as Cost,
    CONCAT('',' ',ROUND((ROUND(ifnull(sum(i.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2) ) Profit,
    CONCAT(ROUND(((ifnull(sum(i.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(i.GrandTotal),0), 2),' ','%') Margin     
    From tbl_invoice i
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0   AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
    Left Join tbl_customers c on c.CustomerId=i.CustomerId where i.IsDeleted=0 `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    if (obj.InvoiceDate != "") {
        query += " and  i.InvoiceDate >='" + obj.InvoiceDate + "'  ";
    }
    if (obj.InvoiceDateTo != "") {
        query += " and  i.InvoiceDate <='" + obj.InvoiceDateTo + "'  ";
    }
    if (obj.DueDate != "") {
        query += " and  i.DueDate >='" + obj.DueDate + "' ";
    }
    if (obj.PartId != "") {
        query += " and  RR.PartId ='" + obj.PartId + "' ";
    }
    if (obj.DueDateTo != "") {
        query += " and ( i.DueDate <='" + obj.DueDateTo + "' ) ";
    }
    if (obj.Created != "") {
        query += " and  i.Created >='" + obj.Created + "'  ";
    }
    if (obj.CreatedTo != "") {
        query += " and  i.Created <='" + obj.CreatedTo + "'  ";
    }
    if (obj.CustomerId != "") {
        query += " and i.CustomerId ='" + obj.CustomerId + "'  ";
    }
    if (obj.InvoiceType != "") {
        query += " and  i.InvoiceType ='" + obj.InvoiceType + "'  ";
    }
    if (obj.Status != "") {
        query += " and  i.Status ='" + obj.Status + "'  ";
    }
    if (obj.IncludeRR == 1) { //RR Invoice
        query += ' and i.RRId > 0 AND i.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
        query += ' and i.RRId = 0 and i.MROId = 0  ';
    }
    if (CustomerIds != '' && CustomerIds != null) {
        query += ` and i.CustomerId in(` + CustomerIds + `)`;
    }
    query += " Group By i.CustomerId ";

    // console.log("SQL=" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};


InvoiceReportsModel.InvoiceDetailedReport = (obj, result) => {

    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        Ids += val.CustomerId + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    var query = ``;
    query = ` Select i.InvoiceNo Inv,ii.PartNo ProductLineItem,
    so.SONo SalesOrder,c.CompanyName Cust,DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') Date,ii.Quantity,ii.Rate UnitPrice,(Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0)) as UnitCost,
    ii.Discount,
    ROUND(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)),2) as ExtPrice,
    ROUND(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(poi.Quantity,0)),2) as ExtCost,
    ROUND((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(poi.Quantity,0))),2) GrossProfit,
    IF((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))>0,CONCAT(ROUND((((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(poi.Quantity,0)))*100)/((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),2),' %'),'-100 %')  as GrossProfitPercentage
    From tbl_invoice as i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0    
    Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 AND poi.POId = po.POId   
    Left Join tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0   `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    if (obj.InvoiceDate != "") {
        query += " and  i.InvoiceDate >='" + obj.InvoiceDate + "'  ";
    }
    if (obj.InvoiceDateTo != "") {
        query += " and  i.InvoiceDate <='" + obj.InvoiceDateTo + "'  ";
    }
    if (obj.DueDate != "") {
        query += " and  i.DueDate >='" + obj.DueDate + "' ";
    }
    if (obj.DueDateTo != "") {
        query += " and ( i.DueDate <='" + obj.DueDateTo + "' ) ";
    }
    if (obj.Created != "") {
        query += " and  i.Created >='" + obj.Created + "'  ";
    }
    if (obj.CreatedTo != "") {
        query += " and  i.Created <='" + obj.CreatedTo + "'  ";
    }
    if (obj.CustomerId != "") {
        query += " and i.CustomerId In(" + obj.CustomerId + ")  ";
    }
    if (obj.InvoiceType != "") {
        query += " and  i.InvoiceType ='" + obj.InvoiceType + "'  ";
    }
    if (obj.Status != "") {
        query += " and  i.Status ='" + obj.Status + "'  ";
    }
    if (obj.IncludeRR == 1) { //RR Invoice
        query += ' and i.RRId > 0 AND i.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
        query += ' and i.RRId = 0 and i.MROId = 0  ';
    }
    if (CustomerIds != '' && CustomerIds != null) {
        query += ` and i.CustomerId in(` + CustomerIds + `)`;
    }
    query += ` order By i.InvoiceDate desc `;
    //console.log("SQL=" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};//



InvoiceReportsModel.InvoiceDetailedReportNew = (obj, result) => {

    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        Ids += val.CustomerId + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    var query = ``;
    query = ` Select i.InvoiceNo Inv,ii.PartNo ProductLineItem,
    so.SONo SalesOrder,c.CompanyName Cust,DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') Date,ii.Quantity,ii.Rate UnitPrice,(Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0)) as UnitCost,
    ii.Discount,
    ROUND(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)),2) as ExtPrice,
    ROUND(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)),2) as ExtCost,
    ROUND((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),2) GrossProfit,
    IF((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))>0,CONCAT(ROUND((((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)))*100)/((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),2),' %'),'-100 %')  as GrossProfitPercentage
    From tbl_invoice as i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0    
    Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0    
    Left Join tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0   `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    if (obj.InvoiceDate != "") {
        query += " and  i.InvoiceDate >='" + obj.InvoiceDate + "'  ";
    }
    if (obj.InvoiceDateTo != "") {
        query += " and  i.InvoiceDate <='" + obj.InvoiceDateTo + "'  ";
    }
    if (obj.DueDate != "") {
        query += " and  i.DueDate >='" + obj.DueDate + "' ";
    }
    if (obj.DueDateTo != "") {
        query += " and ( i.DueDate <='" + obj.DueDateTo + "' ) ";
    }
    if (obj.Created != "") {
        query += " and  i.Created >='" + obj.Created + "'  ";
    }
    if (obj.CreatedTo != "") {
        query += " and  i.Created <='" + obj.CreatedTo + "'  ";
    }
    if (obj.CustomerId != "") {
        query += " and i.CustomerId In(" + obj.CustomerId + ")  ";
    }
    if (obj.InvoiceType != "") {
        query += " and  i.InvoiceType ='" + obj.InvoiceType + "'  ";
    }
    if (obj.Status != "") {
        query += " and  i.Status ='" + obj.Status + "'  ";
    }
    if (obj.IncludeRR == 1) { //RR Invoice
        query += ' and i.RRId > 0 AND i.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
        query += ' and i.RRId = 0 and i.MROId = 0  ';
    }
    if (CustomerIds != '' && CustomerIds != null) {
        query += ` and i.CustomerId in(` + CustomerIds + `)`;
    }
    query += ` order By i.InvoiceDate desc `;
    // console.log("SQL=" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};//


InvoiceReportsModel.MROInvoiceDetailedReportCSV = (obj, result) => {
    var query = `Select i.InvoiceNo Inv,ii.PartNo ProductLineItem,
    so.SONo SalesOrder,c.CompanyName Cust,DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') Date,ii.Quantity,ii.Rate UnitPrice,(Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0)) as UnitCost,
    ii.Discount,
    ROUND(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)),2) as ExtPrice,
    ROUND(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)),2) as ExtCost,
    ROUND((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),2) GrossProfit,
    IF((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))>0,CONCAT(ROUND((((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)))*100)/((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),2),' %'),'-100 %')  as GrossProfitPercentage
    From tbl_invoice as i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0    
    Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    Left JOIN tbl_mro as MRO on MRO.MROId=i.MROId AND MRO.IsDeleted = 0  
    Left Join tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0  `;

    if (obj.MROId != '') {
        query += ` and MRO.MROId = ` + obj.MROId + ` `;
    }
    query += ` order By i.InvoiceDate desc `;
    // console.log("SQL=" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};//



InvoiceReportsModel.InvoiceDetailedReportCSV = (obj, result) => {

    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        Ids += val.CustomerId + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    var query = ``;
    query = ` SELECT c.CustomerCode as 'Customer ID',c.CompanyName as 'Customer Name', i.InvoiceNo as 'Invoice/CM #',DATE_FORMAT(i.Created,'%m/%d/%Y') as Date,
  CONCAT(c.FirstName,' ',c.LastName) as 'Ship to Name', IF(CONCAT(ab1.StreetAddress,',',ab1.City,',',s1.StateName,',',c1.CountryName)
  IS NULL, "", CONCAT(ab1.StreetAddress,',',ab1.City,',',s1.StateName,',',c1.CountryName))  as 'Ship to Address-Line One',''
   as 'Ship to Address-Line Two',
  IF(ab1.City IS NULL, "", ab1.City)  as 'Ship to City', IF(s1.StateName IS NULL, "", s1.StateName)   as 'Ship to State', IF(ab1.Zip
  IS NULL, "", ab1.Zip) as 'Ship to Zipcode', IF(c1.CountryName IS NULL, "", c1.CountryName) as 'Ship to Country',i.CustomerPONo as 'Customer PO',
  DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') as 'Ship Date',DATE_FORMAT(i.DueDate,'%m/%d/%Y') as 'Date Due',TERM.TermsName as 'Displayed Terms',
  11000 as 'Accounts Receivable Account',i.GrandTotal as 'Accounts Receivable Amount','' as 'Invoice Note',(SELECT Count(vii.InvoiceItemId)
  FROM tbl_invoice_item as vii WHERE vii.IsDeleted = 0 AND vii.InvoiceId = i.InvoiceId ) as 'Number of Distributions',1 as Quantity,
  i.RRId as 'SO/Proposal Number','AH-Parts' as 'Item ID',ii.Description,30000 as 'G/L Account', CONCAT('-',ii.Price) as
  'Unit Price',2 as 'Tax Type',
  CONCAT('-',ii.Price) as Amount
  FROM tbl_invoice i
  Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
  Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
  Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 AND poi.POId = po.POId   
  Left Join tbl_customers c on c.CustomerId=i.CustomerId
  LEFT JOIN tbl_address_book ab1 on ab1.AddressId=i.ShipAddressId
  LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
  LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
  LEFT JOIN tbl_terms as TERM ON TERM.TermsId = i.TermsId 
  where  i.IsDeleted=0   `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    if (obj.InvoiceDate != "") {
        query += " and  i.InvoiceDate >='" + obj.InvoiceDate + "'  ";
    }
    if (obj.InvoiceDateTo != "") {
        query += " and  i.InvoiceDate <='" + obj.InvoiceDateTo + "'  ";
    }
    if (obj.DueDate != "") {
        query += " and  i.DueDate >='" + obj.DueDate + "' ";
    }
    if (obj.DueDateTo != "") {
        query += " and ( i.DueDate <='" + obj.DueDateTo + "' ) ";
    }
    if (obj.Created != "") {
        query += " and  i.Created >='" + obj.Created + "'  ";
    }
    if (obj.CreatedTo != "") {
        query += " and  i.Created <='" + obj.CreatedTo + "'  ";
    }
    if (obj.CustomerId != "") {
        query += " and i.CustomerId In(" + obj.CustomerId + ")  ";
    }
    if (obj.InvoiceType != "") {
        query += " and  i.InvoiceType ='" + obj.InvoiceType + "'  ";
    }
    if (obj.Status != "") {
        query += " and  i.Status ='" + obj.Status + "'  ";
    }
    if (obj.IncludeRR == 1) { //RR Invoice
        query += ' and i.RRId > 0 AND i.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
        query += ' and i.RRId = 0 and i.MROId = 0  ';
    }
    if (CustomerIds != '' && CustomerIds != null) {
        query += ` and i.CustomerId in(` + CustomerIds + `)`;
    }
    query += ` order By i.InvoiceDate desc `;
    //console.log("SQL=" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};//


InvoiceReportsModel.InvoiceByMonthReportToExcel = (obj, result) => {

    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        if (val.Month != '')
            Ids = Ids + `'${val.Month}'` + `,`;
    }
    var Months = Ids.slice(0, -1);
    var query = ``;
    query = ` SELECT   CONCAT(MONTHNAME(i.InvoiceDate),' ',Year(i.InvoiceDate)) Month, 

    CONCAT('','',ROUND(ifnull(sum(i.GrandTotal),0),2)) as Price,
    CONCAT('','',ROUND(ifnull(sum(p.GrandTotal),0),2)) as Cost,
    CONCAT('','',ROUND((ROUND(ifnull(sum(i.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(i.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(i.GrandTotal),0),2),' ','%') Margin
    From tbl_invoice i
     Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0 AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED} 
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0   AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0    
    where i.IsDeleted=0 `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.InvoiceDate != "") {
        query += " and ( i.InvoiceDate >='" + obj.InvoiceDate + "' ) ";
    }
    if (obj.InvoiceDateTo != "") {
        query += " and ( i.InvoiceDate <='" + obj.InvoiceDateTo + "' ) ";
    }
    if (obj.DueDate != "") {
        query += " and ( i.DueDate >='" + obj.DueDate + "' ) ";
    }
    if (obj.DueDateTo != "") {
        query += " and ( i.DueDate <='" + obj.DueDateTo + "' ) ";
    }
    if (obj.Created != "") {
        query += " and ( i.Created >='" + obj.Created + "' ) ";
    }
    if (obj.CreatedTo != "") {
        query += " and ( i.Created <='" + obj.CreatedTo + "' ) ";
    }
    if (obj.CustomerId != "") {
        query += " and  i.CustomerId In (" + obj.CustomerId + ") ";
    }
    if (obj.PartId != "") {
        query += " and ( RR.PartId ='" + obj.PartId + "' ) ";
    }
    if (obj.InvoiceType != "") {
        query += " and ( i.InvoiceType ='" + obj.InvoiceType + "' ) ";
    }
    if (obj.Status != "") {
        query += " and ( i.Status ='" + obj.Status + "' ) ";
    }
    if (obj.IncludeRR == 1) { //RR Invoice
        query += ' and i.RRId > 0 AND i.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
        query += ' and i.RRId = 0 and i.MROId = 0  ';
    }
    if (Months != '' && Months != null) {
        query += ` and MONTHNAME(i.InvoiceDate) in(` + Months + `) `;
    }
    query += `  GROUP BY Year(i.InvoiceDate),MONTH(i.InvoiceDate),MONTHNAME(i.InvoiceDate),CONCAT(MONTHNAME(i.InvoiceDate),' ',Year(i.InvoiceDate)) `;
    //"SQL=" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};




















//Get InvoiceByCustomerReportToExcel
InvoiceReportsModel.InvoiceByCustomerReportToExcel = (obj, result) => {

    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        Ids += val.CustomerId + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    var query = ``;
    query = ` Select   c.CompanyName,Count(i.InvoiceId) as InvoiceCount,CONCAT('$',' ',ROUND(Sum(i.GrandTotal))) as Amount
     From tbl_invoice i
    Left Join tbl_customers c on c.CustomerId=i.CustomerId where i.IsDeleted=0 `;
    if (obj.InvoiceDate != "") {
        query += " and ( i.InvoiceDate >='" + obj.InvoiceDate + "' ) ";
    }
    if (obj.InvoiceDateTo != "") {
        query += " and ( i.InvoiceDate <='" + obj.InvoiceDateTo + "' ) ";
    }
    if (obj.DueDate != "") {
        query += " and ( i.DueDate >='" + obj.DueDate + "' ) ";
    }
    if (obj.DueDateTo != "") {
        query += " and ( i.DueDate <='" + obj.DueDateTo + "' ) ";
    }
    if (obj.Created != "") {
        query += " and ( i.Created >='" + obj.Created + "' ) ";
    }
    if (obj.CreatedTo != "") {
        query += " and ( i.Created <='" + obj.CreatedTo + "' ) ";
    }
    if (obj.CustomerId != "") {
        query += " and ( i.CustomerId ='" + obj.CustomerId + "' ) ";
    }
    if (obj.InvoiceType != "") {
        query += " and ( i.InvoiceType ='" + obj.InvoiceType + "' ) ";
    }
    if (obj.Status != "") {
        query += " and ( i.Status ='" + obj.Status + "' ) ";
    }
    if (obj.IncludeRR == 1) { //RR Invoice
        query += ' and i.RRId > 0 AND i.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
        query += ' and i.RRId = 0 and i.MROId = 0  ';
    }

    if (CustomerIds != '' && CustomerIds != null) {
        query += ` and i.CustomerId in(` + CustomerIds + `)`;
    }
    query += " Group By i.CustomerId ";

    //  console.log("SQL=" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};
//

InvoiceReportsModel.OverAllSummary = (obj, result) => {

    var query = `SELECT  '' as IncludeRR,
CONCAT('$',' ',ROUND(ifnull(sum(i.GrandTotal),0),2)) as Price,
CONCAT('$',' ',ROUND(ifnull(sum(p.GrandTotal),0),2)) as Cost,
CONCAT('$',' ',ROUND((ROUND(ifnull(sum(i.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2)) as Profit,
CONCAT(ROUND(((ifnull(sum(i.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(i.GrandTotal),0),2),' ','%') Margin
From tbl_invoice i
 Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0 AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  
Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
where i.IsDeleted=0  `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {

            switch (obj.columns[cvalue].name) {
                case "Year":
                    query += " and Year(i.InvoiceDate)='" + obj.columns[cvalue].search.value + "'  ";
                    break;
                case "IncludeRR":
                    if (obj.columns[cvalue].search.value == 1) { //RR Invoice
                        query += ' and i.RRId > 0 AND i.MROId = 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 3) { //QT Invoice
                        query += ' and i.RRId = 0 and i.MROId = 0  ';
                    }
                    break;
                case "InvoiceDate":
                    query += " and ( i.InvoiceDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "InvoiceDateTo":
                    query += " and ( i.InvoiceDate <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDate":
                    query += " and ( i.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDateTo":
                    query += " and ( i.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Created":
                    query += " and ( i.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CreatedTo":
                    query += " and ( i.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerId":
                    query += " and  i.CustomerId in (" + obj.columns[cvalue].search.value + ") ";
                    break;
                case "PartId":
                    query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";

            }
        }
    }


    //console.log("SQL=" + query);
    return query;

};


InvoiceReportsModel.OverAllSummaryNew = (obj, result) => {

    var query = `SELECT  '' as IncludeRR, 
   
    CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Price,
    CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Cost,
    CONCAT('$',' ',ROUND((ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2),' ','%') Margin
 

From tbl_invoice i
Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0   


Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
where i.IsDeleted=0  `;
    if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {

            switch (obj.columns[cvalue].name) {
                case "Year":
                    query += " and Year(i.InvoiceDate)='" + obj.columns[cvalue].search.value + "'  ";
                    break;
                case "IncludeRR":
                    if (obj.columns[cvalue].search.value == 1) { //RR Invoice
                        query += ' and i.RRId > 0 AND i.MROId = 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 3) { //QT Invoice
                        query += ' and i.RRId = 0 and i.MROId = 0  ';
                    }
                    break;
                case "InvoiceDate":
                    query += " and ( i.InvoiceDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "InvoiceDateTo":
                    query += " and ( i.InvoiceDate <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDate":
                    query += " and ( i.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDateTo":
                    query += " and ( i.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Created":
                    query += " and ( i.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CreatedTo":
                    query += " and ( i.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerId":
                    query += " and  i.CustomerId in (" + obj.columns[cvalue].search.value + ") ";
                    break;
                case "PartId":
                    query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";

            }
        }
    }


    // console.log("New SQL=" + query);
    return query;

};


//Get InvoiceByCustomer
InvoiceReportsModel.InvoiceByCustomer = (obj, result) => {

    var selectquery = `Select '-' as Status,'-' as InvoiceType,c.CustomerId,c.CompanyName,Count(i.InvoiceId) as InvoiceCount,
    CONCAT('$',' ',ROUND(Sum(i.GrandTotal),2) ) as Amount,'-' as InvoiceDate,'-' as InvoiceDateTo,'-' as DueDate,
    '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;
    var query = ` From tbl_invoice i
    Left Join tbl_customers c on c.CustomerId=i.CustomerId where i.IsDeleted=0 `;
    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {

            switch (obj.columns[cvalue].name) {
                case "IncludeRR":
                    if (obj.columns[cvalue].search.value == 1) { //RR Invoice
                        query += ' and i.RRId > 0 AND i.MROId = 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 3) { //QT Invoice
                        query += ' and i.RRId = 0 and i.MROId = 0  ';
                    }
                    break;
                case "InvoiceDate":
                    query += " and ( i.InvoiceDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "InvoiceDateTo":
                    query += " and ( i.InvoiceDate <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDate":
                    query += " and ( i.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDateTo":
                    query += " and ( i.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Created":
                    query += " and ( i.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CreatedTo":
                    query += " and ( i.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerId":
                    query += " and ( i.CustomerId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }
    query += ` Group By i.CustomerId `;
    var Countquery = `Select Count(Counts) recordsFiltered from ( Select count(i.InvoiceId) as Counts ` + query + ` ) as A `;

    var i = 0;
    if (obj.order.length > 0) {
        query += " ORDER BY ";
    }
    for (i = 0; i < obj.order.length; i++) {
        if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
        {
            switch (obj.columns[obj.order[i].column].name) {
                case "CustomerId":
                    query += " i.CustomerId " + obj.order[i].dir + " ";
                    break;
                case "InvoiceCount":
                    query += " Count(i.InvoiceId) " + obj.order[i].dir + " ";
                    break;
                case "Amount":
                    query += " ROUND(Sum(i.GrandTotal)) " + obj.order[i].dir + " ";
                    break;
                default:
                    query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + " ";
            }
        }
    }
    if (obj.start != "-1" && obj.length != "-1") {
        query += " LIMIT " + obj.start + "," + (obj.length);
    }
    query = selectquery + query;

    var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(*) as Counts 
    From tbl_invoice i
    Left Join tbl_customers c on c.CustomerId=i.CustomerId 
    where i.IsDeleted=0  Group By i.CustomerId) as A `;

    // console.log("query = " + query);
    // console.log("Countquery = " + Countquery);
    //console.log("TotalCountQuery = " + TotalCountQuery);
    async.parallel([
        function (result) { con.query(query, result) },
        function (result) { con.query(Countquery, result) },
        function (result) { con.query(TotalCountQuery, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            //if (results[0][0].length > 0) {
            result(null, {
                data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
                recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
            });
            return;
            // }
            // else {
            //     result(null, "No record");
            //     return;
            // }
        });
};
//

//Get InvoiceByParts
InvoiceReportsModel.InvoiceByParts = (obj, result) => {

    var selectquery = `Select '-' as Status,'-' as InvoiceType,'-'as CustomerId,p.PartId,p.PartNo,SUM(ii.Quantity) as Quantity,
    CONCAT('$',' ',ROUND(SUM(ii.price)/SUM(ii.Quantity))) as AvgAmount,CONCAT('$',' ',ROUND(SUM(ii.price))) as TotalAmount,
    '-' as InvoiceDate,'-' as InvoiceDateTo,'-' as DueDate,
    '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as  IncludeRR `;
    var query = ` From tbl_invoice i
  Left Join tbl_invoice_item ii on ii.InvoiceId=i.InvoiceId
  Left Join tbl_parts p on p.partId=ii.partId where i.IsDeleted=0 `;

    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "IncludeRR":
                    if (obj.columns[cvalue].search.value == 1) { //RR Invoice
                        query += ' and i.RRId > 0 AND i.MROId = 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 3) { //QT Invoice
                        query += ' and i.RRId = 0 and i.MROId = 0  ';
                    }
                    break;
                case "InvoiceDate":
                    query += " and ( i.InvoiceDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "InvoiceDateTo":
                    query += " and ( i.InvoiceDate <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDate":
                    query += " and ( i.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "DueDateTo":
                    query += " and ( i.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Created":
                    query += " and ( i.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CreatedTo":
                    query += " and ( i.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerId":
                    query += " and ( i.CustomerId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "PartId":
                    query += " and ( ii.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }
    query += ` Group By ii.PartId,p.PartNo `;
    var Countquery = `Select Count(Counts) recordsFiltered from ( Select count(*) as Counts ` + query + ` ) as A `;
    var i = 0;
    if (obj.order.length > 0) {
        query += " ORDER BY ";
    }
    for (i = 0; i < obj.order.length; i++) {
        if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
        {
            switch (obj.columns[obj.order[i].column].name) {
                case "PartNo":
                    query += " p.PartId " + obj.order[i].dir + " ";
                    break;
                case "Quantity":
                    query += " SUM(ii.Quantity) " + obj.order[i].dir + " ";
                    break;
                case "AvgAmount":
                    query += " ROUND(SUM(ii.price)/SUM(ii.Quantity)) " + obj.order[i].dir + " ";
                    break;
                case "TotalAmount":
                    query += " ROUND(SUM(ii.price)) " + obj.order[i].dir + " ";
                    break;
                default:
                    query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + " ";
            }
        }
    }
    if (obj.start != "-1" && obj.length != "-1") {
        query += " LIMIT " + obj.start + "," + (obj.length);
    }
    query = selectquery + query;
    var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(*) as Counts 
    From tbl_invoice i
    Left Join tbl_invoice_item ii on ii.InvoiceId=i.InvoiceId
    Left Join tbl_parts p on p.partId=ii.partId where i.IsDeleted=0  Group By ii.PartId,p.PartNo ) as A `;

    //console.log("query = " + query);
    //console.log("Countquery = " + Countquery);
    //console.log("TotalCountQuery = " + TotalCountQuery);
    async.parallel([
        function (result) { con.query(query, result) },
        function (result) { con.query(Countquery, result) },
        function (result) { con.query(TotalCountQuery, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            //  if (results[0][0].length > 0) {
            result(null, {
                data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
                recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
            });
            return;
            // }
            // else {
            //     result(null, "No record");
            //     return;
            // }
        });
};
//Get InvoiceByPartsReportToExcel
InvoiceReportsModel.InvoiceByPartsReportToExcel = (obj, result) => {

    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        Ids += val.PartId + `,`;
    }
    var PartIds = Ids.slice(0, -1);
    var query = ``;
    query = ` Select ii.PartId,p.PartNo,SUM(ii.Quantity) as Quantity,
  CONCAT('$',' ',ROUND(SUM(ii.price)/SUM(ii.Quantity))) as AvgAmount,CONCAT('$',' ',ROUND(SUM(ii.price))) as TotalAmount
  From tbl_invoice i
  Left Join tbl_invoice_item ii on ii.InvoiceId=i.InvoiceId
  Left Join tbl_parts p on p.partId=ii.partId where i.IsDeleted=0 `;
    if (obj.InvoiceDate != "") {
        query += " and ( i.InvoiceDate >='" + obj.InvoiceDate + "' ) ";
    }
    if (obj.InvoiceDateTo != "") {
        query += " and ( i.InvoiceDate <='" + obj.InvoiceDateTo + "' ) ";
    }
    if (obj.DueDate != "") {
        query += " and ( i.DueDate >='" + obj.DueDate + "' ) ";
    }
    if (obj.DueDateTo != "") {
        query += " and ( i.DueDate <='" + obj.DueDateTo + "' ) ";
    }
    if (obj.Created != "") {
        query += " and ( i.Created >='" + obj.Created + "' ) ";
    }
    if (obj.CreatedTo != "") {
        query += " and ( i.Created <='" + obj.CreatedTo + "' ) ";
    }
    if (obj.CustomerId != "") {
        query += " and ( i.CustomerId ='" + obj.CustomerId + "' ) ";
    }
    if (obj.PartId != "") {
        query += " and ( ii.PartId ='" + obj.PartId + "' ) ";
    }
    if (obj.InvoiceType != "") {
        query += " and ( i.InvoiceType ='" + obj.InvoiceType + "' ) ";
    }
    if (obj.Status != "") {
        query += " and ( i.Status ='" + obj.Status + "' ) ";
    }
    if (obj.IncludeRR == 1) { //RR Invoice
        query += ' and i.RRId > 0 AND i.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
        query += ' and i.RRId = 0 and i.MROId = 0  ';
    }
    if (PartIds != '' && PartIds != null) {
        query += ` and ii.PartId in(` + PartIds + `)`;
    }
    query += " Group By ii.PartId,p.PartNo ";
    // console.log("SQL=" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};





module.exports = InvoiceReportsModel;
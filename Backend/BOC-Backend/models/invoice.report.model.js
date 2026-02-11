/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
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
    this.CustomerGroupId = obj.CustomerGroupId ? obj.CustomerGroupId : '';
    this.PartId = obj.PartId ? obj.PartId : '';
    this.InvoiceType = obj.InvoiceType ? obj.InvoiceType : 0;
    this.Status = obj.Status ? obj.Status : 0;
    this.IncludeRR = obj.IncludeRR ? obj.IncludeRR : 100;
    this.InvoiceReports = obj.InvoiceReports ? obj.InvoiceReports : '';
    this.Month = obj.Month ? obj.Month : '';
    this.Year = obj.Year ? obj.Year : '';
    this.MROId = obj.MROId ? obj.MROId : 0;
    this.CurrencyCode = obj.CurrencyCode ? obj.CurrencyCode : '';
    this.CreatedByLocation = obj.CreatedByLocation ? obj.CreatedByLocation : '';


    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;

    const TokenGlobalIdentityId = global.authuser.IdentityId ? global.authuser.IdentityId : 0;
    this.IdentityId = (obj.authuser && obj.authuser.IdentityId) ? obj.authuser.IdentityId : TokenGlobalIdentityId;

    const TokenGlobalIdentityType = global.authuser.IdentityType ? global.authuser.IdentityType : 0;
    this.IdentityType = (obj.authuser && obj.authuser.IdentityType) ? obj.authuser.IdentityType : TokenGlobalIdentityType;

    const TokenIsRestrictedCustomerAccess = global.authuser.IsRestrictedCustomerAccess ? global.authuser.IsRestrictedCustomerAccess : 0;
    this.IsRestrictedCustomerAccess = (obj.authuser && obj.authuser.IsRestrictedCustomerAccess) ? obj.authuser.IsRestrictedCustomerAccess : TokenIsRestrictedCustomerAccess;

    const TokenMultipleCustomerIds = global.authuser.MultipleCustomerIds ? global.authuser.MultipleCustomerIds : 0;
    this.MultipleCustomerIds = (obj.authuser && obj.authuser.MultipleCustomerIds) ? obj.authuser.MultipleCustomerIds : TokenMultipleCustomerIds;

    const TokenMultipleAccessIdentityIds = global.authuser.MultipleAccessIdentityIds ? global.authuser.MultipleAccessIdentityIds : 0;
    this.MultipleAccessIdentityIds = (obj.authuser && obj.authuser.MultipleAccessIdentityIds) ? obj.authuser.MultipleAccessIdentityIds : TokenMultipleAccessIdentityIds;


    this.ReportCurrencyCode = obj.ReportCurrencyCode ? obj.ReportCurrencyCode : '';

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
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    where i.IsDeleted=0  `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        TotalCountQuery += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    TotalCountQuery += ` GROUP BY YEAR(i.InvoiceDate),MONTH(i.InvoiceDate),MONTHNAME(i.InvoiceDate)) as A `;
    var sqlArray = []; var obj = {};
    obj.query = query;
    obj.Countquery = Countquery;
    obj.TotalCountQuery = TotalCountQuery;

    sqlArray.push(obj);

    //console.log("query = " + obj.query);
    //console.log("Countquery = " + obj.Countquery);
    // console.log("TotalCountQuery = " + obj.TotalCountQuery);
    return sqlArray;

};


InvoiceReportsModel.InvoiceByMonthNew = (obj, result) => {
    var selectquery = `
    SELECT   
    
    YEAR(i.InvoiceDate) Year,'-' as Status,'-' as InvoiceType,MONTHNAME(i.InvoiceDate) as Month , i.LocalCurrencyCode as LCC,'' as CreatedByLocation,

    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2),2)) as Price,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2),2)) as Cost,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0) + ifnull(ii.ShippingCharge,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2)),2),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2),' ','%') Margin,
  
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
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = ii.ItemLocalCurrencyCode AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    LEFT JOIN tbl_countries CON on CON.CountryId=i.CreatedByLocation AND CON.CountryId > 0
    where i.IsDeleted=0 AND i.LocalCurrencyCode != "" `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.IncludeRR != '') {
        if (obj.IncludeRR == 1) { //RR Invoice
            query += ' and i.RRId > 0 AND i.MROId = 0  ';
        }
        if (obj.IncludeRR == 2) { //MRO Invoice
            query += ' and i.RRId = 0 AND i.MROId > 0  ';
        }
        if (obj.IncludeRR == 3) { //QT Invoice
            query += ' and i.RRId = 0 and i.MROId = 0  ';
        }
        if (obj.IncludeRR == 4) { //Shop Invoice
          query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
        }
        if (obj.IncludeRR == 5) { //MRO without shop
            query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
        }
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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
                case "CustomerGroupId":
                    // query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
                    query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
                    break;
                case "PartId":
                    query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CurrencyCode":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                case "CreatedByLocation":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }
    query += ` GROUP BY YEAR(i.InvoiceDate),MONTH(i.InvoiceDate),MONTHNAME(i.InvoiceDate),i.LocalCurrencyCode `;

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
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        TotalCountQuery += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    Left Join tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0 `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        TotalCountQuery += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    TotalCountQuery += ` Group By Year(i.InvoiceDate),i.CustomerId ) as A  `;
    var sqlArray = []; var obj = {};
    obj.query = query;
    obj.Countquery = Countquery;
    obj.TotalCountQuery = TotalCountQuery;

    sqlArray.push(obj);

    //console.log("query = " + obj.query);
    //console.log("Countquery = " + obj.Countquery);
    //console.log("TotalCountQuery = " + obj.TotalCountQuery);
    return sqlArray;//
};



InvoiceReportsModel.ParticularMonthInvoiceByCustomerNew = (obj, result) => {

    // CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Price,
    // CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Cost,
    // CONCAT(CURL.CurrencySymbol,' ',ROUND((ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)),2)) as Profit,
    // CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2),' ','%') Margin,
    var selectquery = `Select '-' as Status,'-' as InvoiceType,c.CustomerId,c.CompanyName,Year(i.InvoiceDate) Year, i.LocalCurrencyCode as LCC,'' as CreatedByLocation,
    
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2),2)) as Price,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2),2)) as Cost,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2)),2),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2),' ','%') Margin,
  


    '-' as InvoiceDate,'-' as InvoiceDateTo,'-' as DueDate,
    '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR,c.CustomerGroupId `;
    var query = ` 
     From tbl_invoice as i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    Left Join tbl_customers c on c.CustomerId=i.CustomerId
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = ii.ItemLocalCurrencyCode AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    LEFT JOIN tbl_countries CON on CON.CountryId=i.CreatedByLocation AND CON.CountryId > 0
    where i.IsDeleted=0 AND i.LocalCurrencyCode != "" `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    if (obj.CurrencyCode != '') {
        query += ` and ( i.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
    }
    if (obj.CreatedByLocation != '') {
        query += ` and ( i.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
                case "CurrencyCode":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                case "CreatedByLocation":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;

                case "CustomerGroupId":
                    query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }
    query += ` Group By Year(i.InvoiceDate),i.CustomerId,i.LocalCurrencyCode  `;
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
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        TotalCountQuery += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    TotalCountQuery += ` Group By Year(i.InvoiceDate),i.CustomerId ) as A  `;
    var sqlArray = []; var obj = {};
    obj.query = query;
    obj.Countquery = Countquery;
    obj.TotalCountQuery = TotalCountQuery;

    sqlArray.push(obj);

    // console.log("query = " + obj.query);
    // console.log("Countquery = " + obj.Countquery);
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
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    Left Join tbl_customers c on c.CustomerId=i.CustomerId where i.IsDeleted=0 `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
    so.SONo SalesOrder,c.CompanyName Cust,DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') Date,ii.Quantity,ii.Rate UnitPrice,(Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0)+ifnull(poi.ShippingCharge,0)) as UnitCost,
    ii.Discount,
    ROUND(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0),2) as ExtPrice,
    ROUND(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(poi.Quantity,0))+ifnull(poi.ShippingCharge,0),2) as ExtCost,
    ROUND(((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(poi.Quantity,0))+ifnull(poi.ShippingCharge,0)),2) GrossProfit,
    IF((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))>0,CONCAT(ROUND(((((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(poi.Quantity,0))+ifnull(poi.ShippingCharge,0))*100)/((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0)),2),' %'),'-100 %')  as GrossProfitPercentage
    From tbl_invoice as i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0    
    Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 AND poi.POId = po.POId   
    Left Join tbl_customers c on c.CustomerId=i.CustomerId
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    where i.IsDeleted=0   `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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



InvoiceReportsModel.InvoiceDetailedReportNew = (obj, result) => {
    // ROUND(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)),2) as ExtPrice,
    // ROUND(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)),2) as ExtCost,
    // ROUND((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),2) GrossProfit,
    // IF((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))>0,CONCAT(ROUND((((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)))*100)/((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),2),' %'),'-100 %')  as GrossProfitPercentage

    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        Ids += val.CustomerId + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    var query = ``;
    query = ` Select i.InvoiceNo Inv,ii.PartNo ProductLineItem,
    so.SONo SalesOrder,c.CompanyName Cust,DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') Date,ii.Quantity,i.LocalCurrencyCode as Currency,
    ii.Rate UnitPrice,
    (((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))+Ifnull(poi.ShippingCharge,0)) * ifnull(EXR.ExchangeRate,1)   ) as UnitCost,
    ii.Discount,
    
    FORMAT(ROUND((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0)),2),2) as ExtPrice,
    FORMAT(ROUND(((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0))+(ifnull(poi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),2),2) as ExtCost,
    FORMAT(ROUND(((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0))-(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0))+(ifnull(poi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),2),2) GrossProfit,
    IF((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))>0,CONCAT(ROUND(((((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0))-(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0))+(ifnull(poi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))*100)/((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0)),2),' %'),'-100 %')  as GrossProfitPercentage

    From tbl_invoice as i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0    
    Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0    
    Left Join tbl_customers c on c.CustomerId=i.CustomerId
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = ii.ItemLocalCurrencyCode AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    where i.IsDeleted=0  AND i.LocalCurrencyCode !="" `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
    if (obj.CustomerGroupId != "") {
        query += " and c.CustomerGroupId In(" + obj.CustomerGroupId + ")  ";
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
    if (obj.CurrencyCode != "") { //QT Invoice
        query += " and  i.LocalCurrencyCode ='" + obj.CurrencyCode + "'  ";
    }
    if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
        query += " and ( i.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
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


InvoiceReportsModel.MROInvoiceDetailedReportCSV = (obj, result) => {
    // +(ifnull(si.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))
    // +ifnull(ii.ShippingCharge,0)
    var query = `Select i.InvoiceNo Inv,ii.PartNo ProductLineItem,
    so.SONo SalesOrder,c.CompanyName Cust,DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') Date,ii.Quantity,ii.Rate UnitPrice,(Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0)+ifnull(poi.ShippingCharge,0)) as UnitCost,
    ii.Discount,
    ROUND((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0)),2) as ExtPrice,
    ROUND((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(poi.ShippingCharge,0)),2) as ExtCost,
    ROUND(((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(poi.ShippingCharge,0)),2) GrossProfit,
    IF((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))>0,CONCAT(ROUND(((((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0))-((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(poi.ShippingCharge,0))*100)/((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0)),2),' %'),'-100 %')  as GrossProfitPercentage
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
  Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_address_book ab1 on ab1.AddressId=i.ShipAddressId
  LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
  LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
  LEFT JOIN tbl_terms as TERM ON TERM.TermsId = i.TermsId 
  where  i.IsDeleted=0   `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
    if (obj.CustomerGroupId != "") {
        query += " and c.CustomerGroupId In(" + obj.CustomerGroupId + ")  ";
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    where i.IsDeleted=0 `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
    if (Months != '' && Months != null) {
        query += ` and MONTHNAME(i.InvoiceDate) in(` + Months + `) `;
    }
    query += `  GROUP BY Year(i.InvoiceDate),MONTH(i.InvoiceDate),MONTHNAME(i.InvoiceDate),CONCAT(MONTHNAME(i.InvoiceDate),' ',Year(i.InvoiceDate)) `;
    // console.log("SQL=" + query);
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
    query = ` Select   c.CompanyName,Count(i.InvoiceId) as InvoiceCount,CONCAT('$',' ',FORMAT(ROUND(Sum(i.GrandTotal)),2)) as Amount
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
 ROUND(ifnull(sum(i.GrandTotal),0),2) as Price,
 ROUND(ifnull(sum(p.GrandTotal),0),2) as Cost,
 ROUND((ROUND(ifnull(sum(i.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2) as Profit,
CONCAT(ROUND(((ifnull(sum(i.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(i.GrandTotal),0),2),' ','%') Margin
From tbl_invoice i
 Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0 AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  
Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
where i.IsDeleted=0  `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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


    // console.log("SQL=" + query);
    return query;

};


InvoiceReportsModel.OverAllSummaryNew = (obj, result) => {
    // CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Price,
    // CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Cost,
    // CONCAT(CURL.CurrencySymbol,' ',ROUND((ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)),2)) as Profit,
    // CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2),' ','%') Margin

    var query = `SELECT  '' as IncludeRR, i.LocalCurrencyCode as LCC,
   
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2),2)) as Price,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2),2)) as Cost,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2)),2),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2),' ','%') Margin
 
    From tbl_invoice i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0   
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0  
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = ii.ItemLocalCurrencyCode AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0
    LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0 AND i.LocalCurrencyCode !="" `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    if (obj.CurrencyCode != '') {
        query += ` and ( i.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
    }
    if (obj.CreatedByLocation != '') {
        query += ` and ( i.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
    }
    if (obj.IncludeRR != '') {
        if (obj.IncludeRR == 1) { //RR Invoice
            query += ' and i.RRId > 0 AND i.MROId = 0  ';
        }
        if (obj.IncludeRR == 2) { //MRO Invoice
            query += ' and i.RRId = 0 AND i.MROId > 0  ';
        }
        if (obj.IncludeRR == 3) { //QT Invoice
            query += ' and i.RRId = 0 and i.MROId = 0  ';
        }
        if (obj.IncludeRR == 4) { //Shop Invoice
          query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
        }
        if (obj.IncludeRR == 5) { //MRO without shop
            query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
        }
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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
                case "CustomerGroupId":
                    // query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
                    query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
                    break;
                case "PartId":
                    query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CurrencyCode":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                case "CreatedByLocation":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                case "CustomerGroupId":
                    query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";

            }
        }
    }

    query += ` Group By i.LocalCurrencyCode  `;
    //console.log("Currency wise = " + query);
    return query;

};

InvoiceReportsModel.OverAllBaseSummaryNew = (obj, result) => {

    var query = `SELECT  '' as IncludeRR, i.BaseCurrencyCode as LCC,
     
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(ii.BaseRate,0)+Ifnull(ii.BaseTax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2),2)) as Price,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.BaseTax,0)))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2),2)) as Cost,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(ii.BaseRate,0)+Ifnull(ii.BaseTax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2) - ROUND(ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.BaseTax,0)) )*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2)),2),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.BaseRate,0)+Ifnull(ii.BaseTax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0)-ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.BaseTax,0)) )*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0))*100)/ifnull(sum(((Ifnull(ii.BaseRate,0)+Ifnull(ii.BaseTax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2),' ','%') Margin
   
    From tbl_invoice i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0   
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.BaseCurrencyCode AND CURL.IsDeleted = 0  
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemBaseCurrencyCode AND EXR.TargetCurrencyCode = ii.ItemBaseCurrencyCode AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0 AND i.BaseCurrencyCode !="" `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    if (obj.CurrencyCode != '') {
        query += ` and ( i.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
    }
    if (obj.CreatedByLocation != '') {
        query += ` and ( i.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
    }
    if (obj.IncludeRR != '') {
        if (obj.IncludeRR == 1) { //RR Invoice
            query += ' and i.RRId > 0 AND i.MROId = 0  ';
        }
        if (obj.IncludeRR == 2) { //MRO Invoice
            query += ' and i.RRId = 0 AND i.MROId > 0  ';
        }
        if (obj.IncludeRR == 3) { //QT Invoice
            query += ' and i.RRId = 0 and i.MROId = 0  ';
        }
        if (obj.IncludeRR == 4) { //Shop Invoice
          query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
        }
        if (obj.IncludeRR == 5) { //MRO without shop
            query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
        }
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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
                case "CustomerGroupId":
                    // query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
                    query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
                    break;
                case "PartId":
                    query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CurrencyCode":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                case "CreatedByLocation":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                case "CustomerGroupId":
                    query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";

            }
        }
    }

    query += ` Group By i.BaseCurrencyCode  `;
    // console.log("Base Currency Summary =" + query);
    return query;

};


//Get InvoiceByCustomer
InvoiceReportsModel.InvoiceByCustomer = (obj, result) => {

    var selectquery = `Select '-' as Status,'-' as InvoiceType,c.CustomerId,c.CompanyName,Count(i.InvoiceId) as InvoiceCount,
    CONCAT('$',' ',FORMAT(ROUND(Sum(i.GrandTotal),2),2)) as Amount,'-' as InvoiceDate,'-' as InvoiceDateTo,'-' as DueDate,
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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
    CONCAT('$',' ',FORMAT(ROUND(SUM(ii.price)/SUM(ii.Quantity)),2)) as AvgAmount,CONCAT('$',' ',FORMAT(ROUND(SUM(ii.price)),2)) as TotalAmount,
    '-' as InvoiceDate,'-' as InvoiceDateTo,'-' as DueDate,
    '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as  IncludeRR `;
    var query = ` From tbl_invoice i
  Left Join tbl_invoice_item ii on ii.InvoiceId=i.InvoiceId
  Left Join tbl_parts p on p.partId=ii.partId where i.IsDeleted=0 
  Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0`;

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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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

    // console.log("query = " + query);
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
  CONCAT('$',' ',FORMAT(ROUND(SUM(ii.price)/SUM(ii.Quantity)),2)) as AvgAmount,CONCAT('$',' ',FORMAT(ROUND(SUM(ii.price)),2)) as TotalAmount
  From tbl_invoice i
  Left Join tbl_invoice_item ii on ii.InvoiceId=i.InvoiceId
  Left Join tbl_parts p on p.partId=ii.partId where i.IsDeleted=0 
  Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0`;
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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

// New 



InvoiceReportsModel.InvoiceByMonthReportToExcelNew = (obj, result) => {
    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        if (val.Month != '')
            Ids = Ids + `'${val.Month}'` + `,`;
    }
    var Months = Ids.slice(0, -1);
    var query = ``;
    // CON.CountryName as CreatedByLocationName, CON.CountryCode as CreatedByLocationCode,i.CreatedByLocation,
    query = ` SELECT   CONCAT(MONTHNAME(i.InvoiceDate),' ',Year(i.InvoiceDate)) Month, i.LocalCurrencyCode as LCC,

    CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2)) as Price,
    CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2)) as Cost,
    CONCAT(CURL.CurrencySymbol,' ',ROUND((ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2)),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2),' ','%') Margin

    From tbl_invoice i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0 AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED} 
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0   AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = SO.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0  
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0 
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0  
    LEFT JOIN tbl_countries CON on CON.CountryId=i.CreatedByLocation AND CON.CountryId > 0
    LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0 AND i.LocalCurrencyCode != "" `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
    if (obj.CustomerGroupId != "") {
        // query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.CustomerGroupId + ")))   ";
        query += ` and c.CustomerGroupId in(` + obj.CustomerGroupId + `)`;
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
    if (Months != '' && Months != null) {
        query += ` and MONTHNAME(i.InvoiceDate) in(` + Months + `) `;
    }
    // console.log("obj.CurrencyCode", obj)
    if (obj.CurrencyCode && obj.CurrencyCode != "" && obj.CurrencyCode != "null" && obj.CurrencyCode != "undefined") {
        query += " and ( i.LocalCurrencyCode ='" + obj.CurrencyCode + "' ) ";
    }
    if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
        query += " and ( i.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
    }
    query += `  GROUP BY Year(i.InvoiceDate),MONTH(i.InvoiceDate),MONTHNAME(i.InvoiceDate),CONCAT(MONTHNAME(i.InvoiceDate),' ',Year(i.InvoiceDate)),i.LocalCurrencyCode `;
    //console.log("SQL=1" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};

InvoiceReportsModel.ParticularMonthInvoiceByCustomerToExcelNew = (obj, result) => {
    //      Old
    //      CONCAT('',' ',ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Price,
    //     CONCAT('',' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)) as Cost,
    //     CONCAT('',' ',ROUND((ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0),2)),2)) as Profit,
    //     CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))),0),2),' ','%') Margin  
    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        Ids += val.CustomerId + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    var query = ``;
    // CON.CountryName as CreatedByLocationName, CON.CountryCode as CreatedByLocationCode,i.CreatedByLocation,
    query = ` Select   c.CompanyName,    i.LocalCurrencyCode as LCC,
    
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2),2)) as Price,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2),2)) as Cost,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0),2)),2),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + ifnull(ii.BaseShippingCharge,0)),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2),' ','%') Margin
    From tbl_invoice i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0   AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = SO.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    Left Join tbl_customers c on c.CustomerId = i.CustomerId AND c.IsDeleted=0 
    LEFT JOIN tbl_currencies as CURL ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0  
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = ii.ItemLocalCurrencyCode AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    LEFT JOIN tbl_countries CON on CON.CountryId=i.CreatedByLocation AND CON.CountryId > 0
    where i.IsDeleted=0 AND i.LocalCurrencyCode != "" `;

    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
    if (obj.CustomerGroupId != "") {
        // query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.CustomerGroupId + "))) ";
        query += ` and c.CustomerGroupId in(` + obj.CustomerGroupId + `)`;
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
    if (CustomerIds != '' && CustomerIds != null) {
        query += ` and i.CustomerId in(` + CustomerIds + `)`;
    }
    if (obj.CurrencyCode != "" && obj.CurrencyCode != "null") {
        query += " and ( i.LocalCurrencyCode ='" + obj.CurrencyCode + "' ) ";
    }
    if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
        query += " and ( i.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
    }
    query += " Group By i.CustomerId, i.LocalCurrencyCode ";

    //console.log("SQL=" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};

// ToDo WithCurrency

InvoiceReportsModel.InvoiceByMonthWithCurrency = (obj, result) => {
    // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + ifnull(ii.ShippingCharge,0)),0),2),2)) as Price,
    // (SELECT CurrencySymbol FROM tbl_currencies as CURLL WHERE CURLL.CurrencyCode = ii.ItemLocalCurrencyCode AND CURLL.IsDeleted = 0)
    var selectquery = `
    SELECT  
    
    YEAR(i.InvoiceDate) Year,'-' as Status,'-' as InvoiceType,MONTHNAME(i.InvoiceDate) as Month ,'' as CreatedByLocation,'${obj.ReportCurrencyCode}' as ReportCurrencyCode,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Price,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Cost,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2)),2),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),' ','%') Margin,
  
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
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    LEFT JOIN tbl_countries CON on CON.CountryId=i.CreatedByLocation AND CON.CountryId > 0
    LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0 `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.IncludeRR != '') {
        if (obj.IncludeRR == 1) { //RR Invoice
            query += ' and i.RRId > 0 AND i.MROId = 0  ';
        }
        if (obj.IncludeRR == 2) { //MRO Invoice
            query += ' and i.RRId = 0 AND i.MROId > 0  ';
        }
        if (obj.IncludeRR == 3) { //QT Invoice
            query += ' and i.RRId = 0 and i.MROId = 0  ';
        }
        if (obj.IncludeRR == 4) { //Shop Invoice
          query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
        }
        if (obj.IncludeRR == 5) { //MRO without shop
            query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
        }
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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
                case "CustomerGroupId":
                    // query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
                    query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
                    break;
                case "PartId":
                    query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CurrencyCode":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                case "CreatedByLocation":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
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
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        TotalCountQuery += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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

InvoiceReportsModel.OverAllBaseSummaryWithCurrency = (obj, result) => {

    // Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    // Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    // Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    // Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    // left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0   
    // Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0
    // LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0     
    // LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemBaseCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    // where i.IsDeleted=0 AND i.BaseCurrencyCode !="" `;

    var query = `SELECT  '' as IncludeRR,'${obj.ReportCurrencyCode}' as ReportCurrencyCode,
     
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Price,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Cost,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2)),2),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),' ','%') Margin
   
    From tbl_invoice i
    
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId AND SO.IsDeleted = 0 AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as p on p.POId=SO.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = SO.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    LEFT JOIN tbl_countries CON on CON.CountryId=i.CreatedByLocation AND CON.CountryId > 0
    LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0 `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    if (obj.CurrencyCode != '') {
        query += ` and ( i.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
    }
    if (obj.CreatedByLocation != '') {
        query += ` and ( i.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
    }
    if (obj.IncludeRR != '') {
        if (obj.IncludeRR == 1) { //RR Invoice
            query += ' and i.RRId > 0 AND i.MROId = 0  ';
        }
        if (obj.IncludeRR == 2) { //MRO Invoice
            query += ' and i.RRId = 0 AND i.MROId > 0  ';
        }
        if (obj.IncludeRR == 3) { //QT Invoice
            query += ' and i.RRId = 0 and i.MROId = 0  ';
        }
        if (obj.IncludeRR == 4) { //Shop Invoice
          query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
        }
        if (obj.IncludeRR == 5) { //MRO without shop
            query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
        }
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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
                case "CustomerGroupId":
                    // query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
                    query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
                    break;
                case "PartId":
                    query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Status":
                    query += " and ( i.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CurrencyCode":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                case "CreatedByLocation":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                case "CustomerGroupId":
                    query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";

            }
        }
    }

    // query += ` Group By i.BaseCurrencyCode  `;
    // console.log("Base Currency Summary =" + query);
    return query;

};

InvoiceReportsModel.ParticularMonthInvoiceByCustomerWithCurrency = (obj, result) => {

    // Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    // Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    // Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    // Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    // left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    // Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
    // Left Join tbl_customers c on c.CustomerId=i.CustomerId
    // LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0 
    // LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    // LEFT JOIN tbl_countries CON on CON.CountryId=i.CreatedByLocation AND CON.CountryId > 0
    // where i.IsDeleted=0 AND i.LocalCurrencyCode != "" `;

    var selectquery = `Select '-' as Status,'-' as InvoiceType,c.CustomerId,c.CompanyName,Year(i.InvoiceDate) Year, i.LocalCurrencyCode as LCC,'' as CreatedByLocation,'${obj.ReportCurrencyCode}' as ReportCurrencyCode,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Price,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Cost,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2)),2),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),' ','%') Margin,
  


    '-' as InvoiceDate,'-' as InvoiceDateTo,'-' as DueDate,
    '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR,c.CustomerGroupId `;
    var query = ` 
     From tbl_invoice as i
    

    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId AND SO.IsDeleted = 0 AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as p on p.POId=SO.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = SO.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    LEFT JOIN tbl_countries CON on CON.CountryId=i.CreatedByLocation AND CON.CountryId > 0
    Left Join tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0 `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    if (obj.Year != '') {
        query += ` and Year(i.InvoiceDate) in(` + obj.Year + `) `;
    }
    if (obj.Month != '') {
        query += ` and MONTHNAME(i.InvoiceDate) in('` + obj.Month + `') `;
    }
    if (obj.CurrencyCode != '') {
        query += ` and ( i.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
    }
    if (obj.CreatedByLocation != '') {
        query += ` and ( i.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
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
                    if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
                    }
                    if (obj.columns[cvalue].search.value == 5) { //MRO without shop
                        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
                case "CurrencyCode":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                case "CreatedByLocation":
                    if (obj.columns[cvalue].search.value != "null") {
                        query += " and ( i.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
                    }
                    break;
                case "CustomerGroupId":
                    query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }
    query += ` Group By Year(i.InvoiceDate),i.CustomerId,i.LocalCurrencyCode  `;
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
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        TotalCountQuery += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    TotalCountQuery += ` Group By Year(i.InvoiceDate),i.CustomerId ) as A  `;
    var sqlArray = []; var obj = {};
    obj.query = query;
    obj.Countquery = Countquery;
    obj.TotalCountQuery = TotalCountQuery;

    sqlArray.push(obj);

    // console.log("query = " + obj.query);
    // console.log("Countquery = " + obj.Countquery);
    // console.log("TotalCountQuery = " + obj.TotalCountQuery);
    return sqlArray;//
};

InvoiceReportsModel.InvoiceByMonthReportToExcelWithCurrency = (obj, result) => {

    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        if (val.Month != '')
            Ids = Ids + `'${val.Month}'` + `,`;
    }
    var Months = Ids.slice(0, -1);
    var query = ``;
    // CON.CountryName as CreatedByLocationName, CON.CountryCode as CreatedByLocationCode,i.CreatedByLocation,
    query = ` SELECT   CONCAT(MONTHNAME(i.InvoiceDate),' ',Year(i.InvoiceDate)) Month, i.LocalCurrencyCode as LCC,'${obj.ReportCurrencyCode}' as ReportCurrencyCode,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Price,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Cost,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2)),2),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),' ','%') Margin

    From tbl_invoice i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0 AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED} 
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0   AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = SO.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0   
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0  
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = ii.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    LEFT JOIN tbl_countries CON on CON.CountryId=i.CreatedByLocation AND CON.CountryId > 0
    LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
    where i.IsDeleted=0 AND i.LocalCurrencyCode != "" `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
    if (obj.CustomerGroupId != "") {
        // query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.CustomerGroupId + "))) ";
        query += ` and c.CustomerGroupId in(` + obj.CustomerGroupId + `)`;
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
    if (Months != '' && Months != null) {
        query += ` and MONTHNAME(i.InvoiceDate) in(` + Months + `) `;
    }
    // console.log("obj.CurrencyCode", obj)
    if (obj.CurrencyCode && obj.CurrencyCode != "" && obj.CurrencyCode != "null" && obj.CurrencyCode != "undefined") {
        query += " and ( i.LocalCurrencyCode ='" + obj.CurrencyCode + "' ) ";
    }
    if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
        query += " and ( i.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
    }
    query += `  GROUP BY Year(i.InvoiceDate),MONTH(i.InvoiceDate),MONTHNAME(i.InvoiceDate),CONCAT(MONTHNAME(i.InvoiceDate),' ',Year(i.InvoiceDate)),i.LocalCurrencyCode `;
    //console.log("SQL=1" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};

InvoiceReportsModel.ParticularMonthInvoiceByCustomerToExcelWithCurrency = (obj, result) => {

    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        Ids += val.CustomerId + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    var query = ``;
    // CON.CountryName as CreatedByLocationName, CON.CountryCode as CreatedByLocationCode,i.CreatedByLocation,
    query = ` Select   c.CompanyName,    i.LocalCurrencyCode as LCC,'${obj.ReportCurrencyCode}' as ReportCurrencyCode,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Price,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Cost,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2)),2),2)) as Profit,
    CONCAT(ROUND(((ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0))*100)/ifnull(sum(((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0)) + (ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),' ','%') Margin
    From tbl_invoice i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
    Left JOIN tbl_sales_order as SO on SO.SOId=i.SOId   AND SO.IsDeleted = 0   AND SO.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po p on p.POId=SO.POId  AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = SO.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    Left JOIN tbl_repair_request as RR ON RR.RRId = i.RRId  AND RR.IsDeleted = 0 
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    Left Join tbl_customers c on c.CustomerId = i.CustomerId AND c.IsDeleted=0 
    LEFT JOIN tbl_currencies as CURL ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0  
    LEFT JOIN tbl_currencies as CURLL ON CURLL.CurrencyCode = i.LocalCurrencyCode AND CURLL.IsDeleted = 0  
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    LEFT JOIN tbl_countries CON on CON.CountryId=i.CreatedByLocation AND CON.CountryId > 0
    where i.IsDeleted=0 AND i.LocalCurrencyCode != "" `;

    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
    if (obj.CustomerGroupId != "") {
        // query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.CustomerGroupId + "))) ";
        query += ` and c.CustomerGroupId in(` + obj.CustomerGroupId + `)`;
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
    if (CustomerIds != '' && CustomerIds != null) {
        query += ` and i.CustomerId in(` + CustomerIds + `)`;
    }
    if (obj.CurrencyCode != "" && obj.CurrencyCode != "null") {
        query += " and ( i.LocalCurrencyCode ='" + obj.CurrencyCode + "' ) ";
    }
    if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
        query += " and ( i.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
    }
    query += " Group By i.CustomerId, i.LocalCurrencyCode ";

    //console.log("SQL=" + query);
    con.query(query, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { ExcelData: res });
    });
};

InvoiceReportsModel.InvoiceDetailedReportWithCurrency = (obj, result) => {

    var Ids = ``;
    for (let val of obj.InvoiceReports) {
        Ids += val.CustomerId + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);
    var query = ``;
    query = ` Select i.InvoiceNo InvoiceNo,ii.PartNo PartNo,
    so.SONo SONo,c.CompanyName Customer,DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') Date,ii.Quantity,i.LocalCurrencyCode as Currency, '${obj.ReportCurrencyCode}' as ReportCurrencyCode,
    ii.Rate UnitPrice,
    (   ((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))+Ifnull(poi.ShippingCharge,0)) * ifnull(EXR.ExchangeRate,1)   ) as UnitCost,
    ii.Discount,
    FORMAT(ROUND((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+ifnull(ii.ShippingCharge,0)),2),2) as OriginalPrice,
    FORMAT(ROUND(((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0))+(ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),2),2) as ExtPrice,
    FORMAT(ROUND(((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0))+(ifnull(poi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),2),2) as ExtCost,
    FORMAT(ROUND((((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0))+(ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))-(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0))+(ifnull(poi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),2),2) GrossProfit,
    IF((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))>0,CONCAT(ROUND(((((((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+(ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))-(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0))+(ifnull(poi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))*100)/((Ifnull(ii.Rate,0)+Ifnull(ii.Tax,0))*Ifnull(ii.Quantity,0))+(ifnull(ii.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),2),' %'),'-100 %')  as GrossProfitPercentage

    From tbl_invoice as i
    Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0    
    Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
    Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0    
    Left Join tbl_customers c on c.CustomerId=i.CustomerId
    Left JOIN tbl_mro as mro  ON mro.MROId = i.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    where i.IsDeleted=0  AND i.LocalCurrencyCode !="" `;
    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
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
    if (obj.IncludeRR == 4) { //Shop Invoice
        query += ' and i.RRId = 0 AND i.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
        query += ' and i.RRId = 0 AND i.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
    if (obj.CurrencyCode != "") { //QT Invoice
        query += " and  i.LocalCurrencyCode ='" + obj.CurrencyCode + "'  ";
    }
    if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
        query += " and ( i.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
    }
    if (CustomerIds != '' && CustomerIds != null) {
        query += ` and i.CustomerId in(` + CustomerIds + `)`;
    }
    if (obj.CustomerGroupId != '' && obj.CustomerGroupId != null) {
        query += ` and c.CustomerGroupId in(` + obj.CustomerGroupId + `)`;
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





module.exports = InvoiceReportsModel;
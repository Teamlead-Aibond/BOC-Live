const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var async = require('async');
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
const SalesOrderReportsModel = function (obj) {

  this.DateRequested = obj.DateRequested ? obj.DateRequested : '';
  this.DateRequestedTo = obj.DateRequestedTo ? obj.DateRequestedTo : '';
  this.DueDate = obj.DueDate ? obj.DueDate : '';
  this.DueDateTo = obj.DueDateTo ? obj.DueDateTo : '';
  this.Created = obj.Created ? obj.Created : '';
  this.CreatedTo = obj.CreatedTo ? obj.CreatedTo : '';
  this.CustomerId = obj.CustomerId ? obj.CustomerId : '';
  this.PartId = obj.PartId ? obj.PartId : '';
  this.SOType = obj.SOType ? obj.SOType : 0;
  this.Status = obj.Status ? obj.Status : 0;
  this.IncludeRR = obj.IncludeRR ? obj.IncludeRR : 100;
  this.SalesOrderReports = obj.SalesOrderReports ? obj.SalesOrderReports : '';
  this.Month = obj.Month ? obj.Month : '';
  this.Year = obj.Year ? obj.Year : '';

  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;

  const TokenGlobalIdentityId = global.authuser.IdentityId ? global.authuser.IdentityId : 0;
  this.TokenIdentityId = (obj.authuser && obj.authuser.IdentityId) ? obj.authuser.IdentityId : TokenGlobalIdentityId;

  const TokenGlobalIdentityType = global.authuser.IdentityType ? global.authuser.IdentityType : 0;
  this.TokenIdentityType = (obj.authuser && obj.authuser.IdentityType) ? obj.authuser.IdentityType : TokenGlobalIdentityType;

  const TokenIsRestrictedCustomerAccess = global.authuser.IsRestrictedCustomerAccess ? global.authuser.IsRestrictedCustomerAccess : 0;
  this.TokenIsRestrictedCustomerAccess = (obj.authuser && obj.authuser.IsRestrictedCustomerAccess) ? obj.authuser.IsRestrictedCustomerAccess : TokenIsRestrictedCustomerAccess;

  const TokenMultipleCustomerIds = global.authuser.MultipleCustomerIds ? global.authuser.MultipleCustomerIds : 0;
  this.TokenMultipleCustomerIds = (obj.authuser && obj.authuser.MultipleCustomerIds) ? obj.authuser.MultipleCustomerIds : TokenMultipleCustomerIds;

  const TokenMultipleAccessIdentityIds = global.authuser.MultipleAccessIdentityIds ? global.authuser.MultipleAccessIdentityIds : 0;
  this.TokenMultipleAccessIdentityIds = (obj.authuser && obj.authuser.MultipleAccessIdentityIds) ? obj.authuser.MultipleAccessIdentityIds : TokenMultipleAccessIdentityIds;


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


//Get SalesByMonth
SalesOrderReportsModel.SalesByMonth = (obj, result) => {

  var selectquery = ` SELECT YEAR(s.DateRequested) Year,'-' as Status,'-' as SOType,
  MONTHNAME(s.DateRequested) as Month ,
  CONCAT('$',' ',ROUND(ifnull(sum(s.GrandTotal),0),2)) as Price,
  CONCAT('$',' ',ROUND(ifnull(sum(p.GrandTotal),0),2)) as Cost,
  CONCAT('$',' ',ROUND((ROUND(ifnull(sum(s.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum(s.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(s.GrandTotal),0),2),' ','%') Margin,
  '-' as CustomerId,'-' as PartId,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;
  var query = ` From tbl_sales_order s  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 `;

  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.TokenMultipleCustomerIds}) `;
  }

  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }

  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "Year":
          query += " and YEAR(s.DateRequested) = '" + obj.columns[cvalue].search.value + "'  ";
          break;
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 1) { //RR Invoice
            query += ' and s.RRId > 0 AND s.MROId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0  ';
          }
          if (obj.columns[cvalue].search.value == 3) { //QT Invoice
            query += ' and s.RRId = 0 and s.MROId = 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( s.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( s.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( s.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( s.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( s.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( s.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and  s.CustomerId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "PartId":
          query += " and  RR.PartId = " + obj.columns[cvalue].search.value + " ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }//
  }
  query += ` GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested) `;
  var Countquery = ` Select count(Counts) as recordsFiltered from (Select count(MONTHNAME(s.DateRequested)) Counts ` + query + ` ) as A `;
  var i = 0;
  if (obj.order.length > 0) {
    query += " ORDER BY ";
    for (i = 0; i < obj.order.length; i++) {
      if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
      {
        switch (obj.columns[obj.order[i].column].name) {
          case "Year":
            query += " MONTH(s.DateRequested) " + obj.order[i].dir + " ";
            break;
          case "Month":
            query += " MONTH(s.DateRequested) " + obj.order[i].dir + " ";
            break;
          default:
            query += " MONTH(s.DateRequested) " + obj.order[i].dir + " ";
        }
      }
    }
  } else {
    query += " ORDER BY MONTH(s.DateRequested) DESC ";
  }
  if (obj.start != "-1" && obj.length != "-1") {
    query += " LIMIT " + obj.start + "," + (obj.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(MONTHNAME(s.DateRequested)) as Counts 
  From tbl_sales_order s
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 
  `;
  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.TokenMultipleCustomerIds}) `;
  }
  TotalCountQuery += `  GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested)) as A `;
  var sqlArray = []; var obj = {};



  obj.query = query;
  obj.Countquery = Countquery;
  obj.TotalCountQuery = TotalCountQuery;

  sqlArray.push(obj);

  // console.log("query = " + obj.query);
  // console.log("Countquery = " + obj.Countquery);
  // console.log("TotalCountQuery = " + obj.TotalCountQuery);
  return sqlArray;

};
SalesOrderReportsModel.SalesByMonthNew = (obj, result) => {

  var selectquery = ` SELECT YEAR(s.DateRequested) Year,'-' as Status,'-' as SOType,
  MONTHNAME(s.DateRequested) as Month ,
 CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)) as Price,
 CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)) as Cost,
 CONCAT('$',' ',ROUND((ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)),2)) as Profit,
 CONCAT(ROUND(((ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2),' ','%') Margin,
  
  '-' as CustomerId,'-' as PartId,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;
  var query = ` From tbl_sales_order s  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 `;

  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.TokenMultipleCustomerIds}) `;
  }

  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }

  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "Year":
          query += " and YEAR(s.DateRequested) = '" + obj.columns[cvalue].search.value + "'  ";
          break;
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 1) { //RR Invoice
            query += ' and s.RRId > 0 AND s.MROId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0  ';
          }
          if (obj.columns[cvalue].search.value == 3) { //QT Invoice
            query += ' and s.RRId = 0 and s.MROId = 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( s.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( s.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( s.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( s.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( s.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( s.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and  s.CustomerId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "PartId":
          query += " and  RR.PartId = " + obj.columns[cvalue].search.value + " ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }//
  }
  query += ` GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested) `;
  var Countquery = ` Select count(Counts) as recordsFiltered from (Select count(MONTHNAME(s.DateRequested)) Counts ` + query + ` ) as A `;
  var i = 0;
  if (obj.order.length > 0) {
    query += " ORDER BY ";
    for (i = 0; i < obj.order.length; i++) {
      if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
      {
        switch (obj.columns[obj.order[i].column].name) {
          case "Year":
            query += " MONTH(s.DateRequested) " + obj.order[i].dir + " ";
            break;
          case "Month":
            query += " MONTH(s.DateRequested) " + obj.order[i].dir + " ";
            break;
          default:
            query += " MONTH(s.DateRequested) " + obj.order[i].dir + " ";
        }
      }
    }
  } else {
    query += " ORDER BY MONTH(s.DateRequested) DESC ";
  }
  if (obj.start != "-1" && obj.length != "-1") {
    query += " LIMIT " + obj.start + "," + (obj.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(MONTHNAME(s.DateRequested)) as Counts 
  From tbl_sales_order s
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 
  `;
  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.TokenMultipleCustomerIds}) `;
  }
  TotalCountQuery += `  GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested)) as A `;
  var sqlArray = []; var obj = {};



  obj.query = query;
  obj.Countquery = Countquery;
  obj.TotalCountQuery = TotalCountQuery;

  sqlArray.push(obj);

  // console.log("query = " + obj.query);
  //console.log("Countquery = " + obj.Countquery);
  //console.log("TotalCountQuery = " + obj.TotalCountQuery);
  return sqlArray;

};





SalesOrderReportsModel.ParticularMonthSOByCustomer = (obj, result) => {

  var selectquery = `SELECT '-' as Status,'-' as SOType,
    c.CustomerId,c.CompanyName,Year(s.DateRequested) Year,
    CONCAT('$',' ',ROUND(ifnull(sum(s.GrandTotal),0),2)  ) as Price,
    CONCAT('$',' ',ROUND(ifnull(sum(p.GrandTotal),0),2) ) as Cost,
    CONCAT('$',' ',ROUND((ROUND(ifnull(sum(s.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2) ) Profit,
    CONCAT(ROUND(((ifnull(sum(s.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(s.GrandTotal),0), 2),' ','%') Margin  ,'-' as PartId,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;
  var query = ` From tbl_sales_order s  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  where  s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0  `;
  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.TokenMultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {

      switch (obj.columns[cvalue].name) {
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 1) { //RR Invoice
            query += ' and s.RRId > 0 AND s.MROId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0  ';
          }
          if (obj.columns[cvalue].search.value == 3) { //QT Invoice
            query += ' and s.RRId = 0 and s.MROId = 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( s.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( s.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( s.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( s.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( s.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( s.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and  s.CustomerId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "PartId":
          query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By Year(s.DateRequested),s.CustomerId  `;
  var Countquery = `Select Count(Counts) recordsFiltered from ( Select count(s.SOId) as Counts ` + query + ` ) as A `;

  var i = 0;
  if (obj.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < obj.order.length; i++) {
    if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
    {
      switch (obj.columns[obj.order[i].column].name) {
        case "CustomerId":
          query += " s.CustomerId " + obj.order[i].dir + " ";
          break;
        default:
          query += " s.CustomerId  " + obj.order[i].dir + " ";
      }
    }
  }
  query = selectquery + query;

  var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(*) as Counts 
    From tbl_sales_order s 
    Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  where  s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0  `;
  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.TokenMultipleCustomerIds}) `;
  }
  TotalCountQuery += ` Group By Year(s.DateRequested),s.CustomerId ) as A  `;
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

SalesOrderReportsModel.ParticularMonthSOByCustomerNew = (obj, result) => {

  var selectquery = `SELECT '-' as Status,'-' as SOType,
    c.CustomerId,c.CompanyName,Year(s.DateRequested) Year,  

 CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)) as Price,
 CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)) as Cost,
 CONCAT('$',' ',ROUND((ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)),2)) as Profit,
 CONCAT(ROUND(((ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2),' ','%') Margin,
    
    '-' as PartId,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;
  var query = ` From tbl_sales_order s  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId AND soi.IsDeleted = 0  
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  where  s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0  `;
  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.TokenMultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {

      switch (obj.columns[cvalue].name) {
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 1) { //RR Invoice
            query += ' and s.RRId > 0 AND s.MROId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0  ';
          }
          if (obj.columns[cvalue].search.value == 3) { //QT Invoice
            query += ' and s.RRId = 0 and s.MROId = 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( s.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( s.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( s.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( s.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( s.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( s.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and  s.CustomerId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "PartId":
          query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By Year(s.DateRequested),s.CustomerId  `;
  var Countquery = `Select Count(Counts) recordsFiltered from ( Select count(s.SOId) as Counts ` + query + ` ) as A `;

  var i = 0;
  if (obj.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < obj.order.length; i++) {
    if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
    {
      switch (obj.columns[obj.order[i].column].name) {
        case "CustomerId":
          query += " s.CustomerId " + obj.order[i].dir + " ";
          break;
        default:
          query += " s.CustomerId  " + obj.order[i].dir + " ";
      }
    }
  }
  query = selectquery + query;

  var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(*) as Counts 
    From tbl_sales_order s 
    Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  where  s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0  `;
  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.TokenMultipleCustomerIds}) `;
  }
  TotalCountQuery += ` Group By Year(s.DateRequested),s.CustomerId ) as A  `;
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



SalesOrderReportsModel.ParticularMonthSOByCustomerToExcel = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    Ids += val.CustomerId + `,`;
  }
  var CustomerIds = Ids.slice(0, -1);
  var query = ``;
  query = ` SELECT   c.CompanyName,      
    CONCAT('',' ',ROUND(ifnull(sum(s.GrandTotal),0),2)  ) as Price,
    CONCAT('',' ',ROUND(ifnull(sum(p.GrandTotal),0),2) ) as Cost,
    CONCAT('',' ',ROUND((ROUND(ifnull(sum(s.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2) ) Profit,
    CONCAT(ROUND(((ifnull(sum(s.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(s.GrandTotal),0), 2),' ','%') Margin
  From tbl_sales_order s
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 `;
  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.TokenMultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.DateRequested != "") {
    query += " and ( s.DateRequested >='" + obj.DateRequested + "' ) ";
  }
  if (obj.DateRequestedTo != "") {
    query += " and ( s.DateRequested <='" + obj.DateRequestedTo + "' ) ";
  }
  if (obj.DueDate != "") {
    query += " and ( s.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (obj.DueDateTo != "") {
    query += " and ( s.DueDate <='" + obj.DueDateTo + "' ) ";
  }
  if (obj.Created != "") {
    query += " and ( s.Created >='" + obj.Created + "' ) ";
  }
  if (obj.PartId != "") {
    query += " and  RR.PartId ='" + obj.PartId + "'  ";
  }
  if (obj.CreatedTo != "") {
    query += " and ( s.Created <='" + obj.CreatedTo + "' ) ";
  }
  if (obj.CustomerId != "") {
    query += " and  s.CustomerId In (" + obj.CustomerId + ") ";
  }
  if (obj.SOType != "") {
    query += " and ( s.SOType ='" + obj.SOType + "' ) ";
  }
  if (obj.Status != "") {
    query += " and ( s.Status ='" + obj.Status + "' ) ";
  }
  if (obj.IncludeRR == 1) { //RR Invoice
    query += ' and s.RRId > 0 AND s.MROId = 0  ';
  }
  if (obj.IncludeRR == 2) { //MRO Invoice
    query += ' and s.RRId = 0 AND s.MROId > 0  ';
  }
  if (obj.IncludeRR == 3) { //QT Invoice
    query += ' and s.RRId = 0 and s.MROId = 0  ';
  }
  if (CustomerIds != '' && CustomerIds != null) {
    query += ` and s.CustomerId in(` + CustomerIds + `)`;
  }
  query += " Group By s.CustomerId ";

  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

SalesOrderReportsModel.SODetailedReport = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    Ids += val.CustomerId + `,`;
  }
  var CustomerIds = Ids.slice(0, -1);
  var query = ``;
  query = ` Select  s.SONo SalesOrder,si.PartNo ProductLineItem,IF(s.RRId>0, s.RRId, IF(s.MROId>0, s.MROId, 0)) as RROrMRO,
  c.CompanyName Cust,DATE_FORMAT(s.DateRequested,'%m/%d/%Y') Date,si.Quantity,si.Rate UnitPrice,(Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0)) as UnitCost,
  si.Discount,
  ROUND(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0)),2) as ExtPrice,
  ROUND(((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(pi.Quantity,0)),2) as ExtCost,  
  ROUND((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))-((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(pi.Quantity,0))),2) GrossProfit, 
  IF((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))>0,CONCAT(ROUND((((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))-((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(pi.Quantity,0)))*100)/((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),2),' %'),'-100 %')  as GrossProfitPercentage
  From tbl_sales_order s
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item pi on pi.POItemId=si.POItemId AND pi.IsDeleted = 0
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED}  AND s.IsDeleted=0   `;
  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.TokenMultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.DateRequested != "") {
    query += " and ( s.DateRequested >='" + obj.DateRequested + "' ) ";
  }
  if (obj.DateRequestedTo != "") {
    query += " and ( s.DateRequested <='" + obj.DateRequestedTo + "' ) ";
  }
  if (obj.DueDate != "") {
    query += " and ( s.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (obj.DueDateTo != "") {
    query += " and ( s.DueDate <='" + obj.DueDateTo + "' ) ";
  }
  if (obj.Created != "") {
    query += " and ( s.Created >='" + obj.Created + "' ) ";
  }
  if (obj.CreatedTo != "") {
    query += " and ( s.Created <='" + obj.CreatedTo + "' ) ";
  }
  if (obj.CustomerId != "") {
    query += " and  s.CustomerId In (" + obj.CustomerId + ") ";
  }
  if (obj.SOType != "") {
    query += " and ( s.SOType ='" + obj.SOType + "' ) ";
  }
  if (obj.Status != "") {
    query += " and ( s.Status ='" + obj.Status + "' ) ";
  }
  if (obj.IncludeRR == 1) { //RR Invoice
    query += ' and s.RRId > 0 AND s.MROId = 0  ';
  }
  if (obj.IncludeRR == 2) { //MRO Invoice
    query += ' and s.RRId = 0 AND s.MROId > 0  ';
  }
  if (obj.IncludeRR == 3) { //QT Invoice
    query += ' and s.RRId = 0 and s.MROId = 0  ';
  }
  if (CustomerIds != '' && CustomerIds != null) {
    query += ` and s.CustomerId in(` + CustomerIds + `)`;
  }
  query += ` order By s.DateRequested desc `;
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

SalesOrderReportsModel.SODetailedReportNew = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    Ids += val.CustomerId + `,`;
  }
  var CustomerIds = Ids.slice(0, -1);
  var query = ``;
  query = ` Select  s.SONo SalesOrder,si.PartNo ProductLineItem,IF(s.RRId>0, s.RRId, IF(s.MROId>0, s.MROId, 0)) as RROrMRO,
  c.CompanyName Cust,DATE_FORMAT(s.DateRequested,'%m/%d/%Y') Date,si.Quantity,si.Rate UnitPrice,(Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0)) as UnitCost,
  si.Discount,
  ROUND(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0)),2) as ExtPrice,
  ROUND(((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(si.Quantity,0)),2) as ExtCost,  
  ROUND((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))-((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(si.Quantity,0))),2) GrossProfit, 
  IF((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))>0,CONCAT(ROUND((((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))-((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(si.Quantity,0)))*100)/((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),2),' %'),'-100 %')  as GrossProfitPercentage
  From tbl_sales_order s
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item pi on pi.POItemId=si.POItemId AND pi.IsDeleted = 0
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED}  AND s.IsDeleted=0   `;

  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.TokenMultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.DateRequested != "") {
    query += " and ( s.DateRequested >='" + obj.DateRequested + "' ) ";
  }
  if (obj.DateRequestedTo != "") {
    query += " and ( s.DateRequested <='" + obj.DateRequestedTo + "' ) ";
  }
  if (obj.DueDate != "") {
    query += " and ( s.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (obj.DueDateTo != "") {
    query += " and ( s.DueDate <='" + obj.DueDateTo + "' ) ";
  }
  if (obj.Created != "") {
    query += " and ( s.Created >='" + obj.Created + "' ) ";
  }
  if (obj.CreatedTo != "") {
    query += " and ( s.Created <='" + obj.CreatedTo + "' ) ";
  }
  if (obj.CustomerId != "") {
    query += " and  s.CustomerId In (" + obj.CustomerId + ") ";
  }
  if (obj.SOType != "") {
    query += " and ( s.SOType ='" + obj.SOType + "' ) ";
  }
  if (obj.Status != "") {
    query += " and ( s.Status ='" + obj.Status + "' ) ";
  }
  if (obj.IncludeRR == 1) { //RR Invoice
    query += ' and s.RRId > 0 AND s.MROId = 0  ';
  }
  if (obj.IncludeRR == 2) { //MRO Invoice
    query += ' and s.RRId = 0 AND s.MROId > 0  ';
  }
  if (obj.IncludeRR == 3) { //QT Invoice
    query += ' and s.RRId = 0 and s.MROId = 0  ';
  }
  if (CustomerIds != '' && CustomerIds != null) {
    query += ` and s.CustomerId in(` + CustomerIds + `)`;
  }
  query += ` order By s.DateRequested desc `;
  //console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};






SalesOrderReportsModel.SalesByMonthReportToExcel = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    if (val.Month != '')
      Ids = Ids + `'${val.Month}'` + `,`;
  }
  var Months = Ids.slice(0, -1);
  var query = ``;
  query = ` SELECT CONCAT(MONTHNAME(s.DateRequested),' ',Year(s.DateRequested)) Month, 

  CONCAT('','',ROUND(ifnull(sum(s.GrandTotal),0),2)) as Price,
  CONCAT('','',ROUND(ifnull(sum(p.GrandTotal),0),2)) as Cost,
  CONCAT('','',ROUND((ROUND(ifnull(sum(s.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum(s.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(s.GrandTotal),0),2),' ','%') Margin

  From tbl_sales_order s 
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 `;
  if (obj.TokenIdentityType == 0 && obj.TokenIsRestrictedCustomerAccess == 1 && obj.TokenMultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.DateRequested != "") {
    query += " and ( s.DateRequested >='" + obj.DateRequested + "' ) ";
  }
  if (obj.DateRequestedTo != "") {
    query += " and ( s.DateRequested <='" + obj.DateRequestedTo + "' ) ";
  }
  if (obj.DueDate != "") {
    query += " and ( s.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (obj.DueDateTo != "") {
    query += " and ( s.DueDate <='" + obj.DueDateTo + "' ) ";
  }
  if (obj.Created != "") {
    query += " and ( s.Created >='" + obj.Created + "' ) ";
  }
  if (obj.CreatedTo != "") {
    query += " and ( s.Created <='" + obj.CreatedTo + "' ) ";
  }
  if (obj.PartId != "") {
    query += " and  RR.PartId ='" + obj.PartId + "'  ";
  }
  if (obj.CustomerId != "") {
    query += " and  s.CustomerId In (" + obj.CustomerId + ") ";
  }
  if (obj.SOType != "") {
    query += " and ( s.SOType ='" + obj.SOType + "' ) ";
  }
  if (obj.Status != "") {
    query += " and ( s.Status ='" + obj.Status + "' ) ";
  }
  if (obj.IncludeRR == 1) { //RR Invoice
    query += ' and s.RRId > 0 AND s.MROId = 0  ';
  }
  if (obj.IncludeRR == 2) { //MRO Invoice
    query += ' and s.RRId = 0 AND s.MROId > 0  ';
  }
  if (obj.IncludeRR == 3) { //QT Invoice
    query += ' and s.RRId = 0 and s.MROId = 0  ';
  }
  if (Months != '' && Months != null) {
    query += ` and MONTHNAME(s.DateRequested) in(` + Months + `)`;
  }
  query += `  GROUP BY Year(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested),CONCAT(MONTHNAME(s.DateRequested),' ',Year(s.DateRequested)) `;
  //console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};



SalesOrderReportsModel.OverAllSummary = (obj, result) => {

  var TokenIdentityType = getLogInIdentityType(obj);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(obj);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(obj);

  var query = `  SELECT
  CONCAT('$',' ',ROUND(ifnull(sum(s.GrandTotal),0),2)) as Price,
  CONCAT('$',' ',ROUND(ifnull(sum(p.GrandTotal),0),2)) as Cost,
  CONCAT('$',' ',ROUND((ROUND(ifnull(sum(s.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum(s.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(s.GrandTotal),0),2),' ','%') Margin
  From tbl_sales_order s  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 `;

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {

      switch (obj.columns[cvalue].name) {
        case "Year":
          query += " and Year(s.DateRequested)='" + obj.columns[cvalue].search.value + "'  ";
          break;
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 1) { //RR Invoice
            query += ' and s.RRId > 0 AND s.MROId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0  ';
          }
          if (obj.columns[cvalue].search.value == 3) { //QT Invoice
            query += ' and s.RRId = 0 and s.MROId = 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( s.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( s.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( s.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( s.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( s.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "PartId":
          query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( s.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and  s.CustomerId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  return query;

  /*var query1 = `  SELECT
  0 as Price,
  0 as Cost,
  0 Profit,
  0 Margin
  From tbl_sales_order s  WHERE 1=2 `;
  return query1;*/

};




SalesOrderReportsModel.OverAllSummaryNew = (obj, result) => {

  var query = `  SELECT

  CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2)) as Price,
  CONCAT('$',' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(si.Quantity,0))),0),2)) as Cost,
  CONCAT('$',' ',ROUND((ROUND(ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(si.Quantity,0))),0),2)),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(si.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2),' ','%') Margin
   
  From tbl_sales_order s  
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item poi on poi.POItemId=si.POItemId AND poi.IsDeleted = 0
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 `;

  if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {

      switch (obj.columns[cvalue].name) {
        case "Year":
          query += " and Year(s.DateRequested)='" + obj.columns[cvalue].search.value + "'  ";
          break;
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 1) { //RR Invoice
            query += ' and s.RRId > 0 AND s.MROId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0  ';
          }
          if (obj.columns[cvalue].search.value == 3) { //QT Invoice
            query += ' and s.RRId = 0 and s.MROId = 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( s.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( s.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( s.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( s.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( s.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "PartId":
          query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( s.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and  s.CustomerId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  return query;

  /*var query1 = `  SELECT
  0 as Price,
  0 as Cost,
  0 Profit,
  0 Margin
  From tbl_sales_order s  WHERE 1=2 `;
  return query1;*/

};






























//Get SalesOrderByCustomerReportToExcel
SalesOrderReportsModel.SalesOrderByCustomerReportToExcel = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    Ids += val.CustomerId + `,`;
  }
  var CustomerIds = Ids.slice(0, -1);
  var query = ``;
  query = ` Select c.CompanyName,Count(s.SOId) as SOCount,CONCAT('$',' ',ROUND(Sum(GrandTotal))) as Amount
  From tbl_sales_order s
  Left Join tbl_customers c on c.CustomerId=s.CustomerId where s.IsDeleted=0 `;
  if (obj.DateRequested != "") {
    query += " and ( s.DateRequested >='" + obj.DateRequested + "' ) ";
  }
  if (obj.DateRequestedTo != "") {
    query += " and ( s.DateRequested <='" + obj.DateRequestedTo + "' ) ";
  }
  if (obj.DueDate != "") {
    query += " and ( s.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (obj.DueDateTo != "") {
    query += " and ( s.DueDate <='" + obj.DueDateTo + "' ) ";
  }
  if (obj.Created != "") {
    query += " and ( s.Created >='" + obj.Created + "' ) ";
  }
  if (obj.CreatedTo != "") {
    query += " and ( s.Created <='" + obj.CreatedTo + "' ) ";
  }
  if (obj.CustomerId != "") {
    query += " and ( s.CustomerId ='" + obj.CustomerId + "' ) ";
  }
  if (obj.SOType != "") {
    query += " and ( s.SOType ='" + obj.SOType + "' ) ";
  }
  if (obj.Status != "") {
    query += " and ( s.Status ='" + obj.Status + "' ) ";
  }
  if (obj.IncludeRR == 1) { //RR Invoice
    query += ' and s.RRId > 0 AND s.MROId = 0  ';
  }
  if (obj.IncludeRR == 2) { //MRO Invoice
    query += ' and s.RRId = 0 AND s.MROId > 0  ';
  }
  if (obj.IncludeRR == 3) { //QT Invoice
    query += ' and s.RRId = 0 and s.MROId = 0  ';
  }
  if (CustomerIds != '' && CustomerIds != null) {
    query += ` and s.CustomerId in(` + CustomerIds + `)`;
  }
  query += " Group By s.CustomerId ";

  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};
//Get SalesByParts
SalesOrderReportsModel.SalesByParts = (obj, result) => {

  var query = "";
  selectquery = "";
  //
  selectquery = `Select '-' as Status,'-' as SOType,'-'as CustomerId,p.PartId,p.PartNo,SUM(si.Quantity) as Quantity,
  CONCAT('$',' ',ROUND(SUM(si.price)/SUM(si.Quantity))) as AvgAmount,CONCAT('$',' ',ROUND(SUM(si.price))) as TotalAmount,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,
  '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as  IncludeRR `;
  query = query + ` From tbl_sales_order s
  Left Join tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0 
  Left Join tbl_parts p on p.partId=si.partId where s.IsDeleted=0 `;

  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 1) { //RR Invoice
            query += ' and s.RRId > 0 AND s.MROId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0  ';
          }
          if (obj.columns[cvalue].search.value == 3) { //QT Invoice
            query += ' and s.RRId = 0 and s.MROId = 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( s.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( s.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( s.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( s.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( s.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( s.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and ( s.CustomerId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "PartId":
          query += " and ( si.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  query += ` Group By si.PartId `;
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
          query += " SUM(si.Quantity) " + obj.order[i].dir + " ";
          break;
        case "AvgAmount":
          query += " ROUND(SUM(si.price)/SUM(si.Quantity)) " + obj.order[i].dir + " ";
          break;
        case "TotalAmount":
          query += " ROUND(SUM(si.price)) " + obj.order[i].dir + " ";
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
  From tbl_sales_order s
  Left Join tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0 
  Left Join tbl_parts p on p.partId=si.partId where s.IsDeleted=0  Group By si.PartId) as A `;

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

      // if (results[0][0].length > 0) {
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
      });
      return;
      // }
      // else {
      //   result(null, "No record");
      //   return;
      // }
    });
};
//Get SalesByPartsReportToExcel
SalesOrderReportsModel.SalesByPartsReportToExcel = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    Ids += val.PartId + `,`;
  }
  var PartIds = Ids.slice(0, -1);
  var query = ``;
  query = ` Select p.PartNo,SUM(si.Quantity) as Quantity,
  CONCAT('$',' ',ROUND(SUM(si.price)/SUM(si.Quantity))) as AvgAmount,CONCAT('$',' ',ROUND(SUM(si.price))) as TotalAmount
  From tbl_sales_order s
  Left Join tbl_sales_order_item si on si.SOId=s.SOId AND s.IsDeleted = 0 
  Left Join tbl_parts p on p.partId=si.partId where s.IsDeleted=0 `;
  if (obj.DateRequested != "") {
    query += " and ( s.DateRequested >='" + obj.DateRequested + "' ) ";
  }
  if (obj.DateRequestedTo != "") {
    query += " and ( s.DateRequested <='" + obj.DateRequestedTo + "' ) ";
  }
  if (obj.DueDate != "") {
    query += " and ( s.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (obj.DueDateTo != "") {
    query += " and ( s.DueDate <='" + obj.DueDateTo + "' ) ";
  }
  if (obj.Created != "") {
    query += " and ( s.Created >='" + obj.Created + "' ) ";
  }
  if (obj.CreatedTo != "") {
    query += " and ( s.Created <='" + obj.CreatedTo + "' ) ";
  }
  if (obj.CustomerId != "") {
    query += " and ( s.CustomerId ='" + obj.CustomerId + "' ) ";
  }
  if (obj.PartId != "") {
    query += " and ( si.PartId ='" + obj.PartId + "' ) ";
  }
  if (obj.SOType != "") {
    query += " and ( s.SOType ='" + obj.SOType + "' ) ";
  }
  if (obj.Status != "") {
    query += " and ( s.Status ='" + obj.Status + "' ) ";
  }
  if (obj.IncludeRR == 1) { //RR Invoice
    query += ' and s.RRId > 0 AND s.MROId = 0  ';
  }
  if (obj.IncludeRR == 2) { //MRO Invoice
    query += ' and s.RRId = 0 AND s.MROId > 0  ';
  }
  if (obj.IncludeRR == 3) { //QT Invoice
    query += ' and s.RRId = 0 and s.MROId = 0  ';
  }
  if (PartIds != '' && PartIds != null) {
    query += ` and si.PartId in(` + PartIds + `)`;
  }
  query += " Group By si.PartId ";
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

//Get SalesOrderByCustomer
SalesOrderReportsModel.SalesOrderByCustomer = (obj, result) => {

  var query = "";
  selectquery = "";

  selectquery = `Select '-' as Status,'-' as SOType,c.CustomerId,c.CompanyName,Count(s.SOId) as SOCount,CONCAT('$',' ',ROUND(Sum(GrandTotal))) as Amount,
    '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,
    '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;

  query = query + ` From tbl_sales_order s
    Left Join tbl_customers c on c.CustomerId=s.CustomerId where s.IsDeleted=0 `;
  // console.log("obj.columns[cvalue].name=" + obj.columns[11].name);
  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {

      switch (obj.columns[cvalue].name) {
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 0) {
            query += ' and s.RRId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) {
            query += ' and s.RRId > 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( s.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( s.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( s.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( s.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( s.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( s.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and ( s.CustomerId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  query += ` Group By s.CustomerId `;
  var Countquery = `Select Count(Counts) recordsFiltered from ( Select count(s.SOId) as Counts ` + query + ` ) as A `;

  var i = 0;
  if (obj.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < obj.order.length; i++) {
    if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
    {
      switch (obj.columns[obj.order[i].column].name) {
        case "CustomerId":
          query += " s.CustomerId " + obj.order[i].dir + " ";
          break;
        case "SOCount":
          query += " Count(s.SOId) " + obj.order[i].dir + " ";
          break;
        case "Amount":
          query += " ROUND(Sum(s.GrandTotal)) " + obj.order[i].dir + " ";
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

  var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(s.SOId) as Counts 
    From tbl_sales_order s
    Left Join tbl_customers c on c.CustomerId=s.CustomerId 
    where s.IsDeleted=0  Group By s.CustomerId) as A `;

  // console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  // console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      // if (results[0][0].length > 0) {
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
      });
      return;
      // }
      // else {
      //   result(null, "No record");
      //   return;
      // }
    });
};
module.exports = SalesOrderReportsModel;
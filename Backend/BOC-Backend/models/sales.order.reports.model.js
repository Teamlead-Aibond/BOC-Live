/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var async = require('async');

const SalesOrderReportsModel = function (obj) {

  this.DateRequested = obj.DateRequested ? obj.DateRequested : '';
  this.DateRequestedTo = obj.DateRequestedTo ? obj.DateRequestedTo : '';
  this.DueDate = obj.DueDate ? obj.DueDate : '';
  this.DueDateTo = obj.DueDateTo ? obj.DueDateTo : '';
  this.Created = obj.Created ? obj.Created : '';
  this.CreatedTo = obj.CreatedTo ? obj.CreatedTo : '';
  this.CustomerId = obj.CustomerId ? obj.CustomerId : '';
  this.CustomerGroupId = obj.CustomerGroupId ? obj.CustomerGroupId : '';
  this.PartId = obj.PartId ? obj.PartId : '';
  this.SOType = obj.SOType ? obj.SOType : 0;
  this.Status = obj.Status ? obj.Status : 0;
  this.IncludeRR = obj.IncludeRR ? obj.IncludeRR : 100;
  this.SalesOrderReports = obj.SalesOrderReports ? obj.SalesOrderReports : '';
  this.Month = obj.Month ? obj.Month : '';
  this.Year = obj.Year ? obj.Year : '';
  this.CurrencyCode = obj.CurrencyCode ? obj.CurrencyCode : '';
  this.CreatedByLocation = obj.CreatedByLocation ? obj.CreatedByLocation : '';
  this.IsInventoryShopReport = obj.IsInventoryShopReport ? obj.IsInventoryShopReport : 0;

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
  this.ReportCurrencyCode = obj.ReportCurrencyCode ? obj.ReportCurrencyCode : ''


  this.InvoiceNo = obj.InvoiceNo ? obj.InvoiceNo : '';
  this.PartNo = obj.PartNo ? obj.PartNo : '';
  this.SONo = obj.SONo ? obj.SONo : '';
  this.PONo = obj.PONo ? obj.PONo : '';
  this.VendorId = obj.VendorId ? obj.VendorId : '';
  this.VendorInvoiceNo = obj.VendorInvoiceNo ? obj.VendorInvoiceNo : '';


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
  CONCAT('$',' ',FORMAT(ROUND(ifnull(sum(s.GrandTotal),0),2),2)) as Price,
  CONCAT('$',' ',FORMAT(ROUND(ifnull(sum(p.GrandTotal),0),2),2)) as Cost,
  CONCAT('$',' ',FORMAT(ROUND((ROUND(ifnull(sum(s.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum(s.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(s.GrandTotal),0),2),' ','%') Margin,
  '-' as CustomerId,'-' as PartId,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;
  var query = ` From tbl_sales_order s  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0 
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0 
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  TotalCountQuery += `  GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested)) as A `;
  var sqlArray = []; var obj = {};



  obj.query = query;
  obj.Countquery = Countquery;
  obj.TotalCountQuery = TotalCountQuery;

  sqlArray.push(obj);

  //console.log("query = " + obj.query);
  // console.log("Countquery = " + obj.Countquery);
  // console.log("TotalCountQuery = " + obj.TotalCountQuery);
  return sqlArray;

};

SalesOrderReportsModel.SalesByMonthNew = (obj, result) => {
  //   CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)) as Price,
  //  CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)) as Cost,
  //  CONCAT(CURL.CurrencySymbol,' ',ROUND((ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)),2)) as Profit,
  //  CONCAT(ROUND(((ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2),' ','%') Margin,

  var selectquery = ` SELECT YEAR(s.DateRequested) Year,'-' as Status,'-' as SOType,
  MONTHNAME(s.DateRequested) as Month ,s.LocalCurrencyCode as LCC,'' as CreatedByLocation,
 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2),2)) as Price,
 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(soi.BaseShippingCharge,0)),0),2),2)) as Cost,
 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(soi.BaseShippingCharge,0)),0),2)),2),2)) as Profit,
 CONCAT(ROUND(((ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(soi.BaseShippingCharge,0)),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2),' ','%') Margin,
  
  
  '-' as CustomerId,'-' as PartId,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;
  var query = ` From tbl_sales_order s  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = soi.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId AND c.IsDeleted=0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode != ""`;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }

  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.IsInventoryShopReport == 1) {
    query += ` AND mro.EcommerceOrderId != 0  `;
  }
  if (obj.IncludeRR != '') {
    if (obj.IncludeRR == 1) { //RR Invoice
      query += ' and s.RRId > 0 AND s.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
      query += ' and s.RRId = 0 AND s.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
      query += ' and s.RRId = 0 and s.MROId = 0  ';
    }
    if (obj.IncludeRR == 4) { //Shop Invoice
      query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
      query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
          query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
          break;
        case "PartId":
          query += " and  RR.PartId = " + obj.columns[cvalue].search.value + " ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }//
  }
  query += ` GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested),s.LocalCurrencyCode `;
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
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  TotalCountQuery += `  GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested)) as A `;
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

SalesOrderReportsModel.SOTaxVatReport = (obj, result) => {

  var selectquery = ` SELECT C.CompanyName,C.CustomerId, s.SONo, 
  CASE s.Status
WHEN 1 THEN '${Constants.array_sale_order_status[1]}'
WHEN 2 THEN '${Constants.array_sale_order_status[2]}' 
WHEN 3 THEN '${Constants.array_sale_order_status[3]}'
WHEN 4 THEN '${Constants.array_sale_order_status[4]}' 
WHEN 5 THEN '${Constants.array_sale_order_status[5]}' 
ELSE '-'	end SOStatusName,
I.InvoiceNo, Case I.Status
  WHEN 0 THEN '${Constants.array_invoice_status[0]}'
  WHEN 1 THEN '${Constants.array_invoice_status[1]}'
  WHEN 2 THEN '${Constants.array_invoice_status[2]}'
  WHEN 3 THEN '${Constants.array_invoice_status[3]}'
  WHEN 4 THEN '${Constants.array_invoice_status[4]}'
   WHEN 5 THEN '${Constants.array_invoice_status[5]}'
   WHEN 6 THEN '${Constants.array_invoice_status[6]}' 
  WHEN 7 THEN '${Constants.array_invoice_status[7]}'
  WHEN 8 THEN '${Constants.array_invoice_status[8]}'
  ELSE '-'
  end InvoiceStatusName, 
  CASE WHEN I.InvoiceNo IS NOT NULL THEN "Yes" ELSE "No" END AS ConvertedToInvoice, 
  soi.PartNo,soi.Description,CONCAT(CURL.CurrencySymbol,' ',ROUND(Ifnull(soi.Tax,0),2)) as Tax,soi.Quantity,CONCAT(soi.ItemTaxPercent, ' %') as ItemTaxPercent,
  CONCAT(CURL.CurrencySymbol,' ',ROUND((Ifnull(soi.Tax,0)*Ifnull(soi.Quantity,0)),2)) as TotalTaxAmount, 
  ItemLocalCurrencyCode  `;


  var query = ` From tbl_sales_order s  
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0 AND soi.Tax != 0 AND soi.Tax IS NOT NULL 
  LEFT JOIN tbl_invoice as I On I.SOId = s.SOId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  LEFT JOIN tbl_customers C on C.CustomerId=s.CustomerId
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND soi.Tax > 0 AND s.LocalCurrencyCode != "" `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          query += " and  C.CustomerGroupId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "PartId":
          query += " and  soi.PartId = " + obj.columns[cvalue].search.value + " ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "SONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.SONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( soi.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "InvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.InvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
        // query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }//
  }
  query += `   `;
  var Countquery = ` Select count(SOItemId) as recordsFiltered     ` + query + ` `;
  var i = 0;
  if (obj.order.length > 0) {
    // query += " ORDER BY ";
    // for (i = 0; i < obj.order.length; i++) {
    //   if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
    //   {
    //     switch (obj.columns[obj.order[i].column].name) {
    //       case "Year":
    //         query += " MONTH(s.DateRequested) " + obj.order[i].dir + " ";
    //         break;
    //       case "Month":
    //         query += " MONTH(s.DateRequested) " + obj.order[i].dir + " ";
    //         break;
    //       default:
    //         query += " MONTH(s.DateRequested) " + obj.order[i].dir + " ";
    //     }
    //   }
    // }
  } else {
    // query += " ORDER BY s.SOId DESC ";
  }
  query += " ORDER BY s.SOId DESC ";
  if (obj.start != "-1" && obj.length != "-1") {
    query += " LIMIT " + obj.start + "," + (obj.length);
  }
  query = selectquery + query;


  // Select Count(Counts) TotalCount from (Select count(MONTHNAME(s.DateRequested)) as Counts 
  var TotalCountQuery = `Select Count(s.SOId) as TotalCount
  From tbl_sales_order s
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0 AND soi.Tax != 0 AND soi.Tax IS NOT NULL 
  LEFT JOIN tbl_invoice as I On I.SOId = s.SOId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  LEFT JOIN tbl_customers C on C.CustomerId=s.CustomerId
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND soi.Tax > 0 AND s.LocalCurrencyCode != "" `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  // TotalCountQuery += ` GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested)) as A `;
  TotalCountQuery += `   `;
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
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  where  s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0  `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  TotalCountQuery += ` Group By Year(s.DateRequested),s.CustomerId ) as A  `;
  var sqlArray = []; var obj = {};
  obj.query = query;
  obj.Countquery = Countquery;
  obj.TotalCountQuery = TotalCountQuery;

  sqlArray.push(obj);

  //console.log("query = " + obj.query);
  // console.log("Countquery = " + obj.Countquery);
  //console.log("TotalCountQuery = " + obj.TotalCountQuery);
  return sqlArray;

};

SalesOrderReportsModel.ParticularMonthSOByCustomerNew = (obj, result) => {

  var selectquery = `SELECT '-' as Status,'-' as SOType,
    c.CustomerId,c.CompanyName,Year(s.DateRequested) Year,s.LocalCurrencyCode as LCC,'' as CreatedByLocation,

 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2),2)) as Price,
 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(poi.BaseShippingCharge,0)),0),2),2)) as Cost,
 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(poi.BaseShippingCharge,0)),0),2)),2),2)) as Profit,
 CONCAT(ROUND(((ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(poi.BaseShippingCharge,0)),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2),' ','%') Margin,
    
    '-' as PartId,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR,c.CustomerGroupId `;
  var query = ` From tbl_sales_order s  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId AND soi.IsDeleted = 0  
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = soi.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  where  s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode != ""`;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( s.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( s.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CustomerGroupId":
          query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By Year(s.DateRequested),s.CustomerId,s.LocalCurrencyCode  `;
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
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
  }
  if (CustomerIds != '' && CustomerIds != null) {
    query += ` and s.CustomerId in(` + CustomerIds + `)`;
  }
  query += " Group By s.CustomerId ";

  //"SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

SalesOrderReportsModel.SODetailedReport = (obj, result) => {

  (Ifnull(ii.Rate, 0) + Ifnull(ii.Tax, 0))

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    Ids += val.CustomerId + `,`;
  }
  var CustomerIds = Ids.slice(0, -1);
  var query = ``;
  query = ` Select  s.SONo SalesOrder,si.PartNo ProductLineItem,IF(s.RRId>0, s.RRId, IF(s.MROId>0, s.MROId, 0)) as RROrMRO,
  c.CompanyName Cust,DATE_FORMAT(s.DateRequested,'%m/%d/%Y') Date,si.Quantity,si.Rate UnitPrice,(Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0)+ifnull(pi.ShippingCharge,0)) as UnitCost,
  si.Discount,
  ROUND((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))+ifnull(si.ShippingCharge,0)),2) as ExtPrice,
  ROUND((((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(pi.Quantity,0))+ifnull(pi.ShippingCharge,0)),2) as ExtCost,  
  ROUND(((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))+ifnull(si.ShippingCharge,0))-((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(pi.Quantity,0))+ifnull(pi.ShippingCharge,0)),2) GrossProfit, 
  IF((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))>0,CONCAT(ROUND(((((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))+ifnull(si.ShippingCharge,0))-((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(pi.Quantity,0))+ifnull(pi.ShippingCharge,0))*100)/((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))+ifnull(si.ShippingCharge,0)),2),' %'),'-100 %')  as GrossProfitPercentage
  From tbl_sales_order s
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item pi on pi.POItemId=si.POItemId AND pi.IsDeleted = 0
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED}  AND s.IsDeleted=0   `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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

SalesOrderReportsModel.SODetailedReportNew = (obj, result) => {
  // ((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(EXR.ExchangeRate,1))
  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    Ids += val.CustomerId + `,`;
  }
  var CustomerIds = Ids.slice(0, -1);
  var query = ``;
  query = ` Select  s.SONo SalesOrder,si.PartNo ProductLineItem,IF(s.RRId>0, s.RRId, IF(s.MROId>0, s.MROId, 0)) as RROrMRO,
  c.CompanyName Cust,DATE_FORMAT(s.DateRequested,'%m/%d/%Y') Date,si.Quantity,s.LocalCurrencyCode as Currency,
  si.Rate UnitPrice,
  ((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0)+ifnull(pi.ShippingCharge,0))*Ifnull(EXR.ExchangeRate,1)) as UnitCost,
  si.Discount,
  FORMAT(ROUND((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))+ifnull(si.ShippingCharge,0)),2),2) as ExtPrice,
  FORMAT(ROUND(((((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0)) +(ifnull(pi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),2),2) as ExtCost,  
  FORMAT(ROUND(((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))+ifnull(si.ShippingCharge,0))-(((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(pi.Quantity,0))+(ifnull(pi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),2),2) GrossProfit, 
  IF((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))>0,CONCAT(ROUND(((((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))+ifnull(si.ShippingCharge,0))-(((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))+(ifnull(pi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))*100)/((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))+ifnull(si.ShippingCharge,0)),2),' %'),'-100 %')  as GrossProfitPercentage

  From tbl_sales_order s
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item pi on pi.POItemId=si.POItemId AND pi.IsDeleted = 0
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = pi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = si.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED}  AND s.IsDeleted=0  AND s.LocalCurrencyCode !="" `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
  if (obj.CustomerGroupId != "") {
    query += " and  c.CustomerGroupId In (" + obj.CustomerGroupId + ") ";
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
  }
  if (CustomerIds != '' && CustomerIds != null) {
    query += ` and s.CustomerId in(` + CustomerIds + `)`;
  }
  if (obj.CurrencyCode != "" && obj.CurrencyCode != "null") {
    query += " and ( s.LocalCurrencyCode ='" + obj.CurrencyCode + "' ) ";
  }
  if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
    query += " and ( s.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
  }
  if (obj.IsInventoryShopReport == 1) {
    query += ` AND mro.EcommerceOrderId != 0  `;
  }
  query += ` order By s.DateRequested desc `;
  //console.log("SQL=SODetailedReportNew" + query);
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
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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

  var query = `  SELECT
   ROUND(ifnull(sum(s.GrandTotal),0),2) as Price,
   ROUND(ifnull(sum(p.GrandTotal),0),2) as Cost,
   ROUND((ROUND(ifnull(sum(s.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2) as Profit,
  CONCAT(ROUND(((ifnull(sum(s.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(s.GrandTotal),0),2),' ','%') Margin
  From tbl_sales_order s  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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

  var query = `  SELECT s.LocalCurrencyCode as LCC,

  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0)) + ifnull(si.ShippingCharge,0)),0),2),2)) as Price,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0)) +  (ifnull(poi.ShippingCharge,0) * Ifnull(EXR.ExchangeRate,1))     ),0),2),2)) as Cost,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0)) + ifnull(si.ShippingCharge,0)),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0)) + (ifnull(poi.ShippingCharge,0) * Ifnull(EXR.ExchangeRate,1))     ),0),2)),2),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0)) + ifnull(si.ShippingCharge,0)),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0)) + (ifnull(poi.ShippingCharge,0) * Ifnull(EXR.ExchangeRate,1))    ),0))*100)/ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0)) + ifnull(si.ShippingCharge,0)),0),2),' ','%') Margin
    

  From tbl_sales_order s  
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item poi on poi.POItemId=si.POItemId AND poi.IsDeleted = 0
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = si.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId AND c.IsDeleted=0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode !=""`;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( s.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( s.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
  }
  if (obj.IsInventoryShopReport == 1) {
    query += ` AND mro.EcommerceOrderId != 0  `;
  }
  if (obj.IncludeRR != '') {
    if (obj.IncludeRR == 1) { //RR Invoice
      query += ' and s.RRId > 0 AND s.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
      query += ' and s.RRId = 0 AND s.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
      query += ' and s.RRId = 0 and s.MROId = 0  ';
    }
    if (obj.IncludeRR == 4) { //Shop Invoice
      query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
      query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
          query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
          break;

        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By s.LocalCurrencyCode  `;
  // console.log("Local  Curreny query: " + query);
  return query;

  /*var query1 = `  SELECT
  0 as Price,
  0 as Cost,
  0 Profit,
  0 Margin
  From tbl_sales_order s  WHERE 1=2 `;
  return query1;*/

};


SalesOrderReportsModel.OverAllBaseSummaryNew = (obj, result) => {

  var query = `  SELECT s.BaseCurrencyCode as LCC, 

  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(si.BaseRate,0)+Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0)) + ifnull(si.BaseShippingCharge,0)),0),2),2)) as Price,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.BaseTax,0)))*Ifnull(si.Quantity,0)) + ifnull(poi.BaseShippingCharge,0)),0),2),2)) as Cost,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(si.BaseRate,0)+Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0)) + ifnull(si.BaseShippingCharge,0)),0),2) - ROUND(ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.BaseTax,0)))*Ifnull(si.Quantity,0)) + ifnull(poi.BaseShippingCharge,0)),0),2)),2),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum(((Ifnull(si.BaseRate,0)+Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0)) + ifnull(si.BaseShippingCharge,0)),0)-ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.BaseTax,0)))*Ifnull(si.Quantity,0)) + ifnull(poi.BaseShippingCharge,0)),0))*100)/ifnull(sum(((Ifnull(si.BaseRate,0)+Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0)) + ifnull(si.BaseShippingCharge,0)),0),2),' ','%') Margin
   

  From tbl_sales_order s  
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item poi on poi.POItemId=si.POItemId AND poi.IsDeleted = 0
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.BaseCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemBaseCurrencyCode AND EXR.TargetCurrencyCode = si.ItemBaseCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId AND c.IsDeleted=0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.BaseCurrencyCode !=""`;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( s.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( s.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
  }
  if (obj.IsInventoryShopReport == 1) {
    query += ` AND mro.EcommerceOrderId != 0  `;
  }
  if (obj.IncludeRR != '') {
    if (obj.IncludeRR == 1) { //RR Invoice
      query += ' and s.RRId > 0 AND s.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
      query += ' and s.RRId = 0 AND s.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
      query += ' and s.RRId = 0 and s.MROId = 0  ';
    }
    if (obj.IncludeRR == 4) { //Shop Invoice
      query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
      query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
          query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By s.BaseCurrencyCode  `;

  //console.log("Base Curreny query: " + query);
  return query;

  /*var query1 = `  SELECT
  0 as Price,
  0 as Cost,
  0 Profit,
  0 Margin
  From tbl_sales_order s  WHERE 1=2 `;
  return query1;*/

};

SalesOrderReportsModel.OverAllSOSummaryNew = (obj, result) => {

  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2),2)) as Price,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))),0),2),2)) as Cost,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))),0),2)),2),2)) as Profit,
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2),' ','%') Margin

  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))),0),2),2)) as Cost,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))),0),2)),2),2)) as Profit,
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0)-ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2),' ','%') Margin
  var query = `  SELECT s.LocalCurrencyCode as LCC,
   
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2),2)) as Price
  

  From tbl_sales_order s  
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  LEFT JOIN tbl_invoice as I On I.SOId = s.SOId
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item poi on poi.POItemId=si.POItemId AND poi.IsDeleted = 0
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = si.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId AND c.IsDeleted=0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode !=""`;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( s.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( s.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
          query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "SONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.SONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( si.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "InvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.InvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By s.LocalCurrencyCode  `;
  return query;

  /*var query1 = `  SELECT
  0 as Price,
  0 as Cost,
  0 Profit,
  0 Margin
  From tbl_sales_order s  WHERE 1=2 `;
  return query1;*/

};

SalesOrderReportsModel.OverAllSOBaseSummaryNew = (obj, result) => {
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(si.BaseRate,0)+Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0),2),2)) as Price,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.Tax,0)))*Ifnull(si.Quantity,0))),0),2),2)) as Cost,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(si.BaseRate,0)+Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.BaseTax,0)))*Ifnull(si.Quantity,0))),0),2)),2),2)) as Profit,
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(si.BaseRate,0)+Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0)-ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.BaseTax,0)))*Ifnull(si.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(si.BaseRate,0)+Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0),2),' ','%') Margin

  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0),2),2)) as Price,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Tax,0)))*Ifnull(si.Quantity,0))),0),2),2)) as Cost,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.BaseTax,0)))*Ifnull(si.Quantity,0))),0),2)),2),2)) as Profit,
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0)-ifnull(sum((((Ifnull(poi.BaseTax,0)))*Ifnull(si.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0),2),' ','%') Margin

  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Tax,0)))*Ifnull(si.Quantity,0)*Ifnull(si.ItemExchangeRate,0))),0),2),2)) as Cost,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0)*Ifnull(si.ItemExchangeRate,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Tax,0)))*Ifnull(si.Quantity,0)*Ifnull(si.ItemExchangeRate,0))),0),2)),2),2)) as Profit,
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0)*Ifnull(si.ItemExchangeRate,0))),0)-ifnull(sum((((Ifnull(poi.Tax,0)))*Ifnull(si.Quantity,0)*Ifnull(si.ItemExchangeRate,0))),0))*100)/ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0)*Ifnull(si.ItemExchangeRate,0))),0),2),' ','%') Margin
  var query = `  SELECT s.BaseCurrencyCode as LCC, 
  

  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0)*Ifnull(si.ItemExchangeRate,0))),0),2),2)) as Price
  

  From tbl_sales_order s  
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  LEFT JOIN tbl_invoice as I On I.SOId = s.SOId
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item poi on poi.POItemId=si.POItemId AND poi.IsDeleted = 0
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.BaseCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemBaseCurrencyCode AND EXR.TargetCurrencyCode = si.ItemBaseCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId AND c.IsDeleted=0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.BaseCurrencyCode !=""`;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( s.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( s.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
          query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "SONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.SONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( si.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "InvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.InvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By s.BaseCurrencyCode  `;
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
  CONCAT('$',' ',FORMAT(ROUND(SUM(si.price)/SUM(si.Quantity)),2)) as AvgAmount,CONCAT('$',' ',FORMAT(ROUND(SUM(si.price)),2)) as TotalAmount,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,
  '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as  IncludeRR `;
  query = query + ` From tbl_sales_order s
  Left Join tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0 
  Left Join tbl_parts p on p.partId=si.partId where s.IsDeleted=0 
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0`;

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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
  Left Join tbl_parts p on p.partId=si.partId where s.IsDeleted=0 
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0`;
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
  }
  if (PartIds != '' && PartIds != null) {
    query += ` and si.PartId in(` + PartIds + `)`;
  }
  query += " Group By si.PartId ";
  console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      console.log(err);
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

//Get SalesOrderByCustomer
SalesOrderReportsModel.SalesOrderByCustomer = (obj, result) => {

  var query = "";
  selectquery = "";

  selectquery = `Select '-' as Status,'-' as SOType,c.CustomerId,c.CompanyName,Count(s.SOId) as SOCount,CONCAT('$',' ',FORMAT(ROUND(Sum(GrandTotal)),2)) as Amount,
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

// New
SalesOrderReportsModel.SalesByMonthReportToExcelNew = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    if (val.Month != '')
      Ids = Ids + `'${val.Month}'` + `,`;
  }
  var Months = Ids.slice(0, -1);
  var query = ``;

  //   query = ` SELECT CONCAT(MONTHNAME(s.DateRequested),' ',Year(s.DateRequested)) Month, s.LocalCurrencyCode as LCC,

  //   CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)) as Price,
  //  CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)) as Cost,
  //  CONCAT(CURL.CurrencySymbol,' ',ROUND((ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0),2)),2)) as Profit,
  //  CONCAT(ROUND(((ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0)-ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(soi.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2),' ','%') Margin,

  //   CONCAT('','',ROUND(ifnull(sum(s.GrandTotal),0),2)) as Price,
  //   CONCAT('','',ROUND(ifnull(sum(p.GrandTotal),0),2)) as Cost,
  //   CONCAT('','',ROUND((ROUND(ifnull(sum(s.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2)) as Profit,
  //   CONCAT(ROUND(((ifnull(sum(s.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(s.GrandTotal),0),2),' ','%') Margin

  //   From tbl_sales_order s 
  //   Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  //   Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0
  //   left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
  //   Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  //   LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0 
  //   where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode != ""`;
  // CON.CountryName as CreatedByLocationName, CON.CountryCode as CreatedByLocationCode,s.CreatedByLocation,
  query = ` SELECT CONCAT(MONTHNAME(s.DateRequested),' ',Year(s.DateRequested)) Month, s.LocalCurrencyCode as LCC,

  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2),2)) as Price,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(soi.BaseShippingCharge,0)),0),2),2)) as Cost,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(soi.BaseShippingCharge,0)),0),2)),2),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(soi.BaseShippingCharge,0)),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2),' ','%') Margin
 
  From tbl_sales_order s 
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = soi.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId AND c.IsDeleted=0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode != ""`;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
  if (obj.CustomerGroupId != "") {
    // query += "  and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + obj.CustomerGroupId + `)`;
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
  }
  if (Months != '' && Months != null) {
    query += ` and MONTHNAME(s.DateRequested) in(` + Months + `)`;
  }
  if (obj.CurrencyCode != "" && obj.CurrencyCode != "null") {
    query += " and ( s.LocalCurrencyCode ='" + obj.CurrencyCode + "' ) ";
  }
  if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
    query += " and ( s.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
  }
  if (obj.IsInventoryShopReport == 1) {
    query += ` AND mro.EcommerceOrderId != 0  `;
  }
  query += `  GROUP BY Year(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested),CONCAT(MONTHNAME(s.DateRequested),' ',Year(s.DateRequested)), s.LocalCurrencyCode `;
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

SalesOrderReportsModel.ParticularMonthSOByCustomerToExcelNew = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    Ids += val.CustomerId + `,`;
  }
  var CustomerIds = Ids.slice(0, -1);
  var query = ``;
  // query = ` SELECT   c.CompanyName,      
  //   CONCAT('',' ',ROUND(ifnull(sum(s.GrandTotal),0),2)  ) as Price,
  //   CONCAT('',' ',ROUND(ifnull(sum(p.GrandTotal),0),2) ) as Cost,
  //   CONCAT('',' ',ROUND((ROUND(ifnull(sum(s.GrandTotal),0),2) - ROUND(ifnull(sum(p.GrandTotal),0),2)),2) ) Profit,
  //   CONCAT(ROUND(((ifnull(sum(s.GrandTotal),0)-ifnull(sum(p.GrandTotal),0))*100)/ifnull(sum(s.GrandTotal),0), 2),' ','%') Margin
  // From tbl_sales_order s
  // Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  // Left Join tbl_customers c on c.CustomerId=s.CustomerId
  // where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 `;
  // CON.CountryName as CreatedByLocationName, CON.CountryCode as CreatedByLocationCode,s.CreatedByLocation,
  query = ` SELECT   c.CompanyName,     s.LocalCurrencyCode as LCC,

  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2),2)) as Price,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(soi.BaseShippingCharge,0)),0),2),2)) as Cost,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(soi.BaseShippingCharge,0)),0),2)),2),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + ifnull(soi.BaseShippingCharge,0)),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + ifnull(soi.ShippingCharge,0)),0),2),' ','%') Margin

  From tbl_sales_order s
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = soi.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode != ""`;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
  if (obj.CustomerGroupId != "") {
    // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + obj.CustomerGroupId + `)`;
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
  }
  if (CustomerIds != '' && CustomerIds != null) {
    query += ` and s.CustomerId in(` + CustomerIds + `)`;
  }
  if (obj.CurrencyCode != "" && obj.CurrencyCode != "null") {
    query += " and ( s.LocalCurrencyCode ='" + obj.CurrencyCode + "' ) ";
  }
  if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
    query += " and ( s.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
  }
  query += " Group By s.CustomerId,s.LocalCurrencyCode ";

  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

SalesOrderReportsModel.SOTaxVatReportToExcel = (obj, result) => {

  var selectquery = ` SELECT C.CompanyName,C.CustomerId, s.SONo, 
  CASE s.Status
WHEN 1 THEN '${Constants.array_sale_order_status[1]}'
WHEN 2 THEN '${Constants.array_sale_order_status[2]}' 
WHEN 3 THEN '${Constants.array_sale_order_status[3]}'
WHEN 4 THEN '${Constants.array_sale_order_status[4]}' 
WHEN 5 THEN '${Constants.array_sale_order_status[5]}' 
ELSE '-'	end SOStatusName,
I.InvoiceNo, Case I.Status
  WHEN 0 THEN '${Constants.array_invoice_status[0]}'
  WHEN 1 THEN '${Constants.array_invoice_status[1]}'
  WHEN 2 THEN '${Constants.array_invoice_status[2]}'
  WHEN 3 THEN '${Constants.array_invoice_status[3]}'
  WHEN 4 THEN '${Constants.array_invoice_status[4]}'
   WHEN 5 THEN '${Constants.array_invoice_status[5]}'
   WHEN 6 THEN '${Constants.array_invoice_status[6]}' 
  WHEN 7 THEN '${Constants.array_invoice_status[7]}'
  WHEN 8 THEN '${Constants.array_invoice_status[8]}'
  ELSE '-'
  end InvoiceStatusName, 
  CASE WHEN I.InvoiceNo IS NOT NULL THEN "Yes" ELSE "No" END AS ConvertedToInvoice, 
  soi.PartNo,soi.Description,CONCAT(CURL.CurrencySymbol,' ',ROUND(Ifnull(soi.Tax,0),2)) as Tax,soi.Quantity,CONCAT(soi.ItemTaxPercent, ' %') as ItemTaxPercent,
  CONCAT(CURL.CurrencySymbol,' ',ROUND((Ifnull(soi.Tax,0)*Ifnull(soi.Quantity,0)),2)) as TotalTaxAmount, 
  ItemLocalCurrencyCode, C.CustomerGroupId  `;


  var query = ` From tbl_sales_order s  
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0 AND soi.Tax != 0 AND soi.Tax IS NOT NULL 
  LEFT JOIN tbl_invoice as I On I.SOId = s.SOId
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  LEFT JOIN tbl_customers C on C.CustomerId=s.CustomerId
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND soi.Tax > 0 AND s.LocalCurrencyCode != "" `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }

  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  // Temp Hide

  if (obj.CustomerId && obj.CustomerId != '') {
    query += " and  s.CustomerId In (" + obj.CustomerId + ") ";
  }

  if (obj.CustomerGroupId && obj.CustomerGroupId != '') {
    // query += " and  s.CustomerId In (" + obj.CustomerGroupId + ") ";
    // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + obj.CustomerGroupId + `)`;
  }

  if (obj.InvoiceNo && obj.InvoiceNo != '') {
    query += " and ( I.InvoiceNo = '" + obj.InvoiceNo + "' ) ";
  }

  if (obj.PartNo && obj.PartNo != '') {
    query += " and ( soi.PartNo = '" + obj.PartNo + "' ) ";
  }

  if (obj.SONo && obj.SONo != '') {
    query += " and ( s.SONo = '" + obj.SONo + "' ) ";
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
          break;
        case "PartId":
          query += " and  soi.PartId = " + obj.columns[cvalue].search.value + " ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
        case "SONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.SONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( soi.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "InvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.InvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }//
  }
  query += `   `;
  var i = 0;

  query += " ORDER BY s.SOId DESC ";

  query = selectquery + query;


  var sqlArray = []; var obj = {};



  // obj.query = query;

  // sqlArray.push(obj);

  //console.log("query = " + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });

};

// Payable Reports
SalesOrderReportsModel.PayableReport = (obj, result) => {
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2),' ','%') Margin,

  var selectquery = ` SELECT YEAR(s.DateRequested) Year,'-' as Status,'-' as SOType,
    MONTHNAME(s.DateRequested) as Month ,s.LocalCurrencyCode as LCC,'' as CreatedByLocation,
   CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2),2)) as SOTax,
   CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0))),0),2),2)) as POTax,
   CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0))),0),2)),2),2)) as PayableTax,
    '-' as CustomerId,'-' as PartId,
    '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;
  var query = ` From tbl_sales_order s  
    Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
    Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0 AND soi.Tax != 0 AND soi.Tax IS NOT NULL 
    left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
    Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
    Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = soi.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
    where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND soi.Tax > 0 AND s.LocalCurrencyCode != "" `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }//
  }
  query += ` GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested),s.LocalCurrencyCode `;
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
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  TotalCountQuery += `  GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested)) as A `;
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

SalesOrderReportsModel.OverAllPayableSummary = (obj, result) => {

  var query = `  SELECT s.LocalCurrencyCode as LCC,
  
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2),2)) as SOTax,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))),0),2),2)) as POTax,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))),0),2)),2),2)) as PayableTax
    From tbl_sales_order s  
    Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0 AND si.Tax != 0 AND si.Tax IS NOT NULL 
    Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
    Left JOIN tbl_po_item poi on poi.POItemId=si.POItemId AND poi.IsDeleted = 0
    Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
    Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0  
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = si.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    
    where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND si.Tax > 0 AND s.LocalCurrencyCode != "" `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( s.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( s.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By s.LocalCurrencyCode  `;
  return query;

  /*var query1 = `  SELECT
  0 as Price,
  0 as Cost,
  0 Profit,
  0 Margin
  From tbl_sales_order s  WHERE 1=2 `;
  return query1;*/

};


SalesOrderReportsModel.OverAllPayableBaseSummary = (obj, result) => {

  var query = `  SELECT s.BaseCurrencyCode as LCC, 
  
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0),2),2)) as SOTax,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Tax,0)))*Ifnull(si.Quantity,0))),0),2),2)) as POTax,
    CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.BaseTax,0)))*Ifnull(si.Quantity,0))),0),2)),2),2)) as PayableTax
    From tbl_sales_order s  
    Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0 AND si.Tax != 0 AND si.Tax IS NOT NULL 
    Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
    Left JOIN tbl_po_item poi on poi.POItemId=si.POItemId AND poi.IsDeleted = 0
    Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
    Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.BaseCurrencyCode AND CURL.IsDeleted = 0  
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemBaseCurrencyCode AND EXR.TargetCurrencyCode = si.ItemBaseCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    
    where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND si.Tax > 0 AND s.BaseCurrencyCode !=""`;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( s.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( s.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By s.BaseCurrencyCode  `;
  return query;

  /*var query1 = `  SELECT
  0 as Price,
  0 as Cost,
  0 Profit,
  0 Margin
  From tbl_sales_order s  WHERE 1=2 `;
  return query1;*/

};

SalesOrderReportsModel.PayableReportToExcel = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    if (val.Month != '')
      Ids = Ids + `'${val.Month}'` + `,`;
  }
  var Months = Ids.slice(0, -1);
  var query = ``;
  query = ` SELECT CONCAT(MONTHNAME(s.DateRequested),' ',Year(s.DateRequested)) Month, s.LocalCurrencyCode as LCC,
    
      CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2),2)) as SOTax,
      CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0))),0),2),2)) as POTax,
      CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0))),0),2)),2),2)) as PayableTax
     
      From tbl_sales_order s 
      Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
      Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0
      left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
      Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
      Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
      LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0 
      LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = soi.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
      LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
      where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND soi.Tax > 0 AND s.LocalCurrencyCode != ""`;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
  }
  if (Months != '' && Months != null) {
    query += ` and MONTHNAME(s.DateRequested) in(` + Months + `)`;
  }
  if (obj.CurrencyCode != "" && obj.CurrencyCode != "null") {
    query += " and ( s.LocalCurrencyCode ='" + obj.CurrencyCode + "' ) ";
  }
  if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
    query += " and ( s.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
  }
  query += `  GROUP BY Year(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested),CONCAT(MONTHNAME(s.DateRequested),' ',Year(s.DateRequested)), s.LocalCurrencyCode `;
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};


// Payable Details

SalesOrderReportsModel.PayableReportDetails = (obj, result) => {
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0))),0),2),' ','%') Margin,
  var selectquery = ` SELECT C.CompanyName,C.CustomerId, s.SONo,
  CASE s.Status
WHEN 1 THEN '${Constants.array_sale_order_status[1]}'
WHEN 2 THEN '${Constants.array_sale_order_status[2]}' 
WHEN 3 THEN '${Constants.array_sale_order_status[3]}'
WHEN 4 THEN '${Constants.array_sale_order_status[4]}' 
WHEN 5 THEN '${Constants.array_sale_order_status[5]}' 
ELSE '-'	end SOStatusName,
I.InvoiceNo, Case I.Status
  WHEN 0 THEN '${Constants.array_invoice_status[0]}'
  WHEN 1 THEN '${Constants.array_invoice_status[1]}'
  WHEN 2 THEN '${Constants.array_invoice_status[2]}'
  WHEN 3 THEN '${Constants.array_invoice_status[3]}'
  WHEN 4 THEN '${Constants.array_invoice_status[4]}'
   WHEN 5 THEN '${Constants.array_invoice_status[5]}'
   WHEN 6 THEN '${Constants.array_invoice_status[6]}' 
  WHEN 7 THEN '${Constants.array_invoice_status[7]}'
  WHEN 8 THEN '${Constants.array_invoice_status[8]}'
  ELSE '-'
  end InvoiceStatusName, 
  CASE WHEN I.InvoiceNo IS NOT NULL THEN "Yes" ELSE "No" END AS ConvertedToInvoice, 
  soi.PartNo,soi.Description,
  CONCAT(CURL.CurrencySymbol,' ',ROUND(Ifnull(soi.Tax,0),2)) as Tax,soi.Quantity,CONCAT(soi.ItemTaxPercent, ' %') as SOItemTaxPercent,
  CONCAT(CURL.CurrencySymbol,' ',ROUND((Ifnull(soi.Tax,0)*Ifnull(soi.Quantity,0)),2)) as SOTotalTaxAmount, 

  V.VendorName,V.VendorId, tp.PONo, 
  CASE tp.Status
WHEN 1 THEN '${Constants.array_purchase_order_status[1]}'
WHEN 2 THEN '${Constants.array_purchase_order_status[2]}' 
WHEN 3 THEN '${Constants.array_purchase_order_status[3]}'
WHEN 4 THEN '${Constants.array_purchase_order_status[4]}' 
WHEN 5 THEN '${Constants.array_purchase_order_status[5]}' 
WHEN 6 THEN '${Constants.array_purchase_order_status[6]}' 
WHEN 7 THEN '${Constants.array_purchase_order_status[7]}' 
WHEN 8 THEN '${Constants.array_purchase_order_status[8]}' 
WHEN 9 THEN '${Constants.array_purchase_order_status[9]}' 
ELSE '-'	end POStatusName,
VI.VendorInvoiceNo, Case VI.Status
  WHEN 0 THEN '${Constants.array_vendor_invoice_status[0]}'
  WHEN 1 THEN '${Constants.array_vendor_invoice_status[1]}'
  WHEN 2 THEN '${Constants.array_vendor_invoice_status[2]}'
  WHEN 3 THEN '${Constants.array_vendor_invoice_status[3]}'
  WHEN 4 THEN '${Constants.array_vendor_invoice_status[4]}'
  WHEN 5 THEN '${Constants.array_vendor_invoice_status[5]}'
  ELSE '-'
  end VendorInvoiceStatusName, 
  CASE WHEN VI.VendorInvoiceNo IS NOT NULL THEN "Yes" ELSE "No" END AS ConvertedToVendorBill, 
  tpoi.PartNo,tpoi.Description,CONCAT(CURL.CurrencySymbol,' ',ROUND(Ifnull(tpoi.Tax,0),2)) as Tax,tpoi.Quantity,CONCAT(tpoi.ItemTaxPercent, ' %') as POItemTaxPercent,
  CONCAT(CURL.CurrencySymbol,' ',ROUND((Ifnull(tpoi.Tax,0)*Ifnull(tpoi.Quantity,0)),2)) as POTotalTaxAmount, 

  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(((Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)),0),2),2)) as SOTax,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull((((Ifnull(tpoi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)),0),2),2)) as POTax,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(((Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)),0),2) - ROUND(ifnull((((Ifnull(tpoi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)),0),2)),2),2)) as PayableTax,
  soi.ItemLocalCurrencyCode as SOItemLocalCurrencyCode, tpoi.ItemLocalCurrencyCode as POItemLocalCurrencyCode  `;


  var query = ` From tbl_sales_order s  
  Left JOIN tbl_po tp on tp.POId=s.POId AND tp.IsDeleted = 0  AND tp.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0 AND soi.Tax != 0 AND soi.Tax IS NOT NULL 
  left JOIN tbl_po_item as tpoi on tpoi.POItemId=soi.POItemId AND tpoi.IsDeleted = 0 
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0 
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0 
  LEFT JOIN tbl_invoice as I On I.SOId = s.SOId
  LEFT JOIN tbl_vendor_invoice as VI On VI.POId = tp.POId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  LEFT JOIN tbl_customers C on C.CustomerId=s.CustomerId
  LEFT JOIN tbl_vendors V on V.VendorId=tp.VendorId
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = tpoi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = soi.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND soi.Tax > 0 AND s.LocalCurrencyCode != "" `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          query += " and  C.CustomerGroupId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "PartId":
          query += " and  soi.PartId = " + obj.columns[cvalue].search.value + " ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
        case "SONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.SONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.PONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( soi.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "InvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.InvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "VendorInvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( VI.VendorInvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "VendorId":
          query += " and  V.VendorId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        default:
        // query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }//
  }
  query += `   `;
  var Countquery = ` Select count(soi.SOItemId) as recordsFiltered     ` + query + ` `;
  var i = 0;
  query += " ORDER BY s.SOId DESC ";
  if (obj.start != "-1" && obj.length != "-1") {
    query += " LIMIT " + obj.start + "," + (obj.length);
  }
  query = selectquery + query;
  // Select Count(Counts) TotalCount from (Select count(MONTHNAME(s.DateRequested)) as Counts
  var TotalCountQuery = `Select Count(s.SOId) TotalCount  
  From tbl_sales_order s
  Left JOIN tbl_po tp on tp.POId=s.POId AND tp.IsDeleted = 0  AND tp.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0 AND soi.Tax != 0 AND soi.Tax IS NOT NULL 
  left JOIN tbl_po_item as tpoi on tpoi.POItemId=soi.POItemId AND tpoi.IsDeleted = 0 
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  LEFT JOIN tbl_invoice as I On I.SOId = s.SOId
  LEFT JOIN tbl_vendor_invoice as VI On VI.POId = tp.POId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  LEFT JOIN tbl_customers C on C.CustomerId=s.CustomerId
  LEFT JOIN tbl_vendors V on V.VendorId=tp.VendorId
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = tpoi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = soi.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND soi.Tax > 0 AND s.LocalCurrencyCode != "" 
  `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  // TotalCountQuery += ` GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested)) as A `;
  TotalCountQuery += `   `;
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

SalesOrderReportsModel.OverAllPayableDetailsSummary = (obj, result) => {

  var query = `  SELECT s.LocalCurrencyCode as LCC,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2),2)) as SOTaxPrice,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(poi.Tax,0))*Ifnull(poi.Quantity,0))),0),2),2)) as POTaxPrice,
  CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.Tax,0))*Ifnull(poi.Quantity,0))),0),2)) as PayableTaxPrice
  From tbl_sales_order s  
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  LEFT JOIN tbl_invoice as I On I.SOId = s.SOId
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item poi on poi.POItemId=si.POItemId AND poi.IsDeleted = 0
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_vendors V on V.VendorId=p.VendorId
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = si.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId AND c.IsDeleted=0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode !=""`;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( s.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( s.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
          query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "SONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.SONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( si.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "InvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.InvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "VendorId":
          query += " and  V.VendorId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By s.LocalCurrencyCode  `;

  //console.log("OverAllPayableDetailsSummary = " + query);
  return query;

};

SalesOrderReportsModel.OverAllPayableDetailsBaseSummary = (obj, result) => {

  var query = `  SELECT s.BaseCurrencyCode as LCC, 
  
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0),2),2)) as SOTaxPrice,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(poi.BaseTax,0))*Ifnull(poi.Quantity,0))),0),2),2)) as POTaxPrice,
  CONCAT(CURL.CurrencySymbol,' ',ROUND(ifnull(sum(((Ifnull(si.BaseTax,0))*Ifnull(si.Quantity,0))),0),2) - ROUND(ifnull(sum(((Ifnull(poi.BaseTax,0))*Ifnull(poi.Quantity,0))),0),2)) as PayableTaxPrice
  From tbl_sales_order s  
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  LEFT JOIN tbl_invoice as I On I.SOId = s.SOId
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item poi on poi.POItemId=si.POItemId AND poi.IsDeleted = 0
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_vendors V on V.VendorId=p.VendorId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.BaseCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemBaseCurrencyCode AND EXR.TargetCurrencyCode = si.ItemBaseCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId AND c.IsDeleted=0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.BaseCurrencyCode !=""`;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( s.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( s.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
          query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "SONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.SONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( si.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "InvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.InvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "VendorId":
          query += " and  V.VendorId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By s.BaseCurrencyCode  `;
  //console.log("OverAllPayableDetailsBaseSummary = " + query);
  return query;

};

SalesOrderReportsModel.PayableReportDetailsToExcel = (obj, result) => {

  var selectquery = ` SELECT C.CompanyName,C.CustomerId, s.SONo,
  CASE s.Status
WHEN 1 THEN '${Constants.array_sale_order_status[1]}'
WHEN 2 THEN '${Constants.array_sale_order_status[2]}' 
WHEN 3 THEN '${Constants.array_sale_order_status[3]}'
WHEN 4 THEN '${Constants.array_sale_order_status[4]}' 
WHEN 5 THEN '${Constants.array_sale_order_status[5]}' 
ELSE '-'	end SOStatusName,
I.InvoiceNo, Case I.Status
  WHEN 0 THEN '${Constants.array_invoice_status[0]}'
  WHEN 1 THEN '${Constants.array_invoice_status[1]}'
  WHEN 2 THEN '${Constants.array_invoice_status[2]}'
  WHEN 3 THEN '${Constants.array_invoice_status[3]}'
  WHEN 4 THEN '${Constants.array_invoice_status[4]}'
  WHEN 5 THEN '${Constants.array_invoice_status[5]}'
  WHEN 6 THEN '${Constants.array_invoice_status[6]}' 
  WHEN 7 THEN '${Constants.array_invoice_status[7]}'
  WHEN 8 THEN '${Constants.array_invoice_status[8]}'
  ELSE '-'
  end InvoiceStatusName, 
  CASE WHEN I.InvoiceNo IS NOT NULL THEN "Yes" ELSE "No" END AS ConvertedToInvoice, 
  soi.PartNo,soi.Description,
  CONCAT(CURL.CurrencySymbol,' ',ROUND(Ifnull(soi.Tax,0),2)) as Tax,soi.Quantity,CONCAT(soi.ItemTaxPercent, ' %') as SOItemTaxPercent,
  CONCAT(CURL.CurrencySymbol,' ',ROUND((Ifnull(soi.Tax,0)*Ifnull(soi.Quantity,0)),2)) as SOTotalTaxAmount, 

  V.VendorName,V.VendorId, tp.PONo, 
  CASE tp.Status
WHEN 1 THEN '${Constants.array_purchase_order_status[1]}'
WHEN 2 THEN '${Constants.array_purchase_order_status[2]}' 
WHEN 3 THEN '${Constants.array_purchase_order_status[3]}'
WHEN 4 THEN '${Constants.array_purchase_order_status[4]}' 
WHEN 5 THEN '${Constants.array_purchase_order_status[5]}' 
WHEN 6 THEN '${Constants.array_purchase_order_status[6]}' 
WHEN 7 THEN '${Constants.array_purchase_order_status[7]}' 
WHEN 8 THEN '${Constants.array_purchase_order_status[8]}' 
WHEN 9 THEN '${Constants.array_purchase_order_status[9]}' 
ELSE '-'	end POStatusName,
VI.VendorInvoiceNo, Case VI.Status
  WHEN 0 THEN '${Constants.array_vendor_invoice_status[0]}'
  WHEN 1 THEN '${Constants.array_vendor_invoice_status[1]}'
  WHEN 2 THEN '${Constants.array_vendor_invoice_status[2]}'
  WHEN 3 THEN '${Constants.array_vendor_invoice_status[3]}'
  WHEN 4 THEN '${Constants.array_vendor_invoice_status[4]}'
  WHEN 5 THEN '${Constants.array_vendor_invoice_status[5]}'
  ELSE '-'
  end VendorInvoiceStatusName, 
  CASE WHEN VI.VendorInvoiceNo IS NOT NULL THEN "Yes" ELSE "No" END AS ConvertedToVendorBill, 
  tpoi.PartNo,tpoi.Description,CONCAT(CURL.CurrencySymbol,' ',ROUND(Ifnull(tpoi.Tax,0),2)) as Tax,tpoi.Quantity,CONCAT(tpoi.ItemTaxPercent, ' %') as POItemTaxPercent,
  CONCAT(CURL.CurrencySymbol,' ',ROUND((Ifnull(tpoi.Tax,0)*Ifnull(tpoi.Quantity,0)),2)) as POTotalTaxAmount, 

  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(((Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)),0),2),2)) as SOTax,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull((((Ifnull(tpoi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)),0),2),2)) as POTax,

  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(((Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)),0),2) - ROUND(ifnull((((Ifnull(tpoi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)),0),2)),2),2)) as PayableTax,
  soi.ItemLocalCurrencyCode as SOItemLocalCurrencyCode, tpoi.ItemLocalCurrencyCode as POItemLocalCurrencyCode  `;


  var query = ` From tbl_sales_order s  
  Left JOIN tbl_po tp on tp.POId=s.POId AND tp.IsDeleted = 0  AND tp.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0 AND soi.Tax != 0 AND soi.Tax IS NOT NULL 
  left JOIN tbl_po_item as tpoi on tpoi.POItemId=soi.POItemId AND tpoi.IsDeleted = 0 
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_invoice as I On I.SOId = s.SOId
  LEFT JOIN tbl_vendor_invoice as VI On VI.POId = tp.POId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = s.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  LEFT JOIN tbl_customers C on C.CustomerId=s.CustomerId
  LEFT JOIN tbl_vendors V on V.VendorId=tp.VendorId
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = tpoi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = soi.ItemLocalCurrencyCode AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND soi.Tax > 0 AND s.LocalCurrencyCode != "" `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }

  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }

  // Temp Hide

  if (obj.CustomerId && obj.CustomerId != '') {
    query += " and  s.CustomerId In (" + obj.CustomerId + ") ";
  }
  if (obj.CustomerGroupId && obj.CustomerGroupId != '') {
    query += " and  C.CustomerGroupId In (" + obj.CustomerGroupId + ") ";
  }

  if (obj.VendorId && obj.VendorId != '') {
    query += " and  tp.VendorId In (" + obj.VendorId + ") ";
  }

  if (obj.InvoiceNo && obj.InvoiceNo != '') {
    query += " and ( I.InvoiceNo = '" + obj.InvoiceNo + "' ) ";
  }

  if (obj.VendorInvoiceNo && obj.VendorInvoiceNo != '') {
    query += " and ( VI.VendorInvoiceNo = '" + obj.VendorInvoiceNo + "' ) ";
  }

  if (obj.PartNo && obj.PartNo != '') {
    query += " and ( soi.PartNo = '" + obj.PartNo + "' ) ";
  }

  if (obj.SONo && obj.SONo != '') {
    query += " and ( s.SONo = '" + obj.SONo + "' ) ";
  }

  if (obj.PONo && obj.PONo != '') {
    query += " and ( tp.PONo = '" + obj.PONo + "' ) ";
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          query += " and  C.CustomerGroupId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "VendorId":
          query += " and  tp.VendorId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "PartId":
          query += " and  soi.PartId = " + obj.columns[cvalue].search.value + " ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
        case "SONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.SONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.PONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( soi.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "InvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.InvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "VendorInvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( VI.VendorInvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }//
  }
  query += `   `;
  var i = 0;

  query += " ORDER BY s.SOId DESC ";

  query = selectquery + query;


  var sqlArray = []; var obj = {};



  // obj.query = query;

  // sqlArray.push(obj);

  //console.log("query = " + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};


// ToDo With Currency
SalesOrderReportsModel.SalesByMonthWithCurrency = (obj, result) => {

  var selectquery = ` SELECT YEAR(s.DateRequested) Year,'-' as Status,'-' as SOType,
  MONTHNAME(s.DateRequested) as Month ,'' as CreatedByLocation,'${obj.ReportCurrencyCode}' as ReportCurrencyCode,
 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Price,
 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Cost,
 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2)),2),2)) as Profit,
 CONCAT(ROUND(((ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),' ','%') Margin,
  
  
  '-' as CustomerId,'-' as PartId,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;
  var query = ` From tbl_sales_order s  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId AND c.IsDeleted=0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode != "" `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }

  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }

  if (obj.IncludeRR != '') {
    if (obj.IncludeRR == 1) { //RR Invoice
      query += ' and s.RRId > 0 AND s.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
      query += ' and s.RRId = 0 AND s.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
      query += ' and s.RRId = 0 and s.MROId = 0  ';
    }
    if (obj.IncludeRR == 4) { //Shop Invoice
      query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
      query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
          query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
          break;
        case "PartId":
          query += " and  RR.PartId = " + obj.columns[cvalue].search.value + " ";
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
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
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  TotalCountQuery += `  GROUP BY YEAR(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested)) as A `;
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

SalesOrderReportsModel.OverAllBaseSummaryWithCurrency = (obj, result) => {
  // Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  // Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  // Left JOIN tbl_po_item poi on poi.POItemId=si.POItemId AND poi.IsDeleted = 0
  // Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  // LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0  
  // LEFT JOIN tbl_currencies as CURLL  ON CURLL.CurrencyCode = s.BaseCurrencyCode AND CURLL.IsDeleted = 0  
  // LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemBaseCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  // where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.BaseCurrencyCode !=""`;
  var query = `  SELECT s.BaseCurrencyCode as LCC, '${obj.ReportCurrencyCode}' as ReportCurrencyCode,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0)) + (ifnull(si.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Price,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0)) + (ifnull(si.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Cost,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0)) + (ifnull(si.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0)) + (ifnull(si.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2)),2),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0)) + (ifnull(si.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0)) + (ifnull(si.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0))*100)/ifnull(sum(((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0)) + (ifnull(si.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),' ','%') Margin
    
  From tbl_sales_order s  
  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as si  ON si.SOId = s.SOId  AND si.IsDeleted = 0
  left JOIN tbl_po_item as poi on poi.POItemId=si.POItemId AND poi.IsDeleted = 0 
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId AND c.IsDeleted=0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode != "" `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( s.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( s.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
  }
  if (obj.IncludeRR != '') {
    if (obj.IncludeRR == 1) { //RR Invoice
      query += ' and s.RRId > 0 AND s.MROId = 0  ';
    }
    if (obj.IncludeRR == 2) { //MRO Invoice
      query += ' and s.RRId = 0 AND s.MROId > 0  ';
    }
    if (obj.IncludeRR == 3) { //QT Invoice
      query += ' and s.RRId = 0 and s.MROId = 0  ';
    }
    if (obj.IncludeRR == 4) { //Shop Invoice
      query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
    }
    if (obj.IncludeRR == 5) { //MRO without shop
      query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
    }
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CustomerGroupId":
          // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.columns[cvalue].search.value + "))) ";
          query += ` and c.CustomerGroupId in(` + obj.columns[cvalue].search.value + `)`;
          break;
        case "Status":
          query += " and ( s.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By s.BaseCurrencyCode  `;
  return query;

};

SalesOrderReportsModel.ParticularMonthSOByCustomerWithCurrency = (obj, result) => {
  // Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  // Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId AND soi.IsDeleted = 0  
  // left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0
  // Left Join tbl_customers c on c.CustomerId=s.CustomerId
  // LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0 
  // LEFT JOIN tbl_currencies as CURLL ON CURLL.CurrencyCode = s.LocalCurrencyCode AND CURLL.IsDeleted = 0  
  // LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  // LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  // where  s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode != ""`;
  var selectquery = `SELECT '-' as Status,'-' as SOType,s.LocalCurrencyCode as LCC,
    c.CustomerId,c.CompanyName,Year(s.DateRequested) Year,'' as CreatedByLocation,'${obj.ReportCurrencyCode}' as ReportCurrencyCode,
 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Price,
 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(poi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Cost,
 CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(poi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2)),2),2)) as Profit,
 CONCAT(ROUND(((ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(poi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),' ','%') Margin,
    
    '-' as PartId,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR,c.CustomerGroupId `;
  var query = ` From tbl_sales_order s  
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0  
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode != "" `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.Year != '') {
    query += ` and Year(s.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(s.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( s.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( s.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
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
          if (obj.columns[cvalue].search.value == 4) { //Shop Invoice
            query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
          }
          if (obj.columns[cvalue].search.value == 5) { //MRO without shop
            query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
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
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( s.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CustomerGroupId":
          query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By Year(s.DateRequested),s.CustomerId,s.LocalCurrencyCode `;
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
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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

SalesOrderReportsModel.SODetailedReportWithCurrency = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    Ids += val.CustomerId + `,`;
  }
  var CustomerIds = Ids.slice(0, -1);
  var query = ``;
  query = ` Select  s.SONo SONo,si.PartNo PartNo,IF(s.RRId>0, s.RRId, IF(s.MROId>0, s.MROId, 0)) as 'RR/MRO',
  c.CompanyName Customer,DATE_FORMAT(s.DateRequested,'%m/%d/%Y') Date,si.Quantity,s.LocalCurrencyCode as Currency,
  si.Rate UnitPrice,'${obj.ReportCurrencyCode}' as ReportCurrencyCode,
  ((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0)+ifnull(pi.ShippingCharge,0))*Ifnull(EXR.ExchangeRate,1)) as UnitCost,
  si.Discount,
  FORMAT(ROUND((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))+ifnull(si.ShippingCharge,0)),2),2) as OriginalPrice,
  FORMAT(ROUND(((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))+(ifnull(si.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),2),2) as ExtPrice,
  FORMAT(ROUND(((((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0)) +(ifnull(pi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),2),2) as ExtCost,  
  FORMAT(ROUND((((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))+(ifnull(si.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))-(((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(pi.Quantity,0))+(ifnull(pi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),2),2) GrossProfit, 
  IF((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))>0,CONCAT(ROUND((((((((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))+(ifnull(si.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))-(((Ifnull(pi.Rate,0)+Ifnull(pi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(si.Quantity,0))+(ifnull(pi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1)))*100)/((Ifnull(si.Rate,0)+Ifnull(si.Tax,0))*Ifnull(si.Quantity,0))+ifnull(si.ShippingCharge,0)),2),' %'),'-100 %')  as GrossProfitPercentage

  From tbl_sales_order s
  Left JOIN tbl_sales_order_item si on si.SOId=s.SOId AND si.IsDeleted = 0
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0 AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}  
  Left JOIN tbl_po_item pi on pi.POItemId=si.POItemId AND pi.IsDeleted = 0
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = pi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED}  AND s.IsDeleted=0  AND s.LocalCurrencyCode !="" `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
  if (obj.CustomerGroupId != "") {
    query += " and  c.CustomerGroupId In (" + obj.CustomerGroupId + ") ";
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
  }
  if (CustomerIds != '' && CustomerIds != null) {
    query += ` and s.CustomerId in(` + CustomerIds + `)`;
  }
  if (obj.CurrencyCode != "" && obj.CurrencyCode != "null") {
    query += " and ( s.LocalCurrencyCode ='" + obj.CurrencyCode + "' ) ";
  }
  if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
    query += " and ( s.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
  }
  query += ` order By s.DateRequested desc `;
  //console.log("SQL=SODetailedReportNew" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

SalesOrderReportsModel.SalesByMonthReportToExcelWithCurrency = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    if (val.Month != '')
      Ids = Ids + `'${val.Month}'` + `,`;
  }
  var Months = Ids.slice(0, -1);
  var query = ``;
  query = ` SELECT CONCAT(MONTHNAME(s.DateRequested),' ',Year(s.DateRequested)) Month, s.LocalCurrencyCode as LCC,'${obj.ReportCurrencyCode}' as ReportCurrencyCode,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Price,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Cost,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2)),2),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),' ','%') Margin
 
  From tbl_sales_order s 
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
  Left JOIN tbl_repair_request as RR ON RR.RRId = s.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CURLL  ON CURLL.CurrencyCode = s.LocalCurrencyCode AND CURLL.IsDeleted = 0 
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId AND c.IsDeleted=0
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode != ""`;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
  if (obj.CustomerGroupId != "") {
    // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.CustomerGroupId + ")))  ";
    query += ` and c.CustomerGroupId in(` + obj.CustomerGroupId + `)`;
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
  }
  if (Months != '' && Months != null) {
    query += ` and MONTHNAME(s.DateRequested) in(` + Months + `)`;
  }
  if (obj.CurrencyCode != "" && obj.CurrencyCode != "null") {
    query += " and ( s.LocalCurrencyCode ='" + obj.CurrencyCode + "' ) ";
  }
  if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
    query += " and ( s.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
  }
  query += `  GROUP BY Year(s.DateRequested),MONTH(s.DateRequested),MONTHNAME(s.DateRequested),CONCAT(MONTHNAME(s.DateRequested),' ',Year(s.DateRequested)), s.LocalCurrencyCode `;
  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

SalesOrderReportsModel.ParticularMonthSOByCustomerToExcelWithCurrency = (obj, result) => {

  var Ids = ``;
  for (let val of obj.SalesOrderReports) {
    Ids += val.CustomerId + `,`;
  }
  var CustomerIds = Ids.slice(0, -1);
  var query = ``;
  query = ` SELECT   c.CompanyName,     s.LocalCurrencyCode as LCC,'${obj.ReportCurrencyCode}' as ReportCurrencyCode,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Price,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),2)) as Cost,
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2)),2),2)) as Profit,
  CONCAT(ROUND(((ifnull(sum((((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0))*100)/ifnull(sum(((Ifnull(soi.Rate,0)+Ifnull(soi.Tax,0))*Ifnull(soi.Quantity,0)) + (ifnull(soi.ShippingCharge,0)*Ifnull(EXR.ExchangeRate,1))),0),2),' ','%') Margin

  From tbl_sales_order s
  Left JOIN tbl_po p on p.POId=s.POId AND p.IsDeleted = 0  AND p.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi  ON soi.SOId = s.SOId  AND soi.IsDeleted = 0
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
  Left Join tbl_customers c on c.CustomerId=s.CustomerId
  Left JOIN tbl_mro as mro  ON mro.MROId = s.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = '${obj.ReportCurrencyCode}' AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CURLL  ON CURLL.CurrencyCode = s.LocalCurrencyCode AND CURLL.IsDeleted = 0 
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = '${obj.ReportCurrencyCode}' AND  (DATE(s.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_countries CON on CON.CountryId=s.CreatedByLocation
  where s.Status=${Constants.CONST_SO_STATUS_APPROVED} AND s.IsDeleted=0 AND s.LocalCurrencyCode != ""`;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${obj.MultipleCustomerIds}) `;
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
  if (obj.CustomerGroupId != "") {
    // query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId IN (" + obj.CustomerGroupId + "))) ";
    query += ` and c.CustomerGroupId in(` + obj.CustomerGroupId + `)`;
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
  if (obj.IncludeRR == 4) { //Shop SO
    query += ' and s.RRId = 0 AND s.MROId > 0 AND  mro.EcommerceOrderId != 0  ';
  }
  if (obj.IncludeRR == 5) { //MRO without shop
    query += ' and s.RRId = 0 AND s.MROId > 0 AND mro.EcommerceOrderId = 0 ';
  }
  if (CustomerIds != '' && CustomerIds != null) {
    query += ` and s.CustomerId in(` + CustomerIds + `)`;
  }
  if (obj.CurrencyCode != "" && obj.CurrencyCode != "null") {
    query += " and ( s.LocalCurrencyCode ='" + obj.CurrencyCode + "' ) ";
  }
  if (obj.CreatedByLocation != "" && obj.CreatedByLocation != "null") {
    query += " and ( s.CreatedByLocation ='" + obj.CreatedByLocation + "' ) ";
  }
  query += " Group By s.CustomerId,s.LocalCurrencyCode ";

  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};


module.exports = SalesOrderReportsModel;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var async = require('async');

const POReportsModel = function (obj) {

  this.DateRequested = obj.DateRequested ? obj.DateRequested : '';
  this.DateRequestedTo = obj.DateRequestedTo ? obj.DateRequestedTo : '';
  this.DueDate = obj.DueDate ? obj.DueDate : '';
  this.DueDateTo = obj.DueDateTo ? obj.DueDateTo : '';
  this.Created = obj.Created ? obj.Created : '';
  this.CreatedTo = obj.CreatedTo ? obj.CreatedTo : '';
  this.CustomerId = obj.CustomerId ? obj.CustomerId : '';
  this.VendorId = obj.VendorId ? obj.VendorId : 0;
  this.PartId = obj.PartId ? obj.PartId : '';
  this.Status = obj.Status ? obj.Status : 0;
  this.POType = obj.POType ? obj.POType : 0;
  this.IncludeRR = obj.IncludeRR ? obj.IncludeRR : 100;
  this.POReports = obj.POReports ? obj.POReports : '';
  this.Month = obj.Month ? obj.Month : '';
  this.Year = obj.Year ? obj.Year : '';
  this.CurrencyCode = obj.CurrencyCode ? obj.CurrencyCode : '';
  this.CreatedByLocation = obj.CreatedByLocation ? obj.CreatedByLocation : '';

  this.VendorInvoiceNo = obj.VendorInvoiceNo ? obj.VendorInvoiceNo : '';
  this.PONo = obj.PONo ? obj.PONo : '';
  this.PartNo = obj.PartNo ? obj.PartNo : '';

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
//Get PurchasesByItem
POReportsModel.PurchasesByItemReport = (obj, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT '-' as Status,'-' as POType,pi.PartId,p.PartNo,SUM(pi.Quantity) as QuantityPurchased,
    CONCAT('$',' ',FORMAT(ROUND(SUM(pi.price)/sum(pi.Quantity)),2)) as AvgAmount,CONCAT('$',' ',FORMAT(ROUND(SUM(pi.price)),2)) as TotalAmount,
    '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,
    '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR  `;

  query = query + ` From tbl_po po
    LEFT JOIN tbl_po_item pi on po.POId=pi.POId
    LEFT JOIN tbl_parts p on p.PartId=pi.PartId where po.IsDeleted=0 `;

  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 0) {
            query += ' and po.RRId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) {
            query += ' and po.RRId > 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( po.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( po.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( po.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( po.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( po.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( po.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "PartId":
          query += " and ( pi.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Status":
          query += " and ( po.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  query += ` GROUP BY pi.PartId `;
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
          query += " p.PartNo " + obj.order[i].dir + " ";
          break;
        case "QuantityPurchased":
          query += " SUM(pi.Quantity) " + obj.order[i].dir + " ";
          break;
        case "AvgAmount":
          query += " ROUND(SUM(pi.price)/sum(pi.Quantity)) " + obj.order[i].dir + " ";
          break;
        case "TotalAmount":
          query += " SUM(pi.price) " + obj.order[i].dir + " ";
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
    From tbl_po po
    LEFT JOIN tbl_po_item pi on po.POId=pi.POId
    LEFT JOIN tbl_parts p on p.PartId=pi.PartId where po.IsDeleted=0  Group By pi.PartId) as A `;

  //  console.log("query = " + query);
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
//Get PurchasesByItemReportToExcel
POReportsModel.PurchasesByItemReportToExcel = (obj, result) => {

  var Ids = ``;
  for (let val of obj.POReports) {
    Ids += val.PartId + `,`;
  }
  var PartIds = Ids.slice(0, -1);
  var query = ``;
  query = ` SELECT p.PartNo,SUM(pi.Quantity) as QuantityPurchased,
  CONCAT('$',' ',FORMAT(ROUND(SUM(pi.price)/sum(pi.Quantity)),2)) as AvgAmount,CONCAT('$',' ',FORMAT(ROUND(SUM(pi.price)),2)) as TotalAmount
  From tbl_po po
  LEFT JOIN tbl_po_item pi on po.POId=pi.POId
  LEFT JOIN tbl_parts p on p.PartId=pi.PartId where po.IsDeleted=0 `;
  if (obj.DateRequested != "") {
    query += " and ( po.DateRequested >='" + obj.DateRequested + "' ) ";
  }
  if (obj.DateRequestedTo != "") {
    query += " and ( po.DateRequested <='" + obj.DateRequestedTo + "' ) ";
  }
  if (obj.DueDate != "") {
    query += " and ( po.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (obj.DueDateTo != "") {
    query += " and ( po.DueDate <='" + obj.DueDateTo + "' ) ";
  }
  if (obj.Created != "") {
    query += " and ( po.Created >='" + obj.Created + "' ) ";
  }
  if (obj.CreatedTo != "") {
    query += " and ( po.Created <='" + obj.CreatedTo + "' ) ";
  }
  if (obj.PartId != "") {
    query += " and ( pi.PartId ='" + obj.PartId + "' ) ";
  }
  if (obj.Status != "") {
    query += " and ( po.Status ='" + obj.Status + "' ) ";
  }
  if (obj.POType != "") {
    query += " and ( po.POType ='" + obj.POType + "' ) ";
  }
  if (obj.IncludeRR == 0) {
    query += " and  po.RRId =0 ";
  }
  if (obj.IncludeRR == 2) {
    query += " and  po.RRId >0 ";
  }
  if (PartIds != '' && PartIds != null) {
    query += ` and pi.PartId in(` + PartIds + `)`;
  }
  query += " Group By pi.PartId ";

  //console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};
//Get PurchasesByVendor
POReportsModel.PurchasesByVendor = (obj, result) => {

  var query = "";
  selectquery = "";

  selectquery = `Select '-' as Status,'-' as POType,'-' as PartId,v.VendorId,v.VendorName,
  SUM(pi.Quantity) as QuantityPurchased,CONCAT('$',' ',FORMAT(ROUND(SUM(pi.price)),2)) as TotalAmount,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,
  '-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR `;

  query = query + ` From tbl_po po
  LEFT JOIN tbl_po_item pi on po.POId=pi.POId
  Left Join tbl_vendors v on v.VendorId=po.VendorId where po.IsDeleted=0 `;

  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 0) {
            query += ' and po.RRId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) {
            query += ' and po.RRId > 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( po.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( po.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( po.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( po.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( po.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( po.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "VendorId":
          query += " and ( v.VendorId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Status":
          query += " and ( po.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  query += ` Group By po.VendorId `;
  var Countquery = `Select Count(Counts) recordsFiltered from ( Select count(*) as Counts ` + query + ` ) as A `;

  var i = 0;
  if (obj.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < obj.order.length; i++) {
    if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
    {
      switch (obj.columns[obj.order[i].column].name) {
        case "VendorId":
          query += " po.VendorId " + obj.order[i].dir + " ";
          break;
        case "QuantityPurchased":
          query += " SUM(pi.Quantity) " + obj.order[i].dir + " ";
          break;
        case "TotalAmount":
          query += " ROUND(SUM(pi.price)) " + obj.order[i].dir + " ";
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
  From tbl_po po
  LEFT JOIN tbl_po_item pi on po.POId=pi.POId
  Left Join tbl_vendors v on v.VendorId=po.VendorId where po.IsDeleted=0 Group By po.VendorId) as A `;

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
//Get PurchasesByVendorReportToExcel
POReportsModel.PurchasesByVendorReportToExcel = (obj, result) => {

  var Ids = ``;
  for (let val of obj.POReports) {
    Ids += val.VendorId + `,`;
  }
  var VendorIds = Ids.slice(0, -1);
  var query = ``;
  query = ` Select v.VendorName,SUM(pi.Quantity) as QuantityPurchased,CONCAT('$',' ',FORMAT(ROUND(SUM(pi.price)),2)) as TotalAmount
From tbl_po po
LEFT JOIN tbl_po_item pi on po.POId=pi.POId
Left Join tbl_vendors v on v.VendorId=po.VendorId where po.IsDeleted=0 `;
  if (obj.DateRequested != "") {
    query += " and ( po.DateRequested >='" + obj.DateRequested + "' ) ";
  }
  if (obj.DateRequestedTo != "") {
    query += " and ( po.DateRequested <='" + obj.DateRequestedTo + "' ) ";
  }
  if (obj.DueDate != "") {
    query += " and ( po.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (obj.DueDateTo != "") {
    query += " and ( po.DueDate <='" + obj.DueDateTo + "' ) ";
  }
  if (obj.Created != "") {
    query += " and ( po.Created >='" + obj.Created + "' ) ";
  }
  if (obj.CreatedTo != "") {
    query += " and ( po.Created <='" + obj.CreatedTo + "' ) ";
  }
  if (obj.VendorId != "") {
    query += " and ( po.VendorId ='" + obj.VendorId + "' ) ";
  }
  if (obj.PartId != "") {
    query += " and ( po.PartId ='" + obj.PartId + "' ) ";
  }
  if (obj.POType != "") {
    query += " and ( po.POType ='" + obj.POType + "' ) ";
  }
  if (obj.Status != "") {
    query += " and ( po.Status ='" + obj.Status + "' ) ";
  }
  if (obj.IncludeRR == 0) {
    query += " and  po.RRId =0 ";
  }
  if (obj.IncludeRR == 2) {
    query += " and  po.RRId >0 ";
  }
  if (VendorIds != '' && VendorIds != null) {
    query += ` and po.VendorId in(` + VendorIds + `)`;
  }
  query += " Group By po.VendorId ";

  // console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};
//Get SalesByMonth
POReportsModel.PurchasesByMonth = (obj, result) => {

  var selectquery = `SELECT '-' as Status,'-' as POType,MONTHNAME(po.Created) as Month ,CONCAT('$',' ',FORMAT(ROUND(sum(pi.Price)),2)) as TotalAmount,
  '-' as DateRequested,'-' as DateRequestedTo,'-' as DueDate,'-' as DueDateTo,'-' as Created,'-' as CreatedTo,'-' as IncludeRR  `;
  var query = ` From tbl_po po
  LEFT JOIN tbl_po_item pi on po.POId=pi.POId
  where po.IsDeleted=0 `;

  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 0) {
            query += ' and po.RRId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) {
            query += ' and po.RRId > 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( po.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( po.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( po.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( po.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( po.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( po.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Status":
          query += " and ( po.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  query += `  GROUP BY MONTHNAME(po.Created),MONTH(po.Created) `;
  var Countquery = ` Select count(Counts) as recordsFiltered from (Select count(MONTHNAME(po.Created)) Counts ` + query + ` ) as A `;
  var i = 0;
  if (obj.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < obj.order.length; i++) {
    if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
    {
      switch (obj.columns[obj.order[i].column].name) {
        case "Month":
          query += " MONTH(po.Created) " + obj.order[i].dir + " ";
          break;
        case "TotalAmount":
          query += " ROUND(sum(pi.Price)) " + obj.order[i].dir + " ";
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

  var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(MONTHNAME(po.Created)) as Counts 
  From tbl_po po
  LEFT JOIN tbl_po_item pi on po.POId=pi.POId
  where po.IsDeleted=0 GROUP BY MONTHNAME(po.Created),MONTH(po.Created)) as A `;

  // console.log("query = " + query);
  //console.log("Countquery = " + Countquery);
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
//Get PurchasesByMonthReportToExcel
POReportsModel.PurchasesByMonthReportToExcel = (obj, result) => {

  var Ids = ``;
  for (let val of obj.POReports) {
    if (val.Month != '')
      Ids = Ids + `'${val.Month}'` + `,`;
  }
  var Months = Ids.slice(0, -1);
  var query = ``;
  query = ` SELECT MONTHNAME(po.Created) as Month ,CONCAT('$',' ',FORMAT(ROUND(sum(pi.Price)),2)) as TotalAmount
  From tbl_po po
  LEFT JOIN tbl_po_item pi on po.POId=pi.POId
  where po.IsDeleted=0 `;
  if (obj.DateRequested != "") {
    query += " and ( po.DateRequested >='" + obj.DateRequested + "' ) ";
  }
  if (obj.DateRequestedTo != "") {
    query += " and ( po.DateRequested <='" + obj.DateRequestedTo + "' ) ";
  }
  if (obj.DueDate != "") {
    query += " and ( po.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (obj.DueDateTo != "") {
    query += " and ( po.DueDate <='" + obj.DueDateTo + "' ) ";
  }
  if (obj.Created != "") {
    query += " and ( po.Created >='" + obj.Created + "' ) ";
  }
  if (obj.CreatedTo != "") {
    query += " and ( po.Created <='" + obj.CreatedTo + "' ) ";
  }
  if (obj.POType != "") {
    query += " and ( po.POType ='" + obj.POType + "' ) ";
  }
  if (obj.Status != "") {
    query += " and ( po.Status ='" + obj.Status + "' ) ";
  }
  if (obj.IncludeRR == 0) {
    query += " and  po.RRId =0 ";
  }
  if (obj.IncludeRR == 2) {
    query += " and  po.RRId >0 ";
  }
  if (Months != '' && Months != null) {
    query += ` and MONTHNAME(po.Created) in(` + Months + `)`;
  }
  query += `  GROUP BY MONTHNAME(po.Created),MONTH(po.Created) `;
  //console.log("SQL=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

POReportsModel.OverAllSummaryNew = (obj, result) => {

  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(tpoi.Rate,0)+Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0))),0),2),2)) as Price,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(tpoi.Quantity,0))),0),2),2)) as Cost,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(tpoi.Rate,0)+Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(tpoi.Quantity,0))),0),2)),2),2)) as Profit,
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(tpoi.Rate,0)+Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0))),0)-ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(tpoi.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(tpoi.Rate,0)+Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0))),0),2),' ','%') Margin

  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(tpoi.Quantity,0))),0),2),2)) as Cost,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(tpoi.Quantity,0))),0),2)),2),2)) as Profit,
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0))),0)-ifnull(sum((((Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(tpoi.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0))),0),2),' ','%') Margin
  var query = `  SELECT tp.LocalCurrencyCode as LCC,
   
  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0))),0),2),2)) as Price
  

  From tbl_po tp  
  Left JOIN tbl_po_item tpoi on tpoi.POId=tp.POId AND tpoi.IsDeleted = 0
  LEFT JOIN tbl_vendor_invoice as I On I.POId = tp.POId
  Left JOIN tbl_sales_order tso on tso.SOId=tp.SOId AND tso.IsDeleted = 0 AND tso.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  
  Left JOIN tbl_sales_order_item tsoi on tsoi.SOItemId=tpoi.SOItemId AND tsoi.IsDeleted = 0
  Left JOIN tbl_repair_request as RR ON RR.RRId = tp.RRId  AND RR.IsDeleted = 0  
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = tp.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = tsoi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = tpoi.ItemLocalCurrencyCode AND  (DATE(tp.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  
  where tp.Status=${Constants.CONST_PO_STATUS_APPROVED} AND tp.IsDeleted=0 AND tp.LocalCurrencyCode !=""`;

  // if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
  //   query += ` and tp.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  // }
  if (obj.Year != '') {
    query += ` and Year(tp.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(tp.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( tp.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( tp.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
  }
  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {

      switch (obj.columns[cvalue].name) {
        case "Year":
          query += " and Year(tp.DateRequested)='" + obj.columns[cvalue].search.value + "'  ";
          break;
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 1) { //RR Invoice
            query += ' and tp.RRId > 0 AND tp.MROId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
            query += ' and tp.RRId = 0 AND tp.MROId > 0  ';
          }
          if (obj.columns[cvalue].search.value == 3) { //QT Invoice
            query += ' and tp.RRId = 0 and tp.MROId = 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( tp.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( tp.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( tp.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( tp.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( tp.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "PartId":
          query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( tp.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "VendorId":
          query += " and  tp.VendorId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "Status":
          query += " and ( tp.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.PONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tpoi.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "VendorInvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.VendorInvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By tp.LocalCurrencyCode  `;
  return query;

  /*var query1 = `  SELECT
  0 as Price,
  0 as Cost,
  0 Profit,
  0 Margin
  From tbl_sales_order s  WHERE 1=2 `;
  return query1;*/

};


POReportsModel.OverAllBaseSummaryNew = (obj, result) => {
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(tpoi.BaseRate,0)+Ifnull(tpoi.BaseTax,0))*Ifnull(tpoi.Quantity,0))),0),2),2)) as Price,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.Tax,0)))*Ifnull(tpoi.Quantity,0))),0),2),2)) as Cost,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(tpoi.BaseRate,0)+Ifnull(tpoi.BaseTax,0))*Ifnull(tpoi.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.BaseTax,0)))*Ifnull(tpoi.Quantity,0))),0),2)),2),2)) as Profit,
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(tpoi.BaseRate,0)+Ifnull(tpoi.BaseTax,0))*Ifnull(tpoi.Quantity,0))),0)-ifnull(sum((((Ifnull(poi.BaseRate,0)+Ifnull(poi.BaseTax,0)))*Ifnull(tpoi.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(tpoi.BaseRate,0)+Ifnull(tpoi.BaseTax,0))*Ifnull(tpoi.Quantity,0))),0),2),' ','%') Margin

  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(tpoi.BaseTax,0))*Ifnull(tpoi.Quantity,0))),0),2),2)) as Price,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Tax,0)))*Ifnull(tpoi.Quantity,0))),0),2),2)) as Cost,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(tpoi.BaseTax,0))*Ifnull(tpoi.Quantity,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.BaseTax,0)))*Ifnull(tpoi.Quantity,0))),0),2)),2),2)) as Profit,
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(tpoi.BaseTax,0))*Ifnull(tpoi.Quantity,0))),0)-ifnull(sum((((Ifnull(poi.BaseTax,0)))*Ifnull(tpoi.Quantity,0))),0))*100)/ifnull(sum(((Ifnull(tpoi.BaseTax,0))*Ifnull(tpoi.Quantity,0))),0),2),' ','%') Margin

  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum((((Ifnull(poi.Tax,0)))*Ifnull(tpoi.Quantity,0)*Ifnull(tpoi.ItemExchangeRate,0))),0),2),2)) as Cost,
  // CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND((ROUND(ifnull(sum(((Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0)*Ifnull(tpoi.ItemExchangeRate,0))),0),2) - ROUND(ifnull(sum((((Ifnull(poi.Tax,0)))*Ifnull(tpoi.Quantity,0)*Ifnull(tpoi.ItemExchangeRate,0))),0),2)),2),2)) as Profit,
  // CONCAT(ROUND(((ifnull(sum(((Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0)*Ifnull(tpoi.ItemExchangeRate,0))),0)-ifnull(sum((((Ifnull(poi.Tax,0)))*Ifnull(tpoi.Quantity,0)*Ifnull(tpoi.ItemExchangeRate,0))),0))*100)/ifnull(sum(((Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0)*Ifnull(tpoi.ItemExchangeRate,0))),0),2),' ','%') Margin
  var query = `  SELECT tp.BaseCurrencyCode as LCC, 
  

  CONCAT(CURL.CurrencySymbol,' ',FORMAT(ROUND(ifnull(sum(((Ifnull(tpoi.Tax,0))*Ifnull(tpoi.Quantity,0)*Ifnull(tpoi.ItemExchangeRate,0))),0),2),2)) as Price
  

  From tbl_po tp  
  Left JOIN tbl_po_item tpoi on tpoi.POId=tp.POId AND tpoi.IsDeleted = 0
  LEFT JOIN tbl_vendor_invoice as I On I.POId = tp.POId
  Left JOIN tbl_sales_order tso on tso.SOId=tp.SOId AND tso.IsDeleted = 0 AND tso.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  
  Left JOIN tbl_sales_order_item tsoi on tsoi.SOItemId=tpoi.SOItemId AND tsoi.IsDeleted = 0
  Left JOIN tbl_repair_request as RR ON RR.RRId = tp.RRId  AND RR.IsDeleted = 0  
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = tp.BaseCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = tsoi.ItemBaseCurrencyCode AND EXR.TargetCurrencyCode = tpoi.ItemBaseCurrencyCode AND  (DATE(tp.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  
  where tp.Status=${Constants.CONST_PO_STATUS_APPROVED} AND tp.IsDeleted=0 AND tp.BaseCurrencyCode !=""`;

  // if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
  //   query += ` and tp.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  // }
  if (obj.Year != '') {
    query += ` and Year(tp.DateRequested) in(` + obj.Year + `) `;
  }
  if (obj.Month != '') {
    query += ` and MONTHNAME(tp.DateRequested) in('` + obj.Month + `') `;
  }
  if (obj.CurrencyCode != '') {
    query += ` and ( tp.LocalCurrencyCode = '` + obj.CurrencyCode + `' ) `;
  }
  if (obj.CreatedByLocation != '') {
    query += ` and ( tp.CreatedByLocation = '` + obj.CreatedByLocation + `' ) `;
  }
  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {

      switch (obj.columns[cvalue].name) {
        case "Year":
          query += " and Year(tp.DateRequested)='" + obj.columns[cvalue].search.value + "'  ";
          break;
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 1) { //RR Invoice
            query += ' and tp.RRId > 0 AND tp.MROId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
            query += ' and tp.RRId = 0 AND tp.MROId > 0  ';
          }
          if (obj.columns[cvalue].search.value == 3) { //QT Invoice
            query += ' and tp.RRId = 0 and tp.MROId = 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( tp.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( tp.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( tp.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( tp.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( tp.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "PartId":
          query += " and ( RR.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( tp.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "VendorId":
          query += " and  tp.VendorId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "Status":
          query += " and ( tp.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.PONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tpoi.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "VendorInvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.VendorInvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
      }
    }
  }
  query += ` Group By tp.BaseCurrencyCode  `;
  return query;

};

POReportsModel.POTaxVatReport = (obj, result) => {

  var selectquery = ` SELECT V.VendorName,V.VendorId, tp.PONo, 
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
I.VendorInvoiceNo, Case I.Status
  WHEN 0 THEN '${Constants.array_vendor_invoice_status[0]}'
  WHEN 1 THEN '${Constants.array_vendor_invoice_status[1]}'
  WHEN 2 THEN '${Constants.array_vendor_invoice_status[2]}'
  WHEN 3 THEN '${Constants.array_vendor_invoice_status[3]}'
  WHEN 4 THEN '${Constants.array_vendor_invoice_status[4]}'
  WHEN 5 THEN '${Constants.array_vendor_invoice_status[5]}'
  ELSE '-'
  end VendorInvoiceStatusName, 
  CASE WHEN I.VendorInvoiceNo IS NOT NULL THEN "Yes" ELSE "No" END AS ConvertedToVendorBill, 
  tpoi.PartNo,tpoi.Description,CONCAT(CURL.CurrencySymbol,' ',ROUND(Ifnull(tpoi.Tax,0),2)) as Tax,tpoi.Quantity,CONCAT(tpoi.ItemTaxPercent, ' %') as ItemTaxPercent,
  CONCAT(CURL.CurrencySymbol,' ',ROUND((Ifnull(tpoi.Tax,0)*Ifnull(tpoi.Quantity,0)),2)) as TotalTaxAmount, 
  ItemLocalCurrencyCode  `;


  var query = ` From tbl_po tp
  Left JOIN tbl_repair_request as RR ON RR.RRId = tp.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_po_item as tpoi  ON tpoi.POId = tp.POId  AND tpoi.IsDeleted = 0 AND tpoi.Tax != 0 AND tpoi.Tax IS NOT NULL 
  LEFT JOIN tbl_vendor_invoice as I On I.POId = tp.POId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = tp.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_countries CON on CON.CountryId=tp.CreatedByLocation
  LEFT JOIN tbl_vendors V on V.VendorId=tp.VendorId
  where tp.Status=${Constants.CONST_PO_STATUS_APPROVED} AND tp.IsDeleted=0 AND tpoi.Tax > 0 AND tp.LocalCurrencyCode != "" `;

  if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
    query += ` and RR.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  }

  if (obj.Year != '') {
    query += ` and Year(tp.DateRequested) in(` + obj.Year + `) `;
  }

  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "Year":
          query += " and YEAR(tp.DateRequested) = '" + obj.columns[cvalue].search.value + "'  ";
          break;
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 1) { //RR Invoice
            query += ' and tp.RRId > 0 AND tp.MROId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
            query += ' and tp.RRId = 0 AND tp.MROId > 0  ';
          }
          if (obj.columns[cvalue].search.value == 3) { //QT Invoice
            query += ' and tp.RRId = 0 and tp.MROId = 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( tp.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( tp.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( tp.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( tp.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( tp.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( tp.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "VendorId":
          query += " and  tp.VendorId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "PartId":
          query += " and  tpoi.PartId = " + obj.columns[cvalue].search.value + " ";
          break;
        case "Status":
          query += " and ( tp.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.PONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            // query += " and ( tpoi.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
            query += " and ( tpoi.PartNo LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          }
          break;
        case "VendorInvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.VendorInvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          // console.log(obj.columns[cvalue].name);
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }//
  }
  query += `   `;
  var Countquery = ` Select count(POItemId) as recordsFiltered     ` + query + ` `;
  var i = 0;
  if (obj.order.length > 0) {
    // query += " ORDER BY ";
    // for (i = 0; i < obj.order.length; i++) {
    //   if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
    //   {
    //     switch (obj.columns[obj.order[i].column].name) {
    //       case "Year":
    //         query += " MONTH(tp.DateRequested) " + obj.order[i].dir + " ";
    //         break;
    //       case "Month":
    //         query += " MONTH(tp.DateRequested) " + obj.order[i].dir + " ";
    //         break;
    //       default:
    //         query += " MONTH(tp.DateRequested) " + obj.order[i].dir + " ";
    //     }
    //   }
    // }
  } else {
    // query += " ORDER BY tp.POId DESC ";
  }
  query += " ORDER BY tp.POId DESC ";
  if (obj.start != "-1" && obj.length != "-1") {
    query += " LIMIT " + obj.start + "," + (obj.length);
  }
  query = selectquery + query;
// Select Count(Counts) TotalCount from (Select count(MONTHNAME(tp.DateRequested)) as Counts 
  var TotalCountQuery = `Select Count(tp.POId) TotalCount 
  From tbl_po tp
  Left JOIN tbl_repair_request as RR ON RR.RRId = tp.RRId  AND RR.IsDeleted = 0  
  Left JOIN tbl_po_item as tpoi  ON tpoi.POId = tp.POId  AND tpoi.IsDeleted = 0 AND tpoi.Tax != 0 AND tpoi.Tax IS NOT NULL 
  LEFT JOIN tbl_vendor_invoice as I On I.POId = tp.POId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = tp.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_countries CON on CON.CountryId=tp.CreatedByLocation
  LEFT JOIN tbl_vendors V on V.VendorId=tp.VendorId
  where tp.Status=${Constants.CONST_PO_STATUS_APPROVED} AND tp.IsDeleted=0 AND tpoi.Tax > 0 AND tp.LocalCurrencyCode != "" 
  `;
  if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
    TotalCountQuery += ` and RR.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  }
  // TotalCountQuery += ` GROUP BY YEAR(tp.DateRequested),MONTH(tp.DateRequested),MONTHNAME(tp.DateRequested)) as A `;
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
POReportsModel.POTaxVatReportToExcel = (obj, result) => {

  var selectquery = ` SELECT V.VendorName,V.VendorId, tp.PONo, 
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
I.VendorInvoiceNo, Case I.Status
  WHEN 0 THEN '${Constants.array_vendor_invoice_status[0]}'
  WHEN 1 THEN '${Constants.array_vendor_invoice_status[1]}'
  WHEN 2 THEN '${Constants.array_vendor_invoice_status[2]}'
  WHEN 3 THEN '${Constants.array_vendor_invoice_status[3]}'
  WHEN 4 THEN '${Constants.array_vendor_invoice_status[4]}'
  WHEN 5 THEN '${Constants.array_vendor_invoice_status[5]}'
  ELSE '-'
  end VendorInvoiceStatusName, 
  CASE WHEN I.VendorInvoiceNo IS NOT NULL THEN "Yes" ELSE "No" END AS ConvertedToVendorBill, 
  tpoi.PartNo,tpoi.Description,CONCAT(CURL.CurrencySymbol,' ',ROUND(Ifnull(tpoi.Tax,0),2)) as Tax,tpoi.Quantity,CONCAT(tpoi.ItemTaxPercent, ' %') as ItemTaxPercent,
  CONCAT(CURL.CurrencySymbol,' ',ROUND((Ifnull(tpoi.Tax,0)*Ifnull(tpoi.Quantity,0)),2)) as TotalTaxAmount, 
  ItemLocalCurrencyCode  `;


  var query = ` From tbl_po tp  
  Left JOIN tbl_po_item as tpoi  ON tpoi.POId = tp.POId  AND tpoi.IsDeleted = 0 AND tpoi.Tax != 0 AND tpoi.Tax IS NOT NULL 
  LEFT JOIN tbl_vendor_invoice as I On I.POId = tp.POId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = tp.LocalCurrencyCode AND CURL.IsDeleted = 0  
  LEFT JOIN tbl_countries CON on CON.CountryId=tp.CreatedByLocation
  LEFT JOIN tbl_vendors V on V.VendorId=tp.VendorId
  where tp.Status=${Constants.CONST_PO_STATUS_APPROVED} AND tp.IsDeleted=0 AND tpoi.Tax > 0 AND tp.LocalCurrencyCode != "" `;

  // if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
  //   query += ` and tp.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  // }

  if (obj.Year != '') {
    query += ` and Year(tp.DateRequested) in(` + obj.Year + `) `;
  }
  // Temp Hide

  if (obj.PONo && obj.PONo != '') {
    query += " and ( tp.PONo = '" + obj.PONo + "' ) ";
  }

  if (obj.PartNo && obj.PartNo != '') {
    query += " and ( tpoi.PartNo LIKE '%" + obj.PartNo + "%' ) ";
  }

  if (obj.VendorId && obj.VendorId != '') {
    query += " and  tp.VendorId In (" + obj.VendorId + ") ";
  }

  if (obj.VendorInvoiceNo && obj.VendorInvoiceNo != '') {
    query += " and ( I.VendorInvoiceNo = '" + obj.VendorInvoiceNo + "' ) ";
  }

  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "Year":
          query += " and YEAR(tp.DateRequested) = '" + obj.columns[cvalue].search.value + "'  ";
          break;
        case "IncludeRR":
          if (obj.columns[cvalue].search.value == 1) { //RR Invoice
            query += ' and tp.RRId > 0 AND tp.MROId = 0  ';
          }
          if (obj.columns[cvalue].search.value == 2) { //MRO Invoice
            query += ' and tp.RRId = 0 AND tp.MROId > 0  ';
          }
          if (obj.columns[cvalue].search.value == 3) { //QT Invoice
            query += ' and tp.RRId = 0 and tp.MROId = 0  ';
          }
          break;
        case "DateRequested":
          query += " and ( tp.DateRequested >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DateRequestedTo":
          query += " and ( tp.DateRequested <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDate":
          query += " and ( tp.DueDate >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "DueDateTo":
          query += " and ( tp.DueDate <='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( tp.Created >= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedTo":
          query += " and ( tp.Created <= '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "VendorId":
          query += " and  tp.VendorId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "PartId":
          query += " and  tpoi.PartId = " + obj.columns[cvalue].search.value + " ";
          break;
        case "Status":
          query += " and ( tp.Status = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CurrencyCode":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "CreatedByLocation":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PONo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( tp.PONo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        case "PartNo":
          if (obj.columns[cvalue].search.value != "null") {
            // query += " and ( tpoi.PartNo = '" + obj.columns[cvalue].search.value + "' ) ";
            query += " and ( tpoi.PartNo LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          }
          break;
        case "VendorInvoiceNo":
          if (obj.columns[cvalue].search.value != "null") {
            query += " and ( I.VendorInvoiceNo = '" + obj.columns[cvalue].search.value + "' ) ";
          }
          break;
        default:
          // console.log(obj.columns[cvalue].name);
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }//
  }
  query += `   `;

  var i = 0;

  query += " ORDER BY tp.POId DESC ";

  query = selectquery + query;


  var sqlArray = []; var obj = {};


  //console.log("query = " + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });

};
module.exports = POReportsModel;
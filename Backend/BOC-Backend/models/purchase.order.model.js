/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
var async = require('async');

const PurchaseOrderItem = require("../models/purchase.order.item.model.js");
const GlobalCustomerReference = require("./sales.order.customer.ref.model.js");
const Address = require("../models/customeraddress.model.js");
const Notes = require("../models/repair.request.notes.model.js");
const AttachmentModel = require("../models/repair.request.attachment.model.js");
var MailConfig = require('../config/email.config');
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
const RRVendors = require("./repair.request.vendors.model.js");
var gmailTransport = MailConfig.GmailTransport;


const PurchaseOrder = function (objPurchaseOrder) {
  this.POId = objPurchaseOrder.POId;
  this.PONo = objPurchaseOrder.PONo ? objPurchaseOrder.PONo : '';
  this.MROId = objPurchaseOrder.MROId ? objPurchaseOrder.MROId : 0;
  this.SOId = objPurchaseOrder.SOId ? objPurchaseOrder.SOId : 0;
  this.RRId = objPurchaseOrder.RRId ? objPurchaseOrder.RRId : 0;
  this.RRNo = objPurchaseOrder.RRNo ? objPurchaseOrder.RRNo : '';
  this.VendorId = objPurchaseOrder.VendorId ? objPurchaseOrder.VendorId : 0;
  this.VendorRefNo = objPurchaseOrder.VendorRefNo ? objPurchaseOrder.VendorRefNo : '';
  this.POType = objPurchaseOrder.POType ? objPurchaseOrder.POType : 0;
  this.TermsId = objPurchaseOrder.TermsId ? objPurchaseOrder.TermsId : 0;
  this.DateRequested = objPurchaseOrder.DateRequested ? objPurchaseOrder.DateRequested : null;
  this.DueDate = objPurchaseOrder.DueDate ? objPurchaseOrder.DueDate : null;
  this.AdditionalPONo = objPurchaseOrder.AdditionalPONo ? objPurchaseOrder.AdditionalPONo : '';
  this.ShippingAccountNumber = objPurchaseOrder.ShippingAccountNumber ? objPurchaseOrder.ShippingAccountNumber : '';
  this.ShipVia = objPurchaseOrder.ShipVia ? objPurchaseOrder.ShipVia : '';
  this.Code = objPurchaseOrder.Code ? objPurchaseOrder.Code : '';

  this.ShipAddressIdentityType = objPurchaseOrder.ShipAddressIdentityType ? objPurchaseOrder.ShipAddressIdentityType : 0;
  this.ShipAddressBookId = objPurchaseOrder.ShipAddressBookId ? objPurchaseOrder.ShipAddressBookId : 0;
  this.BillAddressBookId = objPurchaseOrder.BillAddressBookId ? objPurchaseOrder.BillAddressBookId : 0;
  this.ShippingNotes = objPurchaseOrder.ShippingNotes ? objPurchaseOrder.ShippingNotes : '';
  this.SubTotal = objPurchaseOrder.SubTotal ? objPurchaseOrder.SubTotal : 0;
  this.TaxPercent = objPurchaseOrder.TaxPercent ? objPurchaseOrder.TaxPercent : 0;
  this.TotalTax = objPurchaseOrder.TotalTax ? objPurchaseOrder.TotalTax : 0;
  this.Discount = objPurchaseOrder.Discount ? objPurchaseOrder.Discount : 0;
  this.AHFees = objPurchaseOrder.AHFees ? objPurchaseOrder.AHFees : 0;
  this.Shipping = objPurchaseOrder.Shipping ? objPurchaseOrder.Shipping : 0;
  this.GrandTotal = objPurchaseOrder.GrandTotal ? objPurchaseOrder.GrandTotal : 0;
  this.Status = objPurchaseOrder.Status;

  this.LocalCurrencyCode = objPurchaseOrder.LocalCurrencyCode ? objPurchaseOrder.LocalCurrencyCode : '';
  this.ExchangeRate = objPurchaseOrder.ExchangeRate ? objPurchaseOrder.ExchangeRate : 0;
  this.BaseCurrencyCode = objPurchaseOrder.BaseCurrencyCode ? objPurchaseOrder.BaseCurrencyCode : '';
  this.BaseGrandTotal = objPurchaseOrder.BaseGrandTotal ? objPurchaseOrder.BaseGrandTotal : 0;



  const TokenUserName = global.authuser.FullName ? global.authuser.FullName : '';
  this.RequestedByname = (objPurchaseOrder.authuser && objPurchaseOrder.authuser.FullName) ? objPurchaseOrder.authuser.FullName : TokenUserName;

  this.IsEmailSent = objPurchaseOrder.IsEmailSent ? objPurchaseOrder.IsEmailSent : 0;
  this.Created = objPurchaseOrder.Created ? objPurchaseOrder.Created + " 10:00:00" : cDateTime.getDateTime();
  this.Modified = objPurchaseOrder.Modified ? objPurchaseOrder.Modified + " 10:00:00" : cDateTime.getDateTime();

  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objPurchaseOrder.authuser && objPurchaseOrder.authuser.UserId) ? objPurchaseOrder.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objPurchaseOrder.authuser && objPurchaseOrder.authuser.UserId) ? objPurchaseOrder.authuser.UserId : TokenUserId;


  const TokenCreatedByLocation = global.authuser.Location ? global.authuser.Location : 0;
  this.CreatedByLocation = (objPurchaseOrder.authuser && objPurchaseOrder.authuser.Location) ? objPurchaseOrder.authuser.Location : TokenCreatedByLocation;

  this.authuser = objPurchaseOrder.authuser ? objPurchaseOrder.authuser : {};

  // For Server Side Search 
  this.start = objPurchaseOrder.start;
  this.length = objPurchaseOrder.length;
  this.search = objPurchaseOrder.search;
  this.sortCol = objPurchaseOrder.sortCol;
  this.sortDir = objPurchaseOrder.sortDir;
  this.sortColName = objPurchaseOrder.sortColName;
  this.order = objPurchaseOrder.order;
  this.columns = objPurchaseOrder.columns;
  this.draw = objPurchaseOrder.draw;
  this.LeadTime = objPurchaseOrder.LeadTime ? objPurchaseOrder.LeadTime : 0;
  this.WarrantyPeriod = objPurchaseOrder.WarrantyPeriod ? objPurchaseOrder.WarrantyPeriod : null;
}
PurchaseOrder.IsExistPOForMRO = (MROId, result) => {

  var sql = `Select POId,'w' as s From tbl_po WHERE IsDeleted=0 and MROId=${MROId} `;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

PurchaseOrder.IsNonRRAndNonMRO = (POId, result) => {

  var sql = `Select POId,'w' as s From tbl_po WHERE POId = ${POId} and RRId=0 and MROId=0 `;
  // var sql = `Select POId,'w' as s From tbl_po WHERE POId = ${POId}`;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

PurchaseOrder.ApprovePO = (PurchaseOrder, result) => {
  var sql = ``;
  sql = `UPDATE tbl_po SET ApprovedById = ?,ApprovedByName = ?,
  ApprovedDate = ?,Status = ?,
  Modified = ?,ModifiedBy = ? WHERE POId = ?`;
  var values = [
    PurchaseOrder.CreatedBy, PurchaseOrder.RequestedByname,
    PurchaseOrder.Created, Constants.CONST_PO_STATUS_APPROVED,
    PurchaseOrder.Modified, PurchaseOrder.ModifiedBy, PurchaseOrder.POId

  ]
  //console.log("AppPo =" + sql)
  // console.log("AppPo val=" + values)
  con.query(sql, values, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: PurchaseOrder.POId, ...PurchaseOrder });
  }
  );
};
//
PurchaseOrder.ReOpenPO = (obj, result) => {
  var sql = ``;
  sql = `UPDATE tbl_po SET ReOpenedBy = ?,ReOpenedByName = ?,
  ReOpenedDate = ?,Status = ?,
  Modified = ?,ModifiedBy = ? WHERE POId = ?`;
  var values = [
    obj.CreatedBy, obj.RequestedByname,
    cDateTime.getDate(), Constants.CONST_PO_STATUS_AMENDED,
    obj.Modified, obj.ModifiedBy, obj.POId
  ]
  con.query(sql, values, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: obj.POId, ...obj });
  });
};
//To PurchaseOrder ExcelData
PurchaseOrder.ExportToExcel = (reqBody, result) => {

  var obj = new PurchaseOrder(reqBody);
  var Ids = ``;
  for (let val of reqBody.PurchaseOrder) {
    Ids += val.POId + `,`;
  }
  var POIds = Ids.slice(0, -1);
  var sql = `SELECT 
  p.RRNo,PONo,v.VendorName,p.RequestedByname,p.ApprovedByName,DATE_FORMAT(p.DateRequested,'%m/%d/%Y') as DateRequested, 
  ROUND(ifnull(p.GrandTotal,0),2) as GrandTotal, 
  DATE_FORMAT(p.DueDate,'%m/%d/%Y') as DueDate,p.LocalCurrencyCode,p.ExchangeRate,p.BaseCurrencyCode,
  
ROUND(ifnull(p.BaseGrandTotal,0),2) as BaseGrandTotal, 

  CASE p.POType
  WHEN 0 THEN '${Constants.array_purchase_order_type[0]}'
   WHEN 1 THEN '${Constants.array_purchase_order_type[1]}'
   WHEN 2 THEN '${Constants.array_purchase_order_type[2]}'
   WHEN 3 THEN '${Constants.array_purchase_order_type[3]}'
   WHEN 4 THEN '${Constants.array_purchase_order_type[4]}'
   WHEN 5 THEN '${Constants.array_purchase_order_type[5]}'
   WHEN 6 THEN '${Constants.array_purchase_order_type[6]}'
   WHEN 7 THEN '${Constants.array_purchase_order_type[7]}'
   WHEN 8 THEN '${Constants.array_purchase_order_type[8]}'
   ELSE '-'	end POTypeName,
  CASE p.Status 
   WHEN 1 THEN '${Constants.array_purchase_order_status[1]}'
   WHEN 2 THEN '${Constants.array_purchase_order_status[2]}'
   WHEN 3 THEN '${Constants.array_purchase_order_status[3]}'
   WHEN 4 THEN '${Constants.array_purchase_order_status[4]}'
   WHEN 5 THEN '${Constants.array_purchase_order_status[5]}'
   WHEN 6 THEN '${Constants.array_purchase_order_status[6]}'
   WHEN 7 THEN '${Constants.array_purchase_order_status[7]}'
   WHEN 8 THEN '${Constants.array_purchase_order_status[8]}'
   WHEN 9 THEN '${Constants.array_purchase_order_status[9]}'
   ELSE '-'	end StatusName
   FROM tbl_po p
  LEFT JOIN tbl_vendors v on p.VendorId=v.VendorId
  LEFT JOIN tbl_sales_order as s on s.SOId=p.SOId
  where p.IsDeleted=0  `;

  var TokenIdentityType = getLogInIdentityType(obj);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(obj);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(obj);

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and s.CustomerId in(${MultipleCustomerIds}) `;
  }
  if (obj.RRNo != "") {
    sql += " and ( p.RRNo ='" + obj.RRNo + "' ) ";
  }
  if (obj.PONo != "") {
    sql += " and ( p.PONo ='" + obj.PONo + "' ) ";
  }
  if (obj.VendorId > 0) {
    sql += " and ( p.VendorId ='" + obj.VendorId + "' ) ";
  }
  if (reqBody.hasOwnProperty("RequestedById") == true && reqBody.RequestedById != "") {
    sql += " and ( p.RequestedById ='" + reqBody.RequestedById + "' ) ";
  }
  if (reqBody.hasOwnProperty("ApprovedById") == true && reqBody.ApprovedById != "") {
    sql += " and ( p.ApprovedById ='" + reqBody.ApprovedById + "' ) ";
  }
  if (obj.DateRequested != null) {
    sql += " and ( p.DateRequested >='" + obj.DateRequested + "' ) ";
  }
  if (reqBody.hasOwnProperty('DateRequestedTo') == true && reqBody.DateRequestedTo != "") {
    sql += " and ( p.DateRequested <='" + reqBody.DateRequestedTo + "' ) ";
  }
  if (obj.DueDate != null) {
    sql += " and ( p.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (reqBody.hasOwnProperty('DueDateTo') == true && reqBody.DueDateTo != "") {
    sql += " and ( p.DueDate <='" + reqBody.DueDateTo + "' ) ";
  }
  if (obj.POType > 0) {
    sql += " and ( p.POType ='" + obj.POType + "' ) ";
  }
  if (obj.Status > 0) {
    sql += " and ( p.Status ='" + obj.Status + "' ) ";
  }
  if (POIds != '') {
    sql += `and p.POId in(` + POIds + `)`;
  }
  // console.log("SQL=" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

PurchaseOrder.getPurchaseListByServerSide = (PurchaseOrder, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT p.POId,v.VendorName,p.VendorId ,DATE_FORMAT(p.DateRequested,'%m/%d/%Y') as DateRequested,p.IsEmailSent,
PONo,
ROUND(ifnull(p.GrandTotal,0),2) as GrandTotal, 
DATE_FORMAT(p.DueDate,'%m/%d/%Y') as DueDate, DATEDIFF(p.DueDate,CURDATE()) as DueDateDiff,p.RRNo,p.POType,p.RRId,
p.MROId,MRO.MRONo,p.LocalCurrencyCode,p.ExchangeRate,p.BaseCurrencyCode,p.BaseGrandTotal,p.CreatedByLocation,
CASE p.Status 
WHEN 1 THEN '${Constants.array_purchase_order_status[1]}'
WHEN 2 THEN '${Constants.array_purchase_order_status[2]}'
WHEN 3 THEN '${Constants.array_purchase_order_status[3]}'
WHEN 4 THEN '${Constants.array_purchase_order_status[4]}'
WHEN 5 THEN '${Constants.array_purchase_order_status[5]}'
WHEN 6 THEN '${Constants.array_purchase_order_status[6]}'
WHEN 7 THEN '${Constants.array_purchase_order_status[7]}'
WHEN 8 THEN '${Constants.array_purchase_order_status[8]}'
WHEN 9 THEN '${Constants.array_purchase_order_status[9]}'
ELSE '-'	end StatusName,p.Status,'' as DateRequestedTo,'' as DueDateTo,p.RequestedById,p.ApprovedById,
p.RequestedByname,p.ApprovedByName,p.IsDeleted,CUR.CurrencySymbol `;
  recordfilterquery = `Select count(p.POId) as recordsFiltered `;
  query = query + ` FROM tbl_po p
LEFT JOIN tbl_vendors v on p.VendorId=v.VendorId and v.IsDeleted=0
LEFT JOIN tbl_mro as MRO on MRO.MROId=p.MROId and MRO.IsDeleted=0
LEFT JOIN tbl_sales_order as s on s.SOId=p.SOId and s.IsDeleted=0
LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = p.LocalCurrencyCode AND CUR.IsDeleted = 0
where 1=1 `;

  var TokenIdentityType = getLogInIdentityType(PurchaseOrder);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(PurchaseOrder);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(PurchaseOrder);

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${MultipleCustomerIds}) `;
  }
  var VendorId = 0;
  // console.log("PurchaseOrder.VendorId=" + PurchaseOrder.VendorId)
  if (PurchaseOrder.VendorId != 0) {
    VendorId = PurchaseOrder.VendorId;
    query = query + ` and p.IsDeleted=0 and p.VendorId='${VendorId}' `;
  }

  if (PurchaseOrder.search.value != '') {
    query = query + ` and (  p.PONo LIKE '%${PurchaseOrder.search.value}%'
        or p.VendorId LIKE '%${PurchaseOrder.search.value}%' 
        or p.Status LIKE '%${PurchaseOrder.search.value}%' 
        or p.DateRequested LIKE '%${PurchaseOrder.search.value}%' 
        or p.DueDate LIKE '%${PurchaseOrder.search.value}%'
        or p.POType LIKE '%${PurchaseOrder.search.value}%'
        or p.RRNo LIKE '%${PurchaseOrder.search.value}%'
        or p.RequestedById = '%${PurchaseOrder.search.value}%'
        or p.ApprovedById = '%${PurchaseOrder.search.value}%'
      ) `;
  }

  var cvalue = 0;
  var DateRequested = DueDate = DateRequestedTo = DueDateTo = ''; var IsDeleted = -1;
  for (cvalue = 0; cvalue < PurchaseOrder.columns.length; cvalue++) {

    if (PurchaseOrder.columns[cvalue].search.value != "") {
      switch (PurchaseOrder.columns[cvalue].name) {
        case "DateRequested":
          DateRequested = PurchaseOrder.columns[cvalue].search.value;
          break;
        case "DateRequestedTo":
          DateRequestedTo = PurchaseOrder.columns[cvalue].search.value;
          break;
        case "DueDate":
          DueDate = PurchaseOrder.columns[cvalue].search.value;
          break;
        case "DueDateTo":
          DueDateTo = PurchaseOrder.columns[cvalue].search.value;
          break;
        case "POId":
          query += " and p.POId='" + PurchaseOrder.columns[cvalue].search.value + "' ";
          break;
        case "PONo":
          query += " and ( p.PONo='" + PurchaseOrder.columns[cvalue].search.value + "' )";
          break;
        case "Status":
          query += " and ( p.Status='" + PurchaseOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "VendorId":
          query += " and ( p.VendorId = '" + PurchaseOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "RRId":
          query += " and ( p.RRId = '" + PurchaseOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "RRNo":
          query += " and ( p.RRNo = '" + PurchaseOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "RequestedById":
          query += " and ( p.RequestedById = '" + PurchaseOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "ApprovedById":
          query += " and ( p.ApprovedById = '" + PurchaseOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "VendorName":
          query += " and ( v.VendorName LIKE '%" + PurchaseOrder.columns[cvalue].search.value + "%' ) ";
          break;
        case "IsDeleted":
          IsDeleted = PurchaseOrder.columns[cvalue].search.value;
          query += " and p.IsDeleted = '" + PurchaseOrder.columns[cvalue].search.value + "' ";
          break;
        case "LocalCurrencyCode":
          query += " and ( p.LocalCurrencyCode = '" + PurchaseOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedByLocation":
          query += " and ( p.CreatedByLocation = '" + PurchaseOrder.columns[cvalue].search.value + "' ) ";
          break;


        default:
          query += " and ( " + PurchaseOrder.columns[cvalue].name + " LIKE '%" + PurchaseOrder.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  if (IsDeleted == -1) {
    query += " and  p.IsDeleted =0 ";
  }
  if (DateRequested != '' && DateRequestedTo != '') {
    query += " and ( p.DateRequested >= '" + DateRequested + "' and p.DateRequested <= '" + DateRequestedTo + "' ) ";
  }
  else {
    if (DateRequested != '') {
      query += " and ( p.DateRequested >= '" + DateRequested + "' ) ";
    }
    if (DateRequestedTo != '') {
      query += " and ( p.DateRequested <= '" + DateRequestedTo + "' ) ";
    }
  }
  if (DueDate != '' && DueDateTo != '') {
    query += " and ( p.DueDate >= '" + DueDate + "' and p.DueDate <= '" + DueDateTo + "' ) ";
  }
  else {
    if (DueDate != '') {
      query += " and ( p.DueDate >= '" + DueDate + "' ) ";
    }
    if (DueDateTo != '') {
      query += " and ( p.DueDate <= '" + DueDateTo + "' ) ";
    }
  }

  var i = 0;
  if (PurchaseOrder.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < PurchaseOrder.order.length; i++) {
    if (PurchaseOrder.order[i].column != "" || PurchaseOrder.order[i].column == "0")// 0 is equal to ""
    {
      switch (PurchaseOrder.columns[PurchaseOrder.order[i].column].name) {

        case "POId":
          query += " p.POId  " + PurchaseOrder.order[i].dir + ",";
          break;
        case "VendorId":
          query += " p." + PurchaseOrder.columns[PurchaseOrder.order[i].column].name + " " + PurchaseOrder.order[i].dir + ",";
          break;
        case "RRId":
          query += " p.RRId " + PurchaseOrder.order[i].dir + ",";
          break;
        case "RRNo":
          query += " p.RRNo " + PurchaseOrder.order[i].dir + ",";
          break;
        case "Status":
          query += " p." + PurchaseOrder.columns[PurchaseOrder.order[i].column].name + " " + PurchaseOrder.order[i].dir + ",";
          break;


        default://could be any column except above 
          query += " " + PurchaseOrder.columns[PurchaseOrder.order[i].column].name + " " + PurchaseOrder.order[i].dir + ",";

      }
    }
  }
  // console.log("before query slice =" + query);

  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  if (PurchaseOrder.start != "-1" && PurchaseOrder.length != "-1") {
    query += " LIMIT " + PurchaseOrder.start + "," + (PurchaseOrder.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(p.POId) as TotalCount 
  FROM tbl_po p
  LEFT JOIN tbl_vendors v on p.VendorId=v.VendorId
  LEFT JOIN tbl_mro as MRO on MRO.MROId=p.MROId
  LEFT JOIN tbl_sales_order as s on s.SOId=p.SOId
  where p.IsDeleted='${IsDeleted >= 0 ? IsDeleted : 0}' `;
  if (VendorId != 0) {
    TotalCountQuery = TotalCountQuery + `and p.VendorId='${VendorId}'`;
  }
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${MultipleCustomerIds}) `;
  }
  //console.log("query = " + query);
  //console.log("Countquery = " + Countquery);

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: PurchaseOrder.draw
      });
      return;
    }
  );

};





PurchaseOrder.getVendorPortalDashboardPODue = (PurchaseOrder, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT p.RRId,
  p.POId,v.VendorName,p.VendorId ,DATE_FORMAT(p.DateRequested,'%m/%d/%Y') as DateRequested,IsEmailSent,
  PONo,ROUND(ifnull(GrandTotal,0),2) as GrandTotal,DATE_FORMAT(p.DueDate,'%m/%d/%Y') as DueDate, DATEDIFF(DueDate,CURDATE()) as DueDateDiff,p.RRNo,p.POType,p.LocalCurrencyCode,
  p.ExchangeRate,p.BaseCurrencyCode,p.BaseGrandTotal,CURL.CurrencySymbol,
  CASE p.Status 
   WHEN 1 THEN '${Constants.array_purchase_order_status[1]}'
   WHEN 2 THEN '${Constants.array_purchase_order_status[2]}'
   WHEN 3 THEN '${Constants.array_purchase_order_status[3]}'
   WHEN 4 THEN '${Constants.array_purchase_order_status[4]}'
   WHEN 5 THEN '${Constants.array_purchase_order_status[5]}'
   WHEN 6 THEN '${Constants.array_purchase_order_status[6]}'
   WHEN 7 THEN '${Constants.array_purchase_order_status[7]}'
   WHEN 8 THEN '${Constants.array_purchase_order_status[8]}'
    WHEN 9 THEN '${Constants.array_purchase_order_status[9]}'
   ELSE '-'	end StatusName,p.Status,'' as DateRequestedTo,'' as DueDateTo,p.RequestedById,p.ApprovedById,
   p.RequestedByname,p.ApprovedByName, RR.Status as RRStatus `;

  recordfilterquery = `Select count(p.POId) as recordsFiltered `;

  query = query + ` FROM tbl_po p
  LEFT JOIN tbl_vendors v on p.VendorId=v.VendorId
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = p.RRId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = p.LocalCurrencyCode AND CURL.IsDeleted = 0 
  where p.IsDeleted=0 AND (RR.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} AND RR.Status!=${Constants.CONST_RRS_COMPLETED} AND RR.Status!=${Constants.CONST_RRS_QUOTE_REJECTED} ) `;

  var VendorId = 0;
  // console.log("PurchaseOrder.VendorId=" + PurchaseOrder.VendorId)
  if (PurchaseOrder.VendorId != 0) {
    VendorId = PurchaseOrder.VendorId;
    query = query + ` and p.VendorId='${VendorId}' `;
  }

  if (PurchaseOrder.search.value != '') {
    query = query + ` and (  PONo LIKE '%${PurchaseOrder.search.value}%'
        or p.VendorId LIKE '%${PurchaseOrder.search.value}%' 
        or p.Status LIKE '%${PurchaseOrder.search.value}%' 
        or DateRequested LIKE '%${PurchaseOrder.search.value}%' 
        or DueDate LIKE '%${PurchaseOrder.search.value}%'
        or POType LIKE '%${PurchaseOrder.search.value}%'
        or p.RRNo LIKE '%${PurchaseOrder.search.value}%'
        or RequestedById = '%${PurchaseOrder.search.value}%'
        or ApprovedById = '%${PurchaseOrder.search.value}%'
      ) `;
  }

  var i = 0;
  if (PurchaseOrder.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < PurchaseOrder.order.length; i++) {
    if (PurchaseOrder.order[i].column != "" || PurchaseOrder.order[i].column == "0")// 0 is equal to ""
    {
      switch (PurchaseOrder.columns[PurchaseOrder.order[i].column].name) {

        case "VendorId":
          query += " p." + PurchaseOrder.columns[PurchaseOrder.order[i].column].name + " " + PurchaseOrder.order[i].dir + ",";
          break;

        case "Status":
          query += " p." + PurchaseOrder.columns[PurchaseOrder.order[i].column].name + " " + PurchaseOrder.order[i].dir + ",";
          break;

        case "RRNo":
          query += " p." + PurchaseOrder.columns[PurchaseOrder.order[i].column].name + " " + PurchaseOrder.order[i].dir + ",";
          break;

        default://could be any column except above 
          query += " " + PurchaseOrder.columns[PurchaseOrder.order[i].column].name + " " + PurchaseOrder.order[i].dir + ",";

      }
    }
  }


  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  if (PurchaseOrder.start != "-1" && PurchaseOrder.length != "-1") {
    query += " LIMIT " + PurchaseOrder.start + "," + (PurchaseOrder.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(p.POId) as TotalCount 
  FROM tbl_po p
  LEFT JOIN tbl_vendors v on p.VendorId=v.VendorId
    LEFT JOIN tbl_repair_request as RR ON RR.RRId = p.RRId
  where p.IsDeleted=0 AND (RR.Status!=${Constants.CONST_RRS_NOT_REPAIRABLE} AND RR.Status!=${Constants.CONST_RRS_COMPLETED} AND RR.Status!=${Constants.CONST_RRS_QUOTE_REJECTED} ) `;
  if (VendorId != 0) {
    TotalCountQuery = TotalCountQuery + ` and p.VendorId='${VendorId}'`;
  }
  //console.log("query = " + query);
  //console.log("TotalCountQuery = " + TotalCountQuery);

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: PurchaseOrder.draw
      });
      return;
    }
  );

};






PurchaseOrder.Create = (PurchaseOrder, result) => {
  var sql = `insert into tbl_po(PONo,MROId,SOId,RRId,RRNo,VendorId,VendorRefNo,POType,TermsId,DateRequested,DueDate,AdditionalPONo,ShippingAccountNumber,ShipVia,Code
        ,ShipAddressIdentityType,ShipAddressBookId,BillAddressBookId,ShippingNotes,SubTotal,TaxPercent,TotalTax,Discount,AHFees,Shipping
        ,GrandTotal,Status,Created,CreatedBy,RequestedById,RequestedByname,LeadTime,WarrantyPeriod,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal,CreatedByLocation) 
        values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [
    PurchaseOrder.PONo, PurchaseOrder.MROId, PurchaseOrder.SOId, PurchaseOrder.RRId, PurchaseOrder.RRNo, PurchaseOrder.VendorId, PurchaseOrder.VendorRefNo, PurchaseOrder.POType, PurchaseOrder.TermsId
    , PurchaseOrder.DateRequested, PurchaseOrder.DueDate, PurchaseOrder.AdditionalPONo, PurchaseOrder.ShippingAccountNumber, PurchaseOrder.ShipVia, PurchaseOrder.Code
    , PurchaseOrder.ShipAddressIdentityType, PurchaseOrder.ShipAddressBookId, PurchaseOrder.BillAddressBookId, PurchaseOrder.ShippingNotes
    , PurchaseOrder.SubTotal, PurchaseOrder.TaxPercent, PurchaseOrder.TotalTax, PurchaseOrder.Discount, PurchaseOrder.AHFees
    , PurchaseOrder.Shipping, PurchaseOrder.GrandTotal, PurchaseOrder.Status
    , PurchaseOrder.Created, PurchaseOrder.CreatedBy, PurchaseOrder.CreatedBy
    , PurchaseOrder.RequestedByname, PurchaseOrder.LeadTime, PurchaseOrder.WarrantyPeriod
    , PurchaseOrder.LocalCurrencyCode, PurchaseOrder.ExchangeRate, PurchaseOrder.BaseCurrencyCode, PurchaseOrder.BaseGrandTotal, PurchaseOrder.CreatedByLocation
  ]
  // console.log(PurchaseOrder.DueDate);
  // console.log("Po create: ", sql, values);

  con.query(sql, values, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;

  });
}



PurchaseOrder.UpdatePurchaseOrderByRRId = (PurchaseOrder, result) => {

  var sql = ``;

  sql = `UPDATE  tbl_po  SET   PONO=CONCAT('PO',${PurchaseOrder.POId})  WHERE POId = ${PurchaseOrder.POId}`;

  //console.log(sql);
  con.query(sql, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: PurchaseOrder.POId, ...PurchaseOrder });
    return;
  }
  );

};



PurchaseOrder.UpdatePurchaseAddressIdByPOId = (PurchaseOrder, result) => {

  var sql = ``;

  sql = `UPDATE  tbl_po  SET   ShipAddressBookId='${PurchaseOrder.ShipAddressBookId}',BillAddressBookId='${PurchaseOrder.BillAddressBookId}'  WHERE POId = '${PurchaseOrder.POId}'`;

  // console.log(sql);
  con.query(sql, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: PurchaseOrder.POId, ...PurchaseOrder });
    return;
  }
  );

};


PurchaseOrder.Update = (PurchaseOrder, result) => {

  var sql = ``;

  sql = `UPDATE  tbl_po  SET  RRId= ?,VendorId= ?,VendorRefNo= ?,POType= ?,TermsId= ?,DateRequested= ?,DueDate= ?,ShippingAccountNumber= ?,ShipVia= ?,Code= ?
  ,AdditionalPONo= ?,  ShippingAccountNumber=?, ShipVia=?, Code=?, ShipAddressIdentityType=?, ShipAddressBookId= ?,BillAddressBookId= ?,ShippingNotes= ?,SubTotal= ?,TaxPercent=?
  ,TotalTax= ?,Discount= ?,AHFees= ?,Shipping= ?,GrandTotal= ?,Status= ?,Modified= ?,ModifiedBy=?,LocalCurrencyCode=?,ExchangeRate=?,BaseCurrencyCode=?,BaseGrandTotal=?  WHERE POId = ?`;
  var values = [
    PurchaseOrder.RRId, PurchaseOrder.VendorId, PurchaseOrder.VendorRefNo, PurchaseOrder.POType
    , PurchaseOrder.TermsId, PurchaseOrder.DateRequested, PurchaseOrder.DueDate, PurchaseOrder.ShippingAccountNumber, PurchaseOrder.ShipVia, PurchaseOrder.Code,
    PurchaseOrder.AdditionalPONo, PurchaseOrder.ShippingAccountNumber, PurchaseOrder.ShipVia, PurchaseOrder.Code
    , PurchaseOrder.ShipAddressIdentityType, PurchaseOrder.ShipAddressBookId, PurchaseOrder.BillAddressBookId, PurchaseOrder.ShippingNotes
    , PurchaseOrder.SubTotal, PurchaseOrder.TaxPercent, PurchaseOrder.TotalTax, PurchaseOrder.Discount, PurchaseOrder.AHFees
    , PurchaseOrder.Shipping, PurchaseOrder.GrandTotal, PurchaseOrder.Status, PurchaseOrder.Modified
    , PurchaseOrder.ModifiedBy, PurchaseOrder.LocalCurrencyCode, PurchaseOrder.ExchangeRate, PurchaseOrder.BaseCurrencyCode, PurchaseOrder.BaseGrandTotal, PurchaseOrder.POId

  ]
  // console.log(sql);
  con.query(sql, values, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {

      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: PurchaseOrder.POId, ...PurchaseOrder });
  }
  );

};



PurchaseOrder.View = (POId, IdentityType, IsDeleted,reqbody, result) => {
  var sql = `SELECT 
  PO.POId,PO.PONo,PO.MROId,PO.RRId,PO.RRNo,PO.VendorId,PO.VendorRefNo,PO.POType,PO.TermsId,
DATE_FORMAT(PO.DateRequested,'%Y-%m-%d') as DateRequested,
DATE_FORMAT(PO.DueDate,'%Y-%m-%d') as DueDate,
PO.AdditionalPONo,
PO.ShippingAccountNumber,
PO.ShipVia,
PO.Code,
PO.ShipAddressIdentityType,
PO.ShipAddressBookId,
PO.BillAddressBookId,
PO.ShippingNotes,
PO.SubTotal,
PO.TaxPercent,
PO.TotalTax,
PO.Discount,
PO.AHFees,
PO.Shipping,
ROUND(ifnull(PO.GrandTotal,0),2) as GrandTotal,
PO.Status,
PO.RequestedById,
PO.RequestedByname,
PO.ApprovedById,
PO.ApprovedByName,
DATE_FORMAT(PO.ApprovedDate,'%Y-%m-%d')  as ApprovedDate,
PO.ReOpenedBy,
DATE_FORMAT(PO.ReOpenedDate,'%Y-%m-%d')  as ReOpenedDate,
DATE_FORMAT(PO.Created,'%Y-%m-%d')  as Created,IsPickUp,
PO.Modified,
PO.LeadTime,
PO.WarrantyPeriod,
PO.IsEmailSent,
PO.ReOpenedByName,  
SO.SOId,
QT.QuoteId,PO.CreatedByLocation,POC.CountryName as CreatedByLocationName,
PO.LocalCurrencyCode,PO.ExchangeRate,PO.BaseCurrencyCode,
ROUND(ifnull(PO.BaseGrandTotal,0),2) as BaseGrandTotal,
CASE i.Status WHEN '${Constants.CONST_INV_STATUS_APPROVED}' THEN 1 Else 0  END IsInvoiceApproved,
  V.VendorName,V.VendorCode, RR.RRNo,ifnull(RR.CustomerId,QT.IdentityId) as CustomerId,if(RR.CustomerId>0,C.CompanyName,if(mro.CustomerId>0,C1.CompanyName,'')) CompanyName, C.CustomerPONotes,
  CASE PO.POType 
  WHEN 0 THEN '${Constants.array_purchase_order_type[0]}'
  WHEN 1 THEN '${Constants.array_purchase_order_type[1]}'
  WHEN 2 THEN '${Constants.array_purchase_order_type[2]}'
  WHEN 3 THEN '${Constants.array_purchase_order_type[3]}'
  WHEN 4 THEN '${Constants.array_purchase_order_type[4]}'
  WHEN 5 THEN '${Constants.array_purchase_order_type[5]}'
  WHEN 6 THEN '${Constants.array_purchase_order_type[6]}'
  WHEN 7 THEN '${Constants.array_purchase_order_type[7]}'
   WHEN 8 THEN '${Constants.array_purchase_order_type[8]}'
  ELSE '-'	end POTypeName ,
     CASE PO.Status 
      WHEN 1 THEN '${Constants.array_purchase_order_status[1]}'
      WHEN 2 THEN '${Constants.array_purchase_order_status[2]}'
      WHEN 3 THEN '${Constants.array_purchase_order_status[3]}'
      WHEN 4 THEN '${Constants.array_purchase_order_status[4]}'
      WHEN 5 THEN '${Constants.array_purchase_order_status[5]}'
      WHEN 6 THEN '${Constants.array_purchase_order_status[6]}'
      WHEN 7 THEN '${Constants.array_purchase_order_status[7]}'
      WHEN 8 THEN '${Constants.array_purchase_order_status[8]}'
       WHEN 9 THEN '${Constants.array_purchase_order_status[9]}'
      ELSE '-'	end StatusName,RR.IsRushRepair,
      case RR.IsRushRepair
      WHEN 1 THEN '${Constants.array_yes_no[1]}'
      WHEN 0 THEN '${Constants.array_yes_no[0]}'
      ELSE '-'	end IsRushRepairName,
      RR.IsWarrantyRecovery,
      case RR.IsWarrantyRecovery
      WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
      WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
      ELSE '-'	end IsWarrantyRecoveryName,RR.IsRepairTag,
      case RR.IsRepairTag
      WHEN 1 THEN '${Constants.array_yes_no[1]}'
      WHEN 0 THEN '${Constants.array_yes_no[0]}'
      ELSE '-'	end IsRepairTagName,t.TermsName,sv.ShipViaName,CONCAT(u.FirstName,' ',u.LastName) as AdminName,u.PhoneNo as AdminMobile,
      RR.PartId as RepairPartId,ifnull(mro.MROId, 0) MROId,mro.MRONo,PO.IsDeleted,
      CONCAT(u1.FirstName,' ',u1.LastName) as DeletedByName,DATE_FORMAT(u1.Modified,'%Y-%m-%d') DeletedDate,ifnull(vi.VendorInvoiceId,0) VendorInvoiceId,ifnull(vi.VendorInvoiceNo,'') VendorInvoiceNo,vi.IsCSVProcessed,
      V.VendorCurrencyCode as VendorCurrencyCode,V.VendorLocation as VendorLocation,CUR.CurrencySymbol as VendorCurrencySymbol,CON.VatTaxPercentage,CURPO.CurrencySymbol
      FROM tbl_po as PO
      LEFT JOIN  tbl_sales_order as SO ON SO.SOId = PO.SOId AND SO.IsDeleted = 0
      LEFT JOIN  tbl_invoice as i ON i.SOId = SO.SOId AND i.IsDeleted = 0
      LEFT JOIN  tbl_quotes as QT ON  QT.QuoteId = SO.QuoteId AND QT.IsDeleted = 0
      LEFT JOIN  tbl_vendors as V ON V.VendorId = PO.VendorId
      LEFT JOIN  tbl_vendor_invoice as vi ON vi.POId = PO.POId
      LEFT JOIN  tbl_repair_request as RR ON RR.RRId = PO.RRId
      LEFT JOIN  tbl_terms t ON t.TermsId = PO.TermsId
      LEFT JOIN  tbl_ship_via sv ON sv.shipViaId = PO.shipVia
      LEFT JOIN  tbl_users u ON u.UserId = PO.CreatedBy
      LEFT JOIN tbl_customers as C ON C.CustomerId = RR.CustomerId
      LEFT JOIN  tbl_mro as mro ON mro.MROId = PO.MROId
      LEFT JOIN tbl_customers as C1 ON C1.CustomerId = mro.CustomerId
      LEFT JOIN  tbl_users u1 ON u1.UserId = PO.ModifiedBy
      LEFT JOIN tbl_currencies CURPO ON CURPO.CurrencyCode = PO.LocalCurrencyCode AND CURPO.IsDeleted = 0
      LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = V.VendorCurrencyCode AND CUR.IsDeleted = 0
      LEFT JOIN tbl_countries as CON  ON CON.CountryId = V.VendorLocation AND CON.IsDeleted = 0
      LEFT JOIN tbl_countries POC on POC.CountryId=PO.CreatedByLocation
      where PO.IsDeleted=${IsDeleted >= 0 ? IsDeleted : 0} and PO.POId=${POId}`;

  var TokenIdentityId = getLogInIdentityId(reqbody);
  var TokenIdentityType = getLogInIdentityType(reqbody);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqbody);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(reqbody);
      
  if (IdentityType == 2) {
    sql += ` and PO.VendorId=${TokenIdentityId}`;
  }
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and SO.CustomerId in(${MultipleCustomerIds}) `;
  }
  // console.log("SQLVI" + sql)
  return sql;
};

PurchaseOrder.ViewByMRO = (MROId, result) => {
  var sql = `SELECT 
  PO.POId,PO.PONo,PO.MROId,PO.SOId,PO.RRId,PO.RRNo,PO.VendorId,PO.VendorRefNo,PO.POType,PO.TermsId,
DATE_FORMAT(PO.DateRequested,'%Y-%m-%d') as DateRequested,
DATE_FORMAT(PO.DueDate,'%Y-%m-%d') as DueDate,
PO.AdditionalPONo,
PO.ShippingAccountNumber,
PO.ShipVia,
PO.Code,
PO.ShipAddressIdentityType,
PO.ShipAddressBookId,
PO.BillAddressBookId,
PO.ShippingNotes,
PO.SubTotal,
PO.TaxPercent,
PO.TotalTax,
PO.Discount,
PO.AHFees,
PO.Shipping,
ROUND(ifnull(PO.GrandTotal,0),2) as GrandTotal, 
PO.Status,
PO.RequestedById,
PO.RequestedByname,
PO.ApprovedById,
PO.ApprovedByName,
DATE_FORMAT(PO.ApprovedDate,'%Y-%m-%d')  as ApprovedDate,
PO.ReOpenedBy,
DATE_FORMAT(PO.ReOpenedDate,'%Y-%m-%d')  as ReOpenedDate,
DATE_FORMAT(PO.Created,'%Y-%m-%d')  as Created,
PO.Modified,
PO.LeadTime,
PO.WarrantyPeriod,
PO.IsEmailSent,
PO.ReOpenedByName,PO.LocalCurrencyCode,PO.ExchangeRate,PO.BaseCurrencyCode, 
ROUND(ifnull(PO.BaseGrandTotal,0),2) as BaseGrandTotal, 
  V.VendorName, RR.RRNo,RR.CustomerId,C.CompanyName,IsPickUp,
  CASE PO.POType 
  WHEN 0 THEN '${Constants.array_purchase_order_type[0]}'
  WHEN 1 THEN '${Constants.array_purchase_order_type[1]}'
  WHEN 2 THEN '${Constants.array_purchase_order_type[2]}'
  WHEN 3 THEN '${Constants.array_purchase_order_type[3]}'
  WHEN 4 THEN '${Constants.array_purchase_order_type[4]}'
  WHEN 5 THEN '${Constants.array_purchase_order_type[5]}'
  WHEN 6 THEN '${Constants.array_purchase_order_type[6]}'
  WHEN 7 THEN '${Constants.array_purchase_order_type[7]}'
   WHEN 8 THEN '${Constants.array_purchase_order_type[8]}'
  ELSE '-'	end POTypeName ,
     CASE PO.Status 
      WHEN 1 THEN '${Constants.array_purchase_order_status[1]}'
      WHEN 2 THEN '${Constants.array_purchase_order_status[2]}'
      WHEN 3 THEN '${Constants.array_purchase_order_status[3]}'
      WHEN 4 THEN '${Constants.array_purchase_order_status[4]}'
      WHEN 5 THEN '${Constants.array_purchase_order_status[5]}'
      WHEN 6 THEN '${Constants.array_purchase_order_status[6]}'
      WHEN 7 THEN '${Constants.array_purchase_order_status[7]}'
      WHEN 8 THEN '${Constants.array_purchase_order_status[8]}'
       WHEN 9 THEN '${Constants.array_purchase_order_status[9]}'
      ELSE '-'	end StatusName,RR.IsRushRepair,
      case RR.IsRushRepair
      WHEN 1 THEN '${Constants.array_yes_no[1]}'
      WHEN 0 THEN '${Constants.array_yes_no[0]}'
      ELSE '-'	end IsRushRepairName,
      RR.IsWarrantyRecovery,
      case RR.IsWarrantyRecovery
      WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
      WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
      ELSE '-'	end IsWarrantyRecoveryName,RR.IsRepairTag,
      case RR.IsRepairTag
      WHEN 1 THEN '${Constants.array_yes_no[1]}'
      WHEN 0 THEN '${Constants.array_yes_no[0]}'
      ELSE '-'	end IsRepairTagName,t.TermsName,sv.ShipViaName,CONCAT(u.FirstName,' ',u.LastName) as AdminName,u.PhoneNo as AdminMobile, 
      RR.PartId as RepairPartId,ifnull(mro.MROId, 0) MROId,mro.MRONo,PO.IsDeleted,
      CONCAT(u1.FirstName,' ',u1.LastName) as DeletedByName,DATE_FORMAT(u1.Modified,'%Y-%m-%d') DeletedDate,ifnull(vi.VendorInvoiceId,0) VendorInvoiceId,ifnull(vi.VendorInvoiceNo,0) VendorInvoiceNo
      FROM tbl_po as PO
      LEFT JOIN  tbl_vendors as V ON V.VendorId = PO.VendorId
      LEFT JOIN  tbl_vendor_invoice as vi ON vi.POId = PO.POId
      LEFT JOIN  tbl_repair_request as RR ON RR.RRId = PO.RRId 
      LEFT JOIN  tbl_terms t ON t.TermsId = PO.TermsId
      LEFT JOIN  tbl_ship_via sv ON sv.shipViaId = PO.shipVia
      LEFT JOIN  tbl_users u ON u.UserId = PO.CreatedBy
      LEFT JOIN tbl_customers as C ON C.CustomerId = RR.CustomerId
      LEFT JOIN  tbl_mro as mro ON mro.MROId = PO.MROId
      LEFT JOIN  tbl_users u1 ON u1.UserId = PO.ModifiedBy
      where PO.IsDeleted=0 and PO.MROId=${MROId}`;
  // console.log("SQLVI" + sql)
  return sql;
};

PurchaseOrder.findById = (reqbody, IdentityType, IsDeleted, result) => {

  var POId = reqbody.POId ? reqbody.POId : reqbody;

  IsDeleted = IsDeleted >= 0 ? IsDeleted : 0;
  var sqlPurchaseOrder = PurchaseOrder.View(POId, IdentityType, IsDeleted,reqbody);
  con.query(sqlPurchaseOrder, (err, res) => {
    if (err) return result(err, null);
    if (res.length > 0) {
      var sqlPurchaseOrderItem = PurchaseOrderItem.View(POId);
      var sqlGlobalCustomerReference = GlobalCustomerReference.view(Constants.CONST_IDENTITY_TYPE_PO, POId);
      var billingAddressQuery = Address.View(res[0].BillAddressBookId);
      var shippingAddressQuery = Address.View(res[0].ShipAddressBookId);
      var sqlNotes = Notes.ViewNotes(Constants.CONST_IDENTITY_TYPE_PO, POId);
      var sqlAttachment = AttachmentModel.ListAttachmentQuery(Constants.CONST_IDENTITY_TYPE_PO, POId);
      var sqlVendorAddress = Address.ViewContactAddressByVendorId(res[0].VendorId);
      // var sqlRemitAddress = Address.GetRemitToAddressIdByVendorId(res[0].VendorId);
      if (res[0].RRId > 0) {
        var sqlRemitAddress = Address.GetRemitToAddressIdByRRId(res[0].RRId);
      } else if (res[0].MROId > 0) {
        var sqlRemitAddress = Address.GetRemitToAddressIdByMROId(res[0].MROId);
      } else {
        var sqlRemitAddress = Address.GetRemitToAddressIdByPOId(POId);
      }

      var sqlRRVendors = RRVendors.GetRRVendorsShipLockInfoById(res[0].RRId);
      var sqlCustomerShipLocked = RRVendors.GetRRCustomerShipLockInfoById(res[0].RRId);

      var shipAddressListQuery = Address.GetAddressByPOIdQuery(POId)
      var sqlRRNotes = '';
      if (res[0]["RRId"] > 0)
        sqlRRNotes = Notes.ViewRRVendorNotes(Constants.CONST_IDENTITY_TYPE_RR, res[0].RRId);
      else if (res[0]["MROId"] > 0)
        sqlRRNotes = Notes.ViewRRVendorNotes(Constants.CONST_IDENTITY_TYPE_MRO, res[0].MROId);
      else
        sqlRRNotes = "Select '-' NoRecord";
      //  var sqlRRNotes = Notes.ViewRRVendorNotes(Constants.CONST_IDENTITY_TYPE_RR, res[0].RRId);
      async.parallel([
        function (result) { con.query(sqlPurchaseOrderItem, result) },
        function (result) { con.query(sqlGlobalCustomerReference, result) },
        function (result) { con.query(billingAddressQuery, result) },
        function (result) { con.query(shippingAddressQuery, result) },
        function (result) { con.query(sqlNotes, result) },
        function (result) { con.query(sqlAttachment, result) },
        function (result) { con.query(sqlVendorAddress, result) },
        function (result) { con.query(sqlRRNotes, result) },
        function (result) { con.query(sqlRemitAddress, result) },
        function (result) { con.query(sqlRRVendors, result) },
        function (result) { con.query(shipAddressListQuery, result) },
        function (result) { con.query(sqlCustomerShipLocked, result) },


      ],

        function (err, results) {
          if (err)
            return result(err, null);

          res[0].VendorShipIdLocked = results[9][0][0] && results[9][0][0].VendorShipIdLocked ? results[9][0][0].VendorShipIdLocked : 0;
          res[0].CustomerShipIdLocked = results[11][0][0] && results[11][0][0].CustomerShipIdLocked ? results[11][0][0].CustomerShipIdLocked : 0;
          result(null, {

            POInfo: res[0], POItem: results[0][0], CustomerRef: results[1][0], BillingAddress: results[2][0],
            ShippingAddress: results[3][0], NotesList: results[4][0], AttachmentList: results[5][0], ContactAddress: results[6][0],
            RRNotesList: results[7][0], RemitAddress: results[8][0], ShipAddressList: results[10][0]
          });
          return;
        }
      );
    } else {
      result({ msg: "Purchase Order not found" }, null);
      return;
    }
  }
  );

};




PurchaseOrder.POListForVendorBills = (PONO, result) => {
  var sql = `SELECT PI.*, P.PONo, CUR.CurrencySymbol as ItemLocalCurrencySymbol
            FROM tbl_po as P  
            JOIN tbl_po_item as PI ON PI.POId = P.POId AND PI.IsDeleted=0
            LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = PI.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
            WHERE P.IsDeleted=0 AND  PI.IsDeleted = 0 
            AND PI.IsAddedToVendorBill = 0 AND P.PONo ='${PONO} '  AND P.Status=${Constants.CONST_PO_STATUS_APPROVED} `;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}



PurchaseOrder.ValidateAlreadyExistRRId = (RRId, result) => {
  con.query(`SELECT POId,RRId,VendorId FROM tbl_po where IsDeleted=0 and  Status!=${Constants.CONST_PO_STATUS_CANCELLED} and  RRId=${RRId} `, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    // console.log("RrId Loaded :", res);
    result(null, res);
  });
}



PurchaseOrder.GetPOItemByPOId = (POId, result) => {
  con.query(`SELECT POId,POItemId,SOItemId FROM tbl_po_item where IsDeleted=0 and  POId=${POId} `, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    // console.log("RrId Loaded :", res);
    result(null, res);
  });
}



PurchaseOrder.VendorPOListByServerSide = (PurchaseOrder, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT POId,PONo,DATE_FORMAT(DateRequested,'%m/%d/%Y') as DateRequested,
  DATE_FORMAT(DueDate,'%m/%d/%Y') as DueDate,  
  ROUND(ifnull(GrandTotal,0),2) as GrandTotal, 
  u.UserName,CASE p.Status 
  WHEN 1 THEN '${Constants.array_purchase_order_status[1]}'
  WHEN 2 THEN '${Constants.array_purchase_order_status[2]}'
  WHEN 3 THEN '${Constants.array_purchase_order_status[3]}'
  WHEN 4 THEN '${Constants.array_purchase_order_status[4]}'
  WHEN 5 THEN '${Constants.array_purchase_order_status[5]}'
  WHEN 6 THEN '${Constants.array_purchase_order_status[6]}'
  WHEN 7 THEN '${Constants.array_purchase_order_status[7]}'
  WHEN 8 THEN '${Constants.array_purchase_order_status[8]}'
   WHEN 9 THEN '${Constants.array_purchase_order_status[9]}'
  ELSE '-'	end StatusName `;

  recordfilterquery = `Select count(p.POId) as recordsFiltered `;

  query = query + ` FROM tbl_po p
  LEFT JOIN tbl_users u on p.CreatedBy=u.UserId 

  WHERE p.IsDeleted=0 and u.IsDeleted=0 `;

  var VendorId;
  if (PurchaseOrder.VendorId != 0) {
    VendorId = PurchaseOrder.VendorId;
  }
  else {    
    VendorId = getLogInIdentityId(PurchaseOrder);
  }
  query = query + `and p.VendorId='${VendorId}'`;

  if (PurchaseOrder.search.value != '') {
    query = query + ` and (  POId LIKE '%${PurchaseOrder.search.value}%'
        or PONo LIKE '%${PurchaseOrder.search.value}%' 
        or DateRequested LIKE '%${PurchaseOrder.search.value}%' 
        or DueDate LIKE '%${PurchaseOrder.search.value}%' 
        or GrandTotal LIKE '%${PurchaseOrder.search.value}%'
        or u.UserName LIKE '%${PurchaseOrder.search.value}%'
        or p.Status LIKE '%${PurchaseOrder.search.value}'
      ) `;
  }

  var Countquery = recordfilterquery + query;

  if (PurchaseOrder.start != "-1" && PurchaseOrder.length != "-1") {
    query += " LIMIT " + PurchaseOrder.start + "," + (PurchaseOrder.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(p.POId) as TotalCount 
  FROM tbl_po p
  LEFT JOIN tbl_users u on p.CreatedBy=u.UserId 
  WHERE p.IsDeleted=0 and u.IsDeleted=0 and p.VendorId='${VendorId}' `;

  //console.log("query = " + query);
  //console.log("Countquery = " + Countquery);

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      //console.log("TotalCount : " + results[2][0][0].TotalCount)
      if (results[0][0].length > 0) {
        result(null, {
          data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
          recordsTotal: results[2][0][0].TotalCount, draw: PurchaseOrder.draw
        });
        return;
      }
      else {
        result(null, "No record");
        return;
      }
    }
  );

};

PurchaseOrder.UpdatePurchaseOrderDueAutoUpdate = (POId, LeadTime, result) => {
  var sql = `Update tbl_po  SET DueDate = DATE_ADD(CURDATE(), INTERVAL ${LeadTime} +
  (SELECT 
    COUNT(*) AS total
    FROM 
    (   SELECT ADDDATE(CURDATE(), INTERVAL @i:=@i+1 DAY) AS DAY
        FROM (
            SELECT a.a
            FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
            CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
            CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
        ) a
        JOIN (SELECT @i := -1) r1
        WHERE 
        @i < DATEDIFF(DATE_ADD(CURDATE(), INTERVAL ${LeadTime} DAY), CURDATE())
    
    ) AS dateTable
    WHERE WEEKDAY(dateTable.Day) IN (5,6))
   DAY) WHERE IsDeleted=0 and POId='${POId}'`;
  return sql;
};


PurchaseOrder.UpdatePODueDatebyPONo = (objPurchaseOrder, result) => {
  var sql = `Update tbl_po  SET DueDate='${objPurchaseOrder.VendorPODueDate}' WHERE IsDeleted=0 and PONo='${objPurchaseOrder.CustomerPONo}'`;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, { CustomerPONo: objPurchaseOrder.PONo });
    return;
  }
  );
};


// To delete Purchase Order
PurchaseOrder.remove = (id, result) => {
  var sql = `Update tbl_po set IsDeleted=1,Modified='${cDateTime.getDateTime()}',ModifiedBy = '${global.authuser.UserId}' WHERE POId = ? `
  con.query(sql, id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "Purchase Order not deleted" }, null);
      return;
    }
    result(null, res);
  });
};
PurchaseOrder.DeletePurchaseOrderQuery = (RRId) => {
  var Obj = new PurchaseOrder({ RRId: RRId });
  var sql = `UPDATE tbl_po SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE IsDeleted = 0 AND RRId>0 AND RRId=${Obj.RRId}`;
  // console.log(sql);
  return sql;
}
//To Get Email Content For PO
PurchaseOrder.GetEmailContentForPO = (PO, result) => {

  var sql = `SELECT p.POId as IdentityId,'${Constants.CONST_IDENTITY_TYPE_PO}' as IdentityType,
  REPLACE(T.Subject,'{PONo}',p.PONo)as Subject,
  REPLACE(T.Content,'{PONo}',p.PONo)as Content,p.PONo,v.VendorEmail , GS.AppEmail,GS.AppCCEmail
  from tbl_po p
  LEFT JOIN tbl_vendors v on v.VendorId=p.VendorId
  LEFT JOIN tbl_email_template T on T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_PURCHASE_ORDER}'
   LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
  where p.POId=${PO.IdentityId}`;
  // console.log("val " + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      var FollowUpObj = {
        FromEmail: res[0].AppEmail,// Constants.CONST_AH_FROM_EMAIL_ID,
        ToEmail: res[0].VendorEmail,
        CC: res[0].AppCCEmail,//Constants.CONST_AH_CC_EMAIL_ID,
        Subject: res[0].Subject,
        Message: res[0].Content,
        IdentityId: res[0].IdentityId,
        IdentityType: res[0].IdentityType,
      };
      result(null, FollowUpObj);
      return;
    }

    result({ msg: "PO not found" }, null);
  });

}

//To Send PO Email By PO List
PurchaseOrder.SendPOEmailByPOList = (POList, result) => {
  for (let val of POList) {
    var sql = `SELECT REPLACE(T.Subject,'{PONo}',p.PONo) as Subject,
  REPLACE(T.Content,'{PONo}',p.PONo)as Content,p.PONo,v.VendorEmail 
  from tbl_po p
  LEFT JOIN tbl_po_item pi on pi.POId=p.POId AND pi.IsDeleted=0
  LEFT JOIN tbl_vendors v on v.VendorId=p.VendorId
  LEFT JOIN tbl_email_template T on T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_PURCHASE_ORDER}' 
  where p.IsDeleted=0 and p.POId=${val.POId}`;

    // console.log("val " + sql);
    con.query(sql, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      // console.log("Len :" + res);
      if (res.length > 0 && res[0].VendorEmail != "" && res[0].VendorEmail != null) {
        let HelperOptions = {
          from: Constants.CONST_AH_FROM_EMAIL_ID,
          to: res[0].VendorEmail,
          subject: res[0].Subject,
          text: res[0].Content
        };

        gmailTransport.sendMail(HelperOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          if (!error) {
            var sql = PurchaseOrder.UpdateIsEmailSent(val.POId);
            // console.log("sql=" + sql)
            con.query(sql, (err, res) => {
              if (err) {
                return result(err, null);
              }
            });

          }
          //console.log(info);
        });
      }
    });
  }
  result(null, POList);
  return;
};

//To Update IsEmailSent
PurchaseOrder.UpdateIsEmailSent = (POId) => {
  var sql = ``;
  sql = `Update tbl_po SET IsEmailSent='1' WHERE IsDeleted=0 and POId='${POId}'`;
  return sql;
}
//To Update PO By POId After POItem Delete
PurchaseOrder.UpdatePOByPOIdAfterPOItemDelete = (ObjModel, result) => {

  var Obj = new PurchaseOrder(ObjModel);
  var sql = `Update  tbl_po set SubTotal=?, GrandTotal=?,BaseGrandTotal=?,Modified=?,ModifiedBy=? where POId=? `;
  var values = [Obj.SubTotal, Obj.GrandTotal, Obj.BaseGrandTotal, Obj.Modified, Obj.ModifiedBy, Obj.POId];
  //console.log(values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });

};
//
PurchaseOrder.UpdateTaxPercent = (Taxpercent, POId, result) => {
  var sql = ` UPDATE tbl_po SET TaxPercent='${Taxpercent}' WHERE POId=${POId} `;
  // console.log("sql=" + sql)
  return sql;
}
//Global Search
PurchaseOrder.findInColumns = (searchQuery, result) => {

  const { from, size, query } = searchQuery;


  let { IdentityType, MultipleAccessIdentityIds, IsRestrictedCustomerAccess, MultipleCustomerIds } = global.authuser;
  if (IdentityType == "1") {
    return result(null, []);
  }
  var sql = `SELECT 'ahoms-purchase-order' as _index,
  P.POId as poid, P.PONo as pono
  FROM tbl_po as P
  Left Join tbl_sales_order SO on SO.SOId=P.SOId
  where
  (
	  P.PONo like '%${query.multi_match.query}%' or
    P.RRNo like '%${query.multi_match.query}%' or
    P.ShippingAccountNumber like '%${query.multi_match.query}%' or
    P.ShipVia like '%${query.multi_match.query}%'
  ) and P.IsDeleted=0
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND SO.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size}`;

  var countSql = `SELECT count(*) AS totalCount 
  FROM tbl_po as P
  Left Join tbl_sales_order SO on SO.SOId=P.SOId
  where
  (
	  P.PONo like '%${query.multi_match.query}%' or
    P.RRNo like '%${query.multi_match.query}%' or
    P.ShippingAccountNumber like '%${query.multi_match.query}%' or
    P.ShipVia like '%${query.multi_match.query}%'
  ) and P.IsDeleted=0
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND SO.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  `


  //console.log("" + sql)
  //console.log("" + countSql)
  con.query(countSql, (err, res) => {
    if (err) {
      return result(err, null);
    } else if (res[0].totalCount > 0) {
      let totalCount = res[0].totalCount;
      con.query(sql, (err, res) => {
        if (err) {
          return result(err, null);
        }
        return result(null, { totalCount: { "_index": "ahoms-purchase-order", val: totalCount }, data: res });
      });
    } else {
      return result(null, []);
    }

  });
}
PurchaseOrder.IsExistPOByRRId = (RRId, result) => {
  var sql = `Select POId,'-' as EmptyVal from tbl_po where IsDeleted=0 and RRId='${RRId}'`;
  // console.log("IsExistVendorRefNoForPO=" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
};
PurchaseOrder.IsExistPOBySO = (Idlist, result) => {
  var sql = `Select SOItemId,'R' as RE  from tbl_po_item pi
  WHERE IsDeleted=0 and SOItemId In(${Idlist})  `;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};
PurchaseOrder.UpdateVendorRefNoByPOId = (Obj, result) => {

  var sql = `Update tbl_po set VendorRefNo=?,Modified=?,ModifiedBy=? where POId=? `;
  var values = [Obj.VendorRefNo, Obj.Modified, Obj.ModifiedBy, Obj.POId];
  //console.log("values= " + values)
  con.query(sql, values, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
PurchaseOrder.POListWithOutPartId = (RR, result) => {
  var AdminAccessOnCustomer = ``;

    var TokenIdentityType = getLogInIdentityType(RR);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(RR);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(RR);

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    AdminAccessOnCustomer += ` and s.CustomerId In(${MultipleCustomerIds}) `;
  }
  var sql = ` Select p.RRId,p.RRNo,p.POId,PONo from
tbl_po p
Left join tbl_sales_order s on s.SOId=p.SOId and s.IsDeleted=0
where p.IsDeleted=0  ${AdminAccessOnCustomer}
 and p.RRId>0 and p.POId In (Select POId from
tbl_po p
Left join tbl_po_item pi Using(POId)
where pi.PartId=0) `;

  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null)
    }
    return result(null, res);
  });
};
PurchaseOrder.GetMissingPartId = (RRId, result) => {
  var sql = ` Select qi.PartId,q.QuoteId,q.RRId,q.Status,q.QuoteCustomerStatus
from tbl_quotes q
Left Join tbl_quotes_item qi on q.QuoteId=qi.QuoteId
where q.IsDeleted=0 and q.RRId=${RRId} and q.Status=1 and q.QuoteCustomerStatus=2; `;
  // console.log(sql)
  con.query(sql, (err, data) => {
    if (err) {
      return result(err, null)
    }
    if (data.length > 0)
      return result(null, data)
    else
      return result(null, { msg: "No record " })

  });
};
PurchaseOrder.GetPOItemId = (RRId, result) => {
  var sql = ` Select POItemId from tbl_po_item pi
  Left join tbl_po p Using(POId) where pi.IsDeleted=0 and RRId=${RRId} ; `;
  //console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null)
    }
    if (res.length < 0)
      return result(null, { msg: "No record " })
    else
      return result(null, res)
  });
};
PurchaseOrder.UpdateMissingPartId = (array, result) => {

  for (let obj of array) {
    var sql = ` Update tbl_po_item set PartId=${obj.PartId} where IsDeleted=0 and POItemId=${obj.POItemId}; `;
    // console.log(sql)
    con.query(sql, (err, res) => {
      if (err) {
        return result(err, null)
      }
      if (res.affectedRows == 0)
        return result(null, { msg: "Not found " })
    });
  }
  return result(null, array)
};











//Below are for MRO :
PurchaseOrder.VendorBillDetails = (MROId, result) => {
  var sql = `Select  VendorInvoiceId,Quantity,SOItemId,VendorInvoiceNo,sh.POId,sh.POItemId,sh.SOId
  from tbl_mro_shipping_history sh
  Left Join tbl_vendor_invoice vi on sh.MROShippingHistoryId=vi.MROShippingHistoryId
  where sh.IsDeleted=0 and ShipToId=5 and sh.MROId=${MROId}  order by sh.MROShippingHistoryId asc `
  return sql;
}
PurchaseOrder.ValidateAlreadyExistMROId = (MROId, result) => {
  con.query(`SELECT POId,MROId,VendorId FROM tbl_po where IsDeleted=0 and  Status!=${Constants.CONST_PO_STATUS_CANCELLED} and  MROId=${MROId} `, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
}
PurchaseOrder.ViewByMROId = (POId, IdentityType, result) => {
  var sql = `SELECT PO.*, V.VendorName,mro.CustomerId,C.CompanyName,IsPickUp,
  CASE PO.POType 
  WHEN 0 THEN '${Constants.array_purchase_order_type[0]}'
  WHEN 1 THEN '${Constants.array_purchase_order_type[1]}'
  WHEN 2 THEN '${Constants.array_purchase_order_type[2]}'
  WHEN 3 THEN '${Constants.array_purchase_order_type[3]}'
  WHEN 4 THEN '${Constants.array_purchase_order_type[4]}'
  WHEN 5 THEN '${Constants.array_purchase_order_type[5]}'
  WHEN 6 THEN '${Constants.array_purchase_order_type[6]}'
  WHEN 7 THEN '${Constants.array_purchase_order_type[7]}'
   WHEN 8 THEN '${Constants.array_purchase_order_type[8]}'
  ELSE '-'	end POTypeName ,
     CASE PO.Status 
      WHEN 1 THEN '${Constants.array_purchase_order_status[1]}'
      WHEN 2 THEN '${Constants.array_purchase_order_status[2]}'
      WHEN 3 THEN '${Constants.array_purchase_order_status[3]}'
      WHEN 4 THEN '${Constants.array_purchase_order_status[4]}'
      WHEN 5 THEN '${Constants.array_purchase_order_status[5]}'
      WHEN 6 THEN '${Constants.array_purchase_order_status[6]}'
      WHEN 7 THEN '${Constants.array_purchase_order_status[7]}'
      WHEN 8 THEN '${Constants.array_purchase_order_status[8]}'
       WHEN 9 THEN '${Constants.array_purchase_order_status[9]}'
      ELSE '-'	end StatusName,t.TermsName,sv.ShipViaName,CONCAT(u.FirstName,' ',u.LastName) as AdminName,u.PhoneNo as AdminMobile
      FROM tbl_po as PO
      LEFT JOIN  tbl_vendors as V ON V.VendorId = PO.VendorId
      LEFT JOIN  tbl_mro as mro ON mro.MROId = PO.MROId
      LEFT JOIN  tbl_terms t ON t.TermsId = PO.TermsId
      LEFT JOIN  tbl_ship_via sv ON sv.shipViaId = PO.shipVia
      LEFT JOIN  tbl_users u ON u.UserId = PO.CreatedBy
      LEFT JOIN tbl_customers as C ON C.CustomerId = mro.CustomerId
      where PO.IsDeleted=0 and POId=${POId}`;
  if (IdentityType == 2) {
    sql += ` and PO.VendorId=${global.authuser.IdentityId}`;
  }
  //console.log("SQLPO" + sql)
  return sql;
};
PurchaseOrder.DeleteMROPurchaseOrderQuery = (MROId) => {
  var Obj = new PurchaseOrder({ MROId: MROId });
  var sql = `UPDATE tbl_po SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE MROId=${Obj.MROId}`;
  return sql;
}

PurchaseOrder.IsEligibleCreatePO = (MROId, SOId, SOItemIds, result) => {
  var sql = `Select (Select ifnull(SUM(si.Quantity),0) as Quantity 
  From tbl_sales_order s
  Join tbl_sales_order_item si on si.SOId=s.SOId and si.IsDeleted=0
  where s.IsDeleted=0 and MROId='${MROId}' and s.SOId='${SOId}' and si.SOItemId In(${SOItemIds}))-
  (Select ifnull(SUM(pi.Quantity),0) as Quantity 
  From tbl_po p
  Join tbl_po_item pi on pi.POId=p.POId and pi.IsDeleted=0
  where p.IsDeleted=0 and MROId='${MROId}' and pi.SOId='${SOId}' and pi.SOItemId In(${SOItemIds})) MaxQuantity  `;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

PurchaseOrder.ViewPONoBySOId = (SOId, result) => {
  var sql = `SELECT PO.POId,PO.PONo
      FROM tbl_po as PO 
      where PO.IsDeleted=0 and PO.SOId=${SOId}`;
  // console.log("SQLVI" + sql)
  return sql;
};

module.exports = PurchaseOrder;

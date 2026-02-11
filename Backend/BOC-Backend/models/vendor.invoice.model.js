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
const VendorInvoiceItemModel = require("./vendor.invoice.item.model.js");
const AddressBookModel = require("./customeraddress.model.js");
const Notes = require("../models/repair.request.notes.model.js");
const VendorInvoiceModel = function (objVI) {
  this.VendorInvoiceId = objVI.VendorInvoiceId ? objVI.VendorInvoiceId : 0;
  this.VendorInvoiceNo = objVI.VendorInvoiceNo ? objVI.VendorInvoiceNo : '';
  this.VendorInvoiceType = objVI.VendorInvoiceType ? objVI.VendorInvoiceType : 0;
  this.InvoiceDate = objVI.InvoiceDate ? objVI.InvoiceDate : null;
  this.DueDate = objVI.DueDate ? objVI.DueDate : null;
  this.VendorId = objVI.VendorId ? objVI.VendorId : 0;
  this.VendorName = objVI.VendorName ? objVI.VendorName : '';
  this.CustomerId = objVI.CustomerId ? objVI.CustomerId : 0;
  this.CustomerInvoiceNo = objVI.CustomerInvoiceNo ? objVI.CustomerInvoiceNo : '';
  this.CustomerInvoiceId = objVI.CustomerInvoiceId ? objVI.CustomerInvoiceId : 0;
  this.CompanyName = objVI.CompanyName ? objVI.CompanyName : '';
  this.CustomerInvoiceAmount = objVI.CustomerInvoiceAmount ? objVI.CustomerInvoiceAmount : 0;
  this.ReferenceNo = objVI.ReferenceNo ? objVI.ReferenceNo : '';
  this.VendorInvNo = objVI.VendorInvNo ? objVI.VendorInvNo : '';
  this.TermsId = objVI.TermsId ? objVI.TermsId : 0;
  this.RRId = objVI.RRId ? objVI.RRId : 0;
  this.RRNo = objVI.RRNo ? objVI.RRNo : '';
  this.POId = objVI.POId ? objVI.POId : 0;
  this.PONo = objVI.PONo ? objVI.PONo : '';
  this.SubTotal = objVI.SubTotal ? objVI.SubTotal : 0;
  this.TaxPercent = objVI.TaxPercent ? objVI.TaxPercent : 0;
  this.TotalTax = objVI.TotalTax ? objVI.TotalTax : 0;
  this.Discount = objVI.Discount ? objVI.Discount : 0;
  this.AHFees = objVI.AHFees ? objVI.AHFees : 0;
  this.Shipping = objVI.Shipping ? objVI.Shipping : 0;
  this.AdvanceAmount = objVI.AdvanceAmount ? objVI.AdvanceAmount : 0;
  this.GrandTotal = objVI.GrandTotal ? objVI.GrandTotal : 0;
  this.Status = objVI.Status ? objVI.Status : 0;
  this.MROId = objVI.MROId ? objVI.MROId : 0;

  const TokenUserName = global.authuser.FullName ? global.authuser.FullName : '';
  this.RequestedByname = (objVI.authuser && objVI.authuser.FullName) ? objVI.authuser.FullName : TokenUserName;


  this.Created = objVI.Created ? objVI.Created + " 10:00:00" : cDateTime.getDateTime();
  this.Modified = objVI.Modified ? objVI.Modified + " 10:00:00" : cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objVI.authuser && objVI.authuser.UserId) ? objVI.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objVI.authuser && objVI.authuser.UserId) ? objVI.authuser.UserId : TokenUserId;
  this.IsCSVProcessed = objVI.IsCSVProcessed ? objVI.IsCSVProcessed : 0;
  this.MROShippingHistoryId = objVI.MROShippingHistoryId ? objVI.MROShippingHistoryId : 0;
  this.CustomerInvoiceCreated = objVI.CustomerInvoiceCreated ? objVI.CustomerInvoiceCreated : '';

  const TokenCreatedByLocation = global.authuser.Location ? global.authuser.Location : '';
  this.CreatedByLocation = (objVI.authuser && objVI.authuser.Location) ? objVI.authuser.Location : TokenCreatedByLocation;

  this.authuser = objVI.authuser ? objVI.authuser : {};

  // Multi currency
  this.LocalCurrencyCode = objVI.LocalCurrencyCode ? objVI.LocalCurrencyCode : '';
  this.ExchangeRate = objVI.ExchangeRate ? objVI.ExchangeRate : 0;
  this.BaseCurrencyCode = objVI.BaseCurrencyCode ? objVI.BaseCurrencyCode : '';
  this.BaseGrandTotal = objVI.BaseGrandTotal ? objVI.BaseGrandTotal : 0;
  // For Server Side Search 
  this.start = objVI.start;
  this.length = objVI.length;
  this.search = objVI.search;
  this.sortCol = objVI.sortCol;
  this.sortDir = objVI.sortDir;
  this.sortColName = objVI.sortColName;
  this.order = objVI.order;
  this.columns = objVI.columns;
  this.draw = objVI.draw;
}
VendorInvoiceModel.UpdateNonRRAndNonMROVI = (VInvoice, result) => {

  var sql = ``;

  sql = `UPDATE tbl_vendor_invoice SET SubTotal = ?,TaxPercent=?, TotalTax = ?,Discount=?,
AHFees=?,Shipping=?,AdvanceAmount=?,GrandTotal=?,Modified=?,ModifiedBy=? WHERE VendorInvoiceId = ? `;

  var values = [
    VInvoice.SubTotal, VInvoice.TaxPercent, VInvoice.TotalTax, VInvoice.Discount,
    VInvoice.AHFees, VInvoice.Shipping, VInvoice.AdvanceAmount, VInvoice.GrandTotal,
    VInvoice.Modified, VInvoice.ModifiedBy, VInvoice.VendorInvoiceId
  ]
  //console.log("Update tbl_Vinvoice=" + values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: VInvoice.VendorInvoiceId, ...VInvoice });
    return;
  });
};

VendorInvoiceModel.GetVendorBillDetail = (POId, result) => {
  var sql = `Select * from tbl_vendor_invoice v 
  Left Join tbl_vendor_invoice_item vi on v.POId=vi.POId 
  where v.IsDeleted=0 and vi.IsDeleted=0 and v.POId=${POId} `;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

//To Create the VendorInvoice
VendorInvoiceModel.Create = (obj, result) => {

  var sql = `insert into tbl_vendor_invoice(VendorInvoiceNo,VendorInvoiceType,InvoiceDate,DueDate,
    VendorId,VendorName,CustomerId,CustomerInvoiceId,CustomerInvoiceNo,CompanyName,
    CustomerInvoiceAmount,ReferenceNo,VendorInvNo,TermsId,RRId,RRNo,POId,PONo,SubTotal,TaxPercent,TotalTax,Discount,
    AHFees,Shipping,AdvanceAmount,
    GrandTotal,Status,MROId,RequestedById,RequestedByname,Created,CreatedBy,MROShippingHistoryId,IsCSVProcessed,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal,CreatedByLocation)
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [
    obj.VendorInvoiceNo, obj.VendorInvoiceType, obj.InvoiceDate, obj.DueDate, obj.VendorId,
    obj.VendorName, obj.CustomerId, obj.CustomerInvoiceId, obj.CustomerInvoiceNo,
    obj.CompanyName, obj.CustomerInvoiceAmount, obj.ReferenceNo, obj.VendorInvNo, obj.TermsId,
    obj.RRId, obj.RRNo, obj.POId, obj.PONo, obj.SubTotal, obj.TaxPercent,
    obj.TotalTax, obj.Discount, obj.AHFees,
    obj.Shipping, obj.AdvanceAmount, obj.GrandTotal, obj.Status, obj.MROId,
    obj.CreatedBy, obj.RequestedByname, obj.Created,
    obj.CreatedBy, obj.MROShippingHistoryId, obj.IsCSVProcessed,
    obj.LocalCurrencyCode, obj.ExchangeRate, obj.BaseCurrencyCode, obj.BaseGrandTotal, obj.CreatedByLocation
  ]
  //console.log("VI create: ", sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;

  });
}


//To Update VendorInvoiceNo
VendorInvoiceModel.UpdateVendorInvoiceNoById = (VendorInvoiceId) => {
  var sql = `UPDATE tbl_vendor_invoice SET
    VendorInvoiceNo=CONCAT('VI','${VendorInvoiceId}') 
    WHERE VendorInvoiceId='${VendorInvoiceId}'`;
  return sql;
};

//To Update VendorInvoice
VendorInvoiceModel.update = (obj, result) => {
  var sql = ``;

  sql = `UPDATE tbl_vendor_invoice SET   VendorInvoiceType = ?,InvoiceDate = ? ,DueDate = ?,
  VendorId = ?,VendorName = ?,CustomerId = ?,CompanyName = ?,CustomerInvoiceAmount = ?,ReferenceNo = ?,VendorInvNo=?,
  TermsId = ?,   SubTotal=?,TaxPercent = ?, TotalTax=?,Discount=?,
  AHFees=?,Shipping=?,AdvanceAmount=?,
  GrandTotal=?,Status=?,Modified=?,ModifiedBy=?,
  LocalCurrencyCode=?,ExchangeRate=?,BaseCurrencyCode=?,BaseGrandTotal=?
  WHERE VendorInvoiceId = ?`;

  var values = [
    obj.VendorInvoiceType, obj.InvoiceDate,
    obj.DueDate, obj.VendorId,
    obj.VendorName, obj.CustomerId, obj.CompanyName, obj.CustomerInvoiceAmount,
    obj.ReferenceNo, obj.VendorInvNo,
    obj.TermsId,
    obj.SubTotal, obj.TaxPercent, obj.TotalTax, obj.Discount,
    obj.AHFees, obj.Shipping, obj.AdvanceAmount,
    obj.GrandTotal, obj.Status,
    obj.Modified, obj.ModifiedBy, obj.LocalCurrencyCode, obj.ExchangeRate, obj.BaseCurrencyCode, obj.BaseGrandTotal, obj.VendorInvoiceId
  ]
  // console.log("VI =" + values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: obj.VendorInvoiceId, ...obj });
    return;
  }
  );

};

//To get view sql of VendorInvoice
VendorInvoiceModel.view = (VendorInvoiceId, IdentityType, IsDeleted) => {
  var sql = `Select vi.*,t.TermsId, t.TermsName,t.TermsDays,t.TermsType,t.IsDefaultTerm,  DATE_FORMAT(vi.InvoiceDate,'%m/%d/%Y') as InvoiceDate,
  DATE_FORMAT(vi.DueDate,'%m/%d/%Y') as DueDate,vi.CreatedByLocation,vic.CountryName as CreatedByLocationName,
  DATE_FORMAT(vi.ApprovedDate,'%m/%d/%Y') as ApprovedDate,
  CASE vi.Status
  WHEN 0 THEN '${Constants.array_vendor_invoice_status[0]}'
  WHEN 1 THEN '${Constants.array_vendor_invoice_status[1]}'
  WHEN 2 THEN '${Constants.array_vendor_invoice_status[2]}'
  WHEN 3 THEN '${Constants.array_vendor_invoice_status[3]}'
  WHEN 4 THEN '${Constants.array_vendor_invoice_status[4]}'
  WHEN 5 THEN '${Constants.array_vendor_invoice_status[5]}'
  ELSE '-'	end StatusName,CASE VendorInvoiceType
  WHEN 0 THEN '${Constants.array_vendor_invoice_type[0]}'
  WHEN 2 THEN '${Constants.array_vendor_invoice_type[2]}'
  WHEN 3 THEN '${Constants.array_vendor_invoice_type[3]}'
  ELSE '-'	end VendorInvoiceTypeName,t.TermsName,V.VendorCode,mro.MRONo,Ifnull(mro.MROId,0) as MROId,
  CASE i.Status WHEN '${Constants.CONST_INV_STATUS_APPROVED}' THEN 1 Else 0  END IsInvoiceApproved,
  CASE mroi.Status WHEN '${Constants.CONST_INV_STATUS_APPROVED}' THEN 1 Else 0  END IsMROInvoiceApproved,vi.IsDeleted,
  CONCAT(u1.FirstName,' ',u1.LastName) as DeletedByName,DATE_FORMAT(u1.Modified,'%Y-%m-%d') DeletedDate,
  vi.LocalCurrencyCode,vi.ExchangeRate,vi.BaseCurrencyCode,ROUND(ifnull(vi.BaseGrandTotal,0),2) as BaseGrandTotal,ROUND(ifnull(vi.GrandTotal,0),2) as GrandTotal,
  V.VendorCurrencyCode as VendorCurrencyCode,V.VendorLocation as VendorLocation,CUR.CurrencySymbol as VendorCurrencySymbol,CON.VatTaxPercentage,CURI.CurrencySymbol
  From tbl_vendor_invoice vi
  Left JOIN tbl_vendors V ON  V.VendorId = vi.VendorId
  LEFT JOIN  tbl_terms t ON t.TermsId = vi.TermsId
  LEFT JOIN tbl_mro as mro on mro.MROId=vi.MROId and vi.MROId >0
  LEFT JOIN tbl_po as PO ON PO.POId = vi.POId AND PO.IsDeleted = 0
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = PO.SOId and SO.IsDeleted = 0
  LEFT JOIN tbl_invoice as i on i.SOId=SO.SOId and  i.IsDeleted = 0
  Left JOIN tbl_invoice mroi ON  mroi.MROId = vi.MROId and mroi.MROId>0 and mroi.IsDeleted=0
  LEFT JOIN tbl_quotes as Q on Q.QuoteId=SO.QuoteId  AND Q.IsDeleted = 0
  LEFT JOIN  tbl_users u1 ON u1.UserId = vi.ModifiedBy
  LEFT JOIN tbl_currencies CURI ON CURI.CurrencyCode = vi.LocalCurrencyCode AND CURI.IsDeleted = 0
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = V.VendorCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = V.VendorLocation AND CON.IsDeleted = 0
  LEFT JOIN tbl_countries vic on vic.CountryId=vi.CreatedByLocation
  where vi.IsDeleted=${IsDeleted} and vi.VendorInvoiceId='${VendorInvoiceId}' `;
  if (IdentityType == 2) {
    sql += ` and vi.VendorId=${global.authuser.IdentityId}`;
  }
  if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
    sql += ` and SO.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  }
  //console.log("SQLVI" + sql);
  return sql;
}

//To view VendorInvoice
VendorInvoiceModel.findById = (VendorInvoiceId, IdentityType, IsDeleted, result) => {
  IsDeleted = IsDeleted >= 0 ? IsDeleted : 0;
  var sql = VendorInvoiceModel.view(VendorInvoiceId, IdentityType, IsDeleted);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (!res[0]) {
      return result({ msg: "VendorInvoice not found" }, null);
    }
    // var sqlVendorInv = VendorInvoiceModel.view(VendorInvoiceId);
    var sqlVendorInvoiceItem = VendorInvoiceItemModel.view(VendorInvoiceId);
    var sqlContactAddress = AddressBookModel.ViewContactAddressByVendorId(res[0]["VendorId"]);
    var sqlNotes = Notes.ViewNotes(Constants.CONST_IDENTITY_TYPE_VENDOR_INVOICE, VendorInvoiceId);


    async.parallel([
      function (result) { con.query(sql, result) },
      function (result) { con.query(sqlVendorInvoiceItem, result) },
      function (result) { con.query(sqlContactAddress, result) },
      function (result) { con.query(sqlNotes, result) },
    ],

      function (err, results) {
        if (err)
          return result(err, null);

        if (results[0][0].length > 0) {
          result(null, { VendorInvoiceInfo: results[0][0], VendorInvoiceItem: results[1][0], ContactAddress: results[2][0], NotesList: results[3][0] });
          return;
        } else {
          result({ msg: "VendorInvoice not found" }, null);
          return;
        }
      });
  });
};

//To ApproveVendorInvoice
VendorInvoiceModel.ApproveVendorInvoice = (obj, result) => {

  var sql = ``;

  sql = `UPDATE tbl_vendor_invoice SET ApprovedById = ?,ApprovedByName = ?,
  ApprovedDate = ?,Status = ?,
  Modified = ?,ModifiedBy = ? WHERE VendorInvoiceId = ?`;

  var values = [

    obj.CreatedBy, obj.RequestedByname,
    obj.Created, Constants.CONST_INV_STATUS_APPROVED,
    obj.Modified, obj.ModifiedBy, obj.VendorInvoiceId

  ]
  // console.log("AppVendorInvoice val=" + values);
  con.query(sql, values, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: obj.VendorInvoiceId, ...obj });
  }
  );
};

//To get serversidelist
VendorInvoiceModel.getVendorInvListByServerSide = (obj, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT vi.VendorInvoiceId,vi.VendorId,vi.MROId,MRO.MRONo,
  v.VendorName,vi.CustomerId,vi.CompanyName,CustomerInvoiceAmount,
  DATE_FORMAT(vi.InvoiceDate,'%m/%d/%Y') as InvoiceDate,
  DATE_FORMAT(vi.DueDate,'%m/%d/%Y') as DueDate,vi.VendorInvoiceNo,vi.GrandTotal,
  vi.LocalCurrencyCode,vi.ExchangeRate,vi.BaseCurrencyCode,vi.BaseGrandTotal,vi.CreatedByLocation,
  CASE vi.Status
  WHEN 0 THEN '${Constants.array_vendor_invoice_status[0]}'
  WHEN 1 THEN '${Constants.array_vendor_invoice_status[1]}'
  WHEN 2 THEN '${Constants.array_vendor_invoice_status[2]}'
  WHEN 3 THEN '${Constants.array_vendor_invoice_status[3]}'
  WHEN 4 THEN '${Constants.array_vendor_invoice_status[4]}'
  WHEN 5 THEN '${Constants.array_vendor_invoice_status[5]}'

  ELSE '-'	end StatusName,vi.Status,DATEDIFF(vi.DueDate,CURDATE()) as DueDateDiff,
  vi.RRNo,vi.PONo,vi.RRId,CASE vi.VendorInvoiceType
  WHEN 0 THEN '${Constants.array_vendor_invoice_type[0]}'
  WHEN 2 THEN '${Constants.array_vendor_invoice_type[2]}'
  WHEN 3 THEN '${Constants.array_vendor_invoice_type[3]}'
  ELSE '-'	end VendorInvoiceTypeName,vi.VendorInvoiceType,
  '' as InvoiceDateTo,'' as DueDateTo,vi.IsCSVProcessed,
  '' CustomerInvoiceApproved,'' VendorBillApproved,vi.IsDeleted,'' CustomerInvoiceCreated,Q.QuoteId,Q.QuoteNo,CUR.CurrencySymbol  `;

  recordfilterquery = `Select count(vi.VendorInvoiceId) as recordsFiltered `;

  query = query + ` FROM tbl_vendor_invoice vi
  LEFT JOIN tbl_vendors v on v.VendorId=vi.VendorId
  LEFT JOIN tbl_mro as MRO on MRO.MROId=vi.MROId
  LEFT JOIN tbl_po as PO ON PO.POId = vi.POId AND PO.IsDeleted = 0
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = PO.SOId AND SO.IsDeleted = 0  
  LEFT JOIN tbl_invoice as i on i.SOId=SO.SOId and  i.IsDeleted = 0 
  LEFT JOIN tbl_quotes as Q on Q.QuoteId=SO.QuoteId  AND Q.IsDeleted = 0
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = vi.LocalCurrencyCode AND CUR.IsDeleted = 0
  where 1=1 `;

  if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
    query += ` and SO.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  }

  var VendorId = 0;
  if (obj.VendorId != 0) {
    VendorId = obj.VendorId;
    query = query + ` and vi.IsDeleted=0 and vi.VendorId='${VendorId}' `;
  }
  if (obj.search.value != '') {
    query = query + ` and (  vi.VendorInvoiceNo LIKE '%${obj.search.value}%'
    or vi.VendorInvNo LIKE '%${obj.search.value}%' 
    or vi.VendorId LIKE '%${obj.search.value}%' 
    or vi.Status LIKE '%${obj.search.value}%' 
    or vi.RRNo LIKE '%${obj.search.value}%'
    or vi.InvoiceDate LIKE '%${obj.search.value}%' 
    or vi.DueDate LIKE '%${obj.search.value}%'
    or vi.PONo LIKE '%${obj.search.value}%'
  ) `;
  }

  var cvalue = 0;
  var InvoiceDate = ''; var DueDate = ''; var InvoiceDateTo = ''; var DueDateTo = ''; var IsDeleted = -1;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {

    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "InvoiceDate":
          InvoiceDate = obj.columns[cvalue].search.value;
          break;
        case "InvoiceDateTo":
          InvoiceDateTo = obj.columns[cvalue].search.value;
          break;
        case "DueDate":
          DueDate = obj.columns[cvalue].search.value;
          break;
        case "DueDateTo":
          DueDateTo = obj.columns[cvalue].search.value;
          break;
        case "Status":
          query += " and ( vi.Status='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "VendorId":
          query += " and ( vi.VendorId='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "RRId":
          query += " and  vi.RRId='" + obj.columns[cvalue].search.value + "'  ";
          break;
        case "RRNo":
          query += " and  vi.RRNo='" + obj.columns[cvalue].search.value + "'  ";
          break;
        case "VendorName":
          query += " and ( v.VendorName LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "VendorInvoiceNo":
          query += " and ( vi.VendorInvoiceNo LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "PONo":
          query += " and ( vi.PONo='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "IsCSVProcessed":
          query += " and ( vi.IsCSVProcessed='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "VendorInvoiceId":
          query += " and ( vi.VendorInvoiceId='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerInvoiceApproved":
          if (obj.columns[cvalue].search.value == "true")
            query += " and  i.Status='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
          else if (obj.columns[cvalue].search.value == "false")
            query += " and  i.Status !='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
          break;
        case "VendorBillApproved":
          if (obj.columns[cvalue].search.value == "true")
            query += " and  vi.Status='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
          else if (obj.columns[cvalue].search.value == "false")
            query += " and  vi.Status !='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
          break;

        case "CustomerInvoiceCreated":
          if (obj.columns[cvalue].search.value == "true")
            query += " and  i.InvoiceId>0 ";
          else if (obj.columns[cvalue].search.value == "false")
            query += " and  i.InvoiceId IS  NULL ";
          break;

        case "IsDeleted":
          IsDeleted = obj.columns[cvalue].search.value;
          query += "  and vi.IsDeleted = '" + obj.columns[cvalue].search.value + "' ";
          break;
        case "LocalCurrencyCode":
          query += " and ( vi.LocalCurrencyCode = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedByLocation":
          query += " and ( vi.CreatedByLocation = '" + obj.columns[cvalue].search.value + "' ) ";
          break;

        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  if (IsDeleted == -1) {
    query += " and vi.IsDeleted =0 ";
  }
  if (InvoiceDate != '' && InvoiceDateTo != '') {
    query += " and ( vi.InvoiceDate >= '" + InvoiceDate + "' and vi.InvoiceDate <= '" + InvoiceDateTo + "' ) ";
  }
  else {
    if (InvoiceDate != '') {
      query += " and ( vi.InvoiceDate >= '" + InvoiceDate + "' ) ";
    }
    if (InvoiceDateTo != '') {
      query += " and ( vi.InvoiceDate <= '" + InvoiceDateTo + "' ) ";
    }
  }
  if (DueDate != '' && DueDateTo != '') {
    query += " and ( vi.DueDate >= '" + DueDate + "' and vi.DueDate <= '" + DueDateTo + "' ) ";
  }
  else {
    if (DueDate != '') {
      query += " and ( vi.DueDate >= '" + DueDate + "' ) ";
    }
    if (DueDateTo != '') {
      query += " and ( vi.DueDate <= '" + DueDateTo + "' ) ";
    }
  }

  var i = 0;

  if (obj.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < obj.order.length; i++) {

    if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
    {
      switch (obj.columns[obj.order[i].column].name) {

        case "VendorId":
          query += " vi.VendorId " + obj.order[i].dir + ",";
          break;
        case "VendorInvoiceId":
          query += " vi.VendorInvoiceId " + obj.order[i].dir + ",";
          break;
        case "VendorInvoiceNo":
          query += " vi.VendorInvoiceNo " + obj.order[i].dir + ",";
          break;
        case "RRNo":
          query += " vi.RRNo " + obj.order[i].dir + ",";
          break;

        case "Status":
          query += " vi.Status " + obj.order[i].dir + ",";
          break;

        default://could be any column except above 
          query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + ",";

      }
    }
  }
  //console.log("before query slice =" + query);

  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  if (obj.start != "-1" && obj.length != "-1") {
    query += " LIMIT " + obj.start + "," + (obj.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(vi.VendorInvoiceId) as TotalCount
  FROM tbl_vendor_invoice vi
  LEFT JOIN tbl_vendors v on v.VendorId=vi.VendorId
  LEFT JOIN tbl_mro as MRO on MRO.MROId=vi.MROId
  LEFT JOIN tbl_po as PO ON PO.POId = vi.POId AND PO.IsDeleted = 0
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = PO.SOId AND SO.IsDeleted = 0  
  LEFT JOIN tbl_invoice as i on i.SOId=SO.SOId and  i.IsDeleted = 0 
  where vi.IsDeleted='${IsDeleted >= 0 ? IsDeleted : 0}' `;
  if (VendorId != 0) {
    TotalCountQuery = TotalCountQuery + ` and vi.VendorId='${VendorId}'`;
  }
  if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
    TotalCountQuery += ` and SO.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  }
  // console.log("query = " + query);
  //console.log("Countquery = " + Countquery);

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      // console.log("TotalCount : " + results[2][0][0].TotalCount)
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
      });
      return;
    }
  );

};


VendorInvoiceModel.UpdateVendorInvoiceDueAutoUpdate = (VendorInvoiceId, TermsDays, result) => {
  var sql = `Update tbl_vendor_invoice  SET DueDate = DATE_ADD(InvoiceDate, INTERVAL ${TermsDays} DAY) WHERE IsDeleted=0 and VendorInvoiceId='${VendorInvoiceId}'`;
  //console.log(sql)
  return sql;
};
VendorInvoiceModel.UpdateVendorInvoiceDueAutoUpdateImport = (VendorInvoiceId, DueDate, result) => {
  var sql = `Update tbl_vendor_invoice  SET DueDate ='${DueDate}' WHERE IsDeleted=0 and VendorInvoiceId='${VendorInvoiceId}'`;
  //console.log(sql)
  return sql;
};

//To get RevenueChartReport
VendorInvoiceModel.RevenueChartReport = (VendorId, result) => {

  var sql = ``;

  sql = `SELECT Sum(CustomerInvoiceAmount) as CustomerInvoiceAmount ,VendorName,DATE_FORMAT(InvoiceDate,'%m/%d/%Y') as InvoiceDate,
    Sum(GrandTotal) as GrandTotal
    FROM tbl_vendor_invoice  
    WHERE Status = 2 AND IsDeleted=0 and VendorId='${VendorId}' Group By InvoiceDate`;

  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

VendorInvoiceModel.delete = (id, result) => {
  var sql = `UPDATE tbl_vendor_invoice SET IsDeleted = 1,ModifiedBy='${global.authuser.UserId}',Modified='${cDateTime.getDateTime()}' WHERE VendorInvoiceId = ${id}`;
  var reset_rr = `UPDATE tbl_repair_request SET VendorInvoiceId = 0,VendorInvoiceNo='',VendorInvoiceDueDate=null,ModifiedBy='${global.authuser.UserId}',Modified='${cDateTime.getDateTime()}' WHERE VendorInvoiceId = ${id}`;
  async.parallel([
    function (result) { con.query(sql, result) },
    function (result) { con.query(reset_rr, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, results[0][0]);
    }
  );
};



VendorInvoiceModel.DeleteVendorInvoiceQuery = (RRId) => {
  var Obj = new VendorInvoiceModel({ RRId: RRId });
  var sql = `UPDATE tbl_vendor_invoice SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE IsDeleted = 0 AND RRId>0 AND RRId=${Obj.RRId}`;
  //console.log(sql);
  return sql;
}
//
VendorInvoiceModel.ExportToExcelNew = (reqBody, result) => {

  var obj = new VendorInvoiceModel(reqBody);
  var Ids = ``;
  for (let val of reqBody.VendorInvoice) {
    Ids += val.VendorInvoiceId + `,`;
  }
  var VendorInvocieIds = Ids.slice(0, -1);
  var sql = ``;
  sql = ` SELECT VendorId,VendorInvoiceNo,DATE_FORMAT(InvoiceDate,'%m/%d/%Y') as InvoiceDate,CustomerId,
  CustomerInvoiceNo,DATE_FORMAT(DueDate,'%m/%d/%Y') as DueDate,PONo
  FROM tbl_vendor_invoice
  Left Join tbl_vendor_invoice_item Using(VendorInvoiceId) 
  where IsDeleted=0 `;
  if (obj.RRNo != "") {
    sql += " and ( RRNo ='" + obj.RRNo + "' ) ";
  }
  if (obj.VendorInvoiceNo != "") {
    sql += " and ( VendorInvoiceNo ='" + obj.VendorInvoiceNo + "' ) ";
  }
  if (obj.VendorId > 0) {
    sql += " and ( VendorId ='" + obj.VendorId + "' ) ";
  }
  if (obj.PONo != "") {
    sql += " and ( PONo ='" + obj.PONo + "' ) ";
  }
  if (obj.InvoiceDate != null) {
    sql += " and ( InvoiceDate >='" + obj.InvoiceDate + "' ) ";
  }
  if (reqBody.hasOwnProperty('InvoiceDateTo') == true && reqBody.InvoiceDateTo != "") {
    sql += " and ( InvoiceDate <='" + reqBody.InvoiceDateTo + "' ) ";
  }
  if (obj.DueDate != null) {
    sql += " and ( DueDate >='" + obj.DueDate + "' ) ";
  }
  if (reqBody.hasOwnProperty('DueDateTo') == true && reqBody.DueDateTo != "") {
    sql += " and ( DueDate <='" + reqBody.DueDateTo + "' ) ";
  }
  if (obj.VendorInvoiceType > 0) {
    sql += " and ( VendorInvoiceType ='" + obj.VendorInvoiceType + "' ) ";
  }
  if (obj.Status > 0) {
    sql += " and ( Status ='" + obj.Status + "' ) ";
  }
  if (VendorInvocieIds != '') {
    sql += `and VendorInvoiceId in(` + VendorInvocieIds + `)`;
  }
  //console.log("SQL=" + sql);
  con.query(sql, (err, vendorinvoice) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: vendorinvoice });
  });
};
//To VendorInvoice ExcelData
VendorInvoiceModel.ExportToExcel = (reqBody, VendorInvocieIds, result) => {

  var obj = new VendorInvoiceModel(reqBody);
  var wheresql = ``;
  var selectsql = ` SELECT V.VendorCode, vi.VendorInvNo,'' as ApplyToInvoiceNumber,
  'FALSE' as "Credit Memo",DATE_FORMAT(vi.Created,'%m/%d/%Y') as Date,'FALSE' as Dropship,'' as CustomerSO,
  'FALSE' as WaitingOnBill,'' as CustomerId,CustomerInvoiceNo as CustomerInvoice,
  'AH' as ShipToName,'' as ShipToAddressLineOne,'' as ShipToAddressLineTwo,'' as ShipToCity,
  '' as ShipToState,'' as ShipToZipCode,'' as ShipToCountry,DATE_FORMAT(vi.DueDate,'%m/%d/%Y') as
  DueDate,
  '' as DisCountDate,0 as DisCountAmount,22000 as AccountsPayableAccount,
  '' as ShipVia,'' as PONote,'FALSE' as NotePrintsAfterLineItems,'FALSE' as BeginningBalanceTransaction,
  'FALSE' as AppliedToPurchaseOrder,(SELECT Count(viit.VendorInvoiceItemId) FROM tbl_vendor_invoice_item as viit WHERE viit.IsDeleted = 0 AND viit.VendorInvoiceId = vi.VendorInvoiceId ) as NumberOfDistributions,1 as InvoiceCMDistribution,0 as ApplytoInvoiceDistribution,vi.PONo,0 as PODistribution,
  vii.Quantity as Quantity,
  vii.Quantity as StockingQuantity,'AH-Parts' as ItemID,'' SerialNumber,'Each' UMID,1 UMNoOfStockingUnits,vii.Description,40100 as GLAccount,
  vii.Rate as UnitPrice,
  vii.Rate as StockingUnitPrice,'' as UPCSKU,0 Weight,vii.Price as Amount,'' as JobId,'FALSE' UsedForReimbursableExpense,
  TERM.TermsName as DisplayedTerms,'' ReturnAuthorization,0 RowType,0 RecurNumber,0 RecurFrequency,
  vi.LocalCurrencyCode,vi.ExchangeRate,vi.BaseCurrencyCode,vi.BaseGrandTotal,
  vii.ItemTaxPercent,vii.ItemLocalCurrencyCode,vii.ItemExchangeRate,vii.ItemBaseCurrencyCode,vii.BasePrice
  FROM tbl_vendor_invoice vi
  Left Join tbl_vendor_invoice_item vii on vii.VendorInvoiceId=vi.VendorInvoiceId
  LEFT JOIN tbl_vendors as V ON V.VendorId = vi.VendorId
   LEFT JOIN tbl_terms as TERM ON TERM.TermsId = vi.TermsId
  LEFT JOIN tbl_po as PO ON PO.POId = vi.POId AND PO.IsDeleted = 0
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = PO.SOId AND PO.IsDeleted = 0
  LEFT JOIN tbl_invoice as i on i.SOId=SO.SOId and  i.IsDeleted = 0
  where vi.IsDeleted=0  `;
  if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
    wheresql += ` and SO.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  }
  if (obj.RRNo.RRId && obj.RRNo.RRId != "") {
    wheresql += " and  vi.RRNo ='" + obj.RRNo.RRId + "'  ";
  }
  if (obj.VendorInvoiceNo != "") {
    wheresql += " and  vi.VendorInvoiceNo ='" + obj.VendorInvoiceNo + "'  ";
  }
  if (obj.VendorId > 0) {
    wheresql += " and  vi.VendorId ='" + obj.VendorId + "'  ";
  }
  if (obj.PONo != "") {
    wheresql += " and  vi.PONo ='" + obj.PONo + "'  ";
  }
  if (obj.InvoiceDate != null) {
    wheresql += " and  vi.InvoiceDate >='" + obj.InvoiceDate + "'  ";
  }
  if (reqBody.hasOwnProperty('InvoiceDateTo') == true && reqBody.InvoiceDateTo != "") {
    wheresql += " and  vi.InvoiceDate <='" + reqBody.InvoiceDateTo + "'  ";
  }
  if (obj.DueDate != null) {
    wheresql += " and  vi.DueDate >='" + obj.DueDate + "'  ";
  }
  if (reqBody.hasOwnProperty('DueDateTo') == true && reqBody.DueDateTo != "") {
    wheresql += " and  vi.DueDate <='" + reqBody.DueDateTo + "'  ";
  }
  if (obj.VendorInvoiceType != "") {
    wheresql += " and  vi.VendorInvoiceType ='" + obj.VendorInvoiceType + "'  ";
  }
  if (obj.Status != "") {
    wheresql += " and  vi.Status ='" + obj.Status + "'  ";
  }
  if (reqBody.hasOwnProperty('IsCSVProcessed') == true && obj.IsCSVProcessed != "") {
    wheresql += " and  vi.IsCSVProcessed =" + obj.IsCSVProcessed + "  ";
  }
  if (VendorInvocieIds != '') {
    wheresql += ` and vi.VendorInvoiceId in (` + VendorInvocieIds + `)`;
  }
  if (obj.CustomerInvoiceCreated != "") {
    if (obj.CustomerInvoiceCreated == "true")
      wheresql += " and i.InvoiceId > 0 ";
    else if (obj.CustomerInvoiceCreated == "false")
      wheresql += " and i.InvoiceId IS  NULL ";
  }

  // var UpdateIsCSV = ' UPDATE tbl_vendor_invoice vi SET vi.IsCSVProcessed =1  WHERE vi.IsDeleted=0  ';
  // var sqlArray = []; var obj = {};
  // obj.sqlUpdateIsCSVProcessed = UpdateIsCSV + wheresql;
  wheresql += ` ORDER BY vii.VendorInvoiceId DESC `;
  var query = selectsql + wheresql;
  //sqlArray.push(obj);
  //console.log("sqlExcel=" + sqlArray[0].sqlExcel);
  //console.log("sqlUpdateIsCSVProcessed = " + sqlArray[0].sqlUpdateIsCSVProcessed);
  //console.log(query);
  return query;
};
//To VendorInvoice ExcelData
VendorInvoiceModel.CSVExportToExcel = (reqBody, VendorInvocieIds, result) => {

  var obj = new VendorInvoiceModel(reqBody);
  var wheresql = ``;
  var selectsql = `  SELECT V.VendorCode as 'Vendor ID', vi.VendorInvNo as 'Invoice/CM #' ,'' as 'Apply to Invoice Number',
'FALSE' as 'Credit Memo',DATE_FORMAT(vi.Created,'%m/%d/%Y') as Date,'FALSE' as 'Drop Ship','' as 'Customer SO #',
'FALSE' as 'Waiting on Bill','' as 'Customer ID',CustomerInvoiceNo as 'Customer Invoice #',
'AH' as 'Ship to Name','' as 'Ship to Address-Line One','' as 'Ship to Address-Line Two','' as 'Ship to City',
'' as 'Ship to City','' as 'Ship to Zipcode','' as 'Ship to Country',DATE_FORMAT(vi.DueDate,'%m/%d/%Y') as
'Date Due',
'' as 'Discount Date',0 as 'Discount Amount',22000 as 'Accounts Payable Account',
'' as 'Ship Via','' as 'P.O. Note','FALSE' as 'Note Prints After Line Items','FALSE' as 'Beginning Balance Transaction',
'FALSE' as 'Applied To Purchase Order',(SELECT Count(viit.VendorInvoiceItemId) FROM tbl_vendor_invoice_item as viit
WHERE viit.IsDeleted = 0 AND viit.VendorInvoiceId = vi.VendorInvoiceId ) as 'Number of Distributions',1 as 'Invoice/CM Distribution',
0 as 'Apply to Invoice Distribution',vi.PONo as 'PO Number',0 as 'PO Distribution',
vii.Quantity as Quantity,
vii.Quantity as 'Stocking Quantity','AH-Parts' as 'Item ID','' as 'Serial Number','Each' as 'U/M ID',1 as 'U/M No. of Stocking Units',
'' as 'Description',40100 as 'G/L Account',
vii.Rate as 'Unit Price',
vii.Rate as 'Stocking Unit Price','' as 'UPC / SKU',0 as Weight,vii.Price as Amount,'' as 'Job ID',
'FALSE' as 'Used for Reimbursable Expense',
TERM.TermsName as 'Displayed Terms','' as 'Return Authorization',0 as 'Row Type',0 as 'Recur Number',0 as 'Recur Frequency',
vi.LocalCurrencyCode,vi.ExchangeRate,vi.BaseCurrencyCode,vi.BaseGrandTotal,
vii.ItemTaxPercent,vii.ItemLocalCurrencyCode,vii.ItemExchangeRate,vii.ItemBaseCurrencyCode,vii.BasePrice,vii.BaseRate,vii.BaseTax
FROM tbl_vendor_invoice vi
Left Join tbl_vendor_invoice_item vii on vii.VendorInvoiceId=vi.VendorInvoiceId
LEFT JOIN tbl_vendors as V ON V.VendorId = vi.VendorId
LEFT JOIN tbl_terms as TERM ON TERM.TermsId = vi.TermsId
LEFT JOIN tbl_po as PO ON PO.POId = vi.POId AND PO.IsDeleted = 0
LEFT JOIN tbl_sales_order as SO ON SO.SOId = PO.SOId AND PO.IsDeleted = 0
LEFT JOIN tbl_invoice as i on i.SOId=SO.SOId and  i.IsDeleted = 0
where vi.IsDeleted=0  `;
  if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
    wheresql += ` and SO.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
  }
  if (obj.RRNo.RRId && obj.RRNo.RRId != "") {
    wheresql += " and  vi.RRId ='" + obj.RRNo.RRId + "'  ";
  }
  if (obj.VendorInvoiceNo != "") {
    wheresql += " and  vi.VendorInvoiceNo ='" + obj.VendorInvoiceNo + "'  ";
  }
  if (obj.VendorId > 0) {
    wheresql += " and  vi.VendorId ='" + obj.VendorId + "'  ";
  }
  if (obj.PONo != "") {
    wheresql += " and  vi.PONo ='" + obj.PONo + "'  ";
  }
  if (obj.InvoiceDate != null) {
    wheresql += " and  vi.InvoiceDate >='" + obj.InvoiceDate + "'  ";
  }
  if (reqBody.hasOwnProperty('InvoiceDateTo') == true && reqBody.InvoiceDateTo != "") {
    wheresql += " and  vi.InvoiceDate <='" + reqBody.InvoiceDateTo + "'  ";
  }
  if (obj.DueDate != null) {
    wheresql += " and  vi.DueDate >='" + obj.DueDate + "'  ";
  }
  if (reqBody.hasOwnProperty('DueDateTo') == true && reqBody.DueDateTo != "") {
    wheresql += " and  vi.DueDate <='" + reqBody.DueDateTo + "'  ";
  }
  if (obj.VendorInvoiceType != "") {
    wheresql += " and  vi.VendorInvoiceType ='" + obj.VendorInvoiceType + "'  ";
  }
  if (reqBody.hasOwnProperty('IsCSVProcessed') == true && obj.IsCSVProcessed != "") {
    wheresql += " and  vi.IsCSVProcessed =" + obj.IsCSVProcessed + "  ";
  }
  if (VendorInvocieIds != '') {
    wheresql += ` and vi.VendorInvoiceId in (` + VendorInvocieIds + `)`;
  }

  if (reqBody.hasOwnProperty('DownloadType') && reqBody.DownloadType == "CSV") {
    wheresql += ` and vi.Status= ` + Constants.CONST_VENDOR_INV_STATUS_APPROVED + ` `;
  }

  /* if (obj.Status != Constants.CONST_VENDOR_INV_STATUS_APPROVED) {
     wheresql += " and  vi.Status =-1  ";
   } else if (obj.Status != "" && obj.Status == Constants.CONST_VENDOR_INV_STATUS_APPROVED) {
     wheresql += ` and vi.Status= ` + Constants.CONST_VENDOR_INV_STATUS_APPROVED + ` `;
   } else if (reqBody.hasOwnProperty('IsCSVProcessed') == true && obj.IsCSVProcessed == 1) {
     wheresql += " and  vi.Status ='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "'  ";
   } else { }*/



  if (obj.CustomerInvoiceCreated != "") {
    if (obj.CustomerInvoiceCreated == "true")
      wheresql += " and i.InvoiceId >0 ";
    else if (obj.CustomerInvoiceCreated == "false")
      wheresql += " and i.InvoiceId IS  NULL ";
  }
  var UpdateIsCSV = ` UPDATE tbl_vendor_invoice vi 
  Left Join tbl_invoice i on i.RRId=vi.RRId and vi.RRId>0
  LEFT JOIN tbl_po as PO ON PO.POId = vi.POId AND PO.IsDeleted = 0
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = PO.SOId AND PO.IsDeleted = 0
  SET vi.IsCSVProcessed = 1  WHERE vi.IsDeleted=0  `;
  var sqlArray = []; var obj = {};
  obj.sqlUpdateIsCSVProcessed = UpdateIsCSV + wheresql;

  wheresql += ` ORDER BY vii.VendorInvoiceId DESC `;
  obj.sqlExcel = selectsql + wheresql;
  sqlArray.push(obj);
  //console.log("sqlExcel=" + sqlArray[0].sqlExcel);
  //console.log("sqlUpdateIsCSVProcessed = " + sqlArray[0].sqlUpdateIsCSVProcessed);
  return sqlArray;
};
//
VendorInvoiceModel.UpdateTaxPercent = (Taxpercent, VendorInvoiceId, result) => {
  var sql = ` UPDATE tbl_vendor_invoice SET TaxPercent='${Taxpercent}' WHERE VendorInvoiceId=${VendorInvoiceId} `;
  // console.log("sql=" + sql);
  return sql;
}



VendorInvoiceModel.UpdatePOInvoiceToVB = (Obj, result) => {
  var sql = `Update tbl_vendor_invoice set POId=?,PONo = ?, CustomerInvoiceId = ?, CustomerInvoiceNo = ?   where VendorInvoiceId=? `;
  var values = [Obj.POId, Obj.PONo, Obj.CustomerInvoiceId, Obj.CustomerInvoiceNo, Obj.VendorInvoiceId];
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

//Update After VendorInvItem Delete
VendorInvoiceModel.UpdateAfterVendorInvItemDelete = (ObjModel, result) => {

  var Obj = new VendorInvoiceModel(ObjModel);
  var sql = `Update tbl_vendor_invoice set SubTotal=?,TaxPercent = ?, TotalTax=?,GrandTotal=?,Modified=?,ModifiedBy=? where VendorInvoiceId=? `;
  var values = [Obj.SubTotal, Obj.TaxPercent, Obj.TotalTax, Obj.GrandTotal, Obj.Modified, Obj.ModifiedBy, Obj.VendorInvoiceId];
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

//To get DueList Of Vendor Invoice
VendorInvoiceModel.getDueListOfVendorInvoice = (Invoice, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT vi.VendorInvoiceId,vi.VendorInvoiceNo,c.CompanyName,rrp.PartNo,
  DATE_FORMAT(InvoiceDate,'%m/%d/%Y') as InvoiceDate, DATE_FORMAT(DueDate,'%m/%d/%Y') as DueDate, 
  DATEDIFF(DueDate,CURDATE()) as DueDateDiff,RRNo `;
  recordfilterquery = `Select count(VendorInvoiceId) as recordsFiltered `;
  query = query + ` FROM tbl_vendor_invoice vi
  LEFT JOIN tbl_customers c on c.CustomerId=vi.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId=vi.RRId
  where vi.IsDeleted=0 `;
  var VendorId = 0;
  if (Invoice.VendorId > 0) {
    VendorId = Invoice.VendorId;
    query = query + ` and vi.VendorId='${VendorId}' `;
  }
  if (Invoice.search.value != '') {
    query = query + ` and (  vi.VendorInvoiceNo = '${Invoice.search.value}'
    or c.CompanyName LIKE '%${Invoice.search.value}%'  
    or InvoiceDate = '${Invoice.search.value}' 
    or DueDate = '${Invoice.search.value}'
    or RRNo = '${Invoice.search.value}'
    or rrp.PartNo = '${Invoice.search.value}'
    or vi.GrandTotal = '${Invoice.search.value}'
  ) `;
  }
  query += " and vi.DueDate <=CURRENT_DATE and vi.Status=2 ORDER BY vi.DueDate DESC ";

  var Countquery = recordfilterquery + query;
  query += " limit 0,10 ";
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(vi.VendorInvoiceId) as TotalCount 
  FROM tbl_vendor_invoice vi
  LEFT JOIN tbl_customers c on c.CustomerId=vi.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId=vi.RRId
  where vi.IsDeleted=0  and vi.DueDate <=CURRENT_DATE and vi.Status=2 `;
  if (VendorId > 0) {
    TotalCountQuery = TotalCountQuery + ` and vi.VendorId='${VendorId}' `;
  }
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

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: Invoice.draw
      });
      return;
    }
  );
};

//Global Search
VendorInvoiceModel.findInColumns = (searchQuery, result) => {

  const { from, size, query } = searchQuery;
  let { IdentityType, MultipleAccessIdentityIds, IsRestrictedCustomerAccess, MultipleCustomerIds } = global.authuser;
  if (IdentityType == "1") {
    return result(null, []);
  }

  var sql = `SELECT 'ahoms-purchase-invoice' as _index,
  I.VendorInvoiceId as vendorinvoiceid, I.VendorInvoiceNo as vendorinvoiceno, I.RRId as rrid, I.RRNo as rrno, C.CustomerId as customerid, C.CustomerCode as customercode, C.CompanyName as companyname
  FROM tbl_vendor_invoice as I
  LEFT JOIN tbl_customers as C ON C.CustomerId = I.CustomerId
  where
  (
    I.VendorInvoiceNo like '%${query.multi_match.query}%' or
    I.RRNo like '%${query.multi_match.query}%' or
    C.CustomerCode like '%${query.multi_match.query}%' or
    C.FirstName like '%${query.multi_match.query}%' or
    C.LastName like '%${query.multi_match.query}%' or
    C.Email like '%${query.multi_match.query}%' or
    C.CompanyName like '%${query.multi_match.query}%' or
    C.PriorityNotes like '%${query.multi_match.query}%'
  ) and I.IsDeleted=0
${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND C.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size}`;

  var countSql = `SELECT count(*) AS totalCount 
  FROM tbl_vendor_invoice as I
  LEFT JOIN tbl_customers as C ON C.CustomerId = I.CustomerId
  where
  (
    I.VendorInvoiceNo like '%${query.multi_match.query}%' or
    I.RRNo like '%${query.multi_match.query}%' or
    C.CustomerCode like '%${query.multi_match.query}%' or
    C.FirstName like '%${query.multi_match.query}%' or
    C.LastName like '%${query.multi_match.query}%' or
    C.Email like '%${query.multi_match.query}%' or
    C.CompanyName like '%${query.multi_match.query}%' or
    C.PriorityNotes like '%${query.multi_match.query}%'
  ) and I.IsDeleted=0
${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND C.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  `


  //console.log("" + sql);
  //console.log("" + countSql);
  con.query(countSql, (err, res) => {
    if (err) {
      return result(err, null);
    } else if (res[0].totalCount > 0) {
      let totalCount = res[0].totalCount;
      con.query(sql, (err, res) => {
        if (err) {
          return result(err, null);
        }
        return result(null, { totalCount: { "_index": "ahoms-purchase-invoice", val: totalCount }, data: res });
      });
    } else {
      return result(null, []);
    }

  });
}
//IsExistVendorInvoiceByRRId
VendorInvoiceModel.IsExistVendorInvoiceByRRIdAndPOId = (RRId, POId) => {
  var sql = `Select VendorInvoiceId,VendorId from tbl_vendor_invoice where IsDeleted=0 and RRId='${RRId}' And
  POId='${POId}' `;
  return sql;
}
//
VendorInvoiceModel.ReOpenVendorInvoice = (obj, result) => {
  var sql = ``;
  sql = `UPDATE tbl_vendor_invoice SET ReOpenedBy = ?,ReOpenedByName = ?,
  ReOpenedDate = ?,Status = ?,
  Modified = ?,ModifiedBy = ? WHERE VendorInvoiceId = ?`;
  var values = [
    obj.CreatedBy, obj.RequestedByname,
    cDateTime.getDate(), Constants.CONST_VENDOR_INV_STATUS_AMENDED,
    obj.Modified, obj.ModifiedBy, obj.VendorInvoiceId
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
    result(null, obj);
  });
};








//Below are for MRO :
VendorInvoiceModel.IsExistVendorInvoiceByMROId = (MROId) => {
  var sql = `Select VendorInvoiceId,VendorId from tbl_vendor_invoice where IsDeleted=0 and MROId='${MROId}' `;
  return sql;
}
VendorInvoiceModel.DeleteMROVendorInvoiceQuery = (MROId) => {
  var Obj = new VendorInvoiceModel({ MROId: MROId });
  var sql = `UPDATE tbl_vendor_invoice SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE MROId=${Obj.MROId}`;
  return sql;
}
module.exports = VendorInvoiceModel;
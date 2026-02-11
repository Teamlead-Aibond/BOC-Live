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
const QuoteItem = require("../models/quote.item.model.js");
const RRStatusHistory = require("../models/rr.status.history.model.js");
const CQFollowUp = require("../models/customer.quote.followup.model.js");
// const RR = require("../models/repair.request.model.js");
const Notes = require("../models/repair.request.notes.model.js");
const AttachmentModel = require("../models/repair.request.attachment.model.js");
const OrderAddress = require("../models/order.address.model.js");
const AddressBook = require("../models/customeraddress.model.js");
const NotificationModel = require("../models/notification.model.js");
const CRefernceModel = require("../models/cutomer.reference.labels.model.js");
// const RRVendorsModel = require("../models/repair.request.vendors.model.js");

var MailConfig = require('../config/email.config');
var hbs = require('nodemailer-express-handlebars');
var gmailTransport = MailConfig.GmailTransport;
var smtpTransport = MailConfig.SMTPTransport;
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
const Quotes = function FuncName(objQuotes) {
  this.QuoteId = objQuotes.QuoteId;
  this.VendorId = objQuotes.VendorId ? objQuotes.VendorId : 0;
  this.QuoteNo = objQuotes.QuoteNo ? objQuotes.QuoteNo : '';
  this.QuoteType = objQuotes.QuoteType ? objQuotes.QuoteType : 0;
  this.MROId = objQuotes.MROId ? objQuotes.MROId : 0;
  this.RRId = objQuotes.RRId ? objQuotes.RRId : 0;
  this.RRNo = objQuotes.RRNo ? objQuotes.RRNo : '';
  this.IdentityType = objQuotes.IdentityType ? objQuotes.IdentityType : 1;
  this.IdentityId = objQuotes.IdentityId ? objQuotes.IdentityId : 0;
  this.RRVendorId = objQuotes.RRVendorId ? objQuotes.RRVendorId : 0;
  this.VendorId = objQuotes.VendorId ? objQuotes.VendorId : 0;
  this.CustomerBillToId = objQuotes.CustomerBillToId ? objQuotes.CustomerBillToId : 0;
  this.CustomerShipToId = objQuotes.CustomerShipToId ? objQuotes.CustomerShipToId : 0;
  this.Description = objQuotes.Description ? objQuotes.Description : '';
  this.QuoteDate = objQuotes.QuoteDate ? objQuotes.QuoteDate : null;
  this.CompanyName = objQuotes.CompanyName ? objQuotes.CompanyName : '';
  this.FirstName = objQuotes.FirstName ? objQuotes.FirstName : '';
  this.LastName = objQuotes.LastName ? objQuotes.LastName : '';
  this.Email = objQuotes.Email ? objQuotes.Email : '';
  this.TaxType = objQuotes.TaxType ? objQuotes.TaxType : 0;
  this.TermsId = objQuotes.TermsId ? objQuotes.TermsId : 0;
  this.Notes = objQuotes.Notes ? objQuotes.Notes : '';
  this.AddressId = objQuotes.AddressId ? objQuotes.AddressId : 0;
  this.TotalValue = objQuotes.TotalValue ? objQuotes.TotalValue : 0;
  this.ProcessFee = objQuotes.ProcessFee ? objQuotes.ProcessFee : 0;
  this.TaxPercent = objQuotes.TaxPercent ? objQuotes.TaxPercent : 0;
  this.TotalTax = objQuotes.TotalTax ? objQuotes.TotalTax : 0;
  this.Discount = objQuotes.Discount ? objQuotes.Discount : 0;
  this.ShippingFee = objQuotes.ShippingFee ? objQuotes.ShippingFee : 0;
  this.Shipping = objQuotes.Shipping ? objQuotes.Shipping : 0;
  this.GrandTotal = objQuotes.GrandTotal ? objQuotes.GrandTotal : 0;

  this.LocalCurrencyCode = objQuotes.LocalCurrencyCode ? objQuotes.LocalCurrencyCode : '';
  this.ExchangeRate = objQuotes.ExchangeRate ? objQuotes.ExchangeRate : 0;
  this.BaseCurrencyCode = objQuotes.BaseCurrencyCode ? objQuotes.BaseCurrencyCode : '';
  this.BaseGrandTotal = objQuotes.BaseGrandTotal ? objQuotes.BaseGrandTotal : 0;

  this.QuoteCustomerStatus = objQuotes.QuoteCustomerStatus ? objQuotes.QuoteCustomerStatus : 0;
  this.QuoteRejectedType = objQuotes.QuoteRejectedType ? objQuotes.QuoteRejectedType : 0;
  this.RouteCause = objQuotes.RouteCause ? objQuotes.RouteCause : '';
  this.Status = objQuotes.Status ? objQuotes.Status : 0;
  this.SubmittedDate = objQuotes.SubmittedDate ? objQuotes.SubmittedDate : null;
  this.ApprovedDate = objQuotes.ApprovedDate ? objQuotes.ApprovedDate : null;
  this.Created = objQuotes.Created ? objQuotes.Created : cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  this.LeadTime = objQuotes.LeadTime ? objQuotes.LeadTime : '';
  this.WarrantyPeriod = objQuotes.WarrantyPeriod ? objQuotes.WarrantyPeriod : 0;
  this.SubTotal = objQuotes.SubTotal ? objQuotes.SubTotal : 0;
  this.AdditionalCharge = objQuotes.AdditionalCharge ? objQuotes.AdditionalCharge : 0;
  this.IsEmailSent = objQuotes.IsEmailSent ? objQuotes.IsEmailSent : 0;
  this.CustomerId = objQuotes.CustomerId ? objQuotes.CustomerId : 0;
  this.Quote = objQuotes.Quote ? objQuotes.Quote : '';

  this.CustomerShipIdLocked = objQuotes.CustomerShipIdLocked ? objQuotes.CustomerShipIdLocked : 0;
  this.IsMoveToStore = objQuotes.IsMoveToStore ? objQuotes.IsMoveToStore : 0;

  this.authuser = objQuotes.authuser ? authuser.Quote : {};

  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objQuotes.authuser && objQuotes.authuser.UserId) ? objQuotes.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objQuotes.authuser && objQuotes.authuser.UserId) ? objQuotes.authuser.UserId : TokenUserId;


  const TokenCreatedByLocation = global.authuser.Location ? global.authuser.Location : 0;
  this.CreatedByLocation = (objQuotes.authuser && objQuotes.authuser.Location) ? objQuotes.authuser.Location : TokenCreatedByLocation;


  // For Server Side Search 
  this.start = objQuotes.start;
  this.length = objQuotes.length;
  this.search = objQuotes.search;
  this.sortCol = objQuotes.sortCol;
  this.sortDir = objQuotes.sortDir;
  this.sortColName = objQuotes.sortColName;
  this.order = objQuotes.order;
  this.columns = objQuotes.columns;
  this.draw = objQuotes.draw;
  this.from = objQuotes.from ? objQuotes.from : '';

};

function roundTo(n, digits) {
  var negative = false;
  if (digits === undefined) {
    digits = 0;
  }
  if (n < 0) {
    negative = true;
    n = n * -1;
  }
  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = (Math.round(n) / multiplicator).toFixed(2);
  if (negative) {
    n = (n * -1).toFixed(2);
  }
  return n;
}
Quotes.findById = (QuoteId, IsDeleted, reqBody, result) => {

  IsDeleted = IsDeleted >= 0 ? IsDeleted : 0;
  var sqlQuotes = Quotes.viewquery(QuoteId, IsDeleted, reqBody);
  con.query(sqlQuotes, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (!res[0]) {
      return result({ msg: "Quote not found" }, null);
    }

    var sqlQuoteItem = QuoteItem.viewquery(QuoteId);
    var sqlNotes = Notes.ViewNotes(Constants.CONST_IDENTITY_TYPE_QUOTE, QuoteId);
    var sqlAttachment = AttachmentModel.ListAttachmentQuery(Constants.CONST_IDENTITY_TYPE_QUOTE, QuoteId);
    var sqlContactAddress = AddressBook.ViewContactAddressByCustomerId(res[0]["IdentityId"]);
    var sqlShipingAddress = AddressBook.GetAddressByIdQuery(res[0]["CustomerShipToId"]);
    var sqlBillingAddress = AddressBook.GetAddressByIdQuery(res[0]["CustomerBillToId"]);
    var sqlRemitToAddress = AddressBook.GetRemitToAddressIdByCustomerId(res[0]["IdentityId"]);
    var sqlCustomerReference = '';
    if (res[0]["RRId"] > 0)
      sqlCustomerReference = CRefernceModel.ViewCustomerReference(res[0]["RRId"]);
    else if (res[0]["MROId"] > 0)
      sqlCustomerReference = CRefernceModel.ViewMROCustomerReference(res[0]["MROId"]);
    else
      sqlCustomerReference = "Select '-' NoRecord";
    async.parallel([
      function (result) { con.query(sqlQuotes, result) },
      function (result) { con.query(sqlQuoteItem, result) },
      function (result) { con.query(sqlNotes, result) },
      function (result) { con.query(sqlAttachment, result) },
      function (result) { con.query(sqlContactAddress, result) },
      function (result) { con.query(sqlShipingAddress, result) },
      function (result) { con.query(sqlBillingAddress, result) },
      function (result) { con.query(sqlCustomerReference, result) },
      function (result) { con.query(sqlRemitToAddress, result) },
    ],
      function (err, results) {
        if (err)
          return result(err, null);

        if (results[0][0].length > 0) {
          var sqlRRNotes = '';
          if (res[0]["RRId"] > 0)
            sqlRRNotes = Notes.ViewRRCustomerNotes(Constants.CONST_IDENTITY_TYPE_RR, results[0][0][0].RRId);
          else if (res[0]["MROId"] > 0)
            sqlRRNotes = Notes.ViewRRCustomerNotes(Constants.CONST_IDENTITY_TYPE_MRO, results[0][0][0].MROId);
          else
            sqlRRNotes = "Select '-' NoRecord";
          //var sqlRRNotes = Notes.ViewRRCustomerNotes(Constants.CONST_IDENTITY_TYPE_RR, results[0][0][0].RRId);
          con.query(sqlRRNotes, (err, res) => {
            result(null, { BasicInfo: results[0][0], QuoteItem: results[1][0], NotesList: results[2][0], AttachmentList: results[3][0], ContactAddress: results[4][0], ShippingAddress: results[5][0], BillingAddress: results[6][0], CustomerReference: results[7][0], RRNotesList: res, RemitToAddress: results[8][0][0] });
            return;
          });
        } else {
          result({ msg: "Quote not found" }, null);
          return;
        }
      }
    );

  });
};


Quotes.viewquery = (QuoteId, IsDeleted, reqBody) => {

  var TokenIdentityType = getLogInIdentityType(reqBody);
  var MultipleAccessIdentityIds = getLogInMultipleAccessIdentityIds(reqBody);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(reqBody);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqBody);

  var sql = `SELECT SO.CustomerBlanketPOId,q.QuoteId,QuoteNo, Case QuoteType
  WHEN 1 THEN '${Constants.array_quotetype[1]}'
  WHEN 2 THEN '${Constants.array_quotetype[2]}'
  ELSE '-'	end QuoteTypeName,QuoteType,
  q.RRId,q.LocalCurrencyCode,q.ExchangeRate,q.BaseCurrencyCode,ROUND(ifnull(q.BaseGrandTotal,0),2) as BaseGrandTotal,
  RR.CreatedByLocation as RRCreatedByLocation,CONRR.CountryName as RRCreatedByLocationName,CONRR.CountryCode as RRCreatedByLocationCode,
  SO.SONo,q.CustomerShipIdLocked,q.IsMoveToStore,
  SO.SOId,
  PO.PONo,
  PO.POId,
  I.InvoiceId,
  I.InvoiceNo,
  VI.VendorInvoiceNo,
  VI.VendorInvoiceId,q.CreatedByLocation,qc.CountryName as CreatedByLocationName,
  Case q.IdentityType
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  WHEN 2 THEN '${Constants.array_identity_type[2]}'
  ELSE '-'	end IdentityTypeName,q.IdentityType,
  q.IdentityId,q.Description,q.RRVendorId,q.VendorId,q.CustomerBillToId,q.CustomerShipToId,
  DATE_FORMAT(QuoteDate,'%m/%d/%Y') as QuoteDate,c.CompanyName,q.FirstName,q.LastName,q.Email,q.IsEmailSent,
  case q.TaxType
  WHEN 1 THEN '${Constants.array_tax_type[1]}'
  WHEN 2 THEN '${Constants.array_tax_type[2]}'
  WHEN 3 THEN '${Constants.array_tax_type[3]}'
  ELSE '-'	end TaxTypeName,q.TaxType,
  q.TermsId,
  t.TermsName as Terms,
  q.Notes,q.AddressId, ROUND(ifnull(q.TotalValue,0),2) as TotalValue,
  q.ProcessFee,q.TotalTax,q.TaxPercent,q.Discount,q.ShippingFee,
  ROUND(ifnull(q.GrandTotal,0),2) as GrandTotal,q.RouteCause,q.QuoteCustomerStatus,c.CustomerLocation,c.CustomerCurrencyCode,CUR.CurrencySymbol,CON.VatTaxPercentage,CURC.CurrencySymbol as CustomerCurrencySymbol,
  Case q.Status
  WHEN 0 THEN '${Constants.array_quote_status[0]}'
  WHEN 1 THEN '${Constants.array_quote_status[1]}'
  WHEN 2 THEN '${Constants.array_quote_status[2]}'
  WHEN 3 THEN '${Constants.array_quote_status[3]}'
  WHEN 4 THEN '${Constants.array_quote_status[4]}'
  WHEN 5 THEN '${Constants.array_quote_status[5]}'
  ELSE '-'	end StatusName,q.Status,RR.RRNo,q.LeadTime,q.WarrantyPeriod,RR.IsRushRepair,
  case RR.IsRushRepair
  WHEN 1 THEN '${Constants.array_yes_no[1]}'
  WHEN 0 THEN '${Constants.array_yes_no[0]}'
  ELSE ''	end IsRushRepairName,
  RR.IsWarrantyRecovery,
  case RR.IsWarrantyRecovery
  WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
  WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
  ELSE ''	end IsWarrantyRecoveryName,RR.IsRepairTag,
  case RR.IsRepairTag
  WHEN 1 THEN '${Constants.array_yes_no[1]}'
  WHEN 0 THEN '${Constants.array_yes_no[0]}'
  ELSE '-'	end IsRepairTagName,CONCAT(u.FirstName,' ',u.LastName) as AdminName,u.PhoneNo as AdminMobile,MRO.MRONo, RR.PartId as RepairPartId,
  ifnull(MRO.MROId, 0) MROId,CONCAT(u1.FirstName,' ',u1.LastName) as DeletedByName, DATE_FORMAT(q.Modified,'%Y-%m-%d')
 DeletedDate,IsCorpVendorCode,CorpVendorNotes,IFNULL(d.CustomerDepartmentName,'') as CustomerDepartmentName, 
 IFNULL(a.CustomerAssetName,'') as CustomerAssetName,
 case RR.IsRushRepair
  WHEN 1 THEN 'Rush Repair'
  ELSE ''	end IsRushRepairNamePDF
  FROM tbl_quotes q
  LEFT JOIN tbl_repair_request RR on RR.RRId=q.RRId
  LEFT JOIN tbl_vendors v on v.VendorId=q.VendorId
  LEFT JOIN tbl_mro MRO on MRO.MROId=q.MROId
  LEFT JOIN tbl_sales_order as SO ON SO.QuoteId = q.QuoteId AND SO.IsDeleted = 0
  LEFT JOIN tbl_po as PO ON PO.POId = SO.POId AND PO.IsDeleted = 0
  LEFT JOIN tbl_invoice as I ON I.SOId = SO.SOId AND I.IsDeleted = 0
  LEFT JOIN tbl_vendor_invoice as VI ON VI.POId = PO.POId AND VI.IsDeleted = 0
  LEFT JOIN tbl_terms t on q.TermsId=t.TermsId
  LEFT JOIN tbl_users u on u.UserId=q.CreatedBy
  LEFT JOIN tbl_users u1 on u1.UserId=q.ModifiedBy
  LEFT JOIN tbl_customers c on c.CustomerId=q.IdentityId
  LEFT JOIN tbl_customer_departments d on d.CustomerDepartmentId=RR.DepartmentId
  LEFT JOIN tbl_customer_assets a on a.CustomerAssetId=RR.AssetId
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = q.LocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURC  ON CURC.CurrencyCode = c.CustomerCurrencyCode AND CURC.IsDeleted = 0
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = c.CustomerLocation AND CON.IsDeleted = 0
  LEFT JOIN tbl_countries qc on qc.CountryId=q.CreatedByLocation
  LEFT JOIN tbl_countries as CONRR  ON CONRR.CountryId = RR.CreatedByLocation AND CONRR.IsDeleted = 0
  where q.IsDeleted=${IsDeleted >= 0 ? IsDeleted : 0} and q.QuoteId='${QuoteId}' `;
  if (TokenIdentityType == 1) {
    sql += ` AND q.Status IN(4,1,2) AND q.IdentityId In ( ${MultipleAccessIdentityIds}) `
  }
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and q.IdentityId in(${MultipleCustomerIds}) `;
  }
  //console.log(sql);
  return sql;
}

Quotes.getQuoteListByServerSide = (Quotes, result) => {

  var query = "";
  var statuscheck = '';

  var TokenIdentityType = getLogInIdentityType(Quotes);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(Quotes);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(Quotes);

  var customerPortalQuery = '';
  if (Quotes.from == 1) {
    customerPortalQuery = ` AND q.Status IN(4,1,2) AND q.IdentityId In( ${MultipleCustomerIds} ) `
  }
  //

  var selectquery = `SELECT q.QuoteId,s.SOId,s.SONo,p.POId,p.PONo,i.InvoiceId,i.InvoiceNo,s.CustomerPONo,q.RRNo,q.RRId, 
  QuoteNo,q.IsEmailSent, MRO.MRONo, q.MROId,
 CASE QuoteType 
 WHEN 1 THEN '${Constants.array_quotetype[1]}'
 WHEN 2 THEN '${Constants.array_quotetype[2]}' 
 ELSE '-'	end QuoteTypeName,QuoteType,  
q.Description,q.CreatedByLocation,
c.CompanyName,q.LocalCurrencyCode,q.ExchangeRate,q.BaseCurrencyCode,
ROUND(ifnull(q.BaseGrandTotal,0),2) as BaseGrandTotal ,
c.CustomerId,
ROUND(ifnull(q.GrandTotal,0),2) as GrandTotal ,
DATE_FORMAT(q.Created,'%m/%d/%Y') as Created ,'' as SO,q.Status,
CASE q.Status 
 WHEN 0 THEN '${Constants.array_quote_status[0]}'
 WHEN 1 THEN '${Constants.array_quote_status[1]}'
 WHEN 2 THEN '${Constants.array_quote_status[2]}'
 WHEN 3 THEN '${Constants.array_quote_status[3]}'  
 WHEN 4 THEN '${Constants.array_quote_status[4]}'
 WHEN 5 THEN '${Constants.array_quote_status[5]}'
 ELSE '-'	end StatusName,DATE_FORMAT(q.QuoteDate,'%m/%d/%Y') as QuoteDate,'' as QuoteDateTo,
 q.IsDeleted,'' QuoteCategory,CUR.CurrencySymbol,c.CustomerGroupId `;

  recordfilterquery = `Select count(q.QuoteId) as recordsFiltered `;
  query = query + ` FROM tbl_quotes q
LEFT JOIN tbl_mro MRO on MRO.MROId=q.MROId and MRO.IsDeleted=0
LEFT JOIN tbl_sales_order s on s.QuoteId=q.QuoteId and s.IsDeleted=0
LEFT JOIN tbl_invoice i on i.SOId=s.SOId and i.IsDeleted=0
LEFT JOIN tbl_po p on p.POId=s.POId and p.IsDeleted=0
LEFT JOIN tbl_customers c on c.CustomerId = q.IdentityId AND q.IdentityType = 1 and c.IsDeleted=0
LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = q.LocalCurrencyCode AND CUR.IsDeleted = 0
where 1=1 `;



  if (Quotes.from == 1) {
    query = query + ` and q.IsDeleted=0 and q.IdentityId In (${MultipleCustomerIds}) `;
  }
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    query += ` and q.IdentityId in(${MultipleCustomerIds}) `;
  }

  if (Quotes.search.value != '') {
    query = query + ` and ( q.QuoteNo LIKE '%${Quotes.search.value}%'
    or q.QuoteType LIKE '%${Quotes.search.value}%' 
    or q.RRNo LIKE '%${Quotes.search.value}%' 
    or q.Description LIKE '%${Quotes.search.value}%' 
    or (q.IdentityId LIKE '%${Quotes.search.value}%' AND q.IdentityType = 1) 
    or (c.CompanyName LIKE '%${Quotes.search.value}%') 
    or q.Status LIKE '%${Quotes.search.value}%'
    or q.Created LIKE '%${Quotes.search.value}%'
    or q.QuoteDate LIKE '%${Quotes.search.value}%'
    ) `;
  }

  var cvalue = 0;
  var QuoteDate = QuoteDateTo = ''; var IsDeleted = -1;
  for (cvalue = 0; cvalue < Quotes.columns.length; cvalue++) {


    if (Quotes.columns[cvalue].search.value != "") {
      switch (Quotes.columns[cvalue].name) {
        case "QuoteCategory":
          if (Quotes.columns[cvalue].search.value == 1) { //RR
            query += ' and q.RRId > 0 AND q.MROId = 0  ';
          }
          if (Quotes.columns[cvalue].search.value == 2) { //MRO
            query += ' and q.RRId = 0 AND q.MROId > 0  ';
          }
          if (Quotes.columns[cvalue].search.value == 3) { //QT
            query += ' and q.RRId = 0 and q.MROId = 0  ';
          }
          break;
        case "QuoteDate":
          QuoteDate = Quotes.columns[cvalue].search.value;
          break;
        case "QuoteDateTo":
          QuoteDateTo = Quotes.columns[cvalue].search.value;
          break;
        case "Status":
          query += " and ( q.Status = '" + Quotes.columns[cvalue].search.value + "' ) ";
          statuscheck = 1;
          break;
        case "Description":
          query += " and ( q.Description = '" + Quotes.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and  q.IdentityId In(" + Quotes.columns[cvalue].search.value + ") AND q.IdentityType = 1  ";
          break;

        case "RRId":
          query += " and ( q.RRId = '" + Quotes.columns[cvalue].search.value + "' ) ";
          break;
        case "RRNo":
          query += " and ( q.RRNo = '" + Quotes.columns[cvalue].search.value + "' ) ";
          break;
        case "CompanyName":
          query += " and ( c.CompanyName LIKE '%" + Quotes.columns[cvalue].search.value + "%' ) ";
          break;
        case "Created":
          query += " and ( q.Created LIKE '%" + Quotes.columns[cvalue].search.value + "%' ) ";
          break;
        case "IsDeleted":
          IsDeleted = Quotes.columns[cvalue].search.value;
          query += " and  q.IsDeleted = '" + Quotes.columns[cvalue].search.value + "' ";
          break;
        case "LocalCurrencyCode":
          query += " and ( q.LocalCurrencyCode = '" + Quotes.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedByLocation":
          query += " and ( q.CreatedByLocation = '" + Quotes.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerGroupId":
          query += " and (q.IdentityId IN(SELECT CustomerId FROM tbl_customers  WHERE " + Quotes.columns[cvalue].name + " IN (" + Quotes.columns[cvalue].search.value + "))) AND q.IdentityType = 1  ";
          break;
        default:
          query += " and ( " + Quotes.columns[cvalue].name + " LIKE '%" + Quotes.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  if (IsDeleted == -1)
    query += " and  q.IsDeleted =0 ";

  //To skip the quoted status by default
  if (!statuscheck) {
    query += " and ( q.Status != '" + Constants.CONST_QUOTE_STATUS_QUOTED + "' ) ";
  }

  if (QuoteDate != '' && QuoteDateTo != '') {
    query += " and ( q.QuoteDate >= '" + QuoteDate + "' and q.QuoteDate <= '" + QuoteDateTo + "' ) ";
  }
  else {
    if (QuoteDate != '') {
      query += " and ( q.QuoteDate >= '" + QuoteDate + "' ) ";
    }
    if (QuoteDateTo != '') {
      query += " and ( q.QuoteDate <= '" + QuoteDateTo + "' ) ";
    }
  }



  query += customerPortalQuery;

  var i = 0;

  if (Quotes.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < Quotes.order.length; i++) {

    if (Quotes.order[i].column != "" || Quotes.order[i].column == "0")// 0 is equal to ""
    {
      switch (Quotes.columns[Quotes.order[i].column].name) {
        case "QuoteId":
          query += " q.QuoteId " + Quotes.order[i].dir + ",";
          break;
        case "CustomerId":
          query += " c.IdentityId " + Quotes.order[i].dir + ",";
          break;

        case "RRId":
          query += " q.RRId " + Quotes.order[i].dir + ",";
          break;

        case "Status":
          query += " q.Status " + Quotes.order[i].dir + ",";
          break;

        case "Created":
          query += " q.Created " + Quotes.order[i].dir + ",";
          break;

        default://could be any column except above 
          query += " " + Quotes.columns[Quotes.order[i].column].name + " " + Quotes.order[i].dir + ",";

      }
    }
  }

  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  if (Quotes.start != "-1" && Quotes.length != "-1") {
    query += " LIMIT " + Quotes.start + "," + (Quotes.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(q.QuoteId) as TotalCount 
  FROM tbl_quotes q
  LEFT JOIN tbl_mro MRO on MRO.MROId=q.MROId and MRO.IsDeleted=0
  LEFT JOIN tbl_sales_order s on s.QuoteId=q.QuoteId and s.IsDeleted=0
  LEFT JOIN tbl_invoice i on i.SOId=s.SOId and i.IsDeleted=0
  LEFT JOIN tbl_po p on p.POId=s.POId and p.IsDeleted=0
  LEFT JOIN tbl_customers c on c.CustomerId = q.IdentityId AND q.IdentityType = 1 and c.IsDeleted=0
  where q.IsDeleted='${IsDeleted >= 0 ? IsDeleted : 0}' `;
  if (!statuscheck)
    TotalCountQuery += " and ( q.Status != '" + Constants.CONST_QUOTE_STATUS_QUOTED + "' ) ";
  if (Quotes.from == 1) {
    TotalCountQuery += `  and q.IdentityId In (${MultipleAccessIdentityIds}) `;
    TotalCountQuery += customerPortalQuery;
  }
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    TotalCountQuery += ` and q.IdentityId in(${MultipleCustomerIds}) `;
  }

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

      // console.log("TotalCount : " + results[2][0][0].TotalCount)
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: Quotes.draw
      });
      return;
    }
  );

};

Quotes.GetQuotesCode = result => {
  con.query(`Select concat('QT', Max(QuoteId)+1) as QuoteCode from tbl_quotes `, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }
    //console.log("QuoteCode Loaded :", res);
    result(null, res[0].QuoteCode);
  });
}

Quotes.CreateQuotes = (Quotes1, result) => {
  var val = new Quotes(Quotes1);
  if (val.MROId > 0) {
    val.QuoteType = Constants.CONST_QUOTE_TYPE_MRO;
    val.IdentityId = Quotes1.CustomerId > 0 ? Quotes1.CustomerId : Quotes1.IdentityId;
  }
  // console.log(val);
  var TotalValue = parseFloat(val.TotalValue).toFixed(2);
  var sql = `insert into tbl_quotes(QuoteNo,SubmittedDate,ApprovedDate,QuoteType,MROId,RRId,RRNo,IdentityType,IdentityId,RRVendorId,VendorId,CustomerBillToId,CustomerShipToId,Description,QuoteDate,CompanyName,FirstName,LastName,Email,TaxType,TermsId,Notes,AddressId,TotalValue,ProcessFee,TaxPercent,TotalTax,Discount,ShippingFee,GrandTotal,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal,Created,CreatedBy,Status,QuoteCustomerStatus,RouteCause,LeadTime,WarrantyPeriod,CreatedByLocation) 
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [val.QuoteNo, val.SubmittedDate, val.ApprovedDate, val.QuoteType, val.MROId, val.RRId,
  val.RRNo, val.IdentityType, val.IdentityId, val.RRVendorId, val.VendorId, val.CustomerBillToId, val.CustomerShipToId, val.Description, val.Created
    , val.CompanyName, val.FirstName, val.LastName, val.Email, val.TaxType, val.TermsId, val.Notes
    , val.AddressId, TotalValue, val.ProcessFee, val.TaxPercent, val.TotalTax, val.Discount
    , val.ShippingFee, val.GrandTotal, val.LocalCurrencyCode, val.ExchangeRate, val.BaseCurrencyCode, val.BaseGrandTotal
    , val.Created
    , val.CreatedBy, val.Status, val.QuoteCustomerStatus, val.RouteCause, val.LeadTime, val.WarrantyPeriod, val.CreatedByLocation]
  //console.log(sql);
  //console.log("CreateQuotes :" + values);
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;

  });
};

Quotes.UpdateCustomerQuote = (obj, result) => {
  var sql = ``;
  sql = `UPDATE tbl_quotes SET 
    RouteCause = ?, TotalValue=?, ProcessFee = ?,TaxPercent=?, TotalTax = ?, 
     LocalCurrencyCode = ?, ExchangeRate = ?,BaseCurrencyCode = ? ,BaseGrandTotal = ?,
    Discount = ?, ShippingFee = ?,GrandTotal = ? ,WarrantyPeriod = ?,LeadTime = ? ,
    Modified = ?,ModifiedBy = ? WHERE QuoteId = ?`;
  var values = [

    obj.RouteCause, obj.TotalValue, obj.ProcessFee, obj.TaxPercent, obj.TotalTax,
    obj.LocalCurrencyCode, obj.ExchangeRate, obj.BaseCurrencyCode, obj.BaseGrandTotal,
    obj.Discount, obj.ShippingFee, obj.GrandTotal, obj.WarrantyPeriod, obj.LeadTime,
    obj.Modified, obj.ModifiedBy, obj.QuoteId
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
    result(null, { id: obj.QuoteId, ...obj });
  }
  );
};


Quotes.UpdateAddressIdByQuoteId = (obj, result) => {
  var sql = ``;
  sql = `UPDATE tbl_quotes SET 
    AddressId = ? WHERE QuoteId = ?`;
  var values = [

    obj.AddressId, obj.QuoteId
  ]
  //console.log("val :" + values);
  con.query(sql, values, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {

      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: obj.QuoteId, ...obj });
  }
  );
};



Quotes.UpdateQuotes = (obj, result) => {

  var sql = ``;

  sql = `UPDATE tbl_quotes SET 
    QuoteNo = ?, QuoteType = ?,RRId = ?, IdentityType = ?, IdentityId = ?,Description = ?, 
    QuoteDate = ?, CompanyName = ?,FirstName = ?, LastName = ? ,TaxType = ?, 
    TermsId = ?, Notes = ?,AddressId = ?, TotalValue = ?, ProcessFee = ?,TaxPercent= ?, TotalTax = ?, 
    Discount = ?, ShippingFee = ?,GrandTotal = ?, 
    LocalCurrencyCode = ?, ExchangeRate = ?,BaseCurrencyCode = ?,BaseGrandTotal = ?, 
    Status = ?, CustomerBillToId = ?,CustomerShipToId = ?,Modified = ?,ModifiedBy = ? 
    WHERE QuoteId = ?`;

  var values = [
    obj.QuoteNo, obj.QuoteType, obj.RRId, obj.IdentityType,
    obj.IdentityId, obj.Description, obj.QuoteDate, obj.CompanyName,
    obj.FirstName, obj.LastName, obj.TaxType, obj.TermsId,
    obj.Notes, obj.AddressId, obj.TotalValue, obj.ProcessFee, obj.TaxPercent,
    obj.TotalTax, obj.Discount, obj.ShippingFee, obj.GrandTotal,
    obj.LocalCurrencyCode, obj.ExchangeRate, obj.BaseCurrencyCode, obj.BaseGrandTotal,
    obj.Status, obj.CustomerBillToId, obj.CustomerShipToId, obj.Modified, obj.ModifiedBy, obj.QuoteId
  ]

  //console.log("Quote Update :" + sql, values)
  con.query(sql, values, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: obj.QuoteId, ...obj });
    return;
  }
  );
};


Quotes.GetAcceptVendors = (Quotes, result) => {
  // var sql = `Select rv.*,rr.*,tc.*, ifnull(EXR.ExchangeRate,1) as exExchangeRate  from tbl_repair_request_vendors rv 
  //   inner join tbl_repair_request rr on rr.RRId=rv.RRId
  //   inner join tbl_customers tc on tc.CustomerId=rr.CustomerId
  //   LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = rv.LocalCurrencyCode AND EXR.TargetCurrencyCode = tc.CustomerCurrencyCode AND  (CURDATE() between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0    
  //   where rv.IsDeleted=0 and rv.Status=2 and rv.RRId=${Quotes.RRId}`;
  var sql = `Select rv.*,rr.*,tc.*, EXR.ExchangeRate as exExchangeRate  from tbl_repair_request_vendors rv 
    inner join tbl_repair_request rr on rr.RRId=rv.RRId
    inner join tbl_customers tc on tc.CustomerId=rr.CustomerId
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = rv.LocalCurrencyCode AND EXR.TargetCurrencyCode = tc.CustomerCurrencyCode AND  (CURDATE() between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0    
    where rv.IsDeleted=0 and rv.Status=2 and rv.RRId=${Quotes.RRId}`;
  // LEFT Join tbl_repair_request_notes rn on rn.IdentityId=rv.RRId and rn.IdentityType=2
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

Quotes.GetAcceptVendorsByRRVendorId = (Quotes, result) => {
  // var sql = `Select rv.*,rr.*,tc.*, ifnull(EXR.ExchangeRate,1) as exExchangeRate  from tbl_repair_request_vendors rv 
  //   inner join tbl_repair_request rr on rr.RRId=rv.RRId
  //   inner join tbl_customers tc on tc.CustomerId=rr.CustomerId
  //   LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = rv.LocalCurrencyCode AND EXR.TargetCurrencyCode = tc.CustomerCurrencyCode AND  (CURDATE() between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0    
  //   where rv.IsDeleted=0 and rv.Status=2 and rv.RRId=${Quotes.RRId}`;
  var sql = `Select rv.*,rr.*,tc.*, EXR.ExchangeRate as exExchangeRate  from tbl_repair_request_vendors rv 
    inner join tbl_repair_request rr on rr.RRId=rv.RRId
    inner join tbl_customers tc on tc.CustomerId=rr.CustomerId
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = rv.LocalCurrencyCode AND EXR.TargetCurrencyCode = tc.CustomerCurrencyCode AND  (CURDATE() between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0    
    where rv.IsDeleted=0 and rv.Status=2 and rv.RRVendorId=${Quotes.RRVendorId}`;
  // LEFT Join tbl_repair_request_notes rn on rn.IdentityId=rv.RRId and rn.IdentityType=2
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

Quotes.GetAcceptQuotesInfoByRRId = (Quotes, result) => {
  var sql = `SELECT tq.QuoteId,tq.QuoteNo,tq.QuoteType,tq.RRId,tq.RRNo,tq.IdentityType,tq.IdentityId,tq.RRVendorId
    ,tq.VendorId,CustomerBillToId,tq.CustomerShipToId,tq.RouteCause,tq.Description,tq.QuoteDate,
    tq.CompanyName,FirstName,tq.LastName,tq.Email,tq.TaxType,tq.TermsId,tq.Notes,tq.AddressId,tq.TotalValue
    ,tq.ProcessFee,tq.TaxPercent,tq.TotalTax,tq.
    Discount,tq.ShippingFee,tq.GrandTotal,tq.Status,tq.QuoteCustomerStatus
    ,tq.QuoteRejectedType,tq.Created,tq.LocalCurrencyCode,tq.ExchangeRate,tq.BaseCurrencyCode,tq.BaseGrandTotal, 
    tqi.ItemTaxPercent,tqi.ItemLocalCurrencyCode,tqi.ItemExchangeRate,tqi.ItemBaseCurrencyCode,tqi.BasePrice,
    tq.Modified,tq.TimeUpdated,tq.CreatedBy,tq.ModifiedBy,tq.IsDeleted,tq.LeadTime
    ,tq.WarrantyPeriod,tq.IsEmailSent
    ,tqi.QuoteItemId,tqi.QuoteId,tqi.PartId,tqi.PartNo,tqi.PartDescription,tqi.SerialNo,tqi.LeadTime,tqi.
    Quantity,tqi.Rate,tqi.Tax,tqi.Discount,tqi.Price,tqi.Created,tqi.Modified,tqi.TimeUpdated,tqi.CreatedBy,tqi.ModifiedBy,tqi.IsDeleted,tqi.BaseRate,tqi.BaseTax
    FROM ahoms.tbl_quotes tq 
    Inner Join ahoms.tbl_quotes_item tqi on tq.QuoteId=tqi.QuoteId
    where tq.IsDeleted=0 and tqi.IsDeleted=0 and tq.QuoteCustomerStatus=2 and tq.RRId=${Quotes.RRId}`;
  // LEFT Join tbl_repair_request_notes rn on rn.IdentityId=rv.RRId and rn.IdentityType=2
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

Quotes.GetAcceptVendorQuotesInfoByQuoteId = (Quotes, result) => {
  var sql = `SELECT vq.AdditionalCharge,vq.QuoteId,q.RRNo, vq.VendorId, v.TermsId, q.Notes, vq.SubTotal as TotalValue, vq.TaxPercent, vq.TotalTax, vq.Discount,
  q.LocalCurrencyCode,q.ExchangeRate,q.BaseCurrencyCode,q.BaseGrandTotal,
vq.Shipping, vq.GrandTotal, q.RouteCause, vq.LeadTime, vq.WarrantyPeriod,rrv.VendorRefNo,
vq.LocalCurrencyCode,vq.ExchangeRate,vq.BaseCurrencyCode,vq.BaseGrandTotal,
q.LocalCurrencyCode as QLocalCurrencyCode,q.BaseCurrencyCode as QBaseCurrencyCode,rrv.VendorShipIdLocked
FROM tbl_vendor_quote vq
Left Join tbl_quotes q on q.QuoteId = vq.QuoteId
Left Join tbl_repair_request_vendors rrv on rrv.RRVendorId = q.RRVendorId
left join tbl_vendors as v On v.VendorId = vq.VendorId
where vq.IsDeleted = 0 and q.IsDeleted = 0 and vq.QuoteId=${Quotes.QuoteId} `;
  //sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
};

Quotes.GetQuoteInfoById = (QuoteId, result) => {
  var sql = `Select * from tbl_quotes
    where IsDeleted=0 and  QuoteId=${QuoteId}`;
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

Quotes.GetQuoteShipLockInfoById = (QuoteId, result) => {
  var sql = `Select CustomerShipIdLocked from tbl_quotes
    where IsDeleted=0 and  QuoteId=${QuoteId}`;
  return sql;
};


Quotes.UpdateQuotesCodeByQuoteId = (Quotes, result) => {

  var sql = ``;

  sql = `UPDATE tbl_quotes  SET   QuoteNo=CONCAT('QT',${Quotes.QuoteId})  WHERE QuoteId = ${Quotes.QuoteId}`;

  // console.log(sql);
  con.query(sql, (err, res) => {

    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: Quotes.QuoteId, ...Quotes });
    return;
  }
  );

};
Quotes.UpdateQuoteDate = (QuoteDate, QuoteId, result) => {
  var sql = `UPDATE tbl_quotes  SET   QuoteDate='${QuoteDate}'  WHERE QuoteId = ${QuoteId}`;
  //console.log(sql);
  return sql;
};

Quotes.UpdateQuoteMROId = (MROId, QuoteId, result) => {
  var sql = `UPDATE tbl_quotes SET MROId='${MROId}' WHERE QuoteId = ${QuoteId}`;
  //console.log(sql);
  return sql;
};

Quotes.UpdateSumOfValue = (Quotes, result) => {
  // console.log("UpdateSumOfValue");
  //console.log(Quotes);
  var TotalValue = Quotes.TotalValue + Quotes.ProcessFee + Quotes.TotalTax + Quotes.ShippingFee;

  var GrandTotal = TotalValue - Quotes.Discount;

  var BaseGrandTotal = Quotes.BaseGrandTotal ? Quotes.BaseGrandTotal : 0;

  // var BaseGrandTotal = Quotes.BaseGrandTotal;

  var sql = `UPDATE tbl_quotes  SET TotalValue='${Quotes.TotalValue}',GrandTotal='${GrandTotal}', BaseGrandTotal='${BaseGrandTotal}' WHERE QuoteId = ${Quotes.QuoteId}`;

  //console.log(sql);
  con.query(sql, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: Quotes.QuoteId, ...Quotes });
    return;
  }
  );

};


Quotes.ViewByRRId = (RRId, result) => {
  var sql = `Select * from tbl_quotes tq
  left JOIN tbl_repair_request rr on rr.RRId=tq.RRId
  where tq.IsDeleted=0 and tq.RRId=${RRId}`;

  return sql;
};

Quotes.ViewByRRIdAndQuoteId = (RRId, QuoteId, result) => {
  var sql = `Select * from tbl_quotes tq
  left JOIN tbl_repair_request rr on rr.RRId=tq.RRId
  where tq.IsDeleted=0 and tq.RRId=${RRId} and tq.QuoteId=${QuoteId}`;

  return sql;
};

Quotes.GetRRQuoteQuery = (RRId, result) => {
  var sql = `Select q.*,CASE QuoteRejectedType
 WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}'
 WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}'
 WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}'
 WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}'
 WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}'
 WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}'
 WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}'
 WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
 ELSE '-'	end QuoteRejectedTypeName, CUR.CurrencySymbol as CurrencySymbol, CUR.CurrencySymbol as BaseCurrencySymbol,
 ROUND(ifnull(q.GrandTotal,0),2) as GrandTotal,ROUND(ifnull(q.TotalValue,0),2) as TotalValue,ROUND(ifnull(q.BaseGrandTotal,0),2) as BaseGrandTotal,
 CURC.CurrencySymbol as CustomerCurrencySymbol,c.CustomerCurrencyCode,q.CustomerShipIdLocked
 from tbl_quotes as q
 LEFT JOIN tbl_customers c on c.CustomerId=q.IdentityId and q.IdentityType=1
 LEFT JOIN tbl_currencies as CURC  ON CURC.CurrencyCode = c.CustomerCurrencyCode AND CURC.IsDeleted = 0
 LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = q.LocalCurrencyCode AND CUR.IsDeleted = 0
 LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = q.BaseCurrencyCode AND CURB.IsDeleted = 0
 where q.IsDeleted=0 and q.RRId=${RRId}`;
  //console.log("sql=" + sql)
  return sql;
};

Quotes.GetRRSubmittedQuoteQuery = (RRId, result) => {
  var sql = `Select q.*,CASE QuoteRejectedType
 WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}'
 WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}'
 WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}'
 WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}'
 WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}'
 WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}'
 WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}'
 WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
 ELSE '-'	end QuoteRejectedTypeName, CUR.CurrencySymbol
 from tbl_quotes q
 LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = q.LocalCurrencyCode AND CUR.IsDeleted = 0
 where q.IsDeleted=0 and (q.Status=4 OR q.Status=1)  and q.QuoteCustomerStatus=1  and q.RRId=${RRId}`;
  // console.log("sql=" + sql)
  return sql;
};
Quotes.GetRRRejectedQuoteQuery = (RRId, result) => {
  var sql = `Select q.*,CASE QuoteRejectedType
 WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}'
 WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}'
 WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}'
 WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}'
 WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}'
 WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}'
 WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}'
 WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
 ELSE '-'	end QuoteRejectedTypeName,CUR.CurrencySymbol
 from tbl_quotes q
 LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = q.LocalCurrencyCode AND CUR.IsDeleted = 0
 where q.IsDeleted=0 and q.status=${Constants.CONST_QUOTE_STATUS_CANCELLED}
 and q.QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_REJECTED}  and q.RRId=${RRId}`;
  // console.log("sql=" + sql)
  return sql;
};
Quotes.GetRRApprovedQuoteQuery = (RRId, result) => {
  var sql = `Select q.*,v.VendorName,IF(rr.Status=${Constants.CONST_RRS_COMPLETED},rr.RRCompletedDate,'') CompletedDate, CUR.CurrencySymbol
  from tbl_quotes q
  Left Join tbl_vendors v on v.VendorId=q.VendorId
  Left Join tbl_repair_request rr on rr.RRId=q.RRId
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = q.LocalCurrencyCode AND CUR.IsDeleted = 0
  where q.IsDeleted=0 and q.QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED} AND q.RRId=${RRId}`;
  return sql;
};

Quotes.GetRRRejectedQuoteQueryforQuplicate = (RRId, result) => {
  var sql = `Select q.*,v.VendorName 
  from tbl_quotes q
  Left Join tbl_vendors v on v.VendorId=q.VendorId
  Left Join tbl_repair_request rr on rr.RRId=q.RRId
  where q.IsDeleted=0 and q.QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_REJECTED} AND q.RRId=${RRId}`;
  // console.log(sql);
  return sql;
};

Quotes.ResetUpdateQuotesStatus = (ReqBody, result) => {
  var QuoteObj = new Quotes({
    RRId: ReqBody.RRId,
    QuoteId: ReqBody.QuoteId,
    QuoteCustomerStatus: ReqBody.QuoteCustomerStatus
  });
  var sql = `UPDATE tbl_quotes  SET QuoteCustomerStatus='${QuoteObj.QuoteCustomerStatus}', Modified='${QuoteObj.Modified}', ModifiedBy='${QuoteObj.ModifiedBy}' WHERE QuoteId = ${QuoteObj.QuoteId}`;

  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    /*if (res.affectedRows == 0) {        
      result({ kind: "not_found" }, null);
      return;
    }*/
    result(null, { id: QuoteObj.QuoteId, ...QuoteObj });
    return;
  }
  );
};

Quotes.UpdateQuotesStatus = (QuoteObj, result) => {
  var sql = `UPDATE tbl_quotes  SET Status='${QuoteObj.Status}', QuoteCustomerStatus='${QuoteObj.QuoteCustomerStatus}', 
  Modified='${QuoteObj.Modified}', 
  ModifiedBy='${QuoteObj.ModifiedBy}' WHERE QuoteId = ${QuoteObj.QuoteId}`;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    /*if (res.affectedRows == 0) {        
      result({ kind: "not_found" }, null);
      return;
    }*/
    result(null, { id: QuoteObj.QuoteId, ...QuoteObj });
    return;
  }
  );
};
//

Quotes.UpdateQuoteCustomerStatus = (QuoteObj, result) => {
  var sql = `UPDATE tbl_quotes  SET 
  QuoteCustomerStatus ='${Constants.CONST_CUSTOMER_QUOTE_DRAFT}' , Modified='${QuoteObj.Modified}',
  ModifiedBy='${QuoteObj.ModifiedBy}' WHERE IsDeleted = 0 AND RRId = ${QuoteObj.RRId} 
  AND QuoteCustomerStatus = '${Constants.CONST_CUSTOMER_QUOTE_SUBMITTED}'`;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }

    result(null, QuoteObj);
    return;
  }
  );
};
Quotes.UpdateQuoteSubmittedDate = (QuoteObj, result) => {
  QuoteObj.Modified = QuoteObj.SubmittedDate == null ? QuoteObj.Modified : QuoteObj.SubmittedDate;
  var sql = `UPDATE tbl_quotes  SET SubmittedDate='${QuoteObj.Modified}', Modified='${QuoteObj.Modified}', ModifiedBy='${QuoteObj.ModifiedBy}' WHERE QuoteId = ${QuoteObj.QuoteId}`;

  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return result(err, null);
    }
    return result(null, { id: QuoteObj.QuoteId, ...QuoteObj });
  });
};

Quotes.UpdateQuoteApprovedDate = (QuoteObj, result) => {
  QuoteObj.Modified = QuoteObj.ApprovedDate == null ? QuoteObj.Modified : QuoteObj.ApprovedDate;
  var sql = `UPDATE tbl_quotes SET ApprovedDate='${QuoteObj.Modified}', Modified='${QuoteObj.Modified}', ModifiedBy='${QuoteObj.ModifiedBy}' WHERE QuoteId = ${QuoteObj.QuoteId}`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { id: QuoteObj.QuoteId, ...QuoteObj });
  });
};
Quotes.LockShipAddress = (reqbody, result) => {
  var QuoteObj = new Quotes(reqbody);
  var sql = `UPDATE tbl_quotes SET CustomerShipIdLocked='${QuoteObj.CustomerShipIdLocked}', 
            IsMoveToStore='${QuoteObj.IsMoveToStore}'  WHERE QuoteId = ${QuoteObj.QuoteId}`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { id: QuoteObj.QuoteId, ...QuoteObj });
  });
};



Quotes.UpdateQuotesStatusToQuoted = (QuoteObj, result) => {

  var sql = `UPDATE tbl_quotes  SET Status='${QuoteObj.Status}' , Modified='${QuoteObj.Modified}', ModifiedBy='${QuoteObj.ModifiedBy}' WHERE IsDeleted = 0 AND RRId = ${QuoteObj.RRId} AND QuoteId != ${QuoteObj.QuoteId}`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    /*if (res.affectedRows == 0) {        
      result({ kind: "not_found" }, null);
      return;
    }*/
    result(null, { id: QuoteObj.QuoteId, ...QuoteObj });
    return;
  }
  );
};

Quotes.UpdateQuotesRejectStatus = (ReqBody, result) => {
  var QuoteObj = new Quotes({
    authuser: ReqBody.authuser,
    RRId: ReqBody.RRId,
    QuoteId: ReqBody.QuoteId,
    QuoteCustomerStatus: ReqBody.QuoteCustomerStatus,
    QuoteRejectedType: ReqBody.QuoteRejectedType
  });
  var sql = `UPDATE tbl_quotes  SET Status = ${Constants.CONST_QUOTE_STATUS_CANCELLED}, QuoteRejectedType='${QuoteObj.QuoteRejectedType}',QuoteCustomerStatus='${QuoteObj.QuoteCustomerStatus}', Modified='${QuoteObj.Modified}', ModifiedBy='${QuoteObj.ModifiedBy}' WHERE QuoteId = ${QuoteObj.QuoteId}`;

  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: Quotes.QuoteId, ...Quotes });
    return;
  }
  );
};



Quotes.submitQuoteToCustomer = (reqBody, result) => {
  if (reqBody.hasOwnProperty('RRId')) {
    Quotes.GetAcceptVendorsByRRVendorId(new Quotes(reqBody), (err, Quotedata) => {
      if (Quotedata[0].exExchangeRate == null || Quotedata[0].exExchangeRate == '' || Quotedata[0].exExchangeRate == undefined || Quotedata[0].exExchangeRate == 0) {
        result({ msg: "Exchange-rate is not available. Please contact admin!." }, null);
        return;
      } else {

        var sql = `Select Status from tbl_quotes
    where IsDeleted=0 and  QuoteId=${reqBody.QuoteId}`;
        //sql);
        con.query(sql, (err1, res1) => {
          if (err1) {
            result(err1, null);
            return;
          }
          if (res1[0].Status == Constants.CONST_QUOTE_STATUS_DRAFT) {
            // result({msg:"Cannot send a DRAFT quote to customer. Review the quote and change the status to OPEN before send a quote to customer"}, null); 
            //return;
          }

          var RRStatusHistoryObj = new RRStatusHistory({
            authuser: reqBody.authuser,
            RRId: reqBody.RRId,
            HistoryStatus: Constants.CONST_RRS_QUOTE_SUBMITTED
          });

          reqBody.Status = Constants.CONST_RRS_QUOTE_SUBMITTED;


          var QuoteObj = new Quotes({
            authuser: reqBody.authuser,
            RRId: reqBody.RRId,
            QuoteId: reqBody.QuoteId,
            Status: Constants.CONST_QUOTE_STATUS_SUBMITTED,
            QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_SUBMITTED
          });

          //To add a quote to notification table
          var NotificationObj = new NotificationModel({
            authuser: reqBody.authuser,
            RRId: reqBody.RRId,
            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
            NotificationIdentityId: reqBody.QuoteId,
            NotificationIdentityNo: 'QT' + reqBody.QuoteId,
            ShortDesc: 'Customer Quote Submitted',
            Description: 'Customer Quote Submitted to Customer  by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
          });


          async.parallel([
            function (result) { Quotes.UpdateQuoteCustomerStatus(QuoteObj, result); },
            function (result) { Quotes.ChangeRRStatusNew(reqBody, result); },
            function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
            function (result) { CQFollowUp.GetCustomerQuoteFollowUp(reqBody, result); },
            function (result) { NotificationModel.Create(NotificationObj, result); },
            function (result) { Quotes.UpdateQuoteSubmittedDate(QuoteObj, result); },
            function (result) { Quotes.UpdateQuotesStatus(QuoteObj, result); },
          ],
            function (err, results) {
              if (err) {
                console.log(err);
                result(err, null);
                return;
              }
              result(null, results[3][0]);
              return;

            }
          );

        });
      }
    });

  } else {
    result({ msg: "RR not found" }, null);
    return;
  }

};




Quotes.ChangeRRStatusNewQuery = (ReqBody, result) => {
  var RRObj = new Quotes({
    authuser: ReqBody.authuser,
    RRId: ReqBody.RRId,
    Status: ReqBody.Status
  });
  var sql = `UPDATE tbl_repair_request  SET Status=${RRObj.Status},Modified='${RRObj.Modified}',ModifiedBy='${RRObj.ModifiedBy}'  WHERE RRID = ${RRObj.RRId}`;
  return sql;
};


Quotes.ChangeRRStatusNew = (ReqBody, result) => {

  var RRObj = new Quotes({
    authuser: ReqBody.authuser,
    RRId: ReqBody.RRId,
    Status: ReqBody.Status,
    QuoteRejectedType: ReqBody.QuoteRejectedType
  });

  var sql = `UPDATE tbl_repair_request SET Status=?,RejectedStatusType=?,Modified=?,ModifiedBy=?  WHERE RRID = ?`;
  var values = [RRObj.Status, RRObj.QuoteRejectedType, RRObj.Modified, RRObj.ModifiedBy, RRObj.RRId];
  //console.log("update status sql" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    result(null, { Status: RRObj.Status });
    return;
  });
};



Quotes.ConvertedQuoteToSO = (QuoteId, result) => {
  var QuoteObj = new Quotes({
    QuoteId: QuoteId,
    Status: Constants.CONST_QUOTE_STATUS_APPROVED
  });
  var sql = `UPDATE tbl_quotes  SET Status='${QuoteObj.Status}', Modified='${QuoteObj.Modified}', ModifiedBy='${QuoteObj.ModifiedBy}' WHERE QuoteId = ${QuoteObj.QuoteId}`;

  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: QuoteObj.QuoteId, ...QuoteObj });
    return;
  }
  );
};



Quotes.ChangeRRStatusWithPo = (ReqBody, result) => {

  var RRObj = new Quotes({
    authuser: ReqBody.authuser,
    RRId: ReqBody.RRId,
    Status: ReqBody.Status
  });
  RRObj.CustomerPONo = ReqBody.CustomerPONo ? ReqBody.CustomerPONo : '';

  var sql = `UPDATE tbl_repair_request  SET Status=?,CustomerPONo=?,Modified=?,ModifiedBy=?  WHERE RRID = ?`;
  var values = [RRObj.Status, RRObj.CustomerPONo, RRObj.Modified, RRObj.ModifiedBy, RRObj.RRId];
  //console.log("update status sql" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    /* if (res.affectedRows == 0) {        
       result({ msg: "Status Not updated" }, null);
       return;
     }*/
    result(null, { Status: RRObj.Status });
    return;
  }
  );
};


Quotes.UpdateCustomerBlanketPOIdToRR = (ReqBody, result) => {

  var sql = `UPDATE tbl_repair_request  SET CustomerBlanketPOId=?  WHERE RRID = ?`;
  var values = [ReqBody.CustomerBlanketPOId > 0 ? ReqBody.CustomerBlanketPOId : 0, ReqBody.RRId];
  // console.log("update status sql" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, ReqBody);
    return;
  }
  );
};

Quotes.rejectCustomerQuote = (reqBody, result) => {
  if (reqBody.hasOwnProperty('RRId')) {

    /* var RRObj = new RR({     
       RRId : reqBody.RRId,
       Status : Constants.CONST_RRS_QUOTE_REJECTED
     }); 
   */
    reqBody.Status = Constants.CONST_RRS_QUOTE_REJECTED;

    var RRStatusHistoryObj = new RRStatusHistory({
      authuser: reqBody.authuser,
      RRId: reqBody.RRId,
      HistoryStatus: Constants.CONST_RRS_QUOTE_REJECTED
    });

    reqBody.QuoteCustomerStatus = Constants.CONST_CUSTOMER_QUOTE_REJECTED;


    //To add a quote to notification table
    var NotificationObj = new NotificationModel({
      authuser: reqBody.authuser,
      RRId: reqBody.RRId,
      NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
      NotificationIdentityId: reqBody.QuoteId,
      NotificationIdentityNo: 'QT' + reqBody.QuoteId,
      ShortDesc: 'Customer Quote Rejected',
      Description: 'Admin (' + global.authuser.FullName + ') Rejected the Customer Quote on ' + cDateTime.getDateTime()
    });


    async.parallel([
      function (result) { Quotes.UpdateQuotesRejectStatus(reqBody, result); },
      function (result) { Quotes.ChangeRRStatusNew(reqBody, result); },
      function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
      function (result) { NotificationModel.Create(NotificationObj, result); },
      function (result) { Quotes.RRVendorQuoteRejected(reqBody, result); }
    ],
      function (err, results) {
        if (err) {
          result(err, null);
          return;
        }


        result(null, { data: results[0][0], ...reqBody });
        return;

      }
    );
  } else {
    result({ msg: "RR not found" }, null);
    return;
  }
};


Quotes.RRVendorQuoteRejected = (Reqbody, result) => {
  var sql = `Update  tbl_repair_request_vendors set Status=?,Modified=?,ModifiedBy=? where RRVendorId=? `;
  var values = [Constants.CONST_VENDOR_STATUS_REJECTED, cDateTime.getDateTime(), global.authuser.UserId, Reqbody.RRVendorId];
  //console.log("C=" + values);
  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "Not_found" }, null);
      return;
    }
    result(null, res);
    return;

  });
};

Quotes.GetEmailContentForQuoteWithoutQuoteId = (Quote, result) => {
  var sql = `SELECT 0 as IdentityId,'${Constants.CONST_IDENTITY_TYPE_QUOTE}' as IdentityType,
  T.Subject as Subject,
  T.Content as Content, GS.AppEmail,GS.AppCCEmail
  from tbl_email_template T 
  LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
  where T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_CUSTOMER_QUOTE_BULK}' `;

  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length > 0) { // make sure there is at least one row
      var FollowUpObj = {
        FromEmail: res[0].AppEmail,
        ToEmail: '',
        CC: '',
        Subject: res[0].Subject,
        Message: res[0].Content,
        IdentityId: res[0].IdentityId,
        IdentityType: res[0].IdentityType,
      };
      result(null, FollowUpObj);
      return;
    }
    return result({ msg: "Quote not found" }, null);
  });
}

Quotes.GetEmailContentForQuote = (Quote, result) => {

  var sql = `SELECT q.QuoteId as IdentityId,'${Constants.CONST_IDENTITY_TYPE_QUOTE}' as IdentityType,
  REPLACE(T.Subject,'{PartNo}',qi.PartNo)as Subject,
  REPLACE(T.Content,'{PartNo}',qi.PartNo)as Content,q.QuoteNo,q.Email , GS.AppEmail,GS.AppCCEmail
  from tbl_quotes q 
  LEFT JOIN tbl_quotes_item qi on qi.QuoteId=q.QuoteId
  LEFT JOIN tbl_email_template T on T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_CUSTOMER_QUOTE}' 
  LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
  where q.QuoteId=${Quote.IdentityId}`;

  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res && res.length > 0) { // Check if res is defined and it has at least one row
      var FollowUpObj = {
        FromEmail: res[0].AppEmail,
        ToEmail: res[0].Email,
        CC: res[0].AppCCEmail,
        Subject: res[0].Subject,
        Message: res[0].Content,
        IdentityId: res[0].IdentityId,
        IdentityType: res[0].IdentityType,
      };
      result(null, FollowUpObj);
      return;
    }
    return result({ msg: "Quote not found" }, null);
  });
}

Quotes.SendEmailToCustomerQuoteByQuteId = (QuoteList, result) => {


  for (let val of QuoteList) {
    var EmailTemplate = '';
    if (val.RRId)
      EmailTemplate = Constants.CONST_EMAIL_TEMPLETE_TYPE_CUSTOMER_QUOTE
    if (val.MROId)
      EmailTemplate = Constants.CONST_EMAIL_TEMPLETE_TYPE_MRO_CUSTOMER_QUOTE

    var sql = `SELECT REPLACE(et.Subject,'{PartNo}',qi.PartNo)as Subject
  ,REPLACE(et.Content,'{PartNo}',qi.PartNo)as Content,tq.Email 
  FROM tbl_quotes tq
  LEFT JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId
  Left JOIN tbl_email_template et on et.TemplateType='${EmailTemplate}'
  where tq.QuoteId=${val.QuoteId}`;

    // console.log("val " + sql);
    con.query(sql, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      // console.log("Len :" + res[0].Email);
      if (res.length > 0 && res[0].Email != "" && res[0].Email != null) {
        let HelperOptions = {
          from: Constants.CONST_AH_FROM_EMAIL_ID,
          to: res[0].Email,
          subject: res[0].Subject,
          text: res[0].Content
        };

        gmailTransport.sendMail(HelperOptions, (error, info) => {
          if (error) {
            // console.log(error);
          }
          if (!error) {
            var sql = Quotes.UpdateIsEmailSent(val.QuoteId);
            // console.log("sql=" + sql)
            con.query(sql, (err, res) => {
              if (err) {
                return result(err, null);
              }
            });
          }
        });
      }

    });
  }
  result(null, QuoteList);
  return;
};

//To Update IsEmailSent
Quotes.UpdateIsEmailSent = (QuoteId) => {
  var sql = ``;
  sql = `Update tbl_quotes SET IsEmailSent='1' WHERE IsDeleted=0 and QuoteId='${QuoteId}'`;
  return sql;
}

// To delete Quote
Quotes.remove = (id, result) => {
  var check = `Select SOId from tbl_sales_order where QuoteId=${id} AND IsDeleted=0 `;
  con.query(check, (checkErr, checkRes) => {
    if (checkRes.length === 0) {
      var sql = `Update tbl_quotes set IsDeleted=1,Modified='${cDateTime.getDateTime()}',ModifiedBy = '${global.authuser.UserId}' WHERE QuoteId = ? `;
      con.query(sql, id, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ kind: "Quote not deleted" }, null);
          return;
        }
        result(null, res);
      });
    } else {
      return result({ msg: "This Quotes have SO. Please delete the SO first." }, null);
    }

  });
};
//
Quotes.DeleteQuotesQuery = (RRId) => {
  var Obj = new Quotes({ RRId: RRId });
  var sql = `UPDATE tbl_quotes SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE IsDeleted = 0 AND RRId>0 AND RRId=${Obj.RRId}`;
  //  console.log(sql);
  return sql;
}
//To Export To Excel Data
Quotes.ExportToExcel = (reqBody, result) => {

  var obj = new Quotes(reqBody);
  var Ids = ``;
  for (let val of reqBody.Quote) {
    Ids += val.QuoteId + `,`;
  }
  var QuoteIds = Ids.slice(0, -1);
  var sql = ` SELECT 
  IF(q.RRId>0,q.RRNo,If(q.MROId>0,mro.MRONo,'')) RRNoOrMRONo,
  q.QuoteId,q.QuoteNo,qi.PartDescription,qi.SerialNo,c.CompanyName,rrp.Price as PON,qi.Price,v.VendorName,
  '-' as LLP,vq.GrandTotal as VendorCost,q.GrandTotal as AHCost,'-' as Comment,((qi.Price/rrp.Price)*100) as RepairVsNew
  FROM tbl_quotes q
  LEFT JOIN tbl_mro mro on mro.MROId=q.MROId and mro.IsDeleted=0 and q.MROId>0
  LEFT JOIN tbl_vendor_quote vq on vq.QuoteId=q.QuoteId
  LEFT JOIN tbl_vendors v on v.VendorId=q.VendorId
  LEFT JOIN tbl_customers c on c.CustomerId=q.IdentityId and q.IdentityType=1
  LEFT JOIN tbl_quotes_item qi on qi.QuoteId=q.QuoteId
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRPartsId=qi.PartId
  where q.IsDeleted=0 `;
  if (obj.RRNo != "") {
    sql += " and ( q.RRNo ='" + obj.RRNo + "' ) ";
  }
  if (obj.QuoteNo != "") {
    sql += " and ( q.QuoteNo ='" + obj.QuoteNo + "' ) ";
  }
  if (obj.CustomerId != "") {
    sql += " and  q.IdentityId In(" + obj.CustomerId + ") and q.IdentityType=1   ";
  }
  if (obj.Description != "") {
    sql += " and ( q.Description ='" + obj.Description + "' ) ";
  }
  if (obj.QuoteDate != null) {
    sql += " and ( q.QuoteDate >='" + obj.QuoteDate + "' ) ";
  }
  if (reqBody.hasOwnProperty("QuoteDateTo") == true && reqBody.QuoteDateTo != "") {
    sql += " and ( q.QuoteDate <='" + reqBody.QuoteDateTo + "' ) ";
  }
  if (obj.QuoteType > 0) {
    sql += " and ( q.QuoteType ='" + obj.QuoteType + "' ) ";
  }
  if (obj.Status > 0) {
    sql += " and ( q.Status ='" + obj.Status + "' ) ";
  }
  if (QuoteIds != '') {
    sql += ` and q.QuoteId in(` + QuoteIds + `)`;
  }
  // console.log("SQL=" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

// View Multiple Reports 
Quotes.ViewMultipleQuotesId = (val, reqBody, result) => {
  var ArQuoteList = [];
  //console.log("Res :"+QuoteList);
  // for(let val of QuoteList)
  // {

  //console.log("Res :" + val);
  var sqlQuotes = Quotes.viewquery(val, 0, reqBody);

  con.query(sqlQuotes, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    var sqlQuoteItem = QuoteItem.viewquery(val);
    var sqlNotes = Notes.ViewNotes(Constants.CONST_IDENTITY_TYPE_QUOTE, val);
    var sqlAttachment = AttachmentModel.ListAttachmentQuery(Constants.CONST_IDENTITY_TYPE_QUOTE, val);

    var sqlContactAddress = AddressBook.ViewContactAddressByCustomerId(res[0]["IdentityId"]);
    var sqlShipingAddress = AddressBook.GetAddressByIdQuery(res[0]["CustomerShipToId"]);
    var sqlBillingAddress = AddressBook.GetAddressByIdQuery(res[0]["CustomerBillToId"]);
    var sqlRemitToAddress = AddressBook.GetRemitToAddressIdByCustomerId(res[0]["IdentityId"]);
    async.parallel([
      function (result) { con.query(sqlQuotes, result) },
      function (result) { con.query(sqlQuoteItem, result) },
      function (result) { con.query(sqlNotes, result) },
      function (result) { con.query(sqlAttachment, result) },
      function (result) { con.query(sqlContactAddress, result) },
      function (result) { con.query(sqlShipingAddress, result) },
      function (result) { con.query(sqlBillingAddress, result) },
      function (result) { con.query(sqlRemitToAddress, result) },
    ],
      function (err, results) {
        if (err)
          return result(err, null);

        if (results[0][0].length > 0) {
          var sqlRRNotes = Notes.ViewRRCustomerNotes(Constants.CONST_IDENTITY_TYPE_RR, results[0][0][0].RRId);
          //console.log("K7 :"+sqlRRNotes);
          con.query(sqlRRNotes, (err, res) => {
            var temparray = [];

            temparray.push(
              {
                BasicInfo: results[0][0], QuoteItem: results[1][0], NotesList: results[2][0], AttachmentList: results[3][0], ContactAddress: results[4][0], ShippingAddress: results[5][0], BillingAddress: results[6][0], RRNotesList: res, RemitToAddress: results[7][0][0]
              }
            );
            //console.log({BasicInfo:results[0][0], QuoteItem: results[1][0], NotesList: results[2][0], AttachmentList: results[3][0],ContactAddress:results[4][0],ShippingAddress:results[5][0],BillingAddress:results[6][0],RRNotesList: res});
            //result(null, {BasicInfo:results[0][0], QuoteItem: results[1][0], NotesList: results[2][0], AttachmentList: results[3][0],ContactAddress:results[4][0],ShippingAddress:results[5][0],BillingAddress:results[6][0],RRNotesList: res});
            // console.log(temparray[0]);
            return result(null, temparray);

            //console.log("temp : "+temparray[0].res[0]);
            //ArQuoteList.push(temparray);
            //result(null, {QuoteListInfo:temparray});
            //return; 
          });
        }

      }
    );

  });



  //}



};
//
Quotes.UpdateTaxPercent = (Taxpercent, QuoteId, result) => {
  var sql = ` UPDATE tbl_quotes SET TaxPercent='${Taxpercent}' WHERE QuoteId=${QuoteId} `;
  //console.log("sql=" + sql)
  return sql;
}
Quotes.UpdateAfterQuoteItemDeleteByQuoteId = (ObjModel, result) => {

  var Obj = new Quotes(ObjModel);
  var sql = `Update tbl_quotes set Totalvalue=?,GrandTotal=?,BaseGrandTotal=?,Modified=?,ModifiedBy=? where QuoteId=? `;
  var values = [Obj.SubTotal, Obj.GrandTotal, Obj.BaseGrandTotal, Obj.Modified, Obj.ModifiedBy, Obj.QuoteId];
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


Quotes.ViewMultipleQuotesId1 = (QuoteList, reqBody, result) => {

  var ArQuoteList = [];
  //console.log("Res :"+QuoteList);
  for (let val of QuoteList) {
    //console.log("Res :" + val);
    var sqlQuotes = Quotes.viewquery(val, 0, reqBody);

    con.query(sqlQuotes, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      var sqlQuoteItem = QuoteItem.viewquery(val);
      var sqlNotes = Notes.ViewNotes(Constants.CONST_IDENTITY_TYPE_QUOTE, val);
      var sqlAttachment = AttachmentModel.ListAttachmentQuery(Constants.CONST_IDENTITY_TYPE_QUOTE, val);

      var sqlContactAddress = AddressBook.ViewContactAddressByCustomerId(res[0]["IdentityId"]);
      var sqlShipingAddress = AddressBook.GetAddressByIdQuery(res[0]["CustomerShipToId"]);
      var sqlBillingAddress = AddressBook.GetAddressByIdQuery(res[0]["CustomerBillToId"]);
      var sqlRemitToAddress = AddressBook.GetRemitToAddressIdByCustomerId(res[0]["IdentityId"]);
      async.parallel([
        function (result) { con.query(sqlQuotes, result) },
        function (result) { con.query(sqlQuoteItem, result) },
        function (result) { con.query(sqlNotes, result) },
        function (result) { con.query(sqlAttachment, result) },
        function (result) { con.query(sqlContactAddress, result) },
        function (result) { con.query(sqlShipingAddress, result) },
        function (result) { con.query(sqlBillingAddress, result) },
        //function (result) { con.query(sqlRemitToAddress, result) },
      ],
        function (err, results) {
          if (err)
            return result(err, null);
          // console.log("Res 1 :" + val);
          if (results[0][0].length > 0) {
            var sqlRRNotes = Notes.ViewRRCustomerNotes(Constants.CONST_IDENTITY_TYPE_RR, results[0][0][0].RRId);
            //console.log("K7 :"+sqlRRNotes);
            con.query(sqlRRNotes, (err, res) => {
              var temparray = [];

              temparray.push(
                {
                  BasicInfo:
                    results[temparray.length][0]
                  //, QuoteItem: results[1][0], NotesList: results[2][0], AttachmentList: results[3][0],ContactAddress:results[4][0],ShippingAddress:results[5][0],BillingAddress:results[6][0],RRNotesList: res
                }
              );
              //console.log(temparray);
              ArQuoteList.push(temparray);
              // console.log(ArQuoteList);
              result(null, ArQuoteList[[0][0], [1][0]]);
              return;
            });
          }
        });
    });



  }

  // result(null, ArQuoteList);
  // return; 

};
//
// Quotes.UpdateQuotedToDraft = (RRId) => {
//   var sql = `Update tbl_quotes SET Status=${Constants.CONST_QUOTE_STATUS_DRAFT}, QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_DRAFT}
//    WHERE IsDeleted=0 and QuoteCustomerStatus!=${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED} AND RRId=${RRId}`;
//   console.log(sql)
//   return sql;
// }
Quotes.UpdateAcceptedQuotedToSubmitted = (RRId) => {
  var sql = `Update tbl_quotes SET  Status=${Constants.CONST_QUOTE_STATUS_SUBMITTED},
   QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_SUBMITTED}
   WHERE IsDeleted=0 and QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED} and RRId=${RRId}`;
  // console.log("UpdateAcceptedQuotedToSubmitted =" + sql)
  return sql;
}
//
Quotes.UpdateRejectToSubmitted = (RRId) => {
  var sql = `Update tbl_quotes SET Status=${Constants.CONST_QUOTE_STATUS_SUBMITTED},
  QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_SUBMITTED}
   WHERE IsDeleted=0 and QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_REJECTED} and RRId=${RRId}`;
  //console.log(sql)
  return sql;
}
//
Quotes.ResetRRVendorToApproved = (RRVendorId, result) => {
  var sql = `Update  tbl_repair_request_vendors set Status='${Constants.CONST_VENDOR_STATUS_APPROVED}',
  Modified='${cDateTime.getDateTime()}',ModifiedBy='${global.authuser.UserId}' where RRVendorId='${RRVendorId}' `;
  // console.log("sql=" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};
//
Quotes.GetRRVendor = (RRId, result) => {
  var sql = `Select Status,RRVendorId from tbl_repair_request_vendors where RRID='${RRId}' Order By RRVendorId Desc Limit 0,1  `;
  //console.log("sql=" + sql);
  return sql;
};






















// Below methods are used for MRO section :
Quotes.GetCustomerQuantity = (MROId, PartId, result) => {
  var sql = `Select qi.Quantity
from tbl_mro mro
Left Join tbl_quotes q Using(MROId)
Left Join tbl_quotes_item qi using(QuoteId)
where mro.MROId=${MROId} and qi.PartId=${PartId} `;
  // console.log("sql=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
}
Quotes.GetAcceptMROVendors = (Quotes, result) => {
  var sql = `Select * from tbl_repair_request_vendors rv
  inner join tbl_mro mro on mro.MROId=rv.MROId
  inner join tbl_customers tc on tc.CustomerId=mro.CustomerId
  where rv.IsDeleted=0 and rv.Status=2 and rv.MROId=${Quotes.MROId}`;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

//
Quotes.viewQuoteByMRO = (MROId, reqBody) => {
  var IdentityType = getLogInIdentityType(reqBody);
  var IdentityId = getLogInIdentityId(reqBody);

  var sql = `SELECT q.MROId,QuoteId,QuoteNo, Case QuoteType
  WHEN 1 THEN '${Constants.array_quotetype[1]}'
  WHEN 2 THEN '${Constants.array_quotetype[2]}'
  ELSE '-'	end QuoteTypeName,QuoteType,q.RRId,
  Case q.IdentityType
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  WHEN 2 THEN '${Constants.array_identity_type[2]}'
  ELSE '-'	end IdentityTypeName,q.IdentityType,
  q.IdentityId,q.Description,q.RRVendorId,q.VendorId,q.CustomerBillToId,q.CustomerShipToId,
  q.LocalCurrencyCode,q.ExchangeRate,q.BaseCurrencyCode, 
  ROUND(ifnull(q.BaseGrandTotal,0),2) as BaseGrandTotal,
  DATE_FORMAT(QuoteDate,'%m/%d/%Y') as QuoteDate,CompanyName,q.FirstName,q.LastName,q.Email,IsEmailSent,
  case TaxType
  WHEN 1 THEN '${Constants.array_tax_type[1]}'
  WHEN 2 THEN '${Constants.array_tax_type[2]}'
  WHEN 3 THEN '${Constants.array_tax_type[3]}'
  ELSE '-'	end TaxTypeName,TaxType,
  q.TermsId,
  t.TermsName as Terms,
  q.Notes,AddressId,TotalValue,
  ProcessFee,TotalTax,TaxPercent,q.Discount,ShippingFee,  
  ROUND(ifnull(q.GrandTotal,0),2) as GrandTotal,
  RouteCause,QuoteCustomerStatus,
  Case q.Status
  WHEN 0 THEN '${Constants.array_quote_status[0]}'
  WHEN 1 THEN '${Constants.array_quote_status[1]}'
  WHEN 2 THEN '${Constants.array_quote_status[2]}'
  WHEN 3 THEN '${Constants.array_quote_status[3]}'
  WHEN 4 THEN '${Constants.array_quote_status[4]}'
  WHEN 5 THEN '${Constants.array_quote_status[5]}'
  ELSE '-'	end StatusName,q.Status,RR.RRNo,q.LeadTime,q.WarrantyPeriod,RR.IsRushRepair,
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
  ELSE '-'	end IsRepairTagName,CONCAT(u.FirstName,' ',u.LastName) as AdminName,PhoneNo as AdminMobile, MRO.MRONo, CURL.CurrencySymbol
  FROM tbl_quotes q
  LEFT JOIN tbl_mro MRO on MRO.MROId=q.MROId
  LEFT JOIN tbl_repair_request RR on RR.RRId=q.RRId  
  LEFT JOIN tbl_terms t on q.TermsId=t.TermsId
  LEFT JOIN tbl_users u on u.UserId=q.CreatedBy
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = q.LocalCurrencyCode AND CURL.IsDeleted = 0 
  where q.IsDeleted=0 and q.MROId='${MROId}' `;
  if (IdentityType == 1) {
    sql += ` AND q.Status IN(4,1,2) AND q.IdentityId = ${IdentityId}`
  }
  //console.log(sql);
  return sql;
}
//
Quotes.findByMROId = (QuoteId, result) => {
  var sqlQuotes = Quotes.viewquery(QuoteId);
  con.query(sqlQuotes, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (!res[0]) {
      return result({ msg: "MRO Quote not found" }, null);
    }
    var sqlQuoteItem = QuoteItem.viewquery(QuoteId);
    //   var sqlNotes = Notes.ViewNotes(Constants.CONST_IDENTITY_TYPE_MRO, QuoteId);
    // var sqlAttachment = AttachmentModel.ListAttachmentQuery(Constants.CONST_IDENTITY_TYPE_MRO, QuoteId);

    //  var sqlContactAddress = AddressBook.ViewContactAddressByCustomerId(res[0]["IdentityId"]);
    // var sqlShipingAddress = AddressBook.GetAddressByIdQuery(res[0]["CustomerShipToId"]);
    // var sqlBillingAddress = AddressBook.GetAddressByIdQuery(res[0]["CustomerBillToId"]);

    async.parallel([
      function (result) { con.query(sqlQuotes, result) },
      function (result) { con.query(sqlQuoteItem, result) },
      // function (result) { con.query(sqlNotes, result) },
      //   function (result) { con.query(sqlAttachment, result) },
      //  function (result) { con.query(sqlContactAddress, result) },
      //  function (result) { con.query(sqlShipingAddress, result) },
      // function (result) { con.query(sqlBillingAddress, result) },

    ],
      function (err, results) {
        if (err)
          return result(err, null);

        if (results[0][0].length > 0) {
          // var sqlRRNotes = Notes.ViewRRCustomerNotes(Constants.CONST_IDENTITY_TYPE_RR, results[0][0][0].RRId);
          // con.query(sqlRRNotes, (err, res) => {
          result(null, {
            BasicInfo: results[0][0], QuoteItem: results[1][0],
            //NotesList: results[2][0],
            // AttachmentList: results[3][0], 
            //  ContactAddress: results[4][0], ShippingAddress: results[5][0], BillingAddress: results[6][0], 
            //  RRNotesList: res 
          });
          return;
          // });
        } else {
          result({ msg: "MRO Quote not found" }, null);
          return;
        }
      }
    );

  });
};
//
Quotes.ViewSingleCustomerQuoteItem = (Obj, result) => {
  var sqlQuotes = Quotes.viewquery(Obj.QuoteId);
  con.query(sqlQuotes, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (!res[0]) {
      return result({ msg: "MRO Quote not found" }, null);
    }
    var ViewSingleQuoteItemquery = QuoteItem.ViewSingleQuoteItemquery(Obj.QuoteItemId, Obj.QuoteId);
    async.parallel([
      function (result) { con.query(sqlQuotes, result) },
      function (result) { con.query(ViewSingleQuoteItemquery, result) },
    ],
      function (err, results) {
        if (err)
          return result(err, null);
        if (results[0][0].length > 0) {
          result(null, {
            BasicInfo: results[0][0], QuoteItem: results[1][0]
          });
          return;
        } else {
          result({ msg: "MRO Quote not found" }, null);
          return;
        }
      });
  });
};
Quotes.SubmitMROQuoteToCustomer = (reqBody, result) => {

  if (reqBody.hasOwnProperty('MROId')) {
    var sql = `Select Status from tbl_quotes where IsDeleted=0 and  QuoteId=${reqBody.QuoteId}`;
    con.query(sql, (err1, res1) => {
      if (err1) {
        return result(err1, null);
      }
      // if (res1[0].Status == Constants.CONST_QUOTE_STATUS_DRAFT) {
      // result({msg:"Cannot send a DRAFT quote to customer. Review the quote and change the status to OPEN before send a quote to customer"}, null); 
      //return;
      // }
      // var RRStatusHistoryObj = new RRStatusHistory({
      //   RRId: reqBody.RRId,
      //   HistoryStatus: Constants.CONST_RRS_QUOTE_SUBMITTED
      // });
      reqBody.Status = Constants.CONST_MROS_QUOTED_AWAITING_CUSTOMER_PO;
      var QuoteObj = new Quotes({
        MROId: reqBody.MROId,
        QuoteId: reqBody.QuoteId,
        Status: Constants.CONST_QUOTE_STATUS_SUBMITTED,
        QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_SUBMITTED
      });

      //To add a quote to notification table
      // var NotificationObj = new NotificationModel({
      //   RRId: reqBody.RRId,
      //   NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
      //   NotificationIdentityId: reqBody.QuoteId,
      //   NotificationIdentityNo: 'QT' + reqBody.QuoteId,
      //   ShortDesc: 'Customer Quote Submitted',
      //   Description: 'Customer Quote Submitted to Customer  by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
      // });



      async.parallel([
        function (result) { Quotes.ChangeMROStatus(reqBody, result); },
        function (result) { Quotes.UpdateQuotesStatus(QuoteObj, result); },
        //  function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
        // function (result) { CQFollowUp.GetCustomerQuoteFollowUp(reqBody, result); },
        // function (result) { NotificationModel.Create(NotificationObj, result); },
        function (result) { Quotes.UpdateQuoteSubmittedDate(QuoteObj, result); },
      ],
        function (err, results) {
          if (err) {
            result(err, null);
            return;
          }
          result(null, results[2]);
          return;
        }
      );

    });

  } else {
    result({ msg: "MRO not found" }, null);
    return;
  }
};

Quotes.ChangeMROStatus = (ReqBody, result) => {

  var Obj = new Quotes({
    MROId: ReqBody.MROId,
    Status: ReqBody.Status,
    QuoteRejectedType: ReqBody.QuoteRejectedType
  });
  var sql = `UPDATE tbl_mro SET Status=?,RejectedStatusType=?,Modified=?,ModifiedBy=?  WHERE MROId = ?`;
  var values = [Obj.Status, Obj.QuoteRejectedType, Obj.Modified, Obj.ModifiedBy, Obj.MROId];
  // console.log("B=" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "Not_found" }, null);
      return;
    }
    result(null, { Status: Obj.Status });
    return;
  });
};
Quotes.GetMROApprovedQuoteQuery = (MROId, result) => {
  var sql = `Select q.*,v.VendorName from tbl_quotes q
  Left Join tbl_vendors v on v.VendorId=q.VendorId
  where q.IsDeleted=0 and q.QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED} AND q.MROId=${MROId}`;
  return sql;
};
Quotes.UpdateMROQuotesStatusToQuoted = (QuoteObj, result) => {

  var sql = `UPDATE tbl_quotes  SET Status='${QuoteObj.Status}' , Modified='${QuoteObj.Modified}', ModifiedBy='${QuoteObj.ModifiedBy}' WHERE IsDeleted = 0 AND MROId = ${QuoteObj.MROId} AND QuoteId != ${QuoteObj.QuoteId}`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: QuoteObj.QuoteId, ...QuoteObj });
    return;
  }
  );
};

Quotes.ChangeMROStatusAndCustomerPONo = (ReqBody, result) => {

  var Obj = new Quotes({
    authuser: ReqBody.authuser,
    MROId: ReqBody.MROId,
    Status: ReqBody.Status
  });
  Obj.CustomerPONo = ReqBody.CustomerPONo ? ReqBody.CustomerPONo : '';

  var sql = `UPDATE tbl_mro SET Status=?,CustomerPONo=?,Modified=?,ModifiedBy=?  WHERE MROId = ?`;
  var values = [Obj.Status, Obj.CustomerPONo, Obj.Modified, Obj.ModifiedBy, Obj.MROId];
  //console.log("update status sql" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { Status: Obj.Status });
    return;
  }
  );
};

Quotes.RejectMROCustomerQuote = (reqBody, result) => {
  if (reqBody.hasOwnProperty('MROId')) {
    reqBody.Status = Constants.CONST_MROS_QUOTE_REJECTED;
    // var RRStatusHistoryObj = new RRStatusHistory({
    //   RRId: reqBody.RRId,
    //   HistoryStatus: Constants.CONST_RRS_QUOTE_REJECTED
    // });
    reqBody.QuoteCustomerStatus = Constants.CONST_CUSTOMER_QUOTE_REJECTED;
    // var NotificationObj = new NotificationModel({
    //   RRId: reqBody.RRId,
    //   NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
    //   NotificationIdentityId: reqBody.QuoteId,
    //   NotificationIdentityNo: 'QT' + reqBody.QuoteId,
    //   ShortDesc: 'Customer Quote Rejected',
    //   Description: 'Admin (' + global.authuser.FullName + ') Rejected the Customer Quote on ' + cDateTime.getDateTime()
    // });

    async.parallel([
      function (result) { Quotes.UpdateMROQuotesRejectStatus(reqBody, result); },
      function (result) { Quotes.ChangeMROStatus(reqBody, result); },
      // function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
      // function (result) { NotificationModel.Create(NotificationObj, result); },
      function (result) { Quotes.RRVendorQuoteRejected(reqBody, result); }
    ],
      function (err, results) {
        if (err) {
          result(err, null);
          return;
        }
        result(null, { data: results[0][0], ...reqBody });
        return;
      }
    );
  } else {
    result({ msg: "MRO not found" }, null);
    return;
  }
};
Quotes.UpdateMROQuotesRejectStatus = (ReqBody, result) => {
  var QuoteObj = new Quotes({
    QuoteId: ReqBody.QuoteId,
    QuoteCustomerStatus: ReqBody.QuoteCustomerStatus,
    QuoteRejectedType: ReqBody.QuoteRejectedType
  });
  var sql = `UPDATE tbl_quotes  SET Status = ${Constants.CONST_QUOTE_STATUS_CANCELLED}, QuoteRejectedType='${QuoteObj.QuoteRejectedType}',QuoteCustomerStatus='${QuoteObj.QuoteCustomerStatus}', Modified='${QuoteObj.Modified}', ModifiedBy='${QuoteObj.ModifiedBy}' WHERE QuoteId = ${QuoteObj.QuoteId}`;

  // console.log("A=" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: QuoteObj.QuoteId, ...QuoteObj });
    return;
  }
  );
};
Quotes.ViewByMROIdAndQuoteId = (MROId, QuoteId, result) => {
  var sql = `Select * from tbl_quotes tq
  left JOIN tbl_mro mro on mro.MROId=tq.MROId
  where tq.IsDeleted=0 and tq.MROId=${MROId} and tq.QuoteId=${QuoteId}`;
  return sql;
};
Quotes.DeleteMROQuotesQuery = (MROId) => {
  var Obj = new Quotes({ MROId: MROId });
  var sql = `UPDATE tbl_quotes SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE MROId=${Obj.MROId}`;
  return sql;
}

Quotes.GetMROEmailContentForQuote = (Quote, result) => {

  var sql = `SELECT q.QuoteId as IdentityId,'${Constants.CONST_IDENTITY_TYPE_QUOTE}' as IdentityType,
  T.Subject,T.Content,q.QuoteNo,q.Email , GS.AppEmail,GS.AppCCEmail
  from tbl_quotes q 
  LEFT JOIN tbl_email_template T on T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_MRO_CUSTOMER_QUOTE}' 
  LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
  where q.QuoteId=${Quote.IdentityId}`;

  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      var FollowUpObj = {
        FromEmail: res[0].AppEmail,
        ToEmail: res[0].Email,
        CC: res[0].AppCCEmail,
        Subject: res[0].Subject,
        Message: res[0].Content,
        IdentityId: res[0].IdentityId,
        IdentityType: res[0].IdentityType,
      };
      result(null, FollowUpObj);
      return;
    }
    return result({ msg: "Quote not found" }, null);
  });
}

// Quotes.SendEmailToMROCustomerQuoteByQuoteList = (QuoteList, result) => {

//   for (let val of QuoteList) {

//     var sql = `SELECT et.Subject,et.Content,tq.Email
//   FROM tbl_quotes tq
//   LEFT JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId
//   Left JOIN tbl_email_template et on et.TemplateType='${Constants.CONST_EMAIL_TEMPLETE_TYPE_MRO_CUSTOMER_QUOTE}'
//   where tq.QuoteId=${val.QuoteId}`;

//     console.log("val " + sql);
//     con.query(sql, (err, res) => {
//       if (err) {
//         result(err, null);
//         return;
//       }
//       if (res.length > 0 && res[0].Email != "" && res[0].Email != null) {
//         let HelperOptions = {
//           from: Constants.CONST_AH_FROM_EMAIL_ID,
//           to: res[0].Email,
//           subject: res[0].Subject,
//           text: res[0].Content
//         };

//         gmailTransport.sendMail(HelperOptions, (error, info) => {
//           if (!error) {
//             var sql = Quotes.UpdateIsEmailSent(val.QuoteId);
//             con.query(sql, (err, res) => {
//               if (err) {
//                 return result(err, null);
//               }
//             });
//           }
//         });
//       }
//     });
//   }
//   result(null, QuoteList);
//   return;
// };

//Global Search
Quotes.findInColumns = (searchQuery, result) => {

  const { from, size, query, active } = searchQuery;
  let { IdentityType, MultipleAccessIdentityIds, IsRestrictedCustomerAccess, MultipleCustomerIds } = global.authuser;

  var sql = ` SELECT 'ahoms-sales-quote' as _index,
  V.QuoteId as quoteid, V.QuoteNo as quoteno
  FROM tbl_quotes as V
  where 
  (
    QuoteNo like '%${query.multi_match.query}%'  

  ) and V.IsDeleted=0
${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND V.IdentityId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size}`;

  //console.log(sql);

  var countSql = `SELECT count(*) AS totalCount 
  FROM tbl_quotes as V
  where 
  (
    QuoteNo like '%${query.multi_match.query}%' 
  ) and V.IsDeleted=0
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND V.IdentityId IN (${MultipleCustomerIds}) ` : ""}
  `


  con.query(countSql, (err, res) => {
    if (err) {
      return result(err, null);
    } else if (res[0].totalCount > 0) {
      let totalCount = res[0].totalCount;
      con.query(sql, (err, res) => {
        if (err) {
          return result(err, null);
        }
        return result(null, { totalCount: { "_index": "ahoms-sales-quotes", val: totalCount }, data: res });
      });
    } else {
      return result(null, []);
    }

  });
}

Quotes.viewQuoteItemUsingPartIdAndMROId = (data, result) => {
  var sql = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.LeadTime,qi.WarrantyPeriod, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,qi.BaseRate,qi.BaseTax
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId
  where tq.IsDeleted=0 and tq.MROId=${data.MROId} and qi.PartId=${data.PartId}`;
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




module.exports = Quotes;

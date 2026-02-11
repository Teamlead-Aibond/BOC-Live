/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
const InvoiceItem = require("../models/invoice.item.model.js");
const GlobalCustomerReference = require("./sales.order.customer.ref.model.js");
const Notes = require("../models/repair.request.notes.model.js");
const AttachmentModel = require("../models/repair.request.attachment.model.js");
const RRSHModel = require("../models/repair.request.shipping.history.model.js");
const RRCustomerReference = require("../models/cutomer.reference.labels.model.js");
const Address = require("../models/customeraddress.model.js");
var async = require('async');
var MailConfig = require('../config/email.config');
const EdiModel = require("./edi.model.js");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
var gmailTransport = MailConfig.GmailTransport;


const Invoice = function (objInvoice) {
  this.InvoiceId = objInvoice.InvoiceId;
  this.InvoiceNo = objInvoice.InvoiceNo ? objInvoice.InvoiceNo : '';
  this.SONo = objInvoice.SONo ? objInvoice.SONo : '';
  this.CustomerPONo = objInvoice.CustomerPONo ? objInvoice.CustomerPONo : '';
  this.CustomerBlanketPOId = objInvoice.CustomerBlanketPOId ? objInvoice.CustomerBlanketPOId : 0;
  this.RRNo = objInvoice.RRNo ? objInvoice.RRNo : '';
  this.MROId = objInvoice.MROId ? objInvoice.MROId : 0;
  this.RRId = objInvoice.RRId ? objInvoice.RRId : 0;
  this.CustomerId = objInvoice.CustomerId ? objInvoice.CustomerId : 0;
  this.InvoiceType = objInvoice.InvoiceType;
  this.TermsId = objInvoice.TermsId ? objInvoice.TermsId : 0;
  this.InvoiceDate = objInvoice.InvoiceDate ? objInvoice.InvoiceDate : null;
  this.DueDate = objInvoice.DueDate ? objInvoice.DueDate : null;
  this.ReferenceNo = objInvoice.ReferenceNo ? objInvoice.ReferenceNo : '';
  this.ShipAddressId = objInvoice.ShipAddressId ? objInvoice.ShipAddressId : 0;
  this.BillAddressId = objInvoice.BillAddressId ? objInvoice.BillAddressId : 0;
  this.LaborDescription = objInvoice.LaborDescription ? objInvoice.LaborDescription : '';
  this.SubTotal = objInvoice.SubTotal ? objInvoice.SubTotal : 0;
  this.TaxPercent = objInvoice.TaxPercent ? objInvoice.TaxPercent : 0;
  this.TotalTax = objInvoice.TotalTax ? objInvoice.TotalTax : 0;
  this.Discount = objInvoice.Discount ? objInvoice.Discount : 0;
  this.AHFees = objInvoice.AHFees ? objInvoice.AHFees : 0;
  this.Shipping = objInvoice.Shipping ? objInvoice.Shipping : 0;
  this.AdvanceAmount = objInvoice.AdvanceAmount ? objInvoice.AdvanceAmount : 0;
  this.GrandTotal = objInvoice.GrandTotal ? objInvoice.GrandTotal : 0;
  this.Status = objInvoice.Status;

  this.IsEDIUpload = objInvoice.IsEDIUpload ? objInvoice.IsEDIUpload : 0;

  const TokenUserName = (global.authuser && global.authuser.FullName) ? global.authuser.FullName : '';
  this.RequestedByname = (objInvoice.authuser && objInvoice.authuser.FullName) ? objInvoice.authuser.FullName : TokenUserName;

  this.Created = objInvoice.Created ? objInvoice.Created + " 10:00:00" : cDateTime.getDateTime();
  this.Modified = objInvoice.Modified ? objInvoice.Modified + " 10:00:00" : cDateTime.getDateTime();


  const TokenUserId = (global.authuser && global.authuser.UserId) ? global.authuser.UserId : 0;
  this.CreatedBy = (objInvoice.authuser && objInvoice.authuser.UserId) ? objInvoice.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objInvoice.authuser && objInvoice.authuser.UserId) ? objInvoice.authuser.UserId : TokenUserId;

  this.IsDeleted = objInvoice.IsDeleted;
  this.LeadTime = objInvoice.LeadTime ? objInvoice.LeadTime : '';
  this.WarrantyPeriod = objInvoice.WarrantyPeriod ? objInvoice.WarrantyPeriod : null;
  this.SOId = objInvoice.SOId ? objInvoice.SOId : 0;
  this.IsEmailSent = objInvoice.IsEmailSent ? objInvoice.IsEmailSent : 0;
  this.IsCSVProcessed = objInvoice.IsCSVProcessed ? objInvoice.IsCSVProcessed : 0;
  this.CustomerInvoiceApproved = objInvoice.CustomerInvoiceApproved ? objInvoice.CustomerInvoiceApproved : '';
  this.VendorBillApproved = objInvoice.VendorBillApproved ? objInvoice.VendorBillApproved : '';
  this.VendorBillCreated = objInvoice.VendorBillCreated ? objInvoice.VendorBillCreated : '';
  this.IsDeleted = objInvoice.IsDeleted ? objInvoice.IsDeleted : 0;
  this.MROShippingHistoryId = objInvoice.MROShippingHistoryId ? objInvoice.MROShippingHistoryId : 0;
  // BlanketPOExcludeAmount & BlanketPONetAmount
  this.BlanketPOExcludeAmount = objInvoice.BlanketPOExcludeAmount ? objInvoice.BlanketPOExcludeAmount : 0;
  this.BlanketPONetAmount = objInvoice.BlanketPONetAmount ? objInvoice.BlanketPONetAmount : 0;
  // Multi currency
  this.LocalCurrencyCode = objInvoice.LocalCurrencyCode ? objInvoice.LocalCurrencyCode : '';
  this.ExchangeRate = objInvoice.ExchangeRate ? objInvoice.ExchangeRate : 0;
  this.BaseCurrencyCode = objInvoice.BaseCurrencyCode ? objInvoice.BaseCurrencyCode : '';
  this.BaseGrandTotal = objInvoice.BaseGrandTotal ? objInvoice.BaseGrandTotal : 0;

  const TokenCreatedByLocation = (global.authuser && global.authuser.Location) ? global.authuser.Location : '';
  this.CreatedByLocation = (objInvoice.authuser && objInvoice.authuser.Location) ? objInvoice.authuser.Location : TokenCreatedByLocation;


  const TokenGlobalIdentityId = (global.authuser && global.authuser.IdentityId) ? global.authuser.IdentityId : 0;
  this.IdentityId = (objInvoice.authuser && objInvoice.authuser.IdentityId) ? objInvoice.authuser.IdentityId : TokenGlobalIdentityId;

  const TokenGlobalIdentityType = (global.authuser && global.authuser.IdentityType) ? global.authuser.IdentityType : 0;
  this.IdentityType = (objInvoice.authuser && objInvoice.authuser.IdentityType) ? objInvoice.authuser.IdentityType : TokenGlobalIdentityType;

  const TokenIsRestrictedCustomerAccess = (global.authuser && global.authuser.IsRestrictedCustomerAccess) ? global.authuser.IsRestrictedCustomerAccess : 0;
  this.IsRestrictedCustomerAccess = (objInvoice.authuser && objInvoice.authuser.IsRestrictedCustomerAccess) ? objInvoice.authuser.IsRestrictedCustomerAccess : TokenIsRestrictedCustomerAccess;

  const TokenMultipleCustomerIds = (global.authuser && global.authuser.MultipleCustomerIds) ? global.authuser.MultipleCustomerIds : 0;
  this.MultipleCustomerIds = (objInvoice.authuser && objInvoice.authuser.MultipleCustomerIds) ? objInvoice.authuser.MultipleCustomerIds : TokenMultipleCustomerIds;

  const TokenMultipleAccessIdentityIds = (global.authuser && global.authuser.MultipleAccessIdentityIds) ? global.authuser.MultipleAccessIdentityIds : 0;
  this.MultipleAccessIdentityIds = (objInvoice.authuser && objInvoice.authuser.MultipleAccessIdentityIds) ? objInvoice.authuser.MultipleAccessIdentityIds : TokenMultipleAccessIdentityIds;




  // For Server Side Search 
  this.start = objInvoice.start;
  this.length = objInvoice.length;
  this.search = objInvoice.search;
  this.sortCol = objInvoice.sortCol;
  this.sortDir = objInvoice.sortDir;
  this.sortColName = objInvoice.sortColName;
  this.order = objInvoice.order;
  this.columns = objInvoice.columns;
  this.draw = objInvoice.draw;
}


Invoice.ApproveInvoice = (Invoice, result) => {

  var sql = ``;

  sql = `UPDATE tbl_invoice SET ApprovedById = ?,ApprovedByName = ?,
  ApprovedDate = ?,Status = ?,
  Modified = ?,ModifiedBy = ? WHERE InvoiceId = ?`;

  var values = [

    Invoice.CreatedBy, Invoice.RequestedByname,
    Invoice.Created, Constants.CONST_INV_STATUS_APPROVED,
    Invoice.Modified, Invoice.ModifiedBy, Invoice.InvoiceId

  ]
  // console.log(sql, values)
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
    result(null, { id: Invoice.InvoiceId, ...Invoice });
  }
  );
};

Invoice.CancelInvoice = (Invoice, result) => {
  var sql = `UPDATE tbl_invoice SET   Status = ?,  Modified = ?,ModifiedBy = ? WHERE InvoiceId = ?`;
  var values = [
    Constants.CONST_INV_STATUS_CANCELLED,
    Invoice.Modified, Invoice.ModifiedBy, Invoice.InvoiceId

  ]
  //console.log(sql, values)
  con.query(sql, values, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: Invoice.InvoiceId, ...Invoice });
  }
  );
};



Invoice.CSVExportToExcel = (reqBody, InvoiceIds, result) => {

  var obj = new Invoice(reqBody);
  var wheresql = ``;
  var selectsql = ` SELECT c.CustomerCode,c.CompanyName as CustomerName, i.InvoiceNo,DATE_FORMAT(i.Created,'%m/%d/%Y') as Date,
  CONCAT(c.FirstName,' ',c.LastName) as ShipToName, IF(CONCAT(ab1.StreetAddress,',',ab1.City,',',s1.StateName,',',c1.CountryName) IS NULL, "", CONCAT(ab1.StreetAddress,',',ab1.City,',',s1.StateName,',',c1.CountryName))  as ShipToAddressLineOne,'' as ShipToAddressLineTwo,
  IF(ab1.City IS NULL, "", ab1.City)  as ShipToCity, IF(s1.StateName IS NULL, "", s1.StateName)
  as ShipToState, IF(ab1.Zip IS NULL, "", ab1.Zip) as ShipToZipCode, IF(c1.CountryName IS NULL, "", c1.CountryName)
   as ShipToCountry,i.CustomerPONo,
  DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') as ShipDate,DATE_FORMAT(i.DueDate,'%m/%d/%Y') as DueDate,TERM.TermsName as DisplayedTerms,
  11000 as AccountsReceivableAccount,i.GrandTotal as Accounts,'' as InvoiceNote,(SELECT Count(vii.InvoiceItemId)
  FROM tbl_invoice_item as vii WHERE vii.IsDeleted = 0 AND vii.InvoiceId = i.InvoiceId ) as NumberOfDistributions,1 as Quantity,
  i.RRId as SOProposalNumber,'AH-Parts' as ItemID,ii.Description,30000 as G7LAccount, CONCAT('-',ii.Price) as UnitPrice,2 as TaxType,
  CONCAT('-',ii.Price) as Amount,i.LocalCurrencyCode,i.ExchangeRate,i.BaseCurrencyCode,i.BaseGrandTotal,
  ii.ItemTaxPercent,ii.ItemLocalCurrencyCode,ii.ItemExchangeRate,ii.ItemBaseCurrencyCode,ii.BasePrice,ii.BaseRate,ii.BaseTax
  FROM tbl_invoice i
  Left Join tbl_invoice_item ii on ii.InvoiceId = i.InvoiceId  AND ii.IsDeleted = 0   
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = i.SOId AND SO.IsDeleted = 0 
  LEFT JOIN tbl_po as PO ON SO.POId = PO.POId AND PO.IsDeleted = 0 
  LEFT JOIN tbl_vendor_invoice as vi on vi.POId=PO.POId  AND vi.IsDeleted = 0 
  Left Join tbl_customers c on i.CustomerId=c.CustomerId
  LEFT JOIN tbl_address_book ab1 on ab1.AddressId=i.ShipAddressId
  LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
  LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
  LEFT JOIN tbl_terms as TERM ON TERM.TermsId = i.TermsId
  where 1=1  `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    wheresql += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.IsDeleted >= 0) {
    wheresql += " and  i.IsDeleted ='" + obj.IsDeleted + "'  ";
  }
  if (obj.RRNo != "") {
    wheresql += " and  i.RRNo ='" + obj.RRNo + "'  ";
  }
  if (obj.RRId != "") {
    wheresql += " and i.RRId ='" + obj.RRId + "' ";
  }
  if (obj.InvoiceNo != "") {
    wheresql += " and  i.InvoiceNo ='" + obj.InvoiceNo + "'  ";
  }
  if (obj.CustomerId > 0) {
    wheresql += " and  i.CustomerId ='" + obj.CustomerId + "'  ";
  }
  if (obj.CustomerPONo != "") {
    wheresql += " and  i.CustomerPONo ='" + obj.CustomerPONo + "'  ";
  }
  if (obj.InvoiceDate != null) {
    wheresql += " and  i.InvoiceDate >='" + obj.InvoiceDate + "'  ";
  }
  if (reqBody.hasOwnProperty('InvoiceDateTo') == true && reqBody.InvoiceDateTo != "") {
    wheresql += " and  i.InvoiceDate <='" + reqBody.InvoiceDateTo + "' ";
  }
  if (obj.DueDate != null) {
    wheresql += " and  i.DueDate >='" + obj.DueDate + "'  ";
  }
  if (reqBody.hasOwnProperty('DueDateTo') == true && reqBody.DueDateTo != "") {
    wheresql += " and  i.DueDate <='" + reqBody.DueDateTo + "' ";
  }
  if (reqBody.hasOwnProperty('InvoiceType') == true && obj.InvoiceType != "") {
    wheresql += " and  i.InvoiceType ='" + obj.InvoiceType + "'  ";
  }
  if (reqBody.hasOwnProperty('Status') == true && obj.Status != "") {
    wheresql += " and  i.Status ='" + obj.Status + "'  ";
  }
  if (reqBody.hasOwnProperty('IsCSVProcessed') == true && obj.IsCSVProcessed != "") {
    wheresql += " and  i.IsCSVProcessed ='" + obj.IsCSVProcessed + "'  ";
  }
  if (reqBody.hasOwnProperty('CustomerInvoiceApproved') == true && obj.CustomerInvoiceApproved != "") {
    if (obj.CustomerInvoiceApproved == "true")
      wheresql += " and  i.Status='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
    else if (obj.CustomerInvoiceApproved == "false")
      wheresql += " and  i.Status !='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
  }

  if (reqBody.hasOwnProperty('VendorBillApproved') == true && obj.VendorBillApproved != "") {
    if (obj.VendorBillApproved == "true")
      wheresql += " and  vi.Status='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
    else if (obj.VendorBillApproved == "false")
      wheresql += " and  vi.Status !='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
  }
  if (reqBody.hasOwnProperty('DownloadType') && reqBody.DownloadType == "CSV") {
    wheresql += ` and i.Status= ` + Constants.CONST_INV_STATUS_APPROVED + ` `;
  }

  if (obj.VendorBillCreated != "") {
    if (obj.VendorBillCreated == "true")
      wheresql += " and  vi.VendorInvoiceId > 0 ";
    else if (obj.VendorBillCreated == "false")
      wheresql += " and  vi.VendorInvoiceId IS NULL ";
  }
  if (InvoiceIds != '') {
    wheresql += `and i.InvoiceId in(` + InvoiceIds + `)`;
  }
  if (obj.LocalCurrencyCode != "") {
    wheresql += " and ( i.LocalCurrencyCode ='" + obj.LocalCurrencyCode + "' ) ";
  }

  /*if (obj.Status != "" && obj.Status == Constants.CONST_INV_STATUS_APPROVED) {
    wheresql += ` and i.Status= ` + Constants.CONST_INV_STATUS_APPROVED + ` `;
  }
  else if (reqBody.hasOwnProperty('IsCSVProcessed') == true && obj.IsCSVProcessed == 1) {
    wheresql += " and  i.Status ='" + Constants.CONST_INV_STATUS_APPROVED + "'  ";
  }
  else {
    wheresql += " and  i.Status =-1  ";
  }*/

  var UpdateIsCSV = ` UPDATE tbl_invoice i Left Join tbl_vendor_invoice vi on i.RRId=vi.RRId and i.RRId>0
   SET i.IsCSVProcessed =1 WHERE i.IsDeleted=${obj.IsDeleted > 0 ? obj.IsDeleted : 0}  `;
  var sqlArray = []; var obj = {};
  obj.sqlUpdateIsCSVProcessed = UpdateIsCSV + wheresql;

  wheresql += ` ORDER BY i.InvoiceId DESC`;
  obj.sqlExcel = selectsql + wheresql;
  sqlArray.push(obj);
  // console.log("sqlExcel=" + sqlArray[0].sqlExcel);
  //console.log("sqlUpdateIsCSVProcessed = " + sqlArray[0].sqlUpdateIsCSVProcessed);
  return sqlArray;
};



Invoice.CSVExportToExcelNew = (reqBody, InvoiceIds, result) => {

  var obj = new Invoice(reqBody);
  var wheresql = ``;
  var selectsql = ` SELECT  
  c.CustomerCode as 'Customer ID','' as 'Customer Name', i.InvoiceNo as 'Invoice/CM #',DATE_FORMAT(i.Created,'%m/%d/%Y') as Date,
  '' as 'Ship to Name', '' as 'Ship to Address-Line One',''  as 'Ship to Address-Line Two',
  ''  as 'Ship to City', ''  as 'Ship to State','' as 'Ship to Zipcode', '' as 'Ship to Country',i.CustomerPONo as 'Customer PO',
  DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') as 'Ship Date',DATE_FORMAT(i.DueDate,'%m/%d/%Y') as 'Date Due','' as 'Displayed Terms',
  11000 as 'Accounts Receivable Account','' as 'Accounts Receivable Amount','' as 'Invoice Note',(SELECT Count(vii.InvoiceItemId)
  FROM tbl_invoice_item as vii WHERE vii.IsDeleted = 0 AND vii.InvoiceId = i.InvoiceId ) as 'Number of Distributions','' as Quantity,
  '' as 'SO/Proposal Number','' as 'Item ID','' as Description,30000 as 'G/L Account', '' as  'Unit Price',2 as 'Tax Type',  CONCAT('-',ii.Price) as Amount,
  i.LocalCurrencyCode,i.ExchangeRate,i.BaseCurrencyCode,i.BaseGrandTotal,
  ii.ItemTaxPercent,ii.ItemLocalCurrencyCode,ii.ItemExchangeRate,ii.ItemBaseCurrencyCode,ii.BasePrice,ii.BaseRate,ii.BaseTax
  FROM tbl_invoice i
  Left Join tbl_invoice_item ii on ii.InvoiceId = i.InvoiceId  AND ii.IsDeleted = 0 
   LEFT JOIN tbl_sales_order as SO ON SO.SOId = i.SOId AND SO.IsDeleted = 0 
  LEFT JOIN tbl_po as PO ON SO.POId = PO.POId AND PO.IsDeleted = 0 
  LEFT JOIN tbl_vendor_invoice as vi on vi.POId=PO.POId  AND vi.IsDeleted = 0 
  Left Join tbl_customers c on i.CustomerId=c.CustomerId
  LEFT JOIN tbl_address_book ab1 on ab1.AddressId=i.ShipAddressId
  LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
  LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
  LEFT JOIN tbl_terms as TERM ON TERM.TermsId = i.TermsId
  where 1=1  `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    wheresql += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.IsDeleted >= 0) {
    wheresql += " and  i.IsDeleted ='" + obj.IsDeleted + "'  ";
  }
  if (obj.RRNo != "") {
    wheresql += " and  i.RRNo ='" + obj.RRNo + "'  ";
  }
  if (obj.RRId != "") {
    wheresql += " and i.RRId ='" + obj.RRId + "' ";
  }
  if (obj.InvoiceNo != "") {
    wheresql += " and  i.InvoiceNo ='" + obj.InvoiceNo + "'  ";
  }
  if (obj.CustomerId > 0) {
    wheresql += " and  i.CustomerId ='" + obj.CustomerId + "'  ";
  }
  if (obj.CustomerPONo != "") {
    wheresql += " and  i.CustomerPONo ='" + obj.CustomerPONo + "'  ";
  }
  if (obj.InvoiceDate != null) {
    wheresql += " and  i.InvoiceDate >='" + obj.InvoiceDate + "'  ";
  }
  if (reqBody.hasOwnProperty('InvoiceDateTo') == true && reqBody.InvoiceDateTo != "") {
    wheresql += " and  i.InvoiceDate <='" + reqBody.InvoiceDateTo + "' ";
  }
  if (obj.DueDate != null) {
    wheresql += " and  i.DueDate >='" + obj.DueDate + "'  ";
  }
  if (reqBody.hasOwnProperty('DueDateTo') == true && reqBody.DueDateTo != "") {
    wheresql += " and  i.DueDate <='" + reqBody.DueDateTo + "' ";
  }
  if (reqBody.hasOwnProperty('InvoiceType') == true && obj.InvoiceType != "") {
    wheresql += " and  i.InvoiceType ='" + obj.InvoiceType + "'  ";
  }
  if (reqBody.hasOwnProperty('Status') == true && obj.Status != "") {
    wheresql += " and  i.Status ='" + obj.Status + "'  ";
  }
  if (reqBody.hasOwnProperty('IsCSVProcessed') == true && obj.IsCSVProcessed != "") {
    wheresql += " and  i.IsCSVProcessed ='" + obj.IsCSVProcessed + "'  ";
  }
  if (reqBody.hasOwnProperty('CustomerInvoiceApproved') == true && obj.CustomerInvoiceApproved != "") {
    if (obj.CustomerInvoiceApproved == "true")
      wheresql += " and  i.Status='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
    else if (obj.CustomerInvoiceApproved == "false")
      wheresql += " and  i.Status !='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
  }
  if (reqBody.hasOwnProperty('VendorBillApproved') == true && obj.VendorBillApproved != "") {
    if (obj.VendorBillApproved == "true")
      wheresql += " and  vi.Status='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
    else if (obj.VendorBillApproved == "false")
      wheresql += " and  vi.Status !='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
  }

  if (reqBody.hasOwnProperty('DownloadType') && reqBody.DownloadType == "CSV") {
    wheresql += ` and i.Status= ` + Constants.CONST_INV_STATUS_APPROVED + ` `;
  }

  if (obj.VendorBillCreated != "") {
    if (obj.VendorBillCreated == "true")
      wheresql += " and  vi.VendorInvoiceId >0";
    else if (obj.VendorBillCreated == "false")
      wheresql += " and  vi.VendorInvoiceId IS NULL ";
  }
  if (InvoiceIds != '') {
    wheresql += ` and i.InvoiceId in(` + InvoiceIds + `)`;
  }
  if (obj.LocalCurrencyCode != "") {
    wheresql += " and ( i.LocalCurrencyCode ='" + obj.LocalCurrencyCode + "' ) ";
  }
  var UpdateIsCSV = ` UPDATE tbl_invoice i Left Join tbl_vendor_invoice vi on i.RRId=vi.RRId and i.RRId>0
  SET i.IsCSVProcessed =1 WHERE i.IsDeleted=${obj.IsDeleted > 0 ? obj.IsDeleted : 0}  `;
  var sqlArray = []; var obj = {};
  obj.sqlUpdateIsCSVProcessed = UpdateIsCSV + wheresql;
  /* if (obj.Status != "" && obj.Status == Constants.CONST_INV_STATUS_APPROVED) {
     wheresql += ` and i.Status= ` + Constants.CONST_INV_STATUS_APPROVED + ` `;
   }
   else if (reqBody.hasOwnProperty('IsCSVProcessed') == true && obj.IsCSVProcessed == 1) {
     wheresql += " and  i.Status ='" + Constants.CONST_INV_STATUS_APPROVED + "'  ";
   }
   else {
     wheresql += " and  i.Status =-1  ";
   }*/
  wheresql += ` ORDER BY i.InvoiceId DESC`;

  obj.sqlExcel = selectsql + wheresql;
  sqlArray.push(obj);
  // console.log("sqlExcel=" + sqlArray[0].sqlExcel);
  // console.log("sqlUpdateIsCSVProcessed = " + sqlArray[0].sqlUpdateIsCSVProcessed);
  return sqlArray;

  // console.log(selectsql + wheresql)

  // return selectsql + wheresql;

};





Invoice.IntacctJson = (reqBody, result) => {
  var obj = new Invoice(reqBody);
  var wheresql = ``;
  var selectsql = ` SELECT 
i.InvoiceNo as INVOICE_NO,
i.CustomerPONo as PO_NO,
c.CustomerCode as CUSTOMER_ID,
DATE_FORMAT(i.Created,'%m/%d/%Y') as POSTING_DATE,
DATE_FORMAT(i.Created,'%m/%d/%Y') as CREATED_DATE,
DATE_FORMAT(i.DueDate,'%m/%d/%Y') as DUE_DATE,
ROUND(i.GrandTotal,2) as TOTAL_DUE,
'' as DESCRIPTION,
i.LocalCurrencyCode as BASECURR,
i.LocalCurrencyCode as CURRENCY,
DATE_FORMAT(i.Created,'%m/%d/%Y') as EXCH_RATE_DATE,
'' as EXCH_RATE_TYPE_ID,
1 as EXCHANGE_RATE,
ROW_NUMBER() OVER (PARTITION BY i.InvoiceNo) as LINE_NO,	
'' as MEMO,
40100 as ACCT_NO,	
ifnull(c2.EntityId,'') as LOCATION_ID,
'' as DEPT_ID,	
(ROUND(i.GrandTotal,2) - ROUND((ii.Tax*ii.quantity),2)) as AMOUNT,
'' as SUBTOTAL,
ifnull(c2.TaxSolutionId,'') as TAXSOLUTIONID,
1 as TAX_LINE_NO,
ROUND((ii.Tax*ii.quantity),2) as TAX_AMOUNT,
IF(ii.Tax>0,ifnull(c2.TaxDetailId,''),ifnull(c2.NoTaxDetailId,'')) as TAX_DETAILID,
c.CustomerCode as ARINVOICEITEM_CUSTOMERID,
'' as ARINVOICEITEM_CLASSID 

  FROM tbl_invoice i 
   Left Join tbl_invoice_item ii on ii.InvoiceId = i.InvoiceId  AND ii.IsDeleted = 0 
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = i.SOId AND SO.IsDeleted = 0 
  LEFT JOIN tbl_po as PO ON SO.POId = PO.POId AND PO.IsDeleted = 0 
  LEFT JOIN tbl_vendor_invoice as vi on vi.POId=PO.POId  AND vi.IsDeleted = 0 
  Left Join tbl_customers c on i.CustomerId=c.CustomerId
  LEFT JOIN tbl_address_book ab1 on ab1.AddressId=i.ShipAddressId
  LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
  LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
  LEFT JOIN tbl_terms as TERM ON TERM.TermsId = i.TermsId
  LEFT JOIN tbl_countries c2 on c2.CountryId=c.CustomerLocation
  where 1=1 AND i.IsDeleted=0  `;

  if (obj.InvoiceNo != "") {
    wheresql += " and  i.InvoiceNo ='" + obj.InvoiceNo + "'  ";
  }
  if (obj.CustomerId > 0) {
    wheresql += " and  i.CustomerId ='" + obj.CustomerId + "'  ";
  }
  if (obj.InvoiceDate != null) {
    wheresql += " and  i.InvoiceDate >='" + obj.InvoiceDate + "'  ";
  }
  if (reqBody.hasOwnProperty('InvoiceDateTo') == true && reqBody.InvoiceDateTo != "") {
    wheresql += " and  i.InvoiceDate <='" + reqBody.InvoiceDateTo + "' ";
  }
  if (obj.DueDate != null) {
    wheresql += " and  i.DueDate >='" + obj.DueDate + "'  ";
  }
  if (reqBody.hasOwnProperty('DueDateTo') == true && reqBody.DueDateTo != "") {
    wheresql += " and  i.DueDate <='" + reqBody.DueDateTo + "' ";
  }
  if (obj.InvoiceId != '') {
    wheresql += ` and i.InvoiceId in(` + obj.InvoiceId + `)`;
  }

  wheresql += ` and i.Status= ` + Constants.CONST_INV_STATUS_APPROVED + ` `;

 // console.log(wheresql);
  var sqlExcel = selectsql + wheresql;
  con.query(sqlExcel, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });


};


Invoice.IntacctCSVDownload = (reqBody, InvoiceIds, result) => {

  var obj = new Invoice(reqBody);
  var wheresql = ``;
  var selectsql = ` SELECT 
i.InvoiceNo as INVOICE_NO,
i.CustomerPONo as PO_NO,
c.CustomerCode as CUSTOMER_ID,
DATE_FORMAT(i.Created,'%m/%d/%Y') as POSTING_DATE,
DATE_FORMAT(i.Created,'%m/%d/%Y') as CREATED_DATE,
DATE_FORMAT(i.DueDate,'%m/%d/%Y') as DUE_DATE,
ROUND(i.GrandTotal,2) as TOTAL_DUE,
'' as DESCRIPTION,
i.LocalCurrencyCode as BASECURR,
i.LocalCurrencyCode as CURRENCY,
DATE_FORMAT(i.Created,'%m/%d/%Y') as EXCH_RATE_DATE,
'' as EXCH_RATE_TYPE_ID,
1 as EXCHANGE_RATE,
ROW_NUMBER() OVER (PARTITION BY i.InvoiceNo) as LINE_NO,	
'' as MEMO,
40100 as ACCT_NO,	
ifnull(c2.EntityId,'') as LOCATION_ID,
'' as DEPT_ID,	
(ROUND(i.GrandTotal,2) - ROUND((ii.Tax*ii.quantity),2)) as AMOUNT,
'' as SUBTOTAL,
ifnull(c2.TaxSolutionId,'') as TAXSOLUTIONID,
1 as TAX_LINE_NO,
ROUND((ii.Tax*ii.quantity),2) as TAX_AMOUNT,
IF(ii.Tax>0,ifnull(c2.TaxDetailId,''),ifnull(c2.NoTaxDetailId,'')) as TAX_DETAILID,
c.CustomerCode as ARINVOICEITEM_CUSTOMERID,
'' as ARINVOICEITEM_CLASSID 

  FROM tbl_invoice i 
   Left Join tbl_invoice_item ii on ii.InvoiceId = i.InvoiceId  AND ii.IsDeleted = 0 
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = i.SOId AND SO.IsDeleted = 0 
  LEFT JOIN tbl_po as PO ON SO.POId = PO.POId AND PO.IsDeleted = 0 
  LEFT JOIN tbl_vendor_invoice as vi on vi.POId=PO.POId  AND vi.IsDeleted = 0 
  Left Join tbl_customers c on i.CustomerId=c.CustomerId
  LEFT JOIN tbl_address_book ab1 on ab1.AddressId=i.ShipAddressId
  LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
  LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
  LEFT JOIN tbl_terms as TERM ON TERM.TermsId = i.TermsId
  LEFT JOIN tbl_countries c2 on c2.CountryId=c.CustomerLocation
  where 1=1  `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    wheresql += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.IsDeleted >= 0) {
    wheresql += " and  i.IsDeleted ='" + obj.IsDeleted + "'  ";
  }
  if (obj.RRNo != "") {
    wheresql += " and  i.RRNo ='" + obj.RRNo + "'  ";
  }
  if (obj.RRId != "") {
    wheresql += " and i.RRId ='" + obj.RRId + "' ";
  }
  if (obj.InvoiceNo != "") {
    wheresql += " and  i.InvoiceNo ='" + obj.InvoiceNo + "'  ";
  }
  if (obj.CustomerId > 0) {
    wheresql += " and  i.CustomerId ='" + obj.CustomerId + "'  ";
  }
  if (obj.CustomerPONo != "") {
    wheresql += " and  i.CustomerPONo ='" + obj.CustomerPONo + "'  ";
  }
  if (obj.InvoiceDate != null) {
    wheresql += " and  i.InvoiceDate >='" + obj.InvoiceDate + "'  ";
  }
  if (reqBody.hasOwnProperty('InvoiceDateTo') == true && reqBody.InvoiceDateTo != "") {
    wheresql += " and  i.InvoiceDate <='" + reqBody.InvoiceDateTo + "' ";
  }
  if (obj.DueDate != null) {
    wheresql += " and  i.DueDate >='" + obj.DueDate + "'  ";
  }
  if (reqBody.hasOwnProperty('DueDateTo') == true && reqBody.DueDateTo != "") {
    wheresql += " and  i.DueDate <='" + reqBody.DueDateTo + "' ";
  }
  if (reqBody.hasOwnProperty('InvoiceType') == true && obj.InvoiceType != "") {
    wheresql += " and  i.InvoiceType ='" + obj.InvoiceType + "'  ";
  }
  if (reqBody.hasOwnProperty('Status') == true && obj.Status != "") {
    wheresql += " and  i.Status ='" + obj.Status + "'  ";
  }
  if (reqBody.hasOwnProperty('IsCSVProcessed') == true && obj.IsCSVProcessed != "") {
    wheresql += " and  i.IsCSVProcessed ='" + obj.IsCSVProcessed + "'  ";
  }
  if (reqBody.hasOwnProperty('CustomerInvoiceApproved') == true && obj.CustomerInvoiceApproved != "") {
    if (obj.CustomerInvoiceApproved == "true")
      wheresql += " and  i.Status='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
    else if (obj.CustomerInvoiceApproved == "false")
      wheresql += " and  i.Status !='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
  }
  if (reqBody.hasOwnProperty('VendorBillApproved') == true && obj.VendorBillApproved != "") {
    if (obj.VendorBillApproved == "true")
      wheresql += " and  vi.Status='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
    else if (obj.VendorBillApproved == "false")
      wheresql += " and  vi.Status !='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
  }

  if (obj.LocalCurrencyCode != "") {
    wheresql += " and ( i.LocalCurrencyCode ='" + obj.LocalCurrencyCode + "' ) ";
  }

  if (reqBody.hasOwnProperty('DownloadType') && reqBody.DownloadType == "CSV") {
    wheresql += ` and i.Status= ` + Constants.CONST_INV_STATUS_APPROVED + ` `;
  }

  if (obj.VendorBillCreated != "") {
    if (obj.VendorBillCreated == "true")
      wheresql += " and  vi.VendorInvoiceId >0";
    else if (obj.VendorBillCreated == "false")
      wheresql += " and  vi.VendorInvoiceId IS NULL ";
  }
  if (InvoiceIds != '') {
    wheresql += ` and i.InvoiceId in(` + InvoiceIds + `)`;
  }

  var UpdateIsCSV = ` UPDATE tbl_invoice i Left Join tbl_vendor_invoice vi on i.RRId=vi.RRId and i.RRId>0
  SET i.IsCSVProcessed =1 WHERE i.IsDeleted=${obj.IsDeleted > 0 ? obj.IsDeleted : 0}  `;

  var sqlArray = []; var obj = {};
  obj.sqlUpdateIsCSVProcessed = UpdateIsCSV + wheresql;
  wheresql += ` ORDER BY i.InvoiceId DESC`;
  obj.sqlExcel = selectsql + wheresql;
  sqlArray.push(obj);
  return sqlArray;



};



//ExportToExcel
Invoice.ExportToExcel = (reqBody, InvoiceIds, result) => {

  var obj = new Invoice(reqBody);
  var wheresql = ``;
  var selectsql = ` SELECT c.CustomerCode,c.CompanyName as CustomerName, i.InvoiceNo,DATE_FORMAT(i.Created,'%m/%d/%Y') as Date,
  CONCAT(c.FirstName,' ',c.LastName) as ShipToName, IF(CONCAT(ab1.StreetAddress,',',ab1.City,',',s1.StateName,',',c1.CountryName)
  IS NULL, "", CONCAT(ab1.StreetAddress,',',ab1.City,',',s1.StateName,',',c1.CountryName))  as ShipToAddressLineOne,''
   as ShipToAddressLineTwo,
  IF(ab1.City IS NULL, "", ab1.City)  as ShipToCity, IF(s1.StateName IS NULL, "", s1.StateName)   as ShipToState, IF(ab1.Zip
  IS NULL, "", ab1.Zip) as ShipToZipCode, IF(c1.CountryName IS NULL, "", c1.CountryName) as ShipToCountry,i.CustomerPONo,
  DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') as ShipDate,DATE_FORMAT(i.DueDate,'%m/%d/%Y') as DueDate,TERM.TermsName as DisplayedTerms,
  11000 as AccountsReceivableAccount,i.GrandTotal as Accounts,'' as InvoiceNote,(SELECT Count(vii.InvoiceItemId)
  FROM tbl_invoice_item as vii WHERE vii.IsDeleted = 0 AND vii.InvoiceId = i.InvoiceId ) as NumberOfDistributions,1 as Quantity,
  i.RRId as SOProposalNumber,'AH-Parts' as ItemID,ii.Description,30000 as G7LAccount, CONCAT('-',ii.Price) as
  UnitPrice,2 as TaxType,
  CONCAT('-',ii.Price) as Amount,i.LocalCurrencyCode,i.ExchangeRate,i.BaseCurrencyCode,i.BaseGrandTotal,
  ii.ItemTaxPercent,ii.ItemLocalCurrencyCode,ii.ItemExchangeRate,ii.ItemBaseCurrencyCode,ii.BasePrice,ii.BaseRate,ii.BaseTax
  FROM tbl_invoice i
  Left Join tbl_invoice_item ii on ii.InvoiceId = i.InvoiceId  AND ii.IsDeleted = 0  
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = i.SOId AND SO.IsDeleted = 0 
  LEFT JOIN tbl_po as PO ON SO.POId = PO.POId AND PO.IsDeleted = 0 
  LEFT JOIN tbl_vendor_invoice as vi on vi.POId=PO.POId  AND vi.IsDeleted = 0 
  Left Join tbl_customers c on i.CustomerId=c.CustomerId
  LEFT JOIN tbl_address_book ab1 on ab1.AddressId=i.ShipAddressId
  LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
  LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
  LEFT JOIN tbl_terms as TERM ON TERM.TermsId = i.TermsId
  where 1=1 `;
  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    wheresql += ` and i.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.IsDeleted >= 0) {
    wheresql += " and  i.IsDeleted ='" + obj.IsDeleted + "'  ";
  }
  if (obj.RRNo != "") {
    wheresql += " and ( i.RRNo ='" + obj.RRNo + "' ) ";
  }
  if (obj.RRId != "") {
    wheresql += " and ( i.RRId ='" + obj.RRId + "' ) ";
  }
  if (obj.InvoiceNo != "") {
    wheresql += " and ( i.InvoiceNo ='" + obj.InvoiceNo + "' ) ";
  }
  if (obj.CustomerId != "") {
    wheresql += " and i.CustomerId In(" + obj.CustomerId + ") ";
  }
  if (obj.CustomerPONo != "") {
    wheresql += " and ( i.CustomerPONo ='" + obj.CustomerPONo + "' ) ";
  }
  if (obj.InvoiceDate != null) {
    wheresql += " and ( i.InvoiceDate >='" + obj.InvoiceDate + "' ) ";
  }
  if (reqBody.hasOwnProperty('InvoiceDateTo') == true && reqBody.InvoiceDateTo != "") {
    wheresql += " and ( i.InvoiceDate <='" + reqBody.InvoiceDateTo + "' ) ";
  }
  if (obj.DueDate != null) {
    wheresql += " and ( i.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (reqBody.hasOwnProperty('DueDateTo') == true && reqBody.DueDateTo != "") {
    wheresql += " and ( i.DueDate <='" + reqBody.DueDateTo + "' ) ";
  }
  if (reqBody.hasOwnProperty('InvoiceType') == true && obj.InvoiceType != "") {
    wheresql += " and ( i.InvoiceType ='" + obj.InvoiceType + "' ) ";
  }
  if (reqBody.hasOwnProperty('Status') == true && obj.Status != "") {
    wheresql += " and ( i.Status ='" + obj.Status + "' ) ";
  }
  if (reqBody.hasOwnProperty('IsCSVProcessed') == true && obj.IsCSVProcessed != "") {
    wheresql += " and ( i.IsCSVProcessed ='" + obj.IsCSVProcessed + "' ) ";
  }
  if (reqBody.hasOwnProperty('CustomerInvoiceApproved') == true && obj.CustomerInvoiceApproved != "") {
    if (obj.CustomerInvoiceApproved == "true")
      wheresql += " and  i.Status='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
    else if (obj.CustomerInvoiceApproved == "false")
      wheresql += " and  i.Status !='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
  }
  if (reqBody.hasOwnProperty('VendorBillApproved') == true && obj.VendorBillApproved != "") {
    if (obj.VendorBillApproved == "true")
      wheresql += " and  vi.Status='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
    else if (obj.VendorBillApproved == "false")
      wheresql += " and  vi.Status !='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
  }
  if (obj.VendorBillCreated != "") {
    if (obj.VendorBillCreated == "true")
      wheresql += " and  vi.VendorInvoiceId > 0 ";
    else if (obj.VendorBillCreated == "false")
      wheresql += " and  vi.VendorInvoiceId IS NULL ";
  }
  if (obj.LocalCurrencyCode != "") {
    wheresql += " and ( i.LocalCurrencyCode ='" + obj.LocalCurrencyCode + "' ) ";
  }

  if (InvoiceIds != '') {
    wheresql += `and i.InvoiceId in(` + InvoiceIds + `)`;
  }

  wheresql += ` ORDER BY i.InvoiceId DESC`;
  var query = selectsql + wheresql;

  // console.log(query)
  return query;
};

Invoice.UpdateCustomerBlanketPOIdToInvoice = (Invoice, result) => {

  var sql = `UPDATE tbl_invoice  SET CustomerBlanketPOId=?,CustomerPONo=?  WHERE InvoiceId = ?`;
  var values = [Invoice.CustomerBlanketPOId, Invoice.CustomerPONo, Invoice.InvoiceId];
  // console.log("upd sql" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, Invoice);
    return;
  });
};

Invoice.IsExistCustomerBlanketPOIdForSOId = (SOId, result) => {

  var sql = `Select InvoiceId,'r' as D from tbl_invoice where IsDeleted=0 and SOId=${SOId}`;
  // console.log("upd sql" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

Invoice.IsExistCustomerBlanketPOIdForRRId = (RRId, result) => {

  var sql = `Select InvoiceId,'r' as D from tbl_invoice where IsDeleted=0 and RRId=${RRId}`;
  // console.log("upd sql" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

Invoice.getInvoiceListByServerSide = (Invoice, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT InvoiceId,
  c.CompanyName,i.CustomerId ,DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') as InvoiceDate,  DATE_FORMAT(i.DueDate,'%m/%d/%Y') as DueDate,
  DATEDIFF(i.DueDate,CURDATE()) as DueDateDiff, i.IsEmailSent,InvoiceNo, 
  ROUND(ifnull(i.GrandTotal,0),2) as GrandTotal
  ,i.RRNo,i.RRId,i.MROId,MRO.MRONo,
  i.LocalCurrencyCode,i.ExchangeRate,i.BaseCurrencyCode,  
  ROUND(ifnull(i.BaseGrandTotal,0),2) as BaseGrandTotal,  
  i.CreatedByLocation,
  CASE i.InvoiceType
   WHEN 0 THEN '${Constants.array_invoice_type[0]}'
   WHEN 2 THEN '${Constants.array_invoice_type[2]}'
   WHEN 3 THEN '${Constants.array_invoice_type[3]}'
   ELSE '-'	end InvoiceTypeName,i.InvoiceType,
  CASE i.Status
   WHEN 0 THEN '${Constants.array_invoice_status[0]}'
   WHEN 1 THEN '${Constants.array_invoice_status[1]}'
   WHEN 2 THEN '${Constants.array_invoice_status[2]}'
   WHEN 3 THEN '${Constants.array_invoice_status[3]}'
   WHEN 4 THEN '${Constants.array_invoice_status[4]}'
   WHEN 5 THEN '${Constants.array_invoice_status[5]}'
   WHEN 6 THEN '${Constants.array_invoice_status[6]}'
   WHEN 7 THEN '${Constants.array_invoice_status[7]}'
   WHEN 8 THEN '${Constants.array_invoice_status[8]}'
   ELSE '-'	end StatusName,i.Status,'' as InvoiceDateTo,'' as DueDateTo,i.CustomerPONo,i.IsCSVProcessed,'' CustomerInvoiceApproved,i.CustomerBlanketPOId,
   '' VendorBillApproved,i.IsDeleted,'' VendorBillCreated,Q.QuoteId,Q.QuoteNo,CUR.CurrencySymbol, IsEDIUpload, c.CustomerGroupId `;

  recordfilterquery = `Select count(InvoiceId) as recordsFiltered `;

  query = query + ` FROM tbl_invoice i
  LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
  LEFT JOIN tbl_mro as MRO on MRO.MROId=i.MROId
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = i.SOId AND SO.IsDeleted = 0 
  LEFT JOIN tbl_po as PO ON SO.POId = PO.POId AND PO.IsDeleted = 0 
  LEFT JOIN tbl_vendor_invoice as vi on vi.POId=PO.POId  AND vi.IsDeleted = 0 
  LEFT JOIN tbl_quotes as Q on Q.QuoteId=SO.QuoteId  AND Q.IsDeleted = 0
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = i.LocalCurrencyCode AND CUR.IsDeleted = 0
  where 1=1 `;

  var CustomerId = 0;
  if (Invoice.CustomerId != 0) {
    CustomerId = Invoice.CustomerId;
    query = query + ` and i.IsDeleted=0 and i.CustomerId In (${CustomerId}) `;
  }
  if (Invoice.IdentityType == 0 && Invoice.IsRestrictedCustomerAccess == 1 && Invoice.MultipleCustomerIds != "") {
    query += ` and i.CustomerId in(${Invoice.MultipleCustomerIds}) `;
  }
  //
  if (Invoice.search.value != '') {
    query = query + ` and (  InvoiceNo LIKE '%${Invoice.search.value}%'
        or i.CustomerId LIKE '%${Invoice.search.value}%' 
        or c.CompanyName LIKE '%${Invoice.search.value}%' 
        or i.Status LIKE '%${Invoice.search.value}%' 
        or i.InvoiceDate LIKE '%${Invoice.search.value}%' 
        or i.DueDate LIKE '%${Invoice.search.value}%'
        or i.InvoiceType LIKE '%${Invoice.search.value}%'
        or i.CustomerPONo LIKE '%${Invoice.search.value}%'
        or i.RRNo LIKE '%${Invoice.search.value}%'
      ) `;
  }

  var cvalue = 0;
  var InvoiceDate = DueDate = InvoiceDateTo = DueDateTo = ''; var IsDeleted = -1;
  for (cvalue = 0; cvalue < Invoice.columns.length; cvalue++) {

    if (Invoice.columns[cvalue].search.value != "") {
      switch (Invoice.columns[cvalue].name) {
        case "InvoiceDate":
          InvoiceDate = Invoice.columns[cvalue].search.value;
          break;
        case "InvoiceDateTo":
          InvoiceDateTo = Invoice.columns[cvalue].search.value;
          break;
        case "DueDate":
          DueDate = Invoice.columns[cvalue].search.value;
          break;
        case "DueDateTo":
          DueDateTo = Invoice.columns[cvalue].search.value;
          break;
        case "RRNo":
          query += " and ( i.RRNo = '" + Invoice.columns[cvalue].search.value + "' ) ";
          break;
        case "RRId":
          query += " and ( i.RRId = '" + Invoice.columns[cvalue].search.value + "' ) ";
          break;

        case "CustomerPONo":
          query += " and ( i.CustomerPONo = '" + Invoice.columns[cvalue].search.value + "' ) ";
          break;
        case "Status":
          query += " and ( i.Status = '" + Invoice.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and i.CustomerId In (" + Invoice.columns[cvalue].search.value + ") ";
          break;
        case "CompanyName":
          query += " and (c.CompanyName LIKE '%" + Invoice.columns[cvalue].search.value + "%') ";
          break;
        case "IsCSVProcessed":
          query += " and ( i.IsCSVProcessed='" + Invoice.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerInvoiceApproved":
          if (Invoice.columns[cvalue].search.value == "true")
            query += " and  i.Status='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
          else if (Invoice.columns[cvalue].search.value == "false")
            query += " and  i.Status !='" + Constants.CONST_INV_STATUS_APPROVED + "' ";
          break;
        case "VendorBillApproved":
          if (Invoice.columns[cvalue].search.value == "true")
            query += " and  vi.Status='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
          else if (Invoice.columns[cvalue].search.value == "false")
            query += " and  vi.Status !='" + Constants.CONST_VENDOR_INV_STATUS_APPROVED + "' ";
          break;
        case "VendorBillCreated":
          if (Invoice.columns[cvalue].search.value == "true")
            query += " and  vi.VendorInvoiceId > 0 ";
          else if (Invoice.columns[cvalue].search.value == "false")
            query += " and  vi.VendorInvoiceId IS NULL ";
          break;
        case "IsDeleted":
          IsDeleted = Invoice.columns[cvalue].search.value;
          query += " and i.IsDeleted = '" + Invoice.columns[cvalue].search.value + "' ";
          break;
        case "LocalCurrencyCode":
          query += " and ( i.LocalCurrencyCode = '" + Invoice.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedByLocation":
          query += " and ( i.CreatedByLocation = '" + Invoice.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerGroupId":
          query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + Invoice.columns[cvalue].name + " IN (" + Invoice.columns[cvalue].search.value + "))) ";
          break;
        default:
          query += " and ( " + Invoice.columns[cvalue].name + " LIKE '%" + Invoice.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  if (IsDeleted == -1) {
    query += "  and i.IsDeleted =0 ";
  }
  if (InvoiceDate != '' && InvoiceDateTo != '') {
    query += " and ( i.InvoiceDate >= '" + InvoiceDate + "' and i.InvoiceDate <= '" + InvoiceDateTo + "' ) ";
  }
  else {
    if (InvoiceDate != '') {
      query += " and ( i.InvoiceDate >= '" + InvoiceDate + "' ) ";
    }
    if (InvoiceDateTo != '') {
      query += " and ( i.InvoiceDate <= '" + InvoiceDateTo + "' ) ";
    }
  }
  if (DueDate != '' && DueDateTo != '') {
    query += " and ( i.DueDate >= '" + DueDate + "' and i.DueDate <= '" + DueDateTo + "' ) ";
  }
  else {
    if (DueDate != '') {
      query += " and ( i.DueDate >= '" + DueDate + "' ) ";
    }
    if (DueDateTo != '') {
      query += " and ( i.DueDate <= '" + DueDateTo + "' ) ";
    }
  }

  var i = 0;
  if (Invoice.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < Invoice.order.length; i++) {

    if (Invoice.order[i].column != "" || Invoice.order[i].column == "0")// 0 is equal to ""
    {
      switch (Invoice.columns[Invoice.order[i].column].name) {

        case "CustomerId":
          query += " i." + Invoice.columns[Invoice.order[i].column].name + " " + Invoice.order[i].dir + ",";
          break;

        case "RRId":
          query += " i." + Invoice.columns[Invoice.order[i].column].name + " " + Invoice.order[i].dir + ",";
          break;
        case "RRNo":
          query += " i." + Invoice.columns[Invoice.order[i].column].name + " " + Invoice.order[i].dir + ",";
          break;

        case "Status":
          query += " i." + Invoice.columns[Invoice.order[i].column].name + " " + Invoice.order[i].dir + ",";
          break;

        default://could be any column except above 
          query += " " + Invoice.columns[Invoice.order[i].column].name + " " + Invoice.order[i].dir + ",";

      }
    }
  }
  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  if (Invoice.start != "-1" && Invoice.length != "-1") {
    query += " LIMIT " + Invoice.start + "," + (Invoice.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(i.InvoiceId) as TotalCount 
  FROM tbl_invoice i
  LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
  LEFT JOIN tbl_mro as MRO on MRO.MROId=i.MROId
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = i.SOId AND SO.IsDeleted = 0 
  LEFT JOIN tbl_po as PO ON SO.POId = PO.POId AND PO.IsDeleted = 0 
  LEFT JOIN tbl_vendor_invoice as vi on vi.POId=PO.POId  AND vi.IsDeleted = 0 
  where i.IsDeleted='${IsDeleted >= 0 ? IsDeleted : 0}' `;
  if (CustomerId != 0) {
    TotalCountQuery = TotalCountQuery + `and i.CustomerId In (${CustomerId}) `;
  }
  if (Invoice.IdentityType == 0 && Invoice.IsRestrictedCustomerAccess == 1 && Invoice.MultipleCustomerIds != "") {
    TotalCountQuery += ` and i.CustomerId in(${Invoice.MultipleCustomerIds}) `;
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
        recordsTotal: results[2][0][0].TotalCount, draw: Invoice.draw
      });
      return;
    }
  );

};

//To get DueList Of Invoice
Invoice.getDueListOfInvoice = (Invoice, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT i.RRId,i.InvoiceId,i.InvoiceNo,c.CompanyName,rrp.PartNo,
  DATE_FORMAT(InvoiceDate,'%m/%d/%Y') as InvoiceDate, DATE_FORMAT(DueDate,'%m/%d/%Y') as DueDate, 
  DATEDIFF(DueDate,CURDATE()) as DueDateDiff,RRNo `;
  recordfilterquery = `Select count(InvoiceId) as recordsFiltered `;
  query = query + ` FROM tbl_invoice i
  LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId=i.RRId
  where i.IsDeleted=0 `;
  if (Invoice.IdentityType == 0 && Invoice.IsRestrictedCustomerAccess == 1 && Invoice.MultipleCustomerIds != "") {
    query += ` and i.CustomerId in(${Invoice.MultipleCustomerIds}) `;
  }
  var CustomerId = 0;
  if (Invoice.CustomerId != 0) {
    CustomerId = Invoice.CustomerId;
    query = query + ` and c.CustomerId In (${CustomerId}) `;
  }
  if (Invoice.search.value != '') {
    query = query + ` and (  InvoiceNo = '${Invoice.search.value}'
    or c.CompanyName LIKE '%${Invoice.search.value}%'  
    or InvoiceDate = '${Invoice.search.value}' 
    or DueDate = '${Invoice.search.value}'
    or RRNo = '${Invoice.search.value}'
    or rrp.PartNo = '${Invoice.search.value}'
    or i.GrandTotal = '${Invoice.search.value}'
  ) `;
  }
  query += " and i.DueDate <=CURRENT_DATE and i.Status=2 ORDER BY i.DueDate DESC ";

  var Countquery = recordfilterquery + query;
  if (Invoice.start >= 0 && Invoice.length > 0) {
    query += " LIMIT " + Invoice.start + "," + (Invoice.length);
  }
  query = selectquery + query;
  var TotalCountQuery = `SELECT Count(i.InvoiceId) as TotalCount 
  FROM tbl_invoice i
  LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId=i.RRId
  where i.IsDeleted=0  and i.DueDate <=CURRENT_DATE and i.Status=2 `;
  if (CustomerId != 0) {
    TotalCountQuery = TotalCountQuery + ` and c.CustomerId In (${CustomerId}) `;
  }
  if (Invoice.IdentityType == 0 && Invoice.IsRestrictedCustomerAccess == 1 && Invoice.MultipleCustomerIds != "") {
    TotalCountQuery += ` and i.CustomerId in(${Invoice.MultipleCustomerIds}) `;
  }
  //console.log("getDueListOfInvoice query = " + query);
  //console.log("getDueListOfInvoice Countquery = " + Countquery);
  //console.log("getDueListOfInvoice TotalCountQuery = " + TotalCountQuery);

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

Invoice.GetCustomerBlanketPOIdFromInvoice = (InvoiceId, result) => {
  var sql = `Select CustomerBlanketPOId,'Test' as T from tbl_invoice  WHERE IsDeleted=0 and InvoiceId =${InvoiceId}`;
  //  console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Invoice.Create = (Invoice, result) => {
  var sql = `insert into tbl_invoice(InvoiceNo,SONo,CustomerPONo,CustomerBlanketPOId,MROId,RRId,RRNo,CustomerId,
      InvoiceType,TermsId,InvoiceDate,DueDate,ReferenceNo,
      ShipAddressId,BillAddressId,LaborDescription,SubTotal,TaxPercent,
      TotalTax,Discount,AHFees,Shipping,AdvanceAmount,GrandTotal,BlanketPOExcludeAmount,BlanketPONetAmount,
      Status,Created,CreatedBy,RequestedById,RequestedByname,LeadTime,WarrantyPeriod,MROShippingHistoryId,IsCSVProcessed,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal,CreatedByLocation)
        values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [
    Invoice.InvoiceNo, Invoice.SONo, Invoice.CustomerPONo, Invoice.CustomerBlanketPOId, Invoice.MROId, Invoice.RRId, Invoice.RRNo, Invoice.CustomerId, Invoice.InvoiceType,
    Invoice.TermsId, Invoice.InvoiceDate, Invoice.DueDate, Invoice.ReferenceNo,
    Invoice.ShipAddressId, Invoice.BillAddressId, Invoice.LaborDescription,
    Invoice.SubTotal, Invoice.TaxPercent, Invoice.TotalTax, Invoice.Discount, Invoice.AHFees, Invoice.Shipping,
    Invoice.AdvanceAmount, Invoice.GrandTotal, Invoice.BlanketPOExcludeAmount, Invoice.BlanketPONetAmount, Invoice.Status
    , Invoice.Created, Invoice.CreatedBy, Invoice.CreatedBy
    , Invoice.RequestedByname, Invoice.LeadTime, Invoice.WarrantyPeriod, Invoice.MROShippingHistoryId, Invoice.IsCSVProcessed,
    Invoice.LocalCurrencyCode, Invoice.ExchangeRate, Invoice.BaseCurrencyCode, Invoice.BaseGrandTotal, Invoice.CreatedByLocation]

  // console.log(sql, values);

  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...Invoice });
    return;

  });
}

Invoice.update = (Invoice, result) => {

  var sql = ``;

  sql = `UPDATE tbl_invoice SET  
CustomerId = ?,InvoiceType = ?,TermsId = ? ,
InvoiceDate = ?, DueDate = ?,ReferenceNo = ?, 
ShipAddressId = ?, BillAddressId = ?,LaborDescription = ?,
SubTotal = ? ,TaxPercent=?, TotalTax = ?,Discount=?,
AHFees=?,Shipping=?,AdvanceAmount=?,
GrandTotal=?,BlanketPOExcludeAmount=?,BlanketPONetAmount=?,
Status=?,
Modified=?,ModifiedBy=?,
LocalCurrencyCode=?,ExchangeRate=?,BaseCurrencyCode=?,BaseGrandTotal=?
WHERE InvoiceId = ? `;

  var values = [
    Invoice.CustomerId, Invoice.InvoiceType,
    Invoice.TermsId,
    Invoice.InvoiceDate, Invoice.DueDate, Invoice.ReferenceNo,
    Invoice.ShipAddressId, Invoice.BillAddressId, Invoice.LaborDescription,
    Invoice.SubTotal, Invoice.TaxPercent, Invoice.TotalTax, Invoice.Discount,
    Invoice.AHFees, Invoice.Shipping,
    Invoice.AdvanceAmount, Invoice.GrandTotal, Invoice.BlanketPOExcludeAmount, Invoice.BlanketPONetAmount,
    Invoice.Status,
    Invoice.Modified, Invoice.ModifiedBy,
    Invoice.LocalCurrencyCode, Invoice.ExchangeRate, Invoice.BaseCurrencyCode, Invoice.BaseGrandTotal, Invoice.InvoiceId
  ]

  // console.log("Update tbl_invoice=" + values);

  con.query(sql, values, (err, res) => {

    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { id: Invoice.InvoiceId, ...Invoice });
    return;
  }
  );

};

Invoice.UpdateNonRRAndNonMROInvoice = (Invoice, result) => {

  var sql = ``;

  sql = `UPDATE tbl_invoice SET SubTotal = ?, BlanketPONetAmount = ?, BlanketPOExcludeAmount =?, TaxPercent=?, TotalTax = ?,Discount=?,
AHFees=?,Shipping=?,AdvanceAmount=?,GrandTotal=?,Modified=?,ModifiedBy=?,LocalCurrencyCode=?,ExchangeRate=?,BaseCurrencyCode=?,BaseGrandTotal=? WHERE InvoiceId = ? `;

  var values = [
    Invoice.SubTotal, Invoice.BlanketPONetAmount, Invoice.BlanketPOExcludeAmount, Invoice.TaxPercent, Invoice.TotalTax, Invoice.Discount,
    Invoice.AHFees, Invoice.Shipping, Invoice.AdvanceAmount, Invoice.GrandTotal,
    Invoice.Modified, Invoice.ModifiedBy, Invoice.LocalCurrencyCode, Invoice.ExchangeRate, Invoice.BaseCurrencyCode, Invoice.BaseGrandTotal, Invoice.InvoiceId
  ]
  // console.log("Update tbl_invoice=" + values);

  con.query(sql, values, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: Invoice.InvoiceId, ...Invoice });
    return;
  });
};

Invoice.UpdateInvoiceNoById = (objModel) => {
  var Obj = new Invoice({
    InvoiceId: objModel.InvoiceId,
    SOId: objModel.SOId,
  });
  var sql = `UPDATE tbl_invoice SET InvoiceNo=CONCAT('INV',${Obj.InvoiceId}),SOId='${Obj.SOId}'  WHERE InvoiceId=${Obj.InvoiceId}`;
  // console.log("UpdateInvoiceNoById=" + sql);
  return sql;
};

Invoice.UpdateCustomerPONoByRRId = (CustomerPONo, RRNo, result) => {
  var sql = `UPDATE tbl_invoice SET CustomerPONo ='${CustomerPONo}'  WHERE RRNo = '${RRNo}' `;
  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "RR not_found in Invoice" }, null);
      return;
    }
    result(null, CustomerPONo);
    return;
  });
};

Invoice.IsUsedCustomerBlanketPOId = (CustomerBlanketPOId, result) => {
  var sql = `Select CustomerBlanketPOId,'w' as d from tbl_invoice where IsDeleted=0 and CustomerBlanketPOId='${CustomerBlanketPOId}' `;
  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

Invoice.IsNonRRAndNonMRO = (InvoiceId, result) => {

  // var sql = `Select InvoiceId,'w' as s From tbl_invoice WHERE InvoiceId = ${InvoiceId} and RRId=0 and MROId=0 `;
  var sql = `Select InvoiceId,'w' as s From tbl_invoice WHERE InvoiceId = ${InvoiceId} and MROId=0 `;
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

Invoice.GetInvoiceDetail = (SOId, result) => {
  var sql = `Select *
from tbl_invoice i
Left Join tbl_invoice_item ii on i.InvoiceId=ii.InvoiceId
where i.IsDeleted=0 and ii.IsDeleted=0 and i.SOId='${SOId}' `;
  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

Invoice.view = (InvoiceId, IdentityType, IsDeleted, reqBody) => {

  var MultipleAccessIdentityIds = getLogInMultipleAccessIdentityIds(reqBody);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(reqBody);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqBody);
  var LoginIdentityType = getLogInIdentityType(reqBody);

  var sql = `
   Select i.InvoiceId,i.InvoiceNo,SONo,i.SOId,i.RRId,c.CustomerId,c.CompanyName,i.IsEmailSent,
  case InvoiceType
    WHEN 0 THEN '${Constants.array_invoice_type[0]}'
    WHEN 2 THEN '${Constants.array_invoice_type[2]}'
    WHEN 3 THEN '${Constants.array_invoice_type[3]}'
    ELSE '-'
    end InvoiceTypeName,InvoiceType,
  i.TermsId,t.TermsName,DATE_FORMAT(i.InvoiceDate,'%Y-%m-%d') as InvoiceDate,i.CreatedByLocation,ic.CountryName as CreatedByLocationName,
  DATE_FORMAT(i.DueDate,'%Y-%m-%d') as DueDate,ReferenceNo,ShipAddressId,
  BillAddressId,LaborDescription, 
  ROUND(ifnull(i.SubTotal,0),2) as SubTotal, 
  ROUND(ifnull(i.TaxPercent,0),2) as TaxPercent,
  ROUND(ifnull(i.TotalTax,0),2) as TotalTax,
  ROUND(ifnull(i.Discount,0),2) as Discount,
  ROUND(ifnull(i.AHFees,0),2) as AHFees,
  ROUND(ifnull(i.Shipping,0),2) as Shipping,
  ROUND(ifnull(i.AdvanceAmount,0),2) as AdvanceAmount,
  ROUND(ifnull(i.GrandTotal,0),2) as GrandTotal,
  ROUND(ifnull(i.BlanketPOExcludeAmount,0),2) as BlanketPOExcludeAmount,
  ROUND(ifnull(i.BlanketPONetAmount,0),2) as BlanketPONetAmount,  
  Case i.Status
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
  end StatusName,i.Status,
  i.RequestedById,i.RequestedByname,i.ApprovedById,i.ApprovedByName,
  DATE_FORMAT(i.ApprovedDate,'%m/%d/%Y') as ApprovedDate,i.RRNo,i.LeadTime,i.WarrantyPeriod,
  i.CustomerPONo, rr.PartId as RepairPartId, c.CustomerCode,i.ReOpenedBy,
  DATE_FORMAT(i.ReOpenedDate,'%m/%d/%Y') as ReOpenedDate,i.ReOpenedByName,mro.MRONo,ifnull(mro.MROId, 0) MROId,i.IsDeleted,
  CONCAT(u1.FirstName,' ',u1.LastName) as DeletedByName,DATE_FORMAT(u1.Modified,'%Y-%m-%d') DeletedDate,  
  ROUND(ifnull(p.GrandTotal,0),2) as POGrandTotal,
  i.CustomerBlanketPOId,c.CustomerVATNo,
  i.LocalCurrencyCode,i.ExchangeRate,
  i.BaseCurrencyCode,  
  ROUND(ifnull(i.BaseGrandTotal,0),2) as BaseGrandTotal,
  c.CustomerCurrencyCode as CustomerCurrencyCode,c.CustomerLocation as CustomerLocation,
  CUR.CurrencySymbol as CustomerCurrencySymbol,CON.VatTaxPercentage,CURI.CurrencySymbol,CURV.CurrencySymbol as VendorCurrencySymbol,v.vendorCurrencyCode,
  (SELECT ConsolidateInvoiceId FROM tbl_invoice_consolidate_detail where InvoiceId=i.InvoiceId AND IsDeleted = 0 LIMIT 1) as ConsolidateInvoiceId,
   IF((SELECT ConsolidateInvoiceId FROM tbl_invoice_consolidate_detail where InvoiceId=i.InvoiceId AND IsDeleted = 0 LIMIT 1)>0, true, false) as Consolidated, IsEDIUpload
  from tbl_invoice i
  LEFT JOIN tbl_customers c on i.CustomerId=c.CustomerId
  LEFT JOIN tbl_po as p ON p.SOId = i.SOId  AND p.Status !=5 AND p.IsDeleted = 0 AND p.SOId>0
  LEFT JOIN tbl_terms t ON t.TermsId = i.TermsId
  LEFT JOIN tbl_repair_request rr on rr.RRId=i.RRId
  Left JOIN tbl_mro mro ON  mro.MROId = i.MROId AND mro.IsDeleted = 0
  LEFT JOIN tbl_users u1 ON u1.UserId = i.ModifiedBy
  LEFT JOIN tbl_vendors v on p.VendorId=v.VendorId
  LEFT JOIN tbl_currencies CURI ON CURI.CurrencyCode = i.LocalCurrencyCode AND CURI.IsDeleted = 0
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = c.CustomerCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies CURV ON CURV.CurrencyCode = v.VendorCurrencyCode AND CURV.IsDeleted = 0
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = c.CustomerLocation AND CON.IsDeleted = 0
 LEFT JOIN tbl_countries as ic  ON ic.CountryId = i.CreatedByLocation AND ic.IsDeleted = 0
  where i.IsDeleted='${IsDeleted}' and i.InvoiceId='${InvoiceId}' `;
  if (IdentityType == 1) {
    sql += ` and i.CustomerId In (${MultipleAccessIdentityIds}) `;
  }
  if (LoginIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and i.CustomerId in(${MultipleCustomerIds}) `;
  }

  // console.log("Invoice View" + sql)
  return sql;
}

Invoice.CustomerPaidInvocieQuery = (ReqBody, result) => {

  var datecond = '';
  if (ReqBody.hasOwnProperty('startDate') && ReqBody.hasOwnProperty('endDate')) {
    const Fromdatearray = ReqBody.startDate.split('T');
    const Todatearray = ReqBody.endDate.split('T');
    var fromDate = Fromdatearray[0];
    var toDate = Todatearray[0];
    datecond = ` AND (InvoiceDate BETWEEN  '${fromDate}' AND '${toDate}') `;
  }

  var sqlPaidInvoice = `SELECT SUM(GrandTotal)  as PaidAmount
  FROM tbl_invoice 
  WHERE IsDeleted = 0 AND Status= ${Constants.CONST_INV_STATUS_APPROVED}  AND CustomerId = '${ReqBody.CustomerId} '`
  sqlPaidInvoice += datecond;
  sqlPaidInvoice += `GROUP BY CustomerId`;

  return sqlPaidInvoice;
}

Invoice.CustomerUnPaidInvocieQuery = (ReqBody, result) => {
  var datecond = '';
  if (ReqBody.hasOwnProperty('startDate') && ReqBody.hasOwnProperty('endDate')) {
    const Fromdatearray = ReqBody.startDate.split('T');
    const Todatearray = ReqBody.endDate.split('T');
    var fromDate = Fromdatearray[0];
    var toDate = Todatearray[0];
    datecond = ` AND (InvoiceDate BETWEEN  '${fromDate}' AND '${toDate}') `;
  }
  var sqlUnpaidInvoice = `SELECT SUM(GrandTotal)  as UnPaidAmount
  FROM tbl_invoice 
  WHERE IsDeleted = 0 AND Status= ${Constants.CONST_INV_STATUS_OPEN}  AND CustomerId = '${ReqBody.CustomerId} '`;
  sqlUnpaidInvoice += datecond;
  sqlUnpaidInvoice += `GROUP BY CustomerId`;
  return sqlUnpaidInvoice;
}

Invoice.getCustomerInvoiceStatstics = (ReqBody, result) => {

  var datecond = '';
  if (ReqBody.hasOwnProperty('startDate') && ReqBody.hasOwnProperty('endDate')) {
    const Fromdatearray = ReqBody.startDate.split('T');
    const Todatearray = ReqBody.endDate.split('T');
    var fromDate = Fromdatearray[0];
    var toDate = Todatearray[0];
    datecond = ` AND (InvoiceDate BETWEEN  '${fromDate}' AND '${toDate}') `;
  }

  var sqlPaidInvoice = `SELECT SUM(GrandTotal)  as PaidAmount
FROM tbl_invoice 
WHERE IsDeleted = 0 AND Status= ${Constants.CONST_INV_STATUS_APPROVED}  AND CustomerId = '${ReqBody.CustomerId} '`
  sqlPaidInvoice += datecond;
  sqlPaidInvoice += `GROUP BY CustomerId`;

  var sqlUnpaidInvoice = `SELECT SUM(GrandTotal)  as UnPaidAmount
FROM tbl_invoice 
WHERE IsDeleted = 0 AND Status= ${Constants.CONST_INV_STATUS_OPEN}  AND CustomerId = '${ReqBody.CustomerId} '`;
  sqlUnpaidInvoice += datecond;
  sqlUnpaidInvoice += `GROUP BY CustomerId`;


  async.parallel([
    function (result) { con.query(sqlPaidInvoice, result) },
    function (result) { con.query(sqlUnpaidInvoice, result) }
  ],

    function (err, results) {
      if (err)
        return result(err, null);



      /* var PaidAmount = "0";
       var UnPaidAmount = "0";
       if(results[0][0][0]) {
        var PaidAmount = results[0][0][0].hasOwnProperty('PaidAmount') ? results[0][0][0].PaidAmount : 0;
       }
       if(results[1][0][0]) {
        var UnPaidAmount =results[1][0][0].hasOwnProperty('UnPaidAmount') ? results[1][0][0].UnPaidAmount : 0;
       }*/
      result(null, { PaidAmount: PaidAmount, UnPaidAmount: UnPaidAmount });
      return;
    }
  );

};

Invoice.findById = (InvoiceId, IdentityType, IsDeleted, reqBody, result) => {

  IsDeleted = IsDeleted >= 0 ? IsDeleted : 0;
  var sql = Invoice.view(InvoiceId, IdentityType, IsDeleted, reqBody);
  con.query(sql, (err, res1) => {
    if (err) {
      return result(err, null);
    }
    var RRId = 0; var MROId = 0;
    var sqlLastShippHistorybyRRIdquery = '';
    if (res1.length > 0) {
      if (res1[0].RRId) {
        RRId = res1[0].RRId;
      }
      if (res1[0].MROId) {
        MROId = res1[0].MROId;
      }

      if (RRId > 0) {
        sqlLastShippHistorybyRRIdquery = RRSHModel.LastShippHistorybyRRIdquery(RRId);
      } else if (MROId > 0) {
        sqlLastShippHistorybyRRIdquery = RRSHModel.LastShippHistorybyMROIdquery(MROId);
      } else {
        sqlLastShippHistorybyRRIdquery = "Select '-' NoRecord"
      }

      //var sqlInvoice = Invoice.view(InvoiceId, IdentityType);
      var sqlInvoiceItem = InvoiceItem.view(InvoiceId);
      var sqlInvoiceItemTax = InvoiceItem.calculateVat(InvoiceId);
      var sqlGlobalCustomerReference = GlobalCustomerReference.view(Constants.CONST_IDENTITY_TYPE_INVOICE, InvoiceId);
      var sqlContactAddress = Address.ViewContactAddressByCustomerId(res1[0].CustomerId);
      var sqlBillingAddress = Address.GetBillingAddressIdByCustomerId(res1[0].CustomerId);
      var sqlShippingAddress = Address.GetShippingAddressIdByCustomerId(res1[0].CustomerId);
      var sqlRemitToAddress = Address.GetRemitToAddressIdByCustomerId(res1[0].CustomerId);
      var sqlNotes = Notes.ViewNotes(Constants.CONST_IDENTITY_TYPE_INVOICE, InvoiceId);
      var sqlAttachment = AttachmentModel.ListAttachmentQuery(Constants.CONST_IDENTITY_TYPE_INVOICE, InvoiceId);
      var sqlCustomerReference = '';
      if (RRId > 0)
        sqlCustomerReference = RRCustomerReference.ViewCustomerReference(RRId);
      else if (res1[0].MROId)
        sqlCustomerReference = RRCustomerReference.ViewMROCustomerReference(res1[0].MROId);
      else
        sqlCustomerReference = "Select '-' NoRecord"

      var sqlAHBillingAddress = Address.listquery(Constants.CONST_IDENTITY_TYPE_VENDOR, Constants.AH_GROUP_VENDOR_ID, 2);

      var VendorPOCost = InvoiceItem.VendorPOByInvoice(InvoiceId);
      var EdiList = EdiModel.listByInvoiceId(InvoiceId);

      async.parallel([
        function (result) { con.query(sql, result) },
        function (result) { con.query(sqlInvoiceItem, result) },
        function (result) { con.query(sqlGlobalCustomerReference, result) },
        function (result) { con.query(sqlContactAddress, result) },
        function (result) { con.query(sqlBillingAddress, result) },
        function (result) { con.query(sqlNotes, result) },
        function (result) { con.query(sqlAttachment, result) },
        function (result) { con.query(sqlLastShippHistorybyRRIdquery, result) },
        function (result) { con.query(sqlCustomerReference, result) },
        function (result) { con.query(sqlAHBillingAddress, result) },
        function (result) { con.query(VendorPOCost, result) },
        function (result) { con.query(sqlShippingAddress, result) },
        function (result) { con.query(EdiList, result) },
        function (result) { con.query(sqlRemitToAddress, result) },
        function (result) { con.query(sqlInvoiceItemTax, result) },

      ],


        function (err, results) {
          if (err) {
            return result(err, null);
          }

          // console.log(results[0][0].length)
          if (results[0][0].length > 0) {
            result(null, { InvoiceInfo: results[0][0], InvoiceItem: results[1][0], CustomerRef: results[2][0], ContactAddressInfo: results[3][0], BillingAddressInfo: results[4][0], NotesList: results[5][0], AttachmentList: results[6][0], LastShippingHistory: results[7][0], RRCustomerReference: results[8][0], AHBillingAddress: results[9][0], VendorPOCost: results[10][0][0], ShippingAddressInfo: results[11][0], EdiStatusList: results[12][0], RemitToAddress: results[13][0][0], invoiceTax: results[14][0][0] });
            return;
          } else {
            return result({ msg: "Invoice not found" }, null);
          }
        });
    }
    else {
      return result({ msg: "No record Found" }, null);
    }
  });

};

Invoice.ValidateAlreadyExistRRId = (RRId, SOId, result) => {
  var sql = `SELECT InvoiceId, RRId, CustomerId FROM tbl_invoice where IsDeleted = 0 AND Status!= ${Constants.CONST_INV_STATUS_CANCELLED} and  RRId = ${RRId}  `;
  if (SOId > 0)
    sql += `and SOId = ${SOId} `

  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    //console.log("RrId Loaded :", res);
    result(null, res);
  });
}

//To get all the LPP price of the parts
Invoice.listPartsLPP = (ReqBody, result) => {

  var sql = `SELECT  ROUND(ifnull(IP.Price,0),2) as  LPP , I.Modified 
  from tbl_invoice as I
  LEFT JOIN tbl_invoice_item IP on IP.InvoiceId=I.InvoiceId AND IP.IsDeleted = 0 
  where I.IsDeleted = 0 AND IP.PartId = ${ReqBody.PartId} AND I.Status = ${Constants.CONST_INV_STATUS_APPROVED} AND  I.CustomerId=${ReqBody.CustomerId}`;

  var sql_parts = `SELECT p.PartNo, IFNULL((cp.NewPrice* EXR.ExchangeRate),(p.Price* EXRP.ExchangeRate)) as PON 
                   from tbl_parts p
                   LEFT JOIN tbl_customer_parts cp ON cp.PartId = p.PartId AND cp.CustomerId = ${ReqBody.CustomerId}
                   LEFT JOIN  tbl_customers as C ON C.CustomerId =  ${ReqBody.CustomerId} AND C.IsDeleted = 0 
                   LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = cp.LocalCurrencyCode AND EXR.TargetCurrencyCode = C.CustomerCurrencyCode AND  (CURDATE() between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
                   LEFT JOIN tbl_currency_exchange_rate as EXRP ON EXRP.SourceCurrencyCode = p.LocalCurrencyCode AND EXRP.TargetCurrencyCode = C.CustomerCurrencyCode AND  (CURDATE() between EXRP.FromDate and EXRP.ToDate) AND EXRP.IsDeleted = 0 
                   where p.IsDeleted=0 and p.PartId=${ReqBody.PartId}`;

  var sql_recomm = `SELECT AVG((IP.Price + IP.Tax)) as RecommendedPrice
  from tbl_invoice as I
  LEFT JOIN tbl_invoice_item IP on IP.InvoiceId=I.InvoiceId AND IP.IsDeleted = 0 
  where I.IsDeleted = 0 AND IP.PartId = ${ReqBody.PartId} AND I.Status = ${Constants.CONST_INV_STATUS_APPROVED} AND  I.CustomerId=${ReqBody.CustomerId} GROUP BY IP.PartId`;

  async.parallel([
    function (result) { con.query(sql_parts, result) },
    function (result) { con.query(sql, result) },
    function (result) { con.query(sql_recomm, result) },
  ],

    function (err, results) {
      if (err)
        return result(err, null);

      if (results[0][0].length > 0) {
        return result(null, { PartInfo: results[0][0][0], LPPInfo: results[1][0], RecommendedPrice: results[2][0][0] });
      } else {
        return result({ msg: "Part not found" }, null);
      }
    }
  );

}

Invoice.UpdateInvoiceDueDatebyInvoiceONo = (objInvoice, result) => {
  var sql = `Update tbl_invoice  SET DueDate='${objInvoice.CustomerInvoiceDueDate}' WHERE IsDeleted=0 and InvoiceNo='${objInvoice.CustomerInvoiceNo}'`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { InvoiceNo: objInvoice.CustomerInvoiceNo });
    return;
  }
  );
};

//To Get Email Content For Invoice
Invoice.GetEmailContentForInvoice = (Invoice, result) => {

  var sql = `SELECT i.InvoiceId as IdentityId,'${Constants.CONST_IDENTITY_TYPE_INVOICE}' as IdentityType,
  REPLACE(T.Subject,'{InvoiceNo}',i.InvoiceNo)as Subject,
  REPLACE(T.Content,'{InvoiceNo}',i.InvoiceNo)as Content,i.InvoiceNo,tc.Email , GS.AppEmail,GS.AppCCEmail
  from tbl_invoice i
  LEFT JOIN tbl_customers tc on tc.CustomerId=i.CustomerId
  LEFT JOIN tbl_email_template T on T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_INVOICE_EMAIL}' 
  LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
  where i.InvoiceId=${Invoice.IdentityId}`;

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

    result({ msg: "Invoice not found" }, null);
  });


}

Invoice.SendInvoiceEmailByInvoiceList = (InvoiceList, result) => {
  for (let val of InvoiceList) {

    var sql = `SELECT REPLACE(T.Subject,'{InvoiceNo}',i.InvoiceNo)as Subject,
  REPLACE(T.Content,'{InvoiceNo}',i.InvoiceNo)as Content,i.InvoiceNo,tc.Email 
  from tbl_invoice i
  LEFT JOIN tbl_customers tc on tc.CustomerId=i.CustomerId
  LEFT JOIN tbl_email_template T on T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_INVOICE_EMAIL}' 
  where i.InvoiceId=${val.InvoiceId}`;

    // console.log("val " + sql);
    con.query(sql, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      // console.log("Len :" + res);
      if (res.length > 0 && res[0].Email != "" && res[0].Email != null) {
        let HelperOptions = {
          from: Constants.CONST_AH_FROM_EMAIL_ID,
          to: res[0].Email,
          subject: res[0].Subject,
          text: res[0].Content
        };

        gmailTransport.sendMail(HelperOptions, (error, info) => {
          if (error) {
            result(err, null);
          }
          if (!error) {
            var sql = Invoice.UpdateIsEmailSent(val.InvoiceId);
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
  result(null, InvoiceList);
  return;
};

//To Update IsEmailSent
Invoice.UpdateIsEmailSent = (InvoiceId) => {
  var sql = ``;
  sql = `Update tbl_invoice SET IsEmailSent='1' WHERE IsDeleted=0 and InvoiceId='${InvoiceId}'`;
  return sql;
}

Invoice.UpdateInvoiceDueAutoUpdate = (InvoiceId, LeadTime, result) => {

  var sql = `Update tbl_invoice  SET DueDate = DATE_ADD(CURDATE(), INTERVAL ${LeadTime} DAY) WHERE IsDeleted=0 and InvoiceId='${InvoiceId}'`;

  // var sql = `Update tbl_invoice  SET DueDate = DATE_ADD(CURDATE(), INTERVAL ${LeadTime} +
  // IF((WEEK(CURDATE()) <> WEEK(DATE_ADD(CURDATE(), INTERVAL ${LeadTime} DAY)))
  //   OR (WEEKDAY(DATE_ADD(CURDATE(), INTERVAL ${LeadTime} DAY)) IN (5, 6)),2,0)
  // DAY) WHERE IsDeleted=0 and InvoiceId='${InvoiceId}'`;

  /* var sql = `Update tbl_invoice  SET DueDate = DATE_ADD(CURDATE(), INTERVAL ${LeadTime} +
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
   DAY) WHERE IsDeleted=0 and InvoiceId='${InvoiceId}'`;*/

  return sql;
};

Invoice.UpdateSOIdByInvoiceId = (SOId, InvoiceId, result) => {
  var sql = `Update tbl_invoice  SET SOId ='${SOId}' WHERE IsDeleted=0 and InvoiceId='${InvoiceId}'`;
  //  console.log("" + sql)
  return sql;
};

// To delete Invoice
Invoice.remove = (id, result) => {
  var sql = `Update tbl_invoice set IsDeleted=1,Modified='${cDateTime.getDateTime()}',ModifiedBy = '${global.authuser.UserId}' WHERE InvoiceId = ? `;
  var reset_rr = `UPDATE tbl_repair_request SET CustomerInvoiceId = 0,CustomerInvoiceNo='',CustomerInvoiceDueDate=null,ModifiedBy='${global.authuser.UserId}',Modified='${cDateTime.getDateTime()}' WHERE CustomerInvoiceId = ${id}`;
  async.parallel([
    function (result) { con.query(sql, id, result) },
    function (result) { con.query(reset_rr, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, results[0][0]);
    }
  );
};

Invoice.getInvSoBPODetails = (id, result) => {
  //console.log("res res1 res res1");
  var sql = `Select CustomerBlanketPOId,CustomerPONo,BlanketPONetAmount,SOId,RRId,CustomerBlanketPOId,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode From tbl_invoice  WHERE InvoiceId = ? `;
  con.query(sql, id, (err, res) => {
    if (err) {
      return result(err, null);
    }
    //  console.log(res);
    var sql1 = `Select CustomerBlanketPOId as SOCustomerBlanketPOId,CustomerPONo as SOCustomerPONo,BlanketPONetAmount as SOBlanketPONetAmount, CustomerBlanketPOId as SOCustomerBlanketPOId,QuoteId,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode From tbl_sales_order  WHERE SOId = ? `;
    con.query(sql1, res[0].SOId, (err1, res1) => {
      if (err1) {
        return result(err1, null);
      }
      // console.log(res1);
      return result(null, { InvInfo: res[0], SoInfo: res1[0] });
    });
  });
};

// Invoice.removeBySOId = (SOId, result) => {
//   SalesOrder.GetTypeBySO(SOId, (err, data) => {
//     console.log(data[0]);
//     if (data && data.length > 0) {
//       var bpoPayload = {
//         QuoteId:data[0].QuoteId,
//         CustomerPONo:"",
//         BlanketPONetAmount:data[0].BlanketPONetAmount,
//         Comments:"Delete Invoice/SO",
//         LocalCurrencyCode:data[0].LocalCurrencyCode,
//         ExchangeRate:data[0].ExchangeRate,
//         BaseCurrencyCode:data[0].BaseCurrencyCode,
//         CustomerBlanketPOId:data[0].CustomerBlanketPOId
//       };
// console.log(bpoPayload);
//       if ((data[0].Type === "RR" || data[0].Type === "MRO")) {
//         var sql = `Update tbl_invoice set IsDeleted=1,Modified='${cDateTime.getDateTime()}',ModifiedBy = '${global.authuser.UserId}' WHERE SOId = ? `;
//         if (data[0].Type == "RR") {
//           bpoPayload.RRId = data[0].ID;
//           var reset_rr = `UPDATE tbl_repair_request SET CustomerInvoiceId = 0,CustomerInvoiceNo='',CustomerInvoiceDueDate=null,ModifiedBy='${global.authuser.UserId}',Modified='${cDateTime.getDateTime()}' WHERE RRId = ${data[0].ID}`;
//         } else {
//           bpoPayload.MROId = data[0].ID;
//           var reset_rr = `UPDATE tbl_mro SET CustomerInvoiceId = 0,CustomerInvoiceNo='',CustomerInvoiceDueDate=null,ModifiedBy='${global.authuser.UserId}',Modified='${cDateTime.getDateTime()}' WHERE MROId = ${data[0].ID}`;
//         }
//         async.parallel([
//           function (result) { con.query(sql, SOId, result) },
//           function (result) { con.query(reset_rr, result) },
//           function (result) { SalesOrder.updateBlanketPoDetailsOnDelete(bpoPayload, result)}
//         ],
//           function (err, results) {
//             if (err)
//               return result(err, null);

//             return result(null, results[0][0]);
//           }
//         );
//       }
//     }
//   });
// };
// SalesOrder.updateBlanketPoDetailsOnDelete = (parse,result) => {
//   if(parse.CustomerBlanketPOId > 0){
//     async.parallel([
//       function (result) {CustomerBlanketPOModel.GetCurrentBalance(parse.CustomerBlanketPOId, result);},
//     ],function (err, results) {
//       if (err)
//         Reqresponse.printResponse(res, err, null);
//       else {
//         var _CustomerBlanketPOId = parse.CustomerBlanketPOId > 0 ? parse.CustomerBlanketPOId : 0;
//         var CurrentBalance = results[0].length > 0 ? results[0][0].CurrentBalance : 0;
//         var boolean = parseFloat(parse.BlanketPONetAmount) <= parseFloat(CurrentBalance) ? true : false;
//         if (boolean) {
//               CustomerBlanketPOModel.GetCurrentBalance(_CustomerBlanketPOId, (err, data) => {
//                 if (err) {
//                   Reqresponse.printResponse(res, err, null);
//                 }
//                 if (data.length > 0) {
//                   var RefundHistoryObj = new CustomerBlanketPOHistoryModel({
//                     BlanketPOId: _CustomerBlanketPOId,
//                     RRId: parse.RRId ? parse.RRId : 0,
//                     MROId: parse.MROId ? parse.MROId : 0,
//                     PaymentType: 1,
//                     Amount: parseFloat(parse.BlanketPONetAmount),
//                     CurrentBalance: parseFloat(data[0].CurrentBalance) + parseFloat(parse.BlanketPONetAmount),
//                     QuoteId: parse.QuoteId,
//                     Comments: parse.Comments,
//                     LocalCurrencyCode: parse.LocalCurrencyCode ? parse.LocalCurrencyCode : 'USD',
//                     ExchangeRate: parse.ExchangeRate ? parse.ExchangeRate : 1,
//                     BaseCurrencyCode: parse.BaseCurrencyCode ? parse.BaseCurrencyCode : 'USD',
//                     BaseAmount: parseFloat(parse.BlanketPONetAmount) * parseFloat(parse.ExchangeRate ? parse.ExchangeRate : 1),
//                     BaseCurrentBalance: (parseFloat(data[0].CurrentBalance) + parseFloat(parse.BlanketPONetAmount)) * parseFloat(parse.ExchangeRate ? parse.ExchangeRate : 1)
//                   });
//                   console.log(RefundHistoryObj);

//                   async.parallel([
//                     function (result) { CustomerBlanketPOHistoryModel.Create(RefundHistoryObj, result); },
//                     function (result) { CustomerBlanketPOModel.Refund(_CustomerBlanketPOId, parse.BlanketPONetAmount, result); },
//                   ],
//                     function (err, results) {
//                       if (err) {
//                         result(err, null);
//                       }else{
//                         result(err, results);
//                       }
//                     });
//                 }
//               });
//             }
//       }
//     });
//   }
// };

Invoice.UpdateInvoiceByInvoiceIdAfterInvoiceItemDelete = (ObjModel, result) => {

  var Obj = new Invoice(ObjModel);
  var sql = `Update tbl_invoice set SubTotal=?,GrandTotal=?,BaseGrandTotal=?,Modified=?,ModifiedBy=?,BlanketPONetAmount=?,BlanketPOExcludeAmount=? where InvoiceId=? `;
  var values = [Obj.SubTotal, Obj.GrandTotal, Obj.BaseGrandTotal, Obj.Modified, Obj.ModifiedBy, Obj.BlanketPONetAmount, Obj.BlanketPOExcludeAmount, Obj.InvoiceId];
  // console.log(values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

//Global Search
Invoice.findInColumns = (searchQuery, result) => {

  const { from, size, query } = searchQuery;
  let { IdentityType, MultipleAccessIdentityIds, IsRestrictedCustomerAccess, MultipleCustomerIds } = global.authuser;
  var sql = `SELECT 'ahoms-sales-invoice' as _index,
  I.InvoiceId as invoiceid, I.InvoiceNo as invoiceno, I.SOId as soid, I.SONo as sono, C.CustomerId as customerid, C.CustomerCode as customercode, C.CompanyName as companyname
  FROM tbl_invoice as I
  LEFT JOIN tbl_customers as C ON C.CustomerId = I.CustomerId
  where
  (
    I.InvoiceNo like '%${query.multi_match.query}%' or
	  I.SOId like '%${query.multi_match.query}%' or
    I.SONo like '%${query.multi_match.query}%' or
    I.RRId like '%${query.multi_match.query}%' or
    I.RRNo like '%${query.multi_match.query}%' or
    I.LaborDescription like '%${query.multi_match.query}%' or
    C.CustomerCode like '%${query.multi_match.query}%' or
    C.FirstName like '%${query.multi_match.query}%' or
    C.LastName like '%${query.multi_match.query}%' or
    C.Email like '%${query.multi_match.query}%' or
    C.CompanyName like '%${query.multi_match.query}%' or
    C.PriorityNotes like '%${query.multi_match.query}%'
  ) and I.IsDeleted=0 
${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND I.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size}`;

  var countSql = `SELECT count(*) AS totalCount 
  FROM tbl_invoice as I
  LEFT JOIN tbl_customers as C ON C.CustomerId = I.CustomerId
  where
  (
    I.InvoiceNo like '%${query.multi_match.query}%' or
	  I.SOId like '%${query.multi_match.query}%' or
    I.SONo like '%${query.multi_match.query}%' or
    I.RRId like '%${query.multi_match.query}%' or
    I.RRNo like '%${query.multi_match.query}%' or
    I.LaborDescription like '%${query.multi_match.query}%' or
    C.CustomerCode like '%${query.multi_match.query}%' or
    C.FirstName like '%${query.multi_match.query}%' or
    C.LastName like '%${query.multi_match.query}%' or
    C.Email like '%${query.multi_match.query}%' or
    C.CompanyName like '%${query.multi_match.query}%' or
    C.PriorityNotes like '%${query.multi_match.query}%'
  ) and I.IsDeleted=0
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND I.CustomerId IN (${MultipleCustomerIds}) ` : ""}
   `


  // console.log("" + sql)
  // console.log("" + countSql)
  con.query(countSql, (err, res) => {
    if (err) {
      return result(err, null);
    } else if (res[0].totalCount > 0) {
      let totalCount = res[0].totalCount;
      con.query(sql, (err, res) => {
        if (err) {
          return result(err, null);
        }
        return result(null, { totalCount: { "_index": "ahoms-sales-invoice", val: totalCount }, data: res });
      });
    } else {
      return result(null, []);
    }

  });
}

Invoice.SelectInvoiceStatus = (InvoiceId, result) => {
  var sql = `Select I.CustomerBlanketPOId,I.InvoiceId,I.Status,Q.QuoteId,I.BlanketPOExcludeAmount,I.BlanketPONetAmount from tbl_invoice as I
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = I.SOId AND I.IsDeleted = 0
  LEFT JOIN tbl_quotes as Q ON Q.QuoteId = SO.QuoteId AND Q.IsDeleted = 0
  where I.IsDeleted=0 and I.InvoiceId='${InvoiceId}'`;
  //console.log("sq" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

Invoice.DeleteInvoiceQuery = (RRId) => {
  var Obj = new Invoice({ RRId: RRId });
  var sql = `UPDATE tbl_invoice SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE IsDeleted = 0 AND RRId>0 AND RRId=${Obj.RRId}`;
  //console.log(sql);
  return sql;
}

//
Invoice.ReOpenInvoice = (obj, result) => {
  var sql = ``;
  sql = `UPDATE tbl_invoice SET ReOpenedBy = ?,ReOpenedByName = ?,
  ReOpenedDate = ?,Status = ?,
  Modified = ?,ModifiedBy = ? WHERE InvoiceId = ?`;
  var values = [
    obj.CreatedBy, obj.RequestedByname,
    cDateTime.getDate(), Constants.CONST_INV_STATUS_AMENDED,
    obj.Modified, obj.ModifiedBy, obj.InvoiceId
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

Invoice.SaveCustomerPoNo = (obj) => {
  var sql = `Update tbl_invoice SET CustomerPONo='${obj.CustomerPONo}',
  Modified='${obj.Modified}',ModifiedBy='${obj.ModifiedBy}' WHERE IsDeleted=0 and InvoiceId=${obj.InvoiceId} `;
  // console.log("SaveCustomerPoNo =" + sql)
  return sql;
}

Invoice.UpdateBlanketPONetAmtAndExcludeAmt = (BlanketPONetAmount, BlanketPOExcludeAmount, InvoiceId) => {
  BlanketPONetAmount = parseFloat(BlanketPONetAmount).toFixed(2);
  BlanketPOExcludeAmount = parseFloat(BlanketPOExcludeAmount).toFixed(2)
  var sql = `UPDATE tbl_invoice  
SET BlanketPONetAmount =${BlanketPONetAmount},
BlanketPOExcludeAmount =${BlanketPOExcludeAmount}  WHERE IsDeleted=0 and InvoiceId=${InvoiceId} `;
  // console.log("UpdateBlanketPONetAmtAndExcludeAmt =" + sql)
  return sql;
}


Invoice.GetBlanketPONetAmountAndExcludeAmt = (InvoiceId) => {
  var sql = `SELECT (Select ifnull(SUM(Price),0) From tbl_invoice_item where IsDeleted=0 and IsExcludeFromBlanketPO = 1 and InvoiceId =${InvoiceId}) as BlanketPOExcludeAmount, 
((SubTotal + TotalTax + AHFees + Shipping) - Discount) - (Select ifnull(SUM(Price),0) From tbl_invoice_item where IsDeleted=0 and IsExcludeFromBlanketPO = 1 and InvoiceId =${InvoiceId}) as BlanketPONetAmount
FROM tbl_invoice 
where InvoiceId =${InvoiceId}; `;
  //console.log("GetBlanketPONetAmountAndExcludeAmt =" + sql)
  return sql;
}

Invoice.InvoiceListWithGrandtotalIsZero = (RR, result) => {
  var sql = `   Select RRId,RRNo,InvoiceId,InvoiceNo,
  ROUND(ifnull(i.GrandTotal,0),2) as GrandTotal   
From tbl_invoice i
where i.IsDeleted=0 and (i.GrandTotal-i.Discount)<(Select Sum(inv.Price)
From tbl_invoice_item inv
 where inv.IsDeleted=0 and inv.InvoiceId=i.InvoiceId) and i.RRId>0;
 `;
  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null)
    }
    return result(null, res);
  });
};

Invoice.GetPriceDetail = (InvoiceId, result) => {
  var sql = ` Select Sum(Price) as SubTotal,Shipping,i.Discount,TotalTax,AHFees,AdvanceAmount
From tbl_invoice i
Left Join tbl_invoice_item ii Using(InvoiceId)
where i.IsDeleted=0 and i.RRId>0 and ii.IsDeleted=0 and i.InvoiceId= ${InvoiceId}; `;
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

Invoice.UpdateGrandTotal = (GrandTotal, SubTotal, InvoiceId, result) => {
  var sql = ` Update tbl_invoice set GrandTotal=${GrandTotal},SubTotal=${SubTotal} where IsDeleted=0 and InvoiceId=${InvoiceId}; `;
  // console.log(sql)
  con.query(sql, (err, data) => {
    if (err) {
      return result(err, null)
    }
    if (data.affectedRows == 0)
      return result(null, { msg: "Not found " })
    else
      return result(null, data)
  });
};

//Below are for MRO :
Invoice.ValidateAlreadyExistMROId = (MROId, result) => {
  con.query(`SELECT InvoiceId,MROId,CustomerId FROM tbl_invoice where IsDeleted=0 AND Status!=${Constants.CONST_INV_STATUS_CANCELLED} and  MROId=${MROId} `, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
}

Invoice.DeleteMROInvoiceQuery = (MROId) => {
  var Obj = new Invoice({ MROId: MROId });
  var sql = `UPDATE tbl_invoice SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE MROId=${Obj.MROId}`;
  //console.log("sql=" + sql)
  return sql;
}

Invoice.UpdateMROShippingHistoryId = (MROShippingHistoryId, InvoiceId) => {
  var sql = `UPDATE tbl_invoice SET MROShippingHistoryId=${MROShippingHistoryId} WHERE InvoiceId=${InvoiceId}`;
  //console.log("sql=" + sql)
  return sql;
}

Invoice.ViewINVNoBySOId = (SOId, result) => {
  var sql = `SELECT INV.InvoiceNo,INV.InvoiceId
      FROM tbl_invoice as INV 
      where INV.IsDeleted=0 and INV.SOId=${SOId}`;
  // console.log("SQLVI" + sql)
  return sql;
};

module.exports = Invoice;


/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var async = require('async');
const md5 = require("md5");

const RR = require("../models/repair.request.model.js");
const CustomerReference = require("../models/cutomer.reference.labels.model.js");
const RRParts = require("../models/repairrequestparts.model.js");
const RRStatusHistory = require("../models/rr.status.history.model.js");
const Constants = require("../config/constants.js");
var cDateTime = require("../utils/generic.js");
const AddessBook = require("../models/customeraddress.model.js");
const PartsModel = require("../models/parts.model.js");
const MROModel = require("../models/mro.model.js");
const UserModel = require("../models/users.model.js");
const TermsModel = require("../models/terms.model.js");
const CustomerModel = require("../models/customers.model.js");
const NotificationModel = require("../models/notification.model.js");
const QuotesItemModel = require("../models/quote.item.model.js");
const QuotesModel = require("../models/quotes.model.js");
const RRVendorModel = require("../models/repair.request.vendors.model.js");
const RRVendorPartModel = require("../models/repair.request.vendor.parts.model.js");
const VendorQuote = require("../models/vendor.quote.model.js");
const VendorQuoteItem = require("../models/vendor.quote.item.model.js");
const CustomerPartmodel = require("../models/customer.parts.model.js");
const Quotes = require("../models/quotes.model.js");
const RepairRequestNotes = require("../models/repair.request.notes.model.js");
const PurchaseOrderItemModel = require("../models/purchase.order.item.model.js");
const PurchaseOrderModel = require("../models/purchase.order.model.js");
const CReference = require("../models/cutomer.reference.labels.model.js");
const SOModel = require("../models/sales.order.model.js");
const SOItemModel = require("../models/sales.order.item.model");

const InvoiceModel = require("../models/invoice.model.js");
const InvoiceItemModel = require("../models/invoice.item.model.js");

const VendorInvoiceModel = require("../models/vendor.invoice.model.js");
const VendorInvoiceItemModel = require("../models/vendor.invoice.item.model.js");

const CustomerDepartmentModel = require("../models/customersdepartment.model.js");
const SalesOrder = require("../models/sales.order.model.js");

const CustomerBlanketPOModel = require("../models/customer.blanket.po.model.js");
const CustomerBlanketPOHistoryModel = require("../models/customer.blanket.po.history.model.js");

const VendorImport = function FuncName(objVendor) {

    this.VendorCode = objVendor["VendorId"] ? objVendor["VendorId"].replace("'", "\\'").trim() : '';
    this.VendorName = objVendor["VendorName"] ? objVendor["VendorName"].replace("'", "\\'").trim() : '';
    this.StreetAddress = objVendor["AddressLineOne"] ? objVendor["AddressLineOne"].replace("'", "\\'") : '';
    this.City = objVendor["City"] ? objVendor["City"].replace("'", "\\'") : '';
    this.StateCode = objVendor["State"] ? objVendor["State"].replace("'", "\\'") : '';
    this.CountryCode = objVendor["Country"] ? objVendor["Country"].replace("'", "\\'") : '';
    this.Zip = objVendor["Zip"] ? objVendor["Zip"].replace("'", "\\'") : '';
    this.VendorTypeId = getVendorTypeId(objVendor["VendorTypeName"]);
    this.PhoneNoPrimary = objVendor["Telephone1"] ? objVendor["Telephone1"].replace("'", "\\'") : '';
    this.Email = objVendor["VendorEmail"] ? objVendor["VendorEmail"].replace("'", "\\'") : '';
    this.Website = objVendor["VendorWebSite"] ? objVendor["VendorWebSite"].replace("'", "\\'") : '';

    //TermsId
    //this.Terms = objVendor["Terms"] ? objVendor["Terms"].replace("'", "\\'") : '';
    this.Terms = 4;

    this.Fax = objVendor["FaxNumber"] ? objVendor["FaxNumber"].replace("'", "\\'") : '';


};

const CustomerImport = function FuncName(objCustomer) {
    this.CompanyName = objCustomer["Company Name"] ? objCustomer["Company Name"].replace("'", "\\'").trim() : '';
    this.CustomerCode = objCustomer["Customer ID"] ? objCustomer["Customer ID"].replace("'", "\\'") : '';
    this.CompanyTypeId = getCompanyTypeId(objCustomer["Customer Type"]);
    this.CustomerName = objCustomer["Customer Name"] ? objCustomer["Customer Name"].replace("'", "\\'").trim() : '';
    this.Email = objCustomer["Email"] ? objCustomer["Email"].replace("'", "\\'") : '';
    this.StreetAddress = objCustomer["Street Address"] ? objCustomer["Street Address"].replace("'", "\\'") : '';
    this.SuiteOrApt = objCustomer["Suite/Apt/Other"] ? objCustomer["Suite/Apt/Other"].replace("'", "\\'") : '';
    this.City = objCustomer["City"] ? objCustomer["City"].replace("'", "\\'") : '';
    this.StateCode = objCustomer["State"] ? objCustomer["State"].replace("'", "\\'") : '';
    this.CountryCode = objCustomer["Country"] ? objCustomer["Country"].replace("'", "\\'") : '';
    this.Zip = objCustomer["Zip"] ? objCustomer["Zip"].replace("'", "\\'") : '';
    this.PhoneNoPrimary = objCustomer["Phone No"] ? objCustomer["Phone No"].replace("'", "\\'") : '';
    this.Fax = objCustomer["Fax"] ? objCustomer["Fax"].replace("'", "\\'") : '';
    this.Terms = objCustomer["Terms"] ? objCustomer["Terms"].replace("'", "\\'") : '';
    this.TaxTypeId = getTaxTypeId(objCustomer["IsTaxable"]);
    this.Created = objCustomer["Create Date"] ? objCustomer["Create Date"].replace("'", "\\'") : '';

};
const CustomerUserImport = function FuncName(objCustomer) {
    this.CompanyName = objCustomer["Customer Name"] ? objCustomer["Customer Name"].replace("'", "\\'").trim() : '';
    this.ContactName = objCustomer["Contact Name"] ? objCustomer["Contact Name"].replace("'", "\\'").trim() : '';
    this.Contact = objCustomer["Contact#"] ? objCustomer["Contact#"] : '';
    this.Email = objCustomer["User email"] ? objCustomer["User email"].replace("'", "\\'") : '';
    this.Password = objCustomer["Password"] ? objCustomer["Password"].replace("'", "\\'") : '';
    this.Address = objCustomer["Address"] ? objCustomer["Address"].replace("'", "\\'") : '';

};
const PartImport = function FuncName(objPart) {
    this.PartNo = objPart["Part No"] ? objPart["Part No"].replace("'", "\\'").trim() : '';
    this.Description = objPart["Description"] ? objPart["Description"].replace("'", "\\'").trim() : '';
    this.Manufacturer = objPart["Manufacturer"] ? objPart["Manufacturer"].replace("'", "\\'") : '';
    this.ManufacturerPartNo = objPart["Manufacturer Part No"] ? objPart["Manufacturer Part No"] : '';
    this.Price = objPart["Price"] ? objPart["Price"].trim().replace("US $ ", "") : '0';
    this.OnHandQty = objPart["On Hand Qty"] ? objPart["On Hand Qty"].replace("'", "\\'") : '0';
    this.Avail = objPart["Avail"] ? objPart["Avail"] : '0';
    this.OpenPOQty = objPart["Open PO Qty"] ? objPart["Open PO Qty"] : '0';
    //this.TaxTypeId = getTaxTypeId(objPart["Tax_Required"]);
    this.TaxTypeId = '0';

};

const PartImportNew = function FuncName(objPart) {
    this.PartNo = objPart["AHR Part#"] ? objPart["AHR Part#"].replace("'", "\\'").trim() : '';
    this.Description = objPart["Description"] ? objPart["Description"].replace("'", "\\'").trim() : '';
    this.Manufacturer = objPart["Manufacturer"] ? objPart["Manufacturer"].replace("'", "\\'") : '';
    this.ManufacturerPartNo = objPart["Manufacturer Part#"] ? objPart["Manufacturer Part#"] : '';
    this.Price = 0;
    this.OnHandQty = 0;
    this.Avail = 0;
    this.OpenPOQty = 0;
    this.TaxTypeId = '0';

};

const RRImportV2 = function FuncName(obj) {

    /* this.RRNo = obj["Repair Request #"] ? obj["Repair Request #"] : '';
     this.PartNo = obj["AHR Part#"] ? obj["AHR Part#"] : '';
     this.VendorName = obj["Supplier"] ? obj["Supplier"].replace("'", "\\'") : '';
     this.ManufacturerName = obj["Manufacturer"] ? obj["Manufacturer"] : '';
     this.ManufacturerPartNo = obj["Manufacturer Part #"] ? obj["Manufacturer Part #"] : '';
 
     this.SerialNo = obj["Serial #"] ? obj["Serial #"] : '';
     this.Description = obj["Description"] ? obj["Description"] : '';
     this.StatusName = obj["Status"] ? obj["Status"] : '';
     this.CompanyName = obj["Customer"] ? obj["Customer"].replace("'", "\\'") : '';
     this.CustomerPONo = obj["Customer PO #"] ? obj["Customer PO #"] : '';
     this.Warranty = obj["Warranty"] ? obj["Warranty"] : '';
 
     this.Department = obj["Department"] ? obj["Department"] : '';
 
     this.CustomerQuoteGrandTotal = obj["Repair Price"] ? obj["Repair Price"] : 0;
     this.PartPON = obj["Price Of New"] ? obj["Price Of New"] : 0;
     this.VendorQuoteGrandTotal = obj["Cost"] ? obj["Cost"] : 0;
     this.ShippingCost = obj["Shipping Cost"] ? obj["Shipping Cost"] : 0;
 
     this.Created = obj["AH Received Date"] ? obj["AH Received Date"] : '';
     this.SubmittedDate = obj["Quote Submitted Date"] ? obj["Quote Submitted Date"] : '';
     this.ApprovedDate = obj["Approved Date (PO Receipt Date)"] ? obj["Approved Date (PO Receipt Date)"] : '';
     this.RejectedDate = obj["Rejected Date"] ? obj["Rejected Date"] : '';
     this.SalesOrderRequiredDate = obj["Sales Order Required Date"] ? obj["Sales Order Required Date"] : '';
     this.PONo = obj["VendorPONo"] ? obj["VendorPONo"] : '';
     this.SONo = obj["SalesorderNo"] ? obj["SalesorderNo"] : '';
     this.InvoiceNo = obj["InvoiceNo"] ? obj["InvoiceNo"] : '';
     this.VendorInvoiceNo = obj["VendorInvoiceNo"] ? obj["VendorInvoiceNo"] : '';
     this.IsRushRepair = obj["Rush / Normal"] ? obj["Rush / Normal"] : '';
     this.CustomerReference1 = obj["Customer Reference 1"] ? obj["Customer Reference 1"].replace("'", "\\'") : '';
     this.CustomerReference2 = obj["Customer Reference 2"] ? obj["Customer Reference 2"].replace("'", "\\'") : '';
     this.CustomerReference3 = obj["Customer Reference 3"] ? obj["Customer Reference 3"].replace("'", "\\'") : '';
     this.CustomerReference4 = obj["Customer Reference 4"] ? obj["Customer Reference 4"].replace("'", "\\'") : '';
     this.CustomerReference5 = obj["Customer Reference 5"] ? obj["Customer Reference 5"].replace("'", "\\'") : '';
     this.CustomerReference6 = obj["Customer Reference 6"] ? obj["Customer Reference 6"].replace("'", "\\'") : '';
     this.Note = obj["Follow Up Status"] ? obj["Follow Up Status"].replace("'", "\\'") : '';
 
     this.CustomerPartNo1 = obj["Customer Part #1"] ? obj["Customer Part #1"] : '';
     this.CustomerPartNo2 = obj["Customer Part #2"] ? obj["Customer Part #2"] : '';
     this.StatedIssue = obj["Customer Stated Issue"] ? obj["Customer Stated Issue"].replace("'", "\\'") : '';
     this.RouteCause = obj["Root Cause"] ? obj["Root Cause"].replace("'", "\\'") : '';
     this.VendorRefNo = obj["Vendor Reference #"] ? obj["Vendor Reference #"].replace("'", "\\'") : '';
 */

    this.RRNo = obj["Repair Request #"] ? obj["Repair Request #"].trim() : '';
    this.PartNo = obj["Part Number"] ? obj["Part Number"].trim() : '';
    this.VendorName = obj["Supplier"] ? obj["Supplier"].replace("'", "\\'").trim() : '';
    this.ManufacturerName = obj["Manufacturer"] ? obj["Manufacturer"].trim() : '';
    this.ManufacturerPartNo = obj["Manufacturer Part #"] ? obj["Manufacturer Part #"] : '';
    this.SerialNo = obj["Serial #"] ? obj["Serial #"] : '';
    this.Description = obj["Description"] ? obj["Description"].trim() : '';
    this.StatusName = obj["Status"] ? obj["Status"] : '';
    this.CompanyName = obj["Customer"] ? obj["Customer"].replace("'", "\\'").trim() : '';
    this.CustomerPONo = obj["Customer PO #"] ? obj["Customer PO #"] : '';
    this.PONo = obj["Vendor PO#"] ? obj["Vendor PO#"] : '';
    this.SONo = obj["Customer SO#"] ? obj["Customer SO#"] : '';
    this.InvoiceNo = obj["Customer Invoice#"] ? obj["Customer Invoice#"] : '';
    this.CustomerQuoteGrandTotal = obj["Repair Price"] ? obj["Repair Price"] : 0;
    this.PartPON = obj["Price Of New"] ? obj["Price Of New"] : 0;
    this.VendorQuoteGrandTotal = obj["Cost"] ? obj["Cost"] : 0;
    this.ShippingCost = obj["Shipping Cost"] ? obj["Shipping Cost"] : 0;
    this.Created = obj["AH Received Date"] ? obj["AH Received Date"] : '';
    this.SubmittedDate = obj["Quote Submitted Date"] ? obj["Quote Submitted Date"] : '';
    this.ApprovedDate = obj["Approved Date (PO Receipt Date)"] ? obj["Approved Date (PO Receipt Date)"] : '';
    this.SalesOrderRequiredDate = obj["Sales Order Due Date"] ? obj["Sales Order Due Date"] : '';
    this.IsRushRepair = obj["Rush / Normal"] ? obj["Rush / Normal"] : '';
    this.CustomerReference1 = obj["Customer Reference 1"] ? obj["Customer Reference 1"].replace("'", "\\'") : '';
    this.CustomerReference2 = obj["Customer Reference 2"] ? obj["Customer Reference 2"].replace("'", "\\'") : '';
    this.CustomerReference3 = obj["Customer Reference 3"] ? obj["Customer Reference 3"].replace("'", "\\'") : '';
    this.CustomerReference4 = obj["Customer Reference 4"] ? obj["Customer Reference 4"].replace("'", "\\'") : '';
    this.CustomerReference5 = obj["Customer Reference 5"] ? obj["Customer Reference 5"].replace("'", "\\'") : '';
    this.CustomerReference6 = obj["Customer Reference 6"] ? obj["Customer Reference 6"].replace("'", "\\'") : '';
    this.Note = obj["Follow Up Notes"] ? obj["Follow Up Notes"].replace("'", "\\'") : '';
    this.CustomerPartNo1 = obj["Customer Part #1"] ? obj["Customer Part #1"] : '';
    this.CustomerPartNo2 = obj["Customer Part #2"] ? obj["Customer Part #2"] : '';
    this.StatedIssue = obj["Customer Stated Issue"] ? obj["Customer Stated Issue"].replace("'", "\\'") : '';
    this.RouteCause = obj["Root Cause"] ? obj["Root Cause"].replace("'", "\\'") : '';
    this.VendorRefNo = obj["Vendor Reference #"] ? obj["Vendor Reference #"].replace("'", "\\'") : '';
    this.RejectedDate = obj["Rejected Date"] ? obj["Rejected Date"] : '';




    //new field     
    this.Quantity = obj["Quantity"] ? obj["Quantity"] : 1;
    this.CompletedDate = obj["Completed Date"] ? obj["Completed Date"] : '';
    this.InvoiceCreatedDate = obj["Invoice Created Date"] ? obj["Invoice Created Date"] : '';

    this.WarrantyRecovery = obj["Warranty Recovery"] ? obj["Warranty Recovery"] : '';
    this.InvoiceTotal = obj["Invoice Total"] ? obj["Invoice Total"] : 0;

    this.VendorBillTotal = obj[" Vendor Bill Total"] ? obj[" Vendor Bill Total"] : 0;

    this.VendorBillStatus = obj["Vendor Bill Status"] ? obj["Vendor Bill Status"] : '';

    this.InvoiceStatus = obj["Invoice Status"] ? obj["Invoice Status"] : '';


    this.Warranty = obj["Warranty"] ? obj["Warranty"] : '';
    this.Department = obj["Department"] ? obj["Department"] : '';


    this.VendorInvoiceNo = obj["Vendor Bill#"] ? obj["Vendor Bill#"] : '';
    this.VendorInvNo = obj["Vendor Invoice#"] ? obj["Vendor Invoice#"] : '';
    this.VendorRefNo = obj["Vendor Reference #"] ? obj["Vendor Reference #"].replace("'", "\\'") : '';
};

const SOPOItemImport = function FuncName(obj) {

    this.RRNo = obj["Repair Request #"] ? obj["Repair Request #"].trim() : '';
    this.PartNo = obj["Part No"] ? obj["Part No"].trim() : '';
    this.Description = obj["Description"] ? obj["Description"].trim() : '';
    this.PONo = obj["Vendor PO No"] ? obj["Vendor PO No"] : '';
    this.SONo = obj["Sales Order No"] ? obj["Sales Order No"] : '';
    this.InvoiceNo = obj["Invoice No"] ? obj["Invoice No"] : '';
    this.CustomerQuoteGrandTotal = obj["Repair Price"] ? obj["Repair Price"] : 0;
    this.VendorQuoteGrandTotal = obj["Cost"] ? obj["Cost"] : 0;
    this.InvoiceTotal = obj["Invoice Total"] ? obj["Invoice Total"] : 0;
    this.VendorBillTotal = obj[" Vendor Bill Total"] ? obj[" Vendor Bill Total"] : 0;
    this.Quantity = obj["Quantity"] ? obj["Quantity"] : 1;

};

const RRImport = function FuncName(obj) {

    this.RRNo = obj["Repair Request #"] ? obj["Repair Request #"].trim() : '';
    this.PartNo = obj["Part No"] ? obj["Part No"].trim() : '';
    this.VendorName = obj["Supplier"] ? obj["Supplier"].replace("'", "\\'").trim() : '';
    this.ManufacturerName = obj["Manufacturer"] ? obj["Manufacturer"].trim() : '';
    this.ManufacturerPartNo = obj["Manufacturer Part #"] ? obj["Manufacturer Part #"] : '';
    this.SerialNo = obj["Serial #"] ? obj["Serial #"] : '';
    this.Description = obj["Description"] ? obj["Description"].trim() : '';
    this.StatusName = obj["Status"] ? obj["Status"] : '';
    this.CompanyName = obj["Customer"] ? obj["Customer"].replace("'", "\\'").trim() : '';
    this.CustomerPONo = obj["Customer PO"] ? obj["Customer PO"] : '';
    this.PONo = obj["Vendor PO No"] ? obj["Vendor PO No"] : '';
    this.SONo = obj["Sales Order No"] ? obj["Sales Order No"] : '';
    this.InvoiceNo = obj["Invoice No"] ? obj["Invoice No"] : '';
    this.CustomerQuoteGrandTotal = obj["Repair Price"] ? obj["Repair Price"] : 0;
    this.PartPON = obj["Price Of New"] ? obj["Price Of New"] : 0;
    this.VendorQuoteGrandTotal = obj["Cost"] ? obj["Cost"] : 0;
    this.ShippingCost = obj["Shipping Cost"] ? obj["Shipping Cost"] : 0;
    this.Created = obj["AH Received Date"] ? obj["AH Received Date"] : '';
    this.SubmittedDate = obj["Quote Submitted Date"] ? obj["Quote Submitted Date"] : '';
    this.ApprovedDate = obj["Approved Date (PO Receipt Date)"] ? obj["Approved Date (PO Receipt Date)"] : '';
    this.SalesOrderRequiredDate = obj["Sales Order Due Date"] ? obj["Sales Order Due Date"] : '';
    this.IsRushRepair = obj["Rush / Normal"] ? obj["Rush / Normal"] : '';
    this.CustomerReference1 = obj["Customer Reference 1"] ? obj["Customer Reference 1"].replace("'", "\\'") : '';
    this.CustomerReference2 = obj["Customer Reference 2"] ? obj["Customer Reference 2"].replace("'", "\\'") : '';
    this.CustomerReference3 = obj["Customer Reference 3"] ? obj["Customer Reference 3"] : '';
    this.CustomerReference4 = obj["Customer Reference 4"] ? obj["Customer Reference 4"].replace("'", "\\'") : '';
    this.CustomerReference5 = obj["Customer Reference 5"] ? obj["Customer Reference 5"].replace("'", "\\'") : '';
    this.CustomerReference6 = obj["Customer Reference 6"] ? obj["Customer Reference 6"].replace("'", "\\'") : '';
    this.Note = obj["Follow Up Notes"] ? obj["Follow Up Notes"].replace("'", "\\'") : '';
    this.CustomerPartNo1 = obj["Customer Part #1"] ? obj["Customer Part #1"] : '';
    this.CustomerPartNo2 = obj["Customer Part #2"] ? obj["Customer Part #2"] : '';
    this.StatedIssue = obj["Customer Stated Issue"] ? obj["Customer Stated Issue"].replace("'", "\\'") : '';
    this.RouteCause = obj["Root Cause"] ? obj["Root Cause"].replace("'", "\\'") : '';
    this.VendorRefNo = obj["Vendor Reference #"] ? obj["Vendor Reference #"].replace("'", "\\'") : '';
    this.RejectedDate = obj["Rejected Date"] ? obj["Rejected Date"] : '';




    //new field     
    this.Quantity = obj["Quantity"] ? obj["Quantity"] : 1;
    this.CompletedDate = obj["Completed Date"] ? obj["Completed Date"] : '';
    this.InvoiceCreatedDate = obj["Invoice Created Date"] ? obj["Invoice Created Date"] : '';

    this.WarrantyRecovery = obj["Warranty Recovery"] ? obj["Warranty Recovery"] : '';
    this.InvoiceTotal = obj["Invoice Total"] ? obj["Invoice Total"] : 0;

    this.VendorBillTotal = obj[" Vendor Bill Total"] ? obj[" Vendor Bill Total"] : 0;

    this.VendorBillStatus = obj["Vendor Bill Status"] ? obj["Vendor Bill Status"] : '';

    this.InvoiceStatus = obj["Invoice Status"] ? obj["Invoice Status"] : '';


    this.Warranty = obj["Warranty"] ? obj["Warranty"] : '';
    this.Department = obj["Department"] ? obj["Department"] : '';

    this.VendorInvoiceNo = obj["Vendor Bill#"] ? obj["Vendor Bill#"] : '';

    this.VendorInvNo = obj["Vendor Invoice#"] ? obj["Vendor Invoice#"] : '';
    this.VendorRefNo = obj["Vendor Reference #"] ? obj["Vendor Reference #"].replace("'", "\\'") : '';


};




const NonRRImport = function FuncName(obj) {

    this.QuoteNo = obj["QQ#"] ? obj["QQ#"].trim() : '';
    this.InvoiceNo = obj["INV#"] ? obj["INV#"] : '';
    this.InvoiceTotal = obj["Invoice Total"] ? obj["Invoice Total"] : 0;
    this.CustomerPONo = obj["Customer PO#"] ? obj["Customer PO#"] : '';
    this.Status = obj["Status"] ? obj["Status"] : '';
    this.InvoiceCreatedDate = obj["Invoice Created Date"] ? obj["Invoice Created Date"] : '';
    this.CompanyName = obj["Customer Name"] ? obj["Customer Name"].replace("'", "\\'").trim() : '';
    this.PartNo = obj["PRODUCT/ ITEM"] ? obj["PRODUCT/ ITEM"].trim() : '';
    this.SONo = obj["SALESORDER"] ? obj["SALESORDER"] : '';
    this.VendorName = obj["Vendor Name"] ? obj["Vendor Name"].replace("'", "\\'").trim() : '';
    this.PONo = obj["Vendor PO#"] ? obj["Vendor PO#"] : '';
    this.VendorInvoiceNo = obj["Vendor Bill#"] ? obj["Vendor Bill#"] : '';

    this.SOTotal = obj["SO Total"] ? obj["SO Total"] : 0;
    this.POTotal = obj["PO Total"] ? obj["PO Total"] : 0;
    this.VendorBillTotal = obj["Vendor Bill Total"] ? obj["Vendor Bill Total"] : 0;
    this.Quantity = obj["QTY"] ? obj["QTY"] : 1;

    this.SOCreatedDate = obj["SO Crated Date"] ? obj["SO Crated Date"] : '';
    this.POCreatedDate = obj["PO Created Date"] ? obj["PO Created Date"] : '';
    this.VendorBillCreatedDate = obj["Vendor Bill Created Date"] ? obj["Vendor Bill Created Date"] : '';



};

const VendorUnitPriceImport = function FuncName(obj) {
    this.RRNo = obj["Repair Request #"] ? obj["Repair Request #"].trim() : '';
    this.PONo = obj["Vendor PO No"] ? obj["Vendor PO No"] : '';
    this.Quantity = obj["Quantity"] ? obj["Quantity"] : 1;
    this.VendorQuoteGrandTotal = obj["Cost"] ? obj["Cost"] : 0;
    this.VendorBillTotal = obj[" Vendor Bill Total"] ? obj[" Vendor Bill Total"] : 0;
    this.VendorInvoiceNo = obj["Vendor Bill#"] ? obj["Vendor Bill#"] : '';
}



const ImportCustomerPONo = function FuncName(obj) {

    this.RRNo = obj["RR#"] ? obj["RR#"].trim() : '';
    this.InvoiceNo = obj["Invoice No"] ? obj["Invoice No"].trim() : '';
    this.ExistingCustomerPO = obj["Existing Customer PO#"] ? obj["Existing Customer PO#"].trim() : '';
    this.NewCustomerPO = obj["New Customer PO#"] ? obj["New Customer PO#"].trim() : '';
    this.Status = obj["Status"] ? obj["Status"].trim() : '';
};
const RRImportAvailability = function FuncName(obj) {
    this.CompanyName = obj["Customer"] ? obj["Customer"].replace("'", "\\'").trim() : '';
    this.VendorName = obj["Supplier"] ? obj["Supplier"].replace("'", "\\'").trim() : '';
}

RRImport.CustomerAvailability = (RRJson, result) => {
    let rr = new RRImportAvailability(RRJson);

    let CustomerQuery = `SELECT CustomerId,'-' test FROM tbl_customers WHERE IsDeleted=0 and CompanyName= '${rr.CompanyName}'`;
    con.query(CustomerQuery, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length > 0) {
            if (res[0].CustomerId > 0) {
                return result({ msg: "Customer ID : " + res[0].CustomerId + ' - ' + rr.CompanyName }, null);
            } else {
                return result({ msg: "Customer not available : " + rr.CompanyName }, null);
            }
        } else {
            return result({ msg: "Customer not available : " + rr.CompanyName }, null);
        }
    });
}

RRImport.VendorAvailability = (RRJson, result) => {
    let rr = new RRImportAvailability(RRJson);
    let VendorQuery = `SELECT VendorId,'-' test FROM tbl_vendors WHERE IsDeleted=0 and VendorName= '${rr.VendorName}';`
    con.query(VendorQuery, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length > 0) {
            if (res[0].VendorId > 0) {
                return result({ msg: "Vendor ID : " + res[0].VendorId + ' - ' + rr.VendorName }, null);
            } else {
                return result({ msg: "Vendor not available : " + rr.VendorName }, null);
            }
        } else {
            return result({ msg: "Vendor not available : " + rr.VendorName }, null);
        }
    });
}


const RRImportType1 = function FuncName(obj) {

    this.RRNo = obj["Repair Request #"] ? obj["Repair Request #"].trim() : '';
    this.PartNo = obj["Part No"] ? obj["Part No"].trim() : '';
    this.VendorName = obj["Supplier"] ? obj["Supplier"].replace("'", "\\'").trim() : '';
    this.ManufacturerName = obj["Manufacturer"] ? obj["Manufacturer"].trim() : '';
    this.ManufacturerPartNo = obj["Manufacturer Part #"] ? obj["Manufacturer Part #"] : '';
    this.SerialNo = obj["Serial #"] ? obj["Serial #"] : '';
    this.Description = obj["Description"] ? obj["Description"].trim() : '';
    this.StatusName = obj["Status"] ? obj["Status"] : '';
    this.CompanyName = obj["Customer"] ? obj["Customer"].replace("'", "\\'").trim() : '';
    this.CustomerPONo = obj["Customer PO"] ? obj["Customer PO"] : '';
    this.PONo = obj["Vendor PO No"] ? obj["Vendor PO No"] : '';
    this.SONo = obj["Sales Order No"] ? obj["Sales Order No"] : '';
    this.InvoiceNo = obj["Invoice No"] ? obj["Invoice No"] : '';
    this.CustomerQuoteGrandTotal = obj["Repair Price"] ? obj["Repair Price"] : 0;
    this.PartPON = obj["Price Of New"] ? obj["Price Of New"] : 0;
    this.RRCurrency = obj["Currency"] ? obj["Currency"] : 'EUR';
    this.VendorQuoteGrandTotal = obj["Cost"] ? obj["Cost"] : 0;
    this.ShippingCost = obj["Shipping Cost"] ? obj["Shipping Cost"] : 0;
    this.Created = obj["AH Received Date"] ? obj["AH Received Date"].trim() : '';
    this.SubmittedDate = obj["Quote Submitted Date"] ? obj["Quote Submitted Date"] : '';
    this.ApprovedDate = obj["Approved Date (PO Receipt Date)"] ? obj["Approved Date (PO Receipt Date)"] : '';
    this.SalesOrderRequiredDate = obj["Sales Order Due Date"] ? obj["Sales Order Due Date"] : '';
    this.IsRushRepair = obj["Rush / Normal"] ? obj["Rush / Normal"] : '';
    this.CustomerReference1 = obj["Customer Reference 1"] ? obj["Customer Reference 1"] : '';
    this.CustomerReference2 = obj["Customer Reference 2"] ? obj["Customer Reference 2"] : '';
    this.CustomerReference3 = obj["Customer Reference 3"] ? obj["Customer Reference 3"] : '';
    this.CustomerReference4 = obj["Customer Reference 4"] ? obj["Customer Reference 4"] : '';
    this.CustomerReference5 = obj["Customer Reference 5"] ? obj["Customer Reference 5"] : '';
    this.CustomerReference6 = obj["Customer Reference 6"] ? obj["Customer Reference 6"] : '';
    this.Note = obj["Follow Up Notes"] ? obj["Follow Up Notes"].replace("'", "\\'") : '';
    this.CustomerPartNo1 = obj["Customer Part #1"] ? obj["Customer Part #1"] : '';
    this.CustomerPartNo2 = obj["Customer Part #2"] ? obj["Customer Part #2"] : '';
    this.StatedIssue = obj["Customer Stated Issue"] ? obj["Customer Stated Issue"].replace("'", "\\'") : '';
    this.RouteCause = obj["Root Cause"] ? obj["Root Cause"].replace("'", "\\'") : '';



    this.VendorRefNo = obj["Vendor Reference #"] ? obj["Vendor Reference #"].replace("'", "\\'") : '';
    this.RejectedDate = obj["Rejected Date"] ? obj["Rejected Date"] : '';
    this.Quantity = obj["Quantity"] ? obj["Quantity"] : 1;
    this.CompletedDate = obj["Completed Date"] ? obj["Completed Date"] : '';
    this.InvoiceCreatedDate = obj["Invoice Created Date"] ? obj["Invoice Created Date"] : '';
    this.Warranty = obj["Warranty Recovery"] ? obj["Warranty Recovery"] : '';
    //new field     
    this.InvoiceTotal = obj["Invoice Total"] ? obj["Invoice Total"] : 0;
    this.InvoiceStatus = obj["Invoice Status"] ? obj["Invoice Status"] : '';
    this.VendorInvoiceNo = obj["Vendor Bill#"] ? obj["Vendor Bill#"] : '';
    this.VendorBillTotal = obj[" Vendor Bill Total"] ? obj[" Vendor Bill Total"] : 0;
    this.VendorBillStatus = obj["Vendor Bill Status"] ? obj["Vendor Bill Status"] : '';
    this.VendorInvNo = obj["Vendor Invoice#"] ? obj["Vendor Invoice#"] : '';


    this.Department = obj["Department"] ? obj["Department"] : '';
    this.POcreatedDate = obj["PO created Date"] ? obj["PO created Date"] : null;
    this.SoCreatedDate = obj["So Created Date"] ? obj["So Created Date"] : null;
    this.PORequiredDate = obj["PO Required date"] ? obj["PO Required date"] : null;
    // this.SOamount = obj["SO amount - Please consider Price"] ? obj["SO amount - Please consider Price"] : 0;
};



const RRImportType2 = function FuncName(obj) {
    this.RRNo = obj["Repair Request #"] ? obj["Repair Request #"].trim() : '';
    this.PONo = obj["Vendor PO No"] ? obj["Vendor PO No"] : '';
    this.SONo = obj["Sales Order No"] ? obj["Sales Order No"] : '';
    this.InvoiceNo = obj["Invoice No"] ? obj["Invoice No"] : '';
    this.CustomerQuoteGrandTotal = obj["Repair Price"] ? obj["Repair Price"] : 0;
    this.PartPON = obj["Price Of New"] ? obj["Price Of New"] : 0;
    this.VendorQuoteGrandTotal = obj["Cost"] ? obj["Cost"] : 0;
    this.InvoiceTotal = obj["Invoice Total"] ? obj["Invoice Total"] : 0;
    this.VendorInvoiceNo = obj["Vendor Bill#"] ? obj["Vendor Bill#"] : '';
    this.VendorBillTotal = obj[" Vendor Bill Total"] ? obj[" Vendor Bill Total"] : 0;
    this.VendorInvNo = obj["Vendor Invoice#"] ? obj["Vendor Invoice#"] : '';
    this.Quantity = obj["Quantity"] ? obj["Quantity"] : 1;
    this.PartPON = obj["Price Of New"] ? obj["Price Of New"] : 0;
};

const RRImportTypeRef = function FuncName(obj) {
    this.RRNo = obj["RR No"] ? obj["RR No"].trim() : '';
    this.CustomerDepartment = obj["Customer Department"] ? obj["Customer Department"] : '';
    this.CustomerReference1 = obj["Customer Reference field 1"] ? obj["Customer Reference field 1"] : '';
    this.CustomerReference2 = obj["Customer Reference field 2"] ? obj["Customer Reference field 2"] : '';
    this.CustomerReference3 = obj["Customer Reference field 3"] ? obj["Customer Reference field 3"] : '';
    this.CustomerReference4 = obj["Customer Reference field 4"] ? obj["Customer Reference field 4"] : '';
    this.CustomerReference5 = obj["Customer Reference field 5"] ? obj["Customer Reference field 5"] : '';
    this.CustomerReference6 = obj["Customer Reference field 6"] ? obj["Customer Reference field 6"] : '';

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



RRImport.ChangeRecordCurrencyByCustomerQuery = (reqBody, result) => {
    /*var sql = `SELECT
           Q.QuoteId, QI.QuoteItemId, SO.SOId, SOI.SOItemId, INV.InvoiceId, INVI.InvoiceItemId, RR.RRId, RR.CustomerId,RR.PartId, RR.PartPON, rrp.RRPartsId, CP.NewPrice, CP.CustomerPartId, MRO.MROId,
           Q.TotalValue as QTotalValue, Q.GrandTotal as QGrandTotal, QI.Rate as QIRate, QI.Price as QIPrice, QI.Tax as QITax, QI.ItemTaxPercent as QIItemTaxPercent, QI.ShippingCharge as QIShippingCharge,  QI.Quantity as QIQuantity,
           SO.SubTotal as SOSubTotal, SO.BlanketPOExcludeAmount as SOBlanketPOExcludeAmount, SO.BlanketPONetAmount as SOBlanketPONetAmount,SO.GrandTotal as SOGrandTotal, SOI.Rate as SOIRate, SOI.Price as SOIPrice, SOI.Tax as SOITax, SOI.ItemTaxPercent as SOIItemTaxPercent, SOI.ShippingCharge as SOIShippingCharge, SOI.Quantity as SOIQuantity,
           INV.SubTotal as INVSubTotal, INV.BlanketPOExcludeAmount as INVBlanketPOExcludeAmount, INV.BlanketPONetAmount as INVBlanketPONetAmount,INV.GrandTotal as INVGrandTotal, INVI.Rate as INVIRate, INVI.Price as INVIPrice, INVI.Tax as INVITax, INVI.ItemTaxPercent as INVIItemTaxPercent, INVI.ShippingCharge as INVIShippingCharge, INVI.Quantity as INVIQuantity
       
           FROM ahoms.tbl_quotes as Q
       LEFT JOIN tbl_quotes_item as QI ON QI.QuoteId = Q.QuoteId AND QI.IsDeleted = 0
       LEFT JOIN tbl_sales_order as SO ON SO.QuoteId = Q.QuoteId AND SO.IsDeleted = 0
       LEFT JOIN tbl_sales_order_item as SOI ON SOI.SOId = SO.SOId AND SOI.IsDeleted = 0
       LEFT JOIN tbl_invoice as INV ON INV.SOId = SO.SOId AND INV.IsDeleted = 0
       LEFT JOIN tbl_invoice_item as INVI ON INV.InvoiceId = INVI.InvoiceId AND INVI.IsDeleted = 0
       LEFT JOIN tbl_repair_request as RR ON RR.RRId = Q.RRId AND RR.IsDeleted = 0
       LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId = RR.RRId  AND rrp.IsDeleted = 0
       LEFT JOIN tbl_customer_parts as CP ON CP.CustomerId = RR.CustomerId AND CP.PartId = RR.PartId
       LEFT JOIN tbl_mro as MRO ON MRO.MROId = Q.MROId AND MRO.IsDeleted = 0
       WHERE  Q.IsDeleted = 0 AND Q.IdentityId IN(11688) AND Q.IdentityType = 1  `;*/


    var sql = `SELECT  RR.RRId, rrp.RRPartsId, CP.CustomerPartId, RR.PartPON, RR.PartId,RR.CustomerId, CP.NewPrice
     FROM ahoms.tbl_repair_request as RR
     LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId = RR.RRId  AND rrp.IsDeleted = 0
     LEFT JOIN tbl_customer_parts as CP ON CP.CustomerId = RR.CustomerId AND CP.PartId = RR.PartId
     WHERE  RR.IsDeleted = 0 AND RR.CustomerId IN(11688) AND RR.RRId NOT IN(Select RRID From tbl_quotes WHERE RRId = RR.RRId) `;


    con.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        result(null, res);
        return;
    });
}



RRImport.ChangeRecordCurrencyByCustomer = (rr, result) => {

    var CONVERT_TO_LOCAL_CURR = 1.3; //USD to CAN

    rr.PartPON = roundTo((rr.PartPON * CONVERT_TO_LOCAL_CURR), 2);

    rr.QTotalValue = roundTo((rr.QTotalValue * CONVERT_TO_LOCAL_CURR), 2);
    rr.QGrandTotal = roundTo((rr.QGrandTotal * CONVERT_TO_LOCAL_CURR), 2);
    rr.QIRate = roundTo((rr.QIRate * CONVERT_TO_LOCAL_CURR), 2);
    rr.QIPrice = roundTo((rr.QIPrice * CONVERT_TO_LOCAL_CURR), 2);
    rr.QITax = roundTo((rr.QITax * CONVERT_TO_LOCAL_CURR), 2);
    rr.QIShippingCharge = roundTo((rr.QIShippingCharge * CONVERT_TO_LOCAL_CURR), 2);


    rr.SOSubTotal = roundTo((rr.SOSubTotal * CONVERT_TO_LOCAL_CURR), 2);
    rr.SOBlanketPOExcludeAmount = roundTo((rr.SOBlanketPOExcludeAmount * CONVERT_TO_LOCAL_CURR), 2);
    rr.SOBlanketPONetAmount = roundTo((rr.SOBlanketPONetAmount * CONVERT_TO_LOCAL_CURR), 2);

    rr.SOGrandTotal = roundTo((rr.SOGrandTotal * CONVERT_TO_LOCAL_CURR), 2);
    rr.SOIRate = roundTo((rr.SOIRate * CONVERT_TO_LOCAL_CURR), 2);
    rr.SOIPrice = roundTo((rr.SOIPrice * CONVERT_TO_LOCAL_CURR), 2);
    rr.SOITax = roundTo((rr.SOITax * CONVERT_TO_LOCAL_CURR), 2);
    rr.SOIShippingCharge = roundTo((rr.SOIShippingCharge * CONVERT_TO_LOCAL_CURR), 2);

    rr.INVSubTotal = roundTo((rr.INVSubTotal * CONVERT_TO_LOCAL_CURR), 2);
    rr.INVBlanketPOExcludeAmount = roundTo((rr.INVBlanketPOExcludeAmount * CONVERT_TO_LOCAL_CURR), 2);
    rr.INVBlanketPONetAmount = roundTo((rr.INVBlanketPONetAmount * CONVERT_TO_LOCAL_CURR), 2);

    rr.INVGrandTotal = roundTo((rr.INVGrandTotal * CONVERT_TO_LOCAL_CURR), 2);
    rr.INVIRate = roundTo((rr.INVIRate * CONVERT_TO_LOCAL_CURR), 2);
    rr.INVIPrice = roundTo((rr.INVIPrice * CONVERT_TO_LOCAL_CURR), 2);
    rr.INVITax = roundTo((rr.INVITax * CONVERT_TO_LOCAL_CURR), 2);
    rr.INVIShippingCharge = roundTo((rr.INVIShippingCharge * CONVERT_TO_LOCAL_CURR), 2);

    rr.NewPrice = roundTo((rr.NewPrice * CONVERT_TO_LOCAL_CURR), 2);



    rr.LocalCurrencyCode = 'CAN';
    rr.ExchangeRate = 0.77; //CAN to USD

    rr.ItemLocalCurrencyCode = rr.LocalCurrencyCode;
    rr.ItemExchangeRate = rr.ExchangeRate;

    rr.PartPONLocalCurrency = rr.LocalCurrencyCode;
    rr.BasePartPON = roundTo((rr.PartPON * rr.ExchangeRate), 2);

    //Quote    
    rr.QBaseGrandTotal = roundTo((rr.QGrandTotal * rr.ExchangeRate), 2);
    rr.BaseQIRate = roundTo((rr.QIRate * rr.ExchangeRate), 2);
    rr.BaseQIPrice = roundTo((rr.QIPrice * rr.ExchangeRate), 2);
    rr.BaseQITax = roundTo((rr.QITax * rr.ExchangeRate), 2);
    rr.BaseQIShippingCharge = roundTo((rr.QIShippingCharge * rr.ExchangeRate), 2);

    //SO
    rr.SOBaseGrandTotal = roundTo((rr.SOGrandTotal * rr.ExchangeRate), 2);
    rr.BaseSOIRate = roundTo((rr.SOIRate * rr.ExchangeRate), 2);
    rr.BaseSOIPrice = roundTo((rr.SOIPrice * rr.ExchangeRate), 2);
    rr.BaseSOITax = roundTo((rr.SOITax * rr.ExchangeRate), 2);
    rr.BaseSOIShippingCharge = roundTo((rr.SOIShippingCharge * rr.ExchangeRate), 2);

    //Invoice
    rr.INVBaseGrandTotal = roundTo((rr.INVGrandTotal * rr.ExchangeRate), 2);
    rr.BaseINVIRate = roundTo((rr.INVIRate * rr.ExchangeRate), 2);
    rr.BaseINVIPrice = roundTo((rr.INVIPrice * rr.ExchangeRate), 2);
    rr.BaseINVITax = roundTo((rr.INVITax * rr.ExchangeRate), 2);
    rr.BaseINVIShippingCharge = roundTo((rr.INVIShippingCharge * rr.ExchangeRate), 2);

    //CP

    rr.BaseNewPrice = roundTo((rr.NewPrice * rr.ExchangeRate), 2);

    if (rr.RRId > 0) {

        let RRPartsId_sql1 = `UPDATE tbl_repair_request SET PartPON=ROUND(${rr.PartPON},2),BasePartPON=ROUND(${rr.BasePartPON},2),PartPONLocalCurrency='${rr.LocalCurrencyCode}'   WHERE  RRId = ${rr.RRId}`;

        let CustomerPartId_sql1 = `UPDATE tbl_customer_parts SET  LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',BaseNewPrice=ROUND(${rr.BaseNewPrice},2),NewPrice=ROUND(${rr.NewPrice},2) WHERE CustomerPartId = ${rr.CustomerPartId}  AND  CustomerId=${rr.CustomerId} AND PartId=${rr.PartId}`;

        let QuoteId_sql1 = `UPDATE tbl_quotes SET   LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',BaseGrandTotal=ROUND(${rr.QBaseGrandTotal},2) ,GrandTotal=ROUND(${rr.QGrandTotal},2),TotalValue=ROUND(${rr.QTotalValue},2)    WHERE QuoteId = ${rr.QuoteId}`;
        let QuoteId_sql2 = `UPDATE tbl_quotes_item SET  ShippingCharge=ROUND(${rr.QIShippingCharge},2),BaseShippingCharge=ROUND(${rr.BaseQIShippingCharge},2),  Tax=ROUND(${rr.QITax},2),BaseTax=ROUND(${rr.BaseQITax},2), Rate=ROUND(${rr.QIRate},2), BaseRate=ROUND(${rr.BaseQIRate},2), ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',Price=ROUND(${rr.QIPrice},2) , BasePrice=ROUND(${rr.BaseQIPrice},2)  WHERE QuoteItemId = ${rr.QuoteItemId}`;

        let SOId_sql1 = `UPDATE tbl_sales_order SET  LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',GrandTotal=ROUND(${rr.SOGrandTotal},2),BaseGrandTotal=ROUND(${rr.SOBaseGrandTotal},2),SubTotal=ROUND(${rr.SOSubTotal},2),BlanketPOExcludeAmount=ROUND(${rr.SOBlanketPOExcludeAmount},2),BlanketPONetAmount=ROUND(${rr.SOBlanketPONetAmount},2) WHERE SOId = ${rr.SOId}`;
        let SOId_sql2 = `UPDATE tbl_sales_order_item SET  ShippingCharge=ROUND(${rr.SOIShippingCharge},2),BaseShippingCharge=ROUND(${rr.BaseSOIShippingCharge},2), Tax=ROUND(${rr.SOITax},2),BaseTax=ROUND(${rr.BaseSOITax},2), Rate=ROUND(${rr.SOIRate},2),BaseRate=ROUND(${rr.BaseSOIRate},2), ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',Price=ROUND(${rr.SOIPrice},2) ,BasePrice=ROUND(${rr.BaseSOIPrice},2)  WHERE SOItemId = ${rr.SOItemId}`;

        let InvoiceId_sql1 = `UPDATE tbl_invoice SET  LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',GrandTotal=ROUND(${rr.INVGrandTotal},2),BaseGrandTotal=ROUND(${rr.INVBaseGrandTotal},2),SubTotal=ROUND(${rr.INVSubTotal},2),BlanketPOExcludeAmount=ROUND(${rr.INVBlanketPOExcludeAmount},2),BlanketPONetAmount=ROUND(${rr.INVBlanketPONetAmount},2) WHERE InvoiceId = ${rr.InvoiceId}`;
        let InvoiceId_sql2 = `UPDATE tbl_invoice_item SET   ShippingCharge=ROUND(${rr.INVIShippingCharge},2),BaseShippingCharge=ROUND(${rr.BaseINVIShippingCharge},2), Tax=ROUND(${rr.INVITax},2),BaseTax=ROUND(${rr.BaseINVITax},2), Rate=ROUND(${rr.INVIRate},2),  BaseRate=ROUND(${rr.BaseINVIRate},2), ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',Price=ROUND(${rr.INVIPrice},2),BasePrice=ROUND(${rr.BaseINVIPrice},2)  WHERE InvoiceItemId = ${rr.InvoiceItemId}`;



        /* let QuoteId_sql2 = `UPDATE tbl_quotes_item SET    Rate=ROUND((Price/Quantity),2), BaseRate=ROUND((BasePrice/Quantity),2)   WHERE QuoteItemId = ${rr.QuoteItemId}`;
         let SOId_sql2 = `UPDATE tbl_sales_order_item SET  Rate=ROUND((Price/Quantity),2),BaseRate=ROUND((BasePrice/Quantity),2)   WHERE SOItemId = ${rr.SOItemId}`;
         let InvoiceId_sql2 = `UPDATE tbl_invoice_item SET   Rate=ROUND((Price/Quantity),2),BaseRate=ROUND((BasePrice/Quantity),2)   WHERE InvoiceItemId = ${rr.InvoiceItemId}`;
 
 */


        console.log(RRPartsId_sql1);
        console.log(CustomerPartId_sql1);
        console.log(QuoteId_sql1);
        console.log(QuoteId_sql2);
        console.log(SOId_sql1);
        console.log(SOId_sql2);
        console.log(InvoiceId_sql1);
        console.log(InvoiceId_sql2);


        async.parallel([
            function (result) {
                if (rr.RRId && rr.RRId > 0) { con.query(RRPartsId_sql1, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.CustomerPartId && rr.CustomerPartId > 0) { con.query(CustomerPartId_sql1, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.QuoteId && rr.QuoteId > 0) { con.query(QuoteId_sql1, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.QuoteId && rr.QuoteId > 0) { con.query(QuoteId_sql2, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.SOId && rr.SOId > 0) { con.query(SOId_sql1, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.SOId && rr.SOId > 0) { con.query(SOId_sql2, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.InvoiceId && rr.InvoiceId > 0) { con.query(InvoiceId_sql1, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.InvoiceId && rr.InvoiceId > 0) { con.query(InvoiceId_sql2, result) } else { RR.emptyFunction(rr, result); }
            }


        ],
            function (err, results) {
                console.log(rr.RRId + " completed")
                if (err) {
                    console.log(err);
                    return result(err, null);
                }
                return result(null, null);
            }
        );
        //return result(null, null);
    }
}


RRImport.ChangeRecordCurrencyByVendorQuery = (reqBody, result) => {

    //RR Vendors
    var sql = `SELECT * FROM tbl_repair_request_vendors  as RRV
      WHERE  RRV.IsDeleted = 0 AND RRV.VendorId IN(11773)`;

    //RR Vendors parts
    var sql = `SELECT RRVendorPartsId,Rate,BaseRate,Price,ItemLocalCurrencyCode,ItemExchangeRate,BasePrice,EX.ExchangeRate
       FROM tbl_repair_request_vendor_parts  as VP
      LEFT JOIN tbl_currency_exchange_rate as EX ON EX.TargetCurrencyCode = 'EUR' AND EX.SourceCurrencyCode=VP.ItemLocalCurrencyCode
      WHERE  VP.IsDeleted = 0 AND VP.VendorId IN(11773) AND VP.ItemLocalCurrencyCode!='EUR'`;


    //Vendor quote 
    var sql = `SELECT RRVendorPartsId,SubTotal,GrandTotal,BaseGrandTotal,LocalCurrencyCode,EX.ExchangeRate
       FROM tbl_vendor_quote  as VQ
      LEFT JOIN tbl_currency_exchange_rate as EX ON EX.TargetCurrencyCode = 'EUR' AND EX.SourceCurrencyCode=VP.LocalCurrencyCode
      WHERE  VP.IsDeleted = 0 AND VP.VendorId IN(11773) AND VP.ItemLocalCurrencyCode!='EUR'`;


    //Vendor quote item
    var sql = `SELECT VendorQuoteItemId,Rate,BaseRate,Price,ItemLocalCurrencyCode,ItemExchangeRate,BasePrice,EX.ExchangeRate
       FROM tbl_vendor_quote_item  as VQI
      LEFT JOIN tbl_currency_exchange_rate as EX ON EX.TargetCurrencyCode = 'EUR' AND EX.SourceCurrencyCode=VQI.ItemLocalCurrencyCode
      WHERE  VQI.IsDeleted = 0 AND VQI.VendorId IN(11773) AND VQI.ItemLocalCurrencyCode!='EUR'`;





    con.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            result(err, null);
            return;
        }
        result(null, res);
        return;
    });
}



RRImport.ChangeRecordCurrencyByVendor = (rr, result) => {

    var EUR_to_RON = 0.83;

    rr.PartPON = roundTo((rr.PartPON * EUR_to_RON), 2);

    rr.QTotalValue = roundTo((rr.QTotalValue * EUR_to_RON), 2);
    rr.QGrandTotal = roundTo((rr.QGrandTotal * EUR_to_RON), 2);
    rr.QIRate = roundTo((rr.QIRate * EUR_to_RON), 2);
    rr.QIPrice = roundTo((rr.QIPrice * EUR_to_RON), 2);


    rr.SOSubTotal = roundTo((rr.SOSubTotal * EUR_to_RON), 2);
    rr.SOBlanketPOExcludeAmount = roundTo((rr.SOBlanketPOExcludeAmount * EUR_to_RON), 2);
    rr.SOBlanketPONetAmount = roundTo((rr.SOBlanketPONetAmount * EUR_to_RON), 2);

    rr.SOGrandTotal = roundTo((rr.SOGrandTotal * EUR_to_RON), 2);
    rr.SOIRate = roundTo((rr.SOIRate * EUR_to_RON), 2);
    rr.SOIPrice = roundTo((rr.SOIPrice * EUR_to_RON), 2);

    rr.INVSubTotal = roundTo((rr.INVSubTotal * EUR_to_RON), 2);
    rr.INVBlanketPOExcludeAmount = roundTo((rr.INVBlanketPOExcludeAmount * EUR_to_RON), 2);
    rr.INVBlanketPONetAmount = roundTo((rr.INVBlanketPONetAmount * EUR_to_RON), 2);

    rr.INVGrandTotal = roundTo((rr.INVGrandTotal * EUR_to_RON), 2);
    rr.INVIRate = roundTo((rr.INVIRate * EUR_to_RON), 2);
    rr.INVIPrice = roundTo((rr.INVIPrice * EUR_to_RON), 2);

    rr.NewPrice = roundTo((rr.NewPrice * EUR_to_RON), 2);



    rr.LocalCurrencyCode = 'GBP';
    rr.ExchangeRate = 1.31;

    rr.ItemLocalCurrencyCode = rr.LocalCurrencyCode;
    rr.ItemExchangeRate = rr.ExchangeRate;

    rr.PartPONLocalCurrency = rr.LocalCurrencyCode;
    rr.BasePartPON = roundTo((rr.PartPON * rr.ExchangeRate), 2);

    //Quote    
    rr.QBaseGrandTotal = roundTo((rr.QGrandTotal * rr.ExchangeRate), 2);
    rr.BaseQIRate = roundTo((rr.QIRate * rr.ExchangeRate), 2);
    rr.BaseQIPrice = roundTo((rr.QIPrice * rr.ExchangeRate), 2);

    //SO
    rr.SOBaseGrandTotal = roundTo((rr.SOGrandTotal * rr.ExchangeRate), 2);
    rr.BaseSOIRate = roundTo((rr.SOIRate * rr.ExchangeRate), 2);
    rr.BaseSOIPrice = roundTo((rr.SOIPrice * rr.ExchangeRate), 2);

    //Invoice
    rr.INVBaseGrandTotal = roundTo((rr.INVGrandTotal * rr.ExchangeRate), 2);
    rr.BaseINVIRate = roundTo((rr.INVIRate * rr.ExchangeRate), 2);
    rr.BaseINVIPrice = roundTo((rr.INVIPrice * rr.ExchangeRate), 2);

    //CP

    rr.BaseNewPrice = roundTo((rr.NewPrice * rr.ExchangeRate), 2);

    if (rr.RRId > 0) {

        let RRPartsId_sql1 = `UPDATE tbl_repair_request SET PartPON=ROUND(${rr.PartPON},2),BasePartPON=ROUND(${rr.BasePartPON},2),PartPONLocalCurrency='${rr.LocalCurrencyCode}'   WHERE  RRId = ${rr.RRId}`;

        let CustomerPartId_sql1 = `UPDATE tbl_customer_parts SET  LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',BaseNewPrice=ROUND(${rr.BaseNewPrice},2),NewPrice=ROUND(${rr.NewPrice},2) WHERE CustomerPartId = ${rr.CustomerPartId}  AND  CustomerId=${rr.CustomerId} AND PartId=${rr.PartId}`;

        let QuoteId_sql1 = `UPDATE tbl_quotes SET   LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',BaseGrandTotal=ROUND(${rr.QBaseGrandTotal},2) ,GrandTotal=ROUND(${rr.QGrandTotal},2),TotalValue=ROUND(${rr.QTotalValue},2)    WHERE QuoteId = ${rr.QuoteId}`;
        let QuoteId_sql2 = `UPDATE tbl_quotes_item SET    Rate=ROUND(${rr.QIRate},2), BaseRate=ROUND(${rr.BaseQIRate},2), ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',Price=ROUND(${rr.QIPrice},2) , BasePrice=ROUND(${rr.BaseQIPrice},2)  WHERE QuoteItemId = ${rr.QuoteItemId}`;

        let SOId_sql1 = `UPDATE tbl_sales_order SET  LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',GrandTotal=ROUND(${rr.SOGrandTotal},2),BaseGrandTotal=ROUND(${rr.SOBaseGrandTotal},2),SubTotal=ROUND(${rr.SOSubTotal},2),BlanketPOExcludeAmount=ROUND(${rr.SOBlanketPOExcludeAmount},2),BlanketPONetAmount=ROUND(${rr.SOBlanketPONetAmount},2) WHERE SOId = ${rr.SOId}`;
        let SOId_sql2 = `UPDATE tbl_sales_order_item SET  Rate=ROUND(${rr.SOIRate},2),BaseRate=ROUND(${rr.BaseSOIRate},2), ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',Price=ROUND(${rr.SOIPrice},2) ,BasePrice=ROUND(${rr.BaseSOIPrice},2)  WHERE SOItemId = ${rr.SOItemId}`;

        let InvoiceId_sql1 = `UPDATE tbl_invoice SET  LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',GrandTotal=ROUND(${rr.INVGrandTotal},2),BaseGrandTotal=ROUND(${rr.INVBaseGrandTotal},2),SubTotal=ROUND(${rr.INVSubTotal},2),BlanketPOExcludeAmount=ROUND(${rr.INVBlanketPOExcludeAmount},2),BlanketPONetAmount=ROUND(${rr.INVBlanketPONetAmount},2) WHERE InvoiceId = ${rr.InvoiceId}`;
        let InvoiceId_sql2 = `UPDATE tbl_invoice_item SET   Rate=ROUND(${rr.INVIRate},2),  BaseRate=ROUND(${rr.BaseINVIRate},2), ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',Price=ROUND(${rr.INVIPrice},2),BasePrice=ROUND(${rr.BaseINVIPrice},2)  WHERE InvoiceItemId = ${rr.InvoiceItemId}`;





        console.log(RRPartsId_sql1);
        console.log(CustomerPartId_sql1);
        console.log(QuoteId_sql1);
        console.log(QuoteId_sql2);
        console.log(SOId_sql1);
        console.log(SOId_sql2);
        console.log(InvoiceId_sql1);
        console.log(InvoiceId_sql2);


        async.parallel([
            function (result) {
                if (rr.RRId && rr.RRId > 0) { con.query(RRPartsId_sql1, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.CustomerPartId && rr.CustomerPartId > 0) { con.query(CustomerPartId_sql1, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.QuoteId && rr.QuoteId > 0) { con.query(QuoteId_sql1, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.QuoteId && rr.QuoteId > 0) { con.query(QuoteId_sql2, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.SOId && rr.SOId > 0) { con.query(SOId_sql1, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.SOId && rr.SOId > 0) { con.query(SOId_sql2, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.InvoiceId && rr.InvoiceId > 0) { con.query(InvoiceId_sql1, result) } else { RR.emptyFunction(rr, result); }
            },
            function (result) {
                if (rr.InvoiceId && rr.InvoiceId > 0) { con.query(InvoiceId_sql2, result) } else { RR.emptyFunction(rr, result); }
            }


        ],
            function (err, results) {
                console.log(rr.RRId + " completed")
                if (err) {
                    console.log(err);
                    return result(err, null);
                }
                return result(null, null);
            }
        );
    }
}





RRImport.RRCustomerRef = (RRJson, result) => {
    let rr = new RRImportTypeRef(RRJson);
    // console.log(rr)
    let RRQuery = `SELECT rr.RRId,rr.CustomerId  FROM tbl_repair_request as rr  WHERE rr.IsDeleted=0 and rr.RRNo= '${rr.RRNo}';`
    con.query(RRQuery, (err, res) => {
        if (err) {
            console.log(err);
        }
        // console.log(res.length)
        if (res.length > 0) {
            let rr_res = res[0];
            var CustomerId = rr.CustomerId = res[0].CustomerId;
            var RRId = rr.RRId = res[0].RRId;

            var CustomerDeptSql = `Select CustomerDepartmentId FROM tbl_customer_departments WHERE CustomerId = ${CustomerId} AND CustomerDepartmentName='${rr.CustomerDepartment}'`;
            var CustomerDeptUpdateSql = `UPDATE tbl_repair_request_customer_ref SET IsDeleted = 1 WHERE RRId = ${RRId}`;
            async.parallel([
                function (result) {
                    con.query(CustomerDeptSql, result);
                },
                function (result) {
                    con.query(CReference.getAllQuery(CustomerId), result);
                },
                function (result) {
                    con.query(CustomerDeptUpdateSql, result);
                },
            ],
                function (err, results) {
                    if (err) {
                        return result(err, null);
                    }

                    var CReferenceId1 = results[1][0][0] && results[1][0][0].CReferenceId ? results[1][0][0].CReferenceId : 0;
                    var CReferenceId2 = results[1][0][1] && results[1][0][1].CReferenceId ? results[1][0][1].CReferenceId : 0;
                    var CReferenceId3 = results[1][0][2] && results[1][0][2].CReferenceId ? results[1][0][2].CReferenceId : 0;
                    var CReferenceId4 = results[1][0][3] && results[1][0][3].CReferenceId ? results[1][0][3].CReferenceId : 0;
                    var CReferenceId5 = results[1][0][4] && results[1][0][4].CReferenceId ? results[1][0][4].CReferenceId : 0;
                    var CReferenceId6 = results[1][0][5] && results[1][0][5].CReferenceId ? results[1][0][5].CReferenceId : 0;

                    var CReferenceIdLabel1 = results[1][0][0] && results[1][0][0].CReferenceName ? results[1][0][0].CReferenceName : 'Customer Reference 1';
                    var CReferenceIdLabel2 = results[1][0][1] && results[1][0][1].CReferenceName ? results[1][0][1].CReferenceName : 'Customer Reference 2';
                    var CReferenceIdLabel3 = results[1][0][2] && results[1][0][2].CReferenceName ? results[1][0][2].CReferenceName : 'Customer Reference 3';
                    var CReferenceIdLabel4 = results[1][0][3] && results[1][0][3].CReferenceName ? results[1][0][3].CReferenceName : 'Customer Reference 4';
                    var CReferenceIdLabel5 = results[1][0][4] && results[1][0][4].CReferenceName ? results[1][0][4].CReferenceName : 'Customer Reference 5';
                    var CReferenceIdLabel6 = results[1][0][5] && results[1][0][5].CReferenceName ? results[1][0][5].CReferenceName : 'Customer Reference 6';


                    var CustomerReferenceList = [];
                    var tempobj = {};

                    tempobj.CReferenceId = CReferenceId1;
                    tempobj.ReferenceValue = rr.CustomerReference1;
                    tempobj.ReferenceLabelName = CReferenceIdLabel1;
                    CustomerReferenceList.push(tempobj);



                    tempobj = {};
                    tempobj.CReferenceId = CReferenceId2;
                    tempobj.ReferenceValue = rr.CustomerReference2;
                    tempobj.ReferenceLabelName = CReferenceIdLabel2;
                    CustomerReferenceList.push(tempobj);



                    tempobj = {};
                    tempobj.CReferenceId = CReferenceId3;
                    tempobj.ReferenceValue = rr.CustomerReference3;
                    tempobj.ReferenceLabelName = CReferenceIdLabel3;
                    CustomerReferenceList.push(tempobj);



                    tempobj = {};
                    tempobj.CReferenceId = CReferenceId4;
                    tempobj.ReferenceValue = rr.CustomerReference4;
                    tempobj.ReferenceLabelName = CReferenceIdLabel4;
                    CustomerReferenceList.push(tempobj);


                    tempobj = {};
                    tempobj.CReferenceId = CReferenceId5;
                    tempobj.ReferenceValue = rr.CustomerReference5;
                    tempobj.ReferenceLabelName = CReferenceIdLabel5;
                    CustomerReferenceList.push(tempobj);


                    tempobj = {};
                    tempobj.CReferenceId = CReferenceId6;
                    tempobj.ReferenceValue = rr.CustomerReference6;
                    tempobj.ReferenceLabelName = CReferenceIdLabel6;
                    CustomerReferenceList.push(tempobj);

                    rr.CustomerReferenceList = CustomerReferenceList;
                    console.log(results[0][0]);

                    var CustomerDepartmentId = results[0][0] && results[0][0][0] && results[0][0][0].CustomerDepartmentId ? results[0][0][0].CustomerDepartmentId : 0;

                    var CustomerDeptUpdateSql = `UPDATE tbl_repair_request SET DepartmentId = ${CustomerDepartmentId}  WHERE RRId = ${rr.RRId}`;



                    async.parallel([
                        function (result) {
                            if (rr.CustomerReferenceList.length > 0) { CustomerReference.CreateCustomerReference(rr, result); }
                            else { RR.emptyFunction(RRStatusHistoryObj, result); }
                        },
                        function (result) {
                            if (results[0][0] && results[0][0][0] && results[0][0][0].CustomerDepartmentId) { con.query(CustomerDeptUpdateSql, result) } else { RR.emptyFunction(rr, result); }
                        }
                    ],
                        function (err, results) {
                            console.log(rr.RRNo + " completed")
                            if (err) {
                                console.log(err);
                                return result(err, null);
                            }
                            return result(null, null);
                        }
                    );




                    //return result(null, null);
                }
            );


        } else {
            console.log(rr.RRNo + " completed");
            return result(null, null);
        }

    });
}







RRImport.ImportRRPriceCurrency = (RRJson, result) => {
    let rr = new RRImportType2(RRJson);
    rr.LocalCurrencyCode = 'EUR';
    rr.ExchangeRate = 1.09;

    rr.ItemLocalCurrencyCode = rr.LocalCurrencyCode;
    rr.ItemExchangeRate = rr.ExchangeRate;

    rr.PartPONLocalCurrency = rr.LocalCurrencyCode;
    rr.BasePartPON = roundTo((rr.PartPON * rr.ExchangeRate), 2);
    rr.PartPONExchangeRate = 1;

    //Local Unit Price
    rr.VendorUnitPrice = roundTo((rr.VendorQuoteGrandTotal / rr.Quantity), 2);
    rr.CustomerUnitPrice = roundTo((rr.CustomerQuoteGrandTotal / rr.Quantity), 2);

    //Base Unit Price
    rr.BaseVendorUnitPrice = roundTo((rr.VendorUnitPrice * rr.ExchangeRate), 2);
    rr.BaseCustomerUnitPrice = roundTo((rr.CustomerUnitPrice * rr.ExchangeRate), 2);

    //Base Grand Total
    rr.BaseVendorQuoteGrandTotal = roundTo((rr.VendorQuoteGrandTotal * rr.ExchangeRate), 2);
    rr.BaseCustomerQuoteGrandTotal = roundTo((rr.CustomerQuoteGrandTotal * rr.ExchangeRate), 2);



    let RRQuery = `SELECT rr.RRId,rrp.RRPartsId,CP.CustomerPartId,rrv.RRVendorId,Q.QuoteId,s.SOId,po.POId,i.InvoiceId,vi.VendorInvoiceId,vq.VendorQuoteId,rr.CustomerId,rr.PartId
                   FROM tbl_repair_request as rr 
                   LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId =rr.RRId  AND rrp.IsDeleted=0
                   LEFT JOIN tbl_customer_parts as CP ON CP.CustomerId = rr.CustomerId AND CP.PartId = rr.PartId
                   LEFT JOIN tbl_repair_request_vendors rrv on rrv.VendorId=rr.VendorId  AND rrv.RRId = rr.RRId   AND rrv.IsDeleted = 0
                   LEFT JOIN tbl_quotes Q on Q.RRId=rr.RRId AND Q.IsDeleted=0
                   LEFT JOIN tbl_vendor_quote vq on vq.QuoteId=Q.QuoteId AND vq.RRId = rr.RRId
                   LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId   AND s.IsDeleted = 0
                   LEFT JOIN tbl_invoice i on i.RRId =rr.RRId and i.IsDeleted = 0 
                   LEFT JOIN tbl_po po on po.RRId=rr.RRId and po.RRId>0 
                   LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted = 0 
                   WHERE rr.IsDeleted=0 and rr.RRNo= '${rr.RRNo}';`
    con.query(RRQuery, (err, res) => {
        if (err) {
            console.log(err);
        }
        if (res.length > 0) {
            let rr_res = res[0];

            console.log(rr_res);

            let RRPartsId_sql1 = `UPDATE tbl_repair_request_parts SET Price=ROUND(${rr.CustomerUnitPrice},2) , Rate=ROUND(${rr.CustomerQuoteGrandTotal},2) WHERE RRPartsId= ${rr_res.RRPartsId} AND RRId = ${rr_res.RRId}`;

            let RRVendorId_sql1 = `UPDATE tbl_repair_request_vendors SET GrandTotal=ROUND(${rr.VendorQuoteGrandTotal},2), ExchangeRate = '${rr.ExchangeRate}',LocalCurrencyCode='${rr.LocalCurrencyCode}' ,BaseGrandTotal=ROUND(${rr.BaseVendorQuoteGrandTotal},2) WHERE RRVendorId= ${rr_res.RRVendorId} AND RRId = ${rr_res.RRId}`;
            let RRVendorId_sql2 = `UPDATE tbl_repair_request_vendor_parts SET Rate=ROUND(${rr.VendorUnitPrice},2), BaseRate=ROUND(${rr.BaseVendorUnitPrice},2), Price=ROUND(${rr.VendorQuoteGrandTotal},2), ItemExchangeRate = '${rr.ExchangeRate}',ItemLocalCurrencyCode='${rr.LocalCurrencyCode}' ,BasePrice=ROUND(${rr.BaseVendorQuoteGrandTotal},2) WHERE RRVendorId= ${rr_res.RRVendorId} AND RRId = ${rr_res.RRId}`;

            let CustomerPartId_sql1 = `UPDATE tbl_customer_parts SET NewPrice='${rr.PartPON}',LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',BaseNewPrice='${rr.BasePartPON}' WHERE CustomerPartId = ${rr_res.CustomerPartId}  AND  CustomerId=${rr_res.CustomerId} AND PartId=${rr_res.PartId}`;

            let QuoteId_sql1 = `UPDATE tbl_quotes SET GrandTotal=ROUND(${rr.CustomerQuoteGrandTotal},2), LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',BaseGrandTotal=ROUND(${rr.BaseCustomerQuoteGrandTotal},2) WHERE QuoteId = ${rr_res.QuoteId}`;
            let QuoteId_sql2 = `UPDATE tbl_quotes_item SET VendorUnitPrice=ROUND(${rr.VendorUnitPrice},2), Rate=ROUND(${rr.CustomerUnitPrice},2) , BaseRate='${rr.BaseCustomerUnitPrice}', ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',BasePrice=ROUND(${rr.BaseCustomerQuoteGrandTotal},2),Price=ROUND(${rr.CustomerQuoteGrandTotal},2) WHERE QuoteId = ${rr_res.QuoteId}`;

            let SOId_sql1 = `UPDATE tbl_sales_order SET GrandTotal=ROUND(${rr.CustomerQuoteGrandTotal},2), LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',BaseGrandTotal=ROUND(${rr.BaseCustomerQuoteGrandTotal},2) WHERE SOId = ${rr_res.SOId}`;
            let SOId_sql2 = `UPDATE tbl_sales_order_item SET   Rate=ROUND(${rr.CustomerUnitPrice},2) , BaseRate='${rr.BaseCustomerUnitPrice}', ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',BasePrice=ROUND(${rr.BaseCustomerQuoteGrandTotal},2),Price=ROUND(${rr.CustomerQuoteGrandTotal},2) WHERE SOId = ${rr_res.SOId}`;

            let InvoiceId_sql1 = `UPDATE tbl_invoice SET GrandTotal=ROUND(${rr.CustomerQuoteGrandTotal},2), LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',BaseGrandTotal=ROUND(${rr.BaseCustomerQuoteGrandTotal},2) WHERE InvoiceId = ${rr_res.InvoiceId}`;
            let InvoiceId_sql2 = `UPDATE tbl_invoice_item SET   Rate=ROUND(${rr.CustomerUnitPrice},2) , BaseRate='${rr.BaseCustomerUnitPrice}', ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',BasePrice=ROUND(${rr.BaseCustomerQuoteGrandTotal},2),Price=ROUND(${rr.CustomerQuoteGrandTotal},2) WHERE InvoiceId = ${rr_res.InvoiceId}`;

            let POId_sql1 = `UPDATE tbl_po SET GrandTotal=ROUND(${rr.VendorQuoteGrandTotal},2), LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',BaseGrandTotal=ROUND(${rr.BaseVendorQuoteGrandTotal},2) WHERE POId = ${rr_res.POId}`;
            let POId_sql2 = `UPDATE tbl_po_item SET   Rate=ROUND(${rr.VendorUnitPrice},2) , BaseRate=ROUND(${rr.BaseVendorUnitPrice},2), ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',BasePrice=ROUND(${rr.BaseVendorQuoteGrandTotal},2),Price=ROUND(${rr.VendorQuoteGrandTotal},2) WHERE POId = ${rr_res.POId}`;

            let VendorInvoiceId_sql1 = `UPDATE tbl_vendor_invoice SET GrandTotal=ROUND(${rr.VendorQuoteGrandTotal},2), LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',BaseGrandTotal=ROUND(${rr.BaseVendorQuoteGrandTotal},2) WHERE VendorInvoiceId = ${rr_res.VendorInvoiceId}`;
            let VendorInvoiceId_sql2 = `UPDATE tbl_vendor_invoice_item SET   Rate=ROUND(${rr.VendorUnitPrice},2) , BaseRate=ROUND(${rr.BaseVendorUnitPrice},2), ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',BasePrice=ROUND(${rr.BaseVendorQuoteGrandTotal},2),Price=ROUND(${rr.VendorQuoteGrandTotal},2) WHERE VendorInvoiceId = ${rr_res.VendorInvoiceId}`;

            let VendorQuoteId_sql1 = `UPDATE tbl_vendor_quote SET GrandTotal=ROUND(${rr.VendorQuoteGrandTotal},2), LocalCurrencyCode='${rr.LocalCurrencyCode}',ExchangeRate='${rr.ExchangeRate}',BaseGrandTotal=ROUND(${rr.BaseVendorQuoteGrandTotal},2) WHERE VendorQuoteId = ${rr_res.VendorQuoteId}`;
            let VendorQuoteId_sql2 = `UPDATE tbl_vendor_quote_item SET   Rate=ROUND(${rr.VendorUnitPrice},2) , BaseRate=ROUND(${rr.BaseVendorUnitPrice},2), ItemLocalCurrencyCode='${rr.LocalCurrencyCode}',ItemExchangeRate='${rr.ExchangeRate}',BasePrice=ROUND(${rr.BaseVendorQuoteGrandTotal},2),Price=ROUND(${rr.VendorQuoteGrandTotal},2) WHERE VendorQuoteId = ${rr_res.VendorQuoteId}`;

            console.log(RRPartsId_sql1);
            console.log(RRVendorId_sql1);
            console.log(RRVendorId_sql2);
            console.log(CustomerPartId_sql1);
            console.log(QuoteId_sql1);
            console.log(QuoteId_sql2);
            console.log(SOId_sql1);
            console.log(SOId_sql2);
            console.log(InvoiceId_sql1);
            console.log(InvoiceId_sql2);
            console.log(POId_sql1);
            console.log(POId_sql2);
            console.log(VendorInvoiceId_sql1);
            console.log(VendorInvoiceId_sql2);
            console.log(VendorQuoteId_sql1);
            console.log(VendorQuoteId_sql2);

            async.parallel([
                function (result) {
                    if (rr_res.RRPartsId && rr_res.RRPartsId > 0) { con.query(RRPartsId_sql1, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.RRVendorId && rr_res.RRVendorId > 0) { con.query(RRVendorId_sql1, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.RRVendorId && rr_res.RRVendorId > 0) { con.query(RRVendorId_sql2, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.CustomerPartId && rr_res.CustomerPartId > 0) { con.query(CustomerPartId_sql1, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.QuoteId && rr_res.QuoteId > 0) { con.query(QuoteId_sql1, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.QuoteId && rr_res.QuoteId > 0) { con.query(QuoteId_sql2, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.VendorQuoteId && rr_res.VendorQuoteId > 0) { con.query(VendorQuoteId_sql1, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.VendorQuoteId && rr_res.VendorQuoteId > 0) { con.query(VendorQuoteId_sql2, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.SOId && rr_res.SOId > 0) { con.query(SOId_sql1, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.SOId && rr_res.SOId > 0) { con.query(SOId_sql2, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.InvoiceId && rr_res.InvoiceId > 0) { con.query(InvoiceId_sql1, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.InvoiceId && rr_res.InvoiceId > 0) { con.query(InvoiceId_sql2, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.POId && rr_res.POId > 0) { con.query(POId_sql1, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.POId && rr_res.POId > 0) { con.query(POId_sql2, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.VendorInvoiceId && rr_res.VendorInvoiceId > 0) { con.query(VendorInvoiceId_sql1, result) } else { RR.emptyFunction(rr, result); }
                },
                function (result) {
                    if (rr_res.VendorInvoiceId && rr_res.VendorInvoiceId > 0) { con.query(VendorInvoiceId_sql2, result) } else { RR.emptyFunction(rr, result); }
                }
            ],
                function (err, results) {
                    console.log(rr.RRNo + " completed")
                    if (err) {
                        console.log(err);
                        return result(err, null);
                    }
                    return result(null, null);
                }
            );
        }

    });
}


RRImport.ImportRRType1 = (RRJson, result) => {

    let rr = new RRImportType1(RRJson);
    console.log("Created 1 = " + rr.Created);
    //console.log(rr);



    rr.ShippingCost = 0;

    var PODueDate = null;
    var SODueDate = null;


    if (rr.SubmittedDate) {
        var date_arr = rr.SubmittedDate.split('/');
        rr.SubmittedDate = date_arr[2] + "-" + date_arr[0] + "-" + date_arr[1];
    }
    if (rr.ApprovedDate) {
        var date_arr2 = rr.ApprovedDate.split('/');
        rr.ApprovedDate = date_arr2[2] + "-" + date_arr2[0] + "-" + date_arr2[1];
    }

    if (rr.Created) {
        var date_arr3 = rr.Created.split('/');
        rr.Created = date_arr3[2] + "-" + date_arr3[0] + "-" + date_arr3[1];
    }

    if (!rr.SubmittedDate) {
        rr.SubmittedDate = rr.Created;
    }
    /*if (!rr.ApprovedDate) {
        rr.ApprovedDate = rr.SubmittedDate;
    }*/
    if (rr.RejectedDate) {
        var date_arr31 = rr.RejectedDate.split('/');
        rr.RejectedDate = date_arr31[2] + "-" + date_arr31[0] + "-" + date_arr31[1];

    }
    if (rr.CompletedDate) {
        var date_arr4 = rr.CompletedDate.split('/');
        rr.CompletedDate = date_arr4[2] + "-" + date_arr4[0] + "-" + date_arr4[1];
    }

    if (rr.InvoiceCreatedDate) {
        var date_arr5 = rr.InvoiceCreatedDate.split('/');
        rr.InvoiceCreatedDate = date_arr5[2] + "-" + date_arr5[0] + "-" + date_arr5[1];
    }
    if (rr.PORequiredDate) {
        var date_arr566 = rr.PORequiredDate.split('/');
        rr.PORequiredDate = date_arr566[2] + "-" + date_arr566[0] + "-" + date_arr566[1];
    }




    if (rr.SalesOrderRequiredDate) {
        var date_arr6 = rr.SalesOrderRequiredDate.split('/');
        rr.SalesOrderRequiredDate = date_arr6[2] + "-" + date_arr6[0] + "-" + date_arr6[1];
    }

    if (rr.SalesOrderRequiredDate != "") {
        SODueDate = rr.SalesOrderRequiredDate;
        var PODueDate1 = new Date(SODueDate);
        PODueDate1.setDate(PODueDate1.getDate() - 5);

        // PODueDate1 = new Date(SODueDate);
        /*var mnth = ("0" + (PODueDate.getMonth() + 1)).slice(-2);
        var day = ("0" + PODueDate.getDate()).slice(-2);
        PODueDate = [PODueDate.getFullYear(), mnth, day].join("-");*/

        let date = ("0" + PODueDate1.getDate()).slice(-2);
        let month = ("0" + (PODueDate1.getMonth() + 1)).slice(-2);
        let year = PODueDate1.getFullYear();
        PODueDate = (year + "-" + month + "-" + date);
        console.log("SODueDate = " + SODueDate);
        console.log("PODueDate = " + PODueDate);
        // return result({ msg: SODueDate + ' ' + PODueDate }, null);

    }
    if (rr.POcreatedDate) {
        var date_arr66 = rr.POcreatedDate.split('/');
        rr.POcreatedDate = date_arr66[2] + "-" + date_arr66[0] + "-" + date_arr66[1];
    }
    if (rr.SoCreatedDate) {
        var date_arr67 = rr.SoCreatedDate.split('/');
        rr.SoCreatedDate = date_arr67[2] + "-" + date_arr67[0] + "-" + date_arr67[1];
    }
    if (!rr.POcreatedDate) {
        rr.POcreatedDate = rr.ApprovedDate;
    }
    if (!rr.SoCreatedDate) {
        rr.SoCreatedDate = rr.ApprovedDate;
    }


    if (!rr.Quantity) {
        rr.Quantity = 1;
    }

    /* if (!rr.CompletedDate) {
         rr.CompletedDate = rr.ApprovedDate;
     }*/

    if (!rr.InvoiceTotal) {
        rr.InvoiceTotal = rr.CustomerQuoteGrandTotal;
    }
    if (!rr.VendorBillTotal) {
        rr.VendorBillTotal = rr.VendorQuoteGrandTotal;
    }
    if (!rr.InvoiceStatus) {
        rr.InvoiceStatus = "Approved";
    }
    let ManufacturerQuery = `SELECT VendorId as ManufacturerId,'-' test FROM tbl_vendors WHERE IsDeleted=0 and VendorName= '${rr.ManufacturerName}';`
    let PartCheckQuery = ` SELECT * FROM tbl_parts WHERE IsDeleted=0 and PartNo = '${rr.PartNo}' `;
    let CustomerQuery = `SELECT CustomerId,'-' test FROM tbl_customers WHERE IsDeleted=0 and CompanyName= '${rr.CompanyName}'`;
    let VendorQuery = `SELECT VendorId,'-' test FROM tbl_vendors WHERE IsDeleted=0 and VendorName= '${rr.VendorName}';`
    let RRQuery = `SELECT RRId,'-' test FROM tbl_repair_request WHERE IsDeleted=0 and RRNo= '${rr.RRNo}'; `



    var boolStatus2 = false, boolStatus3 = false, boolStatus4 = false, boolStatus5 = false, boolStatus6 = false, boolStatus7 = false;
    var boolStatus0 = false;

    if (rr.StatusName == "Quote Approved") {
        boolStatus4 = true; boolStatus5 = true;
    }
    else if (rr.StatusName == "Customer Quote Submitted") {
        boolStatus4 = true;
    }
    else if (rr.StatusName == "Customer Quote Ready" || rr.StatusName == "Quote submitted by vendor") {
        boolStatus2 = true;
        boolStatus3 = true;
    }
    else if (rr.StatusName == "Open" || rr.StatusName == "Submitted") {
        boolStatus0 = true;
    }
    else if (rr.StatusName == "Submitted to Vendor" || rr.StatusName == "Awaiting Vendor Estimate") {
        boolStatus2 = true;
    }
    else {
        console.log("Invalid Status")
        return result({ msg: "Invalid Status" }, null);
    }

    async.parallel([
        function (result) { con.query(PartCheckQuery, result); },
        function (result) { con.query(VendorQuery, result); },
        function (result) { con.query(CustomerQuery, result); },
        function (result) { con.query(ManufacturerQuery, result); },
        function (result) { con.query(MROModel.SelectSettingsInfo(), result); },
        function (result) { con.query(RRQuery, result); },
    ],
        function (err, results) {
            if (err) {
                return result(err, null);
            }
            else if (results[5][0].length > 0) {
                console.log("Already Record Exist")
                return result({ msg: "Already Record Exist" }, null);
            } else if (rr.StatusName != "Open" && rr.StatusName != "Submitted" && (!results[1][0][0] || !results[1][0][0].VendorId)) {
                console.log("Vendor not available : " + rr.VendorName)
                return result({ msg: "Vendor not available : " + rr.VendorName }, null);
            }
            else if (!results[2][0][0] || !results[2][0][0].CustomerId) {
                console.log("Customer not available : " + rr.CompanyName)
                return result({ msg: "Customer not available : " + rr.CompanyName }, null);
            } else {
                let PartId = 0; let VendorId = 0; let CustomerId = 0; let ManufacturerId = 0;
                PartId = results[0][0][0] ? results[0][0][0].PartId : 0;
                VendorId = results[1][0][0] ? results[1][0][0].VendorId : 0;
                CustomerId = results[2][0][0] ? results[2][0][0].CustomerId : 0;
                ManufacturerId = results[3][0][0] ? results[3][0][0].ManufacturerId : 0;
                rr.TaxPercent = results[4][0][0].TaxPercent ? results[4][0][0].TaxPercent : 0;
                rr.CustomerId = CustomerId; rr.MROId = 0;

                rr.BaseCurrencyCode = 'USD';

                if (rr.RRCurrency == 'Euro' || rr.RRCurrency == 'EUR') {
                    rr.LocalCurrencyCode = 'EUR';
                    rr.ExchangeRate = 1.09;
                } else if (rr.RRCurrency == 'Ron') {
                    rr.LocalCurrencyCode = 'EUR';
                    rr.VendorQuoteGrandTotal = roundTo((rr.VendorQuoteGrandTotal * 0.2), 2)
                    rr.CustomerQuoteGrandTotal = roundTo((rr.CustomerQuoteGrandTotal * 0.2), 2)
                    rr.PartPON = roundTo((rr.PartPON * 0.2), 2)
                    rr.ExchangeRate = 1.09;

                } else if (rr.RRCurrency == 'GBP') {
                    rr.LocalCurrencyCode = 'EUR';
                    rr.VendorQuoteGrandTotal = roundTo((rr.VendorQuoteGrandTotal * 1.2), 2)
                    rr.CustomerQuoteGrandTotal = roundTo((rr.CustomerQuoteGrandTotal * 1.2), 2)
                    rr.PartPON = roundTo((rr.PartPON * 1.2), 2)
                    rr.ExchangeRate = 1.09;
                }


                var ObjPart = new PartsModel({
                    PartNo: rr.PartNo,
                    Description: rr.Description,
                    ManufacturerPartNo: rr.ManufacturerPartNo,
                    ManufacturerId: ManufacturerId,
                    Quantity: rr.Quantity,
                    Price: rr.PartPON,
                    IsNewOrRefurbished: 2,
                    ExchangeRate: 1,
                    LocalCurrencyCode: rr.LocalCurrencyCode,
                    BaseCurrencyCode: rr.BaseCurrencyCode
                });

                async.parallel([
                    function (result) {
                        if (PartId == 0) { PartsModel.addNewPart(ObjPart, result); }
                        else { RR.emptyFunction(RRJson, result); }
                    },
                    function (result) { con.query(AddessBook.GetBillingAddressIdByCustomerId(CustomerId), result); },
                    function (result) { con.query(AddessBook.GetShippingAddressIdByCustomerId(CustomerId), result); },
                    function (result) { con.query(CustomerDepartmentModel.selectbyname(CustomerId, rr.Department), result); },
                    function (result) { con.query(CReference.getAllQuery(CustomerId), result); },
                ],
                    function (err, results) {
                        if (err) {
                            return result(err, null);
                        }
                        else {
                            if (PartId == 0) {
                                if (results[0].id > 0) {
                                    PartId = results[0].id;
                                }
                            }
                            if (results[1][0].length > 0) {
                                rr.CustomerBillToId = results[1][0][0].AddressId;
                            }
                            if (results[2][0].length > 0) {
                                rr.CustomerShipToId = results[2][0][0].AddressId;
                            }
                            if (results[3][0].length > 0) {
                                rr.DepartmentId = results[3][0][0].CustomerDepartmentId;
                            }



                            rr.ItemExchangeRate = rr.ExchangeRate;
                            rr.PartPONLocalCurrency = rr.LocalCurrencyCode;
                            rr.BasePartPON = roundTo((rr.PartPON * rr.ExchangeRate), 2);
                            rr.PartPONExchangeRate = rr.ExchangeRate;

                            //Local Unit Price
                            rr.VendorUnitPrice = roundTo((rr.VendorQuoteGrandTotal / rr.Quantity), 2);
                            rr.CustomerUnitPrice = roundTo((rr.CustomerQuoteGrandTotal / rr.Quantity), 2);

                            //Base Unit Price
                            rr.BaseVendorUnitPrice = roundTo((rr.VendorUnitPrice * rr.ExchangeRate), 2);
                            rr.BaseCustomerUnitPrice = roundTo((rr.CustomerUnitPrice * rr.ExchangeRate), 2);

                            //Base Grand Total
                            rr.BaseVendorQuoteGrandTotal = roundTo((rr.VendorQuoteGrandTotal * rr.ExchangeRate), 2);
                            rr.BaseCustomerQuoteGrandTotal = roundTo((rr.CustomerQuoteGrandTotal * rr.ExchangeRate), 2);


                            rr.CustomerId = CustomerId;
                            rr.VendorId = VendorId;
                            rr.PartId = PartId;
                            rr.RRDescription = rr.Description;
                            rr.IsRushRepair = rr.IsRushRepair == "Normal" ? 0 : 1;
                            rr.Shipping = rr.ShippingCost;
                            rr.LeadTime = 20;
                            rr.WarrantyPeriod = 18;
                            rr.GrandTotal = parseFloat(rr.Shipping) + parseFloat(rr.CustomerQuoteGrandTotal);
                            rr.VendorCost = parseFloat(rr.Shipping) + parseFloat(rr.VendorQuoteGrandTotal);
                            rr.IsWarranty = rr.Warranty == "Yes" ? 1 : 0;
                            rr.RRCompletedDate = rr.StatusName == "Completed" ? rr.CompletedDate : '';

                            rr.BaseGrandTotal = rr.GrandTotal;



                            rr.ItemLocalCurrencyCode = rr.LocalCurrencyCode;
                            rr.ItemBaseCurrencyCode = rr.BaseCurrencyCode;
                            rr.ItemExchangeRate = rr.ExchangeRate;

                            rr.PartPONLocalCurrency = rr.LocalCurrencyCode;
                            rr.PartPONBaseCurrency = rr.BaseCurrencyCode;
                            rr.PartPONExchangeRate = rr.ExchangeRate;

                            var arrRRParts = [];
                            var ObjRRPart = new RRParts({
                                PartId: rr.PartId,
                                PartNo: rr.PartNo,
                                CustomerPartNo1: rr.CustomerPartNo1,
                                CustomerPartNo2: rr.CustomerPartNo2,
                                Description: rr.Description,
                                ManufacturerPartNo: rr.ManufacturerPartNo,
                                Manufacturer: ManufacturerId,
                                SerialNo: rr.SerialNo,
                                Quantity: rr.Quantity,
                                Rate: 0,
                                Price: 0,
                                WarrantyPeriod: rr.WarrantyPeriod,
                                LeadTime: rr.LeadTime,
                            });
                            console.log("RR Log")
                            console.log(rr);


                            arrRRParts.push(ObjRRPart); rr.RRParts = arrRRParts;
                            RR.CreateRequest(rr, (err, data) => {

                                if (!data) {
                                    return result({ msg: "There is a problem in creating a Repair Request. Pelase check the details." }, null);
                                }
                                rr.RRId = data.id;
                                var RRStatusHistoryObj = new RRStatusHistory({
                                    RRId: data.id,
                                    HistoryStatus: Constants.CONST_RRS_GENERATED
                                });
                                RRStatusHistoryObj.Created = rr.Created + ' 11:00:00';
                                var RRNotificationObj = new NotificationModel({
                                    RRId: data.id,
                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                    NotificationIdentityId: data.id,
                                    NotificationIdentityNo: rr.RRNo,
                                    ShortDesc: 'RR Created',
                                    Description: 'RR Created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                });
                                RRNotificationObj.Created = rr.Created;
                                var RRSourcedStatusHistoryObj = new RRStatusHistory({
                                    RRId: rr.RRId,
                                    HistoryStatus: Constants.CONST_RRS_NEED_SOURCED
                                });
                                RRSourcedStatusHistoryObj.Created = rr.Created;

                                var RRSourcedNotificationObj = new NotificationModel({
                                    RRId: rr.RRId,
                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                    NotificationIdentityId: rr.RRId,
                                    NotificationIdentityNo: rr.RRNo,
                                    ShortDesc: 'RR Verified',
                                    Description: 'RR Verified by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                });
                                RRSourcedNotificationObj.Created = rr.Created;
                                var CustomerReferenceList = [];

                                rr.CustomerReference1 = rr.CustomerReference1 != '' ? rr.CustomerReference1 : 'N/A';
                                rr.CustomerReference2 = rr.CustomerReference2 != '' ? rr.CustomerReference2 : 'N/A';
                                rr.CustomerReference3 = rr.CustomerReference3 != '' ? rr.CustomerReference3 : 'N/A';
                                rr.CustomerReference4 = rr.CustomerReference4 != '' ? rr.CustomerReference4 : 'N/A';
                                rr.CustomerReference5 = rr.CustomerReference5 != '' ? rr.CustomerReference5 : 'N/A';
                                rr.CustomerReference6 = rr.CustomerReference6 != '' ? rr.CustomerReference6 : 'N/A';

                                var CReferenceId1 = results[4][0][0] && results[4][0][0].CReferenceId ? results[4][0][0].CReferenceId : 0;
                                var CReferenceId2 = results[4][0][1] && results[4][0][1].CReferenceId ? results[4][0][1].CReferenceId : 0;
                                var CReferenceId3 = results[4][0][1] && results[4][0][2].CReferenceId ? results[4][0][2].CReferenceId : 0;
                                var CReferenceId4 = results[4][0][2] && results[4][0][3].CReferenceId ? results[4][0][3].CReferenceId : 0;
                                var CReferenceId5 = results[4][0][3] && results[4][0][4].CReferenceId ? results[4][0][4].CReferenceId : 0;
                                var CReferenceId6 = results[4][0][5] && results[4][0][5].CReferenceId ? results[4][0][5].CReferenceId : 0;

                                var CReferenceIdLabel1 = results[4][0][0] && results[4][0][0].CReferenceName ? results[4][0][0].CReferenceName : 'Customer Reference 1';
                                var CReferenceIdLabel2 = results[4][0][1] && results[4][0][1].CReferenceName ? results[4][0][1].CReferenceName : 'Customer Reference 2';
                                var CReferenceIdLabel3 = results[4][0][2] && results[4][0][2].CReferenceName ? results[4][0][2].CReferenceName : 'Customer Reference 3';
                                var CReferenceIdLabel4 = results[4][0][3] && results[4][0][3].CReferenceName ? results[4][0][3].CReferenceName : 'Customer Reference 4';
                                var CReferenceIdLabel5 = results[4][0][4] && results[4][0][4].CReferenceName ? results[4][0][4].CReferenceName : 'Customer Reference 5';
                                var CReferenceIdLabel6 = results[4][0][5] && results[4][0][5].CReferenceName ? results[4][0][5].CReferenceName : 'Customer Reference 6';



                                if (rr.CustomerReference1 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = CReferenceId1; tempobj.ReferenceValue = rr.CustomerReference1; tempobj.ReferenceLabelName = CReferenceIdLabel1;
                                    CustomerReferenceList.push(tempobj);
                                }

                                if (rr.CustomerReference2 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = CReferenceId2; tempobj.ReferenceValue = rr.CustomerReference2; tempobj.ReferenceLabelName = CReferenceIdLabel2;
                                    CustomerReferenceList.push(tempobj);
                                }

                                if (rr.CustomerReference3 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = CReferenceId3; tempobj.ReferenceValue = rr.CustomerReference3; tempobj.ReferenceLabelName = CReferenceIdLabel3;
                                    CustomerReferenceList.push(tempobj);
                                }

                                if (rr.CustomerReference4 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = CReferenceId4; tempobj.ReferenceValue = rr.CustomerReference4; tempobj.ReferenceLabelName = CReferenceIdLabel4;
                                    CustomerReferenceList.push(tempobj);
                                }
                                if (rr.CustomerReference5 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = CReferenceId5; tempobj.ReferenceValue = rr.CustomerReference5; tempobj.ReferenceLabelName = CReferenceIdLabel5;
                                    CustomerReferenceList.push(tempobj);
                                }
                                if (rr.CustomerReference6 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = CReferenceId6; tempobj.ReferenceValue = rr.CustomerReference6; tempobj.ReferenceLabelName = CReferenceIdLabel6;
                                    CustomerReferenceList.push(tempobj);
                                }
                                rr.CustomerReferenceList = CustomerReferenceList;
                                const RRVendorsObj = new RRVendorModel({
                                    MROId: 0,
                                    RRId: rr.RRId,
                                    VendorId: rr.VendorId,
                                    TaxPercent: rr.TaxPercent,
                                    SubTotal: rr.VendorQuoteGrandTotal,
                                    GrandTotal: rr.VendorCost,
                                    VendorRefNo: rr.VendorRefNo,
                                    RouteCause: rr.RouteCause,
                                    Shipping: rr.ShippingCost,
                                    Status: Constants.CONST_VENDOR_STATUS_APPROVED,
                                    LeadTime: rr.LeadTime,
                                    WarrantyPeriod: rr.WarrantyPeriod,
                                    LocalCurrencyCode: rr.LocalCurrencyCode,
                                    ExchangeRate: rr.ExchangeRate,
                                    BaseCurrencyCode: rr.BaseCurrencyCode,
                                    BaseGrandTotal: rr.BaseVendorQuoteGrandTotal
                                });
                                if (boolStatus2 == true)
                                    RRVendorsObj.Status = 0;

                                const CustomerPartObj = new CustomerPartmodel({
                                    PartId: rr.PartId,
                                    CustomerId: rr.CustomerId,
                                    NewPrice: rr.PartPON,
                                    LastPricePaid: 0,
                                    LocalCurrencyCode: rr.LocalCurrencyCode,
                                    ExchangeRate: rr.ExchangeRate,
                                    BaseCurrencyCode: rr.BaseCurrencyCode,
                                    BaseNewPrice: rr.BasePartPON
                                });

                                const NoteObj = new RepairRequestNotes({
                                    RRId: rr.RRId,
                                    IdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                    IdentityId: rr.RRId,
                                    NotesType: 1,
                                    Notes: rr.Note,
                                });

                                async.parallel([
                                    function (result) {
                                        if (rr.CustomerReferenceList.length > 0) { CustomerReference.CreateCustomerReference(rr, result); }
                                        else { RR.emptyFunction(RRStatusHistoryObj, result); }
                                    },
                                    function (result) {
                                        if (rr.hasOwnProperty('RRParts')) { RRParts.CreateRRParts(rr.RRId, rr.RRParts, result); }
                                        else { RR.emptyFunction(RRStatusHistoryObj, result); }
                                    },
                                    function (result) {
                                        if (!boolStatus0) {
                                            RRVendorModel.CreateRRVendors(RRVendorsObj, result);
                                        } else { RR.emptyFunction(rr, result); }
                                    },
                                    function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
                                    function (result) { NotificationModel.Create(RRNotificationObj, result); },
                                    function (result) { con.query(RR.UpdateCustomerBillShipQuery(rr), result); },
                                    function (result) { con.query(TermsModel.GetDefaultTerm(), result) },
                                    function (result) { con.query(UserModel.listbyuserquery(Constants.CONST_IDENTITY_TYPE_CUSTOMER, CustomerId), result) },
                                    function (result) { con.query(RR.UpdateImportRRNo(rr), result); },
                                    function (result) { con.query(RR.UpdatePartPONQuery(rr), result); },
                                    function (result) {
                                        if (!boolStatus0) { RRStatusHistory.Create(RRSourcedStatusHistoryObj, result); }
                                        else { RR.emptyFunction(rr, result); }
                                    },
                                    function (result) {
                                        if (!boolStatus0) {
                                            NotificationModel.Create(RRSourcedNotificationObj, result);
                                        }
                                        else { RR.emptyFunction(rr, result); }
                                    },
                                    function (result) { CustomerPartmodel.createforRRImport(CustomerPartObj, result); },
                                    function (result) {
                                        if (NoteObj.Notes != '') { RepairRequestNotes.create(NoteObj, result); }
                                        else { RR.emptyFunction(rr, result); }
                                    },
                                ],
                                    function (err, results) {
                                        if (err) { console.log(err); return result(err, null); }
                                        else {
                                            rr.RRVendorId = results[2].RRVendorId > 0 ? results[2].RRVendorId : 0;
                                            const RRVendorPartsObj = new RRVendorPartModel({
                                                RRVendorId: rr.RRVendorId,
                                                RRId: rr.RRId,
                                                PartId: rr.PartId,
                                                VendorId: VendorId,
                                                PartNo: rr.PartNo,
                                                Description: rr.Description,
                                                Quantity: rr.Quantity,
                                                Rate: rr.VendorUnitPrice,
                                                Price: rr.VendorQuoteGrandTotal,
                                                WarrantyPeriod: rr.WarrantyPeriod,
                                                LeadTime: rr.LeadTime,

                                                ItemLocalCurrencyCode: rr.ItemLocalCurrencyCode,
                                                ItemExchangeRate: rr.ItemExchangeRate,
                                                ItemBaseCurrencyCode: rr.ItemBaseCurrencyCode,
                                                BaseRate: rr.BaseVendorUnitPrice,
                                                BasePrice: rr.BaseVendorQuoteGrandTotal,

                                            });

                                            const RRObj = new RR({
                                                RRId: rr.RRId,
                                                Status: Constants.CONST_RRS_AWAIT_VQUOTE
                                            });

                                            var RRStatusHistoryObj = new RRStatusHistory({
                                                RRId: rr.RRId,
                                                HistoryStatus: Constants.CONST_RRS_AWAIT_VQUOTE
                                            });
                                            RRStatusHistoryObj.Created = rr.Created + ' 11:00:00';

                                            var NotificationObj = new NotificationModel({
                                                RRId: rr.RRId,
                                                NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                                NotificationIdentityId: rr.RRId,
                                                NotificationIdentityNo: rr.RRNo,
                                                ShortDesc: 'RR Needs To Be Sourced',
                                                Description: 'RR Needs To Be Sourced by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                            });
                                            NotificationObj.Created = rr.Created;
                                            if (results[6][0].length > 0) {
                                                rr.TermsId = results[6][0][0].TermsId;
                                            }
                                            if (results[7][0].length > 0) {
                                                rr.FirstName = results[7][0][0].FirstName;
                                                rr.LastName = results[7][0][0].LastName;
                                                rr.Email = results[7][0][0].Email;
                                            }

                                            rr.ShippingFee = rr.ShippingCost;
                                            rr.IdentityType = Constants.CONST_IDENTITY_TYPE_CUSTOMER; rr.IdentityId = CustomerId;

                                            var VendorQuoteobj = {}; var Quoteobj = {};
                                            Quoteobj = new QuotesModel(rr);
                                            Quoteobj.Status = 3;
                                            Quoteobj.TotalValue = rr.CustomerQuoteGrandTotal;
                                            Quoteobj.QuoteType = Constants.CONST_QUOTE_TYPE_REPAIR;
                                            Quoteobj.BaseGrandTotal = rr.BaseCustomerQuoteGrandTotal;




                                            VendorQuoteobj = new VendorQuote(rr);
                                            VendorQuoteobj.Status = 2;
                                            VendorQuoteobj.Shipping = rr.ShippingCost;
                                            VendorQuoteobj.SubTotal = rr.VendorQuoteGrandTotal;
                                            VendorQuoteobj.GrandTotal = rr.VendorQuoteGrandTotal;

                                            VendorQuoteobj.BaseGrandTotal = rr.BaseVendorQuoteGrandTotal;
                                            VendorQuoteobj.ItemExchangeRate = rr.ItemExchangeRate;
                                            VendorQuoteobj.ItemBaseCurrencyCode = rr.ItemBaseCurrencyCode;
                                            VendorQuoteobj.ItemLocalCurrencyCode = rr.ItemLocalCurrencyCode;

                                            async.parallel([
                                                function (result) {
                                                    if (!boolStatus0) {
                                                        RR.UpdateVendorOfRequestByRRId(rr, result);
                                                    } else { RR.emptyFunction(rr, result); }
                                                },
                                                function (result) {
                                                    if (!boolStatus0) {
                                                        RRVendorPartModel.CreateRRVendorParts(RRVendorPartsObj, result);
                                                    } else { RR.emptyFunction(rr, result); }
                                                },
                                                function (result) {
                                                    if (!boolStatus0) {
                                                        RR.ChangeRRStatus(RRObj, result);
                                                    } else { RR.emptyFunction(rr, result); }
                                                },
                                                function (result) {
                                                    if (!boolStatus0) {
                                                        RRStatusHistory.Create(RRStatusHistoryObj, result);
                                                    }
                                                    else { RR.emptyFunction(rr, result); }
                                                },
                                                function (result) {
                                                    if (!boolStatus0) {
                                                        NotificationModel.Create(NotificationObj, result);
                                                    }
                                                    else { RR.emptyFunction(rr, result); }
                                                },
                                                function (result) {
                                                    if ((!boolStatus2 && !boolStatus0) || boolStatus3) { QuotesModel.CreateQuotes(Quoteobj, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },
                                            ],
                                                function (err, results) {
                                                    if (err) { console.log(err); return result(err, null); }
                                                    else {

                                                        rr.QuoteId = results[5].id > 0 ? results[5].id : 0;
                                                        VendorQuoteobj.QuoteId = rr.QuoteId;


                                                        var CustomerLineItem = {}; var CustomerQuoteItem = [];
                                                        CustomerLineItem.PartId = rr.PartId;
                                                        CustomerLineItem.PartNo = rr.PartNo;
                                                        CustomerLineItem.PartDescription = rr.Description;
                                                        CustomerLineItem.Quantity = rr.Quantity;
                                                        CustomerLineItem.LeadTime = rr.LeadTime;
                                                        CustomerLineItem.PartNo = rr.PartNo;
                                                        CustomerLineItem.Rate = rr.CustomerUnitPrice;
                                                        CustomerLineItem.Price = roundTo((CustomerLineItem.Quantity * CustomerLineItem.Rate), 2);
                                                        CustomerLineItem.VendorId = rr.VendorId;
                                                        CustomerLineItem.RRId = rr.RRId;
                                                        CustomerLineItem.Description = rr.Description;
                                                        CustomerLineItem.VendorUnitPrice = rr.VendorUnitPrice;
                                                        CustomerLineItem.SerialNo = rr.SerialNo;
                                                        CustomerLineItem.WarrantyPeriod = rr.WarrantyPeriod;

                                                        CustomerLineItem.ItemExchangeRate = rr.ItemExchangeRate;
                                                        CustomerLineItem.ItemBaseCurrencyCode = rr.ItemBaseCurrencyCode;
                                                        CustomerLineItem.ItemLocalCurrencyCode = rr.ItemLocalCurrencyCode;
                                                        CustomerLineItem.BaseRate = rr.BaseCustomerUnitPrice;
                                                        CustomerLineItem.BasePrice = rr.BaseCustomerQuoteGrandTotal;


                                                        CustomerQuoteItem.push(CustomerLineItem); rr.CustomerQuoteItem = CustomerQuoteItem;

                                                        //for invocie  
                                                        var CustomerLineItemInvoice = {}; var CustomerQuoteItemInvoice = [];
                                                        CustomerLineItemInvoice.PartId = rr.PartId;
                                                        CustomerLineItemInvoice.PartNo = rr.PartNo;
                                                        CustomerLineItemInvoice.PartDescription = rr.Description;
                                                        CustomerLineItemInvoice.Quantity = rr.Quantity;
                                                        CustomerLineItemInvoice.LeadTime = rr.LeadTime;
                                                        CustomerLineItemInvoice.PartNo = rr.PartNo;
                                                        CustomerLineItemInvoice.Rate = rr.CustomerUnitPrice;
                                                        CustomerLineItemInvoice.Price = roundTo((CustomerLineItemInvoice.Quantity * CustomerLineItemInvoice.Rate), 2);
                                                        CustomerLineItemInvoice.VendorId = rr.VendorId;
                                                        CustomerLineItemInvoice.RRId = rr.RRId;
                                                        CustomerLineItemInvoice.Description = rr.Description;
                                                        CustomerLineItemInvoice.VendorUnitPrice = rr.VendorUnitPrice;
                                                        CustomerLineItemInvoice.SerialNo = rr.SerialNo;
                                                        CustomerLineItemInvoice.WarrantyPeriod = rr.WarrantyPeriod;

                                                        CustomerLineItemInvoice.ItemExchangeRate = rr.ItemExchangeRate;
                                                        CustomerLineItemInvoice.ItemBaseCurrencyCode = rr.ItemBaseCurrencyCode;
                                                        CustomerLineItemInvoice.ItemLocalCurrencyCode = rr.ItemLocalCurrencyCode;
                                                        CustomerLineItemInvoice.BaseRate = rr.BaseCustomerUnitPrice;
                                                        CustomerLineItemInvoice.BasePrice = rr.BaseCustomerQuoteGrandTotal;

                                                        CustomerQuoteItemInvoice.push(CustomerLineItemInvoice); rr.CustomerQuoteItemInvoice = CustomerQuoteItemInvoice;



                                                        var VLineItem = {}; var VQItem = [];
                                                        VLineItem.PartId = rr.PartId;
                                                        VLineItem.PartNo = rr.PartNo;
                                                        VLineItem.PartDescription = rr.Description;
                                                        VLineItem.Quantity = rr.Quantity;
                                                        VLineItem.LeadTime = rr.LeadTime;
                                                        VLineItem.PartNo = rr.PartNo;
                                                        VLineItem.Rate = rr.VendorUnitPrice;
                                                        VLineItem.Price = roundTo((VLineItem.Quantity * VLineItem.Rate), 2);
                                                        VLineItem.VendorId = rr.VendorId;
                                                        VLineItem.RRId = rr.RRId;
                                                        VLineItem.Description = rr.Description;
                                                        VLineItem.SerialNo = rr.SerialNo;
                                                        VLineItem.WarrantyPeriod = rr.WarrantyPeriod;

                                                        VLineItem.ItemExchangeRate = rr.ItemExchangeRate;
                                                        VLineItem.ItemBaseCurrencyCode = rr.ItemBaseCurrencyCode;
                                                        VLineItem.ItemLocalCurrencyCode = rr.ItemLocalCurrencyCode;
                                                        VLineItem.BaseRate = rr.BaseVendorUnitPrice;
                                                        VLineItem.BasePrice = rr.BaseVendorQuoteGrandTotal;

                                                        VQItem.push(VLineItem); rr.VQItem = VQItem;


                                                        //for vendor bill
                                                        var VQItemVendorBill = [];
                                                        var VLineItemVB = {}; var VQItemVendorBill = [];
                                                        VLineItemVB.PartId = rr.PartId;
                                                        VLineItemVB.PartNo = rr.PartNo;
                                                        VLineItemVB.PartDescription = rr.Description;
                                                        VLineItemVB.Quantity = rr.Quantity;
                                                        VLineItemVB.LeadTime = rr.LeadTime;
                                                        VLineItemVB.PartNo = rr.PartNo;
                                                        VLineItemVB.Rate = rr.VendorUnitPrice;
                                                        VLineItemVB.Price = roundTo((VLineItemVB.Quantity * VLineItemVB.Rate), 2);
                                                        VLineItemVB.VendorId = rr.VendorId;
                                                        VLineItemVB.RRId = rr.RRId;
                                                        VLineItemVB.Description = rr.Description;
                                                        VLineItemVB.SerialNo = rr.SerialNo;
                                                        VLineItemVB.WarrantyPeriod = rr.WarrantyPeriod;


                                                        VLineItemVB.ItemExchangeRate = rr.ItemExchangeRate;
                                                        VLineItemVB.ItemBaseCurrencyCode = rr.ItemBaseCurrencyCode;
                                                        VLineItemVB.ItemLocalCurrencyCode = rr.ItemLocalCurrencyCode;
                                                        VLineItemVB.BaseRate = rr.BaseVendorUnitPrice;
                                                        VLineItemVB.BasePrice = rr.BaseVendorQuoteGrandTotal;


                                                        VQItemVendorBill.push(VLineItemVB); rr.VQItemVendorBill = VQItemVendorBill;



                                                        var NotificationObj = new NotificationModel({
                                                            RRId: rr.RRId,
                                                            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                            NotificationIdentityId: rr.QuoteId,
                                                            NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                            ShortDesc: 'Customer Quote Created',
                                                            Description: 'Customer Quote Created by Admin (' + global.authuser.FullName + ') on ' + rr.SubmittedDate
                                                        });
                                                        NotificationObj.Created = rr.Created;

                                                        async.parallel([
                                                            function (result) {
                                                                if ((!boolStatus2 && !boolStatus0) || boolStatus3) { QuotesItemModel.CreateQuoteItem(rr.QuoteId, rr.CustomerQuoteItem, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if ((!boolStatus2 && !boolStatus0) || boolStatus3) { QuotesModel.UpdateQuotesCodeByQuoteId(rr, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if ((!boolStatus2 && !boolStatus0) || boolStatus3) { con.query(Quotes.UpdateQuoteDate(rr.SubmittedDate, rr.QuoteId), result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if ((!boolStatus2 && !boolStatus0) || boolStatus3) { VendorQuote.CreateVendorQuote(VendorQuoteobj, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },

                                                            function (result) {
                                                                if ((!boolStatus2 && !boolStatus0) || boolStatus3) { NotificationModel.Create(NotificationObj, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                        ],
                                                            function (err, results) {
                                                                if (err)
                                                                    return result(err, null);
                                                                else {

                                                                    var SubmitRRStatusHistoryObj = new RRStatusHistory({
                                                                        RRId: rr.RRId,
                                                                        HistoryStatus: Constants.CONST_RRS_QUOTE_SUBMITTED
                                                                    });
                                                                    SubmitRRStatusHistoryObj.Created = rr.SubmittedDate + ' 11:00:00';;

                                                                    var _QuoteObj = {};
                                                                    _QuoteObj.RRId = rr.RRId;
                                                                    _QuoteObj.Status = Constants.CONST_RRS_QUOTE_SUBMITTED;

                                                                    var SubmitQuoteObj = new QuotesModel({
                                                                        RRId: rr.RRId,
                                                                        QuoteId: rr.QuoteId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_SUBMITTED,
                                                                        QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_SUBMITTED,
                                                                        SubmittedDate: rr.SubmittedDate + ' 11:00:00',
                                                                    });

                                                                    var SubmitNotificationObj = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                                        NotificationIdentityId: rr.QuoteId,
                                                                        NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                                        ShortDesc: 'Customer Quote Submitted',
                                                                        Description: 'Customer Quote Submitted to Customer  by Admin (' + global.authuser.FullName + ') on ' + rr.SubmittedDate
                                                                    });
                                                                    SubmitNotificationObj.Created = rr.SubmittedDate;
                                                                    var VendorQuoteId = results[3].id > 0 ? results[3].id : 0;
                                                                    var ApproveQuoteObj = new QuotesModel({
                                                                        RRId: rr.RRId,
                                                                        QuoteId: rr.QuoteId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_APPROVED,
                                                                        QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_ACCEPTED,
                                                                        ApprovedDate: rr.ApprovedDate + ' 11:00:00'
                                                                    });
                                                                    var ApproveQuoteObjQuoted = new QuotesModel({
                                                                        RRId: rr.RRId,
                                                                        QuoteId: rr.QuoteId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_QUOTED,
                                                                        ApprovedDate: rr.ApprovedDate + ' 11:00:00'
                                                                    });

                                                                    var ApproveRRStatusHistoryObj = new RRStatusHistory({
                                                                        RRId: rr.RRId,
                                                                        HistoryStatus: Constants.CONST_RRS_IN_PROGRESS
                                                                    });
                                                                    ApproveRRStatusHistoryObj.Created = rr.ApprovedDate + ' 11:00:00';;

                                                                    var ApproveNotificationObj = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                                        NotificationIdentityId: rr.QuoteId,
                                                                        NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                                        ShortDesc: 'Customer Quote Approved',
                                                                        Description: 'Customer Quote Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                    });
                                                                    ApproveNotificationObj.Created = rr.ApprovedDate;
                                                                    var NotificationObjForCustomerPO = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                                                        NotificationIdentityId: rr.RRId,
                                                                        NotificationIdentityNo: 'CustomerPO' + rr.RRId,
                                                                        ShortDesc: 'Customer PO Received',
                                                                        Description: 'Customer PO updated by  Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                    });
                                                                    NotificationObjForCustomerPO.Created = rr.ApprovedDate;
                                                                    rr.Status = Constants.CONST_RRS_IN_PROGRESS;

                                                                    var POObj = new PurchaseOrderModel(rr);
                                                                    POObj.POType = Constants.CONST_PO_TYPE_REPAIR;
                                                                    POObj.PONo = rr.PONo;
                                                                    POObj.DateRequested = POObj.Created = rr.POcreatedDate;
                                                                    POObj.DueDate = rr.PORequiredDate ? rr.PORequiredDate : PODueDate;
                                                                    POObj.ShipAddressBookId = 666;
                                                                    POObj.BillAddressBookId = rr.CustomerBillToId;
                                                                    POObj.ShipAddressIdentityType = 2;
                                                                    POObj.SubTotal = rr.VendorQuoteGrandTotal;
                                                                    POObj.GrandTotal = rr.VendorCost;
                                                                    POObj.Status = Constants.CONST_PO_STATUS_APPROVED;

                                                                    POObj.BaseGrandTotal = rr.BaseVendorQuoteGrandTotal;
                                                                    POObj.ExchangeRate = rr.ExchangeRate;
                                                                    POObj.BaseCurrencyCode = rr.BaseCurrencyCode;
                                                                    POObj.LocalCurrencyCode = rr.LocalCurrencyCode;


                                                                    //POObj.DueDate = PODueDate;


                                                                    var SOObj = new SOModel(rr);
                                                                    SOObj.SOType = Constants.CONST_SO_TYPE_REPAIR;
                                                                    SOObj.DateRequested = SOObj.Created = rr.SoCreatedDate;
                                                                    SOObj.DueDate = SODueDate;
                                                                    SOObj.ReferenceNo = rr.VendorRefNo;
                                                                    SOObj.SONo = rr.SONo;
                                                                    SOObj.ShipAddressBookId = rr.CustomerShipToId;
                                                                    SOObj.BillAddressBookId = rr.CustomerBillToId;
                                                                    SOObj.SubTotal = rr.CustomerQuoteGrandTotal;
                                                                    SOObj.GrandTotal = rr.CustomerQuoteGrandTotal;
                                                                    // SOObj.Status = Constants.CONST_SO_STATUS_OPEN || Constants.CONST_SO_STATUS_CLOSED ? Constants.CONST_SO_STATUS_APPROVED : 0;
                                                                    SOObj.Status = Constants.CONST_SO_STATUS_APPROVED;
                                                                    SOObj.IsConvertedToPO = rr.PONo != '' ? 1 : 0;

                                                                    SOObj.BaseGrandTotal = rr.BaseCustomerQuoteGrandTotal;
                                                                    SOObj.ExchangeRate = rr.ExchangeRate;
                                                                    SOObj.BaseCurrencyCode = rr.BaseCurrencyCode;
                                                                    SOObj.LocalCurrencyCode = rr.LocalCurrencyCode;




                                                                    SOObj.QuoteId = rr.QuoteId;

                                                                    var InvObj = new InvoiceModel(rr);
                                                                    InvObj.SOId = 0;
                                                                    InvObj.SONo = rr.SONo;
                                                                    InvObj.InvoiceNo = rr.InvoiceNo;
                                                                    InvObj.InvoiceType = Constants.CONST_INV_TYPE_REPAIR;
                                                                    InvObj.InvoiceDate = rr.InvoiceCreatedDate;
                                                                    InvObj.Created = rr.InvoiceCreatedDate;
                                                                    InvObj.DueDate = rr.InvoiceCreatedDate;
                                                                    InvObj.ShipAddressBookId = rr.CustomerShipToId;
                                                                    InvObj.BillAddressBookId = rr.CustomerBillToId;
                                                                    InvObj.SubTotal = rr.InvoiceTotal;
                                                                    InvObj.GrandTotal = rr.InvoiceTotal;
                                                                    InvObj.IsCSVProcessed = 1;

                                                                    InvObj.BaseGrandTotal = rr.BaseCustomerQuoteGrandTotal;
                                                                    InvObj.ExchangeRate = rr.ExchangeRate;
                                                                    InvObj.BaseCurrencyCode = rr.BaseCurrencyCode;
                                                                    InvObj.LocalCurrencyCode = rr.LocalCurrencyCode;

                                                                    InvObj.Status = rr.InvoiceStatus == "Approved" ? Constants.CONST_INV_STATUS_APPROVED : CONST_INV_STATUS_OPEN;


                                                                    var VendorInvoiceObj = new VendorInvoiceModel(rr);
                                                                    VendorInvoiceObj.VendorInvoiceNo = rr.VendorInvoiceNo;
                                                                    VendorInvoiceObj.VendorInvoiceType = Constants.CONST_VINV_TYPE_REPAIR;
                                                                    VendorInvoiceObj.InvoiceDate = VendorInvoiceObj.Created = rr.CompletedDate;
                                                                    VendorInvoiceObj.DueDate = rr.CompletedDate;
                                                                    VendorInvoiceObj.CustomerInvoiceNo = rr.InvoiceNo;
                                                                    VendorInvoiceObj.CustomerInvoiceId = 0;
                                                                    VendorInvoiceObj.CustomerInvoiceAmount = rr.CustomerQuoteGrandTotal;
                                                                    VendorInvoiceObj.VendorInvNo = rr.VendorInvNo;
                                                                    VendorInvoiceObj.SubTotal = rr.VendorQuoteGrandTotal;
                                                                    VendorInvoiceObj.GrandTotal = rr.VendorQuoteGrandTotal;
                                                                    VendorInvoiceObj.ReferenceNo = rr.VendorRefNo;
                                                                    VendorInvoiceObj.IsCSVProcessed = rr.VendorBillStatus == "Approved" ? 1 : 0;

                                                                    VendorInvoiceObj.BaseGrandTotal = rr.BaseVendorQuoteGrandTotal;
                                                                    VendorInvoiceObj.ExchangeRate = rr.ExchangeRate;
                                                                    VendorInvoiceObj.BaseCurrencyCode = rr.BaseCurrencyCode;
                                                                    VendorInvoiceObj.LocalCurrencyCode = rr.LocalCurrencyCode;

                                                                    VendorInvoiceObj.Status = rr.VendorBillStatus == "Approved" ? Constants.CONST_VENDOR_INV_STATUS_APPROVED : Constants.CONST_VENDOR_INV_STATUS_OPEN;

                                                                    var QuoteRejectRRStatusHistoryObj = new RRStatusHistory({
                                                                        RRId: rr.RRId,
                                                                        HistoryStatus: Constants.CONST_RRS_QUOTE_REJECTED
                                                                    });
                                                                    QuoteRejectRRStatusHistoryObj.Created = rr.RejectedDate + ' 11:00:00';

                                                                    var QuoteRejectObj = new Quotes({
                                                                        RRId: rr.RRId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_CANCELLED,
                                                                        QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_REJECTED,
                                                                        QuoteRejectedType: 2,
                                                                        RRVendorId: rr.RRVendorId,
                                                                        QuoteId: rr.QuoteId
                                                                    });

                                                                    var RRRejectObj = new RR({
                                                                        RRId: rr.RRId,
                                                                        Status: Constants.CONST_RRS_QUOTE_REJECTED,
                                                                    });
                                                                    var QuoteRejectNotificationObj = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                                        NotificationIdentityId: rr.QuoteId,
                                                                        NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                                        ShortDesc: 'Customer Quote Rejected',
                                                                        Description: 'Admin (' + global.authuser.FullName + ') Rejected the Customer Quote on ' + rr.Created
                                                                    });
                                                                    QuoteRejectNotificationObj.Created = rr.RejectedDate;


                                                                    if (boolStatus4) {
                                                                        QuotesModel.ChangeRRStatusNew(_QuoteObj, (err, data) => {
                                                                            console.log(err);
                                                                        });
                                                                    }

                                                                    async.parallel([

                                                                        function (result) {
                                                                            if (boolStatus4) {
                                                                                QuotesModel.UpdateQuotesStatus(SubmitQuoteObj, result);
                                                                            }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if ((!boolStatus2 && !boolStatus0) || boolStatus3) { VendorQuoteItem.CreateVendorQuoteItem(VendorQuoteId, rr.QuoteId, rr.VQItem, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4) { RRStatusHistory.Create(SubmitRRStatusHistoryObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4) { QuotesModel.UpdateQuoteSubmittedDate(SubmitQuoteObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },


                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { RRStatusHistory.Create(QuoteRejectRRStatusHistoryObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },

                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { Quotes.UpdateQuotesRejectStatus(QuoteRejectObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },

                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { Quotes.ChangeRRStatusNew(RRRejectObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { Quotes.RRVendorQuoteRejected(QuoteRejectObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },



                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5) { RRStatusHistory.Create(ApproveRRStatusHistoryObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5) { QuotesModel.UpdateQuoteApprovedDate(ApproveQuoteObjQuoted, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5) { NotificationModel.Create(NotificationObjForCustomerPO, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },


                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && rr.PONo != '') { PurchaseOrderModel.Create(POObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && rr.SONo != '') { SOModel.Create(SOObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { VendorInvoiceModel.Create(VendorInvoiceObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { InvoiceModel.Create(InvObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },

                                                                    ],
                                                                        function (err, results) {
                                                                            if (err) {
                                                                                console.log(err);
                                                                                return result(err, null);
                                                                            }
                                                                            else {

                                                                                POObj.POId = rr.POId = results[11].id > 0 ? results[11].id : 0;
                                                                                SOObj.SOId = rr.SOId = results[12].SOId > 0 ? results[12].SOId : 0;
                                                                                InvObj.InvoiceId = rr.InvoiceId = results[14].id > 0 ? results[14].id : 0;
                                                                                VendorInvoiceObj.VendorInvoiceId = rr.VendorInvoiceId = results[13].id > 0 ? results[13].id : 0;

                                                                                const VendorPONoObj = new RR({
                                                                                    RRId: rr.RRId,
                                                                                    VendorPONo: rr.PONo,
                                                                                    VendorPOId: rr.POId
                                                                                });
                                                                                var PONotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_PO,
                                                                                    NotificationIdentityId: rr.POId,
                                                                                    NotificationIdentityNo: rr.PONo,
                                                                                    ShortDesc: 'Vendor PO Draft Created',
                                                                                    Description: 'Vendor PO Draft created by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                });
                                                                                PONotificationObj.Created = rr.ApprovedDate;
                                                                                const srr = new RR({
                                                                                    RRId: rr.RRId, CustomerSONo: rr.SONo, CustomerSOId: rr.SOId
                                                                                });
                                                                                var SONotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                                                                                    NotificationIdentityId: rr.SOId,
                                                                                    NotificationIdentityNo: rr.SONo,
                                                                                    ShortDesc: 'Customer SO Draft Created',
                                                                                    Description: 'Customer SO Draft created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                                                                });
                                                                                SONotificationObj.Created = rr.ApprovedDate;
                                                                                const _srr = new RR({
                                                                                    RRId: rr.RRId, CustomerInvoiceNo: rr.InvoiceNo, CustomerInvoiceId: rr.InvoiceId
                                                                                });
                                                                                var InvoiceNotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
                                                                                    NotificationIdentityId: rr.InvoiceId,
                                                                                    NotificationIdentityNo: rr.InvoiceNo,
                                                                                    ShortDesc: 'Customer Invoice Draft Created',
                                                                                    Description: 'Customer Invoice Draft created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                                                                });
                                                                                InvoiceNotificationObj.Created = rr.ApprovedDate;

                                                                                const venInv = new RR({
                                                                                    RRId: rr.RRId, VendorInvoiceNo: rr.VendorInvoiceNo, VendorInvoiceId: rr.VendorInvoiceId
                                                                                });

                                                                                rr.VQItem[0].POId = rr.POId ? rr.POId : 0;
                                                                                rr.VQItem[0].PONo = rr.PONo ? rr.PONo : 0;

                                                                                var VendorInvoiceNotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_VENDOR_INVOICE,
                                                                                    NotificationIdentityId: rr.VendorInvoiceId,
                                                                                    NotificationIdentityNo: rr.VendorInvoiceNo,
                                                                                    ShortDesc: 'Vendor Bill draft created',
                                                                                    Description: 'Vendor Bill draft created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                                                                });
                                                                                VendorInvoiceNotificationObj.Created = rr.ApprovedDate;

                                                                                const CompletedRRObj = new RR({
                                                                                    RRId: rr.RRId,
                                                                                    Status: Constants.CONST_RRS_COMPLETED
                                                                                });

                                                                                var CompletedRRStatusHistoryObj = new RRStatusHistory({
                                                                                    RRId: rr.RRId,
                                                                                    HistoryStatus: Constants.CONST_RRS_COMPLETED
                                                                                });
                                                                                CompletedRRStatusHistoryObj.Created = rr.ApprovedDate + ' 11:00:00';

                                                                                async.parallel([
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5) { QuotesModel.UpdateQuotesStatus(ApproveQuoteObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5) { QuotesModel.ChangeRRStatusWithPo(rr, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },


                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.PONo != '') { PurchaseOrderItemModel.AutoCreatePurchaseOrderItem(rr.POId, rr.VQItem, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.PONo != '') { PurchaseOrderModel.ApprovePO(POObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.PONo != '') { con.query(RR.UpdateVendorPONoByImportedRRID(VendorPONoObj, POObj.DueDate, rr.LeadTime), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },



                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.SONo != '') { SOItemModel.Create(rr.SOId, rr.CustomerQuoteItem, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.SONo != '') { con.query(RR.UpdateCustomerSONoByImportedRRID(srr, SOObj.DueDate, rr.LeadTime), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },

                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.SONo != '') { SOModel.ApproveSO(SOObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },



                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { VendorInvoiceItemModel.Create(rr.VendorInvoiceId, rr.VQItemVendorBill, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    /*function (result) {
                                                                                    if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { NotificationModel.Create(VendorInvoiceNotificationObj, result); }
                                                                                    else { RR.emptyFunction(rr, result); }
                                                                                    },*/
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { con.query(RR.UpdateVendorInvoiceNoByImportedRRID(venInv, rr.LeadTime, VendorInvoiceObj.DueDate), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { con.query(VendorInvoiceItemModel.UpdateIsAddedToVendorBillByPO(rr.POId), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { VendorInvoiceModel.ApproveVendorInvoice(VendorInvoiceObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },




                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { InvoiceItemModel.Create(rr.InvoiceId, rr.CustomerQuoteItemInvoice, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { con.query(RR.UpdateCustomerInvoiceNoByImportedRRID(_srr, InvObj.DueDate, rr.LeadTime), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { con.query(InvoiceModel.UpdateSOIdByInvoiceId(rr.SOId, rr.InvoiceId), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { InvoiceModel.ApproveInvoice(InvObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },

                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7) { RRStatusHistory.Create(CompletedRRStatusHistoryObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7) { RR.ChangeRRStatus(CompletedRRObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },




                                                                                ],
                                                                                    function (err, results) {
                                                                                        if (err) {
                                                                                            console.log(err);
                                                                                            return result(err, null);
                                                                                        }
                                                                                        else {

                                                                                            /* var SOApproveNotificationObj = new NotificationModel({
                                                                                            RRId: rr.SOId,
                                                                                            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                                                                                            NotificationIdentityId: rr.SOId,
                                                                                            NotificationIdentityNo: rr.SONo,
                                                                                            ShortDesc: 'Customer SO Approved',
                                                                                            Description: 'Customer SO Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                            });
                                                                                            SOApproveNotificationObj.Created = rr.ApprovedDate;
                                                                                            
                                                                                            if (boolStatus4 && boolStatus5 && rr.SONo != '') {
                                                                                            NotificationModel.Create(SOApproveNotificationObj, (err, data1) => {
                                                                                            });
                                                                                            }
                                                                                            var POApproveNotificationObj = new NotificationModel({
                                                                                            RRId: rr.POId,
                                                                                            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_PO,
                                                                                            NotificationIdentityId: rr.POId,
                                                                                            NotificationIdentityNo: rr.PONo,
                                                                                            ShortDesc: 'Vendor PO Approved',
                                                                                            Description: 'Vendor PO Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                            });
                                                                                            POApproveNotificationObj.Created = rr.ApprovedDate;
                                                                                            if (boolStatus4 && boolStatus5 && rr.PONo != '') {
                                                                                            NotificationModel.Create(POApproveNotificationObj, (err, data1) => {
                                                                                            });
                                                                                            }
                                                                                            var VINotificationObj = new NotificationModel({
                                                                                            RRId: rr.VendorInvoiceId,
                                                                                            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_VENDOR_INVOICE,
                                                                                            NotificationIdentityId: rr.VendorInvoiceId,
                                                                                            NotificationIdentityNo: rr.VendorInvoiceNo,
                                                                                            ShortDesc: 'Vendor bill Approved',
                                                                                            Description: 'Vendor bill approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                            });
                                                                                            VINotificationObj.Created = rr.ApprovedDate;
                                                                                            if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') {
                                                                                            NotificationModel.Create(VINotificationObj, (err, data1) => {
                                                                                            });
                                                                                            }
                                                                                            var InvoiceApproveNotificationObj = new NotificationModel({
                                                                                            RRId: rr.InvoiceId,
                                                                                            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
                                                                                            NotificationIdentityId: rr.InvoiceId,
                                                                                            NotificationIdentityNo: rr.InvoiceNo,
                                                                                            ShortDesc: 'Customer Invoice Approved',
                                                                                            Description: 'Customer Invoice Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                            });
                                                                                            InvoiceApproveNotificationObj.Created = rr.ApprovedDate;
                                                                                            if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') {
                                                                                            NotificationModel.Create(InvoiceApproveNotificationObj, (err, data1) => {
                                                                                            });
                                                                                            }
                                                                                            var CompletedNotificationObj = new NotificationModel({
                                                                                            RRId: rr.RRId,
                                                                                            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                                                                            NotificationIdentityId: rr.RRId,
                                                                                            NotificationIdentityNo: rr.RRNo,
                                                                                            ShortDesc: 'RR Completed',
                                                                                            Description: 'RR Completed  by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                            });
                                                                                            CompletedNotificationObj.Created = rr.ApprovedDate;
                                                                                            if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') {
                                                                                            NotificationModel.Create(CompletedNotificationObj, (err, data1) => {
                                                                                            });
                                                                                            }
                                                                                            */
                                                                                            return result(null, rr)
                                                                                        }
                                                                                    })
                                                                            }
                                                                        });
                                                                }
                                                            });
                                                    }
                                                });
                                        }
                                    });
                            });
                        }
                    });
            }
        });
};

RRImport.ImportRR = (RRJson, result) => {

    let rr = new RRImportV2(RRJson);
    console.log("Created 1 = " + rr.Created)
    //new changes as per Brij
    rr.ShippingCost = 0;
    //rr.CustomerQuoteGrandTotal = rr.InvoiceTotal > 0 ? rr.InvoiceTotal : rr.CustomerQuoteGrandTotal;
    //rr.VendorQuoteGrandTotal = rr.VendorBillTotal > 0 ? rr.VendorBillTotal : rr.VendorQuoteGrandTotal;

    if (!rr.InvoiceTotal) {
        rr.InvoiceTotal = rr.CustomerQuoteGrandTotal;
    }
    if (!rr.VendorBillTotal) {
        rr.VendorBillTotal = rr.VendorQuoteGrandTotal;
    }
    if (!rr.InvoiceStatus) {
        rr.InvoiceStatus = "Approved";
    }




    let ManufacturerQuery = `SELECT VendorId as ManufacturerId,'-' test FROM tbl_vendors WHERE IsDeleted=0 and VendorName= '${rr.ManufacturerName}';`
    let PartCheckQuery = ` SELECT * FROM tbl_parts WHERE IsDeleted=0 and PartNo = '${rr.PartNo}' `;
    let CustomerQuery = `SELECT CustomerId,'-' test FROM tbl_customers WHERE IsDeleted=0 and CompanyName= '${rr.CompanyName}'`;
    let VendorQuery = `SELECT VendorId,'-' test FROM tbl_vendors WHERE IsDeleted=0 and VendorName= '${rr.VendorName}';`
    let RRQuery = `SELECT RRId,'-' test FROM tbl_repair_request WHERE IsDeleted=0 and RRNo= '${rr.RRNo}'; `

    if (rr.SubmittedDate) {
        var date_arr = rr.SubmittedDate.split('/');
        rr.SubmittedDate = date_arr[2] + "-" + date_arr[0] + "-" + date_arr[1];
    }
    if (rr.ApprovedDate) {
        var date_arr2 = rr.ApprovedDate.split('/');
        rr.ApprovedDate = date_arr2[2] + "-" + date_arr2[0] + "-" + date_arr2[1];
    }
    if (!rr.ApprovedDate) {
        rr.ApprovedDate = rr.SubmittedDate;
    }

    if (rr.Created) {
        var date_arr3 = rr.Created.split('/');
        rr.Created = date_arr3[2] + "-" + date_arr3[0] + "-" + date_arr3[1];
    }
    if (rr.RejectedDate) {
        var date_arr31 = rr.RejectedDate.split('/');
        rr.RejectedDate = date_arr31[2] + "-" + date_arr31[0] + "-" + date_arr31[1];

    }
    if (rr.CompletedDate) {
        var date_arr4 = rr.CompletedDate.split('/');
        rr.CompletedDate = date_arr4[2] + "-" + date_arr4[0] + "-" + date_arr4[1];
    }

    if (rr.InvoiceCreatedDate) {
        var date_arr5 = rr.InvoiceCreatedDate.split('/');
        rr.InvoiceCreatedDate = date_arr5[2] + "-" + date_arr5[0] + "-" + date_arr5[1];
    }

    if (rr.SalesOrderRequiredDate) {
        var date_arr6 = rr.SalesOrderRequiredDate.split('/');
        rr.SalesOrderRequiredDate = date_arr6[2] + "-" + date_arr6[0] + "-" + date_arr6[1];
    }
    if (!rr.CompletedDate) {
        rr.CompletedDate = rr.ApprovedDate;
    }


    console.log("rr.ApprovedDate = " + rr.ApprovedDate);
    console.log("rr.CompletedDate = " + rr.CompletedDate);

    //console.log("Created 2 = " + rr.Created)
    var boolStatus2 = false, boolStatus4 = false, boolStatus5 = false, boolStatus6 = false, boolStatus7 = false;
    if (rr.StatusName == "Completed") {
        boolStatus4 = true; boolStatus5 = true; boolStatus7 = true;
        rr.Status = Constants.CONST_RRS_COMPLETED;
    }
    else if (rr.StatusName == "Quote Rejected") {
        boolStatus4 = true; boolStatus6 = true;
        rr.Status = Constants.CONST_RRS_QUOTE_REJECTED;

    }//
    else if (rr.StatusName == "Repair in Progress") {
        boolStatus4 = true; boolStatus5 = true;
    }
    else if (rr.StatusName == "Quoted - Awaiting Customer PO") {
        boolStatus4 = true;
    }
    else if (rr.StatusName == "Awaiting Vendor Quote") {
        boolStatus2 = true;
    }
    else if (rr.StatusName == "Awaiting Vendor Selection") {

    }
    else {
        return result({ msg: "Invalid Status" }, null);
    }
    async.parallel([
        function (result) { con.query(PartCheckQuery, result); },
        function (result) { con.query(VendorQuery, result); },
        function (result) { con.query(CustomerQuery, result); },
        function (result) { con.query(ManufacturerQuery, result); },
        function (result) { con.query(MROModel.SelectSettingsInfo(), result); },
        function (result) { con.query(RRQuery, result); },
    ],
        function (err, results) {
            if (err) {
                return result(err, null);
            }
            else if (results[5][0].length > 0) {
                return result({ msg: "Already Record Exist" }, null);
            } else if (!results[1][0][0] || !results[1][0][0].VendorId) {
                return result({ msg: "Vendor not available : " + rr.VendorName }, null);


            } else if (rr.StatusName == "Awaiting Vendor Selection") {
                return result({ msg: "Awaiting Vendor Selection not processed" }, null);
            }
            else if (!results[2][0][0] || !results[2][0][0].CustomerId) {
                return result({ msg: "Customer not available : " + rr.CompanyName }, null);
            } else {
                let PartId = 0; let VendorId = 0; let CustomerId = 0; let ManufacturerId = 0;
                PartId = results[0][0][0] ? results[0][0][0].PartId : 0;
                VendorId = results[1][0][0] ? results[1][0][0].VendorId : 0;
                CustomerId = results[2][0][0] ? results[2][0][0].CustomerId : 0;
                ManufacturerId = results[3][0][0] ? results[3][0][0].ManufacturerId : 0;
                rr.TaxPercent = results[4][0][0].TaxPercent ? results[4][0][0].TaxPercent : 0;
                rr.CustomerId = CustomerId; rr.MROId = 0;

                var ObjPart = new PartsModel({
                    PartNo: rr.PartNo,
                    Description: rr.Description,
                    ManufacturerPartNo: rr.ManufacturerPartNo,
                    ManufacturerId: ManufacturerId,
                    Quantity: 1,
                    Price: rr.PartPON,
                    IsNewOrRefurbished: 2
                });

                async.parallel([
                    function (result) {
                        if (PartId == 0) { PartsModel.addNewPart(ObjPart, result); }
                        else { RR.emptyFunction(RRJson, result); }
                    },
                    function (result) { con.query(AddessBook.GetBillingAddressIdByCustomerId(CustomerId), result); },
                    function (result) { con.query(AddessBook.GetShippingAddressIdByCustomerId(CustomerId), result); },
                    function (result) { con.query(CustomerDepartmentModel.selectbyname(CustomerId, rr.Department), result); },
                ],
                    function (err, results) {
                        if (err) {
                            return result(err, null);
                        }
                        else {
                            if (PartId == 0) {
                                if (results[0].id > 0) {
                                    PartId = results[0].id;
                                }
                            }
                            if (results[1][0].length > 0) {
                                rr.CustomerBillToId = results[1][0][0].AddressId;
                            }
                            if (results[2][0].length > 0) {
                                rr.CustomerShipToId = results[2][0][0].AddressId;
                            }
                            if (results[3][0].length > 0) {
                                rr.DepartmentId = results[3][0][0].CustomerDepartmentId;
                            }

                            rr.CustomerId = CustomerId;
                            rr.VendorId = VendorId;
                            rr.PartId = PartId;
                            rr.RRDescription = rr.Description;
                            rr.IsRushRepair = rr.IsRushRepair == "Normal" ? 0 : 1;
                            rr.Shipping = rr.ShippingCost;
                            rr.LeadTime = 20;
                            rr.WarrantyPeriod = 18;
                            rr.GrandTotal = parseFloat(rr.Shipping) + parseFloat(rr.CustomerQuoteGrandTotal);
                            rr.VendorCost = parseFloat(rr.Shipping) + parseFloat(rr.VendorQuoteGrandTotal);
                            // rr.Created = rr.CompletedDate;
                            rr.IsWarrantyRecovery = rr.WarrantyRecovery == "Yes" ? 1 : 0;
                            rr.RRCompletedDate = rr.CompletedDate;


                            var arrRRParts = [];
                            var ObjRRPart = new RRParts({
                                PartId: rr.PartId,
                                PartNo: rr.PartNo,
                                CustomerPartNo1: rr.CustomerPartNo1,
                                CustomerPartNo2: rr.CustomerPartNo2,
                                Description: rr.Description,
                                ManufacturerPartNo: rr.ManufacturerPartNo,
                                Manufacturer: ManufacturerId,
                                SerialNo: rr.SerialNo,
                                Quantity: rr.Quantity,
                                Rate: 0,
                                Price: 0,
                                WarrantyPeriod: rr.WarrantyPeriod,
                                LeadTime: rr.LeadTime,
                            });



                            arrRRParts.push(ObjRRPart); rr.RRParts = arrRRParts;
                            RR.CreateRequest(rr, (err, data) => {

                                if (!data) {
                                    return result({ msg: "There is a problem in creating a Repair Request. Pelase check the details." }, null);
                                }
                                rr.RRId = data.id;
                                var RRStatusHistoryObj = new RRStatusHistory({
                                    RRId: data.id,
                                    HistoryStatus: Constants.CONST_RRS_GENERATED
                                });
                                RRStatusHistoryObj.Created = rr.Created + ' 11:00:00';
                                var RRNotificationObj = new NotificationModel({
                                    RRId: data.id,
                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                    NotificationIdentityId: data.id,
                                    NotificationIdentityNo: rr.RRNo,
                                    ShortDesc: 'RR Created',
                                    Description: 'RR Created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                });
                                RRNotificationObj.Created = rr.Created;
                                var RRSourcedStatusHistoryObj = new RRStatusHistory({
                                    RRId: rr.RRId,
                                    HistoryStatus: Constants.CONST_RRS_NEED_SOURCED
                                });
                                RRSourcedStatusHistoryObj.Created = rr.Created;

                                var RRSourcedNotificationObj = new NotificationModel({
                                    RRId: rr.RRId,
                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                    NotificationIdentityId: rr.RRId,
                                    NotificationIdentityNo: rr.RRNo,
                                    ShortDesc: 'RR Verified',
                                    Description: 'RR Verified by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                });
                                RRSourcedNotificationObj.Created = rr.Created;
                                var CustomerReferenceList = [];
                                if (rr.CustomerReference1 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference1; tempobj.ReferenceLabelName = 'Customer Reference 1';
                                    CustomerReferenceList.push(tempobj);
                                }

                                if (rr.CustomerReference2 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference2; tempobj.ReferenceLabelName = 'Customer Reference 2';
                                    CustomerReferenceList.push(tempobj);
                                }

                                if (rr.CustomerReference3 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference3; tempobj.ReferenceLabelName = 'Customer Reference 3';
                                    CustomerReferenceList.push(tempobj);
                                }

                                if (rr.CustomerReference4 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference4; tempobj.ReferenceLabelName = 'Customer Reference 4';
                                    CustomerReferenceList.push(tempobj);
                                }
                                if (rr.CustomerReference5 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference5; tempobj.ReferenceLabelName = 'Customer Reference 5';
                                    CustomerReferenceList.push(tempobj);
                                }
                                if (rr.CustomerReference6 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference6; tempobj.ReferenceLabelName = 'Customer Reference 6';
                                    CustomerReferenceList.push(tempobj);
                                }
                                rr.CustomerReferenceList = CustomerReferenceList;
                                const RRVendorsObj = new RRVendorModel({
                                    MROId: 0,
                                    RRId: rr.RRId,
                                    VendorId: rr.VendorId,
                                    TaxPercent: rr.TaxPercent,
                                    SubTotal: rr.VendorQuoteGrandTotal,
                                    GrandTotal: rr.VendorCost,
                                    VendorRefNo: rr.VendorRefNo,
                                    RouteCause: rr.RouteCause,
                                    Shipping: rr.ShippingCost,
                                    Status: Constants.CONST_VENDOR_STATUS_APPROVED,
                                    LeadTime: rr.LeadTime,
                                    WarrantyPeriod: rr.WarrantyPeriod,
                                });
                                if (boolStatus2 == true)
                                    RRVendorsObj.Status = 0;

                                const CustomerPartObj = new CustomerPartmodel({
                                    PartId: rr.PartId,
                                    CustomerId: rr.CustomerId,
                                    NewPrice: rr.PartPON,
                                    LastPricePaid: 0,
                                });

                                const NoteObj = new RepairRequestNotes({
                                    RRId: rr.RRId,
                                    IdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                    IdentityId: rr.RRId,
                                    NotesType: 1,
                                    Notes: rr.Note,

                                });
                                async.parallel([
                                    function (result) {
                                        if (rr.CustomerReferenceList.length > 0) { CustomerReference.CreateCustomerReference(rr, result); }
                                        else { RR.emptyFunction(RRStatusHistoryObj, result); }
                                    },
                                    function (result) {
                                        if (rr.hasOwnProperty('RRParts')) { RRParts.CreateRRParts(rr.RRId, rr.RRParts, result); }
                                        else { RR.emptyFunction(RRStatusHistoryObj, result); }
                                    },
                                    function (result) { RRVendorModel.CreateRRVendors(RRVendorsObj, result); },
                                    function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
                                    function (result) { NotificationModel.Create(RRNotificationObj, result); },
                                    function (result) { con.query(RR.UpdateCustomerBillShipQuery(rr), result); },
                                    function (result) { con.query(TermsModel.GetDefaultTerm(), result) },
                                    function (result) { con.query(UserModel.listbyuserquery(Constants.CONST_IDENTITY_TYPE_CUSTOMER, CustomerId), result) },
                                    function (result) { con.query(RR.UpdateImportRRNo(rr), result); },
                                    function (result) { con.query(RR.UpdatePartPONQuery(rr), result); },
                                    function (result) { RRStatusHistory.Create(RRSourcedStatusHistoryObj, result); },
                                    function (result) { NotificationModel.Create(RRSourcedNotificationObj, result); },
                                    function (result) { CustomerPartmodel.create(CustomerPartObj, result); },
                                    function (result) {
                                        if (NoteObj.Notes != '') { RepairRequestNotes.create(NoteObj, result); }
                                        else { RR.emptyFunction(rr, result); }
                                    },
                                ],
                                    function (err, results) {
                                        if (err) { return result(err, null); }
                                        else {
                                            rr.RRVendorId = results[2].RRVendorId > 0 ? results[2].RRVendorId : 0;
                                            const RRVendorPartsObj = new RRVendorPartModel({
                                                RRVendorId: rr.RRVendorId,
                                                RRId: rr.RRId,
                                                PartId: rr.PartId,
                                                VendorId: VendorId,
                                                PartNo: rr.PartNo,
                                                Description: rr.Description,
                                                Quantity: rr.Quantity,
                                                Rate: rr.VendorQuoteGrandTotal / rr.Quantity,
                                                Price: rr.VendorQuoteGrandTotal,
                                                WarrantyPeriod: rr.WarrantyPeriod,
                                                LeadTime: rr.LeadTime,
                                            });

                                            const RRObj = new RR({
                                                RRId: rr.RRId,
                                                Status: Constants.CONST_RRS_AWAIT_VQUOTE
                                            });

                                            var RRStatusHistoryObj = new RRStatusHistory({
                                                RRId: rr.RRId,
                                                HistoryStatus: Constants.CONST_RRS_AWAIT_VQUOTE
                                            });
                                            RRStatusHistoryObj.Created = rr.Created + ' 11:00:00';

                                            var NotificationObj = new NotificationModel({
                                                RRId: rr.RRId,
                                                NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                                NotificationIdentityId: rr.RRId,
                                                NotificationIdentityNo: rr.RRNo,
                                                ShortDesc: 'RR Needs To Be Sourced',
                                                Description: 'RR Needs To Be Sourced by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                            });
                                            NotificationObj.Created = rr.Created;
                                            if (results[6][0].length > 0) {
                                                rr.TermsId = results[6][0][0].TermsId;
                                            }
                                            if (results[7][0].length > 0) {
                                                rr.FirstName = results[7][0][0].FirstName;
                                                rr.LastName = results[7][0][0].LastName;
                                                rr.Email = results[7][0][0].Email;
                                            }

                                            rr.ShippingFee = rr.ShippingCost;
                                            rr.IdentityType = Constants.CONST_IDENTITY_TYPE_CUSTOMER; rr.IdentityId = CustomerId;

                                            var VendorQuoteobj = {}; var Quoteobj = {};
                                            Quoteobj = new QuotesModel(rr);
                                            Quoteobj.Status = 3;
                                            Quoteobj.TotalValue = rr.CustomerQuoteGrandTotal;
                                            Quoteobj.QuoteType = Constants.CONST_QUOTE_TYPE_REPAIR;
                                            VendorQuoteobj = new VendorQuote(rr);
                                            VendorQuoteobj.Status = 2;
                                            VendorQuoteobj.Shipping = rr.ShippingCost;
                                            VendorQuoteobj.SubTotal = rr.VendorQuoteGrandTotal;
                                            VendorQuoteobj.GrandTotal = rr.VendorCost;
                                            async.parallel([
                                                function (result) { RR.UpdateVendorOfRequestByRRId(rr, result); },
                                                function (result) { RRVendorPartModel.CreateRRVendorParts(RRVendorPartsObj, result); },
                                                function (result) { RR.ChangeRRStatus(RRObj, result); },
                                                function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
                                                function (result) { NotificationModel.Create(NotificationObj, result); },
                                                function (result) {
                                                    if (!boolStatus2) { QuotesModel.CreateQuotes(Quoteobj, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },
                                            ],
                                                function (err, results) {
                                                    if (err) { return result(err, null); }
                                                    else {

                                                        rr.QuoteId = results[5].id > 0 ? results[5].id : 0;
                                                        VendorQuoteobj.QuoteId = rr.QuoteId;


                                                        var CustomerLineItem = {}; var CustomerQuoteItem = [];
                                                        CustomerLineItem.PartId = rr.PartId;
                                                        CustomerLineItem.PartNo = rr.PartNo;
                                                        CustomerLineItem.PartDescription = rr.Description;
                                                        CustomerLineItem.Quantity = rr.Quantity;
                                                        CustomerLineItem.LeadTime = rr.LeadTime;
                                                        CustomerLineItem.PartNo = rr.PartNo;
                                                        CustomerLineItem.Rate = rr.CustomerQuoteGrandTotal / rr.Quantity;
                                                        CustomerLineItem.Price = CustomerLineItem.Quantity * CustomerLineItem.Rate;
                                                        CustomerLineItem.VendorId = rr.VendorId;
                                                        CustomerLineItem.RRId = rr.RRId;
                                                        CustomerLineItem.Description = rr.Description;
                                                        CustomerLineItem.VendorUnitPrice = rr.VendorQuoteGrandTotal;
                                                        CustomerLineItem.SerialNo = rr.SerialNo;
                                                        CustomerLineItem.WarrantyPeriod = rr.WarrantyPeriod;
                                                        CustomerQuoteItem.push(CustomerLineItem); rr.CustomerQuoteItem = CustomerQuoteItem;

                                                        //for invocie  
                                                        var CustomerLineItemInvoice = {}; var CustomerQuoteItemInvoice = [];
                                                        CustomerLineItemInvoice.PartId = rr.PartId;
                                                        CustomerLineItemInvoice.PartNo = rr.PartNo;
                                                        CustomerLineItemInvoice.PartDescription = rr.Description;
                                                        CustomerLineItemInvoice.Quantity = rr.Quantity;
                                                        CustomerLineItemInvoice.LeadTime = rr.LeadTime;
                                                        CustomerLineItemInvoice.PartNo = rr.PartNo;
                                                        CustomerLineItemInvoice.Rate = rr.InvoiceTotal / rr.Quantity;
                                                        CustomerLineItemInvoice.Price = CustomerLineItemInvoice.Quantity * CustomerLineItemInvoice.Rate;
                                                        CustomerLineItemInvoice.VendorId = rr.VendorId;
                                                        CustomerLineItemInvoice.RRId = rr.RRId;
                                                        CustomerLineItemInvoice.Description = rr.Description;
                                                        CustomerLineItemInvoice.VendorUnitPrice = rr.VendorQuoteGrandTotal;
                                                        CustomerLineItemInvoice.SerialNo = rr.SerialNo;
                                                        CustomerLineItemInvoice.WarrantyPeriod = rr.WarrantyPeriod;
                                                        CustomerQuoteItemInvoice.push(CustomerLineItemInvoice); rr.CustomerQuoteItemInvoice = CustomerQuoteItemInvoice;



                                                        var VLineItem = {}; var VQItem = [];
                                                        VLineItem.PartId = rr.PartId;
                                                        VLineItem.PartNo = rr.PartNo;
                                                        VLineItem.PartDescription = rr.Description;
                                                        VLineItem.Quantity = rr.Quantity;
                                                        VLineItem.LeadTime = rr.LeadTime;
                                                        VLineItem.PartNo = rr.PartNo;
                                                        VLineItem.Rate = rr.VendorQuoteGrandTotal / rr.Quantity;
                                                        VLineItem.Price = VLineItem.Quantity * VLineItem.Rate;
                                                        VLineItem.VendorId = rr.VendorId;
                                                        VLineItem.RRId = rr.RRId;
                                                        VLineItem.Description = rr.Description;
                                                        VLineItem.SerialNo = rr.SerialNo;
                                                        VLineItem.WarrantyPeriod = rr.WarrantyPeriod;
                                                        VQItem.push(VLineItem); rr.VQItem = VQItem;


                                                        //for vendor bill
                                                        var VQItemVendorBill = [];
                                                        var VLineItemVB = {}; var VQItemVendorBill = [];
                                                        VLineItemVB.PartId = rr.PartId;
                                                        VLineItemVB.PartNo = rr.PartNo;
                                                        VLineItemVB.PartDescription = rr.Description;
                                                        VLineItemVB.Quantity = rr.Quantity;
                                                        VLineItemVB.LeadTime = rr.LeadTime;
                                                        VLineItemVB.PartNo = rr.PartNo;
                                                        VLineItemVB.Rate = rr.VendorBillTotal / rr.Quantity;
                                                        VLineItemVB.Price = VLineItemVB.Quantity * VLineItemVB.Rate;
                                                        VLineItemVB.VendorId = rr.VendorId;
                                                        VLineItemVB.RRId = rr.RRId;
                                                        VLineItemVB.Description = rr.Description;
                                                        VLineItemVB.SerialNo = rr.SerialNo;
                                                        VLineItemVB.WarrantyPeriod = rr.WarrantyPeriod;
                                                        VQItemVendorBill.push(VLineItemVB); rr.VQItemVendorBill = VQItemVendorBill;



                                                        var NotificationObj = new NotificationModel({
                                                            RRId: rr.RRId,
                                                            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                            NotificationIdentityId: rr.QuoteId,
                                                            NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                            ShortDesc: 'Customer Quote Created',
                                                            Description: 'Customer Quote Created by Admin (' + global.authuser.FullName + ') on ' + rr.SubmittedDate
                                                        });
                                                        NotificationObj.Created = rr.Created;

                                                        async.parallel([
                                                            function (result) {
                                                                if (!boolStatus2) { QuotesItemModel.CreateQuoteItem(rr.QuoteId, rr.CustomerQuoteItem, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (!boolStatus2) { QuotesModel.UpdateQuotesCodeByQuoteId(rr, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (!boolStatus2) { con.query(Quotes.UpdateQuoteDate(rr.SubmittedDate, rr.QuoteId), result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (!boolStatus2) { VendorQuote.CreateVendorQuote(VendorQuoteobj, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (!boolStatus2) { NotificationModel.Create(NotificationObj, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                        ],
                                                            function (err, results) {
                                                                if (err)
                                                                    return result(err, null);
                                                                else {

                                                                    var SubmitRRStatusHistoryObj = new RRStatusHistory({
                                                                        RRId: rr.RRId,
                                                                        HistoryStatus: Constants.CONST_RRS_QUOTE_SUBMITTED
                                                                    });
                                                                    SubmitRRStatusHistoryObj.Created = rr.Created + ' 11:00:00';

                                                                    var _QuoteObj = {};
                                                                    _QuoteObj.RRId = rr.RRId;
                                                                    _QuoteObj.Status = Constants.CONST_RRS_QUOTE_SUBMITTED;

                                                                    var SubmitQuoteObj = new QuotesModel({
                                                                        RRId: rr.RRId,
                                                                        QuoteId: rr.QuoteId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_SUBMITTED,
                                                                        QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_SUBMITTED,
                                                                        SubmittedDate: rr.SubmittedDate,
                                                                    });

                                                                    var SubmitNotificationObj = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                                        NotificationIdentityId: rr.QuoteId,
                                                                        NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                                        ShortDesc: 'Customer Quote Submitted',
                                                                        Description: 'Customer Quote Submitted to Customer  by Admin (' + global.authuser.FullName + ') on ' + rr.SubmittedDate
                                                                    });
                                                                    SubmitNotificationObj.Created = rr.SubmittedDate;
                                                                    var VendorQuoteId = results[3].id > 0 ? results[3].id : 0;
                                                                    var ApproveQuoteObj = new QuotesModel({
                                                                        RRId: rr.RRId,
                                                                        QuoteId: rr.QuoteId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_APPROVED,
                                                                        QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_ACCEPTED
                                                                    });
                                                                    var ApproveQuoteObjQuoted = new QuotesModel({
                                                                        RRId: rr.RRId,
                                                                        QuoteId: rr.QuoteId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_QUOTED,
                                                                        ApprovedDate: rr.ApprovedDate,
                                                                    });

                                                                    var ApproveRRStatusHistoryObj = new RRStatusHistory({
                                                                        RRId: rr.RRId,
                                                                        HistoryStatus: Constants.CONST_RRS_IN_PROGRESS
                                                                    });
                                                                    ApproveRRStatusHistoryObj.Created = rr.Created + ' 11:00:00';

                                                                    var ApproveNotificationObj = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                                        NotificationIdentityId: rr.QuoteId,
                                                                        NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                                        ShortDesc: 'Customer Quote Approved',
                                                                        Description: 'Customer Quote Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                    });
                                                                    ApproveNotificationObj.Created = rr.ApprovedDate;
                                                                    var NotificationObjForCustomerPO = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                                                        NotificationIdentityId: rr.RRId,
                                                                        NotificationIdentityNo: 'CustomerPO' + rr.RRId,
                                                                        ShortDesc: 'Customer PO Received',
                                                                        Description: 'Customer PO updated by  Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                    });
                                                                    NotificationObjForCustomerPO.Created = rr.ApprovedDate;
                                                                    rr.Status = Constants.CONST_RRS_IN_PROGRESS;

                                                                    var POObj = new PurchaseOrderModel(rr);
                                                                    POObj.POType = Constants.CONST_PO_TYPE_REPAIR;
                                                                    POObj.PONo = rr.PONo;
                                                                    POObj.DateRequested = POObj.Created = rr.ApprovedDate;
                                                                    POObj.DueDate = rr.SalesOrderRequiredDate;
                                                                    POObj.ShipAddressBookId = 666;
                                                                    POObj.BillAddressBookId = rr.CustomerBillToId;
                                                                    POObj.ShipAddressIdentityType = 2;
                                                                    POObj.SubTotal = rr.VendorQuoteGrandTotal;
                                                                    POObj.GrandTotal = rr.VendorCost;
                                                                    POObj.Status = Constants.CONST_PO_STATUS_APPROVED;

                                                                    var SOObj = new SOModel(rr);
                                                                    SOObj.SOType = Constants.CONST_SO_TYPE_REPAIR;
                                                                    SOObj.DateRequested = SOObj.Created = rr.ApprovedDate;
                                                                    SOObj.DueDate = rr.SalesOrderRequiredDate;
                                                                    SOObj.ReferenceNo = rr.VendorRefNo;
                                                                    SOObj.SONo = rr.SONo;
                                                                    SOObj.ShipAddressBookId = rr.CustomerShipToId;
                                                                    SOObj.BillAddressBookId = rr.CustomerBillToId;
                                                                    SOObj.SubTotal = rr.CustomerQuoteGrandTotal;
                                                                    SOObj.GrandTotal = rr.CustomerQuoteGrandTotal;
                                                                    SOObj.Status = Constants.CONST_SO_STATUS_APPROVED;
                                                                    SOObj.IsConvertedToPO = rr.PONo != '' ? 1 : 0;
                                                                    //  SOObj.GrandTotal = parseFloat(rr.Shipping) + parseFloat(rr.CustomerQuoteGrandTotal);
                                                                    SOObj.QuoteId = rr.QuoteId;

                                                                    var InvObj = new InvoiceModel(rr);
                                                                    InvObj.SOId = 0;
                                                                    InvObj.SONo = rr.SONo;
                                                                    InvObj.InvoiceNo = rr.InvoiceNo;
                                                                    InvObj.InvoiceType = Constants.CONST_INV_TYPE_REPAIR;
                                                                    InvObj.InvoiceDate = rr.InvoiceCreatedDate;
                                                                    InvObj.Created = rr.InvoiceCreatedDate;
                                                                    InvObj.DueDate = rr.InvoiceCreatedDate;
                                                                    InvObj.ShipAddressBookId = rr.CustomerShipToId;
                                                                    InvObj.BillAddressBookId = rr.CustomerBillToId;
                                                                    InvObj.SubTotal = rr.InvoiceTotal;
                                                                    InvObj.GrandTotal = rr.InvoiceTotal;
                                                                    InvObj.IsCSVProcessed = 1;
                                                                    //  InvObj.GrandTotal = parseFloat(rr.Shipping) + parseFloat(rr.CustomerQuoteGrandTotal);
                                                                    InvObj.Status = rr.InvoiceStatus == "Approved" ? Constants.CONST_INV_STATUS_APPROVED : CONST_INV_STATUS_OPEN;


                                                                    var VendorInvoiceObj = new VendorInvoiceModel(rr);
                                                                    VendorInvoiceObj.VendorInvoiceNo = rr.VendorInvoiceNo;
                                                                    VendorInvoiceObj.VendorInvoiceType = Constants.CONST_VINV_TYPE_REPAIR;
                                                                    VendorInvoiceObj.InvoiceDate = VendorInvoiceObj.Created = rr.CompletedDate;
                                                                    VendorInvoiceObj.DueDate = rr.CompletedDate;
                                                                    VendorInvoiceObj.CustomerInvoiceNo = rr.InvoiceNo;
                                                                    VendorInvoiceObj.CustomerInvoiceId = 0;
                                                                    VendorInvoiceObj.CustomerInvoiceAmount = rr.GrandTotal;
                                                                    VendorInvoiceObj.VendorInvNo = rr.VendorInvNo;
                                                                    // VendorInvoiceObj.SubTotal = rr.VendorQuoteGrandTotal;
                                                                    // VendorInvoiceObj.GrandTotal = rr.VendorCost;
                                                                    VendorInvoiceObj.SubTotal = rr.VendorBillTotal;
                                                                    VendorInvoiceObj.GrandTotal = rr.VendorBillTotal;
                                                                    VendorInvoiceObj.ReferenceNo = rr.VendorRefNo;
                                                                    VendorInvoiceObj.IsCSVProcessed = rr.VendorBillStatus == "Approved" ? 1 : 0;

                                                                    VendorInvoiceObj.Status = rr.VendorBillStatus == "Approved" ? Constants.CONST_VENDOR_INV_STATUS_APPROVED : Constants.CONST_VENDOR_INV_STATUS_OPEN;

                                                                    var QuoteRejectRRStatusHistoryObj = new RRStatusHistory({
                                                                        RRId: rr.RRId,
                                                                        HistoryStatus: Constants.CONST_RRS_QUOTE_REJECTED
                                                                    });
                                                                    QuoteRejectRRStatusHistoryObj.Created = rr.RejectedDate;

                                                                    var QuoteRejectObj = new Quotes({
                                                                        RRId: rr.RRId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_CANCELLED,
                                                                        QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_REJECTED,
                                                                        QuoteRejectedType: 2,
                                                                        RRVendorId: rr.RRVendorId,
                                                                        QuoteId: rr.QuoteId
                                                                    });

                                                                    var RRRejectObj = new RR({
                                                                        RRId: rr.RRId,
                                                                        Status: Constants.CONST_RRS_QUOTE_REJECTED,
                                                                    });
                                                                    var QuoteRejectNotificationObj = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                                        NotificationIdentityId: rr.QuoteId,
                                                                        NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                                        ShortDesc: 'Customer Quote Rejected',
                                                                        Description: 'Admin (' + global.authuser.FullName + ') Rejected the Customer Quote on ' + rr.Created
                                                                    });
                                                                    QuoteRejectNotificationObj.Created = rr.RejectedDate;


                                                                    if (boolStatus4) {
                                                                        QuotesModel.ChangeRRStatusNew(_QuoteObj, (err, data) => {
                                                                            console.log(err);
                                                                        });
                                                                    }

                                                                    async.parallel([

                                                                        function (result) {
                                                                            if (boolStatus4) { QuotesModel.UpdateQuotesStatus(SubmitQuoteObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (!boolStatus2) { VendorQuoteItem.CreateVendorQuoteItem(VendorQuoteId, rr.QuoteId, rr.VQItem, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4) { RRStatusHistory.Create(SubmitRRStatusHistoryObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4) { QuotesModel.UpdateQuoteSubmittedDate(SubmitQuoteObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },


                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { RRStatusHistory.Create(QuoteRejectRRStatusHistoryObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },

                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { Quotes.UpdateQuotesRejectStatus(QuoteRejectObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },

                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { Quotes.ChangeRRStatusNew(RRRejectObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { Quotes.RRVendorQuoteRejected(QuoteRejectObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },



                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5) { RRStatusHistory.Create(ApproveRRStatusHistoryObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5) { QuotesModel.UpdateQuoteApprovedDate(ApproveQuoteObjQuoted, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5) { NotificationModel.Create(NotificationObjForCustomerPO, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },


                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && rr.PONo != '') { PurchaseOrderModel.Create(POObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && rr.SONo != '') { SOModel.Create(SOObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { VendorInvoiceModel.Create(VendorInvoiceObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { InvoiceModel.Create(InvObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },

                                                                    ],
                                                                        function (err, results) {
                                                                            if (err) {
                                                                                return result(err, null);
                                                                            }
                                                                            else {

                                                                                POObj.POId = rr.POId = results[11].id > 0 ? results[11].id : 0;
                                                                                SOObj.SOId = rr.SOId = results[12].SOId > 0 ? results[12].SOId : 0;
                                                                                InvObj.InvoiceId = rr.InvoiceId = results[14].id > 0 ? results[14].id : 0;
                                                                                VendorInvoiceObj.VendorInvoiceId = rr.VendorInvoiceId = results[13].id > 0 ? results[13].id : 0;

                                                                                const VendorPONoObj = new RR({
                                                                                    RRId: rr.RRId,
                                                                                    VendorPONo: rr.PONo,
                                                                                    VendorPOId: rr.POId
                                                                                });
                                                                                var PONotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_PO,
                                                                                    NotificationIdentityId: rr.POId,
                                                                                    NotificationIdentityNo: rr.PONo,
                                                                                    ShortDesc: 'Vendor PO Draft Created',
                                                                                    Description: 'Vendor PO Draft created by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                });
                                                                                PONotificationObj.Created = rr.ApprovedDate;
                                                                                const srr = new RR({
                                                                                    RRId: rr.RRId, CustomerSONo: rr.SONo, CustomerSOId: rr.SOId
                                                                                });
                                                                                var SONotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                                                                                    NotificationIdentityId: rr.SOId,
                                                                                    NotificationIdentityNo: rr.SONo,
                                                                                    ShortDesc: 'Customer SO Draft Created',
                                                                                    Description: 'Customer SO Draft created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                                                                });
                                                                                SONotificationObj.Created = rr.ApprovedDate;
                                                                                const _srr = new RR({
                                                                                    RRId: rr.RRId, CustomerInvoiceNo: rr.InvoiceNo, CustomerInvoiceId: rr.InvoiceId
                                                                                });
                                                                                var InvoiceNotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
                                                                                    NotificationIdentityId: rr.InvoiceId,
                                                                                    NotificationIdentityNo: rr.InvoiceNo,
                                                                                    ShortDesc: 'Customer Invoice Draft Created',
                                                                                    Description: 'Customer Invoice Draft created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                                                                });
                                                                                InvoiceNotificationObj.Created = rr.ApprovedDate;

                                                                                const venInv = new RR({
                                                                                    RRId: rr.RRId, VendorInvoiceNo: rr.VendorInvoiceNo, VendorInvoiceId: rr.VendorInvoiceId
                                                                                });

                                                                                rr.VQItem[0].POId = rr.POId ? rr.POId : 0;
                                                                                rr.VQItem[0].PONo = rr.PONo ? rr.PONo : 0;

                                                                                var VendorInvoiceNotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_VENDOR_INVOICE,
                                                                                    NotificationIdentityId: rr.VendorInvoiceId,
                                                                                    NotificationIdentityNo: rr.VendorInvoiceNo,
                                                                                    ShortDesc: 'Vendor Bill draft created',
                                                                                    Description: 'Vendor Bill draft created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                                                                });
                                                                                VendorInvoiceNotificationObj.Created = rr.ApprovedDate;

                                                                                const CompletedRRObj = new RR({
                                                                                    RRId: rr.RRId,
                                                                                    Status: Constants.CONST_RRS_COMPLETED
                                                                                });

                                                                                var CompletedRRStatusHistoryObj = new RRStatusHistory({
                                                                                    RRId: rr.RRId,
                                                                                    HistoryStatus: Constants.CONST_RRS_COMPLETED
                                                                                });
                                                                                CompletedRRStatusHistoryObj.Created = rr.ApprovedDate;

                                                                                async.parallel([
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5) { QuotesModel.UpdateQuotesStatus(ApproveQuoteObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5) { QuotesModel.ChangeRRStatusWithPo(rr, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },


                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.PONo != '') { PurchaseOrderItemModel.AutoCreatePurchaseOrderItem(rr.POId, rr.VQItem, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.PONo != '') { PurchaseOrderModel.ApprovePO(POObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.PONo != '') { con.query(RR.UpdateVendorPONoByImportedRRID(VendorPONoObj, POObj.DueDate, rr.LeadTime), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },



                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.SONo != '') { SOItemModel.Create(rr.SOId, rr.CustomerQuoteItem, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.SONo != '') { con.query(RR.UpdateCustomerSONoByImportedRRID(srr, SOObj.DueDate, rr.LeadTime), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },

                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.SONo != '') { SOModel.ApproveSO(SOObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },



                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { VendorInvoiceItemModel.Create(rr.VendorInvoiceId, rr.VQItemVendorBill, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    /*function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { NotificationModel.Create(VendorInvoiceNotificationObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },*/
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { con.query(RR.UpdateVendorInvoiceNoByImportedRRID(venInv, rr.LeadTime, VendorInvoiceObj.DueDate), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { con.query(VendorInvoiceItemModel.UpdateIsAddedToVendorBillByPO(rr.POId), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { VendorInvoiceModel.ApproveVendorInvoice(VendorInvoiceObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },




                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { InvoiceItemModel.Create(rr.InvoiceId, rr.CustomerQuoteItemInvoice, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { con.query(RR.UpdateCustomerInvoiceNoByImportedRRID(_srr, InvObj.DueDate, rr.LeadTime), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { con.query(InvoiceModel.UpdateSOIdByInvoiceId(rr.SOId, rr.InvoiceId), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { InvoiceModel.ApproveInvoice(InvObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },

                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7) { RRStatusHistory.Create(CompletedRRStatusHistoryObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7) { RR.ChangeRRStatus(CompletedRRObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },




                                                                                ],
                                                                                    function (err, results) {
                                                                                        if (err) {
                                                                                            return result(err, null);
                                                                                        }
                                                                                        else {

                                                                                            /* var SOApproveNotificationObj = new NotificationModel({
                                                                                                 RRId: rr.SOId,
                                                                                                 NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                                                                                                 NotificationIdentityId: rr.SOId,
                                                                                                 NotificationIdentityNo: rr.SONo,
                                                                                                 ShortDesc: 'Customer SO Approved',
                                                                                                 Description: 'Customer SO Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                             });
                                                                                             SOApproveNotificationObj.Created = rr.ApprovedDate;
 
                                                                                             if (boolStatus4 && boolStatus5 && rr.SONo != '') {
                                                                                                 NotificationModel.Create(SOApproveNotificationObj, (err, data1) => {
                                                                                                 });
                                                                                             }
                                                                                             var POApproveNotificationObj = new NotificationModel({
                                                                                                 RRId: rr.POId,
                                                                                                 NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_PO,
                                                                                                 NotificationIdentityId: rr.POId,
                                                                                                 NotificationIdentityNo: rr.PONo,
                                                                                                 ShortDesc: 'Vendor PO Approved',
                                                                                                 Description: 'Vendor PO Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                             });
                                                                                             POApproveNotificationObj.Created = rr.ApprovedDate;
                                                                                             if (boolStatus4 && boolStatus5 && rr.PONo != '') {
                                                                                                 NotificationModel.Create(POApproveNotificationObj, (err, data1) => {
                                                                                                 });
                                                                                             }
                                                                                             var VINotificationObj = new NotificationModel({
                                                                                                 RRId: rr.VendorInvoiceId,
                                                                                                 NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_VENDOR_INVOICE,
                                                                                                 NotificationIdentityId: rr.VendorInvoiceId,
                                                                                                 NotificationIdentityNo: rr.VendorInvoiceNo,
                                                                                                 ShortDesc: 'Vendor bill Approved',
                                                                                                 Description: 'Vendor bill approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                             });
                                                                                             VINotificationObj.Created = rr.ApprovedDate;
                                                                                             if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') {
                                                                                                 NotificationModel.Create(VINotificationObj, (err, data1) => {
                                                                                                 });
                                                                                             }
                                                                                             var InvoiceApproveNotificationObj = new NotificationModel({
                                                                                                 RRId: rr.InvoiceId,
                                                                                                 NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
                                                                                                 NotificationIdentityId: rr.InvoiceId,
                                                                                                 NotificationIdentityNo: rr.InvoiceNo,
                                                                                                 ShortDesc: 'Customer Invoice Approved',
                                                                                                 Description: 'Customer Invoice Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                             });
                                                                                             InvoiceApproveNotificationObj.Created = rr.ApprovedDate;
                                                                                             if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') {
                                                                                                 NotificationModel.Create(InvoiceApproveNotificationObj, (err, data1) => {
                                                                                                 });
                                                                                             }
                                                                                             var CompletedNotificationObj = new NotificationModel({
                                                                                                 RRId: rr.RRId,
                                                                                                 NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                                                                                 NotificationIdentityId: rr.RRId,
                                                                                                 NotificationIdentityNo: rr.RRNo,
                                                                                                 ShortDesc: 'RR Completed',
                                                                                                 Description: 'RR Completed  by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                             });
                                                                                             CompletedNotificationObj.Created = rr.ApprovedDate;
                                                                                             if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') {
                                                                                                 NotificationModel.Create(CompletedNotificationObj, (err, data1) => {
                                                                                                 });
                                                                                             }
                                                                                             */
                                                                                            return result(null, rr)
                                                                                        }
                                                                                    })
                                                                            }
                                                                        });
                                                                }
                                                            });
                                                    }
                                                });
                                        }
                                    });
                            });
                        }
                    });
            }
        });
};


RRImport.ImportNonRR = (RRJson, result) => {

    let rr = new NonRRImport(RRJson);

    if (rr.InvoiceNo == "Not Created") {
        rr.InvoiceNo = '';
    }
    if (rr.InvoiceTotal == "Not Created") {
        rr.InvoiceTotal = 0;
    }
    if (rr.InvoiceCreatedDate == "Not Created") {
        rr.InvoiceCreatedDate = '';
    }
    if (rr.VendorInvoiceNo == "Not Created") {
        rr.VendorInvoiceNo = '';
    }

    if (rr.VendorBillCreatedDate == "Not Created") {
        rr.VendorBillCreatedDate = '';
    }
    if (rr.VendorBillTotal == "Not Created") {
        rr.VendorBillTotal = 0;
    }

    if (!rr.POTotal) {
        rr.POTotal = rr.VendorBillTotal;
    }

    var boolStatus1 = false, boolStatus2 = false, boolStatus3 = false, boolStatus4 = false, boolStatus5 = false;
    if (rr.QuoteNo) {
        boolStatus1 = true;
    }
    if (rr.SONo) {
        boolStatus2 = true;
    }
    if (rr.InvoiceNo) {
        boolStatus3 = true;
    }
    if (rr.PONo) {
        boolStatus4 = true;
    }
    if (rr.VendorInvoiceNo) {
        boolStatus5 = true;
    }

    if (rr.SOCreatedDate) {
        var date_arr = rr.SOCreatedDate.split('/');
        rr.SOCreatedDate = date_arr[2] + "-" + date_arr[0] + "-" + date_arr[1];
    }
    if (rr.POCreatedDate) {
        var date_arr2 = rr.POCreatedDate.split('/');
        rr.POCreatedDate = date_arr2[2] + "-" + date_arr2[0] + "-" + date_arr2[1];
    }

    rr.Created = rr.SOCreatedDate;

    if (rr.VendorBillCreatedDate) {
        var date_arr31 = rr.VendorBillCreatedDate.split('/');
        rr.VendorBillCreatedDate = date_arr31[2] + "-" + date_arr31[0] + "-" + date_arr31[1];
    }
    if (rr.InvoiceCreatedDate) {
        var date_arr1 = rr.InvoiceCreatedDate.split('/');
        rr.InvoiceCreatedDate = date_arr1[2] + "-" + date_arr1[0] + "-" + date_arr1[1];
    }

    let PartCheckQuery = ` SELECT * FROM tbl_parts WHERE IsDeleted=0 and PartNo = '${rr.PartNo}' `;
    let CustomerQuery = `SELECT FirstName,LastName,Email,CustomerId,'-' test FROM tbl_customers WHERE IsDeleted=0 and CompanyName= '${rr.CompanyName}'`;
    let VendorQuery = `SELECT VendorId,'-' test FROM tbl_vendors WHERE IsDeleted=0 and VendorName= '${rr.VendorName}';`
    let QuoteQuery = `SELECT QuoteId,'-' test FROM tbl_quotes WHERE IsDeleted=0 and QuoteNo= '${rr.QuoteNo}'; `

    async.parallel([
        function (result) { con.query(PartCheckQuery, result); },
        function (result) { con.query(VendorQuery, result); },
        function (result) { con.query(CustomerQuery, result); },
        function (result) { con.query(MROModel.SelectSettingsInfo(), result); },
        function (result) { con.query(QuoteQuery, result); },
    ],
        function (err, results) {
            if (err) {
                return result(err, null);
            }
            else if (results[4][0].length > 0) {
                return result({ msg: "Already Record Exist" }, null);
            } else if (!results[1][0][0] || !results[1][0][0].VendorId) {
                return result({ msg: "Vendor not available : " + rr.VendorName }, null);
            } else if (!results[2][0][0] || !results[2][0][0].CustomerId) {
                return result({ msg: "Customer not available : " + rr.CompanyName }, null);
            } else {
                let PartId = 0; let VendorId = 0; let CustomerId = 0; let ManufacturerId = 0;
                PartId = results[0][0][0] ? results[0][0][0].PartId : 0;
                VendorId = results[1][0][0] ? results[1][0][0].VendorId : 0;
                CustomerId = results[2][0][0] ? results[2][0][0].CustomerId : 0;
                rr.TaxPercent = results[3][0][0].TaxPercent ? results[3][0][0].TaxPercent : 0;
                rr.CustomerId = CustomerId;
                rr.MROId = 0;
                rr.RRId = 0;
                rr.TermsId = 4;
                var ObjPart = new PartsModel({
                    PartNo: rr.PartNo,
                    Description: '',
                    ManufacturerPartNo: '',
                    ManufacturerId: 0,
                    Quantity: 1,
                    Price: 0,
                    IsNewOrRefurbished: 1
                });

                async.parallel([
                    function (result) {
                        if (PartId == 0) { PartsModel.addNewPart(ObjPart, result); } else { RR.emptyFunction(RRJson, result); }
                    },
                    function (result) { con.query(AddessBook.GetBillingAddressIdByCustomerId(CustomerId), result); },
                    function (result) { con.query(AddessBook.GetShippingAddressIdByCustomerId(CustomerId), result); }
                ],
                    function (err, results) {
                        if (err) {
                            return result(err, null);
                        }
                        else {
                            if (PartId == 0) {
                                if (results[0].id > 0) {
                                    PartId = results[0].id;
                                }
                            }
                            if (results[1][0].length > 0) {
                                rr.CustomerBillToId = results[1][0][0].AddressId;
                            }
                            if (results[2][0].length > 0) {
                                rr.CustomerShipToId = results[2][0][0].AddressId;
                            }


                            rr.CustomerId = CustomerId;
                            rr.VendorId = VendorId;
                            rr.PartId = PartId;
                            rr.Shipping = 0;
                            rr.LeadTime = 20;
                            rr.WarrantyPeriod = 18;
                            rr.GrandTotal = parseFloat(rr.Shipping) + parseFloat(rr.SOTotal);
                            rr.VendorCost = parseFloat(rr.Shipping) + parseFloat(rr.POTotal);


                            var VendorQuoteobj = {}; var Quoteobj = {};
                            Quoteobj = new QuotesModel(rr);
                            Quoteobj.Status = rr.Status == "Approved" ? Constants.CONST_QUOTE_STATUS_APPROVED : Constants.CONST_QUOTE_STATUS_OPEN;
                            Quoteobj.QuoteNo = rr.QuoteNo;
                            Quoteobj.SubmittedDate = rr.Created;
                            Quoteobj.ApprovedDate = rr.Created;
                            Quoteobj.IdentityId = Quoteobj.CustomerId = rr.CustomerId;
                            Quoteobj.TotalValue = rr.SOTotal;
                            Quoteobj.QuoteCustomerStatus = rr.Status == "Approved" ? Constants.CONST_CUSTOMER_QUOTE_ACCEPTED : Constants.CONST_CUSTOMER_QUOTE_SUBMITTED;
                            Quoteobj.MROId = 0;
                            Quoteobj.QuoteType = Constants.CONST_QUOTE_TYPE_REGULAR;
                            Quoteobj.FirstName = results[2][0][0].FirstName;
                            Quoteobj.LastName = results[2][0][0].LastName;
                            Quoteobj.Email = results[2][0][0].Email;

                            results[2][0][0].CustomerId

                            var CustomerLineItem = {}; var CustomerQuoteItem = [];
                            CustomerLineItem.PartId = rr.PartId;
                            CustomerLineItem.PartNo = rr.PartNo;
                            CustomerLineItem.PartDescription = '';
                            CustomerLineItem.Quantity = rr.Quantity;
                            CustomerLineItem.LeadTime = rr.LeadTime;
                            CustomerLineItem.PartNo = rr.PartNo;
                            CustomerLineItem.Rate = rr.SOTotal / rr.Quantity;
                            CustomerLineItem.Price = CustomerLineItem.Quantity * CustomerLineItem.Rate;
                            CustomerLineItem.VendorId = rr.VendorId;
                            CustomerLineItem.RRId = 0;
                            CustomerLineItem.Description = '';
                            CustomerLineItem.VendorUnitPrice = rr.POTotal / rr.Quantity;
                            CustomerLineItem.SerialNo = '';
                            CustomerLineItem.WarrantyPeriod = rr.WarrantyPeriod;
                            CustomerQuoteItem.push(CustomerLineItem); rr.CustomerQuoteItem = CustomerQuoteItem;



                            var VLineItem = {}; var VQItem = [];
                            VLineItem.PartId = rr.PartId;
                            VLineItem.PartNo = rr.PartNo;
                            VLineItem.PartDescription = '';
                            VLineItem.Quantity = rr.Quantity;
                            VLineItem.LeadTime = rr.LeadTime;
                            VLineItem.PartNo = rr.PartNo;
                            VLineItem.Rate = rr.VendorBillTotal / rr.Quantity;
                            VLineItem.Price = VLineItem.Quantity * VLineItem.Rate;
                            VLineItem.VendorId = rr.VendorId;
                            VLineItem.RRId = 0;
                            VLineItem.Description = '';
                            VLineItem.SerialNo = '';
                            VLineItem.WarrantyPeriod = rr.WarrantyPeriod;
                            VQItem.push(VLineItem); rr.VQItem = VQItem;


                            var POObj = new PurchaseOrderModel(rr);
                            POObj.POType = Constants.CONST_PO_TYPE_REGULAR;
                            POObj.PONo = rr.PONo;
                            POObj.DateRequested = POObj.Created = rr.POCreatedDate;
                            POObj.DueDate = rr.POCreatedDate;
                            POObj.ShipAddressBookId = 666;
                            POObj.BillAddressBookId = rr.CustomerBillToId;
                            POObj.ShipAddressIdentityType = 2;
                            POObj.SubTotal = rr.POTotal;
                            POObj.GrandTotal = rr.POTotal;
                            POObj.Status = rr.Status == "Approved" ? Constants.CONST_PO_STATUS_APPROVED : Constants.CONST_PO_STATUS_OPEN;

                            var SOObj = new SOModel(rr);
                            SOObj.SOType = Constants.CONST_SO_TYPE_REGULAR;
                            SOObj.DateRequested = SOObj.Created = rr.SOCreatedDate;
                            SOObj.DueDate = rr.SOCreatedDate;
                            SOObj.ReferenceNo = '';
                            SOObj.SONo = rr.SONo;
                            SOObj.ShipAddressBookId = rr.CustomerShipToId;
                            SOObj.BillAddressBookId = rr.CustomerBillToId;
                            SOObj.SubTotal = rr.SOTotal;
                            SOObj.GrandTotal = rr.SOTotal;
                            SOObj.Status = rr.Status == "Approved" ? Constants.CONST_SO_STATUS_APPROVED : Constants.CONST_SO_STATUS_OPEN;
                            SOObj.IsConvertedToPO = rr.PONo != '' ? 1 : 0;
                            SOObj.QuoteId = rr.QuoteId;


                            var InvObj = new InvoiceModel(rr);
                            InvObj.SOId = 0;
                            InvObj.SONo = rr.SONo;
                            InvObj.InvoiceNo = rr.CustomerInvoiceNo = rr.InvoiceNo;
                            InvObj.InvoiceType = Constants.CONST_INV_TYPE_REGULAR;
                            InvObj.InvoiceDate = rr.InvoiceCreatedDate;
                            InvObj.Created = rr.InvoiceCreatedDate;
                            InvObj.DueDate = rr.InvoiceCreatedDate;
                            InvObj.ShipAddressBookId = rr.CustomerShipToId;
                            InvObj.BillAddressBookId = rr.CustomerBillToId;
                            InvObj.SubTotal = rr.InvoiceTotal;
                            InvObj.GrandTotal = rr.InvoiceTotal;
                            InvObj.IsCSVProcessed = rr.Status == "Approved" ? 1 : 0;
                            //  InvObj.GrandTotal = parseFloat(rr.Shipping) + parseFloat(rr.CustomerQuoteGrandTotal);
                            InvObj.Status = rr.Status == "Approved" ? Constants.CONST_INV_STATUS_APPROVED : Constants.CONST_INV_STATUS_OPEN;


                            var VendorInvoiceObj = new VendorInvoiceModel(rr);
                            VendorInvoiceObj.VendorInvoiceNo = rr.VendorInvoiceNo;
                            VendorInvoiceObj.VendorInvoiceType = Constants.CONST_VINV_TYPE_REGULAR;
                            VendorInvoiceObj.InvoiceDate = VendorInvoiceObj.Created = rr.VendorBillCreatedDate;
                            VendorInvoiceObj.DueDate = rr.VendorBillCreatedDate;
                            VendorInvoiceObj.CustomerInvoiceNo = '';
                            VendorInvoiceObj.CustomerInvoiceId = 0;
                            VendorInvoiceObj.CustomerInvoiceAmount = rr.InvoiceTotal;
                            VendorInvoiceObj.VendorInvNo = '';
                            VendorInvoiceObj.SubTotal = rr.VendorBillTotal;
                            VendorInvoiceObj.GrandTotal = rr.VendorBillTotal;
                            VendorInvoiceObj.ReferenceNo = '';
                            VendorInvoiceObj.IsCSVProcessed = rr.Status == "Approved" ? 1 : 0;
                            VendorInvoiceObj.Status = rr.Status == "Approved" ? Constants.CONST_VENDOR_INV_STATUS_APPROVED : Constants.CONST_VENDOR_INV_STATUS_OPEN;




                            QuotesModel.CreateQuotes(Quoteobj, (err, data) => {

                                if (!data) {
                                    return result({ msg: "There is a problem in creating a Quote. Pelase check the details." }, null);
                                }
                                rr.QuoteId = data.id > 0 ? data.id : 0;
                                CustomerLineItem.QuoteId = rr.QuoteId;

                                async.parallel([
                                    function (result) {
                                        if (boolStatus2 && rr.SONo != '') { SOModel.Create(SOObj, result); }
                                        else { RR.emptyFunction(rr, result); }
                                    },

                                    function (result) {
                                        if (boolStatus4 && rr.PONo != '') { PurchaseOrderModel.Create(POObj, result); }
                                        else { RR.emptyFunction(rr, result); }
                                    },

                                    function (result) {
                                        if (boolStatus3 && rr.InvoiceNo != '') { InvoiceModel.Create(InvObj, result); }
                                        else { RR.emptyFunction(rr, result); }
                                    },
                                    function (result) {
                                        if (boolStatus5 && rr.VendorInvoiceNo != '') { VendorInvoiceModel.Create(VendorInvoiceObj, result); }
                                        else { RR.emptyFunction(rr, result); }
                                    },
                                    function (result) {
                                        if (boolStatus1) { QuotesItemModel.CreateQuoteItem(rr.QuoteId, rr.CustomerQuoteItem, result); }
                                        else { RR.emptyFunction(rr, result); }
                                    },

                                ],
                                    function (err, results) {
                                        if (err) { return result(err, null); }

                                        else {
                                            POObj.POId = rr.POId = results[1].id > 0 ? results[1].id : 0;
                                            SOObj.SOId = rr.SOId = results[0].SOId > 0 ? results[0].SOId : 0;
                                            InvObj.InvoiceId = rr.CustomerInvoiceId = rr.InvoiceId = results[2].id > 0 ? results[2].id : 0;
                                            VendorInvoiceObj.VendorInvoiceId = rr.VendorInvoiceId = results[3].id > 0 ? results[3].id : 0;
                                            CustomerQuoteItem.QuoteItemId = rr.QuoteItemId = results[4].id > 0 ? results[4].id : 0;

                                            async.parallel([

                                                function (result) {
                                                    if (rr.SOId && rr.SONo != '') { SOItemModel.Create(rr.SOId, rr.CustomerQuoteItem, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },

                                                function (result) {
                                                    if (rr.POId && rr.PONo != '') { PurchaseOrderItemModel.AutoCreatePurchaseOrderItem(rr.POId, rr.VQItem, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },

                                                function (result) {
                                                    if (rr.InvoiceId && rr.InvoiceNo != '') { InvoiceItemModel.Create(rr.InvoiceId, rr.CustomerQuoteItem, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },
                                                function (result) {
                                                    if (rr.VendorInvoiceId && rr.VendorInvoiceNo != '') { VendorInvoiceItemModel.Create(rr.VendorInvoiceId, rr.VQItem, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },
                                                function (result) {
                                                    if (rr.POId && rr.SOId) { SalesOrder.LinkSOPOUpdateQuery(rr, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },

                                                function (result) {
                                                    if (rr.SOId && rr.SONo != '' && rr.Status == "Approved") { SOModel.ApproveSO(SOObj, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },



                                                function (result) {
                                                    if (rr.POId && rr.PONo != '' && rr.Status == "Approved") { PurchaseOrderModel.ApprovePO(POObj, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },







                                                function (result) {
                                                    if (rr.InvoiceId && rr.InvoiceNo != '') { con.query(InvoiceModel.UpdateSOIdByInvoiceId(rr.SOId, rr.InvoiceId), result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },
                                                function (result) {
                                                    if (rr.InvoiceId && rr.InvoiceNo != '' && rr.Status == "Approved") { InvoiceModel.ApproveInvoice(InvObj, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },





                                                function (result) {
                                                    if (rr.VendorInvoiceId && rr.VendorInvoiceNo != '' && rr.Status == "Approved") { VendorInvoiceModel.ApproveVendorInvoice(VendorInvoiceObj, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },
                                                function (result) {
                                                    if (rr.VendorInvoiceId && rr.VendorInvoiceNo != '') { VendorInvoiceModel.UpdatePOInvoiceToVB(rr, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },




                                            ],
                                                function (err, results) {
                                                    if (err) {
                                                        return result(err, null);
                                                    } else {
                                                        rr.POItemId = results[1].id > 0 ? results[1].id : 0;
                                                        rr.SOItemId = results[0].id > 0 ? results[0].id : 0;
                                                        rr.InvoiceItemId = results[2].id > 0 ? results[2].id : 0;
                                                        rr.VendorInvoiceItemId = results[3].id > 0 ? results[3].id : 0;

                                                        async.parallel([

                                                            function (result) {
                                                                if (rr.POItemId && rr.SOItemId != '') { SalesOrder.LinkSOPOLineItemUpdateQuery(rr, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (rr.InvoiceItemId && rr.SOItemId) { SalesOrder.LinkInvoiceSOLineItemUpdateQuery(rr, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (rr.POItemId && rr.VendorInvoiceItemId) { SalesOrder.LinkVendorItemToPO(rr, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (rr.SOItemId && rr.QuoteItemId) { SalesOrder.LinkSOItemQuoteItem(rr, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (rr.SOId && rr.QuoteId) { SalesOrder.LinkSOQuote(rr, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },


                                                        ],
                                                            function (err, results) {
                                                                if (err)
                                                                    return result(err, null);
                                                                else
                                                                    return result(err, null);
                                                            })
                                                    }
                                                })
                                        }
                                    });
                            });
                        }
                    });
            }
        });
};



RRImport.ImportMissingSOItem = (RRJson, result) => {

    let rr = new SOPOItemImport(RRJson);

    let RRQuery = ` SELECT RR.RRId,RR.RRNo,RR.CustomerSOId,RR.VendorPOId,RR.VendorId,RR.PartId ,DATE_FORMAT(SO.Created,'%Y-%m-%d %H:%m:%s')
    FROM tbl_repair_request as RR 
    LEFT JOIN tbl_sales_order as SO ON SO.RRId = RR.RRId AND SO.IsDeleted = 0  
    WHERE   RR.IsDeleted=0 and RR.RRNo = '${rr.RRNo}' `;
    // console.log(RRQuery);
    async.parallel([
        function (result) { con.query(RRQuery, result); }
    ],
        function (err, results) {
            if (err) {
                console.log(err);
                return result(err, null);
            } else {

                rr.PartId = results[0][0][0].PartId;
                rr.VendorId = results[0][0][0].VendorId;
                console.log("PartId = " + results[0][0][0].PartId);

                var CustomerLineItem = {}; var CustomerQuoteItem = [];
                CustomerLineItem.PartId = results[0][0][0].PartId;
                CustomerLineItem.PartNo = rr.PartNo;
                CustomerLineItem.PartDescription = rr.Description;
                CustomerLineItem.Quantity = rr.Quantity;
                CustomerLineItem.LeadTime = 20;
                CustomerLineItem.Rate = rr.CustomerQuoteGrandTotal / rr.Quantity;
                CustomerLineItem.Price = CustomerLineItem.Quantity * CustomerLineItem.Rate;
                CustomerLineItem.VendorId = rr.VendorId;
                CustomerLineItem.RRId = results[0][0][0].RRId;
                CustomerLineItem.Description = rr.Description;
                CustomerLineItem.VendorUnitPrice = rr.VendorQuoteGrandTotal / rr.Quantity;
                CustomerLineItem.WarrantyPeriod = 18;
                CustomerLineItem.Created = results[0][0][0].Created;;
                CustomerLineItem.Modified = results[0][0][0].Created;;
                CustomerQuoteItem.push(CustomerLineItem); rr.CustomerQuoteItem = CustomerQuoteItem;

                async.parallel([
                    function (result) {
                        if (results[0][0][0].CustomerSOId) { SOItemModel.Create(results[0][0][0].CustomerSOId, rr.CustomerQuoteItem, result); }
                        else { RR.emptyFunction(rr, result); }
                    }
                ],
                    function (err, results) {
                        if (err) {
                            return result(err, null);
                        }
                        else {
                            return result(null, null);
                        }
                    });
            }
        });
};


RRImport.ImportMissingPOItem = (RRJson, result) => {

    let rr = new SOPOItemImport(RRJson);
    let RRQuery = ` SELECT RR.RRId,RR.RRNo,RR.CustomerSOId,RR.VendorPOId,RR.VendorId,RR.PartId
    FROM tbl_repair_request as RR WHERE     
    RR.IsDeleted=0 and RR.RRNo = '${rr.RRNo}' `;

    async.parallel([
        function (result) { con.query(RRQuery, result); }
    ],
        function (err, results) {
            if (err) {
                return result(err, null);
            } else {
                rr.PartId = results[0][0][0].PartId;
                rr.VendorId = results[0][0][0].VendorId;

                var VLineItem = {}; var VQItem = [];
                VLineItem.PartId = results[0][0][0].PartId;
                VLineItem.PartNo = rr.PartNo;
                VLineItem.PartDescription = rr.Description;
                VLineItem.Quantity = rr.Quantity;
                VLineItem.LeadTime = 20;
                VLineItem.Rate = rr.VendorQuoteGrandTotal / rr.Quantity;
                VLineItem.Price = VLineItem.Quantity * VLineItem.Rate;
                VLineItem.VendorId = rr.VendorId;
                VLineItem.RRId = results[0][0][0].RRId;
                VLineItem.Description = rr.Description;
                VLineItem.WarrantyPeriod = 18;
                VQItem.push(VLineItem); rr.VQItem = VQItem;

                async.parallel([
                    function (result) {
                        if (results[0][0][0].VendorPOId != '') {
                            PurchaseOrderItemModel.AutoCreatePurchaseOrderItem(results[0][0][0].VendorPOId, rr.VQItem, result);
                        }
                        else { RR.emptyFunction(rr, result); }
                    }
                ],
                    function (err, results) {
                        if (err) {
                            return result(err, null);
                        }
                        else {
                            return result(null, null);
                        }
                    });
            }
        });
};


ImportCustomerPONo.ImportCustomerPONo = (Object, result) => {
    let Obj = new ImportCustomerPONo(Object);
    if (Obj.RRNo != '') {
        async.parallel([
            function (result) { RR.UpdateCustomerPONoByRRId(Obj.NewCustomerPO, Obj.RRNo, result) },
            function (result) { InvoiceModel.UpdateCustomerPONoByRRId(Obj.NewCustomerPO, Obj.RRNo, result) },
            function (result) { SalesOrder.UpdateCustomerPONoByRRId(Obj.NewCustomerPO, Obj.RRNo, result) },
        ],
            function (err, results) {
                if (err)
                    return result(err, null);
                else
                    return result(Obj, null);
            })
    }
};
VendorImport.importVendor = (vendorJson, result) => {

    let vendor = new VendorImport(vendorJson);

    let vendorCheckQuery = `SELECT * FROM tbl_vendors WHERE IsDeleted = 0 AND VendorName = '${vendor.VendorName}'`;

    con.query(vendorCheckQuery, (err, res) => {
        if (err) {
            return result(err, null);
        }
        if (res.length > 0) {
            /* let VendorId = res[0].VendorId;
 
             let vendorUpdateQuery = `UPDATE tbl_vendors SET VendorCode = '${Vendorcode}' WHERE VendorId='${VendorId}'`;
             // let vendorUpdateQuery = `UPDATE tbl_vendors SET VendorCode = '${Vendorcode}', Username = '${Username}',Password = '${Password}' WHERE VendorId='${VendorId}'`;
             let userUpdateQuery = `UPDATE tbl_users SET Username = '${Username}',Password = '${Password}' WHERE IdentityType = 2 AND IdentityId = '${VendorId}'`;
 
             async.parallel([
                 function (result) { con.query(vendorUpdateQuery, result) },
                 // function (result) { con.query(userUpdateQuery, result) }
             ],
                 function (err, results) {
                     if (err) {
                         return result(err, null);
                     }
                     return result(err, null);
                 }
             );*/
            console.log(vendor.VendorName + " vendor available");
            return result(err, null);
        }
        else {
            let stateQuery = `SELECT StateId FROM tbl_states WHERE IsDeleted = 0 AND StateCode = '${vendor.StateCode}'`;
            let countryQuery = `SELECT CountryId FROM tbl_countries WHERE IsDeleted = 0 AND CountryCode = '${vendor.CountryCode}';`
            let termsQuery = `SELECT TermsId FROM ahoms.tbl_terms WHERE IsDeleted = 0 AND  TermsName = '${vendor.Terms}';`

            async.parallel([
                (result) => { con.query(stateQuery, result) },
                (result) => { con.query(countryQuery, result) },
                (result) => { con.query(termsQuery, result) },
            ],
                (err, results) => {

                    if (err) {
                        return result(err, null);
                    }
                    let StateId = 0; let CountryId = 0; let TermsId = 0;
                    StateId = results[0][0][0] ? results[0][0][0].StateId : 0;
                    CountryId = results[1][0][0] ? results[1][0][0].CountryId : 0;
                    TermsId = results[2][0][0] ? results[2][0][0].TermsId : 4;

                    {
                        let vendorInsertQuery = `INSERT INTO tbl_vendors (VendorCode, VendorName, VendorTypeId, VendorEmail, VendorCountryId, TermsId, Website, Username, Password,Currency)
                                VALUES ('${vendor.VendorCode}', '${vendor.VendorName}', '${vendor.VendorTypeId}', '${vendor.Email}', '${CountryId}', '${TermsId}', '${vendor.Website}', '', '', 'US$');`

                        console.log(vendorInsertQuery);
                        con.query(vendorInsertQuery, (err, res) => {
                            if (err) {
                                return result(err, null);
                            }
                            let VendorId = res.insertId;


                            if (vendor.Email) {
                                var Username = vendor.Email;
                            } else {
                                var Username = vendor.VendorCode;
                                Username = Username.replace(/[^A-Z0-9]/ig, "");
                            }
                            let Password = md5("Password@123");


                            let addressInsertQuery = `INSERT INTO tbl_address_book (IdentityType, IdentityId, AddressType, StreetAddress, City, StateId, CountryId, Zip, Email, PhoneNoPrimary, Fax, IsContactAddress, IsShippingAddress, IsBillingAddress, SuiteOrApt)
                                    VALUES (2, ${VendorId}, ${1}, '${vendor.StreetAddress}', '${vendor.City}', '${StateId}', '${CountryId}', '${vendor.Zip}', '${vendor.Email}', '${vendor.PhoneNoPrimary}', '${vendor.Fax}', '1', '1', '1', '');`;
                            // console.log("Address Query = " + addressInsertQuery);

                            let userInsertQuery = `INSERT INTO tbl_users (IdentityType, IdentityId, IsPrimay, Title,FirstName,Address1,City,StateId,CountryId,Zip,Email,PhoneNo,Fax,Username,Password,Status )
                                 VALUES (2, ${VendorId},1,1,'${vendor.VendorName}', '${vendor.StreetAddress}', '${vendor.City}', '${StateId}', '${CountryId}', '${vendor.Zip}', '${vendor.Email}', '${vendor.PhoneNoPrimary}', '${vendor.Fax}','${Username}','${Password}',1);`;

                            let vendorUpdateQuery = `UPDATE tbl_vendors SET IsCorpVendorCode = 'VC${VendorId}', Username = '${Username}'  WHERE VendorId = ${VendorId}  `;

                            /*con.query(addressInsertQuery, (err, res) => {
            
                                if (err) {
                                    return result(err, null);
                                }
            
                                return result(err, null);
                            });*/

                            async.parallel([
                                function (result) { con.query(addressInsertQuery, result) },
                                function (result) { con.query(userInsertQuery, result) },
                                function (result) { con.query(vendorUpdateQuery, result) }
                            ],
                                function (err, results) {
                                    if (err) {
                                        return result(err, null);
                                    }
                                    return result(err, null);
                                }
                            );
                        })
                    }
                })
        }
    });
}

CustomerImport.importCustomer = (customerJson, result) => {

    let customer = new CustomerImport(customerJson);

    let customerCheckQuery = `SELECT * FROM tbl_customers WHERE IsDeleted = 0 AND CompanyName = '${customer.CompanyName}'`;


    let Customercode = customer.CustomerCode;
    let Username = Customercode.replace(/[^A-Z0-9]/ig, "");
    let Password = md5(Username);

    con.query(customerCheckQuery, (err, res) => {
        if (err) {
            return result(err, null);
        }

        if (res.length > 0) {
            let CustomerId = res[0].CustomerId;
            let customerUpdateQuery = `UPDATE tbl_customers SET CustomerCode = '${Customercode}' WHERE CustomerId='${CustomerId}'`;
            // let customerUpdateQuery = `UPDATE tbl_customers SET CustomerCode = '${Customercode}', Username = '${Username}',Password = '${Password}' WHERE CustomerId='${CustomerId}'`;
            let userUpdateQuery = `UPDATE tbl_users SET Username = '${Username}',Password = '${Password}' WHERE IdentityType = 1 AND IdentityId = '${CustomerId}'`;

            async.parallel([
                function (result) { con.query(customerUpdateQuery, result) },
                // function (result) { con.query(userUpdateQuery, result) }
            ],
                function (err, results) {
                    if (err) {
                        return result(err, null);
                    }
                    return result(err, null);
                }
            );
        } else {

            let stateQuery = `SELECT StateId FROM tbl_states WHERE StateCode = '${customer.StateCode}'`;
            let countryQuery = `SELECT CountryId FROM tbl_countries WHERE CountryCode = '${customer.CountryCode}';`
            let termsQuery = `SELECT TermsId FROM ahoms.tbl_terms WHERE TermsName = '${customer.Terms}';`

            async.parallel([
                (result) => { con.query(stateQuery, result) },
                (result) => { con.query(countryQuery, result) },
                (result) => { con.query(termsQuery, result) },
            ],
                (err, results) => {

                    if (err) {
                        return result(err, null);
                    }
                    let StateId = 0; let CountryId = 0; let TermsId = 0;
                    StateId = results[0][0][0] ? results[0][0][0].StateId : 0;
                    CountryId = results[1][0][0] ? results[1][0][0].CountryId : 0;
                    TermsId = results[2][0][0] ? results[2][0][0].TermsId : 4;

                    let customerInsertQuery = `INSERT INTO tbl_customers (CustomerCode, GroupId, CustomerTypeId, FirstName, LastName, Email, CustomerCountryId, Username, Password, CompanyName, TermsId, CustomerIndustry, Notes, PriorityNotes, Website, TaxType, IsLaborOnInvoice, ProfilePhoto)
                                VALUES ('${customer.CustomerCode}' '${1}', '${customer.CompanyTypeId}', '${customer.CustomerName}', '', '${customer.Email}', '${CountryId}', '', '', '${customer.CompanyName}', '${TermsId}', '', '', '', '', '${customer.TaxTypeId}', 0, '');`

                    con.query(customerInsertQuery, (err, res) => {
                        if (err) {
                            return result(err, null);
                        }
                        let CustomerId = res.insertId;


                        let addressInsertQuery = `INSERT INTO tbl_address_book (IdentityType, IdentityId, AddressType, StreetAddress, City, StateId, CountryId, Zip, Email, PhoneNoPrimary, Fax, IsContactAddress, IsShippingAddress, IsBillingAddress, SuiteOrApt)
                                    VALUES (1, ${CustomerId}, ${1}, '${customer.StreetAddress}', '${customer.City}', '${StateId}', '${CountryId}', '${customer.Zip}', '${customer.Email}', '${customer.PhoneNoPrimary}', '${customer.Fax}', '1', '1', '1', '');`;


                        let userInsertQuery = `INSERT INTO tbl_users (IdentityType, IdentityId, IsPrimay, Title,FirstName,Address1,City,StateId,CountryId,Zip,Email,PhoneNo,Fax,Username,Password,Status )
                                    VALUES (1, ${CustomerId},1,1,'${customer.CustomerName}', '${customer.StreetAddress}', '${customer.City}', '${StateId}', '${CountryId}', '${customer.Zip}', '${customer.Email}', '${customer.PhoneNoPrimary}', '${customer.Fax}','${Username}','${Password}',1);`;

                        let customerUpdateQuery = `UPDATE tbl_customers SET Username = '${Username}', Password = '${Password}', CustomerCode = '${Customercode}' WHERE CustomerId = ${CustomerId}  `;

                        async.parallel([
                            function (result) { con.query(addressInsertQuery, result) },
                            // function (result) { con.query(userInsertQuery, result) },
                            // function (result) { con.query(customerUpdateQuery, result) }
                        ],
                            function (err, results) {
                                if (err) {
                                    return result(err, null);
                                }
                                return result(err, null);
                            }
                        );

                        /*con.query(addressInsertQuery, (err, res) => {
        
                            if (err) {
                                return result(err, null);
                            }
        
                            return result(err, null);
                        });*/



                    })
                }

            );
        }
    })


}



RRImport.UpdateVendorUnitPrice = (jsonData, result) => {

    let jsonobj = new VendorUnitPriceImport(jsonData);
    let customerCheckQuery = `SELECT PO.POId,POI.POItemId, POI.Quantity as POQunatity, POI.Rate as PORate,POI.BaseRate,POI.BaseTax,VBI.VendorInvoiceItemId, VBI.Quantity as VBQunatity, VBI.Rate as VBRate,VBI.BaseRate,VBI.BaseTax
    FROM tbl_po as PO 
    LEFT JOIN tbl_po_item as POI ON POI.POId = PO.POId AND POI.IsDeleted = 0
    LEFT JOIN tbl_vendor_invoice_item as VBI ON VBI.POItemId = POI.POItemId AND VBI.IsDeleted = 0
    WHERE PO.IsDeleted = 0 AND PO.PONo = '${jsonobj.PONo}'`;
    con.query(customerCheckQuery, (err, res) => {
        if (err) {
            return result(err, null);
        }
        if (res.length > 0) {


        } else {
            return result({ msg: "Data not available: " + jsonData.RRNo }, null);
        }
    })

}


CustomerImport.importCustomerUser = (customerJson, result) => {

    let customer = new CustomerUserImport(customerJson);

    let customerCheckQuery = `SELECT * FROM tbl_customers WHERE IsDeleted = 0 AND CompanyName = '${customer.CompanyName}'`;

    let PasswordPlain = customer.Password;
    let Username = customer.Email;
    let Password = md5(PasswordPlain);

    let userCheckQuery = `SELECT * FROM tbl_users WHERE IsDeleted = 0 AND Username = '${Username}'`;

    con.query(customerCheckQuery, (err, res) => {
        if (err) {
            return result(err, null);
        }
        if (res.length > 0) {
            let CustomerId = res[0].CustomerId;
            con.query(userCheckQuery, (err1, res1) => {
                if (err1) {
                    return result(err1, null);
                }
                if (res1.length > 0) {
                    return result({ msg: "User duplicate : " + Username }, null);
                } else {

                    let userInsertQuery = `INSERT INTO tbl_users (IdentityType, IdentityId, IsPrimay, Title,FirstName,Address1,City,StateId,CountryId,Zip,Email,PhoneNo,Fax,Username,Password,Status )
                                    VALUES (1, ${CustomerId},0,1,'${customer.ContactName}', '${customer.Address}', '', '0', '0', '', '${customer.Email}', '${customer.Contact}', '','${Username}','${Password}',1);`;

                    con.query(userInsertQuery, (err, res) => {
                        if (err) {
                            return result(err, null);
                        }
                        return result({ msg: "User Added : " + Username }, null);
                    })
                }

            })

        } else {
            return result({ msg: "Customer Not Available : " + customer.CompanyName }, null);
        }
    })

}





PartImport.importPart = (partJson, result) => {

    let part = new PartImportNew(partJson);
    let manufacturerQuery = `SELECT VendorId FROM tbl_vendors WHERE VendorName = '${part.Manufacturer}'`;
    let partCheck = `SELECT PartId FROM tbl_parts WHERE PartNo = '${part.PartNo}'`;

    async.parallel([
        (result) => { con.query(manufacturerQuery, result) },
        (result) => { con.query(partCheck, result) }
    ],
        (err, results) => {

            if (err) {
                return result(err, null);
            }
            let ManufacturerId = 0;
            ManufacturerId = results[0][0][0] ? results[0][0][0].VendorId : 0;

            if (results[1][0][0] && results[1][0][0].PartId > 0) {
                console.log(part.PartNo + ' already exists');
                return result(err, null);
            } else {
                let partInsertQuery = `INSERT INTO tbl_parts (PartNo, SerialNo, Description, UnitType, InventoryType, ManufacturerId, ManufacturerPartNo, Quantity, LocationName, Price, IsNewOrRefurbished, OnHandQty, Avail, OpenPOQty, TaxType, IsSerialNumber, Status, IsDeleted, IsActive, SellingPrice)
                                VALUES ('${part.PartNo}', '', '${part.Description}', '0', '0', '${ManufacturerId}', '${part.ManufacturerPartNo}', '1', '', '${part.Price}', '1', '${part.OnHandQty}', '${part.Avail}', '${part.OpenPOQty}', '${part.TaxTypeId}', 1, 1, 0, 1, '${part.Price}');`

                //console.log(partInsertQuery);
                con.query(partInsertQuery, (err, res) => {
                    return result(err, null);

                })
            }

        }

    );
}



RRImport.LinkBlanketPONonRR = (val, result) => {

    if (!val.InvoiceId) {
        val.InvoiceId = 0
    }
    if (!val.SOId) {
        val.SOId = 0
    }
    var debitBlanketPO = `UPDATE  tbl_customer_blanket_po SET CurrentBalance = CurrentBalance-${val.GrandTotal} , 
    Modified = '${cDateTime.getDateTime()}', 
    ModifiedBy = ${global.authuser.UserId} WHERE IsDeleted = 0 AND CustomerId = ${val.CustomerId}  AND 
    CustomerBlanketPOId = ${val.CustomerBlanketPOId}  `;

    var SOUpdate = `UPDATE  tbl_sales_order SET CustomerBlanketPOId  = ${val.CustomerBlanketPOId}  , 
    Modified = '${cDateTime.getDateTime()}', 
    ModifiedBy = ${global.authuser.UserId} WHERE IsDeleted = 0 AND CustomerId = ${val.CustomerId}  AND 
    SOId = ${val.SOId}  `;

    var InvoiceUpdate = `UPDATE  tbl_invoice SET CustomerBlanketPOId = ${val.CustomerBlanketPOId} , 
    Modified = '${cDateTime.getDateTime()}', 
    ModifiedBy = ${global.authuser.UserId} WHERE IsDeleted = 0 AND InvoiceId = ${val.InvoiceId}  `;

    //console.log(debitBlanketPO);
    // //console.log(SOUpdate);
    //  console.log(InvoiceUpdate);

    var DebitHistoryObj = new CustomerBlanketPOHistoryModel({
        BlanketPOId: val.CustomerBlanketPOId,
        RRId: 0,
        MROId: 0,
        QuoteId: val.QuoteId,
        PaymentType: 2,
        Comments: "Approved by Brij",
        Amount: val.GrandTotal,
        CurrentBalance: 0
    });

    async.parallel([
        function (result) { con.query(debitBlanketPO, result) },
        function (result) { CustomerBlanketPOHistoryModel.Create(DebitHistoryObj, result); },
        function (result) { con.query(SOUpdate, result) },
        function (result) { con.query(InvoiceUpdate, result) },
    ],
        function (err, results) {
            if (err) {
                console.log(err);
                return result(err, null);
            }
            result(null, results[0]);
        }
    );

}




RRImport.ImportMissingPODueDate = (obj, result) => {
    var RRNo = obj["RR No"] ? obj["RR No"] : '';
    var SONo = obj["SO #"] ? obj["SO #"] : '';
    var PONo = obj["PO #"] ? obj["PO #"] : '';
    var SODueDate = obj["Sales Order Required Date"] ? obj["Sales Order Required Date"] : '';
    var ApprovedDate = obj["Approved Date"] ? obj["Approved Date"] : '';
    var SOCreated = obj["SO created date"] ? obj["SO created date"] : '';
    var POCreated = obj["PO created date"] ? obj["PO created date"] : '';

    var RRId = 0;
    var RRQuery = `SELECT RRId,RRNo FROM tbl_repair_request  WHERE IsDeleted = 0 AND RRNo='${RRNo}'`;
    // console.log(RRQuery);
    con.query(RRQuery, (err, res) => {
        if (res.length) {
            RRId = res[0].RRId;
            if (SODueDate) {
                var date_arr31 = SODueDate.split('/');
                SODueDate = date_arr31[2] + "-" + date_arr31[0] + "-" + date_arr31[1];
            }
            if (ApprovedDate) {
                var date_arr33 = ApprovedDate.split('/');
                ApprovedDate = date_arr33[2] + "-" + date_arr33[0] + "-" + date_arr33[1];
            }
            if (SOCreated) {
                var date_arr34 = SOCreated.split('/');
                SOCreated = date_arr34[2] + "-" + date_arr34[0] + "-" + date_arr34[1];
            }
            if (POCreated) {
                var date_arr32 = POCreated.split('/');
                POCreated = date_arr32[2] + "-" + date_arr32[0] + "-" + date_arr32[1];
            }

            var PODueDate = POCreated;
            if (POCreated != "") {

                var PODueDate1 = new Date(POCreated);
                PODueDate1.setDate(PODueDate1.getDate() + 21);
                let date = ("0" + PODueDate1.getDate()).slice(-2);
                let month = ("0" + (PODueDate1.getMonth() + 1)).slice(-2);
                let year = PODueDate1.getFullYear();
                PODueDate = (year + "-" + month + "-" + date);
            }

            var sql_po = `UPDATE tbl_po SET DateRequested = '${POCreated}', DueDate = '${PODueDate}', Created =  '${POCreated} 11:00:00'  WHERE IsDeleted = 0 AND RRNo='${RRNo}' AND PONo='${PONo}'`;
            var sql_rr = `UPDATE tbl_repair_request SET VendorPODueDate = '${PODueDate}', CustomerSODueDate = '${SODueDate}' WHERE IsDeleted = 0 AND RRNo='${RRNo}' AND VendorPONo='${PONo}'`;
            var sql_so = `UPDATE tbl_sales_order SET DateRequested = '${SOCreated}', DueDate = '${SODueDate}', Created =  '${SOCreated} 11:00:00'  WHERE IsDeleted = 0 AND RRNo='${RRNo}' AND SONo='${SONo}'`;
            var sql_qt = `UPDATE tbl_quotes SET ApprovedDate = '${ApprovedDate} 11:00:00'   WHERE IsDeleted = 0 AND RRNo='${RRNo}' `;
            var sql_rr_his = `UPDATE tbl_repair_request_status_history SET Created = '${ApprovedDate} 11:00:00'  WHERE IsDeleted = 0 AND HistoryStatus = 5 AND RRId='${RRId}' `;
            // console.log(sql_po);
            // console.log(sql_rr);
            // console.log(sql_so);
            //console.log(sql_qt);
            // console.log(sql_rr_his);

            async.parallel([
                function (result) { con.query(sql_po, result) },
                function (result) { con.query(sql_rr, result) },
                function (result) { con.query(sql_so, result) },
                function (result) { con.query(sql_qt, result) },
                function (result) { con.query(sql_rr_his, result) },
            ],
                function (err, results) {
                    if (err) {
                        return result(err, null);
                    }
                    result(null, null);
                }
            );
            //return result(null, null);
        } else {
            return result("RR No Not found : " + RRNo, null);
        }

    })


};


RRImport.ImportPartManufacturer = (obj, result) => {
    var PartNo = obj["PartNo"] ? obj["PartNo"] : '';
    var Description = obj["Description"] ? obj["Description"] : '';
    var Manufacturer = obj["Manufacturer"] ? obj["Manufacturer"] : '';
    var ManufacturerPartNo = obj["ManufacturerPartNo"] ? obj["ManufacturerPartNo"] : '';

    var sql = `Select VendorId,VendorName From tbl_vendors where IsDeleted=0 and Vendorname='${Manufacturer}'`;
    var sql1 = `Select PartNo, PartId from tbl_parts WHERE IsDeleted = 0  AND PartNo = '${PartNo}' limit 1 `;

    async.parallel([
        function (result) { con.query(sql, result) },
        function (result) { con.query(sql1, result) }
    ],
        function (err, results) {
            if (err) {
                return result(err, null);
            }
            if (results[1][0].length && results[1][0][0].PartId) {
                var ManufacturerId = results[0][0].length && results[0][0][0].VendorId > 0 ? results[0][0][0].VendorId : 0;
                var sql_part_update = `Update  tbl_parts set Description = '${Description}' , ManufacturerId='${ManufacturerId}', ManufacturerPartNo='${ManufacturerPartNo}'    WHERE PartId=${results[1][0][0].PartId} `;
                // console.log(sql_part_update);
                con.query(sql_part_update, (err, res) => {
                    if (err) {
                        return result(err, null);
                    }
                    var msg = ManufacturerId ? '' : ' : Manufacturer Missing ' + Manufacturer;
                    return result(null, "Success" + msg);
                });
            }

        }
    );
    // return result(null, null);
};



RRImport.GetNonRRBlanketPOListForLink = (val, result) => {
    var sql = `SELECT SO.CustomerId,SO.Created,Q.QuoteId,SO.SOId, Q.QuoteId,SO.GrandTotal,BPO.CustomerPONo,BPO.CustomerBlanketPOId,I.InvoiceId FROM tbl_sales_order as SO
                LEFT JOIN tbl_quotes as Q ON Q.QuoteId = SO.QuoteId 
                LEFT JOIN tbl_invoice as I ON I.SOId = SO.SOId AND I.IsDeleted = 0 
                LEFT JOIN tbl_customer_blanket_po as BPO ON BINARY  BPO.CustomerPONo = BINARY  SO.CustomerPONo AND BPO.IsDeleted = 0 
                WHERE SO.RRId = 0 AND SO.CustomerBlanketPOId =0    AND   SO.IsDeleted = 0 AND Q.IsDeleted = 0  AND BPO.CustomerPONo IS NOT NULL`;
    // console.log(sql)
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, res);
    });
};




RRImport.GetRRBlanketPOListForLink = (val, result) => {
    var sql = `SELECT RR.RRNo,RR.RRId,RR.CustomerId,SO.Created,Q.QuoteId,SO.SOId,SO.SONo, Q.QuoteId, Q.QuoteNo,Q.GrandTotal as QuoteGrandTotal,SO.GrandTotal as SOGrandTotal,BPO.CustomerPONo,BPO.CustomerBlanketPOId,I.InvoiceId,I.InvoiceNo,I.GrandTotal as InvocieGrandTotal ,RR.CustomerBlanketPOId as RRCustomerBlanketPOId,
 SO.CustomerBlanketPOId as SOCustomerBlanketPOId, I.CustomerBlanketPOId as InvoiceCustomerBlanketPOId
                 FROM tbl_repair_request as RR
                LEFT JOIN tbl_quotes as Q ON Q.RRId = RR.RRId AND Q.Status = 1 
                LEFT JOIN tbl_sales_order as SO ON RR.RRid = SO.RRId and SO.IsDeleted = 0                
                 LEFT JOIN tbl_invoice as I ON I.SOId = SO.SOId AND I.IsDeleted = 0 
                 LEFT JOIN tbl_customer_blanket_po as BPO ON BINARY  BPO.CustomerPONo = BINARY  RR.CustomerPONo AND BPO.CustomerId = RR.CustomerId AND BPO.IsDeleted = 0 
                 WHERE RR.IsDeleted = 0 AND RR.CustomerBlanketPOId = 0   AND Q.IsDeleted = 0 AND RR.Status IN(5,7)  AND BPO.CustomerPONo IS NOT NULL LIMIT 0,200  `;


    /* var sql = `SELECT  Q.GrandTotal as QuoteGrandTotal,SO.GrandTotal as SOGrandTotal,I.GrandTotal as InvocieGrandTotal,RR.RRId,SO.CustomerId,SO.Created,Q.QuoteId,RR.RRNo,Q.QuoteNo,SO.SOId, Q.QuoteId,SO.GrandTotal,BPO.CustomerPONo,BPO.CustomerBlanketPOId,RR.CustomerBlanketPOId as RRCustomerBlanketPOId,
 SO.CustomerBlanketPOId as SOCustomerBlanketPOId, I.CustomerBlanketPOId as InvoiceCustomerBlanketPOId,
 I.InvoiceId 
 FROM tbl_sales_order as SO
 LEFT JOIN tbl_quotes as Q ON Q.QuoteId = SO.QuoteId 
 LEFT JOIN tbl_invoice as I ON I.SOId = SO.SOId AND I.IsDeleted = 0 
 LEFT JOIN tbl_repair_request as RR ON RR.RRId = SO.RRId AND RR.IsDeleted = 0
 LEFT JOIN tbl_customer_blanket_po as BPO ON BINARY  BPO.CustomerPONo = BINARY  SO.CustomerPONo AND BPO.IsDeleted = 0 
 WHERE    SO.IsDeleted = 0 AND Q.IsDeleted = 0  AND BPO.CustomerPONo IS NOT NULL LIMIT 0,10000 `;
 
 */



    //console.log(sql)
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, res);
    });
};

RRImport.LinkBlanketPORR = (val, result) => {
    var amount = 0;
    if (val.InvoiceGrandTotal != null) {
        amount = val.InvoiceGrandTotal
    } else if (val.SOGrandTotal != null) {
        amount = val.SOGrandTotal
    } else {
        amount = val.QuoteGrandTotal
    }
    if (!val.InvoiceId) {
        val.InvoiceId = 0
    }
    if (!val.SOId) {
        val.SOId = 0
    }

    var debitBlanketPO = `UPDATE  tbl_customer_blanket_po SET CurrentBalance = CurrentBalance-${amount} , 
     Modified = '${cDateTime.getDateTime()}', 
     ModifiedBy = ${global.authuser.UserId} WHERE   IsDeleted = 0 AND CustomerId = ${val.CustomerId}  AND 
     CustomerBlanketPOId = ${val.CustomerBlanketPOId}  `;

    var SOUpdate = `UPDATE  tbl_sales_order SET CustomerBlanketPOId  = ${val.CustomerBlanketPOId}  , 
    Modified = '${cDateTime.getDateTime()}', 
    ModifiedBy = ${global.authuser.UserId} WHERE SOId > 0 AND IsDeleted = 0 AND CustomerId = ${val.CustomerId}  AND 
    SOId = ${val.SOId}  `;

    var InvoiceUpdate = `UPDATE  tbl_invoice SET CustomerBlanketPOId = ${val.CustomerBlanketPOId} , 
    Modified = '${cDateTime.getDateTime()}', 
    ModifiedBy = ${global.authuser.UserId} WHERE InvoiceId>0 AND IsDeleted = 0 AND InvoiceId = ${val.InvoiceId}  `;


    var RRUpdate = `UPDATE  tbl_repair_request SET CustomerBlanketPOId = ${val.CustomerBlanketPOId} , 
    Modified = '${cDateTime.getDateTime()}', 
    ModifiedBy = ${global.authuser.UserId} WHERE RRId>0 AND IsDeleted = 0 AND RRId = ${val.RRId}  `;

    //  console.log(debitBlanketPO);
    //console.log(SOUpdate);
    // console.log(InvoiceUpdate);
    // console.log(RRUpdate);

    var DebitHistoryObj = new CustomerBlanketPOHistoryModel({
        BlanketPOId: val.CustomerBlanketPOId,
        RRId: val.RRId,
        MROId: 0,
        QuoteId: val.QuoteId,
        PaymentType: 2,
        Comments: "Approved by Brij",
        Amount: amount,
        CurrentBalance: 0
    });

    // console.log(DebitHistoryObj);
    //console.log("Next");

    async.parallel([
        function (result) { con.query(debitBlanketPO, result) },
        function (result) { CustomerBlanketPOHistoryModel.Create(DebitHistoryObj, result); },
        function (result) { con.query(RRUpdate, result) },
        function (result) { con.query(SOUpdate, result) },
        function (result) { con.query(InvoiceUpdate, result) },
    ],
        function (err, results) {
            if (err) {
                console.log(err);
                return result(err, null);
            }
            result(null, results[0]);
        }
    );

}



RRImport.ImportRR = (RRJson, result) => {

    let rr = new RRImport(RRJson);
    //console.log("Created 1 = " + rr.Created)
    //new changes as per Brij
    rr.ShippingCost = 0;
    //rr.CustomerQuoteGrandTotal = rr.InvoiceTotal > 0 ? rr.InvoiceTotal : rr.CustomerQuoteGrandTotal;
    //rr.VendorQuoteGrandTotal = rr.VendorBillTotal > 0 ? rr.VendorBillTotal : rr.VendorQuoteGrandTotal;

    if (!rr.InvoiceTotal) {
        rr.InvoiceTotal = rr.CustomerQuoteGrandTotal;
    }
    if (!rr.VendorBillTotal) {
        rr.VendorBillTotal = rr.VendorQuoteGrandTotal;
    }
    if (!rr.InvoiceStatus) {
        rr.InvoiceStatus = "Approved";
    }




    let ManufacturerQuery = `SELECT VendorId as ManufacturerId,'-' test FROM tbl_vendors WHERE IsDeleted=0 and VendorName= '${rr.ManufacturerName}';`
    let PartCheckQuery = ` SELECT * FROM tbl_parts WHERE IsDeleted=0 and PartNo = '${rr.PartNo}' `;
    let CustomerQuery = `SELECT CustomerId,'-' test FROM tbl_customers WHERE IsDeleted=0 and CompanyName= '${rr.CompanyName}'`;
    let VendorQuery = `SELECT VendorId,'-' test FROM tbl_vendors WHERE IsDeleted=0 and VendorName= '${rr.VendorName}';`
    let RRQuery = `SELECT RRId,'-' test FROM tbl_repair_request WHERE IsDeleted=0 and RRNo= '${rr.RRNo}'; `

    if (rr.SubmittedDate) {
        var date_arr = rr.SubmittedDate.split('/');
        rr.SubmittedDate = date_arr[2] + "-" + date_arr[0] + "-" + date_arr[1];
    }
    if (rr.ApprovedDate) {
        var date_arr2 = rr.ApprovedDate.split('/');
        rr.ApprovedDate = date_arr2[2] + "-" + date_arr2[0] + "-" + date_arr2[1];
    }
    if (!rr.ApprovedDate) {
        rr.ApprovedDate = rr.SubmittedDate;
    }

    if (rr.Created) {
        var date_arr3 = rr.Created.split('/');
        rr.Created = date_arr3[2] + "-" + date_arr3[0] + "-" + date_arr3[1];
    }
    if (rr.RejectedDate) {
        var date_arr31 = rr.RejectedDate.split('/');
        rr.RejectedDate = date_arr31[2] + "-" + date_arr31[0] + "-" + date_arr31[1];

    }
    if (rr.CompletedDate) {
        var date_arr4 = rr.CompletedDate.split('/');
        rr.CompletedDate = date_arr4[2] + "-" + date_arr4[0] + "-" + date_arr4[1];
    }

    if (rr.InvoiceCreatedDate) {
        var date_arr5 = rr.InvoiceCreatedDate.split('/');
        rr.InvoiceCreatedDate = date_arr5[2] + "-" + date_arr5[0] + "-" + date_arr5[1];
    }

    if (rr.SalesOrderRequiredDate) {
        var date_arr6 = rr.SalesOrderRequiredDate.split('/');
        rr.SalesOrderRequiredDate = date_arr6[2] + "-" + date_arr6[0] + "-" + date_arr6[1];
    }
    if (!rr.CompletedDate) {
        rr.CompletedDate = rr.ApprovedDate;
    }


    //console.log("rr.ApprovedDate = " + rr.ApprovedDate);
    //console.log("rr.CompletedDate = " + rr.CompletedDate);

    //console.log("Created 2 = " + rr.Created)
    var boolStatus2 = false, boolStatus4 = false, boolStatus5 = false, boolStatus6 = false, boolStatus7 = false;
    if (rr.StatusName == "Completed") {
        boolStatus4 = true; boolStatus5 = true; boolStatus7 = true;
        rr.Status = Constants.CONST_RRS_COMPLETED;
    }
    else if (rr.StatusName == "Quote Rejected") {
        boolStatus4 = true; boolStatus6 = true;
        rr.Status = Constants.CONST_RRS_QUOTE_REJECTED;

    }
    else if (rr.StatusName == "Repair in Progress") {
        boolStatus4 = true; boolStatus5 = true;
    }
    else if (rr.StatusName == "Quoted - Awaiting Customer PO") {
        boolStatus4 = true;
    }
    else if (rr.StatusName == "Awaiting Vendor Quote") {
        boolStatus2 = true;
    }
    else if (rr.StatusName == "Awaiting Vendor Selection") {

    }
    else {
        return result({ msg: "Invalid Status" }, null);
    }
    async.parallel([
        function (result) { con.query(PartCheckQuery, result); },
        function (result) { con.query(VendorQuery, result); },
        function (result) { con.query(CustomerQuery, result); },
        function (result) { con.query(ManufacturerQuery, result); },
        function (result) { con.query(MROModel.SelectSettingsInfo(), result); },
        function (result) { con.query(RRQuery, result); },
    ],
        function (err, results) {
            if (err) {
                return result(err, null);
            }
            else if (results[5][0].length > 0) {
                return result({ msg: "Already Record Exist" }, null);
            } else if (!results[1][0][0] || !results[1][0][0].VendorId) {
                return result({ msg: "Vendor not available : " + rr.VendorName }, null);


            } else if (rr.StatusName == "Awaiting Vendor Selection") {
                return result({ msg: "Awaiting Vendor Selection not processed" }, null);
            }
            else if (!results[2][0][0] || !results[2][0][0].CustomerId) {
                return result({ msg: "Customer not available : " + rr.CompanyName }, null);
            } else {
                let PartId = 0; let VendorId = 0; let CustomerId = 0; let ManufacturerId = 0;
                PartId = results[0][0][0] ? results[0][0][0].PartId : 0;
                VendorId = results[1][0][0] ? results[1][0][0].VendorId : 0;
                CustomerId = results[2][0][0] ? results[2][0][0].CustomerId : 0;
                ManufacturerId = results[3][0][0] ? results[3][0][0].ManufacturerId : 0;
                rr.TaxPercent = results[4][0][0].TaxPercent ? results[4][0][0].TaxPercent : 0;
                rr.CustomerId = CustomerId; rr.MROId = 0;

                var ObjPart = new PartsModel({
                    PartNo: rr.PartNo,
                    Description: rr.Description,
                    ManufacturerPartNo: rr.ManufacturerPartNo,
                    ManufacturerId: ManufacturerId,
                    Quantity: 1,
                    Price: rr.PartPON,
                    IsNewOrRefurbished: 2
                });

                async.parallel([
                    function (result) {
                        if (PartId == 0) { PartsModel.addNewPart(ObjPart, result); }
                        else { RR.emptyFunction(RRJson, result); }
                    },
                    function (result) { con.query(AddessBook.GetBillingAddressIdByCustomerId(CustomerId), result); },
                    function (result) { con.query(AddessBook.GetShippingAddressIdByCustomerId(CustomerId), result); },
                    function (result) { con.query(CustomerDepartmentModel.selectbyname(CustomerId, rr.Department), result); },
                ],
                    function (err, results) {
                        if (err) {
                            return result(err, null);
                        }
                        else {
                            if (PartId == 0) {
                                if (results[0].id > 0) {
                                    PartId = results[0].id;
                                }
                            }
                            if (results[1][0].length > 0) {
                                rr.CustomerBillToId = results[1][0][0].AddressId;
                            }
                            if (results[2][0].length > 0) {
                                rr.CustomerShipToId = results[2][0][0].AddressId;
                            }
                            if (results[3][0].length > 0) {
                                rr.DepartmentId = results[3][0][0].CustomerDepartmentId;
                            }

                            rr.CustomerId = CustomerId;
                            rr.VendorId = VendorId;
                            rr.PartId = PartId;
                            rr.RRDescription = rr.Description;
                            rr.IsRushRepair = rr.IsRushRepair == "Normal" ? 0 : 1;
                            rr.Shipping = rr.ShippingCost;
                            rr.LeadTime = 20;
                            rr.WarrantyPeriod = 18;
                            rr.GrandTotal = parseFloat(rr.Shipping) + parseFloat(rr.CustomerQuoteGrandTotal);
                            rr.VendorCost = parseFloat(rr.Shipping) + parseFloat(rr.VendorQuoteGrandTotal);
                            // rr.Created = rr.CompletedDate;
                            rr.IsWarrantyRecovery = rr.WarrantyRecovery == "Yes" ? 1 : 0;
                            rr.RRCompletedDate = rr.CompletedDate;


                            var arrRRParts = [];
                            var ObjRRPart = new RRParts({
                                PartId: rr.PartId,
                                PartNo: rr.PartNo,
                                CustomerPartNo1: rr.CustomerPartNo1,
                                CustomerPartNo2: rr.CustomerPartNo2,
                                Description: rr.Description,
                                ManufacturerPartNo: rr.ManufacturerPartNo,
                                Manufacturer: ManufacturerId,
                                SerialNo: rr.SerialNo,
                                Quantity: rr.Quantity,
                                Rate: 0,
                                Price: 0,
                                WarrantyPeriod: rr.WarrantyPeriod,
                                LeadTime: rr.LeadTime,
                            });



                            arrRRParts.push(ObjRRPart); rr.RRParts = arrRRParts;
                            RR.CreateRequest(rr, (err, data) => {

                                if (!data) {
                                    return result({ msg: "There is a problem in creating a Repair Request. Pelase check the details." }, null);
                                }
                                rr.RRId = data.id;
                                var RRStatusHistoryObj = new RRStatusHistory({
                                    RRId: data.id,
                                    HistoryStatus: Constants.CONST_RRS_GENERATED
                                });
                                RRStatusHistoryObj.Created = rr.Created;
                                var RRNotificationObj = new NotificationModel({
                                    RRId: data.id,
                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                    NotificationIdentityId: data.id,
                                    NotificationIdentityNo: rr.RRNo,
                                    ShortDesc: 'RR Created',
                                    Description: 'RR Created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                });
                                RRNotificationObj.Created = rr.Created;
                                var RRSourcedStatusHistoryObj = new RRStatusHistory({
                                    RRId: rr.RRId,
                                    HistoryStatus: Constants.CONST_RRS_NEED_SOURCED
                                });
                                RRSourcedStatusHistoryObj.Created = rr.Created;

                                var RRSourcedNotificationObj = new NotificationModel({
                                    RRId: rr.RRId,
                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                    NotificationIdentityId: rr.RRId,
                                    NotificationIdentityNo: rr.RRNo,
                                    ShortDesc: 'RR Verified',
                                    Description: 'RR Verified by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                });
                                RRSourcedNotificationObj.Created = rr.Created;
                                var CustomerReferenceList = [];
                                if (rr.CustomerReference1 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference1; tempobj.ReferenceLabelName = 'Customer Reference 1';
                                    CustomerReferenceList.push(tempobj);
                                }

                                if (rr.CustomerReference2 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference2; tempobj.ReferenceLabelName = 'Customer Reference 2';
                                    CustomerReferenceList.push(tempobj);
                                }

                                if (rr.CustomerReference3 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference3; tempobj.ReferenceLabelName = 'Customer Reference 3';
                                    CustomerReferenceList.push(tempobj);
                                }

                                if (rr.CustomerReference4 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference4; tempobj.ReferenceLabelName = 'Customer Reference 4';
                                    CustomerReferenceList.push(tempobj);
                                }
                                if (rr.CustomerReference5 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference5; tempobj.ReferenceLabelName = 'Customer Reference 5';
                                    CustomerReferenceList.push(tempobj);
                                }
                                if (rr.CustomerReference6 != '') {
                                    var tempobj = {};
                                    tempobj.CReferenceId = 0; tempobj.ReferenceValue = rr.CustomerReference6; tempobj.ReferenceLabelName = 'Customer Reference 6';
                                    CustomerReferenceList.push(tempobj);
                                }
                                rr.CustomerReferenceList = CustomerReferenceList;
                                const RRVendorsObj = new RRVendorModel({
                                    MROId: 0,
                                    RRId: rr.RRId,
                                    VendorId: rr.VendorId,
                                    TaxPercent: rr.TaxPercent,
                                    SubTotal: rr.VendorQuoteGrandTotal,
                                    GrandTotal: rr.VendorCost,
                                    VendorRefNo: rr.VendorRefNo,
                                    RouteCause: rr.RouteCause,
                                    Shipping: rr.ShippingCost,
                                    Status: Constants.CONST_VENDOR_STATUS_APPROVED,
                                    LeadTime: rr.LeadTime,
                                    WarrantyPeriod: rr.WarrantyPeriod,
                                });
                                if (boolStatus2 == true)
                                    RRVendorsObj.Status = 0;

                                const CustomerPartObj = new CustomerPartmodel({
                                    PartId: rr.PartId,
                                    CustomerId: rr.CustomerId,
                                    NewPrice: rr.PartPON,
                                    LastPricePaid: 0,
                                });

                                const NoteObj = new RepairRequestNotes({
                                    RRId: rr.RRId,
                                    IdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                    IdentityId: rr.RRId,
                                    NotesType: 1,
                                    Notes: rr.Note,

                                });
                                async.parallel([
                                    function (result) {
                                        if (rr.CustomerReferenceList.length > 0) { CustomerReference.CreateCustomerReference(rr, result); }
                                        else { RR.emptyFunction(RRStatusHistoryObj, result); }
                                    },
                                    function (result) {
                                        if (rr.hasOwnProperty('RRParts')) { RRParts.CreateRRParts(rr.RRId, rr.RRParts, result); }
                                        else { RR.emptyFunction(RRStatusHistoryObj, result); }
                                    },
                                    function (result) { RRVendorModel.CreateRRVendors(RRVendorsObj, result); },
                                    function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
                                    function (result) { NotificationModel.Create(RRNotificationObj, result); },
                                    function (result) { con.query(RR.UpdateCustomerBillShipQuery(rr), result); },
                                    function (result) { con.query(TermsModel.GetDefaultTerm(), result) },
                                    function (result) { con.query(UserModel.listbyuserquery(Constants.CONST_IDENTITY_TYPE_CUSTOMER, CustomerId), result) },
                                    function (result) { con.query(RR.UpdateImportRRNo(rr), result); },
                                    function (result) { con.query(RR.UpdatePartPONQuery(rr), result); },
                                    function (result) { RRStatusHistory.Create(RRSourcedStatusHistoryObj, result); },
                                    function (result) { NotificationModel.Create(RRSourcedNotificationObj, result); },
                                    function (result) { CustomerPartmodel.create(CustomerPartObj, result); },
                                    function (result) {
                                        if (NoteObj.Notes != '') { RepairRequestNotes.create(NoteObj, result); }
                                        else { RR.emptyFunction(rr, result); }
                                    },
                                ],
                                    function (err, results) {
                                        if (err) { return result(err, null); }
                                        else {
                                            rr.RRVendorId = results[2].RRVendorId > 0 ? results[2].RRVendorId : 0;
                                            const RRVendorPartsObj = new RRVendorPartModel({
                                                RRVendorId: rr.RRVendorId,
                                                RRId: rr.RRId,
                                                PartId: rr.PartId,
                                                VendorId: VendorId,
                                                PartNo: rr.PartNo,
                                                Description: rr.Description,
                                                Quantity: rr.Quantity,
                                                Rate: rr.VendorQuoteGrandTotal / rr.Quantity,
                                                Price: rr.VendorQuoteGrandTotal,
                                                WarrantyPeriod: rr.WarrantyPeriod,
                                                LeadTime: rr.LeadTime,
                                            });

                                            const RRObj = new RR({
                                                RRId: rr.RRId,
                                                Status: Constants.CONST_RRS_AWAIT_VQUOTE
                                            });

                                            var RRStatusHistoryObj = new RRStatusHistory({
                                                RRId: rr.RRId,
                                                HistoryStatus: Constants.CONST_RRS_AWAIT_VQUOTE
                                            });
                                            RRStatusHistoryObj.Created = rr.Created;

                                            var NotificationObj = new NotificationModel({
                                                RRId: rr.RRId,
                                                NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                                NotificationIdentityId: rr.RRId,
                                                NotificationIdentityNo: rr.RRNo,
                                                ShortDesc: 'RR Needs To Be Sourced',
                                                Description: 'RR Needs To Be Sourced by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                            });
                                            NotificationObj.Created = rr.Created;
                                            if (results[6][0].length > 0) {
                                                rr.TermsId = results[6][0][0].TermsId;
                                            }
                                            if (results[7][0].length > 0) {
                                                rr.FirstName = results[7][0][0].FirstName;
                                                rr.LastName = results[7][0][0].LastName;
                                                rr.Email = results[7][0][0].Email;
                                            }

                                            rr.ShippingFee = rr.ShippingCost;
                                            rr.IdentityType = Constants.CONST_IDENTITY_TYPE_CUSTOMER; rr.IdentityId = CustomerId;

                                            var VendorQuoteobj = {}; var Quoteobj = {};
                                            Quoteobj = new QuotesModel(rr);
                                            Quoteobj.Status = 3;
                                            Quoteobj.TotalValue = rr.CustomerQuoteGrandTotal;
                                            Quoteobj.QuoteType = Constants.CONST_QUOTE_TYPE_REPAIR;
                                            VendorQuoteobj = new VendorQuote(rr);
                                            VendorQuoteobj.Status = 2;
                                            VendorQuoteobj.Shipping = rr.ShippingCost;
                                            VendorQuoteobj.SubTotal = rr.VendorQuoteGrandTotal;
                                            VendorQuoteobj.GrandTotal = rr.VendorCost;
                                            async.parallel([
                                                function (result) { RR.UpdateVendorOfRequestByRRId(rr, result); },
                                                function (result) { RRVendorPartModel.CreateRRVendorParts(RRVendorPartsObj, result); },
                                                function (result) { RR.ChangeRRStatus(RRObj, result); },
                                                function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
                                                function (result) { NotificationModel.Create(NotificationObj, result); },
                                                function (result) {
                                                    if (!boolStatus2) { QuotesModel.CreateQuotes(Quoteobj, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },
                                            ],
                                                function (err, results) {
                                                    if (err) { return result(err, null); }
                                                    else {

                                                        rr.QuoteId = results[5].id > 0 ? results[5].id : 0;
                                                        VendorQuoteobj.QuoteId = rr.QuoteId;


                                                        var CustomerLineItem = {}; var CustomerQuoteItem = [];
                                                        CustomerLineItem.PartId = rr.PartId;
                                                        CustomerLineItem.PartNo = rr.PartNo;
                                                        CustomerLineItem.PartDescription = rr.Description;
                                                        CustomerLineItem.Quantity = rr.Quantity;
                                                        CustomerLineItem.LeadTime = rr.LeadTime;
                                                        CustomerLineItem.PartNo = rr.PartNo;
                                                        CustomerLineItem.Rate = rr.CustomerQuoteGrandTotal / rr.Quantity;
                                                        CustomerLineItem.Price = CustomerLineItem.Quantity * CustomerLineItem.Rate;
                                                        CustomerLineItem.VendorId = rr.VendorId;
                                                        CustomerLineItem.RRId = rr.RRId;
                                                        CustomerLineItem.Description = rr.Description;
                                                        CustomerLineItem.VendorUnitPrice = rr.VendorQuoteGrandTotal;
                                                        CustomerLineItem.SerialNo = rr.SerialNo;
                                                        CustomerLineItem.WarrantyPeriod = rr.WarrantyPeriod;
                                                        CustomerQuoteItem.push(CustomerLineItem); rr.CustomerQuoteItem = CustomerQuoteItem;

                                                        //for invocie  
                                                        var CustomerLineItemInvoice = {}; var CustomerQuoteItemInvoice = [];
                                                        CustomerLineItemInvoice.PartId = rr.PartId;
                                                        CustomerLineItemInvoice.PartNo = rr.PartNo;
                                                        CustomerLineItemInvoice.PartDescription = rr.Description;
                                                        CustomerLineItemInvoice.Quantity = rr.Quantity;
                                                        CustomerLineItemInvoice.LeadTime = rr.LeadTime;
                                                        CustomerLineItemInvoice.PartNo = rr.PartNo;
                                                        CustomerLineItemInvoice.Rate = rr.InvoiceTotal / rr.Quantity;
                                                        CustomerLineItemInvoice.Price = CustomerLineItemInvoice.Quantity * CustomerLineItemInvoice.Rate;
                                                        CustomerLineItemInvoice.VendorId = rr.VendorId;
                                                        CustomerLineItemInvoice.RRId = rr.RRId;
                                                        CustomerLineItemInvoice.Description = rr.Description;
                                                        CustomerLineItemInvoice.VendorUnitPrice = rr.VendorQuoteGrandTotal;
                                                        CustomerLineItemInvoice.SerialNo = rr.SerialNo;
                                                        CustomerLineItemInvoice.WarrantyPeriod = rr.WarrantyPeriod;
                                                        CustomerQuoteItemInvoice.push(CustomerLineItemInvoice); rr.CustomerQuoteItemInvoice = CustomerQuoteItemInvoice;



                                                        var VLineItem = {}; var VQItem = [];
                                                        VLineItem.PartId = rr.PartId;
                                                        VLineItem.PartNo = rr.PartNo;
                                                        VLineItem.PartDescription = rr.Description;
                                                        VLineItem.Quantity = rr.Quantity;
                                                        VLineItem.LeadTime = rr.LeadTime;
                                                        VLineItem.PartNo = rr.PartNo;
                                                        VLineItem.Rate = rr.VendorQuoteGrandTotal / rr.Quantity;
                                                        VLineItem.Price = VLineItem.Quantity * VLineItem.Rate;
                                                        VLineItem.VendorId = rr.VendorId;
                                                        VLineItem.RRId = rr.RRId;
                                                        VLineItem.Description = rr.Description;
                                                        VLineItem.SerialNo = rr.SerialNo;
                                                        VLineItem.WarrantyPeriod = rr.WarrantyPeriod;
                                                        VQItem.push(VLineItem); rr.VQItem = VQItem;


                                                        //for vendor bill
                                                        var VQItemVendorBill = [];
                                                        var VLineItemVB = {}; var VQItemVendorBill = [];
                                                        VLineItemVB.PartId = rr.PartId;
                                                        VLineItemVB.PartNo = rr.PartNo;
                                                        VLineItemVB.PartDescription = rr.Description;
                                                        VLineItemVB.Quantity = rr.Quantity;
                                                        VLineItemVB.LeadTime = rr.LeadTime;
                                                        VLineItemVB.PartNo = rr.PartNo;
                                                        VLineItemVB.Rate = rr.VendorBillTotal / rr.Quantity;
                                                        VLineItemVB.Price = VLineItemVB.Quantity * VLineItemVB.Rate;
                                                        VLineItemVB.VendorId = rr.VendorId;
                                                        VLineItemVB.RRId = rr.RRId;
                                                        VLineItemVB.Description = rr.Description;
                                                        VLineItemVB.SerialNo = rr.SerialNo;
                                                        VLineItemVB.WarrantyPeriod = rr.WarrantyPeriod;
                                                        VQItemVendorBill.push(VLineItemVB); rr.VQItemVendorBill = VQItemVendorBill;



                                                        var NotificationObj = new NotificationModel({
                                                            RRId: rr.RRId,
                                                            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                            NotificationIdentityId: rr.QuoteId,
                                                            NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                            ShortDesc: 'Customer Quote Created',
                                                            Description: 'Customer Quote Created by Admin (' + global.authuser.FullName + ') on ' + rr.SubmittedDate
                                                        });
                                                        NotificationObj.Created = rr.Created;

                                                        async.parallel([
                                                            function (result) {
                                                                if (!boolStatus2) { QuotesItemModel.CreateQuoteItem(rr.QuoteId, rr.CustomerQuoteItem, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (!boolStatus2) { QuotesModel.UpdateQuotesCodeByQuoteId(rr, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (!boolStatus2) { con.query(Quotes.UpdateQuoteDate(rr.SubmittedDate, rr.QuoteId), result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (!boolStatus2) { VendorQuote.CreateVendorQuote(VendorQuoteobj, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                            function (result) {
                                                                if (!boolStatus2) { NotificationModel.Create(NotificationObj, result); }
                                                                else { RR.emptyFunction(rr, result); }
                                                            },
                                                        ],
                                                            function (err, results) {
                                                                if (err)
                                                                    return result(err, null);
                                                                else {

                                                                    var SubmitRRStatusHistoryObj = new RRStatusHistory({
                                                                        RRId: rr.RRId,
                                                                        HistoryStatus: Constants.CONST_RRS_QUOTE_SUBMITTED
                                                                    });
                                                                    SubmitRRStatusHistoryObj.Created = rr.Created;

                                                                    var _QuoteObj = {};
                                                                    _QuoteObj.RRId = rr.RRId;
                                                                    _QuoteObj.Status = Constants.CONST_RRS_QUOTE_SUBMITTED;

                                                                    var SubmitQuoteObj = new QuotesModel({
                                                                        RRId: rr.RRId,
                                                                        QuoteId: rr.QuoteId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_SUBMITTED,
                                                                        QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_SUBMITTED,
                                                                        SubmittedDate: rr.SubmittedDate,
                                                                    });

                                                                    var SubmitNotificationObj = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                                        NotificationIdentityId: rr.QuoteId,
                                                                        NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                                        ShortDesc: 'Customer Quote Submitted',
                                                                        Description: 'Customer Quote Submitted to Customer  by Admin (' + global.authuser.FullName + ') on ' + rr.SubmittedDate
                                                                    });
                                                                    SubmitNotificationObj.Created = rr.SubmittedDate;
                                                                    var VendorQuoteId = results[3].id > 0 ? results[3].id : 0;
                                                                    var ApproveQuoteObj = new QuotesModel({
                                                                        RRId: rr.RRId,
                                                                        QuoteId: rr.QuoteId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_APPROVED,
                                                                        QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_ACCEPTED
                                                                    });
                                                                    var ApproveQuoteObjQuoted = new QuotesModel({
                                                                        RRId: rr.RRId,
                                                                        QuoteId: rr.QuoteId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_QUOTED,
                                                                        ApprovedDate: rr.ApprovedDate,
                                                                    });

                                                                    var ApproveRRStatusHistoryObj = new RRStatusHistory({
                                                                        RRId: rr.RRId,
                                                                        HistoryStatus: Constants.CONST_RRS_IN_PROGRESS
                                                                    });
                                                                    ApproveRRStatusHistoryObj.Created = rr.Created;

                                                                    var ApproveNotificationObj = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                                        NotificationIdentityId: rr.QuoteId,
                                                                        NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                                        ShortDesc: 'Customer Quote Approved',
                                                                        Description: 'Customer Quote Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                    });
                                                                    ApproveNotificationObj.Created = rr.ApprovedDate;
                                                                    var NotificationObjForCustomerPO = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                                                        NotificationIdentityId: rr.RRId,
                                                                        NotificationIdentityNo: 'CustomerPO' + rr.RRId,
                                                                        ShortDesc: 'Customer PO Received',
                                                                        Description: 'Customer PO updated by  Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                    });
                                                                    NotificationObjForCustomerPO.Created = rr.ApprovedDate;
                                                                    rr.Status = Constants.CONST_RRS_IN_PROGRESS;

                                                                    var POObj = new PurchaseOrderModel(rr);
                                                                    POObj.POType = Constants.CONST_PO_TYPE_REPAIR;
                                                                    POObj.PONo = rr.PONo;
                                                                    POObj.DateRequested = POObj.Created = rr.ApprovedDate;
                                                                    POObj.DueDate = rr.SalesOrderRequiredDate;
                                                                    POObj.ShipAddressBookId = 666;
                                                                    POObj.BillAddressBookId = rr.CustomerBillToId;
                                                                    POObj.ShipAddressIdentityType = 2;
                                                                    POObj.SubTotal = rr.VendorQuoteGrandTotal;
                                                                    POObj.GrandTotal = rr.VendorCost;
                                                                    POObj.Status = Constants.CONST_PO_STATUS_APPROVED;

                                                                    var SOObj = new SOModel(rr);
                                                                    SOObj.SOType = Constants.CONST_SO_TYPE_REPAIR;
                                                                    SOObj.DateRequested = SOObj.Created = rr.ApprovedDate;
                                                                    SOObj.DueDate = rr.SalesOrderRequiredDate;
                                                                    SOObj.ReferenceNo = rr.VendorRefNo;
                                                                    SOObj.SONo = rr.SONo;
                                                                    SOObj.ShipAddressBookId = rr.CustomerShipToId;
                                                                    SOObj.BillAddressBookId = rr.CustomerBillToId;
                                                                    SOObj.SubTotal = rr.CustomerQuoteGrandTotal;
                                                                    SOObj.GrandTotal = rr.CustomerQuoteGrandTotal;
                                                                    SOObj.Status = Constants.CONST_SO_STATUS_APPROVED;
                                                                    SOObj.IsConvertedToPO = rr.PONo != '' ? 1 : 0;
                                                                    //  SOObj.GrandTotal = parseFloat(rr.Shipping) + parseFloat(rr.CustomerQuoteGrandTotal);
                                                                    SOObj.QuoteId = rr.QuoteId;

                                                                    var InvObj = new InvoiceModel(rr);
                                                                    InvObj.SOId = 0;
                                                                    InvObj.SONo = rr.SONo;
                                                                    InvObj.InvoiceNo = rr.InvoiceNo;
                                                                    InvObj.InvoiceType = Constants.CONST_INV_TYPE_REPAIR;
                                                                    InvObj.InvoiceDate = rr.InvoiceCreatedDate;
                                                                    InvObj.Created = rr.InvoiceCreatedDate;
                                                                    InvObj.DueDate = rr.InvoiceCreatedDate;
                                                                    InvObj.ShipAddressBookId = rr.CustomerShipToId;
                                                                    InvObj.BillAddressBookId = rr.CustomerBillToId;
                                                                    InvObj.SubTotal = rr.InvoiceTotal;
                                                                    InvObj.GrandTotal = rr.InvoiceTotal;
                                                                    InvObj.IsCSVProcessed = 1;
                                                                    //  InvObj.GrandTotal = parseFloat(rr.Shipping) + parseFloat(rr.CustomerQuoteGrandTotal);
                                                                    InvObj.Status = rr.InvoiceStatus == "Approved" ? Constants.CONST_INV_STATUS_APPROVED : CONST_INV_STATUS_OPEN;


                                                                    var VendorInvoiceObj = new VendorInvoiceModel(rr);
                                                                    VendorInvoiceObj.VendorInvoiceNo = rr.VendorInvoiceNo;
                                                                    VendorInvoiceObj.VendorInvoiceType = Constants.CONST_VINV_TYPE_REPAIR;
                                                                    VendorInvoiceObj.InvoiceDate = VendorInvoiceObj.Created = rr.CompletedDate;
                                                                    VendorInvoiceObj.DueDate = rr.CompletedDate;
                                                                    VendorInvoiceObj.CustomerInvoiceNo = rr.InvoiceNo;
                                                                    VendorInvoiceObj.CustomerInvoiceId = 0;
                                                                    VendorInvoiceObj.CustomerInvoiceAmount = rr.GrandTotal;
                                                                    VendorInvoiceObj.VendorInvNo = rr.VendorInvNo;
                                                                    // VendorInvoiceObj.SubTotal = rr.VendorQuoteGrandTotal;
                                                                    // VendorInvoiceObj.GrandTotal = rr.VendorCost;
                                                                    VendorInvoiceObj.SubTotal = rr.VendorBillTotal;
                                                                    VendorInvoiceObj.GrandTotal = rr.VendorBillTotal;
                                                                    VendorInvoiceObj.ReferenceNo = rr.VendorRefNo;
                                                                    VendorInvoiceObj.IsCSVProcessed = rr.VendorBillStatus == "Approved" ? 1 : 0;

                                                                    VendorInvoiceObj.Status = rr.VendorBillStatus == "Approved" ? Constants.CONST_VENDOR_INV_STATUS_APPROVED : Constants.CONST_VENDOR_INV_STATUS_OPEN;

                                                                    var QuoteRejectRRStatusHistoryObj = new RRStatusHistory({
                                                                        RRId: rr.RRId,
                                                                        HistoryStatus: Constants.CONST_RRS_QUOTE_REJECTED
                                                                    });
                                                                    QuoteRejectRRStatusHistoryObj.Created = rr.RejectedDate;

                                                                    var QuoteRejectObj = new Quotes({
                                                                        RRId: rr.RRId,
                                                                        Status: Constants.CONST_QUOTE_STATUS_CANCELLED,
                                                                        QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_REJECTED,
                                                                        QuoteRejectedType: 2,
                                                                        RRVendorId: rr.RRVendorId,
                                                                        QuoteId: rr.QuoteId
                                                                    });

                                                                    var RRRejectObj = new RR({
                                                                        RRId: rr.RRId,
                                                                        Status: Constants.CONST_RRS_QUOTE_REJECTED,
                                                                    });
                                                                    var QuoteRejectNotificationObj = new NotificationModel({
                                                                        RRId: rr.RRId,
                                                                        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                                                                        NotificationIdentityId: rr.QuoteId,
                                                                        NotificationIdentityNo: 'QT' + rr.QuoteId,
                                                                        ShortDesc: 'Customer Quote Rejected',
                                                                        Description: 'Admin (' + global.authuser.FullName + ') Rejected the Customer Quote on ' + rr.Created
                                                                    });
                                                                    QuoteRejectNotificationObj.Created = rr.RejectedDate;


                                                                    if (boolStatus4) {
                                                                        QuotesModel.ChangeRRStatusNew(_QuoteObj, (err, data) => {
                                                                            console.log(err);
                                                                        });
                                                                    }

                                                                    async.parallel([

                                                                        function (result) {
                                                                            if (boolStatus4) { QuotesModel.UpdateQuotesStatus(SubmitQuoteObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (!boolStatus2) { VendorQuoteItem.CreateVendorQuoteItem(VendorQuoteId, rr.QuoteId, rr.VQItem, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4) { RRStatusHistory.Create(SubmitRRStatusHistoryObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4) { QuotesModel.UpdateQuoteSubmittedDate(SubmitQuoteObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },


                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { RRStatusHistory.Create(QuoteRejectRRStatusHistoryObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },

                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { Quotes.UpdateQuotesRejectStatus(QuoteRejectObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },

                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { Quotes.ChangeRRStatusNew(RRRejectObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus6) { Quotes.RRVendorQuoteRejected(QuoteRejectObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },



                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5) { RRStatusHistory.Create(ApproveRRStatusHistoryObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5) { QuotesModel.UpdateQuoteApprovedDate(ApproveQuoteObjQuoted, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5) { NotificationModel.Create(NotificationObjForCustomerPO, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },


                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && rr.PONo != '') { PurchaseOrderModel.Create(POObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && rr.SONo != '') { SOModel.Create(SOObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { VendorInvoiceModel.Create(VendorInvoiceObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },
                                                                        function (result) {
                                                                            if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { InvoiceModel.Create(InvObj, result); }
                                                                            else { RR.emptyFunction(rr, result); }
                                                                        },

                                                                    ],
                                                                        function (err, results) {
                                                                            if (err) {
                                                                                return result(err, null);
                                                                            }
                                                                            else {

                                                                                POObj.POId = rr.POId = results[11].id > 0 ? results[11].id : 0;
                                                                                SOObj.SOId = rr.SOId = results[12].SOId > 0 ? results[12].SOId : 0;
                                                                                InvObj.InvoiceId = rr.InvoiceId = results[14].id > 0 ? results[14].id : 0;
                                                                                VendorInvoiceObj.VendorInvoiceId = rr.VendorInvoiceId = results[13].id > 0 ? results[13].id : 0;

                                                                                const VendorPONoObj = new RR({
                                                                                    RRId: rr.RRId,
                                                                                    VendorPONo: rr.PONo,
                                                                                    VendorPOId: rr.POId
                                                                                });
                                                                                var PONotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_PO,
                                                                                    NotificationIdentityId: rr.POId,
                                                                                    NotificationIdentityNo: rr.PONo,
                                                                                    ShortDesc: 'Vendor PO Draft Created',
                                                                                    Description: 'Vendor PO Draft created by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                });
                                                                                PONotificationObj.Created = rr.ApprovedDate;
                                                                                const srr = new RR({
                                                                                    RRId: rr.RRId, CustomerSONo: rr.SONo, CustomerSOId: rr.SOId
                                                                                });
                                                                                var SONotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                                                                                    NotificationIdentityId: rr.SOId,
                                                                                    NotificationIdentityNo: rr.SONo,
                                                                                    ShortDesc: 'Customer SO Draft Created',
                                                                                    Description: 'Customer SO Draft created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                                                                });
                                                                                SONotificationObj.Created = rr.ApprovedDate;
                                                                                const _srr = new RR({
                                                                                    RRId: rr.RRId, CustomerInvoiceNo: rr.InvoiceNo, CustomerInvoiceId: rr.InvoiceId
                                                                                });
                                                                                var InvoiceNotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
                                                                                    NotificationIdentityId: rr.InvoiceId,
                                                                                    NotificationIdentityNo: rr.InvoiceNo,
                                                                                    ShortDesc: 'Customer Invoice Draft Created',
                                                                                    Description: 'Customer Invoice Draft created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                                                                });
                                                                                InvoiceNotificationObj.Created = rr.ApprovedDate;

                                                                                const venInv = new RR({
                                                                                    RRId: rr.RRId, VendorInvoiceNo: rr.VendorInvoiceNo, VendorInvoiceId: rr.VendorInvoiceId
                                                                                });

                                                                                rr.VQItem[0].POId = rr.POId ? rr.POId : 0;
                                                                                rr.VQItem[0].PONo = rr.PONo ? rr.PONo : 0;

                                                                                var VendorInvoiceNotificationObj = new NotificationModel({
                                                                                    RRId: rr.RRId,
                                                                                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_VENDOR_INVOICE,
                                                                                    NotificationIdentityId: rr.VendorInvoiceId,
                                                                                    NotificationIdentityNo: rr.VendorInvoiceNo,
                                                                                    ShortDesc: 'Vendor Bill draft created',
                                                                                    Description: 'Vendor Bill draft created by Admin (' + global.authuser.FullName + ') on ' + rr.Created
                                                                                });
                                                                                VendorInvoiceNotificationObj.Created = rr.ApprovedDate;

                                                                                const CompletedRRObj = new RR({
                                                                                    RRId: rr.RRId,
                                                                                    Status: Constants.CONST_RRS_COMPLETED
                                                                                });

                                                                                var CompletedRRStatusHistoryObj = new RRStatusHistory({
                                                                                    RRId: rr.RRId,
                                                                                    HistoryStatus: Constants.CONST_RRS_COMPLETED
                                                                                });
                                                                                CompletedRRStatusHistoryObj.Created = rr.ApprovedDate;

                                                                                async.parallel([
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5) { QuotesModel.UpdateQuotesStatus(ApproveQuoteObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5) { QuotesModel.ChangeRRStatusWithPo(rr, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },


                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.PONo != '') { PurchaseOrderItemModel.AutoCreatePurchaseOrderItem(rr.POId, rr.VQItem, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.PONo != '') { PurchaseOrderModel.ApprovePO(POObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.PONo != '') { con.query(RR.UpdateVendorPONoByImportedRRID(VendorPONoObj, POObj.DueDate, rr.LeadTime), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },



                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.SONo != '') { SOItemModel.Create(rr.SOId, rr.CustomerQuoteItem, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.SONo != '') { con.query(RR.UpdateCustomerSONoByImportedRRID(srr, SOObj.DueDate, rr.LeadTime), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },

                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.SONo != '') { SOModel.ApproveSO(SOObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },



                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { VendorInvoiceItemModel.Create(rr.VendorInvoiceId, rr.VQItemVendorBill, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    /*function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { NotificationModel.Create(VendorInvoiceNotificationObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },*/
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { con.query(RR.UpdateVendorInvoiceNoByImportedRRID(venInv, rr.LeadTime, VendorInvoiceObj.DueDate), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { con.query(VendorInvoiceItemModel.UpdateIsAddedToVendorBillByPO(rr.POId), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') { VendorInvoiceModel.ApproveVendorInvoice(VendorInvoiceObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },




                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { InvoiceItemModel.Create(rr.InvoiceId, rr.CustomerQuoteItemInvoice, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { con.query(RR.UpdateCustomerInvoiceNoByImportedRRID(_srr, InvObj.DueDate, rr.LeadTime), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { con.query(InvoiceModel.UpdateSOIdByInvoiceId(rr.SOId, rr.InvoiceId), result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') { InvoiceModel.ApproveInvoice(InvObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },

                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7) { RRStatusHistory.Create(CompletedRRStatusHistoryObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },
                                                                                    function (result) {
                                                                                        if (boolStatus4 && boolStatus5 && boolStatus7) { RR.ChangeRRStatus(CompletedRRObj, result); }
                                                                                        else { RR.emptyFunction(rr, result); }
                                                                                    },




                                                                                ],
                                                                                    function (err, results) {
                                                                                        if (err) {
                                                                                            return result(err, null);
                                                                                        }
                                                                                        else {

                                                                                            /* var SOApproveNotificationObj = new NotificationModel({
                                                                                                 RRId: rr.SOId,
                                                                                                 NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                                                                                                 NotificationIdentityId: rr.SOId,
                                                                                                 NotificationIdentityNo: rr.SONo,
                                                                                                 ShortDesc: 'Customer SO Approved',
                                                                                                 Description: 'Customer SO Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                             });
                                                                                             SOApproveNotificationObj.Created = rr.ApprovedDate;
 
                                                                                             if (boolStatus4 && boolStatus5 && rr.SONo != '') {
                                                                                                 NotificationModel.Create(SOApproveNotificationObj, (err, data1) => {
                                                                                                 });
                                                                                             }
                                                                                             var POApproveNotificationObj = new NotificationModel({
                                                                                                 RRId: rr.POId,
                                                                                                 NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_PO,
                                                                                                 NotificationIdentityId: rr.POId,
                                                                                                 NotificationIdentityNo: rr.PONo,
                                                                                                 ShortDesc: 'Vendor PO Approved',
                                                                                                 Description: 'Vendor PO Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                             });
                                                                                             POApproveNotificationObj.Created = rr.ApprovedDate;
                                                                                             if (boolStatus4 && boolStatus5 && rr.PONo != '') {
                                                                                                 NotificationModel.Create(POApproveNotificationObj, (err, data1) => {
                                                                                                 });
                                                                                             }
                                                                                             var VINotificationObj = new NotificationModel({
                                                                                                 RRId: rr.VendorInvoiceId,
                                                                                                 NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_VENDOR_INVOICE,
                                                                                                 NotificationIdentityId: rr.VendorInvoiceId,
                                                                                                 NotificationIdentityNo: rr.VendorInvoiceNo,
                                                                                                 ShortDesc: 'Vendor bill Approved',
                                                                                                 Description: 'Vendor bill approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                             });
                                                                                             VINotificationObj.Created = rr.ApprovedDate;
                                                                                             if (boolStatus4 && boolStatus5 && rr.VendorInvoiceNo != '') {
                                                                                                 NotificationModel.Create(VINotificationObj, (err, data1) => {
                                                                                                 });
                                                                                             }
                                                                                             var InvoiceApproveNotificationObj = new NotificationModel({
                                                                                                 RRId: rr.InvoiceId,
                                                                                                 NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
                                                                                                 NotificationIdentityId: rr.InvoiceId,
                                                                                                 NotificationIdentityNo: rr.InvoiceNo,
                                                                                                 ShortDesc: 'Customer Invoice Approved',
                                                                                                 Description: 'Customer Invoice Approved by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                             });
                                                                                             InvoiceApproveNotificationObj.Created = rr.ApprovedDate;
                                                                                             if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') {
                                                                                                 NotificationModel.Create(InvoiceApproveNotificationObj, (err, data1) => {
                                                                                                 });
                                                                                             }
                                                                                             var CompletedNotificationObj = new NotificationModel({
                                                                                                 RRId: rr.RRId,
                                                                                                 NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                                                                                                 NotificationIdentityId: rr.RRId,
                                                                                                 NotificationIdentityNo: rr.RRNo,
                                                                                                 ShortDesc: 'RR Completed',
                                                                                                 Description: 'RR Completed  by Admin (' + global.authuser.FullName + ') on ' + rr.ApprovedDate
                                                                                             });
                                                                                             CompletedNotificationObj.Created = rr.ApprovedDate;
                                                                                             if (boolStatus4 && boolStatus5 && boolStatus7 && rr.InvoiceNo != '') {
                                                                                                 NotificationModel.Create(CompletedNotificationObj, (err, data1) => {
                                                                                                 });
                                                                                             }
                                                                                             */
                                                                                            return result(null, rr)
                                                                                        }
                                                                                    })
                                                                            }
                                                                        });
                                                                }
                                                            });
                                                    }
                                                });
                                        }
                                    });
                            });
                        }
                    });
            }
        });
};




function getVendorTypeId(vendorType) {
    let _vedorType = VendorTypes.find(a => a.type.toLowerCase() == vendorType.toLowerCase());
    return _vedorType ? _vedorType.id : "";
}

function getCompanyTypeId(companyType) {
    let _companyType = CompanyTypes.find(a => a.type.toLowerCase() == companyType.toLowerCase())
    return _companyType ? _companyType.id : "";
}

function getTaxTypeId(taxType) {
    let _taxType = TaxTypes.find(a => a.type.toLowerCase() == taxType.toLowerCase());
    return _taxType ? _taxType.id : "";
}

VendorImport.mapArray = (arrVendor) => {
    return arrVendor.map(a => new VendorImport(a));
}

const VendorTypes = [
    {
        id: "V",
        type: "Vendor"
    },
    {
        id: "M",
        type: "Manufacturer"
    },
    {
        id: "B",
        type: "Both"
    }
]

const CompanyTypes = [
    {
        id: "1",
        type: "Company"
    },
    {
        id: "2",
        type: "Personal"
    }
]

const TaxTypes = [
    {
        id: "1",
        type: "Taxable"
    },
    {
        id: "2",
        type: "Rolling Stack"
    },
    {
        id: "3",
        type: "Reseller/Non Taxable"
    }
]

module.exports = {
    VendorImport,
    CustomerImport,
    PartImport,
    RRImport, PartsModel, ImportCustomerPONo
}
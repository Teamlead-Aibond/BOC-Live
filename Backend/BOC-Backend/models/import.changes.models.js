/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var async = require('async');
const RR = require("../models/repair.request.model.js");
const Constants = require("../config/constants.js");
const AddessBook = require("../models/customeraddress.model.js");
const MROModel = require("../models/mro.model.js");
const QuotesItemModel = require("../models/quote.item.model.js");
const QuotesModel = require("../models/quotes.model.js");
const SOModel = require("../models/sales.order.model.js");
const SOItemModel = require("../models/sales.order.item.model");
const SalesOrder = require("../models/sales.order.model.js");


const ImportChanges = function FuncName(obj) {

    this.RRNo = obj["Repair Request #"] ? obj["Repair Request #"].trim() : '';
    this.StatusName = obj["Status"] ? obj["Status"] : '';
    this.CustomerPONo = obj["Customer PO"] ? obj["Customer PO"] : '';
    this.PONo = obj["Vendor PO No"] ? obj["Vendor PO No"] : '';
    this.SONo = obj["Sales Order No"] ? obj["Sales Order No"] : '';
    this.InvoiceNo = obj["Invoice No"] ? obj["Invoice No"] : '';
    this.CustomerQuoteGrandTotal = obj["Repair Price"] ? obj["Repair Price"] : 0;
    this.PartPON = obj["Price Of New"] ? obj["Price Of New"] : 0;
    this.VendorQuoteGrandTotal = obj["Cost"] ? obj["Cost"] : 0;
    this.Created = obj["AH Received Date"] ? obj["AH Received Date"] : '';
    this.SubmittedDate = obj["Quote Submitted Date"] ? obj["Quote Submitted Date"] : '';
    this.ApprovedDate = obj["Approved Date (PO Receipt Date)"] ? obj["Approved Date (PO Receipt Date)"] : '';
    this.SalesOrderRequiredDate = obj["Sales Order Due Date"] ? obj["Sales Order Due Date"] : '';
    this.RejectedDate = obj["Rejected Date"] ? obj["Rejected Date"] : '';
    this.CompletedDate = obj["Completed Date"] ? obj["Completed Date"] : '';
    this.InvoiceCreatedDate = obj["Invoice Created Date"] ? obj["Invoice Created Date"] : '';
    this.InvoiceTotal = obj["Invoice Total"] ? obj["Invoice Total"] : 0;
    this.VendorBillTotal = obj[" Vendor Bill Total"] ? obj[" Vendor Bill Total"] : 0;
    this.VendorInvoiceNo = obj["Vendor Bill#"] ? obj["Vendor Bill#"] : '';
};


ImportChanges.RRDateBulkUpdate = (JSON, result) => {

    let rr = new ImportChanges(JSON);
    let RRcheckquery = `SELECT RRId, RRNo FROM tbl_repair_request WHERE IsDeleted = 0 AND RRNo = '${rr.RRNo}'`;
    con.query(RRcheckquery, (err, res) => {
        if (err) {
            return result(err, null);
        }
        if (res.length <= 0) {
            return result(err, null);
        } else {

            if (rr.Created) {
                var date_arr3 = rr.Created.split('/');
                rr.Created = date_arr3[2] + "-" + date_arr3[0] + "-" + date_arr3[1];
            }


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
            let RRId = res[0].RRId;

            let update1 = `UPDATE tbl_repair_request SET RRCompletedDate = '${rr.CompletedDate}' WHERE Status = 7 AND RRId = ${RRId} AND IsDeleted = 0 AND RRCompletedDate= '${rr.ApprovedDate}'`;
            let update2 = `UPDATE tbl_repair_request_status_history SET Created = '${rr.SubmittedDate} 00:00:00' WHERE HistoryStatus = 4 AND RRId = ${RRId} AND IsDeleted = 0 AND DATE(Created)= '${rr.Created}'`;
            let update3 = `UPDATE tbl_repair_request_status_history SET Created = '${rr.ApprovedDate} 00:00:00' WHERE HistoryStatus = 5 AND RRId = ${RRId} AND IsDeleted = 0 AND DATE(Created)= '${rr.Created}'`;
            let update4 = `UPDATE tbl_repair_request_status_history SET Created = '${rr.CompletedDate} 00:00:00' WHERE HistoryStatus = 7 AND RRId = ${RRId} AND IsDeleted = 0 AND DATE(Created)= '${rr.ApprovedDate}'`;

            //console.log(update1 + update2 + update3 + update4)

            async.parallel([

                function (result) {
                    con.query(update1, result);
                },
                function (result) {
                    con.query(update2, result);
                },
                function (result) {
                    con.query(update3, result);
                },
                function (result) {
                    con.query(update4, result);
                }
            ],
                function (err, results) {
                    if (err) {
                        return result(null, null);
                    }
                    return result(null, null);
                })

        }
    })
}



const NonSOImport = function FuncName(obj) {

    this.QuoteNo = obj["EQ#"] ? obj["EQ#"].trim() : '';
    this.PartNo = obj["PartNo"] ? obj["PartNo"].trim() : '';
    this.PONo = obj["PONo"] ? obj["PONo"] : '';
    this.SONo = obj["SO#"] ? obj["SO#"] : '';
    this.CompanyName = obj["Customer"] ? obj["Customer"] : '';
    this.POGrandTotal = obj["PO GrandTotal"] ? obj["PO GrandTotal"] : '';

};


NonSOImport.CreateQTSOForPO = (RRJson, result) => {

    let rr = new NonSOImport(RRJson);
    let CustomerQuery = `SELECT FirstName,LastName,Email,CustomerId,'-' test FROM tbl_customers WHERE IsDeleted=0 and CompanyName= '${rr.CompanyName}'`;
    let POQuery = `SELECT DATE_FORMAT(PO.Created,'%Y-%m-%d') as CreatedDate, PO.POId,PO.VendorId,DATE_FORMAT(PO.DateRequested,'%Y-%m-%d') as DateRequested,DATE_FORMAT(PO.Created,'%Y-%m-%d') as Created, POI.POItemId,POI.PartId,POI.PartNo,POI.Description,POI.LeadTime,POI.Quantity,POI.WarrantyPeriod,POI.BaseRate,POI.BaseTax FROM tbl_po as PO
    LEFt JOIN tbl_po_item as POI ON POI.POId = PO.POId AND POI.IsDeleted = 0
    WHERE PO.IsDeleted=0 and PO.PONo= '${rr.PONo}';`
    let QuoteQuery = `SELECT QuoteId,'-' test FROM tbl_quotes WHERE IsDeleted=0 and QuoteNo= '${rr.QuoteNo}'; `

    async.parallel([
        function (result) { con.query(CustomerQuery, result); },
        function (result) { con.query(POQuery, result); },
        function (result) { con.query(MROModel.SelectSettingsInfo(), result); },
        function (result) { con.query(QuoteQuery, result); },
    ],
        function (err, results) {
            if (err) {
                return result(err, null);
            }
            else if (results[3][0].length > 0) {
                return result({ msg: "Already Record Exist" }, null);
            } else if (!results[0][0][0] || !results[0][0][0].CustomerId) {
                return result({ msg: "Customer not available : " + rr.CompanyName }, null);
            } else {
                let PartId = 0; let VendorId = 0; let CustomerId = 0;
                PartId = results[1][0][0] ? results[1][0][0].PartId : 0;
                CustomerId = results[0][0][0] ? results[0][0][0].CustomerId : 0;
                rr.TaxPercent = 0;
                rr.CustomerId = CustomerId;
                rr.MROId = 0;
                rr.RRId = 0;
                rr.TermsId = 4;


                var POInfo = results[1][0][0];
                rr.POId = POInfo.POId;
                rr.POItemId = POInfo.POItemId;
                var Quoteobj = {};
                rr.CustomerId = CustomerId;
                rr.VendorId = VendorId;
                rr.PartId = PartId;
                Quoteobj = new QuotesModel(rr);
                Quoteobj.FirstName = results[0][0][0].FirstName;
                Quoteobj.LastName = results[0][0][0].LastName;
                Quoteobj.Email = results[0][0][0].Email;

                async.parallel([
                    function (result) { con.query(AddessBook.GetBillingAddressIdByCustomerId(CustomerId), result); },
                    function (result) { con.query(AddessBook.GetShippingAddressIdByCustomerId(CustomerId), result); }
                ],
                    function (err, results) {
                        if (err) {
                            return result(err, null);
                        }
                        else {
                            if (results[0][0].length > 0) {
                                rr.CustomerBillToId = results[0][0][0].AddressId;
                            }
                            if (results[1][0].length > 0) {
                                rr.CustomerShipToId = results[1][0][0].AddressId;
                            }


                            Quoteobj.Status = Constants.CONST_QUOTE_STATUS_APPROVED;
                            Quoteobj.QuoteNo = rr.QuoteNo;
                            Quoteobj.SubmittedDate = POInfo.DateRequested;
                            Quoteobj.ApprovedDate = POInfo.DateRequested;
                            Quoteobj.IdentityId = Quoteobj.CustomerId = rr.CustomerId;
                            Quoteobj.TotalValue = 0;
                            Quoteobj.QuoteCustomerStatus = Constants.CONST_CUSTOMER_QUOTE_ACCEPTED;
                            Quoteobj.MROId = 0;
                            Quoteobj.QuoteType = Constants.CONST_QUOTE_TYPE_REGULAR;
                            Quoteobj.Created = POInfo.CreatedDate;
                            Quoteobj.CustomerShipToId = rr.CustomerShipToId;
                            Quoteobj.CustomerBillToId = rr.CustomerBillToId;

                            var CustomerLineItem = {}; var CustomerQuoteItem = [];
                            CustomerLineItem.PartId = POInfo.PartId;
                            CustomerLineItem.PartNo = POInfo.PartNo;
                            CustomerLineItem.PartDescription = POInfo.Description;
                            CustomerLineItem.Quantity = POInfo.Quantity;
                            CustomerLineItem.LeadTime = POInfo.LeadTime;
                            CustomerLineItem.PartNo = POInfo.PartNo;
                            CustomerLineItem.Rate = 0;
                            CustomerLineItem.Price = 0;
                            CustomerLineItem.VendorId = POInfo.VendorId;
                            CustomerLineItem.RRId = 0;
                            CustomerLineItem.Description = POInfo.Description;
                            CustomerLineItem.VendorUnitPrice = rr.POGrandTotal;
                            CustomerLineItem.SerialNo = '';
                            CustomerLineItem.WarrantyPeriod = POInfo.WarrantyPeriod;
                            CustomerLineItem.POItemId = POInfo.POItemId;
                            CustomerLineItem.Created = POInfo.CreatedDate;
                            CustomerQuoteItem.push(CustomerLineItem); rr.CustomerQuoteItem = CustomerQuoteItem;


                            var SOObj = new SOModel(rr);
                            SOObj.SOType = Constants.CONST_SO_TYPE_REGULAR;
                            SOObj.DateRequested = POInfo.DateRequested;
                            SOObj.DueDate = POInfo.DateRequested;
                            SOObj.ReferenceNo = '';
                            SOObj.SONo = rr.SONo;
                            SOObj.POId = POInfo.POId;
                            SOObj.ShipAddressBookId = rr.CustomerShipToId;
                            SOObj.BillAddressBookId = rr.CustomerBillToId;
                            SOObj.SubTotal = 0;
                            SOObj.GrandTotal = 0;
                            SOObj.Status = Constants.CONST_SO_STATUS_APPROVED;
                            SOObj.IsConvertedToPO = rr.PONo != '' ? 1 : 0;
                            SOObj.QuoteId = rr.QuoteId;
                            SOObj.Created = POInfo.CreatedDate;


                            QuotesModel.CreateQuotes(Quoteobj, (err, data) => {

                                if (!data) {
                                    return result({ msg: "There is a problem in creating a Quote. Pelase check the details." }, null);
                                }
                                rr.QuoteId = data.id > 0 ? data.id : 0;
                                CustomerLineItem.QuoteId = rr.QuoteId;

                                async.parallel([
                                    function (result) {
                                        if (rr.SONo != '') { SOModel.Create(SOObj, result); }
                                        else { RR.emptyFunction(rr, result); }
                                    },
                                    function (result) {
                                        QuotesItemModel.CreateQuoteItem(rr.QuoteId, rr.CustomerQuoteItem, result);
                                    },

                                ],
                                    function (err, results) {
                                        if (err) { return result(err, null); }

                                        else {

                                            SOObj.SOId = rr.SOId = results[0].SOId > 0 ? results[0].SOId : 0;
                                            CustomerQuoteItem.QuoteItemId = rr.QuoteItemId = results[1].id > 0 ? results[1].id : 0;

                                            async.parallel([

                                                function (result) {
                                                    if (rr.SOId && rr.SONo != '') { SOItemModel.Create(rr.SOId, rr.CustomerQuoteItem, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },

                                                function (result) {
                                                    if (rr.POId && rr.SOId) { SalesOrder.LinkSOPOUpdateQuery(rr, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                },

                                                function (result) {
                                                    if (rr.SOId && rr.SONo != '') { SOModel.ApproveSO(SOObj, result); }
                                                    else { RR.emptyFunction(rr, result); }
                                                }


                                            ],
                                                function (err, results) {
                                                    if (err) {
                                                        return result(err, null);
                                                    } else {
                                                        rr.SOItemId = results[0].id > 0 ? results[0].id : 0;
                                                        async.parallel([

                                                            function (result) {
                                                                if (rr.POItemId && rr.SOItemId != '') { SalesOrder.LinkSOPOLineItemUpdateQuery(rr, result); }
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




module.exports = {
    ImportChanges, NonSOImport
}
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const MROModel = require("../models/mro.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const UserModel = require("../models/users.model.js");
const TermsModel = require("../models/terms.model.js");
const CustomerModel = require("../models/customers.model.js");
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");
var async = require('async');
var cDateTime = require("../utils/generic.js");
const NotificationModel = require("../models/notification.model.js");
const QuotesItemModel = require("../models/quote.item.model.js");
const QuotesModel = require("../models/quotes.model.js");
const CustomerReference = require("../models/cutomer.reference.labels.model.js");
const RRStatusHistory = require("../models/rr.status.history.model.js");
const RRModel = require("../models/repair.request.model.js");
const RRVendorModel = require("../models/repair.request.vendors.model.js");
const MROVendorModel = require("../models/mro.vendor.js");
const RRVendorPartModel = require("../models/repair.request.vendor.parts.model.js");
const SalesOrderModel = require("../models/sales.order.model.js");
const PurchaseOrderModel = require("../models/purchase.order.model.js");
const InvoiceOrderModel = require("../models/invoice.model.js");
const VendorQuote = require("../models/vendor.quote.model.js");
const VendorQuoteItem = require("../models/vendor.quote.item.model.js");
const MROStatusHistory = require("../models/mro.status.history.model.js");
const QuoteItem = require("../models/quote.item.model.js");
const AddressBook = require("../models/customeraddress.model.js");
const PurchaseOrderItem = require("../models/purchase.order.item.model.js");
const RR = require("../models/repair.request.model.js");
// exports.createMRO = (req, res) => {
//     var boolean = Reqresponse.validateReqBody(req, res);
//     if (boolean) {
//         MROModel.CreateMRO(req.body, (err, data) => {
//             if (!data) {
//                 return Reqresponse.printResponse(res, { msg: "There is a problem in creating a MRO. Pelase check the details." }, null);
//             }
//             if (req.body.GrandTotal > 0) {

//                 req.body.MROId = data.id;

//                 var sqlGetStatus = MROModel.SelectMROStatusWithSettings(req.body.MROId);
//                 con.query(sqlGetStatus, (err, Objres) => {
//                     if (err) {
//                         Reqresponse.printResponse(res, err, null);
//                     }
//                     if (Objres.length <= 0) {
//                         return Reqresponse.printResponse(res, { msg: "MRO Not found" }, null);
//                     }
//                     req.body.MROStatus = Objres[0].Status;
//                     let TaxPercent = Objres[0].TaxPercent ? Objres[0].TaxPercent : 0;
//                     let VendorId = req.body.VendorId = Objres[0].AHGroupVendor;

//                     const RRVendorsObj = new RRVendorModel({
//                         MROId: req.body.MROId,
//                         RRId: 0,
//                         VendorId: VendorId,
//                         TaxPercent: TaxPercent,
//                         SubTotal: 0,
//                         GrandTotal: 0
//                     });
//                     RRVendorModel.CreateRRVendors(RRVendorsObj, (err, data1) => {
//                         if (err) { return result(err, null); }
//                         if (!data1) {
//                             return Reqresponse.printResponse(res, { msg: "There is a problem in assigning a vendor." }, null);
//                         }
//                         req.body.RRVendorId = data1.RRVendorId;
//                         const MROObj = new MROModel({
//                             MROId: req.body.MROId,
//                             Status: Constants.CONST_MROS_AWAIT_VQUOTE
//                         });
//                         async.parallel([
//                             function (result) { MROModel.UpdateVendorOfRequestByMROId(req.body, result); },
//                             function (result) { MROModel.ChangeMROStatus(MROObj, result); },
//                         ],
//                             function (err, results) {
//                                 if (err) { Reqresponse.printResponse(res, err, null); }
//                                 else {

//                                     if (req.body.QuoteItem.length > 0) {
//                                         var MROVendorParts = req.body.QuoteItem;
//                                         for (let obj of MROVendorParts) {
//                                             obj.Description = obj.PartDescription;
//                                             var val = new RRVendorPartModel(obj);
//                                             val.MROId = req.body.MROId;
//                                             val.RRVendorId = val.VendorId = req.body.RRVendorId;
//                                             val.Rate = val.Price = 0;
//                                             RRVendorPartModel.CreateRRVendorParts(val, (err, data2) => {
//                                                 if (err)
//                                                     Reqresponse.printResponse(res, err, null);
//                                             });
//                                         }
//                                     }

//                                     var GetDefaultTerm = TermsModel.GetDefaultTerm();
//                                     var listbyuserquery = UserModel.listbyuserquery(Constants.CONST_IDENTITY_TYPE_CUSTOMER, req.body.CustomerId)
//                                     var Cusviewquery = CustomerModel.viewquery(req.body.CustomerId,req.body)
//                                     async.parallel([

//                                         function (result) { con.query(GetDefaultTerm, result) },
//                                         function (result) { con.query(listbyuserquery, result) },
//                                         function (result) { con.query(Cusviewquery, result) },

//                                     ],
//                                         function (err, results) {
//                                             if (err)
//                                                 Reqresponse.printResponse(res, err, null);
//                                             else {

//                                                 if (results[0][0].length > 0) {
//                                                     req.body.TermsId = results[0][0][0].TermsId;
//                                                 }
//                                                 if (results[1][0].length > 0) {
//                                                     req.body.FirstName = results[1][0][0].FirstName;
//                                                     req.body.LastName = results[1][0][0].LastName;
//                                                     req.body.Email = results[1][0][0].Email;
//                                                 }
//                                                 if (results[2][0].length > 0) {
//                                                     req.body.CompanyName = results[2][0][0].CompanyName;
//                                                 }

//                                                 var VendorQuoteobj = {}; var Quoteobj = {};
//                                                 Quoteobj = new QuotesModel(req.body);
//                                                 Quoteobj.VendorId = VendorId;
//                                                 VendorQuoteobj = new VendorQuote(req.body);
//                                                 VendorQuoteobj.VendorId = VendorId; VendorQuoteobj.SubTotal = 0;
//                                                 VendorQuoteobj.AdditionalCharge = 0; VendorQuoteobj.TaxPercent = 0;
//                                                 VendorQuoteobj.TotalTax = 0; VendorQuoteobj.Discount = 0; VendorQuoteobj.Shipping = 0; VendorQuoteobj.GrandTotal = 0;

//                                                 async.parallel([
//                                                     function (result) { if (Quoteobj.GrandTotal > 0) { QuotesModel.CreateQuotes(Quoteobj, result); } else { RRModel.emptyFunction(req.body, result); } },
//                                                     function (result) { MROModel.UpdateMRONo(req.body.MROId, result); },

//                                                 ],
//                                                     function (err, results) {
//                                                         if (err)
//                                                             Reqresponse.printResponse(res, err, null);
//                                                         else {
//                                                             if (results[0].id > 0) {
//                                                                 req.body.QuoteId = results[0].id;
//                                                             }
//                                                             VendorQuoteobj.QuoteId = req.body.QuoteId;
//                                                             async.parallel([
//                                                                 function (result) { if (req.body.GrandTotal > 0) { QuotesItemModel.CreateQuoteItem(req.body.QuoteId, req.body.QuoteItem, result) } else { RRModel.emptyFunction(req.body, result); } },
//                                                                 function (result) { if (req.body.GrandTotal > 0) { QuotesModel.UpdateQuotesCodeByQuoteId(req.body, result); } else { RRModel.emptyFunction(req.body, result); } },
//                                                                 function (result) { if (req.body.GrandTotal > 0) { VendorQuote.CreateVendorQuote(VendorQuoteobj, result); } else { RRModel.emptyFunction(req.body, result); } },
//                                                             ],
//                                                                 function (err, results) {
//                                                                     if (err)
//                                                                         Reqresponse.printResponse(res, err, null);
//                                                                     else {
//                                                                         var VendorQuoteId = 0;
//                                                                         if (results[2].id > 0) {
//                                                                             VendorQuoteId = results[2].id;
//                                                                         }
//                                                                         for (let obj of req.body.QuoteItem) {
//                                                                             obj.Description = obj.PartDescription, obj.VendorId = VendorId; obj.Rate = 0, obj.Price = 0;
//                                                                         }

//                                                                         async.parallel([
//                                                                             function (result) { if (req.body.GrandTotal > 0) { VendorQuoteItem.CreateVendorQuoteItem(VendorQuoteId, req.body.QuoteId, req.body.QuoteItem, result); } else { RRModel.emptyFunction(req.body, result); } },
//                                                                         ],
//                                                                             function (err, results) {
//                                                                                 if (err) { Reqresponse.printResponse(res, err, null); }
//                                                                                 else {
//                                                                                     Reqresponse.printResponse(res, err, { data: req.body.MROId });
//                                                                                 }
//                                                                             });
//                                                                     }
//                                                                 });
//                                                         }
//                                                     });
//                                             }
//                                         });
//                                 }
//                             });
//                     });
//                 });
//             }
//             else {
//                 req.body.MROId = data.id;
//                 var GetDefaultTerm = TermsModel.GetDefaultTerm();
//                 var listbyuserquery = UserModel.listbyuserquery(Constants.CONST_IDENTITY_TYPE_CUSTOMER, req.body.CustomerId)
//                 var Cusviewquery = CustomerModel.viewquery(req.body.CustomerId,req.body)
//                 async.parallel([

//                     function (result) { con.query(GetDefaultTerm, result) },
//                     function (result) { con.query(listbyuserquery, result) },
//                     function (result) { con.query(Cusviewquery, result) },

//                 ],
//                     function (err, results) {
//                         if (err)
//                             Reqresponse.printResponse(res, err, null);
//                         else {

//                             if (results[0][0].length > 0) {
//                                 req.body.TermsId = results[0][0][0].TermsId;
//                             }
//                             if (results[1][0].length > 0) {
//                                 req.body.FirstName = results[1][0][0].FirstName;
//                                 req.body.LastName = results[1][0][0].LastName;
//                                 req.body.Email = results[1][0][0].Email;
//                             }
//                             if (results[2][0].length > 0) {
//                                 req.body.CompanyName = results[2][0][0].CompanyName;
//                             }

//                             async.parallel([
//                                 function (result) { QuotesModel.CreateQuotes(req.body, result); },
//                                 function (result) { MROModel.UpdateMRONo(req.body.MROId, result); },
//                             ],
//                                 function (err, results) {
//                                     if (err)
//                                         Reqresponse.printResponse(res, err, null);
//                                     else {
//                                         if (results[0].id > 0) {
//                                             req.body.QuoteId = results[0].id;
//                                         }
//                                         async.parallel([
//                                             function (result) { QuotesItemModel.CreateQuoteItem(req.body.QuoteId, req.body.QuoteItem, result) },
//                                             function (result) { QuotesModel.UpdateQuotesCodeByQuoteId(req.body, result); },
//                                         ],
//                                             function (err, results) {
//                                                 if (err)
//                                                     Reqresponse.printResponse(res, err, null);
//                                                 else
//                                                     Reqresponse.printResponse(res, err, { data: req.body.MROId });
//                                             });
//                                     }
//                                 });
//                         }
//                     });
//             }
//         });
//     }
// };

//_-_-_-_-_-


exports.DuplicateMRO = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        var viewquery = MROModel.viewquery(req.body.MROId);
        var viewQuoteItemByMRO = QuoteItem.viewQuoteByMRO(req.body.MROId);
        var ViewVendorQuoteByMRO = VendorQuote.ViewVendorQuoteByMRO(req.body.MROId);
        async.parallel([
            function (result) { con.query(viewquery, result) },
            function (result) { con.query(viewQuoteItemByMRO, result) },
            function (result) { con.query(AddressBook.GetBillingAddressIdByCustomerId(req.body.CustomerId), result); },
            function (result) { con.query(AddressBook.GetShippingAddressIdByCustomerId(req.body.CustomerId), result); },
            function (result) { con.query(UserModel.listbyuserquery(Constants.CONST_IDENTITY_TYPE_CUSTOMER, req.body.CustomerId), result) },
            function (result) { con.query(CustomerModel.viewquery(req.body.CustomerId, req.body), result) },
        ],
            function (err, results) {
                if (err)
                    Reqresponse.printResponse(res, err, null);
                else {
                    if (results[0][0].length > 0 && results[1][0].length > 0) {

                        var MROObj = {
                            RRId: results[0][0][0].RRId > 0 ? results[0][0][0].RRId : 0,
                            Description: results[0][0][0].Description,
                            Notes: results[0][0][0].Notes,
                            VendorId: results[0][0][0].VendorId > 0 ? results[0][0][0].VendorId : 0,
                            RRVendorId: results[0][0][0].RRVendorId > 0 ? results[0][0][0].RRVendorId : 0,
                            CustomerId: req.body.CustomerId > 0 ? req.body.CustomerId : 0,
                            CustomerBillToId: results[2][0][0].AddressId > 0 ? results[2][0][0].AddressId : 0,
                            CustomerShipToId: results[3][0][0].AddressId > 0 ? results[3][0][0].AddressId : 0,
                            CustomerPONo: results[0][0][0].CustomerPONo,
                            Status: Constants.CONST_MROS_AWAIT_VQUOTE
                        };

                        MROModel.CreateMRO(MROObj, (err, data) => {
                            req.body.MROId = data.id;
                            var MROStatusHistoryObj = new MROStatusHistory({
                                MROId: data.id,
                                HistoryStatus: Constants.CONST_MROS_GENERATED
                            });
                            var Quoteobj = {
                                TaxType: results[1][0][0].TaxType,
                                QuoteDate: results[1][0][0].QuoteDate,
                                IdentityId: req.body.CustomerId > 0 ? req.body.CustomerId : 0,
                                IdentityType: Constants.CONST_IDENTITY_TYPE_CUSTOMER,
                                MROId: data.id,
                                QuoteType: results[1][0][0].QuoteType,
                                ShippingFee: results[1][0][0].ShippingFee,
                                GrandTotal: results[1][0][0].GrandTotal,
                                TotalValue: results[1][0][0].TotalValue,
                                TaxPercent: results[1][0][0].TaxPercent,
                                ProcessFee: results[1][0][0].ProcessFee,
                                TotalTax: results[1][0][0].TotalTax,
                                Discount: results[1][0][0].Discount,
                                CustomerBillToId: results[2][0][0].AddressId > 0 ? results[2][0][0].AddressId : 0,
                                CustomerShipToId: results[3][0][0].AddressId > 0 ? results[3][0][0].AddressId : 0,
                                Status: Constants.CONST_QUOTE_STATUS_DRAFT,
                                QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_DRAFT,

                                FirstName: results[4][0][0].FirstName,
                                LastName: results[4][0][0].LastName,
                                Email: results[4][0][0].Email,
                                CompanyName: results[5][0].length > 0 ? results[5][0][0].CompanyName : '',

                                LocalCurrencyCode: results[1][0][0].LocalCurrencyCode,
                                ExchangeRate: results[1][0][0].ExchangeRate,
                                BaseCurrencyCode: results[1][0][0].BaseCurrencyCode,
                                BaseGrandTotal: results[1][0][0].BaseGrandTotal
                            };


                            var QuoteItemArray = []; var i = 0;
                            for (i = 0; i < results[1][0].length; i++) {
                                var obj = {};
                                obj.PartId = results[1][0][i].PartId;
                                obj.PartType = results[1][0][i].PartType;
                                obj.PartNo = results[1][0][i].PartNo;
                                obj.PartDescription = results[1][0][i].PartDescription;
                                obj.WarrantyPeriod = results[1][0][i].WarrantyPeriod;
                                obj.LeadTime = results[1][0][i].LeadTime;
                                obj.SerialNo = results[1][0][i].SerialNo;
                                obj.Quantity = results[1][0][i].Quantity;
                                obj.VendorUnitPrice = results[1][0][i].VendorUnitPrice;
                                obj.Rate = results[1][0][i].Rate;
                                obj.Tax = results[1][0][i].Tax;
                                obj.Discount = results[1][0][i].Discount;
                                obj.Price = results[1][0][i].Price;

                                obj.ItemTaxPercent = results[1][0][i].ItemTaxPercent;
                                obj.ItemLocalCurrencyCode = results[1][0][i].ItemLocalCurrencyCode;
                                obj.ItemExchangeRate = results[1][0][i].ItemExchangeRate;
                                obj.ItemBaseCurrencyCode = results[1][0][i].ItemBaseCurrencyCode;
                                obj.BasePrice = results[1][0][i].BasePrice;

                                QuoteItemArray.push(obj);
                            }
                            req.body.QuoteItemArray = QuoteItemArray;


                            async.parallel([
                                function (result) { QuotesModel.CreateQuotes(Quoteobj, result); },
                                function (result) { MROModel.UpdateMRONo(data.id, result); },
                                function (result) { con.query(ViewVendorQuoteByMRO, result) },
                                function (result) { MROStatusHistory.Create(MROStatusHistoryObj, result); },

                            ],
                                function (err, results) {
                                    if (err)
                                        Reqresponse.printResponse(res, err, null);
                                    else {
                                        req.body.QuoteId = results[0].id > 0 ? results[0].id : 0;
                                        var VendorQuoteArray = []; var k = 0; var VendorQuoteItemArray = [];

                                        for (k = 0; k < results[2][0].length; k++) {
                                            var obj = {};
                                            obj.QuoteId = req.body.QuoteId;
                                            obj.MROId = req.body.MROId > 0 ? req.body.MROId : 0;
                                            obj.RRId = results[2][0][k].RRId;
                                            obj.VendorId = results[2][0][k].VendorId;
                                            obj.SubTotal = results[2][0][k].SubTotal;
                                            obj.AdditionalCharge = results[2][0][k].AdditionalCharge;
                                            obj.TaxPercent = results[2][0][k].TaxPercent;
                                            obj.TotalTax = results[2][0][k].TotalTax;
                                            obj.Discount = results[2][0][k].Discount;
                                            obj.Shipping = results[2][0][k].Shipping;
                                            obj.GrandTotal = results[2][0][k].GrandTotal;
                                            obj.LeadTime = results[2][0][k].LeadTime;
                                            obj.WarrantyPeriod = results[2][0][k].WarrantyPeriod;
                                            obj.QuoteItemId = results[2][0][k].QuoteItemId;
                                            obj.RouteCause = results[2][0][k].RouteCause;
                                            obj.Status = Constants.CONST_VENDOR_STATUS_ASSIGNED;

                                            obj.TaxPercent = results[2][0][k].TaxPercent;
                                            obj.LocalCurrencyCode = results[2][0][k].LocalCurrencyCode;
                                            obj.ExchangeRate = results[2][0][k].ExchangeRate;
                                            obj.BaseCurrencyCode = results[2][0][k].BaseCurrencyCode;
                                            obj.BaseGrandTotal = results[2][0][k].BaseGrandTotal;

                                            VendorQuoteArray.push(obj);


                                            var objItem = {};
                                            objItem.VendorQuoteId = 0;
                                            objItem.QuoteId = req.body.QuoteId;
                                            objItem.VendorId = results[2][0][k].VendorId;
                                            objItem.RRId = results[2][0][k].RRId;
                                            objItem.PartId = results[2][0][k].PartId;
                                            objItem.PartNo = results[2][0][k].PartNo;
                                            objItem.Description = results[2][0][k].Description;
                                            objItem.LeadTime = results[2][0][k].LeadTime;
                                            objItem.Quantity = results[2][0][k].Quantity;
                                            objItem.Rate = results[2][0][k].Rate;
                                            objItem.Price = results[2][0][k].Price;
                                            objItem.WarrantyPeriod = results[2][0][k].WarrantyPeriod;
                                            objItem.VendorAttachment = results[2][0][k].VendorAttachment;
                                            objItem.AttachmentMimeType = results[2][0][k].AttachmentMimeType;
                                            objItem.WebLink = results[2][0][k].WebLink;

                                            objItem.ItemTaxPercent = results[2][0][k].ItemTaxPercent;
                                            objItem.ItemLocalCurrencyCode = results[2][0][k].ItemLocalCurrencyCode;
                                            objItem.ItemExchangeRate = results[2][0][k].ItemExchangeRate;
                                            objItem.ItemBaseCurrencyCode = results[2][0][k].ItemBaseCurrencyCode;
                                            objItem.BasePrice = results[2][0][k].BasePrice;

                                            VendorQuoteItemArray.push(objItem);

                                        }
                                        req.body.VendorQuoteArray = VendorQuoteArray;
                                        req.body.VendorQuoteItemArray = VendorQuoteItemArray;
                                        var MROStatusHistoryVendorObj = new MROStatusHistory({
                                            MROId: req.body.MROId,
                                            HistoryStatus: Constants.CONST_MROS_AWAIT_VQUOTE
                                        });
                                        async.parallel([
                                            function (result) { QuotesItemModel.CreateQuoteItem(req.body.QuoteId, req.body.QuoteItemArray, result) },
                                            function (result) { QuotesModel.UpdateQuotesCodeByQuoteId(req.body, result); },
                                            function (result) { MROStatusHistory.Create(MROStatusHistoryVendorObj, result); },
                                        ],
                                            function (err, results) {
                                                if (err)
                                                    Reqresponse.printResponse(res, err, null);
                                                else {
                                                    async.parallel([
                                                        function (result) { VendorQuote.CreateVendorQuoteForMRODuplicate(req.body.VendorQuoteArray, result); },
                                                        function (result) { VendorQuoteItem.CreateVendorQuoteItemForMRODuplicate(req.body.VendorQuoteItemArray, result); }
                                                    ],
                                                        function (err, results) {
                                                            if (err)
                                                                Reqresponse.printResponse(res, err, null);
                                                            else {
                                                                var ViewVendorQuoteOnlyByMRO = VendorQuote.ViewVendorQuoteOnlyByMRO(req.body.MROId);
                                                                con.query(ViewVendorQuoteOnlyByMRO, (err, data) => {
                                                                    if (err)
                                                                        Reqresponse.printResponse(res, err, null);
                                                                    if (data.length > 0) {
                                                                        async.parallel([
                                                                            function (result) { VendorQuoteItem.UpdateVendorQuoteId(data, result); }
                                                                        ],
                                                                            function (err, results) {
                                                                                if (err)
                                                                                    Reqresponse.printResponse(res, err, null);
                                                                                else {
                                                                                    Reqresponse.printResponse(res, null, req.body);
                                                                                }
                                                                            });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                }
                                            });
                                    }
                                });
                        });

                    } else {
                        Reqresponse.printResponse(res, err, "No record for MRO = " + req.body.MROId);
                    }
                }
            });
    }
};

exports.createMRO = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (!req.body.ExchangeRate || req.body.ExchangeRate == null || req.body.ExchangeRate <= 0 || !req.body.LocalCurrencyCode || !req.body.BaseCurrencyCode) {
        var err = "Something went wrong!";
        Reqresponse.printResponse(res, { message: "Something went wrong!. Please contact admin." }, null);
    } else {
        var Partempty = false; var ExistVendorQuoteUniquePart;
        if (boolean) {
            var Boolean = true;
            for (let OBJECT of req.body.LineItem) {
                var VendorQuoteItemInfo = OBJECT.VendorQuoteInfo;
                for (let obj of VendorQuoteItemInfo) {
                    if (obj.Quantity > OBJECT.Quantity) {
                       // console.log("vendor : obj.Quantity = " + obj.Quantity);
                       // console.log("Customer OBJECT.Quantity =" + OBJECT.Quantity);
                        Boolean = false;
                        break;
                    }
                    if (!obj.PartId) {
                        Partempty = true;
                        break;
                    }
                }
                function uniqueByKey(array, key) {
                    return [...new Map(array.map((x) => [x[key], x])).values()];
                }
                var VendorQuotePartArray = uniqueByKey(VendorQuoteItemInfo, 'PartId');
                if (VendorQuotePartArray.length != 1)
                    ExistVendorQuoteUniquePart = true;
            }
            const hasDuplicatePart = (arrayObj, colname) => {
                var hash = Object.create(null);
                return arrayObj.some((arr) => {
                    return arr[colname] && (hash[arr[colname]] || !(hash[arr[colname]] = true));
                });
            };
            ExistDuplicatePart = hasDuplicatePart(req.body.LineItem, "PartId");

            if (ExistDuplicatePart || ExistVendorQuoteUniquePart) {
                Reqresponse.printResponse(res, { msg: " Founded Duplicate Part in LineItem. Please Delete it,Before Proceed" }, null);
            }
            else if (Partempty) {
                Reqresponse.printResponse(res, { msg: "There is an issue in vendor quote. Delete the line item and add it again." }, null);
            }
            else if (Boolean) {
                req.body.Status = Constants.CONST_MROS_AWAIT_VQUOTE;
                MROModel.CreateMRO(req.body, (err, data) => {
                    if (err) {
                        Reqresponse.printResponse(res, err, null);
                    }
                    req.body.MROId = data.id;

                    var MROStatusHistoryCreatedObj = new MROStatusHistory({
                        authuser: req.body.authuser,
                        MROId: req.body.MROId,
                        HistoryStatus: Constants.CONST_MROS_GENERATED
                    });

                    var MROStatusHistoryVendorObj = new MROStatusHistory({
                        authuser: req.body.authuser,
                        MROId: req.body.MROId,
                        HistoryStatus: Constants.CONST_MROS_AWAIT_VQUOTE
                    });

                    async.parallel([
                        function (result) { con.query(UserModel.listbyuserquery(Constants.CONST_IDENTITY_TYPE_CUSTOMER, req.body.CustomerId), result) },
                        function (result) { con.query(CustomerModel.viewquery(req.body.CustomerId, req.body), result) },
                        function (result) { MROModel.UpdateMRONo(req.body.MROId, result); },
                        function (result) { MROStatusHistory.Create(MROStatusHistoryCreatedObj, result); },
                    ],
                        function (err, results) {
                            if (err) {
                                Reqresponse.printResponse(res, err, null)
                            }
                            else {
                                if (results[0][0].length > 0) {
                                    req.body.FirstName = results[0][0][0].FirstName;
                                    req.body.LastName = results[0][0][0].LastName;
                                    req.body.Email = results[0][0][0].Email;
                                }
                                req.body.CompanyName = results[1][0].length > 0 ? results[1][0][0].CompanyName : 0;

                                var Quoteobj = new QuotesModel({
                                    authuser: req.body.authuser,
                                    TaxType: req.body.TaxType,
                                    QuoteDate: cDateTime.getDateTime(),
                                    IdentityId: req.body.CustomerId,
                                    IdentityType: Constants.CONST_IDENTITY_TYPE_CUSTOMER,
                                    MROId: req.body.MROId,
                                    QuoteType: Constants.CONST_QUOTE_TYPE_REGULAR,
                                    ShippingFee: req.body.ShippingFee,
                                    GrandTotal: req.body.GrandTotal,
                                    TotalValue: req.body.TotalValue,
                                    TaxPercent: req.body.TaxPercent,
                                    ProcessFee: req.body.ProcessFee,
                                    TotalTax: req.body.TotalTax,
                                    Discount: req.body.Discount,
                                    CustomerBillToId: req.body.CustomerBillToId,
                                    CustomerShipToId: req.body.CustomerShipToId,
                                    LocalCurrencyCode: req.body.LocalCurrencyCode,
                                    ExchangeRate: req.body.ExchangeRate,
                                    BaseCurrencyCode: req.body.BaseCurrencyCode,
                                    BaseGrandTotal: req.body.BaseGrandTotal

                                });
                                // console.log("@@@@Quoteobj@@@@");
                                // console.log(Quoteobj);
                                QuotesModel.CreateQuotes(Quoteobj, (err, data1) => {
                                    if (err) { return result(err, null); }
                                    req.body.QuoteId = data1.id;

                                    async.parallel([
                                        function (result) {
                                            // if (req.body.GrandTotal > 0) { QuotesItemModel.CreateQuoteItem(req.body.QuoteId, req.body.LineItem, result) }
                                            // else { RRModel.emptyFunction(req.body, result); }
                                            QuotesItemModel.CreateQuoteItem(req.body.QuoteId, req.body.LineItem, result);

                                        },
                                        function (result) {
                                            if (req.body.QuoteId > 0) { QuotesModel.UpdateQuotesCodeByQuoteId(req.body, result); }
                                            else { RRModel.emptyFunction(req.body, result); }
                                        },
                                        function (result) { MROStatusHistory.Create(MROStatusHistoryVendorObj, result); }

                                    ],
                                        function (err, results) {
                                            if (err) { Reqresponse.printResponse(res, err, null); }
                                            else {
                                                for (let OBJECT of req.body.LineItem) {
                                                    var VendorQuoteItemInfo = OBJECT.VendorQuoteInfo;
                                                    for (let obj of VendorQuoteItemInfo) {
                                                        var VendorQuoteobj = new VendorQuote({
                                                            authuser: req.body.authuser,
                                                            QuoteId: req.body.QuoteId,
                                                            MROId: req.body.MROId,
                                                            VendorId: obj.VendorId,
                                                            SubTotal: obj.Price,
                                                            GrandTotal: obj.Price,
                                                            QuoteItemId: obj.PartId,

                                                            LocalCurrencyCode: obj.ItemLocalCurrencyCode,
                                                            ExchangeRate: obj.ItemExchangeRate,
                                                            BaseCurrencyCode: obj.ItemBaseCurrencyCode,
                                                            BaseGrandTotal: obj.Price * obj.ItemExchangeRate,
                                                        });

                                                        async.parallel([
                                                            function (result) {
                                                                // if (VendorQuoteobj.GrandTotal > 0) { VendorQuote.CreateVendorQuote(VendorQuoteobj, result); }
                                                                // else { RRModel.emptyFunction(req.body, result); }
                                                                VendorQuote.CreateVendorQuote(VendorQuoteobj, result);
                                                            },

                                                        ],
                                                            function (err, results) {
                                                                if (err) { Reqresponse.printResponse(res, err, null); }
                                                                else {

                                                                    req.body.VendorQuoteId = results[0].id > 0 ? results[0].id : 0;
                                                                    var VQlistArray = [];
                                                                    var VQItem = new VendorQuoteItem({
                                                                        authuser: req.body.authuser,
                                                                        VendorQuoteId: req.body.VendorQuoteId,
                                                                        QuoteId: req.body.QuoteId,
                                                                        VendorId: obj.VendorId,
                                                                        PartId: obj.PartId,
                                                                        PartNo: obj.PartNo,
                                                                        Description: obj.Description,
                                                                        Quantity: obj.Quantity,
                                                                        Rate: obj.Rate,
                                                                        Price: obj.Price,
                                                                        LeadTime: obj.LeadTime,
                                                                        VendorAttachment: obj.VendorAttachment,
                                                                        AttachmentMimeType: obj.AttachmentMimeType,
                                                                        WebLink: obj.WebLink,
                                                                        ItemTaxPercent: obj.ItemTaxPercent,
                                                                        ItemLocalCurrencyCode: obj.ItemLocalCurrencyCode,
                                                                        ItemExchangeRate: obj.ItemExchangeRate,
                                                                        ItemBaseCurrencyCode: obj.ItemBaseCurrencyCode,
                                                                        BasePrice: obj.BasePrice,
                                                                        BaseRate: obj.BaseRate,
                                                                        Tax: obj.Tax,
                                                                        BaseTax: obj.BaseTax,
                                                                        ShippingCharge: obj.ShippingCharge,
                                                                        BaseShippingCharge: obj.BaseShippingCharge,

                                                                    });
                                                                    VQlistArray.push(VQItem);

                                                                    async.parallel([
                                                                        function (result) {
                                                                            if (req.body.VendorQuoteId > 0) { VendorQuoteItem.CreateVendorQuoteItem(req.body.VendorQuoteId, req.body.QuoteId, VQlistArray, result); }
                                                                            else { RRModel.emptyFunction(req.body, result); }
                                                                        },
                                                                    ],
                                                                        function (err, results) {
                                                                            if (err) { Reqresponse.printResponse(res, err, null); }
                                                                        });
                                                                }
                                                            });
                                                    }
                                                }
                                            }
                                        });
                                });
                            }
                        });
                    Reqresponse.printResponse(res, null, req.body);
                });
            }
            else {
                Reqresponse.printResponse(res, { msg: "Vendor Quantity Should Not Exceeds the Customer Quantity." }, null);
            }
        }
    }
};

exports.MROStatusAutoScript = (req, res) => {

    var sql = MROModel.SelectAllMRO(req.body)
    con.query(sql, (err, MROJSON) => {
        if (err)
            Reqresponse.printResponse(res, err, null);

        Recursive(0, MROJSON, (data) => {
            Reqresponse.printResponse(res, null, data);
        });
    });
};

function Recursive(i, MROJSON, cb) {

    MROModel.UpdateMROStatusHistory(MROJSON[i], (err, data) => {
        i = i + 1;
        //console.log(i, "record processed");
        if (err) {
            var msg = err.message || err.msg || err;
            results.push({ record: i, message: msg });
        } else {
            results.push({ record: i, message: "Success" });
        }
        if (i == MROJSON.length) {
            return cb(results);
        }
        Recursive(i, MROJSON, cb);
    });
}

// MROListByServerSide
exports.MROListByServerSide = (req, res) => {
    MROModel.MROListByServerSide(new MROModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};


//view MRO
exports.viewMRO = (req, res) => {
    if (req.body.hasOwnProperty('MROId')) {
        MROModel.findById(req.body.MROId, req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "MRO Id is required" }, null);
    }
};

exports.changeStatusToQuoted = (req, res) => {
    if (req.body.hasOwnProperty('MROId')) {
        MROModel.changeStatusToQuoted(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "MRO Id is required" }, null);
    }
};

exports.AssignVendor = (req, res) => {

    var sqlGetStatus = MROModel.SelectMROStatusWithSettings(req.body.MROId);
    con.query(sqlGetStatus, (err, res) => {
        if (err) {
            return result(err, null);
        }
        if (res.length <= 0) {
            return result({ msg: "MRO not found" }, null);
        }
        req.body.MROStatus = res[0].Status;
        let TaxPercent = res[0].TaxPercent ? res[0].TaxPercent : 0;
        let VendorId = req.body.VendorId;

        const RRVendorsObj = new RRVendorModel({
            MROId: req.body.MROId,
            RRId: 0,
            VendorId: VendorId,
            TaxPercent: TaxPercent,
            SubTotal: 0,
            GrandTotal: 0
        });
        RRVendorModel.CreateRRVendors(RRVendorsObj, (err, data1) => {
            if (err) { return result(err, null); }
            if (!data1) {
                return Reqresponse.printResponse(res, { msg: "There is a problem in assigning a vendor." }, null);
            }
            req.body.RRVendorId = data1.RRVendorId;
            const MROObj = new MROModel({
                authuser: req.body.authuser,
                MROId: req.body.MROId,
                Status: Constants.CONST_MROS_AWAIT_VQUOTE
            });
            async.parallel([
                function (result) { MROModel.UpdateVendorOfRequestByMROId(req.body, result); },
                function (result) { MROModel.ChangeMROStatus(MROObj, result); }
            ],
                function (err, results) {
                    if (err) { Reqresponse.printResponse(res, err, null); }

                });
        });
    });
    Reqresponse.printResponse(res, null, req.body);
}

exports.DeleteMRO = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        if (req.body.hasOwnProperty('MROId')) {
            MROModel.DeleteMRO(req.body, (err, data) => {
                Reqresponse.printResponse(res, err, data);
            });
        } else {
            Reqresponse.printResponse(res, { msg: "MROId  is required" }, null);
        }
    }
};

// To Get Packing Slip
exports.PackingSlip = (req, res) => {
    if (req.body.hasOwnProperty('MROId') && req.body.hasOwnProperty('MROShippingHistoryId')) {
        MROModel.PackingSlip(req.body.MROId, req.body.MROShippingHistoryId, req.body.SOId, req.body.SOItemId, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "MRO Id and MROShipping History Id is required" }, null);
    }
};

// Update MRO
exports.UpdateMRO = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        if (req.body.hasOwnProperty('MROId')) {
            const MROObj = new MROModel({
                MROId: req.body.MROId,
                Status: Constants.CONST_MROS_NEED_SOURCED
            });
            
            async.parallel([
                function (result) { if (req.body.hasOwnProperty('nextstep') && req.body.nextstep == "needssourced") { MROModel.ChangeMROStatus(MROObj, result); } else { RRModel.emptyFunction(MROObj, result); } },
                // function (result) { if (req.body.hasOwnProperty('nextstep') && req.body.nextstep == "needssourced") { RRStatusHistory.Create(RRStatusHistoryObj, result); } else { RRModel.emptyFunction(MROObj, result); } },
                // function (result) { if (req.body.hasOwnProperty('nextstep') && req.body.nextstep == "needssourced") { NotificationModel.Create(NotificationObj, result); } else { RRModel.emptyFunction(MROObj, result); } },
                // function (result) { CustomerReference.UpdateRRCusRef(req.body, result); }
            ],
                function (err, results) {
                    if (err)
                        Reqresponse.printResponse(res, err, null);
                    // if (results[3].Status) {
                    //     req.body.Status = results[3].Status;
                    // }
                    return Reqresponse.printResponse(res, null, { data: req.body });
                });
        } else {
            Reqresponse.printResponse(res, { msg: "MRO not found" }, null);
            return;
        }
    } else {
        Reqresponse.printResponse(res, { msg: "MRO not found" }, null);
        return;
    }
};
//
exports.UpdateMROVendorQuote = (req, res) => {

    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {

        QuotesModel.GetCustomerQuantity(req.body.MROId, req.body.VendorQuoteInfo[0].PartId, (err, data) => {
            if (err) {
                console.log(err);
                Reqresponse.printResponse(res, err, null);
            }
            var Boolean = true;
            for (let obj of req.body.VendorQuoteInfo) {
                if (obj.Quantity > data[0].Quantity) {
                    Boolean = false;
                    break;
                }
            }
            if (Boolean) {
                for (let obj of req.body.VendorQuoteInfo) {
                    var VendorQuoteobj = new VendorQuote({
                        authuser: req.body.authuser,
                        VendorQuoteId: obj.VendorQuoteId,
                        QuoteId: req.body.QuoteId,
                        MROId: req.body.MROId,
                        VendorId: obj.VendorId,
                        SubTotal: obj.Rate,
                        GrandTotal: obj.Price,
                        LeadTime: obj.LeadTime,
                        QuoteItemId: obj.PartId,
                        LocalCurrencyCode: req.body.LocalCurrencyCode,
                        ExchangeRate: req.body.ExchangeRate,
                        BaseCurrencyCode: req.body.BaseCurrencyCode,
                        BaseGrandTotal: obj.Price * req.body.ExchangeRate,
                    });
                    
                    async.parallel([
                        function (result) {
                            if (VendorQuoteobj.VendorQuoteId > 0) { VendorQuote.UpdateVendorQuote(VendorQuoteobj, result); }
                            else { VendorQuote.CreateVendorQuote(VendorQuoteobj, result); }
                        },
                    ],
                        function (err, results) {
                            if (err) {
                                console.log(err);
                                Reqresponse.printResponse(res, err, null);
                            }
                            else {

                                req.body.VendorQuoteId = results[0].id > 0 ? results[0].id : 0;
                                var VQlistArray = [];
                                var VQItem = new VendorQuoteItem({
                                    authuser: req.body.authuser,
                                    VendorQuoteId: req.body.VendorQuoteId > 0 ? req.body.VendorQuoteId : obj.VendorQuoteId,
                                    VendorQuoteItemId: obj.VendorQuoteItemId > 0 ? obj.VendorQuoteItemId : 0,
                                    QuoteId: req.body.QuoteId,
                                    QuoteItemId: req.body.QuoteItemId,
                                    VendorId: obj.VendorId,
                                    PartId: obj.PartId,
                                    PartNo: obj.PartNo,
                                    Description: obj.Description,
                                    Quantity: obj.Quantity,
                                    Rate: obj.Rate,
                                    Price: obj.Price,
                                    LeadTime: obj.LeadTime,
                                    VendorAttachment: obj.VendorAttachment,
                                    AttachmentMimeType: obj.AttachmentMimeType,
                                    WebLink: obj.WebLink,
                                    ItemTaxPercent: obj.ItemTaxPercent,
                                    ItemLocalCurrencyCode: obj.ItemLocalCurrencyCode,
                                    ItemExchangeRate: obj.ItemExchangeRate,
                                    ItemBaseCurrencyCode: obj.ItemBaseCurrencyCode,
                                    BasePrice: obj.BasePrice,
                                    BaseRate: obj.BaseRate,
                                    Tax: obj.Tax,
                                    BaseTax: obj.BaseTax,
                                    ShippingCharge: obj.ShippingCharge,
                                    BaseShippingCharge: obj.BaseShippingCharge,

                                });
                                VQlistArray.push(VQItem);

                                async.parallel([
                                    function (result) {
                                        if (VQlistArray[0].VendorQuoteItemId > 0) { VendorQuoteItem.UpdateVendorQuoteItem(VQItem, result); }
                                        else { VendorQuoteItem.CreateVendorQuoteItem(req.body.VendorQuoteId, req.body.QuoteId, VQlistArray, result); }
                                    },
                                ],
                                    function (err, results) {
                                        if (err) {
                                            console.log(err);
                                            Reqresponse.printResponse(res, err, null);
                                        }
                                    });
                            }

                        });
                }

            }
            else {
                Reqresponse.printResponse(res, { msg: "VendorQuantity should not exceeds CustomerQuantity" }, null);
            }
            Reqresponse.printResponse(res, null, req.body);
        });
    }

     
};
exports.ViewMROVendorInfo = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        MROVendorModel.ViewMROVendorInfo(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};
exports.VendorQuoteBySO = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        MROVendorModel.VendorQuoteBySO(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};
exports.complete = (req, res) => {
    MROModel.complete(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
exports.RejectMRO = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        MROModel.RejectMRO(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};

exports.ActiveInActiveMRO = (req, res) => {
    if (req.body.hasOwnProperty('MROId')) {
        MROModel.ActiveInActiveMRO(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "MROId is required" }, null);
    }
};


exports.RejectMROVendor = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        // var RRStatusHistoryObj = new RRStatusHistory({
        //     RRId: req.body.RRId,
        //     HistoryStatus: Constants.CONST_RRS_NEED_RESOURCED
        // });

        const Obj = new MROModel({
            authuser: req.body.authuser,
            MROId: req.body.MROId,
            Status: Constants.CONST_MROS_NEED_RESOURCED
        });

         
        req.body.Status = Constants.CONST_MROS_NEED_RESOURCED;
        async.parallel([
            function (result) { RRVendorModel.RejectRRVendor(req.body, result); },
            function (result) { MROModel.ChangeMROStatus(Obj, result); },
            function (result) { MROModel.ResetMROVendor(req.body.MROId, result); },
            // function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
            //  function (result) { NotificationModel.Create(NotificationObj, result); },
            function (result) { MROModel.ResetApprovedQuoteSOPOInvoice(req.body, result); },
        ],
            function (err, results) {
                if (err) {
                    Reqresponse.printResponse(res, err, null);
                }
                Reqresponse.printResponse(res, null, results[0]);
            }
        );
    } else {
        Reqresponse.printResponse(res, { msg: "Request can not be empty" }, null);
    }
};
exports.UpdatePartCurrentLocation = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        MROModel.UpdatePartCurrentLocation(new MROModel(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};
exports.RemoveMROVendor = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        // var RRStatusHistoryObj = new RRStatusHistory({
        //     RRId: req.body.RRId,
        //     HistoryStatus: Constants.CONST_RRS_NEED_SOURCED
        // });

        const Obj = new MROModel({
            authuser: req.body.authuser,
            MROId: req.body.MROId,
            Status: Constants.CONST_MROS_NEED_RESOURCED
        });

        req.body.Status = Constants.CONST_MROS_NEED_RESOURCED;

        

        async.parallel([
            function (result) { RRVendorModel.RemoveRRVendor(req.body, result); },
            function (result) { MROModel.ChangeMROStatus(Obj, result); },
            function (result) { MROModel.ResetMROVendor(req.body.MROId, result); },
            //  function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
            // function (result) { NotificationModel.Create(NotificationObj, result); }
        ],
            function (err, results) {
                if (err) {
                    Reqresponse.printResponse(res, err, null);
                }
                Reqresponse.printResponse(res, null, results[0]);
            }
        );
    } else {
        Reqresponse.printResponse(res, { msg: "Request can not be empty" }, null);
    }
};

exports.UpdateMROStep2 = (req, res) => {
    // console.log(req.body.CustomerSONo);
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        if (req.body.hasOwnProperty('MROId')) {

            async.parallel([
                function (result) { MROModel.UpdateMROByMROIdStep2(new MROModel(req.body), result); },
                //  function (result) { RRParts.UpdateRRPartsStep2(req.body, result); },
                //  function (result) { RRImages.UpdateRRImages(req.body, result); },
                //  function (result) { CustomerReference.UpdateRRCusRef(req.body, result); },
                function (result) {
                    if (req.body.hasOwnProperty('CustomerSONo') && req.body.hasOwnProperty('CustomerSODueDate') && req.body.CustomerSONo != "" && req.body.CustomerSODueDate != "" && req.body.CustomerSONo != null && req.body.CustomerSODueDate != null) {

                        MROModel.UpdateCustomerSONoandCustomerSODueDatebyMROId(req.body, result);
                    }
                },
                function (result) {
                    if (req.body.hasOwnProperty('CustomerPONo') && req.body.hasOwnProperty('VendorPODueDate') && req.body.CustomerPONo != "" && req.body.VendorPODueDate != "" && req.body.CustomerPONo != null && req.body.VendorPODueDate != null) {
                        MROModel.UpdateCustomerPONoandVendorPODueDatebyMROId(req.body, result);
                    }
                },
                function (result) {
                    if (req.body.hasOwnProperty('CustomerInvoiceNo') && req.body.hasOwnProperty('CustomerInvoiceDueDate') && req.body.CustomerInvoiceNo != "" && req.body.CustomerInvoiceDueDate != "" && req.body.CustomerInvoiceNo != null && req.body.CustomerInvoiceDueDate != null) {
                        MROModel.UpdateCustomerInvoiceNoandCustomerInvoiceDueDatebyMROId(req.body, result);
                    }
                },
                function (result) {
                    if (req.body.hasOwnProperty('CustomerSONo') && req.body.hasOwnProperty('CustomerSODueDate') && req.body.CustomerSONo != "" && req.body.CustomerSODueDate != "" && req.body.CustomerSONo != null && req.body.CustomerSODueDate != null) {

                        SalesOrderModel.UpdateSONoandSODueDatebySONo(req.body, result);
                    }
                },
                function (result) {
                    if (req.body.hasOwnProperty('CustomerPONo') && req.body.hasOwnProperty('VendorPODueDate') && req.body.CustomerPONo != "" && req.body.VendorPODueDate != "" && req.body.CustomerPONo != null && req.body.VendorPODueDate != null) {
                        PurchaseOrderModel.UpdatePODueDatebyPONo(req.body, result);
                    }
                },
                function (result) {
                    if (req.body.hasOwnProperty('CustomerInvoiceNo') && req.body.hasOwnProperty('CustomerInvoiceDueDate') && req.body.CustomerInvoiceNo != "" && req.body.CustomerInvoiceNo != null && req.body.CustomerInvoiceDueDate != "" && req.body.CustomerInvoiceDueDate != null) {
                        InvoiceOrderModel.UpdateInvoiceDueDatebyInvoiceONo(req.body, result);
                    }
                },
            ],
                function (err, results) {
                    if (err) {
                        Reqresponse.printResponse(res, err, null);
                    }
                }
            );
            Reqresponse.printResponse(res, null, { data: req.body });
        } else {
            Reqresponse.printResponse(res, { msg: "MRO not found" }, null);
        }
    } else {
        Reqresponse.printResponse(res, { msg: "MRO not found" }, null);
    }
};
exports.GetMROStatistics = (req, res) => {
    MROModel.GetMROStatistics(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
//
exports.AssignAHGroupVendor = (req, res) => {

    var sqlGetStatus = MROModel.SelectMROStatusWithSettings(req.body.MROId);
    con.query(sqlGetStatus, (err, res) => {
        if (err) {
            return result(err, null);
        }
        if (res.length <= 0) {
            return result({ msg: "MRO not found" }, null);
        }
        req.body.MROStatus = res[0].Status;
        let TaxPercent = res[0].TaxPercent ? res[0].TaxPercent : 0;
        let VendorId = req.body.VendorId = res[0].AHGroupVendor;

        const RRVendorsObj = new RRVendorModel({
            authuser: req.body.authuser,
            MROId: req.body.MROId,
            RRId: 0,
            VendorId: VendorId,
            TaxPercent: TaxPercent,
            SubTotal: 0,
            GrandTotal: 0
        });
        RRVendorModel.CreateRRVendors(RRVendorsObj, (err, data1) => {
            if (err) { return result(err, null); }
            if (!data1) {
                return Reqresponse.printResponse(res, { msg: "There is a problem in assigning a vendor." }, null);
            }
            req.body.RRVendorId = data1.RRVendorId;
            const MROObj = new MROModel({
                authuser: req.body.authuser,
                MROId: req.body.MROId,
                Status: Constants.CONST_MROS_AWAIT_VQUOTE
            });
            async.parallel([
                function (result) { MROModel.UpdateVendorOfRequestByMROId(req.body, result); },
                function (result) { MROModel.ChangeMROStatus(MROObj, result); }
            ],
                function (err, results) {
                    if (err) { Reqresponse.printResponse(res, err, null); }

                });
        });
    });
    Reqresponse.printResponse(res, null, req.body);
}

exports.updateAddQuotes = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    req.body.MROId = req.body.MROId ? req.body.MROId : 0;
    req.body.QuoteId = req.body.QuoteId ? req.body.QuoteId : 0;
    //if (!req.body.ExchangeRate || req.body.ExchangeRate == null || req.body.ExchangeRate <= 0 || !req.body.LocalCurrencyCode || !req.body.BaseCurrencyCode) {
    if (req.body.MROId == 0 || req.body.QuoteId == 0) {
        var err = "Something went wrong!";
        Reqresponse.printResponse(res, { message: "Something went wrong!" }, null);
    } else {
        async.parallel([
            function (result) {
                if (req.body.LineItem.length > 0) { QuotesItemModel.CreateQuoteItem(req.body.QuoteId, req.body.LineItem, result) }
                else { RRModel.emptyFunction(req.body, result); }
            },

        ],
            function (err, results) {
                if (err) { Reqresponse.printResponse(res, err, null); }
                else {
                    for (let OBJECT of req.body.LineItem) {
                        var VendorQuoteItemInfo = OBJECT.VendorQuoteInfo;
                        for (let obj of VendorQuoteItemInfo) {
                            var LocalCurrencyCode = req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : obj.ItemLocalCurrencyCode;
                            var BaseCurrencyCode = req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : obj.ItemBaseCurrencyCode;
                            var ExchangeRate = req.body.ExchangeRate ? req.body.ExchangeRate : obj.ItemExchangeRate;
                            var VendorQuoteobj = new VendorQuote({
                                authuser: req.body.authuser,
                                QuoteId: req.body.QuoteId,
                                MROId: req.body.MROId,
                                VendorId: obj.VendorId,
                                SubTotal: obj.Price,
                                GrandTotal: obj.Price,
                                QuoteItemId: obj.PartId,
                                LocalCurrencyCode: LocalCurrencyCode,
                                ExchangeRate: ExchangeRate,
                                BaseCurrencyCode: BaseCurrencyCode,
                                BaseGrandTotal: obj.Price * ExchangeRate,
                            });
                            var QIQuery = QuotesItemModel.viewquery(req.body.QuoteId);
                            async.parallel([
                                function (result) {
                                    // if (VendorQuoteobj.GrandTotal > 0) { VendorQuote.CreateVendorQuote(VendorQuoteobj, result); }
                                    // else { RRModel.emptyFunction(req.body, result); }
                                    VendorQuote.CreateVendorQuote(VendorQuoteobj, result);

                                },
                                function (result) { con.query(QIQuery, result); }

                            ],
                                function (err, results) {
                                    if (err) { Reqresponse.printResponse(res, err, null); }
                                    else {
                                        const getSumByKey = (arr, key) => {
                                            return arr.reduce((accumulator, current) => accumulator + Number(current[key]), 0)
                                        }
                                        // console.log(results[1][0]);
                                        var array = results[1][0];
                                        var Rate = getSumByKey(array, 'Rate');
                                        var Tax = getSumByKey(array, 'Tax');
                                        var Price = getSumByKey(array, 'Price');
                                        var BasePrice = getSumByKey(array, 'BasePrice');
                                        var BaseRate = getSumByKey(array, 'BaseRate');
                                        var BaseTax = getSumByKey(array, 'BaseTax');
                                        var Discount = getSumByKey(array, 'Discount');
                                        // console.log( Rate, Tax, Price, BasePrice, BaseRate, BaseTax, Discount );
                                        req.body.VendorQuoteId = results[0].id > 0 ? results[0].id : 0;
                                        var VQlistArray = [];
                                        var VQItem = new VendorQuoteItem({
                                            authuser: req.body.authuser,
                                            VendorQuoteId: req.body.VendorQuoteId,
                                            QuoteId: req.body.QuoteId,
                                            VendorId: obj.VendorId,
                                            PartId: obj.PartId,
                                            PartNo: obj.PartNo,
                                            Description: obj.Description,
                                            Quantity: obj.Quantity,
                                            Rate: obj.Rate,
                                            Price: obj.Price,
                                            LeadTime: obj.LeadTime,
                                            VendorAttachment: obj.VendorAttachment,
                                            AttachmentMimeType: obj.AttachmentMimeType,
                                            WebLink: obj.WebLink,
                                            ItemTaxPercent: obj.ItemTaxPercent,
                                            ItemLocalCurrencyCode: obj.ItemLocalCurrencyCode,
                                            ItemExchangeRate: obj.ItemExchangeRate,
                                            ItemBaseCurrencyCode: obj.ItemBaseCurrencyCode,
                                            BasePrice: obj.BasePrice,
                                            BaseRate: obj.BaseRate,
                                            Tax: obj.Tax,
                                            BaseTax: obj.BaseTax,
                                            ShippingCharge: obj.ShippingCharge,
                                            BaseShippingCharge: obj.BaseShippingCharge,
                                        });
                                        VQlistArray.push(VQItem);
                                        var QuotesUpdate = new QuotesModel({
                                            authuser: req.body.authuser,
                                            TotalValue: Price,
                                            TotalTax: Tax,
                                            BaseGrandTotal: BasePrice,
                                            Discount: Discount,
                                            GrandTotal: Price,
                                            QuoteId: req.body.QuoteId,
                                            LocalCurrencyCode: LocalCurrencyCode,
                                            ExchangeRate: ExchangeRate,
                                            BaseCurrencyCode: BaseCurrencyCode,
                                            BaseGrandTotal: Price * ExchangeRate,
                                        });
                                        async.parallel([
                                            function (result) {
                                                if (req.body.VendorQuoteId > 0) { VendorQuoteItem.CreateVendorQuoteItem(req.body.VendorQuoteId, req.body.QuoteId, VQlistArray, result); }
                                                else { RRModel.emptyFunction(req.body, result); }
                                            },
                                            function (result) { QuotesModel.UpdateCustomerQuote(QuotesUpdate, result); },
                                        ],
                                            function (err, results) {
                                                if (err) { Reqresponse.printResponse(res, err, null); }
                                            });
                                    }
                                });
                        }
                    }
                    Reqresponse.printResponse(res, null, req.body);
                }
            });
    }
};




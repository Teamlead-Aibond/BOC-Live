/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const MROShippingHistoryModel = require("../models/mro.shipping.history.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const SalesOrder = require("../models/sales.order.model.js");
const SalesOrderItem = require("../models/sales.order.item.model.js");
const Invoice = require("../models/invoice.model.js");
const TermsModel = require("../models/terms.model.js");
const MROModel = require("../models/mro.model.js");
const InvoiceItem = require("../models/invoice.item.model.js");
var async = require('async');
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const PurchaseOrder = require("../models/purchase.order.model.js");
const PurchaseOrderItem = require("../models/purchase.order.item.model.js");
const MROStatusHistory = require("../models/mro.status.history.model.js");
const GeneralHistoryLog = require("../models/general.history.log.model.js");
exports.List = (req, res) => {
    MROShippingHistoryModel.List((err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.ShipAndReceive = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        var DaysCount = MROShippingHistoryModel.Difference_In_Days(req.body.ShipDate, req.body.ReceiveDate);
        if (DaysCount >= 0) {
            var sql = PurchaseOrderItem.IsEligibleForReceive(req.body.POId, req.body.POItemId, req.body.SOId, req.body.MROId);
            con.query(sql, (err, data) => {
                if (err)
                    Reqresponse.printResponse(res, err, null)

                var OverAllTotalQuantity = data[0].OverAllTotalQuantity;
                var OverAllReceived = data[0].OverAllReceived;
                var AllSOQuantity = data[0].AllSOQuantity;

                if (req.body.Quantity <= data[0].Pending) {
                    MROShippingHistoryModel.ShipAndReceive(new MROShippingHistoryModel(req.body), (err, dataship) => {
                        var sql_find_status = MROModel.SelectMROStatus(req.body.MROId)
                        con.query(sql_find_status, (err, dataStatus) => {
                            var IncludingReceiveQuantity = parseInt(OverAllReceived) + parseInt(req.body.Quantity);
                            if (OverAllTotalQuantity == IncludingReceiveQuantity && OverAllTotalQuantity == AllSOQuantity) { //order fullfilled
                                if (dataStatus[0].Status != Constants.CONST_MROS_FULFILLED_BY_VENDOR) {
                                    var MROStatusHistoryObj = new MROStatusHistory({
                                        MROId: req.body.MROId,
                                        HistoryStatus: Constants.CONST_MROS_FULFILLED_BY_VENDOR
                                    });

                                    async.parallel([
                                        function (result) { MROStatusHistory.Create(MROStatusHistoryObj, result); },
                                        function (result) { MROModel.UpdateMROStatusById(req.body.MROId, Constants.CONST_MROS_FULFILLED_BY_VENDOR, result); }
                                    ],
                                        function (err, results) {
                                            Reqresponse.printResponse(res, err, results[0][0]);
                                        })

                                } else {
                                    Reqresponse.printResponse(res, err, data);
                                }
                            } else {//Partially Received
                                if (dataStatus[0].Status != Constants.CONST_MROS_PARTIALLY_RECEIVED) {
                                    var MROStatusHistoryObj2 = new MROStatusHistory({
                                        MROId: req.body.MROId,
                                        HistoryStatus: Constants.CONST_MROS_PARTIALLY_RECEIVED
                                    });
                                    async.parallel([
                                        function (result) { MROStatusHistory.Create(MROStatusHistoryObj2, result); },
                                        function (result) { MROModel.UpdateMROStatusById(req.body.MROId, Constants.CONST_MROS_PARTIALLY_RECEIVED, result); }
                                    ],
                                        function (err, results) {
                                            Reqresponse.printResponse(res, err, results[0][0]);
                                        })
                                } else {
                                    Reqresponse.printResponse(res, err, data);
                                }
                            }
                        });
                        //Reqresponse.printResponse(res, err, data);
                    });
                }
                else {
                    Reqresponse.printResponse(res, { msg: " Receive Quantity Exceeds, Pending Quantity is " + data[0].Pending }, null);
                }
            });
        }
        else {
            Reqresponse.printResponse(res, { msg: " Receive Date should be Greater than Shipping Date" }, null);
        }

    }
};

exports.update = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        MROShippingHistoryModel.update(new MROShippingHistoryModel(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};
// exports.Ship = (req, res) => {
//     var boolean = Reqresponse.validateReqBody(req, res);
//     if (boolean) {
//         MROShippingHistoryModel.Ship(new MROShippingHistoryModel(req.body), (err, data) => {
//             Reqresponse.printResponse(res, err, data);
//         });
//     }
// };
exports.Ship = (req, res) => {
    SalesOrderItem.IsEligibleForShipping(req.body.SOId, req.body.SOItemId, (err, data) => {
        if (err)
            Reqresponse.printResponse(res, err, null);
        var ReadyForShipment = data[0].ReadyForShipment;
        var OverAllShipped = data[0].OverAllShipped;
        var OverAllTotalQuantity = data[0].OverAllTotalQuantity;
        if (req.body.Quantity <= ReadyForShipment) {
            MROShippingHistoryModel.Ship(new MROShippingHistoryModel(req.body), (err, data1) => {
                if (err) { Reqresponse.printResponse(res, err, null); }
                else {
                    var MROShippingHistoryId = data1.id;
                    // var sql = SalesOrder.viewByMROId(req.body.MROId);
                    //var sqlSi = SalesOrderItem.viewByMROId(req.body.MROId, req.body.PartId);

                    var sql = SalesOrder.viewBySOId(req.body.SOId);
                    var sqlSi = SalesOrderItem.viewBySOItemId(req.body.SOItemId);

                    var sqlGetDefaultTerm = TermsModel.GetDefaultTerm();

                    async.parallel([
                        function (result) { con.query(sql, result) },
                        function (result) { con.query(sqlSi, result) },
                        function (result) { con.query(sqlGetDefaultTerm, result) },
                    ],
                        function (err, results) {
                            if (err)
                                Reqresponse.printResponse(res, err, null);

                            if (results[0][0].length > 0) {

                                var InvoiceRes = results[0][0];
                                var objInvoiceItem = results[1][0];
                                // 
                                var overallQuantity = objInvoiceItem[0].Quantity;
                                var singleQuantitySC = objInvoiceItem[0].ShippingCharge / overallQuantity;
                                var singleQuantityBaseSC = objInvoiceItem[0].BaseShippingCharge / overallQuantity;
                                // 
                                var RateWithQuantity = objInvoiceItem[0].Rate * req.body.Quantity;
                                // var ShippingCharge = objInvoiceItem[0].ShippingCharge;
                                // var BaseShippingCharge = objInvoiceItem[0].BaseShippingCharge;
                                var ShippingCharge = singleQuantitySC * req.body.Quantity;
                                var BaseShippingCharge = singleQuantityBaseSC * req.body.Quantity;
                                var TaxPrice = objInvoiceItem[0].ItemTaxPercent / 100;
                                var TaxRateWithOutQuantity = objInvoiceItem[0].Rate * TaxPrice;
                                var TaxRateWithQuantity = RateWithQuantity * TaxPrice;
                                objInvoiceItem[0].Quantity = req.body.Quantity;
                                objInvoiceItem[0].Price = parseFloat(RateWithQuantity + TaxRateWithQuantity + ShippingCharge).toFixed(2);
                                // objInvoiceItem[0].BasePrice = (objInvoiceItem[0].Price * objInvoiceItem[0].ItemExchangeRate) + BaseShippingCharge;
                                objInvoiceItem[0].BasePrice = parseFloat((objInvoiceItem[0].Price * objInvoiceItem[0].ItemExchangeRate)).toFixed(2);
                                objInvoiceItem[0].Tax = parseFloat(TaxRateWithOutQuantity).toFixed(2);
                                objInvoiceItem[0].ShippingCharge = parseFloat(ShippingCharge).toFixed(2);
                                objInvoiceItem[0].BaseShippingCharge = parseFloat(BaseShippingCharge).toFixed(2);
                                var GrandTotal = objInvoiceItem[0].Price;

                                var BaseGrandTotal = objInvoiceItem[0].BasePrice;

                                const objInvoice = new Invoice({
                                    authuser: req.body.authuser,
                                    InvoiceNo: '',
                                    SONo: InvoiceRes[0].SONo,
                                    SOId: InvoiceRes[0].SOId,
                                    CustomerPONo: InvoiceRes[0].CustomerPONo,
                                    CustomerBlanketPOId: InvoiceRes[0].CustomerBlanketPOId,
                                    MROId: req.body.MROId,
                                    RRId: InvoiceRes[0].RRId,
                                    RRNo: InvoiceRes[0].RRNo,
                                    CustomerId: InvoiceRes[0].CustomerId,
                                    InvoiceType: Constants.CONST_INV_TYPE_REPAIR,
                                    InvoiceDate: cDateTime.getDate(),
                                    DueDate: cDateTime.getDate(),
                                    ReferenceNo: '',
                                    ShipAddressId: InvoiceRes[0].ShipAddressBookId,
                                    BillAddressId: InvoiceRes[0].BillAddressBookId,
                                    LaborDescription: '',
                                    SubTotal: GrandTotal,
                                    AHFees: InvoiceRes[0].AHFees,
                                    TaxPercent: InvoiceRes[0].TaxPercent,
                                    TotalTax: InvoiceRes[0].TotalTax,
                                    Discount: InvoiceRes[0].Discount,
                                    Shipping: InvoiceRes[0].Shipping,
                                    AdvanceAmount: 0,
                                    GrandTotal: GrandTotal,
                                    Status: Constants.CONST_INV_STATUS_OPEN,
                                    LeadTime: InvoiceRes[0].LeadTime,
                                    WarrantyPeriod: InvoiceRes[0].WarrantyPeriod,
                                    MROShippingHistoryId: MROShippingHistoryId ? MROShippingHistoryId : 0,
                                    BlanketPOExcludeAmount: InvoiceRes[0].BlanketPOExcludeAmount,
                                    BlanketPONetAmount: InvoiceRes[0].BlanketPONetAmount && InvoiceRes[0].BlanketPONetAmount > 0 ? objInvoiceItem[0].Price : 0,
                                    // LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal
                                    LocalCurrencyCode: InvoiceRes[0].LocalCurrencyCode,
                                    ExchangeRate: InvoiceRes[0].ExchangeRate,
                                    BaseCurrencyCode: InvoiceRes[0].BaseCurrencyCode,
                                    BaseGrandTotal: BaseGrandTotal
                                });

                                req.body.TermsDays = 0;
                                if (results[2][0].length > 0) {
                                    objInvoice.TermsId = results[2][0][0].TermsId;
                                    req.body.TermsDays = results[2][0][0].TermsDays;
                                }
                                Invoice.Create(objInvoice, (err, data) => {
                                    if (err) { Reqresponse.printResponse(res, err, null); }
                                    var InvoiceId = data.id;
                                    objInvoice.InvoiceId = InvoiceId;

                                    const srr = new MROModel({
                                        authuser: req.body.authuser,
                                        MROId: req.body.MROId,
                                        CustomerInvoiceNo: 'INV' + data.id,
                                        //   CustomerInvoiceDueDate: date_ob,
                                        CustomerInvoiceId: data.id
                                    })
                                    const GeneralHistoryLogPayload1 = new GeneralHistoryLog({
                                        authuser: req.body.authuser,
                                        IdentityType: Constants.CONST_IDENTITY_TYPE_MRO,
                                        IdentityId: req.body.MROId,
                                        RequestBody: JSON.stringify(req.body),
                                        Type: "Invoice - MRO - Temp",
                                        BaseTableRequest: JSON.stringify(objInvoice),
                                        ItemTableRequest: JSON.stringify(objInvoiceItem),
                                        BaseTableResponse: JSON.stringify(data),
                                        ItemTableResponse: JSON.stringify(InvoiceRes[0]),
                                        ErrorMessage: JSON.stringify(err),
                                        CommonLogMessage: JSON.stringify(InvoiceRes[0])
                                    });
                                    //var sqlCustomerInvoiceNo = MROModel.UpdateCustomerInvoiceNoByMROId(srr, req.body.TermsDays);
                                    var sqlUpdateInvoiceNo = Invoice.UpdateInvoiceNoById(objInvoice);
                                    var sqlUpdateInvoiceDueAutoUpdate = Invoice.UpdateInvoiceDueAutoUpdate(InvoiceId, req.body.TermsDays);
                                    // var sqlUpdatePriceinMRO = MROModel.UpdatePriceQuery(objInvoice);
                                    var UpdateMROShippingHistoryId = Invoice.UpdateMROShippingHistoryId(MROShippingHistoryId, InvoiceId);

                                    async.parallel([
                                        function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload1, result); },
                                        function (result) { InvoiceItem.Create(InvoiceId, objInvoiceItem, result); },
                                        function (result) { con.query(sqlUpdateInvoiceNo, result) },
                                        function (result) { SalesOrder.UpdateIsConvertedToPOBySOId(InvoiceRes[0].SOId, result); },
                                        function (result) { con.query(sqlUpdateInvoiceDueAutoUpdate, result) },
                                        function (result) { con.query(UpdateMROShippingHistoryId, result) },
                                        // function (result) { con.query(sqlCustomerInvoiceNo, result) },
                                        //function (result) { con.query(sqlUpdatePriceinMRO, result) },
                                    ],
                                        function (err, results) {
                                            if (err) { Reqresponse.printResponse(res, err, null); }

                                            var sql_find_status = MROModel.SelectMROStatus(req.body.MROId)
                                            con.query(sql_find_status, (err, dataStatus) => {
                                                //console.log("ReadyForShipment = " + ReadyForShipment);
                                                //console.log("OverAllTotalQuantity = " + OverAllTotalQuantity);
                                                //console.log("OverAllShipped = " + OverAllShipped);
                                                // console.log("Req Quantity = " + req.body.Quantity);
                                                var IncludingShippingQuantity = parseInt(OverAllShipped) + parseInt(req.body.Quantity);
                                                // console.log("IncludingShippingQuantity = " + IncludingShippingQuantity);
                                                if (IncludingShippingQuantity == OverAllTotalQuantity) { //order fullfilled
                                                    if (dataStatus[0].Status != Constants.CONST_MROS_COMPLETED) {
                                                        var MROStatusHistoryObj = new MROStatusHistory({
                                                            MROId: req.body.MROId,
                                                            HistoryStatus: Constants.CONST_MROS_COMPLETED
                                                        });
                                                        const GeneralHistoryLogPayload = new GeneralHistoryLog({
                                                            authuser: req.body.authuser,
                                                            IdentityType: Constants.CONST_IDENTITY_TYPE_MRO,
                                                            IdentityId: req.body.MROId,
                                                            RequestBody: JSON.stringify(req.body),
                                                            Type: "Invoice - MRO",
                                                            BaseTableRequest: JSON.stringify(objInvoice),
                                                            ItemTableRequest: JSON.stringify(objInvoiceItem),
                                                            BaseTableResponse: JSON.stringify(data),
                                                            ItemTableResponse: JSON.stringify(results[0]),
                                                            ErrorMessage: JSON.stringify(err),
                                                            CommonLogMessage: JSON.stringify(results)
                                                        });

                                                        async.parallel([
                                                            function (result) { MROStatusHistory.Create(MROStatusHistoryObj, result); },
                                                            function (result) { MROModel.UpdateMROStatusById(req.body.MROId, Constants.CONST_MROS_COMPLETED, result); },
                                                            function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload, result); },
                                                        ],
                                                            function (err, results) {
                                                                // Reqresponse.printResponse(res, err, { InvoiceInfo: results[0][0], InvoiceItemInfo: results[1][0] });
                                                            })

                                                    } else {
                                                        // Reqresponse.printResponse(res, err, { InvoiceInfo: results[0][0], InvoiceItemInfo: results[1][0] });
                                                    }
                                                } else {
                                                    // Reqresponse.printResponse(res, err, { InvoiceInfo: results[0][0], InvoiceItemInfo: results[1][0] });
                                                }
                                            });

                                        });
                                });
                                Reqresponse.printResponse(res, err, { InvoiceInfo: results[0][0], InvoiceItemInfo: results[1][0] });
                            } else {
                                Reqresponse.printResponse(res, { msg: "Sales Order not found for this MROId" }, null);
                            }
                        });
                }
            });
        }
        else {
            Reqresponse.printResponse(res, { msg: "Ship Quantity Exceeds,Ready For Shipment is " + data[0].ReadyForShipment }, null);
        }
    });
};


exports.View = (req, res) => {
    if (req.body.hasOwnProperty('MROShippingHistoryId')) {
        MROShippingHistoryModel.View(req.body.MROShippingHistoryId, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "MROShippingHistory Id is required" }, null);
    }
};

exports.Receive = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        MROShippingHistoryModel.Receive(new MROShippingHistoryModel(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};

exports.Delete = (req, res) => {
    if (req.body.hasOwnProperty('MROShippingHistoryId')) {
        MROShippingHistoryModel.Delete(req.body.MROShippingHistoryId, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "MROShippingHistory Id is required" }, null);
    }
};

/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const EcommerceBasket = require("../models/ecommerce.basket.model.js");
const EcommerceBasketItem = require("../models/ecommerce.basket.item.model.js");
const con = require("../helper/db.js");
const EcommerceOrderModel = require("../models/ecommerce.order.model.js");
const EcommerceOrderItemModel = require("../models/ecommerce.order.item.model.js");
var MailConfig = require('../config/email.config');
const MROModel = require("../models/mro.model.js");
const Constants = require("../config/constants.js");
const ReqRes = require("../helper/request.response.validation.js");
var async = require('async');
const Address = require("../models/customeraddress.model.js");
var GmailTransportStore = MailConfig.GmailTransportStore;
var outlookTransport = MailConfig.OutlookTransport;
var path = require('path');
var fs = require('fs');
var handlebars = require('handlebars');
const SendmailTransport = require("nodemailer/lib/sendmail-transport/index.js");
const SettingsGeneralModel = require("../models/settings.general.model.js");

const QuotesItemModel = require("../models/quote.item.model.js");
const QuotesModel = require("../models/quotes.model.js");

const SOModel = require("../models/sales.order.model.js");
const SOItemModel = require("../models/sales.order.item.model");

const PurchaseOrderItemModel = require("../models/purchase.order.item.model.js");
const PurchaseOrderModel = require("../models/purchase.order.model.js");

const VendorQuote = require("../models/vendor.quote.model.js");
const VendorQuoteItem = require("../models/vendor.quote.item.model.js");
const cDateTime = require("../utils/generic.js");
const QuoteItem = require("../models/quote.item.model.js");
const RR = require("../models/repair.request.model.js");
const Quotes = require("../models/quotes.model.js");
const CustomerAddress = require("../models/customeraddress.model.js");
const PurchaseOrder = require("../models/purchase.order.model.js");
const RRVendorParts = require("../models/repair.request.vendor.parts.model.js");
const PurchaseOrderItem = require("../models/purchase.order.item.model.js");
const VendorModel = require("../models/vendor.model.js");
const GeneralHistoryLog = require("../models/general.history.log.model.js");
const MROStatusHistory = require("../models/mro.status.history.model.js");
const PartItemShopStockLog = require("../models/part.item.shop.stock.log.model.js");
exports.addToCart = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        if (req.body.ShopCurrentQuantity >= req.body.BasketItem[0].Quantity) {
            EcommerceBasket.CreateOrUpdate(new EcommerceBasket(req.body), (err, data) => {
                // console.log(data);
                if (err) { ReqRes.printResponse(res, err, null); }
                req.body.EcommerceBasketId = data.id;
                async.parallel([

                    function (result) { if (req.body.hasOwnProperty('BasketItem')) EcommerceBasketItem.CreateOrUpdate(req.body, result); },
                ],
                    function (err, results) {
                        if (err) { ReqRes.printResponse(res, err, null); }
                    });
                ReqRes.printResponse(res, err, data);
            });
        } else {
            err = "Maximum stock reach";
            ReqRes.printResponse(res, err, null);
        }
    }
};

exports.removeFromCart = (req, res) => {
    EcommerceBasketItem.removeFromCart(new EcommerceBasketItem(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.cartCount = (req, res) => {
    if (req.body.hasOwnProperty('CustomerId')) {
        EcommerceBasket.cartCount(req.body.CustomerId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Customer Id is required" }, null);
    }

};

exports.getCart = (req, res) => {
    if (req.body.hasOwnProperty('CustomerId')) {
        EcommerceBasket.getCart(req.body.CustomerId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Customer Id is required" }, null);
    }
};

exports.increaseCartCount = (req, res) => {
    EcommerceBasketItem.increaseCartCount(new EcommerceBasketItem(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};


exports.OrderList = (req, res) => {
    EcommerceOrderModel.OrderList(new EcommerceOrderModel(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.OrderListClient = (req, res) => {
    EcommerceOrderModel.OrderListClient(new EcommerceOrderModel(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};


exports.OrderCreate = (req, res) => {
    req.body.EcommerceBasketId = req.body.EcommerceBasketId ? req.body.EcommerceBasketId : 0;
    var GetBasketIfnfo = EcommerceBasket.viewbyId(req.body.EcommerceBasketId);
    con.query(GetBasketIfnfo, (errCust, basketInfo) => {
        if (basketInfo && basketInfo.length > 0) {
            var sql = EcommerceBasket.viewbyId(req.body.EcommerceBasketId);
            var sqlSi = EcommerceBasketItem.viewByBasket(req.body.EcommerceBasketId);
            var BasketView = EcommerceBasket.viewByEcommerceBasketId(req.body.EcommerceBasketId);
            var BasketViewItem = EcommerceBasketItem.view(req.body.EcommerceBasketId);
            var sqlBillingAddress = Address.GetAddressByIdQuery(basketInfo[0].CustomerBillToId);
            var sqlShippingAddress = Address.GetAddressByIdQuery(basketInfo[0].CustomerShipToId);
            async.parallel([
                function (result) { con.query(sql, result) },
                function (result) { con.query(sqlSi, result) },
                function (result) { con.query(BasketView, result) },
                function (result) { con.query(BasketViewItem, result) },
                function (result) { con.query(sqlBillingAddress, result) },
                function (result) { con.query(sqlShippingAddress, result) },
                function (result) { EcommerceBasketItem.checkQuantityAvailableInParts(req.body.EcommerceBasketId, result) }
            ],
                function (err, results) {
                    if (err) {
                        ReqRes.printResponse(res, err, null);
                    } else {
                        if (results[0][0].length > 0) {
                            // console.log(results[6].length);
                            // process.exit();
                            if (results[6].length == 0) {
                                var BasketInfo = results[0][0][0];
                                var VendorId = results[3][0][0].VendorId;
                                EcommerceOrderModel.CreateOrder(req.body, BasketInfo, (err, data) => {
                                    if (err) {
                                        ReqRes.printResponse(res, err, null);
                                    } else {
                                        var EcommerceOrderId = data.id;
                                        req.body.EcommerceOrderId = EcommerceOrderId;

                                        var objBasketItem = results[1][0];
                                        objBasketItem.CustomerBlanketPOId = req.body.CustomerBlanketPOId;
                                        objBasketItem.CustomerPONo = req.body.CustomerPONo;

                                        const srr = new EcommerceOrderModel({
                                            authuser: req.body.authuser,
                                            EcommerceOrderId: req.body.EcommerceOrderId,
                                            EcommerceOrderNo: 'SHOP' + req.body.EcommerceOrderId
                                        })

                                        const mro = new MROModel({
                                            RRId: 0,
                                            EcommerceOrderId: req.body.EcommerceOrderId,
                                            Notes: '',
                                            Status: Constants.CONST_MROS_APPROVED,
                                            CustomerId: BasketInfo.CustomerId,
                                            CustomerBillToId: BasketInfo.CustomerBillToId,
                                            CustomerShipToId: BasketInfo.CustomerShipToId,
                                            CustomerBlanketPOId: req.body.CustomerBlanketPOId,
                                            CustomerPONo: req.body.CustomerPONo
                                        })

                                        //quote
                                        BasketInfo.TotalValue = BasketInfo.GrandTotal;
                                        BasketInfo.SubTotal = BasketInfo.GrandTotal;
                                        BasketInfo.IdentityId = BasketInfo.CustomerId;
                                        BasketInfo.QuoteType = Constants.CONST_QUOTE_TYPE_MRO
                                        BasketInfo.SubmittedDate = cDateTime.getDate();
                                        BasketInfo.ApprovedDate = cDateTime.getDate();
                                        BasketInfo.QuoteDate = cDateTime.getDate();
                                        BasketInfo.DateRequested = cDateTime.getDate();
                                        BasketInfo.Status = Constants.CONST_QUOTE_STATUS_APPROVED;
                                        BasketInfo.QuoteCustomerStatus = Constants.CONST_CUSTOMER_QUOTE_ACCEPTED;
                                        BasketInfo.LeadTime = 0;
                                        BasketInfo.WarrantyPeriod = 0;
                                        //SO
                                        BasketInfo.CustomerBlanketPOId = req.body.CustomerBlanketPOId;
                                        BasketInfo.CustomerPONo = req.body.CustomerPONo;
                                        BasketInfo.ShipAddressBookId = BasketInfo.CustomerShipToId;
                                        BasketInfo.BillAddressBookId = BasketInfo.CustomerBillToId;

                                        var Quoteobj = new QuotesModel(BasketInfo);

                                        async.parallel([
                                            function (result) { EcommerceOrderItemModel.CreateOrderItem(EcommerceOrderId, objBasketItem, result); },
                                            function (result) { EcommerceOrderModel.UpdateEcommerceOrderNo(srr, result) },
                                            function (result) { EcommerceBasket.DeleteBasket(req.body.EcommerceBasketId, result) },
                                            function (result) { EcommerceOrderItemModel.ReduceQuantity(objBasketItem, result); },
                                            function (result) { MROModel.CreateMRO(mro, result); },
                                            function (result) { QuotesModel.CreateQuotes(Quoteobj, result) },
                                        ],
                                            function (err, results1) {
                                                if (err) {
                                                    console.log(err);
                                                    ReqRes.printResponse(res, err, null);
                                                }
                                                if (results1[4].id) {
                                                    var MROId = results1[4].id;
                                                    var QuoteId = results1[5].id;

                                                    BasketInfo.MROId = MROId;
                                                    BasketInfo.QuoteId = QuoteId;

                                                    var SOObj = new SOModel(BasketInfo);
                                                    SOObj.SOType = Constants.CONST_SO_TYPE_MRO;
                                                    SOObj.DueDate = cDateTime.getDate();
                                                    SOObj.IsConvertedToPO = 1;
                                                    SOObj.Status = Constants.CONST_SO_STATUS_APPROVED;
                                                    SOObj.Created = cDateTime.getDateTime();

                                                    var POObj = new PurchaseOrderModel(BasketInfo);
                                                    POObj.POType = Constants.CONST_PO_TYPE_REPAIR;
                                                    POObj.Status = Constants.CONST_PO_STATUS_APPROVED;
                                                    POObj.DueDate = cDateTime.getDate();
                                                    POObj.ShipAddressBookId = 666;
                                                    POObj.BillAddressBookId = BasketInfo.CustomerBillToId;
                                                    POObj.ShipAddressIdentityType = 2;
                                                    POObj.SubTotal = 0;
                                                    POObj.GrandTotal = 0;
                                                    var UpdateQuoteMROIdQuery = QuotesModel.UpdateQuoteMROId(MROId, QuoteId);
                                                    var MROStatusHistoryCreatedObj = new MROStatusHistory({
                                                        authuser: req.body.authuser,
                                                        MROId: MROId,
                                                        HistoryStatus: Constants.CONST_MROS_GENERATED
                                                    });
                                                    var MROStatusHistoryVendorObj = new MROStatusHistory({
                                                        authuser: req.body.authuser,
                                                        MROId: MROId,
                                                        HistoryStatus: Constants.CONST_MROS_AWAIT_VQUOTE
                                                    });
                                                    var MROStatusHistoryCustomerObj = new MROStatusHistory({
                                                        authuser: req.body.authuser,
                                                        MROId: MROId,
                                                        HistoryStatus: Constants.CONST_MROS_QUOTED_AWAITING_CUSTOMER_PO
                                                    });
                                                    var MROStatusHistoryObj = new MROStatusHistory({
                                                        authuser: req.body.authuser,
                                                        MROId: MROId,
                                                        HistoryStatus: Constants.CONST_MROS_APPROVED
                                                    });
                                                    var EcommerceItemViewByOrderId = EcommerceOrderItemModel.viewByOrderId(EcommerceOrderId);
                                                    async.parallel([
                                                        function (result) { SOModel.Create(SOObj, result) },
                                                        function (result) { con.query(UpdateQuoteMROIdQuery, result) },
                                                        function (result) { QuotesModel.UpdateQuotesCodeByQuoteId(BasketInfo, result); },
                                                        function (result) { MROStatusHistory.Create(MROStatusHistoryCreatedObj, result); },
                                                        function (result) { con.query(EcommerceItemViewByOrderId, result) },
                                                        // 

                                                        // function (result) { VendorQuote.CreateVendorQuote(VendorQuoteobj, result) },
                                                        // function (result) { PurchaseOrderModel.Create(POObj, result) }
                                                    ],
                                                        function (err, results2) {
                                                            if (err) {
                                                                console.log(err);
                                                                ReqRes.printResponse(res, err, null);
                                                            }
                                                            SOObj.SOId = results2[0].SOId;
                                                            var LeadTime = 0;
                                                            const srr = new MROModel({
                                                                authuser: req.body.authuser,
                                                                MROId: MROId,
                                                                CustomerSONo: 'SO' + results2[0].SOId,
                                                                CustomerSOId: results2[0].SOId
                                                            });
                                                            // objBasketItem.Description = objBasketItem.PartDescription;
                                                            var sqlUpdateCustomerSONo = MROModel.UpdateCustomerSONoByMROId(srr, LeadTime);
                                                            var sqlUpdateSalesOrderDueAutoUpdate = SOModel.UpdateSalesOrderDueAutoUpdate(results2[0].SOId, LeadTime);

                                                            var objOrderItem = results2[4][0];
                                                            async.parallel([
                                                                function (result) { QuotesItemModel.CreateQuoteItem(BasketInfo.QuoteId, objBasketItem, result); },
                                                                function (result) { SOItemModel.Create(results2[0].SOId, objOrderItem, result); },
                                                                function (result) { SOModel.UpdateSONoById(SOObj, result); },
                                                                function (result) { con.query(sqlUpdateCustomerSONo, result) },
                                                                function (result) { con.query(sqlUpdateSalesOrderDueAutoUpdate, result) },
                                                                function (result) { MROStatusHistory.Create(MROStatusHistoryVendorObj, result); },
                                                                // function (result) { MROStatusHistory.Create(MROStatusHistoryCustomerObj, result); },
                                                                function (result) { MROStatusHistory.Create(MROStatusHistoryObj, result); },
                                                                // function (result) { VendorQuoteItem.CreateVendorQuoteItem(results2[1].id, rr.QuoteId, objBasketItem, result); },
                                                                // function (result) { PurchaseOrderItemModel.AutoCreatePurchaseOrderItem(results2[1].id, objBasketItem, result); }
                                                                //blanket PO deduction code here

                                                            ],
                                                                function (err, results3) {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        ReqRes.printResponse(res, err, null);
                                                                    } else {
                                                                        for (let objBI of objBasketItem) {
                                                                            const params = {
                                                                                PartId: objBI.PartId,
                                                                                ShopPartItemId: objBI.ShopPartItemId,
                                                                                StockType: 2,
                                                                                Quantity: objBI.Quantity,
                                                                                MROId: MROId,
                                                                                SOItemId: results2[0].SOId
                                                                            }
                                                                            PartItemShopStockLog.Create(params, (ee1, dd1) => { });
                                                                        }
                                                                        // QuoteItem.GetMROApprovedQuoteItemQuery
                                                                        SOItemModel.updateQuoteItemId(QuoteId, results2[0].SOId, (e, d) => {

                                                                        });
                                                                        var ViewQuoteInfo = QuoteItem.ViewQuoteIdWithParts(QuoteId);
                                                                        req.body.MROId = MROId;
                                                                        con.query(ViewQuoteInfo, (ViewQuoteErr, ViewQuoteData) => {
                                                                            // console.log(ViewQuoteData);
                                                                            var ViewQuoteDataCopy = ViewQuoteData;
                                                                            var VendorQuoteItemInfo = ViewQuoteData;
                                                                            var GrandTotal = 0; var VendorId = 0; var LeadTime = 0; var count = 0; var Ids = ''; var Quantity = 0; var SOItemIds = 0; var SOId = 0; var BasePrice = 0;
                                                                            var ShippingCharge = 0;
                                                                            // For start VQ
                                                                            for (let obj of VendorQuoteItemInfo) {
                                                                                //console.log("VendorQuoteItemInfo");
                                                                               // console.log(obj);
                                                                                var VendorQuoteobj = new VendorQuote({
                                                                                    authuser: req.body.authuser,
                                                                                    QuoteId: QuoteId,
                                                                                    MROId: MROId,
                                                                                    VendorId: obj.VendorId > 0 ? obj.VendorId : Constants.AH_GROUP_VENDOR_STORE_ID,
                                                                                    SubTotal: obj.BuyingPrice * obj.Quantity,
                                                                                    GrandTotal: obj.BuyingPrice * obj.Quantity,
                                                                                    QuoteItemId: obj.PartId,

                                                                                    LocalCurrencyCode: obj.BuyingCurrencyCode,
                                                                                    ExchangeRate: obj.BuyingExchangeRate,
                                                                                    BaseCurrencyCode: obj.ItemBaseCurrencyCode,
                                                                                    // BaseCurrencyCode: obj.ItemLocalCurrencyCode,
                                                                                    BaseGrandTotal: obj.BuyingPrice * obj.Quantity,
                                                                                });
                                                                              //  console.log(VendorQuoteobj);
                                                                                async.parallel([
                                                                                    function (result) {
                                                                                        // if (VendorQuoteobj.GrandTotal > 0) { VendorQuote.CreateVendorQuote(VendorQuoteobj, result); }
                                                                                        // else { RRModel.emptyFunction(req.body, result); }
                                                                                        VendorQuote.CreateVendorQuote(VendorQuoteobj, result);
                                                                                    },

                                                                                ],
                                                                                    function (err, resultsVq) {
                                                                                        if (err) { ReqRes.printResponse(res, err, null); }
                                                                                        else {

                                                                                            req.body.VendorQuoteId = resultsVq[0].id > 0 ? resultsVq[0].id : 0;
                                                                                            var VQlistArray = [];
                                                                                            var VQItem = new VendorQuoteItem({
                                                                                                authuser: req.body.authuser,
                                                                                                VendorQuoteId: req.body.VendorQuoteId,
                                                                                                QuoteId: req.body.QuoteId,
                                                                                                VendorId: obj.VendorId ? obj.VendorId : Constants.AH_GROUP_VENDOR_STORE_ID,
                                                                                                PartId: obj.PartId,
                                                                                                PartNo: obj.PartNo,
                                                                                                Description: obj.Description,
                                                                                                Quantity: obj.Quantity,
                                                                                                Rate: obj.BuyingPrice,
                                                                                                Price: obj.BuyingPrice,
                                                                                                LeadTime: obj.LeadTime,
                                                                                                VendorAttachment: obj.VendorAttachment,
                                                                                                AttachmentMimeType: obj.AttachmentMimeType,
                                                                                                WebLink: obj.WebLink,
                                                                                                ItemTaxPercent: obj.ItemTaxPercent,
                                                                                                ItemLocalCurrencyCode: obj.ItemLocalCurrencyCode,
                                                                                                ItemExchangeRate: obj.BuyingExchangeRate,
                                                                                                ItemBaseCurrencyCode: obj.BuyingCurrencyCode,
                                                                                                BasePrice: obj.BaseBuyingPrice,
                                                                                                BaseRate: obj.BaseBuyingPrice,
                                                                                                Tax: obj.Tax,
                                                                                                BaseTax: obj.BaseTax,
                                                                                                ShippingCharge: obj.ShippingCharge,
                                                                                                BaseShippingCharge: obj.BaseShippingCharge,

                                                                                            });
                                                                                            VQlistArray.push(VQItem);

                                                                                            async.parallel([
                                                                                                function (result) {
                                                                                                    if (req.body.VendorQuoteId > 0) { VendorQuoteItem.CreateVendorQuoteItem(req.body.VendorQuoteId, QuoteId, VQlistArray, result); }
                                                                                                    else { RRModel.emptyFunction(req.body, result); }
                                                                                                },
                                                                                            ],
                                                                                                function (err, resultsVQI) {
                                                                                                    count++;
                                                                                                    if (err) { ReqRes.printResponse(res, err, null); } else {
                                                                                                       // console.log(count + " == " + VendorQuoteItemInfo.length);
                                                                                                        if (count == VendorQuoteItemInfo.length) {
                                                                                                           // console.log("in");
                                                                                                            // Start PO
                                                                                                            // console.log("console log vendorQuote out side");
                                                                                                            // var ViewVendorQuoteInfo = VendorQuote.ViewVendorQuoteByMROWithGroup(MROId);
                                                                                                            var ViewVendorQuoteInfo = VendorQuote.ViewVendorQuoteByMRO(MROId);

                                                                                                            req.body.MROId = MROId;
                                                                                                            // console.log("console log vendorQuote os1");
                                                                                                            con.query(ViewVendorQuoteInfo, (ViewVendorQuoteErr, ViewVendorQuoteData) => {
                                                                                                                // console.log("console log vendorQuote os");
                                                                                                                var cnt = 0;
                                                                                                                for (let vendorQuote of ViewVendorQuoteData) {
                                                                                                                    // console.log("console log vendorQuote");
                                                                                                                    // console.log(vendorQuote);
                                                                                                                    var ViewVendorQuoteItemsInfo = VendorQuoteItem.ViewVendorQuoteItems(vendorQuote.VendorQuoteId);
                                                                                                                    con.query(ViewVendorQuoteItemsInfo, (ViewVendorQuoteItemsInfoErr, ViewVendorQuoteItemsInfoData) => {
                                                                                                                        var ViewVendorQuoteItemsInfoDataCopy = ViewVendorQuoteItemsInfoData;
                                                                                                                        for (let obj of ViewVendorQuoteItemsInfoData) {
                                                                                                                            //console.log("console log obj");
                                                                                                                           // console.log(obj);
                                                                                                                            GrandTotal += parseFloat(obj.Price);
                                                                                                                            VendorId = obj.VendorId ? obj.VendorId : Constants.AH_GROUP_VENDOR_STORE_ID;
                                                                                                                            Quantity += parseFloat(obj.Quantity);
                                                                                                                            BasePrice += parseFloat(obj.BasePrice);
                                                                                                                            ShippingCharge += parseFloat(obj.ShippingCharge);
                                                                                                                            if (obj.LeadTime) {
                                                                                                                                LeadTime = obj.LeadTime;
                                                                                                                                count++;
                                                                                                                                if (count >= 2) {
                                                                                                                                    LeadTime = 0;
                                                                                                                                }
                                                                                                                            }
                                                                                                                            Ids += obj.PartId + `,`;
                                                                                                                        }
                                                                                                                        var PartIds = Ids.slice(0, -1);
                                                                                                                        async.parallel([
                                                                                                                            function (result) { con.query(CustomerAddress.GetShippingAddressIdByVendorId(Constants.AH_GROUP_VENDOR_STORE_ID), result); },
                                                                                                                            function (result) { con.query(CustomerAddress.GetBillingAddressIdByVendorId(Constants.AH_GROUP_VENDOR_STORE_ID), result); },
                                                                                                                            function (result) { con.query(VendorModel.viewquery(vendorQuote.VendorId), result); },
                                                                                                                            function (result) { con.query(SOModel.GetSaleOrder(req.body.MROId, PartIds), result); },
                                                                                                                        ],
                                                                                                                            function (err, resultsPO) {
                                                                                                                                console.log(err);
                                                                                                                                if (err)
                                                                                                                                    ReqRes.printResponse(res, err, null);

                                                                                                                                const PurchaseOrder1 = new PurchaseOrder({
                                                                                                                                    authuser: req.body.authuser,
                                                                                                                                    PONo: '',
                                                                                                                                    MROId: req.body.MROId,
                                                                                                                                    RRId: 0,
                                                                                                                                    RRNo: '',
                                                                                                                                    VendorId: vendorQuote.VendorId,
                                                                                                                                    VendorRefNo: '',
                                                                                                                                    POType: Constants.CONST_PO_TYPE_MRO,
                                                                                                                                    TermsId: 0,
                                                                                                                                    DateRequested: cDateTime.getDate(),
                                                                                                                                    DueDate: cDateTime.getDate(),
                                                                                                                                    AdditionalPONo: '',
                                                                                                                                    ShipAddressBookId: 666,
                                                                                                                                    BillAddressBookId: 0,
                                                                                                                                    ShipAddressIdentityType: 2,
                                                                                                                                    ShippingNotes: '',
                                                                                                                                    SubTotal: GrandTotal,
                                                                                                                                    TaxPercent: 0,
                                                                                                                                    TotalTax: 0,
                                                                                                                                    Discount: 0,
                                                                                                                                    AHFees: 0,
                                                                                                                                    Shipping: 0,
                                                                                                                                    GrandTotal: GrandTotal,
                                                                                                                                    Status: Constants.CONST_PO_STATUS_APPROVED,
                                                                                                                                    RouteCause: '',
                                                                                                                                    LeadTime: LeadTime,
                                                                                                                                    WarrantyPeriod: 0,
                                                                                                                                    LocalCurrencyCode: BasketInfo.LocalCurrencyCode ? BasketInfo.LocalCurrencyCode : '',
                                                                                                                                    ExchangeRate: BasketInfo.ExchangeRate ? BasketInfo.ExchangeRate : 0,
                                                                                                                                    BaseCurrencyCode: BasketInfo.BaseCurrencyCode ? BasketInfo.BaseCurrencyCode : '',
                                                                                                                                    BaseGrandTotal: BasePrice
                                                                                                                                });
                                                                                                                                PurchaseOrder1.ShipAddressBookId = resultsPO[0][0].length > 0 ? resultsPO[0][0][0].AddressId : 0;
                                                                                                                                PurchaseOrder1.BillAddressBookId = resultsPO[1][0].length > 0 ? resultsPO[1][0][0].AddressId : 0;
                                                                                                                                PurchaseOrder1.TermsId = resultsPO[2][0].length > 0 ? resultsPO[2][0][0].TermsId : 0;

                                                                                                                                for (var i = 0; i < ViewVendorQuoteItemsInfoDataCopy.length; i++) {
                                                                                                                                   // console.log("ViewVendorQuoteItemsInfoDataCopy");
                                                                                                                                   // console.log(ViewVendorQuoteItemsInfoDataCopy);
                                                                                                                                    var obj = ViewVendorQuoteItemsInfoDataCopy[i];
                                                                                                                                   // console.log("ViewVendorQuoteItemsInfoDataCopy[i]");
                                                                                                                                   // console.log(obj);

                                                                                                                                    var PO_SOId = 0;
                                                                                                                                    var PO_SOItemId = 0;
                                                                                                                                    //console.log(resultsPO[3][0]);
                                                                                                                                    var pickedSOItem = resultsPO[3][0].find(x => x.PartId === ViewVendorQuoteItemsInfoDataCopy[i].PartId);

                                                                                                                                    if (pickedSOItem) {
                                                                                                                                        PO_SOId = pickedSOItem.SOId
                                                                                                                                        PO_SOItemId = pickedSOItem.SOItemId
                                                                                                                                    }


                                                                                                                                    PurchaseOrder1.SOId = PO_SOId;
                                                                                                                                    obj.SOId = PO_SOId;
                                                                                                                                    obj.SOItemId = PO_SOItemId;
                                                                                                                                    obj.VendorId = ViewVendorQuoteItemsInfoDataCopy[i].VendorId;


                                                                                                                                    ViewVendorQuoteItemsInfoDataCopy[i] = obj;
                                                                                                                                    SOItemIds += PO_SOItemId + `,`;
                                                                                                                                    SOId = PO_SOId;
                                                                                                                                }
                                                                                                                               // console.log(SOItemIds);
                                                                                                                                var _SOItemIds = SOItemIds.slice(0, -1);

                                                                                                                                PurchaseOrder.IsEligibleCreatePO(req.body.MROId, SOId, _SOItemIds, (err, data1) => {
                                                                                                                                    if (err) {
                                                                                                                                        ReqRes.printResponse(res, err, null);
                                                                                                                                    }
                                                                                                                                    // if (data1.length > 0 && Quantity <= data1[0].MaxQuantity) {
                                                                                                                                    PurchaseOrder.Create(PurchaseOrder1, (err, data) => {
                                                                                                                                        PurchaseOrder1.POId = data.id;
                                                                                                                                        const srr = new MROModel({
                                                                                                                                            authuser: req.body.authuser,
                                                                                                                                            MROId: req.body.MROId,
                                                                                                                                            VendorPONo: 'PO' + PurchaseOrder1.POId,
                                                                                                                                            VendorPOId: PurchaseOrder1.POId
                                                                                                                                        })

                                                                                                                                        async.parallel([
                                                                                                                                            function (result) {
                                                                                                                                                PurchaseOrderItem.AutoCreatePurchaseOrderItem(data.id, ViewVendorQuoteItemsInfoDataCopy, result);
                                                                                                                                            },
                                                                                                                                            function (result) { PurchaseOrder.UpdatePurchaseOrderByRRId(PurchaseOrder1, result); },
                                                                                                                                            function (result) { con.query(MROModel.UpdateVendorPONoByMROId(srr, 0), result); },
                                                                                                                                            function (result) { con.query(PurchaseOrder.UpdatePurchaseOrderDueAutoUpdate(PurchaseOrder1.POId, PurchaseOrder1.LeadTime), result); },
                                                                                                                                            function (result) { con.query(SOModel.UpdateSOPOId(PurchaseOrder1.POId, SOId), result); }
                                                                                                                                        ],
                                                                                                                                            function (err, resultsPOI) {
                                                                                                                                                cnt++;
                                                                                                                                                const GeneralHistoryLogPayload = new GeneralHistoryLog({
                                                                                                                                                    IdentityType: Constants.CONST_IDENTITY_TYPE_MRO,
                                                                                                                                                    IdentityId: req.body.MROId,
                                                                                                                                                    RequestBody: JSON.stringify(req.body),
                                                                                                                                                    Type: "PO - MRO - Ecom",
                                                                                                                                                    BaseTableRequest: JSON.stringify(PurchaseOrder1),
                                                                                                                                                    ItemTableRequest: JSON.stringify(req.body.PurchaseOrderItem),
                                                                                                                                                    BaseTableResponse: JSON.stringify(data),
                                                                                                                                                    ItemTableResponse: JSON.stringify(resultsPOI[0]),
                                                                                                                                                    ErrorMessage: JSON.stringify(err),
                                                                                                                                                    CommonLogMessage: JSON.stringify(resultsPOI)
                                                                                                                                                });
                                                                                                                                                async.parallel([
                                                                                                                                                    function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload, result); },
                                                                                                                                                ],
                                                                                                                                                    function (err12, results12) {

                                                                                                                                                    });
                                                                                                                                                if (err) {
                                                                                                                                                   // console.log(err);
                                                                                                                                                    ReqRes.printResponse(res, err, null);
                                                                                                                                                } else {
                                                                                                                                                    PurchaseOrder.GetPOItemByPOId(PurchaseOrder1.POId, (err11, data11) => {
                                                                                                                                                        var resultlist = data11;
                                                                                                                                                        for (const val of resultlist) {
                                                                                                                                                            if (val.SOItemId > 0 && val.POItemId > 0) {
                                                                                                                                                                SOModel.UpdatePOItemIdInSO(val, (err, data) => {

                                                                                                                                                                });
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                        //   ReqRes.printResponse(res, null, data);
                                                                                                                                                    });

                                                                                                                                                    if (req.body.CustomerBlanketPOId > 0) {
                                                                                                                                                        var params = {
                                                                                                                                                            CustomerBlanketPOId: req.body.CustomerBlanketPOId,
                                                                                                                                                            QuoteAmount: BasketInfo.GrandTotal,
                                                                                                                                                            QuoteId: BasketInfo.QuoteId,
                                                                                                                                                            Comments: "",
                                                                                                                                                            LocalCurrencyCode: BasketInfo.LocalCurrencyCode,
                                                                                                                                                            ExchangeRate: BasketInfo.ExchangeRate,
                                                                                                                                                            BaseCurrencyCode: BasketInfo.BaseCurrencyCode,
                                                                                                                                                            authuser: req.body.authuser,
                                                                                                                                                            MROId: BasketInfo.MROId
                                                                                                                                                        }
                                                                                                                                                        EcommerceOrderModel.BlanketPOUpdate(params, (err11, data11) => {
                                                                                                                                                        });
                                                                                                                                                    }

                                                                                                                                                    if (cnt == ViewVendorQuoteData.length) {
                                                                                                                                                        MROModel.UpdateMRONo(results1[4].id, (err, data5) => {
                                                                                                                                                            var productDetails = {
                                                                                                                                                                BasketInfo: results[2][0][0],
                                                                                                                                                                BasketItem: results[3][0],
                                                                                                                                                                BillingAddress: results[4][0][0],
                                                                                                                                                                ShippingAddress: results[5][0][0],
                                                                                                                                                                MROId: results1[4].id,
                                                                                                                                                                CustomerPONo: req.body.CustomerPONo
                                                                                                                                                            }
                                                                                                                                                            sendOrderMail(productDetails);
                                                                                                                                                            ReqRes.printResponse(res, err, { MROId: results1[4].id });
                                                                                                                                                        })
                                                                                                                                                    }


                                                                                                                                                }

                                                                                                                                            });
                                                                                                                                    });
                                                                                                                                    // }
                                                                                                                                    // else {
                                                                                                                                    //     ReqRes.printResponse(res, { msg: "Quantity Exceeds.Remaining quantity is " + data1[0].MaxQuantity }, null);
                                                                                                                                    // }
                                                                                                                                });
                                                                                                                            });
                                                                                                                    });
                                                                                                                }

                                                                                                            });
                                                                                                            //End PO
                                                                                                        }
                                                                                                    }
                                                                                                });
                                                                                        }
                                                                                    });
                                                                            }
                                                                            // For end VQ


                                                                        });
                                                                    }
                                                                });
                                                        });



                                                    // MROModel.UpdateMRONo(results1[4].id, (err, data5) => {
                                                    //     var productDetails = {
                                                    //         BasketInfo: results[2][0][0],
                                                    //         BasketItem: results[3][0],
                                                    //         BillingAddress: results[4][0][0],
                                                    //         ShippingAddress: results[5][0][0],
                                                    //         MROId: results1[4].id,
                                                    //         CustomerPONo: req.body.CustomerPONo
                                                    //     }
                                                    //     // sendOrderMail(productDetails);
                                                    //     ReqRes.printResponse(res, err, { MROId: results1[4].id });
                                                    // })
                                                }

                                            });
                                    }
                                });
                                //ReqRes.printResponse(res, err, { BasketInfo: results[0][0], BasketInfoInfo: results[1][0] });
                            } else {
                                // var Msg = "Some Part ("+results[6]+") is out of stock";
                                var Msg = "Please check your cart.. some of the part in your cart is out of stock or less quantity..";
                                ReqRes.printResponse(res, { msg: Msg }, null);
                            }
                        } else {
                            ReqRes.printResponse(res, { msg: "Basket not found" }, null);
                        }
                    }

                });
        } else {
            ReqRes.printResponse(res, { msg: "Basket not found" }, null);
        }
    });


}


function sendOrderMail(productDetails) {
    // console.log(productDetails);
    var SettingsId = 1;
    SettingsGeneralModel.findById(SettingsId, (err1, data1) => {
        console.log(data1);
        const filePath = path.join(__dirname, '../views/email/OrderSuccess.hbs');
        // const filePath = path.join(__dirname, '../views/email/RequestForQuote.html');

        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);
        const htmlToSend = template(productDetails);

        var message = {
            from: Constants.CONST_AH_FROM_EMAIL_ID,
            to: productDetails.BasketInfo.Email,
            bcc: data1.RequestForQuoteEmail,
            // from: "ahstoresupport@ahgroupna.com",
            // to: 'athinbabu.a@gmail.com',
            subject: 'Order Success - AH Group Store',
            text: ' ',
            html: htmlToSend
        };

        // outlookTransport.sendMail(message, (error, info) => {
        //     console.log("~~~~~~~~~~~");
        //     console.log(error);
        //     console.log(info);
        //     // ReqRes.printResponse(res, err, data);
        // })
        GmailTransportStore.sendMail(message, (error, info) => {
            // ReqRes.printResponse(message, error, info);
        })
    });
}

exports.orderView = (req, res) => {
    if (req.body.hasOwnProperty('OrderId')) {
        EcommerceOrderModel.orderView(req.body.OrderId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Order Id is required" }, null);
    }
};

exports.testMail = (req, res) => {
    var message = {
        // from: Constants.CONST_AH_FROM_EMAIL_ID,
        // to: productDetails.BasketInfo.Email,
        // bcc: data1.RequestForQuoteEmail,
        from: "ahstoresupport@ahgroupna.com",
        to: 'bsheth@ahgroupna.com',
        subject: 'SMTP Test',
        text: 'SMTP Test !',
    };

    outlookTransport.sendMail(message, (error, info) => {
        console.log("~~~~~~~~~~~");
        console.log(error);
        console.log(info);
        // ReqRes.printResponse(res, err, data);
    })
    // gmailTransport.sendMail(message, (error, info) => {
    //     ReqRes.printResponse(res, error, info);
    // })
};



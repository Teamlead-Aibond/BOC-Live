/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Invoice = require("../models/invoice.model.js");
const InvoiceItem = require("../models/invoice.item.model.js");
const SalesOrder = require("../models/sales.order.model.js");
const SalesOrderItem = require("../models/sales.order.item.model.js");
const RR = require("../models/repair.request.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");
const SendEmail = require("../models/send.email.model.js");
const NotificationModel = require("../models/notification.model.js");
const TermModel = require("../models/terms.model.js");
const MROModel = require("../models/mro.model.js");
const CustomerBlanketPO = require("../models/customer.blanket.po.model.js");
const CustomerBlanketPOHistory = require("../models/customer.blanket.po.history.model.js");
const InvoiceItemModel = require("../models/invoice.item.model.js");
const Customers = require("../models/customers.model.js");
const Notes = require("../models/repair.request.notes.model.js");
const CustomerBlanketPOHistoryLog = require("../models/customer.blanket.po.history.log.model.js");
const GeneralHistoryLog = require("../models/general.history.log.model.js");
const CustomerBlanketPOModel = require("../models/customer.blanket.po.model.js");
const CustomerBlanketPOHistoryModel = require("../models/customer.blanket.po.history.model.js");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType } = require("../helper/common.function.js");
exports.update = (req, res) => {

  var TokenUserId = getLogInUserId(req.body);

  // return false;
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    var sql = InvoiceItem.view(req.body.InvoiceId);
    con.query(sql, (err, Firstdata) => {
      if (err)
        Reqresponse.printResponse(res, err, null);
      if (Firstdata.length > 0) {
        req.body.SOId = Firstdata[0].SOId;

        var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;

        var NotificationObj = new NotificationModel({
          authuser: req.body.authuser,
          RRId: req.body.InvoiceId,
          NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
          NotificationIdentityId: req.body.InvoiceId,
          NotificationIdentityNo: 'IO' + req.body.InvoiceId,
          ShortDesc: 'Customer Invoice Paid',
          Description: 'Customer Invoice Status changed to Paid by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
        });
        Invoice.SelectInvoiceStatus(req.body.InvoiceId, (err, data) => {
          var ok;
          if (data.length > 0) {
            if (data[0].Status == 6) { ok = 0; }
            else if (req.body.Status == 6) { ok = 1; }
          }
          var sqlUpdatePriceinRR = RR.UpdatePriceQuery(req.body);

          var Id = 0; var Type = "";
          if (data[0].CustomerBlanketPOId > 0) {

            if (req.body.RRId > 0) {
              Id = req.body.RRId;
              Type = "RR";
            }
            else if (req.body.MROId > 0) {
              Id = req.body.MROId;
              Type = "MRO";
            }
            else if (req.body.QuoteId > 0 || data[0].QuoteId > 0) {
              Id = data[0].QuoteId ? data[0].QuoteId : req.body.QuoteId;
              Type = "QUOTE";
            }
            else { }
          }
          // console.log("@@@@@@&&&&&&&&&@@@@")
          req.body.SalesOrderItem = req.body.InvoiceItem;
          // console.log(req.body.SalesOrderItem);
          SalesOrder.checkBlanketPOPriceBoolean(req, Id, Type, (err, checkBlanketPOPriceBoolean) => {
            if (checkBlanketPOPriceBoolean) {
              async.parallel([
                function (result) { Invoice.update(new Invoice(req.body), result); },
                // function (result) {
                //   if (req.body.hasOwnProperty('InvoiceItem')) { InvoiceItem.Update(req.body, result); } else { RR.emptyFunction(req.body, result); }
                // },
                function (result) {
                  if (req.body.hasOwnProperty('SalesOrderItem') && Type != "MRO") { SalesOrderItem.UpdateSalesOrderItem(req.body, result); }
                  else { RR.emptyFunction(req.body, result); }
                },
                function (result) { RR.UpdateCustomerInvoiceDueDate(req.body, result); },
                function (result) { if (ok == 1) { NotificationModel.Create(NotificationObj, result); } else { RR.emptyFunction(NotificationObj, result); } },
                function (result) { if (req.body.GrandTotal > 0) { con.query(sqlUpdatePriceinRR, result) } else { RR.emptyFunction(NotificationObj, result); } },
                function (result) { Invoice.IsNonRRAndNonMRO(req.body.InvoiceId, result); },
                function (result) { SalesOrder.GetSODetail(req.body.InvoiceId, result); },
                function (result) {
                  if (data[0].CustomerBlanketPOId > 0) { CustomerBlanketPOHistory.ViewByID(data[0].CustomerBlanketPOId, Id, Type, result); }
                  else { RR.emptyFunction(req.body, result); }
                },
              ],
                function (err, results) {
                  if (err) {
                    Reqresponse.printResponse(res, err, null);
                  }
                  else {
                    //   console.log(results[5].length);
                    //   console.log(results[5][0].InvoiceId);
                    //   console.log(results[6].length);
                    if (results[5].length > 0 && results[5][0].InvoiceId > 0 && results[6].length > 0) {

                      var SOId = results[6].length > 0 ? results[6][0].SOId : 0;
                      var SOItemArray = []; var BlanketPOExcludeAmount = 0;
                      // New Code Start
                      // var sqldataSOI = InvoiceItem.view(req.body.InvoiceId); //SalesOrderItem.view(req.body.SOId);
                      // var sqldataII = SalesOrderItem.view(Firstdata[0].SOId);
                      var sqldataSOI = SalesOrderItem.view(req.body.SOId);
                      var sqldataII = InvoiceItemModel.GetInvoiceItemBySOId(req.body.SOId);
                      con.query(sqldataSOI, (errSOI, datasqlSOI) => {
                        con.query(sqldataII, (errII, datasqlII) => {
                          var resultArray = Object.values(JSON.parse(JSON.stringify(datasqlII)))
                          // console.log("~~~~~~one~~~~~~")
                          // console.log(datasqlSOI);
                          // console.log("~~~~~~two~~~~~~")
                          // console.log(datasqlII);
                          // console.log("~~~~~~three~~~~~~")
                          datasqlSOI.forEach(elementSO => {

                            var ItemObj = {};
                            // var dataObj = i < data.length ? data[i] : {};
                            var InvoiceItemObj = elementSO; //req.body.SalesOrderItem[i];
                            BlanketPOExcludeAmount += InvoiceItemObj.IsExcludeFromBlanketPO == 1 ? InvoiceItemObj.Price : 0;
                            // console.log("~~~~~~~~~~~~")
                            const availableVal = resultArray.find(el => el.SOItemId === elementSO.SOItemId);
                            // console.log("elementSO");
                            // console.log(elementSO.SOItemId);
                            // console.log(elementSO);
                            if (availableVal) {
                              //console.log("inside")
                              ItemObj.InvoiceId = req.body.InvoiceId;
                              ItemObj.InvoiceItemId = availableVal.InvoiceItemId;
                              ItemObj.SOItemId = elementSO.SOItemId; //results[6][i].SOItemId > 0 ? results[6][i].SOItemId : -1;
                              ItemObj.SOId = SOId;
                              ItemObj.PartId = InvoiceItemObj.PartId;
                              ItemObj.PartNo = InvoiceItemObj.PartNo;
                              ItemObj.PartItemId = 0;
                              ItemObj.Description = InvoiceItemObj.Description;
                              ItemObj.WarrantyPeriod = InvoiceItemObj.WarrantyPeriod;
                              ItemObj.LeadTime = InvoiceItemObj.LeadTime;
                              ItemObj.Quantity = InvoiceItemObj.Quantity;
                              ItemObj.Rate = InvoiceItemObj.Rate;
                              ItemObj.Discount = InvoiceItemObj.Discount;
                              ItemObj.Tax = InvoiceItemObj.Tax;
                              ItemObj.Price = InvoiceItemObj.Price;
                              ItemObj.DeliveryDate = InvoiceItemObj.DeliveryDate;
                              ItemObj.AllowShipment = InvoiceItemObj.AllowShipment;
                              ItemObj.ItemStatus = InvoiceItemObj.ItemStatus;
                              ItemObj.IsExcludeFromBlanketPO = InvoiceItemObj.IsExcludeFromBlanketPO;

                              ItemObj.ItemTaxPercent = InvoiceItemObj.ItemTaxPercent;
                              ItemObj.ItemLocalCurrencyCode = InvoiceItemObj.ItemLocalCurrencyCode;
                              ItemObj.ItemExchangeRate = InvoiceItemObj.ItemExchangeRate;
                              ItemObj.ItemBaseCurrencyCode = InvoiceItemObj.ItemBaseCurrencyCode;
                              ItemObj.BasePrice = InvoiceItemObj.BasePrice;
                              ItemObj.BaseRate = InvoiceItemObj.BaseRate;
                              ItemObj.BaseTax = InvoiceItemObj.BaseTax;

                              SOItemArray.push(ItemObj);
                            } else {
                              // console.log("else side")
                              ItemObj.InvoiceId = req.body.InvoiceId;
                              ItemObj.SOId = SOId;
                              ItemObj.SOItemId = elementSO.SOItemId;
                              ItemObj.PartId = InvoiceItemObj.PartId;
                              ItemObj.PartNo = InvoiceItemObj.PartNo;
                              ItemObj.PartItemId = 0;
                              ItemObj.Description = InvoiceItemObj.Description;
                              ItemObj.WarrantyPeriod = InvoiceItemObj.WarrantyPeriod;
                              ItemObj.LeadTime = InvoiceItemObj.LeadTime;
                              ItemObj.Quantity = InvoiceItemObj.Quantity;
                              ItemObj.Rate = InvoiceItemObj.Rate;
                              ItemObj.Discount = InvoiceItemObj.Discount;
                              ItemObj.Tax = InvoiceItemObj.Tax;
                              ItemObj.Price = InvoiceItemObj.Price;
                              ItemObj.DeliveryDate = InvoiceItemObj.DeliveryDate;
                              ItemObj.AllowShipment = InvoiceItemObj.AllowShipment;
                              ItemObj.ItemStatus = InvoiceItemObj.ItemStatus;
                              ItemObj.IsExcludeFromBlanketPO = InvoiceItemObj.IsExcludeFromBlanketPO;

                              ItemObj.ItemTaxPercent = InvoiceItemObj.ItemTaxPercent;
                              ItemObj.ItemLocalCurrencyCode = InvoiceItemObj.ItemLocalCurrencyCode;
                              ItemObj.ItemExchangeRate = InvoiceItemObj.ItemExchangeRate;
                              ItemObj.ItemBaseCurrencyCode = InvoiceItemObj.ItemBaseCurrencyCode;
                              ItemObj.BasePrice = InvoiceItemObj.BasePrice;
                              ItemObj.BaseRate = InvoiceItemObj.BaseRate;
                              ItemObj.BaseTax = InvoiceItemObj.BaseTax;

                              SOItemArray.push(ItemObj);
                            }
                          });
                          // console.log("checking.....");
                          //console.log(SOItemArray);
                          req.body.SOId = SOId;
                          req.body.InvoiceItem = SOItemArray;
                          // console.log("@@@@@@&&&&&&&&&@@@@")
                          // console.log(SOItemArray);
                          const objSO = new SalesOrder({
                            // CustomerPONo: req.body.CustomerPONo,
                            authuser: req.body.authuser,
                            SubTotal: req.body.SubTotal,
                            AHFees: req.body.AHFees,
                            TaxPercent: req.body.TaxPercent,
                            TotalTax: req.body.TotalTax,
                            Discount: req.body.Discount,
                            Shipping: req.body.Shipping,
                            AdvanceAmount: 0,
                            GrandTotal: req.body.GrandTotal,
                            BlanketPONetAmount: parseInt(req.body.GrandTotal) - parseInt(BlanketPOExcludeAmount),
                            BlanketPOExcludeAmount: BlanketPOExcludeAmount,
                            SOId: req.body.SOId,
                            BaseCurrencyCode: req.body.BaseCurrencyCode,
                            BaseGrandTotal: req.body.BaseGrandTotal,
                            ExchangeRate: req.body.ExchangeRate,
                            LocalCurrencyCode: req.body.LocalCurrencyCode,
                          });

                          async.parallel([
                            function (result) { SalesOrder.UpdateNonRRAndNonMROSO(objSO, result); },
                            //// function (result) { SalesOrderItem.UpdateSalesOrderItem(req.body, result); },
                            function (result) { InvoiceItemModel.Update(req.body, result); },
                          ],
                            function (err, results) {
                              if (err) {
                                Reqresponse.printResponse(res, err, null);
                              }
                            });
                        })

                      });

                      // New code End
                    }
                    //MRO Invoice Update only
                    else {
                      async.parallel([
                        function (result) { InvoiceItemModel.Update(req.body, result); },
                      ],
                        function (err, results) {
                          if (err) {
                            Reqresponse.printResponse(res, err, null);
                          }
                        });
                    }
                    if (results[7].length > 0 && Type != "MRO") {
                      var Amount = results[7][0].Amount > 0 ? parseFloat(results[7][0].Amount).toFixed(2) : 0;
                      var BlanketPOHistoryId = results[7][0].BlanketPOHistoryId > 0 ? results[7][0].BlanketPOHistoryId : 0;
                      var BlanketPOId = results[7][0].BlanketPOId > 0 ? results[7][0].BlanketPOId : 0;

                      if (Amount != parseFloat(req.body.BlanketPONetAmount).toFixed(2)) {
                        var DifferenceAmount = parseFloat(req.body.BlanketPONetAmount) - parseFloat(Amount);
                        const BPOHLog = new CustomerBlanketPOHistoryLog({
                          authuser: req.body.authuser,
                          BlanketPOHistoryId: BlanketPOHistoryId,
                          DifferenceAmount: DifferenceAmount,
                          Amount: Amount,
                          BlanketPONetAmount: req.body.BlanketPONetAmount
                        });
                        async.parallel([
                          function (result) { CustomerBlanketPO.UpdateCurrentBalanceFromSOAndInvoice(BlanketPOId, DifferenceAmount, result); },
                          function (result) { CustomerBlanketPOHistory.UpdateAmountAndCurrentBalance(BlanketPOHistoryId, DifferenceAmount, TokenUserId, result); },
                          function (result) { CustomerBlanketPOHistoryLog.Create(BPOHLog, result); },
                        ],
                          function (err, results) {
                            if (err) {
                              Reqresponse.printResponse(res, err, null);
                            }
                          });
                      }
                    }

                    Reqresponse.printResponse(res, null, { data: results[0] });
                  }
                  // Reqresponse.printResponse(res, err, { data: results[0] });
                });
            } else {
              Reqresponse.printResponse(res, { msg: "Failed to save Invoice due to Insufficient amount in Blanket PO. Please contact admin!" }, null);
            }
          });
        });
      }
      else {
        Reqresponse.printResponse(res, { msg: "no record" }, null);
      }
    });
  }
};

// Get server side list
exports.getInvoiceListByServerSide = (req, res) => {
  Invoice.getInvoiceListByServerSide(new Invoice(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// Get getDue List Of Invoice
exports.getDueListOfInvoice = (req, res) => {
  Invoice.getDueListOfInvoice(new Invoice(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// Get customer invoice amount
exports.getCustomerInvoiceStatstics = (req, res) => {
  if (req.body.hasOwnProperty('CustomerId')) {
    Invoice.getCustomerInvoiceStatstics(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Customer Id is required" }, null);
  }
};



// Get the list of parts LPP based on the customer
exports.listPartsLPP = (req, res) => {
  if (req.body.hasOwnProperty('PartId') || req.body.hasOwnProperty('CustomerId')) {
    Invoice.listPartsLPP(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Invalid request parameter" }, null);
  }
};

exports.View = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var IdentityType = 0;
    Invoice.findById(req.body.InvoiceId, IdentityType, req.body.IsDeleted, req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.UpdateNonRRAndNonMROCustomerPONoInInvoice = (req, res) => {

  async.parallel([
    function (result) { Invoice.GetCustomerBlanketPOIdFromInvoice(req.body.InvoiceId, result); },
    function (result) {
      if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {
        CustomerBlanketPO.GetCurrentBalance(req.body.CustomerBlanketPOId, result);
      }
      else { RR.emptyFunction(req.body, result); }
    },
    function (result) { SalesOrder.IsExistRRDetailForInvoiceId(req.body.InvoiceId, result); },
    function (result) { con.query(Invoice.SaveCustomerPoNo(new Invoice(req.body)), result); },
    function (result) { con.query(Invoice.GetBlanketPONetAmountAndExcludeAmt(req.body.InvoiceId), result); },
  ],
    function (err, results) {
      if (err)
        Reqresponse.printResponse(res, err, null);
      else {
        req.body.BlanketPONetAmount = (results[4][0].length > 0 && results[4][0][0].BlanketPONetAmount) ? results[4][0][0].BlanketPONetAmount : 0;
        req.body.BlanketPOExcludeAmount = (results[4][0].length > 0 && results[4][0][0].BlanketPOExcludeAmount) ? results[4][0][0].BlanketPOExcludeAmount : 0;
        // console.log("@@@@@@@@req.body.BlanketPONetAmount&&&&&");
        // console.log(req.body.BlanketPONetAmount);
        // console.log(req.body.BlanketPOExcludeAmount);
        var _CustomerBlanketPOId = results[0].length > 0 ? results[0][0].CustomerBlanketPOId : 0;
        req.body.CurrentBalance = results[1].length > 0 ? results[1][0].CurrentBalance : 0;
        var RRId = 0;
        if (results[2].length) {
          RRId = results[2][0].RRId > 0 ? results[2][0].RRId : 0;
          req.body.SOId = results[2][0].SOId > 0 ? results[2][0].SOId : 0;
          req.body.QuoteId = results[2][0].QuoteId > 0 ? results[2][0].QuoteId : 0;
        }
        var boolean = true;
        if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {
          if (req.body.CustomerBlanketPOId > 0 && _CustomerBlanketPOId > 0 && req.body.CustomerBlanketPOId == _CustomerBlanketPOId) {
            console.log("No Action");
          }
          else if (req.body.CustomerBlanketPOId > 0 && _CustomerBlanketPOId > 0 && req.body.CustomerBlanketPOId != _CustomerBlanketPOId) {
            // req.body.BlanketPONetAmount = req.body.QuoteAmount;
            boolean = parseFloat(req.body.BlanketPONetAmount) <= parseFloat(req.body.CurrentBalance) ? true : false;
            if (boolean) {
              CustomerBlanketPO.GetCurrentBalance(_CustomerBlanketPOId, (err, data) => {
                if (err) {
                  Reqresponse.printResponse(res, err, null);
                }
                if (data.length > 0) {
                  var RefundHistoryObj = new CustomerBlanketPOHistory({
                    authuser: req.body.authuser,
                    BlanketPOId: _CustomerBlanketPOId,
                    RRId: req.body.RRId > 0 ? req.body.RRId : 0,
                    MROId: req.body.MROId > 0 ? req.body.MROId : 0,
                    PaymentType: 1,
                    Amount: parseFloat(req.body.BlanketPONetAmount),
                    CurrentBalance: parseFloat(data[0].CurrentBalance) + parseFloat(req.body.BlanketPONetAmount),
                    QuoteId: req.body.QuoteId > 0 ? req.body.QuoteId : 0,
                    Comments: req.body.Comments,
                    LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                    ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                    BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                    BaseAmount: parseFloat(req.body.BlanketPONetAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                    BaseCurrentBalance: (parseFloat(data[0].CurrentBalance) + parseFloat(req.body.BlanketPONetAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
                  });
                  // console.log(RefundHistoryObj);
                  var DebitHistoryObj = new CustomerBlanketPOHistory({
                    authuser: req.body.authuser,
                    BlanketPOId: req.body.CustomerBlanketPOId,
                    RRId: req.body.RRId > 0 ? req.body.RRId : 0,
                    MROId: req.body.MROId > 0 ? req.body.MROId : 0,
                    PaymentType: 2,
                    Amount: parseFloat(req.body.BlanketPONetAmount),
                    CurrentBalance: parseFloat(req.body.CurrentBalance) - parseFloat(req.body.BlanketPONetAmount),
                    QuoteId: req.body.QuoteId > 0 ? req.body.QuoteId : 0,
                    Comments: req.body.Comments,
                    LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                    ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                    BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                    BaseAmount: parseFloat(req.body.BlanketPONetAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                    BaseCurrentBalance: (parseFloat(req.body.CurrentBalance) - parseFloat(req.body.BlanketPONetAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
                  });
                  // console.log(DebitHistoryObj);
                  async.parallel([
                    function (result) { CustomerBlanketPOHistory.Create(RefundHistoryObj, result); },
                    function (result) { CustomerBlanketPO.Refund(_CustomerBlanketPOId, req.body.BlanketPONetAmount, result); },
                    function (result) { CustomerBlanketPO.UpdateCurrentBalance(req.body.CustomerBlanketPOId, req.body.BlanketPONetAmount, result); },
                    function (result) { Invoice.UpdateCustomerBlanketPOIdToInvoice(req.body, result); },
                    function (result) { CustomerBlanketPOHistory.Create(DebitHistoryObj, result); },
                    function (result) {
                      if (req.body.SOId > 0) { SalesOrder.UpdateCustomerBlanketPOIdToSO(new SalesOrder(req.body), result); }
                      else { RR.emptyFunction(req.body, result); }
                    },
                    function (result) {
                      if (RRId > 0) { RR.UpdateCustomerBlanketPOIdToRR(req.body.CustomerBlanketPOId, req.body.CustomerPONo, RRId, result); }
                      else { RR.emptyFunction(req.body, result); }
                    },
                    function (result) {
                      if (req.body.CustomerBlanketPOId > 0) {
                        con.query(Invoice.UpdateBlanketPONetAmtAndExcludeAmt(req.body.BlanketPONetAmount, req.body.BlanketPOExcludeAmount, req.body.InvoiceId), result);
                      }
                      else { RR.emptyFunction(req.body, result); }
                    },
                  ],
                    function (err, results) {
                      if (err) {
                        Reqresponse.printResponse(res, err, null);
                      }
                    });
                }
              });
            }
          }
          else {
            req.body.BlanketPONetAmount = req.body.QuoteAmount;
            boolean = parseFloat(req.body.BlanketPONetAmount) <= parseFloat(req.body.CurrentBalance) ? true : false;
            if (boolean) {
              var DebitHistoryObjCreate = new CustomerBlanketPOHistory({
                authuser: req.body.authuser,
                BlanketPOId: req.body.CustomerBlanketPOId,
                RRId: req.body.RRId > 0 ? req.body.RRId : 0,
                MROId: req.body.MROId > 0 ? req.body.MROId : 0,
                PaymentType: 2,
                Amount: parseFloat(req.body.BlanketPONetAmount),
                CurrentBalance: parseFloat(req.body.CurrentBalance) - parseFloat(req.body.BlanketPONetAmount),
                QuoteId: req.body.QuoteId > 0 ? req.body.QuoteId : 0,
                Comments: req.body.Comments,
                LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                BaseAmount: parseFloat(req.body.BlanketPONetAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                BaseCurrentBalance: (parseFloat(req.body.CurrentBalance) - parseFloat(req.body.BlanketPONetAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
              });
              // console.log(DebitHistoryObjCreate);
              async.parallel([
                function (result) { CustomerBlanketPO.UpdateCurrentBalance(req.body.CustomerBlanketPOId, req.body.BlanketPONetAmount, result); },
                function (result) { CustomerBlanketPOHistory.Create(DebitHistoryObjCreate, result); },
                function (result) { Invoice.UpdateCustomerBlanketPOIdToInvoice(req.body, result); },
                function (result) {
                  if (req.body.SOId > 0) { SalesOrder.UpdateCustomerBlanketPOIdToSO(new SalesOrder(req.body), result); }
                  else { RR.emptyFunction(req.body, result); }
                },
                function (result) {
                  if (RRId > 0) { RR.UpdateCustomerBlanketPOIdToRR(req.body.CustomerBlanketPOId, req.body.CustomerPONo, RRId, result); }
                  else { RR.emptyFunction(req.body, result); }
                },
                function (result) {
                  if (req.body.CustomerBlanketPOId > 0) {
                    con.query(Invoice.UpdateBlanketPONetAmtAndExcludeAmt(req.body.BlanketPONetAmount, req.body.BlanketPOExcludeAmount, req.body.InvoiceId), result);
                  }
                  else { RR.emptyFunction(req.body, result); }
                },
              ],
                function (err, results) {
                  if (err) {
                    Reqresponse.printResponse(res, err, null);
                  }
                });
            }
          }
        }
        else if (req.body.hasOwnProperty('CustomerBlanketPOId') == false) {

          if (_CustomerBlanketPOId > 0) {
            CustomerBlanketPO.GetCurrentBalance(_CustomerBlanketPOId, (err, data) => {
              if (err) {
                Reqresponse.printResponse(res, err, null);
              }
              // 
              if (data.length > 0) {
                req.body.BlanketPONetAmount = req.body.QuoteAmount;
                var RefundHistoryObj = new CustomerBlanketPOHistory({
                  authuser: req.body.authuser,
                  BlanketPOId: _CustomerBlanketPOId,
                  RRId: req.body.RRId > 0 ? req.body.RRId : 0,
                  MROId: req.body.MROId > 0 ? req.body.MROId : 0,
                  PaymentType: 1,
                  Amount: parseFloat(req.body.BlanketPONetAmount),
                  CurrentBalance: parseFloat(data[0].CurrentBalance) + parseFloat(req.body.BlanketPONetAmount),
                  QuoteId: req.body.QuoteId > 0 ? req.body.QuoteId : 0,
                  Comments: req.body.Comments,
                  LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                  ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                  BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                  BaseAmount: parseFloat(req.body.BlanketPONetAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                  BaseCurrentBalance: (parseFloat(data[0].CurrentBalance) + parseFloat(req.body.BlanketPONetAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
                });
                // console.log(RefundHistoryObj);
                req.body.CustomerBlanketPOId = 0;
                async.parallel([
                  function (result) { CustomerBlanketPOHistory.Create(RefundHistoryObj, result); },
                  function (result) { CustomerBlanketPO.Refund(_CustomerBlanketPOId, req.body.BlanketPONetAmount, result); },
                  function (result) { Invoice.UpdateCustomerBlanketPOIdToInvoice(req.body, result); },
                  function (result) {
                    if (req.body.SOId > 0) { SalesOrder.UpdateCustomerBlanketPOIdToSO(new SalesOrder(req.body), result); }
                    else { RR.emptyFunction(req.body, result); }
                  },
                  function (result) {
                    if (RRId > 0) { RR.UpdateCustomerBlanketPOIdToRR(req.body.CustomerBlanketPOId, req.body.CustomerPONo, RRId, result); }
                    else { RR.emptyFunction(req.body, result); }
                  },
                  function (result) {
                    if (req.body.CustomerBlanketPOId > 0) {
                      con.query(Invoice.UpdateBlanketPONetAmtAndExcludeAmt(req.body.BlanketPONetAmount, req.body.BlanketPOExcludeAmount, req.body.InvoiceId), result);
                    }
                    else { RR.emptyFunction(req.body, result); }
                  },
                ],
                  function (err, results) {
                    if (err) {
                      Reqresponse.printResponse(res, err, null);
                    }
                  });
              }
            });
          } else {
            req.body.CustomerBlanketPOId = 0;
            async.parallel([
              function (result) { Invoice.UpdateCustomerBlanketPOIdToInvoice(req.body, result); },
              function (result) {
                if (req.body.SOId > 0) { SalesOrder.UpdateCustomerBlanketPOIdToSO(new SalesOrder(req.body), result); }
                else { RR.emptyFunction(req.body, result); }
              },
              function (result) {
                if (RRId > 0) { RR.UpdateCustomerBlanketPOIdToRR(req.body.CustomerBlanketPOId, req.body.CustomerPONo, RRId, result); }
                else { RR.emptyFunction(req.body, result); }
              },
            ],
              function (err, results) {
                if (err) {
                  Reqresponse.printResponse(res, err, null);
                }
              });
          }
        }
        else { }
        if (boolean != true)
          Reqresponse.printResponse(res, { msg: "Insufficient BlanketPO balance" }, null);
        else
          Reqresponse.printResponse(res, null, req.body);
      }
    });
};

exports.Create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    Invoice.Create(new Invoice(req.body), (err, data) => {
      if (err) { Reqresponse.printResponse(res, err, null); }

      const objInvoice = new Invoice({
        InvoiceId: data.id,
        authuser: req.body.authuser
      });
      var sqlUpdateInvoiceNo = Invoice.UpdateInvoiceNoById(objInvoice);
      async.parallel([
        function (result) { if (req.body.hasOwnProperty('InvoiceItem')) InvoiceItem.Create(objInvoice.InvoiceId, req.body.InvoiceItem, result); },
        function (result) { con.query(sqlUpdateInvoiceNo, result) },
      ],
        function (err, results) {
          if (err) { Reqresponse.printResponse(res, err, null); }
        });
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.AutoCreate = (req, res) => {
  req.body.SOId = req.body.SOId ? req.body.SOId : 0;
  Invoice.ValidateAlreadyExistRRId(req.body.RRId, req.body.SOId, (err, data4) => {
    if (err) {
      Reqresponse.printResponse(res, err, null);
    }

    if (data4 && data4.length > 0) {
      Reqresponse.printResponse(res, { msg: "Invoice Order Already Created for this RRId :" + req.body.RRId }, null);
    }
    else {
      var getCustId = SalesOrder.viewByRRId(req.body.RRId, req.body.SOId);
      con.query(getCustId, (errCust, resultCust) => {
        if (resultCust.length > 0) {
          let date_ob = new Date();
          date_ob.setDate(date_ob.getDate() + Constants.CONST_DUE_DAYS_INVOICE);

          var sql = SalesOrder.viewByRRId(req.body.RRId, req.body.SOId);
          var sqlSi = SalesOrderItem.viewByRRId(req.body.RRId, req.body.SOId);
          var sqlGetDefaultTerm = TermModel.GetDefaultTerm();
          var getCustomerTermsId = Customers.viewquery(resultCust[0].CustomerId, req.body);
          // console.log("@@@@@@@@@@@@@@@@@@")
          // console.log(resultCust[0])
          // console.log(resultCust[0].CustomerId)
          // console.log(getCustomerTermsId)
          async.parallel([
            function (result) { con.query(sql, result) },
            function (result) { con.query(sqlSi, result) },
            function (result) { con.query(sqlGetDefaultTerm, result) },
            function (result) { con.query(getCustomerTermsId, result) },
          ],
            function (err, results) {
              if (err)
                Reqresponse.printResponse(res, err, null);

              if (results[0][0].length > 0) {
                var InvoiceRes = results[0][0];
                const objInvoice = new Invoice({
                  authuser: req.body.authuser,
                  InvoiceNo: '',
                  SONo: InvoiceRes[0].SONo,
                  SOId: InvoiceRes[0].SOId,
                  CustomerPONo: InvoiceRes[0].CustomerPONo,
                  CustomerBlanketPOId: InvoiceRes[0].CustomerBlanketPOId,
                  RRId: req.body.RRId,
                  RRNo: InvoiceRes[0].RRNo,
                  CustomerId: InvoiceRes[0].CustomerId,
                  InvoiceType: req.body.RRId > 0 ? Constants.CONST_INV_TYPE_REPAIR : Constants.CONST_INV_TYPE_REGULAR,
                  // TermsId: 1,
                  InvoiceDate: cDateTime.getDate(),
                  DueDate: cDateTime.getDate(),
                  ReferenceNo: '',
                  ShipAddressId: InvoiceRes[0].ShipAddressBookId,
                  BillAddressId: InvoiceRes[0].BillAddressBookId,
                  LaborDescription: '',
                  SubTotal: InvoiceRes[0].SubTotal,
                  AHFees: InvoiceRes[0].AHFees,
                  TaxPercent: InvoiceRes[0].TaxPercent,
                  TotalTax: InvoiceRes[0].TotalTax,
                  Discount: InvoiceRes[0].Discount,
                  Shipping: InvoiceRes[0].Shipping,
                  AdvanceAmount: 0,
                  GrandTotal: InvoiceRes[0].GrandTotal,
                  Status: Constants.CONST_INV_STATUS_OPEN,
                  LeadTime: InvoiceRes[0].LeadTime,
                  WarrantyPeriod: InvoiceRes[0].WarrantyPeriod,
                  BlanketPOExcludeAmount: InvoiceRes[0].BlanketPOExcludeAmount,
                  BlanketPONetAmount: InvoiceRes[0].BlanketPONetAmount,
                  LocalCurrencyCode: InvoiceRes[0].LocalCurrencyCode,
                  ExchangeRate: InvoiceRes[0].ExchangeRate,
                  BaseCurrencyCode: InvoiceRes[0].BaseCurrencyCode,
                  BaseGrandTotal: InvoiceRes[0].BaseGrandTotal
                });

                req.body.TermsDays = 0;
                // console.log(results[3][0][0])
                if (results[3][0].length > 0) {
                  objInvoice.TermsId = results[3][0][0].TermsId;
                  req.body.TermsDays = results[3][0][0].TermsDays;
                } else {
                  if (results[2][0].length > 0) {
                    objInvoice.TermsId = results[2][0][0].TermsId;
                    req.body.TermsDays = results[2][0][0].TermsDays;
                  }
                }

                Invoice.Create(objInvoice, (err, data) => {
                  if (err) { Reqresponse.printResponse(res, err, null); }
                  var InvoiceId = data.id;
                  objInvoice.InvoiceId = InvoiceId;
                  var objInvoiceItem = results[1][0];
                  // console.log(objInvoiceItem);
                  var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;
                  //To add SO in notification table                  
                  var NotificationObj = new NotificationModel({
                    authuser: req.body.authuser,
                    RRId: req.body.RRId,
                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
                    NotificationIdentityId: data.id,
                    NotificationIdentityNo: 'INV' + data.id,
                    ShortDesc: 'Customer Invoice Draft Created',
                    Description: 'Customer Invoice Draft created by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
                  });

                  const srr = new RR({
                    authuser: req.body.authuser,
                    RRId: req.body.RRId,
                    CustomerInvoiceNo: 'INV' + data.id,
                    CustomerInvoiceDueDate: date_ob,
                    CustomerInvoiceId: data.id
                  })
                  const GeneralHistoryLogPayload1 = new GeneralHistoryLog({
                    authuser: req.body.authuser,
                    IdentityType: req.body.RRId > 0 ? Constants.CONST_IDENTITY_TYPE_RR : Constants.CONST_IDENTITY_TYPE_QUOTE,
                    IdentityId: req.body.RRId ? req.body.RRId : InvoiceRes[0].QuoteId,
                    RequestBody: JSON.stringify(req.body),
                    Type: req.body.RRId > 0 ? "Invoice - RR - Temp" : "Invoice - QT - Temp",
                    BaseTableRequest: JSON.stringify(objInvoice),
                    ItemTableRequest: JSON.stringify(objInvoiceItem),
                    BaseTableResponse: JSON.stringify(data),
                    ItemTableResponse: JSON.stringify(InvoiceRes[0]),
                    ErrorMessage: JSON.stringify(err),
                    CommonLogMessage: JSON.stringify(InvoiceRes[0])
                  });
                  var sqlUpdateCustomerSONo = RR.UpdateCustomerInvoiceNoByRRID(srr, req.body.TermsDays);
                  //var sqlCusRef = SalesOrderCusReference.ViewCustomerReference(InvoiceRes[0].SOId);
                  var sqlUpdateInvoiceNo = Invoice.UpdateInvoiceNoById(objInvoice);
                  // var sqlContactAddressBook = AddressBook.ViewContactAddressByCustomerId(InvoiceRes[0].CustomerId);
                  // var sqlBillAddressBook = AddressBook.GetBillingAddressIdByCustomerId(InvoiceRes[0].CustomerId);
                  var sqlUpdateInvoiceDueAutoUpdate = Invoice.UpdateInvoiceDueAutoUpdate(InvoiceId, req.body.TermsDays);
                  var sqlUpdatePriceinRR = RR.UpdatePriceQuery(objInvoice);
                  var sqlNotes = Notes.ViewNotes(Constants.CONST_IDENTITY_TYPE_SO, resultCust[0].SOId);
                  async.parallel([
                    function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload1, result); },
                    function (result) { InvoiceItem.Create(InvoiceId, objInvoiceItem, result); },
                    function (result) { con.query(sqlUpdateInvoiceNo, result) },
                    //  function (result) { con.query(sqlCusRef, result) },
                    // function (result) { con.query(sqlContactAddressBook, result) },
                    // function (result) { con.query(sqlBillAddressBook, result) },
                    function (result) { SalesOrder.UpdateIsConvertedToPOBySOId(InvoiceRes[0].SOId, result); },
                    // function (result) { con.query(sqlBillAddressBook, result) },
                    function (result) { con.query(sqlUpdateInvoiceDueAutoUpdate, result) },
                    function (result) { con.query(sqlUpdateCustomerSONo, result) },
                    function (result) { NotificationModel.Create(NotificationObj, result); },
                    function (result) { con.query(sqlUpdatePriceinRR, result) },
                    function (result) { con.query(sqlNotes, result) },

                  ],
                    function (err, results1) {
                      // 
                      const GeneralHistoryLogPayload = new GeneralHistoryLog({
                        authuser: req.body.authuser,
                        IdentityType: req.body.RRId > 0 ? Constants.CONST_IDENTITY_TYPE_RR : Constants.CONST_IDENTITY_TYPE_QUOTE,
                        IdentityId: req.body.RRId ? req.body.RRId : InvoiceRes[0].QuoteId,
                        RequestBody: JSON.stringify(req.body),
                        Type: req.body.RRId > 0 ? "Invoice - RR" : "Invoice - QT",
                        BaseTableRequest: JSON.stringify(objInvoice),
                        ItemTableRequest: JSON.stringify(objInvoiceItem),
                        BaseTableResponse: JSON.stringify(data),
                        ItemTableResponse: JSON.stringify(results1[0]),
                        ErrorMessage: JSON.stringify(err),
                        CommonLogMessage: JSON.stringify(results1)
                      });
                      async.parallel([
                        function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload, result); },
                      ],
                        function (err, results1) {

                        })
                      // 
                      if (err) {
                        console.log(err);
                        Reqresponse.printResponse(res, err, null);
                      }

                      if (results1[7][0].length > 0) {
                        for (var iN = 0; iN < results1[7][0].length; iN++) {
                          var notesData = results1[7][0][iN];
                          notesData.IdentityType = Constants.CONST_IDENTITY_TYPE_INVOICE;
                          notesData.IdentityId = InvoiceId;
                          Notes.create(notesData, (errND, dataND) => {
                          });

                        }
                      }

                      // else {
                      // var objGlobalCustomerReference = results[2][0];
                      // var objContactOrderAddress = results[2][0];
                      // var objBillingOrderAddress = results[3][0];
                      // const objContactOrderAddressinfo = new OrderAddress({
                      //   AddressName: objContactOrderAddress[0].StreetAddress,
                      //   IdentityId: data.id,
                      //   IdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
                      //   AddressType: Constants.CONST_ADDRES_TYPE_CONTACT,
                      //   StreetAddress: objContactOrderAddress[0].StreetAddress,
                      //   SuiteOrApt: objContactOrderAddress[0].SuiteOrApt,
                      //   City: objContactOrderAddress[0].City,
                      //   StateId: objContactOrderAddress[0].StateId,
                      //   CountryId: objContactOrderAddress[0].CountryId,
                      //   Zip: objContactOrderAddress[0].Zip,
                      //   AllowShipment: 0,

                      // });
                      // const objBillingOrderAddressinfo = new OrderAddress({
                      //   AddressName: objBillingOrderAddress[0].StreetAddress,
                      //   IdentityId: data.id,
                      //   IdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
                      //   AddressType: Constants.CONST_ADDRES_TYPE_BILLING,
                      //   StreetAddress: objBillingOrderAddress[0].StreetAddress,
                      //   SuiteOrApt: objBillingOrderAddress[0].SuiteOrApt,
                      //   City: objBillingOrderAddress[0].City,
                      //   StateId: objBillingOrderAddress[0].StateId,
                      //   CountryId: objBillingOrderAddress[0].CountryId,
                      //   Zip: objBillingOrderAddress[0].Zip,
                      //   AllowShipment: 0,

                      // });
                      // async.parallel([
                      //   function (result) { OrderAddress.Create(objContactOrderAddressinfo, result); },
                      //   function (result) { OrderAddress.Create(objBillingOrderAddressinfo, result); },
                      //    function (result) { SalesOrderCusReference.Create(Constants.CONST_IDENTITY_TYPE_INVOICE, data.id, objGlobalCustomerReference, result) }
                      // ],
                      //   function (err, results) {
                      //     if (err) { Reqresponse.printResponse(res, err, null); }
                      //   });
                      // }
                    });
                });
                Reqresponse.printResponse(res, err, { InvoiceInfo: results[0][0], InvoiceItemInfo: results[1][0] });
              } else {
                Reqresponse.printResponse(res, { msg: "Sales Order not found for this RRId" }, null);
              }
            });
        } else {
          Reqresponse.printResponse(res, { msg: "Sales Order not found for this RRId" }, null);
        }
      });
    }
  });
}

exports.ApproveInvoice = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    Invoice.ApproveInvoice(new Invoice(req.body), (err, data) => {
      if (data.id > 0) {
        var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;
        var NotificationObj = new NotificationModel({
          authuser: req.body.authuser,
          RRId: req.body.InvoiceId,
          NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
          NotificationIdentityId: req.body.InvoiceId,
          NotificationIdentityNo: 'IO' + req.body.InvoiceId,
          ShortDesc: 'Customer Invoice Approved',
          Description: 'Customer Invoice Approved by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
        });
        NotificationModel.Create(NotificationObj, (err, data1) => {
        });
      }
      Reqresponse.printResponse(res, err, data);
    });
  }
};


 

// To cancel the invoice
exports.CancelInvoice = (req, res) => {
  if (req.body.hasOwnProperty('InvoiceId')) {
    var diffAmount = 0;
    var add = false;
    var sub = false;
    Invoice.getInvSoBPODetails(req.body.InvoiceId, (err, data) => {
      //console.log(data);
      //console.log(data.InvInfo);
      //console.log(data.SoInfo);
      if (data && data.InvInfo && data.SoInfo) {
        if (data.InvInfo.BlanketPONetAmount && data.SoInfo.SOBlanketPONetAmount) {
          add = data.SoInfo.SOBlanketPONetAmount > data.InvInfo.BlanketPONetAmount ? true : false;
          sub = data.InvInfo.BlanketPONetAmount > data.SoInfo.SOBlanketPONetAmount ? true : false;
          // console.log(add);
          // console.log(sub);
          if (add) {
            // console.log("one");
            diffAmount = data.SoInfo.SOBlanketPONetAmount - data.InvInfo.BlanketPONetAmount;
          } else if (sub) {
            //console.log("two");
            diffAmount = data.InvInfo.BlanketPONetAmount - data.SoInfo.SOBlanketPONetAmount;
          } else {
            // console.log("three");
            diffAmount = 0;
          }
        }
      }
      var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;
      async.parallel([
        function (result) { Invoice.CancelInvoice(new Invoice(req.body), result); },
        function (result) { CustomerBlanketPOModel.GetCurrentBalance(data.InvInfo.CustomerBlanketPOId, result); }
      ], function (err, results) {
        if (results[0].id > 0) {
          var NotificationObj = new NotificationModel({
            authuser: req.body.authuser,
            RRId: req.body.InvoiceId,
            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
            NotificationIdentityId: req.body.InvoiceId,
            NotificationIdentityNo: 'IO' + req.body.InvoiceId,
            ShortDesc: 'Customer Invoice Cancelled',
            Description: 'Customer Invoice Cancelled by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
          });
          NotificationModel.Create(NotificationObj, (err, data1) => {
          });
        }
        var RefundHistoryObj = new CustomerBlanketPOHistoryModel({
          authuser: req.body.authuser,
          BlanketPOId: data.InvInfo.CustomerBlanketPOId,
          RRId: data.InvInfo.RRId,
          MROId: 0,
          PaymentType: 1,
          Amount: parseFloat(data.InvInfo.BlanketPONetAmount),
          CurrentBalance: parseFloat(results[0].CurrentBalance) + parseFloat(data.InvInfo.BlanketPONetAmount),
          QuoteId: data.SoInfo.QuoteId,
          Comments: "Refund from invoive delete",
          LocalCurrencyCode: data.InvInfo.LocalCurrencyCode ? data.InvInfo.LocalCurrencyCode : 'USD',
          ExchangeRate: data.InvInfo.ExchangeRate ? data.InvInfo.ExchangeRate : 1,
          BaseCurrencyCode: data.InvInfo.BaseCurrencyCode ? data.InvInfo.BaseCurrencyCode : 'USD',
          BaseAmount: parseFloat(data.InvInfo.BlanketPONetAmount) * parseFloat(data.InvInfo.ExchangeRate ? data.InvInfo.ExchangeRate : 1),
          BaseCurrentBalance: (parseFloat(results[0].CurrentBalance) + parseFloat(data.InvInfo.BlanketPONetAmount)) * parseFloat(data.InvInfo.ExchangeRate ? data.InvInfo.ExchangeRate : 1)
        });

        var debitAmount = parseFloat(results[0].CurrentBalance) + parseFloat(data.InvInfo.BlanketPONetAmount);
        var DebitHistoryObj = new CustomerBlanketPOHistoryModel({
          authuser: req.body.authuser,
          BlanketPOId: data.SoInfo.SOCustomerBlanketPOId,
          RRId: data.SoInfo.RRId,
          MROId: 0,
          PaymentType: 2,
          Amount: parseFloat(data.SoInfo.SOBlanketPONetAmount),
          CurrentBalance: parseFloat(debitAmount) - parseFloat(data.SoInfo.SOBlanketPONetAmount),
          QuoteId: data.SoInfo.QuoteId,
          Comments: "Invoice delete, Debit from SO",
          LocalCurrencyCode: data.SoInfo.LocalCurrencyCode ? data.SoInfo.LocalCurrencyCode : 'USD',
          ExchangeRate: data.SoInfo.ExchangeRate ? data.SoInfo.ExchangeRate : 1,
          BaseCurrencyCode: data.SoInfo.BaseCurrencyCode ? data.SoInfo.BaseCurrencyCode : 'USD',
          BaseAmount: parseFloat(data.SoInfo.SOBlanketPONetAmount) * parseFloat(data.SoInfo.ExchangeRate ? data.SoInfo.ExchangeRate : 1),
          BaseCurrentBalance: (parseFloat(debitAmount) - parseFloat(data.SoInfo.SOBlanketPONetAmount)) * parseFloat(data.SoInfo.ExchangeRate ? data.SoInfo.ExchangeRate : 1)
        });
        // if(data.InvInfo.CustomerBlanketPOId > 0 && diffAmount > 0 && data.InvInfo.RRId > 0) {
        //   console.log("@@@@MRO MRO MRO MRO MRO@@@@");
        //   if(add){
        //     CustomerBlanketPOModel.UpdateCurrentBalanceFromSOAndInvoice(data.InvInfo.CustomerBlanketPOId, diffAmount, result);

        //   }else{
        //     CustomerBlanketPOModel.Refund(data.InvInfo.CustomerBlanketPOId, diffAmount, result);
        //   }

        // }
        if (data.InvInfo.CustomerBlanketPOId > 0 && diffAmount > 0 && data.InvInfo.RRId > 0) {
          async.parallel([
            function (result) { CustomerBlanketPOHistoryModel.Create(RefundHistoryObj, result); },
            function (result) { CustomerBlanketPOModel.Refund(data.InvInfo.CustomerBlanketPOId, data.InvInfo.BlanketPONetAmount, result); },
            function (result) { CustomerBlanketPOModel.UpdateCurrentBalance(data.SoInfo.SOCustomerBlanketPOId, data.SoInfo.SOBlanketPONetAmount, result); },
            function (result) { CustomerBlanketPOHistoryModel.Create(DebitHistoryObj, result); },

            function (result) { CustomerBlanketPOHistoryModel.Create(DebitHistoryObj, result); },
          ],
            function (err, results) {
              if (err) {
                Reqresponse.printResponse(res, err, null);
              }
            });
        }
      });

      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Invoice Id is required" }, null);
  }
};
exports.SendInvoiceEmailByInvoiceList = (req, res) => {
  Invoice.SendInvoiceEmailByInvoiceList(req.body.InvoiceList, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.SendInvoiceEmail = (req, res) => {
  SendEmail.SendEmailTo(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To delete Invoice
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('InvoiceId')) {
    var diffAmount = 0;
    var add = false;
    var sub = false;
    Invoice.getInvSoBPODetails(req.body.InvoiceId, (err, data) => {
      //console.log(data);
      //console.log(data.InvInfo);
      //console.log(data.SoInfo);
      if (data && data.InvInfo && data.SoInfo) {
        if (data.InvInfo.BlanketPONetAmount && data.SoInfo.SOBlanketPONetAmount) {
          add = data.SoInfo.SOBlanketPONetAmount > data.InvInfo.BlanketPONetAmount ? true : false;
          sub = data.InvInfo.BlanketPONetAmount > data.SoInfo.SOBlanketPONetAmount ? true : false;
          //console.log(add);
          // console.log(sub);
          if (add) {
            //console.log("one");
            diffAmount = data.SoInfo.SOBlanketPONetAmount - data.InvInfo.BlanketPONetAmount;
          } else if (sub) {
            // console.log("two");
            diffAmount = data.InvInfo.BlanketPONetAmount - data.SoInfo.SOBlanketPONetAmount;
          } else {
            //console.log("three");
            diffAmount = 0;
          }
        }
      }
      async.parallel([
        function (result) { Invoice.remove(req.body.InvoiceId, result); },
        function (result) { CustomerBlanketPOModel.GetCurrentBalance(data.InvInfo.CustomerBlanketPOId, result); }
      ], function (err, results) {
       // console.log(results);
       // console.log("Refund from invoive delete");
        var RefundHistoryObj = new CustomerBlanketPOHistoryModel({
          authuser: req.body.authuser,
          BlanketPOId: data.InvInfo.CustomerBlanketPOId,
          RRId: data.InvInfo.RRId,
          MROId: 0,
          PaymentType: 1,
          Amount: parseFloat(data.InvInfo.BlanketPONetAmount),
          CurrentBalance: parseFloat(results[0].CurrentBalance) + parseFloat(data.InvInfo.BlanketPONetAmount),
          QuoteId: data.SoInfo.QuoteId,
          Comments: "Refund from invoive deleted!",
          LocalCurrencyCode: data.InvInfo.LocalCurrencyCode ? data.InvInfo.LocalCurrencyCode : 'USD',
          ExchangeRate: data.InvInfo.ExchangeRate ? data.InvInfo.ExchangeRate : 1,
          BaseCurrencyCode: data.InvInfo.BaseCurrencyCode ? data.InvInfo.BaseCurrencyCode : 'USD',
          BaseAmount: parseFloat(data.InvInfo.BlanketPONetAmount) * parseFloat(data.InvInfo.ExchangeRate ? data.InvInfo.ExchangeRate : 1),
          BaseCurrentBalance: (parseFloat(results[0].CurrentBalance) + parseFloat(data.InvInfo.BlanketPONetAmount)) * parseFloat(data.InvInfo.ExchangeRate ? data.InvInfo.ExchangeRate : 1)
        });

        var debitAmount = parseFloat(results[0].CurrentBalance) + parseFloat(data.InvInfo.BlanketPONetAmount);
        var DebitHistoryObj = new CustomerBlanketPOHistoryModel({
          authuser: req.body.authuser,
          BlanketPOId: data.SoInfo.SOCustomerBlanketPOId,
          RRId: data.SoInfo.RRId,
          MROId: 0,
          PaymentType: 2,
          Amount: parseFloat(data.SoInfo.SOBlanketPONetAmount),
          CurrentBalance: parseFloat(debitAmount) - parseFloat(data.SoInfo.SOBlanketPONetAmount),
          QuoteId: data.SoInfo.QuoteId,
          Comments: "Invoice deleted, Debit from SO!",
          LocalCurrencyCode: data.SoInfo.LocalCurrencyCode ? data.SoInfo.LocalCurrencyCode : 'USD',
          ExchangeRate: data.SoInfo.ExchangeRate ? data.SoInfo.ExchangeRate : 1,
          BaseCurrencyCode: data.SoInfo.BaseCurrencyCode ? data.SoInfo.BaseCurrencyCode : 'USD',
          BaseAmount: parseFloat(data.SoInfo.SOBlanketPONetAmount) * parseFloat(data.SoInfo.ExchangeRate ? data.SoInfo.ExchangeRate : 1),
          BaseCurrentBalance: (parseFloat(debitAmount) - parseFloat(data.SoInfo.SOBlanketPONetAmount)) * parseFloat(data.SoInfo.ExchangeRate ? data.SoInfo.ExchangeRate : 1)
        });
        // if(data.InvInfo.CustomerBlanketPOId > 0 && diffAmount > 0 && data.InvInfo.RRId > 0) {
        //   console.log("@@@@MRO MRO MRO MRO MRO@@@@");
        //   if(add){
        //     CustomerBlanketPOModel.UpdateCurrentBalanceFromSOAndInvoice(data.InvInfo.CustomerBlanketPOId, diffAmount, result);

        //   }else{
        //     CustomerBlanketPOModel.Refund(data.InvInfo.CustomerBlanketPOId, diffAmount, result);
        //   }

        // }
        if (data.InvInfo.CustomerBlanketPOId > 0 && diffAmount > 0 && data.InvInfo.RRId > 0) {
          async.parallel([
            function (result) { CustomerBlanketPOHistoryModel.Create(RefundHistoryObj, result); },
            function (result) { CustomerBlanketPOModel.Refund(data.InvInfo.CustomerBlanketPOId, data.InvInfo.BlanketPONetAmount, result); },
            function (result) { CustomerBlanketPOModel.UpdateCurrentBalance(data.SoInfo.SOCustomerBlanketPOId, data.SoInfo.SOBlanketPONetAmount, result); },
            function (result) { CustomerBlanketPOHistoryModel.Create(DebitHistoryObj, result); },
          ],
            function (err, results) {
             // console.log(results);
              if (err) {
                Reqresponse.printResponse(res, err, null);
              }
            });
        }
      });

      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Invoice Id is required" }, null);
  }
};
// To Delete InvoiceItem
exports.DeleteInvoiceItem = (req, res) => {

  var TokenUserId = getLogInUserId(req.body);
  if (req.body.hasOwnProperty('InvoiceItemId')) {
    if (req.body.InvoiceItemId != "") {
      async.parallel([
        function (result) { InvoiceItem.DeleteInvoiceItem(req.body.InvoiceItemId, result); }
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }

          InvoiceItem.SelectNewCalculationAfterInvoiceItemDelete(req.body.InvoiceId, req.body.InvoiceItemId, (err, Rdata) => {
            if (err) {
              Reqresponse.printResponse(res, err, null);
            }
            if (Rdata.res[0]) {
              Invoice.UpdateInvoiceByInvoiceIdAfterInvoiceItemDelete(Rdata.res[0], (err, data) => {
              });
              SalesOrderItem.GetSOItemId(req.body.InvoiceItemId, (err, Ddata) => {//
                if (err) {
                  Reqresponse.printResponse(res, err, null);
                }
                if (Ddata.length > 0 && Ddata[0].SOItemId > 0) {
                  async.parallel([
                    function (result) { SalesOrderItem.DeleteSOItem(Ddata[0].SOItemId, result); },
                    function (result) {
                      if (req.body.hasOwnProperty('TaxPercent') && req.body.TaxPercent > 0) {
                        con.query(SalesOrder.UpdateTaxPercent(req.body.TaxPercent, Ddata[0].SOId), result)
                      }
                      else {
                        RR.emptyFunction(req.body, result);
                      }
                    },
                  ],
                    function (err, results) {
                      if (err) {
                        Reqresponse.printResponse(res, err, null);
                      }
                      SalesOrderItem.SelectNewCalculationAfterSOItemDelete(Ddata[0].SOId, Ddata[0].SOItemId, (err, Rdata) => {
                        if (err) {
                          Reqresponse.printResponse(res, err, null);
                        }
                        if (Rdata.res[0]) {
                          SalesOrder.UpdateAfterSOItemDeleteBySOId(Rdata.res[0], (err, data) => {
                          });
                          //  Reqresponse.printResponse(res, null, { ress: Rdata.res[0] });
                          Invoice.SelectInvoiceStatus(req.body.InvoiceId, (errSIS, dataSIS) => {
                            var Id = 0; var Type = "";
                            if (dataSIS[0].CustomerBlanketPOId > 0) {

                              if (dataSIS[0].RRId > 0) {
                                Id = dataSIS[0].RRId;
                                Type = "RR";
                              }
                              else if (dataSIS[0].MROId > 0) {
                                Id = dataSIS[0].MROId;
                                Type = "MRO";
                              }
                              else if (dataSIS[0].QuoteId > 0) {
                                Id = dataSIS[0].QuoteId;
                                Type = "QUOTE";
                              }
                              else { }
                            }
                            async.parallel([
                              function (result) {
                                if (dataSIS[0].CustomerBlanketPOId > 0) { CustomerBlanketPOHistory.ViewByID(dataSIS[0].CustomerBlanketPOId, Id, Type, result); }
                                else { RR.emptyFunction(req.body, result); }
                              },
                            ], function (errSIS1, resultSIS) {
                              if (resultSIS[0].length > 0) {

                                var Amount = resultSIS[0][0].Amount > 0 ? parseFloat(resultSIS[0][0].Amount).toFixed(2) : 0;
                                var BlanketPOHistoryId = resultSIS[0][0].BlanketPOHistoryId > 0 ? resultSIS[0][0].BlanketPOHistoryId : 0;
                                var BlanketPOId = resultSIS[0][0].BlanketPOId > 0 ? resultSIS[0][0].BlanketPOId : 0;

                                // if (Amount != parseFloat(req.body.BlanketPONetAmount)) {
                                if (Amount != parseFloat(dataSIS[0].BlanketPONetAmount).toFixed(2)) {
                                  var DifferenceAmount = parseFloat(dataSIS[0].BlanketPONetAmount) - parseFloat(Amount);
                                  const BPOHLog = new CustomerBlanketPOHistoryLog({
                                    authuser: req.body.authuser,
                                    BlanketPOHistoryId: BlanketPOHistoryId,
                                    DifferenceAmount: DifferenceAmount,
                                    Amount: Amount,
                                    BlanketPONetAmount: dataSIS[0].BlanketPONetAmount,
                                    authuser: req.authuser
                                  });

                                  async.parallel([
                                    function (result) { CustomerBlanketPO.UpdateCurrentBalanceFromSOAndInvoice(BlanketPOId, DifferenceAmount, result); },
                                    function (result) { CustomerBlanketPOHistory.UpdateAmountAndCurrentBalance(BlanketPOHistoryId, DifferenceAmount, TokenUserId, result); },
                                    function (result) { CustomerBlanketPOHistoryLog.Create(BPOHLog, result); },
                                  ],
                                    function (err, results) {
                                      if (err) {
                                        Reqresponse.printResponse(res, err, null);
                                      }
                                    });
                                }
                              }
                            });
                          });
                        }
                        else {
                          Reqresponse.printResponse(res, { msg: "No Record" }, null);
                        }
                      });
                    });
                }
              });
              Reqresponse.printResponse(res, null, { ress: Rdata.res[0] });
            }
            else {
              Reqresponse.printResponse(res, { msg: "No Record" }, null);
            }
          });

        });
    }
    else {
      Reqresponse.printResponse(res, { msg: "InvoiceItem Id is required" }, null);
    }
  }
};

//To Get ExportToExcel
exports.ExportToExcel = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var Ids = ``;
    for (let val of req.body.Invoice) {
      Ids += val.InvoiceId + `,`;
    }
    var InvoiceIds = Ids.slice(0, -1);

    if (req.body.hasOwnProperty('InvoiceType') == false)
      req.body.InvoiceType = '';
    if (req.body.hasOwnProperty('Status') == false)
      req.body.Status = '';
    if (req.body.hasOwnProperty('IsCSVProcessed') == false)
      req.body.IsCSVProcessed = '';
    if (req.body.hasOwnProperty('CustomerInvoiceApproved') == true && req.body.CustomerInvoiceApproved == "true")
      req.body.Status = Constants.CONST_INV_STATUS_APPROVED;

    var sql = Invoice.ExportToExcel(req.body, InvoiceIds);
    var sqlArray = Invoice.CSVExportToExcel(req.body, InvoiceIds);

    if (req.body.hasOwnProperty('DownloadType') == true && req.body.DownloadType == "CSV") {
      async.parallel([
        function (result) { con.query(sqlArray[0].sqlExcel, result) },
        function (result) { con.query(sqlArray[0].sqlUpdateIsCSVProcessed, result) },
      ],
        function (err, results) {
          if (err)
            Reqresponse.printResponse(res, err, null);
          else {
            if (results[0][0].length > 0)
              Reqresponse.printResponse(res, err, { ExcelData: results[0][0] });
            else
              Reqresponse.printResponse(res, { msg: "Invoice is not yet Approved. Only Approved invoice can be download as CSV" }, null);
          }
        });
    }
    else {
      con.query(sql, (err, Eres) => {
        if (err)
          Reqresponse.printResponse(res, err, null);
        else
          Reqresponse.printResponse(res, err, { ExcelData: Eres });
      });
    }
  }
};


exports.ExportToExcelNew = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var Ids = ``;
    for (let val of req.body.Invoice) {
      Ids += val.InvoiceId + `,`;
    }
    var InvoiceIds = Ids.slice(0, -1);

    if (req.body.hasOwnProperty('InvoiceType') == false)
      req.body.InvoiceType = '';
    if (req.body.hasOwnProperty('Status') == false)
      req.body.Status = '';
    if (req.body.hasOwnProperty('IsCSVProcessed') == false)
      req.body.IsCSVProcessed = '';
    if (req.body.hasOwnProperty('CustomerInvoiceApproved') == true && req.body.CustomerInvoiceApproved == "true")
      req.body.Status = Constants.CONST_INV_STATUS_APPROVED;

    var sqlArray = Invoice.CSVExportToExcelNew(req.body, InvoiceIds);

    if (req.body.hasOwnProperty('DownloadType') == true && req.body.DownloadType == "CSV") {
      async.parallel([
        // function (result) { con.query(sqlArray, result) }
        function (result) { con.query(sqlArray[0].sqlExcel, result) },
        function (result) { con.query(sqlArray[0].sqlUpdateIsCSVProcessed, result) },

      ],
        function (err, results) {
          if (err)
            Reqresponse.printResponse(res, err, null);
          else {
            if (results[0][0].length > 0)
              Reqresponse.printResponse(res, err, { ExcelData: results[0][0] });
            else
              Reqresponse.printResponse(res, { msg: "Invoice is not yet Approved. Only Approved invoice can be download as CSV" }, null);
          }
        });
    } else {
      Reqresponse.printResponse(res, { msg: "Not valid " }, null);
    }
  }
};


exports.IntacctJson = (req, res) => {
  Invoice.IntacctJson(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.IntacctCSVDownload = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var Ids = ``;
    for (let val of req.body.Invoice) {
      Ids += val.InvoiceId + `,`;
    }
    var InvoiceIds = Ids.slice(0, -1);

    if (req.body.hasOwnProperty('InvoiceType') == false)
      req.body.InvoiceType = '';
    if (req.body.hasOwnProperty('Status') == false)
      req.body.Status = '';
    if (req.body.hasOwnProperty('IsCSVProcessed') == false)
      req.body.IsCSVProcessed = '';
    if (req.body.hasOwnProperty('CustomerInvoiceApproved') == true && req.body.CustomerInvoiceApproved == "true")
      req.body.Status = Constants.CONST_INV_STATUS_APPROVED;

    var sqlArray = Invoice.IntacctCSVDownload(req.body, InvoiceIds);

    if (req.body.hasOwnProperty('DownloadType') == true && req.body.DownloadType == "CSV") {
      async.parallel([
        // function (result) { con.query(sqlArray, result) }
        function (result) { con.query(sqlArray[0].sqlExcel, result) },
        function (result) { con.query(sqlArray[0].sqlUpdateIsCSVProcessed, result) },
      ],
        function (err, results) {
          if (err)
            Reqresponse.printResponse(res, err, null);
          else {
            if (results[0][0].length > 0)
              Reqresponse.printResponse(res, err, { ExcelData: results[0][0] });
            else
              Reqresponse.printResponse(res, { msg: "Invoice is not yet Approved. Only Approved invoice can be download as CSV" }, null);
          }
        });
    } else {
      Reqresponse.printResponse(res, { msg: "Not valid " }, null);
    }
  }
};


exports.InvoiceListWithGrandtotalIsZero = (req, res) => {
  Invoice.InvoiceListWithGrandtotalIsZero(req, (err, data) => {
    if (err) {
      Reqresponse.printResponse(res, err, null);
    }
    Reqresponse.printResponse(res, err, data);
  });
};
exports.AutoFixGrandTotal = (req, res) => {

  if (req.body.InvoiceId > 0) {
    Invoice.GetPriceDetail(req.body.InvoiceId, (err, data) => {
      if (err) {
        Reqresponse.printResponse(res, err, null);
      }
      else {
        var GrandTotal = data[0].SubTotal + data[0].Shipping + data[0].TotalTax + data[0].AHFees + data[0].AdvanceAmount;
       // console.log(data.length)

        Invoice.UpdateGrandTotal(GrandTotal, data[0].SubTotal, req.body.InvoiceId, (err, data) => {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          Reqresponse.printResponse(res, err, data);
        });
      }
    });

  }
  else {
    Reqresponse.printResponse(res, { msg: "Invoice is required" }, null);
  }
};











//Below are for MRO
exports.MROAutoCreate = (req, res) => {
  Invoice.ValidateAlreadyExistMROId(req.body.MROId, (err, data4) => {
    if (err) {
      Reqresponse.printResponse(res, err, null);
    }
    if (data4 && data4.length > 0) {
      Reqresponse.printResponse(res, { msg: "Invoice Order Already Created for this MROId :" + req.body.MROId }, null);
    }
    else {
      var getCustId = SalesOrder.viewByMROId(req.body.MROId);
      con.query(getCustId, (errCust, resultCust) => {
        let date_ob = new Date();
        date_ob.setDate(date_ob.getDate() + Constants.CONST_DUE_DAYS_INVOICE);

        var sql = SalesOrder.viewByMROId(req.body.MROId);
        var sqlSi = SalesOrderItem.viewByMROId(req.body.MROId);
        var sqlGetDefaultTerm = TermModel.GetDefaultTerm();
        var getCustomerTermsId = Customers.viewquery(resultCust[0].CustomerId, req.body);
        async.parallel([
          function (result) { con.query(sql, result) },
          function (result) { con.query(sqlSi, result) },
          function (result) { con.query(sqlGetDefaultTerm, result) },
          function (result) { con.query(getCustomerTermsId, result) },
        ],
          function (err, results) {
            if (err)
              Reqresponse.printResponse(res, err, null);

            if (results[0][0].length > 0) {
              var InvoiceRes = results[0][0];
              const objInvoice = new Invoice({
                authuser: req.body.authuser,
                InvoiceNo: '',
                SONo: InvoiceRes[0].SONo,
                SOId: InvoiceRes[0].SOId,
                CustomerPONo: InvoiceRes[0].CustomerPONo,
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
                SubTotal: InvoiceRes[0].SubTotal,
                AHFees: InvoiceRes[0].AHFees,
                TaxPercent: InvoiceRes[0].TaxPercent,
                TotalTax: InvoiceRes[0].TotalTax,
                Discount: InvoiceRes[0].Discount,
                Shipping: InvoiceRes[0].Shipping,
                AdvanceAmount: 0,
                GrandTotal: InvoiceRes[0].GrandTotal,
                Status: Constants.CONST_INV_STATUS_OPEN,
                LeadTime: InvoiceRes[0].LeadTime,
                WarrantyPeriod: InvoiceRes[0].WarrantyPeriod,
                BlanketPOExcludeAmount: InvoiceRes[0].BlanketPOExcludeAmount,
                BlanketPONetAmount: InvoiceRes[0].BlanketPONetAmount,
                LocalCurrencyCode: InvoiceRes[0].LocalCurrencyCode,
                ExchangeRate: InvoiceRes[0].ExchangeRate,
                BaseCurrencyCode: InvoiceRes[0].BaseCurrencyCode,
                BaseGrandTotal: InvoiceRes[0].BaseGrandTotal
              });

              req.body.TermsDays = 0;
              // if (results[2][0].length > 0) {
              //   objInvoice.TermsId = results[2][0][0].TermsId;
              //   req.body.TermsDays = results[2][0][0].TermsDays;
              // }
              if (results[3][0].length > 0) {
                objInvoice.TermsId = results[3][0][0].TermsId;
                req.body.TermsDays = results[3][0][0].TermsDays;
              } else {
                if (results[2][0].length > 0) {
                  objInvoice.TermsId = results[2][0][0].TermsId;
                  req.body.TermsDays = results[2][0][0].TermsDays;
                }
              }
              Invoice.Create(objInvoice, (err, data) => {
                if (err) { Reqresponse.printResponse(res, err, null); }
                var InvoiceId = data.id;
                objInvoice.InvoiceId = InvoiceId;
                var objInvoiceItem = results[1][0];

                const GeneralHistoryLogPayload1 = new GeneralHistoryLog({
                  authuser: req.body.authuser,
                  IdentityType: Constants.CONST_IDENTITY_TYPE_MRO,
                  IdentityId: req.body.MROId,
                  RequestBody: JSON.stringify(req.body),
                  Type: "Invoice - MRO - Temp 1",
                  BaseTableRequest: JSON.stringify(objInvoice),
                  ItemTableRequest: JSON.stringify(objInvoiceItem),
                  BaseTableResponse: JSON.stringify(data),
                  ItemTableResponse: JSON.stringify(results[0]),
                  ErrorMessage: JSON.stringify(err),
                  CommonLogMessage: JSON.stringify(results)
                });

               
                const srr = new MROModel({
                  authuser: req.body.authuser,
                  MROId: req.body.MROId,
                  CustomerInvoiceNo: 'INV' + data.id,
                  CustomerInvoiceDueDate: date_ob,
                  CustomerInvoiceId: data.id
                })
                var sqlCustomerInvoiceNo = MROModel.UpdateCustomerInvoiceNoByMROId(srr, req.body.TermsDays);
                //var sqlCusRef = SalesOrderCusReference.ViewCustomerReference(InvoiceRes[0].SOId);
                var sqlUpdateInvoiceNo = Invoice.UpdateInvoiceNoById(objInvoice);
                // var sqlContactAddressBook = AddressBook.ViewContactAddressByCustomerId(InvoiceRes[0].CustomerId);
                // var sqlBillAddressBook = AddressBook.GetBillingAddressIdByCustomerId(InvoiceRes[0].CustomerId);
                var sqlUpdateInvoiceDueAutoUpdate = Invoice.UpdateInvoiceDueAutoUpdate(InvoiceId, req.body.TermsDays);
                var sqlUpdatePriceinMRO = MROModel.UpdatePriceQuery(objInvoice);
                var sqlNotes = Notes.ViewNotes(Constants.CONST_IDENTITY_TYPE_SO, resultCust[0].SOId);
                async.parallel([
                  function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload1, result); },
                  function (result) { InvoiceItem.Create(InvoiceId, objInvoiceItem, result); },
                  function (result) { con.query(sqlUpdateInvoiceNo, result) },
                  //  function (result) { con.query(sqlCusRef, result) },
                  // function (result) { con.query(sqlContactAddressBook, result) },
                  // function (result) { con.query(sqlBillAddressBook, result) },
                  function (result) { SalesOrder.UpdateIsConvertedToPOBySOId(InvoiceRes[0].SOId, result); },
                  // function (result) { con.query(sqlBillAddressBook, result) },
                  function (result) { con.query(sqlUpdateInvoiceDueAutoUpdate, result) },
                  function (result) { con.query(sqlCustomerInvoiceNo, result) },
                  // function (result) { NotificationModel.Create(NotificationObj, result); },
                  function (result) { con.query(sqlUpdatePriceinMRO, result) },
                  function (result) { con.query(sqlNotes, result) },
                ],
                  function (err, results) {
                    // 
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
                      function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload, result); },
                    ],
                      function (err, results1) {

                      })
                    // 
                    if (err) { Reqresponse.printResponse(res, err, null); }
                    if (results1[6][0].length > 0) {
                      for (var iN = 0; iN < results1[6][0].length; iN++) {
                        var notesData = results1[6][0][iN];
                        notesData.IdentityType = Constants.CONST_IDENTITY_TYPE_INVOICE;
                        notesData.IdentityId = InvoiceId;
                        Notes.create(notesData, (errND, dataND) => {
                        });

                      }
                    }

                  });
              });
              Reqresponse.printResponse(res, err, { InvoiceInfo: results[0][0], InvoiceItemInfo: results[1][0] });
            } else {
              Reqresponse.printResponse(res, { msg: "Sales Order not found for this MROId" }, null);
            }
          });
      });
    }
  });
};
//
exports.ReOpenInvoice = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    Invoice.ReOpenInvoice(new Invoice(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};


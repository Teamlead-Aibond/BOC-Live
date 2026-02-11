/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

const SalesOrder = require("../models/sales.order.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
const Quotes = require("../models/quotes.model.js");
const QuotesItem = require("../models/quote.item.model.js");
const SalesOrderItem = require("../models/sales.order.item.model.js");
const GlobalCustomerReference = require("../models/sales.order.customer.ref.model.js");
const RR = require("../models/repair.request.model.js");
const NotificationModel = require("../models/notification.model.js");
const MROModel = require("../models/mro.model.js");
const PurchaseOrderItem = require("../models/purchase.order.item.model.js");
const Invoice = require("../models/invoice.model.js");
const InvoiceItemModel = require("../models/invoice.item.model.js");
const CustomerBlanketPO = require("../models/customer.blanket.po.model.js");
const CustomerBlanketPOHistory = require("../models/customer.blanket.po.history.model.js");
const MROStatusHistory = require("../models/mro.status.history.model.js");
const CustomerBlanketPOHistoryLog = require("../models/customer.blanket.po.history.log.model.js");
const GeneralHistoryLog = require("../models/general.history.log.model.js");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType } = require("../helper/common.function.js");
exports.Create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    SalesOrder.Create(new SalesOrder(req.body), (err, data) => {
      req.body.SOId = data.SOId;
      // req.body.ShipOrderAddress.IdentityType = Constants.CONST_IDENTITY_TYPE_SO;
      // req.body.ShipOrderAddress.IdentityId = data.SOId;
      // req.body.BillOrderAddress.IdentityType = Constants.CONST_IDENTITY_TYPE_SO;
      // req.body.BillOrderAddress.IdentityId = data.SOId;
      const SalesOrderObj = new SalesOrder({
        SOId: data.SOId,
        authuser: req.body.authuser
      });
      async.parallel([

        function (result) {
          if (req.body.hasOwnProperty('SalesOrderItem'))
            SalesOrderItem.Create(data.SOId, req.body.SalesOrderItem, result);
        },
        function (result) {
          if (req.body.hasOwnProperty('GlobalCustomerReference')) {
            GlobalCustomerReference.Create(Constants.CONST_IDENTITY_TYPE_SO, data.SOId, req.body.GlobalCustomerReference, result);
          }
        },
        function (result) { SalesOrder.UpdateSONoById(SalesOrderObj, result); },
        // function (result) { OrderAddress.Create(req.body.ShipOrderAddress, result); },
        // function (result) { OrderAddress.Create(req.body.BillOrderAddress, result); },
      ],
        function (err, results) {
          // console.log(err);
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
        });
      Reqresponse.printResponse(res, err, data);
    });
  }
};


exports.update = (req, res) => {
  var TokenUserId = getLogInUserId(req.body);
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var sql = SalesOrderItem.view(req.body.SOId);
    con.query(sql, (err, data) => {
      if (err)
        Reqresponse.printResponse(res, err, null);

      if (data.length > 0) {
        var Id = 0; var Type = "";
        if (req.body.CustomerBlanketPOId > 0) {
          if (req.body.RRId > 0) {
            Id = req.body.RRId;
            Type = "RR";
          }
          else if (req.body.MROId > 0) {
            Id = req.body.MROId;
            Type = "MRO";
          }
          else if (req.body.QuoteId > 0) {
            Id = req.body.QuoteId;
            Type = "QUOTE";
          }
          else { }
        }
        // var checkBlanketPOPriceBoolean = SalesOrder.checkBlanketPOPriceBoolean(req, Id, Type);
        // con.query(sql, (err, data) => {
        SalesOrder.checkBlanketPOPriceBoolean(req, Id, Type, (err, checkBlanketPOPriceBoolean) => {
          if (checkBlanketPOPriceBoolean) {
            async.parallel([
              function (result) { SalesOrder.update(new SalesOrder(req.body), result); },
              function (result) { if (req.body.hasOwnProperty('SalesOrderItem')) { SalesOrderItem.UpdateSalesOrderItem(req.body, result); } },
              function (result) { RR.UpdateCustomerSODueDate(req.body, result); },
              function (result) { SalesOrder.IsNonRRAndNonMRO(req.body.SOId, result); },
              function (result) { Invoice.GetInvoiceDetail(req.body.SOId, result); },
              function (result) {
                if (req.body.CustomerBlanketPOId > 0) { CustomerBlanketPOHistory.ViewByID(req.body.CustomerBlanketPOId, Id, Type, result); }
                else { RR.emptyFunction(req.body, result); }
              },
            ],
              function (err, results) {
                if (err) {
                  console.log("err " + err);
                  Reqresponse.printResponse(res, err, null);
                }
                else {
                  if (results[3].length > 0 && results[3][0].SOId > 0 && results[4].length > 0) {

                    var InvoiceId = results[4].length > 0 ? results[4][0].InvoiceId : 0;
                    var InvoiceItemArray = []; var BlanketPOExcludeAmount = 0;
                    // New Code Start

                    // var sqldata = SalesOrderItem.view(req.body.SOId);
                    // con.query(sqldata, (err, datasql) => {
                    //   if (err){
                    //     Reqresponse.printResponse(res, err, null);
                    //   }else{
                    var sqldataSOI = SalesOrderItem.view(req.body.SOId);
                    var sqldataII = InvoiceItemModel.GetInvoiceItemBySOId(req.body.SOId);
                    con.query(sqldataSOI, (errSOI, datasqlSOI) => {
                      con.query(sqldataII, (errII, datasqlII) => {
                        var resultArray = Object.values(JSON.parse(JSON.stringify(datasqlII)))
                        // console.log(resultArray);
                        datasqlSOI.forEach(elementSO => {

                          var ItemObj = {};
                          // var dataObj = i < data.length ? data[i] : {};
                          var SOItemObj = elementSO; //req.body.SalesOrderItem[i];
                          BlanketPOExcludeAmount += SOItemObj.IsExcludeFromBlanketPO == 1 ? SOItemObj.Price : 0;
                          // datasqlII.forEach(elementIO => {
                          // console.log("~~~~~~~~~~~~")
                          const availableVal = resultArray.find(el => el.SOItemId === elementSO.SOItemId);
                          // console.log(availableVal);
                          if (availableVal) {
                            // console.log("Not Available");
                            ItemObj.InvoiceItemId = availableVal.InvoiceItemId; //results[4][i].InvoiceItemId && results[4][i].InvoiceItemId > 0 ? results[4][i].InvoiceItemId : -1;
                            ItemObj.SOId = req.body.SOId;
                            ItemObj.SOItemId = SOItemObj.SOItemId;
                            ItemObj.PartId = SOItemObj.PartId;
                            ItemObj.PartNo = SOItemObj.PartNo;
                            ItemObj.Description = SOItemObj.Description;
                            ItemObj.Tax = SOItemObj.Tax;
                            ItemObj.Quantity = SOItemObj.Quantity;
                            ItemObj.Rate = SOItemObj.Rate;
                            ItemObj.Discount = SOItemObj.Discount;
                            ItemObj.Price = SOItemObj.Price;
                            ItemObj.WarrantyPeriod = SOItemObj.WarrantyPeriod;
                            ItemObj.IsExcludeFromBlanketPO = SOItemObj.IsExcludeFromBlanketPO;
                            // 
                            ItemObj.ItemTaxPercent = SOItemObj.ItemTaxPercent;
                            ItemObj.ItemLocalCurrencyCode = SOItemObj.ItemLocalCurrencyCode;
                            ItemObj.ItemExchangeRate = SOItemObj.ItemExchangeRate;
                            ItemObj.ItemBaseCurrencyCode = SOItemObj.ItemBaseCurrencyCode;
                            ItemObj.BasePrice = SOItemObj.BasePrice;
                            ItemObj.BaseRate = SOItemObj.BaseRate;
                            ItemObj.BaseTax = SOItemObj.BaseTax;

                            InvoiceItemArray.push(ItemObj);
                          } else {
                            //  console.log("Available");
                            ItemObj.SOId = req.body.SOId;
                            ItemObj.SOItemId = SOItemObj.SOItemId;
                            ItemObj.PartId = SOItemObj.PartId;
                            ItemObj.PartNo = SOItemObj.PartNo;
                            ItemObj.Description = SOItemObj.Description;
                            ItemObj.Tax = SOItemObj.Tax;
                            ItemObj.Quantity = SOItemObj.Quantity;
                            ItemObj.Rate = SOItemObj.Rate;
                            ItemObj.Discount = SOItemObj.Discount;
                            ItemObj.Price = SOItemObj.Price;
                            ItemObj.WarrantyPeriod = SOItemObj.WarrantyPeriod;
                            ItemObj.IsExcludeFromBlanketPO = SOItemObj.IsExcludeFromBlanketPO;
                            // 
                            ItemObj.ItemTaxPercent = SOItemObj.ItemTaxPercent;
                            ItemObj.ItemLocalCurrencyCode = SOItemObj.ItemLocalCurrencyCode;
                            ItemObj.ItemExchangeRate = SOItemObj.ItemExchangeRate;
                            ItemObj.ItemBaseCurrencyCode = SOItemObj.ItemBaseCurrencyCode;
                            ItemObj.BasePrice = SOItemObj.BasePrice;
                            ItemObj.BaseRate = SOItemObj.BaseRate;
                            ItemObj.BaseTax = SOItemObj.BaseTax;

                            InvoiceItemArray.push(ItemObj);
                          }
                          // });
                        });
                        // console.log("checking.....");
                        // console.log(InvoiceItemArray);
                        req.body.InvoiceId = InvoiceId;
                        req.body.InvoiceItem = InvoiceItemArray;
                        const objInvoice = new Invoice({
                          authuser: req.body.authuser,
                          //  CustomerPONo: req.body.CustomerPONo,
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
                          InvoiceId: InvoiceId,

                          BaseCurrencyCode: req.body.BaseCurrencyCode,
                          BaseGrandTotal: req.body.BaseGrandTotal,
                          ExchangeRate: req.body.ExchangeRate,
                          LocalCurrencyCode: req.body.LocalCurrencyCode,
                        });
                        // console.log(objInvoice);
                        async.parallel([
                          function (result) { Invoice.UpdateNonRRAndNonMROInvoice(objInvoice, result); },
                          function (result) { InvoiceItemModel.Update(req.body, result); },
                        ],
                          function (err, results) {
                            if (err) {
                              Reqresponse.printResponse(res, err, null);
                            }
                          });
                      })

                    });

                    //   }

                    // });

                    // New code End



                  }
                  if (results[5].length > 0) {

                    var Amount = results[5][0].Amount > 0 ? parseFloat(results[5][0].Amount).toFixed(2) : 0;
                    var BlanketPOHistoryId = results[5][0].BlanketPOHistoryId > 0 ? results[5][0].BlanketPOHistoryId : 0;
                    var BlanketPOId = results[5][0].BlanketPOId > 0 ? results[5][0].BlanketPOId : 0;
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
                  Reqresponse.printResponse(res, null, { data: req.body });
                }
              });
          } else {
            Reqresponse.printResponse(res, { msg: "Failed to save Sales Order due to Insufficient amount in Blanket PO. Please contact admin!" }, null);
          }
        });
      }
      else {
        Reqresponse.printResponse(res, { msg: "no record" }, null);
      }
    });
  }
  else {
    Reqresponse.printResponse(res, { msg: "Request can not be empty" }, null);
  }
};

exports.AutoCreate = (req, res) => {

  SalesOrder.ValidateAlreadyExistByQuoteId(req.body.QuoteId, (err, data4) => {
    if (err) {
      Reqresponse.printResponse(res, err, null);
    }
    if (data4.length > 0) {
      Reqresponse.printResponse(res, { msg: "Sales Order is already created for this QuoteId :" + req.body.QuoteId }, null);
      return;
    }
    else {
      // let date_ob = new Date();
      // date_ob.setDate(date_ob.getDate()+Constants.CONST_DUE_DAYS);


      //console.log("Time :"+date_ob);
      var sql = Quotes.ViewByRRIdAndQuoteId(req.body.RRId, req.body.QuoteId);
      var sqlQi = QuotesItem.ViewQuoteItemByRRIdQuoteId(req.body.RRId, req.body.QuoteId);
      //  var sqlCusRef = CReferenceLabel.ViewCustomerReference(req.body.RRId);
      //  var sqlShipAddressBook = AddressBook.GetAddressByIdQuery(req.body.CustomerShipToId);
      //  var sqlBillAddressBook = AddressBook.GetAddressByIdQuery(req.body.CustomerBillToId);
      var UpdateCustomerBillShipQuery = RR.UpdateCustomerBillShipQuery(req.body);
      //var sqlRRNotes = RRNotes.ViewNotes(1,req.body.RRId);  
      async.parallel([
        function (result) { con.query(sql, result) },
        function (result) { con.query(sqlQi, result) },
        // function (result) { con.query(sqlCusRef, result) },
        //  function (result) { con.query(sqlShipAddressBook, result) },
        //function (result) { con.query(sqlBillAddressBook, result) },
        function (result) { con.query(UpdateCustomerBillShipQuery, result) },
        //function (result) { con.query(sqlRRNotes, result) }  
      ],
        function (err, results) {

          //console.log("results 0 "+results[0]);
          if (err)
            Reqresponse.printResponse(res, err, null);


          if (results[0][0].length > 0) {

            // if(QuotesRes[0].Status==Constants.CONST_QUOTE_STATUS_DRAFT) {
            // Reqresponse.printResponse(res, {msg:"You cannot convert the DRAFT quote to Sales Order. Change the status to OPEN and Create a Sales Order"},null);  
            // } 

            var QuotesRes = results[0][0];
            //  var ShipRes = results[2][0];
            // var BillRes = results[3][0];
            //var RRNotesInfo = results[6][0];
            //console.log("Notes : "+RRNotesInfo[0].Notes);
            const objSalesOrder = new SalesOrder({
              authuser: req.body.authuser,
              SONo: '',
              RRId: req.body.RRId,
              RRNo: QuotesRes[0].RRNo,
              CustomerPONo: QuotesRes[0].CustomerPONo != null ? QuotesRes[0].CustomerPONo : req.body.CustomerPONo,
              CustomerBlanketPOId: QuotesRes[0].CustomerBlanketPOId,
              CustomerId: QuotesRes[0].IdentityId,
              SOType: req.body.RRId ? Constants.CONST_SO_TYPE_REPAIR : Constants.CONST_SO_TYPE_REGULAR,
              DateRequested: cDateTime.getDate(),
              DueDate: cDateTime.getDueDate(),
              ReferenceNo: '',
              WarehouseId: 0,
              // ShipAddressBookId: req.body.CustomerShipToId,
              ShipAddressBookId: QuotesRes[0].CustomerShipIdLocked > 0 ? QuotesRes[0].CustomerShipIdLocked : req.body.CustomerShipToId,
              ShipAddressId: 0,
              BillAddressBookId: req.body.CustomerBillToId,
              BillAddressId: 0,
              Notes: '', // RRNotesInfo[0].Notes,
              IsConvertedToPO: 0,
              SubTotal: QuotesRes[0].TotalValue,
              AHFees: QuotesRes[0].ProcessFee,
              TaxPercent: QuotesRes[0].TaxPercent,
              TotalTax: QuotesRes[0].TotalTax,
              Discount: QuotesRes[0].Discount,
              Shipping: QuotesRes[0].ShippingFee,
              GrandTotal: QuotesRes[0].GrandTotal,
              BlanketPONetAmount: QuotesRes[0].GrandTotal,
              Status: Constants.CONST_SO_STATUS_APPROVED,
              LeadTime: QuotesRes[0].LeadTime,
              WarrantyPeriod: QuotesRes[0].WarrantyPeriod,
              QuoteId: req.body.QuoteId,
              LocalCurrencyCode: QuotesRes[0].LocalCurrencyCode,
              ExchangeRate: QuotesRes[0].ExchangeRate,
              BaseCurrencyCode: QuotesRes[0].BaseCurrencyCode,
              BaseGrandTotal: QuotesRes[0].BaseGrandTotal

            });
            //console.log("Test " + objSalesOrder);
            if (results[1][0].length > 0) {
              SalesOrder.Create(objSalesOrder, (err, data) => {
                if (err) {
                  Reqresponse.printResponse(res, err, null);
                }

                var SOId = data.SOId;
                var objSalesOrderListItem = results[1][0];
                var LeadTime = 0; var count = 0;
                for (let obj of objSalesOrderListItem) {
                  if (obj.LeadTime) {
                    LeadTime = obj.LeadTime;
                    count++;
                    if (count >= 2) {
                      LeadTime = 0;
                      break;
                    }
                  }
                }
                // var objGlobalCustomerReference = results[2][0];
                // var objShippingOrderAddress = results[2][0];
                // var objBillingOrderAddress = results[3][0];


                // const objShipOrderAddressinfo = new OrderAddress({
                //   AddressName: objShippingOrderAddress[0].StreetAddress,
                //   AddressType: 2,
                //   IdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                //   IdentityId: data.SOId,
                //   StreetAddress: objShippingOrderAddress[0].StreetAddress,
                //   SuiteOrApt: objShippingOrderAddress[0].SuiteOrApt,
                //   City: objShippingOrderAddress[0].City,
                //   StateId: objShippingOrderAddress[0].StateId ? objShippingOrderAddress[0].StateId : 0,
                //   CountryId: objShippingOrderAddress[0].CountryId,
                //   Zip: objShippingOrderAddress[0].Zip,
                //   AllowShipment: 0,
                //   Phone: objShippingOrderAddress[0].PhoneNoPrimary,
                //   Fax: objShippingOrderAddress[0].Fax,

                // });

                // const objBillOrderAddressinfo = new OrderAddress({
                //   AddressName: objBillingOrderAddress[0].StreetAddress,
                //   AddressType: 1,
                //   IdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                //   IdentityId: data.SOId,
                //   StreetAddress: objBillingOrderAddress[0].StreetAddress,
                //   SuiteOrApt: objBillingOrderAddress[0].SuiteOrApt,
                //   City: objBillingOrderAddress[0].City,
                //   StateId: objBillingOrderAddress[0].StateId ? objBillingOrderAddress[0].StateId : 0,
                //   CountryId: objBillingOrderAddress[0].CountryId,
                //   Zip: objBillingOrderAddress[0].Zip,
                //   AllowShipment: 0,
                //   Phone: objBillingOrderAddress[0].PhoneNoPrimary,
                //   Fax: objBillingOrderAddress[0].Fax,
                // });

                const srr = new RR({
                  authuser: req.body.authuser,
                  RRId: req.body.RRId,
                  CustomerSONo: 'SO' + data.SOId,
                  CustomerSOId: data.SOId
                });
                const SalesOrderObj = new SalesOrder({
                  authuser: req.body.authuser,
                  SOId: data.SOId,
                  authuser: req.body.authuser
                });

                var sqlUpdateCustomerSONo = RR.UpdateCustomerSONoByRRID(srr, LeadTime);
                var sqlUpdateSalesOrderDueAutoUpdate = SalesOrder.UpdateSalesOrderDueAutoUpdate(data.SOId, LeadTime);

                //To add SO in notification table
                var NotificationObj = new NotificationModel({
                  authuser: req.body.authuser,
                  RRId: req.body.RRId,
                  NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                  NotificationIdentityId: data.SOId,
                  NotificationIdentityNo: 'SO' + data.SOId,
                  ShortDesc: 'Customer SO Draft Created',
                  Description: 'Customer SO Draft created by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
                });

                req.body.SOId = data.SOId;

                async.parallel([
                  function (result) { SalesOrderItem.Create(SOId, objSalesOrderListItem, result); },
                  // function (result) { GlobalCustomerReference.Create(Constants.CONST_IDENTITY_TYPE_SO, SOId, objGlobalCustomerReference, result); },
                  function (result) { SalesOrder.UpdateSONoById(SalesOrderObj, result); },
                  function (result) { Quotes.ConvertedQuoteToSO(QuotesRes[0].QuoteId, result); },
                  function (result) { con.query(sqlUpdateCustomerSONo, result) },
                  // function (result) { if (objShippingOrderAddress.length > 0) { OrderAddress.Create(objShipOrderAddressinfo, result); } },
                  // function (result) { if (objShippingOrderAddress.length > 0) { OrderAddress.Create(objBillOrderAddressinfo, result); } },
                  function (result) { con.query(sqlUpdateSalesOrderDueAutoUpdate, result) },
                  function (result) { NotificationModel.Create(NotificationObj, result); },
                  function (result) { if (Constants.CONST_SO_STATUS_APPROVED == objSalesOrder.Status) { SalesOrder.ApproveSO(SalesOrderObj, result); } else { RR.emptyFunction(NotificationObj, result); } },
                  function (result) {
                    if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {
                      CustomerBlanketPO.GetCurrentBalance(req.body.CustomerBlanketPOId, result);
                    }
                    else { RR.emptyFunction(req.body, result); }
                  },
                  //   function (result) { con.query(SalesOrder.SaveCustomerPoNo(new SalesOrder(req.body)), result); },
                ],
                  function (err, results) {
                    const GeneralHistoryLogPayload = new GeneralHistoryLog({
                      authuser: req.body.authuser,
                      IdentityType: req.body.RRId > 0 ? Constants.CONST_IDENTITY_TYPE_RR : Constants.CONST_IDENTITY_TYPE_QUOTE,
                      IdentityId: req.body.RRId ? req.body.RRId : QuotesRes[0].QuoteId,
                      RequestBody: JSON.stringify(req.body),
                      Type: req.body.RRId > 0 ? "SO - RR" : "SO - QT",
                      BaseTableRequest: JSON.stringify(objSalesOrder),
                      ItemTableRequest: JSON.stringify(objSalesOrderListItem),
                      BaseTableResponse: JSON.stringify(data),
                      ItemTableResponse: JSON.stringify(results[0]),
                      ErrorMessage: JSON.stringify(err),
                      CommonLogMessage: JSON.stringify(results)
                    });
                    async.parallel([
                      function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload, result); },
                    ],
                      function (err, results) {
                        if (err) {
                          // Reqresponse.printResponse(res, err, null);
                        }
                      });
                    if (err)
                      Reqresponse.printResponse(res, err, null);
                    else {
                      var boolean = true;
                      if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {
                        req.body.CurrentBalance = results[7][0].CurrentBalance > 0 ? results[7][0].CurrentBalance : 0;
                        boolean = parseFloat(req.body.QuoteAmount) <= parseFloat(req.body.CurrentBalance) ? true : false;
                        if (boolean) {
                          var DebitHistoryObjCreate = new CustomerBlanketPOHistory({
                            authuser: req.body.authuser,
                            BlanketPOId: req.body.CustomerBlanketPOId,
                            RRId: req.body.RRId > 0 ? req.body.RRId : 0,
                            MROId: req.body.MROId > 0 ? req.body.MROId : 0,
                            PaymentType: 2,
                            Amount: parseFloat(req.body.QuoteAmount),
                            CurrentBalance: parseFloat(req.body.CurrentBalance) - parseFloat(req.body.QuoteAmount),
                            QuoteId: req.body.QuoteId,
                            Comments: req.body.Comments,
                            LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                            ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                            BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                            BaseAmount: parseFloat(req.body.QuoteAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                            BaseCurrentBalance: (parseFloat(req.body.CurrentBalance) - parseFloat(req.body.QuoteAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
                          });



                          async.parallel([
                            function (result) { CustomerBlanketPO.UpdateCurrentBalance(req.body.CustomerBlanketPOId, req.body.QuoteAmount, result); },
                            function (result) { CustomerBlanketPOHistory.Create(DebitHistoryObjCreate, result); },
                            function (result) { SalesOrder.UpdateCustomerBlanketPOIdToSO(req.body, result); },
                            function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload, result); },
                          ],
                            function (err, results) {
                              if (err) {
                                Reqresponse.printResponse(res, err, null);
                              }
                            });
                        }
                      }

                    }
                    // else {

                    //   async.parallel([
                    //     function (result) { SalesOrderItem.GetSODetailByRRId(req.body.RRId, result); },
                    //     function (result) { PurchaseOrderItem.GetPODetailByRRId(req.body.RRId, result); },
                    //   ],
                    //     function (err, results) {
                    //       if (err)
                    //         Reqresponse.printResponse(res, err, null);
                    //       else {
                    //         if (results[0].length > 0 && results[1].length > 0) {

                    //           var i = 0; var RRId = 0; var list = []; var SOId = 0;
                    //           for (i = 0; i < results[0].length; i++) {

                    //             var SO = results[0][i];
                    //             var PO = results[1][i];
                    //             RRId = SO.RRId;
                    //             SOId = SO.SOId;
                    //             var obj = {};
                    //             if (SO.PartId = PO.PartId) {
                    //               obj.SOItemId = SO.SOItemId;
                    //               obj.PartId = SO.PartId;
                    //               obj.POId = PO.POId;

                    //               console.log(SO.SOItemId);
                    //               console.log(SO.PartId);
                    //               console.log(PO.POId);
                    //               list.push(obj);
                    //             }
                    //           }
                    //           console.log(SOId);
                    //           console.log(RRId);
                    //           async.parallel([
                    //             function (result) { SalesOrder.UpdateSOIdByRRId(SOId, RRId, result); },
                    //             function (result) { PurchaseOrderItem.UpdateSOItemIdByPOIdAndPartId(list, result); },
                    //           ],
                    //             function (err, results2) {
                    //               if (err)
                    //                 Reqresponse.printResponse(res, err, null);
                    //             });
                    //         }
                    //       }
                    //     });
                    // }
                  });
              });
            }
            else {
              Reqresponse.printResponse(res, { msg: "Quote Item not available. Please check the customer quote and create SO" }, null);
            }
            Reqresponse.printResponse(res, err, { QuotesInfo: results[0][0], QuotesItemInfo: results[1][0], BillAddressInfo: results[2][0] });
          }
          else {
            Reqresponse.printResponse(res, { msg: "Quote not found" }, null);
          }
        });
    }
  });

}

exports.UpdateNonRRAndNonMROCustomerPONoInSO = (req, res) => {

  async.parallel([
    function (result) { SalesOrder.GetCustomerBlanketPOIdFromSO(req.body.SOId, result); },
    function (result) {
      if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {
        CustomerBlanketPO.GetCurrentBalance(req.body.CustomerBlanketPOId, result);
      }
      else { RR.emptyFunction(req.body, result); }
    },
    function (result) { Invoice.IsExistCustomerBlanketPOIdForSOId(req.body.SOId, result); },
    function (result) { con.query(SalesOrder.SaveCustomerPoNo(new SalesOrder(req.body)), result); },
    function (result) { con.query(SalesOrder.GetBlanketPONetAmountAndExcludeAmt(req.body.SOId), result); },
  ],
    function (err, results) {
      if (err)
        Reqresponse.printResponse(res, err, null);
      else {
        req.body.BlanketPONetAmount = (results[4][0].length > 0 && results[4][0][0].BlanketPONetAmount) ? results[4][0][0].BlanketPONetAmount : 0;
        req.body.BlanketPOExcludeAmt = (results[4][0].length > 0 && results[4][0][0].BlanketPOExcludeAmount) ? results[4][0][0].BlanketPOExcludeAmount : 0;
        var _CustomerBlanketPOId = results[0].length > 0 ? results[0][0].CustomerBlanketPOId : 0;
        req.body.CurrentBalance = results[1].length > 0 ? results[1][0].CurrentBalance : 0;
        req.body.InvoiceId = results[2].length > 0 ? results[2][0].InvoiceId : 0;
        var RRId = results[0].length > 0 ? results[0][0].RRId : 0;
        var boolean = true;
        if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {
          if (req.body.CustomerBlanketPOId > 0 && _CustomerBlanketPOId > 0 && req.body.CustomerBlanketPOId == _CustomerBlanketPOId) {
            //console.log("No Action");
          }
          else if (req.body.CustomerBlanketPOId > 0 && _CustomerBlanketPOId > 0 && req.body.CustomerBlanketPOId != _CustomerBlanketPOId) {
            // console.log("else if @@@@@@@");
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
                    QuoteId: req.body.QuoteId,
                    Comments: req.body.Comments,
                    LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                    ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                    BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                    BaseAmount: parseFloat(req.body.BlanketPONetAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                    BaseCurrentBalance: (parseFloat(data[0].CurrentBalance) + parseFloat(req.body.BlanketPONetAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
                  });

                  var DebitHistoryObj = new CustomerBlanketPOHistory({
                    authuser: req.body.authuser,
                    BlanketPOId: req.body.CustomerBlanketPOId,
                    RRId: req.body.RRId > 0 ? req.body.RRId : 0,
                    MROId: req.body.MROId > 0 ? req.body.MROId : 0,
                    PaymentType: 2,
                    Amount: parseFloat(req.body.BlanketPONetAmount),
                    CurrentBalance: parseFloat(req.body.CurrentBalance) - parseFloat(req.body.BlanketPONetAmount),
                    QuoteId: req.body.QuoteId,
                    Comments: req.body.Comments,
                    LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                    ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                    BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                    BaseAmount: parseFloat(req.body.BlanketPONetAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                    BaseCurrentBalance: (parseFloat(req.body.CurrentBalance) - parseFloat(req.body.BlanketPONetAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
                  });

                  async.parallel([
                    function (result) { CustomerBlanketPOHistory.Create(RefundHistoryObj, result); },
                    function (result) { CustomerBlanketPO.Refund(_CustomerBlanketPOId, req.body.BlanketPONetAmount, result); },
                    function (result) { CustomerBlanketPO.UpdateCurrentBalance(req.body.CustomerBlanketPOId, req.body.BlanketPONetAmount, result); },
                    function (result) { SalesOrder.UpdateCustomerBlanketPOIdToSO(req.body, result); },
                    function (result) { CustomerBlanketPOHistory.Create(DebitHistoryObj, result); },
                    function (result) {
                      if (req.body.InvoiceId > 0) { Invoice.UpdateCustomerBlanketPOIdToInvoice(new Invoice(req.body), result); }
                      else { RR.emptyFunction(req.body, result); }
                    },
                    function (result) {
                      if (RRId > 0) { RR.UpdateCustomerBlanketPOIdToRR(req.body.CustomerBlanketPOId, req.body.CustomerPONo, RRId, result); }
                      else { RR.emptyFunction(req.body, result); }
                    },
                    function (result) {
                      if (req.body.CustomerBlanketPOId > 0) {
                        con.query(SalesOrder.UpdateBlanketPONetAmtAndExcludeAmt(req.body.BlanketPONetAmount, req.body.BlanketPOExcludeAmt, req.body.SOId), result);
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
            // console.log("else @@@@@@@");
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
                QuoteId: req.body.QuoteId,
                Comments: req.body.Comments,
                LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                BaseAmount: parseFloat(req.body.BlanketPONetAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                BaseCurrentBalance: (parseFloat(req.body.CurrentBalance) - parseFloat(req.body.BlanketPONetAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
              });
              async.parallel([
                function (result) { CustomerBlanketPO.UpdateCurrentBalance(req.body.CustomerBlanketPOId, req.body.BlanketPONetAmount, result); },
                function (result) { CustomerBlanketPOHistory.Create(DebitHistoryObjCreate, result); },
                function (result) { SalesOrder.UpdateCustomerBlanketPOIdToSO(req.body, result); },
                function (result) {
                  if (req.body.InvoiceId > 0) { Invoice.UpdateCustomerBlanketPOIdToInvoice(new Invoice(req.body), result); }
                  else { RR.emptyFunction(req.body, result); }
                },
                function (result) {
                  if (RRId > 0) { RR.UpdateCustomerBlanketPOIdToRR(req.body.CustomerBlanketPOId, req.body.CustomerPONo, RRId, result); }
                  else { RR.emptyFunction(req.body, result); }
                },
                function (result) {
                  if (req.body.CustomerBlanketPOId > 0) {
                    con.query(SalesOrder.UpdateBlanketPONetAmtAndExcludeAmt(req.body.BlanketPONetAmount, req.body.BlanketPOExcludeAmt, req.body.SOId), result);
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
              if (data.length > 0) {
                req.body.BlanketPONetAmount = req.body.QuoteAmount;
                //console.log("@@##@@", data);
                var RefundHistoryObj = new CustomerBlanketPOHistory({
                  authuser: req.body.authuser,
                  BlanketPOId: _CustomerBlanketPOId,
                  RRId: req.body.RRId > 0 ? req.body.RRId : 0,
                  MROId: req.body.MROId > 0 ? req.body.MROId : 0,
                  PaymentType: 1,
                  Amount: parseFloat(req.body.BlanketPONetAmount),
                  CurrentBalance: parseFloat(data[0].CurrentBalance) + parseFloat(req.body.BlanketPONetAmount),
                  QuoteId: req.body.QuoteId,
                  Comments: req.body.Comments,
                  LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                  ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                  BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                  BaseAmount: parseFloat(req.body.BlanketPONetAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                  BaseCurrentBalance: (parseFloat(data[0].CurrentBalance) + parseFloat(req.body.BlanketPONetAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
                });
                req.body.CustomerBlanketPOId = 0;
                async.parallel([
                  function (result) { CustomerBlanketPOHistory.Create(RefundHistoryObj, result); },
                  function (result) { CustomerBlanketPO.Refund(_CustomerBlanketPOId, req.body.BlanketPONetAmount, result); },
                  function (result) { SalesOrder.UpdateCustomerBlanketPOIdToSO(req.body, result); },
                  function (result) {
                    if (req.body.InvoiceId > 0) { Invoice.UpdateCustomerBlanketPOIdToInvoice(new Invoice(req.body), result); }
                    else { RR.emptyFunction(req.body, result); }
                  },
                  function (result) {
                    if (RRId > 0) { RR.UpdateCustomerBlanketPOIdToRR(req.body.CustomerBlanketPOId, req.body.CustomerPONo, RRId, result); }
                    else { RR.emptyFunction(req.body, result); }
                  },
                  function (result) {
                    if (req.body.CustomerBlanketPOId > 0) {
                      con.query(SalesOrder.UpdateBlanketPONetAmtAndExcludeAmt(req.body.BlanketPONetAmount, req.body.BlanketPOExcludeAmt, req.body.SOId), result);
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

              function (result) { SalesOrder.UpdateCustomerBlanketPOIdToSO(req.body, result); },
              function (result) {
                if (req.body.InvoiceId > 0) { Invoice.UpdateCustomerBlanketPOIdToInvoice(new Invoice(req.body), result); }
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

exports.BlanketSOList = (req, res) => {
  SalesOrder.BlanketSOList(new SalesOrder(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


// Get server side list
exports.getSaleListByServerSide = (req, res) => {
  SalesOrder.getSaleListByServerSide(new SalesOrder(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To Get ExportToExcel
exports.ExportToExcel = (req, res) => {
  SalesOrder.ExportToExcel(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.View = (req, res) => {
  if (req.body.hasOwnProperty('SOId')) {
    var IdentityType = 0;
    SalesOrder.findById(req.body, IdentityType, req.body.IsDeleted, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "SO Id is required" }, null);
  }
};


// exports.GetEmailContentForSalesOrder = (req, res) => { 
//   if(req.body.hasOwnProperty('SOId')) {
//       SalesOrder.GetSalesOrderQuoteForSendEmailContent(req.body, (err, data) => {
//       Reqresponse.printResponse(res, err,data);  
//     });
//   }else {
//     Reqresponse.printResponse(res,{msg:"SO Id is required"},null);  
//    } 
// }; 


exports.SendEmailToSalesOrderQuoteBySOList = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    SalesOrder.SendEmailToSalesOrderQuoteBySOList(req.body.SOList, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};


// exports.SendEmailToSalesOrder = (req, res) => {  
//   SendEmail.SendEmailTo(req.body, (err, data) => {
//     Reqresponse.printResponse(res, err,data);  
//   });  
// }; 

exports.ApproveSO = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('SOId') && req.body.SOId > 0) {
      SalesOrder.ApproveSO(new SalesOrder(req.body), (err, data) => {
        //To add SO in notification table
        if (data.id > 0) {
          var NotificationObj = new NotificationModel({
            authuser: req.body.authuser,
            RRId: req.body.SOId,
            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_SO,
            NotificationIdentityId: req.body.SOId,
            NotificationIdentityNo: 'SO' + req.body.SOId,
            ShortDesc: 'Customer SO Approved',
            Description: 'Customer SO Approved by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
          });
          NotificationModel.Create(NotificationObj, (err, data1) => {

          });
        }
        Reqresponse.printResponse(res, err, data);
      });
    } else {
      Reqresponse.printResponse(res, { msg: "SO Id is required" }, null);
    }
  }
};



exports.CancelSO = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('SOId') && req.body.SOId > 0) {
      SalesOrder.CancelSO(new SalesOrder(req.body), (err, data) => {
        //To add SO in notification table
        // console.log(data);
        // if (data.id > 0) {
        var NotificationObj = new NotificationModel({
          authuser: req.body.authuser,
          RRId: req.body.SOId,
          NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_SO,
          NotificationIdentityId: req.body.SOId,
          NotificationIdentityNo: 'SO' + req.body.SOId,
          ShortDesc: 'Customer SO Cancelled',
          Description: 'Customer SO Cancelled by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
        });
        NotificationModel.Create(NotificationObj, (err, data1) => {

        });
        // }
        Reqresponse.printResponse(res, err, data);
      });
    } else {
      Reqresponse.printResponse(res, { msg: "SO Id is required" }, null);
    }
  }
};

exports.SOListforVendorBill = (req, res) => {
  SalesOrder.SOListforVendorBill(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To delete SalesOrder
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('SOId')) {
    SalesOrder.remove(new SalesOrder(req.body), 'SO deleted!', (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "SO Id is required" }, null);
  }
};


// exports.DeleteSOItem = (req, res) => {
//   if (req.body.hasOwnProperty('SOItemId')) {
//     if (req.body.SOItemId != "") {
//       async.parallel([
//         function (result) { SalesOrderItem.DeleteSOItem(req.body.SOItemId, result); },
//         function (result) { SalesOrderItem.SelectNewCalculationAfterSOItemDelete(req.body.SOId,req.body.SOItemId, result); },
//       ],
//         function (err, results) {
//           if (err) {
//             Reqresponse.printResponse(res, err, null);
//           }
//           results[1].res[0].TaxPercent = req.body.TaxPercent >= 0 ? req.body.TaxPercent : 0;
//           SalesOrder.UpdateAfterSOItemDeleteBySOId({ res: results[1] }, (err, data) => {
//           });
//           Reqresponse.printResponse(res, null, { ress: results[1] });
//         });
//     }
//     else {
//       Reqresponse.printResponse(res, { msg: "SOItem Id is required" }, null);
//     }
//   }
// };
// To DeleteSOItem
exports.DeleteSOItem = (req, res) => {
  var TokenUserId = getLogInUserId(req.body);
  if (req.body.hasOwnProperty('SOItemId')) {
    if (req.body.SOItemId != "") {
      async.parallel([
        function (result) { SalesOrderItem.DeleteSOItem(req.body.SOItemId, result); }
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }

          SalesOrderItem.SelectNewCalculationAfterSOItemDelete(req.body.SOId, req.body.SOItemId, (err, Rdata) => {
            if (err) {
              Reqresponse.printResponse(res, err, null);
            }
            if (Rdata.res[0]) {
              SalesOrder.UpdateAfterSOItemDeleteBySOId(Rdata.res[0], (err, data) => {
              });
              InvoiceItemModel.GetInvoiceItemId(req.body.SOItemId, (err, Ddata) => {//
                if (err) {
                  Reqresponse.printResponse(res, err, null);
                }
                if (Ddata.length > 0 && Ddata[0].InvoiceItemId > 0) {
                  async.parallel([
                    function (result) { InvoiceItemModel.DeleteInvoiceItem(Ddata[0].InvoiceItemId, result); },
                    function (result) {
                      if (req.body.hasOwnProperty('TaxPercent') && req.body.TaxPercent > 0) {
                        con.query(InvoiceItemModel.UpdateTaxPercent(req.body.TaxPercent, Ddata[0].InvoiceId), result)
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
                      InvoiceItemModel.SelectNewCalculationAfterInvoiceItemDelete(Ddata[0].InvoiceId, Ddata[0].InvoiceItemId, (err, Rdata) => {
                        if (err) {
                          Reqresponse.printResponse(res, err, null);
                        }
                        if (Rdata.res[0]) {
                          Invoice.UpdateInvoiceByInvoiceIdAfterInvoiceItemDelete(Rdata.res[0], (err, data) => {
                          });

                          // Invoice.SelectInvoiceStatus(req.body.InvoiceId, (errSIS, dataSIS) => {
                          con.query(SalesOrderItem.view(req.body.SOId), (errSIS, dataSIS) => {
                            // console.log(dataSIS);
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
                                    BlanketPOHistoryId: BlanketPOHistoryId,
                                    DifferenceAmount: DifferenceAmount,
                                    Amount: Amount,
                                    BlanketPONetAmount: dataSIS[0].BlanketPONetAmount
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
                          //  Reqresponse.printResponse(res, null, { ress: Rdata.res[0] });
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
      Reqresponse.printResponse(res, { msg: "SOItem Id is required" }, null);
    }
  }
};


















//Below are for MRO :
exports.MROAutoCreate = (req, res) => {
  SalesOrder.ValidateAlreadyExistMROForQuoteId(req.body.QuoteId, (err, data4) => {
    if (err) {
      Reqresponse.printResponse(res, err, null);
    }
    if (data4.length > 0) {
      Reqresponse.printResponse(res, { msg: "Sales Order is already created for this QuoteId :" + req.body.QuoteId }, null);
      return;
    }
    else {
      // let date_ob = new Date();
      // date_ob.setDate(date_ob.getDate()+Constants.CONST_DUE_DAYS);
      //console.log("Time :"+date_ob);
      var sql = Quotes.ViewByMROIdAndQuoteId(req.body.MROId, req.body.QuoteId);
      var sqlQi = QuotesItem.ViewQuoteItemByMROIdAndQuoteId(req.body.MROId, req.body.QuoteId);
      //  var sqlCusRef = CReferenceLabel.ViewCustomerReference(req.body.RRId);
      //  var sqlShipAddressBook = AddressBook.GetAddressByIdQuery(req.body.CustomerShipToId);
      //  var sqlBillAddressBook = AddressBook.GetAddressByIdQuery(req.body.CustomerBillToId);
      var UpdateCustomerBillShipQuery = MROModel.UpdateMROCustomerBillShipQuery(req.body);
      //var sqlRRNotes = RRNotes.ViewNotes(1,req.body.RRId);  
      async.parallel([
        function (result) { con.query(sql, result) },
        function (result) { con.query(sqlQi, result) },
        // function (result) { con.query(sqlCusRef, result) },
        //  function (result) { con.query(sqlShipAddressBook, result) },
        //function (result) { con.query(sqlBillAddressBook, result) },
        function (result) { con.query(UpdateCustomerBillShipQuery, result) },
        //function (result) { con.query(sqlRRNotes, result) }    
      ],
        function (err, results) {
          //console.log("results 0 "+results[0]);
          if (err)
            Reqresponse.printResponse(res, err, null);
          if (results[0][0].length > 0) {
            // if(QuotesRes[0].Status==Constants.CONST_QUOTE_STATUS_DRAFT) {
            // Reqresponse.printResponse(res, {msg:"You cannot convert the DRAFT quote to Sales Order. Change the status to OPEN and Create a Sales Order"},null);  
            // } 
            var QuotesRes = results[0][0];
            //  var ShipRes = results[2][0];
            // var BillRes = results[3][0];
            //var RRNotesInfo = results[6][0];
            //console.log("Notes : "+RRNotesInfo[0].Notes);
            const objSalesOrder = new SalesOrder({
              authuser: req.body.authuser,
              SONo: '',
              MROId: req.body.MROId,
              RRId: QuotesRes[0].RRId,
              RRNo: QuotesRes[0].RRNo,
              CustomerPONo: QuotesRes[0].CustomerPONo,
              CustomerId: QuotesRes[0].CustomerId,
              SOType: Constants.CONST_SO_TYPE_MRO,
              DateRequested: cDateTime.getDate(),
              DueDate: cDateTime.getDueDate(),
              ReferenceNo: '',
              WarehouseId: 0,
              ShipAddressBookId: req.body.CustomerShipToId,
              ShipAddressId: 0,
              BillAddressBookId: req.body.CustomerBillToId,
              BillAddressId: 0,
              Notes: '', // RRNotesInfo[0].Notes,
              IsConvertedToPO: 0,
              SubTotal: QuotesRes[0].TotalValue,
              AHFees: QuotesRes[0].ProcessFee,
              TaxPercent: QuotesRes[0].TaxPercent,
              TotalTax: QuotesRes[0].TotalTax,
              Discount: QuotesRes[0].Discount,
              Shipping: QuotesRes[0].ShippingFee,
              GrandTotal: QuotesRes[0].GrandTotal,
              Status: Constants.CONST_SO_STATUS_APPROVED,
              LeadTime: QuotesRes[0].LeadTime,
              WarrantyPeriod: QuotesRes[0].WarrantyPeriod,
              QuoteId: req.body.QuoteId
            });
            //console.log("Test " + objSalesOrder);
            if (results[1][0].length > 0) {
              SalesOrder.Create(objSalesOrder, (err, data) => {
                if (err) {
                  Reqresponse.printResponse(res, err, null);
                }
                var SOId = data.SOId;
                var objSalesOrderListItem = results[1][0];
                var LeadTime = 0; var count = 0;
                for (let obj of objSalesOrderListItem) {
                  if (obj.LeadTime) {
                    LeadTime = obj.LeadTime;
                    count++;
                    if (count >= 2) {
                      LeadTime = 0;
                      break;
                    }
                  }
                }
                // var objGlobalCustomerReference = results[2][0];
                // var objShippingOrderAddress = results[2][0];
                // var objBillingOrderAddress = results[3][0];
                // const objShipOrderAddressinfo = new OrderAddress({
                //   AddressName: objShippingOrderAddress[0].StreetAddress,
                //   AddressType: 2,
                //   IdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                //   IdentityId: data.SOId,
                //   StreetAddress: objShippingOrderAddress[0].StreetAddress,
                //   SuiteOrApt: objShippingOrderAddress[0].SuiteOrApt,
                //   City: objShippingOrderAddress[0].City,
                //   StateId: objShippingOrderAddress[0].StateId ? objShippingOrderAddress[0].StateId : 0,
                //   CountryId: objShippingOrderAddress[0].CountryId,
                //   Zip: objShippingOrderAddress[0].Zip,
                //   AllowShipment: 0,
                //   Phone: objShippingOrderAddress[0].PhoneNoPrimary,
                //   Fax: objShippingOrderAddress[0].Fax,

                // });

                // const objBillOrderAddressinfo = new OrderAddress({
                //   AddressName: objBillingOrderAddress[0].StreetAddress,
                //   AddressType: 1,
                //   IdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                //   IdentityId: data.SOId,
                //   StreetAddress: objBillingOrderAddress[0].StreetAddress,
                //   SuiteOrApt: objBillingOrderAddress[0].SuiteOrApt,
                //   City: objBillingOrderAddress[0].City,
                //   StateId: objBillingOrderAddress[0].StateId ? objBillingOrderAddress[0].StateId : 0,
                //   CountryId: objBillingOrderAddress[0].CountryId,
                //   Zip: objBillingOrderAddress[0].Zip,
                //   AllowShipment: 0,
                //   Phone: objBillingOrderAddress[0].PhoneNoPrimary,
                //   Fax: objBillingOrderAddress[0].Fax,
                // });

                const srr = new MROModel({
                  authuser: req.body.authuser,
                  MROId: req.body.MROId,
                  CustomerSONo: 'SO' + data.SOId,
                  CustomerSOId: data.SOId
                });

                const SalesOrderObj = new SalesOrder({
                  authuser: req.body.authuser,
                  SOId: data.SOId
                });
                var sqlUpdateCustomerSONo = MROModel.UpdateCustomerSONoByMROId(srr, LeadTime);
                var sqlUpdateSalesOrderDueAutoUpdate = SalesOrder.UpdateSalesOrderDueAutoUpdate(data.SOId, LeadTime);
                //To add SO in notification table
                // var NotificationObj = new NotificationModel({
                //   RRId: req.body.RRId,
                //   NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_SO,
                //   NotificationIdentityId: data.SOId,
                //   NotificationIdentityNo: 'SO' + data.SOId,
                //   ShortDesc: 'Customer SO Draft Created',
                //   Description: 'Customer SO Draft created by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
                // });


                async.parallel([
                  function (result) { SalesOrderItem.Create(SOId, objSalesOrderListItem, result); },
                  // function (result) { GlobalCustomerReference.Create(Constants.CONST_IDENTITY_TYPE_SO, SOId, objGlobalCustomerReference, result); },
                  function (result) { SalesOrder.UpdateSONoById(SalesOrderObj, result); },
                  function (result) { Quotes.ConvertedQuoteToSO(QuotesRes[0].QuoteId, result); },
                  function (result) { con.query(sqlUpdateCustomerSONo, result) },
                  // function (result) { if (objShippingOrderAddress.length > 0) { OrderAddress.Create(objShipOrderAddressinfo, result); } },
                  // function (result) { if (objShippingOrderAddress.length > 0) { OrderAddress.Create(objBillOrderAddressinfo, result); } },
                  function (result) { con.query(sqlUpdateSalesOrderDueAutoUpdate, result) },
                  // function (result) { NotificationModel.Create(NotificationObj, result); },
                  function (result) { if (Constants.CONST_SO_STATUS_APPROVED == objSalesOrder.Status) { SalesOrder.ApproveSO(new SalesOrder(SalesOrderObj), result); } else { RR.emptyFunction(NotificationObj, result); } },
                ],
                  function (err, results2) {
                    if (err)
                      Reqresponse.printResponse(res, err, null);
                  });
              });
            } else {
              Reqresponse.printResponse(res, { msg: "Quote Item not available. Please check the customer quote and create SO" }, null);
            }
            Reqresponse.printResponse(res, err, { QuotesInfo: results[0][0], QuotesItemInfo: results[1][0], BillAddressInfo: results[2][0] });
          } else {
            Reqresponse.printResponse(res, { msg: "Quote not found" }, null);
          }
        });
    }
  });
}
exports.CreateSOByMRO = (req, res) => {//
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    var GrandTotal = 0; var LeadTime = 0; var count = 0; var BasePrice = 0;
    for (let obj of req.body.SalesOrderItem) {
      GrandTotal += parseFloat(obj.Price);
      BasePrice += parseFloat(obj.BasePrice);
      obj.Description = obj.PartDescription;
      if (obj.LeadTime) {
        LeadTime = obj.LeadTime;
        count++;
        if (count >= 2) {
          LeadTime = 0;
        }
      }
    }
    const objSalesOrder = new SalesOrder({
      authuser: req.body.authuser,
      SONo: '',
      MROId: req.body.MROId,
      RRId: 0,
      RRNo: '',
      CustomerPONo: req.body.CustomerPONo,
      CustomerBlanketPOId: req.body.CustomerBlanketPOId,
      CustomerId: req.body.CustomerId,
      SOType: Constants.CONST_SO_TYPE_MRO,
      DateRequested: cDateTime.getDate(),
      DueDate: req.body.DueDate,
      ReferenceNo: '',
      WarehouseId: 0,
      ShipAddressBookId: req.body.CustomerShipToId,
      ShipAddressId: 0,
      BillAddressBookId: req.body.CustomerBillToId,
      BillAddressId: 0,
      Notes: '',
      IsConvertedToPO: 0,
      SubTotal: GrandTotal,
      AHFees: 0,
      TaxPercent: 0,
      TotalTax: 0,
      Discount: 0,
      Shipping: 0,
      GrandTotal: GrandTotal,
      Status: Constants.CONST_SO_STATUS_APPROVED,
      LeadTime: LeadTime,
      WarrantyPeriod: 0,
      QuoteId: req.body.QuoteId,
      BlanketPOExcludeAmount: 0,
      BlanketPONetAmount: GrandTotal,
      // LocalCurrencyCode: req.body.LocalCurrencyCode,
      // ExchangeRate: req.body.ExchangeRate,
      // BaseCurrencyCode: req.body.BaseCurrencyCode,
      // BaseGrandTotal:req.body.QuoteAmount,
      LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : '',
      ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 0,
      BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : '',
      BaseGrandTotal: BasePrice

    });

    req.body.QuoteAmount = GrandTotal;
    SalesOrder.Create(objSalesOrder, (err, data) => {
      if (err) {
        Reqresponse.printResponse(res, err, null);
      }
      req.body.SOId = data.SOId;
      objSalesOrder.SOId = data.SOId;

      const srr = new MROModel({
        authuser: req.body.authuser,
        MROId: req.body.MROId,
        CustomerSONo: 'SO' + data.SOId,
        CustomerSOId: data.SOId
      });

      var MROStatusHistoryObj = new MROStatusHistory({
        authuser: req.body.authuser,
        MROId: req.body.MROId,
        HistoryStatus: Constants.CONST_MROS_APPROVED
      });

      const SalesOrderObj = new SalesOrder({
        authuser: req.body.authuser,
        SOId: data.SOId,
        authuser: req.body.authuser
      });


      async.parallel([
        function (result) {
          if (req.body.hasOwnProperty('SalesOrderItem'))
            SalesOrderItem.Create(data.SOId, req.body.SalesOrderItem, result);
        },
        function (result) { SalesOrder.UpdateSONoById(objSalesOrder, result); },
        function (result) { con.query(MROModel.UpdateSODueDateByMRO(srr, req.body.DueDate), result); },
        // function (result) { con.query(SalesOrder.UpdateSalesOrderDueAutoUpdate(data.SOId, LeadTime), result); },
        function (result) {
          if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {
            CustomerBlanketPO.GetCurrentBalance(req.body.CustomerBlanketPOId, result);
          }
          else { RR.emptyFunction(req.body, result); }
        },
        function (result) { con.query(SalesOrder.SaveCustomerPoNo(new SalesOrder(req.body)), result); },
        function (result) { MROStatusHistory.Create(MROStatusHistoryObj, result); },
        function (result) { MROModel.UpdateMROStatusApproved(req.body.MROId, result); },
        function (result) { if (Constants.CONST_SO_STATUS_APPROVED == objSalesOrder.Status) { SalesOrder.ApproveSO(SalesOrderObj, result); } else { RR.emptyFunction(SalesOrderObj, result); } },

      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          else {
            if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {

              req.body.CurrentBalance = results[3][0].CurrentBalance > 0 ? results[3][0].CurrentBalance : 0;
              var DebitHistoryObjCreate = new CustomerBlanketPOHistory({
                authuser: req.body.authuser,
                BlanketPOId: req.body.CustomerBlanketPOId,
                RRId: req.body.RRId > 0 ? req.body.RRId : 0,
                MROId: req.body.MROId > 0 ? req.body.MROId : 0,
                PaymentType: 2,
                Amount: parseFloat(req.body.QuoteAmount),
                CurrentBalance: parseFloat(req.body.CurrentBalance) - parseFloat(req.body.QuoteAmount),
                QuoteId: req.body.QuoteId,
                Comments: req.body.Comments,
                LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                BaseAmount: parseFloat(req.body.QuoteAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                BaseCurrentBalance: (parseFloat(req.body.CurrentBalance) - parseFloat(req.body.QuoteAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
              });

              const GeneralHistoryLogPayload = new GeneralHistoryLog({
                authuser: req.body.authuser,
                IdentityType: Constants.CONST_IDENTITY_TYPE_MRO,
                IdentityId: req.body.MROId,
                RequestBody: JSON.stringify(req.body),
                Type: "SO - MRO",
                BaseTableRequest: JSON.stringify(objSalesOrder),
                ItemTableRequest: JSON.stringify(req.body.SalesOrderItem),
                BaseTableResponse: JSON.stringify(data),
                ItemTableResponse: JSON.stringify(results[0]),
                ErrorMessage: JSON.stringify(err),
                CommonLogMessage: JSON.stringify(results)
              });

              async.parallel([
                function (result) { CustomerBlanketPO.UpdateCurrentBalance(req.body.CustomerBlanketPOId, req.body.QuoteAmount, result); },
                function (result) { CustomerBlanketPOHistory.Create(DebitHistoryObjCreate, result); },
                function (result) { SalesOrder.UpdateCustomerBlanketPOIdToSO(req.body, result); },
                function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload, result); },
              ],
                function (err, results) {
                  if (err) {
                    Reqresponse.printResponse(res, err, null);
                  }
                });
            }
          }
        });
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.UpdatePOIdToSalesOrder = (req, res) => {
  SalesOrder.GetPOIdlist(req.body, (err, data) => {
    var POIdlist = data;
    for (let val of POIdlist) {
      if (val.RRId > 0 && val.POId > 0) {
        SalesOrder.UpdatePOIdByRRId(val.POId, val.RRId, (err, data) => {
          if (err)
            Reqresponse.printResponse(res, err, null);
        });
      }
    }
    Reqresponse.printResponse(res, err, data);
  });
};

exports.UpdatePOItemIdToSalesOrder = (req, res) => {
  async.parallel([
    function (result) { SalesOrderItem.GetSOItemList(req.body, result); },
  ],
    function (err, results) {
      if (err)
        Reqresponse.printResponse(res, err, null);
      else {
        if (results[0].length > 0)
          for (var i = 0; i < results[0].length; i++) {
            var SOobj = results[0][i];
            if (i == results[0].length - 1) {
              SOobj.isLastItem = true;
            }
            PurchaseOrderItem.GetPOItemByRRIdAndPartId(SOobj.RRId, SOobj.PartId, SOobj, (err, Resdata) => {
              if (err)
                Reqresponse.printResponse(res, err, null);
              else {
                let resSoobj = Resdata.SoObj;
                if (Resdata.length > 0) {
                  if (Resdata[0].POItemId > 0 && resSoobj.SOItemId > 0) {
                    SalesOrder.UpdatePOItemIdBySOItemId(Resdata[0].POItemId, resSoobj, (err, data) => {
                      if (err)
                        Reqresponse.printResponse(res, err, null);
                      if (data.resSoobj.isLastItem) {
                        Reqresponse.printResponse(res, null, results[0]);
                      }
                    });
                  }
                }
              }
            });
          }
      }
    });
};

exports.UpdatePOLineItemPrice = (req, res) => {
  SalesOrder.UpdatePOLineItemPriceQuery(req.body, (err, data) => {
    var resultlist = data;
    for (var i = 0; i < resultlist.length; i++) {
      var val = resultlist[i];
      if (val.POItemId > 0) {
        SalesOrder.UpdatePOLineItemPrice(val, (err, data) => {

        });
      }
    }
    Reqresponse.printResponse(res, null, data);
  });
};

exports.LinkSOPO = (req, res) => {
  SalesOrder.LinkSOPOListQuery(req.body, (err, data) => {
    var resultlist = data;
    for (var i = 0; i < resultlist.length; i++) {
      var val = resultlist[i];
      if (val.RRId > 0) {
        SalesOrder.LinkSOPOUpdateQuery(val, (err, data) => {

        });
      }
    }
    Reqresponse.printResponse(res, null, data);
  });
};

exports.LinkSOPOLineItem = (req, res) => {
  SalesOrder.LinkSOPOLineItemListQuery(req.body, (err, data) => {
    var resultlist = data;
    for (var i = 0; i < resultlist.length; i++) {
      var val = resultlist[i];
      if (val.RRId > 0 && val.SOId > 0) {
        SalesOrder.LinkSOPOLineItemUpdateQuery(val, (err, data) => {

        });
      }
    }
    Reqresponse.printResponse(res, null, data);
  });
};

exports.LinkInvoiceSOLineItem = (req, res) => {
  SalesOrder.LinkInvoiceSOLineItemListQuery(req.body, (err, data) => {
    var resultlist = data;
    for (var i = 0; i < resultlist.length; i++) {
      var val = resultlist[i];
      if (val.RRId > 0 && val.SOId > 0) {
        SalesOrder.LinkInvoiceSOLineItemUpdateQuery(val, (err, data) => {

        });
      }
    }
    Reqresponse.printResponse(res, null, data);
  });
};



exports.LinkVendorBillPO = (req, res) => {
  SalesOrder.LinkVendorBillPOQuery(req.body, (err, data) => {
    var resultlist = data;
    for (var i = 0; i < resultlist.length; i++) {
      var val = resultlist[i];
      if (val.VendorInvoiceId > 0 && val.POId > 0) {
        SalesOrder.LinkVendorBillPO(val, (err, data) => {

        });
      }
    }
    Reqresponse.printResponse(res, null, data);
  });
};




exports.UpdateSOIdToPO = (req, res) => {
  SalesOrder.GetSOIdlist(req.body, (err, data) => {
    if (err)
      Reqresponse.printResponse(res, err, null);

    var SOIdlist = data;
    for (var i = 0; i < SOIdlist.length; i++) {
      var val = SOIdlist[i];

      if (val.RRId > 0 && val.SOId > 0) {
        SalesOrder.UpdateSOIdByRRId(val.SOId, val.RRId, (err, data) => {
          // if (err)
          // Reqresponse.printResponse(res, err, null);
        });
      }
    }
    Reqresponse.printResponse(res, null, data);
  });
};

exports.UpdateSOItemIdToPO = (req, res) => {
  async.parallel([
    function (result) { PurchaseOrderItem.GetPOItemList(req.body, result); },
  ],
    function (err, results) {
      if (err) {
        //Reqresponse.printResponse(res, err, null);
      } else {
        if (results[0].length > 0)

          for (var i = 0; i < results[0].length; i++) {
            var POOBJ = results[0][i];
            /*  if (i == results[0].length - 1) {
                POOBJ.isLastItem = true;
              }*/
            // console.log("RRId = " + POOBJ.RRId);
            SalesOrderItem.GetSOItemByRRIdAndPartId(POOBJ.RRId, POOBJ.PartId, POOBJ, (err, Resdata) => {
              if (err) {
                // Reqresponse.printResponse(res, err, null);
              } else {
                var RESPOOBJ = Resdata.POOBJ;
                // console.log("Resdata.length=" + Resdata.length);
                if (Resdata.length > 0) {
                  //console.log("RESPOOBJ.POItemId=" + RESPOOBJ.POItemId);
                  if (Resdata[0].SOItemId > 0 && RESPOOBJ.POItemId > 0) {
                    SalesOrder.UpdateSOItemIdByPOItemId(Resdata[0].SOId, Resdata[0].SOItemId, RESPOOBJ, (err, data) => {
                      // if (err)
                      //Reqresponse.printResponse(res, err, null);
                      // if (data.RESPOOBJ.isLastItem) {
                      // Reqresponse.printResponse(res, null, results[0]);
                      //}
                    });
                  }
                }
              }
            });
          }
      }
    });
};

exports.addToExclude = (req, res) => {
  if (req.body.hasOwnProperty('SOItemId') && req.body.hasOwnProperty('SOId')) {
    SalesOrderItem.addToExclude(req.body, (err, Resdata) => {
      if (err) {
        Reqresponse.printResponse(res, err, null);
      } else {
        // console.log(Resdata.affectedRows);
        // if (Resdata.affectedRows > 0) {
        // if (Resdata[0].SOItemId > 0 && RESPOOBJ.POItemId > 0) {
        SalesOrder.addToExclude(req.body, (err, data) => {
          if (err) {
            console.log(err);
            Reqresponse.printResponse(res, err, null);
          } else {
            // console.log(data);
            Reqresponse.printResponse(res, null, '');
          }


        });
        // }
        // }
      }
    });
  } else {
    Reqresponse.printResponse(res, { msg: "SO/SOItem Id is required" }, null);
  }
};

exports.removeFromExclude = (req, res) => {
  if (req.body.hasOwnProperty('SOItemId') && req.body.hasOwnProperty('SOId')) {
    SalesOrderItem.removeFromExclude(req.body, (err, Resdata) => {
      if (err) {
        Reqresponse.printResponse(res, err, null);
      } else {
        // console.log(Resdata);
        // if (Resdata.affectedRows > 0) {
        // if (Resdata[0].SOItemId > 0 && RESPOOBJ.POItemId > 0) {
        SalesOrder.removeFromExclude(req.body, (err, data) => {
          if (err) {
            console.log(err);
            Reqresponse.printResponse(res, err, null);
          } else {
            // console.log(data);
            Reqresponse.printResponse(res, null, data);
          }
        });
        // }
        // }
      }
    });
  } else {
    Reqresponse.printResponse(res, { msg: "SO/SOItem Id is required" }, null);
  }
};






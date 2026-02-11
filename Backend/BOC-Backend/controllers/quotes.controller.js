/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Quotes = require("../models/quotes.model.js");
const QuoteItem = require("../models/quote.item.model.js");
const RRVendorParts = require("../models/repair.request.vendor.parts.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const AddressBook = require("../models/customeraddress.model.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");
const VendorQuote = require("../models/vendor.quote.model.js");
const VendorQuoteItem = require("../models/vendor.quote.item.model.js");
const RRVendorsModel = require("../models/repair.request.vendors.model.js");
const RRModel = require("../models/repair.request.model.js");
const NotificationModel = require("../models/notification.model.js");
const MROVendorModel = require("../models/mro.vendor.js");
const MROVendorPartModel = require("../models/mro.vendor.parts.model.js");
const MROModel = require("../models/mro.model.js");
const RRStatusHistory = require("../models/rr.status.history.model.js");
const CQFollowUp = require("../models/customer.quote.followup.model.js");
const CustomerBlanketPOModel = require("../models/customer.blanket.po.model.js");
const CustomerBlanketPOHistoryModel = require("../models/customer.blanket.po.history.model.js");
const Invoice = require("../models/invoice.model.js");
const SalesOrder = require("../models/sales.order.model.js");
const UsersModel = require("../models/users.model.js");
const CustomerModel = require("../models/customers.model.js");
const CurrencyExchangeRateModel = require("../models/currency.exchange.rate.model.js");
const CountryModel = require("../models/country.model.js");


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

exports.DuplicateQuote = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var Quotesql = Quotes.viewquery(req.body.QuoteId, 0, req.body);
    var QuoteItemsql = QuoteItem.viewquery(req.body.QuoteId);
    async.parallel([
      function (result) { con.query(Quotesql, result) },
      function (result) { con.query(QuoteItemsql, result) },
      function (result) { con.query(AddressBook.GetBillingAddressIdByCustomerId(req.body.CustomerId), result); },
      function (result) { con.query(AddressBook.GetShippingAddressIdByCustomerId(req.body.CustomerId), result); },
      function (result) { con.query(UsersModel.listbyuserquery(Constants.CONST_IDENTITY_TYPE_CUSTOMER, req.body.CustomerId), result) },
      function (result) { con.query(CustomerModel.viewquery(req.body.CustomerId, req.body), result) },
    ],
      function (err, results) {
        if (err)
          Reqresponse.printResponse(res, err, null);
        else {
          if (results[0][0].length > 0 && results[1][0].length > 0) {

            var Quoteobject = {
              authuser: req.body.authuser,
              TaxType: results[0][0][0].TaxType,
              QuoteDate: cDateTime.getDate(),
              IdentityId: req.body.CustomerId > 0 ? req.body.CustomerId : 0,
              IdentityType: Constants.CONST_IDENTITY_TYPE_CUSTOMER,
              RRId: 0,
              MROId: 0,
              QuoteType: results[0][0][0].QuoteType,
              ShippingFee: results[0][0][0].ShippingFee,
              GrandTotal: results[0][0][0].GrandTotal,
              TotalValue: results[0][0][0].TotalValue,
              TaxPercent: results[0][0][0].TaxPercent,
              ProcessFee: results[0][0][0].ProcessFee,
              TotalTax: results[0][0][0].TotalTax,
              Discount: results[0][0][0].Discount,
              LocalCurrencyCode: results[0][0][0].LocalCurrencyCode,
              ExchangeRate: results[0][0][0].ExchangeRate,
              BaseCurrencyCode: results[0][0][0].BaseCurrencyCode,
              BaseGrandTotal: results[0][0][0].BaseGrandTotal,
              CustomerBillToId: results[2][0][0].AddressId > 0 ? results[2][0][0].AddressId : 0,
              CustomerShipToId: results[3][0][0].AddressId > 0 ? results[3][0][0].AddressId : 0,
              Status: Constants.CONST_QUOTE_STATUS_DRAFT,
              QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_DRAFT,

              FirstName: results[4][0][0].FirstName,
              LastName: results[4][0][0].LastName,
              Email: results[4][0][0].Email,
              CompanyName: results[5][0].length > 0 ? results[5][0][0].CompanyName : '',
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

            Quotes.CreateQuotes(Quoteobject, (err, data) => {
              if (err)
                Reqresponse.printResponse(res, err, null);

              req.body.QuoteId = data.id;
              async.parallel([
                function (result) { QuoteItem.CreateQuoteItem(req.body.QuoteId, req.body.QuoteItemArray, result) },
                function (result) { Quotes.UpdateQuotesCodeByQuoteId(req.body, result); },
              ],
                function (err, results) {
                  if (err)
                    Reqresponse.printResponse(res, err, null);
                  else {
                    Reqresponse.printResponse(res, null, req.body);
                  }
                });
            });
          } else {
            Reqresponse.printResponse(res, err, "No record for Quote = " + req.body.QuoteId);
          }
        }
      });
  }
};

//To Save And Create CustomerQuote
exports.SaveAndCreateCustomerQuote = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.ExchangeRate == null || req.body.ExchangeRate == '' || req.body.ExchangeRate == undefined || req.body.ExchangeRate == 0) {
      Reqresponse.printResponse(res, { msg: "Exchange-rate is not available. Please contact admin!." }, null);
    } else {
      req.body.RRVendorId = req.body.VendorsList.RRVendorId;
      //To Accept RRVendor
      RRVendorsModel.AcceptRRVendor(req.body, (err, data) => {

        if (data.id) {
          //To Update RRVendors
          RRVendorsModel.UpdateRRVendors(req.body, (err, data) => {
            RRVendorParts.UpdateorCreateRRVendorParts(req, req.body.VendorPartsList, (RRparterr, RRpartdata) => {

              // for (let val of req.body.VendorPartsList) {
              //   if (!req.body.hasOwnProperty('RRVendorPartsId') && val.RRVendorPartsId != "" && val.RRVendorPartsId != null) {
              //     RRVendorParts.UpdateRRVendorPartsBySingleRecords(val, (err, data) => {
              //     });
              //   }
              //   else {
              //     val.RRId = req.body.RRId;
              //     val.RRVendorId = req.body.VendorsList.RRVendorId;
              //     val.VendorId = req.body.VendorsList.RRVendorId;
              //     RRVendorParts.CreateRRVendorParts(new RRVendorParts(val), (err, data) => {
              //     });
              //   }
              // }
              //To Quote AutoCreate
              Quotes.GetAcceptVendors(new Quotes(req.body), (err, Quotedata) => {
                CountryModel.findById(Quotedata[0].CustomerLocation, (errCM, resultCM) => {
                  // console.log("######################################################")
                  // console.log(Quotedata[0]);
                  var exRateU = 1;
                  if (Quotedata.length > 0) {
                    if (Quotedata[0].CustomerCurrencyCode != Quotedata[0].LocalCurrencyCode) {
                      exRateU = parseFloat(Quotedata[0].exExchangeRate);
                    }
                    var TotalTax = ((parseFloat(Quotedata[0].SubTotal) * parseFloat(Quotedata[0].TaxPercent)) / 100);
                    // console.log("######################################################")
                    // console.log((Quotedata[0].SubTotal + Quotedata[0].AdditionalCharge + TotalTax + Quotedata[0].Shipping) - Quotedata[0].Discount);
                    // console.log("######################################################")
                    // console.log("########################Quotedata##############################")
                    // console.log(Quotedata[0])
                    // console.log("######################################################")

                    const Quotes1 = new Quotes({
                      authuser: req.body.authuser,
                      QuoteNo: '',
                      VendorId: Quotedata[0].VendorId,
                      RRVendorId: req.body.RRVendorId,
                      CustomerBillToId: req.body.CustomerBillToId ? req.body.CustomerBillToId : 0,
                      CustomerShipToId: req.body.CustomerShipToId ? req.body.CustomerShipToId : 0,
                      QuoteType: Constants.CONST_QUOTE_TYPE_REPAIR,
                      RRId: req.body.RRId,
                      RRNo: Quotedata[0].RRNo,
                      IdentityType: Constants.CONST_IDENTITY_TYPE_CUSTOMER,
                      IdentityId: Quotedata[0].CustomerId,
                      Description: '',
                      QuoteDate: cDateTime.getDate(),
                      CompanyName: Quotedata[0].CompanyName,
                      FirstName: Quotedata[0].FirstName,
                      LastName: Quotedata[0].LastName,
                      Email: Quotedata[0].Email,
                      TaxType: Quotedata[0].TaxType,
                      TermsId: Quotedata[0].TermsId,
                      Notes: Quotedata[0].Notes,
                      AddressId: '0',
                      TotalValue: roundTo((Quotedata[0].SubTotal * exRateU), 2),
                      ProcessFee: Quotedata[0].AdditionalCharge,
                      TaxPercent: 0,
                      TotalTax: 0,
                      Discount: Quotedata[0].Discount,
                      ShippingFee: roundTo(Quotedata[0].Shipping, 2),
                      Shipping: roundTo(Quotedata[0].Shipping, 2),
                      GrandTotal: roundTo((((parseFloat(Quotedata[0].SubTotal) + parseFloat(Quotedata[0].AdditionalCharge) + parseFloat(TotalTax) + parseFloat(Quotedata[0].Shipping)) - parseFloat(Quotedata[0].Discount)) * parseFloat(exRateU)), 2),

                      LocalCurrencyCode: Quotedata[0].CustomerCurrencyCode,
                      ExchangeRate: Quotedata[0].ExchangeRate,
                      BaseCurrencyCode: Quotedata[0].BaseCurrencyCode,
                      BaseGrandTotal: roundTo((((parseFloat(Quotedata[0].SubTotal) + parseFloat(Quotedata[0].AdditionalCharge) + parseFloat(TotalTax) + parseFloat(Quotedata[0].Shipping)) - parseFloat(Quotedata[0].Discount)) * parseFloat(Quotedata[0].ExchangeRate)), 2),

                      Status: Constants.CONST_QUOTE_STATUS_DRAFT,
                      QuoteId: 0,
                      RouteCause: Quotedata[0].RouteCause,
                      LeadTime: Quotedata[0].LeadTime,
                      WarrantyPeriod: Quotedata[0].WarrantyPeriod,
                      SubTotal: roundTo((parseFloat(Quotedata[0].SubTotal) * parseFloat(exRateU)), 2),
                      AdditionalCharge: roundTo((parseFloat(Quotedata[0].AdditionalCharge) * parseFloat(exRateU)), 2),
                    });
                    // console.log("###########################Quotes1###########################")
                    // console.log(Quotes1)
                    // console.log("######################################################")
                    RRVendorParts.ViewVendorParts1(req.body.RRId, Quotedata[0].RRVendorId, (err, data1) => {
                      if (err) {
                        console.log(err);
                        Reqresponse.printResponse(res, { msg: "RR Not Found" }, null);
                      }
                      console.log("Data from vendor quote")
                      console.log(data1)
                      // console.log("######################################################")
                      if (data1.length > 0) {
                        Quotes.CreateQuotes(new Quotes(Quotes1), (err, data) => {
                          if (err) {
                            console.log(err);
                            Reqresponse.printResponse(res, err, null);
                          }

                          var UpdateCustomerBillShipQuery = RRModel.UpdateCustomerBillShipQuery(req.body);

                          Quotes1.QuoteId = data.id;
                          Quotedata[0].QuoteId = data.id;

                           var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;
                          //To add a quote to notification table
                          var NotificationObj = new NotificationModel({
                            authuser: req.body.authuser,
                            RRId: req.body.RRId,
                            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                            NotificationIdentityId: data.id,
                            NotificationIdentityNo: 'QT' + data.id,
                            ShortDesc: 'Customer Quote Created',
                            Description: 'Customer Quote Created by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
                          });
                          for (let val of data1) {
                            // console.log("Data1 result after " + val);
                            if (Quotedata[0].PartId == val.PartId) {
                              val.WarrantyPeriod = Quotedata[0].WarrantyPeriod;
                              break;
                            }
                          }



                          for (let val of data1) {
                            val.exExchangeValue = exRateU;
                            val.ItemLocalCurrencyCode = Quotedata[0].CustomerCurrencyCode;
                            val.CustomerLocation = Quotedata[0].CustomerLocation;
                            val.ItemTaxPercent = resultCM.VatTaxPercentage ? resultCM.VatTaxPercentage : 0;
                          }

                          console.log("data sending to auto create")
                          console.log(data1);

                          async.parallel([
                            function (result) { Quotes.UpdateQuotesCodeByQuoteId(Quotes1, result); },
                            function (result) { QuoteItem.AutoCreateQuoteItem(req.body,data.id, data1, result) },
                            // Mar 14 Changes
                            // function (result) { VendorQuote.CreateVendorQuote(Quotes1, result); },
                            function (result) { VendorQuote.CreateVendorQuote(Quotedata[0], result); },
                            function (result) { con.query(UpdateCustomerBillShipQuery, result) },
                            function (result) { NotificationModel.Create(NotificationObj, result); }
                          ],
                            function (errp, results) {
                              if (errp) {
                                // console.log(errp);
                                Reqresponse.printResponse(res, errp, null);
                              }
                              var resQuote = results[2];
                              console.log(results[1]);
                              if (results[1] && results[1].SumOfPrice >= 0) {
                                Quotes1.TotalValue = roundTo(results[1].SumOfPrice, 2);
                                Quotes1.BaseGrandTotal = roundTo(results[1].sumOfBaseFinalPrice, 2);
                                Quotes1.ProcessFee = 0; Quotes1.TotalTax = 0; Quotes1.ShippingFee = 0;
                                Quotes1.Discount = 0;
                                console.log("Inside Quotes1");
                                // console.log(Quotes1);
                                Quotes.UpdateSumOfValue(Quotes1, (errp, data2) => {
                                  // Quotedata[0].TotalValue = results[1].SumOfPrice;
                                  // Quotedata[0].BaseGrandTotal = results[1].sumOfBaseFinalPrice;
                                  // VendorQuoteQuotes.UpdateSumOfValue(Quotedata[0], (errpd1, datad1) => {
                                  // });
                                });


                                var resQuote = results[2];
                                var VendorQuoteId = resQuote.id;
                                //console.log("VendorQuoteId = " + VendorQuoteId);
                                RRVendorParts.ViewVendorParts1(req.body.RRId, Quotedata[0].RRVendorId, (errID, CreateVendorQuoteItemData) => {
                                  // console.log("CreateVendorQuoteItemData")
                                  // console.log(CreateVendorQuoteItemData)
                                  for (let CreateVendorQuoteItemDataVal of CreateVendorQuoteItemData) {
                                    if (Quotedata[0].PartId == CreateVendorQuoteItemDataVal.PartId) {
                                      CreateVendorQuoteItemDataVal.WarrantyPeriod = Quotedata[0].WarrantyPeriod;
                                      break;
                                    }
                                  }
                                  // console.log("CreateVendorQuoteItemData1")
                                  // console.log(CreateVendorQuoteItemData)
                                  async.parallel([

                                    function (result) { VendorQuoteItem.CreateVendorQuoteItem(VendorQuoteId, data.id, CreateVendorQuoteItemData, result); },
                                  ],
                                    function (errvendor, results) {
                                      if (errvendor) {
                                        Reqresponse.printResponse(res, errvendor, null);
                                      }
                                      Reqresponse.printResponse(res, null, data);
                                    });
                                });

                              } else {
                                Reqresponse.printResponse(res, { msg: "Quotes not found" }, null);
                              }
                            }
                          );
                          // Reqresponse.printResponse(res, err, data);

                        });
                      }
                      else {
                        Reqresponse.printResponse(res, { msg: "No VendorParts for RRId=" + req.body.RRId }, null);
                      }
                    });
                  }
                  else {
                    Reqresponse.printResponse(res, { msg: "Accept the vendor quote before generating the customer quote " }, null);
                  }
                });
              });
            });
          });
        }
        else {
          Reqresponse.printResponse(res, { msg: "RRVendorId Not Found" }, null);
        }
      });
    }
  }
};
//
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    Quotes.CreateQuotes(new Quotes(req.body), (err, data) => {
      const Quotes1 = new Quotes({
        authuser: req.body.authuser,
        QuoteId: data.id,
      });

      async.parallel([
        function (result) {
          if (req.body.hasOwnProperty('QuoteItem'))
            QuoteItem.CreateQuoteItem(data.id, req.body.QuoteItem, result);
        },
        function (result) { Quotes.UpdateQuotesCodeByQuoteId(Quotes1, result); },

      ],
        function (err, results) {

          if (err)
            Reqresponse.printResponse(res, err, null);

          Reqresponse.printResponse(res, err, data);
        }
      );
    });

  }
};

exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    async.parallel([
      function (result) { Quotes.UpdateQuotes(new Quotes(req.body), result); },
      function (result) { if (req.body.hasOwnProperty('QuoteItem')) { QuoteItem.UpdateQuoteItem(req.body, result); } }
    ],
      function (err, results) {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        }
        Reqresponse.printResponse(res, err, { data: results[0] });
      }
    );

  }
};

exports.updatecustomerquote = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    Quotes.GetAcceptVendors(new Quotes(req.body), (err, Quotedata) => {
      for (let val of req.body.QuoteItem) {
        if (Quotedata[0].PartId == val.PartId) {
          val.WarrantyPeriod = req.body.WarrantyPeriod;
          break;
        }
      }
      async.parallel([
        function (result) { Quotes.UpdateCustomerQuote(new Quotes(req.body), result); },
        function (result) { if (req.body.hasOwnProperty('QuoteItem')) { QuoteItem.UpdateCustomerQuoteItem(req.body, result); } }
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          Reqresponse.printResponse(res, err, { data: results[0] });
        });
    });
  }
};
exports.SaveAndSubmitToCustomer = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.ExchangeRate == null || req.body.ExchangeRate == '' || req.body.ExchangeRate == undefined || req.body.ExchangeRate == 0) {
      Reqresponse.printResponse(res, { msg: "Exchange-rate is not available. Please contact admin!." }, null);
    } else {
      Quotes.GetAcceptVendors(new Quotes(req.body), (err, Quotedata) => {
        for (let val of req.body.QuoteItem) {
          if (Quotedata[0].PartId == val.PartId) {
            val.WarrantyPeriod = req.body.WarrantyPeriod;
            break;
          }
        }
        var RRStatusHistoryObj = new RRStatusHistory({
          authuser: req.body.authuser,
          RRId: req.body.RRId,
          HistoryStatus: Constants.CONST_RRS_QUOTE_SUBMITTED
        });
        req.body.Status = Constants.CONST_RRS_QUOTE_SUBMITTED;
        var QuoteObj = new Quotes({
          authuser: req.body.authuser,
          RRId: req.body.RRId,
          QuoteId: req.body.QuoteId,
          Status: Constants.CONST_QUOTE_STATUS_SUBMITTED,
          QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_SUBMITTED
        });

        var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;
        var NotificationObj = new NotificationModel({
          authuser: req.body.authuser,
          RRId: req.body.RRId,
          NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
          NotificationIdentityId: req.body.QuoteId,
          NotificationIdentityNo: 'QT' + req.body.QuoteId,
          ShortDesc: 'Customer Quote Submitted',
          Description: 'Customer Quote Submitted to Customer  by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
        });

        async.parallel([
          function (result) { Quotes.UpdateCustomerQuote(new Quotes(req.body), result); },
          function (result) { if (req.body.hasOwnProperty('QuoteItem')) { QuoteItem.UpdateCustomerQuoteItem(req.body, result); } },
          function (result) { Quotes.UpdateQuoteCustomerStatus(QuoteObj, result); },
          function (result) { Quotes.ChangeRRStatusNew(req.body, result); },
          function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
          function (result) { CQFollowUp.GetCustomerQuoteFollowUp(req.body, result); },
          function (result) { NotificationModel.Create(NotificationObj, result); },
          function (result) { Quotes.UpdateQuoteSubmittedDate(QuoteObj, result); },
        ],
          function (err, results) {
            if (err) {
              Reqresponse.printResponse(res, err, null);
            }
            Quotes.UpdateQuotesStatus(QuoteObj, (err, data) => { });
            Reqresponse.printResponse(res, null, results[5][0]);
          });
      });
    }

  } else {
    Reqresponse.printResponse(res, { msg: "RR not found" }, null);

  }
};

exports.AutoCreate = (req, res) => {
  Quotes.GetAcceptVendors(new Quotes(req.body), (err, Quotedata) => {
    CountryModel.findById(Quotedata[0].CustomerLocation, (errCM, resultCM) => {
      var exRateU = 1;
      if (Quotedata.length > 0) {
        // console.log(Quotedata[0]);
        if (Quotedata[0].exExchangeRate == null || Quotedata[0].exExchangeRate == '' || Quotedata[0].exExchangeRate == undefined || Quotedata[0].exExchangeRate == 0) {
          Reqresponse.printResponse(res, { msg: "Exchange-rate is not available. Please contact admin!." }, null);
        } else {

          if (Quotedata[0].CustomerCurrencyCode != Quotedata[0].LocalCurrencyCode) {
            exRateU = Quotedata[0].exExchangeRate ? Quotedata[0].exExchangeRate : 1;
          }
          // var TaxPercent = 0;
          // var TotalTax = ((Quotedata[0].SubTotal * TaxPercent) / 100);
          var TotalTax = ((parseFloat(Quotedata[0].SubTotal) * parseFloat(Quotedata[0].TaxPercent)) / 100);
          const Quotes1 = new Quotes({
            authuser: req.body.authuser,
            QuoteNo: '',
            VendorId: Quotedata[0].VendorId,
            RRVendorId: req.body.RRVendorId,
            CustomerBillToId: req.body.CustomerBillToId ? req.body.CustomerBillToId : 0,
            CustomerShipToId: req.body.CustomerShipToId ? req.body.CustomerShipToId : 0,
            QuoteType: Constants.CONST_QUOTE_TYPE_REPAIR,
            RRId: req.body.RRId,
            RRNo: Quotedata[0].RRNo,
            IdentityType: Constants.CONST_IDENTITY_TYPE_CUSTOMER,
            IdentityId: Quotedata[0].CustomerId,
            Description: '',
            QuoteDate: cDateTime.getDate(),
            CompanyName: Quotedata[0].CompanyName,
            FirstName: Quotedata[0].FirstName,
            LastName: Quotedata[0].LastName,
            Email: Quotedata[0].Email,
            TaxType: Quotedata[0].TaxType,
            TermsId: Quotedata[0].TermsId,
            Notes: Quotedata[0].Notes,
            AddressId: '0',
            TotalValue: roundTo(Quotedata[0].SubTotal, 2),
            ProcessFee: Quotedata[0].AdditionalCharge,
            TaxPercent: Quotedata[0].TaxPercent,
            TotalTax: TotalTax,
            Discount: Quotedata[0].Discount,
            ShippingFee: Quotedata[0].Shipping,
            Shipping: Quotedata[0].Shipping,
            // GrandTotal: roundTo((((Quotedata[0].SubTotal + Quotedata[0].AdditionalCharge + TotalTax + Quotedata[0].Shipping) - Quotedata[0].Discount) * exRateU), 2),

            LocalCurrencyCode: Quotedata[0].CustomerCurrencyCode,
            ExchangeRate: Quotedata[0].ExchangeRate,
            BaseCurrencyCode: Quotedata[0].BaseCurrencyCode,
            // BaseGrandTotal: roundTo((((Quotedata[0].SubTotal + Quotedata[0].AdditionalCharge + TotalTax + Quotedata[0].Shipping) - Quotedata[0].Discount) * Quotedata[0].ExchangeRate), 2),

            GrandTotal: roundTo((((parseFloat(Quotedata[0].SubTotal) + parseFloat(Quotedata[0].AdditionalCharge) + parseFloat(TotalTax) + parseFloat(Quotedata[0].Shipping)) - parseFloat(Quotedata[0].Discount)) * parseFloat(exRateU)), 2),

            BaseGrandTotal: roundTo((((parseFloat(Quotedata[0].SubTotal) + parseFloat(Quotedata[0].AdditionalCharge) + parseFloat(TotalTax) + parseFloat(Quotedata[0].Shipping)) - parseFloat(Quotedata[0].Discount)) * parseFloat(Quotedata[0].ExchangeRate)), 2),

            Status: Constants.CONST_QUOTE_STATUS_DRAFT,
            QuoteId: 0,
            RouteCause: Quotedata[0].RouteCause,
            LeadTime: Quotedata[0].LeadTime,
            WarrantyPeriod: Quotedata[0].WarrantyPeriod,
            SubTotal: roundTo(Quotedata[0].SubTotal, 2),
            AdditionalCharge: Quotedata[0].AdditionalCharge,
          });
          RRVendorParts.ViewVendorParts1(req.body.RRId, Quotedata[0].RRVendorId, (err, data1) => {
            if (err) {
              Reqresponse.printResponse(res, { msg: "RR Not Found" }, null);
            }

            if (data1.length > 0) {

              Quotes.CreateQuotes(new Quotes(Quotes1), (err, data) => {
                if (err) return result(err, null);
                Quotes1.QuoteId = data.id;
                Quotedata[0].QuoteId = data.id;


                //To add a quote to notification table
                 var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;
                var NotificationObj = new NotificationModel({
                  authuser: req.body.authuser,
                  RRId: req.body.RRId,
                  NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
                  NotificationIdentityId: data.id,
                  NotificationIdentityNo: 'QT' + data.id,
                  ShortDesc: 'Customer Quote Created',
                  Description: 'Customer Quote Created by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
                });
                for (let val of data1) {
                  if (Quotedata[0].PartId == val.PartId) {
                    val.WarrantyPeriod = Quotedata[0].WarrantyPeriod;
                    break;
                  }
                }

                for (let val of data1) {
                  val.exExchangeValue = exRateU;
                  val.ItemLocalCurrencyCode = Quotedata[0].CustomerCurrencyCode;
                  val.CustomerLocation = Quotedata[0].CustomerLocation;
                  val.ItemTaxPercent = resultCM.VatTaxPercentage ? resultCM.VatTaxPercentage : 0;
                }
                //console.log("~~~~~~~~~~~~~~~~~~~~~ Auto");
                //console.log(data1);
                async.parallel([
                  function (result) { Quotes.UpdateQuotesCodeByQuoteId(Quotes1, result); },
                  function (result) { QuoteItem.AutoCreateQuoteItem(req.body,data.id, data1, result) },
                  function (result) { VendorQuote.CreateVendorQuote(Quotedata[0], result); },
                  function (result) { NotificationModel.Create(NotificationObj, result); }
                ],
                  function (err, results) {

                    if (err)
                      Reqresponse.printResponse(res, err, data);
                    var res = results[2];
                    if (results[1].SumOfPrice != "") {
                      Quotes1.TotalValue = results[1].SumOfPrice;
                      Quotes1.BaseGrandTotal = results[1].sumOfBaseFinalPrice;
                      //console.log("Inside Quotes1");
                      // console.log(Quotes1);
                      Quotes.UpdateSumOfValue(Quotes1, (err, data2) => {
                      });

                      var res = results[2];
                      var VendorQuoteId = res.id;
                      RRVendorParts.ViewVendorParts1(req.body.RRId, Quotedata[0].RRVendorId, (errID, CreateVendorQuoteItemData) => {
                        // console.log("CreateVendorQuoteItemData")
                        // console.log(CreateVendorQuoteItemData)
                        for (let CreateVendorQuoteItemDataVal of CreateVendorQuoteItemData) {
                          if (Quotedata[0].PartId == CreateVendorQuoteItemDataVal.PartId) {
                            CreateVendorQuoteItemDataVal.WarrantyPeriod = Quotedata[0].WarrantyPeriod;
                            break;
                          }
                        }
                        // console.log("CreateVendorQuoteItemData1")
                        // console.log(CreateVendorQuoteItemData)
                        async.parallel([

                          function (result) { VendorQuoteItem.CreateVendorQuoteItem(VendorQuoteId, data.id, CreateVendorQuoteItemData, result); },
                        ],
                          function (err, results) {
                            if (err)
                              Reqresponse.printResponse(res, err, null);
                          });
                      });
                      // async.parallel([
                      //   function (result) { VendorQuoteItem.CreateVendorQuoteItem(VendorQuoteId, data.id, data1, result); },
                      // ],
                      //   function (err, results) {
                      //     if (err)
                      //       Reqresponse.printResponse(res, err, null);
                      //   });

                    }
                    else {
                      Reqresponse.printResponse(res, { msg: "Quotes not found" }, null);
                    }


                  }
                );
                Reqresponse.printResponse(res, err, data);

              });
            }
            else {
              Reqresponse.printResponse(res, { msg: "No VendorParts for RRId=" + req.body.RRId }, null);
            }
          });
        }
      }
      else {
        Reqresponse.printResponse(res, { msg: "Accept the vendor quote before generating the customer quote " }, null);
      }
    });
  });

};

// exports.deleteQuoteItem = (req, res) => {
//   if(req.body.hasOwnProperty('QuoteItemId')) {
//     QuoteItem.deleteQuoteItem(new QuoteItem(req.body),(err, data) => {      
//       Reqresponse.printResponse(res,err,data);
//     });     
//   }else {
//     Reqresponse.printResponse(res, {msg:"Quote Item Id is required"},null);   
//   }
// }; 

//Delete QuoteItem
// exports.DeleteQuoteItem = (req, res) => {
//   if (req.body.hasOwnProperty('QuoteItemId')) {
//     if (req.body.QuoteItemId != "") {
//       async.parallel([
//         function (result) { QuoteItem.DeleteQuoteItem(req.body.QuoteItemId, result); },
//         function (result) { QuoteItem.SelectNewCalculationAfterQuoteItemDelete(req.body.QuoteItemId, result); },
//       ],
//         function (err, results) {
//           if (err) {
//             Reqresponse.printResponse(res, err, null);
//           }
//           results[1].res[0].TaxPercent = req.body.TaxPercent >= 0 ? req.body.TaxPercent : 0;
//           Quotes.UpdateAfterQuoteItemDeleteByQuoteId({ res: results[1] }, (err, data) => {
//           });
//           Reqresponse.printResponse(res, null, { ress: results[1] });
//         });
//     }
//     else {
//       Reqresponse.printResponse(res, { msg: "QuoteItem Id is required" }, null);
//     }
//   }
// };
// To Delete DeleteQuoteItem

/*exports.DeleteQuoteItem = (req, res) => {
  if (req.body.hasOwnProperty('QuoteItemId')) {
    if (req.body.QuoteItemId != "") {
      async.parallel([
        function (result) { QuoteItem.DeleteQuoteItem(req.body.QuoteItemId, result); },
        function (result) {
          if (req.body.hasOwnProperty('TaxPercent') && req.body.TaxPercent > 0) {
            con.query(Quotes.UpdateTaxPercent(req.body.TaxPercent, req.body.QuoteId), result)
          }
          else {
            RRModel.emptyFunction(req.body, result);
          }
        },
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }

          QuoteItem.SelectNewCalculationAfterQuoteItemDelete(req.body.QuoteId, req.body.QuoteItemId, (err, Rdata) => {
            if (err) {
              Reqresponse.printResponse(res, err, null);
            }
            if (Rdata.res[0]) {
              Quotes.UpdateAfterQuoteItemDeleteByQuoteId(Rdata.res[0], (err, data) => {
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
      Reqresponse.printResponse(res, { msg: "QuoteItem Id is required" }, null);
    }
  }
};*/


exports.DeleteQuoteItem = (req, res) => {
  if (req.body.hasOwnProperty('QuoteItemId')) {
    if (req.body.QuoteItemId != "") {
      async.parallel([
        function (result) { QuoteItem.DeleteQuoteItem(req.body.QuoteItemId, result); }
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }

          QuoteItem.SelectNewCalculationAfterQuoteItemDelete(req.body.QuoteItemId, (err, Rdata) => {
            if (err) {
              Reqresponse.printResponse(res, err, null);
            }
            if (Rdata.res[0]) {
              Quotes.UpdateAfterQuoteItemDeleteByQuoteId(Rdata.res[0], (err, data) => {
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
      Reqresponse.printResponse(res, { msg: "QuoteItem Id is required" }, null);
    }
  }
};



// Get server side list
exports.getQuoteListByServerSide = (req, res) => {
  Quotes.getQuoteListByServerSide(new Quotes(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


exports.submitQuoteToCustomer = (req, res) => {
  Quotes.submitQuoteToCustomer(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};



exports.approveCustomerQuote = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    //RRModel.IsExistCustomerPONo(req.body, (err, data) => {
    //
    // if (data.length <= 0) {
    req.body.Status = Constants.CONST_RRS_IN_PROGRESS;
    req.body.QuoteCustomerStatus = Constants.CONST_CUSTOMER_QUOTE_ACCEPTED;
    var QuoteObj = new Quotes({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      QuoteId: req.body.QuoteId,
      Status: Constants.CONST_QUOTE_STATUS_APPROVED,
      QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_ACCEPTED
    });
    var QuoteObjQuoted = new Quotes({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      QuoteId: req.body.QuoteId,
      Status: Constants.CONST_QUOTE_STATUS_QUOTED
    });

    var RRStatusHistoryObj = new RRStatusHistory({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      HistoryStatus: Constants.CONST_RRS_IN_PROGRESS
    });

     var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;

    //To add a quote to notification table
    var NotificationObj = new NotificationModel({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
      NotificationIdentityId: req.body.QuoteId,
      NotificationIdentityNo: 'QT' + req.body.QuoteId,
      ShortDesc: 'Customer Quote Approved',
      Description: 'Customer Quote Approved by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
    });

    var NotificationObjForCustomerPO = new NotificationModel({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
      NotificationIdentityId: req.body.RRId,
      NotificationIdentityNo: 'CustomerPO' + req.body.RRId,
      ShortDesc: 'Customer PO Received',
      Description: 'Customer PO updated by  Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
    });

    var NotificationObjForInProgress = new NotificationModel({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
      NotificationIdentityId: req.body.RRId,
      NotificationIdentityNo: 'RR' + req.body.RRId,
      ShortDesc: 'Repair In Progress',
      Description: 'Repair In Progress by  Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
    });

    RRModel.CheckCustomerPONoExistForRRId(req.body, (err, data) => {
      var Exist = 0;
      if (data.length > 0) {
        Exist = 1;
      }
      // RRModel.CheckQuoteExistForRRId(QuoteObj, (err, data) => {
      // if (data.length <= 0) {
      async.parallel([
        function (result) {
          if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {
            CustomerBlanketPOModel.GetCurrentBalance(req.body.CustomerBlanketPOId, result);
          }
          else { RRModel.emptyFunction(req.body, result); }
        },
        function (result) { SalesOrder.IsExistCustomerBlanketPOIdForRRId(req.body.RRId, result); },
        function (result) { Invoice.IsExistCustomerBlanketPOIdForRRId(req.body.RRId, result); },
        function (result) { Quotes.UpdateQuotesStatus(QuoteObj, result); },
        function (result) { Quotes.UpdateQuotesStatusToQuoted(QuoteObjQuoted, result); },
        function (result) { Quotes.ChangeRRStatusWithPo(req.body, result); },
        function (result) { NotificationModel.Create(NotificationObj, result); },
        function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
        function (result) {
          if (Exist == 0) { NotificationModel.Create(NotificationObjForCustomerPO, result); }
          else { RRModel.emptyFunction(NotificationObjForCustomerPO, result); }
        },
        function (result) { NotificationModel.Create(NotificationObjForInProgress, result); },
        function (result) { Quotes.UpdateQuoteApprovedDate(QuoteObjQuoted, result); },
        function (result) { Quotes.LockShipAddress(req.body, result); },

        // function (result) {
        //   if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {
        //     CustomerBlanketPOModel.UpdateCurrentBalance(new CustomerBlanketPOModel(req.body), req.body.QuoteAmount, result);
        //   }
        //   else { RRModel.emptyFunction(req.body, result); }
        // },
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          else {
            req.body.CurrentBalance = results[0].length > 0 ? results[0][0].CurrentBalance : 0;
            req.body.SOId = results[1].length > 0 ? results[1][0].SOId : 0;
            req.body.InvoiceId = results[2].length > 0 ? results[2][0].InvoiceId : 0;
            var boolean = true;
            if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {
              boolean = parseFloat(req.body.QuoteAmount) <= parseFloat(req.body.CurrentBalance) ? true : false;
              if (boolean) {
                var DebitHistoryObjCreate = new CustomerBlanketPOHistoryModel({
                  authuser: req.body.authuser,
                  BlanketPOId: req.body.CustomerBlanketPOId,
                  RRId: req.body.RRId,
                  MROId: 0,
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
                  function (result) { CustomerBlanketPOModel.UpdateCurrentBalance(req.body.CustomerBlanketPOId, req.body.QuoteAmount, result); },
                  function (result) { CustomerBlanketPOHistoryModel.Create(DebitHistoryObjCreate, result); },
                  function (result) { Quotes.UpdateCustomerBlanketPOIdToRR(req.body, result); },
                  function (result) {
                    if (req.body.SOId > 0) { SalesOrder.UpdateCustomerBlanketPOIdToSO(new SalesOrder(req.body), result); }
                    else { RRModel.emptyFunction(req.body, result); }
                  },
                  function (result) {
                    if (req.body.InvoiceId > 0) { Invoice.UpdateCustomerBlanketPOIdToInvoice(new Invoice(req.body), result); }
                    else { RRModel.emptyFunction(req.body, result); }
                  },
                ],
                  function (err, results) {
                    if (err) {
                      Reqresponse.printResponse(res, err, null);
                    }
                  });
              }
            }
            if (boolean != true)
              Reqresponse.printResponse(res, { msg: "Can't Approve due to insufficient balance" }, null);
            else
              Reqresponse.printResponse(res, null, req.body);
          }
        });
      // }
      // });
    })
    // } else { Reqresponse.printResponse(res, { msg: "CustomerPONo Already Exist" }, null); }
    // });
  }
  else {
    Reqresponse.printResponse(res, { msg: "RR not found" }, null);
  }
};

exports.UpdateCustomerPONoInRR = (req, res) => {

  async.parallel([
    function (result) { CustomerBlanketPOModel.GetCustomerBlanketPOIdFromRR(req.body.RRId, result); },
    function (result) {
      if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {
        CustomerBlanketPOModel.GetCurrentBalance(req.body.CustomerBlanketPOId, result);
      }
      else { con.query(RRModel.UpdateCustomerPOQuery(req.body), result); }
    },
    function (result) { SalesOrder.IsExistCustomerBlanketPOIdForRRId(req.body.RRId, result); },
    function (result) { Invoice.IsExistCustomerBlanketPOIdForRRId(req.body.RRId, result); },
  ],
    function (err, results) {
      if (err)
        Reqresponse.printResponse(res, err, null);
      else {
        var _CustomerBlanketPOId = results[0].length > 0 ? results[0][0].CustomerBlanketPOId : 0;
        req.body.CurrentBalance = results[1].length > 0 ? results[1][0].CurrentBalance : 0;
        req.body.SOId = results[2].length > 0 ? results[2][0].SOId : 0;
        req.body.InvoiceId = results[3].length > 0 ? results[3][0].InvoiceId : 0;
        var boolean = true;
        if (req.body.hasOwnProperty('CustomerBlanketPOId') && req.body.CustomerBlanketPOId > 0) {

          if (req.body.CustomerBlanketPOId > 0 && _CustomerBlanketPOId > 0 && req.body.CustomerBlanketPOId == _CustomerBlanketPOId) {
            console.log("No Action");
          }
          else if (req.body.CustomerBlanketPOId > 0 && _CustomerBlanketPOId > 0 && req.body.CustomerBlanketPOId != _CustomerBlanketPOId && req.body.CurrentBalance > 0) {
            // if (req.body.BlanketPOLowerLimit > 0) {
            //   boolean = (parseFloat(req.body.CurrentBalance) - parseFloat(req.body.QuoteAmount)) >= (parseFloat(req.body.CurrentBalance) * parseFloat(req.body.BlanketPOLowerLimit) / 100) ? true : false;
            // }
            boolean = parseFloat(req.body.QuoteAmount) <= parseFloat(req.body.CurrentBalance) ? true : false;
            if (boolean) {
              CustomerBlanketPOModel.GetCurrentBalance(_CustomerBlanketPOId, (err, data) => {
                if (err) {
                  Reqresponse.printResponse(res, err, null);
                }
                if (data.length > 0) {
                  var RefundHistoryObj = new CustomerBlanketPOHistoryModel({
                    authuser: req.body.authuser,
                    BlanketPOId: _CustomerBlanketPOId,
                    RRId: req.body.RRId,
                    MROId: 0,
                    PaymentType: 1,
                    Amount: parseFloat(req.body.QuoteAmount),
                    CurrentBalance: parseFloat(data[0].CurrentBalance) + parseFloat(req.body.QuoteAmount),
                    QuoteId: req.body.QuoteId,
                    Comments: req.body.Comments,
                    LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                    ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                    BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                    BaseAmount: parseFloat(req.body.QuoteAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                    BaseCurrentBalance: (parseFloat(data[0].CurrentBalance) + parseFloat(req.body.QuoteAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
                  });

                  var DebitHistoryObj = new CustomerBlanketPOHistoryModel({
                    authuser: req.body.authuser,
                    BlanketPOId: req.body.CustomerBlanketPOId,
                    RRId: req.body.RRId,
                    MROId: 0,
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
                    function (result) { CustomerBlanketPOHistoryModel.Create(RefundHistoryObj, result); },
                    function (result) { CustomerBlanketPOModel.Refund(_CustomerBlanketPOId, req.body.QuoteAmount, result); },
                    function (result) { CustomerBlanketPOModel.UpdateCurrentBalance(req.body.CustomerBlanketPOId, req.body.QuoteAmount, result); },
                    function (result) { RRModel.UpdateCustomerBlanketPOIdToRR(req.body.CustomerBlanketPOId, req.body.CustomerPONo, req.body.RRId, result); },
                    function (result) { CustomerBlanketPOHistoryModel.Create(DebitHistoryObj, result); },
                    function (result) {
                      if (req.body.SOId > 0) { SalesOrder.UpdateCustomerBlanketPOIdToSO(new SalesOrder(req.body), result); }
                      else { RRModel.emptyFunction(req.body, result); }
                    },
                    function (result) {
                      if (req.body.InvoiceId > 0) { Invoice.UpdateCustomerBlanketPOIdToInvoice(new Invoice(req.body), result); }
                      else { RRModel.emptyFunction(req.body, result); }
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
            boolean = parseFloat(req.body.QuoteAmount) <= parseFloat(req.body.CurrentBalance) ? true : false;
            if (boolean) {
              var DebitHistoryObjCreate = new CustomerBlanketPOHistoryModel({
                authuser: req.body.authuser,
                BlanketPOId: req.body.CustomerBlanketPOId,
                RRId: req.body.RRId,
                MROId: 0,
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
                function (result) { CustomerBlanketPOModel.UpdateCurrentBalance(req.body.CustomerBlanketPOId, req.body.QuoteAmount, result); },
                function (result) { CustomerBlanketPOHistoryModel.Create(DebitHistoryObjCreate, result); },
                function (result) { RRModel.UpdateCustomerBlanketPOIdToRR(req.body.CustomerBlanketPOId, req.body.CustomerPONo, req.body.RRId, result); },
                function (result) {
                  if (req.body.SOId > 0) { SalesOrder.UpdateCustomerBlanketPOIdToSO(new SalesOrder(req.body), result); }
                  else { RRModel.emptyFunction(req.body, result); }
                },
                function (result) {
                  if (req.body.InvoiceId > 0) { Invoice.UpdateCustomerBlanketPOIdToInvoice(new Invoice(req.body), result); }
                  else { RRModel.emptyFunction(req.body, result); }
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
        else if (req.body.hasOwnProperty('CustomerBlanketPOId') == false && _CustomerBlanketPOId > 0) {
          CustomerBlanketPOModel.GetCurrentBalance(_CustomerBlanketPOId, (err, data) => {
            if (err) {
              Reqresponse.printResponse(res, err, null);
            }
            if (data.length > 0) {
              var RefundHistoryObj = new CustomerBlanketPOHistoryModel({
                authuser: req.body.authuser,
                BlanketPOId: _CustomerBlanketPOId,
                RRId: req.body.RRId,
                MROId: 0,
                authuser: req.body.authuser,
                PaymentType: 1,
                Amount: parseFloat(req.body.QuoteAmount),
                CurrentBalance: parseFloat(data[0].CurrentBalance) + parseFloat(req.body.QuoteAmount),
                QuoteId: req.body.QuoteId,
                Comments: req.body.Comments,
                LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                BaseAmount: parseFloat(req.body.QuoteAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                BaseCurrentBalance: (parseFloat(data[0].CurrentBalance) + parseFloat(req.body.QuoteAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
              });
              req.body.CustomerBlanketPOId = 0;
              async.parallel([
                function (result) { CustomerBlanketPOHistoryModel.Create(RefundHistoryObj, result); },
                function (result) { CustomerBlanketPOModel.Refund(_CustomerBlanketPOId, req.body.QuoteAmount, result); },
                function (result) { RRModel.UpdateCustomerBlanketPOIdToRR(req.body.CustomerBlanketPOId, req.body.CustomerPONo, req.body.RRId, result); },
                function (result) {
                  if (req.body.SOId > 0) { SalesOrder.UpdateCustomerBlanketPOIdToSO(new SalesOrder(req.body), result); }
                  else { RRModel.emptyFunction(req.body, result); }
                },
                function (result) {
                  if (req.body.InvoiceId > 0) { Invoice.UpdateCustomerBlanketPOIdToInvoice(new Invoice(req.body), result); }
                  else { RRModel.emptyFunction(req.body, result); }
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
        else { }
        if (boolean != true)
          Reqresponse.printResponse(res, { msg: "Can't Approve due to insufficient balance" }, null);
        else
          Reqresponse.printResponse(res, null, req.body);
      }
    });
};


exports.rejectCustomerQuote = (req, res) => {
  Quotes.rejectCustomerQuote(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


exports.findOne = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    Quotes.findById(req.body.QuoteId, req.body.IsDeleted, req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

// exports.GetEmailContentForQuote = (req, res) => { 
//   if(req.body.hasOwnProperty('QuoteId')) {
//      Quotes.GetEmailContentForQuote(req.body, (err, data) => {
//       Reqresponse.printResponse(res, err,data);  
//     });
//   }else {
//     Reqresponse.printResponse(res,{msg:"Quote Id is required"},null);  
//    } 
// }; 

exports.SendEmailToCustomerQuoteByQuoteList = (req, res) => {
  Quotes.SendEmailToCustomerQuoteByQuteId(req.body.QuoteList, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// exports.SendQuoteEmail = (req, res) => {  
//   SendEmail.SendEmailTo(req.body, (err, data) => {
//     Reqresponse.printResponse(res, err,data);  
//   });  
// }; 

//To delete Quote
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('QuoteId')) {
    Quotes.remove(req.body.QuoteId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Quote Id is required" }, null);
  }
};

//To Get Export To Excel Data
exports.ExportToExcel = (req, res) => {
  Quotes.ExportToExcel(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


exports.ViewMultipleQuotesId = (req, res) => {
  var ArQuoteList = [];
  // console.log(req.body.QuoteList);
  for (let val of req.body.QuoteList) {
    var temparray = [];
    Quotes.ViewMultipleQuotesId(val, req.body, (err, data) => {
      //console.log("Test "+data);
      //var temparray = [];       
      temparray.push(data);
      //ArQuoteList.push(val);     
      //console.log(ArQuoteList);
      //Reqresponse.printResponse(res,{res:data},null);  
      //console.log(data[0]);
      //console.log(temparray);
    });
    // console.log(temparray.length);
    ArQuoteList.push(temparray);
    // console.log(ArQuoteList[0].length);
    //console.log(res.ArQuoteList[0]);
    // var temparray = []; 
    //   temparray.push(val);
    //   ArQuoteList.push(temparray);

    // Quotes.ViewMultipleQuotesId(req.body.QuoteList, (err, data) => {
    //   Reqresponse.printResponse(res, err,data);  
    // });  
  }

  Reqresponse.printResponse(res, ArQuoteList);
};


exports.ViewMultipleQuotesId1 = (req, res) => {

  Quotes.ViewMultipleQuotesId1(req.body.QuoteList, req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};








//Below methods are for MRO Section :
exports.SubmitMROQuoteToCustomer = (req, res) => {
  Quotes.SubmitMROQuoteToCustomer(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.UpdateMROCustomerQuote = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    //  Quotes.GetAcceptMROVendors(new Quotes(req.body), (err, Quotedata) => {
    for (let val of req.body.QuoteItem) {
      // if (Quotedata[0].PartId == val.PartId) {
      val.WarrantyPeriod = req.body.WarrantyPeriod;
      break;
      // }
    }
    async.parallel([
      function (result) { Quotes.UpdateCustomerQuote(new Quotes(req.body), result); },
      function (result) { if (req.body.hasOwnProperty('QuoteItem')) { QuoteItem.UpdateCustomerQuoteItem(req.body, result); } }
    ],
      function (err, results) {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        }
        Reqresponse.printResponse(res, err, { data: results[0] });
      });
    // });
  }
};

exports.UpdateMROSingleCustomerQuoteItem = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    req.body.ProcessFee = req.body.AdditionalCharge;
    var QuoteItemList = [];
    var Obj = new QuoteItem(req.body);
    QuoteItemList.push(Obj);
    req.body.QuoteItem = QuoteItemList;
    async.parallel([
      function (result) { Quotes.UpdateCustomerQuote(new Quotes(req.body), result); },
      function (result) { QuoteItem.UpdateCustomerQuoteItem(req.body, result); }
    ],
      function (err, results) {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        }
        Reqresponse.printResponse(res, err, { data: results[0] });
      });
  }
};
exports.findByMROId = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    Quotes.findByMROId(req.body.QuoteId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
exports.ViewSingleCustomerQuoteItem = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    Quotes.ViewSingleCustomerQuoteItem(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
exports.SaveAndCreateMROCustomerQuote = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    req.body.RRVendorId = req.body.VendorsList.RRVendorId;

    RRVendorsModel.AcceptMROVendor(req.body, (err, data) => {

      if (data.id) {
        MROVendorModel.UpdateMROVendors(req.body, (err, data) => {
          for (let val of req.body.VendorPartsList) {
            if (!req.body.hasOwnProperty('RRVendorPartsId') && val.RRVendorPartsId != "" && val.RRVendorPartsId != null) {
              RRVendorParts.UpdateRRVendorPartsBySingleRecords(val, (err, data) => {
              });
            }
            else {
              val.MROId = req.body.MROId;
              val.RRVendorId = req.body.VendorsList.RRVendorId;
              val.VendorId = req.body.VendorsList.RRVendorId;
              val.authuser = req.body.authuser;
              RRVendorParts.CreateRRVendorParts(new RRVendorParts(val), (err, data) => {
              });
            }
          }
          //To Quote AutoCreate
          Quotes.GetAcceptMROVendors(new Quotes(req.body), (err, Quotedata) => {
            if (Quotedata.length > 0) {
              var TotalTax = ((Quotedata[0].SubTotal * Quotedata[0].TaxPercent) / 100);
              const Quotes1 = new Quotes({
                authuser: req.body.authuser,
                QuoteNo: '',
                VendorId: Quotedata[0].VendorId,
                RRVendorId: req.body.RRVendorId,
                CustomerBillToId: req.body.CustomerBillToId ? req.body.CustomerBillToId : 0,
                CustomerShipToId: req.body.CustomerShipToId ? req.body.CustomerShipToId : 0,
                QuoteType: Constants.CONST_QUOTE_TYPE_MRO,
                MROId: req.body.MROId,
                RRId: 0,
                RRNo: '',
                IdentityType: Constants.CONST_IDENTITY_TYPE_CUSTOMER,
                IdentityId: Quotedata[0].CustomerId,
                Description: '',
                QuoteDate: cDateTime.getDate(),
                CompanyName: Quotedata[0].CompanyName,
                FirstName: Quotedata[0].FirstName,
                LastName: Quotedata[0].LastName,
                Email: Quotedata[0].Email,
                TaxType: Quotedata[0].TaxType,
                TermsId: Quotedata[0].TermsId,
                Notes: Quotedata[0].Notes,
                AddressId: '0',
                TotalValue: Quotedata[0].SubTotal,
                ProcessFee: Quotedata[0].AdditionalCharge,
                TaxPercent: Quotedata[0].TaxPercent,
                TotalTax: TotalTax,
                Discount: Quotedata[0].Discount,
                ShippingFee: Quotedata[0].Shipping,
                Shipping: Quotedata[0].Shipping,
                GrandTotal: ((Quotedata[0].SubTotal + Quotedata[0].AdditionalCharge + TotalTax + Quotedata[0].Shipping) - Quotedata[0].Discount),
                LocalCurrencyCode: Quotedata[0].LocalCurrencyCode,
                ExchangeRate: Quotedata[0].ExchangeRate,
                BaseCurrencyCode: Quotedata[0].BaseCurrencyCode,
                BaseGrandTotal: ((Quotedata[0].SubTotal + Quotedata[0].AdditionalCharge + TotalTax + Quotedata[0].Shipping) - Quotedata[0].Discount) * Quotedata[0].ExchangeRate,

                Status: Constants.CONST_QUOTE_STATUS_DRAFT,
                QuoteId: 0,
                RouteCause: Quotedata[0].RouteCause,
                LeadTime: Quotedata[0].LeadTime,
                WarrantyPeriod: Quotedata[0].WarrantyPeriod,
                SubTotal: Quotedata[0].SubTotal,
                AdditionalCharge: Quotedata[0].AdditionalCharge,
              });
              MROVendorPartModel.ViewVendorParts1(req.body.MROId, Quotedata[0].RRVendorId, (err, data1) => {
                if (err) {
                  Reqresponse.printResponse(res, { msg: "MRO Not Found" }, null);
                }
                if (data1.length > 0) {

                  Quotes.CreateQuotes(new Quotes(Quotes1), (err, data) => {
                    if (err) Reqresponse.printResponse(res, err, null);
                    var UpdateMROCustomerBillShipQuery = MROModel.UpdateMROCustomerBillShipQuery(req.body);
                    Quotes1.QuoteId = data.id;
                     
                    for (let val of data1) {
                      if (Quotedata[0].PartId == val.PartId) {
                        val.WarrantyPeriod = Quotedata[0].WarrantyPeriod;
                        break;
                      }
                    }

                    async.parallel([
                      function (result) { Quotes.UpdateQuotesCodeByQuoteId(Quotes1, result); },
                      function (result) { QuoteItem.AutoCreateQuoteItem(req.body,data.id, data1, result) },
                      function (result) { VendorQuote.CreateVendorQuote(Quotes1, result); },
                      function (result) { con.query(UpdateMROCustomerBillShipQuery, result) },
                      //  function (result) { NotificationModel.Create(NotificationObj, result); }
                    ],
                      function (errp, results) {
                        if (errp) {
                          Reqresponse.printResponse(res, errp, null);
                        }
                        var resQuote = results[2];
                        if (results[1].SumOfPrice != "") {
                          Quotes1.TotalValue = results[1].SumOfPrice;
                          Quotes1.BaseGrandTotal = results[1].sumOfBaseFinalPrice ? results[1].sumOfBaseFinalPrice : 0;
                          Quotes.UpdateSumOfValue(Quotes1, (errp, data2) => {
                          });

                          var resQuote = results[2];
                          var VendorQuoteId = resQuote.id;
                          async.parallel([
                            function (result) { VendorQuoteItem.CreateVendorQuoteItem(VendorQuoteId, data.id, data1, result); },
                          ],
                            function (errvendor, results) {
                              if (errvendor) {
                                Reqresponse.printResponse(res, errvendor, null);
                              }
                              Reqresponse.printResponse(res, null, data);
                            });
                        } else {
                          Reqresponse.printResponse(res, { msg: "Quotes not found" }, null);
                        }
                      });
                  });
                }
                else {
                  Reqresponse.printResponse(res, { msg: "No VendorParts for MROId=" + req.body.MROId }, null);
                }
              });
            }
            else {
              Reqresponse.printResponse(res, { msg: "Accept the vendor quote before generating the customer quote " }, null);
            }
          });
        });
      }
      else {
        Reqresponse.printResponse(res, { msg: "RRVendorId Not Found" }, null);
      }
    });
  }
};
exports.ApproveMROCustomerQuote = (req, res) => {
  if (req.body.hasOwnProperty('MROId') && req.body.MROId > 0) {
    //RRModel.IsExistCustomerPONo(req.body, (err, data) => {

    // if (data.length <= 0) {
    req.body.Status = Constants.CONST_MROS_MRO_IN_PROGRESS;
    req.body.QuoteCustomerStatus = Constants.CONST_CUSTOMER_QUOTE_ACCEPTED;
    var QuoteObj = new Quotes({
      authuser: req.body.authuser,
      MROId: req.body.MROId,
      QuoteId: req.body.QuoteId,
      Status: Constants.CONST_QUOTE_STATUS_APPROVED,
      QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_ACCEPTED
    });
    var QuoteObjQuoted = new Quotes({
      authuser: req.body.authuser,
      MROId: req.body.MROId,
      QuoteId: req.body.QuoteId,
      Status: Constants.CONST_QUOTE_STATUS_QUOTED
    });
     
    async.parallel([
      function (result) { Quotes.UpdateQuotesStatus(QuoteObj, result); },
      function (result) { Quotes.UpdateMROQuotesStatusToQuoted(QuoteObjQuoted, result); },
      function (result) { Quotes.ChangeMROStatusAndCustomerPONo(req.body, result); },
      // function (result) { NotificationModel.Create(NotificationObj, result); },
      // function (result) { if (Exist == 0) { NotificationModel.Create(NotificationObjForCustomerPO, result); } else { RRModel.emptyFunction(NotificationObjForCustomerPO, result); } },
      function (result) { Quotes.UpdateQuoteApprovedDate(QuoteObjQuoted, result); },
    ],
      function (err, results) {
        /*if (err)  { 
          Reqresponse.printResponse(res, err, null);  
        }*/
        Reqresponse.printResponse(res, null, { data: results[0], ...req.body });
      });
    // });
    // } else { Reqresponse.printResponse(res, { msg: "CustomerPONo Already Exist" }, null); }
    // });
  }
  else {
    Reqresponse.printResponse(res, { msg: "MRO not found" }, null);
  }
};
exports.RejectMROCustomerQuote = (req, res) => {
  Quotes.RejectMROCustomerQuote(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.viewQuoteItemUsingPartIdAndMROId = (req, res) => {
  Quotes.viewQuoteItemUsingPartIdAndMROId(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// exports.SendEmailToMROCustomerQuoteByQuoteList = (req, res) => {
//   Quotes.SendEmailToMROCustomerQuoteByQuoteList(req.body.QuoteList, (err, data) => {
//     Reqresponse.printResponse(res, err, data);
//   });
// };
//
exports.MROAutoCreate = (req, res) => {
  //
  Quotes.GetAcceptMROVendors(new Quotes(req.body), (err, Quotedata) => {
    if (Quotedata.length > 0) {
      var TotalTax = ((Quotedata[0].SubTotal * Quotedata[0].TaxPercent) / 100);
      const Quotes1 = new Quotes({
        authuser: req.body.authuser,
        QuoteNo: '',
        VendorId: Quotedata[0].VendorId,
        RRVendorId: req.body.RRVendorId,
        CustomerBillToId: req.body.CustomerBillToId ? req.body.CustomerBillToId : 0,
        CustomerShipToId: req.body.CustomerShipToId ? req.body.CustomerShipToId : 0,
        QuoteType: Constants.CONST_QUOTE_TYPE_MRO,
        MROId: req.body.MROId,
        RRId: 0,
        RRNo: '',
        IdentityType: Constants.CONST_IDENTITY_TYPE_CUSTOMER,
        IdentityId: Quotedata[0].CustomerId,
        Description: '',
        QuoteDate: cDateTime.getDate(),
        CompanyName: Quotedata[0].CompanyName,
        FirstName: Quotedata[0].FirstName,
        LastName: Quotedata[0].LastName,
        Email: Quotedata[0].Email,
        TaxType: Quotedata[0].TaxType,
        TermsId: Quotedata[0].TermsId,
        Notes: Quotedata[0].Notes,
        AddressId: '0',
        TotalValue: Quotedata[0].SubTotal,
        ProcessFee: Quotedata[0].AdditionalCharge,
        TaxPercent: Quotedata[0].TaxPercent,
        TotalTax: TotalTax,
        Discount: Quotedata[0].Discount,
        ShippingFee: Quotedata[0].Shipping,
        Shipping: Quotedata[0].Shipping,
        GrandTotal: ((Quotedata[0].SubTotal + Quotedata[0].AdditionalCharge + TotalTax + Quotedata[0].Shipping) - Quotedata[0].Discount),
        LocalCurrencyCode: Quotedata[0].LocalCurrencyCode,
        ExchangeRate: Quotedata[0].ExchangeRate,
        BaseCurrencyCode: Quotedata[0].BaseCurrencyCode,
        BaseGrandTotal: ((Quotedata[0].SubTotal + Quotedata[0].AdditionalCharge + TotalTax + Quotedata[0].Shipping) - Quotedata[0].Discount) * Quotedata[0].ExchangeRate,

        Status: Constants.CONST_QUOTE_STATUS_DRAFT,
        QuoteId: 0,
        RouteCause: Quotedata[0].RouteCause,
        LeadTime: Quotedata[0].LeadTime,
        WarrantyPeriod: Quotedata[0].WarrantyPeriod,
        SubTotal: Quotedata[0].SubTotal,
        AdditionalCharge: Quotedata[0].AdditionalCharge,
      });
      MROVendorPartModel.ViewVendorParts1(req.body.MROId, Quotedata[0].RRVendorId, (err, data1) => {
        if (err) {
          Reqresponse.printResponse(res, { msg: "MRO Not Found" }, null);
        }
        if (data1.length > 0) {

          Quotes.CreateQuotes(new Quotes(Quotes1), (err, data) => {
            if (err) Reqresponse.printResponse(res, err, null);
            var UpdateMROCustomerBillShipQuery = MROModel.UpdateMROCustomerBillShipQuery(req.body);
            Quotes1.QuoteId = data.id;
            
            for (let val of data1) {
              if (Quotedata[0].PartId == val.PartId) {
                val.WarrantyPeriod = Quotedata[0].WarrantyPeriod;
                break;
              }
            }
            async.parallel([
              function (result) { Quotes.UpdateQuotesCodeByQuoteId(Quotes1, result); },
              function (result) { QuoteItem.AutoCreateQuoteItem(req.body,data.id, data1, result) },
              function (result) { VendorQuote.CreateVendorQuote(Quotes1, result); },
              function (result) { con.query(UpdateMROCustomerBillShipQuery, result) },
              //  function (result) { NotificationModel.Create(NotificationObj, result); }
            ],
              function (errp, results) {
                if (errp) {
                  Reqresponse.printResponse(res, errp, null);
                }
                var resQuote = results[2];
                if (results[1].SumOfPrice != "") {
                  Quotes1.TotalValue = results[1].SumOfPrice;
                  Quotes1.BaseGrandTotal = results[1].sumOfBaseFinalPrice ? results[1].sumOfBaseFinalPrice : 0;
                  Quotes.UpdateSumOfValue(Quotes1, (errp, data2) => {
                  });

                  var resQuote = results[2];
                  var VendorQuoteId = resQuote.id;
                  async.parallel([
                    function (result) { VendorQuoteItem.CreateVendorQuoteItem(VendorQuoteId, data.id, data1, result); },
                  ],
                    function (errvendor, results) {
                      if (errvendor) {
                        Reqresponse.printResponse(res, errvendor, null);
                      }
                      Reqresponse.printResponse(res, null, data);
                    });
                } else {
                  Reqresponse.printResponse(res, { msg: "Quotes not found" }, null);
                }
              });
          });
        }
        else {
          Reqresponse.printResponse(res, { msg: "No VendorParts for MROId=" + req.body.MROId }, null);
        }
      });
    }
    else {
      Reqresponse.printResponse(res, { msg: "Accept the vendor quote before generating the customer quote " }, null);
    }
  });
};

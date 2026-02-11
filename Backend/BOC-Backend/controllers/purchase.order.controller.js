/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Quotes = require("../models/quotes.model.js");

const RRVendors = require("../models/repair.request.vendors.model.js");
const RRVendorParts = require("../models/repair.request.vendor.parts.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const AddressBook = require("../models/customeraddress.model.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");
const OrderAddress = require("../models/order.address.model.js");
const PurchaseOrder = require("../models/purchase.order.model.js");
const PurchaseOrderItem = require("../models/purchase.order.item.model.js");
const RR = require("../models/repair.request.model.js");
const CReferenceLabel = require("../models/cutomer.reference.labels.model.js");
const GlobalCustomerReference = require("../models/sales.order.customer.ref.model.js");
const RRNotes = require("../models/repair.request.notes.model.js");
const NotificationModel = require("../models/notification.model.js");
const customeraddress = require("../models/customeraddress.model.js");
const MROModel = require("../models/mro.model.js");
const VendorModel = require("../models/vendor.model.js");
const SOModel = require("../models/sales.order.model.js");
const SalesOrderItem = require("../models/sales.order.item.model.js");
const VendorInvoiceModel = require("../models/vendor.invoice.model.js");
const VendorInvoiceItemModel = require("../models/vendor.invoice.item.model.js");
const GeneralHistoryLog = require("../models/general.history.log.model.js");


exports.CreatePOFromNormalSO = (req, res) => {
  if (req.body.hasOwnProperty('PurchaseOrderItem') && req.body.PurchaseOrderItem.length > 0) {
    req.body.TotalTax = req.body.TotalTax ? req.body.TotalTax : 0;
    req.body.Shipping = req.body.Shipping ? req.body.Shipping : 0;
    var SOItemIdList = "";
    for (i = 0; i < req.body.PurchaseOrderItem.length; i++) {

      SOItemIdList += req.body.PurchaseOrderItem[i].SOItemId + ",";
    }
    var _SOItemIdList = SOItemIdList.slice(0, -1);

    PurchaseOrder.IsExistPOBySO(_SOItemIdList, (err, data) => {
      if (err)
        Reqresponse.printResponse(res, err, null);

      if (data.length <= 0) {
        var GetAllBySOId = SalesOrderItem.GetAllBySOId(_SOItemIdList);
        var sqlGetShippingAddressIdByVendorId = customeraddress.GetShippingAddressIdByVendorId(Constants.AH_GROUP_VENDOR_ID);
        var sqlGetBillingAddressIdByVendorId = customeraddress.GetBillingAddressIdByVendorId(Constants.AH_GROUP_VENDOR_ID);
        async.parallel([
          function (result) { con.query(GetAllBySOId, result); },
          function (result) { con.query(sqlGetShippingAddressIdByVendorId, result); },
          function (result) { con.query(sqlGetBillingAddressIdByVendorId, result); },
          function (result) { VendorModel.findById(req.body.VendorId, result); },

        ],
          function (err, results) {
            if (err)
              Reqresponse.printResponse(res, err, null);


            //console.log(results[3].BasicInfo);
            if (results[0][0].length > 0) {
              var i = 0; var SubTotal = 0; var SOItemlist = []; var count = 0; var GrandTotal = 0;
              var exrate = 1; var LCC = ''; var BCC = '';
              for (i = 0; i < results[0][0].length; i++) {
                // if (results[0][0][i].SOItemId > 0 && req.body.PurchaseOrderItem[i].SOItemId > 0 && results[0][0][i].SOItemId == req.body.PurchaseOrderItem[i].SOItemId) {
                if (results[0][0][i].SOItemId > 0 && req.body.PurchaseOrderItem[i].SOItemId > 0) {

                  var SODetail = results[0][0][i];
                  var obj = {};
                  var SingleObj = req.body.PurchaseOrderItem[i];

                  SingleObj.BaseTax = 0;
                  SingleObj.ItemTaxPercent = results[3].BasicInfo.VatTaxPercentage ? results[3].BasicInfo.VatTaxPercentage : 0;


                  exrate = SingleObj.ExchangeRate;
                  LCC = SingleObj.ItemLocalCurrencyCode ? SingleObj.ItemLocalCurrencyCode : 'USD'
                  BCC = SingleObj.ItemBaseCurrencyCode ? SingleObj.ItemBaseCurrencyCode : 'USD'
                  SubTotal += parseFloat(SingleObj.Rate) * parseFloat(SODetail.Quantity);
                  // console.log("SODetail SOItemId = " + SODetail.SOItemId)
                  obj.POId = 0;
                  obj.SOId = SODetail.SOId;
                  obj.SOItemId = SODetail.SOItemId;
                  obj.PartId = SODetail.PartId;
                  obj.PartNo = SODetail.PartNo;
                  obj.Description = SODetail.Description;
                  obj.LeadTime = SODetail.LeadTime;
                  obj.Quantity = SODetail.Quantity;
                  obj.WarrantyPeriod = SODetail.WarrantyPeriod;
                  obj.Rate = SingleObj.Rate;
                  obj.BaseRate = SingleObj.BaseRate ? SingleObj.BaseRate : 0;
                  var taxCalc = parseFloat((parseFloat(SingleObj.Rate) * parseFloat(SingleObj.ItemTaxPercent)) / 100);
                  obj.Tax = parseFloat(taxCalc).toFixed(2); // SODetail.Tax ? SODetail.Tax : 0;
                  obj.BaseTax = parseFloat(taxCalc * exrate).toFixed(2);
                  obj.ItemTaxPercent = SingleObj.ItemTaxPercent ? SingleObj.ItemTaxPercent : 0;
                  obj.ItemLocalCurrencyCode = SingleObj.ItemLocalCurrencyCode ? SingleObj.ItemLocalCurrencyCode : '';
                  obj.ItemExchangeRate = SingleObj.ItemExchangeRate ? SingleObj.ItemExchangeRate : 1;
                  obj.ItemBaseCurrencyCode = SingleObj.ItemBaseCurrencyCode ? SingleObj.ItemBaseCurrencyCode : '';
                  var pricePrice = (parseFloat(SingleObj.Rate) + taxCalc) * parseFloat(SODetail.Quantity);
                  obj.Price = parseFloat(pricePrice).toFixed(2);
                  obj.BasePrice = parseFloat(pricePrice * exrate).toFixed(2); // SingleObj.BasePrice ? SingleObj.BasePrice : 0;
                  GrandTotal += (parseFloat(SingleObj.Rate) + taxCalc) * parseFloat(SODetail.Quantity);
                  if (SODetail.LeadTime > 0) {
                    req.body.LeadTime = SODetail.LeadTime;
                    count = count + 1;
                    if (count >= 2) {
                      req.body.LeadTime = 0;
                    }
                  }
                  SOItemlist.push(obj);
                }
              }

              const PurchaseOrder1 = new PurchaseOrder({
                authuser: req.body.authuser,
                PONo: '',
                RRId: 0,
                RRNo: '',
                SOId: results[0][0][0].SOId,
                VendorId: req.body.VendorId,
                VendorRefNo: results[0][0][0].VendorRefNo,
                POType: Constants.CONST_PO_TYPE_REPAIR,
                TermsId: results[0][0][0].TermsId,
                DateRequested: req.body.DateRequested,
                DueDate: req.body.DueDate,
                AdditionalPONo: '',
                ShipAddressBookId: results[1][0][0].AddressId > 0 ? results[1][0][0].AddressId : 0,
                BillAddressBookId: results[2][0][0].AddressId > 0 ? results[2][0][0].AddressId : 0,
                ShipAddressIdentityType: 2,
                ShippingNotes: results[0][0][0].Notes,
                SubTotal: parseFloat(SubTotal).toFixed(2),
                TaxPercent: req.body.TaxPercent,
                TotalTax: parseFloat(req.body.TotalTax).toFixed(2),
                Discount: req.body.Discount,
                AHFees: req.body.AHFees,
                Shipping: parseFloat(req.body.Shipping).toFixed(2),
                // GrandTotal: ((SubTotal + parseFloat(req.body.AHFees) + parseFloat(req.body.TotalTax) + parseFloat(req.body.Shipping)) - parseFloat(req.body.Discount)),
                GrandTotal: parseFloat(GrandTotal).toFixed(2),
                Status: req.body.Status,
                RouteCause: results[0][0][0].RouteCause,
                LeadTime: req.body.LeadTime > 0 ? req.body.LeadTime : 0,
                WarrantyPeriod: results[0][0][0].WarrantyPeriod,
                LocalCurrencyCode: LCC, //results[0][0][0].LocalCurrencyCode ? results[0][0][0].LocalCurrencyCode : '',
                ExchangeRate: exrate, //results[0][0][0].ExchangeRate ? results[0][0][0].ExchangeRate : 1,
                BaseCurrencyCode: BCC, //results[0][0][0].BaseCurrencyCode ? results[0][0][0].BaseCurrencyCode : '',
                BaseGrandTotal: parseFloat(parseFloat(GrandTotal) * parseFloat(exrate)).toFixed(2)

              });

              PurchaseOrder.Create(PurchaseOrder1, (err, data) => {
                if (err) Reqresponse.printResponse(res, err, null);

                req.body.POId = PurchaseOrder1.POId = data.id;
                var SOPOIdQuery = SOModel.UpdateSOPOId(PurchaseOrder1.POId, req.body.SOId);
                async.parallel([
                  function (result) { PurchaseOrder.UpdatePurchaseOrderByRRId(PurchaseOrder1, result); },
                  function (result) { PurchaseOrderItem.AutoCreatePurchaseOrderItem(data.id, SOItemlist, result); },
                  function (result) { con.query(SOPOIdQuery, result); },
                  function (result) { if (Constants.CONST_PO_STATUS_APPROVED == PurchaseOrder1.Status) { PurchaseOrder.ApprovePO(PurchaseOrder1, result); } else { RR.emptyFunction(PurchaseOrder1, result); } },
                ],
                  function (err, results) {
                    if (err)
                      Reqresponse.printResponse(res, err, data);
                    else {
                      var sqlPOItem = PurchaseOrderItem.View(req.body.POId);
                      async.parallel([
                        function (result) { con.query(sqlPOItem, result); },
                      ],
                        function (err, results) {
                          if (err)
                            Reqresponse.printResponse(res, err, null);
                          else {
                            if (results[0][0].length > 0) {
                              var POItemList = [];
                              for (i = 0; i < results[0][0].length; i++) {
                                var obj = {};
                                obj.POItemId = results[0][0][i].POItemId;
                                obj.SOItemId = results[0][0][i].SOItemId;
                                POItemList.push(obj);
                              }
                              SalesOrderItem.UpdateSOPOItemId(POItemList, (err, data) => {
                                if (err)
                                  Reqresponse.printResponse(res, err, null);
                              });
                            }
                          }
                        });
                    }
                  });
                Reqresponse.printResponse(res, err, data);
              });

            }
            else {
              Reqresponse.printResponse(res, { msg: "No Record founded" }, null);
            }
          });

      }
      else {
        Reqresponse.printResponse(res, { msg: "PO already Exist" }, null);
      }
    });
  }
  else {
    Reqresponse.printResponse(res, { msg: "SOId Not founded" }, null);
  }

};

exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    PurchaseOrder.Create(new PurchaseOrder(req.body), (err, data) => {
      const PurchaseOrder1 = new PurchaseOrder({
        POId: data.id,
        authuser: req.body.authuser
      });
      async.parallel([
        function (result) {
          if (req.body.hasOwnProperty('PurchaseOrderItem'))
            PurchaseOrderItem.AutoCreatePurchaseOrderItem(data.id, req.body.PurchaseOrderItem, result);
        },
        function (result) {
          if (req.body.hasOwnProperty('GlobalCustomerReference')) {
            GlobalCustomerReference.Create(Constants.CONST_IDENTITY_TYPE_PO, data.id, req.body.GlobalCustomerReference, result);
          }
        },
        function (result) { PurchaseOrder.UpdatePurchaseOrderByRRId(PurchaseOrder1, result); },

      ],
        function (err, results) {
          if (err)
            Reqresponse.printResponse(res, err, "Create failed");





        }

      );
      Reqresponse.printResponse(res, err, data);
    });

  }
};



exports.AutoCreate = (req, res) => {

  SOModel.ValidateAlreadyExistRRId(req.body.RRId, (err, Resdata4) => {
    if (Resdata4.length > 0) {
      PurchaseOrder.ValidateAlreadyExistRRId(req.body.RRId, (err, data4) => {
        let date_ob = new Date(new Date().getTime() + (Constants.CONST_DUE_DAYS_PO * 24 * 60 * 60 * 1000));
        //date_ob.setDate(date_ob.getDate()+Constants.CONST_DUE_DAYS_PO);
        if (data4.length > 0) {
          // console.log("Re :" + req.body.RRId);
          Reqresponse.printResponse(res, { msg: "Purchase Order Already Created for this RRId :" + req.body.RRId }, null);
          return;
        }
        else {
          //Quotes.GetAcceptVendors(new Quotes(req.body), (err, data) => {  
          Quotes.GetAcceptVendorQuotesInfoByQuoteId(new Quotes(req.body), (err, data) => {
            var backupData = '';
            if (data.length > 0) {
              backupData = data;
              //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
              //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
              //console.log(data)
              var sqlGetShippingAddressIdByVendorId = customeraddress.GetShippingAddressIdByVendorId(Constants.AH_GROUP_VENDOR_ID);
              var sqlGetBillingAddressIdByVendorId = customeraddress.GetBillingAddressIdByVendorId(Constants.AH_GROUP_VENDOR_ID);
              async.parallel([
                function (result) { con.query(sqlGetShippingAddressIdByVendorId, result); },
                function (result) { con.query(sqlGetBillingAddressIdByVendorId, result); },
              ],
                function (err, results) {
                  if (err)
                    Reqresponse.printResponse(res, err, null);
                  //   console.log("PO DueDate = " + date_ob)

                  const PurchaseOrder1 = new PurchaseOrder({
                    authuser: req.body.authuser,
                    PONo: '',
                    RRId: req.body.RRId,
                    RRNo: data[0].RRNo,
                    VendorId: data[0].VendorId,
                    VendorRefNo: data[0].VendorRefNo,
                    POType: Constants.CONST_PO_TYPE_REPAIR,
                    TermsId: data[0].TermsId,
                    DateRequested: cDateTime.getDate(),
                    DueDate: date_ob,
                    AdditionalPONo: '',
                    ShipAddressBookId: 0,
                    BillAddressBookId: 0,
                    ShipAddressIdentityType: 2,
                    ShippingNotes: data[0].Notes,
                    SubTotal: data[0].TotalValue,
                    TaxPercent: data[0].TaxPercent,
                    TotalTax: data[0].TotalTax,
                    Discount: data[0].Discount,
                    AHFees: data[0].AdditionalCharge,
                    Shipping: data[0].Shipping,
                    GrandTotal: data[0].GrandTotal,
                    Status: Constants.CONST_PO_STATUS_APPROVED,
                    RouteCause: data[0].RouteCause,
                    LeadTime: data[0].LeadTime,
                    WarrantyPeriod: data[0].WarrantyPeriod,
                    LocalCurrencyCode: data[0].LocalCurrencyCode,
                    ExchangeRate: data[0].ExchangeRate,
                    BaseCurrencyCode: data[0].BaseCurrencyCode,
                    BaseGrandTotal: data[0].GrandTotal * data[0].ExchangeRate

                  });
                  if (data[0].VendorShipIdLocked > 0) {
                    PurchaseOrder1.ShipAddressBookId = data[0].VendorShipIdLocked;
                  } else if (results[0][0].length > 0) {
                    PurchaseOrder1.ShipAddressBookId = results[0][0][0].AddressId;
                  }
                  if (results[1][0].length > 0) {
                    PurchaseOrder1.BillAddressBookId = results[1][0][0].AddressId;
                  }


                  RRVendorParts.ViewVendorQuoteItems(req.body.RRId, req.body.QuoteId, (err, data1) => {
                    if (err) {
                      if (err.kind === "not_found") {
                        Reqresponse.printResponse(res, { msg: 'Not found Repair Request with id ' + req.body.RRId }, null);
                      }
                      else {
                        Reqresponse.printResponse(res, { msg: 'Error retrieving Repair Request with id ' + req.body.RRId }, null);
                      }
                    }
                    if (data1.length > 0) {
                      var count = 0;
                      for (let obj of data1) {
                        if (obj.LeadTime) {
                          PurchaseOrder1.LeadTime = obj.LeadTime;
                          count++;
                          if (count >= 2) {
                            PurchaseOrder1.LeadTime = 0;
                            break;
                          }
                        }
                      }
                      // console.log("%%%%%%%%%%%%%%%%%%Data%%%%%%%%%%%%%%%%%%")
                      // console.log(data)
                      // console.log("%%%%%%%%%%%%%%%%%%PurchaseOrder1%%%%%%%%%%%%%%%%%%")
                      // console.log(PurchaseOrder1)
                      PurchaseOrder.Create(PurchaseOrder1, (err, data) => {
                        if (err) Reqresponse.printResponse(res, err, null);
                        PurchaseOrder1.POId = data.id;
                        // var sqlShippingAddress = AddressBook.GetShippingAddressIdByVendorId(PurchaseOrder1.VendorId);
                        //var sqlBillingAddress = AddressBook.GetBillingAddressIdByVendorId(PurchaseOrder1.VendorId);
                        //var sqlCusRef = CReferenceLabel.ViewCustomerReference(req.body.RRId);
                        var sqlUpdatePurchaseOrderDueAutoUpdate = PurchaseOrder.UpdatePurchaseOrderDueAutoUpdate(PurchaseOrder1.POId, PurchaseOrder1.LeadTime);
                        //    console.log(sql);

                        const srr = new RR({
                          RRId: req.body.RRId,
                          VendorPONo: 'PO' + PurchaseOrder1.POId,
                          VendorPODueDate: date_ob,
                          VendorPOId: PurchaseOrder1.POId
                        })

                        var sqlUpdateVendorSONo = RR.UpdateVendorPONoByRRID(srr, PurchaseOrder1.LeadTime);

                        var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;
                        //To add PO in notification table
                        var NotificationObj = new NotificationModel({
                          RRId: req.body.RRId,
                          NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_PO,
                          NotificationIdentityId: PurchaseOrder1.POId,
                          NotificationIdentityNo: 'PO' + PurchaseOrder1.POId,
                          ShortDesc: 'Vendor PO Draft Created',
                          Description: 'Vendor PO Draft created by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
                        });

                        // console.log("%%%%%%%%%%%%%%%%%%Data1%%%%%%%%%%%%%%%%%%")
                        // console.log(data1)
                        // console.log("%%%%%%%%%%%%%%%%%%End%%%%%%%%%%%%%%%%%%")
                        async.parallel([
                          function (result) { PurchaseOrder.UpdatePurchaseOrderByRRId(PurchaseOrder1, result); },
                          function (result) { PurchaseOrderItem.AutoCreatePurchaseOrderItem(data.id, data1, result); },
                          // function (result) { con.query(sqlShippingAddress, result); },
                          // function (result) { con.query(sqlBillingAddress, result); },
                          // function (result) { con.query(sqlCusRef, result); },
                          function (result) { con.query(sqlUpdatePurchaseOrderDueAutoUpdate, result); },
                          function (result) { con.query(sqlUpdateVendorSONo, result); },
                          function (result) { NotificationModel.Create(NotificationObj, result); },
                          function (result) { if (Constants.CONST_PO_STATUS_APPROVED == PurchaseOrder1.Status) { PurchaseOrder.ApprovePO(PurchaseOrder1, result); } else { RR.emptyFunction(NotificationObj, result); } },
                          //function (result) { con.query(sql, result) }
                        ],
                          function (err, results) {

                            if (err)
                              Reqresponse.printResponse(res, err, data);
                            // var objGlobalCustomerReference = results[4][0];
                            // console.log("Result  L :" + objGlobalCustomerReference[0]);
                            // if (objGlobalCustomerReference.length > 0) {
                            //   GlobalCustomerReference.Create(Constants.CONST_IDENTITY_TYPE_PO, data.id, objGlobalCustomerReference, (err, data) => {

                            //   });
                            // }
                            else {
                              const GeneralHistoryLogPayload = new GeneralHistoryLog({
                                IdentityType: req.body.RRId > 0 ? Constants.CONST_IDENTITY_TYPE_RR : Constants.CONST_IDENTITY_TYPE_QUOTE,
                                IdentityId: req.body.RRId ? req.body.RRId : backupData[0].QuoteId,
                                RequestBody: JSON.stringify(req.body),
                                Type: req.body.RRId > 0 ? "PO - RR" : "PO - QT",
                                BaseTableRequest: JSON.stringify(PurchaseOrder1),
                                ItemTableRequest: JSON.stringify(data1),
                                BaseTableResponse: JSON.stringify(data),
                                ItemTableResponse: JSON.stringify(results[1]),
                                ErrorMessage: JSON.stringify(err),
                                CommonLogMessage: JSON.stringify(results)
                              });

                              async.parallel([
                                function (result) { PurchaseOrderItem.GetPODetailByRRId(req.body.RRId, result); },
                                function (result) { SalesOrderItem.GetSODetailByRRId(req.body.RRId, result); },
                                function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload, result); },
                              ],
                                function (err, results) {
                                  if (err)
                                    Reqresponse.printResponse(res, err, null);
                                  else {
                                    if (results[0].length > 0 && results[1].length > 0) {

                                      var i = 0; var RRId = 0; var list = []; var POId = 0;
                                      var _RRId = 0; var SOItemlist = []; var SOId = 0;
                                      for (i = 0; i < results[0].length; i++) {

                                        var PODetail = results[0][i];
                                        var SODetail = results[1][i];
                                        RRId = PODetail.RRId;
                                        POId = PODetail.POId;
                                        _RRId = SODetail.RRId;
                                        SOId = SODetail.SOId;
                                        var obj = {}; var obj2 = {};
                                        if (PODetail.PartId = SODetail.PartId) {

                                          obj.POItemId = PODetail.POItemId;
                                          obj.PartId = PODetail.PartId;
                                          obj.SOId = SODetail.SOId;
                                          list.push(obj);

                                          obj2.SOItemId = SODetail.SOItemId;
                                          obj2.SOId = SODetail.SOId;
                                          obj2.PartId = SODetail.PartId;
                                          obj2.POId = PODetail.POId;
                                          SOItemlist.push(obj2);
                                        }
                                      }
                                      async.parallel([
                                        function (result) { SOModel.UpdatePOIdByRRId(POId, RRId, result); },
                                        function (result) { SalesOrderItem.UpdatePOItemIdBySOIdAndPartId(list, result); },
                                        function (result) { SOModel.UpdateSOIdByRRId(SOId, _RRId, result); },
                                        function (result) { PurchaseOrderItem.UpdateSOItemIdByPOIdAndPartId(SOItemlist, result); },
                                      ],
                                        function (err, results2) {
                                          if (err)
                                            Reqresponse.printResponse(res, err, null);
                                        });
                                    }
                                  }
                                });
                            }
                          });

                        Reqresponse.printResponse(res, err, data);
                      });

                    }
                    else {
                      Reqresponse.printResponse(res, { msg: "No VendorParts for RRId=" + req.body.RRId }, null);
                    }
                  });
                });
            }
            else {
              Reqresponse.printResponse(res, { msg: "Accept the vendor quote before generating the customer quote " }, null);
            }
          });
        }
      });
    }
    else {
      Reqresponse.printResponse(res, { msg: "Please Create Sales Order Before Creating PO" }, null);
    }
  });
};


exports.Update = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    var sql = PurchaseOrderItem.View(req.body.POId);
    con.query(sql, (err, data) => {
      if (err)
        Reqresponse.printResponse(res, err, null);
      if (data.length > 0) {

        async.parallel([
          function (result) { PurchaseOrder.Update(new PurchaseOrder(req.body), result); },
          function (result) { if (req.body.hasOwnProperty('PurchaseOrderItem')) { PurchaseOrderItem.UpdatePurchaseOrderItem(req.body, result); } },
          // function (result) {
          //   if (req.body.hasOwnProperty('GlobalCustomerReference')) {
          //     GlobalCustomerReference.UpdateGlobalCustomerReference(Constants.CONST_IDENTITY_TYPE_PO, req.body.POId, req.body.GlobalCustomerReference, result);
          //   }

          // },
          function (result) { RR.UpdateVendorPODueDate(req.body, result); },
          function (result) { RRVendors.UpdateRRVendorRefNoFromPO(req.body, result); },
          function (result) { PurchaseOrder.IsNonRRAndNonMRO(req.body.POId, result); },
          function (result) { VendorInvoiceModel.GetVendorBillDetail(req.body.POId, result); },
        ],
          function (err, results) {
            if (err) {
              // console.log("@@@@@####$$$%^&^^^^^^^1");
              // console.log(err);
              Reqresponse.printResponse(res, err, null);
            }
            else {
              // console.log("@@@@one@@@@");
              // console.log(results[4].length)
              // console.log("@@@@one@@@@");
              // console.log(results[4][0].POId);
              // console.log("@@@@one@@@@");
              // console.log(results[5].length)
              if (results[4].length > 0 && results[4][0].POId > 0 && results[5].length > 0) {
                // console.log("@@@@two@@@@");
                var VendorInvoiceId = results[5].length > 0 ? results[5][0].VendorInvoiceId : 0;
                var VendorInvoiceItemArray = [];
                for (var i = 0; i < req.body.PurchaseOrderItem.length; i++) {

                  var ItemObj = {};
                  var dataObj = i < data.length ? data[i] : {};
                  var POItemObj = req.body.PurchaseOrderItem[i];
                  if (dataObj.PartId != POItemObj.PartId) {
                    ItemObj.VendorInvoiceId = VendorInvoiceId;
                    ItemObj.POId = req.body.POId;
                    ItemObj.PONo = "PO" + req.body.POId;
                    ItemObj.POItemId = POItemObj.POItemId;
                    ItemObj.PartId = POItemObj.PartId;
                    ItemObj.PartNo = POItemObj.PartNo;
                    ItemObj.Description = POItemObj.Description;
                    ItemObj.TaxType = POItemObj.TaxType;
                    ItemObj.Quantity = POItemObj.Quantity;
                    ItemObj.Rate = POItemObj.Rate;
                    ItemObj.Discount = POItemObj.Discount;
                    ItemObj.Tax = POItemObj.Tax;
                    ItemObj.Price = POItemObj.Price;

                    ItemObj.ItemTaxPercent = POItemObj.ItemTaxPercent;
                    ItemObj.ItemLocalCurrencyCode = POItemObj.ItemLocalCurrencyCode;
                    ItemObj.ItemExchangeRate = POItemObj.ItemExchangeRate;
                    ItemObj.ItemBaseCurrencyCode = POItemObj.ItemBaseCurrencyCode;
                    ItemObj.BasePrice = POItemObj.BasePrice;
                    ItemObj.BaseRate = POItemObj.BaseRate;
                    ItemObj.BaseTax = POItemObj.BaseTax;
                    VendorInvoiceItemArray.push(ItemObj);
                  }
                  else if (dataObj.PartId == POItemObj.PartId) {

                    ItemObj.VendorInvoiceItemId = results[5][i].VendorInvoiceItemId > 0 ? results[5][i].VendorInvoiceItemId : -1;
                    ItemObj.VendorInvoiceId = VendorInvoiceId;
                    ItemObj.POId = req.body.POId;
                    ItemObj.PONo = "PO" + req.body.POId;
                    ItemObj.POItemId = POItemObj.POItemId;
                    ItemObj.PartId = POItemObj.PartId;
                    ItemObj.PartNo = POItemObj.PartNo;
                    ItemObj.Description = POItemObj.Description;
                    ItemObj.TaxType = POItemObj.TaxType;
                    ItemObj.Quantity = POItemObj.Quantity;
                    ItemObj.Rate = POItemObj.Rate;
                    ItemObj.Discount = POItemObj.Discount;
                    ItemObj.Tax = POItemObj.Tax;
                    ItemObj.Price = POItemObj.Price;

                    ItemObj.ItemTaxPercent = POItemObj.ItemTaxPercent;
                    ItemObj.ItemLocalCurrencyCode = POItemObj.ItemLocalCurrencyCode;
                    ItemObj.ItemExchangeRate = POItemObj.ItemExchangeRate;
                    ItemObj.ItemBaseCurrencyCode = POItemObj.ItemBaseCurrencyCode;
                    ItemObj.BasePrice = POItemObj.BasePrice;
                    ItemObj.BaseRate = POItemObj.BaseRate;
                    ItemObj.BaseTax = POItemObj.BaseTax;
                    VendorInvoiceItemArray.push(ItemObj);
                  }
                  else { }
                }
                req.body.VendorInvoiceId = VendorInvoiceId;
                req.body.VendorInvItemList = VendorInvoiceItemArray;
                const objVendorInvoice = new VendorInvoiceModel({
                  authuser: req.body.authuser,
                  SubTotal: req.body.SubTotal,
                  AHFees: req.body.AHFees,
                  TaxPercent: req.body.TaxPercent,
                  TotalTax: req.body.TotalTax,
                  Discount: req.body.Discount,
                  Shipping: req.body.Shipping,
                  AdvanceAmount: 0,
                  GrandTotal: req.body.GrandTotal,
                  VendorInvoiceId: VendorInvoiceId,

                  BaseCurrencyCode: req.body.BaseCurrencyCode,
                  BaseGrandTotal: req.body.BaseGrandTotal,
                  ExchangeRate: req.body.ExchangeRate,
                  LocalCurrencyCode: req.body.LocalCurrencyCod
                });
                // console.log("@@@@@####$$$%^&^^^^^^^");
                // console.log(req.body.VendorInvItemList);
                async.parallel([
                  function (result) { VendorInvoiceModel.UpdateNonRRAndNonMROVI(objVendorInvoice, result); },
                  function (result) { VendorInvoiceItemModel.Update(req.body.VendorInvItemList, result); },
                ],
                  function (err, results) {
                    if (err) {
                      Reqresponse.printResponse(res, err, null);
                    }

                  });
              }
              Reqresponse.printResponse(res, null, { data: req.body });
            }
          });
      }
      else {
        Reqresponse.printResponse(res, { msg: "no record" }, null);
      }
    });
    // Reqresponse.printResponse(res, null, { data: req.body });

  }
};


exports.ViewById = (req, res) => {
  if (req.body.hasOwnProperty('POId')) {
    var IdentityType = 0;// from Admin
    PurchaseOrder.findById(req.body, IdentityType, req.body.IsDeleted, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "PO Id is required" }, null);
  }
};

exports.getPurchaseListByServerSide = (req, res) => {

  PurchaseOrder.getPurchaseListByServerSide(new PurchaseOrder(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


//To Get ExportToExcel
exports.ExportToExcel = (req, res) => {
  PurchaseOrder.ExportToExcel(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.ApprovePO = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;
  if (boolean) {
    PurchaseOrder.ApprovePO(new PurchaseOrder(req.body), (err, data) => {
      if (data.id > 0) {
        var NotificationObj = new NotificationModel({
          authuser: req.body.authuser,
          RRId: req.body.POId,
          NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_PO,
          NotificationIdentityId: req.body.POId,
          NotificationIdentityNo: 'PO' + req.body.POId,
          ShortDesc: 'Vendor PO Approved',
          Description: 'Vendor PO Approved by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
        });
        NotificationModel.Create(NotificationObj, (err, data1) => {
        });
      }
      Reqresponse.printResponse(res, err, data);
    });
  }
};
//

exports.ReOpenPO = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    PurchaseOrder.ReOpenPO(new PurchaseOrder(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
//To delete Purchase Order
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('POId')) {
    PurchaseOrder.remove(req.body.POId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "PO Id is required" }, null);
  }
};
//To  Send PO Email By PO List
exports.SendPOEmailByPOList = (req, res) => {
  PurchaseOrder.SendPOEmailByPOList(req.body.POList, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
//To  get the list of POs for vendor bills
exports.POListForVendorBills = (req, res) => {
  if (req.body.hasOwnProperty('PONo')) {
    PurchaseOrder.POListForVendorBills(req.body.PONo, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "PO No is required" }, null);
  }
};
// To Delete PO Item
// exports.DeletePOItem = (req, res) => {
//   if (req.body.hasOwnProperty('POItemId')) {
//     if (req.body.POItemId != "") {
//       async.parallel([
//         function (result) { PurchaseOrderItem.DeletePOItem(req.body.POItemId, result); },
//         function (result) { PurchaseOrderItem.SelectNewCalculationAfterPOItemDelete(req.body.POItemId, result); },
//       ],
//         function (err, results) {
//           if (err) {
//             Reqresponse.printResponse(res, err, null);
//           }
//           PurchaseOrder.UpdatePOByPOIdAfterPOItemDelete({ res: results[1] }, (err, data) => {
//           });
//           Reqresponse.printResponse(res, null, { ress: results[1] });
//         });
//     }
//     else {
//       Reqresponse.printResponse(res, { msg: "POItem Id is required" }, null);
//     }
//   }
// };
// To Delete POItem
exports.DeletePOItem = (req, res) => {
  if (req.body.hasOwnProperty('POItemId')) {
    if (req.body.POItemId != "") {
      async.parallel([
        function (result) { PurchaseOrderItem.DeletePOItem(req.body.POItemId, result); }
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }

          PurchaseOrderItem.SelectNewCalculationAfterPOItemDelete(req.body.POId, req.body.POItemId, (err, Rdata) => {
            if (err) {
              Reqresponse.printResponse(res, err, null);
            }
            if (Rdata.res[0]) {
              PurchaseOrder.UpdatePOByPOIdAfterPOItemDelete(Rdata.res[0], (err, data) => {
              });
              VendorInvoiceItemModel.GetVendorInvoiceItemId(req.body.POItemId, (err, Ddata) => {//
                if (err) {
                  Reqresponse.printResponse(res, err, null);
                }
                if (Ddata.length > 0 && Ddata[0].VendorInvoiceItemId > 0) {
                  async.parallel([
                    function (result) { VendorInvoiceItemModel.DeleteVendorInvItem(Ddata[0].VendorInvoiceItemId, result); }
                  ],
                    function (err, results) {
                      if (err) {
                        Reqresponse.printResponse(res, err, null);
                      }
                      VendorInvoiceItemModel.SelectNewCalculationAfterVendorInvItemDelete(Ddata[0].VendorInvoiceItemId, (err, Rdata) => {
                        if (err) {
                          Reqresponse.printResponse(res, err, null);
                        }
                        if (Rdata.res[0]) {
                          VendorInvoiceModel.UpdateAfterVendorInvItemDelete(Rdata.res[0], (err, data) => {
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
      Reqresponse.printResponse(res, { msg: "POItem Id is required" }, null);
    }
  }
};

exports.POListWithOutPartId = (req, res) => {
  PurchaseOrder.POListWithOutPartId(req.body, (err, data) => {
    if (err) {
      Reqresponse.printResponse(res, err, null);
    }
    Reqresponse.printResponse(res, err, data);
  })
};

exports.UpdateMissingPartIdInPO = (req, res) => {

  if (req.body.RRId > 0) {
    async.parallel([
      function (result) { PurchaseOrder.GetMissingPartId(req.body.RRId, result); },
      function (result) { PurchaseOrder.GetPOItemId(req.body.RRId, result); },
    ],
      function (err, results) {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        }
        else {
          if (results[0].length == results[1].length) {
            var array = []; var i = 0;
            for (i = 0; i < results[0].length; i++) {
              var obj = {};
              obj.PartId = results[0][i].PartId;
              obj.POItemId = results[1][i].POItemId;
              array.push(obj);
            }
            PurchaseOrder.UpdateMissingPartId(array, (err, data) => {
              if (err) {
                Reqresponse.printResponse(res, err, null);
              }
              Reqresponse.printResponse(res, err, data);
            });
          }
          else {
            Reqresponse.printResponse(res, { msg: "Records Not finded " }, null);
          }
        }
      });
  }
  else {
    Reqresponse.printResponse(res, { msg: "RRId is required" }, null);
  }
};












//Below are For MRO

exports.MROAutoCreate = (req, res) => {

  PurchaseOrder.ValidateAlreadyExistMROId(req.body.MROId, (err, data4) => {
    let date_ob = new Date(new Date().getTime() + (Constants.CONST_DUE_DAYS_PO * 24 * 60 * 60 * 1000));
    //date_ob.setDate(date_ob.getDate()+Constants.CONST_DUE_DAYS_PO);
    if (data4.length > 0) {
      Reqresponse.printResponse(res, { msg: "Purchase Order Already Created for this MROId :" + req.body.MROId }, null);
      return;
    }
    else {
      Quotes.GetAcceptVendorQuotesInfoByQuoteId(new Quotes(req.body), (err, data) => {

        if (data.length > 0) {
          var sqlGetShippingAddressIdByVendorId = customeraddress.GetShippingAddressIdByVendorId(Constants.AH_GROUP_VENDOR_ID);
          var sqlGetBillingAddressIdByVendorId = customeraddress.GetBillingAddressIdByVendorId(Constants.AH_GROUP_VENDOR_ID);
          async.parallel([
            function (result) { con.query(sqlGetShippingAddressIdByVendorId, result); },
            function (result) { con.query(sqlGetBillingAddressIdByVendorId, result); },
          ],
            function (err, results) {
              if (err)
                Reqresponse.printResponse(res, err, null);
              //   console.log("PO DueDate = " + date_ob)
              const PurchaseOrder1 = new PurchaseOrder({
                authuser: req.body.authuser,
                PONo: '',
                MROId: req.body.MROId,
                RRId: 0,
                RRNo: data[0].RRNo,
                VendorId: data[0].VendorId,
                VendorRefNo: data[0].VendorRefNo,
                POType: Constants.CONST_PO_TYPE_MRO,
                TermsId: data[0].TermsId,
                DateRequested: cDateTime.getDate(),
                DueDate: date_ob,
                AdditionalPONo: '',
                ShipAddressBookId: 0,
                BillAddressBookId: 0,
                ShipAddressIdentityType: 2,
                ShippingNotes: data[0].Notes,
                SubTotal: data[0].TotalValue,
                TaxPercent: data[0].TaxPercent,
                TotalTax: data[0].TotalTax,
                Discount: data[0].Discount,
                AHFees: data[0].AdditionalCharge,
                Shipping: data[0].Shipping,
                GrandTotal: data[0].GrandTotal,
                Status: Constants.CONST_PO_STATUS_APPROVED,
                RouteCause: data[0].RouteCause,
                LeadTime: data[0].LeadTime,
                WarrantyPeriod: data[0].WarrantyPeriod,
                LocalCurrencyCode: data[0].LocalCurrencyCode,
                ExchangeRate: data[0].ExchangeRate,
                BaseCurrencyCode: data[0].BaseCurrencyCode,
                BaseGrandTotal: data[0].BaseGrandTotal

              });
              if (results[0][0].length > 0) {
                PurchaseOrder1.ShipAddressBookId = results[0][0][0].AddressId;
              }
              if (results[1][0].length > 0) {
                PurchaseOrder1.BillAddressBookId = results[1][0][0].AddressId;
              }


              RRVendorParts.ViewMROVendorQuoteItems(req.body.MROId, req.body.QuoteId, (err, data1) => {
                if (err) {
                  if (err.kind === "not_found") {
                    Reqresponse.printResponse(res, { msg: 'Not found MRO ' + req.body.MROId }, null);
                  }
                  else {
                    Reqresponse.printResponse(res, { msg: 'Error retrieving MRO ' + req.body.MROId }, null);
                  }
                }
                if (data1.length > 0) {
                  var count = 0;
                  for (let obj of data1) {
                    if (obj.LeadTime) {
                      PurchaseOrder1.LeadTime = obj.LeadTime;
                      count++;
                      if (count >= 2) {
                        PurchaseOrder1.LeadTime = 0;
                        break;
                      }
                    }
                  }
                  PurchaseOrder.Create(new PurchaseOrder(PurchaseOrder1), (err, data) => {
                    if (err) Reqresponse.printResponse(res, err, null);
                    PurchaseOrder1.POId = data.id;
                    // var sqlShippingAddress = AddressBook.GetShippingAddressIdByVendorId(PurchaseOrder1.VendorId);
                    //var sqlBillingAddress = AddressBook.GetBillingAddressIdByVendorId(PurchaseOrder1.VendorId);
                    //var sqlCusRef = CReferenceLabel.ViewCustomerReference(req.body.RRId);
                    var sqlUpdatePurchaseOrderDueAutoUpdate = PurchaseOrder.UpdatePurchaseOrderDueAutoUpdate(PurchaseOrder1.POId, PurchaseOrder1.LeadTime);
                    //    console.log(sql);

                    const srr = new MROModel({
                      authuser: req.body.authuser,
                      MROId: req.body.MROId,
                      VendorPONo: 'PO' + PurchaseOrder1.POId,
                      VendorPODueDate: date_ob,
                      VendorPOId: PurchaseOrder1.POId
                    })

                    var sqlUpdateVendorPONo = MROModel.UpdateVendorPONoByMROId(srr, PurchaseOrder1.LeadTime);

 

                    async.parallel([
                      function (result) { PurchaseOrder.UpdatePurchaseOrderByRRId(PurchaseOrder1, result); },
                      function (result) { PurchaseOrderItem.AutoCreatePurchaseOrderItem(data.id, data1, result); },
                      // function (result) { con.query(sqlShippingAddress, result); },
                      // function (result) { con.query(sqlBillingAddress, result); },
                      // function (result) { con.query(sqlCusRef, result); },
                      function (result) { con.query(sqlUpdatePurchaseOrderDueAutoUpdate, result); },
                      function (result) { con.query(sqlUpdateVendorPONo, result); },
                      // function (result) { NotificationModel.Create(NotificationObj, result); },
                      function (result) { if (Constants.CONST_PO_STATUS_APPROVED == PurchaseOrder1.Status) { PurchaseOrder.ApprovePO(new PurchaseOrder(PurchaseOrder1), result); } else { RR.emptyFunction(NotificationObj, result); } },
                      //function (result) { con.query(sql, result) }
                    ],
                      function (err, results) {

                        if (err)
                          Reqresponse.printResponse(res, err, data);
                        // var objGlobalCustomerReference = results[4][0];
                        // console.log("Result  L :" + objGlobalCustomerReference[0]);
                        // if (objGlobalCustomerReference.length > 0) {
                        //   GlobalCustomerReference.Create(Constants.CONST_IDENTITY_TYPE_PO, data.id, objGlobalCustomerReference, (err, data) => {

                        //   });
                        // }
                      });

                    Reqresponse.printResponse(res, err, data);
                  });

                }
                else {
                  Reqresponse.printResponse(res, { msg: "No VendorParts for MROId=" + req.body.MROId }, null);
                }
              });
            });
        }
        else {
          Reqresponse.printResponse(res, { msg: "Accept the vendor quote before generating the customer quote " }, null);
        }
      });
    }
  });

};

exports.CreatePOByMRO = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    var GrandTotal = 0; var VendorId = 0; var LeadTime = 0; var count = 0; var Ids = ''; var Quantity = 0; var SOItemIds = 0; var SOId = 0; var BasePrice = 0;
    var ShippingCharge = 0;
    for (let obj of req.body.PurchaseOrderItem) {
      GrandTotal += parseFloat(obj.Price);
      VendorId = obj.VendorId;
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
      function (result) { con.query(customeraddress.GetShippingAddressIdByVendorId(Constants.AH_GROUP_VENDOR_ID), result); },
      function (result) { con.query(customeraddress.GetBillingAddressIdByVendorId(Constants.AH_GROUP_VENDOR_ID), result); },
      function (result) { con.query(VendorModel.viewquery(VendorId), result); },
      function (result) { con.query(SOModel.GetSaleOrder(req.body.MROId, PartIds), result); },
    ],
      function (err, results) {
        if (err)
          Reqresponse.printResponse(res, err, null);

        const PurchaseOrder1 = new PurchaseOrder({
          authuser: req.body.authuser,
          PONo: '',
          MROId: req.body.MROId,
          RRId: 0,
          RRNo: '',
          VendorId: VendorId,
          VendorRefNo: '',
          POType: Constants.CONST_PO_TYPE_MRO,
          TermsId: 0,
          DateRequested: cDateTime.getDate(),
          DueDate: cDateTime.getDate(),
          AdditionalPONo: '',
          ShipAddressBookId: 0,
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
          LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : '',
          ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 0,
          BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : '',
          BaseGrandTotal: BasePrice
        });
        PurchaseOrder1.ShipAddressBookId = results[0][0].length > 0 ? results[0][0][0].AddressId : 0;
        PurchaseOrder1.BillAddressBookId = results[1][0].length > 0 ? results[1][0][0].AddressId : 0;
        PurchaseOrder1.TermsId = results[2][0].length > 0 ? results[2][0][0].TermsId : 0;

        for (var i = 0; i < results[3][0].length; i++) {
          var obj = req.body.PurchaseOrderItem[i];


          var PO_SOId = 0;
          var PO_SOItemId = 0;
          //console.log(results[3][0]);
          var pickedSOItem = results[3][0].find(x => x.PartId === req.body.PurchaseOrderItem[i].PartId);

          if (pickedSOItem) {
            PO_SOId = pickedSOItem.SOId
            PO_SOItemId = pickedSOItem.SOItemId
          }


          PurchaseOrder1.SOId = PO_SOId;
          obj.SOId = PO_SOId;
          obj.SOItemId = PO_SOItemId;


          req.body.PurchaseOrderItem[i] = obj;
          SOItemIds += PO_SOItemId + `,`;
          SOId = PO_SOId;
        }
        var _SOItemIds = SOItemIds.slice(0, -1);

        PurchaseOrder.IsEligibleCreatePO(req.body.MROId, SOId, _SOItemIds, (err, data1) => {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          if (data1.length > 0 && Quantity <= data1[0].MaxQuantity) {
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
                  if (req.body.hasOwnProperty('PurchaseOrderItem'))
                    PurchaseOrderItem.AutoCreatePurchaseOrderItem(data.id, req.body.PurchaseOrderItem, result);
                },
                function (result) { PurchaseOrder.UpdatePurchaseOrderByRRId(PurchaseOrder1, result); },
                function (result) { con.query(MROModel.UpdateVendorPONoByMROId(srr, 0), result); },
                function (result) { con.query(PurchaseOrder.UpdatePurchaseOrderDueAutoUpdate(PurchaseOrder1.POId, PurchaseOrder1.LeadTime), result); },
                function (result) { con.query(SOModel.UpdateSOPOId(PurchaseOrder1.POId, SOId), result); }
              ],
                function (err, results) {
                  const GeneralHistoryLogPayload = new GeneralHistoryLog({
                    IdentityType: Constants.CONST_IDENTITY_TYPE_MRO,
                    IdentityId: req.body.MROId,
                    RequestBody: JSON.stringify(req.body),
                    Type: "PO - MRO",
                    BaseTableRequest: JSON.stringify(PurchaseOrder1),
                    ItemTableRequest: JSON.stringify(req.body.PurchaseOrderItem),
                    BaseTableResponse: JSON.stringify(data),
                    ItemTableResponse: JSON.stringify(results[0]),
                    ErrorMessage: JSON.stringify(err),
                    CommonLogMessage: JSON.stringify(results)
                  });
                  async.parallel([
                    function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload, result); },
                  ],
                    function (err, results) {
                    });
                  if (err) {
                    Reqresponse.printResponse(res, err, null);
                  } else {
                    PurchaseOrder.GetPOItemByPOId(PurchaseOrder1.POId, (err, data) => {
                      var resultlist = data;
                      for (const val of resultlist) {
                        if (val.SOItemId > 0 && val.POItemId > 0) {
                          SOModel.UpdatePOItemIdInSO(val, (err, data) => {

                          });
                        }
                      }
                      Reqresponse.printResponse(res, null, data);
                    });
                  }

                });
            });
          }
          else {
            Reqresponse.printResponse(res, { msg: "Quantity Exceeds.Remaining quantity is " + data1[0].MaxQuantity }, null);
          }
        });
      });
  }
};


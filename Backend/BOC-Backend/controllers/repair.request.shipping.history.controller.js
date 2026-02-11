/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RRSH = require("../models/repair.request.shipping.history.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const CustomerAddress = require("../models/customeraddress.model.js");
const Customer = require("../models/customers.model.js");
const Vendor = require("../models/vendor.model.js");
const RR = require("../models/repair.request.model.js");
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");
var async = require('async');
var cDateTime = require("../utils/generic.js");
const UsersModel = require("../models/users.model.js");
const SalesOrder = require("../models/sales.order.model.js");
const SalesOrderItem = require("../models/sales.order.item.model.js");
const TermModel = require("../models/terms.model.js");
const InvoiceItem = require("../models/invoice.item.model.js");
const Invoice = require("../models/invoice.model.js");
const NotificationModel = require("../models/notification.model.js");
const RRStatusHistory = require("../models/rr.status.history.model.js");
const RRBulkShipping = require("../models/repair.request.bulk.shipping.model.js");
const RRBulkShippingLog = require("../models/repair.request.bulk.shipping.log.model.js");
const GeneralHistoryLog = require("../models/general.history.log.model.js");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType } = require("../helper/common.function.js");

exports.ship = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    req.body.ShippingStatus = req.body.ShipViaId == 5 ? 3 : 1;//3-Ready for Pick Up //1-Shipping
    req.body.ReadyForPickUpDate = req.body.ShipViaId == 5 ? cDateTime.getDateTime() : null;
    RRSH.ship(new RRSH(req.body), (err, data) => {
      req.body.ShippingHistoryId = data.id;
      Reqresponse.printResponse(res, err, req.body);
    });
  }
};

exports.ServerSideList = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRBulkShipping.ServerSideList(new RRBulkShipping(req.body), (err, data) => {
      if (err)
        Reqresponse.printResponse(res, err, data)
      else
        Reqresponse.printResponse(res, null, data)
    });
  }
};


exports.UploadSignatureToS3 = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRSH.UploadSignatureToS3(req.body, (err, data) => {
      if (err)
        Reqresponse.printResponse(res, err, data)
      else
        Reqresponse.printResponse(res, null, data)
    });
  }
};



exports.ClientSideRRShipHistoryListByVendor = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    RRSH.ClientSideRRShipHistoryListByVendor(new RRSH(req.body), (err, data) => {
      if (err)
        Reqresponse.printResponse(res, err, data)
      else
        Reqresponse.printResponse(res, null, data)
    });
  }
};
exports.UpdateReadyForPickUpToPickUp = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRSH.UploadSignatureToS3(req.body, (err, data) => {
      req.body.PickUPSignature = (data && data.Location) ? data.Location : '';
      RecursiveUpdate(0, req.body, (err, data) => {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        } else {
          Reqresponse.printResponse(res, null, data);
        }
      });
    });
  }
};

function RecursiveUpdate(i, Obj, result) {

  var Model = Obj.PickUpItem[i];
  Model.PickedUpBy = Obj.PickedUpBy;
  Model.PickedUpDate = cDateTime.getDateTime();
  Model.PickUPSignature = Obj.PickUPSignature;
  RRSH.UpdateReadyForPickUpToPickUp(new RRSH(Model), (err, data) => {
    if (err) {
      return result(err, null);
    }
    else {
      i = i + 1;
      //console.log(i, "record Updated");
      if (i == Obj.PickUpItem.length) {
        return result(null, data);
      }
      RecursiveUpdate(i, Obj, result);
    }
  });
}



function RecursiveUpdateNew(i, Obj, result) {
  var Model = Obj.PickUpItem[i];
  Model.PickedUpBy = Obj.PickedUpBy;
  Model.PickedUpDate = cDateTime.getDateTime();

  RRSH.UploadImageToS3(Obj, (err, Resdata) => {
    if (err) {
      return result(err, null);
    }
    Model.PickUPSignature = Resdata.location;
    RRSH.UpdateReadyForPickUpToPickUp(new RRSH(Model), (err, data) => {
      if (err) {
        return result(err, null);
      }
      else {
        i = i + 1;
       // console.log(i, "record Updated");
        if (i == Obj.PickUpItem.length) {
          return result(null, data);
        }
        RecursiveUpdateNew(i, Obj, result);
      }
    });
  });
}

exports.BulkShipping = (req, res) => {
  if (req.body.hasOwnProperty('ShippingArray') && req.body.ShippingArray.length > 0) {
    var REQBODY = req.body;
    if (REQBODY.CustomerId > 0 || REQBODY.VendorId > 0) {
      var CustomerObj = {};
      CustomerObj.IdentityId = REQBODY.CustomerId;
      CustomerObj.IdentityType = Constants.CONST_IDENTITY_TYPE_CUSTOMER;

      var VendorObj = {};
      VendorObj.IdentityId = REQBODY.VendorId;
      VendorObj.IdentityType = Constants.CONST_IDENTITY_TYPE_VENDOR;

      var AHObj = {};
      AHObj.IdentityId = Constants.AH_GROUP_VENDOR_ID;
      AHObj.IdentityType = Constants.CONST_IDENTITY_TYPE_VENDOR;

      CustomerObj.Type = VendorObj.Type = AHObj.Type = 3;

      var RRBulkShippingObj = {};
      RRBulkShippingObj.ShipFrom = REQBODY.ShipFrom;
      RRBulkShippingObj.ShipTo = REQBODY.ShipTo;
      RRBulkShippingObj.CustomerId = REQBODY.CustomerId;
      RRBulkShippingObj.VendorId = REQBODY.VendorId;
      RRBulkShippingObj.RRs = REQBODY.RRs;
      RRBulkShippingObj.ShipVia = REQBODY.ShipViaId;


      var UserId = getLogInUserId(req.body);

      async.parallel([
        function (result) { if (REQBODY.CustomerId > 0) { CustomerAddress.listbyIdentity(CustomerObj, result); } else { RR.emptyFunction(REQBODY, result); } },
        function (result) { con.query(Customer.viewquery(CustomerObj.IdentityId, req.body), result) },
        function (result) { if (REQBODY.VendorId > 0) { CustomerAddress.listbyIdentity(VendorObj, result); } else { RR.emptyFunction(REQBODY, result); } },
        function (result) { con.query(Vendor.viewquery(VendorObj.IdentityId), result) },
        function (result) { UsersModel.findById(UserId, result); },
        function (result) { CustomerAddress.listbyIdentity(AHObj, result); },
        function (result) { con.query(Vendor.viewquery(AHObj.IdentityId), result) },
        function (result) { RRBulkShipping.Create(new RRBulkShipping(RRBulkShippingObj), result); },
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          if (results[0].length > 0 || results[1][0].length > 0 || results[2].length > 0) {
            var Model = {};
            Model.BulkShipId = results[7].id > 0 ? results[7].id : 0;
            Model.ShipFromIdentity = REQBODY.ShipFrom == "Customer" ? 1 : 2;
            if (Model.ShipFromIdentity == 1) {
              Model.ShipFromId = results[1][0][0].CustomerId;
              Model.ShipFromName = results[1][0][0].CompanyName;
              Model.ShipFromAddressId = results[0][0].AddressId;
            }
            else {
              Model.ShipFromId = results[6][0][0].VendorId;
              Model.ShipFromName = results[6][0][0].VendorName;
              Model.ShipFromAddressId = results[5][0].AddressId;
            }
            Model.ShipViaId = REQBODY.ShipViaId;
            Model.ShipDate = cDateTime.getDate();
            Model.ShippedBy = results[4].FirstName + ' ' + results[4].LastName;
            Model.ShipComment = REQBODY.ShipComment;
            Model.ShipToIdentity = REQBODY.ShipTo == "Customer" ? 1 : 2;

            if (Model.ShipToIdentity == 1) {
              Model.ShipToId = results[1][0][0].CustomerId;
              Model.ShipToName = results[1][0][0].CompanyName;
              Model.ShipToAddressId = results[0][0].AddressId;
            }
            else {
              Model.ShipToId = results[3][0][0].VendorId;
              Model.ShipToName = results[3][0][0].VendorName;
              Model.ShipToAddressId = results[2][0].AddressId;
            }
            Model.ShowCustomerReference = REQBODY.ShowCustomerReference;
            Model.ShowRootCause = REQBODY.ShowRootCause;
            Model.ShippingStatus = REQBODY.ShipViaId == 5 ? 3 : 1;//3-Ready for Pick Up//1-Shipping

            REQBODY.Model = Model;
            var shid = [];
            Recursive(0, REQBODY, shid, (err, data) => {
              if (err)
                Reqresponse.printResponse(res, err, null);
              else
                Reqresponse.printResponse(res, null, data);
            });
          }
        });
    }
    else {
      Reqresponse.printResponse(res, { msg: "Customer Not Found" }, null);
    }
  }
};

function Recursive(i, REQBODY, shid, cb) {

  var RRId = REQBODY.Model.RRId = REQBODY.ShippingArray[i].RRId;
  REQBODY.Model.TrackingNo = REQBODY.ShippingArray[i].TrackingNo;
  REQBODY.Model.ReadyForPickUpDate = REQBODY.ShipViaId == 5 ? cDateTime.getDateTime() : null;
  var Obj = REQBODY.Model;

  async.parallel([
    function (result) { Invoice.ValidateAlreadyExistRRId(RRId, 0, result); },
    function (result) { con.query(RR.SelectRRStatus(RRId), result) },
  ],
    function (err, Respon) {
      if (err) {
        return cb(err, null);
      }
      else {
        var IsBoolean = (Respon[0].length <= 0 && Respon[1][0].length > 0 && Respon[1][0][0].Status == Constants.CONST_RRS_IN_PROGRESS && REQBODY.Model.ShipToIdentity == 1) ? true : false;
        if (IsBoolean) {
          var sql = SalesOrder.viewByRRId(RRId, 0);
          var sqlSi = SalesOrderItem.viewByRRId(RRId, 0);
          var sqlGetDefaultTerm = TermModel.GetDefaultTerm();
        }
        async.parallel([
          function (result) { if (IsBoolean) { con.query(sql, result); } else { RR.emptyFunction(REQBODY, result); } },
          function (result) { if (IsBoolean) { con.query(sqlSi, result) } else { RR.emptyFunction(REQBODY, result); } },
          function (result) { if (IsBoolean) { con.query(sqlGetDefaultTerm, result) } else { RR.emptyFunction(REQBODY, result); } },
        ],
          function (err, results) {
            if (err) { return cb(err, null); }

            if (IsBoolean) {
              if (results[0][0].length > 0) {
                var InvoiceRes = results[0][0];
                var objInvoiceItem = results[1][0];
                var objInvoice = new Invoice({
                  authuser: REQBODY.authuser,
                  InvoiceNo: '',
                  SONo: InvoiceRes[0].SONo,
                  SOId: InvoiceRes[0].SOId,
                  CustomerPONo: InvoiceRes[0].CustomerPONo,
                  CustomerBlanketPOId: InvoiceRes[0].CustomerBlanketPOId,
                  RRId: RRId,
                  RRNo: InvoiceRes[0].RRNo,
                  CustomerId: InvoiceRes[0].CustomerId,
                  InvoiceType: RRId > 0 ? Constants.CONST_INV_TYPE_REPAIR : Constants.CONST_INV_TYPE_REGULAR,
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
                REQBODY.TermsDays = 0;
                if (results[2][0].length > 0) {
                  objInvoice.TermsId = results[2][0][0].TermsId;
                  REQBODY.TermsDays = results[2][0][0].TermsDays;
                }
              } else {
                return cb({ msg: `One Of the RR(${RRId}) dont have SO. Please Create Before Ship.` }, null);
              }
            }
            async.parallel([
              function (result) { if (IsBoolean) { Invoice.Create(objInvoice, result); } else { RR.emptyFunction(REQBODY, result); } },
              function (result) { RRSH.ship(new RRSH(Obj), result); },
            ],
              function (err, results) {
                if (err) { return cb(err, null); }
                // const GeneralHistoryLogPayload1 = new GeneralHistoryLog({
                //   IdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                //   IdentityId: RRId,
                //   RequestBody: JSON.stringify(REQBODY),
                //   Type: "Invoice - RR - Temp 2",
                //   BaseTableRequest: JSON.stringify(objInvoice),
                //   ItemTableRequest: JSON.stringify(objInvoiceItem),
                //   BaseTableResponse: JSON.stringify(results[0]),
                //   ItemTableResponse: JSON.stringify(InvoiceRes[0]),
                //   ErrorMessage: JSON.stringify(err),
                //   CommonLogMessage: JSON.stringify(InvoiceRes[0])
                // });

                var ShippingHistoryId = results[1].id.insertId > 0 ? results[1].id.insertId : 0;
                if (IsBoolean && results[0].id > 0) {
                  var InvoiceId = results[0].id;
                  objInvoice.InvoiceId = InvoiceId;

                   var authuser_FullName = (REQBODY.authuser && REQBODY.authuser.FullName) ? REQBODY.authuser.FullName : global.authuser.FullName;

                  var NotificationObj = new NotificationModel({
                    authuser: REQBODY.authuser,
                    RRId: RRId,
                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_INVOICE,
                    NotificationIdentityId: results[0].id,
                    NotificationIdentityNo: 'INV' + results[0].id,
                    ShortDesc: 'Customer Invoice Draft Created',
                    Description: 'Customer Invoice Draft created by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
                  });

                  let date_ob = new Date();
                  date_ob.setDate(date_ob.getDate() + Constants.CONST_DUE_DAYS_INVOICE);
                  const srr = new RR({
                    authuser: REQBODY.authuser,
                    RRId: RRId,
                    CustomerInvoiceNo: 'INV' + results[0].id,
                    CustomerInvoiceDueDate: date_ob,
                    CustomerInvoiceId: results[0].id
                  });
                  var sqlUpdateCustomerSONo = RR.UpdateCustomerInvoiceNoByRRID(srr, REQBODY.TermsDays);
                  var sqlUpdateInvoiceNo = Invoice.UpdateInvoiceNoById(objInvoice);
                  var sqlUpdateInvoiceDueAutoUpdate = Invoice.UpdateInvoiceDueAutoUpdate(InvoiceId, REQBODY.TermsDays);
                  var sqlUpdatePriceinRR = RR.UpdatePriceQuery(objInvoice);

                  var RRObj = new RR({
                    authuser: REQBODY.authuser,
                    RRId: RRId,
                    Status: Constants.CONST_RRS_COMPLETED
                  });
                  var RRStatusHistoryObj = new RRStatusHistory({
                    authuser: REQBODY.authuser,
                    RRId: RRId,
                    HistoryStatus: Constants.CONST_RRS_COMPLETED
                  });
                  var CompletedNotificationObj = new NotificationModel({
                    authuser: REQBODY.authuser,
                    RRId: RRId,
                    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
                    NotificationIdentityId: RRId,
                    NotificationIdentityNo: 'RR' + RRId,
                    ShortDesc: 'RR Completed',
                    Description: 'RR Completed  by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime()
                  });
                }
                var BulkShippingLog = {};
                BulkShippingLog.BulkShipId = REQBODY.Model.BulkShipId;
                BulkShippingLog.ShippingHistoryId = ShippingHistoryId;
                BulkShippingLog.RRId = RRId;

                async.series([
                  // function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload1, result); },
                  function (result) { if (IsBoolean) { InvoiceItem.Create(InvoiceId, objInvoiceItem, result); } else { RR.emptyFunction(REQBODY, result); } },
                  function (result) { if (IsBoolean) { con.query(sqlUpdateInvoiceNo, result) } else { RR.emptyFunction(REQBODY, result); } },
                  function (result) { if (IsBoolean) { SalesOrder.UpdateIsConvertedToPOBySOId(InvoiceRes[0].SOId, result); } else { RR.emptyFunction(REQBODY, result); } },
                  function (result) { if (IsBoolean) { con.query(sqlUpdateInvoiceDueAutoUpdate, result) } else { RR.emptyFunction(REQBODY, result); } },
                  function (result) { if (IsBoolean) { con.query(sqlUpdateCustomerSONo, result) } else { RR.emptyFunction(REQBODY, result); } },
                  function (result) { if (IsBoolean) { NotificationModel.Create(NotificationObj, result); } else { RR.emptyFunction(REQBODY, result); } },
                  function (result) { if (IsBoolean) { con.query(sqlUpdatePriceinRR, result) } else { RR.emptyFunction(REQBODY, result); } },
                  function (result) { if (IsBoolean) { RR.ChangeRRStatus(RRObj, result); } else { RR.emptyFunction(REQBODY, result); } },
                  function (result) { if (IsBoolean) { RRStatusHistory.Create(RRStatusHistoryObj, result); } else { RR.emptyFunction(REQBODY, result); } },
                  function (result) { if (IsBoolean) { NotificationModel.Create(CompletedNotificationObj, result); } else { RR.emptyFunction(REQBODY, result); } },
                  function (result) { if (IsBoolean) { RR.UpdateRRCompletedDate(RRObj, result); } else { RR.emptyFunction(REQBODY, result); } },
                  function (result) { RRBulkShippingLog.Create(new RRBulkShippingLog(BulkShippingLog), result); },
                ],
                  function (err, results1) {
                    if (err) { return cb(err, null); }
                    else {
                      i = i + 1;
                      console.log(i, "record Inserted");
                      shid[i] = results[1].id;
                      if (i == REQBODY.ShippingArray.length) {
                        var filteredShid = shid.filter(function (el) {
                          return el != null;
                        });
                        return cb(null, { BulkShipId: REQBODY.Model.BulkShipId, SHID: filteredShid });
                      }
                      Recursive(i, REQBODY, shid, cb);
                    }
                  });
              });
          });
      }
    });
  // var RRId = REQBODY.ShippingArray[i].RRId;
  // RR.GetByRRId(RRId, (err, data1) => {
  //   if (err) {
  //     Reqresponse.printResponse(res, null, data1);
  //   }
  //   if (data1.length > 0 && data1[0].CustomerId > 0 && data1[0].VendorId > 0) {

  //     REQBODY.IdentityId = data1[0].CustomerId;
  //     REQBODY.IdentityType = Constants.CONST_IDENTITY_TYPE_CUSTOMER;

  //     var VendorObj = {};
  //     VendorObj.IdentityId = data1[0].VendorId;
  //     VendorObj.IdentityType = Constants.CONST_IDENTITY_TYPE_VENDOR;
  //     async.parallel([
  //       function (result) { CustomerAddress.listbyIdentity(new CustomerAddress(REQBODY), result); },
  //       function (result) { con.query(Customer.viewquery(REQBODY.IdentityId, req.body), result) },
  //       function (result) { CustomerAddress.listbyIdentity(new CustomerAddress(VendorObj), result); },
  //       function (result) { con.query(Vendor.viewquery(VendorObj.IdentityId), result) },
  //       function (result) { con.query(UsersModel.listbyuserquery(0, global.authuser.UserId), result) },
  //     ],
  //       function (err, results) {
  //         if (err) {
  //           Reqresponse.printResponse(res, err, null);
  //         }
  //         if (results[0].length > 0 && results[1][0].length > 0 && results[2].length > 0) {
  //           var Model = {};
  //           Model.RRId = REQBODY.ShippingArray[i].RRId;
  //           Model.TrackingNo = REQBODY.ShippingArray[i].TrackingNo;
  //           Model.ShipFromIdentity = REQBODY.ShipFrom == "Customer" ? 1 : 2;

  //           if (Model.ShipFromIdentity == 2) {
  //             Model.ShipFromId = results[3][0][0].VendorId;
  //             Model.ShipFromName = results[3][0][0].VendorName;
  //             Model.ShipFromAddressId = results[2][0].AddressId;
  //           }
  //           else {
  //             Model.ShipFromId = results[1][0][0].CustomerId;
  //             Model.ShipFromName = results[1][0][0].CompanyName;
  //             Model.ShipFromAddressId = results[0][0].AddressId;
  //           }
  //           Model.ShipViaId = REQBODY.ShipViaId;
  //           Model.ShipDate = cDateTime.getDate();
  //           Model.ShippedBy = results[4][0][0].FirstName + ' ' + results[4][0][0].LastName;
  //           Model.ShipComment = REQBODY.ShipComment;
  //           Model.ShipToIdentity = REQBODY.ShipTo == "Customer" ? 1 : 2;

  //           if (Model.ShipToIdentity == 1) {
  //             Model.ShipToId = results[1][0][0].CustomerId;
  //             Model.ShipToName = results[1][0][0].CompanyName;
  //             Model.ShipToAddressId = results[0][0].AddressId;
  //           }
  //           else {
  //             Model.ShipToId = results[3][0][0].VendorId;
  //             Model.ShipToName = results[3][0][0].VendorName;
  //             Model.ShipToAddressId = results[2][0].AddressId;
  //           }

  //           Model.ShowCustomerReference = REQBODY.ShowCustomerReference;
  //           Model.ShowRootCause = REQBODY.ShowRootCause;

  //           RRSH.ship(new RRSH(Model), (err, data11) => {
  //             if (err) {
  //               Reqresponse.printResponse(res, null, data11);
  //             }
  //             i = i + 1;
  //             console.log(i, "record Inserted");
  //             if (i == REQBODY.ShippingArray.length) {
  //               return cb(data11);
  //             }
  //             Recursive(i, REQBODY, cb);
  //           });
  //         }
  //       });
  //   }
  //   else {
  //     Reqresponse.printResponse(res, { msg: "Customer Not Found" }, null);
  //   }
  // });
}

exports.receive = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRSH.receive(new RRSH(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, req.body);
    });
  }
};




exports.revert = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RRSH.revert(req.body.RRId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RR Id is required" }, null);
  }
};


exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRSH.update(new RRSH(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.getAll = (req, res) => {
  RRSH.getAll(req.body.RRId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.shipViaList = (req, res) => {
  RRSH.shipViaList((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};









//Below are for MRO
exports.MROship = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRSH.MROship(new RRSH(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
exports.MROReceive = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRSH.MROReceive(new RRSH(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
exports.MRORevert = (req, res) => {
  if (req.body.hasOwnProperty('MROId')) {
    RRSH.MRORevert(req.body.MROId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "MROId is required" }, null);
  }
};


/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RR = require("../models/repair.request.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const CustomerReference = require("../models/cutomer.reference.labels.model.js");
const RRImages = require("../models/repairrequestimages.model.js");
const RRParts = require("../models/repairrequestparts.model.js");
const RRVendors = require("../models/repair.request.vendors.model.js");
const RRVendorParts = require("../models/repair.request.vendor.parts.model.js");
const Quotes = require("../models/quotes.model.js");
const RRStatusHistory = require("../models/rr.status.history.model.js");
const SalesOrder = require("../models/sales.order.model.js");
const PurchaseOrder = require("../models/purchase.order.model.js");
const InvoiceOrder = require("../models/invoice.model.js");
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");
const { request } = require("express");
var async = require('async');
const InvoiceModel = require("../models/invoice.model.js");

var cDateTime = require("../utils/generic.js");

const NotificationModel = require("../models/notification.model.js");
const { GetAddressByIdQuery } = require("../models/customeraddress.model.js");
const AddessBook = require("../models/customeraddress.model.js");
const PartsModel = require("../models/parts.model.js");
const InventoryModel = require("../models/inventory.model.js");
const RRRevertHistoryModel = require("../models/repair.request.revert.history.model.js");
const VendorInvoiceModel = require("../models/vendor.invoice.model.js");
const VendorQuote = require("../models/vendor.quote.model.js");
const SendEmailModel = require("../models/send.email.model.js");
const RRShippingHistory = require("../models/repair.request.shipping.history.model.js");
const CustomerBlanketPO = require("../models/customer.blanket.po.model.js");
const Invoice = require("../models/invoice.model.js");
const CustomerBlanketPOHistory = require("../models/customer.blanket.po.history.model.js");

const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
const RRBatch = require("../models/rr.batch.module.js");

exports.GlobalAutoSuggest = (req, res) => {
  if (req.body.hasOwnProperty('SearchText')) {
    RR.GlobalAutoSuggest(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "SearchText is required" }, null);
  }
};

exports.create = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RR.CreateRequest(req.body, (err, data) => {

      if (!data) {
        Reqresponse.printResponse(res, { msg: "There is a problem in creating a Repair Request. Pelase check the details." }, null);
        return;
      }

      req.body.RRId = data.id;
      //to create a status change model object
      var RRStatusHistoryObj = new RRStatusHistory({
        authuser: req.body.authuser,
        RRId: data.id,
        HistoryStatus: Constants.CONST_RRS_GENERATED
      });

      //To add RR created status in notification table
      var NotificationObj = new NotificationModel({
        RRId: data.id,
        authuser: req.body.authuser,
        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
        NotificationIdentityId: data.id,
        NotificationIdentityNo: 'RR' + data.id,
        ShortDesc: 'RR Created',
        Description: 'RR Created by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
      });

      var SqlBillToAddess = AddessBook.GetBillingAddressIdByCustomerId(req.body.CustomerId);
      var SqlShipToToAddess = AddessBook.GetShippingAddressIdByCustomerId(req.body.CustomerId);
      var SqlPartPriceByPartId = PartsModel.GetPONAndExchange(req.body.CustomerId, req.body.RRParts[0].PartId);
      async.parallel([
        function (result) { con.query(SqlBillToAddess, result) },
        function (result) { con.query(SqlShipToToAddess, result) },
        function (result) { con.query(SqlPartPriceByPartId, result) },
      ],
        function (err, results) {
          if (err) { Reqresponse.printResponse(res, err, null); }
          else {
            req.body.CustomerBillToId = 0; req.body.CustomerShipToId = 0; req.body.PartPON = 0;
            if (results[0][0].length > 0) {
              req.body.CustomerBillToId = results[0][0][0].AddressId;
            }
            if (results[1][0].length > 0) {
              req.body.CustomerShipToId = results[1][0][0].AddressId;
            }
            if (results[2][0].length > 0) {
              req.body.PartPON = results[2][0][0].PON;
              req.body.PartPONLocalCurrency = results[2][0][0].CustomerCurrencyCode;
              req.body.PartPONBaseCurrency = results[2][0][0].DefaultCurrency;
              req.body.BasePartPON = results[2][0][0].Price ? (results[2][0][0].PON * results[2][0][0].ExchangeRate) : null;
              req.body.PartPONExchangeRate = results[2][0][0].ExchangeRate;
            }
            var UpdateCustomerBillShipQuery = RR.UpdateCustomerBillShipQuery(req.body);
            var UpdatePartPONQuery = RR.UpdatePartPONQuery(req.body);
            async.parallel([
              function (result) { if (req.body.hasOwnProperty('CustomerReferenceList')) { CustomerReference.CreateCustomerReference(req.body, result); } else { RR.emptyFunction(RRStatusHistoryObj, result); } },
              function (result) { if (req.body.hasOwnProperty('RRImagesList')) { RRImages.CreateRRImages(req.body, result); } else { RR.emptyFunction(RRStatusHistoryObj, result); } },
              function (result) { if (req.body.hasOwnProperty('RRParts')) { RRParts.CreateRRParts(req.body.RRId, req.body.RRParts, result); } else { RR.emptyFunction(RRStatusHistoryObj, result); } },
              function (result) { RR.UpdateRRNo(data.id, result); },
              function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
              function (result) { NotificationModel.Create(NotificationObj, result); },
              function (result) { con.query(UpdateCustomerBillShipQuery, result) },
              function (result) { con.query(UpdatePartPONQuery, result) },
            ],
              function (err, results) {
                if (err)
                  Reqresponse.printResponse(res, err, null);
                else
                  Reqresponse.printResponse(res, err, { data: req.body.RRId });
              });
          }
        });
    });
  }
};


//RR Auto Create
exports.DuplicateRepairRequest = (req, res) => {

  var sqlRR = RR.viewquery(req.body.RRId, req.body);
  var sqlRRParts = RRParts.ViewRRParts(req.body.RRId);
  async.parallel([
    function (result) { con.query(sqlRR, result) },
    function (result) { con.query(sqlRRParts, result) },
  ],
    function (err, results) {
      if (err)
        Reqresponse.printResponse(res, err, null);

      //  console.log("results[0][0].length="+results[0][0].length);
      if (results[0][0].length > 0) {
        var RRData = results[0][0][0];

        //reset the data
        RRData.SerialNo = req.body.SerialNo;
        RRData.Status = Constants.CONST_RRS_GENERATED;
        RRData.VendorId = 0;
        if (results[1][0].length > 0) {
          RR.CreateRequest(RRData, (err, data) => {

            results[1][0][0].SerialNo = req.body.SerialNo;
            var RRPartsData = results[1][0];

            var RRStatusHistoryObj = new RRStatusHistory({
              authuser: req.body.authuser,
              RRId: data.id,
              HistoryStatus: Constants.CONST_RRS_GENERATED
            });

            //To add RR created status in notification table
            var NotificationObj = new NotificationModel({
              authuser: req.body.authuser,
              RRId: data.id,
              NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
              NotificationIdentityId: data.id,
              NotificationIdentityNo: 'RR' + data.id,
              ShortDesc: 'RR Created',
              Description: 'RR Created by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
            });



            async.parallel([
              function (result) { RRParts.CreateRRParts(data.id, RRPartsData, result); },
              function (result) { RR.UpdateRRNo(data.id, result); },
              function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
              function (result) { NotificationModel.Create(NotificationObj, result); }
            ],
              function (err, results) {
                if (err)
                  Reqresponse.printResponse(res, err, null);
              });
            Reqresponse.printResponse(res, err, data);

          });
        }
      } else {
        Reqresponse.printResponse(res, err, "No record for RRId = " + req.body.RRId);
      }
    });

}



exports.createFromMobApp = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    //To add the AHR-
    var PartNo = req.body.PartNo;
    var partAHRCheck = PartNo.substring(0, 4);
    if (partAHRCheck != "AHR-") {
      req.body.PartNo = "AHR-" + PartNo;
    }

    RR.CreateRequestFromMobApp(req.body, (err, data) => {

      if (!data) {
        Reqresponse.printResponse(res, { msg: "There is a problem in creating a Repair Request. Pelase check the details." }, null);
        return;
      }

      req.body.RRId = data.id;
      //to create a status change model object
      var RRStatusHistoryObj = new RRStatusHistory({
        authuser: req.body.authuser,
        RRId: data.id,
        HistoryStatus: Constants.CONST_RRS_GENERATED
      });


      //To add RR created status in notification table
      var NotificationObj = new NotificationModel({
        authuser: req.body.authuser,
        RRId: data.id,
        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
        NotificationIdentityId: data.id,
        NotificationIdentityNo: 'RR' + data.id,
        ShortDesc: 'RR Created',
        Description: 'RR Created by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
      });

      var PartId = req.body.PartId ? req.body.PartId : 0;

      var SqlBillToAddessId = AddessBook.GetBillingAddressIdByCustomerId(req.body.CustomerId);
      var SqlShipToToAddessId = AddessBook.GetShippingAddressIdByCustomerId(req.body.CustomerId);
      var SqlPartPriceByPartId = PartsModel.GetPONAndExchange(req.body.CustomerId, PartId);

      async.parallel([
        function (result) { con.query(SqlBillToAddessId, result) },
        function (result) { con.query(SqlShipToToAddessId, result) },
        function (result) { con.query(SqlPartPriceByPartId, result) },
      ],
        function (err, results) {
          if (err) { Reqresponse.printResponse(res, err, null); }
          else {
            req.body.CustomerBillToId = 0; req.body.CustomerShipToId = 0; req.body.PartPON = 0;
            if (results[0][0].length > 0) {
              req.body.CustomerBillToId = results[0][0][0].AddressId;
            }
            if (results[1][0].length > 0) {
              req.body.CustomerShipToId = results[1][0][0].AddressId;
            }
            if (results[2][0].length > 0) {
              var ER = results[2][0][0].ExchangeRate ? results[2][0][0].ExchangeRate : 1;
              req.body.PartPON = results[2][0][0].PON;
              req.body.PartPONLocalCurrency = results[2][0][0].CustomerCurrencyCode ? results[2][0][0].CustomerCurrencyCode : '-';
              req.body.PartPONBaseCurrency = results[2][0][0].DefaultCurrency ? results[2][0][0].DefaultCurrency : '-';
              req.body.BasePartPON = results[2][0][0].PON ? (results[2][0][0].PON * ER) : null;
              req.body.PartPONExchangeRate = ER;
            } else {
              req.body.PartPON = 0;
              req.body.PartPONLocalCurrency = "-";
              req.body.PartPONBaseCurrency = "-";
              req.body.BasePartPON = 0;
              req.body.PartPONExchangeRate = 1;
            }
            var UpdateCustomerBillShipQuery = RR.UpdateCustomerBillShipQuery(req.body);
            var UpdatePartPONQuery = RR.UpdatePartPONQuery(req.body);
            async.parallel([
              function (result) { if (req.body.hasOwnProperty('RRImagesList')) { RRImages.CreateRRImages(req.body, result); } else { RR.emptyFunction(RRStatusHistoryObj, result); } },
              function (result) { if (PartId > 0) { RRParts.CreateRRPartsFromMobApp(req.body, result); } else { RR.emptyFunction(RRStatusHistoryObj, result); } },
              function (result) { RR.UpdateRRNo(data.id, result); },
              function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
              function (result) { NotificationModel.Create(NotificationObj, result); },
              function (result) { con.query(UpdateCustomerBillShipQuery, result) },
              function (result) { con.query(UpdatePartPONQuery, result) },
            ],
              function (err, results) {
                if (err) {
                  Reqresponse.printResponse(res, err, null);
                } else {
                  Reqresponse.printResponse(res, null, data);
                }
              });
          }
        });
    });
  }
};


// Update RR
exports.UpdateRepairRequest = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    if (req.body.hasOwnProperty('RRId')) {

      const RRObj = new RR({
        RRId: req.body.RRId,
        Status: Constants.CONST_RRS_NEED_SOURCED
      });

      const RRObjActive = new RR({
        authuser: req.body.authuser,
        RRId: req.body.RRId,
        IsActive: req.body.IsActive || req.body.IsActive >= 0 ? req.body.IsActive : 0
      });

      var RRStatusHistoryObj = new RRStatusHistory({
        authuser: req.body.authuser,
        RRId: req.body.RRId,
        HistoryStatus: Constants.CONST_RRS_NEED_SOURCED
      });

      //To add RR created status in notification table
      var NotificationObj = new NotificationModel({
        authuser: req.body.authuser,
        RRId: req.body.RRId,
        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
        NotificationIdentityId: req.body.RRId,
        NotificationIdentityNo: 'RR' + req.body.RRId,
        ShortDesc: 'RR Verified',
        Description: 'RR Verified by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
      });
      var JsonArrayObj = [];
      JsonArrayObj.push(req.body.RRParts);

      async.parallel([
        function (result) { RR.UpdateRepairRequestByRRIdStep1(req.body, result); },
        // function (result) { RRParts.UpdateRRParts(new RRParts(req.body), result); },
        function (result) { if (req.body.hasOwnProperty('RRParts') && req.body.RRParts.RRPartsId) { RRParts.UpdateRRParts(new RRParts(req.body), result); } else { RRParts.CreateRRParts(req.body.RRId, JsonArrayObj, result); } },
        function (result) { RRImages.UpdateRRImages(req.body, result); },
        function (result) { if (req.body.hasOwnProperty('IsActive') && req.body.IsActive >= 0) { RR.ChangeRRIsActiveStatus(RRObjActive, result); } else { RR.emptyFunction(RRObjActive, result); } },
        function (result) { if (req.body.hasOwnProperty('nextstep') && req.body.nextstep == "needssourced") { RR.ChangeRRStatus(RRObj, result); } else { RR.emptyFunction(RRObj, result); } },
        function (result) { if (req.body.hasOwnProperty('nextstep') && req.body.nextstep == "needssourced") { RRStatusHistory.Create(RRStatusHistoryObj, result); } else { RR.emptyFunction(RRObj, result); } },
        function (result) { if (req.body.hasOwnProperty('nextstep') && req.body.nextstep == "needssourced") { NotificationModel.Create(NotificationObj, result); } else { RR.emptyFunction(RRObj, result); } },

        function (result) { CustomerReference.UpdateRRCusRef(req.body, result); }
      ],
        function (err, results) {
          if (err)
            Reqresponse.printResponse(res, err, null);


          // console.log("Result = " + results[3].Status);
          if (results[3].Status) {
            req.body.Status = results[3].Status;
          }

          Reqresponse.printResponse(res, err, { data: req.body });
          return;
        }
      );
    } else {
      Reqresponse.printResponse(res, { msg: "RR not found" }, null);
      return;
    }
  } else {
    Reqresponse.printResponse(res, { msg: "RR not found" }, null);
    return;
  }
};


exports.RRMobileVerify = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('RRId')) {
      const RRObj = new RR({
        RRId: req.body.RRId,
        Status: Constants.CONST_RRS_NEED_SOURCED
      });
      async.parallel([
        function (result) { RR.UpdateStatus(RRObj, result); }
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          Reqresponse.printResponse(res, null, req.body);
        });
    } else {
      Reqresponse.printResponse(res, { msg: "RR not found" }, null);
    }
  } else {
    Reqresponse.printResponse(res, { msg: "RR not found" }, null);
  }
};

// Update  RRImage
exports.UpdateRRImage = (req, res) => {
  // console.log(req.body.CustomerSONo);
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('RRId')) {
      async.parallel([
        function (result) { RRImages.UpdateRRImages(req.body, result); }
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          Reqresponse.printResponse(res, null, { data: req.body });
        }
      );
    } else {
      Reqresponse.printResponse(res, { msg: "RR not found" }, null);
    }
  } else {
    Reqresponse.printResponse(res, { msg: "RR not found" }, null);
  }
};

exports.updateRRDepartmentWarranty = (req, res) => {
  RR.updateRRDepartmentWarranty(new RR(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
}

// Update RR
exports.UpdateRepairRequestStep2 = (req, res) => {
  // console.log(req.body.CustomerSONo);
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('RRId')) {
      async.parallel([
        function (result) { RR.UpdateRepairRequestByRRIdStep2(new RR(req.body), result); },
        function (result) { RRParts.UpdateRRPartsStep2(req.body, result); },
        function (result) { RRImages.UpdateRRImages(req.body, result); },
        function (result) { CustomerReference.UpdateRRCusRef(req.body, result); },
        function (result) {
          if (req.body.hasOwnProperty('CustomerSONo') && req.body.hasOwnProperty('CustomerSODueDate') && req.body.CustomerSONo != "" && req.body.CustomerSODueDate != "" && req.body.CustomerSONo != null && req.body.CustomerSODueDate != null) {

            RR.UpdateCustomerSONoandCustomerSODueDatebyRRId(req.body, result);
          }
        },
        function (result) {
          if (req.body.hasOwnProperty('CustomerPONo') && req.body.hasOwnProperty('VendorPODueDate') && req.body.CustomerPONo != "" && req.body.VendorPODueDate != "" && req.body.CustomerPONo != null && req.body.VendorPODueDate != null) {
            RR.UpdateCustomerPONoandCustomerPODueDatebyRRId(req.body, result);
          }
        },
        function (result) {
          if (req.body.hasOwnProperty('CustomerInvoiceNo') && req.body.hasOwnProperty('CustomerInvoiceDueDate') && req.body.CustomerInvoiceNo != "" && req.body.CustomerInvoiceDueDate != "" && req.body.CustomerInvoiceNo != null && req.body.CustomerInvoiceDueDate != null) {
            RR.UpdateCustomerInvoiceNoandCustomerInvoiceDueDatebyRRId(req.body, result);
          }
        },
        function (result) {
          if (req.body.hasOwnProperty('CustomerSONo') && req.body.hasOwnProperty('CustomerSODueDate') && req.body.CustomerSONo != "" && req.body.CustomerSODueDate != "" && req.body.CustomerSONo != null && req.body.CustomerSODueDate != null) {

            SalesOrder.UpdateSONoandSODueDatebySONo(req.body, result);
          }
        },
        function (result) {
          if (req.body.hasOwnProperty('CustomerPONo') && req.body.hasOwnProperty('VendorPODueDate') && req.body.CustomerPONo != "" && req.body.VendorPODueDate != "" && req.body.CustomerPONo != null && req.body.VendorPODueDate != null) {
            PurchaseOrder.UpdatePODueDatebyPONo(req.body, result);
          }
        },
        function (result) {
          if (req.body.hasOwnProperty('CustomerInvoiceNo') && req.body.hasOwnProperty('CustomerInvoiceDueDate') && req.body.CustomerInvoiceNo != "" && req.body.CustomerInvoiceNo != null && req.body.CustomerInvoiceDueDate != "" && req.body.CustomerInvoiceDueDate != null) {
            InvoiceOrder.UpdateInvoiceDueDatebyInvoiceONo(req.body, result);
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
      Reqresponse.printResponse(res, { msg: "RR not found" }, null);
    }
  } else {
    Reqresponse.printResponse(res, { msg: "RR not found" }, null);
  }
};




exports.AssignVendor = (req, res) => {

  var sqlGetRRStatus = RR.SelectRRStatus(req.body.RRId);
  con.query(sqlGetRRStatus, (err, res1) => {
    if (err) {
      Reqresponse.printResponse(res1, err, null);
    }
    req.body.RRStatus = res1[0].Status;
    var IsDirected = RR.IsDirectedVendor(req.body.RRId, req.body.VendorId);
    con.query(IsDirected, (err1, IsDirectedres) => {
      if (err1) {
        Reqresponse.printResponse(res, err1, null);
      }
      req.body.IsDirectedRR = 0; req.body.IsDirectedVendor = 0;
      if (IsDirectedres.length > 0 && IsDirectedres[0].VendorId > 0) {
        req.body.IsDirectedRR = 1;
        req.body.IsDirectedVendor = 1;
      }
      RRParts.ViewRRPartsById(req.body, (err, data) => {
        if (err) { Reqresponse.printResponse(res, err, data); }
        if (!data) {
          Reqresponse.printResponse(res, { msg: "There is a problem in assigning a vendor." }, null);
          return;
        }
        // console.log("Assign........................................................................");

          var GlobalLocation= global.authuser.Location ? global.authuser.Location : 0;
        var LoginLocation = (req.body.authuser && req.body.authuser.Location) ? req.body.authuser.Location : GlobalLocation;
        
        var VatTaxPercentage = 0;
        if (LoginLocation == data[0].VendorLocation) {
          VatTaxPercentage = data[0].VatTaxPercentage;
        }
        var ExchangeRate = data[0].ExchangeRate
        if (data[0].VendorCurrencyCode == data[0].DefaultCurrency) {
          ExchangeRate = 1;
        }

        let VendorId = req.body.VendorId;
        // Create a new admin
        // console.log(data);
        const RRVendorsObj = new RRVendors({
          authuser: req.body.authuser,
          RRId: data[0].RRId,
          VendorId: VendorId,
          TaxPercent: 0,
          SubTotal: 0,
          GrandTotal: 0,
          LocalCurrencyCode: data[0].VendorCurrencyCode,
          ExchangeRate: ExchangeRate,
          BaseCurrencyCode: data[0].DefaultCurrency,
          BaseGrandTotal: 0,
          IsDirectedVendor: req.body.IsDirectedVendor,
          IsFlatRateRepair: data[0].IsFlatRateRepair
        });


        RRVendors.CreateRRVendors(RRVendorsObj, (err, data1) => {

          if (!data1) {
            Reqresponse.printResponse(res, { msg: "There is a problem in assigning a vendor." }, null);
            return;
          }

          req.body.RRVendorId = data1.RRVendorId;



          // Create a new admin
          const RRPartsObj = new RRVendorParts({
            authuser: req.body.authuser,
            RRVendorId: data1.RRVendorId,
            RRId: data[0].RRId,
            PartId: data[0].PartId,
            VendorId: VendorId,
            PartNo: data[0].PartNo,
            Description: data[0].Description,
            Quantity: 1,
            Rate: 0,
            Price: 0,
            Tax: 0,
            ItemTaxPercent: VatTaxPercentage,
            ItemLocalCurrencyCode: data[0].VendorCurrencyCode,
            ItemExchangeRate: ExchangeRate,
            ItemBaseCurrencyCode: data[0].DefaultCurrency,
            BasePrice: 0
          });

          const RRObj = new RR({
            RRId: data[0].RRId,
            Status: Constants.CONST_RRS_AWAIT_VQUOTE
          });

          var RRStatusHistoryObj = new RRStatusHistory({
            RRId: data[0].RRId,
            HistoryStatus: Constants.CONST_RRS_AWAIT_VQUOTE
          });
          var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;
          
          //To add RR created status in notification table
          var NotificationObj = new NotificationModel({
            authuser: req.body.authuser,
            RRId: data[0].RRId,
            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
            NotificationIdentityId: data[0].RRId,
            NotificationIdentityNo: 'RR' + data[0].RRId,
            ShortDesc: 'Vendor (' + data[0].VendorName + ') Selected',
            Description: 'Admin (' + authuser_FullName + ') selected a Vendor (' + data[0].VendorName + ') on ' + cDateTime.getDateTime()
          });
          if (req.body.RRStatus == 1) {
            NotificationObj.ShortDesc = 'RR Needs To Be Sourced';
            NotificationObj.Description = 'RR Needs To Be Sourced by Admin (' + authuser_FullName + ') on ' + cDateTime.getDateTime();
          }
          if (req.body.RRStatus == 3) {
            NotificationObj.ShortDesc = 'RR Resourced';
            NotificationObj.Description = 'RR resourced to other vendor on ' + cDateTime.getDateTime() + ' by Admin (' + authuser_FullName + ')';
          }
          async.parallel([
            function (result) { RR.UpdateVendorOfRequestByRRId(req.body, result); },
            function (result) { RRVendorParts.CreateRRVendorParts(RRPartsObj, result); },
            function (result) { RR.ChangeRRStatus(RRObj, result); },
            function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
            function (result) { NotificationModel.Create(NotificationObj, result); },
          ],
            function (err, results) {
              if (err)
                Reqresponse.printResponse(res, err, null);

              if (results[2].Status) {
                req.body.Status = results[2].Status;
              }

              Reqresponse.printResponse(res, err, { data1, ...req.body });
              return;
            });

        });
      });
    });
  });
}



exports.StatusToNeedsSourced = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {

    const RRObj = new RR({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      Status: Constants.CONST_RRS_NEED_SOURCED
    });

    var RRStatusHistoryObj = new RRStatusHistory({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      HistoryStatus: Constants.CONST_RRS_NEED_SOURCED
    });

    async.parallel([
      function (result) { RR.ChangeRRStatus(RRObj, result); },
      function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); }
    ],
      function (err, results) {
        if (err)
          Reqresponse.printResponse(res, err, null);

        Reqresponse.printResponse(res, err, { dataP: results[0][0], ...req.body });
        return;

      }
    );
  } else {
    Reqresponse.printResponse(res, { msg: "RR not found" }, null);
    return;
  }
};



exports.UpdateVendorQuote = (req, res) => {
  if (req.body.ExchangeRate == null || req.body.ExchangeRate == '' || req.body.ExchangeRate == undefined || req.body.ExchangeRate == 0) {
    Reqresponse.printResponse(res, { msg: "Exchange-rate is not available. Please contact admin!." }, null);
  } else {
    var UpdateCustomerBillShipQuery = RR.UpdateCustomerBillShipQuery(req.body);
    RRVendors.UpdateRRVendors(req.body, (err, data) => {
      con.query(UpdateCustomerBillShipQuery, (err, res) => {
      })
      for (let val of req.body.VendorPartsList) {
        if (!req.body.hasOwnProperty('RRVendorPartsId') && val.RRVendorPartsId != "" && val.RRVendorPartsId != null) {
          RRVendorParts.UpdateRRVendorPartsBySingleRecords(val, (err, data) => {
          });
        }
        else {
          val.RRId = req.body.RRId;
          val.RRVendorId = req.body.VendorsList.RRVendorId;
          val.VendorId = req.body.VendorsList.RRVendorId;
          // console.log("val.VendorId" + val.VendorId);
          RRVendorParts.CreateRRVendorParts(new RRVendorParts(val), (err, data) => {
          });
        }
      }
      var NotificationObj = new NotificationModel({
        authuser: req.body.authuser,
        RRId: req.body.RRId,
        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
        NotificationIdentityId: req.body.RRId,
        NotificationIdentityNo: 'VQ' + req.body.RRId,
        ShortDesc: 'Vendor Quote Updated',
        Description: 'Vendor Quote Updated by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
      });
      //console.log("ShortDesc" + NotificationObj.ShortDesc)
      NotificationModel.Create(NotificationObj, (err, data1) => {
      });
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.AcceptRRVendor = (req, res) => {
  RRVendors.AcceptRRVendor(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.RejectRRVendorOld = (req, res) => {
  RRVendors.RejectRRVendor(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.RejectRRVendor = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var RRStatusHistoryObj = new RRStatusHistory({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      HistoryStatus: Constants.CONST_RRS_NEED_RESOURCED
    });

    const RRObj = new RR({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      Status: Constants.CONST_RRS_NEED_RESOURCED
    });

    //To add SO in notification table
    var NotificationObj = new NotificationModel({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
      NotificationIdentityId: req.body.RRId,
      NotificationIdentityNo: 'RR' + req.body.RRId,
      ShortDesc: 'Vendor Rejected',
      Description: 'Vendor Rejected by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
    });

    req.body.Status = Constants.CONST_RRS_NEED_RESOURCED;
    async.parallel([
      function (result) { RRVendors.RejectRRVendor(req.body, result); },
      function (result) { RR.ChangeRRStatus(RRObj, result); },
      function (result) { RR.ResetRRVendor(req.body.RRId, result); },
      function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
      function (result) { NotificationModel.Create(NotificationObj, result); },
      function (result) { RR.ResetApprovedQuoteSOPOInvoice(req.body, result); },
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

exports.ResourceRR = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var sql = RR.viewquery(req.body.RRId, req.body)
    con.query(sql, (err, res1) => {
      if (err) {
        return result(err, null);
      }
      if (res1.length > 0) {
        if (res1[0].VendorId)
          req.body.VendorId = res1[0].VendorId;
      }

      var RRStatusHistoryObj = new RRStatusHistory({
        authuser: req.body.authuser,
        RRId: req.body.RRId,
        HistoryStatus: Constants.CONST_RRS_NOT_REPAIRABLE
      });

      const RRObj = new RR({
        authuser: req.body.authuser,
        RRId: req.body.RRId,
        Status: Constants.CONST_RRS_NOT_REPAIRABLE
      });

      //To add SO in notification table
      var NotificationObj = new NotificationModel({
        authuser: req.body.authuser,
        RRId: req.body.RRId,
        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
        NotificationIdentityId: req.body.RRId,
        NotificationIdentityNo: 'RR' + req.body.RRId,
        ShortDesc: 'RR Needs To Be Sourced',
        Description: 'RR Needs To Be Sourced by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
      });

      async.parallel([
        function (result) { if (Constants.CONST_RRS_NOT_REPAIRABLE != res1[0].Status) { RR.ChangeRRStatus(RRObj, result); } else { RR.emptyFunction(NotificationObj, result); } },
        function (result) { if (Constants.CONST_RRS_NOT_REPAIRABLE != res1[0].Status) { RRStatusHistory.Create(RRStatusHistoryObj, result); } else { RR.emptyFunction(NotificationObj, result); } },
        function (result) { if (Constants.CONST_RRS_NOT_REPAIRABLE != res1[0].Status) { NotificationModel.Create(NotificationObj, result); } else { RR.emptyFunction(NotificationObj, result); } },
        function (result) { if (Constants.CONST_RRS_NOT_REPAIRABLE != res1[0].Status && res1[0].VendorId > 0) { RRVendors.RRVendorNotRepairable(req.body, result); } else { RR.emptyFunction(NotificationObj, result); } },
        function (result) { if (Constants.CONST_RRS_NOT_REPAIRABLE != res1[0].Status) { RR.ResetRRVendor(req.body.RRId, result); } else { RR.emptyFunction(NotificationObj, result); } },
      ],
        function (err, results) {
          if (err) { Reqresponse.printResponse(res, err, null); }
          Reqresponse.printResponse(res, null, results[0]);
        });
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Request can not be empty" }, null);
  }
};

exports.RRNotRepairable = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var sql = RR.viewqueryshort(req.body.RRId)
    con.query(sql, (err, res1) => {
      if (err) {
        return result(err, null);
      }
      if (res1.length > 0) {
        if (res1[0].VendorId)
          req.body.VendorId = res1[0].VendorId;

        req.body.StatusBeforeNotRepairable = res1[0].StatusBeforeNotRepairable ? res1[0].StatusBeforeNotRepairable : 0;
      }

      var RRStatusHistoryObj = new RRStatusHistory({
        RRId: req.body.RRId,
        HistoryStatus: Constants.CONST_RRS_NOT_REPAIRABLE
      });

      const RRObj = new RR({
        authuser: req.body.authuser,
        RRId: req.body.RRId,
        Status: Constants.CONST_RRS_NOT_REPAIRABLE,
        RejectedStatusType: req.body.RejectedStatusType
      });

      //To add SO in notification table
      var NotificationObj = new NotificationModel({
        authuser: req.body.authuser,
        RRId: req.body.RRId,
        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
        NotificationIdentityId: req.body.RRId,
        NotificationIdentityNo: 'RR' + req.body.RRId,
        ShortDesc: 'RR Completed (Not Repairable)',
        Description: 'Admin (' + global.authuser.FullName + ') changed the status to RR Completed (Not Repairable) on ' + cDateTime.getDateTime()
      });

      async.parallel([
        function (result) { if (Constants.CONST_RRS_NOT_REPAIRABLE != res1[0].Status) { RR.ChangeRRStatus(RRObj, result); } else { RR.emptyFunction(NotificationObj, result); } },
        function (result) { if (Constants.CONST_RRS_NOT_REPAIRABLE != res1[0].Status) { RRStatusHistory.Create(RRStatusHistoryObj, result); } else { RR.emptyFunction(NotificationObj, result); } },
        function (result) { if (Constants.CONST_RRS_NOT_REPAIRABLE != res1[0].Status) { NotificationModel.Create(NotificationObj, result); } else { RR.emptyFunction(NotificationObj, result); } },
        function (result) { if (Constants.CONST_RRS_NOT_REPAIRABLE != res1[0].Status && res1[0].VendorId > 0) { RRVendors.RRVendorNotRepairable(req.body, result); } else { RR.emptyFunction(NotificationObj, result); } },
        function (result) {
          if (res1[0].CustomerBlanketPOId > 0) {
            CustomerBlanketPO.GetCurrentBalance(res1[0].CustomerBlanketPOId, result);
          }
          else { RR.emptyFunction(req.body, result); }
        },
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          if (Constants.CONST_RRS_NOT_REPAIRABLE == res1[0].Status) {
            Reqresponse.printResponse(res, { msg: "Already Updated" }, null);
          }
          else {
            req.body.QuoteId = res1[0].QuoteId > 0 ? res1[0].QuoteId : 0;
            req.body.QuoteAmount = res1[0].QuoteAmount > 0 ? res1[0].QuoteAmount : 0;
            req.body.CurrentBalance = results[4].length > 0 ? results[4][0].CurrentBalance : 0;

            if (res1[0].CustomerBlanketPOId > 0) {
              var _CustomerBlanketPOId = res1[0].CustomerBlanketPOId > 0 ? res1[0].CustomerBlanketPOId : 0;
              var RefundHistoryObj = new CustomerBlanketPOHistory({
                authuser: req.body.authuser,
                BlanketPOId: _CustomerBlanketPOId,
                RRId: req.body.RRId,
                MROId: 0,
                PaymentType: 1,
                Amount: parseFloat(req.body.QuoteAmount),
                CurrentBalance: parseFloat(req.body.CurrentBalance) + parseFloat(req.body.QuoteAmount),
                QuoteId: req.body.QuoteId,
                Comments: req.body.Comments,
                LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                BaseAmount: parseFloat(req.body.QuoteAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                BaseCurrentBalance: (parseFloat(req.body.CurrentBalance) + parseFloat(req.body.QuoteAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
              });
              async.parallel([
                function (result) { CustomerBlanketPOHistory.Create(RefundHistoryObj, result); },
                function (result) { CustomerBlanketPO.Refund(_CustomerBlanketPOId, req.body.QuoteAmount, result); },
              ],
                function (err, results) {
                  if (err) {
                    Reqresponse.printResponse(res, err, null);
                  }
                });
            }
            Reqresponse.printResponse(res, null, req.body);
          }
        });
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Request can not be empty" }, null);
  }
};

exports.RemoveRRVendor = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var RRStatusHistoryObj = new RRStatusHistory({
      RRId: req.body.RRId,
      HistoryStatus: Constants.CONST_RRS_NEED_SOURCED
    });

    const RRObj = new RR({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      Status: Constants.CONST_RRS_NEED_SOURCED
    });

    req.body.Status = Constants.CONST_RRS_NEED_SOURCED;

    //To add SO in notification table
    var NotificationObj = new NotificationModel({
      authuser: req.body.authuser,
      RRId: req.body.RRId,
      NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
      NotificationIdentityId: req.body.RRId,
      NotificationIdentityNo: 'RR' + req.body.RRId,
      ShortDesc: 'Vendor Removed',
      Description: 'Vendor Removed by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
    });

    async.parallel([
      function (result) { RRVendors.RemoveRRVendor(req.body, result); },
      function (result) { RR.ChangeRRStatus(RRObj, result); },
      function (result) { RR.ResetRRVendor(req.body.RRId, result); },
      function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
      function (result) { NotificationModel.Create(NotificationObj, result); }
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




exports.DeleteRR = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RR.DeleteRR(req.body.RRId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.complete = (req, res) => {
  RR.complete(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


exports.findOne = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RR.findById(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RR Id is required" }, null);
  }
};

exports.GetRRInfoAndRRShippingHistory = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RR.GetRRInfoAndRRShippingHistory(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RR Id is required" }, null);
  }
};

exports.SearchListForBulkShipping = (req, res) => {
  RR.SearchListForBulkShipping(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.RRViewMobile = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RR.RRViewMobile(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RR Id is required" }, null);
  }
};


exports.findDuplicateOrWarranty = (req, res) => {
  if (req.body.hasOwnProperty('PartNo') && req.body.hasOwnProperty('SerialNo')) {
    RR.findDuplicateOrWarranty(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Part No and Serial No is required" }, null);
  }
};



exports.DeleteVendorPartsByRRVendorPartId = (req, res) => {
  if (req.body.hasOwnProperty('RRVendorPartsId')) {

    async.parallel([
      function (result) { RRVendorParts.DeleteRRVendorPartsByRRVendorPartsId(req.body.RRVendorPartsId, result); },
      function (result) { RRVendorParts.SelectVendorsCalculationByDelete(req.body.RRVendorPartsId, result); },
    ],
      function (err, results) {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        }
        RRVendors.UpdateCalculationByDelete({ res: results[1] }, (err, data) => {
        });
        Reqresponse.printResponse(res, null, { ress: results[1] });
      }
    );

    // RRVendorParts.DeleteRRVendorPartsByRRVendorPartsId(req.body.RRVendorPartsId, (err, data) => {       
    //   Reqresponse.printResponse(res, err,data); 
    // });  
  }
};

// To Get Packing Slip
exports.PackingSlip = (req, res) => {
  if (req.body.hasOwnProperty('RRId') && req.body.hasOwnProperty('ShippingHistoryId')) {
    RR.PackingSlip(req.body.RRId, req.body.ShippingHistoryId, req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRId Or ShippingHistoryId is required" }, null);
  }
};

exports.BulkShipPackingSlip = (req, res) => {
  if (req.body.hasOwnProperty('BulkShipId')) {
    RR.BulkShipPackingSlip(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Id is required" }, null);
  }
};

//To get loggedInStatusBarChart
exports.loggedInStatusBarChart = (req, res) => {
  if (req.body.hasOwnProperty('FromDate') && req.body.hasOwnProperty('ToDate')) {
    RR.loggedInStatusBarChart(new RR(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "FromDate or ToDate is required" }, null);
  }
};

//To DashboardStatisticsCount
exports.DashboardStatisticsCount = (req, res) => {
  if (req.body.hasOwnProperty('FromDate') && req.body.hasOwnProperty('ToDate')) {
    async.parallel([
      function (result) { RR.DashboardStatisticsCount(new RR(req.body), result); },
      function (result) { RR.SubmittedCount(new RR(req.body), result); },
    ],
      function (err, results) {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        }
        // Reqresponse.printResponse(res, null, null);
        Reqresponse.printResponse(res, null, { ExceptSubmittedCount: results[0][0] ? results[0][0] : null, SubmittedCount: results[1][0] ? results[1][0] : null });

      });
  } else {
    Reqresponse.printResponse(res, { msg: "FromDate or ToDate is required" }, null);
  }
};
// Get get RushandWarrantyList Of RR
exports.getRushandWarrantyListOfRR = (req, res) => {
  RR.getRushandWarrantyListOfRR(new RR(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To get loggedInStatusByDate
exports.loggedInStatusByDate = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('Date')) {
      var Sourced = RR.loggedInStatusByDate(req.body.Date, 2);
      var Quoted = RR.loggedInStatusByDate(req.body.Date, 4);
      var Approved = RR.loggedInStatusByDate(req.body.Date, 5);
      var Completed = RR.loggedInStatusByDate(req.body.Date, 7);
      async.parallel([
        function (result) { con.query(Sourced, result) },
        function (result) { con.query(Quoted, result) },
        function (result) { con.query(Approved, result) },
        function (result) { con.query(Completed, result) },
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          // Reqresponse.printResponse(res, null, null);
          Reqresponse.printResponse(res, null, { Sourced: results[0][0], Quoted: results[1][0], Approved: results[2][0], Completed: results[3][0] });
        });
    } else {
      Reqresponse.printResponse(res, { msg: "Date is required" }, null);
    }
  }
  else {
    Reqresponse.printResponse(res, { msg: "Request can not be empty" }, null);
  }
};


exports.ChartStatusByDate = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('Date')) {
      VendorId = '';

      var TokenIdentityId = getLogInIdentityId(req.body);
      var TokenIdentityType = getLogInIdentityType(req.body);
      if (TokenIdentityType == Constants.CONST_IDENTITY_TYPE_VENDOR) {
        VendorId = " and VendorId =  " + TokenIdentityId
      }
      var Sourced = RR.DashboardChartRRGeneratedStatusByDate(req.body, 2, VendorId);
      var Quoted = RR.DashboardChartRRGeneratedStatusByDate(req.body, 4, VendorId);
      var Approved = RR.DashboardChartRRGeneratedStatusByDate(req.body, 5, VendorId);
      var Completed = RR.DashboardChartRRGeneratedStatusByDate(req.body, 7, VendorId);
      async.parallel([
        function (result) { con.query(Sourced, result) },
        function (result) { con.query(Quoted, result) },
        function (result) { con.query(Approved, result) },
        function (result) { con.query(Completed, result) },
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          // Reqresponse.printResponse(res, null, null);
          Reqresponse.printResponse(res, null, { Sourced: results[0] ? results[0][0] : null, Quoted: results[1][0] ? results[1] : null, Approved: results[2] ? results[2][0] : null, Completed: results[3] ? results[3][0] : null });
        });
    } else {
      Reqresponse.printResponse(res, { msg: "Date is required" }, null);
    }
  }
  else {
    Reqresponse.printResponse(res, { msg: "Request can not be empty" }, null);
  };
}
///To StatusReport
exports.StatusReport = (req, res) => {
  RR.StatusReport(new RR(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// exports.FailureTrendAnalysisReportBySupplier = (req, res) => {
//   RR.FailureTrendAnalysisReportBySupplier(new RR(req.body), (err, data) => {
//     Reqresponse.printResponse(res, err, data);
//   });
// };

// exports.FailureTrendAnalysisReportByPart = (req, res) => {
//   RR.FailureTrendAnalysisReportByPart(new RR(req.body), (err, data) => {
//     Reqresponse.printResponse(res, err, data);
//   });
// };

//To FailureTrendAnalysisReport
exports.FailureTrendAnalysisReport = (req, res) => {

  var Query = RR.FailureTrendAnalysisReportBySupplier(new RR(req.body));
  var QueryArray = RR.FailureTrendAnalysisReportByPart(new RR(req.body));
  async.parallel([
    function (result) { con.query(Query, result) },
    function (result) { con.query(QueryArray[0].Query, result) },
    function (result) { con.query(QueryArray[0].CountQuery, result) },
    function (result) { con.query(QueryArray[0].TotalCountQuery, result) },
  ],
    function (err, results) {
      if (err) { Reqresponse.printResponse(res, err, null); }
      Reqresponse.printResponse(res, null, {
        Supplier: results[0][0], Part: results[1][0], recordsFiltered: results[2][0][0].recordsFiltered,
        recordsTotal: results[3][0][0].TotalCount, draw: req.body.draw
      });
    });
};
//
exports.UpdatePartCurrentLocation = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RR.UpdatePartCurrentLocation(new RR(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, req.body);
    });
  }
};


exports.RRNoAotoSuggest = (req, res) => {
  if (req.body.hasOwnProperty('RRNo')) {
    RR.RRNoAotoSuggest(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRNo is required" }, null);
  }
};

exports.UpdatePON = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RR.UpdatePON(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRId is required" }, null);
  }
};

exports.ActiveInActiveRR = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RR.ActiveInActiveRR(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRId is required" }, null);
  }
};



exports.VendorPOAutoSuggest = (req, res) => {
  if (req.body.hasOwnProperty('VendorPONo')) {
    RR.VendorPOAutoSuggest(req.body.VendorPONo, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "VendorPONo is required" }, null);
  }
};

exports.CustomerPOAutoSuggest = (req, res) => {
  if (req.body.hasOwnProperty('CustomerPONo')) {
    RR.CustomerPOAutoSuggest(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "CustomerPONo is required" }, null);
  }
};

exports.SONoAutoSuggest = (req, res) => {
  if (req.body.hasOwnProperty('CustomerSONo')) {
    RR.SONoAutoSuggest(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "CustomerSONo is required" }, null);
  }
};


//To RepairAndSavingsReport
exports.RepairAndSavingsReport = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var FailedPartByStatusChart = RR.FailedPartByStatusChart(new RR(req.body));
    var CostSavingsChart = RR.CostSavingsChart(new RR(req.body));
    var sql = RR.YearlySummary(new RR(req.body));
    var TotalRepairSpendChart = RR.TotalRepairSpendChart(new RR(req.body));
    async.parallel([
      function (result) { RR.FailedPartByStatus(new RR(req.body), result); },
      function (result) { con.query(FailedPartByStatusChart, result) },
      function (result) { RR.CostSavingsByCategory(new RR(req.body), result); },
      function (result) { con.query(CostSavingsChart, result) },
      function (result) { con.query(sql, result) },
      function (result) { RR.AverageTurnAroundTime(new RR(req.body), result); },
      function (result) { RR.SourceRatio(new RR(req.body), result); },
      function (result) { con.query(TotalRepairSpendChart, result) },
    ],
      function (err, results) {
        if (err) { Reqresponse.printResponse(res, err, null); }
        Reqresponse.printResponse(res, null, {
          FailedPartByStatus: results[0][0], FailedPartByStatusChart: results[1][0], CostSavingsByCategory: results[2][0],
          CostSavingsChart: results[3][0], YearlySummary: results[4][0], AverageTurnAroundTime: results[5][0], SourceRatio: results[6][0], TotalRepairSpendChart: results[7][0]
        });
      });
  }
};
//
exports.CreateInventoryFromRR = (req, res) => {
  InventoryModel.CreateInventory(new InventoryModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
//
exports.RevertRR = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    var IsExistCSV = RR.IsExistCSV(req.body.RRId);
    con.query(IsExistCSV, (err, data3) => {
      if (err) {
        Reqresponse.printResponse(res, err, null);
      }
      if (data3.length >= 0) {
        if (data3[0].InvoiceIsCSVProcessed > 0 || data3[0].VendorInvoiceIsCSVProcessed > 0 || data3[0].InvoiceStatus == Constants.CONST_INV_STATUS_APPROVED || data3[0].vendorBillStatus == Constants.CONST_VENDOR_INV_STATUS_APPROVED)
          Reqresponse.printResponse(res, { msg: "Vendor bill or Invoice is approved / processed. Please contact admin to revert the status" }, null);
      }
      var sqlRRStatus = RR.SelectRRStatus(req.body.RRId);
      con.query(sqlRRStatus, (err, Objres) => {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        }
        if (Objres.length <= 0) {
          Reqresponse.printResponse(res, { msg: "RR Not found" }, null);
        }

        var FromStatus = Objres[0].Status;
        var ToStatus = 0;
        if (FromStatus == Constants.CONST_RRS_COMPLETED)//7
          ToStatus = Constants.CONST_RRS_IN_PROGRESS;//5
        else if (FromStatus == Constants.CONST_RRS_IN_PROGRESS)//5
          ToStatus = Constants.CONST_RRS_QUOTE_SUBMITTED;//4
        else if (FromStatus == Constants.CONST_RRS_QUOTE_SUBMITTED)//4
          ToStatus = Constants.CONST_RRS_AWAIT_VQUOTE;//2
        else if (FromStatus == Constants.CONST_RRS_AWAIT_VQUOTE)//2
          ToStatus = Constants.CONST_RRS_NEED_SOURCED;//1
        else if (FromStatus == Constants.CONST_RRS_NEED_SOURCED)//1
          ToStatus = Constants.CONST_RRS_GENERATED;//0
        else if (FromStatus == Constants.CONST_RRS_QUOTE_REJECTED)//6
          ToStatus = Constants.CONST_RRS_QUOTE_SUBMITTED;//4
        else if (FromStatus == Constants.CONST_RRS_NOT_REPAIRABLE)//6
          ToStatus = data3[0].HistoryStatus;
        else
          Reqresponse.printResponse(res, { msg: "Not reverted" }, null);


        req.body.Status = ToStatus;

        // console.log("req.body.Status=" + req.body.Status);
        var RRStatusHistoryObj = new RRStatusHistory({
          authuser: req.body.authuser,
          RRId: req.body.RRId,
          HistoryStatus: ToStatus
        });

        var RRRevertHistoryObj = new RRRevertHistoryModel({
          authuser: req.body.authuser,
          IdentityType: Constants.CONST_IDENTITY_TYPE_RR,
          IdentityId: req.body.RRId,
          FromStatus: FromStatus,
          ToStatus: ToStatus,
          Comments: req.body.Comments
        });
        var sqlUpdateRRStatusInRevert = RR.UpdateRRStatusInRevert(new RR(req.body));

        req.body.CustomerId = data3[0].CustomerId;
        req.body.StatusBeforeNotRepairable = data3[0].HistoryStatus;
        req.body.RRVendorId = data3[0].RRVendorId;
        req.body.VendorId = data3[0].VendorId;

        async.parallel([
          function (result) { con.query(Quotes.GetRRVendor(req.body.RRId), result) },
          function (result) { RRRevertHistoryModel.create(RRRevertHistoryObj, result); },
          function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
          function (result) { con.query(sqlUpdateRRStatusInRevert, result) },

          function (result) {
            if (Constants.CONST_RRS_COMPLETED == FromStatus && Constants.CONST_RRS_IN_PROGRESS == ToStatus) {
              con.query(InvoiceModel.DeleteInvoiceQuery(req.body.RRId));
            }
            else { RR.emptyFunction(req.body, result); }
          },

          function (result) {
            if (Constants.CONST_RRS_COMPLETED == FromStatus && Constants.CONST_RRS_IN_PROGRESS == ToStatus) {
              con.query(RR.ResetInvoiceDetailInRR(req.body.RRId), result);
            }
            else { RR.emptyFunction(req.body, result); }
          },

          function (result) {
            if (Constants.CONST_RRS_COMPLETED == FromStatus && Constants.CONST_RRS_IN_PROGRESS == ToStatus) {
              RRShippingHistory.RevertShippingCompletedToProgress(req.body, result);
            }
            else { RR.emptyFunction(req.body, result); }
          },

          function (result) {
            if (Constants.CONST_RRS_NOT_REPAIRABLE == FromStatus) {
              RRVendors.RRVendorNotRepairableRevert(req.body, result);
            }
            else { RR.emptyFunction(req.body, result); }
          },

          function (result) {
            if (Constants.CONST_RRS_IN_PROGRESS == FromStatus && Constants.CONST_RRS_QUOTE_SUBMITTED == ToStatus) {
              con.query(Quotes.UpdateAcceptedQuotedToSubmitted(req.body.RRId));
              // con.query(Quotes.UpdateQuotedToDraft(req.body.RRId));
              con.query(RR.ResetCustomerPONobyRRId(req.body.RRId));
              con.query(SalesOrder.DeleteSalesOrderQuery(req.body.RRId));
              con.query(RR.ResetSODetailInRR(req.body.RRId));
              con.query(PurchaseOrder.DeletePurchaseOrderQuery(req.body.RRId));
              con.query(RR.ResetPODetailInRR(req.body.RRId));
              con.query(InvoiceModel.DeleteInvoiceQuery(req.body.RRId));
              con.query(RR.ResetInvoiceDetailInRR(req.body.RRId));
              con.query(VendorInvoiceModel.DeleteVendorInvoiceQuery(req.body.RRId));
              con.query(RR.ResetVendorInvoiceDetailInRR(req.body.RRId), result);
            }
            else { RR.emptyFunction(req.body, result); }
          },
          function (result) {
            if (Constants.CONST_RRS_QUOTE_SUBMITTED == FromStatus && Constants.CONST_RRS_AWAIT_VQUOTE == ToStatus) {
              con.query(Quotes.DeleteQuotesQuery(req.body.RRId));
              con.query(VendorQuote.DeleteVendorQuoteQuery(req.body.RRId), result);
            }
            else { RR.emptyFunction(req.body, result); }
          },

          function (result) {
            if (Constants.CONST_RRS_AWAIT_VQUOTE == FromStatus && Constants.CONST_RRS_NEED_SOURCED == ToStatus) {
              con.query(RRVendors.DeleteRRVendorQuery(req.body.RRId));
              con.query(RRVendorParts.DeleteRRVendorPartsQuery(req.body.RRId), result);
            }
            else { RR.emptyFunction(req.body, result); }
          },
          function (result) {
            if (Constants.CONST_RRS_QUOTE_REJECTED == FromStatus && Constants.CONST_RRS_QUOTE_SUBMITTED == ToStatus) {
              con.query(Quotes.UpdateRejectToSubmitted(req.body.RRId), result);
            }
            else { RR.emptyFunction(req.body, result); }
          },
          function (result) {
            if (Objres[0].CustomerBlanketPOId > 0) {
              CustomerBlanketPO.GetCurrentBalance(Objres[0].CustomerBlanketPOId, result);
            }
            else { RR.emptyFunction(req.body, result); }
          },
        ],
          function (err, results) {
            if (err) { Reqresponse.printResponse(res, err, null); }
            else {
              var sqlEmail = RRRevertHistoryModel.GetEmailContentForRevert(req.body.RRId);
              con.query(sqlEmail, (err, Objres1) => {
                if (err) {
                  Reqresponse.printResponse(res, err, null);
                }
                if (Objres1.length <= 0) {
                  Reqresponse.printResponse(res, { msg: "RR Not found" }, null);
                } else {
                  var EMailObj = {
                    from: Objres1[0].RevertNotificationEmail,
                    to: Objres1[0].Email,
                    cc: Objres1[0].AppCCEmail,
                    subject: Objres1[0].Subject,
                    text: Objres1[0].Content,
                  };
                  // console.log("" + EMailObj.from);
                  //console.log("" + EMailObj.subject);
                  //console.log("" + EMailObj.text);
                  //console.log("" + EMailObj.to);

                  if (results[0][0].length > 0)
                    var RRVendorId = results[0][0][0].RRVendorId;

                  req.body.QuoteId = Objres[0].QuoteId > 0 ? Objres[0].QuoteId : 0;
                  req.body.QuoteAmount = Objres[0].QuoteAmount > 0 ? Objres[0].QuoteAmount : 0;
                  req.body.CurrentBalance = results[10].length > 0 ? results[10][0].CurrentBalance : 0;

                  var _CustomerBlanketPOId = Objres[0].CustomerBlanketPOId > 0 ? Objres[0].CustomerBlanketPOId : 0;
                  var RefundHistoryObj = new CustomerBlanketPOHistory({
                    authuser: req.body.authuser,
                    BlanketPOId: _CustomerBlanketPOId,
                    RRId: req.body.RRId,
                    MROId: 0,
                    PaymentType: 1,
                    Amount: parseFloat(req.body.QuoteAmount),
                    CurrentBalance: parseFloat(req.body.CurrentBalance) + parseFloat(req.body.QuoteAmount),
                    QuoteId: req.body.QuoteId,
                    Comments: req.body.Comments,
                    LocalCurrencyCode: req.body.LocalCurrencyCode ? req.body.LocalCurrencyCode : 'USD',
                    ExchangeRate: req.body.ExchangeRate ? req.body.ExchangeRate : 1,
                    BaseCurrencyCode: req.body.BaseCurrencyCode ? req.body.BaseCurrencyCode : 'USD',
                    BaseAmount: parseFloat(req.body.QuoteAmount) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1),
                    BaseCurrentBalance: (parseFloat(req.body.CurrentBalance) + parseFloat(req.body.QuoteAmount)) * parseFloat(req.body.ExchangeRate ? req.body.ExchangeRate : 1)
                  });
                  async.parallel([
                    function (result) { SendEmailModel.SendRevertEmail(new SendEmailModel(EMailObj), result); },
                    function (result) {
                      if (Constants.CONST_RRS_QUOTE_REJECTED == FromStatus && Constants.CONST_RRS_QUOTE_SUBMITTED == ToStatus) {
                        Quotes.ResetRRVendorToApproved(RRVendorId, result);
                      }
                      else { RR.emptyFunction(req.body, result); }
                    },
                    function (result) {
                      if (Constants.CONST_RRS_IN_PROGRESS == FromStatus && Constants.CONST_RRS_QUOTE_SUBMITTED == ToStatus && _CustomerBlanketPOId > 0) {
                        CustomerBlanketPOHistory.Create(RefundHistoryObj, result);
                      }
                      else { RR.emptyFunction(req.body, result); }
                    },
                    function (result) {
                      if (Constants.CONST_RRS_IN_PROGRESS == FromStatus && Constants.CONST_RRS_QUOTE_SUBMITTED == ToStatus && _CustomerBlanketPOId > 0) {
                        CustomerBlanketPO.Refund(_CustomerBlanketPOId, req.body.QuoteAmount, result);
                      }
                      else { RR.emptyFunction(req.body, result); }
                    },
                  ],
                    function (err, results) {
                      if (err) {
                        Reqresponse.printResponse(res, err, null);
                      }
                      else { Reqresponse.printResponse(res, null, { data: results[0] }); }
                    });
                }

              });
            }
          });
      });
    });
  }
};

//
exports.UpdateCustomerPO = (req, res) => {

  if (req.body.hasOwnProperty("CustomerPONo") == true && req.body.CustomerPONo != '') {
    async.parallel([
      function (result) {
        if (req.body.hasOwnProperty('RRId') == true && req.body.RRId > 0) { con.query(RR.SaveCustomerPoNo(new RR(req.body)), result); }
        else { RR.emptyFunction(req.body, result); }
      },
      function (result) {
        if (req.body.hasOwnProperty('SOId') == true && req.body.SOId > 0) { con.query(SalesOrder.SaveCustomerPoNo(new SalesOrder(req.body)), result); }
        else { RR.emptyFunction(req.body, result); }
      },
      function (result) {
        if (req.body.hasOwnProperty('InvoiceId') == true && req.body.InvoiceId > 0) { con.query(InvoiceModel.SaveCustomerPoNo(new InvoiceModel(req.body)), result); }
        else { RR.emptyFunction(req.body, result); }
      },

    ],
      function (err, results) {
        if (err) { Reqresponse.printResponse(res, err, null); }
        Reqresponse.printResponse(res, null, req.body);
      });
  } else {
    Reqresponse.printResponse(res, { msg: "CustomerPONo is required" }, null);
  }
};



exports.RRDeleteBulk = (req, res) => {
  var RRJSON = req.body.RRIds.split(',');
  results = [];
  RRDeleteBulkRecursive(0, RRJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });

};

function RRDeleteBulkRecursive(i, RRJSON, cb) {
  RR.DeleteRR(RRJSON[i], (err, data) => {
    i = i + 1;
   // console.log(i, "record deleted ", RRJSON[(i - 1)]);
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }
    if (i == RRJSON.length) {
      return cb(results);
    }
    RRDeleteBulkRecursive(i, RRJSON, cb);
  });
}

exports.AHNewDashboardStatisticsCount = (req, res) => {
  if (req.body.hasOwnProperty("CustomerId")) {
    async.parallel([
      function (result) { RR.AHNewDashboardStatistics(new RR(req.body), result); },
      function (result) { RR.AHNewDashboardStatusHistoryCount(1, 2, 4, 5, 7, new RR(req.body), result); },
      function (result) { RR.AHNewDashboardStatusHistoryCount(2, 7, 13, 14, 30, new RR(req.body), result); },
      function (result) { RR.AHNewDashboardStatusHistoryCount(4, 7, 13, 14, 30, new RR(req.body), result); },
      function (result) { RR.AHNewDashboardStatusHistoryCount(5, 7, 13, 14, 30, new RR(req.body), result); },
      function (result) { RR.AHNewDashboardStatusHistoryCount(8, 7, 13, 14, 30, new RR(req.body), result); },
    ],
      function (err, results) {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        }
        Reqresponse.printResponse(res, null, {
          StatusCount: results[0][0] ? results[0][0] : null,
          AwaitingVendorSelection: results[1][0] ? results[1][0] : null,
          AwaitingVendorQuote: results[2][0] ? results[2][0] : null,
          QuotedToCustomer: results[3][0] ? results[3][0] : null,
          RepairInProgress: results[4][0] ? results[4][0] : null,
          ApprovedButNotRepairable: results[5][0] ? results[5][0] : null,
        });
      });
  } else {
    Reqresponse.printResponse(res, { msg: "CustomerId is required" }, null);
  }
};

exports.UpdateRRSubStatus = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RR.UpdateRRSubStatus(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRId is required" }, null);
  }
};

exports.UpdateRRAssignee = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RR.UpdateRRAssignee(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRId is required" }, null);
  }
};

exports.UpdateRRPartsLocation = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RR.UpdateRRPartsLocation(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRId is required" }, null);
  }
};

exports.WorkchainBulkUpdate = (req, res) => {
  if (req.body.hasOwnProperty('RRIds')) {
    RR.WorkchainBulkUpdate(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRId is required" }, null);
  }
};

exports.WorkchainMyTaskChart = (req, res) => {
  RR.WorkchainMyTaskChart(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.WorkchainMyTaskCount = (req, res) => {
  RR.WorkchainMyTaskCount(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.createBatch = (req, res) => {
  var arrayRRId = [];
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var payload = {
      CustomerId: req.body.CustomerId
    };
    RRBatch.Create(payload, (Batcherr, Batchdata) => {
      // console.log(Batchdata);
      var itemProcessed = 0;
      req.body.RepairPartsList.forEach(element => {
        element.CustomerId = req.body.CustomerId;
        element.CompanyName = req.body.CompanyName;
        element.ContactEmail = req.body.ContactEmail;
        element.ContactPhone = req.body.ContactPhone;
        element.UserId = req.body.UserId;
        element.RRBatchId = Batchdata.id;
        // console.log(element);
        RR.CreateRequest(element, (err, data) => {
          if (!data) {
            Reqresponse.printResponse(res, { msg: "There is a problem in creating a Repair Request. Pelase check the details." }, null);
            return;
          }

          req.body.RRId = element.RRId = data.id;
          //to create a status change model object
          var RRStatusHistoryObj = new RRStatusHistory({
            authuser: req.body.authuser,
            RRId: data.id,
            HistoryStatus: Constants.CONST_RRS_GENERATED
          });

          //To add RR created status in notification table
          var NotificationObj = new NotificationModel({
            RRId: data.id,
            authuser: req.body.authuser,
            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
            NotificationIdentityId: data.id,
            NotificationIdentityNo: 'RR' + data.id,
            ShortDesc: 'RR Created',
            Description: 'RR Created by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
          });

          var SqlBillToAddess = AddessBook.GetBillingAddressIdByCustomerId(element.CustomerId);
          var SqlShipToToAddess = AddessBook.GetShippingAddressIdByCustomerId(element.CustomerId);
          var SqlPartPriceByPartId = PartsModel.GetPONAndExchange(element.CustomerId, element.PartId);
          async.parallel([
            function (result) { con.query(SqlBillToAddess, result) },
            function (result) { con.query(SqlShipToToAddess, result) },
            function (result) { con.query(SqlPartPriceByPartId, result) },
          ],
            function (err, results) {
              if (err) { Reqresponse.printResponse(res, err, null); }
              else {
                element.CustomerBillToId = 0; element.CustomerShipToId = 0; element.PartPON = 0;
                if (results[0][0].length > 0) {
                  element.CustomerBillToId = results[0][0][0].AddressId;
                }
                if (results[1][0].length > 0) {
                  element.CustomerShipToId = results[1][0][0].AddressId;
                }
                if (results[2][0].length > 0) {
                  element.PartPON = results[2][0][0].PON;
                  element.PartPONLocalCurrency = results[2][0][0].CustomerCurrencyCode;
                  element.PartPONBaseCurrency = results[2][0][0].DefaultCurrency;
                  element.BasePartPON = results[2][0][0].Price ? (results[2][0][0].PON * results[2][0][0].ExchangeRate) : null;
                  element.PartPONExchangeRate = results[2][0][0].ExchangeRate;
                }
                var UpdateCustomerBillShipQuery = RR.UpdateCustomerBillShipQuery(element);
                var UpdatePartPONQuery = RR.UpdatePartPONQuery(element);
                async.parallel([
                  function (result) { if (element.hasOwnProperty('CustomerReferenceList')) { CustomerReference.CreateCustomerReference(element, result); } else { RR.emptyFunction(RRStatusHistoryObj, result); } },
                  function (result) { if (element.hasOwnProperty('RRImagesList')) { RRImages.CreateRRImages(element, result); } else { RR.emptyFunction(RRStatusHistoryObj, result); } },
                  function (result) { if (element.hasOwnProperty('RRParts')) { RRParts.CreateRRParts(element.RRId, element.RRParts, result); } else { RR.emptyFunction(RRStatusHistoryObj, result); } },
                  function (result) { RR.UpdateRRNo(data.id, result); },
                  function (result) { RRStatusHistory.Create(RRStatusHistoryObj, result); },
                  function (result) { NotificationModel.Create(NotificationObj, result); },
                  function (result) { con.query(UpdateCustomerBillShipQuery, result) },
                  function (result) { con.query(UpdatePartPONQuery, result) },
                ],
                  function (err, results) {
                    itemProcessed++;
                    if (err) {
                      Reqresponse.printResponse(res, err, null);
                    } else {
                      arrayRRId.push(element.RRId);
                      console.log(itemProcessed + "===" + req.body.RepairPartsList.length);
                      if (itemProcessed === req.body.RepairPartsList.length) {
                        Reqresponse.printResponse(res, err, { data: arrayRRId });
                      }
                    }
                  });
              }
            });
        });
      });
    });
  }
};


exports.unlockCustomerShipAddress = (req, res) => {
  if (req.body.hasOwnProperty('QuoteId')) {
    RR.unlockCustomerShipAddress(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "QuoteId is required" }, null);
  }
};

exports.unlockVendorShipAddress = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RR.unlockVendorShipAddress(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRId is required" }, null);
  }
};

exports.getAllAutoComplete = (req, res) => {
  RR.getAllAutoComplete(req.body.RRNo, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.updateRFIDTagNo = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    if (req.body.hasOwnProperty('RFIDTagNo')) {
      RR.updateRFIDTagNo(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
      });
    }
    else {
      Reqresponse.printResponse(res, { msg: "RFID Tag No is required" }, null);
    }
  } else {
    Reqresponse.printResponse(res, { msg: "RRId is required" }, null);
  }
};


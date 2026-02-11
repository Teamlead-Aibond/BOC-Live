/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const VendorModel = require("../models/vendor.model.js");
const VendorInvoiceModel = require("../models/vendor.invoice.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const RR = require("../models/repair.request.model.js");
const POModel = require("../models/purchase.order.model.js");
const UserModel = require("../models/users.model.js");
const RRVendorPartsModel = require("../models/repair.request.vendor.parts.model.js");
const RRVendorsModel = require("../models/repair.request.vendors.model.js");
const UsersModel = require("../models/users.model.js");
const con = require("../helper/db.js");
var async = require('async');
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
//To list all the vendor RR list
exports.VendorRRListByServerSide = (req, res) => {
  req.body.VendorId = 0;
  RR.VendorRRListByServerSide(new RR(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To fetch the vendor PO List
exports.VendorPOListByServerSide = (req, res) => {
  req.body.VendorId = getLogInIdentityId(req.body);
  POModel.getPurchaseListByServerSide(new POModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To view the loggedin vendor info
exports.findOne = (req, res) => {
  var VendorId = getLogInIdentityId(req.body);
  VendorModel.findById(VendorId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To view the RR
exports.RRView = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RR.RRViewVendorPortal(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRId is required" }, null);
  }
};

//To update the loggedin vendor info
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    VendorModel.updateById(new VendorModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

// Find a single user user with a user_id
exports.Vendorlogin = (req, res) => {
  //To validate the request body
  var validReq = Reqresponse.validateReqBody(req, res);
  if (validReq) {
    if (req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password')) {
      UserModel.Vendorlogin(req.body.username, req.body.password, (err, data) => {
        Reqresponse.printResponse(res, err, data);
      });
    } else {
      Reqresponse.printResponse(res, { msg: "username or password required" }, null);
    }
  }
};

//Get PurchaseOrder By VendorId
exports.PurchaseOrderByVendorId = (req, res) => {
  var IdentityType = 2;// from Vendor
  POModel.findById(req.body.POId, IdentityType, 0, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To view a VendorInvoice
exports.VendorInvoiceByVendorId = (req, res) => {
  if (req.body.hasOwnProperty('VendorInvoiceId')) {
    var IdentityType = 2;// from Vendor
    VendorInvoiceModel.findById(req.body.VendorInvoiceId, IdentityType, 0, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "VendorInvoice Id is required" }, null);
  }
};

// Update Vendor Quote
exports.UpdateVendorQuote = (req, res) => {
  var validReq = Reqresponse.validateReqBody(req, res);
  if (validReq) {
    var UpdateCustomerBillShipQuery = RR.UpdateCustomerBillShipQuery(req.body);
    RRVendorsModel.UpdateRRVendors(req.body, (err, data) => {
      con.query(UpdateCustomerBillShipQuery, (err, res) => {
      })
      for (let val of req.body.VendorPartsList) {
        if (!req.body.hasOwnProperty('RRVendorPartsId') && val.RRVendorPartsId != "" && val.RRVendorPartsId != null) {
          RRVendorPartsModel.UpdateRRVendorPartsBySingleRecords(val, (err, data) => {
          });
        }
        else {
          val.RRId = req.body.RRId;
          val.RRVendorId = req.body.VendorsList.RRVendorId;
          val.VendorId = req.body.VendorsList.RRVendorId;
          RRVendorPartsModel.CreateRRVendorParts(new RRVendorPartsModel(val), (err, data) => {
          });
        }
      }
      Reqresponse.printResponse(res, err, data);
    });
  }
};

// Get VendorInvoice server side list
exports.getVendorInvListByServerSide = (req, res) => {
  var validReq = Reqresponse.validateReqBody(req, res);
  if (validReq) {
    req.body.VendorId = getLogInIdentityId(req.body);
    VendorInvoiceModel.getVendorInvListByServerSide(new VendorInvoiceModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

// To changePassword
exports.changePassword = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('UserId') && req.body.hasOwnProperty('CurrentPassword') && req.body.hasOwnProperty('NewPassword')) {
      UsersModel.changePassword(req.body.UserId, req.body.CurrentPassword, req.body.NewPassword, (err, data) => {
        Reqresponse.printResponse(res, err, data);
      });
    } else {
      Reqresponse.printResponse(res, { msg: "User Id or CurrentPassword or NewPassword is required" }, null);
    }
  }
};

// Get get RushandWarrantyList Of RR by VendorId
exports.getRushandWarrantyListOfRRByVendorId = (req, res) => {
  req.body.VendorId = getLogInIdentityId(req.body);
  RR.getRushandWarrantyListOfRR(new RR(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// Get getDue List Of Vendor Invoice By VendorId
exports.getDueListOfVendorInvoiceByVendorId = (req, res) => {
  req.body.VendorId = getLogInIdentityId(req.body);
  VendorInvoiceModel.getDueListOfVendorInvoice(new VendorInvoiceModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// Get getDue List Of Vendor Invoice By VendorId
exports.getVendorPortalDashboardPODue = (req, res) => {
  req.body.VendorId = getLogInIdentityId(req.body);
  POModel.getVendorPortalDashboardPODue(new POModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To VendorDashboardStatisticsCount
exports.VendorDashboardStatisticsCount = (req, res) => {
  if (req.body.hasOwnProperty('FromDate') && req.body.hasOwnProperty('ToDate')) {
    req.body.VendorId = getLogInIdentityId(req.body);
    async.parallel([
      function (result) { RR.DashboardStatisticsCount(new RR(req.body), result); },
      // function (result) {  RR.SubmittedCount(req.body,result); }, 
    ],
      function (err, results) {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        }
        Reqresponse.printResponse(res, null, { ExceptSubmittedCount: results[0][0] });
      });
  } else {
    Reqresponse.printResponse(res, { msg: "FromDate or ToDate is required" }, null);
  }
};

//To get Vendor loggedInStatusBarChart
exports.VendorloggedInStatusBarChart = (req, res) => {
  if (req.body.hasOwnProperty('FromDate') && req.body.hasOwnProperty('ToDate')) {
    req.body.VendorId = getLogInIdentityId(req.body);
    RR.loggedInStatusBarChart(new RR(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "FromDate or ToDate is required" }, null);
  }
};
//
exports.VendorStatisticsRRList = (req, res) => {
  var validReq = Reqresponse.validateReqBody(req, res);
  if (validReq) {
    req.body.VendorId = getLogInIdentityId(req.body);
    // RR.GetRRIdInVendorDashboard(new RR(req.body), (err, data) => {
    //   if (err) {
    //     Reqresponse.printResponse(res, err, null);
    //   }
    req.body.RRIds = -1;
    // if (data.length > 0 && data[0].RRIds != null) {
    //   req.body.RRIds = data[0].RRIds;
    //   console.log("req.body.RRIds=" + req.body.RRIds)
    // }
    RR.VendorRRListByServerSide(new RR(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
    //});
  }
};
//
exports.login = (req, res) => {
  var validReq = Reqresponse.validateReqBody(req, res);
  var loc = req.body.location ? req.body.location : 0;
  if (validReq) {
    //console.log("VPortal");
    if (req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password')) {
      UsersModel.login(req.body.username, req.body.password, '', loc, (err, data) => {
        Reqresponse.printResponse(res, err, data);
      });
    } else {
      Reqresponse.printResponse(res, { msg: "user name or Password is required" }, null);
    }
  }
};
exports.RRNoAutoSuggest = (req, res) => {
  if (req.body.hasOwnProperty('RRNo')) {
    RR.RRNoAotoSuggest(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRNo is required" }, null);
  }
};

exports.RRViewVendorApp = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    req.body.VendorId = getLogInIdentityId(req.body);
    RR.RRViewMobileVendor(req.body, req.body.VendorId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RR Id is required" }, null);
  }
};

/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CustomersModel = require("../models/customers.model.js");
const RRModel = require("../models/repair.request.model.js");
const SOModel = require("../models/sales.order.model.js");
const UserModel = require("../models/users.model.js");
const InvoiceModel = require("../models/invoice.model.js");
const UsersModel = require("../models/users.model.js");
const QuotesModel = require("../models/quotes.model.js");
const RRSHModel = require("../models/repair.request.shipping.history.model.js");
const NotificationModel = require("../models/notification.model.js");
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const Reqresponse = require("../helper/request.response.validation.js");
const CustomerBlanketPOModel = require("../models/customer.blanket.po.model.js");
const CustomerBlanketPOTopUpModel = require("../models/customer.blanket.po.topup.model.js");
const RRWarranty = require("../models/repair.request.warranty.model.js");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
exports.WarrantyCreate = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRWarranty.create(new RRWarranty(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.WarrantyView = (req, res) => {
  if (req.body.hasOwnProperty('WarrantyId')) {
    RRWarranty.findById(req.body.WarrantyId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Warranty Id is required" }, null);
  }
};

//To List the customer RR list with filter
exports.CustomerRRListByServerSide = (req, res) => {
  req.body.RRIds = -1;
  RRModel.CustomerRRListByServerSide(new RRModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.BlanketPOListByCustomerId = (req, res) => {
  var CustomerId = getLogInIdentityId(req.body);
  CustomerBlanketPOModel.BlanketPOListByCustomerId(CustomerId, req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To List the customer Quote list with filter
exports.QuoteList = (req, res) => {
  req.body.from = getLogInIdentityType(req.body);
  QuotesModel.getQuoteListByServerSide(new QuotesModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To List the customer Quote list with filter
exports.QuoteView = (req, res) => {
  if (req.body.hasOwnProperty('QuoteId')) {
    QuotesModel.findById(req.body.QuoteId, 0, req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Quote Id is required" }, null);
  }
};



//To view the RR
exports.RRView = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RRModel.RRViewCustomerPortal(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "RRId is required" }, null);
  }
};


//To List the customer SO list with filter
exports.CustomerSOListByServerSide = (req, res) => {
  req.body.CustomerId = getLogInMultipleAccessIdentityIds(req.body);
  SOModel.getSaleListByServerSide(new SOModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// Customer Invoice List By ServerSide
exports.CustomerInvoiceListByServerSide = (req, res) => {
  req.body.CustomerId = getLogInMultipleAccessIdentityIds(req.body);
  InvoiceModel.getInvoiceListByServerSide(new InvoiceModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To View the customer profile
exports.findOne = (req, res) => {
  var CustomerId = getLogInIdentityId(req.body);
  CustomersModel.findById(CustomerId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To update the customer profile
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    async.parallel([
      function (result) { CustomersModel.updateById(new CustomersModel(req.body), result); },
    ],
      function (err, results) {
        if (err)
          return result(err, null);
        Reqresponse.printResponse(res, err, { data: results[0] });
      }
    );
  }
};

// Find a single user user with a user_id
exports.Customerlogin = (req, res) => {
  var validReq = Reqresponse.validateReqBody(req, res);
  if (validReq) {
    if (req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password')) {
      UserModel.Customerlogin(req.body.username, req.body.password, (err, data) => {
        Reqresponse.printResponse(res, err, data);
      });
    } else {
      Reqresponse.printResponse(res, { msg: "username or password required" }, null);
    }
  }
};

//To View SO
exports.SOViewByCustomerId = (req, res) => {
  var IdentityType = 1;// from Customerlogin
  SOModel.findById(req.body.SOId, IdentityType, 0, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


//To View Invoice
exports.InvoiceViewByCustomerId = (req, res) => {
  // console.log(req.body);
  var IdentityType = 1;// from Customerlogin
  InvoiceModel.findById(req.body.InvoiceId, IdentityType, 0, req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
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

// Get get Rushand Warranty List Of RR by CustomerId
exports.getRushandWarrantyListOfRRByCustomerId = (req, res) => {
  req.body.CustomerId = getLogInMultipleAccessIdentityIds(req.body);
  RRModel.getRushandWarrantyListOfRR(new RRModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// Get getDue List Of Invoice By CustomerId
exports.getDueListOfInvoiceByCustomerId = (req, res) => {
  req.body.CustomerId = getLogInMultipleAccessIdentityIds(req.body);
  InvoiceModel.getDueListOfInvoice(new InvoiceModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To get Customer loggedIn Status Bar Chart
exports.CustomerloggedInStatusBarChart = (req, res) => {
  if (req.body.hasOwnProperty('FromDate') && req.body.hasOwnProperty('ToDate')) {
    req.body.CustomerId = getLogInMultipleAccessIdentityIds(req.body);
    RRModel.loggedInStatusBarChart(new RRModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "FromDate or ToDate is required" }, null);
  }
};

//To Customer Dashboard Statistics Count
exports.CustomerDashboardStatisticsCount = (req, res) => {
  if (req.body.hasOwnProperty('FromDate') && req.body.hasOwnProperty('ToDate')) {
    //req.body.CustomerId = global.authuser.MultipleAccessIdentityIds;
    async.parallel([
      function (result) { RRModel.DashboardStatisticsCount(new RRModel(req.body), result); },
      function (result) { RRModel.SubmittedCount(new RRModel(req.body), result); },
    ],
      function (err, results) {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        }
        results[0][0].RRReceived = results[0][0].LoggedIn + results[0][0].RRGenerated;
        results[0][0].RRUnderEvaluation = results[0][0].Sourced + results[0][0].Resourced;
        results[0][0].RRWaitingForCustomerApproval = results[0][0].Quoted;
        results[0][0].RepairInProgress = results[0][0].Approved;
        results[0][0].RRRejected = results[0][0].NotRepairable;
        ['LoggedIn', 'Sourced', 'Quoted', 'Approved', 'NotRepairable', 'Resourced'].forEach(key => delete results[0][0][key]);
        Reqresponse.printResponse(res, null, { ExceptSubmittedCount: results[0][0], SubmittedCount: results[1][0] });
      });
  } else {
    Reqresponse.printResponse(res, { msg: "FromDate or ToDate is required" }, null);
  }
};
//
exports.CustomerStatisticsRRList = (req, res) => {
  var validReq = Reqresponse.validateReqBody(req, res);
  if (validReq) {
    req.body.RRIds = -1;
    RRModel.CustomerRRListByServerSide(new RRModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
//
exports.CustomerDropDownListForDashboard = (req, res) => {
  RRModel.CustomerDropDownListForDashboard(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });

};
exports.CustomerNameAutoSuggest = (req, res) => {
  if (req.body.hasOwnProperty('CompanyName')) {
    RRModel.CustomerNameAutoSuggest(req.body.CompanyName,req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "CompanyName is required" }, null);
  }
};
exports.TrackingNumber = (req, res) => {
  if (req.body.hasOwnProperty('TrackingNo')) {
    RRSHModel.TrackingNumber(req.body.TrackingNo, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "TrackingNo is required" }, null);
  }
};

exports.RejectCustomerQuoteFromCustomerPortal = (req, res) => {
  RRModel.RejectCustomerQuoteFromCustomerPortal(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
//
exports.ApproveCustomerQuote = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {

    var SQL = RRModel.IsExistCustomerIdAgainstCusPortal(req.body, req.body.QuoteId);
    con.query(SQL, (err, Objres) => {
      if (err) {
        Reqresponse.printResponse(res, err, null);
      }
      if (Objres.length <= 0) {
        Reqresponse.printResponse(res, { msg: "Invalid Quote Approve" }, null);
      }
      req.body.Status = Constants.CONST_RRS_IN_PROGRESS;
      req.body.QuoteCustomerStatus = Constants.CONST_CUSTOMER_QUOTE_ACCEPTED;


      var QuoteObj = new QuotesModel({
        authuser: req.body.authuser,
        RRId: req.body.RRId,
        QuoteId: req.body.QuoteId,
        Status: Constants.CONST_QUOTE_STATUS_APPROVED,
        QuoteCustomerStatus: Constants.CONST_CUSTOMER_QUOTE_ACCEPTED
      });
      var QuoteObjQuoted = new QuotesModel({
        authuser: req.body.authuser,
        RRId: req.body.RRId,
        QuoteId: req.body.QuoteId,
        Status: Constants.CONST_QUOTE_STATUS_QUOTED
      });
      //To add a quote to notification table
      var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;
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
      RRModel.CheckCustomerPONoExistForRRId(req.body, (err, data) => {
        var Exist = 0;
        if (data.length > 0) {
          Exist = 1;
        }
        async.parallel([
          function (result) { QuotesModel.UpdateQuotesStatus(QuoteObj, result); },
          function (result) { QuotesModel.UpdateQuotesStatusToQuoted(QuoteObjQuoted, result); },
          function (result) { QuotesModel.ChangeRRStatusWithPo(req.body, result); },
          function (result) { NotificationModel.Create(NotificationObj, result); },
          function (result) { if (Exist == 0) { NotificationModel.Create(NotificationObjForCustomerPO, result); } else { RRModel.emptyFunction(NotificationObjForCustomerPO, result); } },
          function (result) { QuotesModel.UpdateQuoteApprovedDate(QuoteObjQuoted, result); },
        ],
          function (err, results) {
            if (err) {
              Reqresponse.printResponse(res, err, null);
            }
            Reqresponse.printResponse(res, null, { data: results[0], ...req.body });
          });
      });
    });

  }
  else {
    Reqresponse.printResponse(res, { msg: "RR not found" }, null);
  }
};

exports.ListBlanketByCustomer = (req, res) => {
  req.body.RRIds = -1;
  CustomerBlanketPOModel.Report1List(new CustomerBlanketPOModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.ListPOUsage = (req, res) => {
  req.body.RRIds = -1;
  SOModel.BlanketSOList(new SOModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.ListPOTopUpHistory = (req, res) => {
  req.body.RRIds = -1;
  CustomerBlanketPOTopUpModel.ListTopUpByPO(req.body.CustomerBlanketPOId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.ViewBlanketPOByCustomer = (req, res) => {
  CustomerBlanketPOModel.View(req, req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

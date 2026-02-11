/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const ConsolidateModel = require("../models/consolidate.model.js");
const ConsolidateDetailModel = require("../models/consolidate.detail.model");
const Invoice = require("../models/invoice.model");
const Reqresponse = require("../helper/request.response.validation.js");
var async = require('async');
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");
//To create
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var allowNextStep = ConsolidateModel.checkAllowInsert(req.body.ConsolidateDetail);
    // console.log(allowNextStep);
    if (allowNextStep.status) {
      ConsolidateModel.create(new ConsolidateModel(req.body), (err, data) => {
        if (err) { Reqresponse.printResponse(res, err, null); } else {
          // console.log(data);
          if (data && data.id) {
            const objCInvoice = new ConsolidateModel({
              ConsolidateInvoiceId: data.id,
            });
            var sqlUpdateCInvoiceNo = ConsolidateModel.UpdateCInvoiceNoById(objCInvoice);
            async.parallel([
              function (result) { if (req.body.hasOwnProperty('ConsolidateDetail')) ConsolidateDetailModel.create(objCInvoice.ConsolidateInvoiceId, req.body.ConsolidateDetail, result); },
              function (result) { con.query(sqlUpdateCInvoiceNo, result) },
            ],
              function (err, results) {
                if (err) { Reqresponse.printResponse(res, err, null); }
                var payload = {
                  ConsolidateInvoiceId: data.id,
                };
                ConsolidateModel.findById(payload, (err, data) => {
                  Reqresponse.printResponse(res, err, data);
                });
              });
          } else {
            Reqresponse.printResponse(res, { message: "Something went wrong!" }, null);
          }
        }

      });
    } else {
      Reqresponse.printResponse(res, { message: allowNextStep.message }, null);
    }
  }
};

//To update
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var allowNextStep = ConsolidateModel.checkAllowInsert(req.body.ConsolidateDetail);
    if (allowNextStep.status) {
      async.parallel([
        function (result) { ConsolidateModel.update(new ConsolidateModel(req.body), result) },
        function (result) { if (req.body.hasOwnProperty('ConsolidateDetail')) ConsolidateDetailModel.update(req.body, result); },
      ],
        function (err, results) {
          if (err) { Reqresponse.printResponse(res, err, null); }
          // Reqresponse.printResponse(res, err, results);
          var payload = {
            ConsolidateInvoiceId: req.body.ConsolidateInvoiceId,
          };
          ConsolidateModel.findById(payload, (err, data) => {
            Reqresponse.printResponse(res, err, data);
          });
        });
    } else {
      Reqresponse.printResponse(res, { message: allowNextStep.message }, null);
    }
  }
};

// 
exports.getInvoiceListByServerSide = (req, res) => {
  ConsolidateModel.getInvoiceSearchListByServerSide(new Invoice(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To List 
exports.getList = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    ConsolidateModel.list(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

// To search list
exports.getSearchList = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    ConsolidateModel.getInvoiceSearchListByServerSide(new Invoice(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To view
exports.view = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    ConsolidateModel.findById(new ConsolidateModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
    // async.parallel([
    //   function (result) { ConsolidateModel.view(new ConsolidateModel(req.body), result) },
    //   function (result) { ConsolidateDetailModel.view(req.body, result); },
    //   function (result) { ConsolidateDetailModel.viewSum(req.body, result); },
    // ],
    //   function (err, results) {
    //     if (err) { Reqresponse.printResponse(res, err, null); }
    //     var combineList= Object.assign(results[0][0], results[2][0]);
    //     var data = {
    //       Consolidate: combineList, ConsolidateDetail: results[1]
    //     }
    //     Reqresponse.printResponse(res, err, data);
    //   });
  }
};

//To delete
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('ConsolidateInvoiceId')) {
    ConsolidateModel.remove(req.body.ConsolidateInvoiceId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Consolidate Invoice Id is required" }, null);
  }
};

exports.deleteDetail = (req, res) => {
  if (req.body.hasOwnProperty('ConsolidateInvoiceDetailId')) {
    ConsolidateDetailModel.remove(req.body.ConsolidateInvoiceDetailId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Consolidate Invoice Detail Id is required" }, null);
  }
};
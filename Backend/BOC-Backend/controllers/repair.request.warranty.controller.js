/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RRWarranty = require("../models/repair.request.warranty.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRWarranty.create(new RRWarranty(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRWarranty.update(new RRWarranty(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.findOne = (req, res) => {
  if (req.body.hasOwnProperty('WarrantyId')) {
    RRWarranty.findById(req.body.WarrantyId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Warranty Id is required" }, null);
  }
};

exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('WarrantyId')) {
    RRWarranty.remove(req.body.WarrantyId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Warranty Id is required" }, null);
  }
};

exports.WarrantyList = (req, res) => {
  RRWarranty.WarrantyListServerSide(new RRWarranty(req.body),(err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};  
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RRCReference = require("../models/repair.request.customer.reference.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRCReference.CreateCustomerReference(req.body.RRId, new RRCReference(req.body.CustomerReference), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.update = (req, res) => {

  // Validate Request
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRCReference.Update(req.body.RRId, new RRCReference(req.body.CustomerReference), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};



//MRO Section
exports.MROcreate = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRCReference.CreateMROCustomerReference(req.body.MROId, new RRCReference(req.body.CustomerReference), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
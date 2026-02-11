/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RRCustomerAttachment = require("../models/repair.request.customer.attachment.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRCustomerAttachment.create(new RRCustomerAttachment(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.list = (req, res) => {
  RRCustomerAttachment.getAll((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.view = (req, res) => {
  RRCustomerAttachment.findById(req.body.RRCustomerAttachmentId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRCustomerAttachment.Update(new RRCustomerAttachment(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.delete = (req, res) => {
  RRCustomerAttachment.delete(req.body.RRCustomerAttachmentId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
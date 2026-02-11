/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CReferenceLabel = require("../models/cutomer.reference.labels.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

//To get al the customer reference list
exports.getAll = (req, res) => {
  if (req.body.hasOwnProperty('CustomerId')) {
    CReferenceLabel.getAll(req.body.CustomerId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Customer Id is required" }, null);
  }
};

//To create a customer reference labels
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    CReferenceLabel.create(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To find the customer reference
exports.findOne = (req, res) => {
  if (req.body.hasOwnProperty('CReferenceId')) {
    CReferenceLabel.findById(req.body.CReferenceId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Reference Id is required" }, null);
  }
};


exports.updateDisplayInQR = (req, res) => {
  if (req.body.hasOwnProperty('CReferenceId')) {
    CReferenceLabel.updateDisplayInQR(req.body.CReferenceId, req.body.IsDisplayOnQRCode, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Reference Id is required" }, null);
  }
};


exports.updateEditableByCustomer = (req, res) => {
  if (req.body.hasOwnProperty('CReferenceId')) {
    CReferenceLabel.updateEditableByCustomer(req.body.CReferenceId, req.body.IsEditableByCustomer, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Reference Id is required" }, null);
  }
};



//To update the reference labels
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    CReferenceLabel.updateById(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To delete the customer reference labels
exports.deleteRRCusRef = (req, res) => {
  CReferenceLabel.Delete(new CReferenceLabel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To delete the reference labels
exports.delete = (req, res) => {
  CReferenceLabel.remove(req.body.CReferenceId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//
exports.UpdateCustomerRefRank = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    CReferenceLabel.UpdateCustomerRefRank(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
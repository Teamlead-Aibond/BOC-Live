/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RRImages = require("../models/repairrequestimages.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRImages.CreateRRImages(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.delete = (req, res) => {
  RRImages.Delete(req.body.RRImageId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.SetAsPrimary = (req, res) => {
  RRImages.SetAsPrimary(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};




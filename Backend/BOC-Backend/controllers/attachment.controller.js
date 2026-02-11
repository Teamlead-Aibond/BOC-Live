/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CVAttachmentModel = require("../models/attachment.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

//To create a attachment
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    CVAttachmentModel.Create(new CVAttachmentModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To update  a attachment 
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    CVAttachmentModel.updateById(new CVAttachmentModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To delete the attachment
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('AttachmentId')) {
    CVAttachmentModel.remove(req.body.AttachmentId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Attachment Id is required" }, null);
  }
};
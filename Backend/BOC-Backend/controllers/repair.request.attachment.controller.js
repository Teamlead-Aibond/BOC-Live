/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RRAttachment=require("../models/repair.request.attachment.model.js");
const Reqresponse = require("../helper/request.response.validation.js");


exports.create=(req,res)=>
{ 
      var boolean= Reqresponse.validateReqBody(req,res);
      if(boolean)
      {
        RRAttachment.create(new RRAttachment(req.body), (err, data) => {
        Reqresponse.printResponse(res, err,data); 
      });
      }
};

exports.getAll = (req, res) => {
    RRAttachment.getAll((err, data) => {
    Reqresponse.printResponse(res, err,data); 
  });
};

//
exports.findOne = (req, res) => {
    RRAttachment.findById(req.body.AttachmentId, (err, data) => {
    Reqresponse.printResponse(res, err,data); 
});
};


exports.update = (req, res) => {

  // Validate Request
  var boolean= Reqresponse.validateReqBody(req,res);
 if(boolean)
 {
    RRAttachment.updateById(new RRAttachment(req.body),(err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
 }
};

exports.delete = (req, res) => {
    RRAttachment.remove(req.body.AttachmentId, (err, data) => {
    Reqresponse.printResponse(res, err,data); 
  });
};
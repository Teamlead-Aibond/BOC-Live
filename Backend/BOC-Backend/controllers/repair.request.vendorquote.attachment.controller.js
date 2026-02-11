
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */const RRVendorQuoteAttachment=require("../models/repair.request.vendorquote.attachment.model.js");
const Reqresponse = require("../helper/request.response.validation.js");


exports.create=(req,res)=>
{ 
      var boolean= Reqresponse.validateReqBody(req,res);
      if(boolean)
      {
        RRVendorQuoteAttachment.create(new RRVendorQuoteAttachment(req.body), (err, data) => {
        Reqresponse.printResponse(res, err,data); 
      });
      }
};

exports.getAll = (req, res) => {
    RRVendorQuoteAttachment.getAll(req.body, (err, data) => {
    Reqresponse.printResponse(res, err,data); 
  });
};

//
exports.findOne = (req, res) => {
    RRVendorQuoteAttachment.findById(req.body.VQAttachmentId, (err, data) => {
    Reqresponse.printResponse(res, err,data); 
});
};


exports.update = (req, res) => {

  // Validate Request
  var boolean= Reqresponse.validateReqBody(req,res);
 if(boolean)
 {
    RRVendorQuoteAttachment.updateById(new RRVendorQuoteAttachment(req.body),(err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
 }
};

exports.feedbackUpdate = (req, res) => {
  // Validate Request
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRVendorQuoteAttachment.feedbackUpdateById(new RRVendorQuoteAttachment(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.notesUpdate = (req, res) => {
  // Validate Request
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRVendorQuoteAttachment.notesUpdateById(new RRVendorQuoteAttachment(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.updateBulkPrice = (req, res) => {
  // Validate Request
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRVendorQuoteAttachment.updateBulkPrice(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};


exports.updateByIdOverall = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRVendorQuoteAttachment.updateByIdOverall(new RRVendorQuoteAttachment(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.delete = (req, res) => {
    RRVendorQuoteAttachment.remove(req.body.VQAttachmentId, (err, data) => {
    Reqresponse.printResponse(res, err,data); 
  });
};

exports.getRRVendors = (req, res) => {
  if (req.body.hasOwnProperty('RRId')) {
    RRVendorQuoteAttachment.getRRVendors(req.body.RRId, (err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  } else{
    Reqresponse.printResponse(res, { msg: "RR Id is required" }, null);
  }
};
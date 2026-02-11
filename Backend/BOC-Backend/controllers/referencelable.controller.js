/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const ReferenceLable=require("../models/referencelable.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

exports.create=(req,res)=>
{ 
      var boolean= Reqresponse.validateReqBody(req,res);
      if(boolean)
      {
        ReferenceLable.create(new ReferenceLable(req.body), (err, data) => {
        Reqresponse.printResponse(res, err,data); 
      });
      }
};

exports.getAll = (req, res) => {
    ReferenceLable.getAll((err, data) => {
    Reqresponse.printResponse(res, err,data); 
  });
};

//
exports.findOne = (req, res) => {
    ReferenceLable.findById(req.body.ReferenceId, (err, data) => {
    Reqresponse.printResponse(res, err,data); 
});
};


exports.update = (req, res) => {

  // Validate Request
  var boolean= Reqresponse.validateReqBody(req,res);
 if(boolean)
 {
    ReferenceLable.updateById(new ReferenceLable(req.body),(err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
 }
};

exports.delete = (req, res) => {
    ReferenceLable.remove(req.body.ReferenceId, (err, data) => {
    Reqresponse.printResponse(res, err,data); 
  });
};
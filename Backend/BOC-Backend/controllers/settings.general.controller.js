/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const SettingsGeneralModel = require("../models/settings.general.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
  
//To update Settings General 
exports.update = (req, res) => {
  var boolean= Reqresponse.validateReqBody(req,res);
  if(boolean) {
    SettingsGeneralModel.updateById(req.body,(err, data) => {
    Reqresponse.printResponse(res, err,data); 
    });
  } 
};
//To view 
exports.findById = (req,res)=>{
  // if(req.body.hasOwnProperty('SettingsId')) { 
    SettingsGeneralModel.findById(req.body,(err,data)=>{
    Reqresponse.printResponse(res, err,data);  
    });
  // }else {
  //   Reqresponse.printResponse(res,{msg:"Settings Id is required"},null);    
  // }
};    

exports.GetRFIDConfig = (req,res)=>{
    SettingsGeneralModel.GetRFIDConfig(req.body,(err,data)=>{
    Reqresponse.printResponse(res, err,data);  
    });
};    
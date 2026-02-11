/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const DepartmentModel=require("../models/department.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const cDateTime = require("../utils/generic.js");

//To create a department
exports.create=(req,res)=> { 
  const newDepartment = new DepartmentModel({
      DepartmentCode : req.body.DepartmentCode,
      DepartmentName : req.body.DepartmentName,
      Created : cDateTime.getDateTime(),
      CreatedBy : req.body.CreatedBy,
      Status : req.body.Status,
      IsDeleted : req.body.IsDeleted});    
  var boolean= Reqresponse.validateReqBody(req,res);
  if(boolean)
  {
    DepartmentModel.create(newDepartment, (err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  }
};

//To list all the department
exports.getAll = (req, res) => {
  DepartmentModel.getAll((err, data) => {
    Reqresponse.printResponse(res, err,data); 
  });
};

//To view the department
exports.findOne = (req, res) => {
  if(req.body.hasOwnProperty('DepartmentId')) { 
    DepartmentModel.findById(req.body.DepartmentId, (err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  }else {
    ReqRes.printResponse(res,{msg:"Department Id is required"},null);    
  }
};

//To update the department
exports.update = (req, res) => {
  var boolean= Reqresponse.validateReqBody(req,res);
  if(boolean)
  {
    DepartmentModel.updateById(new DepartmentModel(req.body),(err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  }
};

//To delete the department
exports.delete = (req, res) => {
  if(req.body.hasOwnProperty('DepartmentId')) { 
    DepartmentModel.remove(req.body.DepartmentId, (err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  }else {
    ReqRes.printResponse(res,{msg:"Department Id is required"},null);    
  }
};

/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */const Role=require("../models/role.model.js");
const ReqRes = require("../helper/request.response.validation.js"); 


exports.GetAllRoles = (req, res) => {
    Role.GetAllRoles((err, data) => {
        ReqRes.printResponse(res, err,data); 
  });
};

exports.Create=(req,res)=>
{ 
var boolean= ReqRes.validateReqBody(req,res);
if(boolean)
{
   Role.IsExistRoleName(new Role(req.body), (err,data1) => {   
   if(data1.length==0)
    {
      Role.create(new Role(req.body), (err, data) => {
      ReqRes.printResponse(res, err,data); 
     });
    }
  else{
      ReqRes.printResponse(res,{msg:"Role Name is Aleady Exist"},null);      
      }
    });
}   
};

exports.Update=(req,res)=>
{ 
      var boolean= ReqRes.validateReqBody(req,res);
      if(boolean)
      {
      Role.IsExistRoleName(new Role(req.body), (err,data1) => {   
      if(data1.length==0)
      {
        Role.update(new Role(req.body), (err, data) => {
        ReqRes.printResponse(res, err,data); 
      });
      }
      else{
      ReqRes.printResponse(res,{msg:"Role Name is Aleady Exist"},null);      
      }
      });
      }
};

exports.Remove=(req,res)=>
{ 
      var boolean= ReqRes.validateReqBody(req,res);
      if(boolean)
      {
        Role.Remove(new Role(req.body), (err, data) => {
            ReqRes.printResponse(res, err,data); 
      });
      }
};

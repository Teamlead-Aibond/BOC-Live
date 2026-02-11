/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const UserCustomerModel=require("../models/users.customers.model.js");
const ReqResponse = require("../helper/request.response.validation.js"); 

// Retrive all User Customer 
exports.getAll = (req,res)=>{
    UserCustomerModel.getAll((err,data)=>{    
        ReqResponse.printResponse(res,err,data);  
    });
};

//To create a User Customer
exports.create=(req,res)=>
{ 
    var boolean= ReqResponse.validateReqBody(req,res);
    if(boolean)
    {
        UserCustomerModel.create(new UserCustomerModel(req.body), (err, data) => {
            ReqResponse.printResponse(res, err,data); 
        });
    }
};

//To delete  a User Customer
exports.delete = (req, res) => {
    if(req.body.hasOwnProperty('UserCustomerId')) {
    UserCustomerModel.remove(req.body.UserCustomerId, (err, data) => {
        ReqResponse.printResponse(res, err,data); 
    });
    }else {
    ReqResponse.printResponse(res,{msg:"UserCustomer Id is required"},null);  
   } 
};

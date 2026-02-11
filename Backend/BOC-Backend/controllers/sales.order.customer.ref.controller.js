/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const SalesOrderCustomerRef=require("../models/sales.order.customer.ref.model.js");
const ReqRes = require("../helper/request.response.validation.js"); 


exports.create=(req,res)=>
{ 
      var boolean= ReqRes.validateReqBody(req,res);
      if(boolean)
      {
        SalesOrderCustomerRef.CreateSingleRecord(new SalesOrderCustomerRef(req.body), (err, data) => {
            ReqRes.printResponse(res, err,data); 
      });
      }
};


exports.Update=(req,res)=>
{ 
      var boolean= ReqRes.validateReqBody(req,res);
      if(boolean)
      {
        SalesOrderCustomerRef.Update(new SalesOrderCustomerRef(req.body), (err, data) => {
            ReqRes.printResponse(res, err,data); 
      });
      }
};


exports.Delete=(req,res)=>
{       
        SalesOrderCustomerRef.Delete(req.body.SOReferenceId, (err, data) => {
            ReqRes.printResponse(res, err,data); 
      });
      
};
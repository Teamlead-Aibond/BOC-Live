/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const OrderAddress=require("../models/order.address.model.js");
const ReqRes = require("../helper/request.response.validation.js");

exports.Create = (req,res)=>{    
    OrderAddress.Create(req.body,(err,data)=>{
        ReqRes.printResponse(res,err,data);  
    });
};
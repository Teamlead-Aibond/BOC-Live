/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const NotificationModel=require("../models/notification.model.js");
const ReqRes = require("../helper/request.response.validation.js");  

exports.getRRNotificationList = (req,res)=>{
    if(req.body.hasOwnProperty('RRId')) { 
        NotificationModel.getRRNotificationList(req.body.RRId,(err,data)=>{    
            ReqRes.printResponse(res,err,data);  
        });
    }else {
        Reqresponse.printResponse(res,{msg:"RR Id is required"},null); 
    }
}; 

exports.getLatest = (req,res)=>{    
    NotificationModel.getLatest((err,data)=>{    
        ReqRes.printResponse(res,err,data);  
    }); 
}; 

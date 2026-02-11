/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const InventoryReceived=require("../models/inventory.received.model.js");
const ReqRes = require("../helper/request.response.validation.js"); 


exports.GetProductByTransferNo = (req, res) => {
    InventoryReceived.GetProductByTransferNo(req.body.TransferNo,(err, data) => {
          ReqRes.printResponse(res, err,data); 
    });    
  };

  
exports.CreateReceivedPrductByList = (req,res)=>{    
    InventoryReceived.CreateReceivedPrductByList(req.body.InventoryReceivedItem,(err,data)=>{    
        ReqRes.printResponse(res,err,data);  
    }); 
}; 

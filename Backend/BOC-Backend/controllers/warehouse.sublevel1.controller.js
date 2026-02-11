/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const WarehouseSublevel1Model = require("../models/warehouse.sublevel1.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
// To Retrive all WarehouseSublevel1 
exports.getAll=(req,res)=>{
  WarehouseSublevel1Model.getAll((err,data)=>{
    Reqresponse.printResponse(res, err,data); 
  });
}; 

//To add a WarehouseSublevel1
exports.create = (req, res) => { 
  var boolean= Reqresponse.validateReqBody(req,res); 
  if(boolean)  { 
    WarehouseSublevel1Model.create(new WarehouseSublevel1Model(req.body), (err, data) => {
      Reqresponse.printResponse(res, err,data);  
    });
  }
}; 

//To view WarehouseSublevel1
exports.findById = (req,res)=>{
  if(req.body.hasOwnProperty('WarehouseSub1Id')) { 
    WarehouseSublevel1Model.findById(req.body.WarehouseSub1Id,(err,data)=>{
      Reqresponse.printResponse(res, err,data);  
    });
  }else {
    Reqresponse.printResponse(res,{msg:"WarehouseSub1 Id is required"},null);    
  }
}; 

//To get List By WarehouseId
exports.ListByWarehouse = (req,res)=>{
  if(req.body.hasOwnProperty('WarehouseId')) { 
    WarehouseSublevel1Model.ListByWarehouse(req.body.WarehouseId,(err,data)=>{
      Reqresponse.printResponse(res, err,data);  
    });
  }else {
    Reqresponse.printResponse(res,{msg:"Warehouse Id is required"},null);    
  }
}; 
    
//To update a WarehouseSublevel1
exports.update = (req, res) => {
  var boolean= Reqresponse.validateReqBody(req,res);
  if(boolean) {
    WarehouseSublevel1Model.update(new WarehouseSublevel1Model(req.body),(err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  } 
};   
   
//To delete the WarehouseSublevel1
exports.delete = (req, res) => {
  if(req.body.hasOwnProperty('WarehouseSub1Id')) { 
    WarehouseSublevel1Model.remove(req.body.WarehouseSub1Id, (err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  }else {
    Reqresponse.printResponse(res,{msg:"WarehouseSub1 Id is required"},null);  
  }
};

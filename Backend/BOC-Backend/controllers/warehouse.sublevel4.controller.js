/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const WarehouseSublevel4Model = require("../models/warehouse.sublevel4.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
// To Retrive all WarehouseSublevel4
exports.getAll=(req,res)=>{
    WarehouseSublevel4Model.getAll((err,data)=>{
    Reqresponse.printResponse(res, err,data); 
  });
}; 

//To add a WarehouseSublevel4
exports.create = (req, res) => { 
  var boolean= Reqresponse.validateReqBody(req,res); 
  if(boolean)  { 
    WarehouseSublevel4Model.create(new WarehouseSublevel4Model(req.body), (err, data) => {
      Reqresponse.printResponse(res, err,data);  
    });
  }
}; 

//To view WarehouseSublevel4
exports.findById = (req,res)=>{
  if(req.body.hasOwnProperty('WarehouseSub4Id')) { 
    WarehouseSublevel4Model.findById(req.body.WarehouseSub4Id,(err,data)=>{
      Reqresponse.printResponse(res, err,data);  
    });
  }else {
    Reqresponse.printResponse(res,{msg:"WarehouseSub4 Id is required"},null);    
  }
}; 

//To get List By WarehouseId
exports.ListByWarehouse = (req,res)=>{
    if(req.body.hasOwnProperty('WarehouseId')) { 
        WarehouseSublevel4Model.ListByWarehouse(req.body.WarehouseId,(err,data)=>{
        Reqresponse.printResponse(res, err,data);  
      });
    }else {
      Reqresponse.printResponse(res,{msg:"Warehouse Id is required"},null);    
    }
  }; 
    
//To update a WarehouseSublevel4
exports.update = (req, res) => {
  var boolean= Reqresponse.validateReqBody(req,res);
  if(boolean) {
    WarehouseSublevel4Model.update(new WarehouseSublevel4Model(req.body),(err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  } 
};   
   
//To delete the WarehouseSublevel3
exports.delete = (req, res) => {
  if(req.body.hasOwnProperty('WarehouseSub4Id')) { 
    WarehouseSublevel4Model.remove(req.body.WarehouseSub4Id, (err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  }else {
    Reqresponse.printResponse(res,{msg:"WarehouseSub4 Id is required"},null);  
  }
};

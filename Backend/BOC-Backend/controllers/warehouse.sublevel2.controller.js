/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const WarehouseSublevel2Model = require("../models/warehouse.sublevel2.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
// To Retrive all WarehouseSublevel2 
exports.getAll=(req,res)=>{
    WarehouseSublevel2Model.getAll((err,data)=>{
    Reqresponse.printResponse(res, err,data); 
  });
}; 

//To add a WarehouseSublevel2
exports.create = (req, res) => { 
  var boolean= Reqresponse.validateReqBody(req,res); 
  if(boolean)  { 
    WarehouseSublevel2Model.create(new WarehouseSublevel2Model(req.body), (err, data) => {
      Reqresponse.printResponse(res, err,data);  
    });
  }
}; 

//To view WarehouseSublevel2
exports.findById = (req,res)=>{
  if(req.body.hasOwnProperty('WarehouseSub2Id')) { 
    WarehouseSublevel2Model.findById(req.body.WarehouseSub2Id,(err,data)=>{
      Reqresponse.printResponse(res, err,data);  
    });
  }else {
    Reqresponse.printResponse(res,{msg:"WarehouseSub2 Id is required"},null);    
  }
}; 

//To get List By WarehouseId
exports.ListByWarehouse = (req,res)=>{
    if(req.body.hasOwnProperty('WarehouseId')) { 
      WarehouseSublevel2Model.ListByWarehouse(req.body.WarehouseId,(err,data)=>{
        Reqresponse.printResponse(res, err,data);  
      });
    }else {
      Reqresponse.printResponse(res,{msg:"Warehouse Id is required"},null);    
    }
  }; 
    
//To update a WarehouseSublevel2
exports.update = (req, res) => {
  var boolean= Reqresponse.validateReqBody(req,res);
  if(boolean) {
    WarehouseSublevel2Model.update(new WarehouseSublevel2Model(req.body),(err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  } 
};   
   
//To delete the WarehouseSublevel2
exports.delete = (req, res) => {
  if(req.body.hasOwnProperty('WarehouseSub2Id')) { 
    WarehouseSublevel2Model.remove(req.body.WarehouseSub2Id, (err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  }else {
    Reqresponse.printResponse(res,{msg:"WarehouseSub2 Id is required"},null);  
  }
};

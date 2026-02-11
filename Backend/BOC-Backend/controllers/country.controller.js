/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CountryModel=require("../models/country.model.js");
const ReqRes = require("../helper/request.response.validation.js"); 

// Retrive all Country 
exports.getAll = (req,res)=>{
    CountryModel.getAll((err,data)=>{    
    ReqRes.printResponse(res,err,data);  
    });
};

// Retrive all Country with symbol
exports.getAllWithSymbol = (req,res)=>{
    CountryModel.getAllWithSymbol((err,data)=>{    
    ReqRes.printResponse(res,err,data);  
    });
};

//To create a country
exports.create=(req,res)=>
{ 
    var boolean= ReqRes.validateReqBody(req,res);
    if(boolean)
    {
        CountryModel.create(new CountryModel(req.body), (err, data) => {
        ReqRes.printResponse(res, err,data); 
        });
    }
};

//To view a country
exports.findOne = (req, res) => {
    if(req.body.hasOwnProperty('CountryId')) { 
    CountryModel.findById(req.body.CountryId, (err, data) => {
    ReqRes.printResponse(res, err,data); 
    });
    }else{
    ReqRes.printResponse(res,{msg:"Country Id is required"},null);  
   }
};

//To update  a country
exports.update = (req, res) => { 
    var boolean= ReqRes.validateReqBody(req,res);
    if(boolean)
    {
        CountryModel.update(new CountryModel(req.body),(err, data) => {
        ReqRes.printResponse(res, err,data); 
        });
    }
};

//To delete  a country
exports.delete = (req, res) => {
    if(req.body.hasOwnProperty('CountryId')) { 
    CountryModel.remove(req.body.CountryId, (err, data) => {
    ReqRes.printResponse(res, err,data); 
    });
    }else{
    ReqRes.printResponse(res,{msg:"Country Id is required"},null);  
   }
};

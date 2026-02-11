/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const ContactModel = require("../models/contact.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
// To Retrive all Contact 
exports.getAll=(req,res)=>{
  ContactModel.getAll((err,data)=>{
    Reqresponse.printResponse(res, err,data); 
  });
}; 

//To add a new contact
exports.create = (req, res) => { 
  var boolean= Reqresponse.validateReqBody(req,res); 
  if(boolean)  { 
    ContactModel.create(req.body, (err, data) => {
      Reqresponse.printResponse(res, err,data);  
    });
  }
}; 

//To view / find a new contact
exports.findById = (req,res)=>{
  if(req.body.hasOwnProperty('ContactId')) { 
    ContactModel.findById(req.body.ContactId,(err,data)=>{
      Reqresponse.printResponse(res, err,data);  
    });
  }else {
    Reqresponse.printResponse(res,{msg:"Contact Id is required"},null);    
  }
}; 
    
//To update a new contact
exports.update = (req, res) => {
  var boolean= Reqresponse.validateReqBody(req,res);
  if(boolean) {
    ContactModel.updateById(new ContactModel(req.body),(err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  } 
};   
   
//To delete the contact
exports.delete = (req, res) => {
  if(req.body.hasOwnProperty('ContactId')) { 
    ContactModel.remove(req.body.ContactId, (err, data) => {
      Reqresponse.printResponse(res, err,data); 
    });
  }else {
    Reqresponse.printResponse(res,{msg:"Contact Id is required"},null);  
  }
};

//To set a contact as primary
exports.setprimaryaddress = (req, res) => {   
  ContactModel.SetPrimaryAddress(new ContactModel(req.body),(err, data) => {
    Reqresponse.printResponse(res, err,data); 
  });
};
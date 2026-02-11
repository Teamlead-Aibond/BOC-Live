/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const AddressModel = require("../models/customeraddress.model.js");
const SettingsGeneralModel = require("../models/settings.general.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");
const UPS = require("../controllers/ups.controller.js");
//To create a customer address
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    AddressModel.create(new AddressModel(req.body), (err, data) => {
      var d = UPS.singleAddressValidate(data.AddressList,'single',(respo) =>{
        data.AddressList = respo;
        Reqresponse.printResponse(res, err, data);
      });
    });
  }
};

//To update the customer address
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    AddressModel.updateById(new AddressModel(req.body), (err, data) => {
      var d = UPS.singleAddressValidate(data.AddressList,'single',(respo) =>{
        data.AddressList = respo;
        Reqresponse.printResponse(res, err, data);
      });
      
    });
  }
};

//To delete the customer address   
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('AddressId')) {
    AddressModel.remove(req.body.AddressId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Address Id is required" }, null);
  }
};

//To list the customer address
exports.list = (req, res) => {
  AddressModel.listbyIdentity(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To view the customer address
exports.view = (req, res) => {
  if (req.body.hasOwnProperty('AddressId')) {
    AddressModel.viewAddress(req.body.AddressId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Address Id is required" }, null);
  }
};

//To set the address as primary
exports.setprimaryaddress = (req, res) => {
  AddressModel.SetCustomerPrimaryAddress(new AddressModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
//To list the GetAhGroupVendorAddress
exports.GetAHGroupVendorAddress = (req, res) => {
  var sql = SettingsGeneralModel.SelectAHGroupVendor();
  con.query(sql, (err, data) => {
    if (data.length > 0 && data[0].AHGroupVendor > 0) {
      req.body.IdentityType = Constants.CONST_IDENTITY_TYPE_VENDOR;
      req.body.IdentityId = data[0].AHGroupVendor;
      AddressModel.listbyIdentity(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, { AHGroupVendorAddress: data });
      });
    }
  });
};
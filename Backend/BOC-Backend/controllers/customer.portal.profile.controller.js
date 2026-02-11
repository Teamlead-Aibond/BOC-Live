/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const UsersModel = require("../models/users.model.js");
const AddressModel = require("../models/customeraddress.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const CVAttachmentModel = require("../models/attachment.model.js");
const CustomerAssetModel = require("../models/customersasset.model.js");
const CustomersDepartmentModel = require("../models/customersdepartment.model.js");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType } = require("../helper/common.function.js");

// To View User Profile
exports.ViewUserProfile = (req, res) => {
  var UserId = getLogInUserId(req.body);

  if (UserId > 0) {
    UsersModel.findById(UserId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "User Id is required" }, null);
  }
};

// To Update User Profile
exports.UpdateUserProfile = (req, res) => {



  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    var UserId = getLogInUserId(req.body);
    var IdentityId = getLogInIdentityId(req.body);
    var IdentityType = getLogInIdentityType(req.body);

    req.body.IdentityId = IdentityId;
    req.body.UserList[0].IdentityType = IdentityType;
    req.body.UserList[0].UserId = UserId;
    UsersModel.updateById(new UsersModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To create a create address
exports.createaddress = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {


    var IdentityId = getLogInIdentityId(req.body);
    var IdentityType = getLogInIdentityType(req.body);

    req.body.IdentityId = IdentityId;
    req.body.AddressList[0].IdentityType = IdentityType;
    AddressModel.create(new AddressModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To update the address
exports.updateaddress = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {


    var IdentityId = getLogInIdentityId(req.body);
    var IdentityType = getLogInIdentityType(req.body);

    req.body.IdentityId = IdentityId;
    req.body.AddressList[0].IdentityType = IdentityType;
    AddressModel.updateById(new AddressModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To delete the address   
exports.deleteaddress = (req, res) => {
  if (req.body.hasOwnProperty('AddressId')) {
    AddressModel.remove(req.body.AddressId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Address Id is required" }, null);
  }
};

//To set the address as primary
exports.setprimaryaddress = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    var IdentityId = getLogInIdentityId(req.body);
    var IdentityType = getLogInIdentityType(req.body);

    req.body.IdentityId = IdentityId;
    req.body.IdentityType = IdentityType;
    AddressModel.SetCustomerPrimaryAddress(new AddressModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};





//To create a attachment
exports.createattachment = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    var IdentityId = getLogInIdentityId(req.body);
    var IdentityType = getLogInIdentityType(req.body);
    req.body.IdentityId = IdentityId;
    req.body.AttachmentList.AttachmentList[0].IdentityType = IdentityType;
    CVAttachmentModel.Create(new CVAttachmentModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To update attachment 
exports.updateattachment = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var IdentityId = getLogInIdentityId(req.body);
    var IdentityType = getLogInIdentityType(req.body);
    req.body.IdentityId = IdentityId;
    req.body.AttachmentList[0].IdentityType = IdentityType;
    CVAttachmentModel.updateById(new CVAttachmentModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To delete a attachment
exports.deleteattachment = (req, res) => {
  if (req.body.hasOwnProperty('AttachmentId')) {
    CVAttachmentModel.remove(req.body.AttachmentId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Attachment Id is required" }, null);
  }
};



//To add a new customer asset
exports.createasset = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var IdentityId = getLogInIdentityId(req.body);
    req.body.IdentityId = IdentityId;
    CustomerAssetModel.create(new CustomerAssetModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To update the customer asset
exports.updateasset = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var IdentityId = getLogInIdentityId(req.body);
    req.body.IdentityId = IdentityId;
    CustomerAssetModel.updateById(new CustomerAssetModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To delete the customer asset   
exports.deleteasset = (req, res) => {
  if (req.body.hasOwnProperty('CustomerAssetId')) {
    CustomerAssetModel.remove(req.body.CustomerAssetId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    ReqRes.printResponse(res, { msg: "Customer asset Id is required" }, null);
  }
};



//To add a customer department
exports.createdepartment = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var IdentityId = getLogInIdentityId(req.body);
    req.body.IdentityId = IdentityId;
    CustomersDepartmentModel.create(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To update the customer department
exports.updatedepartment = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var IdentityId = getLogInIdentityId(req.body);
    req.body.IdentityId = IdentityId;
    CustomersDepartmentModel.updateById(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To delete the customer department   
exports.deletedepartment = (req, res) => {
  if (req.body.hasOwnProperty('CustomerDepartmentId')) {
    CustomersDepartmentModel.remove(req.body.CustomerDepartmentId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    ReqRes.printResponse(res, { msg: "Customer Department Id is required" }, null);
  }
};





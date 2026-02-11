/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CustomerAssetModel = require("../models/customersasset.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

//To add a new customer asset
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    CustomerAssetModel.IsExistCustomerAsset(new CustomerAssetModel(req.body.CustomerAssetList[0]), req.body.IdentityId, (err, data1) => {
      if (data1.length > 0) {
        Reqresponse.printResponse(res, { msg: "Record Already Exist" }, null);
      }
      else {
        CustomerAssetModel.create(req.body, (err, data) => {
          Reqresponse.printResponse(res, err, data);
        });
      }
    });

  }
};

//To update the customer asset
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    CustomerAssetModel.IsExistCustomerAsset(new CustomerAssetModel(req.body.CustomerAssetList[0]), req.body.IdentityId, (err, data1) => {
      if (data1.length > 0) {
        Reqresponse.printResponse(res, { msg: "Record Already Exist" }, null);
      }
      else {
        CustomerAssetModel.updateById(req.body, (err, data) => {
          Reqresponse.printResponse(res, err, data);
        });
      }
    });

  }
};

//To list all the customer assets
exports.getAll = (req, res) => {
  if (req.body.hasOwnProperty('CustomerId')) {
    CustomerAssetModel.getAll(req.body.CustomerId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Customer Id is required" }, null);
  }
};

//To delete the customer asset   
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('CustomerAssetId')) {
    CustomerAssetModel.remove(req.body.CustomerAssetId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    ReqRes.printResponse(res, { msg: "Customer asset Id is required" }, null);
  }
};
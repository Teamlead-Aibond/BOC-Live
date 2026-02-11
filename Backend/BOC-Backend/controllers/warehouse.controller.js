/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const WarehouseModel = require("../models/warehouse.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

//To Retrive all Warehouse 
exports.getAll = (req, res) => {
  WarehouseModel.getAll((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To create Warehouse
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    WarehouseModel.create(new WarehouseModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To view Warehouse
exports.findOne = (req, res) => {
  if (req.body.hasOwnProperty('WarehouseId')) {
    WarehouseModel.findById(req.body.WarehouseId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Warehouse Id is required" }, null);
  }
};

//To update Warehouse
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    WarehouseModel.updateById(new WarehouseModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To delete Warehouse
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('WarehouseId')) {
    WarehouseModel.remove(req.body.WarehouseId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Warehouse Id is required" }, null);
  }
};

exports.GetWareHouseByUserId = (req, res) => {
  WarehouseModel.GetWareHouseByUserId(req.body.UserId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
}; 
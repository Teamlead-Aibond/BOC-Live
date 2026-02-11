/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const WarehouseSublevel3Model = require("../models/warehouse.sublevel3.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
// To Retrive all WarehouseSublevel3 
exports.getAll = (req, res) => {
  WarehouseSublevel3Model.getAll((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To add a WarehouseSublevel3
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    WarehouseSublevel3Model.create(new WarehouseSublevel3Model(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To view WarehouseSublevel3
exports.findById = (req, res) => {
  if (req.body.hasOwnProperty('WarehouseSub3Id')) {
    WarehouseSublevel3Model.findById(req.body.WarehouseSub3Id, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "WarehouseSub3 Id is required" }, null);
  }
};

//To get List By WarehouseId
exports.ListByWarehouse = (req, res) => {
  if (req.body.hasOwnProperty('WarehouseId')) {
    WarehouseSublevel3Model.ListByWarehouse(req.body.WarehouseId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Warehouse Id is required" }, null);
  }
};

//To get List By WarehouseSub2Id
exports.ListBySub2 = (req, res) => {
  if (req.body.hasOwnProperty('WarehouseSub2Id')) {
    WarehouseSublevel3Model.ListByWarehouseSub2Id(req.body.WarehouseSub2Id, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Warehouse Id is required" }, null);
  }
};

//To update a WarehouseSublevel3
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    WarehouseSublevel3Model.update(new WarehouseSublevel3Model(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To delete the WarehouseSublevel3
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('WarehouseSub3Id')) {
    WarehouseSublevel3Model.remove(req.body.WarehouseSub3Id, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "WarehouseSub3 Id is required" }, null);
  }
};

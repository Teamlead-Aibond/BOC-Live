/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const InventoryStockoutModel = require("../models/inventory.stockout.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

//To add a InventoryStockout
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    InventoryStockoutModel.create(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};


// To get list
exports.list = (req, res) => {
  // var boolean = Reqresponse.validateReqBody(req, res);
  // if (boolean) {
  InventoryStockoutModel.list((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
  // }
};

//TO get all the stock out ready for shipping List
exports.StockOutReadyShippingList = (req, res) => {
  req.body.Status = req.body.Status ? req.body.Status : 0;
  InventoryStockoutModel.StockOutListServerSide(new InventoryStockoutModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//TO get all the stock out ready for shipping List
exports.StockOutHistoryList = (req, res) => {
  req.body.Status = 1;
  InventoryStockoutModel.StockOutListServerSide(new InventoryStockoutModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
//To Delete
exports.Delete = (req, res) => {
  if (req.body.hasOwnProperty('StockOutId')) {
    InventoryStockoutModel.Delete(req.body.StockOutId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "StockOut Id is required" }, null);
  }
};

//To update the Stockout status once part exit successfully 
exports.StockOutSuccess = (req, res) => {
  if (req.body.hasOwnProperty('StockOutId')) {
    InventoryStockoutModel.StockOutSuccess(req.body.StockOutId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "StockOut Id is required" }, null);
  }
};

//To Reset
exports.Reset = (req, res) => {
  InventoryStockoutModel.Reset((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
}

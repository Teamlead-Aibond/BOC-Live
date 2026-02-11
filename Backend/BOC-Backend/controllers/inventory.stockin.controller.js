/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const InventoryStockinModel = require("../models/inventory.stockin.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

//TO StockInListServerSide
exports.StockInListServerSide = (req, res) => {
  InventoryStockinModel.StockInListServerSide(new InventoryStockinModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};



exports.CheckRFIDTagExists = (req, res) => {
  InventoryStockinModel.CheckRFIDTagExists(new InventoryStockinModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


exports.StockInUpdatedList = (req, res) => {
  InventoryStockinModel.StockInUpdatedList((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

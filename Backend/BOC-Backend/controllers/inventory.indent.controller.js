/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const InventoryIndent = require("../models/inventory.indent.model.js");
const ReqRes = require("../helper/request.response.validation.js");

exports.Create = (req, res) => {
      // console.log("test");
      var boolean = ReqRes.validateReqBody(req, res);
      if (boolean) {
            InventoryIndent.create(new InventoryIndent(req.body), (err, data) => {
                  ReqRes.printResponse(res, err, data);
            });
      }
};

exports.GetInventoryItemsByIndentNo = (req, res) => {
      var boolean = ReqRes.validateReqBody(req, res);
      if (boolean) {
            InventoryIndent.GetInventoryItemsByIndentNo(req.body, (err, data) => {
                  ReqRes.printResponse(res, err, data);
            });
      }
};

exports.InventoryIndentListByServerSide = (req, res) => {
      InventoryIndent.InventoryIndentListByServerSide(new InventoryIndent(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
      });
};

exports.InventoryTransferListByServerSide = (req, res) => {
      InventoryIndent.InventoryTransferListByServerSide(req.body, (err, data) => {
            ReqRes.printResponse(res, err, data);
      });
};
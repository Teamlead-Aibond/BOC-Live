/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const InventroyTransfer = require("../models/inventory.transfer.model.js");
const InventroyTransferItem = require("../models/inventory.transfer.item.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

var cDateTime = require("../utils/generic.js");
var async = require('async');
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");



exports.Create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    InventroyTransfer.Create(new InventroyTransfer(req.body), (err, data) => {
      if (err) {
        Reqresponse.printResponse(res, err, null);
      }
      var objInventory = new InventroyTransfer({
        TransferId: data.id
      });
      var sqlUpdateInventoryTranferNo = InventroyTransfer.UpdateInventoryTransferNoById(objInventory);
      async.parallel([

        function (result) {
          if (req.body.hasOwnProperty('InventroyTransferItem'))
            InventroyTransferItem.Create(data.id, req.body.InventroyTransferItem, result);
        },
        function (result) { con.query(sqlUpdateInventoryTranferNo, result) },
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
        }
      );
      Reqresponse.printResponse(res, err, data);
    });


  }

};

exports.CreateMultiple = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {

    InventroyTransfer.CreateMultiple(req.body.Indent, req.body.Items, (err, data) => {
      if (err) {
        Reqresponse.printResponse(res, err, null);
      } else {
        Reqresponse.printResponse(res, null, data);
      }
    });


  }

};

/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const InventoryDamage = require("../models/inventory.damage.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
var async = require('async');

exports.InventoryDamageListServerSide = (req, res) => {
  InventoryDamage.InventoryDamageListServerSide(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


exports.Create = (req, res) => {
  if (req.body.hasOwnProperty('SerialNo')) {
    InventoryDamage.IsExistSerialNo(req.body.SerialNo, (err, data) => {
      if (data.length > 0) {
        data[0].DamageType = req.body.DamageType;
        data[0].Comments = req.body.Comments;
        console.log(data[0]);
        InventoryDamage.create(new InventoryDamage(data[0]), (err, data2) => {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          Reqresponse.printResponse(res, err, data);
        });
      }
    });
  } else {
    Reqresponse.printResponse(res, { msg: "SerialNo is required" }, null);
  }
};
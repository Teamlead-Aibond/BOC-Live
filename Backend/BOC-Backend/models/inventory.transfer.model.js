/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
var async = require('async');
const InventoryTransferItem = require("./inventory.transfer.item.model.js");

const InventoryTransfer = function (obj) {
  this.TransferId = obj.TransferId;
  this.TransferNo = obj.TransferNo;
  this.TransferType = obj.TransferType;
  this.IntentId = obj.IntentId;
  this.WarehouseFromId = obj.WarehouseFromId;
  this.WarehouseToId = obj.WarehouseToId;
  this.Status = obj.Status;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.IsDeleted = obj.IsDeleted;
}


InventoryTransfer.Create = (InventoryTransfer1, result) => {
  var sql = `insert into tbl_inventory_transfer(TransferNo, TransferType, IntentId, WarehouseFromId, WarehouseToId, Status,Created,CreatedBy,IsDeleted) 
          values(?,?,?,?,?,?,?,?,?)`;
  var values = [
    InventoryTransfer1.TransferNo, InventoryTransfer1.TransferType,
    InventoryTransfer1.IntentId, InventoryTransfer1.WarehouseFromId, InventoryTransfer1.WarehouseToId,
    InventoryTransfer1.Status, InventoryTransfer1.Created, InventoryTransfer1.CreatedBy,
    InventoryTransfer1.IsDeleted]

  //console.log("Inventory Transfer values=" + values);

  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...InventoryTransfer1 });
    return;

  });
}

InventoryTransfer.CreateMultiple = (indent, transferItems, result) => {
  var sql = [];
  var indentTransferNumber = "IT-" + Math.floor(100000 + Math.random() * 900000);
  var transferSql = `insert into tbl_inventory_transfer(TransferNo, TransferType, IntentId, WarehouseFromId, WarehouseToId, Status,Created,CreatedBy,IsDeleted) 
  values('${indentTransferNumber}','${indent.TransferType}','${indent.IntentId}',null,'${indent.WarehouseId}',0,'${cDateTime.getDateTime()}','${global.authuser.UserId}',0)`;

  con.query(transferSql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    let transferId = res.insertId;
    transferItems.forEach(transfer => {
      let transferItemObj = new InventoryTransferItem(transfer);
      sql.push(`insert into tbl_inventory_transfer_item(TransferId, PartId, PartItemId, WarehouseId, WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id, Created,  CreatedBy, IsDeleted) 
            values('${transferId}','${transferItemObj.PartId}','${transferItemObj.PartItemId}','${transferItemObj.WarehouseId}','${transferItemObj.WarehouseSub1Id}','${transferItemObj.WarehouseSub2Id}','${transferItemObj.WarehouseSub3Id}','${transferItemObj.WarehouseSub4Id}','${transferItemObj.Created}','${transferItemObj.CreatedBy}',0)`);
    });

    async.parallel(sql.map(s => result => { con.query(s, result) }),
      (err, res) => {
        if (err)
          return result(err, null);
        result(null, { TransferNo: indentTransferNumber });
      }
    )

  });


}


InventoryTransfer.UpdateInventoryTransferNoById = (objModel) => {
  var Obj = new InventoryTransfer({
    TransferId: objModel.TransferId
  });
  var sql = `UPDATE tbl_inventory_transfer SET TransferNo=CONCAT('ITR',${Obj.TransferId})  WHERE TransferId=${Obj.TransferId}`;
  // console.log("Update Transfer No =" + sql);
  return sql;
};


module.exports = InventoryTransfer;

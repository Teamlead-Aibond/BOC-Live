/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');

const InventoryReceived = function (objInventoryReceived) {
  this.ReceiveId = objInventoryReceived.ReceiveId;
  this.TransferId = objInventoryReceived.TransferId;
  this.TransferItemId = objInventoryReceived.TransferItemId;
  this.PartId = objInventoryReceived.PartId;
  this.PartItemId = objInventoryReceived.PartItemId;
  this.SellingPrice = objInventoryReceived.SellingPrice;
  this.WarehouseId = objInventoryReceived.WarehouseId;
  this.WarehouseSub1Id = objInventoryReceived.WarehouseSub1Id;
  this.WarehouseSub2Id = objInventoryReceived.WarehouseSub2Id;
  this.WarehouseSub3Id = objInventoryReceived.WarehouseSub3Id;
  this.WarehouseSub4Id = objInventoryReceived.WarehouseSub4Id;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objInventoryReceived.authuser && objInventoryReceived.authuser.UserId) ? objInventoryReceived.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objInventoryReceived.authuser && objInventoryReceived.authuser.UserId) ? objInventoryReceived.authuser.UserId : TokenUserId;
  this.IsDeleted = objInventoryReceived.IsDeleted ? objInventoryReceived.IsDeleted : 0;
}

InventoryReceived.GetProductByTransferNo = (TransferNo, result) => {
  var sql = `SELECT ps.PartId,pi.PartItemId,ps.PartNo,pi.SellingPrice,pi.SerialNo,it.TransferId,it.TransferNo,iti.TransferItemId,
    wr.WarehouseId,wr.WarehouseName,
    wr1.WarehouseSub1Id,wr1.WarehouseSub1Name,
    wr2.WarehouseSub2Id,wr2.WarehouseSub2Name,
    wr3.WarehouseSub3Id,wr3.WarehouseSub3Name,
    wr4.WarehouseSub4Id,wr4.WarehouseSub4Name
    FROM ahoms.tbl_inventory_transfer it
    Inner Join ahoms.tbl_inventory_transfer_item iti on iti.TransferId=it.TransferId
    Inner Join ahoms.tbl_parts_item pi on pi.PartItemId=iti.PartItemId
    inner Join ahoms.tbl_parts ps on ps.PartId=iti.PartId
    Left Join ahoms.tbl_warehouse wr on wr.WarehouseId=iti.WarehouseId
    Left Join ahoms.tbl_warehouse_sublevel1 wr1 on wr1.WarehouseSub1Id=iti.WarehouseSub1Id
    Left Join ahoms.tbl_warehouse_sublevel2 wr2 on wr2.WarehouseSub2Id=iti.WarehouseSub2Id
    Left Join ahoms.tbl_warehouse_sublevel3 wr3 on wr3.WarehouseSub3Id=iti.WarehouseSub3Id
    Left Join ahoms.tbl_warehouse_sublevel4 wr4 on wr4.WarehouseSub4Id=iti.WarehouseSub4Id
    where it.TransferNo='${TransferNo}' `;

  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};


InventoryReceived.CreateReceivedPrductByList = (InventoryReceivedItem, result) => {


  var sql = `insert into tbl_inventory_received(TransferId, TransferItemId, PartId, PartItemId, SellingPrice, WarehouseId, WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id, Created,  CreatedBy, IsDeleted) values`;
  for (let val of InventoryReceivedItem.PartItems) {
    val = new InventoryReceived(val);
    sql = sql + `('${val.TransferId}','${val.TransferItemId}','${val.PartId}','${val.PartItemId}','${val.SellingPrice}','${val.WarehouseId}','${val.WarehouseSub1Id}','${val.WarehouseSub2Id}','${val.WarehouseSub3Id}','${val.WarehouseSub4Id}','${val.Created}','${val.CreatedBy}','${val.IsDeleted}'),`;
  }

  var updateSql = [];
  for (let val of InventoryReceivedItem.PartItems) {
    val = new InventoryReceived(val);
    updateSql.push(`UPDATE tbl_inventory SET WarehouseId='${val.WarehouseId}', WarehouseSub1Id='${val.WarehouseSub1Id}', WarehouseSub2Id='${val.WarehouseSub2Id}', WarehouseSub3Id='${val.WarehouseSub3Id}', WarehouseSub4Id='${val.WarehouseSub4Id}' WHERE PartItemId = '${val.PartItemId}'`);
    updateSql.push(`UPDATE tbl_parts_item SET WarehouseId='${val.WarehouseId}', WarehouseSub1Id='${val.WarehouseSub1Id}', WarehouseSub2Id='${val.WarehouseSub2Id}', WarehouseSub3Id='${val.WarehouseSub3Id}', WarehouseSub4Id='${val.WarehouseSub4Id}' WHERE PartItemId = '${val.PartItemId}'`);
  }

  var Query = sql.slice(0, -1);
  //console.log("tbl_inventory_transfer_item sql :" + sql);

  // async.parallel([
  //   function (res) { con.query(Query, res) },
  //   function (res) { con.query(updateSql, res) }
  // ],
  //   function (err, results) {
  //     if (err) return result(err, null);
  //     result(null, { id: results[0][0].insertId });
  //   }
  // );

  con.query(Query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    async.parallel(updateSql.map(s => result => { con.query(s, result) }),
      (err, res) => {
        if (err)
          return result(err, null);
        result(null, { id: res.insertId });
      }
    )
  });

};
module.exports = InventoryReceived;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const InventoryTransferItem = function (obj) {
  this.TransferItemId = obj.TransferItemId;
  this.TransferId = obj.TransferId;
  this.PartId = obj.PartId;
  this.PartItemId = obj.PartItemId;
  this.WarehouseId = obj.WarehouseId;
  this.WarehouseSub1Id = obj.WarehouseSub1Id;
  this.WarehouseSub2Id = obj.WarehouseSub2Id;
  this.WarehouseSub3Id = obj.WarehouseSub3Id;
  this.WarehouseSub4Id = obj.WarehouseSub4Id;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  this.IsDeleted = obj.IsDeleted;
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
}


InventoryTransferItem.Create = (TransferId, InventoryTransferItem1, result) => {


  var sql = `insert into tbl_inventory_transfer_item(TransferId, PartId, PartItemId, WarehouseId, WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id, Created,  CreatedBy, IsDeleted) values`;
  for (let val of InventoryTransferItem1) {
    val = new InventoryTransferItem(val);
    sql = sql + `('${TransferId}','${val.PartId}','${val.PartItemId}','${val.WarehouseId}','${val.WarehouseSub1Id}','${val.WarehouseSub2Id}','${val.WarehouseSub3Id}','${val.WarehouseSub4Id}','${val.Created}','${val.CreatedBy}','${val.IsDeleted}'),`;
  }

  var Query = sql.slice(0, -1);
  // console.log("tbl_inventory_transfer_item sql :" + sql);
  con.query(Query, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;


  });

};
module.exports = InventoryTransferItem;
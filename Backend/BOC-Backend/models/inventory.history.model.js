/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const InventoryModel = require("./inventory.model.js");
const InventoryHistoryModel = function (objInventory) {
    this.InventoryHistoryId = objInventory.InventoryHistoryId;
    this.InventoryId = objInventory.InventoryId;
    this.PartItemId = objInventory.PartItemId;
    this.PartId = objInventory.PartId;
    this.ShortDescription = objInventory.ShortDescription;
    this.WarehouseId = objInventory.WarehouseId;
    this.WarehouseSub1Id = objInventory.WarehouseSub1Id;
    this.WarehouseSub2Id = objInventory.WarehouseSub2Id;
    this.WarehouseSub3Id = objInventory.WarehouseSub3Id;
    this.WarehouseSub4Id = objInventory.WarehouseSub4Id
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (objInventory.authuser && objInventory.authuser.UserId) ? objInventory.authuser.UserId : TokenUserId;
    this.ModifiedBy = (objInventory.authuser && objInventory.authuser.UserId) ? objInventory.authuser.UserId : TokenUserId;
};

InventoryHistoryModel.CreateInventoryHistory = (body, result) => {
    var Obj = new InventoryModel(body);
    var sql = `insert into tbl_inventory_history(InventoryId, PartItemId, PartId, WarehouseId, WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id, ShortDescription, Created, CreatedBy)
    values(?,?,?,?,?,?,?,?,?,?,?)`;

    var values = [
        Obj.InventoryId, Obj.PartItemId, Obj.PartId,
        Obj.WarehouseId, Obj.WarehouseSub1Id, Obj.WarehouseSub2Id, Obj.WarehouseSub3Id, Obj.WarehouseSub4Id,
        "",
        Obj.Created, Obj.CreatedBy
    ]

    con.query(sql, values, (err, res) => {
        if (err) {
            // console.log("error: ", err);
            result(err, null);
            return;
        }
        ReqBody.PartId = res.insertId;
        result(null, { id: res.insertId, ...ReqBody });
    });
};


module.exports = InventoryHistoryModel;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const WarehouseSublevel4Model = function (objModel) {
  this.WarehouseSub4Id = objModel.WarehouseSub4Id;
  this.WarehouseId = objModel.WarehouseId ? objModel.WarehouseId : 0;
  this.WarehouseSub1Id = objModel.WarehouseSub1Id ? objModel.WarehouseSub1Id : 0;
  this.WarehouseSub2Id = objModel.WarehouseSub2Id ? objModel.WarehouseSub2Id : 0;
  this.WarehouseSub3Id = objModel.WarehouseSub3Id ? objModel.WarehouseSub3Id : 0;
  this.WarehouseSub4Name = objModel.WarehouseSub4Name ? objModel.WarehouseSub4Name : '';
  this.RowIndex = objModel.RowIndex ? objModel.RowIndex : 0;
  this.ColumnIndex = objModel.ColumnIndex ? objModel.ColumnIndex : 0;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objModel.authuser && objModel.authuser.UserId) ? objModel.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objModel.authuser && objModel.authuser.UserId) ? objModel.authuser.UserId : TokenUserId;
};

//To get all the WarehouseSublevel4
WarehouseSublevel4Model.getAll = result => {
  con.query(`Select * from tbl_warehouse_sublevel4 where IsDeleted=0`, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}

//To create a WarehouseSublevel4
WarehouseSublevel4Model.create = (Obj, result) => {
  var sql = `insert into tbl_warehouse_sublevel4(WarehouseId,WarehouseSub1Id,WarehouseSub2Id,
    WarehouseSub3Id,WarehouseSub4Name,RowIndex,ColumnIndex,Created,CreatedBy) values(?,?,?,?,?,?,?,?,?)`;
  var values = [Obj.WarehouseId, Obj.WarehouseSub1Id, Obj.WarehouseSub2Id, Obj.WarehouseSub3Id,
  Obj.WarehouseSub4Name, Obj.RowIndex, Obj.ColumnIndex, Obj.Created, Obj.CreatedBy];
  // console.log("val="+values)
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, { id: res.insertId, ...Obj });
  });
};

//To view WarehouseSublevel4
WarehouseSublevel4Model.findById = (WarehouseSub4Id, result) => {
  con.query(`SELECT * FROM tbl_warehouse_sublevel4 WHERE IsDeleted=0 and WarehouseSub4Id = ${WarehouseSub4Id}`, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res[0]);
    } else {
      return result({ msg: "Warehouse Sublevel4 not found" }, null);
    }
  });
};

//To view WarehouseSublevel4
WarehouseSublevel4Model.ListByWarehouse = (WarehouseId, result) => {
  con.query(`SELECT * FROM tbl_warehouse_sublevel4 WHERE IsDeleted=0 and WarehouseId = ${WarehouseId}`, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res[0]);
    } else {
      return result({ msg: "Warehouse Sublevel4 not found" }, null);
    }
  });
};

//To update the WarehouseSublevel4
WarehouseSublevel4Model.update = (Obj, result) => {
  var sql = ` UPDATE tbl_warehouse_sublevel4 SET WarehouseId = ?,WarehouseSub1Id = ?,WarehouseSub2Id = ?, 
  WarehouseSub3Id = ?,WarehouseSub4Name = ?,RowIndex = ?,ColumnIndex = ?,Modified = ?,Modifiedby = ?  WHERE WarehouseSub4Id = ? `;
  var values = [Obj.WarehouseId, Obj.WarehouseSub1Id, Obj.WarehouseSub2Id, Obj.WarehouseSub3Id,
  Obj.WarehouseSub4Name, Obj.RowIndex, Obj.ColumnIndex, Obj.Modified, Obj.ModifiedBy, Obj.WarehouseSub4Id];
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "Warehouse Sublevel4 not updated!" }, null);
    result(null, { id: Obj.WarehouseSub4Id, ...Obj });
  });
};

//To remvoe WarehouseSublevel4
WarehouseSublevel4Model.remove = (id, result) => {
  con.query("Update tbl_warehouse_sublevel4 set IsDeleted=1 WHERE WarehouseSub4Id = ?", id, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "Warehouse Sublevel4 not deleted" }, null);
    return result(null, res);
  });
};
module.exports = WarehouseSublevel4Model;
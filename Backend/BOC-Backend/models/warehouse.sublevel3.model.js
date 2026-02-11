/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const WarehouseSublevel3Model = function (objModel) {
  this.WarehouseSub3Id = objModel.WarehouseSub3Id;
  this.WarehouseId = objModel.WarehouseId ? objModel.WarehouseId : 0;
  this.WarehouseSub1Id = objModel.WarehouseSub1Id ? objModel.WarehouseSub1Id : 0;
  this.WarehouseSub2Id = objModel.WarehouseSub2Id ? objModel.WarehouseSub2Id : 0;
  this.WarehouseSub3Name = objModel.WarehouseSub3Name ? objModel.WarehouseSub3Name : '';
  this.RowsCount = objModel.RowsCount;
  this.ColumnCount = objModel.ColumnCount;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objModel.authuser && objModel.authuser.UserId) ? objModel.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objModel.authuser && objModel.authuser.UserId) ? objModel.authuser.UserId : TokenUserId;
};

//To get all the WarehouseSublevel3
WarehouseSublevel3Model.getAll = result => {
  con.query(`Select S3.*,W.WarehouseName,S1.WarehouseSub1Name,S2.WarehouseSub2Name from tbl_warehouse_sublevel3 as S3
  LEFT JOIN tbl_warehouse as W ON W.WarehouseId = S3.WarehouseId
  LEFT JOIN tbl_warehouse_sublevel1 as S1 ON S1.WarehouseSub1Id = S3.WarehouseSub1Id
  LEFT JOIN tbl_warehouse_sublevel2 as S2 ON S2.WarehouseSub2Id = S3.WarehouseSub1Id
  where S3.IsDeleted=0 
  `, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}

//To create a WarehouseSublevel3
WarehouseSublevel3Model.create = (Obj, result) => {
  var sql = `insert into tbl_warehouse_sublevel3(WarehouseId,WarehouseSub1Id,WarehouseSub2Id,
  WarehouseSub3Name,Created,CreatedBy,RowsCount,ColumnCount) values(?,?,?,?,?,?,?,?)`;
  var values = [Obj.WarehouseId, Obj.WarehouseSub1Id, Obj.WarehouseSub2Id, Obj.WarehouseSub3Name, Obj.Created, Obj.CreatedBy, Obj.RowsCount, Obj.ColumnCount];
  //console.log("val="+values)
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, { id: res.insertId, ...Obj });
  });
};

//To view WarehouseSublevel3
WarehouseSublevel3Model.findById = (WarehouseSub3Id, result) => {
  con.query(`SELECT * FROM tbl_warehouse_sublevel3 WHERE IsDeleted=0 and WarehouseSub3Id = ${WarehouseSub3Id}`, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res[0]);
    } else {
      return result({ msg: "Warehouse Sublevel3 not found" }, null);
    }
  });
};

//To view WarehouseSublevel3
WarehouseSublevel3Model.ListByWarehouse = (WarehouseId, result) => {
  con.query(`SELECT * FROM tbl_warehouse_sublevel3 WHERE IsDeleted=0 and WarehouseId = ${WarehouseId}`, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res[0]);
    } else {
      return result({ msg: "Warehouse Sublevel3 not found" }, null);
    }
  });
};

//To view WarehouseSublevel3
WarehouseSublevel3Model.ListByWarehouseSub2Id = (WarehouseSub2Id, result) => {
  con.query(`SELECT * FROM tbl_warehouse_sublevel3 WHERE IsDeleted=0 and WarehouseSub2Id = ${WarehouseSub2Id}`, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res);
    } else {
      return result({ msg: "Warehouse Sublevel3 not found" }, null);
    }
  });
};

//To update the WarehouseSublevel3
WarehouseSublevel3Model.update = (Obj, result) => {
  var sql = ` UPDATE tbl_warehouse_sublevel3 SET WarehouseId = ?,WarehouseSub1Id = ?,WarehouseSub2Id = ?, WarehouseSub3Name = ?,
  Modified = ?,Modifiedby = ?,RowsCount=?,ColumnCount=?  WHERE WarehouseSub3Id = ? `;
  var values = [Obj.WarehouseId, Obj.WarehouseSub1Id, Obj.WarehouseSub2Id,
  Obj.WarehouseSub3Name, Obj.Modified, Obj.ModifiedBy, Obj.RowsCount, Obj.ColumnCount, Obj.WarehouseSub3Id];
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "Warehouse Sublevel3 not updated!" }, null);
    result(null, { id: Obj.WarehouseSub3Id, ...Obj });
  });
};

//To remvoe WarehouseSublevel3
WarehouseSublevel3Model.remove = (id, result) => {
  con.query("Update tbl_warehouse_sublevel3 set IsDeleted=1 WHERE WarehouseSub3Id = ?", id, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "Warehouse Sublevel3 not deleted" }, null);
    return result(null, res);
  });
};
module.exports = WarehouseSublevel3Model;
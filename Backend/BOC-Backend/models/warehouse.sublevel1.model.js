/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const WarehouseSublevel1Model = function (objModel) {
  this.WarehouseSub1Id = objModel.WarehouseSub1Id;
  this.WarehouseId = objModel.WarehouseId ? objModel.WarehouseId : 0;
  this.WarehouseSub1Name = objModel.WarehouseSub1Name ? objModel.WarehouseSub1Name : '';
  this.Latitude = objModel.Latitude;
  this.Longitude = objModel.Longitude;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objModel.authuser && objModel.authuser.UserId) ? objModel.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objModel.authuser && objModel.authuser.UserId) ? objModel.authuser.UserId : TokenUserId;
};

//To get all the WarehouseSublevel1
WarehouseSublevel1Model.getAll = result => {
  con.query(`Select S1.*,W.WarehouseName from tbl_warehouse_sublevel1 as S1 
  LEFT JOIN tbl_warehouse as W ON W.WarehouseId = S1.WarehouseId
  where S1.IsDeleted=0
  
  `, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}

//To create a WarehouseSublevel1
WarehouseSublevel1Model.create = (Obj, result) => {
  var sql = `insert into tbl_warehouse_sublevel1(WarehouseId,WarehouseSub1Name,Created,CreatedBy,Latitude,Longitude) values(?,?,?,?,?,?)`;
  var values = [Obj.WarehouseId, Obj.WarehouseSub1Name, Obj.Created, Obj.CreatedBy, Obj.Latitude, Obj.Longitude];
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, { id: res.insertId, ...Obj });
  });
};

//To view WarehouseSublevel1
WarehouseSublevel1Model.findById = (WarehouseSub1Id, result) => {
  con.query(`SELECT * FROM tbl_warehouse_sublevel1 WHERE IsDeleted=0 and WarehouseSub1Id = ${WarehouseSub1Id}`, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res[0]);
    } else {
      return result({ msg: "Warehouse Sublevel1 not found" }, null);
    }
  });
};

//To view WarehouseSublevel1
WarehouseSublevel1Model.ListByWarehouse = (WarehouseId, result) => {
  con.query(`SELECT * FROM tbl_warehouse_sublevel1 WHERE IsDeleted=0 and WarehouseId = ${WarehouseId}`, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res[0]);
    } else {
      return result({ msg: "Warehouse Sublevel1 not found" }, null);
    }
  });
};

//To update the WarehouseSublevel1
WarehouseSublevel1Model.update = (Obj, result) => {
  var sql = ` UPDATE tbl_warehouse_sublevel1 SET WarehouseId = ?, WarehouseSub1Name = ?,
  Modified = ?,Modifiedby = ?, Latitude=?, Longitude=?  WHERE WarehouseSub1Id = ? `;
  var values = [Obj.WarehouseId, Obj.WarehouseSub1Name, Obj.Modified, Obj.Modifiedby, Obj.Latitude, Obj.Longitude, Obj.WarehouseSub1Id];
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "Warehouse Sublevel1 not updated!" }, null);
    result(null, { id: Obj.WarehouseSub1Id, ...Obj });
  });
};

//To remvoe WarehouseSublevel1
WarehouseSublevel1Model.remove = (id, result) => {
  con.query("Update tbl_warehouse_sublevel1 set IsDeleted=1 WHERE WarehouseSub1Id = ?", id, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "Warehouse Sublevel1 not deleted" }, null);
    return result(null, res);
  });
};
module.exports = WarehouseSublevel1Model;
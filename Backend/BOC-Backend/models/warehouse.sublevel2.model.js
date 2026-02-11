/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const WarehouseSublevel2Model = function (objModel) {
  this.WarehouseSub2Id = objModel.WarehouseSub2Id;
  this.WarehouseId = objModel.WarehouseId ? objModel.WarehouseId : 0;
  this.WarehouseSub1Id = objModel.WarehouseSub1Id ? objModel.WarehouseSub1Id : 0;
  this.WarehouseSub2Name = objModel.WarehouseSub2Name ? objModel.WarehouseSub2Name : '';
  this.Latitude = objModel.Latitude;
  this.Longitude = objModel.Longitude;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objModel.authuser && objModel.authuser.UserId) ? objModel.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objModel.authuser && objModel.authuser.UserId) ? objModel.authuser.UserId : TokenUserId;
};

//To get all the WarehouseSublevel2
WarehouseSublevel2Model.getAll = result => {
  con.query(`Select S2.*,W.WarehouseName,S1.WarehouseSub1Name 
  from tbl_warehouse_sublevel2 as S2 
  LEFT JOIN tbl_warehouse as W ON W.WarehouseId = S2.WarehouseId
  LEFT JOIN tbl_warehouse_sublevel1 as S1 ON S1.WarehouseSub1Id = S2.WarehouseSub1Id
  where S2.IsDeleted=0`, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}

//To create a WarehouseSublevel2
WarehouseSublevel2Model.create = (Obj, result) => {
  var sql = `insert into tbl_warehouse_sublevel2(WarehouseId,WarehouseSub1Id,WarehouseSub2Name,Created,CreatedBy,Latitude,Longitude) values(?,?,?,?,?,?,?)`;
  var values = [Obj.WarehouseId, Obj.WarehouseSub1Id, Obj.WarehouseSub2Name, Obj.Created, Obj.CreatedBy, Obj.Latitude, Obj.Longitude];
  // console.log("val="+values)
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, { id: res.insertId, ...Obj });
  });
};

//To view WarehouseSublevel2
WarehouseSublevel2Model.findById = (WarehouseSub2Id, result) => {
  con.query(`SELECT * FROM tbl_warehouse_sublevel2 WHERE IsDeleted=0 and WarehouseSub2Id = ${WarehouseSub2Id}`, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res[0]);
    } else {
      return result({ msg: "Warehouse Sublevel2 not found" }, null);
    }
  });
};

//To view WarehouseSublevel2
WarehouseSublevel2Model.ListByWarehouse = (WarehouseId, result) => {
  con.query(`SELECT * FROM tbl_warehouse_sublevel2 WHERE IsDeleted=0 and WarehouseId = ${WarehouseId}`, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res[0]);
    } else {
      return result({ msg: "Warehouse Sublevel2 not found" }, null);
    }
  });
};

//To update the WarehouseSublevel2
WarehouseSublevel2Model.update = (Obj, result) => {
  var sql = ` UPDATE tbl_warehouse_sublevel2 SET WarehouseId = ?,WarehouseSub1Id = ?, WarehouseSub2Name = ?,
  Modified = ?,Modifiedby = ?,Latitude=?,Longitude=?  WHERE WarehouseSub2Id = ? `;
  var values = [Obj.WarehouseId, Obj.WarehouseSub1Id, Obj.WarehouseSub2Name, Obj.Modified, Obj.Modifiedby, Obj.Latitude, Obj.Longitude, Obj.WarehouseSub2Id];
  // console.log("Update=" + values)
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "Warehouse Sublevel2 not updated!" }, null);
    result(null, { id: Obj.WarehouseSub2Id, ...Obj });
  });
};

//To remvoe WarehouseSublevel2
WarehouseSublevel2Model.remove = (id, result) => {
  con.query("Update tbl_warehouse_sublevel2 set IsDeleted=1 WHERE WarehouseSub2Id = ?", id, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "Warehouse Sublevel2 not deleted" }, null);
    return result(null, res);
  });
};
module.exports = WarehouseSublevel2Model;
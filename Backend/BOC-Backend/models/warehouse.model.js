/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");

const WarehouseModel = function (objWarehouse) {
  this.WarehouseId = objWarehouse.WarehouseId;
  this.WarehouseName = objWarehouse.WarehouseName;
  this.Status = objWarehouse.Status ? objWarehouse.Status : 1;
  this.Latitude = objWarehouse.Latitude;
  this.Longitude = objWarehouse.Longitude;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objWarehouse.authuser && objWarehouse.authuser.UserId) ? objWarehouse.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objWarehouse.authuser && objWarehouse.authuser.UserId) ? objWarehouse.authuser.UserId : TokenUserId;
};

//To create a Warehouse
WarehouseModel.create = (Warehouse, result) => {
  Warehouse = escapeSqlValues(Warehouse);
  var sql = `insert into tbl_warehouse(warehousename,Status,Created,CreatedBy,Latitude,Longitude) 
  values('${Warehouse.WarehouseName}','${Warehouse.Status}',
  '${Warehouse.Created}','${Warehouse.CreatedBy}','${Warehouse.Latitude}','${Warehouse.Longitude}')`;
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, { id: res.insertId, ...Warehouse });
  });
};

// To view Warehouse
WarehouseModel.findById = (WarehouseId, result) => {
  con.query(`Select * from tbl_warehouse where IsDeleted=0 and  WarehouseId='${WarehouseId}'`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ kind: "warehouse not found" }, null);
  });
}

// To get list of Warehouse
WarehouseModel.getAll = result => {
  con.query(`Select * from tbl_warehouse where IsDeleted=0 `, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
}

// To update Warehouse
WarehouseModel.updateById = (Warehouse, result) => {
  con.query(
    "UPDATE tbl_warehouse SET warehousename = ?,Modified = ?,  ModifiedBy = ?,Status = ?,Latitude = ?,Longitude = ? WHERE WarehouseId = ?",
    [Warehouse.WarehouseName, Warehouse.Modified, Warehouse.ModifiedBy,
    Warehouse.Status, Warehouse.Latitude, Warehouse.Longitude, Warehouse.WarehouseId],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "Warehouse not found" }, null);
        return;
      }
      result(null, { id: Warehouse.WarehouseId, ...Warehouse });
    }
  );
};

// To delete Warehouse
WarehouseModel.remove = (id, result) => {
  con.query("Update tbl_warehouse set IsDeleted=1 WHERE WarehouseId = ?", id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "Warehouse not deleted" }, null);
      return;
    }
    result(null, res);
  });
};

WarehouseModel.GetWareHouseByUserId = (UserId, result) => {
  var sql = `SELECT  a.WarehouseId, a.WarehouseName
  FROM ahoms.tbl_warehouse a
  INNER JOIN ahoms.tbl_users b
  ON FIND_IN_SET(a.WarehouseId, b.WarehouseIds) > 0
  WHERE b.UserId=${UserId}
  GROUP BY a.WarehouseId`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};
module.exports = WarehouseModel;


/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");
var async = require('async');

const InventoryDamage = function (objInventoryDamage) {
  this.ReceiveId = objInventoryDamage.ReceiveId;
  this.TransferId = objInventoryDamage.TransferId;
  this.TransferItemId = objInventoryDamage.TransferItemId;
  this.PartId = objInventoryDamage.PartId;
  this.PartItemId = objInventoryDamage.PartItemId;
  this.SellingPrice = objInventoryDamage.SellingPrice;
  this.WarehouseId = objInventoryDamage.WarehouseId;
  this.WarehouseSub1Id = objInventoryDamage.WarehouseSub1Id;
  this.WarehouseSub2Id = objInventoryDamage.WarehouseSub2Id;
  this.WarehouseSub3Id = objInventoryDamage.WarehouseSub3Id;
  this.WarehouseSub4Id = objInventoryDamage.WarehouseSub4Id;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objInventoryDamage.authuser && objInventoryDamage.authuser.UserId) ? objInventoryDamage.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objInventoryDamage.authuser && objInventoryDamage.authuser.UserId) ? objInventoryDamage.authuser.UserId : TokenUserId;
  this.IsDeleted = objInventoryDamage.IsDeleted ? objInventoryDamage.IsDeleted : 0;
  this.DamageType = objInventoryDamage.DamageType ? objInventoryDamage.DamageType : 0;
  this.Comments = objInventoryDamage.Comments ? objInventoryDamage.Comments : '';

}


InventoryDamage.InventoryDamageListServerSide = (dtObj, result) => {
  var query = "";
  var selectquery = `SELECT DamageId, PI.SerialNo, PI.PartId, PI.PartItemId, DamageType, Comments, DATE_FORMAT(ID.Created,'%m/%d/%Y') AS Created, PI.WarehouseId, PI.WarehouseSub1Id, PI.WarehouseSub2Id, PI.WarehouseSub3Id, PI.WarehouseSub4Id `
  recordfilterquery = `Select count(DamageId) as recordsFiltered `;
  query = query + `FROM tbl_inventory_damages ID
  LEFT JOIN tbl_parts_item PI ON PI.PartItemId = ID.PartItemId
  LEFT JOIN tbl_warehouse wh on wh.WarehouseId=PI.WarehouseId
  INNER JOIN tbl_users U ON find_in_set(PI.WarehouseId, U.WarehouseIds) AND U.UserId = ${global.authuser.UserId}`;

  if (dtObj.search.value != '') {
    query = query + ` and (  
            PI.SerialNo LIKE '%${dtObj.search.value}%'
            or DamageType LIKE '%${dtObj.search.value}%'   
        ) `;
  }
  var cvalue = 0;
  for (cvalue = 0; cvalue < dtObj.columns.length; cvalue++) {
    if (dtObj.columns[cvalue].search.value != "") {
      switch (dtObj.columns[cvalue].name) {
        case "SerialNo":
          query += " and ( PI.SerialNo = '" + dtObj.columns[cvalue].search.value + "' ) ";
          break;
        case "DamageType":
          query += " and ( DamageType = '" + dtObj.columns[cvalue].search.value + "' ) ";
          break;
        case "WarehouseId":
          query += " and ( wh.WarehouseId = '" + dtObj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + dtObj.columns[cvalue].name + " LIKE '%" + dtObj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  var i = 0;
  if (dtObj.order.length > 0) { query += " ORDER BY "; }
  for (i = 0; i < dtObj.order.length; i++) {
    if (dtObj.order[i].column != "" || dtObj.order[i].column == "0")// 0 is equal to ""
    {
      switch (dtObj.columns[dtObj.order[i].column].name) {
        case "SerialNo":
          query += " PI.SerialNo " + dtObj.order[i].dir + " ";
          break;
        case "DamageType":
          query += " DamageType " + dtObj.order[i].dir + " ";
          break;
        default:
          query += " " + dtObj.columns[dtObj.order[i].column].name + " " + dtObj.order[i].dir + " ";
      }
    }
  }

  var TotalCountQuery = `SELECT count(DamageId)  as TotalCount `;
  TotalCountQuery = TotalCountQuery + query;

  var Countquery = recordfilterquery + query;
  if (dtObj.start != "-1" && dtObj.length != "-1") {
    query += " LIMIT " + dtObj.start + "," + (dtObj.length);
  }



  query = selectquery + query;

  // console.log("query="+query)
  // console.log("Countquery="+Countquery)
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) return result(err, null);
      return result(null, { data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered, recordsTotal: results[2][0][0].TotalCount, draw: dtObj.draw });
    });
};

InventoryDamage.IsExistSerialNo = (SerialNo, result) => {
  var sql = `Select  PartItemId,PartId,  WarehouseId, 
  WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id from tbl_parts_item where SerialNo='${SerialNo}' and IsDeleted=0`;
 // console.log("sql==" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    //console.log(res);
    return result(null, res);
  });
};


InventoryDamage.create = (obj, result) => {
  obj = escapeSqlValues(obj);
  var sql = `insert into tbl_inventory_damages(
    PartId, PartItemId, DamageType, WarehouseId, 
    WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id, Comments,Created,CreatedBy)
  values(
  '${obj.PartId}','${obj.PartItemId}','${obj.DamageType}','${obj.WarehouseId}',
  '${obj.WarehouseSub1Id}','${obj.WarehouseSub2Id}','${obj.WarehouseSub3Id}',
  '${obj.WarehouseSub4Id}','${obj.Comments}','${obj.Created}','${obj.CreatedBy}')`;
  console.log("sql 1 =" + sql)
  con.query(sql, (err, res) => {
    if (err) return result(err, null);
    return result(null, { id: res.insertId, ...obj });
  });
};

InventoryDamage.update = (obj, result) => {
  obj = escapeSqlValues(obj);
  var sql = `update into tbl_inventory_damages
    PartId='${obj.PartId}', PartItemId='${obj.PartItemId}', DamageType'${obj.DamageType}', WarehouseId='${obj.WarehouseId}', 
    WarehouseSub1Id='${obj.WarehouseSub1Id}', WarehouseSub2Id='${obj.WarehouseSub2Id}', WarehouseSub3Id='${obj.WarehouseSub3Id}', WarehouseSub4Id='${obj.WarehouseSub4Id}'
    , Comments='${obj.Comments}',Created='${obj.Created}',CreatedBy='${obj.CreatedBy}' where DamageId='${obj.DamageId}'`;
  console.log("sql 1 =" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: " not found" }, null);
      return;
    }
    result(null, obj);
  }
  );
};
module.exports = InventoryDamage;
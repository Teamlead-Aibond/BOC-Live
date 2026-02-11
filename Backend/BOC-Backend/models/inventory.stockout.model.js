/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
var InventoryModel = require('./inventory.model')

const InventoryStockoutModel = function FuncName(obj) {
  this.StockOutId = obj.StockOutId ? obj.StockOutId : 0;
  this.InventoryId = obj.InventoryId ? obj.InventoryId : 0;
  this.PartId = obj.PartId ? obj.PartId : 0;
  this.PartItemId = obj.PartItemId ? obj.PartItemId : 0;
  this.RFIDTagNo = obj.RFIDTagNo ? obj.RFIDTagNo : 0;
  this.ReadyAntennaTime = obj.ReadyAntennaTime ? obj.ReadyAntennaTime : '';
  this.AcceptAntennaTime = obj.AcceptAntennaTime ? obj.AcceptAntennaTime : '';
  this.RFIDEmployeeNo = obj.RFIDEmployeeNo ? obj.RFIDEmployeeNo : '';
  this.StockOutRecord = obj.StockOutRecord ? obj.StockOutRecord : '';
  this.Status = obj.Status ? obj.Status : 0;
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();

  // For Server Side Search 
  this.start = obj.start;
  this.length = obj.length;
  this.search = obj.search;
  this.sortCol = obj.sortCol;
  this.sortDir = obj.sortDir;
  this.sortColName = obj.sortColName;
  this.order = obj.order;
  this.columns = obj.columns;
  this.draw = obj.draw;
};
// To create 
InventoryStockoutModel.create = (Jsonobj, result) => {

  var InvIds = Jsonobj.InventoryStockOutList.map(a => a.InventoryId);
  var duplicateCheck = `SELECT COUNT(1) AS Count FROM tbl_inventory_stockout WHERE InventoryId IN (${InvIds.join(",")})`;

  var Update_I
  con.query(duplicateCheck, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res[0].Count <= 0) {
      var sql = ``;
      sql = `insert into tbl_inventory_stockout(InventoryId,PartId,PartItemId
            ,RFIDTagNo,Status,Created,CreatedBy) values`;
      for (let obj of Jsonobj.InventoryStockOutList) {
        let val = new InventoryStockoutModel(obj);
        sql = sql + `('${val.InventoryId}','${val.PartId}','${val.PartItemId}'
        ,'${val.RFIDTagNo}','${val.Status}','${val.Created}',
        '${val.CreatedBy}'),`;


      }

      var Query = sql.slice(0, -1);
      //console.log("Final sql=" + Query);
      con.query(Query, (err, res) => {
        if (err) {
          return result(err, null);
        }
        for (let val of Jsonobj.InventoryStockOutList) {

          if (!Jsonobj.rfidEnabled)
            InventoryModel.UpdateInventoryStatustoOUT("OUT", val.InventoryId, () => { });
          val.StockOutId = res.insertId;
        }
        result(null, { id: res.insertId, ...Jsonobj });
      });
    } else {
      result("Duplicate stockout entries found! Please reset and try again!", null);
    }
  })

};//


InventoryStockoutModel.IsExistRFIDTagNoStockOut = (RFIDTagNo, result) => {
  var sql;
  sql = `SELECT StockOutId,InventoryId,PartItemId FROM tbl_inventory_stockout where IsDeleted=0 and RFIDTagNo='${RFIDTagNo}'`;
  //sql = `SELECT StockOutId,ISO.InventoryId,ISO.PartItemId FROM tbl_inventory_stockout ISO LEFT JOIN tbl_inventory I ON I.PartItemId = ISO.PartItemId where ISO.IsDeleted=0 and ISO.RFIDTagNo='${RFIDTagNo}' AND I.Status != 'IN'`;
  //console.log("SQL="+sql)
  con.query(sql, (err, res) => {
    if (err) { return result(err, null); }
    return result(null, res);
  });
};


// To create single row
InventoryStockoutModel.createsinglerow = (obj, result) => {
  // console.log(obj);
  var sql = ``;
  /* sql = `insert into tbl_inventory_stockout(InventoryId, PartId, PartItemId,
  RFIDTagNo, ReadyAntennaTime, AcceptAntennaTime, RFIDEmployeeNo, StockOutRecord, 
  Status, Created, CreatedBy)
  values('${obj.InventoryId}','${obj.PartId}','${obj.PartItemId}',
  '${obj.RFIDTagNo}', '${obj.ReadyAntennaTime}','${obj.AcceptAntennaTime}','${obj.RFIDEmployeeNo}', '${obj.StockOutRecord}',
  '${obj.Status}','${obj.Created}', '${obj.CreatedBy}') `; */

  var sql = `insert into tbl_inventory_stockout(InventoryId, PartId, PartItemId, RFIDTagNo, ReadyAntennaTime, AcceptAntennaTime, RFIDEmployeeNo, StockOutRecord, Status, Created, CreatedBy) values(?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [obj.InventoryId, obj.PartId, obj.PartItemId, obj.RFIDTagNo, obj.ReadyAntennaTime, obj.AcceptAntennaTime, obj.RFIDEmployeeNo, JSON.stringify(obj.StockOutRecord), obj.Status, obj.Created, obj.CreatedBy];

  //console.log("Final sql=" + sql);
  con.query(sql, values, (err, res) => {
    if (err) {
      return result(err, null);
    }
    result(null, { id: res.insertId, ...obj });
  });
};
//To get list
InventoryStockoutModel.list = result => {
  con.query(`SELECT ISO.InventoryId, P.PartNo, PI.PartItemId, PI.SerialNo, ISO.RFIDTagNo, DATE_FORMAT(ISO.Created,'%m/%d/%Y') AS Created,
  Case when I.IsAvailable=1 then 'Yes' else 'No' end as Available,
  wh.WarehouseName, whs1.WarehouseSub1Name, whs2.WarehouseSub2Name, whs3.WarehouseSub3Name, whs4.WarehouseSub4Name 
  FROM tbl_inventory_stockout ISO
  LEFT JOIN tbl_inventory I ON I.PartItemId=ISO.PartItemId 
  LEFT JOIN tbl_parts_item PI ON PI.PartItemId=ISO.PartItemId 
  LEFT JOIN tbl_parts P ON PI.PartId=P.PartId
  Left Join tbl_warehouse wh on wh.WarehouseId=PI.WarehouseId
  Left Join tbl_warehouse_sublevel1 whs1 on whs1.WarehouseSub1Id=PI.WarehouseSub1Id
  Left Join tbl_warehouse_sublevel2 whs2 on whs2.WarehouseSub2Id=PI.WarehouseSub2Id
  Left Join tbl_warehouse_sublevel3 whs3 on whs3.WarehouseSub3Id=PI.WarehouseSub3Id
  Left Join tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub4Id=PI.WarehouseSub4Id
  INNER JOIN tbl_users U ON find_in_set(P.WarehouseId, U.WarehouseIds) AND U.UserId = ${global.authuser.UserId} 
  WHERE ISO.IsDeleted=0 AND  P.PartNo IS NOT NULL`, (err, res) => {
    if (err) { return result(err, null); }
    return result(null, res);
  });
}



InventoryStockoutModel.StockOutListServerSide = (dtObj, result) => {
  var query = "";
  var selectquery = `SELECT  ISO.StockOutId, ISO.InventoryId, P.PartNo, PI.PartItemId, PI.SerialNo, ISO.RFIDTagNo, DATE_FORMAT(ISO.Created,'%m/%d/%Y %h:%i %p') AS Created,
  Case when I.IsAvailable=1 then 'Yes' else 'No' end as Available,
  wh.WarehouseName, whs1.WarehouseSub1Name, whs2.WarehouseSub2Name, whs3.WarehouseSub3Name, whs4.WarehouseSub4Name, ISO.RFIDEmployeeNo, 
  GROUP_CONCAT(emp.EmployeeName SEPARATOR ', ') AS employees `

  recordfilterquery = `Select count(ISO.StockOutId) as recordsFiltered, '' as display `;

  query = query + `FROM tbl_inventory_stockout ISO
  LEFT JOIN tbl_inventory I ON I.PartItemId=ISO.PartItemId 
  LEFT JOIN tbl_parts_item PI ON PI.PartItemId=ISO.PartItemId 
  LEFT JOIN tbl_parts P ON PI.PartId=P.PartId
  Left Join tbl_warehouse wh ON wh.WarehouseId=PI.WarehouseId
  Left Join tbl_warehouse_sublevel1 whs1 ON whs1.WarehouseSub1Id=PI.WarehouseSub1Id 
  Left Join tbl_warehouse_sublevel2 whs2 ON whs2.WarehouseSub2Id=PI.WarehouseSub2Id 
  Left Join tbl_warehouse_sublevel3 whs3 ON whs3.WarehouseSub3Id=PI.WarehouseSub3Id 
  Left Join tbl_warehouse_sublevel4 whs4 ON whs4.WarehouseSub4Id=PI.WarehouseSub4Id  
  Left Join tbl_employee emp ON find_in_set(emp.EmployeeNo, ISO.RFIDEmployeeNo) AND emp.IsDeleted = 0 
  Left JOIN tbl_users U ON find_in_set(P.WarehouseId, U.WarehouseIds) AND U.UserId = ${global.authuser.UserId} 
  where ISO.IsDeleted=0 AND ISO.Status=${dtObj.Status} `;



  if (dtObj.search.value != '') {
    query = query + ` and (  
           P.PartId LIKE '%${dtObj.search.value}%'
           or P.PartNo LIKE '%${dtObj.search.value}%'   
        ) `;
  }

  var cvalue = 0;
  for (cvalue = 0; cvalue < dtObj.columns.length; cvalue++) {
    if (dtObj.columns[cvalue].search.value != "") {
      if (dtObj.columns[cvalue].name.endsWith("Id")) {
        query += " and ( P." + dtObj.columns[cvalue].name + " = '" + dtObj.columns[cvalue].search.value + "' ) ";
      } else {
        query += " and ( P." + dtObj.columns[cvalue].name + " LIKE '%" + dtObj.columns[cvalue].search.value + "%' ) ";
      }

    }
  }

  var TotalCountQuery = `SELECT count(ISO.StockOutId)  as TotalCount, '' as display     `;
  TotalCountQuery = TotalCountQuery + query;

  query += " GROUP BY ISO.StockOutId,I.IsAvailable ";

  query += " ORDER BY " + "P." + dtObj.columns[dtObj.order[0].column].name + " " + dtObj.order[0].dir;


  var Countquery = recordfilterquery + query;

  if (dtObj.start != "-1" && dtObj.length != "-1") {
    query += " LIMIT " + dtObj.start + "," + (dtObj.length);
  }
  query = selectquery + query;

  console.log(query)
  console.log(Countquery)
  console.log(TotalCountQuery)

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {

      if (err) {
        console.log(err);
        return result(err, null);
      }

      var recordsFiltered = results[1][0] && results[1][0][0] && results[1][0][0].recordsFiltered ? results[1][0][0].recordsFiltered : 0;
      var TotalCount = results[2][0] && results[2][0][0] && results[2][0][0].recordsFiltered ? results[2][0][0].recordsFiltered : 0;

      return result(null, { data: results[0][0], recordsFiltered: recordsFiltered, recordsTotal: TotalCount, draw: dtObj.draw });
    }
  );
};
//To Delete
InventoryStockoutModel.Delete = (StockOutId, result) => {
  var sql = `UPDATE tbl_inventory_stockout SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE StockOutId = '${StockOutId}' `;
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "StockOut not deleted" }, null);
    return result(null, res);
  });
};

//To update the Stockout status once part exit successfully 
InventoryStockoutModel.StockOutSuccess = (StockOutId, result) => {
  var sql = `UPDATE tbl_inventory_stockout SET Status = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE StockOutId = '${StockOutId}' `;
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "StockOut not Updated" }, null);
    return result(null, res);
  });
};

//To Reset
InventoryStockoutModel.Reset = (result) => {
  var sql1 = `Update tbl_inventory SET Status = 'IN' WHERE InventoryId > 0`;
  var sql2 = `DELETE FROM tbl_inventory_stockout WHERE InventoryId > 0`;

  async.parallel([
    function (result) { con.query(sql1, result) },
    function (result) { con.query(sql2, result) }
  ],
    function (err, results) {
      if (err) return result(err, null);
      return result(null, { msg: "Checkout has been Reset!" });
    }
  );
};

module.exports = InventoryStockoutModel;
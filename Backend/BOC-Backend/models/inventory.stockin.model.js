/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');

const InventoryStockinModel = function FuncName(obj) {
  this.StockInId = obj.StockInId ? obj.StockInId : 0;
  this.InventoryId = obj.InventoryId ? obj.InventoryId : 0;
  this.RRId = obj.RRId ? obj.RRId : null;
  this.RRNo = obj.RRNo ? obj.RRNo : '';
  this.PartId = obj.PartId ? obj.PartId : 0;
  this.PartItemId = obj.PartItemId ? obj.PartItemId : 0;
  this.RFIDTagNo = obj.RFIDTagNo ? obj.RFIDTagNo : 0;
  this.Status = obj.Status ? obj.Status : 0;
  this.inventoryLocationAvailable = obj.inventoryLocationAvailable ? obj.inventoryLocationAvailable : 0;
  this.RFIDEmployeeNo = obj.RFIDEmployeeNo ? obj.RFIDEmployeeNo : null;
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

// Get Total Customer Count 
InventoryStockinModel.CheckRFIDTagExists = (obj, result) => {
  //con.query(`SELECT inventoryLocationAvailable FROM tbl_inventory_stockin ISI LEFT JOIN tbl_inventory I ON I.PartItemId = ISI.PartItemId WHERE ISI.RFIDTagNo = '${obj.RFIDTagNo}'  AND ISI.IsDeleted = 0  AND I.Status != 'IN' `, (err, res) => {
    con.query(`SELECT inventoryLocationAvailable FROM tbl_inventory_stockin WHERE RFIDTagNo = '${obj.RFIDTagNo}'  AND IsDeleted = 0 `, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    console.log(res);
    if (res && res.length > 0) {
      var inventoryLocationAvailable = res && res[0].inventoryLocationAvailable ? res[0].inventoryLocationAvailable : 0;
      result(null, {status:true, inventoryLocationAvailable : inventoryLocationAvailable});
      return;
    } else {
      result(null, {status:false, inventoryLocationAvailable : 0});
      return;
    }
  });
}

//To StockInListServerSide
InventoryStockinModel.StockInListServerSide = (dtObj, result) => {
  var query = "";
  var selectquery = `SELECT  ISI.StockInId, ISI.RRId, ISI.RRNo, ISI.InventoryId, P.PartNo, PI.PartItemId, PI.SerialNo, 
  ISI.RFIDTagNo, DATE_FORMAT(ISI.Created,'%m/%d/%Y %h:%i %p') AS Created,
  wh.WarehouseName, whs1.WarehouseSub1Name, whs2.WarehouseSub2Name, whs3.WarehouseSub3Name, whs4.WarehouseSub4Name, ISI.RFIDEmployeeNo, 
  GROUP_CONCAT(emp.EmployeeName SEPARATOR ', ') AS employees `
  recordfilterquery = `Select count(ISI.StockInId) as recordsFiltered `;
  query = query + `FROM tbl_inventory_stockin ISI
  LEFT JOIN tbl_inventory I ON I.PartItemId=ISI.PartItemId 
  LEFT JOIN tbl_parts_item PI ON PI.PartItemId=ISI.PartItemId 
  LEFT JOIN tbl_parts P ON PI.PartId=P.PartId
  Left Join tbl_warehouse wh ON wh.WarehouseId=PI.WarehouseId
  Left Join tbl_warehouse_sublevel1 whs1 ON whs1.WarehouseSub1Id=PI.WarehouseSub1Id
  Left Join tbl_warehouse_sublevel2 whs2 ON whs2.WarehouseSub2Id=PI.WarehouseSub2Id
  Left Join tbl_warehouse_sublevel3 whs3 ON whs3.WarehouseSub3Id=PI.WarehouseSub3Id
  Left Join tbl_warehouse_sublevel4 whs4 ON whs4.WarehouseSub4Id=PI.WarehouseSub4Id
  Left Join tbl_employee emp ON find_in_set(emp.EmployeeNo, ISI.RFIDEmployeeNo) AND emp.IsDeleted = 0 
  Left JOIN tbl_users U ON find_in_set(PI.WarehouseId, U.WarehouseIds) AND U.UserId = ${global.authuser.UserId}
  where ISI.IsDeleted=0 AND DATE(ISI.Created) = CURDATE() `; 
  // AND I.Status='IN' AND ISI.inventoryLocationAvailable=1 AND PI.WarehouseId>0 AND PI.WarehouseId IS NOT NULL 
  //Case when I.IsAvailable=1 then 'Yes' else 'No' end as Available,
  if (dtObj.search.value != '') {
    query = query + ` and (  
           P.PartId LIKE '%${dtObj.search.value}%'
           or P.PartNo LIKE '%${dtObj.search.value}%'   
        ) `;
  }
  var cvalue = 0;
  for (cvalue = 0; cvalue < dtObj.columns.length; cvalue++) {
    if (dtObj.columns[cvalue].search.value != "") {
      switch (dtObj.columns[cvalue].name) {
        case "PartItemId":
          query += " and ( PI.PartItemId = '" + dtObj.columns[cvalue].search.value + "' ) ";
          break;
        case "WarehouseId":
          query += " and ( wh.WarehouseId = '" + dtObj.columns[cvalue].search.value + "' ) ";
          break;
        case "InventoryId":
          query += " and ( ISI.InventoryId = '" + dtObj.columns[cvalue].search.value + "' ) ";
          break;
        case "SerialNo":
          query += " and ( PI.SerialNo = '" + dtObj.columns[cvalue].search.value + "' ) ";
          break;
        case "RFIDTagNo":
          query += " and ( ISI.RFIDTagNo = '" + dtObj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( ISI.Created Like '%" + dtObj.columns[cvalue].search.value + "%' ) ";
          break;
        default:
          query += " and ( " + dtObj.columns[cvalue].name + " LIKE '%" + dtObj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var TotalCountQuery = `SELECT count(ISI.StockInId)  as TotalCount `;
  TotalCountQuery = TotalCountQuery + query;
  var Countquery = recordfilterquery + query;  

  query += " GROUP BY ISI.StockInId ";  

  var i = 0;
  if (dtObj.order.length > 0) { query += " ORDER BY "; }
  for (i = 0; i < dtObj.order.length; i++) {
    if (dtObj.order[i].column != "" || dtObj.order[i].column == "0")// 0 is equal to ""
    {
      switch (dtObj.columns[dtObj.order[i].column].name) {
        case "PartItemId":
          query += " PI.PartItemId " + dtObj.order[i].dir + " ";
          break;
        case "InventoryId":
          query += " ISI.InventoryId " + dtObj.order[i].dir + " ";
          break;
        case "SerialNo":
          query += " PI.SerialNo " + dtObj.order[i].dir + "  ";
          break;
        case "RFIDTagNo":
          query += " ISI.RFIDTagNo " + dtObj.order[i].dir + "  ";
          break;
        case "Created":
          query += " ISI.Created " + dtObj.order[i].dir + "  ";
          break;
        default:
          query += " " + dtObj.columns[dtObj.order[i].column].name + " " + dtObj.order[i].dir + " ";
      }
    }
  }

  if (dtObj.start != "-1" && dtObj.length != "-1") {
    query += " LIMIT " + dtObj.start + "," + (dtObj.length);
  }

  query = selectquery + query;

   console.log("query="+query)
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

// To create 
InventoryStockinModel.create = (Jsonobj, result) => {
  var sql = ``;
  sql = `insert into tbl_inventory_stockin(InventoryId,RRId,RRNo,PartId,PartItemId,RFIDTagNo,Status,Created,CreatedBy) values`;
  for (let obj of Jsonobj.InventoryStockInList) {
    let val = new InventoryStockinModel(obj);
    sql = sql + `('${val.InventoryId}','${val.RRId}','${val.RRNo}','${val.PartId}','${val.PartItemId}'
  ,'${val.RFIDTagNo}','${val.Status}','${val.Created}',
  '${val.CreatedBy}'),`;
  }
  var Query = sql.slice(0, -1);
  // console.log("Final sql=" + Query);
  con.query(Query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    for (let val of Jsonobj.InventoryStockInList) {
      val.StockInId = res.insertId;
    }
    result(null, { id: res.insertId, ...Jsonobj });
  });
};//


InventoryStockinModel.createStockIn = (Jsonobj, result) => {
  var sql = ``;
  sql = `insert into tbl_inventory_stockin(InventoryId,RRId,RRNo,PartId,PartItemId,RFIDTagNo,Created,CreatedBy) values`;

  let val = new InventoryStockinModel(Jsonobj);
  sql = sql + `('${val.InventoryId}','${val.RRId}','${val.RRNo}','${val.PartId}','${val.PartItemId}'
  ,'${val.RFIDTagNo}','${val.Created}',
  '${val.CreatedBy}'),`;

  var Query = sql.slice(0, -1);
  // console.log("Final sql=" + Query);
  con.query(Query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    result(null, { id: res.insertId, ...Jsonobj });
  });
};//

InventoryStockinModel.createStockInQuery = (Jsonobj, result) => {
  var sql = ``;
  sql = `insert into tbl_inventory_stockin(InventoryId,RRId,RRNo,PartId,PartItemId,RFIDTagNo,Created,CreatedBy,inventoryLocationAvailable,RFIDEmployeeNo) values`;

  let val = new InventoryStockinModel(Jsonobj);
  sql = sql + `('${val.InventoryId}','${val.RRId}','${val.RRNo}','${val.PartId}','${val.PartItemId}'
  ,'${val.RFIDTagNo}','${val.Created}',
  '${val.CreatedBy}','${val.inventoryLocationAvailable}','${val.RFIDEmployeeNo}'),`;

  var Query = sql.slice(0, -1);
  // console.log("Final sql=" + Query);
  con.query(Query, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, res.insertId);
  });
};//

InventoryStockinModel.updateStockInQuery = (Jsonobj, result) => {
  var sql = ``;
  // sql = `insert into tbl_inventory_stockin(InventoryId,PartId,PartItemId,RFIDTagNo,Created,CreatedBy,inventoryLocationAvailable) values`;
  
  let val = new InventoryStockinModel(Jsonobj);
  if(val.RFIDEmployeeNo != null && val.RFIDEmployeeNo != ''){
    sql = `Update tbl_inventory_stockin set inventoryLocationAvailable=?,RFIDEmployeeNo=?, Modified=?, Modifiedby=? where PartId=? AND PartItemId=?`;
    var values = [ val.inventoryLocationAvailable, val.RFIDEmployeeNo, val.Modified, val.ModifiedBy,val.PartId,val.PartItemId ];
  }else{
    sql = `Update tbl_inventory_stockin set inventoryLocationAvailable=?, Modified=?, Modifiedby=? where PartId=? AND PartItemId=?`;
    var values = [ val.inventoryLocationAvailable,val.Modified, val.ModifiedBy,val.PartId,val.PartItemId ];
  }
  

  var Query = sql.slice(0, -1);
  // console.log("Final sql=" + Query);
  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, Jsonobj);
  });
};

//To get list
InventoryStockinModel.list = result => {
  con.query(`SELECT ISI.InventoryId, ISI,RRId, ISI.RRNo, P.PartNo, PI.PartItemId, PI.SerialNo, I.RFIDTagNo, I.DisplayRFID, DATE_FORMAT(ISI.Created,'%m/%d/%Y') AS Created,
  Case when I.IsAvailable=1 then 'Yes' else 'No' end as Available,
  wh.WarehouseName, whs1.WarehouseSub1Name, whs2.WarehouseSub2Name, whs3.WarehouseSub3Name, whs4.WarehouseSub4Name, ISI.RFIDEmployeeNo 
  FROM tbl_inventory_stockin ISI
  LEFT JOIN tbl_inventory I ON I.PartItemId=ISI.PartItemId 
  LEFT JOIN tbl_parts_item PI ON PI.PartItemId=ISI.PartItemId 
  LEFT JOIN tbl_parts P ON PI.PartId=P.PartId
  Left Join tbl_warehouse wh on wh.WarehouseId=PI.WarehouseId
  Left Join tbl_warehouse_sublevel1 whs1 on whs1.WarehouseSub1Id=PI.WarehouseSub1Id
  Left Join tbl_warehouse_sublevel2 whs2 on whs2.WarehouseSub2Id=PI.WarehouseSub2Id
  Left Join tbl_warehouse_sublevel3 whs3 on whs3.WarehouseSub3Id=PI.WarehouseSub3Id
  Left Join tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub4Id=PI.WarehouseSub4Id
  WHERE P.PartNo IS NOT NULL`, (err, res) => {
    if (err) { return result(err, null); }
    return result(null, res);
  });
}

InventoryStockinModel.StockInUpdatedList = (result) => {
  con.query(`SELECT ISI.StockInId, ISI.RFIDTagNo, ISI.inventoryLocationAvailable, WH.WarehouseName
  FROM tbl_inventory_stockin as ISI
  LEFT JOIN tbl_inventory I ON ISI.InventoryId = I.InventoryId
  LEFT JOIN tbl_warehouse WH on WH.WarehouseId = I.WarehouseId
  WHERE ISI.IsDeleted=0 AND DATE(ISI.Created) = CURDATE()
  AND ISI.inventoryLocationAvailable = 1 AND I.Status = 'IN'`, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    // console.log(res);
    if (res && res.length > 0) {
      result(null, res);
      return;
    } else {
      result({msg: "No data found!"}, null);
      return;
    }
  });
}
module.exports = InventoryStockinModel;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const InventoryStockinModel = require("./inventory.stockin.model.js");
const Constants = require("../config/constants.js");

const InventoryModel = function (objInventory) {
  this.InventoryId = objInventory.InventoryId;
  this.PartItemId = objInventory.PartItemId;
  this.PartId = objInventory.PartId;
  this.RFIDTagNo = objInventory.RFIDTagNo ? objInventory.RFIDTagNo : '';
  this.DisplayRFID = objInventory.DisplayRFID ? objInventory.DisplayRFID : '';
  this.StoredSince = objInventory.StoredSince ? objInventory.StoredSince : cDateTime.getDateTime();
  this.Quantity = objInventory.Quantity ? objInventory.Quantity : 1;
  this.IsAvailable = objInventory.IsAvailable ? objInventory.IsAvailable : 1;
  this.WarehouseId = objInventory.WarehouseId;
  this.WarehouseSub1Id = objInventory.WarehouseSub1Id;
  this.WarehouseSub2Id = objInventory.WarehouseSub2Id;
  this.WarehouseSub3Id = objInventory.WarehouseSub3Id;
  this.WarehouseSub4Id = objInventory.WarehouseSub4Id;
  this.Status = objInventory.Status ? objInventory.Status : "IN";
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objInventory.authuser && objInventory.authuser.UserId) ? objInventory.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objInventory.authuser && objInventory.authuser.UserId) ? objInventory.authuser.UserId : TokenUserId;
};

InventoryModel.CreateInventory = (body, result) => {
  var Obj = body;
  var sql = `insert into tbl_inventory(PartItemId, PartId, RFIDTagNo, DisplayRFID, Quantity, StoredSince, IsAvailable, WarehouseId, WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id, Status, Created, CreatedBy)
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  var values = [
    Obj.PartItemId, Obj.PartId, Obj.RFIDTagNo, Obj.DisplayRFID, Obj.Quantity, Obj.StoredSince,
    Obj.IsAvailable, Obj.WarehouseId, Obj.WarehouseSub1Id, Obj.WarehouseSub2Id, Obj.WarehouseSub3Id, Obj.WarehouseSub4Id,
    Obj.Status,
    Obj.Created, Obj.CreatedBy
  ]
  //console.log("CreateInventory values: ", values);
  con.query(sql, values, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    body.InventoryId = res.insertId;

    // InventoryHistory.CreateInventoryHistory(body, () => { });
    InventoryStockinModel.createStockIn(body, (err, r) => {
      if (err) {
        //console.log("error: ", err);
        result(err, null);
        return;
      }
      return result(null, { id: res.insertId, ...body });
    });

  });
};

InventoryModel.CreateInventoryQuery = (body, result) => {
  var Obj = body;
  var sql = `insert into tbl_inventory(PartItemId, PartId, RFIDTagNo, DisplayRFID, Quantity, StoredSince, IsAvailable, WarehouseId, WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id, Status, Created, CreatedBy)
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  var values = [
    Obj.PartItemId, Obj.PartId, Obj.RFIDTagNo, Obj.DisplayRFID, Obj.Quantity, Obj.StoredSince,
    Obj.IsAvailable, Obj.WarehouseId, Obj.WarehouseSub1Id, Obj.WarehouseSub2Id, Obj.WarehouseSub3Id, Obj.WarehouseSub4Id,
    Obj.Status,
    Obj.Created, Obj.CreatedBy
  ]
  //console.log("CreateInventory values: ", values);
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    body.inventoryLocationAvailable = 0;
    if (Obj.WarehouseId > 0 && Obj.WarehouseSub1Id > 0 && Obj.WarehouseSub2Id > 0 && Obj.WarehouseSub3Id > 0 && Obj.WarehouseSub4Id > 0) {
      body.inventoryLocationAvailable = 1;
    }
    //body.inventoryLocationAvailable = (Obj.WarehouseId > 0 && Obj.WarehouseSub1Id > 0 && Obj.WarehouseSub2Id > 0 && Obj.WarehouseSub3Id > 0 && Obj.WarehouseSub4Id > 0) ? 1 : 0;
    body.InventoryId = res.insertId;

    // InventoryHistory.CreateInventoryHistory(body, () => { });
    InventoryStockinModel.createStockInQuery(body, result);
  });
};

InventoryModel.InventoryListByServerSide = (dtObj, result) => {
  var query = "";
  var selectquery = `SELECT  P.*, M.VendorName as ManufacturerName,   W.WarehouseName as WarehouseName, 
  (SELECT COUNT(1) FROM tbl_parts_item AS PI WHERE PI.IsNew = 1 AND PI.PartId = P.PartId) AS NewCount,
  (SELECT COUNT(1) FROM tbl_parts_item AS PI WHERE PI.IsNew <> 1 AND PI.PartId = P.PartId) AS RefurbrishedCount,
  (SELECT SUM(SellingPrice) FROM tbl_parts_item AS PI WHERE PI.Status = 'IN' AND PI.PartId = P.PartId) AS TotalPrice,
  (select REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath from tbl_parts_images where  IsDeleted = 0 AND PartId=P.PartId limit 0,1) as PartImage `

  recordfilterquery = `Select count(P.PartId) as recordsFiltered `;

  query = query + ` FROM (SELECT distinct PartId,WarehouseId FROM tbl_inventory) as I
  LEFT JOIN tbl_parts as P ON I.PartId = P.PartId
  LEFT JOIN tbl_vendors as M ON M.VendorId = P.ManufacturerId
  LEFT JOIN tbl_parts_item as TPI ON PartId = P.PartId 
  LEFT JOIN tbl_warehouse as W ON W.WarehouseId = WarehouseId
  LEFT JOIN tbl_users U ON find_in_set(WarehouseId, U.WarehouseIds) AND U.UserId = ${global.authuser.UserId}
  where P.IsDeleted=0 AND  (WarehouseId IS NOT NULL AND WarehouseId>0)
  AND (WarehouseSub1Id IS NOT NULL AND WarehouseSub1Id>0)
  AND (WarehouseSub2Id IS NOT NULL AND WarehouseSub2Id>0)
  AND (WarehouseSub4Id IS NOT NULL AND WarehouseSub3Id>0)
  AND (WarehouseSub4Id IS NOT NULL AND WarehouseSub4Id>0)
  `;

  if (dtObj.search.value != '') {
    query = query + ` and (  P.PartId LIKE '%${dtObj.search.value}%'
          or P.PartNo LIKE '%${dtObj.search.value}%' 
          or P.Description LIKE '%${dtObj.search.value}%' 
          or P.Price LIKE '%${dtObj.search.value}%' 
        ) `;
  }

  var cvalue = 0;
  for (cvalue = 0; cvalue < dtObj.columns.length; cvalue++) {
    if (dtObj.columns[cvalue].search.value != "") {
      if (dtObj.columns[cvalue].name == "WarehouseId") {
        query += " and (" + dtObj.columns[cvalue].name + " = '" + dtObj.columns[cvalue].search.value + "' ) ";
      } else {
        if (dtObj.columns[cvalue].name.endsWith("Id")) {
          query += " and ( P." + dtObj.columns[cvalue].name + " = '" + dtObj.columns[cvalue].search.value + "' ) ";
        } else {
          query += " and ( P." + dtObj.columns[cvalue].name + " LIKE '%" + dtObj.columns[cvalue].search.value + "%' ) ";
        }
      }


    }
  }

  query += " ORDER BY " + "P." + dtObj.columns[dtObj.order[0].column].name + " " + dtObj.order[0].dir;


  var Countquery = recordfilterquery + query;

  if (dtObj.start != "-1" && dtObj.length != "-1") {
    query += " LIMIT " + dtObj.start + "," + (dtObj.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT count(P.PartId) as TotalCount FROM (SELECT distinct PartId FROM tbl_inventory) as I
  LEFT JOIN tbl_parts as P ON I.PartId = P.PartId
  WHERE P.PartId IS NOT NULL`;

  console.log(query);

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) return result(err, null);
      return result(null, { data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered, recordsTotal: results[2][0][0].TotalCount, draw: dtObj.draw });
    }
  );
};
// To Dashboard Statistics Count
InventoryModel.DashboardStatisticsCount = (Inv, result) => {
  const Fromdatearray = Inv.FromDate.split('T');
  const Todatearray = Inv.ToDate.split('T');
  var FromDate = Fromdatearray[0];
  var ToDate = Todatearray[0];
  var sql = `SELECT
  (SELECT Count(*) from tbl_inventory_stockin where
  InventoryId NOT IN (SELECT InventoryId FROM tbl_inventory_stockout) AND 
  DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}') as StockIn,
  (SELECT Count(*) from tbl_inventory_stockout where IsDeleted = 0 AND Status = 1 AND DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}') as StockOut,
  (SELECT Count(*)  from tbl_inventory_intent where IsDeleted=0 and DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}') as IntentRaised,
  (SELECT Count(*) from tbl_inventory_transfer where IsDeleted=0 and DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}') as TranferProduct,
  (SELECT Count(*) from tbl_inventory_received where IsDeleted=0 and DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}') as ReceiveProduct,
  (SELECT Count(*) from tbl_inventory_damages where IsDeleted=0 and DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}') as Damage `

  //console.log("IDC=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
// To RFID Dashboard Statistics Count
InventoryModel.RFIDDashboardStatisticsCount = (Inv, result) => {
  const Fromdatearray = Inv.FromDate.split('T');
  const Todatearray = Inv.ToDate.split('T');
  var FromDate = Fromdatearray[0];
  var ToDate = Todatearray[0];
  var sql = `SELECT
  (SELECT Count(*) from tbl_inventory_stockin where DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}') as StockIn,
  (SELECT Count(*) from tbl_inventory_stockout where IsDeleted = 0 AND Status=1 and DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}') as StockOut,
  (SELECT Count(*) from tbl_inventory_stockout where IsDeleted = 0 AND Status=0 and DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}') as ReadyForShipping,
  (SELECT Count(*) from tbl_inventory_damages where IsDeleted=0 and DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}') as Damage `

  // console.log("IDC=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

// To RFID Dashboard Statistics Count
InventoryModel.RFIDDashboardV1Statistics = (Inv, result) => {
  var sql = `SELECT
  (SELECT Count(*) from tbl_inventory_stockin where IsDeleted=0 AND inventoryLocationAvailable=1 AND DATE(Created) = CURDATE()) as StockIn,
  (SELECT Count(*) from tbl_inventory_stockout where IsDeleted = 0 AND Status=1 AND DATE(Created) = CURDATE()) as StockOut,
  (SELECT Count(*) from tbl_inventory where IsDeleted = 0 AND Status = "IN" AND WarehouseId > 0 AND WarehouseSub1Id > 0 AND WarehouseSub2Id > 0 AND WarehouseSub3Id > 0 AND WarehouseSub3Id > 0 AND WarehouseSub4Id > 0) as TotalInventory,
  (SELECT Count(*) from tbl_inventory where IsDeleted = 0 AND Status = "IN" AND (WarehouseId = 0 OR WarehouseSub1Id = 0 OR WarehouseSub2Id = 0 OR WarehouseSub3Id = 0 OR WarehouseSub3Id = 0 OR WarehouseSub4Id = 0)) as PendingInventory,
  (SELECT Count(*) from tbl_inventory where IsDeleted = 0 AND  DATE(Created) = CURDATE() AND WarehouseId > 0 AND WarehouseSub1Id > 0 AND WarehouseSub2Id > 0 AND WarehouseSub3Id > 0 AND WarehouseSub3Id > 0 AND WarehouseSub4Id > 0) as CurrentInventoryOld,
  (SELECT Count(*) from tbl_inventory_stockin where IsDeleted=0 AND inventoryLocationAvailable=1 AND DATE(Created) = CURDATE()) -  (SELECT Count(*) from tbl_inventory_stockout where IsDeleted = 0 AND Status=1 AND DATE(Created) = CURDATE()) as CurrentInventory
  `

  //console.log("IDC=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res[0]);
  });
};

InventoryModel.Top5StockInlistQuery = () => {
  var Top5StockInlistQuery = ``;
  Top5StockInlistQuery = `SELECT ISI.StockInId ,P.PartNo,PI.SerialNo,ISI.RFIDTagNo,DATE_FORMAT(ISI.Created,'%Y-%m-%d %H:%i:%s') AS Created
  FROM tbl_inventory_stockin ISI
  LEFT JOIN tbl_parts P ON ISI.PartId=P.PartId
  LEFT JOIN tbl_parts_item PI ON ISI.PartItemId=PI.PartItemId where ISI.IsDeleted=0 Order By ISI.StockInId desc Limit 0,5 `;
  return Top5StockInlistQuery;
};
InventoryModel.Top5StockOutlistQuery = () => {
  var Top5StockInlistQuery = ``;
  Top5StockInlistQuery = `SELECT P.PartNo,PI.SerialNo,ISO.RFIDTagNo,DATE_FORMAT(ISO.Created,'%Y-%m-%d %H:%i:%s') AS Created
  FROM tbl_inventory_stockout ISO
  LEFT JOIN tbl_parts P ON ISO.PartId=P.PartId
  LEFT JOIN tbl_parts_item PI ON ISO.PartItemId=PI.PartItemId where ISO.Status=1 and ISO.IsDeleted=0 Order By ISO.StockOutId desc Limit 0,5 `;
  return Top5StockInlistQuery;
};
InventoryModel.Top5StockOutInWarehouseQuery = () => {
  var Top5StockInlistQuery = ``;
  Top5StockInlistQuery = `SELECT P.PartNo,PI.SerialNo,ISO.RFIDTagNo,DATE_FORMAT(ISO.Created,'%Y-%m-%d %H:%i:%s') AS Created
  FROM tbl_inventory_stockout ISO
  LEFT JOIN tbl_parts P ON ISO.PartId=P.PartId
  LEFT JOIN tbl_parts_item PI ON ISO.PartItemId=PI.PartItemId where ISO.Status=0 and ISO.IsDeleted=0 Order By ISO.StockOutId desc Limit 0,5 `;
  return Top5StockInlistQuery;
};

InventoryModel.Top5PartsExistWithOutEntryQuery = () => {
  var Top5StockInlistQuery = ``;
  Top5StockInlistQuery = `Select pi.PartNo,ilp.RFIDTagNo,pi.SerialNo,DATE_FORMAT(ilp.Created,'%Y-%m-%d %H:%i:%s') AS Created 
  from ahoms.tbl_inventory_loss_prevention_log ilp
  Inner Join ahoms.tbl_parts pi on pi.PartId=ilp.PartId
  where ilp.IsDeleted=0 Order By ilp.LossPreventionLogId desc Limit 0,5`;
  return Top5StockInlistQuery;
};
//Latest StockIn StockOut List
InventoryModel.LatestStockInStockOutList = (ObjInventory, result) => {

  var Top5StockInlistQuery = InventoryModel.Top5StockInlistQuery();
  var Top5StockOutlistQuery = InventoryModel.Top5StockOutlistQuery();
  var Top5StockOutInWarehouseQueryy = InventoryModel.Top5StockOutInWarehouseQuery();
  var Top5PartsExistWithOutEntryQuery = InventoryModel.Top5PartsExistWithOutEntryQuery();
  async.parallel([
    function (result) { con.query(Top5StockInlistQuery, result) },
    function (result) { con.query(Top5StockOutlistQuery, result) },
    function (result) { con.query(Top5StockOutInWarehouseQueryy, result) },
    function (result) { con.query(Top5PartsExistWithOutEntryQuery, result) }
  ],
    function (err, results) {
      if (err) { return result(err, null); }
      if (results[0][0].length > 0 || results[1][0].length > 0 || results[2][0].length > 0) {
        return result(null, { StockInList: results[0][0], StockOutlist: results[1][0], StockOutWarehouse: results[2][0], PartsExistWithOutEntry: results[3][0] });
      } else {
        return result({ msg: "No-Record" }, null);
      }
    });
};
// To StockOutLineChartDayWise
InventoryModel.StockOutLineChartDayWise = (FromDate, ToDate) => {
  var sql = `SELECT DATE_FORMAT(Created,'%Y-%m-%d') as Date,StockOut from (SELECT Cast(Created as Date) as Created,Count(StockOutId) as StockOut
  FROM tbl_inventory_stockout  where Status=1
  AND (DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}')
  Group By Cast(Created as Date)) as A `
  //console.log("IDC=" + sql)
  return sql;
};
// To StockOutWarehouseLineChartDayWise
InventoryModel.StockOutWarehouseLineChartDayWise = (FromDate, ToDate) => {
  var sql = `SELECT DATE_FORMAT(Created,'%Y-%m-%d') as Date,StockOut from (SELECT Cast(Created as Date) as Created,Count(StockOutId) as StockOut
  FROM tbl_inventory_stockout  where 1=1 and Status=0
  AND (DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}')
  Group By Cast(Created as Date)) as A `
  //console.log("IDC=" + sql)
  return sql;
};
// To StockOutWarehouseLineChartDayWise
InventoryModel.StockInLineChartDayWise = (FromDate, ToDate) => {
  var sql = `SELECT DATE_FORMAT(Created,'%Y-%m-%d') as Date,StockIn from (SELECT Cast(Created as Date) as Created,Count(StockInId) as StockIn
  FROM tbl_inventory_stockin  where
  DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}'
  Group By Cast(Created as Date)) as A `
  //console.log("IDC=" + sql)
  return sql;

};
//LineChartDayWise
InventoryModel.LineChartDayWise = (ObjInventory, result) => {
  const Fromdatearray = ObjInventory.FromDate.split('T');
  const Todatearray = ObjInventory.ToDate.split('T');
  var FromDate = Fromdatearray[0];
  var ToDate = Todatearray[0];
  var StockInLineChartDayWise = InventoryModel.StockInLineChartDayWise(FromDate, ToDate);
  var StockOutLineChartDayWise = InventoryModel.StockOutLineChartDayWise(FromDate, ToDate);
  var StockOutWarehouseLineChartDayWise = InventoryModel.StockOutWarehouseLineChartDayWise(FromDate, ToDate);
  async.parallel([
    function (result) { con.query(StockInLineChartDayWise, result) },
    function (result) { con.query(StockOutLineChartDayWise, result) },
    function (result) { con.query(StockOutWarehouseLineChartDayWise, result) }
  ],
    function (err, results) {
      if (err) { return result(err, null); }
      //console.log("" + results[0][0].length)
      if (results[0][0].length > 0 || results[1][0].length > 0 || results[2][0].length > 0) {
        return result(null, { StockIn: results[0][0], StockOut: results[1][0], ReadyForShipping: results[2][0] });
      } else {
        return result({ msg: "No-Record" }, null);
      }
    });
};

InventoryModel.DashboardSummaryStatisticsCount = (Inv, result) => {

  var sql = `Select (SELECT Count(*) from ahoms.tbl_parts where IsDeleted=0 and OpeningStock=0) as OutOfStockItems,
  0 as OrdersPlaced,0 as OrdersReceived
  ,(SELECT Count(*) from ahoms.tbl_parts where IsDeleted=0 and OpeningStock < MinStock) as LowStockItems
  ,(SELECT Count(*) from ahoms.tbl_inventory_stockout where IsDeleted=0 and Status=0) as ReadyForShipping;
  `;
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
//PartItem Count By Manufacturer
InventoryModel.PartItemCountByManufacturer = (obj, result) => {
  var Ids = ``;
  for (let val of obj.Manufacturer) {
    Ids += val.ManufacturerId + `,`;
  }
  var ManufacturerIds = Ids.slice(0, -1);
  var sql = `SELECT P.PartNo,COUNT(PI.PartItemId) Count FROM tbl_parts AS P
  LEFT JOIN tbl_parts_item AS PI on PI.PartId = P.PartId where P.IsDeleted=0 `;
  if (ManufacturerIds != '' && ManufacturerIds != null) {
    sql = sql + ` and P.ManufacturerId In (${ManufacturerIds}) `;
  }
  if (obj.PartNo != '' && obj.PartNo != "undefined") {
    sql = sql + ` and P.PartNo='${obj.PartNo}' `;
  }
  sql = sql + ` Group By P.PartNo `;
  //console.log("SQL=" + sql)
  con.query(sql, (err, res) => {
    if (err) { return result(err, null); }
    return result(null, res);
  });
};
//IsExistRFIDTagNo
InventoryModel.IsExistRFIDTagNo = (RFIDTagNo, result) => {
  var sql;
  sql = `SELECT InventoryId,PartId,PartItemId,Status,RFIDTagNo FROM tbl_inventory 
  WHERE IsDeleted=0 AND RFIDTagNo='${RFIDTagNo}'  
  AND (WarehouseId IS NOT NULL AND WarehouseId>0)
  AND (WarehouseSub1Id IS NOT NULL AND WarehouseSub1Id>0)
  AND (WarehouseSub2Id IS NOT NULL AND WarehouseSub2Id>0)
  AND (WarehouseSub4Id IS NOT NULL AND WarehouseSub3Id>0)
  AND (WarehouseSub4Id IS NOT NULL AND WarehouseSub4Id>0)`;
  //console.log("SQL=" + sql)
  con.query(sql, (err, res) => {
    if (err) { return result(err, null); }
    return result(null, res);
  });
};
//UpdateInventoryStatustoOUT
InventoryModel.UpdateInventoryStatustoOUT = (Status, InventoryId, result) => {

  var sql = `Update tbl_inventory set Status=?,Modified=?,ModifiedBy=? where InventoryId=? `;
  var values = [Status, cDateTime.getDateTime(), global.authuser.UserId, InventoryId];
  //console.log(values);
  con.query(sql, values, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.affectedRows == 0) {
      return result({ kind: "Inventory Not Found" }, null);
    }
    return result(null, res);

  });
};

InventoryModel.UpdateInventoryQuery = (body, result) => {
  var Obj = body;
  // var sql = `insert into tbl_inventory(PartItemId, PartId, RFIDTagNo, DisplayRFID, Quantity, StoredSince, IsAvailable, WarehouseId, WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id, Status, Created, CreatedBy)
  //   values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var sql = `Update tbl_inventory set RFIDTagNo=?, DisplayRFID=?, Quantity=?, StoredSince=?, IsAvailable=?, WarehouseId=?, WarehouseSub1Id=?, WarehouseSub2Id=?, WarehouseSub3Id=?, WarehouseSub4Id=?, Status=?,  Modified=?, Modifiedby=? where PartItemId=? AND PartId=?`;
  var values = [
    Obj.RFIDTagNo, Obj.DisplayRFID, Obj.Quantity, Obj.StoredSince,
    Obj.IsAvailable, Obj.WarehouseId, Obj.WarehouseSub1Id, Obj.WarehouseSub2Id, Obj.WarehouseSub3Id, Obj.WarehouseSub4Id,
    Obj.Status,
    Obj.Modified, Obj.ModifiedBy, Obj.PartItemId, Obj.PartId
  ]
  //console.log("CreateInventory values: ", values);
  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    body.inventoryLocationAvailable = 0;
    if (Obj.WarehouseId > 0 && Obj.WarehouseSub1Id > 0 && Obj.WarehouseSub2Id > 0 && Obj.WarehouseSub3Id > 0 && Obj.WarehouseSub4Id > 0) {
      body.inventoryLocationAvailable = 1;
    }
    //body.inventoryLocationAvailable = (Obj.WarehouseId > 0 && Obj.WarehouseSub1Id > 0 && Obj.WarehouseSub2Id > 0 && Obj.WarehouseSub3Id > 0 && Obj.WarehouseSub4Id > 0)  ? 1 : 0;
    // body.InventoryId = res.insertId;

    // InventoryHistory.CreateInventoryHistory(body, () => { });
    InventoryStockinModel.updateStockInQuery(body, result);
  });
};
module.exports = InventoryModel;
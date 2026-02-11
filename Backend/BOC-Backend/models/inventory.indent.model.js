/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const InventoryIndent = function (objIndent) {

  this.IntentId = objIndent.IntentId;
  this.IntentRequestNo = objIndent.IntentRequestNo;
  this.WarehouseId = objIndent.WarehouseId;
  this.PartId = objIndent.PartId;
  this.PartNo = objIndent.PartNo;
  this.Quantity = objIndent.Quantity ? objIndent.Quantity : 0;
  this.Status = objIndent.Status;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objIndent.authuser && objIndent.authuser.UserId) ? objIndent.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objIndent.authuser && objIndent.authuser.UserId) ? objIndent.authuser.UserId : TokenUserId;
  this.IsDeleted = objIndent.IsDeleted ? objIndent.IsDeleted : 0;

  // For Server Side Search 
  this.start = objIndent.start;
  this.length = objIndent.length;
  this.search = objIndent.search;
  this.sortCol = objIndent.sortCol;
  this.sortDir = objIndent.sortDir;
  this.sortColName = objIndent.sortColName;
  this.order = objIndent.order;
  this.columns = objIndent.columns;
  this.draw = objIndent.draw;
}


InventoryIndent.createOld = (Indent1, result) => {

  var sql = ``;
  sql = `insert into tbl_inventory_intent(IntentRequestNo, WarehouseId, PartId, PartNo, Quantity, Status,Created, CreatedBy,IsDeleted)
    values(?,?,?,?,?,?,?,?,?)`;

  var values = [

    Indent1.IntentRequestNo, Indent1.WarehouseId, Indent1.PartId, Indent1.PartNo, Indent1.Quantity
    , Indent1.Status, Indent1.Created, Indent1.CreatedBy, Indent1.IsDeleted

  ]
  //console.log(sql + values);
  con.query(sql, values, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...Indent1 });
  });
};

InventoryIndent.create = (indent, result) => {

  var checkSql = `SELECT PartId, PartNo FROM tbl_parts WHERE PartNo = '${indent.PartNo}'`

  con.query(checkSql, (err, checkRes) => {
    if (checkRes.length > 0) {
      var sql = ``;
      sql = `insert into tbl_inventory_intent(IntentRequestNo, WarehouseId, PartId, PartNo, Quantity, Status,Created, CreatedBy,IsDeleted)
              values(?,?,?,?,?,?,?,?,?)`;

      var resObj = checkRes[0];
      var indentRequestNumber = "IR-" + Math.floor(100000 + Math.random() * 900000);
      var indentObj = new InventoryIndent(indent);
      var values = [

        indentRequestNumber, indentObj.WarehouseId, resObj.PartId, resObj.PartNo, indentObj.Quantity
        , 0, indentObj.Created, indentObj.CreatedBy, indentObj.IsDeleted

      ]
      //console.log(sql + values);
      con.query(sql, values, (err, res) => {
        if (err) {
          // console.log("error: ", err);
          result(err, null);
          return;
        }

        result(null, { id: res.insertId, ...indentObj });
      });
    } else {
      result({ message: "Part Number not found!" }, null);
    }
  })

};


InventoryIndent.InventoryIndentListByServerSide = (InventoryIndent1, result) => {

  var query = "";
  selectquery = "";

  selectquery = `Select wr.WarehouseName,ii.IntentRequestNo,ii.PartNo,ii.Quantity as RequestedQty,0 as TransferQty,ur.FirstName
  ,DATE_FORMAT(ii.Created, '%m/%d/%Y') as Date `;

  recordfilterquery = `Select count(*) as recordsFiltered `;

  query = query + ` from tbl_inventory_intent ii
  Inner Join tbl_warehouse wr on wr.WarehouseId=ii.WarehouseId
  Left Join tbl_users ur on ur.UserId=ii.Createdby 
  WHERE ii.IsDeleted=0 `;



  if (InventoryIndent1.search.value != '') {
    query = query + ` and (  wr.WarehouseName LIKE '%${InventoryIndent1.search.value}%'
      or ii.IntentRequestNo LIKE '%${InventoryIndent1.search.value}%' 
      or ii.PartNo LIKE '%${InventoryIndent1.search.value}%' 
      or ii.Quantity LIKE '%${InventoryIndent1.search.value}%' 
      or ii.Created LIKE '%${InventoryIndent1.search.value}%'
      ) `;
  }

  var cvalue = 0;
  //console.log("RR=" + InventoryIndent1.columns[0].search.value);
  for (cvalue = 0; cvalue < InventoryIndent1.columns.length; cvalue++) {
    if (InventoryIndent1.columns[cvalue].search.value != "") {
      if (InventoryIndent1.columns[cvalue].search.value == "true") {
        InventoryIndent1.columns[cvalue].search.value = "1";
      }
      if (InventoryIndent1.columns[cvalue].search.value == "false") {
        InventoryIndent1.columns[cvalue].search.value = "0";
      }
      switch (InventoryIndent1.columns[cvalue].name) {
        case "WarehouseName":
          query += " and ( wr.WarehouseId ='" + InventoryIndent1.columns[cvalue].search.value + "' ) ";
          break;
        case "IntentRequestNo":
          query += " and ( ii.IntentRequestNo LIKE '%" + InventoryIndent1.columns[cvalue].search.value + "%' ) ";
          break;
        case "PartNo":
          query += " and ( ii.PartNo LIKE '%" + InventoryIndent1.columns[cvalue].search.value + "%' ) ";
          break;
        case "Quantity":
          query += " and ( ii.Quantity LIKE '%" + InventoryIndent1.columns[cvalue].search.value + "%' ) ";
          break;
        default:
          query += " and ( " + InventoryIndent1.columns[cvalue].name + " LIKE '%" + InventoryIndent1.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var i = 0;
  if (InventoryIndent1.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < InventoryIndent1.order.length; i++) {
    if (InventoryIndent1.order[i].column != "" || InventoryIndent1.order[i].column == "0")// 0 is equal to ""
    {
      switch (InventoryIndent1.columns[InventoryIndent1.order[i].column].name) {
        case "WarehouseName":
          query += " wr.WarehouseName " + InventoryIndent1.order[i].dir + ",";
          break;

        case "IntentRequestNo":
          query += " ii.IntentRequestNo " + InventoryIndent1.order[i].dir + ",";
          break;

        case "PartNo":
          query += " ii.PartNo " + InventoryIndent1.order[i].dir + ",";
          break;
        case "Quantity":
          query += " ii.Quantity " + InventoryIndent1.order[i].dir + ",";
          break;

        default://could be any column except above 
          query += " " + InventoryIndent1.columns[InventoryIndent1.order[i].column].name + " " + InventoryIndent1.order[i].dir + ",";

      }
    }
  }
  //console.log("before query slice =" + query);

  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (InventoryIndent1.start != "-1" && InventoryIndent1.length != "-1") {
    query += " LIMIT " + InventoryIndent1.start + "," + (InventoryIndent1.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(*) as TotalCount 
  from ahoms.tbl_inventory_intent ii
Inner Join ahoms.tbl_warehouse wr on wr.WarehouseId=ii.WarehouseId
Left Join ahoms.tbl_users ur on ur.UserId=ii.Createdby
  WHERE ii.IsDeleted=0 `;

  //console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      //console.log("TotalCount : " + results[2][0][0].TotalCount)
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: InventoryIndent1.draw
      });
      return;
    });
};

InventoryIndent.InventoryTransferListByServerSide = (body, result) => {
  if (body.TransferType == "1") {
    InventoryIndent.StockInForTransferListServerSide(body, result);
  } else {
    InventoryIndent.GetInventoryItemsByIndentNo(body, result);
  }
};

InventoryIndent.StockInForTransferListServerSide = (dtObj, result) => {
  var query = "";
  var selectquery = `SELECT  ISI.StockInId, ISI.InventoryId, P.PartNo, P.PartId, PI.PartItemId, PI.SerialNo, PI.WarehouseId, PI.WarehouseSub1Id, PI.WarehouseSub2Id, PI.WarehouseSub3Id, PI.WarehouseSub4Id,
  ISI.RFIDTagNo, DATE_FORMAT(ISI.Created,'%m/%d/%Y') AS Created,
  Case when I.IsAvailable=1 then 'Yes' else 'No' end as Available,
  wh.WarehouseName, whs1.WarehouseSub1Name, whs2.WarehouseSub2Name, whs3.WarehouseSub3Name, whs4.WarehouseSub4Name  `
  recordfilterquery = `Select count(ISI.StockInId) as recordsFiltered `;
  query = query + `FROM tbl_inventory_stockin ISI
  LEFT JOIN tbl_inventory I ON I.PartItemId=ISI.PartItemId 
  LEFT JOIN tbl_parts_item PI ON PI.PartItemId=ISI.PartItemId 
  LEFT JOIN tbl_parts P ON PI.PartId=P.PartId
  Left Join tbl_warehouse wh on wh.WarehouseId=PI.WarehouseId
  Left Join tbl_warehouse_sublevel1 whs1 on whs1.WarehouseSub1Id=PI.WarehouseSub1Id
  Left Join tbl_warehouse_sublevel2 whs2 on whs2.WarehouseSub2Id=PI.WarehouseSub2Id
  Left Join tbl_warehouse_sublevel3 whs3 on whs3.WarehouseSub3Id=PI.WarehouseSub3Id
  Left Join tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub4Id=PI.WarehouseSub4Id
  INNER JOIN tbl_users U ON find_in_set(P.WarehouseId, U.WarehouseIds) AND U.UserId = ${global.authuser.UserId}
  where ISI.IsDeleted=0  `;
  if (dtObj.search.value != '') {
    query = query + ` and (  
           P.PartId LIKE '%${dtObj.search.value}%'
           or P.PartNo LIKE '%${dtObj.search.value}%'   
        ) `;
  }
  var cvalue = 0;

  if (dtObj.WarehouseId) {
    query += ` and ( wh.WarehouseId = '${dtObj.WarehouseId}' ) `;
  } if (dtObj.WarehouseSub1Id) {
    query += ` and ( whs1.WarehouseSub1Id = '${dtObj.WarehouseSub1Id}' ) `;
  } if (dtObj.WarehouseSub2Id) {
    query += ` and ( whs2.WarehouseSub2Id = '${dtObj.WarehouseSub2Id}' ) `;
  } if (dtObj.WarehouseSub3Id) {
    query += ` and ( whs3.WarehouseSub3Id = '${dtObj.WarehouseSub3Id}' ) `;
  } if (dtObj.WarehouseSub4Id) {
    query += ` and ( whs4.WarehouseSub4Id = '${dtObj.WarehouseSub4Id}' ) `;
  }

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

  var TotalCountQuery = `SELECT count(ISI.StockInId)  as TotalCount `;
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

InventoryIndent.GetInventoryItemsByIndentNo = (dtObj, result) => {

  var selectquery = `SELECT P.PartId, PI.PartItemId, I.Created, II.IntentRequestNo, II.IntentId, II.WarehouseId AS WarehouseToId, I.WarehouseId, I.WarehouseSub1Id, I.WarehouseSub2Id, I.WarehouseSub3Id, I.WarehouseSub4Id, II.Quantity AS IndentQuantity, P.PartNo, PI.SerialNo, W.WarehouseName, W1.WarehouseSub1Name, W2.WarehouseSub2Name, W3.WarehouseSub3Name, W4.WarehouseSub4Name `;

  let recordfilterquery = `Select count(PI.PartItemId) as recordsFiltered `;

  let query = `FROM tbl_inventory I
  LEFT JOIN tbl_parts_item PI ON PI.PartItemId = I.PartItemId
  LEFT JOIN tbl_parts P ON PI.PartId = P.PartId
  INNER JOIN tbl_inventory_intent II ON II.PartId = P.PartId AND II.WarehouseId != I.WarehouseId
  INNER JOIN tbl_warehouse W ON I.WarehouseId = W.WarehouseId
  INNER JOIN tbl_users U ON find_in_set(I.WarehouseId, U.WarehouseIds) AND U.UserId = ${global.authuser.UserId}
  LEFT JOIN tbl_warehouse_sublevel1 W1 ON I.WarehouseSub1Id = W1.WarehouseSub1Id
  LEFT JOIN tbl_warehouse_sublevel2 W2 ON I.WarehouseSub2Id = W2.WarehouseSub2Id
  LEFT JOIN tbl_warehouse_sublevel3 W3 ON I.WarehouseSub3Id = W3.WarehouseSub3Id
  LEFT JOIN tbl_warehouse_sublevel4 W4 ON I.WarehouseSub4Id = W4.WarehouseSub4Id 
  WHERE II.IntentRequestNo = '${dtObj.IndentRequestNo}' AND I.Status = 'IN' 
  AND I.InventoryId NOT IN (SELECT InventoryId FROM tbl_inventory_stockout)`;

  var TotalCountQuery = `SELECT count(PI.PartItemId)  as TotalCount `;
  TotalCountQuery = TotalCountQuery + query;


  if (dtObj.start != "-1" && dtObj.length != "-1") {
    query += " LIMIT " + dtObj.start + "," + (dtObj.length);
  }

  var Countquery = recordfilterquery + query;

  selectquery = selectquery + query;

  let indentSql = `SELECT IntentId, IntentRequestNo, '2' AS TransferType, WarehouseId, PartId, PartNo, Quantity FROM tbl_inventory_intent
  WHERE IntentRequestNo = '${dtObj.IndentRequestNo}'`;

  async.parallel([
    function (result) { con.query(selectquery, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) },
    function (result) { con.query(indentSql, result) }
  ], (err, results) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered, recordsTotal: results[2][0][0].TotalCount, draw: dtObj.draw, indent: results[3][0][0] });
  });
}

module.exports = InventoryIndent;
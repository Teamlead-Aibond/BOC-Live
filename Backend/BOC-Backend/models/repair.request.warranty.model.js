/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
var async = require('async');
const WarrantyModel = function FuncName(Obj) {
  this.WarrantyId = Obj.WarrantyId;
  this.RRId = Obj.RRId;
  this.WarrantyPeriod = Obj.WarrantyPeriod ? Obj.WarrantyPeriod : null;
  this.WarrantyStartDate = Obj.WarrantyStartDate ? Obj.WarrantyStartDate : null;
  this.WarrantyEndDate = Obj.WarrantyEndDate ? Obj.WarrantyEndDate : null;
  this.WarrantyActivatedDate = Obj.WarrantyActivatedDate ? Obj.WarrantyActivatedDate : null;

  this.WarrantyTrigger = Obj.WarrantyTrigger ? Obj.WarrantyTrigger : null;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();


  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;
  this.WarrantyActivatedBy = Obj.authuser.UserId ? Obj.authuser.UserId : TokenUserId;

  const TokenUserName = global.authuser.FullName ? global.authuser.FullName : '';
  this.WarrantyActivatedByName = (Obj.authuser && Obj.authuser.FullName) ? Obj.authuser.FullName : TokenUserName;

  this.Status = Obj.Status ? Obj.Status : 0;
  // For Server Side Search 
  this.start = Obj.start;
  this.length = Obj.length;
  this.search = Obj.search;
  this.sortCol = Obj.sortCol;
  this.sortDir = Obj.sortDir;
  this.sortColName = Obj.sortColName;
  this.order = Obj.order;
  this.columns = Obj.columns;
  this.draw = Obj.draw;
};


WarrantyModel.create = (objModel, result) => {

  con.query(`SELECT WarrantyId FROm tbl_repair_request_warranty WHERE IsDeleted = 0 AND RRId = ${objModel.RRId}`, (errcount, rescount) => {
    if (errcount) {
      result(errcount, null);
      return;
    }
    if (rescount.length) {
      result({ msg: "Warrany already added for this RR" }, null);
      return;
    }
    var sql = `insert into tbl_repair_request_warranty(
      RRId,
      WarrantyPeriod,WarrantyStartDate,WarrantyEndDate,WarrantyActivatedDate,WarrantyActivatedBy,WarrantyActivatedByName,WarrantyTrigger,Status,Created,CreatedBy)
      values(?,?,?,DATE_ADD('${objModel.WarrantyStartDate}', INTERVAL ${objModel.WarrantyPeriod} MONTH),?,?,?,?,?,?,?)`;
    objModel.FileName = objModel.FileName ? objModel.FileName : '';
    var values = [
      objModel.RRId, objModel.WarrantyPeriod, objModel.WarrantyStartDate,
      // cDateTime.addMonthToCurrentDate(objModel.WarrantyPeriod), 
      cDateTime.getDate(), objModel.WarrantyActivatedBy,
      objModel.WarrantyActivatedByName, objModel.WarrantyTrigger, objModel.Status, objModel.Created, objModel.CreatedBy
    ]
    con.query(sql, values, (err, res) => {
      if (err) {
        //console.log("error: ", err);
        result(err, null);
        return;
      }
      objModel.WarrantyId = res.insertId;
      return result(null, { id: res.insertId, ...objModel });
    });

  });
};


WarrantyModel.update = (objModel, result) => {
  var sql = `UPDATE tbl_repair_request_warranty 
    SET WarrantyPeriod = ?,WarrantyStartDate = ?,WarrantyEndDate =DATE_ADD('${objModel.WarrantyStartDate}', INTERVAL ${objModel.WarrantyPeriod} MONTH),
    WarrantyTrigger = ? ,Modified = ?,ModifiedBy = ? WHERE WarrantyId = ? AND RRId = ?`;
  var values = [
    objModel.WarrantyPeriod, objModel.WarrantyStartDate,
    //cDateTime.addMonthToCurrentDate(objModel.WarrantyPeriod),
    objModel.WarrantyTrigger, objModel.Modified, objModel.ModifiedBy, objModel.WarrantyId, objModel.RRId
  ]
  con.query(sql, values, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "Warranty info not updated!" }, null);
      return;
    }
    return result(null, { id: objModel.WarrantyId, ...objModel });
  });
};

WarrantyModel.findById = (WarrantyId, result) => {
  var sql = `Select W.WarrantyId, W.RRId, RR.RRNo, RR.CustomerId,RR.VendorId,RR.PartId,RR.PartNo,RR.SerialNo, WarrantyPeriod, 
  DATE_FORMAT(W.WarrantyStartDate,'%m/%d/%Y') as WarrantyStartDate  , DATE_FORMAT(W.WarrantyEndDate,'%m/%d/%Y') as WarrantyEndDate , 
  DATE_FORMAT(W.WarrantyActivatedDate,'%m/%d/%Y') as WarrantyActivatedDate ,WarrantyActivatedBy,WarrantyActivatedByName,
  W.Status 
  from tbl_repair_request_warranty W 
  JOIN tbl_repair_request RR on RR.RRId = W.RRId
  where W.IsDeleted=0  and W.WarrantyId = ${WarrantyId}`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    return result({ msg: "Warranty info not found!" }, null);
  });
};


WarrantyModel.remove = (id, result) => {
  var Obj = new WarrantyModel({ WarrantyId: id });
  var sql = `UPDATE tbl_repair_request_warranty SET IsDeleted = 1, Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE WarrantyId = ${Obj.WarrantyId}`;
  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "Warranty info not deleted!" }, null);
      return;
    }
    // console.log("Warranty info deleted successfully ", id);
    result(null, res);
  });
};

WarrantyModel.DeleteRRWarrantyQuery = (RRId) => {
  var Obj = new objModel({ RRId: RRId });
  var sql = `UPDATE tbl_repair_request_warranty SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE  RRId=${RRId}`;
  return sql;
}

WarrantyModel.ViewByRRQuery = (RRId) => {
  var sql = `Select  W.WarrantyId, W.RRId, RR.RRNo, RR.CustomerId,RR.VendorId,RR.PartId,RR.PartNo,RR.SerialNo, WarrantyPeriod, 
  DATE_FORMAT(W.WarrantyStartDate,'%m/%d/%Y') as WarrantyStartDate  , DATE_FORMAT(W.WarrantyEndDate,'%m/%d/%Y') as WarrantyEndDate , 
  DATE_FORMAT(W.WarrantyActivatedDate,'%m/%d/%Y') as WarrantyActivatedDate ,WarrantyActivatedBy,WarrantyActivatedByName,
  W.Status 
  from tbl_repair_request_warranty W 
  JOIN tbl_repair_request RR on RR.RRId = W.RRId
  where W.IsDeleted=0  and W.RRId=${RRId}`;
  return sql;
}


WarrantyModel.WarrantyListServerSide = (WarrantyObj, result) => {

  var query = "";
  var portalQuery = '';
  if (global.authuser.IdentityType == 1) {
    portalQuery = ` AND RR.CustomerId = ${global.authuser.IdentityId}`
  } else if (global.authuser.IdentityType == 2) {
    portalQuery = ` AND RR.VendorId = ${global.authuser.IdentityId}`
  }

  var selectquery = `SELECT  W.WarrantyId, W.RRId, RR.RRNo, V.VendorName, C.CompanyName, RR.CustomerId,RR.VendorId,RR.PartId,RR.PartNo,RR.SerialNo, WarrantyPeriod, 
                     DATE_FORMAT(WarrantyStartDate,'%m/%d/%Y') as WarrantyStartDate  , DATE_FORMAT(WarrantyEndDate,'%m/%d/%Y') as WarrantyEndDate , DATE_FORMAT(WarrantyActivatedDate,'%m/%d/%Y') as WarrantyActivatedDate ,WarrantyActivatedBy,WarrantyActivatedByName,
                     W.Status, '' as WarrantyFrom, '' as WarrantyTo`;
  recordfilterquery = `Select count(W.WarrantyId) as recordsFiltered `;

  query = query + ` FROM tbl_repair_request_warranty W
  JOIN tbl_repair_request RR on RR.RRId = W.RRId
  LEFT JOIN tbl_customers C on C.CustomerId = RR.CustomerId 
  LEFT JOIN tbl_vendors V on V.VendorId = RR.VendorId 
  where W.IsDeleted=0  `;
  if (WarrantyObj.search.value != '') {
    query = query + ` and ( W.RRId LIKE '%${WarrantyObj.search.value}%'
      or RR.RRNo LIKE '%${WarrantyObj.search.value}%' 
      or RR.PartNo LIKE '%${WarrantyObj.search.value}%' 
      or RR.SerialNo LIKE '%${WarrantyObj.search.value}%' 
      or W.WarrantyEndDate LIKE '%${WarrantyObj.search.value}%'   
      or W.WarrantyStartDate LIKE '%${WarrantyObj.search.value}%'
      or W.Created LIKE '%${WarrantyObj.search.value}%' 
      ) `;
  }

  var cvalue = 0;
  for (cvalue = 0; cvalue < WarrantyObj.columns.length; cvalue++) {

    if (WarrantyObj.columns[cvalue].search.value != "") {
      switch (WarrantyObj.columns[cvalue].name) {
        case "WarrantyEndDate":
          query += " and ( W.WarrantyEndDate = '" + WarrantyObj.columns[cvalue].search.value + "' ) ";
          break;
        case "WarrantyStartDate":
          query += " and ( W.WarrantyStartDate = '" + WarrantyObj.columns[cvalue].search.value + "' ) ";
          break;
        case "WarrantyFrom":
          query += " and ( W.WarrantyStartDate >= '" + WarrantyObj.columns[cvalue].search.value + "' ) ";
          break;
        case "WarrantyTo":
          query += " and ( W.WarrantyEndDate <= '" + WarrantyObj.columns[cvalue].search.value + "' ) ";
          break;
        case "Status":
          query += " and ( W.Status = '" + WarrantyObj.columns[cvalue].search.value + "' ) ";
          break;

        case "PartNo":
          query += " and ( RR.PartNo LIKE '%" + WarrantyObj.columns[cvalue].search.value + "%' ) ";
          break;
        case "SerialNo":
          query += " and ( RR.SerialNo LIKE '%" + WarrantyObj.columns[cvalue].search.value + "%' ) ";
          break;
        default:
          query += " and ( " + WarrantyObj.columns[cvalue].name + " LIKE '%" + WarrantyObj.columns[cvalue].search.value + "%' ) ";
          break;
      }
    }
  }
  query += portalQuery;

  var i = 0;

  if (WarrantyObj.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < WarrantyObj.order.length; i++) {
    if (WarrantyObj.order[i].column != "" || WarrantyObj.order[i].column == "0")// 0 is equal to ""
    {
      switch (WarrantyObj.columns[WarrantyObj.order[i].column].name) {
        case "Created":
          query += " W.Created " + WarrantyObj.order[i].dir + ",";
          break;
        default://could be any column except above 
          query += " " + WarrantyObj.columns[WarrantyObj.order[i].column].name + " " + WarrantyObj.order[i].dir + ",";

      }
    }
  }

  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  if (WarrantyObj.start != "-1" && WarrantyObj.length != "-1") {
    query += " LIMIT " + WarrantyObj.start + "," + (WarrantyObj.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(W.WarrantyId) as TotalCount 
  FROM tbl_repair_request_warranty W
  JOIN tbl_repair_request RR on RR.RRId = W.RRId
  LEFT JOIN tbl_customers C on C.CustomerId = RR.CustomerId 
  LEFT JOIN tbl_vendors V on V.VendorId = RR.VendorId 
  where W.IsDeleted=0 `;
  TotalCountQuery += portalQuery;


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
        recordsTotal: results[2][0][0].TotalCount, draw: WarrantyObj.draw
      });
      return;
    }
  );

};



module.exports = WarrantyModel;

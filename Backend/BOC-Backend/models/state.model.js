/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');

const state = function (objstate) {
  this.StateId = objstate.StateId;
  this.CountryId = objstate.CountryId;
  this.StateCode = objstate.StateCode;
  this.StateName = objstate.StateName;
  this.Status = objstate.Status;

  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objstate.authuser && objstate.authuser.UserId) ? objstate.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objstate.authuser && objstate.authuser.UserId) ? objstate.authuser.UserId : TokenUserId;
};

state.getStateByCountryId = (CountryId, result) => {
  con.query(`Select * from tbl_states where IsDeleted=0 and CountryId=${CountryId} `, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    return result(null, res);
  });
}

state.getAll = (result) => {

  var sql = ``;

  sql = `SELECT s.StateId,c.CountryId,c.CountryName,StateCode,StateName,s.Status 
    FROM tbl_states s
    LEFT JOIN tbl_countries c on  s.CountryId=c.CountryId
     WHERE s.Status = 1 AND s.IsDeleted=0 `;

  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);

  });
};

state.create = (state, result) => {

  var sql = ``;
  sql = `insert into tbl_states(CountryId,StateCode,StateName,Status,Created,CreatedBy)
    values(?,?,?,?,?,?)`;

  var values = [

    state.CountryId, state.StateCode,
    state.StateName, state.Status,
    state.Created, state.CreatedBy

  ]

  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...state });
  });
};

state.findById = (StateId, result) => {

  var sql = ``;

  sql = `SELECT StateId,s.CountryId,CountryName,StateCode,StateName,s.Status
    FROM tbl_states s
    LEFT JOIN tbl_countries c on  s.CountryId=c.CountryId WHERE StateId = '${StateId}' `;

  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }
    return result({ kind: "State not found" }, null);
  });
};



state.update = (state, result) => {
  var sql = ` UPDATE tbl_states SET CountryId = ?, StateCode = ?,
    StateName = ?,Status = ?, 
    Modified = ?,Modifiedby = ?
    WHERE StateId = ? `;

  var values = [
    state.CountryId,
    state.StateCode, state.StateName, state.Status,
    state.Modified, state.Modifiedby, state.StateId
  ]

  con.query(sql, values, (err, res) => {

    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {

      result({ msg: "not found" }, null);
      return;
    }

    return result(null, { id: state.StateId, ...state });
  }
  );

};

state.remove = (id, result) => {

  var sql = ``;

  sql = `UPDATE tbl_states SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}',
     ModifiedBy='${global.authuser.UserId}' WHERE StateId = '${id}' `;

  con.query(sql, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    return result(null, res);
  });
};



state.dbupdate = (result) => {
  var alter1 = "ALTER TABLE tbl_repair_request_vendors ADD COLUMN StatusBeforeNotRepairable TINYINT(1) NULL DEFAULT 0 AFTER Status";
  var alter2 = `ALTER TABLE  tbl_sales_order ADD COLUMN POId INT(11) NULL DEFAULT 0 AFTER RRNo`;
  var alter3 = `ALTER TABLE  tbl_sales_order_item ADD COLUMN POItemId INT(11) NULL DEFAULT 0 AFTER PartNo`;
  var update1 = `UPDATE tbl_vendors  SET IsCorpVendorCode = CONCAT('VC',VendorId) WHERE VendorId >0 `;

  async.parallel([
    function (result) { con.query(alter1, result) },
    function (result) { con.query(alter2, result) },
    function (result) { con.query(alter3, result) },
    function (result) { con.query(update1, result) },
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      if (results[0][0]) {
        result(null, results[0][0]);
        return;
      } else {
        result({ msg: "error" }, null);
        return;
      }
    }
  );
};


module.exports = state;
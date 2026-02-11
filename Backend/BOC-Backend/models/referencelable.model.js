/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const objModel = function FuncName(obj) {
  //common for add&edit
  this.ReferenceName = obj.ReferenceName;
  this.Status = obj.Status;
  //for create 
  this.Created = cDateTime.getDateTime();
  //for edit  
  this.ReferenceId = obj.ReferenceId;
  this.Modified = cDateTime.getDateTime();

  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};


objModel.create = (objModel, result) => {


  var sql = `insert into tbl_reference_labels(ReferenceName,Created,Status)
    values(?,?,?)`;

  var values = [

    objModel.ReferenceName, objModel.Created,
    objModel.Status, objModel.ReferenceId

  ]

  con.query(sql, values, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    //console.log("created new reference : ", { id: res.insertId, ...objModel });
    result(null, { id: res.insertId, ...objModel });
  });
};




objModel.getAll = (result) => {

  var sql = `SELECT ReferenceName,Status FROM tbl_reference_labels  WHERE Status = 1 AND IsDeleted=0`;

  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};


objModel.findById = (ReferenceId, result) => {

  var sql = `SELECT ReferenceName,Status FROM tbl_reference_labels WHERE ReferenceId = ${ReferenceId}`;

  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found the Reference: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Department with the id
    result({ kind: "Reference not found" }, null);
  });
};



objModel.updateById = (objModel, result) => {


  var sql = `UPDATE tbl_reference_labels SET ReferenceName = ?, Modified = ?,
    Status = ? WHERE ReferenceId = ?`;

  var values = [

    objModel.ReferenceName, objModel.Modified,
    objModel.Status, objModel.ReferenceId

  ]

  con.query(sql, values, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Department with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { id: objModel.ReferenceId, ...objModel });
  }
  );

  //console.log("Updated Reference lable !");
};

objModel.remove = (id, result) => {
  var sql = `UPDATE tbl_reference_labels SET IsDeleted = 1 WHERE ReferenceId = ${id}`;

  con.query(sql, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Reference with the id
      result({ kind: "not_found" }, null);
      return;
    }

    // console.log("deleted Reference with ReferenceId: ", id);
    result(null, res);
  });
};
module.exports = objModel;

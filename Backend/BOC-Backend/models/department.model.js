/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Department = function FuncName(objDepartment) {
  //common for add&edit

  this.DepartmentCode = objDepartment.DepartmentCode;
  this.DepartmentName = objDepartment.DepartmentName;
  this.Status = objDepartment.Status;
  this.IsDeleted = objDepartment.IsDeleted ? objDepartment.IsDeleted : 0;
  //for create Department
  this.Created = objDepartment.Created ? objDepartment.Created : cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objDepartment.authuser && objDepartment.authuser.UserId) ? objDepartment.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objDepartment.authuser && objDepartment.authuser.UserId) ? objDepartment.authuser.UserId : TokenUserId;

  //for edit Department 
  this.DepartmentId = objDepartment.DepartmentId;
};

Department.create = (newDepartment, result) => {

  var sql = 'Insert Into tbl_department set ?';

  con.query(sql, newDepartment, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    //  console.log("created new dpt : ", { id: res.insertId, ...newDepartment });
    result(null, { id: res.insertId, ...newDepartment });
  });
};


Department.getAll = (result) => {
  con.query("SELECT DepartmentId,DepartmentCode,DepartmentName FROM tbl_department WHERE Status = 1 AND IsDeleted=0", (err, res) => {

    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};


Department.findById = (DepartmentId, result) => {

  con.query(`SELECT DepartmentId,DepartmentCode,DepartmentName,Status FROM tbl_department WHERE DepartmentId = ${DepartmentId}`, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found the Department: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Department with the id
    result({ kind: "Department not found" }, null);
  });
};

var cDateTime = require("../utils/generic.js");

Department.updateById = (objDepartment, result) => {
  con.query(
    "UPDATE tbl_department SET DepartmentCode = ?,DepartmentName = ?, Modified = ?, ModifiedBy = ?,Status = ?,IsDeleted = ? WHERE DepartmentId = ?",
    [objDepartment.DepartmentCode, objDepartment.DepartmentName, cDateTime.getDateTime(), objDepartment.ModifiedBy, objDepartment.Status, objDepartment.IsDeleted, objDepartment.DepartmentId],
    (err, res) => {
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
      // console.log("Created"+objDepartment.Created);
      //console.log("CreatedBy"+objDepartment.CreatedBy);
      // console.log("updated Department: ", { id: objDepartment.DepartmentId, ...objDepartment });
      result(null, { id: objDepartment.DepartmentId, ...objDepartment });
    }
  );

  //console.log("Updated Department!");
};

Department.remove = (id, result) => {
  con.query("DELETE FROM tbl_department WHERE DepartmentId = ?", id, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found language with the id
      result({ kind: "not_found" }, null);
      return;
    }

    // console.log("deleted Department with DepartmentId: ", id);
    //  result(null, res);
  });
};
module.exports = Department;

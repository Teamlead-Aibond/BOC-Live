/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const Role = function (objRole) {
  this.RoleId = objRole.RoleId ? objRole.RoleId : 0;
  this.RoleName = objRole.RoleName ? objRole.RoleName : '';
  this.RoleDescription = objRole.RoleDescription ? objRole.RoleDescription : '';
}

Role.GetAllRoles = (result) => {

  var sql = ``;

  sql = `SELECT RoleId, RoleName, RoleDescription
    FROM tbl_roles where IsDeleted<>1 `;

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

//Create Role 
Role.create = (Role1, result) => {
  var sql = ``;
  sql = `insert into tbl_roles(RoleName,RoleDescription) values(?,?)`;
  var values = [Role1.RoleName, Role1.RoleDescription]
  con.query(sql, values, (err, res) => {
    if (err) {
      return result(err, null);
    }
    result(null, { id: res.insertId, ...Role1 });
  });
};
//Update Role
Role.update = (Role1, result) => {
  var sql = ``;
  sql = ` UPDATE tbl_roles SET RoleName= ?, RoleDescription = ?
  WHERE RoleId = ? `;
  var values = [Role1.RoleName, Role1.RoleDescription, Role1.RoleId]
  con.query(sql, values, (err, res) => {
    if (err) {
      return result(null, err);
    }
    if (res.affectedRows == 0) {
      return result({ kind: "role_not_found" }, null);
    }
    result(null, { id: Role1.RoleId, ...Role1 });
  });
};

Role.Remove = (Role1, result) => {

  var sql = ``;

  sql = ` UPDATE tbl_roles SET IsDeleted=1
  WHERE RoleId = ? `;

  var values = [
    Role1.RoleId
  ]

  con.query(sql, values, (err, res) => {

    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {

      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { id: Role1.RoleId, ...Role1 });
  }
  );

};
// To IsExistRoleName
Role.IsExistRoleName = (obj, result) => {
  var sql = `Select RoleId,Rolename from tbl_roles where IsDeleted=0 and Rolename='${obj.RoleName}' `;
  if (obj.RoleId > 0) {
    sql = sql + ` and RoleId<>'${obj.RoleId}'`;
  }
  //console.log("sql="+sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
module.exports = Role;
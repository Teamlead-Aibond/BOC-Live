/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const objModel = function FuncName(objCustomerUsers) {
  this.CustomerUserId = objCustomerUsers.CustomerUserId ? objCustomerUsers.CustomerUserId : 0;
  this.CustomerId = objCustomerUsers.IdentityId ? objCustomerUsers.IdentityId : 0;
  this.UserId = objCustomerUsers.UserId ? objCustomerUsers.UserId : 0;
  this.Created = cDateTime.getDateTime();
  this.Updated = cDateTime.getDateTime();
  this.IsDeleted = objCustomerUsers.IsDeleted;
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objCustomerUsers.authuser && objCustomerUsers.authuser.UserId) ? objCustomerUsers.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objCustomerUsers.authuser && objCustomerUsers.authuser.UserId) ? objCustomerUsers.authuser.UserId : TokenUserId;
};


objModel.listquery = (CustomerId) => {
  return `SELECT c.CustomerUserId, a.UserId, a.UserName,a.DepartmentId,a.Email,a.PhoneNo,a.EmployeeId,d.DepartmentName
  FROM tbl_customer_users c
  LEFT JOIN tbl_users a on c.UserId=a.UserId
  LEFT JOIN tbl_department d on d.DepartmentId=a.DepartmentId
  WHERE c.IsDeleted = 0 and c.CustomerId='${CustomerId}'`;

}
objModel.updateCustomerUsers = (objModel, result) => {
  var sql = `UPDATE tbl_customer_users SET UserId=?, Modified=? WHERE CustomerId = ?`;
  var values = [objModel.UserId, objModel.Modified, objModel.CustomerId];
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};


objModel.createCustomerUsers = (objModel, result) => {
  var sql = 'insert into tbl_customer_users(CustomerId,UserId,Created)values(?,?,?) '
  var values = [objModel.CustomerId, objModel.UserId, objModel.Created]
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    return result(null, { id: res.insertId, ...objModel });
  });

};

module.exports = objModel;
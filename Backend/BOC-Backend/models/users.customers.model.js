/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const UserCustomerModel = function (obj) {
  this.UserCustomerId = obj.UserCustomerId;
  this.UserId = obj.UserId;
  this.CustomerId = obj.CustomerId;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

//To get all the User Customer
UserCustomerModel.getAll = result => {
  con.query(`Select * from tbl_users_customers WHERE IsDeleted = 0 `, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}

//To create a User Customer
UserCustomerModel.create = (Obj, result) => {
  var sql = `insert into tbl_users_customers(UserId,CustomerId,Created,CreatedBy) values(?,?,?,?)`;
  var values = [Obj.UserId, Obj.CustomerId, Obj.Created, Obj.CreatedBy];
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, { id: res.insertId, ...Obj });
  });
};

//To remove the User Customer
UserCustomerModel.remove = (id, result) => {
  var sql = `UPDATE tbl_users_customers SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', Modifiedby='${global.authuser.UserId}' WHERE UserCustomerId = '${id}' `;
  con.query(sql, (err, res) => {
    if (err)
      return result(null, err);
    if (res.affectedRows == 0)
      return result({ msg: "User Customer not deleted" }, null);
    return result(null, res);
  });
};
module.exports = UserCustomerModel;
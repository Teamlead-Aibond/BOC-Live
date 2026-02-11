/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");
const customersdepartment = function FuncName(objCustomersDepartment) {
  this.CustomerDepartmentList = objCustomersDepartment.CustomerDepartmentList;

  this.CustomerId = objCustomersDepartment.IdentityId ? objCustomersDepartment.IdentityId : 0;
  this.CustomerDepartmentName = objCustomersDepartment.CustomerDepartmentName ? objCustomersDepartment.CustomerDepartmentName : '';
  this.DepartmentContactName = objCustomersDepartment.DepartmentContactName ? objCustomersDepartment.DepartmentContactName : '';
  this.DepartmentContactEmail = objCustomersDepartment.DepartmentContactEmail ? objCustomersDepartment.DepartmentContactEmail : '';
  this.DepartmentContactPhone = objCustomersDepartment.DepartmentContactPhone ? objCustomersDepartment.DepartmentContactPhone : '';
  this.CustomerDepartmentId = objCustomersDepartment.CustomerDepartmentId ? objCustomersDepartment.CustomerDepartmentId : 0;
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objCustomersDepartment.authuser && objCustomersDepartment.authuser.UserId) ? objCustomersDepartment.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objCustomersDepartment.authuser && objCustomersDepartment.authuser.UserId) ? objCustomersDepartment.authuser.UserId : TokenUserId;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
};
//IsExistCustomerDepartment
customersdepartment.IsExistCustomerDepartment = (obj, CustomerId, result) => {
  var query = `SELECT CustomerId,CustomerDepartmentName FROM  tbl_customer_departments
  WHERE IsDeleted=0 and CustomerDepartmentName='${obj.CustomerDepartmentName}' and CustomerId='${CustomerId}' `;
  if (obj.CustomerDepartmentId > 0) {
    query += `and CustomerDepartmentId<>'${obj.CustomerDepartmentId}'`;
  }
  //console.log("IsExist sql=" + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
// To create department
customersdepartment.create = (customersdepartment1, result) => {

  var sql = ``;
  sql = `insert into tbl_customer_departments(CustomerId,CustomerDepartmentName,DepartmentContactName
    ,DepartmentContactEmail,DepartmentContactPhone,Created,CreatedBy) values`;
  //console.log("customersdepartment1.IdentityId=" + customersdepartment1.IdentityId);
  for (let obj of customersdepartment1.CustomerDepartmentList) {
    obj = escapeSqlValues(obj);
    let val = new customersdepartment(obj);
    sql = sql + `('${customersdepartment1.IdentityId}','${val.CustomerDepartmentName}','${val.DepartmentContactName}'
  ,'${val.DepartmentContactEmail}','${val.DepartmentContactPhone}','${val.Created}',
  '${val.CreatedBy}'),`;
  }
  var Query = sql.slice(0, -1);
  // console.log("Final sql=" + Query);
  con.query(Query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    for (let val of customersdepartment1.CustomerDepartmentList) {
      val.CustomerDepartmentId = res.insertId;
    }
    return result(null, { id: res.insertId, ...customersdepartment1 });
  });
};
// To update department
customersdepartment.updateById = (customersdepartment1, result) => {

  for (let obj of customersdepartment1.CustomerDepartmentList) {
    obj = escapeSqlValues(obj);
    let val = new customersdepartment(obj);
    var sql = `UPDATE tbl_customer_departments SET CustomerId =?,CustomerDepartmentName =?,DepartmentContactName =?,
    DepartmentContactEmail =?,DepartmentContactPhone =?,ModifiedBy=?,Modified=? WHERE CustomerDepartmentId = ?`;
    var values = [
      customersdepartment1.IdentityId, val.CustomerDepartmentName,
      val.DepartmentContactName, val.DepartmentContactEmail,
      val.DepartmentContactPhone, val.ModifiedBy,
      val.Modified, val.CustomerDepartmentId,
    ]
    // console.log("SQl query  " + sql);
    con.query(sql, values, function (err, result) {
      if (err) {
        return result(err, null);
      }
      if (result.affectedRows == 0) {
        return result({ msg: "CustomerDepartment not found" }, null);
      }
    });
  }
  return result(null, { id: customersdepartment1.CustomerId, ...customersdepartment1 });

};
// To list department
customersdepartment.listquery = (CustomerId) => {
  return `SELECT CustomerId,CustomerDepartmentName,CustomerDepartmentId,DepartmentContactName,DepartmentContactEmail,DepartmentContactPhone
    FROM tbl_customer_departments       
    WHERE IsDeleted = 0 AND CustomerId='${CustomerId}'`;

}

customersdepartment.selectbyname = (CustomerId, CustomerDepartmentName) => {
  return `SELECT CustomerDepartmentId,CustomerDepartmentName FROM tbl_customer_departments       
    WHERE IsDeleted = 0 and CustomerDepartmentName='${CustomerDepartmentName}' AND CustomerId='${CustomerId}'`;
}


// To delete department
customersdepartment.remove = (id, result) => {
  var sql = `UPDATE tbl_customer_departments SET IsDeleted = 1 WHERE CustomerDepartmentId = ${id}`;
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.affectedRows == 0) {
      return result({ msg: "CustomerDepartment not found" }, null);
    }
    result(null, res);
  });
};
customersdepartment.list = (CustomerId, result) => {
  var sql = `SELECT CustomerDepartmentName,CustomerDepartmentId
    FROM tbl_customer_departments       
    WHERE IsDeleted = 0 AND CustomerId='${CustomerId}'`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
}
module.exports = customersdepartment;
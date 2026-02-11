/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");

const CustomerAssetModel = function FuncName(objCustomersAsset) {

  this.CustomerAssetList = objCustomersAsset.CustomerAssetList;
  this.CustomerId = objCustomersAsset.IdentityId;
  this.CustomerAssetName = objCustomersAsset.CustomerAssetName ? objCustomersAsset.CustomerAssetName : '';
  this.CustomerAssetId = objCustomersAsset.CustomerAssetId ? objCustomersAsset.CustomerAssetId : 0;

  this.Modified = cDateTime.getDateTime();
  this.Created = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objCustomersAsset.authuser && objCustomersAsset.authuser.UserId) ? objCustomersAsset.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objCustomersAsset.authuser && objCustomersAsset.authuser.UserId) ? objCustomersAsset.authuser.UserId : TokenUserId;
};

//IsExistCustomerAsset
CustomerAssetModel.IsExistCustomerAsset = (obj, CustomerId, result) => {

  var query = `SELECT CustomerAssetId,CustomerAssetName,CustomerId FROM  tbl_customer_assets
  WHERE IsDeleted=0 and CustomerAssetName='${obj.CustomerAssetName}' and CustomerId='${CustomerId}' `;
  if (obj.CustomerAssetId > 0) {
    query += `and CustomerAssetId<>'${obj.CustomerAssetId}'`;
  }
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

CustomerAssetModel.create = (obj, result) => {

  var sql = `insert into tbl_customer_assets(CustomerId,CustomerAssetName,Created,CreatedBy) values`;
  for (let row of obj.CustomerAssetList) {
    row = escapeSqlValues(row);
    let val = new CustomerAssetModel(row);
    sql = sql + `('${obj.IdentityId}','${val.CustomerAssetName}','${val.Created}',
  '${val.CreatedBy}'),`;
  }
  var Query = sql.slice(0, -1);
  // console.log("Final sql=" + Query);
  con.query(Query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    for (let val of obj.CustomerAssetList) {
      val.CustomerAssetId = res.insertId;
    }
    result(null, { id: res.insertId, ...obj });

  });
};

CustomerAssetModel.getAll = (CustomerId, result) => {
  var sql = CustomerAssetModel.listquery(CustomerId);
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
}

CustomerAssetModel.listquery = (CustomerId) => {
  return `SELECT CustomerId,CustomerAssetName,CustomerAssetId
    FROM tbl_customer_assets            
    WHERE IsDeleted = 0 AND CustomerId='${CustomerId}'`;
}

CustomerAssetModel.updateById = (obj, result) => {

  for (let row of obj.CustomerAssetList) {
    row = escapeSqlValues(row);
    let val = new CustomerAssetModel(row);
    var sql = `UPDATE tbl_customer_assets SET CustomerId ='${obj.IdentityId}',CustomerAssetName ='${val.CustomerAssetName}',
    ModifiedBy='${val.ModifiedBy}',Modified='${val.Modified}' WHERE CustomerAssetId = '${val.CustomerAssetId}' `
    //console.log("SQl query  " + sql);
    con.query(sql, function (err, result) {
      if (err) {
        result(err, null);
      }
    });
  }
  return result(null, { id: obj.CustomerId, ...obj });
};

CustomerAssetModel.remove = (id, result) => {
  var sql = `UPDATE tbl_customer_assets SET IsDeleted = 1 WHERE CustomerAssetId = ${id}`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "CustomerAsset not found" }, null);
      return;
    }
    return result(null, res);
  });
};

module.exports = CustomerAssetModel;
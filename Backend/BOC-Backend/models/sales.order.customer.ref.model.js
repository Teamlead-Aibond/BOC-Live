/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
const { escapeSqlValues } = require("../helper/common.function.js");
const GlobalCustomerReference = function (Obj) {
  this.SOReferenceId = Obj.SOReferenceId;
  this.SOId = Obj.SOId ? Obj.SOId : 0;
  this.CustomerId = Obj.CustomerId ? Obj.CustomerId : 0;
  this.IdentityType = Obj.IdentityType ? Obj.IdentityType : 0;
  this.CReferenceId = Obj.CReferenceId ? Obj.CReferenceId : 0;
  this.IdentityId = Obj.IdentityId ? Obj.IdentityId : 0;
  this.ReferenceLabelName = Obj.ReferenceLabelName;
  this.ReferenceValue = Obj.ReferenceValue;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;
};


GlobalCustomerReference.Create = (IdentityType, IdentityId, GlobalCustomerReferenceList, result) => {
  var sql = `insert into tbl_sales_order_customer_ref(SOId,CReferenceId,IdentityType,IdentityId,CustomerId,ReferenceLabelName,ReferenceValue,Created,CreatedBy) values`;
  if (GlobalCustomerReferenceList.length > 0) {
    for (let val of GlobalCustomerReferenceList) {
      val = escapeSqlValues(val);
      const saleCusRef = new GlobalCustomerReference(val);
      sql += `('${IdentityId}','${saleCusRef.CReferenceId}','${IdentityType}','${IdentityId}','${saleCusRef.CustomerId}','${saleCusRef.ReferenceLabelName}','${saleCusRef.ReferenceValue}','
        ${saleCusRef.Created}','${saleCusRef.CreatedBy}'),`;
    }
    var Query = sql.slice(0, -1);
    con.query(Query, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId });
      return;
    });
  } else {
    result(null, null);
    return;
  }
}

// Update Customer Reference
GlobalCustomerReference.UpdateGlobalCustomerReference = (IdentityType, IdentityId, GlobalCustomerReferenceList, result) => {

  for (let val of GlobalCustomerReferenceList) {

    var Obj = new GlobalCustomerReference(val);
    if (Obj.SOReferenceId) {
      var Query = `UPDATE tbl_sales_order_customer_ref SET SOId=?,CReferenceId=?,
    IdentityType=?,IdentityId=?,CustomerId=?,
    ReferenceLabelName=?,ReferenceValue=?,Modified=?,Modifiedby=? WHERE SOReferenceId=?`;
      var values = [IdentityId, Obj.CReferenceId, IdentityType, IdentityId, Obj.CustomerId, Obj.ReferenceLabelName,
        Obj.ReferenceValue, Obj.Modified, Obj.ModifiedBy, Obj.SOReferenceId];
    } else {
      var Query = `insert into tbl_sales_order_customer_ref(SOId,IdentityType,IdentityId,CReferenceId,
      CustomerId,ReferenceLabelName,ReferenceValue,Created,CreatedBy) values(?,?,?,?,?,?,?,?,?)`;
      var values = [IdentityId, Obj.CReferenceId, IdentityType, IdentityId, Obj.CustomerId, Obj.ReferenceLabelName,
        Obj.ReferenceValue, Obj.Created, Obj.CreatedBy];
    }

    // console.log(" query" + Query, values);
    con.query(Query, values, (err, res) => {
      if (err) {
        result(err, null);
      }
    }
    );
  }
  result(null, GlobalCustomerReference);
  return;
};

GlobalCustomerReference.view = (IdentityType, IdentityId) => {
  var sql = `Select SOReferenceId,SOId,CustomerId,CReferenceId,ReferenceLabelName,ReferenceValue from tbl_sales_order_customer_ref where IsDeleted=0 and IdentityType='${IdentityType}' and IdentityId='${IdentityId}'`;
  // console.log(sql);
  return sql;
}


GlobalCustomerReference.CreateSingleRecord = (CustomerReference, result) => {

  var sql = ``;
  sql = `insert into tbl_sales_order_customer_ref(SOId,IdentityType,CReferenceId,IdentityId,CustomerId,ReferenceLabelName,ReferenceValue,Created,CreatedBy) 
   values(?,?,?,?,?,?,?,?,?)`;

  var values = [

    CustomerReference.SOId, CustomerReference.IdentityType, CustomerReference.CReferenceId, CustomerReference.IdentityId
    , CustomerReference.CustomerId, CustomerReference.ReferenceLabelName
    , CustomerReference.ReferenceValue,
    CustomerReference.Created, CustomerReference.CreatedBy
  ]

  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...CustomerReference });
  });
};



GlobalCustomerReference.Update = (CustomerReference, result) => {

  var Obj = new GlobalCustomerReference(CustomerReference);
  var sql = `UPDATE tbl_sales_order_customer_ref SET CReferenceId=${Obj.CReferenceId},SOId=${Obj.SOId},IdentityType=${Obj.IdentityType},IdentityId=${Obj.IdentityId},CustomerId=${Obj.CustomerId},ReferenceLabelName='${Obj.ReferenceLabelName}',ReferenceValue='${Obj.ReferenceValue}',Modified='${cDateTime.getDateTime()}',Modifiedby=${Obj.ModifiedBy}  WHERE SOReferenceId=${Obj.SOReferenceId}`;
  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: Obj.SOReferenceId, ...Obj });
    return;

  });
};

GlobalCustomerReference.Delete = (id, result) => {
  var Obj = new GlobalCustomerReference({ SOReferenceId: id });
  var sql = `UPDATE tbl_sales_order_customer_ref SET IsDeleted = 1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE SOReferenceId = ${Obj.SOReferenceId}`;
  con.query(sql, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ msg: "not found" }, null);
      return;
    }
    //console.log("deleted Notes with SOReferenceId: ", id);
    result(null, res);
  });
};


GlobalCustomerReference.ViewCustomerReference = (SOId) => {
  var sql = `Select SOId,IdentityType,CReferenceId,IdentityId,CustomerId,ReferenceLabelName,ReferenceValue
  from tbl_sales_order_customer_ref where IsDeleted=0 and IdentityType='${Constants.CONST_IDENTITY_TYPE_PO}' and SOId=${SOId}`;
  // console.log("Sales Orer Cust ref Info :" + sql);
  return sql;
}


module.exports = GlobalCustomerReference;
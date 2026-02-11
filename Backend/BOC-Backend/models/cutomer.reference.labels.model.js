/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const { escapeSqlValues } = require("../helper/common.function.js");
const CReferenceLabel = function (objLabel) {
  //CReferenceLabel model
  this.CReferenceList = objLabel.CReferenceList;
  this.IdentityId = objLabel.IdentityId;
  this.CReferenceName = objLabel.CReferenceName;
  this.Status = objLabel.Status ? 1 : 0;
  this.Rank = objLabel.Rank ? objLabel.Rank : 0;
  this.IsDisplayOnQRCode = objLabel.IsDisplayOnQRCode ? objLabel.IsDisplayOnQRCode : 0;
  this.IsEditableByCustomer = objLabel.IsEditableByCustomer ? objLabel.IsEditableByCustomer : 0;

  //CReferenceLabel model for RR
  //this.CustomerReferenceList=objLabel.CustomerReferenceList;
  this.CReferenceId = objLabel.CReferenceId ? objLabel.CReferenceId : 0;
  this.RRId = objLabel.RRId ? objLabel.RRId : 0;
  this.ReferenceLabelName = objLabel.ReferenceLabelName;
  this.ReferenceValue = objLabel.ReferenceValue;
  this.RRReferenceId = objLabel.RRReferenceId;
  this.CustomerId = objLabel.CustomerId ? objLabel.CustomerId : 0;

  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();

  // const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  const TokenUserId = 0;
  this.CreatedBy = (objLabel.authuser && objLabel.authuser.UserId) ? objLabel.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objLabel.authuser && objLabel.authuser.UserId) ? objLabel.authuser.UserId : TokenUserId;
}


CReferenceLabel.getAllQuery = (CustomerId) => {
  return 'SELECT CustomerId,CReferenceId,CReferenceName,Status,IsDisplayOnQRCode,IsEditableByCustomer FROM  tbl_cutomer_reference_labels WHERE CustomerId =  ' + CustomerId + '  AND IsDeleted=0 order By `Rank`  ';
};

CReferenceLabel.getAll = (CustomerId, result) => {
  var sql = CReferenceLabel.getAllQuery(CustomerId);
  con.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};
//
CReferenceLabel.IsExistCReference = (val, IdentityId) => {
  var query = `SELECT CReferenceId
  FROM  tbl_cutomer_reference_labels
  WHERE IsDeleted=0  
  and CReferenceName='${val.CReferenceName}' and CustomerId='${IdentityId}' `;

  if (val.CReferenceId != 0) {
    query = query + `and CReferenceId<>'${val.CReferenceId}'`;
  }
  // console.log("IsExist sql=" + query);
  return query;
};

CReferenceLabel.create = (objModel, result) => {

  let val = new CReferenceLabel(objModel.CReferenceList[0]);
  // console.log("val.CReferenceId="+val.CReferenceId)
  var allowInsert = true;
  var getCount = `SELECT COUNT(CReferenceId) as count FROM tbl_cutomer_reference_labels WHERE CustomerId = ${objModel.IdentityId} AND IsDeleted = 0`;
  async.parallel([
    function (result) { con.query(CReferenceLabel.IsExistCReference(val, objModel.IdentityId), result); },
    function (result) { con.query(getCount, result); },
  ],
    function (err, results) {
      if (err) { return result(err, null); }
      //console.log("results[0][0].length=" + results[0][0].length);
      if (results[0][0].length == 0) {
        // console.log(results[1]);
        // console.log(results[1][0][0].count);
        // console.log(parseInt(results[1][0][0].count) + parseInt(1) )
        var rank = results[1] && results[1][0][0].count > 0 ? parseInt(results[1][0][0].count) + parseInt(1) : 1;
        // console.log(rank);
        var Insertsql = 'insert into tbl_cutomer_reference_labels(CustomerId,CReferenceName,Status,`Rank`,Created,CreatedBy) values';
        for (let obj of objModel.CReferenceList) {
          obj = escapeSqlValues(obj);
          let val = new CReferenceLabel(obj);
          if (val.CReferenceName == '') {
            allowInsert = false;
          }
          Insertsql = Insertsql + `('${objModel.IdentityId}','${val.CReferenceName}',
            '${val.Status}','${val.Rank > 0 ? val.Rank : rank}','${val.Created}','${val.CreatedBy}'),`;
        }
        var Query = Insertsql.slice(0, -1);
        // console.log("CRef add sql@=" + Query);
        // console.log(allowInsert)
        if (allowInsert) {
          con.query(Query, (err, res) => {
            if (err) {
              return result(err, null);
            }
            val.CReferenceId = res.insertId;
            return result(null, val);
          });
        }

      }
      else {
        return result({ msg: "Record Already exist" }, null);
      }
    }
  );

};


//CReferenceLabel list
CReferenceLabel.listquery = (IdentityId) => {
  return `SELECT CustomerId,CReferenceId,CReferenceName,IsDisplayOnQRCode,IsEditableByCustomer
        FROM  tbl_cutomer_reference_labels
          WHERE IsDeleted=0   
          and CustomerId='${IdentityId}'`;
};


CReferenceLabel.updateById = (objModel, result) => {

  let val = new CReferenceLabel(objModel.CReferenceList[0]);
  async.parallel([
    function (result) { con.query(CReferenceLabel.IsExistCReference(val), result); },
  ],
    function (err, results) {
      if (err) {
        return result(err, null);
      }
      if (results[0][0].length == 0) {

        var updatesql = `UPDATE tbl_cutomer_reference_labels SET CustomerId =?,CReferenceName =?,
        Status =?,Modified =?,ModifiedBy =? 
        WHERE CReferenceId = ?`;

        for (let obj of objModel.CReferenceList) {
          let val = new CReferenceLabel(obj);
          var values = [
            objModel.IdentityId, obj.CReferenceName,
            obj.Status, val.Modified, obj.ModifiedBy,
            obj.CReferenceId
          ]
        }
        async.parallel([
          function (result) { con.query(updatesql, values, result) },
        ],
          function (err, results) {
            if (err) {
              return result(err, null);
            }
            result(null, val);
          });
      }
      else {
        result({ msg: "Record Already exist" }, null);
      }
    }
  );
};

CReferenceLabel.updateDisplayInQR = (CReferenceId, IsDisplayOnQRCode, result) => {
  var sql = `UPDATE tbl_cutomer_reference_labels SET IsDisplayOnQRCode = '${IsDisplayOnQRCode}',ModifiedBy='${global.authuser.UserId}' WHERE CReferenceId = ${CReferenceId}`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "Not Updated" }, null);
      return;
    }
    result(null, res);
  });
};


CReferenceLabel.updateEditableByCustomer = (CReferenceId, IsEditableByCustomer, result) => {
  var sql = `UPDATE tbl_cutomer_reference_labels SET IsEditableByCustomer = '${IsEditableByCustomer}',ModifiedBy='${global.authuser.UserId}' WHERE CReferenceId = ${CReferenceId}`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "Not Updated" }, null);
      return;
    }
    result(null, res);
  });
};

//

CReferenceLabel.remove = (id, result) => {
  var sql = `UPDATE tbl_cutomer_reference_labels SET IsDeleted = 1,ModifiedBy='${global.authuser.UserId}' WHERE CReferenceId = ${id}`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {

      result({ msg: "CReference not found" }, null);
      return;
    }
    result(null, res);
  });
};
// 
CReferenceLabel.UpdateCustomerRefRank = (ReqBody, result) => {
  for (let val of ReqBody.CustomerReferenceRankList) {
    var Obj = new CReferenceLabel(val);
    var Query = "UPDATE tbl_cutomer_reference_labels SET `Rank` = '" + Obj.Rank + "' ,Modified='" + Obj.Modified + "',ModifiedBy='" + Obj.ModifiedBy + "' WHERE CReferenceId = '" + Obj.CReferenceId + "';";
    //console.log("Query" + Query);
    con.query(Query, (err, res) => {
      if (err) {
        console.log(err)
        result(err, null);
      }
    });
  }
  return result(null, ReqBody);
};








// Tested By Kesavan
CReferenceLabel.CreateCustomerReference = (ReqBody, result) => {

  var sql = `insert into tbl_repair_request_customer_ref(CReferenceId,RRId,MROId,CustomerId,ReferenceLabelName,ReferenceValue) values`;
  for (let val of ReqBody.CustomerReferenceList) {
    var obj = new CReferenceLabel(val);
    sql += ` ('${obj.CReferenceId}','${ReqBody.RRId ? ReqBody.RRId : 0}','${ReqBody.MROId ? ReqBody.MROId : 0}','${ReqBody.CustomerId}','${obj.ReferenceLabelName}','${obj.ReferenceValue}'),`;
  }
  var Query = sql.slice(0, -1);
  //console.log("add sql=" + Query);
  con.query(Query, (err, res) => {
    if (err) {
      console.log("err=" + err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;
  });
};

// Update Customer Reference
CReferenceLabel.Update = (CReferenceLabel, result) => {
  var Query = `Update  tbl_repair_request_customer_ref set CustomerId=?,CReferenceId=?,ReferenceLabelName=?,ReferenceValue=?,Modified=? where RRReferenceId=? and RRId=?`;
  var values = [CReferenceLabel.CustomerReferenceList.CustomerId, CReferenceLabel.CustomerReferenceList.CReferenceId, CReferenceLabel.CustomerReferenceList.ReferenceLabelName, CReferenceLabel.CustomerReferenceList.ReferenceValue, cDateTime.getDateTime(), CReferenceLabel.CustomerReferenceList.RRReferenceId, CReferenceLabel.RRId];
  // console.log(" Customer update sql=" + Query);
  con.query(Query, values, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: CReferenceLabel.RRId, ...CReferenceLabel });
    return;

  }
  );
};

// Update Customer Reference
CReferenceLabel.UpdateRRCusRef = (ReqBody, result) => {

  for (let val of ReqBody.CustomerReferenceList) {
    var Obj = new CReferenceLabel(val);
    if (Obj.RRReferenceId) {
      var Query = `Update  tbl_repair_request_customer_ref set  CReferenceId=?,ReferenceLabelName=?,ReferenceValue=?,Modified=?,ModifiedBy=? where RRReferenceId=? and RRId=?`;
      var values = [Obj.CReferenceId, Obj.ReferenceLabelName, Obj.ReferenceValue, Obj.Modified, Obj.ModifiedBy, Obj.RRReferenceId, Obj.RRId];
    } else {
      var Query = `insert into tbl_repair_request_customer_ref(CReferenceId,RRId,CustomerId,ReferenceLabelName,ReferenceValue,Created,CreatedBy
      ) values(?,?,?,?,?,?,?)`;
      var values = [Obj.CReferenceId, ReqBody.RRId, ReqBody.CustomerId, Obj.ReferenceLabelName, Obj.ReferenceValue, Obj.Created, Obj.CreatedBy];
    }
    //console.log("Ref query" + Query, values);
    con.query(Query, values, (err, res) => {
      if (err) {
        result(err, null);
      }
    }
    );
  }
  result(null, ReqBody.CustomerReferenceList);
  return;
};

CReferenceLabel.Delete = (CReferenceLabel, result) => {
  var Query = `Update  tbl_repair_request_customer_ref set IsDeleted=?,Modified=?,ModifiedBy=? where RRReferenceId=?`;
  var values = [1, CReferenceLabel.Modified, CReferenceLabel.ModifiedBy, CReferenceLabel.RRReferenceId];
  con.query(Query, values, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "reference not found" }, null);
      return;
    }
    result(null, { id: CReferenceLabel.RRReferenceId, ...CReferenceLabel });
    return;
  }
  );
};

CReferenceLabel.DeleteRRCusRefQuery = (RRId) => {
  var CRefObj = new CReferenceLabel({ RRId: RRId });
  var sql = `UPDATE tbl_repair_request_customer_ref SET IsDeleted=1,Modified='${CRefObj.Modified}',ModifiedBy='${CRefObj.ModifiedBy}' WHERE IsDeleted = 0 AND RRId>0 AND RRId=${CRefObj.RRId}`;
  return sql;
}

CReferenceLabel.ViewCustomerReference = (RRId) => {
  var sql = `Select RRR.RRReferenceId,RRR.CReferenceId,RRR.RRId,RRR.CustomerId,RRR.ReferenceLabelName,RRR.ReferenceValue,CR.IsDisplayOnQRCode,CR.IsEditableByCustomer
  from tbl_repair_request_customer_ref as RRR
   LEFT JOIN tbl_cutomer_reference_labels as CR ON CR.CReferenceId = RRR.CReferenceId  AND CR.CReferenceName != ""
  where RRR.IsDeleted=0 and RRR.RRId=${RRId}`;
  return sql;
}


//MRO Section
CReferenceLabel.ViewMROCustomerReference = (MROId) => {
  var sql = `Select RRR.RRReferenceId,RRR.CReferenceId,RRR.RRId,RRR.MROId,RRR.CustomerId,RRR.ReferenceLabelName,RRR.ReferenceValue,CR.IsDisplayOnQRCode,CR.IsEditableByCustomer
  from tbl_repair_request_customer_ref as RRR
  LEFT JOIN tbl_cutomer_reference_labels as CR ON CR.CReferenceId = RRR.CReferenceId AND CR.CReferenceName != "" 
  where RRR.IsDeleted=0 and RRR.MROId=${MROId}`;
  return sql;
}
module.exports = CReferenceLabel;
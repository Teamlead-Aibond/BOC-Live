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

const RRCReference = function (objLabel) {
  //CReferenceLabel model for RR

  this.CReferenceId = objLabel.CReferenceId ? objLabel.CReferenceId : 0;
  this.RRId = objLabel.RRId ? objLabel.RRId : 0;
  this.ReferenceLabelName = objLabel.ReferenceLabelName;
  this.ReferenceValue = objLabel.ReferenceValue;
  this.RRReferenceId = objLabel.RRReferenceId ? objLabel.RRReferenceId : 0;
  this.CustomerId = objLabel.CustomerId ? objLabel.CustomerId : 0;
  this.MROId = objLabel.MROId ? objLabel.MROId : 0;

  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objLabel.authuser && objLabel.authuser.UserId) ? objLabel.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objLabel.authuser && objLabel.authuser.UserId) ? objLabel.authuser.UserId : TokenUserId;
}


RRCReference.CreateCustomerReference = (RRId, obj, result) => {
  obj = escapeSqlValues(obj);
  var sql = `Select RRReferenceId from tbl_repair_request_customer_ref 
    where IsDeleted=0 and RRId=${RRId} and CustomerId = ${obj.CustomerId} AND ReferenceLabelName='${obj.ReferenceLabelName}'  `;
  async.parallel([
    function (result) { con.query(sql, result) },
  ],
    function (err, results) {
      if (err) {
        return result(err, null);
      }

      if (results[0][0].length == 0) {

        var sql1 = `insert into tbl_repair_request_customer_ref(CReferenceId,RRId,
        CustomerId,ReferenceLabelName,ReferenceValue,Created,CreatedBy
        ) values 
        ('${obj.CReferenceId}','${RRId}','${obj.CustomerId}',
        '${obj.ReferenceLabelName}','${obj.ReferenceValue}',
        '${obj.Created}','${obj.CreatedBy}') `;
        async.parallel([
          function (result) { con.query(sql1, result) },
        ],
          function (err, results) {
            if (err) {
              return result(err, null);
            }
            obj.CReferenceId = results[0][0].insertId;
            result(null, { id: results[0][0].insertId, ...obj });
            return;
          });

      }
      else {
        result({ msg: "Record Already exist" }, null);
        return;
      }
    }
  );

};


RRCReference.Update = (RRId, obj, result) => {
  var sql = `Update  tbl_repair_request_customer_ref set 
  ReferenceValue='${obj.ReferenceValue}',Modified='${obj.Modified}',ModifiedBy='${obj.ModifiedBy}' 
  where RRReferenceId='${obj.RRReferenceId}'`;
  con.query(sql, (err, data) => {
    if (err) {
      return result(err, null);
    }
    return result(null, obj);
  });
};





//MRO Section
RRCReference.CreateMROCustomerReference = (MROId, obj, result) => {
  obj = escapeSqlValues(obj);
  var sql = `Select RRReferenceId from tbl_repair_request_customer_ref 
    where IsDeleted=0 and MROId=${MROId} and CustomerId = ${obj.CustomerId} AND ReferenceLabelName='${obj.ReferenceLabelName}'  `;
  async.parallel([
    function (result) { con.query(sql, result) },
  ],
    function (err, results) {
      if (err) {
        return result(err, null);
      }
      if (results[0][0].length == 0) {
        var sql1 = `insert into tbl_repair_request_customer_ref(CReferenceId,RRId,MROId,
        CustomerId,ReferenceLabelName,ReferenceValue,Created,CreatedBy
        ) values 
        ('${obj.CReferenceId}',0,'${MROId}','${obj.CustomerId}',
        '${obj.ReferenceLabelName}','${obj.ReferenceValue}','${obj.Created}','${obj.CreatedBy}') `;
        async.parallel([
          function (result) { con.query(sql1, result) },
        ],
          function (err, results) {
            if (err) {
              return result(err, null);
            }
            obj.CReferenceId = results[0][0].insertId;
            result(null, { id: results[0][0].insertId, ...obj });
            return;
          });

      }
      else {
        result({ msg: "Record Already exist" }, null);
        return;
      }
    });
};

module.exports = RRCReference;
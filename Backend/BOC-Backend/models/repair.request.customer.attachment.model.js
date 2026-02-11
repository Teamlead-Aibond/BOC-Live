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

const RRCustomerAttachmentModel = function FuncName(obj) {
  this.RRCustomerAttachmentId = obj.RRCustomerAttachmentId;
  this.CustomerId = obj.CustomerId ? obj.CustomerId : 0;
  this.RRId = obj.RRId ? obj.RRId : 0;
  this.Attachment = obj.Attachment ? obj.Attachment : '';
  this.AttachmentDesc = obj.AttachmentDesc ? obj.AttachmentDesc : '';
  this.AttachmentOriginalFile = obj.AttachmentOriginalFile ? obj.AttachmentOriginalFile : '';
  this.AttachmentMimeType = obj.AttachmentMimeType ? obj.AttachmentMimeType : '';
  this.AttachmentSize = obj.AttachmentSize ? obj.AttachmentSize : '';
  this.Comments = obj.Comments ? obj.Comments : '';
  this.Created = obj.Created ? obj.Created : cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.Modified = obj.Modified ? obj.Modified : cDateTime.getDateTime();
};

RRCustomerAttachmentModel.create = (objModel, result) => {
  objModel = escapeSqlValues(objModel);
  var sql = `insert into tbl_repair_request_customer_attachment(CustomerId,RRId,Attachment,AttachmentDesc,
  AttachmentOriginalFile,AttachmentMimeType,AttachmentSize,Comments,Created,CreatedBy) values(
  '${objModel.CustomerId}','${objModel.RRId}','${objModel.Attachment}','${objModel.AttachmentDesc}',
  '${objModel.AttachmentOriginalFile}','${objModel.AttachmentMimeType}','${objModel.AttachmentSize}','${objModel.Comments}','${objModel.Created}','${objModel.CreatedBy}')`;
  //console.log("ADD: " + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    objModel.RRCustomerAttachmentId = res.insertId;
    result(null, { id: res.insertId, ...objModel });
  });
};
RRCustomerAttachmentModel.getAll = (result) => {

  var sql = `SELECT RRCustomerAttachmentId,CustomerId,RRId,
  REPLACE(Attachment,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as Attachment,
  AttachmentDesc,
  AttachmentOriginalFile,AttachmentMimeType,AttachmentSize,Comments
  FROM tbl_repair_request_customer_attachment ca
  WHERE IsDeleted=0`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};


RRCustomerAttachmentModel.ListAttachmentQuery = (RRId) => {
  var sql = `SELECT RRCustomerAttachmentId,CustomerId,RRId,
  REPLACE(Attachment,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as Attachment,
  AttachmentDesc,
  AttachmentOriginalFile,AttachmentMimeType,AttachmentSize,Comments,CONCAT(u.FirstName," ",u.LastName) AddedBy,
  DATE_FORMAT(ca.Created,'%m/%d/%Y') AddedDate
  FROM tbl_repair_request_customer_attachment ca
  Left Join tbl_users u on u.UserId=ca.CreatedBy
  WHERE ca.IsDeleted=0 and RRId=${RRId} `;
  return sql;
}

RRCustomerAttachmentModel.findById = (RRCustomerAttachmentId, result) => {
  var sql = `SELECT RRCustomerAttachmentId,CustomerId,RRId,REPLACE(Attachment,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as Attachment,AttachmentDesc,
    AttachmentOriginalFile,AttachmentMimeType,AttachmentSize,Comments
     FROM tbl_repair_request_customer_attachment 
     WHERE IsDeleted = 0 AND RRCustomerAttachmentId = '${RRCustomerAttachmentId}'`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ kind: "not found" }, null);
  });
};

RRCustomerAttachmentModel.Update = (objModel, result) => {
  var sql = `UPDATE tbl_repair_request_customer_attachment SET CustomerId = ?, RRId = ?,Attachment = ?,AttachmentDesc = ?, AttachmentOriginalFile = ?,AttachmentMimeType = ?,
    AttachmentSize = ?,Comments = ?,Modified = ?,ModifiedBy = ?
    WHERE RRCustomerAttachmentId = ?`;
  var values = [
    objModel.CustomerId, objModel.RRId, objModel.Attachment,
    objModel.AttachmentDesc, objModel.AttachmentOriginalFile,
    objModel.AttachmentMimeType, objModel.AttachmentSize, objModel.Comments,
    objModel.Modified, objModel.ModifiedBy, objModel.RRCustomerAttachmentId
  ]
  //console.log(" EDit: " + sql, values);
  con.query(sql, values, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { id: objModel.RRCustomerAttachmentId, ...objModel });
  });
};

RRCustomerAttachmentModel.delete = (id, result) => {
  var sql = `UPDATE tbl_repair_request_customer_attachment SET IsDeleted =1,ModifiedBy='${global.authuser.UserId ? global.authuser.UserId : 0}' WHERE RRCustomerAttachmentId = ${id}`;
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};
module.exports = RRCustomerAttachmentModel;
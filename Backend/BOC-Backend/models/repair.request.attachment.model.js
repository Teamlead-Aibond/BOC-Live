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
const AttachmentModel = function FuncName(objAttachment) {
  this.AttachmentId = objAttachment.AttachmentId;
  this.IdentityType = objAttachment.IdentityType;
  this.IdentityId = objAttachment.IdentityId;
  this.AttachmentType = objAttachment.AttachmentType;
  this.Attachment = objAttachment.Attachment;
  this.AttachmentDesc = objAttachment.AttachmentDesc;
  this.AttachmentOriginalFile = objAttachment.AttachmentOriginalFile;
  this.AttachmentMimeType = objAttachment.AttachmentMimeType;
  this.AttachmentSize = objAttachment.AttachmentSize;
  this.Created = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objAttachment.authuser && objAttachment.authuser.UserId) ? objAttachment.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objAttachment.authuser && objAttachment.authuser.UserId) ? objAttachment.authuser.UserId : TokenUserId;
  this.Modified = cDateTime.getDateTime();
  this.AttachmentTypeName = objAttachment.AttachmentTypeName;
};
AttachmentModel.create = (objModel, result) => {
  objModel = escapeSqlValues(objModel);
  var sql = `insert into tbl_attachment_global(
        IdentityType,IdentityId,AttachmentType,Attachment,AttachmentDesc,
        AttachmentOriginalFile,AttachmentMimeType,AttachmentSize,
        Created,CreatedBy) 
    values(
      '${objModel.IdentityType}','${objModel.IdentityId}','${objModel.AttachmentType}',
      '${objModel.Attachment}','${objModel.AttachmentDesc}',
        '${objModel.AttachmentOriginalFile}','${objModel.AttachmentMimeType}','${objModel.AttachmentSize}',
        '${objModel.Created}','${objModel.CreatedBy}'
        )`;
  // console.log("RRA ADD: " + sql);
  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    objModel.AttachmentId = res.insertId;
    // console.log("created new RRAttachment : ", { id: res.insertId, ...objModel });
    result(null, { id: res.insertId, ...objModel });
  });
};


AttachmentModel.getAll = (result) => {

  var sql = `SELECT AttachmentId,IdentityType,IdentityId,AttachmentType,
    case AttachmentType
      WHEN 1 THEN '${Constants.array_notes_type[1]}'
      WHEN 2 THEN '${Constants.array_notes_type[2]}'
      WHEN 3 THEN '${Constants.array_notes_type[3]}'
      ELSE '-'
      end AttachmentTypeName,
    Attachment,AttachmentDesc,
    AttachmentOriginalFile,AttachmentMimeType,AttachmentSize 
    FROM tbl_attachment_global  
    WHERE IsDeleted=0`;

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

AttachmentModel.ListAttachmentQuery = (IdentityType, IdentityId) => {
  var sql = `SELECT AttachmentId,IdentityType,IdentityId,AttachmentType,case AttachmentType
    WHEN 1 THEN '${Constants.array_notes_type[1]}'
    WHEN 2 THEN '${Constants.array_notes_type[2]}'
    WHEN 3 THEN '${Constants.array_notes_type[3]}'
    ELSE '-'
    end AttachmentTypeName, REPLACE(Attachment,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as Attachment,AttachmentDesc,
    AttachmentOriginalFile,AttachmentMimeType,AttachmentSize 
     FROM tbl_attachment_global WHERE IsDeleted = 0 AND IdentityId = '${IdentityId}' AND IdentityType = '${IdentityType}'`;
  return sql;
}


AttachmentModel.findById = (AttachmentId, result) => {
  var sql = `SELECT AttachmentId,IdentityType,IdentityId,case AttachmentType
    WHEN 1 THEN '${Constants.array_notes_type[1]}'
    WHEN 2 THEN '${Constants.array_notes_type[2]}'
    WHEN 3 THEN '${Constants.array_notes_type[3]}'
    ELSE '-'
    end AttachmentTypeName,AttachmentType,REPLACE(Attachment,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as Attachment,AttachmentDesc,
    AttachmentOriginalFile,AttachmentMimeType,AttachmentSize 
     FROM tbl_attachment_global WHERE IsDeleted = 0 AND AttachmentId = '${AttachmentId}'`;

  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //  console.log("found the RRAttachment: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Department with the id
    result({ kind: "RRAttachment not found" }, null);
  });
};



AttachmentModel.updateById = (objModel, result) => {
  var sql = `UPDATE tbl_attachment_global SET IdentityType = ?, IdentityId = ?,
    AttachmentType = ?, Attachment = ?,
    AttachmentDesc = ?, AttachmentOriginalFile = ?,AttachmentMimeType = ?,
    AttachmentSize = ?,Modified = ?,ModifiedBy = ?
    WHERE AttachmentId = ?`;

  var values = [
    objModel.IdentityType, objModel.IdentityId,
    objModel.AttachmentType, objModel.Attachment,
    objModel.AttachmentDesc, objModel.AttachmentOriginalFile,
    objModel.AttachmentMimeType, objModel.AttachmentSize,
    objModel.Modified, objModel.ModifiedBy, objModel.AttachmentId
  ]
  // console.log("RRA EDit: " + sql);
  con.query(sql, values, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { id: objModel.AttachmentId, ...objModel });
  }
  );

  // console.log("Updated RRAttachment !");
};

AttachmentModel.remove = (id, result) => {
  var sql = `UPDATE tbl_attachment_global SET IsDeleted =1,ModifiedBy='${global.authuser.UserId ? global.authuser.UserId : 0}' WHERE AttachmentId = ${id}`;
  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Reference with the id
      result({ kind: "not_found" }, null);
      return;
    }
    //console.log("deleted RRAttachment with AttachmentId: ", id);
    result(null, res);
  });
};
module.exports = AttachmentModel;
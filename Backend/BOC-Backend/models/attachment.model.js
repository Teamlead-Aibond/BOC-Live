/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");
const CVAttachmentModel = function (Obj) {
  //Common for Create & Edit
  this.AttachmentList = Obj.AttachmentList;
  this.IdentityId = Obj.IdentityId;
  this.Created = Obj.getDateTime();
  // for Edit
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;
};

CVAttachmentModel.Create = (objmodel, result) => {
  var sql = `insert into tbl_vendor_customer_attachment(IdentityType,IdentityId,Attachment,AttachmentDesc,
    Created,CreatedBy,AttachmentOriginalFile,AttachmentMimeType,AttachmentSize) values `;
  for (let val of objmodel.AttachmentList.AttachmentList) {
    val = escapeSqlValues(val);
    sql += `('${val.IdentityType}','${objmodel.IdentityId}','${val.Attachment}',
      '${objmodel.AttachmentList.AttachmentDesc}',
      '${objmodel.Created}','${objmodel.CreatedBy}','${val.AttachmentOriginalFile}',
      '${val.AttachmentMimeType}','${val.AttachmentSize}'),`;
  }
  var Query = sql.slice(0, -1);
  //console.log(Query);
  con.query(Query, (err, res) => {
    if (err) {
      console.log(err);
      return result(err, null);
    }

    for (let val of objmodel.AttachmentList.AttachmentList) {
      val.AttachmentId = res.insertId;
    }
    return result(null, { id: res.insertId, ...objmodel });
  });
};

//To update the attachment
CVAttachmentModel.updateById = (objmodel, result) => {
  for (let val of objmodel.AttachmentList) {
    val = escapeSqlValues(val);
    var sql = `UPDATE tbl_vendor_customer_attachment SET 
     IdentityType ='${val.IdentityType}',IdentityId ='${objmodel.IdentityId}',
     AttachmentDesc='${val.AttachmentDesc}', Modified='${objmodel.Modified}',
     ModifiedBy='${objmodel.ModifiedBy}' WHERE AttachmentId = '${val.AttachmentId}'`

    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        return result(err, null);
      }
      if (result.affectedRows == 0) {
        result({ msg: "Attachment not found" }, null);
        return;
      }
    });
  }
  return result(null, objmodel);
};

//To return the csutomer / vendor attachment list query
CVAttachmentModel.listquery = (IdentityType, IdentityId) => {
  return `SELECT AttachmentId,Attachment,AttachmentDesc,Created,AttachmentDesc,AttachmentOriginalFile,AttachmentMimeType,AttachmentSize
      FROM tbl_vendor_customer_attachment  where  IsDeleted=0  and IdentityType='${IdentityType}' and IdentityId='${IdentityId}'`;
}

//To remove the attachment
CVAttachmentModel.remove = (id, result) => {
  var sql = `UPDATE tbl_vendor_customer_attachment SET IsDeleted = 1 WHERE AttachmentId = ${id}`;
  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return result(err, null);
    }
    if (res.affectedRows == 0) {
      return result({ msg: "Attachment not deleted" }, null);
    }
    return result(null, res);
  });
};
module.exports = CVAttachmentModel;
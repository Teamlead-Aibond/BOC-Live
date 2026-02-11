/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
const { escapeSqlValues } = require("../helper/common.function.js");
var cDateTime = require("../utils/generic.js");

const RRVendorAttachment = function (obj) {
    this.RRVendorAttachmentId = obj.RRVendorAttachmentId ? obj.RRVendorAttachmentId : 0;
    this.RRId = obj.RRId ? obj.RRId : 0;
    this.VendorId = obj.VendorId ? obj.VendorId : 0;
    this.AttachmentPath = obj.AttachmentPath ? obj.AttachmentPath : '';
    this.AttachmentOriginalFile = obj.AttachmentOriginalFile ? obj.AttachmentOriginalFile : '';
    this.AttachmentMimeType = obj.AttachmentMimeType ? obj.AttachmentMimeType : '';
    this.AttachmentSize = obj.AttachmentSize ? obj.AttachmentSize : 0;
    this.Created = obj.Created ? obj.Created : cDateTime.getDateTime();
    this.Modified = obj.Modified ? obj.Modified : cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

RRVendorAttachment.Create = (reqBody, result) => {
    var sql = `insert into tbl_repair_request_vendor_attachment(RRId,VendorId,AttachmentPath,AttachmentOriginalFile,AttachmentMimeType,
        AttachmentSize,Created,CreatedBy) values `;
    var attachment_available = '';
    for (let val of reqBody.RRVendorAttachmentList) {
        val = escapeSqlValues(val);
        var Obj = new RRVendorAttachment(val);
        if (Obj.AttachmentPath) {
            attachment_available = 1
            sql += `('${reqBody.RRId}','${reqBody.VendorId}','${Obj.AttachmentPath}','${Obj.AttachmentOriginalFile}','${Obj.AttachmentMimeType}','${Obj.AttachmentSize}','${Obj.Created}','${Obj.CreatedBy}'),`;
        }
    }
    if (attachment_available) {
        var Query = sql.slice(0, -1);
        con.query(Query, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, { id: res.insertId, ...reqBody });
            return;
        });
    } else {
        result({ msg: "Attachment is not valid. Please re upload again." }, null);
        return;
    }

};

RRVendorAttachment.ViewRRVendorAttachment = (VendorId, RRId) => {
    var sql = `Select *, REPLACE(AttachmentPath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as AttachmentPath FROM tbl_repair_request_vendor_attachment rrva where IsDeleted=0 and RRId=${RRId} AND VendorId=${VendorId}  `;
    return sql;
}
RRVendorAttachment.Delete = (id, result) => {

    var sql = `UPDATE tbl_repair_request_vendor_attachment SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}',
     ModifiedBy='${global.authuser.UserId}' WHERE RRVendorAttachmentId = '${id}' `;
    con.query(sql, (err, res) => {

        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        return result(null, res);
    });
};
module.exports = RRVendorAttachment;

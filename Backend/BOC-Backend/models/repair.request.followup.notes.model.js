/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
var async = require('async');

const objModel = function FuncName(objModel) {
    this.FollowUpNoteId = objModel.FollowUpNoteId ? objModel.FollowUpNoteId : 0;
    this.RRId = objModel.RRId ? objModel.RRId : 0;
    this.Notes = objModel.Notes ? objModel.Notes : '';
    this.FileName = objModel.FileName ? objModel.FileName : '';
    this.FileUrl = objModel.FileUrl ? objModel.FileUrl : '';
    this.FileSize = objModel.FileSize ? objModel.FileSize : '';
    this.FileMimeType = objModel.FileMimeType ? objModel.FileMimeType : '';
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (objModel.authuser && objModel.authuser.UserId) ? objModel.authuser.UserId : TokenUserId;
    this.ModifiedBy = (objModel.authuser && objModel.authuser.UserId) ? objModel.authuser.UserId : TokenUserId;
};

objModel.create = (objModel, result) => {

    var sql = `insert into tbl_repair_request_followup_notes(
         RRId,Notes,FileName,
         FileUrl,FileMimeType,FileSize,Created,CreatedBy)
         values(?,?,?,?,?,?,?,?)`;
    objModel.FileName = objModel.FileName ? objModel.FileName : '';
    var values = [objModel.RRId, objModel.Notes, objModel.FileName, objModel.FileUrl, objModel.FileMimeType, objModel.FileSize, objModel.Created, objModel.CreatedBy
    ]
    con.query(sql, values, (err, res) => {
        if (err) {
            return result(err, null);
        }
        objModel.FollowUpNoteId = res.insertId;
        result(null, { id: res.insertId, ...objModel });
    });
};


objModel.getAll = (result) => {
    var sql = `SELECT RRId,   
    Notes,FileName,FileUrl,FileMimeType,FileSize,Created
    FROM tbl_repair_request_followup_notes WHERE
    IsDeleted=0`;
    con.query(sql, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};
objModel.findById = (FollowUpNoteId, result) => {
    var sql = `SELECT FollowUpNoteId,RRId,Notes,FileName,FileUrl,FileSize,FileMimeType,Created
     FROM tbl_repair_request_followup_notes WHERE FollowUpNoteId = ${FollowUpNoteId}`;

    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "Notes not found" }, null);
    });
};


objModel.updateById = (objModel, result) => {
    var sql = `UPDATE tbl_repair_request_followup_notes 
    SET RRId = ?, Notes = ?, FileName = ?,FileUrl = ?,FileMimeType = ?,FileSize = ?,Modified = ?,ModifiedBy = ? WHERE FollowUpNoteId = ?`;
    var values = [
        objModel.RRId, objModel.Notes, objModel.FileName,
        objModel.FileUrl, objModel.FileMimeType, objModel.FileSize, objModel.Modified, objModel.ModifiedBy, objModel.FollowUpNoteId
    ];
    //console.log(sql, values)
    con.query(sql, values, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, { id: objModel.FollowUpNoteId, ...objModel });
    }
    );
};

objModel.remove = (id, result) => {
    var Obj = new objModel({ FollowUpNoteId: id });
    var sql = `UPDATE tbl_repair_request_followup_notes SET IsDeleted = 1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE FollowUpNoteId = ${Obj.FollowUpNoteId}`;
    con.query(sql, (err, res) => {

        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
};


objModel.DeleteRRFollowUpNotesQuery = (RRId) => {
    var Obj = new objModel({ RRId: RRId });
    return sql = `UPDATE tbl_repair_request_followup_notes SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE  IsDeleted = 0  AND  RRId=${RRId}`;
}


objModel.ViewFollowUpNotes = (RRId) => {
    return sql = `Select FollowUpNoteId,RRId,Notes, 
    FileName,REPLACE(FileUrl,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as FileUrl,FileSize,FileMimeType, N.Created, N.CreatedBy,U.FirstName,U.LastName,U.Username
    from tbl_repair_request_followup_notes as N
    LEFT JOIN tbl_users as U ON U.UserId = N.CreatedBy
    where N.IsDeleted=0  and N.RRId=${RRId}`;
}
module.exports = objModel;

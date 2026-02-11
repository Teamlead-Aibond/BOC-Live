/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");
const Constants = require("../config/constants.js");

const RepairRequestRevertHistory = function FuncName(obj) {
    this.RevertHistoryId = obj.RevertHistoryId ? obj.RevertHistoryId : 0;
    this.IdentityType = obj.IdentityType ? obj.IdentityType : 0;
    this.IdentityId = obj.IdentityId ? obj.IdentityId : 0;
    this.FromStatus = obj.FromStatus ? obj.FromStatus : 0;
    this.ToStatus = obj.ToStatus ? obj.ToStatus : 0;
    this.Comments = obj.Comments ? obj.Comments : '';
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};
RepairRequestRevertHistory.create = (Obj, result) => {
    val = escapeSqlValues(Obj);
    var sql = `insert into tbl_repair_request_revert_history
    (IdentityType,IdentityId,FromStatus,ToStatus,Comments,Created,CreatedBy)
    values ('${val.IdentityType}','${val.IdentityId}','${val.FromStatus}','${val.ToStatus}',
    '${val.Comments}','${val.Created}','${val.CreatedBy}')`;
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { id: res.insertId, ...Obj });
    });
};
//
RepairRequestRevertHistory.GetEmailContentForRevert = (RRId, result) => {

    var sql = `SELECT rr.RRNo,T.Subject,
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(T.Content,'{RRNo}',rr.RRNo),'{FromStatusName}',
    CASE rrrh.FromStatus
    WHEN 0 THEN '${Constants.array_rr_status[0]}' WHEN 1 THEN '${Constants.array_rr_status[1]}' 
    WHEN 2 THEN '${Constants.array_rr_status[2]}' WHEN 3 THEN '${Constants.array_rr_status[3]}'
    WHEN 4 THEN '${Constants.array_rr_status[4]}'WHEN 5 THEN '${Constants.array_rr_status[5]}'
    WHEN 6 THEN '${Constants.array_rr_status[6]}' WHEN 7 THEN '${Constants.array_rr_status[7]}' WHEN 8 THEN '${Constants.array_rr_status[8]}'
    ELSE '-' end ) ,'{ToStatusName}',
    CASE rrrh.ToStatus
    WHEN 0 THEN '${Constants.array_rr_status[0]}' WHEN 1 THEN '${Constants.array_rr_status[1]}' 
    WHEN 2 THEN '${Constants.array_rr_status[2]}' WHEN 3 THEN '${Constants.array_rr_status[3]}'
    WHEN 4 THEN '${Constants.array_rr_status[4]}'WHEN 5 THEN '${Constants.array_rr_status[5]}'
    WHEN 6 THEN '${Constants.array_rr_status[6]}' WHEN 7 THEN '${Constants.array_rr_status[7]}' WHEN 8 THEN '${Constants.array_rr_status[8]}'
    ELSE '-'	end ),'{UserFirstName}',u.FirstName),'{UserLastName}',u.LastName)  as Content,'kumaresh1043@gmail.com' as Email , GS.RevertNotificationEmail,GS.AppCCEmail
    From tbl_repair_request rr
    LEFT JOIN tbl_repair_request_revert_history rrrh on rrrh.IdentityId=rr.RRId and RevertHistoryId=(Select Max(RevertHistoryId) from tbl_repair_request_revert_history )
    LEFT JOIN tbl_email_template T on T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_REVERT_NOTIFICATION}'
    LEFT JOIN tbl_users u on u.UserId=rrrh.CreatedBy
    LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1 where rr.RRId=${RRId} `;
    //  console.log("SqlMail=" + sql)
    return sql;
};
//
RepairRequestRevertHistory.ViewRevertHistory = (IdentityId) => {
    return `Select RevertHistoryId,rrrh.IdentityType,rrrh.IdentityId,
  CASE rrrh.FromStatus
  WHEN 0 THEN '${Constants.array_rr_status[0]}' WHEN 1 THEN '${Constants.array_rr_status[1]}' 
  WHEN 2 THEN '${Constants.array_rr_status[2]}' WHEN 3 THEN '${Constants.array_rr_status[3]}'
  WHEN 4 THEN '${Constants.array_rr_status[4]}'WHEN 5 THEN '${Constants.array_rr_status[5]}'
  WHEN 6 THEN '${Constants.array_rr_status[6]}' WHEN 7 THEN '${Constants.array_rr_status[7]}' WHEN 8 THEN '${Constants.array_rr_status[8]}'
  ELSE '-'	end FromStatus,
  CASE rrrh.ToStatus
  WHEN 0 THEN '${Constants.array_rr_status[0]}'WHEN 1 THEN '${Constants.array_rr_status[1]}' 
  WHEN 2 THEN '${Constants.array_rr_status[2]}'WHEN 3 THEN '${Constants.array_rr_status[3]}'
  WHEN 4 THEN '${Constants.array_rr_status[4]}'WHEN 5 THEN '${Constants.array_rr_status[5]}'
  WHEN 6 THEN '${Constants.array_rr_status[6]}'WHEN 7 THEN '${Constants.array_rr_status[7]}' WHEN 8 THEN '${Constants.array_rr_status[8]}'
  ELSE '-'	end ToStatus,
  Comments,DATE_FORMAT(rrrh.Created,'%Y-%m-%d %H:%i:%s') AS Created,u.UserName
  From tbl_repair_request_revert_history as rrrh
  LEFT JOIN tbl_users as u ON u.UserId = rrrh.CreatedBy
  where rrrh.IsDeleted=0 and rrrh.IdentityType=${Constants.CONST_IDENTITY_TYPE_RR} and rrrh.Identityid='${IdentityId}' `;

};
module.exports = RepairRequestRevertHistory;

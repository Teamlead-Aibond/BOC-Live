/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const GeneralHistoryLog = function (obj) {

    this.GeneralLogId = obj.GeneralLogId ? obj.GeneralLogId : 0;
    this.IdentityType = obj.IdentityType ? obj.IdentityType : 0;
    this.IdentityId = obj.IdentityId ? obj.IdentityId : 0;
    this.RequestBody = obj.RequestBody ? obj.RequestBody : '-';
    this.Type = obj.Type ? obj.Type : '-';
    this.BaseTableRequest = obj.BaseTableRequest ? obj.BaseTableRequest : '-';
    this.ItemTableRequest = obj.ItemTableRequest ? obj.ItemTableRequest : '-';
    this.BaseTableResponse = obj.BaseTableResponse ? obj.BaseTableResponse : '-';
    this.ItemTableResponse = obj.ItemTableResponse ? obj.ItemTableResponse : '-';
    this.ErrorMessage = obj.ErrorMessage ? obj.ErrorMessage : '-';
    this.CommonLogMessage = obj.CommonLogMessage ? obj.CommonLogMessage : '-';

    this.Created = obj.Created ? obj.Created : cDateTime.getDateTime();
    this.Modified = obj.Modified ? obj.Modified : cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

GeneralHistoryLog.Create = (obj, result) => {
    obj = new GeneralHistoryLog(obj)
    var sql = `insert into tbl_general_log(IdentityType,IdentityId,RequestBody,Type,BaseTableRequest,ItemTableRequest,BaseTableResponse,ItemTableResponse,ErrorMessage,CommonLogMessage,Created,CreatedBy)
    values('${obj.IdentityType}','${obj.IdentityId}','${obj.RequestBody}','${obj.Type}','${obj.BaseTableRequest}','${obj.ItemTableRequest}','${obj.BaseTableResponse}','${obj.ItemTableResponse}','${obj.ErrorMessage}','${obj.CommonLogMessage}','${obj.Created}','${obj.CreatedBy}')`;
    //console.log(sql)
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...obj });
    });
};
module.exports = GeneralHistoryLog;


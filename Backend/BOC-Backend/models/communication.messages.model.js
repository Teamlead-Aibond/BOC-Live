/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");

const CommunicationMessagesModel = function (obj) {
    this.MessageId = obj.MessageId ? obj.MessageId : 0;
    this.IdentityType = obj.IdentityType ? obj.IdentityType : 0;
    this.IdentityId = obj.IdentityId ? obj.IdentityId : 0;
    this.ModuleType = obj.ModuleType ? obj.ModuleType : 0;
    this.ModuleRecordId = obj.ModuleRecordId ? obj.ModuleRecordId : 0;
    this.Message = obj.Message ? obj.Message : '';
    this.IsNew = obj.IsNew ? obj.IsNew : 0;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};
// 
CommunicationMessagesModel.create = (obj, result) => {
    obj = escapeSqlValues(obj);
    var sql = `insert into tb_communication_messages(IdentityType,IdentityId,ModuleType,ModuleRecordId,Message,IsNew,Created,CreatedBy) values`;
    sql += `('${obj.IdentityType}','${obj.IdentityId}','${obj.ModuleType}','${obj.ModuleRecordId}','${obj.Message}','${obj.IsNew}','${obj.Created}','${obj.CreatedBy}' ) `;
    //console.log("sql=" + sql)
    con.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return result(err, null);
        }
        result(null, { id: res.insertId, ...obj });
    });
};
//
CommunicationMessagesModel.listquery = (ModuleType, ModuleRecordId, result) => {
    return `SELECT MessageId,IdentityType,IdentityId,c.CompanyName,ModuleType,ModuleRecordId,Message,IsNew
     FROM tb_communication_messages cm     Left Join tbl_customers c on c.CustomerId=cm.IdentityId 
     WHERE ModuleType = ${ModuleType} and ModuleRecordId = ${ModuleRecordId} `;

};
module.exports = CommunicationMessagesModel;
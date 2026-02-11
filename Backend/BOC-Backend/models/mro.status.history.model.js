/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
const MROStatusHistory = function (obj) {
    this.MROHistoryId = obj.MROHistoryId;
    this.MROId = obj.MROId;
    this.HistoryStatus = obj.HistoryStatus;
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    const TokenUserName = global.authuser.FullName ? global.authuser.FullName : '';
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedByName = (obj.authuser && obj.authuser.FullName) ? obj.authuser.FullName : TokenUserName;
    this.Created = cDateTime.getDateTime();
    this.IsDeleted = obj.IsDeleted ? 1 : 0;
};


MROStatusHistory.ViewMROStatusHistory = (MROId) => {
    return sql = `Select MROHistoryId,MROId,HistoryStatus,ModifiedByName,Created, 
  CASE HistoryStatus 
 WHEN 0 THEN '${Constants.array_mro_status[0]}'
 WHEN 1 THEN '${Constants.array_mro_status[1]}' 
 WHEN 2 THEN '${Constants.array_mro_status[2]}' 
 WHEN 3 THEN '${Constants.array_mro_status[3]}' 
 WHEN 4 THEN '${Constants.array_mro_status[4]}' 
 WHEN 5 THEN '${Constants.array_mro_status[5]}' 
 WHEN 6 THEN '${Constants.array_mro_status[6]}' 
 WHEN 7 THEN '${Constants.array_mro_status[7]}'  
 ELSE '-'	end HistoryStatusName 
  from tbl_mro_status_history  where IsDeleted=0 and MROId=${MROId}`;
}


MROStatusHistory.Create = (objModel, result) => {
    var sql = `insert into tbl_mro_status_history(MROId,HistoryStatus,ModifiedBy,ModifiedByName,Created)
        values('${objModel.MROId}','${objModel.HistoryStatus}',
        '${objModel.ModifiedBy}','${objModel.ModifiedByName}','${objModel.Created}' 
        )`;

    // console.log("history sql" + sql);
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);

    });
};


MROStatusHistory.CreateQuery = (objModel, result) => {
    return sql = `insert into tbl_mro_status_history(MROId,HistoryStatus,ModifiedBy,ModifiedByName,Created)
      values('${objModel.MROId}','${objModel.HistoryStatus}',
      '${objModel.ModifiedBy}','${objModel.ModifiedByName}','${objModel.Created}' 
      )`;
};

module.exports = MROStatusHistory;
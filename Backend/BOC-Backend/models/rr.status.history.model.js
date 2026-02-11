/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
const RRStatusHistory = function (obj) {
  this.HistoryId = obj.HistoryId;
  this.RRId = obj.RRId;
  this.HistoryStatus = obj.HistoryStatus;
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  const TokenUserName = global.authuser.FullName ? global.authuser.FullName : '';
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedByName = (obj.authuser && obj.authuser.FullName) ? obj.authuser.FullName : TokenUserName;
  this.Created = cDateTime.getDateTime();
  this.IsDeleted = obj.IsDeleted ? 1 : 0;
};


RRStatusHistory.ViewRRStatusHistory = (RRId) => {
  var sql = `Select HistoryId,RRId,HistoryStatus,ModifiedByName,Created, 
  CASE HistoryStatus 
 WHEN 0 THEN '${Constants.array_rr_status[0]}'
 WHEN 1 THEN '${Constants.array_rr_status[1]}' 
 WHEN 2 THEN '${Constants.array_rr_status[2]}' 
 WHEN 3 THEN '${Constants.array_rr_status[3]}' 
 WHEN 4 THEN '${Constants.array_rr_status[4]}' 
 WHEN 5 THEN '${Constants.array_rr_status[5]}' 
 WHEN 6 THEN '${Constants.array_rr_status[6]}' 
 WHEN 7 THEN '${Constants.array_rr_status[7]}' 
 WHEN 8 THEN '${Constants.array_rr_status[8]}' 
 ELSE '-'	end HistoryStatusName 
  from tbl_repair_request_status_history  where IsDeleted=0 and RRId=${RRId}`;
  return sql;
}


RRStatusHistory.Create = (objModel, result) => {
  var sql = `insert into tbl_repair_request_status_history(RRId,HistoryStatus,ModifiedBy,ModifiedByName,Created)
        values('${objModel.RRId}','${objModel.HistoryStatus}',
        '${objModel.ModifiedBy}','${objModel.ModifiedByName}','${objModel.Created}' 
        )`;

  //console.log("history sql" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    // result(null, { id: res.insertId, ...objModel });
    result(null, res);

    return;
  });
};



RRStatusHistory.CreateQuery = (objModel, result) => {
  var sql = `insert into tbl_repair_request_status_history(RRId,HistoryStatus,ModifiedBy,ModifiedByName,Created)
      values('${objModel.RRId}','${objModel.HistoryStatus}',
      '${objModel.ModifiedBy}','${objModel.ModifiedByName}','${objModel.Created}' 
      )`;
  return sql;
};

module.exports = RRStatusHistory;
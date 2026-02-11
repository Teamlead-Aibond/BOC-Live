/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
const RRSubStatusHistory = function (obj) {
  this.SubStatusHistoryId = obj.SubStatusHistoryId;
  this.RRId = obj.RRId;
  this.HistorySubStatusId = obj.HistorySubStatusId;
  this.HistoryAssigneeId = obj.HistoryAssigneeId ? obj.HistoryAssigneeId : 0;
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  const TokenUserName = global.authuser.FullName ? global.authuser.FullName : '';
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedByName = (obj.authuser && obj.authuser.FullName) ? obj.authuser.FullName : TokenUserName;
  this.Created = cDateTime.getDateTime();
  this.IsDeleted = obj.IsDeleted ? 1 : 0;
};


RRSubStatusHistory.ViewRRSubStatusHistory = (RRId) => {
  var sql = `Select sh.SubStatusHistoryId,sh.RRId,sh.HistorySubStatusId,sh.ModifiedByName,sh.Created,s.SubStatusName,CONCAT(a.FirstName,' ', a.LastName) as AssigneeName
  from tbl_repair_request_substatus_history sh 
  LEFT JOIN tbl_repair_request_substatus s ON s.SubStatusId=sh.HistorySubStatusId
  LEFT JOIN tbl_users a ON a.UserId=sh.HistoryAssigneeId
  where sh.IsDeleted=0 and sh.RRId=${RRId}`;
  return sql;
}


RRSubStatusHistory.Create = (objModel, result) => {
  var sql = `insert into tbl_repair_request_substatus_history(RRId,HistorySubStatusId,HistoryAssigneeId,ModifiedBy,ModifiedByName,Created)
        values('${objModel.RRId}','${objModel.HistorySubStatusId}','${objModel.HistoryAssigneeId}',
        '${objModel.ModifiedBy}','${objModel.ModifiedByName}','${objModel.Created}' 
        )`;

  //console.log("history sql" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    // result(null, { id: res.insertId, ...objModel });
    result(null, res);

    return;
  });
};



RRSubStatusHistory.CreateQuery = (objModel, result) => {
  var sql = `insert into tbl_repair_request_substatus_history(RRId,HistorySubStatusId,HistoryAssigneeId,ModifiedBy,ModifiedByName,Created)
      values('${objModel.RRId}','${objModel.HistorySubStatusId}','${objModel.HistoryAssigneeId}',
      '${objModel.ModifiedBy}','${objModel.ModifiedByName}','${objModel.Created}' 
      )`;
  return sql;
};

module.exports = RRSubStatusHistory;
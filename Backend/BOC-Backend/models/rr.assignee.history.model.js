/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const RRAssigneeHistory = function (obj) {
  this.AssigneeHistoryId = obj.AssigneeHistoryId;
  this.RRId = obj.RRId;
  this.HistoryAssigneeId = obj.HistoryAssigneeId;
  this.HistorySubStatusId = obj.HistorySubStatusId ? obj.HistorySubStatusId : 0;
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  const TokenUserName = global.authuser.FullName ? global.authuser.FullName : '';
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedByName = (obj.authuser && obj.authuser.FullName) ? obj.authuser.FullName : TokenUserName;
  this.Created = cDateTime.getDateTime();
  this.IsDeleted = obj.IsDeleted ? 1 : 0;
};


RRAssigneeHistory.ViewRRAssigneeHistory = (RRId) => {
  return `Select ah.AssigneeHistoryId,ah.RRId,ah.HistoryAssigneeId,ah.ModifiedByName,ah.Created,CONCAT(a.FirstName,' ', a.LastName) as AssigneeName, ss.SubStatusName
  from tbl_repair_request_assignee_history ah
  LEFT JOIN tbl_users a ON a.UserId=ah.HistoryAssigneeId
  LEFT JOIN tbl_repair_request_substatus ss ON ss.SubStatusId=ah.HistorySubStatusId
  where ah.IsDeleted=0 and ah.RRId=${RRId}`;

}


RRAssigneeHistory.Create = (objModel, result) => {
  var sql = `insert into tbl_repair_request_assignee_history(RRId,HistoryAssigneeId,HistorySubStatusId,ModifiedBy,ModifiedByName,Created)
        values('${objModel.RRId}','${objModel.HistoryAssigneeId}','${objModel.HistorySubStatusId}',
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



RRAssigneeHistory.CreateQuery = (objModel, result) => {
  return `insert into tbl_repair_request_assignee_history(RRId,HistoryAssigneeId,HistorySubStatusId,ModifiedBy,ModifiedByName,Created)
      values('${objModel.RRId}','${objModel.HistoryAssigneeId}','${objModel.HistorySubStatusId}',
      '${objModel.ModifiedBy}','${objModel.ModifiedByName}','${objModel.Created}' 
      )`;

};

module.exports = RRAssigneeHistory;
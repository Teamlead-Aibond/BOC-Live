/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const RRLocationHistory = function (obj) {
  this.RRPartLocationHistoryId = obj.RRPartLocationHistoryId;
  this.RRId = obj.RRId;
  this.HistoryRRPartLocationId = obj.HistoryRRPartLocationId;
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  const TokenUserName = global.authuser.FullName ? global.authuser.FullName : '';
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedByName = (obj.authuser && obj.authuser.FullName) ? obj.authuser.FullName : TokenUserName;
  this.Created = cDateTime.getDateTime();
  this.IsDeleted = obj.IsDeleted ? 1 : 0;
};


RRLocationHistory.ViewRRLocationHistory = (RRId) => {
  return `Select lh.RRPartLocationHistoryId,lh.RRId,lh.HistoryRRPartLocationId,lh.ModifiedByName,lh.Created,l.RRPartLocation
  from tbl_repair_request_part_location_history lh
  LEFT JOIN tbl_repair_request_part_location l ON l.RRPartLocationId=lh.HistoryRRPartLocationId
  where lh.IsDeleted=0 and lh.RRId=${RRId}`;

}

RRLocationHistory.Create = (objModel, result) => {
  var sql = `insert into tbl_repair_request_part_location_history(RRId,HistoryRRPartLocationId,ModifiedBy,ModifiedByName,Created)
        values('${objModel.RRId}','${objModel.HistoryRRPartLocationId}',
        '${objModel.ModifiedBy}','${objModel.ModifiedByName}','${objModel.Created}' 
        )`;

  // console.log("history sql" + sql);
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

RRLocationHistory.CreateQuery = (objModel, result) => {
  return `insert into tbl_repair_request_part_location_history(RRId,HistoryRRPartLocationId,ModifiedBy,ModifiedByName,Created)
      values('${objModel.RRId}','${objModel.HistoryRRPartLocationId}',
      '${objModel.ModifiedBy}','${objModel.ModifiedByName}','${objModel.Created}' 
      )`;

};

module.exports = RRLocationHistory;
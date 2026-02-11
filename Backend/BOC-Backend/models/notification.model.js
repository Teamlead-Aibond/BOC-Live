/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const NotificationModel = function (objModel) {
  this.NotificationId = objModel.NotificationId;
  this.RRId = objModel.RRId ? objModel.RRId : 0;
  this.NotificationIdentityType = objModel.NotificationIdentityType ? objModel.NotificationIdentityType : 0;
  this.NotificationIdentityId = objModel.NotificationIdentityId ? objModel.NotificationIdentityId : 0;
  this.NotificationIdentityNo = objModel.NotificationIdentityNo ? objModel.NotificationIdentityNo : '';
  this.ShortDesc = objModel.ShortDesc ? objModel.ShortDesc : '';
  this.Description = objModel.Description ? objModel.Description : '';

  this.Created = cDateTime.getDateTime();

  this.IsDeleted = objModel.IsDeleted ? objModel.IsDeleted : 0;

  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  const TokenCreatedByIdentityId = global.authuser.IdentityId ? global.authuser.IdentityId : 0;
  const TokenUserName = global.authuser.FullName ? global.authuser.FullName : '';
  const TokenIdentityType = global.authuser.IdentityType ? global.authuser.IdentityType : 0;

  this.CreatedBy = (objModel.authuser && objModel.authuser.UserId) ? objModel.authuser.UserId : TokenUserId;
  this.CreatedByType = (objModel.authuser && objModel.authuser.IdentityType) ? objModel.authuser.IdentityType : TokenIdentityType;
  this.CreatedByIdentityId = (objModel.authuser && objModel.authuser.IdentityId) ? objModel.authuser.IdentityId : TokenCreatedByIdentityId;
  this.CreatedByName = (objModel.authuser && objModel.authuser.FullName) ? objModel.authuser.FullName : TokenUserName;

};

//To create a Notification
NotificationModel.Create = (Obj, result) => {
  var sql = `insert into tbl_notification(RRId,NotificationIdentityType,NotificationIdentityId,
    NotificationIdentityNo,ShortDesc,Description,Created,CreatedByType,CreatedByName,CreatedByIdentityId,CreatedBy) values(?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [Obj.RRId, Obj.NotificationIdentityType, Obj.NotificationIdentityId, Obj.NotificationIdentityNo,
  Obj.ShortDesc, Obj.Description, Obj.Created, Obj.CreatedByType, Obj.CreatedByName, Obj.CreatedByIdentityId, Obj.CreatedBy];
  //console.log("PO values=" + values);
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log(err);
      return result(err, null);
    }

    return result(null, { id: res.insertId, ...Obj });
  });
};

//To get all the RR Notification
NotificationModel.getRRNotificationList = (RRId, result) => {

  var sql = `Select NotificationId,RRId,ShortDesc,Description,Created,CreatedByType,CreatedByName from tbl_notification where IsDeleted=0 AND RRId = ${RRId} ORDER BY NotificationId ASC`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}


//To get all the RR Notification
NotificationModel.getLatest = (result) => {

  var sql = `Select  NotificationId,RRId,ShortDesc,Description,Created,CreatedByType,CreatedByName from tbl_notification where IsDeleted=0 ORDER BY NotificationId DESC LIMIT 10`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}



module.exports = NotificationModel;
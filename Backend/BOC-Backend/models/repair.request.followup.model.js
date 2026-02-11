/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var MailConfig = require('../config/email.config');

var gmailTransport = MailConfig.GmailTransport;

const FollowUp = function (objFollowUp) {
  this.FollowupId = objFollowUp.FollowupId;
  this.RRId = objFollowUp.RRId ? objFollowUp.RRId : 0;
  this.MROId = objFollowUp.MROId ? objFollowUp.MROId : 0;
  this.IdentityType = objFollowUp.IdentityType;
  this.IdentityId = objFollowUp.IdentityId;
  this.FromEmail = objFollowUp.FromEmail;
  this.ToEmail = objFollowUp.ToEmail;
  this.CC = objFollowUp.CC;
  this.Subject = objFollowUp.Subject;
  this.Message = objFollowUp.Message;
  this.Notes = objFollowUp.Notes ? objFollowUp.Notes : '';
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objFollowUp.authuser && objFollowUp.authuser.UserId) ? objFollowUp.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objFollowUp.authuser && objFollowUp.authuser.UserId) ? objFollowUp.authuser.UserId : TokenUserId;
};

FollowUp.GetFollowUpGetContent = (FollowUpBody, result) => {
  var TemplateType = "";
  if (FollowUpBody.IdentityType == 1) {
    TemplateType = "CUSTOMER_FOLLOW_UP";
  }
  else if (FollowUpBody.IdentityType == 2) {
    TemplateType = "VENDOR_FOLLOW_UP";
  }

  var sql = `SELECT tc.Email,tv.VendorEmail,rr.RRNo,rr.PartNo,rrp.Description
    ,REPLACE(REPLACE(T.Subject,'{RRNo}',rr.RRNo),'{PartNo}',rr.PartNo) as Subject
    ,REPLACE( REPLACE(REPLACE(REPLACE(T.Content,'{PartDescription}',rrp.Description),'{RRNo}',rr.RRNo),'{Department}',dp.CustomerDepartmentName),'{PartNo}',rr.PartNo) as Content
    ,dp.DepartmentName, GS.AppEmail,GS.AppCCEmail
    
    FROM tbl_repair_request rr 
    LEFT JOIN tbl_customers tc on tc.CustomerId=rr.CustomerId 
    LEFT JOIN tbl_vendors tv on tv.VendorId=rr.VendorId 
    LEFT JOIN tbl_repair_request_parts rrp on rrp.RRId=rr.RRId    
    LEFT JOIN tbl_customer_departments dp on dp.CustomerDepartmentId=rr.DepartmentId

    LEFT JOIN tbl_email_template T on T.TemplateType = '${TemplateType}'
    LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1 
    WHERE rr.RRId=${FollowUpBody.RRId}`;


  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      var FollowUpObj = {
        FromEmail: res[0].AppEmail,
        ToEmail: (FollowUpBody.IdentityType == 1) ? res[0].Email : res[0].VendorEmail,
        CC: res[0].AppCCEmail,
        Subject: res[0].Subject,
        Message: res[0].Content
      };
      result(null, FollowUpObj);
      return;
    }

    return result({ msg: "Follow up template not found" }, null);
  });


}




FollowUp.Create = (reqbody, result) => {
  var objFollowUp = new FollowUp(reqbody);
  var sql = `insert into tbl_repair_request_followup
    (MROId,RRId,IdentityType,IdentityId,FromEmail,ToEmail,CC,Subject,Message,Notes,Created,CreatedBy) 
    values(?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [
    objFollowUp.MROId, objFollowUp.RRId, objFollowUp.IdentityType, objFollowUp.IdentityId, objFollowUp.FromEmail
    , objFollowUp.ToEmail, objFollowUp.CC, objFollowUp.Subject, objFollowUp.Message, objFollowUp.Notes
    , objFollowUp.Created, objFollowUp.CreatedBy
  ];

  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    reqbody.FollowupId = res.insertId;
    if (res.insertId != "") {
      let HelperOptions = {
        from: objFollowUp.FromEmail,
        to: objFollowUp.ToEmail,
        subject: objFollowUp.Subject,
        text: objFollowUp.Message
      };
      // console.log(HelperOptions);
      gmailTransport.sendMail(HelperOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
        //console.log(info);
      });
    }
    result(null, { id: res.insertId, ...reqbody });
    return;
  });

};


FollowUp.View = (RRId) => {

  var sql = ``;
  sql += `SELECT Case when IdentityType=1 then 'Customer' WHEN IdentityType=2 THEN 'Vendor' end as IdentityTypeName,IdentityType,
FromEmail,ToEmail,CC,Subject,Message,Notes,DATE_FORMAT(Created,'%d/%m/%Y') as Created,FollowupId
FROM tbl_repair_request_followup where IsDeleted = 0 AND RRId=${RRId}`;
  return sql;

};


FollowUp.ViewFollowUp = (FollowupId, result) => {
  var sql = `SELECT Case when IdentityType=1 then 'Customer' WHEN IdentityType=2 THEN 'Vendor' end as IdentityTypeName,IdentityType,
  FromEmail,ToEmail,CC,Subject,Message,Notes,DATE_FORMAT(Created,'%d/%m/%Y') as Created,FollowupId
  FROM tbl_repair_request_followup where IsDeleted = 0 AND FollowupId=${FollowupId}`;

  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });

};
FollowUp.UpdateNotesByFollowUpId = (FollowUp, result) => {


  var sql = `UPDATE tbl_repair_request_followup  SET  Notes=?,Modified=?,ModifiedBy=?
    WHERE FollowupId = ?`;
  var values = [
    FollowUp.Notes,
    cDateTime.getDateTime(), FollowUp.ModifiedBy, FollowUp.FollowupId
  ]

  con.query(sql, values, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: FollowUp.FollowupId, ...FollowUp });
    return;
  }
  );

};

FollowUp.Delete = (FollowUp, result) => {


  var sql = `UPDATE tbl_repair_request_followup  SET  IsDeleted=1,Modified=?,ModifiedBy=? WHERE FollowupId = ?`;
  var values = [
    FollowUp.Modified, FollowUp.ModifiedBy, FollowUp.FollowupId
  ]
  con.query(sql, values, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: FollowUp.FollowupId, ...FollowUp });
    return;
  }
  );

};










//Below are for MRO ::
FollowUp.GetMROFollowUpGetContent = (FollowUpBody, result) => {
  var TemplateType = "";
  if (FollowUpBody.IdentityType == 1) {
    TemplateType = "MRO_CUSTOMER_FOLLOW_UP";
  }
  else if (FollowUpBody.IdentityType == 2) {
    TemplateType = "MRO_VENDOR_FOLLOW_UP";
  }
  var sql = `SELECT tc.Email,tv.VendorEmail,mro.MRONo
    ,REPLACE(T.Subject,'{MRONo}',mro.MRONo) as Subject
    ,REPLACE(REPLACE(T.Content,'{Description}',mro.Description),'{MRONo}',mro.MRONo) as Content
    ,GS.AppEmail,GS.AppCCEmail
    
    FROM tbl_mro mro 
    LEFT JOIN tbl_customers tc on tc.CustomerId=mro.CustomerId 
    LEFT JOIN tbl_vendors tv on tv.VendorId=mro.VendorId 
    LEFT JOIN tbl_email_template T on T.TemplateType = '${TemplateType}'
    LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1 
    WHERE mro.MROId=${FollowUpBody.MROId}`;
  //console.log("sql=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      var FollowUpObj = {
        FromEmail: res[0].AppEmail,
        ToEmail: (FollowUpBody.IdentityType == 1) ? res[0].Email : res[0].VendorEmail,
        CC: res[0].AppCCEmail,
        Subject: res[0].Subject,
        Message: res[0].Content
      };
      result(null, FollowUpObj);
      return;
    }
    return result({ msg: "Follow up template not found" }, null);
  });
}
//
FollowUp.ViewMROFollowUp = (MROId) => {
  var sql = ``;
  sql += `SELECT Case when IdentityType=1 then 'Customer' WHEN IdentityType=2 THEN 'Vendor' end as IdentityTypeName,IdentityType,
  FromEmail,ToEmail,CC,Subject,Message,Notes,DATE_FORMAT(Created,'%d/%m/%Y') as Created,FollowupId
  FROM tbl_repair_request_followup where IsDeleted = 0 AND MROId=${MROId}`;
  return sql;

};

module.exports = FollowUp;

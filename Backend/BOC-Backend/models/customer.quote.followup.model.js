/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const CustomerQuoteFollowUp = function (obj) {
  this.TemplateId = obj.TemplateId ? obj.TemplateId : 0;
  this.TemplateType = obj.TemplateType;
  this.Subject = obj.Subject;
  this.Content = obj.Content;
  this.FromEmail = obj.FromEmail;
  this.ToEmail = obj.ToEmail;
  this.CC = obj.CC;
  this.Message = obj.Message;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

//To get the customer quote follow up
CustomerQuoteFollowUp.GetCustomerQuoteFollowUp = (CustomerQuoteFollowUp, result) => {
  var sql = `SELECT tc.Email as ToEmail,rr.RRNo,rr.PartNo  ,REPLACE(T.Subject,'{PartNo}',rr.PartNo) as Subject
    ,REPLACE(T.Content,'{PartNo}',rr.PartNo) as Message,'EmptySelect' as FromEmail,'EmptySelect' as CC ,GS.AppEmail as FromEmail,GS.AppCCEmail as CC
    FROM tbl_repair_request rr 
    LEFT JOIN tbl_customers tc on tc.CustomerId=rr.CustomerId 
    LEFT JOIN tbl_email_template T on T.TemplateType ='CUSTOMER_QUOTE' 
    LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
    WHERE rr.RRId=${CustomerQuoteFollowUp.RRId}`;
  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return result(err, null);
    }
    if (res.length) {
      return result(null, res);
    } else {
      return result({ msg: "Follow up template not found" }, null);
    }
  });
}
module.exports = CustomerQuoteFollowUp;
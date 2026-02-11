/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");

var cDateTime = require("../utils/generic.js");
// const { request } = require("../app.js");
const QuoteModel = require("../models/quotes.model.js");
const SaleOrderModel = require("../models/sales.order.model");
const InvoiceModel = require("../models/invoice.model.js");
const PurchaseOrderModel = require("../models/purchase.order.model.js");
var MailConfig = require('../config/email.config');
var gmailTransport = MailConfig.GmailTransport;
var outlookTransport = MailConfig.OutlookBulkTransport;


const SendEmail = function (objSendEmail) {
  this.from = objSendEmail.from ? objSendEmail.from : Constants.CONST_AH_FROM_EMAIL_ID;
  this.to = objSendEmail.to;
  this.subject = objSendEmail.subject;
  this.text = objSendEmail.text;
  this.attachments = objSendEmail.attachments;
  this.cc = objSendEmail.cc ? objSendEmail.cc : Constants.CONST_AH_CC_EMAIL_ID;
  this.IdentityId = objSendEmail.IdentityId ? objSendEmail.IdentityId : 0;
  this.IdentityType = objSendEmail.IdentityType ? objSendEmail.IdentityType : 0;
}


SendEmail.SendEmailTo = (HelperOptions, result) => {

  var objHelper = new SendEmail(HelperOptions);

  gmailTransport.sendMail(objHelper, (error, info) => {
    if (error) {
      result(error, null);
      return;
    }
    if (!error) {
      var sql = ``;
      if (Constants.CONST_IDENTITY_TYPE_SO == objHelper.IdentityType) {
        sql = SaleOrderModel.UpdateIsEmailSent(objHelper.IdentityId);
      }
      else if (Constants.CONST_IDENTITY_TYPE_PO == objHelper.IdentityType) {
        sql = PurchaseOrderModel.UpdateIsEmailSent(objHelper.IdentityId);
      }
      else if (Constants.CONST_IDENTITY_TYPE_QUOTE == objHelper.IdentityType) {
        sql = QuoteModel.UpdateIsEmailSent(objHelper.IdentityId);
      }
      else if (Constants.CONST_IDENTITY_TYPE_INVOICE == objHelper.IdentityType) {
        sql = InvoiceModel.UpdateIsEmailSent(objHelper.IdentityId);
      }
      con.query(sql, (err, res) => {
        if (err) {
          return result(err, null);
        }
      });
    }
    //console.log(info);
    result(null, objHelper);
    return;
  });
};

SendEmail.SendEmailWithBulkOutlookTest = (HelperOptions, result) => {
  var objHelper = {
    "from" : "repairquotes@ahgroupna.com",
    "to" : "athin.babu@smartpoint.in",
    "subject" : "Test",
    "text" : "thi is test mail!"
  }
  outlookTransport.sendMail(objHelper, (error, info) => {
    if (error) {
      result(error, null);
      return;
    }else{
      result(null, info);
      return;
    }
  });
}

SendEmail.SendEmailToBulk = (HelperOptions, result) => {

  var objHelper = new SendEmail(HelperOptions);

  outlookTransport.sendMail(objHelper, (error, info) => {
    if (error) {
      result(error, null);
      return;
    }
    if (!error) {
      var sql = ``;
      if (Constants.CONST_IDENTITY_TYPE_SO == objHelper.IdentityType) {
        sql = SaleOrderModel.UpdateIsEmailSent(objHelper.IdentityId);
      }
      else if (Constants.CONST_IDENTITY_TYPE_PO == objHelper.IdentityType) {
        sql = PurchaseOrderModel.UpdateIsEmailSent(objHelper.IdentityId);
      }
      else if (Constants.CONST_IDENTITY_TYPE_QUOTE == objHelper.IdentityType) {
        sql = QuoteModel.UpdateIsEmailSent(objHelper.IdentityId);
      }
      else if (Constants.CONST_IDENTITY_TYPE_INVOICE == objHelper.IdentityType) {
        sql = InvoiceModel.UpdateIsEmailSent(objHelper.IdentityId);
      }
      con.query(sql, (err, res) => {
        if (err) {
          return result(err, null);
        }
      });
    }
    //console.log(info);
    result(null, objHelper);
    return;
  });
};

SendEmail.SendInventoryEmail = (RFIDTagNo, result) => {


  var sql = `SELECT REPLACE(T.Subject,'{DisplayRFID}',i.DisplayRFID) as Subject,
    REPLACE(REPLACE(T.Content,'{PartNo}',p.PartNo),'{DisplayRFID}',i.DisplayRFID) as Content,sg.InventoryNotificationEmail as Email
    from tbl_inventory i
    LEFT JOIN tbl_parts p on p.PartId=i.PartId
    LEFT JOIN tbl_settings_general sg on 1=1
    LEFT JOIN tbl_email_template T on T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_INVENTORY_STOCKOUT_NOTIFICATION}' 
    where i.RFIDTagNo='${RFIDTagNo}' `;

  //console.log("val " + sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.length > 0 && res[0].Email != "" && res[0].Email != null) {
      var EmailArray = res[0].Email.split(',');
      for (let Id of EmailArray) {
        let EMailobj = {
          from: Constants.CONST_AH_FROM_EMAIL_ID,
          to: Id,
          subject: res[0].Subject,
          text: res[0].Content
        };
        if (Id) {
          gmailTransport.sendMail(EMailobj, (error, info) => {
            if (error) {
              console.log(error);
              // result(err, null);
            }
          });
        }
      }
    }
  });
  return result(null, RFIDTagNo);
};
//
SendEmail.SendRevertEmail = (HelperOptions, result) => {

  var objHelper = new SendEmail(HelperOptions);
  //console.log("objHelper==" + objHelper.from)
  gmailTransport.sendMail(objHelper, (error, info) => {
    if (error) {
      return result(error, null);
    }
    return result(null, objHelper);
  });
};
module.exports = SendEmail;
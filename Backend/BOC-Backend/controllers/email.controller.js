/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const QuotesModel = require("../models/quotes.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const Constants = require("../config/constants.js");
const SaleOrderModel = require("../models/sales.order.model");
const InvoiceModel = require("../models/invoice.model.js");
const PurchaseOrderModel = require("../models/purchase.order.model.js");
const SendEmailModel = require("../models/send.email.model.js");
//To Get Email Content
exports.GetEmailContent = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('IdentityId') && req.body.hasOwnProperty('IdentityType')) {
      console.log(req.body);
      if (req.body.IdentityType != '') {
        if (Constants.CONST_IDENTITY_TYPE_SO == req.body.IdentityType) {
          SaleOrderModel.GetSalesOrderQuoteForSendEmailContent(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
          });
        }
        else if (Constants.CONST_IDENTITY_TYPE_QUOTE == req.body.IdentityType) {
          if(req.body.IdentityId == 0){
            QuotesModel.GetEmailContentForQuoteWithoutQuoteId(req.body, (err, data) => {
              Reqresponse.printResponse(res, err, data);
            });
          }else{
            QuotesModel.GetEmailContentForQuote(req.body, (err, data) => {
              Reqresponse.printResponse(res, err, data);
            });
          }
          
        }
        else if (Constants.CONST_IDENTITY_TYPE_INVOICE == req.body.IdentityType) {
          InvoiceModel.GetEmailContentForInvoice(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
          });
        }
        else if (Constants.CONST_IDENTITY_TYPE_PO == req.body.IdentityType) {
          PurchaseOrderModel.GetEmailContentForPO(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
          });
        }
      }
    }
    else {
      Reqresponse.printResponse(res, { msg: "IdentityId or IdentityType is required" }, null);
    }
  }
};
//To Send Email
exports.SendEmail = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    SendEmailModel.SendEmailTo(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
exports.SendEmailWithBulkOutlookTest = (req, res) => {
  SendEmailModel.SendEmailWithBulkOutlookTest (req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.SendEmailWithBulkOutlook = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    SendEmailModel.SendEmailToBulk(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};










//Below are for MRO Section :
exports.GetMROEmailContent = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('IdentityId') && req.body.hasOwnProperty('IdentityType')) {
      if (req.body.IdentityId != '' && req.body.IdentityType != '') {
        if (Constants.CONST_IDENTITY_TYPE_SO == req.body.IdentityType) {
          SaleOrderModel.GetMROSalesOrderQuoteForSendEmailContent(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
          });
        }
        else if (Constants.CONST_IDENTITY_TYPE_QUOTE == req.body.IdentityType) {
          QuotesModel.GetMROEmailContentForQuote(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
          });
        }
        else if (Constants.CONST_IDENTITY_TYPE_INVOICE == req.body.IdentityType) {
          InvoiceModel.GetEmailContentForInvoice(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
          });
        }
        else if (Constants.CONST_IDENTITY_TYPE_PO == req.body.IdentityType) {
          PurchaseOrderModel.GetEmailContentForPO(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
          });
        }
      }
    }
    else {
      Reqresponse.printResponse(res, { msg: "IdentityId or IdentityType is required" }, null);
    }
  }
};
//
exports.MROSendEmail = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    SendEmailModel.SendEmailTo(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};




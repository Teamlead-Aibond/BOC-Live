/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RequestForQuoteModel = require("../models/request.for.quote.model.js");
const ReqRes = require("../helper/request.response.validation.js");
var MailConfig = require('../config/email.config');
var GmailTransportStore = MailConfig.GmailTransportStore;
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
var hbs = require('nodemailer-express-handlebars');
var path = require('path');
var fs = require('fs');
var handlebars = require('handlebars');
const con = require("../helper/db.js");

// Retrive all RequestForQuote 
exports.getAll = (req, res) => {
    RequestForQuoteModel.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.RequestForQuoteListByServerSide = (req, res) => {
    RequestForQuoteModel.RequestForQuoteListByServerSide(new RequestForQuoteModel(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

//To create a RequestForQuote
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        RequestForQuoteModel.create(new RequestForQuoteModel(req.body), (err, data) => {

            RequestForQuoteModel.GetCustomerCompanyFromCustomerId(data.CustomerId, (err, data1) => {
                let quotes = data;
                if (data1.length > 0) {
                    quotes['CompanyName'] = data1[0]['CompanyName']
                } else {
                    quotes['CompanyName'] = '-'
                }
                const filePath = path.join(__dirname, '../views/email/RequestForQuote.html');
                const source = fs.readFileSync(filePath, 'utf-8').toString();
                const template = handlebars.compile(source);
                const htmlToSend = template(quotes);
                // get email id
                var sql = `SELECT RequestForQuoteEmail
                FROM tbl_settings_general where IsDeleted = 0`;
                con.query(sql, (err, res) => {
                    if (err) {
                        result(err, null);
                    }

                    var message = {
                        from: Constants.CONST_AH_FROM_EMAIL_ID,
                        to: res[0].RequestForQuoteEmail,
                        subject: 'Request For Quote - AH Group Store',
                        text: ' ',
                        html: htmlToSend
                    };

                    GmailTransportStore.sendMail(message, (error, info) => {
                        if (error) {
                            result({ msg: "error sending email" }, null);
                        }
                    })
                })
                ReqRes.printResponse(res, err, data);
            })
        });
    }
};

// //To view a RequestForQuote
exports.findOne = (req, res) => {
    if (req.body.hasOwnProperty('RequestQuoteId')) {
        RequestForQuoteModel.findById(req.body.RequestQuoteId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Quote Id is required" }, null);
    }
};

//To update a RequestForQuote
exports.update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        RequestForQuoteModel.update(new RequestForQuoteModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To update admin comments and status
exports.EditRequest = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        RequestForQuoteModel.EditRequest(new RequestForQuoteModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To delete  a RequestForQuote
exports.delete = (req, res) => {
    if (req.body.hasOwnProperty('RequestQuoteId')) {
        RequestForQuoteModel.remove(req.body.RequestQuoteId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Quote Id is required" }, null);
    }
};

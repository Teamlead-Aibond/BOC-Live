/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CustomerBlanketPOTopUpModel = require("../models/customer.blanket.po.topup.model.js");
const CustomerBlanketPOModel = require("../models/customer.blanket.po.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
var async = require('async');



exports.Create = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        async.parallel([
            function (result) { CustomerBlanketPOTopUpModel.Create(new CustomerBlanketPOTopUpModel(req.body), result); },
            function (result) { CustomerBlanketPOModel.UpdateAmounts(req.body.TopUpAmount, req.body.CustomerBlanketPOId, result); },
        ],
            function (err, results) {
                if (err)
                    Reqresponse.printResponse(res, err, null);
                else
                    Reqresponse.printResponse(res, null, results[0]);
                return;
            });
    }
};

exports.View = (req, res) => {
    if (req.body.hasOwnProperty('CustomerBlanketPOTopUpId')) {
        CustomerBlanketPOTopUpModel.View(req.body.CustomerBlanketPOTopUpId, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "CustomerBlanketPOTopUp Id is required" }, null);
    }
};

exports.ListTopUpByPO = (req, res) => {
    if (req.body.hasOwnProperty('CustomerBlanketPOId')) {
        CustomerBlanketPOTopUpModel.ListTopUpByPO(req.body.CustomerBlanketPOId, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "CustomerBlanketPOId Id is required" }, null);
    }
};


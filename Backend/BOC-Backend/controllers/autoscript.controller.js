/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const AutoScriptModel = require("../models/autoscript.models");
var XLSX = require('xlsx')
const Reqresponse = require("../helper/request.response.validation.js");
results = [];

exports.UpdateMissingInvPO = (req, res) => {
    AutoScriptModel.UpdateMissingInvPOQuery(req.body, (err, data) => {
        var resultlist = data;
        for (const val of resultlist) {
            if (val.InvoiceId > 0) {
                AutoScriptModel.UpdateMissingInvPO(val, (err, data) => {
                    if (err)
                        console.log(err)
                });
            }
        }
        Reqresponse.printResponse(res, null, data);
    });
};

exports.UpdateMissingPOInSO = (req, res) => {
    AutoScriptModel.UpdateMissingPOInSOQuery(req.body, (err, data) => {
        var resultlist = data;
        for (const val of resultlist) {
            if (val.SOId > 0) {
                AutoScriptModel.UpdateMissingPOInSO(val, (err, data) => {
                    if (err)
                        console.log(err)
                });
            }
        }
        Reqresponse.printResponse(res, null, data);
    });
};

exports.UpdateMissingPOInRR = (req, res) => {
    AutoScriptModel.UpdateMissingPOInRRQuery(req.body, (err, data) => {
        var resultlist = data;
        for (const val of resultlist) {
            if (val.RRId > 0) {
                AutoScriptModel.UpdateMissingPOInRR(val, (err, data) => {
                    if (err)
                        console.log(err)
                });
            }
        }
        Reqresponse.printResponse(res, null, data);
    });
};

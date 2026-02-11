
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */const RRBatch = require("../models/rr.batch.module.js");
const ReqRes = require("../helper/request.response.validation.js");
const Constants = require("../config/constants.js");
const Reqresponse = require("../helper/request.response.validation.js");
var async = require('async');

exports.RRBatchListByServerSide = (req, res) => {
    RRBatch.ListByServerSide(new RRBatch(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.Create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        RRBatch.Create(new RRBatch(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });

    }
};
exports.getRRForLoopQR = (req, res) => {
    if (req.body.hasOwnProperty('RRId')) {
        RRBatch.getRRForLoopQR(req.body, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "RR Id is required" }, null);
    }
};

















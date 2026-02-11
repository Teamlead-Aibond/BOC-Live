/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Term = require("../models/terms.model.js");
const ReqRes = require("../helper/request.response.validation.js");
var async = require('async');
// To Create Term
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        Term.create(new Term(req.body), (err, data) => {
            if (err) {
                ReqRes.printResponse(res, err, null);
            }
            req.body.TermsId = data.id;
            async.parallel([
                function (result) { Term.UpdateIsDefaultTermOne(new Term(req.body), result); },
                function (result) { Term.UpdateIsDefaultTermZero(new Term(req.body), result); },
            ],
                function (err, results) {
                    if (err) { ReqRes.printResponse(res, err, null); }
                });
            ReqRes.printResponse(res, null, data);
        });
    }
    else {
        ReqRes.printResponse(res, { msg: "Request can not be empty" }, null);
    }
};

exports.getAll = (req, res) => {
    Term.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};


exports.findOne = (req, res) => {
    Term.findById(req.body.TermsId, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};
// To update
exports.update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        async.parallel([
            function (result) { Term.update(new Term(req.body), result); },
            function (result) { Term.UpdateIsDefaultTermOne(new Term(req.body), result); },
            function (result) { Term.UpdateIsDefaultTermZero(new Term(req.body), result); },
        ],
            function (err, results) {
                if (err) { ReqRes.printResponse(res, err, null); }
            });
        ReqRes.printResponse(res, null, { data: req.body });
    }
    else {
        ReqRes.printResponse(res, { msg: "Request can not be empty" }, null);
    }
};

exports.delete = (req, res) => {
    Term.remove(req.body.TermsId, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

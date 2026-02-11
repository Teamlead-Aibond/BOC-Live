/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const AutoScriptFindIssuesModel = require("../models/autoscript.find.fix.issues.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

// For RR
exports.RRBlanketPOMismatchList = (req, res) => {
    AutoScriptFindIssuesModel.RRBlanketPOMismatchList(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.RRBlanketPOMismatchFix = (req, res) => {
    AutoScriptFindIssuesModel.RRBlanketPOMismatchList(req.body, (_err, data) => {
        var resultlist = data;
        for (var i = 0; i < resultlist.length; i++) {
            var val = resultlist[i];
            console.log(val);
            if (val.BlanketPOHistoryId > 0 && val.InvoiceId > 0) {
                // val.BlanketPONetAmount = val.BlanketPONetAmount > 0 ? val.BlanketPONetAmount : val.GrandTotal;
                AutoScriptFindIssuesModel.FixRRBlanketPOIssue(val, (_err, _data) => {

                });
            }
        }
        Reqresponse.printResponse(res, null, data);
    });
};

// For QT
exports.QTBlanketPOMismatchList = (req, res) => {
    AutoScriptFindIssuesModel.QTBlanketPOMismatchList(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.QTBlanketPOMismatchFix = (req, res) => {
    AutoScriptFindIssuesModel.QTBlanketPOMismatchList(req.body, (_err, data) => {
        var resultlist = data;
        for (var i = 0; i < resultlist.length; i++) {
            var val = resultlist[i];
            if (val.BlanketPOHistoryId > 0 && val.InvoiceId > 0) {
                // val.BlanketPONetAmount = val.GrandTotal;
                AutoScriptFindIssuesModel.FixRRBlanketPOIssue(val, (_err, _data) => {

                });
            }
        }
        Reqresponse.printResponse(res, null, data);
    });
};

exports.MRONonInvocieFix = (req, res) => {
    AutoScriptFindIssuesModel.MRONonInvocieFix(req.body, (_err, data) => {
        var resultlist = data;
        for (var i = 0; i < resultlist.length; i++) {
            var val = resultlist[i];
            if (val.BlanketPOHistoryId > 0) {
                // val.BlanketPONetAmount = val.GrandTotal;
                AutoScriptFindIssuesModel.FixRRBlanketPOIssue(val, (_err, _data) => {

                });
            }
        }
        Reqresponse.printResponse(res, null, data);
    });
};


// For MRO
exports.MROBlanketPOMismatchList = (req, res) => {
    AutoScriptFindIssuesModel.MROBlanketPOMismatchList(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
exports.MROBlanketPOMismatchPendingList = (req, res) => {
    AutoScriptFindIssuesModel.MROBlanketPOMismatchPendingList(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.MROBlanketPOMismatchFix = (req, res) => {
    var amt = 0;
    AutoScriptFindIssuesModel.MROBlanketPOMismatchList(req.body, (_err, data) => {
        var resultlist = data;
        for (var i = 0; i < resultlist.length; i++) {
            var val = resultlist[i];
            if (val.BlanketPOHistoryId > 0 && val.InvoiceId > 0) {
                // AutoScriptFindIssuesModel.getSOandINVCount(val.SOId, val.MROId, (_getErr, getData) => {
                //     // console.log(getData.SOItem.length);
                //     // console.log(getData.INVItem.length);
                //     // console.log(getData.INVItem);
                //     if (getData.SOItem.length === getData.INVItem.length) {
                //         console.log(val);
                //         amt = this.arrSum(getData.INVItem)
                //         val.BlanketPONetAmount = amt;
                //         console.log(val);
                //         // AutoScriptFindIssuesModel.FixMROBlanketPOIssue(val, (err, data) => {

                //         // });
                //     }
                // });
                // AutoScriptFindIssuesModel.FixMROBlanketPOIssue(val, (err, data) => {

                //         // });
            }
        }
        Reqresponse.printResponse(res, null, data);
    });
};

exports.arrSum = (arr) => {
    var sum = 0;
    // iterate array using forEach, better to use for loop since it have higher performance
    arr.forEach(function (v) {
        // checking array element is an array
        sum += v.Price
    })
    // returning the result
    return sum;
}

// For RR using SO
exports.RRBlanketPOMismatchListBySO = (req, res) => {
    AutoScriptFindIssuesModel.RRBlanketPOMismatchListBySO(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.RRBlanketPOMismatchFixBySO = (req, res) => {
    AutoScriptFindIssuesModel.RRBlanketPOMismatchListBySO(req.body, (_err, data) => {
        var resultlist = data;
        for (var i = 0; i < resultlist.length; i++) {
            var val = resultlist[i];
            console.log(val);
            if (val.BlanketPOHistoryId > 0 && val.SOId > 0) {
                AutoScriptFindIssuesModel.FixRRBlanketPOIssue(val, (_err, _data) => {

                });
            }
        }
        Reqresponse.printResponse(res, null, data);
    });
};

// For QT using SO
exports.QTBlanketPOMismatchListBySo = (req, res) => {
    AutoScriptFindIssuesModel.QTBlanketPOMismatchListBySO(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.QTBlanketPOMismatchFixBySo = (req, res) => {
    AutoScriptFindIssuesModel.QTBlanketPOMismatchListBySO(req.body, (_err, data) => {
        var resultlist = data;
        for (var i = 0; i < resultlist.length; i++) {
            var val = resultlist[i];
            console.log(val);
            if (val.BlanketPOHistoryId > 0 && val.SOId > 0) {
                AutoScriptFindIssuesModel.FixRRBlanketPOIssue(val, (_err, _data) => {

                });
            }
        }
        Reqresponse.printResponse(res, null, data);
    });
};

// For MRO using SO
exports.MROBlanketPOMismatchListBySo = (req, res) => {
    AutoScriptFindIssuesModel.MROBlanketPOMismatchListBySO(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.MROBlanketPOMismatchFixBySo = (req, res) => {
    AutoScriptFindIssuesModel.MROBlanketPOMismatchListBySO(req.body, (_err, data) => {
        var resultlist = data;
        for (var i = 0; i < resultlist.length; i++) {
            var val = resultlist[i];
            console.log(val);
            if (val.BlanketPOHistoryId > 0 && val.SOId > 0) {
                AutoScriptFindIssuesModel.FixRRBlanketPOIssue(val, (_err, _data) => {

                });
            }
        }
        Reqresponse.printResponse(res, null, data);
    });
};

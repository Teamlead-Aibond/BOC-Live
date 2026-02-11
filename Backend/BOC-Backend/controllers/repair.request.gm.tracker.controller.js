/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RepairRequestGmTrackerModel = require("../models/repair.request.gm.tracker.model.js");
const ReqRes = require("../helper/request.response.validation.js");

//To create a Repair Request GM Tracker
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        RepairRequestGmTrackerModel.checkRRIdExistsSql(req.body.RRId, (err, data1) => {
            if (data1 && data1.length > 0) {
                ReqRes.printResponse(res, { msg: " " + req.body.RRId + ' is already exist' }, null);
            }
            else {
                RepairRequestGmTrackerModel.create(new RepairRequestGmTrackerModel(req.body), (err, data) => {
                    ReqRes.printResponse(res, err, data);
                });
    
            }
        });
    }
};

//To update the Repair Request GM Tracker
exports.update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        RepairRequestGmTrackerModel.update(new RepairRequestGmTrackerModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

// //To view a Repair Request GM Tracker
exports.findById = (req, res) => {
    if (req.body.hasOwnProperty('RRGMTrackerId')) {
        RepairRequestGmTrackerModel.findById(req.body.RRGMTrackerId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "RRGMTracker Id is required" }, null);
    }
};

//To delete a Repair Request GM Tracker
exports.delete = (req, res) => {
    if (req.body.hasOwnProperty('RRGMTrackerId')) {
        RepairRequestGmTrackerModel.delete(req.body.RRGMTrackerId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "RRGMTracker Id is required" }, null);
    }
};
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RRPartLocationModel = require("../models/repair.request.part.location.model.js");
const ReqRes = require("../helper/request.response.validation.js");

// Retrive all part location
exports.getAll = (req, res) => {
    RRPartLocationModel.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.dropdown = (req, res) => {
    RRPartLocationModel.dropdown((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

//To create a part location
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        RRPartLocationModel.create(new RRPartLocationModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To view a part location
exports.findOne = (req, res) => {
    if (req.body.hasOwnProperty('RRPartLocationId')) {
        RRPartLocationModel.findById(req.body.RRPartLocationId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "RR Part Location Id is required" }, null);
    }
};

//To update  a part location
exports.update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        RRPartLocationModel.update(new RRPartLocationModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To delete  a part location
exports.delete = (req, res) => {
    if (req.body.hasOwnProperty('RRPartLocationId')) {
        RRPartLocationModel.remove(req.body.RRPartLocationId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "RR Part Location Id is required" }, null);
    }
};

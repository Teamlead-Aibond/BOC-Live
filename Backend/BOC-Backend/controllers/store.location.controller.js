/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const StoreLocationModel = require("../models/store.location.model.js");
const ReqRes = require("../helper/request.response.validation.js");

// Retrive all store location 
exports.getAll = (req, res) => {
    StoreLocationModel.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.dropdown = (req, res) => {
    StoreLocationModel.dropdown((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

//To create a store location create
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        StoreLocationModel.create(new StoreLocationModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To view a store location
exports.findOne = (req, res) => {
    if (req.body.hasOwnProperty('LocationId')) {
        StoreLocationModel.findById(req.body.LocationId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Location Id is required" }, null);
    }
};

//To update  a store location
exports.update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        StoreLocationModel.update(new StoreLocationModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To delete  a store location
exports.delete = (req, res) => {
    if (req.body.hasOwnProperty('LocationId')) {
        StoreLocationModel.remove(req.body.LocationId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Location Id is required" }, null);
    }
};

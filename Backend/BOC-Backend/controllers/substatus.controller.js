/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const SubStatusModel = require("../models/substatus.model.js");
const ReqRes = require("../helper/request.response.validation.js");

// Retrive all Country 
exports.getAll = (req, res) => {
    SubStatusModel.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.dropdown = (req, res) => {
    SubStatusModel.dropdown((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

//To create a country
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        SubStatusModel.create(new SubStatusModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To view a country
exports.findOne = (req, res) => {
    if (req.body.hasOwnProperty('SubStatusId')) {
        SubStatusModel.findById(req.body.SubStatusId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Sub Status Id is required" }, null);
    }
};

//To update  a country
exports.update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        SubStatusModel.update(new SubStatusModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To delete  a country
exports.delete = (req, res) => {
    if (req.body.hasOwnProperty('SubStatusId')) {
        SubStatusModel.remove(req.body.SubStatusId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Sub Status Id is required" }, null);
    }
};

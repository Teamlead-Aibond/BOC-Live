/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CurrencyModel = require("../models/curriencies.model.js");
const ReqRes = require("../helper/request.response.validation.js");

// Retrive all Country 
exports.getAll = (req, res) => {
    CurrencyModel.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.dropdown = (req, res) => {
    CurrencyModel.dropdown((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

//To create a country
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        CurrencyModel.create(new CurrencyModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To view a country
exports.findOne = (req, res) => {
    if (req.body.hasOwnProperty('CurrencyId')) {
        CurrencyModel.findById(req.body.CurrencyId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Currency Id is required" }, null);
    }
};

//To update  a country
exports.update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        CurrencyModel.update(new CurrencyModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To delete  a country
exports.delete = (req, res) => {
    if (req.body.hasOwnProperty('CurrencyId')) {
        CurrencyModel.remove(req.body.CurrencyId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Currency Id is required" }, null);
    }
};

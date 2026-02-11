
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CurrencyExchangeRateModel = require("../models/currency.exchange.rate.model.js");
const ReqRes = require("../helper/request.response.validation.js");

// Retrive all Country 
exports.getAll = (req, res) => {
    CurrencyExchangeRateModel.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.dropdown = (req, res) => {
    CurrencyExchangeRateModel.dropdown((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

//To create a country
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        var Obj = new CurrencyExchangeRateModel(req.body);
        CurrencyExchangeRateModel.checkExists(Obj, (err1, data1) => {
            if (data1 && data1.length > 0) {
                var errMsg = "Currency Exchange Rate Date Range ( " + Obj.FromDate + " - " + Obj.ToDate + " ) already exists!";
                ReqRes.printResponse(res, errMsg, null);
            } else {
                CurrencyExchangeRateModel.create(new CurrencyExchangeRateModel(req.body), (err, data) => {
                    ReqRes.printResponse(res, err, data);
                });
            }
        });
    }
};

//To view a country
exports.findOne = (req, res) => {
    if (req.body.hasOwnProperty('CurrencyRateId')) {
        CurrencyExchangeRateModel.findById(req.body.CurrencyRateId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Currency Rate Id is required" }, null);
    }
};

//To update  a country
exports.update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        var Obj = new CurrencyExchangeRateModel(req.body);
        CurrencyExchangeRateModel.checkExists(Obj, (err1, data1) => {
            if (data1 && data1.length > 0) {
                var errMsg = "Currency Exchange Rate Date Range ( " + Obj.FromDate + " - " + Obj.ToDate + " ) already exists!";
                ReqRes.printResponse(res, errMsg, null);
            } else {
                CurrencyExchangeRateModel.update(new CurrencyExchangeRateModel(req.body), (err, data) => {
                    ReqRes.printResponse(res, err, data);
                });
            }
        })
    }
};

//To delete  a country
exports.delete = (req, res) => {
    if (req.body.hasOwnProperty('CurrencyRateId')) {
        CurrencyExchangeRateModel.remove(req.body.CurrencyRateId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Currency Rate Id is required" }, null);
    }
};

exports.exchange = (req, res) => {
    if (req.body.hasOwnProperty('LocalCurrencyCode') && req.body.hasOwnProperty('BaseCurrencyCode')) {
        CurrencyExchangeRateModel.exchange(req.body, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Currency code's is required" }, null);
    }
};

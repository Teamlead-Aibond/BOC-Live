/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const MaryGoldModel = require("../models/mary.mockup.model.js");
const ReqRes = require("../helper/request.response.validation.js");

exports.CategoryStatistics = (req, res) => {
    MaryGoldModel.CategoryStatistics(req.body, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};
exports.SubCategoryStatistics = (req, res) => {
    if (req.body.hasOwnProperty('CategoryId')) {
        MaryGoldModel.SubCategoryStatistics(req.body, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Category Id is required" }, null);
    }
};


exports.CategoryList = (req, res) => {
    MaryGoldModel.CategoryList((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};
exports.SubCategoryList = (req, res) => {
    MaryGoldModel.SubCategoryList((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};
exports.CustomerList = (req, res) => {
    MaryGoldModel.CustomerList((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};
exports.ExpenseList = (req, res) => {
    MaryGoldModel.ExpenseList((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};
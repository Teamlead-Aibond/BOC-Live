/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const PartCategoryModel = require("../models/part.category.model.js");
const ReqRes = require("../helper/request.response.validation.js");

// Retrive all RequestForQuote 
exports.getAll = (req, res) => {
    PartCategoryModel.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

//To create a RequestForQuote
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        PartCategoryModel.create(new PartCategoryModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

// //To view a RequestForQuote
exports.findOne = (req, res) => {
    if (req.body.hasOwnProperty('PartCategoryId')) {
        PartCategoryModel.findById(req.body.PartCategoryId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "PartCategory Id is required" }, null);
    }
};

//To update  a RequestForQuote
exports.update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        PartCategoryModel.update(new PartCategoryModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To delete  a RequestForQuote
exports.delete = (req, res) => {
    if (req.body.hasOwnProperty('PartCategoryId')) {
        PartCategoryModel.remove(req.body.PartCategoryId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "PartCategory Id is required" }, null);
    }
};

// part category dropdown
exports.PartCategoryDropdown = (req, res) => {
    PartCategoryModel.PartCategoryDropdown(req.body, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
  };

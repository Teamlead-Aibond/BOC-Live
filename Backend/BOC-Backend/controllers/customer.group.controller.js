
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CustomerGroupModel = require("../models/customer.group.model.js");
const ReqRes = require("../helper/request.response.validation.js");

// Retrive all customer group 
exports.getAll = (req, res) => {
    CustomerGroupModel.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.dropdown = (req, res) => {
    CustomerGroupModel.dropdown((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

//To create a customer group create
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        CustomerGroupModel.create(new CustomerGroupModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To view a customer group
exports.findOne = (req, res) => {
    if (req.body.hasOwnProperty('CustomerGroupId')) {
        CustomerGroupModel.findById(req.body.CustomerGroupId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Customer Group Id is required" }, null);
    }
};

//To update  a customer group
exports.update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        CustomerGroupModel.update(new CustomerGroupModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To delete  a customer group
exports.delete = (req, res) => {
    if (req.body.hasOwnProperty('CustomerGroupId')) {
        CustomerGroupModel.remove(req.body.CustomerGroupId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Customer Group Id is required" }, null);
    }
};

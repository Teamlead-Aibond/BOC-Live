/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CustomerBlanketPOModel = require("../models/customer.blanket.po.model.js");
const ReqRes = require("../helper/request.response.validation.js");
const RR = require("../models/repair.request.model.js");
const Invoice = require("../models/invoice.model.js");
const SalesOrder = require("../models/sales.order.model.js");
var async = require('async');
const con = require("../helper/db.js");

exports.List = (req, res) => {
    CustomerBlanketPOModel.List(new CustomerBlanketPOModel(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};
exports.Report1List = (req, res) => {
    CustomerBlanketPOModel.Report1List(new CustomerBlanketPOModel(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.BlanketPOExludedPartList = (req, res) => {
    CustomerBlanketPOModel.BlanketPOExludedPartList(new CustomerBlanketPOModel(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.BlanketPOListByCustomerId = (req, res) => {

    if (req.body.hasOwnProperty('CustomerId')) {
        CustomerBlanketPOModel.BlanketPOListByCustomerId(req.body.CustomerId, req.body, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Customer Id is required" }, null);
    }
};

exports.Create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        CustomerBlanketPOModel.IsExistCustomerPONo(0, req.body.CustomerPONo, (err, data) => {
            if (data.length <= 0) {
                CustomerBlanketPOModel.Create(new CustomerBlanketPOModel(req.body), (err, data) => {
                    ReqRes.printResponse(res, err, data);
                });
            }
            else {
                ReqRes.printResponse(res, { msg: "CustomerPONo is Already Exist" }, null);
            }
        });
    }
};

exports.Delete = (req, res) => {
    if (req.body.hasOwnProperty('CustomerBlanketPOId')) {
        async.parallel([
            function (result) { RR.IsUsedCustomerBlanketPOId(req.body.CustomerBlanketPOId, result) },
            function (result) { Invoice.IsUsedCustomerBlanketPOId(req.body.CustomerBlanketPOId, result) },
            function (result) { SalesOrder.IsUsedCustomerBlanketPOId(req.body.CustomerBlanketPOId, result) },
        ],
            function (err, results) {
                if (err) { return result(err, null); }
                else {
                    if (results[0].length <= 0 && results[1].length <= 0 && results[2].length <= 0) {
                        CustomerBlanketPOModel.Delete(req.body.CustomerBlanketPOId, (err, data) => {
                            ReqRes.printResponse(res, err, data);
                        });
                    }
                    else {
                        ReqRes.printResponse(res, { msg: "Can't Delete. Already In Use" }, null);
                    }
                }
            })
    } else {
        ReqRes.printResponse(res, { msg: "CustomerBlanketPO Id is required" }, null);
    }
};

exports.View = (req, res) => {
    if (req.body.hasOwnProperty('CustomerBlanketPOId')) {
        CustomerBlanketPOModel.View(req, new CustomerBlanketPOModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "BlanketPO Id is required" }, null);
    }
};


exports.ViewBlanketPOByRRIdAndCustomerBlanketPOId = (req, res) => {
    if (req.body.hasOwnProperty('CustomerBlanketPOId')) {
        CustomerBlanketPOModel.ViewBlanketPOByRRIdAndCustomerBlanketPOId(req.body.CustomerBlanketPOId, req.body.RRId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "BlanketPO Id is required" }, null);
    }
};

exports.Update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        CustomerBlanketPOModel.IsExistCustomerPONo(req.body.CustomerBlanketPOId, req.body.CustomerPONo, (err, data) => {
            if (data.length <= 0) {
                CustomerBlanketPOModel.Update(new CustomerBlanketPOModel(req.body), (err, data) => {
                    ReqRes.printResponse(res, err, data);
                });
            }
            else {
                ReqRes.printResponse(res, { msg: "CustomerPONo is Already Exist" }, null);
            }
        });
    }
};

exports.Update2 = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        CustomerBlanketPOModel.IsExistCustomerPONo(req.body.CustomerBlanketPOId, req.body.CustomerPONo, (err, data) => {
            if (data.length <= 0) {
                CustomerBlanketPOModel.Update2(new CustomerBlanketPOModel(req.body), (err, data) => {
                    ReqRes.printResponse(res, err, data);
                });
            }
            else {
                ReqRes.printResponse(res, { msg: "CustomerPONo is Already Exist" }, null);
            }
        });
    }
};

exports.Update3 = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        if (req.body.hasOwnProperty('CustomerBlanketPOId')) {
            async.parallel([
                function (result) { CustomerBlanketPOModel.Update3(new CustomerBlanketPOModel(req.body), result) },
            ],
                function (err, results) {
                    if (err) { ReqRes.printResponse(res, err, null); }
                    else {
                        ReqRes.printResponse(res, err, req.body);
                    }
                })
        } else {
            ReqRes.printResponse(res, { msg: "CustomerBlanketPO Id is required" }, null);
        }
    }
};

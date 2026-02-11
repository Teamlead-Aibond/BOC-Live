/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Parts = require("../models/shop.parts.model.js");
const ReqRes = require("../helper/request.response.validation.js");
const Constants = require("../config/constants.js");
const PartImages = require("../models/parts.images.model.js");
const PartItem = require("../models/part.items.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const NotificationModel = require("../models/notification.model.js");
const InventoryModel = require("../models/inventory.model.js");
var async = require('async');
var cDateTime = require("../utils/generic.js");
var XLSX = require('xlsx')
results = [];
var path = require('path');
const ShopPartItem = require("../models/shop.part.items.model");

exports.PartsListByServerSide = (req, res) => {
    Parts.PartsListByServerSide(new Parts(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.addPart = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        Parts.addPart(req, new Parts(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });

    }
};

exports.addPartItem = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        ShopPartItem.addPartItem(req.body, (err, data) => {

            Reqresponse.printResponse(res, err, data);

        });

    }
};

exports.updatePart = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        async.parallel([
            function (result) { Parts.updatePart(req.body, result) },
            function (result) { if (req.body.hasOwnProperty('ImagesList')) { PartImages.UpdatePartImages(req.body, result); } else { Parts.emptyFunction({}, result); } },

        ],
            function (err, results) {
                if (err)
                    Reqresponse.printResponse(res, err, null);
                else
                    Reqresponse.printResponse(res, err, { data: req.body.PartId });
            }
        );

    }
};

exports.viewPart = (req, res) => {
    Parts.viewPart(req.body.PartId, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.deletePart = (req, res) => {
    if (req.body.hasOwnProperty('PartId')) {
        Parts.deletePart(req.body.PartId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Part Id is required" }, null);
    }
};

exports.deletePartItem = (req, res) => {
    if (req.body.hasOwnProperty('PartId') && req.body.hasOwnProperty('ShopPartItemId')) {
        Parts.deletePartItem(req.body.PartId, req.body.ShopPartItemId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Part/ShopPartItem Id is required" }, null);
    }
};
exports.updateQuantity = (req, res) => {
    if (req.body.hasOwnProperty('PartId') && req.body.hasOwnProperty('ShopPartItemId')) {
        Parts.updateQuantity(req.body, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Part/ShopPartItem Id is required" }, null);
    }
};
exports.reduceQuantity = (req, res) => {
    if (req.body.hasOwnProperty('PartId') && req.body.hasOwnProperty('ShopPartItemId')) {
        Parts.reduceQuantity(req.body, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Part/ShopPartItem Id is required" }, null);
    }
};

exports.stockLogs = (req, res) => {
    if (req.body.hasOwnProperty('ShopPartItemId')) {
        Parts.stockLogs(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "ShopPartItem Id is required" }, null);
    }
};
exports.shopDashboard = (req, res) => {
    Parts.shopDashboard(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};



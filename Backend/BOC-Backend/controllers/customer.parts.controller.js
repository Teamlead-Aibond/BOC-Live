/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CustomerPartsModel = require("../models/customer.parts.model.js");
const PartsModel = require("../models/parts.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

//To get all the customer parts
exports.getAll = (req, res) => {
    if (req.body.hasOwnProperty('CustomerId')) {
        CustomerPartsModel.getAll(req.body.CustomerId, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Customer Id is required" }, null);
    }
};

//To add a new parts to parts and customer  parts
exports.addNewPart = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        PartsModel.addNewPart(req.body, (err, data) => {
            req.body.PartId = data.id;
            exports.create(req, res);
        });
    }
};

//To create a new customer parts
exports.create = (req, res) => {
    // var boolean = Reqresponse.validateReqBody(req, res);
    // if (boolean) {
    CustomerPartsModel.create(req.body, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
    // }
};

//To delete a customer part
exports.delete = (req, res) => {
    if (req.body.hasOwnProperty('CustomerPartId')) {
        CustomerPartsModel.delete(req.body.CustomerPartId, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Customer Part Id is required" }, null);
    }
};

//To update a customer parts list
exports.updateList = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        CustomerPartsModel.updateList(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};

//To update a customer part
exports.update = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        CustomerPartsModel.update(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};

//To get a customer parts info
exports.GetPartsInfo = (req, res) => {
    if (req.body.hasOwnProperty('CustomerPartId')) {
        CustomerPartsModel.GetPartsInfo(req.body.CustomerPartId, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Customer Part Id is required" }, null);
    }
};

//To get a customer parts info with customer profile
exports.GetCustomerInfo = (req, res) => {
    if (req.body.hasOwnProperty('CustomerId')) {
        CustomerPartsModel.GetCustomerInfo(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Customer Id is required" }, null);
    }
};

//To get the customer parts server side listing 
exports.CustomerPartsListByServerSide = (req, res) => {
    if (req.body.hasOwnProperty('CustomerId')) {
        CustomerPartsModel.CustomerPartsListByServerSide(new CustomerPartsModel(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Customer Id is required" }, null);
    }
};



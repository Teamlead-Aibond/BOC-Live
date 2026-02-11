/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const EdiModel = require("../models/edi.model.js");
const ReqRes = require("../helper/request.response.validation.js");

// Retrive all EDI 
exports.getList = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        EdiModel.getAll(req.body, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To create a EDI
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        EdiModel.create(new EdiModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

//To view a EDI
exports.findOne = (req, res) => {
    if (req.body.hasOwnProperty('InvoiceEdiId')) {
        EdiModel.findById(req.body.InvoiceEdiId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "InvoiceEdi Id is required" }, null);
    }
};

//To update a EDI
exports.update = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        EdiModel.update(new EdiModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

// get Edi status
exports.getStatusList = (req, res) => {
    EdiModel.getStatusList((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

//To delete  a EDI
// exports.delete = (req, res) => {
//     if (req.body.hasOwnProperty('InvoiceEdiId')) {
//         EdiModel.remove(req.body.InvoiceEdiId, (err, data) => {
//             ReqRes.printResponse(res, err, data);
//         });
//     } else {
//         ReqRes.printResponse(res, { msg: "InvoiceEdi Id is required" }, null);
//     }
// };

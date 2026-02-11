/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const TempRFIDModel = require("../models/temp.rfid.model.js");
const ReqRes = require("../helper/request.response.validation.js");

// Retrive all Temp RFID 
exports.getAll = (req, res) => {
    TempRFIDModel.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

//To create Temp RFID's
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        var itemProcessed = 0
        req.body.forEach(element => {
            TempRFIDModel.create(new TempRFIDModel(element), (err, data) => {
                itemProcessed++;
                if(itemProcessed === req.body.length){
                    TempRFIDModel.getAll((err1, data1) => {
                        ReqRes.printResponse(res, err1, data1);
                    })
                }
            });
        });
    }
};

//To delete a Temp RFID
exports.delete = (req, res) => {
    if (req.body.hasOwnProperty('RFIDTagNo')) {
        TempRFIDModel.remove(req.body.RFIDTagNo, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "RFID TagNo is required" }, null);
    }
};

exports.view = (req, res) => {
    if (req.body.hasOwnProperty('RFIDTagNo')) {
        TempRFIDModel.view(req.body.RFIDTagNo, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "RFID TagNo is required" }, null);
    }
};

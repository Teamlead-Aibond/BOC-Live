/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const state = require("../models/state.model.js");
const ReqRes = require("../helper/request.response.validation.js");

// Retrive all state 
exports.getStateByCountryId = (req, res) => {
    //console.log("CountryId = "+req.params.CountryId);
    state.getStateByCountryId(req.params.CountryId, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        state.create(new state(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

exports.getAll = (req, res) => {
    state.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};


exports.findOne = (req, res) => {
    state.findById(req.body.StateId, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};


exports.update = (req, res) => {

    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        state.update(new state(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};

exports.delete = (req, res) => {
    state.remove(req.body.StateId, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.dbupdate = (req, res) => {
    state.dbupdate((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RRFollowUpNotesModel = require("../models/repair.request.followup.notes.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

exports.create = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        RRFollowUpNotesModel.create(new RRFollowUpNotesModel(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};

exports.getAll = (req, res) => {
    RRFollowUpNotesModel.getAll((err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.findOne = (req, res) => {
    RRFollowUpNotesModel.findById(req.body.FollowUpNoteId, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.update = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        RRFollowUpNotesModel.updateById(new RRFollowUpNotesModel(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};

exports.delete = (req, res) => {
    RRFollowUpNotesModel.remove(req.body.FollowUpNoteId, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};


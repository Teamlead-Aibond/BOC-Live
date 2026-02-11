/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RepairRequestNotes = require("../models/repair.request.notes.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

exports.create = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        RepairRequestNotes.create(new RepairRequestNotes(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};

exports.getAll = (req, res) => {
    RepairRequestNotes.getAll((err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.findOne = (req, res) => {
    RepairRequestNotes.findById(req.body.NotesId, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.update = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        RepairRequestNotes.updateById(new RepairRequestNotes(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};
exports.delete = (req, res) => {
    RepairRequestNotes.remove(req.body.NotesId, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

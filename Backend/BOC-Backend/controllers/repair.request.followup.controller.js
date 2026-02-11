/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const FollowUp = require("../models/repair.request.followup.model.js");
const Reqresponse = require("../helper/request.response.validation.js");


exports.GetFollowUpGetContent = (req, res) => {
  FollowUp.GetFollowUpGetContent(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.Create = (req, res) => {
  FollowUp.Create(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.ViewFollowUp = (req, res) => {
  if (req.body.hasOwnProperty('FollowupId')) {
    FollowUp.ViewFollowUp(req.body.FollowupId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Follow id is required" }, null);
  }
};

exports.UpdateNotes = (req, res) => {
  FollowUp.UpdateNotesByFollowUpId(new FollowUp(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.Delete = (req, res) => {
  FollowUp.Delete(new FollowUp(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};








//Below are fotr MRO :
exports.GetMROFollowUpGetContent = (req, res) => {
  FollowUp.GetMROFollowUpGetContent(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.MROCreate = (req, res) => {
  FollowUp.Create(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


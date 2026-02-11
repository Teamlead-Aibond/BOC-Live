/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CommunicationMessagesModel = require("../models/communication.messages.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

//
exports.create = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        CommunicationMessagesModel.create(new CommunicationMessagesModel(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};

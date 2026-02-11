/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RRVendorAttachment = require("../models/repair.request.vendor.attachment.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

exports.Create = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        if (req.body.hasOwnProperty('RRVendorAttachmentList') == true && req.body.RRVendorAttachmentList.length > 0) {
            RRVendorAttachment.Create(req.body, (err, data) => {
                Reqresponse.printResponse(res, err, data);
            });
        } else {
            Reqresponse.printResponse(res, { msg: "No Attachments Found" }, null);
        }
    }
};

exports.Delete = (req, res) => {
    if (req.body.hasOwnProperty('RRVendorAttachmentId')) {
        RRVendorAttachment.Delete(req.body.RRVendorAttachmentId, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "RRVendorAttachment Id is required" }, null);
    }
};






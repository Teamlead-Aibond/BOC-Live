/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const InventoryReportsModel = require("../models/inventory.reports.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

exports.MinMaxReportByPartNumber = (req, res) => {
    InventoryReportsModel.MinMaxReportByPartNumber(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

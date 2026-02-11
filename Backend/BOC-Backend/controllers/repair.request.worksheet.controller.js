/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RepairRequestWorksheetModel = require("../models/repair.request.worksheet.model.js");
const ReqRes = require("../helper/request.response.validation.js");

//To create a Repair Request GM Tracker
exports.getAll = (req, res) => {
    RepairRequestWorksheetModel.getAll((err,data)=>{
        ReqRes.printResponse(res, err,data); 
    });
};
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const ExportToExcelModel=require("../models/export.to.excel.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

//To ExportToExcel
exports.ExportToExcel = (req, res) => {
    ExportToExcelModel.ExportToExcel((err, data) => {
    Reqresponse.printResponse(res, err,data); 
  });
};
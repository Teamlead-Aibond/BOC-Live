/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const WarrantyModel=require("../models/warranty.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

//To get All Warranty
exports.getAll = (req, res) => {
    WarrantyModel.getAll((err, data) => {
    Reqresponse.printResponse(res, err,data); 
  });
};
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Permission=require("../models/permission.model.js");
const ReqRes = require("../helper/request.response.validation.js"); 


exports.GetAllPermission = (req, res) => {
    Permission.GetAllPermission((err, data) => {
        ReqRes.printResponse(res, err,data); 
  });
};


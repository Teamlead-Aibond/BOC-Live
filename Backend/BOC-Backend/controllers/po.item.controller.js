/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const PoItem=require("../models/po.item.model.js");
const ReqRes = require("../helper/request.response.validation.js"); 


exports.GetPODetails = (req, res) => {
    PoItem.GetPODetails(req.body.PoNo,(err, data) => {
        ReqRes.printResponse(res, err,data); 
  });
};



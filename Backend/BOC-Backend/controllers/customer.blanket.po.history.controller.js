/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CustomerBlanketPOHistory = require("../models/customer.blanket.po.history.model.js");
const ReqRes = require("../helper/request.response.validation.js");


exports.List = (req, res) => {

    req.body.BlanketPOId = req.body.CustomerBlanketPOId > 0 ? req.body.CustomerBlanketPOId : 0;
    CustomerBlanketPOHistory.List(new CustomerBlanketPOHistory(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};


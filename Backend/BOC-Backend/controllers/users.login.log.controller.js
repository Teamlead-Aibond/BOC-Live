/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const UserLoginLogModel = require("../models/users.login.log.model.js");
const ReqRes = require("../helper/request.response.validation.js");

// Retrive all Country 
exports.listwithFilter = (req, res) => {
    UserLoginLogModel.listwithFilter(new UserLoginLogModel(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

//To create a country
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        UserLoginLogModel.create(new UserLoginLogModel(req.body), (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    }
};


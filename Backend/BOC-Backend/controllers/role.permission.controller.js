/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RolePermission = require("../models/role.permission.model.js");
const ReqRes = require("../helper/request.response.validation.js");
const Reqresponse = require("../helper/request.response.validation.js");
const { request } = require("express");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType } = require("../helper/common.function.js");
exports.GetRolePermissionByUserId = (req, res) => {
    var UserId = getLogInUserId(req.body);
    //console.log("Test " + UserId);
    RolePermission.GetRolePermissionByUserId(UserId, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.GetRolePermissionByRoleId = (req, res) => {
    if (req.body.hasOwnProperty('RoleId')) {
        RolePermission.GetRolePermissionByRoleId(req.body.RoleId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Role Id is required" }, null);
    }
};


exports.UpdateRolePermission = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        for (let val of req.body.PermissionList) {

            RolePermission.CheckExistPermissonByRoleId(req.body.RoleId, val.PermissionId, (err, data1) => {

                if (data1.length == 0) {
                    RolePermission.create(req.body.RoleId, new RolePermission(val), (err, data) => {

                    });
                }
                else {
                    RolePermission.UpdatePermission(req.body.RoleId, new RolePermission(val), (err, data) => {

                    });

                }

            });
        }
        Reqresponse.printResponse(res, null, req.body);
    }


};

exports.UpsertRolePermission = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        RolePermission.upsert(req.body.RoleId, req.body.PermissionList, (err, data) => {
            Reqresponse.printResponse(res, err, req.body);
        });
    }
};
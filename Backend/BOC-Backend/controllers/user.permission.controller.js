/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const UserPermission = require("../models/user.permission.model.js");
const RolePermission = require("../models/role.permission.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const con = require("../helper/db.js");
//
//To GetUserPermissionByUserId
exports.GetUserPermissionByUserId = (req, res) => {
    if (req.body.hasOwnProperty('UserId') && req.body.UserId > 0) {
        UserPermission.IsExistPermissonForUserId(req.body.UserId, (err, data1) => {

            if (err) Reqresponse.printResponse(res, err, null);
            if (data1.length > 0) {
                var sql = UserPermission.GetUserPermissionByUserId(req.body.UserId);
                con.query(sql, (err, data) => {
                    if (err) Reqresponse.printResponse(res, err, null);
                    Reqresponse.printResponse(res, null, data);
                })
            } else {
                var sql = RolePermission.GetRolePermissionByUserIdQuery(req.body.UserId);
                con.query(sql, (err, data) => {
                    if (err) Reqresponse.printResponse(res, err, null);
                    Reqresponse.printResponse(res, null, data);
                })
            }
        });
    } else {
        Reqresponse.printResponse(res, { msg: "User Id is required" }, null);
    }
};

//UpdateUserPermission
exports.UpdateUserPermission = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        if (req.body.PermissionList.length > 0) {
            for (let val of req.body.PermissionList) {
                UserPermission.CheckExistPermissonByUserId(req.body.UserId, val.PermissionId, (err, data1) => {
                    if (err) Reqresponse.printResponse(res, err, null);

                    if (data1 && data1.length == 0) {
                        UserPermission.Create(req.body.UserId, new UserPermission(val), (err, data) => {
                            if (err) Reqresponse.printResponse(res, err, null);
                        });
                    }
                    else {
                        UserPermission.UpdatePermission(req.body.UserId, new UserPermission(val), (err, data) => {
                            if (err) Reqresponse.printResponse(res, err, null);
                        });
                    }
                });
            }
        }
        Reqresponse.printResponse(res, null, req.body);
    }
};

// To DeletePermission
exports.DeletePermission = (req, res) => {
    if (req.body.hasOwnProperty('UserId')) {
        UserPermission.DeletePermission(req.body.UserId, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "User Id is required" }, null);
    }
};



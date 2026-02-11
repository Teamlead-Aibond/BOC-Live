/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const rolepermission = require("../controllers/role.permission.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
router.post("/GetRolePermissionByUserId", authenticateJWT, rolepermission.GetRolePermissionByUserId);
router.post("/GetRolePermissionByRoleId", authenticateJWT, rolepermission.GetRolePermissionByRoleId);
router.post("/UpdateRolePermission", authenticateJWT, rolepermission.UpdateRolePermission);
// router.post("/UpdateRolePermission", authenticateJWT, rolepermission.UpsertRolePermission);

module.exports = router;
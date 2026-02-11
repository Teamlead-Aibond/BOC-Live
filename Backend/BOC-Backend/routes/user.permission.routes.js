/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const Userpermission = require("../controllers/user.permission.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
router.post("/GetUserPermissionByUserId", authenticateJWT, Userpermission.GetUserPermissionByUserId);
router.post("/UpdateUserPermission", authenticateJWT, Userpermission.UpdateUserPermission);
router.post("/DeletePermission", authenticateJWT, Userpermission.DeletePermission);
module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const UserLoginLogController = require("../controllers/users.login.log.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.post("/listwithFilter", authenticateJWT, UserLoginLogController.listwithFilter);
router.post("/create", authenticateJWT, UserLoginLogController.create);
module.exports = router;


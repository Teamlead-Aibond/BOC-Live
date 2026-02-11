/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const DLL = require("../controllers/dll.controller.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.get("/all", globalauthenticateJWT, DLL.getAll);
module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const Permission = require("../controllers/permission.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  


router.post("/GetAllPermission", authenticateJWT,Permission.GetAllPermission);
module.exports=router;
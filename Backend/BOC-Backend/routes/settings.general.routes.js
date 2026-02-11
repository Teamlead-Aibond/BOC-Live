/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const SettingsGeneral = require("../controllers/settings.general.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  

router.put("/update",authenticateJWT, SettingsGeneral.update);
router.post("/view",authenticateJWT, SettingsGeneral.findById);

router.post("/GetRFIDConfig",authenticateJWT, SettingsGeneral.GetRFIDConfig);
module.exports=router;
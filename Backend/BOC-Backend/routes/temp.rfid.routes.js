/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const TempRFIDController = require("../controllers/temp.rfid.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.get("/list", authenticateJWT, TempRFIDController.getAll);
router.post("/create", authenticateJWT, TempRFIDController.create);
router.post("/delete", authenticateJWT, TempRFIDController.delete);
router.post("/view", authenticateJWT, TempRFIDController.view);
module.exports = router;
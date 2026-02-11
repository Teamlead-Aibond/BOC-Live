/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const AutoScriptController = require('../controllers/autoscript.controller.js');

router.post("/UpdateMissingInvPO", authenticateJWT, AutoScriptController.UpdateMissingInvPO);
router.post("/UpdateMissingPOInSO", authenticateJWT, AutoScriptController.UpdateMissingPOInSO);
router.post("/UpdateMissingPOInRR", authenticateJWT, AutoScriptController.UpdateMissingPOInRR);

module.exports = router;
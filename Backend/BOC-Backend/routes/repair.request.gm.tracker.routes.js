/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RepairRequestGmTrackerController = require("../controllers/repair.request.gm.tracker.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.post("/create", authenticateJWT, RepairRequestGmTrackerController.create);
router.put("/update", authenticateJWT, RepairRequestGmTrackerController.update);
router.post("/view", authenticateJWT, RepairRequestGmTrackerController.findById);
router.post("/delete", authenticateJWT, RepairRequestGmTrackerController.delete);
module.exports = router;
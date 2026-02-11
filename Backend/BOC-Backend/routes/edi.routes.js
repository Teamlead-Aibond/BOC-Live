/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const consolidate = require("../controllers/edi.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/create", authenticateJWT, consolidate.create);
router.post("/update", authenticateJWT, consolidate.update);
router.post("/view", authenticateJWT, consolidate.findOne);
router.post("/list", authenticateJWT, consolidate.getList);
router.get("/status-list", authenticateJWT, consolidate.getStatusList);
module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const InventoryReportsController = require("../controllers/inventory.reports.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js"); 

router.post("/MinMaxReportByPartNumber", authenticateJWT,InventoryReportsController.MinMaxReportByPartNumber);
module.exports = router;//
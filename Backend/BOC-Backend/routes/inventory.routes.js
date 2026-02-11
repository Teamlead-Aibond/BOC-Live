/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const inventory = require("../controllers/inventory.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);

router.post("/getInventoryByServerSide", authenticateJWT, inventory.InventoryListByServerSide);
router.post("/InventoryDashboardStatisticsCount", authenticateJWT, inventory.InventoryDashboardStatisticsCount);
router.post("/RFIDDashboardStatisticsCount", authenticateJWT, inventory.RFIDDashboardStatisticsCount);
router.post("/RFIDDashboardV1Statistics", authenticateJWT, inventory.RFIDDashboardV1Statistics);
router.post("/LatestStockInStockOutList", authenticateJWT, inventory.LatestStockInStockOutList);
router.post("/LineChartDayWise", authenticateJWT, inventory.LineChartDayWise);
router.post("/DashboardSummaryStatisticsCount", authenticateJWT, inventory.DashboardSummaryStatisticsCount);
router.post("/createLossPreventionLog", authenticateJWT, inventory.createLossPreventionLog);
router.post("/PartItemCountByManufacturer", authenticateJWT, inventory.PartItemCountByManufacturer);
router.put("/UpdateInventorySettings", authenticateJWT, inventory.UpdateInventorySettings);
router.post("/AutoCheckout", authenticateJWT, inventory.AutoCheckout);
module.exports = router;
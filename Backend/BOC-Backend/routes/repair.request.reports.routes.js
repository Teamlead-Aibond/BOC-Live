/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRReports = require("../controllers/repair.request.reports.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/getTotalCostSavingsVsCostofNewReport", authenticateJWT, RRReports.getTotalCostSavingsVsCostofNewReport);
router.post("/getTotalCostSavingsVsLastPricePaidReport", authenticateJWT, RRReports.getTotalCostSavingsVsLastPricePaidReport);
router.post("/getOnTimeDeliveryReport", authenticateJWT, RRReports.getOnTimeDeliveryReport);
router.post("/getOpenOrderReport", authenticateJWT, RRReports.getOpenOrderReport);
router.post("/OpenOrderReportExportToExcel", authenticateJWT, RRReports.OpenOrderReportExportToExcel);
router.post("/OnTimeDeliveryReportExportToExcel", authenticateJWT, RRReports.OnTimeDeliveryReportExportToExcel);
router.post("/TotalCostSavingsVsLastPricePaidReportExportToExcel", authenticateJWT, RRReports.TotalCostSavingsVsLastPricePaidReportExportToExcel);
router.post("/TotalCostSavingsVsCostofNewReportExportToExcel", authenticateJWT, RRReports.TotalCostSavingsVsCostofNewReportExportToExcel);
router.post("/ProcessFitnessReport", authenticateJWT, RRReports.getProcessFitnessReport);
router.post("/ProcessFitnessReportExportToExcel", authenticateJWT, RRReports.ProcessFitnessReportExportToExcel);
router.post("/OpenOrderBySupplierReport", authenticateJWT, RRReports.getOpenOrderBySupplierReport);
router.post("/OpenOrderBySupplierReportCount", authenticateJWT, RRReports.getOpenOrderBySupplierReportCount);
router.post("/OpenOrderBySupplierReportExportToExcel", authenticateJWT, RRReports.OpenOrderBySupplierReportExportToExcel);

router.post("/OpenOrderBySupplierWithoutVatReport", authenticateJWT, RRReports.getOpenOrderBySupplierWithoutVatReport);
router.post("/OpenOrderBySupplierWithoutVatReportCount", authenticateJWT, RRReports.getOpenOrderBySupplierWithoutVatReportCount);
router.post("/OpenOrderBySupplierWithoutVatReportExportToExcel", authenticateJWT, RRReports.OpenOrderBySupplierWithoutVatReportExportToExcel);

router.post("/FollowUpReport", authenticateJWT, RRReports.getFollowUpReport);
router.post("/FollowUpReportExportToExcel", authenticateJWT, RRReports.FollowUpReportExportToExcel);
router.post("/BPIReport", authenticateJWT, RRReports.getBPIReport);
router.post("/BPIReportExportToExcel", authenticateJWT, RRReports.BPIReportExportToExcel);
router.post("/RepairRequestCustomReport", authenticateJWT, RRReports.RepairRequestCustomReport);
router.post("/RepairRequestCustomReportExcel", authenticateJWT, RRReports.RepairRequestCustomReportExcel);

router.post("/RRShipViaReport", authenticateJWT, RRReports.RRShipViaReport);
router.post("/RRShipViaReportExcel", authenticateJWT, RRReports.RRShipViaReportExcel);

router.post("/RRCreatedByUserReports", authenticateJWT, RRReports.RRCreatedByUserReports);
router.post("/RRCreatedByUserReportsExcel", authenticateJWT, RRReports.RRCreatedByUserReportsExcel);

router.post("/CustomerReportAmazonRaw", authenticateJWT, RRReports.CustomerReportAmazonRaw);
router.post("/CustomerReportAmazonRawCSV", authenticateJWT, RRReports.CustomerReportAmazonRawCSV);
router.post("/GMCostSavingReport", authenticateJWT, RRReports.GMCostSavingReport);
router.post("/GMCostSavingReportExcel", authenticateJWT, RRReports.GMCostSavingReportExcel);
router.post("/GMRepairTrackerReport", authenticateJWT, RRReports.GMRepairTrackerReport);
router.post("/GMRepairTrackerReportExcel", authenticateJWT, RRReports.GMRepairTrackerReportExcel);
router.post("/DanaCostSavingReport", authenticateJWT, RRReports.DanaCostSavingReport);
router.post("/DanaCostSavingReportExcel", authenticateJWT, RRReports.DanaCostSavingReportExcel);

router.post("/RRARReports", authenticateJWT, RRReports.RRARReports);
router.post("/RRARReportsToExcel", authenticateJWT, RRReports.RRARReportsToExcel);

router.post("/RRStartLocationReport", authenticateJWT, RRReports.RRStartLocation);
router.post("/RRStartLocationReportExcel", authenticateJWT, RRReports.RRStartLocationExcel);

router.post("/RMAReport", authenticateJWT, RRReports.RMAReport);
router.post("/RMAReportExportToExcel", authenticateJWT, RRReports.RMAReportExcel);
router.post("/getRMAReportCount", authenticateJWT, RRReports.getRMAReportCount);


router.post("/DanaOpenOrderBySupplierReport", authenticateJWT, RRReports.getDanaOpenOrderBySupplierReport);
router.post("/DanaOpenOrderBySupplierReportCount", authenticateJWT, RRReports.getDanaOpenOrderBySupplierReportCount);
router.post("/DanaOpenOrderBySupplierReportExportToExcel", authenticateJWT, RRReports.DanaOpenOrderBySupplierReportExportToExcel);

module.exports = router;
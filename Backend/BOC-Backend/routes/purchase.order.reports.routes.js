/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const POReports = require("../controllers/purchase.order.reports.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  

router.post("/PurchasesByItemReport",authenticateJWT,POReports.PurchasesByItemReport);
router.post("/PurchasesByItemReportToExcel",authenticateJWT,POReports.PurchasesByItemReportToExcel);
router.post("/PurchasesByVendor",authenticateJWT,POReports.PurchasesByVendor);
router.post("/PurchasesByVendorReportToExcel",authenticateJWT,POReports.PurchasesByVendorReportToExcel);
router.post("/PurchasesByMonth",authenticateJWT,POReports.PurchasesByMonth);
router.post("/PurchasesByMonthReportToExcel",authenticateJWT,POReports.PurchasesByMonthReportToExcel);

router.post("/POTaxVatReport",authenticateJWT,POReports.POTaxVatReport);
router.post("/POTaxVatReportToExcel",authenticateJWT,POReports.POTaxVatReportToExcel);
module.exports = router;
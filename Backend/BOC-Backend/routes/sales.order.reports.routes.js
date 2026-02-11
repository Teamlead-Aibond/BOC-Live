/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const SalesOrderReports = require("../controllers/sales.order.reports.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/SalesOrderByCustomer", authenticateJWT, SalesOrderReports.SalesOrderByCustomer);
router.post("/SalesOrderByCustomerReportToExcel", authenticateJWT, SalesOrderReports.SalesOrderByCustomerReportToExcel);
router.post("/SalesByParts", authenticateJWT, SalesOrderReports.SalesByParts);
router.post("/SalesByPartsReportToExcel", authenticateJWT, SalesOrderReports.SalesByPartsReportToExcel);
router.post("/SalesByMonth", authenticateJWT, SalesOrderReports.SalesByMonth);


router.post("/ParticularMonthSOByCustomerToExcel", authenticateJWT, SalesOrderReports.ParticularMonthSOByCustomerToExcel);
router.post("/ParticularMonthSOByCustomer", authenticateJWT, SalesOrderReports.ParticularMonthSOByCustomer);
router.post("/SODetailedReport", authenticateJWT, SalesOrderReports.SODetailedReport);
// 

router.post("/SOTaxVatReport", authenticateJWT, SalesOrderReports.SOTaxVatReport);
router.post("/SOTaxVatReportToExcel", authenticateJWT, SalesOrderReports.SOTaxVatReportToExcel);

router.post("/PayableReport", authenticateJWT, SalesOrderReports.PayableReport);
router.post("/PayableReportToExcel", authenticateJWT, SalesOrderReports.PayableReportToExcel);

router.post("/PayableReportDetails", authenticateJWT, SalesOrderReports.PayableReportDetails);
router.post("/PayableReportDetailsToExcel", authenticateJWT, SalesOrderReports.PayableReportDetailsToExcel);

router.post("/SalesByMonthNew", authenticateJWT, SalesOrderReports.SalesByMonthNew);
router.post("/SalesByMonthReportToExcel", authenticateJWT, SalesOrderReports.SalesByMonthReportToExcel);
router.post("/ParticularMonthSOByCustomerNew", authenticateJWT, SalesOrderReports.ParticularMonthSOByCustomerNew);
router.post("/SODetailedReportNew", authenticateJWT, SalesOrderReports.SODetailedReportNew);
router.post("/SalesByMonthReportToExcelNew", authenticateJWT, SalesOrderReports.SalesByMonthReportToExcelNew);
router.post("/ParticularMonthSOByCustomerToExcelNew", authenticateJWT, SalesOrderReports.ParticularMonthSOByCustomerToExcelNew);

router.post("/SalesByMonthWithCurrency", authenticateJWT, SalesOrderReports.SalesByMonthWithCurrency);
router.post("/ParticularMonthSOByCustomerWithCurrency", authenticateJWT, SalesOrderReports.ParticularMonthSOByCustomerWithCurrency);
router.post("/SODetailedReportWithCurrency", authenticateJWT, SalesOrderReports.SODetailedReportWithCurrency);
router.post("/SalesByMonthReportToExcelWithCurrency", authenticateJWT, SalesOrderReports.SalesByMonthReportToExcelWithCurrency);
router.post("/ParticularMonthSOByCustomerToExcelWithCurrency", authenticateJWT, SalesOrderReports.ParticularMonthSOByCustomerToExcelWithCurrency);

// router.post("/SalesByMonthNew", authenticateJWT, SalesOrderReports.SalesByMonthWithCurrency);
// router.post("/ParticularMonthSOByCustomerNew", authenticateJWT, SalesOrderReports.ParticularMonthSOByCustomerWithCurrency);
// router.post("/SODetailedReportNew", authenticateJWT, SalesOrderReports.SODetailedReportWithCurrency);
// router.post("/SalesByMonthReportToExcelNew", authenticateJWT, SalesOrderReports.SalesByMonthReportToExcelWithCurrency);
// router.post("/ParticularMonthSOByCustomerToExcelNew", authenticateJWT, SalesOrderReports.ParticularMonthSOByCustomerToExcelWithCurrency);

module.exports = router;
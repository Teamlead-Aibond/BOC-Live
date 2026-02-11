/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const InvoiceReports = require("../controllers/invoice.report.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/InvoiceByCustomer", authenticateJWT, InvoiceReports.InvoiceByCustomer);
router.post("/InvoiceByCustomerReportToExcel", authenticateJWT, InvoiceReports.InvoiceByCustomerReportToExcel);
router.post("/InvoiceByParts", authenticateJWT, InvoiceReports.InvoiceByParts);
router.post("/InvoiceByPartsReportToExcel", authenticateJWT, InvoiceReports.InvoiceByPartsReportToExcel);
router.post("/InvoiceByMonth", authenticateJWT, InvoiceReports.InvoiceByMonth);
router.post("/InvoiceByMonthReportToExcel", authenticateJWT, InvoiceReports.InvoiceByMonthReportToExcel);
router.post("/ParticularMonthInvoiceByCustomer", authenticateJWT, InvoiceReports.ParticularMonthInvoiceByCustomer);

router.post("/ParticularMonthInvoiceByCustomerToExcel", authenticateJWT, InvoiceReports.ParticularMonthInvoiceByCustomerToExcel);
router.post("/InvoiceDetailedReport", authenticateJWT, InvoiceReports.InvoiceDetailedReport);
router.post("/InvoiceDetailedReportCSV", authenticateJWT, InvoiceReports.InvoiceDetailedReportCSV);
router.post("/MROInvoiceDetailedReportCSV", authenticateJWT, InvoiceReports.MROInvoiceDetailedReportCSV);
// 

router.post("/InvoiceByMonthNew", authenticateJWT, InvoiceReports.InvoiceByMonthNew);
router.post("/ParticularMonthInvoiceByCustomerNew", authenticateJWT, InvoiceReports.ParticularMonthInvoiceByCustomerNew);
router.post("/InvoiceByMonthReportToExcelNew", authenticateJWT, InvoiceReports.InvoiceByMonthReportToExcelNew);
router.post("/ParticularMonthInvoiceByCustomerToExcelNew", authenticateJWT, InvoiceReports.ParticularMonthInvoiceByCustomerToExcelNew);
router.post("/InvoiceDetailedReportNew", authenticateJWT, InvoiceReports.InvoiceDetailedReportNew);

router.post("/InvoiceByMonthWithCurrency", authenticateJWT, InvoiceReports.InvoiceByMonthWithCurrency);
router.post("/ParticularMonthInvoiceByCustomerWithCurrency", authenticateJWT, InvoiceReports.ParticularMonthInvoiceByCustomerWithCurrency);
router.post("/InvoiceByMonthReportToExcelWithCurrency", authenticateJWT, InvoiceReports.InvoiceByMonthReportToExcelWithCurrency);
router.post("/ParticularMonthInvoiceByCustomerToExcelWithCurrency", authenticateJWT, InvoiceReports.ParticularMonthInvoiceByCustomerToExcelWithCurrency);
router.post("/InvoiceDetailedReportWithCurrency", authenticateJWT, InvoiceReports.InvoiceDetailedReportWithCurrency);

// Temp
// router.post("/InvoiceByMonthNew", authenticateJWT, InvoiceReports.InvoiceByMonthWithCurrency);
// router.post("/ParticularMonthInvoiceByCustomerNew", authenticateJWT, InvoiceReports.ParticularMonthInvoiceByCustomerWithCurrency);
// router.post("/InvoiceByMonthReportToExcelNew", authenticateJWT, InvoiceReports.InvoiceByMonthReportToExcelWithCurrency);
// router.post("/ParticularMonthInvoiceByCustomerToExcelNew", authenticateJWT, InvoiceReports.ParticularMonthInvoiceByCustomerToExcelWithCurrency);
// router.post("/InvoiceDetailedReportNew", authenticateJWT, InvoiceReports.InvoiceDetailedReportWithCurrency);
module.exports = router;
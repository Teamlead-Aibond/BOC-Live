/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const authenticateJWT = require("../middleware/jwt.authenticate.customer.js");
const customerportal = require("../controllers/customer.portal.controller.js");
//
router.post("/login", customerportal.Customerlogin);
router.post("/CustomerRRListByServerSide", authenticateJWT, customerportal.CustomerRRListByServerSide);
router.post("/CustomerSOListByServerSide", authenticateJWT, customerportal.CustomerSOListByServerSide);
router.get("/ViewProfile", authenticateJWT, customerportal.findOne);
router.put("/UpdateProfile", authenticateJWT, customerportal.update);
router.post("/SOViewByCustomerId", authenticateJWT, customerportal.SOViewByCustomerId);
router.post("/InvoiceViewByCustomerId", authenticateJWT, customerportal.InvoiceViewByCustomerId);
router.post("/RRView", authenticateJWT, customerportal.RRView);
router.post("/CustomerInvoiceListByServerSide", authenticateJWT, customerportal.CustomerInvoiceListByServerSide);
router.put("/ChangePassword", authenticateJWT, customerportal.changePassword);
router.post("/QuoteList", authenticateJWT, customerportal.QuoteList);
router.post("/QuoteView", authenticateJWT, customerportal.QuoteView);
router.post("/getDueListOfInvoiceByCustomerId", authenticateJWT, customerportal.getDueListOfInvoiceByCustomerId);
router.post("/getRushandWarrantyListOfRRByCustomerId", authenticateJWT, customerportal.getRushandWarrantyListOfRRByCustomerId);
router.post("/CustomerDashboardStatisticsCount", authenticateJWT, customerportal.CustomerDashboardStatisticsCount);
router.post("/CustomerloggedInStatusBarChart", authenticateJWT, customerportal.CustomerloggedInStatusBarChart);
router.post("/CustomerStatisticsRRList", authenticateJWT, customerportal.CustomerStatisticsRRList);
router.get("/CustomerDropDownListForDashboard", authenticateJWT, customerportal.CustomerDropDownListForDashboard);
router.post("/CustomerNameAutoSuggest", authenticateJWT, customerportal.CustomerNameAutoSuggest);
router.post("/TrackingNumber", authenticateJWT, customerportal.TrackingNumber);
router.post("/RejectCustomerQuoteFromCustomerPortal", authenticateJWT, customerportal.RejectCustomerQuoteFromCustomerPortal);
router.post("/ApproveCustomerQuote", authenticateJWT, customerportal.ApproveCustomerQuote);

router.post("/ListBlanketByCustomer", authenticateJWT, customerportal.ListBlanketByCustomer);
router.post("/ListPOUsage", authenticateJWT, customerportal.ListPOUsage);
router.post("/ListPOTopUpHistory", authenticateJWT, customerportal.ListPOTopUpHistory);
router.post("/ViewBlanketPOByCustomer", authenticateJWT, customerportal.ViewBlanketPOByCustomer);
router.post("/BlanketPOListByCustomerId", authenticateJWT, customerportal.BlanketPOListByCustomerId);

router.post("/WarrantyCreate", authenticateJWT, customerportal.WarrantyCreate);
router.post("/WarrantyView", authenticateJWT, customerportal.WarrantyView);

module.exports = router;
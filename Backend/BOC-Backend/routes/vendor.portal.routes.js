/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const authenticateJWT = require("../middleware/jwt.authenticate.vendor.js");
const vendorportal = require("../controllers/vendor.portal.controller.js");

router.post("/VendorRRListByServerSide", authenticateJWT, vendorportal.VendorRRListByServerSide);
router.post("/VendorPOListByServerSide", authenticateJWT, vendorportal.VendorPOListByServerSide);
router.get("/ViewProfile", authenticateJWT, vendorportal.findOne);
router.put("/UpdateProfile", authenticateJWT, vendorportal.update);
//router.post("/login", vendorportal.Vendorlogin);
router.post("/PurchaseOrderByVendorId", authenticateJWT, vendorportal.PurchaseOrderByVendorId);
router.post("/RRView", authenticateJWT, vendorportal.RRView);
router.put("/UpdateVendorQuote", authenticateJWT, vendorportal.UpdateVendorQuote);
router.post("/VendorInvoiceListByServerSide", authenticateJWT, vendorportal.getVendorInvListByServerSide);
router.post("/VendorInvoiceByVendorId", authenticateJWT, vendorportal.VendorInvoiceByVendorId);
router.put("/ChangePassword", authenticateJWT, vendorportal.changePassword);
router.post("/RushandWarrantyListOfRRByVendorId", authenticateJWT, vendorportal.getRushandWarrantyListOfRRByVendorId);
router.post("/DueListOfVendorInvoice", authenticateJWT, vendorportal.getDueListOfVendorInvoiceByVendorId);
router.post("/VendorDashboardStatisticsCount", authenticateJWT, vendorportal.VendorDashboardStatisticsCount);
router.post("/VendorloggedInStatusBarChart", authenticateJWT, vendorportal.VendorloggedInStatusBarChart);
router.post("/getVendorPortalDashboardPODue", authenticateJWT, vendorportal.getVendorPortalDashboardPODue);
router.post("/VendorStatisticsRRList", authenticateJWT, vendorportal.VendorStatisticsRRList);

//VENDOR APP API
router.post("/login", vendorportal.login);
router.post("/RRNoAutoSuggest", authenticateJWT, vendorportal.RRNoAutoSuggest);
router.post("/RRViewVendorApp", authenticateJWT, vendorportal.RRViewVendorApp);
module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const invoice = require("../controllers/invoice.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);

router.post("/create", authenticateJWT, invoice.Create);
router.post("/autocreate", authenticateJWT, invoice.AutoCreate);
router.put("/update", authenticateJWT, invoice.update);
router.post("/view", authenticateJWT, invoice.View);
router.post("/getInvoiceListByServerSide", authenticateJWT, invoice.getInvoiceListByServerSide);
router.post("/ApproveInvoice", authenticateJWT, invoice.ApproveInvoice);
router.post("/CancelInvoice", authenticateJWT, invoice.CancelInvoice);
router.post("/SendInvoiceEmailByInvoiceList", authenticateJWT, invoice.SendInvoiceEmailByInvoiceList);
// router.post("/SendInvoiceEmail", authenticateJWT,invoice.SendInvoiceEmail);
router.post("/delete", authenticateJWT, invoice.delete);
router.post("/getCustomerInvoiceStatstics", authenticateJWT, invoice.getCustomerInvoiceStatstics);
router.post("/listPartsLPP", authenticateJWT, invoice.listPartsLPP);
router.post("/DeleteInvoiceItem", authenticateJWT, invoice.DeleteInvoiceItem);
router.post("/getDueListOfInvoice", authenticateJWT, invoice.getDueListOfInvoice);
router.post("/ExportToExcel", authenticateJWT, invoice.ExportToExcel);
router.post("/ExportToExcelNew", authenticateJWT, invoice.ExportToExcelNew);
router.post("/IntacctCSVDownload", authenticateJWT, invoice.IntacctCSVDownload);
router.post("/IntacctJson", invoice.IntacctJson);
router.post("/ReOpenInvoice", authenticateJWT, invoice.ReOpenInvoice);
router.put("/AutoFixGrandTotal", authenticateJWT, invoice.AutoFixGrandTotal);
router.post("/InvoiceListWithGrandtotalIsZero", authenticateJWT, invoice.InvoiceListWithGrandtotalIsZero);
router.put("/UpdateNonRRAndNonMROCustomerPONoInInvoice", authenticateJWT, invoice.UpdateNonRRAndNonMROCustomerPONoInInvoice);
//MRO Section 
router.post("/MROAutoCreate", authenticateJWT, invoice.MROAutoCreate);
module.exports = router;
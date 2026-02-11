/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();

const VendorInvoice = require("../controllers/vendor.invoice.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/create", authenticateJWT, VendorInvoice.Create);
router.put("/update", authenticateJWT, VendorInvoice.update);
router.post("/view", authenticateJWT, VendorInvoice.View);
router.post("/getVendorInvListByServerSide", authenticateJWT, VendorInvoice.getVendorInvListByServerSide);
router.post("/ApproveVendorInvoice", authenticateJWT, VendorInvoice.ApproveVendorInvoice);
router.post("/autocreate", authenticateJWT, VendorInvoice.AutoCreate);
router.post("/delete", authenticateJWT, VendorInvoice.delete);
router.post("/ExportToExcel", authenticateJWT, VendorInvoice.ExportToExcel);
router.post("/DeleteVendorInvoiceItem", authenticateJWT, VendorInvoice.DeleteVendorInvoiceItem);
router.post("/ReOpenVendorInvoice", authenticateJWT, VendorInvoice.ReOpenVendorInvoice);
//MRO Section :
router.post("/MROAutoCreate", authenticateJWT, VendorInvoice.MROAutoCreate);
module.exports = router;
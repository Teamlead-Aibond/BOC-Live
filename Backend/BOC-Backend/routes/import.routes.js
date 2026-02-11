/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
var express = require("express");
var router = express.Router();
var path = require("path");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
var multer = require("multer");
const ImportController = require("../controllers/import.controller.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../assets/imports"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});
router.post(
  "/ImportCustomerPartNos",
  upload.single("file"),
  authenticateJWT,
  ImportController.ImportCustomerPartNos
);
router.post("/vendor", upload.single("file"), ImportController.ImportVendor);
router.post(
  "/customer",
  upload.single("file"),
  ImportController.ImportCustomer
);
router.post(
  "/customeruser",
  upload.single("file"),
  ImportController.ImportCustomerUser
);
router.post("/part", upload.single("file"), ImportController.ImportPart);
router.post(
  "/rr",
  upload.single("file"),
  authenticateJWT,
  ImportController.ImportRR
);
router.post(
  "/rr-price-currency",
  upload.single("file"),
  ImportController.ImportRRPriceCurrency
);
router.post(
  "/ChangeRecordCurrencyByCustomer",
  ImportController.ChangeRecordCurrencyByCustomer
);
router.post(
  "/ChangeRecordCurrencyByVendor",
  ImportController.ChangeRecordCurrencyByVendor
);
router.post(
  "/nonrr",
  upload.single("file"),
  authenticateJWT,
  ImportController.ImportNonRR
);
router.post(
  "/RRCustomerRef",
  upload.single("file"),
  ImportController.RRCustomerRef
);

router.post(
  "/UpdateCustomerPONoFromExcel",
  upload.single("file"),
  authenticateJWT,
  ImportController.UpdateCustomerPONoFromExcel
);
router.post(
  "/mappingPart",
  authenticateJWT,
  upload.single("file"),
  ImportController.ImportMappingPart
);

router.post("/BulkShipping-Pdf", ImportController.BulkShippingPdf);
router.post("/po-pdf-wo-tax", ImportController.poPdfWoTax);
router.post("/po-pdf", ImportController.poPdf);
router.post("/sq-pdf", ImportController.sqPdf);
router.post("/sq-multiple-pdf", ImportController.sqMultiplePdf);
router.post("/ps-pdf", ImportController.psPdf);
router.post("/so-pdf", ImportController.soPdf);
router.post("/vi-pdf", ImportController.viPdf);
router.post("/inv-pdf", ImportController.invPdf);
router.post("/c-inv-pdf", ImportController.cinvPdf);
router.post("/inv-pdf-wo-tax", ImportController.invPdfWoTax);
router.post("/inv-csv", ImportController.invCSV);
router.post(
  "/inv-csv-auto-upload",
  authenticateJWT,
  ImportController.invCSVAutoUpload
);

router.post(
  "/edi-csv",
  upload.single("file"),
  authenticateJWT,
  ImportController.ediCSV
);
router.post(
  "/LinkBlanketPONonRR",
  authenticateJWT,
  ImportController.LinkBlanketPONonRR
);
router.post(
  "/LinkBlanketPORR",
  authenticateJWT,
  ImportController.LinkBlanketPORR
);

router.post(
  "/CustomerAvailability",
  upload.single("file"),
  ImportController.CustomerAvailability
);
router.post(
  "/VendorAvailability",
  upload.single("file"),
  ImportController.VendorAvailability
);
router.post(
  "/UpdateVendorUnitPrice",
  upload.single("file"),
  ImportController.UpdateVendorUnitPrice
);

router.post(
  "/ImportMissingSOItem",
  upload.single("file"),
  authenticateJWT,
  ImportController.ImportMissingSOItem
);
router.post(
  "/ImportMissingPOItem",
  upload.single("file"),
  authenticateJWT,
  ImportController.ImportMissingPOItem
);
router.post(
  "/ImportMissingPODueDate",
  upload.single("file"),
  authenticateJWT,
  ImportController.ImportMissingPODueDate
);
router.post(
  "/ImportPartManufacturer",
  upload.single("file"),
  authenticateJWT,
  ImportController.ImportPartManufacturer
);
router.post("/checklist-pdf", ImportController.checklistPdf);
router.post("/checklist-both-pdf", ImportController.checklistBothPdf);
module.exports = router;

/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const fileUpload = function upload(uploadType) {
  let destinationPath = "";

  switch (uploadType) {
    case "customerProfile": destinationPath = "customer/profile/"; break;
    case "vendorProfile": destinationPath = "vendor/profile/"; break;
    case "userProfile": destinationPath = "user/profile/"; break;
    case "vendorAttachment": destinationPath = "vendor/attachment/"; break;
    case "customerAttachment": destinationPath = "customer/attachment/"; break;
    case "RRAttachment": destinationPath = "RR/attachment/"; break;
    case "RRVendorAttachment": destinationPath = "RR/vendorattachment/"; break;
    case "RRImage": destinationPath = "RR/image/"; break;
    case "RRNotes": destinationPath = "RR/notes/"; break;
    case "vendorQuote": destinationPath = "vendor/quote/"; break;
    case "PartImages": destinationPath = "parts/images/"; break;
    case "RRVendorQuoteAttachment": destinationPath = "RR/vendorquoteattachment/"; break;
    default: destinationPath = ""; break;
  }

  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        // Full path: Uploads/<destinationPath>
        const uploadDir = path.join(process.cwd(), "Uploads", destinationPath);
        // Create nested folders if not exist
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
        cb(null, uniqueName);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // Optional: 10MB max file size
    fileFilter: function (req, file, cb) {
      // Optional: restrict file types
      const allowedTypes = /jpeg|jpg|png|pdf/;
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.test(ext)) cb(null, true);
      else cb(new Error("Only images and PDFs are allowed"));
    },
  });
};

module.exports = fileUpload;

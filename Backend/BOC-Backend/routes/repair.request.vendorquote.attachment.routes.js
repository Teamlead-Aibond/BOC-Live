/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRVendoreQuoteAttachment = require("../controllers/repair.request.vendorquote.attachment.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  

router.post("/create", authenticateJWT,RRVendoreQuoteAttachment.create);
router.post("/list", authenticateJWT,RRVendoreQuoteAttachment.getAll);
router.post("/view", authenticateJWT,RRVendoreQuoteAttachment.findOne);
router.put("/update",authenticateJWT, RRVendoreQuoteAttachment.update);
router.post("/delete", authenticateJWT,RRVendoreQuoteAttachment.delete);
router.put("/updateall",authenticateJWT, RRVendoreQuoteAttachment.updateByIdOverall);
router.post("/getRRVendors",authenticateJWT, RRVendoreQuoteAttachment.getRRVendors);
router.post("/feedback/update",authenticateJWT, RRVendoreQuoteAttachment.feedbackUpdate);
router.post("/notes/update",authenticateJWT, RRVendoreQuoteAttachment.notesUpdate);
router.put("/updateBulkPrice",authenticateJWT, RRVendoreQuoteAttachment.updateBulkPrice);


module.exports = router;
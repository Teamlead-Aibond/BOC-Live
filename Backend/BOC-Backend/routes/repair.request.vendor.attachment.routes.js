/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRVendorAttachment = require("../controllers/repair.request.vendor.attachment.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);

router.post("/UpdateRRVendorAttachment", authenticateJWT, RRVendorAttachment.Create);
router.post("/Delete", authenticateJWT, RRVendorAttachment.Delete);
module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRVendors = require("../controllers/repair.request.vendors.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/view", authenticateJWT, RRVendors.ViewRRVendorInfo);
router.post("/UpdateRRVendorRefNo", authenticateJWT, RRVendors.UpdateRRVendorRefNo);
router.post("/LockVendorShipAddr", authenticateJWT, RRVendors.LockVendorShipAddr);
module.exports = router;
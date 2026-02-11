/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const Inventoryreceived = require("../controllers/inventory.received.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");


router.post("/GetProductByTransferNo", authenticateJWT, Inventoryreceived.GetProductByTransferNo);
router.post("/CreateReceivedPrductByList", authenticateJWT, Inventoryreceived.CreateReceivedPrductByList);
module.exports = router;
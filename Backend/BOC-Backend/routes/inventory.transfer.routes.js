/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const inventoryTransfer = require("../controllers/inventory.transfer.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/Create", authenticateJWT, inventoryTransfer.Create);
router.post("/CreateMultiple", authenticateJWT, inventoryTransfer.CreateMultiple);

module.exports = router;
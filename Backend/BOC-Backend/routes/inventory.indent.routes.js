/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const InventoryIndent = require("../controllers/inventory.indent.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");


router.post("/Create", authenticateJWT, InventoryIndent.Create);
router.post("/GetInventoryItemsByIndentNo", authenticateJWT, InventoryIndent.GetInventoryItemsByIndentNo);
router.post("/InventoryIndentListByServerSide", authenticateJWT, InventoryIndent.InventoryIndentListByServerSide);
router.post("/InventoryTransferListByServerSide", authenticateJWT, InventoryIndent.InventoryTransferListByServerSide);
module.exports = router;
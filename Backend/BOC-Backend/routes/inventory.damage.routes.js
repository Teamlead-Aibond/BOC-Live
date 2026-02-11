/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const InventoryDamage = require("../controllers/inventory.damage.controller");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/list", authenticateJWT, InventoryDamage.InventoryDamageListServerSide);
router.post("/create", authenticateJWT, InventoryDamage.Create);

module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const InventoryStockinController = require("../controllers/inventory.stockin.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js"); 

router.post("/StockInListServerSide", authenticateJWT,InventoryStockinController.StockInListServerSide);
router.post("/CheckRFIDTagExists", authenticateJWT,InventoryStockinController.CheckRFIDTagExists);
router.get("/StockInUpdatedList", authenticateJWT,InventoryStockinController.StockInUpdatedList);

module.exports = router;//
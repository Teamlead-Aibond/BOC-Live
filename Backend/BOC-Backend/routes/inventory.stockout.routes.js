/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const InventoryStockoutController = require("../controllers/inventory.stockout.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js"); 

router.post("/Create", authenticateJWT,InventoryStockoutController.create);
router.post("/List", authenticateJWT,InventoryStockoutController.list);
router.post("/StockOutReadyShippingList", authenticateJWT,InventoryStockoutController.StockOutReadyShippingList);
router.post("/StockOutHistoryList", authenticateJWT,InventoryStockoutController.StockOutHistoryList);
router.post("/StockOutSuccess", authenticateJWT,InventoryStockoutController.StockOutSuccess);
router.post("/Delete", authenticateJWT,InventoryStockoutController.Delete);
router.post("/Reset", authenticateJWT,InventoryStockoutController.Reset);
module.exports = router;
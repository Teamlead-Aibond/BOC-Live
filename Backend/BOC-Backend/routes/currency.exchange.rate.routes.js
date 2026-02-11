/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const CurrencyExchangeRateController = require("../controllers/currency.exchange.rate.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.get("/list", globalauthenticateJWT, CurrencyExchangeRateController.getAll);
router.get("/dropdown", globalauthenticateJWT, CurrencyExchangeRateController.dropdown);
router.post("/create", authenticateJWT, CurrencyExchangeRateController.create);
router.post("/view", authenticateJWT, CurrencyExchangeRateController.findOne);
router.put("/update", authenticateJWT, CurrencyExchangeRateController.update);
router.post("/delete", authenticateJWT, CurrencyExchangeRateController.delete);
router.post("/exchange", authenticateJWT, CurrencyExchangeRateController.exchange);
module.exports = router;
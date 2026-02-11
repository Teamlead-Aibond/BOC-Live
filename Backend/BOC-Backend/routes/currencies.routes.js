/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const CurrencyController = require("../controllers/currencies.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.get("/list", globalauthenticateJWT, CurrencyController.getAll);
router.get("/dropdown", globalauthenticateJWT, CurrencyController.dropdown);
router.post("/create", authenticateJWT, CurrencyController.create);
router.post("/view", authenticateJWT, CurrencyController.findOne);
router.put("/update", authenticateJWT, CurrencyController.update);
router.post("/delete", authenticateJWT, CurrencyController.delete);
module.exports = router;
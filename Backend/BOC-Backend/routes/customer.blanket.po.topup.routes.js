/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const CustomerBlanketPOTopUp = require("../controllers/customer.blanket.po.topup.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/Create", authenticateJWT, CustomerBlanketPOTopUp.Create);
router.post("/View", authenticateJWT, CustomerBlanketPOTopUp.View);
router.post("/ListTopUpByPO", authenticateJWT, CustomerBlanketPOTopUp.ListTopUpByPO);
module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const CustomerBlanketPOHistory = require("../controllers/customer.blanket.po.history.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/ServerSideList", authenticateJWT, CustomerBlanketPOHistory.List);
module.exports = router;
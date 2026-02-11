/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const multer = require('multer');
const salesOrderCustomerRef = require("../controllers/sales.order.customer.ref.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  
router.post("/create", authenticateJWT,salesOrderCustomerRef.create);
router.put("/update", authenticateJWT,salesOrderCustomerRef.Update);
router.delete("/delete", authenticateJWT,salesOrderCustomerRef.Delete);
module.exports = router;
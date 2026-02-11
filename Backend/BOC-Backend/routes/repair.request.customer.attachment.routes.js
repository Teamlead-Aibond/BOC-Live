/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRCustomerAttachment = require("../controllers/repair.request.customer.attachment.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/create", authenticateJWT, RRCustomerAttachment.create);
router.get("/list", authenticateJWT, RRCustomerAttachment.list);
router.post("/view", authenticateJWT, RRCustomerAttachment.view);
router.put("/update", authenticateJWT, RRCustomerAttachment.update);
router.post("/delete", authenticateJWT, RRCustomerAttachment.delete);
module.exports = router;
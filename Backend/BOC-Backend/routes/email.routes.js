/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const Email = require("../controllers/email.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/GetEmailContent", authenticateJWT, Email.GetEmailContent);
router.post("/SendEmail", authenticateJWT, Email.SendEmail);
// router.post("/SendEmail", authenticateJWT, Email.SendEmailWithBulkOutlook);
router.post("/SendEmailOutlookTest", authenticateJWT, Email.SendEmailWithBulkOutlookTest);

//MRO Section
router.post("/GetMROEmailContent", authenticateJWT, Email.GetMROEmailContent);
router.post("/MROSendEmail", authenticateJWT, Email.MROSendEmail);
module.exports = router;
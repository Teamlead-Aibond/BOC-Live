/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRAttachment = require("../controllers/repair.request.attachment.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  
//router.use(authenticateJWT);


// Create a new 
router.post("/create", authenticateJWT,RRAttachment.create);
// Retrieve all 
router.get("/list", authenticateJWT,RRAttachment.getAll);
router.post("/view", authenticateJWT,RRAttachment.findOne);
router.put("/update",authenticateJWT, RRAttachment.update);
router.post("/delete", authenticateJWT,RRAttachment.delete);
module.exports = router;
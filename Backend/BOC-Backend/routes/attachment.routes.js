/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const attachment = require("../controllers/attachment.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  
//router.use(authenticateJWT);

// Create a new
router.post("/create", authenticateJWT, attachment.create);
router.put("/update", authenticateJWT, attachment.update);
router.post("/delete", authenticateJWT, attachment.delete);

module.exports = router;
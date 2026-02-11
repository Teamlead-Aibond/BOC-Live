/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const warranty = require("../controllers/warranty.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  
//router.use(authenticateJWT);


router.get("/list", authenticateJWT,warranty.getAll);

module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const exporttoexcel = require("../controllers/export.to.excel.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js"); 
 
router.get("/ExportToExcel",authenticateJWT,exporttoexcel.ExportToExcel);
module.exports=router;
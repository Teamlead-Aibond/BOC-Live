/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const PoItem = require("../controllers/po.item.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  


router.post("/GetPODetails", authenticateJWT,PoItem.GetPODetails);


module.exports=router;

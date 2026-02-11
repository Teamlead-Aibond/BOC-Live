/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const Terms = require("../controllers/terms.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  


router.post("/create", authenticateJWT,Terms.create);
router.get("/list", authenticateJWT,Terms.getAll);
router.post("/view", authenticateJWT,Terms.findOne);
router.put("/update",authenticateJWT, Terms.update);
router.post("/delete", authenticateJWT,Terms.delete);

module.exports=router;
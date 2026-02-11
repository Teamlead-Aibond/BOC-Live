/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const UserCustomer = require("../controllers/users.customers.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  

router.get("/list",authenticateJWT,UserCustomer.getAll);
router.post("/create", authenticateJWT,UserCustomer.create);
router.post("/delete", authenticateJWT,UserCustomer.delete);
module.exports=router;
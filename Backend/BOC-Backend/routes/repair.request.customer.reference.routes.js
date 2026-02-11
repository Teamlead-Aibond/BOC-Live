/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRCreference = require("../controllers/repair.request.customer.reference.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);


// Create a new 
router.post("/create", authenticateJWT, RRCreference.create);
router.put("/update", authenticateJWT, RRCreference.update);

//MRO Section
router.post("/MROcreate", authenticateJWT, RRCreference.MROcreate);
module.exports = router;
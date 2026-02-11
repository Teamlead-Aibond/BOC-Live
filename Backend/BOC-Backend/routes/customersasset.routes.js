/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();

const customersasset = require("../controllers/customersasset.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js"); 
//router.use(authenticateJWT);

// Create a new
router.post("/create", authenticateJWT,customersasset.create);
router.put("/update", authenticateJWT,customersasset.update);
router.post("/getAll", authenticateJWT,customersasset.getAll);
router.post("/delete", authenticateJWT,customersasset.delete);
module.exports = router;
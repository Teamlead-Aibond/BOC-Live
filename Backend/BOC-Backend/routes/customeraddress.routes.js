/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();

const Address = require("../controllers/customeraddress.controller.js");

const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);

// Create a new
router.post("/create", authenticateJWT, Address.create);
router.put("/update", authenticateJWT, Address.update);
//router.post("/delete", Address.delete);
router.post("/delete", authenticateJWT, Address.delete);
router.post("/list", authenticateJWT, Address.list);
router.post("/view", authenticateJWT, Address.view);
router.put("/setprimaryaddress", authenticateJWT, Address.setprimaryaddress);
router.get("/GetAHGroupVendorAddress", authenticateJWT, Address.GetAHGroupVendorAddress);
module.exports = router;
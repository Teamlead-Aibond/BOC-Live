/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRWarranty = require("../controllers/repair.request.warranty.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js"); 
const authenticateJWTCustomer = require("../middleware/jwt.authenticate.customer.js"); 
const authenticateJWTVendor = require("../middleware/jwt.authenticate.vendor.js"); 

// Create a new 
router.post("/create", authenticateJWT, RRWarranty.create);
router.post("/update", authenticateJWT, RRWarranty.update); 
router.post("/view", authenticateJWT, RRWarranty.findOne); 
router.post("/delete", authenticateJWT,RRWarranty.delete);

router.post("/CustomerWarrantyList",authenticateJWTCustomer, RRWarranty.WarrantyList);
router.post("/VendorWarrantyList",authenticateJWTVendor, RRWarranty.WarrantyList); 

module.exports = router;
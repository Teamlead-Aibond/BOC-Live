/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const Customerparts = require("../controllers/customer.parts.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js"); 
 
router.post("/list",authenticateJWT,Customerparts.getAll);
router.post("/create",authenticateJWT,Customerparts.create);
router.post("/addNewPart",authenticateJWT,Customerparts.addNewPart);
router.post("/delete",authenticateJWT,Customerparts.delete); 
router.post("/updateList",authenticateJWT,Customerparts.updateList);
router.post("/update",authenticateJWT,Customerparts.update);
router.post("/viewPartInfo",authenticateJWT,Customerparts.GetPartsInfo);
router.post("/viewCustomerInfo",authenticateJWT,Customerparts.GetCustomerInfo);
router.post("/CustomerPartsListByServerSide",authenticateJWT,Customerparts.CustomerPartsListByServerSide);

module.exports=router;
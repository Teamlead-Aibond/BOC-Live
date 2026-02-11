/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const CustomerGroupController = require("../controllers/customer.group.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.get("/list", globalauthenticateJWT, CustomerGroupController.getAll);
router.get("/dropdown", globalauthenticateJWT, CustomerGroupController.dropdown);
router.post("/create", authenticateJWT, CustomerGroupController.create);
router.post("/view", authenticateJWT, CustomerGroupController.findOne);
router.put("/update", authenticateJWT, CustomerGroupController.update);
router.post("/delete", authenticateJWT, CustomerGroupController.delete);
module.exports = router;
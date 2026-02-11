/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const StoreLocationController = require("../controllers/store.location.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.get("/list", globalauthenticateJWT, StoreLocationController.getAll);
router.get("/dropdown", globalauthenticateJWT, StoreLocationController.dropdown);
router.post("/create", authenticateJWT, StoreLocationController.create);
router.post("/view", authenticateJWT, StoreLocationController.findOne);
router.put("/update", authenticateJWT, StoreLocationController.update);
router.post("/delete", authenticateJWT, StoreLocationController.delete);
module.exports = router;
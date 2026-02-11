/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRPartsLocationController = require("../controllers/repair.request.part.location.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.get("/list", globalauthenticateJWT, RRPartsLocationController.getAll);
router.get("/dropdown", globalauthenticateJWT, RRPartsLocationController.dropdown);
router.post("/create", authenticateJWT, RRPartsLocationController.create);
router.post("/view", authenticateJWT, RRPartsLocationController.findOne);
router.put("/update", authenticateJWT, RRPartsLocationController.update);
router.post("/delete", authenticateJWT, RRPartsLocationController.delete);
module.exports = router;
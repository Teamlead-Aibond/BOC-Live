/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const SubStatusController = require("../controllers/substatus.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.get("/list", globalauthenticateJWT, SubStatusController.getAll);
router.get("/dropdown", globalauthenticateJWT, SubStatusController.dropdown);
router.post("/create", authenticateJWT, SubStatusController.create);
router.post("/view", authenticateJWT, SubStatusController.findOne);
router.put("/update", authenticateJWT, SubStatusController.update);
router.post("/delete", authenticateJWT, SubStatusController.delete);
module.exports = router;
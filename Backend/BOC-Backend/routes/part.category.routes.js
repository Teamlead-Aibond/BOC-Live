/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const PartCategoryController = require("../controllers/part.category.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.get("/list", authenticateJWT, PartCategoryController.getAll);
router.post("/create", authenticateJWT, PartCategoryController.create);
router.post("/view", authenticateJWT, PartCategoryController.findOne);
router.put("/update", authenticateJWT, PartCategoryController.update);
router.post("/delete", authenticateJWT, PartCategoryController.delete);
router.post("/PartCategoryDropdown", authenticateJWT, PartCategoryController.PartCategoryDropdown);

module.exports = router;
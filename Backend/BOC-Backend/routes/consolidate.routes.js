/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const consolidate = require("../controllers/consolidate.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/create", authenticateJWT, consolidate.create);
router.post("/update", authenticateJWT, consolidate.update);
router.post("/view", authenticateJWT, consolidate.view);
router.post("/list", authenticateJWT, consolidate.getList);
router.post("/search-list", authenticateJWT, consolidate.getSearchList);
router.post("/delete", authenticateJWT, consolidate.delete);
router.post("/delete-detail", authenticateJWT, consolidate.deleteDetail);
module.exports = router;
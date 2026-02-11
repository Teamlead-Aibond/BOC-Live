/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRBatch = require("../controllers/rr.batch.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

//router.use(authenticateJWT);
const multer = require('multer');
router.post("/create", authenticateJWT, RRBatch.Create);
router.post("/list", authenticateJWT, RRBatch.RRBatchListByServerSide);

module.exports = router;//

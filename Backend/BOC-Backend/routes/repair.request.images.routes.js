/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRImages = require("../controllers/repair.request.images.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);


router.post("/create", authenticateJWT, RRImages.create);
router.post("/delete", authenticateJWT, RRImages.delete);
router.post("/SetAsPrimary", authenticateJWT, RRImages.SetAsPrimary);


module.exports = router;
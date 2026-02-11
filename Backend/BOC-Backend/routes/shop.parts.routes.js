/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const parts = require("../controllers/shop.parts.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);

var path = require('path');
var multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/imports'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({
    storage: storage
});

// router.post("/PartsListByServerSide", authenticateJWT, parts.PartsListByServerSide);
router.post("/addPart", authenticateJWT, parts.addPart);
router.post("/updatePart", authenticateJWT, parts.updatePart);
router.post("/viewPart", authenticateJWT, parts.viewPart);
router.post("/deletePart", authenticateJWT, parts.deletePart);
router.post("/deletePartItem", authenticateJWT, parts.deletePartItem);
router.post("/updateQuantity", authenticateJWT, parts.updateQuantity);
router.post("/reduceQuantity", authenticateJWT, parts.reduceQuantity);
router.post("/addPartItem", authenticateJWT, parts.addPartItem);
router.post("/stocklogs", authenticateJWT, parts.stockLogs);
router.post("/dashboard", authenticateJWT, parts.shopDashboard);


module.exports = router;

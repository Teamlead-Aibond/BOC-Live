/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
var path = require('path');
const authenticateJWT = require("../middleware/jwt.authenticate.js");
var multer = require("multer");
const ImportController = require('../controllers/import.changes.controller.js');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/imports'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

router.post("/RRDateBulkUpdate", upload.single('file'), authenticateJWT, ImportController.RRDateBulkUpdate);
router.post("/CreateQTSOForPO", upload.single('file'), authenticateJWT, ImportController.CreateQTSOForPO);


module.exports = router;
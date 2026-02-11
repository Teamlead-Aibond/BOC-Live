/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const MROAttachment = require("../controllers/mro.attachment.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);
router.post("/create", authenticateJWT, MROAttachment.create);
router.get("/list", authenticateJWT, MROAttachment.getAll);
router.post("/view", authenticateJWT, MROAttachment.findOne);
router.put("/update", authenticateJWT, MROAttachment.update);
router.post("/delete", authenticateJWT, MROAttachment.delete);
module.exports = router;
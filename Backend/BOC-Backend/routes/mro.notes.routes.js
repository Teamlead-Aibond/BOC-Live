/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const MRONotes = require("../controllers/mro.notes.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/create", authenticateJWT, MRONotes.create);
router.get("/list", authenticateJWT, MRONotes.getAll);
router.post("/view", authenticateJWT, MRONotes.findOne);
router.put("/update", authenticateJWT, MRONotes.update);
router.post("/delete", authenticateJWT, MRONotes.delete);
module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRFollowUpNotes = require("../controllers/repair.request.followup.notes.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/create", authenticateJWT, RRFollowUpNotes.create);
router.get("/list", authenticateJWT, RRFollowUpNotes.getAll);
router.post("/view", authenticateJWT, RRFollowUpNotes.findOne);
router.put("/update", authenticateJWT, RRFollowUpNotes.update);
router.post("/delete", authenticateJWT, RRFollowUpNotes.delete);

module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const FollowUp = require("../controllers/repair.request.followup.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);


router.post("/GetFollowUpGetContent", authenticateJWT, FollowUp.GetFollowUpGetContent);
router.post("/Create", authenticateJWT, FollowUp.Create);
router.post("/View", authenticateJWT, FollowUp.ViewFollowUp);
router.put("/UpdateNotes", authenticateJWT, FollowUp.UpdateNotes);
router.post("/delete", authenticateJWT, FollowUp.Delete);

//MRO Section
router.post("/GetMROFollowUpGetContent", authenticateJWT, FollowUp.GetMROFollowUpGetContent);
router.post("/MROCreate", authenticateJWT, FollowUp.MROCreate);
module.exports = router;
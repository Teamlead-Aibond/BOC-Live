/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const AutoScriptFindIssues = require("../controllers/autoscript.find.fix.issues.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
// For Rr
router.post("/RRBlanketPOMismatchList", AutoScriptFindIssues.RRBlanketPOMismatchList);
router.post("/RRBlanketPOMismatchFix", AutoScriptFindIssues.RRBlanketPOMismatchFix);
// For QT
router.post("/QTBlanketPOMismatchList", AutoScriptFindIssues.QTBlanketPOMismatchList);
router.post("/QTBlanketPOMismatchFix", AutoScriptFindIssues.QTBlanketPOMismatchFix);

router.post("/MRONonInvocieFix", AutoScriptFindIssues.MRONonInvocieFix);


// For MRO
router.post("/MROBlanketPOMismatchList", AutoScriptFindIssues.MROBlanketPOMismatchList);
router.post("/MROBlanketPOMismatchPendingList", AutoScriptFindIssues.MROBlanketPOMismatchPendingList);
router.post("/MROBlanketPOMismatchFix", AutoScriptFindIssues.MROBlanketPOMismatchFix);


// For RR using SO
router.post("/RRBlanketPOMismatchListBySO", AutoScriptFindIssues.RRBlanketPOMismatchListBySO);
router.post("/RRBlanketPOMismatchFixBySO", AutoScriptFindIssues.RRBlanketPOMismatchFixBySO);
// For QT using SO
router.post("/QTBlanketPOMismatchListBySo", AutoScriptFindIssues.QTBlanketPOMismatchListBySo);
router.post("/QTBlanketPOMismatchFixBySo", AutoScriptFindIssues.QTBlanketPOMismatchFixBySo);
// For QT using SO
router.post("/MROBlanketPOMismatchListBySo", AutoScriptFindIssues.MROBlanketPOMismatchListBySo);
router.post("/MROBlanketPOMismatchFixBySo", AutoScriptFindIssues.MROBlanketPOMismatchFixBySo);


module.exports = router;
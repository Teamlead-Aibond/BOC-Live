/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const MROController = require("../controllers/mro.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
router.post("/createMRO", authenticateJWT, MROController.createMRO);
router.post("/updateAddQuotes", authenticateJWT, MROController.updateAddQuotes);

router.post("/MROListByServerSide", authenticateJWT, MROController.MROListByServerSide);
router.post("/viewMRO", authenticateJWT, MROController.viewMRO);
router.post("/DeleteMRO", authenticateJWT, MROController.DeleteMRO);
router.post("/PackingSlip", authenticateJWT, MROController.PackingSlip);
router.post("/AssignVendor", authenticateJWT, MROController.AssignVendor);
router.post("/updateMRO", authenticateJWT, MROController.UpdateMRO);
router.put("/UpdateMROVendorQuote", authenticateJWT, MROController.UpdateMROVendorQuote);
router.post("/ViewMROVendorInfo", authenticateJWT, MROController.ViewMROVendorInfo);
router.post("/Complete", authenticateJWT, MROController.complete);
router.put("/RejectMROVendor", authenticateJWT, MROController.RejectMROVendor);
router.put("/UpdatePartCurrentLocation", authenticateJWT, MROController.UpdatePartCurrentLocation);
router.put("/RemoveMROVendor", authenticateJWT, MROController.RemoveMROVendor);
router.put("/UpdateMROStep2", authenticateJWT, MROController.UpdateMROStep2);
router.post("/GetMROStatistics", authenticateJWT, MROController.GetMROStatistics);
router.post("/AssignAHGroupVendor", authenticateJWT, MROController.AssignAHGroupVendor);
router.post("/VendorQuoteBySO", authenticateJWT, MROController.VendorQuoteBySO);
router.post("/changeStatusToQuoted", authenticateJWT, MROController.changeStatusToQuoted);
router.put("/RejectMRO", authenticateJWT, MROController.RejectMRO);
router.post("/DuplicateMRO", authenticateJWT, MROController.DuplicateMRO);
router.post("/MROStatusAutoScript", authenticateJWT, MROController.MROStatusAutoScript);
router.post("/ActiveInActiveMRO", authenticateJWT, MROController.ActiveInActiveMRO);
module.exports = router;

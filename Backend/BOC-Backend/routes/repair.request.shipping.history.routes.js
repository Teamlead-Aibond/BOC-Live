/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RRSH = require("../controllers/repair.request.shipping.history.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);


router.post("/list", authenticateJWT, RRSH.getAll);
router.post("/ship", authenticateJWT, RRSH.ship);
router.get("/shipViaList", authenticateJWT, RRSH.shipViaList);

router.put("/receive", authenticateJWT, RRSH.receive);
router.put("/update", authenticateJWT, RRSH.update);
router.post("/revert", authenticateJWT, RRSH.revert);
router.post("/BulkShipping", authenticateJWT, RRSH.BulkShipping);
router.post("/ServerSideList", authenticateJWT, RRSH.ServerSideList);
router.post("/UpdateReadyForPickUpToPickUp", authenticateJWT, RRSH.UpdateReadyForPickUpToPickUp);
router.post("/ClientSideRRShipHistoryListByVendor", authenticateJWT, RRSH.ClientSideRRShipHistoryListByVendor);
router.post("/UploadSignatureToS3", authenticateJWT, RRSH.UploadSignatureToS3);

//MRO Section 
router.post("/MROship", authenticateJWT, RRSH.MROship);
router.put("/MROReceive", authenticateJWT, RRSH.MROReceive);
router.post("/MRORevert", authenticateJWT, RRSH.MRORevert);
module.exports = router;
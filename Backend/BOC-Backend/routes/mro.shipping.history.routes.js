/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const MROShippingHistory = require("../controllers/mro.shipping.history.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);
router.post("/ShipAndReceive", authenticateJWT, MROShippingHistory.ShipAndReceive);
router.post("/Ship", authenticateJWT, MROShippingHistory.Ship);
router.get("/List", authenticateJWT, MROShippingHistory.List);
router.post("/View", authenticateJWT, MROShippingHistory.View);
router.put("/Receive", authenticateJWT, MROShippingHistory.Receive);
router.post("/Delete", authenticateJWT, MROShippingHistory.Delete);
router.put("/update", authenticateJWT, MROShippingHistory.update);
module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RequestForQuoteController = require("../controllers/request.for.quote.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
router.get("/list", authenticateJWT, RequestForQuoteController.getAll);
router.post("/RequestForQuoteListByServerSide", authenticateJWT, RequestForQuoteController.RequestForQuoteListByServerSide);
router.post("/create", authenticateJWT, RequestForQuoteController.create);
router.post("/view", authenticateJWT, RequestForQuoteController.findOne);
router.put("/update", authenticateJWT, RequestForQuoteController.update);
router.put("/EditRequest", authenticateJWT, RequestForQuoteController.EditRequest);
router.post("/delete", authenticateJWT, RequestForQuoteController.delete);
module.exports = router;
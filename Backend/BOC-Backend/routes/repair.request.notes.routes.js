/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const repairrequestnotes = require("../controllers/repair.request.notes.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT); 

// Create a new 
router.post("/create", authenticateJWT, repairrequestnotes.create);
// Retrieve all 
router.get("/list", authenticateJWT, repairrequestnotes.getAll);
router.post("/view", authenticateJWT, repairrequestnotes.findOne);
router.put("/update", authenticateJWT, repairrequestnotes.update);
router.post("/delete", authenticateJWT, repairrequestnotes.delete);

router.post("/getStatistics", authenticateJWT, repairrequestnotes.getRRStatistics);
router.post("/getRRListByServerSide", authenticateJWT, repairrequestnotes.getRRListByServerSide);
router.post("/getRRListByServerSideBasic", authenticateJWT, repairrequestnotes.getRRListByServerSideBasic);
router.post("/getRRMyWorksListByServerSide", authenticateJWT, repairrequestnotes.getRRMyWorksListByServerSide);
router.post("/getRRPrice", authenticateJWT, repairrequestnotes.getRRPrice);
router.post("/getRRCustomerReference", authenticateJWT, repairrequestnotes.getRRCustomerReference);


module.exports = router;
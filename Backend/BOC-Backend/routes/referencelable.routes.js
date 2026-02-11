/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const referencelable = require("../controllers/referencelable.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  
//router.use(authenticateJWT);


// Create a new 
router.post("/create", authenticateJWT,referencelable.create);
// Retrieve all 
router.get("/list", authenticateJWT,referencelable.getAll);
router.post("/view", authenticateJWT,referencelable.findOne);
router.put("/update",authenticateJWT, referencelable.update);
router.post("/delete", authenticateJWT,referencelable.delete);
module.exports = router;
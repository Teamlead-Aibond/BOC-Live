/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const customersdepartment = require("../controllers/customersdepartment.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);

// Create a new
router.post("/create", authenticateJWT, customersdepartment.create);

router.post("/list", authenticateJWT, customersdepartment.list);

router.put("/update", authenticateJWT, customersdepartment.update);

//router.post("/delete", customersdepartment.delete);
router.post("/delete", authenticateJWT, customersdepartment.delete);
module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const Role = require("../controllers/role.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  


router.get("/GetAllRoles", authenticateJWT,Role.GetAllRoles);
router.post("/Create", authenticateJWT,Role.Create);
router.put("/Update", authenticateJWT,Role.Update);
router.put("/Remove", authenticateJWT,Role.Remove);



module.exports=router;

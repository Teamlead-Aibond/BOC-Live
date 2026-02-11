/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const department = require("../controllers/department.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");  
//router.use(authenticateJWT);

/**
*  @swagger
*  path:
*   /api/v1.0/department/list:
*     get:
*       summary: Lists all Departments
*       tags: [Departments]
*       responses:
*         "200":
*           description: The list of departments.
*/

// Create a new department
router.post("/create", authenticateJWT,department.create);
// Retrieve all departments
router.get("/list", globalauthenticateJWT,department.getAll);
router.get("/view", authenticateJWT,department.findOne);
router.put("/update", authenticateJWT,department.update);
router.post("/delete", authenticateJWT,department.delete);
module.exports = router;
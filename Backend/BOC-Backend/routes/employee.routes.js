/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const employee = require("../controllers/employee.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");


router.post("/list", authenticateJWT, employee.EmployeeListByServerSide);
router.post("/delete", authenticateJWT, employee.Delete);
router.post("/create", authenticateJWT, employee.Create);
router.post("/update", authenticateJWT, employee.UpdateById);
router.post("/view", authenticateJWT, employee.findOne);
router.get("/employee-list", authenticateJWT, employee.employeeList);
router.post("/getEmployeeNo", authenticateJWT, employee.getEmployeeNo);

router.get("/responsibilityddllist", authenticateJWT, employee.getAllResponsibilityDDL);
router.post("/responsibilitycreate", authenticateJWT, employee.CreateResponsibility);
router.post("/responsibilityupdate", authenticateJWT, employee.UpdateByIdResponsibility);
router.post("/responsibilityview", authenticateJWT, employee.findOneResponsibility);
router.post("/responsibilitydelete", authenticateJWT, employee.DeleteResponsibility);
router.get("/responsibilitylist", authenticateJWT, employee.getAllResponsibility);


module.exports = router;

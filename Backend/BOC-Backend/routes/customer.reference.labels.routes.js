/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const CustomerReference = require("../controllers/customer.reference.label.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
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
router.post("/list", authenticateJWT, CustomerReference.getAll);
router.post("/create", authenticateJWT, CustomerReference.create);
router.put("/updateDisplayInQR", authenticateJWT, CustomerReference.updateDisplayInQR);
router.put("/updateEditableByCustomer", authenticateJWT, CustomerReference.updateEditableByCustomer);
// router.post("/view", authenticateJWT,CustomerReference.findOne);
router.put("/update", authenticateJWT, CustomerReference.update);
router.post("/deleteRRCusRef", authenticateJWT, CustomerReference.deleteRRCusRef);
router.post("/delete", authenticateJWT, CustomerReference.delete);
router.put("/UpdateCustomerRefRank", authenticateJWT, CustomerReference.UpdateCustomerRefRank);
module.exports = router;
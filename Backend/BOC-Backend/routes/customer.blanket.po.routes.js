/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const CustomerBlanketPO = require("../controllers/customer.blanket.po.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/List", authenticateJWT, CustomerBlanketPO.List);
router.post("/Create", authenticateJWT, CustomerBlanketPO.Create);
router.post("/Delete", authenticateJWT, CustomerBlanketPO.Delete);
router.put("/Update", authenticateJWT, CustomerBlanketPO.Update);
router.put("/Update2", authenticateJWT, CustomerBlanketPO.Update2);
router.put("/Update3", authenticateJWT, CustomerBlanketPO.Update3);
router.post("/View", authenticateJWT, CustomerBlanketPO.View);
router.post("/BlanketPOListByCustomerId", authenticateJWT, CustomerBlanketPO.BlanketPOListByCustomerId);
router.post("/Report1List", authenticateJWT, CustomerBlanketPO.Report1List);
router.post("/ViewBlanketPOByRRIdAndCustomerBlanketPOId", authenticateJWT, CustomerBlanketPO.ViewBlanketPOByRRIdAndCustomerBlanketPOId);
router.post("/BlanketPOExludedPartList", authenticateJWT, CustomerBlanketPO.BlanketPOExludedPartList);

module.exports = router;
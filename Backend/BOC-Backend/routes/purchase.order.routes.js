/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const purchaseorder = require("../controllers/purchase.order.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post("/autocreate", authenticateJWT, purchaseorder.AutoCreate);
router.post("/create", authenticateJWT, purchaseorder.create);
router.post("/update", authenticateJWT, purchaseorder.Update);
router.post("/view", authenticateJWT, purchaseorder.ViewById);
router.post("/getPurchaseListByServerSide", authenticateJWT, purchaseorder.getPurchaseListByServerSide);
router.post("/ApprovePO", authenticateJWT, purchaseorder.ApprovePO);
router.post("/delete", authenticateJWT, purchaseorder.delete);
router.post("/SendPOEmailByPOList", authenticateJWT, purchaseorder.SendPOEmailByPOList);
router.post("/POListForVendorBills", authenticateJWT, purchaseorder.POListForVendorBills);
router.post("/DeletePOItem", authenticateJWT, purchaseorder.DeletePOItem);
router.post("/ExportToExcel", authenticateJWT, purchaseorder.ExportToExcel);
router.post("/ReOpenPO", authenticateJWT, purchaseorder.ReOpenPO);
router.post("/UpdateMissingPartIdInPO", authenticateJWT, purchaseorder.UpdateMissingPartIdInPO);
router.get("/POListWithOutPartId", authenticateJWT, purchaseorder.POListWithOutPartId);
router.post("/CreatePOFromNormalSO", authenticateJWT, purchaseorder.CreatePOFromNormalSO);
//MRO Section
router.post("/MROAutoCreate", authenticateJWT, purchaseorder.MROAutoCreate);
router.post("/CreatePOByMRO", authenticateJWT, purchaseorder.CreatePOByMRO);
module.exports = router;
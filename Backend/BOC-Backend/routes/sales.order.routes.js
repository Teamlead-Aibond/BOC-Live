/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const multer = require('multer');
const salesOrder = require("../controllers/sales.order.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
router.post("/create", authenticateJWT, salesOrder.Create);
router.put("/update", authenticateJWT, salesOrder.update);
router.post("/autocreate", authenticateJWT, salesOrder.AutoCreate);
router.post("/getSaleListByServerSide", authenticateJWT, salesOrder.getSaleListByServerSide);
router.post("/view", authenticateJWT, salesOrder.View);
// router.post("/GetEmailContentForSalesOrder", authenticateJWT,salesOrder.GetEmailContentForSalesOrder);
router.post("/SendEmailToSalesOrderQuoteBySOList", authenticateJWT, salesOrder.SendEmailToSalesOrderQuoteBySOList);
// router.post("/SendEmailToSalesOrder", authenticateJWT,salesOrder.SendEmailToSalesOrder);
router.post("/ApproveSO", authenticateJWT, salesOrder.ApproveSO);
router.post("/CancelSO", authenticateJWT, salesOrder.CancelSO);
router.post("/delete", authenticateJWT, salesOrder.delete);
router.post("/DeleteSOItem", authenticateJWT, salesOrder.DeleteSOItem);
router.post("/ExportToExcel", authenticateJWT, salesOrder.ExportToExcel);

router.put("/UpdatePOIdToSalesOrder", authenticateJWT, salesOrder.UpdatePOIdToSalesOrder);
router.put("/UpdatePOItemIdToSalesOrder", authenticateJWT, salesOrder.UpdatePOItemIdToSalesOrder);
router.put("/UpdateSOIdToPO", authenticateJWT, salesOrder.UpdateSOIdToPO);
router.put("/UpdateSOItemIdToPO", authenticateJWT, salesOrder.UpdateSOItemIdToPO);
router.put("/UpdateNonRRAndNonMROCustomerPONoInSO", authenticateJWT, salesOrder.UpdateNonRRAndNonMROCustomerPONoInSO);

//MRO Section
router.post("/MROAutoCreate", authenticateJWT, salesOrder.MROAutoCreate);
router.post("/CreateSOByMRO", authenticateJWT, salesOrder.CreateSOByMRO);
router.post("/BlanketSOList", authenticateJWT, salesOrder.BlanketSOList);
//router.post("/SendEmailToMROSalesOrderQuoteBySOList", authenticateJWT, salesOrder.SendEmailToMROSalesOrderQuoteBySOList);

router.put("/LinkSOPO", salesOrder.LinkSOPO);
router.put("/LinkSOPOLineItem", salesOrder.LinkSOPOLineItem);
router.put("/LinkInvoiceSOLineItem", salesOrder.LinkInvoiceSOLineItem);
router.put("/LinkVendorBillPO", salesOrder.LinkVendorBillPO);

router.put("/UpdatePOLineItemPrice", authenticateJWT, salesOrder.UpdatePOLineItemPrice);
// 
router.post("/addtoexclude", authenticateJWT, salesOrder.addToExclude);
router.post("/removefromexclude", authenticateJWT, salesOrder.removeFromExclude);
// 

module.exports = router;
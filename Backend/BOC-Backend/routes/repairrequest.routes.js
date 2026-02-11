/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const RR = require("../controllers/repairrequest.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const authenticateAdminJWT = require("../middleware/jwt.authenticate.admin.js");

//router.use(authenticateJWT);
const multer = require('multer');
// const RRBatch = require('../models/rr.batch.module.js');
const RRBatch = require("../controllers/rr.batch.controller.js");
router.post("/create", authenticateJWT, RR.create);
router.post("/createFromMobApp", authenticateJWT, RR.createFromMobApp);
router.put("/update", authenticateJWT, RR.UpdateRepairRequest);
router.put("/updateStep2", authenticateJWT, RR.UpdateRepairRequestStep2);
router.put("/updateRRDepartmentWarranty", authenticateJWT, RR.updateRRDepartmentWarranty);
router.post("/UpdateRRImage", authenticateJWT, RR.UpdateRRImage);
router.post("/StatusToNeedsSourced", authenticateJWT, RR.StatusToNeedsSourced);
router.post("/AssignVendor", authenticateJWT, RR.AssignVendor);
router.put("/UpdateVendorQuote", authenticateJWT, RR.UpdateVendorQuote);
router.put("/AcceptRRVendor", authenticateJWT, RR.AcceptRRVendor);
router.put("/RejectRRVendor", authenticateJWT, RR.RejectRRVendor);
router.put("/RemoveRRVendor", authenticateJWT, RR.RemoveRRVendor);
router.put("/RRNotRepairable", authenticateJWT, RR.RRNotRepairable);
router.post("/findDuplicateOrWarranty", authenticateJWT, RR.findDuplicateOrWarranty);
router.post("/complete", authenticateJWT, RR.complete);
router.post("/view", authenticateJWT, RR.findOne);
router.post("/RRViewMobile", authenticateJWT, RR.RRViewMobile);
router.post("/delete", authenticateAdminJWT, RR.DeleteRR);
router.post("/RRDeleteBulk", authenticateAdminJWT, RR.RRDeleteBulk);
router.post("/DuplicateRepairRequest", authenticateAdminJWT, RR.DuplicateRepairRequest);
router.put("/DeleteVendorParts", authenticateJWT, RR.DeleteVendorPartsByRRVendorPartId);
router.post("/PackingSlip", authenticateJWT, RR.PackingSlip);
router.post("/loggedInStatusBarChart", authenticateJWT, RR.loggedInStatusBarChart);
router.post("/DashboardStatisticsCount", authenticateJWT, RR.DashboardStatisticsCount);
router.post("/getRushandWarrantyListOfRR", authenticateJWT, RR.getRushandWarrantyListOfRR);
router.post("/loggedInStatusByDate", authenticateJWT, RR.loggedInStatusByDate);
router.post("/ChartStatusByDate", authenticateJWT, RR.ChartStatusByDate);
router.post("/StatusReport", authenticateJWT, RR.StatusReport);
// router.post("/FailureTrendAnalysisReportBySupplier", authenticateJWT, RR.FailureTrendAnalysisReportBySupplier);
// router.post("/FailureTrendAnalysisReportByPart", authenticateJWT, RR.FailureTrendAnalysisReportByPart);
router.post("/FailureTrendAnalysisReport", authenticateJWT, RR.FailureTrendAnalysisReport);
router.post("/RepairAndSavingsReport", authenticateJWT, RR.RepairAndSavingsReport);
router.put("/UpdatePartCurrentLocation", authenticateJWT, RR.UpdatePartCurrentLocation);
router.put("/ResourceRR", authenticateJWT, RR.ResourceRR);
router.post("/RRNoAotoSuggest", authenticateJWT, RR.RRNoAotoSuggest);
router.post("/VendorPOAutoSuggest", authenticateJWT, RR.VendorPOAutoSuggest);
router.post("/CustomerPOAutoSuggest", authenticateJWT, RR.CustomerPOAutoSuggest);
router.post("/SONoAutoSuggest", authenticateJWT, RR.SONoAutoSuggest);
router.post("/CreateInventoryFromRR", authenticateJWT, RR.CreateInventoryFromRR);
// router.post("/FailedPartByStatusChart", authenticateJWT, RR.FailedPartByStatusChart);
// router.post("/CostSavingsChart", authenticateJWT, RR.CostSavingsChart);
// router.post("/TotalRepairSpendChart", authenticateJWT, RR.TotalRepairSpendChart);
router.post("/RevertRR", authenticateAdminJWT, RR.RevertRR);
router.post("/UpdateCustomerPO", authenticateJWT, RR.UpdateCustomerPO);
router.put("/UpdatePON", authenticateJWT, RR.UpdatePON);
router.post("/AHNewDashboardStatisticsCount", authenticateAdminJWT, RR.AHNewDashboardStatisticsCount);
router.post("/SearchListForBulkShipping", authenticateJWT, RR.SearchListForBulkShipping);
router.post("/BulkShipPackingSlip", authenticateJWT, RR.BulkShipPackingSlip);
router.post("/GetRRInfoAndRRShippingHistory", authenticateJWT, RR.GetRRInfoAndRRShippingHistory);
router.put("/RRMobileVerify", authenticateJWT, RR.RRMobileVerify);
router.post("/GlobalAutoSuggest", authenticateJWT, RR.GlobalAutoSuggest);
router.post("/ActiveInActiveRR", authenticateJWT, RR.ActiveInActiveRR);
// 
router.post("/UpdateRRSubStatus", authenticateJWT, RR.UpdateRRSubStatus);
router.post("/UpdateRRAssignee", authenticateJWT, RR.UpdateRRAssignee);
router.post("/UpdateRRPartsLocation", authenticateJWT, RR.UpdateRRPartsLocation);

router.post("/WorkchainBulkUpdate", authenticateJWT, RR.WorkchainBulkUpdate);
router.get("/WorkchainMyTaskChart", authenticateJWT, RR.WorkchainMyTaskChart);
router.get("/WorkchainMyTaskCount", authenticateJWT, RR.WorkchainMyTaskCount);
router.post("/create-rr-batch", authenticateJWT, RR.createBatch);

// router.post("/create", authenticateJWT, RRBatch.Create);
router.post("/rr-batch-list", authenticateJWT, RRBatch.RRBatchListByServerSide);
router.post("/getRRForLoopQR", authenticateJWT, RRBatch.getRRForLoopQR);
router.post("/unlockCustomerShipAddress", authenticateJWT, RR.unlockCustomerShipAddress);
router.post("/unlockVendorShipAddress", authenticateJWT, RR.unlockVendorShipAddress);

router.post("/getAllAutoComplete", authenticateJWT, RR.getAllAutoComplete);
router.post("/updateRFIDTagNo", authenticateJWT, RR.updateRFIDTagNo);



module.exports = router;//

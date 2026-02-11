/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const parts = require("../controllers/parts.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);

var path = require('path');
var multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/imports'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({
    storage: storage
});

router.get("/list", authenticateJWT, parts.PartsList);
router.get("/list20", authenticateJWT, parts.PartsList20);
router.post("/PartsListByServerSide", authenticateJWT, parts.PartsListByServerSide);
router.post("/PartsListStoreByServerSide", authenticateJWT, parts.PartsListStoreByServerSide);
router.post("/view", authenticateJWT, parts.GetPartsByPartId);
router.post("/PartItemInfo", authenticateJWT, parts.GetPartsByPartItemId);

router.post("/checkPartsAvailability", authenticateJWT, parts.checkPartsAvailability);
router.post("/PartsTracking", authenticateJWT, parts.Partstracking);
router.post("/PartstrackingByRFIdTagNo", authenticateJWT, parts.PartstrackingByRFIdTagNo);
router.post("/PartstrackingByRFIdTagNos", authenticateJWT, parts.PartstrackingByRFIdTagNos);
router.post("/GetPartByPartNo", authenticateJWT, parts.GetPartByPartNo);
router.post("/SearchPartByPartNo", authenticateJWT, parts.SearchPartByPartNo);
router.post("/SearchNonRepairPartByPartNo", authenticateJWT, parts.SearchNonRepairPartByPartNo);
// router.get("/create", authenticateJWT, parts.create);
router.post("/CreateInventory", authenticateJWT, parts.addNewPartInventory);
router.post("/UpdateInventory", authenticateJWT, parts.updatePartInventory);
router.post("/updatePart", authenticateJWT, parts.updatePart);
router.post("/updateShopPart", authenticateJWT, parts.updateShopPart);
router.post("/updatePartQuantity", authenticateJWT, parts.updatePartQuantity);
router.post("/addPart", authenticateJWT, parts.addPart);
router.post("/addNewPartItems", authenticateJWT, parts.addNewPartItems);
router.post("/updateNewPartItems", authenticateJWT, parts.updateNewPartItems);
router.post("/ViewPartImages", authenticateJWT, parts.ViewPartImages);
router.post("/ViewInventory", authenticateJWT, parts.GetPartByPartIdForInventory);
router.post("/CheckPartsAvailabilityByPartNo", authenticateJWT, parts.CheckPartsAvailabilityByPartNo);
router.post("/checkMROPartsAvailability", authenticateJWT, parts.checkMROPartsAvailability);
router.post("/AddRRPartsToInventory", authenticateJWT, parts.AddRRPartsToInventory);
router.post("/trackPart", authenticateJWT, parts.trackPart);
router.post("/ImportManufacturer", upload.single('file'), authenticateJWT, parts.ImportManufacturer);
router.post("/preferred_vendor/update", authenticateJWT, parts.preferredVendorUpdate);
router.get("/mobile/non-location/list", authenticateJWT, parts.nonLocationList);
router.post("/ecommerce/product", authenticateJWT, parts.ecommerceProduct);
router.post("/ecommerce/product/view", authenticateJWT, parts.ecommerceProductView);
router.post("/checkPartId", authenticateJWT, parts.checkPartId);
// router.post("/mobile/employeeid/update", authenticateJWT, parts.employeeIdUpdate);

module.exports = router;

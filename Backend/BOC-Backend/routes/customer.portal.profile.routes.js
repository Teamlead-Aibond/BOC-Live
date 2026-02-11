/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const authenticateJWT = require("../middleware/jwt.authenticate.customer.js");  
const PortalProfile = require("../controllers/customer.portal.profile.controller.js"); 

router.get("/ViewUserProfile", authenticateJWT, PortalProfile.ViewUserProfile);
router.put("/UpdateUserProfile",authenticateJWT, PortalProfile.UpdateUserProfile);

router.post("/CreateAddress",authenticateJWT, PortalProfile.createaddress);
router.put("/UpdateAddress",authenticateJWT, PortalProfile.updateaddress);
router.post("/DeleteAddress", authenticateJWT,PortalProfile.deleteaddress);
router.put("/SetPrimaryAddress",authenticateJWT,PortalProfile.setprimaryaddress);

//Department
//Asset
router.post("/CreateDepartment", authenticateJWT, PortalProfile.createdepartment);
router.put("/UpdateDepartment", authenticateJWT, PortalProfile.updatedepartment);
router.post("/DeleteDepartment", authenticateJWT, PortalProfile.deletedepartment);

router.post("/CreateAsset", authenticateJWT, PortalProfile.createasset);
router.put("/UpdateAsset", authenticateJWT, PortalProfile.updateasset);
router.post("/DeleteAsset", authenticateJWT, PortalProfile.deleteasset);

router.post("/CreateAttachment", authenticateJWT, PortalProfile.createattachment);
router.put("/UpdateAttachment", authenticateJWT, PortalProfile.updateattachment);
router.post("/DeleteAttachment", authenticateJWT, PortalProfile.deleteattachment);
module.exports = router;
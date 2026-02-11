/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const VendorauthenticateJWT = require("../middleware/jwt.authenticate.vendor.js");  
const VendorPortalProfile = require("../controllers/vendor.portal.profile.controller.js"); 

router.get("/ViewUserProfile", VendorauthenticateJWT, VendorPortalProfile.ViewUserProfile);
router.put("/UpdateUserProfile",VendorauthenticateJWT, VendorPortalProfile.UpdateUserProfile);
router.post("/CreateAddress",VendorauthenticateJWT, VendorPortalProfile.createaddress);
router.put("/UpdateAddress",VendorauthenticateJWT, VendorPortalProfile.updateaddress);
router.post("/DeleteAddress", VendorauthenticateJWT,VendorPortalProfile.deleteaddress);
router.put("/SetPrimaryAddress",VendorauthenticateJWT,VendorPortalProfile.setprimaryaddress);

router.post("/CreateContact",VendorauthenticateJWT, VendorPortalProfile.createcontact);
router.put("/UpdateContact",VendorauthenticateJWT, VendorPortalProfile.updatecontact);
router.post("/DeleteContact", VendorauthenticateJWT,VendorPortalProfile.deletecontact);

router.post("/CreateUser", VendorauthenticateJWT,  VendorPortalProfile.createuser);
router.put("/UpdateUser",VendorauthenticateJWT, VendorPortalProfile.updateuser);
router.post("/DeleteUser", VendorauthenticateJWT, VendorPortalProfile.deleteuser);

router.post("/CreateAttachment", VendorauthenticateJWT, VendorPortalProfile.createattachment);
router.put("/UpdateAttachment", VendorauthenticateJWT, VendorPortalProfile.updateattachment);
router.post("/DeleteAttachment", VendorauthenticateJWT, VendorPortalProfile.deleteattachment);
module.exports = router;
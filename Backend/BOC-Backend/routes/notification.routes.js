/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const Notification = require("../controllers/notification.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  


router.post("/getRRNotificationList", authenticateJWT,Notification.getRRNotificationList); 
router.get("/getLatest", authenticateJWT,Notification.getLatest); 

module.exports=router;
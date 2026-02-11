/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var request = require('request');
var router = express.Router();
const UPS = require("../controllers/ups.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");

router.post('/track', function(req, res, next) {
    request({
        //uri: `https://wwwcie.ups.com/track/v1/details/${req.body.inquiryNumber}`,
       
        uri: `https://onlinetools.ups.com/track/v1/details/${req.body.inquiryNumber}?locale=en_US`,
        headers: {
           'transId': req.body.transId,
           'transactionSrc': req.body.transId.transactionSrc,
           'AccessLicenseNumber': '0D90D48B4B528035',
           'Content-Type': 'application/json',
           'Accept': 'application/json'
        }
      }).pipe(res);
  });
  // UPS create and void Label
  router.post("/create", authenticateJWT,UPS.create);
  router.post("/void", authenticateJWT,UPS.void);
  router.post("/view", authenticateJWT,UPS.findOne);
  router.post("/generateLabel",UPS.generateLabel);
  router.post("/cancelLabel",UPS.cancelLabel);
  router.post("/trackLabel",UPS.trackLabel);
  router.post("/addressValidate",UPS.addressValidate);
  router.post("/bulk_create", authenticateJWT,UPS.bulkCreate);
  router.post("/bulk_address_validate", authenticateJWT,UPS.bulkAddressValidate);
  
  module.exports = router;
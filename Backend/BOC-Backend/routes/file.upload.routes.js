/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const Reqresponse = require("../helper/request.response.validation.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);
const fileUplaod = require("../config/file_upload.js");
const Constants = require("../config/constants.js");

router.post('/customerProfile', fileUplaod('customerProfile').single("file"), (req, res) => {
  var file = req.file
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }

});

router.post('/userProfile', fileUplaod('userProfile').single("file"), (req, res) => {
  var file = req.file
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }
});

router.post('/vendorProfile', fileUplaod('vendorProfile').single("file"), (req, res) => {
  var file = req.file
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }
});

router.post('/vendorAttachment', fileUplaod('vendorAttachment').array("files"), (req, res) => {
  var file = req.files
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }
});
router.post('/customerAttachment', fileUplaod('customerAttachment').array("files"), (req, res) => {
  var file = req.files
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }
});
router.post('/RRAttachment', fileUplaod('RRAttachment').single("file"), (req, res) => {
  var file = req.file
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }
});
router.post('/RRVendorAttachment', fileUplaod('RRVendorAttachment').array("files"), (req, res) => {
  var file = req.files
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }
});
router.post('/RRImage', fileUplaod('RRImage').array("files"), (req, res) => {
  var file = req.files;
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }
});

router.post('/RRNotes', fileUplaod('RRNotes').single("file"), (req, res) => {
  var file = req.file
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }
});

router.post('/vendorQuote', fileUplaod('vendorQuote').single("file"), (req, res) => {
  var file = req.file
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }
});

router.post('/PartImages', fileUplaod('PartImages').array("files"), (req, res) => {
  var file = req.files
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }
});

router.post('/RRVendorQuoteAttachment', fileUplaod('RRVendorQuoteAttachment').single("file"), (req, res) => {
  var file = req.file
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    file = repalcefilepath(file);
    Reqresponse.printResponse(res, null, file);
  }
});

function repalcefilepath(file) {
  // console.log("Uploaded JSON : " + file);
  var file1 = JSON.stringify(file);
  // console.log("Uploaded STRING : " + file1);
  //var filetemp = file1.replace(Constants.CONST_BUCKET_PATH_SUBDOMAIN, Constants.CONST_BUCKET_PATH_AWS_DOMAIN);
  var find = Constants.CONST_BUCKET_PATH_SUBDOMAIN;
  var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  var filetemp = file1.replace(new RegExp(escapedFind, 'g'), Constants.CONST_BUCKET_PATH_AWS_DOMAIN);
  filetemp = JSON.parse(filetemp);
  return filetemp;
}

module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');

var router = express.Router();
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const vendor = require("../controllers/vendor.controller.js");
const multer = require('multer');
var path = require('path');

// SET Customer Profile STORAGE
var storageProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb(null, 'public/uploads/vendor/profile');
    cb(null, path.join(__dirname, '../public/uploads/vendor/profile'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname).toLowerCase())
  }
})

var uploadProfile = multer({ storage: storageProfile });


var storageattachment = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb(null, 'public/uploads/vendor/profile');
    cb(null, path.join(__dirname, '../public/uploads/vendor/attachment'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname).toLowerCase())
  }
})

var uploadAttachment = multer({ storage: storageattachment });





router.get("/list", authenticateJWT, vendor.getAll);
router.get("/getAllActive", authenticateJWT, vendor.getAllActive);
router.post("/getAllAutoComplete", authenticateJWT, vendor.getAllAutoComplete);
router.post("/getAllAutoCompleteMRO", authenticateJWT, vendor.getAllAutoCompleteMRO);


router.post("/list", authenticateJWT, vendor.getAllWithFilter);
router.post("/create", authenticateJWT, vendor.create);

router.post("/view", authenticateJWT, vendor.findOne);

router.put("/update", authenticateJWT, vendor.update);

router.post("/delete", authenticateJWT, vendor.delete);

router.get("/getvendorcode", authenticateJWT, vendor.GetVendorCode);

router.post("/getvendorstatics", authenticateJWT, vendor.getVendorStatics);
router.post("/getvendorviewstatics", authenticateJWT, vendor.getViewStatistics);

router.post("/getVendorListByServerSide", authenticateJWT, vendor.getVendorListByServerSide);

router.post("/VendorRRListByServerSide", authenticateJWT, vendor.VendorRRListByServerSide);
router.post("/VendorPOListByServerSide", authenticateJWT, vendor.VendorPOListByServerSide);
router.get("/manufacturerList", authenticateJWT, vendor.GetManufacturerList);
router.get("/manufacturerListWithChecked", authenticateJWT, vendor.GetManufacturerListWithChecked);
router.post("/ManufacturerAutoSuggest", authenticateJWT, vendor.ManufacturerAutoSuggest);
router.get("/RevenueChartReport", authenticateJWT, vendor.RevenueChartReport);
router.post("/PreferredVendorList", authenticateJWT, vendor.PreferredVendorList);
router.post("/ExportToExcel", authenticateJWT, vendor.ExportToExcel);
//router.use(authenticateJWT);


router.post('/uploadVendorProfile', uploadProfile.single('file'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  file.uploadedpath = "uploads/vendor/profile/" + file.filename;
  res.send(file);
});



router.post('/uploadAttachment', uploadAttachment.array('files'), (req, res, next) => {
  const files = req.files
  if (!files) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(files);
});

module.exports = router;
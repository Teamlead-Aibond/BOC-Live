/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var request = require('request');
var router = express.Router();
const globalSearchController = require("../controllers/global.search.controller")
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");

router.post('/', function (req, res, next) {
    request({
        //uri: `https://wwwcie.ups.com/track/v1/details/${req.body.inquiryNumber}`,

        uri: process.env.ELASTIC_URI,
        body: req.body,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Basic ${process.env.ELASTIC_TOKEN}`,
        }
    }).pipe(res);
});

router.post("/global", globalauthenticateJWT, globalSearchController.search);


module.exports = router;
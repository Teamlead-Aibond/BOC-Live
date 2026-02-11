/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const Country = require("../controllers/country.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  
const globalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");  
//router.use(authenticateJWT);
/*var cache = require('express-redis-cache')(
    {
     host: 'redis-19948.c212.ap-south-1-1.ec2.cloud.redislabs.com', port: 19948, auth_pass: 'Uy0U0yDdeGohDo73yGksmpJl4jhbQKM5'
    } 
);
//router.use(authenticateJWT);
*/
/**
*  @swagger
*  path:
*   /api/v1.0/country/list:
*     get:
*       summary: Lists of all Country
*       tags: [Country]
*       responses:
*         "200":
*           description: The list of country.
*/
router.get("/list",globalauthenticateJWT,Country.getAll);
router.get("/listwithsymbol",globalauthenticateJWT,Country.getAllWithSymbol);
router.post("/create", authenticateJWT,Country.create);
router.post("/view", authenticateJWT,Country.findOne);
router.put("/update",authenticateJWT, Country.update);
router.post("/delete", authenticateJWT,Country.delete);
module.exports=router;
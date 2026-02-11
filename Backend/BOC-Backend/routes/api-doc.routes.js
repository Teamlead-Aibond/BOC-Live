/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const router = require('express').Router();
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

//Extended: https://swagger.io/specification/#infoObject
//https://blog.logrocket.com/documenting-your-express-api-with-swagger/
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OMS API",
      version: "1.0.0",
      description:
        "API for AH Group Order Management System",
      //license: {
      //  name: "License",
      //  url: "https://ahgroup.com/licenses/license.html",
      //},
      /*contact: {
        name: "SmartPoint",
        url: "https://smartpoint.in",
        email: "info@smartpoint.in",
      },*/
    },
    /*servers: [
      {
        url: "http://localhost:3000",
      },
    ],*/
  },
  apis: ["./routes/*.js"],
};

const swaggerDocument = swaggerJsDoc(options);
router.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument) //, {explorer: true}
);

module.exports = router;
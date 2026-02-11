/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();

const customer = require("../controllers/customers.controller.js");

/*var cache = require('express-redis-cache')(
    {
     host: 'redis-19948.c212.ap-south-1-1.ec2.cloud.redislabs.com', port: 19948, auth_pass: 'Uy0U0yDdeGohDo73yGksmpJl4jhbQKM5'
    } 
);*/


/*cache.get(function (error, entries) {
    if ( error ) throw error;
   
    entries.forEach(console.log.bind(console));
  });*/


// Create a new customer
//router.post("/create", customer.create);

// Retrieve all customers
//router.get("/list",  cache.route(),  customer.getAll);

//router.get("/list",    customer.getAll);
// Retrieve a single customer with customerid
//router.get("/get/:customer_id", customer.findOne);

module.exports = router;
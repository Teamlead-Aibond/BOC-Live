/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');

var router = express.Router();
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const customer = require("../controllers/customers.controller.js");
const multer = require('multer');
var path = require('path');

// Routes
/**
*  @swagger
*  path:
*   /api/v1.0/customers/list:
*     get:
*       summary: Lists all Customers
*       tags: [Customers]
*       responses:
*         "200":
*           description: The list of customers.
*/

/**
*  @swagger
*  path:
*   /api/v1.0/customers/create:
*     post:
*       summary: Creates a new Customer
*       tags: [Customers]
*       requestBody:
*         required: true
*       responses:
*         "200":
*           description: The created customer.
*/

/**
*  @swagger
*  path:
*   /api/v1.0/customers/view:
*     get:
*       summary: View Customer data
*       tags: [Customers]
*       requestBody:
*         required: true
*       responses:
*         "200":
*           description: The selected customer.
*/

/**
*  @swagger
*  path:
*   /api/v1.0/customers/update:
*     put:
*       summary: Modify Customer data
*       tags: [Customers]
*       requestBody:
*         required: true
*       responses:
*         "200":
*           description: The modified customer.
*/

/**
*  @swagger
*  path:
*   /api/v1.0/customers/delete:
*     delete:
*       summary: Delete Customer
*       tags: [Customers]
*       requestBody:
*         required: true
*       responses:
*         "200":
*           description: The deleted customer.
*/


/**
*  @swagger
*  path:
*   /api/v1.0/customers/uploadCustomerProfile:
*     post:
*       summary: Upload Customer Profile
*       tags: [Customers]
*       parameters:
*       - name: myFile
*         in: path
*         description: Customer Profile (file)
*         required: true
*       requestBody:
*         required: true
*       responses:
*         "200":
*           description: Upload Customer Profile.
*/



// SET Customer Profile STORAGE
var storageProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/customer/profile'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname).toLowerCase())
  }
})

var uploadProfile = multer({ storage: storageProfile });

//router.use(authenticateJWT);


router.post("/create", authenticateJWT, customer.create);
router.post("/view", authenticateJWT, customer.findOne);
router.get("/getAllActive", authenticateJWT, customer.getAllActive);
router.post("/getcustomerstatics", authenticateJWT, customer.statistics);
router.post("/getcustomerviewstatics", authenticateJWT, customer.viewStatistics);
router.put("/update", authenticateJWT, customer.update);
router.post("/delete", authenticateJWT, customer.delete);
router.get("/getcustomercode", authenticateJWT, customer.GetCustomerCode);
router.post("/getCustomerListByServerSide", authenticateJWT, customer.getCustomerListByServerSide);
router.post("/CustomerRRListByServerSide", authenticateJWT, customer.CustomerRRListByServerSide);
router.post("/CustomerSOListByServerSide", authenticateJWT, customer.CustomerSOListByServerSide);
router.post("/getAllAutoComplete", authenticateJWT, customer.getAllAutoComplete);
router.post("/ExportToExcel", authenticateJWT, customer.ExportToExcel);
router.post("/getCustomerCurrencyExchange", authenticateJWT, customer.getCustomerCurrencyExchange);
module.exports = router;



// Below are Victor sir Code
// var express = require('express');
// var router = express.Router();

// const customer = require("../controllers/customers.controller.js");

// var cache = require('express-redis-cache')(
//     {
//      host: 'redis-19948.c212.ap-south-1-1.ec2.cloud.redislabs.com', port: 19948, auth_pass: 'Uy0U0yDdeGohDo73yGksmpJl4jhbQKM5'
//     } 
// );


//  Create a new customer
// router.post("/create", customer.create);

//  Retrieve all customers
// router.get("/list", customer.getAll);

//  Retrieve a single customer with customerid
// router.get("/get/:customer_id", customer.findOne);



router.post('/uploadCustomerProfile', uploadProfile.single('file'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  file.uploadedpath = "uploads/customer/profile/" + file.filename;
  res.send(file);
});

module.exports = router;
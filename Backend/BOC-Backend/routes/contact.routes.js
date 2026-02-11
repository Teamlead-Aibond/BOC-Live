/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const contact = require("../controllers/contact.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  
//router.use(authenticateJWT);

// var cache = require('express-redis-cache')(
//     {
//      host: 'redis-19948.c212.ap-south-1-1.ec2.cloud.redislabs.com', port: 19948, auth_pass: 'Uy0U0yDdeGohDo73yGksmpJl4jhbQKM5'
//     } 
// );

/**
*  @swagger
*  path:
*   /api/v1.0/contact/list:
*     get:
*       summary: Lists of all Contacts
*       tags: [Contact]
*       responses:
*         "200":
*           description: The list of contact.
*/

/**
*  @swagger
*  path:
*   /api/v1.0/contact/create:
*     post:
*       summary: Create a new Contact
*       tags: [Contact]
*       parameters:
*       - name: ContactName
*         description: Contact name (string)
*         in: formData
*         type: string
*         required: true
*       - name: IdentityType 
*         description: IdentityType (int)
*         type: integer
*         in: formData
*         required: true
*       - name: IdentityId
*         description: IdentityId (int)
*         type: integer
*         in: formData
*         required: true
*       - name: Designation
*         description: Designation (string)
*         in: formData
*         type: string
*         required: true
*       - name: DepartmentId
*         description: Department Id (int)
*         in: formData
*         type: integer
*         required: true
*       - name: Email
*         description: Email (string)
*         in: formData
*         type: string
*         required: true
*       - name: PhoneNo
*         description: PhoneNo (string)
*         in: formData
*         type: string
*         required: true
*       - name: Fax
*         description: Fax (string)
*         in: formData
*         type: string
*         required: false
*       - name: CreatedBy
*         description: CreatedBy (int)
*         in: formData
*         type: integer
*         required: true
*       - name: IsDeleted
*         description: IsDeleted (int)
*         in: formData
*         type: integer
*         required: true
*       responses:
*         "200":
*           description: Create contact details.
*/

/**
*  @swagger
*  path:
*   /api/v1.0/contact/get:
*     get:
*       summary: View Contact data by Contactid
*       tags: [Contact]
*       requestBody:
*         required: false
*       parameters:
*       - name: ContactId
*         in: path
*         description: ContactId (int)
*         required: true
*       responses:
*         "200":
*           description: The selected contact.
*/

/**
*  @swagger
*  path:
*   /api/v1.0/contact/update:
*     put:
*       summary: Modify Contact data
*       tags: [Contact]
*       parameters:
*       - name: ContactId
*         description: Contact Id (int)
*         in: formData
*         type: integer
*         required: true
*       - name: ContactName
*         description: Contact name
*         in: formData
*         type: string
*         required: true
*       - name: IdentityType 
*         description: IdentityType (int)
*         type: integer
*         in: formData
*         required: true
*       - name: IdentityId
*         description: IdentityId (int)
*         type: integer
*         in: formData
*         required: true
*       - name: Designation
*         description: Designation (string)
*         in: formData
*         type: string
*         required: true
*       - name: DepartmentId
*         description: DepartmentId (int)
*         in: formData
*         type: integer
*         required: true
*       - name: Email
*         description: Email (string)
*         in: formData
*         type: string
*         required: true
*       - name: PhoneNo
*         description: PhoneNo (string)
*         in: formData
*         type: string
*         required: true
*       - name: Fax
*         description: Fax (string)
*         in: formData
*         type: string
*         required: false
*       - name: CreatedBy
*         description: CreatedBy (int)
*         in: formData
*         type: integer
*         required: true
*       - name: IsDeleted
*         description: IsDeleted (int)
*         in: formData
*         type: integer
*         required: true
*       requestBody:
*         required: true
*       responses:
*         "200":
*           description: The modified contact.
*/

/**
*  @swagger
*  path:
*   /api/v1.0/contact/delete:
*     delete:
*       summary: Delete Contact
*       tags: [Contact]
*       parameters:
*       - name: ContactId
*         in: path
*         description: Delete Contact details By ContactId (int)
*         required: true
*       responses:
*         "200":
*           description: The deleted contact.
*/
router.get("/list",authenticateJWT, contact.getAll);
router.post("/create",authenticateJWT, contact.create);
router.get("/get",authenticateJWT , contact.findById);
router.put("/update",authenticateJWT, contact.update);
//router.delete("/delete",contact.delete);
router.post("/delete",authenticateJWT, contact.delete);
router.put("/setprimaryaddress",authenticateJWT, contact.setprimaryaddress);
module.exports=router;
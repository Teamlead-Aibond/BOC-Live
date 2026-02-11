/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();

const languages = require("../controllers/languages.controller.js");

const authenticateJWT = require("../middleware/jwt.authenticate.js"); 

//To apply the jwt auth to all the routers
//router.use(authenticateJWT);

// Create a new Language
router.post("/create", authenticateJWT,languages.create);

// Retrieve all Language
router.get("/list", authenticateJWT,languages.findAll);

// Retrieve a single Language with language_id
router.get("/get/:language_id", authenticateJWT,languages.findOne);

// Update a Language with language_id
router.put("/update/:language_id", authenticateJWT,languages.update);

// Delete a Language with language_id
router.post("/:language_id", authenticateJWT,languages.delete);

module.exports = router;
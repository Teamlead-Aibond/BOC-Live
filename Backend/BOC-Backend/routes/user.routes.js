/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const authenticateJWTGlobal = require("../middleware/jwt.authenticate.global.js");


const user = require("../controllers/users.controller.js");

//var multer = require('multer')
//var upload = multer({ dest: './public/uploads/' });

//router.use(authenticateJWT);

router.post("/login", user.login);
router.post("/domainlogin", user.domainlogin);
router.get("/forgot-password/:Email", user.forgotPassword);

router.post("/create", authenticateJWT, user.create);
router.post("/view", authenticateJWT, user.view);
router.get("/list", authenticateJWT, user.getAll);
router.get("/getAllActiveAdmin", authenticateJWT, user.getAllActiveAdmin);
router.put("/update", authenticateJWT, user.update);
router.post("/delete", authenticateJWT, user.delete);
router.get("/getVendorUsers/:VendorId", authenticateJWT, user.getVendorUsers);
router.post("/getUserListByServerSide", authenticateJWT, user.getUserListByServerSide);
router.put("/changepassword", authenticateJWT, user.changePassword);
router.put("/changePasswordByAdmin", authenticateJWT, user.changePasswordByAdmin);
router.post("/sendEmail", user.sendEmail);
router.post("/UserListWithFilter", authenticateJWT, user.UserListWithFilter);
router.get("/GetUserInfoFromToken", authenticateJWTGlobal, user.GetUserInfoFromToken);
router.post("/changelocation", authenticateJWT, user.changeLocation);
router.post("/setasprimary", authenticateJWT, user.setAsPrimary);
module.exports = router;
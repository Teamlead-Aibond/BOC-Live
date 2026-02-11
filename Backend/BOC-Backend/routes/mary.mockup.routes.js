/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const MaryGoldController = require("../controllers/mary.mockup.controller.js");

router.post("/CategoryStatistics", MaryGoldController.CategoryStatistics);
router.post("/SubCategoryStatistics", MaryGoldController.SubCategoryStatistics);

router.get("/CategoryList", MaryGoldController.CategoryList);
router.get("/SubCategoryList", MaryGoldController.SubCategoryList);
router.get("/CustomerList", MaryGoldController.CustomerList);
router.get("/ExpenseList", MaryGoldController.ExpenseList);

module.exports = router;
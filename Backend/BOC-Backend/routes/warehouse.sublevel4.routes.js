/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const WarehouseSubLevel4 = require("../controllers/warehouse.sublevel4.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  

router.get("/list",authenticateJWT, WarehouseSubLevel4.getAll);
router.post("/create",authenticateJWT, WarehouseSubLevel4.create);
router.post("/view",authenticateJWT , WarehouseSubLevel4.findById);
router.post("/ListByWarehouse",authenticateJWT , WarehouseSubLevel4.ListByWarehouse);
router.put("/update",authenticateJWT, WarehouseSubLevel4.update);
router.post("/delete",authenticateJWT, WarehouseSubLevel4.delete);

module.exports=router;
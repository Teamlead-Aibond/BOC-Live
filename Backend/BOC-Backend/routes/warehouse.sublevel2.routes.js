/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const WarehouseSubLevel2 = require("../controllers/warehouse.sublevel2.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  

router.get("/list",authenticateJWT, WarehouseSubLevel2.getAll);
router.post("/create",authenticateJWT, WarehouseSubLevel2.create);
router.post("/view",authenticateJWT , WarehouseSubLevel2.findById);
router.post("/ListByWarehouse",authenticateJWT , WarehouseSubLevel2.ListByWarehouse);
router.put("/update",authenticateJWT, WarehouseSubLevel2.update);
router.post("/delete",authenticateJWT, WarehouseSubLevel2.delete);

module.exports=router;
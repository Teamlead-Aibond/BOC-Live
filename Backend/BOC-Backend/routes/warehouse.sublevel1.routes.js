/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const WarehouseSubLevel1 = require("../controllers/warehouse.sublevel1.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  

router.get("/list",authenticateJWT, WarehouseSubLevel1.getAll);
router.post("/create",authenticateJWT, WarehouseSubLevel1.create);
router.post("/view",authenticateJWT , WarehouseSubLevel1.findById);
router.post("/ListByWarehouse",authenticateJWT , WarehouseSubLevel1.ListByWarehouse);
router.put("/update",authenticateJWT, WarehouseSubLevel1.update);
router.post("/delete",authenticateJWT, WarehouseSubLevel1.delete);

module.exports=router;
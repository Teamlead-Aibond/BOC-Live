/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const WarehouseSubLevel3 = require("../controllers/warehouse.sublevel3.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");  

router.get("/list",authenticateJWT, WarehouseSubLevel3.getAll);
router.post("/create",authenticateJWT, WarehouseSubLevel3.create);
router.post("/view",authenticateJWT , WarehouseSubLevel3.findById);
router.post("/ListByWarehouse",authenticateJWT , WarehouseSubLevel3.ListByWarehouse);
router.post("/ListByRoom",authenticateJWT , WarehouseSubLevel3.ListBySub2);
router.put("/update",authenticateJWT, WarehouseSubLevel3.update);
router.post("/delete",authenticateJWT, WarehouseSubLevel3.delete);

module.exports=router;
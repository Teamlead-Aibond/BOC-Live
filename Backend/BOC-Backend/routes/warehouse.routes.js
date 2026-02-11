/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const warehouse = require("../controllers/warehouse.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);

/*var cache = require('express-redis-cache')(
    {
     host: 'redis-19948.c212.ap-south-1-1.ec2.cloud.redislabs.com', port: 19948, auth_pass: 'Uy0U0yDdeGohDo73yGksmpJl4jhbQKM5'
    } 
);*/


/**
*  @swagger
*  path:
*   /api/v1.0/warehouse/list:
*     get:
*       summary: Lists of all WareHouse
*       tags: [WareHouse]
*       responses:
*         "200":
*           description: The list of all WareHouse.
*/


/**
*  @swagger
*  path:
*   /api/v1.0/warehouse/create:
*     post:
*       summary: Create WareHouse
*       tags: [WareHouse]
*       requestBody:
*         required: false
*       parameters:
*       - name: WarehouseName
*         in: path
*         description: WarehouseName (string)
*         required: true
*       - name: CreatedBy
*         in: path
*         description: CreatedBy (int)
*         required: true
*       - name: Status
*         in: path
*         description: Status (int)
*         required: true
*       - name: IsDeleted
*         in: path
*         description: IsDeleted (int)
*         required: true
*       responses:
*         "200":
*           description: Create WareHouse.
*/

/**
*  @swagger
*  path:
*   /api/v1.0/warehouse/get:
*     get:
*       summary: View Warehouse data
*       tags: [WareHouse]
*       parameters:
*       - name: WarehouseId
*         in: path
*         description: WarehouseId (int)
*         required: false
*       responses:
*         "200":
*           description: The selected Warehouse.
*/

/**
*  @swagger
*  path:
*   /api/v1.0/warehouse/update:
*     put:
*       summary: Modify Warehouse data
*       tags: [WareHouse]
*       requestBody:
*         required: true
*       parameters:
*       - name: WarehouseId
*         in: path
*         description: WarehouseId (int)
*         required: true
*       - name: WarehouseName
*         in: path
*         description: WarehouseName (string)
*         required: true
*       - name: CreatedBy
*         in: path
*         description: CreatedBy (int)
*         required: true
*       - name: Status
*         in: path
*         description: Status (int)
*         required: true
*       - name: IsDeleted
*         in: path
*         description: IsDeleted (int)
*         required: true
*       responses:
*         "200":
*           description: The modified warehouse.
*/

/**
*  @swagger
*  path:
*   /api/v1.0/warehouse/delete:
*     delete:
*       summary: Delete Warehouse
*       tags: [WareHouse]
*       parameters:
*       - name: WarehouseId
*         in: path
*         description: WarehouseId (int)
*         required: true
*       responses:
*         "200":
*           description: The deleted warehouse.
*/

router.post("/create", authenticateJWT, warehouse.create);
router.get("/list", authenticateJWT, warehouse.getAll);
router.post("/view", authenticateJWT, warehouse.findOne);
router.put("/update", authenticateJWT, warehouse.update);
router.post("/delete", authenticateJWT, warehouse.delete);
router.post("/GetWareHouseByUserId", authenticateJWT, warehouse.GetWareHouseByUserId);

module.exports = router;
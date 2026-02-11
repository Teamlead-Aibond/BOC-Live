/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const ecommerce = require("../controllers/ecommerce.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
//router.use(authenticateJWT);

router.post("/product/addToCart", authenticateJWT, ecommerce.addToCart);
router.post("/product/removeFromCart", authenticateJWT, ecommerce.removeFromCart);
router.post("/product/cartCount", authenticateJWT, ecommerce.cartCount);
router.post("/product/getCart", authenticateJWT, ecommerce.getCart);
router.post("/product/changeCartCount", authenticateJWT, ecommerce.increaseCartCount);

router.post("/order/create", authenticateJWT, ecommerce.OrderCreate);
router.post("/order/list", authenticateJWT, ecommerce.OrderList);
router.post("/order/listClient", authenticateJWT, ecommerce.OrderListClient);
router.post("/order/view", authenticateJWT, ecommerce.orderView);

router.get("/testmail", ecommerce.testMail);

module.exports = router;

/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
var express = require('express');
var router = express.Router();
const state = require("../controllers/state.controller.js");
const authenticateJWT = require("../middleware/jwt.authenticate.js");
const GlobalauthenticateJWT = require("../middleware/jwt.authenticate.global.js");
//router.use(authenticateJWT);

/**
*  @swagger
*  path:
*   /api/v1.0/state/list:
*     get:
*       summary: Lists of all States
*       tags: [State]
*       requestBody:
*         required: false
*       parameters:
*       - name: CountryId
*         in: path
*         description: CountryId (int)
*         required: true
*       responses:
*         "200":
*           description: The list of all states by country id.
*/
router.get("/list/:CountryId", GlobalauthenticateJWT, state.getStateByCountryId);

router.post("/create", authenticateJWT, state.create);
router.get("/list", GlobalauthenticateJWT, state.getAll);
router.post("/view", authenticateJWT, state.findOne);
router.put("/update", authenticateJWT, state.update);
router.post("/delete", authenticateJWT, state.delete);
router.post("/dbupdate", authenticateJWT, state.dbupdate);
module.exports = router;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    var MAINTENANCE_MODE = process.env.MAINTENANCE_MODE;
    var MAINTENANCE_MODE_USER = process.env.MAINTENANCE_MODE_USER;
    if (MAINTENANCE_MODE_USER) {
        allowedUserInMaintenance = MAINTENANCE_MODE_USER.split(",");
    }
    //console.log("authHeader = "+authHeader);
    if (authHeader) {
        var token = authHeader.split(' ')[1];
        if (!token) {
            token = authHeader;
        }
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send({
                    status: false,
                    statusAuth: 0,
                    message: "Token is not valid!"
                });
            }
            if (!(user.ProjectIdentifier && user.ProjectIdentifier == process.env.PROJECT_TOKEN_IDENTIFIER_NAME)) {
                return res.status(403).send({
                    status: false,
                    statusAuth: 0,
                    message: "Token is not expired. Login to generate the new Token!"
                });
            }
            //console.log("IdentityType=" + user.IdentityType)
            if (user.IdentityType != 1) {
                return res.status(403).send({
                    status: false,
                    statusAuth: 0,
                    message: "Customer Token is not valid!"
                });
            }
            var isContained = allowedUserInMaintenance.some(function (v) { return v === user.UserName });
            if(MAINTENANCE_MODE == 1 && !isContained){
                return res.status(403).send({
                    status: false,
                    statusAuth: 0,
                    message: "Application is under maintenance!. We will be back shortly."
                });
            }
            global.authuser = user;
            req.body.authuser = user;
            // console.log("user=" + user)
            next();
        });
    } else {
        res.status(401).send({
            status: false,
            statusAuth: 0,
            message: "Unauthorized"
        });
    }
};

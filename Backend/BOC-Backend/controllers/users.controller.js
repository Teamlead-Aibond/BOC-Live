/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

const UsersModel = require("../models/users.model.js");
const ReqRes = require("../helper/request.response.validation.js");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType } = require("../helper/common.function.js");
const UserLoginLogModel = require("../models/users.login.log.model.js");
// To Create User
exports.create = (req, res) => {
  var validReq = ReqRes.validateReqBody(req, res);
  if (validReq) {
    UsersModel.IsExistUserName(req.body.UserList[0].Username, 0, (err, data1) => {
      if (data1.length == 0) {
        UsersModel.create(req.body, (err, data) => {
          ReqRes.printResponse(res, err, data);
        });
      }
      else {
        ReqRes.printResponse(res, { msg: "Username is aleady exist" }, null);
      }
    });
  }
};

exports.GetUserInfoFromToken = (req, res) => {
  var UserId = getLogInUserId(req.body);
  UsersModel.loginbyToken(UserId, (err, data) => {
    ReqRes.printResponse(res, err, data);
  });
};

// To login
exports.login = (req, res) => {
  var validReq = ReqRes.validateReqBody(req, res);
  var loc = req.body.location ? req.body.location : 0;
  if (validReq) {
    if (req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password')) {
      UsersModel.checkLocationUpdate(req.body.username, req.body.password, '', loc, (e, r) => {
        if (r.status) {
          UsersModel.login(req.body.username, req.body.password, '', loc, (err, data) => {
            ReqRes.printResponse(res, err, data);
          });
        }
      });
    } else {
      ReqRes.printResponse(res, { msg: "user name or Password is required" }, null);
    }
  }
};

exports.domainlogin = (req, res) => {
  var validReq = ReqRes.validateReqBody(req, res);
  var loc = req.body.location ? req.body.location : 0;
  if (validReq) {
    if (req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password')) {
      if (process.env.MAINTENANCE_MODE == 1) {
        var allowedUserInMaintenance = [];
        if (process.env.MAINTENANCE_MODE_USER) {
          allowedUserInMaintenance = process.env.MAINTENANCE_MODE_USER.split(",");
        }
        var isContained = allowedUserInMaintenance.some(function (v) { return v === req.body.username });
        //console.log(process.env.MAINTENANCE_MODE);
        //console.log(allowedUserInMaintenance);
        //console.log(req.body.username)
        //console.log(isContained);
        if (isContained) {
          var domainId = req.body.domainId ? req.body.domainId : 0;
          const UserLog = new UserLoginLogModel({
            Username: req.body.username,
            LoginDomain: domainId,
            IPAddress: req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress || '',
            // IPAddress: '',
            IsLoginSuccess: 0
          });
          UsersModel.checkLocationUpdate(req.body.username, req.body.password, 'domain', loc, (e, r) => {
            if (r.status) {
              UsersModel.login(req.body.username, req.body.password, 'domain', loc, (err, data) => {
                if (data) {
                  UserLog.IsLoginSuccess = 1;
                  UserLog.UserId = (data.login && data.login.UserId) ? data.login.UserId : 0;
                }
                UserLoginLogModel.create(UserLog, (errlog, datalog) => {
                  ReqRes.printResponse(res, err, data);
                });
              });
            }
          });
        } else {
          ReqRes.printResponse(res, { msg: "Application is under maintenance!. We will be back shortly" }, null);
        }

      } else {
        var domainId = req.body.domainId ? req.body.domainId : 0;
        const UserLog = new UserLoginLogModel({
          Username: req.body.username,
          LoginDomain: domainId,
          IPAddress: req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress || '',
          // IPAddress: '',
          IsLoginSuccess: 0
        });
        UsersModel.checkLocationUpdate(req.body.username, req.body.password, 'domain', loc, (e, r) => {
          if (r.status) {
            UsersModel.login(req.body.username, req.body.password, 'domain', loc, (err, data) => {
              if (data) {
                UserLog.IsLoginSuccess = 1;
                UserLog.UserId = (data.login && data.login.UserId) ? data.login.UserId : 0;
              }
              UserLoginLogModel.create(UserLog, (errlog, datalog) => {
                ReqRes.printResponse(res, err, data);
              });
            });
          }
        });

      }
    } else {
      ReqRes.printResponse(res, { msg: "user name or Password is required" }, null);
    }
  }
};


// To view
exports.view = (req, res) => {
  var validReq = ReqRes.validateReqBody(req, res);
  if (validReq) {
    if (req.body.hasOwnProperty('UserId')) {
      UsersModel.findById(req.body.UserId, (err, data) => {
        ReqRes.printResponse(res, err, data);
      });
    } else {
      ReqRes.printResponse(res, { msg: "User Id is required" }, null);
    }
  }
};

// To forgotPassword
exports.forgotPassword = (req, res) => {
  var validReq = ReqRes.validateReqParams(req, res);
  if (validReq) {
    if (req.body.hasOwnProperty('Email')) {
      UsersModel.forgotPassword(req.params.Email, (err, data) => {
        ReqRes.printResponse(res, err, data);
      });
    } else {
      ReqRes.printResponse(res, { msg: "Email is required" }, null);
    }
  }
};

// Retrieve all vendor users from the database.
exports.getVendorUsers = (req, res) => {
  if (req.body.hasOwnProperty('IdentityId')) {
    UsersModel.getVendorUsers(req.params.IdentityId, (err, data) => {
      ReqRes.printResponse(res, err, data);
    });
  } else {
    ReqRes.printResponse(res, { msg: "Identity Id is required" }, null);
  }
};

// Retrieve all users
exports.getAll = (req, res) => {
  UsersModel.getAll(req.body, (err, data) => {
    ReqRes.printResponse(res, err, data);
  });
};

// UserList With Filter
exports.UserListWithFilter = (req, res) => {
  UsersModel.UserListWithFilter(req.body, (err, data) => {
    ReqRes.printResponse(res, err, data);
  });
};

// Retrieve all users
exports.getAllActiveAdmin = (req, res) => {
  UsersModel.getAllActiveAdmin(req, (err, data) => {
    ReqRes.printResponse(res, err, data);
  });
};

// To Update User
exports.update = (req, res) => {
  var boolean = ReqRes.validateReqBody(req, res);
  if (boolean) {
    UsersModel.IsExistUserName(req.body.UserList[0].Username, req.body.UserList[0].UserId, (err, data1) => {
      if (data1.length == 0) {
        UsersModel.updateByIdForAdmin(req.body, (err, data) => {
          ReqRes.printResponse(res, err, data);
        });
      }
      else {
        ReqRes.printResponse(res, { msg: "Username is aleady exist" }, null);
      }
    });
  }
};
// To set As Primary
exports.setAsPrimary = (req, res) => {
  var boolean = ReqRes.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('IdentityId') && req.body.hasOwnProperty('UserId')) {
      UsersModel.setAsPrimary(req.body, (err, data) => {
        ReqRes.printResponse(res, err, data);
      });
    } else {
      ReqRes.printResponse(res, { msg: "User/Identity Id is required" }, null);
    }
  }
};
// To changePassword
exports.changePassword = (req, res) => {
  var boolean = ReqRes.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('UserId') && req.body.hasOwnProperty('CurrentPassword') && req.body.hasOwnProperty('NewPassword')) {
      UsersModel.changePassword(req.body.UserId, req.body.CurrentPassword, req.body.NewPassword, (err, data) => {
        ReqRes.printResponse(res, err, data);
      });
    } else {
      ReqRes.printResponse(res, { msg: "User Id, Current Password and New Password is required" }, null);
    }
  }

};

// To changePassword
exports.changePasswordByAdmin = (req, res) => {
  var boolean = ReqRes.validateReqBody(req, res);
  if (boolean) {
    if (req.body.hasOwnProperty('UserId') && req.body.hasOwnProperty('NewPassword')) {
      UsersModel.changePasswordByAdmin(req.body.UserId, req.body.NewPassword, (err, data) => {
        ReqRes.printResponse(res, err, data);
      });
    } else {
      ReqRes.printResponse(res, { msg: "User Id and New Password is required" }, null);
    }
  }

};

// To Delete
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('UserId')) {
    UsersModel.remove(req.body.UserId, (err, data) => {
      ReqRes.printResponse(res, err, data);
    });
  } else {
    ReqRes.printResponse(res, { msg: "User Id is required" }, null);
  }
};

// Get server side list
exports.getUserListByServerSide = (req, res) => {
  UsersModel.getUserListByServerSide(new UsersModel(req.body), (err, data) => {
    ReqRes.printResponse(res, err, data);
  });
};

// To send Email
exports.sendEmail = (req, res) => {
  var MailConfig = require('../config/email.config');
  var hbs = require('nodemailer-express-handlebars');
  var GmailTransport = MailConfig.GmailTransport;

  //MailConfig.ViewOption(gmailTransport,hbs);
  const mailOptions = {
    from: 'info@ahgroup.com',
    to: 'sivaguru@smartpoint.in',
    subject: 'TEst',
    text: 'TEst email.'
  };
  GmailTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      // console.log(error);
      ReqRes.printResponse(res, { msg: error }, null);
    }
    // console.log("email is send");
    // console.log(info);
    ReqRes.printResponse(res, err, info);
  });
};

exports.changeLocation = (req, res) => {
  UsersModel.changeLocation(req.body, (err, data) => {
    ReqRes.printResponse(res, err, data);
  });
};



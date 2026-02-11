/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

var async = require('async');
const con = require("../helper/db.js");
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const Constants = require("../config/constants.js");
var cDateTime = require("../utils/generic.js");
var MailConfig = require('../config/email.config');
var hbs = require('nodemailer-express-handlebars');
const { escapeSqlValues } = require("../helper/common.function.js");
const RolePermissionModel = require("../models/role.permission.model.js");
const UserPermissionModel = require("../models/user.permission.model.js");
const CountryModel = require('./country.model.js');

var gmailTransport = MailConfig.GmailTransport;


const UsersModel = function (objUser) {

  this.IdentityType = objUser.IdentityType ? objUser.IdentityType : 0;
  this.IdentityId = objUser.IdentityId ? objUser.IdentityId : 0;
  this.MultipleAccessIdentityIds = objUser.MultipleAccessIdentityIds ? objUser.MultipleAccessIdentityIds : '';
  this.Title = objUser.Title ? objUser.Title : 1;
  this.FirstName = objUser.FirstName ? objUser.FirstName : '';
  this.LastName = objUser.LastName ? objUser.LastName : '';
  this.Address1 = objUser.Address1 ? objUser.Address1 : '';
  this.Address2 = objUser.Address2 ? objUser.Address2 : '';
  this.City = objUser.City ? objUser.City : '';
  this.StateId = objUser.StateId ? objUser.StateId : 0;
  this.CountryId = objUser.CountryId ? objUser.CountryId : 0;
  this.Zip = objUser.Zip ? objUser.Zip : '';
  this.Email = objUser.Email ? objUser.Email : '';
  this.PhoneNo = objUser.PhoneNo ? objUser.PhoneNo : '';
  this.Fax = objUser.Fax ? objUser.Fax : '';
  this.DepartmentId = objUser.DepartmentId ? objUser.DepartmentId : 0;
  this.EmployeeId = objUser.EmployeeId ? objUser.EmployeeId : 0;
  this.Username = objUser.Username ? objUser.Username : '';
  this.Password = objUser.Password ? objUser.Password : '';
  this.IsRestrictedCustomerAccess = objUser.IsRestrictedCustomerAccess ? objUser.IsRestrictedCustomerAccess : 0;
  this.MultipleCustomerIds = objUser.MultipleCustomerIds ? objUser.MultipleCustomerIds : '';
  this.ProfilePhoto = objUser.ProfilePhoto ? objUser.ProfilePhoto : '';
  this.Status = objUser.Status ? objUser.Status : 0;
  this.UserId = objUser.UserId ? objUser.UserId : '';
  this.IsRestrictExportReports = objUser.IsRestrictExportReports ? objUser.IsRestrictExportReports : 0
  this.UserList = objUser.UserList;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objUser.authuser && objUser.authuser.UserId) ? objUser.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objUser.authuser && objUser.authuser.UserId) ? objUser.authuser.UserId : TokenUserId;


  this.start = objUser.start;
  this.length = objUser.length;
  this.search = objUser.search;
  this.sortCol = objUser.sortCol;
  this.sortDir = objUser.sortDir;
  this.sortColName = objUser.sortColName;
  this.order = objUser.order;
  this.columns = objUser.columns;
  this.draw = objUser.draw;
  this.RoleId = objUser.RoleId ? objUser.RoleId : 0;
  this.Location = objUser.Location ? objUser.Location : 0;
  this.IsDisplayBaseCurrencyValue = objUser.IsDisplayBaseCurrencyValue ? objUser.IsDisplayBaseCurrencyValue : 0;
  this.IsUserUPSEnable = objUser.IsUserUPSEnable ? objUser.IsUserUPSEnable : 0;
  this.CurrencyCode = objUser.CurrencyCode ? objUser.CurrencyCode : '';
  this.WarehouseIds = objUser.WarehouseIds;

  this.DefaultLocation = objUser.DefaultLocation ? objUser.DefaultLocation : 0;
  this.DefaultCurrencyCode = objUser.DefaultCurrencyCode ? objUser.DefaultCurrencyCode : '';
  this.AllowLocations = objUser.AllowLocations ? objUser.AllowLocations : '';

};
// To Create
UsersModel.create = (objUser, result) => {

  var sql = ``;
  var sql = `insert into tbl_users(IdentityType,IdentityId,MultipleAccessIdentityIds,Title,FirstName,
    LastName,Address1,Address2,City,StateId,CountryId,Zip,Email,PhoneNo,Fax,DepartmentId,EmployeeId,
    Username,Password,IsRestrictedCustomerAccess,MultipleCustomerIds,
    ProfilePhoto,Status,Created,CreatedBy,RoleId,WarehouseIds,Location,CurrencyCode,IsDisplayBaseCurrencyValue,IsUserUPSEnable,DefaultLocation,DefaultCurrencyCode,AllowLocations,IsRestrictExportReports) values`;
  for (let val of objUser.UserList) {
    val = escapeSqlValues(val);
    let obj = new UsersModel(val, objUser);

    sql = sql + `(
    '${obj.IdentityType}','${objUser.IdentityId}','${obj.MultipleAccessIdentityIds}','${obj.Title}','${obj.FirstName}',
    '${obj.LastName}','${obj.Address1}','${obj.Address2}','${obj.City}',
    '${obj.StateId}','${obj.CountryId}','${obj.Zip}','${obj.Email}',
    '${obj.PhoneNo}','${obj.Fax}','${obj.DepartmentId}','${obj.EmployeeId}',
    '${obj.Username}','${md5(obj.Password)}','${obj.IsRestrictedCustomerAccess}','${obj.MultipleCustomerIds}',
    '${obj.ProfilePhoto}','${obj.Status}','${obj.Created}','${obj.CreatedBy}','${obj.RoleId}', '${obj.WarehouseIds}', 
    '${obj.DefaultLocation}', '${obj.DefaultCurrencyCode}', '${obj.IsDisplayBaseCurrencyValue}','${obj.IsUserUPSEnable}',
    '${obj.DefaultLocation}', '${obj.DefaultCurrencyCode}', '${obj.AllowLocations}', '${obj.IsRestrictExportReports}'  
  ),`;
  }

  var Query = sql.slice(0, -1);
  //console.log("Query=" + Query)
  con.query(Query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    result(null, { id: res.insertId, ...objUser });
  });
};
// To IsExistUserName
UsersModel.IsExistUserName = (Username, UserId, result) => {
  var sql = `Select UserId,IdentityId from tbl_users   
  where IsDeleted=0 and Username='${Username}' `;
  if (UserId > 0) {
    sql += ` and UserId<>${UserId}`;
  }
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
// To Create User When Add Customer And Vendor
UsersModel.CreateUserWhenAddCustomerAndVendor = (IdentityType, IdentityId, obj, result) => {
  obj = escapeSqlValues(obj);
  var sql = `insert into tbl_users(IdentityType,IdentityId,MultipleAccessIdentityIds,IsPrimay,Title,FirstName,
  LastName,Address1,Address2,City,
  StateId,CountryId,Zip,Email,
  PhoneNo,Fax,DepartmentId,EmployeeId,
  Username,Password,ProfilePhoto,Status,DefaultLocation,DefaultCurrencyCode,AllowLocations,Location,CurrencyCode,
  Created,CreatedBy,IsRestrictExportReports) values(
  '${IdentityType}','${IdentityId}','${obj.MultipleAccessIdentityIds}','1','1',
  '${obj.FirstName}','${obj.LastName}','${obj.Address1}',
  '${obj.Address2}','${obj.City}','${obj.StateId}',
  '${obj.CountryId}','${obj.Zip}','${obj.Email}',
  '${obj.PhoneNo}','${obj.Fax}','${obj.DepartmentId}',
  '${obj.EmployeeId}','${obj.Username}','${md5(obj.Password)}',
  '${obj.ProfilePhoto}','${obj.Status}','${obj.DefaultLocation}','${obj.DefaultCurrencyCode}','${obj.AllowLocations}','${obj.DefaultLocation}','${obj.DefaultCurrencyCode}',
  '${obj.Created}','${obj.CreatedBy}', '${obj.IsRestrictExportReports}') `;
  //console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    result(null, { id: res.insertId, ...obj });
  });
};



UsersModel.loginbyToken = (userId, result) => {
  var query = `SELECT u.FirstName,u.LastName, u.UserId,u.Username,u.Email,REPLACE(u.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto,
  REPLACE(c.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as CustomerLogo,v.ProfilePhoto as VendorLogo,u.IdentityType,u.IdentityId,u.IsPrimay
  ,u.IsSuperAdmin,RoleId,u.MultipleAccessIdentityIds,IsRestrictedCustomerAccess,MultipleCustomerIds,u.Location,u.CurrencyCode,u.IsDisplayBaseCurrencyValue,u.IsUserUPSEnable,CUR.CurrencySymbol,SETT.DefaultCurrency,
  u.DefaultLocation,u.DefaultCurrencyCode,u.AllowLocations,CURD.CurrencySymbol as DefaultCurrencySymbol,CONL.CountryName as LocationCountryName,CON.CountryName as DefaultCountryName,CON.CountryCode as DefaultCountryCode,u.IsRestrictExportReports
  FROM tbl_users u
  LEFT JOIN tbl_customers c on c.CustomerId=u.IdentityId and u.IdentityType=1
  LEFT JOIN tbl_vendors v on v.VendorId=u.IdentityId and u.IdentityType=2 
  LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = SETT.DefaultCurrency AND CUR.IsDeleted = 0  
  LEFT JOIN tbl_currencies as CURD  ON CURD.CurrencyCode = u.DefaultCurrencyCode AND CURD.IsDeleted = 0  
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = u.DefaultLocation AND CON.IsDeleted = 0 
  LEFT JOIN tbl_countries as CONL  ON CONL.CountryId = u.Location AND CONL.IsDeleted = 0   
  WHERE u.IsDeleted = 0 AND u.Status = 1 AND u.UserId = '${userId}' `;

  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.length) {
      const accessToken = jwt.sign({
        ProjectIdentifier: process.env.PROJECT_TOKEN_IDENTIFIER_NAME, Email: res[0].Email, IdentityType: res[0].IdentityType, IdentityId: res[0].IdentityId, MultipleAccessIdentityIds: res[0].MultipleAccessIdentityIds, IsRestrictedCustomerAccess: res[0].IsRestrictedCustomerAccess, MultipleCustomerIds: res[0].MultipleCustomerIds,
        DefaultCurrency: res[0].DefaultCurrency, CurrencySymbol: res[0].CurrencySymbol, CurrencyCode: res[0].CurrencyCode, Location: res[0].Location, IsDisplayBaseCurrencyValue: res[0].IsDisplayBaseCurrencyValue, IsUserUPSEnable: res[0].IsUserUPSEnable, UserId: res[0].UserId, FirstName: res[0].FirstName, LastName: res[0].LastName, FullName: res[0].FirstName + ' ' + res[0].LastName, UserName: res[0].Username

      }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES
      });
      res[0].accessToken = accessToken;
      var querydd = `select CountryId,CountryCode,CountryName,VatTaxPercentage,CurrencyCode from tbl_countries WHERE CountryId IN (${res[0].AllowLocations}) AND status=1`;
      con.query(querydd, (errdd, resdd) => {
        res[0].AllowLocationsDropdown = resdd;

        UserPermissionModel.IsExistPermissonForUserId(res[0].UserId, (err, data1) => {
          if (err) { return result(err, null); }
          if (data1.length > 0) {
            var sql = UserPermissionModel.GetUserPermissionByUserId(res[0].UserId);
            con.query(sql, (err, UserPermission) => {
              if (err) { return result(err, null); }
              return result(null, { login: res[0], permission: UserPermission });
            })
          } else {
            var sql = RolePermissionModel.GetRolePermissionByUserIdQuery(res[0].UserId);
            con.query(sql, (err, RolePermission) => {
              if (err) { return result(err, null); }
              return result(null, { login: res[0], permission: RolePermission });
            })
          }
        });
      });
    } else {
      return result({ msg: "User is not valid" }, null);
    }
  });
};

UsersModel.checkLocationUpdate = (username, password, domain, location = 0, result) => {
  var password = md5(password);
  var queryForCheck = `Select Location, UserId from tbl_users WHERE IsDeleted = 0 AND Status = 1 AND username = '${username}' AND password = '${password}'`;
  //console.log("queryForCheck", queryForCheck);
  con.query(queryForCheck, (errQFC, resQFC) => {
    //console.log("resQFC", resQFC[0]);
    var loc = resQFC.length > 0 && resQFC[0].Location ? resQFC[0].Location : 0;
    var UserId = resQFC.length > 0 && resQFC[0].UserId ? resQFC[0].UserId : 0;
    if (location != 0 && location != loc) {
      CountryModel.findById(location, (errl, resl) => {
        var updateUserLocation = `UPDATE tbl_users SET Location=?,CurrencyCode=? WHERE UserId = ?`
        // let obj = new UsersModel(resl);
        // console.log("resl", resl)
        var valuesForUserUpdate = [
          resl.CountryId, resl.CurrencyCode, UserId
        ]
        //console.log(updateUserLocation, valuesForUserUpdate)
        con.query(updateUserLocation, valuesForUserUpdate, function (errU, resultU) {
          return result(errU, { status: true });
        });
      })
    } else {
      return result(errQFC, { status: true });
    }

  })
}


// To login
UsersModel.login = (username, password, domain, location = 0, result) => {
  var password = md5(password);
  if (domain == "domain") {
    var expiresIn = process.env.JWT_ACCESS_EXPIRES_DOMAIN_LOGIN
  } else {
    var expiresIn = process.env.JWT_ACCESS_EXPIRES
  }

  //var query = `CALL LoginCheckProcedure('${username}','${password}');`;

  var query = `SELECT u.FirstName,u.LastName, u.UserId,u.Email,u.Username,REPLACE(u.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto,
  REPLACE(c.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as CustomerLogo,  
  REPLACE(v.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}')  as VendorLogo,u.IdentityType,u.IdentityId,u.IsPrimay
  ,u.IsSuperAdmin,RoleId,u.MultipleAccessIdentityIds,IsRestrictedCustomerAccess,MultipleCustomerIds,u.Location,u.CurrencyCode,u.IsDisplayBaseCurrencyValue,u.IsUserUPSEnable,CUR.CurrencySymbol,SETT.DefaultCurrency,
  u.DefaultLocation,u.DefaultCurrencyCode,u.AllowLocations,CURD.CurrencySymbol as DefaultCurrencySymbol,CONL.CountryName as LocationCountryName,CON.CountryName as DefaultCountryName,CON.CountryCode as DefaultCountryCode,u.IsRestrictExportReports
  FROM tbl_users u
  LEFT JOIN tbl_customers c on c.CustomerId=u.IdentityId and u.IdentityType=1
  LEFT JOIN tbl_vendors v on v.VendorId=u.IdentityId and u.IdentityType=2 
  LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = SETT.DefaultCurrency AND CUR.IsDeleted = 0  
  LEFT JOIN tbl_currencies as CURD  ON CURD.CurrencyCode = u.DefaultCurrencyCode AND CURD.IsDeleted = 0  
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = u.DefaultLocation AND CON.IsDeleted = 0  
  LEFT JOIN tbl_countries as CONL  ON CONL.CountryId = u.Location AND CONL.IsDeleted = 0 
  WHERE u.IsDeleted = 0 AND u.Status = 1 AND u.username = '${username}' AND u.password = '${password}'`; 
  //console.log(query);
  con.query(query, (err, res) => {      
    if (err) {
      return result(err, null);
    }
   
    if (res.length) {
       var logininfo = res[0];  
      //console.log("UserId = " + logininfo.UserId);
      
      // console.log("res[0].MultipleAccessIdentityIds=" + res[0].MultipleAccessIdentityIds);
      //console.log("res[0].IsRestrictedCustomerAccess=" + res[0].IsRestrictedCustomerAccess);
      //console.log("res[0].MultipleCustomerIds=" + res[0].MultipleCustomerIds);
      const accessToken = jwt.sign({
        ProjectIdentifier: process.env.PROJECT_TOKEN_IDENTIFIER_NAME, Email: logininfo.Email, IdentityType: res[0].IdentityType, IdentityId: logininfo.IdentityId, MultipleAccessIdentityIds: logininfo.MultipleAccessIdentityIds, IsRestrictedCustomerAccess: logininfo.IsRestrictedCustomerAccess, MultipleCustomerIds: logininfo.MultipleCustomerIds,
        DefaultCurrency: logininfo.DefaultCurrency, CurrencySymbol: logininfo.CurrencySymbol, CurrencyCode: res[0].CurrencyCode, Location: logininfo.Location, IsDisplayBaseCurrencyValue: logininfo.IsDisplayBaseCurrencyValue, IsUserUPSEnable: logininfo.IsUserUPSEnable, UserId: logininfo.UserId, FirstName: logininfo.FirstName, LastName: logininfo.LastName, FullName: logininfo.FirstName + ' ' + logininfo.LastName, UserName: logininfo.Username

      }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: expiresIn
      });
      logininfo.accessToken = accessToken;
      var querydd = `select CountryId,CountryCode,CountryName,VatTaxPercentage,CurrencyCode from tbl_countries WHERE CountryId IN (${logininfo.AllowLocations}) AND status=1`;
      con.query(querydd, (errdd, resdd) => {
        logininfo.AllowLocationsDropdown = resdd;


        UserPermissionModel.IsExistPermissonForUserId(logininfo.UserId, (err, data1) => {
          if (err) { return result(err, null); }
          if (data1.length > 0) {
            var sql = UserPermissionModel.GetUserPermissionByUserId(logininfo.UserId);
            con.query(sql, (err, UserPermission) => {
              if (err) { console.log(err); return result(err, null); }
              return result(null, { login: logininfo, permission: UserPermission });
            })
          } else {
            var sql = RolePermissionModel.GetRolePermissionByUserIdQuery(logininfo.UserId);
            con.query(sql, (err, RolePermission) => {
              if (err) {
                console.log(err);
                return result(err, null);
              }
              return result(null, { login: logininfo, permission: RolePermission });
            })
          }
        });
      });
    } else {
      return result({ msg: "Username or password incorrect" }, null);
    }
  });
};


// To Customer login
UsersModel.Customerlogin = (username, password, result) => {
  var password = md5(password);
  var query = `SELECT FirstName,LastName,UserId,Username,REPLACE(ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto
  ,'${Constants.CONST_IDENTITY_TYPE_CUSTOMER}' as IdentityType,IdentityId
  FROM tbl_users WHERE IsDeleted = 0 AND Status = 1 AND  
  username = '${username}' AND password = '${password}' AND IdentityType = '${Constants.CONST_IDENTITY_TYPE_CUSTOMER}' `;

  con.query(query, (err, res) => {
    if (err) { return result(err, null); }
    if (res.length) {
      const accessToken = jwt.sign({
        ProjectIdentifier: process.env.PROJECT_TOKEN_IDENTIFIER_NAME, IdentityId: res[0].IdentityId, IdentityType: res[0].IdentityType, UserId: res[0].UserId, FirstName: res[0].FirstName, LastName: res[0].LastName, FullName: res[0].FirstName + ' ' + res[0].LastName, UserName: res[0].Username
      }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES
      });
      res[0].accessToken = accessToken;
      return result(null, res[0]);
    }
    return result({ msg: "Username or password incorrect" }, null);
  });
};
// To Vendorlogin
UsersModel.Vendorlogin = (username, password, result) => {
  var password = md5(password);
  var query = `SELECT FirstName,LastName,UserId,Username,REPLACE(ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}')  as ProfilePhoto
  FROM tbl_users WHERE IsDeleted = 0 AND Status = 1 AND  
  username = '${username}' AND password = '${password}' AND IdentityType ='${Constants.CONST_IDENTITY_TYPE_VENDOR}' `;

  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.length) {
      const accessToken = jwt.sign({ ProjectIdentifier: process.env.PROJECT_TOKEN_IDENTIFIER_NAME, UserId: res[0].UserId, FirstName: res[0].FirstName, LastName: res[0].LastName, FullName: res[0].FirstName + ' ' + res[0].LastName, UserName: res[0].Username }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES
      });
      res[0].accessToken = accessToken;
      return result(null, res[0]);
    }
    return result({ msg: "Username or password incorrect" }, null);
  });
};


// To findById
UsersModel.findById = (user_id, result) => {
  con.query(`SELECT UserId,IdentityType,IdentityId,MultipleAccessIdentityIds,Title,FirstName,
  LastName,Address1,Address2,City,
  StateId,CountryId,Zip,Email,Location,CurrencyCode,IsDisplayBaseCurrencyValue,IsUserUPSEnable,DefaultLocation,DefaultCurrencyCode,AllowLocations,
  PhoneNo,Fax,DepartmentId,EmployeeId,IsRestrictedCustomerAccess,MultipleCustomerIds,
  Username,Password,REPLACE(ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto,Status,RoleId,WarehouseIds,IsRestrictExportReports FROM tbl_users WHERE IsDeleted = 0 AND UserId = ${user_id}`, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.length) {
      return result(null, res[0]);
    }
    return result({ msg: "user not found" }, null);
  });
};

// To forgotPassword
UsersModel.forgotPassword = (Email, result) => {
  con.query(`SELECT FirstName,LastName,UserId,Username,REPLACE(ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto FROM tbl_users WHERE IsDeleted = 0 AND Email = ${Email}`, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.length) {
      MailConfig.ViewOption(gmailTransport, hbs);
      let HelperOptions = {
        from: '"AH Group" <noreply@ahgroup.com>',
        to: res[0].Email,
        subject: 'Forgot Password',
        template: 'forgotPassword',
        context: {
          name: "Guru",
          link: "http://google.com"
        }
      };
      gmailTransport.sendMail(HelperOptions, (error, info) => {
        if (error) {
          result({ msg: "error sending email" }, null);
        }
        return result(null, info);
      });

    }
    return result({ msg: "user not found" }, null);
  });
};


// To getVendorUsers
UsersModel.getVendorUsers = (IdentityId, result) => {
  con.query(`SELECT *  FROM tbl_users        
      WHERE IsDeleted = 0 AND IdentityType = 2 AND IdentityId=${IdentityId}`, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
// To getUserListByServerSide
UsersModel.getUserListByServerSide = (Users, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT c.UserId, c.IdentityType,
case c.IdentityType
WHEN 1 THEN '${Constants.array_identity_type[1]}'
WHEN 2 THEN '${Constants.array_identity_type[2]}'
ELSE '-'
end IdentityTypeName,c.Location,c.CurrencyCode,IsDisplayBaseCurrencyValue,IsUserUPSEnable,c.DefaultLocation,c.DefaultCurrencyCode,c.AllowLocations,
c.IdentityId,c.MultipleAccessIdentityIds,c.FirstName,c.LastName,c.UserId,c.Username,
c.Password,REPLACE(c.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto,c.Email,c.PhoneNo,c.Fax,
c.Address1,c.Address2,c.City,c.Zip,
s.StateName,co.CountryName,Case c.Status 
WHEN 0 THEN '${Constants.array_true_false[0]}'
WHEN 1 THEN '${Constants.array_true_false[1]}'
ELSE '-'	end Status,
c.CountryId,
c.StateId,c.DepartmentId,c.Title,c.IsRestrictExportReports `;

  recordfilterquery = ` Select count(UserId) as recordsFiltered `;

  query = query + ` FROM tbl_users c
LEFT JOIN tbl_countries co on co.CountryId=c.CountryId
LEFT JOIN tbl_states s on s.StateId=c.StateId where c.IsDeleted=0  `;

  if (Users.search.value != '') {
    query = query + ` and ( 
        c.UserName LIKE '%${Users.search.value}%'
     or c.FirstName LIKE '%${Users.search.value}%' 
     or c.LastName LIKE '%${Users.search.value}%' 

     or c.ProfilePhoto LIKE '%${Users.search.value}%' 
     or c.PhoneNo LIKE '%${Users.search.value}%' 
     or c.Email LIKE '%${Users.search.value}%' 
     )
     `;
  }

  var cvalue = 0;
  for (cvalue = 0; cvalue < Users.columns.length; cvalue++) {
    if (Users.columns[cvalue].search.value != "") {
      if (Users.columns[cvalue].search.value == "true") {
        Users.columns[cvalue].search.value = "1";
      }
      if (Users.columns[cvalue].search.value == "false") {
        Users.columns[cvalue].search.value = "0";
      }

      switch (Users.columns[cvalue].name) {
        case "UserName":
          query += " and ( c." + Users.columns[cvalue].name + " LIKE '%" + Users.columns[cvalue].search.value + "%' ) ";
          break;
        case "FirstName":
          query += " and ( c." + Users.columns[cvalue].name + " LIKE '%" + Users.columns[cvalue].search.value + "%' ) ";
          break;
        case "Lastname":
          query += " and ( c." + Users.columns[cvalue].name + " LIKE '%" + Users.columns[cvalue].search.value + "%' ) ";
          break;
        case "Status":
          query += " and ( c." + Users.columns[cvalue].name + " LIKE '%" + Users.columns[cvalue].search.value + "%' ) ";
          break;
        default:
          query += " and ( " + Users.columns[cvalue].name + " LIKE '%" + Users.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var i = 0;
  if (Users.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < Users.order.length; i++) {
    if (Users.order[i].column != "" || Users.order[i].column == "0")// 0 is equal to ""
    {

      switch (Users.columns[Users.order[i].column].name) {

        case "UserName":
          query += " c." + Users.columns[Users.order[i].column].name + " " + Users.order[i].dir + ",";
          break;

        case "FirstName":
          query += " c." + Users.columns[Users.order[i].column].name + " " + Users.order[i].dir + ",";
          break;

        case "LastName":
          query += " c." + Users.columns[Users.order[i].column].name + " " + Users.order[i].dir + ",";
          break;

        case "Status":
          query += " c." + Users.columns[Users.order[i].column].name + " " + Users.order[i].dir + ",";
          break;

        default://could be any column except above 
          query += " " + Users.columns[Users.order[i].column].name + " " + Users.order[i].dir + ",";

      }
    }
  }

  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  if (Users.start != "-1" && Users.length != "-1") {
    query += " LIMIT " + Users.start + "," + (Users.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(c.UserId) as TotalCount 
FROM tbl_users c
LEFT JOIN tbl_countries co on co.CountryId=c.CountryId
LEFT JOIN tbl_states s on s.StateId=c.StateId where c.IsDeleted=0 `;

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) { return result(err, null); }

      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: Users.draw
      });
      return;
    }
  );

};
// To listbyuserquery
UsersModel.listbyuserquery = (IdentityType, VendorId) => {
  // Vendor Users List    
  var Usersquery = ``;
  Usersquery = `SELECT c.UserId, c.IdentityType,c.IsPrimay,c.Location,c.CurrencyCode,c.IsDisplayBaseCurrencyValue,c.IsUserUPSEnable,
    case c.IdentityType
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
    ELSE '-'
    end IdentityTypeName,
    case c.Status
    WHEN 1 THEN 'No'
    ELSE 'Yes'
    end AccountLocked, 
    c.IdentityId,c.MultipleAccessIdentityIds,c.FirstName,c.LastName,c.UserId,c.Username,
    c.Password,REPLACE(c.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto,c.Email,c.PhoneNo,c.Fax,
    c.Address1,c.Address2,c.City,c.Zip,
    s.StateName,co.CountryName, c.Status,c.CountryId,
    c.StateId,c.DepartmentId,c.Title,c.RoleId,r.RoleName,c.WarehouseIds,c.DefaultLocation,c.DefaultCurrencyCode,c.AllowLocations,c.IsRestrictExportReports
    FROM tbl_users c
    LEFT JOIN tbl_roles r on r.RoleId=c.RoleId
    LEFT JOIN tbl_countries co on co.CountryId=c.CountryId
    LEFT JOIN tbl_states s on s.StateId=c.StateId 
    where       
    c.IsDeleted=0  
    and c.IdentityType='${IdentityType}' and c.IdentityId='${VendorId}'`;
  //console.log(Usersquery);
  return Usersquery;
}
// To getAll
UsersModel.getAll = (req, result) => {
  con.query(`SELECT UserId,IdentityType,  case IdentityType
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  WHEN 2 THEN '${Constants.array_identity_type[2]}'
  ELSE '-'
  end IdentityTypeName,Location,CurrencyCode,IsDisplayBaseCurrencyValue,IsUserUPSEnable,DefaultLocation,DefaultCurrencyCode,AllowLocations, IdentityId, FirstName,LastName,UserId,Username, REPLACE(ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}')  as ProfilePhoto,PhoneNo,Status,PhoneNo,IsRestrictExportReports   
  FROM tbl_users WHERE IsDeleted = 0`, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

// To UserListWithFilter
UsersModel.UserListWithFilter = (obj, result) => {

  var selectquery = `SELECT IsPrimay,UserId,IdentityType,u.Location,co.CountryName as LocationName,co.CountryCode as LocationCode,u.CurrencyCode,u.IsDisplayBaseCurrencyValue,u.IsUserUPSEnable,case IdentityType
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  WHEN 2 THEN '${Constants.array_identity_type[2]}'
  ELSE '-'
  end IdentityTypeName, u.IdentityId,u.MultipleAccessIdentityIds, u.FirstName,u.LastName,UserId,u.Username,REPLACE(u.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto,PhoneNo,u.Status,PhoneNo,
  CONCAT(u.FirstName,' ',u.LastName) as Name,u.Email,r.RoleName,r.RoleId,d.DepartmentName,d.DepartmentId,v.VendorName,v.VendorId, C.CompanyName,u.DefaultLocation,u.DefaultCurrencyCode,u.AllowLocations,
  (SELECT count(UserPermissionId) FROM tbl_user_permission as UP WHERE UP.IsDeleted = 0 AND UP.UserId = u.UserId ) as CustomizedPermission,u.IsRestrictExportReports
  `;

  recordfilterquery = `Select count(u.UserId) as recordsFiltered `;

  var query = ` FROM tbl_users u
  LEFT JOIN tbl_roles r on r.RoleId=u.RoleId
  LEFT JOIN tbl_department d on d.DepartmentId=u.DepartmentId
  LEFT JOIN tbl_vendors v on v.VendorId=u.IdentityId and u.IdentityType=2 
  LEFT JOIN tbl_customers C on C.CustomerId=u.IdentityId and u.IdentityType=1 
  LEFT JOIN tbl_countries co on co.CountryId=u.Location
  WHERE u.IsDeleted = 0  AND u.IdentityType = 0 `;

  if (obj.Name != '' && obj.Name != null) {
    query += ` and (u.FirstName LIKE '%${obj.Name}%' OR u.LastName LIKE '%${obj.Name}%')  `;
  }
  if (obj.Username != '' && obj.Username != null) {
    query += ` and u.Username='${obj.Username}' `;
  }
  if (obj.RoleId != '' && obj.RoleId != null) {
    query += ` and u.RoleId='${obj.RoleId}' `;
  }
  if (obj.DepartmentId != '' && obj.DepartmentId != null) {
    query += ` and u.DepartmentId='${obj.DepartmentId}' `;
  }
  if (obj.Email != '' && obj.Email != null) {
    query += ` and u.Email='${obj.Email}' `;
  }
  //not required
  if (obj.VendorId != '' && obj.VendorId != null) {
    query += ` and (u.IdentityId='${obj.VendorId}' AND  u.IdentityType = '${Constants.CONST_IDENTITY_TYPE_VENDOR}' ) `;
  }
  //not required
  if (obj.CustomerId != '' && obj.CustomerId != null) {
    query += ` and (u.IdentityId='${obj.CustomerId}' AND  u.IdentityType = '${Constants.CONST_IDENTITY_TYPE_CUSTOMER}' ) `;
  }

  if (obj.Location != '' && obj.Location != null) {
    query += ` and u.Location='${obj.Location}' `;
  }

  var Countquery = recordfilterquery + query;
  if (obj.pagination.start >= 0 && obj.pagination.length >= 0) {
    query += ` Limit ${obj.pagination.start},${obj.pagination.length} `;
  }
  query = selectquery + query;

  var TotalCountQuery = `Select count(u.UserId) as TotalCount 
  FROM tbl_users u
  LEFT JOIN tbl_roles r on r.RoleId=u.RoleId
  LEFT JOIN tbl_department d on d.DepartmentId=u.DepartmentId
  LEFT JOIN tbl_vendors v on v.VendorId=u.IdentityId and u.IdentityType=2 WHERE u.IsDeleted = 0  AND u.IdentityType = 0 `;

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) { return result(err, null); }
      return result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount
      });
    });
};
// To getAllActiveAdmin
UsersModel.getAllActiveAdmin = (req, result) => {
  con.query(`SELECT Location,CurrencyCode,IsDisplayBaseCurrencyValue,IsUserUPSEnable,DefaultLocation,DefaultCurrencyCode,AllowLocations,FirstName,LastName,UserId,Username,REPLACE(ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto,PhoneNo,IsRestrictExportReports FROM tbl_users WHERE Status = 1 AND IdentityType = 0 AND IsDeleted = 0`, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

// To changePassword
UsersModel.changePassword = (UserId, CurrentPassword, NewPassword, result) => {
  var query = `Select Password as CurrentPassword from tbl_users where UserId='${UserId}'`;
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.length > 0) {
      if (res[0].CurrentPassword == md5(CurrentPassword)) {
        var sql = ``;
        sql = `UPDATE tbl_users SET Password = ?, Modified = ?,
    ModifiedBy = ? WHERE UserId = ?`;
        var values = [
          md5(NewPassword), cDateTime.getDateTime(),
          global.authuser.UserId, UserId
        ]
        con.query(sql, values, (err, res) => {
          if (err) {
            return result(err, null);
          }
          if (res.affectedRows == 0) {
            return result({ kind: "Password Not changed" }, null);
          }
          result(null, UserId);
        });
      }
      else {
        return result({ msg: "Current Password is Incorrect" }, null);
      }
    }
    else {
      return result({ msg: "User not found" }, null);
    }

  });
};

// To changePassword
UsersModel.changePasswordByAdmin = (UserId, NewPassword, result) => {
  var sql = `UPDATE tbl_users SET Password = ?, Modified = ?, ModifiedBy = ? WHERE UserId = ?`;
  var values = [md5(NewPassword), cDateTime.getDateTime(), global.authuser.UserId, UserId]
  con.query(sql, values, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.affectedRows == 0) {
      return result({ kind: "Password not changed successfully!. Please try again later." }, null);
    }
    return result(null, UserId);
  });
};
// To setAsPrimary
UsersModel.setAsPrimary = (reqBody, result) => {

   var TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  var LoginUserId = (reqBody.authuser && reqBody.authuser.UserId) ? reqBody.authuser.UserId : TokenUserId;

  var IsPrimay = 1;
  var sql = `UPDATE tbl_users SET IsPrimay = ?, Modified = ?, ModifiedBy = ? WHERE IdentityType = ? AND IdentityId = ?`;
  var values = [0, cDateTime.getDateTime(), LoginUserId, reqBody.IdentityType, reqBody.IdentityId]
  var sql1 = `UPDATE tbl_users SET IsPrimay = ?, Modified = ?, ModifiedBy = ? WHERE UserId = ? AND IdentityType = ? AND IdentityId = ?`;
  var values1 = [IsPrimay, cDateTime.getDateTime(), LoginUserId, reqBody.UserId, reqBody.IdentityType, reqBody.IdentityId];
  con.query(sql, values, (err, res) => {
    if (err) {
      return result(err, null);
    } else {
      con.query(sql1, values1, (err1, res1) => {
        if (err1) {
          return result(err1, null);
        } else {
          return result(null, reqBody);
        }
      })
    }

  });
};


UsersModel.updateByIdForAdmin = (objUser, result) => {

  for (let val of objUser.UserList) {
    var sql = `UPDATE tbl_users SET IdentityType = ?,IdentityId =?,FirstName=?,MultipleAccessIdentityIds=?,
  LastName=?,Address1=?,Address2=?,City=?,StateId=?,CountryId=?,Zip=?,Email=?,PhoneNo=?,Fax=?,
  ProfilePhoto=?,Modified = ?,ModifiedBy = ?,Status = ?,Username = ?,Title=?,DepartmentId=?,EmployeeId=?,
  IsRestrictedCustomerAccess=?, MultipleCustomerIds=?, RoleId=?,WarehouseIds=?,IsDisplayBaseCurrencyValue=?,IsUserUPSEnable=?,DefaultLocation=?,DefaultCurrencyCode=?,AllowLocations=?,IsRestrictExportReports=?
   WHERE UserId = ?`

    let obj = new UsersModel(val, objUser);
    var values = [
      obj.IdentityType, objUser.IdentityId, obj.FirstName, obj.MultipleAccessIdentityIds,
      obj.LastName, obj.Address1, obj.Address2,
      obj.City, obj.StateId, obj.CountryId,
      obj.Zip, obj.Email, obj.PhoneNo,
      obj.Fax, obj.ProfilePhoto, obj.Modified,
      obj.ModifiedBy, obj.Status, obj.Username,
      obj.Title, obj.DepartmentId, obj.EmployeeId, obj.IsRestrictedCustomerAccess, obj.MultipleCustomerIds,
      obj.RoleId, obj.WarehouseIds, obj.IsDisplayBaseCurrencyValue, obj.IsUserUPSEnable, obj.DefaultLocation, obj.DefaultCurrencyCode, obj.AllowLocations, obj.IsRestrictExportReports, obj.UserId
    ]
    // console.log(sql, values)
    con.query(sql, values, function (err, result) {
      if (err) {
        return result(err, null);
      }
    });
  }
  result(null, objUser);
};

// To update By Id
UsersModel.updateById = (objUser, result) => {

  for (let val of objUser.UserList) {
    var sql = `UPDATE tbl_users SET IdentityType = ?,IdentityId =?,FirstName=?,
  LastName=?,Address1=?,Address2=?,
  City=?,StateId=?,CountryId=?,Zip=?,
  Email=?,PhoneNo=?,Fax=?,
  ProfilePhoto=?,Modified = ?,ModifiedBy = ?,
  Status = ?,Username = ?,Title=?,DepartmentId=?,EmployeeId=?,RoleId=?,WarehouseIds=?,DefaultLocation=?,DefaultCurrencyCode=?,AllowLocations=?
   WHERE UserId = ?`

    let obj = new UsersModel(val, objUser);
    var values = [
      obj.IdentityType, objUser.IdentityId, obj.FirstName,
      obj.LastName, obj.Address1, obj.Address2,
      obj.City, obj.StateId, obj.CountryId,
      obj.Zip, obj.Email, obj.PhoneNo,
      obj.Fax, obj.ProfilePhoto, obj.Modified,
      obj.ModifiedBy, obj.Status, obj.Username,
      obj.Title, obj.DepartmentId, obj.EmployeeId, obj.RoleId, obj.WarehouseIds, obj.DefaultLocation, obj.DefaultCurrencyCode, obj.AllowLocations,
      obj.UserId
    ]
    con.query(sql, values, function (err, result) {
      if (err) {
        return result(err, null);
      }
    });
  }
  result(null, objUser);
};
// To Delete
UsersModel.remove = (id, result) => {

  var sql = `UPDATE tbl_users SET IsDeleted = 1,ModifiedBy='${global.authuser.UserId}' WHERE UserId = ${id}`;
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.affectedRows == 0) {
      return result({ msg: "User not found" }, null);
    }
    result(null, res);
  });
};
UsersModel.changeLocation = (params, result) => {
  CountryModel.findById(params.Location, (err, res) => {

    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    var LoginUserId = (params.authuser && params.authuser.UserId) ? params.authuser.UserId : TokenUserId;

    var updateUserLocation = `UPDATE tbl_users SET Location=?,CurrencyCode=? WHERE UserId = ?`
    var valuesForUserUpdate = [
      res.CountryId, res.CurrencyCode, LoginUserId
    ]
    con.query(updateUserLocation, valuesForUserUpdate, function (errU, resultU) {
      if (errU) {
        return result(errU, null);
      }
      if (resultU) {
        // return result(null, resultU);
        UsersModel.ReLogin(LoginUserId, (err1, result1) => {
          return result(null, result1);
        });
      }
    });
  })
};

UsersModel.ReLogin = (UserId, result) => {
  // if (domain == "domain") {
  //   var expiresIn = process.env.JWT_ACCESS_EXPIRES_DOMAIN_LOGIN
  // } else {
  //   var expiresIn = process.env.JWT_ACCESS_EXPIRES
  // }
  var expiresIn = process.env.JWT_ACCESS_EXPIRES

  var query = `SELECT u.FirstName,u.LastName, u.UserId,u.Username,REPLACE(u.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto,
  REPLACE(c.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as CustomerLogo,  
  REPLACE(v.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}')  as VendorLogo,u.IdentityType,u.IdentityId,u.IsPrimay
  ,u.IsSuperAdmin,RoleId,u.MultipleAccessIdentityIds,IsRestrictedCustomerAccess,MultipleCustomerIds,u.Location,u.CurrencyCode,u.IsDisplayBaseCurrencyValue,u.IsUserUPSEnable,CUR.CurrencySymbol,SETT.DefaultCurrency,
  u.DefaultLocation,u.DefaultCurrencyCode,u.AllowLocations,CURD.CurrencySymbol as DefaultCurrencySymbol,CONL.CountryName as LocationCountryName,CON.CountryName as DefaultCountryName,CON.CountryCode as DefaultCountryCode,u.IsRestrictExportReports
  FROM tbl_users u
  LEFT JOIN tbl_customers c on c.CustomerId=u.IdentityId and u.IdentityType=1
  LEFT JOIN tbl_vendors v on v.VendorId=u.IdentityId and u.IdentityType=2 
  LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = SETT.DefaultCurrency AND CUR.IsDeleted = 0  
  LEFT JOIN tbl_currencies as CURD  ON CURD.CurrencyCode = u.DefaultCurrencyCode AND CURD.IsDeleted = 0  
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = u.DefaultLocation AND CON.IsDeleted = 0 
  LEFT JOIN tbl_countries as CONL  ON CONL.CountryId = u.Location AND CONL.IsDeleted = 0
  WHERE u.IsDeleted = 0 AND u.Status = 1 AND u.UserId = '${UserId}'`;
  //console.log(query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.length) {
      const accessToken = jwt.sign({
        ProjectIdentifier: process.env.PROJECT_TOKEN_IDENTIFIER_NAME, IdentityType: res[0].IdentityType, IdentityId: res[0].IdentityId, MultipleAccessIdentityIds: res[0].MultipleAccessIdentityIds, IsRestrictedCustomerAccess: res[0].IsRestrictedCustomerAccess, MultipleCustomerIds: res[0].MultipleCustomerIds,
        DefaultCurrency: res[0].DefaultCurrency, CurrencySymbol: res[0].CurrencySymbol, CurrencyCode: res[0].CurrencyCode, Location: res[0].Location, IsDisplayBaseCurrencyValue: res[0].IsDisplayBaseCurrencyValue, UserId: res[0].UserId, FirstName: res[0].FirstName, LastName: res[0].LastName, FullName: res[0].FirstName + ' ' + res[0].LastName, UserName: res[0].Username

      }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: expiresIn
      });
      res[0].accessToken = accessToken;
      var querydd = `select CountryId,CountryCode,CountryName,VatTaxPercentage,CurrencyCode from tbl_countries WHERE CountryId IN (${res[0].AllowLocations}) AND status=1`;
      con.query(querydd, (errdd, resdd) => {
        res[0].AllowLocationsDropdown = resdd;


        UserPermissionModel.IsExistPermissonForUserId(res[0].UserId, (err, data1) => {
          if (err) { return result(err, null); }
          if (data1.length > 0) {
            var sql = UserPermissionModel.GetUserPermissionByUserId(res[0].UserId);
            con.query(sql, (err, UserPermission) => {
              if (err) { console.log(err); return result(err, null); }
              return result(null, { login: res[0], permission: UserPermission });
            })
          } else {
            var sql = RolePermissionModel.GetRolePermissionByUserIdQuery(res[0].UserId);
            con.query(sql, (err, RolePermission) => {
              if (err) {
                console.log(err);
                return result(err, null);
              }
              return result(null, { login: res[0], permission: RolePermission });
            })
          }
        });
      });
    } else {
      return result({ msg: "Something went wrong!" }, null);
    }
  });
};
module.exports = UsersModel;
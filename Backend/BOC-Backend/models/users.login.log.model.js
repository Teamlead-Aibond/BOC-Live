/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');

const { CONST_ADDRES_TYPE_BILLING, CONST_IDENTITY_TYPE_CUSTOMER, CONST_IDENTITY_TYPE_VENDOR } = require("../config/constants.js");
const UserLoginLogModel = function (obj) {
    this.UserLoginLogId = obj.UserLoginLogId ? obj.UserLoginLogId : 0;
    this.UserId = obj.UserId ? obj.UserId : null;
    this.Username = obj.Username ? obj.Username : '';
    this.LoginDomain = obj.LoginDomain ? obj.LoginDomain : '';
    this.IPAddress = obj.IPAddress ? obj.IPAddress : '';
    this.IsLoginSuccess = obj.IsLoginSuccess ? obj.IsLoginSuccess : 0;
    this.Comments = obj.Comments ? obj.Comments : '';
    this.Created = cDateTime.getDateTime();

    // For Server Side Search 
    this.start = obj.start;
    this.length = obj.length;
    this.search = obj.search;
    this.sortCol = obj.sortCol;
    this.sortDir = obj.sortDir;
    this.sortColName = obj.sortColName;
    this.order = obj.order;
    this.columns = obj.columns;
    this.draw = obj.draw;
};

//To get all the log
UserLoginLogModel.listwithFilter = (obj, result) => {
    var query = "";
    var selectquery = `Select UserLoginLogId,ul.UserId,ul.Username,LoginDomain,IPAddress,
    IsLoginSuccess,u.IdentityType as LogUserIdentityType,u.IdentityId as LogUserIdentityId, 

   CASE u.IdentityType
   WHEN 0 THEN 'Aibond Portal'
   WHEN 1 THEN 'Customer Portal'
   WHEN 2 THEN 'Vendor Portal'
   ELSE '-'	end LogUserIdentityTypeName,

   CASE u.IdentityType
   WHEN 0 THEN CONCAT(u.FirstName,' ',u.LastName)
   WHEN 1 THEN C.CompanyName
   WHEN 2 THEN V.VendorName
   ELSE '-'	end LogUserFullName,

    ul.Created, DATE_FORMAT(ul.Created,'%m/%d/%Y %h:%i %p') as LoginDateTime `;
    recordfilterquery = `Select count(UserLoginLogId) as recordsFiltered `;

    query = query + ` From tbl_users_login_log ul
    Left Join tbl_users u on u.UserId=ul.UserId 
    LEFT JOIN tbl_vendors as V ON V.VendorId = u.IdentityId and u.IdentityType = ${CONST_IDENTITY_TYPE_VENDOR}    
    LEFT JOIN tbl_customers as C ON C.CustomerId = u.IdentityId and u.IdentityType = ${CONST_IDENTITY_TYPE_CUSTOMER}   
    where ul.IsDeleted=0 `;

    if (obj.search.value != '') {
        query = query + ` and (  ul.Username LIKE '%${obj.search.value}%'
    or ul.LoginDomain LIKE '%${obj.search.value}%'
    or ul.IPAddress LIKE '%${obj.search.value}%' 
  ) `;
    }

    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {

        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "UserId":
                    query += " and ( ul.UserId='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Username":
                    query += " and ( ul.Username LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
                    break;
                case "LogUserIdentityType":
                    query += " and ( u.IdentityType = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "LogUserIdentityId":
                    query += " and ( u.IdentityId = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;

                case "IsLoginSuccess":
                    query += " and ( ul.IsLoginSuccess ='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Created":
                    query += " and ( DATE(ul.Created) ='" + obj.columns[cvalue].search.value + "' ) ";
                    break;


                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }

    var tempquery = query.slice(0, -1);
    query = tempquery;

    query += " ORDER BY UserLoginLogId DESC ";

    var Countquery = recordfilterquery + query;

    if (obj.start != "-1" && obj.length != "-1") {
        query += " LIMIT " + obj.start + "," + (obj.length);
    }
    query = selectquery + query;

    var TotalCountQuery = `Select count(UserLoginLogId) as TotalCount
    From tbl_users_login_log ul
   Left Join tbl_users u on u.UserId=ul.UserId 
    where ul.IsDeleted=0 `;

    async.parallel([
        function (result) { con.query(query, result) },
        function (result) { con.query(Countquery, result) },
        function (result) { con.query(TotalCountQuery, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            return result(null, {
                data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
                recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
            });
        }
    );
}

//To create a log
UserLoginLogModel.create = (Obj, result) => {
    var sql = `insert into tbl_users_login_log(UserId,Username,LoginDomain,IPAddress,IsLoginSuccess,Created) values(?,?,?,?,?,?)`;
    var values = [Obj.UserId, Obj.Username, Obj.LoginDomain, Obj.IPAddress, Obj.IsLoginSuccess, Obj.Created];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...Obj });
    });
};



module.exports = UserLoginLogModel;
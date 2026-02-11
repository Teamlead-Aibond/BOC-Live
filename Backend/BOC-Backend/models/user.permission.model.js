/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const UserPermission = function (obj) {
    this.UserPermissionId = obj.UserPermissionId ? obj.UserPermissionId : 0;
    this.UserId = obj.UserId ? obj.UserId : 0;
    this.PermissionId = obj.PermissionId ? obj.PermissionId : 0;
    this.PermissionIdentityType = obj.PermissionIdentityType ? obj.PermissionIdentityType : 0;
    this.Permission = obj.Permission ? obj.Permission : '';
    this.Created = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
}

//GetUserPermissionByUserId
UserPermission.GetUserPermissionByUserId = (UserId) => {

    var query = `
    Select up.UserPermissionId,up.UserId,
   pr.PermissionIdentityType,up.Permission,pr.PermissionName,pr.PermissionCheckbox,pr.PermissionCode,pr.PermissionId 
  from  tbl_permissions pr
  left join tbl_users as U on U.UserId=${UserId}
  left join tbl_user_permission up on pr.PermissionId=up.PermissionId AND up.IsDeleted = 0 AND up.UserId = ${UserId}
  where  pr.IsDeleted<>1`;

    /*var query = ` Select up.UserPermissionId,up.UserId,
   up.PermissionIdentityType,up.Permission,pr.PermissionName,pr.PermissionCheckbox,pr.PermissionCode,pr.PermissionId 
   from tbl_users ur 
   left join tbl_user_permission up on up.UserId=ur.UserId
   left Join tbl_permissions pr on pr.PermissionId=up.PermissionId
   where ur.UserId=${UserId} and up.IsDeleted<>1`;*/

    return query;
}

//IsExistPermissonForUserId
UserPermission.IsExistPermissonForUserId = (UserId, result) => {
    var sql = `Select UserPermissionId,UserId from tbl_user_permission where IsDeleted=0 and UserId='${UserId}' `;
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
}
//Create 
UserPermission.Create = (UserId, obj, result) => {
    var sql = ``;
    sql = `Insert Into tbl_user_permission(UserId,PermissionId,PermissionIdentityType,Permission,Created, CreatedBy) 
    values('${UserId}','${obj.PermissionId}','${obj.PermissionIdentityType}','${obj.Permission}','${obj.Created}','${obj.CreatedBy}')`;
    //console.log("Insert :" + sql);
    con.query(sql, (err, res) => {
        if (err) { return result(err, null); }
        return result(null, { id: res.insertId });
    });
};
//CheckExistPermissonByUserId
UserPermission.CheckExistPermissonByUserId = (UserId, PermissionId, result) => {
    var sql = `Select PermissionId,UserPermissionId from tbl_user_permission where IsDeleted=0 and UserId='${UserId}' and PermissionId='${PermissionId}' `;
    //console.log("check :" + sql);
    con.query(sql, (err, res) => {
        // console.log(err);
        if (err) {
            // return result(err, null);
        } else {
            return result(null, res);
        }
    });
}
//UpdatePermission
UserPermission.UpdatePermission = (UserId, obj, result) => {
    var sql = ``;
    sql = `update tbl_user_permission set Permission='${obj.Permission}',UserId='${UserId}' , PermissionId='${obj.PermissionId}' where UserPermissionId='${obj.UserPermissionId}'`;
    //console.log("update :" + sql);
    con.query(sql, (err, res) => {
        // console.log(err);
        if (err) {
            // return result(err, null);
        } else {
            return result(null, { id: obj.UserPermissionId, ...obj });
        }
        // if (err) { 
        //     // return result(err, null); 
        // }
        // if (res.affectedRows == 0) {
        //     // return result({ kind: "UserPermission_not_found" }, null);
        // }else{
        //     return result(null, { id: obj.UserPermissionId, ...obj });
        // }
    });
};

//DeletePermission
UserPermission.DeletePermission = (UserId, result) => {
    var sql = ``;
    sql = `update tbl_user_permission set IsDeleted = 1 where UserId='${UserId}'`;
    con.query(sql, (err, res) => {
        if (err) { return result(err, null); }
        if (res.affectedRows == 0) {
            return result({ kind: "UserPermission_not_found" }, null);
        }
        return result(null, { id: UserId });
    });
};

module.exports = UserPermission;
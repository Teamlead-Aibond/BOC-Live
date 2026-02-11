/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const RolePermission = function (objRolePermission) {
  this.RolePermissionId = objRolePermission.RolePermissionId;
  this.RoleId = objRolePermission.RoleId;
  this.PermissionId = objRolePermission.PermissionId;
  this.PermissionIdentityType = objRolePermission.PermissionIdentityType;
  this.Permission = objRolePermission.Permission;
  this.Created = cDateTime.getDateTime();
  this.CreatedBy = global.authuser.UserId ? global.authuser.UserId : 0;
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objRolePermission.authuser && objRolePermission.authuser.UserId) ? objRolePermission.authuser.UserId : TokenUserId;
  this.IsDeleted = 0;
}

RolePermission.GetRolePermissionByUserIdQuery = (UserId) => {

  /*var query = `Select rp.RolePermissionId,rp.RoleId,rp.RolePermissionId,rp.PermissionIdentityType,rp.Permission,pr.PermissionName,pr.PermissionCheckbox,pr.PermissionCode,pr.PermissionId 
  from  tbl_permissions pr 
  left join tbl_users ur on ur.UserId=${UserId}  AND ur.IsDeleted = 0  
  left join tbl_roles_permission rp on rp.RoleId=ur.RoleId
  where ur.UserId=${UserId}  AND pr.IsDeleted = 0  and rp.IsDeleted=0`;*/


  var query = ` Select rp.RolePermissionId, ur.RoleId, pr.PermissionIdentityType, rp.Permission, pr.PermissionName, pr.PermissionCheckbox, pr.PermissionCode, pr.PermissionId
  from  tbl_permissions pr
  left join tbl_users ur on ur.UserId = ${UserId}  AND ur.IsDeleted = 0
  left join tbl_roles_permission rp on rp.RoleId = ur.RoleId AND pr.PermissionId = rp.PermissionId  and rp.IsDeleted = 0
  where   pr.IsDeleted = 0`;


  return query;

}


RolePermission.GetRolePermissionByUserId = (UserId, result) => {

  var query = RolePermission.GetRolePermissionByUserId(UserId);

  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    //console.log("Role Permission Loaded :", res);
    //console.log(UserId);
    result(null, res);
  });
}


RolePermission.GetRolePermissionByRoleId = (RoleId, result) => {

  con.query(`Select rp.RolePermissionId,R.RoleId,rp.RolePermissionId,pr.PermissionIdentityType,rp.Permission,pr.PermissionName,pr.PermissionCheckbox,pr.PermissionCode,pr.PermissionId 
  from  tbl_permissions pr  
  left join tbl_roles as R on R.RoleId=${RoleId}
  left join tbl_roles_permission rp on pr.PermissionId=rp.PermissionId AND rp.IsDeleted = 0 AND rp.RoleId = ${RoleId}
  where  pr.IsDeleted<>1`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    return result(null, res);
  });
}


// RolePermission.CreatePermissionOrUpdatePermission = (RoleId, PermissionList, result) => {
//     for (let val of PermissionList) {
//         var sql = `Delimiter $$ DROP PROCEDURE IF EXISTS update_or_insert_permission_proc $$ Create Procedure update_or_insert_permission_proc() Begin Declare var INT; Select count(*) into var from  tbl_roles_permission where RoleId='${RoleId}' and PermissionId='${val.PermissionId}'; if var then update tbl_roles_permission set Permission='${val.Permission}',RoleId='${RoleId}' and PermissionId='${val.PermissionId}' where RolePermissionId='${val.RolePermissionId}'; else Insert Into tbl_roles_permission(RoleId,PermissionId,PermissionIdentityType,Permission,Created, CreatedBy,IsDeleted) values('${RoleId}','${val.PermissionId}','${val.PermissionIdentityType}','${val.Permission}',curdate(),'${global.authuser.UserId}',0); end if; end; $$ call update_or_insert_permission_proc();`;   


//     con.query(sql, (err, res) => {
//         if (err) 
//         {
//           console.log("error: ", err);
//           result(err, null);
//           return;
//         }
//        // result(null, {data:PermissionList});
//         result(null,res);
//         return; 
//     });
// }

//   }


RolePermission.CheckExistPermissonByRoleId = (RoleId, PermissionId, result) => {
  var sql = `Select RoleId,PermissionId from tbl_roles_permission where IsDeleted=0 and RoleId='${RoleId}' and PermissionId='${PermissionId}' `;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
}


RolePermission.create = (RoleId, RolePermission1, result) => {
  var sql = ``;
  sql = `Insert Into tbl_roles_permission(RoleId,PermissionId,PermissionIdentityType,Permission,Created, CreatedBy,IsDeleted) values('${RoleId}','${RolePermission1.PermissionId}','${RolePermission1.PermissionIdentityType}','${RolePermission1.Permission}','${RolePermission1.Created}','${global.authuser.UserId}',0)`;
  // console.log("insert query " + sql);
  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;
  });
};

RolePermission.upsert = (RoleId, RolePermissions, result) => {
  var sql = [];
  RolePermissions.forEach((rolePermission) => {
    let rp = new RolePermission(rolePermission);
    if (rp.RolePermissionId == null || rp.RolePermissionId == undefined || rp.RolePermissionId == 0) {
      sql.push(`Insert Into tbl_roles_permission(RoleId,PermissionId,PermissionIdentityType,Permission,Created, CreatedBy,IsDeleted) values('${RoleId}','${rp.PermissionId}','${rp.PermissionIdentityType}','${rp.Permission}','${rp.Created}','${global.authuser.UserId}',0);`);
    } else {
      sql.push(`update tbl_roles_permission set Permission='${rp.Permission}',RoleId='${RoleId}', PermissionId='${rp.PermissionId}' where RolePermissionId='${rp.RolePermissionId}';`);
    }
  })

  //console.log("upsert query " + sql);
  async.parallel(sql.map(s => result => { con.query(s, result) }), (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    // result(null, { });
    return;
  });
};



RolePermission.UpdatePermission = (RoleId, RolePermission1, result) => {
  var sql = ``;
  sql = `update tbl_roles_permission set Permission='${RolePermission1.Permission}',RoleId='${RoleId}', PermissionId='${RolePermission1.PermissionId}' where RolePermissionId='${RolePermission1.RolePermissionId}'`;

  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "not updated" }, null);
      return;
    }

    // result(null, { id: RolePermission1.RolePermissionId, ...RolePermission1 });
    return;
  });
};
module.exports = RolePermission;
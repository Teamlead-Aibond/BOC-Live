/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const Permission = function (objPermission) {
  this.PermissionId = objPermission.PermissionId;
  this.PermissionIdentityType = objPermission.PermissionIdentityType;
  this.PermissionName = objPermission.PermissionName;
  this.PermissionCheckbox = objPermission.PermissionCheckbox ? objPermission.PermissionCheckbox : '';
  this.IsDeleted = 0;
}

Permission.GetAllPermission = (result) => {
  var sql = `SELECT PermissionId, PermissionIdentityType, PermissionName, PermissionCode, PermissionCheckbox  FROM tbl_permissions WHERE IsDeleted = 0 `;
  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

module.exports = Permission;
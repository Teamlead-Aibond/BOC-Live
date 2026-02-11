/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const PartCategoryModel = function (obj) {
    this.PartCategoryId = obj.PartCategoryId;
    this.PartCategoryName = obj.PartCategoryName;
    this.Status = obj.Status;
    this.Created = cDateTime.getDateTime();
    this.CreatedBy = obj.CreatedBy ? obj.CreatedBy : 0;
    this.Modified = cDateTime.getDateTime();
    this.ModifiedBy = obj.ModifiedBy ? obj.ModifiedBy : 0;
};

//To get all the PartCategory
PartCategoryModel.getAll = result => {
    con.query(`Select PartCategoryId,PartCategoryName,Status,Created,CreatedBy,Modified,ModifiedBy from tbl_part_category WHERE IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

//To create a PartCategory
PartCategoryModel.create = (Obj, result) => {
    var sql = `insert into tbl_part_category(PartCategoryName,Status,Created,CreatedBy) values(?,?,?,?)`;
    //console.log(sql)
    var values = [Obj.PartCategoryName,Obj.Status,Obj.Created,Obj.CreatedBy];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...Obj });
    });
};

//To get the PartCategory info
PartCategoryModel.findById = (PartCategoryId, result) => {
    var sql = `Select PartCategoryId,PartCategoryName,Status,Created,CreatedBy,Modified,ModifiedBy from tbl_part_category WHERE PartCategoryId = ${PartCategoryId} AND IsDeleted = 0 `;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        if (res.length) {
            return result(null, res[0]);
        }
        return result({ msg: "PartCategory not found" }, null);
    });
};

//To update the PartCategory
PartCategoryModel.update = (Obj, result) => {
    var sql = ` UPDATE tbl_part_category SET PartCategoryName = ?,Status = ?,Modified = ?,Modifiedby = ?  WHERE PartCategoryId = ? AND IsDeleted = 0 `;
    var values = [Obj.PartCategoryName,Obj.Status,Obj.Modified,Obj.Modifiedby,Obj.PartCategoryId];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        if (res.affectedRows == 0)
            return result({ msg: "PartCategory not updated!" }, null);
        result(null, { id: Obj.PartCategoryId, ...Obj });
    });
};

//To remove the PartCategory
PartCategoryModel.remove = (id, result) => {
    var sql = `UPDATE tbl_part_category SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE PartCategoryId = '${id}' `;
    con.query(sql, (err, res) => {
        if (err)
            return result(null, err);
        if (res.affectedRows == 0)
            return result({ msg: "PartCategory not deleted" }, null);
        return result(null, res);
    });
};

PartCategoryModel.PartCategoryDropdown = (reqBody, result) => {
    con.query(`SELECT DISTINCT PartCategoryId,PartCategoryName,false as isChecked FROM tbl_part_category where IsDeleted = 0`, (err, res) => {
      if (err) {
        return result(err, null);
      }
      if (res.length) {
        return result(null, res);
      }
      return result({ msg: "not found" }, null);
    });
  };
module.exports = PartCategoryModel;
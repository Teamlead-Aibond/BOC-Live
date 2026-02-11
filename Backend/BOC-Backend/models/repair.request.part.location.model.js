/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const RRPartLocationModel = function (objCurrency) {
    this.RRPartLocationId = objCurrency.RRPartLocationId;
    this.RRPartLocation = objCurrency.RRPartLocation;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (objCurrency.authuser && objCurrency.authuser.UserId) ? objCurrency.authuser.UserId : TokenUserId;
    this.ModifiedBy = (objCurrency.authuser && objCurrency.authuser.UserId) ? objCurrency.authuser.UserId : TokenUserId;
};

//To get all the part location
RRPartLocationModel.getAll = result => {
    con.query(`Select RRPartLocationId,RRPartLocation from tbl_repair_request_part_location WHERE  IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

RRPartLocationModel.dropdown = result => {
    con.query(`Select RRPartLocationId,RRPartLocation from tbl_repair_request_part_location WHERE  IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}


//To create a part location
RRPartLocationModel.create = (Obj, result) => {
    var sql = `insert into tbl_repair_request_part_location(RRPartLocation,Created,CreatedBy) values(?,?,?)`;
    var values = [Obj.RRPartLocation, Obj.Created, Obj.CreatedBy];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...Obj });
    });
};

//To get the part location info
RRPartLocationModel.findById = (RRPartLocationId, result) => {
    var sql = `SELECT RRPartLocationId,RRPartLocation  FROM tbl_repair_request_part_location   WHERE RRPartLocationId = ${RRPartLocationId} `;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        if (res.length) {
            return result(null, res[0]);
        }
        return result({ msg: "Part Location not found" }, null);
    });
};

//To update the part location
RRPartLocationModel.update = (Obj, result) => {
    var sql = ` UPDATE tbl_repair_request_part_location SET RRPartLocation = ?,  Modified = ?,Modifiedby = ?  WHERE RRPartLocationId = ? `;
    var values = [Obj.RRPartLocation, Obj.Modified, Obj.Modifiedby, Obj.RRPartLocationId];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        if (res.affectedRows == 0)
            return result({ msg: "Part Location not updated!" }, null);
        result(null, { id: Obj.RRPartLocationId, ...Obj });
    });
};

//To remove the part location
RRPartLocationModel.remove = (id, result) => {
    var sql = `UPDATE tbl_repair_request_part_location SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE RRPartLocationId = '${id}' `;
    con.query(sql, (err, res) => {
        if (err)
            return result(null, err);
        if (res.affectedRows == 0)
            return result({ msg: "Part Location not deleted" }, null);
        return result(null, res);
    });
};
module.exports = RRPartLocationModel;
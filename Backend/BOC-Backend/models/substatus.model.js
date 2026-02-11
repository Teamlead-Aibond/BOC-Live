/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const SubStatusModel = function (objCurrency) {
    this.SubStatusId = objCurrency.SubStatusId;
    this.SubStatusName = objCurrency.SubStatusName;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (objCurrency.authuser && objCurrency.authuser.UserId) ? objCurrency.authuser.UserId : TokenUserId;
    this.ModifiedBy = (objCurrency.authuser && objCurrency.authuser.UserId) ? objCurrency.authuser.UserId : TokenUserId;
};

//To get all the Currency
SubStatusModel.getAll = result => {
    con.query(`Select SubStatusId,SubStatusName from tbl_repair_request_substatus WHERE  IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

SubStatusModel.dropdown = result => {
    con.query(`Select SubStatusId,SubStatusName from tbl_repair_request_substatus WHERE  IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}


//To create a Sub Status
SubStatusModel.create = (Obj, result) => {
    var sql = `insert into tbl_repair_request_substatus(SubStatusName,Created,CreatedBy) values(?,?,?)`;
    var values = [Obj.SubStatusName, Obj.Created, Obj.CreatedBy];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...Obj });
    });
};

//To get the sub status info
SubStatusModel.findById = (SubStatusId, result) => {
    var sql = `SELECT SubStatusId,SubStatusName  FROM tbl_repair_request_substatus   WHERE SubStatusId = ${SubStatusId} `;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        if (res.length) {
            return result(null, res[0]);
        }
        return result({ msg: "Sub Status not found" }, null);
    });
};

//To update the sub status
SubStatusModel.update = (Obj, result) => {
    var sql = ` UPDATE tbl_repair_request_substatus SET SubStatusName = ?,  Modified = ?,Modifiedby = ?  WHERE SubStatusId = ? `;
    var values = [Obj.SubStatusName, Obj.Modified, Obj.Modifiedby, Obj.SubStatusId];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        if (res.affectedRows == 0)
            return result({ msg: "Sub Status not updated!" }, null);
        result(null, { id: Obj.SubStatusId, ...Obj });
    });
};

//To remove the Sub Status
SubStatusModel.remove = (id, result) => {
    var sql = `UPDATE tbl_repair_request_substatus SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE SubStatusId = '${id}' `;
    con.query(sql, (err, res) => {
        if (err)
            return result(null, err);
        if (res.affectedRows == 0)
            return result({ msg: "Sub Status not deleted" }, null);
        return result(null, res);
    });
};
module.exports = SubStatusModel;
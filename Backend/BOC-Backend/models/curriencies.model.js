/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const CurrencyModel = function (obj) {
    this.CurrencyId = obj.CurrencyId;
    this.CurrencyCode = obj.CurrencyCode;
    this.CurrencySymbol = obj.CurrencySymbol;
    this.Status = obj.Status;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

//To get all the Currency
CurrencyModel.getAll = result => {
    con.query(`Select CurrencyId,CurrencyCode,CurrencySymbol,Status from tbl_currencies WHERE  IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

CurrencyModel.dropdown = result => {
    con.query(`Select CurrencyId,CurrencyCode,CurrencySymbol,Status from tbl_currencies WHERE Status = 1 AND IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}


//To create a Currency
CurrencyModel.create = (Obj, result) => {
    var sql = `insert into tbl_currencies(CurrencyCode,CurrencySymbol,Status,Created,CreatedBy) values(?,?,?,?,?)`;
    var values = [Obj.CurrencyCode, Obj.CurrencySymbol, Obj.Status, Obj.Created, Obj.CreatedBy];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...Obj });
    });
};

//To get the Currency info
CurrencyModel.findById = (CurrencyId, result) => {
    var sql = `SELECT CurrencyId,CurrencyCode,CurrencySymbol,Status  FROM tbl_currencies   WHERE CurrencyId = ${CurrencyId} `;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        if (res.length) {
            return result(null, res[0]);
        }
        return result({ msg: "Currency not found" }, null);
    });
};

//To update the Currency
CurrencyModel.update = (Obj, result) => {
    var sql = ` UPDATE tbl_currencies SET CurrencyCode = ?, CurrencySymbol = ?,Status = ?,   Modified = ?,Modifiedby = ?  WHERE CurrencyId = ? `;
    var values = [Obj.CurrencyCode, Obj.CurrencySymbol, Obj.Status, Obj.Modified, Obj.Modifiedby, Obj.CurrencyId];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        if (res.affectedRows == 0)
            return result({ msg: "Currency not updated!" }, null);
        result(null, { id: Obj.CurrencyId, ...Obj });
    });
};

//To remove the Currency
CurrencyModel.remove = (id, result) => {
    var sql = `UPDATE tbl_currencies SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE CurrencyId = '${id}' `;
    con.query(sql, (err, res) => {
        if (err)
            return result(null, err);
        if (res.affectedRows == 0)
            return result({ msg: "Currency not deleted" }, null);
        return result(null, res);
    });
};
module.exports = CurrencyModel;
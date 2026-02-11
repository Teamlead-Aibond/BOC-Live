/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const CurrencyExchangeRateModel = function (obj) {
    this.CurrencyRateId = obj.CurrencyRateId;
    this.SourceCurrencyCode = obj.SourceCurrencyCode;
    this.TargetCurrencyCode = obj.TargetCurrencyCode;
    this.ExchangeRate = obj.ExchangeRate;
    this.FromDate = obj.FromDate ? obj.FromDate : null;
    this.ToDate = obj.ToDate ? obj.ToDate : null;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

//To get all the Currency
CurrencyExchangeRateModel.getAll = result => {
    con.query(`Select CurrencyRateId,SourceCurrencyCode,TargetCurrencyCode,ExchangeRate,FromDate,ToDate from tbl_currency_exchange_rate WHERE  IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

CurrencyExchangeRateModel.dropdown = result => {
    con.query(`Select CurrencyRateId,SourceCurrencyCode,TargetCurrencyCode,ExchangeRate,FromDate,ToDate from tbl_currency_exchange_rate WHERE ExchangeRate = 1 AND IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}


//To create a Currency
CurrencyExchangeRateModel.create = (Obj, result) => {
    var sql = `insert into tbl_currency_exchange_rate(SourceCurrencyCode,TargetCurrencyCode,ExchangeRate,FromDate,ToDate,Created,CreatedBy) values(?,?,?,?,?,?,?)`;
    var values = [Obj.SourceCurrencyCode, Obj.TargetCurrencyCode, Obj.ExchangeRate, Obj.FromDate, Obj.ToDate, Obj.Created, Obj.CreatedBy];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...Obj });
    });
};

//To get the Currency info
CurrencyExchangeRateModel.findById = (CurrencyRateId, result) => {
    var sql = `SELECT CurrencyRateId,SourceCurrencyCode,TargetCurrencyCode,ExchangeRate,FromDate,ToDate  FROM tbl_currency_exchange_rate   WHERE CurrencyRateId = ${CurrencyRateId} `;
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
CurrencyExchangeRateModel.update = (Obj, result) => {
    var sql = ` UPDATE tbl_currency_exchange_rate SET SourceCurrencyCode = ?, TargetCurrencyCode = ?,ExchangeRate = ?,FromDate = ?,ToDate = ?,   Modified = ?,Modifiedby = ?  WHERE CurrencyRateId = ? `;
    var values = [Obj.SourceCurrencyCode, Obj.TargetCurrencyCode, Obj.ExchangeRate, Obj.FromDate, Obj.ToDate, Obj.Modified, Obj.Modifiedby, Obj.CurrencyRateId];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        if (res.affectedRows == 0)
            return result({ msg: "Currency not updated!" }, null);
        result(null, { id: Obj.CurrencyRateId, ...Obj });
    });
};

//To remove the Currency
CurrencyExchangeRateModel.remove = (id, result) => {
    var sql = `UPDATE tbl_currency_exchange_rate SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE CurrencyRateId = '${id}' `;
    con.query(sql, (err, res) => {
        if (err)
            return result(null, err);
        if (res.affectedRows == 0)
            return result({ msg: "Currency not deleted" }, null);
        return result(null, res);
    });
};

CurrencyExchangeRateModel.exchange = (Obj, result) => {
    var sql = `SELECT CurrencyRateId,SourceCurrencyCode,TargetCurrencyCode,ExchangeRate,FromDate,ToDate  FROM tbl_currency_exchange_rate   WHERE SourceCurrencyCode = '${Obj.LocalCurrencyCode}' AND TargetCurrencyCode =  '${Obj.BaseCurrencyCode}'`;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        if (res.length) {
            return result(null, res[0]);
        }
        return result({ msg: "Currency not found" }, null);
    });
};

//To Check between the date range
CurrencyExchangeRateModel.checkExists = (Obj, result) => {
    var sql = `SELECT CurrencyRateId FROM tbl_currency_exchange_rate WHERE 
    SourceCurrencyCode='${Obj.SourceCurrencyCode}' AND TargetCurrencyCode='${Obj.TargetCurrencyCode}' AND
    ('${Obj.FromDate}' BETWEEN DATE(FromDate) AND DATE(ToDate) OR
    '${Obj.ToDate}' BETWEEN DATE(FromDate) AND DATE(ToDate)) AND IsDeleted=0 `;
    if (Obj.CurrencyRateId && Obj.CurrencyRateId > 0) {
        sql += ` AND CurrencyRateId NOT IN(${Obj.CurrencyRateId})`
    }
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
};
module.exports = CurrencyExchangeRateModel;
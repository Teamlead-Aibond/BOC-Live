/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");

const CustomerBlanketPOTopUp = function (obj) {
    this.CustomerBlanketPOTopUpId = obj.CustomerBlanketPOTopUpId ? obj.CustomerBlanketPOTopUpId : 0;
    this.CustomerBlanketPOId = obj.CustomerBlanketPOId ? obj.CustomerBlanketPOId : 0;
    this.TopUpAmount = obj.TopUpAmount ? obj.TopUpAmount : '';
    this.TopUptDate = obj.TopUptDate ? obj.TopUptDate : null;
    this.Atachment = obj.Atachment ? obj.Atachment : '';

    this.LocalCurrencyCode = obj.LocalCurrencyCode ? obj.LocalCurrencyCode : '';
    this.ExchangeRate = obj.ExchangeRate ? obj.ExchangeRate : 1;
    this.BaseCurrencyCode = obj.BaseCurrencyCode ? obj.BaseCurrencyCode : '';
    this.BaseTopUpAmount = obj.BaseTopUpAmount ? obj.BaseTopUpAmount : 0;

    this.Created = obj.Created ? obj.Created : cDateTime.getDateTime();
    this.Modified = obj.Modified ? obj.Modified : cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

CustomerBlanketPOTopUp.Create = (obj, result) => {
    obj = escapeSqlValues(obj);
    var sql = `insert into tbl_customer_blanket_po_topup(CustomerBlanketPOId,TopUpAmount,TopUptDate,Atachment,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseTopUpAmount,Created,CreatedBy)
    values('${obj.CustomerBlanketPOId}','${obj.TopUpAmount}','${obj.TopUptDate}','${obj.Atachment}','${obj.LocalCurrencyCode}','${obj.ExchangeRate}','${obj.BaseCurrencyCode}','${obj.BaseTopUpAmount}','${obj.Created}','${obj.CreatedBy}')`;
    //console.log(sql)
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...obj });
    });
};

CustomerBlanketPOTopUp.View = (CustomerBlanketPOTopUpId, result) => {
    con.query(`Select T.*,DATE_FORMAT(T.Created,'%Y-%m-%d') as TopUpDate From tbl_customer_blanket_po_topup as T
    where T.IsDeleted=0 and  T.CustomerBlanketPOTopUpId='${CustomerBlanketPOTopUpId}'`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not found" }, null);
    });
}

CustomerBlanketPOTopUp.ListTopUpByPO = (CustomerBlanketPOId, result) => {
    con.query(`Select T.*,DATE_FORMAT(T.Created,'%Y-%m-%d') as TopUpDate , CONCAT(U.FirstName,' ' , U.LastName) as UserContactName  
    From tbl_customer_blanket_po_topup as T
    LEFT JOIN tbl_users as U ON U.UserId = T.CreatedBy
    where T.IsDeleted=0 and  CustomerBlanketPOId='${CustomerBlanketPOId}'`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res);
            return;
        }
        result({ kind: "not found" }, null);
    });
}

module.exports = CustomerBlanketPOTopUp;


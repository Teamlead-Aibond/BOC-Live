/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const CustomerBlanketPOHistoryLog = function (obj) {
    this.BlanketPOHistoryLogId = obj.BlanketPOHistoryLogId ? obj.BlanketPOHistoryLogId : 0;
    this.BlanketPOHistoryId = obj.BlanketPOHistoryId ? obj.BlanketPOHistoryId : 0;
    this.BlanketPONetAmount = obj.BlanketPONetAmount ? obj.BlanketPONetAmount : 0;
    this.Amount = obj.Amount ? obj.Amount : 0;
    this.DifferenceAmount = obj.DifferenceAmount ? obj.DifferenceAmount : 0;
    this.Created = obj.Created ? obj.Created : cDateTime.getDateTime();
    this.Modified = obj.Modified ? obj.Modified : cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

CustomerBlanketPOHistoryLog.Create = (obj, result) => {
    obj = new CustomerBlanketPOHistoryLog(obj)
    var sql = `insert into tbl_customer_blanket_po_history_log(BlanketPOHistoryId,BlanketPONetAmount,Amount,DifferenceAmount,Created,CreatedBy)
    values('${obj.BlanketPOHistoryId}','${obj.BlanketPONetAmount}','${obj.Amount}','${obj.DifferenceAmount}','${obj.Created}','${obj.CreatedBy}')`;
    //console.log(sql)
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...obj });
    });
};
module.exports = CustomerBlanketPOHistoryLog;


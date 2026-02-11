/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const PartItemShopStockLog = function (obj) {
    this.StockLogId = obj.StockLogId ? obj.StockLogId : 0;
    this.PartId = obj.PartId ? obj.PartId : 0;
    this.ShopPartItemId = obj.ShopPartItemId ? obj.ShopPartItemId : 0;
    this.StockType = obj.StockType ? obj.StockType : 0;
    this.Quantity = obj.Quantity ? obj.Quantity : 0;
    this.MROId = obj.MROId ? obj.MROId : 0;
    this.SOItemId = obj.SOItemId ? obj.SOItemId : 0;

    this.Created = obj.Created ? obj.Created : cDateTime.getDateTime();
    this.Modified = obj.Modified ? obj.Modified : cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

PartItemShopStockLog.Create = (obj, result) => {
    obj = new PartItemShopStockLog(obj)
    var sql = `insert into tbl_parts_item_shop_stock_log(PartId,ShopPartItemId,StockType,Quantity,MROId,SOItemId,Created,CreatedBy)
    values('${obj.PartId}','${obj.ShopPartItemId}','${obj.StockType}','${obj.Quantity}','${obj.MROId}','${obj.SOItemId}','${obj.Created}','${obj.CreatedBy}')`;
    //console.log(sql)
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...obj });
    });
};
module.exports = PartItemShopStockLog;


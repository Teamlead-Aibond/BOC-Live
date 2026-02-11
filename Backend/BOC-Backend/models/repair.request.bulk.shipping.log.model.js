/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");

const RRBulkShippingLog = function FuncName(Obj) {
    this.BulkShipLogId = Obj.BulkShipLogId ? Obj.BulkShipLogId : 0;
    this.BulkShipId = Obj.BulkShipId ? Obj.BulkShipId : 0;
    this.ShippingHistoryId = Obj.ShippingHistoryId ? Obj.ShippingHistoryId : 0;
    this.RRId = Obj.RRId ? Obj.RRId : 0;
    this.Created = Obj.Created ? Obj.Created : cDateTime.getDateTime();
    this.Modified = Obj.Modified ? Obj.Modified : cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;
};

RRBulkShippingLog.Create = (objModel, result) => {

    objModel = escapeSqlValues(objModel);
    var sql = `insert into tbl_repair_request_bulk_shipping_log(
    BulkShipId,ShippingHistoryId,RRId,Created,CreatedBy)
    values('${objModel.BulkShipId}','${objModel.ShippingHistoryId}','${objModel.RRId}','${objModel.Created}','${objModel.CreatedBy}')`;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        else {
            return result(null, res);
        }
    });
};
module.exports = RRBulkShippingLog;

/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');

const InventoryLossPreventionLogModel = function FuncName(obj) {
    this.LossPreventionLogId = obj.LossPreventionLogId ? obj.LossPreventionLogId : 0;
    this.InventoryId = obj.InventoryId ? obj.InventoryId : 0;
    this.PartId = obj.PartId ? obj.PartId : 0;
    this.PartItemId = obj.PartItemId ? obj.PartItemId : 0;
    this.RFIDTagNo = obj.RFIDTagNo ? obj.RFIDTagNo : 0;
    this.Status = obj.Status ? obj.Status : 0;
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.Created = cDateTime.getDateTime();
};

InventoryLossPreventionLogModel.create = (Jsonobj, result) => {
    var Obj = new InventoryLossPreventionLogModel(Jsonobj);

    var duplicateCheck = `SELECT COUNT(1) AS Count FROM tbl_inventory_loss_prevention_log WHERE InventoryId=${Obj.InventoryId}`
    con.query(duplicateCheck, (err, res) => {
        if (res[0].Count <= 0) {
            var sql = `insert into tbl_inventory_loss_prevention_log(InventoryId,PartId,PartItemId,RFIDTagNo,Status,Created,CreatedBy)
                    values(?,?,?,?,?,?,?)`;

            var values = [
                Obj.InventoryId, Obj.PartId, Obj.PartItemId, Obj.RFIDTagNo,
                Obj.Status,
                Obj.Created, Obj.CreatedBy
            ]

            con.query(sql, values, (err, res) => {
                if (err) {
                    // console.log("error: ", err);
                    result(err, null);
                    return;
                }
                Jsonobj.PartId = res.insertId;
                result(null, { id: res.insertId, ...Jsonobj });
            });
        }
        else {
            var sql = `UPDATE tbl_inventory_loss_prevention_log  SET Created=?,CreatedBy=?  WHERE InventoryId = ?`;


            var values = [
                Obj.Created, Obj.CreatedBy, Obj.InventoryId
            ]

            con.query(sql, values, (err, res) => {
                if (err) {
                    //  console.log("error: ", err);
                    result(err, null);
                    return;
                }
                result(null, { id: Obj.InventoryId, ...Jsonobj });
            });
        }
    })

};

module.exports = InventoryLossPreventionLogModel;
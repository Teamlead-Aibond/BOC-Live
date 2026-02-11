/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");

const RepairRequestGmTrackerModel = function (obj) {
    this.RRGMTrackerId = obj.RRGMTrackerId ? obj.RRGMTrackerId : 0;
    this.RRId = obj.RRId ? obj.RRId : null;
    this.IsBroken = obj.IsBroken != '' ? obj.IsBroken : null;
    this.ApprovedFor = obj.ApprovedFor ? obj.ApprovedFor : '';
    this.ReasonForFailure = obj.ReasonForFailure ? obj.ReasonForFailure : '';
    this.FailedOnInstall = obj.FailedOnInstall != '' ? obj.FailedOnInstall : null;
    this.IsScrap = obj.IsScrap != '' ? obj.IsScrap : null;
    this.FailedOnInstallNotes = obj.FailedOnInstallNotes ? obj.FailedOnInstallNotes : '';
    this.Requestor = obj.Requestor ? obj.Requestor : '';
    this.GCCLItem = obj.GCCLItem ? obj.GCCLItem : '';
    this.RepairWarrantyExpiration = obj.RepairWarrantyExpiration ? obj.RepairWarrantyExpiration : '';
    this.OpenOrderStatus = obj.OpenOrderStatus ? obj.OpenOrderStatus : null;
    this.AccountValuationClass = obj.AccountValuationClass ? obj.AccountValuationClass : '';
    this.ReceiptMonth = obj.ReceiptMonth ? obj.ReceiptMonth : null;
    this.ReceiptYear = obj.ReceiptYear ? obj.ReceiptYear : null;
    this.CoreReturnMonth = obj.CoreReturnMonth ? obj.CoreReturnMonth : null;
    this.CoreReturnYear = obj.CoreReturnYear ? obj.CoreReturnYear : null;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

//To create a Repair Request GM Tracker
RepairRequestGmTrackerModel.create = (Obj, result) => {
    var sql = `insert into tbl_repair_request_gm_tracker(RRId,IsBroken,ApprovedFor,ReasonForFailure,FailedOnInstall,FailedOnInstallNotes,Requestor,GCCLItem,RepairWarrantyExpiration,OpenOrderStatus,AccountValuationClass,ReceiptMonth,ReceiptYear,CoreReturnMonth,CoreReturnYear,IsScrap,Created,CreatedBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    var values = [Obj.RRId, Obj.IsBroken, Obj.ApprovedFor, Obj.ReasonForFailure, Obj.FailedOnInstall, Obj.FailedOnInstallNotes, Obj.Requestor, Obj.GCCLItem, Obj.RepairWarrantyExpiration, Obj.OpenOrderStatus, Obj.AccountValuationClass, Obj.ReceiptMonth, Obj.ReceiptYear, Obj.CoreReturnMonth, Obj.CoreReturnYear, Obj.IsScrap, Obj.Created, Obj.CreatedBy];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...Obj });
    });
};

//To update the Repair Request GM Tracker
RepairRequestGmTrackerModel.update = (Obj, result) => {
    var checkRRIdExistsSql = `SELECT * FROM tbl_repair_request_gm_tracker WHERE RRId = ${Obj.RRId} AND RRGMTrackerId != ${Obj.RRGMTrackerId} AND IsDeleted = 0`;

    con.query(checkRRIdExistsSql, (e, data) => {
        if (data && data.length > 0) {
            return result({ msg: " " + Obj.RRId + ' is already exist' }, null);
        } else {
            var sql = ` UPDATE tbl_repair_request_gm_tracker SET RRId = ?,IsBroken = ?,ApprovedFor = ?,ReasonForFailure = ?,FailedOnInstall = ?,FailedOnInstallNotes = ?,Requestor = ?,GCCLItem = ?,RepairWarrantyExpiration = ?,OpenOrderStatus = ?,AccountValuationClass = ?,ReceiptMonth = ?,ReceiptYear = ?,CoreReturnMonth = ?,CoreReturnYear = ?, IsScrap = ?,Modified = ?,ModifiedBy = ?  WHERE RRGMTrackerId = ? `;
            var values = [Obj.RRId, Obj.IsBroken, Obj.ApprovedFor, Obj.ReasonForFailure, Obj.FailedOnInstall, Obj.FailedOnInstallNotes, Obj.Requestor, Obj.GCCLItem, Obj.RepairWarrantyExpiration, Obj.OpenOrderStatus, Obj.AccountValuationClass, Obj.ReceiptMonth, Obj.ReceiptYear, Obj.CoreReturnMonth, Obj.CoreReturnYear, Obj.IsScrap, Obj.Modified, Obj.ModifiedBy, Obj.RRGMTrackerId];
            con.query(sql, values, (err, res) => {
                if (err)
                    return result(err, null);
                if (res.affectedRows == 0)
                    return result({ msg: "GM Tracker not updated!" }, null);
                result(null, { id: Obj.RRGMTrackerId, ...Obj });
            });
        }
    });
};

//To get the Repair Request GM Tracker info
RepairRequestGmTrackerModel.findById = (RRGMTrackerId, result) => {
    var sql = `SELECT RRGMTrackerId,RRId,IsBroken,ApprovedFor,ReasonForFailure,FailedOnInstall,FailedOnInstallNotes,IsScrap,Requestor,GCCLItem,RepairWarrantyExpiration,OpenOrderStatus,AccountValuationClass,ReceiptMonth,ReceiptYear,CoreReturnMonth,CoreReturnYear,Created,CreatedBy,Modified,ModifiedBy 
    from tbl_repair_request_gm_tracker WHERE RRGMTrackerId = ${RRGMTrackerId} AND IsDeleted = 0 `;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        if (res.length) {
            return result(null, res[0]);
        }
        return result({ msg: "GM Tracker not found" }, null);
    });
};

// To remove the Repair Request GM Tracker
RepairRequestGmTrackerModel.delete = (id, result) => {
    var sql = `UPDATE tbl_repair_request_gm_tracker SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE RRGMTrackerId = '${id}' `;
    con.query(sql, (err, res) => {
        if (err)
            return result(null, err);
        if (res.affectedRows == 0)
            return result({ msg: "GM Tracker not deleted" }, null);
        return result(null, res);
    });
};

RepairRequestGmTrackerModel.ViewRRGMTracker = (RRId) => {
    var sql = `Select rrgt.RRGMTrackerId,rrgt.RRId,rrgt.IsBroken,rrgt.ApprovedFor,rrgt.ReasonForFailure,
    rrgt.FailedOnInstall,rrgt.FailedOnInstallNotes,rrgt.Requestor,rrgt.GCCLItem,rrgt.RepairWarrantyExpiration,
    rrgt.OpenOrderStatus,rrgt.AccountValuationClass,rrgt.ReceiptMonth,rrgt.ReceiptYear,rrgt.CoreReturnMonth,
    rrgt.CoreReturnYear,rrgt.Created,rrgt.CreatedBy,rrgt.Modified,rrgt.ModifiedBy,IsScrap
    from tbl_repair_request_gm_tracker rrgt
    Left Join tbl_repair_request rr on rrgt.RRId=rr.RRId
    where rrgt.IsDeleted=0 and rrgt.RRId=${RRId} `;
    return sql;
}

// Check if exist RRId
RepairRequestGmTrackerModel.checkRRIdExistsSql = (RRId, result) => {
    var sql = `SELECT RRId FROM tbl_repair_request_gm_tracker WHERE RRId = ${RRId} and IsDeleted = 0`;
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, res);
    });
};

module.exports = RepairRequestGmTrackerModel;
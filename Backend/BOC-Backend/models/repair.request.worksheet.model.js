/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");

const RepairRequestWorksheetModel = function (obj) {
    // this.RRGMTrackerId = obj.RRGMTrackerId ? obj.RRGMTrackerId : 0;
    // this.RRId = obj.RRId ? obj.RRId : null;
    // this.IsBroken = obj.IsBroken != '' ? obj.IsBroken : null;
    // this.ApprovedFor = obj.ApprovedFor ? obj.ApprovedFor : '';
    // this.ReasonForFailure = obj.ReasonForFailure ? obj.ReasonForFailure : '';
    // this.FailedOnInstall = obj.FailedOnInstall != '' ? obj.FailedOnInstall : null;
    // this.IsScrap = obj.IsScrap != '' ? obj.IsScrap : null;
    // this.FailedOnInstallNotes = obj.FailedOnInstallNotes ? obj.FailedOnInstallNotes : '';
    // this.Requestor = obj.Requestor ? obj.Requestor : '';
    // this.GCCLItem = obj.GCCLItem ? obj.GCCLItem : '';
    // this.RepairWarrantyExpiration = obj.RepairWarrantyExpiration ? obj.RepairWarrantyExpiration : '';
    // this.OpenOrderStatus = obj.OpenOrderStatus ? obj.OpenOrderStatus : null;
    // this.AccountValuationClass = obj.AccountValuationClass ? obj.AccountValuationClass : '';
    // this.ReceiptMonth = obj.ReceiptMonth ? obj.ReceiptMonth : null;
    // this.ReceiptYear = obj.ReceiptYear ? obj.ReceiptYear : null;
    // this.CoreReturnMonth = obj.CoreReturnMonth ? obj.CoreReturnMonth : null;
    // this.CoreReturnYear = obj.CoreReturnYear ? obj.CoreReturnYear : null;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

//To Get a Repair Request Worksheet
RepairRequestWorksheetModel.getAll = (result) => {
    return result(null, {MotorChecklist: Constants.MotorChecklist, MotorWithBrakeChecklist: Constants.MotorWithBrakeChecklist, BrakeMotorChecklist: Constants.BrakeMotorChecklist});
};


module.exports = RepairRequestWorksheetModel;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
// const { request } = require("../app.js");

const PoItem = function (objPoItem) {
  this.POItemId = objPoItem.POItemId;
  this.POId = objPoItem.POId;
  this.PartId = objPoItem.PartId;
  this.PartNo = objPoItem.PartNo;
  this.Description = objPoItem.Description;
  this.LeadTime = objPoItem.LeadTime;
  this.Quantity = objPoItem.Quantity;
  this.WarrantyPeriod = objPoItem.WarrantyPeriod;
  this.PurchaseUnit = objPoItem.PurchaseUnit;
  this.Rate = objPoItem.Rate;
  this.Price = objPoItem.Price;
  this.IsAddedToVendorBill = objPoItem.IsAddedToVendorBill;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  this.TimeUpdated = objPoItem.TimeUpdated;

  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objPoItem.authuser && objPoItem.authuser.UserId) ? objPoItem.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objPoItem.authuser && objPoItem.authuser.UserId) ? objPoItem.authuser.UserId : TokenUserId;

  this.Status = objPoItem.Status;
  this.IsDeleted = 0;
}

PoItem.GetPODetails = (PONo, result) => {
  con.query(`SELECT poi.POId,poi.PartId,poi.Quantity,poi.PartNo FROM tbl_po_item poi
    Inner Join tbl_po po on po.POId=poi.POId
    where po.PONo='${PONo}';`, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
}

module.exports = PoItem;
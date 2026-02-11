/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const MROVendorParts = function (obj) {

    this.RRVendorPartsId = obj.RRVendorPartsId;
    this.IsIncludeInQuote = obj.IsIncludeInQuote ? obj.IsIncludeInQuote : 0;
    this.RRId = obj.RRId ? obj.RRId : 0;
    this.MROId = obj.MROId ? obj.MROId : 0;
    this.RRVendorId = obj.RRVendorId ? obj.RRVendorId : 0;
    this.PartId = obj.PartId ? obj.PartId : 0;
    this.VendorId = obj.VendorId;
    this.PartNo = obj.PartNo ? obj.PartNo : '';
    this.Description = obj.Description ? obj.Description : '';
    this.LeadTime = obj.LeadTime ? obj.LeadTime : '';
    this.Quantity = obj.Quantity ? obj.Quantity : 1;
    this.Rate = obj.Rate ? obj.Rate : 0;
    this.Price = obj.Price ? obj.Price : 0;

    this.Tax = obj.Tax ? obj.Tax : 0;
    this.ItemTaxPercent = obj.ItemTaxPercent ? obj.ItemTaxPercent : 0;
    this.ItemLocalCurrencyCode = obj.ItemLocalCurrencyCode ? obj.ItemLocalCurrencyCode : '';
    this.ItemExchangeRate = obj.ItemExchangeRate ? obj.ItemExchangeRate : 1;
    this.ItemBaseCurrencyCode = obj.ItemBaseCurrencyCode ? obj.ItemBaseCurrencyCode : '';
    this.BasePrice = obj.BasePrice ? obj.BasePrice : 0;

    this.ShippingCharge = obj.ShippingCharge ? obj.ShippingCharge : 0;
    this.BaseShippingCharge = obj.BaseShippingCharge ? obj.BaseShippingCharge : 0;

    this.WarrantyPeriod = obj.WarrantyPeriod ? obj.WarrantyPeriod : 0;
    this.WarrantyStartDate = obj.WarrantyStartDate;
    this.WarrantyEndDate = obj.WarrantyEndDate;
    this.WarrantyActivatedDate = obj.WarrantyActivatedDate;
    this.WarrantyActivatedBy = obj.WarrantyActivatedBy;
    this.WarrantyTrigger = obj.WarrantyTrigger;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.StatusPartId = obj.StatusPartId;
    this.Status = obj.Status ? obj.Status : 0;
    this.VendorPartsList = obj.VendorPartsList;
};

MROVendorParts.ViewVendorParts1 = (MROId, RRVendorId, result) => {
    var sql = `Select RRVendorPartsId,rrp.RRVendorId,rrp.RRId,rrp.PartId,rrp.PartNo,rrp.VendorId,rrp.Description,LeadTime,Quantity,Rate
    ,rrp.Price,WarrantyPeriod,WarrantyStartDate,rrp.Tax,rrp.ItemTaxPercent,rrp.ItemLocalCurrencyCode,rrp.ItemExchangeRate,rrp.ItemBaseCurrencyCode,rrp.BasePrice,rrp.BaseRate,rrp.BaseTax
    ,WarrantyEndDate,WarrantyActivatedDate,WarrantyActivatedBy,WarrantyTrigger ,'0' as SerialNo, GS.AHCommissionPercent,rrp.ShippingCharge,rrp.BaseShippingCharge
    from tbl_repair_request_vendor_parts rrp
    INNER join tbl_mro mro on rrp.MROId=mro.MROId
    LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
    where rrp.IsDeleted=0 and rrp.IsIncludeInQuote=1 and rrp.RRVendorId =${RRVendorId} and rrp.MROId=${MROId}`;
    //console.log("Vendor parts" + sql);
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
        return;
    });
};

MROVendorParts.ViewVendorPartsById = (MROId, RRVendorId) => {
    var sql = `Select RRVendorPartsId,IsIncludeInQuote,RRVendorId,RRId,PartId,VendorId,PartNo,Description,LeadTime,Quantity,Rate,Price,
        Tax,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,BaseRate,BaseTax,
         WarrantyPeriod,WarrantyStartDate,WarrantyEndDate,WarrantyActivatedDate,WarrantyActivatedBy,WarrantyTrigger,ShippingCharge,BaseShippingCharge 
      from tbl_repair_request_vendor_parts where IsDeleted=0 and RRVendorId =${RRVendorId} AND MROId=${MROId}`;
    //console.log(sql);
    return sql;
}

MROVendorParts.ViewVendorParts = (MROId) => {
    var sql = `Select RRVendorPartsId,RRVendorId,MROId,RRId,PartId,PartNo,VendorId,Description,LeadTime,Quantity,Rate,Price,
    Tax,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,BaseRate,BaseTax,
    WarrantyPeriod,WarrantyStartDate,WarrantyEndDate,WarrantyActivatedDate,WarrantyActivatedBy,WarrantyTrigger,IsIncludeInQuote,ShippingCharge,BaseShippingCharge 
    from tbl_repair_request_vendor_parts where IsDeleted=0 and MROId=${MROId} `;
    // console.log(sql);
    return sql;
}
module.exports = MROVendorParts;
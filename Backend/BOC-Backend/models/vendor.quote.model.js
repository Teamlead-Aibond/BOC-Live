/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");
const VendorQuote = function (objVendorQuote) {
  this.VendorQuoteId = objVendorQuote.VendorQuoteId;
  this.QuoteId = objVendorQuote.QuoteId ? objVendorQuote.QuoteId : 0;
  this.MROId = objVendorQuote.MROId ? objVendorQuote.MROId : 0;
  this.VendorId = objVendorQuote.VendorId ? objVendorQuote.VendorId : 0;
  this.RRId = objVendorQuote.RRId ? objVendorQuote.RRId : 0;
  this.RouteCause = objVendorQuote.RouteCause ? objVendorQuote.RouteCause : '';
  this.SubTotal = objVendorQuote.SubTotal ? objVendorQuote.SubTotal : 0;
  this.AdditionalCharge = objVendorQuote.AdditionalCharge ? objVendorQuote.AdditionalCharge : 0;
  this.TaxPercent = objVendorQuote.TaxPercent ? objVendorQuote.TaxPercent : 0;
  this.TotalTax = objVendorQuote.TotalTax ? objVendorQuote.TotalTax : 0;
  this.Discount = objVendorQuote.Discount ? objVendorQuote.Discount : 0;
  this.Shipping = objVendorQuote.Shipping ? objVendorQuote.Shipping : 0;
  this.GrandTotal = objVendorQuote.GrandTotal ? objVendorQuote.GrandTotal : 0;
  this.QuoteItemId = objVendorQuote.QuoteItemId ? objVendorQuote.QuoteItemId : 0;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objVendorQuote.authuser && objVendorQuote.authuser.UserId) ? objVendorQuote.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objVendorQuote.authuser && objVendorQuote.authuser.UserId) ? objVendorQuote.authuser.UserId : TokenUserId;

  this.Status = objVendorQuote.Status ? objVendorQuote.Status : 0;
  this.VendorsList = objVendorQuote.VendorsList;
  this.VendorPartsList = objVendorQuote.VendorPartsList;

  this.LeadTime = objVendorQuote.LeadTime ? objVendorQuote.LeadTime : 0;
  this.WarrantyPeriod = objVendorQuote.WarrantyPeriod ? objVendorQuote.WarrantyPeriod : 0;
  this.LocalCurrencyCode = objVendorQuote.LocalCurrencyCode ? objVendorQuote.LocalCurrencyCode : '';
  this.ExchangeRate = objVendorQuote.ExchangeRate ? objVendorQuote.ExchangeRate : 0;
  this.BaseCurrencyCode = objVendorQuote.BaseCurrencyCode ? objVendorQuote.BaseCurrencyCode : '';
  this.BaseGrandTotal = objVendorQuote.BaseGrandTotal ? objVendorQuote.BaseGrandTotal : 0;


  const TokenCreatedByLocation = global.authuser.Location ? global.authuser.Location : 0;
  this.CreatedByLocation = (objVendorQuote.authuser && objVendorQuote.authuser.Location) ? objVendorQuote.authuser.Location : TokenCreatedByLocation;

}
VendorQuote.ViewVendorQuoteByMRO = (MROId) => {
  return sql = `Select *
  from tbl_vendor_quote as vq
  LEFT JOIN tbl_vendor_quote_item as vqi ON vq.VendorQuoteId = vqi.VendorQuoteId and vqi.IsDeleted=0
  where vq.IsDeleted=0 and vq.MROId=${MROId}`;

}

VendorQuote.ViewVendorQuoteByMROWithGroup = (MROId) => {
  var sql = `Select *
  from tbl_vendor_quote as vq
  LEFT JOIN tbl_vendor_quote_item as vqi ON vq.VendorQuoteId = vqi.VendorQuoteId and vqi.IsDeleted=0
  where vq.IsDeleted=0 and vq.MROId=${MROId} GROUP BY vq.VendorId`;
  console.log(sql);
  return sql;

}
VendorQuote.ViewVendorQuoteOnlyByMRO = (MROId) => {
  return sql = `Select *
  from tbl_vendor_quote as vq
  where vq.IsDeleted=0 and vq.MROId=${MROId}`;

}


VendorQuote.CreateVendorQuote = (RRVendors1, result) => {
  var RRVendors = new VendorQuote(RRVendors1);
  var sql = `insert into  tbl_vendor_quote
    (QuoteId,MROId,RRId,VendorId,SubTotal,AdditionalCharge,TaxPercent,TotalTax,Discount,Shipping,GrandTotal,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal,LeadTime,WarrantyPeriod,QuoteItemId,RouteCause,Created,CreatedBy,Status,CreatedByLocation) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [RRVendors.QuoteId, RRVendors.MROId, RRVendors.RRId, RRVendors.VendorId, RRVendors.SubTotal, RRVendors.AdditionalCharge, RRVendors.TaxPercent, RRVendors.TotalTax, RRVendors.Discount, RRVendors.Shipping, RRVendors.GrandTotal,
  RRVendors.LocalCurrencyCode, RRVendors.ExchangeRate, RRVendors.BaseCurrencyCode, RRVendors.BaseGrandTotal, RRVendors.LeadTime, RRVendors.WarrantyPeriod, RRVendors.QuoteItemId, RRVendors.RouteCause, RRVendors.Created, RRVendors.CreatedBy, RRVendors.Status, RRVendors.CreatedByLocation]
  console.log(sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;

  });
};

VendorQuote.CreateVendorQuoteForMRODuplicate = (ObjList, result) => {

  var sql = `insert into  tbl_vendor_quote
    (QuoteId,MROId,RRId,VendorId,SubTotal,AdditionalCharge,TaxPercent,TotalTax,Discount,Shipping,GrandTotal,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal,LeadTime,WarrantyPeriod,
      QuoteItemId,RouteCause,Created,CreatedBy,Status,CreatedByLocation)
     values `;
  for (let row of ObjList) {
    row = escapeSqlValues(row);
    let val = new VendorQuote(row);
    sql = sql + `('${val.QuoteId}','${val.MROId}','${val.RRId}',
  '${val.VendorId}','${val.SubTotal}','${val.AdditionalCharge}','${val.TaxPercent}',
  '${val.TotalTax}','${val.Discount}','${val.Shipping}','${val.GrandTotal}',
  '${val.LocalCurrencyCode}','${val.ExchangeRate}','${val.BaseCurrencyCode}','${val.BaseGrandTotal}',
  '${val.LeadTime}','${val.WarrantyPeriod}','${val.QuoteItemId}','${val.RouteCause}',
  '${val.Created}','${val.CreatedBy}','${val.Status}','${val.CreatedByLocation}'),`;
  }
  var Query = sql.slice(0, -1);
  // console.log("Final sql=" + Query);
  con.query(Query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, ObjList);
  });
};


VendorQuote.UpdateVendorQuote = (obj, result) => {

  obj = escapeSqlValues(obj);
  let val = new VendorQuote(obj);

  var sql = `UPDATE tbl_vendor_quote SET VendorId = '${val.VendorId}',RouteCause = '${val.RouteCause}',
  AdditionalCharge = '${val.AdditionalCharge}',TaxPercent = '${val.TaxPercent}',
  TotalTax ='${val.TotalTax}', Discount = '${val.Discount}',
  Shipping = '${val.Shipping}',GrandTotal = '${val.GrandTotal}', 
  LocalCurrencyCode = '${val.LocalCurrencyCode}', ExchangeRate = '${val.ExchangeRate}', BaseCurrencyCode = '${val.BaseCurrencyCode}', BaseGrandTotal = '${val.BaseGrandTotal}', 
  LeadTime = '${val.LeadTime}',
  WarrantyPeriod = '${val.WarrantyPeriod}' where  VendorQuoteId = '${val.VendorQuoteId}' `;

  // console.log("VQ =" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.affectedRows == 0) {
      return result({ msg: "VendorQuote not found" }, null);
    }
    return result(null, obj);
  });
};
//
VendorQuote.DeleteVendorQuoteQuery = (RRId) => {
  var Obj = new VendorQuote({ RRId: RRId });
  var sql = `UPDATE tbl_vendor_quote SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE RRId=${Obj.RRId}`;
  // console.log("sql=" + sql);
  return sql;
};

VendorQuote.UpdateSumOfValue = (Quotes, result) => {
  // console.log("UpdateSumOfValue vendor.quote.model.js");
  // console.log(Quotes);
  var TotalValue = Quotes.TotalValue + Quotes.ProcessFee + Quotes.TotalTax + Quotes.ShippingFee;

  var GrandTotal = TotalValue - Quotes.Discount;

  var BaseGrandTotal = Quotes.BaseGrandTotal ? Quotes.BaseGrandTotal : 0;

  // var BaseGrandTotal = Quotes.BaseGrandTotal;

  var sql = `UPDATE tbl_vendor_quote  SET SubTotal='${Quotes.TotalValue}',GrandTotal='${GrandTotal}', BaseGrandTotal='${BaseGrandTotal}' WHERE QuoteId = ${Quotes.QuoteId}`;

  // console.log(sql);
  con.query(sql, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: Quotes.QuoteId, ...Quotes });
    return;
  }
  );

};
module.exports = VendorQuote;
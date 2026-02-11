/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");
const VendorQuoteItem = function (objVendorQuoteItem) {
  this.VendorQuoteItemId = objVendorQuoteItem.VendorQuoteItemId;
  this.VendorQuoteId = objVendorQuoteItem.VendorQuoteId ? objVendorQuoteItem.VendorQuoteId : 0;
  this.QuoteId = objVendorQuoteItem.QuoteId ? objVendorQuoteItem.QuoteId : 0;
  this.IsIncludeInQuote = objVendorQuoteItem.IsIncludeInQuote ? objVendorQuoteItem.IsIncludeInQuote : 0;
  this.RRId = objVendorQuoteItem.RRId ? objVendorQuoteItem.RRId : 0;
  this.VendorId = objVendorQuoteItem.VendorId ? objVendorQuoteItem.VendorId : 0;
  this.PartId = objVendorQuoteItem.PartId ? objVendorQuoteItem.PartId : 0;
  this.PartNo = objVendorQuoteItem.PartNo ? objVendorQuoteItem.PartNo : '';
  this.Description = objVendorQuoteItem.Description ? objVendorQuoteItem.Description : '';
  this.LeadTime = objVendorQuoteItem.LeadTime ? objVendorQuoteItem.LeadTime : '';
  this.Quantity = objVendorQuoteItem.Quantity ? objVendorQuoteItem.Quantity : 1;
  this.Rate = objVendorQuoteItem.Rate ? objVendorQuoteItem.Rate : 0;
  this.Price = objVendorQuoteItem.Price ? objVendorQuoteItem.Price : 0;
  this.Tax = objVendorQuoteItem.Tax ? objVendorQuoteItem.Tax : 0;
  this.ItemTaxPercent = objVendorQuoteItem.ItemTaxPercent ? objVendorQuoteItem.ItemTaxPercent : 0;
  this.ItemLocalCurrencyCode = objVendorQuoteItem.ItemLocalCurrencyCode ? objVendorQuoteItem.ItemLocalCurrencyCode : '';
  this.ItemExchangeRate = objVendorQuoteItem.ItemExchangeRate ? objVendorQuoteItem.ItemExchangeRate : 1;
  this.ItemBaseCurrencyCode = objVendorQuoteItem.ItemBaseCurrencyCode ? objVendorQuoteItem.ItemBaseCurrencyCode : '';
  this.BasePrice = objVendorQuoteItem.BasePrice ? objVendorQuoteItem.BasePrice : 0;

  this.BaseRate = objVendorQuoteItem.BaseRate ? objVendorQuoteItem.BaseRate : 0;
  this.BaseTax = objVendorQuoteItem.BaseTax ? objVendorQuoteItem.BaseTax : 0;

  this.ShippingCharge = objVendorQuoteItem.ShippingCharge ? objVendorQuoteItem.ShippingCharge : 0;
  this.BaseShippingCharge = objVendorQuoteItem.BaseShippingCharge ? objVendorQuoteItem.BaseShippingCharge : 0;


  this.WarrantyPeriod = objVendorQuoteItem.WarrantyPeriod ? objVendorQuoteItem.WarrantyPeriod : 0;
  this.WarrantyStartDate = objVendorQuoteItem.WarrantyStartDate;
  this.WarrantyEndDate = objVendorQuoteItem.WarrantyEndDate;
  this.WarrantyActivatedDate = objVendorQuoteItem.WarrantyActivatedDate;
  this.WarrantyActivatedBy = objVendorQuoteItem.WarrantyActivatedBy;
  this.WarrantyTrigger = objVendorQuoteItem.WarrantyTrigger;
  this.VendorAttachment = objVendorQuoteItem.VendorAttachment ? objVendorQuoteItem.VendorAttachment : '';
  this.AttachmentMimeType = objVendorQuoteItem.AttachmentMimeType ? objVendorQuoteItem.AttachmentMimeType : '';
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objVendorQuoteItem.authuser && objVendorQuoteItem.authuser.UserId) ? objVendorQuoteItem.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objVendorQuoteItem.authuser && objVendorQuoteItem.authuser.UserId) ? objVendorQuoteItem.authuser.UserId : TokenUserId;
  this.StatusPartId = objVendorQuoteItem.StatusPartId;
  this.Status = objVendorQuoteItem.Status ? objVendorQuoteItem.Status : 0;
  this.VendorPartsList = objVendorQuoteItem.VendorPartsList;
  this.WebLink = objVendorQuoteItem.WebLink ? objVendorQuoteItem.WebLink : '';
  this.QuoteItemId = objVendorQuoteItem.QuoteItemId ? objVendorQuoteItem.QuoteItemId : 0;
};


VendorQuoteItem.CreateVendorQuoteItem = (VendorQuoteId, QuoteId, QuoteItem, result) => {
  // console.log("####################@@@@@@@@###############");
  // console.log(QuoteItem)
  var sql = `insert into tbl_vendor_quote_item
  (VendorQuoteId,QuoteId,VendorId,RRId, PartId,PartNo,Description,LeadTime,Quantity,Rate,Price,Tax,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,  Created,  CreatedBy, Status,WarrantyPeriod,VendorAttachment,AttachmentMimeType,
    WebLink,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge)
  values `;
  for (let val1 of QuoteItem) {
    val1 = escapeSqlValues(val1);
    var val = new VendorQuoteItem(val1);
    sql = sql + `('${VendorQuoteId}','${QuoteId}','${val.VendorId}','${val.RRId}','${val.PartId}','
      ${val.PartNo}',"${val.Description}",'${val.LeadTime}','${val.Quantity}','${val.Rate}','${val.Price}',
      '${val.Tax}','${val.ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${val.ItemExchangeRate}','${val.ItemBaseCurrencyCode}','${val.BasePrice}','${val.Created}','${val.CreatedBy}','${val.Status}','${val.WarrantyPeriod}','${val.VendorAttachment}','${val.AttachmentMimeType}','${val.WebLink}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}'),`;

  }
  var Query = sql.slice(0, -1);
  //console.log("Vendor Quote Item : " + Query);
  con.query(Query, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    //console.log(res.insertId);
    result(null, { id: res.insertId });
    return;
  });
};

VendorQuoteItem.CreateVendorQuoteItemForMRODuplicate = (QuoteItem, result) => {
  var sql = `insert into tbl_vendor_quote_item
  (VendorQuoteId,QuoteId,VendorId,RRId, PartId,PartNo,Description,LeadTime,Quantity,Rate,Price,Tax,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice, Created,  CreatedBy, Status,WarrantyPeriod,VendorAttachment,AttachmentMimeType,
    WebLink,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge)
  values `;
  for (let val1 of QuoteItem) {
    val1 = escapeSqlValues(val1);
    var val = new VendorQuoteItem(val1);
    sql = sql + `('${val1.VendorQuoteId}','${val1.QuoteId}','${val.VendorId}','${val.RRId}','${val.PartId}','
      ${val.PartNo}','${val.Description}','${val.LeadTime}','${val.Quantity}','
      ${val.Rate}','${val.Price}','${val.Tax}','${val.ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${val.ItemExchangeRate}','${val.ItemBaseCurrencyCode}','${val.BasePrice}','${val.Created}','${val.CreatedBy}','${val.Status}','${val.WarrantyPeriod}','${val.VendorAttachment}','${val.AttachmentMimeType}','${val.WebLink}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}'),`;
  }
  var Query = sql.slice(0, -1);
  // console.log("Vendor Quote Item : " + Query);
  con.query(Query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;
  });
};

VendorQuoteItem.UpdateVendorQuoteItem = (val, result) => {


  val = escapeSqlValues(val);
  var obj = new VendorQuoteItem(val);
  var sql = `UPDATE tbl_vendor_quote_item SET VendorId = '${obj.VendorId}',PartId = '${obj.PartId}',
    PartNo = '${obj.PartNo}',Description = '${obj.Description}',
    LeadTime ='${obj.LeadTime}', Quantity = '${obj.Quantity}',
    Rate = '${obj.Rate}',Price = '${obj.Price}', 
    Tax = '${obj.Tax}', ItemTaxPercent = '${obj.ItemTaxPercent}', ItemLocalCurrencyCode = '${obj.ItemLocalCurrencyCode}', ItemExchangeRate = '${obj.ItemExchangeRate}', ItemBaseCurrencyCode = '${obj.ItemBaseCurrencyCode}', BasePrice = '${obj.BasePrice}', 
    WarrantyPeriod = '${obj.WarrantyPeriod}',
    VendorAttachment = '${obj.VendorAttachment}', AttachmentMimeType = '${obj.AttachmentMimeType}',WebLink = '${obj.WebLink}',BaseRate = '${obj.BaseRate}',BaseTax = '${obj.BaseTax}',ShippingCharge = '${obj.ShippingCharge}',BaseShippingCharge = '${obj.BaseShippingCharge}'
     where VendorQuoteItemId = '${obj.VendorQuoteItemId}' `;

  //console.log("VQI =" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.affectedRows == 0) {
      return result({ msg: "VendorQuoteItem not found" }, null);
    }
    return result(null, obj);
  });
};


VendorQuoteItem.UpdateVendorQuoteId = (ObjList, result) => {
  for (let val of ObjList) {
    val = escapeSqlValues(val);
    var obj = new VendorQuoteItem(val);
    if (obj.QuoteId > 0 && obj.VendorId > 0 && obj.QuoteItemId) {
      var sql = `UPDATE tbl_vendor_quote_item SET VendorQuoteId = '${obj.VendorQuoteId}'
     where QuoteId = '${obj.QuoteId}' and VendorId='${obj.VendorId}' and PartId='${obj.QuoteItemId}' `;
      //console.log(sql);
      con.query(sql, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
      });
    }
  }
  return result(null, ObjList);
};

VendorQuoteItem.ViewVendorQuoteItems = (VendorQuoteId, result) => {
  var sql = `Select vqi.PartId, vqi.PartNo, vqi.Description, vqi.LeadTime, vqi.Quantity, vqi.Rate, vqi.Price, vqi.Tax,vqi.ItemTaxPercent,vqi.ItemLocalCurrencyCode,vqi.ItemExchangeRate,vqi.ItemBaseCurrencyCode,vqi.BasePrice,vqi.BaseRate,vqi.BaseTax,vqi.ShippingCharge,vqi.BaseShippingCharge,vqi.VendorId
from tbl_vendor_quote vq
Left Join tbl_vendor_quote_item vqi on vq.VendorQuoteId=vqi.VendorQuoteId and vqi.IsDeleted = 0
 where vq.IsDeleted = 0  and vq.VendorQuoteId = '${VendorQuoteId}'`;
  // console.log("ViewVendorQuoteItems" + sql);
  return sql;
};
module.exports = VendorQuoteItem;
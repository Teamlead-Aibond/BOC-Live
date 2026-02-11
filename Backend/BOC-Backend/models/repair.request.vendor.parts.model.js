/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var cDateTime = require("../utils/generic.js");

const RRVendorParts = function (objRRVendorParts) {

  this.RRVendorPartsId = objRRVendorParts.RRVendorPartsId;
  this.IsIncludeInQuote = objRRVendorParts.IsIncludeInQuote ? objRRVendorParts.IsIncludeInQuote : 0;
  this.RRId = objRRVendorParts.RRId ? objRRVendorParts.RRId : 0;
  this.MROId = objRRVendorParts.MROId ? objRRVendorParts.MROId : 0;
  this.RRVendorId = objRRVendorParts.RRVendorId ? objRRVendorParts.RRVendorId : 0;
  this.PartId = objRRVendorParts.PartId ? objRRVendorParts.PartId : 0;
  this.VendorId = objRRVendorParts.VendorId;
  this.PartNo = objRRVendorParts.PartNo ? objRRVendorParts.PartNo : '';
  this.Description = objRRVendorParts.Description ? objRRVendorParts.Description : '';
  this.LeadTime = objRRVendorParts.LeadTime ? objRRVendorParts.LeadTime : '';
  this.Quantity = objRRVendorParts.Quantity ? objRRVendorParts.Quantity : 1;
  this.Rate = objRRVendorParts.Rate ? objRRVendorParts.Rate : 0;
  this.Price = objRRVendorParts.Price ? objRRVendorParts.Price : 0;
  this.WarrantyPeriod = objRRVendorParts.WarrantyPeriod ? objRRVendorParts.WarrantyPeriod : 0;
  this.WarrantyStartDate = objRRVendorParts.WarrantyStartDate;
  this.WarrantyEndDate = objRRVendorParts.WarrantyEndDate;
  this.WarrantyActivatedDate = objRRVendorParts.WarrantyActivatedDate;
  this.WarrantyActivatedBy = objRRVendorParts.WarrantyActivatedBy;
  this.WarrantyTrigger = objRRVendorParts.WarrantyTrigger;
  // New
  this.Tax = objRRVendorParts.Tax ? objRRVendorParts.Tax : 0;
  this.ItemTaxPercent = objRRVendorParts.ItemTaxPercent ? objRRVendorParts.ItemTaxPercent : 0;
  this.BasePrice = objRRVendorParts.BasePrice ? objRRVendorParts.BasePrice : 0;
  this.ItemLocalCurrencyCode = objRRVendorParts.ItemLocalCurrencyCode ? objRRVendorParts.ItemLocalCurrencyCode : '';
  this.ItemExchangeRate = objRRVendorParts.ItemExchangeRate ? objRRVendorParts.ItemExchangeRate : 0;
  this.ItemBaseCurrencyCode = objRRVendorParts.ItemBaseCurrencyCode ? objRRVendorParts.ItemBaseCurrencyCode : '';

  this.BaseRate = objRRVendorParts.BaseRate ? objRRVendorParts.BaseRate : 0;
  this.BaseTax = objRRVendorParts.BaseTax ? objRRVendorParts.BaseTax : 0;

  this.ShippingCharge = objRRVendorParts.ShippingCharge ? objRRVendorParts.ShippingCharge : 0;
  this.BaseShippingCharge = objRRVendorParts.BaseShippingCharge ? objRRVendorParts.BaseShippingCharge : 0;


  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objRRVendorParts.authuser && objRRVendorParts.authuser.UserId) ? objRRVendorParts.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objRRVendorParts.authuser && objRRVendorParts.authuser.UserId) ? objRRVendorParts.authuser.UserId : TokenUserId;
  this.StatusPartId = objRRVendorParts.StatusPartId;
  this.Status = objRRVendorParts.Status ? objRRVendorParts.Status : 0;
  this.VendorPartsList = objRRVendorParts.VendorPartsList;
};


RRVendorParts.CreateRRVendorParts = (RRVendorPartsObj, result) => {

  if (RRVendorPartsObj.ItemExchangeRate == 1) {
    RRVendorPartsObj.BaseShippingCharge = RRVendorPartsObj.ShippingCharge;
    RRVendorPartsObj.BasePrice = RRVendorPartsObj.Price;
    RRVendorPartsObj.BaseRate = RRVendorPartsObj.Rate;
    RRVendorPartsObj.BaseTax = RRVendorPartsObj.Tax;
  }
  var sql = `insert into tbl_repair_request_vendor_parts
    (RRVendorId,RRId,MROId,PartId, VendorId,PartNo,Description,LeadTime,Quantity,Rate,Price,Tax,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,WarrantyPeriod, Created,  CreatedBy, Status,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge)
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [RRVendorPartsObj.RRVendorId, RRVendorPartsObj.RRId, RRVendorPartsObj.MROId, RRVendorPartsObj.PartId, RRVendorPartsObj.VendorId,
  RRVendorPartsObj.PartNo, RRVendorPartsObj.Description,
  RRVendorPartsObj.LeadTime, RRVendorPartsObj.Quantity,
  RRVendorPartsObj.Rate, RRVendorPartsObj.Price,
  RRVendorPartsObj.Tax, RRVendorPartsObj.ItemTaxPercent, RRVendorPartsObj.ItemLocalCurrencyCode, RRVendorPartsObj.ItemExchangeRate, RRVendorPartsObj.ItemBaseCurrencyCode, RRVendorPartsObj.BasePrice,
  RRVendorPartsObj.WarrantyPeriod, RRVendorPartsObj.Created, RRVendorPartsObj.CreatedBy, RRVendorPartsObj.Status, RRVendorPartsObj.BaseRate, RRVendorPartsObj.BaseTax, RRVendorPartsObj.ShippingCharge, RRVendorPartsObj.BaseShippingCharge]
  // console.log(sql);
  // console.log(sql + "CreateRRVendorParts :" + values);
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;
  });
};

RRVendorParts.UpdateRRVendorParts = (RRVendorParts, result) => {

  for (let val of RRVendorParts.VendorPartsList) {
    if (val.WarrantyPeriod == '' || val.WarrantyPeriod == null) {
      val.WarrantyPeriod = 0;
    }
    var sql = `Update tbl_repair_request_vendor_parts
    set   LeadTime=?, Quantity=? , Description=?, Rate=?,    Price=?,
    Tax=?,ItemTaxPercent=?,ItemLocalCurrencyCode=?,ItemExchangeRate=?,ItemBaseCurrencyCode=?,BasePrice=?,
    WarrantyPeriod=?, Modified=?, ModifiedBy=?,IsIncludeInQuote=?,BaseRate=?,BaseTax=?,ShippingCharge=?,BaseShippingCharge=? where  RRVendorPartsId=? `;
    var values = [
      val.LeadTime, val.Quantity, val.Description, val.Rate, val.Price,
      val.Tax, val.ItemTaxPercent, val.ItemLocalCurrencyCode, val.ItemExchangeRate, val.ItemBaseCurrencyCode, val.BasePrice,
      val.WarrantyPeriod, RRVendorParts.Modified, RRVendorParts.ModifiedBy, val.IsIncludeInQuote, val.BaseRate, val.BaseTax, val.ShippingCharge, val.BaseShippingCharge, val.RRVendorPartsId]

    // console.log("Logs :" + values);
    con.query(sql, values, (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
        return;
      }
      result(null, { id: res.insertId });
      return;

    });
  }
};

RRVendorParts.UpdateRRVendorPartsBySingleRecords = (val, result) => {

  val = new RRVendorParts(val);
  // console.log(val);
  // for (let val of RRVendorParts.VendorPartsList)
  // {
  if (val.WarrantyPeriod == "" || val.WarrantyPeriod == null) {
    val.WarrantyPeriod = "0";
  }
  var sql = `Update tbl_repair_request_vendor_parts
    set   LeadTime=?, Quantity=? , Description=?, Rate=?, PartNo=?, Price=?,
    Tax=?,ItemTaxPercent=?,ItemLocalCurrencyCode=?,ItemExchangeRate=?,ItemBaseCurrencyCode=?,BasePrice=?,
    WarrantyPeriod=?, Modified=?, ModifiedBy=?,IsIncludeInQuote=?,BaseRate=?,BaseTax=?,ShippingCharge=?,BaseShippingCharge=? where  RRVendorPartsId=? `;
  var values = [
    val.LeadTime, val.Quantity, val.Description, val.Rate, val.PartNo, val.Price,
    val.Tax, val.ItemTaxPercent, val.ItemLocalCurrencyCode, val.ItemExchangeRate, val.ItemBaseCurrencyCode, val.BasePrice,
    val.WarrantyPeriod, val.Modified, val.ModifiedBy, val.IsIncludeInQuote, val.BaseRate, val.BaseTax, val.ShippingCharge, val.BaseShippingCharge, val.RRVendorPartsId]

  //console.log(sql + "Logs :" + values);
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log("error: ", err);
      return result(err, null);
    }
    return result(null, { id: res.insertId });
  });
  // }
};

RRVendorParts.ViewVendorPartsById = (RRId, RRVendorId) => {
  return sql = `Select RRVendorPartsId,IsIncludeInQuote,RRVendorId,RRId,PartId,VendorId,PartNo,Description,
  LeadTime,Quantity, ROUND(ifnull(Rate,0),2) as Rate 
  ,ROUND(ifnull(Price,0),2) as Price, Tax, ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,
  BasePrice,
  BaseRate,BaseTax,WarrantyPeriod,WarrantyStartDate,WarrantyEndDate,WarrantyActivatedDate,WarrantyActivatedBy,WarrantyTrigger,
  CURL.CurrencySymbol as ItemLocalCurrencySymbol,CURB.CurrencySymbol as ItemBaseCurrencySymbol,ShippingCharge,BaseShippingCharge 
      from tbl_repair_request_vendor_parts  as trrvp
      LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = ItemLocalCurrencyCode AND CURL.IsDeleted = 0  
      LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = ItemBaseCurrencyCode AND CURB.IsDeleted = 0
      where trrvp.IsDeleted=0 and trrvp.RRVendorId =${RRVendorId} AND trrvp.RRId=${RRId}`;
}

RRVendorParts.ViewVendorParts = (RRId) => {
  var sql = `Select RRVendorPartsId,RRVendorId,RRId,PartId,PartNo,VendorId,Description,
  LeadTime,Quantity,ROUND(ifnull(Rate,0),2) as Rate ,ROUND(ifnull(Price,0),2) as Price,Tax,ItemTaxPercent,ItemLocalCurrencyCode,
  ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,BaseRate,
  BaseTax,WarrantyPeriod,WarrantyStartDate,WarrantyEndDate,WarrantyActivatedDate,WarrantyActivatedBy,
  WarrantyTrigger,IsIncludeInQuote,CURL.CurrencySymbol as ItemLocalCurrencySymbol,CURB.CurrencySymbol as ItemBaseCurrencySymbol, 
  ShippingCharge,BaseShippingCharge 
      from tbl_repair_request_vendor_parts as VP
      LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = VP.ItemLocalCurrencyCode AND CURL.IsDeleted = 0  
      LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = VP.ItemBaseCurrencyCode AND CURB.IsDeleted = 0  
  where VP.IsDeleted=0 and VP.RRId=${RRId} `;
  if (global.authuser.IdentityType == Constants.CONST_IDENTITY_TYPE_VENDOR) {
    sql += ` AND VP.VendorId = ${global.authuser.IdentityId} `;
  }
  return sql;
}

RRVendorParts.DeleteRRVendorPartsQuery = (RRId) => {
  var Obj = new RRVendorParts({ RRId: RRId });
  var sql = `UPDATE tbl_repair_request_vendor_parts SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE IsDeleted = 0 AND RRId>0 AND RRId=${Obj.RRId}`;
  //console.log(sql);
  return sql;
}

RRVendorParts.DeleteRRVendorPartsByRRVendorPartsId = (RRVendorPartsId, result) => {    // = (RRVendorPartsId) => {
  var Obj = new RRVendorParts({ RRVendorPartsId: RRVendorPartsId });
  var sql = `UPDATE tbl_repair_request_vendor_parts SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE RRVendorPartsId=${Obj.RRVendorPartsId}`;
  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: Obj.RRVendorPartsId });
    return;

  });
}

RRVendorParts.removequery = (RRVendorId) => {
  var Obj = new RRVendorParts({ RRVendorId: RRVendorId });
  return sql = `UPDATE tbl_repair_request_vendor_parts SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE RRVendorId=${Obj.RRVendorId}`;
}

RRVendorParts.ViewVendorParts1 = (RRId, RRVendorId, result) => {
  var sql = `Select RRVendorPartsId,rrp.RRVendorId,rrp.RRId,rrp.PartId,rrp.PartNo,
  rrp.VendorId,Description,LeadTime,Quantity,
  ROUND(ifnull(rrp.Rate,0),2) as Rate,
  rrp.BaseRate,rrp.BaseTax,rrp.ShippingCharge,
  rrp.BaseShippingCharge,
  ROUND(ifnull(rrp.Price,0),2) as Price,
  WarrantyPeriod,WarrantyStartDate,
  Tax,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,
  BasePrice,WarrantyEndDate,WarrantyActivatedDate,
  WarrantyActivatedBy,WarrantyTrigger,rr.SerialNo ,GS.AHCommissionPercent
  from tbl_repair_request_vendor_parts rrp
  INNER join tbl_repair_request rr on rrp.RRId=rr.RRId
  LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
  where rrp.IsDeleted=0 and rrp.IsIncludeInQuote=1 and rrp.RRVendorId = ${RRVendorId} and rrp.RRId=${RRId}`;
  //console.log("Vendor parts Query = " + sql);
  con.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
};
RRVendorParts.ViewVendorQuoteItems = (RRId, QuoteId, result) => {
  var sql = `Select vqi.PartId, vqi.PartNo, vqi.Description, vqi.LeadTime, 
  vqi.Quantity,  
  ROUND(ifnull(vqi.Rate,0),2) as Rate,
  ROUND(ifnull(vqi.Price,0),2) as Price,
  vqi.Tax,vqi.ItemTaxPercent,
  vqi.ItemLocalCurrencyCode,vqi.ItemExchangeRate,vqi.ItemBaseCurrencyCode,
  vqi.BasePrice,vqi.BaseRate,vqi.BaseTax,vqi.ShippingCharge,vqi.BaseShippingCharge
from tbl_vendor_quote vq
Left Join tbl_vendor_quote_item vqi on vq.VendorQuoteId=vqi.VendorQuoteId and vqi.IsDeleted = 0
 where vq.IsDeleted = 0  and vq.QuoteId = '${QuoteId}'  and vq.RRId='${RRId}'`;
  // console.log("ViewVendorQuoteItems" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
};

RRVendorParts.SelectVendorsCalculationByDelete = (RRVendorPartsId, result) => {
  var Obj = new RRVendorParts({ RRVendorPartsId: RRVendorPartsId });
  var sql = `SELECT RRVendorId,SubTotal,TotalTax,AdditionalCharge,Discount,Shipping, ((SubTotal+TotalTax+AdditionalCharge+Shipping)-Discount) as GrandTotal from(
    SELECT Sum(rv.Price) as SubTotal,(Sum(rv.Price)*5/100)as TotalTax,rp.RRVendorId,rp.AdditionalCharge,rp.Discount,rp.Shipping 
    FROM tbl_repair_request_vendor_parts rv INNER JOIN tbl_repair_request_vendors rp on 
    rv.RRVendorId=rp.RRVendorId where rv.RRVendorId=(SELECT RRVendorId from  
      tbl_repair_request_vendor_parts where RRVendorPartsId='${Obj.RRVendorPartsId}') and rv.IsDeleted<>1) as x`;
  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { res });
    return;

  });
}








//Below are For MRO :
RRVendorParts.ViewMROVendorQuoteItems = (MROId, QuoteId, result) => {
  var sql = `Select vqi.PartId, vqi.PartNo, vqi.Description, vqi.LeadTime, vqi.Quantity,  
  ROUND(ifnull(vqi.Rate,0),2) as Rate,
  ROUND(ifnull(vqi.Price,0),2) as Price,
   vqi.Tax,vqi.ItemTaxPercent,vqi.ItemLocalCurrencyCode,vqi.ItemExchangeRate,
  vqi.ItemBaseCurrencyCode,vqi.BasePrice,vqi.BaseRate,vqi.BaseTax
from tbl_vendor_quote vq
Left Join tbl_vendor_quote_item vqi on vq.VendorQuoteId=vqi.VendorQuoteId and vqi.IsDeleted = 0
 where vq.IsDeleted = 0  and vq.QuoteId = '${QuoteId}'  and vq.MROId='${MROId}'`;
  // console.log("ViewVendorQuoteItems" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
};
RRVendorParts.DeleteMROVendorPartsQuery = (MROId) => {
  var Obj = new RRVendorParts({ MROId: MROId });
  return sql = `UPDATE tbl_repair_request_vendor_parts SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE MROId=${Obj.MROId}`;

}
RRVendorParts.UpdateorCreateRRVendorParts = (req, VendorPartsList, result) => {
  var i = 0;
  for (let val of VendorPartsList) {
    if (!req.body.hasOwnProperty('RRVendorPartsId') && val.RRVendorPartsId != "" && val.RRVendorPartsId != null) {
      RRVendorParts.UpdateRRVendorPartsBySingleRecords(val, (err, data) => {
      });
    }
    else {
      val.RRId = req.body.RRId;
      val.RRVendorId = req.body.VendorsList.RRVendorId;
      val.VendorId = req.body.VendorsList.RRVendorId;
      RRVendorParts.CreateRRVendorParts(new RRVendorParts(val), (err, data) => {
      });
    }
    i = i + 1;
  }
  //console.log(i + " - " + VendorPartsList.length)
  if (VendorPartsList.length == i) {
    result(null, { msg: "Loop over...." });
    return;
  }
};
module.exports = RRVendorParts;
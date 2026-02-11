/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
const { escapeSqlValues } = require("../helper/common.function.js");
// const Quotes = require("./quotes.model.js");
const QuoteItem = function (objQuoteItem) {

  this.QuoteItemId = objQuoteItem.QuoteItemId;
  this.PartId = objQuoteItem.PartId ? objQuoteItem.PartId : 0;
  this.ShopPartItemId = objQuoteItem.ShopPartItemId ? objQuoteItem.ShopPartItemId : 0;
  this.PartType = objQuoteItem.PartType ? objQuoteItem.PartType : 0;
  this.PartNo = objQuoteItem.PartNo ? objQuoteItem.PartNo : '';
  this.PartDescription = objQuoteItem.PartDescription ? objQuoteItem.PartDescription : '';
  this.Description = objQuoteItem.Description ? objQuoteItem.Description : '';// for auto create
  this.SerialNo = objQuoteItem.SerialNo ? objQuoteItem.SerialNo : '';
  this.Quantity = objQuoteItem.Quantity ? objQuoteItem.Quantity : 1;
  this.WarrantyPeriod = objQuoteItem.WarrantyPeriod ? objQuoteItem.WarrantyPeriod : 0;
  this.LeadTime = objQuoteItem.LeadTime ? objQuoteItem.LeadTime : '';
  this.Rate = objQuoteItem.Rate ? objQuoteItem.Rate : 0;
  this.Tax = objQuoteItem.Tax ? objQuoteItem.Tax : 0;
  this.Discount = objQuoteItem.Discount ? objQuoteItem.Discount : 0;
  this.Price = objQuoteItem.Price ? objQuoteItem.Price : 0;
  this.VendorUnitPrice = objQuoteItem.VendorUnitPrice ? objQuoteItem.VendorUnitPrice : 0;

  this.ItemTaxPercent = objQuoteItem.ItemTaxPercent ? objQuoteItem.ItemTaxPercent : 0;
  this.ItemLocalCurrencyCode = objQuoteItem.ItemLocalCurrencyCode ? objQuoteItem.ItemLocalCurrencyCode : '';
  this.ItemExchangeRate = objQuoteItem.ItemExchangeRate ? objQuoteItem.ItemExchangeRate : 0;
  this.ItemBaseCurrencyCode = objQuoteItem.ItemBaseCurrencyCode ? objQuoteItem.ItemBaseCurrencyCode : '';
  this.BasePrice = objQuoteItem.BasePrice ? objQuoteItem.BasePrice : 0;

  this.BaseRate = objQuoteItem.BaseRate ? objQuoteItem.BaseRate : 0;
  this.BaseTax = objQuoteItem.BaseTax ? objQuoteItem.BaseTax : 0;

  this.ShippingCharge = objQuoteItem.ShippingCharge ? objQuoteItem.ShippingCharge : 0;
  this.BaseShippingCharge = objQuoteItem.BaseShippingCharge ? objQuoteItem.BaseShippingCharge : 0;

  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objQuoteItem.authuser && objQuoteItem.authuser.UserId) ? objQuoteItem.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objQuoteItem.authuser && objQuoteItem.authuser.UserId) ? objQuoteItem.authuser.UserId : TokenUserId;
}


QuoteItem.AutoCreateQuoteItem = (reqbody, QuoteId, QuoteItem, result) => {
  var GlobalTokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  var LoginUserId = (reqbody.authuser && reqbody.authuser.UserId) ? reqbody.authuser.UserId : GlobalTokenUserId;

   var GlobalLocation= global.authuser.Location ? global.authuser.Location : 0;
  var LoginLocation = (reqbody.authuser && reqbody.authuser.Location) ? reqbody.authuser.Location : GlobalLocation;

  // console.log("QuoteItemQuoteItemQuoteItemQuoteItemQuoteItemQuoteItemQuoteItemQuoteItemQuoteItemQuoteItem")
  // console.log(QuoteItem)
  var sumOfFinalPrice = 0;
  var sumOfBaseFinalPrice = 0;
  var sql = `insert into tbl_quotes_item(QuoteId,PartId,PartNo,PartDescription,WarrantyPeriod,LeadTime,SerialNo,Quantity,VendorUnitPrice,Rate,Tax,Discount,Price,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,Created,CreatedBy,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge) values`;
  for (let val of QuoteItem) {
    //console.log("value from quote inside auto create :");
    //console.log(val);
    val = escapeSqlValues(val);
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    //console.log(val);
    var ItemTaxPercent = 0;
    if (LoginLocation == val.CustomerLocation) {
      ItemTaxPercent = parseFloat(val.ItemTaxPercent);
    }
    var baseExchangeValue = parseFloat(val.ItemExchangeRate);
    var exExchangeValue = parseFloat(val.exExchangeValue); // != 1 ? val.exExchangeValue : val.ItemExchangeRate;
    var oldValRate = parseFloat(val.Rate);
    val.Rate = parseFloat(val.Rate) * exExchangeValue;
    // console.log(val)
    val.Description = val.Description ? val.Description : '';
    var BasePriceBefore = 0
    var VatTax = 0;
    var VatTaxPrice = 0;
    var tax = 0;
    var finalPrice = 0;
    var baseFinalPrice = 0;
    var Quantity = val.Quantity ? parseFloat(val.Quantity) : 1;
    var finalRate = parseFloat(val.Rate) + ((parseFloat(val.Rate) * parseFloat(val.AHCommissionPercent)) / 100);
    var discount = 0;
    // var ItemTaxPercent = val.ItemTaxPercent ? val.ItemTaxPercent : 0;
    var ItemExchangeRate = val.ItemExchangeRate ? parseFloat(val.ItemExchangeRate) : 0;
    var BasePrice = val.BasePrice ? parseFloat(val.BasePrice) : 0;
    // var BasePrice = val.BasePrice + ((val.BasePrice * val.AHCommissionPercent) / 100);
    var oldRate = oldValRate + ((oldValRate * parseFloat(val.AHCommissionPercent)) / 100);
    var Rate = val.Rate ? parseFloat(val.Rate) : 0;
    // console.log(ItemTaxPercent+"*"+finalRate);
    if (ItemTaxPercent > 0) {
      VatTax = parseFloat(ItemTaxPercent / 100);
    }

    VatTaxPrice = oldRate * VatTax
    //console.log(VatTaxPrice)
    // console.log(Quantity +"*"+ +"("+ Rate +"+"+  (Rate +"*"+  ItemTaxPercent)));
    BasePriceBefore = (VatTaxPrice + (parseFloat(Quantity) * (parseFloat(oldRate))) - discount)
    //console.log("BasePriceBefore", BasePriceBefore)
    BasePrice = BasePriceBefore * baseExchangeValue;
    BasePrice = parseFloat(BasePrice.toFixed(2));
    // console.log("BasePrice", BasePrice)
    tax = VatTax * finalRate * Quantity;
    var taxWithoutQuantity = VatTax * finalRate;
    // console.log("finalRate", finalRate)
    // console.log("finalRate tax", tax)
    finalPrice = ((tax + (finalRate * Quantity)) - discount);

    finalPrice = finalPrice + val.ShippingCharge;
    BasePrice = BasePrice + val.BaseShippingCharge;
    // console.log("finalPrice", finalPrice)
    // BasePrice = finalPrice;
    sumOfFinalPrice += parseFloat(finalPrice);
    sumOfBaseFinalPrice += parseFloat(BasePrice);
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    // console.log(sumOfFinalPrice);
    // console.log(sumOfBaseFinalPrice);
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    val.BaseRate = finalPrice * baseExchangeValue;

    sql = sql + `('${QuoteId}','${val.PartId}','${val.PartNo}','${val.Description}',${val.WarrantyPeriod},'${val.LeadTime}','${val.SerialNo}','${val.Quantity}','${Rate}','${finalRate}','${taxWithoutQuantity}','${discount}','${finalPrice}','${ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${ItemExchangeRate}','${val.ItemBaseCurrencyCode}','${BasePrice}','${cDateTime.getDateTime()}','${LoginUserId}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}'),`;
  }
  // console.log("!!!!!!!!!!!!!!!!!!!!!@@@@@@@@@@@!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  // console.log(sumOfFinalPrice);
  // console.log(sumOfBaseFinalPrice);
  // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  var Query = sql.slice(0, -1);
 // console.log("Quote item create : " + Query);
  con.query(Query, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, SumOfPrice: sumOfFinalPrice, sumOfBaseFinalPrice: sumOfBaseFinalPrice });
    return;
  });
};

QuoteItem.CreateQuoteItem = (QuoteId, QuoteItemList, result) => {

  var sumOfFinalPrice = 0;
  var sql = `insert into tbl_quotes_item(QuoteId,PartId,ShopPartItemId,PartType,PartNo,PartDescription,WarrantyPeriod,LeadTime,SerialNo,Quantity,VendorUnitPrice,Rate,Tax,Discount,Price,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,Created,CreatedBy,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge) values`;
  for (let obj of QuoteItemList) {
    obj = escapeSqlValues(obj);
    let val = new QuoteItem(obj);
    sql = sql + `('${QuoteId}','${val.PartId}','${val.ShopPartItemId}','${val.PartType}','${val.PartNo}','${val.PartDescription}',${val.WarrantyPeriod},'${val.LeadTime}','${val.SerialNo}','${val.Quantity}','${val.VendorUnitPrice}','${val.Rate}','${val.Tax}','${val.Discount}','${val.Price}','${val.ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${val.ItemExchangeRate}','${val.ItemBaseCurrencyCode}','${val.BasePrice}','${cDateTime.getDateTime()}','${global.authuser.UserId}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}'),`;
  }
  var Query = sql.slice(0, -1);
  //console.log("tbl_quotes_item=" + Query);
  con.query(Query, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, SumOfPrice: sumOfFinalPrice });
    return;


  });

};

QuoteItem.UpdateCustomerQuoteItem = (objQuoteItem, result) => {

  for (let obj of objQuoteItem.QuoteItem) {

    let val = new QuoteItem(obj);
    val.QuoteId = objQuoteItem.QuoteId;
    if (val.QuoteItemId != "" && val.QuoteItemId != null) {
      var sql = ``;
      sql = `UPDATE tbl_quotes_item SET 
    LeadTime  = ?, Quantity = ?, Rate = ?, Price = ?,
    Tax=?, ItemTaxPercent=?,ItemLocalCurrencyCode=?,ItemExchangeRate=?,ItemBaseCurrencyCode=?,BasePrice=?, 
    Modified = ?, 
    ModifiedBy = ? ,PartId=?,PartType=?,PartNo =? ,PartDescription = ?,WarrantyPeriod=?,BaseRate=?,BaseTax=?,ShippingCharge=?,BaseShippingCharge=?
    WHERE QuoteItemId = ?`;
      var values = [
        val.LeadTime, val.Quantity, val.Rate, val.Price,
        val.Tax, val.ItemTaxPercent, val.ItemLocalCurrencyCode, val.ItemExchangeRate, val.ItemBaseCurrencyCode, val.BasePrice,
        val.Modified, val.ModifiedBy, val.PartId, val.PartType, val.PartNo, val.PartDescription, val.WarrantyPeriod, val.BaseRate, val.BaseTax, val.ShippingCharge, val.BaseShippingCharge, val.QuoteItemId
      ];
      // console.log(sql, values);

      con.query(sql, values, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ msg: "Quote item not found" }, null);
          return;
        }

      });
    }
    else {

      var sql = `insert into tbl_quotes_item(QuoteId,PartId,PartNo,PartDescription,WarrantyPeriod,LeadTime,SerialNo,Quantity,Rate,Tax,Discount,Price,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,Created,CreatedBy,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge) values`;
      val = escapeSqlValues(val);
      sql = sql + `('${val.QuoteId}','${val.PartId}','${val.PartNo}','${val.PartDescription}',${val.WarrantyPeriod},'${val.LeadTime}','${val.SerialNo}','${val.Quantity}','${val.Rate}','${val.Tax}','${val.Discount}','${val.Price}','${val.ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${val.ItemExchangeRate}','${val.ItemBaseCurrencyCode}','${val.BasePrice}','${cDateTime.getDateTime()}','${global.authuser.UserId}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}')`;
      // console.log(sql);
      con.query(sql, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

      });
    }

  }
  result(null, { data: objQuoteItem.QuoteItem });
  return;
};


QuoteItem.UpdateQuoteItem = (objQuoteItem, result) => {

  for (let obj of objQuoteItem.QuoteItem) {
    let val = new QuoteItem(obj);
    val.QuoteId = objQuoteItem.QuoteId;
    // console.log("QuoteId=" + val.QuoteId)
    var sql = ``;
    if (val.QuoteItemId && val.QuoteItemId != null) {
      sql = `UPDATE tbl_quotes_item SET 
    QuoteId = ?, PartId = ?,PartNo = ?, PartDescription = ?, WarrantyPeriod=?, LeadTime=?, SerialNo = ?,Quantity = ?, 
    ItemTaxPercent=?, ItemLocalCurrencyCode=?,ItemExchangeRate=?,ItemBaseCurrencyCode=?,BasePrice=?, 
    Rate = ?, Tax = ?,Discount = ?, Price = ?,Modified = ?, 
    ModifiedBy = ?, BaseRate=?, BaseTax=?,ShippingCharge=?,BaseShippingCharge=? 
    WHERE QuoteItemId = ?`;

      var values = [
        val.QuoteId, val.PartId,
        val.PartNo, val.PartDescription, val.WarrantyPeriod, val.LeadTime, val.SerialNo, val.Quantity,
        val.ItemTaxPercent, val.ItemLocalCurrencyCode, val.ItemExchangeRate, val.ItemBaseCurrencyCode, val.BasePrice,
        val.Rate, val.Tax, val.Discount, val.Price, val.Modified,
        val.ModifiedBy, val.BaseRate, val.BaseTax, val.ShippingCharge, val.BaseShippingCharge, val.QuoteItemId
      ];
      //  console.log(sql, values);

      con.query(sql, values, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ msg: "Quote item not found" }, null);
          return;
        }
      });
    }
    else {
      val = escapeSqlValues(val);
      var sql = `insert into tbl_quotes_item(
        QuoteId,PartId,PartNo,PartDescription, WarrantyPeriod,LeadTime,SerialNo,Quantity,
        Rate,Tax,Discount,Price,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,
        BasePrice,Created,CreatedBy,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge) 
      values (
      '${val.QuoteId}','${val.PartId}','${val.PartNo}','${val.PartDescription}', ${val.WarrantyPeriod},'${val.LeadTime}','${val.SerialNo}','${val.Quantity}',
      '${val.Rate}','${val.Tax}','${val.Discount}','${val.Price}','${val.ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${val.ItemExchangeRate}','${val.ItemBaseCurrencyCode}',
      '${val.BasePrice}','${cDateTime.getDateTime()}','${global.authuser.UserId}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}')`;
      con.query(sql, (err, res) => {
        if (err) {
          console.log(err);
          result(err, null);
          return;
        }
      });
    }
  }
  result(null, { data: objQuoteItem.QuoteItem });
  return;
};
// To DeleteQuoteItem
QuoteItem.DeleteQuoteItem = (QuoteItemId, result) => {
  let Obj = new QuoteItem({ QuoteItemId: QuoteItemId });
  var sql = `UPDATE tbl_quotes_item SET IsDeleted=1, Modified='${Obj.Modified}', ModifiedBy=${Obj.ModifiedBy}  WHERE QuoteItemId=${Obj.QuoteItemId}`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      result({ msg: "Quote item not deleted!" }, null);
    return result(null, res);
  });
};

//Select New Calculation After QuoteItem Delete
QuoteItem.SelectNewCalculationAfterQuoteItemDelete = (QuoteItemId, result) => {

  /*var sql = `SELECT QuoteId,SubTotal,TotalTax,AHFees,Shipping,ItemTaxPercent,ShippingCharge,BaseShippingCharge,
  ((SubTotal+TotalTax+AHFees+Shipping)-Discount) as GrandTotal from(
  SELECT Sum(qi.Price) as SubTotal,(Sum(qi.Price)*q.ItemTaxPercent/100)as TotalTax ,q.QuoteId,q.ProcessFee as AHFees,q.Discount,q.ShippingFee as Shipping,q.ItemTaxPercent
  FROM tbl_quotes_item qi
  INNER JOIN tbl_quotes q on qi.QuoteId=q.QuoteId where qi.QuoteId=
  (SELECT QuoteId from tbl_quotes_item where QuoteItemId='${QuoteItemId}')
  and qi.IsDeleted<>1 Group By q.QuoteId) as x `;*/

  var sql = `SELECT ROUND((Sum(qi.Price)),2) as SubTotal,  
  ROUND((Sum(qi.Price)),2) as GrandTotal, ROUND((Sum(qi.BasePrice)),2) as BaseGrandTotal , q.QuoteId 
  FROM tbl_quotes_item qi
  INNER JOIN tbl_quotes q on qi.QuoteId=q.QuoteId 
  where qi.QuoteId=(SELECT QuoteId from tbl_quotes_item where QuoteItemId='${QuoteItemId}') and qi.IsDeleted = 0  Group By q.QuoteId`;

  //console.log("sql: " + sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { res });
  });
}


QuoteItem.ViewQuoteId = (QuoteId, result) => {
  var sql = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.LeadTime,qi.WarrantyPeriod,
  qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,qi.BaseRate,qi.BaseTax,qi.ShippingCharge,qi.BaseShippingCharge
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId and  qi.IsDeleted=0
  where tq.IsDeleted=0 and tq.RRId=${QuoteId}`;
  //console.log(sql);
  return sql;

};

QuoteItem.ViewQuoteIdWithParts = (QuoteId, result) => {
  // var sql = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  // ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.LeadTime,qi.WarrantyPeriod,
  // qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,
  // qi.BaseRate,qi.BaseTax,qi.ShippingCharge,qi.BaseShippingCharge, p.VendorId,p.BuyingPrice,p.BuyingExchangeRate,p.BuyingCurrencyCode,p.BaseBuyingPrice
  // from tbl_quotes tq 
  // INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId
  // Left JOIN tbl_parts p on p.PartId=qi.PartId
  // where tq.IsDeleted=0 and tq.QuoteId=${QuoteId}`;
  // console.log(sql);
  // return sql;
  var sql = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.LeadTime,qi.WarrantyPeriod,
  qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,
  qi.BaseRate,qi.BaseTax,qi.ShippingCharge,qi.BaseShippingCharge, p.VendorId,p.BuyingPrice,p.BuyingExchangeRate,p.BuyingCurrencyCode,p.BaseBuyingPrice
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId and  qi.IsDeleted=0
  Left JOIN tbl_parts_item_shop p on p.PartId=qi.PartId AND p.ShopPartItemId=qi.ShopPartItemId
  where tq.IsDeleted=0 and tq.QuoteId=${QuoteId}`;
 // console.log(sql);
  return sql;

};


QuoteItem.ViewQuoteItemByRRIdQuoteId = (RRId, QuoteId, result) => {
  var sql = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.LeadTime,qi.WarrantyPeriod,qi.PartType,qi.VendorUnitPrice,
   qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,qi.BaseRate,qi.BaseTax,qi.ShippingCharge,qi.BaseShippingCharge
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId and qi.IsDeleted=0
  where tq.IsDeleted=0  and tq.RRId=${RRId} and tq.QuoteId=${QuoteId}`;
  //console.log(sql);
  return sql;

};

QuoteItem.GetRRQuoteItemQuery = (RRId, result) => {
  var sql = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.WarrantyPeriod,qi.LeadTime, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,
  CURL.CurrencySymbol as ItemLocalCurrencySymbol,CURB.CurrencySymbol as ItemBaseCurrencySymbol,qi.BaseRate,qi.BaseTax,qi.ShippingCharge,qi.BaseShippingCharge
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId  and qi.IsDeleted=0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = qi.ItemLocalCurrencyCode AND CURL.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = qi.ItemBaseCurrencyCode AND CURB.IsDeleted = 0
  where tq.IsDeleted=0 and tq.RRId=${RRId}`;
  //console.log(sql);
  return sql;
};

QuoteItem.GetRRSubmittededQuoteItemQuery = (RRId, result) => {
  var sql = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.WarrantyPeriod,qi.LeadTime, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,CURB.CurrencySymbol as ItemBaseCurrencySymbol, CUR.CurrencySymbol as ItemLocalCurrencySymbol,qi.BaseRate,qi.BaseTax,qi.ShippingCharge,qi.BaseShippingCharge
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId and qi.IsDeleted=0
  LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = qi.ItemBaseCurrencyCode AND CURB.IsDeleted = 0
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = qi.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
  where tq.IsDeleted=0 and (tq.Status=4 OR tq.Status=1)  and QuoteCustomerStatus=1 and tq.RRId=${RRId}`;
  //console.log(sql);
  return sql;
};

QuoteItem.GetRRRejectededQuoteItemQuery = (RRId, result) => {
  var sql = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.WarrantyPeriod,qi.LeadTime, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice, CUR.CurrencySymbol as ItemLocalCurrencySymbol,qi.BaseRate,qi.BaseTax,qi.ShippingCharge,qi.BaseShippingCharge
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId and qi.IsDeleted=0
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = qi.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
  where tq.IsDeleted=0 and tq.Status=2 and QuoteCustomerStatus=3 and tq.RRId=${RRId}`;
  //console.log(sql);
  return sql;
};
QuoteItem.GetRRApprovedQuoteItemQuery = (RRId, result) => {
  var sql = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.WarrantyPeriod,qi.LeadTime, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,CUR.CurrencySymbol, CURI.CurrencySymbol as ItemLocalCurrencySymbol,qi.BaseRate,qi.BaseTax,qi.ShippingCharge,qi.BaseShippingCharge
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId and qi.IsDeleted=0
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = tq.LocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURI  ON CURI.CurrencyCode = qi.ItemLocalCurrencyCode AND CURI.IsDeleted = 0
  where tq.IsDeleted=0 and tq.QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED} and tq.RRId=${RRId}`;
  //console.log(sql);
  return sql;
};

QuoteItem.viewquery = (QuoteId) => {
  // var sql = ``;
  // sql = `SELECT QuoteItemId, QuoteId, PartId, 
  // PartNo, PartDescription, SerialNo, LeadTime,  Quantity, Rate, Tax, Discount, Price,WarrantyPeriod,VendorUnitPrice,
  // PartType, ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,CURL.CurrencySymbol as ItemLocalCurrencySymbol,CURB.CurrencySymbol as ItemBaseCurrencySymbol,
  // case PartType
  // WHEN 1 THEN '${Constants.array_part_type[1]}'
  // WHEN 2 THEN '${Constants.array_part_type[2]}'
  // WHEN 3 THEN '${Constants.array_part_type[3]}'
  // WHEN 4 THEN '${Constants.array_part_type[4]}'
  // WHEN 5 THEN '${Constants.array_part_type[5]}'
  // ELSE '-'
  // end PartTypeName
  // FROM tbl_quotes_item as tql
  // LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = ItemLocalCurrencyCode AND CURL.IsDeleted = 0  
  // LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = ItemBaseCurrencyCode AND CURB.IsDeleted = 0  
  // WHERE tql.IsDeleted = 0 AND tql. QuoteId='${QuoteId}'`;
  // return sql;
  var sql = ``;
  sql = `SELECT tql.QuoteItemId, tql.QuoteId, tql.PartId, 
  tql.PartNo, tql.PartDescription, tql.SerialNo, tql.LeadTime,  tql.Quantity,tql.WarrantyPeriod,
  tql.PartType, tql.ItemTaxPercent,tql.ItemExchangeRate,tql.ItemBaseCurrencyCode,
  CURL.CurrencySymbol as ItemLocalCurrencySymbol,CURB.CurrencySymbol as ItemBaseCurrencySymbol,
  tql.ItemLocalCurrencyCode,
  ROUND(ifnull(tql.Rate,0),2) as Rate,
  ROUND(ifnull(tql.Tax,0),2) as Tax,
  ROUND(ifnull((tql.Quantity * tql.Tax),0),2) as TotalTax,
  ROUND(ifnull(tql.Price,0),2) as Price,
  ROUND(ifnull(tql.Discount,0),2) as Discount,
  ROUND(ifnull(tql.VendorUnitPrice,0),2) as VendorUnitPrice,
  ROUND(ifnull(tql.BasePrice,0),2) as BasePrice,
  ROUND(ifnull(tql.BaseRate,0),2) as BaseRate,
  ROUND(ifnull(tql.BaseTax,0),2) as BaseTax,
  ROUND(ifnull(tql.ShippingCharge,0),2) as ShippingCharge,
  ROUND(ifnull(tql.BaseShippingCharge,0),2) as BaseShippingCharge,
  case PartType
  WHEN 1 THEN '${Constants.array_part_type[1]}'
  WHEN 2 THEN '${Constants.array_part_type[2]}'
  WHEN 3 THEN '${Constants.array_part_type[3]}'
  WHEN 4 THEN '${Constants.array_part_type[4]}'
  WHEN 5 THEN '${Constants.array_part_type[5]}'
  ELSE '-'
  end PartTypeName, CON.VatTaxPercentage
  FROM tbl_quotes_item as tql
  Left Join tbl_quotes q on q.QuoteId=tql.QuoteId
  Left Join tbl_customers c on c.CustomerId=q.IdentityId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = tql.ItemLocalCurrencyCode AND CURL.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = tql.ItemBaseCurrencyCode AND CURB.IsDeleted = 0
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = c.CustomerLocation AND CON.IsDeleted = 0
  WHERE tql.IsDeleted = 0 AND q.IsDeleted=0 AND tql.QuoteId='${QuoteId}'`;
  return sql;
};
//
QuoteItem.ViewSingleQuoteItemquery = (QuoteItemId, QuoteId) => {
  var sql = ``;
  sql = `SELECT QuoteItemId, QuoteId, PartId,PartType, ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,
  case PartType
  WHEN 1 THEN '${Constants.array_part_type[1]}'
  WHEN 2 THEN '${Constants.array_part_type[2]}'
  WHEN 3 THEN '${Constants.array_part_type[3]}'
  WHEN 4 THEN '${Constants.array_part_type[4]}'
  WHEN 5 THEN '${Constants.array_part_type[5]}'
  ELSE '-'
  end PartTypeName,
  PartNo, PartDescription, SerialNo, LeadTime,  Quantity, Rate, Tax, Discount, Price,WarrantyPeriod,VendorUnitPrice,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge
  FROM tbl_quotes_item   
  WHERE IsDeleted = 0 AND QuoteId='${QuoteId}' and QuoteItemId='${QuoteItemId}' `;
  // console.log(sql)
  return sql;
};
QuoteItem.viewQuoteItemByMRO = (MROId) => {
  var sql = ``;
  sql = `SELECT q.MROId,QuoteItemId, q.QuoteId, PartId,PartType,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,
  case PartType
  WHEN 1 THEN '${Constants.array_part_type[1]}'
  WHEN 2 THEN '${Constants.array_part_type[2]}'
  WHEN 3 THEN '${Constants.array_part_type[3]}'
  WHEN 4 THEN '${Constants.array_part_type[4]}'
  WHEN 5 THEN '${Constants.array_part_type[5]}'
  ELSE '-'
  end PartTypeName,
  PartNo, PartDescription, SerialNo, qi.LeadTime,  Quantity, qi.Discount,qi.WarrantyPeriod,CUR.CurrencySymbol as ItemLocalCurrencySymbol,
  ROUND(ifnull(qi.Rate,0),2) as Rate,
  ROUND(ifnull(qi.Tax,0),2) as Tax,
  ROUND(ifnull(qi.Price,0),2) as Price,
  ROUND(ifnull(qi.VendorUnitPrice,0),2) as VendorUnitPrice,
  ROUND(ifnull(qi.BaseRate,0),2) as BaseRate,
  ROUND(ifnull(qi.BaseTax,0),2) as BaseTax,
  ROUND(ifnull(qi.ShippingCharge,0),2) as ShippingCharge,
  ROUND(ifnull(qi.BaseShippingCharge,0),2) as BaseShippingCharge,
  ROUND(ifnull(qi.BasePrice,0),2) as BasePrice,
  ROUND(ifnull(qi.ItemTaxPercent,0),2) as ItemTaxPercent
  FROM tbl_quotes_item qi
  Left Join tbl_quotes q on q.QuoteId=qi.QuoteId
  Left Join tbl_mro mro on mro.MROId=q.MROId
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = qi.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
  WHERE qi.IsDeleted = 0 AND q.IsDeleted = 0 AND q.MROId='${MROId}' ORDER BY qi.PartId ASC `;
  return sql;
};


QuoteItem.viewQuoteByMRO = (MROId) => {
  var sql = `SELECT *
  FROM tbl_quotes_item qi
  Left Join tbl_quotes q on q.QuoteId=qi.QuoteId 
  WHERE qi.IsDeleted = 0 AND q.MROId='${MROId}' `;
  return sql;
};


//Below are For MRO :
QuoteItem.GetMROApprovedQuoteItemQuery = (MROId, result) => {
  var sql = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.WarrantyPeriod,qi.LeadTime, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,qi.BaseRate,qi.BaseTax,qi.ShippingCharge,qi.BaseShippingCharge
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId and  qi.IsDeleted=0
  where tq.IsDeleted=0 and tq.QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED} and tq.MROId=${MROId}`;
  //console.log(sql);
  return sql;
};
QuoteItem.ViewQuoteItemByMROIdAndQuoteId = (MROId, QuoteId, result) => {
  var sql = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.LeadTime,qi.WarrantyPeriod, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,qi.BaseRate,qi.BaseTax,qi.ShippingCharge,qi.BaseShippingCharge
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId and  qi.IsDeleted=0
  where tq.IsDeleted=0 and tq.MROId=${MROId} and tq.QuoteId=${QuoteId}`;
  //console.log(sql);
  return sql;

};

QuoteItem.GetQuoteItemByQuoteId = (QuoteId, result) => {

  var sql = `Select * From tbl_quotes_item qi WHERE qi.IsDeleted=0 and qi.QuoteId= ${QuoteId}`;
  // Left Join tbl_sales_order s on s.SOId=si.SOId

  // console.log("sql=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
}
// Quotes.UpdateQuotesCodeByQuoteId = (Quotes, result) => {

//   var sql = `UPDATE tbl_quotes_item  SET   VendorUnitPrice=${Quotes.VendorUnitPrice}  WHERE QuoteId = ${Quotes.QuoteId}`;
//   console.log(sql);
//   return sql;

// };
module.exports = QuoteItem;
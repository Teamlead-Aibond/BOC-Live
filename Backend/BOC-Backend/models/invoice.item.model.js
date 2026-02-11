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

const InvoiceItem = function (objInvoiceItem) {
  this.InvoiceItemId = objInvoiceItem.InvoiceItemId;
  this.InvoiceId = objInvoiceItem.InvoiceId;
  this.SOId = objInvoiceItem.SOId ? objInvoiceItem.SOId : 0;
  this.SOItemId = objInvoiceItem.SOItemId ? objInvoiceItem.SOItemId : 0;
  this.PartId = objInvoiceItem.PartId ? objInvoiceItem.PartId : 0;
  this.PartNo = objInvoiceItem.PartNo ? objInvoiceItem.PartNo : '';
  this.Description = objInvoiceItem.Description ? objInvoiceItem.Description : '';
  this.TaxType = objInvoiceItem.TaxType ? objInvoiceItem.TaxType : 0;
  this.Quantity = objInvoiceItem.Quantity ? objInvoiceItem.Quantity : 1;
  this.Rate = objInvoiceItem.Rate ? objInvoiceItem.Rate : 0;
  this.Discount = objInvoiceItem.Discount ? objInvoiceItem.Discount : 0;
  this.Tax = objInvoiceItem.Tax ? objInvoiceItem.Tax : 0;
  this.Price = objInvoiceItem.Price ? objInvoiceItem.Price : 0;
  this.WarrantyPeriod = objInvoiceItem.WarrantyPeriod ? objInvoiceItem.WarrantyPeriod : 0;
  // IsExcludeFromBlanketPO
  this.IsExcludeFromBlanketPO = objInvoiceItem.IsExcludeFromBlanketPO ? objInvoiceItem.IsExcludeFromBlanketPO : 0;
  // 
  this.ItemTaxPercent = objInvoiceItem.ItemTaxPercent ? objInvoiceItem.ItemTaxPercent : 0;
  this.ItemLocalCurrencyCode = objInvoiceItem.ItemLocalCurrencyCode ? objInvoiceItem.ItemLocalCurrencyCode : '';
  this.ItemExchangeRate = objInvoiceItem.ItemExchangeRate ? objInvoiceItem.ItemExchangeRate : 0;
  this.ItemBaseCurrencyCode = objInvoiceItem.ItemBaseCurrencyCode ? objInvoiceItem.ItemBaseCurrencyCode : '';
  this.BasePrice = objInvoiceItem.BasePrice ? objInvoiceItem.BasePrice : 0;

  this.BaseRate = objInvoiceItem.BaseRate ? objInvoiceItem.BaseRate : 0;
  this.BaseTax = objInvoiceItem.BaseTax ? objInvoiceItem.BaseTax : 0;

  this.ShippingCharge = objInvoiceItem.ShippingCharge ? objInvoiceItem.ShippingCharge : 0;
  this.BaseShippingCharge = objInvoiceItem.BaseShippingCharge ? objInvoiceItem.BaseShippingCharge : 0;


  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objInvoiceItem.authuser && objInvoiceItem.authuser.UserId) ? objInvoiceItem.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objInvoiceItem.authuser && objInvoiceItem.authuser.UserId) ? objInvoiceItem.authuser.UserId : TokenUserId;

}


InvoiceItem.Create = (InvoiceId, InvoiceItem1, result) => {
  var sql = `insert into tbl_invoice_item(InvoiceId,SOId,SOItemId,PartId,PartNo,Description,TaxType,Quantity,Rate,Discount,Tax,Price,Created,CreatedBy,WarrantyPeriod,IsExcludeFromBlanketPO,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge) values`;
  for (let val of InvoiceItem1) {
    val = escapeSqlValues(val);
    val = new InvoiceItem(val);
    // console.log(val)
    sql = sql + `('${InvoiceId}','${val.SOId}','${val.SOItemId}','${val.PartId}','${val.PartNo}','${val.Description}','${val.TaxType}','${val.Quantity}','${val.Rate}','${val.Discount}','${val.Tax}','${val.Price}','${val.Created}','${val.CreatedBy}','${val.WarrantyPeriod}','${val.IsExcludeFromBlanketPO}','${val.ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${val.ItemExchangeRate}','${val.ItemBaseCurrencyCode}','${val.BasePrice}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}'),`;
  }

  var Query = sql.slice(0, -1);
  //console.log("Query = " + Query);
  con.query(Query, (err, res) => {
    if (err) {
      console.log("err = " + err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;
  });
};

InvoiceItem.Update = (Invoice, result) => {

  for (let obj of Invoice.InvoiceItem) {
    // console.log("inside model 1");
    // console.log(obj);
    var SOIID = obj.SOItemId ? obj.SOItemId : 0;
    var objs = escapeSqlValues(obj);
    // console.log("inside model 2");
    // console.log(objs);
    let val = new InvoiceItem(objs);
    // console.log("inside model 2");
    // console.log(val);
    val.InvoiceId = Invoice.InvoiceId;
    val.SOId = Invoice.SOId;
    // val.SOItemId = Invoice.SOItemId;
    // console.log(val);
    // console.log("val.InvoiceItemId=" + val.InvoiceItemId)
    var sql = ``;
    if (val.InvoiceItemId && val.InvoiceItemId != null) {
      sql = `UPDATE tbl_invoice_item SET InvoiceId = ?, PartId=?, PartNo = ?,
    Description = ?, TaxType = ?, Quantity = ?,Rate=?,Discount = ?, 
    Tax = ?, Price = ?,WarrantyPeriod = ?, IsExcludeFromBlanketPO = ?, Modified = ?, ModifiedBy = ?,
    ItemTaxPercent=?,ItemLocalCurrencyCode=?,ItemExchangeRate=?,ItemBaseCurrencyCode=?,BasePrice=?,BaseRate=?,BaseTax=?,ShippingCharge=?,BaseShippingCharge=? WHERE InvoiceItemId = ?`;
      var values = [
        Invoice.InvoiceId, val.PartId, val.PartNo,
        val.Description, val.TaxType, val.Quantity,
        val.Rate, val.Discount, val.Tax, val.Price, val.WarrantyPeriod, val.IsExcludeFromBlanketPO,
        val.Modified, val.ModifiedBy,
        val.ItemTaxPercent, val.ItemLocalCurrencyCode, val.ItemExchangeRate, val.ItemBaseCurrencyCode, val.BasePrice, val.BaseRate, val.BaseTax, val.ShippingCharge, val.BaseShippingCharge, val.InvoiceItemId
      ];
      //  console.log("InvoiceItem =" + values);

      con.query(sql, values, (err, res) => {
        if (err) {
          //  console.log("error: ", err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ msg: "Invoice item not found" }, null);
          return;
        }
      });
    }
    else {
      var sql = `insert into tbl_invoice_item(InvoiceId,SOId,SOItemId,PartId,PartNo,Description,TaxType,
        Quantity,Rate,Discount,Tax,Price,WarrantyPeriod,IsExcludeFromBlanketPO,Created,CreatedBy,
        ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge)
        values ('${val.InvoiceId}','${val.SOId}','${SOIID}','${val.PartId}','${val.PartNo}','${val.Description}',
        '${val.TaxType}','${val.Quantity}','${val.Rate}','${val.Discount}','${val.Tax}',
        '${val.Price}','${val.WarrantyPeriod}','${val.IsExcludeFromBlanketPO}','${val.Created}','${val.CreatedBy}',
        '${val.ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${val.ItemExchangeRate}','${val.ItemBaseCurrencyCode}','${val.BasePrice}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}')`;
      // console.log("=" + sql);
      con.query(sql, (err, res) => {
        if (err) {
          // console.log("error: ", err);
          result(err, null);
          return;
        }
      });
    }
  }
  result(null, { data: Invoice.InvoiceItem });
  return;
};

InvoiceItem.view = (InvoiceId) => {
  var sql = `Select InvoiceItemId,InvoiceId,ii.PartId,rr.SerialNo,ii.PartNo,ii.Description,ii.SOId,ii.SOItemId,
  ii.TaxType,ii.Quantity,ii.Discount,ii.WarrantyPeriod,ii.IsExcludeFromBlanketPO,
  ii.ItemTaxPercent,ii.ItemLocalCurrencyCode,ii.ItemExchangeRate,ii.ItemBaseCurrencyCode,
  i.LocalCurrencyCode,i.ExchangeRate,i.BaseCurrencyCode,ROUND(ifnull(ii.Rate,0),2) as Rate,
  ROUND(ifnull(ii.Tax,0),2) as Tax,
  ROUND(ifnull((ii.Quantity * ii.Tax),0),2) as TotalTax,
  ROUND(ifnull(ii.Price,0),2) as Price,
  ROUND(ifnull(ii.BasePrice,0),2) as BasePrice,
  ROUND(ifnull(ii.BaseRate,0),2) as BaseRate,
  ROUND(ifnull(ii.BaseTax,0),2) as BaseTax,
  ROUND(ifnull(i.BaseGrandTotal,0),2) as BaseGrandTotal,
  CURB.CurrencySymbol as BaseCurrencySymbol,CURL.CurrencySymbol as LocalCurrencySymbol,CUR.CurrencySymbol as ItemLocalCurrencySymbol,
  QI.PartType,QI.BaseRate,QI.BaseTax,ii.ShippingCharge,ii.BaseShippingCharge,
 case QI.PartType
  WHEN 1 THEN '${Constants.array_part_type[1]}'
  WHEN 2 THEN '${Constants.array_part_type[2]}'
  WHEN 3 THEN '${Constants.array_part_type[3]}'
  WHEN 4 THEN '${Constants.array_part_type[4]}'
  WHEN 5 THEN '${Constants.array_part_type[5]}'
  ELSE '-'
  end PartTypeName,SOI.Quantity as SOQuantity,SOI.Rate as SORate,SOI.Discount as SODiscount,SOI.Tax as SOTax,SOI.Price as SOPrice,
  SOI.ItemTaxPercent as SOItemTaxPercent,SOI.ItemLocalCurrencyCode as SOItemLocalCurrencyCode,SOI.ItemExchangeRate as SOItemExchangeRate,SOI.ItemBaseCurrencyCode as SOItemBaseCurrencyCode,SOI.BasePrice as SOBasePrice,SOI.BaseRate as SOBaseRate,SOI.BaseTax as SOBaseTax,CURS.CurrencySymbol as SOLocalCurrencySymbol, SOI.ShippingCharge as SOShippingCharge
  from tbl_invoice_item ii
  Left Join tbl_invoice i  Using(InvoiceId)
  Left Join tbl_repair_request rr on rr.RRId=i.RRId and rr.PartId=ii.PartId
  Left Join tbl_mro as MRO ON MRO.MROId = i.MROId and MRO.IsDeleted = 0 AND MRO.MROId>0
  LEFT JOIN  tbl_quotes as Q ON Q.MROId = i.MROId and Q.IsDeleted = 0 AND Q.MROId>0
  LEFT JOIN tbl_quotes_item as QI on QI.QuoteId = Q.QuoteId and QI.PartId = ii.PartId AND QI.IsDeleted = 0
  LEFT JOIN tbl_sales_order_item as SOI on SOI.SOItemId = ii.SOItemId AND SOI.IsDeleted = 0
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = ii.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = i.BaseCurrencyCode AND CURB.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = i.LocalCurrencyCode AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CURS  ON CURS.CurrencyCode = SOI.ItemLocalCurrencyCode AND CURS.IsDeleted = 0 
  WHERE ii.IsDeleted=0 and InvoiceId='${InvoiceId}'`;
  //console.log(sql)
  return sql;
}

InvoiceItem.calculateVat = (InvoiceId) => {
  return `Select  
  ROUND(SUM((ROUND(ifnull(ii.Tax,0),2) * ii.Quantity))  ,2)  as TotalTax
  from tbl_invoice_item ii
  Left Join tbl_invoice i  Using(InvoiceId) 
  WHERE i.IsDeleted= 0 AND ii.IsDeleted=0 and ii.InvoiceId='${InvoiceId}'`;
}

InvoiceItem.VendorPOByInvoice = (InvoiceId) => {
  // ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)) + Ifnull(ii.ShippingCharge,0)),0),2) as VendorPOCost1,
  // CONCAT('',' ',ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))*Ifnull(ii.Quantity,0)) + Ifnull(ii.BaseShippingCharge,0)),0),2)) as VendorPOCost,

  // 
  // ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)) + Ifnull(poi.ShippingCharge,0)),0),2) as VendorPOCost1,
  // CONCAT('',' ', ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))+Ifnull(poi.ShippingCharge,0)) * Ifnull(EXR.ExchangeRate,1)),0),2)) as VendorPOCost,
  var sql = `Select   
  ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0)) + ((Ifnull(poi.ShippingCharge,0)/Ifnull(poi.Quantity,0))*Ifnull(ii.Quantity,0))),0),2) as VendorPOCost1,
  CONCAT('',' ', ROUND(ifnull(sum((((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(ii.Quantity,0))+((Ifnull(poi.ShippingCharge,0)/Ifnull(poi.Quantity,0))*Ifnull(ii.Quantity,0))) * Ifnull(EXR.ExchangeRate,1)),0),2)) as VendorPOCost,
  CURT.CurrencySymbol as CurrencySymbol,CURL.CurrencySymbol as CurrencySymbol1
  From tbl_invoice i
  Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
  Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
  Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
  left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = poi.ItemLocalCurrencyCode AND CURL.IsDeleted = 0 
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = ii.ItemLocalCurrencyCode AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CURT  ON CURT.CurrencyCode = ii.ItemLocalCurrencyCode AND CURT.IsDeleted = 0 
  WHERE ii.IsDeleted=0  and i.IsDeleted=0 and i.InvoiceId='${InvoiceId}'
  GROUP BY CurrencySymbol,CurrencySymbol1`;
  // var sql = `Select   ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0)))),0)*Ifnull(poi.Quantity,0),2) as VendorPOCost1,
  // CONCAT('',' ',ROUND(ifnull(sum(((Ifnull(poi.Rate,0)+Ifnull(poi.Tax,0))*Ifnull(EXR.ExchangeRate,1))),0)*Ifnull(poi.Quantity,0),2)) as VendorPOCost,
  // CURT.CurrencySymbol as CurrencySymbol,CURL.CurrencySymbol as CurrencySymbol1
  // From tbl_invoice i
  // Left JOIN tbl_invoice_item as ii on ii.InvoiceId=i.InvoiceId AND ii.IsDeleted = 0
  // Left JOIN tbl_sales_order as so on so.SOId=i.SOId AND so.IsDeleted = 0 AND so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}
  // Left JOIN tbl_po as po on po.POId=so.POId AND po.IsDeleted = 0  AND po.Status!=${Constants.CONST_PO_STATUS_CANCELLED}
  // Left JOIN tbl_sales_order_item as soi on soi.SOItemId=ii.SOItemId AND soi.IsDeleted = 0 AND soi.SOId = so.SOId
  // left JOIN tbl_po_item as poi on poi.POItemId=soi.POItemId AND poi.IsDeleted = 0 
  // LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = poi.ItemLocalCurrencyCode AND CURL.IsDeleted = 0 
  // LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = poi.ItemLocalCurrencyCode AND EXR.TargetCurrencyCode = ii.ItemLocalCurrencyCode AND  (DATE(i.Created) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  // LEFT JOIN tbl_currencies as CURT  ON CURT.CurrencyCode = ii.ItemLocalCurrencyCode AND CURT.IsDeleted = 0 
  // WHERE ii.IsDeleted=0  and i.IsDeleted=0 and i.InvoiceId='${InvoiceId}'
  // GROUP BY CurrencySymbol,CurrencySymbol1,poi.Quantity`;
  // console.log(sql)
  return sql;
}


// To DeleteInvoiceItem
InvoiceItem.DeleteInvoiceItem = (InvoiceItemId, result) => {
  let Obj = new InvoiceItem({ InvoiceItemId: InvoiceItemId });
  var sql = `UPDATE tbl_invoice_item SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE InvoiceItemId=${Obj.InvoiceItemId}`;
  // console.log("sql=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: Obj.InvoiceId });
    return;

  });
}
// To DeleteInvoiceItem
InvoiceItem.GetInvoiceItemId = (SOItemId, result) => {

  //   var sql = `Select  ii.InvoiceItemId,'g' as g,i.InvoiceId
  // From tbl_invoice_item ii
  // Left Join tbl_invoice i on i.InvoiceId=ii.InvoiceId
  // WHERE ii.IsDeleted=0  and i.RRId=0 and i.MROId=0 and i.SOId=(Select SOId From tbl_sales_order_item where 
  // SOItemId=${SOItemId}) and ii.PartId=(Select PartId From tbl_sales_order_item where
  // SOItemId=${SOItemId})  `;
  var sql = `Select  ii.InvoiceItemId,'g' as g,i.InvoiceId
From tbl_invoice_item ii
Left Join tbl_invoice i on i.InvoiceId=ii.InvoiceId
WHERE ii.IsDeleted=0 and i.MROId=0 and i.SOId=(Select SOId From tbl_sales_order_item where 
SOItemId=${SOItemId}) and ii.PartId=(Select PartId From tbl_sales_order_item where
SOItemId=${SOItemId})  `;
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
//
InvoiceItem.UpdateTaxPercent = (Taxpercent, InvoiceId, result) => {
  var sql = ` UPDATE tbl_invoice SET TaxPercent='${Taxpercent}' WHERE InvoiceId=${InvoiceId} `;
  //console.log("sql=" + sql)
  return sql;
}
//To SelectNewCalculationAfterInvoiceItemDelete
InvoiceItem.SelectNewCalculationAfterInvoiceItemDelete = (InvoiceId, InvoiceItemId, result) => {

  var sql = ` SELECT InvoiceId,SubTotal,GrandTotal,BaseGrandTotal, 
SubTotal-IFNULL((Select SUM(Price) From tbl_invoice_item where IsDeleted=0 and IsExcludeFromBlanketPO=1 and InvoiceId=${InvoiceId}),0) as BlanketPONetAmount,
IFNULL((Select SUM(Price) From tbl_invoice_item where IsDeleted=0 and IsExcludeFromBlanketPO=1 and InvoiceId=${InvoiceId}),0) as BlanketPOExcludeAmount
from(
SELECT Sum(ii.Price) as SubTotal,Sum(ii.Price) as GrandTotal,Sum(ii.BasePrice) as BaseGrandTotal,ii.InvoiceId
FROM tbl_invoice_item ii
INNER JOIN tbl_invoice i on ii.InvoiceId=i.InvoiceId where ii.InvoiceId=${InvoiceId}
and ii.IsDeleted<>1 Group By i.InvoiceId) as x;`;
  // console.log("sql: " + sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { res });
  });
}

//Global Search
InvoiceItem.findInColumns = (searchQuery, result) => {

  const { from, size, query } = searchQuery;
  let { IdentityType, MultipleAccessIdentityIds, IsRestrictedCustomerAccess, MultipleCustomerIds } = global.authuser;
  var sql = `SELECT 'ahoms-sales-invoice-items' as _index,
  II.InvoiceId as invoiceid, I.InvoiceNo as invoiceno, II.PartId as pid, II.PartNo as pno
  FROM tbl_invoice_item as II
  LEFT JOIN tbl_parts as P ON II.PartId = P.PartId
  LEFT JOIN tbl_invoice as I ON I.invoiceid = II.invoiceid
  where
  (
    I.InvoiceNo like '%${query.multi_match.query}%' or
    II.Description like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.Description like '%${query.multi_match.query}%'
  ) and II.IsDeleted=0 and I.InvoiceNo IS NOT NULL
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND I.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size}`;

  var countSql = `SELECT count(*) AS totalCount 
  FROM tbl_invoice_item as II
  LEFT JOIN tbl_parts as P ON II.PartId = P.PartId
  LEFT JOIN tbl_invoice as I ON I.invoiceid = II.invoiceid
  where
  (
    I.InvoiceNo like '%${query.multi_match.query}%' or
    II.Description like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.Description like '%${query.multi_match.query}%'
  ) and II.IsDeleted=0 and I.InvoiceNo IS NOT NULL
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND I.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  `


  //console.log("" + sql)
  //console.log("" + countSql)
  con.query(countSql, (err, res) => {
    if (err) {
      return result(err, null);
    } else if (res[0].totalCount > 0) {
      let totalCount = res[0].totalCount;
      con.query(sql, (err, res) => {
        if (err) {
          return result(err, null);
        }
        return result(null, { totalCount: { "_index": "ahoms-sales-invoice", val: totalCount }, data: res });
      });
    } else {
      return result(null, []);
    }

  });
}
// GetInvoiceItem
InvoiceItem.GetInvoiceItemBySOId = (SOId) => {

  var sql = `Select  * From tbl_invoice_item ii where ii.IsDeleted=0 and ii.SOId=${SOId} `;
  return sql;
}

module.exports = InvoiceItem;

/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");

const VendorInvItem = function (objVendorInvoiceItem) {
  this.VendorInvoiceItemId = objVendorInvoiceItem.VendorInvoiceItemId;

  this.POId = objVendorInvoiceItem.POId ? objVendorInvoiceItem.POId : 0;
  this.PONo = objVendorInvoiceItem.PONo ? objVendorInvoiceItem.PONo : '';
  this.POItemId = objVendorInvoiceItem.POItemId ? objVendorInvoiceItem.POItemId : 0;

  this.VendorInvoiceId = objVendorInvoiceItem.VendorInvoiceId ? objVendorInvoiceItem.VendorInvoiceId : 0;
  this.PartId = objVendorInvoiceItem.PartId;

  this.PartNo = objVendorInvoiceItem.PartNo ? objVendorInvoiceItem.PartNo : '';
  this.Description = objVendorInvoiceItem.Description ? objVendorInvoiceItem.Description : '';
  this.TaxType = objVendorInvoiceItem.TaxType ? objVendorInvoiceItem.TaxType : 0;
  this.Quantity = objVendorInvoiceItem.Quantity ? objVendorInvoiceItem.Quantity : 0;
  this.Rate = objVendorInvoiceItem.Rate ? objVendorInvoiceItem.Rate : 0;
  this.Discount = objVendorInvoiceItem.Discount ? objVendorInvoiceItem.Discount : 0;
  this.Tax = objVendorInvoiceItem.Tax ? objVendorInvoiceItem.Tax : 0;
  this.Price = objVendorInvoiceItem.Price ? objVendorInvoiceItem.Price : 0;

  this.ItemTaxPercent = objVendorInvoiceItem.ItemTaxPercent ? objVendorInvoiceItem.ItemTaxPercent : 0;
  this.ItemLocalCurrencyCode = objVendorInvoiceItem.ItemLocalCurrencyCode ? objVendorInvoiceItem.ItemLocalCurrencyCode : '';
  this.ItemExchangeRate = objVendorInvoiceItem.ItemExchangeRate ? objVendorInvoiceItem.ItemExchangeRate : 0;
  this.ItemBaseCurrencyCode = objVendorInvoiceItem.ItemBaseCurrencyCode ? objVendorInvoiceItem.ItemBaseCurrencyCode : '';
  this.BasePrice = objVendorInvoiceItem.BasePrice ? objVendorInvoiceItem.BasePrice : 0;

  this.BaseRate = objVendorInvoiceItem.BaseRate ? objVendorInvoiceItem.BaseRate : 0;
  this.BaseTax = objVendorInvoiceItem.BaseTax ? objVendorInvoiceItem.BaseTax : 0;

  this.ShippingCharge = objVendorInvoiceItem.ShippingCharge ? objVendorInvoiceItem.ShippingCharge : 0;
  this.BaseShippingCharge = objVendorInvoiceItem.BaseShippingCharge ? objVendorInvoiceItem.BaseShippingCharge : 0;


  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objVendorInvoiceItem.authuser && objVendorInvoiceItem.authuser.UserId) ? objVendorInvoiceItem.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objVendorInvoiceItem.authuser && objVendorInvoiceItem.authuser.UserId) ? objVendorInvoiceItem.authuser.UserId : TokenUserId;
};

//To Create the VendorInvoiceItem
VendorInvItem.Create = (VendorInvoiceId, VendorInvoiceItemList, result) => {
  var sql = `insert into tbl_vendor_invoice_item(VendorInvoiceId,POId,PONo,POItemId,PartId,PartNo,
    Description,TaxType,Quantity,
    Rate,Discount,Tax,Price,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,
    Created,CreatedBy,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge) values`;
  for (let val of VendorInvoiceItemList) {
    val = escapeSqlValues(val);
    const obj = new VendorInvItem(val);
    sql += `('${VendorInvoiceId}','${obj.POId}','${obj.PONo}','${obj.POItemId}','${obj.PartId}','${obj.PartNo}',
    '${obj.Description}','${obj.TaxType}','${obj.Quantity}','
    ${obj.Rate}','${obj.Discount}','${obj.Tax}',
    '${obj.Price}','${obj.ItemTaxPercent}','${obj.ItemLocalCurrencyCode}','${obj.ItemExchangeRate}','${obj.ItemBaseCurrencyCode}','${obj.BasePrice}','${obj.Created}','${obj.CreatedBy}','${obj.BaseRate}','${obj.BaseTax}','${obj.ShippingCharge}','${obj.BaseShippingCharge}'),`;
  }
  var Query = sql.slice(0, -1);
  // console.log(Query)
  con.query(Query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;
  });
}

//To update the VendorInvoiceItem
VendorInvItem.Update = (VendorInvItemList, result) => {
  var POItemId = '';
  for (let obj of VendorInvItemList) {
    obj = escapeSqlValues(obj);
    let val = new VendorInvItem(obj);

    if (val.VendorInvoiceItemId != "" && val.VendorInvoiceItemId != null) {

      POItemId += val.POItemId + ",";
      var sql = ``;
      sql = `UPDATE tbl_vendor_invoice_item SET 
  VendorInvoiceId = ?, PartId = ?,PartNo=?, POId = ?,PONo=?,POItemId=?,
  Description = ?, TaxType = ?, Quantity = ?,
  Rate = ?,Discount = ?, Tax = ?, 
  Price = ?,Modified = ?, ModifiedBy = ?,
  ItemTaxPercent=?,ItemLocalCurrencyCode=?,ItemExchangeRate=?,ItemBaseCurrencyCode=?,BasePrice=?,BaseRate=?,BaseTax=?,ShippingCharge=?,BaseShippingCharge=? WHERE VendorInvoiceItemId = ?`;
      var values = [
        val.VendorInvoiceId, val.PartId, val.PartNo, val.POId, val.PONo, val.POItemId, val.Description,
        val.TaxType, val.Quantity, val.Rate,
        val.Discount, val.Tax, val.Price,
        val.Modified, val.ModifiedBy, val.ItemTaxPercent, val.ItemLocalCurrencyCode, val.ItemExchangeRate, val.ItemBaseCurrencyCode, val.BasePrice, val.BaseRate, val.BaseTax, val.ShippingCharge, val.BaseShippingCharge, val.VendorInvoiceItemId
      ];
      con.query(sql, values, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
      }
      );
    } else {

      var sql = `insert into tbl_vendor_invoice_item(VendorInvoiceId,POId,PONo,POItemId,PartId,PartNo,
      Description,TaxType,Quantity,
      Rate,Discount,Tax,Price,
      Created,CreatedBy,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge) values ('${val.VendorInvoiceId}','${val.POId}','${val.PONo}','${val.POItemId}','${val.PartId}','${val.PartNo}',
      '${val.Description}','${val.TaxType}','${val.Quantity}','${val.Rate}','${val.Discount}','${val.Tax}',
      '${val.Price}','${val.Created}','${val.CreatedBy}',
      '${val.ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${val.ItemExchangeRate}','${val.ItemBaseCurrencyCode}','${val.BasePrice}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}')`;
      // console.log("Update Insert ==================", sql);
      con.query(sql, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
      }
      );

    }
  }


  if (POItemId) {
    POItemId = POItemId.slice(0, -1);
    // console.log(POItemId);
    var sqlUpdateIsAddedToVendorBillByPOItem = VendorInvItem.UpdateIsAddedToVendorBillByPOItem(POItemId);
    con.query(sqlUpdateIsAddedToVendorBillByPOItem, values, (err, res) => {

      result(null, { data: VendorInvItemList });
      return;
    }
    );
  } else {
    result(null, { data: VendorInvItemList });
    return;
  }

};

// 
VendorInvItem.GetVendorInvoiceItemId = (POItemId, result) => {

  var sql = `Select  vi.VendorInvoiceItemId,'g' as g,v.VendorInvoiceId
From tbl_vendor_invoice_item vi
Left Join tbl_vendor_invoice v on v.VendorInvoiceId=vi.VendorInvoiceId
WHERE vi.IsDeleted=0  and v.RRId=0 and v.MROId=0 and v.POId=(Select POId From tbl_po_item where
POItemId=${POItemId}) and vi.PartId=(Select PartId From tbl_po_item where
POItemId=${POItemId} ) `;

  // console.log("sql=" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
}

//To view the VendorInvoiceItem
VendorInvItem.view = (VendorInvoiceId) => {
  var sql = `Select vi.*,rr.SerialNo,CURB.CurrencySymbol as BaseCurrencySymbol,CURL.CurrencySymbol as LocalCurrencySymbol,CUR.CurrencySymbol as ItemLocalCurrencySymbol,
  ROUND(ifnull(vi.BasePrice,0),2) as BasePrice,
  ROUND(ifnull(vi.BaseRate,0),2) as BaseRate,
  ROUND(ifnull(vi.BaseShippingCharge,0),2) as BaseShippingCharge,
  ROUND(ifnull(vi.BaseTax,0),2) as BaseTax,
  ROUND(ifnull(vi.ItemTaxPercent,0),2) as ItemTaxPercent,
  ROUND(ifnull(vi.Price,0),2) as Price,
  ROUND(ifnull(vi.Rate,0),2) as Rate,
  ROUND(ifnull(vi.ShippingCharge,0),2) as ShippingCharge,
  ROUND(ifnull(vi.Tax,0),2) as Tax,
  ROUND(ifnull((vi.Quantity * vi.Tax),0),2) as TotalTax
  from tbl_vendor_invoice_item vi
  Left Join tbl_vendor_invoice v using(VendorInvoiceId)
  Left Join tbl_repair_request rr on rr.RRId=v.RRId and rr.PartId=vi.PartId
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = vi.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = v.BaseCurrencyCode AND CURB.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = v.LocalCurrencyCode AND CURL.IsDeleted = 0 
  WHERE vi.IsDeleted=0 and vi.VendorInvoiceId='${VendorInvoiceId}'`;
  return sql;
}

//To view the VendorInvoiceItem
VendorInvItem.UpdateIsAddedToVendorBillByPO = (POId) => {
  var sql = `UPDATE tbl_po_item  SET IsAddedToVendorBill = 1  
  WHERE IsDeleted=0 and POId='${POId}'`;
  // console.log(sql);
  return sql;
}

//To view the VendorInvoiceItem
VendorInvItem.UpdateIsAddedToVendorBillByPOItem = (POItemId) => {
  var sql = `UPDATE tbl_po_item  SET IsAddedToVendorBill = 1  
  WHERE IsDeleted=0 and POItemId IN(${POItemId})`;
  return sql;
}

// To DeleteQuoteItem
VendorInvItem.DeleteVendorInvItem = (VendorInvoiceItemId, result) => {
  let Obj = new VendorInvItem({ VendorInvoiceItemId: VendorInvoiceItemId });
  var sql = `UPDATE tbl_vendor_invoice_item SET IsDeleted=1, Modified='${Obj.Modified}', ModifiedBy=${Obj.ModifiedBy}  WHERE VendorInvoiceItemId=${Obj.VendorInvoiceItemId}`;
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      result({ msg: "Vendor Invoice ItemId not deleted!" }, null);
    return result(null, res);
  });
};

//Select New Calculation After VendorInvItem Delete
VendorInvItem.SelectNewCalculationAfterVendorInvItemDelete = (VendorInvoiceItemId, result) => {

  var sql = `SELECT VendorInvoiceId,SubTotal,TotalTax,AHFees,Shipping,TaxPercent,
  ((SubTotal+TotalTax+AHFees+Shipping)-Discount) as GrandTotal from(
  SELECT Sum(vi.Price) as SubTotal,(Sum(vi.Price)*v.TaxPercent/100)as TotalTax ,v.VendorInvoiceId,v.AHFees,v.Discount,v.Shipping,v.TaxPercent
  FROM tbl_vendor_invoice_item vi
  INNER JOIN tbl_vendor_invoice v on vi.VendorInvoiceId=v.VendorInvoiceId where vi.VendorInvoiceId=
  (SELECT VendorInvoiceId from tbl_vendor_invoice_item where VendorInvoiceItemId='${VendorInvoiceItemId}')
  and vi.IsDeleted<>1 Group By v.VendorInvoiceId) as x `;
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { res });
  });
}

//Global Search
VendorInvItem.findInColumns = (searchQuery, result) => {

  const { from, size, query } = searchQuery;
  let { IdentityType, MultipleAccessIdentityIds, IsRestrictedCustomerAccess, MultipleCustomerIds } = global.authuser;
  if (IdentityType == "1") {
    return result(null, []);
  }

  var sql = `SELECT 'ahoms-purchase-invoice-items' as _index,
  PII.VendorInvoiceId as vendorinvoiceid, PI.VendorInvoiceNo as vendorinvoiceno, PII.PartId as pid, PII.PartNo as pno
  FROM tbl_vendor_invoice_item as PII
  LEFT JOIN tbl_parts as P ON PII.PartId = P.PartId
  LEFT JOIN tbl_vendor_invoice as PI ON PI.VendorInvoiceId = PII.VendorInvoiceId
  LEFT JOIN tbl_customers as C ON C.CustomerId = PI.CustomerId
  where
  (
    PII.Description like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.Description like '%${query.multi_match.query}%'
  ) and PII.IsDeleted=0 and PI.VendorInvoiceNo IS NOT NULL
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND C.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size} `;

  var countSql = `SELECT count(*) AS totalCount 
  FROM tbl_vendor_invoice_item as PII
  LEFT JOIN tbl_parts as P ON PII.PartId = P.PartId
  LEFT JOIN tbl_vendor_invoice as PI ON PI.VendorInvoiceId = PII.VendorInvoiceId
  LEFT JOIN tbl_customers as C ON C.CustomerId = PI.CustomerId
  where
  (
    PII.Description like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.Description like '%${query.multi_match.query}%'
  ) and PII.IsDeleted=0 and PI.VendorInvoiceNo IS NOT NULL
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND C.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  `


  // console.log("" + sql)
  // console.log("" + countSql)
  con.query(countSql, (err, res) => {
    if (err) {
      return result(err, null);
    } else if (res[0].totalCount > 0) {
      let totalCount = res[0].totalCount;
      con.query(sql, (err, res) => {
        if (err) {
          return result(err, null);
        }
        return result(null, { totalCount: { "_index": "ahoms-purchase-invoice", val: totalCount }, data: res });
      });
    } else {
      return result(null, []);
    }

  });
}

module.exports = VendorInvItem;
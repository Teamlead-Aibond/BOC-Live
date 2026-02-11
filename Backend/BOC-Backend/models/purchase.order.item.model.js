/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");
const PurchaseOrderItem = function (objPurchaseOrderItem) {
  this.POItemId = objPurchaseOrderItem.POItemId;
  this.POId = objPurchaseOrderItem.POId;
  this.SOId = objPurchaseOrderItem.SOId ? objPurchaseOrderItem.SOId : 0;
  this.SOItemId = objPurchaseOrderItem.SOItemId ? objPurchaseOrderItem.SOItemId : 0;
  this.PartId = objPurchaseOrderItem.PartId;
  this.PartNo = objPurchaseOrderItem.PartNo ? objPurchaseOrderItem.PartNo : '';
  this.Description = objPurchaseOrderItem.Description ? objPurchaseOrderItem.Description : '';
  this.LeadTime = objPurchaseOrderItem.LeadTime ? objPurchaseOrderItem.LeadTime : '';
  this.Quantity = objPurchaseOrderItem.Quantity ? objPurchaseOrderItem.Quantity : 1;
  this.WarrantyPeriod = objPurchaseOrderItem.WarrantyPeriod ? objPurchaseOrderItem.WarrantyPeriod : 0;
  this.IsAddedToVendorBill = objPurchaseOrderItem.IsAddedToVendorBill ? objPurchaseOrderItem.IsAddedToVendorBill : 0;
  this.Tax = objPurchaseOrderItem.Tax ? objPurchaseOrderItem.Tax : 0;

  this.ItemTaxPercent = objPurchaseOrderItem.ItemTaxPercent ? objPurchaseOrderItem.ItemTaxPercent : 0;
  this.ItemLocalCurrencyCode = objPurchaseOrderItem.ItemLocalCurrencyCode ? objPurchaseOrderItem.ItemLocalCurrencyCode : '';
  this.ItemExchangeRate = objPurchaseOrderItem.ItemExchangeRate ? objPurchaseOrderItem.ItemExchangeRate : 0;
  this.ItemBaseCurrencyCode = objPurchaseOrderItem.ItemBaseCurrencyCode ? objPurchaseOrderItem.ItemBaseCurrencyCode : '';
  this.BasePrice = objPurchaseOrderItem.BasePrice ? objPurchaseOrderItem.BasePrice : 0;

  this.BaseRate = objPurchaseOrderItem.BaseRate ? objPurchaseOrderItem.BaseRate : 0;
  this.BaseTax = objPurchaseOrderItem.BaseTax ? objPurchaseOrderItem.BaseTax : 0;

  this.ShippingCharge = objPurchaseOrderItem.ShippingCharge ? objPurchaseOrderItem.ShippingCharge : 0;
  this.BaseShippingCharge = objPurchaseOrderItem.BaseShippingCharge ? objPurchaseOrderItem.BaseShippingCharge : 0;


  // this.PurchaseUnit=objPurchaseOrderItem.PurchaseUnit ; 
  this.PurchaseUnit = objPurchaseOrderItem.PurchaseUnit ? objPurchaseOrderItem.PurchaseUnit : 0;
  this.Rate = objPurchaseOrderItem.Rate ? objPurchaseOrderItem.Rate : 0;
  this.Price = objPurchaseOrderItem.Price ? objPurchaseOrderItem.Price : 0;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objPurchaseOrderItem.authuser && objPurchaseOrderItem.authuser.UserId) ? objPurchaseOrderItem.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objPurchaseOrderItem.authuser && objPurchaseOrderItem.authuser.UserId) ? objPurchaseOrderItem.authuser.UserId : TokenUserId;
  this.Status = objPurchaseOrderItem.Status;
};



PurchaseOrderItem.AutoCreatePurchaseOrderItem = (POId, PurchaseOrderItem1, result) => {
  var sumOfFinalPrice = 0;

  var sql = `insert into tbl_po_item(POId,SOId,SOItemId,PartId,PartNo,Description,LeadTime,WarrantyPeriod,Quantity,PurchaseUnit,Rate,Price,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,Tax
        ,Created,CreatedBy,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge) values `;
  for (let val of PurchaseOrderItem1) {
    val = escapeSqlValues(val);
    val = new PurchaseOrderItem(val);
    sql = sql + `('${POId}','${val.SOId}','${val.SOItemId}','${val.PartId}','${val.PartNo}','${val.Description}','${val.LeadTime}',${val.WarrantyPeriod},'${val.Quantity}','${val.PurchaseUnit}','${val.Rate}','${val.Price}','${val.ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${val.ItemExchangeRate}','${val.ItemBaseCurrencyCode}','${val.BasePrice}','${val.Tax}','${val.Created}','${val.CreatedBy}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}'),`;
  }

  var Query = sql.slice(0, -1);
  //console.log("PO Item query :" + Query)
  con.query(Query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
  });

};

PurchaseOrderItem.UpdatePurchaseOrderItem = (objPurchaseOrderItem, result) => {

  for (let obj of objPurchaseOrderItem.PurchaseOrderItem) {
    obj = escapeSqlValues(obj);
    let val = new PurchaseOrderItem(obj);
    val.POId = objPurchaseOrderItem.POId;
    var sql = ``;
    if (val.POItemId && val.POItemId != null) {
      sql = `UPDATE tbl_po_item SET 
      PartId= ?, PartNo= ?, Description= ?, LeadTime= ?,WarrantyPeriod=?, Quantity= ?, PurchaseUnit= ?, Rate= ?
    , Price= ?, Modified= ?, ModifiedBy= ?, Status=?,ItemTaxPercent=?,ItemLocalCurrencyCode=?,ItemExchangeRate=?,ItemBaseCurrencyCode=?,BasePrice=?,Tax=?,BaseRate=?,BaseTax=?,ShippingCharge=?,BaseShippingCharge=?
    WHERE POItemId= ?`;

      var values = [
        val.PartId, val.PartNo, val.Description, val.LeadTime, val.WarrantyPeriod, val.Quantity
        , val.PurchaseUnit, val.Rate, val.Price, val.Modified
        , val.ModifiedBy, val.Status, val.ItemTaxPercent, val.ItemLocalCurrencyCode, val.ItemExchangeRate, val.ItemBaseCurrencyCode, val.BasePrice, val.Tax, val.BaseRate, val.BaseTax, val.ShippingCharge, val.BaseShippingCharge, val.POItemId
      ];
      // console.log(sql, values);
      con.query(sql, values, (err, res) => {
        if (err) {
          //console.log("error: ", err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ msg: "Purchase Order Item  not found" }, null);
          return;
        }
      });
    } else {
      var sql = `insert into tbl_po_item(POId,PartId,PartNo,Description,LeadTime,
      WarrantyPeriod,Quantity,PurchaseUnit,Rate,Price,Tax,Created,CreatedBy,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge) 
      values ('${val.POId}','${val.PartId}','${val.PartNo}','${val.Description}','${val.LeadTime}',
      '${val.WarrantyPeriod}','${val.Quantity}','${val.PurchaseUnit}','${val.Rate}','${val.Price}','${val.Tax}',
      '${cDateTime.getDateTime()}','${global.authuser.UserId}',
      '${val.ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${val.ItemExchangeRate}','${val.ItemBaseCurrencyCode}','${val.BasePrice}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}')`;
      //console.log("POInsert=" + sql)
      con.query(sql, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
      });
    }

  }
  result(null, { data: objPurchaseOrderItem.PurchaseOrderItem });
  return;
};

PurchaseOrderItem.UpdateSOItemIdByPOIdAndPartId = (list, result) => {

  for (let Val of list) {
    var sql = `UPDATE tbl_po_item SET SOId=${Val.SOId},SOItemId=${Val.SOItemId} WHERE PartId = ${Val.PartId} and POId = ${Val.POId}`;
    //console.log(sql)
    con.query(sql, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
    });
  }
  return result(null, list);
};

PurchaseOrderItem.View = (POId, result) => {
  var sql = `SELECT
(Select ifnull(SOItemId,0)  from tbl_sales_order_item where SOItemId=pi.SOItemId) SOItemId ,
(Select ifnull(SOId,0)  from tbl_sales_order where SOId=pi.SOId) SOId,
(Select SONo from tbl_sales_order where SOId=pi.SOId) SONo,
pi.*,rr.SerialNo,CUR.CurrencySymbol as ItemLocalCurrencySymbol,
ROUND(ifnull((pi.Quantity * pi.Tax),0),2) as TotalTax
FROM tbl_po_item pi
Left Join tbl_po po on po.POId=pi.POId
Left Join tbl_repair_request rr on rr.RRId=po.RRId and rr.PartId=pi.PartId
LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = pi.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
where pi.IsDeleted=0 And po.IsDeleted=0 and po.POId=${POId}`;
  return sql;
};

PurchaseOrderItem.GetPOItemList = (RRId, result) => {
  var sql = `SELECT pi.PartId, p.POId, p.RRId,pi.POItemId
FROM tbl_po p
Left Join tbl_po_item pi on p.POId=pi.POId
where pi.IsDeleted=0 and p.IsDeleted=0 and p.RRId>0 AND pi.SOItemId = 0  order by p.RRId  DESC `;
  //console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
}

PurchaseOrderItem.GetPODetailByRRId = (RRId, result) => {
  var sql = `SELECT *
FROM tbl_po p
Left Join tbl_po_item pi on p.POId=pi.POId
where p.IsDeleted=0 and p.RRId>0 and p.POId>0 and pi.POItemId>0 and pi.PartId>0 and p.RRId=${RRId} order By pi.PartId asc `;
  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
}



PurchaseOrderItem.GetPOItemByRRIdAndPartId = (RRId, PartId, SoObj, result) => {
  var sql = `SELECT *
FROM tbl_po p
Left Join tbl_po_item pi on p.POId=pi.POId
where pi.IsDeleted=0 and  p.IsDeleted=0 and p.RRId=${RRId} and pi.PartId=${PartId} `;
  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    res.SoObj = SoObj;
    return result(null, res);
  });
};
PurchaseOrderItem.ViewByMRO = (MROId, result) => {
  /* var sql = `SELECT 
   (Select SUM(pi.Quantity) from tbl_po p
   Left Join tbl_po_item pi on pi.POId=p.POId where p.IsDeleted=0 and pi.IsDeleted = 0 and p.POId=po.POId) as TotalQuantity,
 
   (Select ifnull(SUM(sh.Quantity),0)
   From tbl_mro_shipping_history sh
   where sh.IsDeleted=0 and sh.ShipToId=5 and sh.POId=po.POId) as Received,
 
   ((Select ifnull(SUM(pi.Quantity),0) from tbl_po p
   Left Join tbl_po_item pi on pi.POId=p.POId where p.IsDeleted=0 and pi.IsDeleted = 0 and p.POId=po.POId)-(Select ifnull(SUM(sh.Quantity),0)
   From tbl_mro_shipping_history sh
   where sh.IsDeleted=0 and sh.ShipToId=5 and sh.POId=po.POId)) as Pending,
 
   v.VendorName,v.VendorId,pi.*,po.PONo,rr.SerialNo
   FROM tbl_po_item pi
   Left Join tbl_po po Using(POId)
   Left Join tbl_repair_request rr on rr.RRId=po.RRId and rr.PartId=pi.PartId
   Left Join tbl_vendors v on v.VendorId=po.VendorId
   where pi.IsDeleted=0 And po.IsDeleted=0 and po.MROId=${MROId} `;*/

  var sql = `SELECT 
  pi.Quantity as TotalQuantity,

  (Select ifnull(SUM(sh.Quantity),0)
  From tbl_mro_shipping_history sh
  where sh.IsDeleted=0 and sh.ShipToId=5 and sh.POId=po.POId  AND sh.POItemId = pi.POItemId) as Received,

  (pi.Quantity-(Select ifnull(SUM(sh.Quantity),0)
  From tbl_mro_shipping_history sh
  where sh.IsDeleted=0 and sh.ShipToId=5 and sh.POId=po.POId  AND sh.POItemId = pi.POItemId)) as Pending,

  v.VendorName,v.VendorId,pi.*,po.PONo,rr.SerialNo,
  pi.ItemTaxPercent,pi.ItemLocalCurrencyCode,pi.ItemExchangeRate,pi.ItemBaseCurrencyCode,pi.BasePrice,pi.ShippingCharge,pi.BaseShippingCharge,
  po.LocalCurrencyCode,po.ExchangeRate,po.BaseCurrencyCode,po.BaseGrandTotal,CURL.CurrencySymbol as ItemLocalCurrencySymbol,pi.BaseRate,pi.BaseTax
  FROM tbl_po_item pi
  Left Join tbl_po po Using(POId)
  Left Join tbl_repair_request rr on rr.RRId=po.RRId and rr.PartId=pi.PartId
  Left Join tbl_vendors v on v.VendorId=po.VendorId
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = pi.ItemLocalCurrencyCode AND CURL.IsDeleted = 0
  where pi.IsDeleted=0 And po.IsDeleted=0 and po.MROId=${MROId} ORDER BY pi.PartId ASC `;

  return sql;
};


PurchaseOrderItem.IsEligibleForReceive = (POId, POItemId, SOId, MROId, result) => {
  var sql = `SELECT
(Select SUM(sii.Quantity) as TotalQuantity
From tbl_sales_order s
Left Join tbl_sales_order_item sii on sii.SOId=s.SOId
where s.IsDeleted=0 and s.SOId=${SOId}) as AllSOQuantity,
(Select ifnull(SUM(pi.Quantity),0)
from tbl_po p
Left Join tbl_po_item pi on pi.POId=p.POId
where p.IsDeleted=0  and p.POId=${POId} and pi.POItemId=${POItemId})-
(Select ifnull(SUM(sh.Quantity),0)
From tbl_mro_shipping_history sh
where sh.IsDeleted=0 and sh.ShipToId=5 and sh.POId=${POId} and sh.POItemId=${POItemId} ) as Pending,
(Select SUM(pi.Quantity) as OverAllTotalQuantity
from tbl_po p
Left Join tbl_po_item pi on pi.POId=p.POId
 where p.IsDeleted=0 and p.MROId=${MROId}) OverAllTotalQuantity,
(Select ifnull(SUM(Quantity),0) from tbl_mro_shipping_history where IsDeleted=0 and ShipToId=5 and MROId=${MROId}) OverAllReceived `;
  //console.log(sql)
  return sql;
};

PurchaseOrderItem.StatusCondition = (SOId, MROId, result) => {
  var sql = `SELECT
(Select SUM(sii.Quantity) as TotalQuantity
From tbl_sales_order s
Left Join tbl_sales_order_item sii on sii.SOId=s.SOId
where s.IsDeleted=0 and s.SOId=${SOId}) as AllSOQuantity,

(Select SUM(pi.Quantity) as OverAllTotalQuantity
from tbl_po p
Left Join tbl_po_item pi on pi.POId=p.POId
where p.IsDeleted=0 and p.MROId=${MROId}) AllPOQuantity,
(Select ifnull(SUM(sh.Quantity),0)
From tbl_mro_shipping_history sh
where sh.IsDeleted=0 and sh.ShipFromId=5 and sh.SOId=${SOId}) AllShipped,
(Select ifnull(SUM(Quantity),0) from tbl_mro_shipping_history where IsDeleted=0 and ShipToId=5 and MROId=${MROId}) AllReceived,
(Select Date_Format(Created,'%Y-%m-%d') Created from tbl_mro_shipping_history
where IsDeleted=0 and ShipToId=5 and MROId=${MROId} order by MROShippingHistoryId desc limit 0,1) ReceivedDate,
(Select Date_Format(Created,'%Y-%m-%d') Created from tbl_mro_shipping_history
where IsDeleted=0 and ShipFromId=5 and MROId=${MROId} order by MROShippingHistoryId desc limit 0,1) ShippedDate `;
  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

// To DeletePOItem
PurchaseOrderItem.DeletePOItem = (POItemId, result) => {
  let Obj = new PurchaseOrderItem({ POItemId: POItemId });
  var sql = `UPDATE tbl_po_item SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE POItemId=${Obj.POItemId}`;
  // console.log("sql=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: Obj.POItemId });
    return;

  });
}
//To SelectNewCalculationAfterPOItemDelete
PurchaseOrderItem.SelectNewCalculationAfterPOItemDelete = (POId, POItemId, result) => {

  var sql = `SELECT POId,SubTotal,GrandTotal,BaseGrandTotal from(
   SELECT Sum(pi.Price) as SubTotal,p.POId, Sum(pi.Price) as GrandTotal, Sum(pi.BasePrice) as BaseGrandTotal
   FROM tbl_po_item pi
   INNER JOIN tbl_po p on pi.POId=p.POId where pi.POId=${POId}
   and pi.IsDeleted<>1 Group By p.POId) as x `;
  //console.log("sql: " + sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { res });
  });
}

//Global Search
PurchaseOrderItem.findInColumns = (searchQuery, result) => {

  const { from, size, query } = searchQuery;

  let { IdentityType, MultipleAccessIdentityIds, IsRestrictedCustomerAccess, MultipleCustomerIds } = global.authuser;
  if (IdentityType == "1") {
    return result(null, []);
  }

  var sql = `SELECT 'ahoms-purchase-order-items' as _index,
  POI.POId as poid, PO.PONo as pono, POI.PartId as pid, POI.PartNo as pno
  FROM tbl_po_item as POI
  LEFT JOIN tbl_parts as P ON POI.PartId = P.PartId
  LEFT JOIN tbl_po as PO ON PO.POId = POI.POId
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = POI.SOId
  where
  (
    POI.Description like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.Description like '%${query.multi_match.query}%'
  ) and POI.IsDeleted=0 and PO.PONo <> ''
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND SO.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size}`;

  var countSql = `SELECT count(*) AS totalCount 
  FROM tbl_po_item as POI
  LEFT JOIN tbl_parts as P ON POI.PartId = P.PartId
  LEFT JOIN tbl_po as PO ON PO.POId = POI.POId
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = POI.SOId
  where
  (
    POI.Description like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.Description like '%${query.multi_match.query}%'
  ) and POI.IsDeleted=0 and PO.PONo <> ''
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND SO.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  `


  //console.log("" + sql)
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
        return result(null, { totalCount: { "_index": "ahoms-purchase-order", val: totalCount }, data: res });
      });
    } else {
      return result(null, []);
    }

  });
}











//Below are for MRO
PurchaseOrderItem.ViewByMROId = (POId, result) => {
  var sql = `SELECT pi.*,'' as SerialNo FROM tbl_po_item pi
  Left Join tbl_po po Using(POId)
  Left Join tbl_mro mro on mro.MROId=po.MROId
  where po.IsDeleted=0 and po.POId=${POId}`;
  return sql;
};
module.exports = PurchaseOrderItem;

/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");
const Constants = require("../config/constants.js");
const QuoteItem = require("./quote.item.model.js");

const SalesOrderItem = function (objSalesOrderItem) {
  this.SOItemId = objSalesOrderItem.SOItemId;
  this.SOId = objSalesOrderItem.SOId;

  this.PartId = objSalesOrderItem.PartId ? objSalesOrderItem.PartId : 0;
  this.POItemId = objSalesOrderItem.POItemId ? objSalesOrderItem.POItemId : 0;
  this.PartNo = objSalesOrderItem.PartNo ? objSalesOrderItem.PartNo : '';
  this.Description = objSalesOrderItem.Description ? objSalesOrderItem.Description : null;
  this.WarrantyPeriod = objSalesOrderItem.WarrantyPeriod ? objSalesOrderItem.WarrantyPeriod : 0;
  this.LeadTime = objSalesOrderItem.LeadTime ? objSalesOrderItem.LeadTime : '';
  this.Quantity = objSalesOrderItem.Quantity ? objSalesOrderItem.Quantity : 1;
  this.Rate = objSalesOrderItem.Rate ? objSalesOrderItem.Rate : 0;
  this.Discount = objSalesOrderItem.Discount ? objSalesOrderItem.Discount : 0;
  this.Tax = objSalesOrderItem.Tax ? objSalesOrderItem.Tax : 0;
  this.Price = objSalesOrderItem.Price ? objSalesOrderItem.Price : 0;
  this.DeliveryDate = objSalesOrderItem.DeliveryDate ? objSalesOrderItem.DeliveryDate : null;
  this.AllowShipment = objSalesOrderItem.AllowShipment ? objSalesOrderItem.AllowShipment : 0;
  this.Notes = objSalesOrderItem.Notes ? objSalesOrderItem.Notes : null;
  this.ItemStatus = objSalesOrderItem.ItemStatus ? objSalesOrderItem.ItemStatus : 0;
  this.PartItemId = objSalesOrderItem.PartItemId ? objSalesOrderItem.PartItemId : 0;
  this.QuoteItemId = objSalesOrderItem.QuoteItemId ? objSalesOrderItem.QuoteItemId : 0;
  this.IsExcludeFromBlanketPO = objSalesOrderItem.IsExcludeFromBlanketPO ? objSalesOrderItem.IsExcludeFromBlanketPO : 0;
  // 
  this.ItemTaxPercent = objSalesOrderItem.ItemTaxPercent ? objSalesOrderItem.ItemTaxPercent : 0;
  this.ItemLocalCurrencyCode = objSalesOrderItem.ItemLocalCurrencyCode ? objSalesOrderItem.ItemLocalCurrencyCode : '';
  this.ItemExchangeRate = objSalesOrderItem.ItemExchangeRate ? objSalesOrderItem.ItemExchangeRate : 0;
  this.ItemBaseCurrencyCode = objSalesOrderItem.ItemBaseCurrencyCode ? objSalesOrderItem.ItemBaseCurrencyCode : '';
  this.BasePrice = objSalesOrderItem.BasePrice ? objSalesOrderItem.BasePrice : 0;

  this.BaseRate = objSalesOrderItem.BaseRate ? objSalesOrderItem.BaseRate : 0;
  this.BaseTax = objSalesOrderItem.BaseTax ? objSalesOrderItem.BaseTax : 0;

  this.ShippingCharge = objSalesOrderItem.ShippingCharge ? objSalesOrderItem.ShippingCharge : 0;
  this.BaseShippingCharge = objSalesOrderItem.BaseShippingCharge ? objSalesOrderItem.BaseShippingCharge : 0;
  this.EcommerceOrderItemId = objSalesOrderItem.EcommerceOrderItemId ? objSalesOrderItem.EcommerceOrderItemId : 0;
  this.Created = objSalesOrderItem.Created ? objSalesOrderItem.Created : cDateTime.getDateTime();
  this.Modified = objSalesOrderItem.Modified ? objSalesOrderItem.Modified : cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objSalesOrderItem.authuser && objSalesOrderItem.authuser.UserId) ? objSalesOrderItem.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objSalesOrderItem.authuser && objSalesOrderItem.authuser.UserId) ? objSalesOrderItem.authuser.UserId : TokenUserId;
  this.IsDeleted = objSalesOrderItem.IsDeleted ? objSalesOrderItem.IsDeleted : 0;
};

SalesOrderItem.Create = (SOId, SalesOrderItemList, result) => {
  var sql = `insert into tbl_sales_order_item(SOId,PartId,PartNo,PartItemId,QuoteItemId,Description,WarrantyPeriod,LeadTime,Quantity,Rate,Discount,Tax,Price,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,IsExcludeFromBlanketPO,DeliveryDate,AllowShipment,Notes,ItemStatus,Created,CreatedBy,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge,EcommerceOrderItemId) values `;
  for (let val of SalesOrderItemList) {
    var DeliveryDate;
    val = escapeSqlValues(val);
    const saleItem = new SalesOrderItem(val);
    saleItem.Created = cDateTime.getDateTime();;
    if (saleItem.DeliveryDate == null) {
      DeliveryDate = '1000-01-01';
    } else {
      DeliveryDate = saleItem.DeliveryDate;
    }

    saleItem.BaseRate = saleItem.Rate * saleItem.ItemExchangeRate;
    sql += `('${SOId}','${saleItem.PartId}','${saleItem.PartNo}','${saleItem.PartItemId}','${saleItem.QuoteItemId}',
    '${saleItem.Description}','${saleItem.WarrantyPeriod}','${saleItem.LeadTime}','${saleItem.Quantity}',
    '${saleItem.Rate}','${saleItem.Discount}','${saleItem.Tax}','${saleItem.Price}','${saleItem.ItemTaxPercent}',
    '${saleItem.ItemLocalCurrencyCode}','${saleItem.ItemExchangeRate}','${saleItem.ItemBaseCurrencyCode}',
    '${saleItem.BasePrice}','${saleItem.IsExcludeFromBlanketPO}','${DeliveryDate}','${saleItem.AllowShipment}',
    '${saleItem.Notes}','${saleItem.ItemStatus}','${saleItem.Created}','${saleItem.CreatedBy}','${saleItem.BaseRate}','${saleItem.BaseTax}','${saleItem.ShippingCharge}','${saleItem.BaseShippingCharge}', '${saleItem.EcommerceOrderItemId}'),`;
  }
  var Query = sql.slice(0, -1);
  //console.log("SO item query =" + Query);
  con.query(Query, (err, res) => {
    if (err) {
      console.log("err = " + err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;

  });

}


SalesOrderItem.UpdateSOPOItemId = (POItemList, result) => {

  for (let obj of POItemList) {
    let val = new SalesOrderItem(obj);
    var sql = `Update tbl_sales_order_item SET POItemId = ${val.POItemId} WHERE IsDeleted=0 and SOItemId='${val.SOItemId}'`;
    //  console.log("sql =" + sql);
    con.query(sql, (err, res) => {
      if (err) { return result(err, null); }
    });
  }
  return result(null, POItemList);
}

SalesOrderItem.UpdateSalesOrderItem = (SaleOrder, result) => {

  for (let obj of SaleOrder.SalesOrderItem) {
    // console.log("inside model 1");
    // console.log(obj);
    var objs = escapeSqlValues(obj);
    // console.log("inside model 2");
    // console.log(objs);
    let val = new SalesOrderItem(objs);
    // console.log("inside model 3");
    // console.log(val);
    var DeliveryDate;
    if (val.DeliveryDate == null) {
      DeliveryDate = null;
    }
    else {
      DeliveryDate = '"' + val.DeliveryDate + '"';
    }
    var sql = ``;
    // If BaseRate 0
    if (val.BaseRate == 0) {
      val.BaseRate = val.Rate * val.ItemExchangeRate;
    }
    if (val.SOItemId) {
      sql = `UPDATE tbl_sales_order_item SET PartId = '${val.PartId}',
    PartNo = '${val.PartNo}',PartItemId = '${val.PartItemId}',Description ='${val.Description}', Quantity = '${val.Quantity}', 
    Rate = '${val.Rate}',Discount = '${val.Discount}', Tax = '${val.Tax}', Price = '${val.Price}',
    ItemTaxPercent = '${val.ItemTaxPercent}',ItemLocalCurrencyCode = '${val.ItemLocalCurrencyCode}',ItemExchangeRate = '${val.ItemExchangeRate}',ItemBaseCurrencyCode = '${val.ItemBaseCurrencyCode}',BasePrice = '${val.BasePrice}',
    IsExcludeFromBlanketPO= '${val.IsExcludeFromBlanketPO}',DeliveryDate = ${DeliveryDate}, 
    AllowShipment = '${val.AllowShipment}',Notes ='${val.Notes}',ItemStatus = '${val.ItemStatus}',
    WarrantyPeriod='${val.WarrantyPeriod}',LeadTime='${val.LeadTime}',Modified = '${val.Modified}', 
    ModifiedBy = '${val.ModifiedBy}',BaseRate = '${val.BaseRate}',BaseTax = '${val.BaseTax}',ShippingCharge = '${val.ShippingCharge}',BaseShippingCharge = '${val.BaseShippingCharge}' WHERE SOItemId = '${val.SOItemId}'`;

      // var values = [ 
      //   val.PartId,val.PartNo,val.Description,val.Quantity,val.Rate,val.Discount,val.Tax,val.Price,
      //   DeliveryDate,val.AllowShipment,val.Notes,
      //   val.ItemStatus,val.WarrantyPeriod,val.LeadTime,val.Modified,val.ModifiedBy,val.SOItemId
      // ];
      // console.log("SOI =" + sql);
      con.query(sql, (err, res) => {
        if (err) {
          console.log(err);
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ msg: "SO item not found" }, null);
          return;
        }
      });
    }
    else {
      var sql = `insert into tbl_sales_order_item(SOId,PartId,PartNo,PartItemId,Description,
        WarrantyPeriod,LeadTime,Quantity,Rate,Discount,Tax,Price,ItemTaxPercent,ItemLocalCurrencyCode,ItemExchangeRate,ItemBaseCurrencyCode,BasePrice,IsExcludeFromBlanketPO
        ,DeliveryDate,AllowShipment,Notes,ItemStatus,Created,CreatedBy,BaseRate,BaseTax,ShippingCharge,BaseShippingCharge)
        values ('${SaleOrder.SOId}','${val.PartId}','${val.PartNo}','${val.PartItemId}',
        '${val.Description}',${val.WarrantyPeriod},'${val.LeadTime}',
        '${val.Quantity}','${val.Rate}','${val.Discount}','${val.Tax}','${val.Price}',
        '${val.ItemTaxPercent}','${val.ItemLocalCurrencyCode}','${val.ItemExchangeRate}','${val.ItemBaseCurrencyCode}','${val.BasePrice}',
        '${val.IsExcludeFromBlanketPO}',${DeliveryDate},'${val.AllowShipment}','',
        '${val.ItemStatus}','${val.Created}','${val.CreatedBy}','${val.BaseRate}','${val.BaseTax}','${val.ShippingCharge}','${val.BaseShippingCharge}')`;
      // console.log(sql);
      con.query(sql, (err, res) => {
        if (err) {
          console.log(err);
          result(err, null);
          return;
        }
      });
    }
  }
  result(null, { data: SaleOrder.SalesOrderItem });
  return;
};

// 
SalesOrderItem.GetSOItemId = (InvoiceItemId, result) => {

  //   var sql = `Select  si.SOItemId,'g' as g,s.SOId
  // From tbl_sales_order_item si
  // Left Join tbl_sales_order s on s.SOId=si.SOId
  // WHERE si.IsDeleted=0  and s.RRId=0 and s.MROId=0 and si.SOId=(Select SOId From tbl_invoice_item where
  // InvoiceItemId=${InvoiceItemId}) and si.PartId=(Select PartId From tbl_invoice_item where
  // InvoiceItemId=${InvoiceItemId}) `;
  var sql = `Select  si.SOItemId,'g' as g,s.SOId
From tbl_sales_order_item si
Left Join tbl_sales_order s on s.SOId=si.SOId
WHERE si.IsDeleted=0 and s.MROId=0 and si.SOId=(Select SOId From tbl_invoice_item where
InvoiceItemId=${InvoiceItemId}) and si.PartId=(Select PartId From tbl_invoice_item where
InvoiceItemId=${InvoiceItemId}) `;
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

SalesOrderItem.view = (SOId) => {
  var sql = `Select 0 as POItemId,ifnull(rr.RRId,0) RRId,p.POId,PONo,si.SOItemId,SONo,so.SOId,si.PartId,rr.SerialNo,si.PartNo,si.PartItemId,si.Description,si.Quantity,ROUND(ifnull(si.Rate,0),2) as Rate,
si.Discount,ROUND(ifnull(si.Tax,0),2) as Tax,
ROUND(ifnull((si.Quantity * si.Tax),0),2) as TotalTax,
si.IsExcludeFromBlanketPO,
ROUND(ifnull(si.Price,0),2) as Price,DATE_FORMAT(DeliveryDate,'%Y-%m-%d') as DeliveryDate,AllowShipment,si.Notes,ItemStatus, si.WarrantyPeriod,si.LeadTime,so.BlanketPOExcludeAmount,
si.ItemTaxPercent,si.ItemLocalCurrencyCode,si.ItemExchangeRate,si.ItemBaseCurrencyCode,si.BasePrice,CUR.CurrencySymbol as ItemLocalCurrencySymbol,
so.LocalCurrencyCode,so.ExchangeRate,so.BaseCurrencyCode,so.BaseGrandTotal,CURB.CurrencySymbol as BaseCurrencySymbol,CURL.CurrencySymbol as LocalCurrencySymbol,
so.BlanketPONetAmount,so.CustomerBlanketPOId,QI.PartType,
ROUND(ifnull(QI.BaseRate,0),2) as BaseRate,ROUND(ifnull(QI.BaseTax,0),2) as BaseTax,ROUND(ifnull(si.BaseTax,0),2) as BaseTax,
ROUND(ifnull(si.BaseRate,0),2) as BaseRate,ROUND(ifnull(si.ShippingCharge,0),2) as ShippingCharge,ROUND(ifnull(si.BaseShippingCharge,0),2) as BaseShippingCharge,
 case QI.PartType
  WHEN 1 THEN '${Constants.array_part_type[1]}'
  WHEN 2 THEN '${Constants.array_part_type[2]}'
  WHEN 3 THEN '${Constants.array_part_type[3]}'
  WHEN 4 THEN '${Constants.array_part_type[4]}'
  WHEN 5 THEN '${Constants.array_part_type[5]}'
  ELSE '-'
  end PartTypeName, SL.LocationId, SL.LocationName
FROM tbl_sales_order so
Left Join tbl_sales_order_item si on so.SOId=si.SOId AND si.IsDeleted = 0 
Left Join tbl_po p on p.POId=so.POId  AND p.IsDeleted = 0 
Left Join tbl_repair_request rr on rr.RRId=so.RRId and rr.PartId=si.PartId
Left Join tbl_mro as MRO ON MRO.MROId = so.MROId and MRO.IsDeleted = 0
LEFT JOIN tbl_quotes as Q ON Q.MROId = MRO.MROId and Q.IsDeleted = 0
LEFT JOIN tbl_quotes_item as QI on QI.QuoteId = Q.QuoteId and QI.PartId = si.PartId AND QI.IsDeleted = 0 
LEFT JOIN tbl_ecommerce_order_item as EOI ON EOI.EcommerceOrderItemId = si.EcommerceOrderItemId and EOI.IsDeleted = 0
LEFT JOIN tbl_ecommerce_store_location as SL ON SL.LocationId = EOI.LocationId AND SL.IsDeleted = 0
LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = si.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = so.BaseCurrencyCode AND CURB.IsDeleted = 0
LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = so.LocalCurrencyCode AND CURL.IsDeleted = 0
WHERE  si.IsDeleted=0 and so.IsDeleted = 0  and so.SOId='${SOId}'`;

  //console.log("Over loop = = = = = " + sql);
  return sql;
}

SalesOrderItem.GetAllBySOId = (SOItemIdlist) => {
  var sql = `Select so.*,si.*
  from tbl_sales_order_item si
  Left Join tbl_sales_order so  Using(SOId)
  WHERE  si.IsDeleted=0 and si.SOItemId In(${SOItemIdlist})  and RRId=0  order by si.SOItemId asc`;
  //console.log("ALL SO ITEM = " + sql);
  return sql;
}

SalesOrderItem.ViewByMROIdAndSOId = (SOId, MROId) => {
  return `Select 

  (Select SUM(sii.Quantity) as TotalQuantity
  From tbl_sales_order s
  Left Join tbl_sales_order_item sii on sii.SOId=s.SOId AND sii.IsDeleted=0
  where s.IsDeleted=0 and s.SOId= so.SOId and sii.SOItemId=si.SOItemId) as TotalQuantity,

  (Select ifnull(SUM(sh.Quantity),0)
  From tbl_mro_shipping_history sh
  where sh.IsDeleted=0 and (sh.ShipFromId=5 AND sh.ShipToId!=5) and sh.SOId=so.SOId
  And sh.SOItemId=si.SOItemId) as  Shipped,

  (Select SUM(sii.Quantity) as TotalQuantity
  From tbl_sales_order s
  Left Join tbl_sales_order_item sii on sii.SOId=s.SOId AND sii.IsDeleted=0
  where s.IsDeleted=0  and s.SOId=so.SOId and sii.SOItemId=si.SOItemId) 
  -
  (
(Select ifnull(SUM( sh.Quantity),0) as Received
  From tbl_mro_shipping_history sh
  where sh.IsDeleted=0 and sh.ShipToId=5 and sh.SOId=so.SOId and sh.SOItemId=si.SOItemId) -
  (Select ifnull(SUM(sh.Quantity),0)
  From tbl_mro_shipping_history sh
  where sh.IsDeleted=0 and sh.ShipFromId=5 and sh.SOId= so.SOId And sh.SOItemId=si.SOItemId)
+
(Select ifnull(SUM(sh.Quantity),0)
  From tbl_mro_shipping_history sh
  where sh.IsDeleted=0 and sh.ShipFromId=5 and sh.SOId=so.SOId And sh.SOItemId=si.SOItemId
)
) as Pending, 

  (Select ifnull(SUM( sh.Quantity),0) as Received
  From tbl_mro_shipping_history sh
  where sh.IsDeleted=0 and sh.ShipToId=5 and sh.SOId=so.SOId and sh.SOItemId=si.SOItemId)-
  (Select ifnull(SUM(sh.Quantity),0)
  From tbl_mro_shipping_history sh
  where sh.IsDeleted=0 and (sh.ShipFromId=5 AND sh.ShipToId!=5) and sh.SOId= so.SOId And sh.SOItemId=si.SOItemId) as ReadyForShipment,

  (Select PartType from tbl_quotes_item qi Left Join tbl_quotes q Using(QuoteId) where qi.IsDeleted=0 and
  qi.PartId=si.PartId and si.QuoteItemId = qi.QuoteItemId and MROId='${MROId}') as PartType,

  (Select
  CASE When 1 Then '${Constants.array_part_type[1]}'
  When 2 Then '${Constants.array_part_type[2]}'
  When 3 Then '${Constants.array_part_type[3]}'
  When 4 Then '${Constants.array_part_type[4]}'
  When 5 Then '${Constants.array_part_type[5]}' Else '-' End
  from tbl_quotes_item qi
  Left Join tbl_quotes q Using(QuoteId)
  where qi.IsDeleted=0 and si.QuoteItemId = qi.QuoteItemId and qi.PartId=si.PartId and MROId='${MROId}') as  PartTypeName,

  rr.RRId,SOItemId,SONo,SOId,si.PartId,rr.SerialNo,si.PartNo,si.PartItemId,Description,si.Quantity,si.Rate,si.Discount,si.Tax,
  si.Price,DATE_FORMAT(DeliveryDate,'%Y-%m-%d') as DeliveryDate,AllowShipment,si.Notes,ItemStatus, si.WarrantyPeriod,si.LeadTime,
  si.ItemTaxPercent,si.ItemLocalCurrencyCode,si.ItemExchangeRate,si.ItemBaseCurrencyCode,si.BasePrice,
  so.LocalCurrencyCode,so.ExchangeRate,so.BaseCurrencyCode,so.BaseGrandTotal,CURL.CurrencySymbol as ItemLocalCurrencySymbol,si.BaseRate,si.BaseTax,si.ShippingCharge,si.BaseShippingCharge,
  SL.LocationId, SL.LocationName
  from tbl_sales_order_item si
  Left Join tbl_sales_order so  Using(SOId)
  Left Join tbl_repair_request rr on rr.RRId=so.RRId and rr.PartId=si.PartId
  LEFT JOIN tbl_ecommerce_order_item as EOI ON EOI.EcommerceOrderItemId = si.EcommerceOrderItemId and EOI.IsDeleted = 0
  LEFT JOIN tbl_ecommerce_store_location as SL ON SL.LocationId = EOI.LocationId AND SL.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = si.ItemLocalCurrencyCode AND CURL.IsDeleted = 0 
  WHERE  si.IsDeleted=0 and so.SOId='${SOId}' ORDER BY si.PartId ASC`;
  //console.log("@@@@@@@@@@@@SQL@@@@@@@@@", sql);
  // return sql;
}
SalesOrderItem.viewByRRId = (RRId, SOId, result) => {
  var sql = `Select soi.SOItemId,soi.PartId,soi.SOId,soi.PartNo,soi.PartItemId,soi.Description,soi.Quantity,soi.Rate,soi.Discount,soi.Tax,soi.Price,soi.DeliveryDate,soi.AllowShipment,soi.Notes,soi.ItemStatus, soi.WarrantyPeriod,soi.LeadTime,soi.WarrantyPeriod,soi.IsExcludeFromBlanketPO,
  soi.ItemTaxPercent,soi.ItemLocalCurrencyCode,soi.ItemExchangeRate,soi.ItemBaseCurrencyCode,soi.BasePrice,soi.BaseRate,soi.BaseTax,
so.LocalCurrencyCode,so.ExchangeRate,so.BaseCurrencyCode,so.BaseGrandTotal,soi.ShippingCharge,soi.BaseShippingCharge
  from tbl_sales_order so 
  inner join tbl_sales_order_item soi on so.SOId=soi.SOId  
  WHERE so.IsDeleted=0 and soi.IsDeleted=0 and so.Status!=${Constants.CONST_SO_STATUS_CANCELLED}  and so.RRId=${RRId} `;
  if (SOId > 0)
    sql += ` and so.SOId=${SOId > 0 ? SOId : 0} `;
  return sql;
}

SalesOrderItem.GetSOItemList = (RRId, result) => {
  var sql = `SELECT *
FROM tbl_sales_order s
Left Join tbl_sales_order_item si on s.SOId=si.SOId AND si.IsDeleted=0
where s.IsDeleted=0 and s.RRId>0 order by s.SOId DESC limit 0,50 `;
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

SalesOrderItem.UpdatePOItemIdBySOIdAndPartId = (list, result) => {

  for (let Val of list) {
    var sql = `UPDATE tbl_sales_order_item SET POItemId=${Val.POItemId} WHERE PartId = ${Val.PartId} and SOId = ${Val.SOId}`;
    // console.log(sql)
    con.query(sql, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
    });
  }
  return result(null, list);
};

SalesOrderItem.GetSODetailByRRId = (RRId, result) => {
  var sql = `SELECT *
FROM tbl_sales_order s
Left Join tbl_sales_order_item si on s.SOId=si.SOId and si.IsDeleted=0
where s.IsDeleted=0 and s.RRId>0 and s.SOId>0 and si.SOItemId>0 and si.PartId>0 and s.RRId=${RRId} order By si.PartId asc `;
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

SalesOrderItem.GetSOItemByRRIdAndPartId = (RRId, PartId, POOBJ, result) => {
  var sql = `SELECT  si.SOItemId, s.SOId, s.RRId
FROM tbl_sales_order s
Left Join tbl_sales_order_item si on s.SOId=si.SOId and si.IsDeleted=0
where si.IsDeleted = 0 AND s.IsDeleted=0 and s.RRId=${RRId} and si.PartId=${PartId} LIMIT 1 `;
  //console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    res.POOBJ = POOBJ;
    return result(null, res);
  });
};

SalesOrderItem.IsEligibleForShipping = (SOId, SOItemId, result) => {
  var sql = `Select
(Select SUM(sii.Quantity) as TotalQuantity
From tbl_sales_order s
Left Join tbl_sales_order_item sii on sii.SOId=s.SOId and sii.IsDeleted=0
where s.IsDeleted=0 and s.SOId=${SOId}) as OverAllTotalQuantity,

(Select ifnull(SUM(sh.Quantity),0)
From tbl_mro_shipping_history sh
where sh.IsDeleted=0 and (sh.ShipFromId=5 and sh.ShipToId!=5) and sh.SOId=${SOId}) OverAllShipped,

(Select ifnull(SUM( sh.Quantity),0) as Received
From tbl_mro_shipping_history sh
where sh.IsDeleted=0 and sh.ShipToId=5 and sh.SOId=${SOId} and sh.SOItemId=${SOItemId}) -
(Select ifnull(SUM(sh.Quantity),0)
From tbl_mro_shipping_history sh
where sh.IsDeleted=0 and (sh.ShipFromId=5 and sh.ShipToId!=5) and sh.SOId=${SOId} And sh.SOItemId=${SOItemId}) as ReadyForShipment `;
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
SalesOrderItem.DeleteSOItem = (SOItemId, result) => {
  let Obj = new SalesOrderItem({ SOItemId: SOItemId });
  var sql = `UPDATE tbl_sales_order_item SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE SOItemId=${Obj.SOItemId}`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: Obj.SOItemId });
    return;

  });
}

SalesOrderItem.SelectNewCalculationAfterSOItemDelete = (SOId, SOItemId, result) => {

  var sql = `SELECT SOId,GrandTotal,SubTotal,BaseGrandTotal,
SubTotal-IFNULL((Select SUM(Price) From tbl_sales_order_item where IsDeleted=0 and IsExcludeFromBlanketPO=1 and SOId=${SOId}),0)
as BlanketPONetAmount,
IFNULL((Select SUM(Price) From tbl_sales_order_item where IsDeleted=0 and IsExcludeFromBlanketPO=1 and SOId=${SOId}),0) as BlanketPOExcludeAmount
 from(
  SELECT Sum(si.Price) as SubTotal,Sum(si.Price) as GrandTotal,Sum(si.BasePrice) as BaseGrandTotal,s.SOId
  FROM tbl_sales_order_item si
  INNER JOIN tbl_sales_order s on si.SOId=s.SOId where si.SOId=${SOId}   
  and si.IsDeleted<>1 Group By s.SOId) as x; `;
  // console.log("sql: " + sql);
  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      return result(err, null);
    }
    return result(null, { res });
  });
}

//Global Search
SalesOrderItem.findInColumns = (searchQuery, result) => {

  const { from, size, query } = searchQuery;
  let { IdentityType, MultipleAccessIdentityIds, IsRestrictedCustomerAccess, MultipleCustomerIds } = global.authuser;
  var sql = `SELECT 'ahoms-sales-order-items' as _index,
  SOI.SOId as soid, SO.SONo as sono, SOI.PartId as pid, SOI.PartNo as pno
  FROM tbl_sales_order_item as SOI
  LEFT JOIN tbl_parts as P ON SOI.PartId = P.PartId
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = SOI.SOId and SO.IsDeleted=0
  where
  (
    SOI.SOId like '%${query.multi_match.query}%' or
    SOI.PartNo like '%${query.multi_match.query}%' or
    SOI.Description like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.Description like '%${query.multi_match.query}%'
  ) and SOI.IsDeleted=0 and SO.SONo IS NOT NULL
${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND SO.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size}`;

  var countSql = `SELECT count(*) AS totalCount 
  FROM tbl_sales_order_item as SOI
  LEFT JOIN tbl_parts as P ON SOI.PartId = P.PartId
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = SOI.SOId and SO.IsDeleted=0
  where
  (
    SOI.SOId like '%${query.multi_match.query}%' or
    SOI.PartNo like '%${query.multi_match.query}%' or
    SOI.Description like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.PartNo like '%${query.multi_match.query}%' or
    P.Description like '%${query.multi_match.query}%'
  ) and SOI.IsDeleted=0  and SO.SONo IS NOT NULL
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND SO.CustomerId IN (${MultipleCustomerIds}) ` : ""}
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
        return result(null, { totalCount: { "_index": "ahoms-sales-order", val: totalCount }, data: res });
      });
    } else {
      return result(null, []);
    }

  });
}










// Below are for MRO
SalesOrderItem.viewByMROId = (MROId, PartId) => {
  return `Select soi.SOItemId,soi.PartId,soi.SOId,soi.PartNo,soi.PartItemId,soi.Description,soi.Quantity,soi.Rate,soi.Discount,soi.Tax,soi.Price,soi.DeliveryDate,soi.AllowShipment,soi.Notes,soi.ItemStatus, soi.WarrantyPeriod,soi.LeadTime,soi.WarrantyPeriod,
  soi.ItemTaxPercent,soi.ItemLocalCurrencyCode,soi.ItemExchangeRate,soi.ItemBaseCurrencyCode,soi.BasePrice,soi.BaseRate,soi.BaseTax,
so.LocalCurrencyCode,so.ExchangeRate,so.BaseCurrencyCode,so.BaseGrandTotal,soi.ShippingCharge,soi.BaseShippingCharge
  from tbl_sales_order so 
  inner join tbl_sales_order_item soi on so.SOId=soi.SOId  
  WHERE so.IsDeleted=0 and soi.IsDeleted=0 and so.MROId=${MROId} and  soi.PartId=${PartId}`;
}

SalesOrderItem.viewBySOItemId = (SOItemId) => {
  return `Select soi.SOItemId,soi.PartId,soi.SOId,soi.PartNo,soi.PartItemId,soi.Description,soi.Quantity,soi.Rate,soi.Discount,soi.Tax,soi.Price,soi.DeliveryDate,soi.AllowShipment,soi.Notes,soi.ItemStatus, soi.WarrantyPeriod,soi.LeadTime,soi.WarrantyPeriod,
  soi.ItemTaxPercent,soi.ItemLocalCurrencyCode,soi.ItemExchangeRate,soi.ItemBaseCurrencyCode,soi.BasePrice,soi.BaseRate,soi.BaseTax,
so.LocalCurrencyCode,so.ExchangeRate,so.BaseCurrencyCode,so.BaseGrandTotal,soi.ShippingCharge,soi.BaseShippingCharge
  from tbl_sales_order_item soi    
  inner join tbl_sales_order so on so.SOId=soi.SOId  
  WHERE so.IsDeleted=0 and soi.IsDeleted=0 and  soi.SOItemId=${SOItemId}`;

}


// AAB

SalesOrderItem.removeFromExclude = (val, result) => {
  var sql = `UPDATE tbl_sales_order_item SET IsExcludeFromBlanketPO = 0  WHERE IsDeleted = 0 AND SOItemId = ${val.SOItemId};`;
  var sql_in = `UPDATE tbl_invoice_item SET IsExcludeFromBlanketPO = 0  WHERE IsDeleted = 0 AND SOItemId = ${val.SOItemId};`;
  // console.log(sql);
  con.query(sql, (err1, res1) => {
    con.query(sql_in, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      //console.log(res);
      return result(null, res);
    });
  });
  // result(null, null);
};

SalesOrderItem.addToExclude = (val, result) => {
  var sql = `UPDATE tbl_sales_order_item SET IsExcludeFromBlanketPO = 1  WHERE IsDeleted = 0 AND SOItemId = ${val.SOItemId};`;
  var sql_in = `UPDATE tbl_invoice_item SET IsExcludeFromBlanketPO = 1  WHERE IsDeleted = 0 AND SOItemId = ${val.SOItemId};`;
  // console.log(sql);
  con.query(sql, (err1, res1) => {
    con.query(sql_in, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      // console.log(res);
      return result(null, res);
    });
  });
  // result(null, null);
};

SalesOrderItem.GetSOItemBySOId = (SOId, result) => {

  var sql = `Select * From tbl_sales_order_item si WHERE si.IsDeleted=0 and si.SOId= ${SOId}`;
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


SalesOrderItem.updateQuoteItemId = (QuoteId, SOId, result) => {
  SalesOrderItem.GetSOItemBySOId(SOId, (SOErr, SOData) => {
    QuoteItem.GetQuoteItemByQuoteId(QuoteId, (QuoteErr, QuoteData) => {
     // console.log("SOData");
     // console.log(SOData);
     // console.log("QuoteData");
     // console.log(QuoteData);
      QuoteData.forEach(QuoteElement => {
        SOData.forEach(SoElement => {
          var sql = `UPDATE tbl_sales_order_item SET QuoteItemId = ${QuoteElement.QuoteItemId}  WHERE IsDeleted = 0 AND SOItemId = ${SoElement.SOItemId};`;
          con.query(sql, (err, res) => {

          });
        })
      })
    })
  })
  result(null, QuoteId);
}




module.exports = SalesOrderItem;
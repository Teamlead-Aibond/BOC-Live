/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
var async = require('async');
// const { request } = require("../app.js");
const { escapeSqlValues } = require("../helper/common.function.js");

const EcommerceOrderItem = function (objParts) {
    this.EcommerceOrderId = objParts.EcommerceOrderId;
    this.EcommerceBasketId = objParts.EcommerceBasketId;
    this.PartId = objParts.PartId ? objParts.PartId : 0;
    this.ShopPartItemId = objParts.ShopPartItemId ? objParts.ShopPartItemId : 0;
    this.LocationId = objParts.LocationId ? objParts.LocationId : 0;
    this.PartNo = objParts.PartNo ? objParts.PartNo : '';
    this.Quantity = objParts.Quantity ? objParts.Quantity : 0;
    this.Rate = objParts.Rate ? objParts.Rate : 0;
    this.BaseRate = objParts.BaseRate ? objParts.BaseRate : 0;
    this.Tax = objParts.Tax ? objParts.Tax : 0;
    this.BaseTax = objParts.BaseTax ? objParts.BaseTax : 0;
    this.ItemTaxPercent = objParts.ItemTaxPercent ? objParts.ItemTaxPercent : 0;
    this.ShippingCharge = objParts.ShippingCharge ? objParts.ShippingCharge : 0;

    this.BaseShippingCharge = objParts.BaseShippingCharge ? objParts.BaseShippingCharge : 0;
    this.ItemExchangeRate = objParts.ItemExchangeRate ? objParts.ItemExchangeRate : 0;
    this.ItemLocalCurrencyCode = objParts.ItemLocalCurrencyCode ? objParts.ItemLocalCurrencyCode : '';
    this.ItemBaseCurrencyCode = objParts.ItemBaseCurrencyCode ? objParts.ItemBaseCurrencyCode : '';
    this.Price = objParts.Price ? objParts.Price : 0;
    this.BasePrice = objParts.BasePrice ? objParts.BasePrice : 0;

    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (objParts.authuser && objParts.authuser.UserId) ? objParts.authuser.UserId : TokenUserId;
    this.ModifiedBy = (objParts.authuser && objParts.authuser.UserId) ? objParts.authuser.UserId : TokenUserId;

    // For Server Side Search 
    this.start = objParts.start;
    this.length = objParts.length;
    this.search = objParts.search;
    this.draw = objParts.draw;
};



EcommerceOrderItem.CreateOrderItem = (EcommerceOrderId, Basket, result) => {
    var sql = `insert into tbl_ecommerce_order_item(EcommerceOrderId,PartId,PartNo,Quantity,Rate,BaseRate,Tax,
        BaseTax,ItemTaxPercent,ShippingCharge,BaseShippingCharge,ItemExchangeRate,ItemLocalCurrencyCode,ItemBaseCurrencyCode,Price,BasePrice,Created,CreatedBy,ShopPartItemId,LocationId)
        values`;
    for (let val of Basket) {
        val = escapeSqlValues(val);
        val = new EcommerceOrderItem(val);

        sql = sql + `('${EcommerceOrderId}','${val.PartId}','${val.PartNo}','${val.Quantity}','${val.Rate}','${val.BaseRate}',
        '${val.Tax}','${val.BaseTax}','${val.ItemTaxPercent}','${val.ShippingCharge}','${val.BaseShippingCharge}',
        '${val.ItemExchangeRate}','${val.ItemLocalCurrencyCode}','${val.ItemBaseCurrencyCode}','${val.Price}','${val.BasePrice}','${val.Created}','${val.CreatedBy}', '${val.ShopPartItemId}', '${val.LocationId}'),`;
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


EcommerceOrderItem.ReduceQuantity = (Basket, result) => {
// console.log(Basket);
    // for (let val of Basket) {
    //     var Query = `UPDATE tbl_parts SET ShopCurrentQuantity = ShopCurrentQuantity - ${val.Quantity} WHERE PartId = ${val.PartId}`;
    //     con.query(Query, (err, res) => {

    //     });
    // }
    for (let val of Basket) {
        var Query = `UPDATE tbl_parts_item_shop SET ShopCurrentQuantity = ShopCurrentQuantity - ${val.Quantity} WHERE PartId = ${val.PartId} AND ShopPartItemId = ${val.ShopPartItemId}`;
        con.query(Query, (err, res) => {

        });
    }
    result(null, Basket);
};



EcommerceOrderItem.getCart = result => {
    con.query(`Select PartId, PartNo, Description,Price 
    from tbl_parts WHERE IsDeleted = 0 AND Status = 1 `, (err, res) => {

        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
}

EcommerceOrderItem.view = (EcommerceBasketId) => {
    var sql = `Select EBI.*,CURI.CurrencySymbol as ItemLocalCurrencySymbol from tbl_ecommerce_basket_item EBI
    LEFT JOIN tbl_users u1 ON u1.UserId = EBI.CreatedBy
    LEFT JOIN tbl_currencies CURI ON CURI.CurrencyCode = EBI.ItemLocalCurrencyCode AND CURI.IsDeleted = 0
    WHERE EBI.IsDeleted = 0 AND EBI.EcommerceBasketId='${EcommerceBasketId}'`;
    return sql;
}


EcommerceOrderItem.viewByOrderId = (EcommerceOrderId) => {
    // LEFT JOIN tbl_parts_images as PI ON PI.PartId = EOI.PartId AND PI.IsDeleted = 0
    var sql = `Select EOI.*,CURI.CurrencySymbol as ItemLocalCurrencySymbol, P.ShopTotalQuantity,P.ShopCurrentQuantity,P.APNNo,
    (SELECT ImagePath FROM tbl_parts_images WHERE PartId = P.PartId ORDER BY PartImageId ASC LIMIT 1) as image,
    (Select SUM(sii.Quantity) as TotalQuantity From tbl_sales_order_item sii 
    where sii.IsDeleted=0 and sii.SOId=SOI.SOId and sii.SOItemId=SOI.SOItemId) as TotalQuantity,

    (Select ifnull(SUM(sh.Quantity),0) From tbl_mro_shipping_history sh
    where sh.IsDeleted=0 and (sh.ShipFromId=5 AND sh.ShipToId!=5) and sh.SOId=SOI.SOId
    And sh.SOItemId=SOI.SOItemId) as  Shipped,

    (Select SUM(sii.Quantity) as TotalQuantity From tbl_sales_order_item sii
    where sii.IsDeleted=0 and sii.SOId=SOI.SOId and sii.SOItemId=SOI.SOItemId) 
    -
    ((Select ifnull(SUM( sh.Quantity),0) as Received From tbl_mro_shipping_history sh
    where sh.IsDeleted=0 and sh.ShipToId=5 and sh.SOId=SOI.SOId and sh.SOItemId=SOI.SOItemId) -
    (Select ifnull(SUM(sh.Quantity),0) From tbl_mro_shipping_history sh
    where sh.IsDeleted=0 and sh.ShipFromId=5 and sh.SOId= SOI.SOId And sh.SOItemId=SOI.SOItemId)
    +
    (Select ifnull(SUM(sh.Quantity),0) From tbl_mro_shipping_history sh
    where sh.IsDeleted=0 and sh.ShipFromId=5 and sh.SOId=SOI.SOId And sh.SOItemId=SOI.SOItemId
    )) as InProgress, 

    (Select ifnull(SUM( sh.Quantity),0) as Received From tbl_mro_shipping_history sh
    where sh.IsDeleted=0 and sh.ShipToId=5 and sh.SOId=SOI.SOId and sh.SOItemId=SOI.SOItemId)
    -
    (Select ifnull(SUM(sh.Quantity),0) From tbl_mro_shipping_history sh
    where sh.IsDeleted=0 and (sh.ShipFromId=5 AND sh.ShipToId!=5) and sh.SOId=SOI.SOId And sh.SOItemId=SOI.SOItemId) as ReadyForShipment

    from tbl_ecommerce_order_item EOI
    LEFT JOIN tbl_parts as P ON P.PartId = EOI.PartId AND P.IsDeleted = 0 
    LEFT JOIN tbl_sales_order_item as SOI ON SOI.EcommerceOrderItemId = EOI.EcommerceOrderItemId
    LEFT JOIN tbl_users u1 ON u1.UserId = EOI.CreatedBy
    LEFT JOIN tbl_currencies CURI ON CURI.CurrencyCode = EOI.ItemLocalCurrencyCode AND CURI.IsDeleted = 0
    WHERE EOI.IsDeleted = 0 AND EOI.EcommerceOrderId='${EcommerceOrderId}'`;
    return sql;
}


module.exports = EcommerceOrderItem;
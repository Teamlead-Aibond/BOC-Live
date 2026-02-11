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

const EcommerceBasketItem = function (objParts) {
  this.EcommerceBasketItemId = objParts.EcommerceBasketItemId;
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

EcommerceBasketItem.CreateOrUpdate = (Basket, result) => {
  //console.log(Basket);
  for (let obj of Basket.BasketItem) {
    // console.log("inside model 1");
    // console.log(obj);
    var EcommerceBasketItemId = obj.EcommerceBasketItemId ? obj.EcommerceBasketItemId : 0;
    var objs = escapeSqlValues(obj);
    // console.log("inside model 2");
    // console.log(objs);
    let val = new EcommerceBasketItem(objs);
    // console.log("inside model 2");
    // console.log(val);
    val.EcommerceBasketId = Basket.EcommerceBasketId;
    val.EcommerceBasketItemId = EcommerceBasketItemId;
    // val.SOItemId = Invoice.SOItemId;
    // console.log(val);
    // console.log("val.InvoiceItemId=" + val.InvoiceItemId)
    var sql = ``;
    EcommerceBasketItem.checkCustomerIdPartIdExists(Basket.EcommerceBasketId, val.PartId, val.ShopPartItemId, (err, data) => {
      if (data && data.length > 0) {
        // sql = `UPDATE tbl_ecommerce_basket_item SET EcommerceBasketId = ?, PartId=?, PartNo = ?,
        // Quantity = ?, Rate = ?, BaseRate = ?,Tax=?,BaseTax = ?, 
        // ItemTaxPercent = ?, ShippingCharge = ?,BaseShippingCharge = ?, ItemExchangeRate = ?,
        // ItemLocalCurrencyCode=?,ItemBaseCurrencyCode=?,Price=?,BasePrice=?,Modified = ?, ModifiedBy = ? WHERE EcommerceBasketItemId = ?`;
        // var values = [
        //   val.EcommerceBasketId, val.PartId, val.PartNo,
        //   val.Quantity, val.Rate, val.BaseRate,
        //   val.Tax, val.BaseTax, val.ItemTaxPercent, val.ShippingCharge, val.BaseShippingCharge, val.ItemExchangeRate,
        //   val.ItemLocalCurrencyCode, val.ItemBaseCurrencyCode, val.Price, val.BasePrice,
        //   val.Modified, val.ModifiedBy, val.EcommerceBasketItemId
        // ];
        //  console.log("InvoiceItem =" + values);
        var price = parseFloat(val.Price).toFixed(2);
        var BasePrice = parseFloat(val.BasePrice).toFixed(2);
        sql = `UPDATE tbl_ecommerce_basket_item SET Tax = Tax + (${val.Tax}), BaseTax = BaseTax + (${val.BaseTax}), ItemTaxPercent = '${val.ItemTaxPercent}', Quantity = Quantity + (${val.Quantity}), Price = Price + (${val.Price}), BasePrice = BasePrice + (${val.BasePrice}), Modified= '${val.Modified}',ModifiedBy='${val.ModifiedBy}' WHERE 
        EcommerceBasketId='${val.EcommerceBasketId}' AND PartId='${val.PartId}' AND IsDeleted = 0`;
       // console.log(sql)
        con.query(sql, (err, res) => {
          if (err) {
            //  console.log("error: ", err);
            result(err, null);
            return;
          }
          if (res.affectedRows == 0) {
            result({ msg: "Basket item not found" }, null);
            return;
          }
        });
      }
      else {
        var sql = `insert into tbl_ecommerce_basket_item(EcommerceBasketId,PartId,PartNo,Quantity,Rate,BaseRate,Tax,
          BaseTax,ItemTaxPercent,ShippingCharge,BaseShippingCharge,ItemExchangeRate,ItemLocalCurrencyCode,ItemBaseCurrencyCode,Price,BasePrice,Created,CreatedBy,ShopPartItemId,LocationId)
          values ('${val.EcommerceBasketId}','${val.PartId}','${val.PartNo}','${val.Quantity}','${val.Rate}','${val.BaseRate}',
          '${val.Tax}','${val.BaseTax}','${val.ItemTaxPercent}','${val.ShippingCharge}','${val.BaseShippingCharge}',
          '${val.ItemExchangeRate}','${val.ItemLocalCurrencyCode}','${val.ItemBaseCurrencyCode}','${val.Price}','${val.BasePrice}','${val.Created}','${val.CreatedBy}', '${val.ShopPartItemId}', '${val.LocationId}')`;
        // console.log("=" + sql);
        con.query(sql, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
        });
      }
    })
  }
  result(null, { data: Basket.BasketItem });
  return;
}

EcommerceBasketItem.checkCustomerIdPartIdExists = (EcommerceBasketId, PartId, ShopPartItemId, result) => {
  var Query = `SELECT EcommerceBasketItemId FROM tbl_ecommerce_basket_item WHERE IsDeleted=0 AND EcommerceBasketId='${EcommerceBasketId}' AND PartId='${PartId}' AND ShopPartItemId='${ShopPartItemId}'`;
  con.query(Query, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}

// EcommerceBasketItem.viewByBasket = (EcommerceBasketId, PartId, result) => {
//   var Query = `SELECT * FROM tbl_ecommerce_basket_item WHERE IsDeleted=0 AND EcommerceBasketId='${EcommerceBasketId}'`;
//   con.query(Query, (err, res) => {
//     if (err)
//       return result(err, null);
//     return result(null, res);
//   });
// }

EcommerceBasketItem.viewByBasket = (EcommerceBasketId) => {
  // var Query = `SELECT EBI.*,P.Description,P.Description as PartDescription, '2' as PartType FROM tbl_ecommerce_basket_item EBI
  // LEFT JOIN tbl_parts as P ON P.PartId = EBI.PartId AND P.IsDeleted = 0 
  // WHERE EBI.IsDeleted=0 AND EBI.EcommerceBasketId='${EcommerceBasketId}'`;
  // return Query;
  var Query = `SELECT EBI.*,
  IF(PP.PartItemType IS NULL or PP.PartItemType = '0', '2', PP.PartItemType) as PartType,
  IF(PP.PartItemDescription IS NULL or PP.PartItemDescription = '', P.Description, PP.PartItemDescription) as Description,
  IF(PP.PartItemDescription IS NULL or PP.PartItemDescription = '', P.Description, PP.PartItemDescription) as PartDescription
  FROM tbl_ecommerce_basket_item EBI
  LEFT JOIN tbl_parts as P ON P.PartId = EBI.PartId AND P.IsDeleted = 0 
  LEFT JOIN tbl_parts_item_shop as PP ON PP.PartId = EBI.PartId AND PP.ShopPartItemId = EBI.ShopPartItemId AND PP.IsDeleted = 0 
  WHERE EBI.IsDeleted=0 AND EBI.EcommerceBasketId='${EcommerceBasketId}'`;
  return Query;
  // con.query(Query, (err, res) => {
  //   if (err
  //     return result(err, null);
  //   return result(null, res);
  // });
}
EcommerceBasketItem.checkQuantityAvailableInParts = (EcommerceBasketId, result) => {
  var Query = `SELECT EBI.*,
  IF(PP.PartItemType IS NULL or PP.PartItemType = '0', '2', PP.PartItemType) as PartType,
  IF(PP.PartItemDescription IS NULL or PP.PartItemDescription = '', P.Description, PP.PartItemDescription) as Description,
  IF(PP.PartItemDescription IS NULL or PP.PartItemDescription = '', P.Description, PP.PartItemDescription) as PartDescription,
  PP.ShopCurrentQuantity as AvailableQuantity, P.PartNo
  FROM tbl_ecommerce_basket_item EBI
  LEFT JOIN tbl_parts as P ON P.PartId = EBI.PartId AND P.IsDeleted = 0 
  LEFT JOIN tbl_parts_item_shop as PP ON PP.PartId = EBI.PartId AND PP.ShopPartItemId = EBI.ShopPartItemId AND PP.IsDeleted = 0 
  WHERE EBI.IsDeleted=0 AND EBI.EcommerceBasketId='${EcommerceBasketId}'`;
  con.query(Query, (err, res) => {
    if (err){
      return result(err, null);
    }else{
      var i = 0;
      var status = true;
      var data = [];
      res.forEach(element => {
        if(element.AvailableQuantity >= element.Quantity){
          i++;
          status = true;
        }else{
          i++;
          data.push(element.PartNo);
          status = false;
        }
        if(i == res.length){
          return result(null, data);
        }
      })
    }
  });
}


EcommerceBasketItem.removeFromCart = (Obj, result) => {
  var sql = `SELECT * FROM tbl_ecommerce_basket_item WHERE EcommerceBasketItemId='${Obj.EcommerceBasketItemId}' AND IsDeleted = 0`;
 // console.log(sql);
  con.query(sql, (err, res) => {
    //console.log(res);
    if (err) {
      return result(err, null);
    } else {
      var Price = parseFloat(res[0].Price).toFixed(2);
      var BasePrice = parseFloat(res[0].BasePrice).toFixed(2);
      var Query = `Update tbl_ecommerce_basket_item set IsDeleted=1, ModifiedBy='${Obj.ModifiedBy}',Modified='${Obj.Modified}'  
  WHERE EcommerceBasketItemId='${Obj.EcommerceBasketItemId}' AND IsDeleted = 0`;
      var Query1 = `Update tbl_ecommerce_basket set GrandTotal = GrandTotal - (${Price}), BaseGrandTotal = BaseGrandTotal - (${BasePrice})
  WHERE EcommerceBasketId='${Obj.EcommerceBasketId}' AND IsDeleted = 0`;
      async.parallel([
        function (result) { con.query(Query, result) },
        function (result) { con.query(Query1, result) },
      ],
        function (err, results) {
          if (err) {
            return result(err, null);
          }
          // console.log(results[0])
          if (results[0].length > 0) {
            result(null, { msg: "Successfully removed!" });
            return;
          } else {
            return result({ msg: "Cart not found" }, null);
          }
        });
    }
  });
}
EcommerceBasketItem.increaseCartCount = (Obj, result) => {
  var Quantity = Obj.Quantity;
  //console.log(Obj);
  var VatTaxPercentage = Obj.ItemTaxPercent;
  var TotalTax = ((parseFloat(Obj.Rate) * parseFloat(VatTaxPercentage)) / 100);
  var BaseTotalTax = ((parseFloat(Obj.BaseRate) * parseFloat(VatTaxPercentage)) / 100);
  //console.log(parseFloat(Obj.Rate) * VatTaxPercentage);
  //console.log(TotalTax +","+ BaseTotalTax);
  var Tax = (parseFloat(TotalTax) * Quantity).toFixed(2);
  var BaseTax = (parseFloat(BaseTotalTax) * Quantity).toFixed(2);

  var Price = (parseFloat(Obj.Rate) * Quantity).toFixed(2);
  var BasePrice = (parseFloat(Obj.BaseRate) * Quantity).toFixed(2);

  Price = (parseFloat(Price) + parseFloat(Tax)).toFixed(2);
  BasePrice = (parseFloat(BasePrice) + parseFloat(BaseTax)).toFixed(2);

  //console.log(Tax +","+ BaseTax);
 // console.log(Price +","+ BasePrice);

  var Query = `Update tbl_ecommerce_basket_item set Quantity='${Quantity}', Price='${Price}', BasePrice='${BasePrice}', ModifiedBy='${Obj.ModifiedBy}',Modified='${Obj.Modified}',Tax='${Tax}', BaseTax='${BaseTax}'   
  WHERE EcommerceBasketItemId='${Obj.EcommerceBasketItemId}' AND IsDeleted = 0`;
  con.query(Query, (err, res) => {
    if (err) {
      result(err, null);
    }
    if (res) {
      var Query1 = `SELECT SUM(Price) as GrandTotal, SUM(BasePrice) as BaseGrandTotal, SUM(Tax) as Tax, SUM(BaseTax) as BaseTax FROM tbl_ecommerce_basket_item WHERE EcommerceBasketId='${Obj.EcommerceBasketId}' AND IsDeleted=0`;
      con.query(Query1, (err1, res1) => {
        if (err1) {
          result(err1, null);
        }
        if (res1) {
          // console.log(res1);
          var GrandTotal = parseFloat(res1[0].GrandTotal).toFixed(2);
          var BaseGrandTotal = parseFloat(res1[0].BaseGrandTotal).toFixed(2);
          var Tax = res1[0].Tax.toFixed(2);
          var BaseTax = res1[0].BaseTax.toFixed(2);
          var Query2 = `Update tbl_ecommerce_basket set GrandTotal='${GrandTotal}', BaseGrandTotal='${BaseGrandTotal}', ModifiedBy='${Obj.ModifiedBy}',Modified='${Obj.Modified}' 
          WHERE EcommerceBasketId='${Obj.EcommerceBasketId}' AND IsDeleted = 0`;
          con.query(Query2, (err2, res2) => {
            if (err2) {
              result(err2, null);
            }
            if (res2) {
              result(null, res2);
            }
          });
        }
      });
    }
  });
}



EcommerceBasketItem.getCart = result => {
  con.query(`Select PartId, PartNo, Description,Price 
    from tbl_parts WHERE IsDeleted = 0 AND Status = 1 `, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
}

EcommerceBasketItem.view = (EcommerceBasketId) => {
  //  LEFT JOIN tbl_parts_images as PI ON PI.PartId = EBI.PartId AND PI.IsDeleted = 0 
  var sql = `Select EBI.*,CURI.CurrencySymbol as ItemLocalCurrencySymbol, PP.ShopTotalQuantity,PP.ShopCurrentQuantity,PP.APNNo,
  PP.VendorId,
  ifnull((SELECT ImagePath FROM tbl_parts_images WHERE PartId = P.PartId AND ShopPartItemId = PP.ShopPartItemId ORDER BY PartImageId ASC LIMIT 1),
  (SELECT ImagePath FROM tbl_parts_images WHERE PartId = P.PartId AND ShopPartItemId = 0 ORDER BY PartImageId ASC LIMIT 1)) as image,
  IF(PP.PartItemDescription IS NULL or PP.PartItemDescription = '', P.Description, PP.PartItemDescription) as Description
  from tbl_ecommerce_basket_item EBI
    LEFT JOIN tbl_parts as P ON P.PartId = EBI.PartId AND P.IsDeleted = 0 
    LEFT JOIN tbl_parts_item_shop as PP ON PP.PartId = EBI.PartId AND PP.ShopPartItemId = EBI.ShopPartItemId AND PP.IsDeleted = 0 
    LEFT JOIN tbl_users u1 ON u1.UserId = EBI.CreatedBy
    LEFT JOIN tbl_currencies CURI ON CURI.CurrencyCode = EBI.ItemLocalCurrencyCode AND CURI.IsDeleted = 0
    WHERE EBI.IsDeleted = 0 AND EBI.EcommerceBasketId=${EcommerceBasketId}`;
  return sql;
}


module.exports = EcommerceBasketItem;
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
const EcommerceBasketItem = require("./ecommerce.basket.item.model.js");
const Address = require("../models/customeraddress.model.js");
const EcommerceBasket = function (objParts) {
  this.EcommerceBasketId = objParts.EcommerceBasketId;
  this.CustomerId = objParts.CustomerId;
  this.CustomerBillToId = objParts.CustomerBillToId ? objParts.CustomerBillToId : 0;
  this.CustomerShipToId = objParts.CustomerShipToId ? objParts.CustomerShipToId : 0;
  this.GrandTotal = objParts.GrandTotal ? objParts.GrandTotal : 0;
  this.LocalCurrencyCode = objParts.LocalCurrencyCode ? objParts.LocalCurrencyCode : '';
  this.ExchangeRate = objParts.ExchangeRate ? objParts.ExchangeRate : 0;
  this.BaseCurrencyCode = objParts.BaseCurrencyCode ? objParts.BaseCurrencyCode : '';
  this.BaseGrandTotal = objParts.BaseGrandTotal ? objParts.BaseGrandTotal : 0;
  this.OrderStatus = objParts.OrderStatus ? objParts.OrderStatus : 0;
  this.IsAddedByAdmin = objParts.IsAddedByAdmin ? objParts.IsAddedByAdmin : 1;
  // this.Tax = objParts.Tax ? objParts.Tax : 0;
  // this.BaseTax = objParts.BaseTax ? objParts.BaseTax : 0;
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

EcommerceBasket.CreateOrUpdate = (Basket, result) => {
  EcommerceBasket.checkCustomerIdExists(Basket.CustomerId, (err, data) => {
    var sql = '';
    var values = [];
    // console.log(data);
    if (data && data.length === 0) {
      var GrandTotal = parseFloat(Basket.GrandTotal).toFixed(2);
      var BaseGrandTotal = parseFloat(Basket.BaseGrandTotal).toFixed(2);
      sql = `insert into tbl_ecommerce_basket(CustomerId,CustomerBillToId,CustomerShipToId,GrandTotal,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal,OrderStatus,IsAddedByAdmin,Created,CreatedBy) values(?,?,?,?,?,?,?,?,?,?,?,?)`;
      values = [
        Basket.CustomerId, Basket.CustomerBillToId, Basket.CustomerShipToId, GrandTotal, Basket.LocalCurrencyCode, Basket.ExchangeRate, Basket.BaseCurrencyCode, BaseGrandTotal, Basket.OrderStatus, Basket.IsAddedByAdmin, Basket.Created, Basket.CreatedBy
      ];
      con.query(sql, values, (err, res) => {
        if (err) {
          // console.log("error: ", err);
          result(err, null);
          return;
        }
        result(null, { id: res.insertId, ...Basket });

        return;

      });
    } else {
      // sql = `UPDATE tbl_ecommerce_basket SET CustomerBillToId = ?,CustomerShipToId = ?,GrandTotal = ?,LocalCurrencyCode = ?, ExchangeRate = ?,BaseCurrencyCode = ?,BaseGrandTotal = ?, OrderStatus = ?,IsAddedByAdmin = ?,Modified=?,ModifiedBy=? WHERE CustomerId = ? `;
      // values = [
      //   Basket.CustomerBillToId, Basket.CustomerShipToId, Basket.GrandTotal,Basket.LocalCurrencyCode, Basket.ExchangeRate, Basket.BaseCurrencyCode,Basket.BaseGrandTotal, Basket.OrderStatus, Basket.IsAddedByAdmin,Basket.Modified, Basket.ModifiedBy,Basket.CustomerId
      // ];
      sql = `UPDATE tbl_ecommerce_basket SET GrandTotal = GrandTotal + (${Basket.GrandTotal}),BaseGrandTotal = BaseGrandTotal + (${Basket.BaseGrandTotal}),Modified= '${Basket.Modified}',ModifiedBy='${Basket.ModifiedBy}' WHERE CustomerId = '${Basket.CustomerId}' AND IsDeleted = 0`;
      con.query(sql, (err, res) => {
        if (err) {
          // console.log("error: ", err);
          result(err, null);
          return;
        }
        var sqlId = `SELECT EcommerceBasketId FROM tbl_ecommerce_basket WHERE IsDeleted = 0 AND CustomerId='${Basket.CustomerId}'`;
        con.query(sqlId, (err1, res1) => {
          Basket.id = res1[0].EcommerceBasketId;
          Basket.EcommerceBasketId = res1[0].EcommerceBasketId;
          result(null, { id: res1[0].EcommerceBasketId, ...Basket });
        });
        return;

      });
    }
    // console.log(sql, values);

  });
}
EcommerceBasket.checkCustomerIdExists = (CustomerId, result) => {
  var Query = `SELECT EcommerceBasketId FROM tbl_ecommerce_basket WHERE IsDeleted=0 AND CustomerId=${CustomerId}`;
  con.query(Query, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}




EcommerceBasket.getCart = (CustomerId, result) => {
  var sql = EcommerceBasket.view(CustomerId);
  con.query(sql, (err, res1) => {
    // console.log(res1)
    // console.log(err)
    if (err) {
      return result(err, null);
    }
    if (res1.length > 0) {
      var sqlItem = EcommerceBasketItem.view(res1[0].EcommerceBasketId);
      var sqlBillingAddress = Address.GetAddressByIdQuery(res1[0].CustomerBillToId);
      var sqlShippingAddress = Address.GetAddressByIdQuery(res1[0].CustomerShipToId);
      async.parallel([
        function (result) { con.query(sql, result) },
        function (result) { con.query(sqlItem, result) },
        function (result) { con.query(sqlBillingAddress, result) },
        function (result) { con.query(sqlShippingAddress, result) },
      ],
        function (err, results) {
         // console.log(results)
         // console.log(err)
          if (err) {
            return result(err, null);
          }

          // console.log(results[0][0].length)
          if (results[0][0].length > 0) {
            result(null, { BasketInfo: results[0][0], BasketItem: results[1][0], BillingAddress: results[2][0], ShippingAddress: results[3][0] });
            return;
          } else {
            return result({ msg: "Cart not found" }, null);
          }
        });
    } else {
      return result({ msg: "Cart not found" }, null);
    }
  })
}

EcommerceBasket.view = (CustomerId) => {
  var sql = `Select EB.*,c.CompanyName,CONCAT(u1.FirstName,' ',u1.LastName) as name,CUR.CurrencySymbol as CustomerCurrencySymbol,CURI.CurrencySymbol, 
  ROUND(((SELECT SUM(Tax) FROM tbl_ecommerce_basket_item WHERE EcommerceBasketId = EB.EcommerceBasketId AND IsDeleted = 0)), 2) as Tax,
  ROUND(((SELECT SUM(BaseTax) FROM tbl_ecommerce_basket_item WHERE EcommerceBasketId = EB.EcommerceBasketId AND IsDeleted = 0)), 2) as BaseTax
  from tbl_ecommerce_basket EB
  LEFT JOIN tbl_customers c on EB.CustomerId=c.CustomerId
  LEFT JOIN tbl_users u1 ON u1.UserId = EB.CreatedBy
  LEFT JOIN tbl_currencies CURI ON CURI.CurrencyCode = EB.LocalCurrencyCode AND CURI.IsDeleted = 0
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = c.CustomerCurrencyCode AND CUR.IsDeleted = 0
  WHERE EB.IsDeleted = 0 AND EB.CustomerId=${CustomerId}`;
  return sql;
}

EcommerceBasket.viewByEcommerceBasketId = (EcommerceBasketId) => {
  var sql = `Select EB.*,c.CompanyName,CONCAT(u1.FirstName,' ',u1.LastName) as name,CUR.CurrencySymbol as CustomerCurrencySymbol,CURI.CurrencySymbol,c.Email from tbl_ecommerce_basket EB
  LEFT JOIN tbl_customers c on EB.CustomerId=c.CustomerId
  LEFT JOIN tbl_users u1 ON u1.UserId = EB.CreatedBy
  LEFT JOIN tbl_currencies CURI ON CURI.CurrencyCode = EB.LocalCurrencyCode AND CURI.IsDeleted = 0
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = c.CustomerCurrencyCode AND CUR.IsDeleted = 0
  WHERE EB.IsDeleted = 0 AND EB.EcommerceBasketId=${EcommerceBasketId}`;
  return sql;
}

EcommerceBasket.viewbyId = (EcommerceBasketId) => {
  var sql = `Select B.*, C.CompanyName, C.FirstName, C.LastName,C.Email, C.TaxType,C.TermsId  from tbl_ecommerce_basket as B
  LEFT JOIN tbl_customers as C ON C.CustomerId = B.CustomerId
  WHERE B.IsDeleted = 0 AND B.EcommerceBasketId=${EcommerceBasketId}`;
  return sql;
}


EcommerceBasket.cartCount = (CustomerId, result) => {
  var Query = `SELECT COUNT(ebi.EcommerceBasketItemId) as count FROM tbl_ecommerce_basket eb
  Left Join tbl_ecommerce_basket_item ebi ON ebi.EcommerceBasketId = eb.EcommerceBasketId AND ebi.IsDeleted=0
  WHERE eb.IsDeleted = 0 AND  eb.CustomerId=${CustomerId} `;
  //console.log(Query)
  con.query(Query, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res[0]);
  });
}

EcommerceBasket.DeleteBasket = (EcommerceBasketId, result) => {
  var sql = `Update tbl_ecommerce_basket  SET IsDeleted=1 WHERE IsDeleted=0 and EcommerceBasketId='${EcommerceBasketId}'`;
  var sql1 = `Update tbl_ecommerce_basket_item  SET IsDeleted=1 WHERE IsDeleted=0 and EcommerceBasketId='${EcommerceBasketId}'`;
  // console.log(sql);
  async.parallel([
    function (result) { con.query(sql, result) },
    function (result) { con.query(sql1, result) },
  ], function (err, results) {
    if (err) {
      return result(err, null);
    }

    // console.log(results[0][0].length)
    result(null, { EcommerceBasketId: EcommerceBasketId });
    return;
  });
  // con.query(sql, (err, res) => {
  //   if (err) {
  //     result(err, null);
  //     return;
  //   }
  //   result(null, { EcommerceBasketId: EcommerceBasketId });
  //   return;
  // }
  // );
};


module.exports = EcommerceBasket;
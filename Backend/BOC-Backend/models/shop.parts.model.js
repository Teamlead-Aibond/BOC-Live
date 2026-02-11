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
const VendorModel = require("./vendor.model.js");
const RRImages = require("./repairrequestimages.model.js");
const PartImages = require("./parts.images.model.js");
const ShopPartItem = require("./shop.part.items.model");
const PartItemShopStockLog = require("./part.item.shop.stock.log.model.js");
const Parts = function (objParts) {
  this.PartId = objParts.PartId;
  this.PartNo = objParts.PartNo;
  this.APNNo = objParts.APNNo ? objParts.APNNo : '';
  this.SerialNo = objParts.SerialNo ? objParts.SerialNo : '';
  this.Description = objParts.Description ? objParts.Description : '';
  this.UnitType = objParts.UnitType ? objParts.UnitType : '1';
  this.InventoryType = objParts.InventoryType ? objParts.InventoryType : '1';
  this.ManufacturerId = objParts.ManufacturerId ? objParts.ManufacturerId : 0;
  this.ManufacturerPartNo = objParts.ManufacturerPartNo ? objParts.ManufacturerPartNo : '';
  this.IsNewOrRefurbished = objParts.IsNewOrRefurbished ? objParts.IsNewOrRefurbished : 0;
  this.Quantity = objParts.Quantity ? objParts.Quantity : 1;
  this.LocationName = objParts.LocationName ? objParts.LocationName : "";
  this.StoreSince = objParts.StoreSince ? objParts.StoreSince : cDateTime.getDateTime();
  this.Price = objParts.Price ? objParts.Price : 0;
  this.LastPricePaid = objParts.LastPricePaid ? objParts.LastPricePaid : 0;
  this.IsActive = objParts.IsActive ? objParts.IsActive : 1;
  this.SellingPrice = objParts.SellingPrice ? objParts.SellingPrice : 0;
  this.SellingPriceDescription = objParts.SellingPriceDescription ? objParts.SellingPriceDescription : "";
  this.BuyingPrice = objParts.BuyingPrice ? objParts.BuyingPrice : 0;
  this.OnHandQty = objParts.OnHandQty ? objParts.OnHandQty : 0;
  this.Avail = objParts.Avail ? objParts.Avail : 0;
  this.OpenPOQty = objParts.OpenPOQty ? objParts.OpenPOQty : 0;
  this.IsSerialNumber = objParts.IsSerialNumber ? objParts.IsSerialNumber : 0;
  this.DateAdded = objParts.DateAdded ? objParts.DateAdded : null;
  this.BuyingPriceDescription = objParts.BuyingPriceDescription ? objParts.BuyingPriceDescription : "";
  this.WarehouseId = objParts.WarehouseId ? objParts.WarehouseId : 0;
  this.OpeningStock = objParts.OpeningStock ? objParts.OpeningStock : 0;
  this.MinStock = objParts.MinStock ? objParts.MinStock : 0;
  this.MaxStock = objParts.MaxStock ? objParts.MaxStock : 0;
  this.LeadTime = objParts.LeadTime ? objParts.LeadTime : '';
  this.TaxType = objParts.TaxType ? objParts.TaxType : '1';
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objParts.authuser && objParts.authuser.UserId) ? objParts.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objParts.authuser && objParts.authuser.UserId) ? objParts.authuser.UserId : TokenUserId;
  this.Status = objParts.Status ? objParts.Status : 1;
  this.ShopQuantity = objParts.ShopQuantity ? objParts.ShopQuantity : 1;

  this.PrimaryVendorId = objParts.PrimaryVendorId ? objParts.PrimaryVendorId : 0;

  this.LocalCurrencyCode = objParts.LocalCurrencyCode ? objParts.LocalCurrencyCode : '';
  this.ExchangeRate = objParts.ExchangeRate ? objParts.ExchangeRate : 1;
  this.BaseCurrencyCode = objParts.BaseCurrencyCode ? objParts.BaseCurrencyCode : '';
  this.BasePrice = objParts.BasePrice ? objParts.BasePrice : 0;
  this.BaseSellingPrice = objParts.BaseSellingPrice ? objParts.BaseSellingPrice : 0;
  this.BaseBuyingPrice = objParts.BaseBuyingPrice ? objParts.BaseBuyingPrice : 0;

  this.SellingExchangeRate = objParts.SellingExchangeRate ? objParts.SellingExchangeRate : 1;
  this.BuyingExchangeRate = objParts.BuyingExchangeRate ? objParts.BuyingExchangeRate : 1;
  this.BuyingCurrencyCode = objParts.BuyingCurrencyCode ? objParts.BuyingCurrencyCode : '';
  this.ShopTotalQuantity = objParts.ShopTotalQuantity ? objParts.ShopTotalQuantity : 1;
  this.ShopCurrentQuantity = objParts.ShopCurrentQuantity ? objParts.ShopCurrentQuantity : 1;
  this.ImagesList = objParts.ImagesList ? objParts.ImagesList : [];

  this.APNNo = objParts.APNNo ? objParts.APNNo : '';
  this.VendorId = objParts.VendorId ? objParts.VendorId : 0;
  this.IsEcommerceProduct = objParts.IsEcommerceProduct ? objParts.IsEcommerceProduct : 0;
  this.PartCategoryId = objParts.PartCategoryId ? objParts.PartCategoryId : 0;
  this.BuyingPrice = objParts.BuyingPrice ? objParts.BuyingPrice : 0;

  this.CustomerId = objParts.CustomerId ? objParts.CustomerId : 0;

  // For Server Side Search 

  this.start = objParts.start;
  this.length = objParts.length;
  this.search = objParts.search;
  this.sortCol = objParts.sortCol;
  this.sortDir = objParts.sortDir;
  this.sortColName = objParts.sortColName;
  this.order = objParts.order;
  this.columns = objParts.columns;
  this.draw = objParts.draw;

  this.ExcludeOutOfStock = objParts.ExcludeOutOfStock ? objParts.ExcludeOutOfStock : false;
  this.ManufacturIds = objParts.ManufacturIds ? objParts.ManufacturIds : '';
  this.CategoryIds = objParts.CategoryIds ? objParts.CategoryIds : '';
  this.SellingCurrencyCode = objParts.SellingCurrencyCode ? objParts.SellingCurrencyCode : '';
  this.SellingPrice = objParts.SellingPrice ? objParts.SellingPrice : false;
  this.RRId = objParts.RRId ? objParts.RRId : 0;

};



Parts.PartsListByServerSide = (Parts, result) => {

  var query = "";
  selectquery = "";

  selectquery = `Select P.PartId, P.PartNo, P.Description,CONCAT(CURDS.CurrencySymbol,' ',P.Price) as Price,P.ShopTotalQuantity,P.ShopCurrentQuantity,P.IsEcommerceProduct  `;

  recordfilterquery = `Select count(PartId) as recordsFiltered `;

  query = query + ` from tbl_parts as P   
  LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = P.LocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURDS  ON CURDS.CurrencyCode = P.BaseCurrencyCode AND CURDS.IsDeleted = 0
  WHERE P.IsDeleted = 0 AND P.IsEcommerceProduct = 0 `;

  if (Parts.search.value != '') {
    query = query + ` and (  PartId LIKE '%${Parts.search.value}%'
          or PartNo LIKE '%${Parts.search.value}%' 
          or Description LIKE '%${Parts.search.value}%' 
          or Price LIKE '%${Parts.search.value}%' 
        ) `;
  }
  // console.log(Parts);
  var cvalue = 0;
  for (cvalue = 0; cvalue < Parts.columns.length; cvalue++) {

    if (Parts.columns[cvalue].search.value != "") {
      switch (Parts.columns[cvalue].name) {
        case "IsEcommerceProduct":
          query += " and ( P.IsEcommerceProduct = '" + Parts.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + Parts.columns[cvalue].name + " LIKE '%" + Parts.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var Countquery = recordfilterquery + query;

  if (Parts.start != "-1" && Parts.length != "-1") {
    query += " LIMIT " + Parts.start + "," + (Parts.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(PartId) as TotalCount 
    from tbl_parts where IsDeleted = 0 AND Status = 1 `;

  //console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  // console.log("TotalCountQuery = " + TotalCountQuery);

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      // console.log("TotalCount : " + results[2][0][0].TotalCount)
      // if (results[0][0].length > 0) {
      result(null, {
        data: results[0][0],
        recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: Parts.draw
      });
      return;
      // }
      // else {
      //   result(null, "No record");
      //   return;
      // }
    }
  );

};



Parts.addPart = (req, val, result) => {
  Parts.checkPartNoExists(val, (err, data) => {
    if (data && data.length > 0) {
      var errMsg = "Part # " + val.PartNo + " already exists!";
      result(errMsg, null);
    } else {
      if (val.IsActive == true)
        val.IsActive = 1
      else
        val.IsActive = 0

      var sql = `insert into tbl_parts(PartNo,Description,ManufacturerId,
      ManufacturerPartNo,UnitType,StoreSince,PrimaryVendorId,IsNewOrRefurbished,IsActive,TaxType,
      Price,Created,CreatedBy,Status,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,
      BasePrice,SellingPrice,SellingCurrencyCode,APNNo,VendorId,IsEcommerceProduct,PartCategoryId,BuyingPrice,
      BaseSellingPrice,BaseBuyingPrice,SellingExchangeRate,BuyingExchangeRate,BuyingCurrencyCode,ShopTotalQuantity,ShopCurrentQuantity) values `;
      sql = sql + `(
      '${val.PartNo}','${val.Description}','${val.ManufacturerId}','${val.ManufacturerPartNo}',
      '${val.UnitType}','${val.StoreSince}','${val.PrimaryVendorId}',${val.IsNewOrRefurbished},
      '${val.IsActive}','${val.TaxType}',
      '${val.Price}','${val.Created}','${val.CreatedBy}','${val.Status}'
      ,'${val.LocalCurrencyCode}','${val.ExchangeRate}','${val.BaseCurrencyCode}','${val.BasePrice}',${val.SellingPrice},'${val.SellingCurrencyCode}',
      '${val.APNNo}','${val.VendorId}','${val.IsEcommerceProduct}','${val.PartCategoryId}','${val.BuyingPrice}',
      '${val.BaseSellingPrice}','${val.BaseBuyingPrice}','${val.SellingExchangeRate}','${val.BuyingExchangeRate}','${val.BuyingCurrencyCode}','${val.ShopTotalQuantity}','${val.ShopCurrentQuantity}') `;
      //console.log("sql= " + sql)
      con.query(sql, (err, res) => {
        if (err) {
          result(err, null);
          return;
        } else {
          var PartId = req.body.PartId ? req.body.PartId : res.insertId;
          ShopPartItem.CreatePartItems(PartId, req.body.PartsItemList, (err, data) => {
            // Reqresponse.printResponse(res, null, data);
            if (val.ImagesList.length > 0) {
              var params = {
                PartId: PartId,
                ShopPartItemId: 0,
                ImagesList: val.ImagesList
              }
              PartImages.UpdatePartImages(params, (err1, data1) => { })
            }
            result(null, { id: res.insertId, ...val });
          });

        }

      });
    }
  })
};

Parts.updatePart = (ReqBody, result) => {
  ReqBody = escapeSqlValues(ReqBody);
  var Obj = new Parts(ReqBody);
  Parts.checkPartNoExists(Obj, (err, data) => {
    if (data && data.length > 0) {
      var errMsg = "Part # " + Obj.PartNo + " already exists!";
      result(errMsg, null);
    } else {
      var sql = `UPDATE tbl_parts SET PartNo = '${Obj.PartNo}', Description = '${Obj.Description}', ManufacturerId = '${Obj.ManufacturerId}',ManufacturerPartNo  = '${Obj.ManufacturerPartNo}',UnitType = '${Obj.UnitType}',StoreSince = '${Obj.StoreSince}',TaxType = '${Obj.TaxType}',PrimaryVendorId = '${Obj.PrimaryVendorId}', IsActive  = '${Obj.IsActive}',Price = '${Obj.Price}',IsNewOrRefurbished = '${Obj.IsNewOrRefurbished}',
  LocalCurrencyCode = '${Obj.LocalCurrencyCode}',
  ExchangeRate = '${Obj.ExchangeRate}',BaseCurrencyCode = '${Obj.BaseCurrencyCode}',BasePrice = '${Obj.BasePrice}',

APNNo = '${Obj.APNNo}', 
IsEcommerceProduct = '${Obj.IsEcommerceProduct}',
PartCategoryId = '${Obj.PartCategoryId}',
VendorId = '${Obj.VendorId}',
BuyingPrice  = '${Obj.BuyingPrice}',
SellingPrice  = ${Obj.SellingPrice},
SellingCurrencyCode  = '${Obj.SellingCurrencyCode}',
BaseSellingPrice  = '${Obj.BaseSellingPrice}',
BaseBuyingPrice  = '${Obj.BaseBuyingPrice}',
SellingExchangeRate  = '${Obj.SellingExchangeRate}',
BuyingExchangeRate  = '${Obj.BuyingExchangeRate}',
BuyingCurrencyCode  = '${Obj.BuyingCurrencyCode}',
ShopTotalQuantity  = '${Obj.ShopTotalQuantity}',
ShopCurrentQuantity  = '${Obj.ShopCurrentQuantity}'

  WHERE PartId  = '${Obj.PartId}'`;
      con.query(sql, (err, res) => {
        if (err) {
          //console.log("error: ", err);
          result(err, null);
          return;
        } else {
          ShopPartItem.UpdatePartItems(ReqBody, ReqBody.PartId, ReqBody.PartsItemList, (err, data) => {
            // Reqresponse.printResponse(res, null, data);
            // if (Obj.ImagesList.length > 0) {
            //   var params = {
            //     PartId: ReqBody.PartId,
            //     ShopPartItemId: 0,
            //     ImagesList: Obj.ImagesList
            //   }
            //   PartImages.UpdatePartImages(params, (err1, data1) => { })
            // }
            result(null, { id: Obj.PartId, ...ReqBody });
          });

        }

      });
    }
  });
};

Parts.checkPartNoExists = (Obj, result) => {
  var Query = `SELECT PartNo FROM tbl_parts where IsDeleted=0 AND PartNo='${Obj.PartNo}'`;
  if (Obj.PartId) {
    Query += ` AND PartId NOT IN(${Obj.PartId})`
  }
  // console.log(Query);
  con.query(Query, (err, res) => {
    result(null, res);
  })
}

Parts.viewPart = (PartId, result) => {
  let query = `SELECT  P.*,
  (select REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath from tbl_parts_images where  IsDeleted = 0 AND PartId=P.PartId limit 0,1) as PartImage
  FROM tbl_parts AS P 
  WHERE P.IsDeleted=0 and P.PartId=${PartId}`;

  let itemsQuery = `SELECT PI.*,P.PartNo,CUR.CurrencySymbol as VendorCurrencySymbol
  FROM tbl_parts_item_shop AS PI
  LEFT JOIN tbl_parts AS P ON PI.PartId = P.PartId
  LEFT JOIN tbl_vendors AS V ON V.VendorId = PI.VendorId
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = V.VendorCurrencyCode AND CUR.IsDeleted = 0
  WHERE PI.IsDeleted=0 and PI.PartId=${PartId} `;

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(itemsQuery, result) },
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      //console.log(results[1][0].length);
      if (results[1][0].length > 0) {
        var res1 = results[1][0];
        var ip = 0;
        res1.forEach(function (val, i) {
          PartImages.ViewPartImagesByShopPartItemId(val.ShopPartItemId, (e, d) => {
            ip++;
            res1[i].ItemAttachment = d;
            if (results[1][0].length == ip) {
              result(null, {
                data: results[0][0][0],
                dataItems: res1
              });
            }
          })


        })
      } else {
        result(null, {
          data: results[0][0][0],
          dataItems: res1
        });
      }


    }
  )
}
Parts.emptyFunction = (parts, result) => {
  result(null, { empty: 1 });
  return;
};

Parts.deletePart = (PartId, result) => {
  var sql = `UPDATE tbl_parts SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE PartId = '${PartId}' `;
  var sql1 = `UPDATE tbl_parts_item_shop SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE PartId = '${PartId}' `;
  // con.query(sql, (err, res) => {
  //     if (err)
  //         return result(null, err);
  //     if (res.affectedRows == 0)
  //         return result({ msg: "Part not deleted" }, null);
  //     return result(null, res);
  // });
  async.parallel([
    function (result) { con.query(sql, result) },
    function (result) { con.query(sql1, result) },
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, results);
    }
  )
}
Parts.deletePartItem = (PartId, ShopPartItemId, result) => {
  var sql = `UPDATE tbl_parts_item_shop SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE PartId = '${PartId}' AND ShopPartItemId = '${ShopPartItemId}' `;
  con.query(sql, (err, res) => {
    if (err)
      return result(null, err);
    if (res.affectedRows == 0)
      return result({ msg: "Shop Part Item not deleted" }, null);
    return result(null, res);
  });
}

Parts.updateQuantity = (reqBody, result) => {
  var sql = `UPDATE tbl_parts_item_shop SET ShopTotalQuantity = ShopTotalQuantity + ${reqBody.Quantity},
  ShopCurrentQuantity  = ShopCurrentQuantity + ${reqBody.Quantity}, Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE PartId = '${reqBody.PartId}' AND ShopPartItemId = '${reqBody.ShopPartItemId}' `;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (!reqBody.MROId) {
      if (err)
        return result(null, err);
      if (res.affectedRows == 0)
        return result({ msg: "Quantity not updated" }, null);
    }

    var params = {
      PartId: reqBody.PartId,
      ShopPartItemId: reqBody.ShopPartItemId,
      StockType: 1,
      Quantity: reqBody.Quantity,
      MROId: reqBody.MROId ? reqBody.MROId : 0,
      SOItemId: reqBody.SOItemId ? reqBody.SOItemId : 0,
    }
    PartItemShopStockLog.Create(params, (err2, data2) => { });
    if (!reqBody.MROId) {
      return result(null, reqBody);
    }
  });
}

Parts.reduceQuantity = (reqBody, result) => {
  var sql = `UPDATE tbl_parts_item_shop SET ShopTotalQuantity = ShopTotalQuantity - ${reqBody.Quantity}, ShopCurrentQuantity  = ShopCurrentQuantity - ${reqBody.Quantity}, Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE PartId = '${reqBody.PartId}' AND ShopPartItemId = '${reqBody.ShopPartItemId}' `;

  con.query(sql, (err, res) => {
    if (err)
      return result(null, err);
    if (res.affectedRows == 0)
      return result({ msg: "Quantity not updated" }, null);

    var params = {
      PartId: reqBody.PartId,
      ShopPartItemId: reqBody.ShopPartItemId,
      StockType: 2,
      Quantity: reqBody.Quantity,
      MROId: 0,
      SOItemId: 0
    }
    PartItemShopStockLog.Create(params, (err2, data2) => { })
    return result(null, reqBody);
  });
}

Parts.stockLogs = (reqBody, result) => {
  var sql = `SELECT A.*, CONCAT(U.FirstName,' ',U.LastName) as CreatedByName FROM tbl_parts_item_shop_stock_log as A 
  LEFT JOIN tbl_users AS U ON U.UserId = A.CreatedBy AND U.IsDeleted=0
  WHERE A.IsDeleted=0 AND A.ShopPartItemId=${reqBody.ShopPartItemId}`;
  con.query(sql, (err, res) => {
    if (err)
      return result(null, err);
    return result(null, res);
  });
}

Parts.shopDashboard = (reqBody, result) => {
  var sqlTodayWhere = ` DATE(MRO.Created) = CURDATE() AND MRO.IsDeleted=0 AND MRO.EcommerceOrderId>0 AND MRO.Status!=${Constants.CONST_MROS_REJECTED}`;
  var sqlYesterdayWhere = ` DATE(MRO.Created) = DATE(NOW() - INTERVAL 1 DAY) AND MRO.IsDeleted=0 AND MRO.EcommerceOrderId>0 AND MRO.Status!=${Constants.CONST_MROS_REJECTED}`;
  var sqlWeekWhere = ` DATE(MRO.Created) >= curdate() - INTERVAL DAYOFWEEK(curdate())+6 DAY AND DATE(MRO.Created) < curdate() - INTERVAL DAYOFWEEK(curdate())-1 DAY AND MRO.IsDeleted=0 AND MRO.EcommerceOrderId>0 AND MRO.Status!=${Constants.CONST_MROS_REJECTED}`;
  var sqlMonthWhere = ` MONTH(MRO.Created)=MONTH(now())-1 AND MRO.IsDeleted=0 AND MRO.EcommerceOrderId>0 AND MRO.Status!=${Constants.CONST_MROS_REJECTED}`;
  var sqlYearWhere = ` DATE(MRO.Created) >= DATE_SUB(NOW(),INTERVAL 1 YEAR) AND MRO.IsDeleted=0 AND MRO.EcommerceOrderId>0 AND MRO.Status!=${Constants.CONST_MROS_REJECTED}`;
  var orderPerCustomerWhere = ` EO.IsDeleted=0 AND MRO.Status!=${Constants.CONST_MROS_REJECTED}`;
  var orderSalesMonthlyWhere = ` EO.IsDeleted=0 AND MRO.Status!=${Constants.CONST_MROS_REJECTED}`;
  var orderPerPartsWhere = ` EOI.IsDeleted=0 AND MRO.Status!=${Constants.CONST_MROS_REJECTED}`;
  var orderStatusWhere = "";
  if (reqBody.FromDate != "" && reqBody.ToDate != "" && reqBody.FromDate != "Invalid date" && reqBody.ToDate != "Invalid date") {
    // orderPerCustomerWhere = ` (DATE(EO.Created) BETWEEN '${reqBody.FromDate}' AND '${reqBody.ToDate}') AND EO.IsDeleted=0`;
    // orderSalesMonthlyWhere = ` (DATE(EO.Created) BETWEEN '${reqBody.FromDate}' AND '${reqBody.ToDate}') AND EO.IsDeleted=0`;
    // orderPerPartsWhere = ` (DATE(EOI.Created) BETWEEN '${reqBody.FromDate}' AND '${reqBody.ToDate}') AND EOI.IsDeleted=0`;
    orderStatusWhere = ` (DATE(MRO.Created) BETWEEN '${reqBody.FromDate}' AND '${reqBody.ToDate}') AND MRO.IsDeleted=0 AND MRO.EcommerceOrderId>0 AND MRO.Status!=${Constants.CONST_MROS_REJECTED}`;
  } else {
    orderStatusWhere = ` MRO.IsDeleted=0 AND MRO.EcommerceOrderId>0 AND MRO.Status!=${Constants.CONST_MROS_REJECTED}`;
  }

  var sqlToday = `SELECT COUNT(MRO.MROId) as count, FORMAT(ROUND(ifnull(SUM(EO.BaseGrandTotal),0),2), 2) as total from tbl_mro as MRO
  INNER JOIN tbl_ecommerce_order as EO ON EO.EcommerceOrderId=MRO.EcommerceOrderId AND EO.IsDeleted=0
  WHERE ${sqlTodayWhere}`;

  var sqlYesterday = `SELECT COUNT(MRO.MROId) as count, FORMAT(ROUND(ifnull(SUM(EO.BaseGrandTotal),0),2), 2) as total from tbl_mro as MRO
  INNER JOIN tbl_ecommerce_order as EO ON EO.EcommerceOrderId=MRO.EcommerceOrderId AND EO.IsDeleted=0
  WHERE ${sqlYesterdayWhere}`;

  var sqlWeek = `SELECT COUNT(MRO.MROId) as count, FORMAT(ROUND(ifnull(SUM(EO.BaseGrandTotal),0),2), 2) as total from tbl_mro as MRO
  INNER JOIN tbl_ecommerce_order as EO ON EO.EcommerceOrderId=MRO.EcommerceOrderId AND EO.IsDeleted=0
  WHERE ${sqlWeekWhere}`;

  var sqlMonth = `SELECT COUNT(MRO.MROId) as count, FORMAT(ROUND(ifnull(SUM(EO.BaseGrandTotal),0),2), 2) as total from tbl_mro as MRO
  INNER JOIN tbl_ecommerce_order as EO ON EO.EcommerceOrderId=MRO.EcommerceOrderId AND EO.IsDeleted=0
  WHERE ${sqlMonthWhere}`;

  var sqlYear = `SELECT COUNT(MRO.MROId) as count, FORMAT(ROUND(ifnull(SUM(EO.BaseGrandTotal),0),2), 2) as total from tbl_mro as MRO
  INNER JOIN tbl_ecommerce_order as EO ON EO.EcommerceOrderId=MRO.EcommerceOrderId AND EO.IsDeleted=0
  WHERE ${sqlYearWhere}`;

  var orderPerCustomer = `SELECT COUNT(EO.CustomerId) as count, C.CompanyName from tbl_ecommerce_order as EO 
  LEFT JOIN tbl_customers as C ON C.CustomerId = EO.CustomerId AND EO.IsDeleted=0
  LEFT JOIN tbl_mro as MRO ON MRO.EcommerceOrderId = EO.EcommerceOrderId AND MRO.IsDeleted=0
  WHERE ${orderPerCustomerWhere} GROUP BY EO.CustomerId, C.CompanyName ORDER BY count DESC LIMIT 0, 10`;

  var orderSalesMonthly = `SELECT DATE_FORMAT(EO.Created, '%M') as month, FORMAT(ROUND(ifnull(SUM(EO.BaseGrandTotal),0),2), 2) as total from tbl_ecommerce_order as EO 
  LEFT JOIN tbl_mro as MRO ON MRO.EcommerceOrderId = EO.EcommerceOrderId AND MRO.IsDeleted=0
  WHERE ${orderSalesMonthlyWhere} GROUP BY DATE_FORMAT(EO.Created, '%M') LIMIT 0, 10`;

  var orderPerParts = `SELECT ifnull(SUM(EOI.Quantity), 0) as count, EOI.PartNo from tbl_ecommerce_order_item as EOI 
  LEFT JOIN tbl_mro as MRO ON MRO.EcommerceOrderId = EOI.EcommerceOrderId AND MRO.IsDeleted=0
  WHERE ${orderPerPartsWhere} GROUP BY EOI.PartId, EOI.PartNo ORDER BY count DESC LIMIT 0, 10`;

  var orderStatus = `SELECT COUNT(MRO.MROId) as count, MRO.Status, CASE MRO.Status 
  WHEN 0 THEN '${Constants.array_mro_status[0]}'
  WHEN 1 THEN '${Constants.array_mro_status[1]}'
  WHEN 2 THEN '${Constants.array_mro_status[2]}'
  WHEN 3 THEN '${Constants.array_mro_status[3]}'
  WHEN 4 THEN '${Constants.array_mro_status[4]}'
  WHEN 5 THEN '${Constants.array_mro_status[5]}'
  WHEN 6 THEN '${Constants.array_mro_status[6]}'
  WHEN 7 THEN '${Constants.array_mro_status[7]}'
  ELSE '-'	end StatusName from tbl_mro as MRO WHERE ${orderStatusWhere}
  GROUP BY MRO.Status`;

  // console.log(orderPerCustomer);
  // console.log(orderSalesMonthly);
  // console.log(orderSalesMonthly);
  // console.log(orderStatus);

  async.parallel([
    function (result) { con.query(sqlToday, result) },
    function (result) { con.query(sqlYesterday, result) },
    function (result) { con.query(sqlWeek, result) },
    function (result) { con.query(sqlMonth, result) },
    function (result) { con.query(sqlYear, result) },
    function (result) { con.query(orderPerCustomer, result) },
    function (result) { con.query(orderSalesMonthly, result) },
    function (result) { con.query(orderPerParts, result) },
    function (result) { con.query(orderStatus, result) }
  ],
    function (err, results) {
      if (err) {
        console.log("err", err);
        return result(err, null);
      } else {
        result(null, {
          todayData: results[0][0][0],
          yesterdayData: results[1][0][0],
          weeklyData: results[2][0][0],
          monthlyData: results[3][0][0],
          yearlyData: results[4][0][0],
          orderPerCustomerData: results[5][0],
          orderSalesMonthlyData: results[6][0],
          orderPerPartsData: results[7][0],
          orderStatusData: results[8][0]
        });
      }



    }
  )
}
module.exports = Parts;
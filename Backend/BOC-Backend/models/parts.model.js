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

const Parts = function (objParts) {
  this.PartId = objParts.PartId;
  this.PartNo = objParts.PartNo;
  this.PartNo = typeof objParts.PartNo === "object" ? objParts.PartNo.PartNo : objParts.PartNo;
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

const PartsModelImport = function FunctionName(obj) {
  this.PartNo = obj["PartNo"] ? obj["PartNo"].trim() : '';
  this.Description = obj["Description"] ? obj["Description"].replace("'", "\\'").trim() : '';
  this.Manufacturer = obj["Manufacturer"] ? obj["Manufacturer"].trim() : '';
  this.ManufacturerPartNo = obj["ManufacturerPartNo"] ? obj["ManufacturerPartNo"] : '';
};

Parts.ImportManufacturer = (Model, result) => {
  var Obj = new PartsModelImport(Model);
  var GetVendorIdByVendorName = VendorModel.GetVendorIdByVendorName(Obj.Manufacturer);
  var IsExistPartByPartNo = Parts.IsExistPartByPartNo(Obj.PartNo);
  async.parallel([
    function (result) { con.query(GetVendorIdByVendorName, result); },
    function (result) { con.query(IsExistPartByPartNo, result); },
  ],
    function (err, results) {
      if (err) {
        result(err, null)
      } else {
        if (results[0][0].length == 0) {
          var Model = {
            ManufacturerId: 0,
            PartId: (results[1][0].length && results[1][0][0].PartId > 0) ? results[1][0][0].PartId : 0,
            ManufacturerPartNo: Obj.ManufacturerPartNo,
          };
          Parts.UpdateManuFacturer(new Parts(Model), result);
          result({ msg: "Manufacturer Not Available : " + Obj.Manufacturer + "" }, null);
        }
        else if (results[1][0].length == 0) {
          result({ msg: "Part Not Available : " + Obj.PartNo + "" }, null);
        }
        else {
          var ManufacturerId = results[0][0][0].VendorId > 0 ? results[0][0][0].VendorId : 0;
          var PartId = results[1][0][0].PartId > 0 ? results[1][0][0].PartId : 0;
          var PartObj = {
            ManufacturerId: ManufacturerId,
            PartId: PartId,
            ManufacturerPartNo: Obj.ManufacturerPartNo,
          };
          async.parallel([
            function (result) { Parts.UpdateManuFacturer(new Parts(PartObj), result); },
          ],
            function (err, results) {
              if (err) {
                result(err, null)
              } else {
                var msg = PartId > 0 ? "Record Updated" : "failed";
                result(null, { Status: msg, PartNo: Obj.PartNo })
              }
            });
        }
      }
    })
};
Parts.IsExistPartByPartNo = (PartNo, result) => {
  var sql = `Select PartNo,PartId from tbl_parts WHERE IsDeleted = 0 
     AND PartNo='${PartNo}' limit 1 `;
  //console.log(sql)
  return sql;
}

Parts.UpdateDescription = (Obj, result) => {
  var Query = `Update  tbl_parts set Description='${Obj.Description}' , ModifiedBy='${Obj.ModifiedBy}',Modified='${Obj.Modified}'  WHERE PartId=${Obj.PartId}`;
  con.query(Query, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}

Parts.UpdateManuFacturer = (Obj, result) => {
  var Query = `Update  tbl_parts set ManufacturerId='${Obj.ManufacturerId}',ManufacturerPartNo='${Obj.ManufacturerPartNo}' , ModifiedBy='${Obj.ModifiedBy}',Modified='${Obj.Modified}' 
    WHERE PartId=${Obj.PartId} `;
  //console.log(Query)
  con.query(Query, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}

Parts.ImportPartwithMapping = (PartJson, req, result) => {
  let objFinal = {};
  let obj1 = JSON.parse(req.body.mapping);
  for (var key in obj1) {
    objFinal[key] = PartJson[obj1[key]];
  }
  var tempCreated = objFinal.Created;
  let obj = new Parts(objFinal);
  obj.Created = tempCreated;
  obj.InventoryType = obj.InventoryType == 'Stock Part' ? 1 : 2;
  obj.IsSerialNumber = obj.IsSerialNumber == 'Yes' ? 1 : 0;
  obj.Status = obj.Status == 'Active' ? 1 : 0;
  var Temp = obj.Created.substring(0, 10);
  var date_arr = Temp.split('/');
  obj.Created = date_arr[2] + "-" + date_arr[0] + "-" + date_arr[1];
  obj.Price = obj.Price ? obj.Price.trim().replace("US $ ", "") : 0;

  let manufacturerQuery = `SELECT VendorId as ManufacturerId FROM tbl_vendors WHERE IsDeleted=0 and VendorName = '${obj.Manufacturer}'`;
  let PartNoQuery = `SELECT PartId FROM tbl_parts WHERE IsDeleted=0 and  PartNo = '${obj.PartNo}'`;
  async.parallel([
    (result) => { con.query(manufacturerQuery, result) },
    (result) => { con.query(PartNoQuery, result) },
  ],
    (err, results) => {

      if (err) {
        return result(err, null);
      }
      let ManufacturerId = 0; var _insert = 0; var _update = 0; let query = '';
      ManufacturerId = results[0][0][0] ? results[0][0][0].ManufacturerId : 0;
      obj.PartId = results[1][0][0] ? results[1][0][0].PartId : 0;
      if (obj.PartId <= 0) {
        query = `INSERT INTO tbl_parts(PartNo,SerialNo,Description, UnitType, InventoryType, ManufacturerId, ManufacturerPartNo,
          Quantity, LocationName, Price, IsNewOrRefurbished, OnHandQty, Avail, OpenPOQty, TaxType, IsSerialNumber, 
          Status, IsActive, SellingPrice,SellingPriceDescription,BuyingPriceDescription,Created,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BasePrice,BaseSellingPrice,BaseBuyingPrice)
          VALUES ('${obj.PartNo}', '${obj.SerialNo}', '${obj.Description}', '0', '${obj.InventoryType}', '${ManufacturerId}', '${obj.ManufacturerPartNo}',
          '1','', '${obj.Price}', '1','${obj.OnHandQty}', '${obj.Avail}', '${obj.OpenPOQty}', '0', '${obj.IsSerialNumber}',
          '${obj.Status}', '${obj.Status}','${obj.Price}','','','${obj.Created}','${obj.LocalCurrencyCode}','${obj.ExchangeRate}','${obj.BaseCurrencyCode}','${obj.BasePrice}','${obj.BaseSellingPrice}','${obj.BaseBuyingPrice}'); `
        _insert = 1;
      }
      else {
        query = `UPDATE tbl_parts SET  PartNo='${obj.PartNo}',SerialNo='${obj.SerialNo}',
          Description='${obj.Description}',InventoryType = '${obj.InventoryType}',ManufacturerId='${ManufacturerId}',ManufacturerPartNo = '${obj.ManufacturerPartNo}',
          Price='${obj.Price}',OnHandQty = '${obj.OnHandQty}',Avail='${obj.Avail}',OpenPOQty = '${obj.OpenPOQty}',
          IsSerialNumber='${obj.IsSerialNumber}',Status = '${obj.Status}',IsActive='${obj.Status}',SellingPrice = '${obj.Price}',
          Modified = '${obj.Modified}',ModifiedBy = '${obj.ModifiedBy}',LocalCurrencyCode = '${obj.LocalCurrencyCode}',ExchangeRate = '${obj.ExchangeRate}',BaseCurrencyCode = '${obj.BaseCurrencyCode}',BasePrice = '${obj.BasePrice}',BaseSellingPrice = '${obj.BaseSellingPrice}',BaseBuyingPrice = '${obj.BaseBuyingPrice}'  WHERE PartId ='${obj.PartId}' `;
        _update = 1;
      }
      // console.log(query);
      con.query(query, (err, res) => {
        if (err) {
          return result({ message: err, status: 'failed', partNo: obj.PartNo }, null);
        }
        if (_insert == 1)
          return result({ message: obj.PartNo + ' Inserted', status: 'inserted' }, null);
        if (_update == 1)
          return result({ message: obj.PartNo + ' Updated', status: 'updated' }, null);
      });
    });
};

Parts.getAll = result => {
  con.query(`Select PartId, PartNo, Description,Price 
    from tbl_parts WHERE IsDeleted = 0 AND Status = 1 `, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
}

Parts.getAll20 = result => {
  con.query(`Select PartId, PartNo, Description,Price 
  from tbl_parts WHERE IsDeleted = 0 AND Status = 1 LIMIT 20`, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
}


Parts.PartsListByServerSide = (Parts, result) => {

  var query = "";
  selectquery = "";

  selectquery = `Select P.PartId, P.PartNo, P.Description,CONCAT(CURDS.CurrencySymbol,' ',P.Price) as Price,P.ShopTotalQuantity,P.ShopCurrentQuantity,P.IsEcommerceProduct  `;

  recordfilterquery = `Select count(PartId) as recordsFiltered `;

  query = query + ` from tbl_parts as P   
  LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = P.LocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURDS  ON CURDS.CurrencyCode = P.BaseCurrencyCode AND CURDS.IsDeleted = 0
  WHERE P.IsDeleted = 0 `;

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

Parts.PartsListStoreByServerSide = (Parts, result) => {

  var query = "";
  selectquery = "";

  selectquery = `Select P.PartId, P.PartNo, P.Description,CONCAT(CURDS.CurrencySymbol,' ',P.Price) as Price,P.ShopTotalQuantity,P.ShopCurrentQuantity,P.IsEcommerceProduct  `;

  recordfilterquery = `Select count(PartId) as recordsFiltered `;

  query = query + ` from tbl_parts as P   
  LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = P.LocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURDS  ON CURDS.CurrencyCode = P.BaseCurrencyCode AND CURDS.IsDeleted = 0
  WHERE P.IsDeleted = 0 AND P.IsEcommerceProduct = 1 `;

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

Parts.addNewPart = (ReqBody, result) => {
  ReqBody = escapeSqlValues(ReqBody);
  var Obj = new Parts(ReqBody);
  var PartNo = String(Obj.PartNo);
  var partAHRCheck = PartNo.substring(0, 4);
  if (partAHRCheck != "AHR-" && Obj.IsNewOrRefurbished == 2) {
    Obj.PartNo = "AHR-" + PartNo;
  }
  if (Obj.ExchangeRate == 1) {
    Obj.BasePrice = Obj.Price;
    Obj.BaseSellingPrice = Obj.SellingPrice;
    Obj.BaseBuyingPrice = Obj.BuyingPrice;
  }
  var sql = `insert into tbl_parts(PartNo,Description,ManufacturerPartNo,ManufacturerId,Quantity,Price,TaxType,IsNewOrRefurbished,PrimaryVendorId,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BasePrice,BaseSellingPrice,BaseBuyingPrice,Status,SellingPrice,BuyingPrice,Created,CreatedBy)
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  var values = [
    Obj.PartNo, Obj.Description, Obj.ManufacturerPartNo,
    Obj.ManufacturerId, Obj.Quantity, Obj.Price, Obj.TaxType, Obj.IsNewOrRefurbished, Obj.PrimaryVendorId,
    Obj.LocalCurrencyCode, Obj.ExchangeRate, Obj.BaseCurrencyCode, Obj.BasePrice, Obj.BaseSellingPrice, Obj.BaseBuyingPrice, Obj.Status, Obj.SellingPrice, Obj.BuyingPrice,
    Obj.Created, Obj.CreatedBy
  ]

  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    ReqBody.PartId = res.insertId;
    result(null, { id: res.insertId, ...ReqBody });
  });
};

//For inventory
Parts.addNewPartInventory = (ReqBody, result) => {

  var Obj = new Parts(ReqBody);

  var checkSql = `SELECT COUNT(0) AS COUNT FROM tbl_parts WHERE PartNo = '${Obj.PartNo}'`;

  con.query(checkSql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res[0].COUNT > 0) {
      result("PartNo already exists!", null);
      return;
    }

    var sql = `insert into tbl_parts(PartNo,Description,ManufacturerId,ManufacturerPartNo,UnitType,StoreSince,TaxType,PrimaryVendorId,IsActive,SellingPrice,SellingPriceDescription,BuyingPrice,BuyingPriceDescription,WarehouseId,OpeningStock,MinStock,MaxStock,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BasePrice,BaseSellingPrice,BaseBuyingPrice,Created,CreatedBy)
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    var values = [
      Obj.PartNo, Obj.Description, Obj.ManufacturerId, Obj.ManufacturerPartNo, Obj.UnitType, Obj.StoreSince, Obj.TaxType, Obj.PrimaryVendorId, Obj.IsActive, Obj.SellingPrice, Obj.SellingPriceDescription, Obj.BuyingPrice, Obj.BuyingPriceDescription, Obj.WarehouseId, Obj.OpeningStock, Obj.MinStock, Obj.MaxStock,
      Obj.LocalCurrencyCode, Obj.ExchangeRate, Obj.BaseCurrencyCode, Obj.BasePrice, Obj.BaseSellingPrice, Obj.BaseBuyingPrice,
      Obj.Created, Obj.CreatedBy
    ]
    con.query(sql, values, (err, res) => {
      if (err) {
        //console.log("error: ", err);
        result(err, null);
        return;
      }
      ReqBody.PartId = res.insertId;
      result(null, { id: res.insertId, ...ReqBody });
    });
  })


};

Parts.updatePartInventory = (ReqBody, result) => {
  ReqBody = escapeSqlValues(ReqBody);
  var Obj = new Parts(ReqBody);
  var sql = `UPDATE tbl_parts SET 
    PartNo = '${Obj.PartNo}', Description = '${Obj.Description}', ManufacturerId = '${Obj.ManufacturerId}',ManufacturerPartNo  = '${Obj.ManufacturerPartNo}',UnitType = '${Obj.UnitType}',StoreSince = '${Obj.StoreSince}',TaxType = '${Obj.TaxType}',PrimaryVendorId = '${Obj.PrimaryVendorId}', IsActive  = '${Obj.IsActive}',SellingPrice = '${Obj.SellingPrice}',SellingPriceDescription = '${Obj.SellingPriceDescription}',BuyingPrice = '${Obj.BuyingPrice}',BuyingPriceDescription = '${Obj.BuyingPriceDescription}',WarehouseId = '${Obj.WarehouseId}',OpeningStock = '${Obj.OpeningStock}',MinStock = '${Obj.MinStock}',
    LocalCurrencyCode = '${Obj.LocalCurrencyCode}',ExchangeRate = '${Obj.ExchangeRate}',BaseCurrencyCode = '${Obj.BaseCurrencyCode}',BasePrice = '${Obj.BasePrice}',BaseSellingPrice = '${Obj.BaseSellingPrice}',BaseBuyingPrice = '${Obj.BaseBuyingPrice}',
    MaxStock = '${Obj.MaxStock}' WHERE PartId  = '${Obj.PartId}'`;

  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: Obj.PartId, ...ReqBody });
  });
};

Parts.addPart = (val, result) => {
  if (val.IsActive == true)
    val.IsActive = 1
  else
    val.IsActive = 0

  // var sql = `insert into tbl_parts(PartNo,Description,ManufacturerId,
  //   ManufacturerPartNo,UnitType,StoreSince,PrimaryVendorId,IsNewOrRefurbished,IsActive,TaxType,
  //   Price,Created,CreatedBy,Status,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,
  //   BasePrice,SellingPrice,SellingCurrencyCode,APNNo,VendorId,IsEcommerceProduct,PartCategoryId,BuyingPrice,
  //   BaseSellingPrice,BaseBuyingPrice,SellingExchangeRate,BuyingExchangeRate,BuyingCurrencyCode,ShopTotalQuantity,ShopCurrentQuantity) values `;
  // sql = sql + `(
  //   '${val.PartNo}','${val.Description}','${val.ManufacturerId}','${val.ManufacturerPartNo}',
  //   '${val.UnitType}','${val.StoreSince}','${val.PrimaryVendorId}',${val.IsNewOrRefurbished},
  //   '${val.IsActive}','${val.TaxType}',
  //   '${val.Price}','${val.Created}','${val.CreatedBy}','${val.Status}'
  //   ,'${val.LocalCurrencyCode}','${val.ExchangeRate}','${val.BaseCurrencyCode}','${val.BasePrice}',${val.SellingPrice},'${val.SellingCurrencyCode}',
  //   '${val.APNNo}','${val.VendorId}','${val.IsEcommerceProduct}','${val.PartCategoryId}','${val.BuyingPrice}',
  //   '${val.BaseSellingPrice}','${val.BaseBuyingPrice}','${val.SellingExchangeRate}','${val.BuyingExchangeRate}','${val.BuyingCurrencyCode}','${val.ShopTotalQuantity}','${val.ShopCurrentQuantity}') `;
  var sql = `insert into tbl_parts(PartNo,Description,ManufacturerId,
    ManufacturerPartNo,UnitType,StoreSince,PrimaryVendorId,IsNewOrRefurbished,IsActive,TaxType,
    Price,Created,CreatedBy,Status,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,
    BasePrice) values `;
  sql = sql + `(
    '${val.PartNo}','${val.Description}','${val.ManufacturerId}','${val.ManufacturerPartNo}',
    '${val.UnitType}','${val.StoreSince}','${val.PrimaryVendorId}',${val.IsNewOrRefurbished},
    '${val.IsActive}','${val.TaxType}',
    '${val.Price}','${val.Created}','${val.CreatedBy}','${val.Status}'
    ,'${val.LocalCurrencyCode}','${val.ExchangeRate}','${val.BaseCurrencyCode}','${val.BasePrice}') `;
  //console.log("sql= " + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...val });
  });
};




Parts.updatePartQuantity = (ReqBody, result) => {
  ReqBody = escapeSqlValues(ReqBody);
  var Obj = new Parts(ReqBody);
  var sql = `UPDATE tbl_parts SET  
  ShopTotalQuantity = ShopTotalQuantity + ${ReqBody.Quantity},
  ShopCurrentQuantity  = ShopCurrentQuantity + ${ReqBody.Quantity}
  WHERE PartId  = '${ReqBody.PartId}'`;

  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: Obj.PartId, ...ReqBody });
  });
};

Parts.updatePart = (ReqBody, result) => {
  ReqBody = escapeSqlValues(ReqBody);
  var Obj = new Parts(ReqBody);
  //   var sql = `UPDATE tbl_parts SET PartNo = '${Obj.PartNo}', Description = '${Obj.Description}', ManufacturerId = '${Obj.ManufacturerId}',ManufacturerPartNo  = '${Obj.ManufacturerPartNo}',UnitType = '${Obj.UnitType}',StoreSince = '${Obj.StoreSince}',TaxType = '${Obj.TaxType}',PrimaryVendorId = '${Obj.PrimaryVendorId}', IsActive  = '${Obj.IsActive}',Price = '${Obj.Price}',IsNewOrRefurbished = '${Obj.IsNewOrRefurbished}',
  //   LocalCurrencyCode = '${Obj.LocalCurrencyCode}',
  //   ExchangeRate = '${Obj.ExchangeRate}',BaseCurrencyCode = '${Obj.BaseCurrencyCode}',BasePrice = '${Obj.BasePrice}',

  // APNNo = '${Obj.APNNo}', 
  // IsEcommerceProduct = '${Obj.IsEcommerceProduct}',
  // PartCategoryId = '${Obj.PartCategoryId}',
  // VendorId = '${Obj.VendorId}',
  // BuyingPrice  = '${Obj.BuyingPrice}',
  // SellingPrice  = ${Obj.SellingPrice},
  // SellingCurrencyCode  = '${Obj.SellingCurrencyCode}',
  // BaseSellingPrice  = '${Obj.BaseSellingPrice}',
  // BaseBuyingPrice  = '${Obj.BaseBuyingPrice}',
  // SellingExchangeRate  = '${Obj.SellingExchangeRate}',
  // BuyingExchangeRate  = '${Obj.BuyingExchangeRate}',
  // BuyingCurrencyCode  = '${Obj.BuyingCurrencyCode}',
  // ShopTotalQuantity  = '${Obj.ShopTotalQuantity}',
  // ShopCurrentQuantity  = '${Obj.ShopCurrentQuantity}'

  //   WHERE PartId  = '${Obj.PartId}'`;
  var sql = `UPDATE tbl_parts SET PartNo = '${Obj.PartNo}', Description = '${Obj.Description}', ManufacturerId = '${Obj.ManufacturerId}',ManufacturerPartNo  = '${Obj.ManufacturerPartNo}',UnitType = '${Obj.UnitType}',StoreSince = '${Obj.StoreSince}',TaxType = '${Obj.TaxType}',PrimaryVendorId = '${Obj.PrimaryVendorId}', IsActive  = '${Obj.IsActive}',Price = '${Obj.Price}',IsNewOrRefurbished = '${Obj.IsNewOrRefurbished}',
  LocalCurrencyCode = '${Obj.LocalCurrencyCode}',
  ExchangeRate = '${Obj.ExchangeRate}',BaseCurrencyCode = '${Obj.BaseCurrencyCode}',BasePrice = '${Obj.BasePrice}'
  WHERE PartId  = '${Obj.PartId}'`;

  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: Obj.PartId, ...ReqBody });
  });
};

Parts.updateShopPart = (ReqBody, result) => {
  ReqBody = escapeSqlValues(ReqBody);
  var Obj = new Parts(ReqBody);
  var sql = `UPDATE tbl_parts SET 
APNNo = '${Obj.APNNo}', 
IsEcommerceProduct = '1',
PartCategoryId = '${Obj.PartCategoryId}',
VendorId = '${Obj.VendorId}',
BuyingPrice  = '${Obj.BuyingPrice}',
SellingPrice  = ${Obj.SellingPrice},
SellingCurrencyCode  = '${Obj.SellingCurrencyCode}',
ShopTotalQuantity = ShopTotalQuantity + (${Obj.ShopQuantity}),
ShopCurrentQuantity = ShopCurrentQuantity + (${Obj.ShopQuantity})
WHERE PartId  = '${Obj.PartId}'`;

  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    Parts.partsImageUpload(Obj.RRId, Obj.PartId, (err, data) => {

    })
    result(null, { id: Obj.PartId, ...ReqBody });
  });
};

Parts.partsImageUpload = (RRId, PartId, result) => {
  var sqlRRImages = RRImages.ViewRRImages(RRId);
  con.query(sqlRRImages, (err, res) => {
    if (err) {
      result(err, null);
      return;
    } else {
      // console.log(res)
      var reqBody = {
        PartId: PartId,
        ImagesList: res
      }
      PartImages.CreatePartImagesViaRR(reqBody, (e, d) => {

      })
    }

  });
}

Parts.preferredVendorUpdate = (params, result) => {
  var sql = `UPDATE tbl_parts  SET  PrimaryVendorId = ?  WHERE PartId = ?`;
  var values = [params.PrimaryVendorId, params.PartId];
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: params.PartId });
    return;
  }
  );
};

Parts.UpdatePartNo = (PartId, result) => {
  var sql = `UPDATE tbl_parts  SET  PartNo = CONCAT('AHR-',?)  WHERE PartId = ?`;
  var values = [PartId, PartId];
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: PartId });
    return;
  }
  );
};

Parts.GetPartsByPartId = (PartId, Id, Type, result) => {
  var sql = '';
  Id = Id ? Id : 0;
  if (Type == 'vendor') {
    sql = `Select P.*,V.VendorName as Manufacturer,Description,IFNULL(PC.PartVatTaxPercentage, C.VatTaxPercentage) as PartVatTaxPercentage,
    EXR.ExchangeRate as ExchangeRate 
    from tbl_parts as P 
    LEFT JOIN  tbl_vendors as V ON V.VendorId = ${Id} AND V.IsDeleted = 0 
    LEFT JOIN  tbl_countries as C ON C.CountryId = V.VendorLocation AND C.IsDeleted=0
    LEFT JOIN tbl_parts_tax_by_country as PC ON PC.PartId = P.PartId AND PC.CountryId = V.VendorLocation  AND PC.IsDeleted = 0 
    LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = V.VendorCurrencyCode AND EXR.TargetCurrencyCode = SETT.DefaultCurrency AND  (CURDATE() between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    where P.IsDeleted=0 and P.PartId=${PartId} `;
  } else {
    sql = `Select P.*,V.VendorName as Manufacturer, Description ,CustomerPartNo1,CustomerPartNo2,c.LocalCurrencyCode,c.BaseCurrencyCode,c.BaseNewPrice,IFNULL(PC.PartVatTaxPercentage, C.VatTaxPercentage) as PartVatTaxPercentage,c.NewPrice,c.CustomerPartId,c.CustomerPartId as id,c.CustomerId,
    EXR.ExchangeRate as ExchangeRate
    from tbl_parts as P 
    LEFT JOIN  tbl_customer_parts as c ON c.PartId = P.PartId  AND c.CustomerId = ${Id} AND c.IsDeleted = 0 
    LEFT JOIN  tbl_vendors as V ON V.VendorId = P.ManufacturerId AND V.IsDeleted = 0     
    LEFT JOIN  tbl_customers as cus ON  cus.CustomerId = ${Id} AND cus.IsDeleted = 0 
    LEFT JOIN  tbl_countries as C ON C.CountryId = cus.CustomerLocation AND C.IsDeleted=0
    LEFT JOIN tbl_parts_tax_by_country as PC ON PC.PartId = P.PartId AND PC.CountryId = cus.CustomerLocation  AND PC.IsDeleted = 0 
    LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
    LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = cus.CustomerCurrencyCode AND EXR.TargetCurrencyCode = SETT.DefaultCurrency AND  (CURDATE() between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
    where P.IsDeleted=0 and P.PartId=${PartId} `;
  }
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
}


Parts.Partstracking = (PartNo, SerialNo, result) => {
  var query = `SELECT iv.InventoryId,pi.PartId,pi.PartItemId, iv.RFIDTagNo, pt.PartNo,pi.SerialNo,Case when iv.IsAvailable=1 then 'Yes' else 'No' end as Available
  ,wh.WarehouseName,whs1.WarehouseSub1Name,whs2.WarehouseSub2Name,whs3.WarehouseSub3Name,whs4.WarehouseSub4Name,
  ifnull(so.StockOutId, 0) AS StockOutId
  FROM  tbl_inventory iv 
  Inner Join  tbl_parts pt on iv.PartId=pt.PartId 
  Inner Join tbl_parts_item pi on pi.PartItemId=iv.PartItemId
  Left Join tbl_warehouse wh on wh.WarehouseId=iv.WarehouseId
  Left Join tbl_inventory_stockout so on so.InventoryId=iv.InventoryId
  Left Join tbl_warehouse_sublevel1 whs1 on whs1.WarehouseSub1Id=iv.WarehouseSub1Id
  Left Join tbl_warehouse_sublevel2 whs2 on whs2.WarehouseSub2Id=iv.WarehouseSub2Id
  Left Join tbl_warehouse_sublevel3 whs3 on whs3.WarehouseSub3Id=iv.WarehouseSub3Id
  Left Join tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub4Id=iv.WarehouseSub4Id
  where iv.IsDeleted = 0 `

  if (PartNo != "" && PartNo != undefined) {
    query += ` and pt.PartNo= '${PartNo}'`;
  }
  if (SerialNo != "" && SerialNo != undefined) {
    query += ` and pi.SerialNo= '${SerialNo}'`;
  }
  //  console.log("query = " + query);
  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
}





//For Inventory
Parts.GetPartByPartIdForInventory = (PartId, result) => {
  let query = `SELECT  P.*,
  (select REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath from tbl_parts_images where  IsDeleted = 0 AND PartId=P.PartId limit 0,1) as PartImage
  FROM tbl_parts AS P 
  WHERE P.IsDeleted=0 and P.PartId=${PartId}`;

  let itemsQuery = `SELECT PI.*, P.PartNo, I.InventoryId, I.RFIDTagNo, W.WarehouseName, W1.WarehouseSub1Name, W2.WarehouseSub2Name, W3.WarehouseSub3Name, W4.WarehouseSub4Name 
  FROM tbl_parts_item AS PI
  LEFT JOIN tbl_parts AS P ON PI.PartId = P.PartId
  LEFT JOIN tbl_warehouse AS W ON PI.WarehouseId = W.WarehouseId
  LEFT JOIN tbl_warehouse_sublevel1 AS W1 ON PI.WarehouseSub1Id = W1.WarehouseSub1Id
  LEFT JOIN tbl_warehouse_sublevel2 AS W2 ON PI.WarehouseSub2Id = W2.WarehouseSub2Id
  LEFT JOIN tbl_warehouse_sublevel3 AS W3 ON PI.WarehouseSub3Id = W3.WarehouseSub3Id
  LEFT JOIN tbl_warehouse_sublevel4 AS W4 ON PI.WarehouseSub4Id = W4.WarehouseSub4Id
  LEFT JOIN tbl_inventory AS I ON PI.PartItemId = I.PartItemId
  WHERE PI.IsDeleted=0 and PI.PartId=${PartId} `;

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(itemsQuery, result) },
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        data: results[0][0][0],
        dataItems: results[1][0]
      });
    }
  )
}

Parts.GetPartByPartNo = (PartNo, result) => {
  let query = `SELECT  P.*, W.WarehouseName
  FROM tbl_parts AS P 
  LEFT JOIN tbl_warehouse AS W ON W.WarehouseId = P.WarehouseId
  WHERE P.IsDeleted=0 and P.PartNo='${PartNo}'  `;

  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
}

Parts.SearchPartByPartNo = (PartNo, result) => {
  let query = `SELECT PartNo,PartId, SellingPrice, Description
  FROM tbl_parts 
  WHERE IsDeleted=0 and PartNo LIKE '%${PartNo}%' LIMIT 30 `;
  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
}


Parts.SearchNonRepairPartByPartNo = (PartNo, result) => {
  let query = `SELECT PartNo,PartId, Price, SellingPrice, Description
  FROM tbl_parts 
  WHERE IsDeleted=0 and ( IsNewOrRefurbished !=2  OR IsNewOrRefurbished IS NULL ) AND PartNo LIKE '%${PartNo}%'  LIMIT 30 `;
  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
}

Parts.emptyFunction = (Part, result) => {
  result(null, { empty: 1 });
  return;
};


Parts.PartstrackingByRoom = (PartNo, SerialNo, result) => {
  var query = `SELECT whs4.WarehouseSub4Name,whs4.RowIndex,whs4.ColumnIndex
  FROM  ahoms.tbl_inventory iv 
  Inner Join  ahoms.tbl_parts pt on iv.PartId=pt.PartId 
  Inner Join ahoms.tbl_parts_item pi on pi.PartId=iv.PartId
  Left Join ahoms.tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub3Id=iv.WarehouseSub3Id
  where iv.IsDeleted = 0 `

  if (PartNo != "" && PartNo != undefined) {
    query += ` and pt.PartNo= '${PartNo}'`;
  }
  if (SerialNo != "" && SerialNo != undefined) {
    query += ` and pi.SerialNo= '${SerialNo}'`;
  }
  // console.log("query = " + query);
  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
}

Parts.PartstrackingByRFIDTagNo = (RFIDTagNo, result) => {
  var query = `SELECT iv.InventoryId,pi.PartId,pi.PartItemId, iv.RFIDTagNo, iv.DisplayRFID, pt.PartNo,pi.SerialNo,Case when iv.IsAvailable=1 then 'Yes' else 'No' end as Available
  ,wh.WarehouseName,whs1.WarehouseSub1Name,whs2.WarehouseSub2Name,whs3.WarehouseSub3Name,whs3.WarehouseSub3LayoutImage,whs4.WarehouseSub4Name, 
  ifnull(so.StockOutId, 0) AS StockOutId
  FROM  tbl_inventory iv 
  Inner Join  tbl_parts pt on iv.PartId=pt.PartId 
  Inner Join tbl_parts_item pi on pi.PartItemId=iv.PartItemId
  Left Join tbl_inventory_stockout so on so.InventoryId=iv.InventoryId
  Left Join tbl_warehouse wh on wh.WarehouseId=iv.WarehouseId
  Left Join tbl_warehouse_sublevel1 whs1 on whs1.WarehouseSub1Id=iv.WarehouseSub1Id
  Left Join tbl_warehouse_sublevel2 whs2 on whs2.WarehouseSub2Id=iv.WarehouseSub2Id
  Left Join tbl_warehouse_sublevel3 whs3 on whs3.WarehouseSub3Id=iv.WarehouseSub3Id
  Left Join tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub4Id=iv.WarehouseSub4Id
  where iv.RFIDTagNo='${RFIDTagNo}'`;


  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res[0]);
    return;
  });
}

Parts.PartstrackingByRFIDTagNoByRoom = (RFIDTagNo, result) => {
  var query = `SELECT whs4.WarehouseSub4Name,whs4.RowIndex,whs4.ColumnIndex
  FROM  tbl_inventory iv 
  Inner Join  tbl_parts pt on iv.PartId=pt.PartId 
  Inner Join tbl_parts_item pi on pi.PartId=iv.PartId
  Left Join tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub3Id=iv.WarehouseSub3Id
  where iv.RFIDTagNo='${RFIDTagNo}'`;

  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
}

Parts.PartstrackingByRFIDTagNos = (RFIDTagNos, result) => {

  let joinedIds = RFIDTagNos.map(r => `'${r}'`).join(',');
  var query = `SELECT iv.InventoryId,pi.PartId,pi.PartItemId, iv.RFIDTagNo, iv.DisplayRFID, pt.PartNo,pi.SerialNo,Case when iv.IsAvailable=1 then 'Yes' else 'No' end as Available
  ,wh.WarehouseName,whs1.WarehouseSub1Name,whs2.WarehouseSub2Name,whs3.WarehouseSub3Name,whs3.WarehouseSub3LayoutImage,whs4.WarehouseSub4Name, 
  ifnull(so.StockOutId, 0) AS StockOutId
  FROM  tbl_inventory iv 
  Inner Join  tbl_parts pt on iv.PartId=pt.PartId 
  Inner Join tbl_parts_item pi on pi.PartItemId=iv.PartItemId
  Left Join tbl_inventory_stockout so on so.InventoryId=iv.InventoryId
  Left Join tbl_warehouse wh on wh.WarehouseId=iv.WarehouseId
  Left Join tbl_warehouse_sublevel1 whs1 on whs1.WarehouseSub1Id=iv.WarehouseSub1Id
  Left Join tbl_warehouse_sublevel2 whs2 on whs2.WarehouseSub2Id=iv.WarehouseSub2Id
  Left Join tbl_warehouse_sublevel3 whs3 on whs3.WarehouseSub3Id=iv.WarehouseSub3Id
  Left Join tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub4Id=iv.WarehouseSub4Id
  where iv.RFIDTagNo IN (${joinedIds})`;


  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
}

Parts.PartstrackingByRFIDTagNosByRoom = (RFIDTagNos, result) => {
  let joinedIds = RFIDTagNos.map(r => `'${r}'`).join(',');

  var query = `SELECT whs4.WarehouseSub4Name,whs4.RowIndex,whs4.ColumnIndex
  FROM  tbl_inventory iv 
  Inner Join  tbl_parts pt on iv.PartId=pt.PartId 
  Inner Join tbl_parts_item pi on pi.PartId=iv.PartId
  Left Join tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub3Id=iv.WarehouseSub3Id
  where iv.RFIDTagNo IN (${joinedIds})`;

  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
}

Parts.checkPartsAvailability = (req, result) => {
  // console.log("req", req);
  var PartNo = String(req.PartNo);
  var partAHRCheck = PartNo.substring(0, 4);
  var partAHRCheckCase = partAHRCheck.toUpperCase();
  if (partAHRCheckCase != "AHR-") {
    PartNo = "AHR-" + PartNo;
  }
  // ifnull(CURCP.CurrencySymbol,CURC.CurrencySymbol)
  var query = `Select P.*,V.VendorName as Manufacturer,P.ManufacturerId,CP.NewPrice as CustomerNewPrice,CP.BaseNewPrice as CustomerBaseNewPrice,CP.CustomerPartNo1, CP.CustomerPartNo2,CUR.CurrencySymbol as PartsPriceSymbol, CURCP.CurrencySymbol as testPriceQ, ifnull(CURCP.CurrencySymbol,CURC.CurrencySymbol) as PriceSymbol, ifnull(CP.LocalCurrencyCode,C.CustomerCurrencyCode) as LocalCurrencyCode  from tbl_parts as P 
    LEFT JOIN  tbl_vendors as V ON V.VendorId = P.ManufacturerId 
    LEFT JOIN tbl_customer_parts as CP ON CP.PartId = P.PartId AND CustomerId = '${req.CustomerId}'
    LEFT JOIN tbl_customers as C ON C.CustomerId = '${req.CustomerId}'
    LEFT JOIN tbl_currencies as CUR ON CUR.CurrencyCode = P.LocalCurrencyCode AND CUR.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURCP ON CURCP.CurrencyCode = CP.LocalCurrencyCode AND CURCP.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURC ON CURC.CurrencyCode = C.CustomerCurrencyCode AND CURC.IsDeleted = 0
    where P.IsDeleted=0 AND IsNewOrRefurbished=2 and P.PartNo='${PartNo}' LIMIT 1`;
  // console.log("query = " + query);
  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
}


Parts.checkMROPartsAvailability = (PartNo, result) => {
  PartNo = String(PartNo);
  var partAHRCheck = PartNo.substring(0, 4);
  var partAHRCheckCase = partAHRCheck.toUpperCase();
  if (partAHRCheckCase == "AHR-") {
    PartNo = PartNo.substring(4, PartNo.length);
  }
  var query = `Select P.*,V.VendorName as Manufacturer,P.ManufacturerId  from tbl_parts as P 
    LEFT JOIN  tbl_vendors as V ON V.VendorId = P.ManufacturerId 
    where P.IsDeleted=0   and P.PartNo='${PartNo}' LIMIT 1`;
  // console.log("query = " + query);
  con.query(query, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
}

Parts.CheckPartsByPartNo = (PartNo, result) => {
  con.query(`Select PartId,PartNo from ahoms.tbl_parts where IsDeleted=0 and PartNo='${PartNo}';`, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
}
Parts.PartPriceByPartIdQuery = (PartId) => {
  var sql = `Select * from tbl_parts where IsDeleted=0 and PartId='${PartId}'`;
  // console.log(sql);
  return sql;
};


Parts.GetPONAndExchange = (CustomerId, PartId) => {
  var sql_parts = `SELECT p.PartNo, IFNULL((cp.NewPrice* EXR.ExchangeRate),(p.Price* EXRP.ExchangeRate)) as PON , C.CustomerCurrencyCode,SETT.DefaultCurrency,EXRB.ExchangeRate
                   from tbl_parts p
                   LEFT JOIN tbl_customer_parts cp ON cp.PartId = p.PartId AND cp.CustomerId = ${CustomerId}
                   LEFT JOIN  tbl_customers as C ON C.CustomerId =  ${CustomerId} AND C.IsDeleted = 0 
                   LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = cp.LocalCurrencyCode AND EXR.TargetCurrencyCode = C.CustomerCurrencyCode AND  (CURDATE() between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
                   LEFT JOIN tbl_currency_exchange_rate as EXRP ON EXRP.SourceCurrencyCode = p.LocalCurrencyCode AND EXRP.TargetCurrencyCode = C.CustomerCurrencyCode AND  (CURDATE() between EXRP.FromDate and EXRP.ToDate) AND EXRP.IsDeleted = 0 
                   LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
                  LEFT JOIN tbl_currency_exchange_rate as EXRB ON EXRB.SourceCurrencyCode = C.CustomerCurrencyCode AND EXRB.TargetCurrencyCode = SETT.DefaultCurrency AND  (CURDATE() between EXRB.FromDate and EXRB.ToDate) AND EXRB.IsDeleted = 0
                   where p.IsDeleted=0 and p.PartId=${PartId}`;
  return sql_parts;
};

Parts.trackPart = (body, result) => {
  let query = ""
  if (body.PartNo && body.SerialNo) {
    query = `Select p.PartId, p.PartNo, pi.SerialNo, 
    wh.WarehouseId, wh.WarehouseName, 
    whs1.WarehouseSub1Id, whs1.WarehouseSub1Name, 
    whs2.WarehouseSub2Id, whs2.WarehouseSub2Name, 
    whs3.WarehouseSub3Id, whs3.WarehouseSub3Name, whs3.WarehouseSub3LayoutImage, 
    whs4.WarehouseSub4Id, whs4.WarehouseSub4Name, whs4.RowIndex, whs4.ColumnIndex
    FROM ahoms.tbl_parts_item pi
    LEFT JOIN tbl_parts p ON p.PartId = pi.PartId
    LEFT JOIN tbl_warehouse wh on wh.WarehouseId=pi.WarehouseId
    LEFT JOIN tbl_warehouse_sublevel1 whs1 on whs1.WarehouseSub1Id=pi.WarehouseSub1Id
    LEFT JOIN tbl_warehouse_sublevel2 whs2 on whs2.WarehouseSub2Id=pi.WarehouseSub2Id
    LEFT JOIN tbl_warehouse_sublevel3 whs3 on whs3.WarehouseSub3Id=pi.WarehouseSub3Id
    LEFT JOIN tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub4Id=pi.WarehouseSub4Id
    where pi.SerialNo='${body.SerialNo}' and p.PartNo='${body.PartNo}'`;
  } else {
    query = `Select p.PartId, p.PartNo, pi.SerialNo, 
    wh.WarehouseId, wh.WarehouseName, 
    whs1.WarehouseSub1Id, whs1.WarehouseSub1Name, 
    whs2.WarehouseSub2Id, whs2.WarehouseSub2Name, 
    whs3.WarehouseSub3Id, whs3.WarehouseSub3Name, whs3.WarehouseSub3LayoutImage, 
    whs4.WarehouseSub4Id, whs4.WarehouseSub4Name 
    FROM ahoms.tbl_parts_item pi
    LEFT JOIN tbl_parts p ON p.PartId = pi.PartId
    LEFT JOIN tbl_warehouse wh on wh.WarehouseId=iv.WarehouseId
    LEFT JOIN tbl_warehouse_sublevel1 whs1 on whs1.WarehouseSub1Id=iv.WarehouseSub1Id
    LEFT JOIN tbl_warehouse_sublevel2 whs2 on whs2.WarehouseSub2Id=iv.WarehouseSub2Id
    LEFT JOIN tbl_warehouse_sublevel3 whs3 on whs3.WarehouseSub3Id=iv.WarehouseSub3Id
    LEFT JOIN tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub4Id=iv.WarehouseSub4Id
    where pi.RFIDTagNo='${body.RFID}'`;
  }

  con.query(query, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }

    if (res.length > 0) {
      return result(null, res[0]);
    }

    result("Part not found!", null);

  });
}

Parts.nonLocationList = (result) => {
  let query = "";
  query = `SELECT ISI.StockInId,ISI.RRId, ISI.RRNo ,P.PartNo,ISI.RFIDTagNo,
  PI.SerialNo,PI.PartItemId,PI.PartId,PI.IsNew,PI.SellingPrice,PI.Quantity,PI.IsAvailable,PI.Status,PI.WarehouseId,PI.WarehouseSub1Id,
  PI.WarehouseSub2Id,PI.WarehouseSub3Id,PI.WarehouseSub4Id,DATE_FORMAT(PI.Created,'%Y-%m-%d %H:%i:%s') AS Created, DATE_FORMAT(PI.Modified,'%Y-%m-%d %H:%i:%s') AS Modified,
  PI.CreatedBy,PI.ModifiedBy,ISI.inventoryLocationAvailable,ISI.InventoryId,ISI.RFIDEmployeeNo
  FROM tbl_inventory_stockin ISI
  LEFT JOIN tbl_parts P ON ISI.PartId=P.PartId
  LEFT JOIN tbl_parts_item PI ON ISI.PartItemId=PI.PartItemId 
  where ISI.IsDeleted=0 AND ISI.inventoryLocationAvailable=0 Order By ISI.StockInId`;
  con.query(query, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }

    if (res.length > 0) {
      return result(null, res);
    }

    result("No records found!", null);

  });
}
// Parts.employeeIdUpdate = (body, result) => {

// };

Parts.ecommerceProductList = (Obj, result) => {
  // console.log(Obj);
  var CustomerId = Obj.CustomerId ? Obj.CustomerId : '10950';
  var query = "";

  // query = `Select P.PartId, P.PartNo, P.Description,CONCAT(CURDS.CurrencySymbol,' ',P.Price) as Price1,
  // CONCAT(CURC.CurrencySymbol,' ',FORMAT(ROUND(ifnull(Ifnull(P.Price,0)*Ifnull(EXR.ExchangeRate,1),0),2),2)) as Price,
  // PI.ImagePath as image, c.CustomerCurrencyCode as CustomerCurrencyCode, P.BaseCurrencyCode, P.Price as OriginalPrice,
  // ROUND(ifnull(Ifnull(P.Price,0)*Ifnull(EXR.ExchangeRate,1),0),2) as ConvertedPrice, EXR.ExchangeRate, c.CreatedByLocation, c.CustomerId,
  // abb.AddressId as CustomerBillToId, abs.AddressId as CustomerShipToId,P.ShopTotalQuantity,P.ShopCurrentQuantity,P.APNNo `;

  // LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = P.LocalCurrencyCode AND EXR.TargetCurrencyCode = c.CustomerCurrencyCode AND  (DATE(NOW()) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0

  // query = `Select P.PartId, P.PartNo, P.Description,CONCAT(CURDS.CurrencySymbol,' ',P.SellingPrice) as Price1,
  // CONCAT(CURC.CurrencySymbol,' ',FORMAT(ROUND(ifnull(Ifnull(P.SellingPrice,0)*Ifnull(EXR.ExchangeRate,1),0),2),2)) as Price,
  // c.CustomerCurrencyCode as CustomerCurrencyCode, P.BaseCurrencyCode, P.SellingPrice as OriginalPrice,
  // ROUND(ifnull(Ifnull(P.SellingPrice,0)*Ifnull(EXR.ExchangeRate,1),0),2) as ConvertedPrice, EXR.ExchangeRate, c.CreatedByLocation, c.CustomerId,
  // abb.AddressId as CustomerBillToId, abs.AddressId as CustomerShipToId,P.ShopTotalQuantity,P.ShopCurrentQuantity,P.APNNo,CON.VatTaxPercentage,c.CustomerVATNo,P.SellingCurrencyCode,
  // (SELECT ImagePath FROM tbl_parts_images WHERE PartId = P.PartId ORDER BY PartImageId ASC LIMIT 1) as image  `;
  // query = query + ` from tbl_parts as P
  // LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
  // LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = P.SellingCurrencyCode AND CUR.IsDeleted = 0
  // LEFT JOIN tbl_currencies as CURDS  ON CURDS.CurrencyCode = P.BuyingCurrencyCode AND CURDS.IsDeleted = 0
  // LEFT JOIN tbl_customers c on c.CustomerId='${CustomerId}'
  // LEFT JOIN tbl_currencies as CURC  ON CURC.CurrencyCode = c.CustomerCurrencyCode AND CURC.IsDeleted = 0
  // LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = P.SellingCurrencyCode AND EXR.TargetCurrencyCode = c.CustomerCurrencyCode AND  (DATE(NOW()) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  // LEFT JOIN tbl_countries as CON  ON CON.CountryId = c.CustomerLocation AND CON.IsDeleted = 0
  // LEFT JOIN tbl_address_book abb on abb.IdentityType = 1 AND abb.IsBillingAddress = 1  AND abb.IdentityId = '${CustomerId}'
  // LEFT JOIN tbl_address_book abs on abs.IdentityType = 1 AND abs.IsShippingAddress = 1 AND abs.IdentityId = '${CustomerId}'
  // WHERE P.IsDeleted = 0 AND P.Status = 1 AND IsEcommerceProduct = 1`;

  query = `Select PP.ShopPartItemId,P.PartId, P.PartNo,CONCAT(CURDS.CurrencySymbol,' ',PP.SellingPrice) as Price1,
  CONCAT(CURC.CurrencySymbol,' ',FORMAT(ROUND(ifnull(Ifnull(PP.SellingPrice,0)*Ifnull(EXR.ExchangeRate,1),0),2),2)) as Price,
  c.CustomerCurrencyCode as CustomerCurrencyCode, P.BaseCurrencyCode, PP.SellingPrice as OriginalPrice,
  ROUND(ifnull(Ifnull(PP.SellingPrice,0)*Ifnull(EXR.ExchangeRate,1),0),2) as ConvertedPrice, EXR.ExchangeRate, c.CreatedByLocation, c.CustomerId,
  abb.AddressId as CustomerBillToId, abs.AddressId as CustomerShipToId,PP.ShopTotalQuantity,PP.ShopCurrentQuantity,PP.APNNo,CON.VatTaxPercentage,c.CustomerVATNo,PP.SellingCurrencyCode,PP.SerialNo,PP.LocationId,
  ifnull((SELECT ImagePath FROM tbl_parts_images WHERE PartId = P.PartId AND ShopPartItemId = PP.ShopPartItemId AND IsDeleted=0 ORDER BY PartImageId ASC LIMIT 1),
  (SELECT ImagePath FROM tbl_parts_images WHERE PartId = P.PartId AND ShopPartItemId = 0 AND IsDeleted=0 ORDER BY PartImageId ASC LIMIT 1)) as image,
  PP.PartItemType,PP.PartItemDelivery,
  IF(PP.PartItemDescription IS NULL or PP.PartItemDescription = '', P.Description, PP.PartItemDescription) as Description,
  case PP.PartItemType
  WHEN 1 THEN '${Constants.array_part_type[1]}'
  WHEN 2 THEN '${Constants.array_part_type[2]}'
  WHEN 3 THEN '${Constants.array_part_type[3]}'
  WHEN 4 THEN '${Constants.array_part_type[4]}'
  WHEN 5 THEN '${Constants.array_part_type[5]}'
  ELSE '-'
  end PartItemTypeName   `;
  query = query + ` from tbl_parts as P
  INNER JOIN tbl_parts_item_shop as PP ON PP.PartId = P.PartId AND PP.IsDeleted = 0 
  LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = PP.SellingCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURDS  ON CURDS.CurrencyCode = PP.BuyingCurrencyCode AND CURDS.IsDeleted = 0
  LEFT JOIN tbl_customers c on c.CustomerId='${CustomerId}'
  LEFT JOIN tbl_currencies as CURC  ON CURC.CurrencyCode = c.CustomerCurrencyCode AND CURC.IsDeleted = 0
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = PP.SellingCurrencyCode AND EXR.TargetCurrencyCode = c.CustomerCurrencyCode AND  (DATE(NOW()) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = c.CustomerLocation AND CON.IsDeleted = 0
  LEFT JOIN tbl_address_book abb on abb.IdentityType = 1 AND abb.IsBillingAddress = 1  AND abb.IdentityId = '${CustomerId}'
  LEFT JOIN tbl_address_book abs on abs.IdentityType = 1 AND abs.IsShippingAddress = 1 AND abs.IdentityId = '${CustomerId}'
  WHERE P.IsDeleted = 0     AND IsEcommerceProduct = 1`;

  if (Obj.PartNo && Obj.PartNo != '') {
    query = query + ` AND P.PartNo LIKE '%${Obj.PartNo}%'`;
    // query = query + ` AND P.PartNo = '${Obj.PartNo}'`;
  }
  if (Obj.APNNo && Obj.APNNo != '') {
    query = query + ` AND PP.APNNo LIKE '%${Obj.APNNo}%' `;
    // query = query + ` AND P.APNNo = '${Obj.APNNo}' `;
  }
  if (Obj.ExcludeOutOfStock && Obj.ExcludeOutOfStock === true) {
    query = query + ` AND PP.ShopCurrentQuantity > 0 `;
    // query = query + ` AND P.APNNo = '${Obj.APNNo}' `;
  }

  // console.log(Obj.ManufacturIds)
  if (Obj.ManufacturIds && Obj.ManufacturIds != '') {
    var MIds = Obj.ManufacturIds.join();

    MIds = "'" + MIds.split(",").join("','") + "'";
    //console.log(MIds);
    query += " AND P.ManufacturerId IN (" + MIds + ") ";
    // query = query + ` AND P.APNNo = '${Obj.APNNo}' `;
  }

  if (Obj.CategoryIds && Obj.CategoryIds != '') {
    var CIds = Obj.CategoryIds.join();

    CIds = "'" + CIds.split(",").join("','") + "'";
    // console.log(CIds);
    query += " AND P.PartCategoryId IN (" + CIds + ") ";
  }
  //console.log(query);
  con.query(query, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }

    if (res.length > 0) {
      return result(null, res);
    }

    result("No records found!", null);

  });
}

Parts.ecommerceProductView = (PartId, CustomerId, ShopPartItemId, result) => {
  // (SELECT ImagePath FROM tbl_parts_images WHERE PartId = P.PartId ORDER BY PartImageId ASC) as images  
  let query = ` `;
  // query = `Select P.PartId, P.PartNo, P.Description,CONCAT(CURDS.CurrencySymbol,' ',P.SellingPrice) as Price1,
  // CONCAT(CURC.CurrencySymbol,' ',FORMAT(ROUND(ifnull(Ifnull(P.SellingPrice,0)*Ifnull(EXR.ExchangeRate,1),0),2),2)) as Price,
  // c.CustomerCurrencyCode as CustomerCurrencyCode, P.BaseCurrencyCode, P.SellingPrice as OriginalPrice,
  // ROUND(ifnull(Ifnull(P.SellingPrice,0)*Ifnull(EXR.ExchangeRate,1),0),2) as ConvertedPrice, EXR.ExchangeRate, c.CreatedByLocation, c.CustomerId,
  // abb.AddressId as CustomerBillToId, abs.AddressId as CustomerShipToId,P.ShopTotalQuantity,P.ShopCurrentQuantity,P.APNNo,CON.VatTaxPercentage,c.CustomerVATNo,P.SellingCurrencyCode`;
  // query = query + ` from tbl_parts as P
  // LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
  // LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = P.SellingCurrencyCode AND CUR.IsDeleted = 0
  // LEFT JOIN tbl_currencies as CURDS  ON CURDS.CurrencyCode = P.BuyingCurrencyCode AND CURDS.IsDeleted = 0
  // LEFT JOIN tbl_customers c on c.CustomerId='${CustomerId}'
  // LEFT JOIN tbl_currencies as CURC  ON CURC.CurrencyCode = c.CustomerCurrencyCode AND CURC.IsDeleted = 0
  // LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = P.SellingCurrencyCode AND EXR.TargetCurrencyCode = c.CustomerCurrencyCode AND  (DATE(NOW()) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  // LEFT JOIN tbl_countries as CON  ON CON.CountryId = c.CustomerLocation AND CON.IsDeleted = 0
  // LEFT JOIN tbl_address_book abb on abb.IdentityType = 1 AND abb.IsBillingAddress = 1  AND abb.IdentityId = '${CustomerId}'
  // LEFT JOIN tbl_address_book abs on abs.IdentityType = 1 AND abs.IsShippingAddress = 1 AND abs.IdentityId = '${CustomerId}'
  // WHERE P.IsDeleted = 0 AND P.Status = 1 AND IsEcommerceProduct = 1 AND P.PartId= '${PartId}'`;
  query = `Select PP.ShopPartItemId, P.PartId, P.PartNo,CONCAT(CURDS.CurrencySymbol,' ',PP.SellingPrice) as Price1,
  CONCAT(CURC.CurrencySymbol,' ',FORMAT(ROUND(ifnull(Ifnull(PP.SellingPrice,0)*Ifnull(EXR.ExchangeRate,1),0),2),2)) as Price,
  c.CustomerCurrencyCode as CustomerCurrencyCode, P.BaseCurrencyCode, PP.SellingPrice as OriginalPrice,
  ROUND(ifnull(Ifnull(PP.SellingPrice,0)*Ifnull(EXR.ExchangeRate,1),0),2) as ConvertedPrice, EXR.ExchangeRate, c.CreatedByLocation, c.CustomerId,
  abb.AddressId as CustomerBillToId, abs.AddressId as CustomerShipToId,PP.ShopTotalQuantity,PP.ShopCurrentQuantity,PP.APNNo,CON.VatTaxPercentage,c.CustomerVATNo,PP.SellingCurrencyCode,PP.LocationId,
  PP.PartItemType,PP.PartItemDelivery,
  IF(PP.PartItemDescription IS NULL or PP.PartItemDescription = '', P.Description, PP.PartItemDescription) as Description,
  P.ManufacturerPartNo, V.VendorName as Manufacturer,CAT.PartCategoryName,
  case PP.PartItemType
  WHEN 1 THEN '${Constants.array_part_type[1]}'
  WHEN 2 THEN '${Constants.array_part_type[2]}'
  WHEN 3 THEN '${Constants.array_part_type[3]}'
  WHEN 4 THEN '${Constants.array_part_type[4]}'
  WHEN 5 THEN '${Constants.array_part_type[5]}'
  ELSE '-'
  end PartItemTypeName`;
  query = query + ` from tbl_parts as P
  Left JOIN tbl_parts_item_shop as PP ON PP.PartId = P.PartId AND PP.IsDeleted = 0 
  LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = PP.SellingCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURDS  ON CURDS.CurrencyCode = PP.BuyingCurrencyCode AND CURDS.IsDeleted = 0
  LEFT JOIN tbl_customers c on c.CustomerId='${CustomerId}'
  LEFT JOIN tbl_currencies as CURC  ON CURC.CurrencyCode = c.CustomerCurrencyCode AND CURC.IsDeleted = 0
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = PP.SellingCurrencyCode AND EXR.TargetCurrencyCode = c.CustomerCurrencyCode AND  (DATE(NOW()) between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = c.CustomerLocation AND CON.IsDeleted = 0
  LEFT JOIN tbl_address_book abb on abb.IdentityType = 1 AND abb.IsBillingAddress = 1  AND abb.IdentityId = '${CustomerId}'
  LEFT JOIN tbl_address_book abs on abs.IdentityType = 1 AND abs.IsShippingAddress = 1 AND abs.IdentityId = '${CustomerId}'

 LEFT JOIN tbl_part_category as CAT  ON CAT.PartCategoryId = P.PartCategoryId AND CAT.IsDeleted = 0
  LEFT JOIN tbl_vendors as V  ON V.VendorId = P.ManufacturerId AND V.IsDeleted = 0

  



  WHERE P.IsDeleted = 0   AND IsEcommerceProduct = 1 AND P.PartId= '${PartId}' AND PP.PartId= '${PartId}' AND PP.ShopPartItemId= '${ShopPartItemId}'`;
  let query1 = PartImages.ViewPartImagesQueryByShopPartItemId(PartId, ShopPartItemId);
  let query2 = PartImages.ViewPartImagesQueryByShopPartItemId(PartId, 0);
  //console.log(query);


  async.parallel([
    function (result) { con.query(query, result); },
    function (result) { con.query(query1, result); },
    function (result) { con.query(query2, result); },
  ], function (err, results) {
    if (err) {
      result(err, null);
      return;
    }
    // console.log(results[1][0]);
    // console.log(results[2][0]);
    results[0][0][0].images = results[1][0].length > 0 ? results[1][0] : results[2][0];
    result(null, results[0][0][0]);
    return;
  });
  // con.query(query, (err, res) => {
  //   if (err) {
  //     result(err, null);
  //     return;
  //   }
  //   console.log(res[0]);
  //   res[0][0].images = res[1][0];
  //   result(null, res[0][0]);
  //   return;
  // });
}

Parts.checkPartId = (reqBody, result) => {
  // var PartId = req.PartId;
  let obj = new Parts(reqBody);
  var query = `Select P.* from tbl_parts as P 
  where P.IsDeleted=0 and P.PartId='${obj.PartId}' LIMIT 1`;
  // console.log("query = " + query);
  con.query(query, (err, res) => {
    if (err) {
      return result(err, null);
    } else {
      // console.log(res[0].PartId);
      if (res[0].IsEcommerceProduct == 1) {
        var data = {
          Status: 0,
          PartId: res[0].PartId,
          PartNo: res[0].PartNo
        }
        return result(null, data);
      } else {
        var updateQuery = `Update tbl_parts set IsEcommerceProduct = 1 , ModifiedBy='${obj.ModifiedBy}',Modified='${obj.Modified}'  WHERE PartId=${obj.PartId}`;
        con.query(updateQuery, (err1, res1) => {
          if (err1) {
            return result(err1, null);
          } else {
            var data = {
              Status: 1,
              PartId: obj.PartId,
              PartNo: res[0].PartNo
            }
            return result(null, data);
          }
        });
      }

    }

  });
}


module.exports = Parts;
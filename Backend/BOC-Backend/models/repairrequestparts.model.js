/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const { escapeSqlValues } = require("../helper/common.function.js");

const RRPartsModel = function (objRRParts) {
  this.RRId = objRRParts.RRId;
  this.PartId = objRRParts.PartId;
  this.PartNo = objRRParts.PartNo;
  this.CustomerPartNo1 = objRRParts.CustomerPartNo1;
  this.CustomerPartNo2 = objRRParts.CustomerPartNo2 ? objRRParts.CustomerPartNo2 : '';
  this.Description = objRRParts.Description;
  this.Manufacturer = objRRParts.Manufacturer ? objRRParts.Manufacturer : '';
  this.ManufacturerPartNo = objRRParts.ManufacturerPartNo;
  this.SerialNo = objRRParts.SerialNo;
  this.LeadTime = objRRParts.LeadTime ? objRRParts.LeadTime : '';
  this.Quantity = objRRParts.Quantity ? objRRParts.Quantity : 1;
  this.Rate = objRRParts.Rate ? objRRParts.Rate : 0;
  this.Price = objRRParts.Price ? objRRParts.Price : 0;
  this.WarrantyStartDate = objRRParts.WarrantyStartDate;
  this.WarrantyEndDate = objRRParts.WarrantyEndDate;
  this.WarrantyActivatedDate = objRRParts.WarrantyActivatedDate;
  this.WarrantyActivatedBy = objRRParts.WarrantyActivatedBy;
  this.WarrantyTrigger = objRRParts.WarrantyTrigger;
  this.WarrantyPeriod = objRRParts.WarrantyPeriod;
  this.RRPartsId = objRRParts.RRPartsId;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objRRParts.authuser && objRRParts.authuser.UserId) ? objRRParts.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objRRParts.authuser && objRRParts.authuser.UserId) ? objRRParts.authuser.UserId : TokenUserId;
  this.RRParts = objRRParts.RRParts;
};

RRPartsModel.CreateRRParts = (RRId, RRParts, result) => {
  let sql = [];
  let currentLength = 0;
  for (let objRRParts of RRParts) {
    currentLength += 1;
    objRRParts = escapeSqlValues(objRRParts);
    let partsObj = new RRPartsModel(objRRParts);
    var checkSql = `SELECT * FROM tbl_repair_request_parts WHERE PartId = ${partsObj.PartId} AND RRId = ${RRId}`;

    con.query(checkSql, (err, res) => {
      if (err) {
        //console.log("error: ", err);
        result(err, null);
        return;
      }


      if (res.length <= 0) {
        sql.push(`insert into tbl_repair_request_parts(RRId,PartId,PartNo,CustomerPartNo1,
          CustomerPartNo2,Description, Manufacturer, ManufacturerPartNo, 
          SerialNo, LeadTime, Quantity, Rate, Price,  Created, CreatedBy)
           values(${RRId},${partsObj.PartId},'${partsObj.PartNo}','${partsObj.CustomerPartNo1}',
           '${partsObj.CustomerPartNo2}','${partsObj.Description}','${partsObj.Manufacturer}','${partsObj.ManufacturerPartNo}',
           '${partsObj.SerialNo}','${partsObj.LeadTime}','${partsObj.Quantity}','${partsObj.Rate}','${partsObj.Price}','${partsObj.Created}','${partsObj.CreatedBy}')`);
      } else {
        sql.push(`Update tbl_repair_request_parts set PartNo='${partsObj.PartNo}',CustomerPartNo1='${partsObj.CustomerPartNo1}',CustomerPartNo2='${partsObj.CustomerPartNo2}',Description='${partsObj.Description}', Manufacturer='${partsObj.Manufacturer}', ManufacturerPartNo='${partsObj.ManufacturerPartNo}', SerialNo='${partsObj.SerialNo}', LeadTime='${partsObj.LeadTime}', Quantity='${partsObj.Quantity}', Rate='${partsObj.Rate}', Price='${partsObj.Price}',  Modified='${partsObj.Modified}', Modifiedby='${partsObj.ModifiedBy}' where RRPartsId='${res[0].RRPartsId}' and RRId='${partsObj.RRId}'`);
      }

      if (currentLength == RRParts.length) {
        async.parallel(sql.map(s => result => { con.query(s, result) }),
          (err, res) => {
            if (err)
              return result(err, null);
            result(null, res[0][0].insertId);
          }
        )
      }
    });
  }



  // var sql = `insert into tbl_repair_request_parts(RRId,PartId,PartNo,CustomerPartNo1,
  //   CustomerPartNo2,Description, Manufacturer, ManufacturerPartNo, 
  //   SerialNo, LeadTime, Quantity, Rate, Price,  Created, CreatedBy)
  //    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  // for (let partsObj of RRParts) {

  //   let objRRParts = new RRPartsModel(partsObj);
  //   var values = [RRId, objRRParts.PartId, objRRParts.PartNo
  //     , objRRParts.CustomerPartNo1
  //     , objRRParts.CustomerPartNo2, objRRParts.Description, objRRParts.Manufacturer
  //     , objRRParts.ManufacturerPartNo, objRRParts.SerialNo
  //     , objRRParts.LeadTime, objRRParts.Quantity, objRRParts.Price, objRRParts.Price
  //     , objRRParts.Created
  //     , objRRParts.CreatedBy];
  // }
  // console.log("Logs :" + values);
  // con.query(sql, values, (err, res) => {
  //   if (err) {
  //     console.log("error: ", err);
  //     result(err, null);
  //     return;
  //   }
  //   result(null, { id: res.insertId });
  //   return;
  // });
};


RRPartsModel.CreateRRPartsFromMobApp = (rrbody, result) => {
  var sql = `insert into tbl_repair_request_parts(RRId,PartId,PartNo, SerialNo,Description,  Quantity, Rate, Price,  Created, CreatedBy) 
    values(?,?,?,?,?,?,?,?,?,?)`;

  let objRRParts = new RRPartsModel(rrbody);
  let Price = objRRParts.Rate * objRRParts.Quantity;
  var RRDescription = rrbody.RRDescription ? rrbody.RRDescription : '';
  var values = [rrbody.RRId, objRRParts.PartId, objRRParts.PartNo, objRRParts.SerialNo, RRDescription, objRRParts.Quantity, objRRParts.Rate, Price, objRRParts.Created, objRRParts.CreatedBy];

  //console.log("Parts query  :" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;

  });
};




RRPartsModel.UpdateVendorOfPartsByRRId = (RRParts, result) => {

  var sql = ``;

  sql = `UPDATE tbl_repair_request_parts  SET   VendorId=?,Status=?  WHERE RRID = ?`;

  var values = [
    RRParts.VendorId, RRParts.Status, RRParts.RRId
  ]
  //console.log(sql);
  con.query(sql, values, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: RRParts.RRId, ...RRParts });
    return;
  }
  );

};

// Update Parts


RRPartsModel.UpdateRRParts = (RRParts, result) => {

  var sql = `Update tbl_repair_request_parts set PartNo=?,CustomerPartNo1=?,CustomerPartNo2=?,Description=? , Manufacturer=?, ManufacturerPartNo=?, SerialNo=?, LeadTime=?, Quantity=?, Rate=?, Price=?,  Modified=?, Modifiedby=? where RRPartsId=? and RRId=?`;
  var rRate = RRParts.RRParts.Rate ? RRParts.RRParts.Rate : 0;
  const Price = rRate * RRParts.RRParts.Quantity;
  var values = [RRParts.RRParts.PartNo
    , RRParts.RRParts.CustomerPartNo1
    , RRParts.RRParts.CustomerPartNo2, RRParts.RRParts.Description, RRParts.RRParts.Manufacturer
    , RRParts.RRParts.ManufacturerPartNo, RRParts.RRParts.SerialNo
    , RRParts.RRParts.LeadTime, RRParts.RRParts.Quantity, rRate, Price
    , cDateTime.getDateTime()
    , RRParts.ModifiedBy, RRParts.RRParts.RRPartsId, RRParts.RRId]
  //console.log("Logs :" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: RRParts.RRParts.PartNo, ...RRParts });
    return;

  });
};


RRPartsModel.UpdateRRPartsStep2 = (ReqBody, result) => {
  var obj = new RRPartsModel(ReqBody.RRParts);
  var values = [obj.LeadTime, obj.CustomerPartNo1, obj.CustomerPartNo2, obj.Modified, obj.ModifiedBy, obj.RRPartsId];
  var sql = `Update tbl_repair_request_parts set LeadTime=?,CustomerPartNo1=?,CustomerPartNo2=?,Modified=?,ModifiedBy=? where RRPartsId=?`;
  //console.log("sql = " + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId });
    return;

  });
};


RRPartsModel.ViewRRPartsById = (ObjBody, result) => {
  var sql = `Select 
  RRPartsId,RRId,PartId,PartNo,CustomerPartNo1,CustomerPartNo2,Description,Manufacturer,ManufacturerPartNo,SerialNo,LeadTime,Quantity,Rate,Price,V.VendorName ,GS.TaxPercent, V.VendorName as ManufacturerName,
  V.VendorCurrencyCode,CUR.CurrencySymbol,CON.VatTaxPercentage,V.VendorLocation,DefaultCurrency,EXR.ExchangeRate ,V.IsFlatRateRepair
  from tbl_repair_request_parts as P 
  LEFT JOIN tbl_vendors as V ON V.VendorId = ${ObjBody.VendorId}
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = V.VendorCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = V.VendorLocation AND CON.IsDeleted = 0
  LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
  LEFT JOIN tbl_currency_exchange_rate as EXR ON EXR.SourceCurrencyCode = V.VendorCurrencyCode AND EXR.TargetCurrencyCode = GS.DefaultCurrency AND  (CURDATE() between EXR.FromDate and EXR.ToDate) AND EXR.IsDeleted = 0 
  where P.IsDeleted=0 and RRId=${ObjBody.RRId}`;
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
}

RRPartsModel.DeleteRRPartsQuery = (RRId) => {
  var RRPartsObj = new RRPartsModel({ RRId: RRId });
  var sql = `UPDATE tbl_repair_request_parts SET IsDeleted=1,Modified='${RRPartsObj.Modified}',ModifiedBy='${RRPartsObj.ModifiedBy}' WHERE IsDeleted = 0 AND RRId>0 AND RRId=${RRPartsObj.RRId}`;
  return sql;
}


RRPartsModel.ViewRRParts = (RRId) => {
  var sql = `Select 
  RRP.RRPartsId,RRP.RRId,RRP.PartId,RRP.PartNo,RRP.CustomerPartNo1,RRP.CustomerPartNo2,
  RRP.Description,RRP.Manufacturer,RRP.ManufacturerPartNo,
  RRP.SerialNo,RRP.LeadTime,RRP.Quantity,RRP.Rate,RRP.Price, V.VendorName as ManufacturerName,
  P.APNNo,P.VendorId,P.IsEcommerceProduct,P.PartCategoryId,P.BuyingPrice, P.SellingPrice, P.SellingCurrencyCode   
  from tbl_repair_request_parts as RRP
  LEFT JOIN tbl_parts as P ON P.PartId = RRP.PartId
  LEFT JOIN tbl_vendors as V ON V.VendorId = RRP.Manufacturer
  where RRP.IsDeleted=0 and RRP.RRId=${RRId}`;
  return sql;
}

RRPartsModel.BulkShipRRParts = (BulkShipId) => {
  var sql = `Select rr.RRNo,
  RRP.RRPartsId,RRP.RRId,RRP.PartId,RRP.PartNo,RRP.CustomerPartNo1,RRP.CustomerPartNo2,
  RRP.Description,RRP.Manufacturer,RRP.ManufacturerPartNo,
  RRP.SerialNo,RRP.LeadTime,RRP.Quantity,RRP.Rate,RRP.Price, V.VendorName as ManufacturerName, rr.CustomerPONo as RRCustomerPONo
  from tbl_repair_request_parts as RRP
  LEFT JOIN tbl_repair_request as rr ON rr.RRId = RRP.RRId
  LEFT JOIN tbl_vendors as V ON V.VendorId = RRP.Manufacturer
  where RRP.IsDeleted=0 and RRP.RRId In(Select RRId From tbl_repair_request_bulk_shipping_log where BulkShipId=${BulkShipId})`;
  // console.log(sql);
  return sql;
}


RRPartsModel.ViewRRPartsByIdQuery = (RRId) => {
  var sql = `Select 
  RRP.RRPartsId,RRP.RRId,RRP.PartId,RRP.PartNo,RRP.CustomerPartNo1,RRP.CustomerPartNo2,RRP.Description,RRP.Manufacturer,RRP.ManufacturerPartNo,RRP.SerialNo,RRP.LeadTime,RRP.Quantity,RRP.Rate,RRP.Price, V.VendorName as ManufacturerName     
  from tbl_repair_request_parts as RRP
  LEFT JOIN tbl_vendors as V ON V.VendorId = RRP.Manufacturer
  where RRP.IsDeleted=0  and RRP.RRId=${RRId}`;
  return sql;
}

module.exports = RRPartsModel;
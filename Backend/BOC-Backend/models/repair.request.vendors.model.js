/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var cDateTime = require("../utils/generic.js");
const RRVendorParts = require("./repair.request.vendor.parts.model.js");
const RRPartsModel = require("../models/repairrequestparts.model.js");
var async = require('async');




const RRVendors = function (objRRVendors) {
  this.RRVendorId = objRRVendors.RRVendorId;
  this.RRId = objRRVendors.RRId ? objRRVendors.RRId : 0;
  this.MROId = objRRVendors.MROId ? objRRVendors.MROId : 0;
  this.VendorId = objRRVendors.VendorId ? objRRVendors.VendorId : 0;
  this.VendorRefNo = objRRVendors.VendorRefNo ? objRRVendors.VendorRefNo : '';
  this.VendorRefAttachment = objRRVendors.VendorRefAttachment ? objRRVendors.VendorRefAttachment : '';
  this.RouteCause = objRRVendors.RouteCause ? objRRVendors.RouteCause : '';
  this.SubTotal = objRRVendors.SubTotal ? objRRVendors.SubTotal : 0;
  this.AdditionalCharge = objRRVendors.AdditionalCharge ? objRRVendors.AdditionalCharge : 0;
  this.TaxPercent = objRRVendors.TaxPercent ? objRRVendors.TaxPercent : 0;
  this.TotalTax = objRRVendors.TotalTax ? objRRVendors.TotalTax : 0;
  this.Discount = objRRVendors.Discount ? objRRVendors.Discount : 0;
  this.Shipping = objRRVendors.Shipping ? objRRVendors.Shipping : 0;
  this.GrandTotal = objRRVendors.GrandTotal ? objRRVendors.GrandTotal : 0;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objRRVendors.authuser && objRRVendors.authuser.UserId) ? objRRVendors.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objRRVendors.authuser && objRRVendors.authuser.UserId) ? objRRVendors.authuser.UserId : TokenUserId;
  this.Status = objRRVendors.Status ? objRRVendors.Status : 0;
  this.StatusBeforeNotRepairable = objRRVendors.StatusBeforeNotRepairable ? objRRVendors.StatusBeforeNotRepairable : 0;
  this.VendorsList = objRRVendors.VendorsList;
  this.VendorPartsList = objRRVendors.VendorPartsList;
  this.LocalCurrencyCode = objRRVendors.LocalCurrencyCode ? objRRVendors.LocalCurrencyCode : '';
  this.ExchangeRate = objRRVendors.ExchangeRate ? objRRVendors.ExchangeRate : 0;
  this.BaseCurrencyCode = objRRVendors.BaseCurrencyCode ? objRRVendors.BaseCurrencyCode : '';
  this.BaseGrandTotal = objRRVendors.BaseGrandTotal ? objRRVendors.BaseGrandTotal : 0;
  this.VendorShipIdLocked = objRRVendors.VendorShipIdLocked ? objRRVendors.VendorShipIdLocked : 0;

  this.LeadTime = objRRVendors.LeadTime ? objRRVendors.LeadTime : 0;
  this.WarrantyPeriod = objRRVendors.WarrantyPeriod ? objRRVendors.WarrantyPeriod : 0;
  this.RejectedStatus = objRRVendors.RejectedStatus ? objRRVendors.RejectedStatus : 0;
  this.IsDirectedVendor = objRRVendors.IsDirectedVendor ? objRRVendors.IsDirectedVendor : 0;
  this.IsFlatRateRepair = objRRVendors.IsFlatRateRepair ? objRRVendors.IsFlatRateRepair : 0;
}



RRVendors.CreateRRVendors = (RRVendors, result) => {

  var sql = `insert into  tbl_repair_request_vendors
    (RRId, MROId, VendorId,VendorRefAttachment,VendorRefNo,SubTotal,AdditionalCharge,TaxPercent,GrandTotal,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal,LeadTime,WarrantyPeriod,RouteCause,Created,CreatedBy,Status,IsDirectedVendor,IsFlatRateRepair)
    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [RRVendors.RRId, RRVendors.MROId, RRVendors.VendorId, RRVendors.VendorRefAttachment, RRVendors.VendorRefNo, RRVendors.SubTotal, RRVendors.AdditionalCharge, RRVendors.TaxPercent, RRVendors.GrandTotal,
  RRVendors.LocalCurrencyCode, RRVendors.ExchangeRate, RRVendors.BaseCurrencyCode, RRVendors.BaseGrandTotal, RRVendors.LeadTime, RRVendors.WarrantyPeriod, RRVendors.RouteCause, RRVendors.Created, RRVendors.CreatedBy, RRVendors.Status,
  RRVendors.IsDirectedVendor, RRVendors.IsFlatRateRepair]
  // console.log("Logs :" + sql);
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    }
    result(null, { RRVendorId: res.insertId });
  });
};


RRVendors.UpdateRRVendors = (RRVendors1, result) => {
  // if(RRVendors.WarrantyPeriod=="" || RRVendors.WarrantyPeriod==null)
  // {
  //   RRVendors.WarrantyPeriod="0";
  // }
  // if(RRVendors.VendorsList.WarrantyPeriod=="" || RRVendors.VendorsList.WarrantyPeriod==null)
  // {
  //   RRVendors.VendorsList.WarrantyPeriod="0";
  // }
  // console.log(RRVendors1);
  //console.log(RRVendors1.ExchangeRate);
  var val = new RRVendors(RRVendors1.VendorsList);
  // console.log(val);
  // var sql = `Update  tbl_repair_request_vendors set
  //   VendorRefAttachment=?,   RouteCause=?, SubTotal=?, AdditionalCharge=?, TaxPercent = ? , TotalTax=?, Discount=?, Shipping=?, GrandTotal=?,
  //    LocalCurrencyCode=?, ExchangeRate=?, BaseCurrencyCode=?, BaseGrandTotal=?,
  //    Modified=?, ModifiedBy=?,LeadTime=?,WarrantyPeriod=? where RRVendorId=? `;
  // var values = [ RRVendors.VendorsList.RouteCause,RRVendors.VendorsList.SubTotal
  //   ,RRVendors.VendorsList.AdditionalCharge,RRVendors.VendorsList.TotalTax,
  //   RRVendors.VendorsList.Discount,RRVendors.VendorsList.Shipping,
  //   RRVendors.VendorsList.GrandTotal ,  RRVendors.Modified,  RRVendors.ModifiedBy,
  //   RRVendors.VendorsList.LeadTime,RRVendors.VendorsList.WarrantyPeriod,
  //   RRVendors.VendorsList.RRVendorId]
  // var values = [
  //   val.VendorRefAttachment,
  //   val.RouteCause, val.SubTotal, val.AdditionalCharge, val.TaxPercent, val.TotalTax,
  //   val.Discount, val.Shipping,
  //   val.GrandTotal, val.LocalCurrencyCode, val.ExchangeRate, val.BaseCurrencyCode, val.BaseGrandTotal, val.Modified, val.ModifiedBy,
  //   val.LeadTime, val.WarrantyPeriod,
  //   val.RRVendorId]
  var RouteCause = val.RouteCause ? val.RouteCause : '';
  var VendorRefAttachment = val.VendorRefAttachment ? val.VendorRefAttachment : '';

  var LocalCurrencyCode = val.LocalCurrencyCode ? val.LocalCurrencyCode : '';
  var ExchangeRate = val.ExchangeRate ? val.ExchangeRate : 0;
  var BaseCurrencyCode = val.BaseCurrencyCode ? val.BaseCurrencyCode : '';
  var BaseGrandTotal = val.BaseGrandTotal ? val.BaseGrandTotal : 0;
  var VendorRefAttachment = val.VendorRefAttachment ? val.VendorRefAttachment : '';
  var sql = `Update  tbl_repair_request_vendors set
    VendorRefAttachment=?, RouteCause=?, SubTotal=?, AdditionalCharge=?, TaxPercent = ? , TotalTax=?, Discount=?, Shipping=?, GrandTotal=?,
     Modified=?, ModifiedBy=?,LeadTime=?,LocalCurrencyCode=?,ExchangeRate=?,BaseCurrencyCode=?,BaseGrandTotal=?,WarrantyPeriod=? where RRVendorId=? `;
  var values = [
    val.VendorRefAttachment,
    val.RouteCause, val.SubTotal, val.AdditionalCharge, val.TaxPercent, val.TotalTax,
    val.Discount, val.Shipping,
    val.GrandTotal, val.Modified, val.ModifiedBy,
    val.LeadTime, RRVendors1.LocalCurrencyCode, RRVendors1.ExchangeRate, RRVendors1.BaseCurrencyCode, RRVendors1.BaseGrandTotal, val.WarrantyPeriod,
    val.RRVendorId]
  // var sql = `Update tbl_repair_request_vendors set VendorRefAttachment='${VendorRefAttachment}',RouteCause='${RouteCause}',SubTotal='${val.SubTotal}',AdditionalCharge='${val.AdditionalCharge}',TaxPercent='${val.TaxPercent}',TotalTax='${val.TotalTax}',Discount='${val.Discount}',Shipping='${val.Shipping}',GrandTotal='${val.GrandTotal}',Modified='${val.Modified}', ModifiedBy='${val.ModifiedBy}',LeadTime='${val.LeadTime}',WarrantyPeriod='${val.WarrantyPeriod}' where RRVendorId='${val.RRVendorId}' `;
  //   console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
  // console.log(sql);
  // console.log(values);
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      return result({ msg: "not updated" }, null);
    }
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    // console.log(res);
    return result(null, { id: RRVendors1.RRId, ...RRVendors1 });
  });
};


RRVendors.AcceptRRVendor = (Reqbody, result) => {
  var Obj = new RRVendors({
    RRVendorId: Reqbody.RRVendorId,
    RRId: Reqbody.RRId
  });
  var sql = `Update  tbl_repair_request_vendors set Status='${Constants.CONST_VENDOR_STATUS_APPROVED}' ,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' where RRVendorId='${Obj.RRVendorId}' `;

  async.parallel([
    function (result) { con.query(sql, result) }
  ],
    function (err, results) {
      if (err) {
        console.log(err);
        return result(err, null);
      }
      if (result.affectedRows == 0) {
        result({ kind: "RRVendorId not_found" }, null);
        return;
      }
      result(null, { id: Obj.RRVendorId, ...Obj });
      return;
    }
  );

};


RRVendors.RejectRRVendor = (Reqbody, result) => {
  var Obj = new RRVendors({ RRVendorId: Reqbody.RRVendorId, RejectedStatus: Reqbody.RejectedStatus });
  var sql = `Update  tbl_repair_request_vendors set Status=?,RejectedStatus=?,Modified=?,ModifiedBy=? where RRVendorId=? `;
  var values = [Constants.CONST_VENDOR_STATUS_REJECTED, Obj.RejectedStatus, Obj.Modified, Obj.ModifiedBy, Obj.RRVendorId];
  //console.log("  " + values)
  con.query(sql, values, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
    return;

  });
};



RRVendors.RRVendorNotRepairableRevert = (Reqbody, result) => {
  var Obj = new RRVendors({ RRId: Reqbody.RRId, VendorId: Reqbody.VendorId, RRVendorId: Reqbody.RRVendorId });
  var sql = `Update  tbl_repair_request_vendors set Status=StatusBeforeNotRepairable,Modified=?,ModifiedBy=? where RRId=? AND VendorId=? AND RRVendorId=?`;
  var values = [Obj.Modified, Obj.ModifiedBy, Obj.RRId, Obj.VendorId, Obj.RRVendorId]
  //console.log("values " + values)
  con.query(sql, values, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
    return;

  });
};



RRVendors.RRVendorNotRepairable = (Reqbody, result) => {
  var StatusBeforeNotRepairable = Reqbody.StatusBeforeNotRepairable ? Reqbody.StatusBeforeNotRepairable : 0
  var Obj = new RRVendors({ RRId: Reqbody.RRId, VendorId: Reqbody.VendorId, StatusBeforeNotRepairable: StatusBeforeNotRepairable });
  var sql = `Update  tbl_repair_request_vendors set Status=?,StatusBeforeNotRepairable=?,Modified=?,ModifiedBy=? where RRId=? AND VendorId=?`;
  var values = [Constants.CONST_VENDOR_STATUS_NOT_REPAIRABLE, Obj.StatusBeforeNotRepairable, Obj.Modified, Obj.ModifiedBy, Obj.RRId, Obj.VendorId]
  //console.log("values " + values)
  con.query(sql, values, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
    return;

  });
};


RRVendors.RRVendorQuoteRejected = (Reqbody, result) => {
  var Obj = new RRVendors({ RRVendorId: Reqbody.RRVendorId });
  var sql = `Update  tbl_repair_request_vendors set Status=?,Modified=?,ModifiedBy=? where RRVendorId=? `;
  var values = [Constants.CONST_VENDOR_STATUS_REJECTED, Obj.Modified, Obj.ModifiedBy, Obj.RRVendorId];
  con.query(sql, values, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
};

RRVendors.RemoveRRVendor = (Reqbody, result) => {
  var Obj = new RRVendors({ RRVendorId: Reqbody.RRVendorId });
  var sql = `Update  tbl_repair_request_vendors set IsDeleted=1,Modified=?,ModifiedBy=? where RRVendorId=? `;
  var values = [Obj.Modified, Obj.ModifiedBy, Obj.RRVendorId];
  con.query(sql, values, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });

};


RRVendors.UpdateRRVendorRefNo = (Reqbody, result) => {
  var Obj = new RRVendors({ RRVendorId: Reqbody.RRVendorId, VendorRefNo: Reqbody.VendorRefNo });
  var sql = `Update  tbl_repair_request_vendors set VendorRefNo=?,Modified=?,ModifiedBy=? where RRVendorId=? `;
  var values = [Obj.VendorRefNo, Obj.Modified, Obj.ModifiedBy, Obj.RRVendorId];
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });

};

RRVendors.LockVendorShipAddr = (Reqbody, result) => {
  var Obj = new RRVendors({ RRVendorId: Reqbody.RRVendorId, VendorShipIdLocked: Reqbody.VendorShipIdLocked });
  var sql = `Update  tbl_repair_request_vendors set VendorShipIdLocked=?,Modified=?,ModifiedBy=? where RRVendorId=? `;
  var values = [Obj.VendorShipIdLocked, Obj.Modified, Obj.ModifiedBy, Obj.RRVendorId];
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    return result(null, res);
  });

};



RRVendors.DeleteRRVendorQuery = (RRId) => {
  var Obj = new RRVendors({ RRId: RRId });
  var sql = `UPDATE tbl_repair_request_vendors SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE IsDeleted = 0 AND RRId>0 AND RRId=${Obj.RRId}`;
  //console.log(sql);
  return sql;
}


RRVendors.ViewRepairRequestVendors = (RRId) => {
  var sql = `Select RRV.RRVendorId,RRV.RRId,RRV.VendorId,
  REPLACE(RRV.VendorRefAttachment,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') VendorRefAttachment,
  SUBSTRING_INDEX(RRV.VendorRefAttachment,'/',-1) as VendorRefName,V.VendorLocation,CUR1.CountryName as VendorCountryName,
  RRV.VendorRefNo,RouteCause,SubTotal,AdditionalCharge,TaxPercent,TotalTax,Discount,Shipping,
  ROUND(ifnull(GrandTotal,0),2) as GrandTotal ,  
  LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,  
   ROUND(ifnull(BaseGrandTotal,0),2) as BaseGrandTotal ,
  RRV.Status,V.VendorName,V.VendorCode, REPLACE(V.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto,RRV.LeadTime,RRV.WarrantyPeriod,
  RRV.RejectedStatus,CASE RRV.RejectedStatus
  WHEN 1 THEN '${Constants.array_vendor_reject_status[1]}'
  WHEN 2 THEN '${Constants.array_vendor_reject_status[2]}'
  WHEN 3 THEN '${Constants.array_vendor_reject_status[3]}' 
  WHEN 4 THEN '${Constants.array_vendor_reject_status[4]}'  
  ELSE '-'	end RejectedStatusName,   
  IF(C.CustomerId>0,'Directed','-') as DirectedVendor,   
  V.IsFlatRateRepair,
  CASE V.IsFlatRateRepair WHEN 1 then "Flat Rate Repair" else "" end as FlatRateRepair,
  CASE VendorTypeId when "B" then "OEM" else "-" end as VendorType, V.UPSShipperNumber as VendorUPSShipperNumber, CUR.CurrencySymbol,V.IsRMARequired,CURV.CurrencySymbol as VendorCurrencySymbol,V.VendorCurrencyCode,
  RRV.VendorShipIdLocked
  from tbl_repair_request_vendors  as RRV 
  LEFT JOIN  tbl_vendors as V ON V.VendorId = RRV.VendorId
  LEFT JOIN  tbl_repair_request as RR ON RR.RRId = RRV.RRId
  LEFT JOIN  tbl_customers as C ON C.CustomerId = RR.CustomerId AND FIND_IN_SET(V.VendorId,C.DirectedVendors)  
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = RRV.LocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURV  ON CURV.CurrencyCode = V.VendorCurrencyCode AND CURV.IsDeleted = 0
  LEFT JOIN tbl_countries CUR1 on CUR1.CountryId=V.VendorLocation
  where RRV.IsDeleted=0 and RRV.RRId=${RRId} `;
  if (global.authuser.IdentityType == Constants.CONST_IDENTITY_TYPE_VENDOR) {
    sql += ` AND RRV.VendorId = ${global.authuser.IdentityId} `;
  }
  sql += `ORDER BY Status ASC`;
  return sql;
}

RRVendors.ViewRepairRequestVendorsById = (RRId, RRVendorId) => {
  return `Select RR.CustomerId,RRV.RRVendorId,V.VendorCurrencyCode,CUR.CurrencySymbol,CON.CountryName as VendorCountryName,
  CON.VatTaxPercentage,V.VendorLocation,RRV.VendorRefAttachment,RRV.VendorRefNo,RRV.RRId,RRV.VendorId,RouteCause,
  SubTotal,AdditionalCharge,TaxPercent,TotalTax,Discount,Shipping,ROUND(ifnull(GrandTotal,0),2) as GrandTotal ,
  LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,ROUND(ifnull(BaseGrandTotal,0),2) as BaseGrandTotal ,RRV.Status,V.VendorName,V.VendorCode ,
  REPLACE(V.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto,
  RRV.LeadTime,RRV.WarrantyPeriod,CURV.CurrencySymbol as VendorCurrencySymbol, RR.CreatedByLocation,CONRR.CountryName as CreatedByLocationName,
  CONRR.CountryCode as CreatedByLocationCode
  from tbl_repair_request_vendors  as RRV 
  LEFT JOIN  tbl_vendors as V ON V.VendorId = RRV.VendorId
  LEFT JOIN  tbl_repair_request as RR ON RR.RRId = RRV.RRId
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = RRV.LocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURV  ON CURV.CurrencyCode = V.VendorCurrencyCode AND CURV.IsDeleted = 0
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = V.VendorLocation AND CON.IsDeleted = 0
  LEFT JOIN tbl_countries as CONRR  ON CONRR.CountryId = RR.CreatedByLocation AND CONRR.IsDeleted = 0
  where RRV.IsDeleted=0 and RRV.RRVendorId=${RRVendorId} and RRV.RRId=${RRId}`;
}


RRVendors.ViewRRVendorInfo = (ReqBody, result) => {
  if (ReqBody.hasOwnProperty('RRId') && ReqBody.hasOwnProperty('RRVendorId')) {
    var sqlVendors = RRVendors.ViewRepairRequestVendorsById(ReqBody.RRId, ReqBody.RRVendorId);
    var sqlVendorsParts = RRVendorParts.ViewVendorPartsById(ReqBody.RRId, ReqBody.RRVendorId);
    var sqlPartsQuery = RRPartsModel.ViewRRPartsByIdQuery(ReqBody.RRId);
    async.parallel([
      function (result) { con.query(sqlVendors, result) },
      function (result) { con.query(sqlVendorsParts, result) },
      function (result) { con.query(sqlPartsQuery, result) }
    ],
      function (err, results) {
        if (err)
          return result(err, null);
        if (results[0][0].length > 0) {


          if (results[1][0].length > 0) {
            for (var x in results[1][0]) {
              var Obj = {
                PartId: results[1][0][x].PartId,
                CustomerId: results[0][0][0].CustomerId
              }
              const Invoice = require("../models/invoice.model.js");
              Invoice.listPartsLPP(Obj, (err, data) => {
                results[1][0][x].LPPInfo = data;
              });

            }
          }
          result(null, { VendorsInfo: results[0][0], VendorPartsInfo: results[1][0], PartInfo: results[2][0] });
          return;
        } else {
          result({ msg: "Vendor not found" }, null);
          return;
        }
      }
    );
  } else {
    result({ msg: "RR and Vendor Id is missing" }, null);
    return;
  }

};


RRVendors.UpdateCalculationByDelete = (Reqbody, result) => {
  var Obj = new RRVendors(Reqbody.res.res[0]);
  //console.log(Obj);
  var sql = `Update  tbl_repair_request_vendors set SubTotal=?,TaxPercent=?,TotalTax=?,GrandTotal=?,LocalCurrencyCode=?,ExchangeRate=?,BaseCurrencyCode=?,BaseGrandTotal=?,Modified=?,ModifiedBy=? where RRVendorId=? `;
  var values = [Obj.SubTotal, Obj.TaxPercent, Obj.TotalTax, Obj.GrandTotal, Obj.LocalCurrencyCode, Obj.ExchangeRate, Obj.BaseCurrencyCode, Obj.BaseGrandTotal, Obj.Modified, Obj.ModifiedBy, Obj.RRVendorId];
  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};
RRVendors.IsExistVendorRefNo = (VendorRefNo, result) => {
  var sql = `Select VendorRefNo,RRVendorId from tbl_repair_request_vendors where IsDeleted=0 and VendorRefNo='${VendorRefNo}'`;
  //console.log("IsExistVendorRefNo=" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
};
RRVendors.SelectRRIdByRRVendorId = (RRVendorId, result) => {
  var sql = `Select RRId,RRVendorId from tbl_repair_request_vendors where IsDeleted=0 and RRVendorId='${RRVendorId}'`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
};

RRVendors.UpdateRRVendorRefNoFromPO = (Reqbody, result) => {
  var Obj = new RRVendors({ RRId: Reqbody.RRId, VendorRefNo: Reqbody.VendorRefNo });
  var sql = `Update  tbl_repair_request_vendors set VendorRefNo=?,Modified=?,ModifiedBy=? where RRId=? and Status=2 `;
  var values = [Obj.VendorRefNo, Obj.Modified, Obj.ModifiedBy, Obj.RRId];
  // console.log("values=" + values)
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });

};



//Below Method for MRO :
RRVendors.AcceptMROVendor = (Reqbody, result) => {
  var Obj = new RRVendors({
    RRVendorId: Reqbody.RRVendorId,
  });
  var sql = `Update  tbl_repair_request_vendors set Status='${Constants.CONST_VENDOR_STATUS_APPROVED}' ,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' where RRVendorId='${Obj.RRVendorId}' `;
  //console.log("AcceptMROVendor=" + sql);
  async.parallel([
    function (result) { con.query(sql, result) }
  ],
    function (err, results) {
      if (err) {
        return result(err, null);
      }
      if (result.affectedRows == 0) {
        result({ kind: "RRVendorId not_found" }, null);
        return;
      }
      result(null, { id: Obj.RRVendorId, ...Obj });
      return;
    });
};
RRVendors.DeleteMROVendorQuery = (MROId) => {
  var Obj = new RRVendors({ MROId: MROId });
  var sql = `UPDATE tbl_repair_request_vendors SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE MROId=${Obj.MROId}`;
  return sql;
}
RRVendors.GetRRVendorsShipLockInfoById = (RRId) => {
  var sql = `SELECT VendorShipIdLocked FROM tbl_repair_request_vendors WHERE IsDeleted = 0 AND RRId=${RRId}`;
  return sql;
}

RRVendors.GetRRCustomerShipLockInfoById = (RRId) => {
  // var sql = `SELECT VendorShipIdLocked FROM tbl_repair_request_vendors WHERE IsDeleted = 0 AND RRId=${RRId}`;
  var sql = `Select CustomerShipIdLocked from tbl_quotes
    where IsDeleted=0 and  RRId=${RRId}`;
  return sql;
}

module.exports = RRVendors;
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

const ConsolidateDetailModel = function (obj) {
  this.ConsolidateInvoiceDetailId = obj.ConsolidateInvoiceDetailId ? obj.ConsolidateInvoiceDetailId : 0;
  this.ConsolidateInvoiceId = obj.ConsolidateInvoiceId ? obj.ConsolidateInvoiceId : 0;
  this.InvoiceId = obj.InvoiceId ? obj.InvoiceId : 0;
  this.InvoiceNo = obj.InvoiceNo ? obj.InvoiceNo : '';
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};
//To create
ConsolidateDetailModel.create = (id, details, result) => {
  var sql = `insert into tbl_invoice_consolidate_detail (ConsolidateInvoiceId,InvoiceId,InvoiceNo,Created,CreatedBy) values`;
  for (let val of details) {
    val = escapeSqlValues(val);
    val = new ConsolidateDetailModel(val);
    // console.log(val)
    sql = sql + `('${id}','${val.InvoiceId}','${val.InvoiceNo}','${val.Created}','${val.CreatedBy}'),`;
  }

  var Query = sql.slice(0, -1);
  // console.log("Query = " + Query);
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
ConsolidateDetailModel.update = (objModel, result) => {
  // console.log(objModel.ConsolidateDetail);
  for (let obj of objModel.ConsolidateDetail) {
    var objs = escapeSqlValues(obj);
    let val = new ConsolidateDetailModel(objs);
    val.ConsolidateInvoiceId = objModel.ConsolidateInvoiceId;
    // console.log(val);
    var sql = ``;
    if (val.ConsolidateInvoiceDetailId && val.ConsolidateInvoiceDetailId != null) {
      sql = `UPDATE tbl_invoice_consolidate_detail SET ConsolidateInvoiceId=?,InvoiceId=?,InvoiceNo=?,Modified=?,ModifiedBy=? WHERE ConsolidateInvoiceDetailId = ?`;
      var values = [
        val.ConsolidateInvoiceId, val.InvoiceId, val.InvoiceNo, val.Modified, val.ModifiedBy, val.ConsolidateInvoiceDetailId
      ];
      // console.log("ConsolidateDetail =" + values);

      con.query(sql, values, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        if (res.affectedRows == 0) {
          result({ msg: "Consolidate Detail not found" }, null);
          return;
        }
      });
    }
    else {
      var sql = `insert into tbl_invoice_consolidate_detail(ConsolidateInvoiceId,InvoiceId,InvoiceNo,Created,CreatedBy) values ('${val.ConsolidateInvoiceId}','${val.InvoiceId}','${val.InvoiceNo}','${val.Created}','${val.CreatedBy}')`;
      // console.log("=" + sql);
      con.query(sql, (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
      });
    }
  }
  result(null, { data: objModel.ConsolidateDetail });
  return;
};
//To remove 
ConsolidateDetailModel.remove = (id, result) => {
  var sql = `UPDATE tbl_invoice_consolidate_detail SET IsDeleted = 1 WHERE ConsolidateInvoiceDetailId = ${id}`;
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0) {
      return result({ msg: "Consolidate Invoice detail not deleted" }, null);
    }
    return result(null, res);
  });
};

//To view
ConsolidateDetailModel.view = (objModel, result) => {
  // console.log(objModel);
  var sql = `SELECT icd.ConsolidateInvoiceDetailId,icd.InvoiceId,icd.InvoiceNo,i.InvoiceId,i.InvoiceNo,i.SOId,i.SONo,i.CustomerBlanketPOId,i.CustomerPONo,i.MROId,MRO.MRONo,i.RRId,i.RRNo,i.SubTotal,i.TaxPercent,i.BlanketPOExcludeAmount,i.BlanketPONetAmount,i.GrandTotal,
i.LocalCurrencyCode,i.ExchangeRate,i.BaseCurrencyCode,i.BaseGrandTotal,CUR.CurrencySymbol as LocalCurrencySymbol, CURB.CurrencySymbol as BaseCurrencySymbol,
case i.InvoiceType
    WHEN 0 THEN '${Constants.array_invoice_type[0]}'
    WHEN 2 THEN '${Constants.array_invoice_type[2]}'
    WHEN 3 THEN '${Constants.array_invoice_type[3]}'
    ELSE '-'
    end InvoiceTypeName,i.InvoiceType,
    Case i.Status
    WHEN 0 THEN '${Constants.array_invoice_status[0]}'
    WHEN 1 THEN '${Constants.array_invoice_status[1]}'
    WHEN 2 THEN '${Constants.array_invoice_status[2]}'
    WHEN 3 THEN '${Constants.array_invoice_status[3]}'
    WHEN 4 THEN '${Constants.array_invoice_status[4]}'
     WHEN 5 THEN '${Constants.array_invoice_status[5]}'
     WHEN 6 THEN '${Constants.array_invoice_status[6]}' 
    WHEN 7 THEN '${Constants.array_invoice_status[7]}'
    WHEN 8 THEN '${Constants.array_invoice_status[8]}'
    ELSE '-'
    end StatusName,i.Status,DATE_FORMAT(i.InvoiceDate,'%Y-%m-%d') as InvoiceDate
  FROM tbl_invoice_consolidate_detail as icd
  LEFT JOIN tbl_invoice i on i.InvoiceId=icd.InvoiceId
  Left Join tbl_mro as MRO ON MRO.MROId = i.MROId and MRO.IsDeleted = 0 AND MRO.MROId>0
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = i.LocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies CURB ON CURB.CurrencyCode = i.BaseCurrencyCode AND CURB.IsDeleted = 0
  where icd.IsDeleted=0 and icd.ConsolidateInvoiceId='${objModel.ConsolidateInvoiceId}'`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);

    return result(null, res);
  });
}

ConsolidateDetailModel.viewItem = (objModel, result) => {
  // console.log(objModel);
  var sql = `SELECT ii.PartId, ii.PartNo, ii.Description, ii.Quantity,ii.Rate, ii.BaseRate, ii.Tax,
  ROUND(ifnull((ii.Quantity * ii.Tax),0),2) as TotalTax, ii.BaseTax, ii.ItemTaxPercent,ii.ItemLocalCurrencyCode,ii.ItemBaseCurrencyCode, ii.ItemExchangeRate,ii.BasePrice,ii.Price, ii.IsExcludeFromBlanketPO, CUR.CurrencySymbol as ItemLocalCurrencySymbol, CURB.CurrencySymbol as BaseCurrencySymbol,ii.ShippingCharge,ii.BaseShippingCharge,ii.ItemLocalCurrencyCode as LocalCurrencyCode,
  icd.ConsolidateInvoiceDetailId,icd.ConsolidateInvoiceId,icd.InvoiceId,icd.InvoiceNo,i.RRId,i.RRNo,i.MROId,rr.SerialNo,MRO.MRONo,
  QI.PartType,
 case QI.PartType
  WHEN 1 THEN '${Constants.array_part_type[1]}'
  WHEN 2 THEN '${Constants.array_part_type[2]}'
  WHEN 3 THEN '${Constants.array_part_type[3]}'
  WHEN 4 THEN '${Constants.array_part_type[4]}'
  WHEN 5 THEN '${Constants.array_part_type[5]}'
  ELSE '-'
  end PartTypeName 
  FROM tbl_invoice_consolidate_detail as icd
  LEFT JOIN tbl_invoice i on i.InvoiceId=icd.InvoiceId
  LEFT JOIN tbl_invoice_item ii on ii.InvoiceId=icd.InvoiceId
  Left Join tbl_repair_request rr on rr.RRId=i.RRId and rr.PartId=ii.PartId
  Left Join tbl_mro as MRO ON MRO.MROId = i.MROId and MRO.IsDeleted = 0 AND MRO.MROId>0
  LEFT JOIN  tbl_quotes as Q ON Q.MROId = i.MROId and Q.IsDeleted = 0 AND Q.MROId>0
  LEFT JOIN tbl_quotes_item as QI on QI.QuoteId = Q.QuoteId and QI.PartId = ii.PartId AND QI.IsDeleted = 0
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = ii.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies CURB ON CURB.CurrencyCode = ii.ItemBaseCurrencyCode AND CURB.IsDeleted = 0
  where icd.IsDeleted=0 and icd.ConsolidateInvoiceId='${objModel.ConsolidateInvoiceId}'`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);

    return result(null, res);
  });
}

ConsolidateDetailModel.viewSum = (objModel, result) => {

  var sql = `SELECT CONCAT(CUR.CurrencySymbol,' ', FORMAT(ROUND(ifnull(sum(ii.Price),0),2),2)) as GrandTotal, CONCAT(CURB.CurrencySymbol,' ', FORMAT(ROUND(ifnull(sum(ii.BasePrice),0),2),2)) as BaseGrandTotal  
  FROM ahoms.tbl_invoice_consolidate_detail as icd
  LEFT JOIN tbl_invoice i on i.InvoiceId=icd.InvoiceId
  LEFT JOIN tbl_invoice_item ii on ii.InvoiceId=icd.InvoiceId
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = ii.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies CURB ON CURB.CurrencyCode = ii.ItemBaseCurrencyCode AND CURB.IsDeleted = 0
  where icd.IsDeleted=0 and icd.ConsolidateInvoiceId='${objModel.ConsolidateInvoiceId}' group by ii.ItemLocalCurrencyCode, ii.ItemBaseCurrencyCode`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);

    return result(null, res);
  });
}
module.exports = ConsolidateDetailModel;
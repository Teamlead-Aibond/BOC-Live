/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var cDateTime = require("../utils/generic.js");
const QuoteModel = require("../models/quotes.model.js");
var async = require('async');
const QuoteItem = require("./quote.item.model.js");
const SalesOrder = require("./sales.order.model.js");

const MROVendor = function (obj) {
    this.RRVendorId = obj.RRVendorId;
    this.RRId = obj.RRId ? obj.RRId : 0;
    this.MROId = obj.MROId ? obj.MROId : 0;
    this.VendorId = obj.VendorId ? obj.VendorId : 0;
    this.VendorRefNo = obj.VendorRefNo ? obj.VendorRefNo : '';
    this.VendorRefAttachment = obj.VendorRefAttachment ? obj.VendorRefAttachment : '';
    this.RouteCause = obj.RouteCause ? obj.RouteCause : '';
    this.SubTotal = obj.SubTotal ? obj.SubTotal : 0;
    this.AdditionalCharge = obj.AdditionalCharge ? obj.AdditionalCharge : 0;
    this.TaxPercent = obj.TaxPercent ? obj.TaxPercent : 0;
    this.TotalTax = obj.TotalTax ? obj.TotalTax : 0;
    this.Discount = obj.Discount ? obj.Discount : 0;
    this.Shipping = obj.Shipping ? obj.Shipping : 0;
    this.GrandTotal = obj.GrandTotal ? obj.GrandTotal : 0;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.Status = obj.Status ? obj.Status : 0;
    this.VendorsList = obj.VendorsList;
    this.VendorPartsList = obj.VendorPartsList;

    this.LeadTime = obj.LeadTime ? obj.LeadTime : 0;
    this.WarrantyPeriod = obj.WarrantyPeriod ? obj.WarrantyPeriod : 0;
    this.RejectedStatus = obj.RejectedStatus ? obj.RejectedStatus : 0;
}

MROVendor.ViewMROVendors = (MROId) => {
    var sql = `Select RRV.MROId,RRVendorId,RRId,RRV.VendorId,RRV.VendorRefAttachment,RRV.VendorRefNo,RouteCause,SubTotal,
    AdditionalCharge,TaxPercent,TotalTax,Discount,Shipping,GrandTotal,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal,RRV.Status,V.VendorName,V.VendorCode,
    REPLACE(V.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}')  as ProfilePhoto,RRV.LeadTime,RRV.WarrantyPeriod,RRV.RejectedStatus,CASE RRV.RejectedStatus
    WHEN 1 THEN '${Constants.array_vendor_reject_status[1]}'
    WHEN 2 THEN '${Constants.array_vendor_reject_status[2]}'
    WHEN 3 THEN '${Constants.array_vendor_reject_status[3]}' 
    WHEN 4 THEN '${Constants.array_vendor_reject_status[4]}'  
    ELSE '-'	end RejectedStatusName
    from tbl_repair_request_vendors  as RRV 
    LEFT JOIN  tbl_vendors as V ON V.VendorId = RRV.VendorId
    where RRV.IsDeleted=0 and RRV.MROId=${MROId} `;
    sql += `ORDER BY Status ASC`;
    return sql;
};
MROVendor.UpdateMROVendors = (obj, result) => {

    var val = new MROVendor(obj.VendorsList);
    //console.log(val);
    var sql = `Update  tbl_repair_request_vendors set
    VendorRefAttachment=?,   RouteCause=?, SubTotal=?, AdditionalCharge=?, TaxPercent = ? , TotalTax=?, Discount=?, Shipping=?, GrandTotal=?,
    LocalCurrencyCode = ?,ExchangeRate= ?,BaseCurrencyCode= ?,BaseGrandTotal= ?,
     Modified=?, ModifiedBy=?,LeadTime=?,WarrantyPeriod=? where RRVendorId=? `;
    var values = [
        val.VendorRefAttachment, val.RouteCause, val.SubTotal,
        val.AdditionalCharge, val.TaxPercent, val.TotalTax, val.Discount, val.Shipping,
        val.GrandTotal, val.LocalCurrencyCode, val.ExchangeRate, val.BaseCurrencyCode, val.BaseGrandTotal, val.Modified, val.ModifiedBy,
        val.LeadTime, val.WarrantyPeriod, val.RRVendorId]
    // console.log(sql + values);
    con.query(sql, values, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            result({ msg: "not updated" }, null);
            return;
        }
        result(null, { id: obj.MROId, ...obj });
        return;
    });
};
// MROVendor.ViewMROVendorsById = (MROId, RRVendorId) => {
//     var sql = `Select MRO.CustomerId,RRV.RRVendorId,RRV.VendorRefAttachment,RRV.VendorRefNo,RRV.RRId,RRV.VendorId,RouteCause,SubTotal,AdditionalCharge,TaxPercent,TotalTax,Discount,Shipping,GrandTotal,RRV.Status,V.VendorName,V.VendorCode ,V.ProfilePhoto,RRV.LeadTime,RRV.WarrantyPeriod
//   from tbl_repair_request_vendors  as RRV 
//   LEFT JOIN  tbl_vendors as V ON V.VendorId = RRV.VendorId
//   LEFT JOIN  tbl_mro as MRO ON MRO.MROId = RRV.MROId
//   where RRV.IsDeleted=0 and RRV.RRVendorId=${RRVendorId} and RRV.MROId=${MROId}`;
//     return sql;
// }

MROVendor.ViewMROVendorsById = (MROId, PartId) => {
    // console.log("MROVendor.ViewMROVendorsById")
    var sql = `Select mro.CustomerId,vq.*,vqi.*,v.VendorName, v.VendorLocation, v.VendorCurrencyCode, CUR.CurrencySymbol, CURV.CurrencySymbol as VendorCurrencySymbol,CON.VatTaxPercentage,CON.CountryName as VendorCountryName
From tbl_vendor_quote as vq
LEFT JOIN  tbl_vendor_quote_item as vqi ON vq.VendorQuoteId = vqi.VendorQuoteId
LEFT JOIN  tbl_vendors as v ON v.VendorId = vq.VendorId
LEFT JOIN  tbl_mro as mro ON mro.MROId = vq.MROId
LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = vqi.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
LEFT JOIN tbl_currencies as CURV  ON CURV.CurrencyCode = v.VendorCurrencyCode AND CURV.IsDeleted = 0
LEFT JOIN tbl_countries as CON  ON CON.CountryId = v.VendorLocation AND CON.IsDeleted = 0
where vq.IsDeleted=0 and vq.MROId=${MROId} and vq.QuoteItemId=${PartId}  `;
    // console.log(sql)
    return sql;
}

MROVendor.ViewMROVendorInfo = (ReqBody, result) => {
    if (ReqBody.hasOwnProperty('MROId')) {
        var sqlVendors = MROVendor.ViewMROVendorsById(ReqBody.MROId, ReqBody.PartId);
        var sqlQuote = QuoteModel.viewquery(ReqBody.QuoteId, 0);
        var sqlQuoteItem = QuoteItem.ViewSingleQuoteItemquery(ReqBody.QuoteItemId, ReqBody.QuoteId);
        //var sqlVendorsParts = MROPartsModel.ViewVendorPartsById(ReqBody.MROId, ReqBody.RRVendorId);
        //  var sqlPartsQuery = RRPartsModel.ViewRRPartsByIdQuery(ReqBody.MROId);
        async.parallel([
            function (result) { con.query(sqlVendors, result) },
            function (result) { con.query(sqlQuote, result) },
            function (result) { con.query(sqlQuoteItem, result) },
            // function (result) { con.query(sqlVendorsParts, result) },
            //  function (result) { con.query(sqlPartsQuery, result) }
        ],
            function (err, results) {
                if (err)
                    return result(err, null);
                if (results[0][0].length > 0) {
                    //     if (results[1][0].length > 0) {
                    //         for (var x in results[1][0]) {
                    //             var Obj = {
                    //                 PartId: results[1][0][x].PartId,
                    //                 CustomerId: results[0][0][0].CustomerId
                    //             }
                    //             const Invoice = require("../models/invoice.model.js");
                    //             Invoice.listPartsLPP(Obj, (err, data) => {
                    //                 results[1][0][x].LPPInfo = data;
                    //             });

                    //         }
                    //     }
                    return result(null, { VendorsInfo: results[0][0], QuoteInfo: results[1][0], QuoteItemInfo: results[2][0] });

                } else {
                    return result({ msg: "Vendor not found" }, null);

                }
            }
        );
    } else {
        return result({ msg: "MRO and Vendor Id is missing" }, null);

    }
};
//
MROVendor.ListVendorQuoteByMRO = (MROId, QuoteItemIds) => {
    // var sql = `Select mro.CustomerId,vq.*,vqi.*,v.VendorName
    // From tbl_vendor_quote as vq
    // LEFT JOIN  tbl_vendor_quote_item as vqi ON vq.VendorQuoteId = vqi.VendorQuoteId
    // LEFT JOIN  tbl_mro as mro ON mro.MROId = vq.MROId
    // LEFT JOIN  tbl_vendors as v ON v.VendorId = vq.VendorId
    // where vq.IsDeleted=0 and vq.MROId=${obj.MROId}`;
    var sql = `Select vq.*,vqi.*,v.VendorName,FORMAT(ROUND(ifnull((Select Rate from tbl_quotes_item where IsDeleted=0 and PartId=vq.QuoteItemId and QuoteId=vq.QuoteId),0),2),2) as CustomerUnitPrice,CURL.CurrencySymbol as ItemLocalCurrencySymbol
     from tbl_vendor_quote  vq
    Left Join tbl_vendor_quote_item vqi on vqi.VendorQuoteId=vq.VendorQuoteId
    LEFT JOIN  tbl_vendors as v ON v.VendorId = vq.VendorId
    LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = vqi.ItemLocalCurrencyCode AND CURL.IsDeleted = 0 
    
    where  vq.IsDeleted=0  and vq.MROId=${MROId} and vq.QuoteItemId In(${QuoteItemIds}); `
    // console.log(sql);
    return sql;
};
//
MROVendor.VendorQuoteBySO = (ReqBody, result) => {
    if (ReqBody.hasOwnProperty('MROId') && ReqBody.hasOwnProperty('SOId')) {
        var sql = SalesOrder.GetPartIdBySO(ReqBody.SOId);
        con.query(sql, (err, res) => {
            if (res.length > 0) {
                var sqlVendorQuoteInfos = MROVendor.ListVendorQuoteByMRO(ReqBody.MROId, res[0].PartIds);
                async.parallel([
                    function (result) { con.query(sqlVendorQuoteInfos, result) },
                ],
                    function (err, results) {
                        if (err)
                            return result(err, null);
                        if (results[0][0].length > 0) {
                            return result(null, { sqlVendorQuoteInfos: results[0][0] });
                        } else {
                            return result({ msg: "VendorQuote not found" }, null);
                        }
                    });
            }
            else {
                return result({ msg: "SOItem not found" }, null);
            }
        });
    } else {
        return result({ msg: "MRO missing" }, null);
    }
};
module.exports = MROVendor;
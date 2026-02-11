/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");
var async = require('async');
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
const CustomerBlanketPOHistory = function (obj) {

    this.BlanketPOHistoryId = obj.BlanketPOHistoryId ? obj.BlanketPOHistoryId : 0;
    this.BlanketPOId = obj.BlanketPOId ? obj.BlanketPOId : 0;
    this.RRId = obj.RRId ? obj.RRId : 0;
    this.MROId = obj.MROId ? obj.MROId : 0;
    this.PaymentType = obj.PaymentType ? obj.PaymentType : 0;
    this.Amount = obj.Amount ? obj.Amount : 0;
    this.CurrentBalance = obj.CurrentBalance ? obj.CurrentBalance : 0;
    this.QuoteId = obj.QuoteId ? obj.QuoteId : 0;
    this.Comments = obj.Comments ? obj.Comments : "";

    this.LocalCurrencyCode = obj.LocalCurrencyCode ? obj.LocalCurrencyCode : "";
    this.ExchangeRate = obj.ExchangeRate ? obj.ExchangeRate : 1;
    this.BaseCurrencyCode = obj.BaseCurrencyCode ? obj.BaseCurrencyCode : "";
    this.BaseAmount = obj.BaseAmount ? obj.BaseAmount : 0;
    this.BaseCurrentBalance = obj.BaseCurrentBalance ? obj.BaseCurrentBalance : 0;

    this.Created = obj.Created ? obj.Created : cDateTime.getDateTime();
    this.Modified = obj.Modified ? obj.Modified : cDateTime.getDateTime();

    this.authuser = obj.authuser ? obj.authuser : {};

    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;

    // For Server Side Search 
    this.start = obj.start;
    this.length = obj.length;
    this.search = obj.search;
    this.sortCol = obj.sortCol;
    this.sortDir = obj.sortDir;
    this.sortColName = obj.sortColName;
    this.order = obj.order;
    this.columns = obj.columns;
    this.draw = obj.draw;


};

CustomerBlanketPOHistory.UpdateAmountAndCurrentBalance = (BlanketPOHistoryId, DifferenceAmount, TokenUserId, result) => {

    var sql = `UPDATE tbl_customer_blanket_po_history SET Amount=Amount +(${DifferenceAmount}) ,CurrentBalance=CurrentBalance -(${DifferenceAmount}),
    ModifiedBy='${TokenUserId}', Modified='${cDateTime.getDateTime()}'
    WHERE BlanketPOHistoryId =${BlanketPOHistoryId}`;
    //console.log("Blanket PO History SQL = " + sql)
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

CustomerBlanketPOHistory.Create = (obj, result) => {
    obj = escapeSqlValues(obj);
    var Amount = parseFloat(obj.Amount).toFixed(2);
    var CurrentBalance = parseFloat(obj.CurrentBalance).toFixed(2);
    var BaseAmount = parseFloat(obj.BaseAmount).toFixed(2);
    var BaseCurrentBalance = parseFloat(obj.BaseCurrentBalance).toFixed(2);

    var sql = `insert into tbl_customer_blanket_po_history(BlanketPOId,RRId,MROId,PaymentType,Amount,CurrentBalance,QuoteId,Comments,Created,CreatedBy,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseAmount,BaseCurrentBalance)
    values('${obj.BlanketPOId}','${obj.RRId}','${obj.MROId}','${obj.PaymentType}','${Amount}',
    '${CurrentBalance}','${obj.QuoteId}','${obj.Comments}','${obj.Created}','${obj.CreatedBy}',
    '${obj.LocalCurrencyCode}','${obj.ExchangeRate}','${obj.BaseCurrencyCode}','${BaseAmount}','${BaseCurrentBalance}')`;
    //console.log(sql)
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...obj });
    });
};

CustomerBlanketPOHistory.ViewByID = (CustomerBlanketPOId, Id, Type, result) => {
    var sql = `Select poh.* from tbl_customer_blanket_po_history as poh
    WHERE poh.IsDeleted=0 AND poh.BlanketPOId = ${CustomerBlanketPOId} `;
    if (Type == "RR")
        sql += ` and RRId=${Id}`;
    else if (Type == "QUOTE")
        sql += ` and QuoteId=${Id}`;
    else if (Type == "MRO")
        sql += ` and MROId=${Id}`;
    else { }

    sql += ` order by BlanketPOHistoryId desc limit 0,1 `;
    //console.log("View History Query = " + sql)
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

CustomerBlanketPOHistory.List = (obj, result) => {

    var query = "";
    var selectquery = `Select DATE_FORMAT(bh.Created,'%m/%d/%Y') AS Date, MRO.MRONo,MRO.MROId, rr.RRId,rr.RRNo,Q.QuoteId, Q.QuoteNo,
    IF(bh.RRId>0,rr.RRNo,If(bh.MROId>0,bh.MROId,0)) as RRNoOrMRONo,
    case PaymentType when 1 then "CREDIT" when 2 then "DEBIT" ELSE "-" end as PaymentType,Amount,CurrentBalance,bh.LocalCurrencyCode,bh.ExchangeRate,bh.BaseCurrencyCode,bh.BaseAmount,bh.BaseCurrentBalance,
    BlanketPOHistoryId,Comments,CURL.CurrencySymbol as LocalCurrencySymbol,CURB.CurrencySymbol as BaseCurrencySymbol`;
    recordfilterquery = `Select count(BlanketPOHistoryId) as recordsFiltered `;
    query = query + ` From tbl_customer_blanket_po_history bh
    Left Join tbl_repair_request rr on rr.RRId=bh.RRId AND rr.IsDeleted = 0
    Left Join tbl_mro MRO on MRO.MROId=bh.MROId AND MRO.IsDeleted = 0
    Left Join tbl_quotes as Q ON Q.QuoteId = bh.QuoteId AND Q.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL ON CURL.CurrencyCode = bh.LocalCurrencyCode AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_currencies as CURB ON CURB.CurrencyCode = bh.BaseCurrencyCode AND CURB.IsDeleted = 0
    where bh.IsDeleted=0 `;

    var TokenIdentityType = getLogInIdentityType(obj);
    var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(obj);
    var MultipleCustomerIds = getLogInMultipleCustomerIds(obj);


    if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        query += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
    }
    if (obj.BlanketPOId > 0) {
        query += ` and bh.BlanketPOId=${obj.BlanketPOId}`;
    }
    if (obj.search.value != '') {
        var PaymentType = '';
        if (obj.search.value.toLowerCase() == "credit") { PaymentType = 1; }
        if (obj.search.value.toLowerCase() == "debit") { PaymentType = 2; }

        query = query + ` and (  
       DATE_FORMAT(bh.Created,'%m/%d/%Y') LIKE '%${obj.search.value}%'
    or IF(bh.RRId>0,rr.RRNo,If(bh.MROId>0,bh.MROId,0)) LIKE '%${obj.search.value}%'
    or PaymentType LIKE '%${PaymentType}%'
    or Amount LIKE '%${obj.search.value}%'
    or CurrentBalance LIKE '%${obj.search.value}%'
  )`;
    }
    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {

        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "Date":
                    query += " and DATE_FORMAT(bh.Created,'%m/%d/%Y')='" + obj.columns[cvalue].search.value + "'  ";
                    break;
                case "RRNoOrMRONo":
                    query += " and IF(bh.RRId>0,rr.RRNo,If(bh.MROId>0,bh.MROId,0)) LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
                    break;
                case "PaymentType":
                    query += " and PaymentType='" + obj.columns[cvalue].search.value + "'  ";
                    break;
                case "Amount":
                    query += " and Amount='" + obj.columns[cvalue].search.value + "'  ";
                    break;
                case "CurrentBalance":
                    query += " and CurrentBalance='" + obj.columns[cvalue].search.value + "'  ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }

    var i = 0;
    if (obj.order.length > 0) {
        query += " ORDER BY ";
    }
    for (i = 0; i < obj.order.length; i++) {

        if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
        {
            switch (obj.columns[obj.order[i].column].name) {

                case "Date":
                    query += " DATE_FORMAT(bh.Created,'%m/%d/%Y') " + obj.order[i].dir + ",";
                    break;
                case "RRNoOrMRONo":
                    query += " IF(bh.RRId>0,rr.RRNo,If(bh.MROId>0,bh.MROId,0)) " + obj.order[i].dir + ",";
                    break;
                default:
                    query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + ",";
            }
        }
    }

    var tempquery = query.slice(0, -1);
    var query = tempquery;
    var Countquery = recordfilterquery + query;

    if (obj.start != "-1" && obj.length != "-1") {
        query += " LIMIT " + obj.start + "," + (obj.length);
    }
    query = selectquery + query;

    var TotalCountQuery = `Select count(BlanketPOHistoryId) as TotalCount
    From tbl_customer_blanket_po_history bh
    Left Join tbl_repair_request rr on rr.RRId=bh.RRId
    where bh.IsDeleted=0 `;
    if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        TotalCountQuery += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
    }
    //console.log("query = " + query);
    //console.log("Countquery = " + Countquery);
    //console.log("TotalCountQuery = " + TotalCountQuery);

    async.parallel([
        function (result) { con.query(query, result) },
        function (result) { con.query(Countquery, result) },
        function (result) { con.query(TotalCountQuery, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            return result(null, {
                data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
                recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
            });
        }
    );

};
module.exports = CustomerBlanketPOHistory;


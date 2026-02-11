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
const Constants = require("../config/constants.js");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");

const CustomerBlanketPO = function (obj) {
    this.CustomerBlanketPOId = obj.CustomerBlanketPOId ? obj.CustomerBlanketPOId : 0;
    this.CustomerId = obj.CustomerId ? obj.CustomerId : 0;
    this.CustomerPONo = obj.CustomerPONo ? obj.CustomerPONo : '';
    this.StartingBalance = obj.StartingBalance ? obj.StartingBalance : 0;
    this.TotalAmount = obj.TotalAmount ? obj.TotalAmount : 0;
    this.CurrentBalance = obj.CurrentBalance ? obj.CurrentBalance : 0;
    this.BlanketPODate = obj.BlanketPODate ? obj.BlanketPODate : null;
    this.BlanketPOAtachment = obj.BlanketPOAtachment ? obj.BlanketPOAtachment : '';
    this.BlanketPONotes = obj.BlanketPONotes ? obj.BlanketPONotes : '';
    this.Status = obj.Status ? obj.Status : 0;
    this.IsActive = obj.IsActive || obj.IsActive == 0 ? obj.IsActive : 1;

    this.Created = obj.Created ? obj.Created : cDateTime.getDateTime();
    this.Modified = obj.Modified ? obj.Modified : cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;

    this.authuser = obj.authuser ? obj.authuser : {};

    // 
    this.LocalCurrencyCode = obj.LocalCurrencyCode ? obj.LocalCurrencyCode : "";
    this.ExchangeRate = obj.ExchangeRate ? obj.ExchangeRate : 1;
    this.BaseCurrencyCode = obj.BaseCurrencyCode ? obj.BaseCurrencyCode : "";
    this.BaseStartingBalance = obj.BaseStartingBalance ? obj.BaseStartingBalance : 0;
    this.BaseTotalAmount = obj.BaseTotalAmount ? obj.BaseTotalAmount : 0;
    this.BaseCurrentBalance = obj.BaseCurrentBalance ? obj.BaseCurrentBalance : 0;
    // 

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

CustomerBlanketPO.ViewBlanketPOByRRIdAndCustomerBlanketPOId = (CustomerBlanketPOId, RRID, result) => {
    var sql = `Select rr.RRId,bpo.*,CURL.CurrencySymbol as LocalCurrencySymbol,CURB.CurrencySymbol as BaseCurrencySymbol from tbl_customer_blanket_po bpo
Left Join  tbl_repair_request rr on rr.CustomerBlanketPOId=bpo.CustomerBlanketPOId
LEFT JOIN tbl_currencies as CURL ON CURL.CurrencyCode = bpo.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURB ON CURB.CurrencyCode = bpo.BaseCurrencyCode AND CURB.IsDeleted = 0
 where bpo.IsDeleted=0 and bpo.IsActive=1 and bpo.CustomerBlanketPOId=${CustomerBlanketPOId} and RRId=${RRID}`;
    //console.log(sql);
    con.query(sql, (err, res) => {

        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res);
            return;
        }
        result({ kind: "not found" }, null);
    });
}

CustomerBlanketPO.Create = (obj, result) => {
    obj = escapeSqlValues(obj);
    var sql = `insert into tbl_customer_blanket_po(CustomerId,CustomerPONo,StartingBalance,TotalAmount,CurrentBalance,BlanketPODate,
    BlanketPOAtachment,BlanketPONotes,Created,CreatedBy,Status,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseStartingBalance,BaseTotalAmount,BaseCurrentBalance,IsActive)
    values('${obj.CustomerId}','${obj.CustomerPONo}','${obj.StartingBalance}','${obj.StartingBalance}','${obj.StartingBalance}',
    '${obj.BlanketPODate}','${obj.BlanketPOAtachment}','${obj.BlanketPONotes}','${obj.Created}','${obj.CreatedBy}',
    '${obj.Status}','${obj.LocalCurrencyCode}','${obj.ExchangeRate}','${obj.BaseCurrencyCode}','${obj.BaseStartingBalance}','${obj.BaseStartingBalance}','${obj.BaseStartingBalance}', '${obj.IsActive}' )`;
    //console.log(sql)
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...obj });
    });
};

CustomerBlanketPO.IsExistCustomerPONo = (CustomerBlanketPOId, CustomerPONo, result) => {
    var sql = `Select CustomerBlanketPOId,CustomerPONo from tbl_customer_blanket_po where IsDeleted=0 and IsActive=1 and CustomerPONo='${CustomerPONo}' `;
    if (CustomerBlanketPOId > 0) {
        sql += ` and CustomerBlanketPOId<>${CustomerBlanketPOId} `;
    }
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, res);
    });
};

CustomerBlanketPO.Update = (objModel, result) => {

    objModel = escapeSqlValues(objModel);
    var sql = `UPDATE tbl_customer_blanket_po SET CustomerId=?,CustomerPONo=?,StartingBalance=?,TotalAmount=?,CurrentBalance=?,BlanketPODate=?,
    BlanketPOAtachment=?,BlanketPONotes=?,Modified=?,ModifiedBy=?,Status=?,BaseStartingBalance=?,BaseTotalAmount=?,BaseCurrentBalance=?,IsActive=? WHERE CustomerBlanketPOId = ?`;
    var values = [
        objModel.CustomerId, objModel.CustomerPONo, objModel.StartingBalance, objModel.StartingBalance, objModel.StartingBalance, objModel.BlanketPODate, objModel.BlanketPOAtachment,
        objModel.BlanketPONotes, objModel.Modified, objModel.ModifiedBy, objModel.Status, objModel.BaseStartingBalance, objModel.BaseTotalAmount, objModel.BaseCurrentBalance, objModel.IsActive, objModel.CustomerBlanketPOId
    ];
    con.query(sql, values, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

CustomerBlanketPO.Update2 = (objModel, result) => {

    objModel = escapeSqlValues(objModel);
    var sql = `UPDATE tbl_customer_blanket_po SET CustomerPONo=?,CurrentBalance=?,TotalAmount=?,StartingBalance=?,BaseStartingBalance=?,BaseTotalAmount=?,BaseCurrentBalance=?
    ,BlanketPONotes=?,Modified=?,ModifiedBy=?,IsActive=? WHERE CustomerBlanketPOId = ?`;
    var values = [
        objModel.CustomerPONo, objModel.CurrentBalance, objModel.TotalAmount, objModel.StartingBalance, objModel.BaseStartingBalance, objModel.BaseTotalAmount, objModel.BaseCurrentBalance, objModel.BlanketPONotes, objModel.Modified, objModel.ModifiedBy, objModel.IsActive, objModel.CustomerBlanketPOId
    ];
    con.query(sql, values, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

CustomerBlanketPO.Update3 = (objModel, result) => {
    objModel = escapeSqlValues(objModel);
    var sql = `UPDATE tbl_customer_blanket_po SET CurrentBalance=?,BaseCurrentBalance=?,BlanketPONotes=?,Modified=?,ModifiedBy=?,IsActive=?
    WHERE CustomerBlanketPOId = ?`;
    var values = [
        objModel.CurrentBalance, objModel.BaseCurrentBalance, objModel.BlanketPONotes, objModel.Modified, objModel.ModifiedBy, objModel.IsActive,
        objModel.CustomerBlanketPOId
    ];
    con.query(sql, values, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

CustomerBlanketPO.UpdateCurrentBalance = (CustomerBlanketPOId, QuoteAmount, result) => {
    CustomerBlanketPO.getBlanketPOExchangeRate(CustomerBlanketPOId, (err, data) => {
       // console.log(data)
        var exRate = data[0].ExchangeRate;
        var exQuoteAmount = QuoteAmount * exRate;
        var sql = `UPDATE tbl_customer_blanket_po SET CurrentBalance=CurrentBalance-${QuoteAmount}, BaseCurrentBalance=BaseCurrentBalance-${parseFloat(exQuoteAmount)} WHERE CustomerBlanketPOId =${CustomerBlanketPOId}`;
        //console.log(sql)
        con.query(sql, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, res);
        });
    });
};

CustomerBlanketPO.UpdateCurrentBalanceFromSOAndInvoice = (CustomerBlanketPOId, Amount, result) => {
    CustomerBlanketPO.getBlanketPOExchangeRate(CustomerBlanketPOId, (err, data) => {
        // console.log(data)
        var exRate = data[0].ExchangeRate;
        var exAmount = Amount * exRate;
        var sql = `UPDATE tbl_customer_blanket_po SET CurrentBalance=CurrentBalance-(${Amount}), BaseCurrentBalance=BaseCurrentBalance-${parseFloat(exAmount)} WHERE CustomerBlanketPOId =${CustomerBlanketPOId}`;
        //console.log("Blanket PO SQL = " + sql)
        con.query(sql, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, res);
        });
    });
};

CustomerBlanketPO.Refund = (CustomerBlanketPOId, QuoteAmount, result) => {
    CustomerBlanketPO.getBlanketPOExchangeRate(CustomerBlanketPOId, (err, data) => {
        // console.log(data)
        var exRate = data[0].ExchangeRate;
        var exQuoteAmount = QuoteAmount * exRate;
        var sql = `UPDATE tbl_customer_blanket_po SET CurrentBalance=CurrentBalance+${QuoteAmount}, BaseCurrentBalance=BaseCurrentBalance+${parseFloat(exQuoteAmount)} WHERE CustomerBlanketPOId =${CustomerBlanketPOId}`;
        //console.log(sql)
        con.query(sql, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, res);
        });
    });
};

CustomerBlanketPO.GetCurrentBalance = (CustomerBlanketPOId, result) => {
    var sql = `Select bpo.CurrentBalance,'ds' as d,bpo.BaseCurrentBalance,CURL.CurrencySymbol as LocalCurrencySymbol,CURB.CurrencySymbol as BaseCurrencySymbol ,bpo.LocalCurrencyCode
    from tbl_customer_blanket_po as bpo 
    LEFT JOIN tbl_currencies as CURL ON CURL.CurrencyCode = bpo.LocalCurrencyCode AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_currencies as CURB ON CURB.CurrencyCode = bpo.BaseCurrencyCode AND CURB.IsDeleted = 0
    WHERE bpo.IsActive=1 and bpo.CustomerBlanketPOId =${CustomerBlanketPOId}`;
    //console.log(sql)
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};


CustomerBlanketPO.GetCustomerBlanketPOIdFromRR = (RRId, result) => {
    var sql = `Select CustomerBlanketPOId,'Test' as T from tbl_repair_request  WHERE IsDeleted=0 and RRId =${RRId}`;
    //console.log(sql)
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};
CustomerBlanketPO.UpdateAmounts = (TopUpAmount, CustomerBlanketPOId, result) => {
    CustomerBlanketPO.getBlanketPOExchangeRate(CustomerBlanketPOId, (err, data) => {
        //console.log(data)
        var exRate = data[0].ExchangeRate;
        var exTopUpAmount = TopUpAmount * exRate;
        var sql = `UPDATE tbl_customer_blanket_po SET TotalAmount=TotalAmount +${TopUpAmount} ,CurrentBalance=CurrentBalance +${parseFloat(TopUpAmount)}, BaseTotalAmount=BaseTotalAmount +${exTopUpAmount} ,BaseCurrentBalance=BaseCurrentBalance +${exTopUpAmount} 
        WHERE CustomerBlanketPOId =${CustomerBlanketPOId}`;
        con.query(sql, (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            result(null, res);
        });
    });
};

CustomerBlanketPO.View = (req, reqbody, result) => {
    var CustomerBlanketPOId = reqbody.CustomerBlanketPOId;
    var customerquery = '';

    var TokenIdentityType = getLogInIdentityType(req);
    var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(req);
    var MultipleCustomerIds = getLogInMultipleCustomerIds(req);

    // if (TokenIdentityType == Constants.CONST_IDENTITY_TYPE_CUSTOMER) {
        // customerquery = `AND (cb.CustomerId IN(${MultipleCustomerIds}) )`
    // }
    var sql = `Select c.CompanyName,cb.CustomerId,CustomerBlanketPOId,
CustomerPONo,StartingBalance,TotalAmount,CurrentBalance,DATE_FORMAT(BlanketPODate, '%m/%d/%Y') as BlanketPODate,
BlanketPOAtachment,BlanketPONotes,cb.Status, CONCAT(U.FirstName,' ' , U.LastName) as UserContactName, CONCAT(U.FirstName,' ' , U.LastName) as CreatedByName, 

cb.Created, CUR.CurrencySymbol,cb.LocalCurrencyCode,cb.ExchangeRate,cb.BaseCurrencyCode,cb.BaseStartingBalance,cb.BaseTotalAmount,cb.BaseCurrentBalance,CURL.CurrencySymbol as LocalCurrencySymbol,CURB.CurrencySymbol as BaseCurrencySymbol,cb.IsActive
From tbl_customer_blanket_po cb
Left Join tbl_customers c on c.CustomerId=cb.CustomerId
LEFT JOIN tbl_users as U ON U.UserId = cb.CreatedBy
LEFT JOIN tbl_currencies as CUR ON CUR.CurrencyCode = c.CustomerCurrencyCode AND CUR.IsDeleted = 0
LEFT JOIN tbl_currencies as CURL ON CURL.CurrencyCode = cb.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURB ON CURB.CurrencyCode = cb.BaseCurrencyCode AND CURB.IsDeleted = 0

where cb.IsDeleted=0 and  CustomerBlanketPOId='${CustomerBlanketPOId}' ${customerquery}`;
    if (TokenIdentityType == Constants.CONST_IDENTITY_TYPE_CUSTOMER && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "" && MultipleCustomerIds != 0) {
        sql += ` and cb.CustomerId in(${MultipleCustomerIds}) `;
    }
    // console.log(sql);
    con.query(sql, (err, res) => {

        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not found" }, null);
    });
}

CustomerBlanketPO.BlanketPOListByCustomerId = (CustomerId, reqBody, result) => {
    var sql = `Select c.CompanyName,cb.CustomerId,c.BlanketPOLowerLimitPercent,CustomerBlanketPOId,
CustomerPONo,StartingBalance,TotalAmount,CurrentBalance,DATE_FORMAT(BlanketPODate, '%m/%d/%Y') as BlanketPODate,
BlanketPOAtachment,BlanketPONotes,cb.Status,cb.LocalCurrencyCode,cb.ExchangeRate,cb.BaseCurrencyCode,cb.BaseStartingBalance,cb.BaseTotalAmount,
cb.BaseCurrentBalance,CURL.CurrencySymbol as LocalCurrencySymbol,CURB.CurrencySymbol as BaseCurrencySymbol,
CONCAT(U.FirstName,' ',U.LastName) as CreatedByName
From tbl_customer_blanket_po cb
Left Join tbl_customers c on c.CustomerId=cb.CustomerId
LEFT JOIN tbl_currencies as CURL ON CURL.CurrencyCode = cb.LocalCurrencyCode AND CURL.IsDeleted = 0 
LEFT JOIN tbl_currencies as CURB ON CURB.CurrencyCode = cb.BaseCurrencyCode AND CURB.IsDeleted = 0
LEFT JOIN tbl_users as U On U.UserId = cb.CreatedBy AND U.IdentityType=0
where cb.IsDeleted=0 and cb.IsActive=1 and cb.CustomerId=` + CustomerId + ` `;

    var TokenIdentityType = getLogInIdentityType(reqBody);
    var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqBody);
    var MultipleCustomerIds = getLogInMultipleCustomerIds(reqBody);

    if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        sql += ` and cb.CustomerId in(${MultipleCustomerIds}) `;
    }
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        if (res.length) {
            return result(null, res);
        }
        else
            result({ msg: "No Record found" }, null);
    });
}
CustomerBlanketPO.List = (obj, result) => {
    var query = "";
    var selectquery = `Select c.CompanyName,cb.CustomerId,CustomerBlanketPOId,cb.LocalCurrencyCode,cb.ExchangeRate,cb.BaseCurrencyCode,cb.BaseStartingBalance,cb.BaseTotalAmount,cb.BaseCurrentBalance,CURL.CurrencySymbol as LocalCurrencySymbol,CURB.CurrencySymbol as BaseCurrencySymbol,cb.IsActive,
    CustomerPONo,StartingBalance,TotalAmount,CurrentBalance,DATE_FORMAT(BlanketPODate, '%m/%d/%Y') as BlanketPODate,
    BlanketPOAtachment,BlanketPONotes,
    c.BlanketPOLowerLimitPercent, IF(( cb.CurrentBalance > ((cb.StartingBalance*c.BlanketPOLowerLimitPercent)/100) ),1,2) as IsLowerLimitReached,
    CONCAT(U.FirstName,' ',U.LastName) as CreatedByName,c.CustomerGroupId,cb.BlanketPONotes
    `;

    recordfilterquery = `Select count(CustomerBlanketPOId) as recordsFiltered `;

    query = query + ` From tbl_customer_blanket_po cb
    Left Join tbl_customers c on c.CustomerId=cb.CustomerId
    LEFT JOIN tbl_currencies as CURL ON CURL.CurrencyCode = cb.LocalCurrencyCode AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_currencies as CURB ON CURB.CurrencyCode = cb.BaseCurrencyCode AND CURB.IsDeleted = 0
    LEFT JOIN tbl_users as U On U.UserId = cb.CreatedBy AND U.IdentityType=0
    where cb.IsDeleted=0 `;

    var TokenIdentityType = getLogInIdentityType(obj);
    var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(obj);
    var MultipleCustomerIds = getLogInMultipleCustomerIds(obj);

    if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        query += ` and cb.CustomerId in(${MultipleCustomerIds}) `;
    }
    if (obj.search.value != '') {
        query = query + ` and (  cb.CustomerPONo LIKE '%${obj.search.value}%'
    or cb.StartingBalance LIKE '%${obj.search.value}%'
    or cb.CurrentBalance LIKE '%${obj.search.value}%'
    or cb.TotalAmount LIKE '%${obj.search.value}%'
    or cb.BlanketPODate LIKE '%${obj.search.value}%'
    or cb.BlanketPOAtachment LIKE '%${obj.search.value}%'
    or cb.BlanketPONotes LIKE '%${obj.search.value}%'
    or c.CompanyName LIKE '%${obj.search.value}%'
  ) `;
    }

    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {

        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "CustomerId":
                    query += " and ( cb.CustomerId IN (" + obj.columns[cvalue].search.value + ") ) ";
                    break;
                case "CustomerPONo":
                    query += " and ( cb.CustomerPONo LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
                    break;
                case "StartingBalance":
                    query += " and ( cb.StartingBalance='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CurrentBalance":
                    query += " and ( cb.CurrentBalance='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "BlanketPODate":
                    query += " and ( cb.BlanketPODate='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "BlanketPONotes":
                    query += " and ( cb.BlanketPONotes LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
                    break;
                case "IsActive":
                    query += " and ( cb.IsActive ='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "IsLowerLimitReached":
                    if (obj.columns[cvalue].search.value == 1) {
                        query += " and ( cb.CurrentBalance <= ((StartingBalance*c.BlanketPOLowerLimitPercent)/100) ) ";
                    } else if (obj.columns[cvalue].search.value == 2) {
                        query += " and ( cb.CurrentBalance > ((StartingBalance*c.BlanketPOLowerLimitPercent)/100) ) ";
                    }
                    break;
                case "CustomerGroupId":
                    query += " and (cb.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
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

                case "CustomerId":
                    query += " cb.CustomerId " + obj.order[i].dir + ",";
                    break;
                case "CustomerPONo":
                    query += " cb.CustomerPONo " + obj.order[i].dir + ",";
                    break;
                case "StartingBalance":
                    query += " cb.StartingBalance " + obj.order[i].dir + ",";
                    break;
                case "CurrentBalance":
                    query += " cb.CurrentBalance " + obj.order[i].dir + ",";
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

    var TotalCountQuery = `Select count(CustomerBlanketPOId) as TotalCount
    From tbl_customer_blanket_po cb
    Left Join tbl_customers c on c.CustomerId=cb.CustomerId
    where cb.IsDeleted=0 `;


    if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        TotalCountQuery += ` and cb.CustomerId in(${MultipleCustomerIds}) `;
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
CustomerBlanketPO.BlanketPOExludedPartList = (obj, result) => {

    var selectquery = `Select q.QuoteId,s.SOId,rr.RRId,MRO.MROId,si.PartId,s.CustomerId,s.CustomerBlanketPOId,(Select CompanyName from tbl_customers
    where IsDeleted=0 and CustomerId=s.CustomerId) as CompanyName,(Select CustomerPONo from tbl_customer_blanket_po
    where IsDeleted=0 and CustomerBlanketPOId=s.CustomerBlanketPOId) as CustomerPONo,InvoiceNo,s.SONo,q.QuoteNo,
    IF(s.RRId>0,rr.RRNo,If(s.MROId>0,MRO.MRONo,'')) as RRNoOrMRONo,
    si.PartNo,si.Rate,si.Quantity,Concat(CURL.CurrencySymbol,' ',si.Price) as Price,si.BaseRate,si.BaseTax,CURL.CurrencySymbol as LocalCurrencySymbol,CURB.CurrencySymbol as BaseCurrencySymbol,c.CustomerGroupId   `;
    var recordfilterquery = `Select count(*) as recordsFiltered `;
    var query = ` From tbl_sales_order s
    LEFT JOIN tbl_sales_order_item si on si.SOId=s.SOId and si.IsDeleted=0 AND si.IsDeleted = 0
    LEFT JOIN tbl_invoice i on i.SOId=s.SOId AND i.IsDeleted = 0
    Left Join tbl_repair_request rr on rr.RRId=s.RRId AND rr.IsDeleted = 0
    Left Join tbl_mro MRO on MRO.MROId=s.MROId AND MRO.IsDeleted = 0
    LEFT JOIN tbl_customers c on s.CustomerId=c.CustomerId 
    LEFT JOIN tbl_quotes q on q.QuoteId=s.QuoteId AND q.IsDeleted = 0
    LEFT JOIN tbl_currencies as CURL ON CURL.CurrencyCode = si.ItemLocalCurrencyCode AND CURL.IsDeleted = 0 
    LEFT JOIN tbl_currencies as CURB ON CURB.CurrencyCode = si.ItemBaseCurrencyCode AND CURB.IsDeleted = 0
    where s.IsDeleted=0 and s.CustomerBlanketPOId>0 and IsExcludeFromBlanketPO=1 `;

    var TokenIdentityType = getLogInIdentityType(obj);
    var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(obj);
    var MultipleCustomerIds = getLogInMultipleCustomerIds(obj);

    if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        query += ` and s.CustomerId in(${MultipleCustomerIds}) `;
    }
    if (obj.search.value != '') {
        query = query + ` and ( MRO.MRONo LIKE '%${obj.search.value}%'
        or rr.RRNo LIKE '%${obj.search.value}%'
        or s.SONo='${obj.search.value}'
        or i.InvoiceNo = '${obj.search.value}'
        or q.QuoteNo ='${obj.search.value}'
        or si.PartNo='${obj.search.value}' ) `;
    }
    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "CustomerId":
                    query += " and s.CustomerId IN(" + obj.columns[cvalue].search.value + ") ";
                    break;
                case "CustomerPONo":
                    query += " and  (Select CustomerPONo from tbl_customer_blanket_po where IsDeleted = 0 and CustomerBlanketPOId = s.CustomerBlanketPOId)='" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "PartId":
                    query += " and si.PartId = '" + obj.columns[cvalue].search.value + "'  ";
                    break;
                case "CustomerGroupId":
                    query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
                    break;
                default:
                    query += "  ";
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

                case "SONo":
                    query += " s.SONo " + obj.order[i].dir + " ";
                    break;
                default:
                    query += " s.SONo " + obj.order[i].dir + " ";
            }
        }
    }
    var Countquery = recordfilterquery + query;
    if (obj.start != "-1" && obj.length != "-1") {
        query += " LIMIT " + obj.start + "," + (obj.length);
    }
    query = selectquery + query;
    var TotalCountQuery = `SELECT Count(*) as TotalCount 
    From tbl_sales_order s
    LEFT JOIN tbl_sales_order_item si on si.SOId=s.SOId and si.IsDeleted=0 AND si.IsDeleted = 0
    LEFT JOIN tbl_invoice i on i.SOId=s.SOId AND i.IsDeleted = 0
    Left Join tbl_repair_request rr on rr.RRId=s.RRId AND rr.IsDeleted = 0
    Left Join tbl_mro MRO on MRO.MROId=s.MROId AND MRO.IsDeleted = 0
    LEFT JOIN tbl_quotes q on q.QuoteId=s.QuoteId AND q.IsDeleted = 0
    where s.IsDeleted=0 and s.CustomerBlanketPOId>0 and IsExcludeFromBlanketPO=1 `;

    if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        TotalCountQuery += ` and s.CustomerId in(${MultipleCustomerIds}) `;
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

CustomerBlanketPO.Report1List = (obj, result) => {
    //OLd
    //     var query = "";
    //     var selectquery = `Select C.CompanyName,C.CustomerId,cb.CustomerBlanketPOId,cb.CustomerPONo,StartingBalance,CurrentBalance BalanceAmount,
    //     ROUND(Sum(ifnull(Obj.sGrandTotal,0)),2) as BookedAmount,
    //     ROUND(Sum(ifnull(Obj.iGrandTotal,0)),2) as InvoicedAmount,
    //     ROUND(Sum(ifnull(Obj.uiGrandTotal,0)),2) as UpcomingInvoice`;
    //     recordfilterquery = `Select count(*) as recordsFiltered `;
    //     query = query + ` From tbl_customer_blanket_po cb
    // Left JOIN (Select s.CustomerBlanketPOId, ifnull(inv.GrandTotal,0) iGrandTotal,
    // ifnull(invoice.GrandTotal,0) uiGrandTotal,ifnull(so.GrandTotal,0) sGrandTotal
    // From tbl_sales_order s
    // Left Join tbl_invoice i on i.SOId= s.SOId
    // Left Join tbl_invoice inv on inv.InvoiceId= i.InvoiceId and inv.IsDeleted=0 and inv.Status=2
    // Left Join tbl_invoice invoice on invoice.InvoiceId= i.InvoiceId and invoice.IsDeleted=0 and invoice.Status IN(1,7)
    // Left Join tbl_sales_order so on so.SOId=s.SOId and so.SOId  not in (select SOId FROM tbl_invoice as INVO WHERE Status IN(1,2,7) AND  IsDeleted = 0 AND SOId = so.SOId )
    // where s.IsDeleted=0
    // ) as Obj ON Obj.CustomerBlanketPOId= cb.CustomerBlanketPOId

    // Left Join tbl_customers as C on C.CustomerId = cb.CustomerId
    // where cb.IsDeleted=0 `;


    var query = "";
    // var selectquery = `Select C.CompanyName,C.CustomerId,cb.CustomerBlanketPOId,cb.CustomerPONo,StartingBalance,CurrentBalance as BalanceAmount,CUR.CurrencySymbol,
    // FORMAT(ROUND((ifnull(group_concat(DISTINCT Obj.soiBlanketPONetAmount),0) - (ROUND(Sum(ifnull(Obj.iBlanketPONetAmount,0)),2) + ROUND(Sum(ifnull(Obj.uiBlanketPONetAmount,0)),2))),2),2) as BookedAmount,
    // FORMAT(ROUND(ifnull(group_concat(DISTINCT Obj.soiBlanketPONetAmount),0),2),2) as OverallBookedAmount,
    // FORMAT(ROUND(Sum(ifnull(Obj.iBlanketPONetAmount,0)),2),2) as InvoicedAmount,
    // FORMAT(ROUND(Sum(ifnull(Obj.uiBlanketPONetAmount,0)),2),2) as UpcomingInvoice`;
    // recordfilterquery = `Select count(*) as recordsFiltered `;
    // query = query + ` From tbl_customer_blanket_po cb
    // Left JOIN (Select s.CustomerBlanketPOId, ifnull(inv.BlanketPONetAmount,0) iBlanketPONetAmount,
    // ifnull(invoice.BlanketPONetAmount,0) uiBlanketPONetAmount,ifnull(so.BlanketPONetAmount,0) sBlanketPONetAmount,ifnull(soi.BlanketPONetAmount,0) soiBlanketPONetAmount
    // From tbl_sales_order s
    // Left Join tbl_invoice i on i.SOId= s.SOId
    // Left Join tbl_invoice inv on inv.InvoiceId= i.InvoiceId and inv.IsDeleted=0 and inv.Status=2
    // Left Join tbl_invoice invoice on invoice.InvoiceId= i.InvoiceId and invoice.IsDeleted=0 and invoice.Status IN(1,7)
    // Left Join tbl_sales_order so on so.SOId=s.SOId and so.SOId  not in 
    // (select SOId FROM tbl_invoice as INVO WHERE Status IN(1,2,7) AND  IsDeleted = 0 AND SOId = so.SOId )
    // Left Join tbl_sales_order soi on soi.SOId=s.SOId
    // where s.IsDeleted=0
    // ) as Obj ON Obj.CustomerBlanketPOId= cb.CustomerBlanketPOId
    // Left Join tbl_customers as C on C.CustomerId = cb.CustomerId
    // LEFT JOIN tbl_currencies as CUR ON CUR.CurrencyCode = C.CustomerCurrencyCode AND CUR.IsDeleted = 0
    // where cb.IsDeleted=0 `;

    //FORMAT(ROUND(ifnull((SELECT SUM(ti.BlanketPONetAmount) FROM tbl_invoice as ti WHERE ti.CustomerBlanketPOId=s.CustomerBlanketPOId and ti.IsDeleted=0 and ti.Status=2),0),2),2) as InvoicedAmount,

    var selectquery = `Select C.CompanyName,C.CustomerId,cb.CustomerBlanketPOId,cb.CustomerPONo,TotalAmount, StartingBalance,CurrentBalance as BalanceAmount,CUR.CurrencySymbol,
    FORMAT(ROUND(ifnull((SUM(ti.BlanketPONetAmount)),0),2),2) as InvoicedAmount ,    
    FORMAT(ROUND(ifnull((SELECT SUM(ti1.BlanketPONetAmount) FROM tbl_invoice as ti1 WHERE ti1.CustomerBlanketPOId=s.CustomerBlanketPOId and ti1.IsDeleted=0 and ti1.Status NOT IN(2,3)),0),2),2) as UpcomingInvoice,
     FORMAT(ROUND(ifnull((SELECT SUM(so1.BlanketPONetAmount) FROM tbl_sales_order as so1 WHERE so1.CustomerBlanketPOId=s.CustomerBlanketPOId and so1.IsDeleted=0 and so1.Status !=3 AND SOId NOT IN(Select SOId FROM tbl_invoice WHERE SOID = so1.SOId AND IsDeleted=0 AND Status!=3 )    ),0),2),2)  as BookedAmount`;
    recordfilterquery = `Select count(*) as recordsFiltered `;
    query = query + ` From tbl_sales_order s
    LEFT JOIN tbl_invoice as ti on ti.SOId = s.SOId AND ti.CustomerBlanketPOId=s.CustomerBlanketPOId and ti.IsDeleted=0 and ti.Status=2
	Left JOIN tbl_customer_blanket_po  as cb ON cb.CustomerBlanketPOId= s.CustomerBlanketPOId
	Left Join tbl_customers as C on C.CustomerId = cb.CustomerId
    LEFT JOIN tbl_currencies as CUR ON CUR.CurrencyCode = C.CustomerCurrencyCode AND CUR.IsDeleted = 0
	where s.CustomerBlanketPOId>0 AND s.IsDeleted=0 `;

    if (obj.search.value != '') {
        query = query + ` and (  cb.CustomerPONo LIKE '%${obj.search.value}%'
    or cb.StartingBalance LIKE '%${obj.search.value}%'
    or cb.CurrentBalance LIKE '%${obj.search.value}%'
    or cb.TotalAmount LIKE '%${obj.search.value}%'
  ) `;
    }

    var TokenIdentityType = getLogInIdentityType(obj);
    var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(obj);
    var MultipleCustomerIds = getLogInMultipleCustomerIds(obj);
    var MultipleAccessIdentityIds = getLogInMultipleAccessIdentityIds(obj);



    if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        query += ` and s.CustomerId in(${MultipleCustomerIds}) `;
    }
    if (TokenIdentityType == Constants.CONST_IDENTITY_TYPE_CUSTOMER) {
        query += ` and  s.CustomerId IN (${MultipleAccessIdentityIds})  `;
    }
    if (obj.CustomerId) {
        query += ` and  s.CustomerId=${obj.CustomerId}  `;
    }
    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {

        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "CustomerId":
                    query += " and ( cb.CustomerId LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
                    break;
                case "CustomerPONo":
                    query += " and ( cb.CustomerPONo LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
                    break;
                case "StartingBalance":
                    query += " and ( cb.StartingBalance='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CurrentBalance":
                    query += " and ( cb.CurrentBalance='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }
    query += " Group By s.CustomerBlanketPOId  ";
    var Countquery = `Select Count(Counts) recordsFiltered from ( Select count(*) as Counts ` + query + ` ) as A `;

    var i = 0;
    if (obj.order.length > 0) {
        query += " ORDER BY ";
    }
    for (i = 0; i < obj.order.length; i++) {
        if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
        {
            switch (obj.columns[obj.order[i].column].name) {
                case "CustomerPONo":
                    query += " cb.CustomerPONo " + obj.order[i].dir + " ";
                    break;
                case "StartingBalance":
                    query += " cb.StartingBalance " + obj.order[i].dir + " ";
                    break;
                case "CurrentBalance":
                    query += " cb.CurrentBalance " + obj.order[i].dir + " ";
                    break;
                default:
                    query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + " ";
            }
        }
    }

    if (obj.start != "-1" && obj.length != "-1") {
        query += " LIMIT " + obj.start + "," + (obj.length);
    }
    query = selectquery + query;

    var TotalCountQuery = `Select Count(*) TotalCount
    From tbl_customer_blanket_po where IsDeleted=0 `;

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

            return result(null, {
                data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
                recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
            });

        }
    );

};

CustomerBlanketPO.Delete = (id, result) => {
    con.query("Update tbl_customer_blanket_po set IsDeleted=1 WHERE CustomerBlanketPOId = ?", id, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: " not deleted" }, null);
            return;
        }
        result(null, res);
    });
};

CustomerBlanketPO.getBlanketPOExchangeRate = (CustomerBlanketPOId, result) => {
    // var sql = `Select ExchangeRate from tbl_customer_blanket_po as bpo where bpo.IsDeleted=0 and bpo.IsActive=1 and bpo.CustomerBlanketPOId=${CustomerBlanketPOId}`;
    var sql = `Select ExchangeRate from tbl_customer_blanket_po as bpo where bpo.IsDeleted=0 and bpo.CustomerBlanketPOId=${CustomerBlanketPOId}`;
    //console.log(sql);
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
}
module.exports = CustomerBlanketPO;


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
const EcommerceOrderItem = require("./ecommerce.basket.item.model.js");
const Address = require("../models/customeraddress.model.js");
const CustomerBlanketPOModel = require("../models/customer.blanket.po.model.js");
const EcommerceOrderItemModel = require("../models/ecommerce.order.item.model.js");
const SalesOrder = require("./sales.order.model.js");
const Quotes = require("./quotes.model.js");
const CustomerBlanketPOHistoryModel = require("../models/customer.blanket.po.history.model.js");
const EcommerceOrder = function (obj) {
    this.EcommerceOrderId = obj.EcommerceOrderId;
    this.EcommerceOrderNo = obj.EcommerceOrderNo ? obj.EcommerceOrderNo : '';
    this.CustomerId = obj.CustomerId;
    this.CustomerBlanketPOId = obj.CustomerBlanketPOId ? obj.CustomerBlanketPOId : 0;
    this.CustomerPONo = obj.CustomerPONo ? obj.CustomerPONo : '';
    this.CustomerEmail = obj.CustomerEmail ? obj.CustomerEmail : '';
    this.CustomerBillToId = obj.CustomerBillToId ? obj.CustomerBillToId : 0;
    this.CustomerShipToId = obj.CustomerShipToId ? obj.CustomerShipToId : 0;
    this.GrandTotal = obj.GrandTotal ? obj.GrandTotal : 0;
    this.LocalCurrencyCode = obj.LocalCurrencyCode ? obj.LocalCurrencyCode : '';
    this.ExchangeRate = obj.ExchangeRate ? obj.ExchangeRate : 0;
    this.BaseCurrencyCode = obj.BaseCurrencyCode ? obj.BaseCurrencyCode : '';
    this.BaseGrandTotal = obj.BaseGrandTotal ? obj.BaseGrandTotal : 0;
    this.OrderStatus = obj.OrderStatus ? obj.OrderStatus : 0;
    this.IsAddedByAdmin = obj.IsAddedByAdmin ? obj.IsAddedByAdmin : 1;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;


    const TokenGlobalIdentityId = global.authuser.IdentityId ? global.authuser.IdentityId : 0;
    this.IdentityId = (obj.authuser && obj.authuser.IdentityId) ? obj.authuser.IdentityId : TokenGlobalIdentityId;

    const TokenGlobalIdentityType = global.authuser.IdentityType ? global.authuser.IdentityType : 0;
    this.IdentityType = (obj.authuser && obj.authuser.IdentityType) ? obj.authuser.IdentityType : TokenGlobalIdentityType;

    const TokenIsRestrictedCustomerAccess = global.authuser.IsRestrictedCustomerAccess ? global.authuser.IsRestrictedCustomerAccess : 0;
    this.IsRestrictedCustomerAccess = (obj.authuser && obj.authuser.IsRestrictedCustomerAccess) ? obj.authuser.IsRestrictedCustomerAccess : TokenIsRestrictedCustomerAccess;

    const TokenMultipleCustomerIds = global.authuser.MultipleCustomerIds ? global.authuser.MultipleCustomerIds : 0;
    this.MultipleCustomerIds = (obj.authuser && obj.authuser.MultipleCustomerIds) ? obj.authuser.MultipleCustomerIds : TokenMultipleCustomerIds;

    const TokenMultipleAccessIdentityIds = global.authuser.MultipleAccessIdentityIds ? global.authuser.MultipleAccessIdentityIds : 0;
    this.MultipleAccessIdentityIds = (obj.authuser && obj.authuser.MultipleAccessIdentityIds) ? obj.authuser.MultipleAccessIdentityIds : TokenMultipleAccessIdentityIds;




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

EcommerceOrder.CreateOrder = (reqbody, basket, result) => {
    // reqbody.Basket.authuser = reqbody.authuser;
    var Basket = new EcommerceOrder(basket);
    CustomerBlanketPOModel.GetCurrentBalance(reqbody.CustomerBlanketPOId, (err, data) => {
        if (reqbody.CustomerBlanketPOId > 0) {
            if (!data) {
                return result("Customer Blanket PO is not available.", null);
            }
            data = data[0];
            //console.log(" data = " + data.LocalCurrencyCode);

           // console.log(" Basket = " + Basket.LocalCurrencyCode);

            if (data.CurrentBalance < Basket.GrandTotal) {
                return result("Insufficiant balance in Blanket PO.", null);
            }
            if (data.LocalCurrencyCode != Basket.LocalCurrencyCode) {
                return result("Currency mismatch. Blanket PO current and Order currency not matched.", null);
            }
        }

        sql = `insert into tbl_ecommerce_order(CustomerId,CustomerBlanketPOId,CustomerPONo,CustomerBillToId,CustomerShipToId,GrandTotal,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal,OrderStatus,IsAddedByAdmin,Created,CreatedBy)
               values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        values = [
            Basket.CustomerId, reqbody.CustomerBlanketPOId, reqbody.CustomerPONo, Basket.CustomerBillToId, Basket.CustomerShipToId, Basket.GrandTotal, Basket.LocalCurrencyCode, Basket.ExchangeRate, Basket.BaseCurrencyCode,
            Basket.BaseGrandTotal, Basket.OrderStatus, Basket.IsAddedByAdmin, Basket.Created, Basket.CreatedBy
        ];
        // console.log(sql, values);
        con.query(sql, values, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            if (res && res.insertId) {
                result(null, { id: res.insertId, ...Basket });
            }
        });
    });
}


EcommerceOrder.UpdateEcommerceOrderNo = (obj, result) => {
    var sql = `Update tbl_ecommerce_order  SET EcommerceOrderNo='${obj.EcommerceOrderNo}' WHERE IsDeleted=0 and EcommerceOrderId='${obj.EcommerceOrderId}'`;
    // console.log(sql);
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, { EcommerceOrderNo: obj.EcommerceOrderNo });
        return;
    }
    );
};

EcommerceOrder.checkCustomerIdExists = (CustomerId, result) => {
    var Query = `SELECT EcommerceOrderId FROM tbl_ecommerce_basket WHERE IsDeleted=0 AND CustomerId=${CustomerId}`;
    con.query(Query, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

EcommerceOrder.OrderListClient = (obj, result) => {
    var selectquery = `SELECT DISTINCT  EcommerceOrderNo, EO.CustomerId,EO.CustomerBlanketPOId,EO.CustomerPONo,EO.GrandTotal, c.CompanyName,
    CONCAT('MRO',mro.MROId) as MRONo,
    DATE_FORMAT(EO.Created,'%m/%d/%Y') as Created, CUR.CurrencySymbol,CASE mro.Status 
    WHEN 0 THEN '${Constants.array_mro_status[0]}'
    WHEN 1 THEN '${Constants.array_mro_status[1]}'
    WHEN 2 THEN '${Constants.array_mro_status[2]}'
    WHEN 3 THEN '${Constants.array_mro_status[3]}'
    WHEN 4 THEN '${Constants.array_mro_status[4]}'
    ELSE '-'	end MROStatusName,mro.Status as MROStatus
    FROM tbl_ecommerce_order as EO
LEFT JOIN tbl_mro mro on mro.EcommerceOrderId=EO.EcommerceOrderId
LEFT JOIN tbl_customers c on EO.CustomerId=c.CustomerId 
 LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = EO.LocalCurrencyCode AND CUR.IsDeleted = 0
where EO.IsDeleted=0     `;
    if (obj.CustomerId) {
        selectquery += ` AND EO.CustomerId = ${obj.CustomerId}`;
    }
    //selectquery += ` ORDER BY EO.EcommerceOrderId DESC`;
    con.query(selectquery, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });

}


EcommerceOrder.OrderList = (obj, result) => {

    var selectquery = `SELECT DISTINCT  EcommerceOrderNo, EO.CustomerId,EO.CustomerBlanketPOId,EO.CustomerPONo,EO.GrandTotal, c.CompanyName,
    CONCAT('MRO',mro.MROId) as MRONo,
    DATE_FORMAT(EO.Created,'%m/%d/%Y') as Created, CUR.CurrencySymbol,EO.EcommerceOrderId,CASE mro.Status 
    WHEN 0 THEN '${Constants.array_mro_status[0]}'
    WHEN 1 THEN '${Constants.array_mro_status[1]}'
    WHEN 2 THEN '${Constants.array_mro_status[2]}'
    WHEN 3 THEN '${Constants.array_mro_status[3]}'
    WHEN 4 THEN '${Constants.array_mro_status[4]}'
    ELSE '-'	end MROStatusName,mro.Status as MROStatus,c.CustomerGroupId`;
    var recordfilterquery = `Select count(EO.EcommerceOrderNo) as recordsFiltered `;

    var query = `  FROM tbl_ecommerce_order as EO
LEFT JOIN tbl_mro mro on mro.EcommerceOrderId=EO.EcommerceOrderId
LEFT JOIN tbl_customers c on EO.CustomerId=c.CustomerId 
 LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = EO.LocalCurrencyCode AND CUR.IsDeleted = 0
where EO.IsDeleted=0 `;

    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        query += ` and EO.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    if (obj.IdentityType == 1) {
        query += ` and EO.CustomerId in(${obj.IdentityId}) `;
    }

    if (obj.search.value != '') {
        query = query + ` and (  mro.MRONo LIKE '%${obj.search.value}%'
        or EO.EcommerceOrderNo LIKE '%${obj.search.value}%'
        or c.CompanyName LIKE '%${obj.search.value}%'         
        or EO.Created LIKE '%${obj.search.value}%'         
        or EO.CustomerPONo LIKE '%${obj.search.value}%'       
      ) `;
    }
    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "MRONo":
                    query += " and mro.MRONo = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "EcommerceOrderNo":
                    query += " and EO.EcommerceOrderNo = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "CustomerId":
                    query += " and  EO.CustomerId In(" + obj.columns[cvalue].search.value + ") ";
                    break;
                case "Status":
                    query += " and ( EO.Status = '" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "Created":
                    query += " and ( DATE(EO.Created) ='" + obj.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerGroupId":
                    query += " and (EO.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
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

                default:
                    query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + " ";
                    break;
            }
        }
    }
    var Countquery = recordfilterquery + query;

    if (obj.start != "-1" && obj.length != "-1") {
        query += " LIMIT " + obj.start + "," + (obj.length);
    }
    query = selectquery + query;

    var TotalCountQuery = `SELECT Count(EO.EcommerceOrderNo) as TotalCount 
  FROM tbl_ecommerce_order as EO
  LEFT JOIN tbl_mro mro on mro.EcommerceOrderId=EO.EcommerceOrderId
  LEFT JOIN tbl_customers c on EO.CustomerId=c.CustomerId 
  
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = EO.LocalCurrencyCode AND CUR.IsDeleted = 0
where EO.IsDeleted=0  `;

    if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
        TotalCountQuery += ` and EO.CustomerId in(${obj.MultipleCustomerIds}) `;
    }
    //console.log("query = " + query);
    //console.log("Countquery = " + Countquery);
    // recordsFiltered: results[1][0][0].recordsFiltered
    async.parallel([
        function (result) { con.query(query, result) },
        function (result) { con.query(Countquery, result) },
        function (result) { con.query(TotalCountQuery, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            result(null, {
                data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
                recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
            });
            return;
        }
    );

};

EcommerceOrder.view = (CustomerId) => {
    var sql = `Select EB.*,c.CompanyName,CONCAT(u1.FirstName,' ',u1.LastName) as name,CUR.CurrencySymbol as CustomerCurrencySymbol,CURI.CurrencySymbol from tbl_ecommerce_basket EB
  LEFT JOIN tbl_customers c on EB.CustomerId=c.CustomerId
  LEFT JOIN tbl_users u1 ON u1.UserId = EB.CreatedBy
  LEFT JOIN tbl_currencies CURI ON CURI.CurrencyCode = EB.LocalCurrencyCode AND CURI.IsDeleted = 0
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = c.CustomerCurrencyCode AND CUR.IsDeleted = 0
  WHERE EB.IsDeleted = 0 AND EB.CustomerId='${CustomerId}'`;
    return sql;
}

EcommerceOrder.viewByOrderId = (OrderId) => {
    var sql = `Select EO.*,c.CompanyName,CONCAT(u1.FirstName,' ',u1.LastName) as name,CUR.CurrencySymbol as CustomerCurrencySymbol,CURI.CurrencySymbol,CONCAT('MRO',mro.MROId) as MRONo,
    DATE_FORMAT(EO.Created,'%m/%d/%Y') as CreatedDate,CASE mro.Status 
    WHEN 0 THEN '${Constants.array_mro_status[0]}'
    WHEN 1 THEN '${Constants.array_mro_status[1]}'
    WHEN 2 THEN '${Constants.array_mro_status[2]}'
    WHEN 3 THEN '${Constants.array_mro_status[3]}'
    WHEN 4 THEN '${Constants.array_mro_status[4]}'
    ELSE '-'	end MROStatusName,mro.Status as MROStatus
    from tbl_ecommerce_order EO
  LEFT JOIN tbl_mro mro on mro.EcommerceOrderId=EO.EcommerceOrderId
  LEFT JOIN tbl_customers c on EO.CustomerId=c.CustomerId
  LEFT JOIN tbl_users u1 ON u1.UserId = EO.CreatedBy
  LEFT JOIN tbl_currencies CURI ON CURI.CurrencyCode = EO.LocalCurrencyCode AND CURI.IsDeleted = 0
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = c.CustomerCurrencyCode AND CUR.IsDeleted = 0
  WHERE EO.IsDeleted = 0 AND EO.EcommerceOrderId='${OrderId}'`;
    return sql;
}

// ToDo
EcommerceOrder.orderView = (OrderId, result) => {
    var sql = EcommerceOrder.viewByOrderId(OrderId);
    con.query(sql, (err, res1) => {
        //   console.log(res1)
        //   console.log(err)
        if (err) {
            return result(err, null);
        }
        if (res1.length > 0) {
            var sqlItem = EcommerceOrderItemModel.viewByOrderId(OrderId);
            var sqlBillingAddress = Address.GetAddressByIdQuery(res1[0].CustomerBillToId);
            var sqlShippingAddress = Address.GetAddressByIdQuery(res1[0].CustomerShipToId);
            async.parallel([
                function (result) { con.query(sql, result) },
                function (result) { con.query(sqlItem, result) },
                function (result) { con.query(sqlBillingAddress, result) },
                function (result) { con.query(sqlShippingAddress, result) },
            ],
                function (err, results) {
                    //console.log(results)
                   // console.log(err)
                    if (err) {
                        return result(err, null);
                    }

                    // console.log(results[0][0].length)
                    if (results[0][0].length > 0) {
                        result(null, { OrderInfo: results[0][0], OrderItem: results[1][0], BillingAddress: results[2][0], ShippingAddress: results[3][0] });
                        return;
                    } else {
                        return result({ msg: "Order not found" }, null);
                    }
                });
        }
    })
}

EcommerceOrder.BlanketPOUpdate = (parse, result) => {
    if (parse.CustomerBlanketPOId > 0) {
        async.parallel([
            function (result) { CustomerBlanketPOModel.GetCurrentBalance(parse.CustomerBlanketPOId, result); },
        ], function (err, results) {
            if (err) {
                console.log(err);
                // Reqresponse.printResponse(res, err, null);
            } else {
                var CurrentBalance = results[0].length > 0 ? results[0][0].CurrentBalance : 0;
                var boolean = true;
                if (parse && parse.CustomerBlanketPOId > 0) {
                    boolean = parseFloat(parse.QuoteAmount) <= parseFloat(CurrentBalance) ? true : false;
                    if (boolean) {
                        var DebitHistoryObjCreate = new CustomerBlanketPOHistoryModel({
                            authuser: parse.authuser,
                            BlanketPOId: parse.CustomerBlanketPOId,
                            RRId: 0,
                            MROId: parse.MROId,
                            PaymentType: 2,
                            Amount: parseFloat(parse.QuoteAmount),
                            CurrentBalance: parseFloat(CurrentBalance) - parseFloat(parse.QuoteAmount),
                            QuoteId: parse.QuoteId,
                            Comments: parse.Comments,
                            LocalCurrencyCode: parse.LocalCurrencyCode ? parse.LocalCurrencyCode : 'USD',
                            ExchangeRate: parse.ExchangeRate ? parse.ExchangeRate : 1,
                            BaseCurrencyCode: parse.BaseCurrencyCode ? parse.BaseCurrencyCode : 'USD',
                            BaseAmount: parseFloat(parse.QuoteAmount) * parseFloat(parse.ExchangeRate ? parse.ExchangeRate : 1),
                            BaseCurrentBalance: (parseFloat(CurrentBalance) - parseFloat(parse.QuoteAmount)) * parseFloat(parse.ExchangeRate ? parse.ExchangeRate : 1)
                        });

                        async.parallel([
                            function (result) { CustomerBlanketPOModel.UpdateCurrentBalance(parse.CustomerBlanketPOId, parse.QuoteAmount, result); },
                            function (result) { CustomerBlanketPOHistoryModel.Create(DebitHistoryObjCreate, result); },
                            function (result) {

                            },
                        ],
                            function (err, results) {
                                if (err) {
                                    // Reqresponse.printResponse(res, err, null);
                                }
                            });
                    }
                }
            }
        });
    }
}

module.exports = EcommerceOrder;
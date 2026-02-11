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
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
const RRBulkShipping = function FuncName(Obj) {
    this.BulkShipId = Obj.BulkShipId ? Obj.BulkShipId : 0;
    this.ShipFrom = Obj.ShipFrom ? Obj.ShipFrom : '';
    this.ShipTo = Obj.ShipTo ? Obj.ShipTo : '';
    this.CustomerId = Obj.CustomerId ? Obj.CustomerId : 0;
    this.VendorId = Obj.VendorId ? Obj.VendorId : 0;
    this.RRs = Obj.RRs ? Obj.RRs : '';
    this.ShipVia = Obj.ShipVia ? Obj.ShipVia : 0;
    this.Created = Obj.Created ? Obj.Created : cDateTime.getDateTime();
    this.Modified = Obj.Modified ? Obj.Modified : cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;

    this.authuser = Obj.authuser ? Obj.authuser : {};

    // For Server Side Search 
    this.start = Obj.start;
    this.length = Obj.length;
    this.search = Obj.search;
    this.sortCol = Obj.sortCol;
    this.sortDir = Obj.sortDir;
    this.sortColName = Obj.sortColName;
    this.order = Obj.order;
    this.columns = Obj.columns;
    this.draw = Obj.draw;

};

RRBulkShipping.Create = (objModel, result) => {

    objModel = escapeSqlValues(objModel);
    var sql = `insert into tbl_repair_request_bulk_shipping(
    ShipFrom,ShipTo,CustomerId,VendorId,RRs,ShipVia,Created,CreatedBy)
    values('${objModel.ShipFrom}','${objModel.ShipTo}','${objModel.CustomerId}',
    '${objModel.VendorId}','${objModel.RRs}','${objModel.ShipVia}','${objModel.Created}','${objModel.CreatedBy}')`;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        else {
            return result(null, { id: res.insertId, ...objModel });
        }
    });
};

RRBulkShipping.ServerSideList = (obj, result) => {

    var query = "";
    var selectquery = `Select bs.BulkShipId,bs.ShipFrom,bs.ShipTo, DATE_FORMAT(bs.Created,'%m/%d/%Y') as Created, 
    'Ready for Pick UP' as ShippingStatus,
    IF(ShipTo='Customer',C.CompanyName,V.VendorName) as CustomerVendorName
    
    `;
    recordfilterquery = `Select count(*) as recordsFiltered `;
    query = query + ` From tbl_repair_request_bulk_shipping bs
    LEFT JOIN tbl_customers as C ON C.CustomerId = bs.CustomerId AND bs.CustomerId>0
    LEFT JOIN tbl_vendors as V ON V.VendorId = bs.VendorId AND bs.VendorId>0
    where bs.IsDeleted=0 `;

    var TokenIdentityType = getLogInIdentityType(obj);
    var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(obj);
    var MultipleCustomerIds = getLogInMultipleCustomerIds(obj);

    if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        query += ` and bs.CustomerId in(${MultipleCustomerIds}) `;
    }
    if (obj.search.value != '') {
        query = query + ` and (  
       bs.BulkShipId LIKE '%${obj.search.value}%'
    or bs.ShipFrom LIKE '%${obj.search.value}%'
    or bs.ShipTo LIKE '%${obj.search.value}%'
    or bs.Created LIKE '%${obj.search.value}%'
  ) `;
    }
    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {

        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "ShipFrom":
                    query += " and  bs.ShipFrom LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
                    break;
                default:
                    query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ";
            }
        }
    }

    var i = 0;
    query += " ORDER BY ";
    for (i = 0; i < obj.order.length; i++) {

        if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
        {
            switch (obj.columns[obj.order[i].column].name) {
                default:
                    query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + " ";
            }
        }
    }

    var Countquery = recordfilterquery + query;
    if (obj.start != "-1" && obj.length != "-1") {
        query += " LIMIT " + obj.start + "," + (obj.length);
    }
    query = selectquery + query;

    var TotalCountQuery = `Select count(*) as TotalCount
    From tbl_repair_request_bulk_shipping bs
    where bs.IsDeleted=0 `;
    if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
        TotalCountQuery += ` and bs.CustomerId in(${MultipleCustomerIds}) `;
    }
    // console.log("query = " + query);
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
            result(null, {
                data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
                recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
            });
            return;
        });
};
module.exports = RRBulkShipping;

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
const { escapeSqlValues } = require("../helper/common.function.js");
const RR = require("./repair.request.model.js");
const RRCustomerRef = require("../models/cutomer.reference.labels.model.js");
const RRBatch = function (Obj) {
    this.RRBatchId = Obj.RRBatchId;
    this.RRBatchNo = Obj.RRBatchNo;
    this.CustomerId = Obj.CustomerId ? Obj.CustomerId : 0;
    this.RRId = Obj.RRId ? Obj.RRId : 0;
    
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;


    // For Server Side Search 
    this.start = Obj.start;
    this.length = Obj.length;
    this.search = Obj.search;
    this.draw = Obj.draw;
    this.columns = Obj.columns;

    this.sortCol = Obj.sortCol;
    this.sortDir = Obj.sortDir;
    this.sortColName = Obj.sortColName;
    this.order = Obj.order;
    this.columns = Obj.columns;
    this.draw = Obj.draw;

};

// Get Search List by Filter
RRBatch.ListByServerSide = (RRBatch, result) => {

    var query = "";
    var selectquery = "";

    selectquery = ` SELECT DISTINCT e.RRBatchId,e.RRBatchNo,e.CustomerId,c.CompanyName,DATE_FORMAT(e.Created,'%Y-%m-%d %H:%i:%s') AS Created,CONCAT(u.FirstName,' ',u.LastName) as CreatedByName,e.CreatedBy,
    (SELECT GROUP_CONCAT(RRId) FROM tbl_repair_request WHERE RRBatchId = e.RRBatchId AND IsDeleted=0 ) as RRId, c.CustomerGroupId`;
    recordfilterquery = `Select count(e.RRBatchId) as recordsFiltered `;
    query = query + ` FROM tbl_repair_request_batch as e 
    LEFT JOIN tbl_repair_request a ON a.RRBatchId=e.RRBatchId
    LEFT JOIN tbl_customers c on e.CustomerId=c.CustomerId
    LEFT JOIN tbl_users u on e.CreatedBy=u.UserId
    where e.IsDeleted=0 `;

    if (RRBatch.search.value != '') {
        query = query + ` and (  e.RRBatchId LIKE '%${RRBatch.search.value}%'
              or e.RRBatchNo LIKE '%${RRBatch.search.value}%' 
              or e.CustomerId LIKE '%${RRBatch.search.value}%') `;
    }



    var cvalue = 0;
    for (cvalue = 0; cvalue < RRBatch.columns.length; cvalue++) {
        if (RRBatch.columns[cvalue].search.value != "") {
            switch (RRBatch.columns[cvalue].name) {
                case "RRBatchId":
                    query += " and  e.RRBatchId = '" + RRBatch.columns[cvalue].search.value + "'  ";
                    break;
                case "RRBatchNo":
                    query += " and  e.RRBatchNo  = '" + RRBatch.columns[cvalue].search.value + "'  ";
                    break;
                case "CustomerId":
                    // query += " and  e.CustomerId  = '" + RRBatch.columns[cvalue].search.value + "' ";
                    query += " and  e.CustomerId In(" + RRBatch.columns[cvalue].search.value + ") ";
                    break;
                case "CompanyName":
                    // query += " and  e.CustomerId  = '" + RRBatch.columns[cvalue].search.value + "' ";
                    query += " and  e.CustomerId In(" + RRBatch.columns[cvalue].search.value + ") ";
                    break;
                case "RRId":
                    query += " and  a.RRId = '" + RRBatch.columns[cvalue].search.value + "' ";
                    break;
                case "Created":
                    query += " and ( DATE(e.Created) ='" + RRBatch.columns[cvalue].search.value + "' ) ";
                    break;
                case "CreatedByName":
                    query += " and ( e.CreatedBy='" + RRBatch.columns[cvalue].search.value + "' ) ";
                    break;
                case "CustomerGroupId":
                    query += " and (e.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + RRBatch.columns[cvalue].name + " IN (" + RRBatch.columns[cvalue].search.value + "))) ";
                    break;
                default:
                    // query += " and ( " + RRBatch.columns[cvalue].name + " LIKE '%" + RRBatch.columns[cvalue].search.value + "%' ) ";
            }
        }
    }

    query += " ORDER BY e." + RRBatch.columns[RRBatch.order[0].column].name + " " + RRBatch.order[0].dir;

    var Countquery = recordfilterquery + query;

    if (RRBatch.start != "-1" && RRBatch.length != "-1") {
        query += " LIMIT " + RRBatch.start + "," + (RRBatch.length);
    }
    query = selectquery + query;
//console.log(query);
    var TotalCountQuery = `SELECT Count(e.RRBatchId) as TotalCount 
    FROM tbl_repair_request_batch as e
    where e.IsDeleted=0 `;
    async.parallel([
        function (result) { con.query(query, result) },
        function (result) { con.query(Countquery, result) },
        function (result) { con.query(TotalCountQuery, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            // console.log("TotalCount : " + results[2][0][0].TotalCount)
            result(null, { data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered, recordsTotal: results[2][0][0].TotalCount, draw: RRBatch.draw });
            return;
        }
    );

};


RRBatch.Create = (params, result) => {
    var Obj = new RRBatch(params);
    var sql = `insert into tbl_repair_request_batch(RRId,CustomerId,Created,CreatedBy) values(?,?,?,?)`;
    var values = [ Obj.RRId, Obj.CustomerId, Obj.Created, Obj.CreatedBy ]
    con.query(sql, values, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }else{
            var RRBatchNo = 'BRR'+res.insertId;
            var sqlUpdate = ``;
            sqlUpdate = ` UPDATE tbl_repair_request_batch SET RRBatchNo= ? WHERE RRBatchId = ? `;
            var valuesUpdate = [RRBatchNo, res.insertId]
            con.query(sqlUpdate, valuesUpdate, (err1, res1) => {
                if (err1) {
                return result(null, err);
                }
                return result(null, { id: res.insertId });
            });
            // return result(null, { id: res.insertId });
        }
        
    });
};

// getRRForLoopQR

RRBatch.getRRForLoopQR = (reqBody, result) => {
    var arr = [];
    var splitArray = reqBody.RRId.split(',');
    var itemProcessed = 0;
    splitArray.forEach(element => {
        //console.log(element);
        var RRId = element;
        var sql = RR.viewquery(RRId, reqBody);
        con.query(sql, (err, res) => {
            if (err)
                return result(err, null);

            if (res.length > 0) {
                var sqlRRCustomerRef = RRCustomerRef.ViewCustomerReference(RRId);
                async.parallel([
                    function (result) { con.query(sql, result) },
                    function (result) { con.query(sqlRRCustomerRef, result) },
                ],
                    function (err, results) {
                        itemProcessed++;
                        if (err) {
                            console.log(err);
                            return result(err, null);
                        }
                        // console.log(results[32]);
                        arr.push({
                            RRInfo: results[0][0], CustomerRefInfo: results[1][0],
                        })
                        if(itemProcessed === splitArray.length){
                            result(null, arr);
                        return;
                        }
                    }
                );
            } else {
                itemProcessed++;
                if(itemProcessed === splitArray.length){
                    result({ msg: "RR not found" }, null);
                    return;
                }
            }

        })
        // TempRFIDModel.remove(element.RFIDTagNo, (err, data) => {
        //     itemProcessed++;
        //     if(itemProcessed === res.length){
        //         // return result(null, data);
        //         return result(null, data)
        //     }

        // });
    })

};

module.exports = RRBatch;

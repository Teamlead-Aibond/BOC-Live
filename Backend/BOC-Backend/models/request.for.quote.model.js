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

const RequestForQuoteModel = function (obj) {
    this.RequestQuoteId = obj.RequestQuoteId ? obj.RequestQuoteId : 0;
    this.RequestQuoteNo = obj.RequestQuoteNo ? obj.RequestQuoteNo : '';
    this.PartNo = obj.PartNo ? obj.PartNo : '';
    this.Manufacturer = obj.Manufacturer ? obj.Manufacturer : '';
    this.Priority = obj.Priority ? obj.Priority : 0;
    this.CustomerId = obj.CustomerId ? obj.CustomerId : 0;
    this.ContactName = obj.ContactName ? obj.ContactName : '';
    this.ContactNumber = obj.ContactNumber ? obj.ContactNumber : '';
    this.ContactEmail = obj.ContactEmail ? obj.ContactEmail : '';
    this.ContactPlant = obj.ContactPlant ? obj.ContactPlant : '';
    this.Comments = obj.Comments ? obj.Comments : '';
    this.AdminComments = obj.AdminComments ? obj.AdminComments : '';
    this.CommentsUpdatedDate = cDateTime.getDateTime();
    this.CommentsUpdatedBy = obj.CommentsUpdatedBy ? obj.CommentsUpdatedBy : 0;
    this.Status = obj.Status ? obj.Status : 0;
    this.Created = cDateTime.getDateTime();
    // const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = obj.CreatedBy ? obj.CreatedBy : 0;
    this.Modified = cDateTime.getDateTime();
    this.ModifiedBy = obj.ModifiedBy ? obj.ModifiedBy : 0;


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

//To get all the RequestForQuote
RequestForQuoteModel.getAll = result => {
    con.query(`Select RequestQuoteId,RequestQuoteNo,PartNo,Manufacturer,Priority,CustomerId,ContactName,ContactNumber,ContactEmail,ContactPlant,Comments,AdminComments,CommentsUpdatedDate,CommentsUpdatedBy,Status,Created,CreatedBy,Modified,ModifiedBy from tbl_request_for_quote WHERE IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

// RequestForQuoteModel.RequestForQuoteListByServerSide = (RequestForQuoteModel, result) => {

//     var query = "";
//     selectquery = "";

//     selectquery = `Select RequestQuoteId,RequestQuoteNo,PartNo,Manufacturer,Priority,CustomerId,ContactName,ContactNumber,ContactEmail,ContactPlant,Comments,AdminComments,CommentsUpdatedDate,CommentsUpdatedBy,Status,Created,CreatedBy,Modified,ModifiedBy`;

//     recordfilterquery = `Select count(RequestQuoteId) as recordsFiltered`;

//     query = query + ` from tbl_request_for_quote WHERE IsDeleted = 0`;

//     if (RequestForQuoteModel.search.value != '') {
//         query = query + ` and (RequestQuoteId LIKE '%${RequestForQuoteModel.search.value}%'
//         or RequestQuoteNo LIKE '%${RequestForQuoteModel.search.value}%' 
//         or PartNo LIKE '%${RequestForQuoteModel.search.value}%' 
//         or Manufacturer LIKE '%${RequestForQuoteModel.search.value}%' 
//         or Priority LIKE '%${RequestForQuoteModel.search.value}%' 
//         or CustomerId LIKE '%${RequestForQuoteModel.search.value}%' 
//         or ContactName LIKE '%${RequestForQuoteModel.search.value}%' 
//         or ContactNumber LIKE '%${RequestForQuoteModel.search.value}%' 
//         or ContactEmail LIKE '%${RequestForQuoteModel.search.value}%' 
//         or ContactPlant LIKE '%${RequestForQuoteModel.search.value}%' 
//         or Comments LIKE '%${RequestForQuoteModel.search.value}%' 
//         or AdminComments LIKE '%${RequestForQuoteModel.search.value}%' 
//         or Status LIKE '%${RequestForQuoteModel.search.value}%'
//         or Created LIKE '%${RequestForQuoteModel.search.value}%' 
//         or CreatedBy LIKE '%${RequestForQuoteModel.search.value}%' 
//         ) `;
//     }
//     var Countquery = recordfilterquery + query;

//     if (RequestForQuoteModel.start != "-1" && RequestForQuoteModel.length != "-1") {
//         query += " LIMIT " + RequestForQuoteModel.start + "," + (RequestForQuoteModel.length);
//     }
//     query = selectquery + query;

//     var TotalCountQuery = `SELECT Count(RequestQuoteId) as TotalCount 
//       from tbl_request_for_quote where IsDeleted = 0`;

//     console.log("query = " + query);
//     console.log("Countquery = " + Countquery);
//      console.log("TotalCountQuery = " + TotalCountQuery);

//     async.parallel([
//         function (result) { con.query(query, result) },
//         function (result) { con.query(Countquery, result) },
//         function (result) { con.query(TotalCountQuery, result) }
//     ],
//         function (err, results) {
//             if (err)
//                 return result(err, null);

//             // console.log("TotalCount : " + results[2][0][0].TotalCount)
//             // if (results[0][0].length > 0) {
//             result(null, {
//                 data: results[0][0],
//                 recordsFiltered: results[1][0][0].recordsFiltered,
//                 recordsTotal: results[2][0][0].TotalCount, draw: RequestForQuoteModel.draw
//             });
//             return;
//             // }
//             // else {
//             //   result(null, "No record");
//             //   return;
//             // }
//         }
//     );

// };

RequestForQuoteModel.RequestForQuoteListByServerSide = (obj, result) => {


    var selectquery = `Select RequestQuoteId,RequestQuoteNo,PartNo,Manufacturer,Priority,CustomerId,ContactName,ContactNumber,ContactEmail,ContactPlant,Comments,AdminComments,DATE_FORMAT(CommentsUpdatedDate,'%m/%d/%Y') as CommentsUpdatedDate,CommentsUpdatedBy,Status,DATE_FORMAT(Created,'%m/%d/%Y') as Created,CreatedBy,DATE_FORMAT(Modified,'%m/%d/%Y') as Modified,ModifiedBy`;

    var recordfilterquery = `Select count(RequestQuoteId) as recordsFiltered`;

    var query = ` from tbl_request_for_quote WHERE IsDeleted = 0`;

    if (obj.search.value != '') {
        query = query + ` and (RequestQuoteId LIKE '%${RequestForQuoteModel.search.value}%'
        or RequestQuoteNo LIKE '%${RequestForQuoteModel.search.value}%' 
        or PartNo LIKE '%${RequestForQuoteModel.search.value}%' 
        or Manufacturer LIKE '%${RequestForQuoteModel.search.value}%' 
        or Priority LIKE '%${RequestForQuoteModel.search.value}%' 
        or CustomerId LIKE '%${RequestForQuoteModel.search.value}%' 
        or ContactName LIKE '%${RequestForQuoteModel.search.value}%' 
        or ContactNumber LIKE '%${RequestForQuoteModel.search.value}%' 
        or ContactEmail LIKE '%${RequestForQuoteModel.search.value}%' 
        or ContactPlant LIKE '%${RequestForQuoteModel.search.value}%' 
        or Comments LIKE '%${RequestForQuoteModel.search.value}%' 
        or AdminComments LIKE '%${RequestForQuoteModel.search.value}%' 
        or Status LIKE '%${RequestForQuoteModel.search.value}%'
        or Created LIKE '%${RequestForQuoteModel.search.value}%' 
        or CreatedBy LIKE '%${RequestForQuoteModel.search.value}%' 
        ) `;
    }

    var cvalue = 0;
    for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
        if (obj.columns[cvalue].search.value != "") {
            switch (obj.columns[cvalue].name) {
                case "RequestQuoteId":
                    query += " and RequestQuoteId = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "RequestQuoteNo":
                    query += " and RequestQuoteNo = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "PartNo":
                    query += " and PartNo = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "Manufacturer":
                    query += " and Manufacturer = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "Priority":
                    query += " and Priority = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "CustomerId":
                    query += " and CustomerId = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "ContactName":
                    query += " and ContactName = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "ContactNumber":
                    query += " and ContactNumber = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "ContactEmail":
                    query += " and ContactEmail = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "ContactPlant":
                    query += " and ContactPlant = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "Comments":
                    query += " and Comments = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "AdminComments":
                    query += " and AdminComments = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                case "Status":
                    query += " and Status = '" + obj.columns[cvalue].search.value + "' ";
                    break;
                default:
                    query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
            }
        }
    }

    var Countquery = selectquery + query;
    if (obj.start != "-1" && obj.length != "-1") {
        query += " order by RequestQuoteId desc LIMIT " + obj.start + "," + (obj.length);
    }
    query = selectquery + query;
    //console.log(query)
    var TotalCountQuery = `SELECT Count(RequestQuoteId) as TotalCount 
    from tbl_request_for_quote where IsDeleted=0`;

    async.parallel([
        function (result) { con.query(query, result) },
        function (result) { con.query(Countquery, result) },
        function (result) { con.query(TotalCountQuery, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            result(null, {
                data: results[0][0], recordsFiltered: results[1][0].length,
                recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
            });
            return;
        }
    );
};

//To create a RequestForQuote
RequestForQuoteModel.create = (Obj, result) => {
    var sql = `insert into tbl_request_for_quote(RequestQuoteNo,PartNo,Manufacturer,Priority,CustomerId,ContactName,ContactNumber,ContactEmail,ContactPlant,Comments,AdminComments,Status,Created,CreatedBy) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    var values = [Obj.RequestQuoteNo, Obj.PartNo, Obj.Manufacturer, Obj.Priority, Obj.CustomerId, Obj.ContactName, Obj.ContactNumber, Obj.ContactEmail, Obj.ContactPlant, Obj.Comments, Obj.AdminComments, Obj.Status, Obj.Created, Obj.CreatedBy];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        Obj.Priority = Obj.Priority == 1 ? Constants.CONST_PRIORITY[1] : Obj.Priority == 2 ? Constants.CONST_PRIORITY[2] : 'Low'

        return result(null, { id: res.insertId, ...Obj });
    });
};

RequestForQuoteModel.GetCustomerCompanyFromCustomerId = (CustomerId, result) => {
    var sql = `SELECT CompanyName
    FROM tbl_customers 
    where IsDeleted=0 and CustomerId='${CustomerId}'`;
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, res);
    });
};

//To get the RequestForQuote info
RequestForQuoteModel.findById = (RequestQuoteId, result) => {
    var sql = `SELECT RequestQuoteId,RequestQuoteNo,PartNo,Manufacturer,Priority,CustomerId,ContactName,ContactNumber,
    ContactEmail,ContactPlant,Comments,AdminComments,CommentsUpdatedDate,CommentsUpdatedBy,Status,Created,
    CreatedBy,Modified,ModifiedBy from tbl_request_for_quote WHERE RequestQuoteId = ${RequestQuoteId} AND IsDeleted = 0 `;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        if (res.length) {
            return result(null, res[0]);
        }
        return result({ msg: "Quote not found" }, null);
    });
};

//To update the RequestForQuote
RequestForQuoteModel.update = (Obj, result) => {
    var sql = ` UPDATE tbl_request_for_quote SET RequestQuoteNo = ?,PartNo = ?,Manufacturer = ?,Priority = ?,CustomerId = ?,ContactName = ?,ContactNumber = ?,ContactEmail = ?,ContactPlant = ?,Comments = ?,AdminComments = ?,CommentsUpdatedDate = ?,CommentsUpdatedBy = ?,Status = ?,Modified = ?,Modifiedby = ?  WHERE RequestQuoteId = ? `;
    var values = [Obj.RequestQuoteNo, Obj.PartNo, Obj.Manufacturer, Obj.Priority, Obj.CustomerId, Obj.ContactName, Obj.ContactNumber, Obj.ContactEmail, Obj.ContactPlant, Obj.Comments, Obj.AdminComments, Obj.CommentsUpdatedDate, Obj.CommentsUpdatedBy, Obj.Status, Obj.Modified, Obj.Modifiedby, Obj.RequestQuoteId];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        if (res.affectedRows == 0)
            return result({ msg: "Quote not updated!" }, null);
        result(null, { id: Obj.RequestQuoteId, ...Obj });
    });
};

RequestForQuoteModel.EditRequest = (Obj, result) => {
    var sql = ` UPDATE tbl_request_for_quote SET AdminComments = ?,CommentsUpdatedDate = ?,CommentsUpdatedBy = ?,Status = ?,Modified = ?,Modifiedby = ?  WHERE RequestQuoteId = ? `;
    var values = [Obj.AdminComments, Obj.CommentsUpdatedDate, global.authuser.UserId, Obj.Status, Obj.Modified, global.authuser.UserId, Obj.RequestQuoteId];
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        if (res.affectedRows == 0)
            return result({ msg: "Comment not updated!" }, null);
        result(null, { id: Obj.RequestQuoteId, ...Obj });
    });
};

//To remove the RequestForQuote
RequestForQuoteModel.remove = (id, result) => {
    var sql = `UPDATE tbl_request_for_quote SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE RequestQuoteId = '${id}' `;
    con.query(sql, (err, res) => {
        if (err)
            return result(null, err);
        if (res.affectedRows == 0)
            return result({ msg: "Quote not deleted" }, null);
        return result(null, res);
    });
};
module.exports = RequestForQuoteModel;
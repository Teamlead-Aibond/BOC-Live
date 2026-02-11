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
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
const EdiModel = function (obj) {
  this.InvoiceEdiId = obj.InvoiceEdiId;
  this.InvoiceNo = obj.InvoiceNo ? obj.InvoiceNo : '';
  this.InvoiceId = obj.InvoiceId ? obj.InvoiceId : '';
  this.EdiStatus = obj.EdiStatus;
  this.Comments = obj.Comments ? obj.Comments : '';
  this.EdiResponse = obj.EdiResponse ? obj.EdiResponse : '';

  this.authuser = obj.authuser ? obj.authuser : {};

  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

//To get all the InvoiceEdi status
EdiModel.getStatusList = result => {
  return result(null, Constants.array_ediStatus);
}

//To create a InvoiceEdi
EdiModel.create = (Obj, result) => {

  var sql = `insert into tbl_invoice_edi(InvoiceId,InvoiceNo,EdiStatus,Comments,EdiResponse,Created,CreatedBy) values(?,?,?,?,?,?,?)`;
  var values = [Obj.InvoiceId, Obj.InvoiceNo, Obj.EdiStatus, Obj.Comments, Obj.EdiResponse, Obj.Created, Obj.CreatedBy];

  var update_query = `update tbl_invoice SET IsEDIUpload = ? WHERE InvoiceId = ?`;
  var values_update = [1, Obj.InvoiceId];

  async.parallel([
    function (result) { con.query(sql, values, result) },
    function (result) { con.query(update_query, values_update, result) }
  ],
    function (err, results) {
      if (err) {
        console.log(err);
        result(err, null);
      }
      return result(null, Obj);
    }
  );



};

//To get the InvoiceEdi
EdiModel.findById = (InvoiceEdiId, result) => {
  var sql = `SELECT ie.InvoiceId,ie.InvoiceNo,ie.EdiStatus,ie.Comments,ie.EdiResponse,ie.CreatedBy,ie.ModifiedBy,DATE_FORMAT(ie.Created,'%m/%d/%Y') as Created,
  DATE_FORMAT(ie.Modified,'%m/%d/%Y') as Modified,CONCAT(u.FirstName,' ',u.LastName) as CreatedByName,CONCAT(u1.FirstName,' ',u1.LastName) as ModifiedByName, 
  c.CompanyName,i.CustomerId  FROM tbl_invoice_edi ie  
  LEFT JOIN tbl_invoice i on i.InvoiceId=ie.InvoiceId
  LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
  LEFT JOIN tbl_users u on ie.CreatedBy=u.UserId
  LEFT JOIN tbl_users u1 on ie.ModifiedBy=u1.UserId
  WHERE ie.InvoiceEdiId = ${InvoiceEdiId} `;
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res[0]);
    }
    return result({ msg: "InvoiceEdi not found" }, null);
  });
};

//To update the InvoiceEdi
EdiModel.update = (Obj, result) => {
  var sql = ` UPDATE tbl_invoice_edi SET EdiStatus = ?, Comments = ?, Modified = ?,Modifiedby = ?  WHERE InvoiceEdiId = ? `;
  var values = [Obj.EdiStatus, Obj.Comments, Obj.Modified, Obj.Modifiedby, Obj.InvoiceEdiId];
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "InvoiceEdi not updated!" }, null);
    result(null, { id: Obj.InvoiceEdiId, ...Obj });
  });
};

EdiModel.getAll = (obj, result) => {


  var query = "";
  var selectquery = `Select ie.InvoiceEdiId,ie.InvoiceId,ie.InvoiceNo,ie.EdiStatus,ie.Comments,ie.EdiResponse,ie.CreatedBy,ie.ModifiedBy,
    DATE_FORMAT(ie.Created,'%m/%d/%Y') as Created,DATE_FORMAT(ie.Modified,'%m/%d/%Y') as Modified,
    CONCAT(u.FirstName,' ',u.LastName) as CreatedByName,CONCAT(u1.FirstName,' ',u1.LastName) as ModifiedByName,c.CompanyName,i.CustomerId,'' as CreatedFrom, '' as CreatedTo,
    i.CustomerBlanketPOId, i.CustomerPONo,c.CustomerGroupId`;

  recordfilterquery = `Select count(ie.InvoiceEdiId) as recordsFiltered `;

  // query = query + ` From tbl_invoice_consolidate ic
  // Left Join tbl_invoice_consolidate_detail icd on icd.ConsolidateInvoiceId=ic.ConsolidateInvoiceId
  // Left Join tbl_customers c on c.CustomerId=ic.CustomerId
  // LEFT JOIN tbl_users u on ic.CreatedBy=u.UserId
  // where ic.IsDeleted=0 `;


  query = query + ` From tbl_invoice_edi ie
    LEFT JOIN tbl_invoice i on i.InvoiceId=ie.InvoiceId
    LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
    LEFT JOIN tbl_users u on ie.CreatedBy=u.UserId
    LEFT JOIN tbl_users u1 on ie.ModifiedBy=u1.UserId
    where ie.IsDeleted=0 `;

  var TokenIdentityType = getLogInIdentityType(obj);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(obj);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(obj);

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    query += ` and i.CustomerId in(${MultipleCustomerIds}) `;
  }
  if (obj.search.value != '') {
    query = query + ` and (  i.CustomerPONo LIKE '%${obj.search.value}%'
    or ie.InvoiceEdiId LIKE '%${obj.search.value}%'
    or i.CustomerId LIKE '%${obj.search.value}%'
    or ie.EdiStatus LIKE '%${obj.search.value}%'
    or ie.Comments LIKE '%${obj.search.value}%'
    or c.CompanyName LIKE '%${obj.search.value}%'
    or ie.InvoiceId LIKE '%${obj.search.value}%'
    or ie.InvoiceNo LIKE '%${obj.search.value}%'
    or ie.Created LIKE '%${obj.search.value}%'
    or i.CustomerBlanketPOId LIKE '%${obj.search.value}%'
    or i.CustomerPONo LIKE '%${obj.search.value}%'
  ) `;
  }

  var cvalue = 0;
  var CreatedFrom = CreatedTo = '';
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {

    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "CustomerId":
          // var INos = "'" + obj.columns[cvalue].search.value.split(",").join("','") + "'";
          query += " and i.CustomerId In (" + obj.columns[cvalue].search.value + ") ";
          break;
        case "InvoiceEdiId":
          query += " and ( ie.InvoiceEdiId='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "EdiStatus":
          query += " and ( ie.EdiStatus='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "InvoiceId":
          query += " and ( ie.InvoiceId='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "InvoiceNo":
          query += " and ( ie.InvoiceNo='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( DATE(ie.Created) ='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedBy":
          query += " and ( ie.CreatedBy='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Comments":
          query += " and ( ie.Comments LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "CreatedFrom":
          CreatedFrom = obj.columns[cvalue].search.value;
          break;
        case "CreatedTo":
          CreatedTo = obj.columns[cvalue].search.value;
          break;
        case "CustomerPONo":
          query += " and ( i.CustomerPONo = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerBlanketPOId":
          query += " and ( i.CustomerBlanketPOId = '" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerGroupId":
          query += " and (i.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  if (CreatedFrom != '' && CreatedTo != '') {
    query += " and ( DATE(ie.Created) >= '" + CreatedFrom + "' and DATE(ie.Created) <= '" + CreatedTo + "' ) ";
  }
  else {
    if (CreatedFrom != '') {
      query += " and ( DATE(ie.Created) >= '" + CreatedFrom + "' ) ";
    }
    if (CreatedTo != '') {
      query += " and ( DATE(ie.Created) <= '" + CreatedTo + "' ) ";
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
          query += " i.CustomerId " + obj.order[i].dir + ",";
          break;
        case "InvoiceEdiId":
          query += " ie.InvoiceEdiId " + obj.order[i].dir + ",";
          break;
        case "InvoiceId":
          query += " ie.InvoiceId " + obj.order[i].dir + ",";
          break;
        case "InvoiceNo":
          query += " ie.InvoiceNo " + obj.order[i].dir + ",";
          break;
        case "Created":
          query += " ie.Created " + obj.order[i].dir + ",";
          break;
        default:
          query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + ",";
      }
    }
  }

  var tempquery = query.slice(0, -1);
  var query = tempquery;
  // var Countquery = recordfilterquery + query;
  var Countquery = selectquery + query;
  if (obj.start != "-1" && obj.length != "-1") {
    query += " LIMIT " + obj.start + "," + (obj.length);
  }

  query = selectquery + query;

  var TotalCountQuery = `Select count(InvoiceEdiId) as TotalCount
    From tbl_invoice_edi ie where ie.IsDeleted=0 `;

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    TotalCountQuery += ` and ic.CustomerId in(${MultipleCustomerIds}) `;
  }

  // console.log("query = " + query);
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
      // results[1][0][0] && results[1][0][0].recordsFiltered != '' &&  results[1][0][0].recordsFiltered != undefined ? results[1][0][0].recordsFiltered : 0
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0].length,
        recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
      });
      return;
    }
  );
}

EdiModel.listByInvoiceId = (InvoiceId) => {
  return sql = `SELECT ie.InvoiceId,ie.InvoiceNo,ie.EdiStatus,ie.Comments,ie.CreatedBy,ie.ModifiedBy,
  ie.EdiResponse,DATE_FORMAT(ie.Created,'%m/%d/%Y') as Created,DATE_FORMAT(ie.Modified,'%m/%d/%Y') as Modified,
  CONCAT(u.FirstName,' ',u.LastName) as CreatedByName,CONCAT(u1.FirstName,' ',u1.LastName) as ModifiedByName, c.CompanyName,i.CustomerId  
  FROM tbl_invoice_edi ie  
  LEFT JOIN tbl_invoice i on i.InvoiceId=ie.InvoiceId
  LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
  LEFT JOIN tbl_users u on ie.CreatedBy=u.UserId
  LEFT JOIN tbl_users u1 on ie.ModifiedBy=u1.UserId
  WHERE ie.InvoiceId = ${InvoiceId} `;

}


//To remove the InvoiceEdi
// EdiModel.remove = (InvoiceEdiId, result) => {
//   var sql = `UPDATE tbl_invoice_edi SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE InvoiceEdiId = '${InvoiceEdiId}' `;
//   con.query(sql, (err, res) => {
//     if (err)
//       return result(null, err);
//     if (res.affectedRows == 0)
//       return result({ msg: "InvoiceEdi not deleted" }, null);
//     return result(null, res);
//   });
// };
module.exports = EdiModel;
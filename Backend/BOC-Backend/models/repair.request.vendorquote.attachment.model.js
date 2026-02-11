/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
const { escapeSqlValues } = require("../helper/common.function.js");
var async = require('async');

const VendorQuoteAttachmentModel = function FuncName(objAttachment) {
  this.VQAttachmentId = objAttachment.VQAttachmentId;
  this.RRId = objAttachment.RRId ? objAttachment.RRId : 0;
  this.VendorAttachment = objAttachment.VendorAttachment ? objAttachment.VendorAttachment : '';
  this.VendorId = objAttachment.VendorId ? objAttachment.VendorId : 0;
  this.RecomPrice = objAttachment.RecomPrice ? objAttachment.RecomPrice : 0;
  this.VendorCost = objAttachment.VendorCost ? objAttachment.VendorCost : 0;
  this.RecomPriceUpdatedDate = cDateTime.getDateTime();;
  this.InternalNotes = objAttachment.InternalNotes ? objAttachment.InternalNotes : '';
  this.ApproverFeedback = objAttachment.ApproverFeedback ? objAttachment.ApproverFeedback : '';

  this.Created = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objAttachment.authuser && objAttachment.authuser.UserId) ? objAttachment.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objAttachment.authuser && objAttachment.authuser.UserId) ? objAttachment.authuser.UserId : TokenUserId;
  this.RecomPriceUpdatedBy = (objAttachment.authuser && objAttachment.authuser.UserId) ? objAttachment.authuser.UserId : TokenUserId;
  this.Modified = cDateTime.getDateTime();

  this.RRId = objAttachment.RRId ? objAttachment.RRId : '';
  this.UserName = objAttachment.UserName ? objAttachment.UserName : '';
  this.CustomerId = objAttachment.CustomerId ? objAttachment.CustomerId : '';
  this.Status = objAttachment.Status ? objAttachment.Status : '';
  this.CustomerGroupId = objAttachment.CustomerGroupId ? objAttachment.CustomerGroupId : '';

  this.VQAttachmentIds = objAttachment.VQAttachmentIds ? objAttachment.VQAttachmentIds : '';
  this.start = objAttachment.start;
  this.length = objAttachment.length;
  this.search = objAttachment.search;
  this.sortCol = objAttachment.sortCol;
  this.sortDir = objAttachment.sortDir;
  this.sortColName = objAttachment.sortColName;
  this.order = objAttachment.order;
  this.columns = objAttachment.columns;
  this.draw = objAttachment.draw;
};
VendorQuoteAttachmentModel.create = (objModel, result) => {
  VendorQuoteAttachmentModel.checkExists(objModel, (err1, data) => {
    if (data && data.length > 0) {
      var errMsg = "Vendor Quote Attachment for  " + data[0].RRNo + " is already exists!"
      // var errMsg = "RR " + objModel.RRId + " already exists!";
      result(errMsg, null);
    } else {
      objModel = escapeSqlValues(objModel);
      var sql = `insert into tbl_repair_request_vq_attachment(RRId,VendorAttachment,VendorCost,VendorId,RecomPrice,InternalNotes,ApproverFeedback,Created,CreatedBy) 
    values(
      '${objModel.RRId}','${objModel.VendorAttachment}','${objModel.VendorCost}','${objModel.VendorId}',
      '${objModel.RecomPrice}','${objModel.InternalNotes}','${objModel.ApproverFeedback}','${objModel.Created}','${objModel.CreatedBy}'
        )`;
      // console.log("RRA ADD: " + sql);
      con.query(sql, (err, res) => {
        if (err) {
          // console.log("error: ", err);
          result(err, null);
          return;
        }
        objModel.VQAttachmentId = res.insertId;
        // console.log("created new RRAttachment : ", { id: res.insertId, ...objModel });
        result(null, { id: res.insertId, ...objModel });
      });
    }
  })
};


VendorQuoteAttachmentModel.getAll1 = (result) => {

  var sql = `SELECT a.RRId,a.VendorAttachment,a.VendorCost,a.VendorId,a.RecomPrice,a.RecomPriceUpdatedBy,a.InternalNotes,a.ApproverFeedback,DATE_FORMAT(a.created,'%Y-%m-%d'),DATE_FORMAT(a.RecomPriceUpdatedDate,'%Y-%m-%d') as RecomPriceUpdatedDate,
  RR.Status,
  CASE RR.Status
  WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}'
  WHEN 2 THEN '${Constants.array_rr_status[2]}'
  WHEN 3 THEN '${Constants.array_rr_status[3]}'
  WHEN 4 THEN '${Constants.array_rr_status[4]}'
  WHEN 5 THEN '${Constants.array_rr_status[5]}'
  WHEN 6 THEN '${Constants.array_rr_status[6]}'
  WHEN 7 THEN '${Constants.array_rr_status[7]}'
  WHEN 8 THEN '${Constants.array_rr_status[8]}'
  ELSE '-'	end StatusName,u.UserName as CreatedByName,u1.UserName as RecomPriceUpdatedByName, RR.PartPON
  FROM tbl_repair_request_vq_attachment  a
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = a.RRId AND RR.IsDeleted = 0
  LEFT JOIN tbl_users u on u.UserId=a.CreatedBy  
  LEFT JOIN tbl_users u1 on u1.UserId=a.RecomPriceUpdatedBy  
  WHERE a.IsDeleted=0`;

  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

VendorQuoteAttachmentModel.getAll = (obj, result) => {

  var selectquery = `SELECT a.VQAttachmentId,RR.RRNo,a.RRId,a.VendorAttachment,REPLACE(FORMAT(a.VendorCost,2),',','') as VendorCost,a.VendorId,REPLACE(FORMAT(a.RecomPrice,2),',','') as RecomPrice,a.RecomPriceUpdatedBy,a.InternalNotes,a.ApproverFeedback,DATE_FORMAT(a.Created,'%Y-%m-%d') as Created,DATE_FORMAT(a.RecomPriceUpdatedDate,'%Y-%m-%d') as RecomPriceUpdatedDate,
  RR.Status,
  CASE RR.Status
  WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}'
  WHEN 2 THEN '${Constants.array_rr_status[2]}'
  WHEN 3 THEN '${Constants.array_rr_status[3]}'
  WHEN 4 THEN '${Constants.array_rr_status[4]}'
  WHEN 5 THEN '${Constants.array_rr_status[5]}'
  WHEN 6 THEN '${Constants.array_rr_status[6]}'
  WHEN 7 THEN '${Constants.array_rr_status[7]}'
  WHEN 8 THEN '${Constants.array_rr_status[8]}'
  ELSE '-'	end StatusName,CONCAT(u.FirstName,' ',u.LastName) as CreatedByName,CONCAT(u1.FirstName,' ',u1.LastName) as RecomPriceUpdatedByName,FORMAT(RR.PartPON, 2) as PartPON,
  (SELECT GROUP_CONCAT(CONCAT(CUR.CurrencySymbol,' ',REPLACE(FORMAT(ROUND(IP.Price,2),2),',',''))) as LPP from tbl_invoice as I
    LEFT JOIN tbl_invoice_item IP on IP.InvoiceId=I.InvoiceId AND IP.IsDeleted = 0
    LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = I.LocalCurrencyCode AND CUR.IsDeleted = 0
    where I.IsDeleted = 0 AND IP.PartId>0 AND  IP.PartId = RR.PartId AND I.Status = ${Constants.CONST_INV_STATUS_APPROVED} AND  I.CustomerId=RR.CustomerId ORDER BY I.InvoiceId DESC ) as LPP,
  (SELECT CUR.CurrencySymbol as LocalCurrencySymbol from tbl_invoice as I
    LEFT JOIN tbl_invoice_item IP on IP.InvoiceId=I.InvoiceId AND IP.IsDeleted = 0
    LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = I.LocalCurrencyCode AND CUR.IsDeleted = 0
    where I.IsDeleted = 0 AND IP.PartId>0 AND  IP.PartId = RR.PartId AND I.Status = ${Constants.CONST_INV_STATUS_APPROVED} ORDER BY I.InvoiceId DESC LIMIT 0,1 ) as LPPCurrencySymbol,
    CURPON.CurrencySymbol as PONCurrencySymbol, CURR.CurrencySymbol as CustomerCurrencySymbol, c.CompanyName,V.VendorName,CONCAT(au.FirstName,' ', au.LastName) as AssigneeUserName,CURV.CurrencySymbol as VendorCurrencySymbol`;
  var recordfilterquery = `Select count(a.VQAttachmentId) as recordsFiltered `;

  var query = `  FROM tbl_repair_request_vq_attachment  a
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = a.RRId AND RR.IsDeleted = 0
  LEFT JOIN tbl_customers c on RR.CustomerId=c.CustomerId
  LEFT JOIN tbl_vendors as V ON V.VendorId = a.VendorId
  LEFT JOIN tbl_users u on u.UserId=a.CreatedBy  
  LEFT JOIN tbl_currencies CURPON ON CURPON.CurrencyCode = RR.PartPONLocalCurrency AND CURPON.IsDeleted = 0
  LEFT JOIN tbl_users u1 on u1.UserId=a.RecomPriceUpdatedBy
  LEFT JOIN tbl_users au ON au.UserId=RR.AssigneeUserId
  LEFT JOIN tbl_currencies CURR ON CURR.CurrencyCode = c.CustomerCurrencyCode AND CURR.IsDeleted = 0
  LEFT JOIN tbl_currencies CURV ON CURV.CurrencyCode = V.VendorCurrencyCode AND CURV.IsDeleted = 0
  WHERE a.IsDeleted=0 `;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    query += ` and c.CustomerId in(${obj.MultipleCustomerIds}) `;
  }
  if (obj.IdentityType == 1) {
    query += ` and c.CustomerId in(${obj.IdentityId}) `;
  }
  if (obj.VQAttachmentIds != "" && obj.VQAttachmentIds != null) {
    obj.VQAttachmentIds = obj.VQAttachmentIds.replace(/,\s*$/, "");
    query += " and a.VQAttachmentId In (" + obj.VQAttachmentIds + ") ";
  }

  if (obj.UserName != '' && obj.UserName != null) {
    query += ` and (u.FirstName LIKE '%${obj.UserName}%' OR u.LastName LIKE '%${obj.UserName}%' OR u.UserName LIKE '%${obj.UserName}%')  `;
  }
  if (obj.RRId != '' && obj.RRId != null && obj.RRId != 0) {
    query += " and a.RRId = '" + obj.RRId + "' ";
  }

  if (obj.VendorId != '' && obj.VendorId != null && obj.VendorId != 0) {
    query += " and a.VendorId = '" + obj.VendorId + "' ";
  }
  if (obj.CustomerId != '' && obj.CustomerId != null && obj.CustomerId != 0) {
    query += " and  c.CustomerId In(" + obj.CustomerId + ") ";
  }
  if (obj.Status != '' && obj.Status != null) {
    query += " and ( RR.Status = '" + obj.Status + "' ) ";
  }
  if (obj.Created != '' && obj.Created != null) {
    query += " and ( DATE(a.Created) ='" + obj.Created + "' ) ";
  }

  if (obj.Modified != '' && obj.Modified != null) {
    query += " and ( DATE(a.Modified) ='" + obj.Modified + "' ) ";
  }

  if (obj.ModifiedBy != '' && obj.ModifiedBy != null) {
    query += " and a.RecomPriceUpdatedBy = '" + obj.ModifiedBy + "' ";
  }

  if (obj.CustomerGroupId != '' && obj.CustomerGroupId != null) {
    query += " and (c.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE CustomerGroupId  IN (" + obj.CustomerGroupId + "))) ";
  }
  // var cvalue = 0;
  // for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
  //     if (obj.columns[cvalue].search.value != "") {
  //         switch (obj.columns[cvalue].name) {
  //             case "RRId":
  //                 query += " and a.RRId = '" + obj.columns[cvalue].search.value + "' ";
  //                 break;
  //             case "UserName":
  //                 query += " and u.UserName = '" + obj.columns[cvalue].search.value + "' ";
  //                 break;
  //             case "CustomerId":
  //                 query += " and  c.CustomerId In(" + obj.columns[cvalue].search.value + ") ";
  //                 break;
  //             case "Status":
  //                 query += " and ( RR.Status = '" + obj.columns[cvalue].search.value + "' ) ";
  //                 break;
  //             case "Created":
  //                 query += " and ( DATE(EO.Created) ='" + obj.columns[cvalue].search.value + "' ) ";
  //                 break;
  //             case "Modified":
  //                 query += " and ( DATE(EO.Modified) ='" + obj.columns[cvalue].search.value + "' ) ";
  //                 break;
  //             case "VendorId":
  //                 query += " and a.VendorId = '" + obj.columns[cvalue].search.value + "' ";
  //                 break;
  //             case "CustomerGroupId":
  //                 query += " and (c.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
  //                 break;
  //             default:
  //                 query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
  //         }
  //     }
  // }
  // var i = 0;
  // if (obj.order.length > 0) {
  //     query += " ORDER BY ";
  // }
  // for (i = 0; i < obj.order.length; i++) {

  //     if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
  //     {
  //         switch (obj.columns[obj.order[i].column].name) {

  //             default:
  //                 query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + " ";
  //                 break;
  //         }
  //     }
  // }

  var Countquery = recordfilterquery + query;

  query += " ORDER BY VQAttachmentId DESC ";




  if (obj.pagination.start >= 0 && obj.pagination.length >= 0) {
    query += ` Limit ${obj.pagination.start},${obj.pagination.length} `;
  }
  // if (obj.start != "-1" && obj.length != "-1") {
  //     query += " LIMIT " + obj.start + "," + (obj.length);
  // }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(a.VQAttachmentId) as TotalCount
  FROM tbl_repair_request_vq_attachment  a
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = a.RRId AND RR.IsDeleted = 0
  LEFT JOIN tbl_users u on u.UserId=a.CreatedBy  
  LEFT JOIN tbl_users u1 on u1.UserId=a.RecomPriceUpdatedBy
  WHERE a.IsDeleted=0`;

  if (obj.IdentityType == 0 && obj.IsRestrictedCustomerAccess == 1 && obj.MultipleCustomerIds != "") {
    TotalCountQuery += ` and c.CustomerId in(${obj.MultipleCustomerIds}) `;
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
        recordsTotal: results[1][0][0].recordsFiltered, draw: obj.draw
      });
      return;
    }
  );

};

VendorQuoteAttachmentModel.findById = (Id, result) => {
  var sql = `SELECT a.VQAttachmentId,RR.RRNo,a.RRId,a.VendorAttachment,a.VendorCost,a.VendorId,a.RecomPrice,a.RecomPriceUpdatedBy,a.InternalNotes,a.ApproverFeedback,DATE_FORMAT(a.Created,'%Y-%m-%d') as Created,DATE_FORMAT(a.RecomPriceUpdatedDate,'%Y-%m-%d') as RecomPriceUpdatedDate,
  RR.Status,
  CASE RR.Status
  WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}'
  WHEN 2 THEN '${Constants.array_rr_status[2]}'
  WHEN 3 THEN '${Constants.array_rr_status[3]}'
  WHEN 4 THEN '${Constants.array_rr_status[4]}'
  WHEN 5 THEN '${Constants.array_rr_status[5]}'
  WHEN 6 THEN '${Constants.array_rr_status[6]}'
  WHEN 7 THEN '${Constants.array_rr_status[7]}'
  WHEN 8 THEN '${Constants.array_rr_status[8]}'
  ELSE '-'	end StatusName,CONCAT(u.FirstName,' ',u.LastName) as CreatedByName,CONCAT(u1.FirstName,' ',u1.LastName) as RecomPriceUpdatedByName,RR.PartPON,
  (SELECT GROUP_CONCAT(CONCAT(CUR.CurrencySymbol,' ',ROUND(IP.BasePrice,2))) as LPP from tbl_invoice as I
  LEFT JOIN tbl_invoice_item IP on IP.InvoiceId=I.InvoiceId AND IP.IsDeleted = 0
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = I.LocalCurrencyCode AND CUR.IsDeleted = 0
  where I.IsDeleted = 0 AND IP.PartId>0 AND  IP.PartId = RR.PartId AND I.Status = ${Constants.CONST_INV_STATUS_APPROVED} AND  I.CustomerId=RR.CustomerId ORDER BY I.InvoiceId DESC LIMIT 0,1 ) as LPP,
  (SELECT CUR.CurrencySymbol as LocalCurrencySymbol from tbl_invoice as I
  LEFT JOIN tbl_invoice_item IP on IP.InvoiceId=I.InvoiceId AND IP.IsDeleted = 0
  LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = I.LocalCurrencyCode AND CUR.IsDeleted = 0
  where I.IsDeleted = 0 AND IP.PartId>0 AND  IP.PartId = RR.PartId AND I.Status = ${Constants.CONST_INV_STATUS_APPROVED} ORDER BY I.InvoiceId DESC LIMIT 0,1 ) as LPPCurrencySymbol,
  CURPON.CurrencySymbol as PONCurrencySymbol, CURR.CurrencySymbol as CustomerCurrencySymbol,c.CompanyName,V.VendorName, CURV.CurrencySymbol as VendorCurrencySymbol
  FROM tbl_repair_request_vq_attachment  a
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = a.RRId AND RR.IsDeleted = 0
  LEFT JOIN tbl_customers c on RR.CustomerId=c.CustomerId
  LEFT JOIN tbl_vendors as V ON V.VendorId = a.VendorId
  LEFT JOIN tbl_users u on u.UserId=a.CreatedBy
  LEFT JOIN tbl_currencies CURPON ON CURPON.CurrencyCode = RR.PartPONLocalCurrency AND CURPON.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURV  ON CURV.CurrencyCode = V.VendorCurrencyCode AND CURV.IsDeleted = 0
  LEFT JOIN tbl_users u1 on u1.UserId=a.RecomPriceUpdatedBy
  LEFT JOIN tbl_currencies CURR ON CURR.CurrencyCode = c.CustomerCurrencyCode AND CURR.IsDeleted = 0
  WHERE a.IsDeleted = 0 AND a.VQAttachmentId = '${Id}'`;

  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //  console.log("found the RRAttachment: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Department with the id
    result({ kind: "RR Vendor Quote Attachment not found" }, null);
  });
};

VendorQuoteAttachmentModel.findByRRId = (RRId) => {
  var sql = `SELECT a.VQAttachmentId,RR.RRNo,a.RRId,a.VendorAttachment,a.VendorCost,a.VendorId,a.RecomPrice,a.RecomPriceUpdatedBy,a.InternalNotes,a.ApproverFeedback,DATE_FORMAT(a.Created,'%Y-%m-%d') as Created,DATE_FORMAT(a.RecomPriceUpdatedDate,'%Y-%m-%d') as RecomPriceUpdatedDate,
  RR.Status,
  CASE RR.Status
  WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}'
  WHEN 2 THEN '${Constants.array_rr_status[2]}'
  WHEN 3 THEN '${Constants.array_rr_status[3]}'
  WHEN 4 THEN '${Constants.array_rr_status[4]}'
  WHEN 5 THEN '${Constants.array_rr_status[5]}'
  WHEN 6 THEN '${Constants.array_rr_status[6]}'
  WHEN 7 THEN '${Constants.array_rr_status[7]}'
  WHEN 8 THEN '${Constants.array_rr_status[8]}'
  ELSE '-'	end StatusName,CONCAT(u.FirstName,' ',u.LastName) as CreatedByName,CONCAT(u1.FirstName,' ',u1.LastName) as RecomPriceUpdatedByName,RR.PartPON,
  (SELECT GROUP_CONCAT(CONCAT(CUR.CurrencySymbol,' ',ROUND(IP.BasePrice,2))) as LPP from tbl_invoice as I
    LEFT JOIN tbl_invoice_item IP on IP.InvoiceId=I.InvoiceId AND IP.IsDeleted = 0
    LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = I.LocalCurrencyCode AND CUR.IsDeleted = 0
    where I.IsDeleted = 0 AND IP.PartId>0 AND  IP.PartId = RR.PartId AND I.Status = ${Constants.CONST_INV_STATUS_APPROVED} AND  I.CustomerId=RR.CustomerId ORDER BY I.InvoiceId DESC LIMIT 0,1 ) as LPP,
    (SELECT CUR.CurrencySymbol as LocalCurrencySymbol from tbl_invoice as I
      LEFT JOIN tbl_invoice_item IP on IP.InvoiceId=I.InvoiceId AND IP.IsDeleted = 0
      LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = I.LocalCurrencyCode AND CUR.IsDeleted = 0
      where I.IsDeleted = 0 AND IP.PartId>0 AND  IP.PartId = RR.PartId AND I.Status = ${Constants.CONST_INV_STATUS_APPROVED} ORDER BY I.InvoiceId DESC LIMIT 0,1 ) as LPPCurrencySymbol,
      CURPON.CurrencySymbol as PONCurrencySymbol, CURR.CurrencySymbol as CustomerCurrencySymbol,c.CompanyName,V.VendorName
  FROM tbl_repair_request_vq_attachment  a
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = a.RRId AND RR.IsDeleted = 0
  LEFT JOIN tbl_customers c on RR.CustomerId=c.CustomerId
  LEFT JOIN tbl_vendors as V ON V.VendorId = a.VendorId
  LEFT JOIN tbl_users u on u.UserId=a.CreatedBy
  LEFT JOIN tbl_currencies CURPON ON CURPON.CurrencyCode = RR.PartPONLocalCurrency AND CURPON.IsDeleted = 0
  LEFT JOIN tbl_users u1 on u1.UserId=a.RecomPriceUpdatedBy
  LEFT JOIN tbl_currencies CURR ON CURR.CurrencyCode = c.CustomerCurrencyCode AND CURR.IsDeleted = 0
  WHERE a.IsDeleted = 0 AND a.RRId = '${RRId}'`;
  return sql;
};



VendorQuoteAttachmentModel.updateById = (objModel, result) => {
  var sql = `UPDATE tbl_repair_request_vq_attachment SET RecomPrice = '${objModel.RecomPrice}', RecomPriceUpdatedBy = '${objModel.RecomPriceUpdatedBy}', RecomPriceUpdatedDate = '${objModel.RecomPriceUpdatedDate}',Modified = '${objModel.Modified}',ModifiedBy = '${objModel.ModifiedBy}'
    WHERE VQAttachmentId = '${objModel.VQAttachmentId}'`;

  var values = [
    objModel.RecomPrice, objModel.RecomPriceUpdatedBy, objModel.RecomPriceUpdatedDate, objModel.Modified, objModel.ModifiedBy, objModel.VQAttachmentId
  ]
  //console.log("RRA EDit: " + sql);
  con.query(sql, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { id: objModel.VQAttachmentId, ...objModel });
  }
  );

  // console.log("Updated RRAttachment !");
};

VendorQuoteAttachmentModel.feedbackUpdateById = (objModel, result) => {
  var sql = `UPDATE tbl_repair_request_vq_attachment SET ApproverFeedback = '${objModel.ApproverFeedback}',Modified = '${objModel.Modified}',ModifiedBy = '${objModel.ModifiedBy}'
    WHERE VQAttachmentId = '${objModel.VQAttachmentId}'`;

  //console.log("RRA EDit: " + sql);
  con.query(sql, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { id: objModel.VQAttachmentId, ...objModel });
  }
  );
};

VendorQuoteAttachmentModel.notesUpdateById = (objModel, result) => {
  var sql = `UPDATE tbl_repair_request_vq_attachment SET InternalNotes = '${objModel.InternalNotes}',Modified = '${objModel.Modified}',ModifiedBy = '${objModel.ModifiedBy}'
    WHERE VQAttachmentId = '${objModel.VQAttachmentId}'`;

  //console.log("RRA EDit: " + sql);
  con.query(sql, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, { id: objModel.VQAttachmentId, ...objModel });
  }
  );
};

VendorQuoteAttachmentModel.updateBulkPrice = (reqBody, result) => {
  var reqBodyLength = reqBody.length - 1
  reqBody.forEach((obj, i) => {
    var objModel = new VendorQuoteAttachmentModel(obj);
    var sql = `UPDATE tbl_repair_request_vq_attachment SET RecomPrice = '${objModel.RecomPrice}', RecomPriceUpdatedBy = '${objModel.RecomPriceUpdatedBy}', RecomPriceUpdatedDate = '${objModel.RecomPriceUpdatedDate}',Modified = '${objModel.Modified}',ModifiedBy = '${objModel.ModifiedBy}'
    WHERE VQAttachmentId = '${objModel.VQAttachmentId}'`;
    con.query(sql, (err, res) => {
      if(reqBodyLength == i){
        if (err) {
          result(null, err);
          return;
        }else{
          result(null, reqBody);
        }
      }
    }
    );
  })
};


VendorQuoteAttachmentModel.updateByIdOverall = (objModel, result) => {
  VendorQuoteAttachmentModel.checkExists(objModel, (err1, data) => {
    if (data && data.length > 0) {
      var errMsg = "RR " + objModel.RRId + " already exists!";
      result(errMsg, null);
    } else {
      var sql = `UPDATE tbl_repair_request_vq_attachment SET 
      VendorAttachment = '${objModel.VendorAttachment}',
      VendorCost = '${objModel.VendorCost}',
      InternalNotes = '${objModel.InternalNotes}',
      ApproverFeedback = '${objModel.ApproverFeedback}',
      Modified = '${objModel.Modified}',
      ModifiedBy = '${objModel.ModifiedBy}'
      WHERE VQAttachmentId = '${objModel.VQAttachmentId}'`;
      // console.log("RRA EDit: " + sql);
      con.query(sql, (err, res) => {

        if (err) {
          // console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          result({ kind: "not_found" }, null);
          return;
        }

        result(null, { id: objModel.VQAttachmentId, ...objModel });
      }
      );
    }
  })

  // console.log("Updated RRAttachment !");
};



VendorQuoteAttachmentModel.remove = (id, result) => {
  var sql = `UPDATE tbl_repair_request_vq_attachment SET IsDeleted =1,ModifiedBy='${global.authuser.UserId ? global.authuser.UserId : 0}' WHERE VQAttachmentId = ${id}`;
  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Reference with the id
      result({ kind: "not_found" }, null);
      return;
    }
    //console.log("deleted RRAttachment with AttachmentId: ", id);
    result(null, res);
  });
};

//To Check Exists
VendorQuoteAttachmentModel.checkExists = (Obj, result) => {
  var sql = `SELECT RR.RRId, RR.RRNo FROM tbl_repair_request_vq_attachment as a
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = a.RRId AND RR.IsDeleted = 0
  WHERE a.RRId='${Obj.RRId}' AND a.IsDeleted=0`;
  if (Obj.VQAttachmentId && Obj.VQAttachmentId > 0) {
    sql += ` AND a.VQAttachmentId NOT IN(${Obj.VQAttachmentId})`
  }
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
};

VendorQuoteAttachmentModel.getRRVendors = (RRId, result) => {
  // var sql = `Select GROUP_CONCAT(VendorId ORDER BY RRVendorId DESC) as VendorId from tbl_repair_request_vendors where RRID='${RRId}' Order By RRVendorId Desc`;
  var sql = `Select VendorId from tbl_repair_request where RRID='${RRId}'`;
  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    } else {
     // console.log(res);
      var query = `Select v.*,cur.CurrencySymbol,
      case PODeliveryMethod
      WHEN 1 THEN '${Constants.array_po_print_format[1]}'
      WHEN 2 THEN '${Constants.array_po_print_format[2]}'
      WHEN 3 THEN '${Constants.array_po_print_format[3]}'
      ELSE '-'
      end PODeliveryMethodName,t.TermsName
      from tbl_vendors v
      LEFt JOIN tbl_currencies as cur on cur.CurrencyCode = v.VendorCurrencyCode AND cur.IsDeleted = 0
      LEFT JOIN tbl_terms t on t.TermsId=v.TermsId 
      where v.Status = 1 AND  v.IsDeleted=0 AND v.VendorId IN (${res[0].VendorId}) `;
      con.query(query, (err, res) => {
        if (err) return result(err, null);
        return result(null, res);
      });
    }
  });
};
module.exports = VendorQuoteAttachmentModel;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
const md5 = require('md5');
var async = require('async');
var cDateTime = require("../utils/generic.js");

// const { request } = require("../app.js");
const RepairRequestGmTrackerModel = require("../models/repair.request.gm.tracker.model.js");
const RRImages = require("../models/repairrequestimages.model.js");
const RRCustomerRef = require("../models/cutomer.reference.labels.model.js");
const RRVendors = require("../models/repair.request.vendors.model.js");
const RRVendorParts = require("../models/repair.request.vendor.parts.model.js");
const RRParts = require("../models/repairrequestparts.model.js");
const RRNotes = require("../models/repair.request.notes.model.js");
const RRStatusHistory = require("../models/rr.status.history.model.js");
const RRShippingHistory = require("../models/repair.request.shipping.history.model.js");
const FollowUp = require("../models/repair.request.followup.model.js");
const AttachmentModel = require("../models/repair.request.attachment.model.js");

const Quotes = require("../models/quotes.model.js");
const QuotesItems = require("../models/quote.item.model.js");
const NotificationModel = require("../models/notification.model.js");
const WarrantyModel = require("../models/repair.request.warranty.model.js");
const PurchaseOrder = require("./purchase.order.model.js");
const SalesOrder = require("./sales.order.model.js");
const Invoice = require("./invoice.model.js");
const VendorInvoice = require("./vendor.invoice.model.js");
const CReferenceLabel = require("../models/cutomer.reference.labels.model.js");
const VendorModel = require("./vendor.model.js");
const AddressModel = require("../models/customeraddress.model.js");
const CustomerAssetModel = require("../models/customersasset.model.js");
const CustomersDepartmentModel = require("../models/customersdepartment.model.js");
const RRRevertHistoryModel = require("../models/repair.request.revert.history.model.js");
const CommunicationMessagesModel = require("../models/communication.messages.model.js");
const RepairRequestVendorAttachment = require("../models/repair.request.vendor.attachment.model.js");
const RRFollowUpNotesModel = require("../models/repair.request.followup.notes.model.js");
const {
  escapeSqlValues
} = require("../helper/common.function.js");
const RRCustomerAttachmentModel = require("./repair.request.customer.attachment.model.js");
const SettingsGeneralModel = require("./settings.general.model.js");
const RRSubStatusHistory = require("./rr.substatus.history.model.js");
const RRAssigneeHistory = require("./rr.assignee.history.model.js");
const RRLocationHistory = require("./rr.location.history.model.js");
const {
  getLogInUserId,
  getLogInIdentityId,
  getLogInIdentityType,
  getLogInIsRestrictedCustomerAccess,
  getLogInMultipleCustomerIds,
  getLogInMultipleAccessIdentityIds
} = require("../helper/common.function.js");
const VendorQuoteAttachmentModel = require("./repair.request.vendorquote.attachment.model.js");

const RR = function (objRR) {
  this.RRId = objRR.RRId;
  this.RRNo = objRR.RRNo ? objRR.RRNo : '';
  this.CustomerId = objRR.CustomerId ? objRR.CustomerId : 0;
  this.VendorId = objRR.VendorId ? objRR.VendorId : 0;
  this.RRVendorId = objRR.RRVendorId ? objRR.RRVendorId : 0;
  this.DepartmentId = objRR.DepartmentId ? objRR.DepartmentId : 0;
  this.AssetId = objRR.AssetId ? objRR.AssetId : 0;
  this.PartId = objRR.PartId ? objRR.PartId : 0;
  this.PartNo = objRR.PartNo ? objRR.PartNo : '';
  this.SerialNo = objRR.SerialNo ? objRR.SerialNo : '';
  this.IsRushRepair = objRR.IsRushRepair ? objRR.IsRushRepair : 0;
  this.IsWarrantyRecovery = objRR.IsWarrantyRecovery ? objRR.IsWarrantyRecovery : 0;
  this.IsWarrantyDenied = objRR.IsWarrantyDenied ? objRR.IsWarrantyDenied : 0;
  this.IsRepairTag = objRR.IsRepairTag ? objRR.IsRepairTag : 0;
  this.IsCriticalSpare = objRR.IsCriticalSpare ? objRR.IsCriticalSpare : 0;
  this.Price = objRR.Price ? objRR.Price : 0;
  this.RRDescription = objRR.RRDescription ? objRR.RRDescription : '';
  this.StatedIssue = objRR.StatedIssue ? objRR.StatedIssue : '';
  this.CustomerSOId = objRR.CustomerSOId ? objRR.CustomerSOId : 0;
  this.VendorPOId = objRR.VendorPOId ? objRR.VendorPOId : 0;
  this.CustomerBillToId = objRR.CustomerBillToId ? objRR.CustomerBillToId : 0;
  this.CustomerShipToId = objRR.CustomerShipToId ? objRR.CustomerShipToId : 0;
  this.CustomerInvoiceId = objRR.CustomerInvoiceId ? objRR.CustomerInvoiceId : 0;
  this.ReportStatus = objRR.ReportStatus ? objRR.ReportStatus : 0;
  this.RRBatchId = objRR.RRBatchId ? objRR.RRBatchId : 0;
  this.Status = objRR.Status ? objRR.Status : 0;
  this.AddedFrom = objRR.AddedFrom ? objRR.AddedFrom : 0;
  this.Created = objRR.Created ? objRR.Created + " 10:00:00" : cDateTime.getDateTime();
  this.Modified = objRR.Modified ? objRR.Modified + " 10:00:00" : cDateTime.getDateTime();

  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objRR.authuser && objRR.authuser.UserId) ? objRR.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objRR.authuser && objRR.authuser.UserId) ? objRR.authuser.UserId : TokenUserId;

  this.authuser = objRR.authuser ? objRR.authuser : {};

  this.IsDeleted = objRR.IsDeleted ? objRR.IsDeleted : '';
  this.Location = objRR.Location ? objRR.Location : '';

  this.PartPON = objRR.PartPON ? objRR.PartPON : null;
  this.PartPONLocalCurrency = objRR.PartPONLocalCurrency ? objRR.PartPONLocalCurrency : '';
  this.PartPONBaseCurrency = objRR.PartPONBaseCurrency ? objRR.PartPONBaseCurrency : '';
  this.BasePartPON = objRR.BasePartPON ? objRR.BasePartPON : null;
  this.PartPONExchangeRate = objRR.PartPONExchangeRate ? objRR.PartPONExchangeRate : 1;


  this.CustomerSOId = objRR.CustomerSOId ? objRR.CustomerSOId : 0;
  this.CustomerSONo = objRR.CustomerSONo ? objRR.CustomerSONo : '';
  this.CustomerSODueDate = objRR.CustomerSODueDate ? objRR.CustomerSODueDate : '0000-00-00';
  this.CustomerPONo = objRR.CustomerPONo ? objRR.CustomerPONo : '';

  this.VendorPOId = objRR.VendorPOId ? objRR.VendorPOId : 0;
  this.VendorPONo = objRR.VendorPONo ? objRR.VendorPONo : '';
  this.VendorPODueDate = objRR.VendorPODueDate ? objRR.VendorPODueDate : '0000-00-00';

  this.VendorInvoiceId = objRR.VendorInvoiceId ? objRR.VendorInvoiceId : 0;
  this.VendorInvoiceNo = objRR.VendorInvoiceNo ? objRR.VendorInvoiceNo : '';
  this.VendorInvoiceDueDate = objRR.VendorInvoiceDueDate ? objRR.VendorInvoiceDueDate : '0000-00-00';

  this.CustomerInvoiceId = objRR.CustomerInvoiceId ? objRR.CustomerInvoiceId : 0;
  this.CustomerInvoiceNo = objRR.CustomerInvoiceNo ? objRR.CustomerInvoiceNo : '';
  this.CustomerInvoiceDueDate = objRR.CustomerInvoiceDueDate ? objRR.CustomerInvoiceDueDate : '0000-00-00';

  this.RRCompletedDate = objRR.RRCompletedDate ? objRR.RRCompletedDate : null;


  this.UserId = objRR.UserId ? objRR.UserId : 0;
  this.ContactPhone = objRR.ContactPhone ? objRR.ContactPhone : '';
  this.ContactEmail = objRR.ContactEmail ? objRR.ContactEmail : '';
  this.ShippingStatus = objRR.ShippingStatus ? objRR.ShippingStatus : 0;
  this.ShippingIdentityType = objRR.ShippingIdentityType ? objRR.ShippingIdentityType : 0;
  this.ShippingIdentityId = objRR.ShippingIdentityId ? objRR.ShippingIdentityId : 0;
  this.ShippingAddressId = objRR.ShippingAddressId ? objRR.ShippingAddressId : 0;
  this.ShippingIdentityName = objRR.ShippingIdentityName ? objRR.ShippingIdentityName : '';
  this.RejectedStatusType = objRR.RejectedStatusType ? objRR.RejectedStatusType : 0;
  this.IsDirectedRR = objRR.IsDirectedRR ? objRR.IsDirectedRR : 0;

  const TokenCreatedByLocation = global.authuser.Location ? global.authuser.Location : '';
  this.CreatedByLocation = (objRR.authuser && objRR.authuser.Location) ? objRR.authuser.Location : TokenCreatedByLocation;


  this.TokenUserId = (objRR.authuser && objRR.authuser.UserId) ? objRR.authuser.UserId : TokenUserId;

  const TokenGlobalIdentityId = global.authuser.IdentityId ? global.authuser.IdentityId : 0;
  this.LoginIdentityId = (objRR.authuser && objRR.authuser.IdentityId) ? objRR.authuser.IdentityId : TokenGlobalIdentityId;

  const TokenGlobalIdentityType = global.authuser.IdentityType ? global.authuser.IdentityType : 0;
  this.LoginIdentityType = (objRR.authuser && objRR.authuser.IdentityType) ? objRR.authuser.IdentityType : TokenGlobalIdentityType;

  const TokenIsRestrictedCustomerAccess = global.authuser.IsRestrictedCustomerAccess ? global.authuser.IsRestrictedCustomerAccess : 0;
  this.LoginIsRestrictedCustomerAccess = (objRR.authuser && objRR.authuser.IsRestrictedCustomerAccess) ? objRR.authuser.IsRestrictedCustomerAccess : TokenIsRestrictedCustomerAccess;

  const TokenMultipleCustomerIds = global.authuser.MultipleCustomerIds ? global.authuser.MultipleCustomerIds : 0;
  this.LoginMultipleCustomerIds = (objRR.authuser && objRR.authuser.MultipleCustomerIds) ? objRR.authuser.MultipleCustomerIds : TokenMultipleCustomerIds;

  const TokenMultipleAccessIdentityIds = global.authuser.MultipleAccessIdentityIds ? global.authuser.MultipleAccessIdentityIds : 0;
  this.LoginMultipleAccessIdentityIds = (objRR.authuser && objRR.authuser.MultipleAccessIdentityIds) ? objRR.authuser.MultipleAccessIdentityIds : TokenMultipleAccessIdentityIds;



  this.IsActive = objRR.IsActive || objRR.IsActive == 0 ? objRR.IsActive : 1;

  this.SubStatusId = objRR.SubStatusId ? objRR.SubStatusId : 0;
  this.AssigneeUserId = objRR.AssigneeUserId ? objRR.AssigneeUserId : 0;
  this.RRPartLocationId = objRR.RRPartLocationId ? objRR.RRPartLocationId : 0;
  // For Server Side Search
  this.start = objRR.start;
  this.length = objRR.length;
  this.search = objRR.search;
  this.sortCol = objRR.sortCol;
  this.sortDir = objRR.sortDir;
  this.sortColName = objRR.sortColName;
  this.order = objRR.order;
  this.columns = objRR.columns;
  this.draw = objRR.draw;

  this.FromDate = objRR.FromDate ? objRR.FromDate : '';
  this.ToDate = objRR.ToDate ? objRR.ToDate : '';
  this.RRIds = objRR.RRIds ? objRR.RRIds : '';
};


RR.CustomerStatistics = (filterdate, result) => {
  if (filterdate) {
    const datearray = filterdate.split(' - ');
    var fromDatearray = datearray[0].split("/");
    var toDatearray = datearray[1].split("/");
    var fromDate = fromDatearray[2] + "-" + fromDatearray[0] + "-" + fromDatearray[1];
    var toDate = toDatearray[2] + "-" + toDatearray[0] + "-" + toDatearray[1];
    var sql = ` SELECT  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as TotalCount,  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 AND Status = 1 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as ActiveCount,  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 AND Status = 0 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as InactiveCount,  (SELECT count(CustomerId) as CustomerCount FROM tbl_customers  WHERE IsDeleted = 1 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as DeletedCount `;
  } else {
    var sql = ` SELECT  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 ) as TotalCount,  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 AND Status = 1 ) as ActiveCount,  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 AND Status = 0 ) as InactiveCount,  (SELECT count(CustomerId) as CustomerCount FROM tbl_customers  WHERE IsDeleted = 1 ) as DeletedCount `;
  }

  con.query(sql, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({
        msg: "Customer not found"
      }, null);
      return;
    }

    result(null, res);
  });

};


RR.CreateRequest = (reqbody, result) => {
  reqbody = escapeSqlValues(reqbody);
  // console.log(reqbody);
  var RRObj = new RR(reqbody);
  // console.log(RRObj);
  var sql = ``;
  // var RRPart = reqbody.RRParts[0];
  var RRPart = reqbody;
  var PartItemId = 0;
  var partItemCheckSql = `SELECT * FROM tbl_parts_item WHERE PartId = ${RRPart.PartId} AND SerialNo='${RRPart.SerialNo}'`
  con.query(partItemCheckSql, (err, partItemRes) => {
    if (partItemRes.length > 0) {
      PartItemId = partItemRes[0].PartItemId;

      sql = `insert into tbl_repair_request(CustomerId,VendorId,DepartmentId,AssetId,PartId,PartItemId,
        PartNo,SerialNo,IsRushRepair,IsCriticalSpare,IsWarrantyRecovery,IsRepairTag,Price,
        RRDescription,StatedIssue,ReportStatus,Created,CreatedBy,Status
        ,UserId, ContactPhone,ContactEmail,RRCompletedDate,CreatedByLocation,IsActive,IsWarrantyDenied,RRBatchId)
        values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      var values = [
        RRObj.CustomerId, RRObj.VendorId, RRObj.DepartmentId, RRObj.AssetId, RRObj.PartId, PartItemId, RRObj.PartNo,
        RRObj.SerialNo, RRObj.IsRushRepair, RRObj.IsCriticalSpare, RRObj.IsWarrantyRecovery, RRObj.IsRepairTag,
        RRObj.Price, RRObj.RRDescription, RRObj.StatedIssue, RRObj.ReportStatus,
        RRObj.Created, RRObj.CreatedBy, RRObj.Status, RRObj.UserId, RRObj.ContactPhone,
        RRObj.ContactEmail, RRObj.RRCompletedDate, RRObj.CreatedByLocation, RRObj.IsActive, RRObj.IsWarrantyDenied, RRObj.RRBatchId
      ];
      // console.log("!!!!!!!!@@@@@@@@@@@##########$$$$$$$$$$$");
      //  console.log(sql, values);
      con.query(sql, values, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        result(null, {
          id: res.insertId
        });
        return;
      });
    } else {
      var partItemInsertSql = `INSERT INTO tbl_parts_item (PartId, SerialNo, Quantity, IsNew, Created, CreatedBy)
       VALUES (${RRPart.PartId}, '${RRPart.SerialNo}', 1, '3', '${RRObj.Created}', '${RRObj.CreatedBy}')`;
      // console.log(partItemInsertSql);
      con.query(partItemInsertSql, (err, partItemInsertRes) => {
        console.log(err)
        PartItemId = partItemInsertRes.insertId;

        sql = `insert into tbl_repair_request(CustomerId,VendorId,DepartmentId,AssetId,PartId,PartItemId,
          PartNo,SerialNo,IsRushRepair,IsWarrantyRecovery,IsRepairTag,Price,
          RRDescription,StatedIssue,ReportStatus,Created,CreatedBy,Status
          ,UserId, ContactPhone,ContactEmail,CreatedByLocation,IsActive,IsWarrantyDenied,RRBatchId) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        var values = [
          RRObj.CustomerId, RRObj.VendorId, RRObj.DepartmentId, RRObj.AssetId, RRObj.PartId, PartItemId, RRObj.PartNo,
          RRObj.SerialNo, RRObj.IsRushRepair, RRObj.IsWarrantyRecovery, RRObj.IsRepairTag,
          RRObj.Price, RRObj.RRDescription, RRObj.StatedIssue, RRObj.ReportStatus,
          RRObj.Created, RRObj.CreatedBy, RRObj.Status, RRObj.UserId, RRObj.ContactPhone, RRObj.ContactEmail, RRObj.CreatedByLocation, RRObj.IsActive, RRObj.IsWarrantyDenied, RRObj.RRBatchId
        ];

        con.query(sql, values, (err, res) => {
          if (err) {
            //console.log("error: ", err);
            result(err, null);
            return;
          }
          result(null, {
            id: res.insertId
          });
          return;
        });
      })
    }
  })



};


RR.CreateRequestFromMobApp = (reqbody, result) => {
  reqbody.AddedFrom = 1;
  var RRObj = new RR(reqbody);
  var sql = ``;

  sql = `insert into tbl_repair_request(CustomerId,DepartmentId,AssetId,PartId,
    PartNo,SerialNo,IsRushRepair,IsWarrantyRecovery,Price,
    RRDescription,StatedIssue,Created,CreatedBy,Status,AddedFrom,CreatedByLocation) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [
    RRObj.CustomerId, RRObj.DepartmentId, RRObj.AssetId, RRObj.PartId, RRObj.PartNo,
    RRObj.SerialNo, RRObj.IsRushRepair, RRObj.IsWarrantyRecovery,
    reqbody.Rate, RRObj.RRDescription, RRObj.StatedIssue,
    RRObj.Created, RRObj.CreatedBy, RRObj.Status, RRObj.AddedFrom, RRObj.CreatedByLocation
  ];
  // console.log("RR Query " + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, {
      id: res.insertId,
      PartNo: RRObj.PartNo,
      SerialNo: RRObj.SerialNo
    });
    return;
  });

};


RR.UpdateRepairRequestByRRId = (RR, result) => {

  var sql = ``;

  sql = `UPDATE tbl_repair_request  SET  CustomerId=?,VendorId=?,DepartmentId=?,AssetId=?,PartId=?,
  PartNo=?,SerialNo=?,IsRushRepair=?,IsWarrantyRecovery=?,IsRepairTag=?,Price=?,
  RRDescription=?,StatedIssue=?,ReportStatus=?,Modified=?,ModifiedBy=?,Status=?,
  CustomerSONo=?,CustomerPONo=?,VendorPONo=?,VendorInvoiceNo=?, UserId = ?,
  ContactPhone=?,ContactEmail=?
    WHERE RRID = ?`;


  var values = [
    RR.CustomerId, RR.VendorId, RR.DepartmentId, RR.AssetId, RR.PartId, RR.PartNo,
    RR.SerialNo, RR.IsRushRepair, RR.IsWarrantyRecovery, RR.IsRepairTag, RR.Price,
    RR.RRDescription, RR.StatedIssue, RR.ReportStatus,
    cDateTime.getDateTime(), RR.CreatedBy, RR.Status,
    RR.CustomerPONo, RR.CustomerPONo, RR.VendorPONo, RR.VendorInvoiceNo, RR.UserId,
    RR.ContactPhone, RR.ContactEmail,
    RR.RRId
  ]
  // console.log("RRSQl=" + sql);
  con.query(sql, values, (err, res) => {

    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({
        kind: "not_found"
      }, null);
      return;
    }
    result(null, {
      id: RR.RRId,
      ...RR
    });
    return;
  });

};

RR.emptyFunction = (RR, result) => {
  result(null, {
    empty: 1
  });
  return;
};

RR.UpdateRepairRequestByRRIdStep1 = (RR, result) => {
  var RRPart = RR.RRParts;
  RRPart = new RRParts(RRPart);
  var partItemCheckSql = `SELECT * FROM tbl_parts_item WHERE PartId = ${RRPart.PartId} AND SerialNo='${RRPart.SerialNo}'`
  con.query(partItemCheckSql, (err, partItemRes) => {
    if (partItemRes.length > 0) {
      var PartItemId = partItemRes[0].PartItemId;
      var sql = ``;
      sql = `UPDATE tbl_repair_request  SET CustomerId=?,DepartmentId=?,AssetId=?,IsRushRepair=?,
      IsWarrantyRecovery=?,IsRepairTag=?,RRDescription=?,StatedIssue=?,UserId=?,ContactPhone=?,
      ContactEmail=?,PartId=?,PartItemId=?,PartNo=? ,Modified=?,ModifiedBy=?,CustomerShipToId=?,CustomerBillToId=?
      WHERE RRID = ?`;
      var values = [
        RR.CustomerId, RR.DepartmentId, RR.AssetId, RR.IsRushRepair, RR.IsWarrantyRecovery, RR.IsRepairTag,
        RR.RRDescription, RR.StatedIssue, RR.UserId, RR.ContactPhone, RR.ContactEmail,
        RR.PartId, PartItemId, RR.PartNo, RR.Modified, RR.ModifiedBy, RR.CustomerShipToId, RR.CustomerBillToId, RR.RRId
      ]
      //console.log("RRSQl=" + sql);
      con.query(sql, values, (err, res) => {

        if (err) {
          result(null, err);
          return;
        }
        if (res.affectedRows == 0) {
          result({
            kind: "not_found"
          }, null);
          return;
        }
        result(null, {
          id: RR.RRId,
          ...RR
        });
        return;
      });
    } else {
      var partItemInsertSql = `INSERT INTO tbl_parts_item (PartId, SerialNo, Quantity, IsNew, Created, CreatedBy)
       VALUES (${RRPart.PartId}, '${RRPart.SerialNo}', 1, '3', '${RRPart.Created}', '${RRPart.CreatedBy}')`;

      con.query(partItemInsertSql, (err, partItemInsertRes) => {
        var PartItemId = partItemInsertRes.insertId;
        var sql = ``;
        sql = `UPDATE tbl_repair_request  SET  CustomerId=?,DepartmentId=?,AssetId=?,IsRushRepair=?,
        IsWarrantyRecovery=?,IsRepairTag=?,RRDescription=?,StatedIssue=?,UserId=?,ContactPhone=?,
        ContactEmail=?,PartId=?,PartItemId=?,PartNo=? ,Modified=?,ModifiedBy=?,CustomerShipToId=?,CustomerBillToId=?
        WHERE RRID = ?`;
        var values = [
          RR.CustomerId, RR.DepartmentId, RR.AssetId, RR.IsRushRepair, RR.IsWarrantyRecovery, RR.IsRepairTag,
          RR.RRDescription, RR.StatedIssue, RR.UserId, RR.ContactPhone, RR.ContactEmail,
          RR.PartId, PartItemId, RR.PartNo, RR.Modified, RR.ModifiedBy, RR.CustomerShipToId, RR.CustomerBillToId, RR.RRId
        ]
        //console.log("RRSQl=" + sql);
        con.query(sql, values, (err, res) => {

          if (err) {
            result(null, err);
            return;
          }
          if (res.affectedRows == 0) {
            result({
              kind: "not_found"
            }, null);
            return;
          }
          result(null, {
            id: RR.RRId,
            ...RR
          });
          return;
        });
      })
    }
  })


};

RR.IsExistCustomerPONo = (obj, result) => {
  var sql = `Select CustomerPONo,RRId from tbl_repair_request
  where IsDeleted=0 and CustomerPONo='${obj.CustomerPONo}' and RRId<>'${obj.RRId}'`;
  //console.log("ExistCustomerPONo=" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
};
RR.CheckCustomerPONoExistForRRId = (obj, result) => {
  var sql = `Select CustomerPONo,RRId from tbl_repair_request
  where IsDeleted=0 and CustomerPONo='${obj.CustomerPONo}' and RRId='${obj.RRId}'`;
  //console.log("CheckCustomerPONoExistForRRId=" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
};

RR.CheckQuoteExistForRRId = (obj, result) => {
  var sql = `Select QuoteId,RRId from tbl_quotes
  where IsDeleted=0 and Status='${obj.Status}' and RRId='${obj.RRId}'`;
  //console.log("CheckCustomerPONoExistForRRId=" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;

  });
};


RR.updateRRDepartmentWarranty = (RR, result) => {
  var sql = `UPDATE tbl_repair_request  SET
  AssetId=?, DepartmentId=?,  IsRushRepair=?,  IsCriticalSpare=?, IsWarrantyRecovery=?, IsWarrantyDenied=?,  IsRepairTag=?,
  Modified=?,  ModifiedBy=?   WHERE RRID = ?`;
  var values = [
    RR.AssetId, RR.DepartmentId, RR.IsRushRepair, RR.IsCriticalSpare, RR.IsWarrantyRecovery, RR.IsWarrantyDenied,
    RR.IsRepairTag, RR.Modified, RR.ModifiedBy, RR.RRId
  ]
  //console.log("RRSQl=" + sql);
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log(err);
      result(null, err);
      return;
    }
    result(null, {
      id: RR.RRId,
      ...RR
    });
    return;
  });

};


RR.UpdateRepairRequestByRRIdStep2 = (RR, result) => {
  var sql = ``;
  sql = `UPDATE tbl_repair_request  SET
  AssetId=?, ContactPhone=?, ContactEmail=?,   DepartmentId=?,  IsRushRepair=?,  IsCriticalSpare=?, IsWarrantyRecovery=?, IsWarrantyDenied=?,  IsRepairTag=?, RRDescription=?, StatedIssue=?,  UserId=?,
  Modified=?,
  ModifiedBy=?, CustomerPONo=?,CustomerShipToId=?,CustomerBillToId=?
  WHERE RRID = ?`;
  var values = [
    RR.AssetId, RR.ContactPhone, RR.ContactEmail, RR.DepartmentId, RR.IsRushRepair, RR.IsCriticalSpare, RR.IsWarrantyRecovery, RR.IsWarrantyDenied,
    RR.IsRepairTag, RR.RRDescription, RR.StatedIssue, RR.UserId, RR.Modified, RR.ModifiedBy,
    RR.CustomerPONo, RR.CustomerShipToId, RR.CustomerBillToId, RR.RRId

  ]

  //console.log("RRSQl=" + sql);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({
        kind: "not_found"
      }, null);
      return;
    }
    result(null, {
      id: RR.RRId,
      ...RR
    });
    return;
  });

};


RR.UpdateRRNo = (RRId, result) => {
  var sql = `UPDATE tbl_repair_request  SET   RRNo = CONCAT('RR',?)  WHERE RRId = ?`;
  var values = [RRId, RRId];
  con.query(sql, values, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({
        kind: "not_found"
      }, null);
      return;
    }
    result(null, {
      id: RRId
    });
    return;
  });
};

RR.UpdateCustomerPONoByRRId = (CustomerPONo, RRNo, result) => {
  var sql = `UPDATE tbl_repair_request  SET CustomerPONo ='${CustomerPONo}'  WHERE RRNo = '${RRNo}' `;
  //console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({
        kind: "RR not_found"
      }, null);
      return;
    }
    result(null, CustomerPONo);
    return;
  });
};

RR.IsUsedCustomerBlanketPOId = (CustomerBlanketPOId, result) => {
  var sql = `Select CustomerBlanketPOId,'w' as d from tbl_repair_request where IsDeleted=0 and CustomerBlanketPOId='${CustomerBlanketPOId}' `;
  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

RR.ResetApprovedQuoteSOPOInvoice = (RRBody, result) => {
  var RRObj = new RR(RRBody);
  var quote_sql = `UPDATE tbl_quotes SET Status='${Constants.CONST_QUOTE_STATUS_CANCELLED}',QuoteCustomerStatus='${Constants.CONST_CUSTOMER_QUOTE_CANCELLED}', Modified='${RRObj.Modified}', ModifiedBy='${RRObj.ModifiedBy}' WHERE isDeleted = 0 AND  Status = ${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED}  AND RRId =  ${RRObj.RRId} AND  RRVendorId = ${RRObj.RRVendorId}`;
  var so_sql = `UPDATE tbl_sales_order SET Status='${Constants.CONST_SO_STATUS_CANCELLED}', Modified='${RRObj.Modified}', ModifiedBy='${RRObj.ModifiedBy}' WHERE  isDeleted = 0 AND  RRId =  ${RRObj.RRId} `;
  var po_sql = `UPDATE tbl_po SET Status='${Constants.CONST_PO_STATUS_CANCELLED}', Modified='${RRObj.Modified}', ModifiedBy='${RRObj.ModifiedBy}' WHERE  isDeleted = 0 AND RRId =  ${RRObj.RRId} `;
  var invoice_sql = `UPDATE tbl_invoice SET Status='${Constants.CONST_INV_STATUS_CANCELLED}', Modified='${RRObj.Modified}', ModifiedBy='${RRObj.ModifiedBy}' WHERE isDeleted = 0 AND  RRId =  ${RRObj.RRId}  `;
  // console.log(quote_sql);
  // console.log(so_sql);
  //console.log(po_sql);
  // console.log(invoice_sql);
  async.parallel([
      function (result) {
        con.query(quote_sql, result)
      },
      function (result) {
        con.query(so_sql, result)
      },
      function (result) {
        con.query(po_sql, result)
      },
      function (result) {
        con.query(invoice_sql, result)
      }
    ],
    function (err, results) {
      if (err)
        return result(err, null);
      if (results[0][0]) {
        result(null, results[0][0]);
        return;
      } else {
        return result(null, null);
      }
    }
  );

};


RR.UpdateVendorOfRequestByRRId = (RRObj, result) => {
  var sql = `UPDATE tbl_repair_request  SET VendorId=?, RRVendorId = ?,IsDirectedRR = ?   WHERE RRID = ?`;
  var values = [RRObj.VendorId, RRObj.RRVendorId, RRObj.IsDirectedRR >= 0 ? RRObj.IsDirectedRR : 0, RRObj.RRId];
  //console.log(sql);
  //// console.log("RR update query values " + values);

  con.query(sql, values, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, {
      id: RR.RRId,
      ...RR
    });
    return;
  });
};


RR.ResetRRVendor = (RRId, result) => {
  var RRObj = new RR({
    RRId: RRId
  });
  var sql = ` UPDATE tbl_repair_request  SET IsDirectedRR=0, RRVendorId=0, VendorId=0,CustomerSOId=0,CustomerSONo='',CustomerSODueDate=null,CustomerPONo='',
  VendorPOId=0,VendorPONo='',VendorPODueDate=null,VendorInvoiceId=0,VendorInvoiceNo='',VendorInvoiceDueDate=null,
  CustomerInvoiceId=0,CustomerInvoiceNo='',CustomerInvoiceDueDate=null,Modified='${RRObj.Modified}',ModifiedBy=${RRObj.ModifiedBy}
  WHERE RRID =${RRObj.RRId} `;
  // console.log("update status sql " + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, {
      Status: RRObj.Status
    });
    return;
  });
};



RR.ChangeRRStatus = (RRObj, result) => {
  var sql = `UPDATE tbl_repair_request  SET Status=?,RejectedStatusType=?,Modified=?,ModifiedBy=?  WHERE RRID = ?`;
  var values = [RRObj.Status, RRObj.RejectedStatusType, RRObj.Modified, RRObj.ModifiedBy, RRObj.RRId];
  // console.log(sql);
  // console.log("Completed==" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({
        msg: "Status Not updated"
      }, null);
      return;
    }
    result(null, {
      Status: RRObj.Status
    });
    return;
  });
};



RR.UpdateStatus = (RRObj, result) => {
  var sql = `UPDATE tbl_repair_request  SET Status=?,Modified=?,ModifiedBy=?  WHERE RRID = ?`;
  var values = [RRObj.Status, RRObj.Modified, RRObj.ModifiedBy, RRObj.RRId];
  // console.log(sql);
  // console.log("UpdateStatus==" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({
        msg: "Status Not updated"
      }, null);
      return;
    }
    result(null, RRObj);
    return;
  });
};

RR.UpdateRRCompletedDate = (RRObj, result) => {
  var sql = `UPDATE tbl_repair_request  SET RRCompletedDate='${RRObj.Modified}' WHERE RRID = ${RRObj.RRId}`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({
        msg: "Not updated"
      }, null);
      return;
    }
    result(null, RRObj);
    return;
  });
};


RR.viewquerymobile = (RRId, reqbody) => {
  var sql = `Select
RR.RRId,RR.RRNo,RR.CustomerId,C.CompanyName,RR.VendorId,RR.RRVendorId,PartId,PartNo,
SerialNo,IsRushRepair,IsWarrantyRecovery,IsRepairTag,Price,
RRDescription,StatedIssue,RR.IsActive,
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
ELSE '-'	end StatusName, V.VendorName,V.VendorCode
from tbl_repair_request as RR
LEFT JOIN tbl_vendors as V ON V.VendorId = RR.VendorId
LEFT JOIN tbl_customers as C ON C.CustomerId = RR.CustomerId
where RR.IsDeleted=0 and RR.RRId=${RRId} `;



  var LoginIdentityId = getLogInIdentityId(reqbody);
  var LoginIdentityType = getLogInIdentityType(reqbody);

  if (LoginIdentityType == Constants.CONST_IDENTITY_TYPE_VENDOR)
    sql += ` AND RR.VendorId='${LoginIdentityId}' `;
  return sql;
};



RR.viewqueryshort = (RRId) => {
  var sql = `Select RR.RRId,RR.RRNo,RR.CustomerId,RR.VendorId,RR.RRVendorId,RR.Status,RRV.Status as StatusBeforeNotRepairable,
  RR.CustomerBlanketPOId,q.GrandTotal as QuoteAmount,q.QuoteId,RR.CustomerPONo,RR.IsActive,RR.SubStatusId,RR.AssigneeUserId,RR.RRPartLocationId
  from tbl_repair_request as RR
  LEFT JOIN tbl_repair_request_vendors as RRV ON RRV.RRVendorId = RR.RRVendorId
  LEFT JOIN tbl_quotes as q ON q.RRId = RR.RRId
  where RR.IsDeleted=0 and RR.RRId=${RRId}`;
  if (global.authuser.IdentityType == 1) {
    sql += ` and RR.CustomerId In(${global.authuser.MultipleAccessIdentityIds})`;
  }
  //console.log("sql=" + sql)
  return sql;
};

RR.UpdateCustomerBlanketPOIdToRR = (CustomerBlanketPOId, CustomerPONo, RRId, result) => {

  var sql = `UPDATE tbl_repair_request  SET CustomerBlanketPOId=?,CustomerPONo=?  WHERE RRId = ?`;
  var values = [CustomerBlanketPOId, CustomerPONo, RRId];
  // console.log("update status sql" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, RRId);
    return;
  });
};


RR.viewquery = (RRId, reqBody) => {
  var sql = `Select RR.PartPON,
RR.RRId,RR.RRNo,RR.CustomerId,C.CompanyName,RR.VendorId,RR.RRVendorId,RR.DepartmentId,AssetId,RR.PartId,RR.PartItemId,RR.PartNo,RR.IsActive,CustomerShipToId,CustomerBillToId,
RR.SerialNo,IsRushRepair,IsCriticalSpare,IsWarrantyRecovery,IsRepairTag,RR.Price,
RRDescription,StatedIssue,CustomerSONo,RR.CustomerPONo,VendorPONo,VendorPODueDate,CustomerSODueDate,
RR.VendorInvoiceNo,RR.CustomerInvoiceNo,CustomerInvoiceDueDate,ReportStatus,RR.Status,RR.UserId,ContactPhone,ContactEmail,ShippingStatus,ShippingIdentityType,ShippingIdentityId,ShippingIdentityName,
inv.InventoryId,C.IsDisplayPOInQR,RR.ShippingAddressId,RR.CreatedByLocation,RRC.CountryName as CreatedByLocationName,RR.IsActive,RR.SubStatusId,RR.AssigneeUserId,RR.RRPartLocationId,pl.RRPartLocation,ss.SubStatusName, CONCAT(au.FirstName,' ', au.LastName) as AssigneeUserName,
RR.IsWarrantyDenied,RR.IsPartMovedToStore,
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
ELSE '-'	end StatusName, V.VendorName,V.VendorCode,V.IsAllowQuoteBeforeShip,RR.AddedFrom,
RR.CustomerSOId,RR.VendorPOId,RR.CustomerInvoiceId,RR.VendorInvoiceDueDate ,
RR.VendorInvoiceId,C.PriorityNotes,d.CustomerDepartmentName,a.CustomerAssetName,u.UserName,
CASE RR.RejectedStatusType
WHEN 1 THEN '${Constants.array_customer_quote_reject_status[1]}'
WHEN 2 THEN '${Constants.array_customer_quote_reject_status[2]}'
WHEN 3 THEN '${Constants.array_customer_quote_reject_status[3]}'
WHEN 4 THEN '${Constants.array_customer_quote_reject_status[4]}'
WHEN 5 THEN '${Constants.array_customer_quote_reject_status[5]}'
WHEN 6 THEN '${Constants.array_customer_quote_reject_status[6]}'
WHEN 7 THEN '${Constants.array_customer_quote_reject_status[7]}'
WHEN 8 THEN '${Constants.array_customer_quote_reject_status[8]}'
ELSE '-'	end RejectedStatusTypeName,RR.RejectedStatusType,
ab1.StreetAddress as ShipToStreetAddress,
ab1.SuiteOrApt as ShipToSuiteOrApt,ab1.City as ShipToCity,
s1.StateName as ShipToState,c1.CountryName as ShipToCountry,
ab1.Zip as ShipToZip,ab1.Email as ShipToEmail,
ab1.PhoneNoPrimary as ShipToPhoneNoPrimary,

ab2.StreetAddress as BillToStreetAddress,
ab2.SuiteOrApt as BillToSuiteOrApt,ab2.City as BillToCity,
s2.StateName as BillToState,c2.CountryName as BillToCountry,
ab2.Zip as BillToZip,ab2.Email as BillToEmail,
ab2.PhoneNoPrimary as BillToPhoneNoPrimary,DATE_FORMAT(RR.Created, '%m/%d/%Y') as CreatedDate,
CASE PO.Status WHEN '${Constants.CONST_PO_STATUS_APPROVED}' THEN 1 Else 0 END IsPoApproved,PO.GrandTotal POAmount,
CASE SO.Status WHEN '${Constants.CONST_SO_STATUS_APPROVED}' THEN 1 Else 0 END IsSOApproved ,
CASE i.Status WHEN '${Constants.CONST_INV_STATUS_APPROVED}' THEN 1 Else 0  END IsInvoiceApproved,
Ifnull(i.IsCSVProcessed,0) as IsCSVProcessedInvoice,
CASE vi.Status WHEN '${Constants.CONST_VENDOR_INV_STATUS_APPROVED}' THEN 1 Else 0 END IsVendorBillApproved,
Ifnull(vi.IsCSVProcessed,0) as IsCSVProcessedVendorInvoice,
RR.IsReverted,RR.CustomerBlanketPOId,
Case V.VendorTypeId when "B" then "OEM" else "-" end as VendorTypeName,V.VendorTypeId,
IF(FIND_IN_SET(V.VendorId,C.DirectedVendors)>0,'Directed','-') as Directed,
C.UPSShipperNumber as CustomerUPSShipperNumber,
CURV.CurrencySymbol as VendorCurrencySymbol,CURC.CurrencySymbol as CustomerCurrencySymbol,V.VendorCurrencyCode,C.CustomerCurrencyCode,SETT.DefaultCurrency,
(SELECT ConsolidateInvoiceId FROM tbl_invoice_consolidate_detail where InvoiceId=i.InvoiceId AND IsDeleted = 0 LIMIT 1) as ConsolidateInvoiceId,
   IF((SELECT ConsolidateInvoiceId FROM tbl_invoice_consolidate_detail where InvoiceId=i.InvoiceId AND IsDeleted = 0 LIMIT 1)>0, true, false) as Consolidated,
   P.APNNo,P.VendorId as PartsVendorId,P.IsEcommerceProduct,P.PartCategoryId,P.BuyingPrice, P.SellingPrice, P.SellingCurrencyCode, P.ShopCurrentQuantity, P.BuyingExchangeRate, P.SellingExchangeRate, P.BaseBuyingPrice, P.BaseSellingPrice   
from tbl_repair_request as RR
LEFT JOIN tbl_po as PO ON PO.POId = RR.VendorPOId
LEFT JOIN tbl_sales_order as SO ON SO.SOId = RR.CustomerSOId
LEFT JOIN tbl_invoice as i ON i.InvoiceId = RR.CustomerInvoiceId
LEFT JOIN tbl_vendor_invoice as vi ON vi.VendorInvoiceId = RR.VendorInvoiceId
LEFT JOIN tbl_parts as P ON P.PartId = RR.PartId
LEFT JOIN tbl_vendors as V ON V.VendorId = RR.VendorId
LEFT JOIN tbl_customers as C ON C.CustomerId = RR.CustomerId

LEFT JOIN tbl_address_book ab1 on ab1.AddressId=RR.CustomerShipToId
LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId

LEFT JOIN tbl_address_book ab2 on ab2.AddressId=RR.CustomerBillToId
LEFT JOIN tbl_countries c2 on c2.CountryId=ab2.CountryId
LEFT JOIN tbl_states s2 on s2.StateId=ab2.StateId
LEFT JOIN tbl_inventory inv on inv.PartItemId=RR.PartItemId
LEFT JOIN tbl_customer_departments d on d.CustomerDepartmentId=RR.DepartmentId
LEFT JOIN tbl_customer_assets a on a.CustomerAssetId=RR.AssetId
LEFT JOIN tbl_users u on u.UserId=RR.UserId
LEFT JOIN tbl_currencies as CURV  ON CURV.CurrencyCode = V.VendorCurrencyCode AND CURV.IsDeleted = 0
LEFT JOIN tbl_currencies as CURC  ON CURC.CurrencyCode = C.CustomerCurrencyCode AND CURC.IsDeleted = 0
LEFT JOIN tbl_settings_general as SETT ON SETT.SettingsId = 1 AND SETT.IsDeleted = 0 
LEFT JOIN tbl_countries RRC on RRC.CountryId=RR.CreatedByLocation
LEFT JOIN tbl_users au ON au.UserId=RR.AssigneeUserId
LEFT JOIN tbl_repair_request_substatus ss ON ss.SubStatusId=RR.SubStatusId
LEFT JOIN tbl_repair_request_part_location pl ON pl.RRPartLocationId=RR.RRPartLocationId
where RR.IsDeleted=0 and RR.RRId=${RRId}`;

  var MultipleAccessIdentityIds = getLogInMultipleAccessIdentityIds(reqBody);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(reqBody);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqBody);
  var LoginIdentityType = getLogInIdentityType(reqBody);

  if (LoginIdentityType == 1) {
    sql += ` and RR.CustomerId In(${MultipleAccessIdentityIds})`;
  }
  if (LoginIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and RR.CustomerId in(${MultipleCustomerIds}) `;
  }
  // console.log("sql=" + sql)
  return sql;
};



RR.GetRRDetail = (RRId, reqbody) => {
  var sql = `Select RR.RRId,RR.RRNo,RR.CustomerId,C.CompanyName,RR.VendorId,V.VendorName,
  RR.PartId,RR.PartNo,CustomerShipToId,CustomerBillToId,
SerialNo,IsRushRepair,IsWarrantyRecovery,IsRepairTag,Price,RR.IsActive,
RRDescription,StatedIssue,RR.Status,
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
ELSE '-'	end StatusName,RR.ShippingStatus,RR.ShippingIdentityType,RR.ShippingAddressId,RR.ShippingIdentityId

From tbl_repair_request as RR
LEFT JOIN tbl_vendors as V ON V.VendorId = RR.VendorId
LEFT JOIN tbl_customers as C ON C.CustomerId = RR.CustomerId
where RR.IsDeleted=0 and RR.RRId=${RRId}`;

  var MultipleAccessIdentityIds = getLogInMultipleAccessIdentityIds(reqbody);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(reqbody);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqbody);
  var LoginIdentityType = getLogInIdentityType(reqbody);

  if (LoginIdentityType == 1) {
    sql += ` and RR.CustomerId In(${MultipleAccessIdentityIds})`;
  }
  if (LoginIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and RR.CustomerId in(${MultipleCustomerIds}) `;
  }
  //console.log("sql=" + sql)
  return sql;
};

RR.BulkShipView = (BulkShipId, reqbody) => {
  var sql = `Select RR.*,
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
  ELSE '-'	end StatusName

  From tbl_repair_request as RR
  where RR.IsDeleted=0
  and RR.RRId In(Select RRId From tbl_repair_request_bulk_shipping_log where BulkShipId=${BulkShipId})`;

  var MultipleAccessIdentityIds = getLogInMultipleAccessIdentityIds(reqbody);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(reqbody);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqbody);
  var LoginIdentityType = getLogInIdentityType(reqbody);

  if (LoginIdentityType == 1) {
    sql += ` and RR.CustomerId In(${MultipleAccessIdentityIds})`;
  }
  if (LoginIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and RR.CustomerId in(${MultipleCustomerIds}) `;
  }
  // console.log("sql=" + sql)
  return sql;
};

RR.InfoForinvoiceDataquery = (RRId) => {
  var sql = `Select
  RR.RRId,RR.RRNo,V.VendorName, RR.CustomerId, C.CompanyName,
  S.GrandTotal as CustomerInvoiceAmount,i.InvoiceId,i.InvoiceNo
 from tbl_repair_request as RR
 LEFT JOIN tbl_vendors as V ON V.VendorId = RR.VendorId
 LEFT JOIN tbl_customers as C ON C.CustomerId = RR.CustomerId
 LEFT JOIN tbl_sales_order as S ON S.SOId = RR.CustomerSOId
 LEFT JOIN tbl_invoice as i ON i.RRId = RR.RRId
 where RR.IsDeleted=0 and RR.RRId=${RRId}`;
  return sql;
};

RR.InfoForinvoiceDataqueryWithOutRRId = (POId) => {
  var sql = `Select
  V.VendorName, i.CustomerId, C.CompanyName,
  s.GrandTotal as CustomerInvoiceAmount,i.InvoiceId,i.InvoiceNo,p.POId
 from tbl_po as p
 LEFT JOIN tbl_sales_order as s ON s.SOId = p.SOId
LEFT JOIN tbl_invoice as i ON i.SOId = s.SOId
 LEFT JOIN tbl_vendors as V ON V.VendorId = p.VendorId
 LEFT JOIN tbl_customers as C ON C.CustomerId = i.CustomerId
 where p.IsDeleted=0 and p.POId=${POId}`;
  // console.log(sql)
  return sql;
};

RR.updateShipStatusQuery = (objModel) => {
  var Obj = new RR({
    ShippingStatus: 1,
    ShippingIdentityType: objModel.ShipFromIdentity,
    ShippingIdentityId: objModel.ShipFromId,
    ShippingIdentityName: objModel.ShipFromName,
    RRId: objModel.RRId
  });
  var sql = `Update tbl_repair_request SET  ShippingStatus='${Obj.ShippingStatus}' , ShippingIdentityType='${Obj.ShippingIdentityType}' ,ShippingIdentityId='${Obj.ShippingIdentityId}', ShippingIdentityName= '${Obj.ShippingIdentityName}', Modified='${Obj.Modified}', ModifiedBy='${Obj.ModifiedBy}';
  where IsDeleted=0 and RRId=${Obj.RRId}`;
  return sql;
};

RR.updateReceiveStatusQuery = (objModel) => {
  var Obj = new RR({
    ShippingStatus: 2,
    ShippingIdentityType: objModel.ShipToIdentity,
    ShippingIdentityId: objModel.ShipToId,
    ShippingIdentityName: objModel.ShipToName,
    RRId: objModel.RRId
  });
  var sql = `Update tbl_repair_request SET  ShippingStatus='${Obj.ShippingStatus}' , ShippingIdentityType='${Obj.ShippingIdentityType}' ,ShippingIdentityId='${Obj.ShippingIdentityId}', ShippingIdentityName= '${Obj.ShippingIdentityName}', Modified='${Obj.Modified}', ModifiedBy='${Obj.ModifiedBy}'
  where IsDeleted=0 and RRId=${Obj.RRId}`;
  return sql;
};

RR.DeleteBulkRR = (RRId, result) => {
  // console.log(RRId);
  result(null, RRId);
}

RR.DeleteRR = (RRId, result) => {
  var RRObj = new RR({
    RRId: RRId
  });
  var sql = `UPDATE tbl_repair_request  SET IsDeleted=?,Modified=?,ModifiedBy=?   WHERE IsDeleted = 0 AND RRId>0 AND RRID = ?`;
  var values = [1, RRObj.Modified, RRObj.ModifiedBy, RRObj.RRId];

  var rrparts_delete = RRParts.DeleteRRPartsQuery(RRId);
  var cref_delete = RRCustomerRef.DeleteRRCusRefQuery(RRId);
  var DeleteRRImgQuery = RRImages.DeleteRRImgQuery(RRId);
  var DeleteRRVendorQuery = RRVendors.DeleteRRVendorQuery(RRId);
  var DeleteRRVEndorPartsQuery = RRVendorParts.DeleteRRVendorPartsQuery(RRId);
  var DeleteRRNotesQuery = RRNotes.DeleteRRNotesQuery(Constants.CONST_IDENTITY_TYPE_RR, RRId);
  var DeleteQuotesQuery = Quotes.DeleteQuotesQuery(RRId);
  var DeletePurchaseOrderQuery = PurchaseOrder.DeletePurchaseOrderQuery(RRId);
  // var DeleteSalesOrderBYRRQuery = SalesOrder.DeleteSalesOrderByRRQuery(RRId);
  // var DeleteSalesOrderQuery = SalesOrder.DeleteSalesOrderQuery(RRId);
  const Invoice = require("./invoice.model.js");
  // var DeleteInvoiceQuery = Invoice.DeleteInvoiceQuery(RRId);
  var DeleteVendorInvoiceQuery = VendorInvoice.DeleteVendorInvoiceQuery(RRId);
  async.parallel([
      function (result) {
        con.query(sql, values, result)
      },
      function (result) {
        con.query(rrparts_delete, result)
      },
      function (result) {
        con.query(cref_delete, result)
      },
      function (result) {
        con.query(DeleteRRImgQuery, result)
      },
      function (result) {
        con.query(DeleteRRVendorQuery, result)
      },
      function (result) {
        con.query(DeleteRRVEndorPartsQuery, result)
      },
      function (result) {
        con.query(DeleteRRNotesQuery, result)
      },
      function (result) {
        con.query(DeleteQuotesQuery, result)
      },
      function (result) {
        con.query(DeletePurchaseOrderQuery, result)
      },
      function (result) {
        SalesOrder.DeleteSalesOrderByRRQuery(RRId, result)
      },
      // function (result) { con.query(DeleteSalesOrderQuery, result) },
      // function (result) { con.query(DeleteInvoiceQuery, result) },
      function (result) {
        con.query(DeleteVendorInvoiceQuery, result)
      }
    ],
    function (err, results) {
      if (err)
        return result(err, null);
      if (results[0][0]) {
        result(null, results[0][0]);
        return;
      } else {
        result({
          msg: "RR not found"
        }, null);
        return;
      }
    }
  );
};



RR.complete = (reqBody, result) => {
  if (reqBody.hasOwnProperty('RRId')) {

    const RRObj = new RR({
      authuser: reqBody.authuser,
      RRId: reqBody.RRId,
      Status: Constants.CONST_RRS_COMPLETED
    });

    var RRStatusHistoryObj = new RRStatusHistory({
      authuser: reqBody.authuser,
      RRId: reqBody.RRId,
      HistoryStatus: Constants.CONST_RRS_COMPLETED
    });

    //To add a RR status to notification table
    var NotificationObj = new NotificationModel({
      authuser: reqBody.authuser,
      RRId: reqBody.RRId,
      NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
      NotificationIdentityId: reqBody.RRId,
      NotificationIdentityNo: 'RR' + reqBody.RRId,
      ShortDesc: 'RR Completed',
      Description: 'RR Completed  by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
    });


    async.parallel([
        function (result) {
          RR.ChangeRRStatus(RRObj, result);
        },
        function (result) {
          RRStatusHistory.Create(RRStatusHistoryObj, result);
        },
        function (result) {
          NotificationModel.Create(NotificationObj, result);
        },
        function (result) {
          RR.UpdateRRCompletedDate(RRObj, result);
        },
      ],
      function (err, results) {
        if (err)
          result(err, null);

        result(null, {
          dataP: results[0][0],
          ...reqBody
        });
        return;

      }
    );
  } else {
    result({
      msg: "RR not found"
    }, null);
    return;
  }
};






RR.findDuplicateOrWarranty = (ReqBody, result) => {
  var sql_check = `SELECT * FROM tbl_repair_request WHERE IsDeleted = ? AND PartNo = ? AND SerialNo = ? ORDER BY RRId ASC LIMIT 1 `;
  var values = [0, ReqBody.PartNo, ReqBody.SerialNo];
  con.query(sql_check, values, (err1, res) => {
    if (err1) {
      return result(null, err1);
    }
    if (res.length > 0) {
      var RRId = res[0].RRId;
      //console.log("RRId =" + RRId);
      var sql = RR.viewquery(RRId, ReqBody);
      var sqlRRImages = RRImages.ViewRRImages(RRId);
      var sqlRRCustomerRef = RRCustomerRef.ViewCustomerReference(RRId);
      var sqlRRParts = RRParts.ViewRRParts(RRId);
      var sqlRRNotes = RRNotes.ViewNotes(Constants.CONST_IDENTITY_TYPE_RR, RRId);
      var ListAttachmentQuery = AttachmentModel.ListAttachmentQuery(Constants.CONST_IDENTITY_TYPE_RR, RRId);
      var GetRRQuoteApprovedQuery = Quotes.GetRRApprovedQuoteQuery(RRId);
      var GetRRRejectedQuoteQuery = Quotes.GetRRRejectedQuoteQueryforQuplicate(RRId);

      async.parallel([
          function (result) {
            con.query(sql, result)
          },
          function (result) {
            con.query(sqlRRImages, result)
          },
          function (result) {
            con.query(sqlRRCustomerRef, result)
          },
          function (result) {
            con.query(sqlRRParts, result)
          },
          function (result) {
            con.query(sqlRRNotes, result)
          },
          function (result) {
            con.query(ListAttachmentQuery, result)
          },
          function (result) {
            con.query(GetRRQuoteApprovedQuery, result)
          },
          function (result) {
            con.query(GetRRRejectedQuoteQuery, result)
          },
        ],
        function (err, results) {
          if (err)
            return result(err, null);

          //console.log("results 0 0 " + results[0][0]);

          if (results[0][0].length > 0) {
            result(null, {
              RRInfo: results[0][0],
              RRImages: results[1][0],
              CustomerRefInfo: results[2][0],
              RRPartsInfo: results[3][0],
              RRNotesInfo: results[4][0],
              AttachmentList: results[5][0],
              ApprovedQuoteInfo: results[6][0],
              RejectedQuoteInfo: results[7][0]
            });
            return;
          } else {
            result({
              msg: "RR not found"
            }, null);
            return;
          }
        }
      );
    } else {
      result({
        msg: "RR not found"
      }, null);
      return;
    }
  });

};


RR.RRViewVendorPortal = (reqBody, result) => {
  var RRId = reqBody.RRId;
  var sql = RR.viewquery(RRId, reqBody);
  var sqlRRImages = RRImages.ViewRRImages(RRId);
  var sqlVendors = RRVendors.ViewRepairRequestVendors(RRId);
  var sqlVendorsParts = RRVendorParts.ViewVendorParts(RRId);
  var sqlRRParts = RRParts.ViewRRParts(RRId);
  var sqlRRNotes = RRNotes.ViewNotes(Constants.CONST_IDENTITY_TYPE_RR, RRId);
  var sqlRRStatusHistory = RRStatusHistory.ViewRRStatusHistory(RRId);
  const RRShippingHistoryModel = require("../models/repair.request.shipping.history.model.js");
  var RRShippingHistoryQuery = RRShippingHistoryModel.listquery(RRId);
  var RRWarrantyQuery = WarrantyModel.ViewByRRQuery(RRId);
  async.parallel([
      function (result) {
        con.query(sql, result)
      },
      function (result) {
        con.query(sqlRRImages, result)
      },
      function (result) {
        con.query(sqlVendors, result)
      },
      function (result) {
        con.query(sqlVendorsParts, result)
      },
      function (result) {
        con.query(sqlRRParts, result)
      },
      function (result) {
        con.query(sqlRRNotes, result)
      },
      function (result) {
        con.query(sqlRRStatusHistory, result)
      },
      function (result) {
        con.query(RRShippingHistoryQuery, result)
      },
      function (result) {
        con.query(RRWarrantyQuery, result)
      }
    ],
    function (err, results) {
      if (err)
        return result(err, null);
      if (results[0][0].length > 0 && results[0][0][0].VendorId == global.authuser.IdentityId) {
        result(null, {
          RRInfo: results[0][0],
          RRImages: results[1][0],
          VendorsInfo: results[2][0],
          VendorPartsInfo: results[3][0],
          RRPartsInfo: results[4][0],
          RRNotesInfo: results[5][0],
          RRStatusHistory: results[6][0],
          RRShippingHistory: results[7][0],
          WarrantyInfo: results[8][0]
        });
        return;
      } else {
        result({
          msg: "RR not found"
        }, null);
        return;
      }
    }
  );
};


RR.RRViewCustomerPortal = (reqBody, result) => {
  const QuoteItem = require("../models/quote.item.model.js");
  var RRId = reqBody.RRId;
  var sql = RR.viewquery(RRId, reqBody);
  var sqlRRImages = RRImages.ViewRRImages(RRId);
  var sqlVendors = RRVendors.ViewRepairRequestVendors(RRId);
  var sqlVendorsParts = RRVendorParts.ViewVendorParts(RRId);
  var sqlRRCustomerRef = RRCustomerRef.ViewCustomerReference(RRId);
  var sqlRRParts = RRParts.ViewRRParts(RRId);
  var sqlRRNotes = RRNotes.ViewNotes(Constants.CONST_IDENTITY_TYPE_RR, RRId);
  var sqlRRStatusHistory = RRStatusHistory.ViewRRStatusHistory(RRId);
  const RRShippingHistoryModel = require("../models/repair.request.shipping.history.model.js");
  var RRShippingHistoryQuery = RRShippingHistoryModel.listquery(RRId);
  //var RRShippingHistoryQuery = "SELECT * from tbl_repair_request_shipping_history WHERE RRId=" + RRId;
  var FollowUpQuery = FollowUp.View(RRId);
  var ListAttachmentQuery = AttachmentModel.ListAttachmentQuery(Constants.CONST_IDENTITY_TYPE_RR, RRId);
  var GetRRQuoteQuery = Quotes.GetRRQuoteQuery(RRId);


  var GetRRQuoteApprovedQuery = Quotes.GetRRApprovedQuoteQuery(RRId);

  var RRWarrantyQuery = WarrantyModel.ViewByRRQuery(RRId);
  var GetRRSubmittedQuoteQuery = Quotes.GetRRSubmittedQuoteQuery(RRId);

  var GetRRRejectedQuoteQuery = Quotes.GetRRRejectedQuoteQuery(RRId);

  var RRCustomerAttachment = RRCustomerAttachmentModel.ListAttachmentQuery(RRId);

  // var GetRRQuoteItemQuery = QuoteItem.GetRRQuoteItemQuery(RRId);
  var GetRRQuoteItemQuery = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.WarrantyPeriod,qi.LeadTime, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,
  CURL.CurrencySymbol as ItemLocalCurrencySymbol,CURB.CurrencySymbol as ItemBaseCurrencySymbol,qi.BaseRate,qi.BaseTax
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId 
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = qi.ItemLocalCurrencyCode AND CURL.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = qi.ItemBaseCurrencyCode AND CURB.IsDeleted = 0
  where tq.IsDeleted=0 and tq.RRId=${RRId}`;
  //var GetRRQuoteItemApprovedQuery = QuoteItem.GetRRApprovedQuoteItemQuery(RRId);
  var GetRRQuoteItemApprovedQuery = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.WarrantyPeriod,qi.LeadTime, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,CUR.CurrencySymbol, CURI.CurrencySymbol as ItemLocalCurrencySymbol,qi.BaseRate,qi.BaseTax
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = tq.LocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURI  ON CURI.CurrencyCode = qi.ItemLocalCurrencyCode AND CURI.IsDeleted = 0
  where tq.IsDeleted=0 and tq.QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED} and tq.RRId=${RRId}`;
  // var GetRRSubmittededQuoteItemQuery = QuoteItem.GetRRSubmittededQuoteItemQuery(RRId);
  var GetRRSubmittededQuoteItemQuery = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.WarrantyPeriod,qi.LeadTime, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,CURB.CurrencySymbol as ItemBaseCurrencySymbol, CUR.CurrencySymbol as ItemLocalCurrencySymbol,qi.BaseRate,qi.BaseTax
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId
  LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = qi.ItemBaseCurrencyCode AND CURB.IsDeleted = 0
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = qi.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
  where tq.IsDeleted=0 and (tq.Status=4 OR tq.Status=1)  and QuoteCustomerStatus=1 and tq.RRId=${RRId}`;
  //  var GetRRRejectededQuoteItemQuery = QuoteItem.GetRRRejectededQuoteItemQuery(RRId);
  var GetRRRejectededQuoteItemQuery = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.WarrantyPeriod,qi.LeadTime, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice, CUR.CurrencySymbol as ItemLocalCurrencySymbol,qi.BaseRate,qi.BaseTax
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = qi.ItemLocalCurrencyCode AND CUR.IsDeleted = 0
  where tq.IsDeleted=0 and tq.Status=2 and QuoteCustomerStatus=3 and tq.RRId=${RRId}`;



  async.parallel([
      function (result) {
        con.query(sql, result)
      },
      function (result) {
        con.query(sqlRRImages, result)
      }, // 1
      function (result) {
        con.query(sqlVendors, result)
      },
      function (result) {
        con.query(sqlVendorsParts, result)
      },
      function (result) {
        con.query(sqlRRCustomerRef, result)
      }, // 4
      function (result) {
        con.query(sqlRRParts, result)
      },
      function (result) {
        con.query(sqlRRNotes, result)
      },
      function (result) {
        con.query(sqlRRStatusHistory, result)
      }, // 7
      function (result) {
        con.query(RRShippingHistoryQuery, result)
      },
      function (result) {
        con.query(FollowUpQuery, result)
      }, // 9
      function (result) {
        con.query(ListAttachmentQuery, result)
      },
      function (result) {
        con.query(GetRRQuoteQuery, result)
      }, // 11
      function (result) {
        con.query(GetRRQuoteItemQuery, result)
      },
      function (result) {
        con.query(GetRRQuoteApprovedQuery, result)
      },
      function (result) {
        con.query(GetRRQuoteItemApprovedQuery, result)
      }, // 14
      function (result) {
        con.query(RRWarrantyQuery, result)
      },
      function (result) {
        con.query(GetRRSubmittedQuoteQuery, result)
      },
      function (result) {
        con.query(GetRRSubmittededQuoteItemQuery, result)
      }, // 17
      function (result) {
        con.query(GetRRRejectedQuoteQuery, result)
      }, //18
      function (result) {
        con.query(GetRRRejectededQuoteItemQuery, result)
      }, //19
      function (result) {
        con.query(RRCustomerAttachment, result)
      }
    ],
    function (err, results) {
      if (err)
        return result(err, null);
      if (results[0][0].length > 0) {

        result(null, {
          RRInfo: results[0][0],
          RRImages: results[1][0],
          VendorsInfo: results[2][0],
          VendorPartsInfo: results[3][0],
          CustomerRefInfo: results[4][0],
          RRPartsInfo: results[5][0],
          RRNotesInfo: results[6][0],
          RRStatusHistory: results[7][0],
          RRShippingHistory: results[8][0],
          FollowUpHistory: results[9][0],
          AttachmentList: results[10][0],
          QuoteInfo: results[11][0],
          QuoteItems: results[12][0],
          ApprovedQuoteInfo: results[13][0],
          ApprovedQuoteItems: results[14][0],
          WarrantyInfo: results[15][0],
          SubmittedQuote: results[16][0],
          SubmittedQuoteItem: results[17][0],
          RejectedQuote: results[18][0],
          RejectedQuoteItem: results[19][0],
          RRCustomerAttachment: results[20][0]
        });
        return;

      } else {
        result({
          msg: "RR not found"
        }, null);
        return;
      }
    }
  );
};



RR.RRViewMobile = (reqbody, result) => {
  var RRId = reqbody.RRid;
  var sql = RR.viewquerymobile(RRId, reqbody);
  var sqlRRImages = RRImages.ViewRRImages(RRId);

  async.parallel([
      function (result) {
        con.query(sql, result)
      },
      function (result) {
        con.query(sqlRRImages, result)
      }
    ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        RRInfo: results[0][0],
        RRImages: results[1][0]
      });
      return;
    }
  );
};

RR.RRViewMobileVendor = (reqbody, VendorId, result) => {
  var RRId = reqbody.RRId;
  var sql = RR.viewquerymobile(RRId, reqbody);
  var sqlRRImages = RRImages.ViewRRImages(RRId);
  var sqlRRVendorAttachment = RepairRequestVendorAttachment.ViewRRVendorAttachment(VendorId, RRId);
  async.parallel([
      function (result) {
        con.query(sql, result)
      },
      function (result) {
        con.query(sqlRRImages, result)
      },
      function (result) {
        con.query(sqlRRVendorAttachment, result)
      }
    ],
    function (err, results) {
      if (err)
        return result(err, null);
      result(null, {
        RRInfo: results[0][0],
        RRImages: results[1][0],
        RRVendorAttachmentList: results[2][0]
      });
      return;
    }
  );
};

RR.findById = (reqBody, result) => {
  var RRId = reqBody.RRId;
  var sql = RR.viewquery(RRId, reqBody);
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);

    if (res.length > 0) {

      const QuoteItem = require("../models/quote.item.model.js");


      let PartId = res[0].PartId ? res[0].PartId : 0;
      let CustomerId = res[0].CustomerId;

      var sqlRRGMTracker = RepairRequestGmTrackerModel.ViewRRGMTracker(RRId);
      var sqlRRImages = RRImages.ViewRRImages(RRId);
      var sqlVendors = RRVendors.ViewRepairRequestVendors(RRId);
      var sqlVendorsParts = RRVendorParts.ViewVendorParts(RRId);
      var sqlRRCustomerRef = RRCustomerRef.ViewCustomerReference(RRId);
      var sqlRRParts = RRParts.ViewRRParts(RRId);
      var sqlRRNotes = RRNotes.ViewNotes(Constants.CONST_IDENTITY_TYPE_RR, RRId);
      var sqlRRStatusHistory = RRStatusHistory.ViewRRStatusHistory(RRId);
      const RRShippingHistoryModel = require("../models/repair.request.shipping.history.model.js");
      var RRShippingHistoryQuery = RRShippingHistoryModel.listquery(RRId);
      var FollowUpQuery = FollowUp.View(RRId);
      var ListAttachmentQuery = AttachmentModel.ListAttachmentQuery(Constants.CONST_IDENTITY_TYPE_RR, RRId);
      var GetRRQuoteQuery = Quotes.GetRRQuoteQuery(RRId);
      // var GetRRQuoteItemQuery = QuotesItems.GetRRQuoteItemQuery(RRId);
      var GetRRQuoteItemQuery = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.WarrantyPeriod,qi.LeadTime, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,
  CURL.CurrencySymbol as ItemLocalCurrencySymbol,CURB.CurrencySymbol as ItemBaseCurrencySymbol,qi.BaseRate,qi.BaseTax
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId 
  LEFT JOIN tbl_currencies as CURL  ON CURL.CurrencyCode = qi.ItemLocalCurrencyCode AND CURL.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURB  ON CURB.CurrencyCode = qi.ItemBaseCurrencyCode AND CURB.IsDeleted = 0
  where tq.IsDeleted=0 and tq.RRId=${RRId}`;



      var GetRRQuoteApprovedQuery = Quotes.GetRRApprovedQuoteQuery(RRId);
      // var GetRRQuoteItemApprovedQuery = QuotesItems.GetRRApprovedQuoteItemQuery(RRId);

      var GetRRQuoteItemApprovedQuery = `Select qi.QuoteItemId,qi.QuoteId,qi.PartId,qi.PartNo,qi.PartDescription as Description ,qi.SerialNo,qi.Quantity
  ,qi.Rate,qi.Tax,qi.Discount,qi.Price,qi.WarrantyPeriod,qi.LeadTime, qi.ItemTaxPercent,qi.ItemLocalCurrencyCode,qi.ItemExchangeRate,qi.ItemBaseCurrencyCode,qi.BasePrice,CUR.CurrencySymbol, CURI.CurrencySymbol as ItemLocalCurrencySymbol,qi.BaseRate,qi.BaseTax
  from tbl_quotes tq 
  INNER JOIN tbl_quotes_item qi on qi.QuoteId=tq.QuoteId
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = tq.LocalCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURI  ON CURI.CurrencyCode = qi.ItemLocalCurrencyCode AND CURI.IsDeleted = 0
  where tq.IsDeleted=0 and tq.QuoteCustomerStatus=${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED} and tq.RRId=${RRId}`;

      var GetRRShopPartItemQuery = `Select RR.PartId, RR.PartNo,PI.LocationId,
  PI.APNNo,PI.VendorId as PartsVendorId,ifnull(P.IsEcommerceProduct, 0) as IsEcommerceProduct,P.PartCategoryId,PI.BuyingPrice, PI.SellingPrice, PI.SellingCurrencyCode, PI.ShopCurrentQuantity, PI.BuyingExchangeRate, PI.SellingExchangeRate, PI.BaseBuyingPrice, PI.BaseSellingPrice, PI.ShopPartItemId, PI.SerialNo,
  PI.PartItemType,PI.PartItemDelivery, ifnull(PI.PartItemDescription,P.Description) as Description
  from tbl_repair_request RR 
  LEFT JOIN tbl_parts_item_shop as PI ON PI.PartId = RR.PartId 
  LEFT JOIN tbl_parts as P ON P.PartId = PI.PartId
  where RR.IsDeleted=0 and RR.RRId=${RRId}`;


      var RRWarrantyQuery = WarrantyModel.ViewByRRQuery(RRId);

      var CustomerAddressListQuery = AddressModel.listquery(Constants.CONST_IDENTITY_TYPE_CUSTOMER, CustomerId);
      var CReferenceLabelQuery = CReferenceLabel.getAllQuery(CustomerId);
      var CustomerAssetQuery = CustomerAssetModel.listquery(CustomerId);
      var customersdepartmentQuery = CustomersDepartmentModel.listquery(CustomerId);
      var sqlRRRevertHistory = RRRevertHistoryModel.ViewRevertHistory(RRId);
      var sqlCommunicationMessages = CommunicationMessagesModel.listquery(Constants.CONST_IDENTITY_TYPE_RR, RRId);
      var sqlRRVendorAttachment = RepairRequestVendorAttachment.ViewRRVendorAttachment(res[0].VendorId, RRId);
      var sqlRRCustomerAttachment = RRCustomerAttachmentModel.ListAttachmentQuery(RRId);
      var sqlRRFollowupNotesQuery = RRFollowUpNotesModel.ViewFollowUpNotes(RRId);


      var sql_llp = `SELECT IP.Price as LPP , I.Modified
            from tbl_invoice as I
            LEFT JOIN tbl_invoice_item IP on IP.InvoiceId=I.InvoiceId AND IP.IsDeleted = 0
            where I.IsDeleted = 0 AND IP.PartId>0 AND  IP.PartId = ${PartId} AND I.Status = ${Constants.CONST_INV_STATUS_APPROVED} AND  I.CustomerId=${CustomerId}`;

      var sql_parts = `SELECT PartNo, Price as PON from tbl_parts where IsDeleted = 0 AND PartId>0 AND PartId=${PartId}`;

      var sql_recomm = `SELECT AVG(IP.Price) as RecommendedPrice
            from tbl_invoice as I
            LEFT JOIN tbl_invoice_item IP on IP.InvoiceId=I.InvoiceId AND IP.IsDeleted = 0
            where I.IsDeleted = 0 AND IP.PartId>0  AND IP.PartId = ${PartId} AND I.Status = ${Constants.CONST_INV_STATUS_APPROVED} AND  I.CustomerId=${CustomerId} GROUP BY IP.PartId`;

      var sqlViewRRAssigneeHistoryQuery = RRAssigneeHistory.ViewRRAssigneeHistory(RRId);
      var sqlViewRRLocationHistoryQuery = RRLocationHistory.ViewRRLocationHistory(RRId);
      var sqlViewRRSubStatusHistoryQuery = RRSubStatusHistory.ViewRRSubStatusHistory(RRId);
      var GetRRVendorQuoteAttachmentQuery = VendorQuoteAttachmentModel.findByRRId(RRId);
      // console.log(sqlViewRRSubStatusHistoryQuery);
      async.parallel([
          function (result) {
            con.query(sql, result)
          },
          function (result) {
            con.query(sqlRRImages, result)
          },
          function (result) {
            con.query(sqlVendors, result)
          },
          function (result) {
            con.query(sqlVendorsParts, result)
          },
          function (result) {
            con.query(sqlRRCustomerRef, result)
          },
          function (result) {
            con.query(sqlRRParts, result)
          },
          function (result) {
            con.query(sqlRRNotes, result)
          },
          function (result) {
            con.query(sqlRRStatusHistory, result)
          },
          function (result) {
            con.query(RRShippingHistoryQuery, result)
          },
          function (result) {
            con.query(FollowUpQuery, result)
          },
          function (result) {
            con.query(ListAttachmentQuery, result)
          },
          function (result) {
            con.query(GetRRQuoteQuery, result)
          },
          function (result) {
            con.query(GetRRQuoteItemQuery, result)
          },
          function (result) {
            con.query(GetRRQuoteApprovedQuery, result)
          },
          function (result) {
            con.query(GetRRQuoteItemApprovedQuery, result)
          },
          function (result) {
            con.query(RRWarrantyQuery, result)
          },
          function (result) {
            con.query(sql_parts, result)
          },
          function (result) {
            con.query(sql_llp, result)
          },
          function (result) {
            con.query(sql_recomm, result)
          },
          function (result) {
            con.query(CustomerAddressListQuery, result)
          },
          function (result) {
            con.query(CReferenceLabelQuery, result)
          },
          function (result) {
            con.query(CustomerAssetQuery, result)
          },
          function (result) {
            con.query(customersdepartmentQuery, result)
          },
          function (result) {
            VendorModel.PreferredVendorList(PartId, CustomerId, result)
          },
          function (result) {
            con.query(sqlRRRevertHistory, result)
          },
          function (result) {
            con.query(sqlCommunicationMessages, result)
          },
          function (result) {
            con.query(sqlRRVendorAttachment, result)
          },
          function (result) {
            con.query(sqlRRCustomerAttachment, result)
          },
          function (result) {
            con.query(sqlRRFollowupNotesQuery, result)
          },
          function (result) {
            con.query(sqlViewRRAssigneeHistoryQuery, result)
          },
          function (result) {
            con.query(sqlViewRRLocationHistoryQuery, result)
          },
          function (result) {
            con.query(sqlViewRRSubStatusHistoryQuery, result)
          },
          function (result) {
            con.query(sqlRRGMTracker, result)
          },
          function (result) {
            con.query(GetRRShopPartItemQuery, result)
          },
          function (result) {
            con.query(GetRRVendorQuoteAttachmentQuery, result)
          },

        ],
        function (err, results) {
          if (err) {
            console.log(err);
            return result(err, null);
          }

          let PartPONInfo = results[16][0] ? results[16][0][0] : {
            "PartNo": res[0].PartNo,
            "PON": 0
          };
          let RecommendedPrice = results[18][0] ? results[18][0][0] : {
            "RecommendedPrice": 0
          };
          // console.log(results[32]);
          result(null, {
            RRInfo: results[0][0],
            RRImages: results[1][0],
            VendorsInfo: results[2][0],
            VendorPartsInfo: results[3][0],
            CustomerRefInfo: results[4][0],
            RRPartsInfo: results[5][0],
            RRNotesInfo: results[6][0],
            RRStatusHistory: results[7][0],
            RRShippingHistory: results[8][0],
            FollowUpHistory: results[9][0],
            AttachmentList: results[10][0],
            QuoteInfo: results[11][0],
            QuoteItems: results[12][0],
            ApprovedQuoteInfo: results[13][0],
            ApprovedQuoteItems: results[14][0],
            WarrantyInfo: results[15][0],
            PartPONInfo: PartPONInfo,
            LPPInfo: results[17][0],
            RecommendedPrice: RecommendedPrice,
            CustomerAddressList: results[19][0],
            CReferenceLabelList: results[20][0],
            CustomerAssetList: results[21][0],
            CustomerDeptList: results[22][0],
            PreferredVendorList: results[23],
            RevertLog: results[24],
            CommunicationMessage: results[25],
            RRVendorAttachmentList: results[26],
            RRCustomerAttachment: results[27],
            RRFollowUpNotes: results[28],
            RRAssigneeHistory: results[29][0],
            RRLocationHistory: results[30][0],
            RRSubStatusHistory: results[31][0],
            RRGMTracker: results[32][0],
            ShopPartItems: results[33][0],
            VendorQuoteAttachment: results[34][0][0]
          });
          return;
        }
      );
    } else {
      result({
        msg: "RR not found"
      }, null);
      return;
    }

  })
};

RR.GetRRInfoAndRRShippingHistory = (reqbody, result) => {
  var RRId = reqbody.RRId
  var sql = RR.GetRRDetail(RRId, reqbody);
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length > 0) {
      const RRShippingHistoryModel = require("../models/repair.request.shipping.history.model.js");
      var RRShippingHistoryQuery = RRShippingHistoryModel.listquery(RRId);
      async.parallel([
          function (result) {
            con.query(sql, result)
          },
          function (result) {
            con.query(RRShippingHistoryQuery, result)
          },
        ],
        function (err, results) {
          if (err) {
            return result(err, null);
          }
          result(null, {
            RRInfo: results[0][0],
            RRShippingHistory: results[1][0]
          });
          return;
        });
    } else {
      result({
        msg: "RR not found"
      }, null);
      return;
    }
  })
};

RR.SearchListForBulkShipping = (REQBODY, result) => {
  const RRShippingHistoryModel = require("../models/repair.request.shipping.history.model.js");
  var RRShippingHistoryQuery = RRShippingHistoryModel.RRShipHistoryDetail(REQBODY);
  con.query(RRShippingHistoryQuery, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length > 0) {
      return result(null, res);
    } else {
      result({
        msg: "RR not found"
      }, null);
      return;
    }
  });
};

RR.UpdateCustomerSONoByRRID = (Obj, LeadTime) => {
  var sql = `UPDATE tbl_repair_request SET CustomerSONo='${Obj.CustomerSONo}',CustomerSOId='${Obj.CustomerSOId}', CustomerSODueDate = DATE_ADD(CURDATE(), INTERVAL ${LeadTime} +
  (SELECT 
    COUNT(*) AS total
    FROM 
    (   SELECT ADDDATE(CURDATE(), INTERVAL @i:=@i+1 DAY) AS DAY
        FROM (
            SELECT a.a
            FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
            CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
            CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
        ) a
        JOIN (SELECT @i := -1) r1
        WHERE 
        @i < DATEDIFF(DATE_ADD(CURDATE(), INTERVAL ${LeadTime} DAY), CURDATE())
    
    ) AS dateTable
    WHERE WEEKDAY(dateTable.Day) IN (5,6))
   DAY) ,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}'   WHERE RRId=${Obj.RRId}`;
  // console.log(sql);
  return sql;
};
RR.UpdateCustomerSONoByImportedRRID = (Obj, DueDate, LeadTime) => {
  var sql = `UPDATE tbl_repair_request SET CustomerSONo='${Obj.CustomerSONo}',CustomerSOId='${Obj.CustomerSOId}', CustomerSODueDate = '${DueDate}'   WHERE RRId=${Obj.RRId}`;
  // console.log(sql);
  return sql;
};

RR.UpdateCustomerInvoiceNoByRRID = (Obj, TermsDays) => {
  var sql = `UPDATE tbl_repair_request SET CustomerInvoiceNo='${Obj.CustomerInvoiceNo}',CustomerInvoiceId='${Obj.CustomerInvoiceId}', CustomerInvoiceDueDate = DATE_ADD(CURDATE(), INTERVAL ${TermsDays} DAY) ,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}'   WHERE RRId=${Obj.RRId}`;
  // console.log(sql);
  return sql;
};

RR.UpdateCustomerInvoiceNoByImportedRRID = (Obj, DueDate, TermsDays) => {
  var sql = `UPDATE tbl_repair_request SET CustomerInvoiceNo='${Obj.CustomerInvoiceNo}',CustomerInvoiceId='${Obj.CustomerInvoiceId}', CustomerInvoiceDueDate ='${DueDate}'   WHERE RRId=${Obj.RRId}`;
  // console.log(sql);
  return sql;
};

RR.UpdateCustomerBillShipQuery = (objModel) => {
  var Obj = new RR({
    RRId: objModel.RRId,
    CustomerShipToId: objModel.CustomerShipToId,
    CustomerBillToId: objModel.CustomerBillToId
  });
  var sql = `UPDATE tbl_repair_request SET CustomerShipToId=${Obj.CustomerShipToId},CustomerBillToId=${Obj.CustomerBillToId} ,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE RRId=${Obj.RRId}`;
  // console.log(sql);
  return sql;
};
RR.UpdateImportRRNo = (obj) => {

  var sql = `UPDATE tbl_repair_request SET Created='${obj.Created}',RRNo='${obj.RRNo}' WHERE RRId=${obj.RRId}`;
  //console.log(sql);
  return sql;
};

RR.UpdatePartPONQuery = (obj) => {

  var sql = `UPDATE tbl_repair_request SET PartPON=${obj.PartPON}, PartPONLocalCurrency = '${obj.PartPONLocalCurrency}',PartPONBaseCurrency = '${obj.PartPONBaseCurrency}',BasePartPON = ${obj.BasePartPON},PartPONExchangeRate = ${obj.PartPONExchangeRate}   WHERE RRId=${obj.RRId}`;
  // console.log(sql);
  return sql;
};

RR.UpdatePriceQuery = (obj) => {
  var sql = `Update tbl_repair_request  SET Price = '${obj.GrandTotal}' WHERE IsDeleted=0 and RRId='${obj.RRId}' `;
  //console.log(sql);
  return sql;
};

RR.UpdateCustomerPOQuery = (objModel) => {
  var Obj = new RR({
    RRId: objModel.RRId,
    CustomerPONo: objModel.CustomerPONo
  });
  var sql = `UPDATE tbl_repair_request SET CustomerPONo='${Obj.CustomerPONo}',Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE RRId=${Obj.RRId}`;
  //console.log(sql);
  return sql;
};


RR.UpdateVendorPONoByRRID = (Obj, LeadTime) => {
  var sql = `UPDATE tbl_repair_request SET VendorPONo='${Obj.VendorPONo}',VendorPOId='${Obj.VendorPOId}', VendorPODueDate = DATE_ADD(CURDATE(), INTERVAL ${LeadTime} +
  (SELECT 
    COUNT(*) AS total
    FROM 
    (   SELECT ADDDATE(CURDATE(), INTERVAL @i:=@i+1 DAY) AS DAY
        FROM (
            SELECT a.a
            FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
            CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
            CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
        ) a
        JOIN (SELECT @i := -1) r1
        WHERE 
        @i < DATEDIFF(DATE_ADD(CURDATE(), INTERVAL ${LeadTime} DAY), CURDATE())
    
    ) AS dateTable
    WHERE WEEKDAY(dateTable.Day) IN (5,6))
   DAY), Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}'    WHERE RRId=${Obj.RRId}`;
  // console.log(sql);
  return sql;
};
RR.UpdateVendorPONoByImportedRRID = (Obj, DueDate, LeadTime) => {
  var sql = `UPDATE tbl_repair_request SET VendorPONo='${Obj.VendorPONo}',VendorPOId='${Obj.VendorPOId}', VendorPODueDate = '${DueDate}'  WHERE RRId=${Obj.RRId}`;
  //console.log(sql);
  return sql;
};
RR.UpdateVendorInvoiceNoByRRID = (Obj, TermsDays, Invoicedate) => {
  var sql = `UPDATE tbl_repair_request SET VendorInvoiceId='${Obj.VendorInvoiceId}',VendorInvoiceNo='${Obj.VendorInvoiceNo}', VendorInvoiceDueDate = DATE_ADD('${Invoicedate}', INTERVAL ${TermsDays} DAY), Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}'    WHERE RRId=${Obj.RRId}`;
  //console.log(sql);
  return sql;
};
RR.UpdateVendorInvoiceNoByImportedRRID = (Obj, TermsDays, DueDate) => {
  var sql = `UPDATE tbl_repair_request SET VendorInvoiceId='${Obj.VendorInvoiceId}',VendorInvoiceNo='${Obj.VendorInvoiceNo}', VendorInvoiceDueDate = '${DueDate}'     WHERE RRId=${Obj.RRId}`;
  // console.log(sql);
  return sql;
};
RR.GetByRRId = (RRId, result) => {
  var sql = `Select CustomerId,VendorId
  From tbl_repair_request WHERE RRId=${RRId}`;
  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

RR.CustomerDropDownListForDashboard = (Obj, result) => {
  var MultipleAccessIdentityIds = getLogInMultipleAccessIdentityIds(Obj);
  con.query(`Select CustomerId,CompanyName
  From tbl_customers WHERE CustomerId In(${MultipleAccessIdentityIds}) `, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

RR.CustomerNameAutoSuggest = (SearchText, reqbody, result) => {
  var MultipleAccessIdentityIds = getLogInMultipleAccessIdentityIds(reqbody);
  con.query(`Select  CustomerId,CompanyName from tbl_customers
          WHERE IsDeleted = 0 AND (CompanyName LIKE '%${SearchText}%') And CustomerId In(${MultipleAccessIdentityIds})
           ORDER BY CustomerId ASC LIMIT 20 `, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
}
RR.IsExistCustomerIdAgainstCusPortal = (reqbody, QuoteId) => {
  var RRId = reqbody.RRId;
  var MultipleAccessIdentityIds = getLogInMultipleAccessIdentityIds(reqbody);
  var sql = `Select rr.RRId,IdentityId,q.QuoteId from tbl_repair_request rr
  Left join tbl_quotes q  On rr.RRId=q.RRId
  where rr.IsDeleted=0
  AND q.IdentityId In(${MultipleAccessIdentityIds}) and q.QuoteId=${QuoteId} and rr.RRId=${RRId} `;
  //console.log(sql);
  return sql;
};
//
RR.RejectCustomerQuoteFromCustomerPortal = (reqBody, result) => {
  if (reqBody.hasOwnProperty('RRId')) {

    var SQL = RR.IsExistCustomerIdAgainstCusPortal(reqBody.RRId, reqBody.QuoteId);
    con.query(SQL, (err, Objres) => {
      if (err) {
        result(null, err);
        return;
      }
      if (Objres.length <= 0) {
        result({
          msg: "Invalid Quote reject"
        }, null);
        return;
      }
      reqBody.Status = Constants.CONST_RRS_QUOTE_REJECTED;
      var RRStatusHistoryObj = new RRStatusHistory({
        authuser: reqBody.authuser,
        RRId: reqBody.RRId,
        HistoryStatus: Constants.CONST_RRS_QUOTE_REJECTED
      });

      reqBody.QuoteCustomerStatus = Constants.CONST_CUSTOMER_QUOTE_REJECTED;

      //To add a quote to notification table
      var NotificationObj = new NotificationModel({
        authuser: reqBody.authuser,
        RRId: reqBody.RRId,
        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_QUOTE,
        NotificationIdentityId: reqBody.QuoteId,
        NotificationIdentityNo: 'QT' + reqBody.QuoteId,
        ShortDesc: 'Customer Quote Rejected',
        Description: 'Admin (' + global.authuser.FullName + ') Rejected the Customer Quote on ' + cDateTime.getDateTime()
      });


      async.parallel([
          function (result) {
            Quotes.UpdateQuotesRejectStatus(reqBody, result);
          },
          function (result) {
            Quotes.ChangeRRStatusNew(reqBody, result);
          },
          function (result) {
            RRStatusHistory.Create(RRStatusHistoryObj, result);
          },
          function (result) {
            NotificationModel.Create(NotificationObj, result);
          },
          function (result) {
            Quotes.RRVendorQuoteRejected(reqBody, result);
          }
        ],
        function (err, results) {
          if (err) {
            result(err, null);
            return;
          }
          result(null, {
            data: results[0][0],
            ...reqBody
          });
          return;

        }
      );
    });
  } else {
    result({
      msg: "RR not found"
    }, null);
    return;
  }
};
RR.CustomerRRListByServerSide = (RR, result) => {

  var query = "";
  selectquery = "";

  selectquery = ` SELECT c.CustomerId,
  IF(i.GrandTotal>=0,CONCAT(CURI.CurrencySymbol,' ',i.GrandTotal),
  If(q.GrandTotal >=0,CONCAT(CURQ.CurrencySymbol,' ',q.GrandTotal),'TBD')) as  InvoiceAmountOrQuoteAmount,
  rr.RRNo,rr.PartNo,rr.SerialNo,c.CompanyName,
  VendorName,rr.RRId,RRDescription,rr.SerialNo,
  DATE_FORMAT(rr.Created, '%m/%d/%Y') as Date,
  IF(q.SubmittedDate, DATE_FORMAT(q.SubmittedDate, '%m/%d/%Y'), "-")  as QuoteSubmittedDate,
  CASE rr.Status
  WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}'
  WHEN 2 THEN '${Constants.array_rr_status[2]}'
  WHEN 3 THEN '${Constants.array_rr_status[3]}'
  WHEN 4 THEN '${Constants.array_rr_status[4]}'
  WHEN 5 THEN '${Constants.array_rr_status[5]}'
  WHEN 6 THEN '${Constants.array_rr_status[6]}'
  WHEN 7 THEN '${Constants.array_rr_status[7]}'
  WHEN 7 THEN '${Constants.array_rr_status[8]}'
  ELSE '-'	end StatusName,rr.Status,
  (select REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath  from tbl_repair_request_images where  IsDeleted = 0 AND RRId=rr.RRId ORDER BY IsPrimaryImage DESC,RRImageId ASC limit 0,1) as RRImage,
  CustomerPartNo1,CustomerSONo,rr.CustomerPONo,
  Case IsWarrantyRecovery
  WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
  WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
  ELSE '-'	end IsWarrantyRecovery,
  Case IsRushRepair
  WHEN 0 THEN '${Constants.array_true_false[0]}'
  WHEN 1 THEN '${Constants.array_true_false[1]}'
  ELSE '-'	end IsRushRepair,
  Case IsRepairTag
  WHEN 0 THEN '${Constants.array_true_false[0]}'
  WHEN 1 THEN '${Constants.array_true_false[1]}'
  ELSE '-'	end IsRepairTag,
  (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) as CustomerReference1,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) as CustomerReference2,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) as CustomerReference3,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0
AND RRId=rr.RRId order by 'Rank' limit 3,1) as CustomerReference4,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) as CustomerReference5,
(select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) as CustomerReference6 `;

  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;

  query = query + ` FROM tbl_repair_request rr
  LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 AND i.IsDeleted = 0
  LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) AND q.IsDeleted = 0
  LEFT JOIN tbl_vendors v on rr.VendorId=v.VendorId
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
  LEFT JOIN tbl_currencies as CURI  ON CURI.CurrencyCode = i.LocalCurrencyCode AND CURI.IsDeleted = 0
  LEFT JOIN tbl_currencies as CURQ  ON CURQ.CurrencyCode = q.LocalCurrencyCode AND CURQ.IsDeleted = 0
  WHERE rr.IsDeleted=0   `;

  if (RR.Status && RR.Status != 0) {
    var splitArray = RR.Status.split(',');
    var addQuoteCustomerStatus = false;
    splitArray.forEach(s => {
      if ([0, 1, 2, 3].includes(s)) {
        addQuoteCustomerStatus = true;
      }
    })
  }

  // if(addQuoteCustomerStatus || RR.Status == 0){
  if (addQuoteCustomerStatus) {
    query = query + `AND q.QuoteCustomerStatus!=0 AND q.QuoteCustomerStatus IS NOT NULL `;
  }

  var CustomerId;
  if (RR.CustomerId != 0 && RR.RRIds == '') {
    CustomerId = RR.CustomerId;
    query = query + `and rr.CustomerId='${CustomerId}'`;
  }
  if (RR.RRIds == -1) {
    var DateRange = '';
    if (RR.FromDate != '' && RR.ToDate != '') {
      DateRange += ` AND DATE(Created) BETWEEN '${RR.FromDate}' AND '${RR.ToDate}' `
    }
    query += `and rr.RRId IN (
      Select RRId from tbl_repair_request
    where IsDeleted=0  ${RR.Status == 0 ? '' : ` and Status IN (` + RR.Status + `)`}
    AND CustomerId In(${RR.LoginMultipleAccessIdentityIds}) ${RR.CustomerId == 0 ? '' : ` And CustomerId in( ` + RR.CustomerId + `)`}  ${DateRange} ) `;
  }
  if (RR.search.value != '') {
    query = query + ` and (  rr.RRId LIKE '%${RR.search.value}%'
      or rr.RRNo LIKE '%${RR.search.value}%'
      or rr.PartNo LIKE '%${RR.search.value}%'
      or RRDescription LIKE '%${RR.search.value}%'
      or rr.SerialNo LIKE '%${RR.search.value}%'
      or VendorName LIKE '%${RR.search.value}%'
      or rrp.Created LIKE '%${RR.search.value}%'
      or rr.Status LIKE '%${RR.search.value}'
      or c.CompanyName LIKE '%${RR.search.value}%'
      or VendorName LIKE '%${RR.search.value}%'
      or CustomerSONo LIKE '%${RR.search.value}%'
      or rr.CustomerPONo LIKE '%${RR.search.value}%'
      or CustomerPartNo1 LIKE '%${RR.search.value}%'
      or (i.GrandTotal LIKE '%${RR.search.value}%' OR q.GrandTotal LIKE '%${RR.search.value}%' 
      or (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
      where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 0,1) LIKE '%${RR.search.value}%'
      or (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
      where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 1,1) LIKE '%${RR.search.value}%'
      or (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
      where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 2,1) LIKE '%${RR.search.value}%'
      or (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId) where rrcr.IsDeleted = 0
      AND RRId=rr.RRId order by 'Rank' limit 3,1) LIKE '%${RR.search.value}%'
      or (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
      where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 4,1) LIKE '%${RR.search.value}%'
      or (select CONCAT(ReferenceLabelName,": ",ReferenceValue) from tbl_repair_request_customer_ref rrcr Left Join tbl_cutomer_reference_labels cl Using(CReferenceId)
      where rrcr.IsDeleted = 0 AND RRId=rr.RRId order by 'Rank' limit 5,1) LIKE '%${RR.search.value}%'
      or rr.RRId IN (Select RRId From tbl_repair_request_customer_ref as REF WHERE REF.RRId = rr.RRId AND REF.ReferenceValue LIKE '%${RR.search.value}%' AND REF.IsDeleted = 0    )
      )
      ) `;
  }

  var cvalue = 0;
  // console.log("RR=" + RR.columns[0].search.value);
  for (cvalue = 0; cvalue < RR.columns.length; cvalue++) {
    if (RR.columns[cvalue].search.value != "") {
      if (RR.columns[cvalue].search.value == "true") {
        RR.columns[cvalue].search.value = "1";
      }
      if (RR.columns[cvalue].search.value == "false") {
        RR.columns[cvalue].search.value = "0";
      }
      switch (RR.columns[cvalue].name) {

        case "CustomerId":
          query += " and  c.CustomerId In(" + RR.columns[cvalue].search.value + ")  ";
          break;
        case "CompanyName":
          query += " and ( c.CompanyName LIKE '%" + RR.columns[cvalue].search.value + "%' ) ";
          break;
        case "Status":
          query += " and ( rr.Status ='" + RR.columns[cvalue].search.value + "' ) ";
          break;
        case "PartNo":
          query += " and ( rr.PartNo LIKE '%" + RR.columns[cvalue].search.value + "%' ) ";
          break;
        case "SerialNo":
          query += " and ( rr.SerialNo LIKE '%" + RR.columns[cvalue].search.value + "%' ) ";
          break;
        case "RRNo":
          query += " and ( rr.RRNo ='" + RR.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerPONo":
          query += " and ( rr.CustomerPONo ='" + RR.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + RR.columns[cvalue].name + " LIKE '%" + RR.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var i = 0;
  if (RR.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < RR.order.length; i++) {
    if (RR.order[i].column != "" || RR.order[i].column == "0") // 0 is equal to ""
    {
      switch (RR.columns[RR.order[i].column].name) {
        case "RRNo":
          query += " rr.RRNo " + RR.order[i].dir + ",";
          break;
        case "CustomerPONo":
          query += " rr.CustomerPONo " + RR.order[i].dir + ",";
          break;
        case "CompanyName":
          query += " c.CompanyName " + RR.order[i].dir + ",";
          break;
        case "PartNo":
          query += " rr.PartNo " + RR.order[i].dir + ",";
          break;

        case "SerialNo":
          query += " rr.SerialNo " + RR.order[i].dir + ",";
          break;

        case "Status":
          query += " rr.Status " + RR.order[i].dir + ",";
          break;

        default: //could be any column except above
          query += " " + RR.columns[RR.order[i].column].name + " " + RR.order[i].dir + ",";

      }
    }
  }
  //console.log("before query slice =" + query);

  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (RR.start != "-1" && RR.length != "-1") {
    query += " LIMIT " + RR.start + "," + (RR.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount
  FROM tbl_repair_request rr
  LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 and i.IsDeleted=0
  LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.RRId>0 and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0
  LEFT JOIN tbl_vendors v on rr.VendorId=v.VendorId
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
  WHERE rr.IsDeleted=0   ${CustomerId > 0 ? ` And rr.CustomerId= ` + CustomerId : ''} `;
  if (RR.RRIds == -1) {
    var DateRange = '';
    if (RR.FromDate != '' && RR.ToDate != '') {
      DateRange += ` AND DATE(Created) BETWEEN '${RR.FromDate}' AND '${RR.ToDate}' `
    }
    TotalCountQuery += `and rr.RRId IN (
      Select RRId from tbl_repair_request
  where IsDeleted=0  ${RR.Status == 0 ? '' : ` and Status IN (` + RR.Status + `)`}
   AND CustomerId In(${RR.LoginMultipleAccessIdentityIds})
  ${RR.CustomerId == 0 ? '' : ` And CustomerId in( ` + RR.CustomerId + `)`} ${DateRange} ) `;
  }
  //console.log("query = " + query);
  //console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
      function (result) {
        con.query(query, result)
      },
      function (result) {
        con.query(Countquery, result)
      },
      function (result) {
        con.query(TotalCountQuery, result)
      }
    ],
    function (err, results) {
      if (err)
        return result(err, null);

      // console.log("TotalCount : " + results[2][0][0].TotalCount)
      if (results[0][0].length > 0) {
        result(null, {
          data: results[0][0],
          recordsFiltered: results[1][0][0].recordsFiltered,
          recordsTotal: results[2][0][0].TotalCount,
          draw: RR.draw
        });
        return;
      } else {
        result(null, "No record");
        return;
      }
    });
};

//To get RushandWarrantyList Of RR
RR.getRushandWarrantyListOfRR = (RR, result) => {

  var TokenIdentityType = getLogInIdentityType(RR);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(RR);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(RR);

  var query = "";
  selectquery = "";

  selectquery = `SELECT rr.RRId,rr.RRNo,c.CompanyName,
 (select REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath from tbl_repair_request_images where  IsDeleted = 0 AND RRId=rr.RRId ORDER BY IsPrimaryImage DESC,RRImageId ASC limit 0,1) as RRImage,
  rr.PartNo,
  DATE_FORMAT(rr.Created,'%m/%d/%Y') as Created,rr.Status,rr.IsRushRepair,rr.IsWarrantyRecovery `;

  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;
  query = query + ` FROM tbl_repair_request rr
  LEFT JOIN tbl_vendors v on rr.VendorId=v.VendorId
  LEFT JOIN tbl_customers c on rr.CustomerId=c.CustomerId
  where rr.IsDeleted=0 `;
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    query += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
  }
  var VendorId = 0;
  if (RR.VendorId != 0) {
    VendorId = RR.VendorId;
    query = query + ` and rr.VendorId='${VendorId}' `;
  }
  var CustomerId = 0;

  if (RR.CustomerId != 0) {
    CustomerId = RR.CustomerId;
    query = query + ` and c.CustomerId In (${CustomerId}) `;
  }
  if (RR.search.value != '') {
    query = query + ` and (  RRNo = '${RR.search.value}'
    or c.CompanyName LIKE '%${RR.search.value}%'
    or v.VendorName = '${RR.search.value}'
    or rr.PartNo = '${RR.search.value}'
    or rr.Created= '${RR.search.value}'
    or rr.Status LIKE '%${RR.search.value}%' ) `;
  }
  if (VendorId == 0 && CustomerId == 0) {
    query += ` and rr.Status !=7 `;
  }

  query += " and (rr.IsRushRepair=1 or rr.IsWarrantyRecovery=1) ORDER BY rr.Created DESC ";
  var Countquery = recordfilterquery + query;
  if (RR.start >= 0 && RR.length > 0) {
    query += " LIMIT " + RR.start + "," + RR.length;
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount
  FROM tbl_repair_request rr
  LEFT JOIN tbl_vendors v on rr.VendorId=v.VendorId
  LEFT JOIN tbl_customers c on rr.CustomerId=c.CustomerId
  where rr.IsDeleted=0 and (rr.IsRushRepair=1 or rr.IsWarrantyRecovery=1) `;
  if (VendorId > 0) {
    TotalCountQuery = TotalCountQuery + ` and rr.VendorId='${VendorId}' `;
  }
  if (CustomerId != 0) {
    TotalCountQuery = TotalCountQuery + ` and c.CustomerId In (${CustomerId}) `;
  }
  if (VendorId == 0 && CustomerId == 0) {
    TotalCountQuery += ` and rr.Status !=7 `;
  }
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    TotalCountQuery += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
  }
  //console.log("query = " + query);
  //console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);

  async.parallel([
      function (result) {
        con.query(query, result)
      },
      function (result) {
        con.query(Countquery, result)
      },
      function (result) {
        con.query(TotalCountQuery, result)
      }
    ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, {
        data: results[0][0],
        recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount
      });
      return;
    }
  );
};


RR.VendorRRListByServerSide = (RR, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT RRNo,rr.PartNo,rr.SerialNo,c.CompanyName,
  VendorName,rr.RRId,
  RRDescription,rr.SerialNo,DATE_FORMAT(rrp.Created, '%m/%d/%Y') as Date,
  CASE rr.Status
  WHEN 0 THEN '${Constants.array_rr_status_vendor[0]}'
  WHEN 1 THEN '${Constants.array_rr_status_vendor[1]}'
  WHEN 2 THEN '${Constants.array_rr_status_vendor[2]}'
  WHEN 3 THEN '${Constants.array_rr_status_vendor[3]}'
  WHEN 4 THEN '${Constants.array_rr_status_vendor[4]}'
  WHEN 5 THEN '${Constants.array_rr_status_vendor[5]}'
  WHEN 6 THEN '${Constants.array_rr_status_vendor[6]}'
  WHEN 7 THEN '${Constants.array_rr_status_vendor[7]}'
  WHEN 8 THEN '${Constants.array_rr_status_vendor[8]}'
  ELSE '-'	end StatusName,rr.Status,
  (select REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath from tbl_repair_request_images where  IsDeleted = 0 AND RRId=rr.RRId ORDER BY IsPrimaryImage DESC,RRImageId ASC limit 0,1) as RRImage,
  CustomerPartNo1,VendorPONo,
  Case IsWarrantyRecovery
  WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
  WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
  ELSE '-'	end IsWarrantyRecovery,
  Case IsRushRepair
  WHEN 0 THEN '${Constants.array_true_false[0]}'
  WHEN 1 THEN '${Constants.array_true_false[1]}'
  ELSE '-'	end IsRushRepair,
  Case IsRepairTag
  WHEN 0 THEN '${Constants.array_true_false[0]}'
  WHEN 1 THEN '${Constants.array_true_false[1]}'
  ELSE '-'	end IsRepairTag`;

  recordfilterquery = `Select count(rr.RRId) as recordsFiltered `;

  query = query + ` FROM tbl_repair_request rr
  LEFT JOIN tbl_vendors v on rr.VendorId=v.VendorId
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
  WHERE rr.IsDeleted=0 `;

  if (RR.IsWarrantyRecovery) {
    query = query + ` and rr.IsWarrantyRecovery='${RR.IsWarrantyRecovery}' `;
  }
  if (RR.IsRushRepair) {
    query = query + ` and rr.IsRushRepair='${RR.IsRushRepair}' `;
  }

  var VendorId;
  if (RR.VendorId != 0) {
    VendorId = RR.VendorId;
  } else {
    VendorId = getLogInIdentityId(RR);
  }
  query = query + `and rr.VendorId='${VendorId}' `;

  if (RR.RRIds == -1) {
    var DateRange = '';
    if (RR.FromDate != '' && RR.ToDate != '') {
      DateRange += `  DATE(Created) BETWEEN '${RR.FromDate}' AND '${RR.ToDate}' `
    } else {
      DateRange += `  DATE(Created) BETWEEN '1900-01-01' AND CURDATE() `
    }
    query += `and rr.RRId IN (
      Select RRId from tbl_repair_request
  where IsDeleted=0 and Status='${RR.Status}' AND VendorId='${RR.VendorId}' AND ${DateRange}
   ) `;
  }
  if (RR.search.value != '') {
    query = query + ` and (  rr.RRId LIKE '%${RR.search.value}%'
      or RRNo LIKE '%${RR.search.value}%'
      or rr.PartNo LIKE '%${RR.search.value}%'
      or RRDescription LIKE '%${RR.search.value}%'
      or rr.SerialNo LIKE '%${RR.search.value}%'
      or VendorName LIKE '%${RR.search.value}%'
      or rrp.Created LIKE '%${RR.search.value}%'
      or rr.Status LIKE '%${RR.search.value}'
      or CompanyName LIKE '%${RR.search.value}%'
      or VendorName LIKE '%${RR.search.value}%'
      or VendorPONo LIKE '%${RR.search.value}%'
      or CustomerPartNo1 LIKE '%${RR.search.value}%'
      ) `;
  }

  var cvalue = 0;
  // console.log("RR=" + RR.columns[0].search.value);
  for (cvalue = 0; cvalue < RR.columns.length; cvalue++) {
    if (RR.columns[cvalue].search.value != "") {
      if (RR.columns[cvalue].search.value == "true") {
        RR.columns[cvalue].search.value = "1";
      }
      if (RR.columns[cvalue].search.value == "false") {
        RR.columns[cvalue].search.value = "0";
      }
      switch (RR.columns[cvalue].name) {
        case "Status":
          query += " and ( rr.Status ='" + RR.columns[cvalue].search.value + "' ) ";
          break;
        case "PartNo":
          query += " and ( rr.PartNo LIKE '%" + RR.columns[cvalue].search.value + "%' ) ";
          break;
        case "SerialNo":
          query += " and ( rr.SerialNo LIKE '%" + RR.columns[cvalue].search.value + "%' ) ";
          break;
        default:
          query += " and ( " + RR.columns[cvalue].name + " LIKE '%" + RR.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var i = 0;
  if (RR.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < RR.order.length; i++) {
    if (RR.order[i].column != "" || RR.order[i].column == "0") // 0 is equal to ""
    {
      switch (RR.columns[RR.order[i].column].name) {
        case "PartNo":
          query += " rr.PartNo " + RR.order[i].dir + ",";
          break;

        case "SerialNo":
          query += " rr.SerialNo " + RR.order[i].dir + ",";
          break;

        case "Status":
          query += " rr.Status " + RR.order[i].dir + ",";
          break;

        default: //could be any column except above
          query += " " + RR.columns[RR.order[i].column].name + " " + RR.order[i].dir + ",";

      }
    }
  }
  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;
  if (RR.start != "-1" && RR.length != "-1") {
    query += " LIMIT " + RR.start + "," + (RR.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(rr.RRId) as TotalCount
  FROM tbl_repair_request rr
  LEFT JOIN tbl_vendors v on rr.VendorId=v.VendorId
  LEFT JOIN tbl_customers c on c.CustomerId=rr.CustomerId
  LEFT JOIN tbl_repair_request_parts rrp on rr.RRId=rrp.RRId
  WHERE rr.IsDeleted=0 and rr.VendorId='${VendorId}' `;
  if (RR.IsWarrantyRecovery) {
    TotalCountQuery = TotalCountQuery + ` and rr.IsWarrantyRecovery='${RR.IsWarrantyRecovery}' `;
  }
  if (RR.IsRushRepair) {
    TotalCountQuery = TotalCountQuery + ` and rr.IsRushRepair='${RR.IsRushRepair}' `;
  }
  if (RR.RRIds == -1) {
    var DateRange = '';
    if (RR.FromDate != '' && RR.ToDate != '') {
      DateRange += `  DATE(Created) BETWEEN '${RR.FromDate}' AND '${RR.ToDate}' `
    } else {
      DateRange += `  DATE(Created) BETWEEN '1900-01-01' AND CURDATE() `
    }
    TotalCountQuery += `and rr.RRId IN (
      Select RRId from tbl_repair_request
  where IsDeleted=0 and Status='${RR.Status}' AND VendorId='${RR.VendorId}' AND ${DateRange}
   ) `;
  }
  // console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  //console.log("TotalCountQuery = " + TotalCountQuery);
  async.parallel([
      function (result) {
        con.query(query, result)
      },
      function (result) {
        con.query(Countquery, result)
      },
      function (result) {
        con.query(TotalCountQuery, result)
      }
    ],
    function (err, results) {
      if (err)
        return result(err, null);

      if (results[0][0].length > 0) {
        result(null, {
          data: results[0][0],
          recordsFiltered: results[1][0][0].recordsFiltered,
          recordsTotal: results[2][0][0].TotalCount,
          draw: RR.draw
        });
        return;
      } else {
        result(null, "No record");
        return;
      }
    });
};


RR.UpdateCustomerSONoandCustomerSODueDatebyRRId = (RepairRequest, result) => {
  var RRObj = new RR({
    RepairRequest
  });
  var sql = `UPDATE tbl_repair_request  SET CustomerSONo='${RRObj.CustomerSONo}',CustomerSODueDate='${RRObj.CustomerSODueDate}'  WHERE RRID ='${RRObj.RRId}'`;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, {
      CustomerSONo: RRObj.CustomerSONo
    });
    return;
  });
};


RR.UpdateCustomerPONoandCustomerPODueDatebyRRId = (RepairRequest, result) => {
  var RRObj = new RR({
    RepairRequest
  });
  var sql = `UPDATE tbl_repair_request  SET CustomerPONo='${RRObj.CustomerPONo}',VendorPODueDate='${RRObj.VendorPODueDate}'  WHERE RRID ='${RRObj.RRId}'`;

  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, {
      CustomerPONo: RRObj.CustomerPONo
    });
    return;
  });
};


RR.UpdateCustomerInvoiceNoandCustomerInvoiceDueDatebyRRId = (RepairRequest, result) => {
  var RRObj = new RR({
    RepairRequest
  });
  var sql = `UPDATE tbl_repair_request  SET CustomerInvoiceNo='${RRObj.CustomerInvoiceNo}',CustomerInvoiceDueDate='${RRObj.CustomerInvoiceDueDate}'  WHERE RRID ='${RRObj.RRId}'`;

  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, {
      VendorInvoiceNo: RRObj.CustomerInvoiceNo
    });
    return;
  });
};

RR.UpdateCustomerSODueDate = (obj, result) => {
  var sql = `Update tbl_repair_request  SET CustomerSODueDate = '${obj.DueDate}'
  WHERE IsDeleted=0 and RRId='${obj.RRId}' and CustomerSOId='${obj.SOId}'`;
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    result(null, res);
  });
};

RR.UpdateVendorPODueDate = (obj, result) => {
  var sql = `Update tbl_repair_request  SET VendorPODueDate = '${obj.DueDate}'
  WHERE IsDeleted=0 and RRId='${obj.RRId}' and VendorPOId='${obj.POId}'`;
  // console.log("UpdateVendorPODueDate=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    result(null, res);
  });
};

RR.UpdateCustomerInvoiceDueDate = (obj, result) => {
  var sql = `Update tbl_repair_request  SET CustomerInvoiceDueDate = '${obj.DueDate}'
  WHERE IsDeleted=0 and RRId='${obj.RRId}' and CustomerInvoiceId='${obj.InvoiceId}'`;
  // console.log("UpdateCustomerInvoiceDueDate=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    result(null, res);
  });
};

RR.UpdateVendorInvoiceDueDate = (obj, result) => {
  var sql = `Update tbl_repair_request  SET VendorInvoiceDueDate = '${obj.DueDate}'
  WHERE IsDeleted=0 and RRId='${obj.RRId}' and VendorInvoiceId='${obj.VendorInvoiceId}'`;
  //console.log("UpdateVendorInvoiceDueDate=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    result(null, res);
  });
};
// To Get Packing Slip
RR.PackingSlip = (RRId, ShippingHistoryId, reqBody, result) => {

  // con.query(sqlRRInfo, (err, res) => {
  //   if (err) {
  //     result(err, null);
  //     return;
  //   }
  //   if (!res[0]) {
  //     return result({ msg: "RR not found" }, null);
  //   }
  var sqlRRInfo = RR.viewquery(RRId, reqBody);
  var sqlRRParts = RRParts.ViewRRParts(RRId);
  const RRShippingHistoryModel = require("../models/repair.request.shipping.history.model.js");
  var RRShippingHistoryQuery = RRShippingHistoryModel.listquerybyRRIdAndShippingHistoryId(RRId, ShippingHistoryId);
  var ViewRRCustomerNotes = RRNotes.ViewRRNotesByNoteType(Constants.CONST_NOTES_TYPE_CUSTOMER, RRId);
  var ViewRRVendorNotes = RRNotes.ViewRRNotesByNoteType(Constants.CONST_NOTES_TYPE_VENDOR, RRId);
  var ViewCustomerReference = CReferenceLabel.ViewCustomerReference(RRId);
  // console.log("sqlRRInfo" + sqlRRInfo)
  // console.log("sqlRRParts" + sqlRRParts)
  async.parallel([
      function (result) {
        con.query(sqlRRInfo, result)
      },
      function (result) {
        con.query(sqlRRParts, result)
      },
      function (result) {
        con.query(RRShippingHistoryQuery, result)
      },
      function (result) {
        con.query(ViewRRCustomerNotes, result)
      },
      function (result) {
        con.query(ViewRRVendorNotes, result)
      },
      function (result) {
        con.query(ViewCustomerReference, result)
      },
    ],
    function (err, results) {
      if (err) {
        return result(err, null);
      }

      if (results[0][0].length > 0 && results[1][0].length > 0 && results[2][0].length > 0) {
        return result(null, {
          RRInfo: results[0][0],
          RRPartsInfo: results[1][0],
          RRShippingHistory: results[2][0],
          CustomerNote: results[3][0],
          RRVendorNote: results[4][0],
          CustomerReference: results[5][0]
        });
      } else {
        return result({
          msg: "Record Not Found"
        }, null);
      }
    });
  // });
};

RR.BulkShipPackingSlip = (reqbody, result) => {
  var BulkShipId = reqbody.BulkShipId;
  var sqlRRInfo = RR.BulkShipView(BulkShipId, reqbody);
  var sqlRRParts = RRParts.BulkShipRRParts(BulkShipId);
  const RRShippingHistoryModel = require("../models/repair.request.shipping.history.model.js");
  var RRShippingHistoryQuery = RRShippingHistoryModel.BulkShipView(BulkShipId);
  var View = SettingsGeneralModel.View();
  // console.log("sqlRRInfo" + sqlRRInfo)
  // console.log("sqlRRParts" + sqlRRParts)
  async.parallel([
      function (result) {
        con.query(sqlRRInfo, result)
      },
      function (result) {
        con.query(sqlRRParts, result)
      },
      function (result) {
        con.query(RRShippingHistoryQuery, result)
      },
      function (result) {
        con.query(View, result)
      },
    ],
    function (err, results) {
      if (err) {
        return result(err, null);
      }

      if (results[0][0].length > 0 && results[1][0].length > 0 && results[2][0].length > 0) {
        return result(null, {
          RRInfo: results[0][0],
          RRPartsInfo: results[1][0],
          RRShippingHistory: results[2][0],
          SettingsInfo: results[3][0],
        });
      } else {
        return result({
          msg: "Record Not Found"
        }, null);
      }
    });
};
RR.loggedInStatusBarChart = (RR, result) => {

  var TokenIdentityType = getLogInIdentityType(RR);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(RR);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(RR);

  var FromDate, ToDate = '';
  if (RR.FromDate != '' && RR.ToDate != '') {
    const Fromdatearray = RR.FromDate.split('T');
    const Todatearray = RR.ToDate.split('T');
    FromDate = Fromdatearray[0];
    ToDate = Todatearray[0];
  }
  var sql;
  sql = ` SELECT DATE_FORMAT(Date,'%m/%d/%Y') as Date,
  Sourced,Quoted,Approved,Completed from(SELECT Cast(rr.Created as Date) as Date ,
  SUM(CASE WHEN Status = '2' THEN 1 ELSE 0 END) Sourced,
  SUM(CASE WHEN Status = '4' THEN 1 ELSE 0 END) Quoted,
  SUM(CASE WHEN Status = '5' THEN 1 ELSE 0 END) Approved,
  SUM(CASE WHEN Status = '7' THEN 1 ELSE 0 END) Completed
  FROM tbl_repair_request rr
  where rr.IsDeleted=0 `
  if (RR.VendorId > 0) {
    sql = ` SELECT DATE_FORMAT(Date,'%m/%d/%Y') as Date,
  AwaitingQuote,Quoted,Approved,Rejected,Completed from(SELECT Cast(rr.Created as Date) as Date ,
  SUM(CASE WHEN Status = '2' THEN 1 ELSE 0 END) AwaitingQuote,
  SUM(CASE WHEN Status = '4' THEN 1 ELSE 0 END) Quoted,
  SUM(CASE WHEN Status = '5' THEN 1 ELSE 0 END) Approved,
  SUM(CASE WHEN Status = '6' THEN 1 ELSE 0 END) Rejected,
  SUM(CASE WHEN Status = '7' THEN 1 ELSE 0 END) Completed
  FROM tbl_repair_request rr
  where rr.IsDeleted=0 `
  }
  if (RR.CustomerId != 0) {
    sql = ` SELECT DATE_FORMAT(Date,'%m/%d/%Y') as Date,
  RRReceived,RRWaitingForCustomerApproval,RepairInProgress,Completed from(SELECT Cast(rr.Created as Date) as Date ,
  SUM(CASE WHEN Status = '2' THEN 1 ELSE 0 END) RRReceived,
  SUM(CASE WHEN Status = '4' THEN 1 ELSE 0 END) RRWaitingForCustomerApproval,
  SUM(CASE WHEN Status = '5' THEN 1 ELSE 0 END) RepairInProgress,
  SUM(CASE WHEN Status = '7' THEN 1 ELSE 0 END) Completed
  FROM tbl_repair_request rr
  where rr.IsDeleted=0 `
  }
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
  }
  if (RR.VendorId > 0) {
    sql = sql + ` AND rr.VendorId= '${RR.VendorId}' `;
  }
  if (RR.CustomerId != 0) {
    sql = sql + ` AND rr.CustomerId In(${RR.CustomerId}) `;
  }
  if (FromDate != '' && ToDate != '') {
    sql = sql + ` AND (DATE(rr.Created) BETWEEN '${FromDate}' AND '${ToDate}')
  Group By Cast(rr.Created as Date)) as x  `;
  } else {
    sql = sql + ` AND (DATE(rr.Created) BETWEEN '1900-01-01' AND CURDATE())
  Group By Cast(rr.Created as Date)) as x  `;
  }

  // console.log("VL=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
// Old
// To logged In Status Bar Chart
// RR.loggedInStatusBarChart = (RR, result) => {
//   const Fromdatearray = RR.FromDate.split('T');
//   const Todatearray = RR.ToDate.split('T');
//   var FromDate = Fromdatearray[0];
//   var ToDate = Todatearray[0];
//   var sql;
//   sql = ` SELECT DATE_FORMAT(Date,'%m/%d/%Y') as Date,
//   Sourced,Quoted,Approved,Completed from(SELECT Cast(rrsh.Created as Date) as Date ,
//   SUM(CASE WHEN HistoryStatus = '2' THEN 1 ELSE 0 END) Sourced,
//   SUM(CASE WHEN HistoryStatus = '4' THEN 1 ELSE 0 END) Quoted,
//   SUM(CASE WHEN HistoryStatus = '5' THEN 1 ELSE 0 END) Approved,
//   SUM(CASE WHEN HistoryStatus = '7' THEN 1 ELSE 0 END) Completed
//   FROM tbl_repair_request_status_history rrsh
//   LEFT JOIN tbl_repair_request rr on rr.RRId=rrsh.RRId where rrsh.IsDeleted=0 `
//   if (RR.VendorId > 0) {
//     sql = ` SELECT DATE_FORMAT(Date,'%m/%d/%Y') as Date,
//   AwaitingQuote,Quoted,Approved,Rejected,Completed from(SELECT Cast(rrsh.Created as Date) as Date ,
//   SUM(CASE WHEN HistoryStatus = '2' THEN 1 ELSE 0 END) AwaitingQuote,
//   SUM(CASE WHEN HistoryStatus = '4' THEN 1 ELSE 0 END) Quoted,
//   SUM(CASE WHEN HistoryStatus = '5' THEN 1 ELSE 0 END) Approved,
//   SUM(CASE WHEN HistoryStatus = '6' THEN 1 ELSE 0 END) Rejected,
//   SUM(CASE WHEN HistoryStatus = '7' THEN 1 ELSE 0 END) Completed
//   FROM tbl_repair_request_status_history rrsh
//   LEFT JOIN tbl_repair_request rr on rr.RRId=rrsh.RRId where rrsh.IsDeleted=0 `
//   }
//   if (RR.CustomerId > 0) {
//     sql = ` SELECT DATE_FORMAT(Date,'%m/%d/%Y') as Date,
//   RRReceived,RRWaitingForCustomerApproval,RepairInProgress,Completed from(SELECT Cast(rrsh.Created as Date) as Date ,
//   SUM(CASE WHEN HistoryStatus = '2' THEN 1 ELSE 0 END) RRReceived,
//   SUM(CASE WHEN HistoryStatus = '4' THEN 1 ELSE 0 END) RRWaitingForCustomerApproval,
//   SUM(CASE WHEN HistoryStatus = '5' THEN 1 ELSE 0 END) RepairInProgress,
//   SUM(CASE WHEN HistoryStatus = '7' THEN 1 ELSE 0 END) Completed
//   FROM tbl_repair_request_status_history rrsh
//   LEFT JOIN tbl_repair_request rr on rr.RRId=rrsh.RRId where rrsh.IsDeleted=0 `
//   }
//   if (RR.VendorId > 0) {
//     sql = sql + ` AND rr.VendorId= '${RR.VendorId}' `;
//   }
//   if (RR.CustomerId > 0) {
//     sql = sql + ` AND rr.CustomerId= '${RR.CustomerId}' `;
//   }
//   sql = sql + ` AND (DATE(rrsh.Created) BETWEEN '${FromDate}' AND '${ToDate}')
//   Group By Cast(rrsh.Created as Date)) as x  `;
//   console.log("VL=" + sql)
//   con.query(sql, (err, res) => {
//     if (err) {
//       return result(err, null);
//     }
//     return result(null, res);
//   });
// };
//

RR.AHNewDashboardStatistics = (RR, result) => {
  var TokenIdentityType = getLogInIdentityType(RR);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(RR);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(RR);

  var sql = ` SELECT SUM(CASE WHEN rr.Status = '1' THEN 1 ELSE 0 END) AwaitingVendorSelection,
  SUM(CASE WHEN rr.Status = '2' THEN 1 ELSE 0 END) AwaitingVendorQuote,
  SUM(CASE WHEN rr.Status = '4' THEN 1 ELSE 0 END) QuotedToCustomer,
  SUM(CASE WHEN rr.Status = '5' THEN 1 ELSE 0 END) RepairInProgress,
  SUM(CASE WHEN rr.Status = '8' THEN 1 ELSE 0 END) ApprovedButNotRepairable,
  FORMAT(SUM(CASE WHEN rr.Status = '4' THEN if(q.BaseGrandTotal>=0,ROUND(q.BaseGrandTotal,2),0) ELSE 0 END),2) as QuoteToCustomerAmount,
  FORMAT(SUM(CASE WHEN rr.Status = '5' THEN if(s.BaseGrandTotal>=0,ROUND(s.BaseGrandTotal,2),if(q.GrandTotal>=0,ROUND(q.BaseGrandTotal,2),0)) ELSE 0 END),2) as RepairInProgressAmount
FROM tbl_repair_request rr
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.Status In(1,2,4) and q.QuoteCustomerStatus In(1,2,3) and q.IsDeleted = 0 and (rr.Status=4 OR rr.Status=5)
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId AND i.IsDeleted = 0 and rr.Status=5
LEFT JOIN tbl_sales_order s on s.RRId=rr.RRId AND s.IsDeleted = 0 and rr.Status=5
where rr.IsDeleted=0 `
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and rr.CustomerId in(${MultipleCustomerIds}) `;
  }
  // console.log("RRRRRRRRRRRRR")
  // console.log(RR)
  if (RR.Location != '') {
    sql += ` And rr.CreatedByLocation in(${RR.Location})`;
  }
  sql += ` ${RR.CustomerId == 0 ? '' : ` And rr.CustomerId in( ${RR.CustomerId}) `} `;
  //console.log("AHNewDashboardStatistics=New" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};


RR.AHNewDashboardStatusHistoryCount = (Status, Count1, Count2, Count3, Count4, Obj, result) => {
  var AdminAccessOnCustomer = ``;

  var TokenIdentityType = getLogInIdentityType(Obj);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(Obj);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(Obj);

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    AdminAccessOnCustomer += ` and CustomerId in(${MultipleCustomerIds}) `;
  }

  AdminAccessOnCustomer += ` ${Obj.CustomerId == 0 ? '' : ` And CustomerId in( ${Obj.CustomerId}) `} `;

  if (Obj.Location != '') {
    AdminAccessOnCustomer += ` And RR.CreatedByLocation in(${Obj.Location}) `;
  }


  var sql = `SELECT
(Select SUM(CASE WHEN HistoryStatus = ${Status} THEN 1 ELSE 0 END)
  FROM tbl_repair_request_status_history rrsh
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = rrsh.RRId AND RR.Status =  ${Status}  AND RR.IsDeleted = 0 ${AdminAccessOnCustomer} 
where RR.RRId = rrsh.RRId AND rrsh.IsDeleted=0 and HistoryId = (SELECT MAX(HistoryId) FROM tbl_repair_request_status_history rrsh1 where rrsh1.HistoryStatus = ${Status} AND RR.RRId = rrsh1.RRId  LIMIT 1) and  DATEDIFF(CURDATE(),rrsh.Created)<${Count1}) CurrentDay,
(Select SUM(CASE WHEN HistoryStatus = ${Status} THEN 1 ELSE 0 END)
  FROM tbl_repair_request_status_history rrsh
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = rrsh.RRId AND RR.Status =  ${Status}  AND RR.IsDeleted = 0 ${AdminAccessOnCustomer}
where RR.RRId = rrsh.RRId AND rrsh.IsDeleted=0 and HistoryId = (SELECT MAX(HistoryId) FROM tbl_repair_request_status_history rrsh1 where rrsh1.HistoryStatus = ${Status} AND RR.RRId = rrsh1.RRId  LIMIT 1) and  DATEDIFF(CURDATE(),rrsh.Created)>=${Count1} and DATEDIFF(CURDATE(),rrsh.Created)<=${Count2}) From${Count1}To${Count2}Day,
(Select SUM(CASE WHEN HistoryStatus = ${Status} THEN 1 ELSE 0 END)
  FROM tbl_repair_request_status_history rrsh
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = rrsh.RRId AND RR.Status =  ${Status}  AND RR.IsDeleted = 0 ${AdminAccessOnCustomer}
where RR.RRId = rrsh.RRId AND rrsh.IsDeleted=0 and HistoryId = (SELECT MAX(HistoryId) FROM tbl_repair_request_status_history rrsh1 where rrsh1.HistoryStatus = ${Status} AND RR.RRId = rrsh1.RRId  LIMIT 1) and  DATEDIFF(CURDATE(),rrsh.Created)>=${Count3} and DATEDIFF(CURDATE(),rrsh.Created)<=${Count4}) From${Count3}To${Count4}Day,
(Select SUM(CASE WHEN HistoryStatus =${Status} THEN 1 ELSE 0 END)
  FROM tbl_repair_request_status_history rrsh
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = rrsh.RRId AND RR.Status =  ${Status}  AND RR.IsDeleted = 0 ${AdminAccessOnCustomer}
where  RR.RRId = rrsh.RRId AND rrsh.IsDeleted=0  and HistoryId = (SELECT MAX(HistoryId) FROM tbl_repair_request_status_history rrsh1 where rrsh1.HistoryStatus = ${Status} AND RR.RRId = rrsh1.RRId  LIMIT 1) and  DATEDIFF(CURDATE(),rrsh.Created)>${Count4}) Above${Count4}Day `


  // console.log("AHNewDashboardStatusHistoryCount=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

RR.DashboardStatisticsCount = (RR, result) => {

  var FromDate, ToDate = '';
  if (RR.FromDate != '' && RR.ToDate != '') {
    const Fromdatearray = RR.FromDate.split('T');
    const Todatearray = RR.ToDate.split('T');
    FromDate = Fromdatearray[0];
    ToDate = Todatearray[0];
  }
  var sql;
  sql = ` SELECT SUM(LoggedIn) as LoggedIn,
  SUM(Sourced) as Sourced,SUM(Resourced) as Resourced,SUM(Quoted) as Quoted,
  Sum(Approved) as Approved,Sum(NotRepairable) as NotRepairable,Sum(Completed) as Completed,SUM(RRGenerated) as RRGenerated from(SELECT
  SUM(CASE WHEN Status = '0' THEN 1 ELSE 0 END) RRGenerated,
  SUM(CASE WHEN Status = '1' THEN 1 ELSE 0 END) LoggedIn,
  SUM(CASE WHEN Status = '2' THEN 1 ELSE 0 END) Sourced,
  SUM(CASE WHEN Status = '3' THEN 1 ELSE 0 END) Resourced,
  SUM(CASE WHEN Status = '4' THEN 1 ELSE 0 END) Quoted,
  SUM(CASE WHEN Status = '5' THEN 1 ELSE 0 END) Approved,
  SUM(CASE WHEN Status = '6' THEN 1 ELSE 0 END) NotRepairable,
  SUM(CASE WHEN Status = '7' THEN 1 ELSE 0 END) Completed
  FROM tbl_repair_request rr
   where rr.IsDeleted=0 `
  if (RR.VendorId > 0) {
    sql = ` SELECT SUM(AwaitingQuote) as AwaitingQuote,SUM(Quoted) as Quoted,
  Sum(Approved) as Approved,Sum(Rejected) as Rejected,Sum(Completed) as Completed,SUM(RRGenerated) as RRGenerated from(SELECT
  SUM(CASE WHEN Status = '0' THEN 1 ELSE 0 END) RRGenerated,
  SUM(CASE WHEN Status = '2' THEN 1 ELSE 0 END) AwaitingQuote,
  SUM(CASE WHEN Status = '4' THEN 1 ELSE 0 END) Quoted,
  SUM(CASE WHEN Status = '5' THEN 1 ELSE 0 END) Approved,
  SUM(CASE WHEN Status = '6' THEN 1 ELSE 0 END) Rejected,
  SUM(CASE WHEN Status = '7' THEN 1 ELSE 0 END) Completed
  FROM tbl_repair_request rr
   where rr.IsDeleted=0 `
  }
  if (RR.PartId > 0) {
    sql = sql + ` AND rr.PartId= '${RR.PartId}' `;
  }
  if (RR.VendorId > 0) {
    sql = sql + ` AND rr.VendorId= '${RR.VendorId}' `;
  }
  var TokenIdentityType = getLogInIdentityType(RR);
  if (TokenIdentityType == 1) {
    sql = sql + ` AND rr.CustomerId In(${RR.LoginMultipleAccessIdentityIds})
    ${RR.CustomerId == 0 ? '' : ` And CustomerId in( ` + RR.CustomerId + `)`} `;
  }
  if (RR.LoginIdentityType == 0 && RR.LoginIsRestrictedCustomerAccess == 1 && RR.LoginMultipleCustomerIds != "") {
    sql += ` and rr.CustomerId in(${RR.LoginMultipleCustomerIds}) `;
  }
  if (FromDate != '' && ToDate != '') {
    sql = sql + ` AND (DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}')
  Group By Status) as x `;
  } else {
    sql = sql + ` AND (DATE(Created) BETWEEN '1900-01-01' AND CURDATE())
  Group By Status) as x `;
  }

  //console.log("DashBoard=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
//old
// To Dashboard Statistics Count
// RR.DashboardStatisticsCount = (RR, result) => {
//   const Fromdatearray = RR.FromDate.split('T');
//   const Todatearray = RR.ToDate.split('T');
//   console.log("RR.PartId " + RR.PartId);
//   var FromDate = Fromdatearray[0];
//   var ToDate = Todatearray[0];
//   var sql;
//   sql = ` SELECT SUM(LoggedIn) as LoggedIn,
//   SUM(Sourced) as Sourced,SUM(Quoted) as Quoted,
//   Sum(Approved) as Approved,Sum(NotRepairable) as NotRepairable,Sum(Completed) as Completed from(SELECT
//   SUM(CASE WHEN HistoryStatus = '1' THEN 1 ELSE 0 END) LoggedIn,
//   SUM(CASE WHEN HistoryStatus = '2' THEN 1 ELSE 0 END) Sourced,
//   SUM(CASE WHEN HistoryStatus = '4' THEN 1 ELSE 0 END) Quoted,
//   SUM(CASE WHEN HistoryStatus = '5' THEN 1 ELSE 0 END) Approved,
//   SUM(CASE WHEN HistoryStatus = '6' THEN 1 ELSE 0 END) NotRepairable,
//   SUM(CASE WHEN HistoryStatus = '7' THEN 1 ELSE 0 END) Completed
//   FROM tbl_repair_request_status_history rrsh
//   LEFT JOIN tbl_repair_request rr on rr.RRId=rrsh.RRId where rrsh.IsDeleted=0 `
//   if (RR.VendorId > 0) {
//     sql = ` SELECT SUM(AwaitingQuote) as AwaitingQuote,SUM(Quoted) as Quoted,
//   Sum(Approved) as Approved,Sum(Rejected) as Rejected,Sum(Completed) as Completed from(SELECT
//   SUM(CASE WHEN HistoryStatus = '2' THEN 1 ELSE 0 END) AwaitingQuote,
//   SUM(CASE WHEN HistoryStatus = '4' THEN 1 ELSE 0 END) Quoted,
//   SUM(CASE WHEN HistoryStatus = '5' THEN 1 ELSE 0 END) Approved,
//   SUM(CASE WHEN HistoryStatus = '6' THEN 1 ELSE 0 END) Rejected,
//   SUM(CASE WHEN HistoryStatus = '7' THEN 1 ELSE 0 END) Completed
//   FROM tbl_repair_request_status_history rrsh
//   LEFT JOIN tbl_repair_request rr on rr.RRId=rrsh.RRId where rrsh.IsDeleted=0 `
//   }
//   if (RR.PartId > 0) {
//     sql = sql + ` AND rr.PartId= '${RR.PartId}' `;
//   }
//   if (RR.VendorId > 0) {
//     sql = sql + ` AND rr.VendorId= '${RR.VendorId}' `;
//   }
//   if (RR.CustomerId > 0) {
//     sql = sql + ` AND rr.CustomerId= '${RR.CustomerId}' `;
//   }
//   sql = sql + ` AND (DATE(rrsh.Created) BETWEEN '${FromDate}' AND '${ToDate}')
//   Group By HistoryStatus) as x `;

//   console.log("DashBoard=" + sql)
//   con.query(sql, (err, res) => {
//     if (err) {
//       return result(err, null);
//     }
//     return result(null, res);
//   });
// };
// To GetRRIdInVendorDashboard
// RR.GetRRIdInVendorDashboard = (RR, result) => {


//   var sql = ` Select GROUP_CONCAT(Distinct rr.RRId) as RRIds,'-' as Test from tbl_repair_request rr
//   where Status='${RR.Status}' AND VendorId='${RR.VendorId}' `
//   if (RR.FromDate != '' && RR.ToDate != '') {
//     sql += ` AND DATE(rr.Created) BETWEEN '${RR.FromDate}' AND '${RR.ToDate}' `
//   }
//   else {
//     sql += ` AND DATE(rr.Created) BETWEEN '1900-01-01' AND CURDATE() `
//   }
//   con.query(sql, (err, res) => {
//     if (err) {
//       return result(err, null);
//     }
//     return result(null, res);
//   });
// };
// To SubmittedCount
RR.SubmittedCount = (RR, result) => {

  var FromDate, ToDate = '';
  if (RR.FromDate != '' && RR.ToDate != '') {
    const Fromdatearray = RR.FromDate.split('T');
    const Todatearray = RR.ToDate.split('T');
    FromDate = Fromdatearray[0];
    ToDate = Todatearray[0];
  }


  var sql = `SELECT
  SUM(MobileAppSubmitted) as MobileAppSubmitted,
  SUM(WebAppSubmitted) as WebAppSubmitted from(SELECT
  SUM(CASE WHEN Status = '0' and AddedFrom=1 THEN 1 ELSE 0 END) MobileAppSubmitted,
  SUM(CASE WHEN Status = '0' and AddedFrom=0 THEN 1 ELSE 0 END) WebAppSubmitted
  FROM tbl_repair_request where IsDeleted=0 `
  if (RR.VendorId > 0) {
    sql = sql + `AND VendorId='${RR.VendorId}' `;
  }
  if (RR.LoginIdentityType == 1) {
    sql = sql + ` AND CustomerId In(${RR.LoginMultipleAccessIdentityIds})
    ${RR.CustomerId == 0 ? '' : ` And CustomerId in( ` + RR.CustomerId + `)`} `;
  }
  if (RR.LoginIdentityType == 0 && RR.LoginIsRestrictedCustomerAccess == 1 && RR.LoginMultipleCustomerIds != "") {
    sql += ` and CustomerId in(${RR.LoginMultipleCustomerIds}) `;
  }
  if (RR.PartId > 0) {
    sql = sql + ` AND PartId= '${RR.PartId}' `;
  }
  if (FromDate != '' && ToDate != '') {
    sql = sql + ` AND (DATE(Created) BETWEEN '${FromDate}' AND '${ToDate}')
  Group By Status) as x `;
  } else {
    sql = sql + ` AND (DATE(Created) BETWEEN '1900-01-01' AND CURDATE())
  Group By Status) as x `;
  }


  // console.log("" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

RR.loggedInStatusByDate = (date, Status, result) => {
  const Datearray = date.split('T');
  var FilterDate = Datearray[0]; //.split("/");
  var sql;
  sql = `SELECT DATE_FORMAT(Date,'%m/%d/%Y') as Date,Count
  From(SELECT Cast(rrsh.Created as Date) as Date,
  SUM(CASE WHEN HistoryStatus = '${Status}' THEN 1 ELSE 0 END) Count
  FROM tbl_repair_request_status_history rrsh
  where rrsh.IsDeleted=0 and
  RRId in (Select RRId from tbl_repair_request_status_history where HistoryStatus=0 and Cast(Created as Date)='${FilterDate}')
  Group By Cast(rrsh.Created as Date)) as x `;
  // console.log("" + sql)
  return sql;
};
//Global Search
RR.findInColumns = (searchQuery, result) => {

  const {
    from,
    size,
    query,
    active
  } = searchQuery;

  let {
    IdentityType,
    MultipleAccessIdentityIds,
    IsRestrictedCustomerAccess,
    MultipleCustomerIds
  } = global.authuser;

  var sql = ` SELECT 'ahoms-repair-request' as _index,
  RRId as rrid, RRNo as rrno, C.CompanyName as companyname
  FROM tbl_repair_request as RR
  LEFT JOIN tbl_customers as C ON RR.CustomerId = C.CustomerId
  where
  (
    RR.RRDescription like '%${query.multi_match.query}%' or
    RR.StatedIssue like '%${query.multi_match.query}%' or
    RR.PartNo like '%${query.multi_match.query}%' or
    RR.SerialNo like '%${query.multi_match.query}%' or
    RR.RRNo like '%${query.multi_match.query}%' or
    C.CustomerCode like '%${query.multi_match.query}%' or
    C.FirstName like '%${query.multi_match.query}%' or
    C.LastName like '%${query.multi_match.query}%' or
    C.Email like '%${query.multi_match.query}%' or
    C.CompanyName like '%${query.multi_match.query}%'
  ) and RR.IsDeleted=0 ${IdentityType == "1" ? `AND RR.CustomerId IN (${MultipleAccessIdentityIds}) ` : ""}
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND RR.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size}`;

  var countSql = `SELECT count(*) AS totalCount FROM tbl_repair_request as RR
  where (
    RRDescription like '%${query.multi_match.query}%' or
    StatedIssue like '%${query.multi_match.query}%' or
    PartNo like '%${query.multi_match.query}%' or
    SerialNo like '%${query.multi_match.query}%' or
    RRNo like '%${query.multi_match.query}%') and
    RR.IsDeleted=0 ${IdentityType == "1" ? `AND RR.CustomerId IN (${MultipleAccessIdentityIds}) ` : ""}
    ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND RR.CustomerId IN (${MultipleCustomerIds}) ` : ""} `


  // console.log("" + sql)
  //console.log("" + countSql)
  con.query(countSql, (err, res) => {
    if (err) {
      return result(err, null);
    } else if (res[0].totalCount > 0) {
      let totalCount = res[0].totalCount;
      con.query(sql, (err, res) => {
        if (err) {
          return result(err, null);
        }
        return result(null, {
          totalCount: {
            "_index": "ahoms-repair-request",
            val: totalCount
          },
          data: res
        });
      });
    } else {
      return result(null, []);
    }

  });
}

RR.IsExistCSV = (RRId) => {
  var sql = `Select rr.CustomerId,rr.RRId,ifnull(i.IsCSVProcessed,0) InvoiceIsCSVProcessed,rr.VendorId,rr.RRVendorId,
ifnull(vi.IsCSVProcessed,0) VendorInvoiceIsCSVProcessed, i.Status as InvoiceStatus, vi.Status as vendorBillStatus , RRSH.HistoryStatus
FROM tbl_repair_request rr
LEFT JOIN tbl_invoice i on i.RRId=rr.RRId and i.RRId>0 and i.IsDeleted=0
LEFT JOIN tbl_vendor_invoice vi on vi.RRId=rr.RRId and vi.RRId>0 and vi.IsDeleted=0
LEFT JOIN (SELECT RRId,HistoryStatus FROM tbl_repair_request_status_history  WHERE RRId=${RRId} ORDER BY HistoryId DESC LIMIT 1,1) as RRSH ON RRSH.RRId=rr.RRId
where rr.IsDeleted=0 and rr.RRId='${RRId}'`;
  // console.log(sql)
  return sql;
};
RR.SelectRRStatus = (RRId) => {
  var sql = `Select RR.Status,RR.CustomerBlanketPOId,q.GrandTotal as QuoteAmount,q.QuoteId,RR.CustomerPONo
  from tbl_repair_request  RR
  LEFT JOIN tbl_quotes as q ON q.RRId = RR.RRId and q.Status=1 and q.QuoteCustomerStatus=2 and q.IsDeleted=0
  where RR.IsDeleted=0 and RR.RRId=${RRId}`;
  //console.log(sql)
  return sql;
};

RR.IsDirectedVendor = (RRId, VendorId) => {
  var sql = `Select VendorId,VendorName
from tbl_vendors v
where IsDeleted=0 and FIND_IN_SET(v.VendorId,(Select DirectedVendors from tbl_customers
where IsDeleted=0 and CustomerId=(Select CustomerId from tbl_repair_request
where IsDeleted=0 and RRId=${RRId} limit 1)) ) and v.VendorId=${VendorId} `;
  //console.log(sql)
  return sql;
};

RR.DashboardChartRRGeneratedStatusByDate = (reqbody, Status, VendorId) => {
  var date = reqbody.Date;
  var FilterDate = date;
  var sql;
  var AdminAcessOnCustomer = ``;

  var TokenIdentityType = getLogInIdentityType(reqbody);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqbody);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(reqbody);

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    AdminAcessOnCustomer += ` CustomerId in (${MultipleCustomerIds}) and `;
  }
  sql = `SELECT
           DATE_FORMAT(Date, '%Y-%m-%d') AS Date,
    (@sum:=@sum + x.Count) AS Count
         FROM
           (SELECT
           COUNT(*) AS Count, DATE(Created) Date
           FROM tbl_repair_request_status_history 
           WHERE 
           RRId IN (SELECT
           RRId
           FROM
           tbl_repair_request
           WHERE  ${AdminAcessOnCustomer}
           DATE_FORMAT(Created, '%d/%m/%Y') = '${FilterDate}'
           AND IsDeleted = 0 ${VendorId} )
           AND HistoryStatus = '${Status}'
           GROUP BY Date ORDER BY Date ASC) AS x
           CROSS JOIN
           (SELECT @sum:=0) params
         ORDER BY Date ASC;`;

  // sql = `SELECT
  //          DATE_FORMAT(Date, '%Y-%m-%d') AS Date,
  //   (@sum:=@sum + x.Count) AS Count
  //        FROM
  //          (SELECT
  //          COUNT(*) AS Count, DATE(Created) Date
  //          FROM
  //          tbl_repair_request_status_history
  //          WHERE
  //          RRId IN (SELECT
  //          RRId
  //          FROM
  //          tbl_repair_request
  //          WHERE
  //          DATE_FORMAT(Created, '%d/%m/%Y') = '${FilterDate}'
  //          AND IsDeleted = 0 ${VendorId} )
  //          AND HistoryStatus = '${Status}'
  //          GROUP BY Date ORDER BY Date ASC) AS x
  //          CROSS JOIN
  //          (SELECT @sum:=0) params
  //        ORDER BY Date ASC;`;
  return sql;
};


// To Dashboard Statistics Count
// RR.DashboardStatisticsCount = (RR, result) => {
//   const Fromdatearray = RR.FromDate.split('T');
//   const Todatearray = RR.ToDate.split('T');
//   var FromDate = Fromdatearray[0];
//   var ToDate = Todatearray[0];
//   var sql = ` SELECT SUM(LoggedIn) as LoggedIn,
//   SUM(Sourced) as Sourced,SUM(Quoted) as Quoted,
//   Sum(Approved) as Approved,Sum(NotRepairable) as NotRepairable,Sum(Completed) as Completed from(SELECT
//   SUM(CASE WHEN HistoryStatus = '1' THEN 1 ELSE 0 END) LoggedIn,
//   SUM(CASE WHEN HistoryStatus = '2' THEN 1 ELSE 0 END) Sourced,
//   SUM(CASE WHEN HistoryStatus = '4' THEN 1 ELSE 0 END) Quoted,
//   SUM(CASE WHEN HistoryStatus = '5' THEN 1 ELSE 0 END) Approved,
//   SUM(CASE WHEN HistoryStatus = '6' THEN 1 ELSE 0 END) NotRepairable,
//   SUM(CASE WHEN HistoryStatus = '7' THEN 1 ELSE 0 END) Completed
//   FROM tbl_repair_request_status_history rrsh
//   LEFT JOIN tbl_repair_request rr on rr.RRId=rrsh.RRId where rrsh.IsDeleted=0 `
//   if (RR.VendorId > 0) {
//     sql = sql + ` AND rr.VendorId= '${RR.VendorId}' `;
//   }
//   if (RR.CustomerId > 0) {
//     sql = sql + ` AND rr.CustomerId= '${RR.CustomerId}' `;
//   }
//   sql = sql + ` AND (DATE(rrsh.Created) BETWEEN '${FromDate}' AND '${ToDate}')
//   Group By HistoryStatus) as x `;

//   console.log("VD=" + sql)
//   con.query(sql, (err, res) => {
//     if (err) {
//       return result(err, null);
//     }
//     return result(null, res);
//   });
// };
/// To Status Report
RR.StatusReport = (RR, result) => {

  var sql = ` SELECT SUM(Status0) as RRGenerated,
  SUM(Status1) as AwaitingVendorSelection,SUM(Status2) as AwaitingVendorQuote,
  Sum(Status3) as ResourceVendorChange,Sum(Status4) as QuotedAwaitingCustomerPO,
  Sum(Status5) as RepairinProcess,Sum(Status6) as QuoteRejected,Sum(Status7) as Completed from( SELECT
  SUM(CASE WHEN Status = '0' THEN 1 ELSE 0 END) Status0,
  SUM(CASE WHEN Status = '1' THEN 1 ELSE 0 END) Status1,
  SUM(CASE WHEN Status = '2' THEN 1 ELSE 0 END) Status2,
  SUM(CASE WHEN Status = '3' THEN 1 ELSE 0 END) Status3,
  SUM(CASE WHEN Status = '4' THEN 1 ELSE 0 END) Status4,
  SUM(CASE WHEN Status = '5' THEN 1 ELSE 0 END) Status5,
  SUM(CASE WHEN Status = '6' THEN 1 ELSE 0 END) Status6,
  SUM(CASE WHEN Status = '7' THEN 1 ELSE 0 END) Status7
  FROM tbl_repair_request where IsDeleted=0 `
  if (RR.PartId > 0) {
    sql = sql + ` AND PartId= '${RR.PartId}' `;
  }
  if (RR.VendorId > 0) {
    sql = sql + ` AND VendorId= '${RR.VendorId}' `;
  }
  if (RR.CustomerId > 0) {
    sql = sql + ` AND CustomerId= '${RR.CustomerId}' `;
  }
  if (RR.FromDate != '') {
    sql = sql + ` AND Created >= '${RR.FromDate}' `;
  }
  if (RR.ToDate != '') {
    sql = sql + ` AND Created <= '${RR.ToDate}' `;
  }
  sql = sql + ` Group By Status) as x `;
  //console.log("ST=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

// RR.FailureTrendAnalysisReportBySupplier = (RR, result) => {

//   var sql = ` SELECT VendorName as Supplier,Count(IsWarrantyRecovery) as Transactions
//   FROM tbl_repair_request rr
//   Left Join tbl_vendors v Using(VendorId)
//   where rr.IsDeleted=0 AND IsWarrantyRecovery=1 `
//   if (RR.PartId > 0) {
//     sql = sql + ` AND rr.PartId= '${RR.PartId}' `;
//   }
//   if (RR.FromDate != '') {
//     sql = sql + ` AND rr.Created >= '${RR.FromDate}' `;
//   }
//   if (RR.ToDate != '') {
//     sql = sql + ` AND rr.Created <= '${RR.ToDate}' `;
//   }
//   sql = sql + `Group By rr.VendorId Order By Count(IsWarrantyRecovery) DESC Limit 0,5 `;

//   console.log("ST=" + sql)
//   con.query(sql, (err, res) => {
//     if (err) {
//       return result(err, null);
//     }
//     return result(null, res);
//   });
// };

// RR.FailureTrendAnalysisReportByPart = (obj, result) => {

//   var selectquery = `SELECT p.PartId,v.VendorName as Manufacturer,p.Description,p.PartNo,p.PartNo as CustomerPart,
//   Count(rr.PartId) as FailureQuantity,
//   CONCAT('$',' ',ROUND(SUM(rr.Price))) as TotalRepairCost,CONCAT('$',' ',ROUND(SUM(rr.Price)/COUNT(rr.PartId))) as AverageRepairCost `;
//   var query = ` FROM tbl_repair_request rr
//   Inner Join tbl_parts p on p.PartId=rr.PartId
//   Left Join tbl_vendors v on v.VendorId=p.ManufacturerId
//   where rr.IsDeleted=0 and IsWarrantyRecovery=1 `;

//   var cvalue = 0;
//   for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {
//     if (obj.columns[cvalue].search.value != "") {
//       switch (obj.columns[cvalue].name) {
//         case "VendorId":
//           query += " and ( v.VendorId = '" + obj.columns[cvalue].search.value + "' ) ";
//           break;
//         case "PartId":
//           query += " and ( p.PartId = '" + obj.columns[cvalue].search.value + "' ) ";
//           break;
//         case "CustomerId":
//           query += " and ( rr.CustomerId = '" + obj.columns[cvalue].search.value + "' ) ";
//           break;
//         default:
//           query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
//       }
//     }
//   }
//   query += ` Group By p.PartId `;
//   var Countquery = `Select Count(Counts) recordsFiltered from ( Select count(*) as Counts ` + query + ` ) as A `;
//   var i = 0;
//   if (obj.order.length > 0) {
//     query += " ORDER BY ";
//   }
//   for (i = 0; i < obj.order.length; i++) {
//     if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
//     {
//       switch (obj.columns[obj.order[i].column].name) {
//         case "Manufacturer":
//           query += " v.VendorId " + obj.order[i].dir + " ";
//           break;
//         case "Description":
//           query += " p.Description " + obj.order[i].dir + " ";
//           break;
//         case "PartNo":
//           query += " p.PartNo " + obj.order[i].dir + " ";
//           break;
//         case "CustomerPart":
//           query += " p.PartNo " + obj.order[i].dir + " ";
//           break;
//         case "TotalRepairCost":
//           query += " ROUND(SUM(rr.Price)) " + obj.order[i].dir + " ";
//           break;
//         case "FailureQuantity":
//           query += " Count(rr.PartId) " + obj.order[i].dir + " ";
//           break;
//         case "AverageRepairCost":
//           query += " ROUND(SUM(rr.Price) / COUNT(rr.PartId)) " + obj.order[i].dir + " ";
//           break;
//         default:
//           query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + " ";
//       }
//     }
//   }
//   if (obj.start != "-1" && obj.length != "-1") {
//     query += " LIMIT " + obj.start + "," + (obj.length);
//   }
//   query = selectquery + query;
//   var TotalCountQuery = `Select Count(Counts) TotalCount from (Select count(*) as Counts
//   FROM tbl_repair_request rr
//   Inner Join tbl_parts p on p.PartId=rr.PartId
//   Left Join tbl_vendors v on v.VendorId=p.ManufacturerId
//   where rr.IsDeleted=0 and IsWarrantyRecovery=1 Group By rr.PartId) as A `;

//   console.log("query = " + query);
//   console.log("Countquery = " + Countquery);
//   console.log("TotalCountQuery = " + TotalCountQuery);
//   async.parallel([
//     function (result) { con.query(query, result) },
//     function (result) { con.query(Countquery, result) },
//     function (result) { con.query(TotalCountQuery, result) }
//   ],
//     function (err, results) {
//       if (err)
//         return result(err, null);

//       if (results[0][0].length > 0) {
//         result(null, {
//           data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
//           recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
//         });
//         return;
//       }
//       else {
//         result(null, "No record");
//         return;
//       }
//     });
// };
// Failure Trend Analysis Report By Supplier
RR.FailureTrendAnalysisReportBySupplier = (RR) => {

  var sql = ` SELECT VendorName as Supplier,Count(IsWarrantyRecovery) as Transactions
  FROM tbl_repair_request rr
  Left Join tbl_vendors v Using(VendorId)
  where rr.IsDeleted=0 AND IsWarrantyRecovery=1 and rr.VendorId>0 `
  if (RR.PartId > 0) {
    sql = sql + ` AND rr.PartId= '${RR.PartId}' `;
  }
  if (RR.FromDate != '') {
    sql = sql + ` AND rr.Created >= '${RR.FromDate}' `;
  }
  if (RR.ToDate != '') {
    sql = sql + ` AND rr.Created <= '${RR.ToDate}' `;
  }
  sql = sql + `Group By rr.VendorId Order By Count(IsWarrantyRecovery) DESC Limit 0,5 `;
  // console.log("ST=" + sql)
  return sql;
};
// Failure Trend Analysis Report By Part
RR.FailureTrendAnalysisReportByPart = (obj) => {

  var selectquery = `SELECT p.PartId,v.VendorName as Manufacturer,p.Description,p.PartNo,p.PartNo as CustomerPart,
  Count(rr.PartId) as FailureQuantity,
  CONCAT('$',' ',ROUND(SUM(rr.Price))) as TotalRepairCost,CONCAT('$',' ',ROUND(SUM(rr.Price)/COUNT(rr.PartId))) as AverageRepairCost `;
  var query = ` FROM tbl_repair_request rr
  Inner Join tbl_parts p on p.PartId=rr.PartId
  Left Join tbl_vendors v on v.VendorId=p.ManufacturerId
  where rr.IsDeleted=0 and IsWarrantyRecovery=1 `;

  if (obj.VendorId != "") {
    query += " and ( v.VendorId ='" + obj.VendorId + "' ) ";
  }
  if (obj.PartId != "") {
    query += " and ( p.PartId ='" + obj.PartId + "' ) ";
  }
  if (obj.CustomerId != "") {
    query += " and ( rr.CustomerId ='" + obj.CustomerId + "' ) ";
  }
  if (obj.FromDate != "") {
    query += " and ( rr.Created >='" + obj.FromDate + "' ) ";
  }
  if (obj.ToDate != "") {
    query += " and ( rr.Created <='" + obj.ToDate + "'  ) ";
  }
  query += ` Group By p.PartId,v.VendorName,p.Description,p.PartNo `;
  var Countquery = `Select Count(Counts) recordsFiltered from ( Select count(*) as Counts ` + query + ` ) as A `;
  var i = 0;
  if (obj.order.length > 0) {
    query += " ORDER BY ";
  }
  for (i = 0; i < obj.order.length; i++) {
    if (obj.order[i].column != "" || obj.order[i].column == "0") // 0 is equal to ""
    {
      switch (obj.columns[obj.order[i].column].name) {
        case "Manufacturer":
          query += " v.VendorId " + obj.order[i].dir + " ";
          break;
        case "Description":
          query += " p.Description " + obj.order[i].dir + " ";
          break;
        case "PartNo":
          query += " p.PartNo " + obj.order[i].dir + " ";
          break;
        case "CustomerPart":
          query += " p.PartNo " + obj.order[i].dir + " ";
          break;
        case "TotalRepairCost":
          query += " ROUND(SUM(rr.Price)) " + obj.order[i].dir + " ";
          break;
        case "FailureQuantity":
          query += " Count(rr.PartId) " + obj.order[i].dir + " ";
          break;
        case "AverageRepairCost":
          query += " ROUND(SUM(rr.Price) / COUNT(rr.PartId)) " + obj.order[i].dir + " ";
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
  var Totalcountquery = `Select Count(Counts) TotalCount from (Select count(*) as Counts
  FROM tbl_repair_request rr
  Inner Join tbl_parts p on p.PartId=rr.PartId
  Left Join tbl_vendors v on v.VendorId=p.ManufacturerId
  where rr.IsDeleted=0 and IsWarrantyRecovery=1 Group By p.PartId,v.VendorName,p.Description,p.PartNo) as A `;
  var TempArray = [];
  var obj = {};
  obj.Query = query;
  obj.CountQuery = Countquery;
  obj.TotalCountQuery = Totalcountquery;
  TempArray.push(obj);
  // console.log("query = " + TempArray[0].Query);
  // console.log("Countquery = " + TempArray[0].CountQuery);
  // console.log("TotalCountQuery = " + TempArray[0].TotalCountQuery);
  return TempArray;
};
// To FailedPartByStatus
RR.FailedPartByStatus = (RR, result) => {

  var sql = ` SELECT IFNUll(SUM(PartCount),0) as NoOfFailedPart,IFNUll(SUM(ApprovedRepair)+SUM(ApprovedRepairInProgress),0) as ApprovedRepair,
  IFNUll(SUM(WarrantyRecovery),0) as WarrantyRecovery,IFNUll(SUM(RushRepair),0) as RushRepair,
  IFNUll(SUM(Rejected),0) as Rejected,0 as NoOfProblems,
  IFNUll(SUM(ApprovedRepairInProgress),0) as ApprovedRepairInProgress,
  IFNUll(SUM(RepairAwaitingApproval),0) as RepairAwaitingApproval,
  IFNUll(ROUND(SUM(PriceSum),2),0) as RepairCharges
  from (
  SELECT
  Count(PartId) as PartCount,
  SUM(CASE WHEN Status = '7' THEN 1 ELSE 0 END) ApprovedRepair,
  SUM(CASE WHEN IsWarrantyRecovery = '1' THEN 1 ELSE 0 END) WarrantyRecovery,
  SUM(CASE WHEN IsRushRepair = '1' THEN 1 ELSE 0 END) RushRepair,
  SUM(CASE WHEN Status = '6' THEN 1 ELSE 0 END) Rejected,
  SUM(CASE WHEN Status = '5' THEN 1 ELSE 0 END) ApprovedRepairInProgress,
  SUM(CASE WHEN Status = '4' THEN 1 ELSE 0 END) RepairAwaitingApproval,
  SUM(Price) as PriceSum
  FROM tbl_repair_request where IsDeleted=0 `
  if (RR.CustomerId > 0) {
    sql = sql + ` AND CustomerId= '${RR.CustomerId}' `;
  }
  if (RR.FromDate != '') {
    sql = sql + ` AND Created >= '${RR.FromDate}' `;
  }
  if (RR.ToDate != '') {
    sql = sql + ` AND Created <= '${RR.ToDate}' `;
  }
  sql += ` Group By PartId,Price) as A `;
  // console.log("FailedPartByStatus=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
// To FailedPartByStatusChart
RR.FailedPartByStatusChart = (RR, result) => {

  var sql = ` SELECT  DATE_FORMAT(Created, '%b') as Month,
  IFNUll(Count(PartId),0) as NoOfFailedPart
  FROM tbl_repair_request where IsDeleted=0 `
  if (RR.CustomerId > 0) {
    sql = sql + ` AND CustomerId= '${RR.CustomerId}' `;
  }
  if (RR.FromDate != '') {
    sql = sql + ` AND Created >= '${RR.FromDate}' `;
  }
  if (RR.ToDate != '') {
    sql = sql + ` AND Created <= '${RR.ToDate}' `;
  }
  sql += ` Group By Month(Created),DATE_FORMAT(Created, '%b') `;
  //console.log("FailedPartByStatusChart=" + sql)
  return sql;
};
// To CostSavingsByCategory
RR.CostSavingsByCategory = (RR, result) => {

  var Customer = ` And CustomerId='${RR.CustomerId}' `;
  var FromDate = ` AND Created >= '${RR.FromDate}' `;
  var ToDate = ` AND Created <= '${RR.ToDate}' `;
  var sql = `Select  IFNULL(ROUND(WarrantyRecoveryCost,2),0) WarrantyRecoveryCost,IFNULL(ROUND(RepairVSNewPurchase,2),0) as RepairVSNewPurchase,0 NoOfProblem,
  IFNULL(ROUND(WarrantyRecoveryCost+RepairVSNewPurchase,2),0) as TotalSaving from (
  Select (Select Sum(PartPON) from tbl_repair_request where IsDeleted=0 and IsWarrantyRecovery = '1' and Status=${Constants.CONST_RRS_COMPLETED} `;

  if (RR.CustomerId > 0) {
    sql += Customer;
  }
  if (RR.FromDate != '') {
    sql += FromDate;
  }
  if (RR.ToDate != '') {
    sql += ToDate;
  }
  sql += ` ) as WarrantyRecoveryCost,
  (Select Sum(PartPON)-SUM(Price) from tbl_repair_request where IsDeleted=0 AND  Status=${Constants.CONST_RRS_COMPLETED} `
  if (RR.CustomerId > 0) {
    sql += Customer;
  }
  if (RR.FromDate != '') {
    sql += FromDate;
  }
  if (RR.ToDate != '') {
    sql += ToDate;
  }
  sql += ` ) as RepairVSNewPurchase) as A `;
  // console.log("CostSavingsByCategory=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
// To CostSavingsChart
RR.CostSavingsChart = (RR, result) => {

  var Customer = ` And CustomerId='${RR.CustomerId}' `;
  var FromDate = ` AND Created >= '${RR.FromDate}' `;
  var ToDate = ` AND Created <= '${RR.ToDate}' `;
  var sql = `SELECT Month,IFNULL(ROUND(SUM(Cost),2),0) as TotalSaving from (Select DATE_FORMAT(Created, '%b') Month,Sum(PartPON) Cost,Month(Created) MonthNumber
  from tbl_repair_request where IsDeleted=0 and IsWarrantyRecovery = '1' and Status=${Constants.CONST_RRS_COMPLETED}  `;
  if (RR.CustomerId > 0) {
    sql += Customer;
  }
  if (RR.FromDate != '') {
    sql += FromDate;
  }
  if (RR.ToDate != '') {
    sql += ToDate;
  }
  sql += ` Group By Month(Created),DATE_FORMAT(Created, '%b')
  UNION ALL
  Select DATE_FORMAT(Created, '%b') Month,Sum(PartPON)-SUM(Price) Cost,Month(Created) MonthNumber
  from tbl_repair_request where IsDeleted=0 AND  Status=${Constants.CONST_RRS_COMPLETED} `
  if (RR.CustomerId > 0) {
    sql += Customer;
  }
  if (RR.FromDate != '') {
    sql += FromDate;
  }
  if (RR.ToDate != '') {
    sql += ToDate;
  }
  sql += ` Group By Month(Created),DATE_FORMAT(Created, '%b')) as A Group By MonthNumber,Month `;
  // console.log("CostSavingsChart=" + sql)
  return sql;
};
// To TotalRepairSpendChart
RR.TotalRepairSpendChart = (RR, result) => {

  var sql = `Select DATE_FORMAT(Created, '%b') as Month,ROUND(SUM(Price),2) as TotalRepairSpend
  from tbl_repair_request where IsDeleted=0 AND Status=${Constants.CONST_RRS_COMPLETED} `;
  if (RR.CustomerId > 0) {
    sql = sql + ` AND CustomerId= '${RR.CustomerId}' `;
  }
  if (RR.FromDate != '') {
    sql = sql + ` AND Created >= '${RR.FromDate}' `;
  }
  if (RR.ToDate != '') {
    sql = sql + ` AND Created <= '${RR.ToDate}' `;
  }
  sql += ` Group By Month(Created),DATE_FORMAT(Created, '%b') `;

  // console.log("TotalRepairSpendChart=" + sql)
  return sql;
};
// To YearlySummary
RR.YearlySummary = (RR, result) => {

  var sql = `Select DATE_FORMAT(Created, '%b') as Month,IFNULL(ROUND(SUM(PartPON)-SUM(Price),2),0) as TotalSavings,
  ROUND(SUM(Price),2) as TotalRepairSpend, Count(PartId) as NoOfRepairProcessed
  from tbl_repair_request where IsDeleted=0 AND Status=${Constants.CONST_RRS_COMPLETED} `;
  if (RR.CustomerId > 0) {
    sql = sql + ` AND CustomerId= '${RR.CustomerId}' `;
  }
  if (RR.FromDate != '') {
    sql = sql + ` AND Created >= '${RR.FromDate}' `;
  }
  if (RR.ToDate != '') {
    sql = sql + ` AND Created <= '${RR.ToDate}' `;
  }
  sql += ` Group By Month(Created),DATE_FORMAT(Created, '%b') `;

  //console.log("YearlySummary=" + sql)
  return sql;
};
// To AverageTurnAroundTime
RR.AverageTurnAroundTime = (RR, result) => {

  var sql = ` Select rr.RRId,DATEDIFF(q.SubmittedDate,rr.Created) as ShipToQuote,
  DATEDIFF(q.ApprovedDate,q.SubmittedDate) as QuoteApproved,IFNULL(DATEDIFF(s.DateRequested,s.ApprovedDate),0) as TimeForRepair,
  0 as TotalAverageTAT
  From tbl_repair_request rr
  Left Join tbl_quotes q Using(RRId)
  Left Join tbl_sales_order s Using(RRId)
  where rr.IsDeleted=0 and q.Status=1 and DATEDIFF(q.SubmittedDate,rr.Created) >=0 `;
  if (RR.CustomerId > 0) {
    sql = sql + ` AND rr.CustomerId= '${RR.CustomerId}' `;
  }
  if (RR.FromDate != '') {
    sql = sql + ` AND rr.Created >= '${RR.FromDate}' `;
  }
  if (RR.ToDate != '') {
    sql = sql + ` AND s.ApprovedDate <= '${RR.ToDate}' `;
  }
  // console.log("AverageTurnAroundTime=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
// To SourceRatio
RR.SourceRatio = (RR, result) => {

  var sql = ` Select Count(RRId) as NoOfRepairRequest,0 as OEM,Count(RRId)-0 as AHPlatformVendor
  from tbl_repair_request where IsDeleted=0 `;
  if (RR.CustomerId > 0) {
    sql = sql + ` AND CustomerId= '${RR.CustomerId}' `;
  }
  if (RR.FromDate != '') {
    sql = sql + ` AND Created >= '${RR.FromDate}' `;
  }
  if (RR.ToDate != '') {
    sql = sql + ` AND Created <= '${RR.ToDate}' `;
  }
  //console.log("SourceRatio=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};
//UpdatePartCurrentLocation
RR.UpdatePartCurrentLocation = (obj, result) => {
  var sql = ` UPDATE tbl_repair_request SET ShippingStatus = ?, ShippingIdentityType = ?,
  ShippingIdentityId=?,ShippingIdentityName =?,ShippingAddressId =? WHERE RRId = ? `;
  var values = [obj.ShippingStatus, obj.ShippingIdentityType, obj.ShippingIdentityId,
    obj.ShippingIdentityName, obj.ShippingAddressId, obj.RRId
  ]
  //console.log("values=" + values)
  con.query(sql, values, (err, res) => {
    if (err) {
      return result(null, err);
    }
    if (res.affectedRows == 0) {
      return result({
        kind: "RRId_not_found"
      }, null);
    }
    result(null, {
      id: obj.RRId,
      ...obj
    });
  });
};



RR.RRNoAotoSuggest = (obj, result) => {

  var TokenIdentityType = getLogInIdentityType(obj);
  var TokenIdentityId = getLogInIdentityId(obj);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(obj);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(obj);

  var sql = `Select  RRId,RRNo from tbl_repair_request WHERE IsDeleted = 0 AND (RRNo LIKE '%${obj.RRNo}%') `;

  if (obj.hasOwnProperty('CustomerId') == true && obj.CustomerId > 0)
    sql += ` AND CustomerId='${obj.CustomerId}' `;

  if (TokenIdentityType == Constants.CONST_IDENTITY_TYPE_VENDOR)
    sql += ` AND VendorId='${TokenIdentityId}' `;

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and CustomerId in(${MultipleCustomerIds}) `;
  }
  sql += ` ORDER BY RRNo ASC LIMIT 20 `;
  // console.log("Auto suggest =" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
}

RR.VendorPOAutoSuggest = (SearchText, result) => {
  con.query(`Select  RRId,VendorPONo From tbl_repair_request
          WHERE IsDeleted = 0 AND (VendorPONo LIKE '%${SearchText}%') ORDER BY VendorPONo ASC LIMIT 20 `, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
}

RR.CustomerPOAutoSuggest = (reqbody, result) => {
  var SearchText = reqbody.CustomerPONo;
  var TokenIdentityType = getLogInIdentityType(reqbody);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqbody);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(reqbody);
  var sql = `Select  RRId,CustomerPONo From tbl_repair_request
          WHERE IsDeleted = 0 `;
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and CustomerId in(${MultipleCustomerIds}) `;
  }
  sql += ` AND (CustomerPONo LIKE '%${SearchText}%') ORDER BY CustomerPONo ASC LIMIT 20 `;
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
}

RR.UpdatePON = (reqbody, result) => {
  var RRObj = new RR(reqbody);
  var sql = `Update tbl_repair_request set PartPON=${RRObj.PartPON}, PartPONLocalCurrency = '${RRObj.PartPONLocalCurrency}',PartPONBaseCurrency = '${RRObj.PartPONBaseCurrency}',BasePartPON = ${RRObj.BasePartPON},PartPONExchangeRate = ${RRObj.PartPONExchangeRate}  where IsDeleted=0 and RRId=${RRObj.RRId} `
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.affectedRows == 0) {
      result({
        msg: " not found"
      }, null);
    }
    result(null, res);
    return;
  });
}


RR.ActiveInActiveRR = (reqbody, result) => {
  var RRObj = new RR(reqbody);
  var sql = `Update tbl_repair_request set IsActive=${RRObj.IsActive},Modified='${RRObj.Modified}',ModifiedBy='${RRObj.ModifiedBy}'    where IsDeleted=0 and RRId=${RRObj.RRId} `
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    result(null, res);
    return;
  });
}


RR.SONoAutoSuggest = (reqbody, result) => {

  var SearchText = reqbody.CustomerSONo;

  var TokenIdentityType = getLogInIdentityType(reqbody);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqbody);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(reqbody);

  var sql = `Select  RRId,CustomerSONo From tbl_repair_request
          WHERE IsDeleted = 0 `;

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and CustomerId in(${MultipleCustomerIds}) `;
  }
  sql += ` AND (CustomerSONo LIKE '%${SearchText}%') ORDER BY CustomerSONo ASC LIMIT 20 `;
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
}

//
RR.UpdateRRStatusInRevert = (Obj, result) => {
  var sql = `UPDATE tbl_repair_request  SET Status='${Obj.Status}',IsReverted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}'  WHERE RRID = '${Obj.RRId}'`;
  //console.log("sql" + sql);
  return sql;
};
RR.ResetCustomerPONobyRRId = (RRId, result) => {
  var sql = `UPDATE tbl_repair_request  SET CustomerPONo='',CustomerBlanketPOId=0 WHERE RRId ='${RRId}'`;
  // console.log(sql);
  return sql;
};
RR.ResetInvoiceDetailInRR = (RRId, result) => {
  var sql = `UPDATE tbl_repair_request  SET CustomerInvoiceId=0,CustomerInvoiceNo='',CustomerInvoiceDueDate=null WHERE RRId ='${RRId}'`;
  //console.log(sql);
  return sql;
};
RR.ResetVendorInvoiceDetailInRR = (RRId, result) => {
  var sql = `UPDATE tbl_repair_request  SET VendorInvoiceId=0,VendorInvoiceNo='',VendorInvoiceDueDate=null WHERE RRId ='${RRId}'`;
  // console.log(sql);
  return sql;
};
RR.ResetSODetailInRR = (RRId, result) => {
  var sql = `UPDATE tbl_repair_request  SET CustomerSOId=0,CustomerSONo='',CustomerSODueDate=null WHERE RRId ='${RRId}'`;
  //console.log(sql);
  return sql;
};
RR.ResetPODetailInRR = (RRId, result) => {
  var sql = `UPDATE tbl_repair_request  SET VendorPOId=0,VendorPONo='',VendorPODueDate=null WHERE RRId ='${RRId}'`;
  //console.log(sql);
  return sql;
};
RR.SaveCustomerPoNo = (obj) => {
  var sql = `Update tbl_repair_request SET  CustomerPONo='${obj.CustomerPONo}',
  Modified='${obj.Modified}',ModifiedBy='${obj.ModifiedBy}' WHERE IsDeleted=0 and RRId=${obj.RRId} `;
  // console.log("SaveCustomerPoNo =" + sql)
  return sql;
}
//report query
/*SELECT C.CompanyName, RR.PartNo, CONCAT(DATE_FORMAT(RR.Created, '%m/%d/%Y'), ', ', IF(V.VendorName IS NOT NULL, V.VendorName, '-'), ', ', RR.RRNo, ', ', RR.PartNo, ', ', RR.Price, ', 0, ',
  CASE RR.Status
WHEN 0 THEN 'RR Generated'
WHEN 1 THEN 'Awaiting Vendor Selection'
WHEN 2 THEN 'Awaiting Vendor Quote'
WHEN 3 THEN 'Resource - Vendor Change'
WHEN 4 THEN 'Quoted - Awaiting Customer PO'
WHEN 5 THEN 'Repair in Process'
WHEN 6 THEN 'Quote Rejected'
WHEN 7 THEN 'Completed'
WHEN 8 THEN 'Not Repairable'
ELSE '-'	end, IF(RR.IsRushRepair = 1, ',Rush', ' '), IF(RR.IsWarrantyRecovery = 1, ',Warranty Recovery', ' ')
) as Attributes
FROM ahoms.tbl_repair_request as RR
LEFT JOIN ahoms.tbl_customers as C ON C.CustomerId = RR.CustomerId
LEFT JOIN ahoms.tbl_vendors V on RR.VendorId = V.VendorId
WHERE RR.IsDeleted = 0;*/


RR.GlobalAutoSuggest = (reqbody, result) => {
  var SearchText = reqbody.SearchText;

  var sqlRR = `Select RRId  as IdentityId,RRNo as IdentityNo,3 as IdentityType 
    From tbl_repair_request 
    where IsDeleted=0 and RRNo!='${SearchText}'  and RRNo like  ${SearchText > 0 ? ` 'RR${SearchText}%' ` : `'${SearchText}%'`} limit 5;`;

  var sqlSO = `Select SOId  as IdentityId,SONo as IdentityNo,5 as IdentityType 
    From tbl_sales_order 
    where IsDeleted=0 and SONo like ${SearchText > 0 ? ` 'SO${SearchText}%' ` : `'${SearchText}%'`} limit 5;`;

  var sqlPO = `Select POId  as IdentityId,PONo as IdentityNo,6 as IdentityType 
    From tbl_po 
    where IsDeleted=0 and PONo like  ${SearchText > 0 ? ` 'PO${SearchText}%' ` : `'${SearchText}%'`} limit 5;`;

  var sqlQT = `Select QuoteId  as IdentityId,QuoteNo as IdentityNo,4 as IdentityType 
    From tbl_quotes 
    where IsDeleted=0 and QuoteNo like  ${SearchText > 0 ? ` 'QT${SearchText}%' ` : `'${SearchText}%'`} limit 5;`;

  var sqlInv = `Select InvoiceId  as IdentityId,InvoiceNo as IdentityNo,7 as IdentityType 
    From tbl_invoice 
    where IsDeleted=0 and InvoiceNo like  ${SearchText > 0 ? ` 'INV${SearchText}%' ` : `'${SearchText}%'`} limit 5;`;

  var sqlVInv = `Select VendorInvoiceId  as IdentityId,VendorInvoiceNo as IdentityNo,8 as IdentityType
    From tbl_vendor_invoice
    where IsDeleted=0 and VendorInvoiceNo like  ${SearchText > 0 ? ` 'VI${SearchText}%' ` : `'${SearchText}%'`} limit 5;`;



  var RR = `Select RRId  as IdentityId,RRNo as IdentityNo,3 as IdentityType 
  From tbl_repair_request 
  where IsDeleted=0 and RRNo='${SearchText}'; `;

  var RRSO = `Select SOId  as IdentityId,SONo as IdentityNo,5 as IdentityType 
  From tbl_sales_order 
  where IsDeleted=0  and RRId=(Select RRId From tbl_repair_request where IsDeleted=0 and RRNo='${SearchText}' limit 1) `;

  var RRPO = `Select POId  as IdentityId,PONo as IdentityNo,6 as IdentityType 
  From tbl_po 
  where IsDeleted=0  and RRId=(Select RRId From tbl_repair_request where IsDeleted=0 and RRNo='${SearchText}' limit 1) `;

  var RRQT = `Select QuoteId  as IdentityId,QuoteNo as IdentityNo,4 as IdentityType 
  From tbl_quotes 
  where IsDeleted=0 and RRId=(Select RRId From tbl_repair_request where IsDeleted=0 and RRNo='${SearchText}' limit 1) `;

  var RRINV = `Select InvoiceId  as IdentityId,InvoiceNo as IdentityNo,7 as IdentityType 
  From tbl_invoice 
  where IsDeleted=0 and RRId=(Select RRId From tbl_repair_request where IsDeleted=0 and RRNo='${SearchText}' limit 1) `;

  var RRVI = ` Select VendorInvoiceId  as IdentityId,VendorInvoiceNo as IdentityNo,8 as IdentityType
  From tbl_vendor_invoice
  where IsDeleted=0 and RRId=(Select RRId From tbl_repair_request where IsDeleted=0 and RRNo='${SearchText}' limit 1) `;

  var TokenIdentityType = getLogInIdentityType(reqbody);


  //console.log(sqlRR, sqlSO, sqlPO, sqlQT, sqlInv, sqlVInv, RR, RRSO, RRPO, RRQT, RRINV, RRVI);
  async.parallel([
      function (result) {
        con.query(sqlRR, result);
      },
      function (result) {
        if (TokenIdentityType == 0 || TokenIdentityType == 2) {
          con.query(sqlVInv, result);
        } else {
          result(null, {
            empty: 1
          })
        }
      },
      function (result) {
        if (TokenIdentityType == 0) {
          con.query(sqlSO, result);
        } else {
          result(null, {
            empty: 1
          })
        }
      },
      function (result) {
        if (TokenIdentityType == 0 || TokenIdentityType == 2) {
          con.query(sqlPO, result);
        } else {
          result(null, {
            empty: 1
          })
        }
      },
      function (result) {
        if (TokenIdentityType == 0) {
          con.query(sqlQT, result);
        } else {
          result(null, {
            empty: 1
          })
        }
      },
      function (result) {
        if (TokenIdentityType == 0 || TokenIdentityType == 1) {
          con.query(sqlInv, result);
        } else {
          result(null, {
            empty: 1
          })
        }
      },

      function (result) {
        con.query(RR, result);
      },
      function (result) {
        if (TokenIdentityType == 0) {
          con.query(RRSO, result);
        } else {
          result(null, {
            empty: 1
          })
        }
      },
      function (result) {
        if (TokenIdentityType == 0 || TokenIdentityType == 2) {
          con.query(RRPO, result);
        } else {
          result(null, {
            empty: 1
          })
        }
      },
      function (result) {
        if (TokenIdentityType == 0) {
          con.query(RRQT, result);
        } else {
          result(null, {
            empty: 1
          })
        }
      },
      function (result) {
        if (TokenIdentityType == 0 || TokenIdentityType == 1) {
          con.query(RRINV, result);
        } else {
          result(null, {
            empty: 1
          })
        }
      },
      function (result) {
        if (TokenIdentityType == 0 || TokenIdentityType == 2) {
          con.query(RRVI, result);
        } else {
          result(null, {
            empty: 1
          })
        }
      },
    ],
    function (err, results) {
      if (err) {
        result(err, null);
      } else {
        var MergedObj;
        MergedObj = results[0][0].concat(results[1].empty == 1 ? [] : results[1][0], results[2].empty == 1 ? [] : results[2][0], results[3].empty == 1 ? [] : results[3][0], results[4].empty == 1 ? [] : results[4][0], results[5].empty == 1 ? [] : results[5][0], results[6].empty == 1 ? [] : results[6][0], results[7].empty == 1 ? [] : results[7][0], results[8].empty == 1 ? [] : results[8][0], results[9].empty == 1 ? [] : results[9][0], results[10].empty == 1 ? [] : results[10][0], results[11].empty == 1 ? [] : results[11][0]);
        result(null, {
          data: MergedObj
        });
      }
    });
}

RR.ChangeRRIsActiveStatus = (RRObj, result) => {
  var sql = `UPDATE tbl_repair_request  SET IsActive=?,Modified=?,ModifiedBy=?  WHERE RRID = ?`;
  var values = [RRObj.IsActive, RRObj.Modified, RRObj.ModifiedBy, RRObj.RRId];
  //console.log(sql);
  //console.log("Completed==" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({
        msg: "IsActive status Not updated"
      }, null);
      return;
    }
    result(null, {
      Status: RRObj.IsActive
    });
    return;
  });
};

RR.UpdateRRSubStatus = (reqbody, result) => {
  var RRObj = new RR(reqbody);
  var viewSql = RR.viewqueryshort(RRObj.RRId);
  con.query(viewSql, (err, Objres) => {
    if (err) {
      result(null, err);
      return;
    } else {
      var sql = `Update tbl_repair_request set SubStatusId=${RRObj.SubStatusId},Modified='${RRObj.Modified}',ModifiedBy='${RRObj.ModifiedBy}' where IsDeleted=0 and RRId=${RRObj.RRId} `
      con.query(sql, (err1, res) => {
        if (err1) {
          return result(err1, null);
        }
        if (RRObj.SubStatusId != Objres[0].SubStatusId) {
          var RRSubStatusHistoryObj = new RRSubStatusHistory({
            authuser: reqbody.authuser,
            RRId: RRObj.RRId,
            HistorySubStatusId: RRObj.SubStatusId,
            HistoryAssigneeId: RRObj.AssigneeUserId ? RRObj.AssigneeUserId : 0
          });
          async.parallel([
              function (result) {
                RRSubStatusHistory.Create(RRSubStatusHistoryObj, result);
              },
            ],
            function (err1, results) {
              // if (err1)
              //   return result(err1, null);
              // else
              //   result(null, res);
              //   return;
            });
        }
        result(null, res);
        return;
      });
    }
  });
};

RR.UpdateRRAssignee = (reqbody, result) => {
  var RRObj = new RR(reqbody);
  var viewSql = RR.viewquery(RRObj.RRId, reqbody);
  con.query(viewSql, (err, Objres) => {
    if (err) {
      result(null, err);
      return;
    } else {
      var sql = `Update tbl_repair_request set AssigneeUserId=${RRObj.AssigneeUserId},Modified='${RRObj.Modified}',ModifiedBy='${RRObj.ModifiedBy}' where IsDeleted=0 and RRId=${RRObj.RRId} `;
      con.query(sql, (err1, res) => {
        if (err1) {
          return result(err1, null);
        }
        if (RRObj.AssigneeUserId != Objres[0].AssigneeUserId) {
          var RRAssigneeHistoryObj = new RRAssigneeHistory({
            authuser: reqbody.authuser,
            RRId: RRObj.RRId,
            HistoryAssigneeId: RRObj.AssigneeUserId,
            HistorySubStatusId: RRObj.SubStatusId ? RRObj.SubStatusId : 0
          });
          async.parallel([
              function (result) {
                RRAssigneeHistory.Create(RRAssigneeHistoryObj, result);
              },
            ],
            function (err1, results) {
              // if (err1)
              //   result(err1, null);
              // else
              //   result(null, res);
              //   return;
            });
        }
        result(null, res);
        return;
      });
    }
  });
};

RR.UpdateRRPartsLocation = (reqbody, result) => {
  var RRObj = new RR(reqbody);
  var viewSql = RR.viewquery(RRObj.RRId, reqbody);
  con.query(viewSql, (err, Objres) => {
    if (err) {
      console.log(err);
      result(null, err);
      return;
    } else {
      var sql = `Update tbl_repair_request set RRPartLocationId=${RRObj.RRPartLocationId},Modified='${RRObj.Modified}',ModifiedBy='${RRObj.ModifiedBy}' where IsDeleted=0 and RRId=${RRObj.RRId}`;
      // console.log(sql);
      con.query(sql, (err1, res) => {
        if (err1) {
          return result(err1, null);
        }
        if (RRObj.RRPartLocationId != Objres[0].RRPartLocationId) {
          var RRLocationHistoryObj = new RRLocationHistory({
            authuser: reqbody.authuser,
            RRId: RRObj.RRId,
            HistoryRRPartLocationId: RRObj.RRPartLocationId
          });
          async.parallel([
              function (result) {
                RRLocationHistory.Create(RRLocationHistoryObj, result);
              },
            ],
            function (err1, results) {
              // if (err1)
              //   return result(err1, null);
              // else
              //   result(null, res);
              //   return;
            });
        }
        result(null, res);
        return;
      });
    }
  });
};

RR.WorkchainBulkUpdate = (reqbody, result) => {
  var RRIds = reqbody.RRIds.split(",").map(function (value) {
    return value.trim();
  });

  RRIds.forEach(RRId => {
    reqbody.RRId = RRId;
    async.parallel([
        function (result) {
          if (reqbody.hasOwnProperty('SubStatusId')) RR.UpdateRRSubStatus(reqbody, result)
        },
        function (result) {
          if (reqbody.hasOwnProperty('AssigneeUserId')) RR.UpdateRRAssignee(reqbody, result)
        },
      ],
      function (err1, results) {});
  });
  result(null, reqbody);
  return;
};

RR.WorkchainMyTaskChart = (reqBody, result) => {
  var TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  var LoginUserId = (reqBody.authuser && reqBody.authuser.UserId) ? reqBody.authuser.UserId : TokenUserId;
  var sql = `Select COUNT(*) as count, RR.SubStatusId, s.SubStatusName, CONCAT(a.FirstName,' ', a.LastName) as AssigneeName
  from tbl_repair_request as RR
  LEFT JOIN tbl_users a ON a.UserId=RR.AssigneeUserId
  LEFT JOIN tbl_repair_request_substatus s ON s.SubStatusId=RR.SubStatusId
  where RR.IsDeleted=0  and  RR.SubStatusId>0 and RR.AssigneeUserId=${LoginUserId} GROUP BY RR.SubStatusId`;
  //console.log("sql=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
}

RR.WorkchainMyTaskCount = (reqBody, result) => {
  var TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  var LoginUserId = (reqBody.authuser && reqBody.authuser.UserId) ? reqBody.authuser.UserId : TokenUserId;
  var sql = `Select COUNT(*) as count from tbl_repair_request as RR
  where RR.IsDeleted=0 and RR.AssigneeUserId=${LoginUserId}`; // AND Status NOT IN (6,7,8)
  //console.log("sql=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res[0].count);
    return;
  });
}

RR.unlockCustomerShipAddress = (reqbody, result) => {
  var sql = `Update tbl_quotes set CustomerShipIdLocked=0 where IsDeleted=0 and QuoteId=${reqbody.QuoteId} `;
  //console.log("sql=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result(null, {
        msg: "No data found!"
      });
      return;
    } else {
      result(null, {
        msg: "Customer shipping address unlocked successfully!"
      });
      return;
    }
  });
}

RR.unlockVendorShipAddress = (reqbody, result) => {
  var sql = `Update tbl_repair_request_vendors set VendorShipIdLocked=0 where IsDeleted=0 and RRId=${reqbody.RRId} `;
  //console.log("sql=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result(null, {
        msg: "No data found!"
      });
      return;
    } else {
      result(null, {
        msg: "Vendor shipping address unlocked successfully!"
      });
      return;
    }

  });
}

RR.getAllAutoComplete = (SearchText, result) => {
  con.query(`Select RRId,RRNo,PartId,PartNo,SerialNo from tbl_repair_request 
  WHERE IsDeleted = 0 AND (RRNo LIKE '%${SearchText}%') ORDER BY RRNo ASC`, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
}

RR.updateRFIDTagNo = (reqbody, result) => {
  var sql = `Update tbl_repair_request set RFIDTagNo= '${reqbody.RFIDTagNo}' where IsDeleted=0 and RRId=${reqbody.RRId} `;
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result(null, {
        msg: "No data found!"
      });
      return;
    } else {
      result(null, {
        msg: "RFID Tag updated successfully!"
      });
      return;
    }

  });
}

module.exports = RR;
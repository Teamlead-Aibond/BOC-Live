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
const SalesOrderItem = require("./sales.order.item.model.js");
const GlobalCustomerReference = require("./sales.order.customer.ref.model.js");
const Address = require("../models/customeraddress.model.js");
const Notes = require("../models/repair.request.notes.model.js");
const AttachmentModel = require("../models/repair.request.attachment.model.js");
const RRCustomerReference = require("../models/cutomer.reference.labels.model.js");
const { escapeSqlValues } = require("../helper/common.function.js");
var MailConfig = require('../config/email.config');
const CustomerBlanketPOModel = require("../models/customer.blanket.po.model.js");
const CustomerBlanketPOHistoryModel = require("../models/customer.blanket.po.history.model.js");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
const PurchaseOrder = require("./purchase.order.model.js");
const Invoice = require("./invoice.model.js");
const CustomerBlanketPOHistory = require("../models/customer.blanket.po.history.model.js");
const Quotes = require("./quotes.model.js");
var gmailTransport = MailConfig.GmailTransport;
const SalesOrder = function (objSalesOrder) {
  this.SOId = objSalesOrder.SOId;
  this.SONo = objSalesOrder.SONo ? objSalesOrder.SONo : '';
  this.MROId = objSalesOrder.MROId ? objSalesOrder.MROId : 0;
  this.RRId = objSalesOrder.RRId ? objSalesOrder.RRId : 0;
  this.RRNo = objSalesOrder.RRNo ? objSalesOrder.RRNo : '';
  this.CustomerId = objSalesOrder.CustomerId ? objSalesOrder.CustomerId : 0;
  this.SOType = objSalesOrder.SOType ? objSalesOrder.SOType : 0;
  this.DateRequested = objSalesOrder.DateRequested ? objSalesOrder.DateRequested : null;
  this.DueDate = objSalesOrder.DueDate ? objSalesOrder.DueDate : null;
  this.ReferenceNo = objSalesOrder.ReferenceNo ? objSalesOrder.ReferenceNo : '';
  this.CustomerPONo = objSalesOrder.CustomerPONo ? objSalesOrder.CustomerPONo : '';
  this.CustomerBlanketPOId = objSalesOrder.CustomerBlanketPOId ? objSalesOrder.CustomerBlanketPOId : 0;
  this.WarehouseId = objSalesOrder.WarehouseId ? objSalesOrder.WarehouseId : 0;
  this.ShipAddressBookId = objSalesOrder.ShipAddressBookId ? objSalesOrder.ShipAddressBookId : 0;
  this.ShipAddressId = objSalesOrder.ShipAddressId ? objSalesOrder.ShipAddressId : 0;
  this.BillAddressBookId = objSalesOrder.BillAddressBookId ? objSalesOrder.BillAddressBookId : 0;
  this.BillAddressId = objSalesOrder.BillAddressId ? objSalesOrder.BillAddressId : 0;
  this.Notes = objSalesOrder.Notes ? objSalesOrder.Notes : '';
  this.IsConvertedToPO = objSalesOrder.IsConvertedToPO ? objSalesOrder.IsConvertedToPO : 0;
  this.SubTotal = objSalesOrder.SubTotal ? objSalesOrder.SubTotal : 0;
  this.TaxPercent = objSalesOrder.TaxPercent ? objSalesOrder.TaxPercent : 0;
  this.TotalTax = objSalesOrder.TotalTax ? objSalesOrder.TotalTax : 0;
  this.Discount = objSalesOrder.Discount ? objSalesOrder.Discount : 0;
  this.AHFees = objSalesOrder.AHFees ? objSalesOrder.AHFees : 0;
  this.Shipping = objSalesOrder.Shipping ? objSalesOrder.Shipping : 0;
  this.GrandTotal = objSalesOrder.GrandTotal ? objSalesOrder.GrandTotal : 0;
  this.Status = objSalesOrder.Status ? objSalesOrder.Status : 0;
  this.Created = objSalesOrder.Created ? objSalesOrder.Created + " 10:00:00" : cDateTime.getDateTime();
  this.Modified = objSalesOrder.Modified ? objSalesOrder.Modified + " 10:00:00" : cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objSalesOrder.authuser && objSalesOrder.authuser.UserId) ? objSalesOrder.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objSalesOrder.authuser && objSalesOrder.authuser.UserId) ? objSalesOrder.authuser.UserId : TokenUserId;
  this.LeadTime = objSalesOrder.LeadTime ? objSalesOrder.LeadTime : '';
  this.WarrantyPeriod = objSalesOrder.WarrantyPeriod ? objSalesOrder.WarrantyPeriod : null;
  const TokenUserName = global.authuser.FullName ? global.authuser.FullName : '';
  this.RequestedByname = (objSalesOrder.authuser && objSalesOrder.authuser.FullName) ? objSalesOrder.authuser.FullName : TokenUserName;
  this.QuoteId = objSalesOrder.QuoteId ? objSalesOrder.QuoteId : 0;
  this.IsEmailSent = objSalesOrder.IsEmailSent ? objSalesOrder.IsEmailSent : 0;
  this.BlanketPOExcludeAmount = objSalesOrder.BlanketPOExcludeAmount ? objSalesOrder.BlanketPOExcludeAmount : 0;
  this.BlanketPONetAmount = objSalesOrder.BlanketPONetAmount ? objSalesOrder.BlanketPONetAmount : 0;

  this.LocalCurrencyCode = objSalesOrder.LocalCurrencyCode ? objSalesOrder.LocalCurrencyCode : '';
  this.ExchangeRate = objSalesOrder.ExchangeRate ? objSalesOrder.ExchangeRate : 0;
  this.BaseCurrencyCode = objSalesOrder.BaseCurrencyCode ? objSalesOrder.BaseCurrencyCode : '';
  this.BaseGrandTotal = objSalesOrder.BaseGrandTotal ? objSalesOrder.BaseGrandTotal : 0;

  this.authuser = objSalesOrder.authuser ? objSalesOrder.authuser : {};

  const TokenCreatedByLocation = global.authuser.Location ? global.authuser.Location : 0;
  this.CreatedByLocation = (objSalesOrder.authuser && objSalesOrder.authuser.Location) ? objSalesOrder.authuser.Location : TokenCreatedByLocation;

  // For Server Side Search 
  this.start = objSalesOrder.start;
  this.length = objSalesOrder.length;
  this.search = objSalesOrder.search;
  this.sortCol = objSalesOrder.sortCol;
  this.sortDir = objSalesOrder.sortDir;
  this.sortColName = objSalesOrder.sortColName;
  this.order = objSalesOrder.order;
  this.columns = objSalesOrder.columns;
  this.draw = objSalesOrder.draw;
};
SalesOrder.IsExistSOForMRO = (MROId, result) => {

  var sql = `Select SOId,Date_Format(Created,'%Y-%m-%d') Created from tbl_sales_order where IsDeleted=0 and MROId=${MROId}`;
  // console.log("upd sql" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};



SalesOrder.IsExistCustomerBlanketPOIdForRRId = (RRId, result) => {

  var sql = `Select SOId,'r' as D from tbl_sales_order where IsDeleted=0 and RRId=${RRId}`;
  //console.log("upd sql" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

SalesOrder.IsExistRRDetailForInvoiceId = (InvoiceId, result) => {
  var sql = `Select QuoteId,RRId,SOId,'r' as D from tbl_sales_order
  where IsDeleted=0 and SOId=(Select SOId from tbl_invoice where IsDeleted=0 and InvoiceId=${InvoiceId} limit 0,1)`;
  //console.log("upd sql" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

SalesOrder.GetCustomerBlanketPOIdFromSO = (SOId, result) => {
  var sql = `Select RRId,CustomerBlanketPOId,'Test' as T from tbl_sales_order  WHERE IsDeleted=0 and SOId =${SOId}`;
  //console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};

SalesOrder.Create = (SalesOrder1, result) => {
  SalesOrder1 = escapeSqlValues(SalesOrder1);
  var SO = SalesOrder1;

  var sql = `insert into tbl_sales_order(SONo,MROId,RRId,RRNo,CustomerId,SOType,DateRequested,DueDate,ReferenceNo
  ,CustomerPONo,CustomerBlanketPOId,WarehouseId,ShipAddressBookId,ShipAddressId,BillAddressBookId,BillAddressId,Notes,IsConvertedToPO
  ,SubTotal,TaxPercent,TotalTax,Discount,AHFees,Shipping,GrandTotal,BlanketPOExcludeAmount,BlanketPONetAmount,Status,Created,CreatedBy,LeadTime,WarrantyPeriod,RequestedById,RequestedByname,QuoteId,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal,CreatedByLocation) 
  values('${SO.SONo}','${SO.MROId}','${SO.RRId}','${SO.RRNo}',
    '${SO.CustomerId}','${SO.SOType}','${SO.DateRequested}',
    '${SO.DueDate}','${SO.ReferenceNo}','${SO.CustomerPONo}','${SO.CustomerBlanketPOId}',
    '${SO.WarehouseId}','${SO.ShipAddressBookId}','${SO.ShipAddressId}',
    '${SO.BillAddressBookId}','${SO.BillAddressId}','${SO.Notes}',
    '${SO.IsConvertedToPO}','${SO.SubTotal}','${SO.TaxPercent}','${SO.TotalTax}',
    '${SO.Discount}','${SO.AHFees}','${SO.Shipping}',
    '${SO.GrandTotal}','${SO.BlanketPOExcludeAmount}','${SO.BlanketPONetAmount}',
    '${SO.Status}','${SO.Created}',
    '${SO.CreatedBy}','${SO.LeadTime}',${SO.WarrantyPeriod},
    '${SO.CreatedBy}','${SO.RequestedByname}','${SO.QuoteId}','${SO.LocalCurrencyCode}','${SO.ExchangeRate}','${SO.BaseCurrencyCode}','${SO.BaseGrandTotal}','${SO.CreatedByLocation}')`;
  //  console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    result(null, { SOId: res.insertId });
    return;

  });
}

SalesOrder.update = (SalesOrder, result) => {
  var sql = `UPDATE tbl_sales_order SET  
  SOType = ?,
  DateRequested = ?,DueDate = ? ,ReferenceNo = ?,WarehouseId = ?,ShipAddressBookId = ?,   BillAddressBookId = ?,
  Notes = ? , SubTotal=?,TaxPercent=?,TotalTax=?,Discount=?,AHFees=?,
  Shipping=?,GrandTotal=?,BlanketPOExcludeAmount=?,BlanketPONetAmount=?,Status=?,Modified=?,ModifiedBy=?,LocalCurrencyCode = ?, ExchangeRate = ?,BaseCurrencyCode = ? ,BaseGrandTotal = ?
  WHERE SOId = ?`;

  var values = [
    SalesOrder.SOType, SalesOrder.DateRequested, SalesOrder.DueDate,
    SalesOrder.ReferenceNo, SalesOrder.WarehouseId, SalesOrder.ShipAddressBookId,
    SalesOrder.BillAddressBookId, SalesOrder.Notes, SalesOrder.SubTotal,
    SalesOrder.TaxPercent, SalesOrder.TotalTax, SalesOrder.Discount,
    SalesOrder.AHFees, SalesOrder.Shipping,
    SalesOrder.GrandTotal, SalesOrder.BlanketPOExcludeAmount, SalesOrder.BlanketPONetAmount, SalesOrder.Status,
    SalesOrder.Modified, SalesOrder.ModifiedBy, SalesOrder.LocalCurrencyCode, SalesOrder.ExchangeRate, SalesOrder.BaseCurrencyCode, SalesOrder.BaseGrandTotal, SalesOrder.SOId
  ]

  con.query(sql, values, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  }
  );

};

SalesOrder.checkBlanketPOPriceBoolean = (req, Id, Type, result) => {
  // console.log(req.body);
  // req.body.CustomerBlanketPOId = req.body.CustomerBlanketPOId ? req.body.CustomerBlanketPOId : 289;
  if (req.body.CustomerBlanketPOId > 0) {
    var sql = `Select poh.* from tbl_customer_blanket_po_history as poh
    WHERE poh.IsDeleted=0 AND poh.BlanketPOId = ${req.body.CustomerBlanketPOId} `;
    if (Type == "RR")
      sql += ` and RRId=${Id}`;
    else if (Type == "QUOTE")
      sql += ` and QuoteId=${Id}`;
    else if (Type == "MRO")
      sql += ` and MROId=${Id}`;
    else { }

    sql += ` order by BlanketPOHistoryId desc limit 0,1 `;
    // console.log("View History Query = " + sql)
    con.query(sql, (err, res) => {
      if (err) {
        result(null, false);
      } else {
        // console.log(res);
        var calculationAmount = parseFloat(req.body.BlanketPONetAmount) - parseFloat(res[0].Amount);
        if (parseFloat(calculationAmount) > 0 && parseFloat(calculationAmount) > parseFloat(res[0].CurrentBalance)) {
          result(null, false);
        } else {
          result(null, true);
        }
      }
    });
  } else {
    result(null, true);
  }
}

SalesOrder.UpdateNonRRAndNonMROSO = (SalesOrder, result) => {
  var sql = `UPDATE tbl_sales_order SET SubTotal=?,TaxPercent=?,TotalTax=?,Discount=?,
  AHFees=?,Shipping=?,GrandTotal=?,BlanketPOExcludeAmount=?,BlanketPONetAmount=?,Modified=?,ModifiedBy=?,LocalCurrencyCode = ?, ExchangeRate = ?,BaseCurrencyCode = ? ,BaseGrandTotal = ? WHERE SOId = ? `;
  var values = [
    SalesOrder.SubTotal, SalesOrder.TaxPercent, SalesOrder.TotalTax, SalesOrder.Discount,
    SalesOrder.AHFees, SalesOrder.Shipping, SalesOrder.GrandTotal, SalesOrder.BlanketPOExcludeAmount, SalesOrder.BlanketPONetAmount, SalesOrder.Modified, SalesOrder.ModifiedBy, SalesOrder.LocalCurrencyCode, SalesOrder.ExchangeRate, SalesOrder.BaseCurrencyCode, SalesOrder.BaseGrandTotal,
    SalesOrder.SOId
  ]
  //console.log("Update tbl_so=" + values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: SalesOrder.SOId, ...SalesOrder });
    return;
  });
};

SalesOrder.UpdateSalesOrderDueAutoUpdate = (SOId, LeadTime, result) => {
  var sql = `Update tbl_sales_order  SET DueDate = DATE_ADD(CURDATE(), INTERVAL ${LeadTime} +
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
   DAY) WHERE IsDeleted=0 and SOId='${SOId}'`;
  return sql;
};

SalesOrder.UpdateSOPOId = (POId, SOId) => {
  var sql = `Update tbl_sales_order SET POId = ${POId} WHERE IsDeleted=0 and SOId='${SOId}'`;
  return sql;
};


SalesOrder.UpdateCustomerBlanketPOIdToSO = (SalesOrder, result) => {

  var sql = `UPDATE tbl_sales_order  SET CustomerBlanketPOId=?,CustomerPONo=?  WHERE SOId = ?`;
  var values = [SalesOrder.CustomerBlanketPOId, SalesOrder.CustomerPONo, SalesOrder.SOId];
  // console.log("update status sql" + sql, values);
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, SalesOrder);
    return;
  });
};

SalesOrder.UpdateSONoById = (SalesOrder, result) => {

  var sql = `UPDATE tbl_sales_order SET SONo=CONCAT('SO',${SalesOrder.SOId})    WHERE SOId = ${SalesOrder.SOId}`;

  con.query(sql, (err, res) => {
    if (err) {

      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {

      result({ msg: "Sales Order not found" }, null);
      return;
    }


    result(null, res);
    return;
  });
};


SalesOrder.IsNonRRAndNonMRO = (SOId, result) => {

  // var sql = `Select SOId,'w' as s From tbl_sales_order WHERE SOId = ${SOId} and RRId=0 and MROId=0 `;
  var sql = `Select SOId,'w' as s From tbl_sales_order WHERE SOId = ${SOId} and MROId=0 `;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

SalesOrder.GetSODetail = (InvoiceId, result) => {
  var sql = `Select *
from tbl_sales_order s
Left Join tbl_sales_order_item si on s.SOId=si.SOId
where s.IsDeleted=0 and si.IsDeleted=0 and s.SOId=(Select SOId
from tbl_invoice where IsDeleted=0 and InvoiceId='${InvoiceId}' limit 0,1 ) `;
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

SalesOrder.UpdateSONoAndShippingIdAndBiilingId = (SalesOrder, result) => {

  var sql = `UPDATE tbl_sales_order SET SONO=CONCAT('SO',${SalesOrder.SOId})
  ,ShipAddressId=${SalesOrder.ShipAddressId},BillAddressId=${SalesOrder.BillAddressId}  
  WHERE SOId = ${SalesOrder.SOId}`;

  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {

      result({ msg: "Sales Order not found" }, null);
      return;
    }
    result(null, res);
    return;
  });
};


//To SalesOrder ExcelData
SalesOrder.ExportToExcel = (reqBody, result) => {

  var obj = new SalesOrder(reqBody);
  var Ids = ``;
  for (let val of reqBody.SalesOrder) {
    Ids += val.SOId + `,`;
  }
  var SOIds = Ids.slice(0, -1);
  var sql = `SELECT s.RRNo,s.SONo, c.CompanyName,q.QuoteNo ,s.RequestedByname,s.ApprovedByName,s.CustomerPONo,s.ReferenceNo,
  DATE_FORMAT(s.DateRequested,'%m/%d/%Y') as DateRequested,DATE_FORMAT(s.DueDate,'%m/%d/%Y') as DueDate,  
  ROUND(ifnull(s.GrandTotal,0),2) as GrandTotal ,
  CASE s.Status 
   WHEN 1 THEN '${Constants.array_sale_order_status[1]}'
   WHEN 2 THEN '${Constants.array_sale_order_status[2]}' 
   WHEN 3 THEN '${Constants.array_sale_order_status[3]}' 
   WHEN 4 THEN '${Constants.array_sale_order_status[4]}' 
   WHEN 5 THEN '${Constants.array_sale_order_status[5]}' 
   ELSE '-'	end StatusName,
   CASE s.SOType 
   WHEN 0 THEN '${Constants.array_sale_order_type[0]}'
   WHEN 1 THEN '${Constants.array_sale_order_type[1]}' 
   WHEN 2 THEN '${Constants.array_sale_order_type[2]}' 
   WHEN 3 THEN '${Constants.array_sale_order_type[3]}'
   WHEN 4 THEN '${Constants.array_sale_order_type[4]}' 
   WHEN 5 THEN '${Constants.array_sale_order_type[5]}' 
   WHEN 6 THEN '${Constants.array_sale_order_type[6]}'
   ELSE '-'	end SOTypeName
   FROM tbl_sales_order s
  LEFT JOIN tbl_quotes q on q.QuoteId=s.QuoteId
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId
  where s.IsDeleted=0  `;
  var TokenIdentityType = getLogInIdentityType(obj);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(obj);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(obj);


  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and s.CustomerId in(${MultipleCustomerIds}) `;
  }
  if (obj.RRNo != "") {
    sql += " and ( s.RRNo ='" + obj.RRNo + "' ) ";
  }
  if (obj.SONo != "") {
    sql += " and ( s.SONo ='" + obj.SONo + "' ) ";
  }
  if (obj.CustomerId != "") {
    sql += " and  s.CustomerId In(" + obj.CustomerId + ") ";
  }
  if (reqBody.hasOwnProperty("QuoteNo") == true && reqBody.QuoteNo != "") {
    sql += " and ( q.QuoteNo ='" + reqBody.QuoteNo + "' ) ";
  }
  if (reqBody.hasOwnProperty("RequestedById") == true && reqBody.RequestedById != "") {
    sql += " and ( s.RequestedById ='" + reqBody.RequestedById + "' ) ";
  }
  if (reqBody.hasOwnProperty("ApprovedById") == true && reqBody.ApprovedById != "") {
    sql += " and ( s.ApprovedById ='" + reqBody.ApprovedById + "' ) ";
  }
  if (obj.CustomerPONo != "") {
    sql += " and ( s.CustomerPONo ='" + obj.CustomerPONo + "' ) ";
  }
  if (obj.ReferenceNo != "") {
    sql += " and ( ReferenceNo ='" + obj.ReferenceNo + "' ) ";
  }
  if (obj.DateRequested != null) {
    sql += " and ( DateRequested >='" + obj.DateRequested + "' ) ";
  }
  if (reqBody.hasOwnProperty('DateRequestedTo') == true && reqBody.DateRequestedTo != "") {
    sql += " and ( s.DateRequested <='" + reqBody.DateRequestedTo + "' ) ";
  }
  if (obj.DueDate != null) {
    sql += " and ( s.DueDate >='" + obj.DueDate + "' ) ";
  }
  if (reqBody.hasOwnProperty('DueDateTo') == true && reqBody.DueDateTo != "") {
    sql += " and ( s.DueDate <='" + reqBody.DueDateTo + "' ) ";
  }
  if (obj.SOType > 0) {
    sql += " and ( s.SOType ='" + obj.SOType + "' ) ";
  }
  if (obj.Status > 0) {
    sql += " and ( Status ='" + obj.Status + "' ) ";
  }
  if (SOIds != '') {
    sql += `and s.SOId in(` + SOIds + `)`;
  }

  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, { ExcelData: res });
  });
};

SalesOrder.getSaleListByServerSide = (SalesOrder, result) => {

  var query = "";
  selectquery = "";

  var customerPortalQuery = '';

  var TokenIdentityType = getLogInIdentityType(SalesOrder);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(SalesOrder);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(SalesOrder);

  if (TokenIdentityType == 1) {
    customerPortalQuery = ` AND s.Status IN(2) AND s.CustomerId In ( ${MultipleCustomerIds}) `
  }

  selectquery = `SELECT 
  s.SOId, c.CompanyName,s.CustomerId ,DATE_FORMAT(s.DateRequested,'%m/%d/%Y') as DateRequested,s.IsEmailSent,
  s.SONo,  
  ROUND(ifnull(s.GrandTotal,0),2) as GrandTotal ,
  s.LocalCurrencyCode,s.ExchangeRate,s.BaseCurrencyCode,  
 ROUND(ifnull(s.BaseGrandTotal,0),2) as BaseGrandTotal ,
   DATE_FORMAT(s.DueDate,'%m/%d/%Y') as DueDate, DATEDIFF(s.DueDate,CURDATE()) as DueDateDiff,s.RRNo,
s.RRId,s.MROId,MRO.MRONo,s.CreatedByLocation,
  CASE s.Status 
   WHEN 1 THEN '${Constants.array_sale_order_status[1]}'
   WHEN 2 THEN '${Constants.array_sale_order_status[2]}' 
   WHEN 3 THEN '${Constants.array_sale_order_status[3]}' 
   WHEN 4 THEN '${Constants.array_sale_order_status[4]}' 
   WHEN 5 THEN '${Constants.array_sale_order_status[5]}' 
   ELSE '-'	end StatusName,s.Status,
   CASE s.SOType 
   WHEN 0 THEN '${Constants.array_sale_order_type[0]}'
   WHEN 1 THEN '${Constants.array_sale_order_type[1]}' 
   WHEN 2 THEN '${Constants.array_sale_order_type[2]}' 
   WHEN 3 THEN '${Constants.array_sale_order_type[3]}'
   WHEN 4 THEN '${Constants.array_sale_order_type[4]}' 
   WHEN 5 THEN '${Constants.array_sale_order_type[5]}' 
   WHEN 6 THEN '${Constants.array_sale_order_type[6]}'
   ELSE '-'	end SOTypeName,s.SOType,'' as DateRequestedTo,'' as DueDateTo,q.QuoteNo,
   s.RequestedById,s.RequestedByname,s.ApprovedById,s.ApprovedByName,s.CustomerPONo,s.ReferenceNo,s.IsDeleted,s.CustomerBlanketPOId,
   "-" as IsConvertedToInvoice, CUR.CurrencySymbol, c.CustomerGroupId`;



  recordfilterquery = `Select count(s.SOId) as recordsFiltered `;

  query = query + ` FROM tbl_sales_order s
   LEFT JOIN tbl_invoice i on i.SOId=s.SOId
  LEFT JOIN tbl_quotes q on q.QuoteId=s.QuoteId
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId
  LEFT JOIN tbl_mro as MRO on MRO.MROId=s.MROId
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = s.LocalCurrencyCode AND CUR.IsDeleted = 0

  Where 1=1 `;

  var CustomerId = 0;
  if (SalesOrder.CustomerId != 0) {
    CustomerId = SalesOrder.CustomerId;
    query = query + ` and s.IsDeleted=0 and s.CustomerId In (${CustomerId}) `;
  }
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    query += ` and s.CustomerId in(${MultipleCustomerIds}) `;
  }

  if (SalesOrder.search.value != '') {
    var SOTypeSearch = SalesOrder.search.value;
    switch (SalesOrder.search.value) {
      case Constants.array_sale_order_status[1]:
        SOTypeSearch = 1;
        break;
      case Constants.array_sale_order_status[2]:
        SOTypeSearch = 2;
        break;
      case Constants.array_sale_order_status[3]:
        SOTypeSearch = 3;
        break;
      case Constants.array_sale_order_status[4]:
        SOTypeSearch = 4;
        break;
    }

    query = query + ` and (  s.SONo LIKE '%${SalesOrder.search.value}%'
        or s.CustomerId LIKE '%${SalesOrder.search.value}%' 
        or s.Status LIKE '%${SalesOrder.search.value}%' 
        or s.DateRequested LIKE '%${SalesOrder.search.value}%' 
        or s.DueDate LIKE '%${SalesOrder.search.value}%'
        or s.SOType LIKE '%${SalesOrder.search.value}%'
        or s.RRNo LIKE '%${SalesOrder.search.value}%'

        or q.QuoteNo = '%${SalesOrder.search.value}%'
        or s.RequestedById = '%${SalesOrder.search.value}%'
        or s.ApprovedById = '%${SalesOrder.search.value}%'
        or s.CustomerPONo = '%${SalesOrder.search.value}%'
        or s.ReferenceNo = '%${SalesOrder.search.value}%'

      ) `;
  }

  var cvalue = 0;
  var DateRequested = ''; var DueDate = ''; var DateRequestedTo = ''; var DueDateTo = ''; var IsDeleted = -1;
  for (cvalue = 0; cvalue < SalesOrder.columns.length; cvalue++) {

    if (SalesOrder.columns[cvalue].search.value != "") {
      switch (SalesOrder.columns[cvalue].name) {
        case "IsConvertedToInvoice":
          if (SalesOrder.columns[cvalue].search.value == "1")
            query += " and ifnull(i.SOId,0) >0  ";
          if (SalesOrder.columns[cvalue].search.value == "0")
            query += " and ifnull(i.SOId,0) =0  ";
          break;
        case "DateRequested":
          DateRequested = SalesOrder.columns[cvalue].search.value;
          break;
        case "DateRequestedTo":
          DateRequestedTo = SalesOrder.columns[cvalue].search.value;
          break;
        case "DueDate":
          DueDate = SalesOrder.columns[cvalue].search.value;
          break;
        case "DueDateTo":
          DueDateTo = SalesOrder.columns[cvalue].search.value;
          break;
        case "CustomerPONo":
          query += " and ( s.CustomerPONo = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "Status":
          query += " and ( s.Status = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and  s.CustomerId In(" + SalesOrder.columns[cvalue].search.value + ") ";
          break;
        case "CompanyName":
          query += " and ( c.CompanyName LIKE '%" + SalesOrder.columns[cvalue].search.value + "%' ) ";
          break;
        case "RequestedById":
          query += " and ( s.RequestedById = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "ApprovedById":
          query += " and ( s.ApprovedById = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "RRNo":
          query += " and ( s.RRNo LIKE '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "SONo":
          query += " and ( s.SONo LIKE '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "RRId":
          query += " and ( s.RRId = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;

        case "IsDeleted":
          IsDeleted = SalesOrder.columns[cvalue].search.value;
          query += " and s.IsDeleted = '" + SalesOrder.columns[cvalue].search.value + "' ";
          break;
        case "LocalCurrencyCode":
          query += " and ( s.LocalCurrencyCode = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedByLocation":
          query += " and ( s.CreatedByLocation = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerGroupId":
          query += " and (s.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + SalesOrder.columns[cvalue].name + " IN (" + SalesOrder.columns[cvalue].search.value + "))) ";
          break;
        default:
          query += " and ( " + SalesOrder.columns[cvalue].name + " LIKE '%" + SalesOrder.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  if (IsDeleted == -1) {
    query += " and  s.IsDeleted =0 ";
  }
  if (DateRequested != '' && DateRequestedTo != '') {
    query += " and ( s.DateRequested >= '" + DateRequested + "' and s.DateRequested <= '" + DateRequestedTo + "' ) ";
  }
  else {
    if (DateRequested != '') {
      query += " and ( s.DateRequested >= '" + DateRequested + "' ) ";
    }
    if (DateRequestedTo != '') {
      query += " and ( s.DateRequested <= '" + DateRequestedTo + "' ) ";
    }
  }
  if (DueDate != '' && DueDateTo != '') {
    query += " and ( s.DueDate >= '" + DueDate + "' and s.DueDate <= '" + DueDateTo + "' ) ";
  }
  else {
    if (DueDate != '') {
      query += " and ( s.DueDate >= '" + DueDate + "' ) ";
    }
    if (DueDateTo != '') {
      query += " and ( s.DueDate <= '" + DueDateTo + "' ) ";
    }
  }


  query += customerPortalQuery;

  var i = 0;

  if (SalesOrder.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < SalesOrder.order.length; i++) {
    if (SalesOrder.order[i].column != "" || SalesOrder.order[i].column == "0")// 0 is equal to ""
    {
      switch (SalesOrder.columns[SalesOrder.order[i].column].name) {

        case "CustomerId":
          query += " s.CustomerId " + SalesOrder.order[i].dir + ",";
          break;

        case "Status":
          query += " s.Status " + SalesOrder.order[i].dir + ",";
          break;
        case "RRNo":
          query += " s.RRNo " + SalesOrder.order[i].dir + ",";
          break;
        case "SOId":
          query += " s.SOId " + SalesOrder.order[i].dir + ",";
          break;
        default://could be any column except above 
          query += " " + SalesOrder.columns[SalesOrder.order[i].column].name + " " + SalesOrder.order[i].dir + ",";

      }
    }
  }
  // console.log("before query slice =" + query);

  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  if (SalesOrder.start != "-1" && SalesOrder.length != "-1") {
    query += " LIMIT " + SalesOrder.start + "," + (SalesOrder.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(s.SOId) as TotalCount
  FROM tbl_sales_order s
  LEFT JOIN tbl_invoice i on i.SOId=s.SOId
  LEFT JOIN tbl_quotes q on q.QuoteId=s.QuoteId
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId
  where s.IsDeleted='${IsDeleted >= 0 ? IsDeleted : 0}' `;
  if (CustomerId != 0) {
    TotalCountQuery = TotalCountQuery + ` and s.CustomerId In (${CustomerId})`;
  }
  TotalCountQuery += customerPortalQuery;
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    TotalCountQuery += ` and s.CustomerId in(${MultipleCustomerIds}) `;
  }
  //console.log("query = " + query);
  //console.log("Countquery = " + Countquery);
  // console.log("TotalCountQuery = " + TotalCountQuery);

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      //console.log("TotalCount : " + results[2][0][0].TotalCount)
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: SalesOrder.draw
      });
      return;
    }
  );

};

SalesOrder.BlanketSOList = (SalesOrder, result) => {

   var TokenIdentityType = getLogInIdentityType(SalesOrder);  
  var MultipleAccessIdentityIds =  getLogInMultipleAccessIdentityIds(SalesOrder);

  var query = "";
  selectquery = "";

  var customerPortalQuery = '';
  if (TokenIdentityType== 1) {
    customerPortalQuery = ` AND s.Status IN(2) AND s.CustomerId In ( ${MultipleAccessIdentityIds}) `
  }

  // selectquery = `SELECT 
  // s.SOId, c.CompanyName,s.CustomerId ,DATE_FORMAT(s.DateRequested,'%m/%d/%Y') as DateRequested,
  // s.SONo,s.GrandTotal,s.LocalCurrencyCode,s.ExchangeRate,s.BaseCurrencyCode,s.BaseGrandTotal,s.BlanketPONetAmount,s.BlanketPOExcludeAmount,s.RRNo,s.RRId,s.MROId, i.InvoiceId,i.InvoiceNo,
  //  s.RequestedById,s.RequestedByname,s.ApprovedById,s.ApprovedByName,s.CustomerBlanketPOId,s.CustomerPONo,s.ReferenceNo,s.IsDeleted,CUR.CurrencySymbol `;

  selectquery = `SELECT
  s.SOId, c.CompanyName,s.CustomerId ,DATE_FORMAT(s.DateRequested,'%m/%d/%Y') as DateRequested,
  s.SONo,
  ROUND(ifnull(s.GrandTotal,0),2) as GrandTotal ,
  s.LocalCurrencyCode,s.ExchangeRate,s.BaseCurrencyCode, 
  ROUND(ifnull(s.BaseGrandTotal,0),2) as BaseGrandTotal ,
  ROUND(s.BlanketPONetAmount) as BlanketPONetAmount,ROUND(s.BlanketPOExcludeAmount,2) as BlanketPOExcludeAmount,s.RRNo,s.RRId,s.MROId,
  (SELECT ROUND(SUM(GrandTotal),2) FROM tbl_invoice WHERE SOId = s.SOId AND CustomerBlanketPOId=s.CustomerBlanketPOId  AND IsDeleted=0 ) as InvoiceGrandTotal,
  (ROUND((SELECT SUM(BlanketPONetAmount) FROM tbl_invoice WHERE SOId = s.SOId AND CustomerBlanketPOId=s.CustomerBlanketPOId AND Status!=${Constants.CONST_INV_STATUS_CANCELLED} AND IsDeleted=0 ),2)) as InvoiceBlanketPONetAmount,
  (SELECT GROUP_CONCAT(InvoiceNo) FROM tbl_invoice WHERE SOId = s.SOId AND CustomerBlanketPOId=s.CustomerBlanketPOId AND Status!=${Constants.CONST_INV_STATUS_CANCELLED} AND IsDeleted=0 ) as InvoiceNo,
  (SELECT GROUP_CONCAT(InvoiceId) FROM tbl_invoice WHERE SOId = s.SOId AND CustomerBlanketPOId=s.CustomerBlanketPOId AND Status!=${Constants.CONST_INV_STATUS_CANCELLED} AND IsDeleted=0 ) as InvoiceId,
  s.RequestedById,s.RequestedByname,s.ApprovedById,s.ApprovedByName,s.CustomerBlanketPOId,s.CustomerPONo,s.ReferenceNo,s.IsDeleted,CUR.CurrencySymbol`;



  recordfilterquery = `Select count(s.SOId) as recordsFiltered `;

  query = query + ` FROM tbl_sales_order s
  LEFT JOIN tbl_quotes q on q.QuoteId=s.QuoteId AND q.IsDeleted = 0 
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId
  LEFT JOIN tbl_repair_request as RR on RR.RRId=s.RRId AND  RR.IsDeleted = 0 
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = s.LocalCurrencyCode AND CUR.IsDeleted = 0
  Where s.Status!=${Constants.CONST_SO_STATUS_CANCELLED} and s.IsDeleted=0 `;

  var CustomerId = 0;
  if (SalesOrder.CustomerId != 0) {
    CustomerId = SalesOrder.CustomerId;
    query = query + `  and s.CustomerId In (${CustomerId}) `;
  }

  if (SalesOrder.CustomerBlanketPOId > 0) {
    CustomerBlanketPOId = SalesOrder.CustomerBlanketPOId;
    query = query + ` and s.CustomerBlanketPOId  = ${CustomerBlanketPOId} `;
  }

  if (SalesOrder.search.value != '') {
    var SOTypeSearch = SalesOrder.search.value;
    switch (SalesOrder.search.value) {
      case Constants.array_sale_order_status[1]:
        SOTypeSearch = 1;
        break;
      case Constants.array_sale_order_status[2]:
        SOTypeSearch = 2;
        break;
      case Constants.array_sale_order_status[3]:
        SOTypeSearch = 3;
        break;
      case Constants.array_sale_order_status[4]:
        SOTypeSearch = 4;
        break;
    }

    query = query + ` and (  SONo LIKE '%${SalesOrder.search.value}%'
        or s.CustomerId LIKE '%${SalesOrder.search.value}%' 
        or s.Status LIKE '%${SalesOrder.search.value}%' 
        or s.DateRequested LIKE '%${SalesOrder.search.value}%' 
        or s.DueDate LIKE '%${SalesOrder.search.value}%'
        or s.SOType LIKE '%${SalesOrder.search.value}%'
        or s.RRNo LIKE '%${SalesOrder.search.value}%'

        or q.QuoteNo = '%${SalesOrder.search.value}%'
        or s.RequestedById = '%${SalesOrder.search.value}%'
        or s.ApprovedById = '%${SalesOrder.search.value}%'
        or s.CustomerPONo = '%${SalesOrder.search.value}%'
        or s.ReferenceNo = '%${SalesOrder.search.value}%'

      ) `;
  }

  var cvalue = 0;
  var DateRequested = ''; var DueDate = ''; var DateRequestedTo = ''; var DueDateTo = ''; var IsDeleted = -1;
  for (cvalue = 0; cvalue < SalesOrder.columns.length; cvalue++) {

    if (SalesOrder.columns[cvalue].search.value != "") {
      switch (SalesOrder.columns[cvalue].name) {
        case "DateRequested":
          DateRequested = SalesOrder.columns[cvalue].search.value;
          break;
        case "DateRequestedTo":
          DateRequestedTo = SalesOrder.columns[cvalue].search.value;
          break;
        case "DueDate":
          DueDate = SalesOrder.columns[cvalue].search.value;
          break;
        case "DueDateTo":
          DueDateTo = SalesOrder.columns[cvalue].search.value;
          break;
        case "Status":
          query += " and ( s.Status = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerId":
          query += " and ( s.CustomerId = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;

        case "CustomerPONo":
          query += " and ( s.CustomerPONo = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;


        case "CompanyName":
          query += " and ( c.CompanyName LIKE '%" + SalesOrder.columns[cvalue].search.value + "%' ) ";
          break;

        case "RequestedById":
          query += " and ( s.RequestedById = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "ApprovedById":
          query += " and ( s.ApprovedById = '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "RRNo":
          query += " and ( s.RRNo LIKE '" + SalesOrder.columns[cvalue].search.value + "' ) ";
          break;
        case "IsDeleted":
          IsDeleted = SalesOrder.columns[cvalue].search.value;
          query += " and s.IsDeleted = '" + SalesOrder.columns[cvalue].search.value + "' ";
          break;
        default:
          query += " and ( " + SalesOrder.columns[cvalue].name + " LIKE '%" + SalesOrder.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  if (IsDeleted == -1) {
    query += " and  s.IsDeleted =0 ";
  }
  if (DateRequested != '' && DateRequestedTo != '') {
    query += " and ( s.DateRequested >= '" + DateRequested + "' and s.DateRequested <= '" + DateRequestedTo + "' ) ";
  }
  else {
    if (DateRequested != '') {
      query += " and ( s.DateRequested >= '" + DateRequested + "' ) ";
    }
    if (DateRequestedTo != '') {
      query += " and ( s.DateRequested <= '" + DateRequestedTo + "' ) ";
    }
  }
  if (DueDate != '' && DueDateTo != '') {
    query += " and ( s.DueDate >= '" + DueDate + "' and s.DueDate <= '" + DueDateTo + "' ) ";
  }
  else {
    if (DueDate != '') {
      query += " and ( s.DueDate >= '" + DueDate + "' ) ";
    }
    if (DueDateTo != '') {
      query += " and ( s.DueDate <= '" + DueDateTo + "' ) ";
    }
  }


  query += customerPortalQuery;

  var i = 0;

  if (SalesOrder.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < SalesOrder.order.length; i++) {
    if (SalesOrder.order[i].column != "" || SalesOrder.order[i].column == "0")// 0 is equal to ""
    {
      switch (SalesOrder.columns[SalesOrder.order[i].column].name) {

        case "CustomerId":
          query += " s.CustomerId " + SalesOrder.order[i].dir + ",";
          break;
        case "CustomerPONo":
          query += " s.CustomerPONo " + SalesOrder.order[i].dir + ",";
          break;
        case "Status":
          query += " s.Status " + SalesOrder.order[i].dir + ",";
          break;
        case "RRNo":
          query += " s.RRNo " + SalesOrder.order[i].dir + ",";
          break;



        default://could be any column except above 
          query += " " + SalesOrder.columns[SalesOrder.order[i].column].name + " " + SalesOrder.order[i].dir + ",";

      }
    }
  }
  // console.log("before query slice =" + query);

  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  if (SalesOrder.start != "-1" && SalesOrder.length != "-1") {
    query += " LIMIT " + SalesOrder.start + "," + (SalesOrder.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(s.SOId) as TotalCount
  FROM tbl_sales_order s
  LEFT JOIN tbl_quotes q on q.QuoteId=s.QuoteId AND q.IsDeleted = 0 
  LEFT JOIN tbl_customers c on c.CustomerId=s.CustomerId
  LEFT JOIN tbl_invoice as i on i.SOId=s.SOId AND i.IsDeleted = 0 
  where s.Status!=${Constants.CONST_SO_STATUS_CANCELLED} AND s.IsDeleted='${IsDeleted >= 0 ? IsDeleted : 0}' `;
  if (CustomerId != 0) {
    TotalCountQuery = TotalCountQuery + ` and s.CustomerId In (${CustomerId})`;
  }
  TotalCountQuery += customerPortalQuery;

  //console.log("query = " + query);
  //console.log("Countquery = " + Countquery);
  // console.log("TotalCountQuery = " + TotalCountQuery);

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      //console.log("TotalCount : " + results[2][0][0].TotalCount)
      result(null, {
        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
        recordsTotal: results[2][0][0].TotalCount, draw: SalesOrder.draw
      });
      return;
    }
  );

};

SalesOrder.findById = (reqbody, IdentityType, IsDeleted, result) => {

  var SOId = reqbody.SOId;

  IsDeleted = IsDeleted >= 0 ? IsDeleted : 0;
  var sqlSalesOrder = SalesOrder.view(SOId, IdentityType, IsDeleted,reqbody);
  con.query(sqlSalesOrder, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length > 0) {
      //var sqlSalesOrder = SalesOrder.view(SOId);
      var sqlSalesOrderItem = SalesOrderItem.view(SOId);
      var sqlGlobalCustomerReference = GlobalCustomerReference.view(Constants.CONST_IDENTITY_TYPE_SO, SOId);
      // var billingAddressQuery = OrderAddress.ViewAddressByIdentityQuery(1, Constants.CONST_IDENTITY_TYPE_SO, SOId);
      // var shippingAddressQuery = OrderAddress.ViewAddressByIdentityQuery(2, Constants.CONST_IDENTITY_TYPE_SO, SOId);
      var billingAddressQuery = Address.GetBillingAddressIdByCustomerId(res[0].CustomerId);
      // var shippingAddressQuery = Address.GetShippingAddressIdByCustomerId(res[0].CustomerId);
      var shippingAddressQuery = Address.GetShippingAddressIdByAddressId(res[0].ShipAddressBookId);

      // var shipAddressListQuery = Address.GetAddressByIdQuery(res[0].ShipAddressBookId);
      var shipAddressListQuery = Address.GetAddressByCustomerIdQuery(res[0].CustomerId)

      var sqlNotes = Notes.ViewNotes(Constants.CONST_IDENTITY_TYPE_SO, SOId);
      var sqlAttachment = AttachmentModel.ListAttachmentQuery(Constants.CONST_IDENTITY_TYPE_SO, SOId);
      var sqlCustomerAddress = Address.ViewContactAddressByCustomerId(res[0].CustomerId);
      var POIdListQuery = PurchaseOrder.ViewPONoBySOId(SOId);
      var INVIdListQuery = Invoice.ViewINVNoBySOId(SOId);
      var sqlRemitToAddress = Address.GetRemitToAddressIdByCustomerId(res[0].CustomerId);
      var sqlQuotes = Quotes.GetQuoteShipLockInfoById(res[0].QuoteId);

      var sqlRRNotes = '';
      if (res[0].RRId > 0)
        sqlRRNotes = Notes.ViewRRCustomerNotes(Constants.CONST_IDENTITY_TYPE_RR, res[0].RRId);
      else if (res[0].MROId > 0)
        sqlRRNotes = Notes.ViewRRCustomerNotes(Constants.CONST_IDENTITY_TYPE_MRO, res[0].MROId);
      else
        sqlRRNotes = "Select '-' NoRecord"
      // var sqlRRNotes = Notes.ViewRRCustomerNotes(Constants.CONST_IDENTITY_TYPE_RR, res[0].RRId);
      var sqlCustomerReference = ''; var RRId = res[0].RRId ? res[0].RRId : 0;
      if (RRId > 0)
        sqlCustomerReference = RRCustomerReference.ViewCustomerReference(res[0].RRId);
      else if (res[0].MROId > 0)
        sqlCustomerReference = RRCustomerReference.ViewMROCustomerReference(res[0].MROId);
      else
        sqlCustomerReference = "Select '-' NoRecord"

      async.parallel([
        function (result) { con.query(sqlSalesOrder, result) },
        function (result) { con.query(sqlSalesOrderItem, result) },
        function (result) { con.query(sqlGlobalCustomerReference, result) },
        function (result) { con.query(billingAddressQuery, result) },
        function (result) { con.query(shippingAddressQuery, result) },
        function (result) { con.query(sqlNotes, result) },
        function (result) { con.query(sqlAttachment, result) },
        function (result) { con.query(sqlCustomerAddress, result) },
        function (result) { con.query(sqlRRNotes, result) },
        function (result) { con.query(sqlCustomerReference, result) },
        function (result) { con.query(POIdListQuery, result) },
        function (result) { con.query(INVIdListQuery, result) },
        function (result) { con.query(sqlRemitToAddress, result) },
        function (result) { con.query(sqlQuotes, result) },
        function (result) { con.query(shipAddressListQuery, result) },

      ],

        function (err, results) {
          if (err)
            return result(err, null);


          if (results[0][0].length > 0) {
            results[0][0][0].CustomerShipIdLocked = results[13][0][0] && results[13][0][0].CustomerShipIdLocked ? results[13][0][0].CustomerShipIdLocked : 0;
            result(null, { SalesOrderInfo: results[0][0], SalesOrderItem: results[1][0], CustomerRef: results[2][0], BillingAddress: results[3][0], ShippingAddress: results[4][0], NotesList: results[5][0], AttachmentList: results[6][0], ContactAddress: results[7][0], RRNotesList: results[8][0], RRCustomerReference: results[9][0], POList: results[10][0], InvoiceList: results[11][0], RemitToAddress: results[12][0][0], ShipAddressList: results[14][0] });
            return;
          } else {
            result({ msg: "Sales Order not found" }, null);
            return;
          }
        });
    } else {
      result({ msg: "Sale Order not found" }, null);
      return;
    }
  });



};

SalesOrder.IsUsedCustomerBlanketPOId = (CustomerBlanketPOId, result) => {
  var sql = `Select CustomerBlanketPOId,'w' as d from tbl_sales_order where IsDeleted=0 and CustomerBlanketPOId='${CustomerBlanketPOId}' `;
  //console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

SalesOrder.UpdateCustomerPONoByRRId = (CustomerPONo, RRNo, result) => {
  var sql = `UPDATE tbl_sales_order SET CustomerPONo ='${CustomerPONo}'  WHERE RRNo = '${RRNo}' `;
  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "RR not_found in SO" }, null);
      return;
    }
    result(null, CustomerPONo);
    return;
  });
};

SalesOrder.view = (SOId, IdentityType, IsDeleted, reqbody) => {
  
  

  var sql = `Select SO.CustomerBlanketPOId,Q.QuoteId,Q.QuoteNo,SO.SOId,SO.SONo,SO.RRId,SO.CustomerId,SOType,DATE_FORMAT(SO.DateRequested,'%Y-%m-%d') as DateRequested,  PO.PONo,
PO.POId,DATE_FORMAT(SO.DueDate,'%Y-%m-%d') as DueDate,SO.ReferenceNo,SO.CustomerPONo,w.WarehouseId,w.WarehouseName,
SO.ShipAddressBookId,SO.ShipAddressId,SO.BillAddressBookId,SO.BillAddressId,
SO.Notes,SO.IsConvertedToPO,SO.SubTotal,SO.TaxPercent,SO.TotalTax,SO.Discount,SO.AHFees,SO.Shipping,
ROUND(ifnull(SO.GrandTotal,0),2) as GrandTotal ,
SO.LocalCurrencyCode,SO.ExchangeRate,SO.BaseCurrencyCode, 
ROUND(ifnull(SO.BaseGrandTotal,0),2) as BaseGrandTotal ,
SO.BlanketPOExcludeAmount,SO.BlanketPONetAmount,SO.IsEmailSent,
CASE SO.Status
WHEN 1 THEN '${Constants.array_sale_order_status[1]}'
WHEN 2 THEN '${Constants.array_sale_order_status[2]}' 
WHEN 3 THEN '${Constants.array_sale_order_status[3]}'
WHEN 4 THEN '${Constants.array_sale_order_status[4]}' 
WHEN 5 THEN '${Constants.array_sale_order_status[5]}' 
ELSE '-'	end StatusName, SO.Status,SO.CreatedByLocation,SOC.CountryName as CreatedByLocationName,
CASE SO.SOType 
WHEN 0 THEN '${Constants.array_sale_order_type[0]}'
WHEN 1 THEN '${Constants.array_sale_order_type[1]}'
WHEN 2 THEN '${Constants.array_sale_order_type[2]}'  
WHEN 3 THEN '${Constants.array_sale_order_type[3]}'
WHEN 4 THEN '${Constants.array_sale_order_type[4]}'
WHEN 5 THEN '${Constants.array_sale_order_type[5]}' 
WHEN 6 THEN '${Constants.array_sale_order_type[6]}'
ELSE '-'	end SOTypeName, C.CompanyName,C.CustomerCurrencyCode as CustomerCurrencyCode,C.CustomerLocation as CustomerLocation,CUR.CurrencySymbol as CustomerCurrencySymbol,CON.VatTaxPercentage,CURSO.CurrencySymbol,
RR.RRNo, RR.ShippingStatus,RR.ShippingIdentityName,
RR.ShippingIdentityType,RR.ShippingIdentityId,PartNo,SerialNo,SO.LeadTime,SO.WarrantyPeriod,
SO.RequestedById,SO.RequestedByname,SO.ApprovedById,SO.ApprovedByName,
DATE_FORMAT(SO.ApprovedDate,'%m/%d/%Y') as ApprovedDate,SO.QuoteId,RR.IsRushRepair,
case RR.IsRushRepair
WHEN 1 THEN '${Constants.array_yes_no[1]}'
WHEN 0 THEN '${Constants.array_yes_no[0]}'
ELSE '-'	end IsRushRepairName,
RR.IsWarrantyRecovery,
case RR.IsWarrantyRecovery
WHEN 1 THEN '${Constants.array_IsWarrantyRepair[1]}'
WHEN 2 THEN '${Constants.array_IsWarrantyRepair[2]}'
ELSE '-'	end IsWarrantyRecoveryName,RR.IsRepairTag,
case RR.IsRepairTag
WHEN 1 THEN '${Constants.array_yes_no[1]}'
WHEN 0 THEN '${Constants.array_yes_no[0]}'
ELSE '-'	end IsRepairTagName, RR.PartId as RepairPartId,ifnull(mro.MROId, 0) MROId,mro.MRONo,SO.IsDeleted,
CONCAT(u.FirstName,' ',u.LastName) as CreatedByName,CONCAT(u1.FirstName,' ',u1.LastName) as DeletedByName,DATE_FORMAT(u1.Modified,'%Y-%m-%d') DeletedDate,RR.CustomerInvoiceId as InvoiceId,
I.InvoiceNo,I.InvoiceId,I.IsCSVProcessed,
(SELECT ConsolidateInvoiceId FROM tbl_invoice_consolidate_detail where InvoiceId=I.InvoiceId AND IsDeleted = 0 LIMIT 1) as ConsolidateInvoiceId,
IF((SELECT ConsolidateInvoiceId FROM tbl_invoice_consolidate_detail where InvoiceId=I.InvoiceId AND IsDeleted = 0 LIMIT 1)>0, true, false) as Consolidated
From tbl_sales_order as SO
LEFT JOIN tbl_po as PO ON PO.POId = SO.POId AND PO.IsDeleted = 0
LEFT JOIN tbl_invoice as I ON I.SOId = SO.SOId AND I.IsDeleted = 0
LEFT JOIN tbl_quotes as Q ON Q.QuoteId = SO.QuoteId AND Q.IsDeleted = 0
LEFT JOIN tbl_customers as C ON C.CustomerId = SO.CustomerId
LEFT JOIN tbl_repair_request as RR ON RR.RRId = SO.RRId
LEFT JOIN tbl_warehouse as w ON w.WarehouseId = SO.WarehouseId
LEFT JOIN tbl_mro as mro ON mro.MROId = SO.MROId
LEFT JOIN tbl_users u ON u.UserId = SO.CreatedBy
LEFT JOIN tbl_users u1 ON u1.UserId = SO.ModifiedBy
LEFT JOIN tbl_currencies CURSO ON CURSO.CurrencyCode = SO.LocalCurrencyCode AND CURSO.IsDeleted = 0
LEFT JOIN tbl_currencies CUR ON CUR.CurrencyCode = C.CustomerCurrencyCode AND CUR.IsDeleted = 0
LEFT JOIN tbl_countries as CON  ON CON.CountryId = C.CustomerLocation AND CON.IsDeleted = 0
LEFT JOIN tbl_countries SOC on SOC.CountryId=SO.CreatedByLocation
where SO.IsDeleted=${IsDeleted} And SO.SOId='${SOId}' `;
  
  
    var TokenIdentityType = getLogInIdentityType(reqbody);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqbody);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(reqbody);
  var MultipleAccessIdentityIds =  getLogInMultipleAccessIdentityIds(reqbody);

  if (IdentityType == 1) {
    sql += ` and SO.CustomerId In (${MultipleAccessIdentityIds}) `;
  }
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and SO.CustomerId in(${MultipleCustomerIds}) `;
  }
  // console.log("SQLSO" + sql)
  return sql;
}

SalesOrder.viewByRRId = (RRId, SOId, result) => {
  var sql = `Select SOId,SONo,RRId,RRNo,QuoteId,CustomerId,SOType,DateRequested,DueDate,ReferenceNo,CustomerPONo,CustomerBlanketPOId,WarehouseId,ShipAddressBookId,ShipAddressId,BillAddressBookId,BillAddressId,Notes,IsConvertedToPO,SubTotal,TaxPercent,TotalTax,Discount,AHFees,Shipping,
     ROUND(ifnull(GrandTotal,0),2) as GrandTotal ,  LeadTime,WarrantyPeriod,  
  ROUND(ifnull(BlanketPOExcludeAmount,0),2) as BlanketPOExcludeAmount ,
  ROUND(ifnull(BlanketPONetAmount,0),2) as BlanketPONetAmount,   
  LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,  
 ROUND(ifnull(BaseGrandTotal,0),2) as BaseGrandTotal 
  from tbl_sales_order
  where IsDeleted = 0 AND Status!=${Constants.CONST_SO_STATUS_CANCELLED} AND  RRId=${RRId}  `;
  if (SOId > 0)
    sql += ` and SOId=${SOId > 0 ? SOId : 0} `;
  return sql;
}

SalesOrder.ValidateAlreadyExistByQuoteId = (QuoteId, result) => {
  var sql = `SELECT RRId FROM tbl_sales_order where IsDeleted=0 and QuoteId=${QuoteId} `;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    //console.log("RrId Loaded :", res);
    result(null, res);
  });
}


SalesOrder.ValidateAlreadyExistRRId = (RRId, result) => {
  var sql = `SELECT SOId,RRId FROM tbl_sales_order where IsDeleted=0  and  Status!=${Constants.CONST_SO_STATUS_CANCELLED} and RRId=${RRId} `;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    //console.log("RrId Loaded :", res);
    result(null, res);
  });
}

SalesOrder.CustomerSOListByServerSide = (SalesOrder, result) => {

  var query = "";
  selectquery = "";

  selectquery = `SELECT s.SOId,s.SONo,i.InvoiceNo,
  DATE_FORMAT(s.DateRequested,'%m/%d/%Y') as DateRequested,
  DATE_FORMAT(s.DueDate,'%m/%d/%Y') as DueDate,
  CASE s.Status 
   WHEN 1 THEN '${Constants.array_sale_order_status[1]}'
   WHEN 2 THEN '${Constants.array_sale_order_status[2]}' 
   WHEN 3 THEN '${Constants.array_sale_order_status[3]}' 
   WHEN 4 THEN '${Constants.array_sale_order_status[4]}' 
   WHEN 5 THEN '${Constants.array_sale_order_status[5]}' 
   ELSE '-'	end StatusName,s.Status `;

  recordfilterquery = `Select count(s.SOId) as recordsFiltered `;

  query = query + ` FROM tbl_sales_order s
  LEFT JOIN tbl_invoice i on i.SONo=s.SONo 
  WHERE i.IsDeleted=0 and s.IsDeleted=0  `;
  var CustomerId;

  if (SalesOrder.CustomerId != 0) {
    CustomerId = SalesOrder.CustomerId;
  }
  else { 
    CustomerId = (SalesOrder.authuser && SalesOrder.authuser.IdentityId) ? SalesOrder.authuser.IdentityId : global.authuser.IdentityId;
     
  }
  query = query + `and s.CustomerId='${CustomerId}'`;

  if (SalesOrder.search.value != '') {
    query = query + ` and (  s.SOId LIKE '%${SalesOrder.search.value}%'
        or s.SONo LIKE '%${SalesOrder.search.value}%' 
        or s.DateRequested LIKE '%${SalesOrder.search.value}%' 
        or s.DueDate LIKE '%${SalesOrder.search.value}%' 
        or i.InvoiceNo LIKE '%${SalesOrder.search.value}%'
        or s.Status LIKE '%${SalesOrder.search.value}'
      ) `;
  }

  var Countquery = recordfilterquery + query;

  if (SalesOrder.start != "-1" && SalesOrder.length != "-1") {
    query += " LIMIT " + SalesOrder.start + "," + (SalesOrder.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(s.SOId) as TotalCount 
  FROM tbl_sales_order s
  LEFT JOIN tbl_invoice i on i.SONo=s.SONo 
  WHERE i.IsDeleted=0 and s.IsDeleted=0 and s.CustomerId ='${CustomerId}' `;

  // console.log("query = " + query);
  // console.log("Countquery = " + Countquery);

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      // console.log("TotalCount : " + results[2][0][0].TotalCount)
      if (results[0][0].length > 0) {
        result(null, {
          data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
          recordsTotal: results[2][0][0].TotalCount, draw: SalesOrder.draw
        });
        return;
      }
      else {
        result(null, "No record");
        return;
      }
    }
  );

};


SalesOrder.UpdateSONoandSODueDatebySONo = (objSalesOrder, result) => {

  var sql = `Update tbl_sales_order SET DueDate='${objSalesOrder.CustomerSODueDate}' WHERE IsDeleted=0 and SONo='${objSalesOrder.CustomerSONo}'`;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { CustomerSONo: objSalesOrder.SONo });
    return;
  }
  );
};


SalesOrder.GetSalesOrderQuoteForSendEmailContent = (SO, result) => {


  var sql = `SELECT so.SOId as IdentityId,'${Constants.CONST_IDENTITY_TYPE_SO}' as IdentityType,
  REPLACE(T.Subject,'{PartNo}',si.PartNo)as Subject,REPLACE(T.Content,'{PartNo}',si.PartNo)as Content,so.SONo,tc.Email,GS.AppEmail,GS.AppCCEmail,
  so.LocalCurrencyCode,so.ExchangeRate,so.BaseCurrencyCode,
  so.BaseGrandTotal

  from tbl_sales_order so 
  LEFT JOIN tbl_sales_order_item si on si.SOId=so.SOId and si.IsDeleted=0
  LEFT JOIN tbl_customers tc on tc.CustomerId=so.CustomerId
  LEFT JOIN tbl_email_template T on T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_SALES_ORDER_QUOTE}' 
  LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
  where  so.IsDeleted=0 and so.SOId=${SO.IdentityId}`;

  //console.log("Tes :"+sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      var FollowUpObj = {
        FromEmail: res[0].AppEmail,
        ToEmail: res[0].Email,
        CC: res[0].AppCCEmail,
        Subject: res[0].Subject,
        Message: res[0].Content,
        IdentityId: res[0].IdentityId,
        IdentityType: res[0].IdentityType,
      };
      // console.log("found the Reference: ", FollowUpObj);
      result(null, FollowUpObj);
      return;
    }
    return result({ msg: "Sales Order Quote not found" }, null);
  });


}

SalesOrder.SendEmailToSalesOrderQuoteBySOList = (SOList, result) => {

  for (let val of SOList) {
    var EmailTemplate = '';
    if (val.RRId)
      EmailTemplate = Constants.CONST_EMAIL_TEMPLETE_TYPE_SALES_ORDER_QUOTE
    if (val.MROId)
      EmailTemplate = Constants.CONST_EMAIL_TEMPLETE_TYPE_MRO_SALES_ORDER_QUOTE

    var sql = `SELECT REPLACE(T.Subject,'{PartNo}',si.PartNo)as Subject,REPLACE(T.Content,'{PartNo}',si.PartNo)as Content,so.SONo,tc.Email ,GS.AppEmail,GS.AppCCEmail
  from tbl_sales_order so 
  LEFT JOIN tbl_sales_order_item si on si.SOId=so.SOId and si.IsDeleted=0
  LEFT JOIN tbl_customers tc on tc.CustomerId=so.CustomerId
  LEFT JOIN tbl_email_template T on T.TemplateType ='${EmailTemplate}'
   LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
  where so.IsDeleted=0 and so.SOId=${val.SOId}`;

    // console.log("val " + sql);
    con.query(sql, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length > 0 && res[0].Email != "" && res[0].Email != null) {
        let HelperOptions = {
          from: res[0].AppEmail,
          to: res[0].Email,
          subject: res[0].Subject,
          text: res[0].Content
        };
        gmailTransport.sendMail(HelperOptions, (error, info) => {

          if (error) {
            result(error, null);
          }
          if (!error) {
            var sql = SalesOrder.UpdateIsEmailSent(val.SOId);
            // console.log("sql=" + sql)
            con.query(sql, (err, res) => {
              if (err) {
                return result(err, null);
              }
            });
          }
        });
      }
    });
  }
  return result(null, SOList);
};

SalesOrder.UpdateIsEmailSent = (SOId) => {
  var sql = `Update tbl_sales_order SET IsEmailSent='1' WHERE IsDeleted=0 and SOId='${SOId}'`;
  return sql;
}

SalesOrder.ApproveSO = (SalesOrder, result) => {

  var sql = ``;

  sql = `UPDATE tbl_sales_order SET ApprovedById = ?,ApprovedByName = ?,
  ApprovedDate = ?,Status = ?,Modified = ?,ModifiedBy = ? WHERE SOId = ?`;
  var values = [
    SalesOrder.CreatedBy, SalesOrder.RequestedByname,
    SalesOrder.Created, Constants.CONST_SO_STATUS_APPROVED,
    SalesOrder.Modified, SalesOrder.ModifiedBy, SalesOrder.SOId
  ]
  //console.log(sql, values)
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: SalesOrder.SOId, ...SalesOrder });
  }
  );
};

SalesOrder.CancelSO = (SO, result) => {

  var sql = `UPDATE tbl_sales_order SET Status = ?,Modified = ?,ModifiedBy = ? WHERE SOId = ?`;
  var values = [
    Constants.CONST_SO_STATUS_CANCELLED,
    SO.Modified, SO.ModifiedBy, SO.SOId
  ]
  var soid = SO.SOId;
  // Constants.CONST_INV_STATUS_CANCELLED
  async.parallel([
    function (result) { SalesOrder.removeInvoiceBySOId(soid, 'SO Canceled!', 'cancel', result) },
    function (result) { con.query(sql, values, result) },
    // function (result) { if (Obj.RRId > 0) { con.query(UpdateRR, result) } else { result(null, null) } }
  ],
    function (err, results) {
      if (err) {
        result(err, null)
      }
      if (results[1][0].affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: SO.SOId, ...SalesOrder });
    });
};

// SalesOrder.CancelSO = (SalesOrder, result) => {

//   var sql = `UPDATE tbl_sales_order SET Status = ?,Modified = ?,ModifiedBy = ? WHERE SOId = ?`;
//   var values = [
//     Constants.CONST_SO_STATUS_CANCELLED,
//     SalesOrder.Modified, SalesOrder.ModifiedBy, SalesOrder.SOId
//   ]
//   console.log(sql, values)
//   con.query(sql, values, (err, res) => {
//     if (err) {
//       result(err, null);
//       return;
//     }
//     if (res.affectedRows == 0) {
//       result({ kind: "not_found" }, null);
//       return;
//     }
//     result(null, { id: SalesOrder.SOId, ...SalesOrder });
//   }
//   );
// };



SalesOrder.UpdateIsConvertedToPOBySOId = (SOId, result) => {

  var SO = new SalesOrder({ SOId: SOId });
  var sql = ``;

  sql = `UPDATE tbl_sales_order SET IsConvertedToPO = ?,Modified = ?,ModifiedBy = ? WHERE SOId = ?`;
  var values = [1, SO.Modified, SO.ModifiedBy, SO.SOId]
  con.query(sql, values, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: SOId });
  }
  );
};

SalesOrder.DeleteSalesOrderByRRQuery = (RRId, result) => {
  var SOId = 0;
  var sql = SalesOrder.viewByRRId(RRId, SOId, result);
  con.query(sql, (err, data) => {
    //  console.log("data");
    //  console.log(data);
    if (data && data.length > 0) {
      data.forEach(SOLIST => {
        var so = new SalesOrder(SOLIST);
        // so.SOId = SOLIST.SOId;
        //  console.log(so);
        SalesOrder.remove(so, 'RR Deleted', result);
      });
      // console.log("looping...");

    } else {
      return result(null, RRId);
      // console.log("else...");
    }

  }, function (err) {
    // console.log("over looping...");
    if (err) {
      return result(err, null);
    }
    return result(null, RRId);
  });

}

SalesOrder.DeleteSalesOrderByMROQuery = (MROId, result) => {
  var sql = SalesOrder.viewByMROId(MROId, result);
  con.query(sql, (err, data) => {
    // console.log("data");
    //  console.log(data);
    if (data.length > 0) {
      data.forEach(SOLIST => {
        var so = new SalesOrder(SOLIST);
        // so.SOId = SOLIST.SOId;
        // console.log(so);
        SalesOrder.remove(so, 'MRO Deleted!', result);
      });
      // console.log("looping...");

    } else {
      return result(null, MROId);
      // console.log("else...");
    }

  }, function (err) {
    if (err) {
      return result(err, null);
    }
    return result(null, MROId);
  });

}

SalesOrder.remove = (Obj, comments, result) => {
  // console.log("from RR");
  var DeleteSO = `Update tbl_sales_order set IsDeleted=1,Modified='${cDateTime.getDateTime()}',
  ModifiedBy = '${global.authuser.UserId}' WHERE SOId = ${Obj.SOId}`;
  var UpdateRR = `Update tbl_repair_request set CustomerSOId=0,CustomerSONo='',CustomerSODueDate=null WHERE RRId = ${Obj.RRId}`;
  var soid = Obj.SOId;
  async.parallel([
    function (result) { SalesOrder.removeInvoiceBySOId(soid, comments, 'remove', result) },
    function (result) { con.query(DeleteSO, result) },
    function (result) { if (Obj.RRId > 0) { con.query(UpdateRR, result) } else { result(null, null) } }
  ],
    function (err, results) {
      if (err) {
        result(err, null)
      }
      return result(null, results);
    });
};

SalesOrder.emptyFunction = (parse, result) => {
  result(null, { empty: 1 });
  return;
};

SalesOrder.removeInvoiceBySOId = (SOId, comments, actionType, result) => {
  SalesOrder.GetTypeBySO(SOId, (err, data) => {
    //console.log(data[0]);
    if (data && data.length > 0) {
      var bpoPayload = {
        QuoteId: data[0].QuoteId,
        CustomerPONo: "",
        BlanketPONetAmount: data[0].BlanketPONetAmount,
        Comments: comments,
        LocalCurrencyCode: data[0].LocalCurrencyCode,
        ExchangeRate: data[0].ExchangeRate,
        BaseCurrencyCode: data[0].BaseCurrencyCode,
        CustomerBlanketPOId: data[0].CustomerBlanketPOId
      };
      // console.log(bpoPayload);
      if ((data[0].Type === "RR" || data[0].Type === "MRO" || data[0].Type === "QT")) {
        if (actionType === 'cancel') {
          // var sql = `Update tbl_invoice set IsDeleted=1,Modified='${cDateTime.getDateTime()}',ModifiedBy='${global.authuser.UserId}' WHERE SOId = ${SOId}`;
          var sql = `UPDATE tbl_invoice SET Status=${Constants.CONST_INV_STATUS_CANCELLED}, Modified='${cDateTime.getDateTime()}',ModifiedBy='${global.authuser.UserId}' WHERE SOId = ${SOId}`;
        } else {
          var sql = `Update tbl_invoice set IsDeleted=1,Modified='${cDateTime.getDateTime()}',ModifiedBy='${global.authuser.UserId}' WHERE SOId = ${SOId}`;
        }

        if (data[0].Type == "RR") {
          bpoPayload.RRId = data[0].ID;
          var reset_rr = `UPDATE tbl_repair_request SET CustomerInvoiceId = 0,CustomerInvoiceNo='',CustomerInvoiceDueDate=null,ModifiedBy='${global.authuser.UserId}',Modified='${cDateTime.getDateTime()}' WHERE RRId = ${data[0].ID}`;
        } else {
          bpoPayload.MROId = data[0].ID;
          var reset_rr = `UPDATE tbl_mro SET CustomerInvoiceId = 0,CustomerInvoiceNo='',CustomerInvoiceDueDate=null,ModifiedBy='${global.authuser.UserId}',Modified='${cDateTime.getDateTime()}' WHERE MROId = ${data[0].ID}`;
        }
        //console.log(SOId);
        async.parallel([
          function (result) { con.query(sql, SOId, result) },
          function (result) { if (data[0].Type != "QT" || actionType != 'cancel') { con.query(reset_rr, result) } else { SalesOrder.emptyFunction(bpoPayload, result) } },
          function (result) { if (data[0].CustomerBlanketPOId > 0) { SalesOrder.updateBlanketPoDetailsOnDelete(bpoPayload, result) } else { SalesOrder.emptyFunction(bpoPayload, result) } }

        ],
          function (err, results) {

            // console.log(err, results);
            if (err)
              return result(err, null);

            return result(null, results[0][0]);
          }
        );
      }
    }
  });
};

SalesOrder.DeleteSalesOrderQuery = (RRId) => {
  var Obj = new SalesOrder({ RRId: RRId });
  var sql = `UPDATE tbl_sales_order SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE IsDeleted = 0 AND RRId>0 AND RRId=${Obj.RRId}`;
  //console.log(sql)
  return sql;
}
//
SalesOrder.UpdateTaxPercent = (Taxpercent, SOId, result) => {
  var sql = ` UPDATE tbl_sales_order SET TaxPercent='${Taxpercent}' WHERE SOId=${SOId} `;
  // console.log("sql=" + sql)
  return sql;
}
SalesOrder.UpdateAfterSOItemDeleteBySOId = (ObjModel, result) => {

  var Obj = new SalesOrder(ObjModel);
  var sql = `Update  tbl_sales_order set SubTotal=?,GrandTotal=?,BaseGrandTotal=?,Modified=?,ModifiedBy=?,BlanketPONetAmount=?,BlanketPOExcludeAmount=?  where SOId=? `;
  var values = [Obj.SubTotal, Obj.GrandTotal, Obj.BaseGrandTotal, Obj.Modified, Obj.ModifiedBy, Obj.BlanketPONetAmount, Obj.BlanketPOExcludeAmount, Obj.SOId];
  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });

};


//Global Search
SalesOrder.findInColumns = (searchQuery, result) => {

  const { from, size, query } = searchQuery;
  let { IdentityType, MultipleAccessIdentityIds, IsRestrictedCustomerAccess, MultipleCustomerIds } = global.authuser;
  var sql = ` SELECT 'ahoms-sales-order' as _index,
  S.SOId as soid, S.SONo as sono, C.CustomerId as customerid, C.CustomerCode as customercode, C.CompanyName as companyname
  FROM tbl_sales_order as S
  LEFT JOIN tbl_customers as C ON S.CustomerId = C.CustomerId
  where
  (
	  S.SONo like '%${query.multi_match.query}%' or
    C.CustomerCode like '%${query.multi_match.query}%' or
    C.FirstName like '%${query.multi_match.query}%' or
    C.LastName like '%${query.multi_match.query}%' or
    C.Email like '%${query.multi_match.query}%' or
    C.CompanyName like '%${query.multi_match.query}%' or
    C.PriorityNotes like '%${query.multi_match.query}%'
  ) and S.IsDeleted=0
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND S.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size}`;

  var countSql = `SELECT count(*) AS totalCount 
  FROM tbl_sales_order as S
  LEFT JOIN tbl_customers as C ON S.CustomerId = C.CustomerId
  where
  (
	  S.SONo like '%${query.multi_match.query}%' or
    C.CustomerCode like '%${query.multi_match.query}%' or
    C.FirstName like '%${query.multi_match.query}%' or
    C.LastName like '%${query.multi_match.query}%' or
    C.Email like '%${query.multi_match.query}%' or
    C.CompanyName like '%${query.multi_match.query}%' or
    C.PriorityNotes like '%${query.multi_match.query}%'
  ) and C.IsDeleted=0
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? ` AND S.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  `


  //console.log("" + sql)
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
        return result(null, { totalCount: { "_index": "ahoms-sales-order", val: totalCount }, data: res });
      });
    } else {
      return result(null, []);
    }

  });
}
SalesOrder.SaveCustomerPoNo = (obj) => {
  var sql = `Update tbl_sales_order SET  CustomerPONo='${obj.CustomerPONo}',
  Modified='${obj.Modified}',ModifiedBy='${obj.ModifiedBy}' WHERE IsDeleted=0 and SOId=${obj.SOId} `;
  //console.log("SaveCustomerPoNo =" + sql)
  return sql;
}


SalesOrder.UpdateBlanketPONetAmtAndExcludeAmt = (BlanketPONetAmount, BlanketPOExcludeAmount, SOId) => {
  BlanketPONetAmount = parseFloat(BlanketPONetAmount).toFixed(2);
  BlanketPOExcludeAmount = parseFloat(BlanketPOExcludeAmount).toFixed(2)
  var sql = `UPDATE tbl_sales_order s 
SET BlanketPONetAmount =${BlanketPONetAmount},
BlanketPOExcludeAmount =${BlanketPOExcludeAmount}  WHERE s.IsDeleted=0 and s.SOId=${SOId} `;
  //console.log("UpdateBlanketPONetAmtAndExcludeAmt =" + sql);
  return sql;
}


SalesOrder.GetBlanketPONetAmountAndExcludeAmt = (SOId) => {
  var sql = `SELECT (Select ifnull(SUM(Price),0) From tbl_sales_order_item where IsDeleted=0 
and IsExcludeFromBlanketPO = 1 and SOId =${SOId}) as BlanketPOExcludeAmount,
((SubTotal + TotalTax + AHFees + Shipping) - Discount) - (Select ifnull(SUM(Price),0) From tbl_sales_order_item where IsDeleted=0 
and IsExcludeFromBlanketPO = 1 and SOId =${SOId}) as BlanketPONetAmount
FROM tbl_sales_order
where SOId =${SOId} ; `;
  // console.log("GetBlanketPONetAmountAndExcludeAmt =" + sql);
  return sql;
}

SalesOrder.UpdatePOIdByRRId = (POId, RRId, result) => {

  var sql = `UPDATE tbl_sales_order SET POId=${POId} WHERE IsDeleted = 0 AND RRId = ${RRId};`;
  // console.log(sql)
  con.query(sql, (err, res) => {
    if (err) {
      // result(err, null);
      // return;
    }
    // if (res.affectedRows == 0) {
    //   result({ msg: "Sales Order not found" }, null);
    //   return;
    // }
    return result(null, res);
  });
};

// AAB

SalesOrder.addToExclude = (val, result) => {
  var SOSql = `SELECT * FROM tbl_sales_order where IsDeleted=0 and SOId=${val.SOId}`;
  var SOISql = `SELECT * FROM tbl_sales_order_item where   IsDeleted=0 and SOItemId=${val.SOItemId}`;
  con.query(SOSql, (err1, res1) => {
    if (err1) {
      result(err1, null);
      return;
    } else {
      con.query(SOISql, (err2, res2) => {
        if (err2) {
          result(err2, null);
          return;
        } else {
          // var Obj = new SalesOrder();
          var BPOEA = res1[0].BlanketPOExcludeAmount;
          var BPONA = res1[0].BlanketPONetAmount;
          var itemPrice = res2[0].Price;
          var BPOEA_UA = BPOEA + itemPrice;
          var BPONA_UA = BPONA - itemPrice;
          // console.log(res1[0]);
          //console.log(res2[0]);
          var sql = `Update  tbl_sales_order set BlanketPONetAmount=?,BlanketPOExcludeAmount=? where SOId=? `;
          var sql_in = `Update  tbl_invoice set BlanketPONetAmount=?,BlanketPOExcludeAmount=? where SOId=? `;
          var values = [BPONA_UA, BPOEA_UA, val.SOId];
          con.query(sql, values, (err1, res1) => {
            con.query(sql_in, values, (err, res) => {
              //  console.log(res);

              if (err) {
                console.log(err);
                result(err, null);
                return;
              }
              result(null, res);
              return;
            });
          });
        }
      });
    }

  });

};

SalesOrder.removeFromExclude = (val, result) => {
  var SOSql = `SELECT * FROM tbl_sales_order where IsDeleted=0 and SOId=${val.SOId}`;
  var SOISql = `SELECT * FROM tbl_sales_order_item where  IsDeleted=0 and SOItemId=${val.SOItemId}`;
  con.query(SOSql, (err1, res1) => {
    if (err1) {
      result(err1, null);
      return;
    } else {
      con.query(SOISql, (err2, res2) => {
        if (err2) {
          result(err2, null);
          return;
        } else {
          // console.log(res1[0]);
          // console.log(res2[0]);
          // var Obj = new SalesOrder();
          var BPOEA = res1[0].BlanketPOExcludeAmount;
          var BPONA = res1[0].BlanketPONetAmount;
          var itemPrice = res2[0].Price;
          var BPOEA_UA = BPOEA - itemPrice;
          var BPONA_UA = BPONA + itemPrice;
          // console.log(BPOEA_UA);
          //console.log(BPONA_UA);
          var sql = `Update  tbl_sales_order set BlanketPONetAmount=?,BlanketPOExcludeAmount=? where SOId=? `;
          var sql_in = `Update  tbl_invoice set BlanketPONetAmount=?,BlanketPOExcludeAmount=? where SOId=? `;
          var values = [BPONA_UA, BPOEA_UA, val.SOId];
          // con.query(sql, values, (err, res) => {
          //   // con.query(sql_in, values);
          //   console.log(res);
          //   if (err) {
          //     result(err, null);
          //     return;
          //   }
          //   result(null, res);
          //   return;
          // });
          con.query(sql, values, (err1, res1) => {
            con.query(sql_in, values, (err, res) => {
              //  console.log(res);
              if (err) {
                console.log(err);
                result(err, null);
                return;
              }
              result(null, res);
              return;
            });
          });
        }
      });
    }

  });
};

// AAB

SalesOrder.UpdatePOLineItemPrice = (val, result) => {
  var Price = (val.GrandTotal / val.Quantity);
  var sql = `UPDATE tbl_po_item SET Price=ROUND(${Price},2), Rate = ${val.GrandTotal}  WHERE IsDeleted = 0 AND POItemId = ${val.POItemId};`;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    return result(null, res);
  });
  // result(null, null);
};

SalesOrder.GetTypeBySO = (SOId, result) => {
  var sql = `Select Case when s.RRId>0 then s.RRId
  when s.MROId>0 then s.MROId
  else s.QuoteId
  end as ID,
  Case when s.RRId>0 then 'RR'
  when s.MROId>0 then "MRO"
  else "QT"
  end as Type,s.CustomerBlanketPOId,s.CustomerPONo,s.BlanketPONetAmount,s.QuoteId,s.LocalCurrencyCode,s.ExchangeRate,s.BaseCurrencyCode
  FROM tbl_sales_order s
  where s.SOId=${SOId}`;
  // where s.IsDeleted = 0 AND  s.SOId=${SOId}`;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    return result(null, res);
  });
}

SalesOrder.UpdatePOLineItemPriceQuery = (reqBody, result) => {
  /*
SELECT PO.POId, POI.POItemId, POI.Quantity, PO.PONo, PO.GrandTotal, ROUND(SUM(POI.Price),2) + PO.TotalTax + PO.Shipping FROM  tbl_po as PO
LEFT JOIN tbl_po_item as POI ON POI.POId = PO.POId AND POI.IsDeleted = 0
WHERE  PO.IsDeleted = 0 GROUP BY PO.POId LIMIT 0,25000;

SELECT SO.SOId, SOI.SOItemId, SOI.Quantity, SO.SONo, SO.GrandTotal, ROUND(SUM(SOI.Price),2)  FROM  tbl_sales_order as SO
LEFT JOIN tbl_sales_order_item as SOI ON SO.SOId = SOI.SOId AND SOI.IsDeleted = 0
WHERE  SO.IsDeleted = 0 GROUP BY SO.SOId LIMIT 0,25000;

  */

  var sql = `SELECT POI.POId,POI.POItemId,POI.Quantity, 
ROUND(ifnull(POI.Price,0),2) as Price ,
ROUND(ifnull(POI.Rate,0),2) as Rate ,
ROUND(ifnull(POI.BaseRate,0),2) as BaseRate ,
ROUND(ifnull(POI.BaseTax,0),2) as BaseTax ,
ROUND(ifnull(PO.GrandTotal,0),2) as GrandTotal


  FROM  tbl_po_item as POI
  LEFT JOIN tbl_po as PO ON PO.POId = POI.POId
  WHERE POI.POItemId IN(18493,18497,18503,18520,18534,18539,18548,18549,18550,18560,18565,18576,18583,18597,18604,18620,18640,18666,18667,18668,18671,18674,18684,18689,18690,18694,18696,18697,18699,18700,18701,18711,18714,18715,18729,18730,18732,18741,18762,18764,18783,18784,18786,18792,18800,18801,18803,18806,18807,18808,18811,18812,18813,18814,18815,18816,18817,18818,18819,18820,18822,18824,18825,18826,18828,18829,18830,18831,18832,18833,18834,18835,18836,18837,18838,18839,18840,18841,18842,18843,18844,18845,18846,18847,18848,18849,18850,18851,18852,18853,18854,18855,18856,18857,18858,18859,18860,18861,18862,18863,18865,18866,18867,18868,18869,18870,18871,18872,18873,18874,18875,18876,18877,18878,18879,18880,18881,18882,18883,18884,18885,18886,18887,18888,18889,18890,18891,18892,18893,18894,18895,18896,18897,18898,18899,18900,18902,18905,18906,18907,18908,18909,18910,18914,18915,18916,18917,18918,18919,18920,18921,18923,18924,18925,18926,18927,18928,18929,18930,18931,18932,18933,18935,18936,18937,18938,18939,18940,18941,18942,18943,18944,18945,18946,18947,18948,18949,18950,18952,18953,18954,18955,18956,18957,18958,18959,18960,18962,18963,18965,18967,18968,18969,18970,18971,18972,18973,18974,18975,18976,18977,18978,18979,18981,18982,18983,18984,18985,18986,18987,18988,18989,18990,18991,18992,18993,18994,18995,18996,18997,18998,18999,19000,19002,19003,19004,19005,19006,19007,19008,19009,19010,19011,19012,19013,19014,19015,19016,19017,19018,19019,19020,19021,19022,19023,19024,19025,19027,19028,19029,19030,19031,19032,19034,19035,19036,19037,19038,19039,19040,19041,19042,19043,19044,19045,19046,19047,19049,19050,19051,19053,19054,19055,19056,19057,19058,19059,19060,19061,19062,19063,19064,19065,19066,19067,19068,19069,19070,19071,19072,19073,19074,19075,19076,19077,19079,19080,19081,19082,19083,19084,19085,19086,19087,19088,19089,19090,19091,19092,19093,19094,19095,19096,19097,19098,19099,19100,19101,19102,19103,19104,19105,19106,19107,19108,19109,19110,19111,19113,19114,19115,19116,19117,19118,19119,19120,19121,19122,19123,19124,19125,19126,19127,19128,19129,19130,19131,NULL,19137,19138,19139,19140,19141,19144,19145,19146,19148,19150,19159,19184,19187,19195,19199,19216,19227,19228,19243,19250,19251,19258,19261,19262,19263,19264,19281,19297,19298,19299,19304,19308,19312,19313,19314,19315,19316,19328,19332,19333,19335,19336,19337,19338,19343,19344,19368,19371,19372,19373,19374,19386,19387,19388,19389,19390,19391,19392,19393,19399,19401,19402,19410,19416,19417,19431,19432,19436,19443,19444,19445,19449,19450,19452,19468,19469,19470,19471,19472,19477,19478,19485,19519,19520,19523,19540,19549,19550,19561,19572,19627,19628,19629,19633,19635,19636,19637,19638,19652,19680,19681,19682,19683,19684,19685,19686,19688,19690,19691,19692,19697,19700,19701,19702,19707,19718,19724,19725,19751,19752,19757,19771,19791,19799,19800,19817,19825,19826,19827,19838,19839,19841,19844,19845,19847,19850,19851,19855,19867,19873,19879,19882,19925,19962,19963,19964,19966,19974,19975,19976,19977,19990,20015,20016,20039,20041,20042,20047,20050,20064,20104,20136,20160,20162,20176,20177,20178,20273,20350,20372,20373,20374,20375,20376,20377,20378,20410,20411,20427,20430,20476,20519,20525,20588,20599,20642,20718,20720,20739,20756,20758,20761,20771,20812,20813,20814,20815,20816,20817,20819,20820,20821,20822,20823,20824,20825,20827,20828,20829,20842,20870,20871,20872,20873,20874,20875,20876,20877,20878,20879,20880,20881,20882,20883,20884,20885,20886,20887,20888,20890,20893,20894,20895,20896,20897,20898,20899,20900,20901,20902,20903,20904,20905,20906,20907,20908,20909,20910,20911,20912,20913,20914,20915,20916,20917,20918,20919,20920,20922,20923,20924,20925,20926,20927,20928,20929,20930,20931,20932,20933,20934,20935,20936,20937,20938,20939,20940,20942,20943,20944,20945,20946,20947,20948,20949,20950,20951,20952,20953,20954,20955,20956,20958,20959,20960,20961,20962,20963,20964,20965,20966,20967,20968,20969,20970,20971,20972,20973,20974,20975,20976,20977,20978,20979,20980,20981,20982,20983,20984,20985,20987,20988,20989,20990,20991,20992,20993,20994,20995,20996,20997,20998,20999,21000,21001,21002,21003,21004,21005,21006,21007,21008,21009,21010,21011,21012,21013,21014,21016,21017,21018,21019,21020,21021,21022,21023,21024,21025,21026,21027,21028,21029,21030,21031,21032,21033,21034,21035,21036,21037,21038,21039,21040,21041,21042,21043,21044,21045,21047,21048,21049,21050,21051,21052,21053,21054,21055,21056,21057,21058,21059,21060,21061,21062,21065,21066,21067,21068,21069,21070,21071,21072,21073,21074,21075,21076,21077,21078,21079,21080,21081,21082,21083,21084,21085,21086,21087,21088,21089,21090,21091,21092,21093,21094,21095,21096,21097,21098,21099,21100,21101,21102,21103,21107,21108,21109,21110,21111,21112,21113,21114,21115,21116,21117,21118,21119,21120,21121,21122,21123,21124,21125,21126,21127,21128,21129,21130,21131,21132,21133,21136,21137,21138,21139,21140,21141,21142,21143,21144,21145,21146,21149,21150,21151,21152,21153,21154,21155,21156,21157,21158,21159,21160,21161,21162,21163,21164,21165,21166,21167,21168,21169,21170,21171,21172,21173,21174,21175,21176,21177,21180,21181,21182,21185,21186,21188,21189,21190,21191,21192,21193,21194,21195,21196,21197,21198,21199,21200,21201,21202,21203,21204,21205,21206,21207,21208,21209,21210,21211,21212,21213,21214,21215,21216,21217,21218,21219,21220,21221,21222,21223,21224,21225,21226,21227,21228,21229,21230,21231,21232,21233,21234,21235,21236,21237,21238,21239,21240,21241,21242,21244,21245,21246,21247,21249,21253,21254,21255,21256,21259,21260,21261,21262,21263,21264,21265,21266,21267,21268,21269,21270,21272,21273,21274,21275,21276,21277,21278,21279,21280,21287,21291,21297,21300,21302,21305,21306,21307,21316,21317,21318,21319,21320,21321,21411,21417);`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};



SalesOrder.LinkSOPOListQuery = (reqBody, result) => {
  //to check duplicates
  //SELECT count(*) as count, POId, RRId FROM ahoms.tbl_po WHERE IsDeleted = 0 GROUP BY RRId;
  //100154 and 100148

  //POItem Id is missing in SO  
  /*SELECT DISTINCT SO.RRId, RR.RRNo FROM
  ahoms.tbl_sales_order_item as SOI
  LEFT JOIN tbl_sales_order as SO on SO.SOId = SOI.SOId
  left JOIN tbl_repair_request as RR ON RR.RRId = SO.RRId
  WHERE SOI.POItemId = 0 AND SO.RRId > 0 AND SOI.IsDeleted = 0 AND RR.IsDeleted = 0 AND SO.IsDeleted = 0;*/



  //SOItem Id is missing in PO  
  /*SELECT DISTINCT PO.RRId, RR.RRNo FROM
  ahoms.tbl_po_item as POI
  LEFT JOIN tbl_po as PO on PO.POId = POI.POId
  left JOIN tbl_repair_request as RR ON RR.RRId = PO.RRId
  WHERE POI.SOItemId = 0 AND PO.RRId > 0 AND POI.IsDeleted = 0 AND RR.IsDeleted = 0 AND PO.IsDeleted = 0;*/

  //Invocie line item missing


  var sql = `SELECT distinct PO.POId,SO.SOId,PO.RRId FROM 
  tbl_po as PO 
  LEFT JOIN  tbl_sales_order as SO ON SO.RRId = PO.RRId AND SO.Status!=3 AND SO.IsDeleted = 0
  LEFT JOIN tbl_repair_request as RR ON PO.RRId = RR.RRId  AND PO.Status!=5 AND RR.IsDeleted = 0
  WHERE PO.IsDeleted = 0 AND   SO.IsDeleted = 0   AND RR.RRId>0 AND ( PO.SOId = 0  OR SO.POId = 0 );`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

SalesOrder.LinkSOPOLineItemListQuery = (reqBody, result) => {

  //duplicate check
  /*
  SELECT distinct PO.POId,PI.POItemId,SO.SOId,SOI.SOItemId,PO.RRId, Count(PI.POItemId) as count FROM
              tbl_po as PO
              LEFT JOIN  tbl_po_item as PI ON PI.POId = PO.POId
              LEFT JOIN  tbl_sales_order as SO ON SO.RRId = PO.RRId
              LEFT JOIN tbl_sales_order_item as SOI ON SOI.SOId = SO.SOId AND SOI.PartId = PI.PartId
              WHERE PO.IsDeleted = 0 AND PI.IsDeleted = 0 AND SO.IsDeleted = 0 AND SOI.IsDeleted = 0 AND PO.RRId>0 GROUP BY POItemId ;

              100154 and 100148 and 100648


    //without part match
  */

  /* To clean the DB
  UPDATE ahoms.tbl_sales_order_item SET  IsDeleted = 1, Modified = NOW() WHERE IsDeleted = 0 AND SOId IN (SELECT SOId From tbl_sales_order WHERE IsDeleted = 1)
  UPDATE ahoms.tbl_po_item SET  IsDeleted = 1, Modified = NOW() WHERE IsDeleted = 0 AND POId IN (SELECT POId From tbl_po WHERE IsDeleted = 1)
  */

  var sql = `SELECT distinct PO.POId,PI.POItemId,SO.SOId,SOI.SOItemId,PO.RRId FROM 
            tbl_po as PO 
            LEFT JOIN  tbl_po_item as PI ON PI.POId = PO.POId AND PI.IsDeleted = 0 
            LEFT JOIN  tbl_sales_order as SO ON SO.RRId = PO.RRId  AND SO.Status!=3  AND SO.IsDeleted = 0 
            LEFT JOIN tbl_sales_order_item as SOI ON SOI.SOId = SO.SOId AND SOI.PartId = PI.PartId AND SOI.IsDeleted = 0
            WHERE PO.IsDeleted = 0 AND PI.IsDeleted = 0   AND SO.IsDeleted = 0
            AND SOI.IsDeleted = 0 AND PO.RRId>0  AND PO.Status!=5 AND (PI.SOItemId = 0 OR SOI.POItemId=0);`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

SalesOrder.LinkInvoiceSOLineItemListQuery = (reqBody, result) => {

  var sql = `SELECT distinct IV.RRId,IV.RRNo,II.InvoiceItemId,II.InvoiceId,SOI.SOItemId,SO.SOId FROM 
tbl_invoice_item as II 
LEFT JOIN  tbl_invoice as IV ON IV.InvoiceId = II.InvoiceId AND IV.IsDeleted = 0
LEFT JOIN  tbl_sales_order as SO ON SO.RRId = IV.RRId AND SO.IsDeleted = 0 
LEFT JOIN tbl_sales_order_item as SOI ON SOI.SOId = SO.SOId AND SOI.PartId = II.PartId AND SOI.IsDeleted=0
LEFT JOIN tbl_repair_request as RR ON RR.RRId = IV.RRId AND RR.IsDeleted = 0 
WHERE II.IsDeleted = 0  AND (II.SOId = 0 OR II.SOItemId = 0 ) AND RR.IsDeleted = 0  AND IV.IsDeleted = 0 AND SO.IsDeleted = 0 AND SOI.IsDeleted = 0 AND IV.RRId>0 ;`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

SalesOrder.LinkVendorBillPOQuery = (reqBody, result) => {

  var sql = `SELECT VI.VendorInvoiceId,VI.POId as VIPOID, PO.POId as POId  FROM ahoms.tbl_vendor_invoice as VI 
LEFT JOIN tbl_po as PO  ON PO.RRId = VI.RRId AND PO.PONo = VI.PONo   AND PO.IsDeleted = 0 
WHERE VI.POId = 0 AND VI.RRId>0 AND VI.IsDeleted = 0  LIMIT 0,500;`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};
SalesOrder.LinkVendorBillPO = (val, result) => {
  var query1 = `UPDATE tbl_vendor_invoice SET POId=${val.POId}  WHERE IsDeleted = 0 AND VendorInvoiceId = ${val.VendorInvoiceId};`;
  // console.log(query1);
  async.parallel([
    function (result) { con.query(query1, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, results[0]);
      return;
    }
  );
};



SalesOrder.LinkSOPOUpdateQuery = (val, result) => {
  var query1 = `UPDATE tbl_sales_order SET POId=${val.POId} WHERE IsDeleted = 0 AND SOId = ${val.SOId};`;
  var query2 = `UPDATE tbl_po SET SOId=${val.SOId} WHERE IsDeleted = 0 AND POId = ${val.POId};`;
  // console.log(query1);
  // console.log(query2);
  async.parallel([
    function (result) { con.query(query1, result) },
    function (result) { con.query(query2, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, results[0]);
      return;
    }
  );
};

SalesOrder.LinkSOPOLineItemUpdateQuery = (val, result) => {
  var query1 = `UPDATE tbl_sales_order_item SET POItemId=${val.POItemId} WHERE IsDeleted = 0 AND SOItemId = ${val.SOItemId};`;
  var query2 = `UPDATE tbl_po_item SET SOId=${val.SOId} , SOItemId=${val.SOItemId} WHERE IsDeleted = 0 AND POItemId = ${val.POItemId};`;
  // console.log(query1);
  //console.log(query2);
  async.parallel([
    function (result) { con.query(query1, result) },
    function (result) { con.query(query2, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, results[0]);
      return;
    }
  );
};

SalesOrder.LinkInvoiceSOLineItemUpdateQuery = (val, result) => {
  var query1 = `UPDATE tbl_invoice_item SET SOId=${val.SOId} , SOItemId=${val.SOItemId} WHERE IsDeleted = 0 AND InvoiceItemId = ${val.InvoiceItemId};`;
  // console.log(query1);
  async.parallel([
    function (result) { con.query(query1, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, results[0]);
      return;
    }
  );
};



SalesOrder.LinkSOQuote = (val, result) => {
  var query1 = `UPDATE tbl_sales_order SET QuoteId=${val.QuoteId}   WHERE IsDeleted = 0 AND SOId = ${val.SOId};`;
  // console.log(query1);
  async.parallel([
    function (result) { con.query(query1, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, results[0]);
      return;
    }
  );
};

SalesOrder.LinkVendorItemToPO = (val, result) => {
  var query1 = `UPDATE tbl_vendor_invoice_item SET POId=${val.POId} ,  PONo='${val.PONo}', POItemId=${val.POItemId} WHERE IsDeleted = 0 AND VendorInvoiceItemId = ${val.VendorInvoiceItemId};`;
  // console.log(query1);
  async.parallel([
    function (result) { con.query(query1, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, results[0]);
      return;
    }
  );
};

SalesOrder.LinkSOItemQuoteItem = (val, result) => {
  var query1 = `UPDATE tbl_sales_order_item SET QuoteItemId=${val.QuoteItemId}  WHERE IsDeleted = 0 AND SOItemId = ${val.SOItemId};`;
  //console.log(query1);
  async.parallel([
    function (result) { con.query(query1, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      result(null, results[0]);
      return;
    }
  );
};


SalesOrder.UpdatePOItemIdBySOItemId = (POItemId, resSoobj, result) => {

  var sql = `UPDATE tbl_sales_order_item SET POItemId=${POItemId} WHERE SOItemId = ${resSoobj.SOItemId}`;

  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    // if (res.affectedRows == 0) {
    //   result({ msg: "SOItemId not found" }, null);
    //   return;
    // }
    if (resSoobj.isLastItem == true) {
      var s = 0;
    }
    res.resSoobj = resSoobj;
    return result(null, res);
  });
};


SalesOrder.UpdateSOItemIdByPOItemId = (SOId, SOItemId, RESPOOBJ, result) => {

  var sql = `UPDATE tbl_po_item SET SOId=${SOId} , SOItemId=${SOItemId} WHERE IsDeleted = 0 AND POItemId = ${RESPOOBJ.POItemId};`;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      //  result(err, null);
      // return;
    }
    // if (res.affectedRows == 0) {
    //   result({ msg: "POItemId not found" }, null);
    //   return;
    // }
    if (RESPOOBJ.isLastItem == true) {
      var s = 0;
    }
    res.RESPOOBJ = RESPOOBJ;
    return result(null, res);
  });
};



SalesOrder.GetPOIdlist = (reqBody, result) => {

  var sql = `SELECT ifnull(PO.POId,0) POId,ifnull(SO.SOId,0) SOId,ifnull(SO.RRId,0) RRId  
  FROM tbl_sales_order as SO
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = SO.RRId
  LEFT JOIN tbl_po as PO ON PO.RRId = SO.RRId  
  where RR.IsDeleted = 0 AND PO.IsDeleted = 0 AND SO.IsDeleted=0 AND SO.RRId > 0 AND SO.POId = 0 `;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};

SalesOrder.GetSOIdlist = (reqBody, result) => {

  var sql = ` 
  SELECT ifnull(PO.POId,0) POId,ifnull(SO.SOId,0) SOId,ifnull(SO.RRId,0) RRId  
  FROM  tbl_po as PO
  LEFT JOIN tbl_repair_request as RR ON RR.RRId = PO.RRId
  LEFT JOIN tbl_sales_order as SO ON SO.RRId = PO.RRId
  where RR.IsDeleted = 0 AND PO.IsDeleted = 0 AND SO.IsDeleted=0 AND PO.RRId > 0 AND PO.SOId = 0 
  `;
  //console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });
};


SalesOrder.UpdateSOIdByRRId = (SOId, RRId, result) => {

  var sql_po = `UPDATE tbl_po SET SOId=${SOId} WHERE IsDeleted = 0 AND RRId = ${RRId};`;
  // console.log(sql_po);
  con.query(sql_po, (err, res) => {
    if (err) {
      //result(err, null);
      // return;
    }
    // if (res.affectedRows == 0) {
    //   result({ msg: "PO not found" }, null);
    //   return;
    // }
    return result(null, res);
  });
};



SalesOrder.UpdatePOItemIdInSO = (val, result) => {

  var sql_po = `UPDATE tbl_sales_order_item SET POItemId=${val.POItemId} WHERE IsDeleted = 0 AND SOItemId = ${val.SOItemId};`;
  //console.log(sql_po);
  con.query(sql_po, (err, res) => {
    if (err) {
      console.log(err);
    }
    return result(null, res);
  });
};


















//Below are for MRO :
SalesOrder.CustomerInvoiceDetails = (MROId, result) => {
  return `Select  InvoiceId,Quantity,InvoiceNo,sh.*
  from tbl_mro_shipping_history sh
  Left Join tbl_invoice i on sh.MROShippingHistoryId=i.MROShippingHistoryId AND i.IsDeleted = 0 
  where i.InvoiceId IS NOT NULL AND sh.IsDeleted=0 and ShipFromId=5 and sh.MROId=${MROId} `;
  //console.log(sql)
  //return sql;
}
SalesOrder.GetPartIdBySO = (SOId, result) => {
  var sql = `Select GROUP_CONCAT(si.PartId) as PartIds FROM tbl_sales_order s
  Left Join tbl_sales_order_item si on si.SOId=s.SOId  AND si.IsDeleted = 0 
  where s.IsDeleted = 0 AND  s.SOId=${SOId}  `;
  return sql;
}
SalesOrder.GetSaleOrder = (MROId, PartId, result) => {
  var sql = `Select s.SOId,si.SOItemId,si.PartId
from tbl_sales_order_item si
Left Join tbl_sales_order s on si.SOId=s.SOId 
where si.IsDeleted=0 and s.IsDeleted=0 and MROId=${MROId} and PartId In(${PartId})  `;
  //console.log(sql);
  return sql;
}
SalesOrder.ValidateAlreadyExistMROForQuoteId = (QuoteId, result) => {
  var sql = `SELECT MROId FROM tbl_sales_order where IsDeleted=0 and QuoteId=${QuoteId} `;
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    //console.log("RrId Loaded :", res);
    result(null, res);
  });
}
SalesOrder.viewByMROId = (MROId, result) => {
  return `Select CustomerBlanketPOId,BlanketPOExcludeAmount,BlanketPONetAmount,SOId,SONo,RRId,MROId,RRNo,CustomerId,SOType,DateRequested,DueDate,ReferenceNo,CustomerPONo,WarehouseId,ShipAddressBookId,ShipAddressId,BillAddressBookId,BillAddressId,Notes,IsConvertedToPO,SubTotal,TaxPercent,TotalTax,Discount,AHFees,Shipping,GrandTotal,LeadTime,WarrantyPeriod,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal from tbl_sales_order where IsDeleted = 0 AND  MROId=${MROId}`;
}
SalesOrder.viewBySOId = (SOId, result) => {
  return `Select CustomerBlanketPOId,BlanketPOExcludeAmount,BlanketPONetAmount,SOId,SONo,RRId,MROId,RRNo,CustomerId,SOType,DateRequested,DueDate,ReferenceNo,CustomerPONo,WarehouseId,ShipAddressBookId,ShipAddressId,BillAddressBookId,BillAddressId,Notes,IsConvertedToPO,SubTotal,TaxPercent,TotalTax,Discount,AHFees,Shipping,GrandTotal,LeadTime,WarrantyPeriod,LocalCurrencyCode,ExchangeRate,BaseCurrencyCode,BaseGrandTotal from tbl_sales_order where IsDeleted = 0 AND  SOId=${SOId}`;

}
SalesOrder.DeleteMROSalesOrderQuery = (MROId) => {
  var Obj = new SalesOrder({ MROId: MROId });
  var sql = `UPDATE tbl_sales_order SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE MROId=${Obj.MROId}`;
  return sql;
}
SalesOrder.GetRate = (SOItemId) => {
  var sql = `SELECT Rate
  FROM tbl_sales_order s
  Left Join tbl_sales_order_item si Using(SOId) where s.IsDeleted=0 and si.IsDeleted=0  and si.SOItemId='${SOItemId}' `
  //console.log(sql);
  return sql;
};
SalesOrder.GetMROSalesOrderQuoteForSendEmailContent = (SO, result) => {


  var sql = `SELECT so.SOId as IdentityId,'${Constants.CONST_IDENTITY_TYPE_SO}' as IdentityType,T.Subject,
  T.Content,so.SONo,tc.Email,GS.AppEmail,GS.AppCCEmail
  from tbl_sales_order so 
  LEFT JOIN tbl_customers tc on tc.CustomerId=so.CustomerId
  LEFT JOIN tbl_email_template T on T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_MRO_SALES_ORDER_QUOTE}' 
  LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
  where so.SOId=${SO.IdentityId}`;

  //console.log("Tes :" + sql);
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      var FollowUpObj = {
        FromEmail: res[0].AppEmail,
        ToEmail: res[0].Email,
        CC: res[0].AppCCEmail,
        Subject: res[0].Subject,
        Message: res[0].Content,
        IdentityId: res[0].IdentityId,
        IdentityType: res[0].IdentityType,
      };
      result(null, FollowUpObj);
      return;
    }
    return result({ msg: "Sales Order Quote not found" }, null);
  });
}

// SalesOrder.SendEmailToMROSalesOrderQuoteBySOList = (SOList, result) => {

//   for (let val of SOList) {
//     var sql = ``;
//     sql = `SELECT T.Subject,T.Content,so.SONo,tc.Email ,GS.AppEmail,GS.AppCCEmail
//   from tbl_sales_order so 
//   LEFT JOIN tbl_customers tc on tc.CustomerId=so.CustomerId
//   LEFT JOIN tbl_email_template T on T.TemplateType ='${Constants.CONST_EMAIL_TEMPLETE_TYPE_MRO_SALES_ORDER_QUOTE}' 
//    LEFT JOIN tbl_settings_general as GS ON GS.SettingsId = 1
//   where so.SOId=${val.SOId}`;

//     //console.log("val " + sql);
//     con.query(sql, (err, res) => {
//       if (err) {
//         result(err, null);
//         return;
//       }

//       if (res.length > 0 && res[0].Email != "" && res[0].Email != null) {
//         let HelperOptions = {
//           from: res[0].AppEmail,
//           to: res[0].Email,
//           subject: res[0].Subject,
//           text: res[0].Content
//         };
//         gmailTransport.sendMail(HelperOptions, (error, info) => {

//           if (error) {
//             result(error, null);
//           }
//           if (!error) {
//             var sql = SalesOrder.UpdateIsEmailSent(val.SOId);
//             // console.log("sql=" + sql)
//             con.query(sql, (err, res) => {
//               if (err) {
//                 return result(err, null);
//               }
//             });
//           }
//         });
//       }
//     });
//   }
//   return result(null, SOList);
// };

SalesOrder.updateBlanketPoDetailsOnDelete = (parse, result) => {
  //console.log(parse.CustomerBlanketPOId);
  if (parse.CustomerBlanketPOId > 0) {
    async.parallel([
      function (result) { CustomerBlanketPOModel.GetCurrentBalance(parse.CustomerBlanketPOId, result); },
    ], function (err, results) {
      if (err)
        Reqresponse.printResponse(res, err, null);
      else {
        var _CustomerBlanketPOId = parse.CustomerBlanketPOId > 0 ? parse.CustomerBlanketPOId : 0;
        var CurrentBalance = results[0].length > 0 ? results[0][0].CurrentBalance : 0;
        var boolean = parseFloat(parse.BlanketPONetAmount) <= parseFloat(CurrentBalance) ? true : false;
        if (boolean) {
          CustomerBlanketPOModel.GetCurrentBalance(_CustomerBlanketPOId, (err, data) => {
            if (err) {
              Reqresponse.printResponse(res, err, null);
            }
            if (data.length > 0) {
              var RefundHistoryObj = new CustomerBlanketPOHistoryModel({
                BlanketPOId: _CustomerBlanketPOId,
                RRId: parse.RRId ? parse.RRId : 0,
                MROId: parse.MROId ? parse.MROId : 0,
                PaymentType: 1,
                Amount: parseFloat(parse.BlanketPONetAmount),
                CurrentBalance: parseFloat(data[0].CurrentBalance) + parseFloat(parse.BlanketPONetAmount),
                QuoteId: parse.QuoteId,
                Comments: parse.Comments,
                LocalCurrencyCode: parse.LocalCurrencyCode ? parse.LocalCurrencyCode : 'USD',
                ExchangeRate: parse.ExchangeRate ? parse.ExchangeRate : 1,
                BaseCurrencyCode: parse.BaseCurrencyCode ? parse.BaseCurrencyCode : 'USD',
                BaseAmount: parseFloat(parse.BlanketPONetAmount) * parseFloat(parse.ExchangeRate ? parse.ExchangeRate : 1),
                BaseCurrentBalance: (parseFloat(data[0].CurrentBalance) + parseFloat(parse.BlanketPONetAmount)) * parseFloat(parse.ExchangeRate ? parse.ExchangeRate : 1)
              });
              //console.log(RefundHistoryObj);

              async.parallel([
                function (result) { CustomerBlanketPOHistoryModel.Create(RefundHistoryObj, result); },
                function (result) { CustomerBlanketPOModel.Refund(_CustomerBlanketPOId, parse.BlanketPONetAmount, result); },
              ],
                function (err, results) {
                  if (err) {
                    result(err, null);
                  } else {
                    result(err, results);
                  }
                });
            }
          });
        }
      }
    });
  }
};

module.exports = SalesOrder;

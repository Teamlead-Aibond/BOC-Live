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
const ConsolidateDetailModel = require("../models/consolidate.detail.model");
const Address = require("../models/customeraddress.model.js");
const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");

const ConsolidateModel = function (obj) {
  this.ConsolidateInvoiceId = obj.ConsolidateInvoiceId ? obj.ConsolidateInvoiceId : 0;
  this.CInvoiceNo = obj.CInvoiceNo ? obj.CInvoiceNo : '';
  this.CustomerId = obj.CustomerId ? obj.CustomerId : 0;
  this.CustomerBlanketPOId = obj.CustomerBlanketPOId ? obj.CustomerBlanketPOId : 0;
  this.CustomerPONo = obj.CustomerPONo ? obj.CustomerPONo : '';
  this.ConsolidateDetail = obj.ConsolidateDetail ? obj.ConsolidateDetail : '';
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  this.authuser = obj.authuser ? obj.authuser : {};
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
  this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};
//To create
ConsolidateModel.create = (objModel, result) => {
  // console.log(objModel.ConsolidateDetail);
  var arrayInvoiceId = getFields(objModel.ConsolidateDetail, "InvoiceId");
  var check = "SELECT COUNT(*) as count FROM tbl_invoice_consolidate_detail WHERE IsDeleted=0 AND InvoiceId in (" + arrayInvoiceId + ")";
  con.query(check, (checkErr, checkRes) => {
    if (checkRes[0].count === 0) {
      var sql = `insert into tbl_invoice_consolidate(CInvoiceNo,CustomerId,CustomerBlanketPOId,CustomerPONo,Created,CreatedBy)
        values(?,?,?,?,?,?)`;
      var values = [
        objModel.CInvoiceNo, objModel.CustomerId, objModel.CustomerBlanketPOId, objModel.CustomerPONo, objModel.Created, objModel.CreatedBy]

      con.query(sql, values, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        result(null, { id: res.insertId, ...objModel });
      });
    } else {
      result({ message: "Invoice already exists in the consolidated invoice." }, null);
    }
  });
};

//To update
ConsolidateModel.update = (objModel, result) => {
  var sql = `UPDATE tbl_invoice_consolidate SET CustomerId=?,CustomerBlanketPOId=?,CustomerPONo=?,Modified=?,ModifiedBy=? WHERE ConsolidateInvoiceId = ? `;
  var values = [
    objModel.CustomerId, objModel.CustomerBlanketPOId, objModel.CustomerPONo, objModel.Modified, objModel.ModifiedBy, objModel.ConsolidateInvoiceId
  ]
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    return result(null, { id: objModel.ConsolidateInvoiceId, ...objModel });
  }
  );
};

//To view
ConsolidateModel.view = (objModel, result) => {
  // c.CustomerCurrencyCode as CustomerCurrencyCode,c.CustomerLocation as CustomerLocation
  var sql = `SELECT ic.ConsolidateInvoiceId,ic.CInvoiceNo,ic.CustomerId,ic.CustomerBlanketPOId,ic.CustomerPONo,DATE_FORMAT(ic.Created,'%m/%d/%Y') as Created,c.CompanyName,ic.CreatedBy,CONCAT(u.FirstName,' ',u.LastName) as CreatedByName,
  (SELECT GROUP_CONCAT(InvoiceNo) FROM tbl_invoice_consolidate_detail WHERE ConsolidateInvoiceId = ic.ConsolidateInvoiceId AND IsDeleted=0 ) as InvoiceNo, 
  (SELECT GROUP_CONCAT(InvoiceId) FROM tbl_invoice_consolidate_detail WHERE ConsolidateInvoiceId = ic.ConsolidateInvoiceId AND IsDeleted=0 ) as InvoiceId 
  FROM tbl_invoice_consolidate  as ic
  LEFT JOIN tbl_customers c on ic.CustomerId=c.CustomerId
  LEFT JOIN tbl_users u on ic.CreatedBy=u.UserId
  where ic.IsDeleted=0 and ic.ConsolidateInvoiceId='${objModel.ConsolidateInvoiceId}' `;
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);

    return result(null, res);
  });
}

ConsolidateModel.findById = (payload, result) => {

  async.parallel([
    function (result) { ConsolidateModel.view(new ConsolidateModel(payload), result) },
    function (result) { ConsolidateDetailModel.view(payload, result); },
    function (result) { ConsolidateDetailModel.viewSum(payload, result); },
    function (result) { ConsolidateDetailModel.viewItem(payload, result); },
  ],
    function (err, results) {
      if (err) { return result(err, null); }
      if (results[0].length > 0) {
        var sqlContactAddress = Address.ViewContactAddressByCustomerId(results[0][0].CustomerId);
        var sqlBillingAddress = Address.GetBillingAddressIdByCustomerId(results[0][0].CustomerId);
        var sqlShippingAddress = Address.GetShippingAddressIdByCustomerId(results[0][0].CustomerId);
        var sqlAHBillingAddress = Address.listquery(Constants.CONST_IDENTITY_TYPE_VENDOR, Constants.AH_GROUP_VENDOR_ID, 2);
        var sqlRemitToAddress = Address.GetRemitToAddressIdByCustomerId(results[0][0].CustomerId);
        async.parallel([
          function (result) { con.query(sqlContactAddress, result); },
          function (result) { con.query(sqlBillingAddress, result); },
          function (result) { con.query(sqlShippingAddress, result); },
          function (result) { con.query(sqlAHBillingAddress, result); },
          function (result) { con.query(sqlRemitToAddress, result); },
        ], function (err, results1) {
          var combineList = Object.assign(results[0][0], results[2][0]);
          var data = {
            Consolidate: combineList, ConsolidateDetail: results[1], ConsolidateDetailItem: results[3],
            ContactAddressInfo: results1[0][0], BillingAddressInfo: results1[1][0],
            AHBillingAddress: results1[3][0], ShippingAddressInfo: results1[2][0], RemitToAddress: results1[4][0][0]
          }
          return result(null, data);
        });
      } else {
        return result({ message: "Something went wrong!" }, null);
      }
    });
}

//To list
ConsolidateModel.list = (obj, result) => {


  var TokenIdentityType = getLogInIdentityType(obj);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(obj);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(obj);


  var query = "";
  var selectquery = `Select ic.ConsolidateInvoiceId, ic.CInvoiceNo, ic.CustomerId, ic.CustomerBlanketPOId,ic.CustomerPONo, DATE_FORMAT(ic.Created,'%m/%d/%Y') as Created, ic.CreatedBy, c.CompanyName,CONCAT(u.FirstName,' ',u.LastName) as CreatedByName,
    (SELECT GROUP_CONCAT(InvoiceNo) FROM tbl_invoice_consolidate_detail WHERE ConsolidateInvoiceId = ic.ConsolidateInvoiceId AND IsDeleted=0 ) as InvoiceNo, 
  (SELECT GROUP_CONCAT(InvoiceId) FROM tbl_invoice_consolidate_detail WHERE ConsolidateInvoiceId = ic.ConsolidateInvoiceId AND IsDeleted=0 ) as InvoiceId, c.CustomerGroupId `;

  recordfilterquery = `Select count(ic.ConsolidateInvoiceId) as recordsFiltered `;

  // query = query + ` From tbl_invoice_consolidate ic
  // Left Join tbl_invoice_consolidate_detail icd on icd.ConsolidateInvoiceId=ic.ConsolidateInvoiceId
  // Left Join tbl_customers c on c.CustomerId=ic.CustomerId
  // LEFT JOIN tbl_users u on ic.CreatedBy=u.UserId
  // where ic.IsDeleted=0 `;
  query = query + ` From tbl_invoice_consolidate_detail icd
    Left Join tbl_invoice_consolidate ic on icd.ConsolidateInvoiceId=ic.ConsolidateInvoiceId
    Left Join tbl_customers c on c.CustomerId=ic.CustomerId
    LEFT JOIN tbl_users u on ic.CreatedBy=u.UserId
    where ic.IsDeleted=0 `;
  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    query += ` and ic.CustomerId in(${MultipleCustomerIds}) `;
  }
  if (obj.search.value != '') {
    query = query + ` and (  ic.CustomerPONo LIKE '%${obj.search.value}%'
    or ic.CInvoiceNo LIKE '%${obj.search.value}%'
    or ic.CustomerId LIKE '%${obj.search.value}%'
    or ic.CustomerBlanketPOId LIKE '%${obj.search.value}%'
    or ic.CustomerPONo LIKE '%${obj.search.value}%'
    or c.CompanyName LIKE '%${obj.search.value}%'
    or icd.InvoiceId LIKE '%${obj.search.value}%'
    or icd.InvoiceNo LIKE '%${obj.search.value}%'
    or ic.Created LIKE '%${obj.search.value}%'
  ) `;
  }

  var cvalue = 0;
  for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {

    if (obj.columns[cvalue].search.value != "") {
      switch (obj.columns[cvalue].name) {
        case "CustomerId":
          query += " and ic.CustomerId In (" + obj.columns[cvalue].search.value + ") ";
          // query += " and ( ic.CustomerId='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerPONo":
          query += " and ( ic.CustomerPONo LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
          break;
        case "CInvoiceNo":
          query += " and ( ic.CInvoiceNo='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerBlanketPOId":
          query += " and ( ic.CustomerBlanketPOId='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "InvoiceId":
          query += " and ( icd.InvoiceId='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "InvoiceNo":
          query += " and ( icd.InvoiceNo='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "Created":
          query += " and ( DATE(ic.Created) ='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CreatedBy":
          query += " and ( ic.CreatedBy='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "ConsolidateInvoiceId":
          query += " and ( ic.ConsolidateInvoiceId='" + obj.columns[cvalue].search.value + "' ) ";
          break;
        case "CustomerGroupId":
          query += " and (ic.CustomerId IN(SELECT CustomerId FROM tbl_customers  WHERE " + obj.columns[cvalue].name + " IN (" + obj.columns[cvalue].search.value + "))) ";
          break;
        default:
          query += " and ( " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  var i = 0;
  query += " group by icd.ConsolidateInvoiceId ";
  if (obj.order.length > 0) {
    query += " ORDER BY ";
  }

  for (i = 0; i < obj.order.length; i++) {

    if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
    {
      switch (obj.columns[obj.order[i].column].name) {

        case "CustomerId":
          query += " ic.CustomerId " + obj.order[i].dir + ",";
          break;
        case "CustomerPONo":
          query += " ic.CustomerPONo " + obj.order[i].dir + ",";
          break;
        case "CInvoiceNo":
          query += " ic.CInvoiceNo " + obj.order[i].dir + ",";
          break;
        case "CustomerBlanketPOId":
          query += " ic.CustomerBlanketPOId " + obj.order[i].dir + ",";
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

  var TotalCountQuery = `Select count(ConsolidateInvoiceId) as TotalCount
    From tbl_invoice_consolidate ic
    Left Join tbl_customers c on c.CustomerId=ic.CustomerId
    where ic.IsDeleted=0 `;
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

//To remove
ConsolidateModel.remove = (id, result) => {
  var sql = `UPDATE tbl_invoice_consolidate SET IsDeleted = 1 WHERE ConsolidateInvoiceId = ${id}`;
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0) {
      return result({ msg: "Consolidate Invoice not deleted" }, null);
    }
    if (res.affectedRows > 0) {
      var sqlDetail = `UPDATE tbl_invoice_consolidate_detail SET IsDeleted = 1 WHERE ConsolidateInvoiceId = ${id}`;
      con.query(sqlDetail, (errDetail, resDetail) => {
      });
    }
    return result(null, res);
  });
};
// 
ConsolidateModel.UpdateCInvoiceNoById = (objModel) => {
  var Obj = new ConsolidateModel({
    ConsolidateInvoiceId: objModel.ConsolidateInvoiceId
  });
  var sql = `UPDATE tbl_invoice_consolidate SET CInvoiceNo=CONCAT('CINV',${Obj.ConsolidateInvoiceId})  WHERE ConsolidateInvoiceId=${Obj.ConsolidateInvoiceId}`;
  // console.log("UpdateInvoiceNoById=" + sql);
  return sql;
};
// 
ConsolidateModel.getInvoiceSearchListByServerSide = (Invoice, result) => {

  var query = "";
  selectquery = "";
  selectquery = `SELECT i.InvoiceId,
  c.CompanyName,i.CustomerId ,DATE_FORMAT(i.InvoiceDate,'%m/%d/%Y') as InvoiceDate,  DATE_FORMAT(i.DueDate,'%m/%d/%Y') as DueDate,
  DATEDIFF(i.DueDate,CURDATE()) as DueDateDiff, i.IsEmailSent,i.InvoiceNo,i.RRNo,i.RRId,i.MROId,MRO.MRONo,
  i.LocalCurrencyCode,i.ExchangeRate,i.BaseCurrencyCode,i.BaseGrandTotal,i.CreatedByLocation,CONCAT(CUR.CurrencySymbol,' ', FORMAT(ROUND(ifnull(i.GrandTotal,0),2),2)) as GrandTotal,
  CASE i.InvoiceType
   WHEN 0 THEN '${Constants.array_invoice_type[0]}'
   WHEN 2 THEN '${Constants.array_invoice_type[2]}'
   WHEN 3 THEN '${Constants.array_invoice_type[3]}'
   ELSE '-'	end InvoiceTypeName,i.InvoiceType,
  CASE i.Status
   WHEN 0 THEN '${Constants.array_invoice_status[0]}'
   WHEN 1 THEN '${Constants.array_invoice_status[1]}'
   WHEN 2 THEN '${Constants.array_invoice_status[2]}'
   WHEN 3 THEN '${Constants.array_invoice_status[3]}'
   WHEN 4 THEN '${Constants.array_invoice_status[4]}'
   WHEN 5 THEN '${Constants.array_invoice_status[5]}'
   WHEN 6 THEN '${Constants.array_invoice_status[6]}'
   WHEN 7 THEN '${Constants.array_invoice_status[7]}'
   WHEN 8 THEN '${Constants.array_invoice_status[8]}'
   ELSE '-'	end StatusName,
   CASE i.Status
   WHEN 2 THEN 1
   ELSE 0	end IsApproved,
   (SELECT ConsolidateInvoiceId FROM tbl_invoice_consolidate_detail where InvoiceId=i.InvoiceId AND IsDeleted = 0 LIMIT 1) as ConsolidateInvoiceId,
   IF((SELECT ConsolidateInvoiceId FROM tbl_invoice_consolidate_detail where InvoiceId=i.InvoiceId AND IsDeleted = 0 LIMIT 1)>0, true, false) as Consolidated,
   i.Status,'' as InvoiceDateTo,'' as DueDateTo,i.CustomerPONo,i.IsCSVProcessed,'' CustomerInvoiceApproved,i.CustomerBlanketPOId,
   '' VendorBillApproved,i.IsDeleted,'' VendorBillCreated,Q.QuoteId,Q.QuoteNo,CUR.CurrencySymbol `;

  recordfilterquery = `Select count(i.InvoiceId) as recordsFiltered `;

  query = query + ` FROM tbl_invoice i
  LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
  LEFT JOIN tbl_mro as MRO on MRO.MROId=i.MROId
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = i.SOId AND SO.IsDeleted = 0 
  LEFT JOIN tbl_po as PO ON SO.POId = PO.POId AND PO.IsDeleted = 0 
  LEFT JOIN tbl_vendor_invoice as vi on vi.POId=PO.POId  AND vi.IsDeleted = 0 
  LEFT JOIN tbl_quotes as Q on Q.QuoteId=SO.QuoteId  AND Q.IsDeleted = 0
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = i.LocalCurrencyCode AND CUR.IsDeleted = 0
  where i.IsDeleted=0 and i.CustomerPONo != '' `;

  var CustomerId = 0;
  if (Invoice.CustomerId != 0) {
    CustomerId = Invoice.CustomerId;
    query = query + ` and i.IsDeleted=0 and i.CustomerId In (${CustomerId}) `;
  }
  if (Invoice.IdentityType == 0 && Invoice.IsRestrictedCustomerAccess == 1 && Invoice.MultipleCustomerIds != "") {
    query += ` and i.CustomerId in(${Invoice.MultipleCustomerIds}) `;
  }

  if (Invoice.CustomerPONo != '') {
    query += " and ( i.CustomerPONo = '" + Invoice.CustomerPONo + "' ) ";
  }
  if (Invoice.CustomerId != '' && Invoice.CustomerId != 0) {
    query += " and ( i.CustomerId = '" + Invoice.CustomerId + "' ) ";
  }
  var allowCheck = false;
  if (Invoice.InvoiceNo != '') {
    var INosC = Invoice.InvoiceNo.split(',');
    // console.log(INosC.length);
    // console.log(INosC);
    allowCheck = INosC.length == 1 ? true : false;
    var INos = "'" + Invoice.InvoiceNo.split(",").join("','") + "'";
    query += " and i.InvoiceNo In (" + INos + ") ";
    // query += " and ( i.InvoiceNo = '" + Invoice.InvoiceNo + "' ) ";
  }
  if (Invoice.InvoiceId != '' && Invoice.InvoiceId != 0 && Invoice.InvoiceId != undefined) {
    query += " and i.InvoiceId In (" + Invoice.InvoiceId + ") ";
  }
  if (Invoice.CustomerBlanketPOId != '' && Invoice.CustomerBlanketPOId != 0) {
    query += " and ( i.CustomerBlanketPOId = '" + Invoice.CustomerBlanketPOId + "' ) ";
  }
  if (Invoice.Status != '' && Invoice.Status != undefined) {
    query += " and i.Status In (" + Invoice.Status + ") ";
  }


  var tempquery = query.slice(0, -1);
  var query = tempquery;
  var Countquery = recordfilterquery + query;

  Invoice.start = Invoice.start ? Invoice.start : 0;
  Invoice.length = Invoice.length ? Invoice.length : 1000;
  if (Invoice.start != "-1" && Invoice.length != "-1") {
    query += " LIMIT " + Invoice.start + "," + (Invoice.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(i.InvoiceId) as TotalCount 
  FROM tbl_invoice i
  LEFT JOIN tbl_customers c on c.CustomerId=i.CustomerId
  LEFT JOIN tbl_mro as MRO on MRO.MROId=i.MROId
  LEFT JOIN tbl_sales_order as SO ON SO.SOId = i.SOId AND SO.IsDeleted = 0 
  LEFT JOIN tbl_po as PO ON SO.POId = PO.POId AND PO.IsDeleted = 0 
  LEFT JOIN tbl_vendor_invoice as vi on vi.POId=PO.POId  AND vi.IsDeleted = 0 
  where i.IsDeleted=0 `;
  if (CustomerId != 0) {
    TotalCountQuery = TotalCountQuery + `and i.CustomerId In (${CustomerId}) `;
  }
  if (Invoice.IdentityType == 0 && Invoice.IsRestrictedCustomerAccess == 1 && Invoice.MultipleCustomerIds != "") {
    TotalCountQuery += ` and i.CustomerId in(${Invoice.MultipleCustomerIds}) `;
  }
  // console.log("query = " + query);
  // console.log("Countquery = " + Countquery);
  // console.log(Invoice.CustomerPONo);
  // console.log(Invoice.CustomerId);
  // console.log(Invoice.InvoiceNo);
  // console.log(Invoice.CustomerBlanketPOId);
  // console.log(Invoice.Status);
  if (Invoice.CustomerPONo === '' && Invoice.CustomerId === 0 && Invoice.InvoiceNo === '' && Invoice.CustomerBlanketPOId === 0 && (Invoice.Status === '' || undefined)) {
    query = "select 1 from tbl_invoice where false";
  }

  var checkInvoiceIdQuery = "SELECT COUNT(*) as count FROM tbl_invoice_consolidate_detail WHERE IsDeleted=0 AND InvoiceNo ='" + Invoice.InvoiceNo + "' ";

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) },
    function (result) { if (allowCheck) { con.query(checkInvoiceIdQuery, result) } else { ConsolidateModel.emptyFunction(checkInvoiceIdQuery, result) } }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      // console.log(results[3][0][0].count);
      if (results[3][0] && results[3][0][0] && results[3][0][0].count > 0) {
        result({ message: "Invoice already exists in the consolidated invoice." }, null);
        return;
      } else {
        result(null, {
          data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
          recordsTotal: results[2][0][0].TotalCount, draw: Invoice.draw
        });
        return;
      }


    }
  );

};
ConsolidateModel.emptyFunction = (RR, result) => {
  result(null, { empty: 1 });
  return;
};
// ConsolidateModel.checkInvoiceId = (payload) => {
//   var INos = "'" + payload.split(",").join("','") + "'";
//   var sql = "SELECT COUNT(*) FROM tbl_invoice_consolidate_detail WHERE InvoiceId in (" + INos + ")";
// }
ConsolidateModel.checkAllowInsert = (payload) => {
  // CustomerId, CustomerBlanketPOId, CustomerPONo
  var CustomerId = getFields(payload, "CustomerId");
  var CustomerBlanketPOId = getFields(payload, "CustomerBlanketPOId");
  var CustomerPONo = getFields(payload, "CustomerPONo");
  var LocalCurrencyCode = getFields(payload, "LocalCurrencyCode");

  // var InvoiceId = getFields(payload, "InvoiceId");
  // console.log(InvoiceId);
  // // var d = ConsolidateModel.checkInvoiceId(InvoiceId);
  // console.log(CustomerId);
  // console.log(CustomerBlanketPOId);
  // console.log(CustomerPONo);
  var CustomerIdUnique = CustomerId.filter(function (elem, pos) {
    return CustomerId.indexOf(elem) == pos;
  });
  var CustomerBlanketPOIddUnique = CustomerBlanketPOId.filter(function (elem, pos) {
    return CustomerBlanketPOId.indexOf(elem) == pos;
  });
  var CustomerPONoUnique = CustomerPONo.filter(function (elem, pos) {
    return CustomerPONo.indexOf(elem) == pos;
  });
  var LocalCurrencyCodeUnique = LocalCurrencyCode.filter(function (elem, pos) {
    return LocalCurrencyCode.indexOf(elem) == pos;
  });
  // if(CustomerIdUnique.length === 1 && CustomerBlanketPOIddUnique.length === 1 && CustomerPONoUnique.length === 1 && LocalCurrencyCodeUnique.length === 1){
  //   return {
  //     status: true,
  //     message: ""
  //   };
  // }else{
  //   return {
  //     status: false,
  //     message: ""
  //   };
  // }
  // console.log(CustomerIdUnique.length);
  // console.log(CustomerBlanketPOIddUnique.length);
  // console.log(CustomerPONoUnique.length);
  // console.log(LocalCurrencyCodeUnique.length);

  if (CustomerIdUnique.length != 1) {
    return {
      status: false,
      message: "Customer Mismatch - Please select the Invoice with same Customer."
    };
  } else if (CustomerPONoUnique.length != 1) {
    return {
      status: false,
      message: "Customer PO Mismatch - Please select the Invoice with same Customer PO."
    };
  } else if (CustomerBlanketPOIddUnique.length != 1) {
    return {
      status: false,
      message: "Customer Blanket PO Mismatch - Please select the Invoice with same Customer Blanket PO."
    };
  } else if (LocalCurrencyCodeUnique.length != 1) {
    return {
      status: false,
      message: "Currency Code - Please select the Invoice with same  Currency Code."
    };
  } else {
    return {
      status: true,
      message: ""
    };
  }
}

function getFields(input, field) {
  var output = [];
  for (var i = 0; i < input.length; ++i)
    // if(input[i][field] && input[i][field] != ''){
    output.push(input[i][field]);
  // }  
  return output;
}
module.exports = ConsolidateModel;
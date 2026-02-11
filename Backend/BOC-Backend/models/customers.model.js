/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var async = require('async');
const Constants = require("../config/constants.js");
const md5 = require('md5');
const CustomersAddress = require("../models/customeraddress.model.js");
const CustomersDepartment = require("../models/customersdepartment.model.js");
const CustomersAsset = require("../models/customersasset.model.js");
const CustomerUsers = require("../models/customerusers.model.js");
const CVAttachmentModel = require("../models/attachment.model.js");
const CReference = require("../models/cutomer.reference.labels.model.js");
const InvoiceModel = require("../models/invoice.model.js");
var cDateTime = require("../utils/generic.js");
const UserModel = require("../models/users.model.js");
// const { request } = require("../app.js");
const { escapeSqlValues } = require("../helper/common.function.js");

const { getLogInUserId, getLogInIdentityId, getLogInIdentityType, getLogInIsRestrictedCustomerAccess, getLogInMultipleCustomerIds, getLogInMultipleAccessIdentityIds } = require("../helper/common.function.js");
const Customers = function (objCustomers) {

  //Common for Create & Edit
  this.CustomerCode = objCustomers.hasOwnProperty('CustomerCode') ? objCustomers.CustomerCode : '';
  //this.CustomerCode=Customers.GetCustomerCode();
  this.GroupId = objCustomers.hasOwnProperty('GroupId') ? objCustomers.GroupId : '';
  this.CustomerGroupId = objCustomers.hasOwnProperty('CustomerGroupId') ? objCustomers.CustomerGroupId : 0;
  this.CustomerTypeId = objCustomers.hasOwnProperty('CustomerTypeId') ? objCustomers.CustomerTypeId : '';
  this.FirstName = objCustomers.hasOwnProperty('FirstName') ? objCustomers.FirstName : '';
  this.LastName = objCustomers.hasOwnProperty('LastName') ? objCustomers.LastName : '';
  this.Username = objCustomers.hasOwnProperty('Username') ? objCustomers.Username : '';
  this.Password = objCustomers.hasOwnProperty('Password') ? objCustomers.Password : '';
  this.Email = objCustomers.hasOwnProperty('Email') ? objCustomers.Email : '';
  this.CustomerCountryId = objCustomers.hasOwnProperty('CustomerCountryId') ? objCustomers.CustomerCountryId : 0;
  this.Website = objCustomers.hasOwnProperty('Website') ? objCustomers.Website : '';
  this.CompanyName = objCustomers.hasOwnProperty('CompanyName') ? objCustomers.CompanyName : '';
  this.TermsId = objCustomers.hasOwnProperty('TermsId') ? objCustomers.TermsId : '';
  this.CustomerIndustry = objCustomers.hasOwnProperty('CustomerIndustry') ? objCustomers.CustomerIndustry : '';
  this.Notes = objCustomers.hasOwnProperty('Notes') ? objCustomers.Notes : '';
  this.PriorityNotes = objCustomers.hasOwnProperty('PriorityNotes') ? objCustomers.PriorityNotes : '';
  this.TaxType = objCustomers.hasOwnProperty('TaxType') ? objCustomers.TaxType : '0';
  this.TaxTypeId = objCustomers.hasOwnProperty('TaxTypeId') ? objCustomers.TaxTypeId : '0';
  this.IsLaborOnInvoice = objCustomers.IsLaborOnInvoice ? objCustomers.IsLaborOnInvoice : 0;
  this.Status = objCustomers.hasOwnProperty('Status') ? objCustomers.Status : 1;
  this.IsDeleted = objCustomers.hasOwnProperty('IsDeleted') ? objCustomers.IsDeleted : 0;
  this.BlanketPOLowerLimitPercent = objCustomers.hasOwnProperty('BlanketPOLowerLimitPercent') ? objCustomers.BlanketPOLowerLimitPercent : null;
  this.CustomerDepartmentList = objCustomers.CustomerDepartmentList;
  this.CustomerAssetList = objCustomers.CustomerAssetList;
  this.CustomerAttachmentList = objCustomers.CustomerAttachmentList;
  this.AddressList = objCustomers.AddressList;
  this.CustomerUsers = objCustomers.CustomerUsers;
  this.ProfilePhoto = objCustomers.ProfilePhoto;
  this.recordsTotal = objCustomers.recordsTotal;
  this.recordsFiltered = objCustomers.recordsFiltered;
  this.IdentityId = objCustomers.IdentityId;
  this.TaxTypeId = objCustomers.hasOwnProperty('TaxTypeId') ? objCustomers.TaxTypeId : 0;
  this.IsCSVProcessed = objCustomers.hasOwnProperty('IsCSVProcessed') ? objCustomers.IsCSVProcessed : 0;
  this.IsDisplayPOInQR = objCustomers.IsDisplayPOInQR ? objCustomers.IsDisplayPOInQR : 0;
  this.DirectedVendors = objCustomers.DirectedVendors ? objCustomers.DirectedVendors : '';
  this.CustomerLocation = objCustomers.CustomerLocation ? objCustomers.CustomerLocation : 0;
  this.CustomerCurrencyCode = objCustomers.CustomerCurrencyCode ? objCustomers.CustomerCurrencyCode : '';
  this.CustomerVATNo = objCustomers.CustomerVATNo ? objCustomers.CustomerVATNo : '';

  this.Customer = objCustomers.Customer ? objCustomers.Customer : '';
  this.CustomerPONotes = objCustomers.CustomerPONotes ? objCustomers.CustomerPONotes : '';

  this.authuser = objCustomers.authuser ? objCustomers.authuser : {};
  // for Add
  this.Created = cDateTime.getDateTime();

  this.CustomerId = objCustomers.hasOwnProperty('CustomerId') ? objCustomers.CustomerId : '';
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objCustomers.authuser && objCustomers.authuser.UserId) ? objCustomers.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objCustomers.authuser && objCustomers.authuser.UserId) ? objCustomers.authuser.UserId : TokenUserId;

  const TokenGlobalIdentityId = global.authuser.IdentityId ? global.authuser.IdentityId : 0;
  this.TokenIdentityId = (objCustomers.authuser && objCustomers.authuser.IdentityId) ? objCustomers.authuser.IdentityId : TokenGlobalIdentityId;

  const TokenGlobalIdentityType = global.authuser.IdentityType ? global.authuser.IdentityType : 0;
  this.TokenIdentityType = (objCustomers.authuser && objCustomers.authuser.IdentityType) ? objCustomers.authuser.IdentityType : TokenGlobalIdentityType;

  const TokenIsRestrictedCustomerAccess = global.authuser.IsRestrictedCustomerAccess ? global.authuser.IsRestrictedCustomerAccess : 0;
  this.TokenIsRestrictedCustomerAccess = (objCustomers.authuser && objCustomers.authuser.IsRestrictedCustomerAccess) ? objCustomers.authuser.IsRestrictedCustomerAccess : TokenIsRestrictedCustomerAccess;

  const TokenMultipleCustomerIds = global.authuser.MultipleCustomerIds ? global.authuser.MultipleCustomerIds : 0;
  this.TokenMultipleCustomerIds = (objCustomers.authuser && objCustomers.authuser.MultipleCustomerIds) ? objCustomers.authuser.MultipleCustomerIds : TokenMultipleCustomerIds;

  const TokenMultipleAccessIdentityIds = global.authuser.MultipleAccessIdentityIds ? global.authuser.MultipleAccessIdentityIds : 0;
  this.TokenMultipleAccessIdentityIds = (objCustomers.authuser && objCustomers.authuser.MultipleAccessIdentityIds) ? objCustomers.authuser.MultipleAccessIdentityIds : TokenMultipleAccessIdentityIds;

  // For Server Side Search 
  this.start = objCustomers.start;
  this.length = objCustomers.length;
  this.search = objCustomers.search;
  this.sortCol = objCustomers.sortCol;
  this.sortDir = objCustomers.sortDir;
  this.sortColName = objCustomers.sortColName;
  this.order = objCustomers.order;
  this.columns = objCustomers.columns;
  this.draw = objCustomers.draw;

  // For Customer UPS
  this.UPSUsername = objCustomers.UPSUsername ? objCustomers.UPSUsername : null;
  this.UPSPassword = objCustomers.UPSPassword ? objCustomers.UPSPassword : null;
  this.UPSAccessLicenseNumber = objCustomers.UPSAccessLicenseNumber ? objCustomers.UPSAccessLicenseNumber : null;
  this.UPSShipperNumber = objCustomers.UPSShipperNumber ? objCustomers.UPSShipperNumber : null;

  this.CreatedByLocation = global.authuser.Location ? global.authuser.Location : 0;


};

Customers.create = (Customers, result) => {
  var sql = `insert into tbl_customers(CustomerCode,GroupId,CustomerTypeId,FirstName,LastName,Username,
  Password,CompanyName,TermsId,CustomerIndustry,Notes,PriorityNotes,TaxType,IsLaborOnInvoice,Created,CreatedBy,Status,
  Website,Email,ProfilePhoto,CustomerCountryId,BlanketPOLowerLimitPercent,IsDisplayPOInQR,DirectedVendors,UPSUsername,
  UPSPassword,UPSAccessLicenseNumber,UPSShipperNumber,CustomerLocation,CustomerCurrencyCode,CreatedByLocation,CustomerVATNo,CustomerGroupId,CustomerPONotes) 
  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [
    Customers.CustomerCode, Customers.GroupId, Customers.CustomerTypeId, Customers.FirstName,
    Customers.LastName, Customers.Username, md5(Customers.Password), Customers.CompanyName,
    Customers.TermsId, Customers.CustomerIndustry, Customers.Notes, Customers.PriorityNotes, Customers.TaxType,
    Customers.IsLaborOnInvoice,
    Customers.Created,
    Customers.CreatedBy,
    Customers.Status,
    Customers.Website,
    Customers.Email,
    Customers.ProfilePhoto, Customers.CustomerCountryId, Customers.BlanketPOLowerLimitPercent, Customers.IsDisplayPOInQR, Customers.DirectedVendors,
    Customers.UPSUsername, Customers.UPSPassword, Customers.UPSAccessLicenseNumber, Customers.UPSShipperNumber,
    Customers.CustomerLocation, Customers.CustomerCurrencyCode, Customers.CreatedByLocation, Customers.CustomerVATNo, Customers.CustomerGroupId, Customers.CustomerPONotes
  ]
  con.query(sql, values, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    return result(null, { id: res.insertId });
  });
};

Customers.findById = (reqbody, result) => {
  var CustomerId = reqbody.CustomerId;
  var sql = Customers.viewquery(CustomerId, reqbody);
  var sqladdress = CustomersAddress.listquery(1, CustomerId);
  var sqldept = CustomersDepartment.listquery(CustomerId);
  var sqlasset = CustomersAsset.listquery(CustomerId);
  var sqlusers = CustomerUsers.listquery(CustomerId);
  var sqlattach = CVAttachmentModel.listquery(1, CustomerId);
  var sqlCReference = CReference.listquery(CustomerId);
  var Query = UserModel.listbyuserquery(Constants.CONST_IDENTITY_TYPE_CUSTOMER, CustomerId);
  var DirectedVendorList = Customers.DirectedVendorList(CustomerId);
  async.parallel([
    function (result) { con.query(sql, result) },
    function (result) { con.query(sqladdress, result) },
    function (result) { con.query(sqldept, result) },
    function (result) { con.query(sqlasset, result) },
    function (result) { con.query(sqlusers, result) },
    function (result) { con.query(sqlattach, result) },
    function (result) { con.query(sqlCReference, result) },
    function (result) { con.query(Query, result) },
    function (result) { con.query(DirectedVendorList, result) },
    function (result) { Customers.checkUpdateAvailable1(CustomerId, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      if (results[0][0].length > 0) {
        result(null, {
          BasicInfo: results[0][0], AddressList: results[1][0],
          CustomerDepartmentList: results[2][0], CustomerAssetList: results[3][0],
          CustomerUsers: results[4][0], AttachmentList: results[5][0], CReference: results[6][0],
          UserList: results[7][0], DirectedVendorList: results[8][0], ChangeCurrency: results[9]
        });
      } else {
        result({ msg: "Customer not found" }, null);
      }
    }
  );
};

Customers.DirectedVendorList = (CustomerId) => {
  return ` SELECT CompanyName as CustomerName,v.VendorName,VendorCode,case v.VendorTypeId
WHEN 'V' THEN '${Constants.array_vendor_type['V']}'
WHEN 'M' THEN '${Constants.array_vendor_type['M']}'
WHEN 'B' THEN '${Constants.array_vendor_type['B']}'
ELSE '-'
end VendorType,VendorId
FROM tbl_customers c
Left JOIN tbl_vendors v ON FIND_IN_SET(v.VendorId, c.DirectedVendors)
where c.IsDeleted=0 and VendorName Is Not Null and CustomerId=${CustomerId}
GROUP BY v.VendorId order by VendorName asc `;
};

Customers.GetCustomerIdFromCustomerName = (CompanyName) => {
  return ` SELECT *
          FROM tbl_customers 
          where IsDeleted=0 and CompanyName='${CompanyName}' `;

};

Customers.viewquery = (CustomerId, reqbody) => {


  var TokenIdentityType = getLogInIdentityType(reqbody);
  var IsRestrictedCustomerAccess = getLogInIsRestrictedCustomerAccess(reqbody);
  var MultipleCustomerIds = getLogInMultipleCustomerIds(reqbody);

  var sql = `SELECT c.DirectedVendors,c.CustomerId,c.UPSUsername,c.UPSPassword,c.UPSAccessLicenseNumber,c.UPSShipperNumber,CustomerCode,GroupId,Case GroupId
      WHEN 1 THEN '${Constants.array_customer_group[1]}'
      WHEN 2 THEN '${Constants.array_customer_group[2]}'
      WHEN 3 THEN '${Constants.array_customer_group[3]}'
      ELSE '-'
      end GroupName,CustomerTypeId,BlanketPOLowerLimitPercent,c.CustomerVATNo,c.CustomerGroupId,
      case CustomerTypeId 
      WHEN 1 THEN '${Constants.array_customer_type[1]}'
      WHEN 2 THEN '${Constants.array_customer_type[2]}'
      ELSE '-'
      end CustomerType,
      c.FirstName,c.LastName,c.Username,CompanyName,c.TermsId,
      t.TermsName as Terms,t.TermsDays,
      CustomerIndustry,Notes,PriorityNotes, c.TaxType, c.TaxType as TaxTypeId,
      case c.TaxType
      WHEN 1 THEN '${Constants.array_tax_type[1]}'
      WHEN 2 THEN '${Constants.array_tax_type[2]}'
      WHEN 3 THEN '${Constants.array_tax_type[3]}'
      ELSE '-'
      end TaxTypeName, IsLaborOnInvoice as IsLaborOnInvoiceId,c.IsDisplayPOInQR,
      case IsLaborOnInvoice
      WHEN 1 THEN '${Constants.array_yes_no[1]}'
      WHEN 0 THEN '${Constants.array_yes_no[0]}'
      ELSE '-'
      end IsLaborOnInvoice,c.Status,
      case c.Status
      WHEN 1 THEN '${Constants.array_status[1]}'
      WHEN 0 THEN '${Constants.array_status[0]}'
      ELSE '-'
      end StatusName,c.Website,c.Email,c.CustomerCountryId,co1.CountryName as CustomerCountry,CustomerLocation,CustomerCurrencyCode,CUR.CurrencySymbol,
      REPLACE(c.ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}')  as ProfilePhoto,cs.UserId,u.UserName as Manager,CON.VatTaxPercentage,c.CustomerPONotes
      FROM tbl_customers c
      LEFT JOIN tbl_customer_users cs on cs.CustomerId=c.CustomerId
      LEFT JOIN tbl_users u on u.UserId=cs.UserId
      LEFT JOIN tbl_terms t on c.TermsId=t.TermsId
      LEFT JOIN tbl_countries co1 on co1.CountryId=c.CustomerCountryId
      LEFT JOIN tbl_countries as CON  ON CON.CountryId = c.CustomerLocation AND CON.IsDeleted = 0
      LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = c.CustomerCurrencyCode AND CUR.IsDeleted = 0
      WHERE c.IsDeleted = 0 and c.customerid='${CustomerId}' `;

  if (TokenIdentityType == 0 && IsRestrictedCustomerAccess == 1 && MultipleCustomerIds != "") {
    sql += ` and c.CustomerId in(${MultipleCustomerIds}) `;
  }
  return sql;
}

Customers.updateById = (Customers, result) => {
  var sql = `UPDATE tbl_customers SET DirectedVendors=?,IsDisplayPOInQR=?,BlanketPOLowerLimitPercent=?,CustomerCode=?,Website=?,Email=?,CustomerCountryId=?,GroupId = ?,
  CustomerTypeId = ?,FirstName = ?,LastName = ? ,CompanyName = ?,
  TermsId = ?,CustomerIndustry = ?, Notes = ?, PriorityNotes=?, TaxType = ?,IsLaborOnInvoice = ?, 
  ModifiedBy = ? ,Modified = ?,ProfilePhoto = ?,UPSUsername = ?,UPSPassword = ?,UPSAccessLicenseNumber = ?,
  UPSShipperNumber = ?,CustomerLocation = ?,CustomerCurrencyCode = ?, CustomerVATNo = ?, CustomerGroupId = ?, CustomerPONotes = ?  WHERE CustomerId = ?`;

  if (Customers.IsLaborOnInvoice == 'No') { Customers.IsLaborOnInvoice = 0; }
  if (Customers.IsLaborOnInvoice == 'Yes') { Customers.IsLaborOnInvoice = 1; }
  var values = [
    Customers.DirectedVendors, Customers.IsDisplayPOInQR, Customers.BlanketPOLowerLimitPercent, Customers.CustomerCode, Customers.Website, Customers.Email, Customers.CustomerCountryId,
    Customers.GroupId, Customers.CustomerTypeId, Customers.FirstName,
    Customers.LastName,
    Customers.CompanyName, Customers.TermsId, Customers.CustomerIndustry,
    Customers.Notes, Customers.PriorityNotes, Customers.TaxTypeId, Customers.IsLaborOnInvoice,
    Customers.ModifiedBy, Customers.Modified, Customers.ProfilePhoto,
    Customers.UPSUsername, Customers.UPSPassword, Customers.UPSAccessLicenseNumber,
    Customers.UPSShipperNumber, Customers.CustomerLocation, Customers.CustomerCurrencyCode, Customers.CustomerVATNo, Customers.CustomerGroupId, Customers.CustomerPONotes, Customers.CustomerId
  ]
  con.query(sql, values, (err, res) => {

    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: Customers.CustomerId, ...Customers });
  }
  );
};




Customers.getViewStatistics = (customer, result) => {

  var sql = ` SELECT  COUNT(Status) as Count,   
  CASE Status WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}'  WHEN 2 THEN '${Constants.array_rr_status[2]}'
  WHEN 3 THEN '${Constants.array_rr_status[3]}'  WHEN 4 THEN '${Constants.array_rr_status[4]}'
  WHEN 5 THEN '${Constants.array_rr_status[5]}'  WHEN 6 THEN '${Constants.array_rr_status[6]}'
  WHEN 7 THEN '${Constants.array_rr_status[7]}'  WHEN 8 THEN '${Constants.array_rr_status[8]}' ELSE 'RRCount' end StatusName,Status 
  FROM tbl_repair_request WHERE IsDeleted = 0 and CustomerId= '${customer.CustomerId}' `;

  if (customer.hasOwnProperty('startDate') && customer.hasOwnProperty('endDate')) {
    const Fromdatearray = customer.startDate.split('T');
    const Todatearray = customer.endDate.split('T');
    var fromDate = Fromdatearray[0];//.split("/");
    var toDate = Todatearray[0];//.split("/");  

    sql += ` AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}') `;
  }
  sql += ` GROUP BY Status `;

  var sqlCustomerPaidInvocieQuery = InvoiceModel.CustomerPaidInvocieQuery(customer);
  var sqlCustomerUnPaidInvocieQuery = InvoiceModel.CustomerUnPaidInvocieQuery(customer);

  async.parallel([
    function (result) { con.query(sql, result) },
    function (result) { con.query(sqlCustomerPaidInvocieQuery, result) },
    function (result) { con.query(sqlCustomerUnPaidInvocieQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);



      var Paid = 0;
      if (results[1][0][0]) {
        Paid = results[1][0][0].PaidAmount
      }
      var Unpaid = 0;
      if (results[2][0][0]) {
        Unpaid = results[2][0][0].UnPaidAmount
      }

      result(null, { statsData: results[0][0], Paid: Paid, Unpaid: Unpaid });

    }
  );
};




Customers.Statistics = (customer, result) => {
  var sql = '';
  if (customer.hasOwnProperty('startDate') && customer.hasOwnProperty('endDate')) {
    const Fromdatearray = customer.startDate.split('T');
    const Todatearray = customer.endDate.split('T');
    var fromDate = Fromdatearray[0];//.split("/");
    var toDate = Todatearray[0];//.split("/");  
    sql = ` SELECT  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as TotalCount,  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 AND Status = 1 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as ActiveCount,  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 AND Status = 0 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as InactiveCount,  (SELECT count(CustomerId) as CustomerCount FROM tbl_customers  WHERE IsDeleted = 1 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as DeletedCount `;
  } else {
    sql = ` SELECT  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 ) as TotalCount,  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 AND Status = 1 ) as ActiveCount,  (SELECT count(CustomerId)  FROM tbl_customers  WHERE IsDeleted = 0 AND Status = 0 ) as InactiveCount,  (SELECT count(CustomerId) as CustomerCount FROM tbl_customers  WHERE IsDeleted = 1 ) as DeletedCount `;
  }
  con.query(sql, (err, res) => {
    if (err) {
      //  console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ msg: "Customer not found" }, null);
      return;
    }
    result(null, res);
  });

};



Customers.remove = (id, result) => {
  var sql = `UPDATE tbl_customers SET IsDeleted = 1 WHERE CustomerId = ${id}`;
  con.query(sql, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "Customer not found" }, null);
      return;
    }
    result(null, res);
  });
};

Customers.updateCustomerCode = (id, result) => {
  var sql = `UPDATE tbl_customers SET CustomerCode = CONCAT('AHC','${id}')  WHERE CustomerId = '${id}' `;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "Customer not found" }, null);
      return;
    }
    result(null, res);
  });
};




Customers.getAllActive = (reqbody, result) => {
  var sql = `Select CustomerId, CustomerCode,FirstName,LastName,CompanyName,TermsId,TaxType,Email,PriorityNotes,CustomerLocation,CustomerCurrencyCode,CUR.CurrencySymbol,CON.VatTaxPercentage,CustomerVATNo
  from tbl_customers as C
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = C.CustomerCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = C.CustomerLocation AND CON.IsDeleted = 0
  WHERE C.Status = 1 AND C.IsDeleted = 0 `;
  if (reqbody.TokenIdentityType == 0 && reqbody.TokenIsRestrictedCustomerAccess == 1 && reqbody.TokenMultipleCustomerIds != "") {
    sql += ` and CustomerId in(${reqbody.TokenMultipleCustomerIds}) `;
  }
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
}


Customers.getCustomerCurrencyExchange = (CustomerId, result) => {
  var sql = `Select c.CustomerId,c.CustomerLocation,c.CustomerCurrencyCode,CustomerVATNo,CUR.CurrencySymbol,CON.VatTaxPercentage
  from tbl_customers as c
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = c.CustomerCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = c.CustomerLocation AND CON.IsDeleted = 0
  WHERE   c.IsDeleted = 0 AND c.CustomerId = '${CustomerId}' `;
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
}


Customers.getAllAutoComplete = (reqbody, result) => {
  var SearchText = reqbody.Customer;
  var sql = `Select c.CustomerId, c.CustomerCode,c.FirstName,c.LastName,c.CompanyName,c.CustomerVATNo,c.TermsId,c.TaxType,c.Email,c.PriorityNotes,c.CustomerLocation,c.CustomerCurrencyCode,CUR.CurrencySymbol,CON.VatTaxPercentage
  from tbl_customers as c
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = c.CustomerCurrencyCode AND CUR.IsDeleted = 0
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = c.CustomerLocation AND CON.IsDeleted = 0
  WHERE c.Status = 1 AND c.IsDeleted = 0 AND (c.CompanyName LIKE '%${SearchText}%') `;
  if (reqbody.TokenIdentityType == 0 && reqbody.TokenIsRestrictedCustomerAccess == 1 && reqbody.TokenMultipleCustomerIds != "") {
    sql += ` and c.CustomerId in(${reqbody.TokenMultipleCustomerIds}) `;
  }
  if (reqbody.CustomerGroupId > 0) {
    sql += ` and c.CustomerGroupId=${reqbody.CustomerGroupId} `;
  }
  sql += `  ORDER BY c.CompanyName ASC `;
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
}



Customers.GetCustomerCode = result => {
  con.query(`Select concat('AHC', Max(CustomerId)+1) as CustomerCode from tbl_customers `, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    return result(null, res[0].CustomerCode);
  });
}

// Get Search List by Filter
Customers.getCustomerListByServerSide = (Customers, result) => {

  var query = "";
  var selectquery = "";

  selectquery = ` SELECT c.CustomerId,CustomerCode,FirstName,LastName,Username,
CompanyName,CustomerIndustry,Notes,CASE TaxType
WHEN 1 THEN '${Constants.array_tax_type[1]}'
WHEN 2 THEN '${Constants.array_tax_type[2]}'
WHEN 3 THEN '${Constants.array_tax_type[3]}'
ELSE '-'	end TaxType,
CASE IsLaborOnInvoice
WHEN 0 THEN '${Constants.array_yes_no[0]}'
WHEN 1 THEN '${Constants.array_yes_no[1]}'
ELSE '-'
end IsLaborOnInvoice, CASE c.Status
WHEN 0 THEN '${Constants.array_status[0]}'
WHEN 1 THEN '${Constants.array_status[1]}'
ELSE '-'
end Status,c.Email,
CASE GroupId  WHEN 1 THEN '${Constants.array_customer_group[1]}'
WHEN 2 THEN '${Constants.array_customer_group[2]}'
WHEN 3 THEN '${Constants.array_customer_group[3]}'
ELSE '-'
	end GroupName,
CASE CustomerTypeId
 WHEN 1 THEN '${Constants.array_customer_type[1]}'
 WHEN 2 THEN '${Constants.array_customer_type[2]}'
ELSE '-'
end CustomerType,
t.TermsName as Terms,co.CountryName,c.IsCSVProcessed,CustomerLocation,CustomerCurrencyCode,c.TermsId, '' as UserEmail
,c1.CountryName as CustomerAssignedCountry, c.CustomerGroupId
`;


  recordfilterquery = `Select count(c.CustomerId) as recordsFiltered `;

  query = query + ` FROM tbl_customers c
LEFT JOIN tbl_countries co on co.CountryId = c.CustomerCountryId
 LEFT JOIN tbl_countries c1 on c1.CountryId=c.CustomerLocation
LEFT JOIN tbl_terms t on c.TermsId=t.TermsId
where c.IsDeleted=0 `;


  if (Customers.TokenIdentityType == 0 && Customers.TokenIsRestrictedCustomerAccess == 1 && Customers.TokenMultipleCustomerIds != "") {
    query += ` and c.CustomerId in(${Customers.TokenMultipleCustomerIds}) `;
  }

  if (Customers.search.value != '') {
    query = query + ` and ( c.CustomerCode LIKE '%${Customers.search.value}%' 
    or c.CompanyName LIKE '%${Customers.search.value}%' 
    or c.FirstName LIKE '%${Customers.search.value}%' 
    or c.LastName LIKE '%${Customers.search.value}%' 
    or c.Status LIKE '%${Customers.search.value}%' ) `;
  }

  //  console.log(Customers.columns[0].search.value);
  // var cvalue = 0;
  // for (cvalue = 0; cvalue < Customers.columns.length; cvalue++) {
  //   if (Customers.columns[cvalue].search.value != "") {

  //     query += " and ( c." + Customers.columns[cvalue].name + " LIKE '%" + Customers.columns[cvalue].search.value + "%' ) ";
  //   }
  // }

  var cvalue = 0;
  for (cvalue = 0; cvalue < Customers.columns.length; cvalue++) {
    if (Customers.columns[cvalue].search.value != "") {
      switch (Customers.columns[cvalue].name) {
        case "CustomerId":
          query += " and  c.CustomerId In(" + Customers.columns[cvalue].search.value + ") ";
          break;
        case "TermsId":
          query += " and  c.TermsId  = '" + Customers.columns[cvalue].search.value + "'  ";
          break;
        case "Status":
          query += " and  c.Status  = '" + Customers.columns[cvalue].search.value + "' ";
          break;
        case "CustomerCurrencyCode":
          query += " and  c.CustomerCurrencyCode = '" + Customers.columns[cvalue].search.value + "' ";
          break;
        case "CustomerLocation":
          query += " and  c.CustomerLocation  = '" + Customers.columns[cvalue].search.value + "' ";
          break;
        case "UserEmail":
          query += ` and  c.CustomerId  IN (Select IdentityId FROM tbl_users WHERE IdentityType = ${Constants.CONST_IDENTITY_TYPE_CUSTOMER} AND  IdentityId = c.CustomerId AND Email LIKE '%${Customers.columns[cvalue].search.value}%' AND IsDeleted=0  ) `;
          break;
        case "CustomerGroupId":
          query += " and  c.CustomerGroupId In(" + Customers.columns[cvalue].search.value + ") ";
          break;

        default:
          query += " and ( " + Customers.columns[cvalue].name + " LIKE '%" + Customers.columns[cvalue].search.value + "%' ) ";
      }
    }
  }

  query += " ORDER BY " + Customers.columns[Customers.order[0].column].name + " " + Customers.order[0].dir;

  var Countquery = recordfilterquery + query;

  if (Customers.start != "-1" && Customers.length != "-1") {
    query += " LIMIT " + Customers.start + "," + (Customers.length);
  }
  query = selectquery + query;

  var TotalCountQuery = `SELECT Count(CustomerId) as TotalCount 
  FROM tbl_customers c
  LEFT JOIN tbl_countries co on co.CountryId = c.CustomerCountryId
  LEFT JOIN tbl_terms t on c.TermsId=t.TermsId
  where c.IsDeleted=0 `;
  if (Customers.TokenIdentityType == 0 && Customers.TokenIsRestrictedCustomerAccess == 1 && Customers.TokenMultipleCustomerIds != "") {
    TotalCountQuery += ` and c.CustomerId in(${Customers.TokenMultipleCustomerIds}) `;
  }
  //console.log("query = " + query);
  //console.log("Countquery = " + Countquery);

  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err)
        return result(err, null);

      // console.log("TotalCount : " + results[2][0][0].TotalCount)
      result(null, { data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered, recordsTotal: results[2][0][0].TotalCount, draw: Customers.draw });
      return;
    }
  );

};





// Get Total Customer Count By Search
Customers.GetTotalRecordsCountBySearch = (Customers, result) => {
  var query = ` SELECT Count(*) as TotalSearchRecordsCount
   FROM tbl_customers c
   LEFT JOIN tbl_address_book ab on ab.IdentityId=c.CustomerId and ab.IdentityType = 1  and ab.AddressType=1
   LEFT JOIN tbl_countries co on co.CountryId = ab.CountryId
   LEFT JOIN tbl_states s on s.StateId=ab.StateId
   where c.IsDeleted=0 `;
  if (Customers.search.value != '') {
    query = query + ` and ( c.CustomerCode LIKE '%${Customers.search.value}%' or c.CompanyName LIKE '%${Customers.search.value}%' or c.FirstName LIKE '%${Customers.search.value}%' or c.LastName LIKE '%${Customers.search.value}%' or c.Status LIKE '%${Customers.search.value}%' ) `;

  }
  con.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res[0]);
  });
};

// Get Total Customer Count 
Customers.GetTotalCustomerCount = result => {
  con.query(`SELECT Count(*) as TotalCount FROM tbl_customers WHERE IsDeleted=0 `, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res[0]);
  });
}


Customers.InsertCustomerMultipleAttachment = (Customers, result) => {
  var sql = `insert into tbl_vendor_customer_attachment(IdentityType,IdentityId,Attachment,AttachmentDesc,
    Created,CreatedBy,AttachmentOriginalFile,AttachmentMimeType,AttachmentSize) values`;

  for (let val of Customers.CustomerAttachmentList) {
    val = escapeSqlValues(val);
    sql += `(1,'${Customers.IdentityId}','${val.path}','${val.filename}','${Customers.Created}','${Customers.CreatedBy}','${val.originalname}','${val.mimetype}','${val.size}'),`;
  }

  var Query = sql.slice(0, -1);
  con.query(Query, (err, res) => {
    if (err) {

      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...Customers });
  });
};

//Global Search
Customers.findInColumns = (searchQuery, result) => {
  const { from, size, query } = searchQuery;

  let { IdentityType, MultipleAccessIdentityIds, IsRestrictedCustomerAccess, MultipleCustomerIds } = global.authuser;
  var sql = ` SELECT 'ahoms-rr-customer-ref' as _index,
  C.CustomerId as customerid, C.CustomerCode as customercode, C.CompanyName as companyname
  FROM tbl_customers as C
  where 
  (
    C.CustomerCode like '%${query.multi_match.query}%' or 
    C.FirstName like '%${query.multi_match.query}%' or 
    C.LastName like '%${query.multi_match.query}%' or   
    C.CompanyName like '%${query.multi_match.query}%'  
  ) and C.IsDeleted=0  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? `AND C.CustomerId IN (${MultipleCustomerIds}) ` : ""}
  #LIMIT ${from}, ${size}`;

  var countSql = `SELECT count(*) AS totalCount 
  FROM tbl_customers as C
  where 
  (
    C.CustomerCode like '%${query.multi_match.query}%' or 
    C.FirstName like '%${query.multi_match.query}%' or 
    C.LastName like '%${query.multi_match.query}%' or    
    C.CompanyName like '%${query.multi_match.query}%'  
  ) and C.IsDeleted=0 
  ${IdentityType == "0" && IsRestrictedCustomerAccess == 1 ? `AND C.CustomerId IN (${MultipleCustomerIds}) ` : ""} `


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
        return result(null, { totalCount: { "_index": "ahoms-repair-request", val: totalCount }, data: res });
      });
    } else {
      return result(null, []);
    }

  });
}
//
Customers.ExportToExcel = (reqBody, CustomerIds, result) => {
  var obj = new Customers(reqBody);
  var wheresql = '';
  var selectsql = ` SELECT c.CustomerCode as CustomerId,c.CompanyName as CustomerName,'FALSE' as Prospect, case c.Status
  WHEN 1 THEN 'FALSE' WHEN 0 THEN 'TRUE' ELSE '-' end InActive,c.FirstName as BillToContactFirstName,
  c.LastName as BillToContactLastName,ab1.StreetAddress as BillToAddressLineOne,ab1.SuiteOrApt as BillToAddressLineTwo,
  ab1.City as BillToCity,s1.StateName as BillToState,ab1.Zip as BillToZip,
  c1.CountryName as BillToCountry,ab2.StreetAddress as ShipToAddressLineOne,ab2.SuiteOrApt as ShipToAddressLineTwo,
  ab2.City as ShipToCity,s2.StateName as ShipToState, ab2.Zip as ShipToZipcode,c2.CountryName as ShipToCountry,
  case c.CustomerTypeId
  WHEN 1 THEN '${Constants.array_customer_type[1]}'
  WHEN 2 THEN '${Constants.array_customer_type[2]}'
  ELSE '-'
  end CustomerTypeName,ab1.PhoneNoPrimary as Telephone1,ab1.PhoneNoSecondary as Telephone2,ab1.Fax as FaxNumber,
  c.Email as CustomerEmail,c.TermsId,t.TermsName,c.CustomerCurrencyCode,c3.CountryName as CustomerCountry,c4.CountryName as CustomerAssignedCountry

  FROM tbl_customers c
  LEFT JOIN tbl_address_book ab1 on ab1.IdentityId=c.CustomerId and ab1.IdentityType=1 and ab1.IsShippingAddress=1
  LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
  LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
  LEFT JOIN tbl_address_book ab2 on ab2.IdentityId=c.CustomerId and ab2.IdentityType=1 and ab2.IsBillingAddress=1
  LEFT JOIN tbl_countries c2 on c2.CountryId=ab2.CountryId
  LEFT JOIN tbl_states s2 on s2.StateId=ab2.StateId
  LEFT JOIN tbl_terms t on c.TermsId=t.TermsId
  LEFT JOIN tbl_countries c3 on c3.CountryId=c.CustomerCountryId
  LEFT JOIN tbl_countries c4 on c4.CountryId=c.CustomerLocation
  WHERE c.IsDeleted=0 `;
  if (obj.CompanyName != "") {
    wheresql += " and ( c.CompanyName ='" + obj.CompanyName + "' ) ";
  }
  if (obj.FirstName != "") {
    wheresql += " and ( c.FirstName ='" + obj.FirstName + "' ) ";
  }
  if (obj.CustomerId != "") {
    wheresql += " and  c.CustomerId In(" + obj.CustomerId + ") ";
  }
  if (obj.Status != "") {
    wheresql += " and ( c.Status ='" + obj.Status + "' ) ";
  }
  if (obj.CustomerCurrencyCode != "") {
    wheresql += " and ( c.CustomerCurrencyCode ='" + obj.CustomerCurrencyCode + "' ) ";
  }
  if (obj.CustomerLocation != "" && obj.CustomerLocation != 0) {
    wheresql += " and ( c.CustomerLocation ='" + obj.CustomerLocation + "' ) ";
  }
  if (reqBody.hasOwnProperty('IsCSVProcessed') == true && obj.IsCSVProcessed != "") {
    wheresql += " and ( c.IsCSVProcessed ='" + obj.IsCSVProcessed + "' ) ";
  }
  if (CustomerIds != '') {
    wheresql += `and c.CustomerId in(` + CustomerIds + `)`;
  }
  var UpdateIsCSV = ' UPDATE tbl_customers c SET c.IsCSVProcessed =1  WHERE c.IsDeleted=0  ';
  var sqlArray = []; var obj = {};
  obj.sqlUpdateIsCSVProcessed = UpdateIsCSV + wheresql;

  wheresql += ` ORDER BY c.CustomerId DESC`;
  obj.sqlExcel = selectsql + wheresql;
  sqlArray.push(obj);
  // console.log("sqlExcel=" + sqlArray[0].sqlExcel);
  //console.log("sqlUpdateIsCSVProcessed = " + sqlArray[0].sqlUpdateIsCSVProcessed);
  return sqlArray;
};

// check customer currency update
Customers.checkUpdateAvailable = (Cus, result) => {
  var sql = Customers.viewquery(Cus.CustomerId, Cus);
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    res[0].TotalCount = 0;
    if (res[0].CustomerCurrencyCode != Cus.CustomerCurrencyCode) {
      con.query(`SELECT Count(*) as TotalCount FROM tbl_quotes WHERE IdentityId='${Cus.CustomerId}' `, (err1, res1) => {
        if (err1) {
          result(null, err1);
          return;
        }
        result(null, res1[0]);
      });

    } else {
      result(null, res[0]);
    }
  });
}

Customers.checkUpdateAvailable1 = (CustomerId, result) => {
  // con.query(`SELECT Count(*) as TotalCount FROM tbl_quotes WHERE IdentityId='${CustomerId}' `, (err1, res1) => {
  //   if (err1) {
  //     result(null, err1);
  //     return;
  //   }
  //   // console.log("Total Customer Count:", res1[0]);
  //   if(res1[0].TotalCount > 0){
  //     result(null, false);
  //     return;
  //   }else{
  //     result(null, true);
  //     return;
  //   }

  // });

  var sql = `SELECT Count(*) as TotalCount FROM tbl_quotes WHERE IdentityId='${CustomerId}'`;
  var sql1 = `SELECT Count(*) as TotalCount FROM tbl_customer_parts WHERE CustomerId='${CustomerId}'`
  async.parallel([
    function (result) { con.query(sql, result) },
    function (result) { con.query(sql1, result) },
  ],
    function (err, results) {
      if (err) {
        return result(err, null)
      }
      if (results[0][0][0].TotalCount > 0 || results[1][0][0].TotalCount > 0) {
        result(null, false);
      } else {
        result(null, true);
      }
    }
  );
}

Customers.checkDuplicateCustomer = (CompanyName, CustomerCode, CustomerId, result) => {
  var sql = `SELECT * FROM tbl_customers where IsDeleted=0 and CompanyName='${CompanyName}' and CustomerCode='${CustomerCode}'`;
  if (CustomerId > 0) {
    sql += ` and CustomerId<>${CustomerId}`;
  }
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });

};
module.exports = Customers;






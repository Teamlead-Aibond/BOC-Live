/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
const Address = require("../models/customeraddress.model.js");
const ContactModel = require("../models/contact.model.js");
const Users = require("../models/users.model.js");
const CVAttachmentModel = require("../models/attachment.model.js");
var async = require('async');
var cDateTime = require("../utils/generic.js");

const VendorModel = function (objVendor) {
  this.VendorId = objVendor.VendorId;
  this.IdentityId = objVendor.IdentityId;
  this.VendorCode = objVendor.hasOwnProperty('VendorCode') ? objVendor.VendorCode : '';
  this.VendorName = objVendor.hasOwnProperty('VendorName') ? objVendor.VendorName : '';
  this.VendorTypeId = objVendor.hasOwnProperty('VendorTypeId') ? objVendor.VendorTypeId : '';
  this.Email = objVendor.hasOwnProperty('Email') ? objVendor.Email : '';
  this.VendorCountryId = objVendor.VendorCountryId ? objVendor.VendorCountryId : 0;
  this.Currency = objVendor.hasOwnProperty('Currency') ? objVendor.Currency : '';
  this.TermsId = objVendor.hasOwnProperty('TermsId') ? objVendor.TermsId : '';
  this.Website = objVendor.hasOwnProperty('Website') ? objVendor.Website : '';
  this.Industry = objVendor.hasOwnProperty('Industry') ? objVendor.Industry : '';
  this.CODPayment = objVendor.CODPayment ? objVendor.CODPayment : 0;
  this.IsCorpVendor = objVendor.IsCorpVendor ? objVendor.IsCorpVendor : 0;
  this.RMARequired = objVendor.RMARequired ? objVendor.RMARequired : 0;
  this.Notes = objVendor.hasOwnProperty('Notes') ? objVendor.Notes : '';
  this.ShippingAccountNo = objVendor.hasOwnProperty('ShippingAccountNo') ? objVendor.ShippingAccountNo : '';
  this.IsCorpVendorCode = objVendor.hasOwnProperty('IsCorpVendorCode') ? objVendor.IsCorpVendorCode : '';
  this.VendorClass = objVendor.VendorClass ? objVendor.VendorClass : 0;
  this.Username = objVendor.hasOwnProperty('Username') ? objVendor.Username : '';
  this.Password = objVendor.hasOwnProperty('Password') ? objVendor.Password : '';
  this.CompanyLogo = objVendor.hasOwnProperty('CompanyLogo') ? objVendor.CompanyLogo : '';
  this.IsAllowQuoteBeforeShip = objVendor.IsAllowQuoteBeforeShip ? objVendor.IsAllowQuoteBeforeShip : 0;
  this.SetupInformation = objVendor.hasOwnProperty('SetupInformation') ? objVendor.SetupInformation : '';
  this.PODeliveryMethod = objVendor.PODeliveryMethod ? objVendor.PODeliveryMethod : 0;
  this.IsPOWithoutPricing = objVendor.IsPOWithoutPricing ? objVendor.IsPOWithoutPricing : '0';
  this.PrintFormat = objVendor.PrintFormat ? objVendor.PrintFormat : '0';
  this.IsCSVProcessed = objVendor.IsCSVProcessed ? objVendor.IsCSVProcessed : 0;
  this.Status = objVendor.Status ? objVendor.Status : '0';
  this.VendorLocation = objVendor.VendorLocation ? objVendor.VendorLocation : 0;
  this.VendorCurrencyCode = objVendor.VendorCurrencyCode ? objVendor.VendorCurrencyCode : '';

  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objVendor.authuser && objVendor.authuser.UserId) ? objVendor.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objVendor.authuser && objVendor.authuser.UserId) ? objVendor.authuser.UserId : TokenUserId;

  this.authuser = objVendor.authuser ? objVendor.authuser : {};

  this.FromDate = objVendor.FromDate;
  this.ToDate = objVendor.ToDate;
  // For Server Side Search 
  this.start = objVendor.start;
  this.length = objVendor.length;
  this.search = objVendor.search;
  this.sortCol = objVendor.sortCol;
  this.sortDir = objVendor.sortDir;
  this.sortColName = objVendor.sortColName;
  this.order = objVendor.order;
  this.columns = objVendor.columns;
  this.recordsTotal = objVendor.recordsTotal;
  this.recordsFiltered = objVendor.recordsFiltered;
  this.endDate = objVendor.endDate;
  this.startDate = objVendor.startDate;
  this.draw = objVendor.draw;
  this.RMANotes = objVendor.RMANotes;
  this.CODNotes = objVendor.CODNotes;
  this.VendorAttachmentList = objVendor.VendorAttachmentList;
  // For Vendor UPS
  this.UPSUsername = objVendor.UPSUsername ? objVendor.UPSUsername : null;
  this.UPSPassword = objVendor.UPSPassword ? objVendor.UPSPassword : null;
  this.UPSAccessLicenseNumber = objVendor.UPSAccessLicenseNumber ? objVendor.UPSAccessLicenseNumber : null;
  this.UPSShipperNumber = objVendor.UPSShipperNumber ? objVendor.UPSShipperNumber : null;

  this.IsFlatRateRepair = objVendor.IsFlatRateRepair ? objVendor.IsFlatRateRepair : 0;

  this.CreatedByLocation = global.authuser.Location ? global.authuser.Location : 0;

}

//To create a vendor
VendorModel.create = (vendor, result) => {
  var sql = `insert into tbl_vendors(VendorCode,VendorName,VendorTypeId,VendorEmail,VendorCountryId, Currency,TermsId,Website,Industry,CODPayment,IsCorpVendor,IsRMARequired
            ,Notes,ShippingAccountNo,IsCorpVendorCode,VendorClass,Username,Password,ProfilePhoto,IsAllowQuoteBeforeShip,SetupInformation, PODeliveryMethod,IsPOWithoutPricing,PrintFormat,Created,CreatedBy,Status,RMANotes,CODPaymentNotes,UPSUsername,
            UPSPassword,UPSAccessLicenseNumber,UPSShipperNumber,VendorLocation,VendorCurrencyCode,CreatedByLocation,IsFlatRateRepair)
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [
    vendor.VendorCode, vendor.VendorName, vendor.VendorTypeId, vendor.Email, vendor.VendorCountryId, vendor.Currency, vendor.TermsId, vendor.Website,
    vendor.Industry, vendor.CODPayment, vendor.IsCorpVendor, vendor.RMARequired, vendor.Notes, vendor.ShippingAccountNo, vendor.IsCorpVendorCode, vendor.VendorClass,
    vendor.Username, vendor.Password, vendor.CompanyLogo, vendor.IsAllowQuoteBeforeShip, vendor.SetupInformation, vendor.PODeliveryMethod, vendor.IsPOWithoutPricing,
    vendor.PrintFormat, vendor.Created, vendor.CreatedBy, vendor.Status, vendor.RMANotes, vendor.CODNotes, vendor.UPSUsername, vendor.UPSPassword,
    vendor.UPSAccessLicenseNumber, vendor.UPSShipperNumber, vendor.VendorLocation, vendor.VendorCurrencyCode, vendor.CreatedByLocation, vendor.IsFlatRateRepair
  ]
  con.query(sql, values, (err, res) => {
    if (err) return result(err, null);
    return result(null, { id: res.insertId, ...vendor });
  });
};
VendorModel.GetVendorIdByVendorName = (VendorName) => {
  var sql = `Select VendorId,VendorName From tbl_vendors where IsDeleted=0 and Vendorname='${VendorName}'`;
  //console.log(sql);
  return sql;
}
//To return the view vendor query
VendorModel.viewquery = (VendorId) => {
  var sql = `SELECT VendorId,VendorCode,VendorName,UPSUsername,UPSPassword,UPSAccessLicenseNumber,UPSShipperNumber,VendorLocation,VendorCurrencyCode,CUR.CurrencySymbol as VendorCurrencySymbol,
  case VendorTypeId
  WHEN 'V' THEN '${Constants.array_vendor_type['V']}'
  WHEN 'M' THEN '${Constants.array_vendor_type['M']}'
  WHEN 'B' THEN '${Constants.array_vendor_type['B']}'
  ELSE '-'
  end VendorTypeName,VendorTypeId,VendorEmail,v.VendorCountryId,co1.CountryName as VendorCountry,
  IsCorpVendorCode,
  Case VendorClass  WHEN 0 THEN '${Constants.array_vendor_class[0]}'
  WHEN 1 THEN '${Constants.array_vendor_class[1]}'
  WHEN 2 THEN '${Constants.array_vendor_class[2]}'
  WHEN 3 THEN '${Constants.array_vendor_class[3]}'
  ELSE '-'
  end VendorClassName,VendorClass
  ,Currency,t.TermsId,  t.TermsName as Terms,Website,Industry, CODPayment,
  case CODPayment
  WHEN 1 THEN '${Constants.array_yes_no[1]}'
  WHEN 0 THEN '${Constants.array_yes_no[0]}'
  ELSE '-'
  end CODPaymentName,  IsCorpVendor,
  case IsCorpVendor
  WHEN 1 THEN '${Constants.array_yes_no[1]}'
  WHEN 0 THEN '${Constants.array_yes_no[0]}'
  ELSE '-'
  end CorpVendor,  IsRMARequired,case IsRMARequired
  WHEN 1 THEN '${Constants.array_yes_no[1]}'
  WHEN 0 THEN '${Constants.array_yes_no[0]}'
  ELSE '-'
  end RMARequired, Notes,Username,  REPLACE(ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ProfilePhoto, REPLACE(ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as CompanyLogo,IsAllowQuoteBeforeShip,
  SetupInformation,ShippingAccountNo , PODeliveryMethod as PODeliveryMethodId,
  case PODeliveryMethod
  WHEN 1 THEN '${Constants.array_po_delivery_method[1]}'
  WHEN 2 THEN '${Constants.array_po_delivery_method[2]}'
  WHEN 3 THEN '${Constants.array_po_delivery_method[3]}'
  WHEN 4 THEN '${Constants.array_po_delivery_method[4]}'
  ELSE '-'
  end PODeliveryMethod,
  IsPOWithoutPricing,case IsPOWithoutPricing
  WHEN 1 THEN '${Constants.array_yes_no[1]}'
  WHEN 0 THEN '${Constants.array_yes_no[0]}'
  ELSE '-'
  end POWithoutPricing,PrintFormat as PrintFormatId,
  Case PrintFormat
  WHEN 1 THEN '${Constants.array_po_print_format[1]}'
  WHEN 2 THEN '${Constants.array_po_print_format[2]}'
  WHEN 3 THEN '${Constants.array_po_print_format[3]}'
  ELSE '-' end PrintFormat,
  v.Created, v.Status,v.IsFlatRateRepair,
  case v.Status
  WHEN 1 THEN '${Constants.array_status[1]}'
  WHEN 0 THEN '${Constants.array_status[0]}'
  ELSE '-'
  end StatusName,RMANotes,CODPaymentNotes as CODNotes, co1.VatTaxPercentage
  FROM tbl_vendors v
  LEFT JOIN tbl_terms t on t.TermsId=v.TermsId
  LEFT JOIN tbl_countries co1 on co1.CountryId=v.VendorCountryId
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = v.VendorCurrencyCode AND CUR.IsDeleted = 0
  WHERE v.IsDeleted=0 and VendorId='${VendorId}'`;
  return sql;
}

//To View the vendor and vendor sub modules info
VendorModel.findById = (VendorId, result) => {
  var sql = VendorModel.viewquery(VendorId);
  var sqladdress = Address.listquery(2, VendorId);
  var sqlcontact = ContactModel.listquery(VendorId);
  var sqlusers = Users.listbyuserquery(2, VendorId);
  var sqlattach = CVAttachmentModel.listquery(2, VendorId);
  async.parallel([
    function (result) { con.query(sql, result) },
    function (result) { con.query(sqladdress, result) },
    function (result) { con.query(sqlcontact, result) },
    function (result) { con.query(sqlusers, result) },
    function (result) { con.query(sqlattach, result) },
    function (result) { VendorModel.checkUpdateAvailable1(VendorId, result) }
  ],
    function (err, results) {
      // console.log(results[5]);
      if (err) return result(err, null);
      if (results[0][0].length > 0) {
        return result(null, { BasicInfo: results[0][0], AddressList: results[1][0], ContactList: results[2][0], UserList: results[3][0], AttachmentList: results[4][0], ChangeCurrency: results[5] });
      } else {
        return result({ msg: "Vendor not found" }, null);
      }
    }
  );
};

//To update the vendor info
VendorModel.updateById = (vendor, result) => {
  var sql = `UPDATE tbl_vendors SET VendorClass = ?,VendorCode = ?,VendorName = ?,VendorTypeId = ?,VendorEmail = ?,VendorCountryId = ?,
   Currency = ?,TermsId = ?,Website = ?,Industry = ?,CODPayment = ?,IsCorpVendor = ?, IsRMARequired = ?, Notes = ?,ShippingAccountNo = ? , ProfilePhoto = ?, IsAllowQuoteBeforeShip = ?,SetupInformation = ?,PODeliveryMethod = ?
   ,IsPOWithoutPricing = ?,PrintFormat = ?,Modified = ?,Status = ?,RMANotes=?,CODPaymentNotes=?,UPSUsername=?,UPSPassword=?,
   UPSAccessLicenseNumber=?,UPSShipperNumber=?,VendorLocation=? ,VendorCurrencyCode=?, IsFlatRateRepair=?   WHERE VendorId = ?`;
  var values = [
    vendor.VendorClass, vendor.VendorCode, vendor.VendorName, vendor.VendorTypeId, vendor.Email, vendor.VendorCountryId, vendor.Currency, vendor.TermsId, vendor.Website,
    vendor.Industry, vendor.CODPayment, vendor.IsCorpVendor, vendor.RMARequired, vendor.Notes, vendor.ShippingAccountNo,
    vendor.CompanyLogo, vendor.IsAllowQuoteBeforeShip, vendor.SetupInformation, vendor.PODeliveryMethod, vendor.IsPOWithoutPricing,
    vendor.PrintFormat, vendor.Modified, vendor.Status, vendor.RMANotes, vendor.CODNotes, vendor.UPSUsername,
    vendor.UPSPassword, vendor.UPSAccessLicenseNumber, vendor.UPSShipperNumber, vendor.VendorLocation, vendor.VendorCurrencyCode, vendor.IsFlatRateRepair, vendor.VendorId
  ]
  con.query(sql, values, (err, res) => {
    if (err) return result(err, null);
    if (res.affectedRows == 0) {
      return result({ msg: "Vendor not updated" }, null);
    }
    return result(null, { id: vendor.VendorId, ...vendor });
  });
};

//To remvoe the vendor
VendorModel.remove = (id, result) => {
  // console.log(id +"=="+ Constants.AH_GROUP_VENDOR_STORE_ID);
  if (id != Constants.AH_GROUP_VENDOR_STORE_ID) {
    var Obj = new VendorModel({ VendorId: id });
    var values = [Obj.Modified, Obj.ModifiedBy, Obj.VendorId];
    con.query("Update tbl_vendors set IsDeleted=1, Modified = ?, ModifiedBy=?  WHERE VendorId = ?  ", values, (err, res) => {
      if (err) return result(err, null);
      if (res.affectedRows == 0) return result({ msg: "Vendor not deleted" }, null);
      return result(null, res);
    });
  } else {
    return result({ msg: "This is a primary vendor. You cannot delete it. Please contact admin" }, null);
  }

};

//TO update the vendor code
VendorModel.updateVendorCode = (id, result) => {
  var sql = `UPDATE tbl_vendors SET VendorCode = CONCAT('AHV', ${id})  WHERE VendorId = ${id}`;
  con.query(sql, (err, res) => {
    if (err) return result(err, null);
    if (res.affectedRows == 0) return result({ msg: "Vendor not found" }, null);
    return result(null, res);
  });
};

VendorModel.UpdateIsCorpVendorCode = (id, result) => {
  var sql = `UPDATE tbl_vendors SET IsCorpVendorCode = CONCAT('VC', ${id})  WHERE VendorId = ${id}`;
  con.query(sql, (err, res) => {
    if (err) return result(err, null);
    if (res.affectedRows == 0) return result({ msg: "Vendor not found" }, null);
    return result(null, res);
  });
};
//To get all the active vendor for dropdowm
VendorModel.getAllActive = result => {
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
   where v.Status = 1 AND  v.IsDeleted=0 `;
  con.query(query, (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};

VendorModel.getAllAutoComplete = (SearchText, result) => {
  con.query(`Select VendorId,VendorCode,VendorName,TermsId,VendorEmail,IsFlatRateRepair,VendorLocation,VendorCurrencyCode,cur.CurrencySymbol,CON.VatTaxPercentage from tbl_vendors v 
  LEFt JOIN tbl_currencies as cur on cur.CurrencyCode = v.VendorCurrencyCode AND cur.IsDeleted = 0
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = v.VendorLocation AND CON.IsDeleted = 0
  WHERE v.Status = 1 AND v.IsDeleted = 0 AND (v.VendorName LIKE '%${SearchText}%') ORDER BY v.VendorName ASC   `, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
}

VendorModel.getAllAutoCompleteMRO = (SearchText, result) => {
  con.query(`Select VendorId,VendorCode,VendorName,TermsId,VendorEmail,IsFlatRateRepair,VendorLocation,VendorCurrencyCode,cur.CurrencySymbol,CON.VatTaxPercentage from tbl_vendors v 
  LEFt JOIN tbl_currencies as cur on cur.CurrencyCode = v.VendorCurrencyCode AND cur.IsDeleted = 0
  LEFT JOIN tbl_countries as CON  ON CON.CountryId = v.VendorLocation AND CON.IsDeleted = 0
  WHERE v.Status = 1 AND v.IsDeleted = 0 AND v.VendorId != ${Constants.AH_GROUP_VENDOR_ID} AND (v.VendorName LIKE '%${SearchText}%') ORDER BY v.VendorName ASC   `, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
}

//To get all the vendors
VendorModel.getAll = result => {
  var query = `Select ab.IdentityType,VendorCode,VendorName,case VendorTypeId
  WHEN 'V' THEN '${Constants.array_vendor_type['V']}'
  WHEN 'M' THEN '${Constants.array_vendor_type['M']}'
  WHEN 'B' THEN '${Constants.array_vendor_type['B']}'
  ELSE '-'
  end VendorType
  ,VendorEmail,v.VendorCountryId,Currency,t.TermsName as Terms,v.IsFlatRateRepair,
  Website,Industry,CODPayment,VendorLocation,VendorCurrencyCode
  ,IsCorpVendor,IsRMARequired,Notes,Username,Password,REPLACE(ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as CompanyLogo,
  SetupInformation,PODeliveryMethod,
  IsPOWithoutPricing,PrintFormat, case v.Status
  WHEN 1 THEN '${Constants.array_status[1]}'
  WHEN 0 THEN '${Constants.array_status[0]}'
  ELSE '-'
  end Status,s.StateName,co.CountryName,ab.PhoneNoPrimary,
  ab.PhoneNoSecondary,ab.StreetAddress,ab.City,ab.Zip,ab.Fax,v.RMANotes,
  v.CODPaymentNotes as CODNotes
  from tbl_vendors v
  LEFT JOIN tbl_address_book ab on v.VendorId=ab.IdentityId
  LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
  LEFT JOIN tbl_states s on s.StateId=ab.StateId 
  LEFT JOIN tbl_terms t on v.TermsId=t.TermsId 
  where ab.IsDeleted=0
  and v.IsDeleted=0 and ab.AddressType=1 and ab.IdentityType=${Constants.CONST_IDENTITY_TYPE_VENDOR}`;
  con.query(query, (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

//To lsit all the vendots with filter
VendorModel.getAllWithFilter = (vendor, result) => {
  var query = `Select ab.IdentityType,VendorCode,VendorName, VendorLocation,VendorCurrencyCode,
      case VendorTypeId
      WHEN 'V' THEN '${Constants.array_vendor_type['V']}'
      WHEN 'M' THEN '${Constants.array_vendor_type['M']}'
      WHEN 'B' THEN '${Constants.array_vendor_type['B']}'
      ELSE '-'
      end VendorType  ,VendorEmail,v.VendorCountryId,Currency,t.TermsName as Terms,  Website,Industry,CODPayment  ,IsCorpVendor,
      case IsCorpVendor
      WHEN 1 THEN '${Constants.array_status[1]}'
      WHEN 0 THEN '${Constants.array_status[0]}'
      ELSE '-'
      end CorpVendor, IsRMARequired,Notes,Username,Password,REPLACE(ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as CompanyLogo,SetupInformation,PODeliveryMethod,
      IsPOWithoutPricing,PrintFormat, 
      case v.Status
      WHEN 1 THEN '${Constants.array_status[1]}'
      WHEN 0 THEN '${Constants.array_status[0]}'
      ELSE '-'
      end Status,s.StateName,co.CountryName,ab.PhoneNoPrimary, ab.PhoneNoSecondary,ab.StreetAddress,ab.City,ab.Zip,ab.Fax,v.RMANotes,v.CODPaymentNotes as CODNotes
      from tbl_vendors v
      LEFT JOIN tbl_address_book ab on v.VendorId=ab.IdentityId and ab.IdentityType=${Constants.CONST_IDENTITY_TYPE_VENDOR} and ab.IsContactAddress=1  AND  ab.AddressType=1  AND ab.IsDeleted=0  
      LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId 
      LEFT JOIN tbl_states s on s.StateId=ab.StateId 
      LEFT JOIN tbl_terms t on v.TermsId=t.TermsId  WHERE  v.IsDeleted=0  `;
  if (vendor.VendorCode != '') {
    query = query + ` and v.VendorCode LIKE '%${vendor.VendorCode}%' `;
  }
  if (vendor.VendorName != '') {
    query = query + ` and v.VendorName LIKE '%${vendor.VendorName}%' `;
  }
  if (vendor.VendorTypeId != '') {
    query = query + ` and v.VendorTypeId LIKE '%${vendor.VendorTypeId}%' `;
  }
  if (vendor.IsCorpVendor != '') {
    query = query + ` and v.IsCorpVendor LIKE '%${vendor.IsCorpVendor}%' `;
  }
  con.query(query, (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};

//To get the vendor code
VendorModel.GetVendorCode = result => {
  con.query(`Select concat('AHV', Max(VendorId)+1) as VendorCode from tbl_vendors `, (err, res) => {
    if (err) return result(err, null);
    result(null, res[0].VendorCode);
  });
}

//To get vendor list page statistics
VendorModel.getVendorStatics = (vendor, result) => {
  var query = "";
  if (vendor.hasOwnProperty('startDate') && vendor.hasOwnProperty('endDate')) {
    const Fromdatearray = vendor.startDate.split('T');
    const Todatearray = vendor.endDate.split('T');
    var fromDatearray = Fromdatearray[0];
    var toDatearray = Todatearray[0];
    var fromDate = fromDatearray;
    var toDate = toDatearray;
    var query = ` SELECT  (SELECT COUNT(*) FROM tbl_vendors WHERE IsDeleted=0 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as TotalCount,  (SELECT COUNT(*)as TotalVendorCount FROM tbl_vendors WHERE VendorTypeId='V' and IsDeleted=0 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as OnlyVendorCount,  (SELECT COUNT(*)as TotalBothCount FROM tbl_vendors WHERE VendorTypeId='B' and IsDeleted=0 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as InactiveCount,  (SELECT COUNT(*)as TotalDeletedCount FROM tbl_vendors WHERE  IsDeleted=1 AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}')) as DeletedCount `;
  } else {
    var query = ` SELECT  (SELECT COUNT(*) FROM tbl_vendors WHERE IsDeleted=0) as TotalCount,  (SELECT COUNT(*)as TotalVendorCount FROM tbl_vendors WHERE VendorTypeId='V' and IsDeleted=0 ) as OnlyVendorCount,  (SELECT COUNT(*)as TotalBothCount FROM tbl_vendors WHERE VendorTypeId='B' and IsDeleted=0 ) as BothCount,  (SELECT COUNT(*)as TotalDeletedCount FROM tbl_vendors WHERE  IsDeleted=1 ) as DeletedCount `;
  }
  con.query(query, (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};

//To get vendor view page statistics
VendorModel.getViewStatistics = (vendor, result) => {

  var sql = ` SELECT  COUNT(Status) as Count,
  CASE Status WHEN 0 THEN '${Constants.array_rr_status[0]}'
  WHEN 1 THEN '${Constants.array_rr_status[1]}'  WHEN 2 THEN '${Constants.array_rr_status[2]}'
  WHEN 3 THEN '${Constants.array_rr_status[3]}'  WHEN 4 THEN '${Constants.array_rr_status[4]}'
  WHEN 5 THEN '${Constants.array_rr_status[5]}'  WHEN 6 THEN '${Constants.array_rr_status[6]}'
  WHEN 7 THEN '${Constants.array_rr_status[7]}'  WHEN 8 THEN '${Constants.array_rr_status[8]}' ELSE 'RRCount' end Status,Status as StatusId   
  FROM tbl_repair_request WHERE IsDeleted = 0 and VendorId='${vendor.VendorId}' `;

  if (vendor.hasOwnProperty('startDate') && vendor.hasOwnProperty('endDate')) {
    const Fromdatearray = vendor.startDate.split('T');
    const Todatearray = vendor.endDate.split('T');
    var fromDate = Fromdatearray[0];
    var toDate = Todatearray[0];
    sql += ` AND (DATE(Created) BETWEEN  '${fromDate}' AND '${toDate}') `;
  }
  sql += ` GROUP BY Status `;
  con.query(sql, (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};

//To get the Vendor list for datatable with filter
VendorModel.getVendorListByServerSide = (vendor, result) => {
  var query = "";
  var selectquery = `Select VendorId,VendorCode,VendorName, case VendorTypeId
      WHEN 'V' THEN '${Constants.array_vendor_type['V']}'
      WHEN 'M' THEN '${Constants.array_vendor_type['M']}'
      WHEN 'B' THEN '${Constants.array_vendor_type['B']}'
      ELSE '-'
      end VendorType  ,VendorTypeId,VendorEmail,C.CountryName as CountryName, IsFlatRateRepair, IsCorpVendor,Case IsCorpVendor     
      WHEN 1 THEN '${Constants.array_status[1]}'
      WHEN 0 THEN '${Constants.array_status[0]}'
      ELSE '-'
      end CorpVendor,REPLACE(ProfilePhoto,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as CompanyLogo,
      case v.Status
      WHEN 1 THEN '${Constants.array_status[1]}'
      WHEN 0 THEN '${Constants.array_status[0]}'
      ELSE '-'
      end Status,v.IsCSVProcessed,VendorLocation,VendorCurrencyCode,
      Case VendorClass
      WHEN 0 THEN '${Constants.array_vendor_class[0]}' WHEN 1 THEN '${Constants.array_vendor_class[1]}'
      WHEN 2 THEN '${Constants.array_vendor_class[2]}' WHEN 3 THEN '${Constants.array_vendor_class[3]}'
      ELSE '-' end VendorClassName,VendorClass,v.IsCorpVendorCode,C1.CountryName as VendorAssignedCountry
      
      `;
  recordfilterquery = `Select count(v.VendorId) as recordsFiltered `;
  query = query + `  from tbl_vendors v  
      LEFT JOIN tbl_countries as C on C.CountryId=v.VendorCountryId 
      LEFT JOIN tbl_countries C1 on C1.CountryId=v.VendorLocation    
      where   v.IsDeleted=0 AND  VendorId NOT IN(${Constants.AH_GROUP_VENDOR_ID})    `;

  var SearchValue = vendor.search.value;

  if (SearchValue != '') {
    var IsCorpVendor = '';
    if (SearchValue.toLowerCase() == "yes") { IsCorpVendor = 1; }
    if (SearchValue.toLowerCase() == "no") { IsCorpVendor = 0; }

    var VendorTypeId = '';
    if (SearchValue.toLowerCase() == "vendor") { VendorTypeId = "V"; }
    if (SearchValue.toLowerCase() == "manufacturer") { VendorTypeId = "M"; }
    if (SearchValue.toLowerCase() == "both") { VendorTypeId = "B"; }

    var VendorClass = '';
    if (SearchValue.toLowerCase() == "regular") { VendorClass = "0"; }
    if (SearchValue.toLowerCase() == "minority") { VendorClass = "1"; }
    if (SearchValue.toLowerCase() == "veteran") { VendorClass = "2"; }
    if (SearchValue.toLowerCase() == "women") { VendorClass = "3"; }

    var StatusValue = '';
    if (SearchValue.toLowerCase() == "active") { StatusValue = 1; }
    if (SearchValue.toLowerCase() == "inactive" || SearchValue.toLowerCase() == "in active") { StatusValue = 0; }

    query = query + ` and ( 
    v.VendorCode LIKE '%${SearchValue}%' or 
    v.VendorName LIKE '%${SearchValue}%' or 
    v.VendorEmail  LIKE '%${SearchValue}%' or 
    v.Industry  LIKE '%${SearchValue}%' or 
    v.Username  LIKE '%${SearchValue}%' or  
    v.VendorTypeId LIKE '${VendorTypeId}' or
    v.Status LIKE '${StatusValue}' or
    v.VendorClass LIKE '${VendorClass}' or
    v.IsCorpVendor LIKE '${IsCorpVendor}' or
    v.IsCorpVendorCode LIKE '${SearchValue}' ) `;
  }


  var cvalue = 0;
  for (cvalue = 0; cvalue < vendor.columns.length; cvalue++) {
    if (vendor.columns[cvalue].search.value != "") {
      query += " and ( v." + vendor.columns[cvalue].name + " LIKE '%" + vendor.columns[cvalue].search.value + "%' ) ";
    }
  }
  query += " ORDER BY " + vendor.columns[vendor.order[0].column].name + " " + vendor.order[0].dir;
  var Countquery = recordfilterquery + query;
  if (vendor.start != "-1" && vendor.length != "-1") {
    query += " LIMIT " + vendor.start + "," + (vendor.length);
  }
  query = selectquery + query;
  var TotalCountQuery = `SELECT Count(VendorId) as TotalCount from tbl_vendors where IsDeleted=0 AND  VendorId NOT IN(${Constants.AH_GROUP_VENDOR_ID}) `;
  //console.log(query);
  //console.log(Countquery);
  //console.log(TotalCountQuery);
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) return result(err, null);
      return result(null, { data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered, recordsTotal: results[2][0][0].TotalCount, draw: vendor.draw });
    }
  );
};


//To insert the csutomer attachment
VendorModel.InsertCustomerMultipleAttachment = (vendor, result) => {
  if (vendor.VendorAttachmentList) {
    var sql = `insert into tbl_vendor_customer_attachment(IdentityType,IdentityId,Attachment,AttachmentDesc,Created,CreatedBy,AttachmentOriginalFile,AttachmentMimeType,AttachmentSize) values`;
    for (let val of vendor.VendorAttachmentList) {
      sql += `(${Constants.CONST_IDENTITY_TYPE_VENDOR},'${vendor.IdentityId}','${val.path}','${val.filename}','${vendor.Created}','${vendor.CreatedBy}','${val.originalname}','${val.mimetype}','${val.size}'),`;
    }
    var Query = sql.slice(0, -1);
    con.query(Query, (err, res) => {
      if (err) return result(err, null);
      return result(null, { id: res.insertId, ...vendor });
    });
  } else {
    return result(null, null);
  }
};
VendorModel.ManufacturerAutoSuggest = (obj, result) => {
  var sql = `Select VendorName Manufacturer, VendorId ManufacturerId from tbl_vendors  where Status = 1 AND 
   IsDeleted=0 and (VendorTypeId='M' OR VendorTypeId='B') AND (VendorName LIKE '%${obj.Manufacturer}%') Order By VendorName ASC LIMIT 20  `;
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
//To get all the manufacturer list
VendorModel.GetManufacturerList = result => {
  var query = `Select  VendorCode, VendorName, VendorId from tbl_vendors  where Status = 1 AND  IsDeleted=0 and (VendorTypeId='M' OR VendorTypeId='B') Order By VendorName  `;
  con.query(query, (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};

VendorModel.GetManufacturerListWithChecked = result => {
  var query = `Select  VendorCode, VendorName, VendorId, false as isChecked from tbl_vendors  where Status = 1 AND  IsDeleted=0 and (VendorTypeId='M' OR VendorTypeId='B') Order By VendorName  `;
  con.query(query, (err, res) => {
    if (err) return result(err, null);
    return result(null, res);
  });
};

//Global Search
VendorModel.findInColumns = (searchQuery, result) => {

  const { from, size, query, active } = searchQuery;

  var sql = ` SELECT 'ahoms-rr-vendors' as _index,
  V.VendorId as vendorid, V.VendorCode as vendorcode
  FROM tbl_vendors as V
  where 
  (
    VendorCode like '%${query.multi_match.query}%' or 
    VendorName like '%${query.multi_match.query}%'  
  ) and V.IsDeleted=0
  #LIMIT ${from}, ${size}`;

  var countSql = `SELECT count(*) AS totalCount 
  FROM tbl_vendors as V
  where 
  (
    VendorCode like '%${query.multi_match.query}%' or 
    VendorName like '%${query.multi_match.query}%'  
  ) and V.IsDeleted=0`


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
        return result(null, { totalCount: { "_index": "ahoms-repair-request", val: totalCount }, data: res });
      });
    } else {
      return result(null, []);
    }

  });
}
//To PreferredVendor List//
VendorModel.PreferredVendorList = (PartId, CustomerId, result) => {

  if (PartId) {
    var query = `Select PrimaryVendorId from tbl_parts where IsDeleted=0 and PartId='${PartId}' `;
    con.query(query, (err, res) => {
      if (err) return result(err, null);
      if (res.length > 0 && res[0].PrimaryVendorId != null) {
        var sql = `Select VendorId,VendorCode,VendorName,if(c.CustomerId>0,'Directed','-') as Directed,IsFlatRateRepair,VendorLocation,VendorCurrencyCode,
        Case v.VendorTypeId when "B" then "OEM" else "-" end as VendorTypeName
        from tbl_vendors v
        Left join tbl_customers c on FIND_IN_SET(v.VendorId,c.DirectedVendors) and CustomerId=${CustomerId}
        where v.IsDeleted=0 and VendorId IN (${res[0].PrimaryVendorId})
        ORDER BY field(VendorId,${res[0].PrimaryVendorId})`;
        con.query(sql, (err1, res1) => {
          if (err1) return result(null, []);
          return result(null, res1);
        });
      } else {
        return result(null, []);
      }
    });
  } else {
    return result(null, []);
  }

};
//
VendorModel.ExportToExcel = (reqBody, VendorIds, result) => {
  var obj = new VendorModel(reqBody);
  var wheresql = '';
  var selectsql = ` SELECT v.VendorCode as VendorId,v.VendorName as VendorName, case v.Status
  WHEN 1 THEN 'FALSE' WHEN 0 THEN 'TRUE' ELSE '-' end Inactive,'' as Contact,
  ab1.StreetAddress as AddressLineOne,ab1.SuiteOrApt as AddressLineTwo,
  ab1.City as City,
  s1.StateName as State,ab1.Zip as Zip,
  c1.CountryName as Country,case v.VendorTypeId
  WHEN 'V' THEN '${Constants.array_vendor_type['V']}'
  WHEN 'M' THEN '${Constants.array_vendor_type['M']}'
  WHEN 'B' THEN '${Constants.array_vendor_type['B']}'
  ELSE '-'
  end VendorTypeName,0 as 1099Type,ab1.PhoneNoPrimary as Telephone1,ab1.PhoneNoPrimary as Telephone2,ab1.Fax as FaxNumber,v.VendorEmail as VendorEmail,
  v.website as VendorWebSite,v.ShippingAccountNo as AccountNumber,'' as OfficeManager
,v.VendorCurrencyCode,c2.CountryName as VendorCountry,c3.CountryName as VendorAssignedCountry
  FROM tbl_vendors v
  LEFT JOIN tbl_address_book ab1 on ab1.IdentityId=v.VendorId and ab1.IdentityType=2 
  LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
  LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId

  LEFT JOIN tbl_countries c2 on c2.CountryId=v.VendorCountryId
  LEFT JOIN tbl_countries c3 on c3.CountryId=v.VendorLocation
  WHERE v.IsDeleted=0 `;

  if (obj.VendorName != "") {
    wheresql += " and ( v.VendorName ='" + obj.VendorName + "' ) ";
  }
  if (obj.VendorTypeId != "") {
    wheresql += " and ( v.VendorTypeId ='" + obj.VendorTypeId + "' ) ";
  }
  if (obj.IsCorpVendor != "") {
    wheresql += " and ( v.IsCorpVendor ='" + obj.IsCorpVendor + "' ) ";
  }
  if (reqBody.hasOwnProperty('Status') == true && reqBody.Status != "") {
    wheresql += " and ( v.Status ='" + reqBody.Status + "' ) ";
  }
  if (reqBody.hasOwnProperty('IsCSVProcessed') == true && obj.IsCSVProcessed != "") {
    wheresql += " and ( v.IsCSVProcessed ='" + obj.IsCSVProcessed + "' ) ";
  }

  if (reqBody.hasOwnProperty('VendorLocation') == true && reqBody.VendorLocation != "" && reqBody.VendorLocation != 0) {
    wheresql += " and ( v.VendorLocation ='" + reqBody.VendorLocation + "' ) ";
  }
  if (reqBody.hasOwnProperty('VendorCurrencyCode') == true && reqBody.VendorCurrencyCode != "") {
    wheresql += " and ( v.VendorCurrencyCode ='" + reqBody.VendorCurrencyCode + "' ) ";
  }
  if (VendorIds != '') {
    wheresql += ` and v.VendorId in(` + VendorIds + `) `;
  }
  var UpdateIsCSV = ' UPDATE tbl_vendors v SET v.IsCSVProcessed =1 where v.IsDeleted=0 ';
  var sqlArray = []; var obj = {};
  obj.sqlUpdateIsCSVProcessed = UpdateIsCSV + wheresql;

  wheresql += ` ORDER BY v.VendorId DESC`;
  obj.sqlExcel = selectsql + wheresql;
  sqlArray.push(obj);
  //console.log("sqlExcel=" + sqlArray[0].sqlExcel);
  // console.log("sqlUpdateIsCSVProcessed = " + sqlArray[0].sqlUpdateIsCSVProcessed);
  return sqlArray;

};

// VendorModel.UpdateIsCSVProcessed = (ids, result) => {
//   if (ids != '')
//     var sql = `UPDATE tbl_vendors SET IsCSVProcessed =1  WHERE IsDeleted=0 and VendorId in (${ids}) `;
//   else
//     var sql = `UPDATE tbl_vendors SET IsCSVProcessed =1  WHERE IsDeleted=0 `;

//   console.log("UpdateIsCSVProcessed=" + sql);
//   con.query(sql, (err, res) => {
//     if (err) {
//       result(err, null);
//       return;
//     }
//     if (res.affectedRows == 0) {
//       result({ msg: "not found" }, null);
//       return;
//     }
//     return result(null, res);
//   });
// };
// check customer currency update
VendorModel.checkUpdateAvailable = (Ven, result) => {
  var sql = VendorModel.viewquery(Ven.VendorId);
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    res[0].TotalCount = 0;
    if (res[0].VendorCurrencyCode != Ven.VendorCurrencyCode) {

      con.query(`SELECT Count(*) as TotalCount FROM tbl_quotes WHERE VendorId='${Ven.VendorId}' `, (err1, res1) => {
        if (err1) {
          result(null, err1);
          return;
        }
        // console.log("Total Customer Count:", res1[0]);
        result(null, res1[0]);
        return;
      });

    } else {
      result(null, res[0]);
      return;
    }
  });
}
VendorModel.checkUpdateAvailable1 = (VendorId, result) => {
  con.query(`SELECT Count(*) as TotalCount FROM tbl_quotes WHERE VendorId='${VendorId}' `, (err1, res1) => {
    if (err1) {
      result(null, err1);
      return;
    }
    // console.log("Total Customer Count:", res1[0]);
    if (res1[0].TotalCount > 0) {
      result(null, false);
      return;
    } else {
      result(null, true);
      return;
    }

  });
}
VendorModel.checkDuplicateVendor = (VendorName, VendorCode, VendorId, result) => {
  var sql = `SELECT * FROM tbl_vendors where IsDeleted=0 and VendorName='${VendorName}' and VendorCode='${VendorCode}'`;
  if (VendorId > 0) {
    sql += ` and VendorId<>${VendorId}`;
  }
  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) {
      return result(err, null);
    }
    return result(null, res);
  });

};
module.exports = VendorModel;
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
const UPS = require("../controllers/ups.controller.js");

const CustomerAddress = function FuncName(objAddress, req) {
  this.AddressId = objAddress.AddressId ? objAddress.AddressId : 0;
  this.IdentityType = objAddress.IdentityType ? objAddress.IdentityType : 0;
  this.IdentityId = objAddress.IdentityId ? objAddress.IdentityId : 0;
  this.AddressType = objAddress.AddressType ? objAddress.AddressType : 0;
  this.StreetAddress = objAddress.StreetAddress ? objAddress.StreetAddress : '';
  this.SuiteOrApt = objAddress.SuiteOrApt ? objAddress.SuiteOrApt : '';
  this.City = objAddress.City ? objAddress.City : 0;
  this.StateId = objAddress.StateId ? objAddress.StateId : 0;
  this.CountryId = objAddress.CountryId ? objAddress.CountryId : '';
  this.Zip = objAddress.Zip ? objAddress.Zip : '';
  this.Email = objAddress.Email ? objAddress.Email : '';
  this.PhoneNoPrimary = objAddress.PhoneNoPrimary ? objAddress.PhoneNoPrimary : '';
  this.PhoneNoSecondary = objAddress.PhoneNoSecondary ? objAddress.PhoneNoSecondary : '';
  this.Fax = objAddress.Fax ? objAddress.Fax : '';
  this.IsContactAddress = objAddress.IsContactAddress ? 1 : 0;
  this.IsShippingAddress = objAddress.IsShippingAddress ? 1 : 0;
  this.IsBillingAddress = objAddress.IsBillingAddress ? 1 : 0;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objAddress.authuser && objAddress.authuser.UserId) ? objAddress.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objAddress.authuser && objAddress.authuser.UserId) ? objAddress.authuser.UserId : TokenUserId;
  //Common for Create & Edit
  this.AddressList = objAddress.AddressList;
};


CustomerAddress.create = (objmodel, result) => {

  var sql = ``;
  sql = `insert into tbl_address_book(IdentityType,IdentityId,AddressType,StreetAddress,
    SuiteOrApt,City,StateId,CountryId,Zip,PhoneNoPrimary,PhoneNoSecondary,
    Fax,IsContactAddress,IsShippingAddress,IsBillingAddress,Created,CreatedBy) values`;

  for (let val of objmodel.AddressList) {
    val = escapeSqlValues(val);
    let addressvar = new CustomerAddress(val, objmodel);
    sql = sql + `('${addressvar.IdentityType}','${objmodel.IdentityId}','${addressvar.AddressType}',
   '${addressvar.StreetAddress}','${addressvar.SuiteOrApt}','${addressvar.City}','${addressvar.StateId}',
   '${addressvar.CountryId}','${addressvar.Zip}','${addressvar.PhoneNoPrimary}','${addressvar.PhoneNoSecondary}',
   '${addressvar.Fax}','${addressvar.IsContactAddress}','${addressvar.IsShippingAddress}','${addressvar.IsBillingAddress}',
   '${addressvar.Created}','${addressvar.CreatedBy}'),`;
  }

  var Query = sql.slice(0, -1);
  con.query(Query, (err, res) => {
    if (err) {
      console.log(err);
      return result(err, null);
    }
    for (let val of objmodel.AddressList) {
      val.AddressId = res.insertId;
    }
    UPS.singleAddressValidate(objmodel.AddressList, 'bulk', (respo) => { });
    return result(null, { id: res.insertId, ...objmodel });
  });

};


CustomerAddress.listquery = (IdentityType, IdentityId, Type) => {
  var Addressquery = `SELECT ab.IdentityType as IdentityTypeId,
  case ab.IdentityType
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  WHEN 2 THEN '${Constants.array_identity_type[2]}'
  ELSE '-'
  end IdentityType,
  IdentityId,StreetAddress,SuiteOrApt,ab.City,ab.CountryId,ab.StateId,s.StateName,s.StateCode,co.CountryName,ab.Zip,ab.Email,
  ab.PhoneNoPrimary,ab.PhoneNoSecondary,ab.Fax,ab.IsContactAddress,ab.IsShippingAddress,ab.IsBillingAddress,AddressId,CountryCode,StateCode,ab.IsUPSVerified,
  v.VendorName, c.CompanyName as CustomerName, c.UPSShipperNumber as CustomerUPSShipperNumber, v.UPSShipperNumber as VendorUPSShipperNumber

  FROM tbl_address_book as ab      
  LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
  LEFT JOIN tbl_states s on s.StateId=ab.StateId 
  LEFT JOIN tbl_vendors v on v.VendorId='${IdentityId}' AND ab.IdentityType = 2
  LEFT JOIN tbl_customers c on c.CustomerId='${IdentityId}' AND ab.IdentityType = 1 
  where ab.IdentityType = '${IdentityType}' AND ab.IsDeleted=0     
  and ab.IdentityId='${IdentityId}' `;
  switch (Type) {
    case 1:
      Addressquery += ` AND IsContactAddress =1 `;
      break;
    case 2:
      Addressquery += ` AND IsBillingAddress =1 `;
      break;
    case 3:
      Addressquery += ` AND IsShippingAddress =1 `;
      break;
  }
  // console.log("Addressquery=" + Addressquery)
  return Addressquery;
};

CustomerAddress.View = (AddressId) => {
  return `SELECT ab.IdentityType as IdentityTypeId,
  case ab.IdentityType
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  ELSE '${Constants.array_identity_type[2]}'
  end IdentityType,
  IdentityId,StreetAddress,SuiteOrApt,City,ab.CountryId,ab.StateId,s.StateName,co.CountryName,Zip,Email,
  PhoneNoPrimary,PhoneNoSecondary,Fax,IsContactAddress,IsShippingAddress,IsBillingAddress,AddressId,ab.IsUPSVerified,co.CountryCode,s.StateCode
  FROM tbl_address_book as ab      
  LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
  LEFT JOIN tbl_states s on s.StateId=ab.StateId 
  where ab.AddressId='${AddressId}'`;

};


CustomerAddress.ViewContactAddressByVendorId = (VendorId, result) => {
  return `SELECT ab.IdentityType as IdentityTypeId,
  case ab.IdentityType
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  ELSE '${Constants.array_identity_type[2]}'
  end IdentityType,
  IdentityId,StreetAddress,SuiteOrApt,City,ab.CountryId,ab.StateId,s.StateName,co.CountryName,Zip,Email,
  PhoneNoPrimary,PhoneNoSecondary,Fax,IsContactAddress,IsShippingAddress,IsBillingAddress,AddressId,ab.IsUPSVerified
  FROM tbl_address_book as ab      
  LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
  LEFT JOIN tbl_states s on s.StateId=ab.StateId 
  where ab.IdentityType=2 and ab.IsContactAddress=1 and ab.IdentityId='${VendorId}'`;

};


CustomerAddress.ViewContactAddressByCustomerId = (CustomerId, result) => {
  return `SELECT ab.IdentityType as IdentityTypeId,
  case ab.IdentityType
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  ELSE '${Constants.array_identity_type[2]}'
  end IdentityType,
  IdentityId,StreetAddress,SuiteOrApt,City,ab.CountryId,ab.StateId,s.StateName,co.CountryName,Zip,Email,
  PhoneNoPrimary,PhoneNoSecondary,Fax,IsContactAddress,IsShippingAddress,IsBillingAddress,AddressId,ab.IsUPSVerified
  FROM tbl_address_book as ab      
  LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
  LEFT JOIN tbl_states s on s.StateId=ab.StateId 
  where ab.IsDeleted=0 and ab.IdentityType=1 and ab.IsContactAddress=1 and ab.IdentityId='${CustomerId}'`;
  //console.log("Address :" + Addressquery);

};


CustomerAddress.viewAddress = (AddressId, result) => {
  var Addressquery = CustomerAddress.View(AddressId);
  con.query(Addressquery, (err, res) => {
    if (err) {
      return result(err, null);
    }
    if (res.length > 0) {
      return result(null, res);
    } else {
      return result({ msg: "Address not found" }, null);
    }
  });
};

CustomerAddress.listbyIdentity = (reqBody, result) => {
  var Type = reqBody.Type ? reqBody.Type : 0;
  var Addressquery = CustomerAddress.listquery(reqBody.IdentityType, reqBody.IdentityId, Type);
  con.query(Addressquery, (err, res) => {
    if (err) {
      result(err, null);
      return
    }
    if (res.length > 0) {
      return result(null, res);
    }
    else {
      return result({ msg: "Address not found" }, null);
    }
  });
};



CustomerAddress.updateById = (objmodel, result) => {
  for (let val of objmodel.AddressList) {
    val.AddressType = val.AddressType ? val.AddressType : 1;
    val.IsBillingAddress = val.IsBillingAddress ? 1 : 0;
    val.IsShippingAddress = val.IsShippingAddress ? 1 : 0;
    val.IsContactAddress = val.IsContactAddress ? 1 : 0;

    var sql = `UPDATE tbl_address_book SET IdentityType =?,IdentityId =?,
    AddressType =?,StreetAddress=?,SuiteOrApt=?,City=?,StateId=?,CountryId=?,
    Zip=?,PhoneNoPrimary=?,PhoneNoSecondary=?,Fax=?,Modified=?,ModifiedBy=? WHERE AddressId = ?`
    var values = [
      val.IdentityType, objmodel.IdentityId, val.AddressType,
      val.StreetAddress, val.SuiteOrApt,
      val.City, val.StateId, val.CountryId, val.Zip,
      val.PhoneNoPrimary, val.PhoneNoSecondary, val.Fax,
      objmodel.hasOwnProperty('Modified') ? objmodel.Modified : '0',
      objmodel.hasOwnProperty('ModifiedBy') ? objmodel.ModifiedBy : '0',
      val.AddressId
    ]
    con.query(sql, values, function (err, result) {
      if (err)
        return result(err, null);
    });

  }
  result(null, { id: objmodel.AddressId, ...objmodel });

};

CustomerAddress.remove = (id, result) => {
  var sql = `UPDATE tbl_address_book SET IsDeleted = 1 WHERE AddressId = ${id}`;
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);

    if (res.affectedRows == 0)
      return result({ msg: "Address not found" }, null);

    result(null, res);
  });
};


CustomerAddress.SetCustomerPrimaryAddress = (objmodel, result) => {
  var sqlQry = "";
  var sqlQry1 = "";
  if (objmodel.AddressType == 1) {
    sqlQry = `Update tbl_address_book set IsContactAddress=0 where IdentityType=${objmodel.IdentityType} and IdentityId=${objmodel.IdentityId} and  IsContactAddress=1;`;
    sqlQry1 = `Update tbl_address_book set IsContactAddress=1 where IdentityType=${objmodel.IdentityType} and IdentityId=${objmodel.IdentityId} and AddressId=${objmodel.AddressId};`;
  }
  else if (objmodel.AddressType == 2) {
    sqlQry = `Update tbl_address_book set IsShippingAddress=0 where IdentityType=${objmodel.IdentityType} and IdentityId=${objmodel.IdentityId} and  IsShippingAddress=1;`;
    sqlQry1 = `Update tbl_address_book set IsShippingAddress=1 where IdentityType=${objmodel.IdentityType} and IdentityId=${objmodel.IdentityId} and AddressId=${objmodel.AddressId};`;
  }
  else if (objmodel.AddressType == 3) {
    sqlQry = `Update tbl_address_book set IsBillingAddress=0 where IdentityType=${objmodel.IdentityType} and IdentityId=${objmodel.IdentityId} and  IsBillingAddress=1;`;
    sqlQry1 = `Update tbl_address_book set IsBillingAddress=1 where IdentityType=${objmodel.IdentityType} and IdentityId=${objmodel.IdentityId} and AddressId=${objmodel.AddressId};`;
  }

  con.query(sqlQry, (err, res) => {
    if (err)
      return result(err, null);

    con.query(sqlQry1, (err, res) => {
      if (err)
        return result(err, null);
      var list_query = CustomerAddress.listquery(objmodel.IdentityType, objmodel.IdentityId);
      con.query(list_query, (err, resaddr) => {
        if (err)
          return result(err, null);

        return result(null, { AddressList: resaddr });
      });
    });
  });


}


CustomerAddress.GetAddressByIdQuery = (AddressId, result) => {
  return `SELECT ab.IdentityType as IdentityTypeId,
    case ab.IdentityType
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    ELSE '${Constants.array_identity_type[2]}'
    end IdentityType,
    IdentityId,StreetAddress,SuiteOrApt,City,ab.CountryId,ab.StateId,s.StateName,co.CountryName,Zip,Email,
    PhoneNoPrimary,PhoneNoSecondary,Fax,IsContactAddress,IsShippingAddress,IsBillingAddress,AddressId,ab.IsUPSVerified
    FROM tbl_address_book as ab      
    LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
    LEFT JOIN tbl_states s on s.StateId=ab.StateId 
    where ab.IsDeleted=0 and ab.AddressId='${AddressId}'`;
};

CustomerAddress.GetAddressByCustomerIdQuery = (CustomerId, result) => {
  return `SELECT ab.IdentityType as IdentityTypeId,
    case ab.IdentityType
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    ELSE '${Constants.array_identity_type[2]}'
    end IdentityType,
    IdentityId,StreetAddress,SuiteOrApt,City,ab.CountryId,ab.StateId,s.StateName,co.CountryName,Zip,Email,
    PhoneNoPrimary,PhoneNoSecondary,Fax,IsContactAddress,IsShippingAddress,IsBillingAddress,AddressId,ab.IsUPSVerified
    FROM tbl_address_book as ab      
    LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
    LEFT JOIN tbl_states s on s.StateId=ab.StateId 
    where ab.IsDeleted=0 and ab.IdentityType=1 and ab.IdentityId='${CustomerId}'`;
};


CustomerAddress.GetShippingAddressIdByCustomerId = (CustomerId, result) => {
  return `SELECT ab.IdentityType as IdentityTypeId,
  case ab.IdentityType
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  ELSE '${Constants.array_identity_type[2]}'
  end IdentityType,
  IdentityId,StreetAddress,SuiteOrApt,City,ab.CountryId,ab.StateId,s.StateName,co.CountryName,Zip,Email,
  PhoneNoPrimary,PhoneNoSecondary,Fax,IsContactAddress,IsShippingAddress,IsBillingAddress,AddressId,ab.IsUPSVerified,s.StateCode,co.CountryCode
  FROM tbl_address_book as ab      
  LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
  LEFT JOIN tbl_states s on s.StateId=ab.StateId 
  where ab.IsDeleted=0 and ab.IdentityType=1 and IsShippingAddress=1 and ab.IdentityId='${CustomerId}'`;

};

CustomerAddress.GetShippingAddressIdByAddressId = (AddressId, result) => {
  return `SELECT ab.IdentityType as IdentityTypeId,
  case ab.IdentityType
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  ELSE '${Constants.array_identity_type[2]}'
  end IdentityType,
  IdentityId,StreetAddress,SuiteOrApt,City,ab.CountryId,ab.StateId,s.StateName,co.CountryName,Zip,Email,
  PhoneNoPrimary,PhoneNoSecondary,Fax,IsContactAddress,IsShippingAddress,IsBillingAddress,AddressId,ab.IsUPSVerified,s.StateCode,co.CountryCode
  FROM tbl_address_book as ab      
  LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
  LEFT JOIN tbl_states s on s.StateId=ab.StateId 
  where ab.IsDeleted=0   and ab.AddressId='${AddressId}'`;

};

CustomerAddress.GetRemitToAddressIdByCustomerId = (CustomerId, result) => {
  return `SELECT co.EntityAddress1, co.EntityAddress2,co.EntityCity,co.EntityState,co.EntityZip,co.EntityPhone1,co.EntityPhone2,co.CountryId,co.CountryCode,co.CountryName,co.EntityCompanyName,co.EntityId,co.EntityName,co.EntityVATNo,co.EntityEmail,co.EntityWebsite,co.EntityInvoiceText
  FROM tbl_customers as c      
  LEFT JOIN tbl_countries co on co.CountryId=c.CustomerLocation
  where c.IsDeleted=0 and c.CustomerId='${CustomerId}'`;
};

CustomerAddress.GetRemitToAddressIdByVendorId = (VendorId, result) => {
  return `SELECT co.EntityAddress1, co.EntityAddress2,co.EntityCity,co.EntityState,co.EntityZip,co.EntityPhone1,co.EntityPhone2,co.CountryId,co.CountryCode,co.CountryName,co.EntityCompanyName,co.EntityId,co.EntityName,co.EntityVATNo,co.EntityEmail,co.EntityWebsite,co.EntityInvoiceText
  FROM tbl_vendors as v      
  LEFT JOIN tbl_countries co on co.CountryId=v.VendorLocation
  where v.IsDeleted=0 and v.VendorId='${VendorId}'`;
};

CustomerAddress.GetRemitToAddressIdByPOId = (POId, result) => {
  return `SELECT co.EntityAddress1, co.EntityAddress2,co.EntityCity,co.EntityState,co.EntityZip,co.EntityPhone1,co.EntityPhone2,co.CountryId,co.CountryCode,co.CountryName,co.EntityCompanyName,co.EntityId,co.EntityName,co.EntityVATNo,co.EntityEmail,co.EntityWebsite,co.EntityInvoiceText
  FROM tbl_sales_order as so
  LEFT JOIN tbl_customers c on so.CustomerId=c.CustomerId AND c.IsDeleted=0
  LEFT JOIN tbl_countries co on co.CountryId=c.CustomerLocation
  where so.POId='${POId}' GROUP BY so.CustomerId;`;
};

CustomerAddress.GetRemitToAddressIdByRRId = (RRId, result) => {
  return `SELECT co.EntityAddress1, co.EntityAddress2,co.EntityCity,co.EntityState,co.EntityZip,co.EntityPhone1,co.EntityPhone2,co.CountryId,co.CountryCode,co.CountryName,co.EntityCompanyName,co.EntityId,co.EntityName,co.EntityVATNo,co.EntityEmail,co.EntityWebsite,co.EntityInvoiceText
  FROM tbl_repair_request as rr
  LEFT JOIN tbl_customers c on rr.CustomerId=c.CustomerId AND c.IsDeleted=0
  LEFT JOIN tbl_countries co on co.CountryId=c.CustomerLocation
  where rr.RRId='${RRId}' GROUP BY rr.CustomerId;`;
};

CustomerAddress.GetRemitToAddressIdByMROId = (MROId, result) => {
  return `SELECT co.EntityAddress1, co.EntityAddress2,co.EntityCity,co.EntityState,co.EntityZip,co.EntityPhone1,co.EntityPhone2,co.CountryId,co.CountryCode,co.CountryName,co.EntityCompanyName,co.EntityId,co.EntityName,co.EntityVATNo,co.EntityEmail,co.EntityWebsite,co.EntityInvoiceText
  FROM tbl_mro as mro
  LEFT JOIN tbl_customers c on mro.CustomerId=c.CustomerId AND c.IsDeleted=0
  LEFT JOIN tbl_countries co on co.CountryId=c.CustomerLocation
  where mro.MROId='${MROId}' GROUP BY mro.CustomerId;`;
};

CustomerAddress.GetAddressByPOIdQuery = (POId, result) => {
  return `SELECT ab.IdentityType as IdentityTypeId,
    case ab.IdentityType
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    ELSE '${Constants.array_identity_type[2]}'
    end IdentityType,
    IdentityId,StreetAddress,SuiteOrApt,City,ab.CountryId,ab.StateId,s.StateName,co.CountryName,Zip,Email,
    PhoneNoPrimary,PhoneNoSecondary,Fax,IsContactAddress,IsShippingAddress,IsBillingAddress,AddressId,ab.IsUPSVerified
    FROM tbl_sales_order as so   
    LEFT JOIN tbl_address_book ab on ab.IdentityId=so.CustomerId AND ab.IdentityType=1
    LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
    LEFT JOIN tbl_states s on s.StateId=ab.StateId 
    where so.IsDeleted=0 and so.POId='${POId}'`;
};

CustomerAddress.GetBillingAddressIdByCustomerId = (CustomerId, result) => {
  return `SELECT ab.IdentityType as IdentityTypeId,
  case ab.IdentityType
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  ELSE '${Constants.array_identity_type[2]}'
  end IdentityType,
  IdentityId,StreetAddress,SuiteOrApt,City,ab.CountryId,ab.StateId,s.StateName,co.CountryName,Zip,Email,
  PhoneNoPrimary,PhoneNoSecondary,Fax,IsContactAddress,IsShippingAddress,IsBillingAddress,AddressId,ab.IsUPSVerified,s.StateCode,co.CountryCode
  FROM tbl_address_book as ab      
  LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
  LEFT JOIN tbl_states s on s.StateId=ab.StateId 
  where ab.IsDeleted=0 and ab.IdentityType=1 and IsBillingAddress=1 and ab.IdentityId='${CustomerId}'`;

};

CustomerAddress.GetShippingAddressIdByVendorId = (VendorId, result) => {
  return `SELECT AddressId FROM tbl_address_book where IsDeleted = 0 AND IdentityType='${Constants.CONST_IDENTITY_TYPE_VENDOR}'  and IsShippingAddress=1 and IdentityId='${VendorId}'`;
};


CustomerAddress.GetBillingAddressIdByVendorId = (VendorId, result) => {
  return `SELECT AddressId FROM tbl_address_book where IsDeleted = 0 AND IdentityType='${Constants.CONST_IDENTITY_TYPE_VENDOR}'  and IsBillingAddress=1 and IdentityId='${VendorId}'`;
};

module.exports = CustomerAddress;
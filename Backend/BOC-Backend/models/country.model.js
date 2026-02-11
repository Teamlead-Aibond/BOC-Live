/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const CountryModel = function (objCountry) {
  this.CountryId = objCountry.CountryId;
  this.CountryCode = objCountry.CountryCode;
  this.CountryName = objCountry.CountryName;
  this.VatTaxPercentage = objCountry.VatTaxPercentage ? objCountry.VatTaxPercentage : 0;
  this.CurrencyCode = objCountry.CurrencyCode ? objCountry.CurrencyCode : '';

  this.EntityId = objCountry.EntityId ? objCountry.EntityId : '';
  this.EntityName = objCountry.EntityName ? objCountry.EntityName : '';
  this.ReportPrintAs = objCountry.ReportPrintAs ? objCountry.ReportPrintAs : '';
  this.FederalId = objCountry.FederalId ? objCountry.FederalId : '';
  this.EntityCompanyName = objCountry.EntityCompanyName ? objCountry.EntityCompanyName : '';
  this.PrintAs = objCountry.PrintAs ? objCountry.PrintAs : '';
  this.FirstTaxMonth = objCountry.FirstTaxMonth && objCountry.FirstTaxMonth != '' ? objCountry.FirstTaxMonth : null;
  this.TaxId = objCountry.TaxId ? objCountry.TaxId : '';
  this.Separate1099 = objCountry.Separate1099 ? objCountry.Separate1099 : 0;

  this.EntityPhone1 = objCountry.EntityPhone1 ? objCountry.EntityPhone1 : '';
  this.EntityPhone2 = objCountry.EntityPhone2 ? objCountry.EntityPhone2 : '';
  this.EntityAddress1 = objCountry.EntityAddress1 ? objCountry.EntityAddress1 : '';
  this.EntityAddress2 = objCountry.EntityAddress2 ? objCountry.EntityAddress2 : '';
  this.EntityCity = objCountry.EntityCity ? objCountry.EntityCity : '';
  this.EntityState = objCountry.EntityState ? objCountry.EntityState : '';
  this.EntityZip = objCountry.EntityZip ? objCountry.EntityZip : '';
  this.EntityVATNo = objCountry.EntityVATNo ? objCountry.EntityVATNo : '';

  this.EntityEmail = objCountry.EntityEmail ? objCountry.EntityEmail : '';
  this.EntityWebsite = objCountry.EntityWebsite ? objCountry.EntityWebsite : '';
  this.EntityInvoiceText = objCountry.EntityInvoiceText ? objCountry.EntityInvoiceText : '';

  this.TaxSolutionId = objCountry.TaxSolutionId ? objCountry.TaxSolutionId : '';
  this.TaxDetailId = objCountry.TaxDetailId ? objCountry.TaxDetailId : '';
  this.NoTaxDetailId = objCountry.NoTaxDetailId ? objCountry.NoTaxDetailId : '';

  this.Status = objCountry.Status;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objCountry.authuser && objCountry.authuser.UserId) ? objCountry.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objCountry.authuser && objCountry.authuser.UserId) ? objCountry.authuser.UserId : TokenUserId;
};

//To get all the countries
CountryModel.getAll = result => {
  con.query(`Select CountryId,CountryCode,CountryName,Status,VatTaxPercentage,CurrencyCode,EntityId,TaxSolutionId,TaxDetailId,NoTaxDetailId,EntityEmail,EntityWebsite,EntityInvoiceText
   from tbl_countries WHERE Status = 1 AND IsDeleted = 0 `, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}

//To get all the countries with curruncy symbol
CountryModel.getAllWithSymbol = result => {
  con.query(`Select tc.CountryId,tc.EntityId,tc.CountryCode,tc.CountryName,tc.Status,tc.VatTaxPercentage,tc.CurrencyCode, 
  CONCAT(ifnull(tc.CountryName,'-'),' - ',ifnull(tc.CurrencyCode,''),' (',ifnull(CUR.CurrencySymbol,'-'),')') as name
   from tbl_countries as tc
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = tc.CurrencyCode AND CUR.IsDeleted = 0
  WHERE tc.Status = 1 AND tc.IsDeleted = 0 `, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}

//To create a country
CountryModel.create = (Obj, result) => {
  var sql = `insert into tbl_countries(CountryCode,CountryName,VatTaxPercentage,CurrencyCode,
    EntityId,  EntityName,  ReportPrintAs,  FederalId,  EntityCompanyName,  PrintAs,  FirstTaxMonth,  TaxId,  Separate1099,  EntityPhone1,  EntityPhone2,  EntityAddress1,  EntityAddress2,  EntityCity,  EntityState,  EntityZip,    
  TaxSolutionId,TaxDetailId,NoTaxDetailId,Status,Created,CreatedBy,EntityVATNo,EntityEmail,EntityWebsite,EntityInvoiceText)
   values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [Obj.CountryCode, Obj.CountryName, Obj.VatTaxPercentage, Obj.CurrencyCode,
  Obj.EntityId, Obj.EntityName, Obj.ReportPrintAs, Obj.FederalId, Obj.EntityCompanyName,
  Obj.PrintAs, Obj.FirstTaxMonth, Obj.TaxId, Obj.Separate1099, Obj.EntityPhone1, Obj.EntityPhone2,
  Obj.EntityAddress1, Obj.EntityAddress2, Obj.EntityCity, Obj.EntityState, Obj.EntityZip,
  Obj.TaxSolutionId, Obj.TaxDetailId, Obj.NoTaxDetailId, Obj.Status, Obj.Created, Obj.CreatedBy, Obj.EntityVATNo,Obj.EntityEmail,Obj.EntityWebsite,Obj.EntityInvoiceText
  ];
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, { id: res.insertId, ...Obj });
  });
};

//To get the country info
CountryModel.findById = (CountryId, result) => {
  var sql = `SELECT c.CountryId,c.EntityId,c.CountryCode,c.CountryName,c.Status,c.VatTaxPercentage,
  c.CurrencyCode,CUR.CurrencySymbol,EntityId,  EntityName,  ReportPrintAs,  FederalId,  
  EntityCompanyName,  PrintAs,  FirstTaxMonth,  TaxId,  Separate1099,  EntityPhone1,  EntityPhone2,  
  EntityAddress1,  EntityAddress2,  EntityCity,  EntityState,  EntityZip,  
  TaxSolutionId,TaxDetailId,NoTaxDetailId,EntityVATNo,EntityEmail,EntityWebsite,EntityInvoiceText
  FROM tbl_countries c  
  LEFT JOIN tbl_currencies as CUR  ON CUR.CurrencyCode = c.CurrencyCode AND CUR.IsDeleted = 0
  WHERE c.CountryId = ${CountryId} `;
  con.query(sql, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res[0]);
    }
    return result({ msg: "Country not found" }, null);
  });
};

//To update the country
CountryModel.update = (Obj, result) => {
  var sql = ` UPDATE tbl_countries SET CountryCode = ?, CountryName = ?,Status = ?, VatTaxPercentage = ?, CurrencyCode = ?, 
  EntityId = ?,  EntityName = ?,  ReportPrintAs = ?,  FederalId = ?,  EntityCompanyName = ?,  PrintAs = ?,  FirstTaxMonth = ?,  TaxId = ?,  Separate1099 = ?,  EntityPhone1 = ?,  EntityPhone2 = ?,  EntityAddress1 = ?,  EntityAddress2 = ?,  EntityCity = ?,  EntityState = ?,  EntityZip = ?,
  TaxSolutionId = ?,  TaxDetailId = ?,  NoTaxDetailId = ?, 
  Modified = ?,Modifiedby = ?, EntityVATNo = ?, EntityEmail = ?,EntityWebsite = ?,EntityInvoiceText = ?  WHERE CountryId = ? `;
  var values = [Obj.CountryCode, Obj.CountryName, Obj.Status, Obj.VatTaxPercentage, Obj.CurrencyCode,
  Obj.EntityId, Obj.EntityName, Obj.ReportPrintAs, Obj.FederalId, Obj.EntityCompanyName, Obj.PrintAs, Obj.FirstTaxMonth, Obj.TaxId, Obj.Separate1099, Obj.EntityPhone1, Obj.EntityPhone2, Obj.EntityAddress1, Obj.EntityAddress2, Obj.EntityCity, Obj.EntityState, Obj.EntityZip,
  Obj.TaxSolutionId, Obj.TaxDetailId, Obj.NoTaxDetailId,
  Obj.Modified, Obj.Modifiedby, Obj.EntityVATNo,Obj.EntityEmail,Obj.EntityWebsite,Obj.EntityInvoiceText, Obj.CountryId];
  con.query(sql, values, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "Country not updated!" }, null);
    result(null, { id: Obj.CountryId, ...Obj });
  });
};

//To remove the country
CountryModel.remove = (id, result) => {
  var sql = `UPDATE tbl_countries SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE CountryId = '${id}' `;
  con.query(sql, (err, res) => {
    if (err)
      return result(null, err);
    if (res.affectedRows == 0)
      return result({ msg: "Country not deleted" }, null);
    return result(null, res);
  });
};
module.exports = CountryModel;
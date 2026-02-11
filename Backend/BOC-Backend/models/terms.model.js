/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");

const Term = function (objTerm) {

  this.TermsId = objTerm.TermsId;
  this.TermsName = objTerm.TermsName;
  this.TermsDays = objTerm.TermsDays;
  this.MonthOffset = objTerm.MonthOffset;
  this.Discount = objTerm.Discount;

  this.TermsType = objTerm.TermsType;
  this.IsDefaultTerm = objTerm.IsDefaultTerm;


  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objTerm.authuser && objTerm.authuser.UserId) ? objTerm.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objTerm.authuser && objTerm.authuser.UserId) ? objTerm.authuser.UserId : TokenUserId;

};


Term.getAll = (result) => {

  var sql = ``;

  sql = `SELECT TermsId,TermsName,TermsDays,MonthOffset,Discount,TermsType,
    IsDefaultTerm 
    FROM tbl_terms 
     WHERE IsDeleted=0 `;

  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};

Term.create = (Term, result) => {

  var sql = `insert into tbl_terms(TermsName,TermsDays,MonthOffset,Discount,TermsType,
        IsDefaultTerm,Created,CreatedBy)
    values(?,?,?,?,?,?,?,?)`;

  var values = [

    Term.TermsName, Term.TermsDays,
    Term.MonthOffset, Term.Discount,
    Term.TermsType, Term.IsDefaultTerm,
    Term.Created, Term.CreatedBy

  ]

  con.query(sql, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...Term });
  });
};

Term.findById = (TermsId, result) => {

  var sql = ``;

  sql = `SELECT TermsId,TermsName,TermsDays,MonthOffset,Discount,TermsType,
    IsDefaultTerm 
    FROM tbl_terms 
    WHERE TermsId = '${TermsId}' `;

  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }


    result({ kind: "Term not found" }, null);
  });
};



Term.update = (Term, result) => {

  var sql = ``;

  sql = ` UPDATE tbl_terms SET TermsName = ?, TermsDays = ?,MonthOffset = ?,Discount = ?, 
    TermsType = ?,IsDefaultTerm = ?,Modified = ?,Modifiedby = ? WHERE TermsId = ? `;
  var values = [
    Term.TermsName, Term.TermsDays, Term.MonthOffset, Term.Discount,
    Term.TermsType, Term.IsDefaultTerm, Term.Modified, Term.ModifiedBy, Term.TermsId
  ]
  con.query(sql, values, (err, res) => {
    if (err) {
      return result(null, err);
    }
    if (res.affectedRows == 0) {
      return result({ kind: "not_found" }, null);
    }
    result(null, { id: Term.TermsId, ...Term });
  });
};

Term.remove = (id, result) => {

  var sql = `UPDATE tbl_terms SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}',
     ModifiedBy='${global.authuser.UserId}' WHERE TermsId = '${id}' `;
  con.query(sql, (err, res) => {
    if (err) {
      return result(null, err);
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};
Term.listquery = (IdentityId, IdentityType) => {
  var sql = `SELECT TermsId,TermsName,TermsDays,MonthOffset,TermsType,IsDefaultTerm
  FROM tbl_terms t `
  if (Constants.CONST_IDENTITY_TYPE_CUSTOMER == IdentityType) {
    sql += ` Left Join tbl_customers c Using(TermsId) where t.IsDeleted=0 and CustomerId=${IdentityId} `;
  }
  if (Constants.CONST_IDENTITY_TYPE_PO == IdentityType) {
    sql += ` Left Join tbl_po Using(TermsId) where t.IsDeleted=0 and POId=${IdentityId} `;
  }
  if (IdentityType <= 0)
    sql += ` where t.IsDeleted=0 `;

  return sql;
};
Term.GetDefaultTerm = () => {
  var sql = `SELECT IsDefaultTerm,TermsDays,TermsId
  FROM tbl_terms t where t.IsDeleted=0 and IsDefaultTerm=1 `
  //console.log(sql);
  return sql;
};

Term.UpdateIsDefaultTermOne = (obj, result) => {
  var sql = ` UPDATE tbl_terms SET IsDefaultTerm =1,Modified='${obj.Modified}',ModifiedBy='${obj.ModifiedBy}'
   WHERE TermsId ='${obj.TermsId}' `;
  con.query(sql, (err, res) => {
    if (err) {
      return result(null, err);
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};
Term.UpdateIsDefaultTermZero = (obj, result) => {
  var sql = ` UPDATE tbl_terms SET IsDefaultTerm =0,Modified='${obj.Modified}',ModifiedBy='${obj.ModifiedBy}' 
  WHERE TermsId <> '${obj.TermsId}' `;
  con.query(sql, (err, res) => {
    if (err) {
      return result(null, err);
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};
module.exports = Term;
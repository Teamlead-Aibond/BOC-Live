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
const ContactModel = function (objContact) {
  this.ContactList = objContact.ContactList;
  this.ContactId = objContact.ContactId;
  this.IdentityType = objContact.IdentityType ? objContact.IdentityType : 0;
  this.IdentityId = objContact.IdentityId ? objContact.IdentityId : 0;
  this.ContactName = objContact.ContactName ? objContact.ContactName : '';
  this.Designation = objContact.Designation ? objContact.Designation : '';
  this.DepartmentId = objContact.DepartmentId ? objContact.DepartmentId : 0;
  this.Email = objContact.Email ? objContact.Email : '';
  this.PhoneNo = objContact.PhoneNo ? objContact.PhoneNo : '';
  this.Fax = objContact.Fax ? objContact.Fax : '';
  this.IsPrimary = objContact.IsPrimary ? 1 : 0;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  this.IsDeleted = objContact.IsDeleted ? objContact.IsDeleted : 0;
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objContact.authuser && objContact.authuser.UserId) ? objContact.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objContact.authuser && objContact.authuser.UserId) ? objContact.authuser.UserId : TokenUserId;
};

//To get all the contacts
ContactModel.getAll = result => {
  con.query(`Select ContactId,IdentityType,IdentityId,ContactName,Designation,DepartmentId,Email,PhoneNo,Fax,IsPrimary,Created from tbl_contacts where IsDeleted=0`, (err, res) => {
    if (err)
      return result(err, null);
    return result(null, res);
  });
}

//To add the contacts
ContactModel.create = (Obj, result) => {
  var sql = `insert into tbl_contacts(IdentityType,IdentityId,ContactName, Designation,DepartmentId,Email,PhoneNo,IsPrimary,Created,CreatedBy) values`;
  for (let val of Obj.ContactList) {
    val = escapeSqlValues(val);
    let ContactObj = new ContactModel(val);
    sql = sql + `('${ContactObj.IdentityType}','${Obj.IdentityId}','${ContactObj.ContactName}','${ContactObj.Designation}', '${ContactObj.DepartmentId}','${ContactObj.Email}','${ContactObj.PhoneNo}','${ContactObj.IsPrimary}','${ContactObj.Created}',  '${ContactObj.CreatedBy}'),`;
  }
  var Query = sql.slice(0, -1);
  con.query(Query, (err, res) => {
    if (err)
      return result(err, null);
    for (let val of Obj.ContactList) {
      val.ContactId = res.insertId;
    }
    return result(null, { id: res.insertId, ...Obj });
  });
};

//To return the contact list query
ContactModel.listquery = (IdentityId) => {
  return `SELECT ContactId, IdentityType as IdentityTypeId,
    case IdentityType
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
    ELSE '-'
    end IdentityType,
    IdentityId,ContactName,Designation,DepartmentId,Email,PhoneNo,Fax,Created,IsPrimary
    FROM tbl_contacts  where IsDeleted=0 and IdentityType= ${Constants.CONST_IDENTITY_TYPE_VENDOR} and IdentityId='${IdentityId}'`;

}

//To find the contact id
ContactModel.findById = (ContactId, result) => {
  con.query(`SELECT ContactId,IdentityType,IdentityId,ContactName,Designation,DepartmentId,Email,PhoneNo,Fax,IsPrimary,Created,  case IsPrimary WHEN '1' THEN 'Yes' ELSE 'No' end IsPrimaryValue FROM tbl_contacts WHERE ContactId = ${ContactId}`, (err, res) => {
    if (err)
      return result(err, null);
    if (res.length) {
      return result(null, res[0]);
    } else {
      return result({ msg: "Contact not found" }, null);
    }
  });
};

//To update the contact
ContactModel.updateById = (contact, result) => {
  for (let val of contact.ContactList) {
    val.IsPrimary = val.IsPrimary ? 1 : 0;
    var sql = 'UPDATE tbl_contacts SET IdentityType = ?, IdentityId = ?,  ContactName = ?, DepartmentId=?, Designation=?, PhoneNo=?, IsPrimary=?, Email=?,Modified=?,ModifiedBy=? WHERE ContactId = ?';
    var values = [
      val.IdentityType, contact.IdentityId, val.ContactName, val.DepartmentId, val.Designation, val.PhoneNo, val.IsPrimary,
      val.Email,
      contact.hasOwnProperty('Modified') ? contact.Modified : '0',
      contact.hasOwnProperty('ModifiedBy') ? contact.ModifiedBy : '0',
      val.ContactId
    ];
    con.query(sql, values, function (err, result) {
      if (err)
        return result(err, null);
    });
  }
  return result(null, { id: contact.ContactId, ...contact });
};

//To remvoe the contact
ContactModel.remove = (id, result) => {
  con.query("Update tbl_contacts set IsDeleted=1 WHERE ContactId = ?", id, (err, res) => {
    if (err)
      return result(err, null);
    if (res.affectedRows == 0)
      return result({ msg: "Contact not deleted" }, null);
    return result(null, res);
  });
};

//To set the contact as primary
ContactModel.SetPrimaryAddress = (contact, result) => {
  var sqlQry = `Update tbl_contacts set IsPrimary=0 where IdentityType=${contact.IdentityType} and IdentityId=${contact.IdentityId} and IsPrimary=1 ;`;
  var sqlQry1 = `Update tbl_contacts set IsPrimary=${contact.IsPrimary} where IdentityType=${contact.IdentityType} and IdentityId=${contact.IdentityId} and ContactId=${contact.ContactId};`;
  con.query(sqlQry, (err, res) => {
    if (err)
      return result(err, null);
  });
  con.query(sqlQry1, (err1, res1) => {
    if (err1)
      return result(err1, null);
  });
  return result(null, { id: contact.ContactId, ...contact });
}
module.exports = ContactModel;
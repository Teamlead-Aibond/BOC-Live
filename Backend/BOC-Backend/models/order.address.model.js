/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");
const OrderAddress = function (objOrderAddress) {
  this.AddressId = objOrderAddress.AddressId;
  this.IdentityType = objOrderAddress.IdentityType ? objOrderAddress.IdentityType : 0;
  this.IdentityId = objOrderAddress.IdentityId ? objOrderAddress.IdentityId : 0;
  this.AddressName = objOrderAddress.AddressName;
  this.AddressType = objOrderAddress.AddressType;
  this.StreetAddress = objOrderAddress.StreetAddress;
  this.SuiteOrApt = objOrderAddress.SuiteOrApt;
  this.City = objOrderAddress.City;
  this.StateId = objOrderAddress.StateId ? objOrderAddress.StateId : '0';
  this.CountryId = objOrderAddress.CountryId;
  this.Zip = objOrderAddress.Zip;
  this.AllowShipment = objOrderAddress.AllowShipment ? objOrderAddress.AllowShipment : 0;

  this.Phone = objOrderAddress.Phone;
  this.Fax = objOrderAddress.Fax;

  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objOrderAddress.authuser && objOrderAddress.authuser.UserId) ? objOrderAddress.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objOrderAddress.authuser && objOrderAddress.authuser.UserId) ? objOrderAddress.authuser.UserId : TokenUserId;
};


OrderAddress.Create = (OrderAddress1, result) => {
  OrderAddress1 = new OrderAddress(OrderAddress1);
  var sql = `insert into tbl_order_address(AddressName,IdentityType,IdentityId,AddressType,StreetAddress,SuiteOrApt,City
        ,StateId,CountryId,Zip,AllowShipment,Created,CreatedBy,Phone,Fax) 
        values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  var values = [
    OrderAddress1.AddressName, OrderAddress1.IdentityType, OrderAddress1.IdentityId, OrderAddress1.AddressType, OrderAddress1.StreetAddress
    , OrderAddress1.SuiteOrApt, OrderAddress1.City, OrderAddress1.StateId, OrderAddress1.CountryId
    , OrderAddress1.Zip, OrderAddress1.AllowShipment, OrderAddress1.Created
    , OrderAddress1.CreatedBy, OrderAddress1.Phone, OrderAddress1.Fax]



  con.query(sql, values, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }
    // console.log(res.insertId);
    result(null, { AddressId: res.insertId });
    return;

  });
}


OrderAddress.ViewAddressByIdentityQuery = (AddressType, IdentityType, IdentityId) => {
  var Addressquery = `SELECT  ab.AddressId,ab.AddressType,ab.IdentityType,ab.IdentityId,
    AddressName,StreetAddress,SuiteOrApt,ab.City,ab.CountryId,ab.StateId,s.StateName,co.CountryName,Zip,Phone,Fax,AllowShipment     
    FROM tbl_order_address as ab      
    LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
    LEFT JOIN tbl_states s on s.StateId=ab.StateId 
    where ab.AddressType=${AddressType} AND ab.IdentityType=${IdentityType} AND ab.IdentityId=${IdentityId}`;
  // console.log(Addressquery);
  return Addressquery;
}


OrderAddress.update = (objModel, result) => {
  objModel = escapeSqlValues(objModel);
  var sql = `UPDATE tbl_order_address 
  SET AddressName ='${objModel.AddressName.replace("'", "''")}' ,   
  StreetAddress = '${objModel.StreetAddress.replace("'", "''")}',
  SuiteOrApt = '${objModel.SuiteOrApt.replace("'", "''")}',  
  City = '${objModel.City.replace("'", "''")}',StateId = '${objModel.StateId}',
  CountryId = '${objModel.CountryId}',Zip = '${objModel.Zip}',
  AllowShipment = '${objModel.AllowShipment}',Phone = '${objModel.Phone}',Fax = '${objModel.Fax}',
  Modified = '${objModel.Modified}',ModifiedBy = '${objModel.ModifiedBy}'
  WHERE AddressId = '${objModel.AddressId}'`;
  // var values = [ 
  //     objModel.AddressName,
  //     objModel.StreetAddress,objModel.SuiteOrApt,      
  //     objModel.City,objModel.StateId,
  //     objModel.CountryId,objModel.Zip,
  //     objModel.AllowShipment,objModel.Phone,
  //     objModel.Fax,objModel.Modified,
  //     objModel.ModifiedBy,objModel.AddressId
  //  ]

  con.query(sql, (err, res) => {

    if (err) {

      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ msg: "Order address not found" }, null);
      return;
    }


    result(null, res);
    return;
  }
  );
};

module.exports = OrderAddress;
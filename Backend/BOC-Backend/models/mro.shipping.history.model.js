/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const { escapeSqlValues } = require("../helper/common.function.js");
const Constants = require("../config/constants.js");

const MROShippingHistoryModel = function (obj) {
    this.MROShippingHistoryId = obj.MROShippingHistoryId ? obj.MROShippingHistoryId : 0;
    this.MROId = obj.MROId ? obj.MROId : 0;
    this.POId = obj.POId ? obj.POId : 0;
    this.POItemId = obj.POItemId ? obj.POItemId : 0;
    this.SOId = obj.SOId ? obj.SOId : 0;
    this.SOItemId = obj.SOItemId ? obj.SOItemId : 0;
    this.Quantity = obj.Quantity ? obj.Quantity : 0;
    this.ShipFromIdentity = obj.ShipFromIdentity ? obj.ShipFromIdentity : 0;
    this.ShipFromId = obj.ShipFromId ? obj.ShipFromId : 0;
    this.ShipFromName = obj.ShipFromName ? obj.ShipFromName : '';
    this.ShipFromAddressId = obj.ShipFromAddressId ? obj.ShipFromAddressId : 0;
    this.ShipViaId = obj.ShipViaId ? obj.ShipViaId : 0;
    this.TrackingNo = obj.TrackingNo ? obj.TrackingNo : 0;
    this.PackWeight = obj.PackWeight ? obj.PackWeight : 0;
    this.ShippingCost = obj.ShippingCost ? obj.ShippingCost : 0;
    this.ShipDate = obj.ShipDate ? obj.ShipDate : null;
    this.ShippedBy = obj.ShippedBy ? obj.ShippedBy : 0;
    this.ShipComment = obj.ShipComment ? obj.ShipComment : 0;
    this.ShipToIdentity = obj.ShipToIdentity ? obj.ShipToIdentity : 0;
    this.ShipToId = obj.ShipToId ? obj.ShipToId : 0;
    this.ShipToName = obj.ShipToName ? obj.ShipToName : 0;
    this.ReceiveAddressId = obj.ReceiveAddressId ? obj.ReceiveAddressId : 0;
    this.ShipToAddressId = obj.ShipToAddressId ? obj.ShipToAddressId : 0;
    this.ReceivedBy = obj.ReceivedBy ? obj.ReceivedBy : 0;
    this.ReceiveDate = obj.ReceiveDate ? obj.ReceiveDate : null;
    this.ReceiveComment = obj.ReceiveComment ? obj.ReceiveComment : 0;
    this.ShowCustomerReference = obj.ShowCustomerReference ? obj.ShowCustomerReference : 0;
    this.ShowRootCause = obj.ShowRootCause ? obj.ShowRootCause : 0;
    this.Created = obj.Created ? obj.Created : cDateTime.getDateTime();
    this.Modified = obj.Modified ? obj.Modified : cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

MROShippingHistoryModel.ShipAndReceive = (obj, result) => {
    obj = escapeSqlValues(obj);
    var sql = `insert into tbl_mro_shipping_history(MROId,POId,POItemId,SOId,SOItemId,Quantity,ShipFromIdentity,ShipFromId,ShipFromName,
    ShipFromAddressId,ShipViaId,TrackingNo,PackWeight,ShippingCost,ShipDate,ShippedBy,ShipComment,ShipToIdentity,
    ShipToId,ShipToName,ReceiveAddressId,ReceivedBy,ReceiveDate,ReceiveComment,ShowCustomerReference,ShowRootCause,Created,CreatedBy)
    values('${obj.MROId}','${obj.POId}','${obj.POItemId}','${obj.SOId}',
    '${obj.SOItemId}','${obj.Quantity}','${obj.ShipFromIdentity}','${obj.ShipFromId}',
    '${obj.ShipFromName}','${obj.ShipFromAddressId}','${obj.ShipViaId}','${obj.TrackingNo}','${obj.PackWeight}',
    '${obj.ShippingCost}','${obj.ShipDate}','${obj.ShippedBy}','${obj.ShipComment}',
    '${obj.ShipToIdentity}','${obj.ShipToId}','${obj.ShipToName}','${obj.ShipToAddressId}',
    '${obj.ReceivedBy}','${obj.ReceiveDate}','${obj.ReceiveComment}','${obj.ShowCustomerReference}',
    '${obj.ShowRootCause}','${obj.Created}','${obj.CreatedBy}' )`;
    // console.log(sql)
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, { id: res.insertId, ...obj });
    });
};

MROShippingHistoryModel.Difference_In_Days = function (FromDate, ToDate, result) {

    var arr = FromDate.split('-');
    var FDate = arr[1] + "/" + arr[2] + "/" + arr[0];
    var date1 = new Date(FDate);

    var arr2 = ToDate.split('-');
    var TDate = arr2[1] + "/" + arr2[2] + "/" + arr2[0];
    var date2 = new Date(TDate);

    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
};
//
MROShippingHistoryModel.Ship = (obj, result) => {

    obj = escapeSqlValues(obj);
    var sql = `insert into tbl_mro_shipping_history(MROId,POId,POItemId,SOId,SOItemId,Quantity,
    ShipFromIdentity,ShipFromId,ShipFromName,ShipFromAddressId,ShipViaId,TrackingNo,PackWeight,ShippingCost,ShipDate,
    ShippedBy,ShipComment,ShipToIdentity,ShipToId,ShipToName,ReceiveAddressId,ShowCustomerReference,ShowRootCause,Created,CreatedBy)
    values('${obj.MROId}','${obj.POId}','${obj.POItemId}','${obj.SOId}',
    '${obj.SOItemId}','${obj.Quantity}','${obj.ShipFromIdentity}','${obj.ShipFromId}',
    '${obj.ShipFromName}','${obj.ShipFromAddressId}','${obj.ShipViaId}','${obj.TrackingNo}','${obj.PackWeight}',
    '${obj.ShippingCost}','${obj.ShipDate}','${obj.ShippedBy}','${obj.ShipComment}',
    '${obj.ShipToIdentity}','${obj.ShipToId}','${obj.ShipToName}','${obj.ShipToAddressId}','${obj.ShowCustomerReference}',
    '${obj.ShowRootCause}','${obj.Created}','${obj.CreatedBy}' )`;

    // async.parallel([
    //     function (result) { con.query(sql, result) },
    // ],
    //     function (err, results) {
    //         if (err)
    //             return result(err, null);
    //         if (results[0][0]) {
    //             result(null, { id: results[0][0], ...obj });
    //               return result(null, { id: res.insertId });
    //             return;
    //         } else {
    //             result({ msg: "Ship Record is not found" }, null);
    //             return;
    //         }
    //     });
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, { id: res.insertId });
    });

};

MROShippingHistoryModel.Receive = (objModel, result) => {

    objModel = escapeSqlValues(objModel);
    var sql = `UPDATE tbl_mro_shipping_history SET ReceiveAddressId = ?,ReceivedBy = ?,ReceiveDate = ?,
    ReceiveComment = ?,Modified = ?,ModifiedBy = ? WHERE MROShippingHistoryId = ?`;
    var values = [
        objModel.ReceiveAddressId, objModel.ReceivedBy, objModel.ReceiveDate, objModel.ReceiveComment,
        objModel.Modified, objModel.ModifiedBy, objModel.MROShippingHistoryId
    ];
    con.query(sql, values, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

MROShippingHistoryModel.View = (MROShippingHistoryId, result) => {
    con.query(`Select * from tbl_mro_shipping_history where IsDeleted=0 and  MROShippingHistoryId='${MROShippingHistoryId}'`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not found" }, null);
    });
}

MROShippingHistoryModel.List = result => {
    var sql = `Select * from tbl_mro_shipping_history where IsDeleted=0 `
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
}

MROShippingHistoryModel.POShippingHistoryList = (MROId, result) => {
    var sql = `Select MROShippingHistoryId,POId,POItemId
    From tbl_mro_shipping_history where IsDeleted=0 and ShipToId=5 and MROId=${MROId} `;
    // console.log(sql)
    return sql
}
MROShippingHistoryModel.SOShippingHistoryList = (SOId, result) => {
    var sql = `Select MROShippingHistoryId,SOId,SOItemId
    From tbl_mro_shipping_history where IsDeleted=0 and ShipFromId=5 and SOId=${SOId} `
    // console.log(sql)
    return sql
}
MROShippingHistoryModel.MROShippingHistorylistquery = (MROId) => {

    var sql = `SELECT sh.SOId,sh.SOItemId,MROShippingHistoryId,MROId,Case ShipFromIdentity
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
    ELSE '-'
    end ShipFromIdentityName,
    ShipFromId,ShipFromName,
    ShipFromAddressId,

    case ab1.IdentityType 
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
    end ShipIdentityType,
    ab1.AddressType as ShipAddressType,ab1.StreetAddress as ShipStreetAddress,
    ab1.SuiteOrApt as ShipSuiteOrApt,ab1.City as ShipCity,
    s1.StateName as ShipState,c1.CountryName as ShipCountry,
    ab1.Zip as ShipZip,ab1.Email as ShipEmail,
    ab1.PhoneNoPrimary as ShipPhoneNoPrimary,

    case ab2.IdentityType 
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
      end ReceiveIdentityType,
    ab2.AddressType as ReceiveAddressType,ab2.StreetAddress as ReceiveStreetAddress,
    ab2.SuiteOrApt as ReceiveSuiteOrApt,ab2.City as ReceiveCity,
    s2.StateName as ReceiveState,c2.CountryName as ReceiveCountry,IsPickUp,
    ab2.Zip as ReceiveZip,ab2.Email as ReceiveEmail,
    ab2.PhoneNoPrimary as ReceivePhoneNoPrimary,

    sv.ShipViaName,sv.IsShipViaUPS,TrackingNo,PackWeight,
    ShippingCost,DATE_FORMAT(ShipDate,"%Y-%m-%d") as ShipDate,ShippedBy,ShipComment, 
    Case ShipToIdentity
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
      end ShipToIdentityName,
    ShipToId,ShipToName,
    ReceiveAddressId,ReceivedBy,DATE_FORMAT(ReceiveDate,"%Y-%m-%d") as ReceiveDate,ReceiveComment
    FROM tbl_mro_shipping_history sh
    LEFT JOIN tbl_ship_via sv on sv.ShipViaId=sh.ShipViaId
    LEFT JOIN tbl_address_book ab1 on ab1.AddressId=sh.ShipFromAddressId
    LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
    LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
    LEFT JOIN tbl_address_book ab2 on ab2.AddressId=sh.ReceiveAddressId
    LEFT JOIN tbl_countries c2 on c2.CountryId=ab2.CountryId
    LEFT JOIN tbl_states s2 on s2.StateId=ab2.StateId
     WHERE sh.IsDeleted=0 and (sh.ShipFromId=5 )  and sh.MROId='${MROId}' `;
    //console.log(sql)
    return sql;
};
MROShippingHistoryModel.MROReceivingHistorylistquery = (MROId) => {

    var sql = `SELECT  sh.SOId,sh.SOItemId,MROShippingHistoryId,MROId,Case ShipFromIdentity
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
    ELSE '-'
    end ShipFromIdentityName,
    ShipFromId,ShipFromName,
    ShipFromAddressId,

    case ab1.IdentityType 
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
    end ShipIdentityType,
    ab1.AddressType as ShipAddressType,ab1.StreetAddress as ShipStreetAddress,
    ab1.SuiteOrApt as ShipSuiteOrApt,ab1.City as ShipCity,
    s1.StateName as ShipState,c1.CountryName as ShipCountry,
    ab1.Zip as ShipZip,ab1.Email as ShipEmail,
    ab1.PhoneNoPrimary as ShipPhoneNoPrimary,

    case ab2.IdentityType 
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
      end ReceiveIdentityType,
    ab2.AddressType as ReceiveAddressType,ab2.StreetAddress as ReceiveStreetAddress,
    ab2.SuiteOrApt as ReceiveSuiteOrApt,ab2.City as ReceiveCity,
    s2.StateName as ReceiveState,c2.CountryName as ReceiveCountry,IsPickUp,
    ab2.Zip as ReceiveZip,ab2.Email as ReceiveEmail,
    ab2.PhoneNoPrimary as ReceivePhoneNoPrimary,

    sv.ShipViaName,sv.IsShipViaUPS,TrackingNo,PackWeight,
    ShippingCost,DATE_FORMAT(ShipDate,"%Y-%m-%d") as ShipDate,ShippedBy,ShipComment, 
    Case ShipToIdentity
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
      end ShipToIdentityName,
    ShipToId,ShipToName,
    ReceiveAddressId,ReceivedBy,DATE_FORMAT(ReceiveDate,"%Y-%m-%d") as ReceiveDate,ReceiveComment
    FROM tbl_mro_shipping_history sh
    LEFT JOIN tbl_ship_via sv on sv.ShipViaId=sh.ShipViaId
    LEFT JOIN tbl_address_book ab1 on ab1.AddressId=sh.ShipFromAddressId
    LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
    LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
    LEFT JOIN tbl_address_book ab2 on ab2.AddressId=sh.ReceiveAddressId
    LEFT JOIN tbl_countries c2 on c2.CountryId=ab2.CountryId
    LEFT JOIN tbl_states s2 on s2.StateId=ab2.StateId
     WHERE sh.IsDeleted=0 and sh.ShipFromId=5 and sh.ReceiveAddressId>0 and sh.MROId='${MROId}' `;
    //  console.log(sql)
    return sql;
};
//
MROShippingHistoryModel.listquerybyMROIdAndMROShippingHistoryId = (MROId, MROShippingHistoryId) => {

    var sql = `SELECT MROShippingHistoryId,MROId,Case ShipFromIdentity
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
    ELSE '-'
    end ShipFromIdentityName,
    ShipFromId,ShipFromName,
    ShipFromAddressId,

    case ab1.IdentityType 
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
    end ShipIdentityType,
    ab1.AddressType as ShipAddressType,ab1.StreetAddress as ShipStreetAddress,
    ab1.SuiteOrApt as ShipSuiteOrApt,ab1.City as ShipCity,
    s1.StateName as ShipState,c1.CountryName as ShipCountry,
    ab1.Zip as ShipZip,ab1.Email as ShipEmail,
    ab1.PhoneNoPrimary as ShipPhoneNoPrimary,

    case ab2.IdentityType 
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
      end ReceiveIdentityType,
    ab2.AddressType as ReceiveAddressType,ab2.StreetAddress as ReceiveStreetAddress,
    ab2.SuiteOrApt as ReceiveSuiteOrApt,ab2.City as ReceiveCity,
    s2.StateName as ReceiveState,c2.CountryName as ReceiveCountry,IsPickUp,
    ab2.Zip as ReceiveZip,ab2.Email as ReceiveEmail,
    ab2.PhoneNoPrimary as ReceivePhoneNoPrimary,

    sv.ShipViaName,sv.IsShipViaUPS,TrackingNo,PackWeight,
    ShippingCost,DATE_FORMAT(ShipDate,"%Y-%m-%d") as ShipDate,ShippedBy,ShipComment, 
    Case ShipToIdentity
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
      end ShipToIdentityName,
    ShipToId,ShipToName,
    ReceiveAddressId,ReceivedBy,DATE_FORMAT(ReceiveDate,"%Y-%m-%d") as ReceiveDate,ReceiveComment
    FROM tbl_mro_shipping_history sh
    LEFT JOIN tbl_ship_via sv on sv.ShipViaId=sh.ShipViaId
    LEFT JOIN tbl_address_book ab1 on ab1.AddressId=sh.ShipFromAddressId
    LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
    LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
    LEFT JOIN tbl_address_book ab2 on ab2.AddressId=sh.ReceiveAddressId
    LEFT JOIN tbl_countries c2 on c2.CountryId=ab2.CountryId
    LEFT JOIN tbl_states s2 on s2.StateId=ab2.StateId
     WHERE sh.IsDeleted=0 and sh.MROId='${MROId}' and sh.MROShippingHistoryId='${MROShippingHistoryId}'`;
    //  console.log(sql)
    return sql;

};
//
MROShippingHistoryModel.ShippedItem = (MROShippingHistoryId, SOId, SOItemId) => {

    var sql = `Select s.*,si.*,sh.*
from tbl_sales_order s
Left Join tbl_sales_order_item si on si.SOId=s.SOId
Left Join tbl_mro_shipping_history sh on sh.SOId=s.SOId
 where s.IsDeleted=0 and s.SOId=${SOId} and si.SOItemId=${SOItemId} and sh.MROShippingHistoryId=${MROShippingHistoryId}; `;
    // console.log(sql)
    return sql;

};
// MROShippingHistoryModel.Update = (obj, result) => {
//     var sql = ` UPDATE tbl_mro_shipping_history SET
//     MROId=?,POId=?,POItemId=?,SOId=?,SOItemId=?,Quantity=?,ShipFromIdentity=?,ShipFromId=?,ShipFromName=?,ShipFromAddressId=?,ShipViaId=?,
//     TrackingNo=?,PackWeight=?,ShippingCost=?,ShipDate=?,ShippedBy=?,ShipComment=?,ShipToIdentity=?,
//     ShipToId=?,ShipToName=?,ReceiveAddressId=?,ReceivedBy=?,ReceiveDate=?,ReceiveComment=?,ShowCustomerReference=?,ShowRootCause=? 
//     where MROShippingHistoryId=? `
//     var values = [obj.MROId, obj.POId, obj.POItemId, obj.SOId, obj.SOItemId, obj.Quantity, obj.ShipFromIdentity, obj.ShipFromId,
//     obj.ShipFromName, obj.ShipFromAddressId, obj.ShipViaId,
//     obj.TrackingNo, obj.PackWeight, obj.ShippingCost, obj.ShipDate, obj.ShippedBy, obj.ShipComment, obj.ShipToIdentity,
//     obj.ShipToId, obj.ShipToName, obj.ReceiveAddressId, obj.ReceivedBy,
//     obj.ReceiveDate, obj.ReceiveComment, obj.ShowCustomerReference, obj.ShowRootCause, obj.MROShippingHistoryId]
//     console.log(sql, values)
//     con.query(sql, values, (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         }
//         if (res.affectedRows == 0) {
//             result({ kind: " not found" }, null);
//             return;
//         }
//         result(null, obj);
//     }
//     );
// };

MROShippingHistoryModel.update = (objModel, result) => {

    var sql = ``;

    sql = `UPDATE tbl_mro_shipping_history
    SET TrackingNo = ?,PackWeight = ?,ShippingCost = ?,
    ShipComment = ?,Modified = ?,ModifiedBy = ? WHERE MROShippingHistoryId = ?`;

    var values = [
        objModel.TrackingNo, objModel.PackWeight,
        objModel.ShippingCost, objModel.ShipComment,
        objModel.Modified, objModel.ModifiedBy, objModel.MROShippingHistoryId
    ]

    con.query(sql, values, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, objModel);
    });
};

MROShippingHistoryModel.Delete = (id, result) => {
    con.query("Update tbl_mro_shipping_history set IsDeleted=1 WHERE MROShippingHistoryId = ?", id, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: " not deleted" }, null);
            return;
        }
        result(null, res);
    });
};

module.exports = MROShippingHistoryModel;


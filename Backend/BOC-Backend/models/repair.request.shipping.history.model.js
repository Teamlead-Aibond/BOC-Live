/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
const NotificationModel = require("../models/notification.model.js");
var async = require('async');
const { escapeSqlValues } = require("../helper/common.function.js");
const aws = require("aws-sdk");
const s3 = new aws.S3();


const RRShippingHistory = function FuncName(objRRSH) {
  this.ShippingHistoryId = objRRSH.ShippingHistoryId ? objRRSH.ShippingHistoryId : 0;
  this.MROId = objRRSH.MROId ? objRRSH.MROId : 0;
  this.RRId = objRRSH.RRId ? objRRSH.RRId : 0;
  this.ShipFromIdentity = objRRSH.ShipFromIdentity ? objRRSH.ShipFromIdentity : 0;
  this.ShipFromId = objRRSH.ShipFromId ? objRRSH.ShipFromId : 0;
  this.ShipFromName = objRRSH.ShipFromName ? objRRSH.ShipFromName : '';
  this.ShipFromAddressId = objRRSH.ShipFromAddressId ? objRRSH.ShipFromAddressId : 0;
  this.ShipViaId = objRRSH.ShipViaId ? objRRSH.ShipViaId : 0;

  this.TrackingNo = objRRSH.TrackingNo ? objRRSH.TrackingNo : '';
  this.PackWeight = objRRSH.PackWeight ? objRRSH.PackWeight : 0;
  this.ShippingCost = objRRSH.ShippingCost ? objRRSH.ShippingCost : 0;
  this.ShipDate = objRRSH.ShipDate ? objRRSH.ShipDate : null;

  this.ShippedBy = objRRSH.ShippedBy ? objRRSH.ShippedBy : '';
  this.ShipComment = objRRSH.ShipComment ? objRRSH.ShipComment : '';
  this.ShipToIdentity = objRRSH.ShipToIdentity ? objRRSH.ShipToIdentity : 0;
  this.ShipToId = objRRSH.ShipToId ? objRRSH.ShipToId : 0;
  this.ShipToName = objRRSH.ShipToName ? objRRSH.ShipToName : '';
  this.ShipToAddressId = objRRSH.ShipToAddressId ? objRRSH.ShipToAddressId : 0;
  this.ReceiveAddressId = objRRSH.ReceiveAddressId ? objRRSH.ReceiveAddressId : 0;
  this.ReceivedBy = objRRSH.ReceivedBy ? objRRSH.ReceivedBy : 0;
  this.ReceiveDate = objRRSH.ReceiveDate ? objRRSH.ReceiveDate : null;
  this.ReceiveComment = objRRSH.ReceiveComment ? objRRSH.ReceiveComment : '';

  this.ShowCustomerReference = objRRSH.ShowCustomerReference ? objRRSH.ShowCustomerReference : 0;
  this.ShowRootCause = objRRSH.ShowRootCause ? objRRSH.ShowRootCause : 0;

  this.authuser = objRRSH.authuser ? objRRSH.authuser : {};

  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objRRSH.authuser && objRRSH.authuser.UserId) ? objRRSH.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objRRSH.authuser && objRRSH.authuser.UserId) ? objRRSH.authuser.UserId : TokenUserId;
  this.ShippingStatus = objRRSH.ShippingStatus ? objRRSH.ShippingStatus : 0;
  this.PickedUpBy = objRRSH.PickedUpBy ? objRRSH.PickedUpBy : '';
  this.PickedUpDate = objRRSH.PickedUpDate ? objRRSH.PickedUpDate : null;
  this.ReadyForPickUpDate = objRRSH.ReadyForPickUpDate ? objRRSH.ReadyForPickUpDate : null;
  this.PickUPSignature = objRRSH.PickUPSignature ? objRRSH.PickUPSignature : '';
  // For Server Side Search 
  this.start = objRRSH.start ? objRRSH.start : 0;
  this.length = objRRSH.length ? objRRSH.length : 0;
  this.search = objRRSH.search;
  this.sortCol = objRRSH.sortCol;
  this.sortDir = objRRSH.sortDir;
  this.sortColName = objRRSH.sortColName;
  this.order = objRRSH.order;
  this.columns = objRRSH.columns;
  this.draw = objRRSH.draw;
  this.VendorId = objRRSH.VendorId ? objRRSH.VendorId : 0;
  this.UserId = objRRSH.UserId ? objRRSH.UserId : 0;
};


RRShippingHistory.ship = (objModel, result) => {

  objModel = escapeSqlValues(objModel);
  var ReadyForPickUpDate;
  if (objModel.ReadyForPickUpDate == null) {
    ReadyForPickUpDate = null;
  } else {
    ReadyForPickUpDate = '"' + objModel.ReadyForPickUpDate + '"';
  }
  var sql = `insert into tbl_repair_request_shipping_history(
         RRId,ShipFromIdentity,ShipFromId,ShipFromName,
         ShipFromAddressId,ShipViaId,TrackingNo,PackWeight,
         ShippingCost,ShipDate,ShippedBy,ShipComment,ShowCustomerReference,ShowRootCause,ReadyForPickUpDate,
         ShipToIdentity,ShipToId,ShipToName,ReceiveAddressId,Created,CreatedBy
         )
         values('${objModel.RRId}','${objModel.ShipFromIdentity}','${objModel.ShipFromId}',
         '${objModel.ShipFromName}','${objModel.ShipFromAddressId}','${objModel.ShipViaId}',
         '${objModel.TrackingNo}','${objModel.PackWeight}','${objModel.ShippingCost}',
         '${objModel.ShipDate}','${objModel.ShippedBy}','${objModel.ShipComment}','${objModel.ShowCustomerReference}', '${objModel.ShowRootCause}',${ReadyForPickUpDate},
         '${objModel.ShipToIdentity}','${objModel.ShipToId}','${objModel.ShipToName}','${objModel.ShipToAddressId}',
         '${objModel.Created}','${objModel.CreatedBy}'
         )`;

  var update_query = `Update tbl_repair_request SET  
    ShippingStatus='${objModel.ShippingStatus}',
    ShippingIdentityType='${objModel.ShipFromIdentity}',
    ShippingIdentityId='${objModel.ShipFromId}', 
    ShippingIdentityName= '${objModel.ShipFromName}',
    ShippingAddressId= '${objModel.ShipFromAddressId}',
    Modified='${objModel.Modified}', 
    ModifiedBy='${objModel.ModifiedBy}' where IsDeleted=0 and RRId=${objModel.RRId}`;


  if (objModel.ShipToIdentity == 1) {
    var ShipToIdentity = "Customer";
  } else {
    if (objModel.ShipToIdentity == 2 && objModel.ShipToId == Constants.AH_GROUP_VENDOR_ID) {
      var ShipToIdentity = Constants.AH_GROUP_VENDOR_ID
    } else {
      var ShipToIdentity = "Vendor";
    }
  }

  if (objModel.ShipFromIdentity == 1) {
    var ShipFromIdentity = "Customer";
  } else {
    if (objModel.ShipFromIdentity == 2 && objModel.ShipFromId == Constants.AH_GROUP_VENDOR_ID) {
      var ShipFromIdentity = Constants.AH_GROUP_VENDOR_ID
    } else {
      var ShipFromIdentity = "Vendor";
    }
  }


  //To add shipping status to notification table
  var NotificationObj = new NotificationModel({
    authuser: objModel.authuser,
    RRId: objModel.RRId,
    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
    NotificationIdentityId: objModel.RRId,
    NotificationIdentityNo: 'RR' + objModel.RRId,
    ShortDesc: 'Parts shipped to ' + ShipToIdentity + ' (' + objModel.ShipToName + ')',
    Description: 'Admin (' + global.authuser.FullName + ') shipped a parts from ' + ShipFromIdentity + ' (' + objModel.ShipFromName + ') to ' + ShipToIdentity + ' (' + objModel.ShipToName + ') on ' + cDateTime.getDateTime()
  });

  //console.log(sql);
  //console.log(update_query);
  //console.log(NotificationObj);
  async.parallel([
    function (result) { con.query(sql, result) },
    function (result) { con.query(update_query, result) },
    function (result) { NotificationModel.Create(NotificationObj, result); }
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      if (results[0][0]) {
        result(null, { id: results[0][0].insertId, ...objModel });
        return;
      } else {
        result({ msg: "Ship Record is not found" }, null);
        return;
      }
    }
  );

};

RRShippingHistory.ClientSideRRShipHistoryListByVendor = (obj, result) => {
  var VendorIds = 0;
  if (obj.VendorId.length > 0) {
    var Ids = ``;
    for (let val of obj.VendorId) {
      Ids += val + `,`;
    }
    VendorIds = Ids.slice(0, -1);
  }
  var sql = `Select sh.*,DATE_FORMAT(sh.Created,'%m/%d/%Y') Created,rr.RRNo,rr.VendorId,u.UserId,u.username
  FROM tbl_repair_request rr
  LEFT JOIN tbl_repair_request_shipping_history sh on sh.RRId=rr.RRId  and sh.IsDeleted=0
  and (ShippingHistoryId = (SELECT MAX(ShippingHistoryId)
  FROM tbl_repair_request_shipping_history rrsh1 where IsDeleted=0 AND RRId = rr.RRId  LIMIT 1) or sh.ShippingHistoryId Is Null) and ShipToIdentity=2 and ShipToId In(${VendorIds}) 
  LEFT JOIN tbl_users u on u.UserId=sh.CreatedBy and u.IsDeleted=0
  WHERE rr.IsDeleted=0 and ShippingHistoryId>0 `;

  if (obj.UserId > 0) {
    sql += ` and u.UserId =${obj.UserId} `;
  }
  if (obj.ShippingStatus > 0) {
    sql += ` and rr.ShippingStatus =${obj.ShippingStatus} `;
  }

  sql += ` order by RRNo `;

  // console.log(sql);
  con.query(sql, (err, res) => {
    if (err) { result(err, null); }
    else {
      result(null, res);
    }
  })
};
// RRShippingHistory.ServerSideRRShipHistoryListByVendor = (obj, result) => {

//   var query = "";
//   var selectquery = `Select sh.*,DATE_FORMAT(sh.Created,'%m/%d/%Y') Created,rr.RRNo,rr.VendorId `;
//   recordfilterquery = `Select count(*) as recordsFiltered `;
//   query = query + ` FROM tbl_repair_request rr
// LEFT JOIN tbl_repair_request_shipping_history sh on sh.RRId=rr.RRId  and sh.IsDeleted=0
// and (ShippingHistoryId = (SELECT MAX(ShippingHistoryId)
// FROM tbl_repair_request_shipping_history rrsh1 where IsDeleted=0 AND RRId = rr.RRId  LIMIT 1) or sh.ShippingHistoryId Is Null)
// WHERE rr.IsDeleted=0 `;
//   if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
//     query += ` and rr.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
//   }
//   if (obj.ShippingStatus > 0) {
//     query += ` and rr.ShippingStatus =${obj.ShippingStatus} `;
//   }
//   if (obj.VendorId.length > 0) {
//     var Ids = ``;
//     for (let val of obj.VendorId) {
//       Ids += val + `,`;
//     }
//     var VendorIds = Ids.slice(0, -1);
//     query += ` and rr.VendorId in(${VendorIds}) `;
//   }
//   if (obj.search.value != '') {
//     query = query + ` and (  
//        sh.ShipFromName LIKE '%${obj.search.value}%'
//     or sh.ShipToName LIKE '%${obj.search.value}%'
//     or sh.Created LIKE '%${obj.search.value}%') `;
//   }
//   var cvalue = 0;
//   for (cvalue = 0; cvalue < obj.columns.length; cvalue++) {

//     if (obj.columns[cvalue].search.value != "") {
//       switch (obj.columns[cvalue].name) {
//         case "ShipFromName":
//           query += " and  sh.ShipFromName LIKE '%" + obj.columns[cvalue].search.value + "%'  ";
//           break;
//         default:
//           query += " and " + obj.columns[cvalue].name + " LIKE '%" + obj.columns[cvalue].search.value + "%' ";
//       }
//     }
//   }

//   var i = 0;
//   query += " ORDER BY ";
//   for (i = 0; i < obj.order.length; i++) {
//     if (obj.order[i].column != "" || obj.order[i].column == "0")// 0 is equal to ""
//     {
//       switch (obj.columns[obj.order[i].column].name) {
//         case "RRId":
//           query += " rr.RRId " + obj.order[i].dir + " ";
//           break;
//         default:
//           query += " " + obj.columns[obj.order[i].column].name + " " + obj.order[i].dir + " ";
//       }
//     }
//   }

//   var Countquery = recordfilterquery + query;
//   if (obj.start != "-1" && obj.length != "-1") {
//     query += " LIMIT " + obj.start + "," + (obj.length);
//   }
//   query = selectquery + query;

//   var TotalCountQuery = `Select count(*) as TotalCount
//     FROM tbl_repair_request rr
// LEFT JOIN tbl_repair_request_shipping_history sh on sh.RRId=rr.RRId  and sh.IsDeleted=0
// and (ShippingHistoryId = (SELECT MAX(ShippingHistoryId)
// FROM tbl_repair_request_shipping_history rrsh1 where IsDeleted=0 AND RRId = rr.RRId  LIMIT 1) or sh.ShippingHistoryId Is Null)
// WHERE rr.IsDeleted=0   `;
//   if (global.authuser.IdentityType == 0 && global.authuser.IsRestrictedCustomerAccess == 1 && global.authuser.MultipleCustomerIds != "") {
//     TotalCountQuery += ` and rr.CustomerId in(${global.authuser.MultipleCustomerIds}) `;
//   }
//   console.log("query = " + query);
//   console.log("Countquery = " + Countquery);
//   console.log("TotalCountQuery = " + TotalCountQuery);

//   async.parallel([
//     function (result) { con.query(query, result) },
//     function (result) { con.query(Countquery, result) },
//     function (result) { con.query(TotalCountQuery, result) }
//   ],
//     function (err, results) {
//       if (err)
//         return result(err, null);
//       result(null, {
//         data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
//         recordsTotal: results[2][0][0].TotalCount, draw: obj.draw
//       });
//       return;
//     });
// };

RRShippingHistory.receive = (objModel, result) => {

  objModel = escapeSqlValues(objModel);
  var sql = `UPDATE tbl_repair_request_shipping_history 
    SET ReceiveAddressId = ?,ReceivedBy = ?,ReceiveDate = ?,
    ReceiveComment = ?,Modified = ?,ModifiedBy = ? WHERE ShippingHistoryId = ?`;
  var values = [
    objModel.ReceiveAddressId, objModel.ReceivedBy,
    objModel.ReceiveDate, objModel.ReceiveComment,
    objModel.Modified, objModel.ModifiedBy, objModel.ShippingHistoryId
  ];

  var update_query = `Update tbl_repair_request SET  
     ShippingStatus=2, 
     ShippingIdentityType='${objModel.ShipToIdentity}',
     ShippingIdentityId='${objModel.ShipToId}', 
     ShippingIdentityName= '${objModel.ShipToName}',
     ShippingAddressId= '${objModel.ReceiveAddressId}',
     Modified='${objModel.Modified}', 
     ModifiedBy='${objModel.ModifiedBy}' where IsDeleted=0 and RRId=${objModel.RRId}`;

  if (objModel.ShipToIdentity == 1) {
    var ShipToIdentity = "Customer";
  } else {
    if (objModel.ShipToIdentity == 2 && objModel.ShipToId == Constants.AH_GROUP_VENDOR_ID) {
      var ShipToIdentity = Constants.AH_GROUP_VENDOR_ID
    } else {
      var ShipToIdentity = "Vendor";
    }
  }


  //To add shipping status to notification table
  var NotificationObj = new NotificationModel({
    RRId: objModel.RRId,
    NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
    NotificationIdentityId: objModel.RRId,
    NotificationIdentityNo: 'RR' + objModel.RRId,
    ShortDesc: 'Parts received by  ' + ShipToIdentity + ' (' + objModel.ShipToName + ')',
    Description: 'Parts received by ' + ShipToIdentity + ' (' + objModel.ShipToName + ') on ' + cDateTime.getDateTime()
  });



  async.parallel([
    function (result) { con.query(sql, values, result) },
    function (result) { con.query(update_query, result) },
    function (result) { NotificationModel.Create(NotificationObj, result); }
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      if (results[0][0]) {
        result(null, { id: results[0][0], ...objModel });
        return;
      } else {
        result({ msg: "Ship Record is not found" }, null);
        return;
      }
    }
  );
};
RRShippingHistory.UpdateReadyForPickUpToPickUp = (objModel, result) => {

  var sql1 = `UPDATE tbl_repair_request SET ShippingStatus =4 WHERE RRId = ${objModel.RRId}`;//4-Pick_up
  var sql2 = `UPDATE tbl_repair_request_shipping_history SET IsPickedUp =1,
  PickedUpBy='${objModel.PickedUpBy}', PickUPSignature = '${objModel.PickUPSignature}',PickedUpDate='${objModel.PickedUpDate}' WHERE ShippingHistoryId = ${objModel.ShippingHistoryId}`;
  async.parallel([
    function (result) { con.query(sql1, result); },
    function (result) { con.query(sql2, result); }
  ],
    function (err, results) {
      if (err) {
        return result(null, err);
      }
      result(null, objModel);
    });
};



RRShippingHistory.UploadSignatureToS3 = (objModel, result) => {
  if (objModel.PickUPSignature != '') {
    var buf = Buffer.from(objModel.PickUPSignature.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    var type = objModel.PickUPSignature.split(';')[0].split('/')[1];

    aws.config.update({
      secretAccessKey: process.env.S3_ACCESS_SECRET,
      accessKeyId: process.env.S3_ACCESS_KEY,
      region: process.env.S3_REGION
    });

    var fileRoutePath = 'RR/ShipSignature/signature' + Date.now() + '.png';
    // console.log(fileRoutePath);
    var params = {
      ACL: 'public-read',
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileRoutePath, //file.name doesn't exist as a property
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    };
    s3.upload(params, function (err, data) {
      if (err) {
        console.log('ERROR MSG: ', err);
        var response = { Location: '' }
        return result(null, response);
      } else {
        // console.log('Successfully uploaded data', data);
        return result(null, data);
      }
    });

  } else {
    var response = { Location: '' }
    return result(null, response);
  }



}


RRShippingHistory.UploadImageToS3 = (objModel, result) => {

  // var action = `/2020cert/${filename}`;
  // var filePath = path.join(process.cwd(),
  //   action).split("%20").join(" ");
  // console.log(filePath)


  // console.log(s3.config.credentials)
  // let Blob = dataURItoBlob(objModel.BaseString);
  // console.log(Blob.buffer)


  //var buf = new Buffer(Blob.buffer);
  // var output = tou8(Blob.buffer);
  // fs.readFile(output, (err, data) => {
  //   if (err) {
  //     console.error(err)
  //     return result(new Error('ERROR ! Reading File'));
  //   }
  var buf = Buffer.from(objModel.BaseString.replace(/^data:image\/\w+;base64,/, ""), 'base64')
  var type = objModel.BaseString.split(';')[0].split('/')[1];

  fileRoutePath = 'RR/image/' + Date.now();
  // console.log(fileRoutePath);
  var params = {
    ACL: 'public-read',
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileRoutePath, //file.name doesn't exist as a property
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: `image/${type}`,

    //   ACL: "public-read",
    // s3,
    // Bucket: process.env.S3_BUCKET_NAME,
    // Key: 'vendor/invoice/vendorinvoiceNew3.xlsx', // File name you want to save as in S3
    // Body: wbOut,
    // ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };
  s3.upload(params, function (err, data) {
    if (err) {
      console.log('ERROR MSG: ', err);
      return result(err, null);
    } else {
      //  console.log('Successfully uploaded data', data);
      return result(null, data);
    }
  });
  //});
};

// function dataURItoBlob(dataURI) {
//   var byteString = atob(dataURI.split(',')[1]);
//   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
//   var ab = new ArrayBuffer(byteString.length);
//   var ia = new Uint8Array(ab);
//   for (var i = 0; i < byteString.length; i++) {
//     ia[i] = byteString.charCodeAt(i);
//   }
//   return new Blob([ab], { type: mimeString });
// }

RRShippingHistory.update = (objModel, result) => {

  var sql = ``;

  sql = `UPDATE tbl_repair_request_shipping_history 
    SET TrackingNo = ?,PackWeight = ?,ShippingCost = ?,ShipDate = ?,
    ShipComment = ?,Modified = ?,ModifiedBy = ? WHERE ShippingHistoryId = ?`;

  var values = [
    objModel.TrackingNo, objModel.PackWeight,
    objModel.ShippingCost, objModel.ShipDate, objModel.ShipComment,
    objModel.Modified, objModel.ModifiedBy, objModel.ShippingHistoryId
  ]

  con.query(sql, values, (err, res) => {

    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, { id: objModel.NotesId, ...objModel });
  }
  );
  // console.log("Updated RRSH !");
};

RRShippingHistory.getAll = (RRId, result) => {
  var sql = RRShippingHistory.listquery(RRId);
  // console.log("SQQL=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      //  console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, res);
    return;
  });
};


RRShippingHistory.RevertShippingCompletedToProgress = (reqBody, result) => {

  var RRId = reqBody.RRId;
  var CustomerId = reqBody.CustomerId;
  var objModel = new RRShippingHistory({ RRId: RRId });
  var sql = `SELECT  ShippingHistoryId,ShipFromIdentity,ShipFromId,ShipFromAddressId,ShipFromName,ShipToIdentity,ShipToId,ReceiveAddressId 
  FROM tbl_repair_request_shipping_history sh  
  WHERE sh.IsDeleted=0 and sh.RRId='${RRId}' ORDER BY ShippingHistoryId DESC Limit 0,1 `;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res[0].ShipToIdentity == Constants.CONST_IDENTITY_TYPE_CUSTOMER && res[0].ShipToId == CustomerId) { //revert shipping and update RR Table

      var update_query = `Update tbl_repair_request SET  
                            ShippingStatus=2, 
                            ShippingIdentityType='${res[0].ShipFromIdentity}',
                            ShippingIdentityId='${res[0].ShipFromId}', 
                            ShippingIdentityName= '${res[0].ShipFromName}',
                            ShippingAddressId= '${res[0].ShipFromAddressId}',
                            Modified='${objModel.Modified}', 
                            ModifiedBy='${objModel.ModifiedBy}' where IsDeleted=0 and RRId=${objModel.RRId}`;


      var delete_query = `Update tbl_repair_request_shipping_history SET  
                            IsDeleted = 1,
                            Modified='${objModel.Modified}', 
                            ModifiedBy='${objModel.ModifiedBy}' where IsDeleted=0 and ShippingHistoryId=${res[0].ShippingHistoryId}`;


      if (res[0].ShipToIdentity == 1) {
        var ShipToIdentity = "Customer";
      } else {
        if (res[0].ShipToIdentity == 2 && res[0].ShipToId == Constants.AH_GROUP_VENDOR_ID) {
          var ShipToIdentity = Constants.AH_GROUP_VENDOR_ID
        } else {
          var ShipToIdentity = "Vendor";
        }
      }

      if (res[0].ShipFromIdentity == 1) {
        var ShipFromIdentity = "Customer";
      } else {
        if (res[0].ShipFromIdentity == 2 && res[0].ShipFromId == Constants.AH_GROUP_VENDOR_ID) {
          var ShipFromIdentity = Constants.AH_GROUP_VENDOR_ID
        } else {
          var ShipFromIdentity = "Vendor";
        }
      }
      //To add shipping status to notification table
      var NotificationObj = new NotificationModel({
        RRId: objModel.RRId,
        NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
        NotificationIdentityId: objModel.RRId,
        NotificationIdentityNo: 'RR' + objModel.RRId,
        ShortDesc: 'Shipping cycle reverted from Shipped by ' + ShipToIdentity + '  to Received by ' + ShipFromIdentity,
        Description: 'Shipping cycle reverted from Shipped by ' + ShipToIdentity + '  to Received by ' + ShipFromIdentity + ' on ' + cDateTime.getDateTime()
      });



      async.parallel([
        function (result) { con.query(update_query, result) },
        function (result) { con.query(delete_query, result) },
        function (result) { NotificationModel.Create(NotificationObj, result); }
      ],
        function (err, results) {
          if (err) {
            return result(err, null);
          } else {
            if (results[0][0]) {
              result(null, { objModel });
              return;
            } else {
              result({ msg: "Shipping cycle not reverted" }, null);
              return;
            }
          }
        }
      );
    } else {
      // console.log("No action required");
      result(null, null);
    }
  });
};


RRShippingHistory.listquery = (RRId) => {

  var sql = ``;

  sql = `SELECT ShippingHistoryId,RRId,Case ShipFromIdentity
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
    ELSE '-'
    end ShipFromIdentityName,
    ShipFromId,ShipFromName,
    ShipFromAddressId,ShowCustomerReference,ShowRootCause,

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
    s2.StateName as ReceiveState,c2.CountryName as ReceiveCountry,
    ab2.Zip as ReceiveZip,ab2.Email as ReceiveEmail,IsPickUp,
    ab2.PhoneNoPrimary as ReceivePhoneNoPrimary,

    sv.ShipViaName,sv.IsShipViaUPS,TrackingNo,PackWeight,
    ShippingCost,DATE_FORMAT(ShipDate,"%Y-%m-%d") as ShipDate,ShippedBy,ShipComment, 
    Case ShipToIdentity
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
      end ShipToIdentityName,
    ShipToId,ShipToName,
    ReceiveAddressId,ReceivedBy,DATE_FORMAT(ReceiveDate,"%Y-%m-%d") as ReceiveDate,ReceiveComment,
    ReadyForPickUpDate,IsPickedUp,PickedUpBy,PickedUpDate,REPLACE(PickUPSignature,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as PickUPSignature 

    FROM tbl_repair_request_shipping_history sh
    LEFT JOIN tbl_ship_via sv on sv.ShipViaId=sh.ShipViaId
    LEFT JOIN tbl_address_book ab1 on ab1.AddressId=sh.ShipFromAddressId
    LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
    LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
    LEFT JOIN tbl_address_book ab2 on ab2.AddressId=sh.ReceiveAddressId
    LEFT JOIN tbl_countries c2 on c2.CountryId=ab2.CountryId
    LEFT JOIN tbl_states s2 on s2.StateId=ab2.StateId
     WHERE sh.IsDeleted=0 and sh.RRId='${RRId}' `;

  if (global.authuser.IdentityType == Constants.CONST_IDENTITY_TYPE_VENDOR) {
    sql += ` AND ( (sh.ShipFromIdentity = ${Constants.CONST_IDENTITY_TYPE_VENDOR} AND sh.ShipFromId = ${global.authuser.IdentityId}) OR (sh.ShipToIdentity = ${Constants.CONST_IDENTITY_TYPE_VENDOR} AND sh.ShipToId = ${global.authuser.IdentityId}) ) `;
  }

  sql += ` ORDER BY ShippingHistoryId ASC`;
  //console.log("ShippingHistoryId=" + sql);
  return sql;

};


RRShippingHistory.RRShipHistoryDetail = (Obj) => {

  var sql = `SELECT ShippingHistoryId,Case ShipFromIdentity
WHEN 1 THEN '${Constants.array_identity_type[1]}'
WHEN 2 THEN '${Constants.array_identity_type[2]}'
ELSE '-'
end ShipFromIdentityName,
ShipFromId,ShipFromName,
ShipFromAddressId,ShowCustomerReference,ShowRootCause,

sv.ShipViaName,sv.IsShipViaUPS,TrackingNo,PackWeight,
ShippingCost,DATE_FORMAT(ShipDate,"%Y-%m-%d") as ShipDate,ShippedBy,ShipComment, 
Case ShipToIdentity
WHEN 1 THEN '${Constants.array_identity_type[1]}'
WHEN 2 THEN '${Constants.array_identity_type[2]}'
ELSE '-'
end ShipToIdentityName,
ShipToId,ShipToName,
ReceiveAddressId,ReceivedBy,DATE_FORMAT(ReceiveDate,"%Y-%m-%d") as ReceiveDate,ReceiveComment,q.QuoteId,rr.*,TRRV.VendorRefNo,
c.UPSShipperNumber as CustomerShipperNumber,v.UPSShipperNumber as VendorShipperNumber,ifnull(q.CustomerShipIdLocked,0) as CustomerShipIdLocked, ifnull(TRRV.VendorShipIdLocked,0) as VendorShipIdLocked
FROM tbl_repair_request rr
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.Status=1 and q.QuoteCustomerStatus=2 and q.IsDeleted=0
LEFT JOIN tbl_repair_request_shipping_history sh on sh.RRId=rr.RRId  and sh.IsDeleted=0
and (ShippingHistoryId = (SELECT MAX(ShippingHistoryId)
FROM tbl_repair_request_shipping_history rrsh1 where IsDeleted=0 AND RRId = rr.RRId  LIMIT 1) or sh.ShippingHistoryId Is Null)
LEFT JOIN tbl_ship_via sv on sv.ShipViaId=sh.ShipViaId and sv.IsDeleted=0
LEFT JOIN tbl_repair_request_vendors TRRV on TRRV.RRId=rr.RRId and TRRV.Status=0 and TRRV.IsDeleted=0
Left Join tbl_customers c on c.CustomerId=rr.CustomerId and c.IsDeleted=0
Left Join tbl_vendors v on v.VendorId=rr.VendorId and v.IsDeleted=0
WHERE rr.IsDeleted=0 and rr.Status !=7 and ifnull(sh.ShipToIdentity,0) !=1 `;

  Obj.CustomerId = Obj.CustomerId ? Obj.CustomerId : 0;
  Obj.VendorId = Obj.VendorId ? Obj.VendorId : 0;
  Obj.RRNo = Obj.RRNo ? Obj.RRNo : '';
  Obj.Status = Obj.Status ? Obj.Status : 0;
  Obj.ShipTo = Obj.ShipTo == "Customer" ? 1 : 2;

  if (Obj.CustomerId > 0)
    sql += `and rr.CustomerId=${Obj.CustomerId} `;
  if (Obj.VendorId > 0)
    sql += `and rr.VendorId=${Obj.VendorId} `;
  if (Obj.RRNo.length > 0 && Obj.RRNo[0] != "") {
    // var Nos = ``;
    // for (let val of Obj.RRNo) {
    // Nos += `'` + val + `'` + `,`;
    var Nos = "'" + Obj.RRNo[0].split(",").join("','") + "'";
    //}
    // var RRNos = Nos.slice(0, -1);
    sql += " and rr.RRNo IN (" + Nos + " ) ";
  }
  if (Obj.Status >= 0)
    sql += ` and rr.Status=${Obj.Status}`;

  if (Obj.ShipTo == 1)
    sql += ` and rr.Status In(${Constants.CONST_RRS_IN_PROGRESS},${Constants.CONST_RRS_QUOTE_REJECTED},${Constants.CONST_RRS_NOT_REPAIRABLE})`;
  else
    sql += ` and rr.Status In(${Constants.CONST_RRS_AWAIT_VQUOTE},${Constants.CONST_RRS_QUOTE_SUBMITTED},${Constants.CONST_RRS_IN_PROGRESS})`;

  sql += ` ORDER BY rr.RRId DESC`;
  //console.log("ShippingHistoryId=" + sql);
  return sql;

};

// To listquery by RRIdAndShippingHistoryId
RRShippingHistory.listquerybyRRIdAndShippingHistoryId = (RRId, ShippingHistoryId) => {

  var sql = `SELECT ShippingHistoryId,sh.RRId,RRV.VendorRefNo,Case ShipFromIdentity
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
    ELSE '-'
    end ShipFromIdentityName,
    ShipFromId,ShipFromName,
    ShipFromAddressId,ShowCustomerReference,ShowRootCause, Case ShowRootCause when 1 then q.RouteCause else '' End as RootCause,

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
    s2.StateName as ReceiveState,c2.CountryName as ReceiveCountry,
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
    ReceiveAddressId,ReceivedBy,DATE_FORMAT(ReceiveDate,"%Y-%m-%d") as ReceiveDate,ReceiveComment,v.ShippingAccountNo
    FROM tbl_repair_request_shipping_history sh
    LEFT JOIN tbl_repair_request rr on rr.RRId=sh.RRId
    LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.Status='${Constants.CONST_QUOTE_STATUS_APPROVED}' and q.QuoteCustomerStatus='${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED}'
    LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
    LEFT JOIN tbl_ship_via sv on sv.ShipViaId=sh.ShipViaId
    LEFT JOIN tbl_address_book ab1 on ab1.AddressId=sh.ShipFromAddressId
    LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
    LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
    LEFT JOIN tbl_address_book ab2 on ab2.AddressId=sh.ReceiveAddressId
    LEFT JOIN tbl_countries c2 on c2.CountryId=ab2.CountryId
    LEFT JOIN tbl_states s2 on s2.StateId=ab2.StateId
     LEFT JOIN tbl_repair_request_vendors RRV on RRV.RRId = sh.RRId AND RRV.VendorId=sh.ShipToId   AND sh.ShipToIdentity = ${Constants.CONST_IDENTITY_TYPE_VENDOR}
     WHERE sh.IsDeleted=0 and sh.RRId='${RRId}' and sh.ShippingHistoryId='${ShippingHistoryId}'`;
  //console.log("ShippingHistoryId=" + sql)
  return sql;

};

RRShippingHistory.BulkShipView = (BulkShipId) => {

  var sql = `SELECT ShippingHistoryId,sh.RRId,RRV.VendorRefNo,Case ShipFromIdentity
WHEN 1 THEN '${Constants.array_identity_type[1]}'
WHEN 2 THEN '${Constants.array_identity_type[2]}'
ELSE '-'
end ShipFromIdentityName,
ShipFromId,ShipFromName,
ShipFromAddressId,ShowCustomerReference,ShowRootCause, Case ShowRootCause when 1 then q.RouteCause else '' End as RootCause,

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
s2.StateName as ReceiveState,c2.CountryName as ReceiveCountry,
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
ReceiveAddressId,ReceivedBy,DATE_FORMAT(ReceiveDate,"%Y-%m-%d") as ReceiveDate,ReceiveComment,v.ShippingAccountNo
FROM tbl_repair_request_shipping_history sh
LEFT JOIN tbl_repair_request rr on rr.RRId=sh.RRId
LEFT JOIN tbl_quotes q on q.RRId=rr.RRId and q.Status='${Constants.CONST_QUOTE_STATUS_APPROVED}' and q.QuoteCustomerStatus='${Constants.CONST_CUSTOMER_QUOTE_ACCEPTED}'
LEFT JOIN tbl_vendors v on v.VendorId=rr.VendorId
LEFT JOIN tbl_ship_via sv on sv.ShipViaId=sh.ShipViaId
LEFT JOIN tbl_address_book ab1 on ab1.AddressId=sh.ShipFromAddressId
LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
LEFT JOIN tbl_address_book ab2 on ab2.AddressId=sh.ReceiveAddressId
LEFT JOIN tbl_countries c2 on c2.CountryId=ab2.CountryId
LEFT JOIN tbl_states s2 on s2.StateId=ab2.StateId
LEFT JOIN tbl_repair_request_vendors RRV on RRV.RRId = sh.RRId AND RRV.VendorId=sh.ShipToId   AND sh.ShipToIdentity =2
WHERE sh.IsDeleted=0 and sh.RRId In(Select RRId From tbl_repair_request_bulk_shipping_log where BulkShipId=${BulkShipId} ) ORDER BY sh.ShippingHistoryId DESC limit 1 `;
  // console.log("ShippingHistoryId=" + sql)
  return sql;

};

RRShippingHistory.shipViaList = (result) => {
  var sql = `SELECT ShipViaId,ShipViaName,IsPickUp,IsShipViaUPS FROM tbl_ship_via where IsDeleted=0 and Status=1 `;

  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
}

RRShippingHistory.revert = (RRId, result) => {
  var objModel = new RRShippingHistory({ RRId: RRId });
  var sql = `SELECT *  FROM tbl_repair_request_shipping_history where RRId =${objModel.RRId} AND IsDeleted=0 ORDER BY ShippingHistoryId DESC Limit 2`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {

      if (res[0].ShipToIdentity == 1) {
        var ShipToIdentity = "Customer";
      } else {
        if (res[0].ShipToIdentity == 2 && res[0].ShipToId == Constants.AH_GROUP_VENDOR_ID) {
          var ShipToIdentity = Constants.AH_GROUP_VENDOR_ID
        } else {
          var ShipToIdentity = "Vendor";
        }
      }

      if (res[0].ShipFromIdentity == 1) {
        var ShipFromIdentity = "Customer";
      } else {
        if (res[0].ShipFromIdentity == 2 && res[0].ShipFromId == Constants.AH_GROUP_VENDOR_ID) {
          var ShipFromIdentity = Constants.AH_GROUP_VENDOR_ID
        } else {
          var ShipFromIdentity = "Vendor";
        }
      }


      //revert receive
      if (res[0].ReceivedBy && res[0].ReceivedBy != null && res[0].ReceivedBy != '') {

        var sql = `UPDATE tbl_repair_request_shipping_history 
            SET ReceivedBy = ?,ReceiveDate = ?,
            ReceiveComment = ?,Modified = ?,ModifiedBy = ? WHERE ShippingHistoryId = ?`;
        var values = ['', null, '', objModel.Modified, objModel.ModifiedBy, res[0].ShippingHistoryId];

        var ShipFromName = escapeSqlValues(res[0].ShipFromName);

        var update_query = `Update tbl_repair_request SET  
                            ShippingStatus=1, 
                            ShippingIdentityType='${res[0].ShipFromIdentity}',
                            ShippingIdentityId='${res[0].ShipFromId}', 
                            ShippingIdentityName= '${ShipFromName}',
                            ShippingAddressId= '${res[0].ShipFromAddressId}',
                            Modified='${objModel.Modified}', 
                            ModifiedBy='${objModel.ModifiedBy}' where IsDeleted=0 and RRId=${objModel.RRId}`;

        //To add shipping status to notification table
        var NotificationObj = new NotificationModel({
          RRId: objModel.RRId,
          NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
          NotificationIdentityId: objModel.RRId,
          NotificationIdentityNo: 'RR' + objModel.RRId,
          ShortDesc: 'Shipping cycle reverted from Received by ' + ShipToIdentity + '  to Shipped by ' + ShipFromIdentity,
          Description: 'Shipping cycle reverted from Received by ' + ShipToIdentity + '  to Shipped by ' + ShipFromIdentity + ' on ' + cDateTime.getDateTime()
        });

        // console.log("values" + values)
        // console.log("update_query" + update_query)

        async.parallel([
          function (result) { con.query(sql, values, result) },
          function (result) { con.query(update_query, result) },
          function (result) { NotificationModel.Create(NotificationObj, result); }
        ],
          function (err_par, results) {
            if (err_par)
              return result(err_par, null);
            if (results[0][0]) {
              result(null, { id: results[0][0], ...objModel });
              return;
            } else {
              result({ msg: "Revert failed!" }, null);
              return;
            }
          }
        );

      } else { //revert ship 

        var sql = `UPDATE tbl_repair_request_shipping_history  SET  IsDeleted = ?, Modified = ?,ModifiedBy = ? WHERE ShippingHistoryId = ?`;
        var values = [1, objModel.Modified, objModel.ModifiedBy, res[0].ShippingHistoryId];

        var ShipFromName = escapeSqlValues(res[0].ShipFromName);

        var update_query = `Update tbl_repair_request SET  
                            ShippingStatus=2, 
                            ShippingIdentityType='${res[0].ShipFromIdentity}',
                            ShippingIdentityId='${res[0].ShipFromId}', 
                            ShippingIdentityName= '${ShipFromName}',
                            ShippingAddressId= '${res[0].ShipFromAddressId}',
                            Modified='${objModel.Modified}', 
                            ModifiedBy='${objModel.ModifiedBy}' where IsDeleted=0 and RRId=${objModel.RRId}`;

        //To add shipping status to notification table
        var NotificationObj = new NotificationModel({
          RRId: objModel.RRId,
          NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
          NotificationIdentityId: objModel.RRId,
          NotificationIdentityNo: 'RR' + objModel.RRId,
          ShortDesc: 'Shipping cycle reverted from Shipped by ' + ShipToIdentity + '  to Received by ' + ShipFromIdentity,
          Description: 'Shipping cycle reverted from Shipped by ' + ShipToIdentity + '  to Received by ' + ShipFromIdentity + ' on ' + cDateTime.getDateTime()
        });

        // console.log("values" + values)
        // console.log("update_query" + update_query)

        async.parallel([
          function (result) { con.query(sql, values, result) },
          function (result) { con.query(update_query, result) },
          function (result) { NotificationModel.Create(NotificationObj, result); }
        ],
          function (err_par, results) {
            if (err_par)
              return result(err_par, null);
            if (results[0][0]) {
              result(null, { id: results[0][0], ...objModel });
              return;
            } else {
              result({ msg: "Revert failed!" }, null);
              return;
            }
          }
        );

      }

    } else {
      result({ msg: "Shipping cycle not yet started" }, null);
    }
    //result(null, res);
  });
}


RRShippingHistory.LastShippHistorybyRRIdquery = (RRId) => {

  var sql = `SELECT ShipViaName,ShipFromId,IsPickUp,
  case ab1.IdentityType 
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  WHEN 2 THEN '${Constants.array_identity_type[2]}'
  ELSE '-'
  end ShipIdentityType,TrackingNo,
  Case ShipToIdentity
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  WHEN 2 THEN '${Constants.array_identity_type[2]}'
  ELSE '-'
  end ShipToIdentityName
  FROM tbl_repair_request_shipping_history sh
  LEFT JOIN tbl_ship_via sv on sv.ShipViaId=sh.ShipViaId  
  LEFT JOIN tbl_address_book ab1 on ab1.AddressId=sh.ShipFromAddressId
  WHERE sh.IsDeleted=0 and sh.RRId='${RRId}' ORDER BY ShippingHistoryId DESC Limit 0,1 `;
  return sql;
};
RRShippingHistory.LastShippHistorybyMROIdquery = (MROId) => {

  var sql = `SELECT ShipViaName,ShipFromId,IsPickUp,
  case ab1.IdentityType 
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  WHEN 2 THEN '${Constants.array_identity_type[2]}'
  ELSE '-'
  end ShipIdentityType,TrackingNo,
  Case ShipToIdentity
  WHEN 1 THEN '${Constants.array_identity_type[1]}'
  WHEN 2 THEN '${Constants.array_identity_type[2]}'
  ELSE '-'
  end ShipToIdentityName
  FROM tbl_mro_shipping_history sh
  LEFT JOIN tbl_ship_via sv on sv.ShipViaId=sh.ShipViaId  
  LEFT JOIN tbl_address_book ab1 on ab1.AddressId=sh.ShipFromAddressId
  WHERE sh.IsDeleted=0 and sh.MROId='${MROId}' ORDER BY MROShippingHistoryId DESC Limit 0,1 `;
  return sql;
};














//Below are for MRO:
RRShippingHistory.MROship = (objModel, result) => {

  objModel = escapeSqlValues(objModel);

  var sql = `insert into tbl_repair_request_shipping_history(MROId,
         RRId,ShipFromIdentity,ShipFromId,ShipFromName,
         ShipFromAddressId,ShipViaId,TrackingNo,PackWeight,
         ShippingCost,ShipDate,ShippedBy,ShipComment,
         ShipToIdentity,ShipToId,ShipToName,ReceiveAddressId,Created,CreatedBy
         )
         values('${objModel.MROId}','0','${objModel.ShipFromIdentity}','${objModel.ShipFromId}',
         '${objModel.ShipFromName}','${objModel.ShipFromAddressId}','${objModel.ShipViaId}',
         '${objModel.TrackingNo}','${objModel.PackWeight}','${objModel.ShippingCost}',
         '${objModel.ShipDate}','${objModel.ShippedBy}','${objModel.ShipComment}',
         '${objModel.ShipToIdentity}','${objModel.ShipToId}','${objModel.ShipToName}','${objModel.ReceiveAddressId}',
         '${objModel.Created}','${objModel.CreatedBy}'
         )`;

  var update_query = `Update tbl_mro SET  
    ShippingStatus=1, 
    ShippingIdentityType='${objModel.ShipFromIdentity}',
    ShippingIdentityId='${objModel.ShipFromId}', 
    ShippingIdentityName= '${objModel.ShipFromName}',
    ShippingAddressId= '${objModel.ShipFromAddressId}',
    Modified='${objModel.Modified}', 
    ModifiedBy='${objModel.ModifiedBy}' where IsDeleted=0 and MROId=${objModel.MROId}`;

  if (objModel.ShipToIdentity == 1) {
    var ShipToIdentity = "Customer";
  } else {
    if (objModel.ShipToIdentity == 2 && objModel.ShipToId == Constants.AH_GROUP_VENDOR_ID) {
      var ShipToIdentity = Constants.AH_GROUP_VENDOR_ID
    } else {
      var ShipToIdentity = "Vendor";
    }
  }

  if (objModel.ShipFromIdentity == 1) {
    var ShipFromIdentity = "Customer";
  } else {
    if (objModel.ShipFromIdentity == 2 && objModel.ShipFromId == Constants.AH_GROUP_VENDOR_ID) {
      var ShipFromIdentity = Constants.AH_GROUP_VENDOR_ID
    } else {
      var ShipFromIdentity = "Vendor";
    }
  }


  //To add shipping status to notification table
  // var NotificationObj = new NotificationModel({
  //   RRId: objModel.RRId,
  //   NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
  //   NotificationIdentityId: objModel.RRId,
  //   NotificationIdentityNo: 'RR' + objModel.RRId,
  //   ShortDesc: 'Parts shipped to ' + ShipToIdentity + ' (' + objModel.ShipToName + ')',
  //   Description: 'Admin (' + global.authuser.FullName + ') shipped a parts from ' + ShipFromIdentity + ' (' + objModel.ShipFromName + ') to ' + ShipToIdentity + ' (' + objModel.ShipToName + ') on ' + cDateTime.getDateTime()
  // });


  async.parallel([
    function (result) { con.query(sql, result) },
    function (result) { con.query(update_query, result) },
    // function (result) { NotificationModel.Create(NotificationObj, result); }
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      if (results[0][0]) {
        result(null, { id: results[0][0], ...objModel });
        return;
      } else {
        result({ msg: "Ship Record is not found" }, null);
        return;
      }
    }
  );

};
RRShippingHistory.MROReceive = (objModel, result) => {

  objModel = escapeSqlValues(objModel);
  var sql = `UPDATE tbl_repair_request_shipping_history 
    SET ReceiveAddressId = ?,ReceivedBy = ?,ReceiveDate = ?,
    ReceiveComment = ?,Modified = ?,ModifiedBy = ? WHERE ShippingHistoryId = ?`;
  var values = [
    objModel.ReceiveAddressId, objModel.ReceivedBy,
    objModel.ReceiveDate, objModel.ReceiveComment,
    objModel.Modified, objModel.ModifiedBy, objModel.ShippingHistoryId
  ];

  var update_query = `Update tbl_mro SET  
     ShippingStatus=2, 
     ShippingIdentityType='${objModel.ShipToIdentity}',
     ShippingIdentityId='${objModel.ShipToId}', 
     ShippingIdentityName= '${objModel.ShipToName}',
     ShippingAddressId= '${objModel.ReceiveAddressId}',
     Modified='${objModel.Modified}', 
     ModifiedBy='${objModel.ModifiedBy}' where IsDeleted=0 and MROId=${objModel.MROId}`;

  if (objModel.ShipToIdentity == 1) {
    var ShipToIdentity = "Customer";
  } else {
    if (objModel.ShipToIdentity == 2 && objModel.ShipToId == Constants.AH_GROUP_VENDOR_ID) {
      var ShipToIdentity = Constants.AH_GROUP_VENDOR_ID
    } else {
      var ShipToIdentity = "Vendor";
    }
  }


  //To add shipping status to notification table
  // var NotificationObj = new NotificationModel({
  //   RRId: objModel.RRId,
  //   NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
  //   NotificationIdentityId: objModel.RRId,
  //   NotificationIdentityNo: 'RR' + objModel.RRId,
  //   ShortDesc: 'Parts received by  ' + ShipToIdentity + ' (' + objModel.ShipToName + ')',
  //   Description: 'Parts received by ' + ShipToIdentity + ' (' + objModel.ShipToName + ') on ' + cDateTime.getDateTime()
  // });



  async.parallel([
    function (result) { con.query(sql, values, result) },
    function (result) { con.query(update_query, result) },
    // function (result) { NotificationModel.Create(NotificationObj, result); }
  ],
    function (err, results) {
      if (err)
        return result(err, null);
      if (results[0][0]) {
        result(null, { id: results[0][0], ...objModel });
        return;
      } else {
        result({ msg: "Ship Record is not found" }, null);
        return;
      }
    }
  );
};
RRShippingHistory.MROlistquery = (MROId) => {

  var sql = ``;
  sql = `SELECT ShippingHistoryId,MROId,RRId,Case ShipFromIdentity
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
    s2.StateName as ReceiveState,c2.CountryName as ReceiveCountry,
    ab2.Zip as ReceiveZip,ab2.Email as ReceiveEmail,
    ab2.PhoneNoPrimary as ReceivePhoneNoPrimary,IsPickUp,

    sv.ShipViaName,sv.IsShipViaUPS,TrackingNo,PackWeight,
    ShippingCost,DATE_FORMAT(ShipDate,"%Y-%m-%d") as ShipDate,ShippedBy,ShipComment, 
    Case ShipToIdentity
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
      end ShipToIdentityName,
    ShipToId,ShipToName,
    ReceiveAddressId,ReceivedBy,DATE_FORMAT(ReceiveDate,"%Y-%m-%d") as ReceiveDate,ReceiveComment
    FROM tbl_repair_request_shipping_history sh
    LEFT JOIN tbl_ship_via sv on sv.ShipViaId=sh.ShipViaId
    LEFT JOIN tbl_address_book ab1 on ab1.AddressId=sh.ShipFromAddressId
    LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
    LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
    LEFT JOIN tbl_address_book ab2 on ab2.AddressId=sh.ReceiveAddressId
    LEFT JOIN tbl_countries c2 on c2.CountryId=ab2.CountryId
    LEFT JOIN tbl_states s2 on s2.StateId=ab2.StateId
     WHERE sh.IsDeleted=0 and sh.MROId='${MROId}' `;

  if (global.authuser.IdentityType == Constants.CONST_IDENTITY_TYPE_VENDOR) {
    sql += ` AND ( (sh.ShipFromIdentity = ${Constants.CONST_IDENTITY_TYPE_VENDOR} AND sh.ShipFromId = ${global.authuser.IdentityId}) OR (sh.ShipToIdentity = ${Constants.CONST_IDENTITY_TYPE_VENDOR} AND sh.ShipToId = ${global.authuser.IdentityId}) ) `;
  }
  sql += ` ORDER BY ShippingHistoryId ASC`;
  return sql;
};
//
RRShippingHistory.listquerybyMROIdAndShippingHistoryId = (MROId, ShippingHistoryId) => {

  var sql = `SELECT sh.IsDeleted,ShippingHistoryId,sh.MROId,sh.RRId,RRV.VendorRefNo,Case ShipFromIdentity
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
    ab1.PhoneNoPrimary as ShipPhoneNoPrimary,IsPickUp,

    case ab2.IdentityType 
    WHEN 1 THEN '${Constants.array_identity_type[1]}'
    WHEN 2 THEN '${Constants.array_identity_type[2]}'
      ELSE '-'
      end ReceiveIdentityType,
    ab2.AddressType as ReceiveAddressType,ab2.StreetAddress as ReceiveStreetAddress,
    ab2.SuiteOrApt as ReceiveSuiteOrApt,ab2.City as ReceiveCity,
    s2.StateName as ReceiveState,c2.CountryName as ReceiveCountry,
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
    ReceiveAddressId,ReceivedBy,DATE_FORMAT(ReceiveDate,"%Y-%m-%d") as ReceiveDate,ReceiveComment,v.ShippingAccountNo
    FROM tbl_repair_request_shipping_history sh
    LEFT JOIN tbl_mro mro on mro.MROId=sh.MROId
    LEFT JOIN tbl_vendors v on v.VendorId=mro.VendorId
    LEFT JOIN tbl_ship_via sv on sv.ShipViaId=sh.ShipViaId
    LEFT JOIN tbl_address_book ab1 on ab1.AddressId=sh.ShipFromAddressId
    LEFT JOIN tbl_countries c1 on c1.CountryId=ab1.CountryId
    LEFT JOIN tbl_states s1 on s1.StateId=ab1.StateId
    LEFT JOIN tbl_address_book ab2 on ab2.AddressId=sh.ReceiveAddressId
    LEFT JOIN tbl_countries c2 on c2.CountryId=ab2.CountryId
    LEFT JOIN tbl_states s2 on s2.StateId=ab2.StateId
     LEFT JOIN tbl_repair_request_vendors RRV on RRV.MROId = sh.MROId AND RRV.VendorId=sh.ShipToId   AND sh.ShipToIdentity =2
     WHERE sh.IsDeleted=0 and sh.MROId='${MROId}' and sh.ShippingHistoryId='${ShippingHistoryId}'`;
  return sql;

};

RRShippingHistory.MRORevert = (MROId, result) => {
  var objModel = new RRShippingHistory({ MROId: MROId });
  var sql = `SELECT *  FROM tbl_repair_request_shipping_history where MROId =${objModel.MROId} AND IsDeleted=0 ORDER BY ShippingHistoryId DESC Limit 2`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {

      if (res[0].ShipToIdentity == 1) {
        var ShipToIdentity = "Customer";
      } else {
        if (res[0].ShipToIdentity == 2 && res[0].ShipToId == Constants.AH_GROUP_VENDOR_ID) {
          var ShipToIdentity = Constants.AH_GROUP_VENDOR_ID
        } else {
          var ShipToIdentity = "Vendor";
        }
      }

      if (res[0].ShipFromIdentity == 1) {
        var ShipFromIdentity = "Customer";
      } else {
        if (res[0].ShipFromIdentity == 2 && res[0].ShipFromId == Constants.AH_GROUP_VENDOR_ID) {
          var ShipFromIdentity = Constants.AH_GROUP_VENDOR_ID
        } else {
          var ShipFromIdentity = "Vendor";
        }
      }


      //revert receive
      if (res[0].ReceivedBy && res[0].ReceivedBy != null && res[0].ReceivedBy != '') {

        var sql = `UPDATE tbl_repair_request_shipping_history 
            SET ReceivedBy = ?,ReceiveDate = ?,
            ReceiveComment = ?,Modified = ?,ModifiedBy = ? WHERE ShippingHistoryId = ?`;
        var values = ['', null, '', objModel.Modified, objModel.ModifiedBy, res[0].ShippingHistoryId];

        var ShipFromName = escapeSqlValues(res[0].ShipFromName);

        var update_query = `Update tbl_mro SET  
                            ShippingStatus=1, 
                            ShippingIdentityType='${res[0].ShipFromIdentity}',
                            ShippingIdentityId='${res[0].ShipFromId}', 
                            ShippingIdentityName= '${ShipFromName}',
                            ShippingAddressId= '${res[0].ShipFromAddressId}',
                            Modified='${objModel.Modified}', 
                            ModifiedBy='${objModel.ModifiedBy}' where IsDeleted=0 and MROId=${objModel.MROId}`;

        //To add shipping status to notification table
        // var NotificationObj = new NotificationModel({
        //   RRId: objModel.RRId,
        //   NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
        //   NotificationIdentityId: objModel.RRId,
        //   NotificationIdentityNo: 'RR' + objModel.RRId,
        //   ShortDesc: 'Shipping cycle reverted from Received by ' + ShipToIdentity + '  to Shipped by ' + ShipFromIdentity,
        //   Description: 'Shipping cycle reverted from Received by ' + ShipToIdentity + '  to Shipped by ' + ShipFromIdentity + ' on ' + cDateTime.getDateTime()
        // });

        // console.log("values" + values)
        // console.log("update_query" + update_query)

        async.parallel([
          function (result) { con.query(sql, values, result) },
          function (result) { con.query(update_query, result) },
          // function (result) { NotificationModel.Create(NotificationObj, result); }
        ],
          function (err_par, results) {
            if (err_par)
              return result(err_par, null);
            if (results[0][0]) {
              result(null, { id: results[0][0], ...objModel });
              return;
            } else {
              result({ msg: "Revert failed!" }, null);
              return;
            }
          }
        );

      } else { //revert ship 

        var sql = `UPDATE tbl_repair_request_shipping_history  SET  IsDeleted = ?, Modified = ?,ModifiedBy = ? WHERE ShippingHistoryId = ?`;
        var values = [1, objModel.Modified, objModel.ModifiedBy, res[0].ShippingHistoryId];

        var ShipFromName = escapeSqlValues(res[0].ShipFromName);

        var update_query = `Update tbl_mro SET  
                            ShippingStatus=2, 
                            ShippingIdentityType='${res[0].ShipFromIdentity}',
                            ShippingIdentityId='${res[0].ShipFromId}', 
                            ShippingIdentityName= '${ShipFromName}',
                            ShippingAddressId= '${res[0].ShipFromAddressId}',
                            Modified='${objModel.Modified}', 
                            ModifiedBy='${objModel.ModifiedBy}' where IsDeleted=0 and MROId=${objModel.MROId}`;

        //To add shipping status to notification table
        // var NotificationObj = new NotificationModel({
        //   RRId: objModel.RRId,
        //   NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_RR,
        //   NotificationIdentityId: objModel.RRId,
        //   NotificationIdentityNo: 'RR' + objModel.RRId,
        //   ShortDesc: 'Shipping cycle reverted from Shipped by ' + ShipToIdentity + '  to Received by ' + ShipFromIdentity,
        //   Description: 'Shipping cycle reverted from Shipped by ' + ShipToIdentity + '  to Received by ' + ShipFromIdentity + ' on ' + cDateTime.getDateTime()
        // });

        // console.log("values" + values)
        // console.log("update_query" + update_query)

        async.parallel([
          function (result) { con.query(sql, values, result) },
          function (result) { con.query(update_query, result) },
          // function (result) { NotificationModel.Create(NotificationObj, result); }
        ],
          function (err_par, results) {
            if (err_par)
              return result(err_par, null);
            if (results[0][0]) {
              result(null, { id: results[0][0], ...objModel });
              return;
            } else {
              result({ msg: "Revert failed!" }, null);
              return;
            }
          }
        );

      }

    } else {
      result({ msg: "Shipping cycle not yet started" }, null);
    }
    //  result(null, res);
  });
}
RRShippingHistory.TrackingNumber = (TrackingNo, result) => {
  var sql = `Select rrsh.RRId,TrackingNo,PartNo,RRNo,ShippingStatus,
  CASE when ShippingStatus=1 then 'Shipped' When ShippingStatus=2 then 'Received' ELSE '-' END ShippingStatusName,
  rr.CustomerId,c.CompanyName from
  tbl_repair_request_shipping_history rrsh
  Left join tbl_repair_request rr On rr.RRId=rrsh.RRId
  Left join tbl_customers c On c.CustomerId=rr.CustomerId
  where rrsh.IsDeleted=0 and rrsh.ShipToIdentity=2 and rrsh.TrackingNo='${TrackingNo}'
  and rr.CustomerId In (${global.authuser.MultipleAccessIdentityIds})`;
  console.log("sql=" + sql)
  con.query(sql, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
}
module.exports = RRShippingHistory;

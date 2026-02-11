/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
const { escapeSqlValues } = require("../helper/common.function.js");
var async = require('async');
var cDateTime = require("../utils/generic.js");
// const { request } = require("../app.js");
const RRImages = function (objRRImages) {
  this.RRImageId = objRRImages.RRImageId;
  this.RRId = objRRImages.RRId;
  this.IsPrimaryImage = objRRImages.IsPrimaryImage ? objRRImages.IsPrimaryImage : 0;
  this.ImagePath = objRRImages.ImagePath;
  this.ImageOriginalFile = objRRImages.ImageOriginalFile;
  this.ImageMimeType = objRRImages.ImageMimeType;
  this.ImageSize = objRRImages.ImageSize;
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objRRImages.authuser && objRRImages.authuser.UserId) ? objRRImages.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objRRImages.authuser && objRRImages.authuser.UserId) ? objRRImages.authuser.UserId : TokenUserId;
  this.RRImagesList = objRRImages.RRImagesList;

  //To get the image attachment
  this.originalname = objRRImages.originalname;
  this.path = objRRImages.path;
  this.mimetype = objRRImages.mimetype;
  this.size = objRRImages.size;
};



RRImages.CreateRRImages = (reqBody, result) => {
  if (reqBody.RRImagesList.length > 0) {
    var sql = `insert into tbl_repair_request_images(RRId,ImagePath,ImageOriginalFile,ImageMimeType,ImageSize,IsPrimaryImage,Created,CreatedBy
      ) values`;
    for (let val of reqBody.RRImagesList) {
      val = escapeSqlValues(val);
      var Obj = new RRImages(val);
      sql += `('${reqBody.RRId}','${Obj.path}','${Obj.originalname}','${Obj.mimetype}','${Obj.size}','${Obj.IsPrimaryImage}','${Obj.Created}','${Obj.CreatedBy}'),`;
    }
    var Query = sql.slice(0, -1);
    con.query(Query, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId });
      return;
    });
  } else {
    result(null, null);
    return;
  }

};


RRImages.UpdateRRImages = (reqBody, result) => {
  if (reqBody.RRImagesList) {
    for (let val of reqBody.RRImagesList) {
      var Obj = new RRImages(val);
      if (Obj.RRReferenceId) {
        var Query = `Update  tbl_repair_request_images set  ImagePath=?, ImageOriginalFile=?,ImageMimeType=?,ImageSize=?,Modified=?,ModifiedBy=? where RRImageId=? and RRId=?`;
        var values = [Obj.path, Obj.originalname, Obj.mimetype, Obj.size, Obj.Modified, Obj.ModifiedBy, Obj.RRImageId, reqBody.RRId];
      } else {
        var Query = `insert into tbl_repair_request_images(RRId,ImagePath,ImageOriginalFile,ImageMimeType,ImageSize,Created,CreatedBy
      ) values(?,?,?,?,?,?,?)`;
        var values = [reqBody.RRId, Obj.path, Obj.originalname, Obj.mimetype, Obj.size, Obj.Created, Obj.CreatedBy];
      }
      // console.log("Image query" + Query, values);
      con.query(Query, values, (err, res) => {
        if (err) {
          result(err, null);
        }
      }
      );
    }
    result(null, reqBody.RRImagesList);
    return;
  } else {
    result(null, null);
    return;
  }

};



RRImages.DeleteRRImgQuery = (RRId) => {
  var Obj = new RRImages({ RRId: RRId });
  var sql = `UPDATE tbl_repair_request_images SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE RRId>0 AND  RRId=${Obj.RRId}`;
  return sql;
}


RRImages.Delete = (RRImageId, result) => {
  var Obj = new RRImages({ RRImageId: RRImageId });
  var sql = `UPDATE tbl_repair_request_images SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE RRImageId=${Obj.RRImageId}`;
  con.query(sql, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: RRImageId, ...Obj });
    return;
  });

}

RRImages.SetAsPrimary = (Obj, result) => {
  var Obj = new RRImages(Obj);
  var query1 = `UPDATE tbl_repair_request_images SET IsPrimaryImage=0 ,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE IsDeleted = 0 AND IsPrimaryImage=1 AND RRId = ${Obj.RRId};`;
  var query2 = `UPDATE tbl_repair_request_images SET IsPrimaryImage=1 ,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE IsDeleted = 0 AND IsPrimaryImage=0 AND RRId = ${Obj.RRId} AND RRImageId = ${Obj.RRImageId};`;
  // console.log(query1);

  con.query(query1, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    con.query(query2, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, Obj);
    });

  });

  // async.parallel([
  //   function (result) { con.query(query1, result) },
  //   function (result) { con.query(query2, result) }
  // ],
  //   function (err, results) {
  //     if (err)
  //       return result(err, null);

  //     result(null, Obj);
  //     return;
  //   }
  // );
};

RRImages.ViewRRImages = (RRId) => {
  var sql = `Select RRImageId,IsPrimaryImage,rri.RRId,REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath,ImageOriginalFile,ImageMimeType,ImageSize
  from tbl_repair_request_images rri
  Left Join tbl_repair_request rr on rri.RRId=rr.RRId
  where rri.IsDeleted=0 and rri.RRId=${RRId} `;
  if (global.authuser.IdentityType == Constants.CONST_IDENTITY_TYPE_VENDOR)
    sql += ` AND rr.VendorId='${global.authuser.IdentityId}' `;

  sql += ` ORDER BY IsPrimaryImage DESC,RRImageId ASC `;
  return sql;
}



module.exports = RRImages;
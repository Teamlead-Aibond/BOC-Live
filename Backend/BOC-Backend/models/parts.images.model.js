/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
const { escapeSqlValues } = require("../helper/common.function.js");
var cDateTime = require("../utils/generic.js");
// const { request } = require("../app.js");
const PartImages = function (objPartImages) {
    this.PartImageId = objPartImages.PartImageId;
    this.PartId = objPartImages.PartId;
    this.ShopPartItemId = objPartImages.ShopPartItemId ? objPartImages.ShopPartItemId : 0;
    this.ImagePath = objPartImages.ImagePath;
    this.ImageOriginalFile = objPartImages.ImageOriginalFile;
    this.ImageMimeType = objPartImages.ImageMimeType;
    this.ImageSize = objPartImages.ImageSize;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (objPartImages.authuser && objPartImages.authuser.UserId) ? objPartImages.authuser.UserId : TokenUserId;
    this.ModifiedBy = (objPartImages.authuser && objPartImages.authuser.UserId) ? objPartImages.authuser.UserId : TokenUserId;
    this.IsDeleted = objPartImages.IsDeleted ? objPartImages.IsDeleted : 0;
    this.ImagesList = objPartImages.ImagesList;

    //To get the image attachment
    this.originalname = objPartImages.originalname;
    this.path = objPartImages.path;
    this.mimetype = objPartImages.mimetype;
    this.size = objPartImages.size;
};



PartImages.CreatePartImages = (reqBody, result) => {
    // console.log("image length = " + reqBody.ImagesList.length)

    if (reqBody.ImagesList.length > 0) {
        var sql = `insert into tbl_parts_images(PartId,ImagePath,ImageOriginalFile,ImageMimeType,ImageSize,Created,CreatedBy
      ) values`;
        for (let val of reqBody.ImagesList) {
            val = escapeSqlValues(val);
            var Obj = new PartImages(val);
            sql += `('${reqBody.PartId}','${Obj.path}','${Obj.originalname}','${Obj.mimetype}','${Obj.size}','${Obj.Created}','${Obj.CreatedBy}'),`;
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


PartImages.UpdatePartImages = (reqBody, result) => {
    // console.log(reqBody);
    if (reqBody.ImagesList) {
        for (let val of reqBody.ImagesList) {
            val = escapeSqlValues(val);
            var Obj = new PartImages(val);
            var ShopPartItemId = reqBody.ShopPartItemId ? reqBody.ShopPartItemId : 0;
            if (Obj.PartImageId) {
                var Query = `Update tbl_parts_images set  ImagePath=?, ImageOriginalFile=?,ImageMimeType=?,ImageSize=?,Modified=?,ModifiedBy=?,IsDeleted=? where PartImageId=?`;
                var values = [Obj.path, Obj.originalname, Obj.mimetype, Obj.size, Obj.Modified, Obj.ModifiedBy, Obj.IsDeleted, Obj.PartImageId];
            } else {
                var Query = `insert into tbl_parts_images(PartId,ShopPartItemId,ImagePath,ImageOriginalFile,ImageMimeType,ImageSize,Created,CreatedBy
                    ) values(?,?,?,?,?,?,?,?)`;
                var values = [reqBody.PartId, ShopPartItemId, Obj.path, Obj.originalname, Obj.mimetype, Obj.size, Obj.Created, Obj.CreatedBy];
            }
            con.query(Query, values, (err, res) => {
                if (err) {
                    result(err, null);
                }
            });
        }
        result(null, reqBody.ImagesList);
        return;
    } else {
        result(null, null);
        return;
    }

};



PartImages.DeletePartImgQuery = (PartId) => {
    var Obj = new PartImages({ PartId: PartId });
    var sql = `UPDATE tbl_parts_images SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE PartId=${Obj.PartId}`;
    return sql;
}


PartImages.Delete = (PartImageId, result) => {
    var Obj = new PartImages({ PartImageId: PartImageId });
    var sql = `UPDATE tbl_parts_images SET IsDeleted=1,Modified='${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' WHERE PartImageId=${Obj.PartImageId}`;
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, { id: PartImageId, ...Obj });
        return;
    });

}


PartImages.ViewPartImages = (PartId, result) => {
    var sql = `Select PartImageId,PartId,REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath,ImageOriginalFile,ImageMimeType,ImageSize
    from tbl_parts_images where IsDeleted=0 and PartId=${PartId} and ShopPartItemId=0`;
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, { ...res });
        return;
    });

}
PartImages.ViewPartImagesByShopPartItemId = (ShopPartItemId, result) => {
    var sql = `Select PartImageId,PartId,ShopPartItemId,REPLACE(ImagePath,'${Constants.CONST_BUCKET_PATH_SUBDOMAIN}','${Constants.CONST_BUCKET_PATH_AWS_DOMAIN}') as ImagePath,ImageOriginalFile,ImageMimeType,ImageSize
    from tbl_parts_images where IsDeleted=0 and ShopPartItemId=${ShopPartItemId}`;
    con.query(sql, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
        return;
    });

}
PartImages.ViewPartImagesQuery = (PartId) => {
    var sql = `Select ImagePath from tbl_parts_images where IsDeleted=0 and PartId=${PartId} ORDER BY PartImageId ASC`;
    return sql

}

PartImages.ViewPartImagesQueryByShopPartItemId = (PartId, ShopPartItemId) => {
    var sql = `Select ImagePath from tbl_parts_images where IsDeleted=0 and PartId=${PartId} and ShopPartItemId=${ShopPartItemId} ORDER BY PartImageId ASC`;
    return sql

}

PartImages.CreatePartImagesViaRR = (reqBody, result) => {
    // console.log("image length = " + reqBody.ImagesList.length)

    if (reqBody.ImagesList.length > 0) {
        var sql = `insert into tbl_parts_images(PartId,ImagePath,ImageOriginalFile,ImageMimeType,ImageSize,Created,CreatedBy
      ) values`;
        for (let val of reqBody.ImagesList) {
            val = escapeSqlValues(val);
            var Obj = new PartImages(val);
            // var Obj = val;
            sql += `('${reqBody.PartId}','${Obj.ImagePath}','${Obj.ImageOriginalFile}','${Obj.ImageMimeType}','${Obj.ImageSize}','${Obj.Created}','${Obj.CreatedBy}'),`;
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
module.exports = PartImages;
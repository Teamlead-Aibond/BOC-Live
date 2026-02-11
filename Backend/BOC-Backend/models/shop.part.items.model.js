/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Inventory = require("./inventory.model.js");
const RR = require("./repair.request.model.js");
var async = require('async');
const { escapeSqlValues } = require("../helper/common.function.js");
const TempRFIDModel = require("./temp.rfid.model.js");
const PartImages = require("./parts.images.model.js");
const PartItemShopStockLog = require("./part.item.shop.stock.log.model.js");
const ShopPartItemModel = function (objPartItem) {
    this.ShopPartItemId = objPartItem.ShopPartItemId;
    this.RRId = objPartItem.RRId ? objPartItem.RRId : null;
    this.RRNo = objPartItem.RRNo ? objPartItem.RRNo : '';
    this.PartId = objPartItem.PartId;
    this.SerialNo = objPartItem.SerialNo ? objPartItem.SerialNo : "";
    this.APNNo = objPartItem.APNNo ? objPartItem.APNNo : '';

    this.VendorId = objPartItem.VendorId ? objPartItem.VendorId : 0;
    this.BuyingPrice = objPartItem.BuyingPrice ? objPartItem.BuyingPrice : 0;
    this.BaseBuyingPrice = objPartItem.BaseBuyingPrice ? objPartItem.BaseBuyingPrice : 0;
    this.BuyingExchangeRate = objPartItem.BuyingExchangeRate ? objPartItem.BuyingExchangeRate : 1;
    this.BuyingCurrencyCode = objPartItem.BuyingCurrencyCode ? objPartItem.BuyingCurrencyCode : '';
    this.SellingPrice = objPartItem.SellingPrice ? objPartItem.SellingPrice : 0;
    this.BaseSellingPrice = objPartItem.BaseSellingPrice ? objPartItem.BaseSellingPrice : 0;
    this.SellingExchangeRate = objPartItem.SellingExchangeRate ? objPartItem.SellingExchangeRate : 0;
    this.SellingCurrencyCode = objPartItem.SellingCurrencyCode ? objPartItem.SellingCurrencyCode : '';
    this.ShopTotalQuantity = objPartItem.ShopTotalQuantity ? objPartItem.ShopTotalQuantity : 0;
    this.ShopCurrentQuantity = objPartItem.ShopCurrentQuantity ? objPartItem.ShopCurrentQuantity : 0;
    this.LocationId = objPartItem.LocationId ? objPartItem.LocationId : 0;
    this.PartItemDescription = objPartItem.PartItemDescription ? objPartItem.PartItemDescription : '';
    this.PartItemType = objPartItem.PartItemType ? objPartItem.PartItemType : 0;
    this.PartItemDelivery = objPartItem.PartItemDelivery ? objPartItem.PartItemDelivery : '';
    this.PartCategoryId = objPartItem.PartCategoryId ? objPartItem.PartCategoryId : 0;
    this.updateCategory = objPartItem.updateCategory ? objPartItem.updateCategory : 0;
    this.ItemAttachmentList = objPartItem.ItemAttachmentList ? objPartItem.ItemAttachmentList : [];
    this.ItemAttachment = objPartItem.ItemAttachment ? objPartItem.ItemAttachment : [];

    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (objPartItem.authuser && objPartItem.authuser.UserId) ? objPartItem.authuser.UserId : TokenUserId;
    this.ModifiedBy = (objPartItem.authuser && objPartItem.authuser.UserId) ? objPartItem.authuser.UserId : TokenUserId;

    //For Inventory
    this.PartItems = objPartItem.PartItems;
};

ShopPartItemModel.CreatePartItems = (PartId, PartItems, result) => {
    var itemProcessed = 0;
    var sql = `insert into tbl_parts_item_shop(PartId,SerialNo,APNNo,VendorId,BuyingPrice,BaseBuyingPrice,BuyingExchangeRate,BuyingCurrencyCode,
        SellingPrice,BaseSellingPrice,SellingExchangeRate,SellingCurrencyCode,ShopTotalQuantity,ShopCurrentQuantity,LocationId,PartItemDescription,PartItemType,PartItemDelivery,Created, CreatedBy)
     values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    if (PartItems && PartItems.length > 0) {
        for (let partsObj of PartItems) {

            let objPartItem = new ShopPartItemModel(partsObj);
            var values = [PartId, objPartItem.SerialNo, objPartItem.APNNo
                , objPartItem.VendorId, objPartItem.BuyingPrice, objPartItem.BaseBuyingPrice, objPartItem.BuyingExchangeRate, objPartItem.BuyingCurrencyCode
                , objPartItem.SellingPrice, objPartItem.BaseSellingPrice, objPartItem.SellingExchangeRate, objPartItem.SellingCurrencyCode, objPartItem.ShopCurrentQuantity, objPartItem.ShopCurrentQuantity, objPartItem.LocationId
                , objPartItem.PartItemDescription, objPartItem.PartItemType, objPartItem.PartItemDelivery
                , objPartItem.Created
                , objPartItem.CreatedBy];

            con.query(sql, values, (err, res) => {
                itemProcessed++;
                if (objPartItem.ItemAttachmentList.length > 0) {
                    objPartItem.PartId = PartId;
                    objPartItem.ShopPartItemId = res.insertId;
                    objPartItem.ImagesList = objPartItem.ItemAttachmentList;
                    PartImages.UpdatePartImages(objPartItem, (err1, data1) => { })
                }

                var params = {
                    PartId: PartId,
                    ShopPartItemId: res.insertId,
                    StockType: 1,
                    Quantity: objPartItem.ShopCurrentQuantity,
                    MROId: 0,
                    SOItemId: 0
                }
                PartItemShopStockLog.Create(params, (err2, data2) => { })
                if (itemProcessed === PartItems.length) {
                    if (err) {
                        //console.log("error: ", err);
                        result(err, null);
                    }
                    // result(null, { id: res.insertId });
                    else {
                        objPartItem.PartId = PartId;
                        objPartItem.ShopPartItemId = res.insertId;
                        result(null, objPartItem);
                    }
                }
            });
        }
    }
};

ShopPartItemModel.addPartItem = (reqBody, result) => {
    var sql = `insert into tbl_parts_item_shop(PartId,SerialNo,APNNo,VendorId,BuyingPrice,BaseBuyingPrice,BuyingExchangeRate,BuyingCurrencyCode,
        SellingPrice,BaseSellingPrice,SellingExchangeRate,SellingCurrencyCode,ShopTotalQuantity,ShopCurrentQuantity,LocationId,PartItemDescription,PartItemType,PartItemDelivery, Created, CreatedBy)
     values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    let objPartItem = new ShopPartItemModel(reqBody);
    var values = [objPartItem.PartId, objPartItem.SerialNo, objPartItem.APNNo
        , objPartItem.VendorId, objPartItem.BuyingPrice, objPartItem.BaseBuyingPrice, objPartItem.BuyingExchangeRate, objPartItem.BuyingCurrencyCode
        , objPartItem.SellingPrice, objPartItem.BaseSellingPrice, objPartItem.SellingExchangeRate, objPartItem.SellingCurrencyCode, objPartItem.ShopCurrentQuantity, objPartItem.ShopCurrentQuantity, objPartItem.LocationId
        , objPartItem.PartItemDescription, objPartItem.PartItemType, objPartItem.PartItemDelivery
        , objPartItem.Created
        , objPartItem.CreatedBy];
    con.query(sql, values, (err, res) => {
        if (err) {
            //console.log("error: ", err);
            result(err, null);
        } else {
            var updateParts = ``;
            if (objPartItem.updateCategory == 1) {
                updateParts = `UPDATE tbl_parts SET IsEcommerceProduct = 1, PartCategoryId ='${objPartItem.PartCategoryId}'  WHERE PartId='${objPartItem.PartId}' AND IsDeleted = 0`;
            } else {
                updateParts = `UPDATE tbl_parts SET IsEcommerceProduct = 1  WHERE PartId='${objPartItem.PartId}' AND IsDeleted = 0`;
            }

            var params = {
                PartId: objPartItem.PartId,
                ShopPartItemId: res.insertId,
                StockType: 1,
                Quantity: objPartItem.ShopCurrentQuantity,
                MROId: 0,
                SOItemId: 0
            }

            var RRId = reqBody.RRId ? reqBody.RRId : 0

            var updateMoveFlaginR = `UPDATE tbl_repair_request SET IsPartMovedToStore = 1   WHERE RRId='${RRId}' AND IsDeleted = 0`;

            async.parallel([
                function (result) { con.query(updateParts, result) },
                function (result) { PartItemShopStockLog.Create(params, result) },
                function (result) { con.query(updateMoveFlaginR, result) }
            ],
                function (err, results) {
                    if (err)
                        return result(err, null);

                    result(null, res);

                }
            );

        }
    });
}

ShopPartItemModel.CreatePartItemsStockIn = (PartId, WarehouseId, PartItems, result) => {
    try {

        // let slnos = PartItems.map(a => a.SerialNo).map(a => '\'' + a + '\'').join();
        // var checkSql = `SELECT * FROM tbl_parts_item_shop WHERE SerialNo IN (${slnos})`;
        let slnos = PartItems.map(a => a.RRId).map(a => '\'' + a + '\'').join();
        var checkSql = `SELECT * FROM tbl_inventory_stockin WHERE RRId IN (${slnos})`;
        var getPartNo = `SELECT PartNo FROM tbl_parts WHERE PartId=${PartId}`;
        con.query(checkSql, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            else if (res.length == PartItems.length) {
                result("The RR # is already assigned to a different RFID!", { duplicateRecords: res });
            } else {
                con.query(getPartNo, (getPartNoerr, getPartNores) => {
                    getPartNores = getPartNores[0];
                    // console.log(getPartNores);
                    var sql = `insert into tbl_parts_item_shop(PartId,SerialNo,IsNew,
                        SellingPrice,Quantity, IsAvailable, Status, WarehouseId, WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id,RFIDTagNo, Created, CreatedBy)
                        values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

                    for (let partsObj of PartItems) {

                        let objPartItem = new ShopPartItemModel(partsObj);
                        var values = [PartId, objPartItem.SerialNo, objPartItem.IsNew
                            , objPartItem.SellingPrice, objPartItem.Quantity, objPartItem.IsAvailable, objPartItem.Status
                            , objPartItem.WarehouseId, objPartItem.WarehouseSub1Id, objPartItem.WarehouseSub2Id, objPartItem.WarehouseSub3Id, objPartItem.WarehouseSub4Id, objPartItem.RFIDTagNo
                            , objPartItem.Created
                            , objPartItem.CreatedBy];

                        // console.log("PartItem sql :" + sql);
                        // console.log("PartItem values :" + values);
                        con.query(sql, values, (err, res) => {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                            // result(null, { id: res.insertId });
                            else {
                                objPartItem.PartId = PartId;
                                objPartItem.PartItemId = res.insertId;

                                var locationStatus = 0;

                                if (objPartItem.WarehouseId > 0 && objPartItem.WarehouseSub1Id > 0 && objPartItem.WarehouseSub2Id > 0 && objPartItem.WarehouseSub3Id > 0 && objPartItem.WarehouseSub4Id > 0) {
                                    locationStatus = 1;
                                }

                                Inventory.CreateInventoryQuery(objPartItem, (err, res) => {
                                    if (err) {
                                        result(err, null);
                                    } else {
                                        TempRFIDModel.remove(objPartItem.RFIDTagNo, (errTemp, dataTemp) => {

                                        });

                                        RR.updateRFIDTagNo(objPartItem, (err, res) => { });
                                        ShopPartItemModel.ViewPartItemQueryWithDetails(objPartItem.PartItemId, (err, data) => {
                                            result(null, { data: PartId, RRId: objPartItem.RRId, RRNo: objPartItem.RRNo, PartNo: getPartNores.PartNo, inventoryLocationAvailable: locationStatus, PartItem: data[0] });
                                        })
                                        // result(null, { data: PartId, PartNo: getPartNores.PartNo,inventoryLocationAvailable: objPartItem.WarehouseId>0 ? 1: 0, PartItem: objPartItem});
                                    }


                                })
                            }

                        });
                    }
                });
            }
        })

    } catch (err) {
        result(err, res);
    }


};

// Update Parts


ShopPartItemModel.UpdatePartItems = (item, partId, PartItems, result) => {
    var itemProcessed = 0;
    var values = '';
    var sql = '';
    if (PartItems && PartItems.length > 0) {
        for (let partsObj of PartItems) {
            let objPartItem = new ShopPartItemModel(partsObj);
            //console.log(objPartItem.ShopPartItemId)
            if (objPartItem.ShopPartItemId > 0) {
                sql = `Update tbl_parts_item_shop set SerialNo=?,APNNo=?,VendorId=?,BuyingPrice=?,BaseBuyingPrice=?,BuyingExchangeRate=?,BuyingCurrencyCode=?,
                SellingPrice=?,BaseSellingPrice=?,SellingExchangeRate=?,SellingCurrencyCode=?,LocationId=?,PartItemDescription=?,PartItemType=?,PartItemDelivery=?,Modified=?,Modifiedby=? where PartId=? and ShopPartItemId=?`;

                values = [objPartItem.SerialNo, objPartItem.APNNo, objPartItem.VendorId,
                objPartItem.BuyingPrice, objPartItem.BaseBuyingPrice, objPartItem.BuyingExchangeRate,
                objPartItem.BuyingCurrencyCode, objPartItem.SellingPrice, objPartItem.BaseSellingPrice,
                objPartItem.SellingExchangeRate, objPartItem.SellingCurrencyCode, objPartItem.LocationId,
                objPartItem.PartItemDescription, objPartItem.PartItemType, objPartItem.PartItemDelivery,
                cDateTime.getDateTime(), objPartItem.ModifiedBy,
                    partId, objPartItem.ShopPartItemId]
            } else {
                sql = `insert into tbl_parts_item_shop(PartId,SerialNo,APNNo,VendorId,BuyingPrice,BaseBuyingPrice,BuyingExchangeRate,BuyingCurrencyCode,
                    SellingPrice,BaseSellingPrice,SellingExchangeRate,SellingCurrencyCode,ShopTotalQuantity,ShopCurrentQuantity,LocationId,PartItemDescription,PartItemType,PartItemDelivery, Created, CreatedBy)
                 values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                values = [partId, objPartItem.SerialNo, objPartItem.APNNo
                    , objPartItem.VendorId, objPartItem.BuyingPrice, objPartItem.BaseBuyingPrice, objPartItem.BuyingExchangeRate, objPartItem.BuyingCurrencyCode
                    , objPartItem.SellingPrice, objPartItem.BaseSellingPrice, objPartItem.SellingExchangeRate, objPartItem.SellingCurrencyCode, objPartItem.ShopCurrentQuantity, objPartItem.ShopCurrentQuantity, objPartItem.LocationId
                    , objPartItem.PartItemDescription, objPartItem.PartItemType, objPartItem.PartItemDelivery
                    , objPartItem.Created, objPartItem.CreatedBy];
            }

            //console.log("Logs :" + sql, values);
            con.query(sql, values, (err, res) => {
                itemProcessed++;
                if (objPartItem.ShopPartItemId == 0) {
                    var params = {
                        PartId: partId,
                        ShopPartItemId: res.insertId,
                        StockType: 1,
                        Quantity: objPartItem.ShopCurrentQuantity,
                        MROId: 0,
                        SOItemId: 0
                    }
                    PartItemShopStockLog.Create(params, (err2, data2) => { })
                }
                if (objPartItem.ItemAttachmentList.length > 0) {
                    objPartItem.PartId = partId;
                    objPartItem.ShopPartItemId = objPartItem.ShopPartItemId > 0 ? objPartItem.ShopPartItemId : res.insertId;
                    objPartItem.ImagesList = objPartItem.ItemAttachmentList;
                    PartImages.UpdatePartImages(objPartItem, (err1, data1) => { })
                }
                if (itemProcessed === PartItems.length) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                        return;
                    }
                    result(null, { id: item.PartNo, ...item });
                    return;
                }


            });
        }
    }
};


ShopPartItemModel.ViewPartItemById = (ObjBody, result) => {
    var sql = `Select  PartItemId,PartId,SerialNo,IsNew,SellingPrice,Quantity,IsAvailable,Status
    from tbl_parts_item_shop as P
    where P.IsDeleted=0 and P.PartItemId=${ObjBody.PartItemId}`;
    con.query(sql, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
        return;
    });
}

ShopPartItemModel.ViewPartItemByPartId = (ObjBody, result) => {
    var sql = `Select  PartItemId,PartId,SerialNo,IsNew,SellingPrice,Quantity,IsAvailable,Status
    from tbl_parts_item_shop as P
    where P.IsDeleted=0 and P.PartId=${ObjBody.PartId}`;
    con.query(sql, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
        return;
    });
}


ShopPartItemModel.GetPartsInfoByPartItemId = (PartItemId, result) => {
    con.query(`Select PI.PartId,PI.PartItemId,P.PartNo, PI.SerialNo, V.VendorName as Manufacturer, P.ManufacturerPartNo,  P.ManufacturerId,  P.Description,PI.SellingPrice,P.Price 
      from tbl_parts_item_shop as PI 
      LEFT JOIN  tbl_parts as P ON P.PartId = PI.PartId
      LEFT JOIN  tbl_vendors as V ON V.VendorId = P.ManufacturerId
     where PI.IsDeleted=0 and PI.PartItemId=${PartItemId} `, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
}

ShopPartItemModel.DeletePartItem = (PartItemId) => {
    var PartItemObj = new ShopPartItemModel({ PartItemId: PartItemId });
    var sql = `UPDATE tbl_parts_item_shop SET IsDeleted=1,Modified='${PartItemObj.Modified}',ModifiedBy='${PartItemObj.ModifiedBy}' WHERE PartItemId=${PartItemObj.PartItemId}`;
    return sql;
}


ShopPartItemModel.ViewPartItemQuery = (PartItemId) => {
    var sql = `Select  PartItemId,PartId,SerialNo,IsNew,SellingPrice,Quantity,IsAvailable,Status
    from tbl_parts_item_shop as P
    where P.IsDeleted=0 and P.PartItemId=${PartItemId}`;
    return sql;
}


module.exports = ShopPartItemModel;
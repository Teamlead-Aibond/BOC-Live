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
const PartItemModel = function (objPartItem) {
    this.PartItemId = objPartItem.PartItemId;
    this.RRId = objPartItem.RRId ? objPartItem.RRId : null;
    this.RRNo = objPartItem.RRNo ? objPartItem.RRNo : '';
    this.PartId = objPartItem.PartId;
    this.SerialNo = objPartItem.SerialNo ? objPartItem.SerialNo : "";
    this.IsNew = objPartItem.IsNew ? objPartItem.IsNew : 1;
    this.SellingPrice = objPartItem.SellingPrice ? objPartItem.SellingPrice : 0;
    this.Quantity = objPartItem.Quantity ? objPartItem.Quantity : 1;
    this.IsAvailable = objPartItem.IsAvailable ? objPartItem.IsAvailable : 1;
    this.Status = objPartItem.Status ? objPartItem.Status : "IN";

    this.WarehouseId = objPartItem.WarehouseId ? objPartItem.WarehouseId : 0;
    this.WarehouseSub1Id = objPartItem.WarehouseSub1Id ? objPartItem.WarehouseSub1Id : 0;
    this.WarehouseSub2Id = objPartItem.WarehouseSub2Id ? objPartItem.WarehouseSub2Id : 0;
    this.WarehouseSub3Id = objPartItem.WarehouseSub3Id ? objPartItem.WarehouseSub3Id : 0;
    this.WarehouseSub4Id = objPartItem.WarehouseSub4Id ? objPartItem.WarehouseSub4Id : 0;
    this.RFIDEmployeeNo = objPartItem.RFIDEmployeeNo ? objPartItem.RFIDEmployeeNo : null;

    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (objPartItem.authuser && objPartItem.authuser.UserId) ? objPartItem.authuser.UserId : TokenUserId;
    this.ModifiedBy = (objPartItem.authuser && objPartItem.authuser.UserId) ? objPartItem.authuser.UserId : TokenUserId;

    //For Inventory
    this.RFIDTagNo = objPartItem.RFIDTagNo ? objPartItem.RFIDTagNo : '';
    this.StoredSince = objPartItem.StoredSince ? objPartItem.StoredSince : null;
    this.PartItems = objPartItem.PartItems;
};

PartItemModel.CreatePartItems = (PartId, WarehouseId, PartItems, result) => {
    var sql = `insert into tbl_parts_item(PartId,SerialNo,IsNew,
    SellingPrice,Quantity, IsAvailable, Status, WarehouseId, WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id,RFIDTagNo, Created, CreatedBy)
     values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    if (PartItems && PartItems.length > 0) {
        for (let partsObj of PartItems) {

            let objPartItem = new PartItemModel(partsObj);
            var values = [PartId, objPartItem.SerialNo, objPartItem.IsNew
                , objPartItem.SellingPrice, objPartItem.Quantity, objPartItem.IsAvailable, objPartItem.Status
                , WarehouseId, objPartItem.WarehouseSub1Id, objPartItem.WarehouseSub2Id, objPartItem.WarehouseSub3Id, objPartItem.WarehouseSub4Id, objPartItem.RFIDTagNo
                , objPartItem.Created
                , objPartItem.CreatedBy];

            con.query(sql, values, (err, res) => {
                if (err) {
                    //console.log("error: ", err);
                    result(err, null);
                }
                // result(null, { id: res.insertId });
                else {
                    objPartItem.PartId = PartId;
                    objPartItem.PartItemId = res.insertId;

                    Inventory.CreateInventory(objPartItem, (err, res) => {
                        result(null, res);
                    })
                }

            });
        }
    }
};

PartItemModel.CreatePartItemsStockIn = (PartId, WarehouseId, PartItems, result) => {
    try {

        // let slnos = PartItems.map(a => a.SerialNo).map(a => '\'' + a + '\'').join();
        // var checkSql = `SELECT * FROM tbl_parts_item WHERE SerialNo IN (${slnos})`;
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
                    var sql = `insert into tbl_parts_item(PartId,SerialNo,IsNew,
                        SellingPrice,Quantity, IsAvailable, Status, WarehouseId, WarehouseSub1Id, WarehouseSub2Id, WarehouseSub3Id, WarehouseSub4Id,RFIDTagNo, Created, CreatedBy)
                        values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

                    for (let partsObj of PartItems) {

                        let objPartItem = new PartItemModel(partsObj);
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

                                if(objPartItem.WarehouseId > 0 && objPartItem.WarehouseSub1Id > 0 && objPartItem.WarehouseSub2Id > 0 && objPartItem.WarehouseSub3Id > 0 && objPartItem.WarehouseSub4Id > 0) {
                                    locationStatus = 1;
                                }

                                Inventory.CreateInventoryQuery(objPartItem, (err, res) => {
                                    if (err) {
                                        result(err, null);
                                    } else {
                                        TempRFIDModel.remove(objPartItem.RFIDTagNo, (errTemp, dataTemp) => {

                                        });

                                        RR.updateRFIDTagNo(objPartItem, (err, res) => {});
                                        PartItemModel.ViewPartItemQueryWithDetails(objPartItem.PartItemId, (err, data) => {
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


PartItemModel.UpdatePartItems = (item, result) => {

    var sql = `Update tbl_parts_item set SerialNo=?, IsNew=?, SellingPrice=?, Quantity=?, IsAvailable=?, Status=?,  Modified=?, Modifiedby=? where PartId=? and PartItemId=?`;

    var values = [item.PartItem.SerialNo, item.PartItem.IsNew, item.PartItem.SellingPrice
        , item.PartItem.Quantity, item.PartItem.IsAvailable, item.PartItem.Status, cDateTime.getDateTime()
        , item.ModifiedBy, item.PartItem.PartItemId, item.PartItemId]

    //  console.log("Logs :" + sql, values);
    con.query(sql, values, (err, res) => {
        if (err) {
            // console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: item.PartItem.PartNo, ...item });
        return;

    });
};

PartItemModel.UpdatePartItemsMulti = (partId, WarehouseId, items, result) => {
    var sql = [];
    items.forEach((item, i) => {
        item = escapeSqlValues(item);
        var partItem = new PartItemModel(item);
        partItem.WarehouseId = WarehouseId;
        partItem.PartId = partId;
        if (partItem.PartItemId) {
            sql.push(`Update tbl_parts_item set SerialNo= '${partItem.SerialNo}', IsNew= ${partItem.IsNew}, SellingPrice= ${partItem.SellingPrice}, Quantity= ${partItem.Quantity}, IsAvailable= ${partItem.IsAvailable}, Status= '${partItem.Status}', WarehouseId= ${partItem.WarehouseId}, WarehouseSub1Id= ${partItem.WarehouseSub1Id}, WarehouseSub2Id= ${partItem.WarehouseSub2Id}, WarehouseSub3Id= ${partItem.WarehouseSub3Id}, WarehouseSub4Id= ${partItem.WarehouseSub4Id}, RFIDTagNo= '${partItem.RFIDTagNo}',  Modified= '${partItem.Modified}', Modifiedby= ${partItem.ModifiedBy} where PartItemId= ${partItem.PartItemId};`);
            sql.push(`Update tbl_inventory set PartItemId = ${partItem.PartItemId}, PartId = ${partItem.PartId}, RFIDTagNo = '${partItem.RFIDTagNo}', IsAvailable = ${partItem.IsAvailable}, WarehouseId = ${partItem.WarehouseId}, WarehouseSub1Id = ${partItem.WarehouseSub1Id}, WarehouseSub2Id = ${partItem.WarehouseSub2Id}, WarehouseSub3Id = ${partItem.WarehouseSub3Id}, WarehouseSub4Id = ${partItem.WarehouseSub4Id} where InventoryId= ${item.InventoryId};`);
        }
    })

    PartItemModel.CreatePartItemsStockIn(partId, WarehouseId, items.filter(a => a.PartItemId == ""), () => { })



    async.parallel(sql.map(s => result => {
        // console.log("query :" + s);
        con.query(s, result)
    }), (err, res) => {
        if (err) {
            // console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { items });
        return;

    });
};

PartItemModel.ViewPartItemById = (ObjBody, result) => {
    var sql = `Select  PartItemId,PartId,SerialNo,IsNew,SellingPrice,Quantity,IsAvailable,Status
    from tbl_parts_item as P
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

PartItemModel.ViewPartItemByPartId = (ObjBody, result) => {
    var sql = `Select  PartItemId,PartId,SerialNo,IsNew,SellingPrice,Quantity,IsAvailable,Status
    from tbl_parts_item as P
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


PartItemModel.GetPartsInfoByPartItemId = (PartItemId, result) => {
    con.query(`Select PI.PartId,PI.PartItemId,P.PartNo, PI.SerialNo, V.VendorName as Manufacturer, P.ManufacturerPartNo,  P.ManufacturerId,  P.Description,PI.SellingPrice,P.Price 
      from tbl_parts_item as PI 
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

PartItemModel.DeletePartItem = (PartItemId) => {
    var PartItemObj = new PartItemModel({ PartItemId: PartItemId });
    var sql = `UPDATE tbl_parts_item SET IsDeleted=1,Modified='${PartItemObj.Modified}',ModifiedBy='${PartItemObj.ModifiedBy}' WHERE PartItemId=${PartItemObj.PartItemId}`;
    return sql;
}


PartItemModel.ViewPartItemQuery = (PartItemId) => {
    var sql = `Select  PartItemId,PartId,SerialNo,IsNew,SellingPrice,Quantity,IsAvailable,Status
    from tbl_parts_item as P
    where P.IsDeleted=0 and P.PartItemId=${PartItemId}`;
    return sql;
}

PartItemModel.ViewPartItemQueryWithDetails = (PartItemId, result) => {
    var sql = `Select  pi.PartId,pi.PartItemId,p.PartNo, pi.SerialNo, V.VendorName as Manufacturer, p.ManufacturerPartNo,  p.ManufacturerId,  p.Description,pi.SellingPrice,p.Price, 
    pi.Quantity,pi.IsAvailable,pi.Status,pi.IsNew,
    wh.WarehouseId, wh.WarehouseName, 
    whs1.WarehouseSub1Id, whs1.WarehouseSub1Name, 
    whs2.WarehouseSub2Id, whs2.WarehouseSub2Name, 
    whs3.WarehouseSub3Id, whs3.WarehouseSub3Name, whs3.WarehouseSub3LayoutImage, 
    whs4.WarehouseSub4Id, whs4.WarehouseSub4Name,pi.RFIDTagNo 
    FROM ahoms.tbl_parts_item pi
    LEFT JOIN tbl_parts p ON p.PartId = pi.PartId
    LEFT JOIN tbl_warehouse wh on wh.WarehouseId=pi.WarehouseId
    LEFT JOIN tbl_warehouse_sublevel1 whs1 on whs1.WarehouseSub1Id=pi.WarehouseSub1Id
    LEFT JOIN tbl_warehouse_sublevel2 whs2 on whs2.WarehouseSub2Id=pi.WarehouseSub2Id
    LEFT JOIN tbl_warehouse_sublevel3 whs3 on whs3.WarehouseSub3Id=pi.WarehouseSub3Id
    LEFT JOIN tbl_warehouse_sublevel4 whs4 on whs4.WarehouseSub4Id=pi.WarehouseSub4Id
    LEFT JOIN  tbl_vendors as V ON V.VendorId = p.ManufacturerId
    where pi.IsDeleted=0 and pi.PartItemId=${PartItemId}`;
    con.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            result(null, err);
            return;
        }
        result(null, res);
        return;
    });
}
// To IsExistPartIdSerialNo
PartItemModel.IsExistSerialNo = (SerialNo, result) => {
    var sql = `Select PartItemId,PartId,SerialNo,SellingPrice from tbl_parts_item where IsDeleted=0 and SerialNo='${SerialNo}' `;
    // console.log("sql=" + sql)
    con.query(sql, (err, res) => {
        if (err) { return result(err, null); }
        return result(null, res);
    });
};

PartItemModel.UpdatePartItemsStockIn = (PartId, PartItemId, PartItems, result) => {
    try {

        let slnos = PartItems.map(a => a.RRId).map(a => '\'' + a + '\'').join();
        //var checkSql = `SELECT * FROM tbl_parts_item WHERE SerialNo IN (${slnos}) AND PartId!=${PartId} AND PartItemId!=${PartItemId}`;
        var checkSql = `SELECT * FROM tbl_inventory_stockin WHERE RRNo IN (${slnos}) AND PartId!=${PartId} AND PartItemId!=${PartItemId}`;
        var getPartNo = `SELECT PartNo FROM tbl_parts WHERE PartId=${PartId}`;
        con.query(checkSql, (err, res) => {
            if (err) {
                // console.log("error: ", err);
                result(err, null);
            }
            else if (res.length == PartItems.length) {
                result("Some serial number(s) alreay exists!", { duplicateRecords: res });
            } else {
                con.query(getPartNo, (getPartNoerr, getPartNores) => {
                    getPartNores = getPartNores[0];
                    var sql = `Update tbl_parts_item set IsNew=?, SellingPrice=?, Quantity=?, IsAvailable=?, Status=?,WarehouseId=?, WarehouseSub1Id=?, WarehouseSub2Id=?, WarehouseSub3Id=?, WarehouseSub4Id=?,  Modified=?, Modifiedby=? where PartId=? and PartItemId=?`;

                    for (let partsObj of PartItems) {

                        let objPartItem = new PartItemModel(partsObj);
                        var values = [objPartItem.IsNew
                            , objPartItem.SellingPrice, objPartItem.Quantity, objPartItem.IsAvailable, objPartItem.Status
                            , objPartItem.WarehouseId, objPartItem.WarehouseSub1Id, objPartItem.WarehouseSub2Id, objPartItem.WarehouseSub3Id, objPartItem.WarehouseSub4Id
                            , objPartItem.Modified
                            , objPartItem.ModifiedBy, PartId, PartItemId];

                        // console.log("PartItem sql :" + sql);
                        // console.log("PartItem values :" + values);
                        con.query(sql, values, (err, res) => {
                            if (err) {
                                // console.log("error: ", err);
                                result(err, null);
                            }
                            // result(null, { id: res.insertId });
                            else {
                                objPartItem.PartId = PartId;
                                objPartItem.PartItemId = PartItemId;

                                Inventory.UpdateInventoryQuery(objPartItem, (err, res) => {
                                    // console.log(res)
                                    if (err)
                                        result(err, null);
                                    // result(null, { data: PartId, PartNo: getPartNores.PartNo});

                                    var inventoryLocationAvailableValue = 0;
                                    if(objPartItem.WarehouseId > 0 && objPartItem.WarehouseSub1Id > 0 && objPartItem.WarehouseSub2Id > 0 && objPartItem.WarehouseSub3Id > 0 && objPartItem.WarehouseSub4Id > 0) {
                                        inventoryLocationAvailableValue = 1;
                                    } 
                                    PartItemModel.ViewPartItemQueryWithDetails(PartItemId, (err, data) => {
                                        result(null, { data: PartId, RRId: objPartItem.RRId, RRNo: objPartItem.RRNo, PartNo: getPartNores.PartNo, inventoryLocationAvailable: inventoryLocationAvailableValue, PartItem: data[0] });
                                        //result(null, { data: PartId, PartNo: getPartNores.PartNo, inventoryLocationAvailable: objPartItem.WarehouseId > 0 ? 1 : 0, PartItem: data[0] });
                                    })

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

module.exports = PartItemModel;
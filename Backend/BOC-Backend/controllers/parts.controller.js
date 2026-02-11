/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Parts = require("../models/parts.model.js");
const ReqRes = require("../helper/request.response.validation.js");
const Constants = require("../config/constants.js");
const PartImages = require("../models/parts.images.model.js");
const PartItem = require("../models/part.items.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const NotificationModel = require("../models/notification.model.js");
const InventoryModel = require("../models/inventory.model.js");
var async = require('async');
var cDateTime = require("../utils/generic.js");
var XLSX = require('xlsx')
results = [];
var path = require('path');

exports.ImportManufacturer = (req, res) => {
    const path = req.file.path;
    var wb = XLSX.readFile(path);
    let sheetName = Object.keys(wb.Sheets)[0]
    var PARTJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
    results = [];
    RecursiveUpdateManufacturer(0, PARTJSON, (err, data) => {
        if (err)
            Reqresponse.printResponse(res, err, null);
        else
            Reqresponse.printResponse(res, null, data);
    });
};

function RecursiveUpdateManufacturer(i, PARTJSON, cb) {
    Parts.ImportManufacturer(PARTJSON[i], (err, data) => {
        i = i + 1;
      //  console.log(i, "record processed");
        if (err) {
            var msg = err.message || err.msg || err;
            results.push({ record: i, message: msg });
        }
        // else {
        //     if (data.Status == "Record Updated")
        //         results.push({ record: i, message: data.Status + " : " + data.PartNo });
        //     else
        //         results.push({ record: i, message: data.Status + " : " + data.PartNo });
        // }
        if (i == PARTJSON.length) {
            return cb(null, results);
        }
        RecursiveUpdateManufacturer(i, PARTJSON, cb);
    });
}

exports.PartsListByServerSide = (req, res) => {
    Parts.PartsListByServerSide(new Parts(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.PartsListStoreByServerSide = (req, res) => {
    Parts.PartsListStoreByServerSide(new Parts(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.ecommerceProduct = (req, res) => {
    Parts.ecommerceProductList(new Parts(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.ecommerceProductView = (req, res) => {
    if (req.body.hasOwnProperty('PartId') && req.body.hasOwnProperty('CustomerId') && req.body.hasOwnProperty('ShopPartItemId')) {
        Parts.ecommerceProductView(req.body.PartId, req.body.CustomerId, req.body.ShopPartItemId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "Part/Customer/ShopPartItemId Id is required" }, null);
    }
};

exports.PartsList = (req, res) => {
    Parts.getAll((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.PartsList20 = (req, res) => {
    Parts.getAll20((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.addNewPart = (req, res) => {
    Parts.addNewPart(req.body, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.addNewPartItems = (req, res) => {
    PartItem.CreatePartItemsStockIn(req.body.PartId, req.body.WarehouseId, req.body.InventoryStockInList, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    })
}

exports.updateNewPartItems = (req, res) => {
    PartItem.UpdatePartItemsStockIn(req.body.PartId, req.body.PartItemId, req.body.InventoryStockInList, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    })
}

//For Inventory
exports.addNewPartInventory = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        Parts.addNewPartInventory(req.body, (err, data) => {

            if (err) {
                Reqresponse.printResponse(res, { msg: err.message || err.msg || err }, null);
                return;
            }

            if (!data) {
                Reqresponse.printResponse(res, { msg: "There is a problem in creating a Part. Please check the details." }, null);
                return;
            }

            req.body.PartId = data.id;

            PartItem.CreatePartItems(req.body.PartId, req.body.WarehouseId, req.body.PartItems, (err, data) => {
                // Reqresponse.printResponse(res, err, { data: req.body.PartId });
            })
            var authuser_FullName = (req.body.authuser && req.body.authuser.FullName) ? req.body.authuser.FullName : global.authuser.FullName;
            //To add RR created status in notification table
            var NotificationObj = new NotificationModel({
                PartId: data.id,
                NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_PART,
                NotificationIdentityId: data.id,
                NotificationIdentityNo: 'P' + data.id,
                ShortDesc: 'Part Created',
                Description: 'Part Created by Admin (' + authuser_FullName+ ') on ' + cDateTime.getDateTime()
            });

            async.parallel([
                function (result) { if (req.body.hasOwnProperty('ImagesList')) { PartImages.CreatePartImages(req.body, result); } else { Parts.emptyFunction({}, result); } },
                function (result) { NotificationModel.Create(NotificationObj, result); }
            ],
                function (err, results) {
                    if (err)
                        Reqresponse.printResponse(res, err, null);
                    else
                        Reqresponse.printResponse(res, err, { data: req.body.PartId, PartNo: req.body.PartNo });
                }
            );
        });
    }
};

exports.addPart = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        Parts.addPart(new Parts(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });

    }
};

exports.updatePart = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        async.parallel([
            function (result) { Parts.updatePart(req.body, result) },
            function (result) { if (req.body.hasOwnProperty('ImagesList')) { PartImages.UpdatePartImages(req.body, result); } else { Parts.emptyFunction({}, result); } },

        ],
            function (err, results) {
                if (err)
                    Reqresponse.printResponse(res, err, null);
                else
                    Reqresponse.printResponse(res, err, { data: req.body.PartId });
            }
        );

    }
};

exports.updateShopPart = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        async.parallel([
            function (result) { Parts.updateShopPart(req.body, result) },
        ],
            function (err, results) {
                if (err)
                    Reqresponse.printResponse(res, err, null);
                else
                    Reqresponse.printResponse(res, err, { data: req.body.PartId });
            }
        );

    }
};

exports.updatePartQuantity = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        async.parallel([
            function (result) { Parts.updatePartQuantity(req.body, result) }],
            function (err, results) {
                if (err)
                    Reqresponse.printResponse(res, err, null);
                else
                    Reqresponse.printResponse(res, err, { data: req.body.PartId });
            }
        );

    }
};

exports.preferredVendorUpdate = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        Parts.preferredVendorUpdate(req.body, (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });

    }
};

exports.updatePartInventory = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        Parts.updatePartInventory(req.body, (err, data) => {

            if (!data) {
                Reqresponse.printResponse(res, { msg: "There is a problem in creating a Part. Please check the details." }, null);
                return;
            }

            req.body.PartId = data.id;

            PartItem.UpdatePartItemsMulti(req.body.PartId, req.body.WarehouseId, req.body.PartItems, (err, data) => {
                // Reqresponse.printResponse(res, err, { data: req.body.PartId });
            })

            async.parallel([
                function (result) { if (req.body.hasOwnProperty('ImagesList')) { PartImages.UpdatePartImages(req.body, result); } else { Parts.emptyFunction({}, result); } },
            ],
                function (err, results) {
                    if (err)
                        Reqresponse.printResponse(res, err, null);
                    else
                        Reqresponse.printResponse(res, err, { data: req.body.PartId, PartNo: data.PartNo });
                }
            );
        });
    }
};

exports.GetPartsByPartId = (req, res) => {
    if (req.body.hasOwnProperty('PartId')) {
        var Type = "customer"
        var CustomerId = req.body.CustomerId ? req.body.CustomerId : 0;
        var VendorId = req.body.VendorId ? req.body.VendorId : 0;
        if (req.body.hasOwnProperty('VendorId')) {
            Type = "vendor"
            Parts.GetPartsByPartId(req.body.PartId, VendorId, Type, (err, data) => {
                ReqRes.printResponse(res, err, data);
            });
        } else {
            Type = "customer"
            Parts.GetPartsByPartId(req.body.PartId, CustomerId, Type, (err, data) => {
                ReqRes.printResponse(res, err, data);
            });
        }
    } else {
        Reqresponse.printResponse(res, { msg: "Part Id is required" }, null);
    }
};
exports.GetPartsByPartItemId = (req, res) => {
    if (req.body.hasOwnProperty('PartItemId')) {
        PartItem.GetPartsInfoByPartItemId(req.body.PartItemId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Part Item no is required" }, null);
    }
};




exports.GetPartByPartIdForInventory = (req, res) => {
    Parts.GetPartByPartIdForInventory(req.body.PartId, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.GetPartByPartNo = (req, res) => {
    if (req.body.hasOwnProperty('PartNo')) {
        Parts.GetPartByPartNo(req.body.PartNo, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Part no is required" }, null);
    }
};
exports.SearchPartByPartNo = (req, res) => {
    if (req.body.hasOwnProperty('PartNo')) {
        Parts.SearchPartByPartNo(req.body.PartNo, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Part no is required" }, null);
    }
};


exports.SearchNonRepairPartByPartNo = (req, res) => {
    if (req.body.hasOwnProperty('PartNo')) {
        Parts.SearchNonRepairPartByPartNo(req.body.PartNo, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Part no is required" }, null);
    }
};

exports.ViewPartImages = (req, res) => {
    if (req.body.hasOwnProperty('PartId')) {
        PartImages.ViewPartImages(req.body.PartId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Part no is required" }, null);
    }
};


exports.checkPartsAvailability = (req, res) => {
    if (req.body.hasOwnProperty('PartNo')) {
        Parts.checkPartsAvailability(req.body, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Part no is required" }, null);
    }
};

exports.Partstracking = (req, res) => {
    async.parallel([
        function (result) { Parts.Partstracking(req.body.PartNo, req.body.SerialNo, result); },
        function (result) { Parts.PartstrackingByRoom(req.body.PartNo, req.body.SerialNo, result); }
    ],
        function (err, results) {
            if (err)
                Reqresponse.printResponse(res, err, null);
            else
                Reqresponse.printResponse(res, err, { Parts: results[0], WarehouseSub4List: results[1] });
        }
    );
    // Parts.Partstracking(req.body.PartNo,req.body.SerialNo,(err,data)=>{
    //     ReqRes.printResponse(res,err,data);  
    // });
};

//For AddRRPartsToInventory
exports.AddRRPartsToInventory = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        PartItem.IsExistSerialNo(req.body.SerialNo, (err, data) => {
            if (!data) {
                return Reqresponse.printResponse(res, { msg: "Oops..Something went wrong" }, null);
            }
            // console.log("data.length=" + data.length)
            if (data.length == 0) {
                var TempJsonArray = [];
                var obj = {};
                obj.SerialNo = req.body.SerialNo;
                obj.IsNew = req.body.IsNew;
                obj.SellingPrice = req.body.SellingPrice;
                obj.Quantity = req.body.Quantity;
                obj.StoredSince = req.body.StoredSince;//For Create Inventory
                obj.IsAvailable = req.body.IsAvailable;
                obj.Status = req.body.Status;
                obj.WarehouseSub1Id = req.body.WarehouseSub1Id;
                obj.WarehouseSub2Id = req.body.WarehouseSub2Id;
                obj.WarehouseSub3Id = req.body.WarehouseSub3Id;
                obj.WarehouseSub4Id = req.body.WarehouseSub4Id;
                obj.RFIDTagNo = req.body.RFIDTagNo;

                TempJsonArray.push(obj);
                req.body.PartItems = TempJsonArray;
                PartItem.CreatePartItems(req.body.PartId, req.body.WarehouseId, req.body.PartItems, (err, data) => {
                    Reqresponse.printResponse(res, null, data);
                });
            }
            else {
                req.body.PartItemId = data[0].PartItemId;
                req.body.PartId = data[0].PartId;
                InventoryModel.CreateInventory(new InventoryModel(req.body), (err, data) => {
                    Reqresponse.printResponse(res, null, data);
                });
            }
        });
    }
};

exports.PartstrackingByRFIdTagNo = (req, res) => {
    async.parallel([
        function (result) { Parts.PartstrackingByRFIDTagNo(req.body.RFIDTagNo, result); },
        function (result) { Parts.PartstrackingByRFIDTagNoByRoom(req.body.RFIDTagNo, result); }
    ],
        function (err, results) {
            if (err)
                Reqresponse.printResponse(res, err, null);
            else
                Reqresponse.printResponse(res, err, { Parts: results[0], WarehouseSub4List: results[1] });
        }
    );
    // Parts.Partstracking(req.body.PartNo,req.body.SerialNo,(err,data)=>{
    //     ReqRes.printResponse(res,err,data);  
    // });
};

exports.PartstrackingByRFIdTagNos = (req, res) => {
    async.parallel([
        function (result) { Parts.PartstrackingByRFIDTagNos(req.body.RFIDTagNos, result); },
        function (result) { Parts.PartstrackingByRFIDTagNosByRoom(req.body.RFIDTagNos, result); }
    ],
        function (err, results) {
            if (err)
                Reqresponse.printResponse(res, err, null);
            else
                Reqresponse.printResponse(res, err, { Parts: results[0], WarehouseSub4List: results[1] });
        }
    );
    // Parts.Partstracking(req.body.PartNo,req.body.SerialNo,(err,data)=>{
    //     ReqRes.printResponse(res,err,data);  
    // });
};



exports.checkMROPartsAvailability = (req, res) => {
    Parts.checkMROPartsAvailability(req.body.PartNo, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.CheckPartsAvailabilityByPartNo = (req, res) => {
    Parts.CheckPartsByPartNo(req.body.PartNo, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.trackPart = (req, res) => {
    Parts.trackPart(req.body, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.nonLocationList = (req, res) => {
    Parts.nonLocationList((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.checkPartId = (req, res) => {
    if (req.body.hasOwnProperty('PartId')) {
        Parts.checkPartId(req.body, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        Reqresponse.printResponse(res, { msg: "Part Id is required" }, null);
    }
};

// exports.employeeIdUpdate = (req, res) => {
//     Parts.employeeIdUpdate(req.body, (err, data) => {
//         ReqRes.printResponse(res, err, data);
//     });
// };
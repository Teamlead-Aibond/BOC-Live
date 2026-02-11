/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const UPS = require("../models/ups.model.js");
const ReqRes = require("../helper/request.response.validation.js");
var async = require('async');
const con = require("../helper/db.js");
var querystring = require('querystring');
const { exit } = require("process");

// To Create UPS Shipping
exports.create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        // UPS.create(new UPS(req.body), (err, data) => {
        //     if (err) {
        //         ReqRes.printResponse(res, err, null);
        //     }
        //     ReqRes.printResponse(res, null, data);
        // });
        async.parallel([
            function (result) { UPS.create(new UPS(req.body), result) },
            function (result) { UPS.updateShippingHistoryTrackingNo(new UPS(req.body), result) },
        ],
            function (err, results) {
                if (err) { return result(err, null); }
                else {
                    ReqRes.printResponse(res, err, results[0]);
                }
            })
    }
    else {
        ReqRes.printResponse(res, { msg: "Request can not be empty" }, null);
    }
};
exports.findOne = (req, res) => {
    UPS.findById(req.body.ShippingHistoryId, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.void = (req, res) => {
    UPS.remove(req.body.ShippingHistoryId, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};
exports.generateLabel = (req, res) => {
    UPS.generateLabel(req, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};
exports.cancelLabel = (req, res) => {
    UPS.cancelLabel(req, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};
exports.trackLabel = (req, res) => {
    UPS.trackLabel(req, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};
exports.addressValidate = (req, res) => {
    UPS.addressValidate(req, (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

// To Bulk Create UPS Shipping
exports.bulkCreate = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        if (req.body.ShippingHistoryId.length > 0) {
            var insertData = [];
            var filtered = req.body.ShippingHistoryId.filter(function (el) {
                return el != null;
              });
              filtered.forEach((ShippingHistoryId, i) => {
                // for (i = 0; i < req.body.ShippingHistoryId.length; i++) {
                if (ShippingHistoryId != null) {
                    var Obj = {};
                    Obj.ShippingHistoryId = ShippingHistoryId;
                    Obj.UPSTrackingNo = req.body.UPSTrackingNo;
                    Obj.TransportationCharges = req.body.TransportationCharges;
                    Obj.ServiceOptionsCharges = req.body.ServiceOptionsCharges;
                    Obj.OverallTotalCharges = req.body.OverallTotalCharges;
                    Obj.BillingWeightCode = req.body.BillingWeightCode;
                    Obj.BillingWeight = req.body.BillingWeight;
                    Obj.UPSStatus = req.body.UPSStatus;
                    Obj.UPSShippingLabel = req.body.UPSShippingLabel;
                    async.parallel([
                        function (result) { UPS.create(new UPS(Obj), result) },
                        function (result) { UPS.updateShippingHistoryTrackingNo(new UPS(Obj), result) },
                    ],
                        function (err, results) {
                            if (err) { return result(err, null); }
                            else {
                                insertData.push(results[0]);
                                if(insertData.length == filtered.length){
                                    ReqRes.printResponse(res, err, insertData);
                                }
                            }
                        })
                }
            // }
            })
        }
        else {
            ReqRes.printResponse(res, { msg: "Shipping History Id can not be empty" }, null);
        }
    } else {
        ReqRes.printResponse(res, { msg: "Request can not be empty" }, null);
    }
};
// Bulk address validate
exports.bulkAddressValidate = (req, res) => {
  var Type = 0;
  var Addressquery = `SELECT ab.AddressId, ab.City as ShipToCity, ab.Zip as ShipToPostalCode, co.CountryCode, s.StateCode as ShipToStateCode
  FROM tbl_address_book as ab      
  LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
  LEFT JOIN tbl_states s on s.StateId=ab.StateId where ab.IsUPSVerified=0 AND ab.IsDeleted=0`;
  con.query(Addressquery, (err, res1) => {
    if (err) {
        ReqRes.printResponse(res, err, null);
    }
    if (res1.length > 0) {
        // console.log(res1.length)
        Recursive(0, res1, (errcb,datacb) => {
            if (errcb)
                ReqRes.printResponse(res, errcb, null);
            else
                ReqRes.printResponse(res, null, datacb);
        });
    }else {
        ReqRes.printResponse(res, { msg: "Address not found" }, null);
    }
  });

}

exports.singleAddressValidate = (AddressList, Type, respo) => {
    if(Type == "single"){
        var filteredId = AddressList.find(x => x.AddressId != '').AddressId;
        var Addressquery = `SELECT ab.AddressId, ab.City as ShipToCity, ab.Zip as ShipToPostalCode, co.CountryCode, s.StateCode as ShipToStateCode
        FROM tbl_address_book as ab      
        LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
        LEFT JOIN tbl_states s on s.StateId=ab.StateId where ab.AddressId in (${filteredId})`;
        con.query(Addressquery, (err, res1) => {
              if (res1.length > 0) {
                  Recursive1(0, res1, AddressList, (errcb,datacb) => {
                    respo(datacb);
                    return
                  });
              }
            });
    }else{
        var Addressquery = `SELECT ab.AddressId, ab.City as ShipToCity, ab.Zip as ShipToPostalCode, co.CountryCode, s.StateCode as ShipToStateCode
        FROM tbl_address_book as ab      
        LEFT JOIN tbl_countries co on co.CountryId=ab.CountryId
        LEFT JOIN tbl_states s on s.StateId=ab.StateId where ab.AddressId>=${AddressList[0].AddressId}`;

        con.query(Addressquery, (err, res1) => {
              if (res1.length > 0) {
                  Recursive2(0, res1, AddressList, (errcb,datacb) => {
                    respo(datacb);
                    return
                  });
              }
            });
    }
    
    
  
  }

  function Recursive1(i, res, AddressList, cb) {
    var postData = {
        ShipToCity: res[i].ShipToCity,
        ShipToStateCode: res[i].ShipToStateCode,
        ShipToPostalCode: res[i].ShipToPostalCode
    };
    var IsUPSVerified = 0;
    if (res[i].CountryCode == '' || res[i].CountryCode == null || res[i].CountryCode != 'US') {
        updateAddressIsUPSVerified(res[i].AddressId, IsUPSVerified)
        AddressList[i].IsUPSVerified = IsUPSVerified;
        i = i + 1;
        if (i == res.length) {
            return cb(null, AddressList);
        }
        Recursive1(i, res, AddressList, cb);
    } else {
        UPS.addressValidate(postData, (err, data) => {
            if (data.AddressValidationResponse.Response.ResponseStatusDescription == 'Success') {
                IsUPSVerified = 1;
            } else {
                IsUPSVerified = 2;
            }
            updateAddressIsUPSVerified(res[i].AddressId, IsUPSVerified)
            AddressList[i].IsUPSVerified = IsUPSVerified;
            i = i + 1;
            if (i == res.length) {
                return cb(null, AddressList);
            }
            Recursive1(i, res, AddressList, cb);
        });
    }
}

function Recursive2(i, res, AddressList, cb) {
    var postData = {
        ShipToCity: res[i].ShipToCity,
        ShipToStateCode: res[i].ShipToStateCode,
        ShipToPostalCode: res[i].ShipToPostalCode
    };
    var IsUPSVerified = 0;
    if (res[i].CountryCode == '' || res[i].CountryCode == null || res[i].CountryCode != 'US') {
        updateAddressIsUPSVerified(res[i].AddressId, IsUPSVerified)
        i = i + 1;
        if (i == res.length) {
            return;
        }
        Recursive1(i, res, AddressList, cb);
    } else {
        UPS.addressValidate(postData, (err, data) => {
            if (data.AddressValidationResponse.Response.ResponseStatusDescription == 'Success') {
                IsUPSVerified = 1;
            } else {
                IsUPSVerified = 2;
            }
            updateAddressIsUPSVerified(res[i].AddressId, IsUPSVerified)
            i = i + 1;
            if (i == res.length) {
                return;
            }
            Recursive2(i, res, AddressList, cb);
        });
    }
}

function Recursive(i, res, cb) {
    var postData = {
        ShipToCity: res[i].ShipToCity,
        ShipToStateCode: res[i].ShipToStateCode,
        ShipToPostalCode: res[i].ShipToPostalCode
    };
    var IsUPSVerified = 0;
    // console.log(res[i].AddressId+'@@@@')
    if (res[i].CountryCode == '' || res[i].CountryCode == null || res[i].CountryCode != 'US') {
        updateAddressIsUPSVerified(res[i].AddressId, IsUPSVerified)
        i = i + 1;
        if (i == res.length) {
            return cb(null, { info: "Loop completed....!" });
        }
        Recursive(i, res, cb);
    } else {
        UPS.addressValidate(postData, (err, data) => {
            if (data.AddressValidationResponse.Response.ResponseStatusDescription == 'Success') {
                IsUPSVerified = 1;
            } else {
                IsUPSVerified = 2;
            }
            updateAddressIsUPSVerified(res[i].AddressId, IsUPSVerified)
            i = i + 1;
            if (i == res.length) {
                return cb(null, { info: "Loop completed....!" });
            }
            Recursive(i, res, cb);
        });
    }
}

function updateAddressIsUPSVerified(AddressId, IsUPSVerified){
    var sql = `UPDATE tbl_address_book SET IsUPSVerified =? WHERE AddressId = ?`
    var values = [IsUPSVerified, AddressId]
    con.query(sql, values, function (err, result) {
        // if (err)
        // ReqRes.printResponse(err, null);
        //  else
        // ReqRes.printResponse(null, result);
    });
}



/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RRVendors = require("../models/repair.request.vendors.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const POModel = require("../models/purchase.order.model.js");


exports.ViewRepairRequestVendors = (req, res) => {
  RRVendors.ViewRepairRequestVendors(req.body.RRId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Repair Request with id ${req.body.RRId}.`
        })
      }
      else {
        res.status(500).send({
          message: "Error retrieving Repair Request with id " + req.body.RRId
        });
      }
    } else res.send(data);
  });
};


exports.ViewRRVendorInfo = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RRVendors.ViewRRVendorInfo(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
exports.LockVendorShipAddr = (req, res) => {
  if (req.body.hasOwnProperty('RRVendorId') && req.body.hasOwnProperty('VendorShipIdLocked')) {
    RRVendors.LockVendorShipAddr(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Vendor Ship Address and RR Vendor Id is required" }, null);
  }
};


exports.UpdateRRVendorRefNo = (req, res) => {
  if (req.body.hasOwnProperty('RRVendorId') && req.body.hasOwnProperty('VendorRefNo')) {
    RRVendors.IsExistVendorRefNo(req.body.VendorRefNo, (err, data1) => {
      if (data1.length > 0 && data1[0].VendorRefNo == req.body.VendorRefNo) {
        Reqresponse.printResponse(res, { msg: "Vendor Ref No Already Exist" }, null);
      }
      else {
        RRVendors.UpdateRRVendorRefNo(req.body, (err, data) => {

          RRVendors.SelectRRIdByRRVendorId(req.body.RRVendorId, (err, RRVdata) => {

            POModel.IsExistPOByRRId(RRVdata[0].RRId, (err, POdata) => {
              if (POdata && POdata.length > 0 && POdata[0].POId > 0) {
                var Obj = new POModel({ POId: POdata[0].POId, VendorRefNo: req.body.VendorRefNo });
                POModel.UpdateVendorRefNoByPOId(Obj, (err, data) => {
                });
              }
            });

          });
          Reqresponse.printResponse(res, err, data);
        });
      }
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Vendor Ref No and RR Vendor Id is required" }, null);
  }
};

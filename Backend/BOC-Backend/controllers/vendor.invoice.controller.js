/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const VendorInvoiceModel = require("../models/vendor.invoice.model.js");
const VendorInvoiceItemModel = require("../models/vendor.invoice.item.model.js");
const PurchaseOrderModel = require("../models/purchase.order.model.js");
const PurchaseOrderItemModel = require("../models/purchase.order.item.model.js");
const RRModel = require("../models/repair.request.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");
const NotificationModel = require("../models/notification.model.js");
const TermModel = require("../models/terms.model.js");
const MROModel = require("../models/mro.model.js");
const Customers = require("../models/customers.model.js");
const SalesOrder = require("../models/sales.order.model.js");
const VendorModel = require("../models/vendor.model.js");
const RR = require("../models/repair.request.model.js");
const GeneralHistoryLog = require("../models/general.history.log.model.js");

function roundTo(n, digits) {
  var negative = false;
  if (digits === undefined) {
    digits = 0;
  }
  if (n < 0) {
    negative = true;
    n = n * -1;
  }
  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = (Math.round(n) / multiplicator).toFixed(2);
  if (negative) {
    n = (n * -1).toFixed(2);
  }
  return n;
}
//To create a VendorInvoice
exports.Create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    VendorInvoiceModel.Create(new VendorInvoiceModel(req.body), (err, data) => {

      var sqlUpdateVendorInvoiceNoById = VendorInvoiceModel.UpdateVendorInvoiceNoById(data.id);

      async.parallel([
        function (result) {
          if (req.body.hasOwnProperty('VendorInvoiceItem'))
            VendorInvoiceItemModel.Create(data.id, req.body.VendorInvoiceItem, result);
        },
        function (result) { con.query(sqlUpdateVendorInvoiceNoById, result) },
      ],
        function (err, results) {
          if (err) {
            // return result(err, null);
            Reqresponse.printResponse(res, err, null);
          }
        }
      );
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To update a VendorInvoice
exports.update = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    async.parallel([
      function (result) { VendorInvoiceModel.update(new VendorInvoiceModel(req.body), result); },
      function (result) {
        if (req.body.hasOwnProperty('VendorInvoiceItem')) { VendorInvoiceItemModel.Update(req.body.VendorInvoiceItem, result); }
      },
      function (result) { RRModel.UpdateVendorInvoiceDueDate(req.body, result); },
    ],
      function (err, results) {
        if (err) {
          Reqresponse.printResponse(res, err, null);
        }
        Reqresponse.printResponse(res, err, results[0]);
      }
    );
  }
};

//Auto Create of Vendor Invoice
exports.AutoCreate = (req, res) => {

  var sql = VendorInvoiceModel.IsExistVendorInvoiceByRRIdAndPOId(req.body.RRId, req.body.POId)
  con.query(sql, (err, res1) => {
    if (err) {
      return result(err, null);
    }
    if (res1.length <= 0) {

      var sqlRRView = req.body.RRId > 0 ? RRModel.InfoForinvoiceDataquery(req.body.RRId, req.body.POId) : RRModel.InfoForinvoiceDataqueryWithOutRRId(req.body.POId);
      var sqlPO = PurchaseOrderModel.View(req.body.POId,'',0,req.body);
      var sqlPOI = PurchaseOrderItemModel.View(req.body.POId);
      var sqlGetDefaultTerm = TermModel.GetDefaultTerm(req.body.RRId);
      async.parallel([
        function (result) { con.query(sqlPO, result) },
        function (result) { con.query(sqlPOI, result) },
        function (result) { con.query(sqlRRView, result) },
        function (result) { con.query(sqlGetDefaultTerm, result) },
      ],
        function (err, results) {
          if (err)
            Reqresponse.printResponse(res, err, null);

          if (results[0][0].length > 0 && results[1][0].length > 0) {
            var POData = results[0][0][0];
            var RRInfo = results[2][0][0];

            POData.VendorInvNo = req.body.VendorInvNo ? req.body.VendorInvNo : '';

            //TO reduce the default shipping in PO
            POData.Created = req.body.Created ? req.body.Created : null;
            POData.GrandTotal = roundTo((parseFloat(POData.GrandTotal) - parseFloat(POData.Shipping)), 2);
            POData.Shipping = req.body.Shipping ? roundTo(req.body.Shipping, 2) : 0;
            POData.GrandTotal = roundTo((parseFloat(POData.GrandTotal) + parseFloat(POData.Shipping)), 2);
            POData.Status = req.body.Status ? req.body.Status : 0;
            POData.InvoiceDate = req.body.Created ? req.body.Created : null;
            POData.DueDate = cDateTime.getDateTime();
            POData.RRNo = RRInfo.RRNo;
            POData.VendorName = RRInfo.VendorName;
            POData.CustomerInvoiceAmount = RRInfo.CustomerInvoiceAmount;
            POData.CustomerInvoiceId = RRInfo.InvoiceId;
            POData.CustomerInvoiceNo = RRInfo.InvoiceNo;
            POData.Discount = POData.Discount ? roundTo(POData.Discount, 2) : 0;
            POData.VendorInvoiceType = req.body.RRId > 0 ? Constants.CONST_VINV_TYPE_REPAIR : Constants.CONST_VINV_TYPE_REGULAR;
            POData.LocalCurrencyCode = POData.LocalCurrencyCode;
            POData.ExchangeRate = POData.ExchangeRate;
            POData.BaseCurrencyCode = POData.BaseCurrencyCode;
            POData.BaseGrandTotal = roundTo(POData.BaseGrandTotal, 2);
            POData.authuser = req.body.authuser;

            req.body.TermsDays = 0;
            if (results[3][0].length > 0) {
              POData.TermsId = results[3][0][0].TermsId;
              req.body.TermsDays = results[3][0][0].TermsDays;
            }
            var VendorInvoiceObj = new VendorInvoiceModel(POData);
            VendorInvoiceObj.Created = req.body.Created ? req.body.Created + " 10:00:00" : cDateTime.getDateTime();
            VendorInvoiceModel.Create(VendorInvoiceObj, (err, data) => {
              var POIData = results[1][0];
              for (let val of POIData) {
                val.PONo = POData.PONo;
              }
              const srr = new RRModel({
                authuser: req.body.authuser,
                RRId: req.body.RRId,
                VendorInvoiceNo: 'VI' + data.id,
                VendorInvoiceId: data.id
              })
              const obj = new VendorInvoiceModel({
                authuser: req.body.authuser,
                VendorInvoiceId: data.id
              })
              //To add Vendor invoice in notification table
              var NotificationObj = new NotificationModel({
                authuser: req.body.authuser,
                RRId: req.body.RRId,
                NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_VENDOR_INVOICE,
                NotificationIdentityId: data.id,
                NotificationIdentityNo: 'VI' + data.id,
                ShortDesc: 'Vendor Bill draft created',
                Description: 'Vendor Bill draft created by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
              });

              //  var Termsql = TermModel.listquery(POData.POId, Constants.CONST_IDENTITY_TYPE_PO);
              // con.query(Termsql, (err, res1) => {
              //   if (err) {
              //     return result(err, null);
              //   }
              //req.body.TermsDays = 0;
              // if (res1.length > 0) {
              //   req.body.TermsDays = res1[0].TermsDays;
              // }
              // if (results[3][0].length > 0) {
              //   req.body.TermsDays = results[3][0][0].TermsDays;
              // }
              var sqlUpdateVendorInvoiceNo = RRModel.UpdateVendorInvoiceNoByRRID(srr, req.body.TermsDays, POData.InvoiceDate);
              var sqlUpdateVendorInvoiceNoById = VendorInvoiceModel.UpdateVendorInvoiceNoById(data.id);
              var sqlUpdateVendorInvoiceDueAutoUpdate = VendorInvoiceModel.UpdateVendorInvoiceDueAutoUpdate(data.id, req.body.TermsDays);
              var sqlUpdateIsAddedToVendorBillByPO = VendorInvoiceItemModel.UpdateIsAddedToVendorBillByPO(POData.POId);
              // console.log("~~~~~~~~~~~~~~~~~~~~~POIData~~~~~~~~~~~~~~~~~~~~~~~~~")
              // console.log(POIData)
              async.parallel([
                function (result) { VendorInvoiceItemModel.Create(data.id, POIData, result); },
                function (result) { con.query(sqlUpdateVendorInvoiceDueAutoUpdate, result) },
                function (result) { con.query(sqlUpdateVendorInvoiceNoById, result) },
                function (result) { con.query(sqlUpdateVendorInvoiceNo, result) },
                function (result) { con.query(sqlUpdateIsAddedToVendorBillByPO, result) },
                function (result) { NotificationModel.Create(NotificationObj, result); },
                function (result) { if (Constants.CONST_VENDOR_INV_STATUS_APPROVED == req.body.Status) { VendorInvoiceModel.ApproveVendorInvoice(new VendorInvoiceModel(obj), result); } else { RRModel.emptyFunction(NotificationObj, result); } },
              ],
                function (err, results) {
                  const GeneralHistoryLogPayload = new GeneralHistoryLog({
                    authuser: req.body.authuser,
                    IdentityType: req.body.RRId > 0 ? Constants.CONST_IDENTITY_TYPE_RR : Constants.CONST_IDENTITY_TYPE_QUOTE,
                    IdentityId: req.body.RRId ? req.body.RRId : POData.QuoteId,
                    RequestBody: JSON.stringify(req.body),
                    Type: req.body.RRId > 0 ? "Vendor Invoice - RR" : "Vendor Invoice - QT",
                    BaseTableRequest: JSON.stringify(VendorInvoiceObj),
                    ItemTableRequest: JSON.stringify(POIData),
                    BaseTableResponse: JSON.stringify(data),
                    ItemTableResponse: JSON.stringify(results[0]),
                    ErrorMessage: JSON.stringify(err),
                    CommonLogMessage: JSON.stringify(results)
                  });
                  async.parallel([
                    function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload, result); },
                  ],
                    function (err, results) {
                    });
                  if (err) { Reqresponse.printResponse(res, err, null); }

                });
              Reqresponse.printResponse(res, err, data);
              // });
            });
          } else {
            Reqresponse.printResponse(res, err, "No record for POId = " + req.body.POId);
          }
        });
    } else {
      Reqresponse.printResponse(res, null, "Already Exist Vendor Bill ");
    }
  });
}

//To view a VendorInvoice
exports.View = (req, res) => {
  if (req.body.hasOwnProperty('VendorInvoiceId')) {
    var IdentityType = 0;// from Admin
    VendorInvoiceModel.findById(req.body.VendorInvoiceId, IdentityType, req.body.IsDeleted, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "VendorInvoice Id is required" }, null);
  }
};

// Get server side list
exports.getVendorInvListByServerSide = (req, res) => {

  VendorInvoiceModel.getVendorInvListByServerSide(new VendorInvoiceModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To ApproveVendorInvoice 
exports.ApproveVendorInvoice = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    VendorInvoiceModel.ApproveVendorInvoice(new VendorInvoiceModel(req.body), (err, data) => {
      {
        var NotificationObj = new NotificationModel({
          authuser: req.body.authuser,
          RRId: req.body.VendorInvoiceId,
          NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_VENDOR_INVOICE,
          NotificationIdentityId: req.body.VendorInvoiceId,
          NotificationIdentityNo: 'VI' + req.body.VendorInvoiceId,
          ShortDesc: 'Vendor bill Approved',
          Description: 'Vendor bill approved by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
        });
        NotificationModel.Create(NotificationObj, (err, data1) => {
        });
      }
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To delete the VendorInvoice
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('VendorInvoiceId')) {
    VendorInvoiceModel.delete(req.body.VendorInvoiceId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });

  } else {
    Reqresponse.printResponse(res, { msg: "VendorInvoice Id is required" }, null);
  }
};

//To Get Vendor Invoice ExcelData
exports.ExportToExcel = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var Ids = ``;
    for (let val of req.body.VendorInvoice) {
      Ids += val.VendorInvoiceId + `,`;
    }
    var VendorInvocieIds = Ids.slice(0, -1);

    if (req.body.hasOwnProperty('VendorInvoiceType') == false)
      req.body.VendorInvoiceType = '';
    if (req.body.hasOwnProperty('Status') == false)
      req.body.Status = '';
    if (req.body.hasOwnProperty('IsCSVProcessed') == false)
      req.body.IsCSVProcessed = '';
    if (req.body.hasOwnProperty('VendorBillApproved') == true && req.body.VendorBillApproved == "true")
      req.body.Status = Constants.CONST_VENDOR_INV_STATUS_APPROVED;

    var sql = VendorInvoiceModel.ExportToExcel(req.body, VendorInvocieIds);
    var sqlArray = VendorInvoiceModel.CSVExportToExcel(req.body, VendorInvocieIds);

    if (req.body.hasOwnProperty('DownloadType') == true && req.body.DownloadType == "CSV") {
      async.parallel([
        function (result) { con.query(sqlArray[0].sqlExcel, result) },
        function (result) { con.query(sqlArray[0].sqlUpdateIsCSVProcessed, result) },
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }
          else {
            if (results[0][0].length > 0)
              Reqresponse.printResponse(res, err, { ExcelData: results[0][0] });
            else
              Reqresponse.printResponse(res, { msg: "Vendor Invoice is not yet Approved. Only Approved vendor invoice can be download as CSV." }, null);
          }

        });
    }
    else {

      con.query(sql, (err, Eres) => {
        if (err)
          Reqresponse.printResponse(res, err, null);
        else
          Reqresponse.printResponse(res, err, { ExcelData: Eres });
      });
    }
  }
};

//Delete VendorInvoiceItem
// exports.DeleteVendorInvoiceItem = (req, res) => {
//   if (req.body.hasOwnProperty('VendorInvoiceItemId')) {
//     if (req.body.VendorInvoiceItemId != "") {
//       async.parallel([
//         function (result) { VendorInvoiceItemModel.DeleteVendorInvItem(req.body.VendorInvoiceItemId, result); },
//         function (result) { VendorInvoiceItemModel.SelectNewCalculationAfterVendorInvItemDelete(req.body.VendorInvoiceItemId, result); },
//       ],
//         function (err, results) {
//           if (err) {
//             Reqresponse.printResponse(res, err, null);
//           }
//           results[1].res[0].TaxPercent = req.body.TaxPercent >= 0 ? req.body.TaxPercent : 0;
//           VendorInvoiceModel.UpdateAfterVendorInvItemDelete({ res: results[1] }, (err, data) => {
//           });
//           Reqresponse.printResponse(res, null, { ress: results[1] });
//         });
//     }
//     else {
//       Reqresponse.printResponse(res, { msg: "VendorInvoiceItem Id is required" }, null);
//     }
//   }
// };
// To Delete VendorInvoiceItem
// RR.emptyFunction = (RR, result) => {
//   result(null, { empty: 1 });
//   return;
// };
exports.DeleteVendorInvoiceItem = (req, res) => {
  if (req.body.hasOwnProperty('VendorInvoiceItemId')) {
    if (req.body.VendorInvoiceItemId != "") {
      async.parallel([
        function (result) { VendorInvoiceItemModel.DeleteVendorInvItem(req.body.VendorInvoiceItemId, result); },
        function (result) {
          if (req.body.hasOwnProperty('TaxPercent') && req.body.TaxPercent > 0) {
            con.query(VendorInvoiceModel.UpdateTaxPercent(req.body.TaxPercent, req.body.VendorInvoiceId), result)
          }
          else {
            RR.emptyFunction(req.body, result);
          }
        },
      ],
        function (err, results) {
          if (err) {
            Reqresponse.printResponse(res, err, null);
          }

          VendorInvoiceItemModel.SelectNewCalculationAfterVendorInvItemDelete(req.body.VendorInvoiceItemId, (err, Rdata) => {
            if (err) {
              Reqresponse.printResponse(res, err, null);
            }
            if (Rdata.res[0]) {
              VendorInvoiceModel.UpdateAfterVendorInvItemDelete(Rdata.res[0], (err, data) => {
              });
              Reqresponse.printResponse(res, null, { ress: Rdata.res[0] });
            }
            else {
              Reqresponse.printResponse(res, { msg: "No Record" }, null);
            }
          });

        });
    }
    else {
      Reqresponse.printResponse(res, { msg: "VendorInvoiceItem Id is required" }, null);
    }
  }
};






//Below are for MRO :
exports.MROAutoCreate = (req, res) => {

  // var sql = VendorInvoiceModel.IsExistVendorInvoiceByMROId(req.body.MROId)
  // con.query(sql, (err, res1) => {
  //   if (err) {
  //     return result(err, null);
  //   }
  //   if (res1.length <= 0) {

  // var sqlMROView = MROModel.InfoForinvoiceDataquery(req.body.MROId);
  var sqlPO = PurchaseOrderModel.ViewByMROId(req.body.POId);
  var sqlPOI = PurchaseOrderItemModel.ViewByMROId(req.body.POId);
  var sqlGetDefaultTerm = TermModel.GetDefaultTerm();
  var sqlGetRate = SalesOrder.GetRate(req.body.SOItemId);
  var sqlVendor = VendorModel.viewquery(req.body.VendorId);
  var sqlCustomer = Customers.viewquery(req.body.CustomerId, req.body);
  async.parallel([
    function (result) { con.query(sqlPO, result) },
    function (result) { con.query(sqlPOI, result) },
    //  function (result) { con.query(sqlMROView, result) },
    function (result) { con.query(sqlGetDefaultTerm, result) },
    function (result) { con.query(sqlGetRate, result) },
    function (result) { con.query(sqlVendor, result) },
    function (result) { con.query(sqlCustomer, result) },
  ],
    function (err, results) {
      if (err)
        Reqresponse.printResponse(res, err, null);

      if (results[0][0].length > 0 && results[1][0].length > 0) {

        var POData = results[0][0][0];
        // var Rate = results[3][0].length > 0 ? results[3][0][0].Rate : 0;
        var Rate = results[1][0].length > 0 ? results[1][0][0].Rate : 0;
        var POIData = results[1][0];
        for (let val of POIData) {
          val.PONo = POData.PONo;
        }
        // Added Mar 16
        // 
        var overallQuantity = POIData[0].Quantity;
        var singleQuantitySC = POIData[0].ShippingCharge / overallQuantity;
        var singleQuantityBaseSC = POIData[0].BaseShippingCharge / overallQuantity;
        // 
        var RateWithQuantity = POIData[0].Rate * req.body.Quantity
        var TaxPrice = POIData[0].ItemTaxPercent / 100;
        var TaxRateWithQuantity = RateWithQuantity * TaxPrice;
        var TaxRateWithOutQuantity = POIData[0].Rate * TaxPrice;
        // var ShippingCharge = POIData[0].ShippingCharge;
        // var BaseShippingCharge = POIData[0].BaseShippingCharge;
        var ShippingCharge = singleQuantitySC * req.body.Quantity;
        var BaseShippingCharge = singleQuantityBaseSC * req.body.Quantity;
        var Price = RateWithQuantity + TaxRateWithQuantity;
        POIData[0].Quantity = req.body.Quantity;
        POIData[0].Price = roundTo((Price + ShippingCharge), 2);
        POIData[0].BasePrice = roundTo(((Price * POIData[0].ItemExchangeRate) + BaseShippingCharge), 2);
        POIData[0].Tax = roundTo((TaxRateWithOutQuantity), 2);
        var GrandTotal = roundTo((POIData[0].Price), 2);
        POIData[0].ShippingCharge = roundTo(ShippingCharge, 2);
        POIData[0].BaseShippingCharge = roundTo(BaseShippingCharge, 2);
        // POIData[0].BaseGrandTotal = POIData[0].BasePrice;
        var BaseGrandTotal = roundTo(POIData[0].BasePrice, 2);
        // 
        // POIData[0].Quantity = req.body.Quantity;
        // POIData[0].Price = Rate * req.body.Quantity;
        // var GrandTotal = POIData[0].Price;

        POData.MROShippingHistoryId = req.body.MROShippingHistoryId ? req.body.MROShippingHistoryId : 0;
        POData.VendorInvNo = req.body.VendorInvNo ? req.body.VendorInvNo : '';
        POData.Shipping = req.body.Shipping ? req.body.Shipping : 0;
        POData.GrandTotal = parseFloat(GrandTotal) + parseFloat(POData.Shipping);
        POData.SubTotal = POIData[0].Price;
        POData.Status = req.body.Status ? req.body.Status : 0;
        POData.InvoiceDate = cDateTime.getDateTime();
        POData.DueDate = cDateTime.getDateTime();
        POData.VendorName = results[4][0].length > 0 ? results[4][0][0].VendorName : 0;
        POData.CustomerInvoiceAmount = Rate * req.body.Quantity;
        POData.CustomerId = req.body.CustomerId;
        POData.CompanyName = results[5][0].length > 0 ? results[5][0][0].CompanyName : 0;
        POData.Discount = POData.Discount ? POData.Discount : 0;
        POData.VendorInvoiceType = Constants.CONST_VINV_TYPE_MRO;
        POData.BaseGrandTotal = BaseGrandTotal
        POData.authuser = req.body.authuser;

        req.body.TermsDays = 0;
        if (results[2][0].length > 0) {
          POData.TermsId = results[2][0][0].TermsId;
          req.body.TermsDays = results[2][0][0].TermsDays;
        }

        var VendorInvoiceObj = new VendorInvoiceModel(POData);
        VendorInvoiceObj.Created = req.body.Created ? req.body.Created + " 10:00:00" : cDateTime.getDateTime();
        VendorInvoiceModel.Create(VendorInvoiceObj, (err, data) => {
          if (err) { Reqresponse.printResponse(res, err, null); }
          const srr = new MROModel({
            authuser: req.body.authuser,
            MROId: req.body.MROId,
            VendorInvoiceNo: 'VI' + data.id,
            VendorInvoiceId: data.id
          })
          const obj = new VendorInvoiceModel({
            authuser: req.body.authuser,
            VendorInvoiceId: data.id
          })
          var NotificationObj = new NotificationModel({
            authuser: req.body.authuser,
            RRId: req.body.MROId,
            NotificationIdentityType: Constants.CONST_IDENTITY_TYPE_VENDOR_INVOICE,
            NotificationIdentityId: data.id,
            NotificationIdentityNo: 'VI' + data.id,
            ShortDesc: 'Vendor Bill draft created',
            Description: 'Vendor Bill draft created by Admin (' + global.authuser.FullName + ') on ' + cDateTime.getDateTime()
          });

          var sqlUpdateVendorInvoiceNo = MROModel.UpdateVendorInvoiceNoByMROId(srr, req.body.TermsDays);//tbl_mro
          var sqlUpdateVendorInvoiceNoById = VendorInvoiceModel.UpdateVendorInvoiceNoById(data.id);
          var sqlUpdateVendorInvoiceDueAutoUpdate = VendorInvoiceModel.UpdateVendorInvoiceDueAutoUpdate(data.id, req.body.TermsDays);
          var sqlUpdateIsAddedToVendorBillByPO = VendorInvoiceItemModel.UpdateIsAddedToVendorBillByPO(POData.POId);
          async.parallel([
            function (result) { VendorInvoiceItemModel.Create(data.id, POIData, result); },
            function (result) { con.query(sqlUpdateVendorInvoiceDueAutoUpdate, result) },
            function (result) { con.query(sqlUpdateVendorInvoiceNoById, result) },
            function (result) { con.query(sqlUpdateVendorInvoiceNo, result) },
            function (result) { con.query(sqlUpdateIsAddedToVendorBillByPO, result) },
            function (result) { NotificationModel.Create(NotificationObj, result); },
            function (result) {
              if (Constants.CONST_VENDOR_INV_STATUS_APPROVED == req.body.Status) { VendorInvoiceModel.ApproveVendorInvoice(new VendorInvoiceModel(obj), result); }
              else { RRModel.emptyFunction(srr, result); }
            },
          ],
            function (err, results) {
              const GeneralHistoryLogPayload = new GeneralHistoryLog({
                authuser: req.body.authuser,
                IdentityType: Constants.CONST_IDENTITY_TYPE_MRO,
                IdentityId: req.body.MROId,
                RequestBody: JSON.stringify(req.body),
                Type: "Vendor Invoice - MRO",
                BaseTableRequest: JSON.stringify(VendorInvoiceObj),
                ItemTableRequest: JSON.stringify(POIData),
                BaseTableResponse: JSON.stringify(data),
                ItemTableResponse: JSON.stringify(results[0]),
                ErrorMessage: JSON.stringify(err),
                CommonLogMessage: JSON.stringify(results)
              });
              async.parallel([
                function (result) { GeneralHistoryLog.Create(GeneralHistoryLogPayload, result); },
              ],
                function (err, results) {
                });
              if (err) { Reqresponse.printResponse(res, err, null); }
            });
          Reqresponse.printResponse(res, err, data);
          // });
        });
      } else {
        Reqresponse.printResponse(res, err, "No record for POId = " + req.body.POId);
      }
    });
  // } else {
  //   Reqresponse.printResponse(res, null, "Already Exist Vendor Bill ");
  // }
  // });
}
//
exports.ReOpenVendorInvoice = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    VendorInvoiceModel.ReOpenVendorInvoice(new VendorInvoiceModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
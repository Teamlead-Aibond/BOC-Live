/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const POReportsModel = require("../models/purchase.order.reports.model.js"); 
const Reqresponse = require("../helper/request.response.validation.js");
var async = require('async');
const con = require("../helper/db.js");


// PurchasesByItemReport
exports.PurchasesByItemReport = (req, res) => {
POReportsModel.PurchasesByItemReport(new POReportsModel(req.body), (err, data) => {      
Reqresponse.printResponse(res,err,data);
});     
};  
// PurchasesByItemReportToExcel
exports.PurchasesByItemReportToExcel = (req, res) => {
POReportsModel.PurchasesByItemReportToExcel(new POReportsModel(req.body), (err, data) => {      
Reqresponse.printResponse(res,err,data);
});     
}; 
// PurchasesByVendor
exports.PurchasesByVendor = (req, res) => {
POReportsModel.PurchasesByVendor(new POReportsModel(req.body), (err, data) => {      
Reqresponse.printResponse(res,err,data);
});     
};  
// PurchasesByVendorReportToExcel
exports.PurchasesByVendorReportToExcel = (req, res) => {
POReportsModel.PurchasesByVendorReportToExcel(new POReportsModel(req.body), (err, data) => {      
Reqresponse.printResponse(res,err,data);
});     
};

// PurchasesByMonth
exports.PurchasesByMonth = (req, res) => {
POReportsModel.PurchasesByMonth(new POReportsModel(req.body), (err, data) => {      
Reqresponse.printResponse(res,err,data);
});     
};  
// PurchasesByMonthReportToExcel
exports.PurchasesByMonthReportToExcel = (req, res) => {
POReportsModel.PurchasesByMonthReportToExcel(new POReportsModel(req.body), (err, data) => {      
Reqresponse.printResponse(res,err,data);
});     
};  

exports.POTaxVatReport = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
      var sqlArray = POReportsModel.POTaxVatReport(new POReportsModel(req.body));
      async.parallel([
        function (result) { con.query(sqlArray[0].query, result); },
        function (result) { con.query(POReportsModel.OverAllSummaryNew(new POReportsModel(req.body)), result); },
        function (result) { con.query(sqlArray[0].Countquery, result); },
        function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
        function (result) { con.query(POReportsModel.OverAllBaseSummaryNew(new POReportsModel(req.body)), result); },
  
      ],
  
        function (err, results) {
          if (err)
            Reqresponse.printResponse(res, err, null);
          else
            Reqresponse.printResponse(res, null, {
               data: results[0][0], OverAllSummary: results[1][0], recordsFiltered: results[2][0][0].recordsFiltered,
               recordsTotal: results[3][0][0].TotalCount, draw: req.body.draw, OverAllBaseSummary: results[4][0]
             });
  
            // Reqresponse.printResponse(res, null, {
            //   data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
            //   recordsTotal: results[2][0][0].TotalCount, draw: req.body.draw
            // });
  
        });
  
    }
  };
exports.POTaxVatReportToExcel = (req, res) => {
  POReportsModel.POTaxVatReportToExcel(new POReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
    

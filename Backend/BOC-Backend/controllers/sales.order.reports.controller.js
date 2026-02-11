/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const SalesOrderReportsModel = require("../models/sales.order.reports.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
var async = require('async');
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");

// SalesOrderByCustomer
exports.SalesOrderByCustomer = (req, res) => {
  SalesOrderReportsModel.SalesOrderByCustomer(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// SalesOrderByCustomerReportExportToExcel
exports.SalesOrderByCustomerReportToExcel = (req, res) => {
  SalesOrderReportsModel.SalesOrderByCustomerReportToExcel(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// SalesByParts
exports.SalesByParts = (req, res) => {
  SalesOrderReportsModel.SalesByParts(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// SalesByPartsReportToExcel
exports.SalesByPartsReportToExcel = (req, res) => {
  SalesOrderReportsModel.SalesByPartsReportToExcel(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// SalesByMonth
// exports.SalesByMonth = (req, res) => {
//   SalesOrderReportsModel.SalesByMonth(new SalesOrderReportsModel(req.body), (err, data) => {
//     Reqresponse.printResponse(res, err, data);
//   });
// };

exports.SalesByMonth = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var sqlArray = SalesOrderReportsModel.SalesByMonth(new SalesOrderReportsModel(req.body));
    async.parallel([
      function (result) { con.query(sqlArray[0].query, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllSummary(new SalesOrderReportsModel(req.body)), result); },
      function (result) { con.query(sqlArray[0].Countquery, result); },
      function (result) { con.query(sqlArray[0].TotalCountQuery, result); },

    ],

      function (err, results) {
        if (err)
          Reqresponse.printResponse(res, err, null);
        else
          Reqresponse.printResponse(res, null, {
            data: results[0][0], OverAllSummary: results[1][0][0], recordsFiltered: results[2][0][0].recordsFiltered,
            recordsTotal: results[3][0][0].TotalCount, draw: req.body.draw
          });

      });

  }
};
exports.SalesByMonthNew = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var sqlArray = SalesOrderReportsModel.SalesByMonthNew(new SalesOrderReportsModel(req.body));
    async.parallel([
      function (result) { con.query(sqlArray[0].query, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllSummaryNew(new SalesOrderReportsModel(req.body)), result); },
      function (result) { con.query(sqlArray[0].Countquery, result); },
      function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllBaseSummaryNew(new SalesOrderReportsModel(req.body)), result); },

    ],

      function (err, results) {
        if (err)
          Reqresponse.printResponse(res, err, null);
        else
          Reqresponse.printResponse(res, null, {
            data: results[0][0], OverAllSummary: results[1][0], recordsFiltered: results[2][0][0].recordsFiltered,
            recordsTotal: results[3][0][0].TotalCount, draw: req.body.draw, OverAllBaseSummary: results[4][0]
          });

      });

  }
};

exports.SOTaxVatReport = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var sqlArray = SalesOrderReportsModel.SOTaxVatReport(new SalesOrderReportsModel(req.body));
    async.parallel([
      function (result) { con.query(sqlArray[0].query, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllSOSummaryNew(new SalesOrderReportsModel(req.body)), result); },
      function (result) { con.query(sqlArray[0].Countquery, result); },
      function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllSOBaseSummaryNew(new SalesOrderReportsModel(req.body)), result); },

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




// SalesByMonthReportToExcel
exports.SalesByMonthReportToExcel = (req, res) => {
  SalesOrderReportsModel.SalesByMonthReportToExcel(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.SalesByMonthReportToExcelNew = (req, res) => {
  SalesOrderReportsModel.SalesByMonthReportToExcelNew(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.SOTaxVatReportToExcel = (req, res) => {
  SalesOrderReportsModel.SOTaxVatReportToExcel(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


// exports.ParticularMonthSOByCustomer = (req, res) => {
//   SalesOrderReportsModel.ParticularMonthSOByCustomer(new SalesOrderReportsModel(req.body), (err, data) => {
//     Reqresponse.printResponse(res, err, data);
//   });
// };

// 
exports.ParticularMonthSOByCustomer = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var sqlArray = SalesOrderReportsModel.ParticularMonthSOByCustomer(new SalesOrderReportsModel(req.body));
    async.parallel([
      function (result) { con.query(sqlArray[0].query, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllSummary(new SalesOrderReportsModel(req.body)), result); },
      function (result) { con.query(sqlArray[0].Countquery, result); },
      function (result) { con.query(sqlArray[0].TotalCountQuery, result); },

    ],
      function (err, results) {
        if (err)
          Reqresponse.printResponse(res, err, null);
        else
          Reqresponse.printResponse(res, null, {
            data: results[0][0], OverAllSummary: results[1][0][0], recordsFiltered: results[2][0][0].recordsFiltered,
            recordsTotal: results[3][0][0].TotalCount, draw: req.body.draw
          });
      });
  }
};

exports.ParticularMonthSOByCustomerNew = (req, res) => {

  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var sqlArray = SalesOrderReportsModel.ParticularMonthSOByCustomerNew(new SalesOrderReportsModel(req.body));
    async.parallel([
      function (result) { con.query(sqlArray[0].query, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllSummaryNew(new SalesOrderReportsModel(req.body)), result); },
      function (result) { con.query(sqlArray[0].Countquery, result); },
      function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllBaseSummaryNew(new SalesOrderReportsModel(req.body)), result); },

    ],
      function (err, results) {
        if (err)
          Reqresponse.printResponse(res, err, null);
        else
          Reqresponse.printResponse(res, null, {
            data: results[0][0], OverAllSummary: results[1][0], recordsFiltered: results[2][0][0].recordsFiltered,
            recordsTotal: results[3][0][0].TotalCount, draw: req.body.draw, OverAllBaseSummary: results[4][0]
          });
      });
  }
};


exports.ParticularMonthSOByCustomerToExcel = (req, res) => {
  SalesOrderReportsModel.ParticularMonthSOByCustomerToExcel(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.ParticularMonthSOByCustomerToExcelNew = (req, res) => {
  SalesOrderReportsModel.ParticularMonthSOByCustomerToExcelNew(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.SODetailedReport = (req, res) => {
  SalesOrderReportsModel.SODetailedReport(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.SODetailedReportNew = (req, res) => {
  SalesOrderReportsModel.SODetailedReportNew(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// Payable Report
exports.PayableReport = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var sqlArray = SalesOrderReportsModel.PayableReport(new SalesOrderReportsModel(req.body));
    async.parallel([
      function (result) { con.query(sqlArray[0].query, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllPayableSummary(new SalesOrderReportsModel(req.body)), result); },
      function (result) { con.query(sqlArray[0].Countquery, result); },
      function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllPayableBaseSummary(new SalesOrderReportsModel(req.body)), result); },

    ],

      function (err, results) {
        if (err)
          Reqresponse.printResponse(res, err, null);
        else
          Reqresponse.printResponse(res, null, {
            data: results[0][0], OverAllSummary: results[1][0], recordsFiltered: results[2][0][0].recordsFiltered,
            recordsTotal: results[3][0][0].TotalCount, draw: req.body.draw, OverAllBaseSummary: results[4][0]
          });
      });

  }
};

exports.PayableReportToExcel = (req, res) => {
  SalesOrderReportsModel.PayableReportToExcel(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.PayableReportDetails = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var sqlArray = SalesOrderReportsModel.PayableReportDetails(new SalesOrderReportsModel(req.body));
    async.parallel([
      function (result) { con.query(sqlArray[0].query, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllPayableDetailsSummary(new SalesOrderReportsModel(req.body)), result); },
      function (result) { con.query(sqlArray[0].Countquery, result); },
      function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
      function (result) { con.query(SalesOrderReportsModel.OverAllPayableDetailsBaseSummary(new SalesOrderReportsModel(req.body)), result); },

    ],

      function (err, results) {
        if (err)
          Reqresponse.printResponse(res, err, null);
        else
          Reqresponse.printResponse(res, null, {
            data: results[0][0], OverAllSummary: results[1][0], recordsFiltered: results[2][0][0].recordsFiltered,
            recordsTotal: results[3][0][0].TotalCount, draw: req.body.draw, OverAllBaseSummary: results[4][0]
          });
      });

  }
};

exports.PayableReportDetailsToExcel = (req, res) => {
  SalesOrderReportsModel.PayableReportDetailsToExcel(new SalesOrderReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// ToDo With currency

exports.SalesByMonthWithCurrency = (req, res) => {
  if (req.body.hasOwnProperty('ReportCurrencyCode') && req.body.ReportCurrencyCode != "") {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
      var sqlArray = SalesOrderReportsModel.SalesByMonthWithCurrency(new SalesOrderReportsModel(req.body));
      async.parallel([
        function (result) { con.query(sqlArray[0].query, result); },
        function (result) { con.query(sqlArray[0].Countquery, result); },
        function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
        function (result) { con.query(SalesOrderReportsModel.OverAllBaseSummaryWithCurrency(new SalesOrderReportsModel(req.body)), result); },
        // function (result) { con.query(SalesOrderReportsModel.OverAllSummaryNew(new SalesOrderReportsModel(req.body)), result); },

      ],

        function (err, results) {
          if (err)
            Reqresponse.printResponse(res, err, null);
          else
            Reqresponse.printResponse(res, null, {
              data: results[0][0], recordsFiltered: results[2][0][0].recordsFiltered,
              recordsTotal: results[3][0][0].TotalCount, draw: req.body.draw, OverAllBaseSummary: results[3][0]
              // , OverAllSummary: results[4][0]
            });

        });

    }
  }else{
    ReqRes.printResponse(res, { msg: "Report Currency Code is required" }, null);
  }
};

exports.ParticularMonthSOByCustomerWithCurrency = (req, res) => {
  if (req.body.hasOwnProperty('ReportCurrencyCode') && req.body.ReportCurrencyCode != "") {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
      var sqlArray = SalesOrderReportsModel.ParticularMonthSOByCustomerWithCurrency(new SalesOrderReportsModel(req.body));
      async.parallel([
        function (result) { con.query(sqlArray[0].query, result); },
        function (result) { con.query(sqlArray[0].Countquery, result); },
        function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
        function (result) { con.query(SalesOrderReportsModel.OverAllBaseSummaryWithCurrency(new SalesOrderReportsModel(req.body)), result); },
        // function (result) { con.query(SalesOrderReportsModel.OverAllSummaryNew(new SalesOrderReportsModel(req.body)), result); },

      ],
        function (err, results) {
          if (err)
            Reqresponse.printResponse(res, err, null);
          else
            Reqresponse.printResponse(res, null, {
              data: results[0][0], recordsFiltered: results[2][0][0].recordsFiltered,
              recordsTotal: results[3][0][0].TotalCount, draw: req.body.draw, OverAllBaseSummary: results[3][0]
              // , OverAllSummary: results[4][0]
            });
        });
    }
  }else{
    ReqRes.printResponse(res, { msg: "Report Currency Code is required" }, null);
  }
};

exports.SODetailedReportWithCurrency = (req, res) => {
  if (req.body.hasOwnProperty('ReportCurrencyCode') && req.body.ReportCurrencyCode != "") {
    SalesOrderReportsModel.SODetailedReportWithCurrency(new SalesOrderReportsModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }else{
    ReqRes.printResponse(res, { msg: "Report Currency Code is required" }, null);
  }
};

exports.SalesByMonthReportToExcelWithCurrency = (req, res) => {
  if (req.body.hasOwnProperty('ReportCurrencyCode') && req.body.ReportCurrencyCode != "") {
    SalesOrderReportsModel.SalesByMonthReportToExcelWithCurrency(new SalesOrderReportsModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }else{
    ReqRes.printResponse(res, { msg: "Report Currency Code is required" }, null);
  }
};

exports.ParticularMonthSOByCustomerToExcelWithCurrency = (req, res) => {
  if (req.body.hasOwnProperty('ReportCurrencyCode') && req.body.ReportCurrencyCode != "") {
    SalesOrderReportsModel.ParticularMonthSOByCustomerToExcelWithCurrency(new SalesOrderReportsModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }else{
    ReqRes.printResponse(res, { msg: "Report Currency Code is required" }, null);
  }
};
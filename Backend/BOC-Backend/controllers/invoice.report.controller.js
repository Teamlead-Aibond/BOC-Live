/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const InvoiceReportsModel = require("../models/invoice.report.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
var async = require('async');
const Constants = require("../config/constants.js");
const con = require("../helper/db.js");

// SalesOrderByCustomer
exports.InvoiceByCustomer = (req, res) => {
    InvoiceReportsModel.InvoiceByCustomer(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
// SalesOrderByCustomerReportExportToExcel
exports.InvoiceByCustomerReportToExcel = (req, res) => {
    InvoiceReportsModel.InvoiceByCustomerReportToExcel(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
// InvoiceByParts
exports.InvoiceByParts = (req, res) => {
    InvoiceReportsModel.InvoiceByParts(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
// SalesByPartsReportToExcel
exports.InvoiceByPartsReportToExcel = (req, res) => {
    InvoiceReportsModel.InvoiceByPartsReportToExcel(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
// InvoiceByMonth
exports.InvoiceByMonth = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        var sqlArray = InvoiceReportsModel.InvoiceByMonth(new InvoiceReportsModel(req.body));
        async.parallel([
            function (result) { con.query(sqlArray[0].query, result); },
            function (result) { con.query(InvoiceReportsModel.OverAllSummary(new InvoiceReportsModel(req.body)), result); },
            function (result) { con.query(sqlArray[0].Countquery, result); },
            function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
            function (result) { con.query(InvoiceReportsModel.OverAllSummaryNew(new InvoiceReportsModel(req.body)), result); },

        ],

            function (err, results) {
                if (err)
                    Reqresponse.printResponse(res, err, null);
                else
                    Reqresponse.printResponse(res, null, {
                        data: results[0][0], OverAllSummary: results[1][0][0], recordsFiltered: results[2][0][0].recordsFiltered,
                        recordsTotal: results[3][0][0].TotalCount, draw: req.body.draw, OverAllSummaryNew: results[4][0][0]
                    });

            });


    }
};


exports.InvoiceByMonthNew = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        var sqlArray = InvoiceReportsModel.InvoiceByMonthNew(new InvoiceReportsModel(req.body));
        async.parallel([
            function (result) { con.query(sqlArray[0].query, result); },
            function (result) { con.query(InvoiceReportsModel.OverAllSummaryNew(new InvoiceReportsModel(req.body)), result); },
            function (result) { con.query(sqlArray[0].Countquery, result); },
            function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
            function (result) { con.query(InvoiceReportsModel.OverAllBaseSummaryNew(new InvoiceReportsModel(req.body)), result); },
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








// 
exports.ParticularMonthInvoiceByCustomer = (req, res) => {

    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        var sqlArray = InvoiceReportsModel.ParticularMonthInvoiceByCustomer(new InvoiceReportsModel(req.body));
        async.parallel([
            function (result) { con.query(sqlArray[0].query, result); },
            function (result) { con.query(InvoiceReportsModel.OverAllSummary(new InvoiceReportsModel(req.body)), result); },
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

exports.ParticularMonthInvoiceByCustomerNew = (req, res) => {

    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        var sqlArray = InvoiceReportsModel.ParticularMonthInvoiceByCustomerNew(new InvoiceReportsModel(req.body));
        async.parallel([
            function (result) { con.query(sqlArray[0].query, result); },
            function (result) { con.query(InvoiceReportsModel.OverAllSummaryNew(new InvoiceReportsModel(req.body)), result); },
            function (result) { con.query(sqlArray[0].Countquery, result); },
            function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
            function (result) { con.query(InvoiceReportsModel.OverAllBaseSummaryNew(new InvoiceReportsModel(req.body)), result); },
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






// 
exports.ParticularMonthInvoiceByCustomerToExcel = (req, res) => {
    InvoiceReportsModel.ParticularMonthInvoiceByCustomerToExcel(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
exports.ParticularMonthInvoiceByCustomerToExcelNew = (req, res) => {
    InvoiceReportsModel.ParticularMonthInvoiceByCustomerToExcelNew(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
// InvoiceByMonthReportToExcel
exports.InvoiceByMonthReportToExcel = (req, res) => {
    InvoiceReportsModel.InvoiceByMonthReportToExcel(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
exports.InvoiceByMonthReportToExcelNew = (req, res) => {
    InvoiceReportsModel.InvoiceByMonthReportToExcelNew(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
//
exports.InvoiceDetailedReport = (req, res) => {
    InvoiceReportsModel.InvoiceDetailedReport(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
exports.InvoiceDetailedReportNew = (req, res) => {
    InvoiceReportsModel.InvoiceDetailedReportNew(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.InvoiceDetailedReportCSV = (req, res) => {
    InvoiceReportsModel.InvoiceDetailedReportCSV(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};

exports.MROInvoiceDetailedReportCSV = (req, res) => {
    InvoiceReportsModel.MROInvoiceDetailedReportCSV(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};


// ToDo WithCurrency
exports.InvoiceByMonthWithCurrency = (req, res) => {
if (req.body.hasOwnProperty('ReportCurrencyCode') && req.body.ReportCurrencyCode != "") {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        var sqlArray = InvoiceReportsModel.InvoiceByMonthWithCurrency(new InvoiceReportsModel(req.body));
        async.parallel([
            function (result) { con.query(sqlArray[0].query, result); },
            function (result) { con.query(sqlArray[0].Countquery, result); },
            function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
            function (result) { con.query(InvoiceReportsModel.OverAllBaseSummaryWithCurrency(new InvoiceReportsModel(req.body)), result); },
            // function (result) { con.query(InvoiceReportsModel.OverAllSummaryNew(new InvoiceReportsModel(req.body)), result); },
        ],
            function (err, results) {
                if (err)
                    Reqresponse.printResponse(res, err, null);
                else
                    Reqresponse.printResponse(res, null, {
                        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
                        recordsTotal: results[2][0][0].TotalCount, draw: req.body.draw, OverAllBaseSummary: results[3][0]
                        // , OverAllSummary: results[4][0]
                    });
            });
    }
}else{
    ReqRes.printResponse(res, { msg: "Report Currency Code is required" }, null);
  }
};

exports.ParticularMonthInvoiceByCustomerWithCurrency = (req, res) => {
if (req.body.hasOwnProperty('ReportCurrencyCode') && req.body.ReportCurrencyCode != "") {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        var sqlArray = InvoiceReportsModel.ParticularMonthInvoiceByCustomerWithCurrency(new InvoiceReportsModel(req.body));
        async.parallel([
            function (result) { con.query(sqlArray[0].query, result); },
            function (result) { con.query(sqlArray[0].Countquery, result); },
            function (result) { con.query(sqlArray[0].TotalCountQuery, result); },
            function (result) { con.query(InvoiceReportsModel.OverAllBaseSummaryWithCurrency(new InvoiceReportsModel(req.body)), result); },
            // function (result) { con.query(InvoiceReportsModel.OverAllSummaryNew(new InvoiceReportsModel(req.body)), result); },
        ],
            function (err, results) {
                if (err)
                    Reqresponse.printResponse(res, err, null);

                else
                    Reqresponse.printResponse(res, null, {
                        data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered,
                        recordsTotal: results[2][0][0].TotalCount, draw: req.body.draw, OverAllBaseSummary: results[3][0]
                        // , OverAllSummary: results[4][0]
                    });
            });
    }
}else{
    ReqRes.printResponse(res, { msg: "Report Currency Code is required" }, null);
  }
};

exports.InvoiceByMonthReportToExcelWithCurrency = (req, res) => {
if (req.body.hasOwnProperty('ReportCurrencyCode') && req.body.ReportCurrencyCode != "") {
    InvoiceReportsModel.InvoiceByMonthReportToExcelWithCurrency(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
}else{
    ReqRes.printResponse(res, { msg: "Report Currency Code is required" }, null);
  }
};

exports.ParticularMonthInvoiceByCustomerToExcelWithCurrency  = (req, res) => {
if (req.body.hasOwnProperty('ReportCurrencyCode') && req.body.ReportCurrencyCode != "") {
    InvoiceReportsModel.ParticularMonthInvoiceByCustomerToExcelWithCurrency(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
}else{
    ReqRes.printResponse(res, { msg: "Report Currency Code is required" }, null);
  }
};

exports.InvoiceDetailedReportWithCurrency = (req, res) => {
if (req.body.hasOwnProperty('ReportCurrencyCode') && req.body.ReportCurrencyCode != "") {
    InvoiceReportsModel.InvoiceDetailedReportWithCurrency(new InvoiceReportsModel(req.body), (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
}else{
    ReqRes.printResponse(res, { msg: "Report Currency Code is required" }, null);
  }
};


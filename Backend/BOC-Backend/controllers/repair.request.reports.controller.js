/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RRReportsModel = require("../models/repair.request.reports.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

exports.RepairRequestCustomReportExcel = (req, res) => {
  RRReportsModel.RepairRequestCustomReportExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.RepairRequestCustomReport = (req, res) => {
  RRReportsModel.RepairRequestCustomReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


exports.RRShipViaReportExcel = (req, res) => {
  RRReportsModel.RRShipViaReportExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.RRShipViaReport = (req, res) => {
  RRReportsModel.RRShipViaReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.RRCreatedByUserReportsExcel = (req, res) => {
  RRReportsModel.RRCreatedByUserReportsExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.RRCreatedByUserReports = (req, res) => {
  RRReportsModel.RRCreatedByUserReports(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


// get TotalCostSavings Vs CostofNewReport
exports.getTotalCostSavingsVsCostofNewReport = (req, res) => {
  RRReportsModel.TotalCostSavingsVsCostofNewReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.CustomerReportAmazonRaw = (req, res) => {
  RRReportsModel.CustomerReportAmazonRaw(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.GMCostSavingReport = (req, res) => {
  RRReportsModel.GMCostSavingReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.GMCostSavingReportExcel = (req, res) => {
  RRReportsModel.GMCostSavingReportExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.GMRepairTrackerReport = (req, res) => {
  RRReportsModel.GMRepairTrackerReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.GMRepairTrackerReportExcel = (req, res) => {
  RRReportsModel.GMRepairTrackerReportExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};



exports.DanaCostSavingReport = (req, res) => {
  RRReportsModel.DanaCostSavingReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.DanaCostSavingReportExcel = (req, res) => {
  RRReportsModel.DanaCostSavingReportExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


exports.CustomerReportAmazonRawCSV = (req, res) => {
  RRReportsModel.CustomerReportAmazonRawCSV(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};



// get TotalCostSavings Vs CostofNewReport
exports.getTotalCostSavingsVsLastPricePaidReport = (req, res) => {
  RRReportsModel.TotalCostSavingsVsLastPricePaidReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// get OnTimeDeliveryReport
exports.getOnTimeDeliveryReport = (req, res) => {
  RRReportsModel.OnTimeDeliveryReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// get OnTimeDeliveryReport
exports.getOpenOrderReport = (req, res) => {
  RRReportsModel.OpenOrderReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


// get OpenOrderReport ExportToExcel
exports.OpenOrderReportExportToExcel = (req, res) => {
  RRReportsModel.OpenOrderReportExportToExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get OnTimeDeliveryReport ExportToExcel
exports.OnTimeDeliveryReportExportToExcel = (req, res) => {
  RRReportsModel.OnTimeDeliveryReportExportToExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get TotalCostSavingsVsLastPricePaidReport ExportToExcel
exports.TotalCostSavingsVsLastPricePaidReportExportToExcel = (req, res) => {
  RRReportsModel.TotalCostSavingsVsLastPricePaidReportExportToExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get TotalCostSavingsVsCostofNewReport ExportToExcel
exports.TotalCostSavingsVsCostofNewReportExportToExcel = (req, res) => {
  RRReportsModel.TotalCostSavingsVsCostofNewReportExportToExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get ProcessFitnessReport
exports.getProcessFitnessReport = (req, res) => {
  RRReportsModel.ProcessFitnessReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get ProcessFitnessReport ExportToExcel
exports.ProcessFitnessReportExportToExcel = (req, res) => {
  RRReportsModel.ProcessFitnessReportExportToExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


// get RMA Report
exports.RMAReport = (req, res) => {
  RRReportsModel.RMAReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get RMA Report ExportToExcel
exports.RMAReportExcel = (req, res) => {
  RRReportsModel.RMAReportExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};





// get OpenOrderBySupplierReport
exports.getOpenOrderBySupplierReport = (req, res) => {
  RRReportsModel.OpenOrderBySupplierReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get OpenOrderBySupplierReportCount
exports.getOpenOrderBySupplierReportCount = (req, res) => {
  RRReportsModel.OpenOrderBySupplierReportCount(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get OpenOrderBySupplierReport ExportToExcel
exports.OpenOrderBySupplierReportExportToExcel = (req, res) => {
  RRReportsModel.OpenOrderBySupplierReportExportToExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get OpenOrderBySupplierWithoutVatReport
exports.getOpenOrderBySupplierWithoutVatReport = (req, res) => {
  RRReportsModel.OpenOrderBySupplierWithoutVatReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get OpenOrderBySupplierWithoutVatReportCount
exports.getOpenOrderBySupplierWithoutVatReportCount = (req, res) => {
  RRReportsModel.OpenOrderBySupplierWithoutVatReportCount(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.getRMAReportCount = (req, res) => {
  RRReportsModel.getRMAReportCount(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// get OpenOrderBySupplierWithoutVatReport ExportToExcel
exports.OpenOrderBySupplierWithoutVatReportExportToExcel = (req, res) => {
  RRReportsModel.OpenOrderBySupplierWithoutVatReportExportToExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get getFollowUpReport
exports.getFollowUpReport = (req, res) => {
  RRReportsModel.FollowUpReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get FollowUpReport ExportToExcel
exports.FollowUpReportExportToExcel = (req, res) => {
  RRReportsModel.FollowUpReportExportToExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get getBPIReport
exports.getBPIReport = (req, res) => {
  RRReportsModel.BPIReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get BPIReport ExportToExcel
exports.BPIReportExportToExcel = (req, res) => {
  RRReportsModel.BPIReportExportToExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// RR new reports

exports.RRARReports = (req, res) => {
  RRReportsModel.RRARReports(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.RRARReportsToExcel = (req, res) => {
  RRReportsModel.RRARReportsToExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.RRStartLocation = (req, res) => {
  RRReportsModel.RRStartLocation(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.RRStartLocationExcel = (req, res) => {
  RRReportsModel.RRStartLocationExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get DanaOpenOrderBySupplierReport
exports.getDanaOpenOrderBySupplierReport = (req, res) => {
  RRReportsModel.DanaOpenOrderBySupplierReport(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get DanaOpenOrderBySupplierReportCount
exports.getDanaOpenOrderBySupplierReportCount = (req, res) => {
  RRReportsModel.DanaOpenOrderBySupplierReportCount(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
// get DanaOpenOrderBySupplierReport ExportToExcel
exports.DanaOpenOrderBySupplierReportExportToExcel = (req, res) => {
  RRReportsModel.DanaOpenOrderBySupplierReportExportToExcel(new RRReportsModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

const {
  VendorImport,
  CustomerImport,
  PartImport,
  RRImport,
  ImportCustomerPONo,
} = require("../models/import.models");
var XLSX = require("xlsx");
const Reqresponse = require("../helper/request.response.validation.js");
results = [];
PartIds = ``;
var path = require("path");
var handlebars = require("handlebars");
const PartModel = require("../models/parts.model.js");
const CustomerPartsModel = require("../models/customer.parts.model");
const { HttpRequest } = require("aws-sdk");
const request = require("request");
const fs = require("fs");
const EdiModel = require("../models/edi.model");
const Constants = require("../config/constants.js");
const { getStatusList } = require("../models/edi.model");
var cDateTime = require("../utils/generic.js");
const Quotes = require("../models/quotes.model");

exports.ImportCustomerPartNos = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var PARTJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  RecursiveUpdateCustomerPartNos(0, PARTJSON, (err, data) => {
    if (err) Reqresponse.printResponse(res, err, null);
    else Reqresponse.printResponse(res, null, data);
  });
};

function RecursiveUpdateCustomerPartNos(i, PARTJSON, cb) {
  CustomerPartsModel.Import(PARTJSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      if (data.msg == "Record Updated") {
        results.push({ record: i, message: data.msg + " : " + data.PartNo });
      } else if (data.msg == "Record Inserted") {
        results.push({ record: i, message: data.msg + " : " + data.PartNo });
      }
    }
    if (i == PARTJSON.length) {
      return cb(null, results);
    }
    RecursiveUpdateCustomerPartNos(i, PARTJSON, cb);
  });
}

exports.ImportMappingPart = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  var sheetName = wb.SheetNames[0];
  var sheetValue = wb.Sheets[sheetName];
  var exceldata = XLSX.utils.sheet_to_json(sheetValue);
  results = [];

  if (exceldata.length > 0) {
    ImportMappingPart(0, req, exceldata, (data) => {
      Reqresponse.printResponse(res, null, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "No Records Found " }, null);
  }
};

function ImportMappingPart(i, req, PartJSON, cb) {
  PartModel.ImportPartwithMapping(PartJSON[i], req, (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({
        record: i,
        message: msg,
        status: err.status,
        partNo: err.partNo || null,
      });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == PartJSON.length) {
      let j = 0;
      let k = 0;
      let partCount = 0;
      let partNoArr = [];
      //  let partInvaildCount = 0;
      // let partInvaildNo = [];
      results.map((data) => {
        if (data.status == "inserted") {
          j = j + 1;
        }
        if (data.status == "updated") {
          k = k + 1;
        }
        if (data.status == "failed") {
          partCount = partCount + 1;
          partNoArr.push(data.staffCode);
        }
        // if (data.status == 'invaild') {
        //     partInvaildCount = partInvaildCount + 1;
        //     staffInvaildCode.push(data.staffCode);
        // }
      });
      //  let staffinvaild = staffInvaildCode.length > 0 ? staffInvaildCount + '(' + staffInvaildCode.toString() + ')' : staffInvaildCount;
      // let RecordAddUpdateFailed = partNoArr.length > 0 ? partCount + '(' + partNoArr.toString() + ')' : partCount;
      //  log.importlog(Constants.CONST_IMPORT_SALARY_CONVEYANCE, req.file.filename, j, k, RecordAddUpdateFailed, staffinvaild);
      let finalObj = {
        TotalRecords: PartJSON.length,
        RecordsAdded: j,
        RecordsUpdated: k,
        RecordFailed: { partCount, partNoArr },
        // 'RecordsNotMatchedWithDB': { staffInvaildCount }//, staffInvaildCode
      };
      return cb(finalObj);
    }

    ImportMappingPart(i, req, PartJSON, cb);
  });
}

exports.CustomerAvailability = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var RRJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  CustomerAvailabilityRecursive(0, RRJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function CustomerAvailabilityRecursive(i, RRJSON, cb) {
  RRImport.CustomerAvailability(RRJSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }
    if (i == RRJSON.length) {
      return cb(results);
    }
    CustomerAvailabilityRecursive(i, RRJSON, cb);
  });
}

exports.VendorAvailability = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var RRJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  VendorAvailabilityRecursive(0, RRJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function VendorAvailabilityRecursive(i, RRJSON, cb) {
  RRImport.VendorAvailability(RRJSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }
    if (i == RRJSON.length) {
      return cb(results);
    }
    VendorAvailabilityRecursive(i, RRJSON, cb);
  });
}

exports.ChangeRecordCurrencyByCustomer = (req, res) => {
  RRImport.ChangeRecordCurrencyByCustomerQuery(req.body, (err, data) => {
    var resultlist = data;
    for (let val of resultlist) {
      if (val.RRId > 0) {
        RRImport.ChangeRecordCurrencyByCustomer(val, (err, data) => {});
      }
    }
    Reqresponse.printResponse(res, null, data);
  });
};

exports.ChangeRecordCurrencyByVendor = (req, res) => {
  RRImport.ChangeRecordCurrencyByVendorQuery(req.body, (err, data) => {
    var resultlist = data;
    for (let val of resultlist) {
      if (val.RRId > 0) {
        RRImport.ChangeRecordCurrencyByVendor(val, (err, data) => {});
      }
    }
    Reqresponse.printResponse(res, null, data);
  });
};

exports.RRCustomerRef = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var RRJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  RRCustomerRefRecursive(0, RRJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function RRCustomerRefRecursive(i, RRJSON, cb) {
  RRImport.RRCustomerRef(RRJSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == RRJSON.length) {
      return cb(results);
    }
    RRCustomerRefRecursive(i, RRJSON, cb);
  });
}

exports.ImportRRPriceCurrency = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var RRJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  RRPriceCurrencyImportRecursive(0, RRJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function RRPriceCurrencyImportRecursive(i, RRJSON, cb) {
  RRImport.ImportRRPriceCurrency(RRJSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == RRJSON.length) {
      return cb(results);
    }
    RRPriceCurrencyImportRecursive(i, RRJSON, cb);
  });
}

exports.ImportRR = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var RRJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  RRImportRecursive(0, RRJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function RRImportRecursive(i, RRJSON, cb) {
  RRImport.ImportRRType1(RRJSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == RRJSON.length) {
      return cb(results);
    }
    RRImportRecursive(i, RRJSON, cb);
  });
}

exports.ImportNonRR = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var RRJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  NonRRImportRecursive(0, RRJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function NonRRImportRecursive(i, RRJSON, cb) {
  RRImport.ImportNonRR(RRJSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == RRJSON.length) {
      return cb(results);
    }
    NonRRImportRecursive(i, RRJSON, cb);
  });
}

exports.UpdateCustomerPONoFromExcel = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var JSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  UpdateCustomerPONoFromExcelRecursive(0, JSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function UpdateCustomerPONoFromExcelRecursive(i, JSON, cb) {
  ImportCustomerPONo.ImportCustomerPONo(JSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == JSON.length) {
      return cb(results);
    }
    UpdateCustomerPONoFromExcelRecursive(i, JSON, cb);
  });
}

exports.ImportVendor = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = "Vendor";
  var vendorJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  vendorImportRecursive(0, vendorJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function vendorImportRecursive(i, vendorJSON, cb) {
  VendorImport.importVendor(vendorJSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == vendorJSON.length) {
      return cb(results);
    }
    vendorImportRecursive(i, vendorJSON, cb);
  });
}

exports.ImportCustomer = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = "Customer";
  var customerJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  customerImportRecursive(0, customerJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function customerImportRecursive(i, customerJSON, cb) {
  CustomerImport.importCustomer(customerJSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == customerJSON.length) {
      return cb(results);
    }
    customerImportRecursive(i, customerJSON, cb);
  });
}

exports.ImportCustomerUser = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = "Amazon POCs";
  var customerJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  customerImportUserRecursive(0, customerJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function customerImportUserRecursive(i, customerJSON, cb) {
  CustomerImport.importCustomerUser(customerJSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == customerJSON.length) {
      return cb(results);
    }
    customerImportUserRecursive(i, customerJSON, cb);
  });
}

exports.ImportMissingSOItem = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var RRJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  ImportMissingSOItemRecursive(0, RRJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function ImportMissingSOItemRecursive(i, JSON, cb) {
  RRImport.ImportMissingSOItem(JSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == JSON.length) {
      return cb(results);
    }
    ImportMissingSOItemRecursive(i, JSON, cb);
  });
}

exports.ImportMissingPOItem = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var JSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  ImportMissingPOItemRecursive(0, JSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function ImportMissingPOItemRecursive(i, JSON, cb) {
  RRImport.ImportMissingPOItem(JSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == JSON.length) {
      return cb(results);
    }
    ImportMissingPOItemRecursive(i, JSON, cb);
  });
}

exports.ImportMissingPODueDate = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var JSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  ImportMissingPODueDateRecursive(0, JSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function ImportMissingPODueDateRecursive(i, JSON, cb) {
  RRImport.ImportMissingPODueDate(JSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == JSON.length) {
      return cb(results);
    }
    ImportMissingPODueDateRecursive(i, JSON, cb);
  });
}

exports.ImportPartManufacturer = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = Object.keys(wb.Sheets)[0];
  var JSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  ImportPartManufacturerRecursive(0, JSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function ImportPartManufacturerRecursive(i, JSON, cb) {
  RRImport.ImportPartManufacturer(JSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: data });
    }

    if (i == JSON.length) {
      return cb(results);
    }
    ImportPartManufacturerRecursive(i, JSON, cb);
  });
}

exports.UpdateVendorUnitPrice = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = "Amazon POCs";
  var JSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  UpdateUnitPriceRecursive(0, JSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};

function UpdateUnitPriceRecursive(i, JSON, cb) {
  RRImport.UpdateVendorUnitPrice(JSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == JSON.length) {
      return cb(results);
    }
    UpdateUnitPriceRecursive(i, JSON, cb);
  });
}

exports.ImportPart = (req, res) => {
  const path = req.file.path;
  var wb = XLSX.readFile(path);
  let sheetName = "Inventory";
  var partJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  results = [];
  partImportRecursive(0, partJSON, (data) => {
    Reqresponse.printResponse(res, null, data);
  });
};
exports.BulkShippingPdf = (req, res) => {
  exportAsPdf(req, res, "bulk-shipping-packing-slip");
};

exports.poPdf = (req, res) => {
  req.body.pdfObj.IsHideTax = "0";
  exportAsPdf(req, res, "purchase-order");
};

exports.poPdfWoTax = (req, res) => {
  req.body.pdfObj.IsHideTax = "1";
  exportAsPdf(req, res, "purchase-order");
};

exports.checklistPdf = (req, res) => {
  exportAsPdf(req, res, "checklist");
};

exports.checklistBothPdf = (req, res) => {
  exportAsPdf(req, res, "checklist-both");
};

exports.sqPdf = (req, res) => {
  exportAsSalesQuotePdf(req, res, "sales-quote");
};

exports.sqMultiplePdf = (req, res) => {
  exportAsSalesQuoteMultiplePdf(req, res, "sales-quote");
};

exports.psPdf = (req, res) => {
  exportAsPdf(req, res, "packing-slip");
};

exports.soPdf = (req, res) => {
  exportAsSalesOrderPDF(req, res, "sales-order");
};

exports.viPdf = (req, res) => {
  exportAsPdf(req, res, "vendor-bill");
};

exports.invPdf = (req, res) => {
  req.body.pdfObj.IsHideTax = "0";
  exportAsInvoicePdf(req, res, "invoice");
};
exports.invPdfWoTax = (req, res) => {
  req.body.pdfObj.IsHideTax = "1";
  exportAsInvoicePdf(req, res, "invoice");
};

exports.cinvPdf = (req, res) => {
  req.body.pdfObj.IsHideTax = "0";
  exportAsInvoicePdf(req, res, "c-invoice");
};
exports.invCSV = (req, res) => {
  exportAsInvoiceCSV(req, res, "invoice", "manual");
};

exports.invCSVAutoUpload = (req, res) => {
  exportAsInvoiceCSV(req, res, "invoice", "auto");
};

function exportAsSalesOrderPDF(req, res, templateName) {
  let dataObj = req.body.pdfObj;
  dataObj.SalesOrderItem.map((a) => {
    if (dataObj.SalesOrderInfo.MROId > 0) {
      a.WarrantyLabel = "MRO";
    } else {
      if (a.WarrantyPeriod == "0") {
        a.WarrantyLabel = "No Warranty";
      } else if (a.WarrantyPeriod > "0") {
        a.WarrantyLabel = a.WarrantyPeriod + " Months";
      } else if (a.WarrantyPeriod == null) {
        a.WarrantyLabel = "-";
      }
    }
  });
  exportAsPdf(req, res, templateName);
}

function exportAsInvoicePdf(req, res, templateName) {
  let dataObj = req.body.pdfObj;
  dataObj.InvoiceItem.map((a) => {
    if (dataObj.InvoiceInfo.MROId > 0) {
      a.WarrantyLabel = "MRO";
    } else {
      if (a.WarrantyPeriod == "0") {
        a.WarrantyLabel = "No Warranty";
      } else if (a.WarrantyPeriod > "0") {
        a.WarrantyLabel = a.WarrantyPeriod + " Months";
      } else if (a.WarrantyPeriod == null) {
        a.WarrantyLabel = "-";
      }
    }
  });
  exportAsPdf(req, res, templateName);
}

function exportAsInvoiceCSV(req, res, templateName, type) {
  let dataObj = req.body.pdfObj;
  dataObj.InvoiceItem.map((a) => {
    if (dataObj.InvoiceInfo.MROId > 0) {
      a.WarrantyLabel = "MRO";
    } else {
      if (a.WarrantyPeriod == "0") {
        a.WarrantyLabel = "No Warranty";
      } else if (a.WarrantyPeriod > "0") {
        a.WarrantyLabel = a.WarrantyPeriod + " Months";
      } else if (a.WarrantyPeriod == null) {
        a.WarrantyLabel = "-";
      }
    }
  });
  exportAsCSV(req, res, templateName, type);
}

function exportAsSalesQuotePdf(req, res, templateName) {
  let dataObj = req.body.pdfObj;
  dataObj.QuoteItem.map((a) => {
    if (dataObj.SalesQuoteInfo.MROId > 0) {
      a.WarrantyLabel = "MRO";
    } else {
      if (a.WarrantyPeriod == "0") {
        a.WarrantyLabel = "No Warranty";
      } else if (a.WarrantyPeriod > "0") {
        a.WarrantyLabel = a.WarrantyPeriod + " Months";
      } else if (a.WarrantyPeriod == null) {
        a.WarrantyLabel = "-";
      }
    }
  });
  exportAsPdf(req, res, templateName);
}

function exportAsSalesQuoteMultiplePdf(req, res, templateName) {
  exportAsMultiplePdf(req, res, templateName);
}

function exportAsPdf(req, res, templateName) {
  var html_to_pdf = require("html-pdf-node");
  var fs = require("fs");
  let dataObj = req.body.pdfObj;
  fs.readFile(
    path.join(__dirname, `../views/print-template/${templateName}.hbs`),
    function (err, data) {
      if (!err) {
        // make the buffer into a string
        var source = data.toString();
        // call the render function
        let template = { content: renderToString(source, dataObj) };

        let options = {
          format: "A4",
          margin: {
            top: 5,
            bottom: 5,
          },
        };
        html_to_pdf
          .generatePdf(template, options)
          .then((pdfBuffer) => {
            var fileContents = Buffer.from(pdfBuffer, "base64");
            var pdfBase64 = fileContents.toString("base64");
            Reqresponse.printResponse(res, null, { pdfBase64 });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // handle file read error
      }
    }
  );
}

function exportAsMultiplePdf(req, res, templateName) {
  var html_to_pdf = require("html-pdf-node");
  var fs = require("fs");
  var i = 0;
  var reqBody = req.body;
  var pdfBase64 = [];
  reqBody.Quote.forEach((element) => {
    element.IsDeleted = 0;
    Quotes.findById(
      element.QuoteId,
      element.IsDeleted,
      reqBody,
      (err1, dataObj) => {
        var BasicInfo = dataObj.BasicInfo[0];
        var BillingAddress = dataObj.BillingAddress[0];
        var ShippingAddress = dataObj.ShippingAddress[0];
        var AHGroupWebsite = Constants.AHGroupWebsite;
        if (
          dataObj.RemitToAddress &&
          dataObj.RemitToAddress.EntityWebsite != ""
        ) {
          AHGroupWebsite = dataObj.RemitToAddress.EntityWebsite;
        }
        dataObj.SalesQuoteInfo = BasicInfo;
        dataObj.Logo = reqBody.Logo;
        dataObj.IsSONotesEnabled = reqBody.IsSONotesEnabled;
        dataObj.BillingAddress = BillingAddress;
        dataObj.ShippingAddress = ShippingAddress;
        dataObj.SalesQuotesCustomerRef = dataObj.CustomerReference || [];
        dataObj.QuoteItem = dataObj.QuoteItem.map((a) => {
          a.CurrencySymbol = dataObj.CurrencySymbol;
          return a;
        });
        dataObj.settingsView = reqBody.settingsView;
        dataObj.AHAddressList = reqBody.AHAddressList;
        dataObj.NotesList = dataObj.NotesList;
        dataObj.RRNotesList = dataObj.RRNotesList;
        dataObj.RemitToAddress = dataObj.RemitToAddress;
        dataObj.AHGroupWebsite = dataObj.AHGroupWebsite;
        dataObj.RRId = BasicInfo.RRId;
        if (BasicInfo.RRId != 0) {
          dataObj.RRnumber = BasicInfo.RRNo;
        } else {
          dataObj.QTnumber = BasicInfo.QuoteNo;
        }
        // BillingAddress
        if (BillingAddress.IdentityId == BasicInfo.VendorId) {
          dataObj.BillName = BasicInfo.VendorName;
        } else if (BillingAddress.IdentityType == "Customer") {
          dataObj.BillName = BasicInfo.CompanyName;
        } else if (BillingAddress.IdentityId == Constants.AH_GROUP_VENDOR_ID) {
          dataObj.BillName = "AH-Group";
        }
        // ShippingAddress
        if (ShippingAddress.IdentityId == BasicInfo.VendorId) {
          dataObj.ShipName = BasicInfo.VendorName;
        } else if (ShippingAddress.IdentityType == "Customer") {
          dataObj.ShipName = BasicInfo.CompanyName;
        } else if (ShippingAddress.IdentityId == Constants.AH_GROUP_VENDOR_ID) {
          dataObj.ShipName = "AH-Group";
        }
        dataObj.QuoteItem.map((a) => {
          if (dataObj.QuoteItem.MROId > 0) {
            a.WarrantyLabel = "MRO";
          } else {
            if (a.WarrantyPeriod == "0") {
              a.WarrantyLabel = "No Warranty";
            } else if (a.WarrantyPeriod > "0") {
              a.WarrantyLabel = a.WarrantyPeriod + " Months";
            } else if (a.WarrantyPeriod == null) {
              a.WarrantyLabel = "-";
            }
          }
        });
        // let dataObj = data1;
        fs.readFile(
          path.join(__dirname, `../views/print-template/${templateName}.hbs`),
          function (err, data) {
            if (!err) {
              // make the buffer into a string
              var source = data.toString();
              // call the render function
              let template = { content: renderToString(source, dataObj) };

              let options = {
                format: "A4",
                margin: {
                  top: 5,
                  bottom: 5,
                },
              };
              html_to_pdf
                .generatePdf(template, options)
                .then((pdfBuffer) => {
                  i++;
                  var fileContents = Buffer.from(pdfBuffer, "base64");
                  pdfBase64.push({
                    pdfSource: fileContents.toString("base64"),
                    RRId: dataObj.BasicInfo ? dataObj.BasicInfo[0].RRId : "",
                    MROId: dataObj.BasicInfo ? dataObj.BasicInfo[0].MROId : "",
                    MRONo: dataObj.BasicInfo ? dataObj.BasicInfo[0].MRONo : "",
                    QuoteNo: dataObj.BasicInfo
                      ? dataObj.BasicInfo[0].QuoteNo
                      : "",
                    RRNo: dataObj.BasicInfo ? dataObj.BasicInfo[0].RRNo : "",
                  });
                  if (i == reqBody.Quote.length) {
                    Reqresponse.printResponse(res, null, { pdfBase64 });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              // handle file read error
            }
          }
        );
      }
    );
  });
}

function exportAsCSV(req, res, templateName, type) {
  let converter = require("json-2-csv");

  var fs = require("fs");
  let dataObj = req.body.pdfObj;
  let csv = "";
  let json = [];
  const currentDate = new Date();
  const dateString =
    currentDate.getDate() +
    "-" +
    (currentDate.getMonth() + 1) +
    "-" +
    currentDate.getFullYear() +
    "-" +
    currentDate.getTime();
  var allow = true;
  var InvoiceId = dataObj.InvoiceInfo.InvoiceId;
  let name = dataObj.InvoiceInfo.InvoiceNo + "-" + dateString + ".csv";
  dataObj.InvoiceItem.forEach((element) => {
    var InvoiceDate = dataObj.InvoiceInfo.InvoiceDate;
    var DueDate = dataObj.InvoiceInfo.DueDate;
    if (InvoiceDate) {
      var InvoiceDateArray = dataObj.InvoiceInfo.InvoiceDate.split("-");
      InvoiceDate =
        InvoiceDateArray[1] +
        "/" +
        InvoiceDateArray[2] +
        "/" +
        InvoiceDateArray[0];
    }
    if (DueDate) {
      var DueDateArray = dataObj.InvoiceInfo.DueDate.split("-");
      DueDate = DueDateArray[1] + "/" + DueDateArray[2] + "/" + DueDateArray[0];
    }
    var length = 45;

    if (
      dataObj.BillingAddress.StateCode &&
      dataObj.BillingAddress.Zip &&
      dataObj.BillingAddress.CountryCode &&
      dataObj.ShippingAddress.StateCode &&
      dataObj.ShippingAddress.Zip &&
      dataObj.ShippingAddress.CountryCode &&
      dataObj.AHBillingAddress.StateCode &&
      dataObj.AHBillingAddress.Zip &&
      dataObj.AHBillingAddress.CountryCode
    ) {
      // allow = true;
    } else {
      allow = false;
    }
    json.push({
      "Invoice No": dataObj.InvoiceInfo.InvoiceNo,
      "Invoice Date": InvoiceDate,
      "Invoice Due Date": DueDate,
      "RR No": dataObj.InvoiceInfo.RRNo ? dataObj.InvoiceInfo.RRNo : "",
      "Customer ID": dataObj.InvoiceInfo.CustomerId,
      Terms: dataObj.InvoiceInfo.TermsName,

      "Bill To": dataObj.InvoiceInfo.CompanyName,
      "BT Street Name": dataObj.BillingAddress.StreetAddress,
      "BT City Name": dataObj.BillingAddress.City,
      "BT State Code": dataObj.BillingAddress.StateCode,
      "BT Postal Code": dataObj.BillingAddress.Zip,
      "BT Country Code": dataObj.BillingAddress.CountryCode,

      "Ship To": dataObj.InvoiceInfo.CompanyName,
      "ST Street Name": dataObj.ShippingAddress.StreetAddress,
      "ST City Name": dataObj.ShippingAddress.City,
      "ST State Code": dataObj.ShippingAddress.StateCode,
      "ST Postal Code": dataObj.ShippingAddress.Zip,
      "ST Country Code": dataObj.ShippingAddress.CountryCode,

      "Remit To": dataObj.AHBillingAddress.VendorName,
      "RI Street Name": dataObj.AHBillingAddress.StreetAddress,
      "RI City Name": dataObj.AHBillingAddress.City,
      "RI State Code": dataObj.AHBillingAddress.StateCode,
      "RI Postal Code": dataObj.AHBillingAddress.Zip,
      "RI Country Code": dataObj.AHBillingAddress.CountryCode,
      // "City": dataObj.InvoiceInfo.CompanyName,
      // "Address 1" : dataObj.BillingAddress.StreetAddress+","+dataObj.BillingAddress.City+","+dataObj.BillingAddress.StateName+","+dataObj.BillingAddress.Zip+","+dataObj.BillingAddress.CountryName,
      // "Address 2": dataObj.AHBillingAddress.StreetAddress+","+dataObj.AHBillingAddress.City+","+dataObj.AHBillingAddress.StateName+","+dataObj.AHBillingAddress.Zip+","+dataObj.AHBillingAddress.CountryName,
      Phone: dataObj.BillingAddress.PhoneNoPrimary,
      "Repair Request #": dataObj.InvoiceInfo.RRNo
        ? dataObj.InvoiceInfo.RRNo
        : "",
      "Sales Order #": dataObj.InvoiceInfo.SONo ? dataObj.InvoiceInfo.SONo : "",
      "Reference #": dataObj.InvoiceInfo.ReferenceNo,
      "Customer PO #": dataObj.InvoiceInfo.CustomerPONo,
      "Customer Reference 1":
        dataObj.CustomerRef && dataObj.CustomerRef[0]
          ? dataObj.CustomerRef[0].ReferenceLabelName +
            " : " +
            dataObj.CustomerRef[0].ReferenceValue
          : "",
      "Customer Reference 2":
        dataObj.CustomerRef && dataObj.CustomerRef[1]
          ? dataObj.CustomerRef[1].ReferenceLabelName +
            " : " +
            dataObj.CustomerRef[1].ReferenceValue
          : "",
      "Customer Reference 3":
        dataObj.CustomerRef && dataObj.CustomerRef[2]
          ? dataObj.CustomerRef[2].ReferenceLabelName +
            " : " +
            dataObj.CustomerRef[2].ReferenceValue
          : "",
      "Customer Reference 4":
        dataObj.CustomerRef && dataObj.CustomerRef[3]
          ? dataObj.CustomerRef[3].ReferenceLabelName +
            " : " +
            dataObj.CustomerRef[3].ReferenceValue
          : "",
      "Customer Reference 5":
        dataObj.CustomerRef && dataObj.CustomerRef[4]
          ? dataObj.CustomerRef[4].ReferenceLabelName +
            " : " +
            dataObj.CustomerRef[4].ReferenceValue
          : "",
      "Customer Reference 6":
        dataObj.CustomerRef && dataObj.CustomerRef[5]
          ? dataObj.CustomerRef[5].ReferenceLabelName +
            " : " +
            dataObj.CustomerRef[5].ReferenceValue
          : "",
      "Currency Code": dataObj.InvoiceInfo.CustomerCurrencyCode,
      Item: element.PartNo,
      "Item Description": element.Description.substring(0, length),
      Notes: mergeKeyValue(dataObj.NotesList),
      "Excluded Items": element.IsExcludeFromBlanketPO,
      Qty: element.Quantity,
      "Unit Price": element.Rate,
      Price: element.Price,
      "Sub Total": dataObj.InvoiceInfo.SubTotal,
      "Grand Total": dataObj.InvoiceInfo.GrandTotal,
      "Warranty Period": element.WarrantyPeriod,
    });
  });
  if (allow) {
    converter.json2csv(json, function (err, csv) {
      if (err) console.log(err);
      fs.writeFile("edi/" + name, csv, function (err) {
        if (err) {
          throw err;
        } else {
          if (type == "auto") {
            var CSVFile = "edi/" + name;
            const path = CSVFile;
            var formData = {
              invoice: fs.createReadStream(path),
              from: "AHGROUP_MEMS",
              to: "SN2SNWFXJYHKEC2",
              debug: "true",
            };
            const options = {
              url: "https://edi.junoedge.com/api/invoice",
              method: "POST",
              formData: formData,
              headers: {
                Authorization:
                  "Basic " +
                  Buffer.from("stocko:3j8cnaGFtjCJoG0zLgEv").toString("base64"),
                "x-api-key":
                  "vGXuMUoRlJUeDN.bUWduge4GhQbgPkm6pfyGxwgEWT0vEkHKBUW",
              },
            };
            let response = promisifiedRequest(
              req,
              res,
              options,
              InvoiceId,
              dataObj.InvoiceInfo.InvoiceNo
            );
          } else {
            Reqresponse.printResponse(res, null, { json });
          }
        }
      });
    });
  } else {
    json = {
      message: "State/Zip/Country missing!",
      status: false,
    };
    Reqresponse.printResponse(res, null, { json });
    // Reqresponse.printResponse(res, { msg: "State/Zip/Country missing!" }, null);
  }
}

function mergeKeyValue(array) {
  var notes;
  if (array.length > 0) {
    notes = array.map(function (note) {
      return note.Notes;
    });
    notes = notes.join(" // ");
  } else {
    notes = "";
  }
  return notes;
}

exports.LinkBlanketPONonRR = (req, res) => {
  RRImport.GetNonRRBlanketPOListForLink(req.body, (err, data) => {
    var POIdlist = data;
    for (let val of POIdlist) {
      if (val.SOId > 0 && val.CustomerBlanketPOId > 0) {
        RRImport.LinkBlanketPONonRR(val, (err, data) => {
          if (err) Reqresponse.printResponse(res, err, null);
        });
      }
    }
    Reqresponse.printResponse(res, err, data);
  });
};

exports.LinkBlanketPORR = (req, res) => {
  RRImport.GetRRBlanketPOListForLink(req.body, (err, data) => {
    var POIdlist = data;
    for (let val of POIdlist) {
      if (val.QuoteId > 0 && val.CustomerBlanketPOId > 0) {
        RRImport.LinkBlanketPORR(val, (err, data) => {
          if (err) Reqresponse.printResponse(res, err, null);
        });
      }
    }
    Reqresponse.printResponse(res, err, data);
  });
};

function renderToString(source, data) {
  var template = handlebars.compile(source);
  var outputString = template(data);
  return outputString;
}

function partImportRecursive(i, partJSON, cb) {
  PartImport.importPart(partJSON[i], (err, data) => {
    i = i + 1;
    console.log(i, "record processed");
    if (err) {
      var msg = err.message || err.msg || err;
      results.push({ record: i, message: msg });
    } else {
      results.push({ record: i, message: "Success" });
    }

    if (i == partJSON.length) {
      return cb(results);
    }
    partImportRecursive(i, partJSON, cb);
  });
}
exports.ediCSV = (req, res) => {
  var file = req.file;
  var InvoiceId = req.body.InvoiceId;
  var InvoiceNo = req.body.InvoiceNo;
  if (!file) {
    Reqresponse.printResponse(res, { msg: "Please select a valid file" }, null);
  } else {
    const path = req.file.path;
    // console.log(path);
    var formData = {
      invoice: fs.createReadStream(path),
      from: "AHGROUP_MEMS",
      to: "SN2SNWFXJYHKEC2",
      debug: "true",
    };
    const options = {
      url: "https://edi.junoedge.com/api/invoice",
      method: "POST",
      formData: formData,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from("stocko:3j8cnaGFtjCJoG0zLgEv").toString("base64"),
        "x-api-key": "vGXuMUoRlJUeDN.bUWduge4GhQbgPkm6pfyGxwgEWT0vEkHKBUW",
      },
    };

    let response = promisifiedRequest(req, res, options, InvoiceId, InvoiceNo);
  }
};
const promisifiedRequest = function (req, res, options, InvoiceId, InvoiceNo) {
  request(options, (error, response, body) => {
    body = JSON.parse(body);
    error = JSON.parse(error);
    var payload = {
      authuser: req.body.authuser,
      InvoiceId: InvoiceId,
      InvoiceNo: InvoiceNo,
      EdiStatus: 0, // set default status open=0 //getStatus(body.request_status.status),
      Comments: body.request_status.message,
      EdiResponse: JSON.stringify(body.request_status.as2_ack),
    };
    // console.log(payload);
    EdiModel.create(new EdiModel(payload), (err, data) => {});
    Reqresponse.printResponse(res, error, body);
  });
};

function getStatus(status) {
  var val = 0;
  var ediStatus = Constants.array_ediStatus;
  Object.values(ediStatus).forEach((key, index) => {
    console.log(key, status);
    var keyToLower = key.toLowerCase();
    console.log(keyToLower, status);
    if (keyToLower === status) {
      val = index;
    }
  });
  return val;
}

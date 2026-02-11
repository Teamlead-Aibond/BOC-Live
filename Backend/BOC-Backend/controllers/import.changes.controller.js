/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const { ImportChanges, NonSOImport } = require("../models/import.changes.models");
var XLSX = require('xlsx')
const Reqresponse = require("../helper/request.response.validation.js");
results = [];


exports.RRDateBulkUpdate = (req, res) => {
    const path = req.file.path;
    var wb = XLSX.readFile(path);
    let sheetName = Object.keys(wb.Sheets)[0]
    var RRJSON = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
    results = [];
    RRDateBulkUpdateRecursive(0, RRJSON, (data) => {
        Reqresponse.printResponse(res, null, data);
    });

};


function RRDateBulkUpdateRecursive(i, RRJSON, cb) {
    ImportChanges.RRDateBulkUpdate(RRJSON[i], (err, data) => {
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
        RRDateBulkUpdateRecursive(i, RRJSON, cb);
    });
}


exports.CreateQTSOForPO = (req, res) => {
    const path = req.file.path;
    var wb = XLSX.readFile(path);
    let sheetName = Object.keys(wb.Sheets)[0]
    var JSONObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
    results = [];
    CreateQTSOForPORecursive(0, JSONObj, (data) => {
        Reqresponse.printResponse(res, null, data);
    });

};


function CreateQTSOForPORecursive(i, JSONObj, cb) {
    NonSOImport.CreateQTSOForPO(JSONObj[i], (err, data) => {
        i = i + 1;
        console.log(i, "record processed");
        if (err) {
            var msg = err.message || err.msg || err;
            results.push({ record: i, message: msg });
        } else {
            results.push({ record: i, message: "Success" });
        }

        if (i == JSONObj.length) {
            return cb(results);
        }
        CreateQTSOForPORecursive(i, JSONObj, cb);
    });
}
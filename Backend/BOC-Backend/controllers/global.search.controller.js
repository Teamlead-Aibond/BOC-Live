/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var async = require('async');
const RR = require("../models/repair.request.model.js");
const Vendor = require("../models/vendor.model");
const Customer = require("../models/customers.model");
const SalesOrder = require("../models/sales.order.model");
const SalesOrderItem = require("../models/sales.order.item.model");
const PurchaseOrder = require("../models/purchase.order.model");
const PurchaseOrderItem = require("../models/purchase.order.item.model");
const SalesInvoice = require("../models/invoice.model");
const SalesInvoiceItem = require("../models/invoice.item.model");
const VendorInvoice = require("../models/vendor.invoice.model");
const VendorInvoiceItem = require("../models/vendor.invoice.item.model");
const Reqresponse = require("../helper/request.response.validation.js");
const Invoice = require("../models/invoice.model");
const InvoiceItem = require("../models/invoice.item.model");
const Quotes = require("../models/quotes.model.js");
const MRO = require("../models/mro.model.js");
exports.search = (req, res) => {
    async.parallel([
        function (result) { RR.findInColumns(req.body, result); },
        function (result) { Vendor.findInColumns(req.body, result); },
        function (result) { Customer.findInColumns(req.body, result); },
        function (result) { SalesOrder.findInColumns(req.body, result); },
        function (result) { SalesOrderItem.findInColumns(req.body, result); },
        function (result) { PurchaseOrder.findInColumns(req.body, result); },
        function (result) { PurchaseOrderItem.findInColumns(req.body, result); },
        function (result) { Invoice.findInColumns(req.body, result); },
        function (result) { InvoiceItem.findInColumns(req.body, result); },
        function (result) { SalesInvoice.findInColumns(req.body, result); },
        function (result) { SalesInvoiceItem.findInColumns(req.body, result); },
        function (result) { VendorInvoice.findInColumns(req.body, result); },
        function (result) { VendorInvoiceItem.findInColumns(req.body, result); },
        function (result) { Quotes.findInColumns(req.body, result); },
        function (result) { MRO.findInColumns(req.body, result); },
    ],
        (err, allResults) => {
            if (err) {
                return res.status(500).json({
                    status: "fail",
                    total: {
                        value: 0,
                        relation: "eq"
                    }
                });
            }

            //Filter based on the active tab selection
            if (req.body.active == "all") {
                results = allResults;
            } else {
                results = allResults.filter(a => a.totalCount && a.totalCount._index == req.body.active);
            }

            //Filter null and empty records
            let mappedResults = results.map(res => {
                if (res.data && res.data.length > 0) {
                    return res.data;
                } else {
                    return [];
                }
            });

            //Spread array of arrays in to single array
            let combinedResults = [].concat.apply([], mappedResults).slice(req.body.from, Number(req.body.from) + Number(req.body.size));
            let totalRecords = results.map(a => a.totalCount ? a.totalCount.val : 0).reduce((a, b) => a + b) // Sum of all totalCount

            if (req.body.active != "all") {
                totalRecords = results.filter(a => a.totalCount && a.totalCount._index == req.body.active).map(a => a.totalCount ? a.totalCount.val : 0).reduce((a, b) => a + b)
            }

            // let othersTotal = allResults.filter(a => a.totalCount).map(a => { if (a.totalCount) return a.totalCount; })
            // Filter null/empty records and group others' total 
            let othersTotal = []
            allResults.forEach((o, i) => {
                if (o.totalCount) {
                    let pre = othersTotal.find(a => a._index == o.totalCount._index)
                    if (pre) {
                        othersTotal.find(a => a._index == o.totalCount._index).val += o.totalCount.val
                    } else {
                        othersTotal.push(o.totalCount)
                    }
                }
            })

            //Populating response body
            let resBody = {
                hits: {
                    total: {
                        value: totalRecords,
                        relation: "eq"
                    },
                    groupTotal: {
                        "all": othersTotal.length > 0 ? othersTotal.map(a => a ? a.val : 0).reduce((a, b) => a + b) : 0,
                        "others": othersTotal
                    },
                    hits: combinedResults ? combinedResults.map(r => {
                        return {
                            _index: r._index,
                            _source: r
                        }
                    }) : []
                }
            }
            return res.status(200).json({
                status: "success",
                ...resBody
            });
        })
}
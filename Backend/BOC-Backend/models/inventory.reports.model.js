/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var async = require('async');

const InventoryReportsModel = function (obj) {
  this.RRId = obj.RRId ? obj.RRId : '';
  this.CustomerId = obj.CustomerId ? obj.CustomerId : '';
  this.VendorId = obj.VendorId ? obj.VendorId : '';
  this.FromDate = obj.FromDate ? obj.FromDate : '';
  this.ToDate = obj.ToDate ? obj.ToDate : '';
  this.PartNo = obj.PartNo ? obj.PartNo : '';

  this.CustomerDepartmentId = obj.CustomerDepartmentId ? obj.CustomerDepartmentId : '';
  this.Manufacturer = obj.Manufacturer ? obj.Manufacturer : '';
  this.ManufacturerPartNo = obj.ManufacturerPartNo ? obj.ManufacturerPartNo : '';
  this.SerialNo = obj.SerialNo ? obj.SerialNo : '';
  this.Description = obj.Description ? obj.Description : '';
  this.Status = obj.Status ? obj.Status : '';
  this.CustomerPONo = obj.CustomerPONo ? obj.CustomerPONo : '';
  this.CustomerAssetId = obj.CustomerAssetId ? obj.CustomerAssetId : '';
  this.start = obj.start ? obj.start : 0;
  this.length = obj.length ? obj.length : 0;
  this.search = obj.search ? obj.search : '';
  this.sortCol = obj.sortCol ? obj.sortCol : '';
  this.sortDir = obj.sortDir ? obj.sortDir : '';
  this.sortColName = obj.sortColName ? obj.sortColName : '';
  this.order = obj.order ? obj.order : '';
  this.columns = obj.columns ? obj.columns : '';
  this.draw = obj.draw ? obj.draw : 0;
  this.RRReports = obj.RRReports ? obj.RRReports : '';
};

//Get MinMaxReportByPartNumber
InventoryReportsModel.MinMaxReportByPartNumber = (dtObj, result) => {

  var selectquery = ` SELECT PartNo,MinStock,MaxStock `;
  recordfilterquery = ` Select count(PartId) as recordsFiltered `;
  var query = ` FROM tbl_parts where IsDeleted=0  `;
  if (dtObj.search.value != '') {
    query = query + ` and (  
         PartNo LIKE '%${dtObj.search.value}%'  
         Or MinStock = '${dtObj.search.value}'  
         Or MaxStock = '${dtObj.search.value}'   
        ) `;
  }
  var cvalue = 0;
  for (cvalue = 0; cvalue < dtObj.columns.length; cvalue++) {
    if (dtObj.columns[cvalue].search.value != "") {
      switch (dtObj.columns[cvalue].name) {
        case "PartNo":
          query += " and ( PartNo = '" + dtObj.columns[cvalue].search.value + "' ) ";
          break;
        case "MinStock":
          query += " and ( MinStock = '" + dtObj.columns[cvalue].search.value + "' ) ";
          break;
        case "MaxStock":
          query += " and ( MaxStock = '" + dtObj.columns[cvalue].search.value + "' ) ";
          break;
        default:
          query += " and ( " + dtObj.columns[cvalue].name + " LIKE '%" + dtObj.columns[cvalue].search.value + "%' ) ";
      }
    }
  }
  var i = 0;
  if (dtObj.order.length > 0) { query += " ORDER BY "; }
  for (i = 0; i < dtObj.order.length; i++) {
    if (dtObj.order[i].column != "" || dtObj.order[i].column == "0")// 0 is equal to ""
    {
      switch (dtObj.columns[dtObj.order[i].column].name) {
        case "PartNo":
          query += " PartNo " + dtObj.order[i].dir + " ";
          break;
        case "MinStock":
          query += " MinStock " + dtObj.order[i].dir + " ";
          break;
        case "MaxStock":
          query += " MaxStock " + dtObj.order[i].dir + "  ";
          break;
        default:
          query += " " + dtObj.columns[dtObj.order[i].column].name + " " + dtObj.order[i].dir + " ";
      }
    }
  }
  var Countquery = recordfilterquery + query;
  if (dtObj.start != "-1" && dtObj.length != "-1") {
    query += " LIMIT " + dtObj.start + "," + (dtObj.length);
  }
  query = selectquery + query;
  var TotalCountQuery = `SELECT count(PartId) as TotalCount FROM tbl_parts where IsDeleted=0 `;
  // console.log("query="+query)
  //console.log("Countquery="+Countquery)
  async.parallel([
    function (result) { con.query(query, result) },
    function (result) { con.query(Countquery, result) },
    function (result) { con.query(TotalCountQuery, result) }
  ],
    function (err, results) {
      if (err) return result(err, null);
      return result(null, { data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered, recordsTotal: results[2][0][0].TotalCount, draw: dtObj.draw });
    });
};
module.exports = InventoryReportsModel;
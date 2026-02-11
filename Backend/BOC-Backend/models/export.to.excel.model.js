/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const aws = require("aws-sdk");
const s3 = new aws.S3();
const xlsx = require('xlsx');
const Constants = require("../config/constants.js");
const ExportToExcelModel = function FuncName(objWarranty) {
  this.VendorInvoiceNo = objWarranty.VendorInvoiceNo;
  this.VendorName = objWarranty.VendorName;
  this.GrandTotal = objWarranty.GrandTotal;
  this.RRNo = objWarranty.RRNo;
  this.CustomerInvoiceAmount = objWarranty.CustomerInvoiceAmount;
  this.CustomerInvoiceNo = objWarranty.CustomerInvoiceNo;

  this.ReferenceNo = objWarranty.ReferenceNo;
  this.Status = objWarranty.Status;
};

//To ExportToExcel
ExportToExcelModel.ExportToExcel = (result) => {

  var sql = ``;
  sql = ` SELECT VendorInvoiceNo,VendorName,
GrandTotal,RRNo,CustomerInvoiceAmount,CustomerInvoiceNo,ReferenceNo,CASE Status 
WHEN 0 THEN '${Constants.array_vendor_invoice_status[0]}'
WHEN 1 THEN '${Constants.array_vendor_invoice_status[1]}'
WHEN 2 THEN '${Constants.array_vendor_invoice_status[2]}' 
WHEN 3 THEN '${Constants.array_vendor_invoice_status[3]}' 
WHEN 4 THEN '${Constants.array_vendor_invoice_status[4]}'
WHEN 5 THEN '${Constants.array_vendor_invoice_status[5]}'
ELSE '-'	end Status
FROM tbl_vendor_invoice where IsDeleted=0 `;

  con.query(sql, (err, vendorinvoice) => {
    if (err) {
      // console.log("error: ", err);
      return result(err, null);
    }
    const jsonData = JSON.parse(JSON.stringify(vendorinvoice));

    // initiate the workbook
    const wb = xlsx.utils.book_new();

    // add properties to the sheet
    wb.Props = {
      Title: 'VendorInvoice',
      Subject: 'VendorInvoice',
      Author: 'Admin',
      CreatedDate: '2021-01-07',
    };

    // add a sheet
    wb.SheetNames.push('VendorInvoice');

    var arraylist = [
      ['Vendor Invoice #', 'Vendor Name', 'Vendor Invoice Total', 'RR #', 'Customer Invoice Total', 'Customer Invoice #', 'Reference #', 'Status']
    ];

    // console.log("arraylist[0][0]="+arraylist[0][0]);
    // console.log("arraylist[0][3]="+arraylist[0][3]);

    for (var i = 0; i < jsonData.length; i++) {
      var obj = jsonData[i];
      var temparray = [];
      for (var key in obj) {
        var value = obj[key];
        temparray.push(value);
      }
      arraylist.push(temparray);
    }

    const ws = xlsx.utils.aoa_to_sheet(arraylist);
    wb.Sheets.VendorInvoice = ws;

    // generate output as buffer
    const wbOut = xlsx.write(wb, {
      bookType: 'xlsx',
      type: 'buffer',
    });
    // Setting up S3 upload parameters
    const params = {
      ACL: "public-read",
      s3,
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'vendor/invoice/vendorinvoiceNew3.xlsx', // File name you want to save as in S3
      Body: wbOut,
      ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    // upload to S3
    s3.upload(params, function (err1, data) {
      if (err1) {
        return result(err1, null);
      }
      // console.log(`File uploaded successfully. ${data.Location}`);
      return result(null, { Url: data.Location });
    });
  });
};
module.exports = ExportToExcelModel;


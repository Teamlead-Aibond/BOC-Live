/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Customers = require("../models/customers.model.js");
const CustomersAddress = require("../models/customeraddress.model.js");
const CustomerUsers = require("../models/customerusers.model.js");
const CVAttachmentModel = require("../models/attachment.model.js");
const CReferenceLabel = require("../models/cutomer.reference.labels.model.js");
const RR = require("../models/repair.request.model.js");
const SO = require("../models/sales.order.model.js");
const UserModel = require("../models/users.model.js");
const Constants = require("../config/constants.js");
const Reqresponse = require("../helper/request.response.validation.js");
const { request } = require("express");
var async = require('async');
const con = require("../helper/db.js");
const Invoice = require("../models/invoice.model.js");
//To create a customer
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    Customers.checkDuplicateCustomer(req.body.CompanyName, req.body.CustomerCode, 0, (duplicateErr, duplicateData) => {
      // console.log(duplicateData);
      if (duplicateData && duplicateData.length == 0) {
        UserModel.IsExistUserName(req.body.Username, 0, (err, data1) => {
          if (data1.length == 0) {
            Customers.create(new Customers(req.body), (err, data) => {
              if (err) Reqresponse.printResponse(res, err, null);
              req.body.IdentityId = data.id;


              let contactAddress = req.body.AddressList.find(a => a.IsContactAddress == "1");
              UserObj = new UserModel(req.body);
              UserObj.Address1 = contactAddress.StreetAddress;
              UserObj.Address2 = contactAddress.SuiteOrApt;
              UserObj.CountryId = contactAddress.CountryId;
              UserObj.StateId = contactAddress.StateId;
              UserObj.City = contactAddress.City;
              UserObj.Zip = contactAddress.Zip;
              UserObj.PhoneNo = contactAddress.PhoneNoPrimary;
              UserObj.Fax = contactAddress.Fax;
              UserObj.MultipleAccessIdentityIds = req.body.IdentityId;

              async.parallel([
                // function (result) { Customers.updateCustomerCode(data.id, result); },
                function (result) { if (req.body.hasOwnProperty('AddressList')) { CustomersAddress.create(req.body, result); } },
                function (result) { CustomerUsers.createCustomerUsers(new CustomerUsers(req.body), result); },
                function (result) { if (req.body.hasOwnProperty('AttachmentList') && req.body.AttachmentList.AttachmentList.length > 0) { CVAttachmentModel.Create(new CVAttachmentModel(req.body), result); } },
                function (result) { if (req.body.hasOwnProperty('CReferenceList')) { CReferenceLabel.create(req.body, result); } },
                function (result) { UserModel.CreateUserWhenAddCustomerAndVendor(Constants.CONST_IDENTITY_TYPE_CUSTOMER, data.id, UserObj, result); }
              ],
                function (err, results) {
                  if (err) {
                    Reqresponse.printResponse(res, err, null)
                  }
                });
              Reqresponse.printResponse(res, null, data);

            });
          }
          else {
            Reqresponse.printResponse(res, { msg: "Username is already exist" }, null);
          }
        });
      }else{
        Reqresponse.printResponse(res, { msg: "Customer name/code is already exist" }, null);
      }
    });
  }
};

//To update the customer info
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  Customers.checkDuplicateCustomer(req.body.CompanyName, req.body.CustomerCode, req.body.CustomerId, (duplicateErr, duplicateData) => {
    if (duplicateData && duplicateData.length == 0) {
      Customers.checkUpdateAvailable(new Customers(req.body), (errCheck, dataCheck) => {
        if (errCheck) {
          Reqresponse.printResponse(res, err, null);
        }
        console.log(dataCheck.TotalCount);
        if (dataCheck.TotalCount == 0) {
          if (boolean) {
            async.parallel([
              function (result) { Customers.updateById(new Customers(req.body), result); },
              function (result) { CustomerUsers.updateCustomerUsers(req.body, result); },
            ],
              function (err, results) {
                if (err) {
                  Reqresponse.printResponse(res, err, null);
                }
                Reqresponse.printResponse(res, err, { data: results[0][0] });
              }
            );
          }
        } else {
          Reqresponse.printResponse(res, { msg: "You can't change the currency, Because it's already in use." }, null);
        }
      });
    } else {
      Reqresponse.printResponse(res, { msg: "Customer name/code is already exist" }, null);
    }
  });

};

//To list all the active customers
exports.getAllActive = (req, res) => {
  Customers.getAllActive(new Customers(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To list all the active customers with search
exports.getAllAutoComplete = (req, res) => {
  Customers.getAllAutoComplete(new Customers(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};



//To view the customer info
exports.findOne = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    Customers.findById(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

//To find the customer statistics  on the lsit page
exports.statistics = (req, res) => {
  Customers.Statistics(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To view the Customer statistics on view page
exports.viewStatistics = (req, res) => {


  Customers.getViewStatistics(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });


  /*async.parallel([  
    function (result) {  Customers.getViewStatistics(req.body,result); },
    function (result) {  Invoice.getCustomerInvoiceStatstics(req.body, result ); } ,
    ], 
    function (err, results) { 

        if (err)
        {
          Reqresponse.printResponse(res, err,null); 
        } 
       
        Reqresponse.printResponse(res, err, {statsData:results[0], invoiceStats:results[1]});  
      }
  ); */



};


//To delete the customer
exports.delete = (req, res) => {
  Customers.remove(req.body.CustomerId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To get the auto generated customer code
exports.GetCustomerCode = (req, res) => {
  Customers.GetCustomerCode((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// Get server side list
exports.getCustomerListByServerSide = (req, res) => {
  Customers.getCustomerListByServerSide(new Customers(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.getCustomerCurrencyExchange = (req, res) => {
  if (req.body.hasOwnProperty('CustomerId')) {
    Customers.getCustomerCurrencyExchange(req.body.CustomerId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Customer Id is required" }, null);
  }
};


//To list the csutomer RR List
exports.CustomerRRListByServerSide = (req, res) => {
  if (req.body.hasOwnProperty('CustomerId')) {
    RR.CustomerRRListByServerSide(new RR(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Customer Id is required" }, null);
  }
};

//To list the csutomer SO List
exports.CustomerSOListByServerSide = (req, res) => {
  if (req.body.hasOwnProperty('CustomerId')) {
    SO.CustomerSOListByServerSide(new SO(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Customer Id is required" }, null);
  }
};
//To Get ExportToExcel
exports.ExportToExcel = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var Ids = ``;
    for (let val of req.body.Customer) {
      Ids += val.CustomerId + `,`;
    }
    var CustomerIds = Ids.slice(0, -1);

    if (req.body.hasOwnProperty('Status') == false)
      req.body.Status = '';
    if (req.body.hasOwnProperty('IsCSVProcessed') == false)
      req.body.IsCSVProcessed = '';

    var sqlArray = Customers.ExportToExcel(req.body, CustomerIds);
    if (req.body.hasOwnProperty('DownloadType') == true && req.body.DownloadType == "CSV") {
      async.parallel([
        function (result) { con.query(sqlArray[0].sqlExcel, result) },
        function (result) { con.query(sqlArray[0].sqlUpdateIsCSVProcessed, result) },
      ],
        function (err, results) {
          if (err)
            Reqresponse.printResponse(res, err, null);
          else
            Reqresponse.printResponse(res, err, { ExcelData: results[0][0] });
        });
    }
    else {
      con.query(sqlArray[0].sqlExcel, (err, Eres) => {
        if (err)
          Reqresponse.printResponse(res, err, null);
        else
          Reqresponse.printResponse(res, err, { ExcelData: Eres });
      });
    }
  }
};

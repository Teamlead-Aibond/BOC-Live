/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const VendorModel = require("../models/vendor.model.js");
const Address = require("../models/customeraddress.model.js");
const ContactModel = require("../models/contact.model.js");
const CVAttachmentModel = require("../models/attachment.model.js");
const VendorInvoiceModel = require("../models/vendor.invoice.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const RR = require("../models/repair.request.model.js");
const POMOdel = require("../models/purchase.order.model.js");
const UserModel = require("../models/users.model.js");
const Constants = require("../config/constants.js");
var async = require('async');
const con = require("../helper/db.js");
//To create a new vendor
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    VendorModel.checkDuplicateVendor(req.body.VendorName, req.body.VendorCode, 0, (duplicateErr, duplicateData) => {
    if (duplicateData && duplicateData.length == 0) {
      UserModel.IsExistUserName(req.body.Username, 0, (err, data1) => {
        if (data1.length == 0) {
          VendorModel.create(new VendorModel(req.body), (err, data) => {
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
              // function (result) { VendorModel.updateVendorCode(data.id, result); },
              function (result) { if (req.body.hasOwnProperty('AddressList')) { Address.create(new Address(req.body), result); } },
              function (result) { if (req.body.hasOwnProperty('ContactList')) { ContactModel.create(req.body, result); } },
              function (result) { if (req.body.hasOwnProperty('AttachmentList') && req.body.AttachmentList.AttachmentList.length > 0) { CVAttachmentModel.Create(new CVAttachmentModel(req.body), result); } },
              function (result) { UserModel.CreateUserWhenAddCustomerAndVendor(Constants.CONST_IDENTITY_TYPE_VENDOR, data.id, UserObj, result); },
              function (result) { VendorModel.UpdateIsCorpVendorCode(data.id, result); },
            ],
              function (err, results) {
                if (err) Reqresponse.printResponse(res, err, null);
              }
            );
            Reqresponse.printResponse(res, err, data);
          });
        }
        else {
          Reqresponse.printResponse(res, { msg: "User name is Already Exist" }, null);
        }
      });
    }else{
      Reqresponse.printResponse(res, { msg: "Vendor name/code is already exist" }, null);
    }
    });
  }
};

//To view the vendor info
exports.findOne = (req, res) => {
  VendorModel.findById(req.body.VendorId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To get the vendor info
exports.getAll = (req, res) => {
  VendorModel.getAll((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To get all the vendor info for select box dropdown
exports.getAllActive = (req, res) => {
  VendorModel.getAllActive((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.getAllAutoComplete = (req, res) => {
  VendorModel.getAllAutoComplete(req.body.Vendor, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.getAllAutoCompleteMRO = (req, res) => {
  VendorModel.getAllAutoCompleteMRO(req.body.Vendor, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


//To get all the vendor with filter
exports.getAllWithFilter = (req, res) => {
  VendorModel.getAllWithFilter(new VendorModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To update a vendor
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  VendorModel.checkDuplicateVendor(req.body.VendorName, req.body.VendorCode, req.body.VendorId, (duplicateErr, duplicateData) => {
  if (duplicateData && duplicateData.length == 0) {
    VendorModel.checkUpdateAvailable(new VendorModel(req.body), (errCheck, dataCheck) => {
      if (errCheck) {
        Reqresponse.printResponse(res, err, null);
      }
     // console.log(dataCheck.TotalCount);
      if (dataCheck.TotalCount == 0) {
        if (boolean) {
          req.body.IdentityId = req.body.VendorId;
          async.parallel([
            function (result) { VendorModel.updateById(new VendorModel(req.body), result); },
            //function (result) {  if(req.body.hasOwnProperty('AddressList')) { Address.updateById(new Address(req.body), result ); } },         

          ],
            function (err, results) {
              if (err) Reqresponse.printResponse(res, err, null);
              Reqresponse.printResponse(res, err, results[0]);
            }
          );

        }
      } else {
        Reqresponse.printResponse(res, { msg: "You can't change the currency, Because it's already in use." }, null);
      }
    });
  }else{
    Reqresponse.printResponse(res, { msg: "Vendor name/code is already exist" }, null);
  }
  });

};

//To delete the vendor
exports.delete = (req, res) => {
  VendorModel.remove(req.body.VendorId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To get the vendor code
exports.GetVendorCode = (req, res) => {
  VendorModel.GetVendorCode((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To get the vendor list page statistics
exports.getVendorStatics = (req, res) => {
  VendorModel.getVendorStatics(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To get the vendor view page statistics
exports.getViewStatistics = (req, res) => {
  VendorModel.getViewStatistics(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// Get server side list 
exports.getVendorListByServerSide = (req, res) => {
  VendorModel.getVendorListByServerSide(new VendorModel(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//To get all the RR list of the particular vendor
exports.VendorRRListByServerSide = (req, res) => {
  if (req.body.hasOwnProperty('VendorId')) {
    RR.VendorRRListByServerSide(new RR(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Vendor Id is required" }, null);
  }
};

//To get all the PO list of the particular vendor
exports.VendorPOListByServerSide = (req, res) => {
  if (req.body.hasOwnProperty('VendorId')) {
    POMOdel.VendorPOListByServerSide(new POMOdel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Vendor Id is required" }, null);
  }
};

//To get all the manufacturer list
exports.GetManufacturerList = (req, res) => {
  VendorModel.GetManufacturerList((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.GetManufacturerListWithChecked = (req, res) => {
  VendorModel.GetManufacturerListWithChecked((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.ManufacturerAutoSuggest = (req, res) => {
  if (req.body.hasOwnProperty('Manufacturer')) {
    VendorModel.ManufacturerAutoSuggest(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Manufacturer is required" }, null);
  }
};

//To get all the RevenueInvoiceReport list
exports.RevenueChartReport = (req, res) => {
  if (req.body.hasOwnProperty('VendorId')) {
    VendorInvoiceModel.RevenueChartReport(req.body.VendorId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Vendor Id is required" }, null);
  }
};
//To Preferred Vendor List
exports.PreferredVendorList = (req, res) => {
  if (req.body.hasOwnProperty('PartId')) {
    VendorModel.PreferredVendorList(req.body.PartId, 0, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Part Id is required" }, null);
  }
};
//To Get ExportToExcel
exports.ExportToExcel = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    var Ids = ``;
    for (let val of req.body.Vendor) {
      Ids += val.VendorId + `,`;
    }
    var VendorIds = Ids.slice(0, -1);
    if (req.body.hasOwnProperty('Status') == false)
      req.body.Status = '';
    if (req.body.hasOwnProperty('IsCSVProcessed') == false)
      req.body.IsCSVProcessed = '';

    var sqlArray = VendorModel.ExportToExcel(req.body, VendorIds);
    // if (req.body.IsCSVProcessed == '')
    //   req.body.IsCSVProcessed = "0";

    if (req.body.hasOwnProperty('DownloadType') == true && req.body.DownloadType == "CSV") {
      async.parallel([
        function (result) { con.query(sqlArray[0].sqlExcel, result) },
        function (result) { con.query(sqlArray[0].sqlUpdateIsCSVProcessed, result) },
        //  function (result) { if (req.body.IsCSVProcessed == "0") { VendorModel.UpdateIsCSVProcessed(VendorIds, result); } else { RR.emptyFunction(req.body, result); } },
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








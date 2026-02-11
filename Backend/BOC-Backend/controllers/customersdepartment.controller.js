/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const CustomersDepartmentModel = require("../models/customersdepartment.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

//To list 
exports.list = (req, res) => {
  if (req.body.hasOwnProperty('CustomerId')) {
    CustomersDepartmentModel.list(req.body.CustomerId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "Customer Id is required" }, null);
  }
};

//To add a customer department
exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    CustomersDepartmentModel.IsExistCustomerDepartment(new CustomersDepartmentModel(req.body.CustomerDepartmentList[0]), req.body.IdentityId, (err, data1) => {
      if (data1.length > 0) {
        Reqresponse.printResponse(res, { msg: "Record Already Exist" }, null);
      }
      else {
        CustomersDepartmentModel.create(req.body, (err, data) => {
          Reqresponse.printResponse(res, err, data);
        });
      }
    });
  }
};

//To update the customer department
exports.update = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    CustomersDepartmentModel.IsExistCustomerDepartment(new CustomersDepartmentModel(req.body.CustomerDepartmentList[0]), req.body.IdentityId, (err, data1) => {
      if (data1.length > 0) {
        Reqresponse.printResponse(res, { msg: "Record Already Exist" }, null);
      }
      else {
        CustomersDepartmentModel.updateById(req.body, (err, data) => {
          Reqresponse.printResponse(res, err, data);
        });
      }
    });

  }
};

//To delete the customer department   
exports.delete = (req, res) => {
  if (req.body.hasOwnProperty('CustomerDepartmentId')) {
    CustomersDepartmentModel.remove(req.body.CustomerDepartmentId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    ReqRes.printResponse(res, { msg: "Customer Department Id is required" }, null);
  }
};
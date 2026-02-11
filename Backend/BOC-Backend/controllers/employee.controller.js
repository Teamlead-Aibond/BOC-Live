/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Employee = require("../models/employee.module.js");
const ReqRes = require("../helper/request.response.validation.js");
const Constants = require("../config/constants.js");
const Reqresponse = require("../helper/request.response.validation.js");
var async = require('async');

exports.EmployeeListByServerSide = (req, res) => {
    Employee.EmployeeListByServerSide(new Employee(req.body), (err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.employeeList = (req, res) => {
    Employee.employeeList((err, data) => {
        ReqRes.printResponse(res, err, data);
    });
};

exports.getEmployeeNo = (req, res) => {
    if (req.body.hasOwnProperty('EmployeeRFIDTagNo')) {
        Employee.getEmployeeNo(req.body.EmployeeRFIDTagNo, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "EmployeeRFIDTagNo is required" }, null);
    }
};

exports.Delete = (req, res) => {
    Employee.Delete(req.body.EmployeeId, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
exports.Create = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        Employee.Create(new Employee(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });

    }
};


exports.findOne = (req, res) => {
    if (req.body.hasOwnProperty('EmployeeId')) {
        Employee.findById(req.body.EmployeeId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "EmployeeId Id is required" }, null);
    }
};

exports.UpdateById = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        Employee.UpdateById(new Employee(req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};

exports.getAllResponsibilityDDL = (req,res)=>{
    Employee.getAllResponsibilityDDL((err,data)=>{    
    ReqRes.printResponse(res,err,data);  
    });
};


exports.DeleteResponsibility = (req, res) => {
    Employee.DeleteResponsibility(req.body.EmployeeResponsibilityId, (err, data) => {
        Reqresponse.printResponse(res, err, data);
    });
};
exports.CreateResponsibility = (req, res) => {
    var boolean = ReqRes.validateReqBody(req, res);
    if (boolean) {
        Employee.CreateResponsibility((req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });

    }
};


exports.findOneResponsibility = (req, res) => {
    if (req.body.hasOwnProperty('EmployeeResponsibilityId')) {
        Employee.findByIdResponsibility(req.body.EmployeeResponsibilityId, (err, data) => {
            ReqRes.printResponse(res, err, data);
        });
    } else {
        ReqRes.printResponse(res, { msg: "EmployeeResponsibility Id is required" }, null);
    }
};

exports.UpdateByIdResponsibility = (req, res) => {
    var boolean = Reqresponse.validateReqBody(req, res);
    if (boolean) {
        Employee.UpdateByIdResponsibility((req.body), (err, data) => {
            Reqresponse.printResponse(res, err, data);
        });
    }
};

exports.getAllResponsibility = (req,res)=>{
    Employee.getAllResponsibility((err,data)=>{    
    ReqRes.printResponse(res,err,data);  
    });
};


















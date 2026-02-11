/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const InventoryModel = require("../models/inventory.model.js");
const Reqresponse = require("../helper/request.response.validation.js");
const InventoryLossPreventionLogModel = require("../models/inventory.lossprevention.log.model.js");
const SettingsGeneralModel = require("../models/settings.general.model.js");
const InventoryStockoutModel = require("../models/inventory.stockout.model.js");
var async = require('async');
const SendEmailModel = require("../models/send.email.model.js");

exports.InventoryListByServerSide = (req, res) => {
  InventoryModel.InventoryListByServerSide(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//Inventory Dashboard Statistics Count
exports.InventoryDashboardStatisticsCount = (req, res) => {
  if (req.body.hasOwnProperty('FromDate') && req.body.hasOwnProperty('ToDate')) {
    InventoryModel.DashboardStatisticsCount(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "FromDate or ToDate is required" }, null);
  }
};

//Inventory Dashboard Statistics V1
exports.RFIDDashboardV1Statistics = (req, res) => {
  InventoryModel.RFIDDashboardV1Statistics(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//RFID Dashboard Statistics Count
exports.RFIDDashboardStatisticsCount = (req, res) => {
  if (req.body.hasOwnProperty('FromDate') && req.body.hasOwnProperty('ToDate')) {
    InventoryModel.RFIDDashboardStatisticsCount(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "FromDate or ToDate is required" }, null);
  }
};
//Latest StockIn StockOut List
exports.LatestStockInStockOutList = (req, res) => {
  InventoryModel.LatestStockInStockOutList(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
//LineChartDayWise
exports.LineChartDayWise = (req, res) => {
  if (req.body.hasOwnProperty('FromDate') && req.body.hasOwnProperty('ToDate')) {
    InventoryModel.LineChartDayWise(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  } else {
    Reqresponse.printResponse(res, { msg: "FromDate or ToDate is required" }, null);
  }
};

//Inventory Dashboard Statistics Count
exports.DashboardSummaryStatisticsCount = (req, res) => {

  InventoryModel.DashboardSummaryStatisticsCount(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });

};

//Inventory Loss Prvention Control
exports.createLossPreventionLog = (req, res) => {

  InventoryLossPreventionLogModel.create(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

//PartItemCountByManufacturer
exports.PartItemCountByManufacturer = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    InventoryModel.PartItemCountByManufacturer(req.body, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};
//Update Inventory Settings
exports.UpdateInventorySettings = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    SettingsGeneralModel.UpdateInventorySettings(new SettingsGeneralModel(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, req.body);
    });
  }
};
//For AutoCheckout 
exports.AutoCheckout = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    req.body.forEach(element => {
      /* TempRFIDModel.create(new TempRFIDModel(element), (err, data) => {
          itemProcessed++;
          if(itemProcessed === req.body.length){
              TempRFIDModel.getAll((err1, data1) => {
                  ReqRes.printResponse(res, err1, data1);
              })
          }
      }); */
      InventoryModel.IsExistRFIDTagNo(element.RFIDTagNo, (err, data) => {
        if (!data) {
          Reqresponse.printResponse(res, { msg: "Oops..Something went wrong" }, null);
        }
        if (data.length > 0) {
  
          InventoryStockoutModel.IsExistRFIDTagNoStockOut(element.RFIDTagNo, (errDuplicate, dataDuplicate) => {
  
            if (dataDuplicate.length > 0) {
              Reqresponse.printResponse(res, { msg: "Tag already checked out from inventory" }, null);
            } else {
              data[0].Status = 1;
              var Obj = data[0];
              Obj.ReadyAntennaTime = element.ReadyAntennaTime ? element.ReadyAntennaTime : '';
              Obj.AcceptAntennaTime = element.AcceptAntennaTime ? element.AcceptAntennaTime : '';
              Obj.RFIDEmployeeNo = element.RFIDEmployeeNo ? element.RFIDEmployeeNo : '';
              Obj.StockOutRecord = element.StockOutRecord ? element.StockOutRecord : '';
              var Status = "OUT";
              async.parallel([
                function (result) { InventoryStockoutModel.createsinglerow(new InventoryStockoutModel(Obj), result); },
                function (result) { InventoryModel.UpdateInventoryStatustoOUT(Status, Obj.InventoryId, result); },
                function (result) { SendEmailModel.SendInventoryEmail(element.RFIDTagNo, result); },
              ],
                function (err, results) {
                  if (err) {
                    Reqresponse.printResponse(res, err, null);
                  } else {
                    Reqresponse.printResponse(res, null, { data: element });
                  }
                });
            }
  
          });
  
        } else {
          Reqresponse.printResponse(res, { msg: "Tag / Location does not exists in inventory" }, null);
        }
      });
  });
    
  }
};

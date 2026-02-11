/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const RepairRequestNotes = require("../models/repair.request.notes.model.js");
const Reqresponse = require("../helper/request.response.validation.js");

exports.create = (req, res) => {
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RepairRequestNotes.create(new RepairRequestNotes(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.getAll = (req, res) => {
  RepairRequestNotes.getAll((err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


exports.getRRStatistics = (req, res) => {
  RepairRequestNotes.getRRStatistics(req.body, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};



//
exports.findOne = (req, res) => {
  RepairRequestNotes.findById(req.body.NotesId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};


exports.update = (req, res) => {

  // Validate Request
  var boolean = Reqresponse.validateReqBody(req, res);
  if (boolean) {
    RepairRequestNotes.updateById(new RepairRequestNotes(req.body), (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }
};

exports.delete = (req, res) => {
  RepairRequestNotes.remove(req.body.NotesId, (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

// Get server side list
exports.getRRListByServerSide = (req, res) => {
  RepairRequestNotes.getRRListByServerSide(new RepairRequestNotes(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};
exports.getRRListByServerSideBasic = (req, res) => {
  RepairRequestNotes.getRRListByServerSideBasic(new RepairRequestNotes(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
};

exports.getRRMyWorksListByServerSide = (req, res) => {
  RepairRequestNotes.getRRMyWorksListByServerSide(new RepairRequestNotes(req.body), (err, data) => {
    Reqresponse.printResponse(res, err, data);
  });
}; 

exports.getRRPrice = (req, res) => {
  if(req.body.hasOwnProperty('RRId')) { 
    RepairRequestNotes.getRRPrice(req.body.RRId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }else{
    Reqresponse.printResponse(res,{msg:"RR Id is required"},null);
  }
}; 

exports.getRRCustomerReference = (req, res) => {
  if(req.body.hasOwnProperty('RRId')) { 
    RepairRequestNotes.getRRCustomerReference(req.body.RRId, (err, data) => {
      Reqresponse.printResponse(res, err, data);
    });
  }else{
    Reqresponse.printResponse(res,{msg:"RR Id is required"},null);
  }
}; 
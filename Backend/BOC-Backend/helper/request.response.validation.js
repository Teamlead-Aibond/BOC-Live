/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
//To validate the request body
exports.validateReqBody = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.send({
      status: false,
      message: "Content can not be empty!"
    });
    return false;
  }
  return true;
}

//To validate the request Params
exports.validateReqParams = (req, res) => {
  if (Object.keys(req.params).length === 0) {
    res.send({
      status: false,
      message: "Request parameter can not be empty!"
    });
    return false;
  }
  return true;
}

//To print the output 
exports.printResponse = (res, err, data) => {
  if (data && typeof data === "object" && typeof data.authuser !== 'undefined') {
    //console.log(" data.authuser = " + data.authuser)
    data.authuser = {};
  }
  if (err) {
    res.send({
      status: false,
      message: err.message || err.msg || err
    });
  } else {
    res.send({
      status: true,
      message: 'Success',
      responseData: data
    });
  }
}



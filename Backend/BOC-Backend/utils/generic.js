/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Constants = require("../config/constants.js");
exports.getDateTime = function () {

  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  // prints date in YYYY-MM-DD format
  // console.log(year + "-" + month + "-" + date);

  var DateNow = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
  // prints date & time in YYYY-MM-DD HH:MM:SS format
  //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

  return DateNow;
};


exports.getDate = function () {
  let date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);
  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  let year = date_ob.getFullYear();
  var DateNow = (year + "-" + month + "-" + date);
  return DateNow;
};


exports.addMonthToCurrentDate = function (monthvalue) {
  let current = new Date();

  let date_ob = new Date(current.setMonth(current.getMonth() + parseInt(monthvalue)));
  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);
  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  let year = date_ob.getFullYear();


  var DateNow = (year + "-" + month + "-" + date);
  return DateNow;
};

exports.generateOTP = function () {
  var digits = '0123456789';

  var otpLength = 4;

  var otp = '';

  for (let i = 1; i <= otpLength; i++) {

    var index = Math.floor(Math.random() * (digits.length));

    otp = otp + digits[index];

  }

  return otp;
};


exports.getDueDate = function () {

  let date_ob = new Date();
  date_ob.setDate(date_ob.getDate() + Constants.CONST_DUE_DAYS);
  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();



  // prints date in YYYY-MM-DD format
  // console.log(year + "-" + month + "-" + date);

  var DueDate = (year + "-" + month + "-" + date);


  return DueDate;
};

exports.getDateTimeAddMin= function (min) {

  let date_ob_pre = new Date();

  let date_ob = new Date(date_ob_pre.getTime() + min*60000);

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  // prints date in YYYY-MM-DD format
  // console.log(year + "-" + month + "-" + date);

  var DateNow = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
  // prints date & time in YYYY-MM-DD HH:MM:SS format
  //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

  return DateNow;
}

exports.getDateTimeSubMin= function (min) {

  let date_ob_pre = new Date();

  let date_ob = new Date(date_ob_pre.getTime() - min*60000);

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  // let hours = date_ob.getHours();
  let hours = ("0" + date_ob.getHours()).slice(-2);
  
  // current minutes
  // let minutes = date_ob.getMinutes();
  let minutes = ("0" + date_ob.getMinutes()).slice(-2);

  // current seconds
  // let seconds = date_ob.getSeconds();
  let seconds = ("0" + date_ob.getSeconds()).slice(-2);

  // prints date in YYYY-MM-DD format
  // console.log(year + "-" + month + "-" + date);

  var DateNow = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
  // prints date & time in YYYY-MM-DD HH:MM:SS format
  //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

  return DateNow;
}
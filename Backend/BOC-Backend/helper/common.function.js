/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

module.exports.spliturl = (reqUrl, res) => {
  //console.log(" reqUrl="+reqUrl);
  // var url="";
  // url = reqUrl.split('public/');
  //res=url[1];
  //console.log("Res FileUrl="+res);
  return reqUrl;
}

module.exports.escapeSqlValues = (obj) => {
  if (typeof obj === "string") {
    var rdata = obj.replace(/\\/g, "");
    var rd = rdata.replace(/'/g, "\\'");
    return rd.replace(/"/g, '\\"');
    // return rdata.replace(/'/g, "\\'");
    // return obj.replace(/'/g, "\\'");
  }
  if (typeof obj === "object" && obj) {
    Object.keys(obj).forEach(k => {
      if (typeof obj[k] === "string") {
        var rdata = obj[k].replace(/\\/g, "");
        var rd = rdata.replace(/'/g, "\\'");
        obj[k] = rd.replace(/"/g, '\\"');
        // obj[k] = obj[k].replace(/'/g, "\\'");
      } else if (typeof obj[k] === "object") {
        this.escapeSqlValues(obj[k]);
      }
    });
  }
  return obj;
}

module.exports.getWeekendCountBetweenDates = (startDate, endDate) => {
  var totalWeekends = 0;
  for (var i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
    if (i.getDay() == 0 || i.getDay() == 1) totalWeekends++;
  }
  return totalWeekends;
}

module.exports.getLogInUserId = (req) => {
  const TokenGlobalUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  return (req && req.authuser && req.authuser.UserId) ? req.authuser.UserId : TokenGlobalUserId;
}
module.exports.getLogInIdentityId = (req) => {
  const TokenGlobalIdentityId = global.authuser.IdentityId ? global.authuser.IdentityId : 0;
  return (req && req.authuser && req.authuser.IdentityId) ? req.authuser.IdentityId : TokenGlobalIdentityId;
}
module.exports.getLogInIdentityType = (req) => {
  const TokenGlobalIdentityType = global.authuser && global.authuser.IdentityType ? global.authuser.IdentityType : 0;
  return (req && req.authuser && req.authuser.IdentityType) ? req.authuser.IdentityType : TokenGlobalIdentityType;
}
module.exports.getLogInIsRestrictedCustomerAccess = (req) => {
  const TokenIsRestrictedCustomerAccess = global.authuser && global.authuser.IsRestrictedCustomerAccess ? global.authuser.IsRestrictedCustomerAccess : 0;
  return (req && req.authuser && req.authuser.IsRestrictedCustomerAccess) ? req.authuser.IsRestrictedCustomerAccess : TokenIsRestrictedCustomerAccess;
}
module.exports.getLogInMultipleCustomerIds = (req) => {
  // console.log(req.authuser);
  const TokenMultipleCustomerIds = global.authuser && global.authuser.MultipleCustomerIds ? global.authuser.MultipleCustomerIds : 0;
  return (req && req.authuser && req.authuser.MultipleCustomerIds) ? req.authuser.MultipleCustomerIds : TokenMultipleCustomerIds;
}
module.exports.getLogInMultipleAccessIdentityIds = (req) => {
  const TokenMultipleAccessIdentityIds = global.authuser && global.authuser.MultipleAccessIdentityIds ? global.authuser.MultipleAccessIdentityIds : 0;
  return (req && req.authuser && req.authuser.MultipleAccessIdentityIds) ? req.authuser.MultipleAccessIdentityIds : TokenMultipleAccessIdentityIds;
}

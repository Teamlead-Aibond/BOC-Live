/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
var request = require('request');
const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: process.env.S3_REGION
});

const UPS = function (objUPS) {

  this.UPSShippingId = objUPS.UPSShippingId;
  this.ShippingHistoryId = objUPS.ShippingHistoryId;
  this.UPSTrackingNo = objUPS.UPSTrackingNo;
  this.TransportationCharges = objUPS.TransportationCharges;
  this.ServiceOptionsCharges = objUPS.ServiceOptionsCharges;
  this.OverallTotalCharges = objUPS.OverallTotalCharges;

  this.BillingWeightCode = objUPS.BillingWeightCode;
  this.BillingWeight = objUPS.BillingWeight;

  this.UPSStatus = objUPS.UPSStatus;
  this.UPSShippingLabel = objUPS.UPSShippingLabel;

  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objUPS.authuser && objUPS.authuser.UserId) ? objUPS.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objUPS.authuser && objUPS.authuser.UserId) ? objUPS.authuser.UserId : TokenUserId;

};

UPS.create = (UPS, result) => {
  var shippingLabel = 'data:image/gif;base64,' + UPS.UPSShippingLabel;
  const s3 = new aws.S3();
  const base64Data = new Buffer.from(shippingLabel.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  const type = shippingLabel.split(';')[0].split('/')[1];
  let location = 'ups/label/';
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${location + Date.now() + "-" + UPS.UPSTrackingNo}.${type}`, // type is not required
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64', // required
    ContentType: `image/${type}`, // required. Notice the back ticks

  }
  s3.upload(params, function (err, data) {
    if (err) {
      result(err, null);
      return;
    } else {
      var sql = `insert into tbl_repair_request_shipping_ups(ShippingHistoryId,UPSTrackingNo,TransportationCharges,ServiceOptionsCharges,OverallTotalCharges,BillingWeightCode,BillingWeight,UPSStatus,UPSShippingLabel,Created,CreatedBy)
    values(?,?,?,?,?,?,?,?,?,?,?)`;

      var values = [
        UPS.ShippingHistoryId, UPS.UPSTrackingNo,
        UPS.TransportationCharges, UPS.ServiceOptionsCharges,
        UPS.OverallTotalCharges, UPS.BillingWeightCode,
        UPS.BillingWeight, UPS.UPSStatus, data.Location,
        UPS.Created, UPS.CreatedBy
      ]

      con.query(sql, values, (err, res) => {
        if (err) {
          result(err, null);
          return;
        } else {
          // var sqlUpdate = `UPDATE tbl_repair_request_shipping_history SET TrackingNo = '${UPS.UPSTrackingNo}',  Modified='${cDateTime.getDateTime()}',
          // ModifiedBy='${global.authuser.UserId}' WHERE ShippingHistoryId = '${UPS.ShippingHistoryId}' `;
          // con.query(sqlUpdate, (err1, res1) => {
          //   if (err1) {
          //     result(err1, null);
          //     return;
          //   }
          // });
          UPS.UPSShippingLabel = data.Location;
          result(null, { id: res.insertId, ...UPS });
        }
      });

    }
  });
};

UPS.updateShippingHistoryTrackingNo = (UPS, result) => {
  var sqlUpdate = `UPDATE tbl_repair_request_shipping_history SET TrackingNo = '${UPS.UPSTrackingNo}',  Modified='${cDateTime.getDateTime()}',
          ModifiedBy='${global.authuser.UserId}' WHERE ShippingHistoryId = '${UPS.ShippingHistoryId}' `;
  con.query(sqlUpdate, (err1, res1) => {
    if (err1) {
      result(err1, null);
      return;
    } else {
      result(null, res1[0]);
    }
  });
};

UPS.findById = (ShippingHistoryId, result) => {

  var sql = ``;

  sql = `SELECT UPSShippingId,ShippingHistoryId,UPSTrackingNo,TransportationCharges,ServiceOptionsCharges,OverallTotalCharges,BillingWeightCode,BillingWeight,UPSStatus,UPSShippingLabel
    FROM tbl_repair_request_shipping_ups 
    WHERE ShippingHistoryId = '${ShippingHistoryId}' `;

  con.query(sql, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    result({ kind: "Shipping History Id not found" }, null);
  });
};

UPS.remove = (ShippingHistoryId, result) => {

  var sql = `UPDATE tbl_repair_request_shipping_ups SET IsDeleted = 1, UPSStatus = 'Cancel', Modified='${cDateTime.getDateTime()}',
     ModifiedBy='${global.authuser.UserId}' WHERE ShippingHistoryId = '${ShippingHistoryId}' `;
  con.query(sql, (err, res) => {
    if (err) {
      return result(null, err);
    }
    if (res.affectedRows == 0) {
      result({ kind: "Shipping History Id not found" }, null);
      return;
    } else {
      var sqlView = `SELECT UPSShippingId,ShippingHistoryId,UPSTrackingNo,TransportationCharges,ServiceOptionsCharges,OverallTotalCharges,BillingWeightCode,BillingWeight,UPSStatus,UPSShippingLabel
    FROM tbl_repair_request_shipping_ups 
    WHERE ShippingHistoryId = '${ShippingHistoryId}' `;

      con.query(sqlView, (errView, resView) => {
        if (errView) {
          //console.log("error: ", err);
          result(errView, null);
          return;
        }

        if (resView.length) {
          result(null, resView[0]);
          return;
        }
      });
    }

  });
};
// Cancel
UPS.generateLabel = (req, result) => {

  //req.body.BillToType = 2;
  // req.body.UPS_Receiver_number = '9X352Y';
  if (req.body.UPS_Service_Code && req.body.UPS_Service_Code != '' && req.body.UPS_Service_Description && req.body.UPS_Service_Description != '') {
    var UPS_SHIPPERNUMBER = Constants.CONST_UPS_SHIPPERNUMBER;
    var UPS_RECEIVER_NO = req.body.UPS_Receiver_number && req.body.UPS_Receiver_number != '' ? req.body.UPS_Receiver_number : '';
    if (req.body.BillToType && req.body.BillToType == 2 && UPS_RECEIVER_NO == '') { //receiver will pay the amount
      result({ kind: "If 'UPS Bill Transportation To' is selected as 'Receiver' then Customer / Vendor should have a valid UPS Account No. Add a valid UPS number in Customer/Vendor profile" }, null);
    } else {
      var data = post(req.body, UPS_SHIPPERNUMBER, UPS_RECEIVER_NO);
      // console.log(data);
      var endpointurl = Constants.CONST_UPS_URL_SHIP;
      request.post({
        headers: {
          'Content-Type': 'application/xml',
          'Accept': 'application/xml'
        },
        url: endpointurl,
        body: data
      }, function (error, response, body) {
        result(null, body);
        return;
      });
    }

  } else {
    result({ kind: "Service Type is not found" }, null);
    return;
  }
};
// Void
UPS.cancelLabel = (req, result) => {
  var data = voidpost(req.body)
  //console.log(data);
  var endpointurl = Constants.CONST_UPS_URL_VOID;
  request.post({
    headers: {
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    },
    url: endpointurl,
    body: data
  }, function (error, response, body) {
    result(null, body);
    return;
  });
}

UPS.trackLabel = (req, result) => {
  var data = trackpost(req.body)
  //console.log(data);
  var endpointurl = Constants.CONST_UPS_URL_TRACK;
  request.post({
    headers: {
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    },
    url: endpointurl,
    body: data
  }, function (error, response, body) {
    result(null, body);
    return;
  });
}

UPS.addressValidate = (req, result) => {
  var r = req.body ? req.body : req;
  var data = addresspost(r)
  var endpointurl = Constants.CONST_UPS_URL_AV;
  request.post({
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    url: endpointurl,
    json: data
  }, function (error, response, body) {
    result(null, body);
    return;
  });
}

function post(val, UPS_SHIPPERNUMBER, UPS_RECEIVER_NO) {

  if (val.BillToType == 2) { //receiver will pay the amount
    var BillingUPS = UPS_SHIPPERNUMBER;
    var billToTypeName = "BillShipper";
  } else {
    if (UPS_RECEIVER_NO != '') {
      var BillingUPS = UPS_RECEIVER_NO;
      var billToTypeName = "BillReceiver";
    } else {
      var BillingUPS = UPS_SHIPPERNUMBER;
      var billToTypeName = "BillShipper";
    }

  }

  var shipDescription = 'AH Repairs';
  var shipRequestOption = "nonvalidate";
  var serviceCode = "03";
  var serviceCodeD = "Ground";
  if (val.ShipFromCountryCode != 'US' || val.ShipToCountryCode != 'US') {
    serviceCode = "08";
    serviceCodeD = "Expedited";
  }
  let postData = '<?xml version="1.0" encoding="UTF-8"?>';
  postData += '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://www.ups.com/XMLSchema/XOLTWS/Common/v1.0" xmlns:ns2="http://www.ups.com/XMLSchema/XOLTWS/Ship/v1.0" xmlns:ns3="http://www.ups.com/XMLSchema/XOLTWS/UPSS/v1.0">';
  postData += '<SOAP-ENV:Header>';
  postData += '<ns3:UPSSecurity>';
  postData += '<ns3:UsernameToken>';
  postData += '<ns3:Username>' + Constants.CONST_UPS_USERNAME + '</ns3:Username>';
  postData += '<ns3:Password>' + Constants.CONST_UPS_PASSWORD + '</ns3:Password>';
  postData += '</ns3:UsernameToken>';
  postData += '<ns3:ServiceAccessToken>';
  postData += '<ns3:AccessLicenseNumber>' + Constants.CONST_UPS_ACCESS + '</ns3:AccessLicenseNumber>';
  postData += '</ns3:ServiceAccessToken>';
  postData += '</ns3:UPSSecurity>';
  postData += '</SOAP-ENV:Header>';
  postData += '<SOAP-ENV:Body>';
  postData += '<ns2:ShipmentRequest>';
  postData += '<ns1:Request>';
  postData += '<ns1:RequestOption>' + shipRequestOption + '</ns1:RequestOption>';
  postData += '</ns1:Request>';
  postData += '<ns2:Shipment>';
  postData += '<ns2:Description>' + shipDescription + '</ns2:Description>';
  postData += '<ns2:Shipper>';
  postData += '<ns2:Name>' + val.ShipFromName + '</ns2:Name>';
  postData += '<ns2:AttentionName>' + val.ShipFromAttentionName + '</ns2:AttentionName>';
  // postData += '<ns2:TaxIdentificationNumber>123456</ns2:TaxIdentificationNumber>';
  postData += '<ns2:Phone>';
  postData += '<ns2:Number>' + val.ShipFromNumber + '</ns2:Number>';
  // postData += '<ns2:Extension>1</ns2:Extension>';
  postData += '</ns2:Phone>';
  postData += '<ns2:ShipperNumber>' + UPS_SHIPPERNUMBER + '</ns2:ShipperNumber>';
  postData += '<ns2:Address>';
  postData += '<ns2:AddressLine>' + val.ShipFromAddressLine + '</ns2:AddressLine>';
  postData += '<ns2:City>' + val.ShipFromCity + '</ns2:City>';
  postData += '<ns2:StateProvinceCode>' + val.ShipFromStateCode + '</ns2:StateProvinceCode>';
  postData += '<ns2:PostalCode>' + val.ShipFromPostalCode + '</ns2:PostalCode>';
  postData += '<ns2:CountryCode>' + val.ShipFromCountryCode + '</ns2:CountryCode>';
  postData += '</ns2:Address>';
  postData += '</ns2:Shipper>';
  postData += '<ns2:ShipTo>';
  postData += '<ns2:Name>' + val.ShipToName + '</ns2:Name>';
  postData += '<ns2:AttentionName>' + val.ShipToAttentionName + '</ns2:AttentionName>';
  postData += '<ns2:Phone>';
  postData += '<ns2:Number>' + val.ShipToNumber + '</ns2:Number>';
  postData += '</ns2:Phone>';
  postData += '<ns2:Address>';
  postData += '<ns2:AddressLine>' + val.ShipToAddressLine + '</ns2:AddressLine>';
  postData += '<ns2:City>' + val.ShipToCity + '</ns2:City>';
  postData += '<ns2:StateProvinceCode>' + val.ShipToStateCode + '</ns2:StateProvinceCode>';
  postData += '<ns2:PostalCode>' + val.ShipToPostalCode + '</ns2:PostalCode>';
  postData += '<ns2:CountryCode>' + val.ShipToCountryCode + '</ns2:CountryCode>';
  postData += '</ns2:Address>';
  postData += '</ns2:ShipTo>';
  postData += '<ns2:ShipFrom>';
  postData += '<ns2:Name>' + val.ShipFromName + '</ns2:Name>';
  postData += '<ns2:AttentionName>' + val.ShipFromAttentionName + '</ns2:AttentionName>';
  postData += '<ns2:Phone>';
  postData += '<ns2:Number>' + val.ShipFromNumber + '</ns2:Number>';
  postData += '</ns2:Phone>';
  postData += '<ns2:Address>';
  postData += '<ns2:AddressLine>' + val.ShipFromAddressLine + '</ns2:AddressLine>';
  postData += '<ns2:City>' + val.ShipFromCity + '</ns2:City>';
  postData += '<ns2:StateProvinceCode>' + val.ShipFromStateCode + '</ns2:StateProvinceCode>';
  postData += '<ns2:PostalCode>' + val.ShipFromPostalCode + '</ns2:PostalCode>';
  postData += '<ns2:CountryCode>' + val.ShipFromCountryCode + '</ns2:CountryCode>';
  postData += '</ns2:Address>';
  postData += '</ns2:ShipFrom>';
  postData += '<ns2:PaymentInformation>';
  postData += '<ns2:ShipmentCharge>';
  postData += '<ns2:Type>01</ns2:Type>';
  postData += '<ns2:' + billToTypeName + '>';
  postData += '<ns2:AccountNumber>' + BillingUPS + '</ns2:AccountNumber>';
  postData += '</ns2:' + billToTypeName + '>';
  postData += '</ns2:ShipmentCharge>';
  postData += '</ns2:PaymentInformation>';

  postData += '<ns2:Service>';
  // postData += '<ns2:Code>08</ns2:Code>';
  // postData += '<ns2:Description>Expedited</ns2:Description>';
  postData += '<ns2:Code>' + val.UPS_Service_Code + '</ns2:Code>';
  postData += '<ns2:Description>' + val.UPS_Service_Description + '</ns2:Description>';
  postData += '</ns2:Service>';
  postData += '<ns2:Package>';
  postData += '<ns2:Description></ns2:Description>';
  postData += '<ns2:Packaging>';
  postData += '<ns2:Code>02</ns2:Code>';
  postData += '<ns2:Description>Nails</ns2:Description>';
  postData += '</ns2:Packaging>';
  postData += '<ns2:ReferenceNumber>';
  postData += '<ns2:Code>01</ns2:Code>';
  postData += '<ns2:Value>' + val.refNo1 + '</ns2:Value>';
  postData += '</ns2:ReferenceNumber>';
  postData += '<ns2:ReferenceNumber>';
  postData += '<ns2:Code>02</ns2:Code>';
  postData += '<ns2:Value>' + val.refNo2 + '</ns2:Value>';
  postData += '</ns2:ReferenceNumber>';
  // postData += '<ns2:Dimensions>';
  // postData += '<ns2:UnitOfMeasurement>';
  // postData += '<ns2:Code>IN</ns2:Code>';
  // postData += '<ns2:Description>Inches</ns2:Description>';
  // postData += '</ns2:UnitOfMeasurement>';
  // postData += '<ns2:Length>7</ns2:Length>';
  // postData += '<ns2:Width>5</ns2:Width>';
  // postData += '<ns2:Height>2</ns2:Height>';
  // postData += '</ns2:Dimensions>';
  postData += '<ns2:PackageWeight>';
  postData += '<ns2:UnitOfMeasurement>';
  postData += '<ns2:Code>LBS</ns2:Code>';
  postData += '<ns2:Description>Pounds</ns2:Description>';
  postData += '</ns2:UnitOfMeasurement>';
  postData += '<ns2:Weight>' + val.Weight + '</ns2:Weight>';
  postData += '</ns2:PackageWeight>';
  postData += '</ns2:Package>';
  postData += '</ns2:Shipment>';
  postData += '</ns2:ShipmentRequest>';
  postData += '</SOAP-ENV:Body>';
  postData += '</SOAP-ENV:Envelope>';
  // console.log(postData);
  return postData;
}

function voidpost(val) {
  let postData = '<?xml version="1.0" encoding="UTF-8"?>';
  postData += '<AccessRequest xml:lang="en-US">';
  postData += '<AccessLicenseNumber>' + Constants.CONST_UPS_ACCESS + '</AccessLicenseNumber>';
  postData += '<UserId>' + Constants.CONST_UPS_USERNAME + '</UserId>';
  postData += '<Password>' + Constants.CONST_UPS_PASSWORD + '</Password>';
  postData += '</AccessRequest>';
  postData += '<?xml version="1.0" encoding="UTF-8"?>';
  postData += '<VoidShipmentRequest>';
  postData += '<Request>';
  postData += '<TransactionReference>';
  postData += '<CustomerContext>' + val.CustomerContext + '</CustomerContext>';
  postData += '<XpciVersion>1.0</XpciVersion>';
  postData += '</TransactionReference>';
  postData += '<RequestAction>1</RequestAction>';
  postData += '<RequestOption>1</RequestOption>';
  postData += '</Request>';
  postData += '<ShipmentIdentificationNumber>' + val.ShipmentIdentificationNumber + '</ShipmentIdentificationNumber>';
  postData += '</VoidShipmentRequest>';
  return postData;
}

function trackpost(val) {
  let postData = '<?xml version="1.0" encoding="UTF-8"?>';
  postData += '<AccessRequest xml:lang="en-US">';
  postData += '<AccessLicenseNumber>' + Constants.CONST_UPS_ACCESS + '</AccessLicenseNumber>';
  postData += '<UserId>' + Constants.CONST_UPS_USERNAME + '</UserId>';
  postData += '<Password>' + Constants.CONST_UPS_PASSWORD + '</Password>';
  postData += '</AccessRequest>';
  postData += '<?xml version="1.0"?>';
  postData += '<TrackRequest xml:lang="en-US">';
  postData += '<Request>';
  postData += '<TransactionReference>';
  postData += '<CustomerContext>' + val.CustomerContext + '</CustomerContext>';
  postData += '</TransactionReference>';
  postData += '<RequestAction>Track</RequestAction>';
  postData += '<RequestOption>activity</RequestOption>';
  postData += '</Request>';
  postData += '<TrackingNumber>' + val.ShipmentIdentificationNumber + '</TrackingNumber>';
  postData += '</TrackRequest>';
  return postData;
}
function addresspost(val) {
  let postData = {
    "AccessRequest": {
      "AccessLicenseNumber": Constants.CONST_UPS_ACCESS,
      "UserId": Constants.CONST_UPS_USERNAME,
      "Password": Constants.CONST_UPS_PASSWORD
    },
    "AddressValidationRequest": {
      "Request": {
        "TransactionReference": {
          "CustomerContext": "Address 1"
        },
        "RequestAction": "AV"
      },
      "Address": {
        "City": val.ShipToCity,
        "StateProvinceCode": val.ShipToStateCode,
        "PostalCode": val.ShipToPostalCode
      }
    }
  };
  return postData;
}

function samplepost(val) {
  let postData = '<?xml version="1.0" encoding="UTF-8"?>';
  postData += '<AccessRequest xml:lang="en-US">';
  postData += '<AccessLicenseNumber>' + Constants.CONST_UPS_ACCESS + '</AccessLicenseNumber>';
  postData += '<UserId>' + Constants.CONST_UPS_USERNAME + '</UserId>';
  postData += '<Password>' + Constants.CONST_UPS_PASSWORD + '</Password>';
  postData += '</AccessRequest>';
  postData += '<?xml version="1.0"?>';
  postData += '<ShipmentConfirmRequest xml:lang="en-US"><Request><RequestAction>ShipConfirm</RequestAction><RequestOption>nonvalidate</RequestOption></Request><LabelSpecification><HTTPUserAgent/><LabelPrintMethod><Code>GIF</Code><Description/></LabelPrintMethod><LabelImageFormat><Code>GIF</Code><Description/></LabelImageFormat></LabelSpecification><Shipment><Description/><RateInformation><NegotiatedRatesIndicator/></RateInformation><Shipper><Name>Shipper Name</Name><PhoneNumber>1234567890</PhoneNumber><TaxIdentificationNumber>1234567877</TaxIdentificationNumber><ShipperNumber>425597</ShipperNumber><Address><AddressLine1>Address line 1</AddressLine1><City>Timonium</City><StateProvinceCode>MD</StateProvinceCode><PostalCode>210903</PostalCode><CountryCode>US</CountryCode></Address></Shipper><ShipTo><CompanyName>Company name</CompanyName><AttentionName>Ship to attention name</AttentionName><PhoneNumber>Phone number</PhoneNumber><Address><AddressLine1>Address line 1</AddressLine1><City>Vero Beach</City><StateProvinceCode>FL</StateProvinceCode><PostalCode>32960</PostalCode><CountryCode>US</CountryCode></Address></ShipTo><ShipFrom><CompanyName>Company name</CompanyName><AttentionName>Ship From Attention name</AttentionName><PhoneNumber>1234567890</PhoneNumber><TaxIdentificationNumber>1234567877</TaxIdentificationNumber><Address><AddressLine1>Address line 1</AddressLine1><City>Vero Beach</City><StateProvinceCode>FL</StateProvinceCode><PostalCode>32960</PostalCode><CountryCode>US</CountryCode></Address></ShipFrom><PaymentInformation><Prepaid><BillShipper><AccountNumber>425597</AccountNumber></BillShipper></Prepaid></PaymentInformation><Service><Code>02</Code><Description>Expedited</Description></Service><Package><Description>sample</Description><PackagingType><Code>02</Code><Description>Nails</Description></PackagingType><PackageWeight><Weight>60</Weight><UnitOfMeasurement/></PackageWeight></Package></Shipment></ShipmentConfirmRequest>';
  // postData +='<TrackRequest xml:lang="en-US">';
  // postData +='<Request>';
  // postData +='<TransactionReference>';
  // postData +='<CustomerContext>'+val.CustomerContext+'</CustomerContext>';
  // postData +='</TransactionReference>';
  // postData +='<RequestAction>Track</RequestAction>';
  // postData +='<RequestOption>activity</RequestOption>';
  // postData +='</Request>';
  // postData +='<TrackingNumber>'+val.ShipmentIdentificationNumber+'</TrackingNumber>';
  // postData +='</TrackRequest>';
  return postData;
}


module.exports = UPS;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const Constants = require("../config/constants.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');

const SettingsGeneralModel = function (objSettingsGeneral) {

  this.SettingsId = objSettingsGeneral.SettingsId ? objSettingsGeneral.SettingsId : 0;
  this.AppName = objSettingsGeneral.AppName ? objSettingsGeneral.AppName : 0;
  this.AppEmail = objSettingsGeneral.AppEmail ? objSettingsGeneral.AppEmail : '';
  this.AppCCEmail = objSettingsGeneral.AppCCEmail ? objSettingsGeneral.AppCCEmail : '';
  this.AppLogo = objSettingsGeneral.AppLogo ? objSettingsGeneral.AppLogo : '';
  this.DefaultQuoteNote = objSettingsGeneral.DefaultQuoteNote ? objSettingsGeneral.DefaultQuoteNote : '';
  this.DefaultMROQuoteNote = objSettingsGeneral.DefaultMROQuoteNote ? objSettingsGeneral.DefaultMROQuoteNote : '';
  this.DefaultSONote = objSettingsGeneral.DefaultSONote ? objSettingsGeneral.DefaultSONote : '';
  this.DefaultPONote = objSettingsGeneral.DefaultPONote ? objSettingsGeneral.DefaultPONote : '';
  this.DefaultInvoiceNote = objSettingsGeneral.DefaultInvoiceNote ? objSettingsGeneral.DefaultInvoiceNote : '';
  this.DefaultVendorBIllNote = objSettingsGeneral.DefaultVendorBIllNote ? objSettingsGeneral.DefaultVendorBIllNote : '';
  this.AHGroupVendor = objSettingsGeneral.AHGroupVendor ? objSettingsGeneral.AHGroupVendor : 0;
  this.AHCommissionPercent = objSettingsGeneral.AHCommissionPercent ? objSettingsGeneral.AHCommissionPercent : 0;
  this.TaxPercent = objSettingsGeneral.TaxPercent ? objSettingsGeneral.TaxPercent : 0;
  this.InventoryNotificationEmail = objSettingsGeneral.InventoryNotificationEmail ? objSettingsGeneral.InventoryNotificationEmail : '';
  this.InventoryNotificationMobile = objSettingsGeneral.InventoryNotificationMobile ? objSettingsGeneral.InventoryNotificationMobile : '';

  this.RequestForQuoteEmail = objSettingsGeneral.RequestForQuoteEmail ? objSettingsGeneral.RequestForQuoteEmail : '';


  this.QuoteLeadTime = objSettingsGeneral.QuoteLeadTime ? objSettingsGeneral.QuoteLeadTime : 0;
  this.SOLeadTime = objSettingsGeneral.SOLeadTime ? objSettingsGeneral.SOLeadTime : 0;
  this.POLeadTime = objSettingsGeneral.POLeadTime ? objSettingsGeneral.POLeadTime : 0;
  this.InvoiceLeadTime = objSettingsGeneral.InvoiceLeadTime ? objSettingsGeneral.InvoiceLeadTime : 0;
  this.VendorBillLeadTime = objSettingsGeneral.VendorBillLeadTime ? objSettingsGeneral.VendorBillLeadTime : 0;
  this.DefaultCurrency = objSettingsGeneral.DefaultCurrency ? objSettingsGeneral.DefaultCurrency : 0;
  this.DefaultCountry = objSettingsGeneral.DefaultCountry ? objSettingsGeneral.DefaultCountry : 0;
  this.DefaultDateFormat = objSettingsGeneral.DefaultDateFormat ? objSettingsGeneral.DefaultDateFormat : '';
  this.DefaultTimeFormat = objSettingsGeneral.DefaultTimeFormat ? objSettingsGeneral.DefaultTimeFormat : '';
  this.RFIDStorageTime = objSettingsGeneral.RFIDStorageTime ? objSettingsGeneral.RFIDStorageTime : 60;

  this.IsRFIDEnabled = objSettingsGeneral.IsRFIDEnabled;
  this.ReaderInterfaceHost = objSettingsGeneral.ReaderInterfaceHost ? objSettingsGeneral.ReaderInterfaceHost : '';
  this.ReaderHost = objSettingsGeneral.ReaderHost ? objSettingsGeneral.ReaderHost : '';
  this.ReaderId = objSettingsGeneral.ReaderId ? objSettingsGeneral.ReaderId : '';
  this.PresetName = objSettingsGeneral.PresetName ? objSettingsGeneral.PresetName : '';

  this.IsUPSEnable = objSettingsGeneral.IsUPSEnable ? objSettingsGeneral.IsUPSEnable : 0;

  this.Zones = objSettingsGeneral.Zones ? objSettingsGeneral.Zones : '';
  this.Created = cDateTime.getDateTime();
  this.Modified = cDateTime.getDateTime();
  const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
  this.CreatedBy = (objSettingsGeneral.authuser && objSettingsGeneral.authuser.UserId) ? objSettingsGeneral.authuser.UserId : TokenUserId;
  this.ModifiedBy = (objSettingsGeneral.authuser && objSettingsGeneral.authuser.UserId) ? objSettingsGeneral.authuser.UserId : TokenUserId;
};

// To update By Id
SettingsGeneralModel.updateById = (obj, result) => {

  var sql = `UPDATE tbl_settings_general SET AppName = ?,AppEmail =?,AppCCEmail=?,
  AppLogo=?,DefaultQuoteNote=?,DefaultMROQuoteNote=?,DefaultSONote=?,
  DefaultPONote=?,DefaultInvoiceNote=?,DefaultVendorBIllNote=?,
  AHCommissionPercent=?,TaxPercent=?,
  QuoteLeadTime=?,SOLeadTime=?,POLeadTime=?,InvoiceLeadTime=?,
  VendorBillLeadTime=?,DefaultCurrency=?,DefaultCountry=?,DefaultDateFormat=?,DefaultTimeFormat=?,IsUPSEnable=?,
  RequestForQuoteEmail = ?,
  Modified = ?,ModifiedBy = ? WHERE SettingsId = ?`

  let val = new SettingsGeneralModel(obj);
  var values = [
    val.AppName, val.AppEmail, val.AppCCEmail,
    val.AppLogo, val.DefaultQuoteNote, val.DefaultMROQuoteNote, val.DefaultSONote,
    val.DefaultPONote, val.DefaultInvoiceNote, val.DefaultVendorBIllNote,
    val.AHCommissionPercent, val.TaxPercent,
    val.QuoteLeadTime, val.SOLeadTime, val.POLeadTime, val.InvoiceLeadTime, val.VendorBillLeadTime, val.DefaultCurrency, val.DefaultCountry, val.DefaultDateFormat, val.DefaultTimeFormat, val.IsUPSEnable,
    val.RequestForQuoteEmail, val.Modified, val.ModifiedBy, val.SettingsId
  ]
  //console.log("VA" + values)
  con.query(sql, values, function (err, res) {
    if (err) { return result(err, null); }
    return result(null, { id: val.SettingsId, ...val });
  });
};

SettingsGeneralModel.findById = (SettingsId, result) => {
  var sql = [];
  sql.push(`SELECT * FROM tbl_settings_general s WHERE SettingsId = '1';`);
  sql.push(`SELECT * FROM tbl_settings_rfid WHERE RFIDSettingsId = '1';`);
  sql.push(`SELECT * FROM tbl_settings_rfid_zone;`);

  async.parallel(sql.map(s => result => { con.query(s, result) }),
    (err, res) => {
      if (err)
        return result(err, null);
      result(null, { ...res[0][0][0], ...res[1][0][0], Zones: res[2][0] });
    }
  )
};

//Update Inventory Settings
SettingsGeneralModel.UpdateInventorySettings = (Obj, result) => {

  var sql = [];
  sql.push(`Update tbl_settings_general set InventoryNotificationEmail= '${Obj.InventoryNotificationEmail}',InventoryNotificationMobile= '${Obj.InventoryNotificationMobile}',Modified= '${Obj.Modified}',ModifiedBy='${Obj.ModifiedBy}' where SettingsId=1;`);
  sql.push(`Update tbl_settings_rfid set ReaderInterfaceHost = '${Obj.ReaderInterfaceHost}', ReaderHost = '${Obj.ReaderHost}', ReaderId = '${Obj.ReaderId == "" ? 0 : Obj.ReaderId}', PresetName = '${Obj.PresetName}', RFIDStorageTime = '${Obj.RFIDStorageTime}', IsRFIDEnabled = ${Obj.IsRFIDEnabled} where RFIDSettingsId=1;`);
  Obj.Zones.forEach((zone, i) => {

    if (zone.IsDeleted) {
      sql.push(`Delete from tbl_settings_rfid_zone where RFIDZoneSettingsId= ${zone.RFIDZoneSettingsId};`);
    }
    else if (zone.RFIDZoneSettingsId) {
      sql.push(`Update tbl_settings_rfid_zone set RFIDSettingsId= 1, ZoneId = '${zone.ZoneId ? zone.ZoneId : 0}', Zone = '${zone.Zone}',  readyAntennaPort = '${zone.readyAntennaPort}', acceptAntennaPort = '${zone.acceptAntennaPort}' where RFIDZoneSettingsId= ${zone.RFIDZoneSettingsId};`);
    } else {
      sql.push(`Insert into tbl_settings_rfid_zone (RFIDSettingsId, ZoneId, Zone, readyAntennaPort, acceptAntennaPort) Values (1, '${zone.ZoneId ? zone.ZoneId : 0}', '${zone.Zone}', '${zone.readyAntennaPort}', '${zone.acceptAntennaPort}');`);
    }
  })

  async.parallel(sql.map(s => result => { con.query(s, result) }),
    (err, res) => {
      if (err)
        return result(err, null);

      result(null, { ...res[0][0][0], ...res[1][0][0], Zones: res[2][0] });
    }
  )
};

SettingsGeneralModel.GetRFIDConfig = (Obj, result) => {

  var sql = [];
  sql.push(`SELECT * FROM tbl_settings_rfid where RFIDSettingsId=1;`);
  sql.push(`SELECT * FROM tbl_settings_rfid_zone`);

  async.parallel(sql.map(s => result => { con.query(s, result) }),
    (err, res) => {
      if (err) {
        return result(err, null);
      }
      // if (res.affectedRows == 0) {
      //   return result({ kind: "Setting Not Found" }, null);
      // }

      let base = res[0][0][0];
      let zones = res[1][0];

      let resZones = zones.map((zone) => {
        return {
          // readerHostApiPath: base.ReaderHost,
          // presetName: base.PresetName,
          // readerId: base.ReaderId,
          // zones: {
          zone: Number(zone.ZoneId),
          //antennaPort: Number(zone.AntennaPort),
          readyAntennaPort: Number(zone.ReadyAntennaPort),
          acceptAntennaPort: Number(zone.AcceptAntennaPort)
          // }
        }
      })
      return result(null, {
        readerConfig: {
          readerInterfaceServiceHost: base.ReaderInterfaceHost,
          reader: [{
            readerHostApiPath: base.ReaderHost,
            presetName: base.PresetName,
            readerId: Number(base.ReaderId),
            zones: resZones
          }]
        },
        enabled: base.IsRFIDEnabled
      });

    });
};
SettingsGeneralModel.SelectAHGroupVendor = () => {
  var sql = `SELECT AHGroupVendor,'-' as 'Empty' FROM tbl_settings_general  WHERE SettingsId = '1' `;
  return sql;
};
SettingsGeneralModel.View = () => {
  var sql = `SELECT * FROM tbl_settings_general  WHERE SettingsId = '1' `;
  return sql;
};
module.exports = SettingsGeneralModel;
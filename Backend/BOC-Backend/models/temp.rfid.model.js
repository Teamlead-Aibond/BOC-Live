/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const SettingsGeneralModel = require("./settings.general.model.js");

const TempRFIDModel = function (obj) {
    this.RFIDTempId = obj.RFIDTempId;
    this.RFIDTagNo = obj.RFIDTagNo ? obj.RFIDTagNo : '';
    this.ReadyAntennaTime = obj.ReadyAntennaTime ? obj.ReadyAntennaTime : '';
    this.AcceptAntennaTime = obj.AcceptAntennaTime ? obj.AcceptAntennaTime : '';
    this.StockInRecord = obj.StockInRecord ? obj.StockInRecord : '';
    this.RFIDEmployeeNo = obj.RFIDEmployeeNo ? obj.RFIDEmployeeNo : '';
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

//To get all the Temp RFID
TempRFIDModel.getAll = result => {
    var SettingsId = 1;
    var sql = ``;
    SettingsGeneralModel.findById(SettingsId, (err1, data) => {
        // console.log(data.RFIDStorageTime);
        TempRFIDModel.checkAndRemove(data.RFIDStorageTime, (e, d) => {
            // if (data && data.RFIDStorageTime > 0) {
            //     // console.log(cDateTime.getDateTimeAddMin(data.RFIDStorageTime));
            //     // console.log(cDateTime.getDateTimeSubMin(data.RFIDStorageTime));
            //     sql = `Select RFIDTagNo, ReadyAntennaTime, AcceptAntennaTime, DATE_FORMAT(Created,'%Y-%m-%d %H:%i:%s') AS Created from tbl_rfid_temp WHERE  IsDeleted = 0 AND DATE_FORMAT(Created,'%Y-%m-%d %H:%i:%s') > '${cDateTime.getDateTimeSubMin(data.RFIDStorageTime)}';`;
            // } else {
            //     sql = `Select RFIDTagNo, ReadyAntennaTime, AcceptAntennaTime, DATE_FORMAT(Created,'%Y-%m-%d %H:%i:%s') AS Created from tbl_rfid_temp WHERE  IsDeleted = 0;`;
            // }
            sql = `Select RFIDTagNo, ReadyAntennaTime, AcceptAntennaTime, StockInRecord, RFIDEmployeeNo, DATE_FORMAT(Created,'%Y-%m-%d %H:%i:%s') AS Created from tbl_rfid_temp WHERE  IsDeleted = 0;`;
            // console.log(sql);
            con.query(sql, (err, res) => {
                if (err)
                    return result(err, null);
                return result(null, res);
            });
        });
    });
}

TempRFIDModel.checkAndRemove = (RFIDStorageTime, result) => {
    if (RFIDStorageTime != null && RFIDStorageTime > 0) {
        var sql = `Select RFIDTagNo from tbl_rfid_temp WHERE  IsDeleted = 0 AND DATE_FORMAT(Created,'%Y-%m-%d %H:%i:%s') < '${cDateTime.getDateTimeSubMin(RFIDStorageTime)}';`;
        con.query(sql, (err, res) => {
            if (err) {
                return result(err, null);
            } else {
                if(res && res.length>0){
                    var itemProcessed = 0;
                    res.forEach(element => {
                        // console.log(element);
                        TempRFIDModel.remove(element.RFIDTagNo, (err, data) => {
                            itemProcessed++;
                            if(itemProcessed === res.length){
                                // return result(null, data);
                                return result(null, data)
                            }
                            
                        });
                    })
                }else{
                    return result(null, RFIDStorageTime);
                }
                
            }

        });
    }

}


//To create a Temp RFID
TempRFIDModel.create = (Obj, result) => {
    TempRFIDModel.check(Obj, (e, d) => {
        // console.log(d);
        if(d && d.length > 0){
            // var sql = ` UPDATE tbl_rfid_temp SET Created = ?,CreatedBy = ?  WHERE RFIDTagNo = ? `;
            // var values = [Obj.Created, Obj.CreatedBy, Obj.RFIDTagNo];
            // con.query(sql, values, (err, res) => {
            //     if (err)
            //         return result(err, null);
            //     return result(null, Obj);
            // });
            return result(null, Obj);
        }else{
            var sql = `insert into tbl_rfid_temp(RFIDTagNo,ReadyAntennaTime,AcceptAntennaTime,StockInRecord,RFIDEmployeeNo,payload,Created,CreatedBy) values(?,?,?,?,?,?,?,?)`;
            var values = [Obj.RFIDTagNo, Obj.ReadyAntennaTime, Obj.AcceptAntennaTime, JSON.stringify(Obj.StockInRecord), Obj.RFIDEmployeeNo, JSON.stringify(Obj), Obj.Created, Obj.CreatedBy];
            // console.log("test");
            con.query(sql, values, (err, res) => {
                if (err)
                    return result(err, null);
                return result(null, { id: res.insertId, ...Obj });
            });
        }
        
    })
    
};
//To check Temp RFID is exists
TempRFIDModel.check = (Obj, result) => {
    con.query(`Select RFIDTagNo from tbl_rfid_temp WHERE  IsDeleted = 0 AND RFIDTagNo = ${Obj.RFIDTagNo} `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
};

//To remove the Temp RFID
TempRFIDModel.remove = (TagNo, result) => {
    var sql = `UPDATE tbl_rfid_temp SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE RFIDTagNo = '${TagNo}' `;
    con.query(sql, (err, res) => {
        if (err)
            return result(null, err);
        if (res.affectedRows == 0)
            return result({ msg: "Temp RFID not deleted" }, null);
        return result(null, res);
    });
};

//To view the Temp RFID
TempRFIDModel.view = (TagNo, result) => {
    var sql = `SELECT * FROM tbl_rfid_temp WHERE RFIDTagNo = '${TagNo}' AND IsDeleted = 0 `;
    con.query(sql, (err, res) => {
        if (err){
            return result(null, err);
        }
        if(res.length > 0){
            return result(null, res[0]);
        }else{
            return result({msg: "No Records Found.!"}, null);
        }  
        
    });
};


module.exports = TempRFIDModel;
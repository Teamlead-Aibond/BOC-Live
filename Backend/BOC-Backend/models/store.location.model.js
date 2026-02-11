/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const StoreLocationModel = function (obj) {
    this.LocationId = obj.LocationId;
    this.LocationName = obj.LocationName ? obj.LocationName : '';
    this.LocationDescription = obj.LocationDescription ? obj.LocationDescription : '';
    this.IsActive = obj.IsActive;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

//To get all the Location getAll
StoreLocationModel.getAll = result => {
    con.query(`Select LocationId,LocationName,LocationDescription,IsActive from tbl_ecommerce_store_location WHERE  IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

//To create a Location dropdown
StoreLocationModel.dropdown = result => {
    con.query(`Select LocationId,LocationName,LocationDescription,IsActive from tbl_ecommerce_store_location WHERE IsActive = 1 AND IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}


//To create a Location create
StoreLocationModel.create = (Obj, result) => {
    StoreLocationModel.checkExists(Obj, (err1, data) => {
        if (data && data.length > 0) {
            var errMsg = "Location " + Obj.LocationName + " already exists!";
            result(errMsg, null);
        } else {
            var sql = `insert into tbl_ecommerce_store_location(LocationName,LocationDescription,IsActive,Created,CreatedBy) values(?,?,?,?,?)`;
            var values = [Obj.LocationName, Obj.LocationDescription, Obj.IsActive, Obj.Created, Obj.CreatedBy];
            con.query(sql, values, (err, res) => {
                if (err)
                    return result(err, null);
                return result(null, { id: res.insertId, ...Obj });
            });
        }
    })
};

//To get the Location info
StoreLocationModel.findById = (LocationId, result) => {
    var sql = `SELECT LocationId,LocationName,LocationDescription,IsActive  FROM tbl_ecommerce_store_location  WHERE LocationId = ${LocationId} `;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        if (res.length) {
            return result(null, res[0]);
        }
        return result({ msg: "Location not found" }, null);
    });
};

//To update the Location update
StoreLocationModel.update = (Obj, result) => {
    StoreLocationModel.checkExists(Obj, (err1, data) => {
        if (data && data.length > 0) {
            var errMsg = "Location " + Obj.LocationName + " already exists!";
            result(errMsg, null);
        } else {
            var sql = ` UPDATE tbl_ecommerce_store_location SET  LocationName = ?, LocationDescription = ?, IsActive = ?,   Modified = ?,Modifiedby = ?  WHERE LocationId = ? `;
            var values = [Obj.LocationName, Obj.LocationDescription, Obj.IsActive, Obj.Modified, Obj.Modifiedby, Obj.LocationId];
            con.query(sql, values, (err, res) => {
                if (err)
                    return result(err, null);
                if (res.affectedRows == 0)
                    return result({ msg: "Location not updated!" }, null);
                result(null, { id: Obj.LocationId, ...Obj });
            });
        }
    })
};

//To remove the Location remove
StoreLocationModel.remove = (id, result) => {
    var sql = `UPDATE tbl_ecommerce_store_location SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE LocationId = '${id}' `;
    con.query(sql, (err, res) => {
        if (err)
            return result(null, err);
        if (res.affectedRows == 0)
            return result({ msg: "Location not deleted" }, null);
        return result(null, res);
    });
};

//To Check Exists
StoreLocationModel.checkExists = (Obj, result) => {
    var sql = `SELECT LocationName FROM tbl_ecommerce_store_location WHERE LocationName='${Obj.LocationName}' AND IsDeleted=0`;
    if(Obj.LocationId && Obj.LocationId > 0){
        sql += ` AND LocationId NOT IN(${Obj.LocationId})`
    }
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
};
module.exports = StoreLocationModel;
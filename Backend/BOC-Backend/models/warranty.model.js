/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
const WarrantyModel = function FuncName(objWarranty) {
    this.WarrantyId = objWarranty.WarrantyId;
    this.WarrantyName = objWarranty.WarrantyName;
    this.WarrantyMonth = objWarranty.WarrantyMonth;
};

//To get all Warranty
WarrantyModel.getAll = (result) => {
    var sql = `Select WarrantyId,WarrantyName ,WarrantyMonth FROM tbl_master_warranty  WHERE IsDeleted=0`;
    con.query(sql, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        return result(null, res);
    });
};
module.exports = WarrantyModel;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");

const AutoScriptModel = function (objSalesOrder) {

}

AutoScriptModel.UpdateMissingInvPOQuery = (reqBody, result) => {
    /*  var sql = `SELECT I.InvoiceId,I.InvoiceNo,I.CustomerBlanketPOId,BPO.CustomerBlanketPOId as BPOCustomerBlanketPOId, BPO.CustomerPONo  
  FROM tbl_invoice as I
  LEFT JOIN tbl_customer_blanket_po as BPO ON BPO.CustomerBlanketPOId = I.CustomerBlanketPOId
  WHERE I.IsDeleted = 0 AND I.CustomerBlanketPOId>0 AND (I.CustomerPONo = '' OR I.CustomerPONo IS NULL)  ;  `;*/

    var sql = `SELECT INV.InvoiceId, RR.CustomerPONo, RR.CustomerBlanketPOId FROM ahoms.tbl_invoice as INV
    LEFT JOIN tbl_repair_request as RR ON RR.RRId = INV.RRId
    WHERE INV.RRId > 0 AND INV.CustomerPONo = '' AND INV.IsDeleted = 0 AND RR.CustomerPONo != '' `;
    // console.log(sql)
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, res);
    });
};


AutoScriptModel.UpdateMissingInvPO = (val, result) => {
    var sql = `UPDATE tbl_invoice SET CustomerPONo='${val.CustomerPONo}' WHERE IsDeleted = 0 AND InvoiceId = ${val.InvoiceId};`;
    //console.log(sql)
    con.query(sql, (err, res) => {
        return result(null, res);
    });
};


AutoScriptModel.UpdateMissingPOInSOQuery = (reqBody, result) => {
    /*var sql = `SELECT SO.SOId, SO.SONo, SO.CustomerBlanketPOId, BPO.CustomerBlanketPOId as BPOCustomerBlanketPOId, BPO.CustomerPONo
FROM tbl_sales_order as SO
LEFT JOIN tbl_customer_blanket_po as BPO ON BPO.CustomerBlanketPOId = SO.CustomerBlanketPOId
WHERE SO.IsDeleted = 0 AND SO.CustomerBlanketPOId > 0 AND(SO.CustomerPONo = '' OR SO.CustomerPONo IS NULL);`;*/


    var sql = `SELECT SO.SOId, RR.CustomerPONo, RR.CustomerBlanketPOId FROM ahoms.tbl_sales_order as SO
    LEFT JOIN tbl_repair_request as RR ON RR.RRId = SO.RRId 
    WHERE SO.RRId > 0 AND SO.CustomerPONo = '' AND SO.IsDeleted = 0 AND RR.CustomerPONo != ''`;

    // console.log(sql)
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, res);
    });
};


AutoScriptModel.UpdateMissingPOInSO = (val, result) => {
    var sql = `UPDATE tbl_sales_order SET CustomerPONo='${val.CustomerPONo}' WHERE IsDeleted = 0 AND SOId = ${val.SOId};`;
    // console.log(sql)
    con.query(sql, (err, res) => {
        return result(null, res);
    });
};





AutoScriptModel.UpdateMissingPOInRRQuery = (reqBody, result) => {
    var sql = `SELECT RR.RRId, RR.RRNo, RR.CustomerBlanketPOId, BPO.CustomerBlanketPOId as BPOCustomerBlanketPOId, BPO.CustomerPONo
FROM tbl_repair_request as RR
LEFT JOIN tbl_customer_blanket_po as BPO ON BPO.CustomerBlanketPOId = RR.CustomerBlanketPOId AND BPO.IsActive = 1
WHERE RR.IsDeleted = 0 AND RR.CustomerBlanketPOId > 0 AND(RR.CustomerPONo = '' OR RR.CustomerPONo IS NULL);`;
    // console.log(sql)
    con.query(sql, (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, res);
    });
};


AutoScriptModel.UpdateMissingPOInRR = (val, result) => {
    var sql = `UPDATE tbl_repair_request SET CustomerPONo='${val.CustomerPONo}' WHERE IsDeleted = 0 AND RRId = ${val.RRId};`;
    // console.log(sql)
    con.query(sql, (err, res) => {
        return result(null, res);
    });
};





module.exports = AutoScriptModel;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const Constants = require("../config/constants.js");

const AutoScriptFindIssuesModel = function (objAttachment) {

};
// For RR
AutoScriptFindIssuesModel.RRBlanketPOMismatchList = (objmodel, result) => {
    var sql = `SELECT  H.RRId, H.MROID,H.QuoteId,H.BlanketPOHistoryId,INV.CustomerBlanketPOId, INV.InvoiceId,INV.InvoiceNo,INV.GrandTotal,ROUND(INV.BaseGrandTotal,2) as BaseGrandTotal,ROUND(INV.BlanketPOExcludeAmount,2) as BlanketPOExcludeAmount,ROUND(INV.BlanketPONetAmount,2) as BlanketPONetAmount,ROUND((INV.BlanketPONetAmount-H.Amount),2) as DiffAmount, H.PaymentType, H.Amount,H.BaseAmount,H.Created,H.Modified  FROM 
ahoms.tbl_invoice as INV
LEFT JOIN tbl_customer_blanket_po_history as H ON H.BlanketPOId = INV.CustomerBlanketPOId AND H.RRId = INV.RRId AND H.IsDeleted = 0
WHERE INV.IsDeleted = 0 AND ROUND(H.Amount,2) !=ROUND(INV.BlanketPONetAmount,2) AND PaymentType = 2 AND INV.RRId>0 AND  INV.CustomerBlanketPOId>0 AND INV.RRId NOT IN(113662,
144366,
112879,
125506,
116688,
132888,
131963,
122846,
122849,
133844,
132295,
134788,
113660,
133763,
135796,
144077,
135681,
136534,
144268,
142092,
142093,
145442,
146346,
146347,
146261,
146691,
147439,
148010,
148011,
145496,
147397,
149086,
156159) ORDER BY BlanketPOHistoryId ASC LIMIT 0,100`;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);

        return result(null, res);
    });
};

AutoScriptFindIssuesModel.FixRRBlanketPOIssue = (objmodel, result) => {
    var Amount = objmodel.BlanketPONetAmount - objmodel.Amount;
    var sql_update1 = `UPDATE tbl_customer_blanket_po SET CurrentBalance=CurrentBalance-(${objmodel.DiffAmount}), BaseCurrentBalance=BaseCurrentBalance-${parseFloat(objmodel.DiffAmount)} WHERE CustomerBlanketPOId =${objmodel.CustomerBlanketPOId}`;
    var sql_update2 = `UPDATE tbl_customer_blanket_po_history SET Amount=Amount +(${objmodel.DiffAmount})   ,CurrentBalance=CurrentBalance -(${objmodel.DiffAmount}),
      Modified='${cDateTime.getDateTime()}'
    WHERE BlanketPOHistoryId =${objmodel.BlanketPOHistoryId}`;
    //console.log(sql_update1);
    // console.log(sql_update2);
    async.parallel([
        function (result) { con.query(sql_update1, result) },
        function (result) { con.query(sql_update2, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            result(null, results[0][0]);
        }
    );
};

// For QT
AutoScriptFindIssuesModel.QTBlanketPOMismatchList = (objmodel, result) => {
    var sql = `SELECT  H.RRId, H.MROID,H.QuoteId,H.BlanketPOHistoryId,INV.CustomerBlanketPOId, INV.InvoiceId,INV.InvoiceNo,SO.SONo,INV.GrandTotal,ROUND(INV.BaseGrandTotal,2) as BaseGrandTotal,ROUND(INV.BlanketPOExcludeAmount,2) as BlanketPOExcludeAmount,ROUND(INV.BlanketPONetAmount,2) as BlanketPONetAmount,ROUND((INV.BlanketPONetAmount-H.Amount),2) as DiffAmount,H.PaymentType, H.Amount,H.BaseAmount,H.Created FROM 
ahoms.tbl_invoice as INV
LEFT JOIN tbl_sales_order as SO ON SO.SOId = INV.SOId AND SO.IsDeleted = 0
LEFT JOIN tbl_customer_blanket_po_history as H ON H.BlanketPOId = INV.CustomerBlanketPOId AND H.QuoteId = SO.QuoteId
WHERE INV.IsDeleted = 0  AND SO.SOId > 0 AND ROUND(H.Amount,2) !=ROUND(INV.BlanketPONetAmount,2) AND INV.RRId=0 AND H.MROId=0  AND INV.MROId=0 AND  INV.CustomerBlanketPOId>0 AND H.QuoteId NOT IN(155827,
155428,
139359,
144606,
144696,
144743,
145038,
145057,
145276,
145377,
145751,
145875,
144427,
144719,
145026,
149145,
152132,
154365,
150529,
154867,
151203,
152320,
155335,
150856);`;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);

        return result(null, res);
    });
};


AutoScriptFindIssuesModel.MRONonInvocieFix = (objmodel, result) => {
    /* var sql = `SELECT BlanketPOHistoryId, SO.CustomerBlanketPOId,SO.GrandTotal ,ROUND(SO.BlanketPONetAmount,2),H.Amount ,ROUND((SO.BlanketPONetAmount-H.Amount),2) as DiffAmount  FROM ahoms.tbl_customer_blanket_po_history  as H
 LEFT JOIN tbl_sales_order as SO ON SO.MROId = H.MROId and SO.IsDeleted = 0
 WHERE H.MROId!=10739 AND ROUND(H.Amount) !=ROUND(SO.BlanketPONetAmount,2) AND  H.MROId IN(10045,
 10054,
 10055,
 10077,
 10078,
 10081,
 10092,
 10094,
 10111,
 10120,
 10251,
 10319,
 10335,
 10336,
 10337,
 10339,
 10345,
 10363,
 10374,
 10397,
 10431,
 10438,
 10464,
 10506,
 10507,
 10515,
 10516,
 10669,
 10670,
 10677,
 10739,
 10759,
 10768,
 10778,
 10779,
 10790,
 10835,
 10896,
 10929,
 10939,
 10985,
 10989,
 11023,
 11038,
 11043,
 11049,
 11051,
 11075,
 11077,
 11091,
 11104,
 11131,
 11151,
 11174,
 11183,
 11184,
 11189) AND BlanketPOHistoryId IN(9033,9032,8270,7848,7568,7353,7260); `;*/

    var sql = `   SELECT MRO.MROId, MRO.MRONo, BlanketPOHistoryId, SO.CustomerBlanketPOId, SO.GrandTotal, ROUND(SO.BlanketPONetAmount, 2), H.Amount, ROUND((ROUND(((SELECT SUM(BlanketPONetAmount) FROM tbl_invoice WHERE SOId = SO.SOId)), 2) - H.Amount), 2) as DiffAmount,
        ROUND(((SELECT SUM(BlanketPONetAmount) FROM tbl_invoice WHERE SOId = SO.SOId)), 2) as InvocieAmount
    FROM ahoms.tbl_customer_blanket_po_history as H
    LEFT JOIN tbl_sales_order as SO ON SO.MROId = H.MROId and SO.IsDeleted = 0
    LEFT JOIN tbl_mro as MRO ON MRO.MROId = SO.MROId and SO.IsDeleted = 0
    WHERE MRO.Status = 7 and MRO.ISDeleted = 0 AND H.IsDeleted = 0 AND BlanketPOHistoryId IN(7144,
        11456,
        11457,
        6411,
        7431,
        10297,
        11487,
        11488,
        6401,
        11012,
        11481,
        11482,
        11484,
        11483,
        11486,
        9843,
        12727,
        8043,
        13569,
        13567,
        13565,
        11207,
        13872,
        13874);`;



    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);

        return result(null, res);
    });
};

// For MRO
AutoScriptFindIssuesModel.MROBlanketPOMismatchList = (objmodel, result) => {
    var sql = `SELECT  INV.MROId,H.BlanketPOHistoryId, INV.InvoiceId,INV.InvoiceNo,INV.GrandTotal,ROUND(INV.BaseGrandTotal,2) as BaseGrandTotal,INV.CustomerBlanketPOId,ROUND(INV.BlanketPONetAmount,2) as BlanketPONetAmount, H.Amount,H.BaseAmount,H.Created,INV.SOId,INV.InvoiceId,INV.MROId,ROUND((SO.BlanketPONetAmount-H.Amount),2) as DiffAmount,
    CASE mro.Status 
WHEN 0 THEN '${Constants.array_mro_status[0]}'
WHEN 1 THEN '${Constants.array_mro_status[1]}'
WHEN 2 THEN '${Constants.array_mro_status[2]}'
WHEN 3 THEN '${Constants.array_mro_status[3]}'
WHEN 4 THEN '${Constants.array_mro_status[4]}'
WHEN 5 THEN '${Constants.array_mro_status[5]}'
WHEN 6 THEN '${Constants.array_mro_status[6]}'
WHEN 7 THEN '${Constants.array_mro_status[7]}' 
ELSE '-' end StatusName,mro.Status
FROM ahoms.tbl_invoice as INV
LEFT JOIN tbl_mro as mro ON mro.MROId = INV.MROId
LEFT JOIN tbl_sales_order as SO ON SO.SOId = INV.SOId AND SO.IsDeleted=0
LEFT JOIN tbl_customer_blanket_po_history as H ON H.BlanketPOId = INV.CustomerBlanketPOId AND H.MROId = INV.MROId
WHERE INV.IsDeleted = 0 AND ROUND(H.Amount,2) !=ROUND(INV.BlanketPONetAmount,2) AND INV.MROId>0 AND  INV.CustomerBlanketPOId>0 AND mro.Status=7  ORDER BY INV.InvoiceId DESC`;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);

        return result(null, res);
    });
};
AutoScriptFindIssuesModel.MROBlanketPOMismatchPendingList = (objmodel, result) => {
    var sql = `SELECT  INV.MROId,H.BlanketPOHistoryId, INV.InvoiceId,INV.InvoiceNo,INV.GrandTotal,ROUND(INV.BaseGrandTotal,2) as BaseGrandTotal,INV.CustomerBlanketPOId,ROUND(INV.BlanketPONetAmount,2) as BlanketPONetAmount, H.Amount,H.BaseAmount,H.Created,INV.SOId,INV.InvoiceId,INV.MROId,ROUND((SO.BlanketPONetAmount-H.Amount),2) as DiffAmount,
    CASE mro.Status 
WHEN 0 THEN '${Constants.array_mro_status[0]}'
WHEN 1 THEN '${Constants.array_mro_status[1]}'
WHEN 2 THEN '${Constants.array_mro_status[2]}'
WHEN 3 THEN '${Constants.array_mro_status[3]}'
WHEN 4 THEN '${Constants.array_mro_status[4]}'
WHEN 5 THEN '${Constants.array_mro_status[5]}'
WHEN 6 THEN '${Constants.array_mro_status[6]}'
WHEN 7 THEN '${Constants.array_mro_status[7]}' 
ELSE '-' end StatusName,mro.Status
FROM ahoms.tbl_invoice as INV
LEFT JOIN tbl_mro as mro ON mro.MROId = INV.MROId
LEFT JOIN tbl_sales_order as SO ON SO.SOId = INV.SOId AND SO.IsDeleted=0
LEFT JOIN tbl_customer_blanket_po_history as H ON H.BlanketPOId = INV.CustomerBlanketPOId AND H.MROId = INV.MROId
WHERE INV.IsDeleted = 0 AND ROUND(H.Amount,2) !=ROUND(INV.BlanketPONetAmount,2) AND INV.MROId>0 AND  INV.CustomerBlanketPOId>0 AND mro.Status!=7  ORDER BY INV.InvoiceId DESC`;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);

        return result(null, res);
    });
}
// AutoScriptFindIssuesModel.MROBlanketPOMismatchPendingList = (objmodel, result) => {
//     var sql = `SELECT  H.BlanketPOHistoryId, INV.InvoiceId,INV.InvoiceNo,INV.GrandTotal,ROUND(INV.BaseGrandTotal,2) as BaseGrandTotal,INV.CustomerBlanketPOId,ROUND(INV.BlanketPONetAmount,2) as BlanketPONetAmount, H.Amount,H.BaseAmount,H.Created,INV.SOId,INV.InvoiceId,INV.MROId,ROUND((INV.BlanketPONetAmount-H.Amount),2) as DiffAmount FROM 
// ahoms.tbl_invoice as INV
// LEFT JOIN tbl_customer_blanket_po_history as H ON H.BlanketPOId = INV.CustomerBlanketPOId AND H.MROId = INV.MROId
// WHERE INV.IsDeleted = 0 AND ROUND(H.Amount,2) !=ROUND(INV.BlanketPONetAmount,2) AND INV.MROId>0 AND  INV.CustomerBlanketPOId>0 ORDER BY INV.InvoiceId DESC `;
//     con.query(sql, async (err, data) => {
//         if (err) {
//             return result(err, null);
//         } else {
//             var resp = [];
//             async.forEachOf(data, function (val, i, inner_callback) {
//                 AutoScriptFindIssuesModel.getSOandINVCount(val.SOId, val.MROId, (_getErr, getData) => {
//                     // console.log(getData);
//                     if (getData && getData.SOItem && getData.INVItem) {
//                         if (getData.SOItem.length != getData.INVItem.length) {
//                             if (val.BlanketPOHistoryId > 0 && val.InvoiceId > 0) {
//                                 resp.push(val);
//                                 console.log(val);

//                             }
//                         }
//                     }
//                     console.log(i + "===" + (data.length - 1));
//                     if (i === (data.length - 1)) {
//                         // console.log(resp);
//                         // inner_callback(resp);
//                         return result(null, resp);
//                     }
//                 });
//             });
//         }

//     });
// };

AutoScriptFindIssuesModel.FixMROBlanketPOIssue = (objmodel, result) => {
    var Amount = objmodel.BlanketPONetAmount - objmodel.Amount;
    var sql_update1 = `UPDATE tbl_customer_blanket_po SET CurrentBalance=CurrentBalance-(${Amount}), BaseCurrentBalance=BaseCurrentBalance-${parseFloat(Amount)} WHERE CustomerBlanketPOId =${objmodel.CustomerBlanketPOId}`;
    var sql_update2 = `UPDATE tbl_customer_blanket_po_history SET Amount=Amount +(${Amount}) ,CurrentBalance=CurrentBalance -(${Amount}),
      Modified='${cDateTime.getDateTime()}'
    WHERE BlanketPOHistoryId =${objmodel.BlanketPOHistoryId}`;
    // console.log(sql_update1);
    //console.log(sql_update2);
    async.parallel([
        function (result) { con.query(sql_update1, result) },
        function (result) { con.query(sql_update2, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            result(null, results[0][0]);
        }
    );
};

AutoScriptFindIssuesModel.getSOandINVCount = async (SOId, MROId, result) => {
    var sqlSOitem = `SELECT * FROM ahoms.tbl_sales_order_item as SOI
WHERE SOI.IsDeleted = 0 AND SOI.SOId=${SOId}`;
    var sqlINVitem = `SELECT * FROM ahoms.tbl_invoice as II
WHERE II.IsDeleted = 0 AND II.MROId=${MROId}`;
    // console.log("sqlSOitem ", sqlSOitem)
    // console.log("sqlINVitem ", sqlINVitem)
    async.parallel([
        function (result) { con.query(sqlSOitem, result) },
        function (result) { con.query(sqlINVitem, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            result(null, {
                SOItem: results[0][0],
                INVItem: results[1][0]
            });
        }
    );
};

// async function getSOandINVCount(SOId, InvoiceId) {

//     var sqlSOitem = `SELECT * FROM ahoms.tbl_sales_order_item as SOI
//     WHERE SOI.IsDeleted = 0 AND SOI.SOId=${SOId}`;
//     var sqlINVitem = `SELECT * FROM ahoms.tbl_invoice_item as II
//     WHERE II.IsDeleted = 0 AND II.InvoiceId=${InvoiceId}`;
//     console.log("sqlSOitem", sqlSOitem)
//     async.parallel([
//         function (result) { con.query(sqlSOitem, result) },
//         function (result) { con.query(sqlINVitem, result) }
//     ],
//         function (err, results) {
//             if (err)
//                 return result(err, null);

//             return {
//                 SOItem: results[0][0],
//                 INVItem: results[1][0]
//             };
//         }
//     );
// };

// For RR Using SO
AutoScriptFindIssuesModel.RRBlanketPOMismatchListBySO = (objmodel, result) => {
    var sql = `SELECT  H.BlanketPOHistoryId, SO.SOId,SO.SONo,SO.GrandTotal,ROUND(SO.BaseGrandTotal,2) as BaseGrandTotal,SO.CustomerBlanketPOId,ROUND(SO.BlanketPONetAmount,2) as BlanketPONetAmount, H.Amount,H.BaseAmount,H.Created,ROUND((SO.BlanketPONetAmount-H.Amount),2) as DiffAmount FROM 
ahoms.tbl_sales_order as SO
LEFT JOIN tbl_customer_blanket_po_history as H ON H.BlanketPOId = SO.CustomerBlanketPOId AND H.RRId = SO.RRId
LEFT JOIN tbl_invoice as INV ON INV.SOId = SO.SOId
WHERE SO.IsDeleted = 0 AND ROUND(H.Amount,2) !=ROUND(SO.BlanketPONetAmount,2) AND SO.RRId>0 AND SO.CustomerBlanketPOId>0 AND INV.InvoiceId Is NULL LIMIT 0,1`;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);

        return result(null, res);
    });
};

// For QT Using SO
AutoScriptFindIssuesModel.QTBlanketPOMismatchListBySO = (objmodel, result) => {
    var sql = `SELECT  H.BlanketPOHistoryId, SO.SOId,SO.SONo,SO.GrandTotal,ROUND(SO.BaseGrandTotal,2) as BaseGrandTotal,SO.CustomerBlanketPOId,ROUND(SO.BlanketPONetAmount,2) as BlanketPONetAmount, H.Amount,H.BaseAmount,H.Created,ROUND((SO.BlanketPONetAmount-H.Amount),2) as DiffAmount FROM 
ahoms.tbl_sales_order as SO
LEFT JOIN tbl_customer_blanket_po_history as H ON H.BlanketPOId = SO.CustomerBlanketPOId AND H.QuoteId = SO.QuoteId
LEFT JOIN tbl_invoice as INV ON INV.SOId = SO.SOId
WHERE SO.IsDeleted = 0 AND ROUND(H.Amount,2) !=ROUND(SO.BlanketPONetAmount,2) AND SO.RRId=0 AND SO.MROId=0 AND  SO.CustomerBlanketPOId>0 AND INV.InvoiceId Is NULL LIMIT 0,1`;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);

        return result(null, res);
    });
};

// For QT Using SO
AutoScriptFindIssuesModel.MROBlanketPOMismatchListBySO = (objmodel, result) => {
    var sql = `SELECT  H.BlanketPOHistoryId, SO.SOId,SO.SONo,SO.GrandTotal,ROUND(SO.BaseGrandTotal,2) as BaseGrandTotal,SO.CustomerBlanketPOId,ROUND(SO.BlanketPONetAmount,2) as BlanketPONetAmount, H.Amount,H.BaseAmount,H.Created,ROUND((SO.BlanketPONetAmount-H.Amount),2) as DiffAmount FROM 
ahoms.tbl_sales_order as SO
LEFT JOIN tbl_customer_blanket_po_history as H ON H.BlanketPOId = SO.CustomerBlanketPOId AND H.MROId = SO.MROId
LEFT JOIN tbl_invoice as INV ON INV.SOId = SO.SOId
WHERE SO.IsDeleted = 0 AND ROUND(H.Amount,2) !=ROUND(SO.BlanketPONetAmount,2) AND SO.RRId=0 AND SO.MROId>0 AND  SO.CustomerBlanketPOId>0 AND INV.InvoiceId Is NULL LIMIT 0,1`;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);

        return result(null, res);
    });
};



module.exports = AutoScriptFindIssuesModel;
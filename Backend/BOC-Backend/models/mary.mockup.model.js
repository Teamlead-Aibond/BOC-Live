/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");

const MaryGoldModel = function (Obj) {

}

MaryGoldModel.CategoryStatistics = (ReqBody, result) => {
    var where = '';
    if (ReqBody.FromDate) {
        where += ` AND ExpenseDate >=  "${ReqBody.FromDate}" `
    }
    if (ReqBody.ToDate) {
        where += ` AND ExpenseDate <=  "${ReqBody.ToDate}" `
    }
    var sql = `Select SUM(Exp.AmountSpent) as AmountSpent, Exp.CategoryId, Cat.CategoryName, Cat.CategoryImage  from tbl_marymock_customer_expenses   as Exp
    LEFT JOIN tbl_marymock_categories as Cat  ON Cat.CategoryId = Exp.CategoryId  
    WHERE Exp.IsDeleted = 0 ${where}  GROUP BY Exp.CategoryId`;
    //console.log(sql);
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

MaryGoldModel.SubCategoryStatistics = (ReqBody, result) => {
    var where = '';
    if (ReqBody.FromDate) {
        where += ` AND ExpenseDate >=  "${ReqBody.FromDate}" `
    }
    if (ReqBody.ToDate) {
        where += ` AND ExpenseDate <=  "${ReqBody.ToDate}" `
    }
    if (ReqBody.CategoryId) {
        where += ` AND Exp.CategoryId <=  ${ReqBody.CategoryId} `
    }
    con.query(`Select SUM(Exp.AmountSpent) as AmountSpent, Exp.SubCategoryId, Sub.SubCategoryName   from tbl_marymock_customer_expenses   as Exp
    LEFT JOIN tbl_marymock_subcategories as Sub  ON Sub.SubCategoryId = Exp.SubCategoryId  
    WHERE Exp.IsDeleted = 0 ${where}  GROUP BY Exp.SubCategoryId`, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}


MaryGoldModel.CategoryList = result => {
    con.query(`Select * from tbl_marymock_categories WHERE IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}
MaryGoldModel.SubCategoryList = result => {
    con.query(`Select Sub.*,Cat.CategoryName from tbl_marymock_subcategories as Sub 
    LEFT JOIN tbl_marymock_categories as Cat  ON Cat.CategoryId = Sub.CategoryId  
    WHERE Sub.IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}
MaryGoldModel.CustomerList = result => {
    con.query(`Select * from tbl_marymock_customers WHERE IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}
MaryGoldModel.ExpenseList = result => {
    con.query(`Select Exp.*, C.Name,C.Phone,C.Email,Cat.CategoryName,Sub.SubCategoryName  from tbl_marymock_customer_expenses as Exp
    LEFT JOIN tbl_marymock_categories as Cat  ON Cat.CategoryId = Exp.CategoryId 
    LEFT JOIN tbl_marymock_subcategories as Sub  ON Sub.SubCategoryId = Exp.SubCategoryId 
    LEFT JOIN tbl_marymock_customers as C  ON C.CustomerId = Exp.CustomerId 
     WHERE Exp.IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}


module.exports = MaryGoldModel;
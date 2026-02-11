/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
var async = require('async');
const CustomerGroupModel = function (obj) {
    this.CustomerGroupId = obj.CustomerGroupId;
    this.CustomerGroupName = obj.CustomerGroupName ? obj.CustomerGroupName : '';
    this.CustomerGroupDesc = obj.CustomerGroupDesc ? obj.CustomerGroupDesc : '';
    this.MultipleCustomerIds = obj.MultipleCustomerIds ? obj.MultipleCustomerIds : [];
    this.IsActive = obj.IsActive;
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (obj.authuser && obj.authuser.UserId) ? obj.authuser.UserId : TokenUserId;
};

//To get all the Customer Group getAll
CustomerGroupModel.getAll = result => {
    con.query(`Select CustomerGroupId,CustomerGroupName,CustomerGroupDesc,IsActive from tbl_customer_group WHERE  IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

//To create a Customer Group dropdown
CustomerGroupModel.dropdown = result => {
    con.query(`Select CustomerGroupId,CustomerGroupName,CustomerGroupDesc,IsActive from tbl_customer_group WHERE IsActive = 1 AND IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}


//To create a Customer Group create
CustomerGroupModel.create = (Obj, result) => {
    CustomerGroupModel.checkExists(Obj, (err1, data) => {
        if (data && data.length > 0) {
            var errMsg = "Customer Group " + Obj.CustomerGroupName + " already exists!";
            result(errMsg, null);
        } else {
            var sql = `insert into tbl_customer_group(CustomerGroupName,CustomerGroupDesc,IsActive,Created,CreatedBy) values(?,?,?,?,?)`;
            var values = [Obj.CustomerGroupName, Obj.CustomerGroupDesc, Obj.IsActive, Obj.Created, Obj.CreatedBy];
            con.query(sql, values, (err, res) => {
                if (err){
                    return result(err, null);
                }else{
                    if(Obj.MultipleCustomerIds != ''){
                        var sql1 = `UPDATE tbl_customers SET CustomerGroupId = ${res.insertId} WHERE CustomerId IN (${Obj.MultipleCustomerIds})`;
                        async.parallel([
                            function (result) { con.query(sql1, result) },
                          ],function (err, results) {});
                    }
                    return result(null, { id: res.insertId, ...Obj });
                }
                    
                
            });
        }
    })
};

//To get the Customer Group info
CustomerGroupModel.findById = (CustomerGroupId, result) => {
    var sql = `SELECT CustomerGroupId,CustomerGroupName,CustomerGroupDesc,IsActive,
    (SELECT GROUP_CONCAT(CustomerId) FROM tbl_customers where CustomerGroupId = ${CustomerGroupId} AND IsDeleted=0) as MultipleCustomerIds
    FROM tbl_customer_group  WHERE CustomerGroupId = ${CustomerGroupId} `;
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        if (res.length) {
            return result(null, res[0]);
        }
        return result({ msg: "Customer Group not found" }, null);
    });
};

//To update the Customer Group update
CustomerGroupModel.update = (Obj, result) => {
    CustomerGroupModel.checkExists(Obj, (err1, data) => {
        if (data && data.length > 0) {
            var errMsg = "Customer Group " + Obj.CustomerGroupName + " already exists!";
            result(errMsg, null);
        } else {
            var sql = ` UPDATE tbl_customer_group SET  CustomerGroupName = ?, CustomerGroupDesc = ?, IsActive = ?,   Modified = ?,Modifiedby = ?  WHERE CustomerGroupId = ? `;
            var values = [Obj.CustomerGroupName, Obj.CustomerGroupDesc, Obj.IsActive, Obj.Modified, Obj.Modifiedby, Obj.CustomerGroupId];

            var sql3 = `SELECT GROUP_CONCAT(CustomerId) as GCustomerId FROM tbl_customers where CustomerGroupId = ${Obj.CustomerGroupId} AND IsDeleted=0`;

            async.parallel([
                function (result) { con.query(sql, values, result) },
                function (result) { con.query(sql3, values, result) },
            ],
                function (err, results) {
                    if (err) {
                        return result(err, null);
                    } else {
                       // console.log(results[1][0][0].GCustomerId);
                        var GCustomerId = results[1] && results[1][0] && results[1][0][0].GCustomerId != '' ? results[1][0][0].GCustomerId : '';

                        var sql1 = `UPDATE tbl_customers SET CustomerGroupId = 0 WHERE CustomerId IN (${GCustomerId})`;
                        var sql2 = `UPDATE tbl_customers SET CustomerGroupId = ${Obj.CustomerGroupId} WHERE CustomerId IN (${Obj.MultipleCustomerIds})`;
                        async.parallel([
                            function (result) { if (GCustomerId != '') { con.query(sql1, result) } else { CustomerGroupModel.emptyFunction(sql1, result); } },
                        ],
                            function (err1, results1) {
                                if (Obj.MultipleCustomerIds != '') {
                                    async.parallel([
                                        function (result) { if (Obj.MultipleCustomerIds != '') { con.query(sql2, result) } else { CustomerGroupModel.emptyFunction(sql2, result); } },
                                    ],
                                        function (err2, results2) { });
                                }
                            });
                        result(null, { id: Obj.CustomerGroupId, ...Obj });
                    }

                });
        }
    })
};

// Empty Function
CustomerGroupModel.emptyFunction = (val, result) => {
    result(null, { empty: 1 });
    return;
};

//To remove the Customer Group remove
CustomerGroupModel.remove = (id, result) => {
    var sql = `UPDATE tbl_customer_group SET IsDeleted = 1,Modified='${cDateTime.getDateTime()}', ModifiedBy='${global.authuser.UserId}' WHERE CustomerGroupId = '${id}' `;
    con.query(sql, (err, res) => {
        if (err)
            return result(null, err);
        if (res.affectedRows == 0)
            return result({ msg: "Customer Group not deleted" }, null);
        return result(null, res);
    });
};

//To Check Exists
CustomerGroupModel.checkExists = (Obj, result) => {
    var sql = `SELECT CustomerGroupName FROM tbl_customer_group WHERE CustomerGroupName='${Obj.CustomerGroupName}' AND IsDeleted=0`;
    if (Obj.CustomerGroupId && Obj.CustomerGroupId > 0) {
        sql += ` AND CustomerGroupId NOT IN(${Obj.CustomerGroupId})`
    }
    con.query(sql, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
};
module.exports = CustomerGroupModel;
/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");
var cDateTime = require("../utils/generic.js");
const Constants = require("../config/constants.js");
var async = require('async');
const { escapeSqlValues } = require("../helper/common.function.js");

const Employee = function (Obj) {
    this.EmployeeId = Obj.EmployeeId;
    this.EmployeeNo = Obj.EmployeeNo;
    this.EmployeeName = Obj.EmployeeName ? Obj.EmployeeName : '';
    this.EmployeeGender = Obj.EmployeeGender ? Obj.EmployeeGender : 0;
    this.EmployeeAddress = Obj.EmployeeAddress ? Obj.EmployeeAddress : '';
    this.EmployeePhoneNo = Obj.EmployeePhoneNo ? Obj.EmployeePhoneNo : '';
    this.EmployeeEmail = Obj.EmployeeEmail ? Obj.EmployeeEmail : '';
    this.EmployeeResponsibilites = Obj.EmployeeResponsibilites ? Obj.EmployeeResponsibilites : '';
    this.EmployeeJobRole = Obj.EmployeeJobRole ? Obj.EmployeeJobRole : 0;
    this.EmployeeRFIDTagNo = Obj.EmployeeRFIDTagNo ? Obj.EmployeeRFIDTagNo : '';
    this.Created = cDateTime.getDateTime();
    this.Modified = cDateTime.getDateTime();
    const TokenUserId = global.authuser.UserId ? global.authuser.UserId : 0;
    this.CreatedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;
    this.ModifiedBy = (Obj.authuser && Obj.authuser.UserId) ? Obj.authuser.UserId : TokenUserId;


    // For Server Side Search 
    this.start = Obj.start;
    this.length = Obj.length;
    this.search = Obj.search;
    this.draw = Obj.draw;
    this.columns = Obj.columns;

    this.sortCol = Obj.sortCol;
    this.sortDir = Obj.sortDir;
    this.sortColName = Obj.sortColName;
    this.order = Obj.order;
    this.columns = Obj.columns;
    this.draw = Obj.draw;

};

// Get Search List by Filter
Employee.EmployeeListByServerSide = (Employee, result) => {

    var query = "";
    var selectquery = "";

    selectquery = ` SELECT e.EmployeeId,EmployeeNo,EmployeeName,EmployeeAddress,EmployeePhoneNo,EmployeeEmail,
    CASE e.EmployeeGender
  WHEN 1 THEN '${Constants.gender_type[1]}'
  WHEN 2 THEN '${Constants.gender_type[2]}'
  ELSE '-'	end EmployeeGender,
  (SELECT GROUP_CONCAT(ter.EmployeeResponsibility) FROM tbl_employee_responsibility as ter  WHERE FIND_IN_SET(ter.EmployeeResponsibilityId, (e.EmployeeResponsibilites))) as EmployeeResponsibilites, 
   CASE e.EmployeeJobRole
   WHEN 1 THEN '${Constants.employee_job_role[1]}'
   WHEN 2 THEN '${Constants.employee_job_role[2]}'
   WHEN 3 THEN '${Constants.employee_job_role[3]}'
   WHEN 4 THEN '${Constants.employee_job_role[4]}'
   WHEN 5 THEN '${Constants.employee_job_role[5]}'
  ELSE '-'
  end EmployeeJobRole,EmployeeRFIDTagNo
 
 `;
    recordfilterquery = `Select count(e.EmployeeId) as recordsFiltered `;
    query = query + ` FROM tbl_employee as e where e.IsDeleted=0 `;

    if (Employee.search.value != '') {
        query = query + ` and (  EmployeeNo LIKE '%${Employee.search.value}%'
              or EmployeeName LIKE '%${Employee.search.value}%' 
              or EmployeeGender LIKE '%${Employee.search.value}%' 
              or EmployeePhoneNo LIKE '%${Employee.search.value}%' 
              or EmployeeEmail LIKE '%${Employee.search.value}%' 
              or EmployeeRFIDTagNo LIKE '%${Employee.search.value}%' 
            ) `;
    }




    var cvalue = 0;
    for (cvalue = 0; cvalue < Employee.columns.length; cvalue++) {
        if (Employee.columns[cvalue].search.value != "") {
            switch (Employee.columns[cvalue].name) {
                case "EmployeeNo":
                    query += " and  e.EmployeeNo = '" + Employee.columns[cvalue].search.value + "'  ";
                    break;
                case "EmployeeName":
                    query += " and  e.EmployeeName  = '" + Employee.columns[cvalue].search.value + "'  ";
                    break;
                case "EmployeeEmail":
                    query += " and  e.EmployeeEmail  = '" + Employee.columns[cvalue].search.value + "' ";
                    break;
                case "EmployeeRFIDTagNo":
                    query += " and  e.EmployeeRFIDTagNo = '" + Employee.columns[cvalue].search.value + "' ";
                    break;
                case "EmployeeResponsibilites":
                    query += " and  e.EmployeeResponsibilites  = '" + Employee.columns[cvalue].search.value + "' ";
                    break;
                case "EmployeeJobRole":
                    query += " and  e.EmployeeJobRole  = '" + Employee.columns[cvalue].search.value + "' ";
                    break;


                default:
                    query += " and ( " + Employee.columns[cvalue].name + " LIKE '%" + Employee.columns[cvalue].search.value + "%' ) ";
            }
        }
    }

    query += " ORDER BY " + Employee.columns[Employee.order[0].column].name + " " + Employee.order[0].dir;

    var Countquery = recordfilterquery + query;

    if (Employee.start != "-1" && Employee.length != "-1") {
        query += " LIMIT " + Employee.start + "," + (Employee.length);
    }
    query = selectquery + query;

    var TotalCountQuery = `SELECT Count(EmployeeId) as TotalCount 
    FROM tbl_employee as e
    where e.IsDeleted=0 `;
    async.parallel([
        function (result) { con.query(query, result) },
        function (result) { con.query(Countquery, result) },
        function (result) { con.query(TotalCountQuery, result) }
    ],
        function (err, results) {
            if (err)
                return result(err, null);

            // console.log("TotalCount : " + results[2][0][0].TotalCount)
            result(null, { data: results[0][0], recordsFiltered: results[1][0][0].recordsFiltered, recordsTotal: results[2][0][0].TotalCount, draw: Employee.draw });
            return;
        }
    );

};

Employee.employeeList = (result) => {
    con.query(`Select EmployeeId,EmployeeNo,EmployeeName,EmployeeRFIDTagNo
     from tbl_employee WHERE IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
};

Employee.getEmployeeNo = (EmployeeRFIDTagNo, result) => {
    con.query(`Select EmployeeNo from tbl_employee WHERE IsDeleted = 0 AND EmployeeRFIDTagNo='${EmployeeRFIDTagNo}'`, (err, res) => {
        //console.log(res);
        if (err)
            return result(err, null);
        if(res && res.length > 0){
            return result(null, res[0]);
        }else{
            // return result(null, {msg: "No records found!"});
            return result({msg: "No records found!"}, null);
        }
        
    });
};

Employee.Delete = (id, result) => {
    var sql = `UPDATE tbl_employee SET IsDeleted = 1 WHERE EmployeeId = ${id}`;
    con.query(sql, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            result({ msg: "Employee not found" }, null);
            return;
        }
        result(null, res);
    });
};

Employee.Create = (Employee, result) => {
    var checkTagNoExistsSql = `SELECT * FROM tbl_employee WHERE EmployeeRFIDTagNo = ${Employee.EmployeeRFIDTagNo}`;
    
    var checkEmployeeExistsSql = `SELECT * FROM tbl_employee WHERE EmployeeNo = "${Employee.EmployeeNo}" AND IsDeleted = 0`;
    con.query(checkTagNoExistsSql, (e, data) => {
        if(data && data.length > 0){
            return result({ msg: "RFID Tag No : " + Employee.EmployeeRFIDTagNo + ' is already assigned to ' + data[0].EmployeeName }, null);
        }
        else{
    con.query(checkEmployeeExistsSql, (e, data) => {
        if(data && data.length > 0){
            return result({ msg: " " + Employee.EmployeeNo + ' is already exist' }, null);
        }
        else{
            var sql = `insert into tbl_employee(EmployeeNo,EmployeeName,EmployeeGender,EmployeeAddress,
                EmployeePhoneNo,EmployeeEmail,EmployeeResponsibilites,EmployeeJobRole,EmployeeRFIDTagNo) 
            values(?,?,?,?,?,?,?,?,?)`;
            var values = [
                Employee.EmployeeNo, Employee.EmployeeName, Employee.EmployeeGender, Employee.EmployeeAddress,
                Employee.EmployeePhoneNo, Employee.EmployeeEmail, Employee.EmployeeResponsibilites,
                Employee.EmployeeJobRole, Employee.EmployeeRFIDTagNo,
            ]
            con.query(sql, values, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                return result(null, { id: res.insertId });
            });
        }
    });
}
});
};

Employee.findById = (EmployeeId, result) => {
    con.query(`SELECT EmployeeId, EmployeeNo, EmployeeName,EmployeeGender,EmployeeAddress,EmployeePhoneNo,EmployeeEmail,EmployeeResponsibilites,EmployeeJobRole,EmployeeRFIDTagNo 
    FROM tbl_employee  WHERE IsDeleted = 0 AND EmployeeId = ${EmployeeId}`, (err, res) => {
        if (err) {
            return result(err, null);
        }
        if (res.length) {
            return result(null, res[0]);
        }
        return result({ msg: "Employee not found" }, null);
    });
};

Employee.UpdateById = (Employee, result) => {
    var checkTagNoExistsSql = `SELECT * FROM tbl_employee WHERE EmployeeRFIDTagNo = ${Employee.EmployeeRFIDTagNo} AND EmployeeId != ${Employee.EmployeeId}`;
    var checkEmployeeExistsSql = `SELECT * FROM tbl_employee WHERE EmployeeNo = "${Employee.EmployeeNo}" AND EmployeeId != ${Employee.EmployeeId} AND IsDeleted = 0`;
    con.query(checkTagNoExistsSql, (e, data) => {
        if(data && data.length > 0){
            return result({ msg: "RFID Tag No : " + Employee.EmployeeRFIDTagNo + ' is already assigned to ' + data[0].EmployeeName }, null);
        }
        else{
            con.query(checkEmployeeExistsSql, (e, data) => {
                if(data && data.length > 0){
                    return result({ msg: " " + Employee.EmployeeNo + ' is already exist' }, null);
                }else{
            var sql = `UPDATE tbl_employee SET EmployeeNo = ?,EmployeeName =?,EmployeeGender=?,
            EmployeeAddress=?,EmployeePhoneNo=?,EmployeeEmail=?,
            EmployeeResponsibilites=?,EmployeeJobRole=?,EmployeeRFIDTagNo=?
            WHERE EmployeeId = ?`;
            var values = [
                Employee.EmployeeNo, Employee.EmployeeName, Employee.EmployeeGender,
                Employee.EmployeeAddress, Employee.EmployeePhoneNo, Employee.EmployeeEmail,
                Employee.EmployeeResponsibilites, Employee.EmployeeJobRole, Employee.EmployeeRFIDTagNo,
                Employee.EmployeeId
            ]
            con.query(sql, values, (err, res) => {
                if (err)
                    return result(err, null);
                if (res.affectedRows == 0)
                    return result({ msg: "Employee not updated!" }, null);
                result(null, { id: Employee.EmployeeId, ...Employee });
            }); 
        }
    
    });
}
});
};

Employee.getAllResponsibilityDDL = result => {
    con.query(`Select EmployeeResponsibilityId,EmployeeResponsibility
     from tbl_employee_responsibility WHERE IsActive = 1 AND IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}


Employee.getAllResponsibility = result => {
    con.query(`Select EmployeeResponsibilityId,EmployeeResponsibility,IsActive
     from tbl_employee_responsibility WHERE IsDeleted = 0 `, (err, res) => {
        if (err)
            return result(err, null);
        return result(null, res);
    });
}

Employee.DeleteResponsibility = (id, result) => {
    var sql = `UPDATE tbl_employee_responsibility SET IsDeleted = 1 WHERE EmployeeResponsibilityId = ${id}`;
    con.query(sql, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            result({ msg: "Employee Responsibility not found" }, null);
            return;
        }
        result(null, res);
    });
};

Employee.CreateResponsibility = (Employee, result) => {
    var sql = `insert into tbl_employee_responsibility(EmployeeResponsibility,IsActive) 
    values(?,?)`;
    var values = [
        Employee.EmployeeResponsibility, Employee.IsActive
    ]
    con.query(sql, values, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        return result(null, { id: res.insertId });
    });
};

Employee.findByIdResponsibility = (EmployeeResponsibilityId, result) => {
    con.query(`SELECT EmployeeResponsibility,IsActive,EmployeeResponsibilityId
    FROM tbl_employee_responsibility  WHERE IsDeleted = 0 AND EmployeeResponsibilityId = ${EmployeeResponsibilityId}`, (err, res) => {
        if (err) {
            return result(err, null);
        }
        if (res.length) {
            return result(null, res[0]);
        }
        return result({ msg: "Employee Responsibility not found" }, null);
    });
};

Employee.UpdateByIdResponsibility = (EmployeeResponsibility, result) => {

    var sql = `UPDATE tbl_employee_responsibility SET EmployeeResponsibility = ?,IsActive =?
     WHERE EmployeeResponsibilityId = ?`;
    var values = [
        EmployeeResponsibility.EmployeeResponsibility, EmployeeResponsibility.IsActive, EmployeeResponsibility.EmployeeResponsibilityId
    ]
    con.query(sql, values, (err, res) => {
        if (err)
            return result(err, null);
        if (res.affectedRows == 0)
            return result({ msg: "Employee Responsibility not updated!" }, null);
        result(null, { id: EmployeeResponsibility.EmployeeResponsibilityId, ...EmployeeResponsibility });
    });

};


module.exports = Employee;

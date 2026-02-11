/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");

// constructor
const Customers1 = function (objCustomers) {
  this.first_name = objCustomers.first_name;
  this.last_name = objCustomers.last_name;
  this.mobile_number = objCustomers.mobile_number;
  this.gender = objCustomers.gender;
  this.language_id = objCustomers.language_id;
  this.city = objCustomers.city;
  this.registered_date = objCustomers.registered_date;
};


Customers1.create = (newCustomer, result) => {

  var sql = 'INSERT INTO tbl_customers SET ?'

  con.query(sql, newCustomer, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    // console.log("created new customer : ", { id: res.insertId, ...newCustomer });
    return result(null, { id: res.insertId, ...newCustomer });
  });
};



Customers1.findById = (customer_id, result) => {
  con.query(`SELECT first_name,last_name FROM tbl_customers WHERE customer_id = ${customer_id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found the customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "customer not found" }, null);
  });
};

Customers1.getAll = result => {
  con.query("SELECT first_name,last_name  FROM tbl_customers", (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }
    //console.log("Customer Loaded from DB (API): ", res);
    result(null, res);
  });
};

module.exports = Customers1;
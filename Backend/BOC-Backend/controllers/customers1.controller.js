/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Customers1 = require("../models/customers1.model.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
//
  var cDateTime = require("../utils/generic.js");

  // Create a new admin
  const Customers1 = new Customers1({
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    mobile_number : req.body.mobile_number,
    gender : req.body.gender,
    city : req.body.city,
    language_id : req.body.language_id,
    registered_date :  cDateTime.getDateTime()
  });

  // Save admin user in the database
  Customers.create(Customers1, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the customer."
      });
    else res.send(data);
  });
};


// Find a single customer user with a customer_id
exports.findOne = (req, res) => {
  Customers1.findById(req.params.customer_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found customer with id ${req.params.customer_id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.customer_id
        });
      }
    } else res.send(data);
  });
};


// Find a single customer user with a customer_id
exports.getByMobileNo = (req, res) => {
  Customers1.findbyMobileNumber(req.params.mobile_number, (err, data) => {
  if (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found customer with mobile no ${req.params.mobile_number}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Customer with mobile no " + req.params.mobile_number
      });
    }
  } else res.send(data);
});
};


// Retrieve all customers from the database.
exports.getAll = (req, res) => {
  Customers1.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customer."
      });
    else res.send(data);
  });
};
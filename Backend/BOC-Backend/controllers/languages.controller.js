/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const Languages = require("../models/languages.model.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a language
  const language = new Languages({
    language: req.body.language,
    active: req.body.active
  });

  // Save language in the database
  Languages.create(language, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the language."
      });
    else res.send(data);
  });
};


// Find a single language with a languageid
exports.findOne = (req, res) => {
  Languages.findById(req.params.language_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Languages with id ${req.params.language_id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Languages with id " + req.params.language_id
        });
      }
    } else res.send(data);
  });
};

// Retrieve all languages from the database.
exports.findAll = (req, res) => {
  Languages.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving languages."
      });
    else res.send(data);
  });
};

// Update a language identified by the languageid in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  //console.log(req.body);

  Languages.updateById(
    req.params.language_id,
    new Languages(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found language with id ${req.params.language_id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating language with id " + req.params.language_id
          });
        }
      } else res.send(data);
    }
  );
};


// Delete a language with the specified languageid in the request
exports.delete = (req, res) => {
  Languages.remove(req.params.language_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found language with id ${req.params.language_id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete language with id " + req.params.language_id
        });
      }
    } else res.send({ message: `Language was deleted successfully!` });
  });
};
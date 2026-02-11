/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */
const con = require("../helper/db.js");

// constructor
const Languages = function (language) {
  this.language = language.language;
  this.active = language.active;
};

Languages.create = (newLanguage, result) => {
  con.query("INSERT INTO tbl_languages SET ?", newLanguage, (err, res) => {
    if (err) {
      //  console.log("error: ", err);
      result(err, null);
      return;
    }

    //console.log("created language: ", { id: res.insertId, ...newLanguage });
    result(null, { id: res.insertId, ...newLanguage });
  });
};

Languages.findById = (language_id, result) => {
  con.query(`SELECT * FROM tbl_languages WHERE language_id = ${language_id}`, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log("found language: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Languages.getAll = result => {
  con.query("SELECT * FROM tbl_languages", (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log("language: ", res);
    result(null, res);
  });
};

Languages.updateById = (id, objLanguage, result) => {
  con.query(
    "UPDATE tbl_languages SET language = ?, active = ? WHERE language_id = ?",
    [objLanguage.language, objLanguage.active, id],
    (err, res) => {
      if (err) {
        // console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Language with the id
        result({ kind: "not_found" }, null);
        return;
      }

      // console.log("updated language: ", { id: id, ...objLanguage });
      result(null, { id: id, ...objLanguage });
    }
  );
  // console.log("Updated language!");
};


Languages.remove = (id, result) => {
  con.query("DELETE FROM tbl_languages WHERE language_id = ?", id, (err, res) => {
    if (err) {
      //  console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found language with the id
      result({ kind: "not_found" }, null);
      return;
    }

    // console.log("deleted language with language_id: ", id);
    result(null, res);
  });
};

module.exports = Languages;
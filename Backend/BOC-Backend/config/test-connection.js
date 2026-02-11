const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "db_crm",
});

connection.connect(err => {
    if (err) return console.error("Connection error:", err);
    console.log("Connected successfully!");
    connection.end();
});

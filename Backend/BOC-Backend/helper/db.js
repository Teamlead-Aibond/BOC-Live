/* ===================================================
* @copyright Copyright  2020 - 2023 Aibond Corp.
*
* All Rights Reserved.
*
* ========================================================== */

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    connectionLimit : process.env.DB_CLIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to MySQL with mysql2/promise!");
        connection.release();
    } catch (err) {
        console.error("Failed to connect to MySQL:", err);
        process.exit(1); // Exit if DB connection fails
    }
}

testConnection();

module.exports = pool;
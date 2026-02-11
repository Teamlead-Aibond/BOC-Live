/* ===================================================
 * @copyright Copyright  2020 - 2023 Aibond Corp.
 *
 * All Rights Reserved.
 *
 * ========================================================== */

const mysql = require("mysql2");

// Local MySQL database configuration
const dbConfig = {
  CONNECTIONLIMIT: 10,       // Max number of connections in pool
  HOST: "localhost",         // Localhost for dev
  USER: "root",              // Your MySQL username
  PASSWORD: "root123",  // Your MySQL password
  DB: "db_crm",              // Database name
};

// Create connection pool
const pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  waitForConnections: true,
  connectionLimit: dbConfig.CONNECTIONLIMIT,
});

// Export promise-based pool for async/await
const db = pool.promise();

module.exports = db;

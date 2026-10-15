const mysql2 = require("mysql2/promise")

// Create the connection pool. The pool-specific settings are the defaults
// const pool = mysql2.createPool({
//   host:                  process.env.db_host || 'localhost',
//   user:                  process.env.db_user || 'root',
//   database:              process.env.db_database || 'ptpm',
//   password:              process.env.db_password || "admin",
//   waitForConnections:    true,
//   connectionLimit:       5,
//   maxIdle:               10, // max idle connections, the default value is the same as `connectionLimit`
//   idleTimeout:           20, // idle connections timeout, in milliseconds, the default value 60000
//   queueLimit:            0,
//   enableKeepAlive:       true,
//   keepAliveInitialDelay: 0,
// });

function getConnection() {
  return mysql2.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'ptpm',
    password: process.env.DB_PASS || "",
    port: process.env.DB_PORT || 3306
  })
}

module.exports = {getConnection};
const mysql = require('mysql2/promise');
const env = require('./env');

function createPool() {
  return mysql.createPool({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPass,
    database: env.dbName,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

function getPool() {
  if (!process.__PTTKPM_DB_POOL__) {
    process.__PTTKPM_DB_POOL__ = createPool();
  }

  return process.__PTTKPM_DB_POOL__;
}

async function closePool() {
  if (process.__PTTKPM_DB_POOL__) {
    await process.__PTTKPM_DB_POOL__.end();
    process.__PTTKPM_DB_POOL__ = null;
  }
}

module.exports = {
  query(...args) {
    return getPool().query(...args);
  },
  execute(...args) {
    return getPool().execute(...args);
  },
  getConnection(...args) {
    return getPool().getConnection(...args);
  },
  end() {
    return closePool();
  },
  closePool,
};

const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool with better timeout settings
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  maxIdle: 10,
  idleTimeout: 60000, // 60 seconds
  // Connection timeout settings
  connectTimeout: 60000, // 60 seconds
  // Keep alive settings for cloud databases
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // For SSL connection (required by most cloud databases)
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false  // Set to false for self-signed certificates
  } : false
});

// Get promise-based connection
const promisePool = pool.promise();

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    return;
  }
  connection.release();
});

module.exports = promisePool;

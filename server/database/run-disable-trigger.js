require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function disableTrigger() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false,
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Read and execute the SQL script
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'disable-auto-bill-trigger.sql'),
      'utf8'
    );

    await connection.query(sqlScript);
    console.log('✅ Successfully disabled After_Reading_Insert trigger');
    console.log('📝 Readings will no longer automatically generate bills');
    console.log('💡 You can now add readings without creating bills');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

disableTrigger();

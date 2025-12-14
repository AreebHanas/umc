/**
 * Database Migration Script
 * Runs the schema.sql file on your database (local or cloud)
 * Usage: node database/migrate.js
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const runMigration = async () => {
  let connection;
  
  try {
    console.log('Starting database migration...\n');
    
    // Step 1: Read the SQL schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log('Reading schema file:', schemaPath);
    const sqlContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Step 2: Connect to MySQL server (without database)
    console.log('Connecting to MySQL server...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true, // Important: allows multiple SQL statements
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false
    });
    
    console.log('Connected to MySQL server');
    
    // Step 2.5: Select the database first
    const dbName = process.env.DB_NAME || 'UtilityDB';
    console.log(`Using database: ${dbName}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await connection.query(`USE ${dbName}`);
    
    // Step 3: Execute the schema
    console.log('Executing schema...\n');
    
    // Split SQL content by semicolons, but handle DELIMITER sections
    const sqlStatements = [];
    let currentStatement = '';
    let inDelimiterBlock = false;
    let customDelimiter = ';';
    
    const lines = sqlContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip comments and empty lines
      if (trimmedLine.startsWith('--') || trimmedLine.length === 0) {
        continue;
      }
      
      // Handle DELIMITER changes
      if (trimmedLine.startsWith('DELIMITER')) {
        if (currentStatement.trim()) {
          sqlStatements.push(currentStatement.trim());
          currentStatement = '';
        }
        customDelimiter = trimmedLine.split(/\s+/)[1] || '//';
        inDelimiterBlock = customDelimiter !== ';';
        continue;
      }
      
      currentStatement += line + '\n';
      
      // Check if statement is complete
      if (inDelimiterBlock && trimmedLine.endsWith(customDelimiter)) {
        sqlStatements.push(currentStatement.replace(new RegExp(customDelimiter + '$'), '').trim());
        currentStatement = '';
      } else if (!inDelimiterBlock && trimmedLine.endsWith(';')) {
        sqlStatements.push(currentStatement.trim());
        currentStatement = '';
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim()) {
      sqlStatements.push(currentStatement.trim());
    }
    
    // Execute each statement
    for (const statement of sqlStatements) {
      if (statement && statement.length > 0) {
        try {
          await connection.query(statement);
        } catch (err) {
          if (!err.message.includes('already exists')) {
            console.warn('Warning:', err.message.substring(0, 100));
          }
        }
      }
    }
    
    // Step 4: Verify the database
    console.log('\n Verifying database setup...');
    await connection.query(`USE ${process.env.DB_NAME || 'UtilityDB'}`);
    
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`Database created successfully with ${tables.length} tables:\n`);
    
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });
    
    // Step 5: Show record counts
    console.log('\n Sample data counts:');
    const tableNames = ['Users', 'Customers', 'UtilityTypes', 'Tariffs', 'Meters', 'Readings', 'Bills', 'Payments'];
    
    for (const tableName of tableNames) {
      try {
        const [result] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   ${tableName}: ${result[0].count} records`);
      } catch (err) {
        console.log(`   ${tableName}: 0 records`);
      }
    }
    
    console.log('\n Migration completed successfully!');
    console.log('\n You can now start your server with: npm run dev');
    
  } catch (error) {
    console.error('\n Migration failed:', error.message);
    console.error('\n Error details:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
};

// Run the migration
runMigration();

/**
 * Update user passwords to match demo credentials
 */
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const updatePasswords = async () => {
  let connection;
  
  try {
    console.log('\n=== Updating User Passwords ===\n');
    
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'UtilityDB',
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false
    });
    
    console.log('✓ Connected to database');
    
    // Demo users with new passwords
    const users = [
      { username: 'admin', password: 'admin123', role: 'Admin' },
      { username: 'manager', password: 'manager123', role: 'Manager' },
      { username: 'officer', password: 'officer123', role: 'FieldOfficer' },
      { username: 'cashier', password: 'cashier123', role: 'Cashier' }
    ];
    
    // Update or insert each user
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Check if user exists
      const [existing] = await connection.query(
        'SELECT UserID FROM Users WHERE Username = ?',
        [user.username]
      );
      
      if (existing.length > 0) {
        // Update existing user
        await connection.query(
          'UPDATE Users SET PasswordHash = ?, Role = ? WHERE Username = ?',
          [hashedPassword, user.role, user.username]
        );
        console.log(`✓ Updated: ${user.username} (${user.role})`);
      } else {
        // Insert new user
        await connection.query(
          'INSERT INTO Users (Username, PasswordHash, Role) VALUES (?, ?, ?)',
          [user.username, hashedPassword, user.role]
        );
        console.log(`✓ Created: ${user.username} (${user.role})`);
      }
    }
    
    console.log('\n=== Password Update Complete ===');
    console.log('\nDemo Credentials:');
    console.log('  admin / admin123 (Admin)');
    console.log('  manager / manager123 (Manager)');
    console.log('  officer / officer123 (Field Officer)');
    console.log('  cashier / cashier123 (Cashier)\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed\n');
    }
  }
};

// Run the update
updatePasswords();

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Connected to database');

    // Check if Payments table has any data
    const [payments] = await connection.query('SELECT COUNT(*) as count FROM Payments');
    console.log(`\n📊 Total Payments: ${payments[0].count}`);

    // Try the actual stats query
    console.log('\n🔍 Testing stats query...');
    const [rows] = await connection.query(`
      SELECT 
        COUNT(*) as TotalPayments,
        COALESCE(SUM(AmountPaid), 0) as TotalAmount,
        PaymentMethod,
        DATE(PaymentDate) as PaymentDay
      FROM Payments
      WHERE PaymentDate >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY PaymentMethod, DATE(PaymentDate)
      ORDER BY PaymentDate DESC
    `);

    console.log('Query result:', JSON.stringify(rows, null, 2));

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testDatabase();

require('dotenv').config();
const mysql = require('mysql2/promise');

async function enableTrigger() {
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

    // Drop the trigger if it exists
    await connection.query('DROP TRIGGER IF EXISTS After_Reading_Insert');
    
    // Re-create the trigger
    const createTrigger = `
      CREATE TRIGGER After_Reading_Insert
      AFTER INSERT ON Readings
      FOR EACH ROW
      BEGIN
          DECLARE v_Rate DECIMAL(10,2);
          DECLARE v_Units DECIMAL(10,2);
          DECLARE v_Total DECIMAL(10,2);
          
          -- 1. Calculate Units Consumed
          SET v_Units = NEW.CurrentReading - NEW.PreviousReading;
          
          -- 2. Get Tariff Rate
          SET v_Rate = GetTariffRate(NEW.MeterID);
          
          -- 3. Calculate Total Cost
          SET v_Total = (v_Units * v_Rate);
          
          -- 4. Create the Bill automatically
          INSERT INTO Bills (ReadingID, BillDate, UnitsConsumed, TotalAmount, DueDate, Status)
          VALUES (NEW.ReadingID, CURDATE(), v_Units, v_Total, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Unpaid');
          
      END
    `;

    await connection.query(createTrigger);
    console.log('✅ Successfully enabled After_Reading_Insert trigger');
    console.log('📝 Readings will now automatically generate bills');
    console.log('💡 Flow: Add Reading → Auto-create Bill → Appears in Billing Page');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

enableTrigger();

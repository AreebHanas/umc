require('dotenv').config();
const mysql = require('mysql2/promise');

async function createGetTariffRateFunction() {
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

    // Drop the function if it exists
    await connection.query('DROP FUNCTION IF EXISTS GetTariffRate');
    console.log('📝 Dropped existing GetTariffRate function (if any)');
    
    // Create the GetTariffRate function
    const createFunction = `
      CREATE FUNCTION GetTariffRate(p_MeterID INT) 
      RETURNS DECIMAL(10,2)
      DETERMINISTIC
      READS SQL DATA
      BEGIN
          DECLARE v_Rate DECIMAL(10,2);
          
          SELECT t.RatePerUnit INTO v_Rate
          FROM Tariffs t
          JOIN Meters m ON t.UtilityTypeID = m.UtilityTypeID
          JOIN Customers c ON m.CustomerID = c.CustomerID
          WHERE m.MeterID = p_MeterID 
            AND t.CustomerType = c.CustomerType
          LIMIT 1;
          
          RETURN IFNULL(v_Rate, 0);
      END
    `;

    await connection.query(createFunction);
    console.log('✅ Successfully created GetTariffRate function');
    console.log('💡 This function calculates the tariff rate based on meter and customer type');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    if (connection) await connection.end();
    process.exit(1);
  }
}

createGetTariffRateFunction();

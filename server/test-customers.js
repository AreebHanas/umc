const db = require('./config/database');

(async () => {
  try {
    console.log('Testing database connection...');
    const [rows] = await db.query('SELECT * FROM Customers');
    console.log('✅ Successfully fetched customers');
    console.log('Customers count:', rows.length);
    console.log('Sample data:', rows.slice(0, 2));
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();

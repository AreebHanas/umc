const axios = require('axios');

async function testPaymentStats() {
  try {
    console.log('Testing payment stats endpoint...');
    const response = await axios.get('http://localhost:5000/api/payments/stats');
    console.log('✅ Success! Payment stats:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
  process.exit(0);
}

testPaymentStats();

const app = require('./app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

try {
    app.listen(PORT, () => {
      console.log('\n=================================');
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}/api`);
      console.log('=================================\n');
    });
} catch (error) {
    console.error('Failed to start server:', error.message);
}

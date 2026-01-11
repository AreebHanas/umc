const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const routes = require('./routes');

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Use routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;

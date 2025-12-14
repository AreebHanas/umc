const express = require('express');
const router = express.Router();

// Import all route modules
const userRoutes = require('./userRoutes');
const customerRoutes = require('./customerRoutes');
const meterRoutes = require('./meterRoutes');
const readingRoutes = require('./readingRoutes');
const billRoutes = require('./billRoutes');
const paymentRoutes = require('./paymentRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/customers', customerRoutes);
router.use('/meters', meterRoutes);
router.use('/readings', readingRoutes);
router.use('/bills', billRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;

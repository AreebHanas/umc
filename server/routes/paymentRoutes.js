const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');

// View routes: Admin, Manager, Cashier
router.get('/stats', authenticate, authorize(['Admin', 'Manager', 'Cashier']), paymentController.getPaymentStats);
router.get('/bill/:billId', authenticate, authorize(['Admin', 'Manager', 'Cashier']), paymentController.getPaymentsByBillId);
router.get('/', authenticate, authorize(['Admin', 'Manager', 'Cashier']), paymentController.getAllPayments);
router.get('/:id', authenticate, authorize(['Admin', 'Manager', 'Cashier']), paymentController.getPaymentById);

// Create payment: Admin, Manager, Cashier
router.post('/', authenticate, authorize(['Admin', 'Manager', 'Cashier']), paymentController.createPayment);

// Delete: Admin and Manager only
router.delete('/:id', authenticate, authorize(['Admin', 'Manager']), paymentController.deletePayment);

module.exports = router;

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/stats', paymentController.getPaymentStats);
router.get('/bill/:billId', paymentController.getPaymentsByBillId);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/', paymentController.createPayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;

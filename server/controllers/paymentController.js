const Payment = require('../models/paymentModel');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

// Get payments by bill ID
exports.getPaymentsByBillId = async (req, res) => {
  try {
    const payments = await Payment.findByBillId(req.params.billId);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Create new payment
exports.createPayment = async (req, res) => {
  try {
    const { BillID, AmountPaid, PaymentMethod, ProcessedBy } = req.body;
    
    if (!BillID || !AmountPaid || !PaymentMethod) {
      return res.status(400).json({ error: 'BillID, AmountPaid, and PaymentMethod are required' });
    }

    const paymentId = await Payment.create({ BillID, AmountPaid, PaymentMethod, ProcessedBy });
    
    res.status(201).json({ 
      PaymentID: paymentId, 
      BillID, 
      AmountPaid, 
      PaymentMethod,
      message: 'Payment processed successfully. Bill marked as paid.' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const affectedRows = await Payment.delete(req.params.id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const stats = await Payment.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment statistics', details: error.message });
  }
};

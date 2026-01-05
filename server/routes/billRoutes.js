const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const { authenticate, authorize } = require('../middleware/auth');

// View routes: Admin, Manager, Cashier
router.get('/', authenticate, authorize(['Admin', 'Manager', 'Cashier']), billController.getAllBills);
router.get('/unpaid', authenticate, authorize(['Admin', 'Manager', 'Cashier']), billController.getUnpaidBills);
router.get('/status/:status', authenticate, authorize(['Admin', 'Manager', 'Cashier']), billController.getBillsByStatus);
router.get('/customer/:customerId', authenticate, authorize(['Admin', 'Manager', 'Cashier']), billController.getBillsByCustomerId);
router.get('/:id/report', authenticate, authorize(['Admin', 'Manager', 'Cashier']), billController.generateBillReport);
router.get('/:id', authenticate, authorize(['Admin', 'Manager', 'Cashier']), billController.getBillById);

// Pay bill: Admin, Manager, Cashier
router.post('/:id/pay', authenticate, authorize(['Admin', 'Manager', 'Cashier']), billController.payBill);

// Update/Delete: Admin and Manager only
router.put('/:id/status', authenticate, authorize(['Admin', 'Manager']), billController.updateBillStatus);
router.post('/mark-overdue', authenticate, authorize(['Admin', 'Manager']), billController.markOverdueBills);
router.delete('/:id', authenticate, authorize(['Admin', 'Manager']), billController.deleteBill);

module.exports = router;

const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/', billController.getAllBills);
router.get('/unpaid', billController.getUnpaidBills);
router.get('/status/:status', billController.getBillsByStatus);
router.get('/customer/:customerId', billController.getBillsByCustomerId);
router.post('/:id/pay', billController.payBill);
router.get('/:id/report', billController.generateBillReport);
router.get('/:id', billController.getBillById);
router.put('/:id/status', billController.updateBillStatus);
router.post('/mark-overdue', billController.markOverdueBills);
router.delete('/:id', billController.deleteBill);

module.exports = router;

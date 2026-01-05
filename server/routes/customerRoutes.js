const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticate, authorize } = require('../middleware/auth');

// All customer routes require authentication
router.get('/', authenticate, authorize(['Admin','Cashier']), customerController.getAllCustomers);
router.get('/search', authenticate, authorize(['Admin','Cashier']), customerController.searchCustomers);
router.get('/type/:type', authenticate, authorize(['Admin','Cashier']), customerController.getCustomersByType);
router.get('/:id/details', authenticate, authorize(['Admin','Cashier']), customerController.getCustomerDetails);
router.get('/:id/report', authenticate, authorize(['Admin','Cashier']), customerController.generateCustomerReport);
router.get('/:id', authenticate, authorize(['Admin','Cashier']), customerController.getCustomerById);

// Mutating routes only allowed for Admin
router.post('/', authenticate, authorize(['Admin']), customerController.createCustomer);
router.put('/:id', authenticate, authorize(['Admin']), customerController.updateCustomer);
router.delete('/:id', authenticate, authorize(['Admin']), customerController.deleteCustomer);

module.exports = router;

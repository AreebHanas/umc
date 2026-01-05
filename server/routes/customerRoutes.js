const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticate, authorize } = require('../middleware/auth');

// View routes: Admin, Manager, Cashier
router.get('/', authenticate, authorize(['Admin', 'Manager', 'Cashier']), customerController.getAllCustomers);
router.get('/search', authenticate, authorize(['Admin', 'Manager', 'Cashier']), customerController.searchCustomers);
router.get('/type/:type', authenticate, authorize(['Admin', 'Manager', 'Cashier']), customerController.getCustomersByType);
router.get('/:id/details', authenticate, authorize(['Admin', 'Manager', 'Cashier']), customerController.getCustomerDetails);
router.get('/:id/report', authenticate, authorize(['Admin', 'Manager', 'Cashier']), customerController.generateCustomerReport);
router.get('/:id', authenticate, authorize(['Admin', 'Manager', 'Cashier']), customerController.getCustomerById);

// Create/Update/Delete: Admin and Manager only
router.post('/', authenticate, authorize(['Admin', 'Manager']), customerController.createCustomer);
router.put('/:id', authenticate, authorize(['Admin', 'Manager']), customerController.updateCustomer);
router.delete('/:id', authenticate, authorize(['Admin', 'Manager']), customerController.deleteCustomer);

module.exports = router;

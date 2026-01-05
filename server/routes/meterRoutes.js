const express = require('express');
const router = express.Router();
const meterController = require('../controllers/meterController');
const { authenticate, authorize } = require('../middleware/auth');

// View routes: Admin, Manager, Field Officer
router.get('/', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), meterController.getAllMeters);
router.get('/status/:status', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), meterController.getMetersByStatus);
router.get('/customer/:customerId', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), meterController.getMetersByCustomerId);
router.get('/:id', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), meterController.getMeterById);

// Create/Update/Delete: Admin, Manager, Field Officer
router.post('/', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), meterController.createMeter);
router.put('/:id', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), meterController.updateMeter);
router.delete('/:id', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), meterController.deleteMeter);

module.exports = router;

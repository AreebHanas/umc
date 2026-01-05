const express = require('express');
const router = express.Router();
const readingController = require('../controllers/readingController');
const { authenticate, authorize } = require('../middleware/auth');

// View routes: Admin, Manager, Field Officer
router.get('/', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), readingController.getAllReadings);
router.get('/meter/:meterId', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), readingController.getReadingsByMeterId);
router.get('/meter/:meterId/last', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), readingController.getLastReading);
router.get('/:id', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), readingController.getReadingById);

// Create: Admin, Manager, Field Officer
router.post('/', authenticate, authorize(['Admin', 'Manager', 'FieldOfficer']), readingController.createReading);

// Update/Delete: Admin and Manager only
router.put('/:id', authenticate, authorize(['Admin', 'Manager']), readingController.updateReading);
router.delete('/:id', authenticate, authorize(['Admin', 'Manager']), readingController.deleteReading);

module.exports = router;

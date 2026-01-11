const Meter = require('../models/meterModel');

// Get all meters
exports.getAllMeters = async (req, res) => {
  try {
    const meters = await Meter.findAll();
    res.json(meters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meters' });
  }
};

// Get meter by ID
exports.getMeterById = async (req, res) => {
  try {
    const meter = await Meter.findById(req.params.id);
    if (!meter) {
      return res.status(404).json({ error: 'Meter not found' });
    }
    res.json(meter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meter' });
  }
};

// Get meters by customer ID
exports.getMetersByCustomerId = async (req, res) => {
  try {
    const meters = await Meter.findByCustomerId(req.params.customerId);
    res.json(meters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meters' });
  }
};

// Create new meter
exports.createMeter = async (req, res) => {
  try {
    const { SerialNumber, CustomerID, UtilityTypeID, InstallationDate, Status } = req.body;
    
    if (!SerialNumber || !CustomerID || !UtilityTypeID) {
      return res.status(400).json({ error: 'SerialNumber, CustomerID, and UtilityTypeID are required' });
    }

    const meterId = await Meter.create({ SerialNumber, CustomerID, UtilityTypeID, InstallationDate, Status });
    res.status(201).json({ 
      MeterID: meterId, 
      SerialNumber, 
      CustomerID, 
      UtilityTypeID,
      message: 'Meter created successfully' 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Serial number already exists' });
    }
    res.status(500).json({ error: 'Failed to create meter' });
  }
};

// Update meter
exports.updateMeter = async (req, res) => {
  try {
    const { SerialNumber, Status } = req.body;
    
    if (!SerialNumber || !Status) {
      return res.status(400).json({ error: 'SerialNumber and Status are required' });
    }

    const affectedRows = await Meter.update(req.params.id, { SerialNumber, Status });
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Meter not found' });
    }

    res.json({ 
      MeterID: req.params.id, 
      SerialNumber, 
      Status,
      message: 'Meter updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meter' });
  }
};

// Delete meter
exports.deleteMeter = async (req, res) => {
  try {
    const affectedRows = await Meter.delete(req.params.id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Meter not found' });
    }

    res.json({ message: 'Meter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meter' });
  }
};

// Get meters by status
exports.getMetersByStatus = async (req, res) => {
  try {
    const meters = await Meter.findByStatus(req.params.status);
    res.json(meters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meters' });
  }
};

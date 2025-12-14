const Reading = require('../models/readingModel');

// Get all readings
exports.getAllReadings = async (req, res) => {
  try {
    const readings = await Reading.findAll();
    res.json(readings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
};

// Get reading by ID
exports.getReadingById = async (req, res) => {
  try {
    const reading = await Reading.findById(req.params.id);
    if (!reading) {
      return res.status(404).json({ error: 'Reading not found' });
    }
    res.json(reading);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch reading' });
  }
};

// Get readings by meter ID
exports.getReadingsByMeterId = async (req, res) => {
  try {
    const readings = await Reading.findByMeterId(req.params.meterId);
    res.json(readings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
};

// Get last reading for a meter
exports.getLastReading = async (req, res) => {
  try {
    const reading = await Reading.getLastReading(req.params.meterId);
    if (!reading) {
      return res.status(404).json({ error: 'No readings found for this meter' });
    }
    res.json(reading);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch last reading' });
  }
};

// Create new reading (auto-generates bill via trigger)
exports.createReading = async (req, res) => {
  try {
    const { MeterID, ReadingDate, PreviousReading, CurrentReading, ReadingTakenBy } = req.body;
    
    if (!MeterID || !ReadingDate || PreviousReading === undefined || !CurrentReading) {
      return res.status(400).json({ error: 'MeterID, ReadingDate, PreviousReading, and CurrentReading are required' });
    }

    if (CurrentReading < PreviousReading) {
      return res.status(400).json({ error: 'Current reading must be greater than or equal to previous reading' });
    }

    const readingId = await Reading.create({ 
      MeterID, 
      ReadingDate, 
      PreviousReading, 
      CurrentReading, 
      ReadingTakenBy 
    });
    
    res.status(201).json({ 
      ReadingID: readingId, 
      MeterID, 
      CurrentReading,
      UnitsConsumed: CurrentReading - PreviousReading,
      message: 'Reading created successfully. Bill auto-generated.' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create reading' });
  }
};

// Update reading
exports.updateReading = async (req, res) => {
  try {
    const { CurrentReading } = req.body;
    
    if (CurrentReading === undefined) {
      return res.status(400).json({ error: 'CurrentReading is required' });
    }

    const affectedRows = await Reading.update(req.params.id, { CurrentReading });
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Reading not found' });
    }

    res.json({ 
      ReadingID: req.params.id, 
      CurrentReading,
      message: 'Reading updated successfully' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update reading' });
  }
};

// Delete reading
exports.deleteReading = async (req, res) => {
  try {
    const affectedRows = await Reading.delete(req.params.id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Reading not found' });
    }

    res.json({ message: 'Reading deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete reading' });
  }
};

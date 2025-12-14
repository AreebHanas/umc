const db = require('../config/database');

const Reading = {
  // Get all readings
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT r.*, m.SerialNumber, c.FullName, ut.TypeName, u.Username as TakenBy
      FROM Readings r
      JOIN Meters m ON r.MeterID = m.MeterID
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      LEFT JOIN Users u ON r.ReadingTakenBy = u.UserID
      ORDER BY r.ReadingDate DESC
    `);
    return rows;
  },

  // Get reading by ID
  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT r.*, m.SerialNumber, c.FullName, ut.TypeName
      FROM Readings r
      JOIN Meters m ON r.MeterID = m.MeterID
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      WHERE r.ReadingID = ?
    `, [id]);
    return rows[0];
  },

  // Get readings by meter ID
  findByMeterId: async (meterId) => {
    const [rows] = await db.query(`
      SELECT r.*, u.Username as TakenBy
      FROM Readings r
      LEFT JOIN Users u ON r.ReadingTakenBy = u.UserID
      WHERE r.MeterID = ?
      ORDER BY r.ReadingDate DESC
    `, [meterId]);
    return rows;
  },

  // Get last reading for a meter
  getLastReading: async (meterId) => {
    const [rows] = await db.query(`
      SELECT * FROM Readings 
      WHERE MeterID = ? 
      ORDER BY ReadingDate DESC 
      LIMIT 1
    `, [meterId]);
    return rows[0];
  },

  // Create new reading (Trigger will auto-create bill)
  create: async (readingData) => {
    const { MeterID, ReadingDate, PreviousReading, CurrentReading, ReadingTakenBy } = readingData;
    const [result] = await db.query(
      'INSERT INTO Readings (MeterID, ReadingDate, PreviousReading, CurrentReading, ReadingTakenBy) VALUES (?, ?, ?, ?, ?)',
      [MeterID, ReadingDate, PreviousReading, CurrentReading, ReadingTakenBy]
    );
    return result.insertId;
  },

  // Update reading
  update: async (id, readingData) => {
    const { CurrentReading } = readingData;
    const [result] = await db.query(
      'UPDATE Readings SET CurrentReading = ? WHERE ReadingID = ?',
      [CurrentReading, id]
    );
    return result.affectedRows;
  },

  // Delete reading
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM Readings WHERE ReadingID = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Reading;

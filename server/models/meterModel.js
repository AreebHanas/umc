const db = require('../config/database');

const Meter = {
  // Get all meters
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT m.*, c.FullName, ut.TypeName 
      FROM Meters m
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
    `);
    return rows;
  },

  // Get meter by ID
  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT m.*, c.FullName, c.Address, ut.TypeName, ut.UnitOfMeasure
      FROM Meters m
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      WHERE m.MeterID = ?
    `, [id]);
    return rows[0];
  },

  // Get meters by customer ID
  findByCustomerId: async (customerId) => {
    const [rows] = await db.query(`
      SELECT m.*, ut.TypeName, ut.UnitOfMeasure
      FROM Meters m
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      WHERE m.CustomerID = ?
    `, [customerId]);
    return rows;
  },

  // Create new meter
  create: async (meterData) => {
    const { SerialNumber, CustomerID, UtilityTypeID, InstallationDate, Status } = meterData;
    const [result] = await db.query(
      'INSERT INTO Meters (SerialNumber, CustomerID, UtilityTypeID, InstallationDate, Status) VALUES (?, ?, ?, ?, ?)',
      [SerialNumber, CustomerID, UtilityTypeID, InstallationDate, Status || 'Active']
    );
    return result.insertId;
  },

  // Update meter
  update: async (id, meterData) => {
    const { SerialNumber, Status } = meterData;
    const [result] = await db.query(
      'UPDATE Meters SET SerialNumber = ?, Status = ? WHERE MeterID = ?',
      [SerialNumber, Status, id]
    );
    return result.affectedRows;
  },

  // Delete meter
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM Meters WHERE MeterID = ?', [id]);
    return result.affectedRows;
  },

  // Get meters by status
  findByStatus: async (status) => {
    const [rows] = await db.query(`
      SELECT m.*, c.FullName, ut.TypeName 
      FROM Meters m
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      WHERE m.Status = ?
    `, [status]);
    return rows;
  }
};

module.exports = Meter;

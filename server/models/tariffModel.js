const db = require('../config/database');

const Tariff = {
  // Get all tariffs
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT t.*, ut.TypeName, ut.UnitOfMeasure
      FROM Tariffs t
      JOIN UtilityTypes ut ON t.UtilityTypeID = ut.UtilityTypeID
    `);
    return rows;
  },

  // Get tariff by ID
  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT t.*, ut.TypeName, ut.UnitOfMeasure
      FROM Tariffs t
      JOIN UtilityTypes ut ON t.UtilityTypeID = ut.UtilityTypeID
      WHERE t.TariffID = ?
    `, [id]);
    return rows[0];
  },

  // Get tariffs by utility type
  findByUtilityType: async (utilityTypeId) => {
    const [rows] = await db.query(`
      SELECT * FROM Tariffs WHERE UtilityTypeID = ?
    `, [utilityTypeId]);
    return rows;
  },

  // Create new tariff
  create: async (data) => {
    const { UtilityTypeID, CustomerType, RatePerUnit, FixedCharge } = data;
    const [result] = await db.query(
      'INSERT INTO Tariffs (UtilityTypeID, CustomerType, RatePerUnit, FixedCharge) VALUES (?, ?, ?, ?)',
      [UtilityTypeID, CustomerType, RatePerUnit, FixedCharge || 0]
    );
    return result.insertId;
  },

  // Update tariff
  update: async (id, data) => {
    const { RatePerUnit, FixedCharge } = data;
    const [result] = await db.query(
      'UPDATE Tariffs SET RatePerUnit = ?, FixedCharge = ? WHERE TariffID = ?',
      [RatePerUnit, FixedCharge, id]
    );
    return result.affectedRows;
  },

  // Delete tariff
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM Tariffs WHERE TariffID = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Tariff;

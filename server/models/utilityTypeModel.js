const db = require('../config/database');

const UtilityType = {
  // Get all utility types
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM UtilityTypes');
    return rows;
  },

  // Get utility type by ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM UtilityTypes WHERE UtilityTypeID = ?', [id]);
    return rows[0];
  },

  // Create new utility type
  create: async (data) => {
    const { TypeName, UnitOfMeasure } = data;
    const [result] = await db.query(
      'INSERT INTO UtilityTypes (TypeName, UnitOfMeasure) VALUES (?, ?)',
      [TypeName, UnitOfMeasure]
    );
    return result.insertId;
  },

  // Update utility type
  update: async (id, data) => {
    const { TypeName, UnitOfMeasure } = data;
    const [result] = await db.query(
      'UPDATE UtilityTypes SET TypeName = ?, UnitOfMeasure = ? WHERE UtilityTypeID = ?',
      [TypeName, UnitOfMeasure, id]
    );
    return result.affectedRows;
  },

  // Delete utility type
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM UtilityTypes WHERE UtilityTypeID = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = UtilityType;

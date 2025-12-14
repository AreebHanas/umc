const db = require('../config/database');

const Bill = {
  // Get all bills
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT b.*, c.FullName, c.Phone, ut.TypeName as Utility, m.SerialNumber
      FROM Bills b
      JOIN Readings r ON b.ReadingID = r.ReadingID
      JOIN Meters m ON r.MeterID = m.MeterID
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      ORDER BY b.BillDate DESC
    `);
    return rows;
  },

  // Get bill by ID
  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT b.*, c.*, ut.TypeName as Utility, m.SerialNumber
      FROM Bills b
      JOIN Readings r ON b.ReadingID = r.ReadingID
      JOIN Meters m ON r.MeterID = m.MeterID
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      WHERE b.BillID = ?
    `, [id]);
    return rows[0];
  },

  // Get bills by customer ID
  findByCustomerId: async (customerId) => {
    const [rows] = await db.query(`
      SELECT b.*, ut.TypeName as Utility, m.SerialNumber
      FROM Bills b
      JOIN Readings r ON b.ReadingID = r.ReadingID
      JOIN Meters m ON r.MeterID = m.MeterID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      WHERE m.CustomerID = ?
      ORDER BY b.BillDate DESC
    `, [customerId]);
    return rows;
  },

  // Get unpaid bills (using view)
  findUnpaid: async () => {
    const [rows] = await db.query('SELECT * FROM View_UnpaidBills');
    return rows;
  },

  // Get bills by status
  findByStatus: async (status) => {
    const [rows] = await db.query(`
      SELECT b.*, c.FullName, ut.TypeName as Utility
      FROM Bills b
      JOIN Readings r ON b.ReadingID = r.ReadingID
      JOIN Meters m ON r.MeterID = m.MeterID
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      WHERE b.Status = ?
      ORDER BY b.DueDate ASC
    `, [status]);
    return rows;
  },

  // Update bill status
  updateStatus: async (id, status) => {
    const [result] = await db.query(
      'UPDATE Bills SET Status = ? WHERE BillID = ?',
      [status, id]
    );
    return result.affectedRows;
  },

  // Delete bill
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM Bills WHERE BillID = ?', [id]);
    return result.affectedRows;
  },

  // Mark overdue bills
  markOverdue: async () => {
    const [result] = await db.query(`
      UPDATE Bills 
      SET Status = 'Overdue' 
      WHERE Status = 'Unpaid' AND DueDate < CURDATE()
    `);
    return result.affectedRows;
  }
};

module.exports = Bill;

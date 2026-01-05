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

  // Get bills for a customer for a specific month (with payment info if any)
  findByCustomerIdAndMonth: async (customerId, year, month) => {
    const [rows] = await db.query(`
      SELECT b.BillID, b.BillDate, b.UnitsConsumed, b.TotalAmount, b.Status,
             m.MeterID, m.SerialNumber, ut.TypeName as Utility, c.FullName, c.Address,
             p.PaymentID, DATE(p.PaymentDate) as PaymentDay, p.AmountPaid
      FROM Bills b
      JOIN Readings r ON b.ReadingID = r.ReadingID
      JOIN Meters m ON r.MeterID = m.MeterID
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      LEFT JOIN Payments p ON p.BillID = b.BillID AND YEAR(p.PaymentDate) = ? AND MONTH(p.PaymentDate) = ?
      WHERE c.CustomerID = ? AND YEAR(b.BillDate) = ? AND MONTH(b.BillDate) = ?
      ORDER BY b.BillDate ASC
    `, [year, month, customerId, year, month]);
    return rows;
  },

  // Get unpaid bills
  findUnpaid: async () => {
    const [rows] = await db.query(`
      SELECT 
        b.BillID, 
        b.ReadingID, 
        b.BillDate, 
        b.UnitsConsumed, 
        b.TotalAmount, 
        b.DueDate, 
        b.Status,
        c.CustomerID,
        c.FullName,
        c.Phone,
        ut.TypeName AS Utility,
        m.SerialNumber,
        DATEDIFF(CURDATE(), b.DueDate) AS DaysOverdue
      FROM Bills b
      JOIN Readings r ON b.ReadingID = r.ReadingID
      JOIN Meters m ON r.MeterID = m.MeterID
      JOIN Customers c ON m.CustomerID = c.CustomerID
      JOIN UtilityTypes ut ON m.UtilityTypeID = ut.UtilityTypeID
      WHERE b.Status = 'Unpaid'
      ORDER BY b.DueDate ASC
    `);
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

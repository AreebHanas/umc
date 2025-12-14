const db = require('../config/database');

const Payment = {
  // Get all payments
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT p.*, b.BillID, b.TotalAmount, c.FullName, u.Username as ProcessedBy
      FROM Payments p
      JOIN Bills b ON p.BillID = b.BillID
      JOIN Readings r ON b.ReadingID = r.ReadingID
      JOIN Meters m ON r.MeterID = m.MeterID
      JOIN Customers c ON m.CustomerID = c.CustomerID
      LEFT JOIN Users u ON p.ProcessedBy = u.UserID
      ORDER BY p.PaymentDate DESC
    `);
    return rows;
  },

  // Get payment by ID
  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT p.*, b.*, c.FullName
      FROM Payments p
      JOIN Bills b ON p.BillID = b.BillID
      JOIN Readings r ON b.ReadingID = r.ReadingID
      JOIN Meters m ON r.MeterID = m.MeterID
      JOIN Customers c ON m.CustomerID = c.CustomerID
      WHERE p.PaymentID = ?
    `, [id]);
    return rows[0];
  },

  // Get payments by bill ID
  findByBillId: async (billId) => {
    const [rows] = await db.query(`
      SELECT p.*, u.Username as ProcessedBy
      FROM Payments p
      LEFT JOIN Users u ON p.ProcessedBy = u.UserID
      WHERE p.BillID = ?
      ORDER BY p.PaymentDate DESC
    `, [billId]);
    return rows;
  },

  // Create new payment
  create: async (paymentData) => {
    const { BillID, AmountPaid, PaymentMethod, ProcessedBy } = paymentData;
    
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert payment
      const [result] = await connection.query(
        'INSERT INTO Payments (BillID, AmountPaid, PaymentMethod, ProcessedBy) VALUES (?, ?, ?, ?)',
        [BillID, AmountPaid, PaymentMethod, ProcessedBy]
      );

      // Update bill status to Paid
      await connection.query(
        'UPDATE Bills SET Status = ? WHERE BillID = ?',
        ['Paid', BillID]
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Delete payment
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM Payments WHERE PaymentID = ?', [id]);
    return result.affectedRows;
  },

  // Get payment statistics
  getStats: async () => {
    try {
      // First check if there are any payments
      const [countResult] = await db.query('SELECT COUNT(*) as count FROM Payments');
      
      if (countResult[0].count === 0) {
        // Return empty stats if no payments exist
        return {
          totalPayments: 0,
          totalAmount: 0,
          byMethod: [],
          recentPayments: []
        };
      }

      // Get payment statistics
      const [rows] = await db.query(`
        SELECT 
          COUNT(*) as TotalPayments,
          COALESCE(SUM(AmountPaid), 0) as TotalAmount,
          PaymentMethod,
          DATE(PaymentDate) as PaymentDay
        FROM Payments
        WHERE PaymentDate >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY PaymentMethod, DATE(PaymentDate)
        ORDER BY PaymentDate DESC
      `);
      
      return rows;
    } catch (error) {
      console.error('Error in getStats query:', error.message);
      console.error('Full error:', error);
      throw error;
    }
  }
};

module.exports = Payment;

const db = require('../config/database');

const Customer = {
  // Get all customers
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM Customers');
    return rows;
  },

  // Get customer by ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM Customers WHERE CustomerID = ?', [id]);
    return rows[0];
  },

  // Create new customer
  create: async (customerData) => {
    const { FullName, Address, Phone, CustomerType } = customerData;
    const [result] = await db.query(
      'INSERT INTO Customers (FullName, Address, Phone, CustomerType) VALUES (?, ?, ?, ?)',
      [FullName, Address, Phone, CustomerType]
    );
    return result.insertId;
  },

  // Update customer
  update: async (id, customerData) => {
    const { FullName, Address, Phone, CustomerType } = customerData;
    const [result] = await db.query(
      'UPDATE Customers SET FullName = ?, Address = ?, Phone = ?, CustomerType = ? WHERE CustomerID = ?',
      [FullName, Address, Phone, CustomerType, id]
    );
    return result.affectedRows;
  },

  // Delete customer
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM Customers WHERE CustomerID = ?', [id]);
    return result.affectedRows;
  },

  // Get customers by type
  findByType: async (type) => {
    const [rows] = await db.query('SELECT * FROM Customers WHERE CustomerType = ?', [type]);
    return rows;
  },

  // Search customers
  search: async (searchTerm) => {
    const [rows] = await db.query(
      'SELECT * FROM Customers WHERE FullName LIKE ? OR Phone LIKE ?',
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  }
};

module.exports = Customer;

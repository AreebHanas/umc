const db = require('../config/database');

const User = {
  // Get all users
  findAll: async () => {
    const [rows] = await db.query('SELECT UserID, Username, Role, CreatedAt FROM Users');
    return rows;
  },

  // Get user by ID
  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT UserID, Username, Role, CreatedAt FROM Users WHERE UserID = ?',
      [id]
    );
    return rows[0];
  },

  // Get user by username
  findByUsername: async (username) => {
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE Username = ?',
      [username]
    );
    return rows[0];
  },

  // Create new user
  create: async (userData) => {
    const { Username, PasswordHash, Role } = userData;
    const [result] = await db.query(
      'INSERT INTO Users (Username, PasswordHash, Role) VALUES (?, ?, ?)',
      [Username, PasswordHash, Role]
    );
    return result.insertId;
  },

  // Update user
  update: async (id, userData) => {
    const { Username, Role, PasswordHash } = userData;
    
    // Build dynamic query based on whether password is being updated
    let query = 'UPDATE Users SET Username = ?, Role = ?';
    let params = [Username, Role];
    
    if (PasswordHash) {
      query += ', PasswordHash = ?';
      params.push(PasswordHash);
    }
    
    query += ' WHERE UserID = ?';
    params.push(id);
    
    const [result] = await db.query(query, params);
    return result.affectedRows;
  },

  // Delete user
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM Users WHERE UserID = ?', [id]);
    return result.affectedRows;
  },

  // Get users by role
  findByRole: async (role) => {
    const [rows] = await db.query(
      'SELECT UserID, Username, Role, CreatedAt FROM Users WHERE Role = ?',
      [role]
    );
    return rows;
  }
};

module.exports = User;

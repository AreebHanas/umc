const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { Username, Password, Role } = req.body;
    
    if (!Username || !Password || !Role) {
      return res.status(400).json({ error: 'Username, Password, and Role are required' });
    }

    // Hash password (install bcryptjs: npm install bcryptjs)
    const PasswordHash = await bcrypt.hash(Password, 10);

    const userId = await User.create({ Username, PasswordHash, Role });
    res.status(201).json({ 
      UserID: userId, 
      Username, 
      Role,
      message: 'User created successfully' 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { Username, Role, Password } = req.body;
    
    if (!Username || !Role) {
      return res.status(400).json({ error: 'Username and Role are required' });
    }

    // If password is provided, hash it and update
    let updateData = { Username, Role };
    if (Password && Password.length >= 6) {
      const PasswordHash = await bcrypt.hash(Password, 10);
      updateData.PasswordHash = PasswordHash;
    }

    const affectedRows = await User.update(req.params.id, updateData);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      UserID: req.params.id, 
      Username, 
      Role,
      message: 'User updated successfully' 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const affectedRows = await User.delete(req.params.id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get users by role
exports.getUsersByRole = async (req, res) => {
  try {
    const users = await User.findByRole(req.params.role);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = Buffer.from(`${user.UserID}:${user.Username}:${Date.now()}`).toString('base64');

    const { PasswordHash, ...userData } = user;
    res.json({ 
      user: userData,
      token: token,
      message: 'Login successful' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};

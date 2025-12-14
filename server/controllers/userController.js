const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get users by role
exports.getUsersByRole = async (req, res) => {
  try {
    const users = await User.findByRole(req.params.role);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    console.log('\n=== LOGIN REQUEST ===');
    console.log('Body:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    console.log('🔍 Looking up user:', username);
    const user = await User.findByUsername(username);
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('✓ User found:', user.Username, '- Role:', user.Role);
    console.log('🔐 Comparing passwords...');
    const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('✓ Password valid');
    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`${user.UserID}:${user.Username}:${Date.now()}`).toString('base64');

    // Return user data without password
    const { PasswordHash, ...userData } = user;
    console.log('✅ Login successful - Sending response');
    console.log('User data:', userData);
    res.json({ 
      user: userData,
      token: token,
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

const User = require('../models/userModel');

// Simple authentication middleware that decodes the base64 token created at login
// Token format (created in login): base64(`${UserID}:${Username}:${timestamp}`)
exports.authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header) return res.status(401).json({ error: 'Missing authorization header' });

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid authorization header' });

    const token = parts[1];
    let decoded;
    try {
      decoded = Buffer.from(token, 'base64').toString('utf8');
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const [idStr, username] = decoded.split(':');
    const userId = Number(idStr);
    if (!userId || !username) return res.status(401).json({ error: 'Invalid token payload' });

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    // attach user (safe fields only)
    req.user = { UserID: user.UserID, Username: user.Username, Role: user.Role };
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Authorization middleware factory: allow if user's role is in allowedRoles
exports.authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
    if (!allowedRoles || allowedRoles.length === 0) return next();
    const role = req.user.Role;
    if (allowedRoles.includes(role)) return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
};

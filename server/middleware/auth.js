const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
const generateToken = (assessorId) => {
  return jwt.sign({ assessorId }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.assessorId = decoded.assessorId;
    next();
  });
};

// Optional auth - doesn't fail if no token
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.assessorId = decoded.assessorId;
      }
    });
  }
  next();
};

module.exports = {
  generateToken,
  authenticateToken,
  optionalAuth
};
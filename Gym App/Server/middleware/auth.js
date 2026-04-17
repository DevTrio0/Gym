const { verifyToken } = require('../utils/tokenUtils');

// Verify Bearer Token
const verifyBearerToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

// Check user role
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ status: 'error', message: `Access denied. ${requiredRole} role required` });
    }
    next();
  };
};

// Check multiple roles
const checkRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: `Access denied. Required roles: ${roles.join(', ')}` });
    }
    next();
  };
};

module.exports = {
  verifyBearerToken,
  checkRole,
  checkRoles
};

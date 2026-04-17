const { verifyToken } = require('../../utils/tokenUtils');

// Verify Bearer Token
const verifyBearerToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.warn('⚠️  No authorization token provided for:', req.method, req.path);
    return res.status(401).json({ status: 'error', message: 'Access token required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    console.warn('⚠️  Invalid or expired token for:', req.method, req.path);
    return res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
  }

  console.log('✅ Token verified for user:', decoded.userId, 'Role:', decoded.role);
  req.user = decoded;
  next();
};

// Check user role
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    console.log(`🔐 Checking role: required='${requiredRole}', actual='${userRole}' at ${req.method} ${req.path}`);
    
    if (!req.user || req.user.role !== requiredRole) {
      console.warn(`❌ Access denied: Expected ${requiredRole} but got ${userRole} for ${req.method} ${req.path}`);
      return res.status(403).json({ 
        status: 'error', 
        message: `Access denied. This endpoint requires ${requiredRole} role, but you are logged in as ${userRole}. Please log in with a ${requiredRole} account.`,
        requiredRole,
        yourRole: userRole
      });
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

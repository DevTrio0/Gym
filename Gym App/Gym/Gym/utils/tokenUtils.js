const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (userId, role) => {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  return token;
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

// Hash Password
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Compare Password

const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
};


module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword
};

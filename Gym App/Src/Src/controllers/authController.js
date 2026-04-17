const { mockDatabase, getNextId, findUserByEmail, findUserById } = require('../models/database');
const { generateToken, hashPassword, comparePassword } = require('../utils/tokenUtils');

// Load Frontend
const loadFrontend = (req, res) => {
  res.status(200).json({ status: 'success', message: 'Frontend loaded' });
};

// Register (Admin creates users)
const register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  // Check if user already exists
  if (findUserByEmail(email)) {
    return res.status(400).json({ status: 'error', message: 'Email already registered' });
  }

  const userId = getNextId('user');
  const hashedPassword = hashPassword(password);

  const newUser = {
    id: userId,
    name,
    email,
    password: hashedPassword,
    role,
    status: role === 'coach' ? 'pending' : 'active',
    createdAt: new Date()
  };

  mockDatabase.users.push(newUser);

  if (role === 'coach') {
    const coachId = getNextId('coach');
    mockDatabase.coaches.push({
      id: coachId,
      userId,
      name,
      email,
      status: 'pending',
      clients: [],
      createdAt: new Date()
    });
  } else if (role === 'client') {
    const clientId = getNextId('client');
    mockDatabase.clients.push({
      id: clientId,
      userId,
      name,
      email,
      status: 'active',
      createdAt: new Date()
    });
  }

  res.status(201).json({
    status: 'success',
    message: role === 'coach' ? 'Coach registered, pending approval' : 'User registered successfully',
    userId
  });
};

// Sign In
const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password required' });
  }

  const user = findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials e' });
  }
   console.log('Password from request:', password);
  console.log('Password hash from user:', user.password);

  if (user.status === 'pending') {
    return res.status(403).json({ status: 'error', message: 'Account pending approval' });
  }

  if (user.status === 'deactivated') {
    return res.status(403).json({ status: 'error', message: 'Account is deactivated' });
  }

  const passwordMatch = await comparePassword(password, user.password);

  console.log('Password match result:', passwordMatch);
  console.log('Hash length:', user.password.length);

  if (!passwordMatch) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials p' });
  }

  const token = generateToken(user.id, user.role);

  // Determine dashboard route based on role
  let dashboardRoute;
  switch (user.role) {
    case 'admin':
      dashboardRoute = '/admin/dashboard';
      break;
    case 'coach':
      dashboardRoute = '/coach/dashboard';
      break;
    case 'client':
      dashboardRoute = '/client/dashboard';
      break;
    default:
      dashboardRoute = '/dashboard';
  }

  res.status(200).json({
    status: 'success',
    message: `${user.role} signed in successfully`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    redirectTo: dashboardRoute
  });
};


// Login Check (Check if account exists)
const loginCheck = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email required' });
  }

  const user = findUserByEmail(email);

  if (user) {
    res.status(200).json({
      exists: true,
      message: 'Please sign in',
      role: user.role
    });
  } else {
    res.status(200).json({
      exists: false,
      message: 'Please register'
    });
  }
};

// Forgot Password
const forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email required' });
  }

  const user = findUserByEmail(email);

  if (!user) {
    // Don't reveal if email exists for security
    return res.status(200).json({ status: 'success', message: 'Reset link sent (if email exists)' });
  }

  const resetToken = `reset_${Date.now()}_${Math.random()}`;
  mockDatabase.resetTokens.push({
    token: resetToken,
    email,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  });

  res.status(200).json({
    status: 'success',
    message: 'Reset link sent to your email',
    resetToken // In production, send via email
  });
};

// Reset Password
const resetPassword = (req, res) => {
  const { email, newPassword, token } = req.body;

  if (!email || !newPassword || !token) {
    return res.status(400).json({ status: 'error', message: 'Email, new password, and token required' });
  }

  const resetTokenRecord = mockDatabase.resetTokens.find(rt => rt.token === token && rt.email === email);

  if (!resetTokenRecord) {
    return res.status(400).json({ status: 'error', message: 'Invalid or expired reset token' });
  }

  if (new Date() > resetTokenRecord.expiresAt) {
    return res.status(400).json({ status: 'error', message: 'Reset token expired' });
  }

  const user = findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  user.password = hashPassword(newPassword);

  // Remove used token
  mockDatabase.resetTokens = mockDatabase.resetTokens.filter(rt => rt.token !== token);

  res.status(200).json({ status: 'success', message: 'Password updated successfully' });
};

// Logout
const logout = (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ status: 'error', message: 'User ID required' });
  }

  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

module.exports = {
  loadFrontend,
  register,
  signIn,
  loginCheck,
  forgotPassword,
  resetPassword,
  logout
};

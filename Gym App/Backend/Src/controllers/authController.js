const { 
  findUserByEmail, 
  findUserById,
  createUser,
  createCoach,
  createClient,
  updateUser 
} = require('../../db/mongoDatabase');
const { generateToken, hashPassword, comparePassword } = require('../../utils/tokenUtils');

// Load Frontend
const loadFrontend = (req, res) => {
  res.status(200).json({ status: 'success', message: 'Frontend loaded' });
};

// Register (Admin creates users)
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }

    const hashedPassword = hashPassword(password);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role,
      status: 'active' // All users (coach, client) auto-approved
    });

    if (role === 'coach') {
      await createCoach({
        userId: newUser._id,
        name,
        email,
        status: 'active', // Coaches can sign in directly
        clients: []
      });
    } else if (role === 'client') {
      await createClient({
        userId: newUser._id,
        name,
        email,
        status: 'active'
      });
    }

    res.status(201).json({
      status: 'success',
      message: role === 'coach' ? 'Coach registered successfully' : 'User registered successfully',
      userId: newUser._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', message: 'Registration failed', error: error.message });
  }
};

// Sign In
const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password required' });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    if (user.status === 'deactivated') {
      return res.status(403).json({ status: 'error', message: 'Account is deactivated' });
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

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
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      redirectTo: dashboardRoute
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ status: 'error', message: 'Sign in failed', error: error.message });
  }
};


// Login Check (Check if account exists)
const loginCheck = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email required' });
  }

  try {
    const user = await findUserByEmail(email);

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
  } catch (error) {
    console.error('Login check error:', error);
    res.status(500).json({ status: 'error', message: 'Login check failed' });
  }
};

// In-memory reset tokens (for development)
let resetTokens = [];

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email required' });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({ status: 'success', message: 'Reset link sent (if email exists)' });
    }

    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    resetTokens.push({
      token: resetToken,
      email,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset link sent to your email',
      resetToken // In production, send via email
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ status: 'error', message: 'Operation failed' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, newPassword, token } = req.body;

  if (!email || !newPassword || !token) {
    return res.status(400).json({ status: 'error', message: 'Email, new password, and token required' });
  }

  try {
    const resetTokenRecord = resetTokens.find(rt => rt.token === token && rt.email === email);

    if (!resetTokenRecord) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired reset token' });
    }

    if (new Date() > resetTokenRecord.expiresAt) {
      return res.status(400).json({ status: 'error', message: 'Reset token expired' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const hashedPassword = hashPassword(newPassword);
    await updateUser(user._id, { password: hashedPassword });

    // Remove used token
    resetTokens = resetTokens.filter(rt => rt.token !== token);

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ status: 'error', message: 'Password reset failed' });
  }
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

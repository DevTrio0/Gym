const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// MongoDB Connection
const { connectMongoDB } = require('./db/mongodb');

// Routes
const coachRoutes = require('./Src/routes/coachRoutes');
const adminRoutes = require('./Src/routes/adminRoutes');
const clientRoutes = require('./Src/routes/clientRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date() });
});

// Universal Auth Routes (work for all roles - no prefix needed)
const { findUserByEmail, findUserById, createUser, createCoach, createClient, updateUser } = require('./db/mongoDatabase');
const { comparePassword, generateToken, hashPassword } = require('./utils/tokenUtils');

// Bearer Token Verification Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'No token provided' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};

app.post('/auth/signin', async (req, res) => {
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

    let dashboardRoute;
    switch (user.role) {
      case 'admin':
        dashboardRoute = '/admin';
        break;
      case 'coach':
        dashboardRoute = '/coach/my-clients';
        break;
      case 'client':
        dashboardRoute = '/client/welcome';
        break;
      default:
        dashboardRoute = '/';
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
});

app.post('/auth/login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email required' });
  }

  try {
    const user = await findUserByEmail(email);

    if (user) {
      res.status(200).json({
        exists: true,
        message: 'Account found, please sign in',
        role: user.role
      });
    } else {
      res.status(200).json({
        exists: false,
        message: 'Account not found'
      });
    }
  } catch (error) {
    console.error('Login check error:', error);
    res.status(500).json({ status: 'error', message: 'Login check failed' });
  }
});

// Universal register route (for client self-registration)
app.post('/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  const userRole = role || 'client'; // Default to client if role not specified

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }

    const hashedPassword = hashPassword(password);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      status: userRole === 'coach' ? 'pending' : 'active'
    });

    if (userRole === 'coach') {
      await createCoach({
        userId: newUser._id,
        name,
        email,
        status: 'pending',
        clients: []
      });
    } else if (userRole === 'client') {
      await createClient({
        userId: newUser._id,
        name,
        email,
        status: 'active'
      });
    }

    res.status(201).json({
      status: 'success',
      message: userRole === 'coach' ? 'Coach registered, pending approval' : 'User registered successfully',
      userId: newUser._id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', message: 'Registration failed', error: error.message });
  }
});

// In-memory reset tokens (for development)
let resetTokens = [];

app.post('/auth/forgetpassword', async (req, res) => {
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
});

app.post('/auth/resetpassword', async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ status: 'error', message: 'Email, token, and new password required' });
  }

  try {
    // Find and validate token
    const resetToken = resetTokens.find(rt => rt.token === token && rt.email === email);

    if (!resetToken) {
      return res.status(400).json({ status: 'error', message: 'Invalid or expired token' });
    }

    if (new Date() > resetToken.expiresAt) {
      resetTokens = resetTokens.filter(rt => rt !== resetToken);
      return res.status(400).json({ status: 'error', message: 'Reset token expired' });
    }

    // Update password
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const hashedPassword = hashPassword(newPassword);
    await updateUser(user._id, { password: hashedPassword });

    // Remove used token
    resetTokens = resetTokens.filter(rt => rt !== resetToken);

    res.status(200).json({ status: 'success', message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ status: 'error', message: 'Operation failed' });
  }
});

// Get User Profile - Protected Route
app.get('/auth/profile', verifyToken, async (req, res) => {
  try {
    const user = await findUserById(req.userId);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch profile' });
  }
});

// Get All Subscription Plans - Public Route
app.get('/plans', async (req, res) => {
  try {
    const { getAllPlans, createSubscriptionPlan } = require('./db/mongoDatabase');
    let plans = await getAllPlans();

    // If no plans exist, create default plans
    if (!plans || plans.length === 0) {
      console.log('📝 Creating default subscription plans...');
      const defaultPlans = [
        {
          name: 'Starter Online',
          price: 29.99,
          duration: 1,
          type: 'online',
          features: ['2 video coaching sessions/week', 'Workout templates', 'Basic progress tracking'],
          active: true
        },
        {
          name: 'Pro Online',
          price: 49.99,
          duration: 1,
          type: 'online',
          features: ['Unlimited video coaching', 'Custom meal plans', '24/7 support', 'Performance analytics'],
          active: true
        },
        {
          name: 'Elite Online',
          price: 79.99,
          duration: 1,
          type: 'online',
          features: ['Unlimited 1-on-1 sessions', 'Full nutrition planning', 'Priority support', 'Monthly reviews'],
          active: true
        },
        {
          name: 'Gym Starter',
          price: 39.99,
          duration: 1,
          type: 'gym',
          features: ['24/7 gym access', 'All equipment available', 'Locker access'],
          active: true
        },
        {
          name: 'Gym Pro',
          price: 59.99,
          duration: 1,
          type: 'gym',
          features: ['24/7 gym access', '2 coaching sessions/week', 'Locker access', 'Progress tracking'],
          active: true
        },
        {
          name: 'Gym Elite',
          price: 89.99,
          duration: 1,
          type: 'gym',
          features: ['24/7 gym access', 'Unlimited coaching', 'Premium locker', 'Priority support'],
          active: true
        }
      ];

      for (const planData of defaultPlans) {
        await createSubscriptionPlan(planData);
      }

      plans = await getAllPlans();
    }

    res.status(200).json({
      status: 'success',
      plans: plans.map((plan, idx) => ({
        id: plan._id.toString(),
        name: plan.name,
        price: plan.price,
        monthlyPrice: plan.price,
        duration: plan.duration,
        billingPeriod: 'month',
        category: plan.type,
        type: plan.type,
        features: plan.features,
        description: plan.description || '',
        active: plan.active,
        isRecommended: idx === 1 || idx === 4, // Make middle plan recommended for each category
        savings: Math.round(plan.price * 0.1) // 10% savings discount
      }))
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch plans' });
  }
});

// DIAGNOSTIC ENDPOINT - Check what's in the database
app.get('/debug/coaches', async (req, res) => {
  try {
    const coaches = await require('./db/mongoDatabase').getAllCoaches();
    res.status(200).json({
      status: 'success',
      count: coaches.length,
      coaches
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/debug/clients', async (req, res) => {
  try {
    const clients = await require('./db/mongoDatabase').getAllClients();
    res.status(200).json({
      status: 'success',
      count: clients.length,
      clients
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Role-based Routes
app.use('/coach', coachRoutes);
app.use('/admin', adminRoutes);
app.use('/client', clientRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Internal server error', error: err.message });
});

// Start server with MongoDB connection
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n✅ Server is running on http://localhost:${PORT}`);
      console.log(`📍 Coach API: http://localhost:${PORT}/coach`);
      console.log(`📍 Admin API: http://localhost:${PORT}/admin`);
      console.log(`📍 Client API: http://localhost:${PORT}/client`);
      console.log(`📍 Health Check: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();


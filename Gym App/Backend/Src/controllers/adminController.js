const {
  findUserById,
  findUserByEmail,
  findCoachById,
  findClientById,
  createUser,
  createCoach,
  createClient,
  updateUser,
  deleteUser,
  deleteCoach,
  deleteClient,
  getAllUsers,
  getAllPayments,
  getDashboardStats,
  getPaymentsByClientId,
  Payment,
  User,
  Coach,
  Client
} = require('../../db/mongoDatabase');
const { hashPassword } = require('../../utils/tokenUtils');
const profitService = require('../services/profitService');
const coachSalaryService = require('../services/coachSalaryService');

// Get Dashboard (Simple Authentication Check)
const getDashboard = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Admin dashboard access granted'
  });
};

// ===== ADMIN STATS =====

const getTotalUsers = async (req, res) => {
  try {
    const users = await User.countDocuments();
    res.status(200).json({
      status: 'success',
      totalUsers: users
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getTotalCoaches = async (req, res) => {
  try {
    const total = await User.countDocuments({ role: 'coach' });
    res.status(200).json({
      status: 'success',
      totalCoaches: total
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getTotalClients = async (req, res) => {
  try {
    const total = await User.countDocuments({ role: 'client' });
    res.status(200).json({
      status: 'success',
      totalClients: total
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getTotalPayments = async (req, res) => {
  try {
    const total = await Payment.countDocuments();
    res.status(200).json({
      status: 'success',
      totalPayments: total
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getActiveCoaches = async (req, res) => {
  try {
    const total = await User.countDocuments({ role: 'coach', status: 'active' });
    res.status(200).json({
      status: 'success',
      activeCoaches: total
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getPendingCoaches = async (req, res) => {
  try {
    const pendingCoaches = await Coach.find({ status: 'pending' }).populate('userId');
    res.status(200).json({
      status: 'success',
      coaches: pendingCoaches,
      count: pendingCoaches.length
    });
  } catch (error) {
    console.error('Get pending coaches error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getActiveClients = async (req, res) => {
  try {
    const total = await User.countDocuments({ role: 'client', status: 'active' });
    res.status(200).json({
      status: 'success',
      activeClients: total
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Backward-compatible alias
const countClients = async (req, res) => getTotalClients(req, res);

// Add Coach
const addCoach = async (req, res) => {
  const { name, email, password, phone, specialty, gender, yearsExperience, bio } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Name, email, and password required' });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already exists' });
    }

    const hashedPassword = hashPassword(password);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role: 'coach',
      status: 'active'  // Admin-created coaches are auto-approved
    });

    const newCoach = await createCoach({
      userId: newUser._id,
      name,
      email,
      phone,
      specialization: specialty,
      gender,
      experience: yearsExperience,
      bio,
      status: 'active',  // Auto-approved
      clients: []
    });

    res.status(201).json({
      status: 'success',
      message: 'Coach added successfully',
      coachId: newCoach._id,
      userId: newUser._id
    });
  } catch (error) {
    console.error('Add coach error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Add Client
const addClient = async (req, res) => {
  const { name, email, password, phone, age, fitnessLevel, gender } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Name, email, and password required' });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already exists' });
    }

    const hashedPassword = hashPassword(password);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      role: 'client',
      status: 'active'
    });

    const newClient = await createClient({
      userId: newUser._id,
      name,
      email,
      phone,
      age,
      gender,
      progress: {
        dietProgress: fitnessLevel || '',
        workoutProgress: '',
        notes: ''
      },
      status: 'active'
    });

    res.status(201).json({
      status: 'success',
      message: 'Client added successfully',
      clientId: newClient._id
    });
  } catch (error) {
    console.error('Add client error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete Account
const deleteAccount = async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ status: 'error', message: 'userId and role required' });
  }

  try {
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (role === 'coach') {
      const coach = await Coach.findOne({ userId });
      if (coach) {
        await deleteCoach(coach._id);
      }
    } else if (role === 'client') {
      const client = await Client.findOne({ userId });
      if (client) {
        await deleteClient(client._id);
      }
    }

    await deleteUser(userId);

    res.status(200).json({ status: 'success', message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Deactivate Account
const deactivateAccount = async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ status: 'error', message: 'userId and role required' });
  }

  try {
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    await updateUser(userId, { status: 'deactivated' });

    res.status(200).json({ status: 'success', message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Reactivate Account
const reactivateAccount = async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ status: 'error', message: 'userId and role required' });
  }

  try {
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    await updateUser(userId, { status: 'active' });

    res.status(200).json({ status: 'success', message: 'Account reactivated successfully', status: 'active' });
  } catch (error) {
    console.error('Reactivate account error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get Monthly Reports
const getMonthlyReports = async (req, res) => {
  const { month, year } = req.query;

  try {
    const totalUsers = await User.countDocuments();
    const totalCoaches = await User.countDocuments({ role: 'coach' });
    const totalClients = await User.countDocuments({ role: 'client' });
    const payments = await Payment.find();
    const totalRevenue = payments.reduce((sum, p) => (p.status === 'completed' ? sum + p.amount : sum), 0);

    const reports = {
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
      totalRegistrations: totalUsers,
      totalCoaches,
      totalClients,
      totalRevenue,
      transactions: payments.slice(-10)
    };

    res.status(200).json({ status: 'success', reports: [reports] });
  } catch (error) {
    console.error('Get monthly reports error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get Payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('clientId').populate('planId');
    
    const paymentData = payments.map(p => ({
      _id: p._id,
      clientId: p.clientId,
      amount: p.amount,
      method: p.method,
      status: p.status,
      date: p.createdAt
    }));

    res.status(200).json({ status: 'success', payments: paymentData });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get Profits (with tax deduction)
const getProfits = async (req, res) => {
  const { taxPercentage } = req.query;
  
  try {
    const profitReport = await profitService.getProfitReport(taxPercentage || 20);
    res.status(200).json(profitReport);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get Profit Detail Report
const getProfitDetailReport = async (req, res) => {
  try {
    const { taxPercentage } = req.query;
    const profit = await profitService.calculateProfitAfterTaxes(taxPercentage || 20);
    
    res.status(200).json({
      status: 'success',
      message: 'Detailed profit report',
      data: profit
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Approve Coach Subscription
const approveCoachSubscription = async (req, res) => {
  const { coachId } = req.body;

  if (!coachId) {
    return res.status(400).json({ status: 'error', message: 'coachId required' });
  }

  try {
    const coach = await findCoachById(coachId);

    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Coach not found' });
    }

    const updatedCoach = await Coach.findByIdAndUpdate(
      coachId,
      { status: 'active', approvedAt: new Date() },
      { new: true }
    );

    const user = await findUserById(coach.userId);
    if (user) {
      await updateUser(coach.userId, { status: 'active' });
    }

    res.status(200).json({ status: 'success', message: 'Coach account approved', coachStatus: 'active' });
  } catch (error) {
    console.error('Approve coach error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ===== COACH SALARY MANAGEMENT (Admin Only) =====

// Set Coach Salary
const setCoachSalary = async (req, res) => {
  const { coachId, amount, description } = req.body;

  if (!coachId || !amount) {
    return res.status(400).json({ status: 'error', message: 'coachId and amount are required' });
  }

  try {
    const result = await coachSalaryService.setCoachSalary(coachId, amount, description);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get All Coach Salaries
const getAllCoachSalaries = async (req, res) => {
  try {
    const result = await coachSalaryService.getAllCoachSalaries();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get Single Coach Salary
const getCoachSalaryById = async (req, res) => {
  const { coachId } = req.params;

  if (!coachId) {
    return res.status(400).json({ status: 'error', message: 'coachId is required' });
  }

  try {
    const salary = await coachSalaryService.getCoachSalary(coachId);
    
    if (!salary) {
      return res.status(404).json({ status: 'error', message: 'No salary record found for this coach' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Coach salary retrieved',
      data: salary
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Pay Coach Salary
const payCoachSalary = async (req, res) => {
  const { coachId, amount, notes } = req.body;

  if (!coachId || !amount) {
    return res.status(400).json({ status: 'error', message: 'coachId and amount are required' });
  }

  try {
    const result = await coachSalaryService.payCoachSalary(coachId, amount, notes);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get Coach Payment History
const getCoachPaymentHistory = async (req, res) => {
  const { coachId } = req.params;
  const { limit } = req.query;

  if (!coachId) {
    return res.status(400).json({ status: 'error', message: 'coachId is required' });
  }

  try {
    const result = await coachSalaryService.getCoachPaymentHistory(coachId, limit ? parseInt(limit) : 12);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get All Salary Payments
const getAllSalaryPayments = async (req, res) => {
  const { limit } = req.query;

  try {
    const result = await coachSalaryService.getAllSalaryPayments(limit ? parseInt(limit) : null);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Generate Salary Report
const generateSalaryReport = async (req, res) => {
  try {
    const result = await coachSalaryService.generateSalaryReport();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get All Coaches with Details
const getAllCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find().populate('userId');
    const coachData = coaches.map(coach => ({
      _id: coach._id,
      userId: coach.userId?._id || coach.userId,
      name: coach.name || coach.userId?.name,
      email: coach.email || coach.userId?.email,
      status: coach.status || coach.userId?.status,
      clientsCount: coach.clients?.length || 0,
      createdAt: coach.createdAt
    }));

    res.status(200).json({
      status: 'success',
      coaches: coachData,
      total: coachData.length
    });
  } catch (error) {
    console.error('Get all coaches error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get All Clients with Details
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('userId').populate('coachId').populate('subscription.planId');
    const clientData = clients.map(client => ({
      _id: client._id,
      userId: client.userId?._id || client.userId,
      name: client.name || client.userId?.name,
      email: client.email || client.userId?.email,
      status: client.status || client.userId?.status,
      coachId: client.coachId?._id || client.coachId,
      coachName: client.coachId?.name,
      subscription: client.subscription,
      createdAt: client.createdAt
    }));

    res.status(200).json({
      status: 'success',
      clients: clientData,
      total: clientData.length
    });
  } catch (error) {
    console.error('Get all clients error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Logout
const logout = (req, res) => {
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

// ===== SUBSCRIPTION PLAN MANAGEMENT =====

// Get All Plans (Admin)
const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json({
      status: 'success',
      plans
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Create Plan
const createSubscriptionPlan = async (req, res) => {
  const { name, price, duration, type, description, features } = req.body;

  if (!name || !price || !duration || !type) {
    return res.status(400).json({ status: 'error', message: 'Name, price, duration, and type are required' });
  }

  try {
    const newPlan = new SubscriptionPlan({
      name,
      price,
      duration,
      type,
      description,
      features,
      active: true
    });
    await newPlan.save();

    res.status(201).json({
      status: 'success',
      message: 'Subscription plan created',
      plan: newPlan
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update Plan
const updateSubscriptionPlan = async (req, res) => {
  const { planId } = req.params;
  const updateData = req.body;

  try {
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
      planId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ status: 'error', message: 'Plan not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Plan updated',
      plan: updatedPlan
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete Plan
const deleteSubscriptionPlan = async (req, res) => {
  const { planId } = req.params;

  try {
    const deletedPlan = await SubscriptionPlan.findByIdAndDelete(planId);

    if (!deletedPlan) {
      return res.status(404).json({ status: 'error', message: 'Plan not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getDashboard,
  getTotalUsers,
  getTotalCoaches,
  getTotalClients,
  getTotalPayments,
  getActiveCoaches,
  getPendingCoaches,
  getActiveClients,
  addCoach,
  addClient,
  deleteAccount,
  deactivateAccount,
  reactivateAccount,
  getMonthlyReports,
  getPayments,
  getProfits,
  getProfitDetailReport,
  approveCoachSubscription,
  countClients,
  setCoachSalary,
  getAllCoachSalaries,
  getCoachSalaryById,
  payCoachSalary,
  getCoachPaymentHistory,
  getAllSalaryPayments,
  generateSalaryReport,
  getAllCoaches,
  getAllClients,
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  logout
};

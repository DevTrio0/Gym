const { mockDatabase, getNextId, findUserById, findUserByEmail, findCoachById, findClientById } = require('../models/database');
const { hashPassword } = require('../utils/tokenUtils');
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

const getTotalUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    totalUsers: mockDatabase.users.length
  });
};

const getTotalCoaches = (req, res) => {
  const totalCoaches = mockDatabase.users.filter(u => u.role === 'coach').length;

  res.status(200).json({
    status: 'success',
    totalCoaches
  });
};

const getTotalClients = (req, res) => {
  const totalClients = mockDatabase.users.filter(u => u.role === 'client').length;

  res.status(200).json({
    status: 'success',
    totalClients
  });
};

const getTotalPayments = (req, res) => {
  res.status(200).json({
    status: 'success',
    totalPayments: mockDatabase.payments.length
  });
};

const getActiveCoaches = (req, res) => {
  const activeCoaches = mockDatabase.users.filter(u => u.role === 'coach' && u.status === 'active').length;

  res.status(200).json({
    status: 'success',
    activeCoaches
  });
};

const getPendingCoaches = (req, res) => {
  const pendingCoaches = mockDatabase.users.filter(u => u.role === 'coach' && u.status === 'pending').length;

  res.status(200).json({
    status: 'success',
    pendingCoaches
  });
};

const getActiveClients = (req, res) => {
  const activeClients = mockDatabase.users.filter(u => u.role === 'client' && u.status === 'active').length;

  res.status(200).json({
    status: 'success',
    activeClients
  });
};

// Backward-compatible alias
const countClients = (req, res) => getTotalClients(req, res);

// Add Coach
const addCoach = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Name, email, and password required' });
  }

  if (findUserByEmail(email)) {
    return res.status(400).json({ status: 'error', message: 'Email already exists' });
  }

  const userId = getNextId('user');
  const coachId = getNextId('coach');
  const hashedPassword = hashPassword(password);

  mockDatabase.users.push({
    id: userId,
    name,
    email,
    password: hashedPassword,
    role: 'coach',
    status: 'pending',
    createdAt: new Date()
  });

  mockDatabase.coaches.push({
    id: coachId,
    userId,
    name,
    email,
    status: 'pending',
    clients: [],
    createdAt: new Date()
  });

  res.status(201).json({
    status: 'success',
    message: 'Coach added (pending approval)',
    coachId
  });
};

// Add Client
const addClient = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Name, email, and password required' });
  }

  if (findUserByEmail(email)) {
    return res.status(400).json({ status: 'error', message: 'Email already exists' });
  }

  const userId = getNextId('user');
  const clientId = getNextId('client');
  const hashedPassword = hashPassword(password);

  mockDatabase.users.push({
    id: userId,
    name,
    email,
    password: hashedPassword,
    role: 'client',
    status: 'active',
    createdAt: new Date()
  });

  mockDatabase.clients.push({
    id: clientId,
    userId,
    name,
    email,
    status: 'active',
    createdAt: new Date()
  });

  res.status(201).json({
    status: 'success',
    message: 'Client added successfully',
    clientId
  });
};

// Delete Account
const deleteAccount = (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ status: 'error', message: 'userId and role required' });
  }

  const userIndex = mockDatabase.users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  if (role === 'coach') {
    const coachIndex = mockDatabase.coaches.findIndex(c => c.userId === userId);
    if (coachIndex !== -1) {
      mockDatabase.coaches.splice(coachIndex, 1);
    }
  } else if (role === 'client') {
    const clientIndex = mockDatabase.clients.findIndex(c => c.userId === userId);
    if (clientIndex !== -1) {
      mockDatabase.clients.splice(clientIndex, 1);
    }
  }

  mockDatabase.users.splice(userIndex, 1);

  res.status(200).json({ status: 'success', message: 'Account deleted successfully' });
};

// Deactivate Account
const deactivateAccount = (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ status: 'error', message: 'userId and role required' });
  }

  const user = findUserById(userId);

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  user.status = 'deactivated';

  res.status(200).json({ status: 'success', message: 'Account deactivated successfully' });
};

// Reactivate Account
const reactivateAccount = (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ status: 'error', message: 'userId and role required' });
  }

  const user = findUserById(userId);

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  user.status = 'active';

  res.status(200).json({ status: 'success', message: 'Account reactivated successfully', status: 'active' });
};

// Get Monthly Reports
const getMonthlyReports = (req, res) => {
  const { month, year } = req.query;

  const reports = {
    month: month || new Date().getMonth() + 1,
    year: year || new Date().getFullYear(),
    totalRegistrations: mockDatabase.users.length,
    totalCoaches: mockDatabase.coaches.length,
    totalClients: mockDatabase.clients.length,
    totalRevenue: mockDatabase.payments.reduce((sum, p) => sum + p.amount, 0),
    transactions: mockDatabase.payments.slice(-10)
  };

  res.status(200).json({ status: 'success', reports: [reports] });
};

// Get Payments
const getPayments = (req, res) => {
  const payments = mockDatabase.payments.map(p => ({
    id: p.id,
    clientId: p.clientId,
    amount: p.amount,
    method: p.method,
    status: p.status,
    date: p.date
  }));

  res.status(200).json({ status: 'success', payments });
};

// Get Profits (with tax deduction)
const getProfits = (req, res) => {
  const { taxPercentage } = req.query;
  
  try {
    const profitReport = profitService.getProfitReport(taxPercentage || 20);
    res.status(200).json(profitReport);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get Profit Detail Report
const getProfitDetailReport = (req, res) => {
  try {
    const { taxPercentage } = req.query;
    const profit = profitService.calculateProfitAfterTaxes(taxPercentage || 20);
    
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
const approveCoachSubscription = (req, res) => {
  const { coachId } = req.body;

  if (!coachId) {
    return res.status(400).json({ status: 'error', message: 'coachId required' });
  }

  const coach = findCoachById(coachId);

  if (!coach) {
    return res.status(404).json({ status: 'error', message: 'Coach not found' });
  }

  coach.status = 'active';
  coach.approvedAt = new Date();

  const user = findUserById(coach.userId);
  if (user) {
    user.status = 'active';
  }

  res.status(200).json({ status: 'success', message: 'Coach account approved', coachStatus: 'active' });
};

// ===== COACH SALARY MANAGEMENT (Admin Only) =====

// Set Coach Salary
const setCoachSalary = (req, res) => {
  const { coachId, amount, description } = req.body;

  if (!coachId || !amount) {
    return res.status(400).json({ status: 'error', message: 'coachId and amount are required' });
  }

  try {
    const result = coachSalaryService.setCoachSalary(coachId, amount, description);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get All Coach Salaries
const getAllCoachSalaries = (req, res) => {
  try {
    const result = coachSalaryService.getAllCoachSalaries();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get Single Coach Salary
const getCoachSalaryById = (req, res) => {
  const { coachId } = req.params;

  if (!coachId) {
    return res.status(400).json({ status: 'error', message: 'coachId is required' });
  }

  try {
    const salary = coachSalaryService.getCoachSalary(coachId);
    
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
const payCoachSalary = (req, res) => {
  const { coachId, amount, notes } = req.body;

  if (!coachId || !amount) {
    return res.status(400).json({ status: 'error', message: 'coachId and amount are required' });
  }

  try {
    const result = coachSalaryService.payCoachSalary(coachId, amount, notes);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get Coach Payment History
const getCoachPaymentHistory = (req, res) => {
  const { coachId } = req.params;
  const { limit } = req.query;

  if (!coachId) {
    return res.status(400).json({ status: 'error', message: 'coachId is required' });
  }

  try {
    const result = coachSalaryService.getCoachPaymentHistory(coachId, limit ? parseInt(limit) : 12);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get All Salary Payments
const getAllSalaryPayments = (req, res) => {
  const { limit } = req.query;

  try {
    const result = coachSalaryService.getAllSalaryPayments(limit ? parseInt(limit) : null);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Generate Salary Report
const generateSalaryReport = (req, res) => {
  try {
    const result = coachSalaryService.generateSalaryReport();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Logout
const logout = (req, res) => {
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
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
  logout
};

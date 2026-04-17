const { mockDatabase, findClientById, findSubscriptionPlan, getNextId } = require('../models/database');

// Get Dashboard
const getDashboard = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Client dashboard access granted'
  });
};

// Welcome Page
const welcomePage = (req, res) => {
  const userId = req.user.userId;
  const client = mockDatabase.clients.find(c => c.userId === userId);

  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  res.status(200).json({
    status: 'success',
    message: 'Welcome page loaded',
    user: {
      id: client.id,
      name: client.name,
      email: client.email,
      subscription: client.subscription || null
    }
  });
};

// Book Workout
const bookWorkout = (req, res) => {
  const { workoutId, agree } = req.body;
  const userId = req.user.userId;

  if (!workoutId || !agree) {
    return res.status(400).json({ status: 'error', message: 'workoutId and agree required' });
  }

  const client = mockDatabase.clients.find(c => c.userId === userId);

  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  // Check if client has active subscription
  if (!client.subscription || client.subscription.status !== 'active') {
    return res.status(402).json({
      status: 'redirect',
      message: 'Choose subscription first',
      redirectTo: '/dashboard/subscription/select-plan'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Workout booked successfully',
    workoutId
  });
};

// Select Subscription Plan
const selectPlan = (req, res) => {
  const { planId, method } = req.body;
  const userId = req.user.userId;

  if (!planId || !method) {
    return res.status(400).json({ status: 'error', message: 'planId and method required' });
  }

  if (!['online', 'gym', 'hybrid'].includes(method)) {
    return res.status(400).json({ status: 'error', message: 'Invalid method' });
  }

  const plan = findSubscriptionPlan(planId);

  if (!plan) {
    return res.status(404).json({ status: 'error', message: 'Plan not found' });
  }

  const client = mockDatabase.clients.find(c => c.userId === userId);

  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  res.status(200).json({
    status: 'success',
    message: 'Plan selected, proceed to payment',
    plan: {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      method
    }
  });
};

// Make Payment
const makePayment = (req, res) => {
  const { planId, paymentMethod, paymentDetails } = req.body;
  const userId = req.user.userId;

  if (!planId || !paymentMethod || !paymentDetails) {
    return res.status(400).json({ status: 'error', message: 'planId, paymentMethod, and paymentDetails required' });
  }

  const plan = findSubscriptionPlan(planId);

  if (!plan) {
    return res.status(404).json({ status: 'error', message: 'Plan not found' });
  }

  const client = mockDatabase.clients.find(c => c.userId === userId);

  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  // Mock payment processing
  const paymentId = getNextId('payment');
  const payment = {
    id: paymentId,
    clientId: client.id,
    planId,
    amount: plan.price,
    method: paymentMethod,
    status: 'completed',
    date: new Date()
  };

  mockDatabase.payments.push(payment);

  // Update client subscription
  client.subscription = {
    planId,
    method: paymentDetails.method || 'gym',
    startDate: new Date(),
    endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
    status: 'active'
  };

  res.status(200).json({
    status: 'success',
    message: 'Payment confirmed',
    paymentId,
    subscription: client.subscription
  });
};

// Renew or Change Subscription
const renewSubscription = (req, res) => {
  const { newPlanId } = req.body;
  const userId = req.user.userId;

  if (!newPlanId) {
    return res.status(400).json({ status: 'error', message: 'newPlanId required' });
  }

  const plan = findSubscriptionPlan(newPlanId);

  if (!plan) {
    return res.status(404).json({ status: 'error', message: 'Plan not found' });
  }

  const client = mockDatabase.clients.find(c => c.userId === userId);

  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  // Update subscription
  if (client.subscription) {
    client.subscription.planId = newPlanId;
    client.subscription.startDate = new Date();
    client.subscription.endDate = new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000);
  } else {
    client.subscription = {
      planId: newPlanId,
      method: 'gym',
      startDate: new Date(),
      endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
      status: 'active'
    };
  }

  res.status(200).json({ status: 'success', message: 'Subscription updated', subscription: client.subscription });
};

// Get Weekly Workouts
const getWeeklyWorkouts = (req, res) => {
  const { weekId } = req.query;
  const userId = req.user.userId;

  const client = mockDatabase.clients.find(c => c.userId === userId);

  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  // Get training plans assigned to this client
  const trainingPlans = mockDatabase.trainingPlans.filter(t => t.clientId === client.id);

  const workouts = trainingPlans.map(plan => ({
    id: plan.id,
    week: plan.weekNumber,
    name: plan.plan,
    details: plan.plan
  }));

  res.status(200).json({ status: 'success', workouts });
};

// Get Progress
const getProgress = (req, res) => {
  const userId = req.user.userId;

  const client = mockDatabase.clients.find(c => c.userId === userId);

  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  res.status(200).json({
    status: 'success',
    progress: {
      dietProgress: client.progress?.dietProgress || 'Not started',
      workoutProgress: client.progress?.workoutProgress || '0%',
      notes: client.progress?.notes || 'No notes'
    }
  });
};

// Update Progress
const updateProgress = (req, res) => {
  const { dietProgress, workoutProgress, notes } = req.body;
  const userId = req.user.userId;

  if (!dietProgress && !workoutProgress && !notes) {
    return res.status(400).json({ status: 'error', message: 'At least one field required' });
  }

  const client = mockDatabase.clients.find(c => c.userId === userId);

  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  if (!client.progress) {
    client.progress = {};
  }

  if (dietProgress) client.progress.dietProgress = dietProgress;
  if (workoutProgress) client.progress.workoutProgress = workoutProgress;
  if (notes) client.progress.notes = notes;

  res.status(200).json({ status: 'success', message: 'Progress updated', progress: client.progress });
};

// Logout
const logout = (req, res) => {
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

module.exports = {
  getDashboard,
  welcomePage,
  bookWorkout,
  selectPlan,
  makePayment,
  renewSubscription,
  getWeeklyWorkouts,
  getProgress,
  updateProgress,
  logout
};

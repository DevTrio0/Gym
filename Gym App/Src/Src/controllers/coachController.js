const { mockDatabase, findUserById, findClientById, findCoachById, getNextId } = require('../models/database');

// Get Dashboard
const getDashboard = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Coach dashboard access granted'
  });
};

// Add diet plan for client (only for subscribed clients)
const addDiet = (req, res) => {
  const { clientId, dietPlan } = req.body;
  const coachUserId = req.user.userId;

  if (!clientId || !dietPlan) {
    return res.status(400).json({ status: 'error', message: 'clientId and dietPlan required' });
  }

  const client = findClientById(clientId);
  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  const coach = mockDatabase.coaches.find(c => c.userId === coachUserId);
  if (!coach) {
    return res.status(404).json({ status: 'error', message: 'Coach profile not found' });
  }

  // Verify coach owns this client
  if (client.coachId !== coach.id) {
    return res.status(403).json({ status: 'error', message: 'Unauthorized: This client is not assigned to you' });
  }

  // Check if client has an active subscription
  if (!client.subscription?.status || client.subscription.status !== 'active') {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Cannot create diet plan: Client does not have an active subscription',
      clientName: client.name,
      subscriptionStatus: client.subscription?.status || 'inactive'
    });
  }

  const dietId = getNextId('diet');
  const newDiet = {
    id: dietId,
    clientId,
    coachId: coach.id,
    plan: dietPlan,
    createdAt: new Date()
  };

  mockDatabase.dietPlans.push(newDiet);

  res.status(200).json({
    status: 'success',
    message: 'Diet plan added successfully',
    dietId
  });
};

// List all clients
const getClients = (req, res) => {
  const coachUserId = req.user.userId;

  const coach = mockDatabase.coaches.find(c => c.userId === coachUserId);
  if (!coach) {
    return res.status(404).json({ status: 'error', message: 'Coach profile not found' });
  }

  const clients = mockDatabase.clients.filter(c => c.coachId === coach.id);

  const clientsData = clients.map(client => ({
    id: client.id,
    clientId: client.id,
    coachId: coach.id,
    name: client.name,
    email: client.email,
    subscription: client.subscription?.status || 'none',
    subscriptionStatus: client.subscription?.status || 'inactive',
    subscriptionMethod: client.subscription?.method || 'none',
    subscriptionStartDate: client.subscription?.startDate || null,
    subscriptionEndDate: client.subscription?.endDate || null,
    notes: mockDatabase.clientNotes.filter(n => n.clientId === client.id).length
  }));

  res.status(200).json({
    status: 'success',
    clients: clientsData
  });
};

// Get only subscribed clients (for creating training plans)
const getSubscribedClients = (req, res) => {
  const coachUserId = req.user.userId;

  const coach = mockDatabase.coaches.find(c => c.userId === coachUserId);
  if (!coach) {
    return res.status(404).json({ status: 'error', message: 'Coach profile not found' });
  }

  const clients = mockDatabase.clients.filter(c => c.coachId === coach.id && c.subscription?.status === 'active');

  const subscribedClientsData = clients.map(client => ({
    id: client.id,
    clientId: client.id,
    name: client.name,
    email: client.email,
    subscriptionMethod: client.subscription?.method || 'gym',
    subscriptionStartDate: client.subscription?.startDate,
    subscriptionEndDate: client.subscription?.endDate,
    subscriptionStatus: 'active'
  }));

  res.status(200).json({
    status: 'success',
    clients: subscribedClientsData
  });
};

// Add note for client
const addClientNote = (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const coachUserId = req.user.userId;

  if (!note) {
    return res.status(400).json({ status: 'error', message: 'Note required' });
  }

  const client = findClientById(id);
  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  const coach = mockDatabase.coaches.find(c => c.userId === coachUserId);
  if (!coach) {
    return res.status(404).json({ status: 'error', message: 'Coach profile not found' });
  }

  // Verify coach owns this client
  if (client.coachId !== coach.id) {
    return res.status(403).json({ status: 'error', message: 'Unauthorized: This client is not assigned to you' });
  }

  const noteId = getNextId('note');
  mockDatabase.clientNotes.push({
    id: noteId,
    clientId: id,
    coachId: coach.id,
    note,
    createdAt: new Date()
  });

  res.status(200).json({
    status: 'success',
    message: 'Note added successfully',
    noteId
  });
};

// Add weekly training plan (only for subscribed clients)
const addTrainingPlan = (req, res) => {
  const { clientId, week, trainingPlan } = req.body;
  const coachUserId = req.user.userId;

  if (!clientId || !week || !trainingPlan) {
    return res.status(400).json({ status: 'error', message: 'clientId, week, and trainingPlan required' });
  }

  const client = findClientById(clientId);
  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  const coach = mockDatabase.coaches.find(c => c.userId === coachUserId);
  if (!coach) {
    return res.status(404).json({ status: 'error', message: 'Coach profile not found' });
  }

  // Verify coach owns this client
  if (client.coachId !== coach.id) {
    return res.status(403).json({ status: 'error', message: 'Unauthorized: This client is not assigned to you' });
  }

  // Check if client has an active subscription
  if (!client.subscription?.status || client.subscription.status !== 'active') {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Cannot create training plan: Client does not have an active subscription',
      clientName: client.name,
      subscriptionStatus: client.subscription?.status || 'inactive'
    });
  }

  const trainingId = getNextId('training');
  const newTraining = {
    id: trainingId,
    clientId,
    coachId: coach.id,
    weekNumber: week,
    plan: trainingPlan,
    createdAt: new Date()
  };

  mockDatabase.trainingPlans.push(newTraining);

  res.status(200).json({
    status: 'success',
    message: 'Training plan added successfully',
    trainingId
  });
};

// Get client notes
const getClientNotes = (req, res) => {
  const { id } = req.params;
  const coachId = req.user.userId;

  const client = findClientById(id);
  if (!client) {
    return res.status(404).json({ status: 'error', message: 'Client not found' });
  }

  // Verify coach has access to this client
  const coach = mockDatabase.coaches.find(c => c.userId === coachId);
  if (!coach || client.coachId !== coach.id) {
    return res.status(403).json({ status: 'error', message: 'Access denied' });
  }

  const notes = mockDatabase.clientNotes.filter(n => n.clientId === id && n.coachId === coach.id);

  res.status(200).json({
    status: 'success',
    client: {
      id: client.id,
      name: client.name,
      email: client.email,
      notes: notes.map(n => ({ id: n.id, note: n.note, createdAt: n.createdAt }))
    }
  });
};

// Logout
const logout = (req, res) => {
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

module.exports = {
  getDashboard,
  addDiet,
  getClients,
  getSubscribedClients,
  addClientNote,
  addTrainingPlan,
  getClientNotes,
  logout
};

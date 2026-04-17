const {
  findClientById,
  findCoachByUserId,
  createDietPlan,
  getDietPlanByClientId,
  createTrainingPlan,
  getTrainingPlanByClientId,
  addClientNote,
  getClientNotesByClientId,
  Client,
  Coach,
  ClientNotes
} = require('../../db/mongoDatabase');

// Get Dashboard
const getDashboard = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Coach dashboard access granted'
  });
};

// Add diet plan for client (only for subscribed clients)
const addDiet = async (req, res) => {
  const { clientId, dietPlan } = req.body;
  const coachUserId = req.user.userId;

  if (!clientId || !dietPlan) {
    return res.status(400).json({ status: 'error', message: 'clientId and dietPlan required' });
  }

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    const coach = await findCoachByUserId(coachUserId);
    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Coach profile not found' });
    }

    // Verify coach owns this client
    if (client.coachId.toString() !== coach._id.toString()) {
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

    const newDiet = await createDietPlan({
      clientId,
      coachId: coach._id,
      plan: dietPlan
    });

    res.status(200).json({
      status: 'success',
      message: 'Diet plan added successfully',
      dietId: newDiet._id
    });
  } catch (error) {
    console.error('Add diet error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// List all clients
const getClients = async (req, res) => {
  const coachUserId = req.user.userId;

  try {
    const coach = await findCoachByUserId(coachUserId);
    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Coach profile not found' });
    }

    const clients = await Client.find({ coachId: coach._id });
    const notes = await ClientNotes.find({ coachId: coach._id });

    const clientsData = clients.map(client => ({
      id: client._id,
      clientId: client._id,
      coachId: coach._id,
      name: client.name,
      email: client.email,
      subscription: client.subscription?.status || 'none',
      subscriptionStatus: client.subscription?.status || 'inactive',
      subscriptionMethod: client.subscription?.method || 'none',
      subscriptionStartDate: client.subscription?.startDate || null,
      subscriptionEndDate: client.subscription?.endDate || null,
      notes: notes.filter(n => n.clientId.toString() === client._id.toString()).length
    }));

    res.status(200).json({
      status: 'success',
      clients: clientsData
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get only subscribed clients (for creating training plans)
const getSubscribedClients = async (req, res) => {
  const coachUserId = req.user.userId;

  try {
    const coach = await findCoachByUserId(coachUserId);
    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Coach profile not found' });
    }

    // Filter clients with active subscriptions
    const clients = await Client.find({ 
      coachId: coach._id,
      'subscription.status': 'active'
    });
    
    const subscribedClientsData = clients.map(client => ({
      id: client._id,
      clientId: client._id,
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
  } catch (error) {
    console.error('Get subscribed clients error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Add note for client
const addClientNote_handler = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const coachUserId = req.user.userId;

  if (!note) {
    return res.status(400).json({ status: 'error', message: 'Note required' });
  }

  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    const coach = await findCoachByUserId(coachUserId);
    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Coach profile not found' });
    }

    // Verify coach owns this client
    if (client.coachId.toString() !== coach._id.toString()) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized: This client is not assigned to you' });
    }

    const newNote = await addClientNote({
      clientId: id,
      coachId: coach._id,
      note
    });

    res.status(200).json({
      status: 'success',
      message: 'Note added successfully',
      noteId: newNote._id
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Add weekly training plan (only for subscribed clients)
const addTrainingPlan_handler = async (req, res) => {
  const { clientId, week, trainingPlan } = req.body;
  const coachUserId = req.user.userId;

  if (!clientId || !week || !trainingPlan) {
    return res.status(400).json({ status: 'error', message: 'clientId, week, and trainingPlan required' });
  }

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    const coach = await findCoachByUserId(coachUserId);
    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Coach profile not found' });
    }

    // Verify coach owns this client
    if (client.coachId.toString() !== coach._id.toString()) {
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

    const newTraining = await createTrainingPlan({
      clientId,
      coachId: coach._id,
      weekNumber: week,
      plan: trainingPlan
    });

    res.status(200).json({
      status: 'success',
      message: 'Training plan added successfully',
      trainingId: newTraining._id
    });
  } catch (error) {
    console.error('Add training plan error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get client notes
const getClientNotes = async (req, res) => {
  const { id } = req.params;
  const coachUserId = req.user.userId;

  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    const coach = await findCoachByUserId(coachUserId);
    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Coach profile not found' });
    }

    // Verify coach has access to this client
    if (client.coachId.toString() !== coach._id.toString()) {
      return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    const notes = await getClientNotesByClientId(id);

    const coachNotes = notes.filter(item => item.coachId.toString() === coach._id.toString());

    res.status(200).json({
      status: 'success',
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        notes: coachNotes.map(n => ({ id: n._id, note: n.note, createdAt: n.createdAt }))
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
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
  addClientNote: addClientNote_handler,
  addTrainingPlan: addTrainingPlan_handler,
  getClientNotes,
  logout
};

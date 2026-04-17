// MongoDB-based Database Layer with Error Handling
// Maintains the same API interface for controllers

const {
  User,
  Coach,
  Client,
  SubscriptionPlan,
  DietPlan,
  TrainingPlan,
  ClientNotes,
  Payment
} = require('./mongoModels');

// ==================== USER OPERATIONS ====================

const findUserByEmail = async (email) => {
  try {
    console.log(`🔍 Finding user by email: ${email}`);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) console.log(`✅ User found: ${user.name}`);
    return user;
  } catch (error) {
    console.error(`❌ Error finding user by email: ${error.message}`);
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    console.log(`🔍 Finding user by ID: ${id}`);
    const user = await User.findById(id);
    if (user) console.log(`✅ User found: ${user.name}`);
    return user;
  } catch (error) {
    console.error(`❌ Error finding user by ID: ${error.message}`);
    throw error;
  }
};

const findCoachById = async (id) => {
  try {
    const coach = await Coach.findById(id).populate('userId');
    return coach;
  } catch (error) {
    console.error(`❌ Error finding coach: ${error.message}`);
    throw error;
  }
};

const findClientById = async (id) => {
  try {
    const client = await Client.findById(id).populate('userId').populate('coachId').populate('subscription.planId');
    return client;
  } catch (error) {
    console.error(`❌ Error finding client: ${error.message}`);
    throw error;
  }
};

const findCoachByUserId = async (userId) => {
  try {
    const coach = await Coach.findOne({ userId });
    return coach;
  } catch (error) {
    console.error(`❌ Error finding coach by user ID: ${error.message}`);
    throw error;
  }
};

const findClientByUserId = async (userId) => {
  try {
    const client = await Client.findOne({ userId });
    return client;
  } catch (error) {
    console.error(`❌ Error finding client by user ID: ${error.message}`);
    throw error;
  }
};

// ==================== USER CREATION ====================

const createUser = async (userData) => {
  try {
    console.log(`📝 Creating user: ${userData.name} (${userData.email}) as ${userData.role}`);
    
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    
    console.log(`✅ User created successfully: ${savedUser._id}`);
    return savedUser;
  } catch (error) {
    console.error(`❌ Error creating user: ${error.message}`);
    if (error.code === 11000) {
      console.error(`⚠️  Duplicate key error - Email already exists`);
      throw new Error('Email already registered');
    }
    throw error;
  }
};

const createCoach = async (coachData) => {
  try {
    console.log(`📝 Creating coach: ${coachData.name}`);
    
    const newCoach = new Coach(coachData);
    const savedCoach = await newCoach.save();
    
    console.log(`✅ Coach created successfully: ${savedCoach._id}`);
    return savedCoach;
  } catch (error) {
    console.error(`❌ Error creating coach: ${error.message}`);
    throw error;
  }
};

const createClient = async (clientData) => {
  try {
    console.log(`📝 Creating client: ${clientData.name}`);
    
    const newClient = new Client(clientData);
    const savedClient = await newClient.save();
    
    console.log(`✅ Client created successfully: ${savedClient._id}`);
    return savedClient;
  } catch (error) {
    console.error(`❌ Error creating client: ${error.message}`);
    throw error;
  }
};

// ==================== GET OPERATIONS ====================

const getAllUsers = async (role = null) => {
  try {
    if (role) {
      console.log(`🔍 Getting all users with role: ${role}`);
      return await User.find({ role });
    }
    console.log(`🔍 Getting all users`);
    return await User.find();
  } catch (error) {
    console.error(`❌ Error getting users: ${error.message}`);
    throw error;
  }
};

const getAllCoaches = async () => {
  try {
    console.log(`🔍 Getting all coaches`);
    return await Coach.find().populate('userId');
  } catch (error) {
    console.error(`❌ Error getting coaches: ${error.message}`);
    throw error;
  }
};

const getAllClients = async () => {
  try {
    console.log(`🔍 Getting all clients`);
    return await Client.find().populate('userId').populate('coachId').populate('subscription.planId');
  } catch (error) {
    console.error(`❌ Error getting clients: ${error.message}`);
    throw error;
  }
};

const getCoachClients = async (coachId) => {
  try {
    console.log(`🔍 Getting clients for coach: ${coachId}`);
    return await Coach.findById(coachId).populate('clients');
  } catch (error) {
    console.error(`❌ Error getting coach clients: ${error.message}`);
    throw error;
  }
};

// ==================== SUBSCRIPTION PLANS ====================

const getAllPlans = async () => {
  try {
    console.log(`🔍 Getting all subscription plans from database...`);
    const allPlans = await SubscriptionPlan.find({});
    console.log(`  📊 Total plans in DB: ${allPlans.length}`);
    
    const activePlans = await SubscriptionPlan.find({ active: true });
    console.log(`  ✅ Active plans in DB: ${activePlans.length}`);
    
    return activePlans;
  } catch (error) {
    console.error(`❌ Error getting plans: ${error.message}`);
    throw error;
  }
};

const getPlanById = async (planId) => {
  try {
    return await SubscriptionPlan.findById(planId);
  } catch (error) {
    console.error(`❌ Error getting plan: ${error.message}`);
    throw error;
  }
};

const createSubscriptionPlan = async (planData) => {
  try {
    console.log(`📝 Creating subscription plan: ${planData.name}`);
    
    const newPlan = new SubscriptionPlan(planData);
    const savedPlan = await newPlan.save();
    
    console.log(`✅ Plan created successfully: ${savedPlan._id}`);
    return savedPlan;
  } catch (error) {
    console.error(`❌ Error creating plan: ${error.message}`);
    throw error;
  }
};

// ==================== DIET PLANS ====================

const getDietPlanByClientId = async (clientId) => {
  try {
    console.log(`🔍 Getting diet plans for client: ${clientId}`);
    return await DietPlan.find({ clientId });
  } catch (error) {
    console.error(`❌ Error getting diet plans: ${error.message}`);
    throw error;
  }
};

const createDietPlan = async (dietData) => {
  try {
    console.log(`📝 Creating diet plan for client: ${dietData.clientId}`);
    
    const newDiet = new DietPlan(dietData);
    const savedDiet = await newDiet.save();
    
    console.log(`✅ Diet plan created successfully: ${savedDiet._id}`);
    return savedDiet;
  } catch (error) {
    console.error(`❌ Error creating diet plan: ${error.message}`);
    throw error;
  }
};

// ==================== TRAINING PLANS ====================

const getTrainingPlanByClientId = async (clientId) => {
  try {
    console.log(`🔍 Getting training plans for client: ${clientId}`);
    return await TrainingPlan.find({ clientId });
  } catch (error) {
    console.error(`❌ Error getting training plans: ${error.message}`);
    throw error;
  }
};

const createTrainingPlan = async (trainingData) => {
  try {
    console.log(`📝 Creating training plan for client: ${trainingData.clientId}`);
    
    const newTraining = new TrainingPlan(trainingData);
    const savedTraining = await newTraining.save();
    
    console.log(`✅ Training plan created successfully: ${savedTraining._id}`);
    return savedTraining;
  } catch (error) {
    console.error(`❌ Error creating training plan: ${error.message}`);
    throw error;
  }
};

// ==================== CLIENT NOTES ====================

const getClientNotesByClientId = async (clientId) => {
  try {
    console.log(`🔍 Getting notes for client: ${clientId}`);
    return await ClientNotes.find({ clientId });
  } catch (error) {
    console.error(`❌ Error getting client notes: ${error.message}`);
    throw error;
  }
};

const addClientNote = async (noteData) => {
  try {
    console.log(`📝 Adding note for client: ${noteData.clientId}`);
    
    const newNote = new ClientNotes(noteData);
    const savedNote = await newNote.save();
    
    console.log(`✅ Note added successfully: ${savedNote._id}`);
    return savedNote;
  } catch (error) {
    console.error(`❌ Error adding client note: ${error.message}`);
    throw error;
  }
};

// ==================== PAYMENTS ====================

const getPaymentsByClientId = async (clientId) => {
  try {
    console.log(`🔍 Getting payments for client: ${clientId}`);
    return await Payment.find({ clientId });
  } catch (error) {
    console.error(`❌ Error getting payments: ${error.message}`);
    throw error;
  }
};

const createPayment = async (paymentData) => {
  try {
    console.log(`📝 Creating payment for client: ${paymentData.clientId}`);
    
    const newPayment = new Payment(paymentData);
    const savedPayment = await newPayment.save();
    
    console.log(`✅ Payment created successfully: ${savedPayment._id}`);
    return savedPayment;
  } catch (error) {
    console.error(`❌ Error creating payment: ${error.message}`);
    throw error;
  }
};

// ==================== UPDATE OPERATIONS ====================

const updateUser = async (userId, updateData) => {
  try {
    console.log(`🔄 Updating user: ${userId}`);
    const updated = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
    console.log(`✅ User updated successfully`);
    return updated;
  } catch (error) {
    console.error(`❌ Error updating user: ${error.message}`);
    throw error;
  }
};

const updateCoach = async (coachId, updateData) => {
  try {
    console.log(`🔄 Updating coach: ${coachId}`);
    const updated = await Coach.findByIdAndUpdate(coachId, updateData, { new: true, runValidators: true });
    console.log(`✅ Coach updated successfully`);
    return updated;
  } catch (error) {
    console.error(`❌ Error updating coach: ${error.message}`);
    throw error;
  }
};

const updateClient = async (clientId, updateData) => {
  try {
    console.log(`🔄 Updating client: ${clientId}`);
    const updated = await Client.findByIdAndUpdate(clientId, updateData, { new: true, runValidators: true });
    console.log(`✅ Client updated successfully`);
    return updated;
  } catch (error) {
    console.error(`❌ Error updating client: ${error.message}`);
    throw error;
  }
};

// ==================== DELETE OPERATIONS ====================

const deleteUser = async (userId) => {
  try {
    console.log(`🗑️  Deleting user: ${userId}`);
    const deleted = await User.findByIdAndDelete(userId);
    console.log(`✅ User deleted successfully`);
    return deleted;
  } catch (error) {
    console.error(`❌ Error deleting user: ${error.message}`);
    throw error;
  }
};

const deleteCoach = async (coachId) => {
  try {
    console.log(`🗑️  Deleting coach: ${coachId}`);
    const deleted = await Coach.findByIdAndDelete(coachId);
    console.log(`✅ Coach deleted successfully`);
    return deleted;
  } catch (error) {
    console.error(`❌ Error deleting coach: ${error.message}`);
    throw error;
  }
};

const deleteClient = async (clientId) => {
  try {
    console.log(`🗑️  Deleting client: ${clientId}`);
    const deleted = await Client.findByIdAndDelete(clientId);
    console.log(`✅ Client deleted successfully`);
    return deleted;
  } catch (error) {
    console.error(`❌ Error deleting client: ${error.message}`);
    throw error;
  }
};

// ==================== ANALYTICS ====================

const getDashboardStats = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCoaches = await Coach.countDocuments();
    const totalClients = await Client.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const activeSubscriptions = await Client.countDocuments({ 'subscription.status': 'active' });

    return {
      totalUsers,
      totalCoaches,
      totalClients,
      activeSubscriptions,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {
      totalUsers: 0,
      totalCoaches: 0,
      totalClients: 0,
      activeSubscriptions: 0,
      totalRevenue: 0
    };
  }
};

// ==================== SEARCH OPERATIONS ====================

const searchUsers = async (query) => {
  try {
    return await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });
  } catch (error) {
    console.error(`❌ Error searching users: ${error.message}`);
    throw error;
  }
};

const searchCoaches = async (query) => {
  try {
    return await Coach.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { specialization: { $regex: query, $options: 'i' } }
      ]
    });
  } catch (error) {
    console.error(`❌ Error searching coaches: ${error.message}`);
    throw error;
  }
};

// ==================== BATCH OPERATIONS ====================

const addClientToCoach = async (coachId, clientId) => {
  try {
    console.log(`🔗 Adding client ${clientId} to coach ${coachId}`);
    const updated = await Coach.findByIdAndUpdate(
      coachId,
      { $addToSet: { clients: clientId } },
      { new: true }
    );
    console.log(`✅ Client added to coach`);
    return updated;
  } catch (error) {
    console.error(`❌ Error adding client to coach: ${error.message}`);
    throw error;
  }
};

const removeClientFromCoach = async (coachId, clientId) => {
  try {
    console.log(`🔗 Removing client ${clientId} from coach ${coachId}`);
    const updated = await Coach.findByIdAndUpdate(
      coachId,
      { $pull: { clients: clientId } },
      { new: true }
    );
    console.log(`✅ Client removed from coach`);
    return updated;
  } catch (error) {
    console.error(`❌ Error removing client from coach: ${error.message}`);
    throw error;
  }
};

module.exports = {
  // User operations
  findUserByEmail,
  findUserById,
  findCoachById,
  findClientById,
  findCoachByUserId,
  findClientByUserId,
  createUser,
  createCoach,
  createClient,
  getAllUsers,
  getAllCoaches,
  getAllClients,
  getCoachClients,
  
  // Subscription Plans
  getAllPlans,
  getPlanById,
  createSubscriptionPlan,
  
  // Diet Plans
  getDietPlanByClientId,
  createDietPlan,
  
  // Training Plans
  getTrainingPlanByClientId,
  createTrainingPlan,
  
  // Client Notes
  getClientNotesByClientId,
  addClientNote,
  
  // Payments
  getPaymentsByClientId,
  createPayment,
  
  // Update operations
  updateUser,
  updateCoach,
  updateClient,
  
  // Delete operations
  deleteUser,
  deleteCoach,
  deleteClient,
  
  // Analytics
  getDashboardStats,
  
  // Search
  searchUsers,
  searchCoaches,
  
  // Batch operations
  addClientToCoach,
  removeClientFromCoach,
  
  // Export models for direct use if needed
  User,
  Coach,
  Client,
  SubscriptionPlan,
  DietPlan,
  TrainingPlan,
  ClientNotes,
  Payment
};

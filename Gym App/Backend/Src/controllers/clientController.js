const {
  findClientById,
  findClientByUserId,
  getPlanById,
  updateClient,
  createPayment,
  getTrainingPlanByClientId,
  getAllPlans,
  SubscriptionPlan,
  Client,
  Coach,
  Payment
} = require('../../db/mongoDatabase');

// Get Dashboard
const getDashboard = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Client dashboard access granted'
  });
};

// Welcome Page
const welcomePage = async (req, res) => {
  const userId = req.user.userId;

  try {
    const client = await findClientByUserId(userId);

    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Welcome page loaded',
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
        subscription: client.subscription || null
      }
    });
  } catch (error) {
    console.error('Welcome page error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Book Workout
const bookWorkout = async (req, res) => {
  const { workoutId, coachId, agree } = req.body;
  const userId = req.user.userId;

  if (!workoutId || !agree) {
    return res.status(400).json({ status: 'error', message: 'workoutId and agree required' });
  }

  if (!coachId) {
    return res.status(400).json({ status: 'error', message: 'coachId is required' });
  }

  try {
    const client = await findClientByUserId(userId);

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

    // Find the coach
    const coach = await Coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Coach not found' });
    }

    // Assign coach to client (if not already assigned with this coach)
    if (!client.coachId || client.coachId.toString() !== coachId) {
      await updateClient(client._id, { coachId });
      
      // Add client to coach's clients list if not already there
      if (!coach.clients.includes(client._id)) {
        coach.clients.push(client._id);
        await coach.save();
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Workout booked successfully',
      workoutId,
      coachId
    });
  } catch (error) {
    console.error('Book workout error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Select Subscription Plan
const selectPlan = async (req, res) => {
  const { planId, method } = req.body;

  if (!planId || !method) {
    return res.status(400).json({ status: 'error', message: 'planId and method required' });
  }

  if (!['online', 'gym', 'hybrid'].includes(method)) {
    return res.status(400).json({ status: 'error', message: 'Invalid method' });
  }

  try {
    let plan;
    
    // Attempt to find by ID (ObjectId)
    try {
      plan = await SubscriptionPlan.findById(planId);
    } catch (e) {
      // Fallback: search by name or other logic if the ID is a string like "online-pro"
      plan = await SubscriptionPlan.findOne({ 
        $or: [
          { name: { $regex: planId.replace('-', ' '), $options: 'i' } },
          { type: planId.split('-')[0] }
        ]
      });
    }

    if (!plan) {
      return res.status(404).json({ status: 'error', message: 'Plan not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Plan selected, proceed to payment',
      plan: {
        id: plan._id,
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        method
      }
    });
  } catch (error) {
    console.error('Select plan error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Make Payment
const makePayment = async (req, res) => {
  const { planId, paymentMethod, paymentDetails } = req.body;
  const userId = req.user.userId;

  if (!planId || !paymentMethod || !paymentDetails) {
    return res.status(400).json({ status: 'error', message: 'planId, paymentMethod, and paymentDetails required' });
  }

  try {
    let plan;
    try {
      plan = await SubscriptionPlan.findById(planId);
    } catch (e) {
      // Fallback: search by name or other logic if the ID is a string like "online-pro"
      plan = await SubscriptionPlan.findOne({ 
        $or: [
          { name: { $regex: planId.replace('-', ' '), $options: 'i' } }
        ]
      });
    }

    if (!plan) {
      return res.status(404).json({ status: 'error', message: 'Plan not found' });
    }

    const client = await findClientByUserId(userId);

    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    // Create payment record
    const payment = await createPayment({
      clientId: client._id,
      planId: plan._id,
      amount: plan.price,
      method: paymentMethod,
      status: 'completed',
      transactionId: `TXN_${Date.now()}`
    });

    // Update client subscription
    const subscription = {
      planId: plan._id,
      method: paymentDetails.method || 'gym',
      startDate: new Date(),
      endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
      status: 'active'
    };

    await updateClient(client._id, { subscription });

    res.status(200).json({
      status: 'success',
      message: 'Payment confirmed',
      paymentId: payment._id,
      subscription
    });
  } catch (error) {
    console.error('Make payment error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Renew or Change Subscription
const renewSubscription = async (req, res) => {
  const { newPlanId } = req.body;
  const userId = req.user.userId;

  if (!newPlanId) {
    return res.status(400).json({ status: 'error', message: 'newPlanId required' });
  }

  try {
    const plan = await getPlanById(newPlanId);

    if (!plan) {
      return res.status(404).json({ status: 'error', message: 'Plan not found' });
    }

    const client = await findClientByUserId(userId);

    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    // Update subscription
    const subscription = client.subscription || {};
    subscription.planId = newPlanId;
    subscription.startDate = new Date();
    subscription.endDate = new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000);
    subscription.status = 'active';
    subscription.method = subscription.method || 'gym';

    await updateClient(client._id, { subscription });

    res.status(200).json({ status: 'success', message: 'Subscription updated', subscription });
  } catch (error) {
    console.error('Renew subscription error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get Weekly Workouts
const getWeeklyWorkouts = async (req, res) => {
  const userId = req.user.userId;

  try {
    const client = await findClientByUserId(userId);

    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    // Get training plans assigned to this client
    const trainingPlans = await getTrainingPlanByClientId(client._id);

    const workouts = trainingPlans.map(plan => ({
      id: plan._id,
      week: plan.weekNumber,
      name: `Week ${plan.weekNumber}`,
      details: plan.plan
    }));

    res.status(200).json({ status: 'success', workouts });
  } catch (error) {
    console.error('Get weekly workouts error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get Progress
const getProgress = async (req, res) => {
  const userId = req.user.userId;

  try {
    const client = await findClientByUserId(userId);

    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    res.status(200).json({
      status: 'success',
      progress: {
        dietProgress: client.progress?.dietProgress || 'Not started',
        workoutProgress: client.progress?.workoutProgress || '0%',
        notes: client.progress?.notes || 'No notes'
      },
      metricsHistory: client.metricsHistory || []
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update Progress
const updateProgress = async (req, res) => {
  const { 
    dietProgress, 
    workoutProgress, 
    notes,
    weight,
    bodyFat,
    muscleMass,
    chest,
    waist,
    biceps
  } = req.body;
  
  const userId = req.user.userId;

  try {
    const client = await findClientByUserId(userId);

    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Client not found' });
    }

    // Update current progress summary
    const progress = client.progress || {};
    if (dietProgress) progress.dietProgress = dietProgress;
    if (workoutProgress) progress.workoutProgress = workoutProgress;
    if (notes) progress.notes = notes;

    // Add to metrics history if weight or other metrics are provided
    if (weight || bodyFat || muscleMass || chest || waist || biceps) {
      const newMetric = {
        date: new Date(),
        weight: weight ? parseFloat(weight) : undefined,
        bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
        muscleMass: muscleMass ? parseFloat(muscleMass) : undefined,
        chest: chest ? parseFloat(chest) : undefined,
        waist: waist ? parseFloat(waist) : undefined,
        biceps: biceps ? parseFloat(biceps) : undefined,
        notes: notes
      };
      
      if (!client.metricsHistory) client.metricsHistory = [];
      client.metricsHistory.push(newMetric);
    }

    await updateClient(client._id, { progress, metricsHistory: client.metricsHistory });

    res.status(200).json({ 
      status: 'success', 
      message: 'Progress and metrics updated successfully', 
      progress,
      metricsCount: client.metricsHistory ? client.metricsHistory.length : 0
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Logout
const logout = (req, res) => {
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

// Get Subscription Plans
const getSubscriptionPlans = async (req, res) => {
  try {
    console.log('📋 Starting getSubscriptionPlans request');
    
    let plans = await getAllPlans();
    console.log(`📊 Found ${plans ? plans.length : 0} active plans in database`);

    // Auto-create default plans if none exist
    if (!plans || plans.length === 0) {
      console.log('⚠️  No active plans found, creating default plans...');
      
      const defaultPlans = [
        { name: 'Online Starter', price: 29.99, duration: 30, type: 'online', features: ['Basic workouts', 'Email support'], description: 'Perfect for beginners', active: true },
        { name: 'Online Pro', price: 49.99, duration: 30, type: 'online', features: ['Advanced workouts', 'Video sessions', 'Priority support'], description: 'For dedicated athletes', active: true },
        { name: 'Online Elite', price: 79.99, duration: 30, type: 'online', features: ['All features', '1-on-1 coaching', 'Meal planning', 'Priority support'], description: 'Premium experience', active: true },
        { name: 'Gym Starter', price: 39.99, duration: 30, type: 'gym', features: ['Basic access', 'Equipment access', 'Email support'], description: 'Access to all gym facilities', active: true },
        { name: 'Gym Pro', price: 59.99, duration: 30, type: 'gym', features: ['Unlimited access', 'Personal trainer', 'Group classes', 'Locker room'], description: 'Full gym experience', active: true },
        { name: 'Gym Elite', price: 89.99, duration: 30, type: 'gym', features: ['VIP access', 'Personal training', 'Nutrition coaching', 'Recovery services'], description: 'Ultimate fitness', active: true }
      ];

      let createdCount = 0;
      for (const planData of defaultPlans) {
        try {
          const created = await SubscriptionPlan.create(planData);
          console.log(`✅ Created plan: ${created.name} (ID: ${created._id})`);
          createdCount++;
        } catch (err) {
          console.error(`❌ Failed to create plan "${planData.name}": ${err.message}`);
        }
      }
      
      console.log(`📝 Created ${createdCount}/${defaultPlans.length} plans`);

      // Re-fetch all active plans
      plans = await getAllPlans();
      console.log(`📊 After creation: Found ${plans ? plans.length : 0} active plans`);
    }

    if (!plans || plans.length === 0) {
      console.warn('⚠️  No plans available even after creation attempt');
      return res.status(404).json({ 
        status: 'error', 
        message: 'Plan not found' 
      });
    }

    // Format response with required fields
    const formattedPlans = plans.map((plan, idx) => ({
      id: plan._id.toString(),
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      type: plan.type,
      category: plan.type,
      monthlyPrice: plan.price,
      billingPeriod: 'month',
      features: plan.features || [],
      description: plan.description || '',
      isRecommended: idx === 1 || idx === 4,
      savings: Math.round(plan.price * 0.1)
    }));

    console.log(`✅ Returning ${formattedPlans.length} formatted plans`);
    res.status(200).json({
      status: 'success',
      plans: formattedPlans
    });
  } catch (error) {
    console.error('❌ Get plans error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get All Coaches (for booking)
const getAllCoaches = async (req, res) => {
  try {
    console.log('🔍 Fetching all coaches for booking...');
    const coaches = await require('../../db/mongoDatabase').getAllCoaches();
    console.log(`📊 Found ${coaches.length} total coaches in database`);
    
    const formattedCoaches = coaches.map(c => ({
      _id: c._id,
      id: c._id,
      name: c.name,
      email: c.email,
      specialization: c.specialization || 'General Training',
      experience: c.experience || 0,
      bio: c.bio || '',
      status: c.status || 'active',
      rating: 4.8 // Mock rating for UI
    }));
    
    console.log(`✅ Returning ${formattedCoaches.length} formatted coaches`);
    
    res.status(200).json({
      status: 'success',
      coaches: formattedCoaches
    });
  } catch (error) {
    console.error('❌ Get all coaches error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
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
  getSubscriptionPlans,
  getAllCoaches,
  logout
};

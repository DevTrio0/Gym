// Mock Database with in-memory storage
// This will be replaced with a real database later

const bcrypt = require('bcryptjs');

const mockDatabase = {
  users: [
    {
      id: 'user_1',
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      status: 'active',
      createdAt: new Date()
    },
    {
      id: 'coach_1',
      name: 'John Coach',
      email: 'john@coach.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'coach',
      status: 'active',
      createdAt: new Date()
    },
    {
      id: 'client_1',
      name: 'Jane Client',
      email: 'jane@client.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'client',
      status: 'active',
      createdAt: new Date()
    }
  ],

  coaches: [
    {
      id: 'coach_1',
      userId: 'coach_1',
      name: 'John Coach',
      email: 'john@coach.com',
      specialization: 'Strength Training',
      bio: 'Expert in strength and conditioning',
      clients: ['client_1'],
      status: 'active',
      approvedAt: new Date(),
      createdAt: new Date()
    }
  ],

  clients: [
    {
      id: 'client_1',
      userId: 'client_1',
      name: 'Jane Client',
      email: 'jane@client.com',
      coachId: 'coach_1',
      subscription: {
        planId: 'plan_1',
        method: 'gym',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active'
      },
      progress: {
        dietProgress: 'Good',
        workoutProgress: '80%',
        notes: 'Progressing well'
      },
      createdAt: new Date()
    }
  ],

  subscriptionPlans: [
    {
      id: 'plan_1',
      name: 'Basic Plan',
      price: 50,
      duration: 30,
      type: 'gym',
      description: 'Basic gym access'
    },
    {
      id: 'plan_2',
      name: 'Premium Plan',
      price: 100,
      duration: 30,
      type: 'online',
      description: 'Online coaching with diet plan'
    },
    {
      id: 'plan_3',
      name: 'Elite Plan',
      price: 150,
      duration: 30,
      type: 'hybrid',
      description: 'Gym + Online coaching'
    }
  ],

  dietPlans: [
    {
      id: 'diet_1',
      clientId: 'client_1',
      coachId: 'coach_1',
      plan: {
        breakfast: '500 cal',
        lunch: '600 cal',
        dinner: '500 cal',
        snacks: '200 cal'
      },
      createdAt: new Date()
    }
  ],

  trainingPlans: [
    {
      id: 'training_1',
      clientId: 'client_1',
      coachId: 'coach_1',
      weekNumber: 1,
      plan: {
        monday: 'Chest & Triceps',
        tuesday: 'Back & Biceps',
        wednesday: 'Rest',
        thursday: 'Legs',
        friday: 'Shoulders',
        saturday: 'Full Body',
        sunday: 'Rest'
      },
      createdAt: new Date()
    }
  ],

  clientNotes: [
    {
      id: 'note_1',
      clientId: 'client_1',
      coachId: 'coach_1',
      note: 'Jane is doing great with her workout routine',
      createdAt: new Date()
    }
  ],

  payments: [
    {
      id: 'payment_1',
      clientId: 'client_1',
      planId: 'plan_1',
      amount: 50,
      method: 'credit_card',
      status: 'completed',
      date: new Date()
    }
  ],

  resetTokens: [],

  sessions: []
};

// Helper functions to manage mock database
const getNextId = (prefix) => {
  return `${prefix}_${Date.now()}`;
};

const findUserById = (id) => {
  return mockDatabase.users.find(u => u.id === id);
};

const findUserByEmail = (email) => {
  return mockDatabase.users.find(u => u.email === email);
};

const findCoachById = (id) => {
  return mockDatabase.coaches.find(c => c.id === id);
};

const findClientById = (id) => {
  return mockDatabase.clients.find(c => c.id === id);
};

const findSubscriptionPlan = (id) => {
  return mockDatabase.subscriptionPlans.find(p => p.id === id);
};

// Initialize passwords by hashing them
const initializePasswords = () => {
  mockDatabase.users.forEach(user => {
    // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    if (user.password && !user.password.match(/^\$2[aby]\$/)) {
      user.password = bcrypt.hashSync(user.password, 10);
      console.log(`✓ Hashed password for ${user.email}`);
    }
  });
};

// Initialize on module load
initializePasswords();

module.exports = {
  mockDatabase,
  getNextId,
  findUserById,
  findUserByEmail,
  findCoachById,
  findClientById,
  findSubscriptionPlan
};

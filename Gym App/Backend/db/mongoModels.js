const mongoose = require('mongoose');

// User Schema (All roles)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'coach', 'client'],
      message: 'Role must be admin, coach, or client'
    },
    required: [true, 'Role is required']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'pending', 'deactivated'],
      message: 'Status must be active, pending, or deactivated'
    },
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Coach Schema
const coachSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Coach name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Coach email is required'],
    lowercase: true,
    trim: true
  },
  specialization: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    default: 0
  },
  clients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  }],
  status: {
    type: String,
    enum: {
      values: ['pending', 'active', 'inactive'],
      message: 'Status must be pending, active, or inactive'
    },
    default: 'pending'
  },
  approvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Client Schema
const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Client email is required'],
    lowercase: true,
    trim: true
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach'
  },
  age: {
    type: Number,
    default: 0
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  phone: {
    type: String,
    default: ''
  },
  subscription: {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlan'
    },
    method: {
      type: String,
      enum: ['gym', 'online', 'hybrid'],
      default: 'gym'
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'inactive'
    }
  },
  progress: {
    dietProgress: { type: String, default: '' },
    workoutProgress: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  metricsHistory: [{
    date: { type: Date, default: Date.now },
    weight: Number,
    bodyFat: Number,
    muscleMass: Number,
    chest: Number,
    waist: Number,
    biceps: Number,
    notes: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Subscription Plan Schema
const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    default: 30
  },
  type: {
    type: String,
    enum: {
      values: ['gym', 'online', 'hybrid'],
      message: 'Type must be gym, online, or hybrid'
    },
    required: [true, 'Type is required']
  },
  description: {
    type: String,
    default: ''
  },
  features: [String],
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Diet Plan Schema
const dietPlanSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required']
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: [true, 'Coach ID is required']
  },
  plan: {
    breakfast: String,
    lunch: String,
    dinner: String,
    snacks: String,
    additional: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Training Plan Schema
const trainingPlanSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required']
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: [true, 'Coach ID is required']
  },
  weekNumber: {
    type: Number,
    required: [true, 'Week number is required']
  },
  plan: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Client Notes Schema
const clientNotesSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required']
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: [true, 'Coach ID is required']
  },
  note: {
    type: String,
    required: [true, 'Note content is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required']
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan'
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  method: {
    type: String,
    enum: {
      values: ['credit_card', 'debit_card', 'bank_transfer', 'other'],
      message: 'Payment method not valid'
    },
    default: 'credit_card'
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'completed', 'failed', 'refunded'],
      message: 'Payment status not valid'
    },
    default: 'pending'
  },
  transactionId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Coach Salary Schema
const coachSalarySchema = new mongoose.Schema({
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach', required: true, unique: true },
  amount: { type: Number, required: true, default: 0 },
  description: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Salary Payment Schema
const salaryPaymentSchema = new mongoose.Schema({
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach', required: true },
  salaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'CoachSalary', required: true },
  amount: { type: Number, required: true },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
  paidAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Create Models
const User = mongoose.model('User', userSchema);
const Coach = mongoose.model('Coach', coachSchema);
const Client = mongoose.model('Client', clientSchema);
const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
const DietPlan = mongoose.model('DietPlan', dietPlanSchema);
const TrainingPlan = mongoose.model('TrainingPlan', trainingPlanSchema);
const ClientNotes = mongoose.model('ClientNotes', clientNotesSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const CoachSalary = mongoose.model('CoachSalary', coachSalarySchema);
const SalaryPayment = mongoose.model('SalaryPayment', salaryPaymentSchema);

module.exports = {
  User,
  Coach,
  Client,
  SubscriptionPlan,
  DietPlan,
  TrainingPlan,
  ClientNotes,
  Payment,
  userSchema,
  coachSchema,
  clientSchema,
  subscriptionPlanSchema,
  dietPlanSchema,
  trainingPlanSchema,
  clientNotesSchema,
  paymentSchema
};

// Frontend API Configuration
// Handles all communication with the backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Gym App Frontend API Service
 * All API endpoints for the gymnasium application
 */

// ============= AUTHENTICATION ENDPOINTS =============

/**
 * Get user profile
 * @param {string} token - JWT token
 * @returns {Promise<{user: Object}>}
 */
export const getProfile = async (token: string) => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch profile');
  }

  return data;
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{token: string, user: Object, redirectTo: string}>}
 */
export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

/**
 * Register new user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (admin, coach, client)
 * @returns {Promise<{userId: string, message: string}>}
 */
export const registerUser = async (name: string, email: string, password: string, role: string) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};

/**
 * Check if email exists
 * @param {string} email - Email to check
 * @returns {Promise<{exists: boolean, role?: string}>}
 */
export const loginCheck = async (email: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });

  return await response.json();
};

/**
 * Forgot password request
 * @param {string} email - User email
 * @returns {Promise<{message: string, resetToken?: string}>}
 */
export const forgotPassword = async (email: string) => {
  const response = await fetch(`${API_URL}/auth/forgetpassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });

  return await response.json();
};

/**
 * Reset password
 * @param {string} email - User email
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<{message: string}>}
 */
export const resetPassword = async (email: string, token: string, newPassword: string) => {
  const response = await fetch(`${API_URL}/auth/resetpassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, token, newPassword })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Password reset failed');
  }

  return data;
};

// ============= ADMIN ENDPOINTS =============

/**
 * Get admin dashboard
 * @param {string} token - JWT token
 * @returns {Promise<{message: string}>}
 */
export const getAdminDashboard = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/dashboard`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  return await response.json();
};

/**
 * Get dashboard statistics
 * @param {string} token - JWT token
 * @returns {Promise<{totalUsers: number, totalCoaches: number, totalClients: number}>}
 */
export const getAdminStats = async (token: string) => {
  const [users, coaches, clients] = await Promise.all([
    fetch(`${API_URL}/admin/stats/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),
    fetch(`${API_URL}/admin/stats/coaches`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),
    fetch(`${API_URL}/admin/stats/clients`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()),
  ]);

  return { users, coaches, clients };
};

/**
 * Add new coach
 * @param {string} token - JWT token
 * @param {Object} coachData - Coach details
 * @returns {Promise<{coachId: string, message: string}>}
 */
export const addCoach = async (token: string, coachData: any) => {
  const response = await fetch(`${API_URL}/admin/dashboard/add-coach`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(coachData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add coach');
  }

  return data;
};

/**
 * Add new client
 * @param {string} token - JWT token
 * @param {Object} clientData - Client details
 * @returns {Promise<{clientId: string, message: string}>}
 */
export const addClient = async (token: string, clientData: any) => {
  const response = await fetch(`${API_URL}/admin/dashboard/add-client`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(clientData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add client');
  }

  return data;
};

/**
 * Get all coaches
 * @param {string} token - JWT token
 * @returns {Promise<{coaches: Array}>}
 */
export const getAllCoaches = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/dashboard/all-coaches`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch coaches');
  }

  return data;
};

/**
 * Get all subscription plans (Admin)
 */
export const getAdminPlans = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/dashboard/plans`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch plans');
  return data;
};

/**
 * Create a new subscription plan
 */
export const createPlan = async (token: string, planData: any) => {
  const response = await fetch(`${API_URL}/admin/dashboard/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(planData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create plan');
  return data;
};

/**
 * Update an existing subscription plan
 */
export const updatePlan = async (token: string, planId: string, planData: any) => {
  const response = await fetch(`${API_URL}/admin/dashboard/plans/${planId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(planData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update plan');
  return data;
};

/**
 * Delete a subscription plan
 */
export const deletePlan = async (token: string, planId: string) => {
  const response = await fetch(`${API_URL}/admin/dashboard/plans/${planId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete plan');
  return data;
};

/**
 * Get all clients
 * @param {string} token - JWT token
 * @returns {Promise<{clients: Array}>}
 */
export const getAllClients = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/dashboard/all-clients`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch clients');
  }

  return data;
};

/**
 * Get payments
 * @param {string} token - JWT token
 * @returns {Promise<{payments: Array}>}
 */
export const getPayments = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/dashboard/payments`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch payments');
  }
  return data;
};

/**
 * Get profit records
 * @param {string} token - JWT token
 * @returns {Promise<any>}
 */
export const getProfits = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/dashboard/profits`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch profits');
  }
  return data;
};

/**
 * Get monthly reports
 * @param {string} token - JWT token
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Promise<{reports: Array}>}
 */
export const getMonthlyReports = async (token: string, month?: number, year?: number) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());

  const response = await fetch(`${API_URL}/admin/dashboard/reports/monthly?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return await response.json();
};

/**
 * Get pending coaches
 * @param {string} token - JWT token
 * @returns {Promise<{pendingCoaches: Array}>}
 */
export const getPendingCoaches = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/stats/pending-coaches`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  
  if (data.status === 'success') {
    // Also fetch all coaches to filter manually if the specific stat endpoint only returns count
    const allCoachesResponse = await getAllCoaches(token);
    return {
       coaches: allCoachesResponse.coaches.filter((c: any) => c.status === 'pending')
    };
  }
  
  return { coaches: [] };
};

/**
 * Approve coach
 * @param {string} token - JWT token
 * @param {string} coachId - ID of the coach to approve
 * @returns {Promise<{status: string, message: string}>}
 */
export const approveCoach = async (token: string, coachId: string) => {
  const response = await fetch(`${API_URL}/admin/dashboard/subscription/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ coachId })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to approve coach');
  }

  return data;
};

// ============= COACH ENDPOINTS =============

/**
 * Get coach dashboard
 * @param {string} token - JWT token
 * @returns {Promise<{message: string}>}
 */
export const getCoachDashboard = async (token: string) => {
  const response = await fetch(`${API_URL}/coach/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return await response.json();
};

/**
 * Get coach's clients
 * @param {string} token - JWT token
 * @returns {Promise<{clients: Array}>}
 */
export const getCoachClients = async (token: string) => {
  const response = await fetch(`${API_URL}/coach/dashboard/clients`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch clients');
  }

  return data;
};

/**
 * Get subscribed clients (only clients with active subscriptions)
 * @param {string} token - JWT token
 * @returns {Promise<{clients: Array}>}
 */
export const getCoachSubscribedClients = async (token: string) => {
  const response = await fetch(`${API_URL}/coach/dashboard/subscribed-clients`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch subscribed clients');
  }

  return data;
};

/**
 * Add diet plan for client
 * @param {string} token - JWT token
 * @param {string} clientId - Client ID
 * @param {Object} dietPlan - Diet plan details
 * @returns {Promise<{dietId: string, message: string}>}
 */
export const addDietPlan = async (token: string, clientId: string, dietPlan: any) => {
  const response = await fetch(`${API_URL}/coach/dashboard/add-diet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ clientId, dietPlan })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add diet plan');
  }

  return data;
};

/**
 * Add training plan for client
 * @param {string} token - JWT token
 * @param {string} clientId - Client ID
 * @param {number} week - Week number
 * @param {Object} trainingPlan - Training plan details
 * @returns {Promise<{trainingId: string, message: string}>}
 */
export const addTrainingPlan = async (
  token: string,
  clientId: string,
  week: number,
  trainingPlan: any
) => {
  const response = await fetch(`${API_URL}/coach/dashboard/add-training`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ clientId, week, trainingPlan })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add training plan');
  }

  return data;
};

/**
 * Get client notes only (no progress tracking from coach view)
 * @param {string} token - JWT token
 * @param {string} clientId - Client ID
 * @returns {Promise<{client: Object}>}
 */
export const getClientProgress = async (token: string, clientId: string) => {
  const response = await fetch(`${API_URL}/coach/dashboard/clients/${clientId}/notes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch notes');
  }

  return data;
};

// ============= CLIENT ENDPOINTS =============

/**
 * Get client dashboard
 * @param {string} token - JWT token
 * @returns {Promise<{message: string}>}
 */
export const getClientDashboard = async (token: string) => {
  const response = await fetch(`${API_URL}/client/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return await response.json();
};

/**
 * Get client welcome page
 * @param {string} token - JWT token
 * @returns {Promise<{user: Object}>}
 */
export const getClientWelcome = async (token: string) => {
  const response = await fetch(`${API_URL}/client/welcome`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load welcome');
  }

  return data;
};

/**
 * Get available subscription plans
 * @returns {Promise<{plans: Array}>}
 */
export const getSubscriptionPlans = async () => {
  const response = await fetch(`${API_URL}/plans`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch plans');
  }

  return data;
};

/**
 * Select subscription plan
 * @param {string} token - JWT token
 * @param {string} planId - Plan ID
 * @param {string} method - Subscription method (gym, online, hybrid)
 * @returns {Promise<{plan: Object}>}
 */
export const selectPlan = async (token: string, planId: string, method: string) => {
  const response = await fetch(`${API_URL}/client/dashboard/subscription/select-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ planId, method })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to select plan');
  }

  return data;
};

/**
 * Make payment for subscription
 * @param {string} token - JWT token
 * @param {string} planId - Plan ID
 * @param {string} paymentMethod - Payment method
 * @param {Object} paymentDetails - Payment details
 * @returns {Promise<{paymentId: string, subscription: Object}>}
 */
export const makePayment = async (
  token: string,
  planId: string,
  paymentMethod: string,
  paymentDetails: any
) => {
  const response = await fetch(`${API_URL}/client/dashboard/subscription/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ planId, paymentMethod, paymentDetails })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Payment failed');
  }

  return data;
};

/**
 * Get client's weekly workouts
 * @param {string} token - JWT token
 * @returns {Promise<{workouts: Array}>}
 */
export const getWeeklyWorkouts = async (token: string) => {
  const response = await fetch(`${API_URL}/client/dashboard/workout-week`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return await response.json();
};

/**
 * Get all coaches for booking
 * @param {string} token - JWT token
 * @returns {Promise<{coaches: Array}>}
 */
export const getCoachesForBooking = async (token: string) => {
  const response = await fetch(`${API_URL}/client/dashboard/coaches`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch coaches');
  }
  return data;
};

/**
 * Get client progress
 * @param {string} token - JWT token
 * @returns {Promise<{progress: Object}>}
 */
export const getProgress = async (token: string) => {
  const response = await fetch(`${API_URL}/client/dashboard/progress`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return await response.json();
};

/**
 * Update client progress
 * @param {string} token - JWT token
 * @param {Object} metrics - Progress metrics
 * @returns {Promise<{progress: Object, metricsCount: number}>}
 */
export const updateProgress = async (
  token: string,
  metrics: {
    dietProgress?: string;
    workoutProgress?: string;
    notes?: string;
    weight?: string | number;
    bodyFat?: string | number;
    muscleMass?: string | number;
    chest?: string | number;
    waist?: string | number;
    biceps?: string | number;
  }
) => {
  const response = await fetch(`${API_URL}/client/dashboard/progress/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(metrics)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update progress');
  }

  return data;
};

// ============= HELPER FUNCTIONS =============

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Get stored JWT token
 * @returns {string | null}
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Get stored user data
 * @returns {Object | null}
 */
export const getUser = (): any => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Store authentication data
 * @param {string} token - JWT token
 * @param {Object} user - User object
 */
export const storeAuth = (token: string, user: any): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Clear authentication data
 */
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default {
  // Auth
  loginUser,
  registerUser,
  loginCheck,
  forgotPassword,
  resetPassword,

  // Admin
  getAdminDashboard,
  getAdminStats,
  getAdminPlans,
  createPlan,
  updatePlan,
  deletePlan,
  addCoach,
  addClient,
  getPayments,
  getMonthlyReports,

  // Coach
  getCoachDashboard,
  getCoachClients,
  getCoachSubscribedClients,
  addDietPlan,
  addTrainingPlan,
  getClientProgress,

  // Client
  getClientDashboard,
  getClientWelcome,
  getSubscriptionPlans,
  selectPlan,
  makePayment,
  getWeeklyWorkouts,
  getCoachesForBooking,
  getProgress,
  updateProgress,

  // Helpers
  isAuthenticated,
  getToken,
  getUser,
  storeAuth,
  clearAuth,
};

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const clientController = require('../controllers/clientController');
const { verifyBearerToken, checkRole } = require('../middleware/auth');

// 0 - Load frontend
router.get('/start', authController.loadFrontend);

// 1 - Login check (check if account exists)
router.post('/auth/login', authController.loginCheck);

// 2 - Forgot password
router.post('/auth/forgetpassword', authController.forgotPassword);

// 2b - Reset password
router.post('/auth/resetpassword', authController.resetPassword);

// 3 - Sign in client
router.post('/auth/signin', authController.signIn);

// 4 - Register client
router.post('/auth/register', authController.register);

// 4b - Get dashboard
router.get('/dashboard', verifyBearerToken, checkRole('client'), clientController.getDashboard);

// 5 - Welcome page
router.get('/welcome', verifyBearerToken, checkRole('client'), clientController.welcomePage);

// 6 - Book workout
router.post('/dashboard/book-workout', verifyBearerToken, checkRole('client'), clientController.bookWorkout);

// 7 - Select subscription plan
router.post('/dashboard/subscription/select-plan', verifyBearerToken, checkRole('client'), clientController.selectPlan);

// 8 - Make payment
router.post('/dashboard/subscription/payment', verifyBearerToken, checkRole('client'), clientController.makePayment);

// 9 - Renew/change subscription
router.post('/dashboard/subscription/renew-or-change', verifyBearerToken, checkRole('client'), clientController.renewSubscription);

// 10 - Get weekly workouts
router.get('/dashboard/workout-week', verifyBearerToken, checkRole('client'), clientController.getWeeklyWorkouts);

// 11 - Get progress
router.get('/dashboard/progress', verifyBearerToken, checkRole('client'), clientController.getProgress);

// 11b - Update progress
router.post('/dashboard/progress/update', verifyBearerToken, checkRole('client'), clientController.updateProgress);

// 12 - Logout
router.post('/exit', verifyBearerToken, checkRole('client'), clientController.logout);

module.exports = router;

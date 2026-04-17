const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const coachController = require('../controllers/coachController');
const { verifyBearerToken, checkRole } = require('../middleware/auth');

// 0 - Load frontend
router.get('/start', authController.loadFrontend);

// 2 - Sign in coach
router.post('/auth/signin', authController.signIn);

// 3 - Login check
router.post('/auth/login', authController.loginCheck);

// 4 - Forgot password
router.post('/auth/forgetpassword', authController.forgotPassword);

// 4b - Reset password
router.post('/auth/resetpassword', authController.resetPassword);

// 4c - Get dashboard
router.get('/dashboard', verifyBearerToken, checkRole('coach'), coachController.getDashboard);

// 5 - Add diet for client
router.post('/dashboard/add-diet', verifyBearerToken, checkRole('coach'), coachController.addDiet);

// 6 - List clients
router.get('/dashboard/clients', verifyBearerToken, checkRole('coach'), coachController.getClients);

// 6a - List subscribed clients (for creating training plans)
router.get('/dashboard/subscribed-clients', verifyBearerToken, checkRole('coach'), coachController.getSubscribedClients);

// 6b - Add note for client
router.post('/dashboard/clients/:id/add-note', verifyBearerToken, checkRole('coach'), coachController.addClientNote);

// 7 - Add training plan
router.post('/dashboard/add-training', verifyBearerToken, checkRole('coach'), coachController.addTrainingPlan);

// 8 - Get client notes
router.get('/dashboard/clients/:id/notes', verifyBearerToken, checkRole('coach'), coachController.getClientNotes);

// 9 - Logout
router.post('/exit', verifyBearerToken, checkRole('coach'), coachController.logout);

module.exports = router;

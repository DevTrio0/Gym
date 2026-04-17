const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const { verifyBearerToken, checkRole } = require('../middleware/auth');

// 0 - Load frontend
router.get('/start', authController.loadFrontend);

// 1 - Admin login
router.post('/auth/login', authController.signIn);

// 2 - Forgot password
router.post('/auth/forgetpassword', authController.forgotPassword);

// 2b - Reset password
router.post('/auth/resetpassword', authController.resetPassword);

// 3 - Register admin (admin only)
router.post('/auth/register', verifyBearerToken, checkRole('admin'), authController.register);

// 4 - Get dashboard (icons only)
router.get('/dashboard', verifyBearerToken, checkRole('admin'), adminController.getDashboard);

// 4a - Get individual stats (called when icon clicked)
router.get('/stats/users', verifyBearerToken, checkRole('admin'), adminController.getTotalUsers);
router.get('/stats/coaches', verifyBearerToken, checkRole('admin'), adminController.getTotalCoaches);
router.get('/stats/clients', verifyBearerToken, checkRole('admin'), adminController.getTotalClients);
router.get('/stats/payments', verifyBearerToken, checkRole('admin'), adminController.getTotalPayments);
router.get('/stats/active-coaches', verifyBearerToken, checkRole('admin'), adminController.getActiveCoaches);
router.get('/stats/pending-coaches', verifyBearerToken, checkRole('admin'), adminController.getPendingCoaches);
router.get('/stats/active-clients', verifyBearerToken, checkRole('admin'), adminController.getActiveClients);

// 5 - Add coach
router.post('/dashboard/add-coach', verifyBearerToken, checkRole('admin'), adminController.addCoach);

// 5b - Add client
router.post('/dashboard/add-client', verifyBearerToken, checkRole('admin'), adminController.addClient);

// 5c - Delete account
router.delete('/dashboard/delete-account', verifyBearerToken, checkRole('admin'), adminController.deleteAccount);

// 5d - Deactivate account
router.put('/dashboard/deactivate-account', verifyBearerToken, checkRole('admin'), adminController.deactivateAccount);

// 5e - Reactivate account
router.put('/dashboard/reactivate-account', verifyBearerToken, checkRole('admin'), adminController.reactivateAccount);

// 6 - Monthly reports
router.get('/dashboard/reports/monthly', verifyBearerToken, checkRole('admin'), adminController.getMonthlyReports);

// 8 - Get payments
router.get('/dashboard/payments', verifyBearerToken, checkRole('admin'), adminController.getPayments);

// 8a - Get profit detail report  
router.get('/dashboard/profits/detail', verifyBearerToken, checkRole('admin'), adminController.getProfitDetailReport);

// 8b - Get profits (main)
router.get('/dashboard/profits', verifyBearerToken, checkRole('admin'), adminController.getProfits);

// 9 - Approve coach subscription
router.put('/dashboard/subscription/approve', verifyBearerToken, checkRole('admin'), adminController.approveCoachSubscription);

// 11 - Logout
router.post('/exit', verifyBearerToken, checkRole('admin'), adminController.logout);

// ===== COACH SALARY ROUTES (Admin Only) =====

// 12 - Set coach salary
router.post('/dashboard/salary/set', verifyBearerToken, checkRole('admin'), adminController.setCoachSalary);

// 13 - Get all coach salaries
router.get('/dashboard/salary/all', verifyBearerToken, checkRole('admin'), adminController.getAllCoachSalaries);

// 14 - Get single coach salary
router.get('/dashboard/salary/:coachId', verifyBearerToken, checkRole('admin'), adminController.getCoachSalaryById);

// 15 - Pay coach salary
router.post('/dashboard/salary/pay', verifyBearerToken, checkRole('admin'), adminController.payCoachSalary);

// 16 - Get coach payment history
router.get('/dashboard/salary/history/:coachId', verifyBearerToken, checkRole('admin'), adminController.getCoachPaymentHistory);

// 17 - Get all salary payments
router.get('/dashboard/salary-payments/all', verifyBearerToken, checkRole('admin'), adminController.getAllSalaryPayments);

// 18 - Generate salary report
router.get('/dashboard/salary/report', verifyBearerToken, checkRole('admin'), adminController.generateSalaryReport);

module.exports = router;

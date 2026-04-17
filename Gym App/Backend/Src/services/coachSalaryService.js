const { Coach, CoachSalary, SalaryPayment } = require('../../db/mongoModels');

/**
 * Set coach salary
 */
const setCoachSalary = async (coachId, amount, description = '') => {
  const coach = await Coach.findById(coachId);
  if (!coach) {
    throw new Error('Coach not found');
  }

  if (amount < 0) {
    throw new Error('Salary amount cannot be negative');
  }

  // Update or create salary record
  const salary = await CoachSalary.findOneAndUpdate(
    { coachId },
    { amount, description, updatedAt: new Date() },
    { new: true, upsert: true }
  );

  // Update coach object with salary info
  await Coach.findByIdAndUpdate(coachId, { 
    salary: amount,
    salaryUpdatedAt: new Date()
  });

  return {
    status: 'success',
    message: 'Salary set successfully',
    salary: {
      coachId,
      coachName: coach.name,
      amount,
      description,
      setAt: new Date()
    }
  };
};

/**
 * Get coach salary
 */
const getCoachSalary = async (coachId) => {
  const salary = await CoachSalary.findOne({ coachId });
  return salary || null;
};

/**
 * Get all coach salaries
 */
const getAllCoachSalaries = async () => {
  const salaries = await CoachSalary.find().populate('coachId');
  
  const salaryData = salaries.map(s => ({
    _id: s._id,
    coachId: s.coachId?._id,
    coachName: s.coachId?.name || 'N/A',
    coachEmail: s.coachId?.email || 'N/A',
    amount: s.amount,
    description: s.description,
    updatedAt: s.updatedAt
  }));

  const totalSalaries = salaryData.reduce((sum, s) => sum + (s.amount || 0), 0);

  return {
    status: 'success',
    message: 'Coach salaries retrieved',
    data: {
      salaries: salaryData,
      totalMonthlyPayout: totalSalaries,
      coachCount: salaryData.length,
      averageSalary: salaryData.length > 0 ? (totalSalaries / salaryData.length).toFixed(2) : 0
    }
  };
};

/**
 * Pay coach salary (record payment)
 */
const payCoachSalary = async (coachId, amount, notes = '') => {
  const coach = await Coach.findById(coachId);
  if (!coach) {
    throw new Error('Coach not found');
  }

  const salaryRecord = await getCoachSalary(coachId);
  if (!salaryRecord) {
    throw new Error('No salary record found for this coach');
  }

  if (amount <= 0) {
    throw new Error('Payment amount must be greater than zero');
  }

  // Create payment record
  const payment = await SalaryPayment.create({
    coachId,
    salaryId: salaryRecord._id,
    amount,
    notes,
    status: 'completed',
    paidAt: new Date()
  });

  return {
    status: 'success',
    message: `Salary paid successfully to ${coach.name}`,
    payment: {
      paymentId: payment._id,
      coachId,
      coachName: coach.name,
      amount,
      paidAt: payment.paidAt,
      notes
    }
  };
};

/**
 * Get salary payment history for a coach
 */
const getCoachPaymentHistory = async (coachId, limit = 12) => {
  const coach = await Coach.findById(coachId);
  if (!coach) {
    throw new Error('Coach not found');
  }

  const payments = await SalaryPayment.find({ coachId })
    .sort({ paidAt: -1 })
    .limit(limit);

  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return {
    status: 'success',
    message: 'Payment history retrieved',
    data: {
      coachId,
      coachName: coach.name,
      coachEmail: coach.email,
      payments,
      totalPaid,
      paymentCount: payments.length,
      averagePayment: payments.length > 0 ? (totalPaid / payments.length).toFixed(2) : 0
    }
  };
};

/**
 * Get all salary payment transactions
 */
const getAllSalaryPayments = async (limit = null) => {
  let query = SalaryPayment.find().sort({ paidAt: -1 }).populate('coachId');
  
  if (limit) {
    query = query.limit(limit);
  }

  const payments = await query;

  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return {
    status: 'success',
    message: 'All salary payments retrieved',
    data: {
      payments: payments.map(p => ({
        _id: p._id,
        coachId: p.coachId?._id,
        coachName: p.coachId?.name,
        coachEmail: p.coachId?.email,
        amount: p.amount,
        notes: p.notes,
        status: p.status,
        paidAt: p.paidAt
      })),
      totalPaid,
      paymentCount: payments.length,
      uniqueCoaches: [...new Set(payments.map(p => p.coachId?._id.toString()))].length
    }
  };
};

/**
 * Generate salary report
 */
const generateSalaryReport = async () => {
  const salariesResult = await getAllCoachSalaries();
  const paymentsResult = await getAllSalaryPayments();

  const activeCoaches = await Coach.countDocuments({ status: 'active' });
  const pendingCoaches = await Coach.countDocuments({ status: 'pending' });

  return {
    status: 'success',
    message: 'Salary report generated',
    report: {
      salaryStructure: salariesResult.data,
      paymentHistory: paymentsResult.data,
      summary: {
        totalMonthlyBudget: salariesResult.data.totalMonthlyPayout,
        totalPaidOut: paymentsResult.data.totalPaid,
        activeCoaches,
        pendingCoaches,
        generatedAt: new Date()
      }
    }
  };
};

module.exports = {
  setCoachSalary,
  getCoachSalary,
  getAllCoachSalaries,
  payCoachSalary,
  getCoachPaymentHistory,
  getAllSalaryPayments,
  generateSalaryReport
};

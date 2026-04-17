const { mockDatabase, findCoachById, getNextId } = require('../models/database');

/**
 * Initialize salary database structure if it doesn't exist
 */
const initializeSalaryDatabase = () => {
  if (!mockDatabase.coachSalaries) {
    mockDatabase.coachSalaries = [];
  }
  if (!mockDatabase.salaryPayments) {
    mockDatabase.salaryPayments = [];
  }
};

/**
 * Set coach salary
 */
const setCoachSalary = (coachId, amount, description = '') => {
  initializeSalaryDatabase();
  
  const coach = findCoachById(coachId);
  if (!coach) {
    throw new Error('Coach not found');
  }

  if (amount < 0) {
    throw new Error('Salary amount cannot be negative');
  }

  // Update or create salary record
  const existingSalary = mockDatabase.coachSalaries.find(s => s.coachId === coachId);
  
  if (existingSalary) {
    existingSalary.amount = amount;
    existingSalary.description = description;
    existingSalary.updatedAt = new Date();
  } else {
    mockDatabase.coachSalaries.push({
      id: getNextId('salary'),
      coachId,
      coachName: coach.name,
      amount,
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Update coach object with salary info
  coach.salary = amount;
  coach.salaryUpdatedAt = new Date();

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
const getCoachSalary = (coachId) => {
  const salary = mockDatabase.coachSalaries?.find(s => s.coachId === coachId);
  return salary || null;
};

/**
 * Get all coach salaries
 */
const getAllCoachSalaries = () => {
  initializeSalaryDatabase();
  
  const salaries = mockDatabase.coachSalaries.map(salary => {
    const coach = findCoachById(salary.coachId);
    return {
      ...salary,
      coachEmail: coach?.email || 'N/A',
      coachStatus: coach?.status || 'N/A'
    };
  });

  const totalSalaries = salaries.reduce((sum, s) => sum + s.amount, 0);

  return {
    status: 'success',
    message: 'Coach salaries retrieved',
    data: {
      salaries,
      totalMonthlyPayout: totalSalaries,
      coachCount: salaries.length,
      averageSalary: salaries.length > 0 ? (totalSalaries / salaries.length).toFixed(2) : 0
    }
  };
};

/**
 * Pay coach salary (record payment)
 */
const payCoachSalary = (coachId, amount, notes = '') => {
  initializeSalaryDatabase();

  const coach = findCoachById(coachId);
  if (!coach) {
    throw new Error('Coach not found');
  }

  const salaryRecord = getCoachSalary(coachId);
  if (!salaryRecord) {
    throw new Error('No salary record found for this coach');
  }

  if (amount <= 0) {
    throw new Error('Payment amount must be greater than zero');
  }

  // Create payment record
  const payment = {
    id: getNextId('salary_payment'),
    coachId,
    coachName: coach.name,
    coachEmail: coach.email,
    salaryId: salaryRecord.id,
    amount,
    notes,
    status: 'completed',
    paidAt: new Date()
  };

  mockDatabase.salaryPayments.push(payment);

  return {
    status: 'success',
    message: `Salary paid successfully to ${coach.name}`,
    payment: {
      paymentId: payment.id,
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
const getCoachPaymentHistory = (coachId, limit = 12) => {
  initializeSalaryDatabase();

  const coach = findCoachById(coachId);
  if (!coach) {
    throw new Error('Coach not found');
  }

  const payments = mockDatabase.salaryPayments
    .filter(p => p.coachId === coachId)
    .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))
    .slice(0, limit);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

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
const getAllSalaryPayments = (limit = null) => {
  initializeSalaryDatabase();

  let payments = mockDatabase.salaryPayments
    .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

  if (limit) {
    payments = payments.slice(0, limit);
  }

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return {
    status: 'success',
    message: 'All salary payments retrieved',
    data: {
      payments,
      totalPaid,
      paymentCount: payments.length,
      uniqueCoaches: [...new Set(payments.map(p => p.coachId))].length
    }
  };
};

/**
 * Generate salary report
 */
const generateSalaryReport = () => {
  initializeSalaryDatabase();

  const salaries = getAllCoachSalaries().data;
  const payments = getAllSalaryPayments().data;

  return {
    status: 'success',
    message: 'Salary report generated',
    report: {
      salaryStructure: salaries,
      paymentHistory: payments,
      summary: {
        totalMonthlyBudget: salaries.totalMonthlyPayout,
        totalPaidOut: payments.totalPaid,
        activeCoaches: mockDatabase.coaches.filter(c => c.status === 'active').length,
        pendingCoaches: mockDatabase.coaches.filter(c => c.status === 'pending').length,
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

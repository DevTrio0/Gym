const { mockDatabase } = require('../models/database');

/**
 * Calculate total revenue from payments
 */
const calculateTotalRevenue = () => {
  return mockDatabase.payments.reduce((sum, payment) => {
    if (payment.status === 'completed') {
      return sum + payment.amount;
    }
    return sum;
  }, 0);
};

/**
 * Calculate tax on revenue (default 20%)
 */
const calculateTax = (revenue, taxPercentage = 20) => {
  return (revenue * taxPercentage) / 100;
};

/**
 * Calculate total coach salaries to be paid
 */
const calculateTotalCoachSalaries = () => {
  return mockDatabase.coaches.reduce((sum, coach) => {
    return sum + (coach.salary || 0);
  }, 0);
};

/**
 * Calculate profit after taxes (Revenue - Taxes - Coach Salaries)
 */
const calculateProfitAfterTaxes = (taxPercentage = 20) => {
  const totalRevenue = calculateTotalRevenue();
  const totalTax = calculateTax(totalRevenue, taxPercentage);
  const totalCoachSalaries = calculateTotalCoachSalaries();

  const profitAfterTaxes = totalRevenue - totalTax - totalCoachSalaries;

  return {
    totalRevenue,
    totalTax,
    taxPercentage,
    totalCoachSalaries,
    profitAfterTaxes,
    profitMargin: totalRevenue > 0 ? ((profitAfterTaxes / totalRevenue) * 100).toFixed(2) : 0,
    breakdown: {
      revenue: totalRevenue,
      taxes: totalTax,
      coachSalaries: totalCoachSalaries,
      netProfit: profitAfterTaxes
    }
  };
};

/**
 * Get revenue by time period
 */
const getRevenueByPeriod = (startDate, endDate) => {
  return mockDatabase.payments.reduce((sum, payment) => {
    const paymentDate = new Date(payment.date);
    if (paymentDate >= startDate && paymentDate <= endDate && payment.status === 'completed') {
      return sum + payment.amount;
    }
    return sum;
  }, 0);
};

/**
 * Get profit report with detailed breakdown
 */
const getProfitReport = (taxPercentage = 20) => {
  const profit = calculateProfitAfterTaxes(taxPercentage);
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const monthlyRevenue = getRevenueByPeriod(lastMonth, new Date());
  const monthlyTax = calculateTax(monthlyRevenue, taxPercentage);

  return {
    status: 'success',
    message: 'Profit report generated',
    report: {
      overall: profit,
      monthly: {
        revenue: monthlyRevenue,
        tax: monthlyTax,
        taxPercentage,
        profit: monthlyRevenue - monthlyTax - calculateTotalCoachSalaries()
      },
      timestamp: new Date()
    }
  };
};

module.exports = {
  calculateTotalRevenue,
  calculateTax,
  calculateTotalCoachSalaries,
  calculateProfitAfterTaxes,
  getRevenueByPeriod,
  getProfitReport
};

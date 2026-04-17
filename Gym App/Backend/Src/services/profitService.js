const { Payment, Coach, User } = require('../../db/mongoModels');

/**
 * Calculate total revenue from payments
 */
const calculateTotalRevenue = async () => {
  const completedPayments = await Payment.find({ status: 'completed' });
  return completedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
};

/**
 * Calculate tax on revenue (default 20%)
 */
const calculateTax = (revenue, taxPercentage = 20) => {
  return (revenue * taxPercentage) / 100;
};

/**
 * Calculate total coach salaries
 */
const calculateTotalCoachSalaries = async () => {
  const coaches = await Coach.find({ status: 'active' });
  return coaches.reduce((sum, coach) => sum + (coach.salary || 0), 0);
};

/**
 * Calculate profit after taxes (Revenue - Taxes - Coach Salaries)
 */
const calculateProfitAfterTaxes = async (taxPercentage = 20) => {
  const totalRevenue = await calculateTotalRevenue();
  const totalTax = calculateTax(totalRevenue, taxPercentage);
  const totalCoachSalaries = await calculateTotalCoachSalaries();

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
const getRevenueByPeriod = async (startDate, endDate) => {
  const payments = await Payment.find({
    status: 'completed',
    createdAt: { $gte: startDate, $lte: endDate }
  });
  return payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
};

/**
 * Get monthly breakdown with revenue, expenses, and profit
 */
const getMonthlyBreakdown = async (taxPercentage = 20) => {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - i);
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    
    const monthName = monthStart.toLocaleString('default', { month: 'long' });
    const revenue = await getRevenueByPeriod(monthStart, monthEnd);
    const tax = calculateTax(revenue, taxPercentage);
    const salaries = await calculateTotalCoachSalaries();
    const profit = revenue - tax - salaries;
    
    months.push({
      month: monthName,
      revenue: Math.round(revenue),
      expenses: Math.round(tax + salaries),
      profit: Math.round(profit)
    });
  }
  return months;
};

/**
 * Get profit report with detailed breakdown
 */
const getProfitReport = async (taxPercentage = 20) => {
  const totalRevenue = await calculateTotalRevenue();
  const totalTax = calculateTax(totalRevenue, taxPercentage);
  const totalCoachSalaries = await calculateTotalCoachSalaries();
  const totalExpenses = totalTax + totalCoachSalaries;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;
  
  // Calculate average transaction value
  const allPayments = await Payment.find({ status: 'completed' });
  const averageTransactionValue = allPayments.length > 0 
    ? Math.round(totalRevenue / allPayments.length)
    : 0;
  
  // Get monthly breakdown
  const monthlyBreakdown = await getMonthlyBreakdown(taxPercentage);
  
  // Find top earning month
  const topMonth = monthlyBreakdown.reduce((max, month) => 
    month.revenue > max.revenue ? month : max
  );
  
  // Year to date profit (sum of monthly profits)
  const yearToDateProfit = monthlyBreakdown.reduce((sum, month) => sum + month.profit, 0);

  return {
    totalRevenue: Math.round(totalRevenue),
    totalExpenses: Math.round(totalExpenses),
    netProfit: Math.round(netProfit),
    profitMargin: parseFloat(profitMargin),
    averageTransactionValue,
    topEarningMonth: topMonth.month,
    topEarningAmount: topMonth.revenue,
    yearToDateProfit: Math.round(yearToDateProfit),
    monthlyBreakdown
  };
};

module.exports = {
  calculateTotalRevenue,
  calculateTax,
  calculateTotalCoachSalaries,
  calculateProfitAfterTaxes,
  getRevenueByPeriod,
  getMonthlyBreakdown,
  getProfitReport
};

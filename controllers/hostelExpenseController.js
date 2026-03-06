const HostelExpense = require('../models/HostelExpense');

exports.addExpense = async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;
    
    const expense = await HostelExpense.create({
      category,
      amount,
      description,
      date,
      addedBy: req.user.id
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let filter = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const expenses = await HostelExpense.find(filter)
      .populate('addedBy', 'name')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExpenseAnalytics = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    const expenses = await HostelExpense.find({
      date: { $gte: startDate, $lte: endDate }
    });

    // Total monthly expense
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    expenses.forEach(e => {
      categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
    });

    // Last 6 months trend
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(currentYear, currentMonth - i, 1);
      const monthEnd = new Date(currentYear, currentMonth - i + 1, 0);
      
      const monthExpenses = await HostelExpense.find({
        date: { $gte: monthStart, $lte: monthEnd }
      });
      
      const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      monthlyTrend.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        total: monthTotal
      });
    }

    res.json({
      totalExpense,
      categoryBreakdown,
      monthlyTrend,
      expenseCount: expenses.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

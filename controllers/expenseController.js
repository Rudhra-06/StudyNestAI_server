const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;
    const expense = await Expense.create({
      userId: req.user.id,
      category,
      amount,
      description,
      date
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.json({ expenses, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

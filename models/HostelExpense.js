const mongoose = require('mongoose');

const hostelExpenseSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['maintenance', 'electricity', 'water', 'internet', 'food', 'other'],
    required: true 
  },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('HostelExpense', hostelExpenseSchema);

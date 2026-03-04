const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['hostel', 'food', 'faculty', 'infrastructure', 'other'],
    required: true 
  },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  isAnonymous: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);

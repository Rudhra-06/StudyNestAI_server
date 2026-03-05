const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: { type: Date, required: true },
  schedule: [{
    day: String,
    slots: [{
      subject: String,
      startTime: String,
      endTime: String,
      priority: { type: String, enum: ['high', 'medium', 'low'] }
    }]
  }],
  workload: Number
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);

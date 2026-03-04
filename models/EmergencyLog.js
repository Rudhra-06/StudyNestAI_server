const mongoose = require('mongoose');

const emergencyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: String,
  message: String,
  status: { 
    type: String, 
    enum: ['active', 'acknowledged', 'resolved'],
    default: 'active' 
  },
  acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('EmergencyLog', emergencyLogSchema);

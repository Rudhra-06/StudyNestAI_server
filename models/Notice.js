const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: [{ type: String, enum: ['student', 'faculty', 'admin', 'warden', 'all'] }],
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  expiresAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);

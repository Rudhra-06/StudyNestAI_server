const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Late Entry'],
    required: true 
  },
  entryTime: Date,
  exitTime: Date,
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

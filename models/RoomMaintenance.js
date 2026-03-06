const mongoose = require('mongoose');

const roomMaintenanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostelBlock: { type: String, required: true },
  roomNumber: { type: String, required: true },
  cleanlinessScore: { type: Number, min: 1, max: 10, required: true },
  organizationScore: { type: Number, min: 1, max: 10, required: true },
  hygieneScore: { type: Number, min: 1, max: 10, required: true },
  overallScore: { type: Number },
  remarks: String,
  inspectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inspectionDate: { type: Date, default: Date.now },
  images: [String]
}, { timestamps: true });

roomMaintenanceSchema.pre('save', function(next) {
  this.overallScore = ((this.cleanlinessScore + this.organizationScore + this.hygieneScore) / 3).toFixed(1);
  next();
});

module.exports = mongoose.model('RoomMaintenance', roomMaintenanceSchema);

const EmergencyLog = require('../models/EmergencyLog');

exports.triggerEmergency = async (req, res) => {
  try {
    const { location, message } = req.body;
    const emergency = await EmergencyLog.create({
      userId: req.user.id,
      location,
      message
    });

    const io = req.app.get('io');
    io.emit('emergency-alert', {
      id: emergency._id,
      userId: req.user.id,
      location,
      message,
      timestamp: emergency.createdAt
    });

    res.status(201).json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmergencies = async (req, res) => {
  try {
    const emergencies = await EmergencyLog.find().populate('userId', 'name email hostelBlock roomNumber').sort({ createdAt: -1 });
    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acknowledgeEmergency = async (req, res) => {
  try {
    const { id } = req.params;
    const emergency = await EmergencyLog.findById(id);
    
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    emergency.status = 'acknowledged';
    emergency.acknowledgedBy = req.user.id;
    await emergency.save();

    res.json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

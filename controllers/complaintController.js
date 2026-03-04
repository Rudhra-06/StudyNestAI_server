const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
  try {
    const { category, description, priority } = req.body;
    const complaint = await Complaint.create({
      userId: req.user.id,
      category,
      description,
      priority
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const filter = req.user.role === 'student' ? { userId: req.user.id } : {};
    const complaints = await Complaint.find(filter).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    if (status === 'resolved') {
      complaint.resolvedBy = req.user.id;
      complaint.resolvedAt = new Date();
    }
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

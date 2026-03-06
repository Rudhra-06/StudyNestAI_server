const Complaint = require('../models/Complaint');
const EmergencyLog = require('../models/EmergencyLog');
const User = require('../models/User');
const RoomMaintenance = require('../models/RoomMaintenance');

exports.getComplaintAnalytics = async (req, res) => {
  try {
    const complaints = await Complaint.find();

    // Count by status
    const statusCounts = {
      pending: complaints.filter(c => c.status === 'pending').length,
      inProgress: complaints.filter(c => c.status === 'in-progress').length,
      resolved: complaints.filter(c => c.status === 'resolved').length,
      rejected: complaints.filter(c => c.status === 'rejected').length
    };

    // Count by category
    const categoryCounts = {};
    complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    // Recent complaints (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const recentComplaints = complaints.filter(c => new Date(c.createdAt) >= last7Days).length;

    // Average resolution time
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved' && c.resolvedAt);
    let avgResolutionTime = 0;
    if (resolvedComplaints.length > 0) {
      const totalTime = resolvedComplaints.reduce((sum, c) => {
        return sum + (new Date(c.resolvedAt) - new Date(c.createdAt));
      }, 0);
      avgResolutionTime = Math.floor(totalTime / resolvedComplaints.length / (1000 * 60 * 60)); // in hours
    }

    res.json({
      total: complaints.length,
      statusCounts,
      categoryCounts,
      recentComplaints,
      avgResolutionTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHostelStats = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });

    // Count by hostel block
    const blockCounts = {};
    students.forEach(s => {
      if (s.hostelBlock) {
        blockCounts[s.hostelBlock] = (blockCounts[s.hostelBlock] || 0) + 1;
      }
    });

    // Emergency logs
    const emergencies = await EmergencyLog.find();
    const activeEmergencies = emergencies.filter(e => e.status === 'active').length;

    // Complaints
    const complaints = await Complaint.find();
    const pendingComplaints = complaints.filter(c => c.status === 'pending').length;

    res.json({
      totalStudents: students.length,
      blockCounts,
      activeEmergencies,
      pendingComplaints,
      totalComplaints: complaints.length,
      totalEmergencies: emergencies.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentsByBlock = async (req, res) => {
  try {
    const { block } = req.params;
    const students = await User.find({ 
      role: 'student', 
      hostelBlock: block 
    }).select('name email roomNumber department year');

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addRoomInspection = async (req, res) => {
  try {
    const { studentId, cleanlinessScore, organizationScore, hygieneScore, remarks } = req.body;
    
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const inspection = await RoomMaintenance.create({
      studentId,
      hostelBlock: student.hostelBlock,
      roomNumber: student.roomNumber,
      cleanlinessScore,
      organizationScore,
      hygieneScore,
      remarks,
      inspectedBy: req.user.id
    });

    res.status(201).json(inspection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoomInspections = async (req, res) => {
  try {
    const { block } = req.query;
    
    const filter = block ? { hostelBlock: block } : {};
    
    const inspections = await RoomMaintenance.find(filter)
      .populate('studentId', 'name email')
      .populate('inspectedBy', 'name')
      .sort({ inspectionDate: -1 })
      .limit(50);

    res.json(inspections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentRoomHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const inspections = await RoomMaintenance.find({ studentId })
      .populate('inspectedBy', 'name')
      .sort({ inspectionDate: -1 });

    res.json(inspections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

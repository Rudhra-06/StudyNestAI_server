const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, status, entryTime, exitTime } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already marked
    const existing = await Attendance.findOne({
      studentId,
      date: { $gte: today }
    });

    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    const attendance = await Attendance.create({
      studentId,
      date: new Date(),
      status,
      entryTime,
      exitTime,
      markedBy: req.user.id
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      date: { $gte: today }
    }).populate('studentId', 'name email hostelBlock roomNumber');

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      date: { $gte: today }
    });

    const totalStudents = await User.countDocuments({ role: 'student' });
    const present = attendance.filter(a => a.status === 'Present').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;
    const lateEntry = attendance.filter(a => a.status === 'Late Entry').length;
    const notMarked = totalStudents - attendance.length;

    res.json({
      totalStudents,
      present,
      absent,
      lateEntry,
      notMarked,
      attendancePercentage: ((present / totalStudents) * 100).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

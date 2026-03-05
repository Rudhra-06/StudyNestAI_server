const Timetable = require('../models/Timetable');

exports.generateTimetable = async (req, res) => {
  try {
    const { academicSchedule } = req.body;
    
    // Parse academic schedule and generate study timetable
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    
    const schedule = generateWeeklySchedule(academicSchedule);
    
    const timetable = await Timetable.create({
      userId: req.user.id,
      weekStart,
      schedule,
      workload: calculateWorkload(schedule)
    });
    
    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(timetable || { schedule: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function generateWeeklySchedule(academicSchedule) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const schedule = [];
  
  days.forEach(day => {
    const daySchedule = {
      day,
      slots: []
    };
    
    // Morning study slot (6:00 AM - 8:00 AM)
    if (day !== 'Sunday') {
      daySchedule.slots.push({
        subject: 'Morning Revision',
        startTime: '06:00',
        endTime: '08:00',
        priority: 'medium'
      });
    }
    
    // Add academic classes from uploaded schedule
    if (academicSchedule && academicSchedule[day]) {
      academicSchedule[day].forEach(slot => {
        daySchedule.slots.push(slot);
      });
    }
    
    // Evening study slot (7:00 PM - 9:00 PM)
    if (day !== 'Sunday') {
      daySchedule.slots.push({
        subject: 'Self Study',
        startTime: '19:00',
        endTime: '21:00',
        priority: 'high'
      });
    }
    
    // Weekend intensive study
    if (day === 'Saturday' || day === 'Sunday') {
      daySchedule.slots.push({
        subject: 'Weekly Revision',
        startTime: '10:00',
        endTime: '13:00',
        priority: 'high'
      });
    }
    
    schedule.push(daySchedule);
  });
  
  return schedule;
}

function calculateWorkload(schedule) {
  let totalHours = 0;
  schedule.forEach(day => {
    day.slots.forEach(slot => {
      const start = parseInt(slot.startTime.split(':')[0]);
      const end = parseInt(slot.endTime.split(':')[0]);
      totalHours += (end - start);
    });
  });
  return totalHours;
}

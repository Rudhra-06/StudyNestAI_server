const StudySession = require('../models/StudySession');

exports.getDailyProgress = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const sessions = await StudySession.find({
      userId: req.user.id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    // Group by date
    const dailyData = {};
    
    for (let i = parseInt(days) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        totalMinutes: 0,
        sessions: 0,
        subjects: []
      };
    }

    sessions.forEach(session => {
      const dateStr = new Date(session.createdAt).toISOString().split('T')[0];
      if (dailyData[dateStr]) {
        dailyData[dateStr].totalMinutes += session.duration || 0;
        dailyData[dateStr].sessions += 1;
        if (!dailyData[dateStr].subjects.includes(session.subject)) {
          dailyData[dateStr].subjects.push(session.subject);
        }
      }
    });

    const progressArray = Object.values(dailyData).map(day => ({
      ...day,
      totalHours: (day.totalMinutes / 60).toFixed(2)
    }));

    res.json(progressArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodayProgress = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessions = await StudySession.find({
      userId: req.user.id,
      createdAt: { $gte: today }
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(2);

    res.json({
      totalMinutes,
      totalHours,
      sessions: sessions.length,
      subjects: [...new Set(sessions.map(s => s.subject))]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const StudySession = require('../models/StudySession');

exports.getUserProductivity = async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.user.id });

    // Calculate total study hours
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalStudyHours = (totalMinutes / 60).toFixed(2);

    // Calculate streak
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const sortedSessions = sessions.sort((a, b) => b.createdAt - a.createdAt);
    
    for (let session of sortedSessions) {
      const sessionDate = new Date(session.createdAt);
      sessionDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate weekly study hours
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const weeklySessions = sessions.filter(s => new Date(s.createdAt) >= last7Days);
    const weeklyMinutes = weeklySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const weeklyStudyHours = (weeklyMinutes / 60).toFixed(2);

    // Calculate weekly consistency (days studied in last 7 days)
    const uniqueDays = new Set(
      weeklySessions.map(s => new Date(s.createdAt).toDateString())
    ).size;
    const weeklyConsistency = (uniqueDays / 7) * 100;

    // Calculate productivity score
    const productivityScore = (
      (parseFloat(totalStudyHours) * 0.4) +
      (streak * 0.3) +
      (weeklyConsistency * 0.3)
    ).toFixed(2);

    res.json({
      totalStudyHours: parseFloat(totalStudyHours),
      weeklyStudyHours: parseFloat(weeklyStudyHours),
      streak,
      weeklyConsistency: weeklyConsistency.toFixed(2),
      productivityScore: parseFloat(productivityScore),
      totalSessions: sessions.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWeeklyStats = async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const sessions = await StudySession.find({
      userId: req.user.id,
      createdAt: { $gte: last7Days }
    });

    // Group by day
    const dailyStats = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      dailyStats[dayName] = 0;
    }

    sessions.forEach(session => {
      const dayName = days[new Date(session.createdAt).getDay()];
      dailyStats[dayName] += (session.duration || 0) / 60;
    });

    res.json({
      labels: Object.keys(dailyStats),
      data: Object.values(dailyStats).map(v => v.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

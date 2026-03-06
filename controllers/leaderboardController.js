const User = require('../models/User');
const StudySession = require('../models/StudySession');

exports.getLeaderboard = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email');
    
    const leaderboardData = await Promise.all(
      students.map(async (student) => {
        const sessions = await StudySession.find({ userId: student._id });

        // Calculate total study hours
        const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const totalStudyHours = totalMinutes / 60;

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

        // Calculate weekly consistency
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        
        const weeklySessions = sessions.filter(s => new Date(s.createdAt) >= last7Days);
        const uniqueDays = new Set(
          weeklySessions.map(s => new Date(s.createdAt).toDateString())
        ).size;
        const weeklyConsistency = (uniqueDays / 7) * 100;

        // Calculate productivity score
        const productivityScore = (
          (totalStudyHours * 0.4) +
          (streak * 0.3) +
          (weeklyConsistency * 0.3)
        );

        return {
          name: student.name,
          email: student.email,
          score: parseFloat(productivityScore.toFixed(2)),
          totalHours: parseFloat(totalStudyHours.toFixed(2)),
          streak
        };
      })
    );

    // Sort by score descending and get top 10
    const topStudents = leaderboardData
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json(topStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

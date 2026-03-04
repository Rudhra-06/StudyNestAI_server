const StudySession = require('../models/StudySession');

exports.startSession = async (req, res) => {
  try {
    const { subject } = req.body;
    const session = await StudySession.create({
      userId: req.user.id,
      subject,
      startTime: new Date()
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await StudySession.findById(sessionId);

    if (!session || session.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const endTime = new Date();
    const duration = Math.floor((endTime - session.startTime) / 60000);
    const credits = Math.floor(duration / 30);

    session.endTime = endTime;
    session.duration = duration;
    session.credits = credits;
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStreak = async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let session of sessions) {
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

    const totalCredits = sessions.reduce((sum, s) => sum + (s.credits || 0), 0);

    res.json({ streak, totalCredits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.detectBurnout = async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const sessions = await StudySession.find({
      userId: req.user.id,
      createdAt: { $gte: last7Days }
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const avgPerDay = totalMinutes / 7;

    let burnoutRisk = 'low';
    if (avgPerDay > 480) burnoutRisk = 'high';
    else if (avgPerDay > 360) burnoutRisk = 'medium';

    res.json({ burnoutRisk, avgStudyTimePerDay: avgPerDay, totalSessions: sessions.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

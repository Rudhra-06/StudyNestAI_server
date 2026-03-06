const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  try {
    const { category, content, rating, isAnonymous } = req.body;
    const feedback = await Feedback.create({
      category,
      content,
      rating,
      isAnonymous
    });
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbackAnalytics = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    // Calculate average rating
    const totalRating = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0);
    const avgRating = feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(2) : 0;

    // Count by category
    const categoryCounts = {};
    feedbacks.forEach(f => {
      categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
    });

    // Recent feedback (last 10)
    const recentFeedback = feedbacks.slice(0, 10);

    res.json({
      totalFeedback: feedbacks.length,
      avgRating: parseFloat(avgRating),
      categoryCounts,
      recentFeedback
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

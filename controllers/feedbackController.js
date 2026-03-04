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

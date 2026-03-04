const Notice = require('../models/Notice');

exports.createNotice = async (req, res) => {
  try {
    const { title, content, targetRole, priority, expiresAt } = req.body;
    const notice = await Notice.create({
      title,
      content,
      postedBy: req.user.id,
      targetRole,
      priority,
      expiresAt
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({
      $or: [
        { targetRole: req.user.role },
        { targetRole: 'all' }
      ],
      $or: [
        { expiresAt: { $gte: new Date() } },
        { expiresAt: null }
      ]
    }).populate('postedBy', 'name').sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

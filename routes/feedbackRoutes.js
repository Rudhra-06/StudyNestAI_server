const express = require('express');
const { submitFeedback, getAllFeedback, getFeedbackAnalytics } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', submitFeedback);
router.get('/', protect, authorize('admin', 'warden'), getAllFeedback);
router.get('/analytics', protect, authorize('admin', 'warden'), getFeedbackAnalytics);

module.exports = router;

const express = require('express');
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', submitFeedback);
router.get('/', protect, authorize('admin', 'warden'), getAllFeedback);

module.exports = router;

const express = require('express');
const { getComplaintAnalytics, getHostelStats, getStudentsByBlock } = require('../controllers/wardenController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/complaint-analytics', protect, authorize('warden', 'admin'), getComplaintAnalytics);
router.get('/hostel-stats', protect, authorize('warden', 'admin'), getHostelStats);
router.get('/students/:block', protect, authorize('warden', 'admin'), getStudentsByBlock);

module.exports = router;

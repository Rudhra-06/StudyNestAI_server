const express = require('express');
const { getComplaintAnalytics, getHostelStats, getStudentsByBlock, addRoomInspection, getRoomInspections, getStudentRoomHistory } = require('../controllers/wardenController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/complaint-analytics', protect, authorize('warden', 'admin'), getComplaintAnalytics);
router.get('/hostel-stats', protect, authorize('warden', 'admin'), getHostelStats);
router.get('/students/:block', protect, authorize('warden', 'admin'), getStudentsByBlock);
router.post('/room-inspection', protect, authorize('warden', 'admin'), addRoomInspection);
router.get('/room-inspections', protect, authorize('warden', 'admin'), getRoomInspections);
router.get('/room-history/:studentId', protect, authorize('warden', 'admin'), getStudentRoomHistory);

module.exports = router;

const express = require('express');
const { markAttendance, getTodayAttendance, getAttendanceStats } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/mark', protect, authorize('warden', 'admin'), markAttendance);
router.get('/today', protect, authorize('warden', 'admin'), getTodayAttendance);
router.get('/stats', protect, authorize('warden', 'admin'), getAttendanceStats);

module.exports = router;

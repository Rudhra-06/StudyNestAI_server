const express = require('express');
const { generateTimetable, getTimetable } = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/generate', protect, generateTimetable);
router.get('/', protect, getTimetable);

module.exports = router;

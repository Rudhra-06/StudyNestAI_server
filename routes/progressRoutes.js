const express = require('express');
const { getDailyProgress, getTodayProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/daily', protect, getDailyProgress);
router.get('/today', protect, getTodayProgress);

module.exports = router;

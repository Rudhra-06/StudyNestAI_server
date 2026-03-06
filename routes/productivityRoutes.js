const express = require('express');
const { getUserProductivity, getWeeklyStats } = require('../controllers/productivityController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/user', protect, getUserProductivity);
router.get('/weekly', protect, getWeeklyStats);

module.exports = router;

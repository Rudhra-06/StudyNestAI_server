const express = require('express');
const { startSession, endSession, getStreak, detectBurnout } = require('../controllers/studyController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/start', protect, startSession);
router.put('/end/:sessionId', protect, endSession);
router.get('/streak', protect, getStreak);
router.get('/burnout', protect, detectBurnout);

module.exports = router;

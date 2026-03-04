const express = require('express');
const { triggerEmergency, getEmergencies, acknowledgeEmergency } = require('../controllers/emergencyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, triggerEmergency);
router.get('/', protect, authorize('warden', 'admin'), getEmergencies);
router.put('/:id/acknowledge', protect, authorize('warden', 'admin'), acknowledgeEmergency);

module.exports = router;

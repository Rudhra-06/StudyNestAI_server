const express = require('express');
const { createComplaint, getComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createComplaint);
router.get('/', protect, getComplaints);
router.put('/:id', protect, authorize('warden', 'admin'), updateComplaintStatus);

module.exports = router;

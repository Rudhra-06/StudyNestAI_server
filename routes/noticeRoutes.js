const express = require('express');
const { createNotice, getNotices } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, authorize('admin', 'warden'), createNotice);
router.get('/', protect, getNotices);

module.exports = router;

const express = require('express');
const { addExpense, getExpenses, getExpenseAnalytics } = require('../controllers/hostelExpenseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, authorize('warden', 'admin'), addExpense);
router.get('/', protect, authorize('warden', 'admin'), getExpenses);
router.get('/analytics', protect, authorize('warden', 'admin'), getExpenseAnalytics);

module.exports = router;

const express = require('express');
const { addExpense, getExpenses } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, addExpense);
router.get('/', protect, getExpenses);

module.exports = router;

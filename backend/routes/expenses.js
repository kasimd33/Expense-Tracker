const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Expense = require('../models/Expense');

// @route   POST api/expenses
// @desc    Create an expense/income
// @access  Private
router.post('/', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('amount', 'Amount is required').isNumeric(),
  check('category', 'Category is required').not().isEmpty(),
  check('paymentMethod', 'Payment method is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newExpense = new Expense({
      ...req.body,
      user: req.user.id
    });
    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/expenses
// @desc    Get all user expenses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });
    if (expense.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    expense = await Expense.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });
    if (expense.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

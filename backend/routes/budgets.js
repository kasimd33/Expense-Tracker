const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');

// Get all budgets
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Create budget
router.post('/', auth, async (req, res) => {
  try {
    const { category, limit, color, icon, alertThreshold, month } = req.body;
    
    let existing = await Budget.findOne({ userId: req.user.id, category, month });
    if (existing) {
      return res.status(400).json({ error: 'A budget already exists for this category in the selected month.' });
    }

    const newBudget = new Budget({
      userId: req.user.id, category, limit, color, icon, alertThreshold, month
    });

    const savedBudget = await newBudget.save();
    res.json(savedBudget);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Update budget
router.put('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Budget removed' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;

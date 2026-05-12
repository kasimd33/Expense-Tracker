const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  color: { type: String, default: '#4f46e5' },
  icon: { type: String, default: 'Wallet' },
  alertThreshold: { type: Number, default: 80 },
  month: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Budget', BudgetSchema);

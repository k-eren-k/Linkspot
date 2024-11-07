const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  theme: { type: String, default: 'default' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);

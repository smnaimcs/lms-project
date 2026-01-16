// ==================== backend/models/BankAccount.js ====================
const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BankAccount', bankAccountSchema);

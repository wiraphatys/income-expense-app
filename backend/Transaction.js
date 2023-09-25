const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  text: String,
  amount: Number,
});

module.exports = mongoose.model('Transaction', transactionSchema);

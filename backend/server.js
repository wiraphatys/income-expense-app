const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('./Transaction');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://user:user1234@transactiondata.apeelig.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

// GET all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
});

// DELETE a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await Transaction.deleteOne({ _id: req.params.id });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

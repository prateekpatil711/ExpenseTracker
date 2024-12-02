const mongoose = require('mongoose');

// Define the expense schema
const expenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  expense: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
  expensetype: {
    type: String,
    required: true,
  }

});

// Create and export the Expense model
module.exports = mongoose.model('Expense', expenseSchema);
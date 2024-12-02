const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Expense = require("./models/Expense");

// Create an instance of the Express server
const app = express();
const port = 5000;
// Enable CORS
app.use(cors());

// Middleware to parse JSON data
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://prateekpatil0711:atzSH9mFpgcdPium@cluster0.l8eip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


// Define routes
app.get('/expensesget', async (req, res) => {
    const { date, amount, expense, category, bank, expensetype } = req.query;
  
    try {
      // Construct the query object based on the provided fields
      const query = {};
      if (date) query.date = date;
      if (amount) query.amount = amount;
      if (expense) query.expense = expense;
      if (category) query.category = category;
      if (bank) query.category = bank;
      if (expensetype) query.category = expensetype;
  
      // Find expenses based on the constructed query
      const expenses = await Expense.find(query);
  
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

app.post("/expensespost", async (req, res) => {
  const { date, amount, expense, category, bank, expensetype } = req.body;

  try {
    // Create a new expense record in the database
    const newExpense = await Expense.create({
      date,
      amount,
      expense,
      category,
      bank,
      expensetype,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


app.delete("/expensesdelete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the expense by ID and remove it from the database
    const deletedExpense = await Expense.findByIdAndRemove(id);

    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});


app.put("/expensesput/:id", async (req, res) => {
  const { id } = req.params;
  const { date, amount, expense, category, bank, expensetype } = req.body;

  try {
    // Find the expense by ID and update its fields
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { date, amount, expense, category, bank },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});


// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 3000");
});

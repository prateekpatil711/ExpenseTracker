"use client";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import categoriesData from "../../data/companycategory.json";
import Bank from "../../data/bank.json";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function Companyexpense() {
  const categories = categoriesData.categories;
  const bankname = Bank.banks;

  const [amount, setAmount] = useState("");
  const [expense, setExpense] = useState("");
  const [category, setCategory] = React.useState<string | null>(categories[0]);
  const [date, setDate] = useState("");
  const [expensetype, setExpensetype] = useState("");
  const [bank, setBank] = React.useState<string | null>(bankname[0]);

  const capitalizeWords = (input: string): string => {
    return input.replace(/\b\w/g, (match) => match.toUpperCase());
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(date, category, amount, bank, expense, expensetype);
    try {
      const response = await axios.post("http://localhost:5000/expensespost", {
        date,
        amount,
        expense,
        category,
        bank,
        expensetype: "Company",
      });
      console.log(response.data);

      // Reset the form inputs
      setDate("");
      setAmount("");
      setExpense("");
      setExpensetype("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="ml-4">
        <h3 className="text-center">
          <b>Company Expense</b>
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="addExpense m-4">
          <div className="expenseTextfield">
            <TextField
              fullWidth
              id="outlined-controlled"
              label="Date"
              type="Date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="expenseTextfield">
            <TextField
              fullWidth
              id="outlined-controlled"
              label="Expense"
              value={expense}
              onChange={(event) => setExpense(event.target.value)}
            />
          </div>
          <div className="expenseTextfield">
            <TextField
              fullWidth
              id="outlined-controlled"
              label="Amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          <div className="expenseTextfield">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={categories}
              defaultValue={category}
              value={category}
              onChange={(event, newValue) => {
                if (newValue) {
                  setCategory(newValue);
                } 
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />
              )}
            />
          </div>
          <div className="expenseTextfield">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={bankname}
              defaultValue={bank}
              value={bank}
              onChange={(event, newValue) => {
                if (newValue) {
                  setBank(newValue);
                } 
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bank"
                  value={bank}
                  onChange={(event) => setBank(event.target.value)}
                />
              )}
            />
          </div>

          <button
            type="submit"
            className="expenseTextfield m-auro bg-blue-500 text-white py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-blue-300 hover:text-black-500 transition-all duration-300"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}

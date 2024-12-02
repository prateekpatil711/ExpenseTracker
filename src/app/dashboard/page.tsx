"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Bargraph from "./bargraph";

interface ExpenseItem {
  _id: string;
  date: string;
  amount: number;
  expense: string;
  category: string;
  bank: string;
  expensetype: string;
}

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get<ExpenseItem[]>(
          "http://localhost:5000/expensesget"
        );
        setExpenses(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div>
      <Bargraph />
    </div>
  );
};

export default Dashboard;

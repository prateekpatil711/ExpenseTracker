"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SortIcon from "@mui/icons-material/Sort";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import Autocomplete from "@mui/material/Autocomplete";
import Bank from "../../../data/bank.json";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import PersonalcategoriesData from "../../../data/personalcategory.json";
import CompanycategoriesData from "../../../data/companycategory.json";

const bankname = Bank.banks;
const expenseType = ["Personal", "Company"];

interface ExpenseItem {
  _id: string;
  date: string;
  amount: number;
  expense: string;
  category: string;
  bank: string;
  expensetype: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 280,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 1,
};

const Expense: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [editExpenseId, setEditExpenseId] = useState<string>("");
  const [editExpense, setEditExpense] = useState<ExpenseItem>({
    _id: "",
    date: "",
    amount: 0,
    expense: "",
    category: "",
    bank: "",
    expensetype: "",
  });
  const [open, setOpen] = React.useState(false);
  const [selectedExpenseType, setSelectedExpenseType] =
    useState<string>("Both");
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseItem[]>([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get<ExpenseItem[]>(
          "http://localhost:5000/expensesget"
        );
        const sortedExpenses = response.data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setExpenses(sortedExpenses);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    const filterExpenses = () => {
      let filtered: ExpenseItem[];

      if (selectedExpenseType === "Personal") {
        if (selectedCategory === "All Categories") {
          filtered = expenses.filter(
            (expense) => expense.expensetype === "Personal"
          );
        } else {
          filtered = expenses.filter(
            (expense) =>
              expense.expensetype === "Personal" &&
              expense.category === selectedCategory
          );
        }
      } else if (selectedExpenseType === "Company") {
        if (selectedCategory === "All Categories") {
          filtered = expenses.filter(
            (expense) => expense.expensetype === "Company"
          );
        } else {
          filtered = expenses.filter(
            (expense) =>
              expense.expensetype === "Company" &&
              expense.category === selectedCategory
          );
        }
      } else {
        filtered = expenses;
      }

      if (fromDate && toDate) {
        filtered = filtered.filter((expense) => {
          const expenseDate = new Date(expense.date).getTime();
          const fromDateValue = new Date(fromDate).getTime();
          const toDateValue = new Date(toDate).getTime();
          return expenseDate >= fromDateValue && expenseDate <= toDateValue;
        });
      }

      const sortedExpenses = filtered.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setFilteredExpenses(sortedExpenses);
    };

    filterExpenses();
  }, [
    selectedExpenseType,
    selectedCategory,
    expenses,
    fromDate,
    toDate,
    selectedFilter,
  ]);

  const handleDeleteExpense = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/expensesdelete/${id}`);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditExpense = (expense: ExpenseItem) => {
    handleOpen();
    setEditExpenseId(expense._id);
    setEditExpense({ ...expense });
  };

  const handleUpdateExpense = async () => {
    try {
      await axios.put(
        `http://localhost:5000/expensesput/${editExpenseId}`,
        editExpense
      );
      // Update the expenses list with the modified expense
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === editExpenseId ? editExpense : expense
        )
      );
      // Clear the edit form
      setEditExpenseId("");
      setEditExpense({
        _id: "",
        date: "",
        amount: 0,
        expense: "",
        category: "",
        bank: "",
        expensetype: "",
      });
      console.log(editExpense.expensetype);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    // Clear the edit form
    setEditExpenseId("");
    setEditExpense({
      _id: "",
      date: "",
      amount: 0,
      expense: "",
      category: "",
      bank: "",
      expensetype: "",
    });
    handleClose();
  };

  const getFormattedDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getPastDate = (months: number): Date => {
    const today = new Date();
    return new Date(
      today.getFullYear(),
      today.getMonth() - months,
      today.getDate()
    );
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);

    switch (value) {
      case "All":
        setFromDate("");
        setToDate("");
        break;
      case "LastThreeMonths":
        setFromDate(getFormattedDate(getPastDate(3)));
        setToDate(getFormattedDate(new Date()));
        break;
      case "LastSixMonths":
        setFromDate(getFormattedDate(getPastDate(6)));
        setToDate(getFormattedDate(new Date()));
        break;
      case "CurrentYear":
        const currentYear = new Date().getFullYear();
        setFromDate(`${currentYear}-01-01`);
        setToDate(`${currentYear}-12-31`);
        break;
      case "Custom":
        // You can handle the custom filter option based on your requirements
        break;
      case "CurrentMonth":
        const currentYear1 = new Date().getFullYear();
        const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
        setFromDate(`${currentYear1}-${currentMonth}-01`);
        setToDate(getFormattedDate(new Date()));
        break;
      case "LastMonth":
        const today = new Date();
        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const startOfMonth = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth(),
          1
        );
        const endOfMonth = new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth() + 1,
          0
        );

        setFromDate(getFormattedDate(startOfMonth));
        setToDate(getFormattedDate(endOfMonth));
        break;
      default:
        break;
    }
  };

  const calculateTotalExpense = (): number => {
    return filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center bg-zinc-200 rounded-md my-4">
        <div className="expenseTextfield">
          <FormControl fullWidth>
            <InputLabel id="filter-select-label">Filter</InputLabel>
            <Select
              labelId="filter-select-label"
              id="filter-select"
              value={selectedFilter}
              label="Filter"
              size="small"
              onChange={(event: SelectChangeEvent<string>) => {
                setSelectedFilter(event.target.value);
                handleFilterChange(event.target.value);
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="CurrentMonth">Current Month</MenuItem>
              <MenuItem value="LastMonth">Last Month</MenuItem>
              <MenuItem value="LastThreeMonths">Last 3 Months</MenuItem>
              <MenuItem value="LastSixMonths">Last 6 Months</MenuItem>
              <MenuItem value="CurrentYear">Current Year</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="expenseTextfield">
          <TextField
            fullWidth
            id="outlined-controlled"
            label="From Date"
            type="date"
            value={fromDate}
            size="small"
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className="expenseTextfield">
          <TextField
            fullWidth
            id="outlined-controlled"
            label="To Date"
            type="date"
            value={toDate}
            size="small"
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className="expenseTextfield">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={["Personal", "Company", "Both"]}
            value={selectedExpenseType}
            size="small"
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedExpenseType(newValue);
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Expense Type" sx={{ width: 248 }} />
            )}
          />
        </div>
        <div className="expenseTextfield">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={
              selectedExpenseType === "Personal"
                ? ["All Categories", ...PersonalcategoriesData.categories]
                : selectedExpenseType === "Company"
                ? ["All Categories", ...CompanycategoriesData.categories]
                : []
            }
            value={selectedCategory}
            size="small"
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedCategory(newValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                disabled={selectedExpenseType === "Both"}
                sx={{ width: 248 }}
              />
            )}
          />
        </div>
      </div>

      <div className="totalExpense">
        <b>Total Expense:</b> {calculateTotalExpense()}
      </div>

      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 280 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Date</b>{" "}
              </TableCell>
              <TableCell align="left">
                <b>Expense</b>
              </TableCell>
              <TableCell align="left">
                <b>Category</b>
              </TableCell>
              <TableCell align="left">
                <b>Amount</b>
              </TableCell>
              <TableCell align="left">
                <b>Bank</b>
              </TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow
                key={expense._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {new Date(expense.date)
                    .toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </TableCell>
                <TableCell align="left">{expense.expense}</TableCell>
                <TableCell align="left">{expense.category}</TableCell>
                <TableCell align="left">{expense.amount}</TableCell>
                <TableCell align="left">{expense.bank}</TableCell>
                <TableCell align="left">
                  <EditIcon
                    color="secondary"
                    onClick={() => handleEditExpense(expense)}
                  />
                </TableCell>
                <TableCell align="left">
                  <DeleteForeverIcon
                    color="secondary"
                    onClick={() => handleDeleteExpense(expense._id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div>
              <div className="expenseTextfield">
                <TextField
                  fullWidth
                  id="outlined-controlled"
                  label="Date"
                  type="Date"
                  value={editExpense.date}
                  onChange={(e) =>
                    setEditExpense({
                      ...editExpense,
                      date: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="expenseTextfield">
                <TextField
                  fullWidth
                  id="outlined-controlled"
                  label="Expense"
                  value={editExpense.expense}
                  onChange={(e) =>
                    setEditExpense({
                      ...editExpense,
                      expense: e.target.value,
                    })
                  }
                />
              </div>
              <div className="expenseTextfield">
                <TextField
                  fullWidth
                  id="outlined-controlled"
                  label="Amount"
                  value={editExpense.amount}
                  onChange={(e) =>
                    setEditExpense({
                      ...editExpense,
                      amount: +e.target.value,
                    })
                  }
                />
              </div>
              <div className="expenseTextfield">
                <TextField
                  fullWidth
                  id="outlined-controlled"
                  label="Category"
                  value={editExpense.category}
                  onChange={(e) =>
                    setEditExpense({
                      ...editExpense,
                      category: e.target.value,
                    })
                  }
                />
              </div>
              <div className="expenseTextfield">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={bankname}
                  defaultValue={editExpense.bank}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setEditExpense({
                        ...editExpense,
                        bank: newValue,
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Bank"
                      value={editExpense.bank}
                      onChange={(e) =>
                        setEditExpense({
                          ...editExpense,
                          bank: e.target.value,
                        })
                      }
                    />
                  )}
                />
              </div>
              <div className="expenseTextfield">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={expenseType}
                  defaultValue={editExpense.expensetype}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setEditExpense({
                        ...editExpense,
                        expensetype: newValue,
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Expense Type"
                      value={editExpense.bank}
                      onChange={(e) =>
                        setEditExpense({
                          ...editExpense,
                          expensetype: e.target.value,
                        })
                      }
                    />
                  )}
                />
              </div>
              <div className="flex flex-wrap justify-center">
                <div className="m-2">
                  <SaveRoundedIcon
                    onClick={handleUpdateExpense}
                    color="secondary"
                  />
                </div>
                <div className="m-2">
                  <ClearIcon onClick={handleCancelEdit} color="secondary" />
                </div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default Expense;

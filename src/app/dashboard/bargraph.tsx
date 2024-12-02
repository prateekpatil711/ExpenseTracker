import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ExpenseItem {
  _id: string;
  date: string;
  amount: number;
  expense: string;
  category: string;
  expensetype: string;
}

interface MonthlyExpenditure {
  month: string;
  personal: number;
  company: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-violet-100 p-1 rounded-sm text-black">
        <p className="label">{`Month: ${data.month}`}</p>
        <p className="label">{`Personal Expenditure: ${data.personal}`}</p>
        <p className="label">{`Company Expenditure: ${data.company}`}</p>
      </div>
    );
  }

  return null;
};

const Expense: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyExpenditure[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get<ExpenseItem[]>(
          "http://localhost:5000/expensesget"
        );
        calculateMonthlyExpenditure(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExpenses();
  }, []);

  const calculateMonthlyExpenditure = (expenses: ExpenseItem[]) => {
    const monthlyExpenditureMap = new Map<string, MonthlyExpenditure>();

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const year = date.getFullYear();

      if (year === 2023) {
        const month = date.toLocaleString("en-US", { month: "short" });
        const yearMonth = `${month}-${year}`;

        if (!monthlyExpenditureMap.has(yearMonth)) {
          monthlyExpenditureMap.set(yearMonth, {
            month,
            personal: 0,
            company: 0,
          });
        }

        const currentExpenditure = monthlyExpenditureMap.get(yearMonth)!;
        if (expense.expensetype === "Personal") {
          currentExpenditure.personal += expense.amount;
        } else if (expense.expensetype === "Company") {
          currentExpenditure.company += expense.amount;
        }
      }
    });

    const transformedData: MonthlyExpenditure[] = Array.from(
      monthlyExpenditureMap.values()
    ).sort((a, b) => {
      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    setMonthlyData(transformedData);
  };

  const handleResize = () => {
    const containerWidth =
      document.getElementById("chart-container")?.clientWidth || 0;
    const chartWidth = Math.min(containerWidth, 1000);
    const chartHeight = Math.max(Math.min(window.innerHeight - 200, 400), 300);
    setChartWidth(chartWidth);
    setChartHeight(chartHeight);
  };

  const [chartWidth, setChartWidth] = useState<number>(1000);
  const [chartHeight, setChartHeight] = useState<number>(400);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderXTick = (props: any) => {
    const { x, y, payload } = props;

    // Reduce the label size when the screen width is below a threshold
    const fontSize = chartWidth < 600 ? "10px" : "14px";

    return (
      <text
        x={x}
        y={y}
        dy={16}
        textAnchor="middle"
        fill="#f8e2ff"
        fontSize={fontSize}
      >
        {payload.value}
      </text>
    );
  };

  const renderYLeftTick = (props: any) => {
    const { x, y, payload } = props;
    const fontSize = chartWidth < 600 ? "10px" : "14px";
    return (
      <text
        x={x}
        y={y}
        dx={-12}
        dy={4}
        textAnchor="end"
        fill="#f8e2ff"
        fontSize={fontSize}
      >
        {payload.value}
      </text>
    );
  };

  const renderYRightTick = (props: any) => {
    const { x, y, payload } = props;
    const fontSize = chartWidth < 600 ? "10px" : "14px";
    return (
      <text
        x={x}
        y={y}
        dx={12}
        dy={4}
        textAnchor="start"
        fill="#f8e2ff"
        fontSize={fontSize}
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div
      className="mt-16"
      style={{
        backgroundColor: "#000000",
        paddingTop: "30px"
      }}
    >
      <h2 className="text-center">
        <b>Monthly Expenditure for 2023</b>
      </h2>
      <div
        id="chart-container"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#000000",
          paddingTop: "30px",
        }}
      >
        <BarChart
          width={chartWidth}
          height={chartHeight}
          data={monthlyData}
          margin={{
            top: 20,
            right: chartWidth / 50,
            left: chartWidth / 50,
            bottom: 5,
          }}
        >
          <XAxis dataKey="month" tick={renderXTick} interval={0}/>
          <YAxis yAxisId="left" tick={renderYLeftTick} stroke="#ff178f"/>
          <YAxis yAxisId="right" orientation="right" tick={renderYRightTick} stroke="#ffed17"/>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="personal"
            fill="#ff178f"
            stroke="#ff178f"
            barSize={chartWidth / 55}
            yAxisId="left"
            name="Personal Expenditure (in Rs)"
          />
          <Bar
            dataKey="company"
            fill="#ffed17"
            barSize={chartWidth / 55}
            yAxisId="right"
            name="Company Expenditure (in Rs)"
          />
        </BarChart>
      </div>
    </div>
  );
};

export default Expense;

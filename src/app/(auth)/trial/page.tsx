"use client";
import { totalMealGroup } from "@/model/totalMealGroup";
import { usePatchTotalMealGroup } from "@/services/mutations";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const getMonthDetails = (year: number, month: number) => {
  const firstDate = new Date(Date.UTC(year, month, 1));
  const lastDate = new Date(Date.UTC(year, month + 1, 0));

  return {
    firstDate: firstDate.toISOString().split("T")[0], // YYYY-MM-DD
    lastDate: lastDate.toISOString().split("T")[0],
    daysInMonth: lastDate.getUTCDate(), // Number of days in the month
  };
};
const Check = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // Default to current month
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [dates,setDates]=useState<string[]>([]);
  const [lunchData, setLunchData]=useState<number[]>([]);
  const [snacksData, setSnacksData]=useState<number[]>([]);
  const [totalMeal, setTotalMeal] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { firstDate, daysInMonth } = getMonthDetails(
    selectedYear,
    selectedMonth
  );

  const { mutate: lunchMealCount } = usePatchTotalMealGroup(
    firstDate,
    1,
    daysInMonth
  );
  const { mutate: snacksMealCount } = usePatchTotalMealGroup(
    firstDate,
    2,
    daysInMonth
  );
  useEffect(() => {
    setLoading(true);

    Promise.all([
      new Promise<totalMealGroup[]>((resolve, reject) => {
        lunchMealCount(undefined, {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        });
      }),
      new Promise<totalMealGroup[]>((resolve, reject) => {
        snacksMealCount(undefined, {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        });
      }),
    ])
      .then(([lunchData, snacksData]) => {
        const dates=lunchData.map(item=>item.date ?? '');
        const lunchcount=lunchData.map(item=>item.count??0);
        const snackcount=snacksData.map(item=>item.count??0);
        setDates(dates);
        setLunchData(lunchcount);
        setSnacksData(snackcount);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("No Data Available");
        setLoading(false);
      });
  }, [firstDate, daysInMonth]);
  const chartLabel = "Line Chart Example";
  const xLabels = dates;
  const datasets = [
    {
      label: "Lunch Count",
      data: lunchData,
      borderColor: "rgb(75, 182, 173)",
      backgroundColor: "rgb(75, 182, 173,0.3)",
      tension:0.2,
      spanGaps:true,
      pointRadius:4,
      pointHoverRadius:6,
    },
    {
      label: "Snacks Count",
      data: snacksData,
      borderColor: "rgb(255, 182, 78)",
      backgroundColor: "rgb(255, 182, 78,0.3)",
      tension:0.2,
      spanGaps:true,
      pointRadius:4,
      pointHoverRadius:6,
    },
  ];
  return (
    <div>
      <Line
        data={{
          labels: xLabels,
          datasets: datasets,
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: chartLabel },
          },
          
        }}
      />
    </div>
  );
};

export default Check;

"use client";

import InstantGuest from "@/features/dashboard/InstantGuest";
import { baseRequest } from "@/services/HttpClientAPI";
import React, { useEffect, useState } from "react";
const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

interface MealStatus {
  status: boolean;
  guest_count: number;
  penalty: boolean;
}

interface Meal {
  meal_type: number;
  meal_status: MealStatus[];
}

interface EmployeeDetail {
  date: string;
  holiday: boolean;
  meal: Meal[];
}

interface MealActivityData {
  employee_id: number;
  employee_name: string;
  employee_details: EmployeeDetail[];
}
type totalmeal = {
  date: string;
  count: number;
};
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
import { Line } from "react-chartjs-2";
import { useMealSummaryYear } from "@/services/queries";
import BarChart from "@/components/barChart";
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

const MealActivityComponent = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // Default to current month
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [datess, setDatess] = useState<string[]>([]);
  const [lunchData, setLunchData] = useState<number[]>([]);
  const [snacksData, setSnacksData] = useState<number[]>([]);
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
        const datess = lunchData.map((item) => item.date ?? "");
        const lunchcount = lunchData.map((item) => item.count ?? 0);
        const snackcount = snacksData.map((item) => item.count ?? 0);
        setDatess(datess);
        setLunchData(lunchcount);
        setSnacksData(snackcount);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("No Data Available");
        setLoading(false);
      });
  }, [firstDate, daysInMonth]);
  console.log(selectedYear.toString());
  const { data: mealSummaryYear } = useMealSummaryYear(selectedYear);
  const months = mealSummaryYear?.map((items) => items.month);
  const totalLunch = mealSummaryYear?.map((items) => items.lunch);
  const totalSnacks = mealSummaryYear?.map((items) => items.snack);
  console.log(months);
  console.log(mealSummaryYear?.toString());
  const chartLabel = "Line Chart Example";
  const xLabels = months;
  const datasets = [
    {
      label: "Lunch Count",
      data: totalLunch,
      borderColor: "rgb(75, 182, 173)",
      backgroundColor: "rgb(75, 182, 173,0.3)",
      tension: 0.2,
      spanGaps: true,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Snacks Count",
      data: totalSnacks,
      borderColor: "rgb(255, 182, 78)",
      backgroundColor: "rgb(255, 182, 78,0.3)",
      tension: 0.2,
      spanGaps: true,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ];

  const [mealActivityData, setMealActivityData] = useState<MealActivityData[]>(
    []
  );
  const [lunchTotal, setLunchTotal] = useState<number | null>(null);
  const [snacksTotal, setSnacksTotal] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [days, setDays] = useState<number>(7);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    employeeId: number;
    employeeName: string;
    date: string;
    currentStatus: boolean | null;
    currentPenalty: boolean;
  } | null>(null);

  const generateDates = (start: Date, days: number) => {
    const dates: string[] = [];
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      dates.push(currentDate.toISOString().split("T")[0]);
    }
    return dates;
  };
  const fetchTotallunch = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    try {
      const response = (await request({
        url: "/meal_activity/total-meal-group",
        method: "PATCH",
        data: {
          date: formattedDate,
          meal_type: 1,
          days: 1,
        },
        useAuth: true,
      })) as totalmeal[];
      setLunchTotal(response[0].count);
    } catch (err: any) {
      console.log("Error Fetching Lunch");
    }
  };

  const fetchTotalSnacks = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    try {
      const response = (await request({
        url: "/meal_activity/total-meal-group",
        method: "PATCH",
        data: {
          date: formattedDate,
          meal_type: 2,
          days: 1,
        },
        useAuth: true,
      })) as totalmeal[];
      setSnacksTotal(response[0].count);
    } catch (err: any) {
      console.log("Error Fetching Lunch");
    }
  };

  const fetchMealActivity = async () => {
    try {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const response = (await request({
        url: "/meal_activity/admin",
        method: "GET",
        params: { start: formattedStartDate, days },
        useAuth: true,
      })) as MealActivityData[] | null;
      if (response) {
        // If response is not null, update state
        setMealActivityData(response);
      } else {
        // Handle case where response is null
        setMealActivityData([]); // Set an empty array or appropriate fallback value
        console.warn("Meal activity data is empty.");
      }
    } catch (err: any) {
      console.error("Error fetching meal activity:", err);
      setError(err.response?.data?.message || "Failed to fetch meal activity.");
    }
  };

  const calculateTotalGuestsPerDay = () => {
    const lunchGuests: Record<string, number> = {};
    const snackGuests: Record<string, number> = {};

    mealActivityData.forEach((employee) => {
      employee.employee_details.forEach((detail) => {
        const lunchMeal = detail.meal.find((m) => m.meal_type === 1);
        const snackMeal = detail.meal.find((m) => m.meal_type === 2);

        // Accumulate lunch guest count
        if (lunchMeal) {
          const guestCount = lunchMeal.meal_status[0]?.guest_count || 0;
          lunchGuests[detail.date] =
            (lunchGuests[detail.date] || 0) + guestCount;
        }

        // Accumulate snack guest count
        if (snackMeal) {
          const guestCount = snackMeal.meal_status[0]?.guest_count || 0;
          snackGuests[detail.date] =
            (snackGuests[detail.date] || 0) + guestCount;
        }
      });
    });

    return { lunchGuests, snackGuests };
  };

  const totalGuestsPerDay = calculateTotalGuestsPerDay();
  console.log(totalGuestsPerDay);

  useEffect(() => {
    const initializeMealPlan = async () => {
      try {
        // Fetch data asynchronously in parallel
        await Promise.all([
          fetchMealActivity(),
          fetchTotallunch(),
          fetchTotalSnacks(),
        ]);
      } catch (error) {
        console.error("Error initializing meal plan:", error);
      }
    };

    initializeMealPlan();
  }, [startDate, days]);

  const dates = generateDates(startDate, days);

  const handleCellClick = (
    employeeId: number,
    employeeName: string,
    date: string,
    currentStatus: boolean | null,
    currentPenalty: boolean
  ) => {
    setSelectedCell({
      employeeId,
      employeeName,
      date,
      currentStatus: currentStatus ?? null,
      currentPenalty: currentPenalty ?? false,
    });
    setModalOpen(true);
  };

  const calculateTotalGuestsForToday = () => {
    const today = new Date().toISOString().split("T")[0];
    let lunchGuests = 0;
    let snackGuests = 0;

    mealActivityData.forEach((employee) => {
      employee.employee_details.forEach((detail) => {
        if (detail.date === today) {
          // Check if this entry is for today
          detail.meal.forEach((meal) => {
            const mealGuestCount = meal.meal_status.reduce(
              (sum, status) => sum + (status.guest_count || 0),
              0
            );

            if (meal.meal_type === 1) {
              lunchGuests += mealGuestCount;
            } else if (meal.meal_type === 2) {
              snackGuests += mealGuestCount;
            }
          });
        }
      });
    });

    return { lunchGuests, snackGuests };
  };
  const handleBothUpdates = () => {
    fetchTotallunch();
    fetchTotalSnacks();
  };
  const totalGuests = calculateTotalGuestsForToday();
  console.log(totalGuests);

  return (
    <div className="p-4">
      {/*<div className="absolute justify-between mb-7"><TotalBox></TotalBox></div>*/}
      <div className="flex gap-4 mb-2">
        <div className="p-4 bg-blue-200 rounded-md text-center">
          <h3 className="text-lg font-semibold">Today&apos;s Total Lunch</h3>
          <p className="text-2xl font-bold">
            {lunchTotal !== null ? (
              lunchTotal
            ) : (
              <span className="loading loading-spinner loading-xs"></span>
            )}
          </p>
        </div>

        <div className="p-4 bg-green-200 rounded-md text-center">
          <h3 className="text-lg font-semibold">Today&apos;s Total Snacks</h3>
          <p className="text-2xl font-bold">
            {snacksTotal !== null ? (
              snacksTotal
            ) : (
              <span className="loading loading-spinner loading-xs"></span>
            )}
          </p>
        </div>

        <div className="p-4 bg-violet-200 rounded-md text-center w-64">
          <InstantGuest onUpdateSuccess={handleBothUpdates} />
        </div>
      </div>
      {/* <div className="grid grid-cols-1">
        <div className=" h-64 w-full">
          <Line
            data={{
              labels: xLabels,
              datasets: datasets,
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
                title: { display: true, text: chartLabel },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    display: true,
                  },
                },
              },
            }}
          />
        </div>
      </div> */}
      <div className="h-64">
      <BarChart
        data={{
          labels: ["a", "b", "c"],
          datasets: [
            { label: "data1", data: [1, 2, 3] },
            { label: "data2", data: [4, 5, 6] },
          ],
        }}
        color={["red", "green"]}
      ></BarChart>
      </div>
    </div>
  );
};

export default MealActivityComponent;

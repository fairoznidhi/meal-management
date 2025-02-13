"use client";

import React, { useEffect, useState } from "react";
import { usePatchTotalLunchSnacksCount, usePatchTotalMealGroup } from "@/services/mutations";
import Table, { Column } from "@/components/Table";
import { TotalMeal, totalMealGroup } from "@/model/totalMealGroup";

// Function to calculate first date and days in a given month
const getMonthDetails = (year: number, month: number) => {
  const firstDate = new Date(Date.UTC(year, month, 1));
  const lastDate = new Date(Date.UTC(year, month + 1, 0));

  return {
    firstDate: firstDate.toISOString().split("T")[0], // YYYY-MM-DD
    lastDate: lastDate.toISOString().split("T")[0],
    daysInMonth: lastDate.getUTCDate(), // Number of days in the month
  };
};

const MealHistory = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // Default to current month
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [totalMeal, setTotalMeal] = useState<any[]>([]); // Use any[] for formatted data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { firstDate, daysInMonth } = getMonthDetails(selectedYear, selectedMonth);

  const { mutate: lunchMealCount } = usePatchTotalMealGroup(firstDate, 1, daysInMonth);
  const { mutate: snacksMealCount } = usePatchTotalMealGroup(firstDate, 2, daysInMonth);
  const { mutate: totalCount } = usePatchTotalLunchSnacksCount(firstDate, daysInMonth);

  const formatData = (
    lunchData: totalMealGroup[] = [],
    snacksData: totalMealGroup[] = [],
    totalCountData: TotalMeal
  ) => {
    // Ensure lunchData and snacksData are arrays before calling map or find
    if (!Array.isArray(lunchData) || !Array.isArray(snacksData)) {
      return []; // Return an empty array if either lunchData or snacksData are not valid arrays
    }

    const formattedData = lunchData.map((lunch) => {
      const matchingSnack = snacksData.find((snack) => snack.date === lunch.date);

      return {
        date: lunch.date,
        total_lunch: lunch.count || 0,
        total_snacks: matchingSnack?.count || 0,
      };
    });

    const totalRow = {
      date: "Total",
      total_lunch: totalCountData.total_lunch,
      total_snacks: totalCountData.total_snacks,
    };

    formattedData.push(totalRow);
    return formattedData;
  };

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
      new Promise<TotalMeal>((resolve, reject) => {
        totalCount(undefined, {
          onSuccess: (data) => resolve(data),
          onError: (error) => reject(error),
        });
      }),
    ])
      .then(([lunchData, snacksData, totalCountData]) => {
        // Check if the data is available and valid
        if ((lunchData && lunchData.length === 0) && (snacksData && snacksData.length === 0) && !totalCountData) {
          setError("No meal data available for the selected month.");
        } else {
          const formatted = formatData(lunchData, snacksData, totalCountData);
          setTotalMeal(formatted);
          setError(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("No Data Available");
        setLoading(false);
      });
  }, [firstDate, daysInMonth]);

  const columns: Column[] = [
    {
      key: "date",
      label: "Date",
    },
    {
      key: "total_lunch",
      label: "Total Lunch",
    },
    {
      key: "total_snacks",
      label: "Total Snacks",
    },
  ];

  return (
    <div className="p-4 rounded">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold mb-4">Meal History</h2>
        <div className="mb-4 flex gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = now.getFullYear() - 2 + i; // Show 2 years before and 2 years after
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Table Display */}
      {loading && <span className="loading loading-dots loading-lg"></span>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && totalMeal.length > 0 ? (
        <Table columns={columns} data={totalMeal} />
      ) : (
        !loading && !error && <p>No meal records found for the selected month.</p>
      )}
    </div>
  );
};

export default MealHistory;

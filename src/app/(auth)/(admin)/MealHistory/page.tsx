"use client";

import React, { useEffect, useState } from "react";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";
import Table, { Column } from "@/components/Table"; // Ensure correct path
import { headers } from "next/headers";

const httpClient = new HttpClient(`${process.env.NEXT_PUBLIC_PROXY_URL}`);
const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

type TotalMeal = {
  name: string;
  total_count: number;
};

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
  const [totalMeal, setTotalMeal] = useState<TotalMeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get current month details based on selection
  const { firstDate, daysInMonth } = getMonthDetails(selectedYear, selectedMonth);

  useEffect(() => {
    const fetchTotalMeal = async () => {
      try {
        setLoading(true);
        const response = await request({
          url: "/meal_activity/meal-summary",
          method: "PATCH",
          data: {
            start_date: firstDate,
            days: daysInMonth,
          },
          useAuth: true,
        });

        setTotalMeal(response as TotalMeal[]);
      } catch (err: any) {
        console.error("Error fetching meals:", err);
        setError(err.response?.data?.message || "Failed to fetch meal summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalMeal();
  }, [firstDate, daysInMonth]); // Refetch when month changes


const columns: Column[] = [
    {
      key: "name",
      label: "Employee Name",
      
    },
    
    {
      key: "total_count",
      label: "Total Meals",
    },

  ];


  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Meal History</h2>

      {/* Month & Year Filter */}
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

      {/* Table Display */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && totalMeal.length > 0 ? (
        <Table columns={columns} data={totalMeal}>
          
        </Table>
      ) : (
        !loading && <p>No meal records found.</p>
      )}
    </div>
  );
};

export default MealHistory;

"use client";
import React, { useEffect, useState } from "react";
import {
  usePatchTotalLunchSnacksCount,
  usePatchTotalMealGroup,
} from "@/services/mutations";
import Table, { Column, Row } from "@/components/Table";
import { TotalMeal, totalMealGroup } from "@/model/totalMealGroup";
import dayjs from "dayjs";
import { differenceInDays, formatDate } from "date-fns";
import { useSingleEmployeeMealActivity } from "@/services/queries";
import { EmployeeEachDayMealDetails } from "@/model/userMealActivity";

const getMonthBoundaries = () => {
  const now = dayjs();
  const startOfMonth = now.startOf("month").toDate();
  const endOfMonth = now.endOf("month").toDate();
  return { startOfMonth, endOfMonth };
};
const calculateDaysInRange = (startDate: Date, endDate: Date) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return end.diff(start, "day") + 1;
};

const MealHistory = () => {
  const { startOfMonth, endOfMonth } = getMonthBoundaries();
  const [startDate, setStartDate] = useState(startOfMonth);
  const [endDate, setEndDate] = useState(endOfMonth);
  const [dayCount, setDayCount] = useState(
    differenceInDays(endDate, startDate) + 1
  );
  useEffect(() => {
    setDayCount(differenceInDays(endDate, startDate) + 1);
  }, [startDate, endDate]);
  const { data: mealActivityData } = useSingleEmployeeMealActivity(
    formatDate(startDate, "yyyy-MM-dd"),
    dayCount.toString()
  );

  const getWeekData = () => {
    const historyData: Row[] = [];
    if (mealActivityData) {
      mealActivityData[0]?.employee_details?.forEach((employee: EmployeeEachDayMealDetails) => {
        const isHoliday = employee.holiday;
        const penalties = (employee.meal?.[0]?.meal_status?.[0]?.penaltyScore || 0) + 
                          (employee.meal?.[1]?.meal_status?.[0]?.penaltyScore || 0);
        const lunch_status=employee.meal?.[0]?.meal_status?.[0]?.status ?? false
        const snacks_status=employee.meal?.[1]?.meal_status?.[0]?.status ?? false

        historyData.push({
          date: employee.date || "No date",
          lunch_guest: employee.meal?.[0]?.meal_status?.[0]?.status
            ? `Yes(${employee.meal?.[0]?.meal_status?.[0]?.guest_count})`
            : `No(${employee.meal?.[0]?.meal_status?.[0]?.guest_count})`,
          snacks_guest: employee.meal?.[1]?.meal_status?.[0]?.status
            ? `Yes(${employee.meal?.[1]?.meal_status?.[0]?.guest_count})`
            : `No(${employee.meal?.[1]?.meal_status?.[0]?.guest_count})`,
          penalty : penalties,
          isHoliday,
          lunch_status,
          snacks_status,
        });
      });
    }
    return historyData;
  };

  const [totalMeal, setTotalMeal] = useState<any[]>([]);
  useEffect(() => {
    if (mealActivityData) {
        setLoading(false)
      const data = getWeekData();
      setTotalMeal(data);
    }
  }, [mealActivityData]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const daysInRange = calculateDaysInRange(startDate, endDate);
  const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
  const columns: Column[] = [
    {
      key: "date",
      label: "Date",
      render: (value,row) => {
              return (
                <span className="font-medium text-gray-700 text-left whitespace-nowrap">
                  {formatDate(new Date(value), "dd MMM")}{" "}
                  <span className={`${row.isHoliday?'text-red-600':'text-green-600'} font-semibold`}>
                    ({formatDate(new Date(value), "EEE")})
                  </span>
                </span>
              );
            },
            renderRow: (row) => {
              return row.isHoliday ? "bg-red-50" : "";
            },
    },
    {
      key: "lunch_guest",
      label: "Lunch(Guest No.)",
      render: (value, row) => (
        <span className={row.lunch_status ? "text-green-600" : "text-red-600"}>
          {value}
        </span>
      ),
    },
    {
      key: "snacks_guest",
      label: "Snacks(Guest No.)",
      render: (value, row) => (
        <span className={`font-normal ${row.lunch_status ? "text-green-600" : "text-red-600"}`}>
          {value}
        </span>
      ),
    },
    {
      key: "penalty",
      label: "Penalties",
    }
  ];
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold mb-4">Meal History</h2>
        <div className="mb-4 flex gap-4">
          <p className="font-semibold mt-1">Start Date</p>
          <input
            type="date"
            value={dayjs(startDate).format("YYYY-MM-DD")}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="border rounded px-2 py-1"
          />
          <p className="font-semibold mt-1">End Date</p>
          <input
            type="date"
            value={dayjs(endDate).format("YYYY-MM-DD")} // Format to YYYY-MM-DD
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Table Display */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && totalMeal.length > 0 ? (
        <Table columns={columns} data={totalMeal} />
      ) : (
        !loading &&
        !error && <p>No meal records found for the selected date range.</p>
      )}
    </div>
  );
};

export default MealHistory;

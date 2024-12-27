"use client";

import React, { useState } from "react";
import Table, { Column, Row } from "@/components/Table";
import { startOfWeek, endOfWeek, addDays, format } from "date-fns";

const MealPlanTable = () => {
  // Define columns
  const columns: Column[] = [
    { key: "date", label: "Date" },
    { key: "lunch", label: "Lunch" },
    {
      key: "lunchStatus",
      label: "Lunch Status",
      render: (value, row, rowIndex) => (
        <button
          onClick={() => toggleRowStatus(rowIndex, "lunchStatus")}
          className={`px-4 py-1 rounded ${
            value === 1 ? " text-green-500" : " text-red-500"
          }`}
        >
          {value === 1 ? "Yes" : "No"}
        </button>
      ),
    },
    { key: "lunchGuest", label: "Lunch Guest", editable: true },
    { key: "snacks", label: "Snacks" },
    {
      key: "snacksStatus",
      label: "Snacks Status",
      render: (value, row, rowIndex) => (
        <button
          onClick={() => toggleRowStatus(rowIndex, "snacksStatus")}
          className={`px-4 py-1 rounded ${
            value === 1 ? " text-green-500" : " text-red-500"
          }`}
        >
          {value === 1 ? "Yes" : "No"}
        </button>
      ),
    },
    { key: "snacksGuest", label: "Snacks Guest", editable: true },
  ];

  // State for data and week navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealStatus, setMealStatus] = useState(1); // Global meal status (1 = On, 0 = Off)

  // Calculate the current week's range
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Week starts on Monday
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  // Generate initial data for the current week
  const getWeekData = (startDate: Date): Row[] => {
    const weekData: Row[] = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      weekData.push({
        date: format(date, "EEE, MMM dd"),
        lunch: "Default Lunch",
        lunchStatus: 1,
        lunchGuest: "",
        snacks: "Default Snacks",
        snacksStatus: 1,
        snacksGuest: "",
      });
    }
    return weekData;
  };

  const [data, setData] = useState(getWeekData(startDate));

  // Handle global meal toggle
  const handleGlobalMealToggle = (isOn: boolean) => {
    setMealStatus(isOn ? 1 : 0); // Update global meal status
    const updatedData = data.map((row) => ({
      ...row,
      lunchStatus: isOn ? 1 : 0,
      snacksStatus: isOn ? 1 : 0,
    })); // Update all rows
    setData(updatedData);
  };

  // Handle row-specific toggle
  const toggleRowStatus = (rowIndex: number, key: string) => {
    const updatedData = [...data];
    updatedData[rowIndex][key] = updatedData[rowIndex][key] === 1 ? 0 : 1; // Toggle Yes/No
    setData(updatedData);
  };

  // Handle week navigation
  const handlePreviousWeek = () => {
    const newDate = addDays(currentDate, -7);
    setCurrentDate(newDate);
    setData(getWeekData(startOfWeek(newDate, { weekStartsOn: 1 })));
  };

  const handleNextWeek = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
    setData(getWeekData(startOfWeek(newDate, { weekStartsOn: 1 })));
  };

  // Handle row edit
  const handleEditRow = (updatedRow: Row, rowIndex: number) => {
    const updatedData = [...data];
    updatedData[rowIndex] = updatedRow;
    setData(updatedData);
  };

  return (
    <div className="p-4">
      

      {/* Global Meal Toggle */}
      <div className="flex items-center gap-x-4 mb-6">
      <p>Preferred Status</p>
        <label>
          <input
            type="radio"
            name="mealToggle"
            checked={mealStatus === 1}
            onChange={() => handleGlobalMealToggle(true)}
          />
          Meal On
        </label>
        <label>
          <input
            type="radio"
            name="mealToggle"
            checked={mealStatus === 0}
            onChange={() => handleGlobalMealToggle(false)}
          />
          Meal Off
        </label>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousWeek}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Previous Week
        </button>
        <h3 className="text-lg font-bold">
          {format(startDate, "MMMM dd, yyyy")} - {format(endDate, "MMMM dd, yyyy")}
        </h3>
        <button
          onClick={handleNextWeek}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next Week
        </button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={data}
        onEditRow={handleEditRow}
       
      />
    </div>
  );
};

export default MealPlanTable;

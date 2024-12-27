"use client"

import React, { useState } from "react";

import Table, {Column, Row} from "@/components/Table";
const MealPlan=()=>{
  const columns: Column[] = [
    { key: "date", label: "Date" },
    { key: "snacks", label: "Snacks", editable: true },
    { key: "lunch", label: "Lunch", editable: true },
  ];

  const getWeekDates = (startDate: Date): Row[] => {
    const week: Row[] = [];
    const currentDate = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      week.push({
        date: currentDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
        snacks: "",
        lunch: "",
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return week;
  };

  const [startDate, setStartDate] = useState(new Date());
  const [data, setData] = useState(getWeekDates(startDate));

  const handlePreviousWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setStartDate(newStartDate);
    setData(getWeekDates(newStartDate));
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    setStartDate(newStartDate);
    setData(getWeekDates(newStartDate));
  };

  const handleEditRow = (updatedRow: Row, rowIndex: number) => {
    const updatedData = [...data];
    updatedData[rowIndex] = updatedRow;
    setData(updatedData);
  };



  return(
    <div className="m-40">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousWeek}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Previous Week
        </button>
       
        <button
          onClick={handleNextWeek}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next Week
        </button>
      </div>
     <Table
        columns={columns}
        data={data}
        //onAddRow={() => {}} // Disable adding rows for this table
        //onDeleteRow={() => {}} // Disable deleting rows for this table
        onEditRow={handleEditRow}
      />
      <button className="mt-20 p-2 border rounded-md bg-blue-500 hover:bg-blue-600 text-white">Save changes</button>
    </div>
  )
}
export default MealPlan;
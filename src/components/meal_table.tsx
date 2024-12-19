"use client"

import React, { useState } from "react";
import { addDays, subDays, format } from "date-fns";


type Entries = Record<string, Record<string, string>>;

const MealTable = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [entries, setEntries] = useState<Entries>({});

  // Function to get the current week's dates
  const getWeekDates = () => {
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(startDate, i), "yyyy-MM-dd")
    );
  };

  // Navigate to the next week
  const nextWeek = () => {
    setStartDate(addDays(startDate, 7));
  };

  // Navigate to the previous week
  const prevWeek = () => {
    setStartDate(subDays(startDate, 7));
  };

  // Handle input changes
  const handleInputChange = (date:string, column: string, value: string) => {
    setEntries((prevEntries) => ({
      ...prevEntries,
      [date]: {
        ...prevEntries[date],
        [column]: value,
      },
    }));
  };

  const weekDates = getWeekDates();

  return (
    <div className="p-4 ms-40 mt-40">
      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={prevWeek}
        >
           <span className="text-lg">&#171;</span>
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={nextWeek}
        >
         <span className="text-lg">&raquo;</span> 
        </button>
      </div>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 w-[40vh]">Date</th>
            <th className="border border-gray-300 px-4 py-2 w-[40vh]">Lunch</th>
            <th className="border border-gray-300 px-4 py-2 w-[40vh]">Snacks</th>
          </tr>
        </thead>
        <tbody>
          {weekDates.map((date) => (
            <tr key={date}>
              <td className="border border-gray-300 px-4 py-2 text-center items-center">
                {format(new Date(date), "MMM dd, yyyy")}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={entries[date]?.col1 || ""}
                  className="w-full px-2 py-1 text-center"
                  onChange={(e) =>
                    handleInputChange(date, "col1", e.target.value)
                  }
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={entries[date]?.col2 || ""}
                  className="w-full px-2 py-1 text-center"
                  onChange={(e) =>
                    handleInputChange(date, "col2", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MealTable;

"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

type Row = {
  name: string;
  days: { [key: string]: { starred: boolean; toggle: boolean } };
};

const AdminDashTable = () => {
  const [data, setData] = useState<Row[]>([
    {
      name: "Alice",
      days: {
        Monday: { starred: false, toggle: false },
        Tuesday: { starred: false, toggle: false },
        Wednesday: { starred: false, toggle: false },
        Thursday: { starred: false, toggle: false },
        Friday: { starred: false, toggle: false },
        Saturday: { starred: false, toggle: false },
        Sunday: { starred: false, toggle: false },
      },
    },
    {
      name: "Bob",
      days: {
        Monday: { starred: false, toggle: false },
        Tuesday: { starred: false, toggle: false },
        Wednesday: { starred: false, toggle: false },
        Thursday: { starred: false, toggle: false },
        Friday: { starred: false, toggle: false },
        Saturday: { starred: false, toggle: false },
        Sunday: { starred: false, toggle: false },
      },
    },
  ]);

  const handleStarToggle = (rowIndex: number, day: string) => {
    const updatedData = [...data];
    updatedData[rowIndex].days[day].starred = !updatedData[rowIndex].days[day].starred;
    setData(updatedData);
  };

  const handleToggleChange = (rowIndex: number, day: string) => {
    const updatedData = [...data];
    updatedData[rowIndex].days[day].toggle = !updatedData[rowIndex].days[day].toggle;
    setData(updatedData);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-center">Name</th>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
              (day) => (
                <th key={day} className="border border-gray-300 px-4 py-2 bg-gray-100 text-center">
                  {day}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-300 px-4 py-2 text-center">{row.name}</td>
              {Object.keys(row.days).map((day) => (
                <td key={day} className="border border-gray-300 px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-x-5 ms-7">
                   
                    {/* Yes/No Toggle as Text */}
                    <span
                      onClick={() => handleToggleChange(rowIndex, day)}
                      className={`cursor-pointer `}
                    >
                      {row.days[day].toggle ? "1" : "0"}
                    </span>
                     {/* Star Icon */}
                     <FaStar
                      onClick={() => handleStarToggle(rowIndex, day)}
                      className={`cursor-pointer text-sm ${
                        row.days[day].starred ? "text-yellow-600" : "text-gray-300"
                      }`}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashTable;

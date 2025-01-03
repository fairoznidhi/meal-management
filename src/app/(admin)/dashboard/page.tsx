"use client";



import React, { useState } from "react";
import Table, { Column, Row } from "@/components/Table";
import SearchBar from "@/components/Search";
import TotalBox from "@/features/dashboard/TotalBox";
import TotalTable from "@/features/dashboard/TotalTable";
import { addDays, startOfWeek, endOfWeek, format } from "date-fns";

const Dashboard = () => {
  const employees = ["Alice", "Bob", "Charlie", "Diana","Guest"]; // Static employee names
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Define columns
  const columns: Column[] = [
    { key: "name", label: "Employee Name", editable: false },
    ...daysOfWeek.map((day) => ({ key: day.toLowerCase(), label: day, editable: true })),
  ];

  // Initialize data
  const initialData: Row[] = employees.map((name) => {
    const row: Row = { name };
    daysOfWeek.forEach((day) => {
      row[day.toLowerCase()] = 1; // Default value
    });
    return row;
  });

  const [data, setData] = useState(initialData);
  const [currentDate, setCurrentDate] = useState(new Date()); // Track the current date
  const [searchTerm, setSearchTerm] = useState(""); // Track the search term

  // Filter data based on the search term
  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the current week's range
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Week starts on Monday
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  const handleToggleCell = (rowIndex: number, key: string) => {
    const updatedData = [...data];
    updatedData[rowIndex][key] = updatedData[rowIndex][key] === 1 ? 0 : 1; // Toggle between 1 and 0
    setData(updatedData);
  };

  const handlePreviousWeek = () => {
    setCurrentDate((prevDate) => addDays(prevDate, -7)); // Move back by 7 days
  };

  const handleNextWeek = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 7)); // Move forward by 7 days
  };

  return (
    <div className="p-4">
      {/* SearchBar */}
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <div className="mt-10 p-2 bg-gray-100 w-96">
      <TotalBox></TotalBox>
      </div>
      <div >
        <select name="meal" id="meal" className="border bordre-black p-1 mt-20">
          <option value="1">Lunch</option>
          <option value="2">Snacks</option>
        </select>
      </div>
      {/*Navigation */}
      
            <div className="flex items-center justify-center mb-4 gap-x-2 mt-20">
                   <button
                     onClick={handlePreviousWeek}
                     className="p-2 text-base bg-gray-300 rounded-md hover:bg-gray-400"
                   >
                     <span className="text-lg">&#171;</span>
                   </button>
                   <h2 className="p-2 text-base font-bold me-2">
                     {format(startDate, "MMMM dd, yyyy")} - {format(endDate, "MMMM dd, yyyy")}
                   </h2>
                   <button
                     onClick={handleNextWeek}
                     className="p-2 text-base bg-gray-300 rounded-md hover:bg-gray-400"
                   >
                     <span className="text-lg">&raquo;</span> 
                   </button>
                 </div>
                  
      
      <Table
        columns={columns}
        data={filteredData}
       
      />

      <div className="mt-5">
        <TotalTable></TotalTable>
      </div>
      
    </div>
  );
};

export default Dashboard;

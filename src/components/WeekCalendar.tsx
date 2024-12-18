'use client'
import React, { useState, useRef, useEffect } from "react";
import { format, addDays, startOfWeek, endOfWeek, subWeeks, addWeeks } from "date-fns";

const WeekCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Static names
  const names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace","Guest"];

  // Get the start and end of the current week
  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday as the first day
  const endOfCurrentWeek = endOfWeek(currentWeek, { weekStartsOn: 1 });

  // Generate an array of dates for the week
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(startOfCurrentWeek, i));
  }
   // State for input values, initialized with 1 for all fields
  const [fields, setFields] = useState(
    names.map(() => weekDays.map(() => 1))
  );

  useEffect(() => {
    // Reset all fields to 1 whenever the week changes
    const newFields = names.map(() => weekDays.map(() => 1));
    setFields(newFields);
  }, [currentWeek]);

  // Refs for all input fields
  const inputRefs = useRef([]);


  // Handlers for navigation
  const handlePrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  // Update the value of a specific field
  const handleFieldChange = (nameIndex, dayIndex, value) => {
    const updatedFields = [...fields];
    updatedFields[nameIndex][dayIndex] = value;
    setFields(updatedFields);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, rowIndex, colIndex) => {
    const rows = names.length;
    const cols = weekDays.length;

    switch (e.key) {
      case "ArrowUp":
        if (rowIndex > 0) {
          inputRefs.current[(rowIndex - 1) * cols + colIndex].focus();
        }
        break;
      case "ArrowDown":
        if (rowIndex < rows - 1) {
          inputRefs.current[(rowIndex + 1) * cols + colIndex].focus();
        }
        break;
      case "ArrowLeft":
        if (colIndex > 0) {
          inputRefs.current[rowIndex * cols + (colIndex - 1)].focus();
        }
        break;
      case "ArrowRight":
        if (colIndex < cols - 1) {
          inputRefs.current[rowIndex * cols + (colIndex + 1)].focus();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4">
      {/* Navigation */}
      <div className="flex items-center justify-center mb-4 gap-x-2 ">
        <button
          onClick={handlePrevWeek}
          className="p-2 text-base bg-gray-300 rounded-md hover:bg-gray-400"
        >
          <span className="text-lg">&#171;</span>
        </button>
        <h2 className="p-2 text-base font-bold me-2">
          {format(startOfCurrentWeek, "MMMM dd, yyyy")} - {format(endOfCurrentWeek, "MMMM dd, yyyy")}
        </h2>
        <button
          onClick={handleNextWeek}
          className="p-2 text-base bg-gray-300 rounded-md hover:bg-gray-400"
        >
          <span className="text-lg">&raquo;</span> 
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-8 gap-2">
        {/* First Row: Empty Slot + Week Days */}
        <div className="bg-transparent"></div>
        {weekDays.map((day, index) => (
          <div key={index} className="p-4 border rounded-md text-base text-center font-bold">
            <p>{format(day, "EEEE")}</p>
           {/* <p>{format(day, "dd")}</p>*/}
          </div>
        ))}

        {/* Rows for Names */}
        {names.map((name, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Static Name Column */}
            <div className="border rounded-md bg-gray-100 text-base text-center font-bold w-40 h-10">
              {name}
            </div>
            {/* Fields for Each Day */}
            {weekDays.map((day, colIndex) => (
              <div key={colIndex} className="p-2 border rounded-md text-center items-center text-base w-40 h-10">
                <input
                   type="text"
                   value={fields[rowIndex]?.[colIndex] || ""} // Display the value
                   onChange={(e) =>
                     handleFieldChange(rowIndex, colIndex, e.target.value)
                   } // Allow editing
                   onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)} // Handle keyboard navigation
                   ref={(el) =>
                     (inputRefs.current[rowIndex * weekDays.length + colIndex] = el)
                   } // Assign ref
                
                  className="w-full h-6 p-2 mt-0 text-center"
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default WeekCalendar 




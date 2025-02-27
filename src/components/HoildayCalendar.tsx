"use client";

{/*import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { FaCaretSquareLeft, FaCaretSquareRight } from "react-icons/fa";

interface CalendarProps {
  onSelectDates: (dates: { date: string; remarks: string }[]) => void;
  onClose: () => void; // Function to close the calendar
  markedDates?: string[]; // Receive holiday dates as prop
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDates, onClose, markedDates = []  }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [selectedDates, setSelectedDates] = useState<{ date: string; remarks: string }[]>([]);
  
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Close the calendar if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose(); // Close calendar if outside is clicked
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const firstDayOfMonth = currentMonth.startOf("month").day();
  const daysInMonth = currentMonth.daysInMonth();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Navigate between months
  const goToPreviousMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const goToNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  // Handle date selection (toggle)
  const handleDateClick = (day: number) => {
    const formattedDate = currentMonth.date(day).format("YYYY-MM-DD");

    setSelectedDates((prevDates) => {
      const existingDate = prevDates.find((entry) => entry.date === formattedDate);

      if (existingDate) {
        return prevDates.filter((entry) => entry.date !== formattedDate); // Remove date if already selected
      } else {
        return [...prevDates, { date: formattedDate, remarks: "Holiday" }]; // Add date with default remark
      }
    });
  };

  // Update remarks for a specific date
  const handleRemarksChange = (date: string, newRemarks: string) => {
    setSelectedDates((prevDates) =>
      prevDates.map((entry) =>
        entry.date === date ? { ...entry, remarks: newRemarks } : entry
      )
    );
  };

  // Save selected dates with remarks
  const handleSave = () => {
    onSelectDates(selectedDates);
    onClose(); // Close calendar after saving
  };

  // Clear all selected dates
  const handleClearSelection = () => {
    setSelectedDates([]);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div
        ref={calendarRef}
        className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg"
      >
        {/* Header Navigation 
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <FaCaretSquareLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">{currentMonth.format("MMMM YYYY")}</h2>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <FaCaretSquareRight size={20} />
          </button>
        </div>

        {/* Weekdays 
        <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-700 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days 
        <div className="grid grid-cols-7 gap-1 text-sm">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="py-2"></div>
          ))}

          {daysArray.map((day) => {
            const formattedDate = currentMonth.date(day).format("YYYY-MM-DD");
            const isSelected = selectedDates.some((entry) => entry.date === formattedDate);
            const selectedEntry = selectedDates.find((entry) => entry.date === formattedDate);

            return (
              <div key={day} className="flex flex-col items-center">
                {/* Date Button 
                <button
                  onClick={() => handleDateClick(day)}
                  className={`h-10 w-full flex items-center justify-center rounded-lg transition-all ${
                    isSelected ? "bg-blue-500 text-white font-bold" : "bg-gray-50 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>

                {/* Input Field (only appears when date is selected) 
                {isSelected && (
                  <input
                    type="text"
                    value={selectedEntry?.remarks || ""}
                    onChange={(e) => handleRemarksChange(formattedDate, e.target.value)}
                    className="mt-2 w-full p-1 border border-gray-300 rounded text-sm"
                    placeholder="Enter remarks"
                  />
                )}
              </div>
            );
          })}
        </div>        {/* Show buttons only if at least one date is selected 
        {selectedDates.length > 0 && (
          <div className="flex justify-between mt-4">
            {/* Clear Selection Button 
            <button
              onClick={handleClearSelection}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
            >
              Clear Selection
            </button>

            {/* Save As Holiday Button 
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            >
              Save As Holiday
            </button>
          </div>
        )}


        {markedDates.map((date) => (
        <span key={date} className="bg-red-500 text-white px-2 py-1 rounded">
          {date}
        </span>
      ))}
    </div>




      </div>
    
  );
};

export default Calendar;


*/}


import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { FaCaretSquareLeft, FaCaretSquareRight } from "react-icons/fa";

interface CalendarProps {
  onSelectDates: (dates: { date: string; remarks: string }[]) => void;
  onClose: () => void; // Function to close the calendar
  markedDates?: string[]; // Holiday dates to be colored in red
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDates, onClose, markedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [selectedDates, setSelectedDates] = useState<{ date: string; remarks: string }[]>([]);
  
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Close the calendar if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose(); // Close calendar if outside is clicked
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const firstDayOfMonth = currentMonth.startOf("month").day();
  const daysInMonth = currentMonth.daysInMonth();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Navigate between months
  const goToPreviousMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const goToNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  // Handle date selection (toggle)
  const handleDateClick = (day: number) => {
    const formattedDate = currentMonth.date(day).format("YYYY-MM-DD");

    // Prevent modifying existing holiday dates (fetched ones)
    if (markedDates.includes(formattedDate)) return;

    setSelectedDates((prevDates) => {
      const existingDate = prevDates.find((entry) => entry.date === formattedDate);

      if (existingDate) {
        return prevDates.filter((entry) => entry.date !== formattedDate); // Remove date if already selected
      } else {
        return [...prevDates, { date: formattedDate, remarks: "Holiday" }]; // Add date with default remark
      }
    });
  };

  // Update remarks for a specific date
  const handleRemarksChange = (date: string, newRemarks: string) => {
    setSelectedDates((prevDates) =>
      prevDates.map((entry) =>
        entry.date === date ? { ...entry, remarks: newRemarks } : entry
      )
    );
  };

  // Save selected dates with remarks
  const handleSave = () => {
    onSelectDates(selectedDates);
    onClose(); // Close calendar after saving
  };

  // Clear all selected dates
  const handleClearSelection = () => {
    setSelectedDates([]);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div ref={calendarRef} className="w-full max-w-md p-4 bg-white shadow-lg rounded-lg">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-200">
            <FaCaretSquareLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">{currentMonth.format("MMMM YYYY")}</h2>
          <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-200">
            <FaCaretSquareRight size={20} />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-700 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 text-sm">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="py-2"></div>
          ))}

          {daysArray.map((day) => {
            const formattedDate = currentMonth.date(day).format("YYYY-MM-DD");
            const isSelected = selectedDates.some((entry) => entry.date === formattedDate);
            const isMarked = markedDates.includes(formattedDate);
            const selectedEntry = selectedDates.find((entry) => entry.date === formattedDate);

            return (
              <div key={day} className="flex flex-col items-center">
                {/* Date Button */}
                <button
                  onClick={() => handleDateClick(day)}
                  className={`h-10 w-full flex items-center justify-center rounded-lg transition-all ${
                    isMarked ? "bg-red-500 text-white font-bold" : // Fetched holidays (red)
                    isSelected ? "bg-blue-500 text-white font-bold" : // Newly selected dates (blue)
                    "bg-gray-50 hover:bg-gray-200" // Default styling
                  }`}
                >
                  {day}
                </button>

                {/* Input Field (only appears when date is selected) */}
                {isSelected && (
                  <input
                    type="text"
                    value={selectedEntry?.remarks || ""}
                    onChange={(e) => handleRemarksChange(formattedDate, e.target.value)}
                    className="mt-2 w-full p-1 border border-gray-300 rounded text-sm"
                    placeholder="Enter remarks"
                  />
                )}
              </div>
            );
          })}
        </div>        

        {/* Show buttons only if at least one date is selected */}
        {selectedDates.length > 0 && (
          <div className="flex justify-between mt-4">
            {/* Clear Selection Button */}
            <button
              onClick={handleClearSelection}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
            >
              Clear Selection
            </button>

            {/* Save As Holiday Button */}
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            >
              Save As Holiday
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;

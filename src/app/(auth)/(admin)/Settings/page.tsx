"use client"

import React, { useState, useEffect } from "react";
import Calendar from "@/components/HoildayCalendar"; // Make sure this component supports `markedDates`
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";
import notificationToast from "@/components/notificationToast";
import { FaCalendar, FaList } from "react-icons/fa";

const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

interface Holiday {
  id: number;
  date: string;
  Remarks: string;
}

const SettingsComponent = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isHolidayListOpen, setIsHolidayListOpen] = useState(false);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDates, setSelectedDates] = useState<{ date: string; remarks: string }[]>([]);

  // Fetch holidays on component mount
  useEffect(() => {
    fetchHolidays();
  }, []);

  // Fetch holidays from API
  const fetchHolidays = async () => {
    try {
      const response = (await request({
        url: "/holiday",
        method: "GET",
        useAuth: true,
      })) as Holiday[];

      setHolidays(response);
    } catch (err: any) {
      console.error("Error fetching holidays:", err);
    }
  };

  // Handle date selection from calendar
  const handleDateSelection = async (dates: { date: string; remarks: string }[]) => {
    setSelectedDates(dates);
    setIsCalendarOpen(false); // Close calendar after saving

    try {
      await request({
        url: "/holiday",
        method: "POST",
        useAuth: true,
        data: dates,
      });

      notificationToast("Selected Dates Saved Successfully", "success");

      // Fetch updated holidays after saving new ones
      fetchHolidays();
    } catch (err: any) {
      console.error("Error saving selected dates:", err);
      notificationToast("Error Saving Selected Dates", "error");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100">
      <p className="font-bold text-3xl absolute top-4 left-20 ms-40">Settings</p>

      {/* Set Holidays Button */}
      <div className="flex flex-col w-full h-[40vh] rounded shadow-md">
        <p className="text-2xl font-bold mt-5 mb-5 ms-10">Holidays</p>
        
      <button
        onClick={() => setIsCalendarOpen(true)}
        className="absolute flex top-32 ms-20 bg-transparent p-2 text-gray-700 hover:text-gray-900 text-xl"
      >
        <span className="me-2 mt-1"><FaList/></span>
          Set Holidays
      </button>

      {/* See Holiday List Button */}
      <button
        onClick={() => setIsHolidayListOpen(true)}
        className="absolute flex top-48 ms-20 bg-transparent p-2 text-gray-700 hover:text-gray-900 text-xl"
      >
        <span className="me-2 mt-1"><FaCalendar/></span>
          See Holiday List
      </button>
      </div>
      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <Calendar
              onSelectDates={handleDateSelection}
              onClose={() => setIsCalendarOpen(false)}
              markedDates={holidays.map((holiday) => holiday.date)} // Pass holiday dates
            />
          </div>
        </div>
      )}

      {/* Holiday List Modal */}
      {isHolidayListOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-96 max-h-[80vh] overflow-auto">
            <h2 className="text-lg font-bold mb-4">Holiday List</h2>
            {holidays.length > 0 ? (
              <ul className="list-disc pl-5">
                {holidays.map((holiday) => (
                  <li key={holiday.id} className="mb-2">
                    <strong>{holiday.date}</strong>: {holiday.Remarks}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No holidays found.</p>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsHolidayListOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsComponent;

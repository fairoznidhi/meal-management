"use client";

import React, { useState } from "react";
import Calendar from "@/components/HoildayCalendar";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";
import notificationToast from "@/components/notificationToast";

const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

const SettingsComponent = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ date: string; remarks: string }[]>([]);

  // Function to handle date selection from Calendar
  const handleDateSelection = async (dates: { date: string; remarks: string }[]) => {
    setSelectedDates(dates);
    setIsCalendarOpen(false); // Close calendar after saving

    try {
      const response = await request({
        url: "/holiday",
        method: "POST",
        useAuth: true,
        data: dates, // ✅ Sending array of objects
      });

      console.log("API Response:", response);
      notificationToast("Selected Dates Saved Successfully", "success");
    } catch (err: any) {
      console.error("Error sending selected dates:", err);
      notificationToast("Error Saving Selected Dates", "error");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-100">
      <p className="font-bold text-3xl absolute top-4 left-4">Settings</p>
      {/* Transparent Button in Upper Left */}
      <button
        onClick={() => setIsCalendarOpen(true)}
        className="absolute top-24 left-4 bg-transparent p-2 text-gray-700 hover:text-gray-900 text-3xl"
      >
        📅 Set Holidays
      </button>



      {/*<button
        onClick={() => setIsCalendarOpen(true)}
        className="absolute top-48 left-4 bg-transparent p-2 text-gray-700 hover:text-gray-900 text-3xl"
      >
        📅 See Holiday List
      </button>*/}



      {/* Show Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <Calendar onSelectDates={handleDateSelection} onClose={() => setIsCalendarOpen(false)}/>
            
          </div>
        </div>
      )}

      
    </div>
  );
};

export default SettingsComponent;

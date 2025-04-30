"use client"

import React, { useState, useEffect, useRef } from "react";
import Calendar from "@/components/HoildayCalendar";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";
import notificationToast from "@/components/notificationToast";
import { FaCalendar, FaList, FaTrash } from "react-icons/fa";
import DepartmentSettings from "@/features/settings/department/DepartmentSettings";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSelection, setDeleteSelection] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchHolidays();
  }, []);

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

  const handleDateSelection = async (dates: { date: string; remarks: string }[]) => {
    setSelectedDates(dates);
    setIsCalendarOpen(false);

    try {
      await request({
        url: "/holiday",
        method: "POST",
        useAuth: true,
        data: dates,
      });

      notificationToast("Selected Dates Saved Successfully", "success");
      fetchHolidays();
    } catch (err: any) {
      console.error("Error saving selected dates:", err);
      notificationToast("Error Saving Selected Dates", "error");
    }
  };

  const handleDeleteHolidays = async () => {
    const selectedId = Array.from(deleteSelection)[0]; 
    const selectedHoliday = holidays.find(holiday => holiday.id === selectedId);
  
    if (!selectedHoliday) {
      notificationToast("No holiday selected", "error");
      return;
    }
  
    try {
      await request({
        url: `/holiday`,
        method: "DELETE",
        useAuth: true,
        params: { date: selectedHoliday.date }, 
      });
  
      notificationToast("Selected Holiday Deleted", "success");
      setDeleteSelection(new Set());
      setIsDeleting(false);
      fetchHolidays();
    } catch (err: any) {
      console.error("Error deleting holiday:", err);
      notificationToast("Error Deleting Holiday", "error");
    }
  };
  

  const toggleSelection = (id: number) => {
    setDeleteSelection((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100">
      <p className="font-bold text-3xl absolute top-4 left-20 ms-40">Settings</p>

      <div className="flex flex-col w-full h-[200px] rounded shadow-md">
        <p className="text-2xl font-bold mt-5 mb-5 ms-10">Holidays</p>

        <button
          onClick={() => setIsCalendarOpen(true)}
          className="absolute flex top-32 ms-20 bg-transparent p-2 text-gray-700 hover:text-gray-900 text-xl"
        >
          <span className="me-2 mt-1"><FaList /></span>
          Set Holidays
        </button>

        <button
          onClick={() => setIsHolidayListOpen(true)}
          className="absolute flex top-48 ms-20 bg-transparent p-2 text-gray-700 hover:text-gray-900 text-xl"
        >
          <span className="me-2 mt-1"><FaCalendar /></span>
          See Holiday List
        </button>
      </div>

      <div className="flex flex-col w-full h-[200px] rounded shadow-md">
        <p className="text-2xl font-bold mt-5 mb-5 ms-10">Department</p>
        <DepartmentSettings/>
      </div>

      {isCalendarOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <Calendar
              onSelectDates={handleDateSelection}
              onClose={() => setIsCalendarOpen(false)}
              markedDates={holidays.map((holiday) => holiday.date)}
            />
          </div>
        </div>
      )}

      {isHolidayListOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-96 max-h-[80vh] overflow-auto">
            <h2 className="text-lg font-bold mb-4">Holiday List</h2>

            {holidays.length > 0 ? (
              <>
                <ul className="pl-1">
                  {holidays.map((holiday) => (
                    <li key={holiday.id} className="mb-2 flex justify-between items-center">
                      <span>
                        <strong>{holiday.date}</strong>: {holiday.Remarks}
                      </span>
                      {isDeleting && (
                        <input
                          type="checkbox"
                          className="form-checkbox rounded-full w-4 h-4 text-red-500"
                          checked={deleteSelection.has(holiday.id)}
                          onChange={() => toggleSelection(holiday.id)}
                        />
                      )}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-x-8">
                {!isDeleting && (
              <button
                onClick={() => setIsHolidayListOpen(false)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-[100px]"
              >
                Close
              </button>
            )}
             <div className="mt-4 flex justify-between gap-x-8">
                  {!isDeleting ? (
                    <button
                      onClick={() => setIsDeleting(true)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <FaTrash /> Delete Holidays
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleDeleteHolidays}
                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                        disabled={deleteSelection.size !== 1}
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleting(false);
                          setDeleteSelection(new Set());
                        }}
                        className="bg-gray-300 px-4 py-2 rounded-md"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>

                </div>
               

                
              </>
            ) : (
              <p className="text-gray-500">No holidays found.</p>
            )}

            
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsComponent;

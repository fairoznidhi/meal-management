"use client";

import React, { useState, useEffect } from "react";
import { baseRequest } from "@/services/HttpClientAPI";
import MealStatusModal from "@/features/dashboard/MealStatusModal";
import Search from "@/components/Search";
import TotalBox from "@/features/dashboard/TotalBox";

const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

interface MealStatus {
  status: boolean;
  guest_count: number;
  penalty: boolean;
}

interface Meal {
  meal_type: number;
  meal_status: MealStatus[];
}

interface EmployeeDetail {
  date: string;
  holiday: boolean;
  meal: Meal[];
}

interface MealActivityData {
  employee_id: number;
  employee_name: string;
  employee_details: EmployeeDetail[];
}

const MealActivityComponent = () => {
  const [mealActivityData, setMealActivityData] = useState<MealActivityData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date()); // Use Date object for easy manipulation
  const [days, setDays] = useState<number>(7);
  const [mealType, setMealType] = useState<number>(1); // 1 for lunch, 2 for snack
  const [searchTerm,setSearchTerm]= useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    employeeId: number;
    employeeName: string;
    date: string;
    currentStatus: boolean | null;
    currentPenalty: boolean;
  } | null>(null);

  const generateDates = (start: Date, days: number) => {
    const dates: string[] = [];
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      dates.push(currentDate.toISOString().split("T")[0]);
      
    }
    return dates;
  };

  const fetchMealActivity = async () => {
    try {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const response: MealActivityData[] = await request({
        url: "/meal_activity/admin",
        method: "GET",
        params: { start: formattedStartDate, days },
        useAuth: true,
      });
      setMealActivityData(response);
    } catch (err: any) {
      console.error("Error fetching meal activity:", err);
      setError(err.response?.data?.message || "Failed to fetch meal activity.");
    }
  };

  const calculateTotalGuestsPerDay = () => {
    const totalGuests: Record<string, number> = {};
  
    mealActivityData.forEach((employee) => {
      employee.employee_details.forEach((detail) => {
        const meal = detail.meal[mealType - 1]; // Select the correct meal type (1 = Lunch, 2 = Snack)
        const guestCount = meal?.meal_status[0]?.guest_count || 0; // Get guest count, default to 0
  
        if (!totalGuests[detail.date]) {
          totalGuests[detail.date] = 0;
        }
        totalGuests[detail.date] += guestCount; // Accumulate guest count
      });
    });
  
    return totalGuests;
  };
  
  const totalGuestsPerDay = calculateTotalGuestsPerDay();
  


  useEffect(() => {
    fetchMealActivity();
  }, [startDate, days]);

  const dates = generateDates(startDate, days);

  const handleCellClick = (
    employeeId: number,
    employeeName: string,
    date: string,
    currentStatus: boolean | null,
    currentPenalty: boolean
  ) => {
    setSelectedCell({
      employeeId,
      employeeName,
      date,
      currentStatus: currentStatus ?? null, // Ensure null is passed if no status exists
      currentPenalty: currentPenalty ?? false, // Default penalty to false if undefined
    });
    setModalOpen(true);
  };
  

  const handleUpdateStatus = async (status: boolean, penalty: boolean) => {
    if (selectedCell) {
      const { employeeId, date } = selectedCell;
      const guestCount = 0;

      const updatedData = [
        {
          employee_id: employeeId,
          date,
          meal_type: mealType,
          status: status,
          guest_count: guestCount,
          penalty,
        },
      ];

      try {
        await request({
          url: "/meal_activity/group-update",
          method: "PATCH",
          data: updatedData,
          useAuth: true,
        });

        fetchMealActivity();
        setModalOpen(false);
      } catch (err) {
        console.error("Error updating meal status:", err);
      }
    }
  };

  const handleMealTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMealType(Number(event.target.value));
  };

  const handlePreviousWeek = () => {
    setStartDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7); // Go back 7 days
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setStartDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7); // Go forward 7 days
      return newDate;
    });
  };
   const filteredData= mealActivityData.filter((employee)=>
  employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase()));


  return (
    <div className="p-4">
      <div className="absolute justify-between mb-7"><TotalBox></TotalBox></div>
      <div className="flex justify-between items-center mb-4 gap-x-2 mt-40">
      <div className="mb-4">
        <label className="mr-2">Select Meal Type: </label>
        <select
          value={mealType}
          onChange={handleMealTypeChange}
          className="p-2 border rounded bg-[#779ECB]"
        >
          <option value={1}>Lunch</option>
          <option value={2}>Snack</option>
        </select>
      </div>
      <div className="flex gap-x-2">
      <button
                     onClick={handlePreviousWeek}
                     className="p-2 text-base bg-[#779ECB] rounded-md hover:bg-[#D7DFE9] ms-6"
                   >
                     <span className="text-lg">&#171;</span>
                   </button>
                   <h2 className="p-2 text-base font-bold me-2">
                   {`Start Date: ${startDate.toISOString().split("T")[0]}`}
                   </h2>
                   <button
                     onClick={handleNextWeek}
                     className="p-2 text-base bg-[#779ECB] rounded-md hover:bg-[#D7DFE9]"
                   >
                     <span className="text-lg">&raquo;</span> 
                   </button>
        </div>
        <div><Search searchTerm={searchTerm} onSearchChange={setSearchTerm}></Search></div>
      </div>

     

      {error && <p className="text-red-500">Error: {error}</p>}
      {filteredData.length === 0 ? (
        <p>Loading or no data available...</p>
      ) : (
        <div className="overflow-y-auto sm:max-h-[400px] md:max-h-[500px] lg:max-h-[650px] max-lg:max-h-[800px]">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="sticky top-0 bg-white z-10 shadow-md">
            <tr className="border">
              <th className="p-2 text-center">Employee Name</th>
              {dates.map((date, index) => (
                <th key={index} className="p-2">
                  <div>{date}</div>
                  <div className="text-xs text-gray-600">Guests: {totalGuestsPerDay[date] || 0}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((employee) => {
              const dateStatusMap: Record<
                string,
                { status: boolean; holiday: boolean; penalty: boolean }
              > = {};
              employee.employee_details.forEach((detail) => {
                const meal = detail.meal[mealType - 1]; // Use the selected meal type
                const status = meal?.meal_status[0]?.status;
                const penalty = meal?.meal_status[0]?.penalty || false;
                dateStatusMap[detail.date] = {
                  status,
                  holiday: detail.holiday,
                  penalty,
                };
              });

              return (
                <tr key={employee.employee_id}>
                  <td className="border border-gray-500 p-2 text-center">{employee.employee_name}</td>
                  {dates.map((date, index) => {
                    const cellData = dateStatusMap[date] || {
                      status: null,
                      holiday: false,
                      penalty: false,
                    };

                    let cellStyle = "border border-gray-500 p-2 text-center";
                    let statusText = "-";
                    let textColor = "text-black";

                    if (cellData.holiday) {
                      cellStyle += " bg-blue-100";
                    } else if (cellData.penalty) {
                      cellStyle += " bg-red-200";
                    }

                    if (cellData.status === true) {
                      statusText = "Yes";
                      textColor = "text-green-500";
                    } else if (cellData.status === false) {
                      statusText = "No";
                      textColor = "text-red-500";
                    }

                    return (
                      <td
                        key={index}
                        className={`${cellStyle} ${textColor}`}
                        onClick={() =>
                          handleCellClick(
                            employee.employee_id,
                            employee.employee_name,
                            date,
                            cellData.status,
                            cellData.penalty
                          )
                        }
                      >
                        {statusText}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          
          </tbody>
        </table>
        </div>
      )}

      <MealStatusModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        initialStatus={selectedCell?.currentStatus??false}
        initialPenalty={selectedCell?.currentPenalty || false}
        selectedDate={selectedCell?.date??""}
      />
    </div>
  );
};

export default MealActivityComponent;
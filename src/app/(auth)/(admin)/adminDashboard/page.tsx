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
  const [lunchTotal, setLunchTotal] = useState<number | null>(null);
  const [snacksTotal, setSnacksTotal] = useState<number | null>(null);
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
 const fetchTotallunch=async()=>{
  const today=new Date();
  const formattedDate = today.toISOString().split("T")[0];
  try{
    const response= await request({
      url:"/meal_activity/total-meal",
      method:"PATCH",
      data:{
        date:formattedDate,
        meal_type:1,
      },
      useAuth:true,
    })as number;
    setLunchTotal(response);
  }catch(err:any){
    console.log("Error Fetching Lunch");
  }
 }

 const fetchTotalSnacks=async()=>{
  const today=new Date();
  const formattedDate = today.toISOString().split("T")[0];
  try{
    const response=await request({
      url:"/meal_activity/total-meal",
      method:"PATCH",
      data:{
        date:formattedDate,
        meal_type:2,
      },
      useAuth:true,
    })as number;
    setSnacksTotal(response); 
  }catch(err:any){
    console.log("Error Fetching Lunch");
  }
 }

  {/*const createMealPlan = async () => {
    try {
      await request({
        url: "meal_activity",
        method: "POST",
        useAuth: true,
      });
    } catch (err: any) {
      console.error("Error creating meal plan:", err);
    }
  };*/}



  const fetchMealActivity = async () => {
    try {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const response = await request({
        url: "/meal_activity/admin",
        method: "GET",
        params: {start: formattedStartDate, days},
        useAuth: true,
      }) as MealActivityData[]|null;
      if (response) {
        // If response is not null, update state
        setMealActivityData(response);
      } else {
        // Handle case where response is null
        setMealActivityData([]); // Set an empty array or appropriate fallback value
        console.warn("Meal activity data is empty.");
      }
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
  


  {/*useEffect(() => {
    fetchMealActivity();
  }, [startDate, days]);*/}


  useEffect(() => {
    const initializeMealPlan = async () => {
      try {
        //await createMealPlan(); // First, create the meal plan
        await fetchMealActivity(); // Then, fetch the meal activity
        await fetchTotallunch();
        await fetchTotalSnacks();
      } catch (error) {
        console.error("Error initializing meal plan:", error);
      }
    };
  
    initializeMealPlan();
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
        // Immediately fetch updated totals
      await fetchTotallunch();
      await fetchTotalSnacks();
        setModalOpen(false);
      } catch (err) {
        console.error("Error updating meal status:", err);
      }
    }
  };
 
  
  
  const handleMealTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMealType(Number(event.target.value));
  };

  {/*const handlePreviousWeek = () => {
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
  };*/}




  // Function to get the boundary (one month before or after today's date)
const getMonthBoundary = (direction: "previous" | "next") => {
  const today = new Date();
  const newDate = new Date(today);
  
  if (direction === "previous") {
    newDate.setMonth(today.getMonth() - 1); // Go one month back
  } else if (direction === "next") {
    newDate.setMonth(today.getMonth() + 1); // Go one month forward
  }

  // Set the time to midnight to avoid issues with time comparison
  newDate.setHours(0, 0, 0, 0);

  return newDate;
};

// Handle previous week navigation
const handlePreviousWeek = () => {
  setStartDate((prev) => {
    const newDate = new Date(prev);
    newDate.setDate(prev.getDate() - 7); // Go back 7 days

    // Prevent going before one month before today
    const oneMonthBeforeToday = getMonthBoundary("previous");
    if (newDate < oneMonthBeforeToday) {
      return oneMonthBeforeToday; // Set to the one month before today if it exceeds
    }

    return newDate;
  });
};

// Handle next week navigation
const handleNextWeek = () => {
  setStartDate((prev) => {
    const newDate = new Date(prev);
    newDate.setDate(prev.getDate() + 7); // Go forward 7 days

    // Prevent going beyond one month after today
    const oneMonthAfterToday = getMonthBoundary("next");
    if (newDate > oneMonthAfterToday) {
      return oneMonthAfterToday; // Set to the one month after today if it exceeds
    }

    return newDate;
  });
};




   const filteredData= mealActivityData.filter((employee)=>
  employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase()));


  return (
    <div className="p-4">
      {/*<div className="absolute justify-between mb-7"><TotalBox></TotalBox></div>*/}

      <div className="flex gap-x-5 mb-4">
  <div className="p-4 bg-blue-200 rounded-md shadow-md">
    <h3 className="text-lg font-semibold">Today's Total Lunch</h3>
    <p className="text-xl">{lunchTotal !== null ? lunchTotal : "Loading..."}</p>
  </div>
  
  <div className="p-4 bg-green-200 rounded-md shadow-md">
    <h3 className="text-lg font-semibold">Today's Total Snacks</h3>
    <p className="text-xl">{snacksTotal !== null ? snacksTotal : "Loading..."}</p>
  </div>
</div>



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
          <thead className="">
            <tr className="border border-black">
              <th className="p-2 text-center">Employee Name</th>
              {dates.map((date, index) => (
                <th key={index} className="p-2 border border-black">
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





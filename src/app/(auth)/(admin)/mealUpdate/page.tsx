"use client";

import Search from "@/components/Search";
import MealStatusModal from "@/features/dashboard/MealStatusModal";
import React, { useEffect, useState } from "react";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";

import InstantGuest from "@/features/dashboard/InstantGuest";
import { FaCaretSquareLeft, FaCaretSquareRight } from "react-icons/fa";
import dayjs from "dayjs";

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
type totalmeal = {
  date: string;
  count: number;
};
const MealActivityComponent = () => {
  const [mealActivityData, setMealActivityData] = useState<MealActivityData[]>(
    []
  );
  const [lunchTotal, setLunchTotal] = useState<number | null>(null);
  const [snacksTotal, setSnacksTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date()); 
  const [endDate, setEndDate]= useState(dayjs(startDate).add(6,"day").format("YYYY-MM-DD"));// Use Date object for easy manipulation
  const [days, setDays] = useState<number>(7);
  const [mealType, setMealType] = useState<number>(1); // 1 for lunch, 2 for snack
  useEffect(()=>{
    const val=localStorage.getItem("MealType");
    if(val){
      setMealType(parseInt(val));
    }
  },[mealType])
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [lunchGuestsToday, setLunchGuestsToday] = useState<number>(0);
  const [snackGuestsToday, setSnackGuestsToday] = useState<number>(0);
  const [penaltyScore, setPenaltyScore] = useState<number>(0);
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
  const fetchTotallunch = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    try {
      const response = (await request({
        url: "/meal_activity/total-meal-group",
        method: "PATCH",
        data: {
          date: formattedDate,
          meal_type: 1,
          days: 1,
        },
        useAuth: true,
      })) as totalmeal[];
      setLunchTotal(response[0].count);
    } catch (err: any) {
      console.log("Error Fetching Lunch");
    }
  };

  const fetchTotalSnacks = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    try {
      const response = (await request({
        url: "/meal_activity/total-meal-group",
        method: "PATCH",
        data: {
          date: formattedDate,
          meal_type: 2,
          days: 1,
        },
        useAuth: true,
      })) as totalmeal[];
      setSnacksTotal(response[0].count);
    } catch (err: any) {
      console.log("Error Fetching Lunch");
    }
  };

  {
    /*const createMealPlan = async () => {
    try {
      await request({
        url: "meal_activity",
        method: "POST",
        useAuth: true,
      });
    } catch (err: any) {
      console.error("Error creating meal plan:", err);
    }
  };*/
  }

  const fetchMealActivity = async () => {
    try {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const response = (await request({
        url: "/meal_activity/admin",
        method: "GET",
        params: { start: formattedStartDate, days },
        useAuth: true,
      })) as MealActivityData[] | null;
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

  {
    /*const calculateTotalGuestsPerDay = () => {
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
  };*/
  }

  const calculateTotalGuestsPerDay = () => {
    const lunchGuests: Record<string, number> = {};
    const snackGuests: Record<string, number> = {};

    mealActivityData.forEach((employee) => {
      employee.employee_details.forEach((detail) => {
        const lunchMeal = detail.meal.find((m) => m.meal_type === 1);
        const snackMeal = detail.meal.find((m) => m.meal_type === 2);

        // Accumulate lunch guest count
        if (lunchMeal) {
          const guestCount = lunchMeal.meal_status[0]?.guest_count || 0;
          const lunchCount = lunchMeal.meal_status[0].status?1:0
          lunchGuests[detail.date] =
            (lunchGuests[detail.date] || 0) + guestCount+lunchCount;
        }

        // Accumulate snack guest count
        if (snackMeal) {
          const guestCount = snackMeal.meal_status[0]?.guest_count || 0;
          const snacksCount =snackMeal.meal_status[0]?.status?1:0;
          snackGuests[detail.date] =
            (snackGuests[detail.date] || 0) + guestCount + snacksCount;
        }
      });
    });

    return { lunchGuests, snackGuests };
  };

  const totalGuestsPerDay = calculateTotalGuestsPerDay();

  {
    /*useEffect(() => {
    fetchMealActivity();
  }, [startDate, days]);*/
  }

  {
    /*useEffect(() => {
    {/*const initializeMealPlan = async () => {
      try {
        //await createMealPlan(); // First, create the meal plan
        await fetchMealActivity(); // Then, fetch the meal activity
        await fetchTotallunch(); // Fetch lunch total
      await fetchTotalSnacks(); // Fetch snack total
      } catch (error) {
        console.error("Error initializing meal plan:", error);
      }
    };
    const initializeMealPlan = async () => {
      try {
        const [mealData, lunchTotal, snackTotal] = await Promise.all([
          fetchMealActivity(),
          fetchTotallunch(),
          fetchTotalSnacks()
        ]);
        // handle data...
      } catch (error) {
        console.error("Error initializing meal plan:", error);
      }
    };
  
    initializeMealPlan();
  }, [startDate, days,fetchMealActivity]);
  */
  }

  useEffect(() => {
    const initializeMealPlan = async () => {
      try {
        // Fetch data asynchronously in parallel
        await Promise.all([
          fetchMealActivity(),
          fetchTotallunch(),
          fetchTotalSnacks(),
        ]);
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
    currentPenalty: boolean,
  
  ) => {
    setSelectedCell({
      employeeId,
      employeeName,
      date,
      currentStatus: currentStatus ?? null, // Ensure null is passed if no status exists
      currentPenalty: currentPenalty ?? false,
    });
    setModalOpen(true);
  };

  const calculateTotalGuestsForToday = () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    let lunchGuests = 0;
    let snackGuests = 0;

    mealActivityData.forEach((employee) => {
      employee.employee_details.forEach((detail) => {
        if (detail.date === today) {
          // Check if this entry is for today
          detail.meal.forEach((meal) => {
            const mealGuestCount = meal.meal_status.reduce(
              (sum, status) => sum + (status.guest_count || 0),
              0
            );

            if (meal.meal_type === 1) {
              lunchGuests += mealGuestCount; // Accumulate lunch guests
            } else if (meal.meal_type === 2) {
              snackGuests += mealGuestCount; // Accumulate snack guests
            }
          });
        }
      });
    });

    return { lunchGuests, snackGuests };
  };

  const handleUpdateStatus = async (status: boolean, penalty: boolean, penaltyScore: number) => {
    if (selectedCell) {
      const { employeeId, date} = selectedCell;
      const guestCount = 0;
      const updatedData = [
        {
          employee_id: employeeId,
          date,
          meal_type: mealType,
          status: status,
          guest_count: guestCount,
          penalty,
          penalty_score:penaltyScore
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

  const handleMealTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const val=Number(event.target.value);
    localStorage.setItem("MealType",val.toString())
    setMealType(Number(event.target.value));
  };

  {
    /*const handlePreviousWeek = () => {
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
  };*/
  }

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

      // Set endDate to 6 days after new start date
    const newEndDate = dayjs(newDate).add(6, "day").format("YYYY-MM-DD");
    setEndDate(newEndDate); // Update endDate state

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
      // Set endDate to 6 days after new start date
    const newEndDate = dayjs(newDate).add(6, "day").format("YYYY-MM-DD");
    setEndDate(newEndDate); // Update endDate state
      return newDate;
    });
  };

  const handleBothUpdates = () => {
    fetchTotallunch();
    fetchTotalSnacks();
  };

  const filteredData = mealActivityData.filter((employee) =>
    employee.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGuests = calculateTotalGuestsForToday();
  //setTotalGuestsToday(totalGuests);

  const { lunchGuests, snackGuests } = calculateTotalGuestsPerDay();
  const todayDate = new Date().toISOString().split("T")[0]; // Format today's date as YYYY-MM-DD
  const lunchGuestsT = lunchGuests[todayDate] || 0;
  const snacksGuestsT = snackGuests[todayDate] || 0;

  return (
    <div className="p-4">
      <div className="bg-stone-50 p-2 mt-2 rounded-lg">
        <div className="flex items-center mb-2 my-2 relative">
          <div className="flex items-center">
            <label className="mx-2">Select Meal Type: </label>
            <select
              value={mealType}
              onChange={handleMealTypeChange}
              className="px-2 py-1 border rounded bg-[#f4f4f4]"
            >
              <option value={1}>Lunch</option>
              <option value={2}>Snack</option>
            </select>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
            <button
              onClick={handlePreviousWeek}
              className="px-4 text-gray-300 text-4xl rounded hover:text-gray-400"
            >
              <FaCaretSquareLeft />
            </button>
            <h2 className="p-2 text-base font-bold">
             { /*{`Start Date: ${
              startDate.toISOString().split("T")[0]
            }`}*/}
            {dayjs(startDate).format("DD MMM")}-{dayjs(endDate).format("DD MMM")}</h2>
            <button
              onClick={handleNextWeek}
              className="px-4 text-gray-300 text-4xl rounded hover:text-gray-400"
            >
              <FaCaretSquareRight />
            </button>
          </div>

          <div className="ml-auto">
            <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
        </div>

        {error && <p className="text-red-500">Error: {error}</p>}
        {filteredData.length === 0 ? (
          <span className="loading loading-dots loading-lg"></span>
        ) : (
          <div className="overflow-y-auto sm:max-h-[400px] md:max-h-[500px] lg:max-h-[650px] max-lg:max-h-[800px] rounded-t-lg overflow-hidden">
            <table className="table-auto w-full rounded-t-lg">
              <thead className="bg-gray-200 border-gray-200 rounded-t-lg sticky top-0">
                <tr>
                  <th className="p-2 py-5 text-left pl-8 w-[10px] whitespace-nowrap">
                    Employee Name
                  </th>
                  {dates.map((date, index) => (
                    <th key={index} className="p-2">
                      <div>{dayjs(date).format("ddd, DD MMM")}</div>
                      <div className="text-xs text-gray-600">
                        {mealType===1&&(
                          <p>Total: {totalGuestsPerDay.lunchGuests[date] || 0}</p>
                        )}
                        {mealType===2&&(
                          <p>Total: {totalGuestsPerDay.snackGuests[date] || 0}</p>
                        )}
                        

                      </div>
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
                    <tr
                      key={employee.employee_id}
                      className="hover:bg-gray-100"
                    >
                      <td className="border border-gray-200 p-2 pl-8 overflow-x-auto text-left w-[10px] whitespace-nowrap">
                        {employee.employee_name}
                      </td>
                      {dates.map((date, index) => {
                        const cellData = dateStatusMap[date] || {
                          status: null,
                          holiday: false,
                          penalty: false,

                        };

                        let cellStyle =
                          "border border-gray-200 p-2 text-center cursor-pointer";
                        let statusText = "-";
                        let textColor = "text-black";

                        if (cellData.holiday) {
                          cellStyle += " bg-red-50";
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
                                cellData.penalty,
                  
                              )
                            }
                          >
                            <div className="flex items-center justify-center">
                              {statusText}
                              {cellData.penalty && (
                                <span className="ms-2 mt-1 w-1 h-1 bg-red-500 rounded-full"></span>
                              )}
                            </div>
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
      </div>

      <MealStatusModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        initialStatus={selectedCell?.currentStatus ?? false}
        initialPenalty={selectedCell?.currentPenalty || false}
        selectedDate={selectedCell?.date ?? ""}
        initialPenaltyScore={1}
        mealType={mealType}
      />
    </div>
  );
};

export default MealActivityComponent;

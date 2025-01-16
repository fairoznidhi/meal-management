"use client";

import React, { useEffect, useState } from "react";
import { fetchMealPlan } from "@/services/fetchMealPlan/api";
import OptionModal from "@/features/OptionModal/optionModal";
import axiosInstance from "@/services/AddEmployee/api";
import Search from "@/components/Search"; 
import TotalBox from "@/features/dashboard/TotalBox";
import TotalTable from "@/features/dashboard/TotalTable";
import Table from "@/components/Table";

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
  employee_id: string;
  employee_name: string;
  employee_details: EmployeeDetail[];
}

const MealPlanComponent = () => {
  const [mealPlan, setMealPlan] = useState<MealActivityData[] | null>(null);
  const [filteredMealPlan, setFilteredMealPlan] = useState<MealActivityData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [selectedMealType, setSelectedMealType] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("2025-01-13"); // Initial start date
  const [days, setDays] = useState<number>(7); // Number of days to fetch

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    employeeId: string;
    employeeName: string;
    date: string;
    status: MealStatus | null;
  } | null>(null);

  // Fetch data when component mounts or startDate changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchMealPlan(startDate, days);
        setMealPlan(data);
        setFilteredMealPlan(data); // Initialize filtered data
      } catch (err: any) {
        setError(err.message || "Error fetching meal plan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (mealPlan) {
      const filtered = mealPlan.filter((employee) =>
        employee.employee_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMealPlan(filtered);
    }
  };

  const handleNavigate = (direction: "previous" | "next") => {
    const currentDate = new Date(startDate);
    const updatedDate =
      direction === "previous"
        ? new Date(currentDate.setDate(currentDate.getDate() - days))
        : new Date(currentDate.setDate(currentDate.getDate() + days));

    setStartDate(updatedDate.toISOString().split("T")[0]);
  };

  const handleCellClick = (
    employeeId: string,
    employeeName: string,
    date: string,
    status: MealStatus | null
  ) => {
    setSelectedCell({ employeeId, employeeName, date, status });
    setIsModalOpen(true);
  };

  const handleChangeStatus = async () => {
    if (selectedCell && mealPlan) {
      const { employeeId, date, status } = selectedCell;

      // Prepare the updated status
      const updatedStatus = status ? !status.status : true; // Toggle status or set to true if null
      const guestCount = status?.guest_count || 0;

      // Create a deep copy of the mealPlan to avoid direct mutation
      const updatedMealPlan = mealPlan.map((employee) => {
        if (employee.employee_id === employeeId) {
          return {
            ...employee,
            employee_details: employee.employee_details.map((detail) => {
              if (detail.date === date) {
                const updatedMeals = detail.meal.map((meal) => {
                  if (meal.meal_type === selectedMealType) {
                    return {
                      ...meal,
                      meal_status: meal.meal_status.map((status) => ({
                        ...status,
                        status: updatedStatus, // Update the status
                      })),
                    };
                  }
                  return meal;
                });
                return { ...detail, meal: updatedMeals };
              }
              return detail;
            }),
          };
        }
        return employee;
      });

      setMealPlan(updatedMealPlan);
      setFilteredMealPlan(updatedMealPlan); // Update the filtered data as well
      setIsModalOpen(false);

      // Send the updated data to the API
      try {
        const response = await axiosInstance.patch("/meal_activity", {
          employee_id: employeeId,
          date,
          changed_status: updatedStatus,
          guest: guestCount,
          meal_type: selectedMealType, // Include meal_type
        });

        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error updating meal status:", error);
      }
    }
  };

  const handleAddPenalty = () => {
    console.log("Add Penalty:", selectedCell);
    setIsModalOpen(false);
  };

  
  if (error) return <p>Error: {error}</p>;

  // Extract dates from the first employee's details for the header
  const headerDates =
    filteredMealPlan && filteredMealPlan.length > 0
      ? filteredMealPlan[0].employee_details.map((detail) => ({
          fullDate: detail.date,
          day: new Date(detail.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
        }))
      : [];

  return (
    <div className="">
      <div className="flex justify-between ms-10"><TotalBox></TotalBox></div>
      
         
            <div className="flex items-center justify-between mb-4 gap-x-10 mt-5">
                   <div className="ms-6">
                  <p className="">Filter by <select name="meal" id="meal" className="bg-[#779ecb] p-1 ms-3">
          <option value="1">Lunch</option>
          <option value="2">Snacks</option>
        </select></p>
        </div>
        <div className="flex gap-x-2">
                   <button
                     onClick={()=>handleNavigate("previous")}
                     className="p-2 text-base bg-[#779ECB] rounded-md hover:bg-[#D7DFE9] ms-6"
                   >
                     <span className="text-lg">&#171;</span>
                   </button>
                   <h2 className="p-2 text-base font-bold me-2">
                   {`Start Date: ${startDate}`}
                   </h2>
                   <button
                     onClick={()=>handleNavigate("next")}
                     className="p-2 text-base bg-[#779ECB] rounded-md hover:bg-[#D7DFE9]"
                   >
                     <span className="text-lg">&raquo;</span> 
                   </button>
                   </div>
                   <div className=""><Search searchTerm={searchQuery} onSearchChange={handleSearchChange} /></div>
                 </div>
                  
<div className="relative mx-5 mt-2">
  <table className="table-auto w-full border-collapse border border-gray-300">
    <thead>
      <tr>
        <th className="border border-gray-300 p-2 w-[40vh]">Employee Name</th>
        {headerDates.map((header, index) => (
          <th key={index} className="border border-gray-300 p-2">
            {header.fullDate}
            <br />
            {header.day}
          </th>
        ))}
      </tr>
    </thead>
  </table>
  <div
    className="overflow-y-auto sm:max-h-[200px] md:max-h-[300px] lg:max-h-[300px] max-lg:max-h-[500px]" // Adjust max height to show 6 rows
  >
    <table className="table-auto w-full border-collapse border border-gray-300">
      <tbody>
        {filteredMealPlan &&
          filteredMealPlan.map((employee, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2 text-center">
                {employee.employee_name}
              </td>
              {employee.employee_details.map((detail, detailIndex) => {
                const meal = detail.meal.find(
                  (m) => m.meal_type === selectedMealType
                );
                const status = meal?.meal_status[0];
                return (
                  <td
                    key={detailIndex}
                    className={`border border-gray-300 p-2 text-center ${
                      detail.holiday ? "bg-blue-100 text-white" : ""
                    } ${status?.penalty ? "bg-red-300 text-white" : ""}`}
                    onClick={() =>
                      handleCellClick(
                        employee.employee_id,
                        employee.employee_name,
                        detail.date,
                        status || null
                      )
                    }
                  >
                    <span
                      className={`${
                        status?.status ? "text-green-500" : "text-red-500"
                      } `}
                    >
                      {status?.status ? "Yes" : "No"}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        {/* Guests Row */}
        <tr>
          <td className="border border-gray-300 p-2 text-center font-bold">
            Guests
          </td>
          {headerDates.map((header, index) => (
            <td
              key={index}
              className="border border-gray-300 p-2 text-center bg-gray-100"
            >
              {/* Placeholder or static value */}
              {Math.floor(Math.random() * 5)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
</div>












    

      <OptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChangeStatus={handleChangeStatus}
        onAddPenalty={handleAddPenalty}
      />
    </div>
  );
};

export default MealPlanComponent;




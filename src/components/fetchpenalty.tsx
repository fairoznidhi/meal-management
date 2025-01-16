import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "@/services/AddEmployee/api";

// Function to get the current month details (first date and number of days)
const getCurrentMonthDetails = () => {
  const now = new Date();
  const firstDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysInMonth = lastDate.getDate();

  return {
    firstDate: firstDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
    daysInMonth,
  };
};

const FetchPenaltyComponent = ({ employeeId }: { employeeId: string }) => {
  const [penaltyData, setPenaltyData] = useState<any>(null);

  // Function to send a PATCH request to update penalty data for the employee
  const updatePenaltyData = async () => {
    const { firstDate, daysInMonth } = getCurrentMonthDetails();

    try {
      // Sending a PATCH request to the penalty API
      const response = await axiosInstance.patch("/meal_activity/total-penalty", {
        employee_id: employeeId,
        start_date: firstDate,   // First date of the current month
        days_in_month: daysInMonth, // Total days in the current month
      });

      // Set the updated penalty data to state
      setPenaltyData(response.data);

      // Log the response data to the console
      console.log("Updated Penalty Data:", response.data);
    } catch (error) {
      console.error("Error updating penalty data:", error);
    }
  };

  // Fetch penalty data on component mount
  useEffect(() => {
    updatePenaltyData();
  }, [employeeId]); // Re-run if employeeId changes
  return (
    <div>
      <h2>Penalty Data for Employee ID: {employeeId}</h2>
      {penaltyData ? (
        <pre>{JSON.stringify(penaltyData, null, 2)}</pre>
      ) : (
        <p>Loading penalty data...</p>
        
      )}
    </div>
  );
};

export default FetchPenaltyComponent;

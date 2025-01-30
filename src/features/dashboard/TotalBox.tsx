"use client"

{/*import React, { useEffect, useState } from "react";
import axiosInstance from "@/services/AddEmployee/api";

//interface TotalMealsData {
  //total_meals: number;
//}

const TotalBox = () => {
  const [totalMeals, setTotalMeals] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalMeals = async (date: string, mealType: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch("/meal_activity/total-meal", {
        params: {
          date,
          meal_type: mealType,
        },
      });
      setTotalMeals(response.data);
      console.log(response.data);
    } catch (err: any) {
      setError(err.message || "Error fetching total meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    const mealType = 1; // Replace with the desired meal_type value
    fetchTotalMeals(formattedDate, mealType);
  }, []);

  
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  //if (loading) return <p>Loading...</p>;
  //if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex items-center justify-center mt-2">
      <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md w-64 p-4 text-center">
        <div className="text-lg font-bold text-gray-700">{formattedDate}</div>
        <div className="mt-4 bg-blue-500 text-white rounded-lg p-2 shadow-inner">
          <p className="text-sm font-medium">Total Meals</p>
          <p className="text-2xl font-bold">{totalMeals}</p>
        </div>
      </div>
    </div>
  );
};

export default TotalBox;
*/}



import React, { useEffect, useState } from "react";
import axiosInstance from "@/services/AddEmployee/api";

const TotalBox = () => {
  const [totalMeals, setTotalMeals] = useState<{ meal1: number | null; meal2: number | null }>({
    meal1: null,
    meal2: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTotalMeals = async (date: string) => {
    try {
      setLoading(true);
      
      // Fetch for meal_type 1
      const response1 = await axiosInstance.patch("/meal_activity/total-meal", {
        date, meal_type: 1 
      });

      // Fetch for meal_type 2
      const response2 = await axiosInstance.patch("/meal_activity/total-meal", {
        date, meal_type: 2 
      });

      setTotalMeals({
        meal1: response1.data,
        meal2: response2.data,
      });

      console.log("Meal Type 1:", response1.data);
      console.log("Meal Type 2:", response2.data);
    } catch (err: any) {
      setError(err.message || "Error fetching total meals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    fetchTotalMeals(formattedDate);
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-center mt-2">
      <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md w-auto p-4 text-center">
        {/*<div className="text-lg font-bold text-gray-700">{formattedDate}</div>*/}
        {loading ? (
          <p className="text-sm text-gray-500 mt-2">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500 mt-2">Error: {error}</p>
        ) : (
          <div className="flex justify-between gap-x-5 mt-4">
            <div className="bg-blue-500 text-white rounded-lg p-2 shadow-inner text-sm w-40 h-20">
              <p className="text-sm font-medium">Total Meals (Lunch)</p>
              <p className="text-2xl font-bold">{totalMeals.meal1 ?? "N/A"}</p>
            </div>
            <div className="bg-green-500 text-white rounded-lg p-2 shadow-inner text-sm w-40 h-20">
              <p className="text-sm font-medium">Total Meals (Snack)</p>
              <p className="text-2xl font-bold">{totalMeals.meal2 ?? "N/A"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalBox;

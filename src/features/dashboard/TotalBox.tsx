"use client"

import React, { useEffect, useState } from "react";
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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

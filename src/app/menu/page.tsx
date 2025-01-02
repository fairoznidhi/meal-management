"use client";

import React, { useEffect, useState } from "react";
import { getMealPlanQuery } from "@/services/getMealPlan/queries"; // Import the query

// Define the type for MealPlan
interface MealPlan {
    date: string;
    menu: {
      meal_type: string;
      food: string;
    }[];
  }

const MealPlanComponent = () => {
  const [mealData, setMealData] = useState<MealPlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMealPlanQuery("2025-01-01", "7"); // Pass parameters
        console.log(data);
        setMealData(data);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Meal Plan Data</h1>
      <pre>{JSON.stringify(mealData, null, 2)}</pre>
    </div>
  );
};

export default MealPlanComponent;

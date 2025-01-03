"use client";

{/*import React, { useEffect, useState } from "react";
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
        console.log(data[0].date);
        console.log(data[0].menu[0].meal_type);
        console.log(data[0].menu[0].food);
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

export default MealPlanComponent;*/}






import React, { useEffect, useState } from "react";
import Table, { Column, Row } from "@/components/Table"; // Adjust the import path as needed
import { getMealPlanQuery } from "@/services/getMealPlan/queries"; // Import the query

const MealPlanTable = () => {
  const [mealData, setMealData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMealPlanQuery("2025-01-01", "7"); // Pass parameters
        console.log("Fetched Data:", data); // Log fetched data

        // Transform data into table format
        const formattedData = data.map((meal) => {
          console.log("Processing Meal:", meal); // Log each meal
          const lunch = meal.menu.find((item) => item.meal_type === "lunch")?.food || "";
          const snack = meal.menu.find((item) => item.meal_type === "snack")?.food || "";
          return { date: meal.date, lunch, snack };
        });

        console.log("Formatted Data:", formattedData); // Log transformed data
        setMealData(formattedData);
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

  // Define the columns for the table
  const columns: Column[] = [
    { key: "date", label: "Date" },
    { key: "lunch", label: "Lunch", editable: true },
    { key: "snack", label: "Snack", editable: true },
  ];

  // Handle row edits
  const handleEditRow = (updatedRow: Row, rowIndex: number) => {
    const updatedData = [...mealData];
    updatedData[rowIndex] = updatedRow;
    setMealData(updatedData);
    console.log("Updated Row:", updatedRow);
  };

  return (
    <div>
      <h1 className="text-xl font-bold my-4">Meal Plan Table</h1>
      <Table
        columns={columns}
        data={mealData}
        onEditRow={handleEditRow}
        title="Meal Plan"
      />
    </div>
  );
};

export default MealPlanTable;



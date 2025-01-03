"use client"

{/*import React, { useState } from "react";

import Table, {Column, Row} from "@/components/Table";
const MealPlan=()=>{
  const columns: Column[] = [
    { key: "date", label: "Date" },
    { key: "snacks", label: "Snacks", editable: true },
    { key: "lunch", label: "Lunch", editable: true },
  ];

  const getWeekDates = (startDate: Date): Row[] => {
    const week: Row[] = [];
    const currentDate = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      week.push({
        date: currentDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
        snacks: "",
        lunch: "",
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return week;
  };

  const [startDate, setStartDate] = useState(new Date());
  const [data, setData] = useState(getWeekDates(startDate));

  const handlePreviousWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setStartDate(newStartDate);
    setData(getWeekDates(newStartDate));
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    setStartDate(newStartDate);
    setData(getWeekDates(newStartDate));
  };

  const handleEditRow = (updatedRow: Row, rowIndex: number) => {
    const updatedData = [...data];
    updatedData[rowIndex] = updatedRow;
    setData(updatedData);
  };



  return(
    <div className="m-40">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousWeek}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Previous Week
        </button>
       
        <button
          onClick={handleNextWeek}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next Week
        </button>
      </div>
     <Table
        columns={columns}
        data={data}
        //onAddRow={() => {}} // Disable adding rows for this table
        //onDeleteRow={() => {}} // Disable deleting rows for this table
        onEditRow={handleEditRow}
      />
      <button className="mt-20 p-2 border rounded-md bg-blue-500 hover:bg-blue-600 text-white">Save changes</button>
    </div>
  )
}
export default MealPlan;

import React, { useState } from "react";
import { setMealPlan } from "@/services/MealPlan/api";

const AddMeal = () => {
  const [formData, setFormData] = useState({
    date: "",
    meal_type: "",
    food: "",
   
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await setMealPlan(formData);
      setSuccess("Meal added successfully!");
      setError(null);
      console.log("Response:", response);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add meal");
      setSuccess(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add Meal Plan</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Meal_Type</label>
          <input
            type="text"
            name="meal_type"
            value={formData.meal_type}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Food</label>
          <input
            type="text"
            name="food"
            value={formData.food}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddMeal;


// src/pages/dashboard.tsx
import axiosInstance from "@/services/MealPlan/api";

export default function Dashboard() {
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/mealplan");
      console.log("Response Data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}*/}




import React, { useState, useEffect } from "react";
import axiosInstance from "@/services/MealPlan/api";
import Table, { Column, Row } from "@/components/Table";

export default function Dashboard() {
  // Static dates for the table
  const staticDates = [
    "2025-01-01",
    "2025-01-02",
    "2025-01-03",
    "2025-01-04",
    "2025-01-05",
    "2025-01-06",
    "2025-01-07",
  ];

  const [mealPlans, setMealPlans] = useState<Row[]>(
    staticDates.map((date) => ({
      date,
      lunch: "",
      snacks: "",
    }))
  );

  // Fetch existing meal plans from the API
  const fetchMealPlans = async () => {
    try {
      const response = await axiosInstance.get("/mealplan"); // Adjust the endpoint accordingly
      const fetchedData = response.data;

      // Update the state with the fetched data
      const updatedMealPlans = staticDates.map((date) => {
        const mealsForDate = fetchedData.filter((meal: any) => meal.date === date);
        const lunch = mealsForDate.find((meal: any) => meal.meal_type === "Lunch")?.food || "";
        const snacks = mealsForDate.find((meal: any) => meal.meal_type === "Snacks")?.food || "";
        
        return {
          date,
          lunch,
          snacks,
        };
      });

      setMealPlans(updatedMealPlans);
    } catch (error) {
      console.error("Error fetching meal plans:", error);
    }
  };

  // Fetch meal plans on component mount
  useEffect(() => {
    fetchMealPlans();
  }, []);

  const columns: Column[] = [
    {
      key: "date",
      label: "Date",
      render: (value) => value, // Display the date as a string
    },
    {
      key: "lunch",
      label: "Lunch",
      editable: true,
    },
    {
      key: "snacks",
      label: "Snacks",
      editable: true,
    },
  ];

  const handleEditRow = (updatedRow: Row, rowIndex: number) => {
    const updatedMealPlans = [...mealPlans];
    updatedMealPlans[rowIndex] = updatedRow;
    setMealPlans(updatedMealPlans);
  };

  const handleSubmit = async () => {
    try {
      // Prepare data for submission: both lunch and snacks for each date
      const formattedData = mealPlans.flatMap((mealPlan) => [
        {
          date: mealPlan.date,
          meal_type: "Lunch",
          food: mealPlan.lunch,
        },
        {
          date: mealPlan.date,
          meal_type: "Snacks",
          food: mealPlan.snacks,
        },
      ]);

      // Filter out empty food fields (no lunch or snacks)
      const dataToSubmit = formattedData.filter((entry) => entry.food);

      // Submit the data for both lunch and snacks
      const promises = dataToSubmit.map((entry) => axiosInstance.post("/mealplan", entry));

      await Promise.all(promises);
      alert("Meal plans submitted successfully!");
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Failed to submit meal plans. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Meal Plan Table</h1>
      <Table
        columns={columns}
        data={mealPlans}
        onEditRow={handleEditRow}
        title="Meal Plans"
      />
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

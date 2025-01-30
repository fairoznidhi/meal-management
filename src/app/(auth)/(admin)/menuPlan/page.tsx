"use client"

import React, { useEffect, useState } from "react";
import Table, { Column, Row } from "@/components/Table"; // Adjust the import path as needed
import dayjs from "dayjs"; // For date manipulation
import Modal from "@/components/modal";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";

const httpClient = new HttpClient(`${process.env.NEXT_PUBLIC_PROXY_URL}`);
const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

const getCurrentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => getCurrentYear + i);
const months = Array.from({ length: 12 }, (_, i) => ({
  name: new Date(0, i).toLocaleString("default", { month: "long" }),
  value: String(i + 1).padStart(2, "0"),
}));
const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

type Meal={
  date:string,
  meal_type:string,
  food:string
};
const MealPlanTable = () => {
  const [selectedMeal, setSelectedMeal] = useState<{ date: string; meal_type: string; food: string } | null>(null);
 const [isEditing, setIsEditing] = useState(false);
  const [mealData, setMealData] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const [newMeal, setNewMeal] = useState({
    year: String(getCurrentYear),
    month: "01",
    day: "01",
    meal_type: "",
    food: "",
  });
  

  const mealTypes = ["lunch","snack"];


  // Fetch data based on the current start date
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        // Generate a sequence of dates for the week
        const start = dayjs(startDate);
        const end = start.add(6, "day");
        const dateSequence = [];
        for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, "day")) {
          dateSequence.push(d.format("YYYY-MM-DD"));
        }
  
        // Fetch meal data from the API
        const data = await request({
          url: `/mealplan`,
          method: "GET",
          params: {
            start: startDate,
            days: 7,
          },
          useAuth: true,
        })as Meal[];
  
        // Map API data to a dictionary for easy lookup
        const mealDataMap = data.reduce((acc: any, meal: any) => {
          acc[meal.date] = meal.menu.reduce((mealAcc: any, item: any) => {
            mealAcc[item.meal_type] = item.food;
            return mealAcc;
          }, {});
          return acc;
        }, {});
  
        // Merge date sequence with meal data
        const formattedData = dateSequence.map((date) => ({
          date,
          lunch: mealDataMap[date]?.lunch || "",
          snack: mealDataMap[date]?.snack || "",
        }));
  
        setMealData(formattedData);
      } catch (err: any) {
        console.error("Error fetching meal plan:", err);
        setError(err.response?.data?.message || "Error fetching meal plan.");
        setMealData(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [startDate]);
  
  
  {/*const handleAddMeal = async () => {
  const formattedDate = `${newMeal.year}-${newMeal.month}-${newMeal.day}`;
  const mealToSubmit = { ...newMeal, date: formattedDate };
  delete mealToSubmit.year;
  delete mealToSubmit.month;
  delete mealToSubmit.day;

  try {
    await request({
      url: "/mealplan",
      method: "POST",
      data: [mealToSubmit],
      useAuth: true,
    });

    alert("Meal Plan added successfully!");
    setIsModalOpen(false);
    setNewMeal({ year: String(getCurrentYear), month: "01", day: "01", meal_type: "", food: "" });

    // Update the mealData state immediately without refetching
    setMealData((prevMealData) => {
      if (!prevMealData) return null;

      // Find the index of the row with the matching date
      const rowIndex = prevMealData.findIndex((row) => row.date === formattedDate);

      if (rowIndex !== -1) {
        // Update the existing row
        const updatedData = [...prevMealData];
        updatedData[rowIndex] = {
          ...updatedData[rowIndex],
          [mealToSubmit.meal_type]: mealToSubmit.food,
        };
        return updatedData;
      } else {
        // Add a new row for the date if it doesn't exist
        return [
          ...prevMealData,
          {
            date: formattedDate,
            lunch: mealToSubmit.meal_type === "lunch" ? mealToSubmit.food : "",
            snack: mealToSubmit.meal_type === "snack" ? mealToSubmit.food : "",
          },
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Keep rows sorted by date
      }
    });
  } catch (err: any) {
    console.error("Error adding meal:", err);
    alert("Failed to add meal. Please try again.");
  }
};*/}


const handleAddMeal = async () => {
  const { year, month, day, ...mealWithoutDate } = newMeal; // Destructure and omit year, month, and day
  const formattedDate = `${year}-${month}-${day}`; // Construct formatted date
  const mealToSubmit = { ...mealWithoutDate, date: formattedDate }; // Add formatted date to the new object

  try {
    await request({
      url: "/mealplan",
      method: "POST",
      data: [mealToSubmit],
      useAuth: true,
    });

    alert("Meal Plan added successfully!");
    setIsModalOpen(false);
    setNewMeal({ year: String(getCurrentYear), month: "01", day: "01", meal_type: "", food: "" });

    // Update the mealData state immediately without refetching
    setMealData((prevMealData) => {
      if (!prevMealData) return null;

      // Find the index of the row with the matching date
      const rowIndex = prevMealData.findIndex((row) => row.date === formattedDate);

      if (rowIndex !== -1) {
        // Update the existing row
        const updatedData = [...prevMealData];
        updatedData[rowIndex] = {
          ...updatedData[rowIndex],
          [mealToSubmit.meal_type]: mealToSubmit.food,
        };
        return updatedData;
      } else {
        // Add a new row for the date if it doesn't exist
        return [
          ...prevMealData,
          {
            date: formattedDate,
            lunch: mealToSubmit.meal_type === "lunch" ? mealToSubmit.food : "",
            snack: mealToSubmit.meal_type === "snack" ? mealToSubmit.food : "",
          },
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Keep rows sorted by date
      }
    });
  } catch (err: any) {
    console.error("Error adding meal:", err);
    alert("Failed to add meal. Please try again.");
  }
};


const handleRepeatMealsForNextWeek = async () => {
  if (!mealData || mealData.length === 0) {
    alert("No meals available to resend.");
    return;
  }

  // Sort mealData by date to ensure it's in the correct order
  const sortedMealData = [...mealData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get the last 7 days of meal data
  const last7DaysMeals = sortedMealData.slice(-7);

  // Generate new meal data for the next 7 days
  const mealsForNextWeek = last7DaysMeals.flatMap((meal) => {
    const newDate = new Date(meal.date);
    newDate.setDate(newDate.getDate() + 7); // Shift date forward by 7 days
    const formattedDate = newDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD

    // Convert each meal row into separate objects for each meal type
    const newMeals = [];

    if (meal.lunch) {
      newMeals.push({
        date: formattedDate,
        meal_type: "lunch",
        food: meal.lunch,
      });
    }

    if (meal.snack) {
      newMeals.push({
        date: formattedDate,
        meal_type: "snack",
        food: meal.snack,
      });
    }

    return newMeals;
  });

  if (mealsForNextWeek.length === 0) {
    alert("No valid meals found to resend.");
    return;
  }

  try {
    await request({
      url: "/mealplan",
      method: "POST",
      data: mealsForNextWeek, // Send as an array of objects
      useAuth: true,
    });

    alert("Meal Plan repeated for the next 7 days successfully!");

    // Optionally update local state
    //setMealData((prevMealData) => [...prevMealData, ...mealsForNextWeek]);
  } catch (err: any) {
    console.error("Error repeating meals for next week:", err);
    alert("Failed to repeat meal plan. Please try again.");
  }
};

  
  

  // Navigation functions
  const handlePreviousWeek = () => {
    const newStartDate = dayjs(startDate).subtract(7, "day").format("YYYY-MM-DD");
    setStartDate(newStartDate);
  };

  const handleNextWeek = () => {
    const newStartDate = dayjs(startDate).add(7, "day").format("YYYY-MM-DD");
    setStartDate(newStartDate);
  };

  // Define the columns for the table
  const columns: Column[] = [
    { key: "date", label: "Date" },
    { key: "lunch", label: "Lunch" },
    { key: "snack", label: "Snack" },
  ];

  // Handle row edits
  const handleEditRow = (updatedRow: Row, rowIndex: number) => {
    if (!mealData) return;
    const updatedData = [...mealData];
    updatedData[rowIndex] = updatedRow;
    setMealData(updatedData);
    console.log("Updated Row:", updatedRow);
  };

  // Handle input changes in the modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="mt-40 mx-10">
      
        <div className="flex justify-between mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handlePreviousWeek}
          >
            Previous Week
          </button>
          <p className="text-lg font-semibold">{`Week starting: ${startDate}`}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleNextWeek}
          >
            Next Week
          </button>
        </div>

        
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : mealData && mealData.length > 0 ? (
          <Table columns={columns} data={mealData} onEditRow={handleEditRow} />
        ) : (
          <p>No data available for this week. Use the navigation bar to explore other weeks.</p>
        )}
      </div>

      
      <div className="flex justify-end mt-4 me-10 gap-x-5">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Meal
        </button>
        <button onClick={handleRepeatMealsForNextWeek} className="bg-blue-500 text-white px-4 py-2 rounded">Copy Meals</button>
      </div>

<Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewMeal({ year: String(getCurrentYear), month: "01", day: "01", meal_type: "", food: "" });
        }}
        title="Add New Meal"
        footer={
          <div>
            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded mr-2">
              Cancel
            </button>
            <button onClick={handleAddMeal} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Meal
            </button>
          </div>
        }
      >
        <form>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                name="year"
                value={newMeal.year}
                onChange={(e) => setNewMeal({ ...newMeal, year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Month</label>
              <select
                name="month"
                value={newMeal.month}
                onChange={(e) => setNewMeal({ ...newMeal, month: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>{month.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Day</label>
              <select
                name="day"
                value={newMeal.day}
                onChange={(e) => setNewMeal({ ...newMeal, day: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {days.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>

          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Meal Type</label>
            <select
              name="meal_type"
              value={newMeal.meal_type}
              onChange={(e) => setNewMeal({ ...newMeal, meal_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Meal Type</option>
              {mealTypes.map((type) => (
                <option key={type} value={type.toLowerCase()}>{type}</option>
              ))}
            </select>
          </div>

        
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Food</label>
            <input
              type="text"
              name="food"
              value={newMeal.food}
              onChange={(e) => setNewMeal({ ...newMeal, food: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter food item"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MealPlanTable;




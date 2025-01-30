"use client"

{/*import React, { useEffect, useState } from "react";
import Table, { Column, Row } from "@/components/Table"; // Adjust the import path as needed
import { getMealPlanQuery } from "@/services/getMealPlan/queries"; // Import the query
import axiosInstance from "@/services/AddEmployee/api"
import dayjs from "dayjs"; // For date manipulation
import Modal from "@/components/modal";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";


const httpClient = new HttpClient(`${process.env.NEXT_PUBLIC_PROXY_URL}`);
const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

const MealPlanTable = () => {
  const [mealData, setMealData] = useState<Row[] | null>(null); // Allow `null` for empty data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("2025-01-01"); // Initial starting date
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMeal, setNewMeal] = useState({
      date: "",
      meal_type:"",
      food:"",
    });
  // Fetch data based on the current start date
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMealPlanQuery(startDate, "7"); // Pass parameters
        console.log("Fetched Data:", data);

        // Transform data into table format if available
        if (data && data.length > 0) {
          const formattedData = data.map((meal) => {
            const lunch = meal.menu.find((item) => item.meal_type === "lunch")?.food || "";
            const snack = meal.menu.find((item) => item.meal_type === "snack")?.food || "";
            return { date: meal.date, lunch, snack };
          });
          setMealData(formattedData);
        } else {
          setMealData([]); // Set an empty array if no data is returned
        }
      } catch (err: any) {
        setError(err.message || "Error fetching data");
        setMealData(null); // Set to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate]); // Refetch data whenever the start date changes



  // Define the columns for the table
  const columns: Column[] = [
    { key: "date", label: "Date" },
    { key: "lunch", label: "Lunch" },
    { key: "snack", label: "Snack"},
  ];

  // Handle row edits
  const handleEditRow = (updatedRow: Row, rowIndex: number) => {
    if (!mealData) return; // Skip if no data
    const updatedData = [...mealData];
    updatedData[rowIndex] = updatedRow;
    setMealData(updatedData);
    console.log("Updated Row:", updatedRow);
  };

  // Handle input changes in the modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
  };

  
  // Handle modal submission
  const handleAddMeal = async () => {
    try {
      const response = await axiosInstance.post("/mealplan", newMeal);
      console.log("Meal_Plan Added:", response.data);
      alert("Meal Plan added successfully!");
      setIsModalOpen(false);
      setNewMeal({ date: "", meal_type: "", food: ""}); // Reset form
    } catch (error) {
      console.error("Error adding meal:", error);
      alert("Failed to add meal. Please try again.");
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
        <Table
          columns={columns}
          data={mealData}
          onEditRow={handleEditRow}
        
        />
      ) : (
        <p>No data available for this week. Use the navigation bar to explore other weeks.</p>
      )}
    </div>
    
    <div className="flex justify-end mt-4 me-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Meal
          </button>
        </div>


    
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Meal"
        footer={
          <div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
           <button
              onClick={handleAddMeal}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        }
      >
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="text"
              name="date"
              value={newMeal.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Meal_Type(Lunch/Snack)
            </label>
            <input
              type="text"
              name="meal_type"
              value={newMeal.meal_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Food
            </label>
            <input
              type="text"
              name="food"
              value={newMeal.food}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          
        </form>
      </Modal>
    </div>
  );
};

export default MealPlanTable;
*/}


import React, { useEffect, useState } from "react";
import Table, { Column, Row } from "@/components/Table"; // Adjust the import path as needed
import dayjs from "dayjs"; // For date manipulation
import Modal from "@/components/modal";
import HttpClient, { baseRequest } from "@/services/HttpClientAPI";

const httpClient = new HttpClient(`${process.env.NEXT_PUBLIC_PROXY_URL}`);
const request = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

const MealPlanTable = () => {
  const [mealData, setMealData] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({
    date: "",
    meal_type: "",
    food: "",
  });

  // Fetch data based on the current start date
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await request({
          url: `/mealplan`,
          method: "GET",
          params:{
          start: startDate,
          days: 7
          },
          useAuth: true,
        }) as any[];

        if (data && data.length > 0) {
          const formattedData = data.map((meal: any) => {
            const lunch = meal.menu.find((item: any) => item.meal_type === "lunch")?.food || "";
            const snack = meal.menu.find((item: any) => item.meal_type === "snack")?.food || "";
            return { date: meal.date, lunch, snack };
          });
          setMealData(formattedData);
        } else {
          setMealData([]);
        }
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

  // Handle modal submission
  const handleAddMeal = async () => {
    try {
      const response = await request({
        url: "/mealplan",
        method: "POST",
        data: newMeal,
        useAuth: true,
      });

      console.log("Meal Plan Added:", response);
      alert("Meal Plan added successfully!");
      setIsModalOpen(false);
      setNewMeal({ date: "", meal_type: "", food: "" });

      // Optionally, refetch the data after adding a meal
      const updatedData = await request({
        url: `/mealplan`,
        method: "GET",
        data:{
          start:startDate,
          days:7
        },
        useAuth: true,
      }) as any[];

      if (updatedData && updatedData.length > 0) {
        const formattedData = updatedData.map((meal: any) => {
          const lunch = meal.menu.find((item: any) => item.meal_type === "lunch")?.food || "";
          const snack = meal.menu.find((item: any) => item.meal_type === "snack")?.food || "";
          return { date: meal.date, lunch, snack };
        });
        setMealData(formattedData);
      }
    } catch (err: any) {
      console.error("Error adding meal:", err);
      alert("Failed to add meal. Please try again.");
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
        {/* Navigation Bar */}
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

        {/* Render Table or Message */}
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

      {/* Add Meal Button */}
      <div className="flex justify-end mt-4 me-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Meal
        </button>
      </div>

      {/* Modal for Adding Meal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Meal"
        footer={
          <div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMeal}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        }
      >
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="text"
              name="date"
              value={newMeal.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Meal Type (Lunch/Snack)
            </label>
            <input
              type="text"
              name="meal_type"
              value={newMeal.meal_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Food</label>
            <input
              type="text"
              name="food"
              value={newMeal.food}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MealPlanTable;

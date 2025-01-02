'use client'

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
      setError(err.response?.data?.message || "Failed to meal");
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

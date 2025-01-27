import axios from "axios";
import { getSession } from "next-auth/react";

// Create the Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PROXY_URL, // Replace with your API base URL
});

// Add interceptors to include authorization and content-type headers
axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession(); // Fetch session for the user
  const token = session?.user?.accessToken; // Access token from session

  // Add Authorization header if token is available
  if (token) {
    config.headers.Authorization = `${token}`;
  }

  // Ensure Content-Type is set
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// Function to fetch meal plans
export const fetchMealPlan = async (
  
  start: string,

  days:number,
) => {
  try {
    const response = await axiosInstance.get("/meal_activity/admin", {
      params: {
        start: start,
        days: days,
      },
    });

    // Log and return the response data
    console.log("Meal Plan Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    throw error;
  }
};
{/*import axios from "axios";
import { MealPlanDataType } from "@/types/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance = axios.create({ baseURL: BASE_URL });

console.log(BASE_URL);


// Fetch all employees
export const setMealPlan = async () => {
  return (await axiosInstance.post<MealPlanDataType>(`/mealplan`)).data;
};*/}

import axios from "axios";
import { MealPlanDataType } from "@/types/types";

// Base URL for API
const BASE_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance = axios.create({ baseURL: BASE_URL });

console.log(BASE_URL);

// Add Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token to headers if available
    const token = localStorage.getItem("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpdmFzb2Z0QGdtYWlsLmNvbSIsImVtcGxveWVlX2lkIjoxLCJleHAiOjE3MzU4ODc5NDIsImlzX2FkbWluIjp0cnVlfQ.VqsEX2tIn2YEnmtR8SheIaZZ4AQsPwVnJXSiRHs1BXI"); // Adjust based on where you store your token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response;
  },
  (error) => {
    // Handle response errors globally
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      // Optionally redirect to login page
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      console.error("Forbidden! You don't have permission.");
    } else {
      console.error("API Error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Fetch all employees (POST example)
export const setMealPlan = async () => {
  return (await axiosInstance.post<MealPlanDataType>(`/mealplan`)).data;
};


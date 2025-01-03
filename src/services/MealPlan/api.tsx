{/*import axios from "axios";
import { MealPlanDataType } from "@/types/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance = axios.create({ baseURL: BASE_URL });

console.log(BASE_URL);


// Fetch all employees
export const setMealPlan = async () => {
  return (await axiosInstance.post<MealPlanDataType>(`/mealplan`)).data;
};*/}




{/*import axios from "axios";
import { MealPlanDataType } from "@/types/types";
import { useSession } from "next-auth/react";
// Base URL for API
const BASE_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance = axios.create({ baseURL: BASE_URL });

console.log(BASE_URL);

// Add Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authorization token to headers if available
    //const token = localStorage.getItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpdmFzb2Z0QGdtYWlsLmNvbSIsImVtcGxveWVlX2lkIjoxLCJleHAiOjE3MzU5NzIxMzEsImlzX2FkbWluIjp0cnVlfQ.VCZDpF46xtsNYrpLYEbxCdiG4651PBDyNRzMIgi6oMU'); // Adjust based on where you store your token
    //if (token) {
      config.headers.Authorization = `Bearer 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpdmFzb2Z0QGdtYWlsLmNvbSIsImVtcGxveWVlX2lkIjoxLCJleHAiOjE3MzU5NzI2MjksImlzX2FkbWluIjp0cnVlfQ.oD0gTYterRSGESLS4mLet5QUeR3tReZJ4TjVKbHbyzk'`;
    //}
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



import axios from "axios";
import { MealPlanDataType } from "@/types/types";
import { useSession } from "next-auth/react";

// Base URL for API
const BASE_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance = axios.create({ baseURL: BASE_URL });

console.log(BASE_URL);

// Add Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Retrieve token from session or storage
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const token = session?.user?.accessToken;
    console.log("Token:",token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(config.headers);
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
     // window.location.href = "/login";
    } else if (error.response?.status === 403) {
      console.error("Forbidden! You don't have permission.");
    } else {
      console.error("API Error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Fetch all employees (POST example)
export const setMealPlan = async (mealPlanData: MealPlanDataType) => {
  try {
    const response = await axiosInstance.post<MealPlanDataType>(`/mealplan`, mealPlanData);
    return response.data;
  } catch (error) {
    console.error("Error setting meal plan:", error);
    throw error;
  }
};*/}




import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PROXY_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  console.log("Token:",token);
  
  if (token) {
    config.headers.Authorization = `${token}`;
  }

  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  console.log("Headers:",config.headers);
 

  return config;
});

export default axiosInstance;



{/*import axios from "axios";
import { MealPlanDataType } from "@/types/types";

// Base URL for API
const BASE_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance = axios.create({ baseURL: BASE_URL });

console.log(BASE_URL);

// Add Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Retrieve token from session or storage
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const token = session?.user?.accessToken;
    console.log("Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request Headers:", config.headers);
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
      // window.location.href = "/login";
    } else if (error.response?.status === 403) {
      console.error("Forbidden! You don't have permission.");
    } else {
      console.error("API Error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Fetch all employees (POST example)
export const setMealPlan = async (mealPlanData: MealPlanDataType) => {
  try {
    const response = await axiosInstance.post<MealPlanDataType>(`/mealplan`, mealPlanData);
    return response.data; // Automatically includes token in headers via interceptor
  } catch (error) {
    console.error("Error setting meal plan:", error);
    throw error;
  }
};
*/}

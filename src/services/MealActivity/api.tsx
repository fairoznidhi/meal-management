import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance = axios.create({ baseURL: BASE_URL });

console.log(BASE_URL);

// Fetch meal activity with start date and number of days
export const getMealActivity = async (start: string, days: number) => {
  try {
    const response = await axiosInstance.get(`/meal_activity`, {
      params: { start, days },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching meal activity:", error);
    throw error; // Throw error to be handled by the caller
  }
};


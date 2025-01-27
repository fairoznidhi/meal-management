import axios from "axios";
import { getMealPlan } from "@/types/types";

export type MealPlan={
    date:string;
    menu: getMealPlan[];
}

const BASE_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance = axios.create({ baseURL: BASE_URL });

console.log(BASE_URL);

export const fetchMealPlan = async (start: string, days: string): Promise<MealPlan[]> => {
  try {
    const response = await axiosInstance.get<MealPlan[]>('/mealplan', {
      params: { start, days },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching meal data:", error);
    throw error;
  }
};
import { fetchMealPlan } from "./api"; // Import the API function
import { MealPlan } from "./api"; // Import types if needed

// Query logic for fetching meal data
export const getMealPlanQuery = async (start: string, days: string): Promise<MealPlan[]> => {
  try {
    const mealData = await fetchMealPlan(start, days);
    return mealData;
  } catch (error) {
    console.error("Error in getMealPlanQuery:", error);
    throw error;
  }
};



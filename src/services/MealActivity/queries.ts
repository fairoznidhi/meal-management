import { useQuery } from "@tanstack/react-query";
import { getMealActivity } from "./api";

export const useMealActivity = (start: string, days: number) => {
  return useQuery({
    queryKey: ["employee_details", { start, days }],
    queryFn: () => getMealActivity(start, days),
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 2, // Retry failed requests up to 2 times
  });
};

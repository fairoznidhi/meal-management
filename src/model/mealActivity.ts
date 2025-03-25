export type MealSummaryGraph = {
  month?: string;
  year?: string;
  lunch?: number;
  snack?: number;
};

export type MonthlyData = {
  month?: string;
  year?: string;
  total_lunch?: number;
  total_guest_lunch?: number;
  total_snack?: number;
  total_guest_snack?: number;
  lunch_penalty?: number;
  snack_penalty?: number;
};

export type OfficeDailyPenalties = {
  date?: string;
  count?: number;
};

export type OfficeMonthlyPenalties = {
  month?: string;
  year?: string;
  count?: number;
};

export type TotalMealGroupSummary = {
  date: string;
  count: number;
  special_count: number;
};

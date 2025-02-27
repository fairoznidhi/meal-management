export type MealSummaryGraph={
    month?:string;
    year?:string;
    lunch?:number;
    snack?:number;
}

export type MonthlyData={
    month?:string;
    year?:string;
    total_lunch?: number;
    total_guest_lunch?: number,
    total_snack?: number,
    total_guest_snack?: number,
    lunch_penalty?: number,
    snack_penalty?: number
}
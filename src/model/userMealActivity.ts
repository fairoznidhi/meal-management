export type EmployeeMealStatus={
  status?:boolean;
  guest_count?:number;
  penalty?:boolean;
}
export type EmployeeMeal={
  meal_type?:number;
  meal_status?: EmployeeMealStatus[];
}
export type EmployeeEachDayMealDetails={
  date?:string;
  holiday?:boolean;
  meal?:EmployeeMeal[]
}
export type EmployeeMealDetails={
  employee_id?: number;
  employee_name?: string;
  employee_details?: EmployeeMealDetails[]
}
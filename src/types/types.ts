export type UserProfileDataType = {
    employee_id: number;
    name: string;
    email: string;
    dept_id:number;
    password:string;
    remarks:string;
    default_status:boolean;
    is_admin:boolean;
  };

  export type MealPlanDataType={
    date: string;
    meal_type: string;
    food: string;
  };

  export type MealStatus = {
    status: boolean;
    guest_count: number;
    penalty: boolean;
  };
  
  export type Meal = {
    meal_type: number;
    meal_status: MealStatus[];
  };
  
  export type MealActivityData = {
    date: string;
    holiday: boolean;
    meal: Meal[];
  };

  export type getMealPlan={
    meal_type:string;
    food:string;
  }
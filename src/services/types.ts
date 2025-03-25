{/*export type UserProfileDataType = {
  employee_id?: number;
  name?: string;
  email?: string;
  phone_number?:string;
  dept_name?:string;
  remarks?:string;
  default_status?:boolean;
  is_admin?:boolean;
  photo?: string | File | Blob; 
  food_preference?:number[];
}*/}


export type UserProfileDataType = {
  employee_id?: number;
  name?: string;
  email?: string;
  phone_number?: string;
  dept_name?: string;
  remarks?: string;
  default_status?: boolean;
  is_admin?: boolean;
  photo?: string | File | Blob;
  preference_food: number[];
};


export type Preference = {
  food_Id: number;
  food: string;
};


export type Employee = {
  employee_id: string;
  name: string;
  email: string;
  password: string;
  dept_id: string;
  phone_number: string;
  remarks: string;
  preference_food: number[];
};

export type Dept = {
  dept_id: number;
  dept_name: string;
  weekends: string[];
};

export type MealsResponse = {
  employee_id: string;
  name: string;
  lunch: number;
  snacks: number;
};

export type EmployeeWithMealInfo = {
  employee_id: string;
  name: string;
  email: string;
  phone_number: string;
  remarks: string;
  dept_name: string;
  lunch: number;
  snacks: number;
  penalties: number | string;
};





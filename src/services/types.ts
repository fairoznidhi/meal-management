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
  default_status_lunch?: boolean;
  default_status_snacks?: boolean;
  is_admin?: boolean;
  photo?: string | File | Blob;
  preference_food: number[];
  is_permanent:boolean;
  is_active: boolean;
  designation: string;
  roll: string;
  
};

export type UserEditDataType={
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
}


export type Preference = {
  food_Id: number;
  food: string;
};


export type Employee = {
  employee_id: string;
  name: string;
  email?: string;
  phone_number?: string;
  password?: string;
  dept_name?: string;
  remarks?: string;
  preference_food?: number[];
  default_status_lunch?:boolean;
  default_status_snacks?:boolean;
  is_admin?: boolean;
  is_permanent?: boolean;
  is_active?: boolean;
  designation?: string;
  roll?: string;
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





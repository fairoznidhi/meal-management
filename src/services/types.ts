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

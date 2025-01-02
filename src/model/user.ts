export type User = {
    employee_id?: number;
    name?: string;
    email?: string;
    dept_id?:number;
    password?:string;
    remarks?:string;
    default_status?:boolean;
    is_admin?:boolean;
  }
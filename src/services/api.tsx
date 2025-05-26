import { extraMeal } from "@/model/extraMeal";
import {
  MealSummaryGraph,
  MonthlyData,
  OfficeDailyPenalties,
  OfficeMonthlyPenalties,
  TotalMealGroupSummary,
} from "@/model/mealActivity";
import { RangeMenuDetails } from "@/model/rangeMealPlan";
import { TotalMeal, totalMealGroup } from "@/model/totalMealGroup";
import { EmployeeMealDetails } from "@/model/userMealActivity";
import axios from "axios";
import { Preference, Dept, Employee, MealsResponse, UserProfileDataType } from "./types";
import { getSession } from "next-auth/react";
import { baseRequest } from "./HttpClientAPI";
import { defaultStatus } from "@/model/employee";


const BASE_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance = axios.create({ baseURL: BASE_URL });
const apiClient = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

export const getSingleEmployee = async (id: number) => {
  return (
    await axiosInstance.get<UserProfileDataType[]>(`employee?employee_id=${id}`)
  ).data;
};

export const getTokenSingleEmployee = async () => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  const response = await axiosInstance.get<UserProfileDataType>(
    "employee/profile",
    {
      headers: {
        Authorization: token,
      },
    }
  );
  console.log(response.data);
  return [response.data];
};

export const getSingleEmployeeMealActivity = async (
  date: string,
  days: string
) => {
  const res = await apiClient({
    url: "/meal_activity",
    method: "GET",
    params: {
      start: `${date}`,
      days: `${days}`,
    },
    useAuth: true,
  });
  return res as EmployeeMealDetails[];
};

export const getRangeMealPlan = async (date: string, days: string) => {
  const res = await apiClient({
    url: "/mealplan",
    method: "GET",
    params: {
      start: `${date}`,
      days: `${days}`,
    },
  });
  return res as RangeMenuDetails[];
};



export const getEmployeePhoto=async()=>{
    const res=await apiClient({
        url: "/employee/photo",
        method: "GET",
        useAuth: true,
        responseType: "blob",
    })
    
    return res as Blob;
}

/*export const patchToggleDefaultMealStatus=async(date:string)=>{
    const res=await apiClient({
        url: "/employee/default-status",
        params:{
            date: `${date}`
        },
        method: "PATCH",
        useAuth: true,
    })
    return res;
}*/


export const patchToggleDefaultMealStatus=async(data:defaultStatus)=>{
  console.log("Default status data",data)
    const res=await apiClient({
        url: "/employee/default-status",
        data:data,
        method: "PATCH",
        useAuth: true,
    })
    return res;
}

export const patchEmployeeProfile = async (formData: FormData) => {
  const res = await apiClient({
    url: "/employee",
    method: "PATCH",
    useAuth: true,
    data: formData,
  });
  return res;
};

export const patchGroupMealUpdate = async (mealData: any[]) => {
  const res = await apiClient({
    url: "meal_activity/group-update",
    method: "PATCH",
    useAuth: true,
    data: mealData,
  });
  return res;
};

export const patchForgetPassword = async (forgetPassData: object) => {
  const res = await apiClient({
    url: "/employee/forget-password",
    data: forgetPassData,
    method: "PATCH",
  });
  return res;
};

export const patchResetPassword = async (data: object, token: string) => {
  return (
    await axiosInstance.patch("employee/password-change", data, {
      headers: {
        Authorization: `${token}`,
      },
    })
  ).data;
};

export const patchTotalMealGroup = async (data: object) => {
  const res = await apiClient({
    url: "/meal_activity/total-meal-group",
    data: data,
    method: "PATCH",
    useAuth: true,
  });
  return res as totalMealGroup[];
};

export const patchTotalLunchSnacksCount = async (data: object) => {
  const res = await apiClient({
    url: "/meal_activity/total-meal-summary",
    data: data,
    method: "PATCH",
    useAuth: true,
  });
  return res as TotalMeal;
};

export const getExtraMeal = async (date: string) => {
  const res = await apiClient({
    url: "/extra_meal",
    method: "GET",
    params: {
      date: `${date}`,
    },
    useAuth: true,
  });
  return res as extraMeal;
};

export const patchExtraMeal = async (data: object) => {
  const res = await apiClient({
    url: "/extra_meal",
    data: data,
    method: "PATCH",
    useAuth: true,
  });
  return res;
};

export const getMealSummaryGraph = async (monthCount: number) => {
  const res = await apiClient({
    url: "/meal_activity/meal-summary-graph",
    method: "GET",
    params: {
      month: `${monthCount}`,
    },
    useAuth: true,
  });
  return res as MealSummaryGraph[];
};

export const getUserMonthlyData = async (month: number) => {
  const res = await apiClient({
    url: "/meal_activity/month-data",
    method: "GET",
    params: {
      month: month,
    },
    useAuth: true,
  });
  return res as MonthlyData[];
};

export const getOfficeDailyPenalties = async (days: number) => {
  const res = await apiClient({
    url: "/meal_activity/penalty",
    method: "GET",
    params: {
      days: days,
    },
    useAuth: true,
  });
  return res as OfficeDailyPenalties[];
};
export const getOfficeMonthlyPenalties = async (month: number) => {
  const res = await apiClient({
    url: "/meal_activity/month-penalty",
    method: "GET",
    params: {
      month: month,
    },
    useAuth: true,
  });
  return res as OfficeMonthlyPenalties[];
};

export const fetchPreferences = async (): Promise<Preference[]> => {
  try {
    const res = await apiClient({
      url: "/preference",
      method: "GET",
      useAuth: true,
    });
    return res as Preference[];
  } catch (error) {
    console.error("Error fetching preferences:", error);
    throw error;
  }
};

   
  // Fetch Departments
export const fetchDepartments = async (): Promise<Dept[]> => {
    const response = await apiClient({
      url: "/dept",
      method: "GET",
      useAuth: true,
    });
    return response as Dept[];
  };
  
  // Fetch Employees
  export const fetchEmployees = async (): Promise<Employee[]> => {
    const response = await apiClient({
      url: "/employee",
      method: "GET",
      useAuth: true,
    });
    return response as Employee[];
  };
  
  // Fetch Meal Data and Penalties
  export const fetchMealDataAndPenalties = async (
    firstDate: string,
    daysInMonth: number
  ): Promise<MealsResponse[]> => {
    const response = await apiClient({
      url: "/meal_activity/meal-summary",
      method: "PATCH",
      data: { start_date: firstDate, days: daysInMonth },
      useAuth: true,
    });
    return response as MealsResponse[];
  };
  
  // Add Employee
  export const addEmployee = async (newEmployee: FormData): Promise<Employee> => {
    const response = await apiClient({
      url: "/employee",
      method: "POST",
      data: newEmployee,
      headers: { "Content-Type": "multipart/form-data" },
      useAuth: true,
    });
    return response as Employee;
  };
  
  // Update Employee
  export const updateEmployee = async (formData: FormData): Promise<Employee> => {
    const response = await apiClient({
      url: "/employee",
      method: "PATCH",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      useAuth: true,
    });
    return response as Employee;
  };
  
  // Delete Employee
  export const deleteEmployee = async (employeeId: number): Promise<void> => {
    await apiClient({
      url: "/employee",
      method: "DELETE",
      params: { employee_id: employeeId },
      useAuth: true,
    });
  };

  export const getGuests = async () => {
    const res = await apiClient({
      url: "/employee/guest-list",
      method: "GET",
      useAuth: true, // assuming this tells the client to attach auth headers
    });
  
    return res as UserProfileDataType[];
  };
  
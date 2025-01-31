import axios from "axios";
import { UserProfileDataType } from "./types";
import { getSession } from "next-auth/react";
import { baseRequest } from "./HttpClientAPI";
import { EmployeeMealDetails } from "@/model/userMealActivity";
import { RangeMenuDetails } from "@/model/rangeMealPlan";

const BASE_URL=`${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance=axios.create({baseURL:BASE_URL});
const apiClient = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`)

console.log(BASE_URL)

export const getSingleEmployee=async(id:number)=>{
    return (await axiosInstance.get<UserProfileDataType[]>(`employee?employee_id=${id}`)).data;
}

export const getTokenSingleEmployee=async()=>{
    const session=await getSession();
    const token=session?.user?.accessToken;
    return (await axiosInstance.get<UserProfileDataType[]>('employee/profile', {
        headers: {
            Authorization: token,
        }
    })).data;
}

export const getSingleEmployeeMealActivity=async(date:string,days:string)=>{
    const res=await apiClient({
        url: "/meal_activity",
        method: "GET",
        params:{
            start:`${date}`,
            days: `${days}`
        },
        useAuth: true,
    })
    return res as EmployeeMealDetails[];
}

export const getRangeMealPlan=async(date:string,days:string)=>{
    const res=await apiClient({
        url: "/mealplan",
        method: "GET",
        params:{
            start:`${date}`,
            days: `${days}`
        }
    })
    return res as RangeMenuDetails[];
}

export const getEmployeePhoto=async()=>{
    const res=await apiClient({
        url: "/employee/photo",
        method: "GET",
        useAuth: true,
        responseType: "blob",
    })
    
    return res as Blob;
}

export const patchToggleDefaultMealStatus=async(date:string)=>{
    const res=await apiClient({
        url: "/employee/default-status",
        params:{
            date: `${date}`
        },
        method: "PATCH",
        useAuth: true,
    })
    return res;
}

export const patchEmployeeProfile=async(formData:FormData)=>{
    const res=await apiClient({
        url: "/employee",
        method: "PATCH",
        useAuth: true,
        data: formData,
    })
    return res;
}

export const patchGroupMealUpdate=async(mealData:any[])=>{
    const res=await apiClient({
        url: "meal_activity/group-update",
        method: "PATCH",
        useAuth: true,
        data: mealData,
    })
    return res;
}

export const patchForgetPassword=async(forgetPassData:object)=>{
    const res=await apiClient({
        url: "/employee/forget-password",
        data:forgetPassData,
        method: "PATCH",
    })
    return res;
}

export const patchResetPassword = async (data: object, token: string) => {
    return (
        await axiosInstance.patch('employee/password-change', data, {
            headers: {
                Authorization: `${token}`,
            },
        })
    ).data;
};
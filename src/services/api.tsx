import axios from "axios";
import { UserProfileDataType } from "./types";
import { getSession } from "next-auth/react";

const BASE_URL=`${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance=axios.create({baseURL:BASE_URL});

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

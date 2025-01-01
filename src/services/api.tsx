import axios from "axios";
import { UserProfileDataType } from "@/app/(user)/UserProfile/page";

const BASE_URL=`${process.env.BACKEND_URL}`;
const axiosInstance=axios.create({baseURL:BASE_URL});

export const getSingleEmployee=async(id:number)=>{
    return (await axiosInstance.get<UserProfileDataType>(`employee?employee_id=${id}`)).data;
}

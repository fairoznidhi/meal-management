import axios from "axios";
import { UserProfileDataType } from "@/types/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance = axios.create({ baseURL: BASE_URL });

console.log(BASE_URL);

// Fetch all employees
export const getAllEmployees = async () => {
  return (await axiosInstance.get<UserProfileDataType[]>(`/employee`)).data;
};


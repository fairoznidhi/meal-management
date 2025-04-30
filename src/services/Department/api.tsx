import axios from "axios";
import { baseRequest } from "../HttpClientAPI";
import { department } from "@/model/department";
const BASE_URL = `${process.env.NEXT_PUBLIC_PROXY_URL}`;
const axiosInstance = axios.create({ baseURL: BASE_URL });
const apiClient = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

export const getDepartments = async () => {
  const res = await apiClient({
    url: "/dept",
    method: "GET",
  });

  return res as department[];
};

export const patchCreateDepartment = async (data: object) => {
  const res = await apiClient({
    url: "/dept",
    data: data,
    method: "POST",
    useAuth:true
  });
  return res;
};

export const deleteDepartment = async (deptId: number) => {
    const res = await apiClient({
      url: `/dept`,
      method: "DELETE",
      params: { dept_id: deptId },
      useAuth: true,
    });
  
    return res;
  };

  export const patchUpdateDepartment = async (data: object) => {
    const res = await apiClient({
      url: "/dept",
      data: data,
      method: "PATCH",
      useAuth:true
    });
    return res;
  };
  
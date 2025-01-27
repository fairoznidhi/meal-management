
import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PROXY_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  const token = session?.user?.accessToken;
  console.log("Token:",token);
  
  if (token) {
    config.headers.Authorization = `${token}`;
  }

  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  console.log("Headers:",config.headers);
 

  return config;
});

export default axiosInstance;




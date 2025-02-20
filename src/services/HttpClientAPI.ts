import notificationToast from "@/components/notificationToast";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getSession, signOut, useSession } from "next-auth/react";
export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  useAuth?: boolean;
  isFormData?: boolean;
}
class HttpClient {
  private client: AxiosInstance;
  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });

    this.client.interceptors.request.use(
      async (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      async(response) => {
        // console.log("Res Interceptor response: ",response)
        if(response?.status === 401){
          await signOut();
          notificationToast("Token expired","error");
          window.location.href = "/login";
        }
        return response.data
      },
      async (error) => {
        if (error.response?.status === 401 || error.status===401) {
            await signOut();
            notificationToast("Token expired","error");
            window.location.href = "/login";
        }
        // console.log("Res Interceptor error: ", error);
        return Promise.reject(error);
      }
    );
  }
  async request<Q, R>(config: AxiosRequestConfig<Q> = {}): Promise<R> {
    return new Promise((resolve, reject) => {
      this.client
        .request(config)
        .then((resp: any) => {
          if (config.responseType === "blob") {
            resolve(resp);
          } else {
            resolve(resp);
          }
        })
        .catch((resp: AxiosResponse<R>) => reject(resp));
    });
  }
}

export default HttpClient;

export const baseRequest =
  (baseUrl: string) => async (reqConfig: ExtendedAxiosRequestConfig) => {
    const {
      url,
      method,
      data,
      params,
      useAuth = false,
      responseType,
      isFormData = false,
    } = reqConfig;
    const axiosClient = new HttpClient(baseUrl);
    const headers = reqConfig.headers || {};
    if (useAuth) {
      const session = await getSession();
      const authToken = session?.user?.accessToken;
      if (authToken) {
        headers.Authorization = authToken;
      }
      if (isFormData && data instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
      }
    }
    const res = await axiosClient.request({
      url,
      method,
      data,
      params,
      headers,
      responseType,
    });
    return res;
  };

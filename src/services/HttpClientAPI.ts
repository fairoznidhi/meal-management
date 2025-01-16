import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';
export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig{
  useAuth?:boolean ;
}
class HttpClient {
  private client:AxiosInstance;
  constructor(baseURL:string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
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
      (response) => response.data,
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  async request<Q, R>(config: AxiosRequestConfig<Q>={}):Promise<R> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.client.request(config).then((resp:any) => resolve(resp)).catch((resp:AxiosResponse<R>) => reject(resp));
    })
  }
  
}

export default HttpClient;

export const baseRequest = (baseUrl: string) => async(reqConfig:ExtendedAxiosRequestConfig) => {
  const {url,method,data,params,useAuth=false}=reqConfig;
  const axiosClient = new HttpClient(baseUrl)
  const headers = reqConfig.headers || {};
  if(useAuth){
    const session=await getSession();
    const authToken = session?.user?.accessToken;
    console.log("Token:",authToken);
    if(authToken){
      headers.Authorization=authToken;
    }
    console.log(headers);
  }
  const res=await axiosClient.request({url,method,data,params,headers});
  return res;
}
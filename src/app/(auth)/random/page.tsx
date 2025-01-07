"use client"
import HttpClient, { baseRequest } from '@/services/HttpClientAPI';
import React, { useEffect } from 'react';
// import { getSession } from 'next-auth/react';

// axios.interceptors.request.use(async(config) => {
//     const session=await getSession();
//     const authToken = session?.user?.accessToken;
//     if (authToken) {
//         console.log(authToken);
//       config.headers.Authorization = `${authToken}`;
//     }
//     return config;
//   });
const httpClient = new HttpClient(`${process.env.NEXT_PUBLIC_PROXY_URL}`);

const RandomPage = () => {
    // useEffect(()=>{
    //     axios.patch(`${process.env.NEXT_PUBLIC_PROXY_URL}/meal_activity`,{
    //         date: "2025-01-01",
    //         employee_id: 2,
    //         meal_type: 1,
    //         guest_count: 22})
    //     .then(response => {
    //     console.log(response.data);
    //     })
    //     .catch(error => {
    //     // Handle errors
    //     console.error('An error occurred:', error);
    //     });
    // },[])
    useEffect(()=>{
        async function fetchData(){
            const fetchRequest = baseRequest(`${process.env.NEXT_PUBLIC_PROXY_URL}`)
            const res=await fetchRequest({
                url: "/meal_activity",
                method: "PATCH",
                useAuth: true,
                data:{
                    date: "2025-01-01",
                    employee_id: 2,
                    meal_type: 1,
                    guest_count: 24
                }
            })
            console.log(res);
        }
        fetchData()
    },[])
    return (
        <div>
            
        </div>
    );
};

export default RandomPage;
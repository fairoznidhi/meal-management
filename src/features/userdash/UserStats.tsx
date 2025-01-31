"use client"
import { MealStatusContext } from "@/features/userdash/UserMealTable";
import { useSingleEmployeeMealActivity } from "@/services/queries";
import { format } from "date-fns";
import { useContext, useEffect } from "react";

const UserStats = () => {
    const {lunchStatus,setLunchStatus,snacksStatus,setSnacksStatus,mealStatusToggle,update}=useContext(MealStatusContext);
    const date=new Date();
    const today = format(date, "yyyy-MM-dd");
      const {data:todayData,refetch}=useSingleEmployeeMealActivity(today,'1');
      useEffect(()=>{
        if(todayData){
            const lunch=todayData[0].employee_details?.[0].meal?.[0].meal_status?.[0].status ?? false;
            const snacks=todayData[0].employee_details?.[0].meal?.[1].meal_status?.[0].status ?? false;
            setLunchStatus(lunch)
            setSnacksStatus(snacks);
        }
      },[todayData,update])
      useEffect(()=>{
        refetch();
        if(todayData){
        const lunch=todayData[0].employee_details?.[0].meal?.[0].meal_status?.[0].status ?? false;
        const snacks=todayData[0].employee_details?.[0].meal?.[1].meal_status?.[0].status ?? false;
        setLunchStatus(lunch)
        setSnacksStatus(snacks);
      }
      },[mealStatusToggle,update])
    return (
        <div className="stats shadow">
          <div className="stat place-items-center">
            <div className="stat-title">{`Today's Lunch`}</div>
            <div className={`stat-value ${lunchStatus ? 'text-green-600':'text-red-600'}`}>{lunchStatus ? 'ON' : 'OFF'}</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">{`Today's Snacks`}</div>
            <div className={`stat-value ${snacksStatus ? 'text-green-600':'text-red-600'}`}>{snacksStatus ? 'ON' : 'OFF'}</div>
          </div>
        </div>
    );
};

export default UserStats;
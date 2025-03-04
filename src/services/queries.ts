import { useQuery } from "@tanstack/react-query";
import { getEmployeePhoto, getExtraMeal, getMealSummaryGraph, getOfficeDailyPenalties, getOfficeMonthlyPenalties, getRangeMealPlan, getSingleEmployee, getSingleEmployeeMealActivity, getTokenSingleEmployee, getUserMonthlyData } from "./api";

export function useSingleEmployee(id: number) {
    return useQuery({
      queryKey: ["employee", { id }],
      queryFn: () => getSingleEmployee(id),
    });
  }
export function useTokenSingleEmployee(){
  return useQuery({
    queryKey: ['tokenEmployee'], 
    queryFn: () => getTokenSingleEmployee()
  });
}
export function useSingleEmployeeMealActivity(date:string,days:string){
  return useQuery({
    queryKey: ['tokenEmployeeMealActivity',`${date}${days}`], 
    queryFn: () => getSingleEmployeeMealActivity(date,days)
  });
}

export function useRangeMealPlan(date:string,days:string){
  return useQuery({
    queryKey: ['rangeMealPlan',`${date}${days}`], 
    queryFn: () => getRangeMealPlan(date,days),
    refetchInterval: 60000,
    refetchIntervalInBackground: true, 
  });
}
export function useEmployeePhoto(){
  return useQuery({
    queryKey: ['image'], 
    queryFn: getEmployeePhoto
  });
}

export function useExtraMeal(date:string){
  return useQuery({
    queryKey: ['extraMeal',date], 
    queryFn: () => getExtraMeal(date)
  });
}

export function useMealSummaryGraph(monthCount:number){
  return useQuery({
    queryKey: ['monthCount',monthCount], 
    queryFn: () => getMealSummaryGraph(monthCount)
  });
}

export function useUserMonthlyData(month:number){
  return useQuery({
    queryKey: ['userMonthlyData', month], 
    queryFn: () => getUserMonthlyData(month)
  });
}
export function useOfficeDailyPenalties(days:number){
  return useQuery({
    queryKey: ['officeDailyPenalty', days], 
    queryFn: () => getOfficeDailyPenalties(days)
  });
}
export function useOfficeMonthlyPenalties(month:number){
  return useQuery({
    queryKey: ['officeMonthlyPenalty', month], 
    queryFn: () => getOfficeMonthlyPenalties(month)
  });
}

import { useQuery } from "@tanstack/react-query";
import { getEmployeePhoto, getRangeMealPlan, getSingleEmployee, getSingleEmployeeMealActivity, getTokenSingleEmployee } from "./api";

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
    queryFn: () => getRangeMealPlan(date,days)
  });
}
export function useEmployeePhoto(){
  return useQuery({
    queryKey: ['image'], 
    queryFn: getEmployeePhoto
  });
}
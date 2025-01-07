import { useQuery } from "@tanstack/react-query";
import { getSingleEmployee, getTokenSingleEmployee } from "./api";

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
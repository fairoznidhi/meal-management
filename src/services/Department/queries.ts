import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "./api";

export function useDepartmentList(){
    return useQuery({
      queryKey: ['DepartmentList'], 
      queryFn: () => getDepartments()
    });
  }
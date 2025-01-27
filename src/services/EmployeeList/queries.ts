import { useQuery } from "@tanstack/react-query";
import { getAllEmployees } from "@/services/EmployeeList/api";

// Hook for fetching all employees
export function useAllEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
  });
}


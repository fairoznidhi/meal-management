import { useQuery } from "@tanstack/react-query";
import { getAllEmployees } from "@/services/EmployeeList/api";
import { getGuests } from "../api";

// Hook for fetching all employees
export function useAllEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
  });
}

export function useGuests() {
  return useQuery({
    queryKey: ["guests"],
    queryFn: getGuests,
  });
}


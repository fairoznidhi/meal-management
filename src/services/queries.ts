import { useQuery } from "@tanstack/react-query";
import { getSingleEmployee } from "./api";

export function useSingleEmployee(id: number) {
    return useQuery({
      queryKey: ["employee", { id }],
      queryFn: () => getSingleEmployee(id),
    });
  }
  
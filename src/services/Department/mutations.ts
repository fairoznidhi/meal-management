import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchCreateDepartment, patchUpdateDepartment } from "./api";

export function usePatchCreateDepartment() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: object) => patchCreateDepartment(data),
      onSuccess:()=>{
        queryClient.invalidateQueries({ queryKey: ['DepartmentList'] });
      }
    });
  }


  export function usePatchUpdateDepartment() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: object) => patchUpdateDepartment(data),
      onSuccess:()=>{
        queryClient.invalidateQueries({ queryKey: ['DepartmentList'] });
      }
    });
  }
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLateNotification,
  patchEmployeeProfile,
  patchExtraMeal,
  patchForgetPassword,
  patchGroupMealUpdate,
  patchResetPassword,
  patchToggleDefaultMealStatus,
  patchTotalLunchSnacksCount,
  patchTotalMealGroup,
  updateEmployee,
  deleteEmployee,
  addEmployeeAsGuestAPI,
  createMealPlan
} from "./api";
import { defaultStatus } from "@/model/employee";

export function useToggleDefaultMealStatus() {
  return useMutation({
    mutationFn: (data:defaultStatus) => patchToggleDefaultMealStatus(data),
    onSuccess: () => {
    },
    onError: (error) => {
      console.error("Error toggling meal preference:", error);
    },
  });
}
export function usePatchEmployeeProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => patchEmployeeProfile(formData),
    onSuccess: async () => {
      // await queryClient.invalidateQueries({queryKey:["image"]});
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });
}
export function usePatchGroupMealUpdate() {
  return useMutation({
    mutationFn: (data: any[]) => patchGroupMealUpdate(data),
    onSuccess: () => {
    },
    onError: (error) => {
      console.error("Error updating meal:", error);
    },
  });
}
export function usePatchForgetPassword() {
  return useMutation({
    mutationFn: (data: object) => patchForgetPassword(data),
    onSuccess: () => {
    },
    onError: (error) => {
      console.error("Error mail", error);
    },
  });
}

export function usePatchResetPassword() {
  return useMutation({
    mutationFn: ({ data, token }: { data: object; token: string }) =>
      patchResetPassword(data, token),
    onSuccess: () => {
    },
    onError: (error) => {
      console.error("Error password", error);
    },
  });
}

export function usePatchTotalMealGroup(
  date: string,
  meal_type: number,
  days: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => patchTotalMealGroup({ date, meal_type, days }),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["totalMealGroup", date, meal_type],
      });
    },
    onError: (error) => {
      console.error("Error updating mealgroup:", error);
    },
  });
}

export function usePatchTotalLunchSnacksCount(
  start_date: string,
  days: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => patchTotalLunchSnacksCount({ start_date, days }),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["totalMealCount", start_date],
      });
    },
    onError: (error) => {
      console.error("Error updating total meal:", error);
    },
  });
}

export function usePatchExtraMeal(date: string) {
  return useMutation({
    mutationFn: ({
      lunch_count,
      snack_count,
    }: {
      lunch_count: number;
      snack_count: number;
    }) => patchExtraMeal({ date, lunch_count, snack_count }),
    onSuccess: () => {
    },
    onError: (error) => {
      console.error("Error updating extra meal:", error);
    },
  });
}

export function useToggleEmployeeStatus() {
  return useMutation({
    mutationFn: ({
      employeeId,
      isActive,
    }: {
      employeeId: number;  
      isActive: boolean; 
    }) => {
      const formData = new FormData();
      formData.append("employee_id", employeeId.toString()); 
      formData.append("is_active", isActive.toString());
      return updateEmployee(formData); 
    },
    onSuccess: (data) => {
      //console.log("Employee status updated:", data);
    },
    onError: (error) => {
      //console.error("Error updating employee status:", error);
    },
  });
};

export function useGetLateNotification() {
  return useMutation({
    mutationFn: (meal_type:number) =>
      getLateNotification(meal_type),
    onSuccess: () => {
    },
    onError: (error) => {
      console.error("Error Notification", error);
    },
  });
}
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: number) => deleteEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
    onError: (error) => {
     
    },
  });
};



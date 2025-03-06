import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchEmployeeProfile, patchExtraMeal, patchForgetPassword, patchGroupMealUpdate, patchResetPassword, patchToggleDefaultMealStatus, patchTotalLunchSnacksCount, patchTotalMealGroup } from "./api";

export function useToggleDefaultMealStatus(date:string,status:boolean) {
    return useMutation({
        mutationFn: ()=>patchToggleDefaultMealStatus(date,status),
        onSuccess: () => {
          console.log("Meal preference toggled successfully");
        },
        onError: (error) => {
          console.error("Error toggling meal preference:", error);
        },
  
    });
  }
  export function usePatchEmployeeProfile() {
    const queryClient=useQueryClient();
    return useMutation({
      mutationFn: (formData: FormData) => patchEmployeeProfile(formData),
      onSuccess: async() => {
        // await queryClient.invalidateQueries({queryKey:["image"]});
        console.log("Profile updated successfully");
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
      },
    });
  }
  export function usePatchGroupMealUpdate() {
    return useMutation({
      mutationFn: (data:any[]) => patchGroupMealUpdate(data),
      onSuccess: () => {
        console.log("Meal Updated Succesfully");
      },
      onError: (error) => {
        console.error("Error updating meal:", error);
      },
    });
  }
  export function usePatchForgetPassword() {
    return useMutation({
      mutationFn: (data:object) => patchForgetPassword(data),
      onSuccess: () => {
        console.log("Mail sent");
      },
      onError: (error) => {
        console.error("Error mail", error);
      },
    });
  }

  export function usePatchResetPassword() {
    return useMutation({
      mutationFn: ({ data, token }: { data: object; token: string }) => patchResetPassword(data,token),
      onSuccess: () => {
        console.log("Password Updated");
      },
      onError: (error) => {
        console.error("Error password", error);
      },
    });
  }

  export function usePatchTotalMealGroup(date:string,meal_type:number,days:number) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: () => patchTotalMealGroup({date,meal_type,days}),
      onSuccess: async() => {
        console.log("MealGroupUpdated Successfully");
        queryClient.invalidateQueries({ queryKey: ["totalMealGroup", date, meal_type] });
      },
      onError: (error) => {
        console.error("Error updating mealgroup:", error);
      },
    });
  }

  export function usePatchTotalLunchSnacksCount(start_date:string,days:number) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: () => patchTotalLunchSnacksCount({start_date,days}),
      onSuccess: async() => {
        console.log("Total Meal Count fetched Successfully");
        queryClient.invalidateQueries({ queryKey: ["totalMealCount", start_date] });
      },
      onError: (error) => {
        console.error("Error updating total meal:", error);
      },
    });
  }

  export function usePatchExtraMeal(date:string){
    return useMutation({
      mutationFn: (count:number) => patchExtraMeal({date,count}),
      onSuccess: () => {
        console.log("Extra meal updated successfully");
      },
      onError: (error) => {
        console.error("Error updating extra meal:", error);
      },
    });
  }

  

